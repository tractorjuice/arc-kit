# EU DORA Compliance Playbook

> **Guide Origin**: Community | **ArcKit Version**: [VERSION]

`/arckit:eu-dora` generates a DORA (Digital Operational Resilience Act, Regulation EU 2022/2554) compliance assessment for financial sector entities. DORA has applied since 17 January 2025. For the financial entities in its scope it applies instead of NIS2's cybersecurity risk-management, reporting and supervision provisions, though not instead of NIS2 as a whole (see Key Notes).

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
/arckit:eu-dora Assess DORA compliance for <financial entity type>
```

In Claude Code the overlay installs as its own plugin, `arckit-eu`, so the command is `/arckit-eu:eu-dora`.

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
| Discovery | Entity and ICT dependency mapping | `/arckit:requirements` |
| Risk | ICT risk assessment | `/arckit:risk` |
| Assessment | DORA compliance assessment | `/arckit:eu-dora` |
| Security | Technical controls | `/arckit:secure` |

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
- **NIS2 relationship**: DORA is *lex specialis* to NIS2 (DORA recital 16) and a sector-specific Union legal act under NIS2 Article 4 (DORA Art. 1(2)). For the financial entities it covers, DORA's rules on ICT risk management, incident reporting, resilience testing, information sharing and third-party risk apply instead of NIS2's risk-management, reporting and supervision provisions (NIS2 recital 28). NIS2 is not switched off entirely: the entity can still be identified as essential or important under national NIS2 law, group entities or services in a NIS2 sector outside DORA stay under NIS2 (NIS2 Art. 4(1)), and the competent authority passes major-incident details to the NIS2 CSIRTs, competent authorities or single points of contact (DORA Art. 19(6)). Run `/arckit:eu-nis2` for any part of the group DORA does not cover.
- **TLPT**: Threat-Led Penetration Testing follows TIBER-EU methodology; only required for significant institutions designated by competent authorities.
