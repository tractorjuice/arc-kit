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

import hashlib
import html
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
    # A reference page the main guide covers in full names that guide's page instead.
    covered_by = load_generator().GUIDE_EXTRAS.get(name, {}).get("canonical", name)
    assert canonical(page) == f"https://arckit.org/guide/{covered_by}.html"
    assert "<title>Guide Viewer" not in text
    assert 'class="app-markdown"' in text and "Loading guide" not in text
    assert f'<link rel="alternate" type="text/markdown" href="https://arckit.org/guides/{name}.md">' in text


@pytest.mark.parametrize("slug", listed_slugs())
def test_every_listed_article_has_its_own_page(slug):
    page = DOCS / "share" / f"{slug}.html"
    assert page.is_file(), f"no static page for the {slug} card"
    text = page.read_text(encoding="utf-8")
    # The share URL social posts link to is now the article itself, not a redirect.
    assert canonical(page) == f"https://arckit.org/share/{slug}.html"
    assert 'http-equiv="refresh"' not in text and "location.replace" not in text
    assert '<article id="content" class="app-markdown">' in text
    assert f'<link rel="alternate" type="text/markdown" href="https://arckit.org/articles/{slug}.md">' in text


def test_llms_txt_lists_the_service_and_links_markdown():
    # llms.txt is how AI assistants learn what ArcKit offers: it names the
    # FDE service, and its article links are the Markdown, like its guide links.
    llms = (DOCS / "llms.txt").read_text(encoding="utf-8")
    assert "## Expert help" in llms and "(https://arckit.org/fde/)" in llms
    for slug in re.findall(r"https://arckit\.org/articles/([A-Za-z0-9_-]+)\.md", llms):
        assert (DOCS / "articles" / f"{slug}.md").is_file(), f"llms.txt links a missing article: {slug}"
    assert "article-viewer.html" not in llms and "arckit.org/share/" not in llms


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


def test_sitemap_lists_every_public_page():
    # Every page a search engine should index is in the sitemap. The viewers only
    # redirect, a credential page is noindex, and a page whose canonical URL is
    # elsewhere is a copy of that page.
    gen = load_generator()
    listed = set(re.findall(r"<loc>https://arckit\.org/([^<]*)</loc>", (DOCS / "sitemap.xml").read_text(encoding="utf-8")))
    missing = []
    for name in sorted(gen.tracked_files()):
        page = REPO / name
        if not name.startswith("docs/") or page.suffix != ".html":
            continue
        rel = page.relative_to(DOCS).as_posix()
        urls = {rel, rel.removesuffix("index.html")}
        text = page.read_text(encoding="utf-8")
        canonical = re.search(r'rel="canonical" href="([^"]*)"', text)
        elsewhere = canonical and canonical.group(1).removeprefix("https://arckit.org/") not in urls
        redirects = 'http-equiv="refresh"' in text or "location.replace(" in text
        if not (urls & listed or elsewhere or redirects or 'content="noindex' in text):
            missing.append(rel)
    assert not missing, f"public pages missing from docs/sitemap.xml: {missing}"


def test_sitemap_dates_follow_the_page_text(tmp_path):
    # A hand-written entry keeps its date while its page's text is unchanged and
    # is dated today once it changes. A menu or footer edit doesn't count.
    gen = load_generator()
    pages = []
    for nav, text in (("x", "Risk register"), ("y", "Risk  register"), ("x", "Risk register, updated")):
        pages.append(tmp_path / f"{len(pages)}.html")
        pages[-1].write_text(f'<nav><a href="{nav}">FDE</a></nav><main><p>{text}</p></main><footer>{nav}</footer>',
                             encoding="utf-8")
    assert gen.page_text(pages[0]) == gen.page_text(pages[1]) != gen.page_text(pages[2])

    head = "<url>\n        <loc>https://arckit.org/roles.html</loc>\n        <changefreq>monthly</changefreq>\n"
    fingerprint = hashlib.sha256(gen.page_text(DOCS / "roles.html").encode("utf-8")).hexdigest()
    kept, _, changed = gen.date_hand_entries(
        head, {"roles.html": {"lastmod": "2026-06-15", "text_sha256": fingerprint}}, "2030-01-01")
    assert "</loc>\n        <lastmod>2026-06-15</lastmod>\n        <changefreq>" in kept and not changed
    moved, record, changed = gen.date_hand_entries(
        head, {"roles.html": {"lastmod": "2026-06-15", "text_sha256": "old"}}, "2030-01-01")
    assert "<lastmod>2030-01-01</lastmod>" in moved and changed == ["docs/roles.html"]
    assert record["roles.html"] == {"lastmod": "2030-01-01", "text_sha256": fingerprint}


