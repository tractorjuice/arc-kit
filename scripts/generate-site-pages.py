#!/usr/bin/env python3
# /// script
# requires-python = ">=3.11"
# dependencies = ["markdown-it-py==4.0.0", "linkify-it-py==2.0.3"]
# ///
"""Publish every guide and every listed article as a static page search engines can read.

`docs/guide-viewer.html` and `docs/article-viewer.html` used to fetch a guide
or article's Markdown in the browser and render it with JavaScript. A crawler
therefore got the same empty shell for every guide, titled "Guide Viewer -
ArcKit" with the canonical URL guide-viewer.html, and the same for every
article. Google saw two pages where ArcKit has about 290: on 18 October 2026
arckit.org ranked in Google UK for three keywords, all spellings of its name.

This script renders the Markdown when the site is built and writes:

  docs/guide/<name>.html   one page per docs/guides/**/*.md
  docs/share/<slug>.html   one page per article card on docs/articles.html,
                           at the URL social posts already link to
  docs/sitemap.xml         the entries between the site-pages markers

Each page has its own title, description, canonical URL, preview tags,
structured data, and the text itself in the HTML. The two viewers are the
templates: the parts between their <!-- page:* --> markers are filled in and
the <!-- viewer-only --> parts dropped. In the browser the viewers now only
forward old ?guide= and ?a= links to these pages.

    uv run scripts/generate-site-pages.py          # write the pages
    uv run scripts/generate-site-pages.py --check  # exit 1 if any page is stale

Plain `python3` works when the two pinned packages are installed. The versions
are pinned here and in .github/workflows/python-tests.yml because --check
compares bytes. Run it after editing a guide, an article or its card on
docs/articles.html, docs/assets/guide-films.json, or either viewer.
"""

from __future__ import annotations

import argparse
import html
import json
import posixpath
import re
import subprocess
import sys
from dataclasses import dataclass
from pathlib import Path
from urllib.parse import parse_qsl, urlencode, urlsplit

MARKDOWN_IT_VERSION = "4.0.0"

try:
    import markdown_it
    from markdown_it import MarkdownIt
except ImportError:
    sys.exit("markdown-it-py is not installed. Run: uv run scripts/generate-site-pages.py")

REPO = Path(__file__).resolve().parents[1]
DOCS = REPO / "docs"
GUIDES = DOCS / "guides"
GUIDE_OUT = DOCS / "guide"
SHARE_OUT = DOCS / "share"
ARTICLES = DOCS / "articles"
LISTING = DOCS / "articles.html"
FILMS = DOCS / "assets" / "guide-films.json"
SITEMAP = DOCS / "sitemap.xml"
GUIDE_TEMPLATE = DOCS / "guide-viewer.html"
ARTICLE_TEMPLATE = DOCS / "article-viewer.html"

SITE = "https://arckit.org"
REPO_BLOB = "https://github.com/tractorjuice/arc-kit/blob/main/"
DEFAULT_IMAGE = f"{SITE}/og-image.png"

# Site-only additions for the guides UK public sector teams search for
# (OpenSEO keyword research, 18 October 2026). `title` replaces the guide's
# H1 in the page title and preview cards; `fde` adds the ArcKit FDE panel.
# They live here, not in the guide, because docs/guides/ also ships inside the
# plugins and the CLI, where an offer for a paid service does not belong.
GUIDE_EXTRAS: dict[str, dict] = {
    "risk": {"title": "Orange Book risk register: template and playbook", "fde": True},
    "traceability": {"title": "Requirements traceability matrix guide", "fde": True},
    "stakeholders": {"title": "Stakeholder map and analysis playbook", "fde": True},
    "principles": {"title": "Architecture principles playbook", "fde": True},
    "requirements": {"fde": True},
    "sobc": {"title": "Green Book business case (SOBC) playbook", "fde": True},
    "tcop": {"title": "Technology Code of Practice (TCoP) review guide", "fde": True},
    "service-assessment": {"title": "GDS Service Standard assessment preparation", "fde": True},
}

FDE_PANEL = (
    '<div class="govuk-inset-text app-fde-panel">\n'
    '<p class="govuk-body"><strong>Heading into a gate, a procurement or a board?</strong> '
    "ArcKit FDE puts a senior architect in your team for five days to produce your "
    "principles, requirements, risk register and stakeholder map, at a fixed price. "
    '<a class="govuk-link" href="{href}">See how ArcKit FDE works</a>.</p>\n'
    "</div>\n"
)

