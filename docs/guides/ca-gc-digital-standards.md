# Canada GC Digital Standards Conformance Playbook

> **Guide Origin**: Community | **ArcKit Version**: [VERSION]

`/arckit:ca-gc-digital-standards` generates a Government of Canada Digital Standards conformance scorecard for a federal digital service. It assesses the service against the 10 Digital Standards individually, surfaces evidence and gaps per standard, captures remediation actions with owners and target dates, and produces a per-standard maturity roadmap. Cross-cutting themes — accessibility, open data and code, ethical AI, user research practice — are scored once across the standards they touch.

The Digital Standards are not aspirational principles. They sit under the TBS *Policy on Service and Digital* and the *Directive on Service and Digital*; ADMs are accountable for adherence and TBS audits conformance through the digital reporting cycle. Standard 6 is reinforced by the *Accessible Canada Act* and the *Accessible Canada Regulations*, which set the statutory floor regardless of how the digital scorecard reads. Treat this artefact as a delivery and governance gate — not a self-assessment exercise.

---

## Inputs

| Artefact | Purpose |
|----------|---------|
| Requirements (`ARC-<id>-REQ-v1.0.md`) | Service description, user populations, intended outcomes |
| Service assessment (`ARC-<id>-SAS-v1.0.md`) | GDS-style evidence base — many points map onto Digital Standards |
| Retrospective notes | Iteration cadence, learning loops, team practices |
| Accessibility audits | WCAG 2.1 AA / 2.2 AA conformance, manual and assistive-tech reviews |
| PIA / AIA artefacts | Standard 5 (security and privacy) and Standard 9 (ethical) evidence |

---

## Command

```bash
/arckit:ca-gc-digital-standards <project ID or service description>
```

Output: `projects/<id>/ARC-<id>-DIGSTD-v1.0.md`

---

## Assessment Structure

| Section | Contents |
|---------|----------|
| Document Control | Canadian classification (UNCLASSIFIED / Protected A–C / CONFIDENTIAL / SECRET / TOP SECRET) |
| Revision History | Version, date, author, changes, approvals |
| Executive Summary | Conformance posture across the 10 standards, top remediation actions, maturity headline |
| Service Description | Service, owner, user populations, lifecycle stage, key artefacts |
| Per-Standard Assessment | One sub-table per standard with Evidence, Gaps, Remediation, Owner, Target date, Maturity |
| Cross-Cutting Themes | Accessibility, open data and code, ethical AI, user research — scored across the standards they touch |
| Maturity Roadmap | Current vs target maturity per standard, milestones, owners, dates |
| Open Items | Outstanding decisions, blocked remediations, deferred standards work |
| External References | Document Register, Citations, Unreferenced |

---

## Maturity scale

The scorecard uses a CMMI-style 5-level progression for each standard:

| Level | Meaning |
|-------|---------|
| Initial | Practice is ad hoc, undocumented, or absent. Conformance is incidental rather than designed. |
| Repeatable | Practice happens consistently on this service, but is informal and dependent on the current team. |
| Defined | Practice is documented, standardised across the team, and onboarded into team rituals. |
| Measured | Outcomes are instrumented; the team has metrics that prove conformance, not just activity. |
| Optimising | The team uses the metrics to iterate the practice itself. Conformance improves over time without prompting. |

Score each standard independently. Do not collapse the 10 dimensions into a single overall maturity number — that loses the per-standard signal TBS reviewers need.

---

## When to run

- Pre-launch — before go-live for a new federal digital service to evidence conformance to all 10 standards.
- ATO renewal — pair with `ca-itsg-33` and `ca-pia` so the security, privacy, and digital scorecards refresh together.
- Quarterly governance review — TBS reporting cycles surface conformance gaps, so refresh the scorecard ahead of each cycle.
- Substantive service change — new audience, new channel, new automated decision, new processor, or change of jurisdiction.

---

## Common pitfalls

- **Treating the standards as advisory.** The Digital Standards are policy under the *Policy on Service and Digital*; non-conformance has audit consequences. Do not write the scorecard as a discretionary self-rating.
- **Missing the WCAG / Accessible Canada Act floor.** Standard 6 is anchored in statute. WCAG 2.1 AA / 2.2 AA conformance is the operational target, and statutory accessibility plans, feedback processes, and progress reports are mandatory regardless of how the scorecard reads.
- **Default-private working when "Work in the open" is the rule.** Standard 3 requires open-by-default. Reasons not to publish must be explicit, narrow, and time-boxed. Default-private is itself a non-conformance — remediate it, do not rationalise it.
- **Uniform maturity claims rather than per-standard.** A service can be advanced on accessibility and immature on open code. The scorecard MUST report dimension-by-dimension; an aggregated overall maturity number is misleading and is not accepted by TBS reviewers.
- **Confusing this with the GDS Service Standard.** The two regimes overlap conceptually but are governed differently. Use `service-assessment` for the GDS regime; this command is the GC-specific complement.

---

## Handoffs

- **`service-assessment`** — Many of the GDS Service Standard points overlap with the GC Digital Standards (user research, accessibility, iteration, openness). The Digital Standards scorecard feeds the broader service-assessment evidence base directly; cross-link the same evidence rather than duplicating it. Where the regimes diverge (e.g. open-by-default, ethical AI), keep the per-standard treatment authoritative here.
- **`roadmap`** — Identified gaps and remediation actions become roadmap milestones with owners, dates, and dependencies. Carry the per-standard maturity progression forward so the strategic roadmap shows how conformance improves over the planning horizon, not just feature delivery.

---

## Statutory currency

The Digital Standards may be revised by TBS — the standards themselves and the *Directive on Service and Digital* both evolve, and the *Digital Operations Strategic Plan* is updated annually. The *Accessible Canada Regulations* expand in tranches across federal entities and reporting categories. Cite the version verified at the verification date in the Document Register, and re-verify on every refresh of the scorecard. Provincial accessibility regimes (AODA in Ontario, the BC Accessibility Act, Loi visant à favoriser l'intégration in Quebec) layer on top where the service has provincial reach — they require their own assessments and are out of scope here.
