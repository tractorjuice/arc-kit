# EMI / PI Safeguarding Assessment (`/arckit:uk-fs-safeguarding`)

> **Status**: EXPERIMENTAL · Community-contributed · **CRITICAL SEVERITY** · **Output is not
> regulatory advice.** Safeguarding failures have led to firm collapse and FCA enforcement action.
> The safeguarding assessment MUST be reviewed, materially supplemented, and signed off by qualified
> UK FS regulatory counsel, the firm's SMF holder for safeguarding (typically SMF1/SMF24), the
> firm's MLRO (for AML-angle review of the client-money position), and the firm's Compliance Officer
> before any production safeguarding arrangement is established. Verify the FCA Approach Document
> (current edition), PS25/12 (August 2025) and the CASS 15 rules in force from 7 May 2026 for
> changes introduced since this command was authored.

## Purpose

The `/arckit:uk-fs-safeguarding` command generates a safeguarding assessment for an authorised UK
Electronic Money Institution (EMI) or Authorised Payment Institution (API) under the Electronic
Money Regulations 2011 (EMR 2011 Reg 20–22), the Payment Services Regulations 2017 (PSRs 2017
Reg 23) and, from 7 May 2026, the FCA's CASS 15 rules (FCA 2025/38, made under PS25/12). It also
covers Small Payment Institutions (SPIs) that elect to safeguard voluntarily (PSRs 2017
Reg 23(16)–(17)).

The artefact documents the firm's chosen safeguarding method, the designated safeguarding bank or
insurer arrangements, the end-to-end client-funds flow, the daily reconciliation framework, and
an audit plan aligned to FCA supervisory expectations including the monthly safeguarding return
(REP027: SUP 16.14A, content in SUP 16 Annex 29BR; one return for PIs and EMIs).

Safeguarding is a continuous operational obligation — not a one-time setup task. This document
must be reviewed at least annually and whenever the firm's products, volumes, or safeguarding bank
arrangements change.

---

## When to Use

- **Before launching a client-funds product** — any EMI or API product where the firm holds
  relevant funds (as defined in PSRs 2017 Reg 2 / EMR 2011 Reg 2) on behalf of customers requires
  a documented safeguarding arrangement before those funds are received.
- **After a safeguarding bank change** — if the firm switches or adds a designated safeguarding
  bank account or insurer, the assessment must be updated and re-signed by the relevant SMF holder.
- **PS25/12 compliance refresh** — the FCA's PS25/12 (August 2025) made the CASS 15 safeguarding
  rules, SUP 3A safeguarding audits and the monthly safeguarding return, in force 7 May 2026
  (FCA 2025/38). If the firm's existing documentation was drafted before then, this command
  provides a structured refresh.
- **Pre-FCA supervisory engagement** — before a skilled-person review (s166) or Dear CEO letter
  response, the firm needs current, traceable safeguarding documentation.
- **For SPI voluntary safeguarding** — SPIs are not required to safeguard, but if an SPI elects to
  do so voluntarily, the same Reg 23 mechanics apply and the insolvency-priority protection under
  Reg 23(14)–(15) follows. This command covers that voluntary case explicitly.

---

## Inputs

Pass the project ID and product context as `$ARGUMENTS`:

```text
/arckit:uk-fs-safeguarding 002 B2B virtual-account product
```

The argument should include:

- The project number or an existing project directory name.
- A brief description of the product in scope (used to contextualise the method statement and
  client-funds flow diagram).
- Optionally: the firm's authorisation type (EMI / API / SPI), the intended safeguarding method
  (segregation / insurance / guarantee), and the name of the designated safeguarding bank (if
  already chosen).

If this information is not in `$ARGUMENTS`, the command reads it from the project's REQ and DATA
artefacts where present, and prompts for it in the output summary where missing.

---

## Output

**Doc-type code**: FSSAFE (CRITICAL severity)

**Output path**: `projects/<NNN>-<slug>/payments-compliance/ARC-<NNN>-FSSAFE-v1.0.md`

The generated artefact contains the following sections:

1. Document Control (classification, owner, SMF holder, review cycle)
2. Firm Authorisation Profile (authorisation type, FCA FRN, products in scope)
3. Safeguarding Method Statement (chosen method with explicit regulatory justification)
4. Designated Safeguarding Arrangements (bank account details / insurer / guarantor)
5. End-to-end Client Funds Flow (Mermaid or ASCII diagram + narrative for each node)
6. Reconciliation Framework (daily cadence, four-tier sign-off chain, variance handling)
7. Audit Plan (internal audit cadence, external auditor role under SUP 3A, monthly safeguarding
   return evidence pack)
8. Failure Scenarios and Recovery (safeguarding bank failure, reconciliation shortfall, payout
   blockage — at minimum three scenarios)
9. References (all required citations)

---

## Key Regulatory Anchors

**Three safeguarding methods** are available:

