"""A filesystem fallback must never pass as a loaded plugin evaluation."""
import copy
import importlib.util
import json
from pathlib import Path
import subprocess
import sys

import pytest

ROOT = Path(__file__).resolve().parents[2]
spec = importlib.util.spec_from_file_location('eval_runtime', ROOT / 'scripts/eval-headless.py')
runner = importlib.util.module_from_spec(spec)
spec.loader.exec_module(runner)


@pytest.fixture
def plugin(tmp_path):
    path = tmp_path / 'plugin'
    (path / '.claude-plugin').mkdir(parents=True)
    (path / '.claude-plugin/plugin.json').write_text(json.dumps({'name': 'arckit-example', 'defaultEnabled': False}))
    (path / 'commands').mkdir()
    (path / 'commands/demo.md').write_text('---\ndescription: Synthetic\n---\nDemo\n')
    return path


def case():
    return {'prompt': '/arckit-example:demo go', '_graders': [
        {'_name': 'report', 'type': 'file_exists', 'path': 'out.md'}]}


def recording(plugin):
    return {'plugin_dir': str(plugin), 'events': [{'type': 'system', 'subtype': 'init',
            'plugins': [{'name': 'arckit-example', 'source': 'arckit-example@inline', 'path': str(plugin)}],
            'slash_commands': ['arckit-example:demo']}],
            'exit_code': 0, 'subtype': 'success', 'timed_out': False, 'created_files': ['out.md'],
            'tool_uses': [], 'is_error': False}


def test_inline_plugin_is_explicitly_enabled_without_mutating_settings(plugin, tmp_path, monkeypatch):
    seen = []
    def run(cmd, **kwargs):
        seen.append(cmd)
        event = recording(plugin)['events'][0]
        result = {'type': 'result', 'subtype': 'success'}
        return subprocess.CompletedProcess(cmd, 0, '\n'.join(map(json.dumps, [event, result])), '')
    monkeypatch.setattr(runner.subprocess, 'run', run)
    rec = runner.run_claude(case(), tmp_path, plugin, None)
    assert json.loads(seen[0][seen[0].index('--settings') + 1]) == {'enabledPlugins': {'arckit-example@inline': True}}
    assert runner.validate_runtime(case(), rec, plugin)['passed']
    assert json.loads((plugin / '.claude-plugin/plugin.json').read_text())['defaultEnabled'] is False
    assert not (tmp_path / '.claude/settings.json').exists()


@pytest.mark.parametrize('invocation', ['/arckit:demo go', '/arckit-example:absent go'])
def test_namespace_or_missing_command_fails_before_spawning(plugin, tmp_path, monkeypatch, invocation):
    def forbidden(*args, **kwargs):
        pytest.fail('must not spawn a model for an invalid invocation')
    monkeypatch.setattr(runner.subprocess, 'run', forbidden)
    with pytest.raises(ValueError):
        runner.run_claude({'prompt': invocation}, tmp_path, plugin, None)


@pytest.mark.parametrize('change', [
    'no-init', 'two-inits', 'no-plugin', 'wrong-name', 'marketplace-copy', 'wrong-path',
    'relative-path', 'invalid-path', 'two-plugins', 'no-command', 'wrong-namespace',
    'prefix-command', 'skills-only', 'malformed-plugins', 'malformed-commands', 'tool-assertion',
    'failed-exit', 'timeout', 'max-turns', 'error-result', 'missing-result',
])
def test_runtime_fails_despite_passing_artifact_graders(plugin, tmp_path, change):
    rec = recording(plugin)
    init = rec['events'][0]
    target = init['plugins'][0]
    if change == 'no-init': rec['events'] = []
    elif change == 'two-inits': rec['events'].append(copy.deepcopy(init))
    elif change == 'no-plugin': init['plugins'] = []
    elif change == 'wrong-name': target['name'] = 'unrelated'
    elif change == 'marketplace-copy': target['source'] = 'arckit-example@marketplace'
    elif change == 'wrong-path': target['path'] = str(tmp_path / 'other-copy')
    elif change == 'relative-path': target['path'] = 'plugin'
    elif change == 'invalid-path': target['path'] = '/invalid\0path'
    elif change == 'two-plugins': init['plugins'].append(copy.deepcopy(target))
    elif change == 'no-command': init['slash_commands'] = []
    elif change == 'wrong-namespace': init['slash_commands'] = ['arckit:demo']
    elif change == 'prefix-command': init['slash_commands'] = ['arckit-example:demo-other']
    elif change == 'skills-only': init['skills'] = init.pop('slash_commands')
    elif change == 'malformed-plugins': init['plugins'] = 'arckit-example'
    elif change == 'malformed-commands': init['slash_commands'] = 'arckit-example:demo'
    elif change == 'tool-assertion': rec['events'] = [{'type': 'assistant', 'message': {'content': [init]}}]
    elif change == 'failed-exit': rec['exit_code'] = 1
    elif change == 'timeout': rec['timed_out'] = True
    elif change == 'max-turns': rec['subtype'] = 'error_max_turns'
    elif change == 'error-result': rec['is_error'] = True
    elif change == 'missing-result': rec['subtype'] = None
    rec['runtime'] = {'passed': True}  # Stored summaries are not evidence.
    scored = runner.score_case(case(), rec, tmp_path, plugin)
    assert all(g['passed'] for g in scored['graders'])
    assert scored['score'] == 0.0
    assert not scored['runtime']['passed']


