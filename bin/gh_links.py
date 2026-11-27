#!/usr/bin/env python3
"""Convert Obsidian-style wikilinks to relative Markdown links that GitHub renders.

Stored form in this wiki is a relative Markdown link, for example
[examples/foo](../examples/foo.md). The sticki skills and page-writer agents still
write [[wikilinks]]; run this script after any operation that writes pages.

    python3 -I bin/gh_links.py --dry-run          report and sample diffs, writes nothing
    python3 -I bin/gh_links.py --write            convert wikilinks in place
    python3 -I bin/gh_links.py --check            verify links and anchors, exit 1 on any problem
    python3 -I bin/gh_links.py --refresh-anchors  repair anchors whose heading status suffix changed

Scope: every *.md under the repository root except raw/, outputs/ (their wikilinks are
resolved by bin/build_site.py for the Pages site), build/, vendor/, _site/ and dot
directories. YAML frontmatter, fenced code blocks and inline code spans are never touched.
Link text is the text as written: [[a/b]] becomes [a/b](../a/b.md); [[a/b|text]] becomes
[text](../a/b.md). Unresolvable links are left as they are and reported.
"""
import os
import re
import sys
from urllib.parse import quote

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SKIP_DIRS = {"raw", "outputs", "build", "vendor", "_site", "node_modules"}
WIKILINK = re.compile(r"\[\[([^\[\]\n]+)\]\]")
MDLINK = re.compile(r"\]\(([^)\s]+)\)")
CODE_SPAN = re.compile(r"(?<!`)(`+)(?!`)(.+?)(?<!`)\1(?!`)")
FENCE = re.compile(r"^ {0,3}(`{3,}|~{3,})")
HEADING = re.compile(r"^ {0,3}(#{1,6})\s+(.*?)\s*#*\s*$")


def gh_id(text):
    t = text.strip()
    t = re.sub(r"\[([^\]]*)\]\([^)]*\)", r"\1", t)
    t = t.replace("`", "").replace("*", "")
    t = t.lower()
    t = re.sub(r"[^\w\- ]", "", t)
    return t.replace(" ", "-")


def md_files():
    out = []
    for dp, dns, fns in os.walk(ROOT):
        dns[:] = sorted(d for d in dns if d not in SKIP_DIRS and not d.startswith("."))
        for fn in sorted(fns):
            if fn.endswith(".md"):
                out.append(os.path.join(dp, fn))
    return out


def split_frontmatter(text):
    if text.startswith("---\n"):
        end = text.find("\n---\n", 4)
        if end != -1:
            cut = end + 5
            return text[:cut], text[cut:]
    return "", text


_heading_cache = {}


def headings(path):
    """Return list of (github_id, title_slug) for headings outside code fences."""
    if path in _heading_cache:
        return _heading_cache[path]
    res = []
    seen = {}
    try:
        text = open(path, encoding="utf-8").read()
    except OSError:
        _heading_cache[path] = res
        return res
    fm, body = split_frontmatter(text)
    fence = None
    for line in body.split("\n"):
        m = FENCE.match(line)
        if m:
            tok = m.group(1)
            if fence is None:
                fence = tok[0]
            elif tok[0] == fence:
                fence = None
            continue
        if fence:
            continue
        h = HEADING.match(line)
        if not h:
            continue
        txt = h.group(2)
        base = gh_id(txt)
        n = seen.get(base, 0)
        seen[base] = n + 1
        hid = base if n == 0 else base + "-" + str(n)
        title = txt.split(" — status")[0]
        res.append((hid, gh_id(title)))
    _heading_cache[path] = res
    return res


def find_anchor(path, anchor):
    a = gh_id(anchor)
    hs = headings(path)
    for hid, title in hs:
        if hid == a or title == a:
            return hid
    return None


TRACKERS = ["open-knowledge-gaps.md", "open-knowledge-gaps-archive.md", "todo.md", "todo-archive.md"]


def squash(x):
    return re.sub(r"[^a-z0-9]", "", x.lower())


def resolve_anchor(dst, anchor):
    """Find the heading for an anchor: exact in dst, fuzzy in dst, then the tracker files.

    Returns (path, github_id) or None. The fuzzy match ignores punctuation differences such as
    dots and apostrophes that heading slugs and hand-written anchors treat differently."""
    hid = find_anchor(dst, anchor)
    if hid:
        return dst, hid
    want = squash(anchor)
    order = [dst] + [os.path.join(ROOT, t) for t in TRACKERS if os.path.join(ROOT, t) != dst]
    for path in order:
        if not os.path.isfile(path):
            continue
        hid = find_anchor(path, anchor)
        if hid:
            return path, hid
        for h, title in headings(path):
            if squash(title) == want:
                return path, h
    return None


