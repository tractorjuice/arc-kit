"""Tests for scripts/generate-docs-manifest.py.

docs/manifest.json is published at https://arckit.org/manifest.json as a
programmatic document index. Nothing in the site HTML reads it, so its six-month
drift went unnoticed: 54 of 238 guides, 45 of 166 templates, 2 of 62 articles,
and one entry pointing at a deleted file. It is now generated from disk.
"""

import importlib.util
import json
import subprocess
from pathlib import Path

import pytest

REPO_ROOT = Path(__file__).resolve().parents[2]
GENERATOR = REPO_ROOT / "scripts/generate-docs-manifest.py"
MANIFEST = REPO_ROOT / "docs/manifest.json"


def load_generator():
    spec = importlib.util.spec_from_file_location("generate_docs_manifest", GENERATOR)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


@pytest.fixture(scope="module")
def manifest():
    return json.loads(MANIFEST.read_text(encoding="utf-8"))


@pytest.fixture(scope="module")
def listed_paths(manifest):
    return [doc["path"] for p in manifest["projects"] for doc in p["documents"]] + [
        g["path"] for g in manifest["global"]
    ]


def test_generator_exists():
    assert GENERATOR.is_file()


def test_manifest_is_current():
    result = subprocess.run(
        ["python3", str(GENERATOR), "--check"], capture_output=True, text=True, cwd=REPO_ROOT
    )
    assert result.returncode == 0, (
        f"docs/manifest.json is stale. Run --write.\n{result.stdout}\n{result.stderr}"
    )


def test_manifest_is_valid_json_with_expected_shape(manifest):
    assert set(manifest) == {"generated", "repository", "global", "projects"}
    assert manifest["repository"]["name"] == "arc-kit"
    assert manifest["projects"], "no project groups"


def test_no_entry_points_at_a_missing_file(listed_paths):
    # The pre-generator manifest had exactly this: docs/guides/wardley-mapping.md
    # listed long after the file was gone.
    ghosts = sorted(p for p in listed_paths if not (REPO_ROOT / p).is_file())
    assert not ghosts, f"manifest lists files that do not exist: {ghosts}"


def test_no_duplicate_entries(listed_paths):
    dupes = sorted({p for p in listed_paths if listed_paths.count(p) > 1})
    assert not dupes, f"duplicate manifest entries: {dupes}"


@pytest.mark.parametrize(
    "label,directory,pattern,prefix",
    [
        ("guides", "docs/guides", "**/*.md", "docs/guides/"),
        ("templates", ".arckit/templates", "*.md", ".arckit/templates/"),
        ("articles", "docs/articles", "*.md", "docs/articles/"),
    ],
)
def test_every_file_on_disk_is_listed(listed_paths, label, directory, pattern, prefix):
    on_disk = {
        str(p.relative_to(REPO_ROOT))
        for p in (REPO_ROOT / directory).glob(pattern)
        if p.is_file()
    }
    listed = {p for p in listed_paths if p.startswith(prefix)}
    missing = sorted(on_disk - listed)
    assert not missing, f"{label}: {len(missing)} file(s) missing from the manifest: {missing[:5]}"


def test_repo_audit_guide_is_listed(listed_paths):
    assert "docs/guides/repo-audit.md" in listed_paths


def test_check_is_insensitive_to_the_timestamp_alone():
    # A rebuild on a day when nothing else changed must not report drift, or CI
    # would fail spuriously and the check would get ignored.
    generator = load_generator()
    a = generator.build("2020-01-01T00:00:00Z")
    b = generator.build("2099-12-31T00:00:00Z")
    a.pop("generated"), b.pop("generated")
    assert a == b


def test_generator_is_wired_into_ci():
    workflow = (REPO_ROOT / ".github/workflows/lint-markdown.yml").read_text()
    assert "generate-docs-manifest.py --check" in workflow
    # The inputs must trigger the workflow too, or a template or article added
    # without any .md guide change would slip past.
    assert '"docs/manifest.json"' in workflow
    assert '".arckit/templates/**"' in workflow


def test_titles_are_non_empty(manifest):
    empty = [
        doc["path"]
        for p in manifest["projects"]
        for doc in p["documents"]
        if not doc.get("title", "").strip()
    ]
    assert not empty, f"entries with no title: {empty[:5]}"
