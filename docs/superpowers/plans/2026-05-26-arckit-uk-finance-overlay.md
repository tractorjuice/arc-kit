# ArcKit UK Finance Payments Overlay Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship `arckit-uk-finance` as the second sector-specific ArcKit community overlay — 4 payments-compliance commands (SCA-RTS, EMI safeguarding, Consumer Duty, Critical Third Parties dependency) targeting architects at established UK PSPs / EMIs.

**Architecture:** Pure NHS-pattern clone — new top-level plugin dir (`arckit-uk-finance/`) containing only commands + templates + manifest. Recipe and doc-types live in `arckit-claude/` core. Site cross-cutting updates in `docs/`. No new plumbing (no hooks, agents, monitors, MCP servers, userConfig).

**Tech Stack:** Claude Code plugin manifest (JSON Schema), Markdown command/template/guide authorship, YAML recipe, ES-module doc-type registry, HTML site integration, Bash release tooling, `markdownlint-cli2`, `gh` CLI.

**Spec:** `docs/superpowers/specs/2026-05-26-arckit-uk-finance-overlay-design.md`

---

## File inventory

**New files (22):**

| Path | Responsibility |
|---|---|
| `arckit-uk-finance/.claude-plugin/plugin.json` | Plugin manifest, declares `=5.3.0` dep on `arckit` core |
| `arckit-uk-finance/commands/uk-fs-sca-rts.md` | Command 1 — SCA-RTS exemption design |
| `arckit-uk-finance/commands/uk-fs-safeguarding.md` | Command 2 — EMI/PI safeguarding assessment |
| `arckit-uk-finance/commands/uk-fs-consumer-duty.md` | Command 3 — Consumer Duty board report |
| `arckit-uk-finance/commands/uk-fs-ctp-dependency.md` | Command 4 — CTP dependency assessment |
| `arckit-uk-finance/templates/uk-fs-sca-rts-template.md` | Master template wrapping SCA-RTS output |
| `arckit-uk-finance/templates/uk-fs-sca-rts-exemption-matrix-template.md` | Per-exemption applicability matrix |
| `arckit-uk-finance/templates/uk-fs-safeguarding-template.md` | Master template — safeguarding method statement |
| `arckit-uk-finance/templates/uk-fs-safeguarding-reconciliation-template.md` | Reconciliation cadence + sign-off chain |
| `arckit-uk-finance/templates/uk-fs-consumer-duty-template.md` | Master template — Consumer Duty assessment |
| `arckit-uk-finance/templates/uk-fs-consumer-duty-board-report-template.md` | Annual Board Report (PS22/9 Annex shape) |
| `arckit-uk-finance/templates/uk-fs-ctp-dependency-template.md` | Master template — CTP dependency assessment |
| `arckit-uk-finance/templates/uk-fs-ctp-dependency-register-template.md` | CTP register (per-provider entries) |
| `arckit-uk-finance/recipes/.gitkeep` | Empty placeholder; recipe lives in core |
| `arckit-uk-finance/README.md` | Overlay overview, install snippet, help-wanted co-maintainer call |
| `arckit-uk-finance/CHANGELOG.md` | Plugin changelog |
| `arckit-uk-finance/VERSION` | Plugin version, mirrors core |
| `arckit-claude/skills/arckit-build/recipes/uk-fs-payments.yaml` | Bulk-build recipe composing baseline + 4 FS commands |
| `docs/guides/uk-fs-payments-overlay.md` | Overlay-level guide |
| `docs/guides/uk-fs-sca-rts.md` | Command guide |
| `docs/guides/uk-fs-safeguarding.md` | Command guide |
| `docs/guides/uk-fs-consumer-duty.md` | Command guide |
| `docs/guides/uk-fs-ctp-dependency.md` | Command guide |

**Modified files (10):**

| Path | Change |
|---|---|
| `arckit-claude/config/doc-types.mjs` | Add 4 entries (`FSSCA`, `FSSAFE`, `FSCD`, `FSCTP`) |
| `scripts/tag-plugins.sh` | Add `arckit-uk-finance` to `PLUGINS` array |
| `scripts/bump-version.sh` | Add 2 new version-bearing locations |
| `docs/commands.html` | Tier schema row + 2 filter dropdown options + 4 command rows |
| `docs/index.html` | Sector card in jurisdiction grid + FAQ #1 #3 |
| `docs/guides.html` | New collapsible accordion section |
| `README.md` | Add overlay to community list + install snippet |
| `CLAUDE.md` | Extend community overlay list to include uk-finance |
| `CHANGELOG.md` | Root project changelog entry for v5.3.0 |
| `arckit-claude/CHANGELOG.md` | Core plugin changelog entry for v5.3.0 |

---

## Task 0: Setup

**Files:** none yet

- [ ] **Step 0.1: Create feature branch from main**

```bash
git fetch origin main
git checkout -b feat/arckit-uk-finance-overlay origin/main
```

- [ ] **Step 0.2: Verify clean working tree**

```bash
git status --short
```

Expected output: empty (modulo any local-untracked dirs like `arckit-consulting/` which are unrelated and should NOT be staged).

- [ ] **Step 0.3: Read the spec end-to-end**

Open `docs/superpowers/specs/2026-05-26-arckit-uk-finance-overlay-design.md`. Internalise the 12 locked decisions in §1, the per-command citation lists in §2, and the risk model (especially R4: every regulator citation must be a live URL, no inferred references).

---

## Task 1: Plugin scaffold

**Files:**
- Create: `arckit-uk-finance/.claude-plugin/plugin.json`
- Create: `arckit-uk-finance/VERSION`
- Create: `arckit-uk-finance/README.md`
- Create: `arckit-uk-finance/CHANGELOG.md`
- Create: `arckit-uk-finance/commands/.gitkeep`
- Create: `arckit-uk-finance/templates/.gitkeep`
- Create: `arckit-uk-finance/recipes/.gitkeep`

- [ ] **Step 1.1: Create directory skeleton**

```bash
mkdir -p arckit-uk-finance/.claude-plugin
mkdir -p arckit-uk-finance/commands
mkdir -p arckit-uk-finance/templates
mkdir -p arckit-uk-finance/recipes
touch arckit-uk-finance/commands/.gitkeep
touch arckit-uk-finance/templates/.gitkeep
touch arckit-uk-finance/recipes/.gitkeep
```

- [ ] **Step 1.2: Write `arckit-uk-finance/VERSION`**

Single line, no trailing newline:

```
5.3.0
```

- [ ] **Step 1.3: Write `arckit-uk-finance/.claude-plugin/plugin.json`**

```json
{
  "$schema": "https://json.schemastore.org/claude-code-plugin-manifest.json",
  "name": "arckit-uk-finance",
  "version": "5.3.0",
  "description": "UK Financial Services Payments Overlay for ArcKit — 4 commands for established UK Payment Service Providers, E-Money Institutions, and Payment Institutions: PSD2 SCA-RTS exemption design, EMI/PI safeguarding assessment, FCA Consumer Duty board report, and Critical Third Parties dependency assessment. Recipe: uk-fs-payments. Requires arckit core plugin. EXPERIMENTAL — community-maintained, no named domain co-maintainer at launch.",
  "author": {
    "name": "TractorJuice",
    "url": "https://github.com/tractorjuice"
  },
  "homepage": "https://arckit.org",
  "repository": "https://github.com/tractorjuice/arc-kit",
  "license": "MIT",
  "keywords": [
    "architecture",
    "governance",
    "uk",
    "finance",
    "fca",
    "pra",
    "psd2",
    "sca-rts",
    "emi",
    "safeguarding",
    "consumer-duty",
    "ctp",
    "payments"
  ],
  "dependencies": [
    {
      "name": "arckit",
      "version": "=5.3.0"
    }
  ]
}
```

- [ ] **Step 1.4: Validate manifest against the schema**

Run:

```bash
npx ajv-cli validate -s https://json.schemastore.org/claude-code-plugin-manifest.json -d arckit-uk-finance/.claude-plugin/plugin.json 2>&1 || true
```

Expected: schema validates (or, if `ajv-cli` is unavailable, run `claude plugin tag arckit-uk-finance --dry-run` from a clean tree — Step 14.2 covers this). At minimum, confirm the file parses as valid JSON: `python3 -c 'import json; json.load(open("arckit-uk-finance/.claude-plugin/plugin.json"))'` returns nothing on success.

- [ ] **Step 1.5: Write `arckit-uk-finance/README.md`**

Use this exact text:

````markdown
# arckit-uk-finance

UK Financial Services Payments Overlay for ArcKit — **community-contributed, EXPERIMENTAL**.

## Status

⚠️ **EXPERIMENTAL.** No domain co-maintainer has been recruited. Output from these commands MUST be reviewed by qualified UK FS regulatory counsel and the firm's MLRO / Compliance Officer before reliance. This is the second sector-specific overlay in ArcKit, after `arckit-uk-nhs` (clinical safety).

## What this plugin ships

4 commands for architects at established UK Payment Service Providers (PSPs), E-Money Institutions (EMIs), and Payment Institutions (PIs) scaling regulated operations:

