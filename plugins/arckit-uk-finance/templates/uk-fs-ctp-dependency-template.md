# UK FS Critical Third Parties (CTP) Dependency Assessment

> **Template Origin**: Community | **ArcKit Version**: [VERSION] | **Command**: `/arckit:uk-fs-ctp-dependency`

## Document Control

<!-- Default: OFFICIAL. Upgrade to OFFICIAL-SENSITIVE if this document reveals specific contractual
     exit terms, proprietary resilience-test outcomes, or provider-specific vulnerabilities that
     could be exploited if disclosed. Driven by user_config.default_classification. -->

| Field | Value |
|-------|-------|
| **Document ID** | {{DOCUMENT_ID}} |
| **Document Type** | UK FS CTP Dependency Assessment |
| **Project** | {{PROJECT_NAME}} |
| **Classification** | {{CLASSIFICATION}} |
| **Status** | DRAFT |
| **Version** | 1.0 |
| **Created Date** | {{CREATED_DATE}} |
| **Last Modified** | {{LAST_MODIFIED_DATE}} |
| **Review Cycle** | Annual (minimum); review immediately on any new HMT designation or material change to provider relationship |
| **Next Review Date** | {{NEXT_REVIEW_DATE}} |
| **Owner** | {{DOCUMENT_OWNER_ROLE}} — {{DOCUMENT_OWNER_NAME}} |
| **Reviewed By** | PENDING |
| **Approved By** | PENDING |
| **Distribution** | {{DISTRIBUTION}} |
| **Firm Authorisation / Registration Type** | {{FIRM_AUTHORISATION_TYPE}} |
| **FCA Firm Reference Number** | {{FCA_FRN}} |
| **SMF Holder (Operational Resilience)** | {{SMF_HOLDER_NAME}} — {{SMF_HOLDER_FUNCTION}} |

## Revision History

| Version | Date | Author | Changes | Approved By | Approval Date |
|---------|------|--------|---------|-------------|---------------|
| 1.0 | {{CREATED_DATE}} | ArcKit AI | Initial creation from `/arckit:uk-fs-ctp-dependency` command | PENDING | PENDING |

<!-- Add additional rows as needed -->

---

## Executive Summary

{{EXECUTIVE_SUMMARY_PARAGRAPH_1}}

{{EXECUTIVE_SUMMARY_PARAGRAPH_2}}

{{EXECUTIVE_SUMMARY_PARAGRAPH_3}}

> ⚠️ This document is a **working assessment** — not a regulatory submission. All CTP dependency
> assessments must be reviewed and signed off by qualified UK FS regulatory counsel, the firm's
> SMF holder for operational resilience (typically SMF24 — Chief Operations Function — at larger
> firms; SMF1 — CEO — at smaller firms), and the firm's Compliance Officer before presentation to
> the Board or submission to regulators. MLRO review is required only where a CTP relationship
> directly affects AML or sanctions screening capability. Regulatory citations reflect the position
> as at the document creation date; verify against current BoE, PRA, and FCA publications — in
> particular the HMT designation list — before reliance.

---

## 1. Regulatory Context

### 1.1 The CTP Regime

The Critical Third Parties (CTP) regime was introduced by the **Financial Services and Markets Act
2023 (FSMA 2023)**, which granted the Bank of England, PRA, and FCA powers in relation to CTPs.
The joint policy statement **BoE/PRA/FCA PS24/16** (published 12 November 2024) set out the final
rules and became effective **1 January 2025**.

The regime addresses systemic risk from third-party service providers: disruption to or failure of
a CTP — such as a cyber-attack, power outage, or technology failure — could affect many consumers
and firms simultaneously if multiple financial sector participants rely on the same provider.

### 1.2 Statutory Basis

| Instrument | Role |
|-----------|------|
| Financial Services and Markets Act 2023 (FSMA 2023) | Primary legislation granting HMT, BoE, PRA, and FCA powers over CTPs |
| BoE/PRA/FCA PS24/16 (effective 1 Jan 2025) | Final rules establishing CTP oversight framework |
| FCA 2024/41 — CTP Sourcebook instrument | FCA Sourcebook rules implementing PS24/16 |
| HMT Designation Regulations | Secondary legislation by which HMT formally designates CTPs following regulator recommendation |

