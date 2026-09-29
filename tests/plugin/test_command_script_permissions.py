"""Commands pre-approve their own plugin scripts natively, and nothing else.

Until 6.17 a hook approved any Bash command that named a plugin script, which
also approved anything chained to it. Scripts are now pre-approved by each
command's `allowed-tools` Bash rules, which Claude Code checks per subcommand.
Tested on Claude Code v2.1.285:

- a rule matches `node ${CLAUDE_PLUGIN_ROOT}/scripts/x.mjs args` and the
  quoted-path form on one line, and an unquoted path split with a backslash;
- it does NOT match a quoted path split with a backslash, so that form would
  prompt;
- the old mktemp / heredoc / validator / rm block can't be pre-approved at all
  (the /tmp writes need approval, and a heredoc of JSON trips Claude Code's
  expansion-obfuscation check), which is why reader validation moved into
  hooks/validate-reader-handoff.mjs.
"""

from __future__ import annotations

import re
from pathlib import Path

import pytest
import yaml

PLUGIN = Path(__file__).resolve().parents[2] / "plugins" / "arckit-claude"
COMMANDS = sorted((PLUGIN / "commands").glob("*.md"))

# `node|bash [quote]${CLAUDE_PLUGIN_ROOT}/scripts/<file>[quote]`, or the script run directly
INVOCATION = re.compile(
    r'(?P<runner>\b(?:node|bash|sh)\s+)?(?P<q>"?)\$\{CLAUDE_PLUGIN_ROOT\}/scripts/(?P<script>[A-Za-z0-9_./-]+?\.(?:mjs|sh))(?P=q)'
)


def frontmatter(path: Path) -> dict:
    text = path.read_text(encoding="utf-8")
    return yaml.safe_load(text[4 : text.index("\n---", 4)]) or {}


def code_blocks(text: str) -> list[str]:
    """The contents of each fenced block, pairing fences in order."""
    blocks, current = [], None
    for line in text.splitlines():
        if line.strip().startswith("```"):
            if current is None:
                current = []
            else:
                blocks.append("\n".join(current))
                current = None
        elif current is not None:
            current.append(line)
    return blocks


def invocations(path: Path) -> set[tuple[str, str, bool]]:
    """(runner, script, quoted) for every script call.

    A call is `node|bash|sh <script>` anywhere in code, or a code-block line that
    starts with the script path. A bare path in inline code is a reference
    ("Validator — `…/validate-handoff.mjs`"), not a call.
    """
    text = path.read_text(encoding="utf-8")
    found = set()
    for span in code_blocks(text) + re.findall(r"`([^`\n]+)`", text):
        for m in INVOCATION.finditer(span):
            if m.group("runner"):
                found.add((m.group("runner").strip(), m.group("script"), bool(m.group("q"))))
    for block in code_blocks(text):
        for line in block.splitlines():
            m = INVOCATION.match(line.strip())
            if m and not m.group("runner"):
                found.add(("", m.group("script"), bool(m.group("q"))))
    return found


def rule_for(runner: str, script: str, quoted: bool) -> str:
    path = f"${{CLAUDE_PLUGIN_ROOT}}/scripts/{script}"
    if quoted:
        path = f'"{path}"'
    return f"Bash({runner + ' ' if runner else ''}{path} *)"


@pytest.mark.parametrize("path", COMMANDS, ids=lambda p: p.stem)
def test_every_script_call_has_a_native_rule(path):
    calls = invocations(path)
    if not calls:
        return
    rules = set(frontmatter(path).get("allowed-tools") or [])
    missing = [rule_for(*c) for c in sorted(calls) if rule_for(*c) not in rules]
    assert not missing, f"{path.name}: add to allowed-tools: {missing}"


@pytest.mark.parametrize("path", COMMANDS, ids=lambda p: p.stem)
def test_no_bash_validator_block(path):
    text = path.read_text(encoding="utf-8")
    for block in code_blocks(text):
        assert "validate-handoff.mjs" not in block, (
            f"{path.name}: reader output is validated by hooks/validate-reader-handoff.mjs, not in Bash"
        )
        assert "mktemp" not in block, f"{path.name}: a mktemp block can't be pre-approved and will prompt"


@pytest.mark.parametrize("path", COMMANDS, ids=lambda p: p.stem)
def test_no_quoted_script_path_split_over_lines(path):
    text = path.read_text(encoding="utf-8")
    bad = re.findall(r'"\$\{CLAUDE_PLUGIN_ROOT\}/scripts/[^"\n]+"[^\n]*\\\n', text)
    assert not bad, f"{path.name}: a quoted script path followed by a line continuation isn't matched by allowed-tools; put the call on one line: {bad}"


def test_rules_only_name_plugin_scripts():
    """allowed-tools must not pre-approve anything beyond the plugin's own scripts."""
    for path in COMMANDS:
        for rule in frontmatter(path).get("allowed-tools") or []:
            assert re.fullmatch(r'Bash\((?:(?:node|bash|sh) )?"?\$\{CLAUDE_PLUGIN_ROOT\}/scripts/[A-Za-z0-9_./-]+"? \*\)', rule), (
                f"{path.name}: unexpected allowed-tools rule {rule!r}"
            )
