# CISA Zero Trust Maturity Assessment (v2.0)

> **Template Origin**: Community | **ArcKit Version**: [VERSION] | **Command**: `/arckit:us-zero-trust`

## Document Control

<!-- DOC-CONTROL-HEADER -->
<!-- Resolved at command-execution time per _partials/RENDERING.md. -->

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

## 4. Maturity Heatmap

### 4.1 Summary by Pillar and Cross-Cut

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

### 4.2 Function Heatmap — Current State

One row per pillar, one cell per ZTMM v2.0 function (Tables 2–7 of the model). Cell code: **T** Traditional · **I** Initial · **A** Advanced · **O** Optimal · **—** no such function in that row. Each code must match the function scores in Section 5 and, for the Cross-Cutting Capabilities row, Section 3. The last three columns are the Visibility & Analytics, Automation & Orchestration and Governance capabilities the model scores within each pillar.

| Pillar | Function 1 | Function 2 | Function 3 | Function 4 | Function 5 | Visibility & Analytics | Automation & Orchestration | Governance |
|--------|------------|------------|------------|------------|------------|------------------------|----------------------------|------------|
| **Identity** | Authentication: [T/I/A/O] | Identity Stores: [T/I/A/O] | Risk Assessments: [T/I/A/O] | Access Management: [T/I/A/O] | — | [T/I/A/O] | [T/I/A/O] | [T/I/A/O] |
| **Devices** | Policy Enforcement & Compliance Monitoring: [T/I/A/O] | Asset & Supply Chain Risk Management: [T/I/A/O] | Resource Access: [T/I/A/O] | Device Threat Protection: [T/I/A/O] | — | [T/I/A/O] | [T/I/A/O] | [T/I/A/O] |
| **Networks** | Network Segmentation: [T/I/A/O] | Network Traffic Management: [T/I/A/O] | Traffic Encryption: [T/I/A/O] | Network Resilience: [T/I/A/O] | — | [T/I/A/O] | [T/I/A/O] | [T/I/A/O] |
| **Applications & Workloads** | Application Access: [T/I/A/O] | Application Threat Protections: [T/I/A/O] | Accessible Applications: [T/I/A/O] | Secure Application Development & Deployment Workflow: [T/I/A/O] | Application Security Testing: [T/I/A/O] | [T/I/A/O] | [T/I/A/O] | [T/I/A/O] |
| **Data** | Data Inventory Management: [T/I/A/O] | Data Categorization: [T/I/A/O] | Data Availability: [T/I/A/O] | Data Access: [T/I/A/O] | Data Encryption: [T/I/A/O] | [T/I/A/O] | [T/I/A/O] | [T/I/A/O] |
| **Cross-Cutting Capabilities** | — | — | — | — | — | [T/I/A/O] | [T/I/A/O] | [T/I/A/O] |

### 4.3 Function Heatmap — Target State

Same rows and columns as 4.2, with the target stage for each function. No target may sit below its current stage.

| Pillar | Function 1 | Function 2 | Function 3 | Function 4 | Function 5 | Visibility & Analytics | Automation & Orchestration | Governance |
|--------|------------|------------|------------|------------|------------|------------------------|----------------------------|------------|
| **Identity** | Authentication: [T/I/A/O] | Identity Stores: [T/I/A/O] | Risk Assessments: [T/I/A/O] | Access Management: [T/I/A/O] | — | [T/I/A/O] | [T/I/A/O] | [T/I/A/O] |
| **Devices** | Policy Enforcement & Compliance Monitoring: [T/I/A/O] | Asset & Supply Chain Risk Management: [T/I/A/O] | Resource Access: [T/I/A/O] | Device Threat Protection: [T/I/A/O] | — | [T/I/A/O] | [T/I/A/O] | [T/I/A/O] |
| **Networks** | Network Segmentation: [T/I/A/O] | Network Traffic Management: [T/I/A/O] | Traffic Encryption: [T/I/A/O] | Network Resilience: [T/I/A/O] | — | [T/I/A/O] | [T/I/A/O] | [T/I/A/O] |
| **Applications & Workloads** | Application Access: [T/I/A/O] | Application Threat Protections: [T/I/A/O] | Accessible Applications: [T/I/A/O] | Secure Application Development & Deployment Workflow: [T/I/A/O] | Application Security Testing: [T/I/A/O] | [T/I/A/O] | [T/I/A/O] | [T/I/A/O] |
| **Data** | Data Inventory Management: [T/I/A/O] | Data Categorization: [T/I/A/O] | Data Availability: [T/I/A/O] | Data Access: [T/I/A/O] | Data Encryption: [T/I/A/O] | [T/I/A/O] | [T/I/A/O] | [T/I/A/O] |
| **Cross-Cutting Capabilities** | — | — | — | — | — | [T/I/A/O] | [T/I/A/O] | [T/I/A/O] |

---

## 5. Pillar-Specific Findings

