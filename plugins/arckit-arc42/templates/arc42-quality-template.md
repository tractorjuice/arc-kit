---
title: "Quality Scenarios"
docType: QUAL
templateVersion: "1.0"
license: CC-BY-SA-4.0
---

<!-- SPDX-License-Identifier: CC-BY-SA-4.0 -->

# Quality Scenarios: `[PROJECT_NAME]`

## Document Control

<!-- DOC-CONTROL-HEADER -->
<!-- Resolved at command-execution time per _partials/RENDERING.md. -->

<!-- Domain-specific fields, retained after the resolved header per the Document Control Standard. -->

| Field | Value |
|-------|-------|
| **Quality Goals** | `[N]` |
| **Quality Scenarios** | `[N]` |
| **Goals Without a Measurable Target** | `[N]` |

### Revision History

| Version | Date | Author | Changes | Approved By | Approval Date |
|---------|------|--------|---------|-------------|---------------|
| `[VERSION]` | `[YYYY-MM-DD]` | ArcKit AI | Initial creation from `/arckit:arc42-quality` command | `[PENDING]` | `[PENDING]` |

> **About this document**: The system's quality requirements in the form arc42 section 10 expects: a quality tree and measurable quality scenarios. Every goal, priority and target comes from the cited sources, which remain authoritative. Goals are classified by the dimensions of the [Q42 quality model](https://quality.arc42.org) by Gernot Starke, licensed [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/). The classification and this document's structure are adapted from Q42 by ArcKit contributors; no endorsement by Q42 or its author is implied. The project's goals, scenarios and targets are its own content.

---

## 1. Quality Tree

`[Group the quality goals by Q42 dimension, showing only dimensions that have at least one goal. Section 6 lists the coverage of all nine dimensions.]`

```text
Quality
├── #efficient
│   └── QG-01 [Booking confirmation at peak load] (NFR-P-001) → QS-001
├── #reliable
│   ├── QG-02 [Service availability] (NFR-A-001) → QS-002
│   └── QG-03 [Recovery after a regional outage] (NFR-A-002) → Target needed
└── #usable
    └── QG-04 [Accessibility] (NFR-U-002) → QS-003
```

---

## 2. Quality Goals

| ID | Quality Goal | Q42 Dimension | Priority | Top Goal | Source | Scenarios |
|----|--------------|---------------|----------|----------|--------|-----------|
| QG-01 | `[e.g., Booking confirmation is fast at peak load]` | `#efficient` | `[MUST_HAVE]` | `[Yes / No]` | `[NFR-P-001, ARC-xxx-REQ-vN.N]` | `[QS-001]` |
| QG-02 | `[Quality goal]` | `[#dimension]` | `[Priority]` | `[Yes / No]` | `[Source]` | `[QS-NNN or Target needed]` |

### 2.1 Top Quality Goals

`[The three to five goals arc42 section 1.2 summarises, in priority order. Say what the ranking is based on; if no source ranks them, mark the ranking "Inferred".]`

| Rank | Goal | Why It Ranks Here | Source |
|------|------|-------------------|--------|
| 1 | `[QG-NN]` | `[e.g., Highest stakeholder priority for residents]` | `[ARC-xxx-STKE-vN.N]` |

---

## 3. Quality Scenarios

`[One scenario per goal whose source states a measurable target. The response measure quotes the source's target exactly. Every scenario is marked "Inferred" and cites the requirement it comes from.]`

| ID | Type | Q42 Dimension | Stimulus (Source, Environment) | Response (Artefact) | Response Measure | Derived From |
|----|------|---------------|--------------------------------|---------------------|------------------|--------------|
| QS-001 | Usage | `#efficient` | `[A resident submits a booking, at peak load of 1,000 concurrent users]` | `[The booking is confirmed (Booking API)]` | `["95th percentile under 2 seconds" (NFR-P-001)]` | `[NFR-P-001] (Inferred)` |
| QS-002 | Failure | `[#dimension]` | `[Stimulus]` | `[Response]` | `[Quoted target]` | `[Requirement ID] (Inferred)` |
| QS-003 | Change | `[#dimension]` | `[Stimulus]` | `[Response]` | `[Quoted target]` | `[Requirement ID] (Inferred)` |

---

## 4. Goals Without a Measurable Target

| Goal | Q42 Dimension | What the Source Says | What Is Missing | Command to Fill It |
|------|---------------|----------------------|-----------------|--------------------|
| `[QG-03]` | `#reliable` | `["The service recovers quickly after an outage" (NFR-A-002)]` | `[A recovery time objective]` | `/arckit:requirements` |

---

## 5. Approaches and Verification

| Scenario | Approaches | Verification | Verification Status |
|----------|------------|--------------|---------------------|
| QS-001 | `[ADR-002: cache availability data at the edge]` | `[Load test at peak volume]` | `[Proposed / Stated in ARC-xxx-OPS-vN.N]` |
| QS-002 | `[No approach recorded]` | `[Failover drill]` | `[Proposed]` |

---

## 6. Dimension Coverage

| Q42 Dimension | Quality Goals | Scenarios | Without a Target | Notes |
|---------------|---------------|-----------|------------------|-------|
| `#reliable` | `[N]` | `[N]` | `[N]` | `[Notes]` |
| `#flexible` | `[N]` | `[N]` | `[N]` | `[Notes]` |
| `#maintainable` | `[N]` | `[N]` | `[N]` | `[Notes]` |
| `#efficient` | `[N]` | `[N]` | `[N]` | `[Notes]` |
| `#usable` | `[N]` | `[N]` | `[N]` | `[Notes]` |
| `#operable` | `[N]` | `[N]` | `[N]` | `[Notes]` |
| `#suitable` | `[N]` | `[N]` | `[N]` | `[Notes]` |
| `#secure` | `[N]` | `[N]` | `[N]` | `[Notes]` |
| `#safe` | `[N]` | `[N]` | `[N]` | `[Notes]` |

---

## 7. Trade-offs and Conflicts

`[Goals that pull against each other, or sources that disagree about a target. Do not resolve them here; an ADR decides.]`

| Goals or Sources | Tension | Sources | Suggested Decision |
|------------------|---------|---------|--------------------|
| `[QG-05 vs QG-06]` | `[Strong authentication against one-step booking]` | `[NFR-SEC-001, BR-004]` | `[/arckit:adr [PROJECT_ID] Authentication strength for booking]` |

---

## Gap Register

| Area | What Is Missing | Command to Fill It |
|------|-----------------|--------------------|
| `[e.g., QG-03 Recovery]` | `[No recovery time objective]` | `[/arckit:requirements]` |

## Source Artefacts

| Document ID | Version | Supplied |
|-------------|---------|----------|
| `[ARC-xxx-REQ-vN.N]` | `[N.N]` | `[NFRs and targets]` |

## Assumptions

`[List defaults taken for optional metadata or documents, or "None". These assumptions do not supply targets or priorities.]`

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

**Generated by**: ArcKit `/arckit:arc42-quality` command
**Generated on**: `[DATE] [TIME] GMT`
**ArcKit Version**: `{ARCKIT_VERSION}`
**Project**: `[PROJECT_NAME]` (Project `[PROJECT_ID]`)
**Model**: `[AI_MODEL]`
