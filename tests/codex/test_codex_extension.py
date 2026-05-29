"""Validate the generated Codex extension structure."""

import json
from pathlib import Path
import re
import subprocess
import tomllib


REPO_ROOT = Path(__file__).resolve().parents[2]
CLAUDE_COMMANDS = REPO_ROOT / "arckit-claude" / "commands"

# v5.0.0+: commands live across 8 plugin source directories (core + 7
# community overlays). Mirror scripts/converter.py's PLUGIN_SOURCES list
# so this test matches the converter's actual output.
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
CODEX_ROOT = REPO_ROOT / "arckit-codex"
CODEX_SKILLS = CODEX_ROOT / "skills"
CODEX_PROMPTS = CODEX_ROOT / "prompts"
CODEX_COMMANDS = CODEX_ROOT / "commands"
CODEX_AGENTS = CODEX_ROOT / "agents"
CODEX_HOOKS = CODEX_ROOT / "hooks"
CODEX_CONFIG = CODEX_ROOT / "config.toml"
CODEX_README = CODEX_ROOT / "README.md"
CODEX_MANIFEST = CODEX_ROOT / ".codex-plugin" / "plugin.json"
CODEX_MARKETPLACE = REPO_ROOT / ".agents" / "plugins" / "marketplace.json"
CODEX_STANDALONE_MARKETPLACE = CODEX_ROOT / ".agents" / "plugins" / "marketplace.json"
CODEX_MCP = CODEX_ROOT / ".mcp.json"
CODEX_HOOKS_JSON = CODEX_ROOT / "hooks" / "hooks.json"
CODEX_HOOK_RUNNER = CODEX_ROOT / "hooks" / "arckit-codex-hook.mjs"

CLAUDE_ONLY_COMMANDS = {"build.md"}
REFERENCE_SKILLS = {
    "architecture-workflow",
    "mermaid-syntax",
    "plantuml-syntax",
    "wardley-mapping",
}
AGENT_BACKED_SKILLS = {
    "arckit-aws-research",
    "arckit-azure-research",
    "arckit-datascout",
    "arckit-framework",
    "arckit-gcp-research",
    "arckit-gov-code-search",
    "arckit-gov-landscape",
    "arckit-gov-reuse",
    "arckit-grants",
    "arckit-research",
}
CODEX_CLAUDE_PARITY_HOOK_MODULES = {
    "graph-inject.mjs",
    "graph-rollups.mjs",
    "graph-utils.mjs",
    "hook-utils.mjs",
    "project-context-builder.mjs",
    "sync-guides.mjs",
}
BAD_TEMPLATE_OVERRIDE_RE = re.compile(
    r"(First|first|Check if|check if|User overrides).*`\.arckit/templates/"
)


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


def codex_skill_name(command_name: str) -> str:
    return command_name.replace(".", "-")


def expected_command_skill_names() -> set[str]:
    names = expected_command_names()
    normalized = {codex_skill_name(name) for name in names}
    assert len(normalized) == len(names), "Codex skill name normalization caused a collision"
    return normalized


def command_skill_names() -> set[str]:
    return {
        path.name.removeprefix("arckit-")
        for path in CODEX_SKILLS.iterdir()
        if path.is_dir()
        and path.name.startswith("arckit-")
        and path.name not in REFERENCE_SKILLS
    }


def test_codex_command_skills_match_claude_commands_except_claude_only():
    assert command_skill_names() == expected_command_skill_names()


def test_codex_skill_names_are_valid_hyphen_case():
    skill_name_re = re.compile(r"^[a-z0-9-]+$")

    for skill_dir in CODEX_SKILLS.iterdir():
        if not skill_dir.is_dir():
            continue
        skill_md = skill_dir / "SKILL.md"
        text = skill_md.read_text(encoding="utf-8")
        match = re.search(r"^name:\s*(.+)$", text, re.MULTILINE)
        assert match, f"{skill_dir.name} missing name frontmatter"
        frontmatter_name = match.group(1).strip().strip('"')

        assert skill_name_re.fullmatch(skill_dir.name), f"invalid skill dir: {skill_dir.name}"
        assert skill_name_re.fullmatch(frontmatter_name), f"invalid skill name: {frontmatter_name}"
        assert frontmatter_name == skill_dir.name


