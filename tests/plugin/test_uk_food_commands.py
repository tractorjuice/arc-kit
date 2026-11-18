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
    # How the document shows what nobody confirmed: a question prints NOT YET ANSWERED; an own
    # entry that is not confirmed is named and its contents left out.
    shown = "not yet confirmed" if name == "uk-food-own-methods" else "NOT YET ANSWERED"
    assert shown in body
    assert "proposed" in body and "confirmed" in body
    # Ruling 2: this is a deliberate exception to ArcKit's interview pattern.
    assert "exception" in body and "interview pattern" in body
    # Ruling 16: the name comes from the conversation, never from git or the plugin's configuration.
    assert "Never take a name from git, from the plugin's configuration (`organisation_name`" in body
    assert "parse-worksheet" in body


# Each sentence below carries one rule. Deleting the rule from a command deletes its sentence, and
# the test fails.
GATHERING_RULES = {
    "29: no suggested answers": "a suggested answer that the person agrees to is still your answer, not the business's",
    "29: a blanket reply": "counts only for the questions you have just shown, and only where it answers each of them in "
                           "the form that question asks for",
    "30: a missing field is asked for": "If the person has not given a field a state needs, ask for it.",
    "30: until then the state stays": "Until they give it, leave the state where it was",
    "30: put right by asking or stepping back": "either ask the person for what is missing, or step the state back",
    "30: never fill it in": "never fill the field in",
    "31: dates as given": "Record a date only as the person gives it.",
    "31: never work one out": "ask for the exact date; never work one out yourself",
    "23: an unnamed request": "`Source: the request (no name given)`",
    "I4: no projects folder, stop": "do not run `create-project.sh`",
    "18: always DRAFT": "**Status** `DRAFT`, and **Reviewed By** and **Approved By** `[PENDING]`, always.",
    "P6: other documents out of step": "whose `rendered` is true and `inSync` is false",
}


@pytest.mark.parametrize("rule", GATHERING_RULES)
@pytest.mark.parametrize("name", GATHERING)
def test_a_gathering_command_states_the_rule(name, rule):
    _, body = split(command(name))
    assert GATHERING_RULES[rule] in body, f"{name} lacks ruling {rule}"


# The fields the helper requires before it accepts a state, as the commands state them. Each is
# checked against parse-worksheet below, so the commands cannot name fields the helper does not need.
REQUIRED = {
    "question": {
        "confirmed": "a `confirmed` answer needs `Answer`, `By` and `On`",
        "proposed": "a `proposed` answer needs `Answer` and `Source`",
    },
    "method": {
        "not-relevant": "`not-relevant` needs `Reason` and `Decided-by`",
        "adapted": "`adapted` needs `Variation`, `Reason`, `Proved-safe` and `Decided-by`",
    },
    "own": {
        "additional": "`additional` needs `Hazard`, `Control`, `Check` and `If-it-fails`",
        "special-process": "`special-process` needs `Process`, `Supplied-text` and `EH-review`",
        "proposed too": "as much for a `proposed` entry as for a `confirmed` one",
    },
}
STATES_IN = {
    "uk-food-profile": ["question", "method"],
    "uk-food-safe-methods": ["question", "method"],
    "uk-food-own-methods": ["own"],
}


@pytest.mark.parametrize("name", GATHERING)
def test_a_gathering_command_says_what_each_state_needs(name):
    _, body = split(command(name))
    for kind in STATES_IN[name]:
        for state, words in REQUIRED[kind].items():
            assert words in body, f"{name} does not say what {kind} {state} needs"


def worksheet(section: str) -> str:
    return run(HELPER, "worksheet", "--section", section).stdout


def parses(text: str, tmp_path: Path) -> tuple[int, str]:
    path = tmp_path / "answers.md"
    path.write_text(text, encoding="utf-8")
    result = run(HELPER, "parse-worksheet", "--file", path)
    return result.returncode, result.stdout + result.stderr


BLANK_ANSWER = "Answer:\nState: unanswered\nBy:\nOn:\nSource:"
BLANK_METHOD = "Status: applies\nReason:\nDecided-by:\nVariation:\nProved-safe:"
OWN_FIELDS = ["Kind", "Process", "Hazard", "Control", "Limit", "Limit-source", "Check", "If-it-fails",
              "Supplied-text", "EH-review", "State", "By", "On"]


def own_entry(fields: dict) -> str:
    lines = ["## OWN-01 Opened milk", ""] + [f"{f}: {fields[f]}" if fields.get(f) else f"{f}:" for f in OWN_FIELDS]
    return worksheet("own") + "\n" + "\n".join(lines) + "\n"