| Command | Doc-type | Purpose |
|---|---|---|
| `/arckit:uk-fs-sca-rts` | `FSSCA` | UK PSD2 SCA-RTS exemption applicability matrix + TRA threshold rationale + fraud-monitoring framework |
| `/arckit:uk-fs-safeguarding` | `FSSAFE` | EMI/PI safeguarding method statement + reconciliation cadence + designated safeguarding bank/insurance arrangements (CRITICAL severity) |
| `/arckit:uk-fs-consumer-duty` | `FSCD` | FCA Consumer Duty annual Board Report on customer outcomes (PS22/9) |
| `/arckit:uk-fs-ctp-dependency` | `FSCTP` | Critical Third Parties dependency register + materiality assessment + resilience testing plan (PS24/16) |

Plus a `uk-fs-payments` recipe that bulk-builds the baseline scaffolding plus all four overlay commands.

## Installation

```bash
claude plugin install arckit arckit-uk-finance
```

The core `arckit` plugin is a required dependency and is auto-installed.

## Domain co-maintainer — help wanted

This overlay ships without a named domain co-maintainer (unlike `arckit-uk-nhs`, which is co-maintained by Dr Marcus Baw). If you are a UK FS practitioner with deep knowledge of PSD2 SCA-RTS, EMI safeguarding, Consumer Duty, or the Critical Third Parties regime — and would like to help validate command outputs against real regulator expectations — please open an issue at <https://github.com/tractorjuice/arc-kit/issues> tagged `co-maintainer: uk-finance`.

Until a co-maintainer is recruited, this overlay is **EXPERIMENTAL** and every command output carries an explicit "review by qualified UK FS regulatory counsel before reliance" disclaimer.

## References cited by this overlay

- FCA PSRs 2017 + SCA-RTS — <https://www.handbook.fca.org.uk/handbook/glossary/G3296p.html> and FCA PS20/6
- Electronic Money Regulations 2011 — <https://www.legislation.gov.uk/uksi/2011/99>
- FCA "Dear CEO" letter on safeguarding (Jan 2020) — <https://www.fca.org.uk/publication/correspondence/dear-ceo-letter-safeguarding-customers-funds-prudential-risk-management.pdf>
- FCA PS22/9 (Consumer Duty) — <https://www.fca.org.uk/publications/policy-statements/ps22-9-new-consumer-duty>
- FCA Consumer Duty board-report observations (April 2026) — <https://www.fca.org.uk/publications/good-and-poor-practice/consumer-duty-board-reports-good-practice-areas-improvement>
- BoE/PRA/FCA PS24/16 (Critical Third Parties) — <https://www.fca.org.uk/publications/policy-statements/ps24-16-operational-resilience-critical-third-parties-uk-financial-sector>

## License

MIT — same as `arc-kit` core.
````

- [ ] **Step 1.6: Write `arckit-uk-finance/CHANGELOG.md`**

```markdown
# Changelog — arckit-uk-finance

All notable changes to this plugin are documented here. Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/). Versioning tracks the `arckit` core plugin.

## [5.3.0] — TBD

### Added

- Initial release. UK Financial Services Payments Overlay for ArcKit — community-contributed, EXPERIMENTAL.
- 4 commands: `uk-fs-sca-rts`, `uk-fs-safeguarding`, `uk-fs-consumer-duty`, `uk-fs-ctp-dependency`.
- Recipe `uk-fs-payments` (lives in core `arckit-claude/skills/arckit-build/recipes/`).
- 4 doc-types registered in core: `FSSCA`, `FSSAFE`, `FSCD`, `FSCTP`.
- 5 usage guides under `docs/guides/`.
- Second sector-specific overlay (after `arckit-uk-nhs`).

### Status

- No named domain co-maintainer. Help wanted — see README.
```

- [ ] **Step 1.7: Commit the scaffolding**

```bash
git add arckit-uk-finance/
git commit -m "feat(uk-finance): scaffold arckit-uk-finance community plugin

Bare plugin shell — manifest, version, README, CHANGELOG, empty commands/
templates/recipes/ dirs. Strict equality dep on arckit core =5.3.0. Ships
EXPERIMENTAL with no domain co-maintainer; help-wanted call in README."
```

---

## Task 2: Register doc-types in core

**Files:**
- Modify: `arckit-claude/config/doc-types.mjs`

- [ ] **Step 2.1: Read the existing file to find the right insertion point**

```bash
grep -n "NHSDTAC\|NHSMDR" arckit-claude/config/doc-types.mjs
```

Expected: lines around 181-182 show the NHS entries. New FS entries go immediately after the NHS block, before the closing `};` of the object literal.

- [ ] **Step 2.2: Verify the 4 codes are unique against the registry**

```bash
grep -nE "'(FSSCA|FSSAFE|FSCD|FSCTP)':" arckit-claude/config/doc-types.mjs
```

Expected: empty (no existing entries). If any return, pick alternatives and update the spec before proceeding.

- [ ] **Step 2.3: Insert the 4 new doc-type entries**

Locate the section ending with the `NHSMDR` line (around line 182). Insert these 4 lines immediately after, before the next existing entry or the closing brace:

```javascript
  // UK Financial Services Payments Overlay (arckit-uk-finance) — community-contributed,
  // EXPERIMENTAL. Outputs require review by qualified UK FS regulatory counsel + firm
  // MLRO / Compliance Officer before reliance.
  'FSSCA':  { name: 'UK PSD2 SCA-RTS Exemption Design',                category: 'Compliance', regime: 'UK', severity: 'HIGH' },
  'FSSAFE': { name: 'UK EMI / PI Safeguarding Assessment',             category: 'Compliance', regime: 'UK', severity: 'CRITICAL' },
  'FSCD':   { name: 'UK FCA Consumer Duty Board Report',               category: 'Compliance', regime: 'UK', severity: 'HIGH' },
  'FSCTP':  { name: 'UK Critical Third Parties Dependency Assessment', category: 'Compliance', regime: 'UK', severity: 'HIGH' },
```

Use the `Edit` tool with the existing NHS line as the anchor for `old_string` to ensure exact placement.

- [ ] **Step 2.4: Smoke-test the module still loads**

```bash
node -e "const dt = require('./arckit-claude/config/doc-types.mjs'); console.log(Object.keys(dt).filter(k => k.startsWith('FS')))"
```

If the file is ES-module (`.mjs`), use:

```bash
node --input-type=module -e "import('./arckit-claude/config/doc-types.mjs').then(m => console.log(Object.keys(m.default ?? m).filter(k => k.startsWith('FS'))))"
```

Expected output: `['FSSCA', 'FSSAFE', 'FSCD', 'FSCTP']`.

- [ ] **Step 2.5: Commit**

```bash
git add arckit-claude/config/doc-types.mjs
git commit -m "feat(uk-finance): register FSSCA/FSSAFE/FSCD/FSCTP doc-types in core

Four UK Financial Services payments doc-type codes. FSSAFE flagged
CRITICAL severity due to FCA enforcement history on safeguarding
failures (Allied Wallet 2021, Premier FX 2018). Others HIGH."
```

---

## Task 3: Recipe in core

**Files:**
- Create: `arckit-claude/skills/arckit-build/recipes/uk-fs-payments.yaml`

- [ ] **Step 3.1: Read an existing recipe to match style**

```bash
cat arckit-claude/skills/arckit-build/recipes/uk-nhs-clinical-safety.yaml
```

Note the field ordering, indentation, comment style, and how it composes baseline targets with overlay targets.

- [ ] **Step 3.2: Write `arckit-claude/skills/arckit-build/recipes/uk-fs-payments.yaml`**

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
  reimbursement, and AML/CTF Reg 18 are deferred to v2. Community-
  contributed, EXPERIMENTAL — every output requires review by qualified
  UK FS regulatory counsel + firm MLRO / Compliance Officer before
  reliance.

targets:
  # Foundation (inherited from ArcKit baseline)
  - { id: PRIN, skill: arckit:principles }
  - { id: STKE, skill: arckit:stakeholders, deps: [PRIN] }
  - { id: REQ,  skill: arckit:requirements, deps: [STKE] }
  - { id: RISK, skill: arckit:risk,         deps: [REQ] }
  - { id: DATA, skill: arckit:data-model,   deps: [REQ] }
  - { id: DPIA, skill: arckit:dpia,         deps: [DATA] }
  - { id: ADR,  skill: arckit:adr,          deps: [REQ] }

  # UK FS payments overlay
  - id: UK_FS_SCA_RTS
    skill: arckit:uk-fs-sca-rts
    output: { project: "{P}-{NAME}", type: FSSCA }
    deps: [REQ, ADR, DPIA]
  - id: UK_FS_SAFEGUARDING
    skill: arckit:uk-fs-safeguarding
    output: { project: "{P}-{NAME}", type: FSSAFE }
    deps: [REQ, RISK]
  - id: UK_FS_CONSUMER_DUTY
    skill: arckit:uk-fs-consumer-duty
    output: { project: "{P}-{NAME}", type: FSCD }
    deps: [STKE, REQ]
  - id: UK_FS_CTP_DEPENDENCY
    skill: arckit:uk-fs-ctp-dependency
    output: { project: "{P}-{NAME}", type: FSCTP }
    deps: [ADR, RISK]

post_build:
  - arckit:traceability
  - arckit:health
```

- [ ] **Step 3.3: Validate YAML parses cleanly**

```bash
python3 -c "import yaml; yaml.safe_load(open('arckit-claude/skills/arckit-build/recipes/uk-fs-payments.yaml'))"
```

Expected: no output on success.

- [ ] **Step 3.4: Commit**

```bash
git add arckit-claude/skills/arckit-build/recipes/uk-fs-payments.yaml
git commit -m "feat(uk-finance): add uk-fs-payments recipe to core