def rel_dest(src, dst):
    rel = os.path.relpath(dst, os.path.dirname(src)).replace(os.sep, "/")
    return quote(rel, safe="/._-~")


def convert_segment(seg, src, in_table, stats, unresolved, lineno, samples):
    def repl(m):
        inner = m.group(1)
        if "|" in inner:
            target, alias = inner.split("|", 1)
            label = alias.strip()
            form = "alias"
        else:
            target, label = inner, inner.strip()
            form = None
        target = target.strip()
        page, anchor = (target.split("#", 1) + [None])[:2] if "#" in target else (target, None)
        page = page.strip()
        if page.endswith(".md"):
            page = page[:-3]
        if page:
            dst = os.path.join(ROOT, page + ".md")
            if not os.path.isfile(dst):
                unresolved.append((src, lineno, m.group(0), "no such page"))
                return m.group(0)
        else:
            dst = src
        frag = ""
        link_file = dst
        if anchor is not None:
            hit = resolve_anchor(dst, anchor)
            if hit is None:
                unresolved.append((src, lineno, m.group(0), "no such heading"))
                return m.group(0)
            link_file, hid = hit
            frag = "#" + hid
        if page or link_file != src:
            dest = rel_dest(src, link_file) + frag
        else:
            dest = frag
        if form is None:
            if not page:
                form = "anchor-only"
            elif anchor is not None:
                form = "page#anchor"
            elif "/" in page:
                form = "folder/slug"
            else:
                form = "bare"
        lab = label.replace("[", "\\[").replace("]", "\\]")
        if in_table:
            lab = lab.replace("|", "\\|")
        new = "[" + lab + "](" + dest + ")"
        stats[form] = stats.get(form, 0) + 1
        if form not in samples or (in_table and "table" not in samples):
            samples.setdefault(form, (src, lineno, m.group(0), new))
            if in_table:
                samples.setdefault("table", (src, lineno, m.group(0), new))
        return new

    return WIKILINK.sub(repl, seg)


def convert_text(text, src, stats, unresolved, samples):
    fm, body = split_frontmatter(text)
    out = []
    fence = None
    for i, line in enumerate(body.split("\n"), 1):
        m = FENCE.match(line)
        if m:
            tok = m.group(1)
            if fence is None:
                fence = tok[0]
            elif tok[0] == fence:
                fence = None
            out.append(line)
            continue
        if fence or "[[" not in line:
            out.append(line)
            continue
        in_table = line.lstrip().startswith("|")
        pieces = []
        pos = 0
        for cm in CODE_SPAN.finditer(line):
            pieces.append(convert_segment(line[pos:cm.start()], src, in_table, stats, unresolved, i, samples))
            pieces.append(cm.group(0))
            pos = cm.end()
        pieces.append(convert_segment(line[pos:], src, in_table, stats, unresolved, i, samples))
        out.append("".join(pieces))
    return fm + "\n".join(out)


def count_md_links(text):
    return text.count("](")


def leftover_wikilinks(text):
    fm, body = split_frontmatter(text)
    found = []
    fence = None
    for i, line in enumerate(body.split("\n"), 1):
        m = FENCE.match(line)
        if m:
            tok = m.group(1)
            if fence is None:
                fence = tok[0]
            elif tok[0] == fence:
                fence = None
            continue
        if fence or "[[" not in line:
            continue
        pos = 0
        segs = []
        for cm in CODE_SPAN.finditer(line):
            segs.append(line[pos:cm.start()])
            pos = cm.end()
        segs.append(line[pos:])
        for s in segs:
            for w in WIKILINK.findall(s):
                found.append((i, w))
    return found


def iter_md_links(text):
    """Yield (lineno, dest) for markdown links outside frontmatter, fences and code spans."""
    fm, body = split_frontmatter(text)
    base = fm.count("\n")
    fence = None
    for i, line in enumerate(body.split("\n"), 1):
        m = FENCE.match(line)
        if m:
            tok = m.group(1)
            if fence is None:
                fence = tok[0]
            elif tok[0] == fence:
                fence = None
            continue
        if fence or "](" not in line:
            continue
        pos = 0
        segs = []
        for cm in CODE_SPAN.finditer(line):
            segs.append(line[pos:cm.start()])
            pos = cm.end()
        segs.append(line[pos:])
        for s in segs:
            for d in MDLINK.findall(s):
                yield base + i, d


