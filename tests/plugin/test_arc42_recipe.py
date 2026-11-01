"""The arc42 recipe must make each worker's required source artefacts available."""

import copy
import hashlib
from pathlib import Path
import re

import pytest
import yaml


REPO_ROOT = Path(__file__).resolve().parents[2]
RECIPE = REPO_ROOT / "plugins/arckit-arc42/recipes/arc42-full.yaml"
COMMAND_DIRS = (
    REPO_ROOT / "plugins/arckit-claude/commands",
    REPO_ROOT / "plugins/arckit-arc42/commands",
    REPO_ROOT / "plugins/arckit-repo/commands",
)
HARNESS = REPO_ROOT / "plugins/arckit-claude/skills/arckit-build/SKILL.md"
DOC_TYPES = REPO_ROOT / "plugins/arckit-claude/config/doc-types.mjs"
EVIDENCE_TARGETS = ("BKLG", "CDAU", "CONF", "HLDR", "DLDR", "PRIN-COMP")


def load_targets():
    recipe = yaml.safe_load(RECIPE.read_text(encoding="utf-8"))
    return {target["id"]: target for target in recipe["targets"]}


def direct_input_types(target, targets):
    """Output types of a target's direct deps, with `ADR-*` style globs expanded."""
    types = set()
    for dependency in target["deps"]:
        if dependency.endswith("*"):
            prefix = dependency[:-1]
            types |= {t["output"]["type"] for i, t in targets.items() if i.startswith(prefix)}
        else:
            types.add(targets[dependency]["output"]["type"])
    return types


def mandatory_types(command_name):
    """Codes on the top-level bullets of a command's MANDATORY block.

    The first bold code on a bullet is the requirement; a later one on the same
    bullet is an alternative ("REQ, or at least one ADR").
    """
    path = next(d / f"{command_name}.md" for d in COMMAND_DIRS if (d / f"{command_name}.md").exists())
    lines = path.read_text(encoding="utf-8").splitlines()
    start = next((i for i, line in enumerate(lines) if "**MANDATORY**" in line), None)
    if start is None:
        return set()
    # Commands nest the block inside a numbered step, so bullets are top-level
    # relative to the MANDATORY line's own indent, not to column 0.
    indent = len(lines[start]) - len(lines[start].lstrip())
    codes = set()
    for line in lines[start + 1:]:
        if not line.strip():
            continue
        depth = len(line) - len(line.lstrip())
        if depth > indent:
            continue
        if depth < indent or not line.lstrip().startswith("- "):
            break
        match = re.match(r"- \*\*([A-Z][A-Z0-9-]+)\*\*", line.lstrip())
        if match:
            codes.add(match.group(1))
    return codes


def test_security_worker_receives_all_mandatory_artifact_types():
    """A transitive dependency orders a worker but does not grant it read access."""
    targets = load_targets()
    security = next(
        target for target in targets.values() if target["skill"] == "arckit:secure"
    )
    inputs = direct_input_types(security, targets)

    # /arckit:secure requires both in its "MANDATORY" source artefact section.
    required = {"REQ", "PRIN"}
    assert required <= inputs, (
        "The security worker may read only its direct dependency outputs; "
        f"missing mandatory artefacts: {sorted(required - inputs)}"
    )


@pytest.mark.parametrize("target_id", sorted(load_targets()))
def test_every_worker_receives_its_commands_mandatory_inputs(target_id):
    targets = load_targets()
    target = targets[target_id]
    command = target["skill"].split(":", 1)[1]
    required = mandatory_types(command) - {target["output"]["type"]}
    missing = required - direct_input_types(target, targets)
    assert not missing, (
        f"{target_id} runs /arckit:{command}, whose MANDATORY inputs include "
        f"{sorted(missing)}, but its direct deps do not produce them"
    )


