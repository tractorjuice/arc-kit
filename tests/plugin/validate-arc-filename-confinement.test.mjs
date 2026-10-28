/**
 * validate-arc-filename.mjs only acts on a Write whose resolved path lies inside
 * <repo>/projects/<project>/, and never creates a directory: it runs before the
 * user approves the Write, so a crafted file_path must not leave anything on disk
 * or get an out-of-project path named back to the model.
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, readdirSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve, dirname, sep } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const HOOK = resolve(__dirname, '../../plugins/arckit-claude/hooks/validate-arc-filename.mjs');

function sandbox() {
  const base = mkdtempSync(join(tmpdir(), 'arckit-arcname-'));
  const repo = join(base, 'repo');
  mkdirSync(join(repo, 'projects', '001-x'), { recursive: true });
  mkdirSync(join(base, 'outside'), { recursive: true });
  return { base, repo };
}

function tree(root) {
  const out = [];
  const walk = (dir) => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const p = join(dir, entry.name);
      out.push(p);
      if (entry.isDirectory()) walk(p);
    }
  };
  walk(root);
  return out.sort();
}

function run(filePath, cwd) {
  const r = spawnSync(process.execPath, [HOOK], {
    input: JSON.stringify({ tool_name: 'Write', tool_input: { file_path: filePath, content: '# x' }, cwd }),
    encoding: 'utf8',
  });
  assert.equal(r.status, 0, r.stderr);
  return r.stdout.trim() ? JSON.parse(r.stdout) : null;
}

function withSandbox(fn) {
  const box = sandbox();
  try {
    const before = tree(box.base);
    fn(box);
    assert.deepEqual(tree(box.base), before, 'the hook must not create any file or directory');
  } finally {
    rmSync(box.base, { recursive: true, force: true });
  }
}

test('a traversal path through a decoy projects/ segment creates nothing outside the repo', () => {
  withSandbox(({ base, repo }) => {
    // Splitting the raw string at its first "projects/" put the base in <base>/outside/X.
    const crafted = [base, 'outside', 'Xprojects', 'B', '..', '..', '..', 'repo', 'projects', '001-x', 'ARC-001-ADR-v1.0.md'].join(sep);
    const out = run(crafted, repo);
    assert.equal(out.decision, 'block');
    const named = join(repo, 'projects', '001-x', 'decisions', 'ARC-001-ADR-001-v1.0.md');
    assert.ok(out.reason.includes(named), out.reason);
    assert.ok(!out.reason.includes(join(base, 'outside')), out.reason);
    assert.ok(!out.reason.includes('..'), out.reason);
  });
});

test('a path that resolves outside <repo>/projects/<project>/ passes through untouched', () => {
  withSandbox(({ base, repo }) => {
    const escapes = [
      [repo, 'projects', '001-x', '..', '..', 'decisions', 'ARC-001-ADR-v1.0.md'].join(sep),
      [repo, 'projects', '..', 'ARC-001-RSCH-v1.0.md'].join(sep),
      join(repo, 'projects', 'ARC-001-ADR-v1.0.md'),
      join(base, 'outside', 'projects', '001-y', 'ARC-001-ADR-v1.0.md'),
      join('..', 'outside', 'projects', '001-y', 'ARC-001-DIAG-v1.0.md'),
    ];
    for (const p of escapes) assert.equal(run(p, repo), null, p);
  });
});

test('a misnamed artefact in the project is still corrected, without creating its subdirectory', () => {
  withSandbox(({ repo }) => {
    const project = join(repo, 'projects', '001-x');

    const adr = run(join(project, 'ARC-001-ADR-v1.0.md'), repo);
    assert.equal(adr.decision, 'block');
    assert.ok(adr.reason.includes(join(project, 'decisions', 'ARC-001-ADR-001-v1.0.md')), adr.reason);

    const wdoc = run(join(project, 'ARC-001-WDOC-v1.0.md'), repo);
    assert.equal(wdoc.decision, 'block');
    assert.ok(wdoc.reason.includes(join(project, 'wardley-maps', 'ARC-001-WDOC-v1.0.md')), wdoc.reason);

    const relative = run(join('projects', '001-x', 'ARC-1-REQ-v1.md'), repo);
    assert.equal(relative.decision, 'block');
    assert.ok(relative.reason.includes(join(project, 'ARC-001-REQ-v1.0.md')), relative.reason);

    const fromSubdir = run(join(project, 'ARC-001-ADR-002-v1.0.md'), project);
    assert.equal(fromSubdir.decision, 'block');
    assert.ok(fromSubdir.reason.includes(join(project, 'decisions', 'ARC-001-ADR-002-v1.0.md')), fromSubdir.reason);

    assert.equal(run(join(project, 'ARC-001-REQ-v1.0.md'), repo), null, 'a correct name passes');
  });
});
