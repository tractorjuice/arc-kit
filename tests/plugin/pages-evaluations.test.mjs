/**
 * /arckit:pages lists a vendor's evaluation beside its documents.
 *
 * Evaluations live in `vendors/_evaluations/{vendor}/`, apart from the folder a
 * bid pack goes into, so a pack can't use ArcKit's filenames (#873). They're under
 * `vendors/` so a rule that keeps vendors out of git covers them too. The site's
 * vendor list must follow them, without listing `_evaluations` as a vendor.
 *
 * NOTE the filename: CI runs `tests/plugin/*.test.mjs`.
 */

import { mkdtempSync, rmSync, mkdirSync, writeFileSync, readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import assert from 'node:assert/strict';
import test from 'node:test';

const PLUGIN_ROOT = resolve(import.meta.dirname, '../../plugins/arckit-claude');
const HOOK = join(PLUGIN_ROOT, 'hooks/sync-guides.mjs');

test('a vendor lists its evaluation from evaluations/', () => {
  const dir = mkdtempSync(join(tmpdir(), 'arckit-pages-eval-'));
  try {
    spawnSync('git', ['init', '-q'], { cwd: dir });
    const p = join(dir, 'projects/001-tender');
    mkdirSync(join(p, 'vendors/acme'), { recursive: true });
    mkdirSync(join(p, 'vendors/_evaluations/acme'), { recursive: true });
    writeFileSync(join(p, 'ARC-001-REQ-v1.0.md'), '# Requirements\n');
    writeFileSync(join(p, 'vendors/acme/proposal.md'), '# Proposal\n');
    writeFileSync(join(p, 'vendors/_evaluations/acme/evaluation.md'), '# Evaluation\n');
    writeFileSync(join(p, 'vendors/_evaluations/acme/claims.json'), '{}\n');
    const r = spawnSync('node', [HOOK], {
      cwd: dir,
      input: JSON.stringify({ prompt: '/arckit:pages', cwd: dir }),
      encoding: 'utf8',
      env: { ...process.env, CLAUDE_PLUGIN_ROOT: PLUGIN_ROOT },
      timeout: 60000,
    });
    assert.equal(r.status, 0, r.stderr);
    const manifest = JSON.parse(readFileSync(join(dir, 'docs/manifest.json'), 'utf8'));
    const vendors = manifest.projects[0].vendors;
    assert.deepEqual(vendors.map((v) => v.name), ['Acme'], '_evaluations is not a vendor');
    const paths = vendors[0].documents.map((d) => d.path);
    assert.ok(paths.some((path) => path.endsWith('/vendors/acme/proposal.md')), paths.join());
    assert.ok(paths.some((path) => path.endsWith('/vendors/_evaluations/acme/evaluation.md')), paths.join());
    assert.ok(!paths.some((path) => path.endsWith('claims.json')), 'only documents are listed');
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});
