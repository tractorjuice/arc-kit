import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import worker from '../../certification/worker/src/index.mjs';
import { buildCredential, publicJwkFrom, signJws, toJwtPayload } from '../../certification/worker/src/credential.mjs';
import { importDrawKey, signDraw } from '../../certification/worker/src/drawsig.mjs';

const bank = JSON.parse(readFileSync(new URL('./fixtures/awareness.sample.json', import.meta.url), 'utf8'));
const byId = new Map(bank.questions.map((q) => [q.id, q]));
const STALE = 'The questions have changed or this attempt has expired. Reload the page and try again.';
const UNAVAILABLE = 'The quiz isn’t available right now. Try again later.';
const USED = 'This attempt has already been submitted. Reload the page for a fresh set of questions.';

function fakeKV(initial = {}) {
  const m = new Map(Object.entries(initial));
  const opts = new Map();
  return { get: async (k) => (m.has(k) ? m.get(k) : null), put: async (k, v, o) => { m.set(k, v); opts.set(k, o); }, map: m, opts };
}

// Stored credentials only, not the markers of submitted draws.
const creds = (env) => [...env.CREDENTIALS.map.keys()].filter((k) => k.startsWith('cred:')).length;
const drawMarkers = (env) => [...env.CREDENTIALS.map.keys()].filter((k) => k.startsWith('draw:'));

const RSA_GEN = { name: 'RSASSA-PKCS1-v1_5', modulusLength: 2048, publicExponent: new Uint8Array([1, 0, 1]), hash: 'SHA-256' };
const rsaKeys = new Map();
// One keypair per kid per file, shared across tests.
async function makeKey(kid = 'test-key') {
  if (!rsaKeys.has(kid)) {
    const kp = await crypto.subtle.generateKey(RSA_GEN, true, ['sign', 'verify']);
    rsaKeys.set(kid, await crypto.subtle.exportKey('jwk', kp.privateKey));
  }
  return { ...rsaKeys.get(kid), kid };
}

// A throwaway draw key for each environment, made in memory.
const freshDrawKey = (bytes = 32) => Buffer.from(crypto.getRandomValues(new Uint8Array(bytes))).toString('base64url');

async function makeEnv({ withBank = true, withDrawKey = true, kid = 'test-key' } = {}) {
  const jwk = await makeKey(kid);
  const env = {
    QUESTIONS: fakeKV(withBank ? { awareness: JSON.stringify(bank) } : {}),
    CREDENTIALS: fakeKV(),
    SIGNING_KEY: JSON.stringify(jwk),
    SITE_URL: 'https://arckit.org',
    ALLOWED_ORIGINS: 'https://arckit.org,http://localhost:4000',
  };
  if (withDrawKey) env.DRAW_HMAC_KEY = freshDrawKey();
  return env;
}

const call = (env, path, { method = 'GET', body, origin = 'https://arckit.org', raw, ip } = {}) =>
  worker.fetch(new Request(`https://cert.example${path}`, {
    method,
    headers: { 'Content-Type': 'application/json', Origin: origin, ...(ip ? { 'CF-Connecting-IP': ip } : {}) },
    body: raw ?? (body === undefined ? undefined : JSON.stringify(body)),
  }), env);

const getDraw = async (env) => (await call(env, '/awareness/questions')).json();
const keyFor = (draw) => draw.questions.map((q) => byId.get(q.id).answer);
const wrong = (a) => (a + 1) % 4;
const submit = (env, body, opts = {}) => call(env, '/awareness/submit', { method: 'POST', body, ...opts });
const attempt = (draw, name, answers) => ({ name, answers, bankVersion: draw.bankVersion, drawToken: draw.drawToken });

async function pass(env, name = 'Sam Ng', opts = {}) {
  const draw = await getDraw(env);
  return submit(env, attempt(draw, name, keyFor(draw)), opts);
}

