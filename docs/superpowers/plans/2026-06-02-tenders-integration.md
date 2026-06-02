# Tenders Integration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: superpowers:subagent-driven-development. Steps use checkbox (`- [ ]`) tracking. Folds into PR #558 on `feat/556-tenders-command`.

**Goal:** Make the existing Assurance/build-vs-buy commands consume the `TNDR` evidence, and ship the `/arckit:competitors` sibling — implementing the rest of issue #556's named use cases.

**Approach:** Artefact-driven. Consumers read `projects/{P}/research/ARC-{P}-TNDR-*.md` (or `*-CMPT-*.md`) if present and cite figures with the "awarded value ≠ spend" caveat — no new MCP wiring in consumers (the secure reader boundary is reused). The handoff *suggestion* to run `/arckit:tenders`/`/arckit:competitors` is gated on `governance_framework = UK Gov` so neutral core stays clean; the consume-if-present step is naturally neutral (a non-UK project has no TNDR).

**Reuse (already built in the tenders work):** `arckit-tenders-reader` is shared (focus = `supplier`/`capability`); `tenders-handoff.schema.json` is a superset; `CMPT` doc-type is registered (multi-instance, `research/`). Competitors therefore needs only orchestrator + writer + template + guide.

**Branch:** continue on `feat/556-tenders-command` (folds into #558). Commit after every task. Never `git add -A`; don't stage `.arckit/memory/sessions.md`. Templates/guides use `/arckit.X`; command/agent bodies use `/arckit:X`.

---

## File map

| Path | Action |
|---|---|
| `arckit-claude/templates/vendor-profile-template.md` (+ `.arckit/`) | ✚ Government Award History section |
| `arckit-claude/templates/competitors-template.md` (+ `.arckit/`) | create |
| `arckit-claude/agents/arckit-competitors-writer.md` | create |
| `arckit-claude/commands/competitors.md` | create |
| `arckit-claude/docs/guides/competitors.md` (+ `docs/guides/`) | create |
| `arckit-claude/commands/{risk,sobc}.md` | ✚ TNDR-consume step + `tenders` handoff (regime-gated) |
| `arckit-claude/agents/arckit-research.md` | ✚ TNDR-consume step + handoff |
| `arckit-claude/commands/score.md` | ✚ read award history for Company Experience + `competitors` handoff |
| non-Claude dirs | regenerated via converter |
| README / index.html / DEPENDENCY-MATRIX / MCP-CATALOGUE / CHANGELOGs | competitors command (+1 count → 73), wiring notes |

---

## Task IC1: Government Award History section in vendor-profile-template
**Files:** `arckit-claude/templates/vendor-profile-template.md` (+ `.arckit/templates/` mirror).
- [ ] Add a `## Government Award History` section after `## UK Government Presence` with placeholders for: total awarded value, award count, date range, top buyers, sample notices (each with notice URL), and an incumbency note. Carry the "awarded value is not actual spend" caveat. Populated from tender data by `/arckit:competitors` / `/arckit:research`; `{unknown}` when no tender evidence. `cp` to the `.arckit/` mirror. Lint. Commit.

## Task IC2: competitors-template.md (Competitor Landscape, CMPT)
**Files:** `arckit-claude/templates/competitors-template.md` (+ `.arckit/`).
- [ ] Mirror `tenders-template.md`'s Document Control + footer (command `/arckit.competitors`, title `# Competitor Landscape: [PROJECT_NAME]`). Sections: Executive Summary (focal supplier/capability + freshness line); Competitive Set (table: Rank | Supplier | Awarded value (£) | Awards | Share % | Key buyers); Head-to-Head (focal vs each rival, when supplier-focus); Per-Rival Buyer Relationships & Recent Wins; Concentration ([CONCENTRATION_FLAG] + rule); Representative Notices; Caveats (mandatory blockquote); External References (citations + OGL line); Next Steps (`/arckit.research`, `/arckit.score`, `/arckit.risk`). Disambiguated tokens (no collisions). `cp` mirror. Lint. Commit.

## Task IC3: arckit-competitors-writer.md
**Files:** `arckit-claude/agents/arckit-competitors-writer.md`.
- [ ] Mirror `arckit-tenders-writer.md` (frontmatter `tools: ["Read","Glob","Write","Edit"]`, render-only, field-ownership model). Renders the CMPT artefact from an orchestrator-prepared payload (raw schema fields + derived: `concentration_flag`, `source_health`, `head_to_head`, `key_findings`, `citations`). **Also spawns/enriches** `vendors/{supplier-slug}-profile.md` Government Award History from each rival's award data (mirror datascout-writer's profile-spawn merge rules). Lint. Commit.

