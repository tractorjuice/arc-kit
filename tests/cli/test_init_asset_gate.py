"""`arckit init` must fail when the assets for the selected --ai are absent.

Every asset copy in init was best-effort with a yellow warning, and the command
then printed "✓ ArcKit project initialized successfully!" and Next Steps that
could not work. Both faults in #730 reached the reporter in that shape: a
project with no prompts at all, announced as a success.
"""

from pathlib import Path

import pytest
from typer.testing import CliRunner

from arckit_cli import (
    AGENT_CONFIG,
    COMMON_REQUIRED_ASSETS,
    REQUIRED_ASSETS_BY_AI,
    app,
    missing_required_assets,
)

runner = CliRunner()


def complete_paths(tmp_path: Path) -> dict:
    """A data_paths mapping where every required asset resolves."""
    keys = {*COMMON_REQUIRED_ASSETS, *(k for v in REQUIRED_ASSETS_BY_AI.values() for k in v)}
    paths = {}
    for key in keys:
        target = tmp_path / key
        target.mkdir(parents=True, exist_ok=True)
        paths[key] = target
    return paths


def test_complete_paths_report_nothing_missing(tmp_path: Path) -> None:
    assert missing_required_assets(complete_paths(tmp_path), "copilot") == []


def test_missing_copilot_prompts_are_reported(tmp_path: Path) -> None:
    paths = complete_paths(tmp_path)
    paths["copilot_prompts"] = tmp_path / "absent"

    missing = missing_required_assets(paths, "copilot")

    assert [key for key, _ in missing] == ["copilot_prompts"]


def test_codex_selection_ignores_copilot_assets(tmp_path: Path) -> None:
    """Only the selected assistant's assets gate the run."""
    paths = complete_paths(tmp_path)
    paths["copilot_prompts"] = tmp_path / "absent"

    assert missing_required_assets(paths, "codex") == []


def test_all_ai_requires_both_codex_and_opencode(tmp_path: Path) -> None:
    paths = complete_paths(tmp_path)
    paths["codex_skills"] = tmp_path / "absent"
    paths["opencode_agents"] = tmp_path / "absent"

    missing = {key for key, _ in missing_required_assets(paths, "codex", all_ai=True)}

    assert missing == {"codex_skills", "opencode_agents"}


def test_shared_assets_gate_every_assistant(tmp_path: Path) -> None:
    """Templates and scripts are needed whatever --ai is chosen."""
    for ai in AGENT_CONFIG:
        paths = complete_paths(tmp_path)
        paths["templates"] = tmp_path / "absent"

        assert [key for key, _ in missing_required_assets(paths, ai)] == ["templates"], ai


def test_document_id_generator_gates_the_run(tmp_path: Path) -> None:
    """42 of 66 commands call it, so warning and carrying on is not enough."""
    paths = complete_paths(tmp_path)
    paths["docid_generator"] = tmp_path / "absent"

    assert [key for key, _ in missing_required_assets(paths, "kimi")] == ["docid_generator"]


def test_every_ai_choice_has_a_required_asset_entry() -> None:
    """A new --ai target must declare what it needs, even if that is nothing."""
    assert set(REQUIRED_ASSETS_BY_AI) == set(AGENT_CONFIG)


@pytest.mark.parametrize("ai", ["copilot", "codex", "opencode"])
def test_init_exits_nonzero_and_leaves_no_project_behind(tmp_path: Path, ai: str) -> None:
    """The #730 end state: a hollow data root must not produce a project."""
    data_root = tmp_path / "share" / "arckit"
    (data_root / ".arckit" / "templates").mkdir(parents=True)
    (data_root / "scripts").mkdir(parents=True)

    with runner.isolated_filesystem(temp_dir=tmp_path) as cwd:
        result = runner.invoke(
            app,
            ["init", "demo", "--ai", ai, "--no-git"],
            env={"ARCKIT_DATA_DIR": str(data_root)},
        )

        assert result.exit_code == 1, result.output
        assert "initialized successfully" not in result.output
        assert not (Path(cwd) / "demo").exists()
