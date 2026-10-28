import { drawIds, isDrawable, isWholeDraw, mark, publicDraw, resolveDraw } from './quiz.mjs';
import { CLOCK_SKEW_SECONDS, DRAW_TTL_SECONDS, importDrawKey, signDraw, verifyDraw } from './drawsig.mjs';
import { validateName, validateAnswers } from './validate.mjs';
import {
  buildCredential, credentialPageUrl, signJws, verifyJws, publicJwkFrom, toJwtPayload, wholeSecondIso, ACHIEVEMENTS,
} from './credential.mjs';
import { linkedInAddUrl } from './linkedin.mjs';

const MAX_BODY = 10_000;
const ID_RE = /^\/credentials\/([a-z2-7]{12})$/;
const ALPHABET = 'abcdefghijklmnopqrstuvwxyz234567';
const UNAVAILABLE = 'The quiz isn’t available right now. Try again later.';
const STALE_DRAW = 'The questions have changed or this attempt has expired. Reload the page and try again.';
const USED_DRAW = 'This attempt has already been submitted. Reload the page for a fresh set of questions.';
const KV_MIN_TTL_SECONDS = 60;

function corsHeaders(origin, allowed) {
  const list = (allowed || '').split(',').map((s) => s.trim()).filter(Boolean);
  const h = { Vary: 'Origin' };
  if (origin && list.includes(origin)) {
    h['Access-Control-Allow-Origin'] = origin;
    h['Access-Control-Allow-Methods'] = 'GET, POST, OPTIONS';
    h['Access-Control-Allow-Headers'] = 'Content-Type';
  }
  return h;
}

function json(body, status, cors) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', ...cors },
  });
}

function newId() {
  // 12 base32 characters (60 bits). 256 % 32 === 0, so the mapping has no bias.
  return Array.from(crypto.getRandomValues(new Uint8Array(12)), (b) => ALPHABET[b % 32]).join('');
}

async function loadBank(env, level) {
  const raw = await env.QUESTIONS.get(level);
  return raw ? JSON.parse(raw) : null;
}

// The bank and the draw-signing key, or null when either is missing. A bank in
// the old shape (no domains to draw from) counts as missing. Logs which part is
// absent, never the key.
async function quizReady(env) {
  const bank = await loadBank(env, 'awareness');
  if (!isDrawable(bank)) {
    if (bank) console.error('The awareness bank has no domains to draw from');
    return null;
  }
  const hmacKey = await importDrawKey(env.DRAW_HMAC_KEY);
  if (!hmacKey) {
    console.error('DRAW_HMAC_KEY is missing or shorter than 32 bytes');
    return null;
  }
  return { bank, hmacKey };
}

async function serveDraw(env, cors) {
  const ready = await quizReady(env);
  if (!ready) return json({ error: UNAVAILABLE }, 503, cors);
  const { bank, hmacKey } = ready;
  const ids = drawIds(bank);
  const drawToken = await signDraw(hmacKey, { ids, bv: bank.bankVersion });
  const { level, bankVersion, total, required, questions } = publicDraw(bank, ids);
  return json({ level, bankVersion, total, required, drawToken, questions }, 200, cors);
}

// Marks a verified draw as submitted, so each draw is marked once: replaying
// one token with an answer changed would otherwise show, through the result,
// whether that answer was right. False when the draw was already submitted.
// The marker outlives the draw itself, so it cannot lapse while the token
// still verifies. KV is eventually consistent across Cloudflare locations, so
// this stops sequential replays; the fail response carries no score, which
// leaves a near-simultaneous replay elsewhere little to learn.
async function claimDraw(env, draw, now = Date.now()) {
  const key = `draw:${draw.n}`;
  if (await env.CREDENTIALS.get(key)) return false;
  const left = draw.iat + DRAW_TTL_SECONDS + CLOCK_SKEW_SECONDS - Math.floor(now / 1000);
  await env.CREDENTIALS.put(key, '1', { expirationTtl: Math.max(KV_MIN_TTL_SECONDS, left) });
  return true;
}

// The current signing key's public half plus every retired key in PUBLIC_KEYS,
// so credentials signed before a key rotation still verify.
function verificationKeys(env) {
  const retired = JSON.parse(env.PUBLIC_KEYS || '{"keys":[]}').keys;
  const seen = new Set();
  return [publicJwkFrom(JSON.parse(env.SIGNING_KEY)), ...retired.map(publicJwkFrom)]
    .filter((k) => !seen.has(k.kid) && seen.add(k.kid));
}

