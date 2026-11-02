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


def test_inline_plugin_settings_disable_installed_copies_in_session_arguments(plugin, tmp_path, monkeypatch):
    seen = []
    def run(cmd, **kwargs):
        seen.append(cmd)
        if cmd[1:3] == ['plugin', 'list']:
            return subprocess.CompletedProcess(cmd, 0, '[{"id":"arckit-example@marketplace"},{"id":"other@marketplace"}]', '')
        event = recording(plugin)['events'][0]
        result = {'type': 'result', 'subtype': 'success'}
        return subprocess.CompletedProcess(cmd, 0, '\n'.join(map(json.dumps, [event, result])), '')
    monkeypatch.setattr(runner.subprocess, 'run', run)
    rec = runner.run_claude(case(), tmp_path, plugin, None)
    assert json.loads(seen[1][seen[1].index('--settings') + 1]) == {'enabledPlugins': {'arckit-example@marketplace': False, 'arckit-example@inline': True}}
    assert runner.validate_runtime(case(), rec, plugin)['passed']
    assert json.loads((plugin / '.claude-plugin/plugin.json').read_text())['defaultEnabled'] is False


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
])
def test_runtime_fails_despite_passing_artifact_graders(plugin, tmp_path, change):
    rec = recording(plugin)
    init = rec['events'][0]
    target = init['plugins'][0]
    if change == 'no-init': rec['events'] = []
    elif change == 'two-inits':
        rec['events'].append(copy.deepcopy(init))
        rec['events'][-1]['plugins'] = []
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
    rec['runtime'] = {'passed': True}  # Stored summaries are not evidence.
    scored = runner.score_case(case(), rec, tmp_path, plugin)
    assert all(g['passed'] for g in scored['graders'])
    assert scored['score'] == 0.0
    assert not scored['runtime']['passed']


def test_replay_checks_recorded_variant_path_even_after_copy_was_removed(plugin, tmp_path):
    rec = recording(tmp_path / 'deleted-variant')
    assert not runner.validate_runtime(case(), rec, plugin)['passed']
    assert runner.validate_runtime(case(), rec, plugin, copied_plugin=True)['passed']


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
    def fake(case, workspace, tested_plugin, model, timeout, **kwargs):
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


@pytest.mark.parametrize('required', ['=2.0', '^1.0', '*', 42, None])
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
    root_manifest = plugin / '.claude-plugin/plugin.json'
    root_data = json.loads(root_manifest.read_text())
    root_data['version'] = '1.0'
    root_manifest.write_text(json.dumps(root_data))
    manifest.write_text(json.dumps({'name': 'fixture-base', 'version': '1.0', 'dependencies': [{'name': 'arckit-example', 'version': '=1.0'}]}))
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
        return subprocess.CompletedProcess(cmd, 0, '[]' if cmd[1:3] == ['plugin', 'list'] else '', '')
    monkeypatch.setattr(runner.subprocess, 'run', run)
    rec = runner.run_claude(case(), tmp_path, plugin, None)
    assert rec['plugin_dirs'] == {'fixture-base': str(dependency), 'arckit-example': str(plugin)}
    cmd = seen[1]
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
           'exit_code': result['exitCode'], 'subtype': result['subtype']}
    actual = runner.validate_runtime({'prompt': '/' + result['runtime']['command'] + ' 001'}, rec, plugin)
    assert actual == result['runtime']
    assert actual['passed']


@pytest.mark.parametrize('field,value', [('exit_code', 1), ('timed_out', True), ('subtype', 'error_max_turns'), ('is_error', True), ('subtype', None)])
def test_loaded_incomplete_runs_preserve_artifact_score(plugin, tmp_path, field, value):
    rec = recording(plugin)
    rec[field] = value
    scored = runner.score_case(case(), rec, tmp_path, plugin)
    assert scored['runtime']['passed']
    assert not scored['completion']['passed']
    assert scored['score'] == 1.0