Bulk-build chain composing 7 baseline targets with 4 UK FS overlay
targets. Flagship FSSCA. Post-build runs traceability + health checks."
```

---

## Task 4: Command 1 — `/arckit:uk-fs-sca-rts`

**Files:**
- Create: `arckit-uk-finance/commands/uk-fs-sca-rts.md`
- Create: `arckit-uk-finance/templates/uk-fs-sca-rts-template.md`
- Create: `arckit-uk-finance/templates/uk-fs-sca-rts-exemption-matrix-template.md`

- [ ] **Step 4.1: Read the NHS DCB0129 command as the reference**

```bash
cat arckit-uk-nhs/commands/uk-nhs-dcb0129.md | head -100
```

Internalise the structure: frontmatter → community-disclaimer callout → role/intent paragraph → "User Input" section → numbered task instructions → output file structure → Document Control footer instructions.

- [ ] **Step 4.2: Write `arckit-uk-finance/commands/uk-fs-sca-rts.md`**

Use this frontmatter exactly (machine-read):

```yaml
---
description: "[COMMUNITY] Generate a UK PSD2 SCA-RTS exemption design document — exemption applicability matrix, transaction risk analysis (TRA) thresholds, fraud monitoring framework, and per-exemption decision rationale."
argument-hint: "<project ID or product context, e.g. '001', 'card-not-present checkout flow'>"
effort: high
keep-coding-instructions: true
handoffs:
  - command: uk-fs-safeguarding
    description: PSP scope often overlaps EMI scope — if the firm is also issuing e-money, safeguarding is a parallel obligation.
  - command: dpia
    description: SCA design involves biometrics, device fingerprinting, and behavioural data — DPIA is required.
  - command: adr
    description: Exemption application choices are architectural and should be recorded as ADRs for traceability.
  - command: risk
    description: SCA exemption misapplication maps to fraud-loss and regulatory-enforcement risk register entries.
---
```

Then the body — follow the NHS DCB0129 pattern. The body MUST contain:

1. **Community-disclaimer callout** opening with `> ⚠️ **Community-contributed command** — not part of the officially-maintained ArcKit baseline. Output is **not** regulatory advice. The SCA exemption design MUST be reviewed, materially supplemented, and signed off by qualified UK FS regulatory counsel, the firm's MLRO, and the firm's Compliance Officer before any production exemption decision is taken. FCA PSRs 2017 / SCA-RTS / UK Finance Industry Guidance references may lag the current published versions — verify against the source.`

2. **Role-setting paragraph**: identify the AI's role as a senior payments architect drafting an SCA-RTS exemption design pack for an authorised UK PSP / EMI / PI.

3. **"## User Input" section** asking for project ID + product context.

4. **Numbered "## Task" steps** instructing the AI to:
   - Read the templates: `${CLAUDE_PLUGIN_ROOT}/templates/uk-fs-sca-rts-template.md` (master) and `${CLAUDE_PLUGIN_ROOT}/templates/uk-fs-sca-rts-exemption-matrix-template.md` (per-exemption shape).
   - Resolve project path via `${CLAUDE_PLUGIN_ROOT}/scripts/bash/create-project.sh --json` (or equivalent — verify by reading NHS command which does the same).
   - Resolve doc ID via `${CLAUDE_PLUGIN_ROOT}/scripts/bash/generate-document-id.sh ARC FSSCA <projectN>` (or equivalent — confirm signature from `scripts/bash/generate-document-id.sh` source).
   - For each of the SCA-RTS exemptions in scope (Article 10 low-value, Article 11 contactless, Article 13 corporate, Article 14 trusted beneficiary, Article 15 recurring, Article 16 low-risk based on TRA, Article 17 secure corporate, Article 18 mail-order/telephone), produce a per-exemption block in the matrix template.
   - Cite each Article reference with a live URL link to the FCA Handbook or PSRs 2017.
   - Write output to `projects/{N}-{name}/payments-compliance/ARC-{NNN}-FSSCA-v1.0.md` using the `Write` tool (not console output, to avoid 32K limit).
   - Append the standard Document Control footer + Build Provenance block (auto-stamped by the `provenance-stamp.mjs` hook).

5. **"## Required Citations" section** listing the URLs that MUST appear in the output:
   - FCA PSRs 2017 — <https://www.legislation.gov.uk/uksi/2017/752>
   - FCA Approach to Payment Services and Electronic Money — <https://www.fca.org.uk/publication/finalised-guidance/fca-approach-payment-services-electronic-money-2017.pdf>
   - FCA PS20/6 Strong Customer Authentication — <https://www.fca.org.uk/publications/policy-statements/ps20-6-strong-customer-authentication-coronavirus-extension>
   - UK Finance Industry Guidance on SCA (2025 revision) — <https://www.ukfinance.org.uk/system/files/2025-07/UK-Finance-Industry-Guidance-Strong-Customer-Authentication.pdf>

6. **"## Output Summary" section** instructing the AI to print only a short summary after `Write` (file path, exemptions covered count, citation count) — not the full document.

- [ ] **Step 4.3: Write `arckit-uk-finance/templates/uk-fs-sca-rts-template.md`**

Master wrapper template. Follow the NHS `uk-nhs-dtac-template.md` structural pattern:

1. **Document Control table** (standard ArcKit shape — Document ID, Document Type=`UK PSD2 SCA-RTS Exemption Design`, Project, Classification=`OFFICIAL`, Status=`DRAFT`, Version, Created Date, Last Modified, Review Cycle=`Quarterly`, Next Review Date, Owner, Reviewed By, Approved By, Distribution).
2. **Revision History table** (Version | Date | Author | Changes | Approved By | Approval Date).
3. **Executive Summary** — 3-4 sentences describing the firm's payments flow context and which exemptions are being pursued.
4. **1. Regulatory Context** — UK PSD2 SCA-RTS scope, applicability to the firm, regulatory perimeter (PSP, EMI, PI, ASPSP, TPP).
5. **2. Authentication Architecture** — SCA factor inventory (knowledge / possession / inherence), dynamic linking implementation, exemption-decision engine architecture.
6. **3. Exemption Applicability Matrix** — placeholder pointing to the per-exemption matrix template (Step 4.4 inserts entries here).
7. **4. Transaction Risk Analysis (TRA) Thresholds** — fraud rate per band, reference fraud rates (Article 18a), reporting cadence to FCA.
8. **5. Fraud Monitoring Framework** — real-time monitoring controls, model retraining cadence, escalation paths.
9. **6. Audit Trail Requirements** — what's logged for each exemption decision, retention period, regulator-readable format.
10. **7. References** — every citation listed in Step 4.2 §"Required Citations" must appear here.
11. **Standard ArcKit footer** (Generated by, Generated on, ArcKit Version, Project, Model) + space for the Build Provenance block (auto-appended).

Template placeholders use `{{DOUBLE_BRACES}}` for AI-filled fields, e.g. `{{PROJECT_NAME}}`, `{{FIRM_AUTHORISATION_TYPE}}`, `{{IN_SCOPE_EXEMPTIONS}}`.

- [ ] **Step 4.4: Write `arckit-uk-finance/templates/uk-fs-sca-rts-exemption-matrix-template.md`**

Per-exemption block template (the AI repeats this block for each in-scope exemption):

```markdown
### Exemption: {{EXEMPTION_NAME}} (SCA-RTS Article {{ARTICLE_NUMBER}})

**Reference**: [SCA-RTS Article {{ARTICLE_NUMBER}}]({{CITATION_URL}}) (PSRs 2017 Schedule 5)

**Decision**: {{APPLY | DO_NOT_APPLY | CONDITIONAL}}

**Applicability rationale**:
{{ONE_TO_TWO_PARAGRAPHS_EXPLAINING_WHY_THIS_EXEMPTION_IS_OR_IS_NOT_APPLIED_TO_THIS_FIRMS_PAYMENTS_FLOW}}

**Conditions / thresholds**:
- {{CONDITION_1}}
- {{CONDITION_2}}

**Audit-trail fields logged**:
- {{FIELD_1}}
- {{FIELD_2}}

**Fraud rate target / band**: {{N_BPS_REFERENCE_FRAUD_RATE}}

**Owning team**: {{TEAM}}
**Last review date**: {{DATE}}
**Next review date**: {{DATE}}
```

- [ ] **Step 4.5: Verify the command + templates lint clean**

```bash
npx markdownlint-cli2 "arckit-uk-finance/commands/uk-fs-sca-rts.md" "arckit-uk-finance/templates/uk-fs-sca-rts*.md"
```

Expected: 0 errors. If errors, fix them inline (most common: MD013 line length — break long URLs onto reference-style links; MD031 fenced code surround — add blank lines).

- [ ] **Step 4.6: Commit**

```bash
git add arckit-uk-finance/commands/uk-fs-sca-rts.md arckit-uk-finance/templates/uk-fs-sca-rts*.md
git commit -m "feat(uk-finance): add uk-fs-sca-rts command + templates

