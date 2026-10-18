"""Every script an overlay command runs is in that overlay (#971).

In Claude Code each overlay is its own plugin, so `${CLAUDE_PLUGIN_ROOT}` is the
overlay's root, not core's. Until #971, 60 overlay commands named core's
helpers by a relative `scripts/...` path, which runs against the user's project
and finds nothing, and 19 named `${CLAUDE_PLUGIN_ROOT}/scripts/...` in overlays
that shipped no scripts. One reached for core through
`${CLAUDE_PLUGIN_ROOT}/../arckit-claude/`, a path the plugin cache doesn't
have. The model improvised a folder and a filename, which loses the registry
check and the multi-instance numbering the scripts guarantee.

`scripts/sync-shared-assets.py` now copies core's helpers, and the files they
load, into every overlay; its `--check` keeps the copies identical to core.
"""

from __future__ import annotations

import re
import shutil
import subprocess
from pathlib import Path

import pytest

REPO = Path(__file__).resolve().parents[2]
CORE = REPO / "plugins" / "arckit-claude"
OVERLAYS = sorted(
    p.parent.parent for p in REPO.glob("plugins/arckit-*/.claude-plugin/plugin.json")
    if p.parent.parent != CORE
)
COMMANDS = [c for o in OVERLAYS for c in sorted((o / "commands").glob("*.md"))]

PLUGIN_SCRIPT = re.compile(r"\$\{CLAUDE_PLUGIN_ROOT\}/(scripts/[A-Za-z0-9_./-]+\.(?:mjs|sh))")
# A script named any other way: relative to the project, under the project's
# .arckit/ (only `arckit init` writes one), or outside the plugin's own root.
UNREACHABLE = re.compile(
    r"\$\{CLAUDE_PLUGIN_ROOT\}/\.\./[^\s`\"]*scripts/[\w./-]+\.(?:mjs|sh)"
    r"|(?<![\w/.}-])(?:\.arckit/)?scripts/(?:bash/)?[\w.-]+\.(?:mjs|sh)"
)


def _id(path: Path) -> str:
    return f"{path.parent.parent.name}/{path.stem}"


@pytest.mark.parametrize("command", COMMANDS, ids=_id)
def test_every_script_a_command_names_is_in_its_overlay(command):
    overlay = command.parent.parent
    missing = sorted({rel for rel in PLUGIN_SCRIPT.findall(command.read_text(encoding="utf-8"))
                      if not (overlay / rel).is_file()})
    assert not missing, (
        f"{_id(command)} runs {missing}, which {overlay.name} doesn't ship. Add the file to "
        "SHARED_FILES (or PLUGIN_FILES) in scripts/sync-shared-assets.py and run it."
    )


@pytest.mark.parametrize("command", COMMANDS, ids=_id)
def test_no_command_names_a_script_its_plugin_cannot_reach(command):
    bad = sorted({m.group(0) for m in UNREACHABLE.finditer(command.read_text(encoding="utf-8"))})
    assert not bad, (
        f"{_id(command)} names {bad}; in Claude Code only ${{CLAUDE_PLUGIN_ROOT}}/scripts/... "
        "inside the overlay itself resolves"
    )


def test_shared_scripts_bring_what_they_load():
    """A copied script finds `common.sh` beside it and `../config/doc-types.mjs`."""
    for overlay in OVERLAYS:
        scripts = overlay / "scripts"
        if not scripts.is_dir():
            continue
        for sh in scripts.glob("bash/*.sh"):
            if "common.sh" in sh.read_text(encoding="utf-8"):
                assert (scripts / "bash" / "common.sh").is_file(), f"{sh} sources common.sh"
        for mjs in scripts.glob("*.mjs"):
            for rel in re.findall(r"from '(\.\.?/[^']+)'", mjs.read_text(encoding="utf-8")):
                assert (mjs.parent / rel).resolve().is_file(), f"{mjs} imports {rel}"


@pytest.mark.skipif(shutil.which("node") is None, reason="needs node")
def test_an_overlay_copy_names_and_checks_like_core(tmp_path):
    """The copy runs from the overlay's own folder and still rejects an unregistered code."""
    script = REPO / "plugins" / "arckit-uae" / "scripts" / "generate-document-id.mjs"
    ok = subprocess.run(["node", str(script), "001", "PDPL", "1.0", "--filename"],
                        capture_output=True, text=True, cwd=tmp_path)
    assert ok.returncode == 0, ok.stderr
    assert ok.stdout.strip() == "ARC-001-PDPL-v1.0.md"
    bad = subprocess.run(["node", str(script), "001", "NOT-A-CODE", "1.0", "--filename"],
                         capture_output=True, text=True, cwd=tmp_path)
    assert bad.returncode != 0