SITEMAP_START = "<!-- site-pages:start (scripts/generate-site-pages.py) -->"
SITEMAP_END = "<!-- site-pages:end -->"

MONTHS = ["January", "February", "March", "April", "May", "June", "July",
          "August", "September", "October", "November", "December"]

MD = MarkdownIt("commonmark", {"html": True, "linkify": True}).enable(["table", "strikethrough", "linkify"])

CARD_RE = re.compile(r'<article class="app-article-card">(.*?)</article>', re.S)
CARD_SLUG_RE = re.compile(r'href="(?:article-viewer\.html\?a=|share/)([A-Za-z0-9_-]+)(?:\.html)?"')
CARD_IMG_RE = re.compile(r'<img src="([^"]+)"(?:\s+alt="([^"]*)")?')
CARD_TITLE_RE = re.compile(r'app-article-card__title">(.*?)</h2>', re.S)
CARD_SUMMARY_RE = re.compile(r'app-article-card__summary">(.*?)</p>', re.S)

ATTR_RE = re.compile(r'\b(href|src)="([^"]*)"')
SCHEME_RE = re.compile(r"^[A-Za-z][A-Za-z0-9+.-]*:")
HEADING_RE = re.compile(r"<h([2-6])>(.*?)</h\1>", re.S)
LIST_START_RE = re.compile(r"^([-*+]|\d+[.)])\s")
SKIP_PREFIXES = ("#", "!", "---", ">", "|", "<", "```", "[!")


def esc(value: str) -> str:
    return html.escape(value, quote=True)


def strip_tags(fragment: str) -> str:
    return " ".join(html.unescape(re.sub(r"<[^>]+>", "", fragment)).split())


def plain(markdown_text: str) -> str:
    """Inline Markdown to plain text: `**x**` and `[x](y)` both become x."""
    return strip_tags(MD.renderInline(" ".join(markdown_text.split())))


def clip(text: str, limit: int) -> str:
    if len(text) <= limit:
        return text
    return text[: limit - 1].rsplit(" ", 1)[0].rstrip(",;:.—-") + "…"


def first_heading(md: str) -> str:
    m = re.search(r"^#\s+(.+?)\s*#*\s*$", md, re.M)
    return plain(m.group(1)) if m else ""


def first_paragraph(md: str) -> str:
    """The first prose paragraph, skipping headings, quotes, tables, lists and rules."""
    for chunk in re.split(r"\n\s*\n", md):
        chunk = chunk.strip()
        if not chunk or chunk.startswith(SKIP_PREFIXES) or LIST_START_RE.match(chunk):
            continue
        return plain(chunk)
    return ""


def slugify(heading_html: str) -> str:
    """GitHub's heading anchor: lower case, punctuation dropped, spaces to hyphens."""
    text = strip_tags(heading_html).lower()
    return re.sub(r"[^\w\- ]", "", text).replace(" ", "-")


def add_heading_ids(body: str) -> str:
    seen: dict[str, int] = {}

    def repl(m: re.Match) -> str:
        base = slugify(m.group(2)) or "section"
        n = seen.get(base, 0)
        seen[base] = n + 1
        anchor = base if n == 0 else f"{base}-{n}"
        return f'<h{m.group(1)} id="{anchor}">{m.group(2)}</h{m.group(1)}>'

    return HEADING_RE.sub(repl, body)


@dataclass(frozen=True)
class Page:
    kind: str    # "guide" or "article"
    out: str     # site path of the page, e.g. "guide/risk.html"
    source: str  # repo path of its Markdown, e.g. "docs/guides/risk.md"


@dataclass(frozen=True)
class Site:
    guides: frozenset[str]   # guide names, e.g. "risk", "roles/enterprise-architect"
    articles: frozenset[str]  # listed article slugs


def listed_slug(slug: str, site: Site) -> str:
    """The listed article a slug names. A -medium or -linkedin copy, written for
    that channel and never carded, resolves to the article it was cut from."""
    if slug in site.articles:
        return slug
    base = re.sub(r"-(medium|linkedin)$", "", slug)
    return base if base in site.articles else ""