### 1.3 Designation Process

The Bank of England, PRA, and FCA may recommend a third-party provider to HMT for designation as
a CTP. HMT takes the formal designation decision following engagement with the third-party supplier,
regulators, and stakeholders. Designation confers regulatory obligations directly on the CTP, as
well as heightened oversight obligations on firms that rely on designated CTPs.

**The designation list is still maturing.** The firm must verify the current HMT designation status
of each provider in this assessment before relying on it.

### 1.4 Firm Context

{{FIRM_CONTEXT_AND_IN_SCOPE_SERVICES_NARRATIVE}}

---

## 2. Firm's Reliance on Designated CTPs

*List each designated CTP the firm consumes services from. If the firm does not rely on any
currently-designated CTP, state "None currently designated — see §3 for material non-CTP providers"
with explicit justification.*

{{DESIGNATED_CTP_RELIANCE_NARRATIVE}}

| Provider | Designation status | Services consumed | Important Business Services affected |
|----------|--------------------|-------------------|--------------------------------------|
| {{DESIGNATED_PROVIDER_1_NAME}} | Designated CTP | {{DESIGNATED_PROVIDER_1_SERVICES}} | {{DESIGNATED_PROVIDER_1_IBS}} |
| {{DESIGNATED_PROVIDER_2_NAME}} | Designated CTP | {{DESIGNATED_PROVIDER_2_SERVICES}} | {{DESIGNATED_PROVIDER_2_IBS}} |

<!-- Add additional rows as needed -->

---

## 3. Non-Designated Material Third Parties

Providers that are not formally designated CTPs but that materially affect the firm's operational
resilience — because a failure would breach an Important Business Service (IBS) impact tolerance —
are still in scope for this assessment. They may become formally designated CTPs as HMT extends
designation over time.

{{NON_DESIGNATED_MATERIAL_THIRD_PARTIES_NARRATIVE}}

| Provider | Capability category | Why material | IBS affected |
|----------|--------------------|--------------|--------------|
| {{MATERIAL_NON_CTP_1_NAME}} | {{MATERIAL_NON_CTP_1_CATEGORY}} | {{MATERIAL_NON_CTP_1_WHY_MATERIAL}} | {{MATERIAL_NON_CTP_1_IBS}} |
| {{MATERIAL_NON_CTP_2_NAME}} | {{MATERIAL_NON_CTP_2_CATEGORY}} | {{MATERIAL_NON_CTP_2_WHY_MATERIAL}} | {{MATERIAL_NON_CTP_2_IBS}} |
| {{MATERIAL_NON_CTP_3_NAME}} | {{MATERIAL_NON_CTP_3_CATEGORY}} | {{MATERIAL_NON_CTP_3_WHY_MATERIAL}} | {{MATERIAL_NON_CTP_3_IBS}} |

<!-- Add additional rows as needed -->

---

## 4. Materiality Assessment Methodology

The firm scores the materiality of each third-party dependency across four dimensions. Providers
scoring 11 or above are treated as material regardless of formal CTP designation status.

| Dimension | Description | Score range |
|-----------|-------------|-------------|
| IBS dependency | Proportion of the firm's Important Business Services that would fail if this provider were unavailable | 1 (none) to 5 (all IBS) |
| Substitution difficulty | How hard it is to substitute this provider in the short term | 1 (commodity, easy) to 5 (proprietary, long lead time) |
| Recovery time impact | How long the firm would operate below its IBS tolerance if the provider failed | 1 (<1 hour) to 5 (>72 hours) |
| Concentration risk contribution | Does this provider increase geographic, vendor, or functional concentration? | 1 (no contribution) to 5 (sole provider for this capability or geography) |

**Overall materiality score** = sum of four dimensions (range 4–20).

