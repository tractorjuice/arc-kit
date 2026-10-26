"""scripts/check_recipes.py enforces ORDER_RULES: requirements run after stakeholders.

/arckit:requirements reads the stakeholder analysis and warns when it is missing,
yet all four core recipes and most overlay recipes ran REQ and STKE in the same
wave off PRIN, so a bulk build always wrote requirements without stakeholders.
"""

import subprocess
import sys
import textwrap
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[2]
CHECK = REPO_ROOT / "scripts/check_recipes.py"
PROBE = REPO_ROOT / "plugins/arckit-claude/skills/arckit-build/recipes/zz-order-rule-probe.yaml"

RECIPE = """\
recipe: zz-order-rule-probe
schema_version: 1
defaults: {{ version: "1.0" }}
targets:
  - id: PRIN
    skill: arckit:principles
    output: {{ project: "000-global", type: PRIN }}
    deps: []
  - id: STKE
    skill: arckit:stakeholders
    output: {{ project: "001-probe", type: STKE }}
    deps: [PRIN]
  - id: REQ
    skill: arckit:requirements
    output: {{ project: "001-probe", type: REQ }}
    deps: {req_deps}
{extra}"""

MID = """\
  - id: MID
    skill: arckit:risk
    output: { project: "001-probe", type: RISK }
    deps: [STKE]
"""


def _run(req_deps: str, extra: str = "") -> subprocess.CompletedProcess:
    PROBE.write_text(textwrap.dedent(RECIPE.format(req_deps=req_deps, extra=extra)))
    try:
        return subprocess.run([sys.executable, str(CHECK)], capture_output=True, text=True, cwd=REPO_ROOT)
    finally:
        PROBE.unlink(missing_ok=True)


def test_requirements_in_the_same_wave_as_stakeholders_fails():
    result = _run("[PRIN]")
    assert result.returncode == 1, result.stdout + result.stderr
    assert "zz-order-rule-probe.yaml: target REQ must depend on STKE" in result.stderr


def test_requirements_after_stakeholders_passes():
    result = _run("[PRIN, STKE]")
    assert result.returncode == 0, result.stdout + result.stderr


def test_a_transitive_dependency_counts():
    """REQ -> MID -> STKE satisfies the rule; only the order matters."""
    result = _run("[MID]", extra=MID)
    assert result.returncode == 0, result.stdout + result.stderr
