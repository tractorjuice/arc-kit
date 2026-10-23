"""Overlay scripts must reach the generated extensions.

converter.py copied scripts/ from arckit-claude only, so a script that only a
community plugin carries would never reach Codex, Gemini, Copilot, OpenCode,
Vibe or Kimi, while the converted command still told the model to run it
there. arckit-nl's NORA/GEMMA extract fetch (#941) is the first such script.
"""

import re
import sys
from pathlib import Path

import pytest

REPO_ROOT = Path(__file__).resolve().parents[2]
CORE = REPO_ROOT / "plugins/arckit-claude"
# Braced or bare, and the extension must end the name: catalogue.json is not
# catalogue.js.
SCRIPT_RE = re.compile(
    r"\$(?:\{CLAUDE_PLUGIN_ROOT\}|CLAUDE_PLUGIN_ROOT\b)/scripts/"
    r"([A-Za-z0-9._/-]+?\.(?:mjs|cjs|js|ts|py|sh))(?![\w-])"
)

sys.path.insert(0, str(REPO_ROOT / "scripts"))
import converter  # noqa: E402


def _overlay_script_refs():
    """(overlay dir, file naming it, scripts/ path) for every overlay command and agent."""
    refs = []
    for plugin in converter.PLUGIN_SOURCES[:-1]:
        root = REPO_ROOT / plugin
        for f in sorted((root / "commands").glob("*.md")) + sorted((root / "agents").glob("*.md")):
            refs.extend((root, f, rel) for rel in sorted(set(SCRIPT_RE.findall(f.read_text(encoding="utf-8")))))
    return refs


def _convert(tmp_path, monkeypatch, sources, copy_scripts=True):
    target = tmp_path / "ext"
    monkeypatch.chdir(REPO_ROOT)
    monkeypatch.setattr(converter, "AGENT_CONFIG", {
        "test": {"name": "Test target", "extension_dir": str(target), "copy_scripts_to_extension": copy_scripts},
    })
    converter.copy_extension_files([str(s) for s in sources])
    return target / "scripts"


def _overlay(base, name, files):
    root = base / name
    for rel, text in files.items():
        path = root / "scripts" / rel
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(text, encoding="utf-8")
    return root


@pytest.mark.parametrize("text, expected", [
    ("node ${CLAUDE_PLUGIN_ROOT}/scripts/a.mjs", ["a.mjs"]),
    ("node $CLAUDE_PLUGIN_ROOT/scripts/lib/b.cjs --x", ["lib/b.cjs"]),
    ("python3 ${CLAUDE_PLUGIN_ROOT}/scripts/c.py.", ["c.py"]),
    ("npx tsx ${CLAUDE_PLUGIN_ROOT}/scripts/e.ts", ["e.ts"]),
    ('bash "${CLAUDE_PLUGIN_ROOT}/scripts/bash/f.sh" --json', ["bash/f.sh"]),
    ("read ${CLAUDE_PLUGIN_ROOT}/scripts/catalogue.json", []),
    ("${CLAUDE_PLUGIN_ROOT}/scripts/d.tsx", []),
])
def test_script_re(text, expected):
    assert SCRIPT_RE.findall(text) == expected


def test_every_script_an_overlay_names_reaches_the_extensions(tmp_path, monkeypatch):
    # The real sources, converted once: the overlay must carry its own copy
    # (on Claude Code ${CLAUDE_PLUGIN_ROOT} is the overlay's root), and that
    # copy, or core's at the same path, must be in the extension.
    refs = _overlay_script_refs()
    assert refs, "no overlay command names a script; SCRIPT_RE stale?"
    scripts = _convert(tmp_path, monkeypatch, [REPO_ROOT / p for p in converter.PLUGIN_SOURCES])
    missing = [f"{f.relative_to(REPO_ROOT)}: scripts/{rel} ({why})"
               for root, f, rel in refs
               for why in (["not in " + root.name] if not (root / "scripts" / rel).is_file() else [])
               + (["not in the extension"] if not (scripts / rel).is_file() else [])]
    assert not missing, "overlay commands run scripts that don't ship:\n" + "\n".join(missing)


def test_overlay_scripts_ship_and_core_wins(tmp_path, monkeypatch):
    overlay = _overlay(tmp_path, "arckit-xx", {
        "fetch-extract.py": "# overlay\n",
        "lib/helper.mjs": "// overlay\n",
        "generate-document-id.mjs": "// overlay copy\n",
        "bash/overlay-only.sh": "# overlay\n",
    })
    scripts = _convert(tmp_path, monkeypatch, [overlay, CORE])
    assert (scripts / "fetch-extract.py").is_file()
    assert (scripts / "lib" / "helper.mjs").is_file()
    # Core's scripts/bash is merged in, not put in place of the overlay's.
    assert (scripts / "bash" / "overlay-only.sh").is_file()
    assert (scripts / "bash" / "common.sh").is_file()
    core = CORE / "scripts" / "generate-document-id.mjs"
    assert (scripts / "generate-document-id.mjs").read_bytes() == core.read_bytes()
    # A core script that core doesn't ship doesn't block nor replace an overlay's.
    assert not (scripts / "csf-score.mjs").exists()


