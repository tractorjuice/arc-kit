"""Tests for scripts/check-guide-site-links.py.

The guard exists because docs/guides.html and docs/roles.html are
hand-maintained: a guide can pass check-guide-parity.py, ship to all seven
extension formats, and still be unreachable on the site. That happened with
/arckit:repo-audit in v6.7.0 (fixed in PR #681).
"""

import importlib.util
import subprocess
from pathlib import Path

import pytest

REPO_ROOT = Path(__file__).resolve().parents[2]
GUARD = REPO_ROOT / "scripts/check-guide-site-links.py"


def load_guard():
    spec = importlib.util.spec_from_file_location("check_guide_site_links", GUARD)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


def test_guard_exists():
    assert GUARD.is_file(), "guide site-link guard missing"


def test_guard_passes_on_current_tree():
    result = subprocess.run(
        ["python3", str(GUARD)], capture_output=True, text=True, cwd=REPO_ROOT
    )
    assert result.returncode == 0, f"guard failed:\n{result.stdout}\n{result.stderr}"


def test_guard_is_wired_into_ci():
    workflow = (REPO_ROOT / ".github/workflows/lint-markdown.yml").read_text()
    assert "check-guide-site-links.py" in workflow, "guard not run in CI"
    # The hand-maintained pages must also trigger the workflow, or an edit that
    # removes a link would not be checked until some unrelated .md changed.
    assert '"docs/guides.html"' in workflow
    assert '"docs/roles.html"' in workflow


@pytest.mark.parametrize(
    "href,expected",
    [
        ('guide-viewer.html?guide=repo-audit"', "repo-audit"),
        ('guide-viewer.html?guide=roles/security-architect"', "roles/security-architect"),
        ('guide-viewer.html?guide=wardley.gameplay"', "wardley.gameplay"),
    ],
)
def test_link_regex_handles_real_href_shapes(href, expected):
    # Nested (roles/) and dotted (wardley.x) guide names both occur on the site;
    # a regex that missed either would under-report links and fail open.
    assert load_guard().LINK_RE.findall(href) == [expected]


def test_every_exemption_still_exists_on_disk():
    guard = load_guard()
    on_disk = guard.guides_on_disk()
    stale = sorted(guard.UNLINKED_BY_DESIGN - on_disk)
    assert not stale, f"UNLINKED_BY_DESIGN names guides that no longer exist: {stale}"


def test_repo_audit_is_linked():
    # Explicit regression for the bug that motivated the guard.
    guard = load_guard()
    linked = set().union(*guard.links_by_page().values())
    assert "repo-audit" in linked, "/arckit:repo-audit guide is unreachable from the site again"
