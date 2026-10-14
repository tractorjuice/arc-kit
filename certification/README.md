# ArcKit certification

The Worker and tooling behind <https://arckit.org/certification/>. Design: `docs/plans/2026-10-14-arckit-certification-programme.md`.

- `worker/`: Cloudflare Worker. It serves questions, marks answers and signs Open Badges 3.0 credentials (EdDSA). It has no runtime dependencies.
- `private/` (gitignored): the real question banks, with answer keys. They never go in this repo. Upload them to KV with `npx wrangler kv key put --binding QUESTIONS awareness --path ../private/awareness.json --remote` from `worker/`.
- The pages and public keys live in `docs/certification/`.

Tests: `node --test tests/certification/*.test.mjs`.

Rotating the signing key: run `node worker/scripts/generate-key.mjs <new-jwks-path>`, merge the new key into `docs/certification/jwks.json` (keep the old one so earlier credentials still verify), and pipe the private part into `npx wrangler secret put SIGNING_KEY`.