Command 1 of 4. Generates a UK PSD2 SCA-RTS exemption design pack —
applicability matrix per Articles 10-18, TRA thresholds, fraud
monitoring, audit-trail requirements. Cites FCA PSRs 2017, FCA Approach
to Payment Services, PS20/6, UK Finance Industry Guidance (2025)."
```

---

## Task 5: Command 2 — `/arckit:uk-fs-safeguarding`

**Files:**
- Create: `arckit-uk-finance/commands/uk-fs-safeguarding.md`
- Create: `arckit-uk-finance/templates/uk-fs-safeguarding-template.md`
- Create: `arckit-uk-finance/templates/uk-fs-safeguarding-reconciliation-template.md`

- [ ] **Step 5.1: Write the command file** — same structural shape as Task 4 (Step 4.2), with these specifics:

**Frontmatter:**

```yaml
---
description: "[COMMUNITY] Generate an EMI / PI safeguarding assessment — method statement (segregation vs insurance vs guarantee), designated safeguarding bank/insurance arrangements, reconciliation cadence + sign-off chain, end-to-end client-funds flow, audit plan aligned to FCA REP-CRIM expectations."
argument-hint: "<project ID or product context, e.g. '002', 'B2B virtual-account product'>"
effort: high
keep-coding-instructions: true
handoffs:
  - command: uk-fs-ctp-dependency
    description: The safeguarding bank or insurer is itself a critical dependency — assess it in the CTP dependency register.
  - command: risk
    description: Safeguarding failure is a high-impact Orange Book risk — cross-reference it in the project risk register.
  - command: operationalize
    description: Reconciliation runbook is a day-2 operational artefact — assemble it via /arckit:operationalize.
  - command: adr
    description: Safeguarding method choice (segregation vs insurance vs guarantee) is an architectural decision worth recording.
---
```

**Body required sections** (same numbered structure as Task 4 Step 4.2):

1. Community-disclaimer callout — note **CRITICAL severity** explicitly. Mention historical enforcement: Allied Wallet (2021), Premier FX (2018).
2. Role-setting paragraph.
3. "## User Input" — project ID, product context, firm authorisation type (EMI / API / SPI / TPP).
4. Numbered task steps — read templates, resolve project + doc ID (`FSSAFE`), produce method statement, produce reconciliation block (using reconciliation template), write to `projects/{N}-{name}/payments-compliance/ARC-{NNN}-FSSAFE-v1.0.md`.
5. Required citations:
   - Electronic Money Regulations 2011 — <https://www.legislation.gov.uk/uksi/2011/99>
   - Payment Services Regulations 2017 — <https://www.legislation.gov.uk/uksi/2017/752>
   - FCA "Dear CEO" letter on safeguarding (Jan 2020) — <https://www.fca.org.uk/publication/correspondence/dear-ceo-letter-safeguarding-customers-funds-prudential-risk-management.pdf>
   - FCA Approach to Payment Services and Electronic Money — <https://www.fca.org.uk/publication/finalised-guidance/fca-approach-payment-services-electronic-money-2017.pdf>
   - FCA REP-CRIM submission expectations — <https://www.handbook.fca.org.uk/handbook/SUP/16/Annex30A.html>
6. Output Summary.

- [ ] **Step 5.2: Write `arckit-uk-finance/templates/uk-fs-safeguarding-template.md`**

Master safeguarding template — Document Control + Revision History headers, then sections:

1. **Executive Summary**
2. **1. Firm authorisation context** — EMI / API / SPI / TPP, FRN, in-scope services.
3. **2. Safeguarding obligation scope** — which services / products / client populations.
4. **3. Method statement** — segregation in designated safeguarding account, comparable guarantee, or insurance policy. Justify the chosen method.
5. **4. Designated safeguarding arrangements** — bank account(s) / insurer / guarantor — including FRN where applicable and a designated-bank dependency note (cross-reference `/arckit:uk-fs-ctp-dependency`).
6. **5. End-to-end client funds flow** — diagram + narrative covering receipt → segregation → reconciliation → payout.
7. **6. Reconciliation cadence** — placeholder for content from reconciliation template.
8. **7. Audit plan** — internal audit cadence, external auditor (if any), regulator-readable evidence pack.
9. **8. Failure scenarios + recovery** — what happens if the safeguarding bank fails, if reconciliation surfaces a shortfall, if payouts are blocked.
10. **9. References** (all citations from §"Required Citations").
11. Standard footer.

Placeholders: `{{FIRM_NAME}}`, `{{FRN}}`, `{{AUTHORISATION_TYPE}}`, `{{SAFEGUARDING_METHOD}}`, `{{SAFEGUARDING_BANK}}`, etc.

- [ ] **Step 5.3: Write `arckit-uk-finance/templates/uk-fs-safeguarding-reconciliation-template.md`**

Reconciliation block template:

```markdown
## Reconciliation Cadence and Sign-Off Chain

**Reconciliation frequency**: {{DAILY | INTRADAY | WEEKLY}}

**Reconciliation steps**:

1. {{STEP_1_DESCRIPTION}} — owner: {{ROLE}}
2. {{STEP_2_DESCRIPTION}} — owner: {{ROLE}}
3. {{STEP_3_DESCRIPTION}} — owner: {{ROLE}}

**Sign-off chain**:

| Tier | Role | Trigger | SLA |
|---|---|---|---|
| 1 | {{OPS_RECONCILIATION_ANALYST}} | Daily close | Same business day |
| 2 | {{HEAD_OF_FINANCE_OR_TREASURY}} | Variance > {{THRESHOLD}} | Same business day |
| 3 | {{MLRO_OR_COMPLIANCE_OFFICER}} | Variance > {{ESCALATION_THRESHOLD}} or repeat pattern | Within 1 business day |
| 4 | {{SMF_HOLDER}} | Material shortfall | Within 1 business day, with FCA notification triggered if material |

**Evidence retention**: {{N}} years (minimum 6 years per FCA SUP 16).

**Variance handling protocol**:

- Surplus: {{PROCEDURE}}
- Shortfall: {{PROCEDURE_INCLUDING_FCA_NOTIFICATION_TRIGGER}}
- Unreconciled position older than {{DAYS}}: {{ESCALATION_PROCEDURE}}
```

- [ ] **Step 5.4: Lint + commit**

```bash
npx markdownlint-cli2 "arckit-uk-finance/commands/uk-fs-safeguarding.md" "arckit-uk-finance/templates/uk-fs-safeguarding*.md"
git add arckit-uk-finance/commands/uk-fs-safeguarding.md arckit-uk-finance/templates/uk-fs-safeguarding*.md
git commit -m "feat(uk-finance): add uk-fs-safeguarding command + templates

Command 2 of 4 — EMI/PI safeguarding assessment. CRITICAL severity
(see FCA enforcement: Allied Wallet 2021, Premier FX 2018). Produces
method statement + reconciliation cadence + 4-tier sign-off chain.
Cites EMR 2011, PSRs 2017, FCA Dear CEO 2020, FCA Approach guide,
REP-CRIM SUP 16 Annex 30A."
```

---

## Task 6: Command 3 — `/arckit:uk-fs-consumer-duty`

**Files:**
- Create: `arckit-uk-finance/commands/uk-fs-consumer-duty.md`
- Create: `arckit-uk-finance/templates/uk-fs-consumer-duty-template.md`
- Create: `arckit-uk-finance/templates/uk-fs-consumer-duty-board-report-template.md`

- [ ] **Step 6.1: Write the command file** — structural shape per Task 4, with:

**Frontmatter:**

```yaml
---
description: "[COMMUNITY] Generate an FCA Consumer Duty annual Board Report — customer outcomes evidence pack across the four outcomes (Products & Services, Price & Value, Consumer Understanding, Consumer Support), price & value assessment, target market assessment, fair-value framework."
argument-hint: "<project ID or product context, e.g. '003', 'retail FX cross-border payments'>"
effort: high
keep-coding-instructions: true
handoffs:
  - command: requirements
    description: Fair-value framework expresses as NFRs in the requirements artefact.
  - command: stakeholders
    description: Target market assessment feeds Goals + stakeholder traceability.
  - command: dpia
    description: Price-personalisation or vulnerable-customer scoring involves profiling — DPIA required.
  - command: risk
    description: Foreseeable harms map to Orange Book risk register entries.
---
```

**Body required sections:**

1. Community-disclaimer callout.
2. Role: Consumer Duty lead drafting the Annual Board Report on retail customer outcomes.
3. User Input: project ID, product context, customer population description, in-scope products/services.
4. Numbered task steps — read templates, resolve project + doc ID (`FSCD`), produce the board-report-shaped output, write to `projects/{N}-{name}/payments-compliance/ARC-{NNN}-FSCD-v1.0.md`.
5. Required citations:
   - FCA PS22/9 — <https://www.fca.org.uk/publications/policy-statements/ps22-9-new-consumer-duty>
   - FCA FG22/5 — <https://www.fca.org.uk/publication/finalised-guidance/fg22-5.pdf>
   - FCA Consumer Duty board report observations (April 2026) — <https://www.fca.org.uk/publications/good-and-poor-practice/consumer-duty-board-reports-good-practice-areas-improvement>
   - FCA Principle 12 — <https://www.handbook.fca.org.uk/handbook/PRIN/2/1.html>
6. Output Summary.

- [ ] **Step 6.2: Write `arckit-uk-finance/templates/uk-fs-consumer-duty-template.md`**

Master Consumer Duty template — Document Control + Revision History, then sections:

1. **Executive Summary**
2. **1. Firm and product context** — FRN, in-scope retail products, customer populations.
3. **2. Outcome 1: Products & Services** — target market, distribution strategy, foreseeable harms identified.
4. **3. Outcome 2: Price & Value** — fair-value assessment methodology, evidence, total cost to consumer, benchmarking.
5. **4. Outcome 3: Consumer Understanding** — communications testing, comprehension evidence, disclosure design.
6. **5. Outcome 4: Consumer Support** — service-level evidence, customer-journey analysis, complaint trends.
7. **6. Vulnerable customers** — identification, additional support, evidence.
8. **7. Foreseeable harms register** — link to project risk register entries.
9. **8. Year-on-year improvements + forward plan**
10. **9. Board attestation** — board-level sign-off block.
11. **10. References**
12. Footer.

- [ ] **Step 6.3: Write `arckit-uk-finance/templates/uk-fs-consumer-duty-board-report-template.md`**

Board-report-shaped sub-template (the annual filing format):

```markdown
## FCA Consumer Duty Annual Board Report — {{REPORTING_YEAR}}