// Every key anywhere in a JSON value, however deeply nested.
function allKeys(value, out = new Set()) {
  if (Array.isArray(value)) value.forEach((v) => allKeys(v, out));
  else if (value && typeof value === 'object') {
    for (const [k, v] of Object.entries(value)) { out.add(k); allKeys(v, out); }
  }
  return out;
}

// Stores a record whose JWS was signed by `signingKey`, as the Worker would have.
async function storeSigned(env, signingKey, { id = 'abcdefghjkmn', name = 'Sam Ng', signedName = name, issuedAt = '2026-10-14T09:30:00Z', credentialName } = {}) {
  const credential = buildCredential({ id, name: signedName, level: 'awareness', issuedAt, siteUrl: env.SITE_URL });
  if (credentialName) credential.name = credentialName;
  const jws = await signJws(toJwtPayload(credential), signingKey);
  env.CREDENTIALS.map.set(`cred:${id}`, JSON.stringify({ id, name, level: 'awareness', issuedAt, jws }));
  return id;
}

test('GET serves a v2 draw: 10 questions, 2 per domain, a draw token and no answers', async () => {
  const env = await makeEnv();
  const res = await call(env, '/awareness/questions');
  assert.equal(res.status, 200);
  assert.equal(res.headers.get('Access-Control-Allow-Origin'), 'https://arckit.org');
  assert.equal(res.headers.get('Cache-Control'), 'no-store');
  const text = await res.text();
  assert.doesNotMatch(text, /"answer"|"explanation"|Sample explanation/);
  const out = JSON.parse(text);
  assert.deepEqual(Object.keys(out), ['level', 'bankVersion', 'total', 'required', 'drawToken', 'questions']);
  assert.equal(out.level, 'awareness');
  assert.equal(out.bankVersion, 'sample-2');
  assert.equal(out.total, 10);
  assert.equal(out.required, 8);
  assert.match(out.drawToken, /^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/);
  assert.equal(out.questions.length, 10);
  const keys = allKeys(out);
  assert.equal(keys.has('answer'), false);
  assert.equal(keys.has('explanation'), false);
  const perDomain = {};
  for (const q of out.questions) {
    assert.deepEqual(Object.keys(q), ['id', 'domain', 'domainName', 'prompt', 'options']);
    assert.equal(q.domainName, bank.domains[q.domain]);
    perDomain[q.domain] = (perDomain[q.domain] || 0) + 1;
  }
  assert.deepEqual(perDomain, { basics: 2, people: 2, templates: 2, evidence: 2, traceability: 2 });
  // The token names exactly the questions served, in order.
  const signed = JSON.parse(Buffer.from(out.drawToken.split('.')[0], 'base64url').toString());
  assert.deepEqual(signed.ids, out.questions.map((q) => q.id));
  assert.equal(signed.bv, 'sample-2');
});

test('each GET is a fresh draw', async () => {
  const env = await makeEnv();
  const orders = new Set();
  for (let n = 0; n < 20; n++) orders.add((await getDraw(env)).questions.map((q) => q.id).join(','));
  assert.ok(orders.size > 15, `${orders.size} distinct draws in 20`);
});

test('no CORS header for other origins', async () => {
  const env = await makeEnv();
  const res = await call(env, '/awareness/questions', { origin: 'https://evil.example' });
  assert.equal(res.headers.get('Access-Control-Allow-Origin'), null);
});

test('503 when the bank is missing, before the draw is looked at', async () => {
  const env = await makeEnv({ withBank: false });
  const res = await call(env, '/awareness/questions');
  assert.equal(res.status, 503);
  assert.equal((await res.json()).error, UNAVAILABLE);
  const post = await submit(env, { name: 'Sam Ng', answers: [] });
  assert.equal(post.status, 503);
});

