# DORA Compliance Assessment

> **Template Origin**: Community | **ArcKit Version**: [VERSION] | **Command**: `/arckit.eu-dora`
>
> ⚠️ **Community-contributed** — not yet validated against current ANSSI/CNIL/EU regulatory text. Verify all citations before relying on output.

## Document Control

<!-- DOC-CONTROL-HEADER -->
<!-- Resolved at command-execution time to _partials/document-control-uk.md or _partials/document-control-uae.md based on plugin userConfig classification_scheme + governance_framework. See _partials/RENDERING.md (when present). -->

## Revision History

| Version | Date | Author | Changes | Approved By | Approval Date |
|---------|------|--------|---------|-------------|---------------|
| [VERSION] | [YYYY-MM-DD] | ArcKit AI | Initial creation from `/arckit.eu-dora` | [PENDING] | [PENDING] |

## Executive Summary

| Pillar | Current Maturity (L1–L5) | Required | Gap | Priority |
|--------|------------------------|---------|-----|---------|
| ICT Risk Management | [L1–L5] | L3+ | [Description] | 🔴/🟠/🟡 |
| Incident Reporting (4h/72h/1m) | [L1–L5] | L4 | [Description] | 🔴 |
| Resilience Testing | [L1–L5] | L3 | [Description] | 🟠 |
| Third-Party Management | [L1–L5] | L3+ | [Description] | 🔴 |
| Concentration Risk | [L1–L5] | L2 | [Description] | 🟠 |

Maturity scale: L1 = Initial / L2 = Developing / L3 = Defined / L4 = Managed / L5 = Optimising

---

## 1. Entity Scoping (Article 2)

### 1.1 In-Scope Entity Types

| Entity Type | In Scope | Supervisory Authority (FR) |
|------------|---------|---------------------------|
| Credit institutions | ☐ | ACPR |
| Payment institutions | ☐ | ACPR |
| Electronic money institutions | ☐ | ACPR |
| Investment firms | ☐ | AMF / ACPR |
| Crypto-asset service providers (MiCA) | ☐ | AMF |
| Insurance undertakings | ☐ | ACPR |
| Insurance intermediaries (> 250 employees) | ☐ | ACPR |
| Pension funds (> 15 members) | ☐ | ACPR |
| Central counterparties (CCPs) | ☐ | AMF |
| Trading venues | ☐ | AMF |
| ICT third-party service providers | ☐ | ESA-designated oversight |
| Credit rating agencies | ☐ | ESMA |

### 1.2 Proportionality

| Criterion | Assessment |
|-----------|-----------|
| Microenterprise (< 10 employees, < €2M turnover) | ☐ Yes — simplified regime may apply |
| Simplified ICT risk framework eligible (Article 16) | ☐ Yes ☐ No |

## 2. ICT Risk Management Framework (Articles 5–16)

| Requirement | Article | Status | Gap |
|-------------|---------|--------|-----|
| ICT risk management framework documented and maintained | Art. 5 | ☐ | |
| Management body accountability for ICT risk | Art. 5(2) | ☐ | |
| ICT risk tolerance statement defined | Art. 6(8) | ☐ | |
| Asset identification and classification | Art. 8 | ☐ | |
| Protection and prevention measures | Art. 9 | ☐ | |
| Detection mechanisms | Art. 10 | ☐ | |
| Response and recovery plans | Art. 11 | ☐ | |
| Backup policies and recovery procedures | Art. 12 | ☐ | |
| Communication plan for ICT incidents | Art. 14 | ☐ | |
| Learning and evolving — post-incident review | Art. 15 | ☐ | |

## 3. ICT-Related Incident Management (Articles 17–23)

### 3.1 Incident Classification

| Criterion | Major Incident Threshold |
|-----------|------------------------|
| Clients affected | [Number or % of client base] |
| Transaction volume affected | [Volume and value] |
| Duration | [Hours of unavailability] |
| Reputational impact | [Media, regulatory attention] |
| Geographical spread | [Single / multi-member state] |
| Economic impact | [Amount or % of capital] |

**Incident classification procedure in place**: ☐ Yes ☐ No

### 3.2 Reporting Timeline (Major ICT Incidents)

| Report | Deadline | Recipient | Content |
|--------|---------|-----------|---------|
| Initial notification | **4 hours** after classification as major (max 24h after detection) | ACPR / AMF | Incident summary, impact assessment |
| Intermediate report | **72 hours** after initial notification | ACPR / AMF | Updated details, preliminary root cause |
| Final report | **1 month** after resolution | ACPR / AMF | Full root cause, impact, cross-border effects, remediation |