def test_codex_prompt_and_command_files_match_skills():
    expected = expected_command_names()
    prompt_names = {
        path.name.removeprefix("arckit.").removesuffix(".md")
        for path in CODEX_PROMPTS.glob("arckit.*.md")
    }
    command_names = {
        path.name.removeprefix("arckit.").removesuffix(".md")
        for path in CODEX_COMMANDS.glob("arckit.*.md")
    }

    assert prompt_names == expected
    assert command_names == expected


def test_codex_agents_config_references_existing_files():
    config = tomllib.loads(CODEX_CONFIG.read_text(encoding="utf-8"))
    agent_config = config["agents"]
    configured_agents = {
        name: value
        for name, value in agent_config.items()
        if isinstance(value, dict) and "config_file" in value
    }

    assert set(configured_agents) == AGENT_BACKED_SKILLS

    for name, settings in configured_agents.items():
        toml_path = CODEX_ROOT / settings["config_file"]
        md_path = CODEX_AGENTS / f"{name}.md"
        assert toml_path.is_file(), f"{name} missing TOML config"
        assert md_path.is_file(), f"{name} missing system prompt"

    extra_tomls = {path.stem for path in CODEX_AGENTS.glob("*.toml")} - set(configured_agents)
    assert not extra_tomls


def test_codex_plugin_manifest_references_existing_components():
    manifest = json.loads(CODEX_MANIFEST.read_text(encoding="utf-8"))

    assert manifest["name"] == "arckit-codex"
    assert manifest["skills"] == "./skills/"
    assert manifest["mcpServers"] == "./.mcp.json"
    assert manifest["hooks"] == "./hooks/hooks.json"

    for field in ("skills", "mcpServers", "hooks"):
        rel_path = manifest[field].removeprefix("./")
        assert (CODEX_ROOT / rel_path).exists(), f"manifest {field} target missing"


def test_codex_marketplace_entry_points_to_standalone_repo():
    marketplace = json.loads(CODEX_MARKETPLACE.read_text(encoding="utf-8"))
    manifest = json.loads(CODEX_MANIFEST.read_text(encoding="utf-8"))

    assert marketplace["name"] == "arckit"
    assert marketplace["interface"]["displayName"] == "ArcKit Plugins"
    assert manifest["homepage"] == "https://github.com/tractorjuice/arckit-codex"
    assert manifest["repository"] == "https://github.com/tractorjuice/arckit-codex"
    plugin = next(item for item in marketplace["plugins"] if item["name"] == "arckit-codex")
    assert plugin["source"] == {
        "source": "url",
        "url": "https://github.com/tractorjuice/arckit-codex",
        "ref": "main",
    }
    assert plugin["policy"] == {
        "installation": "AVAILABLE",
        "authentication": "ON_INSTALL",
    }
    assert plugin["category"] == manifest["interface"]["category"]


def test_codex_standalone_repo_has_local_marketplace_entry():
    marketplace = json.loads(CODEX_STANDALONE_MARKETPLACE.read_text(encoding="utf-8"))
    manifest = json.loads(CODEX_MANIFEST.read_text(encoding="utf-8"))

    assert marketplace["name"] == "arckit"
    assert marketplace["interface"]["displayName"] == "ArcKit Plugins"
    plugin = next(item for item in marketplace["plugins"] if item["name"] == "arckit-codex")
    assert plugin["source"] == {
        "source": "local",
        "path": "./",
    }
    assert plugin["policy"] == {
        "installation": "AVAILABLE",
        "authentication": "ON_INSTALL",
    }
    assert plugin["category"] == manifest["interface"]["category"]


