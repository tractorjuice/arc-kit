/**
 * hooks/validate-reader-handoff.mjs: reader output is validated and sanitised
 * in a hook, with no Bash call and no permission grant.
 *
 * Until 6.17 each research command validated a reader's JSON with a Bash block
 * (mktemp, heredoc, validate-handoff.mjs, echo, rm) that only ran without a
 * prompt because allow-plugin-internals.mjs auto-approved any command naming a
 * plugin script. Native permission rules can't pre-approve that block (the
 * /tmp writes each need approval, and a heredoc of JSON trips Claude Code's
 * expansion-obfuscation check), so validation moved here.
 *
 * Every fixture in tests/plugin/fixtures/<schema>-handoff/ is pushed through
 * both paths: the Agent result (PostToolUse) and the auto-mode hand-back
 * (PreToolUse on SubagentHandback).
 *
 * NOTE the filename: CI runs `tests/plugin/*.test.mjs`.
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PLUGIN = resolve(__dirname, '../../plugins/arckit-claude');
const HOOK = resolve(PLUGIN, 'hooks/validate-reader-handoff.mjs');
const { READER_SCHEMAS, decide, extractJson, readerName } = await import(HOOK);

const fixtureDir = (schema) => resolve(__dirname, 'fixtures', schema.replace('.schema.json', ''));
const load = (schema, f) => readFileSync(resolve(fixtureDir(schema), f), 'utf8');

const agentEvent = (reader, text, status = 'completed') => ({
  hook_event_name: 'PostToolUse',
  tool_name: 'Agent',
  tool_input: { subagent_type: reader, prompt: 'x' },
  tool_response: { status, agentId: 'a1', content: [{ type: 'text', text }], totalTokens: 10 },
});
const handbackEvent = (reader, message) => ({
  hook_event_name: 'PreToolUse',
  tool_name: 'SubagentHandback',
  agent_type: reader,
  tool_input: { message },
});

for (const [reader, schema] of Object.entries(READER_SCHEMAS)) {
  const files = readdirSync(fixtureDir(schema)).filter((f) => f.endsWith('.json')).sort();
  const valid = files.filter((f) => f.startsWith('valid-'));
  const invalid = files.filter((f) => /^(invalid|injection)-/.test(f));

  test(`${reader}: every valid fixture is accepted and replaced with its sanitised payload`, () => {
    assert.ok(valid.length > 0, `${schema} has no valid fixtures`);
    for (const f of valid) {
      const raw = load(schema, f);
      const post = decide(agentEvent(reader, raw)).hookSpecificOutput;
      assert.match(post.additionalContext, /: valid\./, f);
      assert.deepEqual(JSON.parse(post.updatedToolOutput.content[0].text), JSON.parse(raw), f);
      assert.equal(post.updatedToolOutput.agentId, 'a1', `${f}: other result fields are kept`);

      const pre = decide(handbackEvent(reader, raw)).hookSpecificOutput;
      assert.equal(pre.permissionDecision, undefined, `${f}: a valid hand-back is not a permission grant`);
      assert.deepEqual(JSON.parse(pre.updatedInput.message), JSON.parse(raw), f);
    }
  });

  test(`${reader}: every invalid and injection fixture is rejected`, () => {
    assert.ok(invalid.length > 0, `${schema} has no invalid fixtures`);
    for (const f of invalid) {
      const raw = load(schema, f);
      const post = decide(agentEvent(reader, raw)).hookSpecificOutput;
      assert.match(post.additionalContext, /INVALID/, f);
      assert.equal(post.updatedToolOutput, undefined, `${f}: an invalid result is left as it was`);

      const pre = decide(handbackEvent(reader, raw)).hookSpecificOutput;
      assert.equal(pre.permissionDecision, 'deny', f);
      assert.match(pre.permissionDecisionReason, /hand back only the corrected JSON/, f);
    }
  });
}

test('a reply wrapped in prose or a ```json fence is still found', () => {
  const [reader, schema] = Object.entries(READER_SCHEMAS)[0];
  const f = readdirSync(fixtureDir(schema)).find((x) => x.startsWith('valid-'));
  const raw = load(schema, f);
  for (const text of [`Here is the payload:\n\n\`\`\`json\n${raw}\n\`\`\`\n`, `Result follows.\n${raw}\nDone.`]) {
    const out = decide(agentEvent(reader, text)).hookSpecificOutput;
    assert.match(out.additionalContext, /: valid\./);
  }
});

test('invisible characters are stripped from the payload the orchestrator sees', () => {
  const reader = 'arckit-tenders-reader';
  const schema = READER_SCHEMAS[reader];
  const f = readdirSync(fixtureDir(schema)).find((x) => x.startsWith('valid-'));
  const payload = JSON.parse(load(schema, f));
  payload.query.buyer = `zero​width ${payload.query.buyer}`;
  assert.ok(JSON.stringify(payload).includes('​'));
  const out = decide(agentEvent(reader, JSON.stringify(payload))).hookSpecificOutput;
  assert.ok(!out.updatedToolOutput.content[0].text.includes('​'));
});

test('a reply with no JSON gets a note, not a replacement', () => {
  const out = decide(agentEvent('arckit-research-reader', 'Report handed back via SubagentHandback.')).hookSpecificOutput;
  assert.match(out.additionalContext, /no JSON in this reply/);
  assert.equal(out.updatedToolOutput, undefined);
});

test('non-readers, writers, background launches and other tools pass through', () => {
  assert.equal(decide(agentEvent('arckit-research-writer', '{}')), null);
  assert.equal(decide(agentEvent('Explore', '{}')), null);
  assert.equal(decide(agentEvent('arckit-research-reader', '{}', 'async_launched')), null);
  assert.equal(decide({ hook_event_name: 'PostToolUse', tool_name: 'Bash', tool_input: {}, tool_response: {} }), null);
  assert.equal(decide(handbackEvent('general-purpose', '{}')), null);
});

test('plugin-qualified agent names resolve', () => {
  assert.equal(readerName('arckit:arckit-grants-reader'), 'arckit-grants-reader');
  assert.equal(readerName('arckit-grants-reader'), 'arckit-grants-reader');
  assert.equal(readerName('arckit:arckit-grants-writer'), null);
  assert.equal(extractJson('no braces here'), undefined);
});

test('every reader agent file has a schema, and every schema file exists', () => {
  const readers = readdirSync(resolve(PLUGIN, 'agents')).filter((f) => f.endsWith('-reader.md')).map((f) => f.replace('.md', ''));
  assert.deepEqual(readers.sort(), Object.keys(READER_SCHEMAS).sort());
  for (const schema of Object.values(READER_SCHEMAS)) {
    assert.ok(readFileSync(resolve(PLUGIN, 'schemas', schema), 'utf8').length > 0, schema);
  }
});

test('hooks.json registers the hook for both paths, and the process exits 0', () => {
  const hooks = JSON.parse(readFileSync(resolve(PLUGIN, 'hooks/hooks.json'), 'utf8')).hooks;
  const uses = (event, matcher) => (hooks[event] || []).some((g) => g.matcher === matcher
    && g.hooks.some((h) => (h.args || []).join(' ').includes('validate-reader-handoff.mjs')));
  assert.ok(uses('PostToolUse', 'Agent|Task'));
  assert.ok(uses('PreToolUse', 'SubagentHandback'));
  assert.ok(uses('PreToolUse', 'Agent|Task'));
  for (const input of ['', 'not json', JSON.stringify(agentEvent('arckit-research-reader', '{"bad": true}'))]) {
    const r = spawnSync('node', [HOOK], { input, encoding: 'utf8' });
    assert.equal(r.status, 0, r.stderr);
  }
});

test('reader and writer dispatches are kept in the foreground and qualified', () => {
  const pre = (subagent_type, run_in_background) => decide({
    hook_event_name: 'PreToolUse',
    tool_name: 'Agent',
    tool_input: { subagent_type, prompt: 'p', ...(run_in_background === undefined ? {} : { run_in_background }) },
  });
  // Since Claude Code v2.1.198 an omitted run_in_background means background,
  // and a background report never reaches the PostToolUse check (seen live on
  // /arckit:gov-code-search, 29 September).
  for (const [type, bg] of [['arckit:arckit-research-reader', undefined], ['arckit:arckit-grants-writer', true], ['arckit-tenders-reader', false]]) {
    const out = pre(type, bg).hookSpecificOutput;
    assert.equal(out.updatedInput.run_in_background, false, type);
    assert.match(out.updatedInput.subagent_type, /^arckit:arckit-/, type);
    assert.equal(out.updatedInput.prompt, 'p', `${type}: other arguments are kept`);
    assert.equal(out.permissionDecision, undefined, `${type}: an argument rewrite, not a grant`);
  }
  assert.equal(pre('arckit:arckit-research-reader', false), null, 'already foreground and qualified');
  assert.equal(pre('Explore', true), null);
  assert.equal(pre('arckit:arckit-framework', true), null, 'single-tier agents are left alone');
});
