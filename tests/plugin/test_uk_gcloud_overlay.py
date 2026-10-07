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
    """Lines of a shell block holding a path glob the shell itself would expand.

    Quoted strings are removed across the whole block first, because an awk
    program in single quotes spans many lines and its regular expressions
    are not shell globs.
    """
    found = []
    for block in SHELL_BLOCK.findall(markdown):
        code = "\n".join(line for line in block.splitlines() if not line.lstrip().startswith("#"))
        for line in QUOTED.sub("''", code).splitlines():
            for word in re.split(r"[\s;|&()<>]+", line.split(" #", 1)[0]):
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


# ── One placeholder scan ─────────────────────────────────────────────────────
# review and submission-pack looked only for a bare `[PENDING]`, so the
# `[PENDING: …]` and `[PENDING — …]` the commands themselves write passed as
# finished. Both now run the same inline awk scan; it must stay one scan.
PLACEHOLDER_SCAN_COMMANDS = ("review.md", "submission-pack.md")
AWK_PROGRAM = re.compile(r"\| xargs -0 awk '\n(.*?)'\n```", re.S)


def _placeholder_scan(command: str) -> str:
    text = (COMMANDS / command).read_text(encoding="utf-8")
    start = text.index("# placeholder scan: keep identical")
    match = AWK_PROGRAM.search(text, start)
    assert match, f"{command}: no placeholder scan found"
    return match.group(1)


def test_review_and_submission_pack_share_one_placeholder_scan():
    scans = {name: _placeholder_scan(name) for name in PLACEHOLDER_SCAN_COMMANDS}
    assert len(set(scans.values())) == 1, "the placeholder scans differ: " + ", ".join(scans)


def _run_awk(program: str, *args: str, cwd: Path) -> str:
    import shutil
    import subprocess

    awk = shutil.which("awk")
    if awk is None:  # pragma: no cover - every CI image has awk
        import pytest

        pytest.skip("awk not installed")
    result = subprocess.run([awk, program, *args], capture_output=True, text=True, cwd=cwd, check=False)
    assert result.returncode == 0, result.stderr
    return result.stdout


SAMPLE_DOCUMENT = """# Service Definition Document: Case Management

| Field | Value |
|-------|-------|
| **Owner** | [OWNER_NAME_AND_ROLE] |
| **Reviewed By** | [PENDING] |
| **Approved By** | [PENDING] |

- Write anything the supplier hasn't confirmed as `[PENDING]`.

<!-- GCA guidance: say [ANSWER] here,
     even across lines [PENDING] -->

We respond within four hours [WEB-1-C1]. See [GOV.UK](https://www.gov.uk).

**Words:** [X]/100

- [x] Yes
- [X] No

| Option | Selected |
|---|---|
| Yes | [X] |

Answer: [PENDING: confirm the support hours]
Other: [PENDING — the supplier decides and answers this]
Older: [TODO], *[TO BE ADDED]* and [TBC]
Fields: [ANSWER] and [SERVICE_NAME]

```text
[PENDING] inside a fence
```

## Revision History

| Version | Date | Author | Changes | Approved By | Approval Date |
|---|---|---|---|---|---|
| 1.0 | 2026-10-07 | ArcKit AI | Initial | [PENDING] | [PENDING] |
"""


def test_placeholder_scan_finds_every_unfinished_answer(tmp_path):
    document = tmp_path / "ARC-004-SDD-v1.0.md"
    document.write_text(SAMPLE_DOCUMENT, encoding="utf-8")
    templates = sorted(str(p) for p in TEMPLATES.glob("*-template.md"))
    out = _run_awk(_placeholder_scan("review.md"), *templates, "phase=2", document.name, cwd=tmp_path)
    found = [line.split(": ", 1)[1] for line in out.splitlines() if line.startswith(document.name)]
    assert found == [
        "template [OWNER_NAME_AND_ROLE]",
        "template [X]",
        "pending [PENDING: confirm the support hours]",
        "pending [PENDING — the supplier decides and answers this]",
        "pending [TODO]",
        "pending [TO BE ADDED]",
        "pending [TBC]",
        "template [ANSWER]",
        "template [SERVICE_NAME]",
    ], out
    assert out.rstrip().endswith("placeholders: 9"), out


def test_placeholder_scan_passes_a_finished_document(tmp_path):
    document = tmp_path / "ARC-004-SECA-v1.0.md"
    document.write_text(
        "# Security\n\n| **Approved By** | [PENDING] |\n\nPen testing every 6 months [PT-C1].\n"
        "- [x] Yes\n\nWrite `[PENDING]` for anything unconfirmed.\n",
        encoding="utf-8",
    )
    templates = sorted(str(p) for p in TEMPLATES.glob("*-template.md"))
    out = _run_awk(_placeholder_scan("submission-pack.md"), *templates, "phase=2", document.name, cwd=tmp_path)
    assert out.strip() == "placeholders: 0", out