@pytest.mark.skipif(shutil.which("node") is None, reason="needs node")
def test_the_fields_the_commands_name_are_the_ones_the_helper_requires(tmp_path):
    """Leaving out any one named field is refused, naming it; giving them all is accepted."""
    ck = worksheet("CK")
    answers = {
        "confirmed": {"Answer": "Omelettes", "State": "confirmed", "By": "Sam Okafor", "On": "2026-11-18"},
        "proposed": {"Answer": "Omelettes", "State": "proposed", "Source": "menu.pdf"},
    }
    for state, fields in answers.items():
        for words_field in re.findall(r"`(Answer|By|On|Source)`", REQUIRED["question"][state]):
            given = {k: v for k, v in fields.items() if k != words_field}
            block = "\n".join(f"{f}: {given[f]}" if f in given else f"{f}:" for f in ["Answer", "State", "By", "On", "Source"])
            code, out = parses(ck.replace(BLANK_ANSWER, block, 1), tmp_path)
            assert code == 1 and f"needs {words_field}" in out, (state, words_field, out)
        block = "\n".join(f"{f}: {fields[f]}" if f in fields else f"{f}:" for f in ["Answer", "State", "By", "On", "Source"])
        assert parses(ck.replace(BLANK_ANSWER, block, 1), tmp_path)[0] == 0, state
    for state in ["not-relevant", "adapted"]:
        named = re.findall(r"`(Reason|Decided-by|Variation|Proved-safe)`", REQUIRED["method"][state])
        values = {f: "given" for f in named}
        for missing in named:
            lines = [f"Status: {state}"] + [f"{f}: {values[f]}" if f in values and f != missing else f"{f}:"
                                            for f in ["Reason", "Decided-by", "Variation", "Proved-safe"]]
            code, out = parses(ck.replace(BLANK_METHOD, "\n".join(lines), 1), tmp_path)
            assert code == 1 and f"needs {missing}" in out, (state, missing, out)
        lines = [f"Status: {state}"] + [f"{f}: given" if f in values else f"{f}:" for f in ["Reason", "Decided-by", "Variation", "Proved-safe"]]
        assert parses(ck.replace(BLANK_METHOD, "\n".join(lines), 1), tmp_path)[0] == 0, state
    for kind, extra in [("additional", {}), ("special-process", {"Process": "sous vide"})]:
        named = re.findall(r"`([A-Z][A-Za-z-]+)`", REQUIRED["own"][kind])
        full = {"Kind": kind, **{f: "given" for f in named}, **extra}
        if kind == "special-process":
            full["EH-review"] = "pending"
        for state in [{"State": "proposed"}, {"State": "confirmed", "By": "Sam Okafor", "On": "2026-11-18"}]:
            for missing in named:
                code, out = parses(own_entry({k: v for k, v in {**full, **state}.items() if k != missing}), tmp_path)
                assert code == 1 and f"needs {missing}" in out, (kind, state, missing, out)
            assert parses(own_entry({**full, **state}), tmp_path)[0] == 0, (kind, state)


def test_safe_methods_chooses_a_section_from_the_counts_not_the_wording():
    _, body = split(command("uk-food-safe-methods"))
    assert "has a line in `unfinished`" not in body, "P3: a sign-off-only line would pick a finished section forever"
    for field in ["`missingWorksheets`", "`problems`", "`unanswered`", "`proposed`", "`rendered`", "`inSync`"]:
        assert field in body, field
    assert "/arckit:uk-food-sign-off" in body


def section_needs_work(doc: dict, section: str) -> bool:
    """The rule in uk-food-safe-methods' step "Choose the section", as code."""
    return (f"answers-{section}.md" in doc["missingWorksheets"] or doc["problems"] > 0 or doc["unanswered"] > 0
            or doc["proposed"] > 0 or not doc["rendered"] or not doc["inSync"])


SECTION_CHOICE = ("the first section, in the pack's order, whose document in `documents` has the section's own worksheet "
                  "in `missingWorksheets`, `problems` above 0, `unanswered` or `proposed` above 0, `rendered` false or "
                  "`inSync` false")


def test_the_section_choice_is_the_commands_words():
    _, body = split(command("uk-food-safe-methods"))
    assert SECTION_CHOICE in body


