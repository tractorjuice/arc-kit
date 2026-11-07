/**
 * A gate that can't run must stop the write, not wave it through.
 *
 * By default Claude Code carries on when a hook hangs, crashes or can't start,
 * so a Tier 1 control in ENFORCEMENT.md only held while its subprocess worked.
 * `onFailure: "block"` closes that, and turns a crash into a stopped write. So
 * every gate here must survive odd input and print valid output.
 *
 * It is deliberately not on Bash, Grep, the wider Read, UserPromptSubmit or
 * anything after a tool call: with Node missing, those would leave a session
 * unable to run the command that diagnoses the problem.
 *
 * NOTE the filename: CI runs `tests/plugin/*.test.mjs`.
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { spawnSync } from 'node:child_process';
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

test('every write gate fails closed, with room to run under load', () => {
  const pre = entries('PreToolUse');
  for (const gate of GATES) {
    const found = pre.filter((h) => script(h) === gate);
    assert.ok(found.length > 0, `${gate} is not registered`);
    for (const h of found) {
      assert.equal(h.onFailure, 'block', `${gate} on ${h.matcher}`);
      assert.ok(h.timeout >= 15, `${gate} on ${h.matcher} has timeout ${h.timeout}`);
    }
  }
});

test('a supplier read fails closed as well, added to the gate and not replacing it', () => {
  const iso = entries('PreToolUse').filter((h) => script(h) === 'supplier-isolation.mjs');
  const vendorRead = iso.find((h) => h.matcher === 'Read');
  assert.equal(vendorRead?.onFailure, 'block');
  assert.equal(vendorRead?.if, 'Read(**/vendors/**)');
  const wide = iso.find((h) => h.matcher === 'Read|Grep|Bash|PowerShell');
  assert.ok(wide, 'the unconditional gate must stay: an if rule depends on where the session started');
  assert.equal(wide.if, undefined);
});

test('nothing that would stall a whole session fails closed', () => {
  for (const event of Object.keys(hooks).filter((e) => e !== 'PreToolUse')) {
    for (const h of entries(event)) assert.equal(h.onFailure, undefined, `${event} ${script(h)}`);
  }
  for (const h of entries('PreToolUse')) {
    if (h.matcher === 'Skill' || h.matcher === 'Read|Grep|Bash|PowerShell') {
      assert.equal(h.onFailure, undefined, h.matcher);
    }
  }
});

test('the version floor is one that understands onFailure', () => {
  const check = readFileSync(resolve(HOOKS, 'version-check.mjs'), 'utf8');
  assert.match(check, /MIN_CLAUDE_CODE_VERSION = '2\.1\.295'/);
  const settings = JSON.parse(readFileSync(resolve(REPO, '.claude/settings.json'), 'utf8'));
  assert.equal(settings.minimumVersion, '2.1.295');
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
];

for (const gate of [...GATES, 'supplier-isolation.mjs']) {
  test(`${gate} survives odd input and prints only valid output`, () => {
    for (const input of ODD_INPUT) {
      const run = spawnSync('node', [resolve(HOOKS, gate)], { input, encoding: 'utf8', timeout: 15000 });
      assert.ok([0, 2].includes(run.status), `exit ${run.status} on ${input}\n${run.stderr.slice(0, 300)}`);
      const out = run.stdout.trim();
      if (out) {
        const parsed = JSON.parse(out);
        assert.equal(typeof parsed, 'object', input);
        assert.notEqual(parsed, null, input);
      }
    }
  });
}
