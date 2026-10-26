# O-AA ADM Lite Playbook

> **Guide Origin**: Community | **ArcKit Version**: [VERSION]

`/arckit:oaa-adm-lite` creates an O-AA ADM Lite document that maps the TOGAF ADM cycle onto agile sprints, drawing on Open Agile Architecture (O-AA, C208). It sets out a sprint plan from Sprint 0 (vision and stakeholders) to Sprint 4+ (governance and change), with the deliverables, go/no-go gate and O-AA axioms for each sprint. The sprint-to-phase mapping is an ArcKit convention over TOGAF ADM (C182); the O-AA standard itself does not define an ADM cycle. The command is part of the `arckit-oaa` overlay, which needs the core `arckit` plugin.

---

## When to Use

| Use when any of these apply | Do not use when |
|-----------------------------|-----------------|
| The engagement has a hard timeline under 8 weeks for architecture and initial delivery | A full regulatory audit trail is required (use `/arckit:adm-preliminary` with the full ADM workflow) |
| The client works in an agile, sprint-driven culture | It is a multi-year transformation with 50+ stakeholder review gates |
| It is a first engagement and a rapid architecture vision is needed before scoping sprints | The baseline phase needs more than 4 weeks of current-state assessment |
| TOGAF alignment is required but quarterly boards and 200-page deliverables are not sustainable | |

---

## Inputs

| Artefact | Purpose |
|----------|---------|
| Architecture principles (`ARC-000-PRIN-v*.md`) | Recommended. Guiding principles, decision framework, technology standards. If missing, the command warns you to run `/arckit:principles` first |
| ADM Preliminary / Architecture Vision (`ARC-<id>-ADMP-v*.md`) | Recommended. Existing scope, drivers and constraints. If missing, Sprint 0 establishes the vision from scratch |
| Stakeholder analysis (`ARC-<id>-STKE-v*.md`) | Recommended. Roles, drivers, goals and concerns for the Sprint 0 stakeholder map |
| Requirements (`ARC-<id>-REQ-v*.md`) | Recommended. Business requirements and NFR targets for the Sprint 0 success criteria |
| Project external documents (`projects/<id>/external/`) | Read if present. Vision documents, strategic plans, enterprise architecture mandates |
| Enterprise standards (`projects/000-global/external/`) | Read if present. Architecture vision statements, transformation plans, cross-project alignment documents |

---

## Command

```bash
/arckit:oaa-adm-lite <project ID or name>
```

Output: `projects/<id>/ARC-<id>-OAAL-v1.0.md`

If the named project does not exist, the command creates it. If an OAAL document already exists, it writes a new version (v2.0) instead of overwriting. Organisation-specific values (`organisation_name`, `project_issue_prefix`, `safety_checklist_id`, `references_dir`) come from the `arckit-oaa` plugin configuration; empty values fall back to placeholders such as `[PENDING — organisation]`.

---

## Sprint Map

| Sprint | TOGAF Phases | Focus | Duration | Key Output |
|--------|--------------|-------|----------|------------|
| Sprint 0 | ADM-P + A | Vision + Stakeholders | 1 week | `vision.yaml` |
| Sprint 1 | ADM-B + C (part) | Business + Data Architecture | 2 weeks | `business-architecture.yaml`, `data-architecture.yaml` |
| Sprint 2 | ADM-C (part) + D | Technology Architecture | 2 weeks | `technology-architecture.yaml` |
| Sprint 3 | ADM-E + F | Implementation Wave | 2 weeks | `implementation-strategy.yaml` |
| Sprint 4+ | ADM-G + H | Governance + Change | Ongoing | `governance-report.yaml`, `change-request.yaml` |

At the default sprint lengths, Sprint 0 to Sprint 3 take 7 weeks, inside the 4-8 week engagement window the approach is designed for. Sprint 0 names the high-level business capabilities in scope as part of the vision (TOGAF Phase A); Sprint 1 develops the baseline and target business capability map, which TOGAF places in Phase B.

The document cites the published O-AA axioms it applies by number and name: 1 (Customer Experience Focus), 3 (Rapid Feedback Loops), 5 (Value Stream Alignment), 6 (Autonomous Cross-Functional Teams), 7 (Authority, Responsibility, and Accountability Distribution), 10 (Simple Common Operating Principles), 14 (Bias for Change) and 15 (Project to Product Shift). It does not quote axiom text that cannot be checked against C208.

---

## Deliverable Snapshot

| Section | Contents |
|---------|----------|
| Document Control | Document ID, owner, status, classification; review cycle per sprint |
| Trigger Guidance | When to use ADM Lite and when to use the full ADM instead |
| Sprint Map | Sprint-to-ADM-phase table with duration and key output |
| Sprint 0: Vision + Stakeholders (ADM-P + A) | Axiom alignment, activities, high-level capabilities in scope, `vision.yaml` structure (scope, constraints, stakeholders, success criteria, regulatory controls, risks), `stakeholder-map.md`, go/no-go gate |
| Sprint 1: Business + Data Architecture (ADM-B + C partial) | Baseline and target business capability map with gaps (`business-architecture.yaml`), value streams with SLAs, data assets and data flows with compliance controls, application components |
| Sprint 2: Technology Architecture (ADM-C continuation + D) | Technology standards, infrastructure and network topology, monitoring stack, compliance validation, architecture freeze |
| Sprint 3: Implementation Wave (ADM-E + F) | Work packages, migration waves and strategy with rollback trigger, risk register |
| Sprint 4+: Continuous Governance (ADM-G + H) | `governance-report.yaml`, governance cadence, change requests through `/arckit:architecture-change` |
| Sprint Artefact Traceability | Primary and secondary artefact for each sprint |
| Paperclip Integration | Issues per sprint, work package, compliance item and phase gate; issue naming convention |
| Comparison: Full ADM vs ADM Lite | What the lighter cadence trades away against the full ADM |
| External References | Document Register (C208 with URL and verification date), citations |

---

## Review Checklist

- Every TOGAF ADM phase maps to a named sprint, or is recorded as deliberately out of scope.
- Sprint duration and engagement window agree with the sprint table.
- Each sprint has a deliverable and a sprint-level acceptance criterion, not just a theme.
- The document states what the lighter cadence gives up and does not claim to be an audit trail.
- Governance and change handling sit in a sprint or are handed to `/arckit:agile-governance`.
- The plan traces to the principles, and to the ADM Preliminary, stakeholder analysis and requirements where they exist.
- Run `/arckit:health` after the build to catch stale or orphaned artefacts.

---

## Next Steps

- `/arckit:product-architecture` - Design product-centric architecture for the target product.
- `/arckit:agile-strategy` - Plan dual transformation with the agile strategy canvas.
- `/arckit:agile-security` - Embed security into the sprint rhythm.
- `/arckit:agile-governance` - Establish governance cadence for the programme.
