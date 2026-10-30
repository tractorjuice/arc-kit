"""Resolve the calculator from actual target and scaffold layouts, not just copy rules."""
import json
from pathlib import Path
import subprocess

import pytest
from typer.testing import CliRunner

from arckit_cli import app

ROOT = Path(__file__).resolve().parents[2]
CORE = ROOT / 'plugins/arckit-claude'
FIXTURES = ROOT / 'tests/fixtures/legacy-assessment'
TARGETS = ['codex', 'gemini', 'opencode', 'copilot', 'paperclip', 'vibe', 'kimi']


def calculate(helper, fixture='published-example.input.json'):
    result = subprocess.run(['node', str(helper), '--input', str(FIXTURES / fixture), '--json'], text=True, capture_output=True)
    assert result.returncode == 0, result.stderr
    return json.loads(result.stdout)


@pytest.mark.parametrize('target', ['claude', *TARGETS])
def test_target_can_run_bundled_helper_and_resolve_assets(target):
    root = CORE if target == 'claude' else ROOT / f'extensions/arckit-{target}'
    for path in ['scripts/legacy-assessment.mjs', 'schemas/legacy-assessment-1.0.schema.json', 'data/legacy-frameworks-1.0.json', 'data/legacy-risk-rubric-2026-08-17.json', 'data/legacy-definition-2026-08-17.json', 'references/legacy-frameworks.md', 'references/legacy-risk-framework-2026-08-17.md', 'references/legacy-definition-2026-08-17.md', 'templates/legacy-assessment-template.md']:
        assert (root / path).read_bytes() == (CORE / path).read_bytes(), f'{target}: {path}'
    assert calculate(root / 'scripts/legacy-assessment.mjs') == json.loads((FIXTURES / 'published-example.expected.json').read_text())
    chart = subprocess.run(['node', str(root / 'scripts/legacy-assessment.mjs'), '--input', str(FIXTURES / 'published-example.input.json'), '--svg'], capture_output=True, text=True, check=True)
    assert chart.stdout == (FIXTURES / 'ARC-001-LEGACY-v1.0-risk.svg').read_text()
    component_chart = subprocess.run(['node', str(root / 'scripts/legacy-assessment.mjs'), '--input', str(FIXTURES / 'published-example.input.json'), '--components-svg'], capture_output=True, text=True, check=True)
    assert component_chart.stdout == (FIXTURES / 'ARC-001-LEGACY-v1.0-components.svg').read_text()


@pytest.mark.parametrize('ai', ['codex', 'opencode', 'copilot', 'kimi'])
def test_cli_scaffold_has_helper_schema_catalogue_and_preserves_template_override(tmp_path, monkeypatch, ai):
    monkeypatch.chdir(tmp_path)
    monkeypatch.setenv('ARCKIT_DATA_DIR', str(ROOT))
    custom = tmp_path / 'scaffold/.arckit/templates-custom/legacy-assessment-template.md'
    custom.parent.mkdir(parents=True)
    custom.write_text('User custom template\n')
    monkeypatch.chdir(tmp_path / 'scaffold')
    result = CliRunner().invoke(app, ['init', '--here', '--ai', ai, '--no-git', '--minimal'], input='y\n')
    assert result.exit_code == 0, result.output
    assert custom.read_text() == 'User custom template\n'
    installed = custom.parents[1]
    assert calculate(installed / 'scripts/legacy-assessment.mjs')['results']['systems'][0]['risk']['display'] == '26.67'
    chart = subprocess.run(['node', str(installed / 'scripts/legacy-assessment.mjs'), '--input', str(FIXTURES / 'published-example.input.json'), '--svg'], capture_output=True, text=True, check=True)
    assert chart.stdout == (FIXTURES / 'ARC-001-LEGACY-v1.0-risk.svg').read_text()
    component_chart = subprocess.run(['node', str(installed / 'scripts/legacy-assessment.mjs'), '--input', str(FIXTURES / 'published-example.input.json'), '--components-svg'], capture_output=True, text=True, check=True)
    assert component_chart.stdout == (FIXTURES / 'ARC-001-LEGACY-v1.0-components.svg').read_text()
    assert (installed / 'data/legacy-frameworks-1.0.json').is_file()
    for name in ['legacy-risk-rubric-2026-08-17.json', 'legacy-definition-2026-08-17.json']:
        assert (installed / 'data' / name).read_bytes() == (CORE / 'data' / name).read_bytes()
    for partial in ['RENDERING.md', 'document-control-uk.md']:
        assert (installed / 'templates/_partials' / partial).read_bytes() == (CORE / 'templates/_partials' / partial).read_bytes()
    assert (installed / 'data/legacy-frameworks-1.0.json').read_bytes() == (CORE / 'data/legacy-frameworks-1.0.json').read_bytes()


