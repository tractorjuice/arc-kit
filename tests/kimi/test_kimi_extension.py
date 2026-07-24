"""Validate the generated Kimi Code CLI extension structure."""

import importlib.util
import json
from pathlib import Path


REPO_ROOT = Path(__file__).resolve().parents[2]
KIMI_ROOT = REPO_ROOT / "extensions" / "arckit-kimi"
KIMI_SKILLS = KIMI_ROOT / "skills"
KIMI_MANIFEST = KIMI_ROOT / "kimi.plugin.json"

# Frontmatter keys Kimi Code CLI documents for skills. Anything else is a
# hard failure: if Kimi validates against a closed set, a leaked Claude-only
# or legacy field breaks the skill at load time rather than being ignored.
KIMI_ALLOWED_FRONTMATTER_KEYS = {
    "name",
    "description",
    "type",
    "whenToUse",
    "disableModelInvocation",
    "arguments",
}

# build.md is deliberately excluded from every non-Claude conversion target
# (scripts/converter.py's `claude_only_commands`): its entire body is "invoke
# the arckit-build skill via the Skill tool", and that skill is itself
# Claude-only (parallel Agent dispatch) and correctly excluded from Kimi's
# copied skills — see test_arckit_build_skill_is_excluded. Mirrors
# tests/codex/test_codex_extension.py's CLAUDE_ONLY_COMMANDS.
CLAUDE_ONLY_COMMANDS = {"build.md"}


def _load_converter():
    """Import scripts/converter.py as a module without executing main()."""
    spec = importlib.util.spec_from_file_location(
        "arckit_converter", REPO_ROOT / "scripts" / "converter.py"
    )
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


def test_kimi_skill_name_prefixes_and_flattens():
    converter = _load_converter()
    assert converter.kimi_skill_name("requirements") == "arckit-requirements"
    assert converter.kimi_skill_name("wardley.climate") == "arckit-wardley-climate"


def test_kimi_skill_invocation_uses_skill_prefix():
    converter = _load_converter()
    assert converter.kimi_skill_invocation("requirements") == "/skill:arckit-requirements"
    assert (
        converter.kimi_skill_invocation("wardley.climate")
        == "/skill:arckit-wardley-climate"
    )


def test_generate_kimi_plugin_json_maps_mcp_and_session_start(tmp_path):
    converter = _load_converter()

    mcp_src = tmp_path / ".mcp.json"
    mcp_src.write_text(
        json.dumps(
            {
                "mcpServers": {
                    "aws-knowledge": {
                        "type": "http",
                        "url": "https://knowledge-mcp.global.api.aws",
                    },
                    "datacommons-mcp": {
                        "command": "uvx",
                        "args": ["datacommons-mcp@latest"],
                        "env": {"DC_API_KEY": "${user_config.DATA_COMMONS_API_KEY}"},
                    },
                }
            }
        ),
        encoding="utf-8",
    )
    out = tmp_path / "plugin.json"

    converter.generate_kimi_plugin_json(str(mcp_src), "6.3.0", str(out))

    manifest = json.loads(out.read_text(encoding="utf-8"))
    assert manifest["name"] == "arckit"
    assert manifest["version"] == "6.3.0"
    assert manifest["skills"] == "./skills/"
    assert manifest["sessionStart"] == {"skill": "architecture-workflow"}
    assert manifest["interface"]["displayName"] == "ArcKit"

    servers = manifest["mcpServers"]
    # Remote servers keep url and drop Claude's `type` discriminator.
    assert servers["aws-knowledge"] == {"url": "https://knowledge-mcp.global.api.aws"}
    # Stdio servers keep command/args/env, with user_config rewritten to env vars.
    assert servers["datacommons-mcp"]["command"] == "uvx"
    assert servers["datacommons-mcp"]["env"]["DC_API_KEY"] == "${DATA_COMMONS_API_KEY}"
    assert "type" not in servers["datacommons-mcp"]


def test_generate_kimi_plugin_json_is_strict_json(tmp_path):
    """No comments or trailing commas: Kimi parses this as strict JSON."""
    converter = _load_converter()
    mcp_src = tmp_path / ".mcp.json"
    mcp_src.write_text(json.dumps({"mcpServers": {}}), encoding="utf-8")
    out = tmp_path / "plugin.json"

    converter.generate_kimi_plugin_json(str(mcp_src), "6.3.0", str(out))

    raw = out.read_text(encoding="utf-8")
    assert "//" not in raw
    json.loads(raw)  # raises if malformed


