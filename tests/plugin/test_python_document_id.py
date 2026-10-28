"""The Python document-ID helper's lists match config/doc-types.mjs.

`scripts/python/generate-document-id.py` and its copy under
`plugins/arckit-claude/scripts/python/` still ship: the wheel packages the root
copy, `arckit init` copies it into `.arckit/scripts/python/`, the converter puts
the plugin copy into every extension, and the Gemini extension's GEMINI.md tells
users to run it. Unlike `generate-document-id.mjs` it cannot import the registry,
so it restates MULTI_INSTANCE_TYPES. Nothing checked the copy, and by October
2026 the root copy held 10 of the 21 multi-instance codes and the plugin copy 16,
and the two files differed. A code missing here gets an ID with no -NNN-
sequence, so each run of a multi-instance command reuses the same name (#982).
"""

import importlib.util
import json
import subprocess
import sys
from pathlib import Path

import pytest

REPO_ROOT = Path(__file__).resolve().parents[2]
DOC_TYPES_MJS = REPO_ROOT / "plugins" / "arckit-claude" / "config" / "doc-types.mjs"
ROOT_COPY = REPO_ROOT / "scripts" / "python" / "generate-document-id.py"
PLUGIN_COPY = (
    REPO_ROOT / "plugins" / "arckit-claude" / "scripts" / "python" / "generate-document-id.py"
)

FIX_HINT = (
    "Update MULTI_INSTANCE_TYPES in scripts/python/generate-document-id.py to "
    "match plugins/arckit-claude/config/doc-types.mjs, then copy the file to "
    "plugins/arckit-claude/scripts/python/generate-document-id.py."
)


def load_js_multi_instance():
    script = (
        f"const m = await import({json.dumps(DOC_TYPES_MJS.as_uri())});"
        "console.log(JSON.stringify([...m.MULTI_INSTANCE_TYPES]));"
    )
    result = subprocess.run(
        ["node", "--input-type=module", "-e", script],
        capture_output=True, text=True, check=True,
    )
    return set(json.loads(result.stdout))


def load_script(path):
    spec = importlib.util.spec_from_file_location(f"docid_{path.parent.parent.name}", path)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


JS_MULTI = load_js_multi_instance()


def test_the_two_copies_are_identical():
    assert ROOT_COPY.read_bytes() == PLUGIN_COPY.read_bytes(), FIX_HINT


@pytest.mark.parametrize("path", [ROOT_COPY, PLUGIN_COPY], ids=["root", "plugin"])
def test_multi_instance_types_match_the_registry(path):
    module = load_script(path)
    missing = sorted(JS_MULTI - module.MULTI_INSTANCE_TYPES)
    extra = sorted(module.MULTI_INSTANCE_TYPES - JS_MULTI)
    assert not missing and not extra, f"missing {missing}, extra {extra}. {FIX_HINT}"


@pytest.mark.parametrize("code", sorted(JS_MULTI))
def test_every_multi_instance_code_gets_a_sequence_number(code, tmp_path):
    result = subprocess.run(
        [sys.executable, str(ROOT_COPY), "001", code, "1.0", "--filename",
         "--next-num", str(tmp_path)],
        capture_output=True, text=True, check=True,
    )
    assert result.stdout.strip() == f"ARC-001-{code}-001-v1.0.md"
