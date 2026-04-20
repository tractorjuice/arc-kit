# EU DORA Compliance Playbook

> **Guide Origin**: Community | **ArcKit Version**: [VERSION]

`/arckit.eu-dora` generates a DORA (Digital Operational Resilience Act, Regulation EU 2022/2554) compliance assessment for financial sector entities. DORA applies from 17 January 2025 and replaces NIS2 for in-scope financial entities.

---

## Inputs

| Artefact | Purpose |
|----------|---------|
| Requirements (`ARC-<id>-REQ-v1.0.md`) | Financial service type and ICT dependencies |
| Risk register | ICT risks and existing resilience measures |
| Secure by Design | Existing security architecture |

---

## Command

```bash
/arckit.eu-dora Assess DORA compliance for <financial entity type>
```

Output: `projects/<id>/ARC-<id>-DORA-v1.0.md`

---

## Assessment Structure

| Section | Contents |
|---------|----------|
| Entity Classification | Credit institution / insurer / investment firm / etc. |
| ICT Risk Management | 5-pillar framework (Art. 5–16) |
| Incident Classification | Major ICT-related incident criteria (RTS) |
| Incident Reporting | 4h → 72h → 1-month final report |
| TLPT | Threat-Led Penetration Testing obligation (significant institutions) |
| Third-Party Management | Critical ICT provider designation and contractual requirements |
| Information Sharing | Threat intelligence sharing arrangements |
| Oversight Framework | ESA (EBA / ESMA / EIOPA) supervision |
| Gap Analysis | Gaps with priority and DORA deadline |

---

## DORA 5 ICT Risk Pillars

| Pillar | Key Requirements |
|--------|-----------------|
| Governance & Strategy | Management body accountability, ICT strategy |
| Risk Management | ICT risk framework, asset management |
| Incident Reporting | Classification, timeline, RTS compliance |
| Resilience Testing | TLPT for significant institutions, scenario-based testing |
| Third-Party Risk | Due diligence, contractual minimum clauses, exit plans |

---

## One-Page Workflow

| Phase | Key Activities | ArcKit Commands |
|-------|----------------|-----------------|
| Discovery | Entity and ICT dependency mapping | `/arckit.requirements` |
| Risk | ICT risk assessment | `/arckit.risk` |
| Assessment | DORA compliance assessment | `/arckit.eu-dora` |
| Security | Technical controls | `/arckit.secure` |

---

## Review Checklist

- Entity type confirmed as DORA in-scope (credit institution, insurer, investment firm, AISP/PISP, crypto-asset service provider, etc.).
- All 5 ICT risk management pillars assessed.
- Major incident classification criteria documented (4h early warning threshold).
- TLPT obligation assessed (significant institution criteria).
- Critical ICT third-party providers identified (contractual minimum clauses per Annex).
- ESA competent authority identified (EBA / ESMA / EIOPA depending on entity type).

---

## Key Notes

- **France**: DORA supervised by ACPR (banking/insurance) and AMF (investment firms).
- **NIS2 relationship**: DORA is lex specialis for financial entities — NIS2 does not apply to DORA-regulated entities.
- **TLPT**: Threat-Led Penetration Testing follows TIBER-EU methodology; only required for significant institutions designated by competent authorities.
