"""Run scripts/check-article-listing.py inside the Python suite.

The guard belongs in lint-markdown.yml beside check-guide-site-links.py, but a
workflow edit needs a token with the `workflow` scope, which the release
machine's token lacks. Running it here gives the same CI coverage from the
"Full Python suite" workflow without touching .github/workflows/.
"""

from __future__ import annotations

import subprocess
import sys
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[2]


def test_every_article_is_listed_and_the_newest_is_on_the_home_page():
    result = subprocess.run(
        [sys.executable, str(REPO_ROOT / "scripts" / "check-article-listing.py")],
        cwd=REPO_ROOT, capture_output=True, text=True,
    )
    assert result.returncode == 0, result.stdout + result.stderr