def site_target(site_path: str, query: str, site: Site) -> tuple[str, str]:
    """Map a link inside the site to its static page, if it has one."""
    params = parse_qsl(query, keep_blank_values=True)
    if site_path == "guide-viewer.html":
        name = dict(params).get("guide", "")
        if name in site.guides:
            return f"guide/{name}.html", ""
    if site_path == "article-viewer.html":
        slug = listed_slug(dict(params).get("a", ""), site)
        if slug:
            return f"share/{slug}.html", urlencode([(k, v) for k, v in params if k != "a"])
    if site_path.startswith("guides/") and site_path.endswith(".md"):
        name = site_path[len("guides/"):-len(".md")]
        if name in site.guides:
            return f"guide/{name}.html", query
    if site_path.startswith("articles/") and site_path.endswith(".md"):
        slug = listed_slug(site_path[len("articles/"):-len(".md")], site)
        if slug:
            return f"share/{slug}.html", query
    return site_path, query


def rewrite_url(url: str, attr: str, page: Page, site: Site) -> str:
    """Point a link or image in a guide or article at the right place from its static page.

    Guides are written for GitHub, so a relative link resolves against the
    guide's own folder. Articles were written for the viewer at the site root,
    so their links resolve against docs/ and their images against docs/articles/.
    A link to anywhere else in the repo goes to the file on GitHub.
    """
    if not url or url.startswith("#"):
        return url
    parts = urlsplit(url)
    if parts.scheme or url.startswith("//"):
        if parts.scheme in ("http", "https") and parts.netloc.lower() in ("arckit.org", "www.arckit.org"):
            repo_path = "docs/" + (parts.path.lstrip("/") or "index.html")
        else:
            return url
    elif url.startswith("/"):
        repo_path = "docs/" + parts.path.lstrip("/")
    else:
        if page.kind == "guide":
            base = posixpath.dirname(page.source)
        elif attr == "src" and not parts.path.startswith("articles/"):
            base = "docs/articles"
        else:
            base = "docs"
        repo_path = posixpath.normpath(posixpath.join(base, parts.path)) if parts.path else page.source
    if repo_path.startswith("../"):
        return url
    query, fragment = parts.query, parts.fragment
    if not repo_path.startswith("docs/"):
        target = REPO_BLOB + repo_path
    else:
        site_path, query = site_target(repo_path[len("docs/"):], query, site)
        target = posixpath.relpath(site_path, posixpath.dirname(page.out))
    return target + (f"?{query}" if query else "") + (f"#{fragment}" if fragment else "")


def render_body(md: str, page: Page, site: Site) -> str:
    body = MD.render(md)
    body = re.sub(r"<h1>.*?</h1>\n?", "", body, count=1, flags=re.S)  # the hero shows it
    body = add_heading_ids(body)
    return ATTR_RE.sub(lambda m: f'{m.group(1)}="{esc(rewrite_url(html.unescape(m.group(2)), m.group(1), page, site))}"', body)


def prefix_template(template: str, depth: int) -> str:
    """Make the template's relative links work from a page `depth` folders down."""
    if not depth:
        return template
    up = "../" * depth

    def repl(m: re.Match) -> str:
        url = m.group(2)
        if not url or url.startswith(("#", "/")) or SCHEME_RE.match(url):
            return m.group(0)
        return f'{m.group(1)}="{up}{url}"'

    return ATTR_RE.sub(repl, template)


def block_re(name: str) -> re.Pattern:
    return re.compile(rf"<!-- {re.escape(name)} -->.*?<!-- /{re.escape(name)} -->", re.S)


def load_template(path: Path) -> str:
    text = path.read_text(encoding="utf-8")
    text = re.sub(r"[ \t]*<!-- viewer-only -->.*?<!-- /viewer-only -->\n?", "", text, flags=re.S)
    for name in ("page:meta", "page:jsonld", "page:hero", "page:body"):
        if len(block_re(name).findall(text)) != 1:
            sys.exit(f"{path.relative_to(REPO)}: needs exactly one <!-- {name} --> ... <!-- /{name} --> block")
    return text


def fill(template: str, depth: int, parts: dict[str, str], source: str) -> str:
    text = prefix_template(template, depth)
    for name, value in parts.items():
        text = block_re(name).sub(lambda _m, v=value: v, text, count=1)
    note = f"<!-- Generated by scripts/generate-site-pages.py from {source}. Do not edit. -->\n"
    return text.replace("<!DOCTYPE html>\n", "<!DOCTYPE html>\n" + note, 1)


