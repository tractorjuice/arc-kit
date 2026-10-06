"""Tests for scripts/trim-plugin-changelog.py.

The plugin directory's validator could not inspect the shipped plugin CHANGELOG
at 319 KB. The script moves older releases to an archive that does not ship;
these tests pin that it never loses or reorders a release, cuts only between
minor series, and is safe to run on every release.
"""

from __future__ import annotations

import importlib.util
import subprocess
import sys
from pathlib import Path

import pytest

ROOT = Path(__file__).resolve().parent.parent.parent
SCRIPT = ROOT / "scripts/trim-plugin-changelog.py"


def _load():
    spec = importlib.util.spec_from_file_location("trim_plugin_changelog", SCRIPT)
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    return mod


trim = _load()

PREAMBLE = "# Changelog — ArcKit Plugin\n\nAll notable changes.\n\n"


def section(version: str, filler: int = 400) -> str:
    return f"## [{version}] — 2026-01-01\n\n### Fixed\n\n- {'x' * filler}\n\n"


def changelog(*versions: str) -> str:
    return PREAMBLE + "## [Unreleased]\n\n" + "".join(section(v) for v in versions)


@pytest.fixture
def small_target(monkeypatch):
    # Room for the preamble, [Unreleased] and about three sections.
    monkeypatch.setattr(trim, "TARGET_BYTES", 1700)


def versions(text: str) -> list[str]:
    return [v for v, _ in trim.split(text)[1]]


def test_repo_is_currently_within_limit():
    result = subprocess.run([sys.executable, str(SCRIPT), "--check"], capture_output=True, text=True)
    assert result.returncode == 0, result.stderr


def test_cuts_between_minor_series_and_loses_nothing(small_target):
    original = changelog("6.17.1", "6.17.0", "6.16.2", "6.16.1", "6.16.0", "6.15.0")
    plugin, archive, moved = trim.trim(original, None)

    # 6.17.x fits, the whole 6.16.x series does not, so it moves with everything older.
    assert versions(plugin) == ["Unreleased", "6.17.1", "6.17.0"]
    assert moved == ["6.16.2", "6.16.1", "6.16.0", "6.15.0"]
    assert versions(archive) == moved
    assert versions(plugin)[1:] + versions(archive) == versions(original)[1:]


def test_newest_series_always_stays(monkeypatch):
    monkeypatch.setattr(trim, "TARGET_BYTES", 10)
    plugin, _, moved = trim.trim(changelog("6.17.1", "6.17.0", "6.16.0"), None)
    assert versions(plugin) == ["Unreleased", "6.17.1", "6.17.0"]
    assert moved == ["6.16.0"]


def test_second_run_moves_nothing(small_target):
    plugin, archive, _ = trim.trim(changelog("6.17.0", "6.16.0", "6.15.0", "6.14.0"), None)
    again, archive_again, moved = trim.trim(plugin, archive)
    assert moved == []
    assert again == plugin and archive_again == archive


def test_later_moves_go_on_top_of_the_archive(small_target):
    plugin, archive, _ = trim.trim(changelog("6.17.0", "6.16.0", "6.15.0", "6.14.0"), None)
    # Three new releases push the next series out.
    grown = plugin.replace("## [Unreleased]\n\n", "## [Unreleased]\n\n" + section("6.18.1") + section("6.18.0") + section("6.17.9"))
    plugin2, archive2, moved = trim.trim(grown, archive)
    assert moved
    assert versions(archive2) == moved + versions(archive)


def test_pointer_names_oldest_kept_release_once(small_target):
    plugin, archive, _ = trim.trim(changelog("6.17.0", "6.16.0", "6.15.0", "6.14.0"), None)
    grown = plugin.replace("## [Unreleased]\n\n", "## [Unreleased]\n\n" + section("6.18.1") + section("6.18.0") + section("6.17.9"))
    plugin2, _, _ = trim.trim(grown, archive)
    pointers = [line for line in plugin2.splitlines() if line.startswith(trim.POINTER_PREFIX)]
    assert len(pointers) == 1
    assert pointers[0].startswith(f"{trim.POINTER_PREFIX}{versions(plugin2)[-1]} ")
    assert trim.ARCHIVE_URL in pointers[0]


def test_refuses_to_archive_a_release_twice(small_target):
    _, archive, _ = trim.trim(changelog("6.17.0", "6.16.0", "6.15.0", "6.14.0"), None)
    with pytest.raises(SystemExit):
        trim.trim(changelog("6.17.0", "6.16.0", "6.15.0", "6.14.0"), archive)
