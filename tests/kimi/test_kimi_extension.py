"""Validate the generated Kimi Code CLI extension structure."""

import importlib.util
import json
from pathlib import Path


REPO_ROOT = Path(__file__).resolve().parents[2]
KIMI_ROOT = REPO_ROOT / "extensions" / "arckit-kimi"
KIMI_SKILLS = KIMI_ROOT / "skills"
KIMI_MANIFEST = KIMI_ROOT / "plugin.json"

# Frontmatter keys Kimi Code CLI accepts. Anything else is a hard failure:
# Kimi validates against a closed set, so a leaked Claude-only field breaks
# the skill at load time rather than being ignored.
KIMI_ALLOWED_FRONTMATTER_KEYS = {
    "name",
    "description",
    "license",
    "compatibility",
    "metadata",
    "type",
}


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