def test_golden_report_matches_json_results_and_uk_document_control():
    a = calculate(CORE / 'scripts/legacy-assessment.mjs')
    report = (FIXTURES / 'published-example.report.md').read_text()
    s = a['results']['systems'][0]
    assert f"| {s['systemId']} | {s['outcome']} | {s['strongestKnownFinding']} | {str(s['provisional']).lower()} | {s['completeness']} | {s['actionPlanCompleteness']} | {s['proposedReviewDate']} |" in report
    r = s['risk']
    assert f"| payments | {r['status']} | {r['likelihood']} | {r['impact']} | {r['display']} | {str(r['redRated']).lower()} | L={r['arithmetic']['likelihoodNumerator']}/{r['arithmetic']['likelihoodDenominator']}; C={r['arithmetic']['impactNumerator']}/{r['arithmetic']['impactDenominator']}; risk={r['arithmetic']['riskNumerator']}/{r['arithmetic']['riskDenominator']} |" in report
    for f in a['findings']:
        assert f"| {f['id']} / {f['systemId']} | {f['criterionId']} / {f['thresholdId']} | {f['outcome']} |" in report
    assert f"{r['arithmetic']['riskNumerator']}/{r['arithmetic']['riskDenominator']}" in report
    assert '<!-- DOC-CONTROL-HEADER -->' not in report
    partial = (CORE / 'templates/_partials/document-control-uk.md').read_text()
    for row in partial.splitlines()[2:]:
        assert row.split('|')[1] in report
    assert '| **Approved By** | PENDING |' in report
    r = subprocess.run(['node', str(CORE / 'scripts/legacy-assessment.mjs'), '--input', str(FIXTURES / 'published-example.expected.json'), '--check-report', str(FIXTURES / 'published-example.report.md')], capture_output=True, text=True)
    assert r.returncode == 0, r.stderr


def test_paperclip_package_includes_runtime_assets_and_resolves_token():
    package = json.loads((ROOT / 'extensions/arckit-paperclip/package.json').read_text())
    for asset in ['scripts/legacy-assessment.mjs', 'schemas/legacy-assessment-1.0.schema.json', 'data/legacy-frameworks-1.0.json', 'data/legacy-risk-rubric-2026-08-17.json', 'data/legacy-definition-2026-08-17.json']:
        assert asset in package['files']
    commands = json.loads((ROOT / 'extensions/arckit-paperclip/src/data/commands.json').read_text())
    command = next(c for c in commands if c['name'] == 'arckit-legacy-assessment')
    assert '{arckit_package_root}/scripts/legacy-assessment.mjs' in command['prompt']
    assert '{arckit_package_root}/schemas/legacy-assessment-1.0.schema.json' in command['prompt']
    assert 'CLAUDE_PLUGIN_ROOT' not in command['prompt']
    runtime = (ROOT / 'extensions/arckit-paperclip/src/tools/command-tools.ts').read_text()
    assert '.replaceAll("{arckit_package_root}", () => packageRoot)' in runtime


