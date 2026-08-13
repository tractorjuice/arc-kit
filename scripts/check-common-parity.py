#!/usr/bin/env python3
"""Enforce parity between the root and plugin copies of `common.sh`/`common.py`.

ArcKit ships each helper library twice:

  scripts/bash/common.sh                          <- CLI / repo copy
  plugins/arckit-claude/scripts/bash/common.sh    <- the copy the plugin runs,
                                                     and the one `converter.py`
                                                     pushes into every extension

  scripts/python/common.py
  plugins/arckit-claude/scripts/python/common.py

Nothing checked they agreed. They drifted: commit f8544b4a (#204, "preserve
accented characters in slugify") landed in ONE of the four files, and the three
unfixed copies kept deleting the character mid-word for five months. Marketplace
users never touch `scripts/`, so the copy carrying the fix was the one they never
ran. See arc-kit#766.

The byte-identity assert used for the two `create-project.sh` copies
(`tests/plugin/test_repo_audit.py`) cannot work here, because one difference is
deliberate: `find_repo_root` keys on `.arckit/` in the root copy and on
`projects/` in the plugin copy, since a marketplace user has `projects/` but
never runs `arckit init`. A whole-file diff would report that forever, and a
guard that is always red teaches people to ignore it.

So this compares definition by definition:

  * functions are keyed by NAME, not position, because `get_templates_dir` sits
    at a different offset in each bash copy and that is cosmetic
  * a function carries the comment block immediately above it, because #204
    changed `slugify`'s comment as well as its body
  * everything outside a definition is compared as one `<preamble>` unit
  * declared divergences live in ALLOWED below and must be justified
  * an ALLOWED entry that no longer describes a real difference is itself a
    failure, so the allowlist cannot quietly grow into a list of things nobody
    checks

What this does NOT cover, and why it matters here: this compares the ROOT copy
against the PLUGIN copy of the same file. It does not compare bash against
Python. Run against `main` as of #766 it reports the `slugify` drift in the
`common.sh` pair and nothing at all for `common.py`, because both Python copies
were equally stale -- they agreed with each other while disagreeing with the
fixed bash copy. Cross-language agreement is a separate invariant, held by
`tests/plugin/test_slugify.py` (all four copies, one corpus) and
`tests/plugin/test_project_numbering.py` (bash vs Python numbering). A new
function shared by both languages needs a test of that kind; this guard will not
notice.

Usage:
    python3 scripts/check-common-parity.py           # report drift, exit 1 if any
    python3 scripts/check-common-parity.py --check   # same (CI-friendly alias)
"""

from __future__ import annotations

import argparse
import ast
import re
import sys
from dataclasses import dataclass, field
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent

PREAMBLE = "<preamble>"
MODULE_DOCSTRING = "<module docstring>"


@dataclass(frozen=True)
class Pair:
    label: str
    root: Path
    plugin: Path
    language: str
    # name -> why this difference is intentional
    allowed: dict[str, str] = field(default_factory=dict)


FIND_REPO_ROOT_REASON = (
    "Deliberate: the root copy looks for .arckit/ (CLI-scaffolded repos), the "
    "plugin copy looks for projects/ (marketplace users never run `arckit init`, "
    "so they have projects/ but no .arckit/). The two are exactly complementary."
)

MODULE_DOCSTRING_REASON = (
    "Deliberate: the docstring states which repo-root marker the copy uses, and "
    "so tracks the find_repo_root divergence above."
)

PAIRS = (
    Pair(
        label="common.sh",
        root=REPO_ROOT / "scripts/bash/common.sh",
        plugin=REPO_ROOT / "plugins/arckit-claude/scripts/bash/common.sh",
        language="bash",
        allowed={"find_repo_root": FIND_REPO_ROOT_REASON},
    ),
    Pair(
        label="common.py",
        root=REPO_ROOT / "scripts/python/common.py",
        plugin=REPO_ROOT / "plugins/arckit-claude/scripts/python/common.py",
        language="python",
        allowed={
            "find_repo_root": FIND_REPO_ROOT_REASON,
            MODULE_DOCSTRING: MODULE_DOCSTRING_REASON,
        },
    ),
)


@dataclass(frozen=True)
class Finding:
    name: str
    # differs        - present in both, bodies disagree, not allowlisted
    # missing        - defined in only one copy
    # stale-allowlist- allowlisted but identical (or absent) in both copies
    kind: str
    detail: str = ""


# --- parsing -----------------------------------------------------------------

BASH_FUNCTION = re.compile(r"^([A-Za-z_][A-Za-z0-9_]*)\(\)\s*\{\s*$")


def _leading_comment(lines: list[str], start: int) -> int:
    """Index of the first line of the comment block directly above `start`.

    Stops at a blank line, so a section banner separated by a blank line stays
    in the preamble rather than attaching itself to the next function.
    """
    first = start
    while first > 0 and lines[first - 1].lstrip().startswith("#"):
        first -= 1
    return first


