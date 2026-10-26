"""The Gemini hooks' doc-type tables match config/doc-types.mjs.

The Gemini CLI hooks are hand-kept Python (extensions/arckit-gemini/hooks/
scripts/), so hook_utils.py restates DOC_TYPES, MULTI_INSTANCE_TYPES and
SUBDIR_MAP instead of importing the JavaScript config. Nothing checked the
copy, and by October 2026 it held 54 of 175 codes, 10 of 21 multi-instance
types and 10 of 26 subdirectories. validate-filename.py blocks any code it
does not know, so on Gemini /arckit:tenders, /arckit:grants and every overlay
command could not write their artefacts.
"""

import importlib.util
import json
import subprocess
import sys
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[2]
DOC_TYPES_MJS = REPO_ROOT / "plugins" / "arckit-claude" / "config" / "doc-types.mjs"
GEMINI_SCRIPTS = REPO_ROOT / "extensions" / "arckit-gemini" / "hooks" / "scripts"

FIX_HINT = (
    "Update DOC_TYPES, MULTI_INSTANCE_TYPES and SUBDIR_MAP in "
    "extensions/arckit-gemini/hooks/scripts/hook_utils.py to match "
    "plugins/arckit-claude/config/doc-types.mjs."
)


def load_js_config():
    script = (
        f"const m = await import({json.dumps(DOC_TYPES_MJS.as_uri())});"
        "console.log(JSON.stringify({"
        "docTypes: Object.fromEntries(Object.entries(m.DOC_TYPES)"
        ".map(([k, v]) => [k, {name: v.name, category: v.category}])),"
        "multi: [...m.MULTI_INSTANCE_TYPES],"
        "subdirs: m.SUBDIR_MAP}));"
    )
    result = subprocess.run(
        ["node", "--input-type=module", "-e", script],
        capture_output=True, text=True, check=True,
    )
    return json.loads(result.stdout)


def load_gemini_hook_utils():
    spec = importlib.util.spec_from_file_location(
        "gemini_hook_utils", GEMINI_SCRIPTS / "hook_utils.py"
    )
    module = importlib.util.module_from_spec(spec)
    sys.path.insert(0, str(GEMINI_SCRIPTS))
    try:
        spec.loader.exec_module(module)
    finally:
        sys.path.remove(str(GEMINI_SCRIPTS))
    return module


JS = load_js_config()
PY = load_gemini_hook_utils()


def test_doc_types_match():
    assert PY.DOC_TYPES == JS["docTypes"], FIX_HINT


def test_multi_instance_types_match():
    assert PY.MULTI_INSTANCE_TYPES == set(JS["multi"]), FIX_HINT


def test_subdir_map_matches():
    assert PY.SUBDIR_MAP == JS["subdirs"], FIX_HINT


def test_every_subdir_is_scanned():
    assert set(JS["subdirs"].values()) <= set(PY.ARTIFACT_SUBDIRS)
