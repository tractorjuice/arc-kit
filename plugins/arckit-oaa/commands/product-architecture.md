---
description: Design product-centric architecture — cross-functional teams, backlog-driven delivery, product mission and outcomes
doc-type: OAPR
argument-hint: "<product name, e.g. 'Observability Stack', 'Loop Factory'>"
effort: high
handoffs:

  - command: agile-strategy
    description: Plan dual transformation for the product

  - command: agile-security
    description: Embed security into the product sprint rhythm
---

You are helping an enterprise architect create an **Agile Product Architecture** document using Open Agile Architecture (O-AA, C208), Ch. 14 Product Architecture. This approach is product-centric, outcome-driven, and team-led — the product is the organizing principle for the team, backlog, and architecture.

## User Input

```text
$ARGUMENTS
```

## Trigger Guidance

Use this command when **any** of the following conditions are met:

- Architecture work targets a **specific product** (not enterprise-wide transformation)

- Client wants **product-centric** architecture with clear outcomes and ownership

- Team structure needs to be **cross-functional** with permanent (not temporary project) teams

- Delivery is **backlog-driven** with continuous architecture evolution

- Product requires **O-AA axiom-based** design principles

**Do NOT use** when:

- Enterprise-wide architecture is needed (use `/arckit:adm-preliminary` instead)

- Multi-product portfolio rationalization (use `/arckit:application-rationalization` instead)

- Client requires traditional TOGAF documentation with full ADM audit trail

## Prerequisites: Read Foundational Artifacts

> **Note**: The ArcKit Project Context hook has already detected all projects, artifacts, external documents, and global policies. Use that context below — no need to scan directories manually.

**RECOMMENDED** (read if available, note if missing):

- **PRIN** (Architecture Principles, in 000-global) — Extract: Product architecture principles, technology standards, compliance requirements

  - If missing: warn user to run `/arckit:principles` first

- **OAAL** (O-AA ADM Lite) — Extract: Sprint plan, vision, scope, success criteria

  - If missing: note that O-AA Lite context is not available

- **BPCM** (Business Capability Map) — Extract: Product capabilities, value streams, capability ownership

  - If missing: note that capability context is limited

### Prerequisites 1b: Read external documents and policies

- Read any **external documents** listed in the project context (`external/` files) — extract product definitions, product roadmaps, team charter documents

- Read any **enterprise standards** in `projects/000-global/external/` — extract product architecture standards, team composition guidelines

## Instructions

### 1. Identify or Create Project

Identify the target project from the hook context. If the user specifies a project that doesn't exist yet, create a new project:

1. Use Glob to list `projects/*/` directories and find the highest `NNN-*` number (or start at `001` if none exist)
2. Calculate the next number (zero-padded to 3 digits, e.g., `002`)
3. Slugify the product name (lowercase, replace non-alphanumeric with hyphens, trim)
4. Use the Write tool to create `projects/{NNN}-{slug}/README.md` with the project name, ID, and date
5. Also create `projects/{NNN}-{slug}/external/README.md` with a note to place external reference documents here
6. Set `PROJECT_ID` = the 3-digit number, `PROJECT_PATH` = the new directory path

### 2. Read Template

**Read the template** (with user override support):

- **First**, check if `.arckit/templates-custom/product-architecture-template.md` exists in the project root

- **If found**: Read the user's customized template (user override takes precedence)

- **If not found**: Read `${CLAUDE_PLUGIN_ROOT}/templates/product-architecture-template.md` (default)

- **Then**, read `${CLAUDE_PLUGIN_ROOT}/templates/_partials/RENDERING.md` and resolve the template's `<!-- DOC-CONTROL-HEADER -->` marker to the Document Control partial it selects, applying the `${user_config.organisation_name}` and `${user_config.default_classification}` substitutions. Remove the marker and its comment from the output — a rendered artefact must never contain either.

- **Also** apply the O-AA placeholder substitutions in `${CLAUDE_PLUGIN_ROOT}/references/placeholder-substitutions.md` (`${user_config.project_issue_prefix}`, `${user_config.safety_checklist_id}`, `${user_config.references_dir}`) wherever they appear in the template.

> **Tip**: Users can customise templates with `/arckit:customize product-architecture`

### 3. O-AA Product Architecture Framework

O-AA product architecture practice (C208 Ch. 14) establishes that:

- **Product-centric**: The product is the organizing principle for the team, backlog, and architecture — not projects, not capabilities, not services (published as O-AA Axiom 15, Project to Product Shift)

- **Outcome-driven**: Architecture decisions trace to measurable product outcomes (value, adoption, experience)

- **Team-led**: Permanent, cross-functional teams own the product end-to-end (Axiom 6, Autonomous Cross-Functional Teams)

- **Backlog-driven**: Architecture evolves through the product backlog, not separate architecture workstreams

### 4. Shared Artefact Definitions

The product architecture command defines artefacts whose structure is inlined in `product-architecture-template.md`:

- **`product-architecture.yaml`** — product mission, outcomes, guardrails, team composition, backlog structure

