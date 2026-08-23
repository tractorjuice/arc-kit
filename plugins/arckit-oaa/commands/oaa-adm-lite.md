---
description: Maps TOGAF ADM cycle to agile sprints — rapid architecture delivery in 2-4 week engagement windows
doc-type: OAAL
argument-hint: "<project ID or name, e.g. '001', 'rapid AI architecture vision'>"
effort: medium
handoffs:

  - command: product-architecture
    description: Design product-centric architecture for the target product

  - command: agile-strategy
    description: Plan dual transformation with agile strategy canvas

  - command: agile-security
    description: Embed security into the sprint rhythm

  - command: agile-governance
    description: Establish governance cadence for the programme
---

You are helping an enterprise architect create an **O-AA ADM Lite** architecture using Open Agile Architecture (O-AA, C208) mapped to TOGAF ADM phases across agile sprints. This approach compresses the full ADM cycle into a sprint-driven engagement suitable for rapid delivery windows.

## User Input

```text
$ARGUMENTS
```

## Trigger Guidance

Use this command when **any** of the following conditions are met:

- Client engagement has a **hard timeline under 8 weeks** for architecture + initial delivery

- Client operates in **agile/sprint-driven** development culture

- First engagement with a client — rapid architecture vision needed before scoping sprints

- Client requires TOGAF alignment but cannot sustain traditional ADM cadence (quarterly architecture boards, 200-page deliverables)

**Do NOT use** when:

- Full regulatory audit trail is required (use `/arckit-togaf-adm:adm-preliminary` with full ADM workflow instead)

- Multi-year enterprise transformation with 50+ stakeholder review gates

- Architecture baseline phase requires extensive current-state assessment (> 4 weeks)

## Prerequisites: Read Foundational Artifacts

> **Note**: The ArcKit Project Context hook has already detected all projects, artifacts, external documents, and global policies. Use that context below — no need to scan directories manually.

**RECOMMENDED** (read if available, note if missing):

- **PRIN** (Architecture Principles, in 000-global) — Extract: Guiding principles, decision framework, technology standards

  - If missing: warn user to run `/arckit:principles` first. Even O-AA Lite benefits from established principles.

- **ADMP** (ADM Preliminary / Architecture Vision) — Extract: Existing scope, drivers, constraints if a preliminary ADM was already done

  - If missing: note that Sprint 0 will establish vision from scratch

### Prerequisites 1b: Read external documents and policies

- Read any **external documents** listed in the project context (`external/` files) — extract existing vision documents, strategic plans, enterprise architecture mandates

- Read any **enterprise standards** in `projects/000-global/external/` — extract architecture vision statements, enterprise transformation plans, cross-project alignment documents

## Instructions

### 1. Identify or Create Project

Identify the target project from the hook context. If the user specifies a project that doesn't exist yet, create a new project:

1. Use Glob to list `projects/*/` directories and find the highest `NNN-*` number (or start at `001` if none exist)
2. Calculate the next number (zero-padded to 3 digits, e.g., `002`)
3. Slugify the project name (lowercase, replace non-alphanumeric with hyphens, trim)
4. Use the Write tool to create `projects/{NNN}-{slug}/README.md` with the project name, ID, and date
5. Also create `projects/{NNN}-{slug}/external/README.md` with a note to place external reference documents here
6. Set `PROJECT_ID` = the 3-digit number, `PROJECT_PATH` = the new directory path

### 2. Read Template

**Read the template** (with user override support):

- **First**, check if `.arckit/templates-custom/oaa-adm-lite-template.md` exists in the project root

- **If found**: Read the user's customized template (user override takes precedence)

- **If not found**: Read `${CLAUDE_PLUGIN_ROOT}/templates/oaa-adm-lite-template.md` (default)

