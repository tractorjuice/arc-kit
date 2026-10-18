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
subject to the Payment Services Regulations 2017 (PSRs 2017) and the FCA's Technical Standards on
Strong Customer Authentication and Common and Secure Methods of Communication (the UK SCA-RTS).
The FCA makes the UK SCA-RTS under PSRs 2017 regulation 106A; it replaced the EU text (Commission
Delegated Regulation (EU) 2018/389) on 31 December 2020 and has been amended since, most recently
by FCA 2025/62 (in force 19 March 2026).

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
- **Using the TRA (Transaction Risk Analysis) exemption** under Article 18 — the command produces
  the fraud-rate and exemption-threshold analysis and the continuous-monitoring framework that
  Articles 18 to 21 require. There is no application to the FCA; the conditions must be met
  continuously, and Article 20 governs reporting and cessation.
- **Post-change re-review** — PS21/19 (29 November 2021) split payment account information into
  Article 10 (direct access) and a new Article 10A (access through an AISP, in force 26 March
  2022). FCA 2025/62 (in force 19 March 2026) replaced the Article 11 contactless limits with a
  risk-based exemption. If the firm's SCA design predates either change, this command provides a
  structured re-assessment.
- **UK and EU divergence check** — the UK SCA-RTS is made and amended by the FCA and no longer
  tracks the EU text (the UK Article 10A and the current UK Article 11 differ from the EU text). For firms with EU
  operations, the EU standards apply separately; this command covers the UK position only.
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
   linking implementation per PSRs 2017 regulation 100(2) and SCA-RTS Article 5;
   exemption-decision engine architecture)
3. Exemption Applicability Matrix (one block per exemption, Articles 10 to 18; see below)
4. TRA Fraud Rate Analysis (Articles 18 to 20 — reference fraud rates, exemption threshold values,
   cessation rule, monitoring cadence)
5. Fraud Monitoring Framework (real-time controls, model retraining cadence, Article 20 reporting
   and MLRO notification triggers, Article 21 quarterly monitoring)
6. Audit Trail Requirements (fields logged per exemption decision, firm-set retention period)
7. References (all required citations)

---

## Key Regulatory Anchors

The command produces an exemption matrix covering all ten exemptions in Chapter 3 of the UK
SCA-RTS: Articles 10, 10A, 11, 12, 13, 14, 15, 16, 17 and 18. An exemption that does not fit the
firm's channels is recorded as DO_NOT_APPLY with a reason, not left out. The titles below are the
UK SCA-RTS headings in the FCA Handbook; the FCA Approach Document (May 2026), paragraph 20.41,
lists the same mapping.

| Article | Exemption (UK SCA-RTS) |
|---------|------------------------|
| Article 10 | Payment account information accessed directly by a payment service user (balance and last 90 days of transactions; SCA on first access and when more than 90 days have passed since the user last accessed the transaction history with SCA applied) |
| Article 10A | Payment account information accessed through an account information service provider (no SCA once SCA has been applied on at least one previous AISP access; in force 26 March 2022, PS21/19) |
| Article 11 | Contactless payments at point of sale (low-risk contactless transactions; no regulatory monetary limit since 19 March 2026, FCA 2025/62) |
| Article 12 | Unattended terminals for transport fares and parking fees |
| Article 13 | Trusted beneficiaries (SCA applies when the payer creates or amends the list) |
| Article 14 | Recurring transactions (same amount, same payee; SCA when the series is created, amended or first initiated) |
| Article 15 | Credit transfers between accounts held by the same natural or legal person at the same ASPSP |
| Article 16 | Low-value transactions (remote electronic payments of £25 or less, subject to a cumulative limit of £85 or five consecutive transactions since SCA was last applied) |
| Article 17 | Secure corporate payment processes and protocols (non-consumer payers only, where the FCA is satisfied security is at least equivalent) |
| Article 18 | Transaction risk analysis (TRA) |

Articles 19 (calculation of fraud rates), 20 (cessation of the TRA exemption) and 21 (monitoring)
set the conditions. Article 21 applies to every exemption in Articles 10 to 18.

**Article 18 (TRA) reference fraud rates and exemption threshold values** (UK SCA-RTS Appendix):

| ETV (up to) | Remote electronic card-based payments | Remote electronic credit transfers |
|-------------|---------------------------------------|------------------------------------|
| £85 | 0.13% | 0.015% |
| £220 | 0.06% | 0.01% |
| £440 | 0.01% | 0.005% |

The fraud rate is the value of unauthorised or fraudulent remote transactions divided by the value
of all remote transactions of that type, whether authenticated with SCA or exempted under Articles
13 to 18, on a rolling quarterly (90-day) basis (Article 19(1)).

