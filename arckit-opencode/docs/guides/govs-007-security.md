# GovS 007: Security — ArcKit Reference Guide

This guide maps the [Government Functional Standard GovS 007: Security](https://www.gov.uk/government/publications/government-functional-standard-govs-007-security) to ArcKit commands and artefacts. GovS 007 is the cross-government baseline for protective security, sitting above the Cyber Security Standard and NCSC CAF in the governance hierarchy.

---

## Governance Hierarchy

```
GovS 007: Security (functional standard — 9 principles)
  └── Cyber Security Standard (July 2025 — mandatory CAF profiles, GovAssure, SbD)
        └── NCSC Cyber Assessment Framework (operational — 14 principles, 4 objectives)
              └── /arckit.secure assessment (evidence & tracking)
```

---

## Nine Security Principles

| # | GovS 007 Principle | Description | ArcKit Command / Artefact |
|---|---------------------|-------------|---------------------------|
| 1 | Governance aligned to organisational purpose | Security governance structures support organisational objectives | `/arckit:secure` (CAF A1), `/arckit:stakeholders` (SSRO/DSO roles) |
| 2 | Risk-based approach | Protective security decisions based on assessed risk | `/arckit:risk` (risk register), `/arckit:secure` (CAF A2) |
| 3 | Security integrated into all activities | Security considered throughout delivery, not bolted on | `/arckit:secure` (Secure Development S4), `/arckit:tcop` (Point 6) |
| 4 | Holistic security planning | Physical, personnel, cyber, technical, and industry security planned together | `/arckit:secure` (full CAF S1–S8), `/arckit:plan` |
| 5 | Security culture embedded | Staff aware of security responsibilities and behaviours | `/arckit:secure` (CAF B6 Staff Awareness) |
| 6 | Accountability at all levels | Named individuals accountable for security outcomes | `/arckit:stakeholders` (SSRO, DSO, SIRO roles), `/arckit:secure` sign-off |
| 7 | Proportionate security measures | Controls matched to data classification and risk level | `/arckit:secure` (Executive Summary classification → controls) |
| 8 | Continuous improvement | Security posture regularly reviewed and improved | `/arckit:secure` (CAF D2), `/arckit:operationalize` |
| 9 | Legal and regulatory compliance | Compliance with UK GDPR, Data Protection Act, sector regulations | `/arckit:dpia`, `/arckit:secure` (S3 UK GDPR) |

---

## Security Lifecycle

GovS 007 defines a four-phase security lifecycle. The table below maps each phase to ArcKit commands.

| Lifecycle Phase | Activities | ArcKit Commands |
|-----------------|-----------|-----------------|
| **Strategy & Planning** | Define security strategy, risk appetite, asset classification, roles | `/arckit:principles`, `/arckit:risk`, `/arckit:stakeholders` |
| **Prevention & Detection** | Implement controls, monitor threats, manage vulnerabilities | `/arckit:secure` (CAF B1–B6, C1–C2), `/arckit:diagram` |
| **Incident Response** | Detect, respond, report, recover from security incidents | `/arckit:operationalize` (incident management runbooks) |
| **Learning & Improvement** | Post-incident reviews, metrics, continuous improvement | `/arckit:secure` (CAF D2), `/arckit:risk` (updated risk register) |

---

## Protective Security Disciplines

| Discipline | Scope | Primary ArcKit Artefact |
|------------|-------|-------------------------|
| **Cyber Security** | Network, systems, data protection | `/arckit:secure` (CAF assessment) |
| **Physical Security** | Premises, facilities, physical access | `/arckit:mod-secure` (JSP 440), or noted in `/arckit:secure` |
| **Personnel Security** | Vetting, insider threat, staff clearances | `/arckit:mod-secure` (personnel vetting), `/arckit:stakeholders` |
| **Technical Security** | Counter-eavesdropping, emanations | Specialist — flag in `/arckit:secure` if applicable |
| **Industry Security** | Contractor/supplier security obligations | `/arckit:secure` (CAF A4 Supply Chain, S7 Third-Party Risk) |

**Supporting practices**: Risk Management (`/arckit:risk`), Information Management (`/arckit:dpia`), Critical Assets (CAF A3), Capability (CAF B6), Culture (CAF B6).

---

## Key Security Roles

| Role | GovS 007 Responsibility | ArcKit Appearance |
|------|------------------------|-------------------|
| **Accounting Officer** | Overall accountability for organisational security | `/arckit:secure` sign-off |
| **Senior Security Risk Owner (SSRO)** | Board-level protective security risk ownership | `/arckit:stakeholders`, `/arckit:secure` sign-off |
| **Departmental Security Officer (DSO)** | Day-to-day security coordination and policy delivery | `/arckit:stakeholders`, `/arckit:secure` sign-off |
| **Senior Information Risk Owner (SIRO)** | Information and cyber security risk ownership | `/arckit:stakeholders`, `/arckit:secure` sign-off |

---

## Relationship to Other Standards

| Standard | Relationship to GovS 007 |
|----------|--------------------------|
| **Cyber Security Standard** (CSS) | Implements the cyber discipline of GovS 007 — mandates CAF profiles, GovAssure, SbD |
| **NCSC CAF** | Operational framework for assessing cyber security (14 principles) |
| **Cyber Essentials** | Baseline technical controls for government contracts |
| **GovS 005: Digital** | Sibling functional standard — digital governance, TCoP, Service Standard |
| **JSP 440 / JSP 604** | MOD-specific physical and personnel security (extends GovS 007 for Defence) |

---

## References

- [GovS 007: Security (GOV.UK)](https://www.gov.uk/government/publications/government-functional-standard-govs-007-security)
- [GovS 007 PDF](https://assets.publishing.service.gov.uk/media/613a195bd3bf7f05b694d647/GovS_007-_Security.pdf)
- [Functional Standards overview](https://www.gov.uk/government/collections/functional-standards)
- [NCSC Cyber Assessment Framework](https://www.ncsc.gov.uk/collection/caf)
- [NCSC GovAssure](https://www.ncsc.gov.uk/collection/govassure)
- [UK Government Cyber Security Standard](https://www.gov.uk/government/publications/government-cyber-security-standard)
