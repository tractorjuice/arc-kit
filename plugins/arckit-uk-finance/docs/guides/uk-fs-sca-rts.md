# SCA-RTS Exemption Design (`/arckit:uk-fs-sca-rts`)

> **Status**: EXPERIMENTAL · Community-contributed · **Output is not regulatory advice.**
> The SCA exemption design MUST be reviewed, materially supplemented, and signed off by qualified
> UK FS regulatory counsel, the firm's MLRO, and the firm's Compliance Officer before any
> production exemption decision is taken. FCA SCA-RTS publications and the UK Finance Industry
> Guidance may have been updated since this command was authored — verify against the source before
> reliance.

## Purpose

The `/arckit:uk-fs-sca-rts` command generates an SCA-RTS exemption design pack for an authorised
UK Payment Service Provider (PSP), Electronic Money Institution (EMI), or Payment Institution (PI)
subject to the Payment Services Regulations 2017 (PSRs 2017) and the UK Technical Standards on
Strong Customer Authentication (UK SCA-RTS, FCA 2020/70 as amended by FCA PS21/19).

The artefact is a structured, traceable document that maps the firm's payment channels and risk
profile to each applicable SCA-RTS exemption, documents the authentication architecture and dynamic
linking implementation, and defines the fraud monitoring framework and audit trail requirements. It
is not a regulatory filing or a legal opinion — it is the architecture evidence that supports the
firm's internal exemption decision-making and provides a traceable basis for FCA supervisory
engagement.

---

## When to Use

- **Designing a new payment product** where SCA applicability is uncertain — card-not-present
  checkout flows, open banking payment initiation, corporate payment channels.
- **Applying for a TRA (Transaction Risk Analysis) exemption** under Article 18 — the command
  produces the fraud rate band analysis and continuous-monitoring framework the FCA expects.
- **Post-PS21/19 re-review** — PS21/19 introduced Article 10A for AISP access reauthentication
  and modified the scope of Article 12 (now AISP-only). If the firm's SCA design predates PS21/19,
  this command provides a structured re-assessment.
- **Post-Brexit divergence check** — the UK SCA-RTS (FCA 2020/70) is diverging from the EU PSD3 /
  revised EU SCA-RTS trajectory. For firms with EU operations, the EU standards will evolve
  separately; this command covers the UK position only.
- **FCA supervisory engagement preparation** — providing structured, traceable SCA architecture
  documentation ahead of a skilled-person review or Dear CEO letter response.

---

## Inputs

Pass the project ID and product context as `$ARGUMENTS`:

```text
/arckit:uk-fs-sca-rts 001 card-not-present checkout flow
```

The argument should include:

- The project number or an existing project directory name (used to locate or create the project
  directory).
- A brief description of the payment product or channel in scope (used to populate the exemption
  applicability matrix with the correct channel context).

If the project directory does not yet exist, the command creates it. If it exists, it locates it by
scanning `projects/`.

---

## Output

**Doc-type code**: FSSCA

**Output path**: `projects/<NNN>-<slug>/payments-compliance/ARC-<NNN>-FSSCA-v1.0.md`

The generated artefact contains the following sections:

1. Document Control (classification, owner, SMF holder, review cycle)
2. Authentication Architecture (factor inventory: knowledge / possession / inherence; dynamic
   linking implementation per PSRs 2017 Reg 100(3); exemption-decision engine architecture)
3. Exemption Applicability Matrix (one block per applicable article; see below)
4. TRA Fraud Rate Analysis (Article 18 — fraud rate bands, threshold targets, monitoring cadence)
5. Fraud Monitoring Framework (real-time controls, model retraining cadence, MLRO notification
   triggers)
6. Audit Trail Requirements (fields logged per exemption decision, 5-year retention)
7. References (all required citations)

---

## Key Regulatory Anchors

The command produces an exemption matrix covering Articles 10, 10A, 11, and 13–18. Article 12 is
explicitly out of scope (AISP payment account access — not applicable to PSP/PI/EMI scope).

| Article | Exemption |
|---------|-----------|
| Article 10 | Low-value transactions (contactless POS, unattended transport / parking) |
| Article 10A | AISP access reauthentication (introduced by PS21/19) |
| Article 11 | Low-value contactless payments (card-not-present and card-present) |
| Article 13 | Trusted beneficiaries (payee whitelisting) |
| Article 14 | Recurring transactions (same payee, same amount) |
| Article 15 | Corporate payments via dedicated processes |
| Article 16 | Low-value remote electronic transactions (under £30) |
| Article 17 | Secure corporate payment processes and protocols |
| Article 18 | Transaction Risk Analysis (TRA) |

