/**
 * A gate that can't run must stop the write, not wave it through.
 *
 * By default Claude Code carries on when a hook hangs, crashes or can't start,
 * so a Tier 1 control in ENFORCEMENT.md only held while its subprocess worked.
 * `onFailure: "block"` closes that, and turns a crash into a stopped write. So
 * every gate here must survive odd input and print valid output.
 *
 * It is deliberately scoped. Native Claude Code runs without Node, and a plugin
 * enabled for a user loads in every repo, so an unscoped entry would stop every
 * write everywhere on such a machine, and on Bash or UserPromptSubmit it would
 * leave a session unable to run the command that diagnoses the problem.
 *
 * NOTE the filename: CI runs `tests/plugin/*.test.mjs`.
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync, symlinkSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve, dirname } from 'node:path';
import { spawnSync } from 'node:child_process';
import { randomUUID } from 'node:crypto';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO = resolve(__dirname, '../..');
const HOOKS = resolve(REPO, 'plugins/arckit-claude/hooks');
const { hooks } = JSON.parse(readFileSync(resolve(HOOKS, 'hooks.json'), 'utf8'));

const script = (h) => (h.args || [''])[0].split('/').pop();
const entries = (event) => (hooks[event] || []).flatMap((e) => e.hooks.map((h) => ({ ...h, matcher: e.matcher })));

const GATES = [
  'validate-arc-filename.mjs',
  'score-validator.mjs',
  'validate-wardley-math.mjs',
  'validate-backlog-totals.mjs',
  'file-protection.mjs',
  'secret-file-scanner.mjs',
  'validate-reader-handoff.mjs',
];

// Each scoped by an ArcKit-shaped name. Native Claude Code runs without Node, so
// a plugin enabled for a user would otherwise stop every write in every repo.
// `**/projects/**` isn't narrow enough: it matches any repo under ~/projects.
const FAIL_CLOSED = [
  ['validate-arc-filename.mjs', 'Write', 'Write(**/ARC-*)'],
  ['score-validator.mjs', 'Write', 'Write(**/vendors/scores.json)'],
  ['validate-wardley-math.mjs', 'Write', 'Write(**/wardley-maps/**)'],
  ['validate-backlog-totals.mjs', 'Write', 'Write(**/ARC-*-BKLG-*.json)'],
  ['file-protection.mjs', 'Write', 'Write(**/ARC-*)'],
  ['file-protection.mjs', 'Edit', 'Edit(**/ARC-*)'],
  ['secret-file-scanner.mjs', 'Write', 'Write(**/ARC-*)'],
  ['secret-file-scanner.mjs', 'Edit', 'Edit(**/ARC-*)'],
  ['supplier-isolation.mjs', 'Read', 'Read(**/projects/*/vendors/**)'],
];

test('each ArcKit artefact write and supplier read fails closed, with room to run', () => {
  const pre = entries('PreToolUse');
  for (const [gate, matcher, rule] of FAIL_CLOSED) {
    const found = pre.find((h) => script(h) === gate && h.matcher === matcher && h.if === rule);
    assert.ok(found, `${gate} on ${matcher} with ${rule}`);
    assert.equal(found.onFailure, 'block', gate);
    assert.ok(found.timeout >= 15, `${gate} has timeout ${found.timeout}`);
  }
});

test('nothing fails closed without an if rule, so a broken Node stops only ArcKit work', () => {
  for (const event of Object.keys(hooks)) {
    for (const h of entries(event).filter((e) => e.onFailure)) {
      assert.equal(event, 'PreToolUse', script(h));
      assert.ok(h.if, `${script(h)} on ${h.matcher} is unscoped`);
      assert.doesNotMatch(h.if, /\*\*\/projects\/\*\*/, 'matches any repo under ~/projects');
    }
  }
});

test('protected files and secrets are still checked everywhere', () => {
  const pre = entries('PreToolUse');
  for (const gate of ['file-protection.mjs', 'secret-file-scanner.mjs']) {
    const wide = pre.find((h) => script(h) === gate && h.matcher === 'Edit|Write');
    assert.ok(wide, `${gate} must still run on every write`);
    assert.equal(wide.if, undefined);
    assert.equal(wide.onFailure, undefined);
  }
});