**Firm**: {{FIRM_NAME}}
**FRN**: {{FRN}}
**Board meeting date**: {{DATE}}
**Reporting period**: {{START_DATE}} to {{END_DATE}}

### Board Attestation

The Board has reviewed the Consumer Duty assessment and confirms that the firm:

- [ ] {{Has identified the retail products and services in scope}}
- [ ] {{Has assessed outcomes against the four outcomes}}
- [ ] {{Has acted to address harm and improve outcomes where identified}}
- [ ] {{Has met its obligations under Principle 12 and PRIN 2A}}

**Attested by**: {{SMF3_CEO}}, {{SMF7_GROUP_CRO}}, {{SMF18_OTHER_BOARD}}
**Date**: {{DATE}}

### Outcome Summary Table

| Outcome | Status (Green / Amber / Red) | Key evidence | Material change since prior year | Forward action |
|---|---|---|---|---|
| Products & Services | {{COLOUR}} | {{EVIDENCE}} | {{CHANGE}} | {{ACTION}} |
| Price & Value | {{COLOUR}} | {{EVIDENCE}} | {{CHANGE}} | {{ACTION}} |
| Consumer Understanding | {{COLOUR}} | {{EVIDENCE}} | {{CHANGE}} | {{ACTION}} |
| Consumer Support | {{COLOUR}} | {{EVIDENCE}} | {{CHANGE}} | {{ACTION}} |

### Foreseeable Harms Status

| Harm ID | Description | Severity | Mitigation | Residual | Owner |
|---|---|---|---|---|---|
| {{H-1}} | {{DESCRIPTION}} | {{LEVEL}} | {{MITIGATION}} | {{LEVEL}} | {{ROLE}} |

### Vulnerable Customer Cohort Summary

{{NARRATIVE_PARAGRAPH_PLUS_QUANTITATIVE_BREAKDOWN_OF_VULNERABILITY_DRIVERS_AND_OUTCOMES}}

### Forward Plan ({{NEXT_REPORTING_YEAR}})

1. {{ACTION_1}}
2. {{ACTION_2}}
3. {{ACTION_3}}
```

- [ ] **Step 6.4: Lint + commit**

```bash
npx markdownlint-cli2 "arckit-uk-finance/commands/uk-fs-consumer-duty.md" "arckit-uk-finance/templates/uk-fs-consumer-duty*.md"
git add arckit-uk-finance/commands/uk-fs-consumer-duty.md arckit-uk-finance/templates/uk-fs-consumer-duty*.md
git commit -m "feat(uk-finance): add uk-fs-consumer-duty command + templates

Command 3 of 4 — FCA Consumer Duty Annual Board Report. Four outcomes
+ vulnerable customers + foreseeable harms register + board attestation
block. Cites PS22/9, FG22/5, FCA April 2026 board-report observations,
Principle 12."
```

---

## Task 7: Command 4 — `/arckit:uk-fs-ctp-dependency`

**Files:**
- Create: `arckit-uk-finance/commands/uk-fs-ctp-dependency.md`
- Create: `arckit-uk-finance/templates/uk-fs-ctp-dependency-template.md`
- Create: `arckit-uk-finance/templates/uk-fs-ctp-dependency-register-template.md`

- [ ] **Step 7.1: Write the command file** — structural shape per Task 4, with:

**Frontmatter:**

```yaml
---
description: "[COMMUNITY] Generate a Critical Third Parties (CTP) dependency assessment — register of designated CTPs the firm relies on (cloud hyperscalers, payment networks, BaaS providers), materiality assessment per provider, resilience testing plan including exit and substitution drills (BoE/PRA/FCA PS24/16)."
argument-hint: "<project ID or product context, e.g. '004', 'core payments platform'>"
effort: high
keep-coding-instructions: true
handoffs:
  - command: adr
    description: CTP exit / multi-vendor / substitution decisions are architectural — record them as ADRs.
  - command: risk
    description: CTP failure scenarios feed Orange Book risk register entries.
  - command: operationalize
    description: DR / exit drills evidence the resilience testing plan — assemble runbooks via /arckit:operationalize.
  - command: uk-fs-safeguarding
    description: Safeguarding bank is itself often a CTP-adjacent dependency — cross-reference the safeguarding register.
---
```

**Body required sections:**

1. Community-disclaimer callout — note the CTP regime is recent (effective Jan 2025) and designation list is still maturing; cite the current designated CTP list URL if HMT has published one.
2. Role: senior payments architect mapping the firm's dependencies on designated and non-designated CTPs.
3. User Input.
4. Numbered task steps — read templates, resolve project + doc ID (`FSCTP`), produce dependency assessment + register, write to `projects/{N}-{name}/payments-compliance/ARC-{NNN}-FSCTP-v1.0.md`.
5. Required citations:
   - BoE/PRA/FCA PS24/16 (Critical Third Parties, Nov 2024) — <https://www.fca.org.uk/publications/policy-statements/ps24-16-operational-resilience-critical-third-parties-uk-financial-sector>
   - FSMA 2023 Act — <https://www.legislation.gov.uk/ukpga/2023/29/contents>
   - HMT designation list (verify current URL at authoring time) — <https://www.gov.uk/government/collections/critical-third-parties-to-the-financial-sector>
   - FINOS Common Cloud Controls — <https://www.finos.org/common-cloud-controls-project> (referenced as a control library substrate; not vendored)
6. Output Summary.

- [ ] **Step 7.2: Write `arckit-uk-finance/templates/uk-fs-ctp-dependency-template.md`**

Master CTP dependency template — Document Control + Revision History, then sections:

1. **Executive Summary**
2. **1. Regulatory context** — CTP regime effective Jan 2025, statutory basis FSMA 2023 s24M.
3. **2. Firm's reliance on designated CTPs** — list each designated CTP the firm consumes services from (or "none" with justification).
4. **3. Non-designated material third parties** — providers that aren't formally CTPs but materially affect the firm's operational resilience.
5. **4. Materiality assessment methodology** — how the firm scores third-party materiality (e.g. revenue dependence, customer impact, recovery time).
6. **5. Dependency register** — placeholder pointing to the register template (Step 7.3).
7. **6. Resilience testing plan** — exit drills, substitution drills, scenario tests, cadence.
8. **7. Concentration risk** — geographic / vendor / function concentration analysis.
9. **8. Reporting obligations** — when the firm must notify regulators, current operational incident reporting baseline (PS7/26 alignment).
10. **9. Control library references** — FINOS Common Cloud Controls citation for cloud-control mapping.
11. **10. References**
12. Footer.

- [ ] **Step 7.3: Write `arckit-uk-finance/templates/uk-fs-ctp-dependency-register-template.md`**

Per-provider register entry template:

```markdown
### CTP / Material Third Party: {{PROVIDER_NAME}}

| Field | Value |
|---|---|
| Status | {{Designated CTP / Material non-CTP / Non-material}} |
| Designation date (if applicable) | {{DATE}} |
| Services consumed | {{LIST_OF_SERVICES}} |
| Important Business Services dependent | {{IBS_REFERENCES}} |
| Materiality score | {{HIGH / MEDIUM / LOW}} |
| Substitution time estimate | {{N days/weeks}} |
| Substitution complexity | {{LOW / MEDIUM / HIGH / NOT_SUBSTITUTABLE}} |
| Contractual exit clause | {{REFERENCE_OR_NONE}} |
| Data residency | {{LOCATIONS}} |
| Sub-contractors (Nth party) | {{KEY_NTH_PARTIES_OR_NONE_IDENTIFIED}} |
| Last resilience test date | {{DATE}} |
| Test outcome | {{PASS / PARTIAL / FAIL — narrative}} |
| Concentration risk note | {{NARRATIVE}} |
| Owning team | {{TEAM}} |
| Review cadence | {{Annual / Semi-annual}} |
| Next review date | {{DATE}} |
```

- [ ] **Step 7.4: Lint + commit**

```bash
npx markdownlint-cli2 "arckit-uk-finance/commands/uk-fs-ctp-dependency.md" "arckit-uk-finance/templates/uk-fs-ctp-dependency*.md"
git add arckit-uk-finance/commands/uk-fs-ctp-dependency.md arckit-uk-finance/templates/uk-fs-ctp-dependency*.md
git commit -m "feat(uk-finance): add uk-fs-ctp-dependency command + templates