def test_legacy_is_contextual_and_does_not_reduce_universal_readiness():
    script = """import { DOC_TYPES } from './plugins/arckit-claude/config/doc-types.mjs';
import { HIGH_SEVERITY_TYPES } from './plugins/arckit-claude/hooks/graph-rollups.mjs';
console.log(JSON.stringify({type: DOC_TYPES.LEGACY, universal: HIGH_SEVERITY_TYPES.includes('LEGACY')}));"""
    r = subprocess.run(['node', '--input-type=module', '-e', script], cwd=ROOT, text=True, capture_output=True, check=True)
    info = json.loads(r.stdout)
    assert info['type']['regime'] == 'UK'
    assert info['type']['category'] == 'Compliance'
    assert info['type'].get('severity') != 'HIGH'
    assert not info['universal']


@pytest.mark.parametrize('scenario, outcomes, incomplete_risk', [
    ('supported', ['Accepted'], False),
    ('unsupported', ['Legacy'], False),
    ('expiry', ['Action-Required'], False),
    ('dependency', ['Legacy', 'Legacy'], True),
    ('sparse', ['Undetermined'], True),
    ('conflict', ['Undetermined', 'Accepted'], True),
    ('incomplete-risk', ['Accepted'], True),
])
def test_behavioural_fixture_has_reproducible_expected_decisions(scenario, outcomes, incomplete_risk):
    fixture = CORE / f'evals/fixtures/legacy-{scenario}/projects/001-payments/assessment-input.json'
    r = subprocess.run(['node', str(CORE / 'scripts/legacy-assessment.mjs'), '--input', str(fixture), '--json'], text=True, capture_output=True, check=True)
    result = json.loads(r.stdout)['results']['systems']
    assert [s['outcome'] for s in result] == outcomes
    assert any(s['risk']['status'] == 'incomplete' for s in result) == incomplete_risk
    if scenario == 'sparse':
        assert result[0]['provisional']
    if scenario == 'dependency':
        assert result[1]['criterionResults'][6]['outcome'] == 'Legacy'


def test_claude_native_write_hooks_preserve_verified_report_and_allow_json_sidecar(tmp_path):
    project = tmp_path / 'projects/001-synthetic'
    project.mkdir(parents=True)
    report = project / 'ARC-001-LEGACY-v1.0.md'
    sidecar = project / 'ARC-001-LEGACY-v1.0.json'
    report.write_bytes((FIXTURES / 'published-example.report.md').read_bytes())
    sidecar.write_bytes((FIXTURES / 'published-example.expected.json').read_bytes())
    (project / 'ARC-001-LEGACY-v1.0-risk.svg').write_bytes((FIXTURES / 'ARC-001-LEGACY-v1.0-risk.svg').read_bytes())
    (project / 'ARC-001-LEGACY-v1.0-components.svg').write_bytes((FIXTURES / 'ARC-001-LEGACY-v1.0-components.svg').read_bytes())
    for path in [report, sidecar]:
        payload = json.dumps({'tool_name': 'Write', 'cwd': str(tmp_path), 'tool_input': {'file_path': str(path), 'content': path.read_text()}})
        for hook in ['validate-arc-filename.mjs', 'file-protection.mjs']:
            check = subprocess.run(['node', str(CORE / 'hooks' / hook)], input=payload, capture_output=True, text=True)
            assert check.returncode == 0, check.stderr
        for hook in ['provenance-stamp.mjs', 'update-manifest.mjs']:
            check = subprocess.run(['node', str(CORE / 'hooks' / hook)], input=payload, capture_output=True, text=True)
            assert check.returncode == 0, check.stderr
    check = subprocess.run(['node', str(CORE / 'scripts/legacy-assessment.mjs'), '--input', str(sidecar), '--check-report', str(report)], capture_output=True, text=True)
    assert check.returncode == 0, check.stderr
