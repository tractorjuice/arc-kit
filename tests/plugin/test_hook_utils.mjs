#!/usr/bin/env node
/**
 * Unit tests for plugins/arckit-claude/hooks/hook-utils.mjs :: findRepoRoot
 *
 * findRepoRoot walks up from `cwd` looking for an ArcKit repo root. A repo root
 * is an ancestor that contains a `projects/` directory holding at least one
 * numbered project entry (`NNN` or `NNN-...`, e.g. `000-global`, `001-foo`).
 *
 * The numbered-entry gate (isArcKitProjectsDir) exists so an unrelated
 * `projects/` directory higher up the tree is not mistaken for the repo root.
 *
 * Run with:  node tests/plugin/test_hook_utils.mjs
 */

import { mkdtempSync, mkdirSync, writeFileSync, rmSync, symlinkSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';
import assert from 'node:assert/strict';

import { findRepoRoot, listDirsRecursive, listFilesRecursive, parseVersion, compareVersions } from '../../plugins/arckit-claude/hooks/hook-utils.mjs';

function makeRoot() {
  return mkdtempSync(join(tmpdir(), 'arckit-hookutils-'));
}

test('recursive walkers skip symlink cycles and out-of-tree entries', () => {
  const root = makeRoot();
  try {
    const external = join(root, 'external');
    const nested = join(external, 'nested');
    const outside = join(root, 'outside');
    mkdirSync(nested, { recursive: true });
    mkdirSync(outside);
    writeFileSync(join(nested, 'inside.md'), '');
    writeFileSync(join(outside, 'secret.md'), '');
    symlinkSync(external, join(nested, 'cycle'));
    symlinkSync(outside, join(external, 'outside-link'));
    symlinkSync(join(nested, 'inside.md'), join(external, 'file-link.md'));

    assert.deepEqual(listFilesRecursive(external).map(file => file.relativePath), ['nested/inside.md']);
    assert.deepEqual(listDirsRecursive(external), [external, nested]);
    assert.deepEqual(listFilesRecursive(join(external, 'outside-link')), []);
    assert.deepEqual(listDirsRecursive(join(external, 'outside-link')), []);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('recursive walkers bound depth and total scanned entries', () => {
  const root = makeRoot();
  try {
    let dir = root;
    for (let depth = 0; depth < 20; depth++) {
      dir = join(dir, 'nested');
      mkdirSync(dir);
      writeFileSync(join(dir, 'entry.md'), '');
    }
    assert.equal(listDirsRecursive(root).length, 17);
    assert.equal(listFilesRecursive(root).length, 16);

    const wide = join(root, 'wide');
    mkdirSync(wide);
    for (let i = 0; i < 2010; i++) writeFileSync(join(wide, `entry-${String(i).padStart(4, '0')}.md`), '');
    assert.equal(listFilesRecursive(wide).length, 2000);
    assert.deepEqual(listDirsRecursive(wide), [wide]);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('finds the repo root when projects/ holds a numbered project', () => {
  const root = makeRoot();
  try {
    mkdirSync(join(root, 'projects', '001-example'), { recursive: true });
    assert.equal(findRepoRoot(root), root);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('recognises the bare 000-global numbered entry', () => {
  const root = makeRoot();
  try {
    mkdirSync(join(root, 'projects', '000-global'), { recursive: true });
    assert.equal(findRepoRoot(root), root);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('walks up the tree to find the repo root from a nested cwd', () => {
  const root = makeRoot();
  try {
    mkdirSync(join(root, 'projects', '002-foo'), { recursive: true });
    const nested = join(root, 'projects', '002-foo', 'diagrams');
    mkdirSync(nested, { recursive: true });
    assert.equal(findRepoRoot(nested), root);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('returns null when projects/ exists but is empty', () => {
  const root = makeRoot();
  try {
    mkdirSync(join(root, 'projects'), { recursive: true });
    assert.equal(findRepoRoot(root), null);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('returns null when projects/ holds only non-numbered entries', () => {
  const root = makeRoot();
  try {
    mkdirSync(join(root, 'projects', 'global'), { recursive: true });
    writeFileSync(join(root, 'projects', 'README.md'), '# not a project\n');
    assert.equal(findRepoRoot(root), null);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('does not treat an unrelated parent projects/ dir as the root', () => {
  const root = makeRoot();
  try {
    // An unrelated `projects/` higher up (no numbered entries) must be ignored.
    mkdirSync(join(root, 'projects', 'unrelated-app'), { recursive: true });
    const work = join(root, 'work', 'sub');
    mkdirSync(work, { recursive: true });
    assert.equal(findRepoRoot(work), null);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('returns null when there is no projects/ directory at all', () => {
  const root = makeRoot();
  try {
    mkdirSync(join(root, 'src'), { recursive: true });
    assert.equal(findRepoRoot(join(root, 'src')), null);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

// ── parseVersion ────────────────────────────────────────────────────────

test('parseVersion extracts a semver from version output', () => {
  assert.equal(parseVersion('2.1.163 (Claude Code)'), '2.1.163');
  assert.equal(parseVersion('claude 2.1.156'), '2.1.156');
});

test('parseVersion returns null when no version present', () => {
  assert.equal(parseVersion('no version here'), null);
  assert.equal(parseVersion(''), null);
  assert.equal(parseVersion(null), null);
});

// ── compareVersions ─────────────────────────────────────────────────────

test('compareVersions orders the 2.1.163 nudge gate correctly', () => {
  assert.ok(compareVersions('2.1.163', '2.1.163') === 0);
  assert.ok(compareVersions('2.1.162', '2.1.163') < 0); // below gate
  assert.ok(compareVersions('2.1.164', '2.1.163') > 0); // above gate
  assert.ok(compareVersions('2.1.156', '2.1.163') < 0);
});

test('compareVersions handles ragged version strings', () => {
  assert.ok(compareVersions('2.2', '2.1.163') > 0);
  assert.ok(compareVersions('2.1', '2.1.0') === 0);
});
