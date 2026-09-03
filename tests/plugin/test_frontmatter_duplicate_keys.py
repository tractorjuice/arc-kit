"""No command, agent or skill frontmatter carries a duplicate mapping key.

PyYAML's SafeLoader keeps the last value of a repeated key and says nothing,
so a pasted-twice `description:` or a second `handoffs:` block would load
without error and silently discard the first. The structural tests use
safe_load and would not notice. This loader raises on the first duplicate.
Scope: every plugin's commands/, the core agents/, every plugin's skills/.
"""

from __future__ import annotations

import glob
import os

import pytest
import yaml

REPO_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))


class DuplicateKeyError(yaml.YAMLError):
    pass


class StrictLoader(yaml.SafeLoader):
    pass


def _construct_mapping(loader, node, deep=False):
    seen = set()
    for key_node, _ in node.value:
        key = loader.construct_object(key_node, deep=deep)
        if key in seen:
            raise DuplicateKeyError(f"duplicate key {key!r} at line {key_node.start_mark.line + 1}")
        seen.add(key)
    return yaml.SafeLoader.construct_mapping(loader, node, deep)


StrictLoader.add_constructor(yaml.resolver.BaseResolver.DEFAULT_MAPPING_TAG, _construct_mapping)


def frontmatter_files():
    patterns = [
        "plugins/*/commands/*.md",
        "plugins/arckit-claude/agents/*.md",
        "plugins/*/skills/*/SKILL.md",
    ]
    files = []
    for pattern in patterns:
        files.extend(glob.glob(os.path.join(REPO_ROOT, pattern)))
    return sorted(files)


def test_scope_is_not_empty():
    assert len(frontmatter_files()) > 100


@pytest.mark.parametrize("path", frontmatter_files(), ids=lambda p: os.path.relpath(p, REPO_ROOT))
def test_frontmatter_has_no_duplicate_keys(path):
    with open(path, encoding="utf-8") as f:
        content = f.read()
    if not content.startswith("---"):
        pytest.skip("no frontmatter")
    parts = content.split("---", 2)
    assert len(parts) >= 3, f"{path}: frontmatter not closed"
    try:
        yaml.load(parts[1], Loader=StrictLoader)
    except DuplicateKeyError as e:
        pytest.fail(f"{os.path.relpath(path, REPO_ROOT)}: {e}")