def test_replay_checks_recorded_variant_path_even_after_copy_was_removed(plugin, tmp_path):
    rec = recording(tmp_path / 'deleted-variant')
    assert runner.validate_runtime(case(), rec, plugin)['passed']


def test_symlink_spelling_resolves_to_the_same_plugin(plugin, tmp_path):
    link = tmp_path / 'link'
    link.symlink_to(plugin, target_is_directory=True)
    rec = recording(plugin)
    rec['events'][0]['plugins'][0]['path'] = str(link)
    assert runner.validate_runtime(case(), rec, plugin)['passed']


@pytest.mark.parametrize('variant', [False, True])
def test_invalid_runtime_fails_live_and_replay_even_at_zero_threshold(plugin, tmp_path, monkeypatch, variant):
    directory = plugin / 'evals/demo'
    (directory / 'graders').mkdir(parents=True)
    (directory / 'case.yaml').write_text('name: demo\nprompt: /arckit-example:demo go\n')
    (directory / 'graders/report.md').write_text('---\ntype: file_exists\npath: out.md\n---\n')
    monkeypatch.setattr(runner, 'build_workspace', lambda *_: None)
    calls = []
    def fake(case, workspace, tested_plugin, model, timeout):
        (workspace / 'out.md').write_text('An artifact exists, but the plugin was not loaded.')
        rec = recording(tested_plugin)
        # Even an invalid baseline must fail a comparison whose variant passes.
        if not calls: rec['events'][0]['plugins'] = []
        calls.append(rec)
        return rec
    monkeypatch.setattr(runner, 'run_claude', fake)
    out = tmp_path / 'results'
    args = ['eval-headless.py', '--plugin', str(plugin), '--threshold', '0']
    variant_file = tmp_path / 'variant.md'
    variant_file.write_text('Changed synthetic command\n')
    monkeypatch.setattr(sys, 'argv', [*args, '--output-dir', str(out), *(['--variant', str(variant_file)] if variant else [])])
    assert runner.main() == 1
    monkeypatch.setattr(sys, 'argv', [*args, '--replay', str(out)])
    assert runner.main() == 1
    aggregates = list(out.rglob('aggregate.json'))
    assert aggregates
    assert any(not c['runtime']['passed'] for p in aggregates for c in json.loads(p.read_text())['cases'])


def add_dependency(plugin, name='fixture-base', version='1.0', required='=1.0'):
    dependency = plugin.parent / name
    (dependency / '.claude-plugin').mkdir(parents=True, exist_ok=True)
    (dependency / '.claude-plugin/plugin.json').write_text(json.dumps({'name': name, 'version': version}))
    manifest = plugin / '.claude-plugin/plugin.json'
    data = json.loads(manifest.read_text())
    data.setdefault('dependencies', []).append({'name': name, 'version': required})
    manifest.write_text(json.dumps(data))
    return dependency


def test_declared_dependencies_load_before_selected_overlay(plugin):
    dependency = add_dependency(plugin)
    assert list(runner.plugin_runtime_dirs(plugin).items()) == [('fixture-base', dependency), ('arckit-example', plugin)]


@pytest.mark.parametrize('required', ['=2.0', '^1.0', '*', 42])
def test_dependencies_require_matching_supported_pins(plugin, required):
    add_dependency(plugin, required=required)
    with pytest.raises(ValueError, match='exact version pin'):
        runner.plugin_runtime_dirs(plugin)


