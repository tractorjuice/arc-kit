#!/usr/bin/env python3
"""Mirror Claude overlay plugins into the local standalone repo layout."""

from __future__ import annotations

import argparse
import json
from pathlib import Path
import re
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
# `/arckit:X` is the canonical, platform-neutral notation in command sources,
# and scripts/converter.py rewrites it per target (Copilot gets `/arckit-X`,
# Codex/Kimi get their own skill prefixes, Gemini and OpenCode keep it because
# the converter merges every overlay into ONE flat `arckit` namespace).
#
# Claude Code is the only target with no rewrite step: it reads plugin command
# bodies verbatim and namespaces by the `name` in plugin.json. Core is named
# `arckit`, so `/arckit:adr` is right. Every overlay is named `arckit-<x>`, so
# `/arckit:uae-ai-charter` does NOT resolve — it is `/arckit-uae:uae-ai-charter`.
# Confirmed 2026-07-27: `arckit:repo-audit` returns "Unknown skill" while
# `arckit-repo:repo-docs` runs.
#
# So the published Claude overlays get the namespaced form, applied here at
# publish time, exactly as converter.py does for the other seven formats. The
# sources stay portable. Never rewrite the sources themselves.

REWRITABLE_SUFFIXES = {".md"}


def command_namespaces() -> dict[str, str]:
    """Map every non-core command name to its owning plugin's namespace."""
    namespaces: dict[str, str] = {}
    for source_rel, _ in PLUGIN_LAYOUT:
        manifest = REPO_ROOT / source_rel / ".claude-plugin" / "plugin.json"
        if not manifest.is_file():
            continue
        name = json.loads(manifest.read_text(encoding="utf-8")).get("name")
        if not name or name == "arckit":
            continue
        for command in (REPO_ROOT / source_rel / "commands").glob("*.md"):
            namespaces[command.stem] = name
    return namespaces


def _invocation_pattern(namespaces: dict[str, str]) -> re.Pattern[str] | None:
    if not namespaces:
        return None
    # Longest first so `fr-anssi-carto` is not matched as `fr-anssi`.
    alternatives = "|".join(
        re.escape(name) for name in sorted(namespaces, key=len, reverse=True)
    )
    return re.compile(rf"/arckit:({alternatives})\b")


def rewrite_overlay_invocations(text: str, pattern: re.Pattern[str] | None,
                                namespaces: dict[str, str]) -> str:
    """`/arckit:uae-ai-charter` -> `/arckit-uae:uae-ai-charter`.

    Core command references (`/arckit:adr`) are left alone: they are not in the
    map, so they never match.
    """
    if pattern is None:
        return text
    return pattern.sub(lambda m: f"/{namespaces[m.group(1)]}:{m.group(1)}", text)


def publish_bytes(source: Path, namespaces: dict[str, str],
                  pattern: re.Pattern[str] | None) -> bytes:
    """The exact bytes this source file should have once published."""
    raw = source.read_bytes()
    if source.suffix not in REWRITABLE_SUFFIXES:
        return raw
    try:
        text = raw.decode("utf-8")
    except UnicodeDecodeError:
        return raw
    return rewrite_overlay_invocations(text, pattern, namespaces).encode("utf-8")


def copy_tree(source: Path, destination: Path) -> None:
    if destination.exists():
        shutil.rmtree(destination)
    destination.parent.mkdir(parents=True, exist_ok=True)
    shutil.copytree(source, destination, ignore=ignore_generated)

    namespaces = command_namespaces()
    pattern = _invocation_pattern(namespaces)
    for path in destination.rglob("*"):
        if not path.is_file() or path.suffix not in REWRITABLE_SUFFIXES:
            continue
        if any(part in IGNORED_NAMES for part in path.parts):
            continue
        original = path.read_bytes()
        rewritten = publish_bytes(path, namespaces, pattern)
        if rewritten != original:
            path.write_bytes(rewritten)


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
