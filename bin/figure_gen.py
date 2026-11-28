#!/usr/bin/env python3
"""Generate an Excalidraw file and a matching SVG from one JSON diagram spec.

    python3 -I bin/figure_gen.py SPEC.json [--out DIR] [--preview] [--check-only]

SPEC.json (all coordinates in pixels, origin top-left):
  {
    "slug": "p3-example",                  # output file stem
    "width": 1200, "height": 700,          # optional; computed from the content when missing
    "elements": [
      {"id": "git", "type": "box", "x": 40, "y": 100, "w": 140, "h": 70,
       "label": "Git\\nrepository", "style": "git"},
      {"id": "t1", "type": "text", "x": 40, "y": 300, "text": "A note", "fs": 15, "color": "muted"},
      {"id": "e1", "type": "arrow", "from": "git", "to": "hub", "kind": "pull", "label": "pull source"}
    ],
    "legend": [{"kind": "pull", "text": "pull: fetch desired state"}]    # optional legend bar
  }

box     x y w h label style [fs=16] [valign=middle|top] [dashed] [sw=2]
        styles: git hub cluster controller agent store danger ok note neutral panel
        (panel and cluster are large frames drawn behind their contents; list them first)
text    x y text [fs=14] [color=ink|muted|blue|orange|green|purple|red] [align=left|center] [w]
        with w, the text is aligned inside [x, x+w]
arrow   from to [kind=pull|apply|connect|flow|write|delete|watch] [label] [double]
        [from_side/to_side=auto|left|right|top|bottom] [from_at/to_at=0..1 along the side]
        [via=[[x,y],...] waypoints] [label_dx label_dy | label_pos=[x,y]] [sw=3]

Labels are word-wrapped to the box width. The checker reports: boxes that partly overlap,
labels that overflow their box, free text or arrow labels that hit a box, arrows that cross a
box that is neither endpoint nor a container, arrows with unknown endpoints, content outside the
canvas. Errors exit with status 1; warnings are printed. --preview renders a PNG with qlmanage.
"""
import html
import json
import os
import random
import subprocess
import sys

FONT = "Helvetica, Arial, sans-serif"
CW = 0.55          # average glyph width as a fraction of the font size (conservative)

STYLES = {
    "git": ("#fff3bf", "#f08c00", False), "hub": ("#d0ebff", "#1971c2", False),
    "cluster": ("#e6fcf5", "#099268", True), "controller": ("#f3d9fa", "#9c36b5", False),
    "agent": ("#ffe8cc", "#e8590c", False), "store": ("#e3fafc", "#0c8599", False),
    "danger": ("#ffe3e3", "#e03131", False), "ok": ("#d3f9d8", "#2f9e44", False),
    "note": ("#fff9db", "#fab005", False), "neutral": ("#ffffff", "#495057", False),
    "panel": ("#f8f9fa", "#adb5bd", False),
}
ARROWS = {
    "pull": ("#495057", True), "apply": ("#1971c2", False), "connect": ("#e8590c", False),
    "flow": ("#343a40", False), "write": ("#099268", False), "delete": ("#e03131", False),
    "watch": ("#9c36b5", True),
}
TEXT_COLORS = {"ink": "#1e1e1e", "muted": "#495057", "blue": "#1971c2", "orange": "#e8590c",
               "green": "#099268", "purple": "#9c36b5", "red": "#e03131"}
MARKER = {"#495057": "gray", "#1971c2": "blue", "#e8590c": "orange", "#343a40": "dark",
          "#099268": "green", "#e03131": "red", "#9c36b5": "purple"}


def wrap(label, fs, maxw):
    out = []
    for line in str(label).split("\n"):
        words, cur = line.split(" "), ""
        for w in words:
            t = (cur + " " + w).strip()
            if len(t) * fs * CW <= maxw or not cur:
                cur = t
            else:
                out.append(cur)
                cur = w
        out.append(cur)
    return out


def tw(lines, fs):
    return max(len(l) for l in lines) * fs * CW


def th(lines, fs):
    return len(lines) * fs * 1.25


