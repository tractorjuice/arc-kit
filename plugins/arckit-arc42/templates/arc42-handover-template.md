# SDD Handover Pack: `[PROJECT_NAME]`

## Document Control

<!-- DOC-CONTROL-HEADER -->
<!-- Resolved at command-execution time per _partials/RENDERING.md. -->

<!-- Domain-specific fields, retained after the resolved header per the Document Control Standard. -->

| Field | Value |
|-------|-------|
| **Built From** | `[ARC-xxx-ARC42-vN.N]` |
| **Feature Briefs** | `[N]` |
| **Requirements Carried** | `[N] of [N]` |

### Revision History

| Version | Date | Author | Changes | Approved By | Approval Date |
|---------|------|--------|---------|-------------|---------------|
| `[VERSION]` | `[YYYY-MM-DD]` | ArcKit AI | Initial creation from `/arckit:arc42-handover` command | `[PENDING]` | `[PENDING]` |

> **About this pack**: The inputs a Specification Driven Development tool needs to build this system, taken from the arc42 description and the artefacts behind it. ArcKit governs; the SDD tool builds. Every carried requirement, decision and principle is tagged with its ArcKit ID so traceability survives the handover, and the cited ArcKit artefacts remain authoritative.

---

## 1. How to Use This Pack

| Step | Spec Kit Step | Input From This Pack | ArcKit Sources |
|------|------------------|----------------------|----------------|
| 1 | `speckit.constitution` | Section 3, Constitution Input | PRIN, arc42 section 2, CONC |
| 2 | `speckit.specify` (one feature at a time) | Section 5, the feature's Specify Input | REQ, BKLG, STKE |
| 3 | `speckit.clarify` | The `[NEEDS CLARIFICATION]` markers in the spec | — |
| 4 | `speckit.plan` | The feature's Plan Input with Section 4, Shared Plan Context | arc42 sections 4 to 8, ADR, DATA |
| 5 | `speckit.tasks`, `speckit.implement`, `speckit.converge` | — | — |
| 6 | Evidence back into ArcKit | Section 6, Evidence Loop | — |

Spec Kit steps are named here by their logical names. How you invoke a step depends on your Spec Kit integration; use the form exposed by your installed integration:

| Integration | `speckit.specify` is invoked as |
|-------------|---------------------------------|
| GitHub Copilot, default skills mode | `/speckit-specify` |
| Codex, Command Code and ZCode skills | `$speckit-specify` |
| Kimi skills | `/skill:speckit-specify` |
| Integrations using slash-command notation | `/speckit.specify` |

The other steps follow the same pattern, for example `speckit.plan` as `/speckit-plan`, `$speckit-plan`, `/skill:speckit-plan` or `/speckit.plan`. The inputs in this pack are plain text and work with any of these forms.

---

## 2. Traceability Tags

- Every feature declares the ArcKit project it delivers with one ownership tag, `[ArcKit Project [PROJECT_ID]]`, as the first line of its Specify Input; Spec Kit copies that line into the spec. Requirement IDs repeat across projects, so `/arckit:traceability` credits a feature only when it carries this project's ownership tag and no other project's.
- Every carried item is tagged with its ArcKit ID: `[ArcKit FR-012]`, `[ArcKit NFR-P-001]`, `[ArcKit ADR-003]`, `[ArcKit EPIC-002]`, `[ArcKit Principle 4]`. Several IDs can share one tag: `[ArcKit FR-012, FR-013]`.
- Spec Kit numbers each feature's requirements (`FR-001`) and success criteria (`SC-001`) locally. Keep Spec Kit's local ID first and the ArcKit tag after the statement: `- **FR-001**: System MUST let a resident cancel a booking [ArcKit FR-012]`.
- Keep the tags, including the ownership tag, in `spec.md`, `plan.md` and `tasks.md`. `/arckit:traceability` reads them back from `specs/`, or from a separate delivery repository's specs folder passed as `SPECS=<path>`.

---

## 3. Constitution Input

`[Pass this block to speckit.constitution. Every rule cites its ArcKit source.]`

```text
# [PROJECT_NAME] Constitution

Derived from ArcKit document ARC-[PROJECT_ID]-SDDH-v[VERSION]. Change a principle or a decision in ArcKit first, then regenerate this pack.

## Core Principles

### I. [Principle name] [ArcKit Principle N]
- [Rule] MUST [...]
- [Rule] SHOULD [...]

## Constraints
- [Constraint] MUST [...] [ArcKit NFR-C-001]

## Conventions
- [Convention every feature follows] [ArcKit ADR-007]

## Governance
- This constitution derives from ArcKit. Changes to a principle or decision go through /arckit:principles or /arckit:adr before this file changes.
- Delivery evidence returns to ArcKit through /arckit:traceability, /arckit:conformance and /arckit:repo-audit.
```

