# UK PSD2 SCA-RTS Exemption Design

> **Template Origin**: Community | **ArcKit Version**: [VERSION] | **Command**: `/arckit:uk-fs-sca-rts`

## Document Control

<!-- DOC-CONTROL-HEADER -->
<!-- Resolved at command-execution time per _partials/RENDERING.md. -->

<!-- Domain-specific fields, retained after the resolved header per the Document Control Standard. -->

| Field | Value |
|-------|-------|
| **Firm Authorisation Type** | {{FIRM_AUTHORISATION_TYPE}} (PSP / EMI / PI / ASPSP / TPP) |
| **FCA Firm Reference Number** | {{FCA_FRN}} |

## Revision History

| Version | Date | Author | Changes | Approved By | Approval Date |
|---------|------|--------|---------|-------------|---------------|
| 1.0 | {{CREATED_DATE}} | ArcKit AI | Initial creation from `/arckit:uk-fs-sca-rts` command | PENDING | PENDING |

---

## Executive Summary

{{EXECUTIVE_SUMMARY_PARAGRAPH_1}}

{{EXECUTIVE_SUMMARY_PARAGRAPH_2}}

{{EXECUTIVE_SUMMARY_PARAGRAPH_3}}

> ⚠️ This document is a **working design pack** — not a regulatory submission. All exemption decisions
> must be reviewed and signed off by qualified UK FS regulatory counsel, the firm's MLRO, and the
> firm's Compliance Officer before production implementation. Regulatory citations reflect the
> position as at the document creation date; verify against current FCA publications before reliance.

---

## 1. Regulatory Context

### 1.1 Applicable Framework

Strong Customer Authentication (SCA) requirements for UK payment service providers derive from:

- **Payment Services Regulations 2017 (SI 2017/752), Regulation 100** — the primary legal obligation
  to apply SCA when a payer accesses a payment account online, initiates an electronic payment
  transaction, or carries out any action through a remote channel that may imply a risk of payment
  fraud or other abuses.
- **PSRs 2017, Regulation 106A** — grants the FCA power to make technical standards specifying SCA
  requirements, exemptions, and secure communication obligations.
- **The FCA's Technical Standards on Strong Customer Authentication and Common and Secure Methods
  of Communication (the UK SCA-RTS)** — made by the FCA under regulation 106A; they replaced
  Commission Delegated Regulation (EU) 2018/389 on 31 December 2020 and were amended by PS21/19
  (FCA 2021/45; Article 10A in force 26 March 2022) and FCA 2025/62 (Article 11, in force 19 March
  2026). They set out the SCA requirements (Articles 4 to 9, including dynamic linking in
  Article 5), the exemptions (Articles 10 to 18), and the fraud-rate calculation, cessation and
  monitoring rules (Articles 19 to 21). The current text is in the FCA Handbook under Technical
  Standards → Payment Services.
- **FCA Payment Services and Electronic Money — Our Approach Document (current edition)** — the
  FCA's non-binding but authoritative interpretive guidance on how it applies the PSRs 2017.

### 1.2 Regulatory Perimeter

| Entity type | SCA obligation? | Notes |
|-------------|-----------------|-------|
| Authorised Payment Institution (PI) | Yes | Full PSRs 2017 scope |
| E-Money Institution (EMI) | Yes | Via PSRs 2017 applied to e-money payment transactions |
| Account Servicing PSP (ASPSP) | Yes | Must offer an access interface (SCA-RTS Article 30; a dedicated interface for the accounts in Article 31(2)); may use Article 10A for AISP access |
| Third-Party Provider — PISP | Yes | May rely on the ASPSP's authentication procedures (PSRs 2017 Reg 100(4)) |
| Third-Party Provider — AISP | Yes | May rely on the ASPSP's authentication procedures (Reg 100(4)); user must reconfirm consent with the AISP every 90 days for access the user is not actively requesting (SCA-RTS Article 36(6)) |
| Small Payment Institution | Yes | Regulation 100 applies to all PSPs subject to the PSRs 2017; there is no size-based exemption (FCA Approach Document, May 2026, paragraph 20.1) |

**This firm's regulatory perimeter**: {{FIRM_AUTHORISATION_TYPE}} — {{REGULATORY_PERIMETER_NARRATIVE}}

### 1.3 In-Scope Payment Channels

{{IN_SCOPE_CHANNELS_LIST}}

### 1.4 Out-of-Scope Channels

{{OUT_OF_SCOPE_CHANNELS_LIST}}

