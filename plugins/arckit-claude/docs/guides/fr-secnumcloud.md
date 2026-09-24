# SecNumCloud Qualification Assessment Playbook

> **Guide Origin**: Community | **ArcKit Version**: [VERSION]

`/arckit:fr-secnumcloud` assesses cloud provider and customer obligations under ANSSI's SecNumCloud 3.2 referential — the French sovereign cloud qualification scheme. Required for OIV SIIV hosting and sensitive public sector data, and, since the **arrêté du 12 août 2026** (in force since 15 August 2026), a binding legal requirement for state administrations, their operators, and designated GIP handling legally-sensitive data — independently of OIV/OSE status.

---

## Inputs

| Artefact | Purpose |
|----------|---------|
| Requirements (`ARC-<id>-REQ-v1.0.md`) | Cloud service type and data sensitivity |
| EBIOS RM study | Risk level determination |
| ANSSI assessment | Security baseline |

---

## Command

```bash
/arckit:fr-secnumcloud Assess SecNumCloud compliance for <cloud usage and data classification>
```

Output: `projects/<id>/ARC-<id>-SECNUM-v1.0.md`

---

## Assessment Structure

| Section | Contents |
|---------|----------|
| Scope Determination | Is SecNumCloud required (OIV SIIV / ministerial decree / sensitive data)? |
| Visa vs Qualification | Critical distinction — only full qualification satisfies legal obligations |
| Provider Assessment | Qualified providers list, service scope, IS boundary |
| Customer Obligations | Homologation prerequisites, data classification, access controls |
| Architecture Requirements | SecNumCloud-compatible design (no non-qualified cloud dependencies) |
| Procurement Clauses | Contractual minimum requirements for public-cloud contracts |
| Gap Analysis | Gaps to achieve SecNumCloud-compliant architecture |

---

## Key Distinction: Visa vs Qualification

| Status | Meaning | Satisfies OIV/Ministerial? |
|--------|---------|---------------------------|
| SecNumCloud Visa | In qualification process | No |
| SecNumCloud Qualification | Full ANSSI qualification granted | Yes |
| ISO 27001 / C5 / EUCS | European alternatives | No (for French OIV SIIV) |

---

## One-Page Workflow

| Phase | Key Activities | ArcKit Commands |
|-------|----------------|-----------------|
| Risk | EBIOS RM study to determine risk level | `/arckit:fr-ebios` |
| Security baseline | ANSSI 42 measures | `/arckit:fr-anssi` |
| Cloud assessment | SecNumCloud compliance | `/arckit:fr-secnumcloud` |
| Procurement | Cloud procurement clauses | `/arckit:fr-marche-public` |

---

## Review Checklist

- SecNumCloud requirement confirmed (legal basis: arrêté du 12 août 2026 / OIV / ministerial decree / circular — cite the specific basis, not "doctrine" alone).
- Visa vs Qualification distinction clearly stated.
- Qualified provider and qualifying service scope confirmed on ANSSI published list.
- IS homologation prerequisites documented.
- Data classification confirmed (DR, Sensible but not classified, etc.).
- Architecture reviewed for non-qualified cloud dependencies (which break qualification scope).
- Procurement contractual clauses include SecNumCloud qualification as selection criterion.

---

## Key Notes

- **Visa ≠ Qualification**: A provider with a visa is in the process — it does NOT satisfy the legal obligation for OIV SIIV hosting.
- **More stringent than EUCS**: SecNumCloud 3.2 is stricter than the EU's EUCS high level — important for cross-border comparisons.
- **DINUM doctrine cloud**: The Doctrine d'utilisation de l'informatique en nuage de l'État (2022) recommended SecNumCloud or equivalent for sensitive data — run `/arckit:fr-dinum` for the full doctrine assessment.
- **Binding since 15 August 2026**: The arrêté du 12 août 2026 (JORF, taken under décret n° 2026-272 du 14 avril 2026 / loi SREN) turned SecNumCloud from a doctrine-level recommendation into a **legal obligation** for state administrations, their operators, and designated GIP processing data whose compromise would affect public safety, health, the life of persons, or intellectual-property protection. Compliance must be attested by an ANSSI qualification or a European certification ANSSI recognises as equivalent.
- **Private-sector reach**: A private company is not automatically bound for all its data, but is drawn into scope when it supplies cloud to a public actor in scope, sits in that actor's sub-contracting chain, responds to a tender requiring this protection level, or processes data under a contract that mandates it.
