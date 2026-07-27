#!/usr/bin/env python3
"""Assert every guide is reachable from the published site, and no site link is dead.

`docs/guides.html` and `docs/roles.html` are hand-maintained. Nothing derives
them from `docs/guides/`, so a guide can exist in both guide trees, pass
`check-guide-parity.py`, ship to all seven extension formats, and still be
invisible on the site: reachable only by guessing its `guide-viewer.html?guide=`
URL. That shipped with `/arckit:repo-audit` in v6.7.0 and was fixed in PR #681.

Two directions are checked:

  unlinked  a guide on disk that no site page links to
  dead      a site link pointing at a guide that does not exist

A guide counts as reachable if ANY page in SITE_PAGES links it. That is
deliberate: role guides live on roles.html rather than guides.html, and
hardcoding "roles/ is exempt" would silently hide a role guide going missing
from roles.html too.

Exit 0 when clean, 1 otherwise.
"""

from __future__ import annotations

import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
GUIDES_DIR = ROOT / "docs/guides"
SITE_PAGES = (ROOT / "docs/guides.html", ROOT / "docs/roles.html")

LINK_RE = re.compile(r"guide=([A-Za-z0-9._/-]+)")

# Guides deliberately not linked from any site page. Keep this list short and
# justified — an entry here is a guide no site visitor can ever reach.
UNLINKED_BY_DESIGN = {
    # Index page for the roles/ subtree; roles.html links the 18 role guides
    # themselves and needs no card for their contents page.
    "roles/README",
}


def guides_on_disk() -> set[str]:
    return {
        str(p.relative_to(GUIDES_DIR)).removesuffix(".md")
        for p in GUIDES_DIR.rglob("*.md")
    }


def links_by_page() -> dict[Path, set[str]]:
    found: dict[Path, set[str]] = {}
    for page in SITE_PAGES:
        if not page.is_file():
            raise SystemExit(f"ERROR: site page not found: {page.relative_to(ROOT)}")
        found[page] = set(LINK_RE.findall(page.read_text(encoding="utf-8")))
    return found


def main() -> int:
    if not GUIDES_DIR.is_dir():
        print(f"ERROR: {GUIDES_DIR} not found", file=sys.stderr)
        return 1

    disk = guides_on_disk()
    if not disk:
        print(f"ERROR: no guides found under {GUIDES_DIR.relative_to(ROOT)}", file=sys.stderr)
        return 1

    per_page = links_by_page()
    linked = set().union(*per_page.values()) if per_page else set()

    unlinked = sorted(disk - linked - UNLINKED_BY_DESIGN)
    dead = sorted(linked - disk)
    stale_exempt = sorted(UNLINKED_BY_DESIGN - disk)

    failed = False

    if unlinked:
        failed = True
        print(f"FAIL {len(unlinked)} guide(s) on disk that no site page links to:", file=sys.stderr)
        for name in unlinked:
            print(f"  docs/guides/{name}.md", file=sys.stderr)
        print(
            "\n  A site visitor cannot reach these. Add a list entry to "
            "docs/guides.html (or docs/roles.html for role guides) linking\n"
            '  guide-viewer.html?guide=<name>, and remember to bump that '
            "section's guide count. If a guide is intentionally\n"
            "  unreachable, add it to UNLINKED_BY_DESIGN in this script with a reason.",
            file=sys.stderr,
        )

    if dead:
        failed = True
        print(f"\nFAIL {len(dead)} site link(s) pointing at a guide that does not exist:", file=sys.stderr)
        for name in dead:
            pages = sorted(p.name for p, links in per_page.items() if name in links)
            print(f"  guide={name}  (linked from {', '.join(pages)})", file=sys.stderr)

    if stale_exempt:
        failed = True
        print(
            f"\nFAIL {len(stale_exempt)} UNLINKED_BY_DESIGN entr(y/ies) no longer on disk: "
            f"{', '.join(stale_exempt)}",
            file=sys.stderr,
        )
        print("  Remove them from this script.", file=sys.stderr)

    if failed:
        return 1

    counts = ", ".join(
        f"{page.name}: {len(links & disk)}" for page, links in sorted(per_page.items())
    )
    print(f"Guide site-link check OK: {len(disk)} guide(s) on disk, all reachable ({counts}).")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