test('503, not a crash, when DRAW_HMAC_KEY is missing or too short; the key is never logged', async (t) => {
  const logged = t.mock.method(console, 'error', () => {});
  const env = await makeEnv({ withDrawKey: false });
  for (const res of [await call(env, '/awareness/questions'), await submit(env, { name: 'Sam Ng', answers: [], drawToken: 'x.y' })]) {
    assert.equal(res.status, 503);
    assert.equal((await res.json()).error, UNAVAILABLE);
  }
  const short = freshDrawKey(16);
  env.DRAW_HMAC_KEY = short;
  assert.equal((await call(env, '/awareness/questions')).status, 503);
  assert.ok(logged.mock.callCount() >= 1);
  for (const c of logged.mock.calls) assert.equal(c.arguments.map(String).join(' ').includes(short), false);
  assert.equal(creds(env), 0);
});

test('a bank still in the old v1 shape is treated as unavailable', async (t) => {
  t.mock.method(console, 'error', () => {});
  const env = await makeEnv();
  const { domains, drawPerDomain, ...v1 } = bank;
  env.QUESTIONS.map.set('awareness', JSON.stringify(v1));
  assert.equal((await call(env, '/awareness/questions')).status, 503);
});

test('a submission with no draw token gets 409 (pages from before v2 send none)', async () => {
  const env = await makeEnv();
  const answers = Array(10).fill(0);
  for (const body of [
    { name: 'Sam Ng', answers, bankVersion: 'sample-2' },
    { name: 'Sam Ng', answers, bankVersion: 'sample-2', drawToken: '' },
    { name: 'Sam Ng', answers, bankVersion: 'sample-2', drawToken: 42 },
  ]) {
    const res = await submit(env, body);
    assert.equal(res.status, 409);
    assert.deepEqual(await res.json(), { error: STALE });
  }
  assert.equal(creds(env), 0);
});

test('a forged ID list, or a draw signed with another key, gets 409', async () => {
  const env = await makeEnv();
  const draw = await getDraw(env);
  const [, sig] = draw.drawToken.split('.');
  // Ten questions the attacker knows the answers to, with the real signature.
  const easy = ['s01', 's02', 's07', 's08', 's13', 's14', 's19', 's20', 's25', 's26'];
  const body = Buffer.from(JSON.stringify({ ids: easy, bv: 'sample-2', iat: Math.floor(Date.now() / 1000) })).toString('base64url');
  const answers = easy.map((id) => byId.get(id).answer);
  const forged = await submit(env, { name: 'Sam Ng', answers, bankVersion: 'sample-2', drawToken: `${body}.${sig}` });
  assert.equal(forged.status, 409);
  assert.deepEqual(await forged.json(), { error: STALE });

  const otherKey = await importDrawKey(freshDrawKey());
  const alien = await signDraw(otherKey, { ids: easy, bv: 'sample-2' });
  const res = await submit(env, { name: 'Sam Ng', answers, bankVersion: 'sample-2', drawToken: alien });
  assert.equal(res.status, 409);
  assert.equal(creds(env), 0);
});

test('a signed draw naming questions the bank no longer holds gets 409', async () => {
  const env = await makeEnv();
  const hmacKey = await importDrawKey(env.DRAW_HMAC_KEY);
  const ghost = await signDraw(hmacKey, { ids: ['s01', 'gone'], bv: 'sample-2' });
  const res = await submit(env, { name: 'Sam Ng', answers: [byId.get('s01').answer, 0], bankVersion: 'sample-2', drawToken: ghost });
  assert.equal(res.status, 409);
});

test('a signed draw of the wrong shape (one ID, or all from one domain) gets 409', async () => {
  const env = await makeEnv();
  const hmacKey = await importDrawKey(env.DRAW_HMAC_KEY);
  const one = await signDraw(hmacKey, { ids: ['s01'], bv: 'sample-2' });
  const res = await submit(env, { name: 'Sam Ng', answers: [byId.get('s01').answer], bankVersion: 'sample-2', drawToken: one });
  assert.equal(res.status, 409);
  assert.equal((await res.json()).error, STALE);
  const basics = bank.questions.filter((q) => q.domain === 'basics').slice(0, 10).map((q) => q.id);
  const lopsided = await signDraw(hmacKey, { ids: basics, bv: 'sample-2' });
  const res2 = await submit(env, { name: 'Sam Ng', answers: basics.map((id) => byId.get(id).answer), bankVersion: 'sample-2', drawToken: lopsided });
  assert.equal(res2.status, 409);
  assert.equal(creds(env), 0);
});

