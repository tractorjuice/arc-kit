"""Validate the generated GitHub Copilot extension structure."""

from tests.extension_helpers import (
    REPO_ROOT,
    assert_no_claude_placeholders,
    expected_agent_stems,
    expected_command_names,
    markdown_frontmatter,
)


COPILOT_ROOT = REPO_ROOT / "extensions" / "arckit-copilot"
COPILOT_PROMPTS = COPILOT_ROOT / "prompts"
COPILOT_AGENTS = COPILOT_ROOT / "agents"
COPILOT_INSTRUCTIONS = COPILOT_ROOT / "copilot-instructions.md"


def prompt_command_names() -> set[str]:
    return {
        path.name.removeprefix("arckit-").removesuffix(".prompt.md")
        for path in COPILOT_PROMPTS.glob("arckit-*.prompt.md")
    }


def test_copilot_required_files_and_directories_exist():
    required_files = [
        COPILOT_ROOT / "README.md",
        COPILOT_ROOT / "VERSION",
        COPILOT_INSTRUCTIONS,
    ]
    required_dirs = [
        COPILOT_PROMPTS,
        COPILOT_AGENTS,
        COPILOT_ROOT / "templates",
        COPILOT_ROOT / "docs" / "guides",
        COPILOT_ROOT / "config",
        COPILOT_ROOT / "schemas",
        COPILOT_ROOT / "references",
        COPILOT_ROOT / "scripts",
        COPILOT_ROOT / "hooks",
    ]

    for path in required_files:
        assert path.is_file(), f"missing Copilot file: {path.relative_to(REPO_ROOT)}"
    for path in required_dirs:
        assert path.is_dir(), f"missing Copilot dir: {path.relative_to(REPO_ROOT)}"


def test_copilot_prompt_files_match_source_commands():
    assert prompt_command_names() == expected_command_names()


def test_copilot_prompts_have_valid_frontmatter_and_rewritten_paths():
    for prompt_path in COPILOT_PROMPTS.glob("arckit-*.prompt.md"):
        frontmatter, body = markdown_frontmatter(prompt_path)

        assert isinstance(frontmatter.get("description"), str)
        assert frontmatter["description"].strip()
        assert isinstance(frontmatter.get("agent"), str)
        assert isinstance(frontmatter.get("tools"), list)
        assert all(isinstance(tool, str) for tool in frontmatter["tools"])
        assert body
        assert "$ARGUMENTS" not in body
        assert "/arckit:" not in body
        assert_no_claude_placeholders(prompt_path, body)


def test_copilot_agent_backed_prompts_use_generated_custom_agents():
    for agent_stem in expected_agent_stems():
        command_name = agent_stem.removeprefix("arckit-")
        prompt_path = COPILOT_PROMPTS / f"arckit-{command_name}.prompt.md"
        frontmatter, body = markdown_frontmatter(prompt_path)

        assert frontmatter["agent"] == agent_stem
        assert (COPILOT_AGENTS / f"{agent_stem}.agent.md").is_file()
        assert f"Use the `{agent_stem}` agent" in body


def test_copilot_custom_agents_match_source_agents_and_are_valid():
    expected_files = {f"{name}.agent.md" for name in expected_agent_stems()}
    actual_files = {path.name for path in COPILOT_AGENTS.glob("arckit-*.agent.md")}

    assert actual_files == expected_files

    for agent_path in COPILOT_AGENTS.glob("arckit-*.agent.md"):
        frontmatter, body = markdown_frontmatter(agent_path)
        assert frontmatter["name"] == agent_path.name.removesuffix(".agent.md")
        assert isinstance(frontmatter["description"], str) and frontmatter["description"].strip()
        assert frontmatter["user-invocable"] is False
        assert isinstance(frontmatter["tools"], list) and frontmatter["tools"]
        assert_no_claude_placeholders(agent_path, body)


def test_copilot_instructions_point_to_generated_prompts():
    text = COPILOT_INSTRUCTIONS.read_text(encoding="utf-8")

    assert ".github/prompts/arckit-*.prompt.md" in text
    assert ".arckit/templates-custom/" in text
    assert "projects/001-project-name/" in text


def test_copilot_bundles_supporting_assets():
    expected_files = [
        COPILOT_ROOT / "templates" / "requirements-template.md",
        COPILOT_ROOT / "docs" / "guides" / "requirements.md",
        COPILOT_ROOT / "config" / "doc-types.mjs",
        COPILOT_ROOT / "schemas" / "grants-handoff.schema.json",
        COPILOT_ROOT / "references" / "citation-instructions.md",
        COPILOT_ROOT / "scripts" / "validate-handoff.mjs",
        COPILOT_ROOT / "hooks" / "okf-frontmatter.mjs",
    ]

    for path in expected_files:
        assert path.is_file(), f"missing Copilot bundled asset: {path.relative_to(REPO_ROOT)}"
