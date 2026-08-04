"""The build hook that keeps converter output out of hollow wheels.

The generated extension trees are gitignored, so a wheel built straight from a
git checkout (`pip install git+https://...`) shipped only the handful of
tracked files and left `arckit init --ai copilot` with no prompts at all
(#730). The hook regenerates them at build time and refuses to package a tree
that is still missing them.
"""

import importlib.util
import tomllib
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[2]


def load_build_hook():
    spec = importlib.util.spec_from_file_location(
        "arckit_hatch_build", REPO_ROOT / "hatch_build.py"
    )
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


def build_tree(root: Path, assets: dict) -> None:
    """Materialise a fake source tree from the required-asset manifest."""
    for extension, entries in assets.items():
        for entry in entries:
            target = root / extension / entry
            if target.suffix:
                target.parent.mkdir(parents=True, exist_ok=True)
                target.write_text("x")
            else:
                target.mkdir(parents=True, exist_ok=True)
                (target / "generated.md").write_text("x")


def test_complete_tree_reports_nothing_missing(tmp_path: Path) -> None:
    hook = load_build_hook()
    build_tree(tmp_path, hook.REQUIRED_ASSETS)

    assert hook.missing_assets(tmp_path) == []


def test_hollow_extension_tree_is_reported_as_missing(tmp_path: Path) -> None:
    """A fresh clone: only the tracked README/VERSION exist."""
    hook = load_build_hook()
    for extension in hook.REQUIRED_ASSETS:
        (tmp_path / extension).mkdir(parents=True)
        (tmp_path / extension / "README.md").write_text("x")
        (tmp_path / extension / "VERSION").write_text("6.7.5")

    missing = hook.missing_assets(tmp_path)

    assert missing, "a checkout without converter output must not build"
    assert any("arckit-copilot/prompts" in entry for entry in missing)


def test_empty_generated_directory_counts_as_missing(tmp_path: Path) -> None:
    """The converter creating an empty dir is not the same as populating it."""
    hook = load_build_hook()
    build_tree(tmp_path, hook.REQUIRED_ASSETS)
    prompts = tmp_path / "extensions" / "arckit-copilot" / "prompts"
    for child in prompts.iterdir():
        child.unlink()

    missing = hook.missing_assets(tmp_path)

    assert any("arckit-copilot/prompts" in entry for entry in missing)


def test_required_assets_cover_every_extension_in_shared_data() -> None:
    """Adding an extension to shared-data must also guard its generated output.

    Without this, a new extension silently inherits the #730 failure: declared
    for distribution, empty in any wheel built from a clean checkout.
    """
    hook = load_build_hook()
    pyproject = tomllib.loads((REPO_ROOT / "pyproject.toml").read_text())
    shared_data = pyproject["tool"]["hatch"]["build"]["targets"]["wheel"]["shared-data"]

    packaged_extensions = {
        source
        for source in shared_data
        if source.startswith("extensions/") and "." not in Path(source).name
    }

    assert packaged_extensions == set(hook.REQUIRED_ASSETS)


def test_working_tree_is_packageable() -> None:
    """The checkout these tests run in has had the converter run against it."""
    hook = load_build_hook()

    assert hook.missing_assets(REPO_ROOT) == []