def test_fde_panel_is_site_only():
    # The offer is added to the web page; the guide itself also ships in the
    # plugins and the CLI, where it must not appear.
    assert "app-fde-panel" in (DOCS / "guide" / "risk.html").read_text(encoding="utf-8")
    for guide in (DOCS / "guides" / "risk.md", REPO / "plugins/arckit-claude/docs/guides/risk.md"):
        assert "ArcKit FDE" not in guide.read_text(encoding="utf-8")


def test_fde_lives_on_arckit_org():
    # The FDE pages moved here from their own GitHub Pages site, which a search
    # engine counted as a different domain. A link back to that site, or a
    # canonical URL naming it, would hand it the credit again.
    for page in ("", "architects.html", "samples/governance-pack.html"):
        text = (DOCS / "fde" / (page or "index.html")).read_text(encoding="utf-8")
        assert f'<link rel="canonical" href="https://arckit.org/fde/{page}">' in text
    assert "<loc>https://arckit.org/fde/</loc>" in (DOCS / "sitemap.xml").read_text(encoding="utf-8")
    stale = [str(p.relative_to(DOCS)) for p in DOCS.rglob("*")
             if p.suffix in {".html", ".md", ".txt", ".xml"}
             and "tractorjuice.github.io/arckit-fde" in p.read_text(encoding="utf-8")]
    assert not stale, f"links to the old FDE site: {stale}"


def test_linkedin_icon_opens_the_arckit_page():
    # The LinkedIn icon in every page's top bar opens ArcKit's LinkedIn page.
    # The group has links of its own that say so, and
    # linkedin.com/company/arckit is a different company.
    icon = re.compile(r'<a href="([^"]*linkedin[^"]*)"[^>]*class="app-icon-link"')
    wrong = {}
    for page in DOCS.rglob("*.html"):
        for href in icon.findall(page.read_text(encoding="utf-8")):
            if href != "https://www.linkedin.com/company/arckit-org/":
                wrong[str(page.relative_to(DOCS))] = href
    assert not wrong, f"LinkedIn icons that don't open the ArcKit page: {wrong}"
    assert icon.search((DOCS / "guide" / "risk.html").read_text(encoding="utf-8"))


