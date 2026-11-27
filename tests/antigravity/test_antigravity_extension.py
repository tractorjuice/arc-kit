"""The Antigravity plugin is generated in the shape Antigravity's plugin loader documents.

Read from antigravity.google/docs (build-plugins, skills, mcp) on 22 November 2026:

- `plugin.json` at the plugin root; its schema requires `name` and allows no unknown key;
- a skill is `skills/<name>/SKILL.md`, with `name` (kebab-case, 1 to 64 characters, equal to its folder)
  and `description` (1 to 1,024 characters); skills are invoked `/<name>` and are not namespaced by plugin;
- `mcp_config.json` at the plugin root; a server that declares `variables` leaves the plugin disabled
  until they are filled in, so servers that need a key are left out;
- the loader takes the first 24,000 bytes of a SKILL.md body and drops the rest. That limit is not in the
  documentation: `agy plugin validate --strict` (agy 1.5.13) reported it on 29 skills, so a longer body goes
  into `instructions.md` beside the skill;
- a skill can read its own folder by relative path, and nothing else in the plugin is documented as
  reachable, so templates and scripts come from the project's `.arckit/`.

The generated plugin passes `agy plugin validate --strict` (agy 1.5.13, 22 November 2026); the last test here runs
it where `agy` is installed. One command, `/arckit-start`, was run in `agy -p` that day and received its arguments.
"""

from __future__ import annotations

import json
import os
import re
import shutil
import subprocess
import sys
from pathlib import Path

import pytest
import yaml

REPO = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(REPO / "scripts"))
import converter  # noqa: E402

EXT = REPO / "extensions" / "arckit-antigravity"
SKILLS = EXT / "skills"
MANIFEST_KEYS = {"$schema", "name", "displayName", "description", "version", "disabled", "logo", "suggestedPrompts", "skills",
                 "author", "homepage", "repository", "license", "keywords", "extensions"}
SKILL_KEYS = {"name", "description", "disable-model-invocation", "license", "compatibility"}
KEBAB = re.compile(r"^[a-z0-9]+(-[a-z0-9]+)*$")

pytestmark = pytest.mark.skipif(not (EXT / "plugin.json").is_file(), reason="run scripts/converter.py to generate the plugin")


def skills() -> list[Path]:
    return sorted(SKILLS.glob("*/SKILL.md"))


def front(path: Path) -> dict:
    return yaml.safe_load(path.read_text(encoding="utf-8").split("---", 2)[1])


def test_names_and_invocations():
    assert converter.antigravity_skill_name("requirements") == "arckit-requirements"
    assert converter.antigravity_skill_name("wardley.value-chain") == "arckit-wardley-value-chain"
    assert converter.antigravity_skill_invocation("requirements") == "/arckit-requirements"


def test_the_manifest_has_only_documented_keys():
    manifest = json.loads((EXT / "plugin.json").read_text(encoding="utf-8"))
    assert set(manifest) <= MANIFEST_KEYS, set(manifest) - MANIFEST_KEYS
    assert manifest["name"] == "arckit" and KEBAB.match(manifest["name"])
    assert manifest["version"] == (EXT / "VERSION").read_text(encoding="utf-8").strip()
    assert 120 <= len(manifest["description"]) <= 160, len(manifest["description"])
    assert len(manifest["suggestedPrompts"]) <= 3
    # The marketplace refuses a display name that opens with another product's name.
    assert not manifest["displayName"].startswith(("Antigravity", "Gemini", "Claude", "Cursor"))


def test_suggested_prompts_name_skills_that_exist():
    manifest = json.loads((EXT / "plugin.json").read_text(encoding="utf-8"))
    for prompt in manifest["suggestedPrompts"]:
        name = prompt.split()[0].lstrip("/")
        assert (SKILLS / name / "SKILL.md").is_file(), prompt


def test_every_convertible_command_has_a_skill():
    names = {p.parent.name for p in skills()}
    core = {p.stem for p in (REPO / "plugins" / "arckit-claude" / "commands").glob("*.md")} - {"build"}
    missing = {converter.antigravity_skill_name(c) for c in core} - names
    assert not missing, sorted(missing)[:5]
    # Antigravity gets what the other skill-based target gets.
    kimi = {p.parent.name for p in (REPO / "extensions" / "arckit-kimi" / "skills").glob("*/SKILL.md")}
    assert names == {n if n.startswith("arckit-") else f"arckit-{n}" for n in kimi}