---

## 2. Authentication Architecture

### 2.1 SCA Factor Inventory

SCA requires two or more independent elements from the following three categories (PSRs 2017
regulation 2(1), definition of strong customer authentication; SCA-RTS Articles 4 and 9). Dynamic
linking (PSRs 2017 regulation 100(2); SCA-RTS Article 5) must bind the authentication code to a
specific amount and payee for electronic remote payment transactions.

| Factor category | Elements available | Dynamic linking capable? |
|-----------------|--------------------|--------------------------|
| **Knowledge** — something only the user knows | {{KNOWLEDGE_FACTORS}} | {{KNOWLEDGE_DL}} |
| **Possession** — something only the user possesses | {{POSSESSION_FACTORS}} | {{POSSESSION_DL}} |
| **Inherence** — something the user is | {{INHERENCE_FACTORS}} | {{INHERENCE_DL}} |

### 2.2 Dynamic Linking Implementation

For remote payment transactions, the authentication code must be:

- Specific to the transaction amount and the payee at the time of authentication
- Invalidated if either the amount or payee changes after authentication

| Implementation element | Detail |
|------------------------|--------|
| **Transaction binding mechanism** | {{BINDING_MECHANISM}} |
| **Authentication code lifetime** | {{CODE_LIFETIME}} |
| **Fallback if amount/payee changes** | {{FALLBACK_MECHANISM}} |
| **Linkage verified by** | {{LINKAGE_VERIFICATION}} |

### 2.3 Exemption-Decision Engine Architecture

The exemption-decision engine determines at transaction time whether a full SCA challenge is
required or an exemption can be applied.

| Component | Description |
|-----------|-------------|
| **Decision layer** | {{DECISION_LAYER}} (issuer / acquirer / PSP middleware) |
| **Data inputs** | {{DECISION_INPUTS}} |
| **Exemption precedence order** | {{EXEMPTION_PRECEDENCE}} |
| **Fallback to full SCA** | {{FULL_SCA_FALLBACK}} |
| **Soft-decline handling** | {{SOFT_DECLINE_HANDLING}} |

---

## 3. Exemption Applicability Matrix

The sections below record the firm's design decision for each SCA-RTS exemption. Each entry uses
the format defined in `uk-fs-sca-rts-exemption-matrix-template.md`.

One entry per exemption in Chapter 3 of the UK SCA-RTS: Articles 10 (payment account information
accessed directly), 10A (payment account information accessed through an AISP), 11 (contactless
payments at point of sale), 12 (unattended terminals for transport fares and parking fees), 13
(trusted beneficiaries), 14 (recurring transactions), 15 (credit transfers between accounts held
by the same person), 16 (low-value transactions), 17 (secure corporate payment processes and
protocols) and 18 (transaction risk analysis). Record an exemption that does not fit the firm's
channels as DO_NOT_APPLY with the reason.

{{INSERT_EXEMPTION_MATRIX_ENTRIES_HERE}}

---

## 4. Transaction Risk Analysis (TRA) Thresholds

This section applies only if the firm is applying the Article 18 (TRA) exemption. If Article 18
is not applied (DO_NOT_APPLY decision in §3), mark this section N/A.

### 4.1 Reference Fraud Rates and Exemption Threshold Values (UK SCA-RTS Appendix)

A remote electronic payment can be exempted under Article 18 only if its amount does not exceed
the exemption threshold value (ETV) and the PSP's fraud rate for that payment type is at or below
the reference rate for that ETV (Article 18(2)(a) and (b)). The fraud rate is the value of
unauthorised or fraudulent remote transactions divided by the value of all remote transactions of
the same type, whether authenticated with SCA or exempted under Articles 13 to 18, calculated on a
rolling quarterly (90-day) basis (Article 19(1)). Rates are percentages of transaction value.

| ETV (transaction amount up to) | Reference fraud rate — remote electronic card-based payments | Reference fraud rate — remote electronic credit transfers |
|--------------------------------|---------------------------------------------------------------|------------------------------------------------------------|
| £85 | 0.13% | 0.015% |
| £220 | 0.06% | 0.01% |
| £440 | 0.01% | 0.005% |

Source: UK SCA-RTS Appendix (FCA Handbook, Technical Standards → Payment Services; shown as
unchanged since 1 January 2021), with guidance in the FCA Approach Document (May 2026),
paragraphs 20.71 to 20.80.

### 4.2 Firm Fraud Rate Monitoring

