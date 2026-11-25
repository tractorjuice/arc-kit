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


@pytest.mark.parametrize("bash,copy", CASES)
def test_migrate_filenames_keeps_gcloud_and_dos_in_procurement(tmp_path, bash, copy):
    """SUBDIR_MAP in config/doc-types.mjs puts GCLD, GCLC and DOS in procurement/, and
    validate-arc-filename.mjs blocks them at the project root. The script moved them out of
    procurement/ to the root. Another type found in procurement/, such as a SOW, still goes to
    the root, and a G-Cloud file at the root goes into procurement/."""
    root = repo(tmp_path)
    project = root / "projects" / "001-legacy"
    (project / "procurement").mkdir(parents=True)
    old = ["procurement/gcloud-requirements.md", "procurement/dos-requirements.md",
           "procurement/sow.md", "gcloud-clarification-questions.md"]
    for name in old:
        (project / name).write_text("# Document\n", encoding="utf-8")

    preview = run(bash, copy, "migrate-filenames.sh", "projects/001-legacy", "--dry-run", cwd=root)
    assert preview.returncode == 0, preview.stderr
    assert all((project / name).exists() for name in old), "a dry run must not move anything"

    result = run(bash, copy, "migrate-filenames.sh", "projects/001-legacy", cwd=root)
    assert result.returncode == 0, result.stderr
    for name in ["procurement/ARC-001-GCLD-v1.0.md", "procurement/ARC-001-DOS-v1.0.md",
                 "procurement/ARC-001-GCLC-v1.0.md", "ARC-001-SOW-v1.0.md"]:
        assert (project / name).is_file(), f"{name} missing after migration:\n{result.stdout}"
    for code in ["GCLD", "GCLC", "DOS"]:
        assert not list(project.glob(f"ARC-001-{code}-*")), f"{code} left at the project root"


@pytest.mark.parametrize("bash,copy", CASES)
def test_migrate_filenames_leaves_arc_files_in_shared_folders_alone(tmp_path, bash, copy):
    """research/, diagrams/ and wardley-maps/ each hold several types (SUBDIR_MAP). The script
    took any ARC file not of the folder's first type for an old one and renamed it, turning an
    AWS research note into RSCH, a DFD into DIAG and a gameplay analysis into WARD."""
    root = repo(tmp_path)
    project = root / "projects" / "001-legacy"
    current = ["research/ARC-001-AWRS-001-v1.0.md", "diagrams/ARC-001-DFD-001-v1.0.md",
               "wardley-maps/ARC-001-WGAM-001-v1.0.md"]
    for name in current:
        (project / name).parent.mkdir(parents=True, exist_ok=True)
        (project / name).write_text("# Document\n", encoding="utf-8")
    result = run(bash, copy, "migrate-filenames.sh", "projects/001-legacy", cwd=root)
    assert result.returncode == 0, result.stderr
    for name in current:
        assert (project / name).is_file(), f"{name} was renamed:\n{result.stdout}"


@pytest.mark.parametrize("bash,copy", CASES)
def test_migrate_filenames_numbers_after_the_highest_existing_file(tmp_path, bash, copy):
    """A migrated file is numbered after the highest existing one of its type in the folder, as
    generate-document-id.mjs --next-num numbers a new one. The script counted from 001 in a
    subfolder, and counted the ARC files for one moved up from the root, so a migrated file
    could take an existing number, and --force overwrote the existing file."""
    root = repo(tmp_path)
    project = root / "projects" / "001-legacy"
    (project / "decisions").mkdir(parents=True)
    (project / "diagrams").mkdir()
    files = {"decisions/ARC-001-ADR-001-v1.0.md": "existing ADR", "decisions/adr-use-postgres.md": "old ADR",
             "diagrams/ARC-001-DIAG-002-v1.0.md": "existing diagram", "context-diagram.md": "old diagram"}
    for name, text in files.items():
        (project / name).write_text(text, encoding="utf-8")
    result = run(bash, copy, "migrate-filenames.sh", "projects/001-legacy", "--force", cwd=root)
    assert result.returncode == 0, result.stderr
    expected = {"decisions/ARC-001-ADR-001-v1.0.md": "existing ADR", "decisions/ARC-001-ADR-002-v1.0.md": "old ADR",
                "diagrams/ARC-001-DIAG-002-v1.0.md": "existing diagram", "diagrams/ARC-001-DIAG-003-v1.0.md": "old diagram"}
    for name, text in expected.items():
        assert (project / name).is_file() and (project / name).read_text(encoding="utf-8") == text, \
            f"{name} should hold '{text}':\n{result.stdout}"


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