@pytest.mark.parametrize("name", WRITING)
def test_a_writing_command_checks_what_it_wrote(name):
    _, body = split(command(name))
    write = body.find("Write tool")
    assert write >= 0, f"{name} writes with the Write tool"
    check = body.find(f"{HELPER_CALL} check --doc", write)
    assert check > write, f"{name} runs check after its Write"
    assert "<!-- UK-FOOD-BODY -->" in body and "unchanged" in body
    assert f"{HELPER_CALL} render --doc" in body
    assert f"{HELPER_CALL} status --project" in body, f"{name}: reads status before writing (ruling 19)"
    assert "Confirm the header" not in body, "ruling 18: a writing command always writes DRAFT, so no header step"
    assert "`APPROVED`, and Reviewed By" not in body, "ruling 18: only the sign-off command sets APPROVED"
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


# Blocks the three gathering commands share word for word, so one cannot be corrected without the others.
SHARED_BLOCKS = ["Find or create the project", "Find out who is answering", "Record only what the person gives",
                 "Write the document as it stands"]


def block(body: str, title: str) -> str:
    found = re.search(rf"^### \d+\. {re.escape(title)}\n(.*?)(?=^### |\Z)", body, re.M | re.S)
    assert found, f"no step {title!r}"
    return found.group(1)


@pytest.mark.parametrize("title", SHARED_BLOCKS)
def test_the_shared_blocks_are_the_same_in_each_gathering_command(title):
    texts = {name: block(split(command(name))[1], title) for name in GATHERING}
    first = texts[GATHERING[0]]
    assert len(first) > 300, f"{title} is too short to be the block"
    for name, text in texts.items():
        assert text == first, f"{name}'s step {title!r} differs from {GATHERING[0]}'s"


SIGN_OFF_RULES = {
    "32: says the file and version and takes a yes": "take their yes before recording",
    "32: unless the request names the version": "unless the request itself names the version",
    "32: only in the requester's name": "only in the name of the person making the request",
    "32: not for someone else": "has to do it themselves",
}


@pytest.mark.parametrize("rule", SIGN_OFF_RULES)
def test_the_sign_off_command_states_the_rule(rule):
    _, body = split(command("uk-food-sign-off"))
    assert SIGN_OFF_RULES[rule] in body, f"uk-food-sign-off lacks ruling {rule}"


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
    (re.compile(r"\d[\s-]*degrees?\b", re.I), "degrees after a digit"),
    (re.compile(r"\d[\s-]*(?:hours?|hrs?|minutes?|mins?|days?)\b", re.I), "a time after a digit"),
    (re.compile(r"\bBS EN\b"), "a British Standard"),
]


def figures_in(text: str) -> list[str]:
    return [what for pattern, what in FIGURES if pattern.search(text)]


def test_the_figure_scan_catches_the_forms_a_figure_takes():
    for text in ["8°C", "8 °C", "75 degrees", "63-degree", "24 hours", "1 hour", "2hrs", "2 hr", "90 minutes",
                 "10 mins", "3 days", "3-day", "BS EN 1234"]:
        assert figures_in(text), text
    for text in ["version 1.0", "2.1.319", "PR-Q07", "OWN-01", "2026-11-18"]:
        assert not figures_in(text), text


@pytest.mark.parametrize("path", hand_written(), ids=lambda p: str(p.relative_to(ROOT)))
def test_no_hand_written_file_restates_a_figure_or_standard(path):
    """The pack's numbers live only in its data and the generated reference files."""
    text = path.read_text(encoding="utf-8")
    for pattern, what in FIGURES:
        found = pattern.search(text)
        assert not found, f"{path.name} holds {what}: {found.group(0)!r}"


# A word that claims something about a business or a document. Allowed only in a sentence that
# forbids or denies it, as the header status APPROVED (ruling 18), as the field names Approved By
# and Proved-safe, as the pack's own "safe method(s)" (ruling 28) and in the command's name.
CLAIMS = re.compile(r"\b(compliant|compliance|approved|inspected|safe)\b", re.I)
ALLOWED = re.compile(r"\bAPPROVED\b|\bApproved By\b|Proved-safe|\b[Ss]afe [Mm]ethods?\b|uk-food-safe-methods")
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


def build(code: str, project: Path, version: str = "1.0") -> Path:
    """Write `code`'s document into `project` as its command tells the model to.

    The template's text; the DOC-CONTROL-HEADER marker and its comment replaced by the UK partial
    (RENDERING.md, steps 3 and 4) with its placeholders left as they are, so Status DRAFT and both
    names [PENDING]; the render output placed unchanged at the UK-FOOD-BODY line; saved under the
    name generate-document-id.mjs gives.
    """
    rendered = run(HELPER, "render", "--doc", code, "--project", project)
    assert rendered.returncode == 0, rendered.stderr
    body = rendered.stdout[:-1] if rendered.stdout.endswith("\n") else rendered.stdout
    template = (OVERLAY / "templates" / TEMPLATE_OF[code]).read_text(encoding="utf-8")
    header = PARTIAL.read_text(encoding="utf-8").rstrip("\n")
    document = template.replace(f"{MARKER}\n{MARKER_COMMENT}", header).replace(BODY, body)
    assert MARKER not in document and BODY not in document
    named = run(DOC_ID, "001", code, version, "--filename")
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


