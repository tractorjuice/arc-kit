"""Unit tests for scripts/check-plugin-directory-limits.py.

The script mirrors the Claude plugin directory's "Files in the plugin folder"
rules: 512 files at most, every non-image, non-font file under 256 KiB, and no
binaries other than PNG, JPEG, GIF, WebP and fonts. Breaking one holds a
version for a reviewer. test_claude_publish_layout.py runs it on the real
staged layout; these tests pin each rule on a synthetic folder.
"""

import importlib.util
import json
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[2]
SCRIPT = REPO_ROOT / "scripts" / "check-plugin-directory-limits.py"


def load():
    spec = importlib.util.spec_from_file_location("check_plugin_directory_limits", SCRIPT)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


limits = load()


def plugin(tmp_path: Path, files: dict[str, bytes]) -> Path:
    folder = tmp_path / "plugins" / "demo"
    for rel, content in {".claude-plugin/plugin.json": b'{"name": "demo"}', **files}.items():
        path = folder / rel
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_bytes(content)
    return folder


def test_a_small_text_plugin_passes(tmp_path):
    assert limits.violations(plugin(tmp_path, {"README.md": b"# Demo\n"})) == []


def test_512_files_pass_and_513_do_not(tmp_path):
    files = {f"docs/{i}.md": b"x" for i in range(511)}
    folder = plugin(tmp_path, files)
    assert limits.violations(folder) == []
    (folder / "docs" / "extra.md").write_bytes(b"x")
    assert limits.violations(folder) == ["513 files (limit 512)"]


def test_a_text_file_of_256_kib_is_held(tmp_path):
    folder = plugin(tmp_path, {
        "ok.md": b"x" * (256 * 1024 - 1),
        "CHANGELOG.md": b"x" * (256 * 1024),
    })
    assert limits.violations(folder) == ["CHANGELOG.md: 256 KiB (limit 256 KiB)"]


def test_large_images_and_fonts_are_exempt_from_the_size_rule(tmp_path):
    big = b"\x89PNG\r\n\x1a\n" + b"\0" * (300 * 1024)
    folder = plugin(tmp_path, {"assets/hero.png": big, "assets/font.woff2": big})
    assert limits.violations(folder) == []


def test_other_binaries_are_held(tmp_path):
    folder = plugin(tmp_path, {"assets/icon.ico": b"\0\0\1\0", "bundle.zip": b"PK\3\4\0"})
    assert limits.violations(folder) == [
        "assets/icon.ico: binary file the validator can't read",
        "bundle.zip: binary file the validator can't read",
    ]


def test_plugin_folders_come_from_the_marketplace(tmp_path):
    plugin(tmp_path, {})
    (tmp_path / ".claude-plugin").mkdir()
    (tmp_path / ".claude-plugin" / "marketplace.json").write_text(
        json.dumps({"plugins": [{"name": "demo", "source": "./plugins/demo"}]})
    )
    assert limits.plugin_folders(tmp_path) == [tmp_path / "plugins" / "demo"]
    assert limits.main(["check", str(tmp_path)]) == 0
