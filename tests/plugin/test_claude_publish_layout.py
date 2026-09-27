"""The published tractorjuice/arckit-claude layout: every plugin in its own folder.

The core plugin used to be published at the repository root, which made its
plugin folder the whole repository, every overlay included. The Claude plugin
directory's validator timed out on that folder, and it broke the directory's
512-file plugin-folder limit; users also installed every overlay's files inside
the core. The core now publishes to plugins/arckit and the root holds only the
marketplace, a README and the LICENSE.

These tests run the staging functions from scripts/push-extensions.sh itself
into a temporary directory, so they check what the script does, not what its
comments say.
"""

import json
import re
import shutil
import subprocess
from pathlib import Path

import pytest

REPO_ROOT = Path(__file__).resolve().parents[2]
PUSH_SCRIPT = REPO_ROOT / "scripts" / "push-extensions.sh"
CORE_DIR = REPO_ROOT / "plugins" / "arckit-claude"

STAGING_FUNCTIONS = (
    "copy_distribution_files",
    "copy_claude_core_files",
    "write_claude_root_marketplace",
    "write_claude_root_readme",
    "write_claude_standalone_license",
)


def _extract(body: str, name: str) -> str:
    match = re.search(rf"^{name}\(\) \{{\n.*?^\}}\n", body, re.S | re.M)
    assert match, f"{name}() not found in push-extensions.sh"
    return match.group(0)


@pytest.fixture(scope="module")
def staged(tmp_path_factory) -> Path:
    bash = shutil.which("bash")
    if bash is None:
        pytest.skip("bash not available")
    body = PUSH_SCRIPT.read_text(encoding="utf-8")
    layout = re.search(r"^CLAUDE_PLUGIN_REPO=.*?^\)\n", body, re.S | re.M)
    assert layout, "CLAUDE_PLUGIN_LAYOUT block not found"
    functions = "\n".join(_extract(body, name) for name in STAGING_FUNCTIONS)
    out = tmp_path_factory.mktemp("arckit-claude")
    script = f"""
set -euo pipefail
ROOT_DIR={str(REPO_ROOT)!r}
red() {{ echo "$*" >&2; }}
{layout.group(0)}
{functions}
clone_path={str(out)!r}
copy_claude_core_files "$ROOT_DIR/$CLAUDE_PLUGIN_CORE_DIR" "$clone_path/$CLAUDE_PLUGIN_CORE_SUBDIR"
write_claude_root_marketplace "$ROOT_DIR/$CLAUDE_PLUGIN_CORE_DIR/.claude-plugin/marketplace.json" "$clone_path/.claude-plugin/marketplace.json"
write_claude_root_readme "$clone_path/README.md"
write_claude_standalone_license "$clone_path/LICENSE"
for entry in "${{CLAUDE_PLUGIN_LAYOUT[@]}}"; do
  IFS=':' read -r source_path repo_subdir <<< "$entry"
  copy_distribution_files "$ROOT_DIR/$source_path" "$clone_path/$repo_subdir"
done
"""
    subprocess.run([bash, "-c", script], check=True, cwd=REPO_ROOT)
    return out


def test_repo_root_holds_only_marketplace_readme_and_license(staged):
    top = {p.name for p in staged.iterdir()}
    assert top == {".claude-plugin", "README.md", "LICENSE", "plugins"}
    assert {p.name for p in (staged / ".claude-plugin").iterdir()} == {"marketplace.json"}


def test_core_plugin_is_published_in_its_own_folder(staged):
    core = staged / "plugins" / "arckit"
    manifest = json.loads((core / ".claude-plugin" / "plugin.json").read_text())
    assert manifest["name"] == "arckit"
    assert (core / "README.md").is_file()
    assert (core / "LICENSE").is_file()
    assert (core / "hooks" / "hooks.json").is_file()


def test_core_folder_carries_no_overlays_or_marketplace(staged):
    core = staged / "plugins" / "arckit"
    assert not (core / "plugins").exists(), "the nested overlay mirror leaked into the core folder"
    assert not (core / ".claude-plugin" / "marketplace.json").exists()


def test_root_marketplace_points_core_at_its_folder(staged):
    published = json.loads((staged / ".claude-plugin" / "marketplace.json").read_text())
    local = json.loads((CORE_DIR / ".claude-plugin" / "marketplace.json").read_text())
    published_sources = {p["name"]: p["source"] for p in published["plugins"]}
    local_sources = {p["name"]: p["source"] for p in local["plugins"]}
    assert published_sources["arckit"] == "./plugins/arckit"
    assert local_sources["arckit"] == "."
    for name, source in local_sources.items():
        if name != "arckit":
            assert published_sources[name] == source
    for name, source in published_sources.items():
        folder = staged / source.removeprefix("./")
        manifest = json.loads((folder / ".claude-plugin" / "plugin.json").read_text())
        assert manifest["name"] == name, f"{source} holds {manifest['name']}, not {name}"


def test_every_published_plugin_folder_is_self_contained(staged):
    """A plugin folder must not contain another plugin's manifest except the
    overlays that are nested by design (au/energy inside au)."""
    published = json.loads((staged / ".claude-plugin" / "marketplace.json").read_text())
    folders = [staged / p["source"].removeprefix("./") for p in published["plugins"]]
    for folder in folders:
        nested = [
            m for m in folder.rglob(".claude-plugin/plugin.json")
            if m.parent.parent != folder
        ]
        allowed = {staged / "plugins" / "au" / "energy"}
        assert all(m.parent.parent in allowed for m in nested), (
            f"{folder.relative_to(staged)} contains other plugins: "
            f"{[str(m.parent.parent.relative_to(staged)) for m in nested]}"
        )


def test_root_readme_links_every_plugin_folder(staged):
    readme = (staged / "README.md").read_text()
    published = json.loads((staged / ".claude-plugin" / "marketplace.json").read_text())
    for plugin in published["plugins"]:
        folder = plugin["source"].removeprefix("./")
        assert f"]({folder})" in readme, f"root README does not link {folder}"
