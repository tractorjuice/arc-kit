# ArcKit certification

The Worker and tooling behind <https://arckit.org/certification/>. Design: `docs/plans/2026-10-14-arckit-certification-programme.md`.

- `worker/`: Cloudflare Worker. It draws each attempt's questions, marks answers and signs Open Badges 3.0 credentials (RS256). It has no runtime dependencies.
- `private/` (gitignored): the real question banks, with answer keys. They never go in this repo.
- The pages and public keys live in `docs/certification/`. The Worker runs at <https://certification-api.arckit.org> (a custom domain on the arckit.org zone), and `docs/certification/config.js` points the pages at it.

Tests: `node --test tests/certification/*.test.mjs`.

## Operations

Run these from `worker/` unless a step says otherwise.

- **Set the draw key:** the Worker signs each attempt's draw (the 10 question IDs, the bank version and the time) with HMAC-SHA256, using the secret `DRAW_HMAC_KEY`. Set it once with `node -e "process.stdout.write(require('node:crypto').randomBytes(32).toString('base64url'))" | npx wrangler secret put DRAW_HMAC_KEY`. The 32 fresh random bytes go straight into the secret, so the value is never shown or saved. Without the key the quiz answers 503. Running the command again rotates the key, which ends every attempt in progress (409, and the page asks people to reload).
- **Upload a bank:** the Awareness bank has 30 questions, 6 in each of 5 domains, each with an explanation, and the Worker draws 2 from each domain per attempt. Check it first with `node scripts/check-bank.mjs ../private/awareness.v2.json`, then upload it with `npx wrangler kv key put --binding QUESTIONS awareness --path ../private/awareness.v2.json --remote`. Give every changed bank a new `bankVersion`. Uploading a new version ends every attempt in progress: each draw names the version it came from, so the Worker answers 409 and the page asks the person to reload for a fresh draw. Upload at a quiet time.
- **Moving from the 10-question bank (rollout order matters):**
  1. Merge the PR and wait for GitHub Pages to publish the new `awareness.js`. The new page works against the old Worker.
  2. Set `DRAW_HMAC_KEY` by piping fresh random bytes into `npx wrangler secret put DRAW_HMAC_KEY` (command above).
  3. `npx wrangler deploy`.
  4. Upload the v2 bank straight away. Until the upload, the new Worker answers 503.

  Why this order: if the Worker goes first, old cached pages send no draw token, get 409 and loop on "reload". Pages first means no page is ever older than the Worker.
- **Rollback:** `npx wrangler rollback` to the previous Worker version, then re-upload the previous bank from the private backup. An old Worker with a v2 bank serves all 30 questions, so never leave that pairing in place.
- **One submission per draw:** each draw carries a random nonce. When a submission is marked, the Worker stores `draw:<nonce>` in the `CREDENTIALS` namespace, expiring when the draw would, and answers 409 to any later submission of that draw, so replaying one draw with an answer changed tells nobody which answers are right. A fail gives the areas to revisit but not the score. A submission refused for its name or answers doesn't use up the draw. Draws expire after an hour. Draws signed before this change carry no nonce, so attempts open at deploy time get 409 and a reload; publish the pages first, since an older `awareness.js` expects a score on a fail.
- **Propagation:** KV takes up to about 60 seconds to reach every Cloudflare location, so expect brief 409s and 503s after an upload or a rollback.
- **Back up the banks** somewhere private (the design keeps them in a private repo). `certification/private/` is a single local copy.
- **Remove a credential** (the privacy policy promises this): `npx wrangler kv key delete --binding CREDENTIALS "cred:<id>" --remote`.
- **Rotate the signing key:** from `certification/`, generate the new key set to a NEW path with `node worker/scripts/generate-key.mjs /path/new-jwks.json | npx wrangler secret put SIGNING_KEY`. Add the new key to `docs/certification/jwks.json` and keep the old one there, then add the old public key to `PUBLIC_KEYS` in `worker/wrangler.toml` so earlier credentials still verify. The script refuses to overwrite an existing file.
- **Local dev:** put `ALLOWED_ORIGINS="http://localhost:4000"` (and a test `SIGNING_KEY` and `DRAW_HMAC_KEY`) in `worker/.dev.vars` (gitignored) for `npx wrangler dev`.
- **Limits:** submissions are limited to 5 a minute per IP per Cloudflare location. The Workers free plan allows 1,000 KV writes a day. Every marked submission writes one draw marker and a pass writes the credential too, so a determined script can still exhaust it; move to Workers Paid if that happens.