| Score band | Materiality tier | Treatment |
|------------|-----------------|-----------|
| 16–20 | Critical | Treat as designated CTP equivalent regardless of formal designation |
| 11–15 | High | Material non-CTP: enhanced monitoring and annual substitution drill required |
| 6–10 | Medium | Monitor: document Nth-party risks; biennial substitution drill |
| 4–5 | Low | Maintain basic continuity plan |

### Materiality Score Summary

| Provider | IBS dependency | Substitution difficulty | Recovery time impact | Concentration contribution | Total score | Tier |
|----------|---------------|------------------------|---------------------|---------------------------|-------------|------|
| {{SCORING_PROVIDER_1_NAME}} | {{SCORING_PROVIDER_1_IBS}} | {{SCORING_PROVIDER_1_SUBS}} | {{SCORING_PROVIDER_1_RT}} | {{SCORING_PROVIDER_1_CONC}} | {{SCORING_PROVIDER_1_TOTAL}} | {{SCORING_PROVIDER_1_TIER}} |
| {{SCORING_PROVIDER_2_NAME}} | {{SCORING_PROVIDER_2_IBS}} | {{SCORING_PROVIDER_2_SUBS}} | {{SCORING_PROVIDER_2_RT}} | {{SCORING_PROVIDER_2_CONC}} | {{SCORING_PROVIDER_2_TOTAL}} | {{SCORING_PROVIDER_2_TIER}} |
| {{SCORING_PROVIDER_3_NAME}} | {{SCORING_PROVIDER_3_IBS}} | {{SCORING_PROVIDER_3_SUBS}} | {{SCORING_PROVIDER_3_RT}} | {{SCORING_PROVIDER_3_CONC}} | {{SCORING_PROVIDER_3_TOTAL}} | {{SCORING_PROVIDER_3_TIER}} |

<!-- Add additional rows as needed -->

---

## 5. Dependency Register

*The per-provider register blocks below are instantiated from the
`uk-fs-ctp-dependency-register-template.md` partial. One block per provider in scope.*

{{INSERT_DEPENDENCY_REGISTER_HERE}}

---

## 6. Resilience Testing Plan

### 6.1 Exit Drills

Exit drills test whether the firm can substitute a provider within the firm's IBS impact tolerance
without relying on the provider's own cooperation.

| Provider | Drill type | Planned frequency | Last conducted | Next planned date | Accountable SMF |
|----------|-----------|-------------------|----------------|-------------------|-----------------|
| {{EXIT_DRILL_PROVIDER_1}} | Full exit simulation | Annual | {{EXIT_DRILL_PROVIDER_1_LAST_DATE}} | {{EXIT_DRILL_PROVIDER_1_NEXT_DATE}} | {{EXIT_DRILL_PROVIDER_1_SMF}} |
| {{EXIT_DRILL_PROVIDER_2}} | Tabletop exercise | Annual | {{EXIT_DRILL_PROVIDER_2_LAST_DATE}} | {{EXIT_DRILL_PROVIDER_2_NEXT_DATE}} | {{EXIT_DRILL_PROVIDER_2_SMF}} |

<!-- Add additional rows as needed -->

### 6.2 Substitution Drills

Substitution drills validate that the firm can invoke a secondary provider and restore IBS within
the agreed recovery time objective.

| Provider | Secondary provider | Last substitution drill date | Drill outcome | Recovery time achieved | Gap to IBS tolerance |
|----------|--------------------|------------------------------|---------------|------------------------|----------------------|
| {{SUBS_DRILL_PROVIDER_1}} | {{SUBS_DRILL_SECONDARY_1}} | {{SUBS_DRILL_DATE_1}} | {{SUBS_DRILL_OUTCOME_1}} | {{SUBS_DRILL_RTO_ACHIEVED_1}} | {{SUBS_DRILL_GAP_1}} |
| {{SUBS_DRILL_PROVIDER_2}} | {{SUBS_DRILL_SECONDARY_2}} | {{SUBS_DRILL_DATE_2}} | {{SUBS_DRILL_OUTCOME_2}} | {{SUBS_DRILL_RTO_ACHIEVED_2}} | {{SUBS_DRILL_GAP_2}} |

<!-- Add additional rows as needed -->