def test_codex_readme_documents_plugin_hook_setup():
    readme = CODEX_README.read_text(encoding="utf-8")

    assert "codex plugin marketplace add tractorjuice/arckit-codex" in readme
    assert "hooks = true" in readme
    assert "plugin_hooks = true" in readme
    assert "hooks/hooks.json" in readme


def test_codex_plugin_mcp_config_is_codex_native():
    mcp = json.loads(CODEX_MCP.read_text(encoding="utf-8"))
    servers = mcp["mcpServers"]

    assert set(servers) == {
        "aws-knowledge",
        "microsoft-learn",
        "google-developer-knowledge",
        "datacommons-mcp",
        "govreposcrape",
    }
    assert "alwaysLoad" not in json.dumps(servers)
    assert "${user_config." not in json.dumps(servers)
    assert servers["google-developer-knowledge"]["headers"]["X-Goog-Api-Key"] == "${GOOGLE_API_KEY}"


def test_codex_hooks_are_configured_in_manifest_and_standalone_config():
    hooks = json.loads(CODEX_HOOKS_JSON.read_text(encoding="utf-8"))["hooks"]
    config = tomllib.loads(CODEX_CONFIG.read_text(encoding="utf-8"))

    assert set(hooks) == {
        "SessionStart",
        "UserPromptSubmit",
        "PreToolUse",
        "PostToolUse",
        "PermissionRequest",
        "Stop",
    }
    assert CODEX_HOOK_RUNNER.is_file()
    assert config["features"]["hooks"] is True
    assert config["features"]["plugin_hooks"] is True

    configured_events = set(config["hooks"])
    assert {
        "SessionStart",
        "UserPromptSubmit",
        "PreToolUse",
        "PostToolUse",
        "PermissionRequest",
        "Stop",
    } <= configured_events
    pre_tool = config["hooks"]["PreToolUse"][0]
    assert "Read" in pre_tool["matcher"]
    assert "apply_patch" in pre_tool["matcher"]
    assert '$(git rev-parse --show-toplevel)/.codex/hooks/arckit-codex-hook.mjs' in pre_tool["hooks"][0]["command"]
    assert pre_tool["hooks"][0]["command"].endswith('" PreToolUse')
    post_tool = config["hooks"]["PostToolUse"][0]
    assert "Write" in post_tool["matcher"]
    assert '$(git rev-parse --show-toplevel)/.codex/hooks/arckit-codex-hook.mjs' in post_tool["hooks"][0]["command"]
    assert post_tool["hooks"][0]["command"].endswith('" PostToolUse')
    stop_command = config["hooks"]["Stop"][0]["hooks"][0]["command"]
    assert '$(git rev-parse --show-toplevel)/.codex/hooks/arckit-codex-hook.mjs' in stop_command
    assert stop_command.endswith('" Stop')


def test_codex_bundles_claude_graph_and_pages_hook_processors():
    missing = [
        module
        for module in sorted(CODEX_CLAUDE_PARITY_HOOK_MODULES)
        if not (CODEX_HOOKS / module).is_file()
    ]
    assert not missing

    runner = CODEX_HOOK_RUNNER.read_text(encoding="utf-8")
    assert "runGraphInjectHook" in runner
    assert "runSyncGuidesHook" in runner


def run_codex_hook(event_name: str, payload: dict) -> dict:
    result = subprocess.run(
        ["node", str(CODEX_HOOK_RUNNER), event_name],
        input=json.dumps(payload),
        text=True,
        capture_output=True,
        check=True,
    )
    stdout = result.stdout.strip()
    return json.loads(stdout) if stdout else {}


def test_codex_hook_blocks_secret_prompt():
    output = run_codex_hook(
        "UserPromptSubmit",
        {
            "hook_event_name": "UserPromptSubmit",
            "cwd": str(REPO_ROOT),
            "prompt": "Use this key sk-1234567890abcdefghijklmnopqrstuvwxyz in the request",
        },
    )

    assert output["decision"] == "block"
    assert "OpenAI API key" in output["reason"]


