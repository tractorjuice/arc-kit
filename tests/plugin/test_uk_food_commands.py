"""The uk-food overlay's commands, templates and checklist.

The overlay exists to stop two things: the Food Standards Agency's wording or
figures being changed on the way into a document, and a document saying
something about a business that nobody at the business said. The helper's
`check` enforces the first. The second rests on what the commands tell the
model, so this file holds the commands to the rules that matter (who may be
named as answering, what stays unanswered, when a document is checked) and
proves, with no model, that a document built the way the commands say passes
`check`.
"""

from __future__ import annotations

import json
import re
import shutil
import subprocess
from pathlib import Path

import pytest
import yaml

ROOT = Path(__file__).resolve().parents[2]
OVERLAY = ROOT / "plugins" / "arckit-uk-food"
HELPER = OVERLAY / "scripts" / "uk-food.mjs"
DOC_ID = OVERLAY / "scripts" / "generate-document-id.mjs"
CLI_TEMPLATES = ROOT / ".arckit" / "templates"
FIXTURE = ROOT / "tests" / "fixtures" / "uk-food" / "project-cafe"
DATA = OVERLAY / "data" / "sfbb-caterers-2026-11-17"

# What each command writes, as its `doc-type:` declares it.
COMMANDS = {
    "uk-food-profile": "FOODPROF",
    "uk-food-safe-methods": ["FOODXC", "FOODCLN", "FOODCHL", "FOODCOOK", "FOODMGT"],
    "uk-food-own-methods": "FOODOWN",
    "uk-food-check": "FOODCMP",
    "uk-food-sign-off": "none",
}
# The commands that gather answers and write a rendered document from them.
GATHERING = ["uk-food-profile", "uk-food-safe-methods", "uk-food-own-methods"]
# The commands that write a rendered document.
WRITING = [*GATHERING, "uk-food-check"]
# Each document code, and the template its command builds it from.
TEMPLATE_OF = {
    "FOODPROF": "uk-food-profile-template.md",
    "FOODXC": "uk-food-safe-methods-template.md",
    "FOODCLN": "uk-food-safe-methods-template.md",
    "FOODCHL": "uk-food-safe-methods-template.md",
    "FOODCOOK": "uk-food-safe-methods-template.md",
    "FOODMGT": "uk-food-safe-methods-template.md",
    "FOODOWN": "uk-food-own-methods-template.md",
    "FOODCMP": "uk-food-check-template.md",
}
TEMPLATES = sorted(set(TEMPLATE_OF.values()))
TEMPLATE_COMMAND = {
    "uk-food-profile-template.md": "uk-food-profile",
    "uk-food-safe-methods-template.md": "uk-food-safe-methods",
    "uk-food-own-methods-template.md": "uk-food-own-methods",
    "uk-food-check-template.md": "uk-food-check",
}
# Ruling 12: the helper, the document namer, the schema and the nine data files. Not differences.md.
RUNTIME_ASSETS = [
    "scripts/uk-food.mjs",
    "scripts/generate-document-id.mjs",
    "schemas/uk-food-sfbb-data-1.0.schema.json",
    *[f"data/sfbb-caterers-2026-11-17/{name}.json"
      for name in ["source", "front", "XC", "CL", "CH", "CK", "MG", "diary", "limits"]],
]
REQUIRED_TOOLS = [
    "Read(/${CLAUDE_PLUGIN_ROOT}/**)",
    "Bash(bash ${CLAUDE_PLUGIN_ROOT}/scripts/bash/create-project.sh *)",
    'Bash(bash "${CLAUDE_PLUGIN_ROOT}/scripts/bash/create-project.sh" *)',
    "Bash(${CLAUDE_PLUGIN_ROOT}/scripts/bash/create-project.sh *)",
    'Bash(node "${CLAUDE_PLUGIN_ROOT}/scripts/uk-food.mjs" *)',
    'Bash(node "${CLAUDE_PLUGIN_ROOT}/scripts/generate-document-id.mjs" *)',
]
# Where each command hands on to, by its bare name as the NHS overlay writes handoffs.
HANDOFFS = {
    "uk-food-profile": {"uk-food-safe-methods"},
    "uk-food-safe-methods": {"uk-food-own-methods", "uk-food-check"},
    "uk-food-own-methods": {"uk-food-check"},
    "uk-food-check": {"uk-food-sign-off"},
    "uk-food-sign-off": {"uk-food-check"},
}
CHECKLIST = OVERLAY / "references" / "uk-food-quality-checklist.md"
CHECKLIST_POINTER = "${CLAUDE_PLUGIN_ROOT}/references/uk-food-quality-checklist.md"
HELPER_CALL = 'node "${CLAUDE_PLUGIN_ROOT}/scripts/uk-food.mjs"'


