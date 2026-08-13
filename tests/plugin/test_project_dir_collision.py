"""Tests for the existing-target guard in `create_project_dir` (#765).

`create-project.sh` only ever creates. The directory it builds is named
`{freshly-allocated-number}-{slug}`, so a target that already exists means the
numbering is wrong, not that the user picked a taken name. Bare `mkdir -p`
(bash) and `exist_ok=True` (Python) both succeeded in that case, so the caller
went on to write a README and a full set of `ARC-{NNN}-*` paths over the top of
an existing project and still exited 0. That is how #762 stayed silent: the
octal bug allocated a used number, and nothing downstream objected.

The numbering bug is fixed. These tests cover the reason it was quiet.

Covers, across all four script copies in both languages:
  - the guard refuses an existing target instead of writing into it
  - content already in that directory survives
  - the entrypoints report the refusal as JSON on stdout, not as a bare
    non-zero exit with nothing on stdout, because ~59 command files parse that
    stdout
  - a normal run is unaffected

The refusal path cannot be reached through correct numbering, by construction,
so these tests inject a numbering fault the way #762 produced one: a stub
`get_next_project_number` that returns a number already on disk.
"""

import json
import subprocess
import sys
import textwrap
from pathlib import Path

import pytest

REPO_ROOT = Path(__file__).resolve().parents[2]

BASH_COMMON = (
    REPO_ROOT / "scripts/bash/common.sh",
    REPO_ROOT / "plugins/arckit-claude/scripts/bash/common.sh",
)

PYTHON_COMMON = (
    REPO_ROOT / "scripts/python/common.py",
    REPO_ROOT / "plugins/arckit-claude/scripts/python/common.py",
)

BASH_ENTRYPOINTS = (
    REPO_ROOT / "scripts/bash/create-project.sh",
    REPO_ROOT / "plugins/arckit-claude/scripts/bash/create-project.sh",
)

PYTHON_ENTRYPOINTS = (
    REPO_ROOT / "scripts/python/create-project.py",
    REPO_ROOT / "plugins/arckit-claude/scripts/python/create-project.py",
)

SUBDIRS = ("vendors", "external", "final", "decisions", "diagrams",
           "wardley-maps", "data-contracts", "reviews")

SENTINEL = "content that predates the colliding run\n"


def _ids(path: Path) -> str:
    return str(path.relative_to(REPO_ROOT))


def build_repo(root: Path, project_count: int = 3) -> Path:
    """A repo satisfying both `find_repo_root` variants: the root copy keys on
    `.arckit/`, the plugin copy on `projects/`."""
    (root / ".arckit").mkdir(parents=True, exist_ok=True)
    projects = root / "projects"
    (projects / "000-global").mkdir(parents=True, exist_ok=True)
    (projects / "000-global" / "ARC-000-PRIN-v1.0.md").write_text("# Principles\n")
    for i in range(1, project_count + 1):
        (projects / f"{i:03d}-project-{i}").mkdir(exist_ok=True)
    return root


def call_bash_guard(common: Path, target: Path) -> subprocess.CompletedProcess:
    return subprocess.run(
        ["bash", "-c", 'source "$1"; create_project_dir "$2"', "_", str(common), str(target)],
        capture_output=True,
        text=True,
    )


def call_python_guard(common: Path, target: Path) -> subprocess.CompletedProcess:
    program = textwrap.dedent(
        f"""
        import importlib.util, sys
        spec = importlib.util.spec_from_file_location("arckit_common", r"{common}")
        mod = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(mod)
        result = mod.create_project_dir(r"{target}")
        print(repr(result))
        sys.exit(0 if result else 1)
        """
    )
    return subprocess.run([sys.executable, "-c", program], capture_output=True, text=True)


def build_faulty_bash(tmp_path: Path, entrypoint: Path, number: str) -> Path:
    """Copy the entrypoint next to a `common.sh` that sources the real one and
    then overrides numbering, reproducing a #762-style bad allocation."""
    fault = tmp_path / "faulty-bash"
    fault.mkdir(parents=True, exist_ok=True)
    real_common = entrypoint.parent / "common.sh"
    (fault / "common.sh").write_text(
        f'source "{real_common}"\n'
        f'get_next_project_number() {{ echo "{number}"; }}\n'
    )
    copy = fault / entrypoint.name
    copy.write_text(entrypoint.read_text())
    copy.chmod(0o755)
    return copy


def build_faulty_python(tmp_path: Path, entrypoint: Path, number: str) -> Path:
    """As above. `create-project.py` puts its own directory first on sys.path
    and imports `common`, so a shim there wins."""
    fault = tmp_path / "faulty-python"
    fault.mkdir(parents=True, exist_ok=True)
    real_common = entrypoint.parent / "common.py"
    (fault / "common.py").write_text(
        textwrap.dedent(
            f"""
            import importlib.util as _u
            _spec = _u.spec_from_file_location("_arckit_real_common", r"{real_common}")
            _mod = _u.module_from_spec(_spec)
            _spec.loader.exec_module(_mod)
            globals().update({{k: v for k, v in vars(_mod).items() if not k.startswith("__")}})

            def get_next_project_number(repo_root=None):
                return "{number}"
            """
        )
    )
    copy = fault / entrypoint.name
    copy.write_text(entrypoint.read_text())
    copy.chmod(0o755)
    return copy


# ---------------------------------------------------------------------------
# The guard itself
# ---------------------------------------------------------------------------

@pytest.mark.parametrize("common", BASH_COMMON, ids=_ids)
def test_bash_guard_refuses_existing_target(tmp_path: Path, common: Path):
    target = tmp_path / "002-already-here"
    target.mkdir()

    result = call_bash_guard(common, target)

    assert result.returncode != 0, f"expected refusal, got 0:\n{result.stderr}"
    assert "already exists" in result.stderr
    assert not [p for p in target.iterdir()], "guard created a partial tree"