test('a bank with a null question or a non-string bankVersion is 503, never 500', async (t) => {
  t.mock.method(console, 'error', () => {});
  for (const edit of [(b) => { b.questions[0] = null; }, (b) => { b.bankVersion = 7; }]) {
    const env = await makeEnv();
    const b = structuredClone(bank);
    edit(b);
    await env.QUESTIONS.put('awareness', JSON.stringify(b));
    assert.equal((await call(env, '/awareness/questions')).status, 503);
    assert.equal((await submit(env, { name: 'Sam Ng', answers: [], drawToken: 'x.y' })).status, 503);
  }
});

test('a draw older than an hour gets 409', async () => {
  const env = await makeEnv();
  const hmacKey = await importDrawKey(env.DRAW_HMAC_KEY);
  const ids = ['s01', 's02', 's07', 's08', 's13', 's14', 's19', 's20', 's25', 's26'];
  const answers = ids.map((id) => byId.get(id).answer);
  const old = await signDraw(hmacKey, { ids, bv: 'sample-2' }, Date.now() - (3600 + 5) * 1000);
  const res = await submit(env, { name: 'Sam Ng', answers, bankVersion: 'sample-2', drawToken: old });
  assert.equal(res.status, 409);
  assert.deepEqual(await res.json(), { error: STALE });
  // The same draw 50 minutes old is fine.
  const recent = await signDraw(hmacKey, { ids, bv: 'sample-2' }, Date.now() - 50 * 60 * 1000);
  const ok = await submit(env, { name: 'Sam Ng', answers, bankVersion: 'sample-2', drawToken: recent });
  assert.equal(ok.status, 200);
  assert.equal((await ok.json()).passed, true);
});

test('uploading a new bank version turns an open attempt into a 409', async () => {
  const env = await makeEnv();
  const draw = await getDraw(env);
  env.QUESTIONS.map.set('awareness', JSON.stringify({ ...bank, bankVersion: 'sample-3' }));
  const res = await submit(env, attempt(draw, 'Sam Ng', keyFor(draw)));
  assert.equal(res.status, 409);
  assert.deepEqual(await res.json(), { error: STALE });
});

test('checks run in the contract order: bank, then draw, then name, then answers', async () => {
  const env = await makeEnv();
  const draw = await getDraw(env);
  // A bad name with no draw token is a 409, not a 400.
  assert.equal((await submit(env, { name: '<b>', answers: keyFor(draw) })).status, 409);
  // A bad name and bad answers with a good draw: the name error comes first.
  const both = await submit(env, attempt(draw, '<b>', [1]));
  assert.equal(both.status, 400);
  assert.match((await both.json()).error, /name/i);
  // No bank beats a bad draw.
  env.QUESTIONS.map.delete('awareness');
  assert.equal((await submit(env, { name: 'Sam Ng', answers: keyFor(draw) })).status, 503);
});

test('a fail reports the areas to revisit, never the score, which questions or a review', async () => {
  const env = await makeEnv();
  const draw = await getDraw(env);
  const key = keyFor(draw);
  const answers = key.map((a, i) => (i < 3 ? wrong(a) : a));
  const res = await submit(env, attempt(draw, 'Mark Craddock', answers));
  assert.equal(res.status, 200);
  const missed = new Set(draw.questions.slice(0, 3).map((q) => q.domain));
  const areasToRevisit = Object.keys(bank.domains).filter((d) => missed.has(d)).map((d) => bank.domains[d]);
  assert.deepEqual(await res.json(), { passed: false, total: 10, required: 8, areasToRevisit });
  assert.equal(creds(env), 0);
});

