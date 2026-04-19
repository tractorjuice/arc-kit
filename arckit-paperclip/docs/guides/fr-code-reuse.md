# French Public Code Reuse Assessment Playbook

> **Guide Origin**: Community | **ArcKit Version**: [VERSION]

`/arckit.fr-code-reuse` assesses public code reuse opportunities before building or procuring, following the legal obligation under Circulaire 2021-1524 (Prime Minister circular on free software and open source in public administration).

---

## Inputs

| Artefact | Purpose |
|----------|---------|
| Requirements (`ARC-<id>-REQ-v1.0.md`) | Functional requirements to match against existing code |
| Research (`ARC-<id>-RES-v*.md`) | Market analysis context |

---

## Command

```bash
/arckit.fr-code-reuse Assess code reuse for <project scope and technology domain>
```

Output: `projects/<id>/ARC-<id>-REUSE-v1.0.md`

---

## Assessment Structure

| Section | Contents |
|---------|----------|
| Legal Framework | Circulaire 2021-1524, Loi 2016-1321 (République Numérique) |
| Component Inventory | Software components needed (COMP-xx identifiers) |
| code.gouv.fr Results | French public code catalogue search results |
| SILL Matches | Recommended open source from SILL |
| EU Sources | Joinup, EC Open Source Observatory results |
| Licence Compatibility | EUPL-1.2, GPL, LGPL, Apache compatibility matrix |
| Decision Matrix | For each component: Reuse / Fork / SILL / Procure / Build |
| Contribution-Back Plan | Obligations when modifying existing public code |
| Publication Obligation | If building new code: publication on code.gouv.fr required |
| Gap Analysis | Components lacking reuse solution (build/procure justified) |

---

## Decision Matrix Options

| Decision | When to Use |
|----------|-------------|
| Reuse as-is | Existing code meets needs without modification |
| Fork and contribute back | Existing code needs modification — contribution required |
| SILL adoption | Software on ministerial recommended list |
| Procure | No suitable open source; procurement required |
| Build and publish | No existing solution; new code must be open-sourced |

---

## One-Page Workflow

| Phase | Key Activities | ArcKit Commands |
|-------|----------------|-----------------|
| Discovery | Requirements and component needs | `/arckit.requirements` |
| Research | Market and open source landscape | `/arckit.research` |
| Reuse | Code reuse assessment | `/arckit.fr-code-reuse` |
| Procurement | If procuring | `/arckit.fr-marche-public` |

---

## Review Checklist

- code.gouv.fr searched for each required component.
- SILL checked for ministerially recommended alternatives.
- EU public code sources (Joinup, EC OSS) consulted.
- Licence compatibility assessed for all candidates (EUPL-1.2 recommended for public sector).
- Decision matrix produced for each component with justification.
- Contribution-back plan included for any forked public code.
- Publication obligation documented for any new code developed.
- Circulaire 2021-1524 compliance evidence included.

---

## Key Notes

- **Legal obligation**: Circulaire 2021-1524 makes code reuse a legal obligation — not a best practice. Failure to consider existing public code before building is non-compliant.
- **SILL** = Socle Interministériel de Logiciels Libres — the inter-ministerial recommended open source stack, maintained by DINUM. Choosing software on the SILL avoids procurement for approved use cases.
- **Publication**: New code developed by or for public administrations must be published as open source unless an explicit exemption applies (security, IP rights of third parties).
- **EUPL-1.2**: The preferred licence for French public code — copyleft that is compatible with most open source licences and legally valid across all EU member states.
