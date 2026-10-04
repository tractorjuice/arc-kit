import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  bandText,
  candidateDirs,
  daysBefore,
  documentFacts,
  isArtefactName,
  isProjectDir,
  isProjectsListing,
  needsAttention,
  summarise,
} from '../../plugins/arckit-claude/hooks/mod/status-model.mjs';

const REPO_ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const HOOKS_DIR = join(REPO_ROOT, 'plugins', 'arckit-claude', 'hooks');

function doc({ status = 'DRAFT', lastModified = '2026-09-20', nextReview = '2027-01-01' } = {}) {
  return [
    '# Requirements',
    '',
    '| Field | Value |',
    '|-------|-------|',
    '| **Document ID** | ARC-001-REQ-v1.0 |',
    `| **Status** | ${status} |`,
    `| **Last Modified** | ${lastModified} |`,
    `| **Next Review Date** | ${nextReview} |`,
    '',
    '## Entities',
    '',
    '| Attribute | Type |',
    '|-----------|------|',
    '| Status | APPROVED |',
  ].join('\n');
}

test('names: ARC artefacts and numbered project directories', () => {
  assert.equal(isArtefactName('ARC-001-REQ-v1.0.md'), true);
  assert.equal(isArtefactName('README.md'), false);
  assert.equal(isArtefactName('ARC-001-REQ-v1.0.json'), false);
  assert.equal(isProjectDir('001-payments'), true);
  assert.equal(isProjectDir('000-global'), true);
  assert.equal(isProjectDir('archive'), false);
});

test('documentFacts reads the Document Control Status row, not an entity table', () => {
  const facts = documentFacts(doc({ status: 'IN_REVIEW' }));
  assert.deepEqual(facts, { status: 'IN_REVIEW', nextReview: '2027-01-01', lastModified: '2026-09-20' });
  assert.deepEqual(documentFacts('no table here'), { status: null, nextReview: null, lastModified: null });
});

test('daysBefore crosses month and year boundaries', () => {
  assert.equal(daysBefore('2026-10-01', 30), '2026-09-01');
  assert.equal(daysBefore('2026-01-15', 30), '2025-12-16');
});

test('summarise counts drafts, stale drafts and overdue reviews with the health thresholds', () => {
  const today = '2026-10-01';
  const summary = summarise(['000-global', '001-payments'], [
    doc({ status: 'DRAFT', lastModified: '2026-09-20' }),
    doc({ status: 'DRAFT', lastModified: '2026-08-01' }),
    doc({ status: 'APPROVED', nextReview: '2026-09-30' }),
    doc({ status: 'APPROVED', nextReview: '2026-10-01' }),
  ], today);
  assert.deepEqual(summary, { projects: 2, artefacts: 4, draft: 2, staleDraft: 1, overdue: 1 });
  assert.equal(needsAttention(summary), true);
});

test('bandText is quiet when nothing needs attention and points at /arckit:health when something does', () => {
  const calm = { projects: 1, artefacts: 1, draft: 0, staleDraft: 0, overdue: 0 };
  assert.equal(bandText(calm), 'ArcKit · 1 project · 1 artefact');
  assert.equal(needsAttention(calm), false);
  const busy = { projects: 3, artefacts: 42, draft: 7, staleDraft: 2, overdue: 1 };
  assert.equal(bandText(busy), 'ArcKit · 3 projects · 42 artefacts · 7 draft (2 stale) · 1 review overdue — run /arckit:health');
});

test('candidateDirs walks up from the session folder, so starting inside projects/ still finds it', () => {
  assert.deepEqual(candidateDirs('/repo/projects/001-x'), ['/repo/projects/001-x/projects', '/repo/projects/projects', '/repo/projects', '/projects']);
  assert.deepEqual(candidateDirs('/repo/'), ['/repo/projects', '/projects']);
  assert.ok(candidateDirs('/repo/projects').includes('/repo/projects'), 'started inside projects/');
  assert.deepEqual(candidateDirs('C:\\work\\repo'), ['C:\\work\\repo/projects', 'C:\\work/projects', 'C:/projects']);
  assert.equal(candidateDirs('/a/b/c/d/e', 3).length, 3, 'bounded');
});

test('isProjectsListing matches findRepoRoot: a numbered project directory', () => {
  assert.equal(isProjectsListing([{ name: '001-housing', kind: 'dir' }]), true);
  assert.equal(isProjectsListing([{ name: '000', kind: 'dir' }]), true);
  assert.equal(isProjectsListing([{ name: '001-notes.md', kind: 'file' }]), false);
  assert.equal(isProjectsListing([{ name: 'src', kind: 'dir' }]), false);
  assert.equal(isProjectsListing([]), false);
});

test('the status model stays loadable in the mods sandbox: no imports at all', () => {
  const source = readFileSync(join(HOOKS_DIR, 'mod', 'status-model.mjs'), 'utf8');
  assert.doesNotMatch(source, /^\s*import\s/m);
});

test('the mod imports nothing from Node and is named in hooks.json', () => {
  const source = readFileSync(join(HOOKS_DIR, 'mod', 'register.mjs'), 'utf8');
  assert.doesNotMatch(source, /from\s+['"]node:/);
  const hooks = JSON.parse(readFileSync(join(HOOKS_DIR, 'hooks.json'), 'utf8'));
  assert.deepEqual(hooks.modules, ['./mod/register.mjs']);
});

test('the band also starts when the desktop app attaches, because its session.start names no surface', () => {
  // The engine-level check is hooks/mod/status-band.test.ts, run with
  // `claude plugin test plugins/arckit-claude`; CI has no Claude Code, so this
  // keeps the desktop path from being dropped without anyone noticing.
  const source = readFileSync(join(HOOKS_DIR, 'mod', 'register.mjs'), 'utf8');
  assert.match(source, /on\('session\.attach', onSessionAttach\)/);
  assert.match(source, /new Set\(\['terminal', 'desktop'\]\)/);
});
