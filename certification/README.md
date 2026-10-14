# ArcKit certification

The Worker and tooling behind <https://arckit.org/certification/>. Design: `docs/plans/2026-10-14-arckit-certification-programme.md`.

- `worker/`: Cloudflare Worker. It serves questions, marks answers and signs Open Badges 3.0 credentials (EdDSA). It has no runtime dependencies.
- `private/` (gitignored): the real question banks, with answer keys. They never go in this repo.
- The pages and public keys live in `docs/certification/`. At deploy time, set `API_BASE` in `docs/certification/config.js` to the deployed Worker URL.

Tests: `node --test tests/certification/*.test.mjs`.

## Operations

Run these from `worker/` unless a step says otherwise.

- **Upload a bank:** check it first with `node scripts/check-bank.mjs ../private/awareness.json`, then upload it with `npx wrangler kv key put --binding QUESTIONS awareness --path ../private/awareness.json --remote`.
- **Back up the banks** somewhere private (the design keeps them in a private repo). `certification/private/` is a single local copy.
- **Remove a credential** (the privacy policy promises this): `npx wrangler kv key delete --binding CREDENTIALS "cred:<id>" --remote`.
- **Rotate the signing key:** from `certification/`, generate the new key set to a NEW path with `node worker/scripts/generate-key.mjs /path/new-jwks.json | npx wrangler secret put SIGNING_KEY`. Add the new key to `docs/certification/jwks.json` and keep the old one there, then add the old public key to `PUBLIC_KEYS` in `worker/wrangler.toml` so earlier credentials still verify. The script refuses to overwrite an existing file.
- **Local dev:** put `ALLOWED_ORIGINS="http://localhost:4000"` (and a test `SIGNING_KEY`) in `worker/.dev.vars` (gitignored) for `npx wrangler dev`.
- **Limits:** submissions are limited to 5 a minute per IP per Cloudflare location. The Workers free plan allows 1,000 KV writes a day, so a determined script can still exhaust it; move to Workers Paid if that happens.
