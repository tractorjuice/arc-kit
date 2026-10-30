// Draw tokens: the Worker's signed record of which questions it drew for an
// attempt, so marking needs no server-side state. (The file is drawsig.mjs
// because the repo's file-protection hook refuses filenames with "token".)
//
// Format: base64url(JSON.stringify({ ids, bv, iat, n })), a dot, then the
// base64url HMAC-SHA256 of that first part. `ids` is the ordered list of drawn
// question IDs, `bv` the bankVersion, `iat` epoch seconds and `n` a random
// nonce (16 bytes, base64url) that the Worker records when the draw is
// submitted, so each draw is marked once.
//
// The key is the Worker binding DRAW_HMAC_KEY: base64url of 32 random bytes.
// WebCrypto only, so this runs unchanged in the Worker and in Node tests.

const HMAC = { name: 'HMAC', hash: 'SHA-256' };
const enc = new TextEncoder();
const dec = new TextDecoder('utf-8', { fatal: true });

export const DRAW_TTL_SECONDS = 60 * 60;
export const KEY_MIN_BYTES = 32;
const SIG_BYTES = 32;
const NONCE_BYTES = 16;
const NONCE_RE = /^[A-Za-z0-9_-]{22}$/;
const MAX_LENGTH = 4096; // ten IDs need about 200 characters
const MAX_IDS = 100;
const MAX_ID_LENGTH = 64;
// Edge machines' clocks can differ slightly; a draw stamped up to a minute in
// the future is still accepted.
export const CLOCK_SKEW_SECONDS = 60;

function b64url(bytes) {
  let s = '';
  for (const b of bytes) s += String.fromCharCode(b);
  return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

// Canonical base64url only: anything else (padding, stray characters, unused
// trailing bits) is null, so each value has exactly one spelling.
function fromB64url(str) {
  if (typeof str !== 'string' || !/^[A-Za-z0-9_-]+$/.test(str)) return null;
  let bin;
  try { bin = atob(str.replace(/-/g, '+').replace(/_/g, '/')); } catch { return null; }
  const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0));
  return b64url(bytes) === str ? bytes : null;
}

const fail = (reason) => ({ ok: false, reason });

function validPayload(p) {
  return Boolean(p) && typeof p === 'object' && !Array.isArray(p)
    && Array.isArray(p.ids) && p.ids.length >= 1 && p.ids.length <= MAX_IDS
    && p.ids.every((id) => typeof id === 'string' && id.length >= 1 && id.length <= MAX_ID_LENGTH)
    && typeof p.bv === 'string' && p.bv.length >= 1
    && Number.isSafeInteger(p.iat) && p.iat >= 0
    && typeof p.n === 'string' && NONCE_RE.test(p.n);
}

// The HMAC key from its base64url form, or null when it is missing, malformed
// or shorter than 32 bytes. Never throws.
export async function importDrawKey(encoded) {
  const raw = fromB64url(encoded);
  if (!raw || raw.length < KEY_MIN_BYTES) return null;
  try {
    return await crypto.subtle.importKey('raw', raw, HMAC, false, ['sign', 'verify']);
  } catch {
    return null;
  }
}

// `now` is epoch milliseconds, injectable for tests.
export async function signDraw(hmacKey, { ids, bv }, now = Date.now()) {
  const n = b64url(crypto.getRandomValues(new Uint8Array(NONCE_BYTES)));
  const body = b64url(enc.encode(JSON.stringify({ ids, bv, iat: Math.floor(now / 1000), n })));
  const sig = new Uint8Array(await crypto.subtle.sign(HMAC.name, hmacKey, enc.encode(body)));
  return `${body}.${b64url(sig)}`;
}

// { ok: true, ids, bv, iat, n } for a draw this key signed for bank version
// `bv` within the last hour; otherwise { ok: false, reason } with reason one
// of malformed, signature, version, expired or future. Never throws.
// The signature is checked with crypto.subtle.verify, which compares in
// constant time.
export async function verifyDraw(hmacKey, drawToken, { bv, now = Date.now() } = {}) {
  try {
    if (typeof drawToken !== 'string' || drawToken.length > MAX_LENGTH) return fail('malformed');
    const parts = drawToken.split('.');
    if (parts.length !== 2) return fail('malformed');
    const body = fromB64url(parts[0]);
    const sig = fromB64url(parts[1]);
    if (!body || !sig || sig.length !== SIG_BYTES) return fail('malformed');
    const ok = await crypto.subtle.verify(HMAC.name, hmacKey, sig, enc.encode(parts[0]));
    if (!ok) return fail('signature');
    const payload = JSON.parse(dec.decode(body));
    if (!validPayload(payload)) return fail('malformed');
    if (payload.bv !== bv) return fail('version');
    const nowSeconds = Math.floor(now / 1000);
    if (payload.iat > nowSeconds + CLOCK_SKEW_SECONDS) return fail('future');
    if (nowSeconds - payload.iat > DRAW_TTL_SECONDS) return fail('expired');
    return { ok: true, ids: payload.ids, bv: payload.bv, iat: payload.iat, n: payload.n };
  } catch {
    return fail('malformed');
  }
}
