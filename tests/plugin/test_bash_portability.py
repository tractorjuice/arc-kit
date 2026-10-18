"""ArcKit's bash scripts run on macOS.

macOS ships bash 3.2 as /bin/bash, and BSD sed and date. Run there, five of
the scripts failed:

  - list-projects.sh and migrate-filenames.sh declared associative arrays
    (`local -A`, `declare -A`), which bash 3.2 doesn't have; both died with an
    "unbound variable" error before printing anything.
  - check-prerequisites.sh expanded an empty array as "${a[@]}", which is an
    unbound variable under `set -u` (common.sh sets it) in bash before 4.4.
  - common.sh escaped JSON with `sed ':a;N;$!ba;...'`, a GNU-only loop that
    BSD sed rejects, so create-project.sh printed malformed JSON.
  - detect-stale-artifacts.sh computed "30 days ago" with GNU `date -d` only,
    so the session-start monitor never reported a stale draft.

CI runs Linux with bash 5 and GNU tools, where none of this shows. So the
static checks hold every shipped script to what bash 3.2 and BSD tools accept,
and the run checks use every bash on the machine: on a Mac that includes
/bin/bash 3.2. The quoted project name catches create-project.sh printing the
name unescaped, which broke its JSON on every platform.
"""

from __future__ import annotations

import json
import re
import shutil
import subprocess
from pathlib import Path

import pytest

REPO = Path(__file__).resolve().parents[2]
COPIES = {"root": REPO / "scripts" / "bash", "plugin": REPO / "plugins" / "arckit-claude" / "scripts" / "bash"}
SCRIPTS = sorted(p for d in COPIES.values() for p in d.glob("*.sh"))

NOT_IN_BASH_32_OR_BSD = {
    r"\b(?:declare|local|typeset)\s+-[a-zA-Z]*A": "an associative array (bash 4)",
    r"\b(?:mapfile|readarray)\b": "mapfile/readarray (bash 4)",
    r"\$\{\w+(?:,,?|\^\^?)\}": "case modification such as ${x,,} (bash 4)",
    r"\b(?:declare|local|typeset)\s+-[a-zA-Z]*n\s": "a nameref (bash 4.3)",
    r":a;N;\$!ba": "the GNU sed loop idiom, which BSD sed rejects",
}


def code_lines(path: Path) -> list[tuple[int, str]]:
    return [(n, line) for n, line in enumerate(path.read_text(encoding="utf-8").splitlines(), 1)
            if not line.lstrip().startswith("#")]


@pytest.mark.parametrize("script", SCRIPTS, ids=lambda p: str(p.relative_to(REPO)))
def test_no_bash4_or_gnu_only_constructs(script):
    found = [f"line {n}: {why}" for n, line in code_lines(script)
             for pattern, why in NOT_IN_BASH_32_OR_BSD.items() if re.search(pattern, line)]
    assert not found, f"{script.name} uses what macOS's bash 3.2 or BSD tools reject: {found}"


@pytest.mark.parametrize("script", SCRIPTS, ids=lambda p: str(p.relative_to(REPO)))
def test_arrays_that_start_empty_are_expanded_safely(script):
    """An array initialised as `x=()` is expanded as ${x[@]+"${x[@]}"}, never "${x[@]}"."""
    text = script.read_text(encoding="utf-8")
    empty = set(re.findall(r"^\s*(?:local\s+)?(\w+)=\(\)\s*$", text, re.M))
    bad = sorted({name for name in empty if f'"${{{name}[@]}}"' in text.replace(f'${{{name}[@]+"${{{name}[@]}}"}}', "")})
    assert not bad, f"{script.name}: under set -u, bash 3.2 calls an empty {bad} unbound; use ${{x[@]+\"${{x[@]}}\"}}"


def test_stale_draft_threshold_has_a_bsd_date_fallback():
    text = (COPIES["plugin"] / "detect-stale-artifacts.sh").read_text(encoding="utf-8")
    assert "date -d" in text and "date -v-30d" in text


# ── Running them ─────────────────────────────────────────────────────