| Method | Regulatory basis | Requirements |
|--------|-----------------|--------------|
| Segregation in designated account | EMR 2011 Reg 21; PSRs 2017 Reg 23(5)–(11) | Funds kept segregated from receipt; if still held at the end of the business day following the day of receipt, placed in a separate designated account or invested in relevant assets (PSRs 2017 Reg 23(5)–(6); EMR 2011 Reg 21(1)–(2)); for EMIs, funds received by payment instrument safeguarded by the end of five business days after the e-money is issued (EMR 2011 Reg 20(4)); no commingling with operational funds |
| Comparable insurance policy | EMR 2011 Reg 22; PSRs 2017 Reg 23(12)–(13) | Relevant funds must be covered, so the policy must be in place BEFORE they are received; proceeds payable into a designated account on insolvency; notify the FCA at least 2 months before first reliance (CASS 15.5.7R) |
| Comparable guarantee | EMR 2011 Reg 22; PSRs 2017 Reg 23(12)–(13) | Guarantee must be in place BEFORE relevant funds are received; same CASS 15.5.7R notification |

**Monthly safeguarding return**: REP027, submitted within 15 business days of each month end
(SUP 16.14A.3R), with its content set by SUP 16 Annex 29BR. One return covers authorised PIs,
authorised and small EMIs, credit unions issuing e-money and SPIs that opt in (FCA Approach
Document, May 2026, Chapter 13). The FCA Handbook is a single-page application: open SUP 16 at
<https://handbook.fca.org.uk/handbook/sup16> and find SUP 16.14A and Annex 29BR in the chapter.

**FCA enforcement context**: Two documented enforcement cases provide the sector context for why
safeguarding is CRITICAL severity:

- **Allied Wallet (2021)** — FCA cancelled authorisation after finding the firm holding client funds
  in non-compliant accounts and failing to designate accounts correctly.
- **Premier FX (2018)** — firm failed with a £10 million shortfall in customer funds after
  inadequate segregation and failure to reconcile promptly.

Both cases demonstrate that safeguarding is not a one-time setup — ongoing reconciliation and
regular audit are the obligations that failed in practice.

**PS25/12 (FCA, August 2025)** made the Payments and Electronic Money (Safeguarding) Instrument
2025 (FCA 2025/38), in force 7 May 2026: CASS 15 (relevant funds), CASS 10A (resolution pack),
SUP 3A (safeguarding audits) and SUP 16.14A (monthly safeguarding return). CP24/20 (September 2024)
was the consultation that preceded it. The FCA Approach Document (May 2026 edition, Chapters 10
and 13) is the current primary reference for FCA supervisory expectations.

---

## Composes With

| Command | Relationship |
|---------|--------------|
| `/arckit:uk-fs-ctp-dependency` | The safeguarding bank or insurer is itself a critical third-party dependency. The CTP dependency register should include the safeguarding bank as a candidate designated or material non-CTP. |
| `/arckit:risk` | Safeguarding failure is a high-impact Orange Book risk. Cross-reference it in the project risk register with the FSSAFE document ID. |
| `/arckit:operationalize` | The reconciliation runbook is a day-2 operational artefact. Once the safeguarding assessment defines the reconciliation cadence and sign-off chain, assemble the operational runbook via `/arckit:operationalize`. |
| `/arckit:adr` | The safeguarding method choice (segregation vs insurance vs guarantee) is an architectural decision with cost, operational, and regulatory implications — record it as an ADR for traceability. |

---

## Important Caveats

- **Safeguarding obligations apply from the moment funds are received, not when payment is
  initiated.** The segregation trigger is receipt of funds. Any float period between receipt and
  placement in the designated account must be explicitly documented, minimised, and approved by
  the relevant SMF holder.
- **Insurance and guarantee methods require the policy to be in place BEFORE the relevant funds
  are received.** EMR 2011 Reg 22(1) and PSRs 2017 Reg 23(12) require the funds to be covered, so a
  retroactive arrangement does not satisfy them. From 7 May 2026 the firm must also notify the FCA
  at least 2 months before first relying on the method or changing the cover or the provider
  (CASS 15.5.7R).
- **Reconcile at least once each reconciliation day.** CASS 15.8.19R (internal) and CASS
  15.8.42R (external) require safeguarding reconciliations as frequently as necessary and no less
  than once each reconciliation day (a business day), from 7 May 2026. Intraday reconciliation is
  the firm's own decision based on its volumes; there is no regulatory volume threshold for it.
- **Define the FCA notification triggers for shortfalls explicitly.** CASS 15.8.60R requires the
  firm to inform the FCA in writing without delay in the cases it lists, including a material
  failure to reconcile or to pay a shortfall into a relevant funds account. "Materially" has no
  numeric threshold: the firm must document its own (e.g., a shortfall exceeding £X or Y% of
  safeguarded funds), have it approved by the Compliance Officer, and ensure it triggers
  notification to the SMF holder and the FCA.
- **The safeguarding bank is itself a critical dependency.** If the safeguarding bank fails, freezes
  the account, or terminates the relationship, the firm may be unable to meet payout obligations
  within the regulatory timeframe. The CTP dependency register must include the safeguarding bank.
- **The monthly safeguarding return is SUP 16 Annex 29BR, not Annex 30A, 34A or 34B.** SUP 16.14A
  requires the return and SUP 16 Annex 29BR sets its content; there is one return for PIs and EMIs.
  SUP 16 Annex 30 lists the e-money institution returns, and REP-CRIM is the Annual Financial Crime
  Report (SUP 16.23, SUP 16 Annex 42AR). Neither is the safeguarding return.
- **Design for the monthly safeguarding return before the system is built.** Design the
  reconciliation data flow to produce the fields SUP 16 Annex 29BR asks for — retrofitting
  reporting fields after go-live is a common and costly error.

---

## References

| Reference | URL |
|-----------|-----|
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
