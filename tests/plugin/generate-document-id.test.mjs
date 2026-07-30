#!/usr/bin/env node
/**
 * Tests for plugins/arckit-claude/scripts/generate-document-id.mjs.
 *
 * Run with: node --test tests/plugin/generate-document-id.test.mjs
 *
 * The port exists to stop the multi-instance list being restated outside
 * config/doc-types.mjs (#723). Two properties therefore matter most and are
 * asserted directly rather than against a hardcoded expectation:
 *
 *   - every MULTI_INSTANCE_TYPES code demands --next-num, and no other code does
 *   - every KNOWN_TYPES code is accepted, and an unregistered one is rejected
 *
 * Written that way, adding a doc-type to the registry cannot leave this suite
 * asserting a stale list -- which is the failure mode the bash version had.
 */

import { mkdtempSync, rmSync, writeFileSync, mkdirSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import assert from 'node:assert/strict';
import test from 'node:test';

import {
  KNOWN_TYPES,
  MULTI_INSTANCE_TYPES,
  SUBDIR_MAP,
} from '../../plugins/arckit-claude/config/doc-types.mjs';

const SCRIPT = resolve(
  import.meta.dirname,
  '../../plugins/arckit-claude/scripts/generate-document-id.mjs'
);

function run(...args) {
  const result = spawnSync('node', [SCRIPT, ...args], { encoding: 'utf8' });
  return {
    code: result.status,
    out: (result.stdout || '').trim(),
    err: (result.stderr || '').trim(),
  };
}

function withTempDir(fn) {
  const dir = mkdtempSync(join(tmpdir(), 'arckit-docid-'));
  try {
    return fn(dir);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

// --- the contract inherited from generate-document-id.sh --------------------

test('single-instance ID', () => {
  assert.equal(run('001', 'REQ').out, 'ARC-001-REQ-v1.0');
});

test('explicit version', () => {
  assert.equal(run('042', 'HLDR', '2.1').out, 'ARC-042-HLDR-v2.1');
});

test('--filename appends .md', () => {
  assert.equal(run('001', 'REQ', '1.0', '--filename').out, 'ARC-001-REQ-v1.0.md');
});

test('project ID is zero-padded to three digits', () => {
  assert.equal(run('1', 'REQ').out, 'ARC-001-REQ-v1.0');
  assert.equal(run('42', 'REQ').out, 'ARC-042-REQ-v1.0');
  assert.equal(run('001', 'REQ').out, 'ARC-001-REQ-v1.0');
  // Leading zeros must not be read as octal: 010 is project 10, not 8.
  assert.equal(run('010', 'REQ').out, 'ARC-010-REQ-v1.0');
});

test('compound codes survive intact', () => {
  assert.equal(run('000', 'PRIN-COMP').out, 'ARC-000-PRIN-COMP-v1.0');
  assert.equal(run('001', 'SECD-MOD').out, 'ARC-001-SECD-MOD-v1.0');
});

test('flags may appear in any order after the positionals', () => {
  const a = run('001', 'ADR', '--filename', '--next-num', '/nonexistent-dir');
  const b = run('001', 'ADR', '--next-num', '/nonexistent-dir', '--filename');
  assert.equal(a.out, b.out);
  assert.equal(a.out, 'ARC-001-ADR-001-v1.0.md');
});

// --- multi-instance sequencing ----------------------------------------------

test('sequence starts at 001 when the directory does not exist', () => {
  const r = run('001', 'ADR', '--filename', '--next-num', '/nonexistent-dir');
  assert.equal(r.out, 'ARC-001-ADR-001-v1.0.md');
});

test('sequence starts at 001 in an empty directory', () => {
  withTempDir((dir) => {
    assert.equal(
      run('001', 'ADR', '--filename', '--next-num', dir).out,
      'ARC-001-ADR-001-v1.0.md'
    );
  });
});

test('sequence continues from the highest existing number', () => {
  withTempDir((dir) => {
    writeFileSync(join(dir, 'ARC-001-ADR-001-v1.0.md'), '');
    writeFileSync(join(dir, 'ARC-001-ADR-007-v1.0.md'), '');
    writeFileSync(join(dir, 'ARC-001-ADR-003-v2.0.md'), '');
    assert.equal(
      run('001', 'ADR', '--filename', '--next-num', dir).out,
      'ARC-001-ADR-008-v1.0.md'
    );
  });
});

test('sequence ignores other projects, other types and non-files', () => {
  withTempDir((dir) => {
    writeFileSync(join(dir, 'ARC-002-ADR-009-v1.0.md'), ''); // other project
    writeFileSync(join(dir, 'ARC-001-DIAG-009-v1.0.md'), ''); // other type
    writeFileSync(join(dir, 'ARC-001-ADR-002-v1.0.txt'), ''); // not markdown
    writeFileSync(join(dir, 'notes.md'), ''); // unrelated
    mkdirSync(join(dir, 'ARC-001-ADR-005-v1.0.md')); // a directory, not a file
    assert.equal(
      run('001', 'ADR', '--filename', '--next-num', dir).out,
      'ARC-001-ADR-001-v1.0.md'
    );
  });
});

// --- registry-derived behaviour (the point of the port) ---------------------

test('every MULTI_INSTANCE_TYPES code requires --next-num', () => {
  for (const code of MULTI_INSTANCE_TYPES) {
    const r = run('001', code);
    assert.equal(r.code, 1, `${code} should require --next-num`);
    assert.match(r.err, /requires --next-num/);
  }
});

test('no single-instance code requires --next-num', () => {
  for (const code of KNOWN_TYPES) {
    if (MULTI_INSTANCE_TYPES.has(code)) continue;
    const r = run('001', code);
    assert.equal(r.code, 0, `${code} unexpectedly failed: ${r.err}`);
    assert.equal(r.out, `ARC-001-${code}-v1.0`);
  }
});

test('an unregistered code is rejected with an actionable message', () => {
  const r = run('001', 'NOTREAL', '--filename');
  assert.equal(r.code, 1);
  assert.match(r.err, /not a registered doc-type/);
  assert.match(r.err, /config\/doc-types\.mjs/);
  assert.match(r.err, /pages\.md/);
});

test('the codes that shipped broken are now caught before the write', () => {
  // GLOS (#712) and FWRK (#714) were unregistered and the bash generator
  // emitted them anyway; the PreToolUse hook then blocked the write. Both are
  // registered now, so assert the guard fires on their historic misspellings.
  for (const code of ['GLO', 'GLOSS', 'HLD', 'SBD', 'TRACE']) {
    assert.equal(run('001', code).code, 1, `${code} should be rejected`);
  }
});

// --- argument validation ----------------------------------------------------

test('a doc-type in the PROJECT_ID slot is named as such', () => {
  // The shape of the bug that made all 12 arckit-uae call sites no-ops (#722).
  const r = run('FPRO', '1.0', '--filename');
  assert.equal(r.code, 1);
  assert.match(r.err, /PROJECT_ID must be numeric/);
  assert.match(r.err, /looks like a doc-type/);
});

test('a single positional still reports the missing DOC_TYPE', () => {
  const r = run('FPRO', '--filename');
  assert.equal(r.code, 1);
  assert.match(r.err, /DOC_TYPE required/);
});

test('missing arguments and bad flags exit non-zero', () => {
  assert.match(run().err, /PROJECT_ID required/);
  assert.match(run('001').err, /DOC_TYPE required/);
  assert.match(run('001', 'REQ', '--nope').err, /Unknown option/);
  assert.match(run('001', 'ADR', '--next-num').err, /requires a directory/);
  assert.match(run('001', 'ADR', '--next-num', '--filename').err, /requires a directory/);
});

// --- --relpath --------------------------------------------------------------

test('--relpath prefixes the subdirectory for types that have one', () => {
  assert.equal(
    run('001', 'RSCH', '--relpath', '--next-num', '/nonexistent-dir').out,
    'research/ARC-001-RSCH-001-v1.0.md'
  );
  assert.equal(
    run('001', 'ADR', '--relpath', '--next-num', '/nonexistent-dir').out,
    'decisions/ARC-001-ADR-001-v1.0.md'
  );
});

test('--relpath returns a bare filename for types with no subdirectory', () => {
  assert.ok(!SUBDIR_MAP.REQ, 'REQ is expected to live at the project root');
  assert.equal(run('001', 'REQ', '--relpath').out, 'ARC-001-REQ-v1.0.md');
});

test('--relpath agrees with SUBDIR_MAP for every mapped type', () => {
  for (const [code, subdir] of Object.entries(SUBDIR_MAP)) {
    const args = ['001', code, '--relpath'];
    if (MULTI_INSTANCE_TYPES.has(code)) args.push('--next-num', '/nonexistent-dir');
    const r = run(...args);
    assert.equal(r.code, 0, `${code} failed: ${r.err}`);
    assert.ok(
      r.out.startsWith(`${subdir}/`),
      `${code} should land in ${subdir}/, got ${r.out}`
    );
  }
});
