# USA Federal Civilian Overlay Design

**Spec ID**: 2026-05-23-usa-federal-overlay
**Status**: DRAFT — pending user review
**Target release**: ArcKit v5.1.0 (community overlay, lockstep with core)
**Author**: brainstormed by Claude with Mark Craddock, 2026-05-23

---

## 1. Summary

ArcKit gains a 10-command **USA Federal Civilian Overlay**, shipped as a `[COMMUNITY]` overlay following the same model as `arckit-au` (AU Federal) and `arckit-ca` (CA Federal). The overlay targets US federal civilian agencies and the vendors that sell to them — explicitly **not** federal defense (CMMC/RMF/DISA STIGs), **not** state regimes (StateRAMP, TX-RAMP, CJIS), **not** sector-specific (HIPAA, GLBA). Those are candidate future overlays.

Coverage spans the authoritative federal civilian compliance regimes a project needs to reach an Agency or JAB ATO and to satisfy the active 2025 AI mandates:

- **Categorization and control selection** — `us-fisma-categorization` (FIPS 199), `us-nist-800-53` (NIST 800-53 Rev 5 tailoring)
- **FedRAMP authorization** — `us-fedramp-ssp` (System Security Plan), `us-fedramp-readiness` (3PAO RAR-style readiness)
- **Zero trust and identity** — `us-zero-trust` (CISA ZTMM v2.0), `us-icam` (OMB M-19-17 / NIST SP 800-63-3 IAL/AAL/FAL)
- **AI assurance** — `us-ai-rmf` (NIST AI RMF 1.0 + Generative AI Profile NIST AI 600-1), `us-ai-impact` (OMB M-24-10 + M-25-21)
- **Privacy** — `us-privacy-pia` (E-Gov Act §208 PIA, OMB M-03-22, SORN trigger check)
- **Supply chain** — `us-sbom-eo-14028` (EO 14028 + OMB M-22-18/M-23-16 secure-software self-attestation + SBOM)

Each command produces a standard `ARC-NNN-{TYPE}-vN.N.md` artefact. Templates ship at `arckit-us/templates/US-*-template.md` (mirrored into `.arckit/templates/` on `arckit init` like other overlays). No plugin `userConfig` changes; existing `governance_framework` field gains a recommended value `US Federal Civilian` documented in description text only (no JSON-schema change). English-only Document Control headers; no Spanish companion artefacts (Section 508 covers accessibility, not language).