def test_every_skill_carries_the_prefix():
    """Antigravity does not namespace a plugin's skills, so a bare `mermaid-syntax` could collide with another
    plugin's. The four reference skills are renamed for this target."""
    names = {p.parent.name for p in skills()}
    assert all(n.startswith("arckit-") for n in names), sorted(n for n in names if not n.startswith("arckit-"))
    assert {"arckit-mermaid-syntax", "arckit-plantuml-syntax", "arckit-wardley-mapping", "arckit-architecture-workflow"} <= names


def test_a_file_path_is_not_rewritten_as_a_command():
    """`/tmp/arckit-wardley.owm` holds the invocation prefix; it is a file, and keeps its extension."""
    text = skill_texts(SKILLS / "arckit-wardley" / "SKILL.md")
    assert "/tmp/arckit-wardley.owm" in text and "arckit-wardley-owm" not in text
    for path in skills():
        assert not re.search(r"/tmp/arckit-[\w-]+-owm\b", skill_texts(path)), path.parent.name


def test_the_manifest_points_at_a_repository_that_exists():
    manifest = json.loads((EXT / "plugin.json").read_text(encoding="utf-8"))
    assert manifest["repository"] == "https://github.com/tractorjuice/arckit-antigravity"
    push = (REPO / "scripts" / "push-extensions.sh").read_text(encoding="utf-8")
    # The repository is filled at each release, with the generated files it cannot do without.
    assert '[antigravity]="extensions/arckit-antigravity:arckit-antigravity"' in push
    assert '[antigravity]="skills agents rules hooks/agy-hook.mjs hooks.json templates config docs/guides plugin.json mcp_config.json assets/logo.svg"' in push


@pytest.mark.parametrize("path", skills(), ids=lambda p: p.parent.name)
def test_a_skill_is_in_the_documented_shape(path):
    fm = front(path)
    assert set(fm) <= SKILL_KEYS, set(fm) - SKILL_KEYS
    assert fm["name"] == path.parent.name and KEBAB.match(fm["name"]) and len(fm["name"]) <= 64
    assert 1 <= len(fm["description"]) <= 1024


@pytest.mark.parametrize("path", skills(), ids=lambda p: p.parent.name)
def test_a_skill_body_fits_what_the_loader_reads(path):
    """A body over the limit is cut short without a word, so it moves to a file the skill is told to read first."""
    body = path.read_text(encoding="utf-8")[4:].split("\n---\n", 1)[1]
    assert len(body.encode("utf-8")) <= converter.ANTIGRAVITY_SKILL_BODY_LIMIT
    instructions = path.parent / converter.ANTIGRAVITY_INSTRUCTIONS_FILE
    if (EXT / "agents" / f"{path.parent.name}-agent.md").exists():
        # A command that hands over to a subagent keeps its prompt beside it whatever its length.
        assert instructions.exists()
        return
    if instructions.exists():
        assert len(instructions.read_bytes()) > converter.ANTIGRAVITY_SKILL_BODY_LIMIT
        assert "read `instructions.md` from its first line to its last" in body
        assert "do not answer from this description alone" in body


def test_the_long_commands_are_the_ones_that_were_moved():
    moved = {p.parent.name for p in skills() if (p.parent / converter.ANTIGRAVITY_INSTRUCTIONS_FILE).exists()}
    assert {"arckit-jsp-936", "arckit-service-assessment", "arckit-diagram", "arckit-wardley"} <= moved
    assert "arckit-start" not in moved


def test_splitting_keeps_the_frontmatter_and_the_whole_body(tmp_path):
    skill = tmp_path / "arckit-long"
    skill.mkdir()
    body = "# Long\n\n" + "x" * 30000 + "\nlast line\n"
    (skill / "SKILL.md").write_text('---\nname: arckit-long\ndescription: "d"\n---\n\n' + body, encoding="utf-8")
    short = tmp_path / "arckit-short"
    short.mkdir()
    (short / "SKILL.md").write_text('---\nname: arckit-short\ndescription: "d"\n---\n\nshort\n', encoding="utf-8")
    assert converter.split_long_antigravity_skills(str(tmp_path)) == ["arckit-long"]
    assert (skill / "instructions.md").read_text(encoding="utf-8") == body
    assert (skill / "SKILL.md").read_text(encoding="utf-8").startswith('---\nname: arckit-long\ndescription: "d"\n---\n')
    assert not (short / "instructions.md").exists()