def test_mandatory_parser_reads_nested_and_overlay_blocks():
    assert mandatory_types("secure") == {"REQ", "PRIN"}
    assert mandatory_types("adr") == {"PRIN", "REQ"}
    assert mandatory_types("risk") == {"STKE"}
    assert mandatory_types("arc42-quality") == {"REQ"}
    assert mandatory_types("arc42-concepts") == {"REQ"}
    assert mandatory_types("arc42-handover") == {"ARC42", "REQ"}
    assert mandatory_types("arc42-debt") == set()


# ── arckit-build's adoption, state and work-list rules ────────────────────
#
# arckit-build is a prompt, not code, so this is a reference model of the rules
# its SKILL.md states: "Dep resolution", "Recorded paths", "What's recorded",
# "Staleness rules", the wave plan and run steps 4 to 9. The tests drive the
# model through whole builds of the arc42-full recipe on fixture projects, and
# test_harness_states_the_rules_this_model_follows pins the model to that text.

PROJECT = "projects/001-demo"
PID = "001"


def multi_instance_types():
    block = re.search(r"MULTI_INSTANCE_TYPES = new Set\(\[(.*?)\]\)", DOC_TYPES.read_text(), re.S).group(1)
    return set(re.findall(r"'([A-Z0-9-]+)'", block))


def _version_key(name):
    return tuple(int(n) for n in re.search(r"-v([\d.]+)\.md$", name).group(1).split("."))


def existing_artefacts(project_dir, pid, doc_type):
    """Latest version of each instance of a doc type in the project, as the harness globs it."""
    multi = doc_type in multi_instance_types()
    pattern = f"ARC-{pid}-{doc_type}-*-v*.md" if multi else f"ARC-{pid}-{doc_type}-v*.md"
    latest = {}
    for path in project_dir.rglob(pattern):
        instance = re.sub(r"-v[\d.]+\.md$", "", path.name)
        if instance not in latest or _version_key(path.name) > _version_key(latest[instance].name):
            latest[instance] = path
    return sorted(latest.values())


def paths_of(entry):
    """`paths(t)`: the files a state entry stands for, in either shape."""
    if entry is None:
        return []
    assert not ("path" in entry and "paths" in entry), "an entry carries one shape, never both"
    if "path" in entry:
        return [entry["path"]]
    return list(entry.get("paths", []))


def is_complete(entry, root):
    """Run step 8, staleness step 1: complete, with every recorded file present."""
    files = paths_of(entry)
    return bool(entry) and entry.get("status") == "complete" and bool(files) and all(
        (root / f).is_file() for f in files)


def sha(root, relative):
    return hashlib.sha256((root / relative).read_bytes()).hexdigest()


