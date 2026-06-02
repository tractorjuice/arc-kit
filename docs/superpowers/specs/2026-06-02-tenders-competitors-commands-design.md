# Tenders + Competitors commands — design

**Status:** Draft for review
**Date:** 2026-06-02
**Author:** Mark Craddock (with Claude)
**Type:** Feature (targets current version `main` / v5.x; clean lift to `arckit-uk` in v6)
**Related:** issue #556 (UK Tenders MCP); govreposcrape precedent #550 / #551

## 1. Problem / context

ArcKit's Assurance and build-vs-buy surface is grounded only in user-uploaded files, model memory, or web-snippet scraping. There is no authoritative, live source in the repo for UK awarded contracts, who-won-what, or incumbency. `govreposcrape` covers government *repositories*; nothing covers government *procurement*.

Issue #556 (from chrisns, the govreposcrape author) proposes wiring the **UK Tenders MCP** in as a market-intelligence evidence source. It indexes ~677k UK contracting processes across all five national portals (Find a Tender, Contracts Finder, Public Contracts Scotland, Sell2Wales, eTendersNI), served verbatim under OGL v3.0 with the official notice URL on every record.

The data unlocks three jobs ArcKit cannot do today:

- **SOBC grounding:** real median award values to anchor an Economic Case option instead of a model-guessed figure.
- **Evidence-based vendor scoring:** turn `/arckit:score`'s unknown "Company Experience" into citable award history.
- **Incumbency / concentration risk (new capability):** "Supplier X holds 62% of awarded value across 8 awards" feeds `/arckit:risk` with single-supplier-dependency analysis.

**Endpoint verified live (2026-06-02):** `https://tenders.run.cns.me/mcp` responds to MCP `initialize` (`serverInfo: uk-tenders-mcp v0.1.0`), exposes 11 tools, all five source feeds report `health: green`, data refreshed the same day, ~677k total release records. Keyless, Streamable-HTTP.

## 2. Decisions (agreed in brainstorming)

1. **Two sibling commands**, not one report with a section and not a datascout add-on:
   - `/arckit:tenders` — buyer/capability-centric **Procurement Market Intelligence** report.
   - `/arckit:competitors` — supplier-centric **Competitor Landscape** report.
2. **One shared, secure reader** (`arckit-tenders-reader`) is the only component that touches the MCP. Both orchestrators dispatch it. This satisfies ArcKit's MCP security doctrine (#442): raw MCP bytes never reach the artefact-writing context.
3. **Three-tier topology** (orchestrator → reader → writer) per command, mirroring `datascout` / `gov-reuse` / `grants`. Reader is shared; orchestrators and writers are per-command.
4. **Sequencing:** ship `/arckit:tenders` first (fastest path to value); `/arckit:competitors` is a fast-follow PR reusing the already-built reader + handoff schema. This spec covers both.
5. **Target the current version (`main` / v5.x) now**, designed for a mechanical lift into the `arckit-uk` overlay during the v6.0.0 release (section 12).
6. **Micro-decisions:** MCP server key `uk-tenders` (tools `mcp__uk-tenders__*`); doc-types `TNDR` = "Procurement Market Intelligence" and `CMPT` = "Competitor Landscape", both `category: Discovery`, `regime: UK`; register `CMPT` in the tenders PR (registry settled once); multi-instance (`ARC-{P}-TNDR-{NNN}-v{V}.md`) like all sibling evidence artefacts (RSCH/DSCT/GOVR/GRNT), supporting multiple markets per project.

## 3. Scope

**In scope:**

- A bundled `uk-tenders` MCP server entry (deferred load) + `allow-mcp-tools.mjs` prefix.
- Shared `arckit-tenders-reader` agent + `tenders-handoff.schema.json`.
- `/arckit:tenders` orchestrator + writer + command + template + `TNDR` doc-type + guide (this PR).
- `/arckit:competitors` orchestrator + writer + command + template + `CMPT` doc-type + guide (fast-follow PR).
- Handoff fixtures + Node test runner; dual-registration; non-Claude propagation; docs.