def sign_and_mark(code: str, project: Path, path: Path) -> None:
    """What uk-food-sign-off does: the helper records the sign-off, then the header is marked outside the markers."""
    signed = run(HELPER, "sign-off", "--doc", code, "--project", project,
                 "--name", "Sam Okafor", "--role", "owner", "--version", "1.0", "--date", "2026-11-21")
    assert signed.returncode == 0, signed.stderr
    text = path.read_text(encoding="utf-8")
    for field, value in [("Status", "APPROVED"), ("Reviewed By", "Sam Okafor, owner, 2026-11-21"),
                         ("Approved By", "Sam Okafor, owner, 2026-11-21")]:
        old = re.search(rf"^\| \*\*{field}\*\* \| .* \|$", text, re.M).group(0)
        text = text.replace(old, f"| **{field}** | {value} |")
    path.write_text(text, encoding="utf-8")


@pytest.mark.skipif(shutil.which("node") is None, reason="needs node")
def test_marking_the_header_after_sign_off_keeps_it_signed_off(project):
    """The sign-off command edits the header outside the markers, after the helper records the sign-off."""
    path = build("FOODCOOK", project)
    sign_and_mark("FOODCOOK", project, path)
    assert check("FOODCOOK", project, path).returncode == 0
    status = json.loads(run(HELPER, "status", "--project", project, "--json").stdout)
    doc = next(d for d in status["documents"] if d["code"] == "FOODCOOK")
    assert doc["signedOff"] and doc["signOff"]["file"] == path.name, doc


# Rulings 18 and 19 (as replaced): what a writing command writes, in the commands' own words and as
# code. The words are pinned to every gathering command; the code is run against the helper.
VERSION_RULE = [
    "`signedOff` is true: the document is signed off and nothing in it has changed since. Write nothing, and "
    "say that it is signed off and up to date.",
    "`signOff` is not null, `signedOff` is false, and `signOff.file` is `file`: the signed file no longer "
    "matches its worksheets. Leave it exactly as it is, and write the next minor version as a new file",
    "Otherwise: rewrite `file` in place, at its version, or write version 1.0 if `file` is null.",
]


def what_to_write(doc: dict) -> tuple[str, str] | None:
    """None to write nothing; otherwise ("new" or "in place", version)."""
    if doc["signedOff"]:
        return None
    if doc["signOff"] is not None and doc["signOff"]["file"] == doc["file"]:
        major, minor = doc["version"].split(".")[:2]
        return "new", f"{major}.{int(minor) + 1}"
    if doc["file"] is None:
        return "new", "1.0"
    return "in place", doc["version"]


@pytest.mark.parametrize("name", GATHERING)
def test_the_version_rule_is_the_commands_words(name):
    _, body = split(command(name))
    for words in VERSION_RULE:
        assert words in body, f"{name} lacks the version rule: {words[:60]}"


def follow_the_rule(code: str, project: Path) -> tuple[str, str] | None:
    doc = next(d for d in json.loads(run(HELPER, "status", "--project", project, "--json").stdout)["documents"]
               if d["code"] == code)
    choice = what_to_write(doc)
    if choice:
        path = build(code, project, choice[1])
        assert check(code, project, path).returncode == 0
    return choice


def files_of(code: str, project: Path) -> dict[str, bytes]:
    return {p.name: p.read_bytes() for p in sorted(project.glob(f"ARC-001-{code}-v*.md"))}


def cooking(project: Path) -> dict:
    status = json.loads(run(HELPER, "status", "--project", project, "--json").stdout)
    return next(d for d in status["documents"] if d["code"] == "FOODCOOK")


def change_an_answer(project: Path) -> None:
    sheet = project / "food-safety" / "answers-CK.md"
    text = sheet.read_text(encoding="utf-8")
    assert "Answer: yes\nState: confirmed" in text
    sheet.write_text(text.replace("Answer: yes\nState: confirmed", "Answer: yes, always\nState: confirmed", 1),
                     encoding="utf-8")


@pytest.mark.skipif(shutil.which("node") is None, reason="needs node")
def test_a_signed_unchanged_document_is_not_written_again(project):
    path = build("FOODCOOK", project)
    sign_and_mark("FOODCOOK", project, path)
    before = files_of("FOODCOOK", project)
    assert follow_the_rule("FOODCOOK", project) is None
    assert files_of("FOODCOOK", project) == before
    assert cooking(project)["signedOff"]


