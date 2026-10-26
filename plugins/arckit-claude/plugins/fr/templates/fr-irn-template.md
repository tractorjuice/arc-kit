# IRN — Indice de Résilience Numérique — Self-Assessment

> **Template Origin**: Community | **ArcKit Version**: [VERSION] | **Command**: `/arckit-fr:fr-irn`
>
> ⚠️ **Community-contributed** — not part of the officially-maintained ArcKit baseline.

> **Note on methodology**: This document structures your IRN self-assessment but does not reproduce the aDRI scoring criteria for two explicit reasons:
>
> 1. **Living repository** — the IRN framework evolves actively at [gitlab.com/digitalresilienceinitiative/adri-irn](https://gitlab.com/digitalresilienceinitiative/adri-irn). Embedding a copy would create a frozen snapshot that diverges from the official methodology.
>
> 2. **Licence incompatibility** — the IRN is published under CC BY-NC-ND 4.0 (non-commercial, no derivatives). ArcKit is MIT (commercial use permitted). These licences are incompatible for derived content.
>
> **To score this document**: download the official aDRI evaluation grid at [gitlab.com/digitalresilienceinitiative/adri-irn](https://gitlab.com/digitalresilienceinitiative/adri-irn), open `Référentiel_IRN_v1.2.xlsx` (or the current version), fill the evaluation grid for each digital asset, then report the maturity level of each criterion below.

## Document Control

<!-- DOC-CONTROL-HEADER -->
<!-- Resolved at command-execution time per _partials/RENDERING.md. -->

## Revision History

| Version | Date | Author | Changes | Approved By | Approval Date |
|---------|------|--------|---------|-------------|---------------|
| [VERSION] | [YYYY-MM-DD] | ArcKit AI | Initial scaffold from `/arckit-fr:fr-irn` | PENDING | PENDING |

## Executive Summary

| Pillar | Criteria assessed | Non résilient | Trend | Priority Actions |
|--------|-------------------|---------------|-------|------------------|
| RES-1 Résilience Stratégique | [n / total or TBD] | [n or TBD] | [↑ / → / ↓] | [Key actions] |
| RES-2 Résilience Économique et Juridique | [n / total or TBD] | | | |
| RES-3 Résilience Data & IA | [n / total or TBD] | | | |
| RES-4 Résilience Opérationnelle | [n / total or TBD] | | | |
| RES-5 Résilience Supply-Chain | [n / total or TBD] | | | |
| RES-6 Résilience Technologique | [n / total or TBD] | | | |
| RES-7 Sécurité & Résilience | [n / total or TBD] | | | |
| RES-8 Résilience Environnementale et Énergétique | [n / total or TBD] | | | |

> **Scoring**: the official aDRI evaluation grid records a maturity level per criterion — or marks it non-resilient or not applicable — with comments and evidence. Report those levels here as recorded in the grid. The v1.2 workbook does not compute a weighted 0–100 score; state a global IRN score only if it was derived with the aDRI methodology or by an accredited assessor, and say which.

---

## Scope

### Digital Assets in Scope

The official grid is filled once per digital asset. Organisation-scope criteria are assessed once for the whole organisation; asset-scope criteria are assessed for each asset below.

| # | Asset name | Type | Supplier | Operator | Importance | Business use |
|---|------------|------|----------|----------|------------|--------------|
| A1 | [Asset name] | [e.g. SaaS, PaaS, IaaS, software, infrastructure] | [Supplier] | [Internal / external operator] | [Standard / Essentiel / Vital] | [Business use] |

---

## RES-1 — Résilience Stratégique

*Thematic areas: strategic technology vision & roadmap, independence strategy, IT governance*

> **Scoring**: one row per criterion of this pillar listed in the official aDRI evaluation grid — the criterion's scope (Organisation or Actif numérique) and maturity scale are defined there.

### Observable context (from project artifacts)

[Description of strategic technology decisions, roadmap commitments, governance structure identified from REQ/STKE/PRIN artifacts]

### Scoring grid

| Criterion ID | Scope | Asset | Pre-populated observations | Maturity level | Evidence |
|--------------|-------|-------|---------------------------|----------------|----------|
| RES-1.[n] | [Organisation / Actif numérique] | [Asset name or —] | [Context from artifacts] | ? | [Artifact reference or "To assess via aDRI grid"] |

### Preliminary risk observations

[Flag any obvious strategic dependency risks visible from existing artifacts — e.g., single-vendor lock-in, no documented exit strategy, absent IT governance structure]

---

## RES-2 — Résilience Économique et Juridique

*Thematic areas: regulatory compliance (RGPD, AI Act, DORA, NIS2…), legal sovereignty, audit & certification*

> **Scoring**: one row per criterion of this pillar listed in the official aDRI evaluation grid — the criterion's scope (Organisation or Actif numérique) and maturity scale are defined there.
> **Linked assessments**: `/arckit-eu:eu-rgpd`, `/arckit-eu:eu-nis2`, `/arckit-eu:eu-ai-act`, `/arckit-eu:eu-dora`

### Observable context (from project artifacts)

[Summary of regulatory compliance status from RGPD/CNIL/NIS2/AIACT artifacts if they exist]

### Scoring grid

| Criterion ID | Scope | Asset | Pre-populated observations | Maturity level | Evidence |
|--------------|-------|-------|---------------------------|----------------|----------|
| RES-2.[n] | [Organisation / Actif numérique] | [Asset name or —] | [Context from artifacts] | ? | [Artifact reference or "To assess via aDRI grid"] |

### Preliminary risk observations

[Flag regulatory gaps, extraterritorial law exposure (Cloud Act, FISA-702), missing DPAs, unresolved compliance obligations]

---

## RES-3 — Résilience Data & IA

*Thematic areas: data control, AI infrastructure, ethics & transparency*

> **Scoring**: one row per criterion of this pillar listed in the official aDRI evaluation grid — the criterion's scope (Organisation or Actif numérique) and maturity scale are defined there.

### Observable context (from project artifacts)

[Data sovereignty measures, AI model ownership, data localisation commitments from DATA/REQ artifacts]

### Scoring grid

| Criterion ID | Scope | Asset | Pre-populated observations | Maturity level | Evidence |
|--------------|-------|-------|---------------------------|----------------|----------|
| RES-3.[n] | [Organisation / Actif numérique] | [Asset name or —] | [Context from artifacts] | ? | [Artifact reference or "To assess via aDRI grid"] |

### Preliminary risk observations

[Flag data trapped in proprietary formats, AI model dependency on third-party APIs, absence of data portability mechanisms]

---

## RES-4 — Résilience Opérationnelle

*Thematic areas: business continuity, incident management, recovery plans*

> **Scoring**: one row per criterion of this pillar listed in the official aDRI evaluation grid — the criterion's scope (Organisation or Actif numérique) and maturity scale are defined there.
> **Linked assessments**: `/arckit-fr:fr-ebios`

### Observable context (from project artifacts)

[BCP/DRP status, RTO/RPO targets, incident response readiness from EBIOS/RISK artifacts]

### Scoring grid

| Criterion ID | Scope | Asset | Pre-populated observations | Maturity level | Evidence |
|--------------|-------|-------|---------------------------|----------------|----------|
| RES-4.[n] | [Organisation / Actif numérique] | [Asset name or —] | [Context from artifacts] | ? | [Artifact reference or "To assess via aDRI grid"] |

### Preliminary risk observations

[Flag single points of failure, absence of tested recovery procedures, undocumented incident escalation paths]

---

## RES-5 — Résilience Supply-Chain

*Thematic areas: critical suppliers, diversification, contracts & SLAs*

> **Scoring**: one row per criterion of this pillar listed in the official aDRI evaluation grid — the criterion's scope (Organisation or Actif numérique) and maturity scale are defined there.

### Observable context (from project artifacts)

[Critical vendor list, SLA terms, exit clauses, concentration risks from RSCH/SOW/VEND artifacts]

### Scoring grid

| Criterion ID | Scope | Asset | Pre-populated observations | Maturity level | Evidence |
|--------------|-------|-------|---------------------------|----------------|----------|
| RES-5.[n] | [Organisation / Actif numérique] | [Asset name or —] | [Context from artifacts] | ? | [Artifact reference or "To assess via aDRI grid"] |

### Preliminary risk observations

[Flag critical single-vendor dependencies, absent exit clauses, SLAs below operational requirements, no secondary supplier]

---

## RES-6 — Résilience Technologique

*Thematic areas: infrastructure & cloud, applications & SaaS, open source*

> **Scoring**: one row per criterion of this pillar listed in the official aDRI evaluation grid — the criterion's scope (Organisation or Actif numérique) and maturity scale are defined there.
> **Linked assessments**: `/arckit-fr:fr-secnumcloud`

### Observable context (from project artifacts)

[Cloud provider(s), qualification status (SecNumCloud/HDS/ISO 27001), open-source vs proprietary ratio from REQ/SECNUM artifacts]

### Scoring grid

| Criterion ID | Scope | Asset | Pre-populated observations | Maturity level | Evidence |
|--------------|-------|-------|---------------------------|----------------|----------|
| RES-6.[n] | [Organisation / Actif numérique] | [Asset name or —] | [Context from artifacts] | ? | [Artifact reference or "To assess via aDRI grid"] |

### Preliminary risk observations

[Flag non-EU cloud providers, unqualified hosting for sensitive data, proprietary format lock-in, missing open-source alternatives]

---

## RES-7 — Sécurité & Résilience

*Thematic areas: cybersecurity, data protection, risk management*

> **Scoring**: one row per criterion of this pillar listed in the official aDRI evaluation grid — the criterion's scope (Organisation or Actif numérique) and maturity scale are defined there.
> **Linked assessments**: `/arckit-fr:fr-anssi`, `/arckit-fr:fr-ebios`, `/arckit-eu:eu-nis2`

### Observable context (from project artifacts)

[Security posture from ANSSI/EBIOS/SECD artifacts — hygiene measures implemented, known gaps, NIS2 status]

### Scoring grid

| Criterion ID | Scope | Asset | Pre-populated observations | Maturity level | Evidence |
|--------------|-------|-------|---------------------------|----------------|----------|
| RES-7.[n] | [Organisation / Actif numérique] | [Asset name or —] | [Context from artifacts] | ? | [Artifact reference or "To assess via aDRI grid"] |

### Preliminary risk observations

[Flag missing security certifications, unresolved ANSSI hygiene gaps, absent CSIRT relationship, no penetration testing cadence]

---

## RES-8 — Résilience Environnementale et Énergétique

*Thematic areas: carbon footprint, green IT, digital sustainability*

> **Scoring**: one row per criterion of this pillar listed in the official aDRI evaluation grid — the criterion's scope (Organisation or Actif numérique) and maturity scale are defined there.
> **Linked assessments**: `/arckit-fr:fr-dinum` (RGESN — Référentiel Général d'Écoconception des Services Numériques)

### Observable context (from project artifacts)

[Green IT commitments, RGESN compliance status, carbon measurement from DINUM/REQ artifacts]

### Scoring grid

| Criterion ID | Scope | Asset | Pre-populated observations | Maturity level | Evidence |
|--------------|-------|-------|---------------------------|----------------|----------|
| RES-8.[n] | [Organisation / Actif numérique] | [Asset name or —] | [Context from artifacts] | ? | [Artifact reference or "To assess via aDRI grid"] |

### Preliminary risk observations

[Flag absent carbon footprint measurement, non-RGESN-compliant services, no green cloud commitment, undocumented e-waste policy]

---

## Scoring Summary Matrix

> Fill in after applying the official aDRI evaluation grid. Each cell summarises the maturity levels recorded for that pillar's criteria — for example the number of criteria marked non-resilient. ? = not yet assessed. Add one column per asset in scope; leave a cell as — where the pillar has no criteria of that scope.

| | Organisation | A1 [Asset name] | A2 [Asset name] |
|---|--------------|-----------------|-----------------|
| **RES-1** Stratégique | ? | ? | ? |
| **RES-2** Éco. & Juridique | ? | ? | ? |
| **RES-3** Data & IA | ? | ? | ? |
| **RES-4** Opérationnelle | ? | ? | ? |
| **RES-5** Supply-Chain | ? | ? | ? |
| **RES-6** Technologique | ? | ? | ? |
| **RES-7** Sécurité | ? | ? | ? |
| **RES-8** Environnementale & Énergétique | ? | ? | ? |

---

## Gap Analysis and Action Plan

| # | Gap | Criterion | Asset | Priority | Owner | Deadline |
|---|-----|-----------|-------|---------|-------|---------|
| G-01 | [Gap description] | RES-[N].[n] | [Asset or Organisation] | 🔴 High | [Role] | [Date] |

---

## Certification Pathway

The aDRI offers independent IRN labelling and certification for organisations wishing to formally validate and communicate their score:

- **Self-assessment** (this document) — internal use, no certification
- **Independent certification** — contact aDRI via [thedigitalresilience.org](https://thedigitalresilience.org/) — validation by accredited third party

---

**Generated by**: ArcKit `/arckit-fr:fr-irn` command
**Generated on**: [YYYY-MM-DD]
**ArcKit Version**: [VERSION]
**Project**: [PROJECT_NAME]
**Model**: [AI_MODEL]
**IRN Framework**: aDRI IRN v1.2 — [gitlab.com/digitalresilienceinitiative/adri-irn](https://gitlab.com/digitalresilienceinitiative/adri-irn) — CC BY-NC-ND 4.0
