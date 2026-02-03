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

## Key Principles

1. **Defense in Depth**: Multiple layers of security controls.
2. **Least Privilege**: Minimum access necessary for function.
3. **Secure by Default**: Security is the default, not an option.
4. **Assume Breach**: Design for detection and response, not just prevention.
5. **Proportionate Security**: Controls match the risk and data sensitivity.