@pytest.mark.parametrize("common", PYTHON_COMMON, ids=_ids)
def test_python_guard_refuses_existing_target(tmp_path: Path, common: Path):
    target = tmp_path / "002-already-here"
    target.mkdir()

    result = call_python_guard(common, target)

    assert result.returncode != 0, f"expected refusal, got 0:\n{result.stderr}"
    assert "already exists" in result.stderr
    assert "False" in result.stdout, f"expected a falsy return, got {result.stdout!r}"
    assert not [p for p in target.iterdir()], "guard created a partial tree"


@pytest.mark.parametrize("common", BASH_COMMON + PYTHON_COMMON, ids=_ids)
def test_guard_leaves_existing_content_untouched(tmp_path: Path, common: Path):
    """The worst case in #762 was not a duplicate directory but an in-place
    overwrite: when the colliding number and the slug both matched, the caller's
    `cat > README.md` replaced the existing project's README."""
    target = tmp_path / "002-already-here"
    target.mkdir()
    readme = target / "README.md"
    readme.write_text(SENTINEL)

    if common.suffix == ".sh":
        result = call_bash_guard(common, target)
    else:
        result = call_python_guard(common, target)

    assert result.returncode != 0
    assert readme.read_text() == SENTINEL
    assert {p.name for p in target.iterdir()} == {"README.md"}


@pytest.mark.parametrize("common", BASH_COMMON + PYTHON_COMMON, ids=_ids)
def test_guard_allows_a_fresh_target(tmp_path: Path, common: Path):
    """The guard must not break the only path that actually runs in practice."""
    target = tmp_path / "004-brand-new"

    if common.suffix == ".sh":
        result = call_bash_guard(common, target)
    else:
        result = call_python_guard(common, target)

    assert result.returncode == 0, result.stderr
    assert target.is_dir()
    for sub in SUBDIRS:
        assert (target / sub).is_dir(), f"missing subdirectory: {sub}"


# ---------------------------------------------------------------------------
# End to end, through the entrypoints
# ---------------------------------------------------------------------------

@pytest.mark.parametrize("entrypoint", BASH_ENTRYPOINTS + PYTHON_ENTRYPOINTS, ids=_ids)
def test_entrypoint_refuses_a_colliding_number(tmp_path: Path, entrypoint: Path):
    repo = build_repo(tmp_path / "repo")
    collided = repo / "projects/002-project-2"
    (collided / "README.md").write_text(SENTINEL)
    before = {p.name for p in (repo / "projects").iterdir()}

    if entrypoint.suffix == ".sh":
        script = build_faulty_bash(tmp_path, entrypoint, "002")
        argv = ["bash", str(script)]
    else:
        script = build_faulty_python(tmp_path, entrypoint, "002")
        argv = [sys.executable, str(script)]

    result = subprocess.run(
        argv + ["--name", "Project 2", "--json"],
        capture_output=True,
        text=True,
        cwd=repo,
    )

    assert result.returncode != 0, (
        f"reported success on a colliding number:\n{result.stdout}"
    )
    assert (repo / "projects/002-project-2/README.md").read_text() == SENTINEL, (
        "the existing project's README was overwritten"
    )
    assert {p.name for p in (repo / "projects").iterdir()} == before, (
        "a directory was created despite the refusal"
    )
    assert not (collided / "decisions").exists(), "a partial tree was written"


@pytest.mark.parametrize("entrypoint", BASH_ENTRYPOINTS + PYTHON_ENTRYPOINTS, ids=_ids)
def test_entrypoint_reports_the_refusal_as_json(tmp_path: Path, entrypoint: Path):
    """A bare non-zero exit is not enough. Around 59 command files are told to
    run this with --json and parse stdout; the guard alone left stdout empty."""
    repo = build_repo(tmp_path / "repo")

    if entrypoint.suffix == ".sh":
        script = build_faulty_bash(tmp_path, entrypoint, "002")
        argv = ["bash", str(script)]
    else:
        script = build_faulty_python(tmp_path, entrypoint, "002")
        argv = [sys.executable, str(script)]

    result = subprocess.run(
        argv + ["--name", "Project 2", "--json"],
        capture_output=True,
        text=True,
        cwd=repo,
    )

    assert result.stdout.strip(), "stdout was empty in --json mode"
    payload = json.loads(result.stdout[result.stdout.index("{"):])
    assert payload["success"] is False
    assert "already exists" in payload["error"]


@pytest.mark.parametrize("entrypoint", BASH_ENTRYPOINTS + PYTHON_ENTRYPOINTS, ids=_ids)
def test_entrypoint_normal_run_is_unaffected(tmp_path: Path, entrypoint: Path):
    """Regression guard: the refusal wiring must not disturb the success path.
    In bash it wraps the call in `if !`, which changes errexit behaviour."""
    repo = build_repo(tmp_path / "repo")

    argv = ["bash", str(entrypoint)] if entrypoint.suffix == ".sh" else [sys.executable, str(entrypoint)]
    result = subprocess.run(
        argv + ["--name", "Fresh Project", "--json"],
        capture_output=True,
        text=True,
        cwd=repo,
    )

    assert result.returncode == 0, result.stderr
    payload = json.loads(result.stdout[result.stdout.index("{"):])
    assert payload["success"] is True
    assert payload["project_number"] == "004"

    created = repo / "projects/004-fresh-project"
    assert created.is_dir()
    for sub in SUBDIRS:
        assert (created / sub).is_dir(), f"missing subdirectory: {sub}"
