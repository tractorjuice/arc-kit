"""Tests for project-number allocation in the bash script set (#762).

`get_next_project_number` compared a zero-padded directory prefix inside an
arithmetic context, where bash reads a leading `0` as octal. `008`/`009` are
invalid octal, so the comparison errored and was skipped; `010`/`011` were
silently read as decimal 8/9. `max_num` never reached the true maximum and the
function handed back a project number that already existed.

The failing `((...))` sat in an `if` condition, where `errexit` is suspended,
so `create-project.sh` printed two stderr lines, created a second `010-`
directory over the top of an existing project, and still reported
`"success": true` with exit 0.

The bug only bites from the eighth project onward, which is why no smaller
fixture caught it. Every test here therefore builds a repo with more than seven
projects.

Covers:
  - both bash copies allocate correctly past 007
  - allocation is silent (no arithmetic errors on stderr)
  - the bash and Python implementations agree
  - end-to-end: create-project.sh does not land on an existing directory
"""

import json
import subprocess
from pathlib import Path

import pytest

REPO_ROOT = Path(__file__).resolve().parents[2]

COMMON_COPIES = (
    REPO_ROOT / "scripts/bash/common.sh",
    REPO_ROOT / "plugins/arckit-claude/scripts/bash/common.sh",
)

CREATE_PROJECT_COPIES = (
    REPO_ROOT / "scripts/bash/create-project.sh",
    REPO_ROOT / "plugins/arckit-claude/scripts/bash/create-project.sh",
)

PYTHON_COMMON = REPO_ROOT / "plugins/arckit-claude/scripts/python/common.py"

# 7 is the last count the octal bug got right, so it guards against a fix that
# breaks the previously-working range. 8 and 9 are the invalid-octal tokens; 10
# through 12 are the values silently misread as decimal 8, 9, 10.
PROJECT_COUNTS = (7, 8, 9, 10, 11, 12)


def _ids(path: Path) -> str:
    return str(path.relative_to(REPO_ROOT))


def build_repo(root: Path, project_count: int) -> Path:
    """A repo with projects/000-global plus 001..project_count."""
    (root / ".arckit").mkdir(parents=True, exist_ok=True)
    projects = root / "projects"
    (projects / "000-global").mkdir(parents=True, exist_ok=True)
    for i in range(1, project_count + 1):
        (projects / f"{i:03d}-project-{i}").mkdir(exist_ok=True)
    return root


def run_next_project_number(script: Path, repo: Path) -> subprocess.CompletedProcess:
    return subprocess.run(
        ["bash", "-c", f'source "$1"; get_next_project_number "$2"', "_", str(script), str(repo)],
        capture_output=True,
        text=True,
        cwd=repo,
    )


@pytest.mark.parametrize("script", COMMON_COPIES, ids=_ids)
@pytest.mark.parametrize("project_count", PROJECT_COUNTS)
def test_allocates_the_number_after_the_highest(tmp_path: Path, script: Path, project_count: int):
    """With 001..N present the next number must be N+1, never one already taken."""
    repo = build_repo(tmp_path, project_count)
    result = run_next_project_number(script, repo)

    assert result.returncode == 0, result.stderr
    assert result.stdout.strip() == f"{project_count + 1:03d}", (
        f"with projects 001-{project_count:03d} present, got "
        f"{result.stdout.strip()!r} (a directory that already exists)"
    )


@pytest.mark.parametrize("script", COMMON_COPIES, ids=_ids)
def test_allocation_is_silent(tmp_path: Path, script: Path):
    """No arithmetic errors on stderr - the original failure printed two and
    carried on, so a silent-but-wrong result was the only user-visible signal."""
    repo = build_repo(tmp_path, 11)
    result = run_next_project_number(script, repo)

    assert result.stderr == "", f"unexpected stderr: {result.stderr!r}"


@pytest.mark.parametrize("script", COMMON_COPIES, ids=_ids)
@pytest.mark.parametrize("project_count", PROJECT_COUNTS)
def test_bash_and_python_agree(tmp_path: Path, script: Path, project_count: int):
    """The two script sets ship the same function; they must not disagree."""
    repo = build_repo(tmp_path, project_count)

    from_bash = run_next_project_number(script, repo).stdout.strip()
    from_python = subprocess.run(
        [
            "python3",
            "-c",
            "import sys; sys.path.insert(0, sys.argv[1]); "
            "from importlib import import_module; "
            "print(import_module('common').get_next_project_number(sys.argv[2]))",
            str(PYTHON_COMMON.parent),
            str(repo),
        ],
        capture_output=True,
        text=True,
    ).stdout.strip()

    assert from_bash == from_python, (
        f"bash returned {from_bash!r}, python returned {from_python!r}"
    )


@pytest.mark.parametrize("script", CREATE_PROJECT_COPIES, ids=_ids)
def test_create_project_does_not_reuse_an_existing_directory(tmp_path: Path, script: Path):
    """End-to-end: the reported failure created a second 010- project on top of
    an existing one and still reported success."""
    repo = build_repo(tmp_path, 11)
    (repo / "projects/000-global/ARC-000-PRIN-v1.0.md").write_text("# Principles\n")
    before = {p.name for p in (repo / "projects").iterdir()}

    result = subprocess.run(
        [str(script), "--name", "Integration Platform", "--json"],
        capture_output=True,
        text=True,
        cwd=repo,
    )

    assert result.returncode == 0, result.stderr
    payload = json.loads(result.stdout[result.stdout.index("{"):])
    assert payload["project_number"] == "012"

    created = {p.name for p in (repo / "projects").iterdir()} - before
    assert created == {"012-integration-platform"}

    prefixes = [p.name[:3] for p in (repo / "projects").iterdir()]
    assert len(prefixes) == len(set(prefixes)), (
        f"duplicate project-number prefix: {sorted(prefixes)}"
    )
