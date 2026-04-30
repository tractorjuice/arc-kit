#!/usr/bin/env python3
"""
Replace each template's `## Document Control` table with a marker that the
command runtime resolves to the UK or UAE partial. Idempotent — running twice
leaves the file unchanged.

Usage:
  python scripts/python/apply_doc_control_marker.py <template-dir>

Exits 0 with a count of files modified.
"""
import re
import sys
from pathlib import Path

MARKER = "<!-- DOC-CONTROL-HEADER -->\n<!-- Resolved at command-execution time to _partials/document-control-uk.md or _partials/document-control-uae.md based on plugin userConfig classification_scheme + governance_framework. See _partials/RENDERING.md (when present). -->\n"

# Match from "## Document Control" up to (but not including) the next "## " heading.
PATTERN = re.compile(r"## Document Control\n.*?(?=\n## )", re.DOTALL)

def transform(path: Path) -> bool:
    text = path.read_text(encoding="utf-8")
    if MARKER in text:
        return False  # already migrated
    if not PATTERN.search(text):
        return False  # no Document Control section to migrate
    new = PATTERN.sub("## Document Control\n\n" + MARKER, text)
    if new == text:
        return False
    path.write_text(new, encoding="utf-8")
    return True

def main() -> int:
    if len(sys.argv) != 2:
        print("usage: apply_doc_control_marker.py <template-dir>", file=sys.stderr)
        return 2
    target = Path(sys.argv[1])
    if not target.is_dir():
        print(f"not a directory: {target}", file=sys.stderr)
        return 2
    modified = 0
    for md in sorted(target.glob("*.md")):
        if transform(md):
            modified += 1
            print(f"modified: {md}")
    print(f"\nTotal modified: {modified}")
    return 0

if __name__ == "__main__":
    sys.exit(main())