class Resolution:
    """Run steps 4 to 6: enabled targets, adopted evidence and pruned deps."""

    def __init__(self, root, state, enable=(), exclude=()):
        recipe = yaml.safe_load(RECIPE.read_text(encoding="utf-8"))
        self.targets = {t["id"]: t for t in recipe["targets"]}
        optional = recipe["optional_targets"]
        self.state = copy.deepcopy(state)
        project_dir = root / PROJECT
        self.excluded = {tid for tid in optional if tid in exclude}
        candidates = {tid for tid, spec in optional.items()
                      if not spec["default"] and tid not in enable and tid not in exclude}
        self.adopted, self.pruned = {}, set(self.excluded)
        for tid in sorted(candidates):
            doc_type = self.targets[tid]["output"]["type"]
            found = [str(p.relative_to(root)) for p in existing_artefacts(project_dir, PID, doc_type)]
            if found:
                entry = {"status": "complete", "source": "pre-existing", "adopted": True}
                if doc_type in multi_instance_types():
                    entry["paths"] = sorted(found)
                else:
                    (entry["path"],) = found
                self.state[tid] = entry
                self.adopted[tid] = paths_of(entry)
            else:
                self.pruned.add(tid)
                if self.state.get(tid, {}).get("adopted"):
                    del self.state[tid]
        for tid in set(enable) | set(exclude):
            if self.state.get(tid, {}).get("adopted"):
                del self.state[tid]
        self.remaining = [tid for tid in self.targets if tid not in self.pruned]
        self.buildable = [tid for tid in self.remaining if tid not in self.adopted]

    def deps(self, tid):
        found = []
        for dep in self.targets[tid]["deps"]:
            if dep.endswith("*"):
                found += [d for d in self.remaining if d.startswith(dep[:-1])]
            elif dep in self.remaining:
                found.append(dep)
        return found

    def dependents(self, tid):
        return [t for t in self.remaining if tid in self.deps(t)]

    def input_keys(self, tid):
        """Input key -> repo-relative path, for every recorded file of every resolved dep."""
        keys = {}
        for dep in self.deps(tid):
            entry = self.state.get(dep)
            for path in paths_of(entry):
                keys[dep if "path" in entry else f"{dep}:{path}"] = path
        return keys

    def worker_inputs(self, tid):
        """`{INPUT_PATHS_BULLETED}`: each dep's recorded files, or its pending output."""
        found = []
        for dep in self.deps(tid):
            found += paths_of(self.state.get(dep)) or [f"<{dep} output>"]
        return found

    def record_build(self, tid, path, root):
        """Per-wave step 5: a validated target records its path and input hashes."""
        self.state[tid] = {
            "status": "complete", "path": path, "skill": self.targets[tid]["skill"],
            "input_hashes": {key: sha(root, file) for key, file in self.input_keys(tid).items()},
        }

    def work_list(self, root, refresh=(), skip_hash_check=False):
        """Run step 8: (targets to dispatch, stale targets)."""
        done = {t for t in self.remaining if is_complete(self.state.get(t), root)}
        stale = set()
        if not skip_hash_check:
            for t in sorted(done - set(self.adopted)):
                entry = self.state[t]
                if "input_hashes" not in entry:
                    continue  # state 0.3: treated as matching
                recorded, expected = entry["input_hashes"], self.input_keys(t)
                if set(recorded) - set(expected):
                    stale.add(t)
                elif "skill" in entry and set(expected) - set(recorded):
                    stale.add(t)
                elif any(not (root / expected[k]).is_file() or sha(root, expected[k]) != h
                         for k, h in recorded.items()):
                    stale.add(t)
        for name in refresh:
            if name in self.adopted:
                stale |= {d for d in self.dependents(name) if d not in self.adopted}
            else:
                stale.add(name)
        if not skip_hash_check or refresh:
            changed = True
            while changed:
                changed = False
                for t in self.buildable:
                    if t not in stale and any(d in stale for d in self.deps(t)):
                        stale.add(t)
                        changed = True
        stale -= set(self.adopted)
        pending = [t for t in self.buildable if t not in done or t in stale]
        return pending, stale

    def plan_lines(self):
        """Run step 9's adopt/exclude/prune lines."""
        lines = [f"(adopt) {t} ← {', '.join(paths)}" for t, paths in sorted(self.adopted.items())]
        lines += [f"(exclude) {t}" for t in sorted(self.excluded)]
        lines += [f"(prune) {t} ← no existing artefact" for t in sorted(self.pruned - self.excluded)]
        return lines


def build(root, resolution, pending):
    """Dispatch `pending` in waves, writing a fixture file for each target."""
    pending, waves = list(pending), []
    while pending:
        wave = [t for t in pending if all(d not in pending for d in resolution.deps(t))]
        assert wave, f"unresolvable: {pending}"
        for tid in wave:
            output = resolution.targets[tid]["output"]
            name = f"ARC-{PID}-{output['type']}-{tid}-v1.0.md" if output.get("multi_instance") \
                else f"ARC-{PID}-{output['type']}-v1.0.md"
            folder = "projects/000-global" if output["project"] == "000-global" else PROJECT
            path = f"{folder}/{name}"
            previous = resolution.state.get(tid, {}).get("path")
            if previous and previous == path:
                path = path.replace("-v1.0.md", f"-v1.{len(waves) + 1}.md")
            (root / path).parent.mkdir(parents=True, exist_ok=True)
            (root / path).write_text(f"# {tid} built in wave {len(waves)}\n", encoding="utf-8")
            resolution.record_build(tid, path, root)
            pending.remove(tid)
        waves.append(wave)
    return waves


