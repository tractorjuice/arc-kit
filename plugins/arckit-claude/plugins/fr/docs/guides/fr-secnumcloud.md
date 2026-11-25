# SecNumCloud Qualification Assessment Playbook

> **Guide Origin**: Community | **ArcKit Version**: [VERSION]

`/arckit-fr:fr-secnumcloud` assesses cloud provider and customer obligations under ANSSI's SecNumCloud 3.2 referential — the French sovereign cloud qualification scheme. Required for OIV SIIV hosting and sensitive public sector data, and, since the **arrêté du 12 août 2026** (in force since 15 August 2026), a binding legal requirement for state administrations, their operators, and designated GIP handling legally-sensitive data — independently of OIV/OSE status.

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
/arckit-fr:fr-secnumcloud Assess SecNumCloud compliance for <cloud usage and data classification>
```

Output: `projects/<id>/ARC-<id>-SECNUM-v1.0.md`

---

## Assessment Structure

| Section | Contents |
|---------|----------|
| Executive Summary | Summary of findings and recommendation |
| 1. Context and Scope | Project sensitivity level; applicable regulatory framework |
| 2. SecNumCloud 3.2 Qualification Matrix | Qualification status and criteria assessment for shortlisted providers |
| 3. Extraterritorial Legal Risk Assessment | Risk framework and provider exposure matrix |
| 4. OIV/OSE and Arrêté du 12 août 2026 Obligation Mapping | OIV and OSE obligations; binding obligation under the Arrêté |
| 5. Architecture Recommendations | Recommended patterns for sensitive workloads; key management |
| 6. Procurement Guidance | UGAP catalogue alignment; Code de la commande publique |
| 7. Residual Risk Register | Remaining risks after mitigation |
| 8. Decision Matrix and Recommendation | Provider decision and recommendation |

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
| Risk | EBIOS RM study to determine risk level | `/arckit-fr:fr-ebios` |
| Security baseline | ANSSI 42 measures | `/arckit-fr:fr-anssi` |
| Cloud assessment | SecNumCloud compliance | `/arckit-fr:fr-secnumcloud` |
| Procurement | Cloud procurement clauses | `/arckit-fr:fr-marche-public` |

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
- **DINUM doctrine cloud**: The Doctrine d'utilisation de l'informatique en nuage de l'État (2022) recommended SecNumCloud or equivalent for sensitive data — run `/arckit-fr:fr-dinum` for the full doctrine assessment.
- **Binding since 15 August 2026**: The arrêté du 12 août 2026 (published in JORF n°0189 of 14 August 2026 and in force from the day after; taken under décret n° 2026-272 du 14 avril 2026 / loi SREN art. 31) turned SecNumCloud from a doctrine-level recommendation into a **legal obligation** for state administrations, their operators, and designated GIP processing data whose compromise would harm public order, public safety, health or the life of persons, or intellectual-property protection. Compliance must be attested by an ANSSI qualification or a European certification ANSSI recognises as equivalent.
- **Derogation for projects already under way**: An administration, State operator or GIP that started a project before 16 April 2026 on a non-compliant private cloud must ask the responsible minister for a derogation (décret n° 2026-272 art. 3; the arrêté du 14 avril 2026 sets the procedure, with requests sent to DINUM). It lasts at most 18 months from the date an acceptable offer is available in France, or one year renewable while none is, and the decision is published with its reasons.
- **Private-sector reach**: A private company is not automatically bound for all its data, but is drawn into scope when it supplies cloud to a public actor in scope, sits in that actor's sub-contracting chain, responds to a tender requiring this protection level, or processes data under a contract that mandates it.
