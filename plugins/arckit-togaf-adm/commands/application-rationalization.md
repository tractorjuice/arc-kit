---
description: Rationalize application portfolio with keep/merge/replace/retire decisions
argument-hint: "<project ID, e.g. '001', 'portfolio rationalization'>"
effort: high
handoffs:
  - command: gap-analysis
    description: Analyze capability gaps from rationalization decisions
  - command: transition-architecture
    description: Plan migration work packages for rationalized applications
---

You are helping an enterprise architect rationalise the application portfolio using **keep/merge/replace/retire** decisions. This produces a portfolio-level rationalisation document (APPR) that informs transition planning and gap analysis.

## User Input

```text
$ARGUMENTS
```

## Prerequisites: Read Foundational Artifacts

> **Note**: The ArcKit Project Context hook has already detected all projects, artifacts, external documents, and global policies. Use that context below — no need to scan directories manually.

### MANDATORY (warn if missing)

- **APP** (Application Portfolio) — Extract: Application inventory, current state, capabilities served, technology stack, lifecycle status, business criticality, cost data, vendor dependencies
  - If missing: STOP and ask user to run `/arckit:app-inventory` (or equivalent APP command) first. Rationalisation requires an existing application inventory.

### RECOMMENDED (read if available, note if missing)

- **BPCM** (Business Capability Model) — Extract: Capability map, capability-to-application mapping, criticality ratings, future state capabilities
  - If missing: warn user but proceed. Capability alignment strengthens rationale.
- **ADR-*** (Architecture Decision Records) — Extract: Prior technology decisions, platform preferences, integration standards, retirement criteria
  - If missing: proceed with reasonable defaults.
- **ADMP** (ADM Preliminary) — Extract: Transformation vision, scope boundaries, strategic themes
- **PRIN** (Architecture Principles) — Extract: Technology standards, platform preferences, build-vs-buy stance
- **TRANS** (Transition Architecture) — Extract: Existing migration plans, work packages, sequencing constraints

### Prerequisites 2b: Read external documents and policies

- Read any **external documents** listed in the project context (`external/` files) — extract application rationalisation criteria, TCO models, vendor contracts, licensing data, retirement policies
- Read any **enterprise standards** in `projects/000-global/external/` — extract technology refresh policies, cloud migration strategy, application lifecycle standards
- If no external documents found but they would improve the output, ask: "Do you have application inventory spreadsheets, TCO models, or vendor contracts? I can read PDFs and Excel files directly. Place them in `projects/{project-dir}/external/` and re-run, or skip."
- **Citation traceability**: When referencing content from external documents, follow the citation instructions in `${CLAUDE_PLUGIN_ROOT}/references/citation-instructions.md`. Place inline citation markers (e.g., `[PP-C1]`) next to findings informed by source documents and populate the "External References" section in the template.

## Instructions

### 1. Identify the Project

Identify the target project from the hook context or user input. Extract the project ID (e.g., `001` from `projects/001-project-name`).

### 2. Read the Application Inventory

**Read APP artifacts** from `projects/{P}/ARC-{P}-APP-v*.md`:

- Extract the full application inventory: application ID, name, type, status, technology stack, lifecycle phase, owner, business criticality
- Map applications to capabilities (from BPCM if available)
- Note any applications already flagged for retirement or replacement

### 3. Read the Template

**Read the template** (with user override support):

- **First**, check if `.arckit/templates-custom/rationalization-template.md` exists in the project root
- **If found**: Read the user's customised template (user override takes precedence)
- **If not found**: Read `${CLAUDE_PLUGIN_ROOT}/templates/rationalization-template.md` (default)

> **Tip**: Users can customise templates with `/arckit:customize application-rationalization`

### 4. Gather Context via Questions

**Gathering rules** (apply to all user questions in this command):

- Ask the most important question first; fill in secondary details from context or reasonable defaults.
- **Maximum 2 rounds of questions total.** After that, infer the best answer from available context.
- If still ambiguous after 2 rounds, make a reasonable choice and note: *"I went with [X] — easy to adjust if you prefer [Y]."*

**Key questions** (ask only if context is insufficient):

- What is the target timeframe for portfolio rationalisation? (Default: 24 months)
- What are the key drivers for rationalisation? (e.g., cost reduction, cloud migration, security compliance)
- Are there any applications that are non-negotiable (must keep or must retire)?

### 5. Generate Rationalisation Decisions

For each application in the inventory, determine a rationalisation decision:

#### Decision Framework