def write(root, *relative_paths, text="# fixture\n"):
    for relative in relative_paths:
        path = root / PROJECT / relative
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(text, encoding="utf-8")


def rel(*relative_paths):
    return [f"{PROJECT}/{r}" for r in relative_paths]


AUDITS = ("audits/ARC-001-CDAU-001-v1.0.md", "audits/ARC-001-CDAU-001-v1.9.md",
          "audits/ARC-001-CDAU-001-v1.10.md", "audits/ARC-001-CDAU-002-v1.0.md",
          "audits/legacy/ARC-001-CDAU-002-v2.0.md")
LATEST_AUDITS = rel("audits/ARC-001-CDAU-001-v1.10.md", "audits/legacy/ARC-001-CDAU-002-v2.0.md")


def built_project(root, enable=("DEBT", "SDDH"), exclude=()):
    """A project with an existing backlog and two audits, built once with the recipe."""
    write(root, "ARC-001-BKLG-v1.0.md", "ARC-001-BKLG-v1.2.md", *AUDITS)
    first = Resolution(root, {}, enable=enable, exclude=exclude)
    pending, _ = first.work_list(root)
    build(root, first, pending)
    return first.state


def test_evidence_targets_are_optional_and_off_by_default():
    recipe = yaml.safe_load(RECIPE.read_text(encoding="utf-8"))
    targets = {t["id"]: t for t in recipe["targets"]}
    for tid in EVIDENCE_TARGETS:
        assert recipe["optional_targets"][tid]["default"] is False, tid
    assert "BKLG" in targets["SDDH"]["deps"]
    assert set(EVIDENCE_TARGETS) - {"BKLG"} <= set(targets["DEBT"]["deps"])


def test_adopted_single_instance_evidence_is_recorded_with_path(tmp_path):
    write(tmp_path, "ARC-001-BKLG-v1.0.md", "ARC-001-BKLG-v1.2.md")
    run = Resolution(tmp_path, {}, enable={"SDDH"})
    entry = run.state["BKLG"]
    assert entry == {"status": "complete", "source": "pre-existing", "adopted": True,
                     "path": f"{PROJECT}/ARC-001-BKLG-v1.2.md"}
    assert is_complete(entry, tmp_path)
    pending, _ = run.work_list(tmp_path)
    assert "BKLG" not in pending, "an existing backlog is read, not regenerated"
    assert "SDDH" in pending
    assert f"{PROJECT}/ARC-001-BKLG-v1.2.md" in run.worker_inputs("SDDH")


def test_adopted_multi_instance_evidence_selects_the_latest_version_of_each_instance(tmp_path):
    write(tmp_path, *AUDITS)
    run = Resolution(tmp_path, {}, enable={"DEBT"})
    entry = run.state["CDAU"]
    assert "path" not in entry
    assert entry["paths"] == LATEST_AUDITS, "v1.10 is later than v1.9; v2.0 in a subfolder still counts"
    assert is_complete(entry, tmp_path)
    for selected in entry["paths"]:
        assert (tmp_path / selected).is_file()
    for superseded in rel(*AUDITS[:3], AUDITS[3]):
        if superseded not in LATEST_AUDITS:
            assert superseded not in run.worker_inputs("DEBT")
    assert set(LATEST_AUDITS) <= set(run.worker_inputs("DEBT"))
    assert set(LATEST_AUDITS) <= set(run.worker_inputs("CONC"))


def test_completion_needs_every_recorded_path(tmp_path):
    write(tmp_path, *AUDITS)
    entry = Resolution(tmp_path, {}).state["CDAU"]
    assert is_complete(entry, tmp_path)
    (tmp_path / LATEST_AUDITS[1]).unlink()
    assert not is_complete(entry, tmp_path), "one missing adopted path invalidates the entry"
    assert not is_complete({"status": "complete", "paths": []}, tmp_path)
    assert not is_complete({"status": "complete"}, tmp_path)
    with pytest.raises(AssertionError):
        paths_of({"status": "complete", "path": LATEST_AUDITS[0], "paths": LATEST_AUDITS})


