#!/usr/bin/env python3
"""Lint outputs/**/*.md against the ramp-up methodology (methodologies/writing-ramp-up-outputs.md).

    python3 -I bin/lint_outputs.py                 lint every document under outputs/ (including group folders)
    python3 -I bin/lint_outputs.py outputs/x.md    lint specific files
    python3 -I bin/lint_outputs.py --warnings      also fail on warnings

Outputs teach principles, design and architecture. This script is the deterministic half of the
content filter: it finds the product-specific detail the methodology forbids (versions, dates,
issue and commit references, banned words, revision wording) and structural problems (heading,
metadata header, unresolved wikilinks). Judgment calls (is this passage product trivia or a design
point?) stay with the reviewers.

ERROR findings fail the run. WARN findings (flags, release-stage words, stated defaults,
numeric comparison tables, soft revision words) are listed and fail only with --warnings.
Frontmatter, fenced code blocks, wikilink targets, the metadata header's Created and As of
dates, and any line carrying an HTML comment containing lint-ok (for a deliberate teaching
example such as a semantic-versioning illustration) are not scanned. Years in prose are reported as an informational count.
"""
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FENCE = re.compile(r"^ {0,3}(`{3,}|~{3,})")
WIKILINK = re.compile(r"\[\[([^\[\]\n|#]+)(?:#[^\[\]\n|]*)?(?:\|[^\[\]\n]*)?\]\]")

# (code, level, regex, message)
RULES = [
    ("version", "ERROR", re.compile(r"\bv\d+\.\d+(?:\.\d+)?\b"), "version number"),
    ("semver", "ERROR", re.compile(r"\b\d+\.\d+\.\d+\b"), "version-like number"),
    ("product-version", "ERROR",
     re.compile(r"\b(?:Kubernetes|k8s|Flux|Crossplane|kro|Argo CD|Helm|controller-runtime|client-go|Cluster API)\s+v?\d+\.\d+"),
     "product followed by a version"),
    ("iso-date", "ERROR", re.compile(r"\b20\d{2}-\d{2}-\d{2}\b"), "ISO date"),
    ("issue-ref", "ERROR",
     re.compile(r"(?i)\b(?:issue|pull request|PR|KEP|commit|changelog)s?[ -]#?\d{2,}\b"),
     "issue, pull request, KEP or commit reference"),
    ("hash-ref", "ERROR", re.compile(r"(?<![\w/-])#\d{3,}\b"), "numbered issue or PR reference"),
    ("revision-wording", "ERROR",
     re.compile(r"(?i)\b(?:earlier drafts?|was corrected|corrected in|has since been|this pass|the wiki now|"
                r"used to say|since then|was not read|were not read|pages read|files read|"
                r"remaining unknowns?|as of the last review|firmer than before)\b"),
     "wording about the document or research having changed"),
    ("banned-word", "ERROR",
     re.compile(r"(?i)\b(?:anchored|unanchored|bounded|bounds|canonical|carveouts?|genuinely|load[- ]bearing|"
                r"materially|material)\b"),
     "banned word"),
    ("soft-revision", "WARN",
     re.compile(r"(?i)\b(?:previously|newly|originally|formerly)\b"),
     "possible revision wording (fine only when it describes the technology, not the document)"),
    ("flag", "WARN", re.compile(r"(?<![\w-])--[a-z][a-z0-9]+(?:-[a-z0-9]+)*"), "command-line flag"),
    ("stage", "WARN",
     re.compile(r"(?i)\b(?:alpha|beta|GA|general availability|deprecated|release candidate|experimental)\b"),
     "release-stage word"),
    ("default-value", "WARN",
     re.compile(r"(?i)\bdefaults? (?:to|of|is|are|at)\b[^.]{0,40}\b\d"), "stated default value"),
    ("interval-value", "WARN",
     re.compile(r"(?i)\b\d+(?:\.\d+)?\s?(?:seconds?|minutes?|hours?|ms|MiB|GiB|KiB|replicas?|workers?)\b"),
     "numeric configuration-style figure"),
]
YEAR = re.compile(r"\b20[0-9]{2}\b")
HEADER_SKIP = re.compile(r"^>\s*\*\*(?:Created|As of|Status|Delivered)\b")


def split_frontmatter(text):
    if text.startswith("---\n"):
        end = text.find("\n---\n", 4)
        if end != -1:
            return text[: end + 5], text[end + 5 :]
    return "", text


