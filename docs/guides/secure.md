# Secure by Design for UK government: the 10 principles and assessment

> **Guide Origin**: Official | **ArcKit Version**: [VERSION]

Secure by Design is the UK government's approach to building cyber security into digital services from the start and throughout their life. Its 10 principles are mandatory for government departments and arm's-length bodies. This guide lists them, the evidence an assurer looks for, and how `/arckit:secure` writes a Secure by Design assessment for a civilian service using the NCSC Cyber Assessment Framework (CAF).

---

## Who Secure by Design applies to

The Government Cyber Unit publishes the [Secure by Design principles](https://www.security.gov.uk/policy-and-guidance/secure-by-design/principles/) (updated February 2026). Under the [Secure by Design policy](https://www.security.gov.uk/policy-and-guidance/secure-by-design/policy/):

- the principles are mandatory for government departments and arm's-length bodies (ALBs), and optional for the rest of the public sector;
- delivery teams meet them with support from security professionals, throughout the service life cycle;
- suppliers to those organisations should check the specific requirements with their security contacts;
- organisations may add principles of their own, provided they still meet the core ten.

The Ministry of Defence tailors the approach to its own environment: see [MOD Secure by Design](mod-secure.md). The police "Secured by Design" scheme for buildings is unrelated.

## The 10 principles

| # | Principle |
|---|-----------|
| 1 | Create responsibility for cyber security risk |
| 2 | Source secure technology products |
| 3 | Adopt a risk-driven approach |
| 4 | Design usable security controls |
| 5 | Build in detect and respond security |
| 6 | Design flexible architectures |
| 7 | Minimise the attack surface |
| 8 | Defend in depth |
| 9 | Embed continuous assurance |
| 10 | Make changes securely |

Each principle has outcomes and recommended activities on [security.gov.uk](https://www.security.gov.uk/policy-and-guidance/secure-by-design/principles/).

---

## Evidence an assurer looks for

| Theme | Key Questions | Artefacts |
|-------|---------------|-----------|
| Context & classification | What data do we hold? Which classification (OFFICIAL / OFFICIAL-SENSITIVE)? | Data model, DPIA, risk register |
| Governance & roles | Who owns security? Who approves exceptions? | RACI, project plan, service runbook |
| Secure development | How do we embed security in SDLC? | CI/CD controls, code review policy, threat model |
| Identity & access | How is privileged access controlled? MFA used? | IAM documentation, Terraform/PAM configs |
| Protection & resilience | How do we protect data at rest/in transit? Backups? DR? | Deployment diagrams, recovery runbooks |
| Monitoring & response | What logging/alerting is in place? Incident response plan? | `/arckit:servicenow`, logging architecture |
| Supply chain | How are suppliers assessed and monitored? | Procurement docs, contract clauses, assurance |

### Mapping to standards

| Control Set | Covered By |
|-------------|------------|
| NCSC Cloud Security Principles (1–14) | Hosting decision log, architecture diagrams, `/arckit:secure` output sections |
| Cyber Essentials (Firewalls, Configuration, Access, Malware, Patching) | Infrastructure-as-Code, operations procedures |
| GDPR Privacy by Design | `/arckit:dpia`, data retention, subject rights, encryption |

### When to review

| Phase | Activity |
|-------|----------|
| Discovery / Alpha | Baseline assessment, identify high-risk gaps |
| Beta | Update with security testing, monitoring plans, operational readiness |
| Live | Review quarterly or after major change / incident |

Link actions into the risk register and backlog, and track completion before passing assurance gates.

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
/arckit:secure Create Secure by Design assessment for <system>
```

Output: `projects/<id>/ARC-<id>-SECD-v1.0.md`

> **Security content and model fallback**: Claude Opus 5.5 and Sonnet 5.5 have cybersecurity safeguards, and a threat or attack discussion in this assessment can trip them. Claude Code then re-runs that request on an older model (Sonnet 5 from Sonnet 5.5, Opus 4.8 from Opus 5.5), tells you it has done so, and stays on that model until you switch back with `/model`. The assessment is still written; its Build Provenance names the model that wrote it.

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
| Cyber Action Plan Alignment | Departmental status against £210m Cyber Action Plan four pillars |
| GovS 007 Alignment | Mapping of 9 GovS 007 principles to assessment evidence |
| Government Cyber Security Profession | CCP status, DDaT mapping, Cyber Academy engagement |
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
| Discovery | Define requirements and data model | `/arckit:requirements`, `/arckit:data-model` |
| Risk | Identify security risks | `/arckit:risk` |
| Assessment | Create Secure by Design assessment | `/arckit:secure` |
| Design | Implement security architecture | `/arckit:diagram`, `/arckit:hld-review` |
| Operations | Operational security readiness | `/arckit:operationalize` |

---

## Review Checklist

- All 14 NCSC CAF principles assessed with evidence.
- Cyber Essentials controls addressed.
- Cyber Security Standard compliance assessed (GovAssure, SbD confidence, exceptions).
- NCSC VMS enrollment status and remediation benchmarks documented.
- Cyber Action Plan alignment assessed across four pillars.
- Government Cyber Security Profession participation and CCP status recorded.
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
- **Cyber Action Plan alignment** — departmental participation in the £210m cross-government investment across four pillars (Skills, Tooling, Resilience, Collaboration)

The `/arckit:secure` assessment includes dedicated sections (9.1–9.4) for tracking GovAssure status, SbD confidence ratings, CSS exceptions, and Cyber Action Plan alignment alongside the existing CAF assessment.

---

## GovS 007: Security (Functional Standard)

[GovS 007: Security](https://www.gov.uk/government/publications/government-functional-standard-govs-007-security) is the parent functional standard for all protective security across central government. It defines nine principles, a security lifecycle, and protective security disciplines (physical, personnel, cyber, technical, industry).

The `/arckit:secure` assessment maps GovS 007's nine principles to the CAF assessment evidence and related ArcKit artefacts (Section 10), demonstrating how operational security controls satisfy the higher-level governance requirements. Key security roles mandated by GovS 007 (SSRO, DSO, SIRO) are captured in both the security roles table and the approval sign-off section.

**Hierarchy**: GovS 007 → Cyber Security Standard → NCSC CAF → `/arckit:secure` assessment

| GovS 007 Principle | Evidenced By |
|---------------------|-------------|
| Governance | CAF A1, SIRO sign-off |
| Risk-based approach | CAF A2, `/arckit:risk` |
| Security in all activities | Secure Development (S4), Cloud Security (S5) |
| Holistic planning | Full CAF assessment (S1–S8) |
| Security culture | CAF B6 Staff Awareness, Government Cyber Security Profession (S11) |
| Accountability | Named SSRO/DSO/SIRO roles |
| Proportionate measures | Data classification → controls mapping |
| Continuous improvement | CAF D2 Improvements, Cyber Action Plan Alignment (S9.4) |
| Legal/regulatory compliance | UK GDPR (S3), `/arckit:dpia` |

---

## NCSC Vulnerability Monitoring Service (VMS)

The [VMS](https://www.ncsc.gov.uk/information/vulnerability-monitoring-service) is an NCSC service that scans internet-facing systems across 6,000+ public sector bodies, with benchmarks of **8-day domain-specific** and **32-day general** vulnerability fix times. Departments achieving 84% faster fix times through VMS enrollment. The `/arckit:secure` assessment tracks VMS enrollment, coverage, and remediation performance against these benchmarks in Sections 1 (CAF C2) and 6.1 (VMS Integration).

---

## Government Cyber Security Profession & Cyber Action Plan

The [Government Cyber Security Profession](https://www.gov.uk/government/publications/government-cyber-security-profession) establishes a career framework with Certified Cyber Professional (CCP) certification, DDaT role alignment, and the Government Cyber Academy. The [£210m Cyber Action Plan](https://www.gov.uk/government/publications/government-cyber-action-plan) (February 2026) invests across four pillars: Skills & Workforce, Tooling & Infrastructure, Resilience & Response, and Collaboration & Sharing. The `/arckit:secure` assessment tracks profession participation (Section 11) and Cyber Action Plan alignment (Section 9.4).

---

## Key Principles

1. **Defense in Depth**: Multiple layers of security controls.
2. **Least Privilege**: Minimum access necessary for function.
3. **Secure by Default**: Security is the default, not an option.
4. **Assume Breach**: Design for detection and response, not just prevention.
5. **Proportionate Security**: Controls match the risk and data sensitivity.
