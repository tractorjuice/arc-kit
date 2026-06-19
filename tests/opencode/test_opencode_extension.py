"""Validate the generated OpenCode CLI extension structure."""

import json

from tests.extension_helpers import (
    CLAUDE_ONLY_AGENT_FIELDS,
    REPO_ROOT,
    assert_no_claude_placeholders,
    expected_agent_stems,
    expected_command_names,
    markdown_frontmatter,
)


OPENCODE_ROOT = REPO_ROOT / "extensions" / "arckit-opencode"
OPENCODE_COMMANDS = OPENCODE_ROOT / "commands"
OPENCODE_AGENTS = OPENCODE_ROOT / "agents"
OPENCODE_CONFIG = OPENCODE_ROOT / "opencode.json"


def command_names() -> set[str]:
    return {
        path.name.removeprefix("arckit.").removesuffix(".md")
        for path in OPENCODE_COMMANDS.glob("arckit.*.md")
    }


def test_opencode_required_files_and_directories_exist():
    required_files = [
        OPENCODE_ROOT / "README.md",
        OPENCODE_ROOT / "LICENSE",
        OPENCODE_ROOT / "VERSION",
        OPENCODE_CONFIG,
    ]
    required_dirs = [
        OPENCODE_COMMANDS,
        OPENCODE_AGENTS,
        OPENCODE_ROOT / "templates",
        OPENCODE_ROOT / "docs" / "guides",
        OPENCODE_ROOT / "config",
        OPENCODE_ROOT / "schemas",
        OPENCODE_ROOT / "references",
        OPENCODE_ROOT / "scripts",
        OPENCODE_ROOT / "hooks",
    ]

    for path in required_files:
        assert path.is_file(), f"missing OpenCode file: {path.relative_to(REPO_ROOT)}"
    for path in required_dirs:
        assert path.is_dir(), f"missing OpenCode dir: {path.relative_to(REPO_ROOT)}"


def test_opencode_command_files_match_source_commands():
    assert command_names() == expected_command_names()


def test_opencode_commands_have_valid_frontmatter_and_rewritten_paths():
    for command_path in OPENCODE_COMMANDS.glob("arckit.*.md"):
        frontmatter, body = markdown_frontmatter(command_path)

        assert isinstance(frontmatter.get("description"), str)
        assert frontmatter["description"].strip()
        assert body
        assert_no_claude_placeholders(command_path, body)


def test_opencode_agent_backed_commands_embed_agent_prompts():
    for agent_stem in expected_agent_stems():
        command_name = agent_stem.removeprefix("arckit-")
        command_path = OPENCODE_COMMANDS / f"arckit.{command_name}.md"
        _frontmatter, body = markdown_frontmatter(command_path)

        assert "$ARGUMENTS" in body


def test_opencode_config_is_valid_and_uses_remote_mcp_servers():
    config = json.loads(OPENCODE_CONFIG.read_text(encoding="utf-8"))
    servers = config["mcp"]
    serialized = json.dumps(servers)

    assert config["$schema"] == "https://opencode.ai/config.json"
    assert set(servers) == {
        "aws-knowledge",
        "microsoft-learn",
        "google-developer-knowledge",
    }
    for server in servers.values():
        assert server["type"] == "remote"
        assert server["url"].endswith("/sse")
        assert isinstance(server["enabled"], bool)
    assert "alwaysLoad" not in serialized
    assert "${user_config." not in serialized
    assert servers["google-developer-knowledge"]["headers"]["X-Goog-Api-Key"] == "${GOOGLE_API_KEY}"


def test_opencode_agents_match_source_agents_and_strip_claude_only_fields():
    expected_files = {f"{name}.md" for name in expected_agent_stems()}
    actual_files = {path.name for path in OPENCODE_AGENTS.glob("arckit-*.md")}

    assert actual_files == expected_files

    for agent_path in OPENCODE_AGENTS.glob("arckit-*.md"):
        frontmatter, body = markdown_frontmatter(agent_path)
        assert frontmatter["name"] == agent_path.stem
        assert isinstance(frontmatter["description"], str) and frontmatter["description"].strip()
        assert not (set(frontmatter) & CLAUDE_ONLY_AGENT_FIELDS)
        assert_no_claude_placeholders(agent_path, body)


def test_opencode_bundles_supporting_assets():
    expected_files = [
        OPENCODE_ROOT / "templates" / "requirements-template.md",
        OPENCODE_ROOT / "docs" / "guides" / "requirements.md",
        OPENCODE_ROOT / "config" / "doc-types.mjs",
        OPENCODE_ROOT / "schemas" / "grants-handoff.schema.json",
        OPENCODE_ROOT / "references" / "citation-instructions.md",
        OPENCODE_ROOT / "scripts" / "validate-handoff.mjs",
        OPENCODE_ROOT / "hooks" / "okf-frontmatter.mjs",
    ]

    for path in expected_files:
        assert path.is_file(), f"missing OpenCode bundled asset: {path.relative_to(REPO_ROOT)}"