Command 4 of 4 — Critical Third Parties dependency assessment. CTP
register + materiality scoring + resilience testing plan + concentration
risk analysis. References FINOS Common Cloud Controls as a control
library substrate (cited not vendored). Cites BoE/PRA/FCA PS24/16,
FSMA 2023, HMT designation list."
```

---

## Task 8: Release tooling

**Files:**
- Modify: `scripts/tag-plugins.sh`
- Modify: `scripts/bump-version.sh`

- [ ] **Step 8.1: Add to `tag-plugins.sh` PLUGINS array**

Read the file:

```bash
grep -n "PLUGINS=\|arckit-us\|arckit-au" scripts/tag-plugins.sh
```

Locate the `PLUGINS=(` array. Add `"arckit-uk-finance"` immediately after `"arckit-uk-nhs"` (and after `"arckit-us"` if NHS isn't merged yet — but per spec D9, NHS merges first, so add after NHS).

This must be done correctly first time — per memory, missing the array entry triggered follow-up PR #513 for `arckit-us`.

- [ ] **Step 8.2: Add to `bump-version.sh` version-bearing locations**

```bash
grep -n "arckit-uk-nhs/VERSION\|arckit-uk-nhs/.claude-plugin" scripts/bump-version.sh
```

Add two new entries mirroring the NHS lines:

- `arckit-uk-finance/VERSION`
- `arckit-uk-finance/.claude-plugin/plugin.json` (the `"version"` field)

Match the exact pattern (sed expression / awk block / whatever the script uses) used for the NHS entries.

- [ ] **Step 8.3: Dry-run the bump script**

```bash
bash scripts/bump-version.sh 5.3.0-test-dry-run 2>&1 | head -30
git diff --stat
```

Confirm both new files are touched. Then **revert** the test changes:

```bash
git checkout -- arckit-uk-finance/VERSION arckit-uk-finance/.claude-plugin/plugin.json
```

(They should still be at `5.3.0` from Step 1.2-1.3.)

- [ ] **Step 8.4: Commit**

```bash
git add scripts/tag-plugins.sh scripts/bump-version.sh
git commit -m "feat(uk-finance): wire arckit-uk-finance into release tooling

Add plugin to tag-plugins.sh PLUGINS array (avoid arckit-us-style
follow-up). Add VERSION + plugin.json to bump-version.sh locations."
```

---

## Task 9: Site integration — `docs/commands.html`

**Files:**
- Modify: `docs/commands.html`

- [ ] **Step 9.1: Read current state**

```bash
grep -n "uk-nhs-overlay\|uk-nhs\"" docs/commands.html | head -20
```

This shows where NHS rows + options live; new uk-finance entries go immediately after.

- [ ] **Step 9.2: Add tier-schema row in the plugin schema list**

Find the line `<li><strong>Tier = Community + Sector = UK NHS</strong>...` (around line 532). Add immediately after:

```html
                <li><strong>Tier = Community + Sector = UK Finance</strong> → <code>arckit-uk-finance</code> — payments slice (v1)</li>
```

- [ ] **Step 9.3: Add category filter option**

Find `<option value="uk-nhs-overlay">UK NHS Clinical Safety Overlay (Community, Sector)</option>` (around line 593). Add immediately after:

```html
                    <option value="uk-fs-overlay">UK Finance Payments Overlay (Community, Sector)</option>
```

- [ ] **Step 9.4: Add jurisdiction filter option**

Find `<option value="uk-nhs">UK NHS (sector)</option>` (around line 609). Add immediately after:

```html
                    <option value="uk-finance">UK Finance (sector)</option>
```

- [ ] **Step 9.5: Add 4 command rows**

Locate the NHS command rows (around lines 2075-2180). Insert 4 new rows immediately after the last NHS row, matching the existing row shape exactly. Template per row:

```html
                    <tr data-status="experimental" data-category="uk-fs-overlay" data-jurisdiction="uk-finance" data-tier="community">
                        <td><code>/arckit.uk-fs-sca-rts</code></td>
                        <td class="description">[COMMUNITY] UK PSD2 SCA-RTS exemption design — exemption applicability matrix per Articles 10-18 PSRs 2017, transaction risk analysis (TRA) thresholds, fraud monitoring framework, audit-trail requirements.</td>
                        <td>UK Finance Payments Overlay</td>
                        <td>UK Finance</td>
                        <td><span class="app-status-tag app-status-experimental">EXPERIMENTAL</span></td>
                    </tr>
```

Repeat for `uk-fs-safeguarding`, `uk-fs-consumer-duty`, `uk-fs-ctp-dependency` — use the per-command description text from each command's frontmatter `description:` field, with the `[COMMUNITY]` prefix kept.

- [ ] **Step 9.6: Validate HTML structure didn't break**

```bash
grep -c "data-jurisdiction=\"uk-finance\"" docs/commands.html
```

Expected: `4`.

- [ ] **Step 9.7: Commit**

```bash
git add docs/commands.html
git commit -m "feat(uk-finance): add commands.html entries for UK Finance overlay

Tier-schema row + 2 filter dropdown options + 4 command rows tagged
data-category=uk-fs-overlay data-jurisdiction=uk-finance."
```

---

## Task 10: Site integration — `docs/index.html`

**Files:**
- Modify: `docs/index.html`

- [ ] **Step 10.1: Add sector card to jurisdiction grid**

Find the UK NHS card (around lines 660-664). Add a new card immediately after the NHS closing `</a>`:

```html
                <a href="commands.html?jurisdiction=uk-finance" class="app-jurisdiction-card govuk-link--no-visited-state">
                    <div class="app-jurisdiction-card__flag">🏦</div>
                    <div class="app-jurisdiction-card__title">UK Finance (sector)</div>
                    <span class="app-jurisdiction-card__badge app-jurisdiction-card__badge--community">Community · 4 commands · payments slice</span>
                    <p class="app-jurisdiction-card__desc">PSD2 SCA-RTS exemption design (Articles 10-18 PSRs 2017), EMI / PI safeguarding assessment (EMR 2011, PSRs 2017), FCA Consumer Duty board report (PS22/9), Critical Third Parties dependency assessment (PS24/16). v1 audience: architects at established UK PSPs / EMIs / PIs scaling regulated operations.</p>
                </a>
```

- [ ] **Step 10.2: Extend FAQ #1 answer**

Find the FAQ #1 `What is ArcKit?` answer text. Update the jurisdiction list to include UK Finance — be careful with the previous decoupling-from-counts PR #516 phrasing. Final phrasing should read approximately:

> "ArcKit is an open-source Enterprise Architecture Governance and Vendor Procurement toolkit. It provides AI-assisted slash commands across an official UK Government baseline plus community-contributed jurisdictional overlays (UAE, France, Canada, Australia, EU, Austria, USA) and sector overlays (UK NHS Clinical Safety, UK Finance Payments) that turn architecture governance from scattered documents into a systematic, template-driven workflow..."

- [ ] **Step 10.3: Extend FAQ #3 answer**

The "Which jurisdictions and compliance frameworks does ArcKit cover?" answer currently ends with the UK NHS Clinical Safety mention. Append before the final period:

> "...and UK Finance Payments (PSD2 SCA-RTS Articles 10-18, EMI/PI safeguarding under EMR 2011 + PSRs 2017, FCA Consumer Duty PS22/9, Critical Third Parties regime PS24/16 — payments slice, v1, sector overlay)."

- [ ] **Step 10.4: Lint + commit**

```bash
npx markdownlint-cli2 "docs/index.html" 2>&1 || true  # HTML not linted by mdlint — fine
git add docs/index.html
git commit -m "feat(uk-finance): add UK Finance sector card to landing page

Adds 🏦 sector card to jurisdiction grid, immediately after UK NHS.
Extends FAQ #1 + #3 to mention UK Finance Payments as the second
sector overlay."
```

---

## Task 11: Site integration — `docs/guides.html`

**Files:**
- Modify: `docs/guides.html`

- [ ] **Step 11.1: Add UK Finance accordion section after UK NHS**

Find the UK NHS Clinical Safety Overlay accordion block (around lines 640-655). Insert immediately after its closing `</div>`:

```html
            <!-- UK Finance Payments Overlay (second sector overlay) -->
            <div class="app-guide-category">
                <h2 class="govuk-heading-s app-guide-category__heading" onclick="toggleCategory(this)">
                    <span class="app-guide-category__toggle">&#9662;</span> UK Finance Payments Overlay
                    <span class="app-guide-category__count">5 guides</span>
                </h2>
                <div class="app-guide-category__body">
                    <p class="govuk-body-s govuk-!-margin-bottom-2"><em>Second <strong>sector</strong>-specific community overlay (after UK NHS Clinical Safety). v1 covers the UK payments slice for architects at established Payment Service Providers, E-Money Institutions, and Payment Institutions: PSD2 SCA-RTS exemption design, EMI/PI safeguarding assessment, FCA Consumer Duty board report, and Critical Third Parties dependency assessment. <strong>No named domain co-maintainer at launch</strong> — help wanted; open a GitHub issue tagged <code>co-maintainer: uk-finance</code>. Output should be reviewed by qualified UK FS regulatory counsel + the firm's MLRO / Compliance Officer before reliance.</em></p>
                    <ul class="app-guide-list">
                        <li class="app-guide-item"><a href="guide-viewer.html?guide=uk-fs-payments-overlay" class="govuk-link">UK Finance Payments Overlay</a> <span class="app-status-tag app-status-experimental">EXPERIMENTAL</span> <span class="app-guide-desc">Overlay-level guide: purpose, when-to-use, the 4 commands, recipe, doc-type codes, v2 candidates, status, references</span></li>
                        <li class="app-guide-item"><a href="guide-viewer.html?guide=uk-fs-sca-rts" class="govuk-link">UK PSD2 SCA-RTS Exemption Design</a> <span class="app-status-tag app-status-experimental">EXPERIMENTAL</span> <span class="app-guide-desc">Exemption matrix per Articles 10-18, TRA thresholds, fraud monitoring framework, audit-trail requirements</span></li>
                        <li class="app-guide-item"><a href="guide-viewer.html?guide=uk-fs-safeguarding" class="govuk-link">UK EMI / PI Safeguarding Assessment</a> <span class="app-status-tag app-status-experimental">EXPERIMENTAL</span> <span class="app-guide-desc">Method statement (segregation / insurance / guarantee), designated safeguarding bank/insurance, reconciliation cadence + 4-tier sign-off chain, audit plan</span></li>
                        <li class="app-guide-item"><a href="guide-viewer.html?guide=uk-fs-consumer-duty" class="govuk-link">FCA Consumer Duty Board Report</a> <span class="app-status-tag app-status-experimental">EXPERIMENTAL</span> <span class="app-guide-desc">Annual Board Report on retail customer outcomes (PS22/9), four-outcome assessment, fair-value framework, vulnerable customer cohort summary, board attestation block</span></li>
                        <li class="app-guide-item"><a href="guide-viewer.html?guide=uk-fs-ctp-dependency" class="govuk-link">Critical Third Parties Dependency Assessment</a> <span class="app-status-tag app-status-experimental">EXPERIMENTAL</span> <span class="app-guide-desc">CTP register + materiality scoring + resilience testing plan + concentration risk (PS24/16). References FINOS Common Cloud Controls as a control library substrate.</span></li>
                    </ul>
                </div>
            </div>
```

- [ ] **Step 11.2: Commit**

```bash
git add docs/guides.html
git commit -m "feat(uk-finance): add UK Finance Payments Overlay accordion to guides.html

5 guide links (overlay + 4 commands) under a new collapsible section
immediately after UK NHS Clinical Safety Overlay. Sector disclaimer
+ help-wanted co-maintainer call in the section intro."
```

---

## Task 12: Author 5 guide files

**Files:**
- Create: `docs/guides/uk-fs-payments-overlay.md`
- Create: `docs/guides/uk-fs-sca-rts.md`
- Create: `docs/guides/uk-fs-safeguarding.md`
- Create: `docs/guides/uk-fs-consumer-duty.md`
- Create: `docs/guides/uk-fs-ctp-dependency.md`

- [ ] **Step 12.1: Read a reference NHS guide for shape**

```bash
cat docs/guides/uk-nhs-clinical-safety-overlay.md
```

Note the structure: H1 title → status block → Purpose → When to Use → Prerequisites → The N Commands → Recipe → Doc-type codes → Phase 2 candidates → Status → References.

- [ ] **Step 12.2: Write `docs/guides/uk-fs-payments-overlay.md`**

Sections (each 1-3 paragraphs of prose, no placeholders):

1. **# UK Finance Payments Overlay**
2. **Status**: EXPERIMENTAL · Community-contributed · No named domain co-maintainer · Output requires review by qualified UK FS regulatory counsel + MLRO/Compliance Officer before reliance.
3. **Purpose**: explain that this overlay turns regulator handbook requirements into AI-assisted artefact drafts for architects at established UK PSPs/EMIs/PIs. Second sector overlay (after NHS clinical safety).
4. **When to use**: building a new product on an existing authorisation; refreshing an existing artefact post-regulatory-change; preparing for FCA supervisory engagement.
5. **Prerequisites**: project scaffolded via `/arckit:init`; baseline artefacts (PRIN, STKE, REQ, RISK) ideally exist.
6. **The 4 commands** — one paragraph each summarising what the command produces, the doc-type code, and the key citations.
7. **Recipe `uk-fs-payments`** — what it builds, target order, post-build steps.
8. **Doc-type codes** — table FSSCA / FSSAFE / FSCD / FSCTP with name + severity.
9. **v2 candidates** (deferred from v1 per spec §8): `uk-fs-payments-or` (operational resilience for payment IBS), `uk-fs-app-fraud` (APP fraud reimbursement + Confirmation of Payee), `uk-fs-aml-reg18` (MLR 2017 firm-wide risk assessment), `uk-fs-dora-mapping` (DORA mapping for UK firms with EU operations), Open Banking conformance commands.
10. **Status**: EXPERIMENTAL. Quarterly review cadence. Help wanted: domain co-maintainer.
11. **References** — the master list of citations (all URLs that appear across the 4 commands).

- [ ] **Step 12.3: Write `docs/guides/uk-fs-sca-rts.md`**

Sections:

1. **# UK PSD2 SCA-RTS Exemption Design**
2. **Status block** (same as above).
3. **Purpose**: what the command produces.
4. **When to use**: launching CNP checkout, adding a new exemption, post-PSD3 review.
5. **The 8 exemptions covered** — one paragraph each on Articles 10, 11, 13, 14, 15, 16, 17, 18 with the Article URL.
6. **TRA fraud rate bands** — table per Article 18a reference fraud rates by band.
7. **Output structure** — what sections the output file contains.
8. **Composes with**: links to `dpia`, `adr`, `risk`, `uk-fs-safeguarding`.
9. **References**: PSRs 2017, FCA Approach to Payment Services, PS20/6, UK Finance Industry Guidance (2025).

- [ ] **Step 12.4: Write `docs/guides/uk-fs-safeguarding.md`**

Same shape as Step 12.3. Sections covering: regulatory basis (EMR 2011 reg 20, PSRs 2017 reg 23), three safeguarding methods (segregation / insurance / guarantee) with pros and cons, reconciliation cadence options, sign-off chain tiers, audit cadence, historical FCA enforcement examples (Allied Wallet 2021, Premier FX 2018) as cautionary references.

- [ ] **Step 12.5: Write `docs/guides/uk-fs-consumer-duty.md`**

Same shape. Sections covering: four outcomes (Products & Services, Price & Value, Consumer Understanding, Consumer Support), fair-value assessment methodology, vulnerable customers, foreseeable harms register, board attestation block, FCA April 2026 board-report observations.

- [ ] **Step 12.6: Write `docs/guides/uk-fs-ctp-dependency.md`**

Same shape. Sections covering: CTP regime statutory basis (FSMA 2023 s24M), designated vs material non-CTP, materiality scoring methodology, resilience testing types (exit drill, substitution drill, scenario test), concentration risk analysis, FINOS Common Cloud Controls as a control library substrate.

- [ ] **Step 12.7: Lint + commit**

```bash
npx markdownlint-cli2 "docs/guides/uk-fs-*.md"
git add docs/guides/uk-fs-*.md
git commit -m "docs(uk-finance): add 5 guides for UK Finance Payments Overlay

Overlay-level guide + per-command guides (sca-rts, safeguarding,
consumer-duty, ctp-dependency). Same structural pattern as NHS
guides. EXPERIMENTAL status, every guide opens with the review-
required disclaimer."
```

---

## Task 13: Repo-level docs

**Files:**
- Modify: `README.md`
- Modify: `CLAUDE.md`
- Modify: `CHANGELOG.md`
- Modify: `arckit-claude/CHANGELOG.md`

- [ ] **Step 13.1: Update `README.md`**

Find the existing community-overlays section. Add `arckit-uk-finance` to the list with a 1-line description and install snippet:

```markdown
- `arckit-uk-finance` (UK Finance Payments — second sector overlay; 4 commands; PSD2 SCA-RTS, EMI safeguarding, FCA Consumer Duty, Critical Third Parties). Install: `claude plugin install arckit arckit-uk-finance`. **EXPERIMENTAL** — output requires UK FS regulatory counsel review.
```

- [ ] **Step 13.2: Update `CLAUDE.md`**

Find the section listing community plugins. Update both the prose count (do NOT introduce a hard-coded total — per PR #516, we decoupled prose from counts) and the bulleted list to include `arckit-uk-finance`:

```markdown
2. **Claude Code plugins** (`arckit-claude/`, `arckit-uae/`, `arckit-fr/`, `arckit-ca/`, `arckit-eu/`, `arckit-at/`, `arckit-au/`, `arckit-us/`, `arckit-uk-nhs/`, `arckit-uk-finance/`) — installed via marketplace...
```

Ensure the prose reads "**eight** community overlays" or similar, with the breakdown adjusted: 7 jurisdictional (UAE, FR, CA, EU, AT, AU, US) + 2 sector (UK NHS, UK Finance).

- [ ] **Step 13.3: Update `CHANGELOG.md` (root)**

Add a new entry:

```markdown
## [5.3.0] — TBD

### Added

- **`arckit-uk-finance` community plugin** — second sector-specific overlay (after `arckit-uk-nhs`). 4 commands for architects at established UK PSPs / EMIs / PIs scaling regulated operations: SCA-RTS exemption design (`FSSCA`), EMI/PI safeguarding assessment (`FSSAFE`, CRITICAL severity), FCA Consumer Duty board report (`FSCD`), Critical Third Parties dependency assessment (`FSCTP`). Recipe: `uk-fs-payments`. Ships EXPERIMENTAL; help-wanted call open for a UK FS domain co-maintainer. Spec: `docs/superpowers/specs/2026-05-26-arckit-uk-finance-overlay-design.md`.
```

- [ ] **Step 13.4: Update `arckit-claude/CHANGELOG.md`**

Mirror entry in the core plugin changelog noting the 4 new doc-types and 1 new recipe.

- [ ] **Step 13.5: Commit**

```bash
git add README.md CLAUDE.md CHANGELOG.md arckit-claude/CHANGELOG.md
git commit -m "docs(uk-finance): update repo-level docs for v5.3.0

README + CLAUDE community-overlay lists extended with arckit-uk-finance
as the second sector overlay. Root + core CHANGELOG entries for v5.3.0.
Counts decoupled from prose per PR #516 convention."
```

---

## Task 14: Validation + PR

**Files:** none — verification only

- [ ] **Step 14.1: Full lint sweep**

```bash
npx markdownlint-cli2 "arckit-uk-finance/**/*.md" "docs/guides/uk-fs-*.md" "docs/superpowers/specs/2026-05-26-arckit-uk-finance-overlay-design.md" 2>&1 | tail -20
```

Expected: 0 errors. Spec dir is excluded from the lint glob so the spec line won't actually lint — that's fine.

- [ ] **Step 14.2: Plugin manifest dry-run validate**

```bash
git status --short  # confirm clean tree before plugin tag dry-run
claude plugin tag arckit-uk-finance --dry-run
```

Expected: tag command would succeed (no schema errors, no missing files).

- [ ] **Step 14.3: Recipe resolution check**

If the `arckit-build` skill has a CLI mode for validating recipes (check by reading `arckit-claude/skills/arckit-build/SKILL.md`), run it. Otherwise hand-verify:

```bash
python3 -c "
import yaml
r = yaml.safe_load(open('arckit-claude/skills/arckit-build/recipes/uk-fs-payments.yaml'))
ids = {t.get('id') if isinstance(t, dict) else None for t in r['targets']}
ids.discard(None)
for t in r['targets']:
    if isinstance(t, dict):
        for d in t.get('deps', []):
            assert d in ids, f'unresolved dep: {d} in target {t.get(\"id\")}'
print('OK — all deps resolve, target count:', len(r['targets']))
"
```

Expected: `OK — all deps resolve, target count: 11`.

- [ ] **Step 14.4: Doc-type uniqueness re-check**

```bash
node --input-type=module -e "
import('./arckit-claude/config/doc-types.mjs').then(m => {
  const types = m.default ?? m;
  const all = Object.keys(types);
  const dupes = all.filter((k, i) => all.indexOf(k) !== i);
  if (dupes.length) { console.error('Duplicate doc-type codes:', dupes); process.exit(1); }
  console.log('OK — all', all.length, 'doc-type codes unique');
});
"
```

Expected: `OK — all NN doc-type codes unique`.

- [ ] **Step 14.5: Citation URL clickthrough (manual)**

Open each command and template, identify every URL inside, and click through. Per spec R4, **every regulator URL must resolve to a live page**. If any URL 404s, replace with the current source (use the regulator's site search) or remove the citation and flag in a `TBC` comment for the next reviewer.

Document the verification in the PR description as a checklist of links + their HTTP status.

- [ ] **Step 14.6: Site rendering check**

Start a local static server and browse:

```bash
cd docs && python3 -m http.server 8000
```

In a browser:

- `http://localhost:8000/index.html` → confirm UK Finance sector card renders with 🏦, "(sector)" suffix, and the correct community badge
- `http://localhost:8000/commands.html?jurisdiction=uk-finance` → confirm 4 rows show
- `http://localhost:8000/guides.html` → confirm UK Finance Payments Overlay accordion expands and 5 links work
- `http://localhost:8000/guide-viewer.html?guide=uk-fs-payments-overlay` → confirm each guide renders

Kill the server when done: `Ctrl+C`.

- [ ] **Step 14.7: Push branch + open PR**

```bash
git push -u origin feat/arckit-uk-finance-overlay
gh pr create --base main --head feat/arckit-uk-finance-overlay \
  --title "feat(uk-finance): add arckit-uk-finance community overlay (v5.3.0)" \
  --body-file <(cat <<'EOF'
## Summary

Second sector-specific ArcKit community overlay (after `arckit-uk-nhs`). v1 ships **4 commands** for architects at established UK Payment Service Providers, E-Money Institutions, and Payment Institutions scaling regulated operations:

- `/arckit.uk-fs-sca-rts` (`FSSCA`) — UK PSD2 SCA-RTS exemption design (Articles 10-18, TRA thresholds, fraud monitoring)
- `/arckit.uk-fs-safeguarding` (`FSSAFE`) — EMI/PI safeguarding assessment (EMR 2011, PSRs 2017, FCA Dear CEO 2020) — **CRITICAL severity**
- `/arckit.uk-fs-consumer-duty` (`FSCD`) — FCA Consumer Duty annual Board Report (PS22/9)
- `/arckit.uk-fs-ctp-dependency` (`FSCTP`) — Critical Third Parties dependency assessment (PS24/16)

Plus a `uk-fs-payments` recipe composing 7 baseline targets with the 4 FS commands.

## Status

**EXPERIMENTAL.** No named domain co-maintainer at launch — help-wanted call open in the plugin README. Every command output carries an explicit "review by qualified UK FS regulatory counsel + firm MLRO / Compliance Officer before reliance" disclaimer.

## Spec

`docs/superpowers/specs/2026-05-26-arckit-uk-finance-overlay-design.md` (merged via #517).

## Citation verification

Per spec §R4, every regulator URL in the overlay must resolve. Below is the manual clickthrough status from Step 14.5 of the plan:

- [ ] FCA PSRs 2017 — `<status>`
- [ ] FCA Approach to Payment Services — `<status>`
- [ ] FCA PS20/6 — `<status>`
- [ ] UK Finance Industry Guidance on SCA (2025) — `<status>`
- [ ] EMR 2011 — `<status>`
- [ ] FCA Dear CEO letter on safeguarding (Jan 2020) — `<status>`
- [ ] FCA REP-CRIM SUP 16 Annex 30A — `<status>`
- [ ] FCA PS22/9 — `<status>`
- [ ] FCA FG22/5 — `<status>`
- [ ] FCA Consumer Duty board-report observations (Apr 2026) — `<status>`
- [ ] FCA Principle 12 — `<status>`
- [ ] BoE/PRA/FCA PS24/16 — `<status>`
- [ ] FSMA 2023 — `<status>`
- [ ] HMT designated CTP list — `<status>`
- [ ] FINOS Common Cloud Controls — `<status>`

## Test plan

- [ ] Plugin manifest validates against JSON Schema (Step 14.2)
- [ ] Recipe `uk-fs-payments` resolves cleanly — 11 targets, all deps satisfied (Step 14.3)
- [ ] Doc-type codes `FSSCA`/`FSSAFE`/`FSCD`/`FSCTP` are unique and load correctly (Step 14.4)
- [ ] All regulator citation URLs return HTTP 200 (Step 14.5)
- [ ] `markdownlint-cli2` clean on all new + modified Markdown
- [ ] `docs/index.html` UK Finance sector card renders
- [ ] `docs/commands.html?jurisdiction=uk-finance` shows 4 rows
- [ ] `docs/guides.html` UK Finance accordion expands; 5 guide links work
- [ ] `claude plugin install arckit arckit-uk-finance` would resolve cleanly (manual verify against a test clone)
EOF
)
```

- [ ] **Step 14.8: Wait for CI**

```bash
gh pr checks $(gh pr view --json number -q .number)
```

Expected: lint passes; plugin-tag-dry-run passes. Fix anything that fails.

- [ ] **Step 14.9: Self-review the PR diff**

```bash
gh pr diff $(gh pr view --json number -q .number) | head -200
```

Final scan: any `TBD`, `TODO`, placeholder URLs, missing severity codes, wrong doc-types? Fix any before requesting merge.

- [ ] **Step 14.10: Merge (only after Mark's review)**

This step is **gated on Mark's explicit approval** — do not squash-merge autonomously. The overlay carries regulatory liability and ships without a co-maintainer; Mark should eyeball every command's body before merge.

```bash
# only after Mark says "merge"
gh pr merge --squash --delete-branch
```

---

## Memory update (post-merge action)

After merge, save a project memory entry recording:

- v5.3.0 shipped with `arckit-uk-finance` as the second sector overlay
- Commands: SCA-RTS, safeguarding, Consumer Duty, CTP dependency
- Doc-types: FSSCA, FSSAFE (CRITICAL), FSCD, FSCTP
- No co-maintainer — help-wanted call active
- Outstanding v2 candidates: payments-or, app-fraud, aml-reg18, dora-mapping, open-banking-*

Add an entry to `MEMORY.md` and a topic file `project_uk_finance_overlay.md` (parallel to `project_uae_overlay.md`).

---

**End of plan. Estimated effort: 1-2 days of focused authorship + 0.5 day validation + PR.**
