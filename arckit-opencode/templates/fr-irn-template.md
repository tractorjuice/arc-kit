# IRN — Indice de Résilience Numérique — Self-Assessment

> **Template Origin**: Community | **ArcKit Version**: [VERSION] | **Command**: `/arckit.fr-irn`
>
> ⚠️ **Community-contributed** — not part of the officially-maintained ArcKit baseline.

> **Note on methodology**: This document structures your IRN self-assessment but does not reproduce the aDRI scoring criteria for two explicit reasons:
>
> 1. **Living repository** — the IRN framework evolves actively at [gitlab.com/digitalresilienceinitiative/adri-irn](https://gitlab.com/digitalresilienceinitiative/adri-irn). Embedding a copy would create a frozen snapshot that diverges from the official methodology.
>
> 2. **Licence incompatibility** — the IRN is published under CC BY-NC-ND 4.0 (non-commercial, no derivatives). ArcKit is MIT (commercial use permitted). These licences are incompatible for derived content.
>
> **To score this document**: download the official aDRI evaluation grid at [gitlab.com/digitalresilienceinitiative/adri-irn](https://gitlab.com/digitalresilienceinitiative/adri-irn), apply R/NR criteria per pillar and layer, then report your scores below.

## Document Control

| Field | Value |
|-------|-------|
| **Document ID** | ARC-[PROJECT_ID]-IRN-v[VERSION] |
| **Document Type** | IRN — Indice de Résilience Numérique Self-Assessment |
| **Project** | [PROJECT_NAME] (Project [PROJECT_ID]) |
| **Classification** | OFFICIAL-SENSITIVE |
| **Status** | DRAFT |
| **Version** | [VERSION] |
| **Created Date** | [YYYY-MM-DD] |
| **Last Modified** | [YYYY-MM-DD] |
| **Review Cycle** | Annual |
| **Next Review Date** | [YYYY-MM-DD] |
| **Owner** | [OWNER_NAME_AND_ROLE] |
| **Reviewed By** | PENDING |
| **Approved By** | PENDING |
| **Distribution** | [DISTRIBUTION_LIST] |
| **IRN Framework Version** | aDRI IRN v0.4 (verify current version at gitlab.com/digitalresilienceinitiative/adri-irn) |
| **Assessment Type** | Self-assessment — independent certification available via aDRI |

## Revision History

| Version | Date | Author | Changes | Approved By | Approval Date |
|---------|------|--------|---------|-------------|---------------|
| [VERSION] | [YYYY-MM-DD] | ArcKit AI | Initial scaffold from `/arckit.fr-irn` | PENDING | PENDING |

## Executive Summary

| Pillar | Score (0–100) | Trend | Priority Actions |
|--------|--------------|-------|-----------------|
| RES-1 Résilience Stratégique | [Score or TBD] | [↑ / → / ↓] | [Key actions] |
| RES-2 Résilience Économique et Juridique | [Score or TBD] | | |
| RES-3 Résilience Data & IA | [Score or TBD] | | |
| RES-4 Résilience Opérationnelle | [Score or TBD] | | |
| RES-5 Résilience Supply-Chain | [Score or TBD] | | |
| RES-6 Résilience Technologique | [Score or TBD] | | |
| RES-7 Résilience Sécurité | [Score or TBD] | | |
| RES-8 Résilience Environnementale | [Score or TBD] | | |
| **IRN Global Score** | **[Score or TBD]** | | |

> **Scoring**: Apply the official aDRI R/NR criteria (available at the official repository) per pillar and organisational layer to derive the 0–100 score for each pillar. The global IRN score is a weighted aggregate — weights and thresholds are defined in the official evaluation grid.

---

## Scope

### Organisational Layers in Scope

| Layer | In Scope | Justification |
|-------|----------|---------------|
| **Applicative** — Applications, SaaS, business logic, AI models | ☐ | [Justification] |
| **Data** — Data collection, quality, traceability, AI datasets | ☐ | [Justification] |
| **Platform** — Dev/deploy/orchestration environments | ☐ | [Justification] |
| **Infrastructure** — Cloud, compute, storage, network | ☐ | [Justification] |
| **Compétences** — Human expertise, outsourcing level, change management | ☐ | [Justification] |

---

## RES-1 — Résilience Stratégique

*Thematic areas: strategic technology vision & roadmap, independence strategy, IT governance*

> **Scoring**: consult the official aDRI evaluation grid for the R/NR criteria for this pillar.

### Observable context (from project artifacts)

[Description of strategic technology decisions, roadmap commitments, governance structure identified from REQ/STKE/PRIN artifacts]

### Scoring grid

| Layer | Pre-populated observations | R / NR | Source |
|-------|--------------------------|--------|--------|
| Applicative | [Context from artifacts] | ? | [Artifact reference or "To assess via aDRI grid"] |
| Data | [Context from artifacts] | ? | |
| Platform | [Context from artifacts] | ? | |
| Infrastructure | [Context from artifacts] | ? | |
| Compétences | [Context from artifacts] | ? | |

### Preliminary risk observations

[Flag any obvious strategic dependency risks visible from existing artifacts — e.g., single-vendor lock-in, no documented exit strategy, absent IT governance structure]

---

## RES-2 — Résilience Économique et Juridique

*Thematic areas: regulatory compliance (RGPD, AI Act, DORA, NIS2…), legal sovereignty, audit & certification*

> **Scoring**: consult the official aDRI evaluation grid for the R/NR criteria for this pillar.
> **Linked assessments**: `/arckit.eu-rgpd`, `/arckit.eu-nis2`, `/arckit.eu-ai-act`, `/arckit.eu-dora`

### Observable context (from project artifacts)

[Summary of regulatory compliance status from RGPD/CNIL/NIS2/AIACT artifacts if they exist]

### Scoring grid

| Layer | Pre-populated observations | R / NR | Source |
|-------|--------------------------|--------|--------|
| Applicative | | ? | |
| Data | | ? | |
| Platform | | ? | |
| Infrastructure | | ? | |
| Compétences | | ? | |

### Preliminary risk observations

[Flag regulatory gaps, extraterritorial law exposure (Cloud Act, FISA-702), missing DPAs, unresolved compliance obligations]

---

## RES-3 — Résilience Data & IA

*Thematic areas: data control, AI infrastructure, ethics & transparency*

> **Scoring**: consult the official aDRI evaluation grid for the R/NR criteria for this pillar.

### Observable context (from project artifacts)

[Data sovereignty measures, AI model ownership, data localisation commitments from DATA/REQ artifacts]

### Scoring grid

| Layer | Pre-populated observations | R / NR | Source |
|-------|--------------------------|--------|--------|
| Applicative | | ? | |
| Data | | ? | |
| Platform | | ? | |
| Infrastructure | | ? | |
| Compétences | | ? | |

### Preliminary risk observations

[Flag data trapped in proprietary formats, AI model dependency on third-party APIs, absence of data portability mechanisms]

---

## RES-4 — Résilience Opérationnelle

*Thematic areas: business continuity, incident management, recovery plans*

> **Scoring**: consult the official aDRI evaluation grid for the R/NR criteria for this pillar.
> **Linked assessments**: `/arckit.fr-ebios`

### Observable context (from project artifacts)

[BCP/DRP status, RTO/RPO targets, incident response readiness from EBIOS/RISK artifacts]

### Scoring grid

| Layer | Pre-populated observations | R / NR | Source |
|-------|--------------------------|--------|--------|
| Applicative | | ? | |
| Data | | ? | |
| Platform | | ? | |
| Infrastructure | | ? | |
| Compétences | | ? | |

### Preliminary risk observations

[Flag single points of failure, absence of tested recovery procedures, undocumented incident escalation paths]

---

## RES-5 — Résilience Supply-Chain

*Thematic areas: critical suppliers, diversification, contracts & SLAs*

> **Scoring**: consult the official aDRI evaluation grid for the R/NR criteria for this pillar.

### Observable context (from project artifacts)

[Critical vendor list, SLA terms, exit clauses, concentration risks from RSCH/SOW/VEND artifacts]

### Scoring grid

| Layer | Pre-populated observations | R / NR | Source |
|-------|--------------------------|--------|--------|
| Applicative | | ? | |
| Data | | ? | |
| Platform | | ? | |
| Infrastructure | | ? | |
| Compétences | | ? | |

### Preliminary risk observations

[Flag critical single-vendor dependencies, absent exit clauses, SLAs below operational requirements, no secondary supplier]

---

## RES-6 — Résilience Technologique

*Thematic areas: infrastructure & cloud, applications & SaaS, open source*

> **Scoring**: consult the official aDRI evaluation grid for the R/NR criteria for this pillar.
> **Linked assessments**: `/arckit.fr-secnumcloud`

### Observable context (from project artifacts)

[Cloud provider(s), qualification status (SecNumCloud/HDS/ISO 27001), open-source vs proprietary ratio from REQ/SECNUM artifacts]

### Scoring grid

| Layer | Pre-populated observations | R / NR | Source |
|-------|--------------------------|--------|--------|
| Applicative | | ? | |
| Data | | ? | |
| Platform | | ? | |
| Infrastructure | | ? | |
| Compétences | | ? | |

### Preliminary risk observations

[Flag non-EU cloud providers, unqualified hosting for sensitive data, proprietary format lock-in, missing open-source alternatives]

---

## RES-7 — Résilience Sécurité

*Thematic areas: cybersecurity, data protection, risk management*

> **Scoring**: consult the official aDRI evaluation grid for the R/NR criteria for this pillar.
> **Linked assessments**: `/arckit.fr-anssi`, `/arckit.fr-ebios`, `/arckit.eu-nis2`

### Observable context (from project artifacts)

[Security posture from ANSSI/EBIOS/SECD artifacts — hygiene measures implemented, known gaps, NIS2 status]

### Scoring grid

| Layer | Pre-populated observations | R / NR | Source |
|-------|--------------------------|--------|--------|
| Applicative | | ? | |
| Data | | ? | |
| Platform | | ? | |
| Infrastructure | | ? | |
| Compétences | | ? | |

### Preliminary risk observations

[Flag missing security certifications, unresolved ANSSI hygiene gaps, absent CSIRT relationship, no penetration testing cadence]

---

## RES-8 — Résilience Environnementale

*Thematic areas: carbon footprint, green IT, digital sustainability*

> **Scoring**: consult the official aDRI evaluation grid for the R/NR criteria for this pillar.
> **Linked assessments**: `/arckit.fr-dinum` (RGESN — Référentiel Général d'Écoconception des Services Numériques)

### Observable context (from project artifacts)

[Green IT commitments, RGESN compliance status, carbon measurement from DINUM/REQ artifacts]

### Scoring grid

| Layer | Pre-populated observations | R / NR | Source |
|-------|--------------------------|--------|--------|
| Applicative | | ? | |
| Data | | ? | |
| Platform | | ? | |
| Infrastructure | | ? | |
| Compétences | | ? | |

### Preliminary risk observations

[Flag absent carbon footprint measurement, non-RGESN-compliant services, no green cloud commitment, undocumented e-waste policy]

---

## Scoring Summary Matrix

> Fill in after applying the official aDRI evaluation grid. R = Résilient | NR = Non Résilient | ? = Not yet assessed.

| | Applicative | Data | Plateforme | Infrastructure | Compétences | Pillar Score |
|---|------------|------|------------|---------------|------------|-------------|
| **RES-1** Stratégique | ? | ? | ? | ? | ? | TBD |
| **RES-2** Éco. & Juridique | ? | ? | ? | ? | ? | TBD |
| **RES-3** Data & IA | ? | ? | ? | ? | ? | TBD |
| **RES-4** Opérationnelle | ? | ? | ? | ? | ? | TBD |
| **RES-5** Supply-Chain | ? | ? | ? | ? | ? | TBD |
| **RES-6** Technologique | ? | ? | ? | ? | ? | TBD |
| **RES-7** Sécurité | ? | ? | ? | ? | ? | TBD |
| **RES-8** Environnementale | ? | ? | ? | ? | ? | TBD |
| **IRN Global** | | | | | | **TBD / 100** |

---

## Gap Analysis and Action Plan

| # | Gap | Pillar | Layer | Priority | Owner | Deadline |
|---|-----|--------|-------|---------|-------|---------|
| G-01 | [Gap description] | RES-[N] | [Layer] | 🔴 High | [Role] | [Date] |

---

## Certification Pathway

The aDRI offers independent IRN labelling and certification for organisations wishing to formally validate and communicate their score:

- **Self-assessment** (this document) — internal use, no certification
- **Independent certification** — contact aDRI via [thedigitalresilience.org](https://thedigitalresilience.org/) — validation by accredited third party

---

**Generated by**: ArcKit `/arckit.fr-irn` command
**Generated on**: [YYYY-MM-DD]
**ArcKit Version**: [VERSION]
**Project**: [PROJECT_NAME]
**Model**: [AI_MODEL]
**IRN Framework**: aDRI IRN v0.4 — [gitlab.com/digitalresilienceinitiative/adri-irn](https://gitlab.com/digitalresilienceinitiative/adri-irn) — CC BY-NC-ND 4.0
