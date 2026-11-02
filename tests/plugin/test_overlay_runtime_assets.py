"""Optional calculators ship without a core command-specific dependency."""
import importlib.util
import json
from pathlib import Path

import pytest
import yaml

ROOT = Path(__file__).resolve().parents[2]
spec = importlib.util.spec_from_file_location('runtime_asset_converter', ROOT / 'scripts/converter.py')
converter = importlib.util.module_from_spec(spec)
spec.loader.exec_module(converter)


def plugin(root, declarations, content='synthetic runtime'):
    (root / 'commands').mkdir(parents=True, exist_ok=True)
    (root / 'commands/example.md').write_text('---\n' + yaml.safe_dump({'runtime-assets': declarations}) + '---\nExample\n')
    for relative in declarations if isinstance(declarations, list) else []:
        if not isinstance(relative, str) or relative.startswith('/') or '..' in relative or '\\' in relative or ':' in relative or '\x00' in relative:
            continue
        file = root / relative
        file.parent.mkdir(parents=True, exist_ok=True)
        file.write_text(content)
    return root


@pytest.mark.parametrize('relative', ['../outside', '/tmp/outside', 'scripts/../secret', 'scripts//tool.mjs', 'scripts/./tool.mjs', 'scripts\\tool.mjs', 'C:/tool.mjs', 'scripts/\x00tool', 'references/tool.mjs', 'scripts/.private'])
def test_runtime_asset_paths_are_portable_and_confined(tmp_path, relative):
    source = plugin(tmp_path / 'overlay', [relative])
    with pytest.raises(SystemExit, match='unsafe runtime asset'):
        converter.declared_runtime_assets([source])


@pytest.mark.parametrize('declared', ['scripts/tool.mjs', [None], [1], {}])
def test_malformed_runtime_declarations_are_rejected(tmp_path, declared):
    source = plugin(tmp_path / 'overlay', declared)
    with pytest.raises(SystemExit):
        converter.declared_runtime_assets([source])


def test_runtime_asset_missing_or_escaping_symlink_is_rejected(tmp_path):
    source = plugin(tmp_path / 'overlay', ['scripts/tool.mjs'])
    asset = source / 'scripts/tool.mjs'
    asset.unlink()
    with pytest.raises(SystemExit, match='missing or escaped'):
        converter.declared_runtime_assets([source])
    outside = tmp_path / 'outside.mjs'
    outside.write_text('synthetic outside file')
    asset.symlink_to(outside)
    with pytest.raises(SystemExit, match='missing or escaped'):
        converter.declared_runtime_assets([source])


def test_collisions_fail_including_case_only_names(tmp_path):
    first = plugin(tmp_path / 'first', ['scripts/tool.mjs'])
    second = plugin(tmp_path / 'second', ['scripts/tool.mjs'])
    assert len(converter.declared_runtime_assets([first, second])) == 1
    (second / 'scripts/tool.mjs').write_text('different synthetic content')
    with pytest.raises(SystemExit, match='conflicting runtime asset'):
        converter.declared_runtime_assets([first, second])
    third = plugin(tmp_path / 'third', ['scripts/Tool.mjs'])
    with pytest.raises(SystemExit, match='conflicting runtime asset'):
        converter.declared_runtime_assets([first, third])


def test_declared_helpers_and_schemas_ship_when_general_scripts_are_disabled(tmp_path, monkeypatch):
    overlay = plugin(tmp_path / 'overlay', ['scripts/tool.mjs', 'schemas/input.json'])
    (overlay / 'scripts/unrequested.sh').write_text('unrequested script')
    core = tmp_path / 'core'
    (core / 'schemas').mkdir(parents=True)
    destination = tmp_path / 'extension'
    monkeypatch.setattr(converter, 'AGENT_CONFIG', {'target': {'name': 'Synthetic target', 'extension_dir': str(destination), 'copy_scripts_to_extension': False}})
    converter.copy_extension_files([overlay, core])
    assert (destination / 'scripts/tool.mjs').read_text() == 'synthetic runtime'
    assert (destination / 'schemas/input.json').is_file()
    assert not (destination / 'scripts/unrequested.sh').exists()
    # Regeneration must not retain a helper/schema no command still declares.
    (overlay / 'commands/example.md').write_text('---\ndescription: No runtime\n---\nExample\n')
    converter.copy_extension_files([overlay, core])
    assert not (destination / 'scripts/tool.mjs').exists()
    assert not (destination / 'schemas/input.json').exists()


