# Threat model — johnfelipe/arc-kit (ArcKit)

Fork of `tractorjuice/arc-kit`. This document builds on `plugins/arckit-claude/docs/ENFORCEMENT.md` (what is enforced in code, what is requested of the model and what the organisation owns) and on the code itself.

## 1. System and trust boundaries

ArcKit is a governance harness that runs **inside the user's AI agent** (Claude Code, Codex, Gemini, Kimi, OpenCode, Copilot, Paperclip, Vibe). It writes `projects/NNN-*/ARC-*.md` artefacts into the user's repository. Hooks (Node processes launched by the runtime) are the only layer enforced in code (Tier 1); everything else is instructions to the model (Tier 2).

Boundaries:

- **Untrusted content → agent context:** research web pages and MCP servers, documents in `projects/*/external/`, supplier bids in `projects/*/vendors/`, `.arckit/memory/sessions.md` (commit subjects), `specs/`. Hooks must treat it as data.
- **Agent → user's file system and shell:** the PreToolUse gates (`file-protection`, `secret-detection`, `validate-arc-filename`, `supplier-isolation`) limit what the agent can write and read.
- **Internet → certification Worker** `certification-api.arckit.org` (Cloudflare).
- **Repository → published packages:** converter, `push-extensions.sh`, release workflow, marketplace.

## 2. Components

| Component | Code |
|---|---|
| Claude hooks | `plugins/arckit-claude/hooks/`, `plugins/arckit-claude/hooks/hooks.json` |
| Other-runtime hooks | `extensions/arckit-codex/hooks/` (hand-maintained), `extensions/arckit-gemini/hooks/scripts/` (hand-maintained), `plugins/arckit-claude/hooks/kimi-hook-adapter.mjs` |
| Plugin content | `plugins/arckit-*/` (commands, agents, skills, templates, references, `scripts/`, `.mcp.json`) |
| CLI | `src/arckit_cli/`, `hatch_build.py`, `pyproject.toml` |
| Build and release | `scripts/` (converter, push-extensions, bump-version), `.github/workflows/` |
| Certification Worker | `certification/worker/` (`wrangler.toml`, `src/*.mjs`), pages under `docs/certification/` |
| Site and pages | `docs/` (arckit.org, GitHub Pages), the `/arckit:pages` template (`.arckit/templates/pages-template.html` and its plugin copy) |
| Paperclip | `extensions/arckit-paperclip/src/` |

Almost all of `extensions/` is a generated (gitignored) copy of `plugins/`; the root cause is fixed in `plugins/`.

## 3. Entry points and who can reach them

- Hook payloads (runtime stdin JSON): tool paths, Bash commands, prompts — controlled by the model, which may be under prompt injection.
- Files in the user's repository read by hooks at session start or during `/arckit:pages`, `/arckit:health`, `/arckit:traceability` (anyone who can push to the user's repository).
- `arckit init` (target paths, symlinks, package data).
- Worker: `GET /awareness/questions`, `POST /awareness/submit`, `GET /<credential id>` — public, no login; CORS restricted to `https://arckit.org`; rate limit of 5 per minute per IP and location.
- CI: workflows on push and PR, and release on tag (`contents: write`).

## 4. Assets (critical according to the owner)

The owner marked all four as critical:

1. **RS256 signing key (`SIGNING_KEY`) and credential validity**, plus `DRAW_HMAC_KEY` and the question banks with their answers (KV `QUESTIONS`).
2. **User secrets and machine:** `.env*`, SSH keys, `.git/config`, credentials; code execution on the user's machine.
3. **Confidentiality of supplier bids** (`supplier-isolation.mjs`: the orchestrator does not read the raw bid during `/arckit:evaluate` and `/arckit:score`).
4. **Integrity of published packages** (the `tractorjuice/arckit-claude` marketplace, published extensions, the PyPI wheel).

Other: personal data in credentials (name), the arckit.org site.

## 5. Attackers

According to the owner, **all of them matter; none is ruled out**:

- Hostile content the agent reads (prompt injection) to bypass hooks or exfiltrate data.
- Anyone on the internet attacking the Worker (forging credentials, obtaining answers, exhausting KV quota).
- A malicious contributor via PR, CI or the release supply chain.
- Anyone who can push to the user's repository (commits, files in `external/`).

## 6. Existing controls

- Tier 1 of `ENFORCEMENT.md`: file protection (resolves symlinks), secret detection on writes and prompts, `ARC-*` naming, supplier isolation, session context fenced as data, no hook grants permissions, fail-closed for ArcKit artefacts and supplier documents (Claude Code v2.1.295 or later).
- Worker: RS256 JWS, HMAC-signed draw with a single-use nonce, rate limiting, restricted CORS, logs without request bodies.
- CI: actions pinned by SHA (`check-action-pins.py`).

## 7. Out of scope and accepted risk

The owner stated that **nothing is out of scope**: every runtime (including those without gates, and Kimi) and the copies in `extensions/` count.

## 8. Open questions

- Which findings already have an upstream PR in `tractorjuice/arc-kit`? (`Upstream` tag).
