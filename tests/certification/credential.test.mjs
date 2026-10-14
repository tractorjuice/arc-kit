import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  ISSUER_ID, ACHIEVEMENTS, buildCredential, credentialPageUrl,
  publicJwkFrom, signJws, verifyJws, toJwtPayload, wholeSecondIso, keyUri,
} from '../../certification/worker/src/credential.mjs';

async function testKey(kid = 'test-key') {
  const kp = await crypto.subtle.generateKey({ name: 'Ed25519' }, true, ['sign', 'verify']);
  return { ...(await crypto.subtle.exportKey('jwk', kp.privateKey)), kid };
}

const base = { id: 'abcdefghjkmn', name: 'Armağan Tekin', level: 'awareness', issuedAt: '2026-10-26T10:00:00Z', siteUrl: 'https://arckit.org' };

const part = (jws, i) => JSON.parse(Buffer.from(jws.split('.')[i], 'base64url').toString('utf8'));
const b64 = (obj) => Buffer.from(JSON.stringify(obj)).toString('base64url');

// Signs an arbitrary header and payload with a private JWK, to build tokens signJws never would.
async function signRaw(header, payload, jwk) {
  const { kty, crv, x, d } = jwk;
  const key = await crypto.subtle.importKey('jwk', { kty, crv, x, d }, { name: 'Ed25519' }, false, ['sign']);
  const input = `${b64(header)}.${b64(payload)}`;
  const sig = Buffer.from(await crypto.subtle.sign({ name: 'Ed25519' }, key, new TextEncoder().encode(input))).toString('base64url');
  return `${input}.${sig}`;
}

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
  assert.match(c.credentialSubject.id, /^urn:uuid:[0-9a-f-]{36}$/);
  assert.deepEqual(c.credentialSubject.identifier, [
    { type: 'IdentityObject', identityType: 'name', hashed: false, identityHash: 'Armağan Tekin' },
  ]);
  assert.notEqual(buildCredential(base).credentialSubject.id, c.credentialSubject.id);
  assert.equal(buildCredential({ ...base, subjectId: 'urn:uuid:00000000-0000-4000-8000-000000000000' }).credentialSubject.id,
    'urn:uuid:00000000-0000-4000-8000-000000000000');
});

test('JWT payload carries iss, jti, nbf and sub (OB 3.0 §8.2.4.1)', () => {
  const c = buildCredential(base);
  const p = toJwtPayload(c);
  assert.equal(p.iss, c.issuer.id);
  assert.equal(p.jti, c.id);
  assert.equal(p.sub, c.credentialSubject.id);
  assert.equal(p.nbf * 1000, Date.parse(c.validFrom));
  assert.equal('exp' in p, false);
  assert.deepEqual(p.credentialSubject, c.credentialSubject);
});

test('wholeSecondIso drops fractional seconds', () => {
  assert.equal(wholeSecondIso(new Date('2026-10-14T09:30:00.789Z')), '2026-10-14T09:30:00Z');
  assert.match(wholeSecondIso(), /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/);
});

test('rejects unknown levels', () => {
  assert.throws(() => buildCredential({ ...base, level: 'wizard' }), /Unknown level/);
});

test('sign then verify round-trips, including non-ASCII names', async () => {
  const key = await testKey();
  const jws = await signJws(toJwtPayload(buildCredential(base)), key);
  assert.equal(jws.split('.').length, 3);
  const header = part(jws, 0);
  assert.deepEqual(header, { alg: 'EdDSA', kid: 'https://arckit.org/certification/jwks.json#test-key', typ: 'JWT' });
  assert.deepEqual(Object.keys(header), ['alg', 'kid', 'typ']);
  assert.equal(header.kid, keyUri('test-key'));
  const out = await verifyJws(jws, [publicJwkFrom(key)]);
  assert.equal(out.valid, true);
  assert.equal(out.payload.credentialSubject.name, 'Armağan Tekin');
});

test('a credential signed with a retired key still verifies when that key is listed', async () => {
  const oldKey = await testKey('old-key');
  const newKey = await testKey('new-key');
  const jws = await signJws(toJwtPayload(buildCredential(base)), oldKey);
  assert.equal((await verifyJws(jws, [publicJwkFrom(newKey), publicJwkFrom(oldKey)])).valid, true);
  assert.equal((await verifyJws(jws, [publicJwkFrom(newKey)])).valid, false); // unknown kid
});