def meta_block(title: str, description: str, preview: str, url: str, image: str, image_alt: str = "") -> str:
    page_title = title if "ArcKit" in title else f"{title} | ArcKit"
    lines = [
        f'<meta name="description" content="{esc(description)}">',
        '<meta name="author" content="ArcKit">',
        f"<title>{esc(page_title)}</title>",
        f'<meta property="og:title" content="{esc(title)}">',
        f'<meta property="og:description" content="{esc(preview)}">',
        '<meta property="og:type" content="article">',
        f'<meta property="og:url" content="{esc(url)}">',
        '<meta property="og:site_name" content="ArcKit">',
        f'<meta property="og:image" content="{esc(image)}">',
    ]
    if image_alt:
        lines.append(f'<meta property="og:image:alt" content="{esc(image_alt)}">')
    lines += [
        '<meta name="twitter:card" content="summary_large_image">',
        f'<meta name="twitter:title" content="{esc(title)}">',
        f'<meta name="twitter:description" content="{esc(preview)}">',
        f'<meta name="twitter:image" content="{esc(image)}">',
        f'<link rel="canonical" href="{esc(url)}">',
    ]
    return "\n    ".join(lines)


def jsonld_block(graph: list[dict]) -> str:
    data = json.dumps({"@context": "https://schema.org", "@graph": graph}, indent=4, ensure_ascii=False)
    data = data.replace("</", "<\\/")
    return '<script type="application/ld+json">\n' + "\n".join("    " + line for line in data.splitlines()) + "\n    </script>"


def breadcrumb(section: str, section_url: str, title: str, url: str) -> dict:
    return {
        "@type": "BreadcrumbList",
        "itemListElement": [
            {"@type": "ListItem", "position": 1, "name": "Home", "item": f"{SITE}/"},
            {"@type": "ListItem", "position": 2, "name": section, "item": f"{SITE}/{section_url}"},
            {"@type": "ListItem", "position": 3, "name": title, "item": url},
        ],
    }


ARCKIT = {"@type": "Organization", "name": "ArcKit", "url": SITE}


def hero_block(stat: str, title: str, description: str) -> str:
    out = (f'<span class="app-page-hero__stat">{esc(stat)}</span>\n'
           f'            <h1 class="app-page-hero__title">{esc(title)}</h1>')
    if description:
        out += f'\n            <p class="app-page-hero__description">{esc(description)}</p>'
    return out


def films_block(films: list[dict]) -> str:
    cards = []
    for film in films:
        fid, label = esc(film["id"]), esc(film["label"])
        cards.append(
            '<div class="app-film">\n'
            f'<button type="button" class="app-film__play" data-film="{fid}" data-label="{label}" aria-label="Play {label}">'
            f'<span class="app-film__icon" aria-hidden="true">▶</span><span>{label}</span></button>\n'
            '<p class="govuk-body-s app-film__note">A short AI-narrated film with English captions. '
            'Pressing play loads the YouTube player. '
            f'<a class="govuk-link" href="https://youtu.be/{fid}" target="_blank" rel="noopener">Watch on YouTube</a></p>\n'
            "</div>"
        )
    return '<div id="films" class="app-films">\n' + "\n".join(cards) + "\n</div>"


def with_fde_panel(body: str, root: str) -> str:
    """Place the FDE panel after the guide's opening paragraph (before its first rule)."""
    panel = FDE_PANEL.format(href=f"{root}fde/")
    at = body.find("<hr />")
    if at == -1:
        at = body.find("</p>\n") + len("</p>\n") if "</p>\n" in body else 0
    return body[:at] + panel + body[at:]