def test_hash_keys_are_unique_where_filenames_are_not(tmp_path):
    same_name = rel("audits/team-a/ARC-001-CDAU-001-v1.0.md", "audits/team-b/ARC-001-CDAU-001-v1.0.md")
    write(tmp_path, *(p.removeprefix(PROJECT + "/") for p in same_name))
    write(tmp_path, "ARC-001-REQ-v1.0.md")
    run = Resolution(tmp_path, {})
    run.state["CDAU"] = {"status": "complete", "source": "pre-existing", "adopted": True, "paths": same_name}
    run.state["REQ"] = {"status": "complete", "path": f"{PROJECT}/ARC-001-REQ-v1.0.md"}
    keys = run.input_keys("CONC")
    assert sorted(k for k in keys if k.startswith("CDAU")) == [f"CDAU:{p}" for p in same_name]
    assert len({Path(p).name for p in same_name}) == 1, "keyed by filename these two would collide"
    # A dep recorded with `path` keeps its bare ID, which no `DEP_ID:` key can
    # equal because no target ID contains ':' (check_recipes.py enforces it).
    assert keys["REQ"] == f"{PROJECT}/ARC-001-REQ-v1.0.md"
    assert len(keys) == len(set(keys.values())), "one key per file"
    assert all(":" not in tid for tid in run.targets)


def test_unchanged_project_resumes_without_dispatching_anything(tmp_path):
    state = built_project(tmp_path)
    run = Resolution(tmp_path, state, enable={"DEBT", "SDDH"})
    pending, stale = run.work_list(tmp_path)
    assert pending == [] and stale == set()
    assert "CDAU" in run.adopted and "BKLG" in run.adopted
    assert run.state["DEBT"]["input_hashes"].keys() >= {f"CDAU:{p}" for p in LATEST_AUDITS}
    pending, _ = run.work_list(tmp_path, skip_hash_check=True)
    assert pending == []


def test_resume_and_refresh_never_dispatch_an_adopted_target(tmp_path):
    state = built_project(tmp_path)
    run = Resolution(tmp_path, state, enable={"DEBT", "SDDH"})
    pending, stale = run.work_list(tmp_path, refresh={"CDAU"})
    assert "CDAU" not in pending and "CDAU" not in stale
    assert {"CONC", "DEBT", "ARC42", "SDDH"} <= set(pending), "refreshing evidence rebuilds what reads it"
    assert "REQ" not in pending


def test_changed_adopted_evidence_makes_direct_and_transitive_dependants_stale(tmp_path):
    state = built_project(tmp_path)
    (tmp_path / LATEST_AUDITS[1]).write_text("# audit edited\n", encoding="utf-8")
    run = Resolution(tmp_path, state, enable={"DEBT", "SDDH"})
    pending, stale = run.work_list(tmp_path)
    assert {"CONC", "DEBT", "ARC42"} <= stale, "direct readers of the audits"
    assert "SDDH" in stale, "SDDH reads ARC42, CONC and DEBT"
    assert "CDAU" not in pending
    assert not {"REQ", "STKE", "PRIN", "RISK", "QUAL"} & stale


def test_missing_adopted_evidence_makes_dependants_stale(tmp_path):
    state = built_project(tmp_path)
    (tmp_path / LATEST_AUDITS[0]).unlink()
    run = Resolution(tmp_path, state, enable={"DEBT", "SDDH"})
    assert run.state["CDAU"]["paths"] == rel("audits/ARC-001-CDAU-001-v1.9.md", "audits/legacy/ARC-001-CDAU-002-v2.0.md")
    _, stale = run.work_list(tmp_path)
    assert {"CONC", "DEBT", "ARC42", "SDDH"} <= stale

    for audit in (tmp_path / PROJECT / "audits").rglob("*.md"):
        audit.unlink()
    run = Resolution(tmp_path, state, enable={"DEBT", "SDDH"})
    assert "CDAU" in run.pruned and "CDAU" not in run.state, "no audits left: pruned, entry dropped"
    _, stale = run.work_list(tmp_path)
    assert {"CONC", "DEBT", "ARC42", "SDDH"} <= stale


