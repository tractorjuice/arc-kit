#!/usr/bin/env node
/**
 * extractRequirementDetails reads each requirement's MoSCoW priority.
 *
 * It used to take the first standalone MUST, SHOULD or MAY in the ten lines
 * under a heading. The template writes MUST_HAVE (which that never matched)
 * 11 to 28 lines down, so every requirement came out as SHOULD.
 *
 * Run with:  node --test tests/plugin/requirement-priority.test.mjs
 */

import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import assert from 'node:assert/strict';

import { extractRequirementDetails } from '../../plugins/arckit-claude/hooks/hook-utils.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const filler = (n) => Array.from({ length: n }, (_, i) => `- Acceptance criterion ${i + 1}`).join('\n');
const priorities = (md) =>
  Object.fromEntries(extractRequirementDetails(md).map((r) => [r.id, r.priority]));

test('reads the Priority field however far below the heading it is', () => {
  const md = [
    '### BR-001: Reduce processing time',
    '',
    'The service SHOULD feel fast.',
    filler(20),
    '',
    '**Priority**: MUST_HAVE',
    '',
    '#### FR-001: Search records',
    filler(12),
    '**Priority**: COULD_HAVE (MoSCoW)',
    '',
    '#### NFR-SEC-001: Authentication',
    '**Priority:** Won\'t Have',
    '',
    '#### INT-001: Payments',
    '- **Priority**: Should Have',
  ].join('\n');
  assert.deepEqual(priorities(md), {
    'BR-001': 'MUST_HAVE',
    'FR-001': 'COULD_HAVE',
    'NFR-SEC-001': 'WONT_HAVE',
    'INT-001': 'SHOULD_HAVE',
  });
});

test('older MUST/SHOULD/MAY files still parse', () => {
  const md = [
    '### BR-001: Ingest pipeline',
    '',
    '| Priority | MUST |',
    '',
    '### FR-002: Accept JSON',
    '',
    'The API MAY accept XML too.',
  ].join('\n');
  assert.deepEqual(priorities(md), { 'BR-001': 'MUST_HAVE', 'FR-002': 'COULD_HAVE' });
});

test('no priority reads as UNSPECIFIED, not SHOULD', () => {
  const md = [
    '#### FR-001: No priority given',
    filler(3),
    '**Priority**: [MUST_HAVE | SHOULD_HAVE | COULD_HAVE | WONT_HAVE]',
    '',
    '#### FR-002: Has a priority',
    '**Priority**: MUST_HAVE',
    '',
    'Depends on DR-004.',
  ].join('\n');
  assert.deepEqual(priorities(md), {
    'FR-001': 'UNSPECIFIED',
    'FR-002': 'MUST_HAVE',
    'DR-004': 'UNSPECIFIED',
  });
});

test('every requirement in the shipped template gets its own priority', () => {
  const template = readFileSync(
    join(ROOT, 'plugins/arckit-claude/templates/requirements-template.md'), 'utf8');
  const filled = template.replaceAll('[MUST_HAVE | SHOULD_HAVE | COULD_HAVE | WONT_HAVE]', 'WONT_HAVE');
  const headed = extractRequirementDetails(filled)
    .filter((r) => r.description !== '(extracted from content)');
  assert.ok(headed.length >= 30, `expected the template's requirements, got ${headed.length}`);
  // BR-002, FR-002 and INT-002 are "repeat for each" stubs with no Priority field
  const stubs = new Set(['BR-002', 'FR-002', 'INT-002']);
  for (const r of headed) {
    assert.equal(r.priority, stubs.has(r.id) ? 'UNSPECIFIED' : 'WONT_HAVE', r.id);
  }
});

// The Codex extension keeps its own hook-utils.mjs. It can't be imported here,
// because its config/doc-types.mjs only exists after the converter runs.
test('the Codex copy of the parser is the same code', () => {
  const section = (rel) => {
    const src = readFileSync(join(ROOT, rel), 'utf8');
    const start = src.indexOf('// ── Requirement Detail Extraction ──');
    const end = src.indexOf('// ── Principles Extraction ──');
    assert.ok(start >= 0 && end > start, `parser section not found in ${rel}`);
    return src.slice(start, end);
  };
  assert.equal(
    section('extensions/arckit-codex/hooks/hook-utils.mjs'),
    section('plugins/arckit-claude/hooks/hook-utils.mjs'),
  );
});
