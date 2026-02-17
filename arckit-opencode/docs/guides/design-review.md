# Design Review Guide

Run `/arckit.hld-review` and `/arckit.dld-review` to apply structured quality gates before delivery teams start building.

---

## HLD vs DLD at a Glance

| Topic | High-Level Design (HLD) | Detailed Design (DLD) |
|-------|------------------------|------------------------|
| Focus | Architecture decisions, components, integrations | Implementation detail, APIs, build steps |
| Inputs | Approved requirements, principles, solution options | Approved HLD, vendor deliverables, data models |
| Key Outcomes | Principle compliance, requirement coverage, risk alignment | Testability, integration specifics, operational readiness |
| Gate | Approve before any detailed engineering | Approve before sprint/build kick-off |

---

## Pre-Review Checklist

- Latest requirements, principles, risk register, data model, and diagrams in repo.
- Vendor deliverable received (HLD or DLD markdown/PDF).
- Review panel confirmed (architecture, security, product, operations).

---

## Command Usage

```bash
/arckit.hld-review Review <vendor> high-level design for <project>
/arckit.dld-review Review <vendor> detailed design for <project>
```

Outputs (`reviews/ARC-<id>-HLDR-v1.0.md`, `reviews/ARC-<id>-DLDR-v1.0.md`) capture compliance results, gaps, and actions.

---

## Review Agenda Template

1. **Context** – Scope, assumptions, key decisions.
2. **Principles & Standards** – Pass/fail per principle with evidence.
3. **Requirements Coverage** – Table of requirement IDs vs components/tests.
4. **Architecture & Security** – Diagrams, resilience, data protection.
5. **Operational Readiness** – Monitoring, deployment, support model (DLD focus).
6. **Actions & Decisions** – Blockers, conditions, approvals.

---

## Decision Log Format

| Decision ID | Summary | Status | Owner | Due |
|-------------|---------|--------|-------|-----|
| DR-HLD-001 | Adopt multi-region deployment to satisfy 99.99% uptime | Approved | Vendor | 15 Apr |
| DR-DLD-004 | Provide API rate limiting design to meet SEC-002 | Action | Security Lead | Sprint 3 |

Record these directly in the generated review file to maintain traceability.

---

## After the Review

- Update backlog with actions (mark blockers as “must fix before approval”).
- Re-run the relevant review command once actions are complete.
- Store approved artefacts in `reviews/` directory for audit.
- Notify governance boards with key findings and approval state.
