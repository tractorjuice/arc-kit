"""Structural checks on plugins/arckit-claude/evals/ — the behavioural eval suite.

The cases run through `claude plugin eval` or `scripts/eval-headless.py`, both
of which need a model. This file needs none: it holds the case files to the
shape those runners read, and to the suite's own authoring rules, so a broken
case fails CI rather than a live run.

Rules pinned here:
  1. Every case directory has a case.yaml with name, prompt, tags, and at
     least one grader; the name matches the directory.
  2. Every grader has a known `type`; the keys each type needs are present;
     every regex compiles; every `file_exists` / file-target path is relative.
  3. Every `context.add_dirs[].source` resolves to a directory on disk, and
     every fixture directory under evals/fixtures/ is used by some case.
  4. Every case tagged `injection` names its should-serve counterpart in a
     grader body, and that counterpart exists and is tagged `should-serve`.
  5. No case grants a tool the plugin's readers are denied (`WebFetch`,
     `WebSearch`) unless the case is tagged `network`.
  6. `evals/results/` is gitignored, so a recording can never be committed
     by accident.
  7. Every fixture file is tracked by git. The repo-wide `projects/` ignore
     rule swallowed the fixture repository on the first commit of this suite
     and CI saw cases whose fixtures did not exist (#842).
"""

from __future__ import annotations

import re
import subprocess
from pathlib import Path

import pytest
import yaml

REPO_ROOT = Path(__file__).resolve().parents[2]
EVALS = REPO_ROOT / "plugins" / "arckit-claude" / "evals"
GRADER_TYPES = {"file_exists", "regex", "tool_used", "tool_order", "llm", "baseline"}
REQUIRED_KEYS = {
    "file_exists": {"path"},
    "regex": {"pattern"},
    "tool_used": {"tool"},
    "tool_order": {"before", "after"},
    "llm": {"criteria"},
    "baseline": {"criteria"},
}


def split_frontmatter(text: str) -> tuple[dict, str]:
    assert text.startswith("---"), "grader must start with YAML frontmatter"
    parts = text.split("---", 2)
    assert len(parts) >= 3, "grader frontmatter is not closed"
    return yaml.safe_load(parts[1]) or {}, parts[2]


def case_dirs() -> list[Path]:
    return sorted(p.parent for p in EVALS.glob("*/case.yaml"))


def load_case(case_dir: Path) -> dict:
    case = yaml.safe_load((case_dir / "case.yaml").read_text(encoding="utf-8")) or {}
    case["_dir"] = case_dir
    case["_graders"] = {}
    for g in sorted((case_dir / "graders").glob("*.md")):
        fm, body = split_frontmatter(g.read_text(encoding="utf-8"))
        fm["_body"] = body
        case["_graders"][g.stem] = fm
    return case


ALL_CASES = {d.name: load_case(d) for d in case_dirs()}


def test_suite_is_not_empty():
    assert len(ALL_CASES) >= 4, "the first wave has four cases; do not delete without replacing"


@pytest.mark.parametrize("name", sorted(ALL_CASES))
def test_case_shape(name):
    case = ALL_CASES[name]
    assert case.get("name") == name, f"{name}: case.yaml name must equal the directory name"
    assert isinstance(case.get("prompt"), str) and case["prompt"].strip(), f"{name}: prompt missing"
    assert case["prompt"].startswith("/arckit:"), f"{name}: prompt should invoke an /arckit: command"
    assert case.get("tags"), f"{name}: tags missing"
    assert case.get("plugins") == ["../.."], f"{name}: plugins must point at the plugin root"
    assert case["_graders"], f"{name}: no graders"
    assert int(case.get("max_turns", 0)) > 0, f"{name}: max_turns must be set"
    assert int(case.get("timeout_seconds", 0)) > 0, f"{name}: timeout_seconds must be set"


