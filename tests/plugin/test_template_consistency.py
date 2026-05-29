"""
Template consistency checks for arckit-*/commands/*.md source files.

For every template referenced via ${CLAUDE_PLUGIN_ROOT}/templates/<name> in a
command body, verifies the template file exists in both:
  - <plugin>/templates/<name>     (plugin-bundled copy — the plugin that owns the command)
  - .arckit/templates/<name>      (CLI-scaffolded copy, merged across all plugins)

v5.0.0+: commands live across 6 plugin source directories (core + 5
community overlays). Each plugin's commands reference templates in its
own templates/ dir; the CLI-scaffolded copy is the union.
"""

import os
import re
import glob
import pytest

REPO_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
PLUGIN_SOURCES = [
    "arckit-claude",
    "arckit-uae",
    "arckit-fr",
    "arckit-ca",
    "arckit-eu",
    "arckit-at",
    "arckit-au",
    "arckit-us",
    "arckit-uk-finance",
    "arckit-uk-nhs",
]
CLI_TEMPLATES_DIR = os.path.join(REPO_ROOT, ".arckit", "templates")

_TEMPLATE_RE = re.compile(r"\$\{CLAUDE_PLUGIN_ROOT\}/templates/([\w-]+\.md)")


def _collect_template_refs():
    """Return list of (plugin_dir, command_basename, template_filename) tuples."""
    refs = []
    for plugin in PLUGIN_SOURCES:
        commands_dir = os.path.join(REPO_ROOT, plugin, "commands")
        if not os.path.isdir(commands_dir):
            continue
        for path in sorted(glob.glob(os.path.join(commands_dir, "*.md"))):
            name = os.path.basename(path)
            with open(path, "r", encoding="utf-8") as f:
                body = f.read()
            for tmpl in sorted(set(_TEMPLATE_RE.findall(body))):
                refs.append((plugin, name, tmpl))
    return refs


_ALL_REFS = _collect_template_refs()


@pytest.fixture(
    params=_ALL_REFS,
    ids=lambda p: f"{p[0]}/{p[1]}→{p[2]}",
)
def template_ref(request):
    return request.param


def test_template_exists_in_plugin_dir(template_ref):
    """Template referenced in command must exist in its own plugin's templates/."""
    plugin, cmd_name, tmpl = template_ref
    path = os.path.join(REPO_ROOT, plugin, "templates", tmpl)
    assert os.path.isfile(path), (
        f"{plugin}/commands/{cmd_name} references '{tmpl}' but it is missing from {plugin}/templates/"
    )


def test_template_exists_in_cli_dir(template_ref):
    """Template referenced in command must exist in .arckit/templates/ (CLI copy)."""
    plugin, cmd_name, tmpl = template_ref
    path = os.path.join(CLI_TEMPLATES_DIR, tmpl)
    assert os.path.isfile(path), (
        f"{plugin}/commands/{cmd_name} references '{tmpl}' but it is missing from .arckit/templates/"
    )


def test_plugin_and_cli_templates_are_in_sync():
    """Every template across all 6 plugin templates/ dirs must also exist in .arckit/templates/."""
    plugin_files: set[str] = set()
    for plugin in PLUGIN_SOURCES:
        plugin_files.update(
            os.path.basename(p)
            for p in glob.glob(os.path.join(REPO_ROOT, plugin, "templates", "*.md"))
        )
    cli_files = {
        os.path.basename(p)
        for p in glob.glob(os.path.join(CLI_TEMPLATES_DIR, "*.md"))
    }
    only_in_plugins = plugin_files - cli_files
    only_in_cli = cli_files - plugin_files
    messages = []
    if only_in_plugins:
        messages.append(
            "In a plugin templates/ dir but not .arckit/templates/: "
            f"{sorted(only_in_plugins)}"
        )
    if only_in_cli:
        messages.append(
            "In .arckit/templates/ but not in any plugin templates/ dir: "
            f"{sorted(only_in_cli)}"
        )
    assert not messages, "\n".join(messages)
