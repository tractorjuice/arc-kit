"""Overlay commands on arckit.org appear under their Claude Code names (arc-kit#982).

In Claude Code each overlay is its own plugin, so `/arckit:uae-pdpl` gets
"Unknown skill" and the command is `/arckit-uae:uae-pdpl`. The site showed every
overlay command in the bare form: about 350 times on docs/commands.html and on
121 film labels. The sources keep `/arckit:<command>`; scripts/site_command_names.py
rewrites the hand-written pages and scripts/generate-site-pages.py the pages it
renders, both from the map in scripts/claude_command_namespacing.py.
"""

from __future__ import annotations

import importlib.util
import json
import os
import re
import subprocess
import sys
from pathlib import Path

import pytest

REPO = Path(__file__).resolve().parents[2]
DOCS = REPO / "docs"
SCRIPT = REPO / "scripts" / "site_command_names.py"
GENERATOR = REPO / "scripts" / "generate-site-pages.py"
PINNED = "4.0.0"

NAMESPACED_RE = re.compile(r"/(arckit-[a-z0-9-]+):([a-z0-9][a-z0-9.-]*)")


def load(name: str, path: Path):
    spec = importlib.util.spec_from_file_location(name, path)
    module = importlib.util.module_from_spec(spec)
    sys.modules[name] = module
    spec.loader.exec_module(module)
    return module


@pytest.fixture(scope="module")
def names():
    return load("site_command_names", SCRIPT)


def load_generator():
    markdown_it = pytest.importorskip("markdown_it")
    if markdown_it.__version__ != PINNED and not os.environ.get("CI"):
        pytest.skip(f"markdown-it-py {markdown_it.__version__} installed; pages are built with {PINNED}")
    return load("generate_site_pages", GENERATOR)


def core_commands() -> set[str]:
    return {p.stem for p in (REPO / "plugins" / "arckit-claude" / "commands").glob("*.md")}


def site_pages(names) -> list[Path]:
    """Everything the site serves that names commands, bar the pages the module leaves alone by design."""
    generated = sorted((DOCS / "guide").rglob("*.html")) + sorted((DOCS / "share").glob("*.html"))
    return [p for p in names.hand_written_pages() + generated if p.is_file()]


# --- the map ---------------------------------------------------------------


def test_namespaces_match_each_overlays_plugin_json(names):
    """Each overlay command maps to the `name` in its own plugin.json, which is
    the marketplace entry Claude Code installs and namespaces it by."""
    marketplace = json.loads((REPO / ".claude-plugin" / "marketplace.json").read_text(encoding="utf-8"))
    sources = {p["name"]: REPO / p["source"] for p in marketplace["plugins"]}
    assert sources.pop("arckit") == REPO / "plugins" / "arckit-claude"
    expected = {}
    for plugin, root in sources.items():
        manifest = json.loads((root / ".claude-plugin" / "plugin.json").read_text(encoding="utf-8"))
        assert manifest["name"] == plugin, f"{root}: plugin.json name {manifest['name']!r}, marketplace {plugin!r}"
        for command in (root / "commands").glob("*.md"):
            expected[command.stem] = plugin
    assert names.NAMESPACES == expected


def test_no_overlay_command_shares_a_core_name(names):
    # A shared name would have the rewrite namespace a core command.
    assert not core_commands() & set(names.NAMESPACES)


# --- the rewrite -------------------------------------------------------------


def test_overlay_commands_get_their_plugin_name(names):
    assert names.claude_code_names("Run /arckit:uae-pdpl, then `/arckit:togaf-adm`.") == \
        "Run /arckit-uae:uae-pdpl, then `/arckit:togaf-adm`."
    assert names.claude_code_names("/arckit:fr-anssi-carto and /arckit:fr-anssi") == \
        "/arckit-fr:fr-anssi-carto and /arckit-fr:fr-anssi"
    assert names.claude_code_names("<code>/arckit:gap-analysis</code>") == "<code>/arckit-togaf-adm:gap-analysis</code>"


@pytest.mark.parametrize("command", sorted(core_commands()))
def test_core_commands_are_untouched(names, command):
    text = f"<code>/arckit:{command}</code> and /arckit:{command} 001"
    assert names.claude_code_names(text) == text


def test_rewrite_is_idempotent(names):
    once = names.claude_code_names("/arckit:uae-pdpl /arckit:repo-audit /arckit:create")
    assert once == "/arckit-uae:uae-pdpl /arckit-repo:repo-audit /arckit-fde:create"
    assert names.claude_code_names(once) == once


