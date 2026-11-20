"""Every page on arckit.org loads the Cloudflare Web Analytics beacon.

The beacon is installed by hand, as a snippet in each page's <head>, so a new
page counts no visits until someone remembers to paste it in. The generated
guide and article pages take theirs from the two viewer templates.
"""
import re
import subprocess
from pathlib import Path

REPO = Path(__file__).resolve().parents[2]
DOCS = REPO / "docs"

# Group 1 is the site's public id, which every page sends to Cloudflare.
BEACON_RE = re.compile(
    r"<script type='module' src='https://static\.cloudflareinsights\.com/beacon\.min\.js' "
    r"data-cf-beacon='\{\"token\": \"([0-9a-f]{32})\"\}'></script>"
)


def site_pages() -> list[Path]:
    """Every tracked HTML page under docs/, so a gitignored draft is not checked."""
    out = subprocess.run(["git", "ls-files", "-z", "docs"], cwd=REPO, capture_output=True, check=True)
    return [REPO / name for name in out.stdout.decode().split("\0") if name.endswith(".html")]


def test_every_page_loads_the_home_page_beacon_once_in_its_head():
    home = BEACON_RE.findall((DOCS / "index.html").read_text(encoding="utf-8"))
    assert len(home) == 1, f"expected one beacon on the home page, found {home}"
    pages = site_pages()
    assert len(pages) > 300, "git ls-files found too few pages to trust the check"
    wrong = []
    for page in pages:
        text = page.read_text(encoding="utf-8")
        found = BEACON_RE.findall(text)
        if found != home or BEACON_RE.findall(text.split("</head>", 1)[0]) != home:
            wrong.append(f"{page.relative_to(REPO)}: {len(found)} beacon(s), or a different site id")
    assert not wrong, "pages without exactly one arckit.org beacon in <head>:\n" + "\n".join(wrong)


def test_privacy_page_names_cloudflare_web_analytics():
    assert "Cloudflare Web Analytics" in (DOCS / "privacy.html").read_text(encoding="utf-8")