def test_codex_hook_blocks_apply_patch_to_protected_file():
    output = run_codex_hook(
        "PreToolUse",
        {
            "hook_event_name": "PreToolUse",
            "cwd": str(REPO_ROOT),
            "tool_name": "apply_patch",
            "tool_input": {
                "command": "*** Begin Patch\n*** Update File: .env\n@@\n+TOKEN=value\n*** End Patch\n",
            },
        },
    )

    hook_output = output["hookSpecificOutput"]
    assert hook_output["hookEventName"] == "PreToolUse"
    assert hook_output["permissionDecision"] == "deny"
    assert ".env" in hook_output["permissionDecisionReason"]


def test_codex_hook_blocks_invalid_arc_artifact_filename():
    output = run_codex_hook(
        "PreToolUse",
        {
            "hook_event_name": "PreToolUse",
            "cwd": str(REPO_ROOT),
            "tool_name": "apply_patch",
            "tool_input": {
                "command": "*** Begin Patch\n*** Add File: projects/001-demo/ARC-001-REQ.md\n+bad\n*** End Patch\n",
            },
        },
    )

    hook_output = output["hookSpecificOutput"]
    assert hook_output["permissionDecision"] == "deny"
    assert "Expected ARC-NNN-TYPE-vN.N.md" in hook_output["permissionDecisionReason"]


def test_codex_hook_warns_on_score_validation():
    scores = {
        "projectId": "001-demo",
        "criteria": [
            {"id": "C1", "name": "Quality", "weight": 0.8},
            {"id": "C2", "name": "Cost", "weight": 0.4},
        ],
        "vendors": {
            "alpha": {
                "displayName": "Alpha",
                "scores": [
                    {"criterionId": "C1", "score": 4, "evidence": ""},
                    {"criterionId": "C3", "score": 2, "evidence": "Demo evidence"},
                ],
            }
        },
    }
    output = run_codex_hook(
        "PreToolUse",
        {
            "hook_event_name": "PreToolUse",
            "cwd": str(REPO_ROOT),
            "tool_name": "Write",
            "tool_input": {
                "file_path": "projects/001-demo/vendors/scores.json",
                "content": json.dumps(scores),
            },
        },
    )

    assert "ArcKit score validation warnings" in output["systemMessage"]
    assert "Criteria weights sum" in output["systemMessage"]
    assert "score out of range" in output["systemMessage"]
    assert "unknown criterion" in output["systemMessage"]


def test_codex_hook_allows_arckit_mcp_permission_requests():
    output = run_codex_hook(
        "PermissionRequest",
        {
            "hook_event_name": "PermissionRequest",
            "cwd": str(REPO_ROOT),
            "tool_name": "mcp__aws-knowledge__search",
            "tool_input": {},
        },
    )

    assert output["hookSpecificOutput"]["hookEventName"] == "PermissionRequest"
    assert output["hookSpecificOutput"]["decision"]["behavior"] == "allow"


def test_codex_hook_allows_plugin_internal_reads():
    output = run_codex_hook(
        "PreToolUse",
        {
            "hook_event_name": "PreToolUse",
            "cwd": str(REPO_ROOT),
            "tool_name": "Read",
            "tool_input": {
                "file_path": str(CODEX_ROOT / "templates" / "pages-template.html"),
            },
        },
    )

    hook_output = output["hookSpecificOutput"]
    assert hook_output["hookEventName"] == "PreToolUse"
    assert hook_output["permissionDecision"] == "allow"
    assert "plugin-internal file" in hook_output["permissionDecisionReason"]


def test_codex_hook_injects_arckit_context_on_session_start():
    output = run_codex_hook(
        "SessionStart",
        {
            "hook_event_name": "SessionStart",
            "cwd": str(REPO_ROOT),
            "source": "startup",
        },
    )

    context = output["hookSpecificOutput"]["additionalContext"]
    assert "ArcKit Codex plugin v" in context
    assert str(REPO_ROOT) in context