- **Then**, read `${CLAUDE_PLUGIN_ROOT}/templates/_partials/RENDERING.md` and resolve the template's `<!-- DOC-CONTROL-HEADER -->` marker to the Document Control partial it selects, applying the `${user_config.organisation_name}` and `${user_config.default_classification}` substitutions. Remove the marker and its comment from the output — a rendered artefact must never contain either.

- **Also** apply the O-AA placeholder substitutions in `${CLAUDE_PLUGIN_ROOT}/references/placeholder-substitutions.md` (`${user_config.project_issue_prefix}`, `${user_config.safety_checklist_id}`, `${user_config.references_dir}`) wherever they appear in the template.

> **Tip**: Users can customise templates with `/arckit:customize oaa-adm-lite`

### 3. Sprint Map

The O-AA ADM Lite maps the TOGAF ADM cycle to agile sprints:

| Sprint | TOGAF Phases | Focus | Duration | Key Output |
|--------|-------------|-------|----------|------------|
| Sprint 0 | ADM-P + A | Vision + Stakeholders | 1 week | `vision.yaml` |
| Sprint 1 | ADM-B + C (part) | Business + Data Architecture | 2 weeks | `business-architecture.yaml`, `data-architecture.yaml` |
| Sprint 2 | ADM-C (part) + D | Technology Architecture | 2 weeks | `technology-architecture.yaml` |
| Sprint 3 | ADM-E + F | Implementation Wave | 2 weeks | `implementation-strategy.yaml` |
| Sprint 4+ | ADM-G + H | Governance + Change | Ongoing | `governance-report.yaml`, `change-request.yaml` |

### 4. O-AA Axiom Alignment

Every O-AA deliverable must reference the relevant O-AA axioms:

- **Axiom 1:** "The purpose of architecture is to improve the organisation."

- **Axiom 2:** "An organisation cannot have a strategy without an architecture."

- **Axiom 3:** "Architecture must be product-centric."

- **Axiom 4:** "Architecture must be fit for purpose."

- **Axiom 5:** "Architecture is a means to an end, not an end in itself."

- **Axiom 6:** "Architecture is a shared asset."

- **Axiom 7:** "Architecture is the property of the whole organisation."

### 5. Shared Schema Definitions

O-AA commands reuse schema definitions across TOGAF and O-AA workflows:

- **`vision.yaml`** — Architecture vision, scope, drivers, constraints (shared with `/arckit-togaf-adm:adm-preliminary`)

- **`implementation-strategy.yaml`** — Implementation waves, migration strategy (shared with `/arckit-togaf-adm:transition-architecture`)

- **`stakeholder-map.md`** — Stakeholder roles, concerns, compliance mapping

Validate outputs against shared schemas:

- `schemas/vision.json` — Vision document schema

- `schemas/implementation-strategy.json` — Implementation strategy schema

### 6. Generate O-AA ADM Lite Document

Create the O-AA ADM Lite document following the template structure.

#### Document Control

- Generate Document ID: `ARC-{P}-OAAL-v1.0` (for filename: `ARC-{P}-OAAL-v1.0.md`)

- Set owner, dates, status, classification

- Review cycle: Per sprint cycle

#### Sprint Plan

- Define sprint duration (default: 2 weeks)

- Map each sprint to TOGAF ADM phases

- Specify deliverables per sprint with schema validation commands

- Include sprint-level acceptance criteria

#### Sprint 0: Vision + Stakeholders

- Use `vision.yaml` schema

- Map stakeholders to concerns and compliance requirements

- Define success criteria with measurable targets

- Architecture contract: deliverable format and handoff process

#### Sprint 1-2: Architecture Design

- Business + Data Architecture (Sprint 1)

- Technology Architecture (Sprint 2)

- Each sprint produces schema-validated YAML artifacts

#### Sprint 3: Implementation Wave

- Use `implementation-strategy.yaml` schema

- Define migration approach, work packages, sequencing

- Risk assessment per work package

#### Sprint 4+: Governance + Change

- Lightweight governance cadence (sprint reviews, not quarterly boards)

- Continuous compliance evidence