class Fig:
    def __init__(self, spec):
        self.spec = spec
        self.els = []        # excalidraw elements
        self.svg = []
        self.boxes = {}      # id -> dict(x,y,w,h,style,el)
        self.rects = []      # (kind, id, x0,y0,x1,y1) for checks
        self.issues = []     # (level, msg)
        self.n = 0
        random.seed(11)

    def nid(self, p):
        self.n += 1
        return f"{p}-{self.n}"

    def base(self, t, x, y, w, h, **kw):
        e = {"id": kw.pop("id"), "type": t, "x": x, "y": y, "width": w, "height": h, "angle": 0,
             "strokeColor": kw.pop("stroke", "#1e1e1e"), "backgroundColor": kw.pop("fill", "transparent"),
             "fillStyle": "solid", "strokeWidth": kw.pop("sw", 2), "strokeStyle": kw.pop("sstyle", "solid"),
             "roughness": 0, "opacity": 100, "groupIds": [], "frameId": None, "roundness": kw.pop("roundness", None),
             "seed": random.randint(1, 2**31 - 1), "version": 3, "versionNonce": random.randint(1, 2**31 - 1),
             "isDeleted": False, "boundElements": [], "updated": 1, "link": None, "locked": False}
        e.update(kw)
        return e

    def text(self, x, y, lines, fs, color, align="left", container=None, w=None):
        s = "\n".join(lines)
        width = tw(lines, fs)
        if w is not None:
            x = x + (w - width) / 2 if align == "center" else x
        e = self.base("text", x, y, width, th(lines, fs), id=self.nid("t"), stroke=color)
        e.update({"text": s, "fontSize": fs, "fontFamily": 2, "textAlign": align, "verticalAlign": "top",
                  "containerId": container, "originalText": s, "autoResize": True, "lineHeight": 1.25,
                  "baseline": int(fs)})
        self.els.append(e)
        anchor = {"left": "start", "center": "middle", "right": "end"}[align]
        ax = x if align == "left" else (x + width / 2 if align == "center" else x + width)
        tsp = "".join(f'<tspan x="{ax:.1f}" dy="{0 if i == 0 else fs * 1.25:.1f}">{html.escape(l)}</tspan>'
                      for i, l in enumerate(lines))
        self.svg.append(f'<text x="{ax:.1f}" y="{y + fs:.1f}" font-family="{FONT}" font-size="{fs}" '
                        f'fill="{color}" text-anchor="{anchor}">{tsp}</text>')
        return e, (x, y, x + width, y + th(lines, fs))

    # ------------------------------------------------------------ elements
    def box(self, d):
        x, y, w, h = d["x"], d["y"], d["w"], d["h"]
        fill, stroke, dashed = STYLES[d.get("style", "neutral")]
        dashed = d.get("dashed", dashed)
        sw = d.get("sw", 2)
        e = self.base("rectangle", x, y, w, h, id=self.nid("r"), stroke=stroke, fill=fill, sw=sw,
                      sstyle="dashed" if dashed else "solid", roundness={"type": 3})
        self.els.append(e)
        dash = ' stroke-dasharray="8 6"' if dashed else ""
        self.svg.append(f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="10" fill="{fill}" '
                        f'stroke="{stroke}" stroke-width="{sw}"{dash}/>')
        info = {"x": x, "y": y, "w": w, "h": h, "style": d.get("style", "neutral"), "el": e, "id": d["id"]}
        self.boxes[d["id"]] = info
        label = d.get("label", "")
        if label:
            fs = d.get("fs", 16)
            valign = d.get("valign", "middle")
            lines = wrap(label, fs, w - 20 if valign == "middle" else w - 24)
            if tw(lines, fs) > w - 8 or th(lines, fs) > h - 8:
                self.issues.append(("ERROR", f"label of box '{d['id']}' overflows its box ({w}x{h})"))
            color = TEXT_COLORS.get(d.get("color", "ink"), "#1e1e1e")
            if valign == "middle":
                t, _ = self.text(x, y + (h - th(lines, fs)) / 2, lines, fs, color, "center", e["id"], w=w)
            else:
                t, _ = self.text(x + 12, y + 8, lines, fs, color, "left", e["id"])
            e["boundElements"].append({"id": t["id"], "type": "text"})
        return info

    def side_point(self, b, side, at):
        x, y, w, h = b["x"], b["y"], b["w"], b["h"]
        return {"left": (x, y + h * at), "right": (x + w, y + h * at),
                "top": (x + w * at, y), "bottom": (x + w * at, y + h)}[side]

    def arrow(self, d):
        a, b = self.boxes.get(d["from"]), self.boxes.get(d["to"])
        if not a or not b:
            self.issues.append(("ERROR", f"arrow {d['from']}->{d['to']} has an unknown endpoint"))
            return
        via = d.get("via") or []

        def auto(src, dst_xy):
            cx, cy = src["x"] + src["w"] / 2, src["y"] + src["h"] / 2
            dx, dy = dst_xy[0] - cx, dst_xy[1] - cy
            return ("right" if dx > 0 else "left") if abs(dx) * 0.6 >= abs(dy) else ("bottom" if dy > 0 else "top")

        tgt_c = (b["x"] + b["w"] / 2, b["y"] + b["h"] / 2)
        src_c = (a["x"] + a["w"] / 2, a["y"] + a["h"] / 2)
        fs_ = d.get("from_side", "auto")
        ts_ = d.get("to_side", "auto")
        fs_ = auto(a, via[0] if via else tgt_c) if fs_ == "auto" else fs_
        ts_ = auto(b, via[-1] if via else src_c) if ts_ == "auto" else ts_
        p0 = self.side_point(a, fs_, d.get("from_at", 0.5))
        p1 = self.side_point(b, ts_, d.get("to_at", 0.5))
        pts = [p0] + [tuple(v) for v in via] + [p1]
        color, dashed = ARROWS[d.get("kind", "flow")]
        sw = d.get("sw", 3)
        xs, ys = [p[0] for p in pts], [p[1] for p in pts]
        e = self.base("arrow", pts[0][0], pts[0][1], max(xs) - min(xs), max(ys) - min(ys), id=self.nid("a"),
                      stroke=color, sw=sw, sstyle="dashed" if dashed else "solid", roundness={"type": 2})
        e.update({"points": [[p[0] - pts[0][0], p[1] - pts[0][1]] for p in pts], "lastCommittedPoint": None,
                  "startBinding": {"elementId": a["el"]["id"], "focus": 0, "gap": 4},
                  "endBinding": {"elementId": b["el"]["id"], "focus": 0, "gap": 4},
                  "startArrowhead": "arrow" if d.get("double") else None, "endArrowhead": "arrow", "elbowed": False})
        self.els.append(e)
        a["el"]["boundElements"].append({"id": e["id"], "type": "arrow"})
        b["el"]["boundElements"].append({"id": e["id"], "type": "arrow"})
        mk = MARKER[color]
        dash = ' stroke-dasharray="9 7"' if dashed else ""
        ps = " ".join(f"{p[0]:.1f},{p[1]:.1f}" for p in pts)
        ms = f' marker-start="url(#m-{mk})"' if d.get("double") else ""
        self.svg.append(f'<polyline points="{ps}" fill="none" stroke="{color}" stroke-width="{sw}"{dash} '
                        f'marker-end="url(#m-{mk})"{ms}/>')
        self.rects.append(("arrow", d["from"] + ">" + d["to"], pts, (d["from"], d["to"])))
        if d.get("label"):
            fs = d.get("label_fs", 14)
            lines = d["label"].split("\n")
            if "label_pos" in d:
                lx, ly = d["label_pos"]
            else:
                mi = len(pts) // 2
                mx = (pts[mi - 1][0] + pts[mi][0]) / 2 if len(pts) % 2 == 0 else pts[mi][0]
                my = (pts[mi - 1][1] + pts[mi][1]) / 2 if len(pts) % 2 == 0 else pts[mi][1]
                lx = mx - tw(lines, fs) / 2 + d.get("label_dx", 0)
                ly = my - th(lines, fs) - 6 + d.get("label_dy", 0)
            _, bb = self.text(lx, ly, lines, fs, color if color != "#343a40" else "#495057")
            self.rects.append(("label", d["label"], bb, None))

    def free(self, d):
        fs = d.get("fs", 14)
        lines = d["text"].split("\n")
        _, bb = self.text(d["x"], d["y"], lines, fs, TEXT_COLORS.get(d.get("color", "muted"), "#495057"),
                          d.get("align", "left"), w=d.get("w"))
        self.rects.append(("text", d.get("id", d["text"][:20]), bb, None))

    # ------------------------------------------------------------ checks
    def check(self):
        bx = [(i, b["x"], b["y"], b["x"] + b["w"], b["y"] + b["h"]) for i, b in self.boxes.items()]

        def inter(a, b):
            return a[0] < b[2] and b[0] < a[2] and a[1] < b[3] and b[1] < a[3]

        def contains(o, i, m=-1):
            return o[0] <= i[0] - m and o[1] <= i[1] - m and o[2] >= i[2] + m and o[3] >= i[3] + m

        containers = set()
        for i, *a in bx:
            for j, *b in bx:
                if i != j and contains(tuple(a), tuple(b)):
                    containers.add(i)
        for n, (i, *a) in enumerate(bx):
            for j, *b in bx[n + 1:]:
                a_, b_ = tuple(a), tuple(b)
                if inter(a_, b_) and not contains(a_, b_) and not contains(b_, a_):
                    self.issues.append(("ERROR", f"boxes '{i}' and '{j}' partly overlap"))
        for kind, name, geom, ends in self.rects:
            if kind in ("text", "label"):
                for i, *r in bx:
                    r = tuple(r)
                    if inter(geom, r) and not contains(r, geom):
                        self.issues.append(("ERROR", f"{kind} '{str(name)[:30]}' overlaps the edge of box '{i}'"))
                    elif inter(geom, r) and contains(r, geom) and i not in containers and self.boxes[i]["style"] != "panel":
                        self.issues.append(("WARN", f"{kind} '{str(name)[:30]}' sits on top of box '{i}'"))
            if kind == "arrow":
                for k in range(len(geom) - 1):
                    (x0, y0), (x1, y1) = geom[k], geom[k + 1]
                    for i, *r in bx:
                        if i in ends or i in containers:
                            continue
                        steps = 40
                        for s in range(1, steps):
                            px, py = x0 + (x1 - x0) * s / steps, y0 + (y1 - y0) * s / steps
                            if r[0] + 2 < px < r[2] - 2 and r[1] + 2 < py < r[3] - 2:
                                self.issues.append(("ERROR", f"arrow {name} crosses box '{i}'"))
                                break

    # ------------------------------------------------------------ build + write
    def build(self, out_dir):
        sp = self.spec
        for d in sp["elements"]:
            t = d["type"]
            if t == "box":
                self.box(d)
            elif t == "text":
                self.free(d)
            elif t == "arrow":
                self.arrow(d)
            else:
                self.issues.append(("ERROR", f"unknown element type {t}"))
        self.check()
        W = sp.get("width") or 0
        H = sp.get("height") or 0
        ext = [(e["x"] + e["width"], e["y"] + e["height"]) for e in self.els if e["type"] != "arrow"]
        for e in self.els:
            if e["type"] == "arrow":
                ext += [(e["x"] + p[0], e["y"] + p[1]) for p in e["points"]]
        cw = max([p[0] for p in ext] + [0]) + 10
        ch = max([p[1] for p in ext] + [0]) + 10
        W, H = W or int(cw), H or int(ch)
        if cw > W + 1 or ch > H + 1:
            self.issues.append(("ERROR", f"content ({int(cw)}x{int(ch)}) exceeds the canvas ({W}x{H})"))
        leg = sp.get("legend")
        if leg:
            ly = H + 10
            self.box({"id": "legend", "type": "box", "x": 20, "y": ly, "w": W - 40, "h": 64, "style": "neutral"})
            x = 40
            for it in leg:
                color, dashed = ARROWS[it["kind"]]
                self.boxes["_l1"] = {"x": x, "y": ly + 32, "w": 0, "h": 0, "el": self.base("rectangle", x, ly, 0, 0, id=self.nid("r")), "style": "neutral", "id": "_l1"}
                self.boxes["_l2"] = {"x": x + 60, "y": ly + 32, "w": 0, "h": 0, "el": self.base("rectangle", x + 60, ly, 0, 0, id=self.nid("r")), "style": "neutral", "id": "_l2"}
                self.arrow({"from": "_l1", "to": "_l2", "kind": it["kind"], "from_side": "right", "to_side": "left", "sw": 3})
                self.free({"x": x + 72, "y": ly + 22, "text": it["text"], "fs": it.get("fs", 14), "color": "ink"})
                x += 72 + len(it["text"]) * it.get("fs", 14) * CW + 40
            self.els = [e for e in self.els if not (e["type"] == "rectangle" and e["width"] == 0)]
            H = H + 84
        os.makedirs(out_dir, exist_ok=True)
        slug = sp["slug"]
        doc = {"type": "excalidraw", "version": 2, "source": "https://excalidraw.com", "elements": self.els,
               "appState": {"gridSize": None, "viewBackgroundColor": "#ffffff"}, "files": {}}
        ids = [e["id"] for e in self.els]
        assert len(ids) == len(set(ids)), "duplicate element ids"
        json.dump(doc, open(os.path.join(out_dir, slug + ".excalidraw"), "w"), indent=2)
        markers = "".join(
            f'<marker id="m-{n}" viewBox="0 0 10 10" refX="9" refY="5" markerUnits="userSpaceOnUse" markerWidth="16" '
            f'markerHeight="16" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 z" fill="{c}"/></marker>'
            for c, n in MARKER.items())
        alt = html.escape(sp.get("alt", sp.get("title", slug)))
        head = (f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" viewBox="0 0 {W} {H}" role="img" '
                f'aria-label="{alt}"><title>{html.escape(sp.get("title", slug))}</title><defs>{markers}</defs>'
                f'<rect width="{W}" height="{H}" fill="#ffffff"/>')
        open(os.path.join(out_dir, slug + ".svg"), "w").write(head + "".join(self.svg) + "</svg>\n")
        return W, H


