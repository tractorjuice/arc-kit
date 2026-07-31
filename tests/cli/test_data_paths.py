"""Resolution of the installed share/arckit data root.

Regression cover for #730: on a Homebrew framework Python the interpreter's
own prefix and the directory pip actually writes to are different trees, so
every prefix-derived probe missed and the CLI fell back to a path that cannot
exist (`/opt/homebrew/lib/python3.11/.arckit/templates`).
"""

from pathlib import Path

import pytest

from arckit_cli import find_data_root


def make_data_root(base: Path) -> Path:
    """Create a share/arckit tree the way the wheel's shared-data lands."""
    root = base / "share" / "arckit"
    (root / ".arckit" / "templates").mkdir(parents=True)
    (root / "scripts").mkdir(parents=True)
    return root


def make_module_file(site_packages: Path) -> Path:
    """Create the installed arckit_cli/__init__.py under a site-packages dir."""
    module_file = site_packages / "arckit_cli" / "__init__.py"
    module_file.parent.mkdir(parents=True)
    module_file.write_text("")
    return module_file


def test_finds_data_root_from_site_packages_when_interpreter_prefix_is_wrong(
    tmp_path: Path,
) -> None:
    """Homebrew framework Python: sys.prefix and the install tree disagree.

    Homebrew patches sysconfig's `osx_framework_library` scheme so pip writes
    purelib to <brew>/lib/python3.11/site-packages and data to <brew>, while
    sys.prefix still points into the Framework bundle. Resolution must follow
    the module's own location, not the interpreter prefix.
    """
    brew = tmp_path / "opt" / "homebrew"
    data_root = make_data_root(brew)
    module_file = make_module_file(brew / "lib" / "python3.11" / "site-packages")

    framework_prefix = (
        brew / "opt" / "python@3.11" / "Frameworks" / "Python.framework" / "Versions" / "3.11"
    )
    framework_prefix.mkdir(parents=True)

    assert find_data_root(module_file, env={}, prefixes=[framework_prefix]) == data_root


def test_finds_data_root_under_interpreter_prefix(tmp_path: Path) -> None:
    """A normal venv/pip install, where the interpreter prefix is correct."""
    prefix = tmp_path / "venv"
    data_root = make_data_root(prefix)
    module_file = make_module_file(prefix / "lib" / "python3.12" / "site-packages")

    assert find_data_root(module_file, env={}, prefixes=[prefix]) == data_root


def test_finds_data_root_in_debian_dist_packages_layout(tmp_path: Path) -> None:
    """Debian/Ubuntu use dist-packages, one directory shallower than usual."""
    usr = tmp_path / "usr"
    data_root = make_data_root(usr)
    module_file = make_module_file(usr / "lib" / "python3" / "dist-packages")

    assert find_data_root(module_file, env={}, prefixes=[]) == data_root


def test_source_checkout_takes_precedence(tmp_path: Path) -> None:
    """Running from a clone must use the working tree, not an installed copy."""
    checkout = tmp_path / "arc-kit"
    (checkout / ".arckit" / "templates").mkdir(parents=True)
    (checkout / "extensions" / "arckit-codex").mkdir(parents=True)
    module_file = checkout / "src" / "arckit_cli" / "__init__.py"
    module_file.parent.mkdir(parents=True)
    module_file.write_text("")

    installed = tmp_path / "usr"
    make_data_root(installed)

    assert find_data_root(module_file, env={}, prefixes=[installed]) == checkout


def test_env_override_takes_precedence(tmp_path: Path) -> None:
    """ARCKIT_DATA_DIR is the escape hatch for layouts we do not predict."""
    override = tmp_path / "elsewhere"
    (override / ".arckit" / "templates").mkdir(parents=True)

    prefix = tmp_path / "venv"
    make_data_root(prefix)
    module_file = make_module_file(prefix / "lib" / "python3.12" / "site-packages")

    resolved = find_data_root(
        module_file, env={"ARCKIT_DATA_DIR": str(override)}, prefixes=[prefix]
    )
    assert resolved == override


def test_returns_none_when_no_data_root_exists(tmp_path: Path) -> None:
    """Nothing found must be reported as nothing, not as a fabricated path."""
    prefix = tmp_path / "venv"
    module_file = make_module_file(prefix / "lib" / "python3.12" / "site-packages")

    assert find_data_root(module_file, env={}, prefixes=[prefix]) is None


@pytest.mark.parametrize("key", ["templates", "scripts", "docid_generator", "copilot_prompts"])
def test_get_data_paths_resolves_the_real_repo_in_source_mode(key: str) -> None:
    """The dev checkout these tests run in must resolve to real files."""
    from arckit_cli import get_data_paths

    paths = get_data_paths()
    assert paths[key].exists(), f"{key} -> {paths[key]}"
