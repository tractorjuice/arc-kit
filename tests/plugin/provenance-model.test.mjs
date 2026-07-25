import test from 'node:test';
import assert from 'node:assert/strict';
import { resolve } from 'node:path';

const { extractModelFromContent, downgradeEffort, MODEL_EFFORTS, EFFORT_RANK } =
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
  assert.equal(extractModelFromContent('**Model**: moonshotai/kimi-k3\n'), 'moonshotai/kimi-k3');
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

// ── Effort ordering (official docs: max is the deepest tier, above xhigh) ──

test('EFFORT_RANK orders max above xhigh', () => {
  assert.ok(EFFORT_RANK.max > EFFORT_RANK.xhigh);
  assert.ok(EFFORT_RANK.xhigh > EFFORT_RANK.high);
});

// ── downgradeEffort ──

test('downgradeEffort: null requested returns null', () => {
  assert.equal(downgradeEffort(null, 'claude-opus-4-6'), null);
});

test('downgradeEffort: null model returns null', () => {
  assert.equal(downgradeEffort('high', null), null);
});

test('downgradeEffort: full-support / unlisted model returns requested unchanged', () => {
  // Opus 4.8 supports every level, so it is absent from MODEL_EFFORTS.
  assert.equal(downgradeEffort('xhigh', 'claude-opus-4-8'), 'xhigh');
  assert.equal(downgradeEffort('max', 'claude-opus-4-8'), 'max');
  assert.equal(downgradeEffort('high', 'claude-opus-4-8'), 'high');
});

test('downgradeEffort: xhigh on Opus 4.6 falls to high, not max (official rule)', () => {
  // Opus 4.6 supports low/medium/high/max but NOT xhigh; the harness falls back
  // to the highest supported level at or below xhigh, which is high.
  assert.equal(downgradeEffort('xhigh', 'claude-opus-4-6'), 'high');
});

test('downgradeEffort: max on Opus 4.6 is supported and not downgraded', () => {
  assert.equal(downgradeEffort('max', 'claude-opus-4-6'), 'max');
  assert.equal(downgradeEffort('high', 'claude-opus-4-6'), 'high');
});

test('downgradeEffort: Sonnet 4.6 mirrors Opus 4.6 (xhigh -> high, max kept)', () => {
  assert.equal(downgradeEffort('xhigh', 'claude-sonnet-4-6'), 'high');
  assert.equal(downgradeEffort('max', 'claude-sonnet-4-6'), 'max');
});

test('downgradeEffort: models with no effort support get no fabricated downgrade', () => {
  // Haiku 4.5 does not support effort per the docs; unlisted -> requested is
  // returned unchanged rather than inventing a downgrade.
  assert.equal(downgradeEffort('high', 'claude-haiku-4-5'), 'high');
});

// ── MODEL_EFFORTS shape ──

test('MODEL_EFFORTS encodes the Opus 4.6 support gap (max, not xhigh)', () => {
  assert.ok(MODEL_EFFORTS['claude-opus-4-6'].includes('max'));
  assert.ok(!MODEL_EFFORTS['claude-opus-4-6'].includes('xhigh'));
});

test('MODEL_EFFORTS omits full-support models (no restriction to encode)', () => {
  assert.equal(MODEL_EFFORTS['claude-opus-4-8'], undefined);
  assert.equal(MODEL_EFFORTS['claude-opus-4-7'], undefined);
});

test('MODEL_EFFORTS is Claude-only (no kimi/moonshot keys)', () => {
  for (const key of Object.keys(MODEL_EFFORTS)) {
    assert.ok(key.startsWith('claude-'), `unexpected non-Claude matrix key: ${key}`);
  }
});
