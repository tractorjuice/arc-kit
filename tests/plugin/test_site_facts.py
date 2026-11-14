"""Figures the site states by hand must match the repository.

The getting-started page named Claude Code v2.1.156 as the minimum for five
floor bumps, and the public-sector page said "75 commands" after a 76th
landed. Nothing compared either with the source, so both went stale.
"""
import re
from pathlib import Path

REPO = Path(__file__).resolve().parents[2]
DOCS = REPO / "docs"
CORE = REPO / "plugins" / "arckit-claude"


def read(name: str) -> str:
    return (DOCS / name).read_text(encoding="utf-8")


def one(pattern: str, text: str, what: str) -> str:
    found = re.findall(pattern, text)
    assert len(found) == 1, f"expected one {what}, found {found}"
    return found[0]


def test_getting_started_names_the_current_floor():
    hook = (CORE / "hooks" / "version-check.mjs").read_text(encoding="utf-8")
    floor = one(r"const MIN_CLAUDE_CODE_VERSION = '([\d.]+)'", hook, "MIN_CLAUDE_CODE_VERSION")
    stated = one(r"requires Claude Code <strong>v([\d.]+) or later</strong>",
                 read("getting-started.html"), "floor on getting-started.html")
    assert stated == floor


def test_pages_state_the_core_command_count():
    core = len(list((CORE / "commands").glob("*.md")))
    for page in ("public-sector.html", "claude-code-plugin.html"):
        stated = one(r"That's eight of (\d+) commands", read(page), f"command count on {page}")
        assert int(stated) == core, page


def test_home_core_cards_add_up_to_the_core_command_count():
    core = len(list((CORE / "commands").glob("*.md")))
    cards = re.findall(r"Core · (\d+) commands", read("index.html"))
    assert len(cards) == 2, cards
    assert sum(map(int, cards)) == core


def test_home_agent_figure_matches_the_agents_folder():
    agents = len(list((CORE / "agents").glob("arckit-*.md")))
    stated = one(r'<div class="app-stat-number">(\d+)</div>\s*<div class="app-stat-label">Agents</div>',
                 read("index.html"), "Agents figure on index.html")
    assert int(stated) == agents


def test_plugin_page_figures_match_the_plugin():
    page = read("claude-code-plugin.html")
    core = len(list((CORE / "commands").glob("*.md")))
    agents = len(list((CORE / "agents").glob("arckit-*.md")))
    commands = set(re.findall(r"(\d+) commands", page))
    assert commands == {str(core)}, commands
    stated = set(re.findall(r"(\d+) agents", page))
    assert stated == {str(agents)}, stated
