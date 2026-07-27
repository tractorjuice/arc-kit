#!/usr/bin/env python3
"""Namespace ArcKit overlay command invocations for Claude Code.

`/arckit:X` is the canonical, platform-neutral notation in command sources, and
scripts/converter.py rewrites it per target: Copilot gets `/arckit-X`, Codex and
Kimi get their own skill prefixes, and Gemini and OpenCode keep `/arckit:X`
because the converter merges every overlay into ONE flat `arckit` namespace.

Claude Code is the only target with no rewrite step. It reads plugin command
bodies verbatim and namespaces by the `name` in plugin.json. Core is named
`arckit`, so `/arckit:adr` resolves. Every overlay is named `arckit-<x>`, so
`/arckit:uae-ai-charter` does NOT — it is `/arckit-uae:uae-ai-charter`.
Confirmed 2026-07-27: `arckit:repo-audit` returns "Unknown skill" while
`arckit-repo:repo-docs` runs.

This module is the single implementation of that rewrite, used by two callers:

  scripts/sync-claude-plugin-layout.py   the local dev mirror
  scripts/push-extensions.sh             the actual publish to arckit-claude

Both are needed. The push script copies the core plugin (which contains the
mirror) and then tar-extracts the raw overlay sources over the same paths, so
the mirror's rewriting is overwritten and never reaches users on its own.

NEVER rewrite the sources in place: converter.py depends on `/arckit:X`.

CLI:
    claude_command_namespacing.py <dir> [--check]

Rewrites every .md under <dir> in place, or reports what would change.
"""

from __future__ import annotations

import argparse
import json
from pathlib import Path
import re
import sys

REPO_ROOT = Path(__file__).resolve().parents[1]

# Only markdown carries command invocations; verified no .json/.yaml refs exist.
REWRITABLE_SUFFIXES = {".md"}

IGNORED_NAMES = {".git", "node_modules", ".npm", ".pnpm-store"}


def command_namespaces(repo_root: Path | None = None) -> dict[str, str]:
    """Map every non-core command name to its owning plugin's namespace."""
    root = repo_root or REPO_ROOT
    namespaces: dict[str, str] = {}
    for manifest in sorted(root.glob("plugins/arckit-*/.claude-plugin/plugin.json")):
        try:
            name = json.loads(manifest.read_text(encoding="utf-8")).get("name")
        except (OSError, json.JSONDecodeError):
            continue
        # Core is literally named `arckit`, so its commands need no prefix change.
        if not name or name == "arckit":
            continue
        for command in (manifest.parent.parent / "commands").glob("*.md"):
            namespaces[command.stem] = name
    return namespaces


def invocation_pattern(namespaces: dict[str, str]) -> re.Pattern[str] | None:
    if not namespaces:
        return None
    # Longest first, or `fr-anssi` swallows the prefix of `fr-anssi-carto`.
    alternatives = "|".join(
        re.escape(name) for name in sorted(namespaces, key=len, reverse=True)
    )
    return re.compile(rf"/arckit:({alternatives})\b")


def rewrite(text: str, pattern: re.Pattern[str] | None,
            namespaces: dict[str, str]) -> str:
    """`/arckit:uae-ai-charter` -> `/arckit-uae:uae-ai-charter`.

    Core references never match: they are not in the map. Idempotent, because an
    already-namespaced `/arckit-uae:...` does not match `/arckit:`.
    """
    if pattern is None:
        return text
    return pattern.sub(lambda m: f"/{namespaces[m.group(1)]}:{m.group(1)}", text)


def publish_bytes(source: Path, namespaces: dict[str, str],
                  pattern: re.Pattern[str] | None) -> bytes:
    """The exact bytes a source file should have once published."""
    raw = source.read_bytes()
    if source.suffix not in REWRITABLE_SUFFIXES:
        return raw
    try:
        text = raw.decode("utf-8")
    except UnicodeDecodeError:
        return raw
    return rewrite(text, pattern, namespaces).encode("utf-8")


def namespace_tree(directory: Path, repo_root: Path | None = None,
                   dry_run: bool = False) -> tuple[int, int]:
    """Rewrite every .md under `directory` in place.

    Returns (files_changed, references_rewritten).
    """
    namespaces = command_namespaces(repo_root)
    pattern = invocation_pattern(namespaces)
    if pattern is None:
        return (0, 0)

    files_changed = 0
    refs = 0
    for path in sorted(directory.rglob("*")):
        if not path.is_file() or path.suffix not in REWRITABLE_SUFFIXES:
            continue
        if any(part in IGNORED_NAMES for part in path.parts):
            continue
        original = path.read_bytes()
        updated = publish_bytes(path, namespaces, pattern)
        if updated == original:
            continue
        files_changed += 1
        refs += len(pattern.findall(original.decode("utf-8", errors="replace")))
        if not dry_run:
            path.write_bytes(updated)
    return (files_changed, refs)


def main() -> int:
    parser = argparse.ArgumentParser(
        description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter
    )
    parser.add_argument("directory", type=Path, help="tree to rewrite in place")
    parser.add_argument("--check", action="store_true",
                        help="report what would change; exit 1 if anything would")
    args = parser.parse_args()

    if not args.directory.is_dir():
        print(f"ERROR: not a directory: {args.directory}", file=sys.stderr)
        return 1

    files, refs = namespace_tree(args.directory, dry_run=args.check)

    if args.check:
        if files:
            print(f"{refs} overlay invocation(s) in {files} file(s) would be namespaced.",
                  file=sys.stderr)
            return 1
        print("No un-namespaced overlay invocations found.")
        return 0

    print(f"Namespaced {refs} overlay invocation(s) across {files} file(s).")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
