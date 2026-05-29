---
description: "[COMMUNITY] Generate an EMI / PI safeguarding assessment — method statement (segregation vs insurance vs guarantee), designated safeguarding bank/insurance arrangements, reconciliation cadence + sign-off chain, end-to-end client-funds flow, audit plan aligned to FCA REP-CRIM expectations."
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
> Approach Document (current edition May 2026) and PS24/9 safeguarding reforms must be checked for
> any changes to safeguarding obligations introduced since this command was authored.

You are a senior payments architect drafting a safeguarding assessment for an authorised UK
Electronic Money Institution (EMI) or Authorised Payment Institution (API), or a registered Small
Payment Institution (SPI) that voluntarily safeguards, subject to the Electronic Money Regulations
2011 (SI 2011/99) and the Payment Services Regulations 2017 (SI 2017/752). The assessment covers:
safeguarding method selection and justification, designated safeguarding bank or insurer
arrangements, end-to-end client-funds flow, reconciliation cadence and sign-off chain, and an audit
plan aligned to FCA supervisory expectations including REP-CRIM and the monthly safeguarding return
(SUP 16).

## User Input

```text
$ARGUMENTS
```

## Task

### Step 1 — Resolve the project path

Run:

```bash
.arckit/scripts/bash/create-project.sh --json --name "<product-context>"
```

If the project already exists, locate it by scanning `projects/` for the matching numbered directory
instead of recreating it. Extract `project_dir` and `project_number` from the JSON output.

### Step 2 — Generate the document ID

Run:

```bash
.arckit/scripts/bash/generate-document-id.sh <PROJECT_NUMBER> FSSAFE --filename
```

This produces a filename of the form `ARC-NNN-FSSAFE-v1.0.md`. FSSAFE is the doc-type code for this
artefact.

### Step 3 — Read the templates and rendering partials

Use the Read tool to read both templates (check `.arckit/templates-custom/` first, fall back to
`.arckit/templates/`):

- `.arckit/templates/uk-fs-safeguarding-template.md` — master artefact template
- `.arckit/templates/uk-fs-safeguarding-reconciliation-template.md` — reconciliation
  block (inlined into §6 of the master template)

Then read the rendering and citation partials so the Document Control header and inline citation
markers are applied consistently with peer ArcKit commands:

- `.arckit/templates/_partials/RENDERING.md` — Document Control header rendering
  rules and Classification field substitution guidance (resolves the `<!-- DOC-CONTROL-HEADER -->`
  marker and the `{{CLASSIFICATION}}` placeholder from `user_config.default_classification`).
- `.arckit/references/citation-instructions.md` — inline citation marker format and
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
| EMI (authorised) | EMR 2011 Reg 20 (obligation); Reg 21 (designated account); Reg 22 (insurance/guarantee alternative) | Segregation in designated account; insurance policy; comparable guarantee |
| API (authorised) | PSRs 2017 Reg 23 | Segregation in designated account; insurance policy; comparable guarantee |
| SPI (registered) | PSRs 2017 Reg 23(16)–(17) — **voluntary** safeguarding only; SPIs are not required to safeguard | If the SPI elects to safeguard voluntarily, the same Reg 23 mechanics (paras (5)–(13)) apply and the insolvency-priority protection in Reg 23(14)–(15) follows |

For **segregation** (the most common method), document:

- The designated safeguarding bank account(s): institution name, FCA FRN, account type, sort
  code/IBAN, date designated
- The segregation trigger: funds must be in the designated account by end-of-business on the day
  of receipt (PSRs 2017 Reg 23(2)) or, for EMIs, by the end of five business days after the date on
  which the electronic money has been issued (EMR 2011 Reg 20(4) — verbatim statutory language;
  the FCA Approach Document, May 2026 edition, expects firms to minimise this float period in
  practice)
- How the firm will ensure no commingling with operational funds
- The organisational controls to prevent the designated account being used for non-safeguarding
  purposes (EMR 2011 Reg 21(3)(b) — "be used only for holding those funds or assets"; PSRs 2017
  Reg 23(6))

