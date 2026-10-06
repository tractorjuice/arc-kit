#!/usr/bin/env python3
"""Keep the shipped plugin CHANGELOG small; move older releases to an archive.

`plugins/arckit-claude/CHANGELOG.md` ships inside the core plugin, and the
Claude plugin directory's validator could not inspect it at 319 KB: it was one
of the two findings behind the "Files or downloads the validator couldn't
inspect" policy hold on v6.17.3 and v6.17.5. (A 211 KB template in the same
plugin was read without complaint, so the limit sits somewhere between.)

This script keeps the newest releases in the shipped file and moves the rest,
newest first, to `docs/changelog/arckit-plugin-archive.md`, which
`push-extensions.sh` never ships. It cuts only between minor series, so a
6.12.x series moves as a whole, and it keeps whole series while the file stays
within TARGET_BYTES. `[Unreleased]` and the newest series always stay. A line
under the title links to the archive and names the oldest release kept.

Usage:
    python3 scripts/trim-plugin-changelog.py          # move old releases to the archive
    python3 scripts/trim-plugin-changelog.py --check  # exit 1 if the file is over LIMIT_BYTES

`bump-version.sh` runs the trim on every release, and CI runs `--check`.
"""

from __future__ import annotations

import argparse
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
PLUGIN_CHANGELOG = ROOT / "plugins/arckit-claude/CHANGELOG.md"
ARCHIVE = ROOT / "docs/changelog/arckit-plugin-archive.md"
ARCHIVE_URL = "https://github.com/tractorjuice/arc-kit/blob/main/docs/changelog/arckit-plugin-archive.md"

TARGET_BYTES = 64 * 1024   # the trim keeps whole minor series up to this size
LIMIT_BYTES = 128 * 1024   # --check fails above this

SECTION_RE = re.compile(r"^## \[([^\]]+)\]", re.MULTILINE)
VERSION_RE = re.compile(r"^(\d+)\.(\d+)\.\d+$")
POINTER_PREFIX = "Releases before "

ARCHIVE_HEADER = """# Changelog archive — ArcKit Plugin

Older releases of the ArcKit Claude Code plugin, newest first. They moved here
from `plugins/arckit-claude/CHANGELOG.md` to keep the shipped file small;
`scripts/trim-plugin-changelog.py` moves each series as it ages out.

"""


def split(text: str) -> tuple[str, list[tuple[str, str]]]:
    """Return (preamble, [(version, section text), ...]) in file order."""
    starts = [(m.start(), m.group(1)) for m in SECTION_RE.finditer(text)]
    if not starts:
        return text, []
    sections = []
    for i, (pos, version) in enumerate(starts):
        end = starts[i + 1][0] if i + 1 < len(starts) else len(text)
        sections.append((version, text[pos:end]))
    return text[: starts[0][0]], sections


def series(version: str) -> tuple[int, int] | None:
    m = VERSION_RE.match(version)
    return (int(m.group(1)), int(m.group(2))) if m else None


def size(text: str) -> int:
    return len(text.encode("utf-8"))


def without_pointer(preamble: str) -> str:
    lines = [line for line in preamble.rstrip("\n").split("\n") if not line.startswith(POINTER_PREFIX)]
    while lines and lines[-1] == "":
        lines.pop()
    return "\n".join(lines) + "\n\n"


def with_pointer(preamble: str, oldest_kept: str) -> str:
    """Add or refresh the line that links to the archive."""
    pointer = (
        f"{POINTER_PREFIX}{oldest_kept} are in the "
        f"[changelog archive]({ARCHIVE_URL})."
    )
    return without_pointer(preamble) + pointer + "\n\n"


def trim(plugin_text: str, archive_text: str | None) -> tuple[str, str | None, list[str]]:
    """Return (new plugin text, new archive text, versions moved)."""
    preamble, sections = split(plugin_text)
    keep: list[tuple[str, str]] = []
    move: list[tuple[str, str]] = []
    # Measure without any existing pointer line and reserve room for a fresh
    # one, so a second run sees the same total and moves nothing.
    total = size(without_pointer(preamble)) + 200
    current: tuple[int, int] | None = None
    series_seen = 0
    for version, body in sections:
        s = series(version)
        if s is None:  # [Unreleased] and anything unversioned stays
            keep.append((version, body))
            total += size(body)
            continue
        if move:
            move.append((version, body))
            continue
        if s != current:
            current = s
            series_seen += 1
            series_bytes = sum(size(b) for v, b in sections if series(v) == s)
            if series_seen > 1 and total + series_bytes > TARGET_BYTES:
                move.append((version, body))
                continue
            total += series_bytes
        keep.append((version, body))

    if not move:
        return plugin_text, archive_text, []

    if archive_text is None:
        archive_text = ARCHIVE_HEADER
    archive_preamble, archived = split(archive_text)
    already = {v for v, _ in archived}
    clash = [v for v, _ in move if v in already]
    if clash:
        raise SystemExit(f"ERROR: already in the archive: {', '.join(clash)}")

    oldest_kept = [v for v, _ in keep if series(v)][-1]
    new_plugin = with_pointer(preamble, oldest_kept) + "".join(b for _, b in keep)
    new_plugin = new_plugin.rstrip("\n") + "\n"
    moved_text = "".join(b if b.endswith("\n\n") else b.rstrip("\n") + "\n\n" for _, b in move)
    new_archive = archive_preamble + moved_text + "".join(b for _, b in archived)
    new_archive = new_archive.rstrip("\n") + "\n"
    return new_plugin, new_archive, [v for v, _ in move]


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--check", action="store_true", help=f"exit 1 if the plugin CHANGELOG is over {LIMIT_BYTES // 1024} KB")
    args = parser.parse_args()

    plugin_text = PLUGIN_CHANGELOG.read_text(encoding="utf-8")
    current = size(plugin_text)

    if args.check:
        if current > LIMIT_BYTES:
            print(
                f"ERROR: {PLUGIN_CHANGELOG.relative_to(ROOT)} is {current // 1024} KB, over the "
                f"{LIMIT_BYTES // 1024} KB limit. Run: python3 scripts/trim-plugin-changelog.py",
                file=sys.stderr,
            )
            return 1
        print(f"Plugin CHANGELOG is {current // 1024} KB (limit {LIMIT_BYTES // 1024} KB).")
        return 0

    archive_text = ARCHIVE.read_text(encoding="utf-8") if ARCHIVE.is_file() else None
    new_plugin, new_archive, moved = trim(plugin_text, archive_text)
    if not moved:
        print(f"Plugin CHANGELOG is {current // 1024} KB; nothing to move.")
        return 0

    PLUGIN_CHANGELOG.write_text(new_plugin, encoding="utf-8")
    ARCHIVE.parent.mkdir(parents=True, exist_ok=True)
    ARCHIVE.write_text(new_archive, encoding="utf-8")
    print(
        f"Moved {len(moved)} releases ({moved[0]} back to {moved[-1]}) to "
        f"{ARCHIVE.relative_to(ROOT)}. Plugin CHANGELOG: {current // 1024} KB -> {size(new_plugin) // 1024} KB."
    )
    return 0


if __name__ == "__main__":
    sys.exit(main())
