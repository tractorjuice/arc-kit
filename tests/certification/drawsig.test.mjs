import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  DRAW_TTL_SECONDS, importDrawKey, signDraw, verifyDraw,
} from '../../certification/worker/src/drawsig.mjs';

// Throwaway HMAC keys, made in memory for each run.
const freshKeyText = (bytes = 32) => Buffer.from(crypto.getRandomValues(new Uint8Array(bytes))).toString('base64url');
const ids = ['s25', 's01', 's07', 's13', 's19', 's02', 's08', 's14', 's20', 's26'];
const bv = 'sample-2';
const T0 = Date.UTC(2026, 9, 14, 9, 30, 0);

async function setup() {
  const hmacKey = await importDrawKey(freshKeyText());
  const tok = await signDraw(hmacKey, { ids, bv }, T0);
  return { hmacKey, tok };
}

const b64json = (obj) => Buffer.from(JSON.stringify(obj)).toString('base64url');

test('a signed draw verifies and gives back its IDs, version and time', async () => {
  const { hmacKey, tok } = await setup();
  assert.match(tok, /^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]{43}$/);
  const [body] = tok.split('.');
  const payload = JSON.parse(Buffer.from(body, 'base64url').toString());
  assert.deepEqual(Object.keys(payload), ['ids', 'bv', 'iat', 'n']);
  assert.deepEqual({ ...payload, n: undefined }, { ids, bv, iat: T0 / 1000, n: undefined });
  assert.match(payload.n, /^[A-Za-z0-9_-]{22}$/);
  assert.deepEqual(await verifyDraw(hmacKey, tok, { bv, now: T0 + 1000 }), { ok: true, ids, bv, iat: T0 / 1000, n: payload.n });
});

test('every signing gets a fresh nonce, even for the same questions at the same time', async () => {
  const { hmacKey, tok } = await setup();
  const again = await signDraw(hmacKey, { ids, bv }, T0);
  assert.notEqual(again, tok);
  const nonces = await Promise.all([tok, again].map(async (t) => (await verifyDraw(hmacKey, t, { bv, now: T0 })).n));
  assert.notEqual(nonces[0], nonces[1]);
});

test('changing the ID list breaks the signature', async () => {
  const { hmacKey, tok } = await setup();
  const [, sig] = tok.split('.');
  const forged = `${b64json({ ids: ['s01', 's02', 's03', 's04', 's05', 's06', 's07', 's08', 's09', 's10'], bv, iat: T0 / 1000 })}.${sig}`;
  assert.deepEqual(await verifyDraw(hmacKey, forged, { bv, now: T0 }), { ok: false, reason: 'signature' });
  // A later iat, to dodge expiry, is a change too.
  const later = `${b64json({ ids, bv, iat: T0 / 1000 + 3600 })}.${sig}`;
  assert.equal((await verifyDraw(hmacKey, later, { bv, now: T0 + 3600_000 })).reason, 'signature');
});

test('changing the signature breaks it', async () => {
  const { hmacKey, tok } = await setup();
  const [body, sig] = tok.split('.');
  // Flip the first character: the last one carries unused bits, so it is a weaker test.
  const flipped = (sig[0] === 'A' ? 'B' : 'A') + sig.slice(1);
  assert.deepEqual(await verifyDraw(hmacKey, `${body}.${flipped}`, { bv, now: T0 }), { ok: false, reason: 'signature' });
  // Flipping an unused low bit of the last character spells the same bytes
  // another way. That is refused as malformed, so each draw has one spelling.
  const ALPHA = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
  const sibling = ALPHA[ALPHA.indexOf(sig.at(-1)) ^ 1];
  const respelt = `${sig.slice(0, -1)}${sibling}`;
  assert.deepEqual(Buffer.from(respelt, 'base64url'), Buffer.from(sig, 'base64url'));
  assert.deepEqual(await verifyDraw(hmacKey, `${body}.${respelt}`, { bv, now: T0 }), { ok: false, reason: 'malformed' });
});

test('a draw signed with another key does not verify', async () => {
  const { tok } = await setup();
  const otherKey = await importDrawKey(freshKeyText());
  assert.deepEqual(await verifyDraw(otherKey, tok, { bv, now: T0 }), { ok: false, reason: 'signature' });
});

