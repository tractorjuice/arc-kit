#!/usr/bin/env node
/**
 * Regression tests for the project buckets in
 * plugins/arckit-claude/hooks/sync-guides.mjs.
 *
 * scanProject() routes each artefact into project[<camelCased SUBDIR_MAP dir>].
 * The bucket list used to be hand-written while the routing keys were derived
 * from SUBDIR_MAP, so registering a doc-type with a NEW subdirectory left an
 * undefined array and scanProject died on `project[key].push(...)`.
 *
 * That shipped twice and was never reported, because the crash only fires in a
 * repo that actually has the new directory:
 *
 *   - `audits`    arrived with CDAU in v6.7.0
 *   - `framework` arrived with FWRK in #714
 *
 * Both took /arckit:pages down before it could rebuild the dashboard, which is
 * how docs/manifest.json went stale. Registering a doc-type is already a
 * multi-place operation; this asserts it is not also a silent one.
 */

import { mkdtempSync, rmSync, mkdirSync, writeFileSync, readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import assert from 'node:assert/strict';
import test from 'node:test';

import { MULTI_INSTANCE_TYPES, SUBDIR_MAP } from '../../plugins/arckit-claude/config/doc-types.mjs';

const REPO_ROOT = resolve(import.meta.dirname, '../..');
const PLUGIN_ROOT = join(REPO_ROOT, 'plugins/arckit-claude');
const HOOK = join(PLUGIN_ROOT, 'hooks/sync-guides.mjs');
const TEMPLATE = join(PLUGIN_ROOT, 'templates/pages-template.html');
const CODEX_HOOK = join(REPO_ROOT, 'extensions/arckit-codex/hooks/sync-guides.mjs');
const CODEX_RUNNER = join(REPO_ROOT, 'extensions/arckit-codex/hooks/arckit-codex-hook.mjs');
const source = readFileSync(HOOK, 'utf8');

const camel = (dir) => dir.replace(/-([a-z])/g, (_, c) => c.toUpperCase());

test('every SUBDIR_MAP destination gets a bucket', () => {
  // Derived, not listed: assert the loop exists rather than grepping for names,
  // so this cannot pass while silently omitting a directory.
  assert.match(
    source,
    /for \(const dir of new Set\(Object\.values\(SUBDIR_MAP\)\)\) \{\s*project\[subdirKey\(dir\)\] = \[\];/,
    'project buckets must be derived from SUBDIR_MAP, not hand-listed'
  );
});

test('bucket initialisation and file routing share one key derivation', () => {
  const uses = source.match(/subdirKey\(/g) || [];
  assert.ok(
    uses.length >= 3,
    'subdirKey() should be defined once and used by both the initialiser and ' +
      'the routing loop, so the two cannot diverge'
  );
  assert.ok(
    !/subdirMap\[dir\] = dir\.replace\(/.test(source),
    'the routing loop must call subdirKey(), not re-implement the camelCase'
  );
});

test('the two directories whose omission shipped are covered', () => {
  for (const dir of ['audits', 'framework']) {
    assert.ok(
      Object.values(SUBDIR_MAP).includes(dir),
      `${dir} is expected to be a SUBDIR_MAP destination`
    );
  }
});

test('no SUBDIR_MAP destination camel-cases to a reserved manifest key', () => {
  // documents/reviews/vendors and friends are populated by their own scanners.
  // A SUBDIR_MAP directory colliding with one would have its entries silently
  // merged into the wrong list rather than crashing.
  const reserved = new Set([
    'id', 'name', 'documents', 'reviews', 'vendors',
    'vendorProfiles', 'techNotes', 'dataSourceProfiles', 'external',
  ]);
  const collisions = [...new Set(Object.values(SUBDIR_MAP))]
    .map(camel)
    .filter((k) => reserved.has(k));
  assert.deepEqual(collisions, [], `SUBDIR_MAP keys collide with reserved manifest keys`);
});

// ── Every bucket reaches the dashboard (#982) ───────────────────────────────
//
// Deriving the buckets stopped the crash, but the dashboard template, the
// DOCUMENT STATS table and llms.txt each named their buckets by hand and
// stopped at research/ and reviews/. changes/ (ACHG), audits/ (CDAU),
// framework/ (FWRK) and procurement/ (GCLD, DOS, GCLC) were written to
// manifest.json and then never shown, searched or counted.

const BUCKET_KEYS = [...new Set(Object.values(SUBDIR_MAP))].map(camel);
const template = readFileSync(TEMPLATE, 'utf8');

// The body of a top-level function in the template's inline script: from its
// declaration to the next declaration at the same indentation.
function templateFunction(name) {
  const start = template.indexOf(`        function ${name}(`);
  assert.ok(start >= 0, `pages-template.html has no function ${name}()`);
  const next = template.indexOf('\n        function ', start + 1);
  return template.slice(start, next === -1 ? undefined : next);
}

for (const [fn, minUses, what] of [
  ['buildProjectNav', 1, 'sidebar section'],
  ['buildSearchIndex', 1, 'search index entry'],
  // once for the KPI totals and category chart, once for the governance checklist
  ['computeDashboardMetrics', 2, 'dashboard count'],
]) {
  test(`pages-template.html ${fn}() covers every bucket (${what})`, () => {
    const body = templateFunction(fn);
    const missing = [...BUCKET_KEYS, 'reviews'].filter(
      (key) => (body.match(new RegExp(`project\\.${key}\\b`, 'g')) || []).length < minUses
    );
    assert.deepEqual(missing, [], `${fn}() does not handle project.<key> for: ${missing.join(', ')}`);
  });
}

for (const [label, file] of [['Claude', HOOK], ['Codex', CODEX_HOOK]]) {
  test(`${label} sync-guides.mjs counts every bucket in DOCUMENT STATS`, () => {
    const text = readFileSync(file, 'utf8');
    const missing = [...BUCKET_KEYS, 'reviews'].filter(
      (key) => !text.includes(`(p.${key} ? p.${key}.length : 0)`)
    );
    assert.deepEqual(missing, [], `no DOCUMENT STATS count for: ${missing.join(', ')}`);
  });
}

test('Codex sync-guides.mjs derives its buckets from SUBDIR_MAP', () => {
  // The Codex hook is hand-maintained and kept the pre-#714 hand-written list,
  // so a repo with changes/ crashed $arckit-pages there too.
  const text = readFileSync(CODEX_HOOK, 'utf8');
  assert.match(
    text,
    /for \(const dir of new Set\(Object\.values\(SUBDIR_MAP\)\)\) \{\s*project\[subdirKey\(dir\)\] = \[\];/,
    'Codex project buckets must be derived from SUBDIR_MAP, not hand-listed'
  );
});

test('Codex incremental manifest update routes every subdirectory to its bucket', () => {
  const text = readFileSync(CODEX_RUNNER, 'utf8');
  const block = text.match(/const SUBDIR_TO_MANIFEST_KEY = \{([\s\S]*?)\};/);
  assert.ok(block, 'arckit-codex-hook.mjs has no SUBDIR_TO_MANIFEST_KEY');
  const mapped = Object.fromEntries(
    [...block[1].matchAll(/"?([a-z-]+)"?:\s*"([A-Za-z]+)"/g)].map((m) => [m[1], m[2]])
  );
  const expected = Object.fromEntries(
    [...new Set(Object.values(SUBDIR_MAP)), 'reviews'].map((dir) => [dir, camel(dir)])
  );
  assert.deepEqual(mapped, expected);
});

// One ARC file in every SUBDIR_MAP directory plus reviews/, named the way the
// filename hook requires (multi-instance codes carry -001-).
function seedEveryBucket(projectDir) {
  const paths = {};
  const firstCode = {};
  for (const [code, dir] of Object.entries(SUBDIR_MAP)) firstCode[dir] ??= code;
  firstCode.reviews = 'HLDR';
  for (const [dir, code] of Object.entries(firstCode)) {
    const seq = MULTI_INSTANCE_TYPES.has(code) ? '-001' : '';
    const name = `ARC-001-${code}${seq}-v1.0.md`;
    mkdirSync(join(projectDir, dir), { recursive: true });
    writeFileSync(join(projectDir, dir, name), `# ${code} sample\n`);
    paths[camel(dir)] = `projects/001-demo/${dir}/${name}`;
  }
  return paths;
}

test('a /arckit:pages run indexes, counts and lists a file in every bucket', () => {
  const dir = mkdtempSync(join(tmpdir(), 'arckit-pages-buckets-'));
  try {
    spawnSync('git', ['init', '-q'], { cwd: dir });
    const projectDir = join(dir, 'projects/001-demo');
    mkdirSync(projectDir, { recursive: true });
    writeFileSync(join(projectDir, 'ARC-001-REQ-v1.0.md'), '# Requirements\n');
    const expected = seedEveryBucket(projectDir);

    const r = spawnSync('node', [HOOK], {
      cwd: dir,
      input: JSON.stringify({ prompt: '/arckit:pages LLMS=true', cwd: dir }),
      encoding: 'utf8',
      env: { ...process.env, CLAUDE_PLUGIN_ROOT: PLUGIN_ROOT },
      timeout: 60000,
    });
    assert.equal(r.status, 0, `hook failed: ${r.stderr}`);
    const context = JSON.parse(r.stdout).hookSpecificOutput.additionalContext;

    const manifest = JSON.parse(readFileSync(join(dir, 'docs/manifest.json'), 'utf8'));
    const project = manifest.projects.find((p) => p.id === '001-demo');
    for (const [key, path] of Object.entries(expected)) {
      assert.deepEqual((project[key] || []).map((d) => d.path), [path], `manifest bucket ${key}`);
    }

    const llms = readFileSync(join(dir, 'docs/llms.txt'), 'utf8');
    const unlisted = Object.values(expected).filter((path) => !llms.includes(path));
    assert.deepEqual(unlisted, [], 'llms.txt leaves out files in some buckets');

    for (const label of ['Change Requests', 'Audits', 'Framework', 'Procurement']) {
      assert.match(context, new RegExp(`\\| ${label} \\| 1 \\|`), `DOCUMENT STATS row for ${label}`);
    }
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});