def split(path: Path) -> tuple[dict, str]:
    """(frontmatter, body) of a command file."""
    text = path.read_text(encoding="utf-8")
    assert text.startswith("---\n"), f"{path.name} has no frontmatter"
    _, header, body = text.split("---\n", 2)
    return yaml.safe_load(header), body


def command(name: str) -> Path:
    return OVERLAY / "commands" / f"{name}.md"


def hand_written() -> list[Path]:
    """The overlay's own prose: commands, templates (both copies), its references, README and CHANGELOG.

    Not the generated references/sfbb-caterers-* files, which hold the pack's words and figures,
    and not the references, partials and scripts synced from core.
    """
    files = sorted((OVERLAY / "commands").glob("*.md"))
    files += sorted((OVERLAY / "templates").glob("uk-food-*.md"))
    files += sorted(CLI_TEMPLATES.glob("uk-food-*.md"))
    files += sorted((OVERLAY / "references").glob("uk-food-*.md"))
    files += [OVERLAY / "README.md", OVERLAY / "CHANGELOG.md"]
    return files


def run(*args: str, cwd: Path | None = None) -> subprocess.CompletedProcess:
    return subprocess.run(["node", *map(str, args)], capture_output=True, text=True, cwd=cwd)


# --- the files ---------------------------------------------------------------


def test_the_overlay_ships_exactly_the_five_commands():
    names = {p.stem for p in (OVERLAY / "commands").glob("*.md")}
    assert names == set(COMMANDS)
    assert not (OVERLAY / "commands" / ".gitkeep").exists(), "the placeholder is not needed once commands exist"


def test_each_template_has_a_byte_identical_cli_copy():
    for name in TEMPLATES:
        plugin = OVERLAY / "templates" / name
        assert plugin.is_file(), name
        assert (CLI_TEMPLATES / name).read_bytes() == plugin.read_bytes(), name


def test_hand_written_files_are_found():
    """Guards the scans below: if this list shrinks, they silently cover less."""
    names = {p.name for p in hand_written()}
    assert {f"{c}.md" for c in COMMANDS} <= names
    assert set(TEMPLATES) <= names
    assert {"uk-food-quality-checklist.md", "README.md", "CHANGELOG.md"} <= names
    assert not any(name.startswith("sfbb-caterers-") for name in names)


# --- frontmatter ---------------------------------------------------------------


@pytest.mark.parametrize("name", COMMANDS)
def test_frontmatter(name):
    front, _ = split(command(name))
    assert front["description"].startswith("[COMMUNITY]"), name
    assert front["doc-type"] == COMMANDS[name], name
    assert isinstance(front["argument-hint"], str) and front["argument-hint"].strip(), name
    assert front["effort"] == "high", name
    assert front["keep-coding-instructions"] is True, name


@pytest.mark.parametrize("name", COMMANDS)
def test_runtime_assets_are_exactly_the_helper_namer_schema_and_data(name):
    front, _ = split(command(name))
    assert front["runtime-assets"] == RUNTIME_ASSETS, name
    for relative in front["runtime-assets"]:
        assert (OVERLAY / relative).is_file(), f"{name}: {relative}"


