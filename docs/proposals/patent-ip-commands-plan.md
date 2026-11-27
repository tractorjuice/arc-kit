# Design Plan: ArcKit Patent / IP Governance Commands

**Status:** Proposal (design only — no implementation yet)
**Branch:** `claude/patent-command-design-GiKu9`
**Author:** ArcKit
**Date:** 2026-06-03

---

## 1. Summary

Add a family of **three patent / IP intelligence commands** to ArcKit, modelled on the
existing research-heavy, MCP-backed commands (`/arckit.tenders`, `/arckit.gov-reuse`).
They bring intellectual-property evidence into the enterprise-architecture governance
value chain so that build-vs-buy, risk, and decision artefacts can account for patent
encumbrance and freedom-to-operate (FTO) exposure — **with explicit awareness of the
Unified Patent Court (UPC) regime that has governed European patent enforcement since
1 June 2023**.

The closest existing analogue is **`/arckit.tenders`**: it answers "what's the market,
who are the incumbents, how concentrated, what's the risk." The patent commands answer
the same shape of question for IP.

### Decisions locked in

- **Packaging:** ship as a **separate `arckit-patents` plugin** (a new overlay in the
  marketplace), not as part of core `arckit`. Install only if you need IP intelligence.
- **Backend:** ArcKit-hosted MCP gateway (mirrors `uk-tenders` / `govreposcrape`), wrapping
  free structured patent APIs **plus the UPC / European Patent Register opt-out data**.
- **Framing:** three **separate** commands, each with its own artefact type — not one
  command with a `--mode` flag.
- **Posture:** recommend-don't-decide; every artefact carries a non-legal-advice caveat.

## 1a. Packaging — a self-contained overlay plugin (architectural note)

This is the **first overlay that needs its own agents, schemas, and MCP server**. Every
existing overlay (`arckit-uae`, `arckit-uk-finance`, `arckit-au-energy`, …) is *minimal* —
it ships only `commands/`, `recipes/`, `references/`, `templates/`, and reaches into core
`arckit-claude` (via `${CLAUDE_PLUGIN_ROOT}` and the `dependencies` pin) for scripts,
rendering partials, agents, schemas, and MCP servers. **Today, agents / schemas / MCP live
only in core.** The three-tier reader/writer pattern needs all three, so "separate plugin"
forces a choice:

| Option | What ships where | Pros | Cons |
|---|---|---|---|
| **A. Self-contained (recommended)** | `arckit-patents` ships its own `commands/`, `agents/`, `schemas/`, `templates/`, `recipes/`, and **its own `.mcp.json`** with the `arckit-patents` MCP server | Truly independent; core stays lean; nobody who skips it pays for a niche IP MCP server; clean uninstall | First overlay to carry agents/schemas/MCP → **converter must be taught to discover them outside core**; sets a new precedent |
| **B. Hybrid** | Commands + templates in `arckit-patents` overlay; agents + schemas + MCP added to core `arckit-claude/` | Zero convention change; follows existing overlay pattern exactly | Defeats the point of a separate plugin — core gains a niche IP MCP + 4 agents everyone carries; not a clean uninstall |

**Recommendation: Option A.** The whole reason to separate the plugin is to keep core lean
and make IP intelligence opt-in; Hybrid would re-bloat core. Option A's only real cost is a
one-time **converter change** (teach `scripts/converter.py` to discover `agents/` + `schemas/`
from this plugin, not just `arckit-claude`) — a worthwhile, reusable improvement that unlocks
self-contained overlays generally.

The plugin declares a hard dependency on core for shared **scripts** (`create-project.sh`,
`generate-document-id.sh`, `validate-handoff.mjs`) and rendering/citation partials, exactly
as other overlays do:

```json
{
  "name": "arckit-patents",
  "version": "<tracks plugin version>",
  "defaultEnabled": false,
  "description": "Patent / IP intelligence overlay for ArcKit — 3 commands: prior-art landscape, freedom-to-operate (UPC-aware), and patentability/novelty. Ships the arckit-patents MCP gateway (EPO OPS / European Patent Register incl. UPC opt-out, PatentsView, Lens). Requires arckit core plugin. EXPERIMENTAL — community-maintained.",
  "dependencies": [{ "name": "arckit", "version": "=<core version>" }]
}
```

