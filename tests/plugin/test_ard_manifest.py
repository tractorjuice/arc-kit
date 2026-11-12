"""arckit.org publishes an Agentic Resource Discovery (ARD) manifest.

ARD (https://github.com/ards-project/ard-spec, v0.91) is how a site tells agents and
registries which agentic resources it publishes: a JSON document at
`/.well-known/ard.json` with an `entries` array. Lighthouse's agentic browsing audits
check for it. ArcKit's manifest lists the public plugin and extension archives and the
standalone reference skills.

These tests hold the manifest to the rules the spec's conformance tool applies, and to
the repo: every entry must point at something ArcKit ships, and the site must serve
the folder at all.
"""

from __future__ import annotations

import json
import re
from pathlib import Path

import pytest
import yaml

REPO = Path(__file__).resolve().parents[2]
DOCS = REPO / "docs"
MANIFEST = DOCS / ".well-known" / "ard.json"

# The site's domain, which is also the publisher every identifier is anchored to (spec
# Appendix C): a registry checks the publisher against the domain serving the manifest.
DOMAIN = (DOCS / "CNAME").read_text(encoding="utf-8").strip()

# urn:air:<publisher>:[<namespace>:]<name>, as in the spec's entry schema.
URN_RE = re.compile(r"^urn:air:([a-zA-Z0-9.-]+)(:[a-zA-Z0-9._-]+)+$")

PLUGIN_TYPE = "application/agent-plugins+zip"
SKILL_TYPE = "application/agent-skills+md"

# The media types the spec lists in section 3.3. Any valid media type is allowed, but a
# registry only recognises these, so an entry of another type would not be found.
STANDARD_TYPES = {
    "application/ai-catalog+json",
    "application/agent-card+json",
    "application/a2a-agent-card+json",
    "application/mcp-server-card+json",
    "application/agent-skills+json",
    "application/agent-skills+md",
    "application/agent-skills+zip",
    "application/agent-skills+gzip",
    'text/markdown; profile="urn:air:agent-skills"',
    "application/agent-plugins+zip",
    "application/agent-plugins+gzip",
    "application/ai-registry",
    "application/ai-registry+json",
}

# Where each published repo's content comes from in this repo. arckit-paperclip is left
# out on purpose: that repo is private, so its archive link would be a 404.
PUBLISHED_REPOS = {
    "arckit-claude": REPO / "plugins" / "arckit-claude" / ".claude-plugin" / "plugin.json",
    "arckit-gemini": REPO / "extensions" / "arckit-gemini" / "README.md",
    "arckit-codex": REPO / "extensions" / "arckit-codex" / "README.md",
    "arckit-opencode": REPO / "extensions" / "arckit-opencode" / "README.md",
    "arckit-copilot": REPO / "extensions" / "arckit-copilot" / "README.md",
    "arckit-vibe": REPO / "extensions" / "arckit-vibe" / "README.md",
    "arckit-kimi": REPO / "extensions" / "arckit-kimi" / "README.md",
}

ARCHIVE_RE = re.compile(r"^https://github\.com/tractorjuice/([a-z-]+)/archive/refs/heads/main\.zip$")
# Core is published at plugins/arckit in tractorjuice/arckit-claude (see CLAUDE.md).
SKILL_RE = re.compile(
    r"^https://raw\.githubusercontent\.com/tractorjuice/arckit-claude/main/plugins/arckit/skills/([a-z0-9-]+)/SKILL\.md$"
)


def load_manifest() -> dict:
    return json.loads(MANIFEST.read_text(encoding="utf-8"))


def entries() -> list[dict]:
    return load_manifest()["entries"]


def entry_ids() -> list[str]:
    return [e.get("identifier", f"entry-{i}") for i, e in enumerate(entries())]


def test_manifest_is_an_object_with_entries():
    manifest = load_manifest()
    assert isinstance(manifest, dict)
    assert isinstance(manifest.get("entries"), list) and manifest["entries"], "no entries"
    # The spec removed top-level collections; hierarchies belong inside entries.
    assert "collections" not in manifest


def test_identifiers_are_unique():
    ids = entry_ids()
    assert len(ids) == len(set(ids)), sorted(i for i in ids if ids.count(i) > 1)