test('a pass issues a credential and returns a review with explanations', async () => {
  const env = await makeEnv();
  const draw = await getDraw(env);
  const key = keyFor(draw);
  const answers = key.map((a, i) => (i < 2 ? wrong(a) : a)); // 8 of 10
  const res = await submit(env, attempt(draw, 'José María Blázquez', answers));
  const out = await res.json();
  assert.deepEqual(Object.keys(out), ['passed', 'score', 'total', 'required', 'credentialId', 'credentialUrl', 'linkedInUrl', 'review']);
  assert.equal(out.passed, true);
  assert.equal(out.score, 8);
  assert.match(out.credentialId, /^[a-z2-7]{12}$/);
  assert.equal(out.credentialUrl, `https://arckit.org/certification/credential.html?id=${out.credentialId}`);
  assert.match(out.linkedInUrl, /^https:\/\/www\.linkedin\.com\/profile\/add\?/);
  assert.equal(out.review.length, 10);
  out.review.forEach((r, i) => {
    const q = byId.get(draw.questions[i].id);
    assert.deepEqual(Object.keys(r), ['id', 'prompt', 'yourAnswer', 'correctAnswer', 'correct', 'explanation']);
    assert.equal(r.id, q.id);
    assert.equal(r.prompt, q.prompt);
    assert.equal(r.yourAnswer, q.options[answers[i]]);
    assert.equal(r.correctAnswer, q.options[q.answer]);
    assert.equal(r.correct, i >= 2);
    assert.equal(r.explanation, q.explanation);
    assert.ok(r.explanation.length > 0);
  });
  assert.equal(creds(env), 1);
  const got = await (await call(env, `/credentials/${out.credentialId}`)).json();
  assert.equal(got.valid, true);
  assert.equal(got.name, 'José María Blázquez');
  assert.equal(got.achievementName, 'ArcKit Awareness (ArcKit 6)');
  assert.equal(got.level, 'awareness');
});

test('two passes give two different credentials', async () => {
  const env = await makeEnv();
  const a = await (await pass(env)).json();
  const b = await (await pass(env)).json();
  assert.notEqual(a.credentialId, b.credentialId);
  assert.equal(creds(env), 2);
});

