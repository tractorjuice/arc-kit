// Generates the Ed25519 signing key.
// Writes the PUBLIC key set to docs/certification/jwks.json (or argv[2]) and
// prints the PRIVATE JWK to stdout only, so it can be piped straight into
// `npx wrangler secret put SIGNING_KEY` and never touches disk.
import { writeFileSync } from 'node:fs';

const out = process.argv[2] ?? 'docs/certification/jwks.json';
const kid = `arckit-cert-${new Date().toISOString().slice(0, 10)}`;
const kp = await crypto.subtle.generateKey({ name: 'Ed25519' }, true, ['sign', 'verify']);
const priv = await crypto.subtle.exportKey('jwk', kp.privateKey);
const pub = await crypto.subtle.exportKey('jwk', kp.publicKey);
writeFileSync(out, `${JSON.stringify({ keys: [{ kty: pub.kty, crv: pub.crv, x: pub.x, kid, use: 'sig', alg: 'EdDSA' }] }, null, 2)}\n`);
process.stdout.write(JSON.stringify({ kty: priv.kty, crv: priv.crv, x: priv.x, d: priv.d, kid }));
