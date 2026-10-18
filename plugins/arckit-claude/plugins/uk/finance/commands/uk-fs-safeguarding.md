---
description: "[COMMUNITY] Generate an EMI / PI safeguarding assessment — method statement (segregation vs insurance vs guarantee), designated safeguarding bank/insurance arrangements, reconciliation cadence + sign-off chain, end-to-end client-funds flow, audit plan aligned to CASS 15 and the FCA monthly safeguarding return."
doc-type: FSSAFE
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
allowed-tools:
  - Read(/${CLAUDE_PLUGIN_ROOT}/**)
  - Bash(bash ${CLAUDE_PLUGIN_ROOT}/scripts/bash/create-project.sh *)
  - Bash(bash "${CLAUDE_PLUGIN_ROOT}/scripts/bash/create-project.sh" *)
  - Bash(${CLAUDE_PLUGIN_ROOT}/scripts/bash/create-project.sh *)
  - Bash(node ${CLAUDE_PLUGIN_ROOT}/scripts/generate-document-id.mjs *)
  - Bash(node "${CLAUDE_PLUGIN_ROOT}/scripts/generate-document-id.mjs" *)
---

> ⚠️ **Community-contributed command — CRITICAL SEVERITY** — not part of the officially-maintained
> ArcKit baseline. Output is **not** regulatory advice. Safeguarding failures have led to firm
> collapse and FCA enforcement action: **Allied Wallet (2021)** had its authorisation cancelled after
> the FCA found it holding client funds in non-compliant accounts; **Premier FX (2018)** failed with
> a £10m shortfall in customer funds after inadequate segregation. The safeguarding assessment
> produced by this command MUST be reviewed, materially supplemented, and signed off by qualified
> UK FS regulatory counsel, the firm's SMF holder for safeguarding (primary accountability —
> typically SMF1/SMF24 in larger firms), the firm's MLRO (for AML-angle review of the client-money
> position, not primary safeguarding accountability), and the firm's Compliance Officer before any
> production safeguarding arrangement is established. Regulatory citations reflect the position as
> at the document creation date; verify against current FCA publications before reliance. The FCA
> Approach Document (current edition May 2026), PS25/12 (August 2025) and the CASS 15 rules it
> introduced from 7 May 2026 must be checked for any changes to safeguarding obligations introduced
> since this command was authored.

You are a senior payments architect drafting a safeguarding assessment for an authorised UK
Electronic Money Institution (EMI) or Authorised Payment Institution (API), or a registered Small
Payment Institution (SPI) that voluntarily safeguards, subject to the Electronic Money Regulations
2011 (SI 2011/99), the Payment Services Regulations 2017 (SI 2017/752) and, from 7 May 2026, the
FCA's CASS 15 safeguarding rules (FCA 2025/38, PS25/12). The assessment covers: safeguarding method
selection and justification, designated safeguarding bank or insurer arrangements, end-to-end
client-funds flow, reconciliation cadence and sign-off chain, and an audit plan aligned to FCA
supervisory expectations including the monthly safeguarding return (REP027, SUP 16.14A and SUP 16
Annex 29BR).

## User Input

```text
$ARGUMENTS
```

## Task

### Step 1 — Resolve the project path

Run:

```bash
bash ${CLAUDE_PLUGIN_ROOT}/scripts/bash/create-project.sh --json --name "<product-context>"
```

If the project already exists, locate it by scanning `projects/` for the matching numbered directory
instead of recreating it. Extract `project_dir` and `project_number` from the JSON output.

### Step 2 — Generate the document ID

Work out `{VERSION}` first with `${CLAUDE_PLUGIN_ROOT}/references/version-detection.md`: a re-run writes the next version beside the earlier file, never over it.

Run:

```bash
node ${CLAUDE_PLUGIN_ROOT}/scripts/generate-document-id.mjs <PROJECT_NUMBER> FSSAFE {VERSION} --filename
```

This produces a filename of the form `ARC-NNN-FSSAFE-v{VERSION}.md`. FSSAFE is the doc-type code for this
artefact.

### Step 3 — Read the templates and rendering partials

Use the Read tool to read both templates (check `.arckit/templates-custom/` first, fall back to
`${CLAUDE_PLUGIN_ROOT}/templates/`):

- `${CLAUDE_PLUGIN_ROOT}/templates/uk-fs-safeguarding-template.md` — master artefact template
- `${CLAUDE_PLUGIN_ROOT}/templates/uk-fs-safeguarding-reconciliation-template.md` — reconciliation
  block (inlined into §6 of the master template)

Then read the rendering and citation partials so the Document Control header and inline citation
markers are applied consistently with peer ArcKit commands:

- `${CLAUDE_PLUGIN_ROOT}/templates/_partials/RENDERING.md` — Document Control header rendering
  rules and Classification field substitution guidance (resolves the `<!-- DOC-CONTROL-HEADER -->`
  marker and the `{{CLASSIFICATION}}` placeholder from `user_config.default_classification`).
- `${CLAUDE_PLUGIN_ROOT}/references/citation-instructions.md` — inline citation marker format and
  External References block requirements.

### Step 4 — Gather context

Read (if present):

- `projects/000-global/ARC-000-PRIN-*.md` — architecture principles
- The project's REQ artefact — extract NFR-SEC and NFR-COMP requirements, INT-* integration points,
  and any data relating to funds flow or client-money volumes
- The project's DATA or data-model artefact — for account structures, ledger design, and any
  client-funds balance data that will feed the reconciliation design
- `projects/<project_dir>/external/` — any regulatory evidence, pre-existing safeguarding audits,
  FCA correspondence, or safeguarding bank agreements placed there by the user

### Step 5 — Generate the safeguarding method statement

Determine the safeguarding method based on the firm's authorisation type and the user input.
Document the chosen method with explicit justification:

| Authorisation type | Applicable regulation | Safeguarding method options |
|--------------------|-----------------------|-----------------------------|
| EMI (authorised) | EMR 2011 Reg 20 (obligation); Reg 21 (segregation); Reg 22 (insurance/guarantee alternative); CASS 15 | Segregation in designated account; insurance policy; comparable guarantee |
| API (authorised) | PSRs 2017 Reg 23 (segregation paras (5)–(11); insurance/guarantee paras (12)–(13)); CASS 15 | Segregation in designated account; insurance policy; comparable guarantee |
| SPI (registered) | PSRs 2017 Reg 23(16)–(17) — **voluntary** safeguarding only; SPIs are not required to safeguard | If the SPI elects to safeguard voluntarily, the same Reg 23 mechanics (paras (5)–(13)) apply and the insolvency-priority protection in Reg 23(14)–(15) follows |

For **segregation** (the most common method), document:

- The designated safeguarding bank account(s): institution name, FCA FRN, account type, sort
  code/IBAN, date designated
- The segregation trigger: relevant funds must be kept segregated from any other funds from
  receipt (PSRs 2017 Reg 23(5); EMR 2011 Reg 21(1)), and if still held at the end of the business
  day following the day of receipt they must be placed in a separate account with an authorised
  credit institution or the Bank of England, or invested in relevant assets held with an
  authorised custodian (PSRs 2017 Reg 23(6); EMR 2011 Reg 21(2)). For EMIs, funds received by
  payment instrument need not be safeguarded until credited to or otherwise made available to the
  EMI, but must be safeguarded "by the end of five business days after the date on which the
  electronic money has been issued" (EMR 2011 Reg 20(4))
- How the firm will ensure no commingling with operational funds
- The organisational controls to prevent the designated account being used for non-safeguarding
  purposes (EMR 2011 Reg 21(3)(b) and PSRs 2017 Reg 23(7)(b) — the account must "be used only for
  holding those funds or assets")

For **insurance or comparable guarantee** (alternative method), document:

- The insurer or guarantor: institution name, FCA FRN (if applicable), policy/guarantee reference
- The coverage amount and any sublimits
- The trigger condition for the insurer/guarantor to pay into the designated account on insolvency
- Confirmation that the policy/guarantee is in place **before** any relevant funds are received

### Step 6 — Generate the reconciliation block

Using the `uk-fs-safeguarding-reconciliation-template.md` template, populate a reconciliation block
covering:

- Reconciliation cadence: internal and external safeguarding reconciliations as frequently as
  necessary and at least once each reconciliation day (CASS 15.8.19R and CASS 15.8.42R); any
  intraday reconciliation is a firm decision based on its volumes, not a regulatory threshold
- The four-tier sign-off chain (operational → senior manager → CFO/Treasurer → SMF holder)
- Variance handling protocol (surplus, shortfall, unreconciled position)
- FCA notification triggers: CASS 15.8.60R requires the firm to inform the FCA in writing without
  delay in the listed cases, including a material failure to reconcile or to pay a shortfall into
  a relevant funds account
- Record retention: 5 years, unless a CASS 15 rule states otherwise (CASS 15.8.8R(3))

Insert the completed reconciliation block into the `{{INSERT_RECONCILIATION_BLOCK_HERE}}`
placeholder in the master template (§6).

### Step 7 — Populate the master template

Using the master template, fill all `{{PLACEHOLDER}}` fields with information derived from the user
input, existing project artefacts, and the method and reconciliation content from Steps 5-6.

Populate the **End-to-end client funds flow** section (§5) with:

- A text-based flow diagram (Mermaid or ASCII) showing: funds received from customer → segregation
  step → designated safeguarding account → reconciliation gate → payout to payee
- Narrative for each node in the flow, identifying the system/component responsible and the
  data record created at each point
- Identification of any intra-day float period and how it is managed

Populate the **Audit plan** section (§7) with:

- Internal audit cadence (at minimum annual; quarterly is FCA best practice for high-volume firms)
- External auditor role and the engagement scope — from 7 May 2026 SUP 3A sets the safeguarding
  audit requirements; an institution that has not been required to safeguard more than £100,000
  of relevant funds at any time for at least 53 weeks is exempt (SUP 3A.1.1R(2))
- Regulator-readable evidence pack: the specific data and reports that would satisfy an FCA
  supervisory review — including the monthly safeguarding return (REP027), submitted within 15
  business days of each month end under SUP 16.14A, with content set by SUP 16 Annex 29BR. The same
  return applies to authorised PIs, authorised and small EMIs, credit unions issuing e-money and
  SPIs that opt in. REP-CRIM is a different return: the Annual Financial Crime Report (SUP 16.23,
  form in SUP 16 Annex 42AR), which SUP 16.15.5AD applies to EMIs; the FCA Approach Document lists
  it for EMIs with revenue of £5 million or more

Populate the **Failure scenarios and recovery** section (§8) with at least three scenarios:

1. Safeguarding bank failure — how funds are protected (FSCS applicability, portability to a
   second bank, insolvency priority claim)
2. Reconciliation shortfall — escalation path, FCA notification obligation, remediation timeline
3. Payout blockage — what happens if the safeguarding bank freezes the account (e.g., Sanctions
   screening hit on the account) and how the firm continues to meet redemption obligations

### Step 8 — Write the artefact

Create the output directory if it does not already exist:
`<project_dir>/payments-compliance/`

Before writing, read `${CLAUDE_PLUGIN_ROOT}/references/quality-checklist.md` and verify all **Common Checks** plus the **FSSAFE** per-type checks pass. Fix any failures before proceeding.

Use the **Write tool** to save the completed document to:
`projects/<NNN>-<slug>/payments-compliance/ARC-<NNN>-FSSAFE-v1.0.md`

Append the standard ArcKit Document Control footer at the end of the document:

```markdown
---

**Generated by**: ArcKit `/arckit-uk-finance:uk-fs-safeguarding` command
**Generated on**: [DATE]
**ArcKit Version**: [VERSION]
**Project**: [PROJECT_NAME]
**Model**: [AI_MODEL]
```

The `provenance-stamp.mjs` hook in core automatically appends a `## Build Provenance` block to
artefacts under `projects/**` — do not include it manually.

### Step 9 — Output summary

Print the summary per `## Output Summary` below. Do not echo the full artefact.

## Important Notes

- **Safeguarding obligations apply from the moment funds are received, not when payment is
  initiated.** The segregation trigger is receipt of funds, not initiation of the payment
  transaction. Any float period between receipt and placement in the designated account must be
  explicitly documented and minimised.
- **Insurance and guarantee methods require the policy or guarantee to be in place BEFORE the
  relevant funds are received.** EMR 2011 Reg 22(1) and PSRs 2017 Reg 23(12) require relevant
  funds to be covered by the policy or guarantee, so a retroactive arrangement does not satisfy
  them. From 7 May 2026 the firm must also notify the FCA at least 2 months before it relies on the
  insurance or guarantee method for the first time, changes the amount of cover, or changes its
  insurer or guarantor (CASS 15.5.7R).
- **Reconcile at least once each reconciliation day.** From 7 May 2026 CASS 15.8.19R (internal)
  and CASS 15.8.42R (external) require safeguarding reconciliations as frequently as necessary and
  no less than once each reconciliation day (a business day). Whether to add intraday
  reconciliations is the firm's own decision, based on its volumes and risk; there is no
  regulatory volume threshold for it.
- **Define the shortfall notification triggers explicitly.** CASS 15.8.60R requires the firm to
  inform the FCA in writing without delay in the cases it lists, including where it will be
  unable to, or materially fails to, pay a shortfall into a relevant funds account or conduct its
  reconciliations. "Materially" is not given a numeric threshold; document the firm's own
  definition (e.g., a shortfall exceeding £X or Y% of safeguarded funds), have it approved by the
  Compliance Officer, and make it trigger notification to the SMF holder and the FCA.
- **The safeguarding bank itself is a critical dependency.** If the safeguarding bank fails,
  freezes the account, or terminates the relationship, the firm may be unable to meet payout
  obligations within the regulatory timeframe. Feed the safeguarding bank into the firm's CTP
  (Critical Third Party) dependency register — use `/arckit-uk-finance:uk-fs-ctp-dependency` for this.
- **Design for the monthly safeguarding return from the start.** The return (REP027) is submitted
  within 15 business days of each month end (SUP 16.14A.3R) and its content is set by SUP 16
  Annex 29BR. Design the reconciliation data flow to produce those fields; retro-fitting reporting
  fields after the system is built is a common and costly error. Do not label it REP-CRIM: REP-CRIM
  is the Annual Financial Crime Report (SUP 16.23, SUP 16 Annex 42AR), not a safeguarding return.
- **Allied Wallet (2021) and Premier FX (2018) enforcement context.** In both cases the FCA found
  that firms had either failed to designate accounts correctly, allowed commingling of safeguarded
  and operational funds, or failed to reconcile promptly. These are not edge-case failures — they
  are the direct consequence of treating safeguarding as a one-time setup task rather than a
  continuous operational control. This document must be reviewed at least annually and whenever
  the firm's products, volumes, or safeguarding bank arrangements change.
- **PS25/12 safeguarding reform (FCA, August 2025).** PS25/12, following consultation CP24/20
  (September 2024), made the Payments and Electronic Money (Safeguarding) Instrument 2025
  (FCA 2025/38), in force 7 May 2026. It added CASS 15 (safeguarding rules, including daily
  reconciliations), CASS 10A (resolution pack), SUP 3A (safeguarding audits) and SUP 16.14A (the
  monthly safeguarding return). PS25/12 also describes later "end-state" rules that would replace
  the EMR and PSR safeguarding requirements with a trust-based regime; check their status before
  relying on this assessment. (PS24/9 is an unrelated policy statement on payment for investment
  research; do not cite it for safeguarding.)

## Required Citations

Each of these URLs was verified as live at authoring time. Include all of them in the §9 References
section of the generated document. Verify against the source before relying on this output — FCA
and legislation.gov.uk publications are updated without prior notice.

> **Note on the FCA Dear CEO letter (Jan 2020):** The original PDF URL
> (`/publication/correspondence/dear-ceo-letter-safeguarding-customers-funds-prudential-risk-management.pdf`)
> returned HTTP 404 at command-authoring time. The FCA's safeguarding supervisory expectations are
> now primarily expressed through the Approach Document (May 2026 edition, Chapter 10), PS25/12 and
> CASS 15. If a current Dear CEO letter on safeguarding is available via the FCA key publications
> page, cite it in addition to the references below.
>
> **Note on the FCA Handbook links:** The FCA Handbook is a single-page application. The chapter
> URLs below (`handbook.fca.org.uk/handbook/sup16`, `handbook.fca.org.uk/handbook/cass15`) open the
> whole chapter; find SUP 16.14A and SUP 16 Annex 29BR within SUP 16. Older
> `www.handbook.fca.org.uk/handbook/SUP/16/` links redirect inconsistently.

| Reference | Verified URL |
|-----------|-------------|
| Electronic Money Regulations 2011 (SI 2011/99) — Reg 20 safeguarding | <https://www.legislation.gov.uk/uksi/2011/99/regulation/20> |
| Electronic Money Regulations 2011 (SI 2011/99) — full instrument | <https://www.legislation.gov.uk/uksi/2011/99> |
| Payment Services Regulations 2017 (SI 2017/752) — Reg 23 safeguarding | <https://www.legislation.gov.uk/uksi/2017/752/regulation/23> |
| Payment Services Regulations 2017 (SI 2017/752) — full instrument | <https://www.legislation.gov.uk/uksi/2017/752> |
| Payment Services and Electronic Money — Our Approach (FCA, May 2026) | <https://www.fca.org.uk/publication/finalised-guidance/payment-services-electronic-money-approach.pdf> |
| FCA PS25/12 — Changes to the safeguarding regime for payments and e-money firms (August 2025) | <https://www.fca.org.uk/publications/policy-statements/ps25-12-changes-safeguarding-regime-payments-and-e-money-firms> |
| FCA 2025/38 — Payments and Electronic Money (Safeguarding) Instrument 2025 (in force 7 May 2026) | <https://api-handbook.fca.org.uk/files/instrument/Glossary-GEN-CASS-SUP/FCA%202025/38-2026-05-07.pdf> |
| FCA CP24/20 — Changes to the safeguarding regime for payments and e-money firms (September 2024) | <https://www.fca.org.uk/publication/consultation/cp24-20.pdf> |
| FCA Handbook CASS 15 — Payment services and electronic money: relevant funds | <https://handbook.fca.org.uk/handbook/cass15> |
| FCA Handbook SUP 16 — Reporting requirements (SUP 16.14A and Annex 29BR, monthly safeguarding return) | <https://handbook.fca.org.uk/handbook/sup16> |
| FCA EMI and Payment Institutions — key publications | <https://www.fca.org.uk/firms/emi-payment-institutions-key-publications> |

## Output Summary

After writing the artefact, print only:

- File path written
- Safeguarding method selected (segregation / insurance / guarantee)
- Designated safeguarding bank or insurer name (if provided in user input)
- Reconciliation frequency confirmed
- Any items requiring legal sign-off or flagged as CONDITIONAL before production implementation
- Citation count