async function submit(request, env, cors) {
  if (env.SUBMIT_LIMITER) {
    const { success } = await env.SUBMIT_LIMITER.limit({ key: request.headers.get('CF-Connecting-IP') || 'unknown' });
    if (!success) return json({ error: 'Too many attempts. Wait a minute and try again.' }, 429, cors);
  }
  const text = await request.text();
  if (text.length > MAX_BODY) return json({ error: 'That submission is too large.' }, 413, cors);
  let body;
  try { body = JSON.parse(text); } catch { return json({ error: 'Send the form as JSON.' }, 400, cors); }
  if (!body || typeof body !== 'object') return json({ error: 'Send the form as JSON.' }, 400, cors);

  const ready = await quizReady(env);
  if (!ready) return json({ error: UNAVAILABLE }, 503, cors);
  const { bank, hmacKey } = ready;
  // The signed draw is the attempt. No draw (a page from before v2), a forged or
  // expired one, or one for an earlier bank version all ask for a reload.
  const draw = await verifyDraw(hmacKey, body.drawToken, { bv: bank.bankVersion });
  const resolved = draw.ok ? resolveDraw(bank, draw.ids) : null;
  const drawn = resolved && isWholeDraw(bank, resolved) ? resolved : null;
  if (!drawn) return json({ error: STALE_DRAW }, 409, cors);
  const name = validateName(body.name);
  if (!name.ok) return json({ error: name.error }, 400, cors);
  const answers = validateAnswers(body.answers, drawn);
  if (!answers.ok) return json({ error: answers.error }, 400, cors);
  // Only a submission that will be marked uses up the draw, so a typo in the
  // name doesn't cost the attempt.
  if (!(await claimDraw(env, draw))) return json({ error: USED_DRAW }, 409, cors);

  const { score, total, required, passed, areasToRevisit, review } = mark(bank, draw.ids, answers.value);
  // A fail names the areas to revisit but never the score or which questions
  // were wrong.
  if (!passed) return json({ passed: false, total, required, areasToRevisit }, 200, cors);

  const id = newId();
  const issuedAt = wholeSecondIso();
  const credential = buildCredential({ id, name: name.value, level: 'awareness', issuedAt, siteUrl: env.SITE_URL });
  const jws = await signJws(toJwtPayload(credential), JSON.parse(env.SIGNING_KEY));
  await env.CREDENTIALS.put(`cred:${id}`, JSON.stringify({ id, name: name.value, level: 'awareness', issuedAt, jws }));
  const credentialUrl = credentialPageUrl(env.SITE_URL, id);
  return json({
    passed: true,
    score,
    total,
    required,
    credentialId: id,
    credentialUrl,
    linkedInUrl: linkedInAddUrl({ certName: credential.name, issuedAt, certUrl: credentialUrl, certId: id }),
    review,
  }, 200, cors);
}

async function getCredential(id, env, cors) {
  const raw = await env.CREDENTIALS.get(`cred:${id}`);
  if (!raw) return json({ error: 'No credential with that ID.' }, 404, cors);
  const rec = JSON.parse(raw);
  const check = await verifyJws(rec.jws, verificationKeys(env));
  const valid = check.valid && check.payload.credentialSubject?.name === rec.name;
  // Show what was signed when the signature holds; otherwise fall back to the stored record.
  const achievementName = valid ? check.payload.name : ACHIEVEMENTS[rec.level].name;
  const issuedAt = valid ? check.payload.validFrom : rec.issuedAt;
  const credentialUrl = credentialPageUrl(env.SITE_URL, id);
  return json({
    id, name: rec.name, level: rec.level, achievementName, issuedAt, valid, jws: rec.jws, credentialUrl,
    linkedInUrl: linkedInAddUrl({ certName: achievementName, issuedAt, certUrl: credentialUrl, certId: id }),
  }, 200, cors);
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const cors = corsHeaders(request.headers.get('Origin'), env.ALLOWED_ORIGINS);
    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors });
    try {
      if (request.method === 'GET' && url.pathname === '/awareness/questions') return await serveDraw(env, cors);
      if (request.method === 'POST' && url.pathname === '/awareness/submit') return await submit(request, env, cors);
      const m = request.method === 'GET' && url.pathname.match(ID_RE);
      if (m) return await getCredential(m[1], env, cors);
      return json({ error: 'No credential with that ID.' }, 404, cors);
    } catch (e) {
      // Log the error, never the request body, the name or the key. A JSON.parse
      // SyntaxError message quotes its input (a malformed SIGNING_KEY, or a stored
      // name), so for those only the error type is logged.
      console.error(e instanceof SyntaxError ? 'SyntaxError' : e instanceof Error ? e.message : String(e));
      return json({ error: 'Something went wrong. Try again.' }, 500, cors);
    }
  },
};
