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
    assert manifest["repository"] == "https://github.com/tractorjuice/arc-kit"


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


def test_the_readme_says_how_far_it_has_been_tried():
    readme = (EXT / "README.md").read_text(encoding="utf-8")
    assert "> **Experimental.**" in readme
    assert "The other 189 have not been run there yet." in readme
    assert "arckit init my-project --ai antigravity" in readme
    assert "agy plugin install ./extensions/arckit-antigravity" in readme


AGY = shutil.which("agy") or os.path.expanduser("~/.gemini/bin/agy")


@pytest.mark.skipif(not os.path.isfile(AGY), reason="Antigravity's agy command is not installed")
def test_antigravitys_own_validator_passes_in_strict_mode():
    """The loader's own check: it reads the plugin as Antigravity will, and fails on anything it would skip."""
    result = subprocess.run([AGY, "plugin", "validate", "--strict", str(EXT)], capture_output=True, text=True, timeout=120)
    assert "Validation passed" in result.stdout + result.stderr, (result.stdout + result.stderr)[-600:]
