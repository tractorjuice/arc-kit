# Crosscutting Concepts: `[PROJECT_NAME]`

## Document Control

<!-- DOC-CONTROL-HEADER -->
<!-- Resolved at command-execution time per _partials/RENDERING.md. -->

<!-- Domain-specific fields, retained after the resolved header per the Document Control Standard. -->

| Field | Value |
|-------|-------|
| **Concepts Decided** | `[N] of [N]` |
| **Concepts Open** | `[N]` |

### Revision History

| Version | Date | Author | Changes | Approved By | Approval Date |
|---------|------|--------|---------|-------------|---------------|
| `[VERSION]` | `[YYYY-MM-DD]` | ArcKit AI | Initial creation from `/arckit:arc42-concepts` command | `[PENDING]` | `[PENDING]` |

> **About this document**: The rules, patterns and conventions that apply across the system's building blocks, which arc42 section 8 holds. Each concept records whether the architecture has decided it and which sources say so; the cited decisions and designs remain authoritative. Candidate approaches for an Open concept are proposals for an ADR to decide, not decisions.

---

## 1. Coverage Summary

| Status | Concepts |
|--------|----------|
| Decided | `[N]` |
| Partially decided | `[N]` |
| Open | `[N]` |
| Not applicable | `[N]` |
| Not assessed | `[N]` |

---

## 2. Concept Overview

`[One row per concept in the catalogue. Status is Decided, Partially decided, Open, Not applicable or Not assessed. Not applicable needs a cited source.]`

| Group | Concept | Status | Applies To | Sources |
|-------|---------|--------|------------|---------|
| Domain and data | Domain model | `[Status]` | `[Building blocks or All]` | `[ARC-xxx-DATA-vN.N]` |
| Domain and data | Persistence and data access | `[Status]` | `[Building blocks]` | `[Sources]` |
| Domain and data | Transactions and consistency | `[Status]` | `[Building blocks]` | `[Sources]` |
| Domain and data | Data protection and privacy | `[Status]` | `[Building blocks]` | `[Sources]` |
| Security | Identity and authentication | `[Status]` | `[Building blocks]` | `[Sources]` |
| Security | Authorisation | `[Status]` | `[Building blocks]` | `[Sources]` |
| Security | Secrets and key management | `[Status]` | `[Building blocks]` | `[Sources]` |
| Security | Encryption in transit and at rest | `[Status]` | `[Building blocks]` | `[Sources]` |
| Robustness | Error and exception handling | `[Status]` | `[Building blocks]` | `[Sources]` |
| Robustness | Resilience: retries, timeouts, idempotency, circuit breaking | `[Status]` | `[Building blocks]` | `[Sources]` |
| Communication | Integration and API style | `[Status]` | `[Building blocks]` | `[Sources]` |
| Communication | Messaging and events | `[Status]` | `[Building blocks]` | `[Sources]` |
| Operations | Logging, monitoring and tracing | `[Status]` | `[Building blocks]` | `[Sources]` |
| Operations | Configuration and feature management | `[Status]` | `[Building blocks]` | `[Sources]` |
| Operations | Backup, recovery and scaling | `[Status]` | `[Building blocks]` | `[Sources]` |
| Development | Build, test and deployment | `[Status]` | `[Building blocks]` | `[Sources]` |
| Development | Code structure and dependency rules | `[Status]` | `[Building blocks]` | `[Sources]` |
| User-facing | User interface patterns and accessibility | `[Status]` | `[Building blocks]` | `[Sources]` |
| User-facing | Internationalisation and localisation | `[Status]` | `[Building blocks]` | `[Sources]` |
| User-facing | Session and state handling | `[Status]` | `[Building blocks]` | `[Sources]` |

---

## 3. Concept Details

`[One subsection per concept that is Decided, Partially decided or Open, in the order of the overview. Not applicable and Not assessed concepts need no subsection.]`

### 3.1 `[Concept, e.g., Error and Exception Handling]`: `[Decided]`

**Rules**: `[The conventions every building block follows, summarised from the sources, e.g., "Services return problem-details responses (ADR-006); no stack trace leaves the service boundary (ARC-xxx-SECD-vN.N)."]`

**Applies to**: `[Building blocks, or All]`

**Sources**: `[ARC-xxx-ADR-006-vN.N, ARC-xxx-SECD-vN.N]`

**As built**: `[Only when a codebase audit exists: whether the code follows the rule, citing the audit finding, e.g., "Followed except in the notification service (F-007)."]`

### 3.2 `[Concept, e.g., Configuration and Feature Management]`: `[Open]`

**Why it is needed**: `[The requirement, quality scenario or risk that makes the concept necessary, e.g., "Staged rollout of new booking rules (FR-021)."]`

**Candidate approaches** (Proposed — not decided):

| Option | Main Trade-off |
|--------|----------------|
| `[e.g., Environment variables per deployment]` | `[Simple, but a change needs a redeployment]` |
| `[e.g., Managed configuration service with flags]` | `[Runtime changes, but a new dependency]` |

**Next step**: `/arckit:adr [PROJECT_ID] [Suggested decision title]`

---

## 4. System-Specific Concepts

`[Concepts a source settles that the catalogue does not list, such as multi-tenancy, offline working or an AI guardrail, with the same fields as section 3. Write "None" if there are none.]`

---

## Gap Register

| Concept | What Is Missing | Command to Fill It |
|---------|-----------------|--------------------|
| `[e.g., Configuration and feature management]` | `[No decision on runtime configuration]` | `[/arckit:adr [PROJECT_ID] Runtime configuration approach]` |

## Source Artefacts

| Document ID | Version | Informed |
|-------------|---------|----------|
| `[ARC-xxx-ADR-006-vN.N]` | `[N.N]` | `[Error and exception handling]` |

## Assumptions

`[List defaults taken for optional metadata or documents, or "None". These assumptions do not decide any concept.]`

---

## External References

> This section provides traceability from generated content back to source documents.
> Follow citation instructions in the project's citation reference guide.

### Document Register

| Doc ID | Filename | Type | Source Location | Description |
|--------|----------|------|-----------------|-------------|
| *None provided* | — | — | — | — |

### Citations

| Citation ID | Doc ID | Page/Section | Category | Quoted Passage |
|-------------|--------|--------------|----------|----------------|
| — | — | — | — | — |

### Unreferenced Documents

| Filename | Source Location | Reason |
|----------|-----------------|--------|
| — | — | — |

---

**Generated by**: ArcKit `/arckit:arc42-concepts` command
**Generated on**: `[DATE] [TIME] GMT`
**ArcKit Version**: `{ARCKIT_VERSION}`
**Project**: `[PROJECT_NAME]` (Project `[PROJECT_ID]`)
**Model**: `[AI_MODEL]`