def test_unshipped_core_script_does_not_block_an_overlay_script(tmp_path, monkeypatch):
    scripts = _convert(tmp_path / "a", monkeypatch, [CORE])
    unshipped = sorted(p.name for p in (CORE / "scripts").iterdir() if p.is_file() and not (scripts / p.name).exists())
    if not unshipped:
        pytest.skip("core ships every top-level script")
    name = unshipped[0]
    overlay = _overlay(tmp_path, "arckit-xx", {name: f"// overlay copy of {name}\n"})
    scripts = _convert(tmp_path / "b", monkeypatch, [overlay, CORE])
    assert (scripts / name).read_text(encoding="utf-8") == f"// overlay copy of {name}\n"


@pytest.mark.parametrize("rel", [
    "__pycache__/fetch.cpython-312.pyc",
    "node_modules/dep/index.js",
    ".DS_Store",
    "tests/test_fetch.py",
    "fixtures/sample.xml",
    "fetch.test.mjs",
    "test_fetch.py",
])
def test_development_leftovers_stay_behind(tmp_path, monkeypatch, rel):
    overlay = _overlay(tmp_path, "arckit-xx", {"fetch.py": "# overlay\n", rel: "x\n"})
    scripts = _convert(tmp_path, monkeypatch, [overlay, CORE])
    assert (scripts / "fetch.py").is_file()
    assert not (scripts / rel).exists()
    assert not (scripts / rel.split("/")[0]).exists()


def test_stale_scripts_are_removed(tmp_path, monkeypatch):
    overlay = _overlay(tmp_path, "arckit-xx", {"old-name.py": "# overlay\n"})
    _convert(tmp_path, monkeypatch, [overlay, CORE])
    (overlay / "scripts" / "old-name.py").rename(overlay / "scripts" / "new-name.py")
    scripts = _convert(tmp_path, monkeypatch, [overlay, CORE])
    assert (scripts / "new-name.py").is_file()
    assert not (scripts / "old-name.py").exists()


def test_two_overlays_may_share_identical_bytes(tmp_path, monkeypatch):
    # Every overlay carries core's helper scripts (sync-shared-assets.py).
    a = _overlay(tmp_path, "arckit-aa", {"lib/util.mjs": "// same\n"})
    b = _overlay(tmp_path, "arckit-bb", {"lib/util.mjs": "// same\n"})
    scripts = _convert(tmp_path, monkeypatch, [a, b, CORE])
    assert (scripts / "lib" / "util.mjs").read_text(encoding="utf-8") == "// same\n"


def test_overlay_copies_of_a_core_path_never_clash(tmp_path, monkeypatch):
    # Core's copy ships whatever the overlays hold; a stale overlay copy is
    # sync-shared-assets.py --check's to catch, not the converter's.
    a = _overlay(tmp_path, "arckit-aa", {"bash/common.sh": "# stale a\n"})
    b = _overlay(tmp_path, "arckit-bb", {"bash/common.sh": "# stale b\n"})
    scripts = _convert(tmp_path, monkeypatch, [a, b, CORE])
    core = CORE / "scripts" / "bash" / "common.sh"
    assert (scripts / "bash" / "common.sh").read_bytes() == core.read_bytes()


def test_core_script_leftovers_stay_behind_too(tmp_path, monkeypatch):
    # A stand-in core, so the test never writes into the repo's own plugin.
    core = tmp_path / "arckit-claude"
    (core / "scripts" / "python" / "__pycache__").mkdir(parents=True)
    (core / "scripts" / "python" / "common.py").write_text("# core\n", encoding="utf-8")
    (core / "scripts" / "python" / "__pycache__" / "common.cpython-312.pyc").write_bytes(b"")
    scripts = _convert(tmp_path, monkeypatch, [core])
    assert (scripts / "python" / "common.py").is_file()
    assert not (scripts / "python" / "__pycache__").exists()


@pytest.mark.parametrize("rel_a, rel_b", [
    ("lib/util.mjs", "lib/util.mjs"),
    ("lib/util.mjs", "Lib/Util.mjs"),
])
def test_two_overlays_clashing_stop_the_run(tmp_path, monkeypatch, rel_a, rel_b):
    a = _overlay(tmp_path, "arckit-aa", {rel_a: "// a\n"})
    b = _overlay(tmp_path / "b", "arckit-bb", {rel_b: "// b\n"})
    with pytest.raises(SystemExit) as exc:
        _convert(tmp_path, monkeypatch, [a, b, CORE])
    assert "arckit-aa" in str(exc.value) and "arckit-bb" in str(exc.value)


def test_a_case_only_clash_with_core_stops_the_run(tmp_path, monkeypatch):
    overlay = _overlay(tmp_path, "arckit-xx", {"Bash/common.sh": "# overlay\n"})
    with pytest.raises(SystemExit) as exc:
        _convert(tmp_path, monkeypatch, [overlay, CORE])
    assert "arckit-xx" in str(exc.value) and "bash/common.sh" in str(exc.value)


def test_converter_skips_overlay_scripts_when_target_takes_none(tmp_path, monkeypatch):
    overlay = _overlay(tmp_path, "arckit-xx", {"fetch.py": "# overlay\n"})
    scripts = _convert(tmp_path, monkeypatch, [overlay, CORE], copy_scripts=False)
    assert not (scripts / "fetch.py").exists()