def test_matching_repeated_inits_pass(plugin):
    rec = recording(plugin)
    rec['events'].append(copy.deepcopy(rec['events'][0]))
    rec['events'][-1]['plugins'].append({'name': 'unrelated', 'source': 'unrelated@installed'})
    assert runner.validate_runtime(case(), rec, plugin)['passed']


@pytest.mark.parametrize('metadata', [{}, {'arckit-example': '/forged'}, {'fixture-base': '/forged'}])
def test_recorded_dependency_maps_cannot_bypass_manifests(plugin, metadata):
    add_dependency(plugin)
    rec = recording(plugin)
    rec['plugin_dirs'] = metadata
    assert not runner.validate_runtime(case(), rec, plugin)['passed']


@pytest.mark.parametrize('dependencies', [None, {}, ['fixture-base'], [{'name': 'fixture-base'}]])
def test_malformed_dependencies_and_omitted_pins_fail(plugin, dependencies):
    manifest = plugin / '.claude-plugin/plugin.json'
    data = json.loads(manifest.read_text())
    data['dependencies'] = dependencies
    manifest.write_text(json.dumps(data))
    with pytest.raises(ValueError):
        runner.plugin_runtime_dirs(plugin)


def test_selected_checkout_dependencies_take_precedence(plugin, tmp_path, monkeypatch):
    local = add_dependency(plugin)
    fallback = tmp_path / 'fallback/plugins/duplicate/.claude-plugin'
    fallback.mkdir(parents=True)
    (fallback / 'plugin.json').write_text(json.dumps({'name': 'fixture-base', 'version': '9.0'}))
    monkeypatch.setattr(runner, 'REPO_ROOT', tmp_path / 'fallback')
    assert runner.plugin_runtime_dirs(plugin)['fixture-base'] == local
    copied = tmp_path / 'copy/root'
    import shutil
    shutil.copytree(plugin, copied)
    assert runner.plugin_runtime_dirs(copied, dependency_parent=plugin.parent)['fixture-base'] == local


@pytest.mark.parametrize('prompt', ['/arckit-example:demo, go', '/arckit-example:demo! go'])
def test_punctuation_is_rejected_consistently(plugin, tmp_path, prompt):
    with pytest.raises(ValueError):
        runner.prompt_command(prompt)
    with pytest.raises(ValueError):
        runner.run_claude({'prompt': prompt}, tmp_path, plugin, None)
    assert not runner.validate_runtime({'prompt': prompt}, recording(plugin), plugin)['passed']


def add_case(plugin, name, prompt='/arckit-example:demo go', extra=''):
    directory = plugin / 'evals' / name
    (directory / 'graders').mkdir(parents=True)
    (directory / 'case.yaml').write_text(f'name: {name}\nprompt: {prompt}\n{extra}')
    (directory / 'graders/report.md').write_text('---\ntype: file_exists\npath: out.md\n---\n')


@pytest.mark.parametrize('bad_prompt', ['/arckit:demo go', '/arckit-example:absent go'])
def test_setup_failure_records_and_continues_batch(plugin, tmp_path, monkeypatch, bad_prompt):
    add_case(plugin, 'a-invalid', bad_prompt)
    add_case(plugin, 'b-valid')
    monkeypatch.setattr(runner, 'build_workspace', lambda *_: None)
    calls = []
    def run(cmd, **kwargs):
        if cmd[1:3] == ['plugin', 'list']:
            return subprocess.CompletedProcess(cmd, 0, '[]', '')
        # The earlier failed case has already been persisted before this call.
        aggregate = json.loads((tmp_path / 'out/aggregate.json').read_text())
        assert aggregate['cases'][0]['completion']['reason'] == 'setup_error'
        calls.append(cmd)
        (kwargs['cwd'] / 'out.md').write_text('Synthetic report')
        output = [recording(plugin)['events'][0], {'type': 'result', 'subtype': 'success'}]
        return subprocess.CompletedProcess(cmd, 0, '\n'.join(map(json.dumps, output)), '')
    monkeypatch.setattr(runner.subprocess, 'run', run)
    out = tmp_path / 'out'
    monkeypatch.setattr(sys, 'argv', ['eval-headless.py', '--plugin', str(plugin), '--output-dir', str(out)])
    assert runner.main() == 1
    assert len(calls) == 1
    aggregate = json.loads((out / 'aggregate.json').read_text())
    assert len(aggregate['cases']) == 2
    assert aggregate['cases'][1]['score'] == 1.0
    assert (out / 'a-invalid/recording.json').exists()


