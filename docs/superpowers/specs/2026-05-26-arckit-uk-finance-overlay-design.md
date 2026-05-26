# ArcKit UK Finance Payments Overlay Design

**Spec ID**: 2026-05-26-arckit-uk-finance-overlay
**Status**: DRAFT — pre-implementation, no domain co-maintainer recruited
**Target release**: ArcKit v5.3.0 (community overlay)
**Author**: brainstormed by Claude with Mark Craddock ([@tractorjuice](https://github.com/tractorjuice)), 2026-05-26
**Prior art**: [`arckit-uk-nhs`](https://github.com/tractorjuice/arc-kit/tree/main/arckit-uk-nhs) (first sector overlay, v5.2.0)
**Tracking issue**: To be opened once this spec is approved

---

## 0. Scope at a glance

`arckit-uk-finance` is the **second sector-specific community overlay** in ArcKit (first was `arckit-uk-nhs` for clinical safety). v1 targets a single audience and slice: **architects at established UK Payment Service Providers / E-Money Institutions / Payment Institutions scaling regulated product operations**. It ships 4 commands, 1 recipe, 4 doc-types, 5 guides, and the usual cross-cutting site integration.

It deliberately does **not** try to be a complete UK Financial Services overlay in v1. UK FS spans banking, insurance, asset management, payments, crypto-assets, markets — each with its own load-bearing frameworks. Scoping v1 narrowly to payments compliance for a known firm-type lets the overlay ship credibly without a domain co-maintainer at launch, and leaves room for v2+ payments-adjacent extensions (operational resilience, APP fraud) and eventual v3+ sub-overlays (`uk-fs-banking.yaml`, `uk-fs-asset-mgmt.yaml`).

---

## 1. Decisions locked during brainstorm

| # | Decision | Rationale |
|---|---|---|
| D1 | Plugin name: `arckit-uk-finance` | Future-proof for non-payments v2+ commands without rebranding |
| D2 | v1 target user: architect at established UK PSP / EMI scaling ops | Day-2 compliance focus — sharper than "any FS firm" |
| D3 | 4 commands: SCA-RTS, EMI safeguarding, Consumer Duty, CTP dependency | Matches NHS's command count, keeps authorship effort tractable, all four hit the chosen v1 audience |
| D4 | Approach A — pure NHS-pattern clone | Lightest plumbing, ~1-2 days authorship; FINOS Common Cloud Controls cited inline (not vendored) where relevant |
| D5 | Ship as `EXPERIMENTAL`, no named domain co-maintainer | Parallel to AU overlay's pre-`@royster70` shipping pattern; open "help wanted" call in README |
| D6 | Recipe filename: `uk-fs-payments.yaml` | Matches v1 scope; leaves namespace for `uk-fs-banking.yaml` etc. in v2+ |
| D7 | Output directory: `payments-compliance/` under each project | Mirrors NHS's `clinical-safety/` convention |
| D8 | Doc-type code prefix: `FS*` (FSSCA, FSSAFE, FSCD, FSCTP) | Short, matches existing ArcKit 4-6 char convention; NHS's 5-7 char codes are outliers |
| D9 | Release window: ArcKit v5.3.0, after NHS PR #501 settles | Keeps NHS the clean "first sector overlay" landmark; avoids two new sectors in one release |
| D10 | Filename convention for outputs: standard ArcKit `ARC-{NNN}-{DOCTYPE}-v1.0.md` | No external spec to adopt (unlike NHS, which inherited Marcus Baw's `SAFETY.md` naming) |
| D11 | Test repo deferred to v1.1 | NHS shipping the same way; lets test-repo cycle catch issues post-release |
| D12 | Sector card flag emoji: 🏦 | Bank icon reads as "finance" more universally than 💷 or 💳 |

---

## 2. The 4 commands

Each command checks prerequisites, reads its template(s) via `Read`, writes output via `Write` (to dodge 32K output token limit), and emits a Markdown artefact under `projects/{N}-{name}/payments-compliance/`. All four use `effort: high`, `keep-coding-instructions: true`, and declare `handoffs:` to baseline commands.

### 2.1 `/arckit.uk-fs-sca-rts` — PSD2 SCA-RTS exemption design

- **Doc-type**: `FSSCA`
- **Severity**: HIGH
- **Output**: SCA-RTS exemption applicability matrix, transaction risk analysis (TRA) threshold rationale, fraud monitoring threshold design, exemption decision rationale per Article 10-18 of the SCA-RTS
- **Inline citations**: FCA PSRs 2017 (SCA-RTS Articles 10-18), FCA PS20/6, UK Finance Industry Guidance on Strong Customer Authentication (2025 revision), FCA Approach to Payment Services (current edition)
- **Handoffs**: `uk-fs-safeguarding` (firms with PSP scope often have EMI scope too), `/arckit.dpia` (SCA involves biometrics + behavioural data), `/arckit.adr` (exemption decisions are architectural and traceable)

### 2.2 `/arckit.uk-fs-safeguarding` — EMI / PI safeguarding assessment

- **Doc-type**: `FSSAFE`
- **Severity**: **CRITICAL** — FCA enforcement actions on safeguarding (e.g. Allied Wallet 2021, Premier FX 2018) have led to firm collapse and customer loss. Highest stakes of any v1 command.
- **Output**: Safeguarding method statement (segregation / insurance / guarantee), designated safeguarding bank or insurance arrangements, reconciliation cadence + sign-off chain, end-to-end client-funds flow, REP-CRIM-aligned audit plan
- **Inline citations**: Electronic Money Regulations 2011 (regs 20-21), Payment Services Regulations 2017 (regs 23-24), FCA "Dear CEO" letter on safeguarding (Jan 2020), FCA Approach to Payment Services, FCA REP-CRIM submission expectations, FCA SUP 16 Annex 30A
- **Handoffs**: `uk-fs-ctp-dependency` (safeguarding bank is itself a critical dependency), `/arckit.risk` (safeguarding failure → Orange Book risk register entry), `/arckit.operationalize` (reconciliation runbook is a day-2 operational artefact)

### 2.3 `/arckit.uk-fs-consumer-duty` — FCA Consumer Duty board report

- **Doc-type**: `FSCD`
- **Severity**: HIGH
- **Output**: Annual Board Report on customer outcomes (FCA PS22/9 Annex), price & value assessment, target market assessment, fair-value framework, evidence pack supporting each of the four outcomes (Products & Services, Price & Value, Consumer Understanding, Consumer Support)
- **Inline citations**: FCA PS22/9, FG22/5 (Final Guidance), FCA "Good and poor practice" observations on board reports (April 2026), Principle 12 of the FCA Principles for Businesses
- **Handoffs**: `/arckit.requirements` (fair-value framework expresses as NFRs), `/arckit.stakeholders` (target market analysis feeds Goals), `/arckit.dpia` (price-personalisation may involve profiling)

### 2.4 `/arckit.uk-fs-ctp-dependency` — Critical Third Parties dependency assessment

- **Doc-type**: `FSCTP`
- **Severity**: HIGH
- **Output**: CTP dependency register (designated providers the firm relies on, e.g. cloud hyperscalers, payment-network operators, BaaS providers), materiality assessment per provider, resilience testing plan including exit and substitution drills
- **Inline citations**: BoE/PRA/FCA PS24/16 (Critical Third Parties policy statement, Nov 2024, effective Jan 2025 upon HMT designation), FSMA 2023 Act, joint regulator CTP supervisory statements, **FINOS Common Cloud Controls (CCC) referenced inline as a control library** (not vendored, just cited)
- **Handoffs**: `/arckit.adr` (CTP exit / multi-vendor decisions are architectural), `/arckit.risk`, `/arckit.operationalize` (DR / exit drills evidence the resilience plan)

### 2.5 Cross-cutting in every command

A "Disclaimer & review" block analogous to NHS's CSO review block:

> Output should be reviewed by qualified UK FS regulatory counsel, the firm's MLRO, and the firm's Compliance Officer before reliance. This command produces a working draft for architecture-team discussion — not a regulator-submission-ready artefact.

---

## 3. Plugin structure

```
arckit-uk-finance/
├── .claude-plugin/
│   └── plugin.json                       # strict equality dep on arckit=5.3.0
├── commands/
│   ├── uk-fs-sca-rts.md
│   ├── uk-fs-safeguarding.md
│   ├── uk-fs-consumer-duty.md
│   └── uk-fs-ctp-dependency.md
├── templates/                            # ~10-12 templates total
│   ├── uk-fs-sca-rts-template.md
│   ├── uk-fs-sca-rts-exemption-matrix-template.md
│   ├── uk-fs-safeguarding-template.md
│   ├── uk-fs-safeguarding-reconciliation-template.md
│   ├── uk-fs-consumer-duty-template.md
│   ├── uk-fs-consumer-duty-board-report-template.md
│   ├── uk-fs-ctp-dependency-template.md
│   └── uk-fs-ctp-dependency-register-template.md
├── recipes/                              # empty placeholder (actual recipe in core)
├── README.md
├── CHANGELOG.md
└── VERSION
```

Plugin contains only commands + templates + the standard plugin metadata. No agents, hooks, monitors, MCP servers, or userConfig — same minimal shape as `arckit-uk-nhs`.

---

## 4. Core touchpoints

### 4.1 Doc-type registration — `arckit-claude/config/doc-types.mjs`

Additive entries alongside the existing `NHSDTAC` / `NHSMDR` block:

```javascript
'FSSCA':  { name: 'UK PSD2 SCA-RTS Exemption Design',                category: 'Compliance', regime: 'UK', severity: 'HIGH' },
'FSSAFE': { name: 'UK EMI / PI Safeguarding Assessment',             category: 'Compliance', regime: 'UK', severity: 'CRITICAL' },
'FSCD':   { name: 'UK FCA Consumer Duty Board Report',               category: 'Compliance', regime: 'UK', severity: 'HIGH' },
'FSCTP':  { name: 'UK Critical Third Parties Dependency Assessment', category: 'Compliance', regime: 'UK', severity: 'HIGH' },
```

Uniqueness verified during brainstorm: no existing `FS*` codes in the registry.

### 4.2 Recipe — `arckit-claude/skills/arckit-build/recipes/uk-fs-payments.yaml`

```yaml
recipe: uk-fs-payments
schema_version: 1
flagship: UK_FS_SCA_RTS
description: >
  UK Financial Services payments overlay — composes the ArcKit baseline
  with FCA/PRA payments-specific artefacts for PSPs, EMIs, and Payment
  Institutions scaling regulated operations. v1 covers SCA-RTS exemption
  design, EMI/PI safeguarding, Consumer Duty board report, and Critical
  Third Parties dependency assessment. Operational resilience, APP fraud
  reimbursement, and AML/CTF Reg 18 are deferred to v2.

targets:
  # Foundation (inherited baseline)
  - { id: PRIN, skill: arckit:principles }
  - { id: STKE, skill: arckit:stakeholders, deps: [PRIN] }
  - { id: REQ,  skill: arckit:requirements, deps: [STKE] }
  - { id: RISK, skill: arckit:risk,         deps: [REQ] }
  - { id: DATA, skill: arckit:data-model,   deps: [REQ] }
  - { id: DPIA, skill: arckit:dpia,         deps: [DATA] }
  - { id: ADR,  skill: arckit:adr,          deps: [REQ] }

  # UK FS payments overlay
  - { id: FSSCA,  skill: arckit:uk-fs-sca-rts,        deps: [REQ, ADR, DPIA] }
  - { id: FSSAFE, skill: arckit:uk-fs-safeguarding,   deps: [REQ, RISK] }
  - { id: FSCD,   skill: arckit:uk-fs-consumer-duty,  deps: [STKE, REQ] }
  - { id: FSCTP,  skill: arckit:uk-fs-ctp-dependency, deps: [ADR, RISK] }

post_build:
  - arckit:traceability
  - arckit:health
```

### 4.3 Release tooling

- `scripts/tag-plugins.sh` — add `arckit-uk-finance` to the `PLUGINS` array. **Get this right first time** — per memory, this was missed for `arckit-us` and required follow-up PR #513 to fix.
- `scripts/bump-version.sh` — add `arckit-uk-finance/VERSION` and `arckit-uk-finance/.claude-plugin/plugin.json` to the version-bearing locations list (17 → 19 locations, assuming NHS PR #501 has already added its two entries by the time this lands).
- `scripts/converter.py` — no changes expected; the converter already iterates community plugin directories.

---

## 5. Site integration

### 5.1 `docs/index.html`

Add UK Finance card to the Jurisdictions grid, immediately after the UK NHS sector card:

```html
<a href="commands.html?jurisdiction=uk-finance" class="app-jurisdiction-card govuk-link--no-visited-state">
    <div class="app-jurisdiction-card__flag">🏦</div>
    <div class="app-jurisdiction-card__title">UK Finance (sector)</div>
    <span class="app-jurisdiction-card__badge app-jurisdiction-card__badge--community">Community · 4 commands · payments slice</span>
    <p class="app-jurisdiction-card__desc">PSD2 SCA-RTS exemption design, EMI / PI safeguarding assessment, FCA Consumer Duty board report, Critical Third Parties dependency assessment. v1 audience: architects at established UK PSPs / EMIs scaling regulated operations.</p>
</a>
```

FAQ #1 and #3 answers extended to mention UK Finance Payments as the second sector overlay.

### 5.2 `docs/commands.html`

- Plugin schema list (inset): add row `Tier = Community + Sector = UK Finance → arckit-uk-finance`
- Category dropdown: `<option value="uk-fs-overlay">UK Finance Payments Overlay (Community, Sector)</option>`
- Jurisdiction dropdown: `<option value="uk-finance">UK Finance (sector)</option>`
- 4 command rows tagged `data-status="experimental" data-category="uk-fs-overlay" data-jurisdiction="uk-finance" data-tier="community"`

### 5.3 `docs/guides.html`

New collapsible accordion section immediately after the UK NHS Clinical Safety Overlay block:

- Heading: "UK Finance Payments Overlay"
- Intro carries the sector disclaimer + review requirement
- 5 guide links: overlay-level + 4 commands

### 5.4 `docs/guides/`

Five new guide files in the existing `docs/guides/` directory:

- `uk-fs-payments-overlay.md` — purpose, when-to-use, 4 commands, recipe, doc-types, references, v2 candidates, status (`EXPERIMENTAL`)
- `uk-fs-sca-rts.md`
- `uk-fs-safeguarding.md`
- `uk-fs-consumer-duty.md`
- `uk-fs-ctp-dependency.md`

### 5.5 Repo-level docs

- `README.md` — add to community overlays list + install snippet (`claude plugin install arckit arckit-uk-finance`)
- `CLAUDE.md` — extend community overlay list to include arckit-uk-finance as the second sector overlay
- `CHANGELOG.md` — v5.3.0 entry

---

## 6. Risk model

| # | Risk | Severity | Mitigation |
|---|---|---|---|
| R1 | Regulatory drift — SCA-RTS likely to diverge from EU PSD3; Consumer Duty board-report expectations evolving; CTP designation list still maturing | HIGH | Ship `EXPERIMENTAL`. Version each command's citation list. Quarterly review cadence documented in overlay README, parallel to AU / US "Citation Register" guides |
| R2 | Liability shadow — these are documents firms file with regulators; a bad SCA exemption or safeguarding doc has real enforcement consequences | HIGH | Identical-strength disclaimer to NHS's CSO block in every command output, every guide intro, plugin README |
| R3 | No domain co-maintainer at launch | MEDIUM | EXPERIMENTAL tag caps liability. v1.1 action: open "Help wanted: UK FS domain co-maintainer" issue. Leon Gordon (fintechai-compliance.org.uk) flagged as natural starting target per external research |
| R4 | Verification debt — Mark has caught Claude shipping inferred fixes before (see `feedback_verify_fixes_against_docs.md`); every regulator citation must link to the actual handbook page or policy statement | HIGH | Hard rule, not a stretch goal — every citation in v1 must be a live URL to the FCA / PRA / BoE / UK Finance source. PR reviewer to check each link clicks through |
| R5 | Doc-type code collision in `doc-types.mjs` | LOW | Verified clean during brainstorm; re-check at scaffold time as cheap insurance |

---

## 7. Validation plan

Before merging the v1 PR:

- [ ] Plugin manifest validates against [JSON Schema](https://json.schemastore.org/claude-code-plugin-manifest.json)
- [ ] `claude plugin tag arckit-uk-finance --dry-run` from a clean tree
- [ ] Recipe `uk-fs-payments` resolves cleanly via the `arckit-build` skill (all 11 targets resolve, dependency graph has no cycles)
- [ ] All 4 doc-type codes appear in `arckit-claude/scripts/bash/generate-document-id.sh` if it has an allow-list (TBC during scaffolding)
- [ ] `markdownlint-cli2 "arckit-uk-finance/**/*.md" "docs/guides/uk-fs-*.md"` clean before push
- [ ] Manual UI checks: open `commands.html?jurisdiction=uk-finance` and confirm 4 rows show; open `index.html` and confirm sector card renders; open each new guide in `guide-viewer.html`
- [ ] Citation check: every regulator URL in every command and template clicks through to a live page (no inferred references)

---

## 8. Out of scope for v1 (deferred to v2+)

Deferred with explicit triggers for revisit:

| Command | Trigger to ship |
|---|---|
| `uk-fs-payments-or` (Operational resilience for payment IBS) | Next release after v1 (likely v5.4.0) or when a co-maintainer joins |
| `uk-fs-app-fraud` (APP fraud reimbursement + Confirmation of Payee) | Same window; very topical post-Oct 2024 PSR mandatory reimbursement |
| `uk-fs-aml-reg18` (MLR 2017 firm-wide risk assessment) | Could grow into a generic `/arckit.aml-reg18` baseline command rather than overlay-only — broader applicability |
| `uk-fs-dora-mapping` (DORA mapping for UK firms with EU operations) | Niche; defer until requested |
| Open Banking conformance commands (OBIE / VRP / FAPI) | Different audience (TPPs not PSPs); candidate for a separate `arckit-uk-open-banking` overlay rather than v2 of this one |
| `uk-fs-banking` sub-recipe (ICAAP, BCBS 239, MRM SS1/23) | Separate target audience; v3+ work, requires domain co-maintainer |
| `uk-fs-insurance` / `uk-fs-asset-mgmt` sub-recipes | v3+ |

---

## 9. Open questions for the user (parked, not blocking spec sign-off)

The following are noted but not load-bearing for the spec:

1. **Domain co-maintainer outreach timing** — should outreach to Leon Gordon (or a FINOS Open RegTech SIG contact) happen before v1 PR opens, after merge, or only if v1 gets traction?
2. **Test repo creation** — if v1.1 ships a test repo, what realistic PSP/EMI scenario should it model? (a B2B virtual-account product? a card-issuance EMI? a payments-orchestration platform?)
3. **CHANGELOG voice** — match NHS's voice ("first sector overlay") or downplay ("payments slice of UK FS regulation") to leave room for future expansion?

---

## 10. Implementation plan handover

This spec is the input to the `writing-plans` skill, which will produce an ordered task list covering:

1. Scaffold `arckit-uk-finance/` directory + manifest
2. Author 4 commands (sca-rts, safeguarding, consumer-duty, ctp-dependency)
3. Author ~8-12 templates
4. Register 4 doc-types in core
5. Author recipe in core
6. Update release tooling (`tag-plugins.sh`, `bump-version.sh`)
7. Site integration (`index.html`, `commands.html`, `guides.html`, 5 guide files)
8. Repo-level doc updates (`README.md`, `CLAUDE.md`, `CHANGELOG.md`)
9. Validation pass (manifest, recipe resolution, lint, citation check)
10. PR + merge to main

Approximate effort: 1-2 days of focused authorship for items 1-8, half a day for validation and PR.

---

**End of spec.**
