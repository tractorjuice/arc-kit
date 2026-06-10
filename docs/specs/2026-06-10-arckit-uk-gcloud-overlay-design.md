# Design: `arckit-uk-gcloud` overlay (bid-authoring core)

**Date:** 2026-06-10
**Status:** Draft — pending user review
**Author:** Mark Craddock (via Claude)
**ArcKit version at time of writing:** 5.12.1

## 1. Summary

A new ArcKit community overlay, **`arckit-uk-gcloud`**, that brings the
supplier-side (bid-authoring) capability of the standalone
[`gcloud-kit`](https://github.com/tractorjuice/gcloud-kit) plugin into ArcKit as
a properly-composing overlay.

ArcKit today is overwhelmingly **buyer-side** architecture governance (it helps a
public-sector buyer specify, procure, and govern). gcloud-kit is the mirror image:
it drives a **supplier** from a blank repository to a submitted G-Cloud 14 bid on
the UK Digital Marketplace. This overlay fills a capability ArcKit does not have —
"ArcKit governs the buyer; this overlay helps the supplier win the work."

This spec covers the **bid-authoring core** plus a dedicated supplier-side
competitor command (`/arckit:gcloud-competitors`). The data-heavy market/sales
intelligence layer (`sales`, `marketplace-data`, `customer`, `targets`,
`marketing`, `tenders` + the 3 CSV datasets and the `marketplace` MCP) is
**deferred to a second spec** because it overlaps ArcKit's existing
`/arckit:tenders` and `/arckit:competitors` and needs a reconciliation pass.

## 2. Goals & non-goals

### Goals

- Ship the genuinely-new supplier bid-authoring commands as an ArcKit overlay.
- Reuse ArcKit core for everything core already does (init, customize, diagram,
  dpia, pages, presentation, plan, health, story, research, traceability).
- Adopt ArcKit's `projects/` + `ARC-` ID artefact model so health/navigator/
  graph-report/pages/provenance/converter all work natively.
- Follow the established sector-overlay convention (as used by
  `arckit-uk-finance` and `arckit-uk-nhs`): requires `arckit` core,
  `defaultEnabled: false`, converted to all 5 non-Claude formats.

### Non-goals (this spec)

- The market/sales intelligence layer and its CSV datasets (deferred).
- The bundled `uk-tenders` MCP and tenders reader/writer reconciliation
  (ArcKit already bundles `uk-tenders`; reconciliation lands with the
  market-intel spec).
- Any change to ArcKit core buyer-side commands.

## 3. Approach (chosen)

**Option A — composing community overlay** (chosen). Drop the gcloud-kit commands
that ArcKit core already provides, port the unique supplier-bid commands into
ArcKit's `projects/` + `ARC-` model, register new doc-types, run through
`converter.py`. Highest integration quality; consistent with existing sector
overlays.

**Option B — near-whole self-contained port** (rejected). Lift gcloud-kit in
mostly as-is. Faster but duplicates init/pages/diagram and carries a second
artefact model (`services/` vs `projects/`) — convention drift.

## 4. Command set

gcloud-kit ships 26 commands. After dropping what ArcKit core already does and
deferring the market-intel layer, the overlay ships **11 commands**: 10 that emit
a registered doc-type plus 1 packaging action.

| New command | Output | Doc-type | Location |
|---|---|---|---|
| `/arckit:supplier-profile` | Reusable supplier profile | `SUPP` | `projects/000-global/supplier/` |
| `/arckit:service-design` | Per-service offering design | `SVCD` | `projects/{NNN}-service/` |
| `/arckit:sdd-lot1` | Service Definition Document (Cloud Hosting) | `SDD` (lot 1) | `projects/{NNN}-service/` |
| `/arckit:sdd-lot2` | Service Definition Document (Cloud Software) | `SDD` (lot 2) | `projects/{NNN}-service/` |
| `/arckit:sdd-lot3` | Service Definition Document (Cloud Support) | `SDD` (lot 3) | `projects/{NNN}-service/` |
| `/arckit:declaration` | Supplier declaration | `DECL` | `projects/000-global/supplier/` |
| `/arckit:pricing` | G-Cloud pricing document | `PRIC` | `projects/{NNN}-service/` |
| `/arckit:security` | NCSC Cloud Security Principles assertions | `SECA` | `projects/{NNN}-service/` |
| `/arckit:gcloud-competitors` | Supplier-side service benchmark vs Digital Marketplace rivals | `GCMP` | `projects/{NNN}-service/` |
| `/arckit:review` | Submission completeness report | `GCRV` | `projects/{NNN}-service/` |
| `/arckit:submission-pack` | Bundle service docs for CCS | *(export action)* | `projects/{NNN}-service/submission/` |

**Reused from ArcKit core (not ported):** `init`, `customize`, `diagram`,
`dpia`, `pages`, `presentation`, `plan`, `health`, `story`, `research`,
`traceability`. gcloud-kit's `plan`/`health`/`story` are close enough to the core
versions to reuse rather than duplicate.

**Deferred to the market-intel spec:** `sales`, `marketplace-data`, `customer`,
`targets`, `marketing`, `tenders` + the 3 CSV datasets, plus the `marketplace`
"Marketplace Data Extractor" MCP that powers `gcloud-competitors`' richer
data path (see §4a).

### 4a. `/arckit:gcloud-competitors` (dedicated supplier-side benchmark)

This is the **supplier-side** competitor command and is deliberately distinct
from ArcKit core's buyer-side `/arckit:competitors`:

- **`/arckit:competitors` (core, `CMPT`)** — a *market landscape*: rival suppliers,
  awarded-value market share, concentration, built from the `uk-tenders` MCP.
- **`/arckit:gcloud-competitors` (overlay, `GCMP`)** — benchmarks *the supplier's
  own listed service* against rivals on the Digital Marketplace: feature, pricing,
  certification and support comparison tables, SWOT, a positioning quadrant, and
  search-keyword/pricing recommendations to improve the listing.

**Data path (no new dependency in this spec):**

1. **Primary — WebSearch** against
   `applytosupply.digitalmarketplace.service.gov.uk` + WebFetch on rival service
   URLs (gcloud-kit `compare` Option B). No MCP required.
2. **Award-evidence enrichment (optional)** — if core `/arckit:tenders` (`TNDR`)
   or `/arckit:competitors` (`CMPT`) artefacts exist in the repo, read them to
   back the benchmark with real award counts/values and cite their notice URLs.
   Quote figures with their existing citations; carry the **awarded value ≠
   actual spend** caveat.
3. **Future enhancement (deferred)** — gcloud-kit `compare` Option A uses a
   `marketplace` Marketplace Data Extractor MCP (`mcp__marketplace__*`) for
   structured search/extract/compare. That MCP ships with the market-intel spec;
   `gcloud-competitors` will prefer it when present and fall back to WebSearch.

### Command naming note

The new commands are namespaced `/arckit:*` (the overlay extends the core
namespace, consistent with how `arckit-uk-finance` ships `/arckit:uk-fs-*`).
Bid commands carry **no prefix** where the verb is an unambiguous supplier-side
action (`supplier-profile`, `declaration`, `pricing`, `security`, `review`, …) —
matching gcloud-kit's bare names. A **`gcloud-` prefix is used only where the bare
name would collide with or be confused for an existing core command**: hence
`/arckit:gcloud-competitors` (vs core buyer-side `/arckit:competitors`). This
mixed convention is intentional: prefix for disambiguation, bare otherwise.

## 5. Artefact model

- **Service = project.** Each G-Cloud service is its own ArcKit project,
  `projects/{NNN}-service-name/`, holding that service's `ARC-NNN-SVCD`,
  `ARC-NNN-SDD`, `ARC-NNN-PRIC`, `ARC-NNN-SECA`, `ARC-NNN-GCMP`, `ARC-NNN-GCRV` —
  all single-instance per project. "Many SDDs" falls out naturally as many projects.
  Per-service composition with `/arckit:diagram`, `/arckit:dpia`,
  `/arckit:research` works for free.
- **Supplier-wide docs** live in `projects/000-global/supplier/` as
  `ARC-000-SUPP` and `ARC-000-DECL`, reusing the existing reserved global project
  but namespaced in a `supplier/` subfolder so they stay clearly separate from
  governance artefacts (e.g. `ARC-000-PRIN` principles). No new reserved project
  number is introduced.
- **Document Control + provenance.** Every artefact gets the standard ArcKit
  Document Control table + Revision History, and the auto `## Build Provenance`
  block from `provenance-stamp.mjs`.
- **SDD lot** is recorded as a metadata field on the SDD doc (one `SDD`
  doc-type across all three lot commands).

## 6. Doc-type registration

8 new codes, registered in **both** `plugins/arckit-claude/config/doc-types.mjs`
**and** `plugins/arckit-claude/commands/pages.md` (dual-registration is
CI-enforced — omission silently drops artefacts from the dashboard).

| Code | Name | Category | Regime | Severity |
|---|---|---|---|---|
| `SUPP` | Supplier Profile | Procurement | UK | — |
| `SVCD` | Service Design | Procurement | UK | — |
| `SDD` | Service Definition Document | Procurement | UK | HIGH |
| `DECL` | Supplier Declaration | Procurement | UK | HIGH |
| `PRIC` | Pricing Document | Procurement | UK | — |
| `SECA` | Security Assertions (NCSC Cloud Security Principles) | Procurement | UK | HIGH |
| `GCMP` | G-Cloud Competitor Benchmark | Procurement | UK | — |
| `GCRV` | G-Cloud Submission Review | Procurement | UK | — |

- No collision with existing buyer-side codes `GCLD` (G-Cloud Search) / `GCLC`
  (G-Cloud Clarifications). `GCMP` (supplier-side service benchmark) is also
  distinct from `CMPT` (buyer-side market landscape) — different command,
  different artefact, different data source.
- `SECA` is deliberately distinct from `SECD` (Secure by Design — a buyer-side
  governance artefact). G-Cloud security assertions are a different, supplier-side
  evidence document.
- `SDD`/`DECL`/`SECA` are `severity: HIGH` (mandatory submission gates → counted
  in the `/arckit:graph-report` Compliance Readiness scorecard, per-regime).
- `submission-pack` produces an export folder + manifest (like `/arckit:framework`),
  so it gets **no doc-type**.
- `scripts/bash/generate-document-id.sh` `MULTI_INSTANCE_TYPES` is **not**
  changed — all 8 new types are single-instance per project.

## 7. Source mapping (provenance trail)

Every overlay file is ported from a specific gcloud-kit source file. "Port" =
keep the domain content, re-wrap the scaffolding in ArcKit conventions.

### Commands

| Overlay command | gcloud-kit source | Lines (src) | Port work |
|---|---|---|---|
| `supplier-profile.md` | `plugin/commands/supplier-profile.md` | 156 | Re-wrap path/output; write to `000-global/supplier/`; Document Control |
| `service-design.md` | `plugin/commands/service-design.md` | 225 | `create-project.sh` for service project; ARC-ID output |
| `sdd-lot1.md` | `plugin/commands/sdd-lot1.md` | 166 | ARC-ID output; lot metadata; citation traceability |
| `sdd-lot2.md` | `plugin/commands/sdd-lot2.md` | 227 | as sdd-lot1 |
| `sdd-lot3.md` | `plugin/commands/sdd-lot3.md` | 198 | as sdd-lot1 |
| `declaration.md` | `plugin/commands/declaration.md` | 184 | Write to `000-global/supplier/`; ARC-000-DECL |
| `pricing.md` | `plugin/commands/pricing.md` | 204 | ARC-ID output; Document Control |
| `security.md` | `plugin/commands/security.md` | 224 | ARC-ID output; NCSC mapping retained verbatim |
| `gcloud-competitors.md` | `plugin/commands/compare.md` | 240 | Rename to gcloud-competitors; emit `GCMP`; WebSearch-primary data path; drop `marketplace` MCP path (deferred); read core `TNDR`/`CMPT` for award evidence; ARC-ID output |
| `review.md` | `plugin/commands/review.md` | 249 | Emit `GCRV` report; reference ARC-IDs |
| `submission-pack.md` | `plugin/commands/submission-pack.md` | 239 | Bundle from `projects/{NNN}/`; export manifest |

### Templates

| Overlay template | gcloud-kit source | Lines (src) | Port work |
|---|---|---|---|
| `supplier-profile-template.md` | `plugin/templates/supplier-profile-template.md` | 245 | Prepend Document Control + Revision History; token alignment |
| `service-design-template.md` | `plugin/templates/service-design-template.md` | 313 | as above |
| `sdd-lot1-template.md` | `plugin/templates/sdd-lot1-template.md` | 792 | as above (the ~50-question set retained intact) |
| `sdd-lot2-template.md` | `plugin/templates/sdd-lot2-template.md` | 788 | as above |
| `sdd-lot3-template.md` | `plugin/templates/sdd-lot3-template.md` | 518 | as above |
| `declaration-template.md` | `plugin/templates/declaration-template.md` | 436 | as above (exclusion grounds/insurance/tax retained) |
| `pricing-template.md` | `plugin/templates/pricing-template.md` | 217 | as above |
| `security-template.md` | `plugin/templates/security-template.md` | 361 | as above (NCSC Cloud Security Principles mapping retained) |

`gcloud-competitors`, `review`, and `submission-pack` have **no** gcloud-kit
template; the command bodies generate their output structure inline (for
`gcloud-competitors`, the comparison tables + SWOT + positioning quadrant +
recommendations sections). The overlay keeps that pattern (any of them may gain a
light template during implementation if the inline structure proves unwieldy —
decided in writing-plans).

### Skills (ported nearly as-is — pure reference)

| Overlay skill | gcloud-kit source |
|---|---|
| `gcloud-framework` | `plugin/skills/gcloud-framework/` (SKILL.md + references/framework-questions.md) |
| `cloud-security` | `plugin/skills/cloud-security/` (SKILL.md + references/compliance-frameworks.md) |
| `sfia-skills` | `plugin/skills/sfia-skills/` (SKILL.md + references/sfia-skills.md) |

## 8. What is reused intact vs rewritten

**Carried over largely intact (domain content / IP):**

- SDD question sets (~50 mandatory questions, lot-1/2/3 variants)
- NCSC Cloud Security Principles mappings
- Supplier declaration content (exclusion grounds, insurance, tax)
- Pricing document structure (G-Cloud-compliant)
- The 3 reference skills
- Template section bodies (question prose, structure)

**Rewritten / re-wrapped to ArcKit conventions (scaffolding):**

- Path/project resolution: gcloud-kit `services/{NNN}/` + inline
  `os.environ['CLAUDE_PLUGIN_ROOT']` Python → ArcKit `create-project.sh --json`,
  `generate-document-id.sh`, `${CLAUDE_PLUGIN_ROOT}/templates/`
- Output naming: `ARC-NNN-SDD-v1.0.md` (vs gcloud-kit plain `sdd.md`)
- Template headers: ArcKit Document Control + Revision History
- Command frontmatter: `effort:`, `handoffs:`, citation-traceability instructions
- Removal of embedded init/customize/pages logic (reuse core)

## 9. Supporting assets

- **Templates:** mirrored to `plugins/arckit-uk-gcloud/templates/` **and**
  `.arckit/templates/` (per the dual-location convention).
- **Recipe:** `uk-gcloud-submission` recipe for `/arckit:arckit-build` (parallel
  artefact generation across a supplier's services).
- **No MCP/data** in this overlay (deferred with the market-intel layer).

## 10. Packaging & integration

- `plugins/arckit-uk-gcloud/.claude-plugin/plugin.json`: requires `arckit` core,
  `defaultEnabled: false`, `license: "Proprietary"`.
- `marketplace.json`: new entry (manual description/keywords; the bump-version
  drift check refuses to proceed without it). The entry's `license` field is
  `"Proprietary"` — this overlay is the **first non-MIT plugin** in the repo
  (all 12 existing plugins are MIT).
- **Licensing mechanics (Proprietary plugin inside an MIT repo).** The repo-root
  `LICENSE` is MIT (Copyright 2025 Mark Craddock); a blanket root MIT grant would
  otherwise extend to this plugin's files. To make Proprietary actually hold:
  1. `license: "Proprietary"` in both `plugin.json` and the `marketplace.json`
     entry (above).
  2. A per-plugin `plugins/arckit-uk-gcloud/LICENSE` carrying the proprietary
     terms (per-plugin LICENSE files are already used by `arckit-claude` and
     `arckit-fde`).
  3. A **carve-out in the repo-root `LICENSE` and `README`** explicitly excluding
     `plugins/arckit-uk-gcloud/**` from the MIT grant, so the root MIT is not
     contradictory and downstream users cannot rely on it for this subtree.
  Same owner holds copyright across the repo, so this is enforceable — but the
  carve-out is required to remove the MIT/Proprietary ambiguity, not optional.
- `scripts/converter.py`: add `arckit-uk-gcloud` to `PLUGIN_SOURCES` → all 5
  non-Claude formats; add to `SYNC_EXEMPT_PLUGINS` only if shared-asset sync
  requires it.
- `bump-version.sh` / `tag-plugins.sh`: auto-discover the new plugin (no manual
  array edits needed since PR #523).
- Docs to update: `README.md`, `docs/index.html`, `docs/DEPENDENCY-MATRIX.md`,
  CHANGELOG (**both** root and `plugins/arckit-claude/CHANGELOG.md`), and the
  `new-command-docs` checklist (command counts).
- This is the **13th marketplace plugin** and a sector-specific supplier-side
  overlay (alongside `arckit-uk-finance`, `arckit-uk-nhs`, `arckit-au-energy`).

## 11. Counts impact

- Plugins: 12 → **13**.
- Official command baseline: +11 commands in a community overlay (community
  command tally, not the official-71 baseline — consistent with other overlays).
- Doc-types: 131 → **139** (8 new: SUPP, SVCD, SDD, DECL, PRIC, SECA, GCMP, GCRV).
- Skills: +3 overlay skills (gcloud-framework, cloud-security, sfia-skills).
- MCPs: unchanged (6).

## 12. Open points for writing-plans

1. Bare command names vs a `gc-`/`gcloud-` prefix (default: bare).
2. Whether `/arckit:review` gets a light template or stays inline.
3. Exact `handoffs:` chains between the new commands (likely:
   supplier-profile → service-design → sdd-lotN → pricing → security → review →
   submission-pack).
4. *(Resolved)* Licence: the overlay ships **Proprietary** (see §10 Licensing
   mechanics and §13 risk). The carve-out wording in the repo-root LICENSE/README
   is the remaining drafting task for implementation.

## 13. Risks

- **Licensing (decided: Proprietary).** The overlay ships Proprietary, unlike all
  12 existing MIT plugins. The hazard is the **repo-root MIT grant bleeding onto
  the plugin's files**: without an explicit carve-out, the root `LICENSE` (MIT,
  Copyright 2025 Mark Craddock) covers the whole tree and contradicts the
  plugin's Proprietary claim, letting downstream users rely on MIT terms for this
  subtree. Mitigation (all in §10): `license: "Proprietary"` in plugin.json +
  marketplace.json, a per-plugin `LICENSE`, **and** a repo-root LICENSE/README
  carve-out for `plugins/arckit-uk-gcloud/**`. Same owner holds copyright, so
  it's enforceable once the carve-out lands. Also confirm the converter-generated
  non-Claude extension repos inherit/declare the Proprietary licence rather than
  defaulting to the MIT extension-repo licence.
- **Template size:** the SDD lot-1/lot-2 templates are ~790 lines; commands must
  use the Write tool (32K output-token limit) — already an ArcKit convention.
- **Doc-type code creep:** 7 new codes; the dual-registration CI guard mitigates
  drift but pages.md must be updated in the same PR.
