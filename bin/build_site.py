#!/usr/bin/env python3
"""
build_site.py — Generate a Just-the-Docs Jekyll tree from a sticki-wiki (git.soma GHES /
github.com project sites). Source of truth is the Obsidian vault (wikilinks intact).

Safety-first design:
  - Output is confined to <wiki>/build (or an explicit --out that is inside the wiki root or
    a fresh / publisher-marked dir); the tree is never recursively deleted unless it carries
    the publisher marker. Symlinked output paths are refused.
  - Link rewriting resolves relative targets against the WIKI ROOT (not the process CWD) and
    only touches prose — never content inside fenced/inline code or HTML comments.
  - Same-page and cross-page anchor wikilinks are supported: [[#h]], [[page#h]], [[#h|alias]].
  - Discovery skips symlinks and, by default, pages with status: draft|superseded|archived.
  - --strict makes unresolved / ambiguous / residual [[...]] links a build FAILURE (exit 2),
    so no publish path deploys a broken site.

Host/owner/repo/branch derive from `git remote` (SSH + HTTPS; detached HEAD → commit SHA);
all overridable via .sticki-publish.json. Stdlib only.

Usage:
  python3 build_site.py [--wiki <root>] [--out <dir>] [--strict]
"""

import argparse
import json
import re
import subprocess
import sys
import shutil
from pathlib import Path

ANCHOR_FILES = {"index.md", "log.md", "irrefutable-facts.md", "open-knowledge-gaps.md",
                "purpose.md", "todo.md", "CLAUDE.md", "README.md", "SESSION_RESUME.md"}
TOOLING_DIRS = {".git", "build", "_site", "vendor", ".obsidian", ".github", "bin",
                "scripts", "node_modules", "assets", ".session-archive"}
DEFAULT_EXCLUDE_DIRS = {"raw", "sources"}
FEATURE_DIR_DEFAULT = "outputs"
SKIP_STATUS = {"draft", "superseded", "archived"}
BUILD_MARKER = ".sticki-publish-build"

# info anchors publishable ONLY when opted in (may contain sensitive/unresolved material)
INFO_PAGES = {
    "open-knowledge-gaps.md": ("Open Questions", "/open-questions/", 90, None),
    "purpose.md": ("Purpose", "/about/purpose/", 1, "About"),
    "irrefutable-facts.md": ("Irrefutable Facts", "/about/irrefutable-facts/", 2, "About"),
}

ALERT_START_RE = re.compile(r"^>\s*\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]\s*$", re.I)
ALERT_MAP = {"note": "note", "tip": "tip", "important": "important",
             "warning": "warning", "caution": "warning"}
# target may be empty (same-page anchor): [[#h]], [[page#h]], [[page]], [[page|alias]]
WIKILINK_RE = re.compile(r"\[\[([^\]|#]*)(?:#([^\]|]+))?(?:\|([^\]]+))?\]\]")
MDLINK_RE = re.compile(r"\[([^\]]+)\]\((?!https?://|\{\{|#|mailto:)([^)]+?\.md)(?:#([^)]+))?\)")
# relative non-md, non-anchor asset links (images/pdfs/etc.) -> source blob
ASSETLINK_RE = re.compile(r"(!?)\[([^\]]*)\]\((?!https?://|\{\{|#|mailto:)([^)]+?\.[a-zA-Z0-9]+)(#[^)]+)?\)")


def sh(*args):
    try:
        return subprocess.check_output(args, text=True, stderr=subprocess.DEVNULL).strip()
    except Exception:
        return ""


def derive_repo(wiki):
    url = sh("git", "-C", str(wiki), "config", "--get", "remote.origin.url")
    host = owner = repo = ""
    if url:
        m = (re.match(r"git@([^:]+):([^/]+)/(.+?)(?:\.git)?$", url)
             or re.match(r"ssh://git@([^/]+)/([^/]+)/(.+?)(?:\.git)?$", url)
             or re.match(r"https?://(?:[^@]+@)?([^/]+)/([^/]+)/(.+?)(?:\.git)?$", url))
        if m:
            host, owner, repo = m.group(1), m.group(2), m.group(3)
    branch = sh("git", "-C", str(wiki), "rev-parse", "--abbrev-ref", "HEAD")
    if branch in ("", "HEAD"):  # detached: pin to the commit SHA for immutable blob links
        branch = sh("git", "-C", str(wiki), "rev-parse", "HEAD") or "main"
    return host, owner, repo, branch


