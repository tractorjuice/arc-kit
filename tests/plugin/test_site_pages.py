"""The static guide and article pages scripts/generate-site-pages.py writes.

The viewers used to render every guide and article in the browser, so a
crawler saw one empty "Guide Viewer" page for 256 guides and one "Article"
page for 57 articles, and arckit.org ranked for nothing but its own name
(18 October 2026). These tests hold the fix in place: every guide and listed
article has a page of its own, with its own canonical URL and its text in the
HTML, the viewers only redirect, and the pages are up to date with their
Markdown. Like test_article_listing.py, this runs in the Python suite.
"""

from __future__ import annotations

import importlib.util
import os
import re
import subprocess
import sys
from pathlib import Path

import pytest

REPO = Path(__file__).resolve().parents[2]
DOCS = REPO / "docs"
SCRIPT = REPO / "scripts" / "generate-site-pages.py"
PINNED = "4.0.0"


def guide_names() -> list[str]:
    return sorted(str(p.relative_to(DOCS / "guides").with_suffix("")) for p in (DOCS / "guides").rglob("*.md"))


def listed_slugs() -> list[str]:
    cards = re.findall(r'<article class="app-article-card">.*?</article>', (DOCS / "articles.html").read_text(encoding="utf-8"), re.S)
    return sorted({re.search(r'href="share/([A-Za-z0-9_-]+)\.html"', c).group(1) for c in cards})


def canonical(page: Path) -> str:
    return re.search(r'<link rel="canonical" href="([^"]+)">', page.read_text(encoding="utf-8")).group(1)


def load_generator():
    markdown_it = pytest.importorskip("markdown_it")
    if markdown_it.__version__ != PINNED and not os.environ.get("CI"):
        pytest.skip(f"markdown-it-py {markdown_it.__version__} installed; pages are built with {PINNED}")
    spec = importlib.util.spec_from_file_location("generate_site_pages", SCRIPT)
    module = importlib.util.module_from_spec(spec)
    sys.modules["generate_site_pages"] = module
    spec.loader.exec_module(module)
    return module


def test_pages_are_up_to_date():
    load_generator()
    result = subprocess.run([sys.executable, str(SCRIPT), "--check"], cwd=REPO, capture_output=True, text=True)
    assert result.returncode == 0, result.stdout + result.stderr


@pytest.mark.parametrize("name", guide_names())
def test_every_guide_has_its_own_page(name):
    page = DOCS / "guide" / f"{name}.html"
    assert page.is_file(), f"no static page for docs/guides/{name}.md"
    text = page.read_text(encoding="utf-8")
    assert canonical(page) == f"https://arckit.org/guide/{name}.html"
    assert "<title>Guide Viewer" not in text
    assert 'class="app-markdown"' in text and "Loading guide" not in text


@pytest.mark.parametrize("slug", listed_slugs())
def test_every_listed_article_has_its_own_page(slug):
    page = DOCS / "share" / f"{slug}.html"
    assert page.is_file(), f"no static page for the {slug} card"
    text = page.read_text(encoding="utf-8")
    # The share URL social posts link to is now the article itself, not a redirect.
    assert canonical(page) == f"https://arckit.org/share/{slug}.html"
    assert 'http-equiv="refresh"' not in text and "location.replace" not in text
    assert '<article id="content" class="app-markdown">' in text


def test_viewers_only_redirect():
    guide = (DOCS / "guide-viewer.html").read_text(encoding="utf-8")
    article = (DOCS / "article-viewer.html").read_text(encoding="utf-8")
    assert "location.replace('guide/' + guide + '.html'" in guide
    assert "'share/' + slug + '.html'" in article
    for text in (guide, article):
        assert "marked.min.js" not in text and "raw.githubusercontent.com" not in text


def test_sitemap_lists_pages_not_viewers():
    sitemap = (DOCS / "sitemap.xml").read_text(encoding="utf-8")
    assert "guide-viewer.html" not in sitemap and "article-viewer.html" not in sitemap
    assert "<loc>https://arckit.org/guide/risk.html</loc>" in sitemap
    for slug in listed_slugs():
        assert f"<loc>https://arckit.org/share/{slug}.html</loc>" in sitemap


def test_fde_panel_is_site_only():
    # The offer is added to the web page; the guide itself also ships in the
    # plugins and the CLI, where it must not appear.
    assert "app-fde-panel" in (DOCS / "guide" / "risk.html").read_text(encoding="utf-8")
    for guide in (DOCS / "guides" / "risk.md", REPO / "plugins/arckit-claude/docs/guides/risk.md"):
        assert "ArcKit FDE" not in guide.read_text(encoding="utf-8")


@pytest.mark.parametrize(
    "kind,out,source,url,attr,expected",
    [
        # Guides are written for GitHub: links resolve against the guide's folder.
        ("guide", "guide/risk.html", "docs/guides/risk.md", "requirements.md#inputs", "href", "requirements.html#inputs"),
        ("guide", "guide/roles/ba.html", "docs/guides/roles/ba.md", "../requirements.md", "href", "../requirements.html"),
        ("guide", "guide/risk.html", "docs/guides/risk.md", "../../plugins/arckit-claude/commands/risk.md", "href",
         "https://github.com/tractorjuice/arc-kit/blob/main/plugins/arckit-claude/commands/risk.md"),
        # Articles were written for the viewer at the site root.
        ("article", "share/a.html", "docs/articles/a.md", "article-viewer.html?a=b&utm_source=x", "href", "b.html?utm_source=x"),
        ("article", "share/a.html", "docs/articles/a.md", "article-viewer.html?a=b-medium", "href", "b.html"),
        ("article", "share/a.html", "docs/articles/a.md", "guide-viewer.html?guide=risk", "href", "../guide/risk.html"),
        ("article", "share/a.html", "docs/articles/a.md", "https://arckit.org/guides.html", "href", "../guides.html"),
        ("article", "share/a.html", "docs/articles/a.md", "diagrams/x.png", "src", "../articles/diagrams/x.png"),
        ("article", "share/a.html", "docs/articles/a.md", "https://example.org/x", "href", "https://example.org/x"),
        ("article", "share/a.html", "docs/articles/a.md", "#heading", "href", "#heading"),
    ],
)
def test_links_point_at_static_pages(kind, out, source, url, attr, expected):
    gen = load_generator()
    site = gen.Site(guides=frozenset({"risk", "requirements"}), articles=frozenset({"a", "b"}))
    assert gen.rewrite_url(url, attr, gen.Page(kind, out, source), site) == expected


def test_heading_ids_match_github():
    gen = load_generator()
    body = gen.add_heading_ids("<h2>Orange Book 4Ts: Risk Responses</h2>\n<h2>Inputs</h2>\n<h2>Inputs</h2>")
    assert '<h2 id="orange-book-4ts-risk-responses">' in body
    assert '<h2 id="inputs">' in body and '<h2 id="inputs-1">' in body