---

## 4. Shared Plan Context

`[Add this block to every speckit.plan input. Accepted decisions only; list Proposed ADRs separately as not yet decided.]`

```text
Architecture every plan must follow (from ARC-[PROJECT_ID]-ARC42-v[N.N]):

Decided technology and patterns:
- [ArcKit ADR-001] [One-line decision]

Building blocks:
- [Building block]: [Responsibility]

Deployment:
- [Environment, hosting and topology]

Quality targets every feature meets:
- [ArcKit NFR-P-001] "[Target quoted exactly]"

Not yet decided:
- [ArcKit ADR-009] [Proposed decision]
```

---

## 5. Feature Briefs

`[One brief per epic, or per business requirement where there is no backlog (marked "Inferred"). Keep feature numbers stable across versions of this pack.]`

### Feature F-01: `[Epic name]` `[ArcKit EPIC-001]`

#### Specify Input

```text
[ArcKit Project [PROJECT_ID]]

[What to build and why, for whom, in natural language.]

Users: [Who uses it, from the stakeholder analysis]
Goal: [The outcome, from the business requirement] [ArcKit BR-002]

In scope:
- [Capability] [ArcKit FR-003]
- [Capability] [ArcKit FR-004]

Out of scope:
- [What this feature does not do]

Quality expectations:
- [ArcKit NFR-P-001] "[Target quoted exactly]"

[NEEDS CLARIFICATION: question the sources leave open]
```

#### Requirements Carried

| ArcKit ID | Requirement | Priority | Acceptance Criteria |
|-----------|-------------|----------|---------------------|
| `[FR-003]` | `[Summary]` | `[MUST_HAVE]` | `[From REQ, or "None stated"]` |

#### Success Criteria Candidates

| Candidate | Target | Source |
|-----------|--------|--------|
| `[e.g., Booking confirmed at peak load]` | `["95th percentile under 2 seconds"]` | `[NFR-P-001, QS-001]` |

#### Plan Input

```text
Follow the Shared Plan Context, plus:

Building blocks touched: [Building blocks]
Constraining decisions and concepts: [ArcKit ADR-002] [ArcKit ADR-006]
Data entities: [Entities from the data model]
Integrations: [ArcKit INT-001] [Contract or interface]
```

#### Debt to Avoid

`[DEBT items affecting this feature's building blocks, by ID, e.g., TD-001. Omit this subsection when there is no technical debt register.]`

---

## 6. Evidence Loop

1. After `speckit.implement` and `speckit.converge`, run `/arckit:traceability [PROJECT_ID]`, adding `SPECS=<path>` when the delivery repository is separate. It reads the `[ArcKit ...]` tags in the specs, traces each requirement to the features this project owns and their tasks, and lists features without exactly one matching ownership tag as gaps.
2. Run `/arckit:conformance [PROJECT_ID]`. It checks each `specs/*/plan.md` and the constitution against the ADRs and principles.
3. Run `/arckit:repo-audit <repository>` on the delivered code.
4. Record any decision taken during delivery that changes the architecture with `/arckit:adr`, then re-run `/arckit:arc42` and `/arckit:arc42-handover`.

---

## Gap Register

| Area | What Is Missing | Command to Fill It |
|------|-----------------|--------------------|
| `[e.g., Feature F-03]` | `[Grouped from BR-004 without a backlog epic (Inferred)]` | `[/arckit:backlog]` |

## Source Artefacts

| Document ID | Version | Feeds |
|-------------|---------|-------|
| `[ARC-xxx-ARC42-vN.N]` | `[N.N]` | `[Constitution, Shared Plan Context]` |
| `[ARC-xxx-REQ-vN.N]` | `[N.N]` | `[Feature briefs]` |

## Assumptions

`[List defaults taken for optional metadata, documents or epic selection, or "None". These assumptions do not add requirements or decisions.]`

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

**Generated by**: ArcKit `/arckit:arc42-handover` command
**Generated on**: `[DATE] [TIME] GMT`
**ArcKit Version**: `{ARCKIT_VERSION}`
**Project**: `[PROJECT_NAME]` (Project `[PROJECT_ID]`)
**Model**: `[AI_MODEL]`
