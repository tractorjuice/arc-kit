# MOD Secure by Design Playbook

`/arckit.mod-secure` generates a Ministry of Defence Secure by Design assessment using CAAT and continuous assurance methodology.

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
/arckit.mod-secure Create MOD Secure by Design assessment for <system>
```

Output: `projects/<id>/ARC-<id>-SECD-MOD-v1.0.md`

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

## 7 MOD Secure by Design Principles

| # | Principle | Focus Area |
|---|-----------|------------|
| 1 | Establish Context | Understand threats and business context |
| 2 | Make Compromise Difficult | Defense in depth, secure architecture |
| 3 | Make Disruption Difficult | Resilience and availability |
| 4 | Make Detection Easier | Logging, monitoring, alerting |
| 5 | Reduce Impact | Contain and limit damage |
| 6 | Secure Operations | Operational security processes |
| 7 | Enable Assurance | Evidence and continuous compliance |

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
| Discovery | Define requirements and classification | `/arckit.requirements`, `/arckit.data-model` |
| Risk | Identify security risks and threats | `/arckit.risk` |
| Assessment | Create MOD SbD assessment | `/arckit.mod-secure` |
| Accreditation | Progress through accreditation stages | Manual |
| Operations | Continuous assurance monitoring | `/arckit.operationalize` |

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

## JSP 440 Alignment

| JSP 440 Requirement | SbD Principle |
|--------------------|---------------|
| Protective Marking | Establish Context |
| Access Control | Make Compromise Difficult |
| Audit and Accountability | Make Detection Easier |
| Incident Response | Reduce Impact |
| Configuration Management | Secure Operations |

---

## Key Principles

1. **Classification Drives Controls**: Security controls match data classification.
2. **Continuous Assurance**: Security is ongoing, not a one-time assessment.
3. **Evidence-Based**: All claims supported by documented evidence.
4. **Risk-Informed**: Accept risk consciously through SIRO process.
5. **Defence in Depth**: Multiple layers of security controls.