def run_convert(write):
    stats, unresolved, samples = {}, [], {}
    changed = []
    problems = []
    for path in md_files():
        text = open(path, encoding="utf-8").read()
        if "[[" not in text:
            continue
        fstats = {}
        new = convert_text(text, path, fstats, unresolved, samples)
        n = sum(fstats.values())
        if new == text:
            continue
        delta = count_md_links(new) - count_md_links(text)
        if delta != n:
            problems.append((path, "link count delta " + str(delta) + " != converted " + str(n)))
            continue
        for k, v in fstats.items():
            stats[k] = stats.get(k, 0) + v
        changed.append((path, new, n))
    total = sum(stats.values())
    print("converted links:", total, "in", len(changed), "files")
    for k in ("folder/slug", "bare", "anchor-only", "alias", "page#anchor"):
        print("  " + k + ":", stats.get(k, 0))
    print("unresolved (left as wikilinks):", len(unresolved))
    for src, ln, w, why in unresolved[:40]:
        print("  " + os.path.relpath(src, ROOT) + ":" + str(ln), w[:90], "--", why)
    if problems:
        print("PROBLEMS:", len(problems))
        for p, why in problems:
            print("  ", os.path.relpath(p, ROOT), why)
        return 1
    if not write:
        print("\nsamples:")
        for form, (src, ln, old, new) in samples.items():
            print("  [" + form + "] " + os.path.relpath(src, ROOT) + ":" + str(ln))
            print("     " + old)
            print("  -> " + new)
        return 0
    for path, new, n in changed:
        with open(path, "w", encoding="utf-8") as f:
            f.write(new)
    print("written:", len(changed), "files")
    return 0


def run_check():
    bad = 0
    nlinks = 0
    for path in md_files():
        text = open(path, encoding="utf-8").read()
        rel = os.path.relpath(path, ROOT)
        for ln, w in leftover_wikilinks(text):
            bad += 1
            print("WIKILINK", rel + ":" + str(ln), "[[" + w + "]]")
        for ln, dest in iter_md_links(text):
            if re.match(r"^[a-zA-Z][a-zA-Z0-9+.-]*:", dest) or dest.startswith("//"):
                continue
            nlinks += 1
            page, _, frag = dest.partition("#")
            from urllib.parse import unquote
            page = unquote(page)
            target = path if not page else os.path.normpath(os.path.join(os.path.dirname(path), page))
            if page and not os.path.exists(target):
                bad += 1
                print("MISSING-FILE", rel + ":" + str(ln), dest)
                continue
            if frag and target.endswith(".md"):
                ids = {h for h, _t in headings(target)}
                if unquote(frag) not in ids:
                    bad += 1
                    print("MISSING-ANCHOR", rel + ":" + str(ln), dest)
    print("checked relative links:", nlinks, "problems:", bad)
    return 1 if bad else 0


def run_refresh():
    fixed = 0
    stuck = 0
    for path in md_files():
        text = open(path, encoding="utf-8").read()
        edits = []
        for ln, dest in iter_md_links(text):
            if "#" not in dest or re.match(r"^[a-zA-Z][a-zA-Z0-9+.-]*:", dest):
                continue
            page, _, frag = dest.partition("#")
            from urllib.parse import unquote
            page = unquote(page)
            target = path if not page else os.path.normpath(os.path.join(os.path.dirname(path), page))
            if not target.endswith(".md") or not os.path.exists(target):
                continue
            ids = [h for h, _t in headings(target)]
            if frag in ids:
                continue
            stem = frag.split("--status-")[0]
            cands = [h for h in ids if h.startswith(stem + "--status-")]
            if len(cands) == 1:
                edits.append((dest, page + "#" + cands[0] if page else "#" + cands[0]))
            else:
                stuck += 1
                print("STALE-UNFIXABLE", os.path.relpath(path, ROOT) + ":" + str(ln), dest)
        if edits:
            new = text
            for old, newd in edits:
                new = new.replace("](" + old + ")", "](" + newd + ")")
            with open(path, "w", encoding="utf-8") as f:
                f.write(new)
            fixed += len(edits)
    print("anchors refreshed:", fixed, "unfixable:", stuck)
    return 1 if stuck else 0


def main(argv):
    if "--check" in argv:
        return run_check()
    if "--refresh-anchors" in argv:
        return run_refresh()
    if "--write" in argv:
        return run_convert(True)
    if "--dry-run" in argv or len(argv) == 1:
        return run_convert(False)
    print(__doc__)
    return 2


if __name__ == "__main__":
    sys.exit(main(sys.argv))
