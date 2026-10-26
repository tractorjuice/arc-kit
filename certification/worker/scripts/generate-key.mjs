// Generates the RS256 (RSA 2048) signing key.
// Writes the PUBLIC key set to docs/certification/jwks.json (or argv[2]) and
// prints the PRIVATE JWK to stdout only, so it can be piped straight into
// `npx wrangler secret put SIGNING_KEY` and never touches disk.
// It refuses to overwrite an existing key set, and then prints nothing to
// stdout: a private key whose public half wasn't saved is never shown.
import { writeFileSync } from 'node:fs';

const out = process.argv[2] ?? 'docs/certification/jwks.json';
const kid = `arckit-cert-${new Date().toISOString().slice(0, 10)}`;
const kp = await crypto.subtle.generateKey({ name: 'RSASSA-PKCS1-v1_5', modulusLength: 2048, publicExponent: new Uint8Array([1, 0, 1]), hash: 'SHA-256' }, true, ['sign', 'verify']);
const priv = await crypto.subtle.exportKey('jwk', kp.privateKey);
const pub = await crypto.subtle.exportKey('jwk', kp.publicKey);
try {
  writeFileSync(out, `${JSON.stringify({ keys: [{ kty: pub.kty, n: pub.n, e: pub.e, kid, use: 'sig', alg: 'RS256' }] }, null, 2)}\n`, { flag: 'wx' });
} catch (e) {
  if (e.code !== 'EEXIST') throw e;
  process.stderr.write(`${out} already exists. Write the new key set somewhere else and merge it by hand; see certification/README.md.\n`);
  process.exit(1);
}
process.stdout.write(JSON.stringify({ kty: priv.kty, n: priv.n, e: priv.e, d: priv.d, p: priv.p, q: priv.q, dp: priv.dp, dq: priv.dq, qi: priv.qi, kid }));