def _plugin_command_dirs():
    """Derive command dirs from the converter's own PLUGIN_SOURCES.

    Hardcoding this list lets it drift from what the converter actually
    converts; three plugin dirs on disk are deliberately excluded from
    PLUGIN_SOURCES, so the two are not interchangeable.
    """
    converter = _load_converter()
    return [REPO_ROOT / src / "commands" for src in converter.PLUGIN_SOURCES]


def _parse_frontmatter_keys(text):
    """Return top-level YAML frontmatter keys from a SKILL.md body."""
    if not text.startswith("---\n"):
        return set()
    end = text.index("\n---\n", 3)
    block = text[4:end]
    keys = set()
    for line in block.splitlines():
        if line and not line.startswith((" ", "\t", "-")) and ":" in line:
            keys.add(line.split(":", 1)[0].strip())
    return keys


def test_manifest_exists_and_has_required_fields():
    manifest = json.loads(KIMI_MANIFEST.read_text(encoding="utf-8"))
    for field in ("name", "version", "skills", "sessionStart", "mcpServers", "interface"):
        assert field in manifest, f"plugin.json missing required field: {field}"


def test_session_start_skill_actually_exists():
    """A sessionStart pointing at a missing skill breaks every session."""
    manifest = json.loads(KIMI_MANIFEST.read_text(encoding="utf-8"))
    skill = manifest["sessionStart"]["skill"]
    assert (KIMI_SKILLS / skill / "SKILL.md").is_file(), (
        f"sessionStart names '{skill}' but skills/{skill}/SKILL.md does not exist"
    )


def test_every_command_produces_a_skill():
    expected = set()
    for cmd_dir in _plugin_command_dirs():
        if not cmd_dir.is_dir():
            continue
        for path in cmd_dir.glob("*.md"):
            if path.name in CLAUDE_ONLY_COMMANDS:
                continue
            expected.add(f"arckit-{path.stem.replace('.', '-')}")

    actual = {p.name for p in KIMI_SKILLS.iterdir() if p.is_dir()}
    missing = expected - actual
    assert not missing, f"commands with no generated Kimi skill: {sorted(missing)}"


def test_all_frontmatter_keys_are_kimi_legal():
    offenders = {}
    for skill_md in KIMI_SKILLS.rglob("SKILL.md"):
        keys = _parse_frontmatter_keys(skill_md.read_text(encoding="utf-8"))
        illegal = keys - KIMI_ALLOWED_FRONTMATTER_KEYS
        if illegal:
            offenders[str(skill_md.relative_to(KIMI_ROOT))] = sorted(illegal)
    assert not offenders, f"illegal Kimi frontmatter keys: {offenders}"


def test_no_claude_plugin_root_leaks():
    offenders = [
        str(p.relative_to(KIMI_ROOT))
        for p in KIMI_SKILLS.rglob("*.md")
        if "${CLAUDE_PLUGIN_ROOT}" in p.read_text(encoding="utf-8")
    ]
    assert not offenders, f"${{CLAUDE_PLUGIN_ROOT}} leaked into: {offenders}"


def test_no_claude_slash_command_leaks():
    """A surviving /arckit: tells the user to run a command Kimi does not have."""
    offenders = []
    for p in KIMI_SKILLS.rglob("*.md"):
        text = p.read_text(encoding="utf-8")
        if "/arckit:" in text or "/arckit." in text:
            offenders.append(str(p.relative_to(KIMI_ROOT)))
    assert not offenders, f"unrewritten Claude command invocations in: {offenders}"


def test_all_mcp_servers_mapped_without_user_config():
    source = json.loads(
        (REPO_ROOT / "plugins" / "arckit-claude" / ".mcp.json").read_text(encoding="utf-8")
    )
    manifest = json.loads(KIMI_MANIFEST.read_text(encoding="utf-8"))
    assert set(manifest["mcpServers"]) == set(source["mcpServers"])
    assert "${user_config." not in KIMI_MANIFEST.read_text(encoding="utf-8")


def test_arckit_build_skill_is_excluded():
    """arckit-build orchestrates parallel Agent dispatch and is Claude-only."""
    assert not (KIMI_SKILLS / "arckit-build").exists()
