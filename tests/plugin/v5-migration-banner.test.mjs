import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

const HOOK = resolve('arckit-claude/hooks/v5-migration-banner.mjs');

function runBanner(cwd) {
  const result = spawnSync('node', [HOOK], {
    cwd,
    env: { ...process.env, CLAUDE_PROJECT_DIR: cwd },
    encoding: 'utf-8',
  });
  return { stdout: result.stdout, stderr: result.stderr, status: result.status };
}

test('no manifest → silent', () => {
  const cwd = mkdtempSync(join(tmpdir(), 'arckit-v5-'));
  const r = runBanner(cwd);
  assert.equal(r.stdout, '');
  assert.equal(r.status, 0);
});

test('manifest with UAE artefacts → suggests arckit-uae', () => {
  const cwd = mkdtempSync(join(tmpdir(), 'arckit-v5-'));
  mkdirSync(join(cwd, '.arckit'), { recursive: true });
  writeFileSync(
    join(cwd, '.arckit/manifest.json'),
    JSON.stringify({
      artefacts: [
        { command: 'arckit:uae-pdpl', path: 'projects/001-x/ARC-001-PDPL-v1.0.md' },
        { command: 'arckit:requirements', path: 'projects/001-x/ARC-001-REQ-v1.0.md' },
      ],
    }),
  );
  const r = runBanner(cwd);
  assert.match(r.stdout, /arckit-uae/);
  assert.doesNotMatch(r.stdout, /arckit-fr|arckit-ca|arckit-eu|arckit-at/);
});

test('ack marker present → silent', () => {
  const cwd = mkdtempSync(join(tmpdir(), 'arckit-v5-'));
  mkdirSync(join(cwd, '.arckit'), { recursive: true });
  writeFileSync(join(cwd, '.arckit/v5-migration-acked'), '');
  writeFileSync(
    join(cwd, '.arckit/manifest.json'),
    JSON.stringify({
      artefacts: [{ command: 'arckit:uae-pdpl', path: 'x' }],
    }),
  );
  const r = runBanner(cwd);
  assert.equal(r.stdout, '');
});

test('mixed jurisdictions → suggests both', () => {
  const cwd = mkdtempSync(join(tmpdir(), 'arckit-v5-'));
  mkdirSync(join(cwd, '.arckit'), { recursive: true });
  writeFileSync(
    join(cwd, '.arckit/manifest.json'),
    JSON.stringify({
      artefacts: [
        { command: 'arckit:uae-pdpl', path: 'x' },
        { command: 'arckit:fr-anssi', path: 'y' },
      ],
    }),
  );
  const r = runBanner(cwd);
  assert.match(r.stdout, /arckit-uae/);
  assert.match(r.stdout, /arckit-fr/);
});
