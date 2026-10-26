"""Overlay-only reference files must reach the generated extensions.

converter.py copied references/ from arckit-claude only, so a reference file
that only a community plugin carries never reached Codex, Gemini, Copilot,
OpenCode, Vibe, Kimi or Paperclip, while the converted commands still told the
model to read it there. Nothing failed: the command ran without its reference.
"""

import re
import sys
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[2]
CORE_REFS = REPO_ROOT / "plugins/arckit-claude/references"
REF_RE = re.compile(r"\$\{CLAUDE_PLUGIN_ROOT\}/references/([A-Za-z0-9._-]+\.md)")

sys.path.insert(0, str(REPO_ROOT / "scripts"))
import converter  # noqa: E402


def _overlay_reference_uses() -> dict[str, set[str]]:
    """'plugins/<overlay>' -> reference files its commands and agents read."""
    uses: dict[str, set[str]] = {}
    for plugin in converter.PLUGIN_SOURCES[:-1]:
        root = REPO_ROOT / plugin
        for f in sorted((root / "commands").glob("*.md")) + sorted((root / "agents").glob("*.md")):
            for name in REF_RE.findall(f.read_text(encoding="utf-8")):
                uses.setdefault(plugin, set()).add(name)
    return uses


def test_every_reference_an_overlay_command_reads_exists():
    missing = [f"{plugin}: {name}" for plugin, names in _overlay_reference_uses().items() for name in sorted(names)
               if not (REPO_ROOT / plugin / "references" / name).is_file() and not (CORE_REFS / name).is_file()]
    assert not missing, "overlay commands read reference files that exist nowhere:\n" + "\n".join(missing)


def test_converter_ships_overlay_only_references(tmp_path, monkeypatch):
    overlay_only = {name for plugin, names in _overlay_reference_uses().items() for name in names
                    if not (CORE_REFS / name).is_file()}
    assert overlay_only, "no overlay-only references found — regex stale, or the guard is no longer needed"

    target = tmp_path / "ext"
    monkeypatch.chdir(REPO_ROOT)
    monkeypatch.setattr(converter, "AGENT_CONFIG", {
        "test": {"name": "Test target", "extension_dir": str(target), "copy_scripts_to_extension": False},
    })
    converter.copy_extension_files(converter.PLUGIN_SOURCES)

    absent = sorted(name for name in overlay_only if not (target / "references" / name).is_file())
    assert not absent, "converter did not ship overlay-only references: " + ", ".join(absent)
    # shared references still come from core
    assert (target / "references" / "quality-checklist.md").read_bytes() == (CORE_REFS / "quality-checklist.md").read_bytes()
