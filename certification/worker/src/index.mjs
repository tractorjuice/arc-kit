import { publicQuestions, mark } from './quiz.mjs';
import { validateName, validateAnswers } from './validate.mjs';
import { buildCredential, credentialPageUrl, signJws, verifyJws, publicJwkFrom, ACHIEVEMENTS } from './credential.mjs';
import { linkedInAddUrl } from './linkedin.mjs';

const MAX_BODY = 10_000;
const ID_RE = /^\/credentials\/([a-z2-7]{12})$/;
const ALPHABET = 'abcdefghijklmnopqrstuvwxyz234567';

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

async function submit(request, env, cors) {
  const text = await request.text();
  if (text.length > MAX_BODY) return json({ error: 'That submission is too large.' }, 413, cors);
  let body;
  try { body = JSON.parse(text); } catch { return json({ error: 'Send the form as JSON.' }, 400, cors); }
  if (!body || typeof body !== 'object') return json({ error: 'Send the form as JSON.' }, 400, cors);

  const bank = await loadBank(env, 'awareness');
  if (!bank) return json({ error: 'The quiz isn’t available right now. Try again later.' }, 503, cors);
  if (body.bankVersion !== bank.bankVersion) {
    return json({ error: 'The questions have changed since you opened this page. Reload the page and try again.' }, 409, cors);
  }
  const name = validateName(body.name);
  if (!name.ok) return json({ error: name.error }, 400, cors);
  const answers = validateAnswers(body.answers, bank);
  if (!answers.ok) return json({ error: answers.error }, 400, cors);

  const result = mark(bank, answers.value);
  if (!result.passed) return json({ passed: false, ...result }, 200, cors);

  const id = newId();
  const issuedAt = new Date().toISOString();
  const credential = buildCredential({ id, name: name.value, level: 'awareness', issuedAt, siteUrl: env.SITE_URL });
  const jws = await signJws(credential, JSON.parse(env.SIGNING_KEY));
  await env.CREDENTIALS.put(`cred:${id}`, JSON.stringify({ id, name: name.value, level: 'awareness', issuedAt, jws }));
  const credentialUrl = credentialPageUrl(env.SITE_URL, id);
  return json({
    passed: true,
    ...result,
    credentialId: id,
    credentialUrl,
    linkedInUrl: linkedInAddUrl({ certName: credential.name, issuedAt, certUrl: credentialUrl, certId: id }),
  }, 200, cors);
}

async function getCredential(id, env, cors) {
  const raw = await env.CREDENTIALS.get(`cred:${id}`);
  if (!raw) return json({ error: 'No credential with that ID.' }, 404, cors);
  const rec = JSON.parse(raw);
  const check = await verifyJws(rec.jws, publicJwkFrom(JSON.parse(env.SIGNING_KEY)));
  const valid = check.valid && check.payload?.credentialSubject?.name === rec.name;
  const achievementName = `${ACHIEVEMENTS[rec.level].name} (ArcKit 6)`;
  const credentialUrl = credentialPageUrl(env.SITE_URL, id);
  return json({
    id, name: rec.name, level: rec.level, achievementName, issuedAt: rec.issuedAt, valid, jws: rec.jws, credentialUrl,
    linkedInUrl: linkedInAddUrl({ certName: achievementName, issuedAt: rec.issuedAt, certUrl: credentialUrl, certId: id }),
  }, 200, cors);
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const cors = corsHeaders(request.headers.get('Origin'), env.ALLOWED_ORIGINS);
    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors });
    try {
      if (request.method === 'GET' && url.pathname === '/awareness/questions') {
        const bank = await loadBank(env, 'awareness');
        if (!bank) return json({ error: 'The quiz isn’t available right now. Try again later.' }, 503, cors);
        return json(publicQuestions(bank), 200, cors);
      }
      if (request.method === 'POST' && url.pathname === '/awareness/submit') return await submit(request, env, cors);
      const m = request.method === 'GET' && url.pathname.match(ID_RE);
      if (m) return await getCredential(m[1], env, cors);
      return json({ error: 'No credential with that ID.' }, 404, cors);
    } catch {
      return json({ error: 'Something went wrong. Try again.' }, 500, cors);
    }
  },
};
