import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import worker from '../../certification/worker/src/index.mjs';

const bank = JSON.parse(readFileSync(new URL('./fixtures/awareness.sample.json', import.meta.url), 'utf8'));
const key = bank.questions.map((q) => q.answer);

function fakeKV(initial = {}) {
  const m = new Map(Object.entries(initial));
  return { get: async (k) => (m.has(k) ? m.get(k) : null), put: async (k, v) => { m.set(k, v); }, map: m };
}

async function makeEnv({ withBank = true } = {}) {
  const kp = await crypto.subtle.generateKey({ name: 'Ed25519' }, true, ['sign', 'verify']);
  const jwk = { ...(await crypto.subtle.exportKey('jwk', kp.privateKey)), kid: 'test-key' };
  return {
    QUESTIONS: fakeKV(withBank ? { awareness: JSON.stringify(bank) } : {}),
    CREDENTIALS: fakeKV(),
    SIGNING_KEY: JSON.stringify(jwk),
    SITE_URL: 'https://arckit.org',
    ALLOWED_ORIGINS: 'https://arckit.org,http://localhost:4000',
  };
}

const call = (env, path, { method = 'GET', body, origin = 'https://arckit.org', raw } = {}) =>
  worker.fetch(new Request(`https://cert.example${path}`, {
    method,
    headers: { 'Content-Type': 'application/json', Origin: origin },
    body: raw ?? (body === undefined ? undefined : JSON.stringify(body)),
  }), env);

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