test('header and claims must be exactly as OB 3.0 requires', async () => {
  const key = await testKey();
  const payload = toJwtPayload(buildCredential(base));
  const kid = keyUri('test-key');
  const keys = [publicJwkFrom(key)];
  // The helper itself produces a valid token, so each rejection below is down to the one change.
  assert.equal((await verifyJws(await signRaw({ alg: 'EdDSA', kid, typ: 'JWT' }, payload, key), keys)).valid, true);
  assert.equal((await verifyJws(await signRaw({ alg: 'EdDSA', kid }, payload, key), keys)).valid, true); // typ is optional
  assert.equal((await verifyJws(await signRaw({ alg: 'EdDSA', kid, typ: 'vc+jwt' }, payload, key), keys)).valid, false);
  assert.equal((await verifyJws(await signRaw({ alg: 'EdDSA', kid, typ: 'JWT', jwk: publicJwkFrom(key) }, payload, key), keys)).valid, false);
  assert.equal((await verifyJws(await signRaw({ alg: 'EdDSA', kid: 'test-key', typ: 'JWT' }, payload, key), keys)).valid, false); // bare kid
  assert.equal((await verifyJws(await signRaw({ alg: 'EdDSA', kid: keyUri('nobody'), typ: 'JWT' }, payload, key), keys)).valid, false);
  const header = { alg: 'EdDSA', kid, typ: 'JWT' };
  assert.equal((await verifyJws(await signRaw(header, { ...payload, iss: 'https://evil.example/issuer.json' }, key), keys)).valid, false);
  assert.equal((await verifyJws(await signRaw(header, { ...payload, jti: 'https://arckit.org/other' }, key), keys)).valid, false);
  assert.equal((await verifyJws(await signRaw(header, { ...payload, sub: 'urn:uuid:other' }, key), keys)).valid, false);
  const { jti, sub, ...noClaims } = payload;
  assert.equal((await verifyJws(await signRaw(header, noClaims, key), keys)).valid, false);
  assert.equal((await verifyJws(await signRaw(header, buildCredential(base), key), keys)).valid, false); // the bare credential
  assert.equal((await verifyJws(await signRaw(header, { iss: ISSUER_ID, credentialSubject: { name: 'X' } }, key), keys)).valid, false); // jti and sub required
});

test('public JWK never carries the private part', async () => {
  const pub = publicJwkFrom(await testKey('k1'));
  assert.deepEqual(Object.keys(pub).sort(), ['crv', 'kid', 'kty', 'x']);
});

test('tampered, malformed or wrong-key tokens are invalid', async () => {
  const key = await testKey();
  const other = await testKey('other');
  const sameKidWrongKey = await testKey('test-key');
  const payload = toJwtPayload(buildCredential(base));
  const jws = await signJws(payload, key);
  const [h, p, s] = jws.split('.');
  const forged = b64({ ...payload, credentialSubject: { ...payload.credentialSubject, name: 'Someone Else' } });
  assert.equal((await verifyJws(`${h}.${forged}.${s}`, [publicJwkFrom(key)])).valid, false);
  assert.equal((await verifyJws(jws, [publicJwkFrom(other)])).valid, false);
  assert.equal((await verifyJws(jws, [publicJwkFrom(sameKidWrongKey)])).valid, false);
  assert.equal((await verifyJws(jws, [])).valid, false);
  for (const bad of ['', 'a.b', 'a.b.c.d', `${h}.${p}.`, 'not-a-token']) {
    assert.equal((await verifyJws(bad, [publicJwkFrom(key)])).valid, false, bad);
  }
  const noneHeader = b64({ alg: 'none', kid: keyUri('test-key') });
  assert.equal((await verifyJws(`${noneHeader}.${p}.${s}`, [publicJwkFrom(key)])).valid, false);
});

test('credential page URL encodes the id', () => {
  assert.equal(credentialPageUrl('https://arckit.org', 'abcdefghjkmn'), 'https://arckit.org/certification/credential.html?id=abcdefghjkmn');
});