def test_the_manifest_names_a_logo_that_is_there():
    manifest = json.loads((EXT / "plugin.json").read_text(encoding="utf-8"))
    assert (EXT / manifest["logo"]).is_file()


def skill_texts(path: Path) -> str:
    extra = path.parent / converter.ANTIGRAVITY_INSTRUCTIONS_FILE
    return path.read_text(encoding="utf-8") + (extra.read_text(encoding="utf-8") if extra.exists() else "")


@pytest.mark.parametrize("path", skills(), ids=lambda p: p.parent.name)
def test_a_skill_names_nothing_only_claude_code_has(path):
    text = skill_texts(path)
    assert "${CLAUDE_PLUGIN_ROOT}" not in text
    assert "AskUserQuestion" not in text
    assert not re.search(r"(?<![\w/])/arckit[.:]", text), "a command in another assistant's form"


def test_the_bulk_build_harness_is_left_out():
    assert not (SKILLS / "arckit-build").exists()


def test_mcp_servers_need_no_key():
    """A server with a key would have to declare it under `variables`, and the plugin would install disabled."""
    servers = json.loads((EXT / "mcp_config.json").read_text(encoding="utf-8"))["mcpServers"]
    assert set(servers) == {"aws-knowledge", "microsoft-learn", "govreposcrape", "uk-tenders", "trello"}
    for name, entry in servers.items():
        assert set(entry) == {"url"}, (name, entry)
        assert entry["url"].startswith("https://")
    assert "user_config" not in json.dumps(servers) and "${" not in json.dumps(servers)


def test_the_generator_leaves_out_keyed_servers(tmp_path):
    source = tmp_path / ".mcp.json"
    source.write_text(json.dumps({"mcpServers": {
        "open": {"type": "http", "url": "https://example.org/mcp", "alwaysLoad": True},
        "keyed": {"type": "http", "url": "https://example.org/k", "headers": {"X-Key": "${user_config.KEY}"}},
        "local": {"command": "node", "args": ["server.mjs"]},
        # Nothing the generator can map, and a path inside the Claude plugin: both are named, not dropped in silence.
        "odd": {"type": "sse"},
        "inside": {"command": "node", "args": ["${CLAUDE_PLUGIN_ROOT}/server.mjs"]},
    }}), encoding="utf-8")
    servers, left_out = converter.generate_antigravity_plugin(str(source), "1.2.3", str(tmp_path / "out"))
    assert servers == {"open": {"url": "https://example.org/mcp"}, "local": {"command": "node", "args": ["server.mjs"]}}
    assert left_out == ["keyed", "odd", "inside"]
    assert json.loads((tmp_path / "out" / "plugin.json").read_text())["version"] == "1.2.3"


def test_nothing_the_validator_would_flag_as_ignored_is_shipped():
    """`agy plugin validate --strict` fails on files the loader ignores: a `commands/` folder, `.mcp.json`,
    a root `AGENTS.md` and `hooks/hooks.json`."""
    for ignored in ["commands", ".mcp.json", "AGENTS.md", "hooks/hooks.json"]:
        assert not (EXT / ignored).exists(), ignored


# --- subagents, hooks and the rule (read from antigravity.google/docs/build-plugins and /docs/hooks, 22 November 2026)

AGENT_KEYS = {"name", "description", "mainAgent", "subagent", "model", "tools", "commandExecutionPolicy", "skills",
              "inheritMcp", "inheritCustomizations"}
HOOK_EVENTS = {"SessionStart", "PreToolUse", "PostToolUse", "PreInvocation", "PostInvocation", "Stop"}
DELEGATED = sorted(p.stem for p in (EXT / "agents").glob("*.md")) if (EXT / "agents").is_dir() else []


def front_and_body(path):
    text = path.read_text(encoding="utf-8")
    front, body = text[4:].split("\n---\n", 1)
    return yaml.safe_load(front), body


def test_the_research_commands_have_subagents_and_the_scoring_ones_do_not():
    assert "arckit-research-agent" in DELEGATED and "arckit-grants-agent" in DELEGATED
    assert len(DELEGATED) == 12
    # Scoring a bid stays where the person running it can follow it.
    assert "arckit-evaluate-agent" not in DELEGATED and "arckit-score-agent" not in DELEGATED