| Decision | When to Use | Typical Rationale |
|----------|-----------|-------------------|
| **Keep** | Strategic fit, good condition, no duplication | Application is mission-critical, well-maintained, aligned to strategy |
| **Merge** | Overlapping functionality, duplicate capabilities | Two apps serve same capability — consolidate to one |
| **Replace** | Aging technology, strategic misalignment, high cost | Legacy platform needs modern replacement — same capability, better technology |
| **Retire** | No longer needed, superseded, excessive cost | Capability no longer required or moved to another system |

#### Per-Application Analysis

For each application, evaluate:

1. **Strategic Fit** — Does the application support strategic objectives?
   - Strategic (directly enables business outcomes)
   - Critical (essential for operations but not a differentiator)
   - Support (enables operations but easily replaceable)

2. **Technical Condition** — Current technology state
   - Modern (supported, cloud-native, low maintenance)
   - Aging (supported but legacy, moderate maintenance)
   - Legacy (end-of-life, high maintenance, known vulnerabilities)

3. **Business Value** — Current contribution to the enterprise
   - High (direct revenue or compliance impact)
   - Medium (indirect value, operational efficiency)
   - Low (minimal direct impact, potential duplicate)

4. **Cost Profile** — Total cost of ownership
   - License fees, maintenance contracts, infrastructure, support staff
   - Compare cost to delivered value

5. **Risk Factors** — Migration or retention risks
   - Data migration complexity
   - Business disruption potential
   - Vendor dependency
   - Integration dependencies

### 6. Consolidation Benefits Analysis

Calculate estimated benefits from each decision category:

- **License reduction**: Count eliminated or merged applications × average license cost
- **Maintenance savings**: Reduced FTE costs, support contracts, infrastructure
- **Operational efficiency**: Standardised platforms, fewer integration points
- **Security posture**: Fewer attack surface points, compliance alignment

### 7. Risk Register

For each rationalisation decision, identify migration risks:

| Risk Category | Description | Likelihood | Impact | Mitigation |
|--------------|-------------|-----------|--------|------------|
| Business disruption | Service outage during migration | [Low/Med/High] | [Low/Med/High] | [Mitigation plan] |
| Data loss | Migration of application data | [Low/Med/High] | [Low/Med/High] | [Mitigation plan] |
| Integration failure | Downstream system dependencies | [Low/Med/High] | [Low/Med/High] | [Mitigation plan] |
| Vendor dependency | Contract termination or non-cooperation | [Low/Med/High] | [Low/Med/High] | [Mitigation plan] |

### 8. Implementation Sequencing

Group rationalisation activities into implementation waves:

- **Wave 1 — Quick Wins**: Low-risk retirements, clear duplicate merges
- **Wave 2 — Foundation**: Platform standardisation, infrastructure readiness
- **Wave 3 — Transformation**: Major replacements, complex migrations
- **Wave 4 — Optimisation**: Final rationalisation, performance tuning

Consider dependencies between applications and capability requirements.

### 9. Auto-Populate Document Control Fields

Before completing the document, populate ALL document control fields in the header:

**Construct Document ID**:

- **Document ID**: `ARC-{P}-APPR-v{VERSION}` (e.g., `ARC-001-APPR-v1.0`)

**Populate Required Fields**:

*Auto-populated fields*:

- `[PROJECT_ID]` → Extract from project path (e.g., "001" from "projects/001-project-name")
- `[VERSION]` → "1.0" (or increment if previous version exists)
- `[DATE]` / `[YYYY-MM-DD]` → Current date in YYYY-MM-DD format
- `[DOCUMENT_TYPE_NAME]` → "Application Rationalisation"
- `[COMMAND]` → "arckit.application-rationalization"

*User-provided fields*:

- `[PROJECT_NAME]` → Full project name from project metadata or user input
- `[OWNER_NAME_AND_ROLE]` → Document owner (prompt user if not in metadata)
- `[CLASSIFICATION]` → Default to `${user_config.default_classification}`; if unavailable, use "OFFICIAL" for UK Gov, "PUBLIC" otherwise (or prompt user)

*Calculated fields*:

- `[YYYY-MM-DD]` for Review Date → Current date + 90 days

*Pending fields* (leave as `[PENDING]` until manually updated):

- `[REVIEWER_NAME]` → `[PENDING]`
- `[APPROVER_NAME]` → `[PENDING]`
- `[DISTRIBUTION_LIST]` → Default to "Project Team, Architecture Team, Application Owners" or `[PENDING]`

**Populate Revision History**:

```markdown
| 1.0 | {DATE} | ArcKit AI | Initial creation from `/arckit:application-rationalization` command | [PENDING] | [PENDING] |
```

**Populate Generation Metadata Footer**:

