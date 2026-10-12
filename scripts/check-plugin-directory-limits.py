#!/usr/bin/env python3
"""Check staged Claude plugin folders against the plugin directory's file rules.

The Claude plugin directory holds a plugin for a reviewer when its folder breaks
any of these ("Files or downloads the validator couldn't inspect"), per
https://claude.com/docs/plugins/pre-submission-checklist#files-in-the-plugin-folder:

- a file that isn't an image or font is 256 KiB or more
- the plugin has more than 512 files
- a binary file other than a PNG, JPEG, GIF or WebP image or a font

Core ArcKit was held on 6.17.3 to 6.18.0 for the first two: a 321 KiB
CHANGELOG.md and 587 files. This script reads a staged arckit-claude repository
(what scripts/push-extensions.sh builds before it pushes), finds every plugin
folder its marketplace lists, and fails if any folder breaks a rule. A folder
counts everything under it, so plugins/au includes the nested plugins/au/energy,
as the directory sees it.

Usage:
    python3 scripts/check-plugin-directory-limits.py STAGED_REPO
"""

from __future__ import annotations

import json
import sys
from pathlib import Path

MAX_FILES = 512
MAX_FILE_BYTES = 256 * 1024
IMAGE_SUFFIXES = {".png", ".jpg", ".jpeg", ".gif", ".webp"}
FONT_SUFFIXES = {".woff", ".woff2", ".ttf", ".otf"}


def is_binary(path: Path) -> bool:
    with path.open("rb") as f:
        return b"\0" in f.read(8192)


def plugin_folders(staged: Path) -> list[Path]:
    marketplace = json.loads((staged / ".claude-plugin" / "marketplace.json").read_text(encoding="utf-8"))
    return [staged / p["source"].removeprefix("./") for p in marketplace["plugins"]]


def violations(folder: Path) -> list[str]:
    files = sorted(p for p in folder.rglob("*") if p.is_file())
    problems = []
    if len(files) > MAX_FILES:
        problems.append(f"{len(files)} files (limit {MAX_FILES})")
    for path in files:
        rel = path.relative_to(folder)
        suffix = path.suffix.lower()
        if suffix in IMAGE_SUFFIXES or suffix in FONT_SUFFIXES:
            continue
        size = path.stat().st_size
        if size >= MAX_FILE_BYTES:
            problems.append(f"{rel}: {size / 1024:.0f} KiB (limit {MAX_FILE_BYTES // 1024} KiB)")
        if is_binary(path):
            problems.append(f"{rel}: binary file the validator can't read")
    return problems


def main(argv: list[str]) -> int:
    if len(argv) != 2:
        print(__doc__, file=sys.stderr)
        return 2
    staged = Path(argv[1])
    failed = False
    for folder in plugin_folders(staged):
        problems = violations(folder)
        count = sum(1 for p in folder.rglob("*") if p.is_file())
        rel = folder.relative_to(staged)
        if problems:
            failed = True
            print(f"FAIL {rel} ({count} files)", file=sys.stderr)
            for problem in problems:
                print(f"  {problem}", file=sys.stderr)
        else:
            print(f"ok   {rel} ({count} files)")
    if failed:
        print(
            "\nThe Claude plugin directory holds a version that breaks these rules for a "
            "reviewer.\nShip fewer or smaller files; see the docstring of this script.",
            file=sys.stderr,
        )
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))
