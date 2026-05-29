"""Validate the generated Paperclip commands.json structure."""

import json
import os
from pathlib import Path
import pytest

COMMANDS_JSON_PATH = os.path.join(
    os.path.dirname(__file__), "..", "..", "arckit-paperclip", "src", "data", "commands.json"
)
REPO_ROOT = Path(__file__).resolve().parents[2]
CLAUDE_COMMANDS_DIR = REPO_ROOT / "arckit-claude" / "commands"
CLAUDE_ONLY_COMMANDS = {"build.md"}

# v5.0.0+: commands live across plugin source directories. Mirror
# scripts/converter.py's PLUGIN_SOURCES list so this test matches the
# converter's actual output.
PLUGIN_COMMAND_DIRS = [
    REPO_ROOT / "arckit-claude" / "commands",
    REPO_ROOT / "arckit-uae" / "commands",
    REPO_ROOT / "arckit-fr" / "commands",
    REPO_ROOT / "arckit-ca" / "commands",
    REPO_ROOT / "arckit-eu" / "commands",
    REPO_ROOT / "arckit-at" / "commands",
    REPO_ROOT / "arckit-au" / "commands",
    REPO_ROOT / "arckit-us" / "commands",
    REPO_ROOT / "arckit-uk-finance" / "commands",
    REPO_ROOT / "arckit-uk-nhs" / "commands",
]


def expected_command_count():
    total = 0
    for cmd_dir in PLUGIN_COMMAND_DIRS:
        if not cmd_dir.is_dir():
            continue
        total += sum(
            1
            for path in cmd_dir.glob("*.md")
            if path.name not in CLAUDE_ONLY_COMMANDS
        )
    return total


@pytest.fixture
def commands():
    with open(COMMANDS_JSON_PATH, "r", encoding="utf-8") as f:
        return json.load(f)


def test_commands_json_exists():
    assert os.path.isfile(COMMANDS_JSON_PATH), "commands.json not found"


def test_commands_is_list(commands):
    assert isinstance(commands, list)


def test_commands_count(commands):
    expected = expected_command_count()
    assert len(commands) == expected, f"Expected {expected} commands, got {len(commands)}"


def test_every_entry_has_required_fields(commands):
    required = {"name", "description", "prompt", "template", "handoffs"}
    for cmd in commands:
        missing = required - set(cmd.keys())
        assert not missing, f"{cmd.get('name', '?')} missing fields: {missing}"


def test_names_are_prefixed(commands):
    for cmd in commands:
        assert cmd["name"].startswith("arckit-"), f"{cmd['name']} missing arckit- prefix"


def test_names_are_unique(commands):
    names = [cmd["name"] for cmd in commands]
    assert len(names) == len(set(names)), f"Duplicate names: {[n for n in names if names.count(n) > 1]}"


def test_descriptions_are_nonempty(commands):
    for cmd in commands:
        assert cmd["description"].strip(), f"{cmd['name']} has empty description"


def test_prompts_are_nonempty(commands):
    for cmd in commands:
        assert cmd["prompt"].strip(), f"{cmd['name']} has empty prompt"


def test_no_unrewritten_plugin_root_paths(commands):
    for cmd in commands:
        assert "${CLAUDE_PLUGIN_ROOT}" not in cmd["prompt"], (
            f"{cmd['name']} still has ${{CLAUDE_PLUGIN_ROOT}} in prompt"
        )
        if cmd["template"]:
            assert "${CLAUDE_PLUGIN_ROOT}" not in cmd["template"], (
                f"{cmd['name']} still has ${{CLAUDE_PLUGIN_ROOT}} in template"
            )


def test_handoffs_structure(commands):
    for cmd in commands:
        assert isinstance(cmd["handoffs"], list), f"{cmd['name']} handoffs is not a list"
        for h in cmd["handoffs"]:
            assert "command" in h, f"{cmd['name']} handoff missing 'command'"
            assert "description" in h, f"{cmd['name']} handoff missing 'description'"
            assert h["command"].startswith("arckit-"), (
                f"{cmd['name']} handoff {h['command']} missing arckit- prefix"
            )


def test_templates_present_for_known_commands(commands):
    """Spot-check that commands known to have templates do have template content."""
    known_with_templates = ["arckit-requirements", "arckit-adr"]
    by_name = {cmd["name"]: cmd for cmd in commands}
    for name in known_with_templates:
        if name in by_name:
            assert by_name[name]["template"] is not None, (
                f"{name} should have a template"
            )
