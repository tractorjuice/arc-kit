"""Release process guardrails."""

import json
from pathlib import Path
import re
import tomllib


REPO_ROOT = Path(__file__).resolve().parents[2]
PUSH_EXTENSIONS = REPO_ROOT / "scripts" / "push-extensions.sh"
RELEASING_DOC = REPO_ROOT / "docs" / "RELEASING.md"
ROOT_VERSION = REPO_ROOT / "VERSION"
EXPECTED_STANDALONE_REPOS = {
    "claude": ("plugins/arckit-claude", "arckit-claude"),
    "gemini": ("extensions/arckit-gemini", "arckit-gemini"),
    "codex": ("extensions/arckit-codex", "arckit-codex"),
    "opencode": ("extensions/arckit-opencode", "arckit-opencode"),
    "copilot": ("extensions/arckit-copilot", "arckit-copilot"),
    "paperclip": ("extensions/arckit-paperclip", "arckit-paperclip"),
    "vibe": ("extensions/arckit-vibe", "arckit-vibe"),
}
EXPECTED_CLAUDE_MARKETPLACE_SOURCES = {
    "arckit": (".", "plugins/arckit-claude", "MIT"),
    "arckit-uae": ("./plugin/uae", "plugins/arckit-uae", "MIT"),
    "arckit-fr": ("./plugin/fr", "plugins/arckit-fr", "MIT"),
    "arckit-ca": ("./plugin/ca", "plugins/arckit-ca", "MIT"),
    "arckit-eu": ("./plugin/eu", "plugins/arckit-eu", "MIT"),
    "arckit-at": ("./plugin/at", "plugins/arckit-at", "MIT"),
    "arckit-au": ("./plugin/au", "plugins/arckit-au", "MIT"),
    "arckit-au-energy": ("./plugin/au/energy", "plugins/arckit-au-energy", "MIT"),
    "arckit-us": ("./plugin/us", "plugins/arckit-us", "MIT"),
    "arckit-uk-finance": ("./plugin/uk/finance", "plugins/arckit-uk-finance", "MIT"),
    "arckit-uk-nhs": ("./plugin/uk/nhs", "plugins/arckit-uk-nhs", "MIT"),
    "arckit-fde": ("./plugin/fde", "plugins/arckit-fde", "MIT"),
    "arckit-uk-gcloud": ("./plugin/uk/gcloud", "plugins/arckit-uk-gcloud", "Proprietary"),
}

PINNED_README_VERSION_PATTERNS = [
    re.compile(r"Current Release:\s*v?\d+\.\d+\.\d+"),
    re.compile(r"\*\*ArcKit Version\*\*:\s*v?\d+\.\d+\.\d+"),
    re.compile(r"^\s*>\s*\*\*Version\*\*:\s*v?\d+\.\d+\.\d+", re.MULTILINE),
    re.compile(r"^## Version History\s*$", re.MULTILINE),
]


def standalone_path(distribution_key: str) -> Path:
    local_dir, _repo_name = EXPECTED_STANDALONE_REPOS[distribution_key]
    return REPO_ROOT / local_dir


def test_standalone_readmes_do_not_pin_release_versions():
    failures = []

    for distribution_key in EXPECTED_STANDALONE_REPOS:
        readme = standalone_path(distribution_key) / "README.md"
        text = readme.read_text(encoding="utf-8")
        for pattern in PINNED_README_VERSION_PATTERNS:
            if pattern.search(text):
                failures.append(f"{readme.relative_to(REPO_ROOT)} matches {pattern.pattern}")

    assert not failures, "Pinned standalone README versions found:\n" + "\n".join(failures)


def test_release_process_names_every_standalone_repo():
    script = PUSH_EXTENSIONS.read_text(encoding="utf-8")
    release_doc = RELEASING_DOC.read_text(encoding="utf-8")

    for distribution_key, (local_dir, repo_name) in EXPECTED_STANDALONE_REPOS.items():
        assert f'[{distribution_key}]="{local_dir}:{repo_name}"' in script
        assert f"tractorjuice/{repo_name}" in release_doc
        assert (REPO_ROOT / local_dir / "README.md").is_file()
        assert (REPO_ROOT / local_dir / "VERSION").is_file()


