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


SOURCE_TEMPLATES = REPO_ROOT / "plugins/arckit-arc42/templates"
# arc42 and Q42 adaptations are CC BY-SA 4.0; the rest are ArcKit's own MIT material.
CC_TEMPLATES = ("arc42", "arc42-quality")
MIT_TEMPLATES = ("arc42-concepts", "arc42-debt", "arc42-handover")
ALL_TEMPLATES = CC_TEMPLATES + MIT_TEMPLATES


@pytest.mark.parametrize("target", TARGETS)
def test_every_arc42_template_and_the_notice_ship_unchanged(target):
    templates = EXTENSIONS / f"arckit-{target}" / "templates"
    for name in [f"{t}-template.md" for t in ALL_TEMPLATES] + ["arc42-LICENSE.md"]:
        assert (templates / name).read_bytes() == (SOURCE_TEMPLATES / name).read_bytes(), (target, name)


@pytest.mark.parametrize("target", TARGETS)
def test_distributed_templates_keep_their_own_licence(target):
    templates = EXTENSIONS / f"arckit-{target}" / "templates"
    for name in CC_TEMPLATES:
        text = (templates / f"{name}-template.md").read_text()
        assert "<!-- SPDX-License-Identifier: CC-BY-SA-4.0 -->" in text, name
        assert "license: CC-BY-SA-4.0" in text.split("---", 2)[1], name
    for name in MIT_TEMPLATES:
        text = (templates / f"{name}-template.md").read_text()
        assert "SPDX-License-Identifier" not in text and "CC BY-SA" not in text, name
    notice = (templates / "arc42-LICENSE.md").read_text()
    assert "## Q42-derived quality material" in notice and "https://quality.arc42.org" in notice


@pytest.mark.parametrize("target", TARGETS)
def test_distributed_templates_preserve_cc_licensing(target):
    distribution = EXTENSIONS / f"arckit-{target}"
    licence = (distribution / "LICENSE").read_text()
    assert "CC BY-SA 4.0, not the MIT grant below" in licence
    assert "Q42-derived quality material" in licence and "https://quality.arc42.org" in licence
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


SPEC_KIT_MAPPING = (
    "| GitHub Copilot, default skills mode | `/speckit-specify` |",
    "| Codex, Command Code and ZCode skills | `$speckit-specify` |",
    "| Kimi skills | `/skill:speckit-specify` |",
    "| Integrations using slash-command notation | `/speckit.specify` |",
    "use the form exposed by your installed integration",
)

NEW_COMMAND_MARKERS = {
    "arc42-quality": (
        "quoted exactly", '"Target needed"', "https://quality.arc42.org",
        "> **Licence**: The dimension names and the classification in this table are adapted from the [Q42 quality model]",
        "Do not copy the template's YAML frontmatter or its `SPDX-License-Identifier` comment",
    ),
    "arc42-concepts": ('"Proposed — not decided"', "Partially decided"),
    "arc42-debt": ("It never invents debt.", "**Merge duplicates**"),
    "arc42-handover": ("[ArcKit FR-012]", "[NEEDS CLARIFICATION: question]", "`speckit.specify`",
                       "`speckit.constitution`", *SPEC_KIT_MAPPING),
}


def converted_prompt(target, name):
    distribution = EXTENSIONS / f"arckit-{target}"
    if target == "paperclip":
        entries = json.loads((distribution / "src/data/commands.json").read_text())
        return next(entry for entry in entries if entry["name"] == f"arckit-{name}")["prompt"]
    path = distribution / COMMAND_PATHS[target].replace("arc42", name, 1)
    if target == "gemini":
        return tomllib.loads(path.read_text())["prompt"]
    return path.read_text()


@pytest.mark.parametrize("target", TARGETS)
@pytest.mark.parametrize("name", sorted(NEW_COMMAND_MARKERS))
def test_converted_overlay_commands_keep_their_safeguards(target, name):
    prompt = converted_prompt(target, name)
    for marker in (
        "Require an Existing Project",
        "`000-global` is never a valid target",
        "This command needs no interview",
        *NEW_COMMAND_MARKERS[name],
    ):
        assert marker in prompt, (target, name, marker)
    assert "AskUserQuestion" not in prompt


@pytest.mark.parametrize("target", TARGETS)
def test_converted_handover_names_spec_kit_steps_runtime_neutrally(target):
    """The converter rewrites /arckit: forms only; Spec Kit's forms must pass through intact."""
    prompt = converted_prompt(target, "arc42-handover")
    for stale in ("Older Spec Kit", "older installations", "Current Spec Kit uses", "hyphenated commands"):
        assert stale not in prompt, (target, stale)
    for step in ("constitution", "specify", "clarify", "plan", "tasks", "implement", "converge"):
        assert f"`speckit.{step}`" in prompt, (target, step)
    mapping = [line for line in prompt.splitlines() if "speckit-specify" in line or "/speckit.specify" in line]
    assert len(mapping) == 4, (target, mapping)


@pytest.mark.parametrize("name", ALL_TEMPLATES)
def test_paperclip_embeds_each_template_verbatim(name):
    entries = json.loads((EXTENSIONS / "arckit-paperclip/src/data/commands.json").read_text())
    entry = next(entry for entry in entries if entry["name"] == f"arckit-{name}")
    assert entry["template"] == (SOURCE_TEMPLATES / f"{name}-template.md").read_text()
    package = json.loads((EXTENSIONS / "arckit-paperclip/package.json").read_text())
    assert "templates/" in package["files"], "the notice and templates ship in the npm package"