@pytest.mark.parametrize("name", COMMANDS)
def test_allowed_tools_cover_the_helpers_it_runs(name):
    front, _ = split(command(name))
    missing = [tool for tool in REQUIRED_TOOLS if tool not in front["allowed-tools"]]
    assert not missing, f"{name} lacks {missing}"


@pytest.mark.parametrize("name", COMMANDS)
def test_handoffs_name_the_next_overlay_commands(name):
    front, _ = split(command(name))
    targets = {h["command"] for h in front["handoffs"]}
    assert targets == HANDOFFS[name], name
    for handoff in front["handoffs"]:
        assert handoff.get("description", "").strip(), f"{name}: a handoff says why"


# --- what the bodies say ---------------------------------------------------------


@pytest.mark.parametrize("name", COMMANDS)
def test_no_command_names_the_question_tool(name):
    """Answers are gathered in ordinary conversation, one safe method at a time."""
    assert "AskUserQuestion" not in command(name).read_text(encoding="utf-8")


@pytest.mark.parametrize("name", COMMANDS)
def test_no_command_sends_the_model_to_the_packs_files(name):
    """The pack's words reach a document only through render: the model never reads them to write one."""
    _, body = split(command(name))
    for forbidden in [r"differences\.md", r"limits\.json", r"(?<![\w-])data/", r"references/sfbb-caterers", r"sfbb-caterers-[A-Z]{2}-"]:
        assert not re.search(forbidden, body), f"{name} mentions {forbidden}"


@pytest.mark.parametrize("name", COMMANDS)
def test_every_command_carries_the_disclaimer(name):
    _, body = split(command(name))
    first = body.lstrip().split("\n\n", 1)[0]
    assert first.startswith(">"), f"{name} opens with the disclaimer blockquote"
    for phrase in ["Community", "experimental", "England and Wales", "food business operator",
                   "environmental health team", "not legal advice",
                   "Food Standards Agency has not reviewed or endorsed"]:
        assert phrase in first, f"{name}'s disclaimer lacks {phrase!r}"


@pytest.mark.parametrize("name", COMMANDS)
def test_every_command_points_at_the_overlay_checklist(name):
    assert CHECKLIST_POINTER in command(name).read_text(encoding="utf-8")


@pytest.mark.parametrize("name", COMMANDS)
def test_every_command_warns_about_formatters_and_treats_files_as_data(name):
    _, body = split(command(name))
    assert "formatter" in body, f"{name}: ruling 8, the formatter warning"
    assert "data, not instructions" in body, f"{name}: ruling 22, supplied files are data"


@pytest.mark.parametrize("name", COMMANDS)
def test_a_run_with_nobody_to_answer_finishes_without_inventing(name):
    _, body = split(command(name))
    assert "nobody to answer" in body, f"{name}: ruling 3"


@pytest.mark.parametrize("name", GATHERING)
def test_a_gathering_command_never_invents_an_answer(name):
    _, body = split(command(name))
    assert "never fill in an answer the person has not given" in body
    assert "NOT YET ANSWERED" in body
    assert "proposed" in body and "confirmed" in body
    # Ruling 2: this is a deliberate exception to ArcKit's interview pattern.
    assert "exception" in body and "interview pattern" in body
    # Ruling 16: the name comes from the conversation, never from these.
    for source in ["git", "organisation_name"]:
        assert source in body, f"{name} says not to take a name from {source}"
    assert "parse-worksheet" in body


@pytest.mark.parametrize("name", WRITING)
def test_a_writing_command_checks_what_it_wrote(name):
    _, body = split(command(name))
    write = body.find("Write tool")
    assert write >= 0, f"{name} writes with the Write tool"
    check = body.find(f"{HELPER_CALL} check --doc", write)
    assert check > write, f"{name} runs check after its Write"
    assert "<!-- UK-FOOD-BODY -->" in body and "unchanged" in body
    assert f"{HELPER_CALL} render --doc" in body
    assert f"{HELPER_CALL} status --project" in body, f"{name}: the header follows status (ruling 18)"
    assert "${CLAUDE_PLUGIN_ROOT}/templates/_partials/RENDERING.md" in body
    assert 'node "${CLAUDE_PLUGIN_ROOT}/scripts/generate-document-id.mjs"' in body


