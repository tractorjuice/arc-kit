import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import worker from '../../certification/worker/src/index.mjs';
import { buildCredential, publicJwkFrom, signJws, toJwtPayload } from '../../certification/worker/src/credential.mjs';

const bank = JSON.parse(readFileSync(new URL('./fixtures/awareness.sample.json', import.meta.url), 'utf8'));
const key = bank.questions.map((q) => q.answer);

function fakeKV(initial = {}) {
  const m = new Map(Object.entries(initial));
  return { get: async (k) => (m.has(k) ? m.get(k) : null), put: async (k, v) => { m.set(k, v); }, map: m };
}

async function makeKey(kid = 'test-key') {
  const kp = await crypto.subtle.generateKey({ name: 'Ed25519' }, true, ['sign', 'verify']);
  return { ...(await crypto.subtle.exportKey('jwk', kp.privateKey)), kid };
}

async function makeEnv({ withBank = true, kid = 'test-key' } = {}) {
  const jwk = await makeKey(kid);
  return {
    QUESTIONS: fakeKV(withBank ? { awareness: JSON.stringify(bank) } : {}),
    CREDENTIALS: fakeKV(),
    SIGNING_KEY: JSON.stringify(jwk),
    SITE_URL: 'https://arckit.org',
    ALLOWED_ORIGINS: 'https://arckit.org,http://localhost:4000',
  };
}

const call = (env, path, { method = 'GET', body, origin = 'https://arckit.org', raw, ip } = {}) =>
  worker.fetch(new Request(`https://cert.example${path}`, {
    method,
    headers: { 'Content-Type': 'application/json', Origin: origin, ...(ip ? { 'CF-Connecting-IP': ip } : {}) },
    body: raw ?? (body === undefined ? undefined : JSON.stringify(body)),
  }), env);

const pass = (env, name = 'Sam Ng', opts = {}) =>
  call(env, '/awareness/submit', { method: 'POST', body: { name, answers: key, bankVersion: 'sample-1' }, ...opts });

// Stores a record whose JWS was signed by `signingKey`, as the Worker would have.
async function storeSigned(env, signingKey, { id = 'abcdefghjkmn', name = 'Sam Ng', signedName = name, issuedAt = '2026-10-14T09:30:00Z', credentialName } = {}) {
  const credential = buildCredential({ id, name: signedName, level: 'awareness', issuedAt, siteUrl: env.SITE_URL });
  if (credentialName) credential.name = credentialName;
  const jws = await signJws(toJwtPayload(credential), signingKey);
  env.CREDENTIALS.map.set(`cred:${id}`, JSON.stringify({ id, name, level: 'awareness', issuedAt, jws }));
  return id;
}

test('serves questions without answers, with CORS for arckit.org', async () => {
  const env = await makeEnv();
  const res = await call(env, '/awareness/questions');
  assert.equal(res.status, 200);
  assert.equal(res.headers.get('Access-Control-Allow-Origin'), 'https://arckit.org');
  const text = await res.text();
  assert.equal(text.includes('"answer"'), false);
  assert.equal(JSON.parse(text).questions.length, 10);
});

test('no CORS header for other origins', async () => {
  const env = await makeEnv();
  const res = await call(env, '/awareness/questions', { origin: 'https://evil.example' });
  assert.equal(res.headers.get('Access-Control-Allow-Origin'), null);
});

test('503 when the bank is missing', async () => {
  const env = await makeEnv({ withBank: false });
  const res = await call(env, '/awareness/questions');
  assert.equal(res.status, 503);
});

test('a fail stores nothing and reports the score', async () => {
  const env = await makeEnv();
  const answers = key.map((a, i) => (i < 3 ? (a + 1) % 4 : a));
  const res = await call(env, '/awareness/submit', { method: 'POST', body: { name: 'Mark Craddock', answers, bankVersion: 'sample-1' } });
  assert.equal(res.status, 200);
  assert.deepEqual(await res.json(), { passed: false, score: 7, total: 10, required: 8 });
  assert.equal(env.CREDENTIALS.map.size, 0);
});

