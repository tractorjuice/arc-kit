#!/usr/bin/env python3
"""Mirror Claude overlay plugins into the local standalone repo layout."""

from __future__ import annotations

import argparse
from pathlib import Path
import shutil
import sys


REPO_ROOT = Path(__file__).resolve().parents[1]
CORE_PLUGIN_DIR = REPO_ROOT / "plugins" / "arckit-claude"
PLUGIN_LAYOUT = (
    ("plugins/arckit-uae", "plugins/uae"),
    ("plugins/arckit-fr", "plugins/fr"),
    ("plugins/arckit-ca", "plugins/ca"),
    ("plugins/arckit-eu", "plugins/eu"),
    ("plugins/arckit-at", "plugins/at"),
    ("plugins/arckit-au", "plugins/au"),
    ("plugins/arckit-au-energy", "plugins/au/energy"),
    ("plugins/arckit-us", "plugins/us"),
    ("plugins/arckit-uk-finance", "plugins/uk/finance"),
    ("plugins/arckit-uk-nhs", "plugins/uk/nhs"),
    ("plugins/arckit-fde", "plugins/fde"),
    ("plugins/arckit-uk-gcloud", "plugins/uk/gcloud"),
    ("plugins/arckit-togaf-adm", "plugins/togaf/adm"),
    ("plugins/arckit-agent-architecture", "plugins/agent/architecture"),
    ("plugins/arckit-repo", "plugins/repo"),
)
IGNORED_NAMES = {
    ".git",
    "node_modules",
    ".npm",
    ".pnpm-store",
}


def ignore_generated(_directory: str, names: list[str]) -> set[str]:
    return {name for name in names if name in IGNORED_NAMES}


# --- Claude Code overlay command namespacing ------------------------------
#
# The rewrite itself lives in claude_command_namespacing.py, shared with
# push-extensions.sh. This mirror alone is NOT enough: the push script copies
# the core plugin (which contains this mirror) and then tar-extracts the raw
# overlay sources over the same paths, overwriting it. Both call sites apply it.

sys.path.insert(0, str(Path(__file__).resolve().parent))
from claude_command_namespacing import (  # noqa: E402
    REWRITABLE_SUFFIXES,
    namespace_tree,
    command_namespaces,
    invocation_pattern as _invocation_pattern,
    publish_bytes,
    rewrite as rewrite_overlay_invocations,
)


def copy_tree(source: Path, destination: Path) -> None:
    if destination.exists():
        shutil.rmtree(destination)
    destination.parent.mkdir(parents=True, exist_ok=True)
    shutil.copytree(source, destination, ignore=ignore_generated)

    namespace_tree(destination)


def expected_files() -> dict[Path, Path]:
    expected: dict[Path, Path] = {}

    for source_rel, destination_rel in PLUGIN_LAYOUT:
        source = REPO_ROOT / source_rel
        destination = CORE_PLUGIN_DIR / destination_rel
        if not source.is_dir():
            raise FileNotFoundError(f"Source plugin directory not found: {source_rel}")

        for path in source.rglob("*"):
            if not path.is_file() or any(part in IGNORED_NAMES for part in path.parts):
                continue
            relative = path.relative_to(source)
            target = destination / relative
            if target in expected:
                previous = expected[target].relative_to(REPO_ROOT)
                raise RuntimeError(
                    f"Duplicate Claude standalone target {target.relative_to(REPO_ROOT)} "
                    f"from {previous} and {path.relative_to(REPO_ROOT)}"
                )
            expected[target] = path

    return expected


def actual_files() -> set[Path]:
    plugin_root = CORE_PLUGIN_DIR / "plugins"
    if not plugin_root.exists():
        return set()
    return {
        path
        for path in plugin_root.rglob("*")
        if path.is_file() and not any(part in IGNORED_NAMES for part in path.parts)
    }


def check_layout() -> list[str]:
    expected = expected_files()
    actual = actual_files()
    failures: list[str] = []

    for missing in sorted(set(expected) - actual):
        failures.append(f"missing: {missing.relative_to(REPO_ROOT)}")

    for extra in sorted(actual - set(expected)):
        failures.append(f"extra: {extra.relative_to(REPO_ROOT)}")

    namespaces = command_namespaces()
    pattern = _invocation_pattern(namespaces)

    for target, source in sorted(expected.items()):
        if target not in actual:
            continue
        # Compare against the source as it should look *after* publish-time
        # rewriting, not the raw source, or every namespaced file reads as drift.
        if target.read_bytes() != publish_bytes(source, namespaces, pattern):
            failures.append(
                "changed: "
                f"{target.relative_to(REPO_ROOT)} differs from {source.relative_to(REPO_ROOT)}"
            )

    return failures


def sync_layout() -> int:
    plugin_root = CORE_PLUGIN_DIR / "plugins"
    if plugin_root.exists():
        shutil.rmtree(plugin_root)

    for source_rel, destination_rel in PLUGIN_LAYOUT:
        source = REPO_ROOT / source_rel
        destination = CORE_PLUGIN_DIR / destination_rel
        if not source.is_dir():
            print(f"Source plugin directory not found: {source_rel}", file=sys.stderr)
            return 1
        copy_tree(source, destination)

    synced_count = len(expected_files())
    print(
        "Synced "
        f"{synced_count} files into {plugin_root.relative_to(REPO_ROOT)}/"
    )
    return 0


def main() -> int:
    parser = argparse.ArgumentParser(
        description=(
            "Synchronize plugins/arckit-claude/plugins/... with the published "
            "tractorjuice/arckit-claude standalone repository layout."
        )
    )
    parser.add_argument(
        "--check",
        action="store_true",
        help="verify the local standalone layout without modifying files",
    )
    args = parser.parse_args()

    if args.check:
        failures = check_layout()
        if failures:
            print("Claude standalone plugin layout is out of sync:", file=sys.stderr)
            for failure in failures[:50]:
                print(f"  {failure}", file=sys.stderr)
            if len(failures) > 50:
                print(f"  ... {len(failures) - 50} more", file=sys.stderr)
            return 1
        print("Claude standalone plugin layout is in sync")
        return 0

    return sync_layout()


if __name__ == "__main__":
    raise SystemExit(main())