@pytest.mark.parametrize(
    "kind,out,source,url,attr,expected",
    [
        # Guides are written for GitHub: links resolve against the guide's folder.
        ("guide", "guide/risk.html", "docs/guides/risk.md", "requirements.md#inputs", "href", "requirements.html#inputs"),
        ("guide", "guide/roles/ba.html", "docs/guides/roles/ba.md", "../requirements.md", "href", "../requirements.html"),
        ("guide", "guide/risk.html", "docs/guides/risk.md", "../../plugins/arckit-claude/commands/risk.md", "href",
         "https://github.com/tractorjuice/arc-kit/blob/main/plugins/arckit-claude/commands/risk.md"),
        # Markdown in docs/ with no page of its own: the site would serve it raw.
        ("guide", "guide/start.html", "docs/guides/start.md", "../WORKFLOW-DIAGRAMS.md", "href",
         "https://github.com/tractorjuice/arc-kit/blob/main/docs/WORKFLOW-DIAGRAMS.md"),
        ("article", "share/a.html", "docs/articles/a.md", "articles/unlisted.md", "href",
         "https://github.com/tractorjuice/arc-kit/blob/main/docs/articles/unlisted.md"),
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


def test_links_to_files_not_in_git_are_reported():
    # The site and GitHub serve only committed files. Two articles linked four
    # diagrams that were never committed, and guides linked the pre-plugins/ layout.
    gen = load_generator()
    page = gen.REPO / "docs" / "share" / "a.html"
    text = ('<img src="../articles/diagrams/x.png"><a href="../guides.html#top">guides</a>'
            '<a href="b.html">b</a><a href="../fde/">fde</a><a href="https://example.org/">x</a>'
            '<a href="https://github.com/tractorjuice/arc-kit/blob/main/arckit-claude/README.md">old</a>')
    broken = gen.broken_links({page: text, gen.REPO / "docs" / "share" / "b.html": ""},
                              {"docs/guides.html", "docs/fde/index.html"})
    assert broken == [
        "docs/share/a.html: ../articles/diagrams/x.png",
        "docs/share/a.html: https://github.com/tractorjuice/arc-kit/blob/main/arckit-claude/README.md",
    ]


@pytest.mark.parametrize("slug", listed_slugs())
def test_article_pages_show_each_image_once(slug):
    # The hero already shows the card image; an article that repeats it inline
    # would show the same picture twice.
    images = re.findall(r'<img[^>]+src="([^"]+)"', (DOCS / "share" / f"{slug}.html").read_text(encoding="utf-8"))
    repeated = sorted({src for src in images if images.count(src) > 1})
    assert not repeated, f"{slug} shows the same image more than once: {repeated}"


def test_heading_ids_match_github():
    gen = load_generator()
    body = gen.add_heading_ids("<h2>Orange Book 4Ts: Risk Responses</h2>\n<h2>Inputs</h2>\n<h2>Inputs</h2>")
    assert '<h2 id="orange-book-4ts-risk-responses">' in body
    assert '<h2 id="inputs">' in body and '<h2 id="inputs-1">' in body


def site_pages() -> list[Path]:
    return sorted((DOCS / "guide").rglob("*.html")) + sorted((DOCS / "share").glob("*.html"))


def test_mermaid_blocks_become_diagrams():
    # Neither viewer loaded Mermaid, so every ```mermaid block showed as code.
    gen = load_generator()
    site = gen.Site(guides=frozenset(), articles=frozenset())
    page = gen.Page("guide", "guide/roles/x.html", "docs/guides/roles/x.md")
    body = gen.render_body("# X\n\n```mermaid\ngraph TD\n    A --> B\n```\n\n```text\nA --> B\n```\n", page, site)
    assert '<pre class="mermaid">graph TD\n    A --&gt; B\n</pre>' in body
    assert '<pre><code class="language-text">A --&gt; B\n</code></pre>' in body
    assert gen.diagram_scripts(body, "../../") == [gen.MERMAID_JS, '<script src="../../diagrams.js"></script>']
    assert gen.diagram_scripts("<pre><code>x</code></pre>", "../") == []


def test_pages_load_mermaid_only_with_a_diagram():
    # Mermaid is 3 MB, so only a page with a diagram loads it.
    for page in site_pages():
        text = page.read_text(encoding="utf-8")
        has_diagram = '<pre class="mermaid">' in text
        assert ("/mermaid.min.js" in text) == has_diagram, page.relative_to(REPO)
        assert ('diagrams.js"></script>' in text) == has_diagram, page.relative_to(REPO)
    assert (DOCS / "diagrams.js").is_file()


# The first statement of a Mermaid diagram names its type. A block without one,
# such as a `subgraph ... end` snippet that teaches the syntax, draws as a
# syntax error, so it belongs in a ```text fence.
MERMAID_TYPE = re.compile(
    r"(flowchart|graph|sequenceDiagram|classDiagram(-v2)?|stateDiagram(-v2)?|erDiagram|journey|gantt|pie|"
    r"quadrantChart|requirementDiagram|gitGraph|C4(Context|Container|Component|Dynamic|Deployment)|mindmap|"
    r"timeline|zenuml|sankey(-beta)?|xychart(-beta)?|block(-beta)?|packet(-beta)?|kanban|architecture-beta|"
    r"radar-beta|treemap(-beta)?|wardley-beta)\b"
)


def test_every_diagram_names_its_type():
    problems = []
    for page in site_pages():
        for source in re.findall(r'<pre class="mermaid">(.*?)</pre>', page.read_text(encoding="utf-8"), re.S):
            lines = [line.strip() for line in html.unescape(source).splitlines()]
            lines = [line for line in lines if line and not line.startswith("%%")]
            if lines and lines[0] == "---":  # front matter
                lines = lines[lines.index("---", 1) + 1:]
            if not lines or not MERMAID_TYPE.match(lines[0]):
                problems.append(f"{page.relative_to(REPO)}: {lines[0] if lines else '(empty)'}")
    assert not problems, "Mermaid blocks with no diagram type; fence them as ```text:\n  " + "\n  ".join(problems)


def test_on_github_lists_are_in_the_html():
    # The page used to draw its lists from on-github.json in the browser, so a
    # crawler saw the headings and nothing else (20 October 2026). Every repo the
    # data lists is now in the HTML, with the page's numbers and date.
    data = json.loads((DOCS / "on-github.json").read_text(encoding="utf-8"))
    page = (DOCS / "on-github.html").read_text(encoding="utf-8")
    main = re.search(r"<main\b.*?</main>", page, re.S).group(0)
    for name in ("using", "mentions", "threads", "commits"):
        missing = [r["repo"] for r in data[name] if f">{html.escape(r['repo'])}</" not in main]
        assert not missing, f"{name} rows not in docs/on-github.html: {missing[:5]}"
    assert f"{data['summary']['using']:,} public GitHub" in page
    assert '<div id="gh-content" hidden>' not in page and "Loading this week" not in page


def test_on_github_text_is_escaped_and_links_only_github():
    # Every value on the page is other people's text.
    gen = load_generator()
    data = {
        "week": "2026-10-26",
        "summary": {"using": 1, "artefacts": 1, "set_up": 0, "organisations": 0, "mentioning": 1, "issues_prs": 0,
                    "commit_repos": 0, "commits": 0, "hidden_rows": 2,
                    "new": {"using": 1, "mentioning": 0, "issues_prs": 0, "commit_repos": 0}},
        "history": [{"week": "2026-10-20", "using": 1, "organisations": 0, "mentioning": 1, "issues_prs": 0, "commit_repos": 0},
                    {"week": "2026-10-26", "using": 1, "organisations": 0, "mentioning": 1, "issues_prs": 0, "commit_repos": 0}],
        "using": [{"repo": "a/b", "url": "https://github.com/a/b", "owner_kind": "Person", "arc_files": 3, "projects": 1,
                   "doc_types": "REQ", "setup": "", "created": "2026-01-02", "last_push": "2026-10-01", "new": True,
                   "description": "<script>alert(1)</script>"}],
        "mentions": [{"repo": "c/d", "url": "javascript:alert(1)", "kind": "<b>Lists</b>", "where": "README",
                      "where_url": "https://evil.example/x", "stars": 1234, "last_push": "2026-10-01", "new": False,
                      "description": ""}],
        "threads": [],
        "commits": [],
    }
    blocks = gen.on_github_blocks(data)
    rendered = "\n".join(blocks.values())
    assert "<script>alert" not in rendered and "&lt;script&gt;alert(1)&lt;/script&gt;" in rendered
    assert "<b>Lists</b>" not in rendered and "javascript:" not in rendered and "evil.example" not in rendered
    assert '<span>c/d</span>' in blocks["rows-mentions"] and "1,234" in blocks["rows-mentions"]
    assert "2 entries are left off this page" in blocks["hidden"]
    assert "1 new this week" in blocks["stats"] and "New</strong>" in blocks["rows-using"]
    assert blocks["trend-note"].startswith("One chart per measure")
    assert blocks["updated"] == "Updated 26 October 2026"


def test_on_github_charts_start_on_the_next_monday():
    # The first search was run by hand on a Tuesday; the weekly one runs on Mondays.
    gen = load_generator()
    data = json.loads((DOCS / "on-github.json").read_text(encoding="utf-8"))
    for first, monday in (("2026-10-20", "26 October 2026"), ("2026-10-19", "26 October 2026"), ("2026-10-25", "26 October 2026")):
        data["history"] = [dict(data["history"][0], week=first)]
        assert gen.on_github_blocks(data)["trend-note"].endswith(f"on {monday}.")
