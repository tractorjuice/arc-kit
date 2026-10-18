"""eval-headless.py's variant mode, without a model.

`--variant` runs each case twice, once on the plugin as it stands and once
with a changed command, template or reference laid over a copy of it, and
reports the graders whose results moved. These tests hold the two arms to
differing only in the variant's files, and check the comparison and its
replay with a stand-in for `claude` that writes the document only when it
sees the variant's command.
"""

from __future__ import annotations

import importlib.util
import json
import os
import sys
from pathlib import Path

import pytest

REPO = Path(__file__).resolve().parents[2]
PLUGIN = REPO / "plugins" / "arckit-claude"

spec = importlib.util.spec_from_file_location("eval_headless", REPO / "scripts" / "eval-headless.py")
eval_headless = importlib.util.module_from_spec(spec)
spec.loader.exec_module(eval_headless)


def tree(root: Path) -> dict[str, bytes]:
    return {str(p.relative_to(root)): p.read_bytes() for p in root.rglob("*") if p.is_file()}


# ── Building the variant ─────────────────────────────────────────────


def test_a_file_variant_replaces_the_invoked_command(tmp_path):
    body = tmp_path / "sobc-shorter.md"
    body.write_text("---\ndescription: x\n---\n\nShorter\n", encoding="utf-8")
    assert eval_headless.variant_files(body, "sobc") == {"commands/sobc.md": body}


def test_a_directory_variant_mirrors_the_plugin_layout(tmp_path):
    variant = tmp_path / "variant"
    (variant / "commands").mkdir(parents=True)
    (variant / "templates").mkdir()
    (variant / "__pycache__").mkdir()
    (variant / "commands" / "sobc.md").write_text("a", encoding="utf-8")
    (variant / "templates" / "sobc-template.md").write_text("b", encoding="utf-8")
    (variant / ".DS_Store").write_text("junk", encoding="utf-8")
    (variant / "__pycache__" / "x.pyc").write_text("junk", encoding="utf-8")
    assert sorted(eval_headless.variant_files(variant, None)) == \
        ["commands/sobc.md", "templates/sobc-template.md"]


def test_a_missing_or_empty_variant_is_rejected(tmp_path):
    with pytest.raises(FileNotFoundError):
        eval_headless.variant_files(tmp_path / "nope", "sobc")
    (tmp_path / "empty").mkdir()
    with pytest.raises(ValueError):
        eval_headless.variant_files(tmp_path / "empty", None)


def test_check_variant_splits_changed_from_added_and_refuses_a_no_op(tmp_path):
    same = tmp_path / "same.md"
    same.write_bytes((PLUGIN / "commands" / "sobc.md").read_bytes())
    with pytest.raises(ValueError, match="identical"):
        eval_headless.check_variant(PLUGIN, {"commands/sobc.md": same})

    edited = tmp_path / "edited.md"
    edited.write_text("changed", encoding="utf-8")
    new = tmp_path / "new.md"
    new.write_text("new reference", encoding="utf-8")
    same_adr = tmp_path / "adr.md"
    same_adr.write_bytes((PLUGIN / "commands" / "adr.md").read_bytes())
    changed, added = eval_headless.check_variant(
        PLUGIN, {"commands/sobc.md": edited, "references/new-rule.md": new, "commands/adr.md": same_adr})
    assert changed == ["commands/sobc.md"]
    assert added == ["references/new-rule.md"]


def test_a_file_variant_needs_one_command_across_the_cases():
    cases = [{"prompt": "/arckit:sobc 001"}, {"prompt": "/arckit:sobc 002"}]
    assert eval_headless.single_command(cases) == "sobc"
    with pytest.raises(ValueError, match="sobc"):
        eval_headless.single_command(cases + [{"prompt": "/arckit:requirements 001"}])


def test_the_arms_differ_only_in_the_variant_files(tmp_path):
    edited = tmp_path / "sobc.md"
    edited.write_text("---\ndescription: shorter sobc\neffort: max\n---\n\nShorter\n", encoding="utf-8")
    baseline = eval_headless.build_plugin(PLUGIN, tmp_path / "baseline", command="sobc", effort="high")
    variant = eval_headless.build_plugin(PLUGIN, tmp_path / "variant", command="sobc", effort="high",
                                         overlay={"commands/sobc.md": edited})
    a, b = tree(baseline), tree(variant)
    assert a.keys() == b.keys()
    assert [rel for rel in a if a[rel] != b[rel]] == ["commands/sobc.md"]
    # --effort still wins over the variant's own effort line, in both arms.
    assert b"effort: high" in b["commands/sobc.md"] and b"effort: max" not in b["commands/sobc.md"]
    assert b"effort: high" in a["commands/sobc.md"]


# ── Comparing the arms ───────────────────────────────────────────────


def entry(case: str, score: float, cost: float, **graders: bool) -> dict:
    return {"case": case, "score": score, "cost_usd": cost, "output_tokens": 1000, "early_stop": None,
            "graders": [{"name": n, "type": "regex", "passed": p} for n, p in graders.items()]
            + [{"name": "judged", "type": "llm", "skipped": True}]}