@pytest.mark.parametrize("agent", DELEGATED)
def test_a_subagent_is_in_the_documented_shape_and_carries_the_whole_prompt(agent):
    front, body = front_and_body(EXT / "agents" / f"{agent}.md")
    assert set(front) <= AGENT_KEYS, set(front) - AGENT_KEYS
    assert front["name"] == agent and KEBAB.match(agent)
    assert front["subagent"] is True and front["mainAgent"] is False
    assert front["model"] in {"inherit", "flash_lite", "flash", "pro"}
    # It needs the plugin's MCP servers to do its research.
    assert front["inheritMcp"] is True
    skill = agent[: -len("-agent")]
    kept = (SKILLS / skill / converter.ANTIGRAVITY_INSTRUCTIONS_FILE).read_text(encoding="utf-8")
    # The same prompt, except that a skill is handed the user's text and a subagent is given it by the main agent.
    assert body.strip() == kept.strip().replace("$ARGUMENTS", "the request you were given")
    assert not front["description"].endswith("..") and ". Does the reading" in front["description"]
    assert len(body) > 2000
    assert "Claude Code" not in body and "CLAUDE_PLUGIN_ROOT" not in body


@pytest.mark.parametrize("agent", DELEGATED)
def test_the_skill_hands_over_and_says_what_to_do_without_a_subagent(agent):
    skill = agent[: -len("-agent")]
    _, body = front_and_body(SKILLS / skill / "SKILL.md")
    assert f"Start the `{agent}` subagent" in body
    assert "If you cannot start a subagent, read `instructions.md`" in body
    assert "$ARGUMENTS" in body
    assert len(body.encode("utf-8")) < converter.ANTIGRAVITY_SKILL_BODY_LIMIT


def test_hooks_json_is_in_the_documented_shape():
    hooks = json.loads((EXT / "hooks.json").read_text(encoding="utf-8"))
    assert set(hooks) == {"arckit-gates", "arckit-manifest"}
    for group in hooks.values():
        assert set(group) <= HOOK_EVENTS | {"enabled"}
        for event in ("PreToolUse", "PostToolUse"):
            for entry in group.get(event, []):
                assert set(entry) == {"matcher", "hooks"}
                re.compile(entry["matcher"])
                for handler in entry["hooks"]:
                    assert handler["type"] == "command"
                    # Hook commands run with the plugin root as the working directory.
                    assert handler["command"].startswith("node ./hooks/agy-hook.mjs ")
                    assert "${" not in handler["command"]
                    for gate in handler["command"].split()[3:]:
                        assert (EXT / "hooks" / f"{gate}.mjs").is_file(), gate


def test_the_file_name_gate_runs_on_new_files_only():
    gates = json.loads((EXT / "hooks.json").read_text(encoding="utf-8"))["arckit-gates"]["PreToolUse"]
    by_matcher = {e["matcher"]: e["hooks"][0]["command"] for e in gates}
    assert "validate-arc-filename" in by_matcher["write_to_file"]
    assert "validate-arc-filename" not in by_matcher["replace_file_content|multi_replace_file_content"]
    for command in by_matcher.values():
        assert "file-protection" in command and "secret-file-scanner" in command


def run_hook(mode_and_gates, payload):
    res = subprocess.run(["node", "./hooks/agy-hook.mjs", *mode_and_gates.split()], cwd=EXT, input=payload,
                         capture_output=True, text=True, timeout=60)
    assert res.returncode == 0, res.stderr
    return json.loads(res.stdout)


def write_call(workspace, rel, content="# Test"):
    return json.dumps({"toolCall": {"name": "write_to_file", "args": {"TargetFile": str(workspace / rel), "CodeContent": content}},
                       "workspacePaths": [str(workspace)], "conversationId": "c1"})


ALL_GATES = "pre validate-arc-filename file-protection secret-file-scanner"
needs_node = pytest.mark.skipif(shutil.which("node") is None, reason="the hooks need Node.js")


@pytest.fixture
def workspace(tmp_path):
    (tmp_path / "projects" / "001-demo").mkdir(parents=True)
    (tmp_path / ".arckit").mkdir()
    subprocess.run(["git", "init", "-q", str(tmp_path)], check=True)
    return tmp_path


@needs_node
def test_a_well_named_artefact_is_allowed(workspace):
    assert run_hook(ALL_GATES, write_call(workspace, "projects/001-demo/ARC-001-REQ-v1.0.md")) == {"decision": "allow"}


