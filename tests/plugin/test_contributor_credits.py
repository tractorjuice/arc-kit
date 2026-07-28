"""Tests for scripts/check-contributor-credits.py.

The guard exists because `docs/contributors.html` drifted from the CHANGELOGs
across three separate releases. These tests pin the two things that make it
useful: it fails when someone credited is missing, and it does not fire on the
`@`-prefixed tokens that litter a technical changelog.
"""

from __future__ import annotations

import importlib.util
import subprocess
import sys
from pathlib import Path

import pytest

ROOT = Path(__file__).resolve().parent.parent.parent
SCRIPT = ROOT / "scripts/check-contributor-credits.py"


def _load():
    spec = importlib.util.spec_from_file_location("check_contributor_credits", SCRIPT)
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    return mod


guard = _load()


def handles(text: str) -> set[str]:
    """Handles the guard would credit from a changelog body."""
    return set(guard.HANDLE_RE.findall(guard.strip_code(text)))


def test_repo_is_currently_clean():
    """The committed tree must pass, or CI is red on arrival."""
    result = subprocess.run([sys.executable, str(SCRIPT)], capture_output=True, text=True)
    assert result.returncode == 0, result.stderr


def test_credits_in_prose_are_found():
    assert handles("Reported by @chrismckelt against 6.7.2 (#693).") == {"chrismckelt"}


def test_handle_with_internal_hyphen_is_found():
    assert handles("Reported by @jhonurrego-tekton, who found duplicates.") == {
        "jhonurrego-tekton"
    }


def test_multiple_credits_on_one_line():
    assert handles("Thanks to @umag and @gtonic for the fix.") == {"umag", "gtonic"}


@pytest.mark.parametrize(
    "text",
    [
        "bumped `mermaid@11.15.0` across all templates",
        "moves from the `pkg.pr.new/mermaid@7147` pre-release build",
        "validates `@startuml`/`@enduml` wrappers",
        "installs `@types/node` for the harness",
        "the `@property` decorator is used throughout",
    ],
)
def test_code_tokens_are_not_credits(text):
    """`@`-prefixed tokens inside code spans are never contributor credits."""
    assert handles(text) == set()


def test_fenced_code_blocks_are_stripped():
    text = "Prose crediting @realperson.\n\n```python\n@decorator\ndef f(): ...\n```\n"
    assert handles(text) == {"realperson"}


def test_bare_version_specifier_outside_code_is_not_a_credit():
    """The word-boundary guard holds even without backticks to help."""
    assert handles("bumped mermaid@11.15.0 today") == set()


def test_email_addresses_are_not_credits():
    assert handles("Contact noreply@example.com for details.") == set()


def test_maintainer_is_excluded():
    assert "tractorjuice" in guard.NOT_CONTRIBUTORS


def test_page_handles_are_extracted_from_profile_links():
    found = guard.handles_on_page()
    assert "chrismckelt" in found
    assert len(found) >= 19


def test_every_credited_handle_is_listed():
    credited = set(guard.handles_in_changelogs())
    listed = {h.lower() for h in guard.handles_on_page()}
    assert {h for h in credited if h.lower() not in listed} == set()


def test_hero_stat_matches_card_count():
    """The page carries its own count in two places; both must match reality."""
    page = (ROOT / "docs/contributors.html").read_text(encoding="utf-8")
    cards = page.count('<p class="app-contributor-card__name">')
    assert f"{cards} Open Source Contributors" in page
    assert f"these {cards} individuals" in page
