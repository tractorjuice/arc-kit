# Wardley Value Chain: {context_name}

> **Template Origin**: Official | **ArcKit Version**: [VERSION] | **Command**: `/arckit.wardley.value-chain`

## Document Control

<!-- DOC-CONTROL-HEADER -->
<!-- Resolved at command-execution time to _partials/document-control-uk.md or _partials/document-control-uae.md based on plugin userConfig classification_scheme + governance_framework. See _partials/RENDERING.md (when present). -->

## Revision History

| Version | Date | Author | Changes | Approved By | Approval Date |
|---------|------|--------|---------|-------------|---------------|
| [VERSION] | [DATE] | ArcKit AI | Initial creation from `/arckit.wardley.value-chain` command | PENDING | PENDING |

---

## Executive Summary

[Provide a concise summary of the value chain: its anchor (user need), the number of components, key dependencies, and the most critical strategic insights. 3-5 sentences.]

---

## User Need / Anchor

The anchor is the user need at the top of the chain — the reason the value chain exists. Every component below the anchor must ultimately serve this need. If the anchor is wrong, the entire chain is wrong.

**Anchor Statement**: [Describe the user need in one sentence, e.g., "Citizen can apply for a permit online without visiting an office."]

**Good Anchor Examples**:

- "User can access their medical records securely from any device"
- "Taxpayer can file a return in under 15 minutes"
- "Procurement team can evaluate vendor bids in a standardised format"

**Bad Anchor Examples** (too technology-focused, not user-centred):

- "System processes API calls" — this is a capability, not a user need
- "Database stores records" — this is infrastructure, not a user need
- "Microservices communicate via message bus" — this is implementation, not purpose

---

## Users and Personas

| Persona | Role | Primary Need |
|---------|------|--------------|
| {Persona 1} | {Role description} | {Primary need this chain serves} |
| {Persona 2} | {Role description} | {Primary need this chain serves} |
| {Persona 3} | {Role description} | {Primary need this chain serves} |

---

## Value Chain Diagram