### 3.3 Reporting Readiness

| Capability | Status |
|------------|--------|
| Major incident classification criteria documented | ☐ |
| 4-hour reporting capability established | ☐ |
| ACPR/AMF reporting portal registered | ☐ |
| Incident response team identified | ☐ |
| Voluntary cyber threat reporting process defined | ☐ |

## 4. Digital Operational Resilience Testing (Articles 24–27)

| Testing Type | Frequency | Scope | Status |
|-------------|-----------|-------|--------|
| Vulnerability assessment | Annual | All in-scope ICT systems | ☐ |
| Open-source analysis | Annual | Software components | ☐ |
| Network security assessment | Annual | Network infrastructure | ☐ |
| Gap analysis | Annual | Controls vs requirements | ☐ |
| Source code review (where applicable) | Annual | Critical applications | ☐ |
| Scenario-based tests | Annual | Business continuity scenarios | ☐ |
| TLPT (Threat-Led Penetration Testing) | Every **3 years** | Critical systems (significant entities only) | ☐ |

### 4.1 TLPT Requirements (Article 26) — Significant Entities Only

| Requirement | Status |
|-------------|--------|
| Based on TIBER-EU framework | ☐ |
| Certified external testers engaged | ☐ |
| Scope defined with competent authority | ☐ |
| Results shared with competent authority | ☐ |
| Remediation plan prepared and executed | ☐ |

## 5. ICT Third-Party Risk Management (Articles 28–44)

### 5.1 Register of ICT Arrangements (Article 28)

| Provider | Service | Criticality | Contractual Requirements Met | Last Review |
|---------|---------|------------|---------------------------|------------|
| [Cloud provider] | [IaaS/PaaS/SaaS] | ☐ Critical ☐ Non-critical | ☐ | [Date] |
| [SaaS provider] | [Core system] | ☐ Critical ☐ Non-critical | ☐ | [Date] |

### 5.2 Mandatory Contract Provisions (Article 30)

All ICT contracts must include:

- [ ] Service level descriptions with quantitative/qualitative performance targets
- [ ] Notice periods and reporting obligations to financial entity
- [ ] Data processing location (country/region)
- [ ] Cooperation with supervisory authorities
- [ ] Termination rights (including orderly exit)
- [ ] Audit rights and right of access (including sub-contractor audits)
- [ ] Business continuity provisions

### 5.3 Critical ITPP Oversight (Article 31+)

If using a provider designated as **critical ICT third-party provider** (CITPP) by ESAs:

- [ ] Enhanced contractual requirements applied
- [ ] Lead overseer cooperation established
- [ ] Participation in ESA oversight activities committed

### 5.4 Concentration Risk (Article 29)

| Requirement | Status |
|-------------|--------|
| ICT concentration risk assessed | ☐ |
| Over-reliance on single provider identified and managed | ☐ |
| Multi-cloud or multi-provider strategy documented (if risk identified) | ☐ |
| Exit strategy documented for each critical provider | ☐ |

## 6. French Supervisory Authority Context

| Authority | Role | DORA Powers |
|-----------|------|------------|
| ACPR | Supervises banks, insurance, payment institutions | Incident notification recipient; resilience testing oversight; ICT third-party register access |
| AMF | Supervises investment firms, CCPs, trading venues | Same as ACPR for in-scope entities |
| Banque de France | Central bank; systemic risk coordination | Coordination with ACPR; systemic risk monitoring |
| ANSSI | National cybersecurity authority | Technical input on incidents; SecNumCloud guidance for cloud providers |

### 6.1 ACPR DORA Implementation Notes

- [ ] ACPR DORA circulaires reviewed
- [ ] Pre-DORA ACPR ICT/cloud requirements supersession confirmed
- [ ] French transposition specifics assessed

## 7. Gap Analysis and Roadmap

| Pillar | Gap Description | Priority | Owner | Deadline |
|--------|----------------|---------|-------|---------|
| ICT Risk Management | [Gap] | 🔴 High | [Role] | [Date] |
| Incident Reporting | [Gap] | 🔴 High | [Role] | [Date] |
| Resilience Testing | [Gap] | 🟠 Medium | [Role] | [Date] |
| Third-Party Management | [Gap] | 🔴 High | [Role] | [Date] |
| Concentration Risk | [Gap] | 🟠 Medium | [Role] | [Date] |

---

**Generated by**: ArcKit `/arckit.eu-dora` command
**Generated on**: [YYYY-MM-DD]
**ArcKit Version**: [VERSION]
**Project**: [PROJECT_NAME]
**Model**: [AI_MODEL]
