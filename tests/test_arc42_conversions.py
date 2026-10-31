"""The arc42 template and assembly contract must survive every conversion."""

import json
from pathlib import Path
import tomllib

import pytest


REPO_ROOT = Path(__file__).resolve().parents[1]
EXTENSIONS = REPO_ROOT / "extensions"
TARGETS = ("codex", "copilot", "gemini", "opencode", "paperclip", "vibe", "kimi")
COMMAND_PATHS = {
    "codex": "skills/arckit-arc42/SKILL.md",
    "copilot": "prompts/arckit-arc42.prompt.md",
    "gemini": "commands/arckit/arc42.toml",
    "opencode": "commands/arckit.arc42.md",
    "vibe": "skills/arckit-arc42.md",
    "kimi": "skills/arckit-arc42/SKILL.md",
}


@pytest.mark.parametrize("target", TARGETS)
def test_distributed_templates_preserve_cc_licensing(target):
    source = REPO_ROOT / "plugins/arckit-arc42/templates"
    distribution = EXTENSIONS / f"arckit-{target}"
    for name in ("arc42-template.md", "arc42-LICENSE.md"):
        assert (distribution / "templates" / name).read_bytes() == (source / name).read_bytes()
    assert "CC BY-SA 4.0, not the MIT grant below" in (distribution / "LICENSE").read_text()
    json_manifests = {
        "codex": ".codex-plugin/plugin.json",
        "paperclip": "package.json",
        "kimi": "kimi.plugin.json",
    }
    if target in json_manifests:
        metadata = json.loads((distribution / json_manifests[target]).read_text())
        assert metadata["license"] == "MIT AND CC-BY-SA-4.0"
    elif target == "vibe":
        metadata = tomllib.loads((distribution / "vibe-config.toml").read_text())
        assert metadata["extension"]["license"] == "MIT AND CC-BY-SA-4.0"


@pytest.mark.parametrize("target", TARGETS)
def test_converted_assembly_keeps_defaults_and_existing_project_rule(target):
    distribution = EXTENSIONS / f"arckit-{target}"
    if target == "paperclip":
        entries = json.loads((distribution / "src/data/commands.json").read_text())
        entry = next(entry for entry in entries if entry["name"] == "arckit-arc42")
        prompt = entry["prompt"]
        for marker in ("CC-BY-SA-4.0", "https://arc42.org/license/", "Peter Hruschka", "Gernot Starke", "Changes by ArcKit contributors"):
            assert marker in entry["template"]
    elif target == "gemini":
        prompt = tomllib.loads((distribution / COMMAND_PATHS[target]).read_text())["prompt"]
    else:
        prompt = (distribution / COMMAND_PATHS[target]).read_text()
    for marker in (
        "Require an Existing Project",
        "Do not create a project, allocate a project number",
        "No external documents supplied (default; not asked)",
        "Owner: [PENDING] (default; not asked)",
        "references/interview-pattern.md",
        "https://arc42.org/license/",
        "Reproduce diagrams unchanged",
        "Document ID, version",
        "Architecture principles (PRIN) do not count towards this check",
        "`000-global` is never a valid target",
        "Do not copy the template's YAML frontmatter or its `SPDX-License-Identifier` comment",
    ):
        assert marker in prompt
    assert "AskUserQuestion" not in prompt
    assert "prompt user" not in prompt
    assert "ask the user" not in prompt
