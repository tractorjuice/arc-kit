import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync, statSync } from 'node:fs';
import { ISSUER_ID, ACHIEVEMENTS } from '../../certification/worker/src/credential.mjs';

const docs = (p) => new URL(`../../docs/certification/${p}`, import.meta.url);

test('issuer profile matches the credential issuer id', () => {
  const issuer = JSON.parse(readFileSync(docs('issuer.json'), 'utf8'));
  assert.equal(issuer.id, ISSUER_ID);
  assert.deepEqual(issuer.type, ['Profile']);
  assert.equal(issuer.name, 'ArcKit');
  assert.equal(issuer.url, 'https://arckit.org');
});

test('awareness achievement file matches the signed achievement', () => {
  const a = JSON.parse(readFileSync(docs('achievements/awareness.json'), 'utf8'));
  assert.equal(a.id, ACHIEVEMENTS.awareness.id);
  assert.equal(a.name, ACHIEVEMENTS.awareness.name);
  assert.equal(a.criteria.narrative, ACHIEVEMENTS.awareness.criteria.narrative);
  assert.equal(a.image.id, ACHIEVEMENTS.awareness.image.id);
});

test('badge SVG exists, is small and has a viewBox', () => {
  const p = docs('badges/awareness.svg');
  assert.ok(existsSync(p));
  const svg = readFileSync(p, 'utf8');
  assert.match(svg, /^<svg[^>]*viewBox="0 0 600 600"/);
  assert.match(svg, /AWARENESS/);
  assert.ok(statSync(p).size < 30_000);
});

test('published key set, when present, holds public keys only', () => {
  const p = docs('jwks.json');
  if (!existsSync(p)) return; // written in Task 10
  const { keys } = JSON.parse(readFileSync(p, 'utf8'));
  assert.ok(keys.length >= 1);
  for (const k of keys) {
    assert.equal(k.kty, 'OKP');
    assert.equal(k.crv, 'Ed25519');
    assert.equal('d' in k, false);
    assert.ok(k.kid && k.x);
  }
});
