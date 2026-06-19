"""Shared helpers for generated extension test suites."""

from pathlib import Path

import yaml


REPO_ROOT = Path(__file__).resolve().parents[1]

# Mirror scripts/converter.py's PLUGIN_SOURCES list so extension parity tests
# track the converter's public output surface, not only the core plugin.
PLUGIN_COMMAND_DIRS = [
    REPO_ROOT / "plugins" / "arckit-uae" / "commands",
    REPO_ROOT / "plugins" / "arckit-fr" / "commands",
    REPO_ROOT / "plugins" / "arckit-ca" / "commands",
    REPO_ROOT / "plugins" / "arckit-eu" / "commands",
    REPO_ROOT / "plugins" / "arckit-at" / "commands",
    REPO_ROOT / "plugins" / "arckit-au" / "commands",
    REPO_ROOT / "plugins" / "arckit-au-energy" / "commands",
    REPO_ROOT / "plugins" / "arckit-us" / "commands",
    REPO_ROOT / "plugins" / "arckit-uk-finance" / "commands",
    REPO_ROOT / "plugins" / "arckit-uk-nhs" / "commands",
    REPO_ROOT / "plugins" / "arckit-claude" / "commands",
]
CLAUDE_AGENTS = REPO_ROOT / "plugins" / "arckit-claude" / "agents"
CLAUDE_ONLY_COMMANDS = {"build.md"}
CLAUDE_ONLY_AGENT_FIELDS = {
    "effort",
    "initialPrompt",
    "maxTurns",
    "disallowedTools",
    "tools",
}


def expected_command_names() -> set[str]:
    names: set[str] = set()
    for cmd_dir in PLUGIN_COMMAND_DIRS:
        if not cmd_dir.is_dir():
            continue
        for path in cmd_dir.glob("*.md"):
            if path.name in CLAUDE_ONLY_COMMANDS:
                continue
            names.add(path.stem)
    return names


def markdown_frontmatter(path: Path) -> tuple[dict, str]:
    text = path.read_text(encoding="utf-8")
    assert text.startswith("---"), f"{path} missing markdown frontmatter"
    parts = text.split("---", 2)
    assert len(parts) == 3, f"{path} has malformed markdown frontmatter"
    return yaml.safe_load(parts[1]) or {}, parts[2].strip()


def expected_agent_stems() -> set[str]:
    names: set[str] = set()
    for path in CLAUDE_AGENTS.glob("arckit-*.md"):
        frontmatter, _body = markdown_frontmatter(path)
        if frontmatter.get("subagent"):
            continue
        names.add(path.stem)
    return names


def assert_no_claude_placeholders(path: Path, text: str) -> None:
    assert "${CLAUDE_PLUGIN_ROOT}" not in text, f"{path} contains Claude plugin root"
    assert "${user_config." not in text, f"{path} contains Claude user_config placeholder"
