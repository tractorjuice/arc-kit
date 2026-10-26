# Australian DTA Digital Service Standard Conformance Playbook

> **Guide Origin**: Community | **ArcKit Version**: [VERSION]

`/arckit:au-dss` generates a conformance assessment against the Digital Transformation Agency's Digital Service Standard. The current Standard has 10 criteria: 1 Have a clear intent; 2 Know your user; 3 Leave no one behind; 4 Connect services; 5 Build trust in design; 6 Don't reinvent the wheel; 7 Do no harm; 8 Innovate with purpose; 9 Monitor your service; 10 Keep it relevant. The command records whether and from when the Standard applies to the service, evaluates each criterion with evidence and gaps, records any exemption sought, and surfaces the readiness to report compliance to the DTA.

The Standard is part of the whole-of-government Digital Experience Policy. It is mandatory for informational and transactional services subject to the Investment Oversight Framework, new or replacement public-facing services, new staff-facing services, and all existing public-facing services. It applied from 1 July 2024 to new and replacement services and from 1 July 2025 to existing public-facing services, and agencies must meet all 10 criteria. It replaced the earlier 13-criterion Standard; old criterion names and numbers (such as "Criterion 13 — Encourage everyone to use the digital service") no longer apply.

The DTA Digital Service Standard is the Australian counterpart to the UK GDS Service Standard.

---

## Inputs

| Artefact | Purpose |
|----------|---------|
| Requirements (`ARC-<id>-REQ-v1.0.md`) | Service description, user needs, accessibility targets |
| Stakeholders (`ARC-<id>-STKE-v1.0.md`) | User populations, accountable authority, partners |
| Strategy (`ARC-<id>-STRAT-v1.0.md`) | Programme phase, success measures |
| Vendor HLD (`vendors/*/hld-v*.md`) | Technical posture, accessibility implementation |

---

## Command

```bash
/arckit:au-dss <project ID or service description>
```

Output: `projects/<id>/ARC-<id>-AUDSS-v1.0.md`

---

## Assessment Structure

| Section | Contents |
|---------|----------|
| Document Control | Australian classification (UNOFFICIAL / OFFICIAL / OFFICIAL:Sensitive / PROTECTED / SECRET / TOP SECRET) |
| Revision History | Version, date, author, changes, approvals |
| Executive Summary | Applicability, posture against the 10 criteria, key gaps, exemptions sought, reporting readiness |
| Service Context | Service name, owning agency, informational or transactional, public- or staff-facing, new / replacement / existing, IOF applicability, date the Standard applies from, phase, transaction volume |
| Digital Service Standard Assessment | All 10 criteria: status (Met / Partially Met / Not Met / Exemption sought), evidence, gaps, remediation; Criterion 3 records the WCAG version and level achieved, Criterion 5 cites the E8 and ISM artefacts, Criterion 7 the PIA, Criterion 8 the AI assurance artefact |
| Compliance Summary | One row per criterion with status and gap count; overall counts; exemptions sought |
| Assessment Readiness | Top risks to meeting all 10 criteria and reporting compliance, with mitigations |
| External References | ArcKit evidence integration, document register, citations, unreferenced documents |
| Visual Evidence Decision Rule | When a companion diagram is drawn, drafted with `Pending Input` labels, or recorded as a visual evidence gap |

---

## Regulatory Anchors

- **DTA Digital Service Standard** — 10 criteria (authoritative source for scoring), published at digital.gov.au
- **DTA Digital Experience Policy** — the policy the Standard sits under, with its Compliance, Reporting and Exemption Guide
- **Disability Discrimination Act 1992 (Cth), latest WCAG version, Australian Government Style Manual** — named in Criterion 3
- **PGPA Act 2013 s16** — federal accountable-authority duties

---

## When to Run

- At each phase of the Service Design and Delivery Process (Discovery, Alpha, Beta, Live) — each criterion links to the phases where it matters most, but applies across the service's life
- Before reporting compliance to the DTA
- On material change to user-facing design, accessibility implementation, or accountability model
- Refresh annually in steady-state Live, in line with Criterion 10 (Keep it relevant)

---

## Common Pitfalls

- **Assessing against the old 13 criteria** — "Make source code open", "Encourage everyone to use the digital service" and the rest of the earlier Standard were replaced. Use the 10 current criteria and their numbering.
- **Marking criteria green without dated evidence** — every "met" criterion needs an evidence pointer (research output, audit report, monitoring dashboard) with a date. Older than 12 months is stale.
- **Fixing the WCAG version** — Criterion 3 asks for the latest WCAG version. Record the version and level achieved, and check the target against current DTA guidance rather than assuming it.

---

## Handoff

Feeds the assurance package alongside `/arckit:au-pia` (Privacy Act compliance) and `/arckit:au-e8-posture` (cyber baseline). Pre-Live and Live phase artefacts cross-reference DSS conformance evidence in `/arckit:au-disp-attestation` for supplier-side accreditation.
