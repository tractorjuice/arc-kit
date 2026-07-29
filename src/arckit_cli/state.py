"""
State Persistence Module

Handles loading/saving ``.arckit/state.json``, recording target completion,
input-hash change detection (staleness checks), and resume logic.
"""

import json
import hashlib
from dataclasses import dataclass, field, asdict
from glob import glob
from pathlib import Path
from datetime import datetime, timezone


# ---------------------------------------------------------------------------
# Data classes
# ---------------------------------------------------------------------------


@dataclass
class TargetState:
    """Runtime state for a single target."""

    status: str  # "pending" | "building" | "complete" | "failed"
    output_path: str | None = None
    output_sha256: str | None = None
    input_hashes: dict[str, str] = field(default_factory=dict)  # {path: sha256}
    completed_at: str | None = None  # ISO timestamp
    error: str | None = None


@dataclass
class State:
    """Persisted build state for a project."""

    version: str = "1.0"
    recipe: str = ""
    recipe_path: str = ""
    project: str = ""
    current_wave: int = 0
    completed_waves: list[int] = field(default_factory=list)
    targets: dict[str, TargetState] = field(default_factory=dict)
    wave_values: dict[str, str] = field(default_factory=dict)


# ---------------------------------------------------------------------------
# Public API
# ---------------------------------------------------------------------------


def load_state(project_path: str) -> State | None:
    """Load build state from ``.arckit/state.json`` in the project directory.

    Args:
        project_path: Path to the project root.

    Returns:
        Parsed State, or ``None`` if no state file exists.
    """
    state_dir = Path(project_path) / ".arckit"
    state_file = state_dir / "state.json"

    if not state_file.is_file():
        return None

    try:
        data = json.loads(state_file.read_text(encoding="utf-8"))
    except (json.JSONDecodeError, OSError):
        return None

    # Reconstruct State from dict
    version = data.get("version", "1.0")
    targets_raw = data.get("targets", {})
    targets: dict[str, TargetState] = {}
    for tid, tdata in targets_raw.items():
        targets[tid] = TargetState(
            status=tdata.get("status", "pending"),
            output_path=tdata.get("output_path"),
            output_sha256=tdata.get("output_sha256"),
            input_hashes=tdata.get("input_hashes", {}),
            completed_at=tdata.get("completed_at"),
            error=tdata.get("error"),
        )

    return State(
        version=version,
        recipe=data.get("recipe", ""),
        recipe_path=data.get("recipe_path", ""),
        project=data.get("project", ""),
        current_wave=data.get("current_wave", 0),
        completed_waves=data.get("completed_waves", []),
        targets=targets,
        wave_values=data.get("wave_values", {}),
    )


def save_state(project_path: str, state: State) -> None:
    """Persist state to ``.arckit/state.json``.

    Args:
        project_path: Path to the project root.
        state: State object to serialize.
    """
    state_dir = Path(project_path) / ".arckit"
    state_dir.mkdir(parents=True, exist_ok=True)
    state_file = state_dir / "state.json"

    serialized = _state_to_dict(state)
    state_file.write_text(json.dumps(serialized, indent=2), encoding="utf-8")


def is_target_stale(
    state: State,
    target_id: str,
    output_path: str,
    input_files: list[str],
) -> bool:
    """Check whether a previously built target needs to be rebuilt.

    A target is stale if:
    - Its state is not ``"complete"``
    - The output file is missing or its SHA-256 changed
    - Any input file hash differs from the recorded hash

    Args:
        state: Current build state.
        target_id: ID of the target to check.
        output_path: Absolute path to the target's output file.
        input_files: Glob patterns describing input files.

    Returns:
        ``True`` if the target needs rebuilding.
    """
    ts = state.targets.get(target_id)
    if ts is None:
        return True
    if ts.status == "skipped":
        # Skipped targets have valid files — treat as not stale
        return False
    if ts.status != "complete":
        return True

    # Check output file integrity
    out = Path(output_path)
    if not out.is_file():
        return True
    current_sha = _file_sha256(out)
    if current_sha != ts.output_sha256:
        return True

    # Check input hashes
    current_input_hashes = compute_input_hashes(input_files)
    if current_input_hashes != ts.input_hashes:
        return True

    return False


def mark_target_complete(
    state: State,
    target_id: str,
    output_path: str,
    input_files: list[str],
) -> None:
    """Mark a target as successfully built, recording hashes and timestamp.

    Args:
        state: Current build state.
        target_id: ID of the completed target.
        output_path: Absolute path to the output file.
        input_files: Glob patterns describing input files.
    """
    input_hashes = compute_input_hashes(input_files)
    out_sha = _file_sha256(Path(output_path))
    now = datetime.now(timezone.utc).isoformat()

    state.targets[target_id] = TargetState(
        status="complete",
        output_path=output_path,
        output_sha256=out_sha,
        input_hashes=input_hashes,
        completed_at=now,
    )