def guide_pages(site: Site) -> dict[Path, str]:
    template = load_template(GUIDE_TEMPLATE)
    films = json.loads(FILMS.read_text(encoding="utf-8"))
    pages: dict[Path, str] = {}
    for name in sorted(site.guides):
        source = f"docs/guides/{name}.md"
        md = (REPO / source).read_text(encoding="utf-8")
        page = Page("guide", f"guide/{name}.html", source)
        depth = page.out.count("/")
        root = "../" * depth
        url = f"{SITE}/{page.out}"
        extras = GUIDE_EXTRAS.get(name, {})
        heading = first_heading(md) or name
        title = extras.get("title", heading)
        lead = first_paragraph(md) or heading
        is_role = name.startswith("roles/")
        section, section_url = ("Roles", "roles.html") if is_role else ("Guides", "guides.html")

        body = render_body(md, page, site)
        if extras.get("fde"):
            body = with_fde_panel(body, root)
        content = [f'<a href="{root}{section_url}" class="govuk-back-link govuk-!-margin-bottom-6">Back to {section}</a>']
        if films.get(name):
            content.append(films_block(films[name]))
        content.append(f'<div id="content" class="app-markdown">\n{body}</div>')
        if films.get(name):
            content.append(f'<script src="{root}films.js"></script>')

        pages[GUIDE_OUT / f"{name}.html"] = fill(template, depth, {
            "page:meta": meta_block(title, clip(lead, 155), clip(lead, 220), url, DEFAULT_IMAGE),
            "page:jsonld": jsonld_block([
                {"@type": "TechArticle", "@id": url, "headline": title, "description": clip(lead, 220),
                 "url": url, "inLanguage": "en-GB", "author": ARCKIT, "publisher": ARCKIT,
                 "isPartOf": {"@type": "WebSite", "name": "ArcKit", "url": SITE}},
                breadcrumb(section, section_url, title, url),
            ]),
            "page:hero": hero_block("Role guide" if is_role else "Guide", heading, clip(lead, 220)),
            "page:body": "\n".join(content),
        }, source)
    return pages


def tracked_articles() -> set[str]:
    out = subprocess.run(["git", "ls-files", "--", "docs/articles"], cwd=REPO,
                         capture_output=True, text=True, check=True).stdout
    return set(out.split())


def cards() -> list[dict[str, str]]:
    found = []
    for block in CARD_RE.findall(LISTING.read_text(encoding="utf-8")):
        slug, title = CARD_SLUG_RE.search(block), CARD_TITLE_RE.search(block)
        if not slug or not title:
            continue
        img, summary = CARD_IMG_RE.search(block), CARD_SUMMARY_RE.search(block)
        found.append({
            "slug": slug.group(1),
            "title": strip_tags(title.group(1)),
            "summary": strip_tags(summary.group(1)) if summary else "",
            "image": img.group(1) if img else "",
            "alt": strip_tags(img.group(2) or "") if img else "",
        })
    return found


def article_pages(site: Site, listed: list[dict[str, str]]) -> dict[Path, str]:
    template = load_template(ARTICLE_TEMPLATE)
    tracked = tracked_articles()
    pages: dict[Path, str] = {}
    for card in listed:
        slug = card["slug"]
        source = f"docs/articles/{slug}.md"
        md = (REPO / source).read_text(encoding="utf-8")
        page = Page("article", f"share/{slug}.html", source)
        url = f"{SITE}/{page.out}"
        heading = first_heading(md) or card["title"]
        lead = first_paragraph(md)
        summary = card["summary"] or lead

        hero = card["image"] if card["image"] and not card["image"].endswith(".svg") else ""
        if not hero and f"docs/articles/{slug}-hero.png" in tracked:
            hero = f"articles/{slug}-hero.png"
        image = f"{SITE}/{hero}" if hero else DEFAULT_IMAGE
        alt = card["alt"] or card["title"]

        content = ['<a href="../articles.html" class="govuk-back-link govuk-!-margin-bottom-6">Back to Articles</a>']
        if hero:
            content.append(f'<img class="app-article-hero-img" src="../{esc(hero)}" alt="{esc(alt)}">')
        graph = {"@type": "Article", "@id": url, "headline": card["title"], "description": clip(summary, 300),
                 "url": url, "image": image, "inLanguage": "en-GB", "author": ARCKIT, "publisher": ARCKIT,
                 "isPartOf": {"@type": "WebSite", "name": "ArcKit", "url": SITE}}
        date = re.match(r"^(\d{4})-(\d{2})-(\d{2})-", slug)
        stat = "Articles"
        if date:
            y, m, d = date.groups()
            stat = f"{int(d)} {MONTHS[int(m) - 1]} {y}"
            graph["datePublished"] = f"{y}-{m}-{d}"
            content.append(f'<div class="app-article-meta"><span class="app-article-meta__date">{stat}</span></div>')
        content.append(f'<article id="content" class="app-markdown">\n{render_body(md, page, site)}</article>')

        pages[SHARE_OUT / f"{slug}.html"] = fill(template, 1, {
            "page:meta": meta_block(card["title"], clip(summary, 155), summary, url, image, alt if hero else ""),
            "page:jsonld": jsonld_block([graph, breadcrumb("Articles", "articles.html", card["title"], url)]),
            "page:hero": hero_block(stat, heading, clip(lead, 220)),
            "page:body": "\n".join(content),
        }, source)
    return pages


