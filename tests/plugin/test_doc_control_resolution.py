"""Tests for scripts/check-doc-control-resolution.py.

The guard exists because a template carrying `<!-- DOC-CONTROL-HEADER -->` whose
command never resolves it fails loudly in the artefact and silently in the repo:
the rendered document gets a literal HTML comment and no Document Control block
at all. That state was live for 91 template/command pairs, including all 12
France commands — FR hard-routes and `document-control-fr.md` shipped in #752,
but no FR command read `RENDERING.md`, so the French ladder was unreachable from
the command that needed it (#760).

As with the sibling checklist guard, the negative tests carry the weight. A guard
that cannot fail is worse than no guard, because it reads as coverage.
"""

import importlib.util
import json
import subprocess
from pathlib import Path

import pytest

REPO_ROOT = Path(__file__).resolve().parents[2]
GUARD = REPO_ROOT / "scripts/check-doc-control-resolution.py"

MARKER = "<!-- DOC-CONTROL-HEADER -->"
COMMENT = "<!-- Resolved at command-execution time per _partials/RENDERING.md. -->"

# Hard-routing regimes whose commands were the live defect behind the guard.
REGRESSION_COMMANDS = {
    "arckit-fr": [
        "fr-algorithme-public", "fr-anssi", "fr-anssi-carto", "fr-code-reuse",
        "fr-dinum", "fr-dr", "fr-ebios", "fr-irn", "fr-marche-public",
        "fr-pssi", "fr-rgpd", "fr-secnumcloud",
    ],
    "arckit-at": ["at-bvergg", "at-dsgvo", "at-nisg"],
}


def load_guard():
    spec = importlib.util.spec_from_file_location("check_doc_control_resolution", GUARD)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


def make_plugin(root: Path, name: str, *, template: str, command: str | None):
    """Minimal plugin tree. command=None means no command reads the template."""
    plugin = root / name
    (plugin / ".claude-plugin").mkdir(parents=True)
    (plugin / ".claude-plugin/plugin.json").write_text(json.dumps({"name": name}))
    (plugin / "templates").mkdir()
    (plugin / "templates/thing-template.md").write_text(template)
    if command is not None:
        (plugin / "commands").mkdir()
        (plugin / "commands/thing.md").write_text(command)
    return plugin


def run_against(module, plugins_dir: Path) -> int:
    module.PLUGINS_DIR = plugins_dir
    module.ROOT = plugins_dir.parent
    module.MIRROR_DIR = plugins_dir / "__no_mirror__"
    # The exemption lists name real templates, none of which exist in a fixture
    # tree; left set, the stale-exemption check fires on every fixture run and
    # masks whatever the test is actually asserting.
    module.INLINE_BY_DESIGN = {}
    module.NO_READER_KNOWN = {}
    module.NO_TEMPLATE_KNOWN = {}
    return module.main()


MARKED = f"# Thing\n\n## Document Control\n\n{MARKER}\n{COMMENT}\n\n## Body\n"
READS_ONLY = "Read `${CLAUDE_PLUGIN_ROOT}/templates/thing-template.md`.\n"
RESOLVES = READS_ONLY + "Then read `${CLAUDE_PLUGIN_ROOT}/templates/_partials/RENDERING.md`.\n"


def test_guard_exists():
    assert GUARD.is_file(), "doc-control resolution guard missing"


def test_guard_passes_on_current_tree():
    result = subprocess.run(
        ["python3", str(GUARD)], capture_output=True, text=True, cwd=REPO_ROOT
    )
    assert result.returncode == 0, f"guard failed:\n{result.stdout}\n{result.stderr}"


def test_guard_is_wired_into_ci():
    workflow = (REPO_ROOT / ".github/workflows/lint-markdown.yml").read_text()
    assert "check-doc-control-resolution.py" in workflow, "guard not run in CI"


def test_guard_fails_when_command_does_not_resolve(tmp_path, capsys):
    # The #760 defect: template carries the marker, command reads it, nothing
    # tells the model to resolve it.
    plugins = tmp_path / "plugins"
    plugins.mkdir()
    make_plugin(plugins, "arckit-fake", template=MARKED, command=READS_ONLY)
    assert run_against(load_guard(), plugins) == 1
    assert "no reader resolves it" in capsys.readouterr().err


def test_guard_passes_when_command_resolves(tmp_path):
    plugins = tmp_path / "plugins"
    plugins.mkdir()
    make_plugin(plugins, "arckit-fake", template=MARKED, command=RESOLVES)
    assert run_against(load_guard(), plugins) == 0


