"""
Template consistency checks for arckit-claude/commands/*.md source files.

For every template referenced via ${CLAUDE_PLUGIN_ROOT}/templates/<name> in a command body,
verifies the template file exists in both:
  - arckit-claude/templates/<name>   (plugin-bundled copy)
  - .arckit/templates/<name>         (CLI-scaffolded copy)
"""

import os
import re
import glob
import pytest

REPO_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
COMMANDS_DIR = os.path.join(REPO_ROOT, "arckit-claude", "commands")
PLUGIN_TEMPLATES_DIR = os.path.join(REPO_ROOT, "arckit-claude", "templates")
CLI_TEMPLATES_DIR = os.path.join(REPO_ROOT, ".arckit", "templates")

_TEMPLATE_RE = re.compile(r"\$\{CLAUDE_PLUGIN_ROOT\}/templates/([\w-]+\.md)")


def _collect_template_refs():
    """Return list of (command_basename, template_filename) pairs."""
    refs = []
    for path in sorted(glob.glob(os.path.join(COMMANDS_DIR, "*.md"))):
        name = os.path.basename(path)
        with open(path, "r", encoding="utf-8") as f:
            body = f.read()
        for tmpl in sorted(set(_TEMPLATE_RE.findall(body))):
            refs.append((name, tmpl))
    return refs


_ALL_REFS = _collect_template_refs()


@pytest.fixture(
    params=_ALL_REFS,
    ids=lambda p: f"{p[0]}→{p[1]}",
)
def template_ref(request):
    return request.param


def test_template_exists_in_plugin_dir(template_ref):
    """Template referenced in command must exist in arckit-claude/templates/."""
    cmd_name, tmpl = template_ref
    path = os.path.join(PLUGIN_TEMPLATES_DIR, tmpl)
    assert os.path.isfile(path), (
        f"{cmd_name} references '{tmpl}' but it is missing from arckit-claude/templates/"
    )


def test_template_exists_in_cli_dir(template_ref):
    """Template referenced in command must exist in .arckit/templates/ (CLI copy)."""
    cmd_name, tmpl = template_ref
    path = os.path.join(CLI_TEMPLATES_DIR, tmpl)
    assert os.path.isfile(path), (
        f"{cmd_name} references '{tmpl}' but it is missing from .arckit/templates/"
    )


def test_plugin_and_cli_templates_are_in_sync():
    """Every template file in arckit-claude/templates/ must also exist in .arckit/templates/."""
    plugin_files = {
        os.path.basename(p)
        for p in glob.glob(os.path.join(PLUGIN_TEMPLATES_DIR, "*.md"))
    }
    cli_files = {
        os.path.basename(p)
        for p in glob.glob(os.path.join(CLI_TEMPLATES_DIR, "*.md"))
    }
    only_in_plugin = plugin_files - cli_files
    only_in_cli = cli_files - plugin_files
    messages = []
    if only_in_plugin:
        messages.append(f"In arckit-claude/templates/ but not .arckit/templates/: {sorted(only_in_plugin)}")
    if only_in_cli:
        messages.append(f"In .arckit/templates/ but not arckit-claude/templates/: {sorted(only_in_cli)}")
    assert not messages, "\n".join(messages)