def main(argv):
    if len(argv) < 2 or argv[1] in ("-h", "--help"):
        print(__doc__)
        return 0
    spec = json.load(open(argv[1]))
    out = "outputs/figures"
    if "--out" in argv:
        out = argv[argv.index("--out") + 1]
    fig = Fig(spec)
    W, H = fig.build("/tmp/figgen-check" if "--check-only" in argv else out)
    errs = [m for lv, m in fig.issues if lv == "ERROR"]
    for lv, m in fig.issues:
        print(f"{lv}: {m}")
    print(f"{spec['slug']}: {len(fig.els)} elements, canvas {W}x{H}, {len(errs)} errors, {len(fig.issues) - len(errs)} warnings")
    if "--preview" in argv:
        d = "/tmp/figprev"
        os.makedirs(d, exist_ok=True)
        svg = os.path.join("/tmp/figgen-check" if "--check-only" in argv else out, spec["slug"] + ".svg")
        # qlmanage renders a square thumbnail at a fixed scale, so wrap the drawing in a square
        # canvas of side max(W, H) and ask for exactly that size; the whole figure then fits.
        m = max(W, H)
        sq = os.path.join(d, spec["slug"] + "-sq.svg")
        txt = open(svg).read().replace(f'width="{W}" height="{H}" viewBox="0 0 {W} {H}"',
                                       f'width="{m}" height="{m}" viewBox="0 0 {m} {m}"', 1)
        open(sq, "w").write(txt)
        subprocess.run(["qlmanage", "-t", "-s", str(m), "-o", d, sq], capture_output=True)
        print("preview:", os.path.join(d, spec["slug"] + "-sq.svg.png"))
    return 1 if errs else 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))
