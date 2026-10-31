"""arc42 assembly preserves template licensing and never interviews for optional input."""

from pathlib import Path
import re


REPO_ROOT = Path(__file__).resolve().parents[2]
OVERLAY = REPO_ROOT / "plugins/arckit-arc42"


def test_template_copies_keep_the_cc_licence_and_changes_notice():
    original = (OVERLAY / "templates/arc42-template.md").read_text()
    markers = (
        "SPDX-License-Identifier: CC-BY-SA-4.0",
        "https://arc42.org/license/",
        "Peter Hruschka and Gernot Starke",
        "Changes by ArcKit contributors",
        "Project-specific content and cited artefacts retain their own licences",
    )
    for marker in markers:
        assert marker in original
    for templates in (
        REPO_ROOT / ".arckit/templates",
        REPO_ROOT / "plugins/arckit-claude/plugins/arc42/templates",
    ):
        copied = (templates / "arc42-template.md").read_text()
        for marker in markers:
            assert marker in copied
        assert re.findall(r"^## (\d+)\.", copied, re.M) == [str(i) for i in range(1, 13)]
        assert (templates / "arc42-LICENSE.md").read_bytes() == (
            OVERLAY / "templates/arc42-LICENSE.md"
        ).read_bytes()
    assert re.findall(r"^## (\d+)\.", original, re.M) == [str(i) for i in range(1, 13)]


def test_assembly_requires_existing_sources_without_optional_interviews():
    command = (OVERLAY / "commands/arc42.md").read_text()
    assert "Require an Existing Project" in command
    assert "Do not create a project, allocate a project number" in command
    assert "STOP without writing files" in command
    assert "references/interview-pattern.md" in command
    assert "No external documents supplied (default; not asked)" in command
    assert "Owner: [PENDING] (default; not asked)" in command
    assert "Assumptions" in command
    assert "AskUserQuestion" not in command
    assert "prompt user" not in command
    assert "ask the user" not in command
    assert "Slugify" not in command
    assert "highest `NNN-*`" not in command
    assert "Reproduce diagrams unchanged" in command
    assert "Document ID, version" in command


def test_assembly_needs_a_project_level_source_and_never_targets_global():
    """Global principles exist in almost every repo, so they cannot satisfy the stop check."""
    command = (OVERLAY / "commands/arc42.md").read_text()
    assert "none** of REQ, STKE, HLDR, DIAG or ADR" in command
    assert "Architecture principles (PRIN) do not count towards this check" in command
    assert "`000-global` is never a valid target" in command
    assert "explicitly active project" not in command


def test_generated_documents_do_not_inherit_template_licence_metadata():
    """The SPDX tag and frontmatter label the template file; the description's content is not CC BY-SA."""
    command = (OVERLAY / "commands/arc42.md").read_text()
    assert (
        "Do not copy the template's YAML frontmatter or its `SPDX-License-Identifier` comment"
        in command
    )
    checklist = (OVERLAY / "references/quality-checklist.md").read_text()
    arc42_checks = checklist.split("### ARC42", 1)[1].split("\n### ", 1)[0]
    assert "`SPDX-License-Identifier` comment not copied" in arc42_checks


def test_long_assembly_keeps_its_instructions_across_compaction():
    frontmatter = (OVERLAY / "commands/arc42.md").read_text().split("---", 2)[1]
    assert re.search(r"^keep-coding-instructions: true$", frontmatter, re.M)


def test_release_notices_preserve_the_template_exception():
    for relative in ("LICENSE", "plugins/arckit-claude/LICENSE", "scripts/push-extensions.sh"):
        text = (REPO_ROOT / relative).read_text()
        assert "CC BY-SA 4.0, not the MIT grant below" in text
        assert "https://arc42.org/license/" in text


def test_documentation_index_includes_arc42_overlay():
    text = (REPO_ROOT / "docs/README.md").read_text()
    section = text.split("### arc42 Overlay", 1)[1].split("###", 1)[0]
    assert "guides/arc42.md" in section


NEW_COMMANDS = {
    "arc42-quality": "QUAL",
    "arc42-concepts": "CONC",
    "arc42-debt": "DEBT",
    "arc42-handover": "SDDH",
}


def _frontmatter(text):
    return text.split("---", 2)[1]