def test_codex_hook_injects_graph_context_for_health(tmp_path):
    project_dir = tmp_path / "projects" / "001-demo"
    project_dir.mkdir(parents=True)
    (tmp_path / ".arckit").mkdir()
    artifact = project_dir / "ARC-001-REQ-v1.0.md"
    artifact.write_text(
        "# Requirements\n\n| Field | Value |\n|-------|-------|\n| Status | Draft |\n\nBR-001 user need\n",
        encoding="utf-8",
    )

    output = run_codex_hook(
        "UserPromptSubmit",
        {
            "hook_event_name": "UserPromptSubmit",
            "cwd": str(tmp_path),
            "prompt": "$arckit-health 001-demo",
        },
    )

    context = output["hookSpecificOutput"]["additionalContext"]
    assert "Health Pre-processor Complete (hook)" in context
    assert "ORPHAN-REQ" in context
    assert "docs/health.json written" in context
    assert "001-demo" in context
    assert (tmp_path / "docs" / "health.json").is_file()


def test_codex_hook_runs_pages_preprocessor(tmp_path):
    project_dir = tmp_path / "projects" / "001-demo"
    project_dir.mkdir(parents=True)
    (tmp_path / ".arckit").mkdir()
    artifact = project_dir / "ARC-001-REQ-v1.0.md"
    artifact.write_text(
        "# Requirements\n\n| Field | Value |\n|-------|-------|\n| Status | Draft |\n\nBR-001 user need\n",
        encoding="utf-8",
    )

    output = run_codex_hook(
        "UserPromptSubmit",
        {
            "hook_event_name": "UserPromptSubmit",
            "cwd": str(tmp_path),
            "prompt": "$arckit-pages",
        },
    )

    context = output["hookSpecificOutput"]["additionalContext"]
    assert "Pages Pre-processor Complete (hook)" in context
    assert "docs/manifest.json" in context
    assert "docs/llms.txt" in context
    assert (tmp_path / "docs" / "manifest.json").is_file()
    assert (tmp_path / "docs" / "index.html").is_file()


def test_codex_hook_updates_manifest_and_stamps_provenance(tmp_path):
    project_dir = tmp_path / "projects" / "001-demo"
    project_dir.mkdir(parents=True)
    docs_dir = tmp_path / "docs"
    docs_dir.mkdir()
    (tmp_path / ".arckit").mkdir()
    artifact = project_dir / "ARC-001-REQ-v1.0.md"
    artifact.write_text(
        "# Demo Requirements\n\n| Field | Value |\n|-------|-------|\n| Status | Draft |\n\nBR-001 user need\n",
        encoding="utf-8",
    )
    manifest = docs_dir / "manifest.json"
    manifest.write_text('{"generated": "2026-01-01T00:00:00.000Z", "projects": []}\n', encoding="utf-8")

    output = run_codex_hook(
        "PostToolUse",
        {
            "hook_event_name": "PostToolUse",
            "cwd": str(tmp_path),
            "tool_name": "Write",
            "model": "gpt-5.5",
            "session_id": "session-1",
            "turn_id": "turn-1",
            "tool_input": {
                "file_path": "projects/001-demo/ARC-001-REQ-v1.0.md",
                "content": artifact.read_text(encoding="utf-8"),
            },
        },
    )

    context = output["hookSpecificOutput"]["additionalContext"]
    assert "Provenance stamped" in context
    assert "Manifest updated" in context
    artifact_text = artifact.read_text(encoding="utf-8")
    assert "arckit-provenance:start" in artifact_text
    assert "| Model | `gpt-5.5` |" in artifact_text

    updated_manifest = json.loads(manifest.read_text(encoding="utf-8"))
    project = updated_manifest["projects"][0]
    assert project["id"] == "001-demo"
    assert project["documents"][0]["documentId"] == "ARC-001-REQ-v1.0"
    assert project["documents"][0]["path"] == "projects/001-demo/ARC-001-REQ-v1.0.md"