test('a draw lasts an hour', async () => {
  const { hmacKey, tok } = await setup();
  assert.equal(DRAW_TTL_SECONDS, 3600);
  assert.equal((await verifyDraw(hmacKey, tok, { bv, now: T0 + DRAW_TTL_SECONDS * 1000 })).ok, true);
  assert.deepEqual(await verifyDraw(hmacKey, tok, { bv, now: T0 + (DRAW_TTL_SECONDS + 1) * 1000 }), { ok: false, reason: 'expired' });
  // Up to a minute of clock skew is tolerated; more than that is refused.
  assert.equal((await verifyDraw(hmacKey, tok, { bv, now: T0 - 60_000 })).ok, true);
  assert.deepEqual(await verifyDraw(hmacKey, tok, { bv, now: T0 - 61_000 }), { ok: false, reason: 'future' });
});

test('a draw for another bank version is refused', async () => {
  const { hmacKey, tok } = await setup();
  assert.deepEqual(await verifyDraw(hmacKey, tok, { bv: 'sample-3', now: T0 }), { ok: false, reason: 'version' });
  assert.deepEqual(await verifyDraw(hmacKey, tok, { now: T0 }), { ok: false, reason: 'version' });
});

test('malformed input is refused without throwing', async () => {
  const { hmacKey, tok } = await setup();
  const [body, sig] = tok.split('.');
  const cases = [
    undefined, null, 42, {}, [], '', '.', 'abc', 'a.b.c', `${body}.`, `.${sig}`, `${body}.${sig}.${sig}`,
    `${body}=.${sig}`, `${body}.${sig}=`, `${body} .${sig}`, `${body}.${sig.slice(0, 20)}`, 'x'.repeat(5000),
    `${body}.${sig}`.replace('.', '..'),
  ];
  for (const c of cases) {
    const out = await verifyDraw(hmacKey, c, { bv, now: T0 });
    assert.equal(out.ok, false, String(c).slice(0, 40));
    // Shape failures are 'malformed'; a well-formed token with a bad MAC is 'signature'.
    assert.ok(['malformed', 'signature'].includes(out.reason), String(c).slice(0, 40));
    if (typeof c !== 'string' || !/^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/.test(c) || c.length > 4096) {
      assert.equal(out.reason, 'malformed', String(c).slice(0, 40));
    }
  }
  // Correctly signed, but the payload isn't a draw.
  const signed = async (text) => {
    const part = Buffer.from(text).toString('base64url');
    const raw = new Uint8Array(await crypto.subtle.sign('HMAC', hmacKey, new TextEncoder().encode(part)));
    return `${part}.${Buffer.from(raw).toString('base64url')}`;
  };
  // A well-formed nonce, so each case below fails on its own field.
  const n = 'A'.repeat(22);
  assert.equal((await verifyDraw(hmacKey, await signed(JSON.stringify({ ids, bv, iat: T0 / 1000, n })), { bv, now: T0 })).ok, true);
  for (const text of [
    'not json', '[]', 'null', '{}', JSON.stringify({ ids: [], bv, iat: T0 / 1000, n }), JSON.stringify({ ids: 's01', bv, iat: T0 / 1000, n }),
    JSON.stringify({ ids: [1, 2], bv, iat: T0 / 1000, n }), JSON.stringify({ ids, bv: 7, iat: T0 / 1000, n }),
    JSON.stringify({ ids, bv, iat: '1760434200', n }), JSON.stringify({ ids, bv, iat: 1.5, n }),
    // No nonce (a draw from before nonces), or one of the wrong shape.
    JSON.stringify({ ids, bv, iat: T0 / 1000 }), JSON.stringify({ ids, bv, iat: T0 / 1000, n: '' }),
    JSON.stringify({ ids, bv, iat: T0 / 1000, n: 'short' }), JSON.stringify({ ids, bv, iat: T0 / 1000, n: 42 }),
    JSON.stringify({ ids, bv, iat: T0 / 1000, n: 'a'.repeat(21) + '!' }),
  ]) {
    assert.deepEqual(await verifyDraw(hmacKey, await signed(text), { bv, now: T0 }), { ok: false, reason: 'malformed' }, text);
  }
  // Not a key at all.
  assert.deepEqual(await verifyDraw(null, tok, { bv, now: T0 }), { ok: false, reason: 'malformed' });
});

test('the HMAC key must be base64url of at least 32 bytes', async () => {
  for (const bad of [undefined, null, '', 'not base64url!', freshKeyText(16), `${freshKeyText()}=`, 42]) {
    assert.equal(await importDrawKey(bad), null, String(bad));
  }
  assert.ok(await importDrawKey(freshKeyText()));
  assert.ok(await importDrawKey(freshKeyText(64)));
});