def sitemap_text(current: str, site: Site, listed: list[dict[str, str]]) -> str:
    entries = []
    for name in sorted(site.guides):
        entries.append((f"{SITE}/guide/{name}.html", None, "monthly", "0.7" if name in GUIDE_EXTRAS else "0.6"))
    for card in sorted(listed, key=lambda c: c["slug"]):
        date = re.match(r"^(\d{4}-\d{2}-\d{2})-", card["slug"])
        entries.append((f"{SITE}/share/{card['slug']}.html", date.group(1) if date else None, "yearly", "0.6"))
    lines = [SITEMAP_START]
    for loc, lastmod, freq, priority in entries:
        lines.append("    <url>")
        lines.append(f"        <loc>{esc(loc)}</loc>")
        if lastmod:
            lines.append(f"        <lastmod>{lastmod}</lastmod>")
        lines.append(f"        <changefreq>{freq}</changefreq>")
        lines.append(f"        <priority>{priority}</priority>")
        lines.append("    </url>")
    lines.append("    " + SITEMAP_END)
    pattern = re.compile(re.escape(SITEMAP_START) + r".*?" + re.escape(SITEMAP_END), re.S)
    if not pattern.search(current):
        sys.exit(f"docs/sitemap.xml: missing the {SITEMAP_START} ... {SITEMAP_END} block")
    return pattern.sub(lambda _m: "\n".join(lines), current, count=1)


def build() -> tuple[dict[Path, str], str, Site]:
    listed = cards()
    site = Site(
        guides=frozenset(str(p.relative_to(GUIDES).with_suffix("")) for p in GUIDES.rglob("*.md")),
        articles=frozenset(c["slug"] for c in listed),
    )
    missing = sorted(c["slug"] for c in listed if not (ARTICLES / f"{c['slug']}.md").is_file())
    if missing:
        sys.exit("Cards on docs/articles.html with no docs/articles/<slug>.md: " + ", ".join(missing))
    pages = {**guide_pages(site), **article_pages(site, listed)}
    return pages, sitemap_text(SITEMAP.read_text(encoding="utf-8"), site, listed), site


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__.split("\n\n")[0])
    parser.add_argument("--check", action="store_true", help="report stale pages and exit 1 instead of writing")
    args = parser.parse_args()

    if markdown_it.__version__ != MARKDOWN_IT_VERSION:
        print(f"markdown-it-py {markdown_it.__version__} is installed; pages are built with {MARKDOWN_IT_VERSION}.\n"
              "Run: uv run scripts/generate-site-pages.py" + (" --check" if args.check else ""))
        return 1

    pages, sitemap, site = build()
    existing = set(GUIDE_OUT.rglob("*.html")) | set(SHARE_OUT.glob("*.html"))
    problems, written = [], 0

    for path, content in sorted(pages.items()):
        if path.is_file() and path.read_text(encoding="utf-8") == content:
            continue
        rel = path.relative_to(REPO)
        if args.check:
            problems.append(f"{'stale' if path.exists() else 'missing'}: {rel}")
        else:
            path.parent.mkdir(parents=True, exist_ok=True)
            path.write_text(content, encoding="utf-8")
            written += 1
    for path in sorted(existing - set(pages)):
        if args.check:
            problems.append(f"orphan (no guide or article card): {path.relative_to(REPO)}")
        else:
            path.unlink()
            written += 1
    if SITEMAP.read_text(encoding="utf-8") != sitemap:
        if args.check:
            problems.append("stale: docs/sitemap.xml")
        else:
            SITEMAP.write_text(sitemap, encoding="utf-8")
            written += 1

    if problems:
        print("Site pages are out of date. Run: uv run scripts/generate-site-pages.py")
        for problem in problems:
            print(f"  ✗ {problem}")
        return 1
    summary = f"{len(site.guides)} guides, {len(site.articles)} articles"
    print(f"Site pages OK ({summary})." if args.check else f"Site pages written ({summary}; {written} file(s) changed).")
    return 0


if __name__ == "__main__":
    sys.exit(main())
