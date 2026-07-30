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

import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import assert from 'node:assert/strict';
import test from 'node:test';

import { SUBDIR_MAP } from '../../plugins/arckit-claude/config/doc-types.mjs';

const HOOK = resolve(
  import.meta.dirname,
  '../../plugins/arckit-claude/hooks/sync-guides.mjs'
);
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
