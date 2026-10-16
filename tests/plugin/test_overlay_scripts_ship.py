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
CORE_SCRIPTS = REPO_ROOT / "plugins/arckit-claude/scripts"
SCRIPT_RE = re.compile(r"\$\{CLAUDE_PLUGIN_ROOT\}/scripts/([A-Za-z0-9._/-]+\.(?:mjs|js|py|sh))")

sys.path.insert(0, str(REPO_ROOT / "scripts"))
import converter  # noqa: E402


def test_every_script_an_overlay_command_runs_exists():
    missing = []
    for plugin in converter.PLUGIN_SOURCES[:-1]:
        root = REPO_ROOT / plugin
        for f in sorted((root / "commands").glob("*.md")) + sorted((root / "agents").glob("*.md")):
            for rel in SCRIPT_RE.findall(f.read_text(encoding="utf-8")):
                if not (root / "scripts" / rel).is_file() and not (CORE_SCRIPTS / rel).is_file():
                    missing.append(f"{f.relative_to(REPO_ROOT)}: scripts/{rel}")
    assert not missing, "overlay commands run scripts that exist nowhere:\n" + "\n".join(missing)


def _run(tmp_path, monkeypatch, copy_scripts, extra=()):
    overlay = tmp_path / "arckit-xx"
    (overlay / "scripts" / "lib").mkdir(parents=True)
    (overlay / "scripts" / "fetch-extract.mjs").write_text("// overlay\n", encoding="utf-8")
    (overlay / "scripts" / "lib" / "helper.mjs").write_text("// overlay\n", encoding="utf-8")
    (overlay / "scripts" / "generate-document-id.mjs").write_text("// overlay copy\n", encoding="utf-8")
    (overlay / "scripts" / "__pycache__").mkdir()
    (overlay / "scripts" / "__pycache__" / "fetch.cpython-312.pyc").write_bytes(b"\0")
    for name in extra:
        (overlay / "scripts" / name).write_text(f"// overlay copy of {name}\n", encoding="utf-8")

    target = tmp_path / "ext"
    monkeypatch.chdir(REPO_ROOT)
    monkeypatch.setattr(converter, "AGENT_CONFIG", {
        "test": {"name": "Test target", "extension_dir": str(target), "copy_scripts_to_extension": copy_scripts},
    })
    converter.copy_extension_files([str(overlay), *converter.PLUGIN_SOURCES])
    return target / "scripts"


def test_converter_ships_overlay_scripts(tmp_path, monkeypatch):
    scripts = _run(tmp_path, monkeypatch, copy_scripts=True)
    assert (scripts / "fetch-extract.mjs").is_file()
    assert (scripts / "lib" / "helper.mjs").is_file()
    assert not (scripts / "__pycache__").exists()  # local bytecode never ships
    # core wins on a name clash
    core = CORE_SCRIPTS / "generate-document-id.mjs"
    assert (scripts / "generate-document-id.mjs").read_bytes() == core.read_bytes()


def test_unshipped_core_script_does_not_block_an_overlay_script(tmp_path, monkeypatch):
    # Core ships only some of its scripts. An overlay script named like one it
    # does not ship (csf-score.mjs today) must still ship, or neither copy
    # reaches the extension.
    baseline = _run(tmp_path / "a", monkeypatch, copy_scripts=True)
    unshipped = sorted(p.name for p in CORE_SCRIPTS.iterdir() if p.is_file() and not (baseline / p.name).exists())
    if not unshipped:
        pytest.skip("core ships every top-level script, so no clash can drop an overlay script")
    name = unshipped[0]
    scripts = _run(tmp_path / "b", monkeypatch, copy_scripts=True, extra=(name,))
    assert (scripts / name).read_text(encoding="utf-8") == f"// overlay copy of {name}\n"


def test_converter_skips_overlay_scripts_when_target_takes_none(tmp_path, monkeypatch):
    scripts = _run(tmp_path, monkeypatch, copy_scripts=False)
    assert not (scripts / "fetch-extract.mjs").exists()