def test_source_commands_share_the_assembly_safeguards():
    """Every overlay command resolves an existing project and never interviews or targets 000-global."""
    for name, doc_type in NEW_COMMANDS.items():
        command = (OVERLAY / f"commands/{name}.md").read_text()
        frontmatter = _frontmatter(command)
        assert f"doc-type: {doc_type}" in frontmatter, name
        assert re.search(r"^keep-coding-instructions: true$", frontmatter, re.M), name
        assert "### 1. Require an Existing Project" in command, name
        assert "`000-global` is never a valid target" in command, name
        assert "Do not create a project, allocate a project number" in command, name
        assert "references/interview-pattern.md" in command, name
        assert "This command needs no interview" in command, name
        assert "AskUserQuestion" not in command, name
        assert f"ARC-{{PROJECT_ID}}-{doc_type}-v{{VERSION}}" in command, name
        assert "references/version-detection.md" in command, name
        assert f"templates/{name}-template.md" in command, name
        assert "/arckit-" not in command.replace("/arckit-arc42", ""), (
            f"{name}: cite overlay commands in canonical /arckit:X form so the converter can rewrite them"
        )


def test_quality_scenarios_quote_targets_and_never_estimate():
    command = (OVERLAY / "commands/arc42-quality.md").read_text()
    assert "**The response measure is the source's own target, quoted exactly**" in command
    assert "Never tighten, loosen or round it." in command
    assert '"Target needed"' in command
    for dimension in ("#reliable", "#efficient", "#flexible", "#maintainable", "#usable",
                      "#operable", "#secure", "#safe", "#suitable"):
        assert f"`{dimension}`" in command, dimension
    template = (OVERLAY / "templates/arc42-quality-template.md").read_text()
    assert "https://quality.arc42.org" in template and "Gernot Starke" in template


def test_concepts_route_open_decisions_to_adrs():
    command = (OVERLAY / "commands/arc42-concepts.md").read_text()
    assert 'Label the list "Proposed — not decided"' in command
    assert "Do not raise a concept to Decided on the strength of a proposal" in command
    for status in ("Decided", "Partially decided", "Open", "Not applicable", "Not assessed"):
        assert f"**{status}**" in command, status


def test_debt_register_consolidates_without_estimating():
    command = (OVERLAY / "commands/arc42-debt.md").read_text()
    assert "It never invents debt." in command
    assert "never estimate effort" in command
    assert "**Merge duplicates**" in command
    for source in ("CDAU", "CONF", "DLDR", "HLDR", "ADR", "RISK"):
        assert f"**{source}**" in command, source


def test_handover_carries_arckit_ids_beside_spec_kit_ids():
    command = (OVERLAY / "commands/arc42-handover.md").read_text()
    assert "`[ArcKit FR-012]`" in command
    assert "Spec Kit numbers each feature's requirements (`FR-001`)" in command
    assert "`[NEEDS CLARIFICATION: question]`" in command
    for spec_kit in ("/speckit-constitution", "/speckit-specify", "/speckit-plan", "/speckit-converge"):
        assert spec_kit in command, spec_kit
    for evidence in ("/arckit:traceability", "/arckit:conformance", "/arckit:repo-audit"):
        assert evidence in command, evidence
    assert "**Freshness check**" in command


def test_new_templates_are_mit_and_mirrored_without_licence_metadata():
    for name in NEW_COMMANDS:
        source = OVERLAY / f"templates/{name}-template.md"
        text = source.read_text()
        assert not text.startswith("---"), f"{name}: no frontmatter to leak into generated documents"
        assert "SPDX-License-Identifier" not in text, name
        assert "<!-- DOC-CONTROL-HEADER -->" in text, name
        assert "## Source Artefacts" in text, name
        cli_copy = REPO_ROOT / ".arckit/templates" / f"{name}-template.md"
        assert cli_copy.read_bytes() == source.read_bytes(), name
        # The Claude mirror namespaces overlay commands (/arckit-arc42:arc42-quality);
        # otherwise it must match the source.
        mirror = REPO_ROOT / "plugins/arckit-claude/plugins/arc42/templates" / f"{name}-template.md"
        assert re.sub(r"/arckit-[a-z0-9-]+:", "/arckit:", mirror.read_text()) == text, name


def test_assembly_prefers_the_dedicated_source_documents():
    command = (OVERLAY / "commands/arc42.md").read_text()
    for doc_type in ("QUAL", "CONC", "DEBT", "CONF"):
        assert f"| **{doc_type}** |" in command, doc_type
    for handoff in NEW_COMMANDS:
        assert f"command: {handoff}" in _frontmatter(command), handoff
    assert "Technical debt comes from DEBT when it exists" in command


def test_doc_types_are_registered_for_every_overlay_command():
    registry = (REPO_ROOT / "plugins/arckit-claude/config/doc-types.mjs").read_text()
    gemini = (REPO_ROOT / "extensions/arckit-gemini/hooks/scripts/hook_utils.py").read_text()
    pages = (REPO_ROOT / "plugins/arckit-claude/commands/pages.md").read_text()
    for doc_type in NEW_COMMANDS.values():
        assert f"'{doc_type}':" in registry, doc_type
        assert f'"{doc_type}":' in gemini, doc_type
        assert f"| | {doc_type} | `ARC-*-{doc_type}-*.md` |" in pages, doc_type
