# ANSSI IS Cartography Playbook

> **Guide Origin**: Community | **ArcKit Version**: [VERSION]

`/arckit.fr-anssi-carto` produces an ANSSI-methodology information system cartography across four reading levels (business, application, system, network). Required for IS homologation and EBIOS RM studies.

---

## Inputs

| Artefact | Purpose |
|----------|---------|
| Requirements (`ARC-<id>-REQ-v1.0.md`) | IS scope and business missions |
| Data model (`ARC-<id>-DATA-v1.0.md`) | Application data flows |
| Architecture diagrams | Existing network and system topology |

---

## Command

```bash
/arckit.fr-anssi-carto Produce IS cartography for <IS scope and organisation>
```

Output: `projects/<id>/ARC-<id>-CARTO-v1.0.md`

---

## Assessment Structure (4 Levels)

| Level | Contents | Identifiers |
|-------|----------|-------------|
| Level 1: Business | Core missions, business processes, value chain | VM-xx, P-xx |
| Level 2: Application | Applications, data flows, interfaces, APIs | APP-xx |
| Level 3: System | Servers, databases, OS, middleware, endpoints | SRV-xx, DB-xx |
| Level 4: Network | Network topology, firewall rules, DMZ, interconnections | NET-xx, INT-xx |

---

## One-Page Workflow

| Phase | Key Activities | ArcKit Commands |
|-------|----------------|-----------------|
| Discovery | IS scope and requirements | `/arckit.requirements` |
| Data mapping | Data model | `/arckit.data-model` |
| Cartography | 4-level IS mapping | `/arckit.fr-anssi-carto` |
| Risk analysis | EBIOS RM (uses VM-xx IDs) | `/arckit.fr-ebios` |
| Security policy | PSSI | `/arckit.fr-pssi` |

---

## Review Checklist

- All 4 levels documented with consistent identifiers.
- Business missions mapped to supporting applications (Level 1 → Level 2 traceability).
- Sensitive data flows identified across application boundaries (Level 2).
- Critical servers and databases catalogued with OS and lifecycle status (Level 3).
- Network perimeter, DMZ, and external interconnections documented (Level 4).
- Attack surface summary produced with sensitive flows highlighted.
- VM-xx identifiers consistent with EBIOS RM feared events.
- Assessment classified OFFICIAL-SENSITIVE.

---

## Key Notes

- **Homologation prerequisite**: IS cartography is mandatory evidence in a French IS homologation dossier.
- **EBIOS RM link**: The VM-xx (Valeurs Métier) identifiers in Level 1 directly feed the feared events in Workshop 1 of the EBIOS RM study.
- **Living document**: Cartography must be updated when IS changes — establish a review trigger in the PSSI.