For **insurance or comparable guarantee** (alternative method), document:

- The insurer or guarantor: institution name, FCA FRN (if applicable), policy/guarantee reference
- The coverage amount and any sublimits
- The trigger condition for the insurer/guarantor to pay into the designated account on insolvency
- Confirmation that the policy/guarantee is in place **before** any relevant funds are received

### Step 6 — Generate the reconciliation block

Using the `uk-fs-safeguarding-reconciliation-template.md` template, populate a reconciliation block
covering:

- Daily reconciliation cadence (or intraday where volumes require it)
- The four-tier sign-off chain (operational → senior manager → CFO/Treasurer → SMF holder)
- Variance handling protocol (surplus, shortfall, unreconciled position)
- FCA notification trigger for material shortfalls
- Evidence retention (minimum 6 years per FCA SUP 16)

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
- External auditor role (if applicable) and the engagement scope
- Regulator-readable evidence pack: the specific data and reports that would satisfy an FCA
  supervisory review or REP-CRIM submission — including the monthly safeguarding return (SUP 16
  Annex 34A for payment institutions; SUP 16 Annex 34B for EMIs)

Populate the **Failure scenarios and recovery** section (§8) with at least three scenarios:

1. Safeguarding bank failure — how funds are protected (FSCS applicability, portability to a
   second bank, insolvency priority claim)
2. Reconciliation shortfall — escalation path, FCA notification obligation, remediation timeline
3. Payout blockage — what happens if the safeguarding bank freezes the account (e.g., Sanctions
   screening hit on the account) and how the firm continues to meet redemption obligations

### Step 8 — Write the artefact

Create the output directory if it does not already exist:
`<project_dir>/payments-compliance/`

Use the **Write tool** to save the completed document to:
`projects/<NNN>-<slug>/payments-compliance/ARC-<NNN>-FSSAFE-v1.0.md`

Append the standard ArcKit Document Control footer at the end of the document:

```markdown
---

**Generated by**: ArcKit `/arckit:uk-fs-safeguarding` command
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
  relevant funds are received.** A retroactive insurance arrangement does not satisfy EMR 2011
  Reg 22 (the insurance/guarantee alternative method) or the equivalent in PSRs 2017 Reg 23(3).
  The FCA expects written evidence of the policy/guarantee at authorisation and at every annual
  renewal.
- **Daily reconciliation is the FCA expectation for EMIs; intraday reconciliation for high-volume
  firms.** The FCA Approach Document (May 2026) states that firms should perform reconciliation
  at a frequency commensurate with the volume and velocity of transactions. For firms processing
  more than £10m per day, intraday reconciliation is expected.
- **A safeguarding shortfall notification trigger is mandatory — define the threshold explicitly.**
  The FCA expects firms to have a documented threshold (e.g., a shortfall exceeding £X or Y% of
  safeguarded funds) that automatically triggers notification to the SMF holder and, if material,
  to the FCA. "Material" is not defined in the regulations; document the firm's own definition and
  have it approved by the Compliance Officer.
- **The safeguarding bank itself is a critical dependency.** If the safeguarding bank fails,
  freezes the account, or terminates the relationship, the firm may be unable to meet payout
  obligations within the regulatory timeframe. Feed the safeguarding bank into the firm's CTP
  (Critical Third Party) dependency register — use `/arckit:uk-fs-ctp-dependency` for this.
- **Audit evidence must be regulator-readable in REP-CRIM / SUP 16 format.** Design the
  reconciliation data flow to produce the specific fields required by the monthly safeguarding
  return (SUP 16 Annex 34A / 34B). Retro-fitting reporting fields after the system is built is
  a common and costly error.
- **Allied Wallet (2021) and Premier FX (2018) enforcement context.** In both cases the FCA found
  that firms had either failed to designate accounts correctly, allowed commingling of safeguarded
  and operational funds, or failed to reconcile promptly. These are not edge-case failures — they
  are the direct consequence of treating safeguarding as a one-time setup task rather than a
  continuous operational control. This document must be reviewed at least annually and whenever
  the firm's products, volumes, or safeguarding bank arrangements change.
- **PS24/9 safeguarding reform (FCA, 2024).** The FCA published PS24/9, which introduced enhanced
  safeguarding requirements including a new monthly safeguarding return and strengthened audit
  requirements. Verify that the firm's arrangements comply with the PS24/9 implementation timeline
  before relying on earlier guidance.

## Required Citations

Each of these URLs was verified as live at authoring time. Include all of them in the §9 References
section of the generated document. Verify against the source before relying on this output — FCA
and legislation.gov.uk publications are updated without prior notice.

> **Note on the FCA Dear CEO letter (Jan 2020):** The original PDF URL
> (`/publication/correspondence/dear-ceo-letter-safeguarding-customers-funds-prudential-risk-management.pdf`)
> returned HTTP 404 at command-authoring time. The FCA's safeguarding supervisory expectations are
> now primarily expressed through the Approach Document (May 2026 edition) and PS24/9. If a current
> Dear CEO letter on safeguarding is available via the FCA key publications page, cite it in addition
> to the references below.
>
> **Note on SUP 16 Annex 34A/34B:** The FCA Handbook URL for the monthly safeguarding return annexes
> (`handbook.fca.org.uk/handbook/SUP/16/`) consistently redirects to the handbook homepage rather
> than deep-linking to specific annexes. Navigate to the SUP 16 chapter via the handbook search and
> locate Annex 34A (payment institutions) and Annex 34B (EMIs) directly. The landing URL
> `https://www.handbook.fca.org.uk/handbook/SUP/16/` is cited below as the best stable entry point.

