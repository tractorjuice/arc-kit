#!/usr/bin/env python3
"""Guard: Claude-only orchestrator prose must never reach a non-Claude target.

Ten ArcKit commands are split into three tiers — an orchestrator that runs in
the main session, a reader subagent that touches the network/MCP, and a writer
subagent that holds the only `Write` call. Non-Claude runtimes (Codex, Gemini,
OpenCode, Copilot, Paperclip, Vibe, Kimi) have no subagent-dispatch primitive
they can honour, so `converter.py` swaps in a **pre-split monolith** —
`agents/arckit-{name}.md` without `subagent: true` — in place of the
orchestrator body when it generates those targets.

When a split command ships with no monolith, the converter falls through to the
orchestrator body and every non-Claude extension inlines instructions to
"dispatch the reader using the Agent tool", which those runtimes cannot follow.
That is the #447 regression. It happened once for `datascout` (#446), was fixed
by retaining the monoliths, and then happened again for `tenders` and
`competitors` (#558) — commands that were born three-tier and never had one.

`tests/codex/test_codex_extension.py` already checked for this, but against a
hardcoded list of three skill names and only for Codex, so two commands added
after it was written sailed past. This guard derives its scope instead:

  * every `plugins/*/commands/*.md`, so a new split command is covered the day
    it lands;
  * resolved through `converter.py`'s own `build_agent_map()`, so the check
    cannot drift from what the converter actually emits;
  * plus `commands-standalone/` overrides, which some targets use instead.

Deliberately NOT checked here:

  * `plugins/arckit-claude/agents/*-reader.md` and `*-writer.md`. Those carry
    `subagent: true`, `is_subagent_file()` filters them from every non-Claude
    target, and they are *supposed* to talk about tiers.
  * The generated `extensions/` trees. They are gitignored converter output; a
    source-level check runs without a converter pass and fails earlier.
  * `build.md`, which `converter.py` skips outright as Claude-only.

Exit 0 when clean, 1 otherwise.
"""

from __future__ import annotations

import importlib.util
import os
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
PLUGINS_DIR = ROOT / "plugins"

# Generated publish-layout mirror — drift there is a sync failure, and
# tests/plugin/test_release_process.py already catches it.
MIRROR_DIR = PLUGINS_DIR / "arckit-claude/plugins"

# Vocabulary that only means something to a runtime with subagent dispatch.
# Backticks are optional throughout: the source writes ``the `Agent` tool``,
# which a plain-substring check for "Agent tool" silently misses — that is one
# reason the old hardcoded test under-fired.
FORBIDDEN = [
    ("subagent_type", re.compile(r"subagent_type", re.I)),
    ("`Agent` tool", re.compile(r"`?\bAgent`?\s+tool\b")),
    ("orchestrator tier", re.compile(r"orchestrator\s+tier", re.I)),
    ("reader subagent", re.compile(r"reader\s+subagent", re.I)),
    ("writer subagent", re.compile(r"writer\s+subagent", re.I)),
    ("subagent split", re.compile(r"subagent\s+split", re.I)),
    ("dispatch the reader/writer", re.compile(r"dispatch(es|ing)?\s+the\s+(reader|writer)", re.I)),
]


def load_converter():
    """Import converter.py by path so this guard reuses its resolution logic."""
    spec = importlib.util.spec_from_file_location(
        "arckit_converter", ROOT / "scripts" / "converter.py"
    )
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


def plugin_dirs() -> list[Path]:
    return sorted(
        p
        for p in PLUGINS_DIR.iterdir()
        if p.is_dir() and (p / ".claude-plugin").is_dir() and p != MIRROR_DIR
    )


def hits(text: str) -> list[str]:
    return [label for label, pattern in FORBIDDEN if pattern.search(text)]


def main() -> int:
    converter = load_converter()
    errors: list[str] = []
    checked = 0

    for plugin in plugin_dirs():
        commands_dir = plugin / "commands"
        if not commands_dir.is_dir():
            continue

        agent_map = converter.build_agent_map(str(plugin / "agents"))

        for command_path in sorted(commands_dir.glob("*.md")):
            filename = command_path.name
            if filename in converter.CLAUDE_ONLY_COMMANDS:
                continue

            candidates: list[tuple[str, Path, str]] = []

            content = command_path.read_text(encoding="utf-8")
            _, command_prompt = converter.extract_frontmatter_and_prompt(content)

            if filename in agent_map:
                agent_path, agent_prompt = agent_map[filename]
                candidates.append(("monolith", Path(agent_path), agent_prompt))
            else:
                candidates.append(("command body", command_path, command_prompt))

            standalone = plugin / "commands-standalone" / filename
            if standalone.is_file():
                _, standalone_prompt = converter.extract_frontmatter_and_prompt(
                    standalone.read_text(encoding="utf-8")
                )
                candidates.append(("standalone override", standalone, standalone_prompt))

            for kind, source, prompt in candidates:
                checked += 1
                found = hits(prompt)
                if not found:
                    continue
                rel_source = os.path.relpath(source, ROOT)
                rel_command = os.path.relpath(command_path, ROOT)
                if kind == "command body":
                    errors.append(
                        f"{rel_command}: orchestrator prose ({', '.join(found)}) with no "
                        f"pre-split monolith at {plugin.name}/agents/arckit-{filename[:-3]}.md. "
                        f"converter.py inlines this body into all seven non-Claude "
                        f"extensions, which cannot dispatch subagents (#447). Add the "
                        f"monolith, or mark the command Claude-only in "
                        f"converter.py::CLAUDE_ONLY_COMMANDS."
                    )
                else:
                    errors.append(
                        f"{rel_source}: {kind} for {rel_command} contains orchestrator "
                        f"prose ({', '.join(found)}). This text is what non-Claude targets "
                        f"receive, so it must describe single-agent work only."
                    )

    if errors:
        print("Orchestrator-leak check FAILED:\n")
        for err in errors:
            print(f"  - {err}")
        print(f"\n{len(errors)} problem(s) found across {checked} generated prompt(s).")
        return 1

    print(f"Orchestrator-leak check passed ({checked} generated prompts clean).")
    return 0


if __name__ == "__main__":
    sys.exit(main())
