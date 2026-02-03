# Architecture Decision Record (ADR) Guide

`/arckit.adr` produces MADR v4.0-compatible architecture decision records backed by governance metadata and UK Government escalation requirements.

---

## Inputs

| Artefact | Purpose |
|----------|---------|
| Requirements & principles | Provide evaluation criteria and constraints |
| Risk register | Ensures mitigations or accepts residual risk |
| HLD/DLD references | Supplies context diagrams and interfaces |
| Compliance artefacts | Link to TCoP, Secure by Design, AI Playbook evidence when impacted |

---

## Command

```bash
/arckit.adr Document architectural decision for <topic>, compare options A/B/C
```

Output: `projects/<id>/decisions/ARC-<id>-ADR-001-v1.0.md` (uses multi-instance numbering) plus optional summary table appended to `decisions/index.md`.

> **Auto-versioning**: Creating a new ADR auto-increments the ADR number. Updating an existing ADR (e.g., "update ADR-001") auto-increments the version (minor for updated evidence, major for changed decision outcome) instead of overwriting.

---

## MADR Structure

| Section | Notes |
|---------|-------|
| Context & Problem Statement | State trigger, affected capabilities, and non-negotiables |
| Decision Drivers | Reference stakeholder goals, NFRs, and compliance mandates |
| Considered Options | Minimum of two options; include baseline / do-nothing |
| Pros & Cons | Map to decision drivers; cite evidence from research or pilots |
| Decision Outcome | Selected option, rationale, status (Proposed/Accepted/Rejected) |
| Consequences | Positive/negative impacts, follow-on tasks, re-evaluation date |
| Governance & Approvals | Record design authorities, CABs, risk owners, sign-off dates |

---

## Usage Pattern

1. Run `/arckit.adr` immediately after new insights from `/arckit.research`, `/arckit.hld-review`, or vendor clarifications.
2. Attach document IDs from `/arckit.traceability` so requirements coverage stays auditable.
3. Version ADRs in git; never overwrite history—open new ADRs when reversing prior choices.
4. Feed summaries into `/arckit.story` so programme leadership tracks pivotal decisions.

---

## Review Checklist

- Decision ties directly to stakeholder drivers or requirements IDs.
- Risks and mitigations reference the risk register entry numbers.
- Compliance impacts call out required evidence (TCoP point, Secure by Design activity, ATRS field).
- Follow-on actions list named owners and due dates; backlog items reference `/arckit.backlog`.
