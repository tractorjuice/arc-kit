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

import {
  translate,
  pathMatchesGuard,
} from '../../plugins/arckit-claude/hooks/kimi-hook-adapter.mjs';

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