def prose_lines(body, base):
    """Yield (lineno, line) outside fenced code."""
    fence = None
    for i, line in enumerate(body.split("\n"), 1):
        m = FENCE.match(line)
        if m:
            tok = m.group(1)[0]
            fence = tok if fence is None else (None if fence == tok else fence)
            continue
        if fence:
            continue
        yield base + i, line


def clean(line):
    line = WIKILINK.sub(" ", line)
    line = re.sub(r"\]\([^)]*\)", "]", line)
    return line


def lint_file(path):
    findings = []
    text = open(path, encoding="utf-8").read()
    fm, body = split_frontmatter(text)
    base = fm.count("\n")
    rel = os.path.relpath(path, ROOT)
    if not fm or not re.search(r"^type:\s*output\s*$", fm, re.M):
        findings.append((rel, 1, "ERROR", "frontmatter", "missing frontmatter with type: output"))
    h1 = 0
    years = 0
    in_table_rows = []
    header_lines = []
    for ln, line in prose_lines(body, base):
        if re.match(r"^# \S", line):
            h1 += 1
        if re.match(r"^>\s*\*\*[A-Za-z ]+:\*\*", line):
            header_lines.append((ln, line))
        if HEADER_SKIP.match(line) or "lint-ok" in line:
            continue
        c = clean(line)
        for code, level, rx, msg in RULES:
            for m in rx.finditer(c):
                snip = c[max(0, m.start() - 30): m.end() + 30].strip()
                findings.append((rel, ln, level, code, msg + ": ..." + snip + "..."))
        years += len(YEAR.findall(c))
        if line.lstrip().startswith("|") and not re.match(r"^\s*\|[-| :]+\|\s*$", line):
            in_table_rows.append((ln, line))
        for w in WIKILINK.findall(line):
            target = w.strip()
            if target.endswith(".md"):
                target = target[:-3]
            if target and not os.path.isfile(os.path.join(ROOT, target + ".md")):
                findings.append((rel, ln, "ERROR", "wikilink", "unresolved wikilink [[" + target + "]]"))
    if h1 != 1:
        findings.append((rel, 1, "ERROR", "h1", "expected exactly one H1, found " + str(h1)))
    for ln, line in header_lines:
        if not line.rstrip().endswith("<br>") and not line.rstrip().endswith("<br/>"):
            findings.append((rel, ln, "ERROR", "header-br", "metadata header line does not end with <br>"))
    for ln, line in in_table_rows:
        cells = [c.strip() for c in line.strip().strip("|").split("|")]
        numeric = [c for c in cells if re.search(r"\d", c) and len(c) < 40]
        if len(cells) >= 3 and len(numeric) * 2 >= len(cells):
            findings.append((rel, ln, "WARN", "numeric-table", "table row that is mostly numbers: " + line.strip()[:70]))
    return findings, years


def load_allow():
    """bin/lint_outputs_allow.txt: one 'outputs/file.md | text on the line' per allowed teaching example."""
    path = os.path.join(ROOT, "bin", "lint_outputs_allow.txt")
    out = []
    if os.path.isfile(path):
        for line in open(path, encoding="utf-8"):
            line = line.strip()
            if line and not line.startswith("#") and "|" in line:
                f, _, t = line.partition("|")
                out.append((f.strip(), t.strip()))
    return out


def allowed(rel, ln_text, allow):
    return any(f == rel and t in ln_text for f, t in allow)


def main(argv):
    warn_fail = "--warnings" in argv
    files = [a for a in argv[1:] if not a.startswith("--")]
    if not files:
        files = []
        for dp, _dns, fns in os.walk(os.path.join(ROOT, "outputs")):
            files += [os.path.join(dp, f) for f in fns if f.endswith(".md") and f != "index.md"]
        files.sort()
    errors = warns = 0
    for f in files:
        f = f if os.path.isabs(f) else os.path.join(ROOT, f)
        findings, years = lint_file(f)
        allow = load_allow()
        for rel, ln, level, code, msg in findings:
            if allowed(rel, msg, allow):
                continue
            print(f"{rel}:{ln}: {level} {code}: {msg}")
            if level == "ERROR":
                errors += 1
            else:
                warns += 1
        print(f"{os.path.relpath(f, ROOT)}: years in prose (info): {years}")
    print(f"errors: {errors}  warnings: {warns}")
    return 1 if errors or (warn_fail and warns) else 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))
