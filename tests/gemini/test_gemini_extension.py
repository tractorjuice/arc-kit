"""Validate the generated Gemini CLI extension structure."""

import json
import re
import tomllib

from tests.extension_helpers import (
    REPO_ROOT,
    assert_no_claude_placeholders,
    expected_agent_stems,
    expected_command_names,
    markdown_frontmatter,
)


GEMINI_ROOT = REPO_ROOT / "extensions" / "arckit-gemini"
GEMINI_COMMANDS = GEMINI_ROOT / "commands" / "arckit"
GEMINI_AGENTS = GEMINI_ROOT / "agents"
GEMINI_HOOKS = GEMINI_ROOT / "hooks" / "hooks.json"
GEMINI_POLICIES = GEMINI_ROOT / "policies" / "rules.toml"
GEMINI_MANIFEST = GEMINI_ROOT / "gemini-extension.json"


def command_names() -> set[str]:
    return {path.stem for path in GEMINI_COMMANDS.glob("*.toml")}


def test_gemini_required_files_and_directories_exist():
    required_files = [
        GEMINI_ROOT / "README.md",
        GEMINI_ROOT / "LICENSE",
        GEMINI_ROOT / "VERSION",
        GEMINI_ROOT / "GEMINI.md",
        GEMINI_MANIFEST,
        GEMINI_HOOKS,
        GEMINI_POLICIES,
    ]
    required_dirs = [
        GEMINI_COMMANDS,
        GEMINI_AGENTS,
        GEMINI_ROOT / "templates",
        GEMINI_ROOT / "docs" / "guides",
        GEMINI_ROOT / "config",
        GEMINI_ROOT / "schemas",
        GEMINI_ROOT / "references",
        GEMINI_ROOT / "scripts",
        GEMINI_ROOT / "hooks" / "scripts",
    ]

    for path in required_files:
        assert path.is_file(), f"missing Gemini file: {path.relative_to(REPO_ROOT)}"
    for path in required_dirs:
        assert path.is_dir(), f"missing Gemini dir: {path.relative_to(REPO_ROOT)}"


def test_gemini_command_files_match_source_commands():
    assert command_names() == expected_command_names()


def test_gemini_commands_are_valid_toml_and_rewritten_for_extension_access():
    for command_path in GEMINI_COMMANDS.glob("*.toml"):
        with command_path.open("rb") as f:
            command = tomllib.load(f)

        assert isinstance(command.get("description"), str) and command["description"].strip()
        assert isinstance(command.get("prompt"), str) and command["prompt"].strip()
        assert "Gemini Extension File Access" in command["prompt"]
        assert "$ARGUMENTS" not in command["prompt"]
        assert_no_claude_placeholders(command_path, command["prompt"])


def test_gemini_requirements_command_uses_expected_paths_and_args():
    with (GEMINI_COMMANDS / "requirements.toml").open("rb") as f:
        command = tomllib.load(f)
    prompt = command["prompt"]

    assert "{{args}}" in prompt
    assert "cat ~/.gemini/extensions/arckit/templates/requirements-template.md" in prompt
    assert "~/.gemini/extensions/arckit/references/citation-instructions.md" in prompt
    assert "Read `~/.gemini/extensions/arckit/" not in prompt


def test_gemini_manifest_version_and_mcp_config_are_valid():
    root_version = (REPO_ROOT / "VERSION").read_text(encoding="utf-8").strip()
    manifest = json.loads(GEMINI_MANIFEST.read_text(encoding="utf-8"))
    mcp_json = json.dumps(manifest["mcpServers"])

    assert manifest["name"] == "arckit"
    assert manifest["version"] == root_version
    assert manifest["contextFileName"] == "GEMINI.md"
    assert set(manifest["mcpServers"]) == {
        "aws-knowledge",
        "microsoft-learn",
        "google-developer-knowledge",
        "datacommons-mcp",
        "govreposcrape",
    }
    assert "alwaysLoad" not in mcp_json
    assert "${user_config." not in mcp_json
    assert manifest["mcpServers"]["google-developer-knowledge"]["headers"]["X-Goog-Api-Key"] == "${GOOGLE_API_KEY}"


def test_gemini_agents_match_source_agents_and_are_valid():
    expected_files = {f"{name}.md" for name in expected_agent_stems()}
    actual_files = {path.name for path in GEMINI_AGENTS.glob("arckit-*.md")}

    assert actual_files == expected_files

    for agent_path in GEMINI_AGENTS.glob("arckit-*.md"):
        frontmatter, body = markdown_frontmatter(agent_path)
        assert frontmatter["name"] == agent_path.stem
        assert isinstance(frontmatter["description"], str) and frontmatter["description"].strip()
        assert frontmatter["max_turns"] == 25
        assert frontmatter["timeout_mins"] == 10
        assert "model" not in frontmatter
        assert "tools" not in frontmatter
        assert "Gemini Extension File Access" in body
        assert_no_claude_placeholders(agent_path, body)


def test_gemini_hooks_reference_existing_scripts():
    hooks = json.loads(GEMINI_HOOKS.read_text(encoding="utf-8"))["hooks"]

    assert set(hooks) == {"SessionStart", "BeforeAgent", "BeforeTool", "AfterTool"}
    for hook_groups in hooks.values():
        for hook_group in hook_groups:
            for hook in hook_group["hooks"]:
                command = hook["command"]
                match = re.search(r"\$\{extensionPath\}/([^ ]+)", command)
                assert match, f"hook command does not use extensionPath: {command}"
                assert (GEMINI_ROOT / match.group(1)).is_file()


def test_gemini_policies_are_valid_toml():
    with GEMINI_POLICIES.open("rb") as f:
        policies = tomllib.load(f)

    rules = policies["rules"]
    assert {rule["decision"] for rule in rules} == {"deny", "ask"}
    assert any("ArcKit extension system files" in rule["description"] for rule in rules)


def test_gemini_bundles_supporting_assets():
    expected_files = [
        GEMINI_ROOT / "templates" / "requirements-template.md",
        GEMINI_ROOT / "docs" / "guides" / "requirements.md",
        GEMINI_ROOT / "config" / "doc-types.mjs",
        GEMINI_ROOT / "schemas" / "grants-handoff.schema.json",
        GEMINI_ROOT / "references" / "citation-instructions.md",
        GEMINI_ROOT / "scripts" / "validate-handoff.mjs",
        GEMINI_ROOT / "hooks" / "okf-frontmatter.mjs",
    ]

    for path in expected_files:
        assert path.is_file(), f"missing Gemini bundled asset: {path.relative_to(REPO_ROOT)}"