def test_compare_reports_only_the_graders_that_moved():
    baseline = [entry("sobc", 0.5, 4.0, risks=False, order=True),
                entry("sobc", 0.5, 4.0, risks=False, order=True)]
    variant = [entry("sobc", 1.0, 3.0, risks=True, order=True),
               entry("sobc", 0.5, 3.0, risks=True, order=False)]
    [row] = eval_headless.compare(baseline, variant)
    assert row["case"] == "sobc"
    assert row["runs"] == {"baseline": 2, "variant": 2}
    assert row["score"] == {"baseline": 0.5, "variant": 0.75}
    assert row["cost_usd"] == {"baseline": 8.0, "variant": 6.0}
    assert row["graders"] == [
        {"name": "order", "baseline": [2, 2], "variant": [1, 2], "change": "worse"},
        {"name": "risks", "baseline": [0, 2], "variant": [2, 2], "change": "better"},
    ]


def test_compare_keeps_a_case_one_arm_has_no_recording_for():
    [row] = eval_headless.compare([entry("adr", 1.0, 2.0, tco=True)], [])
    assert row["runs"] == {"baseline": 1, "variant": 0}
    assert row["score"]["variant"] is None
    assert row["graders"] == []


# ── A whole comparison, live and replayed ────────────────────────────


FAKE_CLAUDE = """#!/bin/sh
while [ $# -gt 0 ]; do
  if [ "$1" = "--plugin-dir" ]; then plugin="$2"; fi
  shift
done
if grep -q WRITE-THE-FILE "$plugin/commands/demo.md"; then echo written > out.md; fi
echo '{"type": "result", "subtype": "success", "result": "ok", "total_cost_usd": 0.5, "num_turns": 1}'
"""


@pytest.fixture
def fake_run(tmp_path, monkeypatch):
    plugin = tmp_path / "plugin"
    (plugin / "commands").mkdir(parents=True)
    (plugin / "commands" / "demo.md").write_text("---\ndescription: demo\n---\n\nSay hello.\n", encoding="utf-8")
    case = plugin / "evals" / "demo-case"
    (case / "graders").mkdir(parents=True)
    (case / "case.yaml").write_text("name: demo-case\nprompt: /arckit:demo go\n", encoding="utf-8")
    (case / "graders" / "written.md").write_text("---\ntype: file_exists\npath: out.md\n---\n", encoding="utf-8")
    variant = tmp_path / "demo-v2.md"
    variant.write_text("---\ndescription: demo\n---\n\nWRITE-THE-FILE\n", encoding="utf-8")

    fake_bin = tmp_path / "bin"
    fake_bin.mkdir()
    (fake_bin / "claude").write_text(FAKE_CLAUDE, encoding="utf-8")
    (fake_bin / "claude").chmod(0o755)
    monkeypatch.setenv("PATH", f"{fake_bin}:{os.environ['PATH']}")

    def run(*argv: str) -> int:
        monkeypatch.setattr(sys, "argv", ["eval-headless.py", "--plugin", str(plugin), *argv])
        return eval_headless.main()

    return run, variant, tmp_path / "out"


def test_variant_run_records_both_arms_and_the_comparison(fake_run, capsys):
    run, variant, out = fake_run
    assert run("--variant", str(variant), "--output-dir", str(out)) == 0
    assert (out / "baseline" / "demo-case" / "recording.json").is_file()
    assert (out / "variant" / "demo-case" / "files" / "out.md").is_file()
    assert not (out / "baseline" / "demo-case" / "files" / "out.md").exists()
    assert json.loads((out / "baseline" / "aggregate.json").read_text())["cases"][0]["score"] == 0.0
    meta = json.loads((out / "variant.json").read_text())
    assert meta["changed"] == ["commands/demo.md"] and meta["added"] == []
    assert (out / "variant-files" / "commands" / "demo.md").read_text() == variant.read_text()
    [row] = json.loads((out / "comparison.json").read_text())["cases"]
    assert row["graders"] == [{"name": "written", "baseline": [0, 1], "variant": [1, 1], "change": "better"}]
    printed = capsys.readouterr().out
    assert "better  written: 0/1 → 1/1" in printed


def test_replay_of_a_comparison_rescoring_both_arms(fake_run, capsys):
    run, variant, out = fake_run
    run("--variant", str(variant), "--output-dir", str(out))
    capsys.readouterr()
    assert run("--replay", str(out)) == 0
    printed = capsys.readouterr().out
    assert "better  written: 0/1 → 1/1" in printed
    assert "[pass] demo-case (variant)" in printed and "[FAIL] demo-case (baseline)" in printed


def test_replay_finds_every_recorded_run_without_being_told_how_many(fake_run, capsys):
    """A case with `runs: 2` records demo-case.run1 and .run2. Replay used to look
    only for demo-case/, skip both, score nothing and exit 0."""
    run, variant, out = fake_run
    case_yaml = out.parent / "plugin" / "evals" / "demo-case" / "case.yaml"
    case_yaml.write_text(case_yaml.read_text(encoding="utf-8") + "runs: 2\n", encoding="utf-8")
    run("--variant", str(variant), "--output-dir", str(out))
    capsys.readouterr()
    assert run("--replay", str(out)) == 0
    printed = capsys.readouterr().out
    assert "[skip]" not in printed
    assert "better  written: 0/2 → 2/2" in printed
    assert run("--replay", str(out / "baseline")) == 1, "the baseline arm never writes the file"


def test_variant_with_replay_is_refused(fake_run):
    run, variant, out = fake_run
    with pytest.raises(SystemExit):
        run("--variant", str(variant), "--replay", str(out))
