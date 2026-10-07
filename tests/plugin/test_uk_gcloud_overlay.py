"""Checks for the arckit-uk-gcloud overlay that its own rules depend on.

The overlay is a port of G-Cloud Kit. Its v0.8.2 fixes came from running the
G-Cloud 15 workflow on two real supplier projects, and each check here keeps
one of those fixes from coming undone. The overlay ships no scripts of its
own, so the checks a G-Cloud Kit script made are inline shell in the
commands; the tests below run that shell and keep its copies identical.
"""

from __future__ import annotations

import re
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[2]
OVERLAY = REPO_ROOT / "plugins" / "arckit-uk-gcloud"
COMMANDS = OVERLAY / "commands"
TEMPLATES = OVERLAY / "templates"

SHELL_BLOCK = re.compile(r"^```(?:bash|sh|shell|zsh)\n(.*?)^```", re.M | re.S)
QUOTED = re.compile(r"'[^']*'|\"(?:[^\"\\]|\\.)*\"")
PATH_GLOB = re.compile(r"(?:\*|\?|\[(?![\s\]]))")


def _unquoted_path_globs(markdown: str) -> list[str]:
    """Lines of a shell block holding a path glob the shell itself would expand."""
    found = []
    for block in SHELL_BLOCK.findall(markdown):
        for line in block.splitlines():
            if line.lstrip().startswith("#"):
                continue
            code = QUOTED.sub("''", line.split(" #", 1)[0])
            for word in re.split(r"[\s;|&()<>]+", code):
                if "/" in word and PATH_GLOB.search(word):
                    found.append(line.strip())
                    break
    return found


def test_inline_shell_has_no_unquoted_path_glob():
    """Claude Code runs a command's shell in the user's shell, zsh on macOS.

    zsh stops the whole block with "no matches found" when a path glob matches
    nothing, so `ls projects/000-global/supplier/ARC-000-SOCV-v*.md` aborted
    the step in a project without that document, the case the check exists
    for. List paths with `find ... -name '...'`; a quoted pattern is fine.
    """
    offenders = {
        str(path.relative_to(REPO_ROOT)): lines
        for path in sorted(OVERLAY.rglob("*.md"))
        if (lines := _unquoted_path_globs(path.read_text(encoding="utf-8")))
    }
    assert not offenders, offenders


def test_glob_check_catches_a_bare_glob():
    sample = "```bash\nls projects/000-global/supplier/ARC-000-SUPP-v*.md 2>/dev/null\n```\n"
    assert _unquoted_path_globs(sample)
    quoted = "```bash\nfind projects -name 'ARC-*-SVCD-v*.md'\n```\n"
    assert not _unquoted_path_globs(quoted)
