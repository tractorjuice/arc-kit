#!/usr/bin/env python3
"""Assert MULTI_INSTANCE_TYPES is identical across its three registries.

The list of multi-instance doc-types lives in one JavaScript file and two
copies of a bash script:

  plugins/arckit-claude/config/doc-types.mjs   (MULTI_INSTANCE_TYPES set)
  scripts/bash/generate-document-id.sh         (space-separated string)
  plugins/arckit-claude/scripts/bash/generate-document-id.sh

Drift is silent and destructive. If a type is present in the .mjs set but
absent from bash, generate-document-id.sh returns an ID with no -NNN- sequence,
so every run of that multi-instance command emits the SAME id and overwrites
the previous artefact. That shipped twice: TNDR/CMPT (fixed v5.9.2, PR #566)
and GRNT (found 2026-07 while adding CDAU).

Exit 0 when all three agree, 1 otherwise.
"""

from __future__ import annotations

import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

MJS = ROOT / "plugins/arckit-claude/config/doc-types.mjs"
BASH_COPIES = (
    ROOT / "scripts/bash/generate-document-id.sh",
    ROOT / "plugins/arckit-claude/scripts/bash/generate-document-id.sh",
)


def parse_mjs(path: Path) -> set[str]:
    """Extract the codes inside `export const MULTI_INSTANCE_TYPES = new Set([...])`."""
    text = path.read_text(encoding="utf-8")
    match = re.search(
        r"export\s+const\s+MULTI_INSTANCE_TYPES\s*=\s*new\s+Set\(\s*\[(.*?)\]\s*\)",
        text,
        re.DOTALL,
    )
    if not match:
        raise SystemExit(f"ERROR: MULTI_INSTANCE_TYPES set not found in {path}")
    # Strip line comments so a commented-out code is not counted as registered.
    body = re.sub(r"//[^\n]*", "", match.group(1))
    return set(re.findall(r"['\"]([A-Z0-9-]+)['\"]", body))


def parse_bash(path: Path) -> set[str]:
    """Extract the codes from `MULTI_INSTANCE_TYPES="A B C"`."""
    text = path.read_text(encoding="utf-8")
    match = re.search(r'^MULTI_INSTANCE_TYPES="([^"]*)"', text, re.MULTILINE)
    if not match:
        raise SystemExit(f"ERROR: MULTI_INSTANCE_TYPES assignment not found in {path}")
    return set(match.group(1).split())


def main() -> int:
    expected = parse_mjs(MJS)
    if not expected:
        print(f"ERROR: parsed an empty set from {MJS.relative_to(ROOT)}", file=sys.stderr)
        return 1

    failed = False
    for bash_path in BASH_COPIES:
        actual = parse_bash(bash_path)
        rel = bash_path.relative_to(ROOT)

        missing = sorted(expected - actual)
        extra = sorted(actual - expected)

        if missing:
            failed = True
            print(f"FAIL {rel}", file=sys.stderr)
            print(
                f"  missing {len(missing)}: {', '.join(missing)}",
                file=sys.stderr,
            )
            print(
                "  effect: generate-document-id.sh returns an ID with no -NNN- "
                "sequence for these types, so each run overwrites the last artefact.",
                file=sys.stderr,
            )
        if extra:
            failed = True
            print(f"FAIL {rel}", file=sys.stderr)
            print(
                f"  not registered in doc-types.mjs ({len(extra)}): {', '.join(extra)}",
                file=sys.stderr,
            )
        if not missing and not extra:
            print(f"OK   {rel} ({len(actual)} types)")

    if failed:
        print(
            "\nFix: make the bash MULTI_INSTANCE_TYPES string match the .mjs set "
            "in BOTH copies of generate-document-id.sh.",
            file=sys.stderr,
        )
        return 1

    print(f"\nMulti-instance parity OK: {len(expected)} types across 3 registries.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
