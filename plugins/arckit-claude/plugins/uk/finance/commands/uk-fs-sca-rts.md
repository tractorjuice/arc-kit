---
description: "[COMMUNITY] Generate a UK PSD2 SCA-RTS exemption design document — exemption applicability matrix, transaction risk analysis (TRA) thresholds, fraud monitoring framework, and per-exemption decision rationale."
doc-type: FSSCA
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
allowed-tools:
  - Read(/${CLAUDE_PLUGIN_ROOT}/**)
  - Bash(bash ${CLAUDE_PLUGIN_ROOT}/scripts/bash/create-project.sh *)
  - Bash(bash "${CLAUDE_PLUGIN_ROOT}/scripts/bash/create-project.sh" *)
  - Bash(${CLAUDE_PLUGIN_ROOT}/scripts/bash/create-project.sh *)
  - Bash(node ${CLAUDE_PLUGIN_ROOT}/scripts/generate-document-id.mjs *)
  - Bash(node "${CLAUDE_PLUGIN_ROOT}/scripts/generate-document-id.mjs" *)
---

> ⚠️ **Community-contributed command** — not part of the officially-maintained ArcKit baseline. Output is
> **not** regulatory advice. The SCA exemption design MUST be reviewed, materially supplemented, and
> signed off by qualified UK FS regulatory counsel, the firm's MLRO, and the firm's Compliance Officer
> before any production exemption decision is taken. FCA PSRs 2017 / SCA-RTS / UK Finance Industry
> Guidance references may lag the current published versions — verify against the source.

You are a senior payments architect drafting an SCA-RTS exemption design pack for an authorised UK
Payment Service Provider (PSP), E-Money Institution (EMI), or Payment Institution (PI) subject to the
Payment Services Regulations 2017 (PSRs 2017) and the FCA's Technical Standards on Strong Customer
Authentication and Common and Secure Methods of Communication (the UK SCA-RTS). The FCA makes the
UK SCA-RTS under PSRs 2017 regulation 106A. It replaced Commission Delegated Regulation (EU)
2018/389 on 31 December 2020 and has since been amended by the FCA, including by PS21/19
(29 November 2021; instrument FCA 2021/45, which brought Article 10A, Article 36(6) and the
amended Article 10 into force on 26 March 2022) and by the Technical Standards (Strong
Customer Authentication and Common and Secure Methods of Communication) (Amendment) Instrument 2025
(FCA 2025/62, in force 19 March 2026), which replaced the Article 11 contactless limits with a
risk-based exemption. Read the current text in the FCA Handbook (Technical Standards → Payment
Services), not the EU text.

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
node ${CLAUDE_PLUGIN_ROOT}/scripts/generate-document-id.mjs <PROJECT_NUMBER> FSSCA {VERSION} --filename
```

This produces a filename of the form `ARC-NNN-FSSCA-v{VERSION}.md`. FSSCA is the doc-type code for this
artefact.

### Step 3 — Read the templates and rendering partials

Use the Read tool to read both templates (check `.arckit/templates-custom/` first, fall back to
`${CLAUDE_PLUGIN_ROOT}/templates/`):

- `${CLAUDE_PLUGIN_ROOT}/templates/uk-fs-sca-rts-template.md` — master artefact template
- `${CLAUDE_PLUGIN_ROOT}/templates/uk-fs-sca-rts-exemption-matrix-template.md` — per-exemption block

Then read the rendering and citation partials so the Document Control header and inline citation
markers are applied consistently with peer ArcKit commands:

- `${CLAUDE_PLUGIN_ROOT}/templates/_partials/RENDERING.md` — Document Control header rendering rules
  and Classification field substitution guidance (resolves the `<!-- DOC-CONTROL-HEADER -->` marker
  and the `{{CLASSIFICATION}}` placeholder from `user_config.default_classification`).
- `${CLAUDE_PLUGIN_ROOT}/references/citation-instructions.md` — inline citation marker format and
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

For each of the ten SCA-RTS exemptions listed below (Chapter 3, Articles 10 to 18), produce a
per-exemption block using the `uk-fs-sca-rts-exemption-matrix-template.md` shape. Every exemption
gets a block: where one does not fit the firm's channels (for example Article 12 for a firm with no
unattended terminals), record DO_NOT_APPLY with the reason rather than leaving it out. Apply the
decision (APPLY / DO_NOT_APPLY / CONDITIONAL) based on the firm's payment channels and risk profile
as described in the user input. The article titles below are the UK SCA-RTS headings in the FCA
Handbook; the same list appears in the FCA Approach Document (May 2026), paragraph 20.41.

| Article | Exemption (UK SCA-RTS) | What it covers |
|---------|------------------------|----------------|
| Article 10 | Payment account information accessed directly by a payment service user | Balance and transactions of the last 90 days, without sensitive payment data, when the user is not using an AISP. SCA still applies on first access, and when more than 90 days have passed since the user last accessed the transaction history online with SCA applied (Article 10(2)) |
| Article 10A | Payment account information accessed through an account information service provider | The same information accessed through an AISP. The ASPSP may stop applying SCA once SCA has been applied on at least one previous occasion when the AISP accessed the information (Article 10A(3)). In force 26 March 2022 (PS21/19) |
| Article 11 | Contactless payments at point of sale | Contactless transactions the PSP identifies as low risk, subject to Article 2 transaction monitoring. Since 19 March 2026 (FCA 2025/62) there is no regulatory monetary limit; the PSP sets its own limits |
| Article 12 | Unattended terminals for transport fares and parking fees | Electronic payments at an unattended terminal to pay a transport fare or a parking fee |
| Article 13 | Trusted beneficiaries | Payments to a payee on the payer's trusted-beneficiary list; SCA applies when the payer creates or amends the list |
| Article 14 | Recurring transactions | Later payments in a series with the same amount and the same payee; SCA applies when the series is created, amended or first initiated |
| Article 15 | Credit transfers between accounts held by the same natural or legal person | Transfers where payer and payee are the same person and both accounts are held by the same ASPSP |
| Article 16 | Low-value transactions | Remote electronic payments of £25 or less, subject to a cumulative limit of £85, or a limit of five consecutive transactions, since SCA was last applied (Article 16(a) to (c)) |
| Article 17 | Secure corporate payment processes and protocols | Dedicated processes or protocols available only to payers who are not consumers, where the FCA is satisfied they give at least equivalent security |
| Article 18 | Transaction risk analysis (TRA) | Remote electronic payments identified as low risk by real-time risk analysis, within the exemption threshold value (ETV) for the PSP's fraud rate |

Articles 19 to 21 set the conditions around these exemptions: Article 19 (calculation of fraud
rates), Article 20 (cessation of the TRA exemption) and Article 21 (monitoring). Article 21 applies
to every exemption in Articles 10 to 18: a PSP that uses any of them must record and monitor, at
least quarterly, the fraud data, average transaction value and number of transactions per exemption.

For **Article 18 (TRA)** specifically, include:

- The firm's current fraud rate per payment type (remote electronic card-based payments, remote
  electronic credit transfers), calculated under Article 19: the value of unauthorised or
  fraudulent remote transactions divided by the value of all remote transactions of that type,
  whether authenticated with SCA or exempted under Articles 13 to 18, on a rolling quarterly
  (90-day) basis
- The reference fraud rates and exemption threshold values from the UK SCA-RTS Appendix:

  | ETV (up to) | Remote electronic card-based payments | Remote electronic credit transfers |
  |-------------|---------------------------------------|------------------------------------|
  | £85 | 0.13% | 0.015% |
  | £220 | 0.06% | 0.01% |
  | £440 | 0.01% | 0.005% |

- The ETV the firm is targeting and the fraud-rate condition that must be continuously met
  (Article 18(2)(a) and (b))
- The cessation rule in Article 20, which replaces any internal percentage trigger: report to the
  FCA immediately when a monitored fraud rate exceeds the applicable reference rate, with the
  measures planned to restore compliance (Article 20(1)); stop using TRA for that payment type
  and ETV band immediately if the rate exceeds the reference rate for two consecutive quarters
  (Article 20(2)); resume only after the calculated rate has been at or below the reference rate
  for one quarter, and after notifying the FCA with evidence (Article 20(3) and (4)). The FCA
  Approach Document (May 2026), paragraph 20.80, points to SUP 15.14.29 to SUP 15.14.37 for the
  notification requirements
- Any internal early-warning threshold the firm sets below the reference rate, labelled as a firm
  control, not a regulatory threshold

### Step 6 — Populate the master template

Using the master template, fill in all `{{PLACEHOLDER}}` fields with information derived from the
user input, existing project artefacts, and the per-exemption blocks generated in Step 5.

Populate the **Authentication Architecture** section (§2) with:

- SCA factor inventory: knowledge (PIN, password, passphrase), possession (registered device, OTP
  token, SIM-linked one-time code), inherence (fingerprint, facial recognition, voice)
- Dynamic linking implementation for electronic remote payment transactions (transaction amount +
  payee bound to the authentication code, per PSRs 2017 regulation 100(2) and UK SCA-RTS Article 5)
- Exemption-decision engine architecture: where the go/no-go exemption decision is made (issuer vs
  acquirer vs PSP layer), data inputs, fallback-to-full-SCA logic

Populate the **Fraud Monitoring Framework** section (§5) with:

- Real-time transaction monitoring controls and model inputs
- Model retraining cadence and validation gate
- Escalation path when the fraud rate approaches the reference rate (firm early-warning threshold),
  exceeds it (immediate report to the FCA, Article 20(1)), and exceeds it for two consecutive
  quarters (cessation of TRA for that band, Article 20(2))
- MLRO and Compliance Officer notification triggers
- Quarterly Article 21 monitoring data for every exemption the firm uses

Populate the **Audit Trail Requirements** section (§6) with:

- Fields logged per exemption decision (exemption code, transaction reference, amount, payee, fraud
  score, channel, timestamp, device fingerprint hash)
- Retention period: set by the firm and confirmed with counsel (five years is a common baseline).
  Do not attribute a retention period to PSRs 2017 regulation 100, which sets none. The fraud-rate
  methodology, the fraud rates and the Article 21 monitoring results must be available to the FCA
  on request (UK SCA-RTS Articles 19(3) and 21(2))
- Format: machine-readable, regulator-accessible on demand

### Step 7 — Write the artefact

Create the output directory if it does not already exist:
`<project_dir>/payments-compliance/`

Before writing, read `${CLAUDE_PLUGIN_ROOT}/references/quality-checklist.md` and verify all **Common Checks** plus the **FSSCA** per-type checks pass. Fix any failures before proceeding.

Use the **Write tool** to save the completed document to:
`projects/<NNN>-<slug>/payments-compliance/ARC-<NNN>-FSSCA-v1.0.md`

Do **not** echo the full document to the console — the Write tool avoids the 32K output limit.

Append the standard ArcKit Document Control footer at the end of the document:

```markdown
---

**Generated by**: ArcKit `/arckit-uk-finance:uk-fs-sca-rts` command
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
  exemption is available only while the firm's fraud rate, calculated under Article 19, is at or
  below the reference rate for the ETV band it uses. The UK SCA-RTS sets no percentage-of-reference
  trigger. Article 20 is the rule: report to the FCA immediately when a monitored fraud rate
  exceeds the reference rate; cease TRA for that band immediately if it exceeds the reference rate
  for two consecutive quarters; resume only after one quarter at or below the reference rate and a
  notification to the FCA with evidence.
- **Soft-decline must be implemented even where an exemption is applied.** An issuer that disagrees
  with an acquirer-asserted exemption can soft-decline; the design must support automatic fallback to
  full SCA in that path. Acquirer-only exemption assertions without soft-decline support are not
  compliant.
- **Article 10A and the AISP 90-day reconfirmation are separate rules.** Under Article 10A the
  ASPSP may stop applying SCA to AISP access once SCA has been applied on at least one previous
  occasion when the AISP accessed the information; it sets no periodic ASPSP reauthentication.
  Separately, Article 36(6) lets an AISP access account data when the user is not actively
  requesting it only if the user has confirmed with the AISP within the previous 90 days that they
  still consent. Neither rule is reset by a payment. Design the ASPSP authentication logic and the
  AISP consent-reconfirmation lifecycle as two distinct controls.
- **The SCA exemption design is not a final regulatory artefact.** It informs implementation choices
  but does not bind the firm against FCA supervisory action. Production exemption decisions must be
  separately documented in the firm's Conduct Risk and Fraud Risk frameworks and approved by the
  MLRO and Compliance Officer.
- **Where SCA is applied to an electronic remote payment transaction, it must include dynamic
  linking.** PSRs 2017 regulation 100(2) and UK SCA-RTS Article 5 bind the authentication code to
  the amount and the payee. Regulation 100(5) makes regulation 100(1) to (3) subject to the
  exemptions in the technical standards, so an exemption removes the SCA requirement for that
  transaction; it never permits SCA without dynamic linking.
- **Check the current UK SCA-RTS text in the FCA Handbook before production reliance.** FCA
  2025/62 (in force 19 March 2026) changed Article 11 only: it removed the regulatory contactless
  limits (previously £100 per transaction and £300 cumulative or five consecutive transactions) and
  replaced them with a risk-based exemption. It did not change the Appendix reference fraud rates
  or ETVs, which the FCA Handbook shows as unchanged since 1 January 2021. Verify both against the
  Handbook at the time of use.

## Required Citations

Each of these URLs was verified as live at authoring time. Include all of them in the §7 References
section of the generated document. Verify against the source before relying on this output — FCA
publications are updated without prior notice.

| Reference | Verified URL |
|-----------|-------------|
| Payment Services Regulations 2017 (SI 2017/752) | <https://www.legislation.gov.uk/uksi/2017/752> |
| PSRs 2017 Reg 100 — Authentication | <https://www.legislation.gov.uk/uksi/2017/752/regulation/100> |
| PSRs 2017 Reg 106A — Technical Standards power | <https://www.legislation.gov.uk/uksi/2017/752/regulation/106A> |
| UK SCA-RTS Chapter 3 — Exemptions from SCA, Articles 10 to 21 (FCA Handbook, Technical Standards → Payment Services) | <https://handbook.fca.org.uk/technical-standards/s140c1226> |
| UK SCA-RTS Appendix — reference fraud rates and ETVs (FCA Handbook) | <https://handbook.fca.org.uk/technical-standards/provision/s140c1230sn0p1854> |
| Payment Services and Electronic Money — Our Approach (FCA, May 2026, Chapter 20) | <https://www.fca.org.uk/publication/finalised-guidance/payment-services-electronic-money-approach.pdf> |
| FCA Strong Customer Authentication — firms guidance | <https://www.fca.org.uk/firms/strong-customer-authentication> |
| FCA PS19/26 — UK SCA-RTS post-Brexit | <https://www.fca.org.uk/publications/policy-statements/ps19-26-brexit-regulatory-technical-standards-strong-customer-authentication> |
| FCA PS21/19 — SCA-RTS changes (Article 10A), 29 November 2021 | <https://www.fca.org.uk/publications/policy-statements/ps21-19-changes-sca-rts-and-guidance-approach-document-and-perimeter-guidance-manual> |
| FCA Handbook Notice 136 (December 2025) — FCA 2025/62, Article 11 contactless change in force 19 March 2026 | <https://www.fca.org.uk/publication/handbook/handbook-notice-136.pdf> |
| FCA SCA coronavirus extension statement (30 April 2020) | <https://www.fca.org.uk/news/statements/strong-customer-authentication-and-coronavirus> |
| UK Finance Industry Guidance on SCA (2025) | <https://www.ukfinance.org.uk/system/files/2025-07/UK-Finance-Industry-Guidance-Strong-Customer-Authentication.pdf> |
| FCA Payment Services Regulations and EMRs — key publications | <https://www.fca.org.uk/firms/emi-payment-institutions-key-publications> |

> **Note on the coronavirus statement**: The FCA statement of 30 April 2020 moved the date from
> which it would take enforcement action on SCA for e-commerce from 14 March 2021 to
> 14 September 2021. It is historical context only; it does not change any exemption.
>
> **Note on the FCA Handbook links**: The FCA Handbook is a single-page application. If a deep
> link opens the wrong page, go to <https://handbook.fca.org.uk/technical-standards>, expand
> Payment Services, then Strong Customer Authentication and Common and Secure Methods of
> Communication.
>
> **Note on the UK Finance PDF**: The PDF may require an authenticated session to download
> directly. Use the FCA and legislation.gov.uk URLs as the primary regulatory anchors; the UK Finance
> guidance provides industry-level interpretation and should be verified at
> <https://www.ukfinance.org.uk/our-expertise/payments-innovation-resilience/strong-customer-authentication>.

## Output Summary

After writing the artefact, print only:

- File path written
- Exemptions covered (list the Articles)
- Citation count
- Any items flagged as CONDITIONAL or requiring legal sign-off before production implementation
