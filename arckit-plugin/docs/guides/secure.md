# Secure by Design Playbook

`/arckit.secure` generates a UK Government Secure by Design assessment for civilian department projects using NCSC CAF principles.

---

## Inputs

| Artefact | Purpose |
|----------|---------|
| Requirements (`ARC-<id>-REQ-v1.0.md`) | Security requirements (NFR-SEC) |
| Architecture diagrams | System boundaries and data flows |
| Risk register | Security risks identified |
| Data model | Personal data and classification |

---

## Command

```bash
/arckit.secure Create Secure by Design assessment for <system>
```

Output: `projects/<id>/ARC-<id>-SECD-v1.0.md`

> **Auto-versioning**: Re-running this command when a document already exists automatically increments the version (minor for refreshed content, major for changed scope) instead of overwriting.

---

## Assessment Structure

| Section | Contents |
|---------|----------|
| Executive Summary | Overall security posture and key findings |
| System Overview | Purpose, boundaries, data classification |
| NCSC CAF Assessment | Compliance against 14 CAF principles |
| Threat Assessment | Threat landscape and attack vectors |
| Security Architecture | Controls, boundaries, defense in depth |
| Cyber Essentials | Alignment with Cyber Essentials controls |
| Supply Chain Security | Third-party and vendor security |
| Data Protection | Personal data handling and GDPR |
| Incident Response | Detection, response, and recovery |
| GovAssure Status | Critical system assurance tracking |
| SbD Confidence Rating | Secure by Design high-confidence profile self-assessment |
| CSS Exception Register | Cyber Security Standard non-compliance management |
| GovS 007 Alignment | Mapping of 9 GovS 007 principles to assessment evidence |
| Recommendations | Prioritized security improvements |

---

## NCSC CAF 14 Principles

| Objective | # | Principle |
|-----------|---|-----------|
| **Managing Risk** | A1 | Governance |
| | A2 | Risk Management |
| | A3 | Asset Management |
| | A4 | Supply Chain |
| **Protecting Against Attack** | B1 | Service Protection Policies |
| | B2 | Identity and Access Control |
| | B3 | Data Security |
| | B4 | System Security |
| | B5 | Resilient Networks |
| | B6 | Staff Awareness |
| **Detecting Events** | C1 | Security Monitoring |
| | C2 | Anomaly Detection |
| **Minimising Impact** | D1 | Response and Recovery |
| | D2 | Lessons Learned |

---

## Cyber Essentials Controls

| Control | Description |
|---------|-------------|
| Firewalls | Boundary protection |
| Secure Configuration | Hardened systems |
| Access Control | Least privilege |
| Malware Protection | Anti-malware tools |
| Patch Management | Timely updates |

---

## One-Page Workflow

| Phase | Key Activities | ArcKit Commands |
|-------|----------------|-----------------|
| Discovery | Define requirements and data model | `/arckit.requirements`, `/arckit.data-model` |
| Risk | Identify security risks | `/arckit.risk` |
| Assessment | Create Secure by Design assessment | `/arckit.secure` |
| Design | Implement security architecture | `/arckit.diagram`, `/arckit.hld-review` |
| Operations | Operational security readiness | `/arckit.operationalize` |

---

## Review Checklist

- All 14 NCSC CAF principles assessed with evidence.
- Cyber Essentials controls addressed.
- Cyber Security Standard compliance assessed (GovAssure, SbD confidence, exceptions).
- GovS 007 principle alignment mapped with named security roles (SSRO, DSO, SIRO).
- Data classification and handling defined.
- Supply chain risks identified and managed.
- Security monitoring and detection in place.
- Incident response procedures documented.
- Staff security awareness addressed.
- Third-party security requirements defined.

---

## Security Classification (Civilian)

| Classification | Description | Controls |
|----------------|-------------|----------|
| OFFICIAL | Majority of government data | Standard controls |
| OFFICIAL-SENSITIVE | More sensitive OFFICIAL | Enhanced access control |

---

## UK Government Cyber Security Standard

The [UK Government Cyber Security Standard](https://www.gov.uk/government/publications/government-cyber-security-standard) (July 2025, Cabinet Office) builds on the NCSC CAF by mandating:

- **CAF Baseline/Enhanced profiles** — departments must achieve the appropriate CAF profile for their systems
- **GovAssure** — annual assurance process for critical government systems, validated by NCSC
- **Secure by Design high-confidence profiles** — self-assessment against SbD principles (secure development, deployment, and operation)
- **Exception management** (clauses 4.3/4.4) — formal register for any non-compliance, with risk assessment and improvement plans

The `/arckit.secure` assessment includes dedicated sections (9.1–9.3) for tracking GovAssure status, SbD confidence ratings, and CSS exceptions alongside the existing CAF assessment.

---

## GovS 007: Security (Functional Standard)

[GovS 007: Security](https://www.gov.uk/government/publications/government-functional-standard-govs-007-security) is the parent functional standard for all protective security across central government. It defines nine principles, a security lifecycle, and protective security disciplines (physical, personnel, cyber, technical, industry).

The `/arckit.secure` assessment maps GovS 007's nine principles to the CAF assessment evidence and related ArcKit artefacts (Section 10), demonstrating how operational security controls satisfy the higher-level governance requirements. Key security roles mandated by GovS 007 (SSRO, DSO, SIRO) are captured in both the security roles table and the approval sign-off section.

**Hierarchy**: GovS 007 → Cyber Security Standard → NCSC CAF → `/arckit.secure` assessment

| GovS 007 Principle | Evidenced By |
|---------------------|-------------|
| Governance | CAF A1, SIRO sign-off |
| Risk-based approach | CAF A2, `/arckit:risk` |
| Security in all activities | Secure Development (S4), Cloud Security (S5) |
| Holistic planning | Full CAF assessment (S1–S8) |
| Security culture | CAF B6 Staff Awareness |
| Accountability | Named SSRO/DSO/SIRO roles |
| Proportionate measures | Data classification → controls mapping |
| Continuous improvement | CAF D2 Improvements |
| Legal/regulatory compliance | UK GDPR (S3), `/arckit:dpia` |

---

## Key Principles

1. **Defense in Depth**: Multiple layers of security controls.
2. **Least Privilege**: Minimum access necessary for function.
3. **Secure by Default**: Security is the default, not an option.
4. **Assume Breach**: Design for detection and response, not just prevention.
5. **Proportionate Security**: Controls match the risk and data sensitivity.
