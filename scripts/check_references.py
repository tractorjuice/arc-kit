#!/usr/bin/env python3
"""Resolve every internal reference in the plugin source against disk.

Walks `plugins/arckit-claude/` and checks that:

  1. Every `${CLAUDE_PLUGIN_ROOT}/<path>` reference in a `.md` file resolves
     to an existing file or directory inside that file's plugin root or one of
     its local plugin dependencies.
  2. Every `handoffs[].command` entry in command frontmatter names an
     existing command file under `plugins/arckit-claude/commands/`.
  3. Every `${user_config.KEY}` reference names a key declared in
     that file's `.claude-plugin/plugin.json` or local plugin dependencies
     under `userConfig`.

Exits non-zero on any broken reference. Run from repo root:

    python3 scripts/check_references.py
"""

from __future__ import annotations

import json
import re
import sys
from pathlib import Path

import yaml

ROOT = Path(__file__).resolve().parents[1]
PLUGIN = ROOT / "plugins" / "arckit-claude"
PLUGIN_JSON_REL = Path(".claude-plugin") / "plugin.json"

REF_RE = re.compile(r"\$\{CLAUDE_PLUGIN_ROOT\}/([^\s`\"')}\]<>]+)")
USER_CONFIG_RE = re.compile(r"\$\{user_config\.([A-Za-z_][A-Za-z0-9_]*)\}")
FRONTMATTER_RE = re.compile(r"\A---\s*\n(.*?)\n---\s*\n", re.DOTALL)


def is_placeholder(path: str) -> bool:
    """Skip patterns that are illustrative rather than concrete references."""
    # Glob wildcards
    if "*" in path or "?" in path:
        return True
    # Brace expansion {a,b} or angle/curly placeholders {NAME}, <name>
    if "{" in path or "}" in path or "<" in path or ">" in path:
        return True
    return False


def plugin_root_for(md_path: Path) -> Path:
    for parent in md_path.parents:
        if parent == PLUGIN.parent:
            break
        if (parent / PLUGIN_JSON_REL).is_file():
            return parent
    return PLUGIN


def load_plugin_manifest(plugin_root: Path) -> dict:
    plugin_json = plugin_root / PLUGIN_JSON_REL
    try:
        return json.loads(plugin_json.read_text())
    except (OSError, json.JSONDecodeError) as exc:
        print(f"[error] cannot read {plugin_json}: {exc}", file=sys.stderr)
        return {}


def discover_plugin_roots() -> dict[str, Path]:
    roots: dict[str, Path] = {}
    for plugin_json in sorted(PLUGIN.rglob(str(PLUGIN_JSON_REL))):
        plugin_root = plugin_json.parent.parent
        data = load_plugin_manifest(plugin_root)
        name = data.get("name")
        if isinstance(name, str):
            roots[name] = plugin_root
    return roots


def reference_roots_for(plugin_root: Path, plugin_roots_by_name: dict[str, Path]) -> list[Path]:
    roots = [plugin_root]
    data = load_plugin_manifest(plugin_root)
    dependencies = data.get("dependencies") or []
    if not isinstance(dependencies, list):
        return roots
    for dependency in dependencies:
        if not isinstance(dependency, dict):
            continue
        name = dependency.get("name")
        dependency_root = plugin_roots_by_name.get(name) if isinstance(name, str) else None
        if dependency_root and dependency_root not in roots:
            roots.append(dependency_root)
    return roots


def load_plugin_userconfig_keys(reference_roots: list[Path]) -> set[str]:
    keys: set[str] = set()
    for plugin_root in reference_roots:
        data = load_plugin_manifest(plugin_root)
        keys.update((data.get("userConfig") or {}).keys())
    if not keys:
        return set()
    return keys


def iter_md_files() -> list[Path]:
    return sorted(p for p in PLUGIN.rglob("*.md") if p.is_file())


def line_of(text: str, offset: int) -> int:
    return text.count("\n", 0, offset) + 1


def check_plugin_root_refs(
    md_path: Path, text: str, reference_roots: list[Path]
) -> list[tuple[int, str]]:
    errors: list[tuple[int, str]] = []
    for match in REF_RE.finditer(text):
        rel = match.group(1).rstrip(".,;:)")
        if is_placeholder(rel):
            continue
        if not any((plugin_root / rel).exists() for plugin_root in reference_roots):
            errors.append((line_of(text, match.start()), f"${{CLAUDE_PLUGIN_ROOT}}/{rel}"))
    return errors


def check_user_config_refs(md_path: Path, text: str, known_keys: set[str]) -> list[tuple[int, str]]:
    errors: list[tuple[int, str]] = []
    for match in USER_CONFIG_RE.finditer(text):
        key = match.group(1)
        if key not in known_keys:
            errors.append((line_of(text, match.start()), f"${{user_config.{key}}}"))
    return errors


def check_handoffs(md_path: Path, text: str, command_slugs: set[str]) -> list[tuple[int, str]]:
    errors: list[tuple[int, str]] = []
    fm_match = FRONTMATTER_RE.match(text)
    if not fm_match:
        return errors
    try:
        fm = yaml.safe_load(fm_match.group(1)) or {}
    except yaml.YAMLError as exc:
        return [(1, f"frontmatter YAML parse error: {exc}")]
    handoffs = fm.get("handoffs")
    if not isinstance(handoffs, list):
        return errors
    fm_line_count = fm_match.group(1).count("\n") + 2
    for entry in handoffs:
        if not isinstance(entry, dict):
            continue
        target = entry.get("command")
        if isinstance(target, str) and target not in command_slugs:
            errors.append((fm_line_count, f"handoffs: → /{target} (no such command)"))
    return errors


def main() -> int:
    if not PLUGIN.is_dir():
        print(f"[error] plugin source not found at {PLUGIN}", file=sys.stderr)
        return 2

    commands_dir = PLUGIN / "commands"
    command_slugs = {p.stem for p in commands_dir.glob("*.md")}
    plugin_roots_by_name = discover_plugin_roots()
    reference_roots_by_root: dict[Path, list[Path]] = {}
    user_config_by_root: dict[Path, set[str]] = {}

    total_errors = 0
    files_with_errors = 0

    for md_path in iter_md_files():
        text = md_path.read_text()
        plugin_root = plugin_root_for(md_path)
        if plugin_root not in reference_roots_by_root:
            reference_roots_by_root[plugin_root] = reference_roots_for(
                plugin_root, plugin_roots_by_name
            )
        reference_roots = reference_roots_by_root[plugin_root]
        if plugin_root not in user_config_by_root:
            user_config_by_root[plugin_root] = load_plugin_userconfig_keys(reference_roots)
        known_user_config = user_config_by_root[plugin_root]
        errors: list[tuple[int, str]] = []
        errors.extend(check_plugin_root_refs(md_path, text, reference_roots))
        errors.extend(check_user_config_refs(md_path, text, known_user_config))
        if md_path.parent.name == "commands" and md_path.parent.parent == PLUGIN:
            errors.extend(check_handoffs(md_path, text, command_slugs))
        if errors:
            files_with_errors += 1
            total_errors += len(errors)
            rel = md_path.relative_to(ROOT)
            for line, ref in errors:
                print(f"{rel}:{line}: broken reference: {ref}")

    if total_errors:
        print(
            f"\n[fail] {total_errors} broken reference(s) across {files_with_errors} file(s)",
            file=sys.stderr,
        )
        return 1
    print(f"[ok] checked {len(iter_md_files())} markdown file(s); no broken references")
    return 0


if __name__ == "__main__":
    sys.exit(main())
