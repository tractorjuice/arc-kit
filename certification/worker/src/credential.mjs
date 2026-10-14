// Open Badges 3.0 credentials, signed as compact JWS (RS256: RSASSA-PKCS1-v1_5 with SHA-256),
// the OB 3.0 baseline every verifier supports. WebCrypto only, so this runs unchanged in the Worker and in Node tests.

export const ISSUER_ID = 'https://arckit.org/certification/issuer.json';

// The published key set. A JWS header's kid is a URI that dereferences to the
// key: the JWKS URL plus a fragment naming the key (OB 3.0 §8.2.3).
export const JWKS_URL = 'https://arckit.org/certification/jwks.json';
export const keyUri = (kid) => `${JWKS_URL}#${kid}`;

export const ACHIEVEMENTS = {
  awareness: {
    id: 'https://arckit.org/certification/achievements/awareness.json',
    name: 'ArcKit Awareness',
    description: 'Knows what ArcKit is and how it keeps AI-drafted architecture documents defensible: templates, citations, traceability, provenance and people making the decisions.',
    criteria: { narrative: 'Passed the ArcKit Awareness quiz (10 questions, 80% to pass) for ArcKit 6.' },
    image: { id: 'https://arckit.org/certification/badges/awareness.svg', type: 'Image' },
  },
};

const RSA = { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' };
const MAJOR_VERSION = 'ArcKit 6';
const enc = new TextEncoder();
const dec = new TextDecoder();

function b64url(bytes) {
  let s = '';
  for (const b of bytes) s += String.fromCharCode(b);
  return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function fromB64url(str) {
  if (!/^[A-Za-z0-9_-]+$/.test(str)) throw new Error('bad base64url');
  const s = atob(str.replace(/-/g, '+').replace(/_/g, '/'));
  return Uint8Array.from(s, (c) => c.charCodeAt(0));
}

const b64urlJson = (obj) => b64url(enc.encode(JSON.stringify(obj)));

export function credentialPageUrl(siteUrl, id) {
  return `${siteUrl}/certification/credential.html?id=${encodeURIComponent(id)}`;
}

// ISO 8601 UTC with no fractional seconds, e.g. 2026-10-14T09:30:00Z.
export function wholeSecondIso(date = new Date()) {
  return date.toISOString().replace(/\.\d+Z$/, 'Z');
}

export function buildCredential({ id, name, level, issuedAt, siteUrl, subjectId = `urn:uuid:${crypto.randomUUID()}` }) {
  const achievement = ACHIEVEMENTS[level];
  if (!achievement) throw new Error(`Unknown level: ${level}`);
  return {
    '@context': ['https://www.w3.org/ns/credentials/v2', 'https://purl.imsglobal.org/spec/ob/v3p0/context-3.0.3.json'],
    id: credentialPageUrl(siteUrl, id),
    type: ['VerifiableCredential', 'OpenBadgeCredential'],
    issuer: { id: ISSUER_ID, type: ['Profile'], name: 'ArcKit', url: siteUrl },
    validFrom: issuedAt,
    name: `${achievement.name} (${MAJOR_VERSION})`,
    credentialSubject: {
      id: subjectId,
      type: ['AchievementSubject'],
      name,
      identifier: [{ type: 'IdentityObject', identityType: 'name', hashed: false, identityHash: name }],
      achievement: { type: ['Achievement'], ...achievement },
    },
  };
}

// OB 3.0 §8.2.4.1: the JWT payload is the credential plus iss, jti, nbf and sub.
// There is no exp, because the credential has no validUntil.
export function toJwtPayload(credential) {
  return {
    ...credential,
    iss: credential.issuer.id,
    jti: credential.id,
    nbf: Math.floor(Date.parse(credential.validFrom) / 1000),
    sub: credential.credentialSubject.id,
  };
}

export function publicJwkFrom({ kty, n, e, kid }) {
  return { kty, n, e, kid };
}

export async function signJws(payload, privateJwk) {
  const header = { alg: 'RS256', kid: keyUri(privateJwk.kid), typ: 'JWT' };
  const input = `${b64urlJson(header)}.${b64urlJson(payload)}`;
  const { kty, n, e, d, p, q, dp, dq, qi } = privateJwk;
  const key = await crypto.subtle.importKey('jwk', { kty, n, e, d, p, q, dp, dq, qi }, RSA, false, ['sign']);
  const sig = new Uint8Array(await crypto.subtle.sign(RSA.name, key, enc.encode(input)));
  return `${input}.${b64url(sig)}`;
}

const HEADER_KEYS = new Set(['alg', 'kid', 'typ']);

// `keys` is an array of public JWKs, each with a kid. The header must name one
// of them by its key URI; an embedded jwk is refused, so a token can never
// supply its own key.
export async function verifyJws(jws, keys) {
  try {
    const parts = typeof jws === 'string' ? jws.split('.') : [];
    if (parts.length !== 3 || parts.some((p) => p.length === 0)) return { valid: false };
    const header = JSON.parse(dec.decode(fromB64url(parts[0])));
    if (Object.keys(header).some((k) => !HEADER_KEYS.has(k))) return { valid: false };
    if (header.alg !== 'RS256') return { valid: false };
    if ('typ' in header && header.typ !== 'JWT') return { valid: false };
    const publicJwk = keys.find((k) => keyUri(k.kid) === header.kid);
    if (!publicJwk) return { valid: false };
    const { kty, n, e } = publicJwk;
    const key = await crypto.subtle.importKey('jwk', { kty, n, e }, RSA, false, ['verify']);
    const ok = await crypto.subtle.verify(RSA.name, key, fromB64url(parts[2]), enc.encode(`${parts[0]}.${parts[1]}`));
    if (!ok) return { valid: false };
    const payload = JSON.parse(dec.decode(fromB64url(parts[1])));
    if (payload.iss !== ISSUER_ID) return { valid: false };
    if (typeof payload.jti !== 'string' || payload.jti !== payload.id) return { valid: false };
    if (typeof payload.sub !== 'string' || payload.sub !== payload.credentialSubject?.id) return { valid: false };
    return { valid: true, payload };
  } catch {
    return { valid: false };
  }
}
