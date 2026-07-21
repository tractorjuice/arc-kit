# arc-kit × Kimi V3 — Add Model Support Plan

**Status:** draft for review
**Owner:** Mark Craddock
**Date:** 2026-07-21
**Scope:** making Moonshot AI's Kimi V3 a first-class, selectable model for the ArcKit distributions that let the user choose one — Codex CLI and OpenCode CLI — and cleaning up the model-aware code so a non-Claude model id is handled correctly end-to-end.

---

## 1. What "add Kimi V3" actually means here

ArcKit ships in six formats. Only some of them let the user pick the underlying model:

| Format | Who chooses the model | Kimi V3 relevant? |
|--------|-----------------------|-------------------|
| Claude Code plugins (`plugins/arckit-claude/` + overlays) | Claude Code — Claude models only | **No.** The plugin, its hooks, agents and `effort:` tiers only ever run on a Claude model. Nothing here can be "switched" to Kimi. |
| Codex CLI extension (`extensions/arckit-codex/`) | user, via `config.toml` / provider config | **Yes** — Codex supports OpenAI-compatible providers; Moonshot is one. |
| OpenCode CLI extension (`extensions/arckit-opencode/`) | user, via `opencode.json` provider config | **Yes** — OpenCode has first-class multi-provider support incl. Moonshot / OpenRouter. |
| Gemini CLI extension | Gemini models | No. |
| Copilot extension | Copilot's model picker | Out of scope (Copilot controls its own model list). |

So "add Kimi V3" is **not** a change to the Claude plugin's behaviour. It is: (a) make Kimi V3 a documented, supported, ideally *default-selectable* model for the Codex and OpenCode outputs the converter generates, and (b) fix the two places in the codebase where model handling silently assumes either a Claude id or a Mistral default. Everything else is documentation.

This distinction matters because it is easy to "add Kimi to the effort-downgrade matrix" and feel done — that change is a **no-op** (see §3).

## 2. Where model-awareness lives today (as audited)

Findings from reading the code, recorded so the implementer doesn't re-audit:

| Location | Current behaviour | Touch for Kimi? |
|----------|-------------------|-----------------|
| `scripts/converter.py:1191-1193` | Per-agent Codex role model default is hardcoded `"mistral-large-2"`; `model: inherit` (every ArcKit agent) also collapses to `mistral-large-2`. | **Yes — primary change.** This is the only place the non-Claude *agent* model is chosen. |
| `scripts/converter.py:852` `generate_codex_config_toml()` | Emits `[features]`, hooks and MCP servers. **No `[model_providers.*]` block and no top-level `model` / profile.** Codex users wire their own provider. | **Yes — optional.** Ship a commented Moonshot provider block + profile so Kimi is one uncomment away. |
| `extensions/arckit-opencode/opencode.json` (hand-authored manifest) | Provider/model config for OpenCode. | **Yes — optional.** Add a documented Moonshot provider stanza. |
| `plugins/arckit-claude/hooks/provenance-stamp.mjs:74-89` `MODEL_MAX_EFFORT` + `downgradeEffort()` | Effort-downgrade matrix: `claude-opus-4-7`, `-4-6`, `claude-sonnet-4-6`, `claude-haiku-4-5`. **Note: `claude-opus-4-8` is absent** — an unrelated staleness bug. | **No for Kimi (no-op, see §3); yes to fix the missing Opus 4.8 entry while we're here.** |
| `plugins/arckit-claude/hooks/provenance-stamp.mjs:128` `extractModelFromContent()` | Regex captures `[a-z0-9.-]+` from the footer's "AI Model:" line. | **Yes — real bug.** A provider-prefixed id like `moonshotai/kimi-v3` or `moonshot/kimi-v3` contains `/`, which the character class rejects → model silently parsed as `null`. Widen to allow `/` (and `:`). |
| `CLAUDE.md:75` effort-per-model paragraph | Documents Claude-only effort tiers. | Documentation only — add a one-line note that non-Claude targets (incl. Kimi) strip `effort:`. |
| Templates' `**Model**: [AI_MODEL]` footer line | Self-reported by whatever generated the artefact. | No code change — but **fix the canonical Kimi id string** we tell users to expect, so §2 row above and the footer agree. |
| `plugins/arckit-claude/docs/guides/autoresearch.md` (`model:` field) | Autoresearch tries different `model:` values. Runs *inside Claude Code*. | No — Claude models only. |
| `plugins/arckit-claude/.claude-plugin/plugin.json` `userConfig` | Sensitive keys for MCP servers. | Only if we ever add a Kimi-*backed* MCP server. Not needed for model selection. Skip. |

## 3. The effort-matrix trap (why the "obvious" change is a no-op)

`MODEL_MAX_EFFORT` and `downgradeEffort()` exist to mirror the Claude Code harness's silent effort-downgrade when the *active Claude model* doesn't support a requested tier. `provenance-stamp.mjs` is a **Claude Code plugin hook** — it never executes under Codex or OpenCode, and Codex/OpenCode never run Claude models. Two consequences:

1. Adding `'kimi-v3': ...` to `MODEL_MAX_EFFORT` changes nothing at runtime, because the hook that reads it only fires on Claude.
2. Kimi/Moonshot does not use Claude's `low/medium/high/xhigh/max` reasoning-effort concept at all. The converter already **strips `effort:`** from every non-Claude target (per CLAUDE.md). So under Kimi, effort is simply absent — there is nothing to downgrade.

