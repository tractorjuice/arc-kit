# Australian ISM Statement of Applicability Playbook

> **Guide Origin**: Community | **ArcKit Version**: [VERSION]

`/arckit:au-ism-controls` generates a Statement of Applicability against the Australian Signals Directorate's Information Security Manual (ISM). It scopes the system, surveys the 17 ISM control domains for in-scope controls, scores each control's implementation posture with evidence, captures the residual risk, and surfaces the IRAP-assessable posture (Information Security Registered Assessors Program — the Australian government's cloud-inheritance and external-assessment programme).

The ISM is the authoritative control library for Australian Federal entities and DISP suppliers. The SoA is the gate artefact for IRAP assessment, security accreditation, and the PSPF Technology domain (which requires the ISM to be applied).

---

## Inputs

| Artefact | Purpose |
|----------|---------|
| Requirements (`ARC-<id>-REQ-v1.0.md`) | Service description, hosting model, data flows |
| Data model (`ARC-<id>-DATA-v*.md`) | Sensitivity categories driving control intensity |
| `/arckit:au-e8-posture` output (`ARC-<id>-AUE8-v1.0.md`) | Cyber baseline that the ISM SoA cross-references |
| Vendor HLD (`vendors/*/hld-v*.md`) | Architecture, identity model, key management |

---

## Command

```bash
/arckit:au-ism-controls <project ID or service description>
```

Output: `projects/<id>/ARC-<id>-AUISM-v1.0.md`

---

## Assessment Structure

| Section | Contents |
|---------|----------|
| Document Control | Australian classification (UNOFFICIAL / OFFICIAL / OFFICIAL:Sensitive / PROTECTED / SECRET / TOP SECRET) |
| Revision History | Version, date, author, changes, approvals |
| Executive Summary | System, classification, ISM edition used, overall applicability posture, key gaps, IRAP and DISP position |
| System Context | System name, classification, deployment model, IRAP status and scope, DISP membership, ISM edition used, sovereignty, assessment date, assessor |
| Control Domain Applicability Matrix | All 17 control areas: applies, implementation status, notes |
| Per-Domain Control Applicability Assessment | For each area: applies, implementation, applicable ISM control IDs, evidence, gaps, remediation, compensating controls |
| ISM-to-E8 Cross-Reference | Which control areas each Essential Eight strategy maps to |
| Compliance Summary | Per-area applicable, implemented and gap counts; overall applicability score (implemented / applicable) |
| IRAP Assessment Position | IRAP status and scope, accepted residual risks, re-assessment cadence, cloud provider inheritance |
| Recommendations | Quick Wins / Short-Term / Medium-Term, each with ISM control IDs and area |
| ArcKit Evidence Integration | Diagram, DFD, data model, ServiceNow, risk, traceability, graph-report and maturity-model evidence |
| External References | Document register (ISM edition), citations, unreferenced documents, verification dates |
| Visual Evidence Decision Rule | When a companion diagram is drawn, drafted with `Pending Input` labels, or recorded as a visual evidence gap |

---

## Regulatory Anchors

- **ASD Information Security Manual (ISM)** — 17 control domains; quarterly-updated control library
- **PSPF Technology domain** — the federal protective security policy requires the ISM's cyber security principles and controls to be applied across the technology lifecycle
- **IRAP (Information Security Registered Assessors Program)** — primary external-assessment route, especially for cloud inheritance
- **Cyber Security Act 2024 (Cth)** — incident reporting obligations relevant to security incidents tracked against ISM controls
- **PGPA Act 2013 s16** — federal accountable-authority duties

---

## When to Run

- During HLD / detailed design, after the architecture has stabilised enough to enumerate control inheritance
- Before IRAP assessment kicks off (the SoA is the input to the assessor's scoping)
- Re-run on material architecture change or quarterly ISM update where control changes affect the system
- DISP Level 2+ suppliers refresh on the attestation cycle

---

## Common Pitfalls

- **Treating every ISM control as in-scope** — the SoA is about applicability. Mark out-of-scope controls explicitly with rationale; assessors flag thin-scoping faster than thick-scoping.
- **Claiming inheritance without an IRAP letter** — cloud or platform inheritance requires a current IRAP assessment letter. Without it, the control is not inherited — it's the customer's to implement.
- **Stale evidence dates** — ISM controls reference fresh evidence (logs, configs, scan output). Mark anything older than the assessment window as stale.

---

## Handoff

Foundational input to `/arckit:au-disp-attestation` (DISP Information & Cyber domain draws heavily from the ISM SoA), `/arckit:au-pspf` (the PSPF Technology domain cites ISM SoA evidence), and feeds the IRAP assessor scoping package.