def test_declared_data_cannot_overwrite_a_conflicting_core_asset(tmp_path, monkeypatch):
    overlay = plugin(tmp_path / 'overlay', ['data/catalogue.json'])
    core = tmp_path / 'core'
    (core / 'data').mkdir(parents=True)
    (core / 'data/catalogue.json').write_text('different core catalogue')
    monkeypatch.setattr(converter, 'AGENT_CONFIG', {'target': {'name': 'Synthetic target', 'extension_dir': str(tmp_path / 'extension'), 'copy_scripts_to_extension': False}})
    with pytest.raises(SystemExit, match='conflicting runtime asset'):
        converter.copy_extension_files([overlay, core])


def test_legacy_is_optional_and_its_references_are_not_core_shared_assets():
    overlay = ROOT / 'plugins/arckit-uk-legacy'
    manifest = json.loads((overlay / '.claude-plugin/plugin.json').read_text())
    assert manifest['defaultEnabled'] is False
    assert manifest['dependencies'][0]['name'] == 'arckit'
    assert not (ROOT / 'plugins/arckit-claude/commands/uk-legacy-assessment.md').exists()
    assert (overlay / 'references/legacy-quality-checklist.md').is_file()
    for core in (ROOT / 'plugins').glob('arckit-*'):
        if core == overlay:
            continue
        assert not list((core / 'references').glob('legacy-*')), core.name
    for name in ['analyze', 'navigator', 'plan', 'risk', 'roadmap', 'secure', 'service-assessment', 'sobc', 'tcop']:
        assert 'legacy-assessment' not in (ROOT / 'plugins/arckit-claude/commands' / (name + '.md')).read_text()
    # Both dev and published Claude paths own the correctly namespaced command.
    published = ROOT / 'plugins/arckit-claude/plugins/uk/legacy'
    assert '/arckit-uk-legacy:uk-legacy-assessment' in (published / 'docs/guides/legacy-assessment.md').read_text()
    assert (published / 'scripts/legacy-assessment.mjs').read_bytes() == (overlay / 'scripts/legacy-assessment.mjs').read_bytes()


def test_runtime_drift_detects_stale_and_missing_assets(tmp_path, monkeypatch):
    overlay = plugin(tmp_path / 'overlay', ['scripts/tool.mjs'])
    target = tmp_path / 'extension/scripts/tool.mjs'
    target.parent.mkdir(parents=True)
    target.write_text('synthetic runtime')
    monkeypatch.setattr(converter, 'PLUGIN_SOURCES', ['overlay'])
    monkeypatch.setattr(converter, 'AGENT_CONFIG', {'target': {'extension_dir': 'extension'}})
    assert converter.runtime_asset_drift(tmp_path) == []
    target.write_text('stale runtime')
    assert converter.runtime_asset_drift(tmp_path) == ['extension/scripts/tool.mjs']
    target.unlink()
    assert converter.runtime_asset_drift(tmp_path) == ['extension/scripts/tool.mjs']


def test_overlay_live_eval_recordings_cannot_be_committed():
    import subprocess
    for relative in ['plugins/arckit-uk-legacy/evals/results/synthetic/recording.json', 'plugins/arckit-claude/plugins/uk/legacy/evals/results/synthetic/recording.json']:
        result = subprocess.run(['git', 'check-ignore', '--quiet', relative], cwd=ROOT)
        assert result.returncode == 0, relative


def test_legacy_handoffs_are_follow_up_work_not_evidence_inputs():
    path = ROOT / 'plugins/arckit-uk-legacy/commands/uk-legacy-assessment.md'
    front, body = path.read_text().split('---', 2)[1:]
    metadata = yaml.safe_load(front)
    assert [item['command'] for item in metadata['handoffs']] == ['sobc', 'roadmap', 'plan']
    assert 'service assessments, TCoP evidence' in body
    assert 'scripts/generate-document-id.mjs' in metadata['runtime-assets']
    assert 'LEGACY <VERSION> --filename' in body
    assert not path.with_name('legacy-assessment.md').exists()


def test_generated_paperclip_scripts_are_ignored_and_untracked():
    import subprocess
    path = 'extensions/arckit-paperclip/scripts/legacy-assessment.mjs'
    assert subprocess.run(['git', 'check-ignore', '--quiet', '--no-index', path], cwd=ROOT).returncode == 0
    tracked = subprocess.check_output(['git', 'ls-files', 'extensions/arckit-paperclip/scripts/'], cwd=ROOT, text=True)
    assert not tracked.strip(), tracked
