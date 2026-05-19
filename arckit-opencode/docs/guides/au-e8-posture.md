# Australian Essential Eight Maturity Posture Playbook

> **Guide Origin**: Community | **ArcKit Version**: [VERSION]

`/arckit.au-e8-posture` generates an ASD Essential Eight maturity posture against the Australian Signals Directorate's Essential Eight Maturity Model. It scores each of the eight mitigation strategies (application control, patch applications, configure Microsoft Office macro settings, user application hardening, restrict administrative privileges, patch operating systems, multi-factor authentication, regular backups) against maturity levels ML0–ML3, captures the evidence base, identifies the maturity uplift path, and surfaces the DISP-aligned target (ML2 baseline for DISP Level 2 supplier accreditation).

The Essential Eight is the ASD's prioritised baseline for mitigating cyber security incidents and is the cyber baseline that DISP, federal entities, and most Commonwealth procurements measure against. The artefact this command produces is therefore a foundational input to almost every other Australian Federal security or assurance artefact — run it early.

---

## Inputs

| Artefact | Purpose |
|----------|---------|
| Requirements (`ARC-<id>-REQ-v1.0.md`) | Service description, hosting model, user populations |
| Data model (`ARC-<id>-DMOD-v1.0.md`) | Sensitive data categories that drive control intensity |
| Stakeholders (`ARC-<id>-STKE-v1.0.md`) | Accountable authority, security operations owner |

---

## Command

```bash
/arckit.au-e8-posture <project ID or service description>
```

Output: `projects/<id>/ARC-<id>-AUE8-v1.0.md`

---

## Assessment Structure

| Section | Contents |
|---------|----------|
| Document Control | Australian classification (UNOFFICIAL / OFFICIAL / OFFICIAL:Sensitive / PROTECTED / SECRET / TOP SECRET) |
| Revision History | Version, date, author, changes, approvals |
| Executive Summary | Current maturity by strategy, gap to target maturity, headline residual risks |
| Scope | In-scope systems, business units, environments (production / staging / non-production) |
| Maturity Assessment per Strategy | For each of the 8: current ML, target ML, evidence cited, gap analysis, planned uplift |
| Uplift Plan | Sequenced remediation with effort, dependencies, and DISP-attestation deadline alignment |
| Residual Risk Statement | Risks accepted, treatments in flight, escalation path |
| Maintenance Cadence | Re-assessment frequency, change triggers, ASD update tracking |

---

## Regulatory Anchors

- **ASD Essential Eight Maturity Model** — eight mitigation strategies, maturity levels ML0–ML3 (the authoritative source for scoring rubric)
- **ASD Information Security Manual (ISM)** — control-level detail referenced by E8 strategies (cross-reference via `/arckit.au-ism-controls`)
- **Defence Industry Security Program (DISP) Levels 1–3** — ML2 mandated for DISP Level 2 supplier accreditation
- **Commonwealth Procurement Rules (November 2025 overhaul)** — cyber maturity questions in standard supplier responses

---

## When to Run

- Early in delivery, immediately after stakeholders and requirements — before HLD or detailed security design
- Re-run on material change to hosting, identity, or admin access model
- Refresh annually at minimum; DISP suppliers refresh on the attestation cadence (typically 12 months)

---

## Common Pitfalls

- **Scoping too wide** — assessing the whole organisation when the artefact is service-specific produces a low-confidence score. Tighten scope to the service or DISP-accredited business unit.
- **Missing evidence date** — every cited evidence item needs a "verified on" date so reviewers can judge currency. Make the date a hard field.
- **Confusing ML2 with "good enough"** — ML2 is the DISP baseline, not a security ceiling. Where the residual risk justifies it, target ML3 on individual strategies.

---

## Handoff

Foundational input to `/arckit.au-disp-attestation` (DISP Member self-attestation pack consolidates E8 evidence), `/arckit.au-pspf` (PSPF cross-references E8 baselines), and `/arckit.au-ism-controls` (ISM Statement of Applicability draws from the same control evidence).
