"""
Structural validation of arckit-claude/commands/*.md source files.

Checks (all commands):
- Valid YAML frontmatter (parseable, required fields present)
- effort value is from the allowed set (if present)
- handoffs structure is valid and references existing command files
- $ARGUMENTS placeholder is present

Checks (new/modified commands on the feat/french-government-commands branch only):
- Body contains required sections (## Success Criteria, ## Example Usage, ## Key References)
- Code fences declare a language (MD040)
- No trailing whitespace (MD009)

Pre-existing commands are exempt from the strict section/lint checks to avoid
requiring a full backport in this PR. Add commands to STRICT_COMMANDS as they
are created or updated to the new standard.
"""

import os
import re
import glob
import yaml
import pytest

REPO_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
COMMANDS_DIR = os.path.join(REPO_ROOT, "arckit-claude", "commands")

VALID_EFFORT_VALUES = {"low", "medium", "high", "max", "xhigh"}
REQUIRED_BODY_SECTIONS = [
    "## Success Criteria",
    "## Example Usage",
    "## Key References",
]
VALID_HANDOFF_COMMANDS = {
    os.path.splitext(os.path.basename(p))[0]
    for p in glob.glob(os.path.join(COMMANDS_DIR, "*.md"))
}

# Commands created or substantially updated on this branch — held to the full standard.
STRICT_COMMANDS = {
    "eu-ai-act.md",
    "eu-cra.md",
    "eu-data-act.md",
    "eu-dora.md",
    "eu-dsa.md",
    "eu-nis2.md",
    "eu-rgpd.md",
    "fr-algorithme-public.md",
    "fr-anssi-carto.md",
    "fr-anssi.md",
    "fr-code-reuse.md",
    "fr-dinum.md",
    "fr-dr.md",
    "fr-ebios.md",
    "fr-marche-public.md",
    "fr-pssi.md",
    "fr-rgpd.md",
    "fr-secnumcloud.md",
}


def get_command_files():
    return sorted(glob.glob(os.path.join(COMMANDS_DIR, "*.md")))


def parse_command(path):
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()
    if not content.startswith("---"):
        return None, content
    parts = content.split("---", 2)
    if len(parts) < 3:
        return None, content
    try:
        frontmatter = yaml.safe_load(parts[1])
    except yaml.YAMLError:
        frontmatter = None
    body = parts[2]
    return frontmatter, body


@pytest.fixture(
    params=get_command_files(),
    ids=lambda p: os.path.basename(p),
)
def command(request):
    path = request.param
    name = os.path.basename(path)
    fm, body = parse_command(path)
    return name, fm, body


# ── Frontmatter ──────────────────────────────────────────────────────────────

def test_has_frontmatter(command):
    name, fm, _ = command
    assert fm is not None, f"{name}: YAML frontmatter missing or unparseable"


def test_description_present_and_nonempty(command):
    name, fm, _ = command
    assert fm is not None, f"{name}: no frontmatter"
    assert "description" in fm, f"{name}: missing 'description' in frontmatter"
    assert str(fm["description"]).strip(), f"{name}: 'description' is empty"


def test_effort_value_valid(command):
    name, fm, _ = command
    if fm is None or "effort" not in fm:
        return
    assert fm["effort"] in VALID_EFFORT_VALUES, (
        f"{name}: invalid effort '{fm['effort']}' — must be one of {VALID_EFFORT_VALUES}"
    )


def test_handoffs_structure(command):
    name, fm, _ = command
    if fm is None or "handoffs" not in fm:
        return
    handoffs = fm["handoffs"]
    assert isinstance(handoffs, list), f"{name}: 'handoffs' must be a list"
    for i, h in enumerate(handoffs):
        assert isinstance(h, dict), f"{name}: handoff #{i} must be a dict"
        assert "command" in h, f"{name}: handoff #{i} missing 'command'"
        assert "description" in h, f"{name}: handoff #{i} missing 'description'"
        assert str(h["description"]).strip(), f"{name}: handoff #{i} 'description' is empty"


def test_handoff_commands_reference_existing_files(command):
    name, fm, _ = command
    if fm is None or "handoffs" not in fm:
        return
    for h in fm["handoffs"]:
        cmd = h.get("command", "")
        assert cmd in VALID_HANDOFF_COMMANDS, (
            f"{name}: handoff references '{cmd}' but no matching command file found in {COMMANDS_DIR}"
        )


# ── Body ─────────────────────────────────────────────────────────────────────

def test_arguments_placeholder_present(command):
    name, _, body = command
    assert "$ARGUMENTS" in body, (
        f"{name}: body must contain $ARGUMENTS placeholder so the command receives user input"
    )


def test_required_sections_present(command):
    name, _, body = command
    if name not in STRICT_COMMANDS:
        pytest.skip("pre-existing command — not yet updated to full standard")
    for section in REQUIRED_BODY_SECTIONS:
        assert section in body, f"{name}: missing required section '{section}'"


def test_no_empty_example_usage(command):
    name, _, body = command
    if "## Example Usage" not in body:
        return
    after = body.split("## Example Usage", 1)[1]
    # There should be at least one code block or non-empty line after the heading
    next_section = re.split(r"\n## ", after)
    content = next_section[0].strip()
    assert content, f"{name}: '## Example Usage' section is empty"


def test_success_criteria_has_checkboxes(command):
    name, _, body = command
    if "## Success Criteria" not in body:
        return
    after = body.split("## Success Criteria", 1)[1]
    next_section = re.split(r"\n## ", after)
    content = next_section[0]
    assert "✅" in content or "- " in content, (
        f"{name}: '## Success Criteria' section appears empty — expected checklist items"
    )


def test_key_references_has_table(command):
    name, _, body = command
    if "## Key References" not in body:
        return
    after = body.split("## Key References", 1)[1]
    next_section = re.split(r"\n## ", after)
    content = next_section[0]
    assert "|" in content, (
        f"{name}: '## Key References' section has no table — expected a markdown table with URLs"
    )


# ── Markdown hygiene ──────────────────────────────────────────────────────────

def test_code_fences_have_language(command):
    """Every fenced code block must declare a language (markdownlint MD040)."""
    name, _, body = command
    if name not in STRICT_COMMANDS:
        pytest.skip("pre-existing command — not yet updated to full standard")
    # Track fence depth so we only check opening fences (depth 0 → 1 transitions).
    inside = False
    unlabelled_opens = []
    for line in body.splitlines():
        m = re.match(r"^```(\S*)$", line)
        if m:
            if not inside:
                # Opening fence — must have a language specifier
                if not m.group(1):
                    unlabelled_opens.append(line)
                inside = True
            else:
                inside = False
    assert not unlabelled_opens, (
        f"{name}: {len(unlabelled_opens)} opening code fence(s) without a language specifier "
        f"— required by MD040"
    )


def test_no_trailing_spaces(command):
    """Lines must not end with trailing whitespace (markdownlint MD009)."""
    name, _, body = command
    if name not in STRICT_COMMANDS:
        pytest.skip("pre-existing command — not yet updated to full standard")
    offenders = [
        i + 1
        for i, line in enumerate(body.splitlines())
        if line != line.rstrip()
    ]
    assert not offenders, (
        f"{name}: trailing whitespace on lines {offenders[:10]}"
    )
