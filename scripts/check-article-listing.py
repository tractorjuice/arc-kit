#!/usr/bin/env python3
"""Every published article is listed on the site, and the home page shows the newest.

`docs/articles.html` and the "Latest writing" strip on `docs/index.html` are
hand-maintained HTML. Nothing derived them, so four articles (1–3 September
2026) shipped without a card and the home page's newest teaser sat at 19
August until a reader noticed. This guard holds:

  1. Every tracked `docs/articles/YYYY-MM-DD-<slug>.md` has a card on
     `docs/articles.html` (an `article-viewer.html?a=<slug>` link). Files
     ending `-medium` or `-linkedin` are channel variants and need no card
     of their own, though they may have one.
  2. Every listed article is a tracked file on disk, and the image its card
     points at, if any, is tracked by git (older heroes use free-form filenames; newer
     ones are `<slug>-hero.png`; a few early cards are text-only).
  3. `docs/index.html` shows exactly eight teasers, each for an article that
     is also on `docs/articles.html`, and the newest article by date prefix
     is among them.

Run from the repo root:  python3 scripts/check-article-listing.py
Exit 1 on any problem, listing each.
"""

from __future__ import annotations

import re
import subprocess
import sys
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[1]
ARTICLES = REPO_ROOT / "docs" / "articles"
LISTING = REPO_ROOT / "docs" / "articles.html"
HOME = REPO_ROOT / "docs" / "index.html"
TEASER_COUNT = 8
VARIANT_SUFFIXES = ("-medium", "-linkedin")
SLUG_RE = re.compile(r"^(\d{4}-\d{2}-\d{2})-.+$")


def tracked_files(pattern: str) -> set[str]:
    return set(subprocess.run(
        ["git", "ls-files", "--", pattern],
        cwd=REPO_ROOT, capture_output=True, text=True, check=True,
    ).stdout.split())


def tracked_slugs() -> tuple[list[str], list[str]]:
    """(articles that need a card, every tracked dated article incl. variants)."""
    out = sorted(tracked_files("docs/articles/*.md"))
    need_card, everything = [], []
    for path in out:
        stem = Path(path).stem
        if not SLUG_RE.match(stem):
            continue
        everything.append(stem)
        if not stem.endswith(VARIANT_SUFFIXES):
            need_card.append(stem)
    return sorted(need_card), sorted(everything)


def linked_slugs(html: str) -> list[str]:
    return re.findall(r'article-viewer\.html\?a=([A-Za-z0-9_-]+)', html)


def main() -> int:
    problems: list[str] = []
    ok: list[str] = []
    on_disk, tracked = tracked_slugs()
    listing = LISTING.read_text(encoding="utf-8")
    home = HOME.read_text(encoding="utf-8")
    listed = set(linked_slugs(listing))

    for slug in on_disk:
        if slug not in listed:
            problems.append(f"{slug}: no card on docs/articles.html")
    tracked_images = tracked_files("docs/articles/*.png") | tracked_files("docs/articles/*.svg") | tracked_files("docs/articles/*.jpg")
    cards = re.findall(r'<article class="app-article-card">.*?</article>', listing, flags=re.S)
    for block in cards:
        found = linked_slugs(block)
        if not found:
            problems.append("docs/articles.html: a card links to no article")
            continue
        slug = found[0]
        if slug not in tracked:
            problems.append(f"{slug}: listed on docs/articles.html but not a tracked article")
            continue
        img = re.search(r'<img src="([^"]+)"', block)
        # A card may be text-only (three from early 2026 are); an image it does carry must be
        # tracked by git, not merely on disk: docs/articles/ is gitignored, so a hero that was
        # generated but never force-added renders locally and 404s on the site (#846).
        if img and f"docs/{img.group(1)}" not in tracked_images:
            problems.append(f"{slug}: card image docs/{img.group(1)} is not tracked by git (git add -f it)")
    if not problems:
        ok.append(f"{len(on_disk)} tracked article(s) all carded on docs/articles.html; every card image that is set is tracked")

    teasers = re.findall(r'<article class="app-article-teaser">.*?</article>', home, flags=re.S)
    if len(teasers) != TEASER_COUNT:
        problems.append(f"docs/index.html shows {len(teasers)} teasers; expected {TEASER_COUNT}")
    home_slugs = []
    for block in teasers:
        found = linked_slugs(block)
        if not found:
            problems.append("docs/index.html: a teaser links to no article")
            continue
        home_slugs.append(found[0])
        if found[0] not in listed:
            problems.append(f"{found[0]}: on docs/index.html but not on docs/articles.html")
    if on_disk:
        newest = max(on_disk, key=lambda s: (s[:10], s))
        if newest not in home_slugs:
            problems.append(f"newest article {newest} is not in the docs/index.html teasers")
    if not any(p.startswith("docs/index.html") or "index.html" in p for p in problems):
        ok.append(f"docs/index.html shows {len(teasers)} teasers including the newest article")

    for line in ok:
        print(f"  ✓ {line}")
    for line in problems:
        print(f"  ✗ {line}")
    if problems:
        print("\nAdd a card to docs/articles.html and, for a new piece, a teaser to docs/index.html (keep eight; drop the oldest).")
        return 1
    print("Article listing check OK.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
