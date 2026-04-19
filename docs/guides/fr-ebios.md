# EBIOS Risk Manager Playbook

> **Guide Origin**: Community | **ArcKit Version**: [VERSION]

`/arckit.fr-ebios` conducts an EBIOS Risk Manager analysis following the ANSSI 2018 methodology — the French standard for IS risk analysis and homologation. Required for OIV, OSE, and public sector IS homologation.

---

## Inputs

| Artefact | Purpose |
|----------|---------|
| Requirements (`ARC-<id>-REQ-v1.0.md`) | IS scope, essential missions |
| Risk register (`ARC-<id>-RISK-v*.md`) | Pre-identified risks and mitigations |
| Data model | Data assets and sensitivity |
| Architecture diagrams | IS boundaries and components |

---

## Command

```bash
/arckit.fr-ebios Conduct EBIOS RM study for <IS scope and homologation context>
```

Output: `projects/<id>/ARC-<id>-EBIOS-v1.0.md`

---

## Assessment Structure (5 Workshops)

| Workshop | Contents |
|----------|----------|
| Workshop 1: Framework | Study scope, IS description, security baseline, feared events |
| Workshop 2: Risk Sources | Risk source identification (RSO/RSE), threat capabilities |
| Workshop 3: Strategic Scenarios | Attack paths from risk sources to feared events |
| Workshop 4: Operational Scenarios | Technical attack paths, likelihood assessment |
| Workshop 5: Risk Treatment | Residual risks, treatment plan, homologation recommendation |

---

## EBIOS RM Key Concepts

| Concept | Description |
|---------|-------------|
| Feared Event (EF) | Impact on essential mission if security objective violated |
| Risk Source (SR) | Threat actor with motivation, capability, and targeting |
| Strategic Scenario | High-level attack path from SR to EF |
| Operational Scenario | Technical attack path with likelihood and gravity |
| Residual Risk | Accepted risk after treatment measures |

---

## One-Page Workflow

| Phase | Key Activities | ArcKit Commands |
|-------|----------------|-----------------|
| Foundation | Requirements and risk register | `/arckit.requirements`, `/arckit.risk` |
| EBIOS study | 5-workshop analysis | `/arckit.fr-ebios` |
| ANSSI measures | Hygiene baseline | `/arckit.fr-anssi` |
| Cartography | IS mapping | `/arckit.fr-anssi-carto` |
| PSSI | Security policy | `/arckit.fr-pssi` |
| SecNumCloud | Cloud qualification | `/arckit.fr-secnumcloud` |

---

## Review Checklist

- IS scope and essential missions documented (Workshop 1).
- Security baseline assessed against reference framework (ISO 27001 / RGS).
- Feared events defined with gravity scale (G1–G4).
- Risk sources identified with motivation and capability (Workshop 2).
- Strategic scenarios mapped from risk source to feared event (Workshop 3).
- Operational scenarios with technical attack paths and likelihood (Workshop 4).
- Residual risks and treatment plan documented (Workshop 5).
- Homologation recommendation included (Avis de sécurité or Avis favorable sous conditions).

---

## Key Notes

- **Homologation**: EBIOS RM is the primary evidence for French IS homologation decisions — the study produces an *Avis de sécurité* that feeds the formal homologation dossier.
- **OIV**: Operators of Vital Importance (OIVs) are required to conduct EBIOS RM studies for their critical IS (Systèmes d'Information d'Importance Vitale — SIIV).
- **Analogous to**: The US Authority to Operate (ATO) process in federal context.
