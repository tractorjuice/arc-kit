import test from 'node:test';
import assert from 'node:assert/strict';
import { resolve } from 'node:path';

const { extractModelFromContent, downgradeEffort, MODEL_MAX_EFFORT } =
  await import(resolve('plugins/arckit-claude/hooks/provenance-model.mjs'));

test('extractModelFromContent: plain Claude id parses', () => {
  assert.equal(extractModelFromContent('**Model**: claude-opus-4-7\n'), 'claude-opus-4-7');
});

test('extractModelFromContent: "AI Model" label parses', () => {
  assert.equal(extractModelFromContent('**AI Model**: claude-sonnet-4-6\n'), 'claude-sonnet-4-6');
});

test('extractModelFromContent: backtick-wrapped id parses without backticks', () => {
  assert.equal(extractModelFromContent('**Model**: `claude-haiku-4-5`\n'), 'claude-haiku-4-5');
});

test('extractModelFromContent: no model line returns null', () => {
  assert.equal(extractModelFromContent('# Heading\n\nBody text.\n'), null);
});

test('extractModelFromContent: provider-prefixed id (slash) parses', () => {
  assert.equal(extractModelFromContent('**Model**: moonshotai/kimi-v3\n'), 'moonshotai/kimi-v3');
});

test('extractModelFromContent: context-window suffix (brackets) parses', () => {
  assert.equal(extractModelFromContent('**AI Model**: claude-opus-4-8[1m]\n'), 'claude-opus-4-8[1m]');
});

test('extractModelFromContent: colon-versioned id parses', () => {
  assert.equal(extractModelFromContent('**Model**: kimi-k2-0711-preview\n'), 'kimi-k2-0711-preview');
});

test('extractModelFromContent: bedrock-style dotted prefix parses', () => {
  assert.equal(extractModelFromContent('**Model**: us.anthropic.claude-opus-4-8\n'), 'us.anthropic.claude-opus-4-8');
});

test('downgradeEffort: null requested returns null', () => {
  assert.equal(downgradeEffort(null, 'claude-opus-4-6'), null);
});

test('downgradeEffort: model not in matrix returns requested unchanged', () => {
  assert.equal(downgradeEffort('high', 'claude-opus-4-8'), 'high');
});

test('downgradeEffort: caps above the model max (current 4-6 behaviour)', () => {
  // Baseline of current code: EFFORT_RANK ranks xhigh(4) above max(3),
  // so xhigh on opus-4-6 (cap 'max') downgrades to 'max'. See Task 3 note.
  assert.equal(downgradeEffort('xhigh', 'claude-opus-4-6'), 'max');
});

test('downgradeEffort: opus-4-8 is capped at xhigh (never downgrades)', () => {
  assert.equal(downgradeEffort('xhigh', 'claude-opus-4-8'), 'xhigh');
  assert.equal(downgradeEffort('max', 'claude-opus-4-8'), 'max');
  assert.equal(downgradeEffort('high', 'claude-opus-4-8'), 'high');
});

test('MODEL_MAX_EFFORT includes claude-opus-4-8', () => {
  assert.equal(MODEL_MAX_EFFORT['claude-opus-4-8'], 'xhigh');
});

test('MODEL_MAX_EFFORT is Claude-only (no kimi/moonshot keys)', () => {
  for (const key of Object.keys(MODEL_MAX_EFFORT)) {
    assert.ok(key.startsWith('claude-'), `unexpected non-Claude matrix key: ${key}`);
  }
});
