#!/usr/bin/env python3
"""Assert every per-type quality-checklist reference resolves to a real section.

Commands and agents end by telling the model to verify quality checks:

    read `${CLAUDE_PLUGIN_ROOT}/references/quality-checklist.md` and verify all
    **Common Checks** plus the **GAPA** per-type checks pass.

If `references/quality-checklist.md` has no `### GAPA` section, that instruction
resolves to nothing. Nothing errors, nothing is logged; the model is simply left
to invent the criteria for the artefact it is about to write. That was live for
15 codes across `arckit-togaf-adm` and `arckit-agent-architecture` from
2026-06-30 until PR #750 (issue #749).

Resolution is PER PLUGIN, not against the core copy. `${CLAUDE_PLUGIN_ROOT}`
resolves to each plugin's own root with no cross-plugin fallback, so a command in
`arckit-togaf-adm` reads that plugin's copy. Checking against core would pass a
plugin that carries no checklist at all — `arckit-fde` is sync-exempt and has
none today, and would silently fail open the moment it gained a governance
command. `sync-shared-assets.py --check` separately guarantees the copies are
byte-identical; this guard does not assume it has run.

Deliberately NOT checked here:

  * Commands that reference no per-type code at all. `wardley.value-chain` and
    `maturity-model` ask for Common Checks only, by design. Distinguishing those
    from the ~61 commands that never invoke the checklist despite writing a
    governed artefact needs the doc-type registry and a judgement call per
    command — a different defect, tracked on #748.
  * Sections that no command references. Dead weight, not a broken instruction.
  * `plugins/arckit-claude/plugins/**`, the generated publish-layout mirror.
    Drift there is a sync failure and `tests/plugin/test_release_process.py`
    already catches it.

Exit 0 when clean, 1 otherwise.
"""

from __future__ import annotations

import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
PLUGINS_DIR = ROOT / "plugins"

# Generated publish-layout mirror — see module docstring.
MIRROR_DIR = PLUGINS_DIR / "arckit-claude/plugins"

CHECKLIST_REL = Path("references/quality-checklist.md")

# "**GAPA** per-type checks" — the code is bold, hyphens allowed (e.g. FIPS199,
# two-part codes). Matches every phrasing in the tree: "plus the **X**",
# "plus **X**", and "plus any applicable **X**".
REF_RE = re.compile(r"\*\*([A-Z0-9][A-Z0-9-]*)\*\*\s+per-type checks")

SECTION_RE = re.compile(r"^### ([A-Z0-9][A-Z0-9-]*)\s", re.M)


def plugin_dirs() -> list[Path]:
    return sorted(
        p for p in PLUGINS_DIR.iterdir() if p.is_dir() and (p / ".claude-plugin").is_dir()
    )


def sections_for(plugin: Path) -> set[str] | None:
    """Codes with a `### CODE` section in this plugin's checklist, or None if it
    carries no checklist file at all."""
    checklist = plugin / CHECKLIST_REL
    if not checklist.is_file():
        return None
    return set(SECTION_RE.findall(checklist.read_text(encoding="utf-8")))


def references_for(plugin: Path) -> list[tuple[Path, str]]:
    """(file, code) for every per-type reference emitted anywhere in the plugin."""
    found: list[tuple[Path, str]] = []
    for path in sorted(plugin.rglob("*.md")):
        if MIRROR_DIR in path.parents:
            continue
        for code in sorted(set(REF_RE.findall(path.read_text(encoding="utf-8")))):
            found.append((path, code))
    return found


def main() -> int:
    if not PLUGINS_DIR.is_dir():
        print(f"ERROR: {PLUGINS_DIR} not found", file=sys.stderr)
        return 1

    plugins = plugin_dirs()
    if not plugins:
        print(f"ERROR: no plugins found under {PLUGINS_DIR.relative_to(ROOT)}", file=sys.stderr)
        return 1

    dangling: list[tuple[Path, str, str]] = []  # (file, code, plugin)
    no_checklist: list[tuple[Path, str, str]] = []
    total_refs = 0
    per_plugin: dict[str, set[str]] = {}

    for plugin in plugins:
        sections = sections_for(plugin)
        for path, code in references_for(plugin):
            total_refs += 1
            per_plugin.setdefault(plugin.name, set()).add(code)
            rel = path.relative_to(ROOT)
            if sections is None:
                no_checklist.append((rel, code, plugin.name))
            elif code not in sections:
                dangling.append((rel, code, plugin.name))

    if total_refs == 0:
        print(
            "ERROR: no per-type references found at all — the phrasing in commands "
            "has probably changed and REF_RE no longer matches it.",
            file=sys.stderr,
        )
        return 1

    failed = False

    if no_checklist:
        failed = True
        print(
            f"FAIL {len(no_checklist)} per-type reference(s) in a plugin that carries "
            f"no {CHECKLIST_REL}:",
            file=sys.stderr,
        )
        for rel, code, plugin in no_checklist:
            print(f"  {rel}  ->  **{code}**  (plugin {plugin})", file=sys.stderr)
        print(
            "\n  ${CLAUDE_PLUGIN_ROOT} resolves to the plugin's OWN root, so this read\n"
            "  fails silently at runtime. Either remove the plugin from SYNC_EXEMPT_PLUGINS\n"
            "  in scripts/sync-shared-assets.py and re-run it, or drop the reference.",
            file=sys.stderr,
        )

    if dangling:
        failed = True
        print(
            f"\nFAIL {len(dangling)} per-type reference(s) with no matching "
            f"`### <CODE>` section:",
            file=sys.stderr,
        )
        for rel, code, plugin in dangling:
            print(f"  {rel}  ->  **{code}**  (plugin {plugin})", file=sys.stderr)
        print(
            "\n  The instruction resolves to nothing and the model invents the criteria.\n"
            "  Add a `### <CODE> -- <Name>` section to\n"
            "  plugins/arckit-claude/references/quality-checklist.md (the canonical copy),\n"
            "  then run: python3 scripts/sync-shared-assets.py\n"
            "         and python3 scripts/sync-claude-plugin-layout.py\n"
            "  Derive the checks from the command's Instructions and its template — assert\n"
            "  that derived values agree with their inputs, not merely that fields exist.",
            file=sys.stderr,
        )

    if failed:
        return 1

    breakdown = ", ".join(f"{name}: {len(codes)}" for name, codes in sorted(per_plugin.items()))
    print(
        f"Quality-checklist reference check OK: {total_refs} per-type reference(s) "
        f"across {len(per_plugin)} plugin(s), all resolve ({breakdown})."
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
