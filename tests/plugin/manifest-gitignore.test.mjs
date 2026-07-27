/**
 * update-manifest.mjs must not index artefacts git will never publish.
 *
 * docs/manifest.json is a published index — ArcKit serves its own at
 * arckit.org/manifest.json. Indexing a gitignored artefact writes a reference
 * to a one-machine-only file into a file everyone fetches: a permanent 404.
 *
 * It also caused a two-writer collision in the ArcKit repo, where `projects/`
 * is gitignored: the hook appended a project group, and
 * scripts/generate-docs-manifest.py (which rebuilds the same file from tracked
 * sources) legitimately dropped it, so `--check` failed after every artefact
 * write.
 *
 * The distinction that matters is IGNORED vs merely UNTRACKED. A brand-new
 * artefact in a repo that tracks projects/ is untracked until committed and
 * must still be indexed.
 *
 * NOTE the filename: CI globs `tests/plugin/*.test.mjs`, so a `test_*.mjs`
 * name would never run here.
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { execFileSync, spawnSync } from 'node:child_process';

const HOOK = resolve('plugins/arckit-claude/hooks/update-manifest.mjs');
const EMPTY = '{"generated":"x","repository":{},"global":[],"projects":[]}';

function makeRepo({ git = true, ignoreProjects = false } = {}) {
  const root = mkdtempSync(join(tmpdir(), 'mani-'));
  mkdirSync(join(root, 'docs'), { recursive: true });
  mkdirSync(join(root, 'projects', '001-demo'), { recursive: true });
  writeFileSync(join(root, 'docs', 'manifest.json'), EMPTY);
  writeFileSync(join(root, 'projects', '001-demo', 'ARC-001-REQ-v1.0.md'), '# Requirements\n');

  if (git) {
    const q = { cwd: root, stdio: 'ignore' };
    spawnSync('git', ['init', '-q', '.'], q);
    spawnSync('git', ['config', 'user.email', 't@t'], q);
    spawnSync('git', ['config', 'user.name', 't'], q);
    if (ignoreProjects) writeFileSync(join(root, '.gitignore'), 'projects/\n');
    spawnSync('git', ['add', '-A'], q);
    spawnSync('git', ['commit', '-qm', 'init'], q);
  }
  return root;
}

function runHook(root) {
  const file = join(root, 'projects', '001-demo', 'ARC-001-REQ-v1.0.md');
  execFileSync('node', [HOOK], {
    input: JSON.stringify({
      tool_name: 'Write',
      cwd: root,
      tool_input: { file_path: file, content: '# Requirements' },
    }),
    encoding: 'utf8',
  });
  return JSON.parse(readFileSync(join(root, 'docs', 'manifest.json'), 'utf8'));
}

test('a repo that TRACKS projects/ still gets its artefacts indexed', () => {
  const m = runHook(makeRepo());
  assert.equal(m.projects.length, 1, 'normal user repos must be unaffected');
});

test('a gitignored artefact is NOT indexed', () => {
  const m = runHook(makeRepo({ ignoreProjects: true }));
  assert.equal(
    m.projects.length,
    0,
    'a published index must not reference a file that will never be published',
  );
});

test('untracked-but-not-ignored is still indexed', () => {
  // The artefact exists and projects/ is not ignored, but nothing is committed.
  // This is every artefact at the moment it is written, so it must be indexed.
  const root = makeRepo({ git: true });
  spawnSync('git', ['rm', '-r', '--cached', 'projects', '-q'], { cwd: root, stdio: 'ignore' });
  assert.equal(runHook(root).projects.length, 1);
});

test('non-git directory fails open and indexes as before', () => {
  const m = runHook(makeRepo({ git: false }));
  assert.equal(m.projects.length, 1, 'no git means the ignore state is unknowable');
});

test('ArcKit own repo: projects/ is gitignored, so nothing is indexed from it', () => {
  const ignored = spawnSync('git', ['check-ignore', '-q', '--', 'projects/'], {
    cwd: resolve('.'),
    stdio: 'ignore',
  });
  assert.equal(ignored.status, 0, 'precondition: ArcKit gitignores projects/');
});