def test_standalone_version_files_match_root_version():
    root_version = ROOT_VERSION.read_text(encoding="utf-8").strip()

    for distribution_key in EXPECTED_STANDALONE_REPOS:
        version_file = standalone_path(distribution_key) / "VERSION"
        assert version_file.read_text(encoding="utf-8").strip() == root_version

    gemini_manifest = json.loads(
        (standalone_path("gemini") / "gemini-extension.json").read_text(encoding="utf-8")
    )
    assert gemini_manifest["version"] == root_version

    paperclip_manifest = json.loads(
        (standalone_path("paperclip") / "package.json").read_text(encoding="utf-8")
    )
    assert paperclip_manifest["version"] == root_version

    with (standalone_path("vibe") / "vibe-config.toml").open("rb") as f:
        vibe_config = tomllib.load(f)
    assert vibe_config["extension"]["version"] == root_version


def test_claude_standalone_marketplace_matches_plugin_version():
    plugin_version = (standalone_path("claude") / "VERSION").read_text(encoding="utf-8").strip()
    marketplace = json.loads(
        (standalone_path("claude") / ".claude-plugin" / "marketplace.json").read_text(
            encoding="utf-8"
        )
    )

    assert marketplace["name"] == "arckit-claude"
    assert marketplace["metadata"]["version"] == "1.0.0"
    assert len(marketplace["plugins"]) == len(EXPECTED_CLAUDE_MARKETPLACE_SOURCES)

    plugins = {plugin["name"]: plugin for plugin in marketplace["plugins"]}
    assert set(plugins) == set(EXPECTED_CLAUDE_MARKETPLACE_SOURCES)

    for name, (source, local_dir, license_name) in EXPECTED_CLAUDE_MARKETPLACE_SOURCES.items():
        plugin = plugins[name]
        manifest = json.loads(
            (REPO_ROOT / local_dir / ".claude-plugin" / "plugin.json").read_text(
                encoding="utf-8"
            )
        )

        assert plugin["source"] == source
        assert plugin["version"] == plugin_version
        assert plugin["repository"] == "https://github.com/tractorjuice/arckit-claude"
        assert plugin["homepage"] == "https://github.com/tractorjuice/arckit-claude"
        assert plugin["license"] == license_name
        assert manifest["name"] == name
        assert manifest["version"] == plugin_version
        assert manifest["repository"] == "https://github.com/tractorjuice/arckit-claude"


def test_push_extensions_structures_claude_plugins_in_one_repo():
    script = PUSH_EXTENSIONS.read_text(encoding="utf-8")

    assert 'CLAUDE_PLUGIN_REPO="arckit-claude"' in script
    assert 'CLAUDE_PLUGIN_CORE_DIR="plugins/arckit-claude"' in script

    for name, (source, local_dir, _license_name) in EXPECTED_CLAUDE_MARKETPLACE_SOURCES.items():
        if name == "arckit":
            continue
        repo_subdir = source.removeprefix("./")
        assert f'"{local_dir}:{repo_subdir}"' in script

    assert "plugin/uk/gcloud/" in script
    assert "proprietary and licensed" in script


def test_push_extensions_publishes_tags_and_github_releases():
    script = PUSH_EXTENSIONS.read_text(encoding="utf-8")

    assert 'TAG="v${VERSION}"' in script
    assert "remote_tag_commit" in script
    assert 'git tag -a "$TAG"' in script
    assert 'git push --quiet origin "refs/tags/${TAG}"' in script
    assert 'gh release create "$TAG"' in script
    assert "ARCKIT_SKIP_EXTENSION_RELEASES=1" in script


def test_push_extensions_prepares_gemini_for_gallery_discovery():
    script = PUSH_EXTENSIONS.read_text(encoding="utf-8")

    assert "ensure_repo_topic" in script
    assert "gemini-cli-extension" in script