Score every ZTMM v2.0 function in each pillar, including the pillar's own Visibility & Analytics, Automation & Orchestration and Governance capabilities. Stages: Traditional / Initial / Advanced / Optimal.

### 5.1 Identity

**Current State**: [Describe IdP, MFA posture, account lifecycle, phishing-resistant authenticator coverage, privileged access management.]

| Function | Current Stage | Evidence | Target Stage | Gap Actions |
|----------|---------------|----------|--------------|-------------|
| Authentication | [Stage] | [1–2 sentences] | [Stage] | [Actions] |
| Identity Stores | [Stage] | [Evidence] | [Stage] | [Actions] |
| Risk Assessments | [Stage] | [Evidence] | [Stage] | [Actions] |
| Access Management | [Stage] | [Evidence] | [Stage] | [Actions] |
| Visibility & Analytics | [Stage] | [Evidence] | [Stage] | [Actions] |
| Automation & Orchestration | [Stage] | [Evidence] | [Stage] | [Actions] |
| Governance | [Stage] | [Evidence] | [Stage] | [Actions] |

**Uplift Opportunities**:

- [ ] Adopt phishing-resistant MFA (PIV / FIDO2 WebAuthn) for all users.
- [ ] Continuous identity-risk evaluation tied to step-up authentication.
- [ ] Just-in-time privileged access with full session recording.
- [Other]

### 5.2 Devices

**Current State**: [Describe device inventory, EDR coverage, device-health attestation, BYOD posture.]

| Function | Current Stage | Evidence | Target Stage | Gap Actions |
|----------|---------------|----------|--------------|-------------|
| Policy Enforcement & Compliance Monitoring | [Stage] | [1–2 sentences] | [Stage] | [Actions] |
| Asset & Supply Chain Risk Management | [Stage] | [Evidence] | [Stage] | [Actions] |
| Resource Access | [Stage] | [Evidence] | [Stage] | [Actions] |
| Device Threat Protection | [Stage] | [Evidence] | [Stage] | [Actions] |
| Visibility & Analytics | [Stage] | [Evidence] | [Stage] | [Actions] |
| Automation & Orchestration | [Stage] | [Evidence] | [Stage] | [Actions] |
| Governance | [Stage] | [Evidence] | [Stage] | [Actions] |

**Uplift Opportunities**:

- [ ] Real-time device-health attestation as a condition of access (NIST SP 800-207 §2.1).
- [ ] EDR on 100% of endpoints per EO 14028.
- [ ] Mobile-device management (MDM) integration with policy decision point.
- [Other]

### 5.3 Networks

**Current State**: [Describe segmentation strategy, east-west encryption posture, micro-segmentation maturity, software-defined perimeter adoption.]

| Function | Current Stage | Evidence | Target Stage | Gap Actions |
|----------|---------------|----------|--------------|-------------|
| Network Segmentation | [Stage] | [1–2 sentences] | [Stage] | [Actions] |
| Network Traffic Management | [Stage] | [Evidence] | [Stage] | [Actions] |
| Traffic Encryption | [Stage] | [Evidence] | [Stage] | [Actions] |
| Network Resilience | [Stage] | [Evidence] | [Stage] | [Actions] |
| Visibility & Analytics | [Stage] | [Evidence] | [Stage] | [Actions] |
| Automation & Orchestration | [Stage] | [Evidence] | [Stage] | [Actions] |
| Governance | [Stage] | [Evidence] | [Stage] | [Actions] |

**Uplift Opportunities**:

- [ ] Micro-segmentation per workload identity.
- [ ] Encrypt all east-west traffic (mTLS / SMB encryption / IPsec).
- [ ] Replace VPN with identity-aware proxy / service-mesh ingress.
- [Other]

### 5.4 Applications & Workloads

**Current State**: [Describe workload identity, secrets management, application-layer authentication, runtime protection.]

| Function | Current Stage | Evidence | Target Stage | Gap Actions |
|----------|---------------|----------|--------------|-------------|
| Application Access | [Stage] | [1–2 sentences] | [Stage] | [Actions] |
| Application Threat Protections | [Stage] | [Evidence] | [Stage] | [Actions] |
| Accessible Applications | [Stage] | [Evidence] | [Stage] | [Actions] |
| Secure Application Development & Deployment Workflow | [Stage] | [Evidence] | [Stage] | [Actions] |
| Application Security Testing | [Stage] | [Evidence] | [Stage] | [Actions] |
| Visibility & Analytics | [Stage] | [Evidence] | [Stage] | [Actions] |
| Automation & Orchestration | [Stage] | [Evidence] | [Stage] | [Actions] |
| Governance | [Stage] | [Evidence] | [Stage] | [Actions] |

**Uplift Opportunities**:

- [ ] Workload identity per service (SPIFFE / X.509 SVIDs).
- [ ] Secrets management via vault with short-lived dynamic credentials.
- [ ] Runtime application self-protection (RASP) / web application firewall (WAF).
- [Other]