def test_writer_subagent_satisfies_the_invariant(tmp_path):
    # The reader/writer split puts the Write call in a subagent, so resolution
    # belongs there. Requiring it on the orchestrator command would be wrong.
    plugins = tmp_path / "plugins"
    plugins.mkdir()
    plugin = make_plugin(plugins, "arckit-fake", template=MARKED, command=None)
    (plugin / "agents").mkdir()
    (plugin / "agents/writer.md").write_text(RESOLVES)
    assert run_against(load_guard(), plugins) == 0


def test_guard_fails_when_nothing_reads_the_template(tmp_path, capsys):
    # A template nothing reads cannot resolve its marker, and silently ships a
    # Document Control block that never renders.
    plugins = tmp_path / "plugins"
    plugins.mkdir()
    make_plugin(plugins, "arckit-fake", template=MARKED, command=None)
    assert run_against(load_guard(), plugins) == 1
    assert "no command or agent" in capsys.readouterr().err


def test_guard_fails_on_stale_marker_comment(tmp_path, capsys):
    # The pre-#744 wording that reached 121 templates: names two partials of
    # seven, describes user-config routing that regime routing replaced.
    legacy = MARKED.replace(
        COMMENT,
        "<!-- Resolved at command-execution time to _partials/document-control-uk.md "
        "or _partials/document-control-uae.md based on plugin userConfig "
        "classification_scheme + governance_framework. -->",
    )
    plugins = tmp_path / "plugins"
    plugins.mkdir()
    make_plugin(plugins, "arckit-fake", template=legacy, command=RESOLVES)
    assert run_against(load_guard(), plugins) == 1
    assert "not the current form" in capsys.readouterr().err


def test_guard_fails_on_undeclared_inline_table(tmp_path, capsys):
    # The converse the issue asked for: a hand-maintained block with no marker is
    # outside regime routing by construction, so it must be declared deliberate.
    inline = (
        "# Thing\n\n## Document Control\n\n| Field | Value |\n|---|---|\n"
        "| **Document ID** | X |\n\n## Body\n"
    )
    plugins = tmp_path / "plugins"
    plugins.mkdir()
    # A converted template alongside it, so the "matched nothing" bail does not
    # fire first and hide the finding under test.
    plugin = make_plugin(plugins, "arckit-fake", template=MARKED, command=RESOLVES)
    (plugin / "templates/legacy-template.md").write_text(inline)
    (plugin / "commands/legacy.md").write_text(
        "Read `${CLAUDE_PLUGIN_ROOT}/templates/legacy-template.md`.\n"
    )
    assert run_against(load_guard(), plugins) == 1
    assert "hand-maintain a Document Control block" in capsys.readouterr().err


def test_guard_refuses_to_pass_when_it_matches_nothing(tmp_path, capsys):
    # If the marker is renamed tree-wide the guard would scan zero templates and
    # report success. It must fail instead.
    plugins = tmp_path / "plugins"
    plugins.mkdir()
    make_plugin(plugins, "arckit-fake", template="# Thing\n\n## Body\n", command=READS_ONLY)
    assert run_against(load_guard(), plugins) == 1
    assert "no template carries" in capsys.readouterr().err


def test_nhs_safety_case_templates_stay_inline():
    # Deliberate deviation: the DCB0129/DCB0160 set follows the Marcus Baw
    # SAFETY.md spec convention, whose Document ID is the literal `SAFETY.md`.
    # Converting them would impose an ARC- ID and break the convention on purpose.
    guard = load_guard()
    assert len(guard.INLINE_BY_DESIGN) == 6
    for name, reason in guard.INLINE_BY_DESIGN.items():
        path = REPO_ROOT / "plugins/arckit-uk-nhs/templates" / name
        assert path.is_file(), f"{name} is exempt but no longer exists"
        assert MARKER not in path.read_text(), f"{name} gained the marker; drop the exemption"
        assert reason, f"{name} exempt without a stated reason"


def test_nhs_dtac_and_mdr_are_not_exempt():
    # Only the safety-case set deviates. These two use the marker like any other
    # template, and an over-broad exemption would hide a real regression.
    guard = load_guard()
    for name in ("uk-nhs-dtac-template.md", "uk-mdr-classification-template.md"):
        assert name not in guard.INLINE_BY_DESIGN
        assert MARKER in (REPO_ROOT / "plugins/arckit-uk-nhs/templates" / name).read_text()


def test_hard_routing_overlay_commands_resolve_the_marker():
    # Explicit regression for #760: FR and AT hard-route, so their commands must
    # reach RENDERING.md or the ladder those regimes shipped is unreachable.
    for plugin, commands in REGRESSION_COMMANDS.items():
        for name in commands:
            path = REPO_ROOT / "plugins" / plugin / "commands" / f"{name}.md"
            assert path.is_file(), f"{plugin}/{name}.md missing"
            assert "_partials/RENDERING.md" in path.read_text(), (
                f"/{name} no longer resolves the marker — it will render a UK ladder "
                f"for a hard-routed {plugin} artefact"
            )


