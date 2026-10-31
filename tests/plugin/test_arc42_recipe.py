"""The arc42 recipe must make each worker's required source artefacts available."""

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


# ── Existing evidence reaching recipe workers ──────────────────────────────
#
# arckit-build is a prompt, not code, so this is a reference model of the rules
# its SKILL.md states ("Dep resolution", run step 4 and the worker prompt), and
# test_harness_states_the_rules_this_model_follows pins the model to that text.


def multi_instance_types():
    block = re.search(r"MULTI_INSTANCE_TYPES = new Set\(\[(.*?)\]\)", DOC_TYPES.read_text(), re.S).group(1)
    return set(re.findall(r"'([A-Z0-9-]+)'", block))


def _version_key(path):
    return tuple(int(n) for n in re.search(r"-v([\d.]+)\.md$", path.name).group(1).split("."))


def existing_artefacts(project_dir, pid, doc_type):
    """Latest version of each instance of a doc type in the project, as the harness globs it."""
    multi = doc_type in multi_instance_types()
    pattern = f"ARC-{pid}-{doc_type}-*-v*.md" if multi else f"ARC-{pid}-{doc_type}-v*.md"
    latest = {}
    for path in project_dir.rglob(pattern):
        instance = re.sub(r"-v[\d.]+\.md$", "", path.name)
        if instance not in latest or _version_key(path) > _version_key(latest[instance]):
            latest[instance] = path
    return sorted(latest.values())


def resolve(project_dir, pid="001", enable=(), exclude=()):
    """(targets to build, adopted target -> paths, inputs(target) -> worker input paths)."""
    recipe = yaml.safe_load(RECIPE.read_text(encoding="utf-8"))
    targets = {t["id"]: t for t in recipe["targets"]}
    adopted, pruned = {}, set()
    for tid, spec in recipe["optional_targets"].items():
        if tid in exclude:
            pruned.add(tid)
        elif spec["default"] or tid in enable:
            continue
        else:
            paths = existing_artefacts(project_dir, pid, targets[tid]["output"]["type"])
            if paths:
                adopted[tid] = paths
            else:
                pruned.add(tid)
    remaining = [tid for tid in targets if tid not in pruned]

    def inputs(tid):
        found = []
        for dep in targets[tid]["deps"]:
            matches = [d for d in remaining if d.startswith(dep[:-1])] if dep.endswith("*") else (
                [dep] if dep in remaining else [])
            for d in matches:
                found.extend(adopted.get(d, [f"<{d} output>"]))
        return found

    build = [tid for tid in remaining if tid not in adopted]
    return build, adopted, inputs


def write(project_dir, *relative_paths):
    for relative in relative_paths:
        path = project_dir / relative
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text("# fixture\n", encoding="utf-8")


def test_evidence_targets_are_optional_and_off_by_default():
    recipe = yaml.safe_load(RECIPE.read_text(encoding="utf-8"))
    targets = {t["id"]: t for t in recipe["targets"]}
    for tid in EVIDENCE_TARGETS:
        assert recipe["optional_targets"][tid]["default"] is False, tid
    assert "BKLG" in targets["SDDH"]["deps"]
    assert set(EVIDENCE_TARGETS) - {"BKLG"} <= set(targets["DEBT"]["deps"])


def test_existing_backlog_reaches_the_handover_worker(tmp_path):
    write(tmp_path, "ARC-001-BKLG-v1.0.md", "ARC-001-BKLG-v1.2.md")
    build, adopted, inputs = resolve(tmp_path, enable={"SDDH"})
    assert adopted["BKLG"] == [tmp_path / "ARC-001-BKLG-v1.2.md"]
    assert "BKLG" not in build, "an existing backlog is read, not regenerated"
    assert "SDDH" in build
    assert tmp_path / "ARC-001-BKLG-v1.2.md" in inputs("SDDH")


