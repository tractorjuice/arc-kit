"""A path the converter writes inside double quotes is one the shell expands.

The converter points the Gemini extension's commands and agents at `~/.gemini/extensions/arckit`.
Gemini CLI substitutes `${extensionPath}` only in gemini-extension.json and hooks/hooks.json, not in
a command's prompt, so the model reads the path as written and runs it through a shell. Where a
command quotes it, `node "${CLAUDE_PLUGIN_ROOT}/scripts/uk-food.mjs"` became
`node "~/.gemini/extensions/arckit/scripts/uk-food.mjs"`, and a shell does not expand `~` inside
quotes, so the call failed. `$HOME` is expanded there. Unquoted uses keep `~`, which the shell
expands at the start of a word.
"""

from __future__ import annotations

import importlib.util
import re
from pathlib import Path

import pytest

REPO_ROOT = Path(__file__).resolve().parents[2]
GEMINI = REPO_ROOT / "extensions" / "arckit-gemini"


def _load_converter():
    spec = importlib.util.spec_from_file_location("arckit_converter_quoted", REPO_ROOT / "scripts" / "converter.py")
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


converter = _load_converter()
GEMINI_CONFIG = converter.AGENT_CONFIG["gemini"]

SOURCE = """\
**The helper** is `node "${CLAUDE_PLUGIN_ROOT}/scripts/uk-food.mjs"`.
Run `bash ${CLAUDE_PLUGIN_ROOT}/scripts/bash/create-project.sh --json --name "<project-name>"`.
Read `${CLAUDE_PLUGIN_ROOT}/templates/uk-food-profile-template.md`.
"""


def test_a_quoted_gemini_path_starts_with_home():
    out = converter.rewrite_paths(SOURCE, GEMINI_CONFIG)
    assert 'node "$HOME/.gemini/extensions/arckit/scripts/uk-food.mjs"' in out, out
    assert '"~/' not in out, out


def test_an_unquoted_gemini_path_keeps_its_tilde():
    out = converter.rewrite_paths(SOURCE, GEMINI_CONFIG)
    assert "`bash ~/.gemini/extensions/arckit/scripts/bash/create-project.sh --json" in out, out
    assert "Run `cat ~/.gemini/extensions/arckit/templates/uk-food-profile-template.md` to read the file" in out, out


@pytest.mark.parametrize("target", sorted(set(converter.AGENT_CONFIG) - {"gemini"}))
def test_every_other_target_is_unchanged(target):
    """Only a prefix that starts with `~/` needs this; every other target's prefix is used as before."""
    config = converter.AGENT_CONFIG[target]
    out = converter.rewrite_paths(SOURCE, config)
    assert "$HOME" not in out, out
    expected = f'node "{config["script_path_prefix"]}/uk-food.mjs"' if config.get("script_path_prefix") \
        else f'node "{config["path_prefix"]}/scripts/uk-food.mjs"'
    assert expected in out, out


def test_a_gemini_agent_quotes_its_path_with_home(tmp_path):
    agents = tmp_path / "agents"
    agents.mkdir()
    (agents / "arckit-probe.md").write_text(
        "---\nname: arckit-probe\ndescription: A probe.\n---\n\n"
        'Run `node "${CLAUDE_PLUGIN_ROOT}/scripts/generate-document-id.mjs" 001 TNDR 1.0 --filename`.\n'
        "Then `bash ${CLAUDE_PLUGIN_ROOT}/scripts/bash/create-project.sh --json`.\n",
        encoding="utf-8")
    converter.generate_gemini_agents(str(agents), str(tmp_path / "out"))
    out = (tmp_path / "out" / "arckit-probe.md").read_text(encoding="utf-8")
    assert 'node "$HOME/.gemini/extensions/arckit/scripts/generate-document-id.mjs"' in out, out
    assert "`bash ~/.gemini/extensions/arckit/scripts/bash/create-project.sh --json`" in out, out


@pytest.mark.skipif(not (GEMINI / "commands" / "arckit").is_dir(), reason="run scripts/converter.py first")
def test_no_generated_gemini_file_quotes_a_tilde_path():
    """Across every command and agent the converter writes for Gemini, escaped in TOML or not."""
    found = []
    for path in sorted([*(GEMINI / "commands").rglob("*.toml"), *(GEMINI / "agents").glob("*.md")]):
        for n, line in enumerate(path.read_text(encoding="utf-8").splitlines(), 1):
            if re.search(r'\\?"~/\.gemini/extensions/arckit', line):
                found.append(f"{path.relative_to(REPO_ROOT)}:{n}")
    assert not found, found
