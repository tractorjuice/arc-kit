"""Claude Code's AskUserQuestion tool never reaches a non-Claude target.

Only Claude Code has the tool. The converter used to rewrite five phrasings
of it, and only on the Codex and Kimi skill paths, so OpenCode, Gemini,
Copilot, Paperclip and Vibe outputs on main told their models to "use the
**AskUserQuestion** tool" (found while landing #843). `neutralise_question_tool`
in scripts/converter.py now runs on every non-Claude path with a full rule
set and a catch-all; this file pins both the function and the outputs.
"""

from __future__ import annotations

import importlib.util
import re
from pathlib import Path

import pytest

REPO_ROOT = Path(__file__).resolve().parents[2]
PLUGIN = REPO_ROOT / "plugins" / "arckit-claude"
EXTENSIONS = REPO_ROOT / "extensions"
TOOL = "AskUserQuestion"


def _load_converter():
    spec = importlib.util.spec_from_file_location("arckit_converter", REPO_ROOT / "scripts" / "converter.py")
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


converter = _load_converter()
neutralise = converter.neutralise_question_tool


def _source_phrasings() -> list[str]:
    """Every distinct line in the plugin's commands that names the tool."""
    seen = []
    for path in sorted((PLUGIN / "commands").glob("*.md")):
        for line in path.read_text(encoding="utf-8").splitlines():
            if TOOL in line and line.strip() not in seen:
                seen.append(line.strip())
    return seen


@pytest.mark.parametrize("line", _source_phrasings(), ids=lambda l: l[:60])
def test_every_source_phrasing_is_neutralised(line):
    out = neutralise(line)
    assert TOOL not in out, f"leaked: {out!r}"
    assert "the user the user" not in out, f"doubled object: {out!r}"


@pytest.mark.parametrize(
    "src, expected",
    [
        ("Use AskUserQuestion to ask:", "Ask the user:"),
        ("Before creating the ADR, use the **AskUserQuestion** tool to gather key decision parameters.",
         "Before creating the ADR, ask the user for key decision parameters."),
        ("If uncertain, use AskUserQuestion to ask the user about capabilities.",
         "If uncertain, ask the user about capabilities."),
        ("If ambiguous, use AskUserQuestion to clarify with the user.",
         "If ambiguous, clarify with the user."),
        ("Use AskUserQuestion to confirm priorities with the user before finalizing.",
         "Confirm priorities with the user before finalizing."),
        ("Call the **AskUserQuestion** tool exactly once with all 4 questions below in a single call. Do NOT proceed.",
         "Ask the user all 4 questions below at once, in one message. Do NOT proceed."),
        ("Ask **both** questions below in a **single AskUserQuestion call** so the user sees them together.",
         "Ask **both** questions below **together, in one message** so the user sees them together."),
        ("- AskUserQuestion choices made (if any)", "- Question choices made (if any)"),
        ("Some prose naming AskUserQuestion mid-sentence.", "Some prose naming a question to the user mid-sentence."),
    ],
)
def test_known_rewrites(src, expected):
    assert neutralise(src) == expected


def test_idempotent_on_every_source_phrasing():
    for line in _source_phrasings():
        once = neutralise(line)
        assert neutralise(once) == once


def test_no_generated_command_names_the_tool():
    """Scan every generated extension's command, prompt and skill files.
    `references/` is excluded: interview-pattern.md names the tool once, as
    Claude Code's, when explaining what a runtime's question tool is."""
    if not EXTENSIONS.is_dir() or not any(EXTENSIONS.iterdir()):
        pytest.skip("extensions/ not generated; run scripts/converter.py")
    leaks = []
    for ext in sorted(EXTENSIONS.iterdir()):
        for sub in ("commands", "prompts", "skills", "src/data"):
            d = ext / sub
            if not d.is_dir():
                continue
            for path in d.rglob("*"):
                if path.is_file() and path.suffix in {".md", ".toml", ".json", ".yaml", ".yml"}:
                    if TOOL in path.read_text(encoding="utf-8", errors="replace"):
                        leaks.append(str(path.relative_to(REPO_ROOT)))
    assert not leaks, f"generated files still name {TOOL}: {leaks[:10]}{' …' if len(leaks) > 10 else ''}"


def test_rules_are_ordered_specific_before_catch_all():
    rules = [p for p, _ in converter._QUESTION_TOOL_RULES]
    catch_all = rules.index(r"AskUserQuestion")
    assert catch_all == len(rules) - 1, "the bare-token catch-all must be the last rule"
    assert all(re.compile(p, re.IGNORECASE) for p in rules)