@pytest.mark.parametrize('runs', ['0', '-1', 'true', '1.5', 'null', 'bad'])
def test_all_case_counts_validated_before_any_model_call(plugin, tmp_path, monkeypatch, runs):
    add_case(plugin, 'a-valid')
    add_case(plugin, 'z-invalid', extra=f'runs: {runs}\n')
    def forbidden(*args, **kwargs):
        pytest.fail('no model or workspace call before all counts are validated')
    monkeypatch.setattr(runner, 'run_claude', forbidden)
    monkeypatch.setattr(runner, 'build_workspace', forbidden)
    monkeypatch.setattr(sys, 'argv', ['eval-headless.py', '--plugin', str(plugin), '--output-dir', str(tmp_path / 'out')])
    with pytest.raises(SystemExit) as exc:
        runner.main()
    assert exc.value.code == 2


def test_filtered_replay_defaults_to_recorded_cases_but_explicit_missing_fails(plugin, tmp_path, monkeypatch):
    add_case(plugin, 'recorded')
    add_case(plugin, 'unrecorded')
    out = tmp_path / 'out'
    folder = out / 'recorded'
    folder.mkdir(parents=True)
    rec = recording(plugin)
    (folder / 'recording.json').write_text(json.dumps(rec))
    (folder / 'transcript.jsonl').write_text(json.dumps(rec['events'][0]))
    args = ['eval-headless.py', '--plugin', str(plugin), '--replay', str(out)]
    monkeypatch.setattr(sys, 'argv', args)
    assert runner.main() == 0
    assert len(json.loads((out / 'aggregate.json').read_text())['cases']) == 1
    monkeypatch.setattr(sys, 'argv', [*args, '--case', 'unrecorded'])
    assert runner.main() == 1
    assert 'missing selected recording' in json.loads((out / 'aggregate.json').read_text())['errors'][0]


def test_stale_record_cannot_hide_new_manifest_dependency(plugin):
    rec = recording(plugin)
    assert runner.validate_runtime(case(), rec, plugin)['passed']
    add_dependency(plugin)
    assert not runner.validate_runtime(case(), rec, plugin)['passed']


def test_captured_init_missing_core_is_rejected_by_selected_manifest():
    data = json.loads((ROOT / 'tests/fixtures/legacy-assessment/live-evaluation-2026-11-02/enabled-runtime/results.json').read_text())
    init = copy.deepcopy(data['cases'][0]['initExcerpt'])
    init['plugins'] = [p for p in init['plugins'] if p['name'] != 'arckit']
    for p in init['plugins']:
        p['path'] = str(ROOT / p['path'])
    rec = {'events': [init], 'plugin_dirs': {}}
    assert not runner.validate_runtime({'prompt': '/arckit-uk-legacy:uk-legacy-assessment 001'}, rec, ROOT / 'plugins/arckit-uk-legacy')['passed']


