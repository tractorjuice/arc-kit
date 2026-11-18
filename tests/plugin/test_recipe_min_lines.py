"""A recipe target may set `min_lines`, the fewest lines its document may have.

arckit-build's worker check and its validation of each wave used to want more than 100 lines from
every document, and a recipe could not change that. Some documents are short by nature: the food
overlay's own methods document is about 50 lines when the business has no entries, and its
completion record about 97 when nothing is outstanding. scripts/check_recipes.py is the only code
that validates a recipe, and the build skill is the specification the harness follows, so both are
held to the same rule here.
"""

import subprocess
import sys
import textwrap
from pathlib import Path

import pytest

REPO_ROOT = Path(__file__).resolve().parents[2]
CHECK = REPO_ROOT / "scripts/check_recipes.py"
HARNESS = REPO_ROOT / "plugins/arckit-claude/skills/arckit-build/SKILL.md"
PROBE = REPO_ROOT / "plugins/arckit-claude/skills/arckit-build/recipes/zz-min-lines-probe.yaml"

RECIPE = """\
recipe: zz-min-lines-probe
schema_version: 1
defaults: {{ version: "1.0" }}
targets:
  - id: PRIN
    skill: arckit:principles
    output: {{ project: "000-global", type: PRIN }}
    deps: []
{min_lines}"""


def _run(min_lines: str) -> subprocess.CompletedProcess:
    PROBE.write_text(textwrap.dedent(RECIPE.format(min_lines=min_lines)))
    try:
        return subprocess.run([sys.executable, str(CHECK)], capture_output=True, text=True, cwd=REPO_ROOT)
    finally:
        PROBE.unlink(missing_ok=True)


@pytest.mark.parametrize("value", ["1", "40", "250"])
def test_a_whole_number_of_one_or_more_passes(value):
    result = _run(f"    min_lines: {value}\n")
    assert result.returncode == 0, result.stdout + result.stderr


def test_a_target_without_it_passes():
    result = _run("")
    assert result.returncode == 0, result.stdout + result.stderr


@pytest.mark.parametrize("value", ["0", "-5", "2.5", "40.0", '"40"', "true", "null", "[40]"])
def test_anything_else_fails(value):
    result = _run(f"    min_lines: {value}\n")
    assert result.returncode == 1, result.stdout + result.stderr
    assert "zz-min-lines-probe.yaml: target PRIN: min_lines must be a whole number of 1 or more" in result.stderr


def test_the_harness_uses_the_targets_value_in_both_checks():
    """The worker's check and the orchestrator's validation read the same value, and a target
    without one is held to more than 100 lines, as every target was before."""
    harness = HARNESS.read_text(encoding="utf-8")
    assert '[ "$(wc -l < "$ACTUAL_PATH")" -ge {MIN_LINES} ]' in harness
    assert "-gt 100" not in harness and "Line count > 100" not in harness
    assert "`{MIN_LINES}` is the target's `min_lines`, or 101 when it sets none" in harness
    schema = harness.split("### Recipe schema (v1)", 1)[1].split("### Variable substitution", 1)[0]
    row = next(line for line in schema.splitlines() if line.startswith("| `min_lines` |"))
    assert "| no |" in row and "whole number of 1 or more" in row and "more than 100 lines" in row
    validate = harness.split("### 4. Validate", 1)[1].split("### 5.", 1)[0]
    assert "`{MIN_LINES}`" in validate
