"""Run scripts/generate-article-share-pages.py --check inside the Python suite.

Every article card on docs/articles.html needs a static docs/share/<slug>.html
carrying its own Open Graph tags, because the JavaScript article viewer shows
the same generic preview for every article on LinkedIn, Discord and Slack.
Like test_article_listing.py, this runs from the Python suite rather than a
workflow file.
"""

from __future__ import annotations

import subprocess
import sys
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[2]


def test_every_article_has_an_up_to_date_share_page():
    result = subprocess.run(
        [sys.executable, str(REPO_ROOT / "scripts" / "generate-article-share-pages.py"), "--check"],
        cwd=REPO_ROOT, capture_output=True, text=True,
    )
    assert result.returncode == 0, result.stdout + result.stderr
