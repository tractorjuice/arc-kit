"""Assert every plugin script a command invokes is shipped to the extensions.

`/arckit:archify` and the default HTML render in `/arckit:wardley` both shell
out to `${CLAUDE_PLUGIN_ROOT}/scripts/*.mjs`. Those scripts reach the seven
generated extensions only if they are listed in `converter.py`'s
`core_only_copies`; nothing checked that, so the first cut of #851 shipped a
command that invoked three scripts none of the extensions had. The command was
entirely non-functional there and the Mermaid/HTML CI all passed.
"""

import re
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[2]
CORE_PLUGIN = REPO_ROOT / "plugins/arckit-claude"
CONVERTER = REPO_ROOT / "scripts/converter.py"

# Scripts a command may reference without shipping, with the reason.
NOT_SHIPPED_BY_DESIGN: dict[str, str] = {}

INVOCATION_RE = re.compile(
    r"\$\{CLAUDE_PLUGIN_ROOT\}/(scripts/[A-Za-z0-9._/-]+\.mjs)"
)


def referenced_scripts() -> dict[str, set[str]]:
    """scripts/<name>.mjs -> set of command files invoking it."""
    found: dict[str, set[str]] = {}
    for command in sorted((CORE_PLUGIN / "commands").glob("*.md")):
        text = command.read_text(encoding="utf-8")
        for rel in INVOCATION_RE.findall(text):
            found.setdefault(rel, set()).add(command.name)
    return found


def shipped_scripts() -> set[str]:
    """Entries of converter.py's core_only_copies under scripts/."""
    text = CONVERTER.read_text(encoding="utf-8")
    start = text.index("core_only_copies = [")
    end = text.index("]", start)
    block = text[start:end]
    return set(re.findall(r'\("(scripts/[^"]+)"', block))


def test_every_script_a_command_invokes_is_shipped():
    referenced = referenced_scripts()
    assert referenced, "no ${CLAUDE_PLUGIN_ROOT}/scripts/*.mjs invocations found — regex stale?"

    shipped = shipped_scripts()
    missing = {}
    for rel, commands in sorted(referenced.items()):
        if rel in NOT_SHIPPED_BY_DESIGN:
            continue
        # A directory entry (e.g. scripts/bash) covers files beneath it.
        if rel in shipped or any(rel.startswith(f"{s}/") for s in shipped):
            continue
        missing[rel] = sorted(commands)

    assert not missing, (
        "commands invoke scripts that converter.py never copies into the "
        "extensions:\n"
        + "\n".join(f"  {rel} <- {', '.join(cmds)}" for rel, cmds in missing.items())
        + "\n\nAdd each to core_only_copies in scripts/converter.py, or record it "
        "in NOT_SHIPPED_BY_DESIGN with a reason."
    )


def test_referenced_scripts_exist_in_the_plugin():
    """A command must not invoke a script that was renamed or never written."""
    absent = {
        rel: sorted(cmds)
        for rel, cmds in referenced_scripts().items()
        if not (CORE_PLUGIN / rel).exists()
    }
    assert not absent, f"commands invoke non-existent scripts: {absent}"


def test_shipped_script_imports_also_ship():
    """A shipped script's relative imports must ship too, at the same depth."""
    shipped = shipped_scripts()
    problems = []
    for rel in sorted(shipped):
        path = CORE_PLUGIN / rel
        if not path.is_file() or path.suffix != ".mjs":
            continue
        for imported in re.findall(r"from\s+'\./([A-Za-z0-9._-]+\.mjs)'", path.read_text(encoding="utf-8")):
            sibling = f"{path.parent.relative_to(CORE_PLUGIN)}/{imported}"
            if sibling not in shipped:
                problems.append(f"{rel} imports ./{imported}, which is not in core_only_copies")
    assert not problems, "\n".join(problems)
