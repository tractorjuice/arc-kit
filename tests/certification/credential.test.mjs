import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  ISSUER_ID, ACHIEVEMENTS, buildCredential, credentialPageUrl,
  publicJwkFrom, signJws, verifyJws,
} from '../../certification/worker/src/credential.mjs';

async function testKey(kid = 'test-key') {
  const kp = await crypto.subtle.generateKey({ name: 'Ed25519' }, true, ['sign', 'verify']);
  return { ...(await crypto.subtle.exportKey('jwk', kp.privateKey)), kid };
}

const base = { id: 'abcdefghjkmn', name: 'Armağan Tekin', level: 'awareness', issuedAt: '2026-10-26T10:00:00.000Z', siteUrl: 'https://arckit.org' };

test('builds an Open Badges 3.0 credential', () => {
  const c = buildCredential(base);
  assert.deepEqual(c['@context'], ['https://www.w3.org/ns/credentials/v2', 'https://purl.imsglobal.org/spec/ob/v3p0/context-3.0.3.json']);
  assert.deepEqual(c.type, ['VerifiableCredential', 'OpenBadgeCredential']);
  assert.equal(c.id, 'https://arckit.org/certification/credential.html?id=abcdefghjkmn');
  assert.equal(c.issuer.id, ISSUER_ID);
  assert.equal(c.validFrom, base.issuedAt);
  assert.equal(c.credentialSubject.name, 'Armağan Tekin');
  assert.equal(c.credentialSubject.achievement.id, ACHIEVEMENTS.awareness.id);
  assert.equal(c.name, 'ArcKit Awareness (ArcKit 6)');
  assert.equal('validUntil' in c, false); // Awareness does not expire
});

test('rejects unknown levels', () => {
  assert.throws(() => buildCredential({ ...base, level: 'wizard' }), /Unknown level/);
});

test('sign then verify round-trips, including non-ASCII names', async () => {
  const key = await testKey();
  const jws = await signJws(buildCredential(base), key);
  assert.equal(jws.split('.').length, 3);
  const header = JSON.parse(Buffer.from(jws.split('.')[0], 'base64url').toString('utf8'));
  assert.deepEqual(header, { alg: 'EdDSA', typ: 'vc+jwt', kid: 'test-key' });
  const out = await verifyJws(jws, publicJwkFrom(key));
  assert.equal(out.valid, true);
  assert.equal(out.payload.credentialSubject.name, 'Armağan Tekin');
});

test('public JWK never carries the private part', async () => {
  const pub = publicJwkFrom(await testKey('k1'));
  assert.deepEqual(Object.keys(pub).sort(), ['crv', 'kid', 'kty', 'x']);
});

test('tampered, malformed or wrong-key tokens are invalid', async () => {
  const key = await testKey();
  const other = await testKey('other');
  const jws = await signJws(buildCredential(base), key);
  const [h, p, s] = jws.split('.');
  const forged = Buffer.from(JSON.stringify({ ...buildCredential(base), credentialSubject: { ...buildCredential(base).credentialSubject, name: 'Someone Else' } })).toString('base64url');
  assert.equal((await verifyJws(`${h}.${forged}.${s}`, publicJwkFrom(key))).valid, false);
  assert.equal((await verifyJws(jws, publicJwkFrom(other))).valid, false);
  for (const bad of ['', 'a.b', 'a.b.c.d', `${h}.${p}.`, 'not-a-token']) {
    assert.equal((await verifyJws(bad, publicJwkFrom(key))).valid, false, bad);
  }
  const noneHeader = Buffer.from(JSON.stringify({ alg: 'none' })).toString('base64url');
  assert.equal((await verifyJws(`${noneHeader}.${p}.${s}`, publicJwkFrom(key))).valid, false);
});

test('credential page URL encodes the id', () => {
  assert.equal(credentialPageUrl('https://arckit.org', 'abcdefghjkmn'), 'https://arckit.org/certification/credential.html?id=abcdefghjkmn');
});
