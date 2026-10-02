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
 * No path may rewrite a tool's input: the Claude plugin directory declined
 * the core plugin because it counts a PreToolUse input rewrite as the plugin
 * approving its own action. A hand-back passes untouched or is denied.
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

  test(`${reader}: every valid fixture is accepted, and a hand-back passes only as the bare sanitised JSON`, () => {
    assert.ok(valid.length > 0, `${schema} has no valid fixtures`);
    for (const f of valid) {
      const raw = load(schema, f);
      const post = decide(agentEvent(reader, raw)).hookSpecificOutput;
      assert.match(post.additionalContext, /: valid\./, f);
      assert.deepEqual(JSON.parse(post.updatedToolOutput.content[0].text), JSON.parse(raw), f);
      assert.equal(post.updatedToolOutput.agentId, 'a1', `${f}: other result fields are kept`);

      // The sanitised payload, handed back as bare JSON, passes untouched.
      const sanitised = post.updatedToolOutput.content[0].text;
      assert.equal(decide(handbackEvent(reader, sanitised)), null, `${f}: the bare sanitised JSON passes`);

      // The raw fixture passes only when it already is that payload; otherwise
      // the reader is told to hand back the bare JSON. It is never rewritten.
      const pre = decide(handbackEvent(reader, raw));
      if (pre !== null) {
        assert.equal(pre.hookSpecificOutput.permissionDecision, 'deny', f);
        assert.match(pre.hookSpecificOutput.permissionDecisionReason, /bare JSON payload/, f);
        assert.ok(!('updatedInput' in pre.hookSpecificOutput), `${f}: no input rewrite`);
      }

      // Wrapped in prose, a valid report is refused, not unwrapped.
      const wrapped = decide(handbackEvent(reader, `Here is my report:\n${raw}`)).hookSpecificOutput;
      assert.equal(wrapped.permissionDecision, 'deny', f);
      assert.ok(!('updatedInput' in wrapped), `${f}: no input rewrite`);
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
  assert.ok(!uses('PreToolUse', 'Agent|Task'), 'the dispatch rewrite is gone');
  for (const input of ['', 'not json', JSON.stringify(agentEvent('arckit-research-reader', '{"bad": true}'))]) {
    const r = spawnSync('node', [HOOK], { input, encoding: 'utf8' });
    assert.equal(r.status, 0, r.stderr);
  }
});

test('Agent dispatches are never rewritten', () => {
  const pre = (subagent_type, run_in_background) => decide({
    hook_event_name: 'PreToolUse',
    tool_name: 'Agent',
    tool_input: { subagent_type, prompt: 'p', ...(run_in_background === undefined ? {} : { run_in_background }) },
  });
  for (const [type, bg] of [['arckit:arckit-research-reader', undefined], ['arckit:arckit-grants-writer', true], ['arckit-tenders-reader', false], ['Explore', true]]) {
    assert.equal(pre(type, bg), null, type);
  }
});

test('every reader and writer dispatch in the commands asks for the foreground', () => {
  const dir = resolve(PLUGIN, 'commands');
  for (const f of readdirSync(dir).filter((n) => n.endsWith('.md'))) {
    const text = readFileSync(resolve(dir, f), 'utf8');
    for (const m of text.matchAll(/`subagent_type: "arckit:arckit-[a-z0-9-]+-(?:reader|writer)"`(.{0,40})/g)) {
      assert.match(m[1], /^, `run_in_background: false`/, `${f}: ${m[0]}`);
    }
  }
});