```markdown
**Generated by**: ArcKit `/arckit:application-rationalization` command
**Generated on**: {DATE} {TIME} GMT
**ArcKit Version**: {ARCKIT_VERSION}
**Project**: {PROJECT_NAME} (Project {P})
**AI Model**: [Use actual model name, e.g., "claude-sonnet-4-5-20250929"]
**Generation Context**: [Brief note about source documents used]
```

### 10. Quality Gate

Before writing the file, read `${CLAUDE_PLUGIN_ROOT}/references/quality-checklist.md` and verify all **Common Checks** plus the **APPR** per-type checks pass. Fix any failures before proceeding.

**APPR-specific quality requirements**:

- **Minimum 3 applications** with rationalisation decisions documented
- **Decision rationale present** for every application — no orphaned entries
- **Target state portfolio** documented with distribution breakdown
- **Consolidation benefits** quantified with estimated values
- **Risk register** populated with per-application migration risks
- **Implementation sequencing** includes wave assignments and timeline
- **Traceability** links APP → APPR → BPCM

### 11. Write the Rationalisation File

**IMPORTANT**: The Application Rationalisation document will be a substantial document (typically 150-300 lines). You MUST use the Write tool to create the file, NOT output the full content in chat.

Create the file at:

```text
projects/{P}/ARC-{P}-APPR-v1.0.md
```

Use the Write tool with the complete content following the template structure.

### 12. Show Summary to User

After writing the file, show a concise summary (NOT the full document):

```markdown
## Application Rationalisation Complete

**Document**: `projects/{P}/ARC-{P}-APPR-v1.0.md`
**Document ID**: ARC-{P}-APPR-v1.0

### Decision Summary
| Decision | Count | Applications |
|----------|-------|-------------|
| Keep | [N] | [List] |
| Merge | [N] | [List] |
| Replace | [N] | [List] |
| Retire | [N] | [List] |

### Portfolio Impact
- **Total applications assessed**: [N]
- **Estimated license reduction**: £[X]/year
- **Estimated maintenance savings**: £[X]/year
- **Implementation waves**: [N] waves planned

### Risks Identified
| # | Risk | Likelihood | Impact |
|---|------|-----------|--------|
| 1 | [Risk] | [Level] | [Level] |

### Implementation Sequencing
- **Wave 1**: [Quick wins] — [Start date] to [End date]
- **Wave 2**: [Foundation] — [Start date] to [End date]

### Synthesised From
- ✅ Application Portfolio: ARC-{P}-APP-v[N].md
- [✅/⚠️] Business Capability Model: ARC-{P}-BPCM-v[N].md
- [✅/⚠️] Architecture Decisions: ARC-{P}-ADR-*.md

### Next Steps
1. Review rationalisation decisions with Application Owners
2. Validate consolidation benefit estimates with Finance
3. Begin gap analysis for replaced applications: `/arckit:gap-analysis`
4. Plan transition work packages: `/arckit:transition-architecture`

**File location**: `projects/{P}/ARC-{P}-APPR-v1.0.md`
```

## Important Notes

1. **Decision Justification**: Every rationalisation decision must include clear rationale. A "Retire" decision without rationale is a governance failure. Document the "why" behind each choice.

2. **Capability Continuity**: When retiring or merging applications, verify that the capability they serve has a successor. Never leave a capability orphaned.

3. **Dependency Mapping**: Map application dependencies before making decisions. Retiring an upstream application without retiring downstream dependents causes operational failures.

4. **Cost vs. Value**: Always weigh Total Cost of Ownership against delivered business value. A high-cost, high-value application may be a strategic "Keep" even if it looks expensive in isolation.

5. **Stakeholder Alignment**: Application owners and business sponsors must review and approve rationalisation decisions before implementation. This document is a proposal, not a mandate.

6. **Version Management**: If a rationalisation document already exists (`ARC-{P}-APPR-v*.md`), create a new version (v2.0) rather than overwriting. Rationalisation decisions evolve as the portfolio changes.

7. **Integration with Other Commands**:
   - APPR feeds into: `/arckit:gap-analysis` (capability gaps from replacements), `/arckit:transition-architecture` (migration work packages)
   - APPR is informed by: APP (inventory), BPCM (capability alignment), ADR-* (decision history), PRIN (principles)

8. **UK Government Specifics**: If this is a UK Government project, include:
   - **Cabinet Office Application Portfolio Management**: Reference APP guidelines
   - **Cloud First/Cloud Only**: Align decisions with cloud policy
   - **G-Cloud/DOS procurement**: Consider procurement strategy for replacements
   - **Data Centre Strategy**: Reference exit timelines

9. **Markdown escaping**: When writing less-than or greater-than comparisons, always include a space after `<` or `>` (e.g., `< 3 seconds`, `> 99.9% uptime`) to prevent markdown renderers from interpreting them as HTML tags or emoji