test('answers of the wrong length or out of range get 400 with a plain message, nothing stored', async () => {
  const env = await makeEnv();
  const draw = await getDraw(env);
  const key = keyFor(draw);
  for (const answers of [key.slice(1), [...key, 0], key.map((a, i) => (i === 4 ? 4 : a)), key.map((a, i) => (i === 4 ? '1' : a)), undefined, 'abc']) {
    const res = await submit(env, attempt(draw, 'Sam Ng', answers));
    assert.equal(res.status, 400, JSON.stringify(answers));
    assert.equal(typeof (await res.json()).error, 'string');
  }
  const badName = await submit(env, attempt(draw, '<script>x</script>', key));
  assert.equal(badName.status, 400);
  const notJson = await call(env, '/awareness/submit', { method: 'POST', raw: 'name=Sam' });
  assert.equal(notJson.status, 400);
  assert.equal(creds(env), 0);
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
  const ok = await (await pass(env)).json();
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
  env.PUBLIC_KEYS = JSON.stringify({ keys: [{ ...publicJwkFrom(oldKey), use: 'sig', alg: 'RS256' }] });
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
  assert.equal(creds(env), 0);
  assert.deepEqual(drawMarkers(env), []);

  env.SUBMIT_LIMITER = { limit: async () => ({ success: true }) };
  const ok = await pass(env);
  assert.equal(ok.status, 200);
  assert.equal((await ok.json()).passed, true);
  assert.equal(creds(env), 1);
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

test('a draw is marked once: resubmitting it gets 409, so a changed answer reveals nothing', async () => {
  const env = await makeEnv();
  const draw = await getDraw(env);
  const key = keyFor(draw);
  const first = await submit(env, attempt(draw, 'Mallory', key.map(wrong)));
  assert.equal(first.status, 200);
  assert.equal((await first.json()).passed, false);
  // The oracle: the same token, one answer changed each time.
  for (let i = 0; i < key.length; i++) {
    const probe = key.map((a, j) => (j === i ? a : wrong(a)));
    const res = await submit(env, attempt(draw, 'Mallory', probe));
    assert.equal(res.status, 409);
    const out = await res.json();
    assert.deepEqual(out, { error: USED });
    assert.equal('score' in out || 'areasToRevisit' in out || 'passed' in out, false);
  }
  // Even the full answer key on the used draw earns nothing.
  const res = await submit(env, attempt(draw, 'Mallory', key));
  assert.equal(res.status, 409);
  assert.equal(creds(env), 0);
  // A fresh draw is a fresh attempt.
  assert.equal((await (await pass(env)).json()).passed, true);
});

test('a passed draw cannot be replayed under other names to mint more credentials', async () => {
  const env = await makeEnv();
  const draw = await getDraw(env);
  const ok = await submit(env, attempt(draw, 'Alice Smith', keyFor(draw)));
  assert.equal((await ok.json()).passed, true);
  for (const name of ['Alice Smith', 'Bob Jones', 'Carol White']) {
    const res = await submit(env, attempt(draw, name, keyFor(draw)));
    assert.equal(res.status, 409);
    assert.deepEqual(await res.json(), { error: USED });
  }
  assert.equal(creds(env), 1);
});

test('a submission refused for its name or answers does not use up the draw', async () => {
  const env = await makeEnv();
  const draw = await getDraw(env);
  assert.equal((await submit(env, attempt(draw, '<b>', keyFor(draw)))).status, 400);
  assert.equal((await submit(env, attempt(draw, 'Sam Ng', [1]))).status, 400);
  assert.deepEqual(drawMarkers(env), []);
  const res = await submit(env, attempt(draw, 'Sam Ng', keyFor(draw)));
  assert.equal(res.status, 200);
  assert.equal((await res.json()).passed, true);
});

test('each draw carries its own nonce, and its marker expires once the draw would', async () => {
  const env = await makeEnv();
  const nonce = (d) => JSON.parse(Buffer.from(d.drawToken.split('.')[0], 'base64url').toString()).n;
  const a = await getDraw(env);
  const b = await getDraw(env);
  assert.match(nonce(a), /^[A-Za-z0-9_-]{22}$/);
  assert.notEqual(nonce(a), nonce(b));
  await submit(env, attempt(a, 'Sam Ng', keyFor(a)));
  assert.deepEqual(drawMarkers(env), [`draw:${nonce(a)}`]);
  const { expirationTtl } = env.CREDENTIALS.opts.get(`draw:${nonce(a)}`);
  assert.ok(expirationTtl >= 3600 && expirationTtl <= 3660, String(expirationTtl));
  // Another draw is unaffected.
  assert.equal((await (await submit(env, attempt(b, 'Sam Ng', keyFor(b)))).json()).passed, true);
});

test('a draw signed before nonces existed gets 409 and a reload', async () => {
  const env = await makeEnv();
  const hmacKey = await importDrawKey(env.DRAW_HMAC_KEY);
  const ids = ['s01', 's02', 's07', 's08', 's13', 's14', 's19', 's20', 's25', 's26'];
  const body = Buffer.from(JSON.stringify({ ids, bv: 'sample-2', iat: Math.floor(Date.now() / 1000) })).toString('base64url');
  const sig = Buffer.from(await crypto.subtle.sign('HMAC', hmacKey, new TextEncoder().encode(body))).toString('base64url');
  const res = await submit(env, { name: 'Sam Ng', answers: ids.map((id) => byId.get(id).answer), bankVersion: 'sample-2', drawToken: `${body}.${sig}` });
  assert.equal(res.status, 409);
  assert.deepEqual(await res.json(), { error: STALE });
});
