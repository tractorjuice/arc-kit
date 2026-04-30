#!/usr/bin/env python3
"""
arckit migrate-classification — one-time helper for the v4.10 UAE overlay.

Walks projects/ for ARC-* artefacts, proposes a UAE Smart Data classification
for each based on the existing UK ladder value, and produces a unified diff
the architect can review before committing. Does NOT modify files unless
--apply is passed.

Mapping:
  PUBLIC            -> Open
  OFFICIAL          -> Shared
  OFFICIAL-SENSITIVE -> Confidential
  SECRET            -> Secret  (no change in name)
  TOP SECRET        -> Top Secret (no change; rare in ArcKit corpora)

Use:
  arckit migrate-classification              # report only, propose mappings
  arckit migrate-classification --apply      # write the changes (architect-approved)
"""
import argparse
import re
import sys
from pathlib import Path

MAPPING = {
    "PUBLIC": "Open",
    "OFFICIAL": "Shared",
    "OFFICIAL-SENSITIVE": "Confidential",
    "SECRET": "Secret",
    "TOP SECRET": "Top Secret",
}

CLASSIFICATION_LINE = re.compile(
    r"^(\|\s*\*\*Classification\*\*\s*\|\s*)(PUBLIC|OFFICIAL|OFFICIAL-SENSITIVE|SECRET|TOP SECRET)(\s*\|)$",
    re.MULTILINE,
)


def propose(text: str) -> tuple[str, list[tuple[str, str]]]:
    changes: list[tuple[str, str]] = []

    def replace(match: re.Match) -> str:
        old = match.group(2)
        new = MAPPING.get(old, old)
        changes.append((old, new))
        return f"{match.group(1)}{new}{match.group(3)}"

    new_text = CLASSIFICATION_LINE.sub(replace, text)
    return new_text, changes


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Migrate ArcKit Document Control Classification values from UK ladder to UAE Smart Data ladder.",
    )
    parser.add_argument(
        "--apply",
        action="store_true",
        help="Apply the proposed mappings (default: report only)",
    )
    parser.add_argument(
        "--root",
        default="projects",
        help="Root directory to walk (default: projects)",
    )
    args = parser.parse_args()

    root = Path(args.root)
    if not root.is_dir():
        print(f"not a directory: {root}", file=sys.stderr)
        return 2

    total_files = 0
    total_changes = 0
    for art in sorted(root.glob("**/ARC-*.md")):
        text = art.read_text(encoding="utf-8")
        new_text, changes = propose(text)
        if not changes:
            continue
        total_files += 1
        for old, new in changes:
            total_changes += 1
            print(f"{art}: {old} -> {new}")
        if args.apply:
            art.write_text(new_text, encoding="utf-8")

    action = "applied" if args.apply else "proposed (use --apply to write)"
    print(f"\n{total_changes} change(s) {action} across {total_files} file(s).")
    return 0


if __name__ == "__main__":
    sys.exit(main())
