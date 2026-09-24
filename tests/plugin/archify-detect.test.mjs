import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

const { detectArchify, candidateRoots, isArchifyRoot } = await import(
  resolve('plugins/arckit-claude/scripts/archify-detect.mjs')
);

/** Build a directory that looks like a real Archify install. */
function fakeArchify(version = '2.17.0') {
  const root = mkdtempSync(join(tmpdir(), 'archify-'));
  mkdirSync(join(root, 'bin'), { recursive: true });
  mkdirSync(join(root, 'schemas'), { recursive: true });
  writeFileSync(join(root, 'bin', 'archify.mjs'), '// cli');
  for (const type of ['architecture', 'workflow', 'sequence', 'dataflow', 'lifecycle']) {
    writeFileSync(join(root, 'schemas', `${type}.schema.json`), '{}');
  }
  writeFileSync(join(root, 'skill-release.json'), JSON.stringify({ version }));
  return root;
}

test('detects an install via ARCKIT_ARCHIFY_HOME', () => {
  const root = fakeArchify('2.17.0');
  try {
    const result = detectArchify({ env: { ARCKIT_ARCHIFY_HOME: root }, cwd: '/nowhere', home: '/nowhere' });
    assert.equal(result.found, true);
    assert.equal(result.root, root);
    assert.equal(result.version, '2.17.0');
    assert.equal(result.cli, join(root, 'bin', 'archify.mjs'));
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('reports the diagram types the install actually ships', () => {
  const root = fakeArchify();
  try {
    rmSync(join(root, 'schemas', 'lifecycle.schema.json'));
    const result = detectArchify({ env: { ARCKIT_ARCHIFY_HOME: root }, cwd: '/nowhere', home: '/nowhere' });
    assert.deepEqual(result.types, ['architecture', 'workflow', 'sequence', 'dataflow']);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('reports not-found rather than throwing when absent', () => {
  const result = detectArchify({ env: {}, cwd: '/nonexistent-project', home: '/nonexistent-home' });
  assert.equal(result.found, false);
  assert.equal(result.root, null);
  assert.equal(result.cli, null);
  assert.deepEqual(result.types, []);
  assert.ok(result.searched.length > 0, 'reports where it looked');
});

test('a directory missing the CLI is not an Archify root', () => {
  const root = mkdtempSync(join(tmpdir(), 'notarchify-'));
  try {
    mkdirSync(join(root, 'schemas'), { recursive: true });
    assert.equal(isArchifyRoot(root), false);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('a nonexistent path is not an Archify root', () => {
  assert.equal(isArchifyRoot('/definitely/not/here'), false);
});

test('an explicit override is searched before any default location', () => {
  const roots = candidateRoots({ ARCKIT_ARCHIFY_HOME: '/custom/archify' }, '/proj', '/home/u');
  assert.equal(roots[0], resolve('/custom/archify'));
});

test('search covers project-local and per-runtime global locations', () => {
  const roots = candidateRoots({}, '/proj', '/home/u');
  assert.ok(roots.includes('/proj/.claude/skills/archify'), 'project-local Claude Code');
  assert.ok(roots.includes('/home/u/.claude/skills/archify'), 'global Claude Code');
  assert.ok(roots.includes('/home/u/.codex/skills/archify'), 'global Codex');
  assert.ok(roots.includes('/proj/node_modules/archify'), 'npm install');
});

test('falls back to package.json when skill-release.json is absent', () => {
  const root = fakeArchify();
  try {
    rmSync(join(root, 'skill-release.json'));
    writeFileSync(join(root, 'package.json'), JSON.stringify({ version: '9.9.9' }));
    const result = detectArchify({ env: { ARCKIT_ARCHIFY_HOME: root }, cwd: '/nowhere', home: '/nowhere' });
    assert.equal(result.version, '9.9.9');
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('a malformed version file degrades to a null version, not a throw', () => {
  const root = fakeArchify();
  try {
    writeFileSync(join(root, 'skill-release.json'), '{ not json');
    const result = detectArchify({ env: { ARCKIT_ARCHIFY_HOME: root }, cwd: '/nowhere', home: '/nowhere' });
    assert.equal(result.found, true);
    assert.equal(result.version, null);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});