**Out of scope (explicit):**

- **The neutral `arckit-datascout-reader` is NOT touched.** This is a dedicated command family with its own reader. (This deliberately avoids the core-neutral-agent → UK-overlay-MCP coupling that govreposcrape created via datascout.)
- `query_sql` is **never** allowlisted (documented-only; free-form SQL is too wide an injection surface).
- Auto CPV ↔ G-Cloud-lot mapping (approximate; out of scope — CPV is an explicit optional input).
- The v6 overlay relocation itself (designed-in here, executed during the v6.0.0 release).

## 4. Architecture

Three-tier, shared reader:

```
  /arckit:tenders                              /arckit:competitors
        │                                             │
        ▼                                             ▼
  arckit-tenders (orch)                      arckit-competitors (orch)
        │          └────────────┬───────────────┘          │
        │              arckit-tenders-reader                │
        │           (SHARED; sole MCP caller;               │
        │            MCP: uk-tenders; returns               │
        │            schema-validated handoff)              │
        ▼                                                   ▼
  arckit-tenders-writer                      arckit-competitors-writer
        │                                                   │
        ▼                                                   ▼
   TNDR artefact                                     CMPT artefact
```

- **Reader** (shared): only component with MCP tools. No web tools (the MCP returns the official notice URL on every record, so there is nothing to fetch). Returns one schema-validated JSON handoff.
- **Orchestrator** (per command): dispatches the reader with a `focus`, validates the handoff, computes deterministic derived metrics (top-N share, concentration flag), selects what the artefact needs. Never sees raw MCP bytes. The orchestrator IS the command file (`commands/tenders.md` / `commands/competitors.md`) running in the main thread — there is no separate orchestrator agent, because Claude Code subagents cannot dispatch further subagents (same pattern as `commands/datascout.md`).
- **Writer** (per command): renders the template from the validated, orchestrator-prepared payload. No network/MCP/Agent tools.

### File inventory (core `arckit-claude/`, on `main`)

| File | Tenders PR | Competitors PR |
|---|---|---|
| `.mcp.json` (+ format mirrors) | ✚ `uk-tenders` server (deferred) | reuse |
| `hooks/allow-mcp-tools.mjs` (Claude-only hook) | ✚ `mcp__uk-tenders__` prefix | reuse |
| `schemas/tenders-handoff.schema.json` | ✚ shared (both lenses) | reuse |
| `agents/arckit-tenders-reader.md` | ✚ shared | reuse |
| `agents/arckit-tenders-writer.md` | ✚ | — |
| `agents/arckit-competitors-writer.md` | — | ✚ |
| `commands/tenders.md` / `commands/competitors.md` | ✚ tenders | ✚ competitors |
| `templates/tenders-template.md` (+ `.arckit/templates/` mirror) | ✚ | — |
| `templates/competitors-template.md` (+ `.arckit/templates/` mirror) | — | ✚ |
| `config/doc-types.mjs` (+ format mirrors) + `commands/pages.md` | ✚ `TNDR` + `CMPT` | reuse |
| `docs/guides/tenders.md` / `competitors.md` (+ plugin mirror) | ✚ tenders | ✚ competitors |
| `tests/plugin/fixtures/tenders-handoff/` + Node runner | ✚ | reuse |

## 5. The MCP server

Add to core `arckit-claude/.mcp.json` (deferred — no `alwaysLoad`):

```json
"uk-tenders": {
  "type": "http",
  "url": "https://tenders.run.cns.me/mcp"
}
```

The `.mcp.json` key becomes the tool-name prefix, so tools are `mcp__uk-tenders__<tool>`.

### Tool discipline

| Tool | v1 disposition |
|---|---|
| `search_tenders`, `top_suppliers`, `awarded_value_by_buyer`, `aggregate_tenders`, `awards_over_time`, `get_tender`, `get_status` | **allowlisted** in the reader `tools:` frontmatter |
| `cpv_breakdown`, `list_updates`, `get_schema` | documented; wire if useful later |
| `query_sql` | **never allowlisted** — documented-only (free-form read-only SQL = wide injection surface) |