- **`vision.yaml`** — architecture vision inherited from O-AA Lite or ADM Preliminary (`/arckit:oaa-adm-lite`, `/arckit:adm-preliminary`)

- **`implementation-strategy.yaml`** — implementation waves (consistent with `/arckit:transition-architecture`)

### 5. Generate Product Architecture Document

Create the Product Architecture document following the template structure.

#### Document Control

- Generate Document ID with `node scripts/generate-document-id.mjs {P} OAPR --filename` (canonical form: `ARC-{P}-OAPR-v1.0`)

- Set owner, dates, status, classification

- Review cycle: Per sprint cycle

#### Product Mission and Outcome

- One-sentence mission capturing the product's purpose and target value

- Outcome dimensions: Value, Adoption, Experience, Delivery cadence

- Product principles derived from O-AA axioms

#### Cross-Functional Team Composition

- Team structure with roles (Product Owner, Architect, Lead Engineer, AI Safety Engineer, DevOps, QA)

- Cadence: Sprint length, architecture review frequency, compliance review, demo schedule

- Architect role in the team: guardrails, technical decisions, compliance

#### Product Backlog Architecture

- Architecture items in the backlog (not separate architecture workstreams)

- Epic → Feature → Story hierarchy with architecture considerations

- Architecture decision records (ADRs) linked to backlog items

#### Architecture Guardrails

- Non-negotiable constraints (compliance, security, performance)

- Technology standards and approved building blocks

- Anti-patterns and forbidden approaches

#### Product Architecture Diagram

- Mermaid C4 Component diagram showing product components

- Integration points with other products and external systems

- Data flow and API boundaries

### 6. External References

Populate the `## External References` section per `${CLAUDE_PLUGIN_ROOT}/references/citation-instructions.md`. Every claim taken from an `external/` document, a `projects/000-global/external/` policy, or a web source MUST carry an inline `[DOC_ID-CN]` citation marker resolving to a Document Register row. The Open Group *Open Agile Architecture* standard (C208) MUST appear in the Document Register with its primary URL and the verification date.

### 7. Quality Gate

Before writing the file, read `${CLAUDE_PLUGIN_ROOT}/references/quality-checklist.md` and verify all **Common Checks** plus the **OAPR** per-type checks pass. Fix any failures before proceeding.

### 8. Write the Document

**IMPORTANT**: The Product Architecture document will be a substantial document (typically 200-350 lines). You MUST use the Write tool to create the file, NOT output the full content in chat.

Create the file at:

```text
projects/{P}/ARC-{P}-OAPR-v1.0.md
```

### 9. Show Summary to User

After writing the file, show a concise summary (NOT the full document):

```markdown
## Agile Product Architecture Created

**Document**: `projects/{P}/ARC-{P}-OAPR-v1.0.md`
**Document ID**: ARC-{P}-OAPR-v1.0

### Product Profile
- **Mission**: [One-sentence mission]

- **Outcomes**: [Value, Adoption, Experience targets]

- **Principles**: [N] product principles (O-AA axiom-derived)

### Team Composition
| Role | Name | Responsibility |
|------|------|---------------|
| [Role] | [Name] | [Responsibility] |

### Architecture Guardrails
- [N] non-negotiable constraints

- [N] technology standards

- [N] anti-patterns identified

### Sprint Artifacts
- ✅ product-architecture.yaml

- ✅ vision.yaml (from O-AA Lite or ADM Preliminary)

### Synthesised From
- [✅/⚠️] Architecture Principles: ARC-000-PRIN-v[N].md

- [✅/⚠️] Business Capability Map: ARC-{P}-BPCM-v[N].md

### Next Steps
1. Populate product backlog with architecture epics
2. Embed security into sprint rhythm: `/arckit:agile-security`
3. Plan dual transformation: `/arckit:agile-strategy`
4. Establish governance cadence: `/arckit:agile-governance`

**File location**: `projects/{P}/ARC-{P}-OAPR-v1.0.md`
```

## Important Notes

1. **Product-Centric**: O-AA mandates that the product (not the project or capability) is the organizing principle. Every architecture decision traces to the product's mission and outcomes.

2. **Sprint Artefacts**: The `product-architecture.yaml` and `vision.yaml` structures are defined inline in `product-architecture-template.md`. Validate artefacts against those structures; they stay consistent with the traditional TOGAF commands without sharing schema files.

3. **Use Write Tool**: The Product Architecture document is typically 200-350 lines. ALWAYS use the Write tool to create it.

4. **Permanent Teams**: O-AA requires permanent, cross-functional teams — not temporary project teams assembled for a specific engagement.

5. **Version Management**: If a product architecture document already exists (`ARC-*-OAPR-v*.md`), create a new version (v2.0) rather than overwriting.

6. **Markdown escaping**: When writing less-than or greater-than comparisons, always include a space after `<` or `>` (e.g., `< 3 seconds`, `> 99.9% uptime`) to prevent markdown renderers from interpreting them as HTML tags or emoji.
