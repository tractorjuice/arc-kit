#!/usr/bin/env python3
"""
Replace a template's hand-maintained `## Document Control` table with the
`<!-- DOC-CONTROL-HEADER -->` marker, which the command runtime resolves to the
partial selected by `_partials/RENDERING.md`. Idempotent — running twice leaves
the file unchanged.

Usage:
  python scripts/python/apply_doc_control_marker.py <template-dir> [--check]

`--check` reports what would change and exits 1 if anything would, without
writing. Exits 0 with a count of files modified otherwise.

## Why this preserves rows

The original version of this script replaced the whole Document Control section.
That is lossy: several templates carry domain-specific rows the shared partial
does not supply, and the Document Control Standard explicitly allows them after
the standard fields. Running the old script over `arckit-uk-finance` would have
dropped `Firm Legal Name`, `Firm Authorisation / Registration Type` and
`FCA Firm Reference Number` — firm-identity fields that exist nowhere else in
those artefacts (#760).

So: standard fields (and their known aliases) are dropped, because the partial
supplies them. Anything else is re-appended after the marker as an addendum
table, and the file records that the addendum is deliberate.
"""

from __future__ import annotations

import re
import sys
from pathlib import Path

MARKER = (
    "<!-- DOC-CONTROL-HEADER -->\n"
    "<!-- Resolved at command-execution time to _partials/document-control-uk.md or "
    "_partials/document-control-uae.md based on plugin userConfig classification_scheme + "
    "governance_framework. See _partials/RENDERING.md (when present). -->\n"
)

# The 14 fields the partial supplies. Anything else in a Document Control block
# is domain-specific and must survive the conversion.
STANDARD = {
    "Document ID", "Document Type", "Project", "Classification", "Status", "Version",
    "Created Date", "Last Modified", "Review Cycle", "Next Review Date", "Owner",
    "Reviewed By", "Approved By", "Distribution",
}

# Non-canonical spellings seen in the wild. These ARE standard fields under a
# different name, so the partial covers them and they must not be re-appended.
ALIASES = {
    "Created": "Created Date",
    "Review Date": "Next Review Date",
    "Next Review": "Next Review Date",
    "Standard ID": "Document ID",
    "Last Updated": "Last Modified",
}

# Stop at the NEXT HEADING OF ANY LEVEL, not just `## `. Several templates put
# `### Revision History` immediately after Document Control; a `## `-only
# lookahead runs straight past it and swallows the revision table.
SECTION = re.compile(r"## Document Control\n.*?(?=\n#{2,6} )", re.DOTALL)
ROW = re.compile(r"^\|\s*\*{0,2}(.+?)\*{0,2}\s*\|\s*(.*?)\s*\|\s*$", re.M)


def extra_rows(block: str) -> list[tuple[str, str]]:
    """Domain-specific rows: everything that is not a standard field, an alias of
    one, or the table header/separator."""
    out = []
    for name, value in ROW.findall(block):
        name = name.strip()
        if name in ("Field", "") or set(name) <= set("- "):
            continue
        if name in STANDARD or name in ALIASES:
            continue
        out.append((name, value.strip()))
    return out


def build(block: str) -> str:
    new = "## Document Control\n\n" + MARKER
    extras = extra_rows(block)
    if extras:
        new += (
            "\n<!-- Domain-specific fields, retained after the resolved header per the "
            "Document Control Standard. -->\n\n"
            "| Field | Value |\n|-------|-------|\n"
        )
        new += "".join(f"| **{k}** | {v} |\n" for k, v in extras)
    return new


def transform(path: Path) -> tuple[bool, list[str]]:
    text = path.read_text(encoding="utf-8")
    if MARKER in text:
        return False, []
    m = SECTION.search(text)
    if not m:
        return False, []
    extras = [k for k, _ in extra_rows(m.group(0))]
    new = text[: m.start()] + build(m.group(0)) + text[m.end():]
    if new == text:
        return False, []
    path.write_text(new, encoding="utf-8")
    return True, extras


def main() -> int:
    args = [a for a in sys.argv[1:] if not a.startswith("-")]
    check = "--check" in sys.argv
    if len(args) != 1:
        print("usage: apply_doc_control_marker.py <template-dir> [--check]", file=sys.stderr)
        return 2
    target = Path(args[0])
    if not target.is_dir():
        print(f"not a directory: {target}", file=sys.stderr)
        return 2

    modified = 0
    for md in sorted(target.glob("*.md")):
        if check:
            text = md.read_text(encoding="utf-8")
            if MARKER not in text and SECTION.search(text):
                print(f"would modify: {md}")
                modified += 1
            continue
        changed, extras = transform(md)
        if changed:
            modified += 1
            kept = f"  (kept: {', '.join(extras)})" if extras else ""
            print(f"modified: {md}{kept}")

    print(f"\nTotal {'to modify' if check else 'modified'}: {modified}")
    return 1 if (check and modified) else 0


if __name__ == "__main__":
    sys.exit(main())