@pytest.mark.parametrize("name", WRITING)
def test_a_writing_command_reads_its_own_template_with_overrides(name):
    _, body = split(command(name))
    templates = {t for t, c in TEMPLATE_COMMAND.items() if c == name}
    for template in templates:
        assert f".arckit/templates-custom/{template}" in body
        assert f".arckit/templates/{template}" in body
        assert f"${{CLAUDE_PLUGIN_ROOT}}/templates/{template}" in body


def test_the_check_command_changes_nothing_but_the_completion_record():
    _, body = split(command("uk-food-check"))
    assert "changes no worksheet" in body
    assert "unfinished" in body and "unchanged" in body
    assert "in place" in body, "ruling 19: the completion record is always rewritten in place"


def test_the_safe_methods_command_takes_its_section_by_code_or_name():
    _, body = split(command("uk-food-safe-methods"))
    for code in ["XC", "CL", "CH", "CK", "MG"]:
        assert f"`{code}`" in body
    assert "one safe method at a time" in body
    assert "`>` lines" in body


def test_the_own_methods_command_records_a_special_process_word_for_word():
    _, body = split(command("uk-food-own-methods"))
    assert "word for word" in body
    assert "pending" in body
    assert "never draft" in body
    assert "environmental health team" in body


def test_the_sign_off_command_records_only_through_the_helper():
    _, body = split(command("uk-food-sign-off"))
    sign = body.find(f"{HELPER_CALL} sign-off --doc")
    assert sign >= 0
    assert body.find(f"{HELPER_CALL} status --project", sign) > sign, "the header follows status after sign-off"
    assert "sign-offs.json" in body and "never edit" in body
    assert "--paper-signed yes" in body
    assert "diary" in body
    assert "unchanged" in body, "a refusal is shown as the helper gives it"
    assert "nobody to answer" in body


# --- figures and words in the overlay's own prose ---------------------------------

FIGURES = [
    (re.compile(r"[°º]\s*C"), "a degree sign followed by C"),
    (re.compile(r"\d[\s-]*(?:hours?|minutes?|mins?|days?)\b", re.I), "a time after a digit"),
    (re.compile(r"\bBS EN\b"), "a British Standard"),
]


@pytest.mark.parametrize("path", hand_written(), ids=lambda p: str(p.relative_to(ROOT)))
def test_no_hand_written_file_restates_a_figure_or_standard(path):
    """The pack's numbers live only in its data and the generated reference files."""
    text = path.read_text(encoding="utf-8")
    for pattern, what in FIGURES:
        found = pattern.search(text)
        assert not found, f"{path.name} holds {what}: {found.group(0)!r}"


# A word that claims something about a business or a document. Allowed only in a sentence that
# forbids or denies it, as the header status APPROVED (ruling 18), as the field names Approved By
# and Proved-safe, and as the pack's own "safe method(s)" (ruling 28).
CLAIMS = re.compile(r"\b(compliant|compliance|approved|inspected|safe)\b", re.I)
ALLOWED = re.compile(r"\bAPPROVED\b|\bApproved By\b|Proved-safe|\b[Ss]afe [Mm]ethods?\b")
DENIAL = re.compile(
    r"\b(never|not|no|nothing|nobody|none|neither|nor|without|cannot|forbids?|avoid|refuses?)\b|n't\b", re.I)


def sentences(text: str) -> list[str]:
    parts: list[str] = []
    for line in text.splitlines():
        parts.extend(re.split(r"(?<=[.!?])\s+(?=[A-Z`*\"'(])", line))
    return parts