@pytest.mark.skipif(shutil.which("node") is None, reason="needs node")
def test_a_signed_document_whose_answers_changed_gets_a_new_draft_version(project):
    path = build("FOODCOOK", project)
    sign_and_mark("FOODCOOK", project, path)
    signed = path.read_bytes()
    change_an_answer(project)
    assert follow_the_rule("FOODCOOK", project) == ("new", "1.1")
    assert path.read_bytes() == signed, "the signed file is left as it is"
    new = (project / "ARC-001-FOODCOOK-v1.1.md").read_text(encoding="utf-8")
    assert "| **Status** | DRAFT |" in new and "| **Approved By** | [PENDING] |" in new
    doc = cooking(project)
    assert doc["file"] == "ARC-001-FOODCOOK-v1.1.md" and not doc["signedOff"]
    # Written again with no further change, the new version is rewritten in place.
    assert follow_the_rule("FOODCOOK", project) == ("in place", "1.1")
    assert set(files_of("FOODCOOK", project)) == {"ARC-001-FOODCOOK-v1.0.md", "ARC-001-FOODCOOK-v1.1.md"}


@pytest.mark.skipif(shutil.which("node") is None, reason="needs node")
def test_a_document_nobody_signed_is_rewritten_in_place(project):
    build("FOODCOOK", project)
    change_an_answer(project)
    assert follow_the_rule("FOODCOOK", project) == ("in place", "1.0")
    assert set(files_of("FOODCOOK", project)) == {"ARC-001-FOODCOOK-v1.0.md"}
    assert cooking(project)["inSync"]


@pytest.mark.skipif(shutil.which("node") is None, reason="needs node")
def test_a_finished_section_nobody_has_signed_is_not_chosen_again(project):
    """P3: choosing by the counts skips a written, in-step section, though it is not signed off."""
    build("FOODCOOK", project)
    status = json.loads(run(HELPER, "status", "--project", project, "--json").stdout)
    docs = {d["code"]: d for d in status["documents"]}
    assert any(u["code"] == "FOODCOOK" for u in status["unfinished"]), "it still has its not-signed-off line"
    assert not section_needs_work(docs["FOODCOOK"], "CK")
    assert section_needs_work(docs["FOODXC"], "XC")


# --- the generated targets ---------------------------------------------------------

PAPERCLIP_COMMANDS = ROOT / "extensions" / "arckit-paperclip" / "src" / "data" / "commands.json"


@pytest.mark.skipif(not PAPERCLIP_COMMANDS.exists(), reason="run scripts/converter.py first")
@pytest.mark.parametrize("name", WRITING)
def test_paperclip_runs_the_helper_from_its_package_and_create_project_from_the_project(name):
    """Only the declared runtime assets ship in Paperclip's package; create-project.sh is the project's."""
    entries = json.loads(PAPERCLIP_COMMANDS.read_text(encoding="utf-8"))
    prompt = next(e for e in entries if e["name"] == f"arckit-{name}")["prompt"]
    assert 'node "{arckit_package_root}/scripts/uk-food.mjs"' in prompt
    assert 'node "{arckit_package_root}/scripts/generate-document-id.mjs"' in prompt
    assert "{arckit_package_root}/scripts/bash/" not in prompt
    if name in GATHERING:
        assert "bash scripts/bash/create-project.sh --json --force" in prompt


# --- the README and CHANGELOG -----------------------------------------------------


def test_the_readme_lists_each_command_as_claude_code_names_it():
    text = (OVERLAY / "README.md").read_text(encoding="utf-8")
    for name in COMMANDS:
        assert f"/arckit-uk-food:{name}" in text, name
    floor = re.search(r"MIN_CLAUDE_CODE_VERSION = '([\d.]+)'",
                      (ROOT / "plugins/arckit-claude/hooks/version-check.mjs").read_text(encoding="utf-8")).group(1)
    assert f"It needs Claude Code {floor} or later." in text, "P9: core's current floor"


def test_the_readme_says_to_sign_off_once_everything_is_finished():
    """P6: a profile change puts every other document out of step, and any other change puts the profile out of step."""
    text = (OVERLAY / "README.md").read_text(encoding="utf-8")
    assert "sign the profile off last" in text
    assert "puts every other document out of step" in text


def test_the_changelog_names_the_commands():
    text = (OVERLAY / "CHANGELOG.md").read_text(encoding="utf-8")
    assert "arrive in a later change" not in text
    assert "Each asks its questions in conversation" not in text, "P8: not true of check or sign-off"
    for name in COMMANDS:
        assert name in text, name
