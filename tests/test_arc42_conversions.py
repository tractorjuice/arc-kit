"""The arc42 template and assembly contract must survive every conversion."""

import importlib.util
import json
from pathlib import Path
import re
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


# --- Target-specific paths and command syntax ----------------------------

PAPERCLIP = EXTENSIONS / "arckit-paperclip"
PACKAGE_ROOT_TOKEN = "{arckit_package_root}"


def paperclip_prompt(name):
    entries = json.loads((PAPERCLIP / "src/data/commands.json").read_text())
    return next(entry for entry in entries if entry["name"] == f"arckit-{name}")["prompt"]


def package_asset_paths(prompt):
    """Every package-root path a prompt references, without trailing punctuation."""
    paths = re.findall(re.escape(PACKAGE_ROOT_TOKEN) + r"/([^\s`'\")\]]+)", prompt)
    return sorted({path.rstrip(".,;:") for path in paths})


def test_paperclip_arc42_assets_resolve_in_the_package():
    """Paperclip replaces {arckit_package_root} with its installed package root."""
    shipped = {entry.rstrip("/") for entry in json.loads((PAPERCLIP / "package.json").read_text())["files"]}
    paths = package_asset_paths(paperclip_prompt("arc42"))
    assert paths, "the arc42 prompt reads its template and references from the package"
    for path in paths:
        assert (PAPERCLIP / path).is_file(), path
        assert path.split("/", 1)[0] in shipped, f"{path} is outside package.json files"


def test_paperclip_arc42_uses_package_root_not_scripts_bash():
    prompt = paperclip_prompt("arc42")
    for wrong in ("scripts/bash/references/", "scripts/bash/templates/"):
        assert wrong not in prompt, wrong
    paths = package_asset_paths(prompt)
    for expected in ("references/citation-instructions.md", "references/interview-pattern.md",
                     "references/quality-checklist.md", "references/version-detection.md",
                     "templates/arc42-template.md", "templates/_partials/RENDERING.md"):
        assert expected in paths, expected


def test_paperclip_assets_never_resolve_under_scripts_bash():
    """No Paperclip command points a template, reference or schema into scripts/bash."""
    entries = json.loads((PAPERCLIP / "src/data/commands.json").read_text())
    for entry in entries:
        found = re.findall(r"scripts/bash/(?:references|templates|schemas|data)/", entry["prompt"])
        assert not found, (entry["name"], found)


def test_paperclip_scripts_keep_their_mapping():
    """Plain commands keep project-relative scripts; runtime-asset commands use the package."""
    for name, script in (("agile-governance", "scripts/generate-document-id.mjs"),
                         ("at-barrierefreiheit", "scripts/bash/create-project.sh")):
        prompt = paperclip_prompt(name)
        assert script in prompt, (name, script)
        assert PACKAGE_ROOT_TOKEN + "/scripts/" not in prompt, name
    runtime = paperclip_prompt("uk-legacy-assessment")
    assert PACKAGE_ROOT_TOKEN + "/scripts/legacy-assessment.mjs" in runtime
    for path in package_asset_paths(runtime):
        assert (PAPERCLIP / path).exists(), path


VIBE_ARC42 = EXTENSIONS / "arckit-vibe/skills/arckit-arc42.md"


def test_vibe_arc42_skill_uses_vibe_command_names():
    skill = VIBE_ARC42.read_text()
    for command in ("/arckit-stakeholders", "/arckit-requirements", "/arckit-diagram",
                    "/arckit-arc42", "/arckit-adr"):
        assert command in skill, command
    assert "/arckit:" not in skill


def test_no_vibe_skill_keeps_claude_command_syntax():
    skills = EXTENSIONS / "arckit-vibe/skills"
    offenders = [str(path.relative_to(skills)) for path in skills.rglob("*.md") if "/arckit:" in path.read_text()]
    assert not offenders, offenders


def converted_prompt(target, name):
    """The generated arc42-family command body for one converted target."""
    path = EXTENSIONS / f"arckit-{target}" / COMMAND_PATHS[target].replace("arc42", name, 1)
    if target == "gemini":
        return tomllib.loads(path.read_text())["prompt"]
    return path.read_text()


def _load_converter():
    spec = importlib.util.spec_from_file_location("arckit_converter", REPO_ROOT / "scripts" / "converter.py")
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


@pytest.mark.parametrize("source, expected", [
    ("run `/arckit:stakeholders`.", "run `/arckit-stakeholders`."),
    ("then /arckit:arc42.", "then /arckit-arc42."),
    ("(/arckit:diagram), /arckit:risk;", "(/arckit-diagram), /arckit-risk;"),
    ("/arckit:wardley.climate", "/arckit-wardley-climate"),
    ("/arckit:community.security-assessment", "/arckit-community-security-assessment"),
    ("/arckit:community.{name} <project>", "/arckit-community-{name} <project>"),
    ("/arckit:uk-legacy-assessment", "/arckit-uk-legacy-assessment"),
    ("`/arckit:[command]`", "`/arckit-[command]`"),
    ("/arckit:{command}", "/arckit-{command}"),
    ("all /arckit:* commands", "all /arckit-* commands"),
    ("https://example.org/arckit:x", "https://example.org/arckit:x"),
])
def test_vibe_rewrite_keeps_punctuation_dots_and_placeholders(source, expected):
    assert _load_converter().rewrite_vibe_command_invocations(source) == expected


@pytest.mark.parametrize("target, form", [
    ("codex", "$arckit-stakeholders"),
    ("copilot", "/arckit-stakeholders"),
    ("gemini", "/arckit:stakeholders"),
    ("opencode", "/arckit:stakeholders"),
    ("paperclip", "/arckit:stakeholders"),
    ("kimi", "/skill:arckit-stakeholders"),
])
def test_other_targets_keep_their_command_syntax(target, form):
    """The Vibe rewrite is Vibe-only; every other target keeps its own form."""
    prompt = converted_prompt(target, "arc42") if target != "paperclip" else paperclip_prompt("arc42")
    assert form in prompt, (target, form)
    if target in ("codex", "kimi", "copilot"):
        assert "/arckit:" not in prompt.replace("/arckit:arc42", ""), target