test('a pass issues, stores and serves a valid credential', async () => {
  const env = await makeEnv();
  const res = await call(env, '/awareness/submit', { method: 'POST', body: { name: 'José María Blázquez', answers: key, bankVersion: 'sample-1' } });
  const out = await res.json();
  assert.equal(out.passed, true);
  assert.match(out.credentialId, /^[a-z2-7]{12}$/);
  assert.equal(out.credentialUrl, `https://arckit.org/certification/credential.html?id=${out.credentialId}`);
  assert.match(out.linkedInUrl, /^https:\/\/www\.linkedin\.com\/profile\/add\?/);
  assert.equal(env.CREDENTIALS.map.size, 1);
  const got = await (await call(env, `/credentials/${out.credentialId}`)).json();
  assert.equal(got.valid, true);
  assert.equal(got.name, 'José María Blázquez');
  assert.equal(got.achievementName, 'ArcKit Awareness (ArcKit 6)');
  assert.equal(got.level, 'awareness');
});

test('two passes give two different credentials', async () => {
  const env = await makeEnv();
  const a = await (await call(env, '/awareness/submit', { method: 'POST', body: { name: 'Sam Ng', answers: key, bankVersion: 'sample-1' } })).json();
  const b = await (await call(env, '/awareness/submit', { method: 'POST', body: { name: 'Sam Ng', answers: key, bankVersion: 'sample-1' } })).json();
  assert.notEqual(a.credentialId, b.credentialId);
  assert.equal(env.CREDENTIALS.map.size, 2);
});

test('stale bank version gets 409 with a reload message', async () => {
  const env = await makeEnv();
  const res = await call(env, '/awareness/submit', { method: 'POST', body: { name: 'Sam Ng', answers: key, bankVersion: 'old' } });
  assert.equal(res.status, 409);
  assert.match((await res.json()).error, /reload/i);
});

test('bad input gets 400 with a plain message, nothing stored', async () => {
  const env = await makeEnv();
  for (const body of [
    { name: '<script>x</script>', answers: key, bankVersion: 'sample-1' },
    { name: 'Sam Ng', answers: key.slice(1), bankVersion: 'sample-1' },
    { name: 'Sam Ng', bankVersion: 'sample-1' },
  ]) {
    const res = await call(env, '/awareness/submit', { method: 'POST', body });
    assert.equal(res.status, 400, JSON.stringify(body));
    assert.equal(typeof (await res.json()).error, 'string');
  }
  const notJson = await call(env, '/awareness/submit', { method: 'POST', raw: 'name=Sam' });
  assert.equal(notJson.status, 400);
  assert.equal(env.CREDENTIALS.map.size, 0);
});

test('oversized body gets 413', async () => {
  const env = await makeEnv();
  const res = await call(env, '/awareness/submit', { method: 'POST', raw: JSON.stringify({ name: 'x'.repeat(20000) }) });
  assert.equal(res.status, 413);
});

test('unknown, malformed and tampered credential ids are never valid', async () => {
  const env = await makeEnv();
  assert.equal((await call(env, '/credentials/aaaaaaaaaaaa')).status, 404);
  assert.equal((await call(env, '/credentials/../../etc')).status, 404);
  assert.equal((await call(env, '/credentials/ABCDEFGHJKMN')).status, 404);
  const ok = await (await call(env, '/awareness/submit', { method: 'POST', body: { name: 'Sam Ng', answers: key, bankVersion: 'sample-1' } })).json();
  const rec = JSON.parse(env.CREDENTIALS.map.get(`cred:${ok.credentialId}`));
  const [h, , s] = rec.jws.split('.');
  rec.jws = `${h}.${Buffer.from('{"forged":true}').toString('base64url')}.${s}`;
  env.CREDENTIALS.map.set(`cred:${ok.credentialId}`, JSON.stringify(rec));
  assert.equal((await (await call(env, `/credentials/${ok.credentialId}`)).json()).valid, false);
});

test('OPTIONS preflight is answered', async () => {
  const env = await makeEnv();
  const res = await call(env, '/awareness/submit', { method: 'OPTIONS' });
  assert.equal(res.status, 204);
  assert.match(res.headers.get('Access-Control-Allow-Methods'), /POST/);
});