def claims_in(text: str) -> list[str]:
    found = []
    for sentence in sentences(text):
        if DENIAL.search(sentence):
            continue
        rest = ALLOWED.sub("", sentence)
        if CLAIMS.search(rest):
            found.append(sentence.strip())
    return found


def test_the_claims_scan_catches_a_claim_and_passes_a_denial():
    assert claims_in("Your documents are compliant.")
    assert claims_in("The business is safe.")
    assert claims_in("This document has been approved.")
    assert claims_in("Approved by the council.")
    assert not claims_in("Never call a document compliant, approved, safe or inspected.")
    assert not claims_in("Status APPROVED means signed off by the named person.")
    assert not claims_in("Work through the safe methods one at a time.")
    assert not claims_in("| **Approved By** | [PENDING] |")


@pytest.mark.parametrize("path", hand_written(), ids=lambda p: str(p.relative_to(ROOT)))
def test_no_hand_written_file_claims_the_business_or_a_document_is_approved_or_safe(path):
    found = claims_in(path.read_text(encoding="utf-8"))
    assert not found, f"{path.name}: {found}"


# --- the checklist ---------------------------------------------------------------


def test_the_checklist_lists_checks_that_can_be_looked_at():
    text = CHECKLIST.read_text(encoding="utf-8")
    for needed in ["check --doc", "status --json", "parse-worksheet", "NOT YET ANSWERED", "signedOff",
                   "DRAFT", "[PENDING]", "compliant", "endorsed", "formatter", "word for word"]:
        assert needed in text, f"the checklist lacks {needed!r}"
    # Core's checklist has no section for these codes, so the per-type phrasing would dangle.
    assert not re.search(r"\*\*[A-Z0-9-]+\*\*\s+per-type checks", text)


# --- the templates -----------------------------------------------------------------

MARKER = "<!-- DOC-CONTROL-HEADER -->"
MARKER_COMMENT = "<!-- Resolved at command-execution time per _partials/RENDERING.md. -->"
BODY = "<!-- UK-FOOD-BODY -->"


def pack_titles() -> tuple[set[str], set[str]]:
    sections, methods = set(), set()
    for code in ["XC", "CL", "CH", "CK", "MG"]:
        data = json.loads((DATA / f"{code}.json").read_text(encoding="utf-8"))
        sections.add(data["section"]["title"])
        methods.update(f"{m['id']} {m['title']}" for m in data["methods"])
    return sections, methods


@pytest.mark.parametrize("name", TEMPLATES)
def test_template_shape(name):
    text = (OVERLAY / "templates" / name).read_text(encoding="utf-8")
    lines = text.splitlines()
    assert lines[0].startswith("# "), name
    assert "## Document Control" in lines and "## Revision History" in lines, name
    assert lines[lines.index(MARKER) + 1] == MARKER_COMMENT, name
    assert lines.count(BODY) == 1, name
    assert lines.index("## Revision History") < lines.index(BODY), name
    assert "**Generated by**: ArcKit `/arckit:" + TEMPLATE_COMMAND[name] + "` command" in text, name
    for line in ["**Generated on**", "**ArcKit Version**", "**Project**", "**Model**"]:
        assert line in text, f"{name} footer lacks {line}"


@pytest.mark.parametrize("name", TEMPLATES)
def test_template_holds_nothing_render_prints(name):
    """Ruling 26: the closing notice, the source line and the pack's headings come from render."""
    text = (OVERLAY / "templates" / name).read_text(encoding="utf-8")
    for printed in ["UK-FOOD:BEGIN", "UK-FOOD:END", "Open Government Licence", "not legal advice",
                    "Food Standards Agency", "NOT YET ANSWERED"]:
        assert printed not in text, f"{name} repeats {printed!r}"
    sections, methods = pack_titles()
    for line in text.splitlines():
        heading = re.match(r"^ {0,3}#{1,6}[ \t]+(.*?)[ \t]*#*[ \t]*$", line)
        if heading:
            assert heading.group(1) not in sections, f"{name}: {line}"
            assert not any(heading.group(1).startswith(m) for m in methods), f"{name}: {line}"