Total command count moves from **71 official + 54 community = 125** to **71 official + 64 community = 135** (10 new community commands). If `arckit-uk-nhs` (PR #501, 4 commands) merges before this overlay, baseline shifts to 129 → 139. No test repo in v1.

---

## 2. Locked constraints

| Constraint | Decision | Set in |
|---|---|---|
| Scope tier | Federal civilian only — no DoD, no state, no sector | Q1 (Sec 1) |
| Command set | FedRAMP + FISMA/NIST + Zero Trust/ICAM + AI + PIA + SBOM (10 commands) | Q2 + Q3 |
| Section 508 | Excluded from v1; deferred to v2 if demand emerges | Q3 |
| Plugin slug | `arckit-us` (ISO 3166-1 alpha-2, consistent with AU/CA/FR/AT/EU) | Q4 |
| Command prefix | `us-*` | Q4 |
| Recipe count | Single `us-federal` recipe (no separate AI recipe in v1) | Q5 |
| Maintainership | `[COMMUNITY]` overlay, recruiting domain co-maintainer | Approaches |
| Test repo in v1 | No | Approaches |
| Statutory currency disclaimer | Mandatory in every command body — EO 14110 revoked Jan 2025, OMB M-24-10/M-25-21 active mandates; FedRAMP Rev 5 transition completed 2024 | Approaches |
| Min Claude Code version | Inherits arckit core floor (currently v2.1.144 per memory) | Inherited |

---

## 3. The 10 commands

Each command's frontmatter follows the existing community-overlay pattern: `description:` prefixed `[COMMUNITY]`, `argument-hint:`, `effort: high` on long-synthesis commands (SSP, NIST 800-53, AI RMF, Zero Trust, ICAM), `keep-coding-instructions: true` on the longest (SSP, NIST 800-53, AI RMF), inline warning banner about statutory currency (EO 14110 revoked Jan 2025; OMB M-24-10 and M-25-21 are the live AI mandates as of 2026-05).

### Categorization and control baseline (2)

| # | Command | Type code | Category | Anchor | Handoffs |
|---|---|---|---|---|---|
| 1 | `us-fisma-categorization` | `FIPS199` | Compliance | FIPS Publication 199; NIST SP 800-60 Vol 2 (information types) | `us-nist-800-53`, `us-privacy-pia`, `risk` |
| 2 | `us-nist-800-53` | `NIST` | Architecture | NIST SP 800-53 Rev 5 control catalog; SP 800-53B baselines (Low/Mod/High); FedRAMP Rev 5 baselines | `us-fedramp-ssp`, `us-zero-trust`, `us-sbom-eo-14028`, `adr` |

### FedRAMP authorization (2)

| # | Command | Type code | Category | Anchor | Handoffs |
|---|---|---|---|---|---|
| 3 | `us-fedramp-ssp` | `FRSSP` | Compliance | FedRAMP System Security Plan template v3.x (Mod/High); 15-section structure | `us-fedramp-readiness`, `us-zero-trust`, `us-icam` |
| 4 | `us-fedramp-readiness` | `FRRR` | Compliance | FedRAMP 3PAO Readiness Assessment Report criteria; Agency vs JAB authorization path | `service-assessment`, `roadmap`, `risk` |

### Zero trust and identity (2)

| # | Command | Type code | Category | Anchor | Handoffs |
|---|---|---|---|---|---|
| 5 | `us-zero-trust` | `ZTA` | Architecture | CISA Zero Trust Maturity Model v2.0 (5 pillars + 3 cross-cuts × 4 stages); OMB M-22-09 | `us-icam`, `us-nist-800-53`, `adr` |
| 6 | `us-icam` | `ICAM` | Architecture | OMB M-19-17 (Enabling Mission Delivery through Improved Identity, Credential, and Access Management); NIST SP 800-63-3 (IAL/AAL/FAL); PIV + login.gov | `us-zero-trust`, `us-privacy-pia`, `adr` |

### AI assurance (2)

| # | Command | Type code | Category | Anchor | Handoffs |
|---|---|---|---|---|---|
| 7 | `us-ai-rmf` | `AIRMF` | Compliance | NIST AI Risk Management Framework 1.0 (Govern/Map/Measure/Manage); NIST AI 600-1 Generative AI Profile | `us-ai-impact`, `us-privacy-pia`, `risk`, `adr` |
| 8 | `us-ai-impact` | `AIIA` | Compliance | OMB M-24-10 (rights-impacting / safety-impacting determination + minimum practices); OMB M-25-21 (AI acquisition) | `us-ai-rmf`, `us-privacy-pia`, `risk` |

### Privacy (1)

| # | Command | Type code | Category | Anchor | Handoffs |
|---|---|---|---|---|---|
| 9 | `us-privacy-pia` | `PIA` | Compliance | E-Government Act of 2002 §208; OMB M-03-22 (PIA guidance); Privacy Act of 1974 §552a; SORN trigger | `us-icam`, `us-ai-impact`, `data-model` |

### Supply chain (1)

| # | Command | Type code | Category | Anchor | Handoffs |
|---|---|---|---|---|---|
| 10 | `us-sbom-eo-14028` | `SBOM` | Compliance | EO 14028 (Improving the Nation's Cybersecurity); OMB M-22-18 + M-23-16 (secure-software self-attestation); NTIA Minimum Elements for SBOM; CISA self-attestation form | `us-nist-800-53` (SR family), `adr`, `risk` |

Doc-type codes (`FIPS199`, `NIST`, `FRSSP`, `FRRR`, `ZTA`, `ICAM`, `AIRMF`, `AIIA`, `PIA`, `SBOM`) must be added to the core plugin's `doc-types` config so `validate-arc-filename.mjs` accepts artefacts named `ARC-NNN-{TYPE}-vN.N.md`. The `PIA` code is already used by the UK and Canada overlays — confirmed safe because the filename-validator is content-agnostic; the namespacing comes from the command that produced it. If collisions are undesirable, alternative is `USPIA` — flagged for resolution during implementation, not a blocker for the spec.

### Recipe — `us-federal.yaml`

Five waves, ~2 commands each, respecting prereqs:

```yaml
name: us-federal
description: US federal civilian end-to-end ATO + AI assurance pack
waves:
  - name: baseline
    targets: [us-fisma-categorization, us-privacy-pia]
  - name: controls
    targets: [us-nist-800-53, us-icam]
  - name: posture
    targets: [us-zero-trust, us-sbom-eo-14028]
  - name: ai
    targets: [us-ai-rmf, us-ai-impact]
  - name: authorization
    targets: [us-fedramp-ssp, us-fedramp-readiness]
```

Wave rationale: FIPS 199 drives every downstream control decision, so it runs alone in `baseline` alongside the independent PIA. `controls` tailors 800-53 and designs ICAM. `posture` derives ZTMM scoring and SBOM attestation from the tailored control set. `ai` runs after privacy + controls are stable. `authorization` aggregates everything into the SSP and gates with the readiness assessment.

Teams not building AI can skip the `ai` wave with `--target` flags. Teams not pursuing FedRAMP authorization (internal-only systems) can skip the `authorization` wave and still get a coherent FISMA + AI artefact set.

---

## 4. Plugin layout

Standard community-overlay layout, identical to `arckit-au` and `arckit-ca`:

```text
arckit-us/
├── .claude-plugin/plugin.json    # name: arckit-us, dep: arckit =5.1.0
├── VERSION                       # 5.1.0
├── README.md                     # overlay overview, install, command list, status disclaimer
├── CHANGELOG.md                  # 5.1.0 initial release entry
├── commands/                     # 10 .md command files (us-*.md)
├── recipes/
│   └── us-federal.yaml
└── templates/                    # 10 .md templates (US-*-template.md)
```

No `hooks/`, no `agents/`, no `skills/`, no MCP servers — all of those stay in the core `arckit` plugin. Per `CLAUDE.md`, the core's `provenance-stamp.mjs` PostToolUse hook will auto-stamp the `## Build Provenance` block on artefacts saved under `projects/**`, so templates do **not** include that block.

---

## 5. Templates (one per command)

Ten templates under `arckit-us/templates/`, each following the standard ArcKit Document Control structure (control table → revision history → body sections → standard footer). Section contents:

| Template | Body sections |
|---|---|
| `US-FIPS199-template.md` | Information types inventory (mapped to NIST SP 800-60 Vol 2 IDs), CIA impact matrix per information type, high-water-mark categorization, supporting rationale, system boundary description. |
| `US-NIST-template.md` | Baseline selection (Low/Mod/High with rationale), control-by-control tailoring matrix (Implemented / Inherited / Hybrid / Not Applicable), parameter assignments table, compensating controls register, control source (FedRAMP Rev 5 / agency overlay). |
| `US-FRSSP-template.md` | 15-section FedRAMP SSP structure: system identification, system categorization, system owner contacts, authorizing official, system description, system environment, system interconnections, applicable laws, minimum security controls, types of users, network architecture, control implementations (per family placeholder), CM, continuous monitoring, attachments inventory. |
| `US-FRRR-template.md` | Capability statement, gap register (control-by-control), evidence inventory (artefact → control mapping), 3PAO RAR criteria checklist, recommended ATO path (Agency vs JAB), remediation roadmap with target POA&M dates. |
| `US-ZTA-template.md` | CISA ZTMM v2.0 scoring matrix (Identity / Devices / Networks / Apps & Workloads / Data × 4 stages Traditional/Initial/Advanced/Optimal), cross-cut scoring (Visibility & Analytics / Automation & Orchestration / Governance), maturity heatmap, prioritized uplift roadmap. |
| `US-ICAM-template.md` | IAL/AAL/FAL determination per use case, identity proofing flow, PIV integration architecture (if employee-facing), login.gov integration (if public-facing), federation pattern (SAML/OIDC), credential lifecycle, privileged access management. |
| `US-AIRMF-template.md` | Govern / Map / Measure / Manage assessment against AI RMF 1.0 Playbook actions, Generative AI Profile (NIST AI 600-1) addendum where applicable, residual risk register, control-to-RMF function crosswalk. |
| `US-AIIA-template.md` | Rights-impacting / safety-impacting determination tree (OMB M-24-10 Appendix I), minimum risk-management practices checklist, M-25-21 acquisition-stage controls, public disclosure obligations, agency CAIO sign-off block. |
| `US-PIA-template.md` | E-Gov §208 PIA structure, system overview, PII inventory and lifecycle, lawful authority, Privacy Act §552a alignment, SORN trigger check + reference, OMB M-03-22 conformance checklist, mitigation tracker. |
| `US-SBOM-template.md` | CISA self-attestation form fields (per OMB M-22-18 / M-23-16), SBOM minimum-elements checklist (supplier, component, version, dependency relationships, author, timestamp, unique identifier), format (CycloneDX or SPDX), provenance artefact references (SLSA level, signed attestations), exception-request rationale (if applicable). |

All templates use standard `[PLACEHOLDER]` markers. Document Control headers include `Classification` (PUBLIC / OFFICIAL / OFFICIAL-SENSITIVE per the core's standard — agencies treating these as CUI can override via the standard `default_classification` userConfig field).

---

## 6. Central guides + docs site

Community overlays do **not** ship a `guides/` directory inside the plugin. Per the AU/CA precedent, every command guide lives centrally under `docs/guides/` as a flat `.md` file, and the docs site is hand-curated static HTML (no manifest, no dynamic discovery).

**Per-command guides** (10 files under `docs/guides/`):

- `us-fisma-categorization.md`
- `us-nist-800-53.md`
- `us-fedramp-ssp.md`
- `us-fedramp-readiness.md`
- `us-zero-trust.md`
- `us-icam.md`
- `us-ai-rmf.md`
- `us-ai-impact.md`
- `us-privacy-pia.md`
- `us-sbom-eo-14028.md`

**Plus one overlay-level guide** following the `au-federal-overlay.md` / `ca-federal-overlay.md` convention:

- `us-federal-overlay.md` — Citation register with verification dates, quarterly review cadence, known limitations, domain co-maintainer context, EO 14110 revocation note + OMB M-24-10/M-25-21 currency anchor.

**Static HTML site updates** (hand-edited — no manifest):

- `docs/guides.html` — add a "United States" section (or extend the existing community block) with 11 hand-coded `<li class="app-guide-item">` entries linking to `guide-viewer.html?guide=us-<slug>` with EXPERIMENTAL status tag and a one-line description each.
- `docs/commands.html` — add 10 command entries under a US section (matches the pattern used for CA/AU/FR/AT entries).
- `docs/index.html` — add a USA community-plugin card to the community-plugin grid (mirrors UAE / FR / CA / EU / AT / AU cards).
- `docs/use-cases.html` and `docs/roles.html` — audit during implementation; if they reference community overlays, add US entries.

**Repo-root docs**:

- `README.md` — bump community-overlay count (6 → 7, or 8 if NHS PR #501 merges first); update top-line command total (currently "125 commands" → "135"); add USA row to community plugins table.
- `CLAUDE.md` — update community-plugin list in the overview section; verify `## Adding a New Slash Command` checklist remains accurate.
- `docs/DEPENDENCY-MATRIX.md` — add 10 new command rows.
- `CHANGELOG.md` (root) — new 5.1.0 entry summarising the overlay; `arckit-us/CHANGELOG.md` — initial-release entry.

The `new-command-docs` skill captures the canonical doc-update checklist; the implementation plan will invoke it rather than reinventing the list, so any update points missed here are picked up automatically.

---

## 7. Marketplace, versioning, release

- **`.claude-plugin/marketplace.json`** — add `arckit-us` entry after `arckit-au` (or wherever the alphabetical ordering lands), with `dependencies: [{ name: "arckit", version: "=5.1.0" }]` per existing community-overlay convention.
- **Version** — bump from current `5.0.5` to **`5.1.0`** (minor — net-new plugin, not a bugfix). All seven existing plugins move lockstep to 5.1.0.
- **`scripts/bump-version.sh`** — currently iterates 15 version-bearing files; needs a one-line addition to include `arckit-us/VERSION` + the new `marketplace.json` plugin entry. Confirm during implementation whether the script globs `arckit-*/VERSION` automatically or needs an explicit addition.
- **Doc-types config** — update the core plugin's doc-types registry (referenced by `validate-arc-filename.mjs`) to add the 10 new type codes (`FIPS199`, `NIST`, `FRSSP`, `FRRR`, `ZTA`, `ICAM`, `AIRMF`, `AIIA`, `PIA` already present from UK/CA, `SBOM`).
- **Release flow** (per memory):
  1. Feature branch `feat/usa-federal-overlay` → PR → squash-merge.
  2. `git checkout main && git pull` → edit both CHANGELOGs.
  3. `scripts/bump-version.sh 5.1.0`.
  4. `python scripts/converter.py` to regenerate Codex/OpenCode/Gemini/Copilot variants (community overlays are Claude-plugin-only today, so this is mostly a no-op for `arckit-us` itself, but the core still needs regenerating because of the doc-types update).
  5. Commit using `git add -u` (never `-A` per memory).
  6. `claude plugin tag <p> --dry-run` for all 8 plugins (validation, requires clean tree).
  7. Tag `v5.1.0` → `git push && git push --tags` (triggers `release.yml`).
  8. `scripts/tag-plugins.sh 5.1.0` (native per-plugin tags).
  9. `scripts/push-extensions.sh` (no community overlay propagates to the 5 ext repos, but core's doc-types update does).

---

## 8. Out of scope (deliberate)

- **No agents.** None of the 10 commands need heavy WebSearch / MCP research at run time. Templates are the source of truth. Users wanting market research can still use the core's `/arckit:research`, `/arckit:aws-research`, etc.
- **No new MCP servers.** Core's existing AWS / Microsoft Learn / Google Developer Knowledge MCPs cover sovereign-cloud equivalents (GovCloud, Azure Government, GCP Assured Workloads) — that research stays in the core's per-cloud commands.
- **No federal defense.** CMMC 2.0, RMF (NIST 800-37), DISA STIGs, IL4/IL5, DFARS 252.204-7012, DoD AI Ethics are deferred to a future `arckit-us-dod` overlay if there is demand. Keeps the civilian audience clean.
- **No state regimes.** StateRAMP, TX-RAMP, CJIS, IRS Pub 1075, and CCPA are out. Each is a candidate sibling overlay.
- **No sector-specific.** HIPAA / HITECH, GLBA, SOX, FERPA, PCI DSS deferred — would follow the `arckit-uk-nhs` sector-overlay model if/when built.
- **No Section 508 in v1.** Deferred to v5.2 if there is demand. Accessibility is a real gap, but lower priority than the ATO + AI assurance core that v1 covers.
- **No `us-research` command.** No per-jurisdiction research command exists in any other community overlay; core's research commands are jurisdiction-aware enough.
- **No test repo in v1.** Test repo creation can be done post-release once a real consumer surfaces.

---

## 9. Risks and open items

| # | Risk / open item | Mitigation / disposition |
|---|---|---|
| R1 | EO 14110 was revoked Jan 2025; replacement landscape is OMB M-24-10 (use) + M-25-21 (acquisition). Future EOs or rescissions could shift the AI assurance basis again. | Statutory currency disclaimer in every AI command body; `us-federal-overlay.md` citation register tracks verification dates; quarterly review cadence. |
| R2 | FedRAMP Rev 5 transition completed in 2024 — Rev 4 baselines are dead. Templates target Rev 5 only. | Explicit Rev 5 callout in `us-nist-800-53` and `us-fedramp-ssp` templates; no Rev 4 fallback. |
| R3 | `PIA` doc-type code collides with existing UK and Canada PIA artefacts. | Filename validator is content-agnostic; collision is cosmetic. If decided otherwise during implementation, rename to `USPIA`. Resolved during implementation, not a spec blocker. |
| R4 | OMB M-25-21 is the AI acquisition memo — relatively recent (early 2025). Practitioner-facing guidance still emerging. | Mark `us-ai-impact` as `[COMMUNITY]` with statutory currency disclaimer; revisit at v5.2 review. |
| R5 | login.gov is the standard public-facing IdP per OMB M-19-17, but agency exemptions exist. | `US-ICAM-template.md` includes alternative IdP rationale section. |
| R6 | FIPS 199 + NIST 800-60 categorization for AI / GenAI systems is under-specified at NIST. | `US-AIRMF-template.md` cross-references the AI 600-1 Generative AI Profile; `us-fisma-categorization` template includes a "GenAI considerations" optional appendix. |
| R7 | `bump-version.sh` may or may not auto-glob `arckit-*/VERSION` — needs verification. | Implementation plan validates this before the version bump step; adds explicit entry if globbing is absent. |
| R8 | No domain co-maintainer secured at v1 release. | Recruit via README.md call-out (matches `arckit-uae` post-v4.10.1 model). Overlay is `[COMMUNITY]` not official until a maintainer commits. |
| R9 | `arckit-uk-nhs` (PR #501) may merge before or after this overlay, shifting baseline counts. | Implementation plan rebases counts at version-bump time; no spec rework required. |

---

## 10. Implementation surface summary

| Category | Files | Count |
|---|---|---|
| Plugin manifest | `arckit-us/.claude-plugin/plugin.json`, `VERSION`, `README.md`, `CHANGELOG.md` | 4 |
| Commands | `arckit-us/commands/us-*.md` | 10 |
| Templates | `arckit-us/templates/US-*-template.md` | 10 |
| Recipe | `arckit-us/recipes/us-federal.yaml` | 1 |
| Central guides | `docs/guides/us-*.md` + `us-federal-overlay.md` | 11 |
| Static HTML (modified) | `docs/guides.html`, `commands.html`, `index.html`, possibly `use-cases.html` / `roles.html` | 3–5 |
| Repo docs (modified) | `README.md`, `CLAUDE.md`, `docs/DEPENDENCY-MATRIX.md`, root `CHANGELOG.md` | 4 |
| Marketplace + doc-types | `.claude-plugin/marketplace.json`, core's doc-types config | 2 |
| Version sweep | `scripts/bump-version.sh` (touches 15 files, possibly +1 for new plugin) | — |

**New files**: 36. **Modified files**: ~10. **Total impact**: ~46 files.

---

## 11. Acceptance criteria

The implementation is complete when:

1. All 10 commands exist in `arckit-us/commands/` with valid frontmatter and pass `scripts/check_references.py`.
2. All 10 templates exist in `arckit-us/templates/` and follow the Document Control + standard-footer convention.
3. `us-federal.yaml` recipe runs end-to-end via `/arckit:build --recipe us-federal` on a fresh test project with all 5 waves succeeding.
4. All 11 central guides exist in `docs/guides/` and load via `guide-viewer.html?guide=us-<slug>`.
5. `docs/guides.html`, `commands.html`, `index.html` render correctly with new USA entries (visual smoke test).
6. `arckit-us/VERSION`, `plugin.json` version, and marketplace.json entry all read `5.1.0`; all 8 plugins are at lockstep `5.1.0`.
7. `claude plugin tag arckit-us --dry-run` passes.
8. `markdownlint-cli2` passes on all changed `.md` files.
9. README community-overlay count and top-line command total are updated.
10. Doc-types registry includes the new codes; `validate-arc-filename.mjs` accepts `ARC-NNN-{FIPS199,NIST,FRSSP,FRRR,ZTA,ICAM,AIRMF,AIIA,PIA,SBOM}-vN.N.md`.
11. `arckit-us/CHANGELOG.md` documents initial release; root `CHANGELOG.md` has a 5.1.0 entry.
12. PR is squash-merged into `main` (never push direct).
13. `release.yml` succeeds and produces 8 native plugin tags; 5 ext repos receive the core's doc-types update via `push-extensions.sh`.

---

**Generated by**: brainstorming skill (superpowers v5.1.0)
**Generated on**: 2026-05-23
**ArcKit Version**: 5.0.5 (target: 5.1.0)
**Project**: arc-kit
**Model**: Claude Opus 4.7 (1M context)
