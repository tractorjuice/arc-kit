// Open Badges 3.0 credentials, signed as compact JWS (EdDSA / Ed25519).
// WebCrypto only, so this runs unchanged in the Worker and in Node tests.

export const ISSUER_ID = 'https://arckit.org/certification/issuer.json';

export const ACHIEVEMENTS = {
  awareness: {
    id: 'https://arckit.org/certification/achievements/awareness.json',
    name: 'ArcKit Awareness',
    description: 'Knows what ArcKit is and how it keeps AI-drafted architecture documents defensible: templates, citations, traceability, provenance and people making the decisions.',
    criteria: { narrative: 'Passed the ArcKit Awareness quiz (10 questions, 80% to pass) for ArcKit 6.' },
    image: { id: 'https://arckit.org/certification/badges/awareness.svg', type: 'Image' },
  },
};

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

export function buildCredential({ id, name, level, issuedAt, siteUrl }) {
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
      type: ['AchievementSubject'],
      name,
      achievement: { type: ['Achievement'], ...achievement },
    },
  };
}

export function publicJwkFrom({ kty, crv, x, kid }) {
  return { kty, crv, x, kid };
}

export async function signJws(payload, privateJwk) {
  const header = { alg: 'EdDSA', typ: 'vc+jwt', kid: privateJwk.kid };
  const input = `${b64urlJson(header)}.${b64urlJson(payload)}`;
  const { kty, crv, x, d } = privateJwk;
  const key = await crypto.subtle.importKey('jwk', { kty, crv, x, d }, { name: 'Ed25519' }, false, ['sign']);
  const sig = new Uint8Array(await crypto.subtle.sign({ name: 'Ed25519' }, key, enc.encode(input)));
  return `${input}.${b64url(sig)}`;
}

export async function verifyJws(jws, publicJwk) {
  try {
    const parts = typeof jws === 'string' ? jws.split('.') : [];
    if (parts.length !== 3 || parts.some((p) => p.length === 0)) return { valid: false };
    const header = JSON.parse(dec.decode(fromB64url(parts[0])));
    if (header.alg !== 'EdDSA') return { valid: false };
    const { kty, crv, x } = publicJwk;
    const key = await crypto.subtle.importKey('jwk', { kty, crv, x }, { name: 'Ed25519' }, false, ['verify']);
    const ok = await crypto.subtle.verify({ name: 'Ed25519' }, key, fromB64url(parts[2]), enc.encode(`${parts[0]}.${parts[1]}`));
    if (!ok) return { valid: false };
    return { valid: true, payload: JSON.parse(dec.decode(fromB64url(parts[1]))) };
  } catch {
    return { valid: false };
  }
}
