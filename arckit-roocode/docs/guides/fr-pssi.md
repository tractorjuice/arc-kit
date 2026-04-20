# PSSI (Information System Security Policy) Playbook

> **Guide Origin**: Community | **ArcKit Version**: [VERSION]

`/arckit.fr-pssi` generates an Information System Security Policy (PSSI) for French public sector entities, following ANSSI PSSI guidance and RGS v2 requirements. The PSSI must be approved and signed by the Highest Authority (AA — Autorité d'Approbation).

---

## Inputs

| Artefact | Purpose |
|----------|---------|
| Requirements (`ARC-<id>-REQ-v1.0.md`) | IS scope and security requirements |
| EBIOS RM study | Risk analysis feeding policy objectives |
| ANSSI assessment | 42 hygiene measures baseline |
| IS Cartography | 4-level IS map for scope definition |

---

## Command

```bash
/arckit.fr-pssi Generate PSSI for <organisation and IS scope>
```

Output: `projects/<id>/ARC-<id>-PSSI-v1.0.md`

---

## Assessment Structure (9 Sections)

| Section | Contents |
|---------|----------|
| 1. Purpose and Context | Organisational context, IS scope, regulatory basis |
| 2. Security Objectives | Confidentiality, integrity, availability, traceability targets |
| 3. Security Principles | 8+ core principles (defence in depth, least privilege, etc.) |
| 4. Organisational Structure | AA, RSSI, DPO, DSI, FSSI roles and responsibilities |
| 5. Applicable Standards | ANSSI referentials, RGS, NIS2, GDPR, sector standards |
| 6. Security Domains | 7 domains (network, workstations, applications, IS management, physical, personnel, continuity) |
| 7. User Obligations | Acceptable use, incident reporting, classification handling |
| 8. Incident Management | Detection, response, escalation procedures |
| 9. Lifecycle | 3-year review cycle, update triggers, approval process |

---

## Key Roles

| Role | Responsibility |
|------|---------------|
| AA (Autorité d'Approbation) | Approves and signs the PSSI (highest authority in scope) |
| RSSI | Responsible for IS security, PSSI maintenance |
| DPO | Data protection obligations, GDPR intersection |
| DSI | Technical implementation, IS operations |
| FSSI | Functional IS security officer (operational level) |

---

## One-Page Workflow

| Phase | Key Activities | ArcKit Commands |
|-------|----------------|-----------------|
| Foundation | Requirements, risk, cartography | `/arckit.fr-ebios`, `/arckit.fr-anssi-carto` |
| Baseline | ANSSI 42 measures | `/arckit.fr-anssi` |
| Policy | Generate PSSI | `/arckit.fr-pssi` |
| DR | DR handling policy section | `/arckit.fr-dr` |

---

## Review Checklist

- AA (Highest Authority) identified and prepared to sign.
- IS scope matches cartography Level 1 missions.
- 8+ security principles documented.
- All 7 security domains covered with specific measures.
- RSSI, DPO, DSI, FSSI roles defined with named individuals or positions.
- EBIOS RM study referenced for risk analysis basis.
- 3-year review cycle defined with explicit update triggers.
- User obligations accessible and acknowledged (awareness programme planned).
- Document classified OFFICIAL-SENSITIVE.

---

## Key Notes

- **AA signature is mandatory**: the PSSI without AA approval has no legal standing in the French public sector context.
- **Living document**: PSSI must be updated when IS changes significantly — not a set-and-forget document.
- **Analogous to**: ISO 27001 ISMS policy, but specific to French public IS governance.
