"""Guard test: O-AA C208 axiom integrity (scripts/check_oaa_axioms.py).

C208 Ch. 9 defines 16 named axioms. The OAA plugin previously shipped
fabricated axiom quotes, a non-existent C208 chapter map, and "Learning
Unit" scoping. The guard blocks that defect class; this test keeps it in
CI (same pattern as the multi-instance parity guard test in
test_repo_audit.py).
"""

import importlib.util
import subprocess
import sys
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent.parent
GUARD = REPO_ROOT / "scripts" / "check_oaa_axioms.py"


def _load_guard():
    spec = importlib.util.spec_from_file_location("check_oaa_axioms", GUARD)
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    return mod


def _write(base: Path, rel: str, text: str) -> None:
    p = base / rel
    p.parent.mkdir(parents=True, exist_ok=True)
    p.write_text(text, encoding="utf-8")


def test_guard_script_exists():
    assert GUARD.is_file(), "scripts/check_oaa_axioms.py missing"


def test_oaa_axiom_guard_passes():
    result = subprocess.run(
        [sys.executable, str(GUARD)], capture_output=True, text=True, cwd=REPO_ROOT
    )
    assert result.returncode == 0, (
        f"O-AA C208 axiom guard failed:\n{result.stdout}\n{result.stderr}"
    )


def test_adm_lite_set_drift_is_detected(tmp_path):
    """An axiom the command declares but the template never applies is drift."""
    mod = _load_guard()
    _write(
        tmp_path,
        "commands/oaa-adm-lite.md",
        "- **Axiom 1 (Customer Experience Focus)** — declared\n"
        "- **Axiom 3 (Rapid Feedback Loops)** — declared\n",
    )
    _write(
        tmp_path,
        "templates/oaa-adm-lite-template.md",
        "- **Axiom 1 (Customer Experience Focus)** — applied in Sprint 0\n",
    )
    _write(
        tmp_path,
        "references/oaa-reference.md",
        "| 1 | Customer Experience Focus | `oaa-adm-lite` |\n"
        "| 3 | Rapid Feedback Loops | `oaa-adm-lite` |\n",
    )
    failures = mod.check_adm_lite_set_consistency(tmp_path)
    assert len(failures) == 1, failures
    assert "axiom set drift" in failures[0]
    assert "declares {1, 3}" in failures[0]
    assert "applies {1}" in failures[0]


def test_adm_lite_set_passes_when_aligned(tmp_path):
    """All three statements naming the same set is clean."""
    mod = _load_guard()
    _write(
        tmp_path,
        "commands/oaa-adm-lite.md",
        "- **Axiom 1 (Customer Experience Focus)** — declared\n"
        "- **Axiom 3 (Rapid Feedback Loops)** — declared\n",
    )
    _write(
        tmp_path,
        "templates/oaa-adm-lite-template.md",
        "- **Axiom 1 (Customer Experience Focus)** — Sprint 0\n"
        "- **Axiom 3 (Rapid Feedback Loops)** — Sprint 3\n",
    )
    _write(
        tmp_path,
        "references/oaa-reference.md",
        "| 1 | Customer Experience Focus | `oaa-adm-lite` |\n"
        "| 3 | Rapid Feedback Loops | `oaa-adm-lite` |\n"
        "| 5 | Value Stream Alignment | `agile-strategy` |\n",
    )
    assert mod.check_adm_lite_set_consistency(tmp_path) == []