| Metric | Current value | Threshold | Status |
|--------|--------------|-----------|--------|
| Remote electronic card-based payment fraud rate (rolling 90 days) | {{CURRENT_CARD_FRAUD_RATE}} | {{TARGET_THRESHOLD}} (reference rate for the targeted ETV) | {{CARD_FRAUD_RATE_STATUS}} |
| Remote electronic credit transfer fraud rate (rolling 90 days) | {{CURRENT_CT_FRAUD_RATE}} | {{TARGET_CT_THRESHOLD}} (reference rate for the targeted ETV) | {{CT_FRAUD_RATE_STATUS}} |
| Firm early-warning threshold (internal control, not a regulatory threshold) | — | {{EARLY_WARNING_THRESHOLD}} | {{EARLY_WARNING_STATUS}} |
| Quarters above the reference rate, per ETV band (Article 20(2) cessation after two consecutive quarters) | {{QUARTERS_ABOVE_REFERENCE}} | 2 | {{CESSATION_STATUS}} |

### 4.3 FCA Reporting

| Requirement | Detail |
|-------------|--------|
| Reporting frequency | {{REPORTING_FREQUENCY}} |
| Report format | {{REPORT_FORMAT}} |
| Submission route | {{SUBMISSION_ROUTE}} |
| Escalation if threshold breached | {{ESCALATION_PATH}} |

---

## 5. Fraud Monitoring Framework

### 5.1 Real-Time Monitoring Controls

| Control | Description | Owner |
|---------|-------------|-------|
| {{CONTROL_1_NAME}} | {{CONTROL_1_DESCRIPTION}} | {{CONTROL_1_OWNER}} |
| {{CONTROL_2_NAME}} | {{CONTROL_2_DESCRIPTION}} | {{CONTROL_2_OWNER}} |
| {{CONTROL_3_NAME}} | {{CONTROL_3_DESCRIPTION}} | {{CONTROL_3_OWNER}} |

<!-- Add additional control rows as needed -->

### 5.2 Model Governance

| Element | Detail |
|---------|--------|
| **Model type** | {{MODEL_TYPE}} |
| **Training data cadence** | {{TRAINING_CADENCE}} |
| **Retraining trigger** | {{RETRAINING_TRIGGER}} |
| **Validation gate** | {{VALIDATION_GATE}} |
| **Champion/challenger regime** | {{CHAMPION_CHALLENGER}} |

### 5.3 Escalation Paths

| Trigger | Escalation action | Owner | SLA |
|---------|-------------------|-------|-----|
| Fraud rate reaches the firm's early-warning threshold (below the reference rate) | Internal alert to Fraud Operations | {{INTERNAL_ALERT_OWNER}} | {{INTERNAL_ALERT_SLA}} |
| Monitored fraud rate exceeds the applicable reference rate | Report to the FCA immediately with the measures to restore compliance (SCA-RTS Article 20(1)); MLRO + Compliance notified | Compliance Officer | Immediate |
| Fraud rate exceeds the reference rate for two consecutive quarters | Cease TRA for that payment type and ETV band immediately; apply SCA (Article 20(2)) | {{CESSATION_OWNER}} | Immediate |
| Fraud rate at or below the reference rate for one quarter after cessation | Notify the FCA with evidence before using TRA again (Article 20(3) and (4)) | Compliance Officer | {{RESUMPTION_SLA}} |
| Regulatory request for data | Provide audit trail within {{REGULATOR_SLA}} | Compliance Officer | {{REGULATORY_REQUEST_SLA}} |

---

## 6. Audit Trail Requirements

All exemption decisions must be logged to a tamper-evident audit trail. The fraud-rate methodology,
the fraud rates and the Article 21 monitoring results must be available to the FCA on request
(SCA-RTS Articles 19(3) and 21(2)).

### 6.1 Fields Logged Per Exemption Decision

| Field | Description | Format |
|-------|-------------|--------|
| `exemption_code` | Article reference applied (e.g., `ART10`, `ART10A`, `ART12`, `ART18`) | String |
| `transaction_reference` | Unique transaction ID | UUID |
| `transaction_amount` | Transaction value in minor currency units | Integer |
| `currency` | ISO 4217 currency code | String (3) |
| `payee_identifier` | Hashed payee account reference | SHA-256 hex |
| `channel` | Payment channel (e.g., `CNP_WEB`, `CNP_APP`, `POS_CONTACTLESS`) | Enum |
| `fraud_score` | Real-time fraud model score at decision time | Float 0.0–1.0 |
| `device_fingerprint_hash` | SHA-256 of device fingerprint inputs | Hex |
| `timestamp_utc` | Decision timestamp | ISO 8601 UTC |
| `sca_applied` | Whether full SCA was applied (true/false) | Boolean |
| `exemption_rationale` | Free-text reason if exemption overridden | String (256) |