### 6.3 Scenario Tests

| Scenario | Providers affected | Last test date | Outcome | Remediation actions |
|----------|--------------------|----------------|---------|---------------------|
| {{SCENARIO_1_NAME}} | {{SCENARIO_1_PROVIDERS}} | {{SCENARIO_1_DATE}} | {{SCENARIO_1_OUTCOME}} | {{SCENARIO_1_ACTIONS}} |
| {{SCENARIO_2_NAME}} | {{SCENARIO_2_PROVIDERS}} | {{SCENARIO_2_DATE}} | {{SCENARIO_2_OUTCOME}} | {{SCENARIO_2_ACTIONS}} |

<!-- Add additional rows as needed -->

### 6.4 Testing Cadence and Evidence Retention

| Tier | Drill type | Minimum frequency | Evidence retained | Retention period |
|------|-----------|-------------------|-------------------|------------------|
| Critical (score 16–20) | Full exit drill + scenario test | Annual | Test plan, outcomes, remediation log | {{DRILL_EVIDENCE_RETENTION_PERIOD}} |
| High (score 11–15) | Substitution drill | Annual | Outcomes and gap analysis | {{DRILL_EVIDENCE_RETENTION_PERIOD}} |
| Medium (score 6–10) | Tabletop exercise | Biennial | Exercise notes | {{DRILL_EVIDENCE_RETENTION_PERIOD}} |
| Low (score 4–5) | Continuity plan review | Biennial | Review sign-off | {{DRILL_EVIDENCE_RETENTION_PERIOD}} |

---

## 7. Concentration Risk Analysis

### 7.1 Geographic Concentration

{{GEOGRAPHIC_CONCENTRATION_NARRATIVE}}

| Risk | Providers affected | Maximum correlated failure scenario | Mitigation |
|------|-------------------|-------------------------------------|------------|
| {{GEO_RISK_1_DESCRIPTION}} | {{GEO_RISK_1_PROVIDERS}} | {{GEO_RISK_1_FAILURE_SCENARIO}} | {{GEO_RISK_1_MITIGATION}} |
| {{GEO_RISK_2_DESCRIPTION}} | {{GEO_RISK_2_PROVIDERS}} | {{GEO_RISK_2_FAILURE_SCENARIO}} | {{GEO_RISK_2_MITIGATION}} |

<!-- Add additional rows as needed -->

### 7.2 Vendor Concentration

{{VENDOR_CONCENTRATION_NARRATIVE}}

| Risk | Vendor / parent entity | Capabilities affected | Mitigation |
|------|------------------------|----------------------|------------|
| {{VENDOR_RISK_1_DESCRIPTION}} | {{VENDOR_RISK_1_ENTITY}} | {{VENDOR_RISK_1_CAPABILITIES}} | {{VENDOR_RISK_1_MITIGATION}} |
| {{VENDOR_RISK_2_DESCRIPTION}} | {{VENDOR_RISK_2_ENTITY}} | {{VENDOR_RISK_2_CAPABILITIES}} | {{VENDOR_RISK_2_MITIGATION}} |

<!-- Add additional rows as needed -->

### 7.3 Functional Concentration

{{FUNCTIONAL_CONCENTRATION_NARRATIVE}}

| Function | Sole provider? | Secondary provider | Accepted risk or active mitigation |
|----------|---------------|-------------------|-------------------------------------|
| {{FUNC_CONCENTRATION_1_FUNCTION}} | {{FUNC_CONCENTRATION_1_SOLE}} | {{FUNC_CONCENTRATION_1_SECONDARY}} | {{FUNC_CONCENTRATION_1_MITIGATION}} |
| {{FUNC_CONCENTRATION_2_FUNCTION}} | {{FUNC_CONCENTRATION_2_SOLE}} | {{FUNC_CONCENTRATION_2_SECONDARY}} | {{FUNC_CONCENTRATION_2_MITIGATION}} |

<!-- Add additional rows as needed -->

---

## 8. Reporting Obligations

### 8.1 When the Firm Must Notify Regulators