def parse_bash(source: str) -> dict[str, str]:
    lines = source.splitlines()
    blocks: dict[str, str] = {}
    consumed = [False] * len(lines)

    i = 0
    while i < len(lines):
        match = BASH_FUNCTION.match(lines[i])
        if not match:
            i += 1
            continue

        end = i
        while end < len(lines) and lines[end] != "}":
            end += 1

        start = _leading_comment(lines, i)
        blocks[match.group(1)] = "\n".join(lines[start : end + 1])
        for n in range(start, min(end + 1, len(lines))):
            consumed[n] = True
        i = end + 1

    blocks[PREAMBLE] = "\n".join(
        line for n, line in enumerate(lines) if not consumed[n] and line.strip()
    )
    return blocks


def parse_python(source: str) -> dict[str, str]:
    lines = source.splitlines()
    tree = ast.parse(source)
    blocks: dict[str, str] = {}
    consumed = [False] * len(lines)

    docstring = ast.get_docstring(tree)
    if docstring is not None:
        blocks[MODULE_DOCSTRING] = docstring
        first = tree.body[0]
        for n in range(first.lineno - 1, first.end_lineno):
            consumed[n] = True

    for node in tree.body:
        if isinstance(node, (ast.FunctionDef, ast.AsyncFunctionDef, ast.ClassDef)):
            name = node.name
        elif isinstance(node, ast.Assign) and len(node.targets) == 1 and isinstance(node.targets[0], ast.Name):
            name = node.targets[0].id
        else:
            continue

        start = _leading_comment(lines, node.lineno - 1)
        # Decorators sit above the def line and are already inside lineno for
        # Python 3.8+, but guard anyway so a decorated helper is not truncated.
        for decorator in getattr(node, "decorator_list", []):
            start = min(start, _leading_comment(lines, decorator.lineno - 1))

        blocks[name] = "\n".join(lines[start : node.end_lineno])
        for n in range(start, node.end_lineno):
            consumed[n] = True

    blocks[PREAMBLE] = "\n".join(
        line for n, line in enumerate(lines) if not consumed[n] and line.strip()
    )
    return blocks


PARSERS = {"bash": parse_bash, "python": parse_python}


# --- comparison --------------------------------------------------------------


def compare(root_source: str, plugin_source: str, *, language: str, allowed: set[str]) -> list[Finding]:
    parse = PARSERS[language]
    root = parse(root_source)
    plugin = parse(plugin_source)

    findings: list[Finding] = []

    for name in sorted(set(root) | set(plugin)):
        in_both = name in root and name in plugin

        if not in_both:
            where = "root" if name in root else "plugin"
            findings.append(
                Finding(name, "missing", f"defined only in the {where} copy")
            )
            continue

        identical = root[name] == plugin[name]

        if name in allowed:
            if identical:
                findings.append(
                    Finding(
                        name,
                        "stale-allowlist",
                        "allowlisted as an intentional divergence, but the two "
                        "copies are now identical - remove the entry",
                    )
                )
            continue

        if not identical:
            findings.append(Finding(name, "differs", _first_difference(root[name], plugin[name])))

    for name in sorted(allowed - (set(root) | set(plugin))):
        findings.append(
            Finding(
                name,
                "stale-allowlist",
                "allowlisted but no such definition exists in either copy",
            )
        )

    return findings


def _first_difference(a: str, b: str) -> str:
    a_lines, b_lines = a.splitlines(), b.splitlines()
    for n in range(max(len(a_lines), len(b_lines))):
        left = a_lines[n] if n < len(a_lines) else "<end of definition>"
        right = b_lines[n] if n < len(b_lines) else "<end of definition>"
        if left != right:
            return f"first difference at line {n + 1} of the definition:\n      root:   {left.strip()}\n      plugin: {right.strip()}"
    return ""


def check_pair(pair: Pair) -> list[Finding]:
    return compare(
        pair.root.read_text(encoding="utf-8"),
        pair.plugin.read_text(encoding="utf-8"),
        language=pair.language,
        allowed=set(pair.allowed),
    )


def format_findings(pair: Pair, findings: list[Finding]) -> str:
    out = [f"\n{pair.label} parity FAILED ({len(findings)} finding(s)):", f"  root:   {pair.root.relative_to(REPO_ROOT)}", f"  plugin: {pair.plugin.relative_to(REPO_ROOT)}", ""]
    for finding in findings:
        out.append(f"  [{finding.kind}] {finding.name}")
        if finding.detail:
            out.append(f"      {finding.detail}")
    out.append(
        "\nThe two copies must agree definition by definition. If a difference is\n"
        "deliberate, add it to ALLOWED in scripts/check-common-parity.py with the\n"
        "reason - do not silence it by editing this script's parser."
    )
    return "\n".join(out)


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--check", action="store_true", help="CI-friendly alias (default behaviour)")
    parser.parse_args()

    failed = False
    for pair in PAIRS:
        findings = check_pair(pair)
        if findings:
            failed = True
            print(format_findings(pair, findings), file=sys.stderr)
        else:
            print(f"{pair.label}: root and plugin copies in parity "
                  f"({len(pair.allowed)} declared divergence(s))")

    return 1 if failed else 0


if __name__ == "__main__":
    sys.exit(main())
