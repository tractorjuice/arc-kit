"""Tests for slugify parity across all four script copies (#766).

`slugify` is implemented four times: bash and Python, each in a root copy and a
plugin copy. Commit f8544b4a (#204, "preserve accented characters in slugify")
landed in `scripts/bash/common.sh` only, so the other three kept deleting the
character mid-word: "Cafe Modernisation" with an accent became
`caf-modernisation`. Marketplace users never touch `scripts/bash/`, so the one
copy that got the fix was the one they never run.

#204's approach did not hold up either. `[:alnum:]` follows `LC_CTYPE`, so the
root copy returned a different directory name depending on the caller's
environment:

    LC_ALL=C.UTF-8  ->  cafe-zurich-ecole   (accents kept)
    LC_ALL=C        ->  caf-z-rich-cole     (fix silently reverts)

All four copies now transliterate to ASCII instead. That is deterministic in
every locale and in both languages, keeps the character rather than deleting
it, and keeps non-ASCII out of directory names that end up in filesystem paths,
git and published URLs. It also sidesteps the macOS/Linux normalisation hazard:
macOS stores accents decomposed (NFD) and Linux composed (NFC), so a literal
accented directory name can mismatch across a clone.

Characters outside the transliteration table are dropped, consistently in both
languages. The parity test is the real guard here: the table is duplicated four
ways, which is exactly the drift that caused this bug.
"""

import importlib.util
import subprocess
from pathlib import Path

import pytest

REPO_ROOT = Path(__file__).resolve().parents[2]

BASH_COPIES = (
    REPO_ROOT / "scripts/bash/common.sh",
    REPO_ROOT / "plugins/arckit-claude/scripts/bash/common.sh",
)

PYTHON_COPIES = (
    REPO_ROOT / "scripts/python/common.py",
    REPO_ROOT / "plugins/arckit-claude/scripts/python/common.py",
)

# (input, expected slug)
CORPUS = [
    ("Payment Gateway Modernization", "payment-gateway-modernization"),
    ("M365 Integration", "m365-integration"),
    ("  spaced   out  ", "spaced-out"),
    ("---", ""),
    # The #766 regression: the plugin copy returned "caf-modernisation".
    ("Café Modernisation", "cafe-modernisation"),
    ("Café Zürich ÉCOLE", "cafe-zurich-ecole"),
    ("Île-de-France", "ile-de-france"),
    ("Malmö/Göteborg", "malmo-goteborg"),
    ("Ångström Ñoño", "angstrom-nono"),
    ("Straße", "strasse"),
    ("Æther & Œuvre", "aether-oeuvre"),
    ("Łódź Rail", "lodz-rail"),
    # Turkish dotted capital I. Python's str.lower() maps it to "i" plus a
    # combining dot, which would diverge from bash if lowercasing were not
    # restricted to ASCII.
    ("İstanbul Metro", "istanbul-metro"),
    # Unmapped scripts drop out rather than producing mojibake.
    ("日本 Project", "project"),
]

CORPUS_IDS = [inp for inp, _ in CORPUS]

LOCALES = ("C", "C.UTF-8")


def _ids(path: Path) -> str:
    return str(path.relative_to(REPO_ROOT))


def bash_slugify(script: Path, text: str, locale: str | None = None) -> str:
    env_prefix = ["env", f"LC_ALL={locale}"] if locale else []
    result = subprocess.run(
        [*env_prefix, "bash", "-c", 'source "$1"; slugify "$2"', "_", str(script), text],
        capture_output=True,
        text=True,
    )
    assert result.returncode == 0, result.stderr
    return result.stdout.rstrip("\n")


def python_slugify(module_path: Path, text: str) -> str:
    spec = importlib.util.spec_from_file_location(f"common_{module_path.parent.parent}", module_path)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module.slugify(text)


@pytest.mark.parametrize("script", BASH_COPIES, ids=_ids)
@pytest.mark.parametrize("text,expected", CORPUS, ids=CORPUS_IDS)
def test_bash_slugify(script: Path, text: str, expected: str):
    assert bash_slugify(script, text) == expected


@pytest.mark.parametrize("module_path", PYTHON_COPIES, ids=_ids)
@pytest.mark.parametrize("text,expected", CORPUS, ids=CORPUS_IDS)
def test_python_slugify(module_path: Path, text: str, expected: str):
    assert python_slugify(module_path, text) == expected


@pytest.mark.parametrize("text,expected", CORPUS, ids=CORPUS_IDS)
def test_all_four_copies_agree(text: str, expected: str):
    """The table is duplicated four ways; nothing else stops it drifting."""
    results = {
        _ids(p): bash_slugify(p, text) for p in BASH_COPIES
    } | {
        _ids(p): python_slugify(p, text) for p in PYTHON_COPIES
    }
    assert len(set(results.values())) == 1, f"implementations disagree: {results}"


@pytest.mark.parametrize("script", BASH_COPIES, ids=_ids)
@pytest.mark.parametrize("text,expected", CORPUS, ids=CORPUS_IDS)
def test_bash_slugify_is_locale_independent(script: Path, text: str, expected: str):
    """#204 used [:alnum:], which follows LC_CTYPE, so the same project name
    produced a different directory under LC_ALL=C than under a UTF-8 locale."""
    results = {loc: bash_slugify(script, text, locale=loc) for loc in LOCALES}
    assert len(set(results.values())) == 1, f"locale changed the slug: {results}"


@pytest.mark.parametrize("script", BASH_COPIES, ids=_ids)
def test_bash_slugify_never_emits_non_ascii(script: Path):
    for text, _ in CORPUS:
        slug = bash_slugify(script, text)
        assert slug.isascii(), f"{text!r} produced non-ASCII slug {slug!r}"


@pytest.mark.parametrize("module_path", PYTHON_COPIES, ids=_ids)
def test_python_slugify_never_emits_non_ascii(module_path: Path):
    for text, _ in CORPUS:
        slug = python_slugify(module_path, text)
        assert slug.isascii(), f"{text!r} produced non-ASCII slug {slug!r}"