def test_missing_ambiguous_and_cyclic_dependencies_fail(plugin):
    dependency = add_dependency(plugin)
    manifest = dependency / '.claude-plugin/plugin.json'
    manifest.unlink()
    with pytest.raises(ValueError, match='unambiguous'):
        runner.plugin_runtime_dirs(plugin)
    manifest.write_text(json.dumps({'name': 'fixture-base', 'version': '1.0'}))
    duplicate = plugin.parent / 'duplicate/.claude-plugin'
    duplicate.mkdir(parents=True)
    (duplicate / 'plugin.json').write_bytes(manifest.read_bytes())
    with pytest.raises(ValueError, match='unambiguous'):
        runner.plugin_runtime_dirs(plugin)
    (duplicate / 'plugin.json').unlink()
    manifest.write_text(json.dumps({'name': 'fixture-base', 'version': '1.0', 'dependencies': [{'name': 'arckit-example'}]}))
    with pytest.raises(ValueError, match='cycle'):
        runner.plugin_runtime_dirs(plugin)


def test_missing_dependency_in_init_invalidates_otherwise_loaded_command(plugin, tmp_path):
    dependency = add_dependency(plugin)
    rec = recording(plugin)
    rec['plugin_dirs'] = {'arckit-example': str(plugin), 'fixture-base': str(dependency)}
    result = runner.validate_runtime(case(), rec, plugin)
    assert result['plugin_loaded'] and result['command_loaded']
    assert not result['dependencies_loaded'] and not result['passed']
    rec['events'][0]['plugins'].append({'name': 'fixture-base', 'source': 'fixture-base@inline', 'path': str(dependency)})
    assert runner.validate_runtime(case(), rec, plugin)['passed']


def test_all_declared_plugins_are_passed_and_enabled(plugin, tmp_path, monkeypatch):
    dependency = add_dependency(plugin)
    seen = []
    def run(cmd, **kwargs):
        seen.append(cmd)
        return subprocess.CompletedProcess(cmd, 0, '', '')
    monkeypatch.setattr(runner.subprocess, 'run', run)
    rec = runner.run_claude(case(), tmp_path, plugin, None)
    assert rec['plugin_dirs'] == {'fixture-base': str(dependency), 'arckit-example': str(plugin)}
    cmd = seen[0]
    assert [cmd[i + 1] for i, arg in enumerate(cmd) if arg == '--plugin-dir'] == [str(dependency), str(plugin)]
    assert json.loads(cmd[cmd.index('--settings') + 1]) == {'enabledPlugins': {'fixture-base@inline': True, 'arckit-example@inline': True}}


@pytest.mark.parametrize('args', [['--runs', '0'], ['--runs', '-1'], ['--timeout', '0'], ['--threshold', 'nan'], ['--threshold', '-1']])
def test_invalid_run_options_cannot_skip_verification(monkeypatch, args):
    monkeypatch.setattr(sys, 'argv', ['eval-headless.py', *args])
    with pytest.raises(SystemExit) as exc:
        runner.main()
    assert exc.value.code == 2


def test_older_recordings_without_dependency_metadata_still_require_dependencies(plugin):
    add_dependency(plugin)
    rec = recording(plugin)
    assert 'plugin_dirs' not in rec
    result = runner.validate_runtime(case(), rec, plugin)
    assert not result['passed'] and not result['dependencies_loaded']


@pytest.mark.parametrize('name', ['legacy-supported', 'legacy-injected-evidence', 'legacy-dependency'])
def test_captured_native_init_shape_passes_runtime_gate(name):
    data = json.loads((ROOT / 'tests/fixtures/legacy-assessment/live-evaluation-2026-11-02/enabled-runtime/results.json').read_text())
    result = next(c for c in data['cases'] if c['case'] == name)
    init = copy.deepcopy(result['initExcerpt'])
    for p in init['plugins']:
        p['path'] = str(ROOT / p['path'])
    plugin = ROOT / 'plugins/arckit-uk-legacy'
    rec = {'events': [init], 'plugin_dir': str(plugin),
           'plugin_dirs': {p['name']: p['path'] for p in init['plugins']},
           'exit_code': result['exitCode'], 'subtype': result['subtype']}
    actual = runner.validate_runtime({'prompt': '/' + result['runtime']['command'] + ' 001'}, rec, plugin)
    assert actual == result['runtime']
    assert actual['passed']
