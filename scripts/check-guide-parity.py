#!/usr/bin/env python3
"""Enforce parity between the two `docs/guides/` trees.

ArcKit keeps user guides in two places:

  docs/guides/                        <- CANONICAL. The published site, and the
                                         CLI package data shipped via pyproject
                                         shared-data.
  plugins/arckit-claude/docs/guides/  <- the copy `scripts/converter.py` pushes
                                         into all seven generated extensions.

Nothing used to keep those in step. `sync-shared-assets.py` covers
`templates/_partials/` and `references/` but has never touched `docs/guides`, so
the two trees drifted silently and in BOTH directions -- the plugin tree lost
whole sections (including one four other guides linked to, leaving a dead
anchor), while the root tree went stale on a doc-type code and a config path.
See arc-kit#580 / PR #674.

The rule this script enforces: for every guide present in the plugin tree, the
root copy is canonical and the two must be byte-identical. Guides that exist
only at root are fine -- community-overlay and maintainer guides deliberately do
not ship to extensions -- but a guide present only in the PLUGIN tree is an
error, because it can never reach the site or the CLI package.

Usage:
    python3 scripts/check-guide-parity.py            # report drift, exit 1 if any
    python3 scripts/check-guide-parity.py --check    # same (CI-friendly alias)
    python3 scripts/check-guide-parity.py --sync     # copy root -> plugin, exit 0

`--sync` only ever writes to the plugin tree. If the plugin copy is the one
holding the correct content, port that content into the root copy BY HAND first,
then sync -- otherwise the sync silently destroys it.
"""

from __future__ import annotations

import argparse
import shutil
import sys
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent
ROOT_GUIDES = REPO_ROOT / "docs" / "guides"
PLUGIN_GUIDES = REPO_ROOT / "plugins" / "arckit-claude" / "docs" / "guides"

# Guides that intentionally live only at root and are NOT shipped to extensions:
# community-overlay documentation (the overlays are separate plugins with their
# own distribution) and repo-maintainer docs (meaningless to an end user).
# A root-only guide needs no entry here -- this list exists only to document
# intent. Add to it when you add a guide that must never reach the plugin tree.
ROOT_ONLY_BY_DESIGN = {
    "au-federal-overlay.md",
    "deepbook.md",
    "testing-plugin-branches.md",
    "uae-overlay-maintenance.md",
    "uae-overlay.md",
    "uk-fs-payments-overlay.md",
    "uk-nhs-clinical-safety-overlay.md",
    "us-federal-overlay.md",
}


def relative_guides(tree: Path) -> set[str]:
    if not tree.is_dir():
        return set()
    return {str(p.relative_to(tree)) for p in tree.rglob("*.md")}


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--check", action="store_true", help="report drift only (default)")
    parser.add_argument("--sync", action="store_true", help="copy root -> plugin for drifted guides")
    args = parser.parse_args()

    for tree in (ROOT_GUIDES, PLUGIN_GUIDES):
        if not tree.is_dir():
            print(f"ERROR: guide tree not found: {tree.relative_to(REPO_ROOT)}", file=sys.stderr)
            return 2

    root_set = relative_guides(ROOT_GUIDES)
    plugin_set = relative_guides(PLUGIN_GUIDES)

    plugin_only = sorted(plugin_set - root_set)
    drifted = sorted(
        rel for rel in (plugin_set & root_set)
        if (ROOT_GUIDES / rel).read_bytes() != (PLUGIN_GUIDES / rel).read_bytes()
    )

    if args.sync:
        for rel in drifted:
            shutil.copy2(ROOT_GUIDES / rel, PLUGIN_GUIDES / rel)
            print(f"synced  docs/guides/{rel} -> plugins/arckit-claude/docs/guides/{rel}")
        if plugin_only:
            print(
                f"\nNOT synced: {len(plugin_only)} guide(s) exist only in the plugin tree. "
                "Move them to docs/guides/ by hand -- --sync never writes to the root tree.",
                file=sys.stderr,
            )
            for rel in plugin_only:
                print(f"  plugin-only: {rel}", file=sys.stderr)
            return 1
        if not drifted:
            print("Guide trees already in parity -- nothing to sync.")
        return 0

    if not drifted and not plugin_only:
        shared = len(plugin_set & root_set)
        root_only = len(root_set - plugin_set)
        undocumented = sorted((root_set - plugin_set) - ROOT_ONLY_BY_DESIGN)
        print(f"Guide parity OK: {shared} shared guides identical, {root_only} root-only.")
        if undocumented:
            print(
                f"\nNote: {len(undocumented)} root-only guide(s) are not listed in "
                "ROOT_ONLY_BY_DESIGN. If they should ship to extensions, copy them into "
                "plugins/arckit-claude/docs/guides/; if not, add them to the set in this script."
            )
            for rel in undocumented:
                print(f"  {rel}")
        return 0

    if drifted:
        print(f"Guide parity FAILED: {len(drifted)} guide(s) differ between the two trees.\n", file=sys.stderr)
        for rel in drifted:
            print(f"  drift: docs/guides/{rel}", file=sys.stderr)
        print(
            "\ndocs/guides/ is canonical. Fix with:\n"
            "    python3 scripts/check-guide-parity.py --sync\n\n"
            "But FIRST diff each file. Drift has historically run in both directions, and\n"
            "--sync overwrites the plugin copy with the root copy:\n"
            "    diff docs/guides/<f> plugins/arckit-claude/docs/guides/<f>\n"
            "If the plugin copy holds the correct content, port it into the root copy by\n"
            "hand before syncing.",
            file=sys.stderr,
        )

    if plugin_only:
        print(
            f"\nGuide parity FAILED: {len(plugin_only)} guide(s) exist only in the plugin tree.\n"
            "These can never reach the published site or the CLI package. Move each into\n"
            "docs/guides/ (keeping the plugin copy in step).",
            file=sys.stderr,
        )
        for rel in plugin_only:
            print(f"  plugin-only: {rel}", file=sys.stderr)

    return 1


if __name__ == "__main__":
    sys.exit(main())