def test_codex_hook_records_stop_failure_session_memory(tmp_path):
    (tmp_path / ".arckit").mkdir()

    output = run_codex_hook(
        "Stop",
        {
            "hook_event_name": "Stop",
            "cwd": str(tmp_path),
            "reason": "api_error",
        },
    )

    assert output == {}
    sessions = tmp_path / ".arckit" / "memory" / "sessions.md"
    last_session = tmp_path / ".arckit" / "memory" / ".last-session"
    assert sessions.is_file()
    assert last_session.is_file()
    text = sessions.read_text(encoding="utf-8")
    assert "# Session Log" in text
    assert "failure (api_error)" in text


def test_codex_bundles_schemas_and_validators():
    assert (CODEX_ROOT / "config" / "doc-types.mjs").is_file()
    assert (CODEX_ROOT / "schemas" / "grants-handoff.schema.json").is_file()
    assert (CODEX_ROOT / "schemas" / "gov-reuse-handoff.schema.json").is_file()
    assert (CODEX_ROOT / "scripts" / "validate-handoff.mjs").is_file()


def test_command_skills_disable_implicit_invocation():
    for skill_name in command_skill_names():
        policy_path = CODEX_SKILLS / f"arckit-{skill_name}" / "agents" / "openai.yaml"
        assert policy_path.is_file(), f"{skill_name} missing openai.yaml"
        assert "allow_implicit_invocation: false" in policy_path.read_text(encoding="utf-8")


def test_template_customizations_use_templates_custom():
    checked_files = [
        path
        for path in CODEX_SKILLS.glob("arckit-*/SKILL.md")
        if path.is_file()
    ]
    checked_files.extend(CODEX_AGENTS.glob("arckit-*.md"))
    checked_files.extend(CODEX_AGENTS.glob("arckit-*.toml"))

    offenders = [
        str(path.relative_to(REPO_ROOT))
        for path in checked_files
        if BAD_TEMPLATE_OVERRIDE_RE.search(path.read_text(encoding="utf-8"))
    ]
    assert not offenders

    for skill_name in AGENT_BACKED_SKILLS | {"arckit-customize", "arckit-requirements"}:
        skill_path = CODEX_SKILLS / skill_name / "SKILL.md"
        assert ".arckit/templates-custom/" in skill_path.read_text(encoding="utf-8")


def test_codex_agent_prompts_are_rewritten_and_filtered():
    assert not (CODEX_AGENTS / "READER-PATTERN.md").exists()

    for path in CODEX_AGENTS.glob("*.md"):
        assert path.name.startswith("arckit-")
        text = path.read_text(encoding="utf-8")
        assert "${CLAUDE_PLUGIN_ROOT}" not in text


def test_no_claude_subagent_orchestrator_leaks_into_codex_command_skills():
    forbidden = ("subagent_type", "Agent tool", "orchestrator tier", "reader subagent", "writer subagent")
    for skill_name in ("arckit-datascout", "arckit-gov-reuse", "arckit-grants"):
        text = (CODEX_SKILLS / skill_name / "SKILL.md").read_text(encoding="utf-8")
        for phrase in forbidden:
            assert phrase not in text


def test_codex_skills_do_not_expose_claude_command_syntax_or_hooks():
    forbidden_phrases = (
        "Claude Code",
        ".claude/commands",
        "SessionStart hook",
        "Stop hook",
        "/loop",
        "AskUserQuestion",
    )
    slash_command_re = re.compile(r"(?<![\w/])/arckit[.:*]")
    invalid_skill_invocation_re = re.compile(r"/\$arckit-")

    offenders = []
    for path in CODEX_SKILLS.glob("*/SKILL.md"):
        text = path.read_text(encoding="utf-8")
        for phrase in forbidden_phrases:
            if phrase in text:
                offenders.append(f"{path.relative_to(REPO_ROOT)} contains {phrase!r}")
        if slash_command_re.search(text):
            offenders.append(f"{path.relative_to(REPO_ROOT)} contains /arckit command syntax")
        if invalid_skill_invocation_re.search(text):
            offenders.append(f"{path.relative_to(REPO_ROOT)} contains /$arckit invocation syntax")

    assert not offenders
