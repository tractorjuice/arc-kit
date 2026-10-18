# Australian Privacy Impact Assessment Playbook

> **Guide Origin**: Community | **ArcKit Version**: [VERSION]

`/arckit:au-pia` generates an Australian Privacy Impact Assessment under the Privacy Act 1988 (Cth) and the 13 Australian Privacy Principles. It describes the project and the personal information it handles, maps the information flows against the APPs that govern them, runs an APP-by-APP applicability and compliance analysis, registers privacy risks with mitigations, captures cross-border disclosure under APP 8, tests for sensitive information, and records the automated-decision-making position. The breach response itself (Notifiable Data Breaches scheme, Privacy Act Part IIIC) is produced by `/arckit:au-ndb-playbook`.

The PIA is a recognised due diligence artefact for Australian Federal entities and APP entities generally. The Privacy Act Tranche 1 reforms (December 2024) introduced new accountability, consent, and automated-decision-making obligations — the PIA explicitly addresses where these apply. Mark anything dependent on the Tranche 2 reforms as `<PENDING TRANCHE 2>` and revisit when the reforms enter force.

---

## Inputs

| Artefact | Purpose |
|----------|---------|
| Requirements (`ARC-<id>-REQ-v1.0.md`) | Service description, decision logic, automated decision-making scope |
| Data requirements (`DR-*` in `ARC-<id>-REQ-v*.md`) | Per-element personal information inventory and sensitivity flags |
| Data model (`ARC-<id>-DATA-v*.md`) | Entities and relationships carrying personal information |
| Stakeholders (`ARC-<id>-STKE-v1.0.md`) | Subject populations, partner agencies, processors, offshore recipients |

---

## Command

```bash
/arckit:au-pia <project ID or service description>
```

Output: `projects/<id>/ARC-<id>-AUPIA-v1.0.md`

---

## Assessment Structure

| Section | Contents |
|---------|----------|
| Document Control | Australian classification (UNOFFICIAL / OFFICIAL / OFFICIAL:Sensitive / PROTECTED / SECRET / TOP SECRET) |
| Revision History | Version, date, author, changes, approvals |
| Executive Summary | Project assessed, personal information involved, overall privacy risk posture, key findings and recommendations |
| Project Description | Project name, owning agency, phase, data subjects, personal information types, sensitive information, data volume, AI or automated decisions, assessment date, Privacy Officer |
| Information Flows | Diagram of collection, processing, storage and disclosure, with each flow annotated with the APP that governs it |
| APP Compliance Assessment | All 13 APPs: applies, status, evidence, risk (likelihood × impact), mitigation; APP 8 lists overseas recipients and the compliance mechanism; APP 11 cross-references the E8 posture |
| APP Compliance Summary | One row per APP: applies, status, risk level |
| Privacy Risk Register | Risks by APP with likelihood, impact, mitigation and residual risk |
| Sensitive Information Assessment | Each Privacy Act s 6 sensitive-information category: processed, consent mechanism, notes |
| AI and Automated Decision-Making | AI use, automated decisions affecting individuals, December 2026 notification status, human review, fairness assessment, AI assurance cross-reference |
| Recommendations | Prioritised actions by APP with owner and target date |
| External References | ArcKit evidence integration (DFD, data model, risk, traceability, graph-report), document register, citations, unreferenced documents |
| Visual Evidence Decision Rule | When a companion diagram is drawn, drafted with `Pending Input` labels, or recorded as a visual evidence gap |

---

## Regulatory Anchors

- **Privacy Act 1988 (Cth)** — primary statute; 13 APPs in Schedule 1
- **Privacy and Other Legislation Amendment Act 2024** (Tranche 1 reforms) — children's privacy, statutory tort, automated decisions, transparency
- **OAIC Notifiable Data Breaches scheme** (Privacy Act Part IIIC) — eligible-data-breach definition, notification timeframes
- **OAIC Australian Privacy Principles guidelines** — authoritative interpretation
- **APP 8** — cross-border disclosure accountability; *Australian Privacy Foundation v ALRC* and OAIC guidance

---

## When to Run

- Whenever a new service collects, holds, uses, or discloses personal information
- On material change to processing activities, recipients, or retention periods
- Before launch of any service triggering Tranche 1 obligations (notably automated decisions affecting individuals)
- Refresh annually or on material privacy-incident learnings

---

## Handoff

Foundational input to `/arckit:au-ndb-playbook` (NDB playbook uses the personal information inventory and breach decision criteria), `/arckit:au-disp-attestation` (DISP information protection domain cites PIA evidence), and `/arckit:au-ai-assurance` (AI Assurance cross-references automated decision-making notification posture).