### 6.2 Retention and Access

| Requirement | Detail |
|-------------|--------|
| **Retention period** | {{RETENTION_PERIOD}} (firm-set and confirmed with counsel; five years is a common baseline — PSRs 2017 Reg 100 sets no retention period) |
| **Storage location** | {{AUDIT_STORAGE_LOCATION}} |
| **Access controls** | {{AUDIT_ACCESS_CONTROLS}} |
| **Regulator-readable format** | Machine-readable (JSON / CSV export within 24 hours of request) |
| **Integrity mechanism** | {{INTEGRITY_MECHANISM}} (e.g., WORM storage, cryptographic hash chain) |

---

## 7. References

| Reference | Citation | URL |
|-----------|----------|-----|
| PSRs 2017 | Payment Services Regulations 2017 (SI 2017/752) | <https://www.legislation.gov.uk/uksi/2017/752> |
| PSRs 2017 Reg 100 | Authentication requirements | <https://www.legislation.gov.uk/uksi/2017/752/regulation/100> |
| PSRs 2017 Reg 106A | FCA power to make SCA technical standards | <https://www.legislation.gov.uk/uksi/2017/752/regulation/106A> |
| UK SCA-RTS Chapter 3 | Exemptions from strong customer authentication, Articles 10 to 21 (FCA Handbook) | <https://handbook.fca.org.uk/technical-standards/s140c1226> |
| UK SCA-RTS Appendix | Reference fraud rates and exemption threshold values (FCA Handbook) | <https://handbook.fca.org.uk/technical-standards/provision/s140c1230sn0p1854> |
| FCA Approach Document | Payment Services and Electronic Money — Our Approach (May 2026, Chapter 20) | <https://www.fca.org.uk/publication/finalised-guidance/payment-services-electronic-money-approach.pdf> |
| FCA Firms SCA Guidance | Strong Customer Authentication — FCA firms guidance page | <https://www.fca.org.uk/firms/strong-customer-authentication> |
| FCA PS19/26 | Brexit — UK SCA-RTS (post-EU-withdrawal framework) | <https://www.fca.org.uk/publications/policy-statements/ps19-26-brexit-regulatory-technical-standards-strong-customer-authentication> |
| FCA PS21/19 | Changes to SCA-RTS — Article 10A AISP exemption (29 November 2021) | <https://www.fca.org.uk/publications/policy-statements/ps21-19-changes-sca-rts-and-guidance-approach-document-and-perimeter-guidance-manual> |
| FCA Handbook Notice 136 | FCA 2025/62 — Article 11 risk-based contactless exemption, in force 19 March 2026 (December 2025) | <https://www.fca.org.uk/publication/handbook/handbook-notice-136.pdf> |
| FCA SCA coronavirus statement | FCA SCA extension — COVID-19 (30 April 2020) | <https://www.fca.org.uk/news/statements/strong-customer-authentication-and-coronavirus> |
| UK Finance SCA Guidance | UK Finance Industry Guidance on Strong Customer Authentication (2025) | <https://www.ukfinance.org.uk/system/files/2025-07/UK-Finance-Industry-Guidance-Strong-Customer-Authentication.pdf> |
| FCA key publications | FCA EMI and Payment Institutions — key publications | <https://www.fca.org.uk/firms/emi-payment-institutions-key-publications> |

## 8. External References

> This section provides traceability from generated content back to source documents.
> Follow citation instructions in the project's citation reference guide.

### Document Register

| Doc ID | Filename | Type | Source Location | Description |
|--------|----------|------|-----------------|-------------|
| *None provided* | — | — | — | — |

### Citations

| Citation ID | Doc ID | Page/Section | Category | Quoted Passage |
|-------------|--------|--------------|----------|----------------|
| — | — | — | — | — |

### Unreferenced Documents

| Filename | Source Location | Reason |
|----------|-----------------|--------|
| — | — | — |

---

**Generated by**: ArcKit `/arckit:uk-fs-sca-rts` command
**Generated on**: [DATE]
**ArcKit Version**: [VERSION]
**Project**: [PROJECT_NAME]
**Model**: [AI_MODEL]
