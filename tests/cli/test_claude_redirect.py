"""`arckit init` sends Claude Code users to the `arckit-claude` marketplace.

The CLI does not scaffold Claude Code projects: the plugin replaced that. It prints where
to get the plugin in two places, the note under the assistant menu and the message for
`--ai claude`. Both named the older `tractorjuice/arc-kit` marketplace until November 2026,
five months after the README stopped. Adding both marketplaces registers every plugin
twice (#680).
"""

from __future__ import annotations

from pathlib import Path

import pytest
from typer.testing import CliRunner

from arckit_cli import app

NEW = "/plugin marketplace add tractorjuice/arckit-claude"
OLD_REPO = "tractorjuice/arc-kit"  # not a substring of tractorjuice/arckit-claude

runner = CliRunner()


def test_ai_claude_names_the_new_marketplace(tmp_path: Path, monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.chdir(tmp_path)

    result = runner.invoke(app, ["init", "demo", "--ai", "claude", "--no-git"])

    assert result.exit_code == 0, result.output
    assert NEW in result.output
    assert OLD_REPO not in result.output
    assert not (tmp_path / "demo").exists(), "the Claude redirect must not scaffold a project"


def test_the_assistant_menu_names_the_new_marketplace(tmp_path: Path, monkeypatch: pytest.MonkeyPatch) -> None:
    # An empty data root stops the run right after the menu, so nothing is scaffolded.
    data_root = tmp_path / "share" / "arckit"
    for entry in (".arckit/templates", "scripts"):
        (data_root / entry).mkdir(parents=True)
    workdir = tmp_path / "work"
    workdir.mkdir()
    monkeypatch.chdir(workdir)
    monkeypatch.setenv("ARCKIT_DATA_DIR", str(data_root))

    result = runner.invoke(app, ["init", "demo", "--no-git"], input="1\n")

    assert "Select your AI assistant" in result.output, result.output
    assert NEW in result.output
    assert OLD_REPO not in result.output