def load_config(wiki):
    f = wiki / ".sticki-publish.json"
    if f.is_file():
        try:
            cfg = json.loads(f.read_text())
        except json.JSONDecodeError as e:
            sys.exit(f"[build_site] invalid .sticki-publish.json: {e}")
        if not isinstance(cfg, dict):
            sys.exit("[build_site] .sticki-publish.json must be a JSON object")
    else:
        cfg = {}
    host, owner, repo, branch = derive_repo(wiki)
    cfg.setdefault("host", host)
    cfg.setdefault("owner", owner)
    cfg.setdefault("repo", repo)
    cfg.setdefault("branch", branch or "main")
    is_ghc = cfg["host"] == "github.com" or str(cfg["host"]).endswith(".github.com")
    if "baseurl" not in cfg:
        cfg["baseurl"] = ((f"/{cfg['repo']}" if is_ghc else f"/pages/{cfg['owner']}/{cfg['repo']}")
                          if cfg["repo"] else "")
    if "url" not in cfg:
        # github.com project site is served from owner.github.io, NOT github.com
        cfg["url"] = (f"https://{cfg['owner']}.github.io" if is_ghc and cfg["owner"]
                      else (f"https://{cfg['host']}" if cfg["host"] else ""))
    if "blob_base" not in cfg:
        cfg["blob_base"] = (f"https://{cfg['host']}/{cfg['owner']}/{cfg['repo']}/blob/{cfg['branch']}"
                            if cfg["host"] and cfg["repo"] else "")
    cfg.setdefault("title", (cfg.get("repo") or "Wiki").replace("-", " ").title())
    cfg.setdefault("description", "Knowledge base.")
    cfg.setdefault("include_sources", False)
    cfg.setdefault("publish_info_pages", False)   # open-questions/purpose/facts: opt-in
    cfg.setdefault("publish_status", sorted({"active", "stale", "contradicted"}))
    cfg.setdefault("feature_dir", FEATURE_DIR_DEFAULT)
    cfg.setdefault("exclude_dirs", [])
    cfg.setdefault("publish_dirs", [])            # explicit allowlist; [] = auto-discover
    if not isinstance(cfg["exclude_dirs"], list) or not isinstance(cfg["publish_dirs"], list):
        sys.exit("[build_site] exclude_dirs / publish_dirs must be JSON arrays")
    return cfg


# ---- fence-aware prose segmentation -----------------------------------------

FENCE_RE = re.compile(r"^\s{0,3}(```+|~~~+)")


def prose_spans(body):
    """Yield (text, is_prose) segments so rewrites skip fenced code + HTML comments."""
    lines = body.split("\n")
    segs, buf, fence = [], [], None
    in_comment = False

    def flush(is_prose):
        if buf:
            segs.append(("\n".join(buf), is_prose))
            buf.clear()

    for ln in lines:
        if in_comment:
            buf.append(ln)
            if "-->" in ln:
                flush(False); in_comment = False
            continue
        if fence is not None:
            buf.append(ln)
            if ln.lstrip().startswith(fence):
                flush(False); fence = None
            continue
        fm = FENCE_RE.match(ln)
        if fm:
            flush(True)
            fence = "~~~" if fm.group(1).startswith("~") else "```"
            buf.append(ln)
            continue
        if ln.lstrip().startswith("<!--") and "-->" not in ln:
            flush(True); in_comment = True; buf.append(ln); continue
        buf.append(ln)
    flush(fence is None and not in_comment)
    return segs


def protect_inline_code(text, fn):
    """Apply fn to text but leave `inline code` spans untouched."""
    out, i = [], 0
    for m in re.finditer(r"`[^`]*`", text):
        out.append(fn(text[i:m.start()]))
        out.append(m.group(0))
        i = m.end()
    out.append(fn(text[i:]))
    return "".join(out)


