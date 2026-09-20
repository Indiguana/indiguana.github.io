#!/usr/bin/env python3
"""Structural checks for a teaching site.

Every failure this looks for is one that actually happened on a real build and was
not obvious from reading the page source:

  truncated      a long generation got cut off; the file has no </html>
  orphan-widget  interactive markup (canvas / range slider / control button) with no
                 script driving it, so the figure silently renders blank
  data-page      <body data-page> doesn't match the filename, so the shared shell
                 highlights the wrong sidebar entry and builds the wrong prev/next
  h2-id          an <h2> with no id, so it goes missing from the table of contents
  hex-color      a hard-coded #rrggbb, which survives light mode and breaks dark
  dead-link      href to a local page that doesn't exist
  script-scope   page script not wrapped in the shellready listener, so it runs
                 before the shell exists and throws

Usage:  python3 check_pages.py <site-directory> [--quiet]
Exit code is the number of pages with problems, so it works in a shell `if`.
"""

import re
import sys
from pathlib import Path

# Colors written into a stylesheet are fine; these are the page files we police.
HEX = re.compile(r"#[0-9a-fA-F]{6}\b|#[0-9a-fA-F]{3}\b(?![0-9a-fA-F])")
# Two things look exactly like a short hex color and are not one. Strip them before
# scanning, or the checker cries wolf and stops being read: numeric HTML entities
# (&#160; &#183;) and in-page anchors (href="#ac3").
NOT_A_COLOR = re.compile(r"&#\d+;|href=[\"\'][^\"\']*[\"\']")
H2 = re.compile(r"<h2(?![^>]*\bid=)[^>]*>", re.I)
BODY_PAGE = re.compile(r'<body[^>]*\bdata-page=["\']([^"\']+)["\']', re.I)
LOCAL_HREF = re.compile(r'href=["\'](?!https?:|mailto:|#)([^"\'#?]+\.html)')
ANCHOR = re.compile(r'href=["\']#([^"\']+)["\']')
ID_ATTR = re.compile(r'\bid=["\']([^"\']+)["\']')

# Markup that only does something if JavaScript drives it.
WIDGET = re.compile(r"<canvas\b|<input[^>]+type=[\"']range[\"']|<button[^>]+\bid=", re.I)


def check(path: Path, all_pages: set) -> list:
    text = path.read_text(encoding="utf-8", errors="replace")
    body = text.split("</head>", 1)[-1]
    problems = []

    if "</html>" not in text[-400:]:
        problems.append(("truncated", "file does not end with </html> — generation was cut short"))

    m = BODY_PAGE.search(text)
    if not m:
        problems.append(("data-page", "<body> has no data-page attribute"))
    elif m.group(1) != path.stem:
        problems.append(("data-page", f'data-page="{m.group(1)}" but file is {path.name}'))

    for tag in H2.findall(body):
        problems.append(("h2-id", f"<h2> without an id: {tag[:70]}"))

    for hexcolor in set(HEX.findall(NOT_A_COLOR.sub(" ", body))):
        problems.append(("hex-color", f"hard-coded {hexcolor} — use a CSS variable so dark mode works"))

    has_widget = bool(WIDGET.search(body))
    has_script = "shellready" in text
    if has_widget and not has_script:
        problems.append(("orphan-widget", "interactive markup present but no shellready script — the figure will render blank"))
    if "<script>" in body and not has_script and "renderMathInElement" not in body:
        problems.append(("script-scope", "inline <script> not wrapped in a shellready listener"))

    for href in set(LOCAL_HREF.findall(text)):
        if Path(href).name not in all_pages:
            problems.append(("dead-link", f"links to {href}, which does not exist"))

    ids = set(ID_ATTR.findall(text))
    for anchor in set(ANCHOR.findall(text)):
        if anchor and anchor not in ids:
            problems.append(("dead-link", f"anchor #{anchor} has no matching id"))

    return problems


def main() -> int:
    args = [a for a in sys.argv[1:] if not a.startswith("-")]
    quiet = "--quiet" in sys.argv
    root = Path(args[0]) if args else Path(".")
    if not root.is_dir():
        print(f"not a directory: {root}", file=sys.stderr)
        return 1

    pages = sorted(root.glob("*.html"))
    if not pages:
        print(f"no .html pages in {root}", file=sys.stderr)
        return 1
    names = {p.name for p in pages}

    bad = 0
    for page in pages:
        problems = check(page, names)
        if problems:
            bad += 1
            print(f"\n{page.name}")
            for kind, msg in problems:
                print(f"   [{kind}] {msg}")
        elif not quiet:
            print(f"ok  {page.name}")

    print()
    if bad:
        print(f"{bad} of {len(pages)} pages have problems")
    else:
        print(f"all {len(pages)} pages pass")
    return bad


if __name__ == "__main__":
    sys.exit(main())