def test_a_new_adopted_version_or_instance_makes_dependants_stale(tmp_path):
    state = built_project(tmp_path)
    write(tmp_path, "audits/ARC-001-CDAU-003-v1.0.md")
    _, stale = Resolution(tmp_path, state, enable={"DEBT", "SDDH"}).work_list(tmp_path)
    assert {"CONC", "DEBT", "ARC42", "SDDH"} <= stale

    state = built_project(tmp_path / "second")
    write(tmp_path / "second", "ARC-001-BKLG-v1.3.md", text="# backlog v1.3: two new epics\n")
    _, stale = Resolution(tmp_path / "second", state, enable={"DEBT", "SDDH"}).work_list(tmp_path / "second")
    assert "SDDH" in stale and "CONC" not in stale, "only the backlog's reader"


def test_exclude_removes_evidence_from_worker_inputs_and_state(tmp_path):
    state = built_project(tmp_path)
    write(tmp_path, "ARC-001-CONF-v1.0.md")
    run = Resolution(tmp_path, state, enable={"DEBT", "SDDH"}, exclude={"CDAU", "CONF"})
    assert "CDAU" not in run.state and "CDAU" not in run.adopted and "CDAU" not in run.buildable
    assert "CONF" not in run.adopted and "CONF" not in run.buildable
    for reader in ("CONC", "DEBT", "ARC42"):
        assert not any("CDAU" in i or "CONF" in i for i in run.worker_inputs(reader)), reader
    pending, stale = run.work_list(tmp_path)
    assert {"CONC", "DEBT", "ARC42", "SDDH"} <= stale, "built from audits it may no longer read"
    assert "CDAU" not in pending and "CONF" not in pending
    assert "(exclude) CDAU" in run.plan_lines() and "(exclude) CONF" in run.plan_lines()


def test_enable_builds_instead_of_adopting(tmp_path):
    state = built_project(tmp_path)
    run = Resolution(tmp_path, state, enable={"DEBT", "SDDH", "BKLG"})
    assert "BKLG" not in run.adopted and "BKLG" not in run.state
    pending, _ = run.work_list(tmp_path)
    assert "BKLG" in pending and "SDDH" in pending


def test_absent_evidence_is_pruned_never_generated(tmp_path):
    run = Resolution(tmp_path, {}, enable={"SDDH", "DEBT"})
    pending, _ = run.work_list(tmp_path)
    assert run.adopted == {}
    assert not set(EVIDENCE_TARGETS) & set(pending), "no evidence target is built just to satisfy a dependency"
    assert not any("BKLG" in str(i) for i in run.worker_inputs("SDDH"))
    assert "(prune) BKLG ← no existing artefact" in run.plan_lines()


def test_recorded_debt_evidence_reaches_the_debt_worker(tmp_path):
    write(
        tmp_path,
        "audits/ARC-001-CDAU-001-v1.0.md", "audits/ARC-001-CDAU-001-v1.1.md", "audits/ARC-001-CDAU-002-v1.0.md",
        "ARC-001-CONF-v1.0.md", "reviews/ARC-001-HLDR-v1.0.md", "reviews/ARC-001-DLDR-v2.0.md",
        "ARC-001-PRIN-COMP-v1.0.md",
    )
    run = Resolution(tmp_path, {}, enable={"DEBT"})
    debt_inputs = run.worker_inputs("DEBT")
    for expected in rel(
        "audits/ARC-001-CDAU-001-v1.1.md", "audits/ARC-001-CDAU-002-v1.0.md", "ARC-001-CONF-v1.0.md",
        "reviews/ARC-001-HLDR-v1.0.md", "reviews/ARC-001-DLDR-v2.0.md", "ARC-001-PRIN-COMP-v1.0.md",
    ):
        assert expected in debt_inputs, expected
    assert rel("audits/ARC-001-CDAU-001-v1.0.md")[0] not in debt_inputs, "only the latest version of each audit"
    pending, _ = run.work_list(tmp_path)
    assert not set(EVIDENCE_TARGETS) & set(pending)
    assert rel("reviews/ARC-001-HLDR-v1.0.md")[0] in run.worker_inputs("CONC")
    assert rel("ARC-001-CONF-v1.0.md")[0] in run.worker_inputs("ARC42")


