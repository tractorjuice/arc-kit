# EMI / PI Safeguarding Assessment (`/arckit:uk-fs-safeguarding`)

> **Status**: EXPERIMENTAL · Community-contributed · **CRITICAL SEVERITY** · **Output is not
> regulatory advice.** Safeguarding failures have led to firm collapse and FCA enforcement action.
> The safeguarding assessment MUST be reviewed, materially supplemented, and signed off by qualified
> UK FS regulatory counsel, the firm's SMF holder for safeguarding (typically SMF1/SMF24), the
> firm's MLRO (for AML-angle review of the client-money position), and the firm's Compliance Officer
> before any production safeguarding arrangement is established. Verify the FCA Approach Document
> (current edition) and PS24/9 safeguarding reforms for changes introduced since this command was
> authored.

## Purpose

The `/arckit:uk-fs-safeguarding` command generates a safeguarding assessment for an authorised UK
Electronic Money Institution (EMI) or Authorised Payment Institution (API) under the Electronic
Money Regulations 2011 (EMR 2011 Reg 20–22) and the Payment Services Regulations 2017 (PSRs 2017
Reg 23). It also covers Small Payment Institutions (SPIs) that elect to safeguard voluntarily under
PSRs 2017 Reg 23(16)–(17).

The artefact documents the firm's chosen safeguarding method, the designated safeguarding bank or
insurer arrangements, the end-to-end client-funds flow, the daily reconciliation framework, and
an audit plan aligned to FCA supervisory expectations including REP-CRIM and the monthly
safeguarding return (SUP 16 Annex 34A for payment institutions; SUP 16 Annex 34B for EMIs).

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
- **PS24/9 compliance refresh** — the FCA's PS24/9 (2024) introduced enhanced safeguarding
  requirements including a new monthly safeguarding return. If the firm's existing documentation
  was drafted before PS24/9, this command provides a structured refresh.
- **Pre-FCA supervisory engagement** — before a skilled-person review (s166), REP-CRIM submission,
  or Dear CEO letter response, the firm needs current, traceable safeguarding documentation.
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
7. Audit Plan (internal audit cadence, external auditor role, SUP 16 Annex 34A/34B evidence pack)
8. Failure Scenarios and Recovery (safeguarding bank failure, reconciliation shortfall, payout
   blockage — at minimum three scenarios)
9. References (all required citations)

---

## Key Regulatory Anchors

**Three safeguarding methods** are available:

| Method | Regulatory basis | Requirements |
|--------|-----------------|--------------|
| Segregation in designated account | EMR 2011 Reg 21; PSRs 2017 Reg 23(2)–(6) | Funds in designated account by end-of-business on day of receipt (PSRs 2017 Reg 23(2)); for EMIs, within 5 business days of e-money issuance (EMR 2011 Reg 20(4)); no commingling with operational funds |
| Comparable insurance policy | EMR 2011 Reg 22; PSRs 2017 Reg 23(3) | Policy must be in place BEFORE relevant funds are received; insurer must pay to designated account on insolvency |
| Comparable guarantee | EMR 2011 Reg 22; PSRs 2017 Reg 23(3) | Guarantee must be in place BEFORE relevant funds are received |

**Monthly safeguarding return**: SUP 16 Annex 34A (payment institutions) and SUP 16 Annex 34B
(EMIs) — access via the FCA Handbook at `https://www.handbook.fca.org.uk/handbook/SUP/16/`. The FCA
Handbook does not support stable deep links to specific annexes; navigate via the handbook search.

**FCA enforcement context**: Two documented enforcement cases provide the sector context for why
safeguarding is CRITICAL severity:

- **Allied Wallet (2021)** — FCA cancelled authorisation after finding the firm holding client funds
  in non-compliant accounts and failing to designate accounts correctly.
- **Premier FX (2018)** — firm failed with a £10 million shortfall in customer funds after
  inadequate segregation and failure to reconcile promptly.

Both cases demonstrate that safeguarding is not a one-time setup — ongoing reconciliation and
regular audit are the obligations that failed in practice.

**PS24/9 (FCA, 2024)** introduced enhanced safeguarding requirements. The FCA Approach Document
(May 2026 edition) is the current primary reference for FCA supervisory expectations. CP22/25 was
the consultation that preceded PS24/9; it is cited for completeness of the legislative history.

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
  are received.** A retroactive insurance arrangement does not satisfy EMR 2011 Reg 22 or PSRs 2017
  Reg 23(3). The FCA expects written evidence of the policy or guarantee at authorisation and at
  every annual renewal.
- **Daily reconciliation is the FCA expectation; intraday for high-volume firms.** The FCA
  Approach Document (May 2026) states that reconciliation frequency must be commensurate with
  transaction volume and velocity. For firms processing more than £10 million per day, intraday
  reconciliation is expected.
- **Define the FCA notification threshold for material shortfalls explicitly.** "Material" is not
  defined in the regulations. The firm must document its own threshold (e.g., a shortfall exceeding
  £X or Y% of safeguarded funds), have it approved by the Compliance Officer, and ensure it
  automatically triggers notification to the SMF holder and, where material, to the FCA.
- **The safeguarding bank is itself a critical dependency.** If the safeguarding bank fails, freezes
  the account, or terminates the relationship, the firm may be unable to meet payout obligations
  within the regulatory timeframe. The CTP dependency register must include the safeguarding bank.
- **SUP 16 Annex references are 34A and 34B, not 30A.** The monthly safeguarding return annexes
  are Annex 34A (payment institutions) and Annex 34B (EMIs). Annex 30A is a different return;
  citing 30A in a safeguarding context is an error.
- **Audit evidence must be regulator-readable in REP-CRIM / SUP 16 format.** Design the
  reconciliation data flow to produce the fields required by the monthly safeguarding return before
  the system is built — retrofitting reporting fields after go-live is a common and costly error.

---

## References

| Reference | URL |
|-----------|-----|
| Electronic Money Regulations 2011 (SI 2011/99) — Reg 20 safeguarding | <https://www.legislation.gov.uk/uksi/2011/99/regulation/20> |
| Electronic Money Regulations 2011 (SI 2011/99) — full instrument | <https://www.legislation.gov.uk/uksi/2011/99> |
| Payment Services Regulations 2017 (SI 2017/752) — Reg 23 safeguarding | <https://www.legislation.gov.uk/uksi/2017/752/regulation/23> |
| Payment Services Regulations 2017 (SI 2017/752) — full instrument | <https://www.legislation.gov.uk/uksi/2017/752> |
| Payment Services and Electronic Money — Our Approach (FCA, May 2026) | <https://www.fca.org.uk/publication/finalised-guidance/payment-services-electronic-money-approach.pdf> |
| FCA PS24/9 — Safeguarding reforms (2024) | <https://www.fca.org.uk/publication/policy/ps24-9.pdf> |
| FCA CP22/25 — Improving outcomes for consumers of payment and e-money firms | <https://www.fca.org.uk/publication/consultation/cp22-25.pdf> |
| FCA SUP 16 — Reporting requirements (entry point for Annex 34A/34B) | <https://www.handbook.fca.org.uk/handbook/SUP/16/> |
| FCA EMI and Payment Institutions — key publications | <https://www.fca.org.uk/firms/emi-payment-institutions-key-publications> |