@pytest.mark.parametrize("name", sorted(ALL_CASES))
def test_graders_are_well_formed(name):
    for gname, g in ALL_CASES[name]["_graders"].items():
        kind = g.get("type")
        assert kind in GRADER_TYPES, f"{name}/{gname}: unknown grader type {kind!r}"
        missing = REQUIRED_KEYS[kind] - set(g)
        assert not missing, f"{name}/{gname}: missing {sorted(missing)}"
        if kind == "regex":
            re.compile(g["pattern"])
            assert g.get("match", "contains") in {"contains", "not_contains"}, f"{name}/{gname}: bad match"
            target = g.get("target", "last_message")
            if isinstance(target, dict):
                assert target.get("source") == "file" and target.get("path"), f"{name}/{gname}: bad file target"
                assert not str(target["path"]).startswith("/"), f"{name}/{gname}: file target must be relative"
            else:
                assert target in {"last_message", "trace", "files", "mock_calls"}, f"{name}/{gname}: bad target"
        if kind == "file_exists":
            assert not str(g["path"]).startswith("/"), f"{name}/{gname}: path must be relative"
        if kind == "tool_used":
            lo = int(g.get("min", 1))
            hi = g.get("max")
            assert lo >= 0 and (hi is None or int(hi) >= lo), f"{name}/{gname}: min/max inconsistent"
            if "input_match" in g:
                re.compile(g["input_match"])


@pytest.mark.parametrize("name", sorted(ALL_CASES))
def test_fixture_sources_resolve(name):
    case = ALL_CASES[name]
    for entry in (case.get("context") or {}).get("add_dirs") or []:
        src = (case["_dir"] / entry["source"]).resolve()
        assert src.is_dir(), f"{name}: add_dirs source {entry['source']} does not resolve"
        assert EVALS in src.parents, f"{name}: fixture must live under evals/"
        assert not str(entry.get("dest", ".")).startswith("/"), f"{name}: dest must be relative"


def test_every_fixture_is_used():
    used = set()
    for case in ALL_CASES.values():
        for entry in (case.get("context") or {}).get("add_dirs") or []:
            used.add((case["_dir"] / entry["source"]).resolve())
    leaves = [p for p in (EVALS / "fixtures").rglob("*") if p.is_dir() and not any(c.is_dir() for c in p.iterdir())]
    for leaf in leaves:
        assert any(leaf == u or u in leaf.parents for u in used), f"unused fixture directory {leaf.relative_to(EVALS)}"


def test_injection_cases_have_should_serve_counterparts():
    injections = {n: c for n, c in ALL_CASES.items() if "injection" in c.get("tags", [])}
    assert injections, "expected at least one injection case"
    for name, case in injections.items():
        bodies = " ".join(g["_body"] for g in case["_graders"].values())
        partners = [n for n in ALL_CASES if n != name and n in bodies]
        assert partners, f"{name}: name the should-serve counterpart case in a grader body"
        for p in partners:
            assert "should-serve" in ALL_CASES[p].get("tags", []), f"{name}: counterpart {p} is not tagged should-serve"
        neg = [g for g in case["_graders"].values() if g.get("type") == "regex" and g.get("match") == "not_contains"]
        assert neg, f"{name}: an injection case asserts the negative in code (a not_contains regex)"
        writes = [g for g in case["_graders"].values() if g.get("type") == "tool_used" and g.get("tool") == "Write" and int(g.get("min", 1)) >= 1]
        assert writes, f"{name}: an injection case still requires the artefact to be written (no over-refusal)"


@pytest.mark.parametrize("name", sorted(ALL_CASES))
def test_no_network_tools_without_tag(name):
    case = ALL_CASES[name]
    granted = set(case.get("allowed_tools") or [])
    if "network" not in case.get("tags", []):
        assert not granted & {"WebFetch", "WebSearch"}, f"{name}: network tools need the `network` tag"


def test_results_dir_is_gitignored():
    gitignore = (REPO_ROOT / ".gitignore").read_text(encoding="utf-8")
    assert "evals/results/" in gitignore, "plugins/arckit-claude/evals/results/ must be gitignored"


def test_evals_dir_is_not_shipped_by_converter():
    converter = (REPO_ROOT / "scripts" / "converter.py").read_text(encoding="utf-8")
    assert '("evals"' not in converter, "evals/ is maintainer tooling and must not be copied to extensions"


def test_every_fixture_file_is_tracked_by_git():
    tracked = set(subprocess.run(
        ["git", "ls-files", "--", str(EVALS / "fixtures")],
        cwd=REPO_ROOT, capture_output=True, text=True, check=True,
    ).stdout.split())
    on_disk = {str(p.relative_to(REPO_ROOT)) for p in (EVALS / "fixtures").rglob("*") if p.is_file()}
    missing = sorted(on_disk - tracked)
    assert not missing, f"fixture files on disk but not tracked (an ignore rule is eating them): {missing}"