def split_fm(text):
    if text.startswith("---\n"):
        end = text.find("\n---\n", 4)
        if end != -1:
            return text[4:end], text[end + 5:]
    return None, text


def fm_get(fm, key):
    if not fm:
        return None
    m = re.search(rf"^{key}:\s*(.+?)\s*$", fm, re.M)
    return m.group(1).strip().strip('"').strip("'") if m else None


def get_title(fm, body, fallback):
    t = fm_get(fm, "title")
    if t:
        return t
    m = re.search(r"^#\s+(.+?)\s*$", body, re.M)
    return m.group(1).strip() if m else fallback


def strip_leading_h1(body):
    out, removed = [], False
    for ln in body.splitlines(keepends=True):
        if not removed and re.match(r"^#\s+\S", ln):
            removed = True
            continue
        out.append(ln)
    return "".join(out)


def yesc(s):
    return '"' + str(s).replace('\\', '\\\\').replace('"', '\\"') + '"'


def is_symlinked(path, root):
    """True if path or any component between root and path is a symlink."""
    p = Path(path)
    root = Path(root).resolve()
    try:
        rel = p.resolve().relative_to(root)
    except ValueError:
        return True  # escapes the wiki root
    cur = root
    for part in rel.parts:
        cur = cur / part
        if cur.is_symlink():
            return True
    return False


