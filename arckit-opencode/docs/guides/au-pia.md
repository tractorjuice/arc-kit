# Australian Privacy Impact Assessment Playbook

> **Guide Origin**: Community | **ArcKit Version**: [VERSION]

`/arckit:au-pia` generates an Australian Privacy Impact Assessment under the Privacy Act 1988 (Cth) and the 13 Australian Privacy Principles. It captures the entity's APP entity status, scopes the personal information lifecycle, runs an APP-by-APP applicability and compliance analysis, registers privacy risks with mitigations, captures cross-border disclosure flows under APP 8, and surfaces the OAIC notification posture under the Notifiable Data Breaches scheme (Privacy Act Part IIIC).

The PIA is a recognised due diligence artefact for Australian Federal entities and APP entities generally. The Privacy Act Tranche 1 reforms (December 2024) introduced new accountability, consent, and automated-decision-making obligations — the PIA explicitly addresses where these apply. Mark anything dependent on the Tranche 2 reforms as `<PENDING TRANCHE 2>` and revisit when the reforms enter force.

---

## Inputs

| Artefact | Purpose |
|----------|---------|
| Requirements (`ARC-<id>-REQ-v1.0.md`) | Service description, decision logic, automated decision-making scope |
| Data requirements (`ARC-<id>-DR-v1.0.md`) | Per-element personal information inventory and sensitivity flags |
| Data model (`ARC-<id>-DMOD-v1.0.md`) | Entities and relationships carrying personal information |
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
| Executive Summary | APP entity status, headline privacy risks, OAIC notification posture, Tranche 1 obligations |
| Programme / System Description | Description, owner, subject populations, lifecycle stage, personal information lifecycle |
| APP Entity Status | Whether the entity is APP-covered, exemptions claimed, small business operator status |
| APP-by-APP Analysis | All 13 APPs: applicability, current compliance posture, evidence, gaps |
| Personal Information Inventory | Per-element: type, sensitivity flag, lawful basis, retention, recipients |
| Cross-Border Disclosure (APP 8) | Offshore recipients, jurisdictions, enforceability assessment |
| Automated Decision-Making (Tranche 1) | Where automated decisions affect individuals, notification posture, human-review pathway |
| Privacy Risk Register | Risks, likelihood, impact, mitigations, residual risk |
| NDB Posture | Eligible-data-breach assessment criteria, notification decision logic, OAIC reporting workflow |
| Treatment & Monitoring | Mitigations in flight, review cadence, change triggers |

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
