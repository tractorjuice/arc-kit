# ANSSI Security Posture Assessment Playbook

> **Guide Origin**: Community | **ArcKit Version**: [VERSION]

`/arckit:fr-anssi` assesses compliance with the ANSSI Guide d'hygiène informatique (version 2.0, 2017 — 42 measures across 10 chapters) and the ANSSI recommendations for hosting sensitive information systems in the cloud (version 1.0, July 2024). Applicable to all French organisations, public or private.

---

## Inputs

| Artefact | Purpose |
|----------|---------|
| Requirements (`ARC-<id>-REQ-v1.0.md`) | IS scope, security requirements |
| Risk register | Security risks and existing controls |
| Architecture diagrams | Network and system topology |

---

## Command

```bash
/arckit:fr-anssi Assess ANSSI hygiene measures for <IS scope or project>
```

Output: `projects/<id>/ARC-<id>-ANSSI-v1.0.md`

---

## Assessment Structure

| Section | Contents |
|---------|----------|
| Executive Summary | Measures implemented / partial / not implemented per chapter; cloud applicability |
| 1. Scope and Applicable Guides | System studied, boundary, deployment environment, regulatory context |
| 2. Hygiene Guide — 42 Measures | Ten chapters, I to X (see below) |
| 3. Cloud Hosting Recommendations | IS category, recommended cloud offer type, provider qualification, cloud architecture security |
| 4. Gap Analysis and Remediation Plan | Priority (🔴 High / 🟠 Medium / 🟡 Low), owner, target date; summary score |

---

## 42 Measures — 10 Chapters

| Chapter | Measures |
|---------|----------|
| I. Raise awareness and train (Sensibiliser et former) | 1–3 |
| II. Know the information system (Connaître le système d'information) | 4–7 |
| III. Authenticate and control access (Authentifier et contrôler les accès) | 8–13 |
| IV. Secure workstations (Sécuriser les postes) | 14–18 |
| V. Secure the network (Sécuriser le réseau) | 19–26 |
| VI. Secure administration (Sécuriser l'administration) | 27–29 |
| VII. Manage mobile working (Gérer le nomadisme) | 30–33 |
| VIII. Keep the information system up to date (Maintenir le système d'information à jour) | 34–35 |
| IX. Monitor, audit, respond (Superviser, auditer, réagir) | 36–40 |
| X. Going further (Pour aller plus loin) | 41–42 |

Each measure is assessed against its *standard* level as: ✅ Implemented · ⚠️ Partial · ❌ Not implemented · N/A Not applicable. Where the guide defines a *renforcé* (reinforced) level, the assessment notes whether it is met or targeted.

---

## One-Page Workflow

| Phase | Key Activities | ArcKit Commands |
|-------|----------------|-----------------|
| Discovery | IS scope and security baseline | `/arckit:requirements` |
| Risk | Security risks | `/arckit:risk` |
| Assessment | ANSSI 42 measures | `/arckit:fr-anssi` |
| Cartography | IS mapping | `/arckit:fr-anssi-carto` |
| Risk analysis | EBIOS RM study | `/arckit:fr-ebios` |
| Policy | Security policy (PSSI) | `/arckit:fr-pssi` |

---

## Review Checklist

- All 42 measures assessed across the 10 chapters.
- Priority gaps flagged (🔴 High: before go-live or within 30 days).
- Cloud section completed if cloud services in scope.
- Cloud offer type checked against the ANSSI recommendation for the system's IS category (SecNumCloud qualification where recommended).
- Gap analysis with remediation timeline produced.
- Assessment classified Diffusion Restreinte (ANSSI assessment is sensitive).

---

## Key Notes

- **Scope**: Applicable to any French organisation (public or private) — not limited to OIV/OSE.
- **Cloud recommendations**: For each IS category (DR-level sensitive IS, sensitive IS under the State "cloud au centre" doctrine, sensitive IS of an OIV or OSE, SIIV), ANSSI recommends which cloud offer types to favour, given data sensitivity and the threat level. SecNumCloud is the qualification it recommends throughout.
- **ANSSI** = French national cybersecurity agency, analogous to the UK's NCSC.
