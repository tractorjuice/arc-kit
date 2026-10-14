import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, writeFileSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const script = fileURLToPath(new URL('../../certification/worker/scripts/generate-key.mjs', import.meta.url));
const run = (out) => spawnSync(process.execPath, [script, out], { encoding: 'utf8' });

test('refuses to overwrite an existing key set and prints no private key', (t) => {
  const dir = mkdtempSync(join(tmpdir(), 'ak-'));
  t.after(() => rmSync(dir, { recursive: true, force: true }));
  const out = join(dir, 'jwks.json');
  writeFileSync(out, '{"keys":["existing"]}\n');
  const r = run(out);
  assert.notEqual(r.status, 0);
  assert.equal(r.stdout, '');
  assert.match(r.stderr, /already exists\. Write the new key set somewhere else and merge it by hand; see certification\/README\.md\./);
  assert.equal(readFileSync(out, 'utf8'), '{"keys":["existing"]}\n');
});

test('writes the public key set, then prints the private key', (t) => {
  const dir = mkdtempSync(join(tmpdir(), 'ak-'));
  t.after(() => rmSync(dir, { recursive: true, force: true }));
  const out = join(dir, 'jwks.json');
  const r = run(out);
  assert.equal(r.status, 0, r.stderr);
  const { keys } = JSON.parse(readFileSync(out, 'utf8'));
  assert.equal(keys.length, 1);
  assert.equal(keys[0].kty, 'RSA');
  assert.equal(keys[0].alg, 'RS256');
  for (const f of ['d', 'p', 'q', 'dp', 'dq', 'qi']) assert.equal(f in keys[0], false, f);
  const priv = JSON.parse(r.stdout);
  for (const f of ['d', 'p', 'q', 'dp', 'dq', 'qi']) assert.ok(priv[f], f);
  assert.equal(priv.kid, keys[0].kid);
  assert.equal(priv.n, keys[0].n);
  assert.equal(priv.e, keys[0].e);
});
