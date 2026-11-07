"""A reader must not gain a way to write, and a writer must not gain a way to fetch.

`ENFORCEMENT.md` lists the split as a Tier 1 control and names
`scripts/check-agent-frontmatter.py` as what holds it in CI. These tests run
that script's real `main()` over a throwaway plugin tree, because a guard that
has only ever passed proves nothing.
"""
import importlib.util
from pathlib import Path

import pytest

SCRIPT = Path(__file__).resolve().parents[2] / "scripts" / "check-agent-frontmatter.py"


def load_guard():
    spec = importlib.util.spec_from_file_location("check_agent_frontmatter", SCRIPT)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


def run_guard(tmp_path, monkeypatch, capsys, filename, tools):
    """Write one agent into a fresh plugin tree and return (exit code, output)."""
    agents = tmp_path / "plugins" / "arckit-claude" / "agents"
    agents.mkdir(parents=True)
    tool_lines = "\n".join(f"  - {tool}" for tool in tools)
    (agents / filename).write_text(
        f"---\nname: {filename[:-3]}\ndescription: fixture\nmodel: inherit\n"
        f"tools:\n{tool_lines}\n---\n\nBody.\n",
        encoding="utf-8",
    )
    guard = load_guard()
    monkeypatch.setattr(guard, "PLUGIN_ROOT", str(tmp_path / "plugins"))
    code = guard.main()
    return code, capsys.readouterr().out


READER = ["Read", "Glob", "Grep", "WebSearch", "WebFetch", "TodoWrite"]
WRITER = ["Read", "Glob", "Write", "Edit"]


@pytest.mark.parametrize("tool", ["Write", "Edit", "NotebookEdit", "Bash", "Agent"])
def test_reader_with_a_way_to_write_or_delegate_fails(tmp_path, monkeypatch, capsys, tool):
    code, out = run_guard(tmp_path, monkeypatch, capsys, "arckit-x-reader.md", [*READER, tool])
    assert code == 1
    assert f"`{tool}`" in out


@pytest.mark.parametrize(
    "tool", ["WebSearch", "WebFetch", "Bash", "Agent", "mcp__plugin_arckit_uk-tenders__search_tenders"]
)
def test_writer_with_a_way_to_fetch_or_delegate_fails(tmp_path, monkeypatch, capsys, tool):
    code, out = run_guard(tmp_path, monkeypatch, capsys, "arckit-x-writer.md", [*WRITER, tool])
    assert code == 1
    assert f"`{tool}`" in out


def test_reader_with_its_own_tools_and_an_mcp_server_passes(tmp_path, monkeypatch, capsys):
    tools = [*READER, "mcp__plugin_arckit_uk-tenders__search_tenders"]
    code, out = run_guard(tmp_path, monkeypatch, capsys, "arckit-x-reader.md", tools)
    assert code == 0, out


def test_writer_with_its_own_tools_passes(tmp_path, monkeypatch, capsys):
    code, out = run_guard(tmp_path, monkeypatch, capsys, "arckit-x-writer.md", WRITER)
    assert code == 0, out


def test_single_tier_agent_may_hold_both_sides(tmp_path, monkeypatch, capsys):
    """The monoliths read and write in one agent; the split doesn't apply to them."""
    tools = ["Read", "Write", "Edit", "Bash", "WebSearch", "WebFetch"]
    code, out = run_guard(tmp_path, monkeypatch, capsys, "arckit-research.md", tools)
    assert code == 0, out


def test_every_shipped_agent_passes(capsys):
    assert load_guard().main() == 0, capsys.readouterr().out
