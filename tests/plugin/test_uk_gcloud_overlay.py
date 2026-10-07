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


def _strip_comment(line: str) -> str:
    """Drop a trailing ` # comment` that sits outside any quotes (it may hold an apostrophe)."""
    for match in re.finditer(r" #", line):
        before = line[: match.start()]
        if before.count("'") % 2 == 0 and before.count('"') % 2 == 0:
            return before
    return line


def _unquoted_path_globs(markdown: str) -> list[str]:
    """Lines of a shell block holding a path glob the shell itself would expand.

    Quoted strings are removed across the whole block first, because an awk
    program in single quotes spans many lines and its regular expressions
    are not shell globs.
    """
    found = []
    for block in SHELL_BLOCK.findall(markdown):
        code = "\n".join(_strip_comment(line) for line in block.splitlines() if not line.lstrip().startswith("#"))
        for line in QUOTED.sub("''", code).splitlines():
            for word in re.split(r"[\s;|&()<>]+", line):
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


# ── Word limits on every free-text answer ────────────────────────────────────
# GCA's question export gives no word limit for most free-text answers, but
# every live listing keeps within 50, 100 or 200 words. framework-questions.md
# tabulates them by lot; each must reach its template, and the SDD commands and
# review recount the answers with the same inline awk.
FRAMEWORK = OVERLAY / "skills" / "gcloud-framework" / "references" / "framework-questions.md"
LIMIT_ROW = re.compile(r"^\| (?!Question \||---)(.+?) \| (\S+) \| (\S+) \| (\S+) \|", re.M)
WORD_COUNT_COMMANDS = ("review.md", "sdd-lot1a.md", "sdd-lot1b.md", "sdd-lot2a.md", "sdd-lot2b.md", "sdd-lot3.md")
WORD_COUNT = re.compile(r"# word count: keep identical[^\n]*\nawk '\n(.*?)' \"\$SDD\"\n```", re.S)


def _plain(text: str) -> str:
    text = text.replace("’", "'").replace("‘", "'").replace("“", '"').replace("”", '"')
    return re.sub(r"\s+", " ", text).strip().lower()


def _limit_tables() -> tuple[list[tuple[str, ...]], list[tuple[str, ...]]]:
    text = FRAMEWORK.read_text(encoding="utf-8")
    service = text.split("**Service questions** (the SDD templates):", 1)[1].split("**Lot questions**", 1)[0]
    lot = text.split("**Lot questions** (the lot questions template", 1)[1].split("\n\n", 2)[1]
    return LIMIT_ROW.findall(service), LIMIT_ROW.findall(lot)


def test_framework_questions_tabulates_the_word_limits():
    service, lot = _limit_tables()
    assert len(service) >= 40 and lot


def test_every_sdd_template_shows_each_word_limit():
    service, _ = _limit_tables()
    missing = []
    for label, *by_lot in service:
        for template, limit in zip(("sdd-lot1-template.md", "sdd-lot2-template.md", "sdd-lot3-template.md"), by_lot):
            if limit == "—":
                continue
            text = (TEMPLATES / template).read_text(encoding="utf-8")
            block = re.search(rf"^\*\*\d+\.\d+ {re.escape(label)}\*\*(.*?)(?=^\*\*\d+\.\d+ |^---|^## )", text, re.M | re.S)
            if block is None or f"**Words:** [X]/{limit}" not in block.group(1):
                missing.append(f"{template}: {label} ({limit} words)")
    assert not missing, missing


def test_lot_questions_template_states_each_word_limit():
    _, lot = _limit_tables()
    text = (TEMPLATES / "lot-questions-template.md").read_text(encoding="utf-8")
    for label, *by_lot in lot:
        limit = max(int(x) for x in by_lot if x.isdigit())
        rows = [line for line in text.splitlines() if _plain(f"**{label}**") in _plain(line)]
        assert rows and all(f"{limit} words" in row for row in rows), (label, len(rows))


def _word_count(command: str) -> str:
    match = WORD_COUNT.search((COMMANDS / command).read_text(encoding="utf-8"))
    assert match, f"{command}: no word count found"
    return match.group(1)


