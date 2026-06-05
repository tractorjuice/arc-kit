#!/usr/bin/env node
/**
 * Unit tests for arckit-claude/hooks/hook-utils.mjs :: findRepoRoot
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

import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';
import assert from 'node:assert/strict';

import { findRepoRoot, parseVersion, compareVersions } from '../../arckit-claude/hooks/hook-utils.mjs';

function makeRoot() {
  return mkdtempSync(join(tmpdir(), 'arckit-hookutils-'));
}

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
