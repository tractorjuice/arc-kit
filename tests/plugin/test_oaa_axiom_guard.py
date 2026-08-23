"""Guard test: O-AA C208 axiom integrity (scripts/check_oaa_axioms.py).

C208 Ch. 9 defines 16 named axioms. The OAA plugin previously shipped
fabricated axiom quotes, a non-existent C208 chapter map, and "Learning
Unit" scoping. The guard blocks that defect class; this test keeps it in
CI (same pattern as the multi-instance parity guard test in
test_repo_audit.py).
"""

import subprocess
import sys
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent.parent
GUARD = REPO_ROOT / "scripts" / "check_oaa_axioms.py"


def test_guard_script_exists():
    assert GUARD.is_file(), "scripts/check_oaa_axioms.py missing"


def test_oaa_axiom_guard_passes():
    result = subprocess.run(
        [sys.executable, str(GUARD)], capture_output=True, text=True, cwd=REPO_ROOT
    )
    assert result.returncode == 0, (
        f"O-AA C208 axiom guard failed:\n{result.stdout}\n{result.stderr}"
    )