**Decision:** do *not* add Kimi to `MODEL_MAX_EFFORT`. Instead, add the missing `claude-opus-4-8` entry (real fix) and leave a comment stating the matrix is Claude-only by design. This keeps future contributors from "helpfully" adding non-Claude ids.

## 4. Verify before building (Kimi V3 facts to confirm)

Knowledge cutoff is Jan 2026; the Kimi line moves fast. Confirm at implementation time — do not hardcode from memory:

- **Exact model id.** Moonshot's own API uses ids like `kimi-k2-*`; OpenRouter uses `moonshotai/kimi-*`. Confirm whether "V3" ships as `kimi-v3`, `kimi-k3`, or a dated `kimi-k2-*` successor, and both the **native** and **OpenRouter** id strings. This id is what goes in the config *and* what artefacts self-report in the footer — they must match.
- **Provider endpoint + auth.** Moonshot OpenAI-compatible base URL (`.ai` global vs `.cn`) and the API-key env var (expected `MOONSHOT_API_KEY`). Confirm OpenCode and Codex both accept it as a generic OpenAI-compatible provider.
- **Context window & tool-calling.** ArcKit commands are long (templates + citations); confirm the context window is adequate and that function/tool-calling is reliable, since Codex/OpenCode agent roles depend on tool use.
- **Does it self-report a model string at all?** If Kimi won't reliably emit its own id into the `[AI_MODEL]` footer, document a fixed string for users to set, rather than relying on self-report.

## 5. Phased delivery

**Phase 1 — make the code Kimi-safe (no user-facing model change yet).**
- Widen `extractModelFromContent()` regex in `provenance-stamp.mjs` to accept `/` and `:` so provider-prefixed ids parse instead of silently becoming `null`. Add a unit case with `moonshotai/kimi-v3`.
- Add the missing `claude-opus-4-8` row to `MODEL_MAX_EFFORT` and a comment marking the matrix Claude-only.
- No behaviour change for existing users; pure correctness. Shippable on its own.

**Phase 2 — Kimi V3 as a selectable model for OpenCode + Codex.**
- Converter: make the non-Claude agent-role model configurable instead of the bare `mistral-large-2` literal. Introduce a single constant (e.g. `DEFAULT_VIBE_MODEL`) and, per target, allow Kimi. Decide default vs opt-in in §6.
- `generate_codex_config_toml()`: append a **commented** `[model_providers.moonshot]` block + a `kimi` profile, so a Codex user enables Kimi by uncommenting and setting `MOONSHOT_API_KEY`.
- `extensions/arckit-opencode/opencode.json`: add a documented Moonshot provider stanza (commented or behind an env var), consistent with OpenCode's provider schema.
- Regenerate extensions (`python scripts/converter.py`) and run `tests/codex/` to confirm config still parses.

**Phase 3 — documentation + provenance string alignment.**
- `CLAUDE.md`: one line in the effort paragraph clarifying non-Claude targets (Kimi included) strip `effort:`; and a short "Running ArcKit under Kimi V3" note in the Codex/OpenCode sections.
- README.md / docs/index.html: list Kimi V3 among supported non-Claude models if we advertise a model matrix.
- Ensure the canonical Kimi id string used in configs matches what users are told to put in the `[AI_MODEL]` footer.
- CHANGELOG.md entry.

## 6. Open decision — default vs opt-in

The one genuine choice: should the converter **default** the Codex/OpenCode agent roles to Kimi V3, or keep `mistral-large-2` and make Kimi opt-in?

- **Opt-in (recommended):** lowest risk. Existing Codex/OpenCode users are unaffected; Kimi is a documented, one-line switch. Ship this in Phase 2.
- **Default:** stronger signal that ArcKit endorses Kimi, but changes behaviour for every non-Claude user and bets on Kimi V3's tool-calling reliability across all 16 agent roles before we've proven it. Defer until Kimi V3 is validated against a real `arckit init --ai codex` + `/arckit:*` run.

Recommendation: opt-in for Phase 2; revisit default after Phase 2 validation.

## 7. Risks and open questions

- **Kimi self-report reliability.** If artefacts don't carry a trustworthy Kimi id in the footer, provenance stays generic. Mitigation: document a fixed footer string; the widened regex (Phase 1) is still worth it for provider-prefixed ids.
- **Tool-calling parity.** ArcKit agents lean on tool use (Read/Write/Bash/MCP). Kimi V3's function-calling must be solid or the Codex/OpenCode agent roles degrade. Gate any *default* switch (§6) on a live agent run.
- **Provider region split.** Moonshot `.ai` (global) vs `.cn` endpoints and key formats differ. Ship both as documented options; don't hardcode one.
- **`inherit` semantics.** Every ArcKit agent uses `model: inherit`, meaning "use the session model". Under Codex, `inherit` currently forces `mistral-large-2`, which is the opposite of inheriting. Worth deciding whether the Kimi work should also honour a session/global model rather than a per-role literal — larger change, flag but don't scope into Phase 2.
- **This is not a Claude-plugin feature.** Set expectations in docs so users don't try to "run the Claude Code plugin on Kimi" — it can't, by construction.

## 8. Immediate next step

Confirm the Kimi V3 model id(s), Moonshot endpoint, and key env var (§4), then ship **Phase 1** (the regex fix + Opus-4.8 matrix row) as a small standalone PR — it is pure correctness and independent of the Kimi id being finalised. Phase 2 follows once §4 and the §6 default/opt-in decision are settled.