**Cessation (Article 20)**: there is no percentage-of-reference trigger in the UK SCA-RTS. A PSP
using TRA must report to the FCA immediately when a monitored fraud rate exceeds the applicable
reference rate, with the measures it will take to restore compliance (Article 20(1)). It must stop
using TRA for that payment type and ETV band immediately if the rate exceeds the reference rate for
two consecutive quarters (Article 20(2)), and may resume only after one quarter at or below the
reference rate and a notification to the FCA with evidence (Article 20(3) and (4)). The FCA
Approach Document (May 2026), paragraph 20.80, gives a worked example and points to SUP 15.14.29
to SUP 15.14.37 for the notification requirements.

**UK and EU divergence note**: The UK SCA-RTS is made and amended by the FCA. UK-specific changes,
such as Article 10A and the risk-based Article 11 in force from 19 March 2026, do not apply in the
EU, and EU changes do not apply in the UK. Firms with EU operations must maintain separate
assessments.

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
  exemption is available only while the firm's fraud rate, calculated under Article 19, is at or
  below the reference rate for the ETV band it uses. Design the Article 20 reporting and cessation
  process and the Article 21 monitoring before implementing the exemption, not after.
- **Soft-decline support is mandatory even where an exemption is applied.** An issuer that
  disagrees with an acquirer-asserted exemption can soft-decline. The payment flow must support
  automatic fallback to full SCA on soft-decline. An acquirer-only exemption assertion without
  soft-decline support is not compliant.
- **Article 10A and the AISP 90-day reconfirmation are separate rules.** Article 10A lets the
  ASPSP stop applying SCA to AISP access once SCA has been applied on at least one previous AISP
  access; it sets no periodic ASPSP reauthentication. Article 36(6) separately requires the user to
  have confirmed with the AISP within the previous 90 days that they still consent before the AISP
  accesses data the user is not actively requesting. Neither rule is reset by a payment.
- **Where SCA is applied to an electronic remote payment transaction, it must include dynamic
  linking.** PSRs 2017 regulation 100(2) and SCA-RTS Article 5 bind the authentication code to the
  amount and the payee. Regulation 100(5) makes regulation 100(1) to (3) subject to the exemptions,
  so an exemption removes SCA for that transaction; it never permits SCA without dynamic linking.
- **Check the current UK SCA-RTS text in the FCA Handbook before production reliance.** FCA
  2025/62 (in force 19 March 2026) changed Article 11 only, removing the regulatory contactless
  limits. The Appendix reference fraud rates and ETVs are shown in the FCA Handbook as unchanged
  since 1 January 2021.
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
| UK SCA-RTS Chapter 3 — Exemptions from SCA, Articles 10 to 21 (FCA Handbook) | <https://handbook.fca.org.uk/technical-standards/s140c1226> |
| UK SCA-RTS Appendix — reference fraud rates and ETVs (FCA Handbook) | <https://handbook.fca.org.uk/technical-standards/provision/s140c1230sn0p1854> |
| Payment Services and Electronic Money — Our Approach (FCA, May 2026, Chapter 20) | <https://www.fca.org.uk/publication/finalised-guidance/payment-services-electronic-money-approach.pdf> |
| FCA Strong Customer Authentication — firms guidance | <https://www.fca.org.uk/firms/strong-customer-authentication> |
| FCA PS19/26 — UK SCA-RTS post-Brexit | <https://www.fca.org.uk/publications/policy-statements/ps19-26-brexit-regulatory-technical-standards-strong-customer-authentication> |
| FCA PS21/19 — SCA-RTS changes (Article 10A), 29 November 2021 | <https://www.fca.org.uk/publications/policy-statements/ps21-19-changes-sca-rts-and-guidance-approach-document-and-perimeter-guidance-manual> |
| FCA Handbook Notice 136 (December 2025) — FCA 2025/62, Article 11 in force 19 March 2026 | <https://www.fca.org.uk/publication/handbook/handbook-notice-136.pdf> |
| FCA SCA coronavirus extension statement (30 April 2020) | <https://www.fca.org.uk/news/statements/strong-customer-authentication-and-coronavirus> |
| UK Finance Industry Guidance on SCA (2025) | <https://www.ukfinance.org.uk/system/files/2025-07/UK-Finance-Industry-Guidance-Strong-Customer-Authentication.pdf> |
| FCA Payment Services Regulations and EMRs — key publications | <https://www.fca.org.uk/firms/emi-payment-institutions-key-publications> |