## Task IC4: commands/competitors.md orchestrator
**Files:** `arckit-claude/commands/competitors.md`.
- [ ] Mirror `commands/tenders.md`. Inputs: `--supplier 'Name'` (focus=supplier) or capability/`--cpv` (focus=capability). Dispatch the SHARED `arckit-tenders-reader`; validate against `tenders-handoff.schema.json` via `validate-handoff.mjs`. Derived fields: rank rivals by `share_pct`; identify the focal supplier (supplier-focus) and build `head_to_head` (focal vs each rival: value, buyers, recent wins); `concentration_flag`; `source_health`; `citations`; `key_findings`; surface reader `errors[]`/`degraded_sources`. Document ID `ARC-{P}-CMPT-{NNN}` via `generate-document-id.sh ... --next-num {research}`. Dispatch `arckit-competitors-writer`. Handoffs: `research`, `score`, `risk`. check_references + lint. Commit.

## Task IC5: competitors guide
**Files:** `arckit-claude/docs/guides/competitors.md` + `docs/guides/competitors.md`.
- [ ] Mirror the tenders guide pair (with/without Remote-Control section). Cover supplier vs capability focus, the artefact, the vendor-profile enrichment, caveat, handoffs, data source. Lint. Commit.

## Task IW1: wire TNDR into /arckit:risk
**Files:** `arckit-claude/commands/risk.md`.
- [ ] In the risk-identification process, add: "If `projects/{P}/research/ARC-{P}-TNDR-*.md` or `*-CMPT-*.md` exists, read its concentration/incumbency and add a **supplier-concentration / single-supplier-dependency** risk under the Orange Book dependencies category, citing the notice-backed figures with the awarded-value caveat." Add `tenders` to `handoffs:` (description gated/noted for UK-gov procurement). Lint + check_references. Commit.

## Task IW2: wire TNDR into /arckit:sobc
**Files:** `arckit-claude/commands/sobc.md`.
- [ ] In the Economic Case options analysis, add: "If a `TNDR` artefact exists, cite its median award value as **market context / benchmark** for option ROM costs — explicitly NOT the costed figure (awarded value ≠ spend)." Add `tenders` handoff. Lint + check_references. Commit.

## Task IW3: wire TNDR into arckit-research
**Files:** `arckit-claude/agents/arckit-research.md`.
- [ ] In the build-vs-buy / market step, add: "If a `TNDR`/`CMPT` artefact exists, ground the 'buy' market structure, incumbency, and contract values in its notice-backed figures (with the caveat) rather than scraped estimates." Note the `/arckit:tenders` + `/arckit:competitors` inputs in Related commands. Lint. Commit.

## Task IC6: wire award history into /arckit:score
**Files:** `arckit-claude/commands/score.md`.
- [ ] In the vendor-scoring step, add: "If a `vendors/{slug}-profile.md` Government Award History section or a `CMPT` artefact carries the vendor's award record, cite it as evidence for the 'Company Experience' criterion (with the caveat)." Add `competitors` to `handoffs:`. Lint + check_references. Commit.

## Task ID1: converter
- [ ] `python scripts/converter.py`; verify a competitors variant for each non-Claude target (datascout parity); confirm tenders-scoped + competitors-scoped + modified-command changes only. Commit explicit dirs.

## Task ID2: docs
- [ ] README/index.html/DEPENDENCY-MATRIX: add `/arckit:competitors` (count 72 → 73 consistently, all metrics +1); MCP-CATALOGUE: note competitors as a second consumer of the reader; both CHANGELOGs: competitors command + the Assurance wiring. Lint. Commit.

## Task ID3: final sweep
- [ ] All gates: 4 handoff tests, doc-type dual-reg + regime, check_references, markdownlint on changed files. Plugin tag dry-run (stash sessions.md). Final whole-branch review. Push (updates #558).

---

## Spec coverage
Implements issue #556's remaining use cases: SOBC grounding (IW2), evidence-based scoring / Company Experience (IC1/IC3/IC6), incumbency-concentration risk (IW1), research grounding (IW3), and the competitors capability from design spec §8 (IC2–IC5).