class Builder:
    def __init__(self, wiki, out, cfg, strict):
        self.wiki, self.out, self.cfg, self.strict = wiki, out, cfg, strict
        self.sections = self._discover_sections()
        self.by_path, self.by_base = {}, {}
        self.warnings = []
        self._index()

    def _publishable(self, path):
        """A content .md file that should be published (status filter, symlink guard)."""
        if is_symlinked(path, self.wiki):
            self.warnings.append(f"skip symlink: {path.relative_to(self.wiki)}")
            return False
        fm, _ = split_fm(path.read_text(encoding="utf-8"))
        st = fm_get(fm, "status")
        if st is not None and st not in self.cfg["publish_status"]:
            return False
        return True

    def _discover_sections(self):
        excl = set(DEFAULT_EXCLUDE_DIRS) | set(TOOLING_DIRS) | set(self.cfg["exclude_dirs"])
        if self.cfg["include_sources"]:
            excl.discard("sources")
        allow = set(self.cfg["publish_dirs"])
        dirs = []
        for d in sorted(p for p in self.wiki.iterdir() if p.is_dir() and not p.is_symlink()):
            if d.name in excl or d.name.startswith("."):
                continue
            if allow and d.name not in allow:
                continue
            if any(f.suffix == ".md" and not f.is_symlink() for f in d.glob("*.md")):
                dirs.append(d.name)
        preferred = [self.cfg["feature_dir"], "decisions", "findings", "comparisons", "concepts",
                     "entities", "people", "companies", "papers", "examples", "methodologies",
                     "methodology", "theses"]
        ordered = [d for d in preferred if d in dirs] + [d for d in dirs if d not in preferred]
        return [(d, d.replace("-", " ").title(), i) for i, d in enumerate(ordered, start=1)]

    def _add(self, noext, info):
        self.by_path[noext] = info
        self.by_base.setdefault(noext.split("/")[-1], []).append(info)

    def _index(self):
        for folder, _t, _o in self.sections:
            for f in sorted((self.wiki / folder).glob("*.md")):
                if f.is_symlink():
                    continue
                self._add(f"{folder}/{f.stem}",
                          {"pub": True, "permalink": f"/{folder}/{f.stem}/", "rel": f"{folder}/{f.name}"})
        if self.cfg["publish_info_pages"]:
            for fn, (_t, pl, _o, _p) in INFO_PAGES.items():
                if (self.wiki / fn).is_file():
                    self._add(fn[:-3], {"pub": True, "permalink": pl, "rel": fn})
        self._add("index", {"pub": True, "permalink": "/", "rel": "index.md"})
        for f in self.wiki.rglob("*.md"):
            if f.is_symlink():
                continue
            rel = f.relative_to(self.wiki).as_posix()
            if rel.split("/")[0] in TOOLING_DIRS:
                continue
            noext = rel[:-3]
            if noext not in self.by_path:
                self._add(noext, {"pub": False, "permalink": None, "rel": rel})

    def resolve(self, target, src_rel):
        """Resolve a link target to a page info, anchored at the WIKI ROOT. Returns
        (info, 'ok'|'missing'|'ambiguous')."""
        t = target.strip()
        if t.endswith(".md"):
            try:
                abs_t = (self.wiki / Path(src_rel).parent / t).resolve()
                r = abs_t.relative_to(self.wiki.resolve()).as_posix()
            except ValueError:
                return None, "missing"
            noext = r[:-3]
        else:
            noext = t.lstrip("./")
        if noext in self.by_path:
            return self.by_path[noext], "ok"
        b = noext.split("/")[-1]
        cands = self.by_base.get(b, [])
        if len(cands) == 1:
            return cands[0], "ok"
        if len(cands) > 1:
            return None, "ambiguous"
        return None, "missing"

    def url(self, info, anchor):
        if info["pub"]:
            u = "{{ '" + info["permalink"] + "' | relative_url }}"
            return u + (("#" + anchor) if anchor else "")
        blob = f"{self.cfg['blob_base']}/{info['rel']}" if self.cfg["blob_base"] else info["rel"]
        return blob + (("#" + anchor) if anchor else "")

    def rewrite(self, body, src_rel, self_info):
        def wl(m):
            tgt, anc, alias = m.group(1), m.group(2), m.group(3)
            if not tgt:  # same-page anchor [[#h]]
                disp = alias or (anc or "")
                if self_info and self_info["pub"]:
                    return f"[{disp}](#{anc})" if anc else disp
                return disp
            disp = alias or tgt.split("/")[-1]
            info, why = self.resolve(tgt, src_rel)
            if not info:
                self.warnings.append(f"{src_rel}: {why} [[{tgt}]]")
                return disp
            return f"[{disp}]({self.url(info, anc)})"

        def ml(m):
            disp, tgt, anc = m.group(1), m.group(2), m.group(3)
            info, why = self.resolve(tgt, src_rel)
            if not info:
                self.warnings.append(f"{src_rel}: {why} ({tgt})")
                return disp
            return f"[{disp}]({self.url(info, anc)})"

        def asset(m):
            bang, disp, tgt, anc = m.group(1), m.group(2), m.group(3), m.group(4) or ""
            if tgt.endswith(".md"):
                return m.group(0)  # handled by ml
            # relative non-md asset -> source blob (avoids 404 on the published site)
            try:
                abs_t = (self.wiki / Path(src_rel).parent / tgt).resolve()
                rel = abs_t.relative_to(self.wiki.resolve()).as_posix()
            except ValueError:
                self.warnings.append(f"{src_rel}: asset escapes wiki ({tgt})")
                return m.group(0)
            if self.cfg["blob_base"]:
                raw = self.cfg["blob_base"].replace("/blob/", "/raw/")
                return f"{bang}[{disp}]({raw}/{rel}{anc})"
            return m.group(0)

        def transform(chunk):
            chunk = WIKILINK_RE.sub(wl, chunk)
            chunk = MDLINK_RE.sub(ml, chunk)
            chunk = ASSETLINK_RE.sub(asset, chunk)
            return chunk

        out = []
        for text, is_prose in prose_spans(body):
            out.append(protect_inline_code(text, transform) if is_prose else text)
        return "\n".join(out)

    def callouts(self, body):
        out, segs = [], prose_spans(body)
        for text, is_prose in segs:
            if not is_prose:
                out.append(text)
                continue
            lines, i, res = text.split("\n"), 0, []
            while i < len(lines):
                m = ALERT_START_RE.match(lines[i])
                if m:
                    res.append(f"{{: .{ALERT_MAP[m.group(1).lower()]} }}")
                    res.append(lines[i]); i += 1
                    while i < len(lines) and lines[i].startswith(">"):
                        res.append(lines[i]); i += 1
                else:
                    res.append(lines[i]); i += 1
            out.append("\n".join(res))
        return "\n".join(out)

    def emit(self, src, rel, title, parent, order, permalink, dest):
        fm, body = split_fm(src.read_text(encoding="utf-8"))
        if fm is None:
            body = strip_leading_h1(body)
        body = self.rewrite(self.callouts(body), rel, {"pub": True, "permalink": permalink})
        front = ["---", "layout: default", f"title: {yesc(title)}"]
        if parent:
            front.append(f"parent: {yesc(parent)}")
        front += [f"nav_order: {order}", f'permalink: "{permalink}"', "---", ""]
        dest.parent.mkdir(parents=True, exist_ok=True)
        dest.write_text("\n".join(front) + "\n" + body, encoding="utf-8")

    def pages_of(self, folder):
        res = []
        for f in sorted((self.wiki / folder).glob("*.md")):
            if f.is_symlink() or f.name == "index.md" or not self._publishable(f):
                continue
            fm, body = split_fm(f.read_text(encoding="utf-8"))
            res.append((f, get_title(fm, body, f.stem.replace("-", " ").title())))
        # LOCAL PATCH (k8s-platform-engineering): optional explicit order via the config key
        # "nav_order_stems" (list of file stems). Unlisted pages follow, sorted by title.
        stems = self.cfg.get("nav_order_stems") or []
        rank = {s: i for i, s in enumerate(stems)}
        res.sort(key=lambda t: (rank.get(t[0].stem, len(rank)), t[1]))
        return res

    # ---- output confinement -------------------------------------------------

    def _prepare_out(self):
        out = self.out
        if out.is_symlink():
            sys.exit(f"[build_site] refusing symlinked output path: {out}")
        try:
            inside = out.resolve().is_relative_to(self.wiki.resolve())
        except AttributeError:  # py<3.9 fallback
            inside = str(out.resolve()).startswith(str(self.wiki.resolve()))
        # only guard against symlink traversal for paths INSIDE the wiki (don't scan system
        # ancestors like /var -> /private/var that are symlinks on macOS)
        if inside and is_symlinked(out, self.wiki):
            sys.exit(f"[build_site] refusing symlinked output path inside wiki: {out}")
        if out.exists():
            if not (out / BUILD_MARKER).exists():
                sys.exit(f"[build_site] refusing to delete '{out}': not a publisher build dir "
                         f"(missing {BUILD_MARKER}). Choose an empty/new --out.")
            shutil.rmtree(out)
        elif not inside and out.resolve() in (Path.home().resolve(), self.wiki.resolve().parent):
            sys.exit(f"[build_site] refusing unsafe --out: {out}")
        out.mkdir(parents=True)
        (out / BUILD_MARKER).write_text("generated by sticki-publish; safe to delete\n")

    def write_config(self):
        """Prefer the wiki's committed _config.yml (proven); fill only missing required keys."""
        c = self.cfg
        user_cfg = self.wiki / "_config.yml"
        required = {
            "title": yesc(c["title"]), "description": yesc(c["description"]),
            "url": f'"{c["url"]}"', "baseurl": f'"{c["baseurl"]}"',
            "repository": f"{c['owner']}/{c['repo']}", "theme": "just-the-docs",
        }
        if user_cfg.is_file() and not user_cfg.is_symlink():
            text = user_cfg.read_text(encoding="utf-8")
            missing = [f"{k}: {v}" for k, v in required.items()
                       if not re.search(rf"^{k}:", text, re.M)]
            merged = text.rstrip("\n") + "\n"
            if missing:
                merged += "\n# --- filled by sticki-publish (missing keys) ---\n" + "\n".join(missing) + "\n"
            (self.out / "_config.yml").write_text(merged, encoding="utf-8")
            return
        (self.out / "_config.yml").write_text(f"""title: {yesc(c['title'])}
description: {yesc(c['description'])}
url: "{c['url']}"
baseurl: "{c['baseurl']}"
repository: {c['owner']}/{c['repo']}
theme: just-the-docs
nav_sort: case_sensitive
heading_anchors: true
back_to_top: true
back_to_top_text: "Back to top"
search_enabled: true
mermaid:
  version: "10.9.1"
callouts_level: quiet
callouts:
  note: {{ title: Note, color: blue }}
  tip: {{ title: Tip, color: green }}
  important: {{ title: Important, color: purple }}
  warning: {{ title: Warning, color: yellow }}
aux_links:
  "Source in Git":
    - "https://{c['host']}/{c['owner']}/{c['repo']}"
aux_links_new_tab: true
""", encoding="utf-8")

    def build(self):
        self._prepare_out()
        self.write_config()
        for folder, title, order in self.sections:
            idx = self.out / folder / "index.md"
            idx.parent.mkdir(parents=True, exist_ok=True)
            idx.write_text(f'---\nlayout: default\ntitle: {yesc(title)}\nnav_order: {order}\n'
                           f'has_children: true\npermalink: "/{folder}/"\n---\n\n# {title}\n',
                           encoding="utf-8")
            for o, (f, t) in enumerate(self.pages_of(folder), start=1):
                self.emit(f, f"{folder}/{f.name}", t, title, o, f"/{folder}/{f.stem}/",
                          self.out / folder / f.name)
        if self.cfg["publish_info_pages"]:
            about_needed = any((self.wiki / fn).is_file() and p == "About"
                               for fn, (_t, _pl, _o, p) in INFO_PAGES.items())
            if about_needed:
                (self.out / "about").mkdir(parents=True, exist_ok=True)
                (self.out / "about" / "index.md").write_text(
                    '---\nlayout: default\ntitle: "About"\nnav_order: 91\nhas_children: true\n'
                    'permalink: "/about/"\n---\n\n# About\n', encoding="utf-8")
            for fn, (t, pl, o, parent) in INFO_PAGES.items():
                src = self.wiki / fn
                if not src.is_file():
                    continue
                dest = (self.out / "about" / fn) if parent == "About" else (self.out / (pl.strip("/") + ".md"))
                self.emit(src, fn, t, parent, o, pl, dest)
        self.write_home()
        return self.warnings

    def write_home(self):
        feat = self.cfg["feature_dir"]
        lines = ["---", "layout: default", 'title: "Home"', "nav_order: 0",
                 'permalink: "/"', "---", "", f"# {self.cfg['title']}", "",
                 self.cfg["description"], ""]
        if (self.wiki / feat).is_dir():
            fp = self.pages_of(feat)
            if fp:
                lines += [f"## Featured — {feat.title()}", ""]
                for f, t in fp:
                    lines.append(f"- [{t}]({{{{ '/{feat}/{f.stem}/' | relative_url }}}})")
                lines.append("")
        lines += ["## Browse by section", ""]
        for folder, title, _o in self.sections:
            if folder == feat:
                continue
            lines.append(f"- [{title}]({{{{ '/{folder}/' | relative_url }}}})")
        (self.out / "index.md").write_text("\n".join(lines) + "\n", encoding="utf-8")


