"""Validate the generated Kimi Code CLI extension structure."""

import importlib.util
import json
from pathlib import Path


REPO_ROOT = Path(__file__).resolve().parents[2]
KIMI_ROOT = REPO_ROOT / "extensions" / "arckit-kimi"
KIMI_SKILLS = KIMI_ROOT / "skills"
KIMI_MANIFEST = KIMI_ROOT / "plugin.json"

# Frontmatter keys Kimi Code CLI accepts. Anything else is a hard failure:
# Kimi validates against a closed set, so a leaked Claude-only field breaks
# the skill at load time rather than being ignored.
KIMI_ALLOWED_FRONTMATTER_KEYS = {
    "name",
    "description",
    "license",
    "compatibility",
    "metadata",
    "type",
}


def _load_converter():
    """Import scripts/converter.py as a module without executing main()."""
    spec = importlib.util.spec_from_file_location(
        "arckit_converter", REPO_ROOT / "scripts" / "converter.py"
    )
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


def test_kimi_skill_name_prefixes_and_flattens():
    converter = _load_converter()
    assert converter.kimi_skill_name("requirements") == "arckit-requirements"
    assert converter.kimi_skill_name("wardley.climate") == "arckit-wardley-climate"


def test_kimi_skill_invocation_uses_skill_prefix():
    converter = _load_converter()
    assert converter.kimi_skill_invocation("requirements") == "/skill:arckit-requirements"
    assert (
        converter.kimi_skill_invocation("wardley.climate")
        == "/skill:arckit-wardley-climate"
    )