@pytest.mark.parametrize("entry", entries(), ids=entry_ids())
def test_entry_carries_the_required_terms(entry):
    match = URN_RE.match(entry.get("identifier", ""))
    assert match, f"identifier is not urn:air:<publisher>:<namespace>:<name>: {entry.get('identifier')!r}"
    assert match.group(1) == DOMAIN, f"publisher must be {DOMAIN}, the domain that serves the manifest"
    assert isinstance(entry.get("displayName"), str) and entry["displayName"].strip()
    assert entry.get("type") in STANDARD_TYPES, f"{entry.get('type')!r} is not a type the spec lists"
    # Value or reference: exactly one of the two.
    assert ("url" in entry) != ("data" in entry), "an entry carries exactly one of url and data"


@pytest.mark.parametrize("entry", entries(), ids=entry_ids())
def test_entry_can_be_found_by_search(entry):
    """A registry builds its index from representativeQueries; the spec asks for 2 to 5."""
    queries = entry.get("representativeQueries")
    assert isinstance(queries, list), "no representativeQueries, so a registry cannot index the entry"
    assert 2 <= len(queries) <= 5, f"{len(queries)} queries; the spec asks for 2 to 5"
    assert all(isinstance(q, str) and q.strip() for q in queries)
    assert len(set(queries)) == len(queries)
    assert isinstance(entry.get("description"), str) and entry["description"].strip()


@pytest.mark.parametrize("entry", entries(), ids=entry_ids())
def test_optional_terms_have_the_schema_types(entry):
    for term in ("capabilities", "tags"):
        if term in entry:
            assert isinstance(entry[term], list) and all(isinstance(x, str) and x for x in entry[term]), term
    # metadata values are scalars, so a registry can use them as filter keys.
    for key, value in entry.get("metadata", {}).items():
        assert value is None or isinstance(value, (str, int, float, bool)), f"metadata.{key} is not a scalar"
    # Archive links follow the default branch, which only changes at a release, so a
    # version or date written here would be wrong after the next one.
    assert "version" not in entry and "updatedAt" not in entry


@pytest.mark.parametrize("entry", entries(), ids=entry_ids())
def test_entry_points_at_something_arckit_ships(entry):
    url = entry["url"]
    if entry["type"] == PLUGIN_TYPE:
        match = ARCHIVE_RE.match(url)
        assert match, f"a plugin entry links a published repo's archive: {url}"
        repo = match.group(1)
        assert repo in PUBLISHED_REPOS, f"{repo} is not a public ArcKit distribution repo"
        assert PUBLISHED_REPOS[repo].exists(), f"{repo} has no source in this repo"
        assert entry.get("metadata", {}).get("repository") == f"https://github.com/tractorjuice/{repo}"
    elif entry["type"] == SKILL_TYPE:
        match = SKILL_RE.match(url)
        assert match, f"a skill entry links a core skill's SKILL.md: {url}"
        skill = match.group(1)
        assert (REPO / "plugins" / "arckit-claude" / "skills" / skill / "SKILL.md").exists(), f"no core skill named {skill}"
        assert entry["identifier"].endswith(f":skill:{skill}")
    else:
        pytest.fail(f"no rule for entries of type {entry['type']}: add one here")


def test_every_public_distribution_is_listed():
    listed = {ARCHIVE_RE.match(e["url"]).group(1) for e in entries() if e["type"] == PLUGIN_TYPE}
    assert listed == set(PUBLISHED_REPOS), "the manifest and the list of public distribution repos differ"


def test_documentation_links_point_at_pages_on_the_site():
    for entry in entries():
        link = entry.get("metadata", {}).get("documentation")
        if not link:
            continue
        assert link.startswith(f"https://{DOMAIN}/"), link
        assert (DOCS / link.removeprefix(f"https://{DOMAIN}/")).exists(), f"{link} is not a page in docs/"


def test_the_site_serves_the_well_known_folder():
    """GitHub Pages builds docs/ with Jekyll, which drops dot-folders unless they are included."""
    config = yaml.safe_load((DOCS / "_config.yml").read_text(encoding="utf-8"))
    assert ".well-known" in (config.get("include") or []), "docs/_config.yml must include .well-known"
    assert not any(str(x).strip("/") == ".well-known" for x in config.get("exclude") or [])


def test_the_homepage_links_the_manifest():
    html = (DOCS / "index.html").read_text(encoding="utf-8")
    assert re.search(r'<link rel="ard" href="/\.well-known/ard\.json"', html), 'index.html needs <link rel="ard">'
