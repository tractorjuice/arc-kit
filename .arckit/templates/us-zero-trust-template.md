# CISA Zero Trust Maturity Assessment (v2.0)

> **Template Origin**: Community | **ArcKit Version**: [VERSION] | **Command**: `/arckit:us-zero-trust`

## Document Control

<!-- DOC-CONTROL-HEADER -->
<!-- Resolved at command-execution time per _partials/RENDERING.md. -->
<!-- Classification line MUST be: -->
<!-- | Classification | PUBLIC / OFFICIAL / OFFICIAL-SENSITIVE (set via `default_classification` user-config) | -->

## Revision History

| Version | Date | Author | Changes | Approved By | Approval Date |
|---------|------|--------|---------|-------------|---------------|
| [VERSION] | [YYYY-MM-DD] | ArcKit AI | Initial creation from `/arckit:us-zero-trust` command | PENDING | PENDING |

---

## Executive Summary

[Two to three paragraphs: scope of the assessment, current overall maturity, target overall maturity (Advanced is the OMB M-22-09 end-state expectation by FY2024 across all pillars), top three uplift priorities, and the estimated effort to reach target.]

---

## 1. Scope

| Field | Value |
|-------|-------|
| **System / Programme** | [Name] |
| **Agency** | [Agency] |
| **Assessment Date** | [YYYY-MM-DD] |
| **In-Scope Environments** | [Cloud / On-prem / Hybrid; named CSPs and data centres] |
| **Out-of-Scope** | [Anything explicitly excluded] |
| **Assessment Lead** | [Name + role] |
| **OMB M-22-09 Target Date** | [Original FY2024 — current re-baselined date if any] |

---

## 2. Five-Pillar Scoring Matrix

Score current and target maturity for each of the five CISA ZTMM pillars.

| Pillar | Traditional | Initial | Advanced | Optimal | Current | Target |
|--------|-------------|---------|----------|---------|---------|--------|
| **Identity** | [Description] | [Description] | [Description] | [Description] | [Stage] | [Stage] |
| **Devices** | [Description] | [Description] | [Description] | [Description] | [Stage] | [Stage] |
| **Networks** | [Description] | [Description] | [Description] | [Description] | [Stage] | [Stage] |
| **Applications & Workloads** | [Description] | [Description] | [Description] | [Description] | [Stage] | [Stage] |
| **Data** | [Description] | [Description] | [Description] | [Description] | [Stage] | [Stage] |

### Pillar Stage Reference

- **Traditional**: Manual processes, perimeter-centric, broad implicit trust.
- **Initial**: Some automation; basic visibility; least-privilege beginning.
- **Advanced**: Risk-informed adaptive controls; broad telemetry; automated policy enforcement.
- **Optimal**: Continuous adaptive risk-and-trust evaluation across all pillars; dynamic policy.

---

## 3. Cross-Cut Scoring Matrix

CISA ZTMM v2.0 cross-cutting capabilities applied across all five pillars.

| Cross-Cut | Traditional | Initial | Advanced | Optimal | Current | Target |
|-----------|-------------|---------|----------|---------|---------|--------|
| **Visibility & Analytics** | [Description] | [Description] | [Description] | [Description] | [Stage] | [Stage] |
| **Automation & Orchestration** | [Description] | [Description] | [Description] | [Description] | [Stage] | [Stage] |
| **Governance** | [Description] | [Description] | [Description] | [Description] | [Stage] | [Stage] |

---

## 4. Maturity Heatmap Summary

| Dimension | Current Overall | Target Overall | Gap |
|-----------|-----------------|----------------|-----|
| Identity | [Stage] | [Stage] | [Gap] |
| Devices | [Stage] | [Stage] | [Gap] |
| Networks | [Stage] | [Stage] | [Gap] |
| Applications & Workloads | [Stage] | [Stage] | [Gap] |
| Data | [Stage] | [Stage] | [Gap] |
| Visibility & Analytics | [Stage] | [Stage] | [Gap] |
| Automation & Orchestration | [Stage] | [Stage] | [Gap] |
| Governance | [Stage] | [Stage] | [Gap] |

**Overall Current Maturity**: [Stage] · **Overall Target Maturity**: [Advanced — OMB M-22-09]

---

## 5. Pillar-Specific Findings

### 5.1 Identity

**Current State**: [Describe IdP, MFA posture, account lifecycle, phishing-resistant authenticator coverage, privileged access management.]

**Uplift Opportunities**:

- [ ] Adopt phishing-resistant MFA (PIV / FIDO2 WebAuthn) for all users.
- [ ] Continuous identity-risk evaluation tied to step-up authentication.
- [ ] Just-in-time privileged access with full session recording.
- [Other]

### 5.2 Devices

**Current State**: [Describe device inventory, EDR coverage, device-health attestation, BYOD posture.]

**Uplift Opportunities**:

- [ ] Real-time device-health attestation as a condition of access (NIST SP 800-207 §2.1).
- [ ] EDR on 100% of endpoints per EO 14028.
- [ ] Mobile-device management (MDM) integration with policy decision point.
- [Other]

### 5.3 Networks

**Current State**: [Describe segmentation strategy, east-west encryption posture, micro-segmentation maturity, software-defined perimeter adoption.]