| Event | Notification recipient | Timing | Basis |
|-------|----------------------|--------|-------|
| Material service disruption from a designated CTP | FCA and PRA / BoE as applicable | As soon as practicable | PS24/16 CTP oversight framework |
| Change in reliance on a designated CTP that materially affects IBS | FCA | Within agreed notification window | PS24/16 |
| Discovery of a previously unidentified designated CTP dependency | FCA | At next scheduled review or sooner | PS24/16 |
| {{FIRM_SPECIFIC_NOTIFICATION_TRIGGER}} | {{FIRM_SPECIFIC_NOTIFICATION_RECIPIENT}} | {{FIRM_SPECIFIC_NOTIFICATION_TIMING}} | {{FIRM_SPECIFIC_NOTIFICATION_BASIS}} |

<!-- Add additional rows as needed -->

### 8.2 Internal Reporting

| Report | Recipient | Frequency | Owner |
|--------|-----------|-----------|-------|
| CTP dependency register review | Board / Risk Committee | Annual (minimum) | {{INTERNAL_REPORT_1_OWNER}} |
| Resilience test outcomes | SMF holder (Operational Resilience) | After each drill | {{INTERNAL_REPORT_2_OWNER}} |
| Concentration risk dashboard | Board Risk Committee | Quarterly | {{INTERNAL_REPORT_3_OWNER}} |
| New HMT designations — impact assessment | Compliance / SMF holder | Within 30 days of new designation | {{INTERNAL_REPORT_4_OWNER}} |

<!-- Add additional rows as needed -->

---

## 9. Control Library References — FINOS Common Cloud Controls

For CTPs that are cloud service providers, the **FINOS Common Cloud Controls (FINOS CCC)** project
provides an open standard describing consistent, technology-neutral controls for compliant public
cloud deployments in the financial services sector. FINOS CCC is a useful control-library reference
when mapping which cloud controls apply to each CTP relationship. It is not an FCA or PRA
regulatory mandate — cite it but do not treat it as a binding regulatory requirement.

> **FINOS CCC reference**: <https://www.finos.org/common-cloud-controls-project>

| Provider | FINOS CCC control categories applicable | Alignment assessment |
|----------|-----------------------------------------|----------------------|
| {{CCC_PROVIDER_1_NAME}} | {{CCC_PROVIDER_1_CATEGORIES}} | {{CCC_PROVIDER_1_ALIGNMENT}} |
| {{CCC_PROVIDER_2_NAME}} | {{CCC_PROVIDER_2_CATEGORIES}} | {{CCC_PROVIDER_2_ALIGNMENT}} |

<!-- Add additional rows as needed -->

---

## 10. References

| Reference | Citation | URL |
|-----------|----------|-----|
| PS24/16 | BoE/PRA/FCA PS24/16 — Operational resilience: Critical third parties to the UK financial sector (published 12 Nov 2024, effective 1 Jan 2025) | <https://www.fca.org.uk/publications/policy-statements/ps24-16-operational-resilience-critical-third-parties-uk-financial-sector> |
| FSMA 2023 | Financial Services and Markets Act 2023 — statutory basis for CTP powers | <https://www.legislation.gov.uk/ukpga/2023/29> |
| HMT Designation | HM Treasury — Critical Third Parties: HMT's approach to designation (March 2024) | <https://www.gov.uk/government/publications/critical-third-parties-hm-treasurys-approach-to-designation> |
| FCA 2024/41 | FCA CTP Sourcebook instrument implementing PS24/16 | <https://www.handbook.fca.org.uk/instrument/2024/FCA_2024_41.pdf> |
| FINOS CCC | FINOS Common Cloud Controls — open cloud control library for financial services | <https://www.finos.org/common-cloud-controls-project> |
| FCA Op Res | FCA Operational Resilience — firms guidance | <https://www.fca.org.uk/firms/operational-resilience> |

---

**Generated by**: ArcKit `/arckit:uk-fs-ctp-dependency` command
**Generated on**: [DATE]
**ArcKit Version**: [VERSION]
**Project**: [PROJECT_NAME]
**Model**: [AI_MODEL]