test('the unconditional supplier gate stays beside the scoped entry', () => {
  const wide = entries('PreToolUse').find((h) => script(h) === 'supplier-isolation.mjs' && h.matcher === 'Read|Grep|Bash|PowerShell');
  assert.ok(wide);
  assert.equal(wide.if, undefined);
  assert.equal(wide.onFailure, undefined);
});

test('no gate is anchored to where the session started', () => {
  for (const h of entries('PreToolUse').filter((e) => e.if)) {
    assert.doesNotMatch(h.if, /^\w+\(\//, `${script(h)}: ${h.if} misses a session started in a subfolder`);
  }
});

test('a hand-back fails open, because its matcher covers every subagent, not only ours', () => {
  const handback = entries('PreToolUse').filter((h) => h.matcher === 'SubagentHandback');
  assert.ok(handback.length > 0);
  for (const h of handback) assert.equal(h.onFailure, undefined);
});

test('the version floor is one that understands onFailure', () => {
  const check = readFileSync(resolve(HOOKS, 'version-check.mjs'), 'utf8');
  // onFailure needs v2.1.295. The floor is v2.1.319, and the repo's own
  // settings must name the same version the hook warns below.
  const floor = check.match(/MIN_CLAUDE_CODE_VERSION = '2\.1\.(\d+)'/);
  assert.ok(floor && Number(floor[1]) >= 295, 'the floor understands onFailure');
  assert.equal(floor[0], "MIN_CLAUDE_CODE_VERSION = '2.1.319'");
  const settings = JSON.parse(readFileSync(resolve(REPO, '.claude/settings.json'), 'utf8'));
  assert.equal(settings.minimumVersion, '2.1.319');
});

test('a registered hook still runs when reached through a symlink', () => {
  const dir = mkdtempSync(join(tmpdir(), 'hooks-link-'));
  const link = join(dir, 'hooks');
  symlinkSync(HOOKS, link);
  const session_id = randomUUID();
  const run = (input, name = 'supplier-isolation.mjs') =>
    spawnSync('node', [join(link, name)], { input: JSON.stringify(input), encoding: 'utf8' });
  run({ hook_event_name: 'UserPromptSubmit', session_id, prompt: '/arckit:score vendor x' });
  const gate = run({
    hook_event_name: 'PreToolUse', tool_name: 'Read', session_id,
    tool_input: { file_path: '/r/projects/001-x/vendors/acme/bid.pdf' },
  });
  assert.match(gate.stdout, /"permissionDecision":"deny"/);
  const handback = run({
    hook_event_name: 'PreToolUse', tool_name: 'SubagentHandback',
    agent_type: 'arckit:arckit-evaluate-reader', tool_input: { message: 'not json' },
  }, 'validate-reader-handoff.mjs');
  assert.match(handback.stdout, /"permissionDecision":"deny"/);
});

test('no registered hook decides it is the main module with a symlink-blind check', () => {
  const registered = new Set(Object.values(hooks).flat().flatMap((e) => e.hooks.map(script)));
  for (const name of registered) {
    const text = readFileSync(resolve(HOOKS, name), 'utf8');
    assert.doesNotMatch(text, /(resolve|pathToFileURL)\(process\.argv\[1\]\)/, name);
  }
});

const ODD_INPUT = [
  '{}',
  'null',
  '[1,2]',
  '"text"',
  '{"tool_name":"Write"}',
  '{"tool_name":"Write","tool_input":null}',
  '{"tool_name":"Write","tool_input":{"file_path":123,"content":null}}',
  '{"tool_name":"Write","tool_input":{"file_path":"/p/projects/001-x/ARC-001-REQ-v1.0.md"}}',
  '{"tool_name":"Edit","tool_input":{"file_path":"/p/projects/001-x/ARC-001-REQ-v1.0.md","old_string":"a","new_string":"b"}}',
  '{"tool_name":"NotebookEdit","tool_input":{"notebook_path":"/p/x.ipynb"}}',
  '{"tool_name":"Write","tool_input":{"file_path":"/p/projects/001-x/vendors/scores.json","content":"null"}}',
  '{"tool_name":"Write","tool_input":{"file_path":"/p/projects/001-x/vendors/scores.json","content":"{\\"vendors\\":{\\"a\\":null},\\"criteria\\":[null]}"}}',
  '{"tool_name":"Write","tool_input":{"file_path":"/p/projects/001-x/vendors/scores.json","content":"{\\"vendors\\":{\\"a\\":{\\"scores\\":[null]}}}"}}',
  '{"tool_name":"Write","tool_input":{"file_path":"/p/projects/001-x/wardley-maps/ARC-001-WARD-001-v1.0.md","content":""}}',
  '{"tool_name":"Write","tool_input":{"file_path":"/p/projects/001-x/ARC-001-BKLG-v1.0.json","content":"null"}}',
  '{"tool_name":"Write","tool_input":{"file_path":"/p/projects/001-x/ARC-001-BKLG-v1.0.json","content":"{\\"epics\\":[null],\\"stories\\":[null]}"}}',
  '{"tool_name":"SubagentHandback","agent_type":"arckit:arckit-evaluate-reader","tool_input":{}}',
  '{"tool_name":"SubagentHandback","agent_type":"arckit:arckit-evaluate-reader","tool_input":{"message":null}}',
  '{"tool_name":"Write","tool_input":{"file_path":"/p/projects/001-x/vendors/scores.json","content":"{\\"criteria\\":[{\\"weight\\":[]}],\\"vendors\\":{\\"a\\":{\\"scores\\":[{\\"score\\":1,\\"evidence\\":[1]}]}}}"}}',
  '{"tool_name":"Write","tool_input":{"file_path":"/p/settings.json","content":"x"}}',
];
const WITH_CONTEXT = ODD_INPUT.flatMap((input) => {
  let parsed;
  try { parsed = JSON.parse(input); } catch { return []; }
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return [];
  return [JSON.stringify({ hook_event_name: 'PreToolUse', session_id: 'fuzz', ...parsed })];
});
const SESSION_EVENTS = [
  '{"hook_event_name":"UserPromptSubmit","session_id":"fuzz"}',
  '{"hook_event_name":"UserPromptSubmit","session_id":"fuzz","prompt":null}',
  '{"hook_event_name":"PreToolUse","session_id":"fuzz","tool_name":"Skill","tool_input":null}',
  '{"hook_event_name":"PreToolUse","session_id":"fuzz","tool_name":"Bash","tool_input":{"command":null}}',
  '{"hook_event_name":"PreToolUse","session_id":"fuzz","tool_name":"Grep","tool_input":{"path":7}}',
  '{"hook_event_name":"PreToolUse","session_id":"fuzz","tool_name":"Read","tool_input":{"file_path":null}}',
  '{"hook_event_name":"PostToolUse","tool_name":"Agent","tool_input":{"subagent_type":"arckit:arckit-evaluate-reader"},"tool_response":null}',
  '{"hook_event_name":"PreToolUse","tool_name":"SubagentHandback","agent_type":"arckit:arckit-evaluate-reader","tool_input":{"message":"{}"}}',
];

const TOP_LEVEL = new Set(['decision', 'reason', 'hookSpecificOutput', 'continue', 'stopReason', 'suppressOutput', 'systemMessage']);
function assertValidOutput(gate, input, out) {
  const parsed = JSON.parse(out);
  assert.equal(typeof parsed, 'object', input);
  assert.notEqual(parsed, null, input);
  for (const key of Object.keys(parsed)) assert.ok(TOP_LEVEL.has(key), `${gate} printed unknown key ${key} on ${input}`);
  if (parsed.hookSpecificOutput) assert.ok(parsed.hookSpecificOutput.hookEventName, `${gate} on ${input}`);
}

for (const gate of [...GATES, 'supplier-isolation.mjs']) {
  test(`${gate} survives odd input and prints only valid output`, () => {
    for (const input of [...ODD_INPUT, ...WITH_CONTEXT, ...SESSION_EVENTS]) {
      const run = spawnSync('node', [resolve(HOOKS, gate)], { input, encoding: 'utf8', timeout: 15000 });
      assert.ok([0, 2].includes(run.status), `exit ${run.status} on ${input}\n${run.stderr.slice(0, 300)}`);
      const out = run.stdout.trim();
      if (out) assertValidOutput(gate, input, out);
    }
  });
}
