# UK PSD2 SCA-RTS Exemption Design

> **Template Origin**: Community | **ArcKit Version**: [VERSION] | **Command**: `/arckit:uk-fs-sca-rts`

## Document Control

<!-- Default: OFFICIAL. Use OFFICIAL-SENSITIVE if the document reveals proprietary fraud model parameters or detection thresholds. Driven by user_config.default_classification. -->

| Field | Value |
|-------|-------|
| **Document ID** | {{DOCUMENT_ID}} |
| **Document Type** | UK PSD2 SCA-RTS Exemption Design |
| **Project** | {{PROJECT_NAME}} |
| **Classification** | {{CLASSIFICATION}} |
| **Status** | DRAFT |
| **Version** | 1.0 |
| **Created Date** | {{CREATED_DATE}} |
| **Last Modified** | {{LAST_MODIFIED}} |
| **Review Cycle** | Quarterly |
| **Next Review Date** | {{NEXT_REVIEW_DATE}} |
| **Owner** | {{OWNER_ROLE}} — {{OWNER_NAME}} |
| **Reviewed By** | PENDING |
| **Approved By** | PENDING |
| **Distribution** | {{DISTRIBUTION}} |
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
- **UK Technical Standards on Strong Customer Authentication and Common and Secure Methods of
  Communication (FCA 2020/70, as amended by PS21/19)** — sets out the detailed exemption conditions
  (Articles 10–18) and dynamic-linking requirements that apply in Great Britain post-EU-withdrawal.
- **FCA Payment Services and Electronic Money — Our Approach Document (current edition)** — the
  FCA's non-binding but authoritative interpretive guidance on how it applies the PSRs 2017.

### 1.2 Regulatory Perimeter

| Entity type | SCA obligation? | Notes |
|-------------|-----------------|-------|
| Authorised Payment Institution (PI) | Yes | Full PSRs 2017 scope |
| E-Money Institution (EMI) | Yes | Via PSRs 2017 applied to e-money payment transactions |
| Account Servicing PSP (ASPSP) | Yes | Must offer dedicated interface; Article 10A applies |
| Third-Party Provider — PISP | Yes | Relies on ASPSP SCA; must not impede |
| Third-Party Provider — AISP | Yes (Art 10A post-PS21/19) | 90-day re-consent; exemption available |
| Small Payment Institution | Partial | Exempt from Reg 100 if below thresholds |

**This firm's regulatory perimeter**: {{FIRM_AUTHORISATION_TYPE}} — {{REGULATORY_PERIMETER_NARRATIVE}}

### 1.3 In-Scope Payment Channels

{{IN_SCOPE_CHANNELS_LIST}}

### 1.4 Out-of-Scope Channels

{{OUT_OF_SCOPE_CHANNELS_LIST}}

---

## 2. Authentication Architecture

### 2.1 SCA Factor Inventory

SCA requires at least two independent elements from the following three categories (PSRs 2017
Reg 100(2)). Dynamic linking (Reg 100(3)) must bind the authentication code to a specific amount
and payee for remote payment transactions.

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

**Article 12 is explicitly excluded from scope** — it applies only to payment account access by
Account Information Service Providers (AISPs) and has been superseded for AISP reauthentication
by Article 10A (PS21/19, effective 26 March 2022).

{{INSERT_EXEMPTION_MATRIX_ENTRIES_HERE}}

---

## 4. Transaction Risk Analysis (TRA) Thresholds

This section applies only if the firm is applying the Article 18 (TRA) exemption. If Article 18
is not applied (DO_NOT_APPLY decision in §3), mark this section N/A.

### 4.1 Reference Fraud Rates (UK SCA-RTS Article 18)

The following reference fraud rates must be continuously met for the TRA exemption to remain valid.
Fraud rates are expressed as basis points (bps) of transaction value — i.e., fraud losses divided
by total transaction value for the same transaction category and channel.

