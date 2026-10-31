"""A scaffolded Codex project must have the assets its skills and hooks read."""

import json
import shutil
import subprocess
from pathlib import Path

import pytest
from typer.testing import CliRunner

from arckit_cli import app

REPO_ROOT = Path(__file__).resolve().parents[2]


@pytest.fixture(scope="module")
def codex_project(tmp_path_factory: pytest.TempPathFactory) -> Path:
    project = tmp_path_factory.mktemp("codex-scaffold") / "project"
    with pytest.MonkeyPatch.context() as patch:
        patch.setenv("ARCKIT_DATA_DIR", str(REPO_ROOT))
        result = CliRunner().invoke(
            app, ["init", str(project), "--ai", "codex", "--no-git", "--minimal"]
        )
    assert result.exit_code == 0, result.output
    return project


def test_arc42_scaffold_includes_document_control_partials(codex_project: Path) -> None:
    skill = codex_project / ".agents/skills/arckit-arc42/SKILL.md"
    assert "name: arckit-arc42" in skill.read_text()
    assert (codex_project / ".arckit/templates/arc42-template.md").is_file()
    for name in ("RENDERING.md", "document-control-uk.md"):
        relative = Path(".arckit/templates/_partials") / name
        assert (codex_project / relative).read_bytes() == (REPO_ROOT / relative).read_bytes()


@pytest.mark.skipif(shutil.which("node") is None, reason="Node.js is required for Codex hooks")
@pytest.mark.parametrize("event", ["SessionStart", "UserPromptSubmit"])
def test_installed_codex_hooks_run_with_arc42_context(codex_project: Path, event: str) -> None:
    result = subprocess.run(
        ["node", str(codex_project / ".codex/hooks/arckit-codex-hook.mjs"), event],
        input=json.dumps({
            "cwd": str(codex_project),
            "hook_event_name": event,
            "prompt": "$arckit-arc42 001",
        }),
        cwd=codex_project,
        capture_output=True,
        text=True,
        timeout=30,
    )
    assert result.returncode == 0, result.stderr
    context = json.loads(result.stdout)["hookSpecificOutput"]
    assert context["hookEventName"] == event
    assert "Use $arckit-* skills" in context["additionalContext"]