- Architecture change requests via `/arckit-togaf-adm:architecture-change`

### 7. External References

Populate the `## External References` section per `${CLAUDE_PLUGIN_ROOT}/references/citation-instructions.md`. Every claim taken from an `external/` document, a `projects/000-global/external/` policy, or a web source MUST carry an inline `[DOC_ID-CN]` citation marker resolving to a Document Register row. The Open Group *Open Agile Architecture* standard (C208) MUST appear in the Document Register with its primary URL and the verification date.

### 8. Quality Gate

Before writing the file, read `${CLAUDE_PLUGIN_ROOT}/references/quality-checklist.md` and verify all **Common Checks** plus the **OAAL** per-type checks pass. Fix any failures before proceeding.

### 9. Write the Document

**IMPORTANT**: The O-AA ADM Lite document will be a substantial document (typically 150-300 lines). You MUST use the Write tool to create the file, NOT output the full content in chat.

Create the file at:

```text
projects/{P}/ARC-{P}-OAAL-v1.0.md
```

### 10. Show Summary to User

After writing the file, show a concise summary (NOT the full document):

```markdown
## O-AA ADM Lite Created

**Document**: `projects/{P}/ARC-{P}-OAAL-v1.0.md`
**Document ID**: ARC-{P}-OAAL-v1.0

### Sprint Plan
| Sprint | TOGAF Phases | Focus | Duration | Deliverable |
|--------|-------------|-------|----------|-------------|
| Sprint 0 | ADM-P + A | Vision + Stakeholders | 1 week | vision.yaml |
| Sprint 1 | ADM-B + C | Business + Data Arch | 2 weeks | business-architecture.yaml |
| Sprint 2 | ADM-C + D | Technology Arch | 2 weeks | technology-architecture.yaml |
| Sprint 3 | ADM-E + F | Implementation | 2 weeks | implementation-strategy.yaml |
| Sprint 4+ | ADM-G + H | Governance | Ongoing | governance-report.yaml |

### Shared Schemas
- ✅ vision.yaml → schemas/vision.json

- ✅ implementation-strategy.yaml → schemas/implementation-strategy.json

### O-AA Axioms Applied
- [List relevant axioms with brief rationale]

### Synthesised From
- [✅/⚠️] Architecture Principles: ARC-000-PRIN-v[N].md

- [✅/⚠️] ADM Preliminary: ARC-{P}-ADMP-v[N].md

### Next Steps
1. Begin Sprint 0: Stakeholder workshops + vision definition
2. Validate vision.yaml against schema: `python validate-architecture.py vision.yaml --phase vision`
3. Continue to Sprint 1: `/arckit-oaa:product-architecture`
4. Plan dual transformation: `/arckit-oaa:agile-strategy`

**File location**: `projects/{P}/ARC-{P}-OAAL-v1.0.md`
```

## Important Notes

1. **O-AA vs Traditional TOGAF**: This is a lightweight, sprint-driven approach. It preserves TOGAF ADM structure but compresses the timeline and deliverable format. Do not use for regulated engagements requiring full ADM audit trails.

2. **Shared Schemas**: The `vision.yaml` and `implementation-strategy.yaml` schemas are shared between O-AA and traditional TOGAF commands. This ensures consistency regardless of which approach the client selects.

3. **Product-Centric**: O-AA mandates product-centric architecture (Axiom 3). The organizing principle is the product, not capabilities or services.

4. **Use Write Tool**: The O-AA ADM Lite document is typically 150-300 lines. ALWAYS use the Write tool to create it.

5. **Version Management**: If an O-AA ADM Lite document already exists (`ARC-*-OAAL-v*.md`), create a new version (v2.0) rather than overwriting.

6. **Markdown escaping**: When writing less-than or greater-than comparisons, always include a space after `<` or `>` (e.g., `< 3 seconds`, `> 99.9% uptime`) to prevent markdown renderers from interpreting them as HTML tags or emoji.
