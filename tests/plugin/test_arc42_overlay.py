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
