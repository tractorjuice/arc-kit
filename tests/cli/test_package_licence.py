"""The PyPI licence metadata matches what the distributions actually ship.

The wheel and sdist carry the adapted arc42 template, which is CC BY-SA 4.0,
beside ArcKit's MIT code (#1053). `pyproject.toml` therefore declares the PEP
639 expression `MIT AND CC-BY-SA-4.0` and lists both licence texts, and must
not also carry an MIT `License ::` classifier, which PEP 639 forbids alongside
an expression. The static tests read `pyproject.toml`; the build tests build
both distributions and read their METADATA and contents, so a backend that
drops a `License-File` or a shared-data mapping that stops shipping the
template fails here rather than on PyPI.
"""

import email.parser
import subprocess
import sys
import tarfile
import tomllib
import zipfile
from pathlib import Path

import pytest

REPO_ROOT = Path(__file__).resolve().parents[2]
EXPRESSION = "MIT AND CC-BY-SA-4.0"
NOTICE = ".arckit/templates/arc42-LICENSE.md"
TEMPLATE = ".arckit/templates/arc42-template.md"
LICENCE_FILES = ["LICENSE", NOTICE]
# Each extension pyproject maps into share/arckit ships the template and its
# notice side by side.
EXTENSIONS = ["arckit-codex", "arckit-copilot", "arckit-opencode", "arckit-vibe"]


def load_pyproject() -> dict:
    return tomllib.loads((REPO_ROOT / "pyproject.toml").read_text())


def parse_metadata(text: str):
    return email.parser.Parser().parsestr(text)


def assert_licence_metadata(metadata) -> None:
    assert metadata["License-Expression"] == EXPRESSION
    assert sorted(metadata.get_all("License-File")) == sorted(LICENCE_FILES)
    # The legacy free-text field and the classifier both contradict an
    # expression; PEP 639 tools reject either alongside it.
    assert metadata["License"] is None
    classifiers = metadata.get_all("Classifier") or []
    assert not [c for c in classifiers if c.startswith("License ::")]


# --- pyproject.toml ---------------------------------------------------------


def test_project_declares_mixed_licence_expression() -> None:
    project = load_pyproject()["project"]

    assert project["license"] == EXPRESSION


def test_licence_expression_is_canonical_spdx() -> None:
    licenses = pytest.importorskip("packaging.licenses")

    assert licenses.canonicalize_license_expression(EXPRESSION) == EXPRESSION


def test_no_licence_classifier_alongside_expression() -> None:
    classifiers = load_pyproject()["project"]["classifiers"]

    assert not [c for c in classifiers if c.startswith("License ::")]


def test_licence_files_exist_and_cover_both_licences() -> None:
    project = load_pyproject()["project"]

    assert project["license-files"] == LICENCE_FILES
    mit = (REPO_ROOT / "LICENSE").read_text()
    notice = (REPO_ROOT / NOTICE).read_text()
    assert "MIT License" in mit
    assert "arc42" in mit and "CC BY-SA 4.0" in mit
    assert "SPDX-License-Identifier: CC-BY-SA-4.0" in notice
    assert "Peter Hruschka and Gernot Starke" in notice
    assert "remain MIT-licensed" in notice


def test_build_backend_supports_pep_639() -> None:
    requires = load_pyproject()["build-system"]["requires"]

    assert "hatchling>=1.27" in requires


# --- built distributions ----------------------------------------------------


@pytest.fixture(scope="module")
def dists(tmp_path_factory) -> dict:
    """Build the sdist and wheel once from the source tree.

    `--no-isolation` uses the hatchling installed alongside pytest, so the
    build needs no network. The build hook regenerates extension formats only
    if they are missing, as they are on a fresh checkout.
    """
    pytest.importorskip("build")
    pytest.importorskip("hatchling")
    out = tmp_path_factory.mktemp("dist")
    subprocess.run(
        [sys.executable, "-m", "build", "--sdist", "--wheel", "--no-isolation",
         "--outdir", str(out), str(REPO_ROOT)],
        check=True,
        capture_output=True,
    )
    (wheel,) = out.glob("*.whl")
    (sdist,) = out.glob("*.tar.gz")
    return {"wheel": wheel, "sdist": sdist}


def test_wheel_metadata_declares_expression_and_licence_files(dists) -> None:
    with zipfile.ZipFile(dists["wheel"]) as whl:
        (meta,) = [n for n in whl.namelist() if n.endswith(".dist-info/METADATA")]
        assert_licence_metadata(parse_metadata(whl.read(meta).decode()))


def test_wheel_ships_licence_texts_unchanged(dists) -> None:
    with zipfile.ZipFile(dists["wheel"]) as whl:
        names = whl.namelist()
        dist_info = next(n.split("/")[0] for n in names if ".dist-info/" in n)
        for licence in LICENCE_FILES:
            shipped = whl.read(f"{dist_info}/licenses/{licence}")
            assert shipped == (REPO_ROOT / licence).read_bytes()


def test_wheel_ships_template_beside_its_notice(dists) -> None:
    with zipfile.ZipFile(dists["wheel"]) as whl:
        names = set(whl.namelist())
        data = next(n.split("/")[0] for n in names if ".data/" in n)
        share = f"{data}/data/share/arckit"
        template = whl.read(f"{share}/{TEMPLATE}").decode()
        assert "SPDX-License-Identifier: CC-BY-SA-4.0" in template
        assert f"{share}/{NOTICE}" in names
        for extension in EXTENSIONS:
            templates = f"{share}/extensions/{extension}/templates"
            assert f"{templates}/arc42-template.md" in names, extension
            assert f"{templates}/arc42-LICENSE.md" in names, extension


def test_sdist_metadata_declares_expression_and_licence_files(dists) -> None:
    with tarfile.open(dists["sdist"]) as sdist:
        (pkg_info,) = [m for m in sdist.getmembers()
                       if m.name.count("/") == 1 and m.name.endswith("/PKG-INFO")]
        assert_licence_metadata(
            parse_metadata(sdist.extractfile(pkg_info).read().decode())
        )


def test_sdist_ships_licences_and_template(dists) -> None:
    with tarfile.open(dists["sdist"]) as sdist:
        root = sdist.getnames()[0].split("/")[0]
        names = set(sdist.getnames())
        for path in [*LICENCE_FILES, TEMPLATE,
                     "plugins/arckit-arc42/LICENSE",
                     "plugins/arckit-arc42/templates/arc42-LICENSE.md",
                     "plugins/arckit-arc42/templates/arc42-template.md"]:
            assert f"{root}/{path}" in names, path