def test_plan_reports_every_adopted_path(tmp_path):
    write(tmp_path, "ARC-001-BKLG-v1.2.md", *AUDITS)
    lines = Resolution(tmp_path, {}, enable={"DEBT"}).plan_lines()
    assert f"(adopt) CDAU ← {LATEST_AUDITS[0]}, {LATEST_AUDITS[1]}" in lines
    assert f"(adopt) BKLG ← {PROJECT}/ARC-001-BKLG-v1.2.md" in lines


def test_rebuilt_targets_read_their_previous_version(tmp_path):
    """Stable TD-NNN and F-NN IDs need the register's and pack's previous versions."""
    write(tmp_path, "ARC-001-DEBT-v1.0.md", "ARC-001-DEBT-v1.1.md", "ARC-001-SDDH-v1.0.md")
    project = tmp_path / PROJECT
    assert existing_artefacts(project, PID, "DEBT")[-1] == project / "ARC-001-DEBT-v1.1.md"
    assert existing_artefacts(project, PID, "SDDH") == [project / "ARC-001-SDDH-v1.0.md"]
    for name in ("arc42-debt", "arc42-handover"):
        command = (REPO_ROOT / f"plugins/arckit-arc42/commands/{name}.md").read_text()
        assert "the previous version of this" in command, name


def test_harness_states_the_rules_this_model_follows():
    harness = HARNESS.read_text(encoding="utf-8")
    for rule in (
        # Resolution
        "- **Adopted.** When it is disabled only because its `default` is `false`",
        "**An adopted target is never dispatched**",
        "`--exclude ID` therefore means \"neither build nor read\"",
        "`--enable ID` turns adoption off",
        "comparing version numbers numerically (`v1.10` is later than `v1.9`)",
        # Recorded paths and completion
        "| Adopted multi-instance target | `\"paths\": [\"<repo-relative path>\", …]` | `paths` | `status` is `complete`, the array is non-empty and every file in it exists |",
        "An entry with neither, or with an empty `paths` array, is not complete.",
        # Hash keys
        "one key per file, `DEP_ID:<repo-relative path>`",
        "Every file of an adopted dep is hashed.",
        # Staleness
        "- a recorded key is not expected:",
        "- an expected key is not recorded:",
        "This check applies only to an entry the harness built",
        "a changed or missing adopted file makes its **dependents** stale",
        "An adopted target named in `--refresh` stays adopted and is not dispatched",
        "`pending` = `enabled-targets − adopted − done`",
        "step 1 only: every recorded file present",
        # Order and plan
        "6. **Resolve adopted evidence**, on the state step 5 loaded:",
        "`--plan` never writes them.",
        "listing **every** selected path",
        "Read the current file first and merge into it",
        # Worker inputs
        "one bullet per file in `paths(dep)` for each resolved dep",
        "{PREVIOUS_VERSION_LINE}",
        "the latest `ARC-{P}-{TYPE}-v*.md` for a single-instance type",
    ):
        assert rule in harness, rule
    order = [harness.index(f"\n{n}. **{step}") for n, step in (
        (4, "Resolve enabled targets"), (5, "Load state.json"), (6, "Resolve adopted evidence"),
        (8, "Compute work list"), (9, "If `--plan`"))]
    assert order == sorted(order), "state is loaded before adopted entries are recorded"
    run_order = harness.split("## When invoked, perform these steps in order", 1)[1]
    step4 = run_order.split("\n5. ", 1)[0]
    assert "Record nothing yet" in step4 and "state.targets" not in step4
