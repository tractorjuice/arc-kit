---
description: Plan dual transformation with agile strategy canvas — legacy modernization alongside greenfield innovation
doc-type: OASTR
argument-hint: "<product or programme name, e.g. 'Observability Stack', 'enterprise AI transformation'>"
effort: high
handoffs:

  - command: agile-security
    description: Embed security into the dual transformation strategy

  - command: agile-governance
    description: Establish governance cadence for the transformation programme
---

You are helping an enterprise architect create an **Agile Strategy Canvas** using Open Agile Architecture (O-AA, C208) — Ch. 11 Agile Strategy. This approach focuses on dual transformation — modernizing legacy systems while simultaneously building new product capabilities — using agile strategy canvases that drive backlog-driven delivery.

## User Input

```text
$ARGUMENTS
```

## Trigger Guidance

Use this command when **any** of the following conditions are met:

- Client is pursuing **dual transformation** (legacy modernization + greenfield innovation simultaneously)

- Strategy needs to be **backlog-driven** rather than a static document on a shelf

- Client wants to map strategy to **product outcomes** rather than project deliverables

- **Agile strategy canvas** format preferred over traditional strategic plans (1-2 pages vs. 50+ pages)

- Client needs to sequence transformation waves while keeping legacy systems operational

**Do NOT use** when:

- Purely defensive transformation (no innovation component) — use `/arckit-togaf-adm:transition-architecture` instead

- Client requires a traditional multi-year strategic plan with 200+ page deliverables

- Single-product scope (use `/arckit-oaa:product-architecture` instead)

## Prerequisites: Read Foundational Artifacts

> **Note**: The ArcKit Project Context hook has already detected all projects, artifacts, external documents, and global policies. Use that context below — no need to scan directories manually.

**RECOMMENDED** (read if available, note if missing):

- **PRIN** (Architecture Principles, in 000-global) — Extract: Strategic principles, technology direction, investment priorities

  - If missing: warn user to run `/arckit:principles` first

- **OAAL** (O-AA ADM Lite) — Extract: Sprint plan, vision, scope, success criteria

  - If missing: note that O-AA Lite context is not available

- **OAPR** (Agile Product Architecture) — Extract: Product mission, outcomes, guardrails

  - If missing: note that product architecture context is limited

- **TRANS** (Transition Architecture) — Extract: Legacy systems, migration constraints, transition waves

  - If missing: note that transition context is limited

- **BPCM** (Business Capability Map) — Extract: Current capabilities, target capabilities, gap areas

  - If missing: note that capability context is limited

### Prerequisites 1b: Read external documents and policies

- Read any **external documents** listed in the project context (`external/` files) — extract strategic plans, transformation charters, business cases, investment proposals

- Read any **enterprise standards** in `projects/000-global/external/` — extract technology refresh policies, innovation frameworks, dual transformation methodologies

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

- **First**, check if `.arckit/templates-custom/agile-strategy-template.md` exists in the project root

- **If found**: Read the user's customized template (user override takes precedence)

- **If not found**: Read `${CLAUDE_PLUGIN_ROOT}/templates/agile-strategy-template.md` (default)

- **Then**, read `${CLAUDE_PLUGIN_ROOT}/templates/_partials/RENDERING.md` and resolve the template's `<!-- DOC-CONTROL-HEADER -->` marker to the Document Control partial it selects, applying the `${user_config.organisation_name}` and `${user_config.default_classification}` substitutions. Remove the marker and its comment from the output — a rendered artefact must never contain either.

- **Also** apply the O-AA placeholder substitutions in `${CLAUDE_PLUGIN_ROOT}/references/placeholder-substitutions.md` (`${user_config.project_issue_prefix}`, `${user_config.safety_checklist_id}`, `${user_config.references_dir}`) wherever they appear in the template.

> **Tip**: Users can customise templates with `/arckit:customize agile-strategy`

### 3. O-AA Agile Strategy Framework

O-AA agile strategy practice (C208 Ch. 11) establishes that:

- **Dual transformation**: Simultaneously run legacy modernization (defend) and greenfield innovation (attack) tracks

- **Strategy canvas**: Condense strategy into 1-2 pages — not a 50-page document nobody reads

- **Backlog-driven strategy**: Strategy items enter the product backlog as epics/features, not a separate workstream

- **Outcome-measured**: Strategy success measured by product outcomes (value, adoption, experience), not project milestones

- **O-AA Axiom 5 (Value Stream Alignment)**: strategy maps to value streams, so strategy and architecture stay in one system rather than splitting into two artefacts

### 4. Shared Artefact Definitions

The agile strategy canvas command defines artefacts whose structure is inlined in `agile-strategy-template.md`:

- **`strategy-canvas.yaml`** — the 1-2 page strategy canvas (segments, value proposition, channels, key activities, key resources, partnerships, cost)

- **`vision.yaml`** — architecture vision constraints inherited from O-AA Lite or ADM Preliminary (`/arckit-oaa:oaa-adm-lite`, `/arckit-togaf-adm:adm-preliminary`)

- **`implementation-strategy.yaml`** — transformation waves and sequencing (consistent with `/arckit-togaf-adm:transition-architecture`)

### 5. Generate Agile Strategy Canvas Document

Create the Agile Strategy Canvas document following the template structure.

#### Document Control