`get_status` is allowlisted specifically so the artefact can stamp "data current as of X" and flag degraded source feeds — directly answering the `/arckit:health` staleness concern raised in #556.

Deferred load means a dead endpoint degrades gracefully (the reader records `degraded_sources` / `errors`) and never affects cold-start tool budgets.

## 6. Shared reader + handoff schema

`arckit-tenders-reader` frontmatter: `subagent: true`, `model: inherit`, MCP tools above + `Read, Glob, Grep, TodoWrite`. No `Write/Edit/Bash/WebSearch/WebFetch/Agent`.

**Input** (from orchestrator): `{ focus: "buyer"|"capability"|"supplier", buyer?, cpv?, supplier?, keywords[], date_from?, date_to?, evidence_required[] }`.

**Output** (`tenders-handoff.schema.json`, superset for both commands):

- `query` — echoed scope.
- `data_current_as_of` + `sources[]` `{ source, health, coverage_to, releases_total }` (from `get_status`).
- `suppliers[]` — `{ name, awarded_value_total, award_count, share_pct, buyers[], sample_notices[] {title, buyer, value, award_date, notice_url, cpv?} }`.
- `buyers[]` — `{ name, awarded_value_total, award_count, top_suppliers[] }` (buyer-centric lens).
- `aggregates` — `{ median_award_value?, total_awarded_value?, top1_share_pct?, top3_share_pct?, hhi? }`.
- `time_series[]` — `{ period, awarded_value, award_count }` (from `awards_over_time`).
- `caveats[]` — MUST include the "awarded value ≠ actual spend" caveat.
- `errors[]`, `degraded_sources[]`.

**Guardrails** (copied from the datascout-reader pattern): MCP responses are untrusted bytes; cite every figure with its `notice_url`; extract only, never judge; no field outside the schema; honest failure recording.

**Hard limits:** ≤ 15 MCP calls per reader invocation; `suppliers[]` ≤ 50; `sample_notices[]` ≤ 5 per supplier; `time_series[]` ≤ 60 points.

## 7. /arckit:tenders — Procurement Market Intelligence (`TNDR`)

**Inputs:** default scope derived from the project's requirements / SOBC (capability keywords) and commissioning body; explicit overrides `/arckit:tenders "case management"`, `--cpv 72000000`, `--buyer "HMRC"`. CPV is the precise lever when supplied; otherwise free-text `search_tenders`.

