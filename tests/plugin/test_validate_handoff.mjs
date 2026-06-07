#!/usr/bin/env node
/**
 * Tests for plugins/arckit-claude/scripts/validate-handoff.mjs
 *
 * Each fixture in tests/plugin/fixtures/datascout-handoff/ is run through
 * the validator. valid-* fixtures must pass (exit 0, output equals input).
 * invalid-* and injection-* fixtures must fail (exit 1, output is
 * {ok:false, errors:[{path, msg}]}).
 *
 * Run: node tests/plugin/test_validate_handoff.mjs
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, '..', '..');
const validator = resolve(repoRoot, 'plugins/arckit-claude/scripts/validate-handoff.mjs');
const schema = resolve(repoRoot, 'plugins/arckit-claude/schemas/datascout-handoff.schema.json');
const fixturesDir = resolve(__dirname, 'fixtures/datascout-handoff');

function runValidator(payloadPath) {
  return spawnSync('node', [validator, schema, payloadPath], { encoding: 'utf8' });
}

const allFixtures = readdirSync(fixturesDir).filter(f => f.endsWith('.json')).sort();
const validFixtures = allFixtures.filter(f => f.startsWith('valid-'));
const rejectFixtures = allFixtures.filter(f => f.startsWith('invalid-') || f.startsWith('injection-'));

assert.ok(validFixtures.length >= 2, 'expected at least 2 valid fixtures');
assert.ok(rejectFixtures.length >= 4, 'expected at least 4 reject fixtures');

for (const fixture of validFixtures) {
  test(`valid fixture passes: ${fixture}`, () => {
    const payloadPath = resolve(fixturesDir, fixture);
    const result = runValidator(payloadPath);
    assert.equal(result.status, 0,
      `expected exit 0 for ${fixture}; stderr=${result.stderr}; stdout=${result.stdout}`);
    const parsed = JSON.parse(result.stdout);
    const original = JSON.parse(readFileSync(payloadPath, 'utf8'));
    assert.deepEqual(parsed, original, `validator should echo the validated payload for ${fixture}`);
  });
}

for (const fixture of rejectFixtures) {
  test(`reject fixture fails: ${fixture}`, () => {
    const payloadPath = resolve(fixturesDir, fixture);
    const result = runValidator(payloadPath);
    assert.equal(result.status, 1, `expected exit 1 for ${fixture}; stdout=${result.stdout}`);
    const parsed = JSON.parse(result.stdout);
    assert.equal(parsed.ok, false, `expected ok:false for ${fixture}`);
    assert.ok(Array.isArray(parsed.errors) && parsed.errors.length > 0,
      `expected non-empty errors[] for ${fixture}`);
    for (const err of parsed.errors) {
      assert.ok(typeof err.path === 'string', `errors[].path must be string for ${fixture}`);
      assert.ok(typeof err.msg === 'string', `errors[].msg must be string for ${fixture}`);
    }
  });
}