### 5.5 Data

**Current State**: [Describe data classification, encryption-at-rest, DLP, data-access monitoring.]

| Function | Current Stage | Evidence | Target Stage | Gap Actions |
|----------|---------------|----------|--------------|-------------|
| Data Inventory Management | [Stage] | [1–2 sentences] | [Stage] | [Actions] |
| Data Categorization | [Stage] | [Evidence] | [Stage] | [Actions] |
| Data Availability | [Stage] | [Evidence] | [Stage] | [Actions] |
| Data Access | [Stage] | [Evidence] | [Stage] | [Actions] |
| Data Encryption | [Stage] | [Evidence] | [Stage] | [Actions] |
| Visibility & Analytics | [Stage] | [Evidence] | [Stage] | [Actions] |
| Automation & Orchestration | [Stage] | [Evidence] | [Stage] | [Actions] |
| Governance | [Stage] | [Evidence] | [Stage] | [Actions] |

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

## 9. NIST SP 800-53 Rev 5 Control Linkage

Map every ZTMM function to the NIST SP 800-53 Rev 5 controls that evidence it, and record each control's status in the NIST 800-53 artefact (`ARC-{P}-NIST-v*`). Flag for re-tailoring any control whose function sits below its target stage, or that the artefact does not yet carry. Three rows carry example control IDs; replace every row with the system's own mapping.

| Pillar / Cross-Cut | ZTMM Function | NIST SP 800-53 Rev 5 Controls | Status in NIST Artefact | Re-tailoring Needed? |
|--------------------|---------------|-------------------------------|-------------------------|----------------------|
| Identity | Authentication | [e.g. IA-2, IA-2(1), IA-2(2), IA-5, IA-8] | [Implemented / Inherited / Hybrid / Planned / Not in artefact] | [Yes / No — reason] |
| Identity | Identity Stores | [Control IDs] | [Status] | [Yes / No] |
| Identity | Risk Assessments | [Control IDs] | [Status] | [Yes / No] |
| Identity | Access Management | [Control IDs] | [Status] | [Yes / No] |
| Devices | Policy Enforcement & Compliance Monitoring | [Control IDs] | [Status] | [Yes / No] |
| Devices | Asset & Supply Chain Risk Management | [Control IDs] | [Status] | [Yes / No] |
| Devices | Resource Access | [Control IDs] | [Status] | [Yes / No] |
| Devices | Device Threat Protection | [Control IDs] | [Status] | [Yes / No] |
| Networks | Network Segmentation | [e.g. SC-7, SC-7(4), SC-7(5), SC-7(8)] | [Status] | [Yes / No] |
| Networks | Network Traffic Management | [Control IDs] | [Status] | [Yes / No] |
| Networks | Traffic Encryption | [Control IDs] | [Status] | [Yes / No] |
| Networks | Network Resilience | [Control IDs] | [Status] | [Yes / No] |
| Applications & Workloads | Application Access | [Control IDs] | [Status] | [Yes / No] |
| Applications & Workloads | Application Threat Protections | [Control IDs] | [Status] | [Yes / No] |
| Applications & Workloads | Accessible Applications | [Control IDs] | [Status] | [Yes / No] |
| Applications & Workloads | Secure Application Development & Deployment Workflow | [Control IDs] | [Status] | [Yes / No] |
| Applications & Workloads | Application Security Testing | [Control IDs] | [Status] | [Yes / No] |
| Data | Data Inventory Management | [Control IDs] | [Status] | [Yes / No] |
| Data | Data Categorization | [Control IDs] | [Status] | [Yes / No] |
| Data | Data Availability | [Control IDs] | [Status] | [Yes / No] |
| Data | Data Access | [Control IDs] | [Status] | [Yes / No] |
| Data | Data Encryption | [e.g. SC-13, SC-28, SC-28(1)] | [Status] | [Yes / No] |
| Cross-Cut | Visibility & Analytics | [Control IDs] | [Status] | [Yes / No] |
| Cross-Cut | Automation & Orchestration | [Control IDs] | [Status] | [Yes / No] |
| Cross-Cut | Governance | [Control IDs] | [Status] | [Yes / No] |

---

## 10. References

| Reference | Citation | URL |
|-----------|----------|-----|
| CISA ZTMM v2.0 | Zero Trust Maturity Model v2.0 | <https://www.cisa.gov/zero-trust-maturity-model> |
| OMB M-22-09 | Moving the U.S. Government Toward Zero Trust Cybersecurity Principles | <https://www.whitehouse.gov/wp-content/uploads/2022/01/M-22-09.pdf> |
| NIST SP 800-207 | Zero Trust Architecture | <https://doi.org/10.6028/NIST.SP.800-207> |
| EO 14028 | Improving the Nation's Cybersecurity | <https://www.federalregister.gov/d/2021-10460> |

---

## 11. Approvals

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
