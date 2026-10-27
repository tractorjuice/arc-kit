# MOD Secure by Design: the 7 principles and assessment

> **Guide Origin**: Official | **ArcKit Version**: [VERSION]

MOD Secure by Design is the Ministry of Defence's approach to building cyber security into defence capabilities from the start and through their life, using seven principles. This guide lists them, the evidence MOD teams and suppliers prepare, and how `/arckit:mod-secure` writes an assessment using CAAT and continuous assurance.

---

## Who it applies to

MOD Secure by Design covers Defence capabilities, technology infrastructure and digital services, and the suppliers who build them. Since August 2023 it has replaced point-in-time accreditation and the RMADS with continuous risk management (JSP 440 Leaflet 5C; Industry Security Notices ISN 2023/09 and ISN 2023/10). MOD publishes the approach at [digital.mod.uk](https://www.digital.mod.uk/policy-rules-standards-and-guidance/secure-by-design). Civilian departments follow the cross-government version: see [Secure by Design for UK government](secure.md).

## The 7 principles

| # | Principle | What it asks for |
|---|-----------|------------------|
| 1 | [Understand and define context](https://www.digital.mod.uk/policy-rules-standards-and-guidance/secure-by-design/understand-and-define-context) | Understand what your capability does and how it uses and manages data |
| 2 | [Plan the security activities](https://www.digital.mod.uk/policy-rules-standards-and-guidance/secure-by-design/plan-the-security-activities) | Plan the right security activities, including assessment of cyber threat and potential risks |
| 3 | [Implement continuous risk management](https://www.digital.mod.uk/policy-rules-standards-and-guidance/secure-by-design/implement-continuous-risk-management) | Make cyber security risk management a continuous process |
| 4 | [Define security controls](https://www.digital.mod.uk/policy-rules-standards-and-guidance/secure-by-design/define-security-controls) | Set up security controls or use current services and patterns |
| 5 | [Engage and manage the supply chain](https://www.digital.mod.uk/policy-rules-standards-and-guidance/secure-by-design/engage-manage-supply-chain) | Understand your supply chain, including risks and security |
| 6 | [Assure, verify and test](https://www.digital.mod.uk/policy-rules-standards-and-guidance/secure-by-design/assure-verify-and-test) | Get security assurance, testing and validation throughout the capability's lifecycle |
| 7 | [Plan the through-life approach](https://www.digital.mod.uk/policy-rules-standards-and-guidance/secure-by-design/plan-through-life-approach) | Continuously monitor for through-life security improvements |

The assessment that `/arckit:mod-secure` writes has one section for each of these seven principles.

---

## Evidence by theme

| Theme | Questions | Evidence |
|-------|-----------|----------|
| Classification & threat context | What classification? Who are the adversaries? | Statement of Sensitivity, threat assessment |
| Governance & risk ownership | Who owns the cyber risk? How is continuous assurance recorded? | Risk owner, security risk register, CAAT records |
| Identity & access | Clearances, PKI/MFA, privileged access control | Access matrix, vetting records, PAM tooling |
| Protective monitoring | SIEM coverage, integration with MOD SOC, log retention | Monitoring architecture, runbooks |
| Supply chain | DCPP level, supplier assurance, contractual clauses | Procurement docs, vendor assessments |
| Secure development & testing | SDLC controls, ITHC, secure coding | Test results, change control, penetration tests |
| Operational readiness | Incident response, continuity, DR for classified data | `/arckit:servicenow`, resilience plans |

### When to review

| Stage | Frequency |
|-------|-----------|
| Discovery / Early design | Establish classification, threat model, initial controls |
| Main gate / Beta | Update risk assessment, protective monitoring, supplier assurance |
| Live | Quarterly security reviews; re-assess on change/retrain events |

---

## Inputs

| Artefact | Purpose |
|----------|---------|
| Requirements (`ARC-<id>-REQ-v1.0.md`) | Security requirements and classification |
| Architecture diagrams | System boundaries and data flows |
| Risk register | Security risks identified |
| Data model | Data classification and handling |

---

## Command

```bash
/arckit:mod-secure Create MOD Secure by Design assessment for <system>
```

Output: `projects/<id>/ARC-<id>-SECD-MOD-v1.0.md`

> **Security content and model fallback**: Claude Opus 5.5 and Sonnet 5.5 have cybersecurity safeguards, and a threat or attack discussion in this assessment can trip them. Claude Code then re-runs that request on an older model (Sonnet 5 from Sonnet 5.5, Opus 4.8 from Opus 5.5), tells you it has done so, and stays on that model until you switch back with `/model`. The assessment is still written; its Build Provenance names the model that wrote it.

---

## Assessment Structure

| Section | Contents |
|---------|----------|
| System Overview | Name, purpose, classification, boundaries |
| 7 SbD Principles Assessment | Compliance against each MOD SbD principle |
| CAAT Summary | Continuous Assurance Assessment Tool results |
| Security Classification | Data classification and handling requirements |
| Threat Assessment | Threat actors, attack vectors, mitigations |
| Security Controls | Technical, procedural, and physical controls |
| Accreditation Status | Path to accreditation and outstanding actions |
| Risk Acceptance | Residual risks requiring SIRO acceptance |

---

## CAAT (Continuous Assurance Assessment Tool)

| Aspect | Description |
|--------|-------------|
| Purpose | Structured security assessment methodology |
| Scope | Covers all 7 SbD principles |
| Output | RAG status per principle with evidence |
| Integration | Feeds into accreditation documentation |

---

## Security Classifications

| Classification | Handling | Examples |
|----------------|----------|----------|
| OFFICIAL | Standard controls | Most MOD business |
| OFFICIAL-SENSITIVE | Enhanced controls | Personnel data, commercial |
| SECRET | Accredited systems | Intelligence, operations |
| TOP SECRET | Highest controls | Most sensitive material |

---

## One-Page Workflow

| Phase | Key Activities | ArcKit Commands |
|-------|----------------|-----------------|
| Discovery | Define requirements and classification | `/arckit:requirements`, `/arckit:data-model` |
| Risk | Identify security risks and threats | `/arckit:risk` |
| Assessment | Create MOD SbD assessment | `/arckit:mod-secure` |
| Accreditation | Progress through accreditation stages | Manual |
| Operations | Continuous assurance monitoring | `/arckit:operationalize` |

---

## Review Checklist

- System classification correctly determined.
- All 7 SbD principles assessed with evidence.
- Threat assessment covers relevant threat actors.
- Security controls mapped to threats and risks.
- JSP 440 requirements addressed for classification.
- CAAT assessment completed and documented.
- Residual risks documented for SIRO acceptance.
- Accreditation pathway and timeline defined.

---

## Key Principles

1. **Classification Drives Controls**: Security controls match data classification.
2. **Continuous Assurance**: Security is ongoing, not a one-time assessment.
3. **Evidence-Based**: All claims supported by documented evidence.
4. **Risk-Informed**: Accept risk consciously through SIRO process.
5. **Defence in Depth**: Multiple layers of security controls.
