# UK NHS Clinical Safety Overlay Design

**Spec ID**: 2026-05-19-uk-nhs-overlay
**Status**: DRAFT — pending domain co-maintainer review (@pacharanero)
**Target release**: ArcKit v5.0.3 (community overlay)
**Author**: brainstormed by Claude with Mark Craddock (@tractorjuice), 2026-05-19
**Tracking issue**: [#424](https://github.com/tractorjuice/arc-kit/issues/424) (recruitment thread); dedicated tracking issue to be opened once PR lands
**Domain co-maintainer (proposed)**: Dr Marcus Baw ([@pacharanero](https://github.com/pacharanero)) — clinical informatician with prior open-source work on this exact problem space

---

## 0. For Marcus

Marcus, this is the decision log for the first cut of `arckit-uk-nhs`. Every section below is something we'd like you to sanity-check before we tag a release. The plugin scaffolding mirrors `arckit-au/` (the Australian Federal overlay) so the surrounding shape is consistent with other community overlays; the *substance* of clinical safety and medical-device regulation is where your judgment is load-bearing.

Specific places we'd most value your view:

1. **§3 reconciliation with your SAFETY.md spec** — we adopt your file naming and YAML-frontmatter hazard log verbatim, but place the files inside an ArcKit project subdirectory rather than at the repo root, and prepend an ArcKit Document Control block. Is this an acceptable compromise, or does it break a load-bearing part of your convention?
2. **§4 DTAC version** — we target DTAC v3 (current as of writing). If NHS England has moved on, flag it.
3. **§5 MDR classification scope** — UK MDR 2002 (as amended) + EU MDR 2017/745 with Windsor Framework NI handling. SaMD/AIaMD focus; non-software medical devices considered out of scope. Push back if this is wrong.
4. **§6 Tier handling** — we always emit all three files (SAFETY.md, SAFETY-CASE.md, HAZARD-LOG.md), and let the CSO delete SAFETY-CASE.md + HAZARD-LOG.md for Tier 1 projects. Your spec advocates proportionality at the toolchain level (Tier 1 = single file). Acceptable, or do we need a `tier=` argument?
5. **§7 hazard-log GitHub Issues alternative** — out of scope for v1. We can add a `--via=issues` variant later. Confirm v1 ships YAML-frontmatter-only.
6. **§8 Phase 2 candidates** — `uk-nhs-cra`, `uk-nhs-interop`, `uk-mhra-saamd-roadmap`, `uk-nhs-shared-care-record`. Your openEHR / FHIR UK Core / RCPCH background is the deciding factor on priority order and on which to drop.
7. **§9 doc-type codes** — `NHSDTAC` and `NHSMDR` (jurisdiction-prefixed convention matching `AUPIA`, `AUDSS`, etc.). Suggest swaps if you'd prefer different mnemonics.
8. **§10 Tiering and risk scales** — we adopt DCB0129 1–5 severity/likelihood and `low/medium/high/unacceptable` risk levels from your spec. Verify the scale mapping matches what you've validated on real RCPCH / Baw Medical projects.

If any decision below is wrong, the spec doc is the right place to push back — it lives in git, every change leaves a commit trail, and we can iterate before tagging.

---

## 1. Summary

ArcKit gains `arckit-uk-nhs`, a `[COMMUNITY]` overlay shipping 4 commands and 1 recipe for NHS clinical safety and UK/EU medical-device regulation. It is the first **sector-specific** overlay in ArcKit (existing overlays are jurisdiction-specific). It composes with the existing UK-default core commands (`dpia`, `atrs`, `secure`, `risk`, `tcop`) rather than replacing them.

Coverage spans:

- **Manufacturer clinical safety** — `uk-nhs-dcb0129` (NHS DCB0129; Clinical Safety Case Report + Hazard Log)
- **Deployer clinical safety** — `uk-nhs-dcb0160` (NHS DCB0160; deployer-side Clinical Safety Case + deployment hazard log)
- **Procurement / digital-tech assessment** — `uk-nhs-dtac` (NHS DTAC v3; 5 sections + AI module)
- **Medical-device regulation** — `uk-mdr-classification` (UK MDR 2002 + EU MDR 2017/745, SaMD/AIaMD focus, UKCA marking pathway, Windsor Framework NI handling)

The `uk-nhs-dcb0129` and `uk-nhs-dcb0160` commands adopt Marcus Baw's [SAFETY.md spec](https://github.com/pacharanero/SAFETY.md) for filenames and hazard-log YAML structure — placed inside an ArcKit `projects/{NNN}/clinical-safety/` subdirectory rather than at the repo root, with an ArcKit Document Control block prepended for provenance / review-cycle tracking. The `uk-nhs-dtac` and `uk-mdr-classification` commands produce conventional ArcKit `ARC-{NNN}-{TYPE}-vN.N.md` artefacts because no equivalent open-source convention exists.

Total command count moves from **71 official + 46 community = 117** to **71 official + 50 community = 121** (4 new community commands across the NHS overlay).

---

## 2. Locked constraints

| Constraint | Decision | Set in / by |
|---|---|---|
| Scope tier | "Core 4 commands + recipe" (Phase 1 bundle) | User Q1 |
| Hazard-log format | "As close to Marcus Baw stuff as possible" — adopt SAFETY.md spec verbatim | User Q2 |
| File layout | Marcus filenames inside ArcKit `projects/{NNN}/clinical-safety/` subdir + Document Control block prepended | User Q3 |
| Tier handling | Approach (a) — always emit all three Marcus files; CSO deletes what they don't need for Tier 1 | User Q4 |
| Maintainership | `[COMMUNITY]` overlay; recruiting @pacharanero as domain co-maintainer | Project precedent (UAE, Canada) |
| First sector overlay precedent | This PR establishes the `uk-{sector}-*` naming pattern for future overlays (`uk-fca-*`, `uk-justice-*`, etc.) | Maintainer note in #424 reply |
| Statutory currency | DTAC v3 (current at writing); UK MDR 2002 as amended; EU MDR 2017/745 — version flagged in command body, mandatory currency check in template | Project precedent (Canada FITAA pattern) |

---

## 3. Reconciliation with Marcus Baw's SAFETY.md spec

### What we adopt verbatim

- **File naming**: `SAFETY.md`, `SAFETY-CASE.md`, `HAZARD-LOG.md`, (optional Tier 3) `SAFETY-PLAN.md`
- **Required fields** on `SAFETY.md`: product-name, version, standard, clinical-safety-officer (Name + GMC/NMC/HCPC), organisation, safety-case-status, hazard-log-url, last-reviewed
- **`SAFETY-CASE.md` section structure**: Intended Use, Scope, Safety Argument, Evidence, Residual Risk, CSO Sign-off
- **YAML-frontmatter hazard log**: array of hazards with id, description, cause, effect, severity (1–5), likelihood (1–5), risk, controls, residual-severity, residual-likelihood, residual-risk, status (`open` / `mitigated` / `accepted` / `closed`), cso-reviewed, date-raised, date-closed
- **Controls array** alongside hazards, with id + description
- **Rendered Markdown table** below YAML for GitHub readability
- **DCB0129 mapping table** (Clinical Risk Management Plan → SAFETY-PLAN.md, etc.) reproduced in template comments

### What we change (and why)

| Change | Why |
|---|---|
| Files placed in `projects/{NNN}/clinical-safety/` not repo root | ArcKit supports multi-project monorepos; root-level files break this. Hooks (provenance, telemetry, manifest) only fire under `projects/`. |
| ArcKit Document Control block prepended to each file | Provides Document ID, Status (DRAFT/IN_REVIEW/APPROVED/PUBLISHED), Version, Review Cycle, Next Review Date, Owner, Reviewed By, Approved By, Distribution. These overlap with Marcus's `safety-case-status` field but ArcKit needs them at file level for governance scans (`health.md`, stale-artefact monitor). Marcus's fields stay in the YAML / front-table. |
| ArcKit provenance footer (`## Build Provenance`) appended by hook | Automatic; not visible in template. |

### What we defer

- **GitHub Issues hazard-log alternative** (Marcus's spec offers this with a label schema). Out of scope for v1; will add as `--via=issues` argument variant if requested.
- **SAFETY-PLAN.md** (Tier 3). Most NHS digital products are Tier 1 or 2; can be added in Phase 2.
- **`hazard-log-url` linking to GitHub Issues view** — we always link to the local `HAZARD-LOG.md` in v1.

### Open question for Marcus

Do you want us to also ship a top-of-repo `SAFETY.md` that just points at `projects/{NNN}/clinical-safety/SAFETY.md` for discoverability (matching your "front door" principle)? Trivial to add; not in v1 as drafted.

---

## 4. NHS DTAC command (`uk-nhs-dtac`)

Single artefact `ARC-{NNN}-DTAC-v1.0.md` in `projects/{NNN}/`. Covers DTAC v3 sections:

1. **Clinical safety** — DCB0129/0160 alignment (cross-references `SAFETY-CASE.md` if present in same project)
2. **Data protection** — UK GDPR + DPA 2018 (cross-references `dpia` output)
3. **Technical assurance** — security, interoperability, accessibility (WCAG 2.2 AA)
4. **Interoperability** — FHIR UK Core, NHS Number, SNOMED CT, NHS APIs (PDS, e-RS, GP Connect)
5. **Usability and accessibility** — NHS service standard alignment

Plus AI module (DTAC AI Annex) if the product uses AI/ML — cross-references `atrs` output.

Handoffs: `uk-nhs-dcb0129`, `dpia`, `atrs`, `service-assessment`, `risk`.

---

## 5. MDR classification command (`uk-mdr-classification`)

Single artefact `ARC-{NNN}-MDR-v1.0.md` in `projects/{NNN}/`. Covers:

- **Classification under UK MDR 2002** (as amended by the Medical Devices (Amendment) (Great Britain) Regulations 2024) — Class I / IIa / IIb / III determination using SaMD rules
- **Classification under EU MDR 2017/745** (Rule 11 for software) — for NI placement under Windsor Framework, or EU market access
- **UKCA marking pathway** vs UKNI vs CE marking — which is needed where
- **Conformity assessment route** — self-declaration / Approved Body / Notified Body
- **MHRA SaMD / AIaMD considerations** — alignment to the MHRA AIaMD Programme work packages
- **QMS expectation** — ISO 13485 / ISO 14971 / IEC 62304 references (not full QMS generation; just signposting)
- **Post-market surveillance** outline — PMS plan obligations
- **Border-case rationale** — explicit recording of why a product is *not* a medical device, if that's the conclusion (mirrors MHRA's "borderline manual" reasoning)

Scope: software-as-medical-device only in v1. Hardware medical devices considered out of scope (different conformity routes, different test regimes — not what an ArcKit user is typically building).

Handoffs: `uk-nhs-dtac`, `uk-nhs-dcb0129`, `risk`, `adr`.

---

## 6. Recipe `uk-nhs-clinical-safety.yaml`

Lives at `arckit-claude/skills/arckit-build/recipes/uk-nhs-clinical-safety.yaml` (alongside `uk-saas.yaml`, `uk-mod-sovereign.yaml`).

Base: `uk-saas.yaml`. Additions:

- **New targets**: `UK_NHS_DCB0129`, `UK_NHS_DCB0160`, `UK_NHS_DTAC`, `UK_MDR_CLASSIFICATION`
- **Wave placement**: clinical-safety wave runs after `requirements` and `data-model` (hazards need to know what the product does and what data flows where). DTAC and MDR run after the clinical-safety wave (they reference safety-case content).
- **No swaps from uk-saas baseline** — NHS digital products still need `tcop`, `secure`, `dpia`, `atrs`, etc. The NHS overlay *adds* clinical safety and medical-device regulation; it does not replace UK government-wide compliance.
- **No drops** from uk-saas (cf. `au-federal.yaml` which drops `GOV_REUSE` and `SVCASS`).

---

## 7. Plugin scaffolding

```
arckit-uk-nhs/
├── .claude-plugin/plugin.json     # name: arckit-uk-nhs, depends on arckit core
├── VERSION                         # 5.0.3
├── README.md
├── CHANGELOG.md
├── commands/
│   ├── uk-nhs-dcb0129.md
│   ├── uk-nhs-dcb0160.md
│   ├── uk-nhs-dtac.md
│   └── uk-mdr-classification.md
└── templates/
    ├── uk-nhs-dcb0129-template.md           # Wrapper / index
    ├── uk-nhs-dcb0129-safety-template.md    # SAFETY.md sub-template
    ├── uk-nhs-dcb0129-case-template.md      # SAFETY-CASE.md sub-template
    ├── uk-nhs-dcb0129-hazard-template.md    # HAZARD-LOG.md sub-template
    ├── uk-nhs-dcb0160-template.md
    ├── uk-nhs-dcb0160-deployment-safety-template.md
    ├── uk-nhs-dcb0160-deployment-case-template.md
    ├── uk-nhs-dcb0160-deployment-hazard-template.md
    ├── uk-nhs-dtac-template.md
    └── uk-mdr-classification-template.md
```

Plugin manifest dependencies: `arckit` core, version `=5.0.3`.

Templates also copied to `.arckit/templates/` and to `arckit-claude/templates/` (per the CLAUDE.md template duplication convention — overrides via `templates-custom/` are honoured).

---

## 8. Phase 2 candidates (out of scope for v1)

| Command | Purpose | Why Phase 2 |
|---|---|---|
| `uk-nhs-cra` | Standalone Clinical Risk Assessment (separated from CSCR) | Niche; most teams want the full case + hazard log together |
| `uk-nhs-interop` | FHIR UK Core / NHS API conformance / openEHR archetype dependencies | Deserves its own design pass with Marcus's openEHR / FHIR background |
| `uk-mhra-saamd-roadmap` | Alignment to the MHRA SaMD/AIaMD Programme work packages | Programme is evolving; revisit when MHRA roadmap stabilises |
| `uk-nhs-shared-care-record` | LHCR / ShCR integration patterns | Regional variation across the 42 ICSs — needs scoping |

---

## 9. Doc-type codes

Registered in `arckit-claude/config/doc-types.mjs`:

| Code | Document type | Multi-instance? | Subdir |
|---|---|---|---|
| `NHSDTAC` | NHS DTAC assessment | No | (project root) |
| `NHSMDR`  | UK/EU MDR classification (SaMD/AIaMD) | No | (project root) |

Doc-type codes follow the existing jurisdiction-prefixed convention (`AUPIA`, `AUDSS`, `AUE8`, etc.) but use `NHS` rather than `UK` since NHS is the relevant authority for clinical safety + DTAC and it disambiguates from generic UK government codes.

Marcus's three files (`SAFETY.md`, `SAFETY-CASE.md`, `HAZARD-LOG.md`) deliberately do **not** carry an ArcKit doc-type code or an `ARC-` prefix — they pass through the filename-validation hook untouched and don't appear in the manifest as discrete ARC artefacts. Other documents (DTAC, MDR, risk register) cross-reference them by relative path (`clinical-safety/SAFETY-CASE.md`) rather than by document ID.

Hazards do *not* get a doc-type code because they live in Marcus's `HAZARD-LOG.md` YAML, not as separate ARC files.

---

## 10. Risk scoring scales

Adopted from Marcus's SAFETY.md spec v2.0.0-draft (which itself derives from DCB0129):

- **Severity**: 1 (Catastrophic) ... 5 (Minor)
- **Likelihood**: 1 (Very High) ... 5 (Very Low)
- **Risk levels**: `unacceptable`, `high`, `medium`, `low`
- **Status**: `open` / `mitigated` / `accepted` / `closed`

Note: Marcus's spec inverts the usual ArcKit/Orange-Book convention where 5 = highest. The DCB0129 scale is what the NHS uses and what CSOs sign off against, so we follow it exactly. Templates will include the scale legend prominently to avoid confusion.

---

## 11. Deferrals and explicit out-of-scope

- **GitHub Issues hazard log** (Marcus's `--via=issues` alternative)
- **SAFETY-PLAN.md** generation (Tier 3 only)
- **Phase 2 commands** (uk-nhs-cra, uk-nhs-interop, uk-mhra-saamd-roadmap, uk-nhs-shared-care-record)
- **Hardware medical devices** (UK MDR command is SaMD-focused)
- **Northern Ireland-specific** advisory beyond Windsor Framework mention in MDR command
- **Scotland / Wales-specific clinical safety standards** (treated as inheriting DCB0129/0160 in v1)
- **Bilingual artefacts** (English-only v1)
- **Sector test repo** — no `arckit-test-project-v49-uk-nhs` in v1; will be added in a follow-on PR if Marcus has a fixture in mind
- **`paths:` auto-activation, hooks, MCP servers** — none needed; overlay is purely command-additive

---

## 12. Release plan

- **Branch**: `feat/424-uk-nhs-overlay`
- **Version bump**: `scripts/bump-version.sh 5.0.3` (touches all 15 version-bearing locations)
- **Converter run**: `python scripts/converter.py` to generate Codex / OpenCode / Gemini / Copilot / Paperclip variants for the 4 new commands
- **Docs updated**: `README.md` (community-overlay table), `docs/index.html` (community-overlay card), `docs/DEPENDENCY-MATRIX.md`, `CHANGELOG.md`, `arckit-claude/skills/arckit-build/SKILL.md` (recipes table)
- **Single overlay guide**: `docs/guides/uk-nhs-clinical-safety.md` (community-overlay convention)
- **PR description**: link to this spec doc explicitly; tag `@pacharanero` for review with a request to walk through §0 and §3 first
- **Schema validation**: run `arckit-build` schema check locally before opening PR (matches au-federal precedent)
- **Lint**: run `markdownlint-cli2 --fix` on all changed `.md` files before push

---

## 13. Acceptance criteria

1. `arckit-uk-nhs/` directory exists with the layout in §7
2. All 4 commands have valid YAML frontmatter, `[COMMUNITY]` description prefix, `argument-hint`, `effort` set
3. `uk-nhs-clinical-safety.yaml` recipe passes the inline YAML schema validator from #424
4. Templates exist for all 4 commands; `dcb0129` and `dcb0160` produce 3-file output matching Marcus's spec
5. Document Control block present on every generated artefact
6. Doc-type codes (`DTAC`, `MDR`, `CSCR`) registered in `doc-types.mjs`
7. Converter run produces clean output for Codex / OpenCode / Gemini / Copilot / Paperclip
8. `cross_reference_lint.py` passes (no broken `${CLAUDE_PLUGIN_ROOT}/` paths, no orphan handoff command slugs)
9. `markdownlint-cli2` passes on all changed files
10. README, CHANGELOG, DEPENDENCY-MATRIX, docs/index.html, arckit-build SKILL.md recipes table updated
11. PR description tags @pacharanero and links to this spec doc
12. Plugin tag dry-run passes (`claude plugin tag --dry-run`)

---

## 14. Risks and mitigations

| Risk | Mitigation |
|---|---|
| Misrepresenting DCB0129 / DTAC / MDR substance — these are regulated documents with serious clinical consequences | Spec gates on Marcus review; templates carry "**not legal or clinical advice**" disclaimer; statutory currency banner mandatory in command body |
| MHRA SaMD/AIaMD Programme moves while v1 is in flight | Version-date all references; flag in template with "(check MHRA roadmap for updates)" |
| Marcus disagrees with the file-layout compromise in §3 | Spec doc is the negotiation surface; we can move to root-level files with a hooks exemption if his pushback is strong |
| First sector overlay sets a precedent that doesn't generalise to `uk-fca-*` / `uk-justice-*` | Acceptable risk; sector overlays are different from each other anyway. Naming convention (`{jurisdiction}-{sector}-*`) is the only durable contract |
| DTAC v3 → v4 release during the review window | DTAC version pinned in command body and template; bump in next plugin version when NHS England publishes v4 |

---

## 15. Changes from initial discussion

| Decision point | Initial position | Final | Reason |
|---|---|---|---|
| Phase 1 scope | Open question (3, 4, or 5 commands) | 4 commands + recipe | User Q1 |
| Hazard-log format | Three options (single file, multi-instance ARC-HAZ-NNN, embedded table) | "As close to Marcus Baw stuff as possible" → his YAML frontmatter format | User Q2 |
| File layout | Three options (Marcus inside ArcKit subdir, pure ArcKit, Marcus at root) | Marcus filenames inside ArcKit subdir | User Q3 |
| Tier handling | Open: always emit 3 files vs `tier=` argument | Always emit 3 files; CSO deletes what's not needed | User Q4 |

---

## 16. References

- NHS DCB0129 (Clinical Risk Management: its Application in the Manufacture of Health IT Systems) — <https://digital.nhs.uk/data-and-information/information-standards/information-standards-and-data-collections-including-extractions/publications-and-notifications/standards-and-collections/dcb0129-clinical-risk-management-its-application-in-the-manufacture-of-health-it-systems>
- NHS DCB0160 (Clinical Risk Management: its Application in the Deployment and Use of Health IT Systems) — <https://digital.nhs.uk/data-and-information/information-standards/information-standards-and-data-collections-including-extractions/publications-and-notifications/standards-and-collections/dcb0160-clinical-risk-management-its-application-in-the-deployment-and-use-of-health-it-systems>
- NHS DTAC — <https://transform.england.nhs.uk/key-tools-and-info/digital-technology-assessment-criteria-dtac/>
- UK MDR 2002 (as amended) — <https://www.legislation.gov.uk/uksi/2002/618>
- EU MDR 2017/745 — <https://eur-lex.europa.eu/eli/reg/2017/745>
- MHRA Software and AI as a Medical Device Programme — <https://www.gov.uk/government/publications/software-and-artificial-intelligence-ai-as-a-medical-device>
- Marcus Baw, SAFETY.md spec — <https://github.com/pacharanero/SAFETY.md>
- Marcus Baw, DCB0129 templated — <https://github.com/turva-uk/dcb0129-template>
- Marcus Baw, DCB0129 markdown — <https://github.com/turva-uk/dcb0129-markdown>
- ArcKit issue #424 (community overlay recruitment) — <https://github.com/tractorjuice/arc-kit/issues/424>
- ArcKit comment from @pacharanero in #424 — <https://github.com/tractorjuice/arc-kit/issues/424#issuecomment-4487306526>
