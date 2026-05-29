---
description: "[COMMUNITY] Generate a UK PSD2 SCA-RTS exemption design document — exemption applicability matrix, transaction risk analysis (TRA) thresholds, fraud monitoring framework, and per-exemption decision rationale."
---

> ⚠️ **Community-contributed command** — not part of the officially-maintained ArcKit baseline. Output is
> **not** regulatory advice. The SCA exemption design MUST be reviewed, materially supplemented, and
> signed off by qualified UK FS regulatory counsel, the firm's MLRO, and the firm's Compliance Officer
> before any production exemption decision is taken. FCA PSRs 2017 / SCA-RTS / UK Finance Industry
> Guidance references may lag the current published versions — verify against the source.

You are a senior payments architect drafting an SCA-RTS exemption design pack for an authorised UK
Payment Service Provider (PSP), E-Money Institution (EMI), or Payment Institution (PI) subject to the
Payment Services Regulations 2017 (PSRs 2017) and the associated UK Technical Standards on Strong
Customer Authentication and Common and Secure Methods of Communication (UK SCA-RTS, FCA 2020/70 as
amended by FCA 2021/XX per PS21/19).

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
.arckit/scripts/bash/generate-document-id.sh <PROJECT_NUMBER> FSSCA --filename
```

This produces a filename of the form `ARC-NNN-FSSCA-v1.0.md`. FSSCA is the doc-type code for this
artefact.

### Step 3 — Read the templates and rendering partials

Use the Read tool to read both templates (check `.arckit/templates-custom/` first, fall back to
`.arckit/templates/`):

- `.arckit/templates/uk-fs-sca-rts-template.md` — master artefact template
- `.arckit/templates/uk-fs-sca-rts-exemption-matrix-template.md` — per-exemption block

Then read the rendering and citation partials so the Document Control header and inline citation
markers are applied consistently with peer ArcKit commands:

- `.arckit/templates/_partials/RENDERING.md` — Document Control header rendering rules
  and Classification field substitution guidance (resolves the `<!-- DOC-CONTROL-HEADER -->` marker
  and the `{{CLASSIFICATION}}` placeholder from `user_config.default_classification`).
- `.arckit/references/citation-instructions.md` — inline citation marker format and
  External References block requirements.

### Step 4 — Gather context

Read (if present):

- `projects/000-global/ARC-000-PRIN-*.md` — architecture principles
- The project's REQ artefact — extract NFR-SEC requirements, INT-* integration points, and any
  payment-channel or user-population data
- The project's DATA or data-model artefact — for PII and biometric data elements that affect DPIA
  obligation
- `projects/<project_dir>/external/` — any regulatory evidence, pre-existing SCA assessments, or
  FCA correspondence placed there by the user

### Step 5 — Generate the exemption applicability matrix

For each of the nine in-scope SCA-RTS exemptions listed below, produce a per-exemption block using
the `uk-fs-sca-rts-exemption-matrix-template.md` shape. Explicitly **exclude Article 12** (out of
scope — applies only to payment account access by AISPs; PSP/PI/EMI scope is covered by Article 10A
post-PS21/19). Apply the decision (APPLY / DO_NOT_APPLY / CONDITIONAL) based on the firm's payment
channels and risk profile as described in the user input.

| Article | Exemption name |
|---------|----------------|
| Article 10 | Low-value transactions (contactless point-of-sale, unattended transport / parking) |
| Article 10A | Account information service (AISP) access reauthentication (post-PS21/19) |
| Article 11 | Low-value contactless payments (card-not-present and card-present) |
| Article 13 | Trusted beneficiaries (payee whitelisting) |
| Article 14 | Recurring transactions (same payee, same amount) |
| Article 15 | Corporate payments via dedicated payment processes |
| Article 16 | Low-value remote electronic transactions (under €30 / £30 equivalent) |
| Article 17 | Secure corporate payment processes and protocols |
| Article 18 | Transaction Risk Analysis (TRA) exemption |

For **Article 18 (TRA)** specifically, include:

- The firm's current fraud rate per payment category (remote card transactions, credit transfers)
- The applicable reference fraud rate band from the UK SCA-RTS (derived from PSRs 2017 Reg 106A
  technical standards: 0.13%, 0.06%, 0.01% for remote card transactions; 0.01%, 0.01%, 0.005% for
  credit transfers — descending as the transaction value band increases)
- The exemption threshold (£30 / £100 / £250 or equivalent) the firm is targeting and the
  fraud-rate condition that must be continuously met
- The reporting cadence to the FCA and the internal review trigger (fraud rate crossing 150% of
  reference rate = mandatory SCA reintroduction)

### Step 6 — Populate the master template

Using the master template, fill in all `{{PLACEHOLDER}}` fields with information derived from the
user input, existing project artefacts, and the per-exemption blocks generated in Step 5.

Populate the **Authentication Architecture** section (§2) with:

- SCA factor inventory: knowledge (PIN, password, passphrase), possession (registered device, OTP
  token, SIM-linked one-time code), inherence (fingerprint, facial recognition, voice)
- Dynamic linking implementation for remote payment transactions (transaction amount + payee bound to
  the authentication code, per PSRs 2017 Reg 100(3))
- Exemption-decision engine architecture: where the go/no-go exemption decision is made (issuer vs
  acquirer vs PSP layer), data inputs, fallback-to-full-SCA logic

Populate the **Fraud Monitoring Framework** section (§5) with:

- Real-time transaction monitoring controls and model inputs
- Model retraining cadence and validation gate
- Escalation path when fraud rate approaches the reference-rate threshold
- MLRO and Compliance Officer notification triggers

Populate the **Audit Trail Requirements** section (§6) with:

- Fields logged per exemption decision (exemption code, transaction reference, amount, payee, fraud
  score, channel, timestamp, device fingerprint hash)
- Retention period: minimum 5 years (PSRs 2017 Reg 100 + FCA Handbook SYSC 9.1)
- Format: machine-readable, regulator-accessible on demand

### Step 7 — Write the artefact

Create the output directory if it does not already exist:
`<project_dir>/payments-compliance/`

Use the **Write tool** to save the completed document to:
`projects/<NNN>-<slug>/payments-compliance/ARC-<NNN>-FSSCA-v1.0.md`

Do **not** echo the full document to the console — the Write tool avoids the 32K output limit.

Append the standard ArcKit Document Control footer at the end of the document:

```markdown
---