- Generate Document ID with `node scripts/generate-document-id.mjs {P} OASTR --filename` (canonical form: `ARC-{P}-OASTR-v1.0`)

- Set owner, dates, status, classification

- Review cycle: Per sprint cycle (align with O-AA sprint cadence)

#### Dual Transformation Canvas

- **Defend track**: Legacy modernization initiatives with clear outcomes

  - Legacy inventory with modernization priority (keep/modify/replace/retire)

  - Risk assessment for legacy dependencies

  - Minimal viable modernization per sprint

- **Attack track**: Greenfield innovation initiatives

  - New product capabilities with outcome targets

  - Innovation backlog items with architecture considerations

  - Experimentation framework with fast failure thresholds

#### Strategy Canvas (1-2 Pages)

- **Customer segments**: Who are we serving and what do they value?

- **Value proposition**: What outcome does the product deliver?

- **Channels**: How does value reach the customer?

- **Revenue/impact model**: How is value measured and captured?

- **Key activities**: What must we do to deliver?

- **Key resources**: What capabilities and platforms do we need?

- **Key partnerships**: What external dependencies exist?

- **Cost structure**: What is the investment profile?

#### Transformation Sequencing

- Wave 1: Quick wins with high impact, low complexity

- Wave 2: Core capability modernization

- Wave 3: Platform foundations for future innovation

- Dependencies between defend and attack tracks

#### Strategy-to-Backlog Mapping

- Strategy epics → Features → Stories with architecture considerations

- Architecture guardrails per epic

- O-AA published-axiom compliance per feature (cite number + name)

### 6. External References

Populate the `## External References` section per `${CLAUDE_PLUGIN_ROOT}/references/citation-instructions.md`. Every claim taken from an `external/` document, a `projects/000-global/external/` policy, or a web source MUST carry an inline `[DOC_ID-CN]` citation marker resolving to a Document Register row. The Open Group *Open Agile Architecture* standard (C208) MUST appear in the Document Register with its primary URL and the verification date.

### 7. Quality Gate

Before writing the file, read `${CLAUDE_PLUGIN_ROOT}/references/quality-checklist.md` and verify all **Common Checks** plus the **OASTR** per-type checks pass. Fix any failures before proceeding.

### 8. Write the Document

**IMPORTANT**: The Agile Strategy Canvas document will be a substantial document (typically 180-300 lines). You MUST use the Write tool to create the file, NOT output the full content in chat.

Create the file at:

```text
projects/{P}/ARC-{P}-OASTR-v1.0.md
```

### 9. Show Summary to User

After writing the file, show a concise summary (NOT the full document):

```markdown
## Agile Strategy Canvas Created

**Document**: `projects/{P}/ARC-{P}-OASTR-v1.0.md`
**Document ID**: ARC-{P}-OASTR-v1.0

### Dual Transformation Profile
- **Defend track**: [N] legacy modernization initiatives

- **Attack track**: [N] greenfield innovation initiatives

- **Transformation waves**: [N] waves sequenced

### Strategy Canvas Highlights
| Dimension | Summary |
|-----------|---------|
| Customer segments | [Brief] |
| Value proposition | [Brief] |
| Key activities | [Brief] |
| Key resources | [Brief] |

### Sprint Artifacts
- ✅ strategy-canvas.yaml

- ✅ vision.yaml (from O-AA Lite or ADM Preliminary)

### Synthesised From
- [✅/⚠️] Architecture Principles: ARC-000-PRIN-v[N].md

- [✅/⚠️] O-AA ADM Lite: ARC-{P}-OAAL-v[N].md

- [✅/⚠️] Product Architecture: ARC-{P}-OAPR-v[N].md

- [✅/⚠️] Transition Architecture: ARC-{P}-TRANS-v[N].md

### Next Steps
1. Populate product backlog with strategy epics
2. Embed security into strategy rhythm: `/arckit-oaa:agile-security`
3. Establish governance cadence: `/arckit-oaa:agile-governance`
4. Begin Sprint 1: `/arckit-oaa:product-architecture`

**File location**: `projects/{P}/ARC-{P}-OASTR-v1.0.md`
```

## Important Notes

1. **Dual Transformation**: O-AA Agile Strategy explicitly runs defend (legacy) and attack (innovation) tracks simultaneously. Do not sequentialize them — the value is in running them in parallel with shared backlogs.

2. **Strategy Canvas is Living**: The strategy canvas is not a static document. It updates each sprint cycle as outcomes are measured and the environment changes. Treat it as a backlog item, not a shelf artifact.

3. **Sprint Artefacts**: The `strategy-canvas.yaml` and `vision.yaml` structures are defined inline in `agile-strategy-template.md`. Validate artefacts against those structures; they stay consistent with the traditional TOGAF commands without sharing schema files.

4. **Use Write Tool**: The Agile Strategy Canvas document is typically 180-300 lines. ALWAYS use the Write tool to create it.

5. **Version Management**: If an Agile Strategy document already exists (`ARC-*-OASTR-v*.md`), create a new version (v2.0) rather than overwriting.

6. **Markdown escaping**: When writing less-than or greater-than comparisons, always include a space after `<` or `>` (e.g., `< 3 seconds`, `> 99.9% uptime`) to prevent markdown renderers from interpreting them as HTML tags or emoji.