def mark_target_skipped(state: State, target_id: str, output_path: str) -> None:
    """Mark a target as skipped (file already exists).

    Args:
        state: Current build state.
        target_id: ID of the skipped target.
        output_path: Absolute path to the existing output file.
    """
    out_sha = _file_sha256(Path(output_path))
    now = datetime.now(timezone.utc).isoformat()

    state.targets[target_id] = TargetState(
        status="skipped",
        output_path=output_path,
        output_sha256=out_sha,
        completed_at=now,
    )


def mark_target_failed(state: State, target_id: str, error: str) -> None:
    """Mark a target as failed with an error message.

    Args:
        state: Current build state.
        target_id: ID of the failed target.
        error: Human-readable error description.
    """
    existing = state.targets.get(target_id)
    if existing:
        state.targets[target_id] = TargetState(
            status="failed",
            output_path=existing.output_path,
            output_sha256=existing.output_sha256,
            input_hashes=existing.input_hashes,
            completed_at=existing.completed_at,
            error=error,
        )
    else:
        state.targets[target_id] = TargetState(
            status="failed",
            error=error,
        )


def compute_input_hashes(glob_patterns: list[str]) -> dict[str, str]:
    """Compute SHA-256 hashes for files matching glob patterns.

    Args:
        glob_patterns: Glob patterns (e.g. ``["projects/P/*.md"]``).

    Returns:
        Mapping of resolved file paths to their SHA-256 hex digest.
    """
    hashes: dict[str, str] = {}
    for pattern in glob_patterns:
        for filepath in sorted(glob(pattern, recursive=True)):
            path = Path(filepath)
            if path.is_file():
                hashes[str(path)] = _file_sha256(path)
    return hashes


# ---------------------------------------------------------------------------
# Internal helpers
# ---------------------------------------------------------------------------


def _file_sha256(filepath: Path) -> str:
    """Compute SHA-256 hex digest of a file.

    Raises ValueError if filepath is not a regular file (e.g. a directory).
    """
    if not filepath.is_file():
        raise ValueError(f"Not a file: {filepath}")
    h = hashlib.sha256()
    for chunk in filepath.open("rb"):
        h.update(chunk)
    return h.hexdigest()


def _state_to_dict(state: State) -> dict:
    """Serialize a State object to a plain dict for JSON encoding."""
    return {
        "version": state.version,
        "recipe": state.recipe,
        "recipe_path": state.recipe_path,
        "project": state.project,
        "current_wave": state.current_wave,
        "completed_waves": state.completed_waves,
        "wave_values": state.wave_values,
        "targets": {
            tid: {
                "status": ts.status,
                "output_path": ts.output_path,
                "output_sha256": ts.output_sha256,
                "input_hashes": ts.input_hashes,
                "completed_at": ts.completed_at,
                "error": ts.error,
            }
            for tid, ts in state.targets.items()
        },
    }


if __name__ == "__main__":
    import tempfile

    # Quick self-test
    with tempfile.TemporaryDirectory() as tmpdir:
        project = str(Path(tmpdir) / "test-project")
        Path(project).mkdir()

        # Create some input files
        (Path(project) / "input1.txt").write_text("hello")
        (Path(project) / "input2.txt").write_text("world")
        (Path(project) / ".arckit").mkdir()
        (Path(project) / "output.md").write_text("generated")

        state = State(recipe="test", project="test-project")
        mark_target_complete(
            state, "PRIN", str(Path(project) / "output.md"),
            [f"{project}/*.txt"],
        )

        print("Target completed, checking staleness...")
        stale = is_target_stale(state, "PRIN", str(Path(project) / "output.md"), [f"{project}/*.txt"])
        print(f"  Stale (no change): {stale}")  # should be False

        # Modify an input file
        (Path(project) / "input1.txt").write_text("changed")
        stale = is_target_stale(state, "PRIN", str(Path(project) / "output.md"), [f"{project}/*.txt"])
        print(f"  Stale (input changed): {stale}")  # should be True

        # Save and reload state
        save_state(project, state)
        loaded = load_state(project)
        assert loaded is not None
        assert "PRIN" in loaded.targets
        print(f"  State round-trip: OK (recipe={loaded.recipe}, targets={list(loaded.targets.keys())})")

        # Test mark_failed
        mark_target_failed(loaded, "PRIN", "simulated error")
        print(f"  Failed status: {loaded.targets['PRIN'].status} (error={loaded.targets['PRIN'].error})")