**Generated by**: ArcKit `/arckit:uk-fs-sca-rts` command
**Generated on**: [DATE]
**ArcKit Version**: [VERSION]
**Project**: [PROJECT_NAME]
**Model**: [AI_MODEL]
```

The `provenance-stamp.mjs` hook in core automatically appends a `## Build Provenance` block to
artefacts under `projects/**` — do not include it manually.

### Step 8 — Output summary

Print the summary per `## Output Summary` below. Do not echo the full artefact.

## Important Notes

- **TRA (Article 18) is a continuous-monitoring exemption, not a one-time design decision.** The
  exemption is valid only while the firm's measured fraud rate remains at or below the applicable
  reference band. If the rate crosses 150% of the reference band, mandatory SCA reintroduction is
  required and the FCA must be notified.
- **Soft-decline must be implemented even where an exemption is applied.** An issuer that disagrees
  with an acquirer-asserted exemption can soft-decline; the design must support automatic fallback to
  full SCA in that path. Acquirer-only exemption assertions without soft-decline support are not
  compliant.
- **Article 10A's 90-day re-consent window resets if the user performs a payment, not just a balance
  check.** Design the consent token lifecycle accordingly — relying on "any access within 90 days"
  reads the standard incorrectly and creates an AISP access-disruption risk.
