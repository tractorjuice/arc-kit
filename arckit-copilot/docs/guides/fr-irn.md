# IRN — Indice de Résilience Numérique Playbook

> **Guide Origin**: Community | **ArcKit Version**: [VERSION]

`/arckit.fr-irn` structures an **IRN (Indice de Résilience Numérique)** self-assessment following the aDRI framework — 8 resilience pillars × 5 organisational layers, with a scoring scaffold and handoff to the official aDRI methodology.

> **Why reference instead of reproduce**: The IRN scoring criteria are published under CC BY-NC-ND 4.0 (non-commercial, no derivatives), which is incompatible with ArcKit's MIT licence (commercial use permitted). Additionally, the IRN is a living standard that evolves at [gitlab.com/digitalresilienceinitiative/adri-irn](https://gitlab.com/digitalresilienceinitiative/adri-irn) — embedding a snapshot would diverge from the official methodology. ArcKit structures and documents your assessment; the aDRI repository provides the scoring criteria.

---

## Inputs

| Artefact | Purpose |
|----------|---------|
| Requirements (`ARC-<id>-REQ-v1.0.md`) | Cloud/SaaS dependencies, data sovereignty choices |
| Stakeholder Analysis (`ARC-<id>-STKE-v1.0.md`) | Organisation type, strategic priorities, vendor relationships |
| Architecture Principles (`ARC-000-PRIN-v1.0.md`) | Cloud strategy, open-source policy, sovereignty principles |
| ANSSI Assessment (`ARC-<id>-ANSSI-v1.0.md`) | Pre-populate RES-7 cybersecurity |
| SecNumCloud Assessment (`ARC-<id>-SECNUM-v1.0.md`) | Pre-populate RES-6 cloud infrastructure |
| EBIOS Study (`ARC-<id>-EBIOS-v1.0.md`) | Pre-populate RES-4 operational resilience |
| GDPR Assessment (`ARC-<id>-RGPD-v1.0.md`) | Pre-populate RES-2 regulatory compliance |

---

## Command

```bash
/arckit.fr-irn IRN self-assessment for <project or organisation description>
```

Output: `projects/<id>/ARC-<id>-IRN-v1.0.md`

---

## The 8 IRN Pillars

| Code | Pillar | Thematic Areas |
|------|--------|---------------|
| RES-1 | Résilience Stratégique | Vision & roadmap, independence strategy, IT governance |
| RES-2 | Résilience Économique et Juridique | Regulatory compliance (RGPD, AI Act, DORA, NIS2…), legal sovereignty |
| RES-3 | Résilience Data & IA | Data control, AI infrastructure, ethics & transparency |
| RES-4 | Résilience Opérationnelle | Business continuity, incident management, recovery plans |
| RES-5 | Résilience Supply-Chain | Critical suppliers, diversification, contracts & SLAs |
| RES-6 | Résilience Technologique | Infrastructure & cloud, applications & SaaS, open source |
| RES-7 | Résilience Sécurité | Cybersecurity, data protection, risk management |
| RES-8 | Résilience Environnementale | Carbon footprint, green IT, digital sustainability |

## The 5 Organisational Layers

| Layer | Scope |
|-------|-------|
| Applicative | Applications, SaaS, business logic, AI models |
| Data | Data collection, quality, traceability, AI datasets |
| Plateforme | Dev/deploy/orchestration environments |
| Infrastructure | Cloud, compute, storage, network |
| Compétences | Human expertise, outsourcing level, change management |

---

## What ArcKit Does vs What the Official aDRI Grid Does

| ArcKit (`/arckit.fr-irn`) | Official aDRI Grid |
|--------------------------|-------------------|
| Creates the document structure | Provides R/NR criteria per pillar |
| Pre-populates context from existing project artifacts | Defines scoring weights and thresholds |
| Flags observable dependency risks | Calculates the 0–100 pillar scores |
| Links to the official methodology | Issues independent certification |

---

## One-Page Workflow

| Phase | Key Activities | ArcKit Commands |
|-------|----------------|-----------------|
| Discovery | Requirements and architecture principles | `/arckit.requirements`, `/arckit.principles` |
| Security | Cybersecurity posture (feeds RES-7) | `/arckit.fr-anssi`, `/arckit.fr-ebios` |
| Cloud | Cloud sovereignty (feeds RES-6) | `/arckit.fr-secnumcloud` |
| Compliance | Regulatory compliance (feeds RES-2) | `/arckit.eu-rgpd`, `/arckit.eu-nis2` |
| IRN | Self-assessment scaffold | `/arckit.fr-irn` |
| Scoring | Apply official aDRI grid | (External — aDRI GitLab) |

---

## Review Checklist

- All 8 IRN pillars present as document sections.
- Organisational layers in/out of scope documented with justification.
- R/NR scoring placeholders present — not pre-filled by AI.
- Link to official aDRI evaluation grid displayed prominently.
- Licence incompatibility note and living-repo rationale included in document body.
- Scoring summary matrix (8 × 5) present.
- Preliminary observations from project artifacts noted.
- Document classified OFFICIAL-SENSITIVE.

---

## Key Notes

- **Not a compliance framework** — the IRN is a strategic resilience index comparable to a B Corp label for digital autonomy. It is not a regulatory requirement (unlike DORA, NIS2, RGPD) but is increasingly expected by investors, partners, and public sector procurement.
- **Scoring is external** — ArcKit creates the scaffold; the actual R/NR scores require the official aDRI evaluation grid. ArcKit must not attempt to reconstruct or approximate the scoring criteria.
- **Living standard** — the IRN is under active development (current version: 0.4). Always download the current evaluation grid from the official repository before scoring.
- **Certification available** — organisations can request independent IRN certification via the aDRI ([thedigitalresilience.org](https://thedigitalresilience.org/)).
- **OFFICIAL-SENSITIVE** — the dependency map and gap analysis reveal strategic vulnerabilities that should not be publicly disclosed.
