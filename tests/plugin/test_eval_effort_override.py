"""eval-headless.py's effort override, without a model.

A command's own `effort:` frontmatter wins over the session's effort, so the
only way to compare effort levels on a command is to run it from a copy of the
plugin with that line changed. These tests hold the copy to changing exactly
that line and nothing else.
"""

from __future__ import annotations

import importlib.util
import os
from pathlib import Path

import pytest

REPO = Path(__file__).resolve().parents[2]
PLUGIN = REPO / "plugins" / "arckit-claude"

spec = importlib.util.spec_from_file_location("eval_headless", REPO / "scripts" / "eval-headless.py")
eval_headless = importlib.util.module_from_spec(spec)
spec.loader.exec_module(eval_headless)


def frontmatter(path: Path) -> str:
    text = path.read_text(encoding="utf-8")
    return text[: text.index("\n---", 4)]


def test_prompt_command():
    assert eval_headless.prompt_command("/arckit:sobc 001 Business case") == "sobc"
    assert eval_headless.prompt_command("  /arckit:wardley.value-chain x") == "wardley.value-chain"
    with pytest.raises(ValueError):
        eval_headless.prompt_command("please run sobc")


@pytest.mark.parametrize("command", ["sobc", "requirements"])
def test_rewrites_only_the_invoked_command(tmp_path, command):
    copy = eval_headless.plugin_with_effort(PLUGIN, command, "high", tmp_path / "arckit")
    target = copy / "commands" / f"{command}.md"
    assert "effort: high" in frontmatter(target).splitlines()
    assert "effort: max" not in frontmatter(target)
    original = (PLUGIN / "commands" / f"{command}.md").read_text(encoding="utf-8")
    rewritten = target.read_text(encoding="utf-8")
    assert original.replace("effort: max", "effort: high", 1) == rewritten, "only the effort line may change"
    # Every other command is untouched.
    other = copy / "commands" / "principles.md"
    assert other.read_text(encoding="utf-8") == (PLUGIN / "commands" / "principles.md").read_text(encoding="utf-8")


def test_copy_leaves_out_evals_and_overlay_mirror(tmp_path):
    copy = eval_headless.plugin_with_effort(PLUGIN, "sobc", "high", tmp_path / "arckit")
    assert not (copy / "evals").exists()
    assert not (copy / "plugins").exists()
    assert (copy / ".claude-plugin" / "plugin.json").is_file()
    assert (copy / "hooks" / "hooks.json").is_file()


def test_adds_effort_when_the_command_has_none(tmp_path):
    fake = tmp_path / "plugin"
    (fake / "commands").mkdir(parents=True)
    (fake / "commands" / "demo.md").write_text("---\ndescription: demo\n---\n\nBody\n", encoding="utf-8")
    copy = eval_headless.plugin_with_effort(fake, "demo", "xhigh", tmp_path / "copy")
    assert (copy / "commands" / "demo.md").read_text(encoding="utf-8") == \
        "---\ndescription: demo\neffort: xhigh\n---\n\nBody\n"


def test_rejects_unknown_level_and_command(tmp_path):
    with pytest.raises(ValueError):
        eval_headless.plugin_with_effort(PLUGIN, "sobc", "ultra", tmp_path / "a")
    with pytest.raises(FileNotFoundError):
        eval_headless.plugin_with_effort(PLUGIN, "no-such-command", "high", tmp_path / "b")


def test_effort_comparison_cases_target_commands_with_explicit_effort():
    """A comparison case targets a command that sets its own effort level.

    The cases were written to test commands at `max`; after the September 2026
    comparison `/arckit:requirements` and `/arckit:sobc` moved to `high`, and the
    cases stay to re-test that decision when models change.
    """
    import yaml

    for case_dir in (PLUGIN / "evals").iterdir():
        case_file = case_dir / "case.yaml"
        if not case_file.is_file():
            continue
        case = yaml.safe_load(case_file.read_text(encoding="utf-8"))
        if "effort-comparison" not in (case.get("tags") or []):
            continue
        command = eval_headless.prompt_command(case["prompt"])
        lines = frontmatter(PLUGIN / "commands" / f"{command}.md").splitlines()
        assert any(line.startswith("effort: ") for line in lines), \
            f"{case_dir.name}: /arckit:{command} sets no effort level; the comparison has no baseline"


def test_timeout_is_recorded_not_raised(tmp_path, monkeypatch):
    """A run that outlives its limit is a result (it fails the file graders), not a crash.

    Before this, `/arckit:requirements` at `effort: max` ran past its 30-minute
    limit and the exception abandoned every case after it in that run.
    """
    fake_bin = tmp_path / "bin"
    fake_bin.mkdir()
    claude = fake_bin / "claude"
    claude.write_text('#!/bin/sh\necho \'{"type": "system", "subtype": "init"}\'\nexec sleep 30\n', encoding="utf-8")
    claude.chmod(0o755)
    monkeypatch.setenv("PATH", f"{fake_bin}:{os.environ['PATH']}")
    case = {"prompt": "/arckit:sobc 001", "max_turns": 1, "timeout_seconds": 600}
    rec = eval_headless.run_claude(case, tmp_path, PLUGIN, None, timeout=1)
    assert rec["timed_out"] is True
    assert rec["subtype"] == "timeout after 1s"
    assert rec["exit_code"] is None