def main(argv):
    ap = argparse.ArgumentParser(description="Generate a Just-the-Docs tree from a sticki-wiki.")
    ap.add_argument("--wiki", default=".")
    ap.add_argument("--out", default=None)
    ap.add_argument("--strict", action="store_true",
                    help="fail the build on any unresolved/ambiguous/residual link")
    args = ap.parse_args(argv)

    wiki = Path(args.wiki).resolve()
    if not wiki.is_dir():
        sys.exit(f"[build_site] wiki root not found: {wiki}")
    out = Path(args.out).resolve() if args.out else (wiki / "build")

    cfg = load_config(wiki)
    if not cfg["repo"]:
        print("[build_site] WARNING: no git remote detected — set repo/baseurl/blob_base in "
              ".sticki-publish.json", file=sys.stderr)
    b = Builder(wiki, out, cfg, args.strict)
    warns = b.build()
    print(f"[build_site] wiki={wiki}")
    print(f"[build_site] host={cfg['host']} url={cfg['url']} baseurl={cfg['baseurl']}")
    print(f"[build_site] sections={[s[0] for s in b.sections]}")
    print(f"[build_site] emitted -> {out}")
    if warns:
        print(f"[build_site] {len(warns)} link warning(s):")
        for w in warns[:100]:
            print("   -", w)
        if args.strict:
            print("[build_site] STRICT: failing build due to link warnings.", file=sys.stderr)
            return 2
    else:
        print("[build_site] no link warnings.")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