## 2. The three commands

| Command | Doc type | Question it answers | Primary handoffs |
|---|---|---|---|
| `/arckit.patents` | `PATS` | *Prior-art landscape* — who owns the IP in this technology area, how concentrated is ownership, citation influence | `research`, `sobc`, `adr` |
| `/arckit.fto` | `FTO` | *Freedom-to-operate / risk* — which live patents could block or expose this project; UPC enforcement reach; licensing / IP-concentration risk | `risk`, `adr`, `sobc` |
| `/arckit.patentability` | `PNOV` | *Patentability / novelty* — is our own innovation novel vs the closest prior art | `adr`, `research` |

Separate commands sharing one backend and one reader keeps them DRY without collapsing
genuinely different artefacts, rubrics, audiences, and handoffs into one.

## 3. Shared infrastructure (built once, inside the `arckit-patents` plugin)

> Under **Option A**, all of the following ship in the new `arckit-patents/` plugin
> directory — `agents/`, `schemas/`, `templates/`, and its own `.mcp.json` — not in core
> `arckit-claude/`. Shared *scripts* and rendering/citation *partials* are still consumed
> from core via the dependency pin.

### 3.1 MCP gateway — `arckit-patents` server

A thin hosted gateway (same shape as `tenders.run.cns.me` / `govreposcrape` run.app
services), registered in the plugin's own **`arckit-patents/.mcp.json`**. **Recommendation: fork an existing
OSS server** ([`JIBSN/epo-ops-mcp-server`](https://github.com/JIBSN/epo-ops-mcp-server) or
PyPI [`patent-mcp-server`](https://pypi.org/project/patent-mcp-server/)) rather than build
from scratch.

**Data sources behind it (all free):**

- **EPO OPS / European Patent Register** — global via INPADOC families + legal status,
  **and UPC opt-out status**. *Primary source for any European / FTO work.*
- **UPC opt-out register** — authoritative opt-out lookups (the European Patent Register
  now surfaces this).
- **PatentsView** (USPTO, structured) — best for US assignee / citation aggregates.
  **US-only — enrichment, not the primary source for European FTO.**
- **Lens.org** (140M records) — cross-jurisdiction citation graph, fallback/enrichment.

**Tools to expose** (verb-set mirrors `/arckit.tenders` so the reader pattern transfers):

| Tool | Purpose | Used by |
|---|---|---|
| `search_patents` | keyword / CPC-IPC / assignee / date-range query → patent hits | all three |
| `top_assignees` | rank assignees by patent count in a query space (concentration) | patents, fto |
| `patent_family` | INPADOC family + jurisdiction coverage for one patent | fto |
| `legal_status` | live/lapsed/expired/granted-vs-application **+ `patent_type`, `unitary_effect`, `upc_opt_out`(+date)** | fto |
| `citations` | forward/backward citation counts (influence) | patents, patentability |
| `get_patent` | full bibliographic record + abstract + claims-count | all three |
| `get_status` | health/freshness probe | all three |

**Hosting/auth note:** EPO OPS needs free OAuth credentials held server-side, so the
plugin stays zero-config (no `userConfig` key). This MCP gateway (incl. the UPC/register
data source) is the **single hard infra dependency** on the critical path.

### 3.2 Shared reader — `agents/arckit-patents-reader.md`

One reader serves all three commands (different query inputs, same extraction contract).

```yaml
---
name: arckit-patents-reader
subagent: true
maxTurns: 30
tools: ["Read","Glob","Grep","TodoWrite",
  "mcp__plugin_arckit_patents__search_patents",
  "mcp__plugin_arckit_patents__top_assignees",
  "mcp__plugin_arckit_patents__patent_family",
  "mcp__plugin_arckit_patents__legal_status",
  "mcp__plugin_arckit_patents__citations",
  "mcp__plugin_arckit_patents__get_patent",
  "mcp__plugin_arckit_patents__get_status"]
effort: high
description: Reader subagent for the ArcKit patent commands. Queries the arckit-patents MCP and extracts factual patent evidence (patents, assignees, families, legal status incl. UPC opt-out, citations) for one query scope. Returns JSON conforming to patents-handoff.schema.json.
model: inherit
---
```

- **Input:** `mode` (landscape|fto|patentability), `search_queries[]`, `cpc_ipc_codes[]`,
  `assignee_filter`, `date_from/date_to`, `invention_description` (patentability only),
  `evidence_fields_required`.
- **Output:** single JSON object — **no score, no ranking, no judgment**
  (per `arckit-claude/agents/READER-PATTERN.md`).
- **Hard limits:** ≤15 MCP calls, ≤50 patents, ≤5 sample claims per patent.

### 3.3 Shared schema — `schemas/patents-handoff.schema.json`

JSON Schema 2020-12, superset payload so all three modes validate against it:

```text
{
  query, mode,
  patents[]:   { patent_id, title, assignees[], assignee_country,
                 filing_date, grant_date,
                 legal_status (enum: granted|pending|lapsed|expired|withdrawn|unknown),
                 patent_type (enum: unitary|classical-EP|national|other),
                 unitary_effect (bool),
                 upc_opt_out (enum: true|false|unknown), upc_opt_out_date,
                 upc_reachable (bool, derived),
                 jurisdictions[], family_id, family_size, cpc_codes[],
                 fwd_citations, bwd_citations, abstract, claims_count,
                 independent_claims, fetched_from_url, citation_id, confidence },
  assignees[]: { name, country, patent_count, unitary_count, share_pct, sample_patent_ids[] },
  aggregates:  { total_patents, granted_count, live_count, unitary_count, median_family_size },
  caveats[], degraded_sources[], errors[], unfetched_urls[], data_current_as_of
}
```

Enums are allowlists (reader cannot invent values). `validate-handoff.mjs` reused unchanged.
`upc_reachable` is derived: `unitary_effect OR (patent_type == classical-EP AND upc_opt_out != true)`.

## 4. Per-command specifications

### 4.1 `/arckit.patents` — Prior-art landscape

**Orchestrator frontmatter:**

```yaml
---
description: Patent landscape intelligence — IP ownership concentration, top assignees, citation influence, from the ArcKit Patents MCP
argument-hint: "[project-number-or-name] <capability | --cpc H04L | --assignee 'Name'>"
tags: [patents, ip, landscape, prior-art, concentration, build-vs-buy]
effort: high
keep-coding-instructions: true
handoffs:
  - command: research
    description: Feed IP landscape into build-vs-buy analysis
  - command: sobc
    description: Note IP-encumbrance affecting the Economic Case
  - command: adr
    description: Record an IP-strategy decision
---
```

**Rubric** `patents-landscape-{generic,uk-gov}.yaml` — scores each patent's landscape
relevance: relevance_fit 35%, citation_influence 25%, family_breadth 20%, recency 10%,
assignee_significance 10%. Orchestrator computes an **IP-concentration flag** like tenders
(HIGH if top-1 assignee > 50% or top-3 > 80%) and **flags Unitary Patents separately**,
since a single UP concentrates pan-EU control more than a national bundle of equal count.

**Writer/template** `PATS`: Exec summary, Top Assignees table (rank/name/count/share%/key
patents, with a unitary-patent column), IP-Concentration section, Citation-Influence
leaders, Technology-cluster breakdown (by CPC), Representative patents, gaps,
External References.

### 4.2 `/arckit.fto` — Freedom-to-operate / risk (UPC-aware)

**Orchestrator frontmatter** (`effort: max`, risk-weighted handoffs):

```yaml
handoffs:
  - command: risk        # IP-infringement & single-licensor-dependency risk
  - command: adr         # record FTO / licensing decision
  - command: sobc        # licensing cost into Economic Case
```

**Rubric** `fto-{generic,uk-gov}.yaml` — scores **threat per patent** with UPC-aware reach:

- `claim_overlap_with_capability` 30%
- `legal_status_live` 25% (granted + in-force highest; lapsed/expired ≈ 0)
- **`enforcement_reach` 25%** — Unitary Patent (cannot be opted out) = max; classical EP
  *not* opted-out with EU-domiciled deployment (long-arm exposure) = high; opted-out
  classical EP = medium / national-only; lapsed/expired = ≈ 0
- `assignee_litigiousness / NPE_flag` 10%
- `provisional_injunction_exposure` 10% (UPC speed / PI track record of the likely division)

Bands → **Blocking / Watch / Clear**. **Floor rule:** a not-opted-out Unitary Patent with
material claim overlap floors at **Blocking**.

**Writer/template** `FTO`: per-patent **threat cards** including a **"UPC Exposure"**
sub-section — patent type (unitary / classical), opt-out status + date, UPC vs national
forum, long-arm / pan-EU injunction risk, bifurcation / injunction-gap note. Mitigation
column includes design-around, licence, **monitor/track opt-out status**, and **central
revocation action at the UPC**. Plus a **Risk-register feed table** ready for `/arckit.risk`.

### 4.3 `/arckit.patentability` — Novelty assessment

Diverges most (advisory; invention-in → prior-art-out). Input is an **invention
description** (free text, or auto-pulled from requirements / ADRs with override).

**Rubric** `patentability.yaml` — scores each prior-art hit's **novelty threat to our
invention**: feature_overlap, claim_proximity, publication_date_precedence. Aggregates to
a **novelty / obviousness picture** (not a binary yes/no).

**Writer/template** `PNOV`: invention summary, closest-prior-art table (ranked by threat),
novelty gap analysis, obviousness considerations, recommended next step (file / refine /
abandon-novelty-claim), strong caveat.

## 5. Why the UPC regime shapes this design

Since 1 June 2023 the [Unified Patent Court](https://www.unifiedpatentcourt.org/en/registry/opt-out)
has **exclusive jurisdiction over infringement and validity** of Unitary Patents and
non-opted-out classical European patents across 18 member states. CJEU
[*BSH v Electrolux*](https://www.quinnemanuel.com/the-firm/publications/client-alert-the-cjeu-s-bsh-hausgerate-decision-and-the-upc-s-long-arm-jurisdiction-over-foreign-patents/)
(Feb 2025), now applied in
[*Dyson v Dreame*](https://www.pinsentmasons.com/out-law/news/upc-reach-broadest-long-arm-injunction),
gives the UPC **long-arm reach** to enjoin even in non-UPC states (Spain, UK, Switzerland)
when the defendant is EU-domiciled. The practical consequences a freedom-to-operate
analysis must encode:

1. **Blast radius ≠ geography of validation.** One Unitary Patent is a single enforceable
   right across 18 states with **one injunction**; "jurisdiction overlap" in the old
   national-bundle sense is obsolete.
2. **Opt-out status is a first-class FTO fact.** Opted-out classical EP → national courts
   only; not opted-out → UPC central revocation *and* pan-EU injunction exposure; a Unitary
   Patent **cannot be opted out** ([D Young](https://www.dyoung.com/en/knowledgebank/faqs-and-guides/faq-upc-opt-out)).
3. **Provisional injunctions are fast and broad**, and German divisions can **bifurcate**
   infringement from validity → an "injunction gap" (enjoined before validity is tested) —
   raises the severity of a Blocking finding.
4. **Transitional dual-jurisdiction until ≥2030** ([Plesner](https://plesner.com/en/transitional-period-and-opt-out))
   — non-opted-out classical EPs are litigable in both national courts and the UPC.
5. **PatentsView is US-only** — EU/UPC FTO must lead with **EPO OPS / European Patent
   Register + UPC opt-out register**.

## 6. Governance posture (mandatory caveats)

Every artefact carries a non-legal-advice banner — the analogue of tenders'
"awarded value ≠ spend":

> *This is automated patent intelligence for architecture governance, **not** a formal
> freedom-to-operate clearance, patentability opinion, or legal advice. UPC jurisdiction
> and opt-out status are dynamic (opt-outs can be withdrawn; long-arm case law is evolving
> rapidly — BSH 2025, Dyson v Dreame). Verify current register status and forum strategy
> with qualified EU patent counsel before any filing, build, or procurement decision.*

Commands stay recommend-don't-decide: artefacts ship `DRAFT` until an accountable owner
signs off. Citation discipline enforced — every figure traces
`citation_id → patent_id → fetched_from_url`.

## 7. Build order (phased)

1. **Phase 0 — MCP gateway** (critical path, infra): fork OSS server; wire EPO OPS /
   European Patent Register (incl. UPC opt-out), PatentsView, Lens; deploy. *Everything
   else blocks on this.*
2. **Phase 0.5 — scaffold plugin + teach the converter** (Option A enabler): create the
   `arckit-patents/` plugin dir + `.claude-plugin/plugin.json` (dep-pinned to core) +
   `.mcp.json`; add `arckit-patents` to `PLUGIN_SOURCES`; **extend `scripts/converter.py`
   to discover `agents/` + `schemas/` from a non-core plugin** (today it reads them only
   from `arckit-claude`). One-time, reusable.
3. **Phase 1 — shared core (in plugin):** schema + reader + `validate-handoff` wiring
   (validator consumed from core); smoke-test reader → JSON.
4. **Phase 2 — `/arckit.patents`** (landscape) end-to-end. Closest to tenders → lowest
   risk, ships first.
5. **Phase 3 — `/arckit.fto`** — adds `legal_status` / `patent_family` reliance, UPC
   opt-out fields, reworked rubric, UPC-exposure template section, risk handoff.
6. **Phase 4 — `/arckit.patentability`** — the advisory diverger.
7. **Phase 5 — converter run + docs + version bump + CHANGELOG**, then PR.

## 8. New-file inventory (~22 files, mostly under `arckit-patents/`)

```text
arckit-patents/.claude-plugin/plugin.json                          (1)
arckit-patents/.mcp.json                                           (1)
arckit-patents/commands/{patents,fto,patentability}.md             (3)
arckit-patents/agents/arckit-patents-reader.md                     (1, shared)
arckit-patents/agents/arckit-{patents,fto,patentability}-writer.md (3)
arckit-patents/schemas/patents-handoff.schema.json                 (1, shared)
arckit-patents/schemas/scoring-rubrics/
   patents-landscape-{generic,uk-gov}.yaml                         (2)
   fto-{generic,uk-gov}.yaml                                       (2)
   patentability.yaml                                              (1)
arckit-patents/templates/{patents,fto,patentability}-template.md   (3) + .arckit copies (3)
arckit-patents/recipes/patents.yaml                                (1)
arckit-patents/{README.md,CHANGELOG.md,VERSION}                    (3)
docs/guides/{patents,fto,patentability}.md                         (3)
```

**Edits to existing files (adding the plugin to the marketplace + tooling):**

- `.claude-plugin/marketplace.json` — new `arckit-patents` entry
- `scripts/converter.py` — add to `PLUGIN_SOURCES`; **+ discover agents/schemas outside core** (Phase 0.5)
- `CLAUDE.md` — overlay count (8 → 9 community overlays) + plugin list + the
  "overlays are minimal / core-only for agents+MCP" statement (now has an exception)
- `README.md` — plugin count (8 → 9 install options; 11 → 12 total) + dependency note
- `docs/index.html` — meta description + overlay badges
- `docs/DEPENDENCY-MATRIX.md`, CHANGELOG
- The plugin owns its own doc-types (`PATS`, `FTO`, `PNOV`) — confirm whether doc-types
  config must be core-registered or can be plugin-local (open question 4 below)

> **Note:** core command count stays **73** — the three new commands live in the overlay,
> so this does *not* bump the core total.

## 9. Open questions before Phase 0

1. **Packaging confirm** — proceed with **Option A (self-contained plugin)**? It needs the
   one-time converter change in Phase 0.5. Fallback is Option B (hybrid; agents+MCP in core).
2. **MCP hosting** — is there a deploy slot (run.app / run.cns.me) for the patents gateway,
   and free EPO OPS OAuth credentials? Hard blocker for Phase 0.
3. **One shared reader vs three** — planned as **one** (DRY). Could split FTO's
   legal-status/UPC path into its own reader if hard isolation is wanted.
4. **Doc-types registration** — can `PATS`/`FTO`/`PNOV` be declared plugin-local, or must
   they be registered in the core `doc-types` config? (Affects whether Option A is fully
   self-contained or still needs a one-line core edit.)
5. **Patentability input** — auto-pull invention text from requirements / ADRs, or require
   the user to pass a description? (Default: auto-pull with override.)

---

**Generated by:** design session on `claude/patent-command-design-GiKu9`
**Scope:** design proposal only — no command implementation has been written yet.