def test_absent_evidence_is_pruned_never_generated(tmp_path):
    build, adopted, inputs = resolve(tmp_path, enable={"SDDH", "DEBT"})
    assert adopted == {}
    assert not set(EVIDENCE_TARGETS) & set(build), "no evidence target is built just to satisfy a dependency"
    assert not any("BKLG" in str(i) for i in inputs("SDDH"))


def test_recorded_debt_evidence_reaches_the_debt_worker(tmp_path):
    write(
        tmp_path,
        "audits/ARC-001-CDAU-001-v1.0.md", "audits/ARC-001-CDAU-001-v1.1.md", "audits/ARC-001-CDAU-002-v1.0.md",
        "ARC-001-CONF-v1.0.md", "reviews/ARC-001-HLDR-v1.0.md", "reviews/ARC-001-DLDR-v2.0.md",
        "ARC-001-PRIN-COMP-v1.0.md",
    )
    build, adopted, inputs = resolve(tmp_path, enable={"DEBT"})
    debt_inputs = inputs("DEBT")
    for expected in (
        "audits/ARC-001-CDAU-001-v1.1.md", "audits/ARC-001-CDAU-002-v1.0.md", "ARC-001-CONF-v1.0.md",
        "reviews/ARC-001-HLDR-v1.0.md", "reviews/ARC-001-DLDR-v2.0.md", "ARC-001-PRIN-COMP-v1.0.md",
    ):
        assert tmp_path / expected in debt_inputs, expected
    assert tmp_path / "audits/ARC-001-CDAU-001-v1.0.md" not in debt_inputs, "only the latest version of each audit"
    assert not set(EVIDENCE_TARGETS) & set(build)
    # The same adopted evidence reaches the other readers the recipe declares.
    assert tmp_path / "reviews/ARC-001-HLDR-v1.0.md" in inputs("CONC")
    assert tmp_path / "ARC-001-CONF-v1.0.md" in inputs("ARC42")


def test_exclude_keeps_existing_evidence_out(tmp_path):
    write(tmp_path, "ARC-001-CONF-v1.0.md", "ARC-001-PRIN-COMP-v1.0.md")
    build, adopted, inputs = resolve(tmp_path, enable={"DEBT"}, exclude={"CONF"})
    assert "CONF" not in adopted and "CONF" not in build
    assert tmp_path / "ARC-001-CONF-v1.0.md" not in inputs("DEBT")
    assert tmp_path / "ARC-001-PRIN-COMP-v1.0.md" in inputs("DEBT")


def test_rebuilt_targets_read_their_previous_version(tmp_path):
    """Stable TD-NNN and F-NN IDs need the register's and pack's previous versions."""
    write(tmp_path, "ARC-001-DEBT-v1.0.md", "ARC-001-DEBT-v1.1.md", "ARC-001-SDDH-v1.0.md")
    assert existing_artefacts(tmp_path, "001", "DEBT")[-1] == tmp_path / "ARC-001-DEBT-v1.1.md"
    assert existing_artefacts(tmp_path, "001", "SDDH") == [tmp_path / "ARC-001-SDDH-v1.0.md"]
    for name in ("arc42-debt", "arc42-handover"):
        command = (REPO_ROOT / f"plugins/arckit-arc42/commands/{name}.md").read_text()
        assert "the previous version of this" in command, name


def test_harness_states_the_rules_this_model_follows():
    harness = HARNESS.read_text(encoding="utf-8")
    assert "- **Adopted.** When it is disabled only because its `default` is `false`" in harness
    assert "**Adopt** each dropped `default: false` target that was not named in `--exclude`" in harness
    assert "`--exclude ID` therefore means \"neither build nor read\"" in harness
    assert "including every path of an adopted dep" in harness
    assert "{PREVIOUS_VERSION_LINE}" in harness
    assert "the latest `ARC-{P}-{TYPE}-v*.md` for a single-instance type" in harness
