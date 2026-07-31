#!/usr/bin/env node
/**
 * Functional tests for the two publish-safety behaviours in
 * plugins/arckit-claude/hooks/sync-guides.mjs (#727).
 *
 * 1. The gitignore guard. update-manifest.mjs got one in #690 ("a published
 *    index must not reference a file that will never be published"), but
 *    sync-guides.mjs — which rewrites the WHOLE manifest rather than appending
 *    one entry — never did. ArcKit gitignores its own projects/, so running
 *    /arckit:pages here published a scan of the maintainer's local disk.
 *
 * 2. The preserved region. The generated page is overwritten wholesale, so any
 *    hand-added <head> content was silently destroyed. arckit.org lost its
 *    analytics tag that way, and the tag cannot live in the template: the
 *    template ships to every user, so a hardcoded measurement ID would land on
 *    everybody's page.
 *
 * Both are exercised end to end against a real temporary git repo, because the
 * guard's whole point is that it agrees with what git actually ignores.
 */

import { mkdtempSync, rmSync, mkdirSync, writeFileSync, readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import assert from 'node:assert/strict';
import test from 'node:test';

const PLUGIN_ROOT = resolve(import.meta.dirname, '../../plugins/arckit-claude');
const HOOK = join(PLUGIN_ROOT, 'hooks/sync-guides.mjs');

function git(cwd, ...args) {
  const r = spawnSync('git', args, { cwd, encoding: 'utf8' });
  if (r.status !== 0) throw new Error(`git ${args.join(' ')}: ${r.stderr}`);
  return r.stdout;
}

function runHook(repoRoot) {
  const r = spawnSync('node', [HOOK], {
    cwd: repoRoot,
    input: JSON.stringify({ prompt: '/arckit:pages', cwd: repoRoot }),
    encoding: 'utf8',
    env: { ...process.env, CLAUDE_PLUGIN_ROOT: PLUGIN_ROOT },
    timeout: 60000,
  });
  assert.equal(r.status, 0, `hook failed: ${r.stderr}`);
  return r.stdout;
}

function manifestOf(repoRoot) {
  return JSON.parse(readFileSync(join(repoRoot, 'docs/manifest.json'), 'utf8'));
}

// `ignoreProjects` decides whether the artefact is committed or left untracked
// under a projects/ ignore rule. The distinction is load-bearing: `git
// check-ignore` deliberately does NOT report a TRACKED file as ignored, because
// a tracked file is published whatever the rules say. So the guard can only fire
// on an untracked-and-ignored path, which is exactly ArcKit's own situation.
function withRepo(fn, { ignoreProjects = false } = {}) {
  const dir = mkdtempSync(join(tmpdir(), 'arckit-pages-'));
  try {
    git(dir, 'init', '-q');
    git(dir, 'config', 'user.email', 'test@example.invalid');
    git(dir, 'config', 'user.name', 'test');
    writeFileSync(join(dir, 'README.md'), '# demo\n');
    if (ignoreProjects) writeFileSync(join(dir, '.gitignore'), 'projects/\n');
    git(dir, 'add', '-A');
    git(dir, 'commit', '-qm', 'init');

    mkdirSync(join(dir, 'projects/001-demo'), { recursive: true });
    writeFileSync(
      join(dir, 'projects/001-demo/ARC-001-REQ-v1.0.md'),
      '# Requirements\n'
    );
    if (!ignoreProjects) {
      git(dir, 'add', '-A');
      git(dir, 'commit', '-qm', 'add project');
    }
    return fn(dir);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

test('a tracked project artefact IS indexed', () => {
  withRepo((dir) => {
    runHook(dir);
    const m = manifestOf(dir);
    assert.equal(m.projects.length, 1, 'tracked project should be indexed');
    const paths = m.projects[0].documents.map((d) => d.path);
    assert.ok(
      paths.includes('projects/001-demo/ARC-001-REQ-v1.0.md'),
      `expected the artefact in ${JSON.stringify(paths)}`
    );
  });
});

test('a gitignored project artefact is NOT indexed', () => {
  withRepo((dir) => {
    runHook(dir);
    assert.equal(
      manifestOf(dir).projects.length,
      0,
      'a gitignored project must not reach the published index'
    );
  }, { ignoreProjects: true });
});

test('an untracked but NOT ignored artefact is still indexed', () => {
  // The normal case in a user repo: an artefact written moments ago and not yet
  // committed must appear on the dashboard. The guard tests ignore rules, not
  // tracking, so this must not regress into "only committed files count".
  withRepo((dir) => {
    writeFileSync(
      join(dir, 'projects/001-demo/ARC-001-RISK-v1.0.md'),
      '# Risk Register\n'
    );
    runHook(dir);
    const paths = manifestOf(dir).projects[0].documents.map((d) => d.path);
    assert.ok(
      paths.includes('projects/001-demo/ARC-001-RISK-v1.0.md'),
      `uncommitted artefact missing from ${JSON.stringify(paths)}`
    );
  });
});

test('the hook reports what it omitted rather than dropping it silently', () => {
  withRepo((dir) => {
    assert.match(
      runHook(dir),
      /gitignored project director/i,
      'omission should be surfaced in the summary, not silent'
    );
  }, { ignoreProjects: true });
});

test('the guard fails open when the directory is not a git repo', () => {
  const dir = mkdtempSync(join(tmpdir(), 'arckit-nogit-'));
  try {
    mkdirSync(join(dir, 'projects/001-demo'), { recursive: true });
    writeFileSync(join(dir, 'projects/001-demo/ARC-001-REQ-v1.0.md'), '# Requirements\n');
    runHook(dir);
    assert.equal(
      manifestOf(dir).projects.length,
      1,
      'no git means "cannot prove it is ignored", so the entry is kept'
    );
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test('the dependency graph does not republish a gitignored project', () => {
  // dependencyGraph comes from a SEPARATE scanAllArtifacts() call, and its
  // nodes are an object keyed by document ID rather than an array. A generic
  // post-hoc prune of the manifest missed it entirely and left 7 gitignored
  // paths and 20 edges published — the exact leak the guard exists to close.
  withRepo((dir) => {
    runHook(dir);
    const m = manifestOf(dir);
    const graph = m.dependencyGraph || { nodes: {}, edges: [] };
    const leaked = Object.values(graph.nodes)
      .map((n) => n.path)
      .filter((p) => typeof p === 'string' && p.startsWith('projects/'));
    assert.deepEqual(leaked, [], 'graph must not reference gitignored artefacts');
  }, { ignoreProjects: true });
});

test('graph edges never dangle after a project is skipped', () => {
  withRepo((dir) => {
    runHook(dir);
    const graph = manifestOf(dir).dependencyGraph || { nodes: {}, edges: [] };
    for (const e of graph.edges) {
      assert.ok(graph.nodes[e.from], `edge from unknown node ${e.from}`);
      assert.ok(graph.nodes[e.to], `edge to unknown node ${e.to}`);
    }
  }, { ignoreProjects: true });
});

test('guides survive in a repo that gitignores its generated docs/', () => {
  // docs/ is generated output and gitignoring it is entirely reasonable. An
  // earlier version of the guard walked the whole manifest and stripped all 204
  // guides and 18 role guides in that case, silently emptying the dashboard —
  // far worse than the leak it was closing. The guard is scoped to ArcKit
  // artefact directories for exactly this reason.
  withRepo((dir) => {
    writeFileSync(join(dir, '.gitignore'), 'docs/\n');
    git(dir, 'add', '.gitignore');
    git(dir, 'commit', '-qm', 'ignore generated docs');
    runHook(dir);
    const m = manifestOf(dir);
    assert.ok(m.guides.length > 100, `guides gutted: ${m.guides.length}`);
    assert.ok(m.roleGuides.length > 0, 'role guides gutted');
    assert.equal(m.projects.length, 1, 'the tracked project is unaffected');
  });
});

test('content inside the preserve markers survives regeneration', () => {
  withRepo((dir) => {
    runHook(dir); // first run creates docs/index.html from the template
    const indexPath = join(dir, 'docs/index.html');
    const before = readFileSync(indexPath, 'utf8');
    assert.match(before, /ARCKIT:PRESERVE/, 'template must ship the markers');

    const sentinel = '<script>window.__ARCKIT_TEST_SENTINEL__=1;</script>';
    writeFileSync(
      indexPath,
      before.replace(
        /(<!--\s*ARCKIT:PRESERVE\s*-->)/,
        `$1\n    ${sentinel}`
      ),
      'utf8'
    );

    runHook(dir);
    const after = readFileSync(indexPath, 'utf8');
    assert.ok(
      after.includes(sentinel),
      'hand-added <head> content between the markers must survive regeneration'
    );
  });
});

test('content outside the markers is still regenerated, not preserved', () => {
  withRepo((dir) => {
    runHook(dir);
    const indexPath = join(dir, 'docs/index.html');
    const stray = '<!-- STRAY_OUTSIDE_MARKERS -->';
    writeFileSync(indexPath, stray + readFileSync(indexPath, 'utf8'), 'utf8');
    runHook(dir);
    assert.ok(
      !readFileSync(indexPath, 'utf8').includes(stray),
      'the page is generated; only the marked region is carried across'
    );
  });
});

test('the shipped template carries no site-specific measurement ID', () => {
  // The template reaches every ArcKit user. A hardcoded analytics ID here would
  // report their traffic to whoever authored the template.
  for (const rel of [
    'templates/pages-template.html',
    '../../.arckit/templates/pages-template.html',
  ]) {
    const p = resolve(PLUGIN_ROOT, rel);
    let html;
    try {
      html = readFileSync(p, 'utf8');
    } catch {
      continue;
    }
    assert.ok(
      !/\bG-[A-Z0-9]{8,}\b/.test(html),
      `${rel} contains what looks like a Google Analytics measurement ID`
    );
    assert.match(html, /ARCKIT:PRESERVE/, `${rel} must ship the preserve markers`);
  }
});