| Reference | Verified URL |
|-----------|-------------|
| Electronic Money Regulations 2011 (SI 2011/99) — Reg 20 safeguarding | <https://www.legislation.gov.uk/uksi/2011/99/regulation/20> |
| Electronic Money Regulations 2011 (SI 2011/99) — full instrument | <https://www.legislation.gov.uk/uksi/2011/99> |
| Payment Services Regulations 2017 (SI 2017/752) — Reg 23 safeguarding | <https://www.legislation.gov.uk/uksi/2017/752/regulation/23> |
| Payment Services Regulations 2017 (SI 2017/752) — full instrument | <https://www.legislation.gov.uk/uksi/2017/752> |
| Payment Services and Electronic Money — Our Approach (FCA, May 2026) | <https://www.fca.org.uk/publication/finalised-guidance/payment-services-electronic-money-approach.pdf> |
| FCA PS24/9 — Safeguarding reforms (2024) | <https://www.fca.org.uk/publication/policy/ps24-9.pdf> |
| FCA CP22/25 — Improving outcomes for consumers of payment and e-money firms | <https://www.fca.org.uk/publication/consultation/cp22-25.pdf> |
| FCA SUP 16 — Reporting requirements (entry point for Annex 34A/34B) | <https://www.handbook.fca.org.uk/handbook/SUP/16/> |
| FCA EMI and Payment Institutions — key publications | <https://www.fca.org.uk/firms/emi-payment-institutions-key-publications> |

## Output Summary

After writing the artefact, print only:

- File path written
- Safeguarding method selected (segregation / insurance / guarantee)
- Designated safeguarding bank or insurer name (if provided in user input)
- Reconciliation frequency confirmed
- Any items requiring legal sign-off or flagged as CONDITIONAL before production implementation
- Citation count

## Suggested Next Steps

After completing this command, consider running:

- `/arckit:uk-fs-ctp-dependency` -- The safeguarding bank or insurer is itself a critical dependency — assess it in the CTP dependency register.
- `/arckit:risk` -- Safeguarding failure is a high-impact Orange Book risk — cross-reference it in the project risk register.
- `/arckit:operationalize` -- Reconciliation runbook is a day-2 operational artefact — assemble it via /arckit:operationalize.
- `/arckit:adr` -- Safeguarding method choice (segregation vs insurance vs guarantee) is an architectural decision worth recording.
