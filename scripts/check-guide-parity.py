#!/usr/bin/env python3
"""Enforce parity between `docs/guides/` and the plugin guide trees.

ArcKit keeps user guides in these places:

  docs/guides/                         <- CANONICAL. The published site, and the
                                          CLI package data shipped via pyproject
                                          shared-data.
  plugins/arckit-claude/docs/guides/   <- core's guides. They ship in the core
                                          Claude plugin, and `scripts/converter.py`
                                          pushes them into all seven generated
                                          extensions.
  plugins/arckit-<overlay>/docs/guides/ <- each overlay's guides, for its own
                                          commands. They ship in that overlay, and
                                          the converter merges them into the
                                          extensions for the overlays it converts.

Nothing used to keep those in step. `sync-shared-assets.py` covers
`templates/_partials/` and `references/` but has never touched `docs/guides`, so
the root and core trees drifted silently and in BOTH directions -- the plugin
tree lost whole sections (including one four other guides linked to, leaving a
dead anchor), while the root tree went stale on a doc-type code and a config
path. See arc-kit#580 / PR #674.

Overlay guides used to sit in the core tree too, which put 111 guides for
commands core doesn't have into every core install and took the core plugin
past the Claude plugin directory's 512-file limit. They now live with their
overlay.

The rules this script enforces:

- For every guide in a plugin tree, the root copy is canonical and the two must
  be byte-identical.
- A guide present only in a PLUGIN tree is an error, because it can never reach
  the site or the CLI package.
- A guide may sit in only one plugin tree.
- A guide for an overlay command belongs in that overlay's tree, not core's.

Guides that exist only at root are fine -- some community-overlay and
maintainer guides deliberately do not ship.

Usage:
    python3 scripts/check-guide-parity.py            # report drift, exit 1 if any
    python3 scripts/check-guide-parity.py --check    # same (CI-friendly alias)
    python3 scripts/check-guide-parity.py --sync     # copy root -> plugin trees, exit 0

`--sync` only ever writes to the plugin trees. If a plugin copy is the one
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
PLUGINS_DIR = REPO_ROOT / "plugins"
CORE_PLUGIN = PLUGINS_DIR / "arckit-claude"
PLUGIN_GUIDES = CORE_PLUGIN / "docs" / "guides"

# Guides that intentionally live only at root and ship in no plugin: overlay
# overviews (each overlay's README covers the same ground) and repo-maintainer
# docs (meaningless to an end user).
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


def overlay_plugins() -> list[Path]:
    """Every overlay plugin source folder (not the nested mirror inside core)."""
    return sorted(
        p for p in PLUGINS_DIR.glob("arckit-*")
        if p.is_dir() and p != CORE_PLUGIN and (p / ".claude-plugin" / "plugin.json").is_file()
    )


def command_stems(plugin: Path) -> set[str]:
    commands = plugin / "commands"
    return {p.stem for p in commands.glob("*.md")} if commands.is_dir() else set()


def rel(path: Path) -> str:
    return str(path.relative_to(REPO_ROOT))


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--check", action="store_true", help="report drift only (default)")
    parser.add_argument("--sync", action="store_true", help="copy root -> plugin trees for drifted guides")
    args = parser.parse_args()

    for tree in (ROOT_GUIDES, PLUGIN_GUIDES):
        if not tree.is_dir():
            print(f"ERROR: guide tree not found: {rel(tree)}", file=sys.stderr)
            return 2

    overlays = overlay_plugins()
    trees = [PLUGIN_GUIDES] + [o / "docs" / "guides" for o in overlays if (o / "docs" / "guides").is_dir()]

    root_set = relative_guides(ROOT_GUIDES)
    plugin_sets = {tree: relative_guides(tree) for tree in trees}

    plugin_only = sorted(
        (tree, g) for tree, guides in plugin_sets.items() for g in guides - root_set
    )
    drifted = sorted(
        (tree, g) for tree, guides in plugin_sets.items() for g in guides & root_set
        if (ROOT_GUIDES / g).read_bytes() != (tree / g).read_bytes()
    )

    holders: dict[str, list[Path]] = {}
    for tree, guides in plugin_sets.items():
        for g in guides:
            holders.setdefault(g, []).append(tree)
    duplicated = sorted((g, ts) for g, ts in holders.items() if len(ts) > 1)

    core_commands = command_stems(CORE_PLUGIN)
    overlay_owner = {stem: o for o in overlays for stem in command_stems(o)}
    misplaced = sorted(
        (g, overlay_owner[Path(g).stem]) for g in plugin_sets[PLUGIN_GUIDES]
        if "/" not in g and Path(g).stem not in core_commands and Path(g).stem in overlay_owner
    )

    if args.sync:
        for tree, g in drifted:
            shutil.copy2(ROOT_GUIDES / g, tree / g)
            print(f"synced  docs/guides/{g} -> {rel(tree / g)}")
        if plugin_only:
            print(
                f"\nNOT synced: {len(plugin_only)} guide(s) exist only in a plugin tree. "
                "Move them to docs/guides/ by hand -- --sync never writes to the root tree.",
                file=sys.stderr,
            )
            for tree, g in plugin_only:
                print(f"  plugin-only: {rel(tree / g)}", file=sys.stderr)
            return 1
        if not drifted:
            print("Guide trees already in parity -- nothing to sync.")
        return 0

    if not drifted and not plugin_only and not duplicated and not misplaced:
        shipped = set().union(*plugin_sets.values())
        root_only = len(root_set - shipped)
        undocumented = sorted((root_set - shipped) - ROOT_ONLY_BY_DESIGN)
        print(
            f"Guide parity OK: {len(shipped)} shipped guides identical to docs/guides/ "
            f"across {len(trees)} plugin trees, {root_only} root-only."
        )
        if undocumented:
            print(
                f"\nNote: {len(undocumented)} root-only guide(s) are not listed in "
                "ROOT_ONLY_BY_DESIGN. If they should ship, copy each into the docs/guides/ "
                "of the plugin that owns the command (plugins/arckit-claude/ for core); "
                "if not, add them to the set in this script."
            )
            for g in undocumented:
                print(f"  {g}")
        return 0

    if drifted:
        print(f"Guide parity FAILED: {len(drifted)} guide(s) differ from docs/guides/.\n", file=sys.stderr)
        for tree, g in drifted:
            print(f"  drift: {rel(tree / g)}", file=sys.stderr)
        print(
            "\ndocs/guides/ is canonical. Fix with:\n"
            "    python3 scripts/check-guide-parity.py --sync\n\n"
            "But FIRST diff each file. Drift has historically run in both directions, and\n"
            "--sync overwrites the plugin copy with the root copy:\n"
            "    diff docs/guides/<f> plugins/<plugin>/docs/guides/<f>\n"
            "If the plugin copy holds the correct content, port it into the root copy by\n"
            "hand before syncing.",
            file=sys.stderr,
        )

    if plugin_only:
        print(
            f"\nGuide parity FAILED: {len(plugin_only)} guide(s) exist only in a plugin tree.\n"
            "These can never reach the published site or the CLI package. Move each into\n"
            "docs/guides/ (keeping the plugin copy in step).",
            file=sys.stderr,
        )
        for tree, g in plugin_only:
            print(f"  plugin-only: {rel(tree / g)}", file=sys.stderr)

    if duplicated:
        print(
            f"\nGuide parity FAILED: {len(duplicated)} guide(s) sit in more than one plugin tree.\n"
            "Keep each guide in the one plugin that owns its command.",
            file=sys.stderr,
        )
        for g, ts in duplicated:
            print(f"  {g}: " + ", ".join(rel(t) for t in ts), file=sys.stderr)

    if misplaced:
        print(
            f"\nGuide parity FAILED: {len(misplaced)} overlay guide(s) sit in core's tree.\n"
            "Core ships every guide in its tree to every install, and the Claude plugin\n"
            "directory holds a plugin with more than 512 files for review. Move each guide\n"
            "to the overlay that owns the command:",
            file=sys.stderr,
        )
        for g, owner in misplaced:
            print(f"  git mv {rel(PLUGIN_GUIDES / g)} {rel(owner / 'docs' / 'guides' / g)}", file=sys.stderr)

    return 1


if __name__ == "__main__":
    sys.exit(main())