def test_review_and_the_sdd_commands_share_one_word_count():
    counts = {name: _word_count(name) for name in WORD_COUNT_COMMANDS}
    assert len(set(counts.values())) == 1, "the word counts differ"


SDD_SAMPLE = """## 7. User support

**7.2 Support response times** — How quickly do you respond to questions?
<!-- GCA guidance: Say if response times are different
     at weekends. -->

We respond within four working hours.

**Words:** 6/100

**7.13 Support levels** — Describe your support levels
> A note from the template that isn't part of the answer.

{long}

**Words:** {long_count}/200

**7.14 Onsite support** — Do you provide onsite support? *(choose one)*

- [x] No

**9.1 Getting started** — How do you help users start using your service?

Online training and user guides.

**Words:** 2/200

---
"""


def test_word_count_flags_answers_over_their_limit(tmp_path):
    sdd = tmp_path / "ARC-004-SDD-v1.0.md"
    sdd.write_text(SDD_SAMPLE.format(long="word " * 214, long_count=214), encoding="utf-8")
    out = _run_awk(_word_count("review.md"), sdd.name, cwd=tmp_path)
    assert out.splitlines() == [
        "ARC-004-SDD-v1.0.md:7.2 Support response times: 6/100 words",
        "ARC-004-SDD-v1.0.md:7.13 Support levels: 214/200 words, OVER by 14",
        "ARC-004-SDD-v1.0.md:9.1 Getting started: 5/200 words (the counter says 2)",
        "answers over their limit: 1",
    ], out


def test_word_count_reports_an_sdd_without_counters(tmp_path):
    sdd = tmp_path / "ARC-004-SDD-v1.0.md"
    sdd.write_text("# SDD\n\n**7.2 Support response times**\n\nWithin a day.\n", encoding="utf-8")
    out = _run_awk(_word_count("sdd-lot2b.md"), sdd.name, cwd=tmp_path)
    assert out.splitlines() == ["ARC-004-SDD-v1.0.md: no word counters", "answers over their limit: 0"], out


def test_word_count_reads_every_template_counter(tmp_path):
    for template in ("sdd-lot1-template.md", "sdd-lot2-template.md", "sdd-lot3-template.md"):
        path = TEMPLATES / template
        counters = path.read_text(encoding="utf-8").count("**Words:** [X]/")
        out = _run_awk(_word_count("sdd-lot3.md"), str(path), cwd=tmp_path)
        assert counters > 0 and len(out.splitlines()) == counters + 1, (template, counters, out)


# ── One Lot 3 rate card per supplier ─────────────────────────────────────────
# Every Lot 3 listing shows the supplier's whole card, so the card is one
# supplier-wide RATE document that pricing owns. The Lot 3 SDD lists the role
# levels that deliver the service and copies no rates, which also breaks the
# circle in which sdd-lot3 copied rates from pricing while pricing took its
# levels from the SDD.
def _section(text: str, heading: str) -> str:
    start = text.index(heading)
    end = text.find("\n## ", start + len(heading))
    return text[start:] if end == -1 else text[start:end]


def test_lot3_sdd_lists_role_levels_without_rates():
    section = _section((TEMPLATES / "sdd-lot3-template.md").read_text(encoding="utf-8"), "## 11. ")
    assert "ARC-000-RATE" in section
    header = next(line for line in section.splitlines() if line.startswith("| # | Job family"))
    assert "rate |" not in header.lower().replace("on the rate card |", ""), header


def test_pricing_owns_the_supplier_rate_card():
    pricing = (COMMANDS / "pricing.md").read_text(encoding="utf-8")
    assert "generate-document-id.mjs\" 000 RATE --filename" in pricing
    assert "rate-card-template.md" in pricing
    assert (TEMPLATES / "rate-card-template.md").is_file()
    sdd3 = (COMMANDS / "sdd-lot3.md").read_text(encoding="utf-8")
    assert "never copy its rates" in sdd3
    assert "copy its rates: `/arckit:pricing`" not in sdd3
