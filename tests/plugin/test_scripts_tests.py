"""The node checks in scripts/tests/ run with the rest of the suite.

They are plain scripts that exit 1 on a failure, and only .github/workflows/lint-markdown.yml
ran them, so a local `python -m pytest` or `node --test` never saw one fail: one failed on a branch
for a day unnoticed. This runs each and shows its output when it fails. The workflow keeps running
them too, and the last test here holds it to every script in the folder.
"""

from __future__ import annotations

import shutil
import subprocess
from pathlib import Path

import pytest

REPO_ROOT = Path(__file__).resolve().parents[2]
SCRIPTS = sorted((REPO_ROOT / "scripts" / "tests").glob("*.mjs"))
WORKFLOW = REPO_ROOT / ".github" / "workflows" / "lint-markdown.yml"


@pytest.mark.skipif(shutil.which("node") is None, reason="needs node")
@pytest.mark.parametrize("script", SCRIPTS, ids=lambda p: p.stem)
def test_script_passes(script):
    result = subprocess.run(["node", str(script)], cwd=REPO_ROOT, capture_output=True, text=True, timeout=120)
    assert result.returncode == 0, f"{script.name} exited {result.returncode}:\n{result.stdout}{result.stderr}"


def test_there_are_scripts_to_run():
    assert len(SCRIPTS) >= 5, [p.name for p in SCRIPTS]


def test_the_workflow_still_runs_each():
    workflow = WORKFLOW.read_text(encoding="utf-8")
    missing = [p.name for p in SCRIPTS if f"node scripts/tests/{p.name}" not in workflow]
    assert not missing, f"lint-markdown.yml does not run {missing}"