@needs_node
def test_an_unknown_document_type_is_denied_with_the_reason(workspace):
    verdict = run_hook(ALL_GATES, write_call(workspace, "projects/001-demo/ARC-001-ZZZZ-v1.0.md"))
    assert verdict["decision"] == "deny" and "Unknown document type code 'ZZZZ'" in verdict["reason"]


@needs_node
def test_a_document_in_the_wrong_folder_is_denied_and_told_the_right_path(workspace):
    verdict = run_hook(ALL_GATES, write_call(workspace, "projects/001-demo/ARC-001-ADR-001-v1.0.md"))
    assert verdict["decision"] == "deny"
    assert "projects/001-demo/decisions/ARC-001-ADR-001-v1.0.md" in verdict["reason"]


@needs_node
def test_a_credential_in_the_content_is_denied(workspace):
    verdict = run_hook(ALL_GATES, write_call(workspace, "projects/001-demo/ARC-001-REQ-v1.0.md", "key AKIAIOSFODNN7EXAMPLE"))
    assert verdict["decision"] == "deny" and "secrets detected" in verdict["reason"]


@needs_node
def test_an_edit_to_a_protected_file_is_denied_and_names_antigravity(workspace):
    payload = json.dumps({"toolCall": {"name": "replace_file_content", "args": {
        "TargetFile": str(workspace / ".env"), "TargetContent": "a", "ReplacementContent": "b"}}, "workspacePaths": [str(workspace)]})
    verdict = run_hook("pre file-protection secret-file-scanner", payload)
    assert verdict["decision"] == "deny" and "Protected" in verdict["reason"]
    assert "Claude Code" not in verdict["reason"] and "Antigravity" in verdict["reason"]


@needs_node
@pytest.mark.parametrize("payload", ["not json", "{}", json.dumps({"toolCall": {"name": "run_command", "args": {"CommandLine": "ls"}}})])
def test_anything_that_is_not_a_file_write_is_allowed(payload):
    assert run_hook(ALL_GATES, payload) == {"decision": "allow"}


@needs_node
def test_a_check_that_cannot_run_stops_an_artefact_and_nothing_else(workspace):
    """Antigravity ignores a hook that exits non-zero, so the adapter itself reports the failure as a deny."""
    stopped = run_hook("pre no-such-gate", write_call(workspace, "projects/001-demo/ARC-001-REQ-v1.0.md"))
    assert stopped["decision"] == "deny" and "could not run" in stopped["reason"]
    assert run_hook("pre no-such-gate", write_call(workspace, "notes.md")) == {"decision": "allow"}


@needs_node
def test_the_hook_after_a_write_records_the_document_in_the_manifest(workspace):
    doc = workspace / "projects" / "001-demo" / "ARC-001-REQ-v1.0.md"
    doc.write_text("# Requirements\n\n| **Document ID** | ARC-001-REQ-v1.0 |\n", encoding="utf-8")
    manifest = workspace / "docs" / "manifest.json"
    manifest.parent.mkdir()
    manifest.write_text(json.dumps({"projects": []}), encoding="utf-8")
    assert run_hook("post update-manifest", write_call(workspace, "projects/001-demo/ARC-001-REQ-v1.0.md", doc.read_text())) == {}
    assert "ARC-001-REQ-v1.0.md" in manifest.read_text(encoding="utf-8")


@needs_node
def test_a_workspace_and_a_file_spelt_through_different_links_are_the_same_place(workspace, tmp_path_factory):
    """/tmp/x and /private/tmp/x on a Mac, or a repository reached through a link: the gates compare paths as text."""
    link = tmp_path_factory.mktemp("links") / "ws"
    link.symlink_to(workspace, target_is_directory=True)
    bad = "projects/001-demo/ARC-001-ZZZZ-v1.0.md"
    for ws, target in [(link, workspace / bad), (workspace, link / bad)]:
        payload = json.dumps({"toolCall": {"name": "write_to_file", "args": {"TargetFile": str(target), "CodeContent": "# x"}},
                              "workspacePaths": [str(ws)]})
        assert run_hook(ALL_GATES, payload)["decision"] == "deny", (ws, target)


@needs_node
def test_a_relative_target_is_read_against_the_workspace(workspace):
    payload = json.dumps({"toolCall": {"name": "write_to_file", "args": {
        "TargetFile": "projects/001-demo/ARC-001-ZZZZ-v1.0.md", "CodeContent": "# x"}}, "workspacePaths": [str(workspace)]})
    assert run_hook(ALL_GATES, payload)["decision"] == "deny"