def test_other_runtimes_forms_are_left_alone(names):
    # Codex, Copilot and Mistral Vibe, Kimi, and a recipe step or prose without the slash.
    text = "$arckit-uae-pdpl /arckit-uae-pdpl /skill:arckit-uae-pdpl arckit:uae-pdpl"
    assert names.claude_code_names(text) == text


def test_alt_text_keeps_what_the_image_shows(names):
    text = ('<img src="x.png" alt="a command line /arckit:supplier-profile"> /arckit:supplier-profile '
            '<meta property="og:image:alt" content="the command /arckit:uae-pdpl">')
    assert names.claude_code_names(text) == (
        '<img src="x.png" alt="a command line /arckit:supplier-profile"> /arckit-uk-gcloud:supplier-profile '
        '<meta property="og:image:alt" content="the command /arckit:uae-pdpl">')
    assert names.bare_mentions(text) == ["/arckit:supplier-profile"]


# --- the site ----------------------------------------------------------------


def test_hand_written_pages_are_rewritten():
    result = subprocess.run([sys.executable, str(SCRIPT), "--check"], cwd=REPO, capture_output=True, text=True)
    assert result.returncode == 0, result.stdout + result.stderr


def test_hand_written_pages_cover_the_site(names):
    pages = {str(p.relative_to(REPO)) for p in names.hand_written_pages()}
    assert {"docs/commands.html", "docs/guides.html", "docs/index.html", "docs/llms.txt", "docs/manifest.json"} <= pages
    assert not any(p.startswith(("docs/guide/", "docs/share/")) for p in pages)
    assert "docs/on-github.html" not in pages


def test_no_overlay_command_is_shown_bare_on_the_site(names):
    bare = {str(p.relative_to(REPO)): sorted(set(names.bare_mentions(p.read_text(encoding="utf-8"))))
            for p in site_pages(names)}
    bare = {page: found for page, found in bare.items() if found}
    assert not bare, ("Overlay commands in the bare /arckit:<command> form. Run python3 scripts/site_command_names.py, "
                      "then uv run scripts/generate-site-pages.py:\n  "
                      + "\n  ".join(f"{page}: {', '.join(found[:5])}" for page, found in sorted(bare.items())))


def test_every_namespaced_command_names_its_own_plugin(names):
    """Core commands keep `/arckit:`, and an overlay prefix names the overlay that ships the command."""
    wrong = []
    for page in site_pages(names):
        for plugin, command in NAMESPACED_RE.findall(page.read_text(encoding="utf-8")):
            command = command.rstrip(".-")
            if names.NAMESPACES.get(command) != plugin:
                wrong.append(f"{page.relative_to(REPO)}: /{plugin}:{command}")
    assert not wrong, "commands under the wrong plugin name:\n  " + "\n  ".join(sorted(set(wrong)))


def test_commands_page_lists_core_commands_bare_and_overlays_namespaced(names):
    page = (DOCS / "commands.html").read_text(encoding="utf-8")
    listed = set(re.findall(r"<code>/(arckit(?:-[a-z0-9-]+)?):([a-z0-9.-]+)</code>", page))
    core = core_commands()
    assert {("arckit", c) for c in core} <= listed, "a core command lost its /arckit: row"
    for plugin, command in listed:
        assert plugin == ("arckit" if command in core else names.NAMESPACES.get(command)), f"/{plugin}:{command}"


# --- the generated pages -------------------------------------------------------


def test_film_labels_use_claude_code_names():
    gen = load_generator()
    block = gen.films_block([{"id": "abc", "label": "Film: /arckit:uae-pdpl"}, {"id": "def", "label": "Film: /arckit:adr"}])
    assert 'data-label="Film: /arckit-uae:uae-pdpl"' in block and 'aria-label="Play Film: /arckit-uae:uae-pdpl"' in block
    assert 'data-label="Film: /arckit:adr"' in block
    assert "/arckit:uae-pdpl" not in block


def test_guide_headings_keep_their_github_anchor():
    # Guides link to each other's headings by the anchor GitHub gives the source.
    gen = load_generator()
    site = gen.Site(guides=frozenset(), articles=frozenset())
    body = gen.render_body("# NL\n\n### `/arckit:nl-tbb`\n\nThen run `/arckit:requirements`.\n",
                           gen.Page("guide", "guide/nl-overlay.html", "docs/guides/nl-overlay.md"), site)
    assert '<h3 id="arckitnl-tbb"><code>/arckit-nl:nl-tbb</code></h3>' in body
    assert "<code>/arckit:requirements</code>" in body