**Uplift Opportunities**:

- [ ] Micro-segmentation per workload identity.
- [ ] Encrypt all east-west traffic (mTLS / SMB encryption / IPsec).
- [ ] Replace VPN with identity-aware proxy / service-mesh ingress.
- [Other]

### 5.4 Applications & Workloads

**Current State**: [Describe workload identity, secrets management, application-layer authentication, runtime protection.]

**Uplift Opportunities**:

- [ ] Workload identity per service (SPIFFE / X.509 SVIDs).
- [ ] Secrets management via vault with short-lived dynamic credentials.
- [ ] Runtime application self-protection (RASP) / web application firewall (WAF).
- [Other]

### 5.5 Data

**Current State**: [Describe data classification, encryption-at-rest, DLP, data-access monitoring.]

**Uplift Opportunities**:

- [ ] Automated data classification at ingest.
- [ ] Encryption with FIPS 140-3 validated modules; customer-managed keys for high-impact data.
- [ ] Data-access analytics (UEBA on data plane).
- [Other]

---

## 6. Cross-Cut Findings

### 6.1 Visibility & Analytics

**Current State**: [SIEM coverage, telemetry pipelines, UEBA, dashboards.]

**Uplift Opportunities**:

- [ ] Unified telemetry across identity, device, network, application, data planes.
- [ ] ML-driven anomaly detection.
- [Other]

### 6.2 Automation & Orchestration

**Current State**: [SOAR adoption, automated incident response, policy-as-code maturity.]

**Uplift Opportunities**:

- [ ] Automated response playbooks for top-N incident types.
- [ ] Policy-as-code with version control and CI gates.
- [Other]

### 6.3 Governance

**Current State**: [Policy ownership, audit cadence, control attestation maturity.]

**Uplift Opportunities**:

- [ ] Continuous control monitoring with OSCAL.
- [ ] Quarterly ZT maturity re-assessment integrated into ConMon.
- [Other]

---

## 7. Prioritised Uplift Roadmap

| Initiative | Pillar(s) | Target Stage | Estimated Effort (FTE-months) | Dependencies | Owner | Target Date |
|------------|----------|--------------|-------------------------------|--------------|-------|-------------|
| Roll out phishing-resistant MFA | [Identity] | [Advanced] | [N] | [PIV / FIDO2 IdP capability] | [Identity team] | [YYYY-MM-DD] |
| Deploy EDR enterprise-wide | [Devices] | [Advanced] | [N] | [EDR procurement; FedRAMP-authorised] | [SecOps] | [YYYY-MM-DD] |
| Micro-segmentation pilot | [Networks] | [Advanced] | [N] | [Service-mesh selection] | [Platform team] | [YYYY-MM-DD] |
| Workload-identity pilot (SPIFFE) | [Apps & Workloads] | [Advanced] | [N] | [Service-mesh] | [Platform team] | [YYYY-MM-DD] |
| Data classification automation | [Data] | [Advanced] | [N] | [Classifier tooling; data inventory] | [Data team] | [YYYY-MM-DD] |
| Telemetry unification | [Visibility] | [Advanced] | [N] | [SIEM / data-lake selection] | [SOC] | [YYYY-MM-DD] |

---

## 8. Alignment to OMB M-22-09 End-State

| OMB M-22-09 Action | Status | Notes |
|--------------------|--------|-------|
| Enforce phishing-resistant MFA for federal staff and contractors | [Implemented / In progress / Planned] | [Notes] |
| Encrypt all DNS requests + HTTP traffic | [Implemented / In progress / Planned] | [Notes] |
| Inventory every device authorised + operated; treat as untrusted | [Implemented / In progress / Planned] | [Notes] |
| Reliable asset + vulnerability management; EDR per CISA OMB guidance | [Implemented / In progress / Planned] | [Notes] |
| Categorize data by sensitivity; encrypt accordingly | [Implemented / In progress / Planned] | [Notes] |
| Application security testing throughout SDLC | [Implemented / In progress / Planned] | [Notes] |

---

## 9. References

| Reference | Citation | URL |
|-----------|----------|-----|
| CISA ZTMM v2.0 | Zero Trust Maturity Model v2.0 | <https://www.cisa.gov/zero-trust-maturity-model> |
| OMB M-22-09 | Moving the U.S. Government Toward Zero Trust Cybersecurity Principles | <https://www.whitehouse.gov/wp-content/uploads/2022/01/M-22-09.pdf> |
| NIST SP 800-207 | Zero Trust Architecture | <https://doi.org/10.6028/NIST.SP.800-207> |
| EO 14028 | Improving the Nation's Cybersecurity | <https://www.federalregister.gov/d/2021-10460> |

---

## 10. Approvals

| Role | Name | Signature | Date |
|------|------|-----------|------|
| Assessment Lead | [Name] | [Signature] | [YYYY-MM-DD] |
| CISO | [Name] | [Signature] | [YYYY-MM-DD] |
| CIO | [Name] | [Signature] | [YYYY-MM-DD] |

---

**Generated by**: ArcKit `/arckit:us-zero-trust` command
**Generated on**: [DATE]
**ArcKit Version**: [VERSION]
**Project**: [PROJECT_NAME]
**Model**: [AI_MODEL]