@needs_node
def test_a_workspace_that_is_not_there_does_not_switch_the_gates_off(workspace):
    payload = json.dumps({"toolCall": {"name": "write_to_file", "args": {"TargetFile": str(workspace / ".env"), "CodeContent": "A=1"}},
                          "workspacePaths": ["/nonexistent/arckit-test-dir"]})
    verdict = run_hook("pre file-protection secret-file-scanner", payload)
    assert verdict["decision"] == "deny" and "Protected" in verdict["reason"]


@needs_node
def test_the_adapter_answers_when_reached_through_a_linked_folder(workspace, tmp_path_factory):
    """Run by a path that is a link, a plain main-module comparison is false and the script prints nothing."""
    link = tmp_path_factory.mktemp("plugin") / "arckit"
    link.symlink_to(EXT, target_is_directory=True)
    res = subprocess.run(["node", str(link / "hooks" / "agy-hook.mjs"), *ALL_GATES.split()], capture_output=True, text=True,
                         input=write_call(workspace, "projects/001-demo/ARC-001-ZZZZ-v1.0.md"), timeout=60)
    assert res.returncode == 0 and json.loads(res.stdout)["decision"] == "deny"


def test_the_gates_share_a_budget_inside_the_time_antigravity_allows():
    """Stopped by Antigravity's timeout the adapter prints nothing, and a write with no answer goes ahead."""
    adapter = (REPO / "scripts" / "antigravity" / "agy-hook.mjs").read_text(encoding="utf-8")
    budget = {k: int(v) for k, v in re.findall(r"(pre|post): (\d+)", adapter.split("const BUDGET_MS")[1].split(";")[0])}
    hooks = json.loads((EXT / "hooks.json").read_text(encoding="utf-8"))
    for entry in hooks["arckit-gates"]["PreToolUse"]:
        assert budget["pre"] < entry["hooks"][0]["timeout"] * 1000
    assert budget["post"] < hooks["arckit-manifest"]["PostToolUse"][0]["hooks"][0]["timeout"] * 1000


def test_a_subagent_is_not_left_with_a_placeholder_nothing_fills():
    for agent in DELEGATED:
        assert "$ARGUMENTS" not in (EXT / "agents" / f"{agent}.md").read_text(encoding="utf-8"), agent


def test_the_rule_is_triggered_by_artefacts_not_always_on():
    front, body = front_and_body(EXT / "rules" / "arckit-artefacts.md")
    assert front["trigger"] == "glob"
    # Antigravity wants one comma-separated string here, not a list.
    assert isinstance(front["globs"], str) and "**/ARC-*.md" in front["globs"]
    assert "DRAFT" in body and "ARC-{PROJECT_ID}-{TYPE}-v{VERSION}.md" in body
    # A root AGENTS.md would be ignored, and rules/AGENTS.md would load in every session.
    assert not (EXT / "rules" / "AGENTS.md").exists()


def test_the_readme_says_the_new_parts_are_unproven_in_a_live_session():
    readme = (EXT / "README.md").read_text(encoding="utf-8")
    assert "They have not yet been run in a live Antigravity session." in readme
    assert "Twelve subagents." in readme and "`/arckit-evaluate` and `/arckit-score` stay in your conversation." in readme


def test_the_readme_says_how_far_it_has_been_tried():
    readme = (EXT / "README.md").read_text(encoding="utf-8")
    assert "> **Experimental.**" in readme
    assert "The other 186 have not been run there yet." in readme
    assert "arckit init my-project --ai antigravity" in readme
    assert "agy plugin install https://github.com/tractorjuice/arckit-antigravity" in readme


AGY = shutil.which("agy") or os.path.expanduser("~/.gemini/bin/agy")


@pytest.mark.skipif(not os.path.isfile(AGY), reason="Antigravity's agy command is not installed")
def test_antigravitys_own_validator_passes_in_strict_mode():
    """The loader's own check: it reads the plugin as Antigravity will, and fails on anything it would skip."""
    result = subprocess.run([AGY, "plugin", "validate", "--strict", str(EXT)], capture_output=True, text=True, timeout=120)
    assert "Validation passed" in result.stdout + result.stderr, (result.stdout + result.stderr)[-600:]
