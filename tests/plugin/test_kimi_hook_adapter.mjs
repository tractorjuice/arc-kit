#!/usr/bin/env node
/**
 * Unit tests for plugins/arckit-claude/hooks/kimi-hook-adapter.mjs
 *
 * The adapter lets ArcKit's unmodified Claude hooks run under Kimi Code CLI by
 * translating their Claude-shaped stdout into Kimi's stdout/exit-code contract.
 * These tests exercise the two pure functions (translate, pathMatchesGuard) so
 * the Claude->Kimi mapping is verified without a live Kimi runtime.
 *
 * Run with:  node tests/plugin/test_kimi_hook_adapter.mjs
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  translate,
  pathMatchesGuard,
  normalisePayload,
  securityPrecheck,
} from '../../plugins/arckit-claude/hooks/kimi-hook-adapter.mjs';

const ADAPTER = join(
  dirname(fileURLToPath(import.meta.url)),
  '../../plugins/arckit-claude/hooks/kimi-hook-adapter.mjs',
);
// Built at runtime so this file does not itself carry a key-shaped string.
const FAKE_AWS_KEY = 'AKIA' + 'ABCDEFGHIJKLMNOP';

const j = (obj) => JSON.stringify(obj);

// ── translate(): blocking ──

test('decision:block -> exit 2 with the reason on stderr', () => {
  const r = translate(j({ decision: 'block', reason: 'secret found' }), 0, '');
  assert.deepEqual(r, { stderr: 'secret found', exitCode: 2 });
});

test('permissionDecision:deny -> exit 2 with permissionDecisionReason', () => {
  const r = translate(
    j({ hookSpecificOutput: { permissionDecision: 'deny', permissionDecisionReason: 'nope' } }),
    0,
    '',
  );
  assert.deepEqual(r, { stderr: 'nope', exitCode: 2 });
});

test('block with no reason falls back to a default reason', () => {
  const r = translate(j({ decision: 'block' }), 0, '');
  assert.equal(r.exitCode, 2);
  assert.match(r.stderr, /Blocked by ArcKit hook/);
});

test('a child that itself exited 2 is honoured verbatim', () => {
  const r = translate('', 2, 'boom');
  assert.deepEqual(r, { stderr: 'boom', exitCode: 2 });
});

// ── translate(): context injection ──

test('additionalContext -> exit 0 with the text on stdout', () => {
  const r = translate(j({ hookSpecificOutput: { additionalContext: 'ctx' } }), 0, '');
  assert.deepEqual(r, { stdout: 'ctx', exitCode: 0 });
});

test('allow-with-warning surfaces the reason as context, does not block', () => {
  const r = translate(j({ decision: 'allow', reason: 'heads up' }), 0, '');
  assert.deepEqual(r, { stdout: 'heads up', exitCode: 0 });
});

// ── translate(): input mutation ──

test('updatedInput.file_path -> exit 2 naming the corrected basename', () => {
  const r = translate(
    j({ updatedInput: { file_path: '/repo/projects/001-x/ARC-001-REQ-v1.0.md' } }),
    0,
    '',
  );
  assert.equal(r.exitCode, 2);
  assert.match(r.stderr, /ARC-001-REQ-v1\.0\.md/);
  assert.doesNotMatch(r.stderr, /\/repo\/projects/); // basename only, no full path
});

// ── translate(): allow / no-op ──

test('permissionDecision:allow -> exit 0, nothing injected', () => {
  const r = translate(j({ hookSpecificOutput: { permissionDecision: 'allow' } }), 0, '');
  assert.deepEqual(r, { exitCode: 0 });
});

test('updatedToolOutput (side-effect hook) -> exit 0, nothing injected', () => {
  const r = translate(j({ hookSpecificOutput: { updatedToolOutput: 'x' } }), 0, '');
  assert.deepEqual(r, { exitCode: 0 });
});

test('empty {} -> exit 0', () => {
  assert.deepEqual(translate('{}', 0, ''), { exitCode: 0 });
});

test('empty string / non-JSON -> exit 0 (fail open)', () => {
  assert.deepEqual(translate('', 0, ''), { exitCode: 0 });
  assert.deepEqual(translate('not json', 0, ''), { exitCode: 0 });
  assert.deepEqual(translate(null, 0, ''), { exitCode: 0 });
});

// ── pathMatchesGuard() ──

test('no guard always matches', () => {
  assert.equal(pathMatchesGuard('anything', ''), true);
  assert.equal(pathMatchesGuard('', undefined), true);
});

test('guard matches relative and absolute paths', () => {
  assert.equal(pathMatchesGuard('projects/001/x.md', '/projects/'), true);
  assert.equal(pathMatchesGuard('/home/u/repo/projects/001/x.md', '/projects/'), true);
  assert.equal(pathMatchesGuard('projects/001/vendors/scores.json', '/vendors/scores.json'), true);
  assert.equal(pathMatchesGuard('projects/001/wardley-maps/m.owm', '/wardley-maps/'), true);
});

test('guard misses unrelated paths and empty file paths', () => {
  assert.equal(pathMatchesGuard('src/app.ts', '/projects/'), false);
  assert.equal(pathMatchesGuard('', '/projects/'), false);
  assert.equal(pathMatchesGuard(undefined, '/projects/'), false);
});

test('guard normalises backslashes so Windows paths still match', () => {
  assert.equal(pathMatchesGuard('repo\\projects\\001\\x.md', '/projects/'), true);
});

// ── normalisePayload(): Kimi -> Claude tool shape ──

test('Kimi WriteFile {path, content} -> Claude Write {file_path, content}', () => {
  const { payload, kind, paths } = normalisePayload({
    tool_name: 'WriteFile',
    tool_input: { path: '/repo/.env', content: 'X=1', mode: 'overwrite' },
  });
  assert.equal(kind, 'Write');
  assert.deepEqual(paths, ['/repo/.env']);
  assert.equal(payload.tool_name, 'Write');
  assert.equal(payload.tool_input.file_path, '/repo/.env');
  assert.equal(payload.tool_input.content, 'X=1');
});

test('Kimi WriteFile in append mode -> Edit, fragment moved to new_string', () => {
  const { payload, kind } = normalisePayload({
    tool_name: 'WriteFile',
    tool_input: { path: 'a.md', content: 'tail', mode: 'append' },
  });
  assert.equal(kind, 'Edit');
  assert.equal(payload.tool_name, 'Edit');
  assert.equal(payload.tool_input.new_string, 'tail');
  assert.equal(payload.tool_input.content, undefined);
});

test('Kimi StrReplaceFile single edit -> Claude Edit with new_string', () => {
  const { payload, kind } = normalisePayload({
    tool_name: 'StrReplaceFile',
    tool_input: { path: 'src/app.ts', edit: { old: 'a', new: 'b', replace_all: false } },
  });
  assert.equal(kind, 'Edit');
  assert.equal(payload.tool_name, 'Edit');
  assert.equal(payload.tool_input.file_path, 'src/app.ts');
  assert.equal(payload.tool_input.new_string, 'b');
});

test('Kimi StrReplaceFile edit list -> every new text reaches new_string', () => {
  const { payload } = normalisePayload({
    tool_name: 'StrReplaceFile',
    tool_input: { path: 'x.md', edit: [{ old: '1', new: 'first' }, { old: '2', new: 'second' }] },
  });
  assert.match(payload.tool_input.new_string, /first/);
  assert.match(payload.tool_input.new_string, /second/);
});

test('Claude-shaped payloads pass through unchanged in meaning', () => {
  const input = { tool_name: 'Edit', tool_input: { file_path: 'a.md', old_string: 'x', new_string: 'y' } };
  const { payload, kind, paths } = normalisePayload(input);
  assert.equal(kind, 'Edit');
  assert.deepEqual(paths, ['a.md']);
  assert.equal(payload.tool_input.file_path, 'a.md');
  assert.equal(payload.tool_input.new_string, 'y');
});

test('non-file tools are not rewritten', () => {
  const input = { tool_name: 'Shell', tool_input: { command: 'ls' } };
  const { payload, kind } = normalisePayload(input);
  assert.equal(kind, null);
  assert.equal(payload, input);
});

// ── securityPrecheck(): fail closed ──

test('security precheck blocks unparseable payloads', () => {
  assert.match(securityPrecheck(null, normalisePayload(null)), /could not parse/);
});

test('security precheck blocks a write with no target path', () => {
  const data = { hook_event_name: 'PreToolUse', tool_name: 'WriteFile', tool_input: { content: 'x' } };
  assert.match(securityPrecheck(data, normalisePayload(data)), /no target path/);
});

test('security precheck blocks an unrecognised tool with no path', () => {
  const data = { hook_event_name: 'PreToolUse', tool_name: 'Mystery', tool_input: {} };
  assert.match(securityPrecheck(data, normalisePayload(data)), /unrecognised file tool/);
});

test('security precheck blocks a call that names two different paths', () => {
  const data = {
    hook_event_name: 'PreToolUse',
    tool_name: 'WriteFile',
    tool_input: { path: '.env', file_path: 'notes.md', content: 'x' },
  };
  assert.match(securityPrecheck(data, normalisePayload(data)), /more than one target path/);
});

test('security precheck lets a well-formed Kimi write through to the guard', () => {
  const data = { hook_event_name: 'PreToolUse', tool_name: 'WriteFile', tool_input: { path: 'a.md', content: 'x' } };
  assert.equal(securityPrecheck(data, normalisePayload(data)), null);
});

// ── end to end: the adapter running the real guards on Kimi payloads ──

function runAdapter(args, payload) {
  const cwd = mkdtempSync(join(tmpdir(), 'arckit-kimi-'));
  try {
    const stdin = typeof payload === 'string' ? payload : JSON.stringify({ cwd, ...payload });
    return spawnSync(process.execPath, [ADAPTER, ...args], { input: stdin, encoding: 'utf8', cwd });
  } finally {
    rmSync(cwd, { recursive: true, force: true });
  }
}

const kimiWrite = (path, content) => ({
  hook_event_name: 'PreToolUse',
  tool_name: 'WriteFile',
  tool_input: { path, content, mode: 'overwrite' },
});

test('e2e: file-protection blocks a Kimi WriteFile to .env', () => {
  const r = runAdapter(['file-protection.mjs'], kimiWrite('.env', 'X=1'));
  assert.equal(r.status, 2, r.stderr);
  assert.match(r.stderr, /Protected/);
});

test('e2e: file-protection blocks a Kimi StrReplaceFile on .ssh/authorized_keys', () => {
  const r = runAdapter(['file-protection.mjs'], {
    hook_event_name: 'PreToolUse',
    tool_name: 'StrReplaceFile',
    tool_input: { path: '/home/u/.ssh/authorized_keys', edit: { old: '', new: 'ssh-ed25519 AAAA' } },
  });
  assert.equal(r.status, 2, r.stderr);
});

test('e2e: secret-file-scanner blocks a Kimi WriteFile carrying an AWS key', () => {
  const r = runAdapter(['secret-file-scanner.mjs'],
    kimiWrite('projects/001-x/ARC-001-REQ-v1.0.md', `key: ${FAKE_AWS_KEY}`));
  assert.equal(r.status, 2, r.stderr);
  assert.match(r.stderr, /AWS access key ID/);
});

test('e2e: secret-file-scanner blocks a Kimi StrReplaceFile edit list carrying an AWS key', () => {
  const r = runAdapter(['secret-file-scanner.mjs'], {
    hook_event_name: 'PreToolUse',
    tool_name: 'StrReplaceFile',
    tool_input: { path: 'notes.md', edit: [{ old: 'a', new: 'fine' }, { old: 'b', new: FAKE_AWS_KEY }] },
  });
  assert.equal(r.status, 2, r.stderr);
});

test('e2e: a clean Kimi write passes both guards', () => {
  for (const hook of ['file-protection.mjs', 'secret-file-scanner.mjs']) {
    const r = runAdapter([hook], kimiWrite('projects/001-x/notes.md', 'hello'));
    assert.equal(r.status, 0, `${hook}: ${r.stderr}`);
  }
});

test('e2e: security guards fail closed on unparseable stdin and missing path', () => {
  for (const hook of ['file-protection.mjs', 'secret-file-scanner.mjs']) {
    assert.equal(runAdapter([hook], 'not json').status, 2, hook);
    assert.equal(runAdapter([hook], { hook_event_name: 'PreToolUse', tool_name: 'WriteFile', tool_input: {} }).status, 2, hook);
  }
});

test('e2e: non-security hooks still fail open on unparseable stdin', () => {
  const r = runAdapter(['validate-arc-filename.mjs', '/projects/'], 'not json');
  assert.equal(r.status, 0, r.stderr);
});

test('e2e: the path guard reads Kimi tool_input.path', () => {
  const r = runAdapter(['validate-arc-filename.mjs', '/projects/'],
    kimiWrite('projects/001-x/ARC-001-NOTATYPE-v1.0.md', '# x'));
  assert.equal(r.status, 2, r.stderr);
});