# --- a document built as the commands say passes check ---------------------------------

PARTIAL = OVERLAY / "templates" / "_partials" / "document-control-uk.md"


def build(code: str, project: Path) -> Path:
    """Write `code`'s document into `project` as its command tells the model to.

    The template's text; the DOC-CONTROL-HEADER marker and its comment replaced by the UK partial
    (RENDERING.md, steps 3 and 4) with its placeholders left as they are; the render output placed
    unchanged at the UK-FOOD-BODY line; saved under the name generate-document-id.mjs gives.
    """
    rendered = run(HELPER, "render", "--doc", code, "--project", project)
    assert rendered.returncode == 0, rendered.stderr
    body = rendered.stdout[:-1] if rendered.stdout.endswith("\n") else rendered.stdout
    template = (OVERLAY / "templates" / TEMPLATE_OF[code]).read_text(encoding="utf-8")
    header = PARTIAL.read_text(encoding="utf-8").rstrip("\n")
    document = template.replace(f"{MARKER}\n{MARKER_COMMENT}", header).replace(BODY, body)
    assert MARKER not in document and BODY not in document
    named = run(DOC_ID, "001", code, "1.0", "--filename")
    assert named.returncode == 0, named.stderr
    path = project / named.stdout.strip()
    path.write_text(document, encoding="utf-8")
    return path


def check(code: str, project: Path, report: Path) -> subprocess.CompletedProcess:
    return run(HELPER, "check", "--doc", code, "--project", project, "--report", report)


@pytest.fixture
def project(tmp_path):
    copy = tmp_path / "project-cafe"
    shutil.copytree(FIXTURE, copy, ignore=shutil.ignore_patterns("expected"))
    return copy


@pytest.mark.skipif(shutil.which("node") is None, reason="needs node")
@pytest.mark.parametrize("code", TEMPLATE_OF)
def test_a_document_built_from_its_template_passes_check(code, project):
    path = build(code, project)
    result = check(code, project, path)
    assert result.returncode == 0, result.stdout + result.stderr
    if code != "FOODCMP":
        status = json.loads(run(HELPER, "status", "--project", project, "--json").stdout)
        doc = next(d for d in status["documents"] if d["code"] == code)
        assert doc["file"] == path.name and doc["rendered"] and doc["inSync"], doc


@pytest.mark.skipif(shutil.which("node") is None, reason="needs node")
@pytest.mark.parametrize("code", TEMPLATE_OF)
def test_a_body_changed_by_one_character_fails_check(code, project):
    path = build(code, project)
    lines = path.read_text(encoding="utf-8").split("\n")
    begin = next(i for i, line in enumerate(lines) if line.startswith("<!-- UK-FOOD:BEGIN"))
    at = next(i for i in range(begin + 1, len(lines)) if re.search(r"[a-z]", lines[i]))
    letter = re.search(r"[a-z]", lines[at])
    lines[at] = lines[at][:letter.start()] + letter.group(0).upper() + lines[at][letter.end():]
    path.write_text("\n".join(lines), encoding="utf-8")
    result = check(code, project, path)
    assert result.returncode == 1, result.stdout + result.stderr


# --- the README and CHANGELOG -----------------------------------------------------


def test_the_readme_lists_each_command_as_claude_code_names_it():
    text = (OVERLAY / "README.md").read_text(encoding="utf-8")
    for name in COMMANDS:
        assert f"/arckit-uk-food:{name}" in text, name
    assert "It needs Claude Code 2.1.275 or later." in text


def test_the_changelog_names_the_commands():
    text = (OVERLAY / "CHANGELOG.md").read_text(encoding="utf-8")
    assert "arrive in a later change" not in text
    for name in COMMANDS:
        assert name in text, name
