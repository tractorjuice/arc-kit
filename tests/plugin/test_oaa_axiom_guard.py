"""Guard test: O-AA Standard axiom and chapter integrity (scripts/check_oaa_axioms.py).

The overlay cites the O-AA Standard, Version 2.0 (C262, April 2026), which
supersedes C208. Appendix A defines 16 named axioms. The OAA plugin
previously shipped fabricated axiom quotes, a non-existent chapter map,
"Learning Unit" scoping and a "v3.0" edition label that matches no edition.
The guard blocks that defect class; this test keeps it in CI (same pattern
as the multi-instance parity guard test in test_repo_audit.py).
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
        f"O-AA axiom/chapter guard failed:\n{result.stdout}\n{result.stderr}"
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


def _stale(mod, text: str) -> list[str]:
    path = mod.ROOT / "plugins" / "arckit-oaa" / "x.md"
    return mod.check_chapter_citations(path, text)


def test_c208_chapter_coordinates_are_stale():
    """C208 chapter numbers for the five commands are flagged after the v2.0 move."""
    mod = _load_guard()
    for text in (
        "C208 Ch. 11 Agile Strategy",
        "Ch. 14: Product Architecture",
        "C208 Ch. 8 Agile Governance",
        'Ch. 9, "Axioms for the Practice of Agile Architecture"',
        "Axiom 16 (§9.16)",
        "C208 Ch. 4.6 Security by Design",
    ):
        assert _stale(mod, text), f"not flagged: {text}"


def test_v2_chapter_coordinates_pass():
    """Version 2.0 coordinates, and v2.0 chapters that reuse a C208 number, are clean."""
    mod = _load_guard()
    for text in (
        "Ch. 5 Agile Strategy",
        "Ch. 7 Agile Governance",
        "Ch. 12: Product Architecture",
        "Axiom 16 (Appendix A) and §14.6.1 Security",
        "Ch. 8 Architecture Development",
        "Ch. 11 Continuous Architectural Refactoring",
        "Ch. 14 Software Architecture",
        "| Agile Strategy | Ch. 11 | Ch. 5 |",
    ):
        assert _stale(mod, text) == [], f"flagged: {text}"


def test_edition_must_be_named():
    """C208 is named only as superseded, and the 'v3.0' label is rejected."""
    mod = _load_guard()
    path = mod.ROOT / "plugins" / "arckit-oaa" / "x.md"
    assert mod.check_edition(path, "using Open Agile Architecture (O-AA, C208)")
    assert mod.check_edition(path, "C262 supersedes C208.") == []
    assert mod.check_edition(path, "Open Agile Architecture Standard, v3.0, October 2022")
    assert mod.check_edition(path, "Open Government Licence v3.0") == []