def _bashes() -> list[str]:
    """Every distinct bash here: the one on PATH, and /bin/bash (3.2 on macOS)."""
    seen, out = set(), []
    for candidate in (shutil.which("bash"), "/bin/bash"):
        if not candidate or not Path(candidate).exists():
            continue
        version = subprocess.run([candidate, "-c", "echo $BASH_VERSION"], capture_output=True, text=True).stdout.strip()
        if version not in seen:
            seen.add(version)
            out.append(candidate)
    return out


BASHES = _bashes()
CASES = [(b, c) for b in BASHES for c in COPIES]


def repo(root: Path) -> Path:
    (root / ".arckit").mkdir(parents=True)
    (root / "projects" / "000-global").mkdir(parents=True)
    (root / "projects" / "000-global" / "ARC-000-PRIN-v1.0.md").write_text("# Principles\n", encoding="utf-8")
    subprocess.run(["git", "init", "-q"], cwd=root, check=True)
    return root


def run(bash: str, copy: str, script: str, *args: str, cwd: Path) -> subprocess.CompletedProcess:
    return subprocess.run([bash, str(COPIES[copy] / script), *args], cwd=cwd, capture_output=True, text=True)


@pytest.mark.parametrize("bash,copy", CASES)
def test_create_project_prints_valid_json_for_any_name(tmp_path, bash, copy):
    name = 'Demo "Quoted" \\ Service'
    result = run(bash, copy, "create-project.sh", "--json", "--name", name, cwd=repo(tmp_path))
    assert result.returncode == 0, result.stderr
    data = json.loads(result.stdout)
    assert data["project_name"] == name
    assert data["next_steps"] and all(isinstance(s, str) for s in data["next_steps"])


@pytest.mark.parametrize("bash,copy", CASES)
def test_list_projects(tmp_path, bash, copy):
    root = repo(tmp_path)
    (root / "projects" / "001-demo").mkdir()
    listed = run(bash, copy, "list-projects.sh", "--json", cwd=root)
    assert listed.returncode == 0, listed.stderr
    json.loads(listed.stdout)
    table = run(bash, copy, "list-projects.sh", cwd=root)
    assert table.returncode == 0, table.stderr


@pytest.mark.parametrize("bash,copy", CASES)
def test_check_prerequisites_with_no_documents_yet(tmp_path, bash, copy):
    root = repo(tmp_path)
    (root / "projects" / "001-demo").mkdir()
    result = run(bash, copy, "check-prerequisites.sh", "--json", "--project", "001", cwd=root)
    assert result.returncode == 0, result.stderr
    assert json.loads(result.stdout)["AVAILABLE_DOCS"] == []


@pytest.mark.parametrize("bash,copy", CASES)
def test_migrate_filenames_dry_run(tmp_path, bash, copy):
    root = repo(tmp_path)
    legacy = root / "projects" / "001-legacy"
    (legacy / "decisions").mkdir(parents=True)
    (legacy / "requirements.md").write_text("# Requirements\n", encoding="utf-8")
    (legacy / "decisions" / "ADR-001-use-postgres.md").write_text("# ADR\n", encoding="utf-8")
    result = run(bash, copy, "migrate-filenames.sh", "--all", "--dry-run", cwd=root)
    assert result.returncode == 0, result.stderr
    said = result.stdout + result.stderr
    assert "requirements.md → ARC-001-REQ-v1.0.md" in said
    assert "ADR-001-use-postgres.md → ARC-001-ADR-001-v1.0.md" in said
    assert (legacy / "requirements.md").exists(), "a dry run must not rename anything"


@pytest.mark.parametrize("bash", BASHES)
def test_stale_scan_reports_an_old_draft(tmp_path, bash):
    root = repo(tmp_path)
    (root / "projects" / "001-demo").mkdir()
    (root / "projects" / "001-demo" / "ARC-001-REQ-v1.0.md").write_text(
        "# Requirements\n\n| Field | Value |\n|---|---|\n| **Status** | DRAFT |\n"
        "| **Last Modified** | 2026-01-01 |\n| **Next Review Date** | 2099-01-01 |\n", encoding="utf-8")
    result = subprocess.run([bash, str(COPIES["plugin"] / "detect-stale-artifacts.sh")],
                            cwd=root, capture_output=True, text=True)
    assert "DRAFT unchanged since 2026-01-01" in result.stdout, result.stdout + result.stderr
