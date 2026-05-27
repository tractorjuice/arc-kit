#!/usr/bin/env python3
"""Sync shared template partials and references from arckit-claude/ (core) into
every community plugin tree.

Background: community-overlay commands reference partials and references via
`${CLAUDE_PLUGIN_ROOT}/templates/_partials/...` and `${CLAUDE_PLUGIN_ROOT}/
references/...`. `${CLAUDE_PLUGIN_ROOT}` resolves to each plugin's own root, so
those files must exist inside each community plugin tree — not just in core.
Closes #520.

Usage:

    scripts/sync-shared-assets.py             # write copies
    scripts/sync-shared-assets.py --check     # exit 1 if any drift (CI guard)
"""

from __future__ import annotations

import argparse
import filecmp
import shutil
import sys
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent
CORE_PLUGIN = REPO_ROOT / "arckit-claude"
SHARED_DIRS = ("templates/_partials", "references")


def discover_community_plugins() -> list[Path]:
    """Return every arckit-*/ directory with a Claude Code plugin manifest,
    excluding the core arckit-claude plugin itself."""
    return sorted(
        p.parent.parent
        for p in REPO_ROOT.glob("arckit-*/.claude-plugin/plugin.json")
        if p.parent.parent.name != "arckit-claude"
    )


def iter_shared_files() -> list[Path]:
    """Return every shared-asset file under the core plugin tree."""
    files: list[Path] = []
    for rel in SHARED_DIRS:
        src_dir = CORE_PLUGIN / rel
        if not src_dir.exists():
            continue
        files.extend(sorted(p for p in src_dir.rglob("*") if p.is_file()))
    return files


def relative_to_core(path: Path) -> Path:
    return path.relative_to(CORE_PLUGIN)


def check(community_plugins: list[Path], shared: list[Path]) -> int:
    drift: list[tuple[Path, str]] = []  # (path, reason)
    for plugin in community_plugins:
        for src in shared:
            dst = plugin / relative_to_core(src)
            if not dst.exists():
                drift.append((dst, "missing"))
            elif not filecmp.cmp(src, dst, shallow=False):
                drift.append((dst, "drifted from core"))
    if drift:
        print("Shared-asset drift detected:", file=sys.stderr)
        for path, reason in drift:
            print(f"  {path.relative_to(REPO_ROOT)} — {reason}", file=sys.stderr)
        print(
            "\nRun `scripts/sync-shared-assets.py` to regenerate.",
            file=sys.stderr,
        )
        return 1
    print(
        f"All {len(shared)} shared assets present in "
        f"{len(community_plugins)} community plugins."
    )
    return 0


def write(community_plugins: list[Path], shared: list[Path]) -> int:
    written = 0
    for plugin in community_plugins:
        for src in shared:
            dst = plugin / relative_to_core(src)
            dst.parent.mkdir(parents=True, exist_ok=True)
            if dst.exists() and filecmp.cmp(src, dst, shallow=False):
                continue
            shutil.copy2(src, dst)
            written += 1
            print(f"  {dst.relative_to(REPO_ROOT)}")
    print(
        f"\nSynced {written} file(s) into {len(community_plugins)} community plugin(s)."
    )
    return 0


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--check",
        action="store_true",
        help="Exit non-zero on drift; do not write.",
    )
    args = parser.parse_args()

    community_plugins = discover_community_plugins()
    shared = iter_shared_files()

    if not community_plugins:
        print("No community plugins discovered.", file=sys.stderr)
        return 1
    if not shared:
        print(
            f"No shared assets discovered under {CORE_PLUGIN}/{{{','.join(SHARED_DIRS)}}}",
            file=sys.stderr,
        )
        return 1

    if args.check:
        return check(community_plugins, shared)
    return write(community_plugins, shared)


if __name__ == "__main__":
    sys.exit(main())
