# Australian DTA Digital Service Standard Conformance Playbook

> **Guide Origin**: Community | **ArcKit Version**: [VERSION]

`/arckit.au-dss` generates a conformance assessment against the Digital Transformation Agency's Digital Service Standard (13 criteria). It scopes the service in delivery-phase terms (Discovery / Alpha / Beta / Live), evaluates each of the 13 criteria with evidence and gaps, captures the cross-jurisdictional procurement implications under the Commonwealth Procurement Rules (November 2025 overhaul), and surfaces the readiness posture for DTA assessment.

The DTA DSS is the Australian counterpart to the UK GDS Service Standard. The conformance assessment is the gate that Australian Federal services use to demonstrate user-centred, accessible, and accountable design before launch.

---

## Inputs

| Artefact | Purpose |
|----------|---------|
| Requirements (`ARC-<id>-REQ-v1.0.md`) | Service description, user needs, accessibility targets |
| Stakeholders (`ARC-<id>-STKE-v1.0.md`) | User populations, accountable authority, partners |
| Strategy (`ARC-<id>-STRAT-v1.0.md`) | Programme phase, success measures |
| HLD (`ARC-<id>-HLD-v1.0.md`) | Technical posture, accessibility implementation |

---

## Command

```bash
/arckit.au-dss <project ID or service description>
```

Output: `projects/<id>/ARC-<id>-AUDSS-v1.0.md`

---

## Assessment Structure

| Section | Contents |
|---------|----------|
| Document Control | Australian classification (UNOFFICIAL / OFFICIAL / OFFICIAL:Sensitive / PROTECTED / SECRET / TOP SECRET) |
| Revision History | Version, date, author, changes, approvals |
| Executive Summary | Headline conformance, gaps to launch, DTA assessment readiness |
| Service Scope | Description, owner, user populations, current delivery phase |
| Criterion-by-Criterion Assessment | All 13 criteria: posture, evidence cited, gaps, planned remediation |
| Accessibility (WCAG 2.2 AA) | Conformance level, audit evidence, remediation backlog |
| Procurement Implications | CPR November 2025 obligations, ICT supplier ethical conduct, AI transparency clauses |
| Performance Measures | KPIs aligned to DSS criteria 1, 8, and 13 |
| Treatment & Monitoring | Outstanding remediation, review cadence, governance routes |

---

## Regulatory Anchors

- **DTA Digital Service Standard** — 13 criteria (authoritative source for scoring)
- **DTA Digital Service Standard Guidance** — criterion-by-criterion interpretation
- **WCAG 2.2 AA** — accessibility target referenced by Criterion 9
- **Commonwealth Procurement Rules (November 2025 overhaul)** — supplier ethical conduct, AI transparency
- **PGPA Act 2013 s16** — federal accountable-authority duties

---

## When to Run

- At each delivery-phase gate (end of Discovery, end of Alpha, end of Beta, pre-Live)
- On material change to user-facing design, accessibility implementation, or accountability model
- Refresh annually in steady-state Live to track residual conformance

---

## Common Pitfalls

- **Marking criteria green without dated evidence** — every "met" criterion needs an evidence pointer (research output, audit report, monitoring dashboard) with a date. Older than 12 months is stale.
- **Confusing WCAG 2.1 AA with 2.2 AA** — Criterion 9 references the current target. Verify against the version cited in current DTA guidance.
- **Skipping the procurement criteria** — Criterion 13 (sustainability and value for money) materially changed with the CPR November 2025 overhaul. Cite the new obligations explicitly.

---

## Handoff

Feeds the assurance package alongside `/arckit.au-pia` (Privacy Act compliance) and `/arckit.au-e8-posture` (cyber baseline). Pre-Live and Live phase artefacts cross-reference DSS conformance evidence in `/arckit.au-disp-attestation` for supplier-side accreditation.