def test_loaded_timeout_fails_live_and_replay_at_zero_threshold(plugin, tmp_path, monkeypatch):
    add_case(plugin, 'demo')
    monkeypatch.setattr(runner, 'build_workspace', lambda *_: None)
    def fake(*args, **kwargs):
        rec = recording(plugin)
        rec['timed_out'] = True
        return rec
    monkeypatch.setattr(runner, 'run_claude', fake)
    out = tmp_path / 'out'
    args = ['eval-headless.py', '--plugin', str(plugin), '--threshold', '0']
    for selection in [['--output-dir', str(out)], ['--replay', str(out)]]:
        monkeypatch.setattr(sys, 'argv', [*args, *selection])
        assert runner.main() == 1
        result = json.loads((out / 'demo/scores.json').read_text())
        assert result['runtime']['passed']
        assert result['completion'] == {'passed': False, 'reason': 'timeout'}


def test_dependency_grader_requires_effective_row_and_preserved_input(tmp_path):
    plugin = ROOT / 'plugins/arckit-uk-legacy'
    data = runner.load_cases(plugin / 'evals', 'legacy-dependency', [])[0]
    graders = {g['_name']: g for g in data['_graders']}
    report = tmp_path / 'projects/001-payments/ARC-001-LEGACY-v1.0.md'
    report.parent.mkdir(parents=True)
    report.write_text('Payments is Legacy. Reporting is Accepted.\n')
    assert not runner.grade(graders['outcome'], {'created_files': [report.relative_to(tmp_path).as_posix()], 'tool_uses': []}, tmp_path)['passed']
    assert not runner.grade(graders['preserve-local'], {'created_files': [report.relative_to(tmp_path).as_posix()], 'tool_uses': []}, tmp_path)['passed']
    report.write_text('| reporting | D7 | Legacy | approved-policy |\n'
                      '| reporting_finding_D7 / reporting | D7 / rule_D7 | Accepted | operating_record |\n')
    assert runner.grade(graders['outcome'], {'created_files': [report.relative_to(tmp_path).as_posix()], 'tool_uses': []}, tmp_path)['passed']
    assert runner.grade(graders['preserve-local'], {'created_files': [report.relative_to(tmp_path).as_posix()], 'tool_uses': []}, tmp_path)['passed']


def test_real_subprocess_receives_session_overrides_without_writing_settings(plugin, tmp_path, monkeypatch):
    fake_bin = tmp_path / 'bin'
    fake_bin.mkdir()
    cli = fake_bin / 'claude'
    cli.write_text(f'''#!{sys.executable}
import json, sys
from pathlib import Path
if sys.argv[1:3] == ['plugin', 'list']:
    print(json.dumps([{{'id': 'arckit-example@marketplace'}}, {{'id': 'unrelated@marketplace'}}]))
else:
    settings = json.loads(sys.argv[sys.argv.index('--settings') + 1])
    Path('received-settings.json').write_text(json.dumps(settings))
    plugin = sys.argv[sys.argv.index('--plugin-dir') + 1]
    print(json.dumps({{'type': 'system', 'subtype': 'init', 'plugins': [{{'name': 'arckit-example', 'source': 'arckit-example@inline', 'path': plugin}}], 'slash_commands': ['arckit-example:demo']}}))
    print(json.dumps({{'type': 'result', 'subtype': 'success'}}))
''')
    cli.chmod(0o755)
    settings_dir = tmp_path / 'config'
    settings_dir.mkdir()
    settings = settings_dir / 'settings.json'
    original = '{"enabledPlugins":{"arckit-example@marketplace":true,"unrelated@marketplace":true}}\n'
    settings.write_text(original)
    monkeypatch.setenv('PATH', str(fake_bin))
    monkeypatch.setenv('CLAUDE_CONFIG_DIR', str(settings_dir))
    rec = runner.run_claude(case(), tmp_path, plugin, None)
    assert runner.validate_runtime(case(), rec, plugin)['passed']
    assert settings.read_text() == original
    assert json.loads((tmp_path / 'received-settings.json').read_text()) == {
        'enabledPlugins': {'arckit-example@marketplace': False, 'arckit-example@inline': True}}