**View this map**: Paste the OWM syntax below into [https://create.wardleymaps.ai](https://create.wardleymaps.ai)

**ASCII Placeholder**:

```text
Visibility
    ^
1.0 | [User Need / Anchor]
    |         |
0.7 |   [Capability A]  [Capability B]
    |         |               |
0.4 |   [Component C]  [Component D]  [Component E]
    |         |
0.1 |   [Infrastructure F]
    |
    +--Genesis--Custom--Product--Commodity-->  Evolution
       (0.0)   (0.25)  (0.50)   (0.75)  (1.0)
```

**OWM Syntax**:

```wardley
title {context_name} Value Chain
anchor {UserNeed} [0.95, 0.63]

component {CapabilityA} [0.70, 0.45]
component {CapabilityB} [0.70, 0.72]
component {ComponentC} [0.42, 0.38]
component {ComponentD} [0.40, 0.65]
component {ComponentE} [0.38, 0.80]
component {InfrastructureF} [0.12, 0.90]

{UserNeed} -> {CapabilityA}
{UserNeed} -> {CapabilityB}
{CapabilityA} -> {ComponentC}
{CapabilityA} -> {ComponentD}
{CapabilityB} -> {ComponentE}
{ComponentC} -> {InfrastructureF}

style wardley
```

<details>
<summary>Mermaid Value Chain Map (renders in GitHub, VS Code, and other Mermaid-enabled viewers)</summary>

> **Note**: Mermaid Wardley Maps use the `wardley-beta` keyword. This feature is in Mermaid's develop branch and may not render in all viewers yet. No sourcing decorators at the value chain stage — those are added when creating the full Wardley Map.

```mermaid
wardley-beta
title {context_name} Value Chain
size [1100, 800]

anchor {UserNeed} [0.95, 0.63]

component {CapabilityA} [0.70, 0.45]
component {CapabilityB} [0.70, 0.72]
component {ComponentC} [0.42, 0.38]
component {ComponentD} [0.40, 0.65]
component {ComponentE} [0.38, 0.80]
component {InfrastructureF} [0.12, 0.90]

{UserNeed} -> {CapabilityA}
{UserNeed} -> {CapabilityB}
{CapabilityA} -> {ComponentC}
{CapabilityA} -> {ComponentD}
{CapabilityB} -> {ComponentE}
{ComponentC} -> {InfrastructureF}
```

> When substituting placeholders, wrap the replacement in double quotes if it contains any character outside `[A-Za-z0-9_()& ]` (e.g. hyphens, dots, slashes) or starts with a digit. Simple multi-word names stay unquoted.

</details>

---

## Component Inventory

| ID | Component | Description | Depends On | Visibility (0.0-1.0) |
|----|-----------|-------------|------------|----------------------|
| C-01 | {Component 1} | {Description} | — | {0.00} |
| C-02 | {Component 2} | {Description} | C-01 | {0.00} |
| C-03 | {Component 3} | {Description} | C-01, C-02 | {0.00} |
| C-04 | {Component 4} | {Description} | C-02 | {0.00} |
| C-05 | {Component 5} | {Description} | C-03, C-04 | {0.00} |

---

## Dependency Matrix

The dependency matrix shows which components (rows) depend on which other components (columns). A cell marked **X** indicates a direct dependency; **I** indicates an indirect dependency; blank indicates no dependency.

| | C-01 | C-02 | C-03 | C-04 | C-05 |
|---|------|------|------|------|------|
| **C-01** | — | | | | |
| **C-02** | X | — | | | |
| **C-03** | X | X | — | | |
| **C-04** | | X | | — | |
| **C-05** | I | I | X | X | — |

[Replace placeholder rows/columns with actual component IDs from the Component Inventory above.]

---

## Critical Path Analysis

The critical path is the sequence of dependencies from the anchor down to the lowest-level infrastructure component(s), where a failure at any step breaks the chain entirely.

**Critical Path**:

```text
[User Need / Anchor]
  └─> [Component X]  (Visibility: 0.xx, Evolution: 0.xx)
        └─> [Component Y]  (Visibility: 0.xx, Evolution: 0.xx)
              └─> [Component Z]  (Visibility: 0.xx, Evolution: 0.xx)
```

**Bottlenecks and Single Points of Failure**:

| Component | Risk Type | Impact if Failed | Mitigation |
|-----------|-----------|------------------|------------|
| {Component} | Single vendor / Genesis fragility / Low maturity | {Impact description} | {Mitigation plan} |

**Resilience Gaps**:

- [ ] {Identify components with no fallback or redundancy}
- [ ] {Identify dependencies on Genesis-stage components}
- [ ] {Identify vendor lock-in on critical path}

---

## Validation Checklist

- [ ] Chain starts with user need (anchor)
- [ ] All critical dependencies captured
- [ ] Chain reaches commodity level
- [ ] No orphan components
- [ ] Dependencies reflect reality
- [ ] Visibility ordering correct
- [ ] Granularity appropriate for purpose

---

## Visibility Assessment

| Level | Range | Characteristics | Examples |
|-------|-------|-----------------|---------|
| **User-facing** | 0.90 - 1.00 | Directly experienced by the user; failure is immediately visible | Login page, search results, payment confirmation |
| **High** | 0.70 - 0.89 | Close to user; users notice degradation quickly | API gateway, authentication service, user profile |
| **Medium-High** | 0.50 - 0.69 | Indirectly visible; affects features users rely on | Business logic layer, data validation, reporting engine |
| **Medium** | 0.30 - 0.49 | Hidden from users but essential to operations; failure noticed over time | Caching layer, queue management, audit logging |
| **Low** | 0.10 - 0.29 | Invisible to users; operational/infrastructure concern | Database engine, message broker, network routing |
| **Infrastructure** | 0.00 - 0.09 | Deep infrastructure; users unaware it exists | Power supply, physical server, OS kernel |

---

## Assumptions and Open Questions

**Assumptions Made**:

| # | Assumption | Basis | Confidence |
|---|------------|-------|------------|
| A-01 | {Assumption 1} | {Evidence or rationale} | High / Medium / Low |
| A-02 | {Assumption 2} | {Evidence or rationale} | High / Medium / Low |

**Open Questions**:

| # | Question | Owner | Due Date |
|---|----------|-------|----------|
| Q-01 | {Open question 1} | {Owner} | [YYYY-MM-DD] |
| Q-02 | {Open question 2} | {Owner} | [YYYY-MM-DD] |

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

**Generated by**: ArcKit `/arckit.wardley.value-chain` command
**Generated on**: [DATE]
**ArcKit Version**: [VERSION]
**Project**: [PROJECT_NAME]
**Model**: [AI_MODEL]