test('issuedAt is whole seconds, and the display fields come from the signed payload', async () => {
  const env = await makeEnv();
  const out = await (await pass(env)).json();
  const rec = JSON.parse(env.CREDENTIALS.map.get(`cred:${out.credentialId}`));
  assert.match(rec.issuedAt, /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/);
  const got = await (await call(env, `/credentials/${out.credentialId}`)).json();
  assert.equal(got.issuedAt, rec.issuedAt);
  assert.match(got.issuedAt, /:\d{2}Z$/);

  // A record whose signed payload says something the stored record doesn't: the payload wins.
  const signingKey = JSON.parse(env.SIGNING_KEY);
  const id = await storeSigned(env, signingKey, { credentialName: 'ArcKit Awareness (ArcKit 7)', issuedAt: '2026-11-02T08:00:00Z' });
  const rec2 = JSON.parse(env.CREDENTIALS.map.get(`cred:${id}`));
  rec2.issuedAt = '1999-01-01T00:00:00Z';
  env.CREDENTIALS.map.set(`cred:${id}`, JSON.stringify(rec2));
  const got2 = await (await call(env, `/credentials/${id}`)).json();
  assert.equal(got2.valid, true);
  assert.equal(got2.achievementName, 'ArcKit Awareness (ArcKit 7)');
  assert.equal(got2.issuedAt, '2026-11-02T08:00:00Z');
  assert.match(got2.linkedInUrl, /name=ArcKit%20Awareness%20\(ArcKit%207\)&/);
});

test('a valid signature over a different name is not a valid credential', async () => {
  const env = await makeEnv();
  const id = await storeSigned(env, JSON.parse(env.SIGNING_KEY), { name: 'Sam Ng', signedName: 'Someone Else', issuedAt: '2026-10-14T09:30:00Z' });
  const got = await (await call(env, `/credentials/${id}`)).json();
  assert.equal(got.valid, false);
  assert.equal(got.name, 'Sam Ng');
  assert.equal(got.achievementName, 'ArcKit Awareness'); // falls back to the stored level, not the payload
  assert.equal(got.issuedAt, '2026-10-14T09:30:00Z');
});

test('after a key rotation, credentials signed with the old key verify through PUBLIC_KEYS', async () => {
  const env = await makeEnv();
  const oldKey = await makeKey('old-key');
  const newKey = await makeKey('new-key');
  const id = await storeSigned(env, oldKey);
  env.SIGNING_KEY = JSON.stringify(newKey);
  env.PUBLIC_KEYS = JSON.stringify({ keys: [{ ...publicJwkFrom(oldKey), use: 'sig', alg: 'EdDSA' }] });
  assert.equal((await (await call(env, `/credentials/${id}`)).json()).valid, true);
  // The new key signs new credentials, which verify too.
  const fresh = await (await pass(env)).json();
  assert.equal((await (await call(env, `/credentials/${fresh.credentialId}`)).json()).valid, true);
  delete env.PUBLIC_KEYS;
  assert.equal((await (await call(env, `/credentials/${id}`)).json()).valid, false);
});

test('the submission rate limit answers 429 and stores nothing', async () => {
  const env = await makeEnv();
  const seen = [];
  env.SUBMIT_LIMITER = { limit: async ({ key: k }) => { seen.push(k); return { success: false }; } };
  const res = await pass(env, 'Sam Ng', { ip: '203.0.113.7' });
  assert.equal(res.status, 429);
  assert.equal(typeof (await res.json()).error, 'string');
  assert.deepEqual(seen, ['203.0.113.7']);
  assert.equal(env.CREDENTIALS.map.size, 0);

  env.SUBMIT_LIMITER = { limit: async () => ({ success: true }) };
  const ok = await pass(env);
  assert.equal(ok.status, 200);
  assert.equal((await ok.json()).passed, true);
  assert.equal(env.CREDENTIALS.map.size, 1);
});

test('a server error is logged without the key or the name', async (t) => {
  const env = await makeEnv();
  env.SIGNING_KEY = 'notjson-SECRET-KEY-MATERIAL';
  const logged = t.mock.method(console, 'error', () => {});
  const res = await pass(env, 'Unique Person Name');
  assert.equal(res.status, 500);
  assert.equal(logged.mock.callCount(), 1);
  const line = logged.mock.calls[0].arguments.map(String).join(' ');
  assert.doesNotMatch(line, /notjson|SECRET|Unique Person Name/); // V8 quotes the start of bad JSON in its message
});
