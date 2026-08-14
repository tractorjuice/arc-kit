#!/usr/bin/env python3
"""
Replace a template's hand-maintained `## Document Control` table with the
`<!-- DOC-CONTROL-HEADER -->` marker, which the command runtime resolves to the
partial selected by `_partials/RENDERING.md`. Idempotent — running twice leaves
the file unchanged.

Also normalises the descriptive comment on templates that already carry the
marker, so a change to the resolution rule reaches every template rather than
only newly-converted ones.

Usage:
  python scripts/python/apply_doc_control_marker.py <template-dir>... [--check]

`--check` reports what would change and exits 1 if anything would, without
writing. Exits 0 with a count of files modified otherwise.

## Why the comment is one line

The comment used to restate the routing rule: "resolved to
_partials/document-control-uk.md or _partials/document-control-uae.md based on
plugin userConfig classification_scheme + governance_framework". That was true
before #744 made routing regime-first, and it named two partials when there are
now seven. Because the constant was never updated, this script wrote the stale
wording into all 16 templates it converted in #761, and 121 of 168 templates
ended up carrying a comment that contradicted the rule it pointed at (#760).

The model reads the template verbatim at render time, so the comment competes
with `RENDERING.md` for authority. It now defers instead of paraphrasing:
`RENDERING.md` is the single statement of the rule, and restating any part of it
here is what caused the drift.

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

MARKER_LINE = "<!-- DOC-CONTROL-HEADER -->"
COMMENT_LINE = "<!-- Resolved at command-execution time per _partials/RENDERING.md. -->"
MARKER = f"{MARKER_LINE}\n{COMMENT_LINE}\n"

# The marker line plus whatever descriptive comment directly follows it, current
# or legacy. Adjacency matters: the "Domain-specific fields" comment written by
# build() sits after a blank line, so this cannot swallow it.
MARKER_BLOCK = re.compile(re.escape(MARKER_LINE) + r"\n(?:<!--(?:(?!-->).)*?-->\n)?", re.DOTALL)

# Templates that keep a hand-maintained Document Control block on purpose, and
# must never be converted. The DCB0129/DCB0160 safety case set follows the Marcus
# Baw SAFETY.md spec convention, whose `Document ID` is the literal `SAFETY.md`
# with no `ARC-` prefix; the commands document that deviation explicitly. They
# already carry all 14 fields with a constrained ladder, so converting them would
# impose an ARC- ID and break the convention on purpose (#760).
#
# Normalising a marker comment is still allowed here — the exemption is from
# conversion, and none of these carry a marker. `uk-mdr-classification-template.md`
# and `uk-nhs-dtac-template.md` are NOT exempt: they use the marker like any other
# template.
EXEMPT = {
    "uk-nhs-dcb0129-case-template.md",
    "uk-nhs-dcb0129-hazard-template.md",
    "uk-nhs-dcb0129-safety-template.md",
    "uk-nhs-dcb0160-deployment-case-template.md",
    "uk-nhs-dcb0160-deployment-hazard-template.md",
    "uk-nhs-dcb0160-deployment-safety-template.md",
}

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


def rewrite(text: str, name: str = "") -> tuple[str, list[str], str]:
    """Return (new text, domain-specific rows kept, what was done).

    A template that already carries the marker only has its comment normalised —
    re-running the section rebuild over it would work, but it would also churn
    any addendum table for no reason.
    """
    if MARKER_LINE in text:
        return MARKER_BLOCK.sub(MARKER, text, count=1), [], "normalised"
    if name in EXEMPT:
        return text, [], ""
    m = SECTION.search(text)
    if not m:
        return text, [], ""
    extras = [k for k, _ in extra_rows(m.group(0))]
    return text[: m.start()] + build(m.group(0)) + text[m.end():], extras, "converted"


def main() -> int:
    args = [a for a in sys.argv[1:] if not a.startswith("-")]
    check = "--check" in sys.argv
    if not args:
        print("usage: apply_doc_control_marker.py <template-dir>... [--check]", file=sys.stderr)
        return 2
    targets = [Path(a) for a in args]
    for target in targets:
        if not target.is_dir():
            print(f"not a directory: {target}", file=sys.stderr)
            return 2

    # --check and the write path share rewrite(), so the two can never disagree
    # about what would change.
    modified = 0
    for target in targets:
        for md in sorted(target.glob("*.md")):
            text = md.read_text(encoding="utf-8")
            new, extras, action = rewrite(text, md.name)
            if new == text:
                continue
            modified += 1
            kept = f"  (kept: {', '.join(extras)})" if extras else ""
            if check:
                print(f"would {'normalise' if action == 'normalised' else 'convert'}: {md}{kept}")
            else:
                md.write_text(new, encoding="utf-8")
                print(f"{action}: {md}{kept}")

    print(f"\nTotal {'to modify' if check else 'modified'}: {modified}")
    return 1 if (check and modified) else 0


if __name__ == "__main__":
    sys.exit(main())