def test_no_command_still_carries_the_pre_744_classification_fallback():
    # `[CLASSIFICATION]` survives in exactly one template (the MARP footer in
    # presentation-template.md). Everywhere else the marker replaced it, so an
    # instruction to substitute it from user config is both dead and contrary to
    # regime routing.
    offenders = []
    for sub in ("commands", "agents"):
        for path in sorted((REPO_ROOT / "plugins").glob(f"*/{sub}/*.md")):
            text = path.read_text()
            if "[CLASSIFICATION]" in text and "user_config.default_classification" in text:
                for line in text.splitlines():
                    if "[CLASSIFICATION]" in line and "user_config.default_classification" in line:
                        offenders.append(f"{path.relative_to(REPO_ROOT)}: {line.strip()}")
    assert not offenders, "pre-#744 classification fallback is back:\n  " + "\n  ".join(offenders)


def test_generated_mirror_is_excluded():
    # plugins/arckit-claude/plugins/** is regenerated by sync-claude-plugin-layout.py.
    # Scanning it would double-report every core finding.
    guard = load_guard()
    assert guard.MIRROR_DIR == REPO_ROOT / "plugins/arckit-claude/plugins"


def test_guard_fails_when_a_doc_type_command_has_no_template(tmp_path, capsys):
    # The converse blind spot: checks 1-3 walk templates, so a command writing a
    # governed artefact with no template at all was invisible to them.
    plugins = tmp_path / "plugins"
    plugins.mkdir()
    plugin = make_plugin(plugins, "arckit-fake", template=MARKED, command=RESOLVES)
    (plugin / "commands/naked.md").write_text(
        "---\ndoc-type: NAKED\n---\n\nWrite the artefact from the structure below.\n"
    )
    assert run_against(load_guard(), plugins) == 1
    err = capsys.readouterr().err
    assert "reference no template" in err and "NAKED" in err


def test_doc_type_none_commands_are_out_of_scope(tmp_path):
    # /arckit:search, /arckit:health and the rest write no governed artefact.
    plugins = tmp_path / "plugins"
    plugins.mkdir()
    plugin = make_plugin(plugins, "arckit-fake", template=MARKED, command=RESOLVES)
    (plugin / "commands/readonly.md").write_text(
        "---\ndoc-type: none\n---\n\nSearch and report.\n"
    )
    assert run_against(load_guard(), plugins) == 0


def test_exemption_lists_are_empty():
    # Both were populated during #791/#792 and both are now cleared. An entry
    # reappearing means a command regressed to an inlined skeleton.
    guard = load_guard()
    assert guard.NO_READER_KNOWN == {}, "a template lost its reader again"
    assert guard.NO_TEMPLATE_KNOWN == {}, "a doc-type command lost its template again"


@pytest.mark.parametrize(
    "plugin,command,template",
    [
        ("arckit-claude", "backlog.md", "backlog-template.md"),
        ("arckit-claude", "gcloud-clarify.md", "gcloud-clarify-template.md"),
        ("arckit-claude", "gcloud-search.md", "gcloud-requirements-template.md"),
        ("arckit-uk-gcloud", "gcloud-competitors.md", "gcloud-competitors-template.md"),
        ("arckit-uk-gcloud", "review.md", "review-template.md"),
    ],
)
def test_792_commands_read_their_template(plugin, command, template):
    # Explicit regression for the five that shipped an ARC-* artefact with no
    # Document Control block and no Revision History, built from an inlined
    # skeleton instead of a template (#792).
    cmd = REPO_ROOT / "plugins" / plugin / "commands" / command
    tpl = REPO_ROOT / "plugins" / plugin / "templates" / template
    assert tpl.is_file(), f"{template} missing"
    assert MARKER in tpl.read_text(), f"{template} lost the marker"
    body = cmd.read_text()
    assert template in body, f"/{command} no longer reads {template}"
    assert "_partials/RENDERING.md" in body, f"/{command} no longer resolves the marker"


@pytest.mark.parametrize(
    "plugin,command",
    [
        ("arckit-claude", "backlog.md"),
        ("arckit-claude", "gcloud-clarify.md"),
        ("arckit-claude", "gcloud-search.md"),
        ("arckit-uk-gcloud", "gcloud-competitors.md"),
        ("arckit-uk-gcloud", "review.md"),
    ],
)
def test_792_commands_no_longer_inline_a_document_control_block(plugin, command):
    # The template owns Document Control now. A `## Document Control` heading
    # reappearing in the command body means a second, hand-maintained source.
    body = (REPO_ROOT / "plugins" / plugin / "commands" / command).read_text()
    assert "\n## Document Control" not in body, (
        f"/{command} inlines a Document Control block again — the template owns it"
    )