**Article 18 (TRA) fraud rate bands** (from PSRs 2017 Reg 106A technical standards):

- Remote card transactions: 0.13% / 0.06% / 0.01% (descending as transaction value increases)
- Credit transfers: 0.01% / 0.01% / 0.005% (descending as transaction value increases)

If the firm's measured fraud rate crosses 150% of the applicable reference rate, mandatory SCA
reintroduction is required and the FCA must be notified.

**Post-Brexit divergence note**: The UK SCA-RTS (FCA 2020/70) is no longer aligned to the EU
SCA-RTS as amended for PSD3. The EU trajectory (PSD3 / PSR EU 2024) introduces changes to
authentication factor requirements and TRA fraud bands that do not automatically apply in the UK.
Firms with EU-passported services must maintain separate assessments.

---

## Composes With

| Command | Relationship |
|---------|--------------|
| `/arckit:uk-fs-safeguarding` | PSP scope often overlaps EMI scope — if the firm also issues e-money, safeguarding is a parallel obligation. Run alongside or immediately after. |
| `/arckit:dpia` | SCA design involves biometrics, device fingerprinting, and behavioural data. A DPIA is required under UK GDPR where biometric data is processed for authentication. |
| `/arckit:adr` | Exemption application choices (e.g. whether to implement TRA at issuer or acquirer layer) are architectural decisions; record them as ADRs. |
| `/arckit:risk` | SCA exemption misapplication maps to fraud-loss and regulatory-enforcement risk entries in the project risk register. |

---

## Important Caveats

- **TRA is a continuous-monitoring exemption, not a one-time design decision.** The Article 18
  exemption is valid only while the firm's measured fraud rate remains at or below the applicable
  reference band. Design the ongoing monitoring and reporting framework before implementing the
  exemption, not after.
- **Soft-decline support is mandatory even where an exemption is applied.** An issuer that
  disagrees with an acquirer-asserted exemption can soft-decline. The payment flow must support
  automatic fallback to full SCA on soft-decline. An acquirer-only exemption assertion without
  soft-decline support is not compliant.
- **Article 10A's 90-day re-consent window resets on payment, not on balance check.** The consent
  token lifecycle must be designed around this distinction. Relying on "any access within 90 days"
  reads the standard incorrectly and creates an AISP access-disruption risk.
- **Dynamic linking applies regardless of exemption status for remote payment transactions where
  SCA is performed.** PSRs 2017 Reg 100(3) is a structural authentication requirement, not an
  exemption rule. Do not conflate exemption applicability with dynamic linking obligations.
- **The reference fraud rate bands change with FCA technical standards revisions.** FCA 2025/62
  (effective 2026-03-19) may have superseded the figures cited in this command. Verify against the
  current instrument before production reliance.
- **This artefact is architecture evidence, not a regulatory filing.** Production exemption
  decisions must be separately documented in the firm's Conduct Risk and Fraud Risk frameworks and
  approved by the MLRO and Compliance Officer.

---

## References

| Reference | URL |
|-----------|-----|
| Payment Services Regulations 2017 (SI 2017/752) | <https://www.legislation.gov.uk/uksi/2017/752> |
| PSRs 2017 Reg 100 — Authentication | <https://www.legislation.gov.uk/uksi/2017/752/regulation/100> |
| PSRs 2017 Reg 106A — Technical Standards power | <https://www.legislation.gov.uk/uksi/2017/752/regulation/106A> |
| Payment Services and Electronic Money — Our Approach (FCA) | <https://www.fca.org.uk/publication/finalised-guidance/payment-services-electronic-money-approach.pdf> |
| FCA Strong Customer Authentication — firms guidance | <https://www.fca.org.uk/firms/strong-customer-authentication> |
| FCA PS19/26 — UK SCA-RTS post-Brexit | <https://www.fca.org.uk/publications/policy-statements/ps19-26-brexit-regulatory-technical-standards-strong-customer-authentication> |
| FCA PS21/19 — SCA-RTS changes (Article 10A) | <https://www.fca.org.uk/publications/policy-statements/ps21-19-changes-sca-rts-and-guidance-approach-document-and-perimeter-guidance-manual> |
| FCA SCA coronavirus extension statement | <https://www.fca.org.uk/news/statements/strong-customer-authentication-and-coronavirus> |
| UK Finance Industry Guidance on SCA (2025) | <https://www.ukfinance.org.uk/system/files/2025-07/UK-Finance-Industry-Guidance-Strong-Customer-Authentication.pdf> |
| FCA Payment Services Regulations and EMRs — key publications | <https://www.fca.org.uk/firms/emi-payment-institutions-key-publications> |