| Transaction value band | Reference fraud rate (remote card transactions) | Reference fraud rate (credit transfers) |
|------------------------|------------------------------------------------|----------------------------------------|
| Up to £30 | 0.13% | 0.01% |
| Up to £100 | 0.06% | 0.01% |
| Up to £250 | 0.01% | 0.005% |

Source: UK SCA-RTS (FCA 2020/70, amended per PS21/19), cross-referenced against FCA Approach
Document §§ on TRA.

### 4.2 Firm Fraud Rate Monitoring

| Metric | Current value | Threshold | Status |
|--------|--------------|-----------|--------|
| Remote card transaction fraud rate (rolling 90 days) | {{CURRENT_CARD_FRAUD_RATE}} | {{TARGET_THRESHOLD}} | {{CARD_FRAUD_RATE_STATUS}} |
| Credit transfer fraud rate (rolling 90 days) | {{CURRENT_CT_FRAUD_RATE}} | {{TARGET_CT_THRESHOLD}} | {{CT_FRAUD_RATE_STATUS}} |
| **150% threshold trigger (mandatory SCA reintroduction)** | — | {{TRIGGER_THRESHOLD}} | {{TRIGGER_STATUS}} |

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
| Fraud rate exceeds 100% of reference rate | Internal alert to Fraud Operations | {{INTERNAL_ALERT_OWNER}} | {{INTERNAL_ALERT_SLA}} |
| Fraud rate exceeds 150% of reference rate | Mandatory SCA reintroduction; MLRO + Compliance notified | MLRO | {{SCA_REINTRODUCTION_SLA}} |
| Regulatory request for data | Provide audit trail within {{REGULATOR_SLA}} | Compliance Officer | {{REGULATORY_REQUEST_SLA}} |

---

## 6. Audit Trail Requirements

All exemption decisions must be logged to a tamper-evident audit trail. The trail must be available
to the FCA on request (PSRs 2017 Reg 100 + FCA Handbook SYSC 9.1).

### 6.1 Fields Logged Per Exemption Decision

| Field | Description | Format |
|-------|-------------|--------|
| `exemption_code` | Article reference applied (e.g., `ART10`, `ART18`) | String |
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
| **Retention period** | Minimum 5 years (PSRs 2017 Reg 100; FCA SYSC 9.1) |
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
| FCA Approach Document | Payment Services and Electronic Money — Our Approach (current edition) | <https://www.fca.org.uk/publication/finalised-guidance/payment-services-electronic-money-approach.pdf> |
| FCA Firms SCA Guidance | Strong Customer Authentication — FCA firms guidance page | <https://www.fca.org.uk/firms/strong-customer-authentication> |
| FCA PS19/26 | Brexit — UK SCA-RTS (post-EU-withdrawal framework) | <https://www.fca.org.uk/publications/policy-statements/ps19-26-brexit-regulatory-technical-standards-strong-customer-authentication> |
| FCA PS21/19 | Changes to SCA-RTS — Article 10A AISP exemption | <https://www.fca.org.uk/publications/policy-statements/ps21-19-changes-sca-rts-and-guidance-approach-document-and-perimeter-guidance-manual> |
| FCA SCA coronavirus statement | FCA SCA extension — COVID-19 (30 April 2020) | <https://www.fca.org.uk/news/statements/strong-customer-authentication-and-coronavirus> |
| UK Finance SCA Guidance | UK Finance Industry Guidance on Strong Customer Authentication (2025) | <https://www.ukfinance.org.uk/system/files/2025-07/UK-Finance-Industry-Guidance-Strong-Customer-Authentication.pdf> |
| FCA key publications | FCA EMI and Payment Institutions — key publications | <https://www.fca.org.uk/firms/emi-payment-institutions-key-publications> |

---

**Generated by**: ArcKit `/arckit:uk-fs-sca-rts` command
**Generated on**: [DATE]
**ArcKit Version**: [VERSION]
**Project**: [PROJECT_NAME]
**Model**: [AI_MODEL]