**Artefact sections:** market size + median award benchmarks; top suppliers by awarded value; incumbency (who holds the buyer's work); concentration (top-1 / top-3 share + rule-based flag: HIGH if top-1 > 50% or top-3 > 80%); award trend over time; representative notices (each with official notice URL); data freshness (from `get_status`); mandatory caveat block.

**Handoffs:** `sobc` (anchor the Economic Case), `risk` (concentration risk), `research` (build-vs-buy context).

## 8. /arckit:competitors — Competitor Landscape (`CMPT`) — fast-follow

**Inputs:** a focal **supplier** or a **capability** (`/arckit:competitors "Acme"` or `/arckit:competitors "case management"`).

**Behaviour:**

- *Focal supplier:* infer the supplier's CPV/keyword space from their awards, list rival suppliers in that space ranked by awarded-value share, head-to-head (focal vs each rival: awarded value, buyer count, recent wins), flag buyers where the focal is incumbent vs challenged.
- *Focal capability:* rank all suppliers in that space by share; no single focal.

**Artefact sections:** competitive set ranked by share (market-share proxy); per-rival buyer relationships + recent wins + sample notices; head-to-head; concentration of the set; caveats.

**Handoffs:** `research`, `score` (evidence-based "Company Experience"), `risk`.

## 9. Doc-types + dual registration

Add to `arckit-claude/config/doc-types.mjs` (and the 5 format mirrors via converter/sync), under Discovery:

```js
'TNDR': { name: 'Procurement Market Intelligence', category: 'Discovery', regime: 'UK' },
'CMPT': { name: 'Competitor Landscape',            category: 'Discovery', regime: 'UK' },
```

Both MUST also be added to `arckit-claude/commands/pages.md` (the dual-registration CI test fails otherwise). `regime: 'UK'` is correct from day one and pre-positions the v6 grouping. Multi-instance: `TNDR`/`CMPT` are added to `MULTI_INSTANCE_TYPES` + `SUBDIR_MAP` (`'research'`) in `doc-types.mjs` and to the multi-instance / research-subdir lists in `generate-document-id.sh`, so artefacts are sequenced `ARC-{P}-TNDR-{NNN}-v{V}.md` under `research/` (matching DSCT).

## 10. Caveats + attribution

- **Mandatory caveat block** in both templates and enforced in the handoff `caveats[]`: "Awarded value is not actual spend; figures are for market context and benchmarking, not the costed Economic Case."
- **OGL v3.0 attribution:** data is re-published verbatim with the official notice URL on every record. Add attribution wording to `references/citation-instructions.md` and a check to `references/quality-checklist.md` (chrisns offered to supply exact wording in #556).
- Every figure in either artefact cites its `notice_url`.

## 11. Security posture

- The reader is the sole MCP caller; it returns a schema-validated, length-capped handoff via the existing `validate-handoff.mjs` path. Orchestrator and writer never see raw MCP output.
- `allow-mcp-tools.mjs` gains the `mcp__uk-tenders__` prefix so the reader's allowlisted tools auto-approve (parity with govreposcrape). Non-allowlisted tools (e.g. `query_sql`) fall through to the normal permission dialog even if ever invoked.
- Reader frontmatter `tools:` is an allowlist; `query_sql` is absent by construction.

## 12. v6 migration shape (designed-in, mechanical)

The entire tenders family is UK-public-sector-specific, so v6 is a whole-feature lift into `arckit-uk`, not a coupling. The neutral `datascout-reader` is untouched, so there is nothing tangled to unpick.

| `main` (v5.x) | `arckit-uk` (v6.0.0) |
|---|---|
| `arckit-claude/commands/tenders.md` | `arckit-uk/commands/uk-tenders.md` |
| `arckit-claude/commands/competitors.md` | `arckit-uk/commands/uk-competitors.md` |
| `arckit-claude/agents/arckit-tenders*.md` | `arckit-uk/agents/arckit-uk-tenders*.md` |
| `arckit-claude/agents/arckit-competitors*.md` | `arckit-uk/agents/arckit-uk-competitors*.md` |
| `arckit-claude/templates/{tenders,competitors}-template.md` | `arckit-uk/templates/uk-{tenders,competitors}-template.md` |
| `arckit-claude/schemas/tenders-handoff.schema.json` | `arckit-uk/schemas/` |
| `uk-tenders` entry in core `.mcp.json` | `arckit-uk/.mcp.json` (next to govreposcrape) |

**Stays central in v6:** `TNDR`/`CMPT` in `config/doc-types.mjs` (registry is central even in v6) and the `mcp__uk-tenders__` prefix in `hooks/allow-mcp-tools.mjs` (hooks stay in core; same accepted core-hook → overlay-MCP pattern as govreposcrape). Command name renames to `uk-tenders` / `uk-competitors`; handoffs re-point to the new `uk-*` / neutral names; recipes re-point. All find/replace.

## 13. Non-Claude propagation

- `converter.py`: core (`arckit-claude`) is already in `PLUGIN_SOURCES`, so the new commands are picked up automatically; run `python scripts/converter.py` to emit Codex / Gemini / OpenCode / Copilot variants. Agents are Claude-only (inlined for other targets per the existing pattern).
- `.mcp.json` server entry propagates to `arckit-codex/.mcp.json` etc.
- `config/doc-types.mjs` mirrors to the 5 format dirs.
- The reader/writer agents' Claude-only frontmatter (`effort`, `tools`, etc.) is stripped by the converter.

## 14. Tests + CI

- New `tests/plugin/fixtures/tenders-handoff/` (valid + reject fixtures) + a Node runner, mirroring the 3 existing handoff suites. **No network dependence** — fixtures are static; the live endpoint is never called in CI.
- `scripts/tests/test-doc-types-dual-registration.mjs` covers `TNDR` (+ `CMPT`) once added to both registries.
- `scripts/check_references.py`: the new commands' `handoffs[].command` slugs (`sobc`, `risk`, `research`, `score`) all resolve (verified present on `main`); the reader's `${CLAUDE_PLUGIN_ROOT}/schemas/...` path resolves.
- Reader must handle endpoint-down gracefully (populate `degraded_sources`/`errors`, still return valid JSON).

## 15. Docs to update

- `docs/MCP-CATALOGUE.md`: add the `uk-tenders` server + tool rows and consumer cross-reference (chrisns offered to PR these).
- `CONTRIBUTING.md`: an MCP-add checklist (chrisns offered).
- `README.md`, `docs/index.html`, `docs/DEPENDENCY-MATRIX.md`: new command(s).
- `CHANGELOG.md` **and** `arckit-claude/CHANGELOG.md` (both — bump-version.sh stamps only the root).

## 16. Release

Current `main` is v5.8.0. This is a minor feature bump (target v5.9.0) via the standard release flow (`docs/RELEASING.md`). Competitors can land in the same minor if the fast-follow PR is ready, or the next minor. The v6 lift happens later, gated on v6.0.0's own testing.

## 17. Risks / open questions

- **Endpoint availability:** single best-effort Cloud Run, nightly refresh, no SLA, third-party operated. Deferred load + graceful degradation mitigate. Note: this is the **second** bundled MCP operated by the same individual (chrisns) on the same keyless single-Cloud-Run shape as govreposcrape — a modest supplier-concentration consideration for a governance harness. He offered to hand off IaC or let ArcKit own the dependency; at minimum add an uptime/refresh caveat to the catalogue.
- **Schema fit:** procurement market intelligence is a different shape than the data-source / vendor profiles ArcKit already models; the dedicated command + dedicated schema (this design) is what makes it fit cleanly rather than forcing it into datascout.
- **Data caveat:** "awarded value ≠ actual spend" must remain prominent; handled by the mandatory caveat block.
- **CPV approximation:** CPV ↔ capability/G-Cloud-lot mapping is approximate; we lean on free-text search + explicit CPV, and say so in the artefact.

## 18. Acceptance criteria

- `/arckit:tenders` builds; dispatches `arckit-tenders-reader`; reader returns a handoff that validates against `tenders-handoff.schema.json`; orchestrator/writer never receive raw MCP bytes.
- `uk-tenders` is registered deferred in `.mcp.json`; `allow-mcp-tools.mjs` carries the prefix; `query_sql` is not in any agent allowlist.
- `TNDR` (+ `CMPT`) registered in both `doc-types.mjs` and `pages.md`; dual-registration + `check_references` + handoff-fixture tests pass.
- `converter.py` emits the new command(s) for all non-Claude formats.
- The mandatory "awarded value ≠ spend" caveat appears in the artefact; figures cite notice URLs; data-freshness stamped from `get_status`.
- `docs/MCP-CATALOGUE.md` updated.
- Reader handles a down endpoint without crashing the command.

## 19. Work breakdown

**Tenders PR (this release):** `.mcp.json` + mirrors → `allow-mcp-tools.mjs` + mirrors → `tenders-handoff.schema.json` → `arckit-tenders-reader` → `arckit-tenders` + writer → `commands/tenders.md` → `templates/tenders-template.md` + `.arckit` mirror → `doc-types.mjs` (`TNDR` + `CMPT`) + `pages.md` + mirrors → `docs/guides/tenders.md` → fixtures + runner → `references/` caveat + attribution → `MCP-CATALOGUE.md` + `CONTRIBUTING.md` → converter → README/index/DEPENDENCY-MATRIX/CHANGELOGs.

**Competitors PR (fast-follow):** `arckit-competitors` + writer → `commands/competitors.md` → `templates/competitors-template.md` + mirror → `docs/guides/competitors.md` → converter → docs. (Reuses server, hook, reader, schema, `CMPT` doc-type.)