HEADER = ("| Field | Value |\n|---|---|\n| **Status** | {status} |\n"
          "| **Last Modified** | 2026-01-01 |\n| **Next Review Date** | {review} |\n")


@pytest.mark.parametrize("bash", BASHES)
def test_stale_scan_leaves_out_a_draft_whose_status_only_a_command_sets(tmp_path, bash):
    """A type with `statusSetBy` in the registry is never promoted by hand, so the monitor does not
    tell anyone to: an old DRAFT of one is not reported. An old DRAFT of any other type still is,
    a numbered one included, and an overdue review is reported for every type."""
    root = repo(tmp_path)
    project = root / "projects" / "001-demo"
    (project / "decisions").mkdir(parents=True)
    for name, status, review in [("ARC-001-REQ-v1.0.md", "DRAFT", "2099-01-01"),
                                 ("decisions/ARC-001-ADR-002-v1.0.md", "DRAFT", "2099-01-01"),
                                 ("ARC-001-FOODXC-v1.0.md", "DRAFT", "2099-01-01"),
                                 ("ARC-001-FOODCMP-v1.1.md", "DRAFT", "2099-01-01"),
                                 ("ARC-001-FOODCOOK-v1.0.md", "APPROVED", "2026-02-01")]:
        (project / name).write_text("# Document\n\n" + HEADER.format(status=status, review=review), encoding="utf-8")
    result = subprocess.run([bash, str(COPIES["plugin"] / "detect-stale-artifacts.sh")],
                            cwd=root, capture_output=True, text=True)
    out = result.stdout
    assert result.returncode == 0 and result.stderr == "", result.stderr
    assert "projects/001-demo/ARC-001-REQ-v1.0.md — DRAFT unchanged since 2026-01-01" in out, out
    assert "projects/001-demo/decisions/ARC-001-ADR-002-v1.0.md — DRAFT unchanged since 2026-01-01" in out, out
    assert "FOODXC" not in out and "FOODCMP" not in out, out
    assert "projects/001-demo/ARC-001-FOODCOOK-v1.0.md — review overdue since 2026-02-01" in out, out
    assert "Found 3 stale artifact(s)" in out, out


@pytest.mark.skipif(shutil.which("node") is None, reason="needs node")
def test_the_monitors_list_is_the_registrys():
    """The monitor runs at every session start, so it reads no registry: it carries the list of types
    with `statusSetBy` in config/doc-types.mjs, and this keeps the two the same."""
    registry = REPO / "plugins" / "arckit-claude" / "config" / "doc-types.mjs"
    codes = subprocess.run(
        ["node", "--input-type=module", "-e",
         f"const {{ DOC_TYPES }} = await import({json.dumps(registry.as_uri())});"
         "console.log(Object.keys(DOC_TYPES).filter(c => DOC_TYPES[c].statusSetBy).join(' '))"],
        capture_output=True, text=True, check=True).stdout.split()
    assert codes, "no type sets statusSetBy, so the test would prove nothing"
    expected = f'status_set_by_command=" {" ".join(codes)} "'
    script = (COPIES["plugin"] / "detect-stale-artifacts.sh").read_text(encoding="utf-8")
    written = [line for line in script.splitlines() if line.startswith("status_set_by_command=")]
    assert written == [expected], f"write this line in detect-stale-artifacts.sh:\n{expected}"