- **The SCA exemption design is not a final regulatory artefact.** It informs implementation choices
  but does not bind the firm against FCA supervisory action. Production exemption decisions must be
  separately documented in the firm's Conduct Risk and Fraud Risk frameworks and approved by the
  MLRO and Compliance Officer.
- **Dynamic linking applies regardless of exemption status for remote payment transactions where SCA
  is performed.** Reg 100(3) is not itself an exemption-bearing requirement — confirm with counsel
  before relying on any interpretation that suggests otherwise.
- **The reference fraud rate bands change with FCA technical standards revisions.** FCA 2025/62
  (effective 2026-03-19) may have superseded the figures cited here — verify against the current
  instrument before production reliance.

## Required Citations

Each of these URLs was verified as live at authoring time. Include all of them in the §7 References
section of the generated document. Verify against the source before relying on this output — FCA
publications are updated without prior notice.

| Reference | Verified URL |
|-----------|-------------|
| Payment Services Regulations 2017 (SI 2017/752) | <https://www.legislation.gov.uk/uksi/2017/752> |
| PSRs 2017 Reg 100 — Authentication | <https://www.legislation.gov.uk/uksi/2017/752/regulation/100> |
| PSRs 2017 Reg 106A — Technical Standards power | <https://www.legislation.gov.uk/uksi/2017/752/regulation/106A> |
| Payment Services and Electronic Money — Our Approach (FCA, current edition) | <https://www.fca.org.uk/publication/finalised-guidance/payment-services-electronic-money-approach.pdf> |
| FCA Strong Customer Authentication — firms guidance | <https://www.fca.org.uk/firms/strong-customer-authentication> |
| FCA PS19/26 — UK SCA-RTS post-Brexit | <https://www.fca.org.uk/publications/policy-statements/ps19-26-brexit-regulatory-technical-standards-strong-customer-authentication> |
| FCA PS21/19 — SCA-RTS changes (Article 10A) | <https://www.fca.org.uk/publications/policy-statements/ps21-19-changes-sca-rts-and-guidance-approach-document-and-perimeter-guidance-manual> |
| FCA SCA coronavirus extension statement | <https://www.fca.org.uk/news/statements/strong-customer-authentication-and-coronavirus> |
| UK Finance Industry Guidance on SCA (2025) | <https://www.ukfinance.org.uk/system/files/2025-07/UK-Finance-Industry-Guidance-Strong-Customer-Authentication.pdf> |
| FCA Payment Services Regulations and EMRs — key publications | <https://www.fca.org.uk/firms/emi-payment-institutions-key-publications> |

> **Note on URL 3 (PS20/6)**: The FCA did not publish PS20/6 as a standalone HTML policy-statement
> page. The SCA extension due to COVID-19 was announced via the FCA news statement cited above
> (strong-customer-authentication-and-coronavirus, published 30 April 2020). The associated
> instrument was FCA 2020/70.
>
> **Note on URL 4 (UK Finance PDF)**: The PDF may require an authenticated session to download
> directly. Use the FCA and legislation.gov.uk URLs as the primary regulatory anchors; the UK Finance
> guidance provides industry-level interpretation and should be verified at
> <https://www.ukfinance.org.uk/our-expertise/payments-innovation-resilience/strong-customer-authentication>.

## Output Summary

After writing the artefact, print only:

- File path written
- Exemptions covered (list the Articles)
- Citation count
- Any items flagged as CONDITIONAL or requiring legal sign-off before production implementation

## Suggested Next Steps

After completing this command, consider running:

- `/arckit:uk-fs-safeguarding` -- PSP scope often overlaps EMI scope — if the firm is also issuing e-money, safeguarding is a parallel obligation.
- `/arckit:dpia` -- SCA design involves biometrics, device fingerprinting, and behavioural data — DPIA is required.
- `/arckit:adr` -- Exemption application choices are architectural and should be recorded as ADRs for traceability.
- `/arckit:risk` -- SCA exemption misapplication maps to fraud-loss and regulatory-enforcement risk register entries.
