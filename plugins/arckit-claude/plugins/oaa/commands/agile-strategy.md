---
description: Plan dual transformation with agile strategy canvas — digital transformation alongside agile transformation
doc-type: OASTR
argument-hint: "<product or programme name, e.g. 'Observability Stack', 'enterprise AI transformation'>"
effort: high
handoffs:

  - command: agile-security
    description: Embed security into the dual transformation strategy

  - command: agile-governance
    description: Establish governance cadence for the transformation programme
allowed-tools:
  - Read(/${CLAUDE_PLUGIN_ROOT}/**)
  - Bash(node ${CLAUDE_PLUGIN_ROOT}/scripts/generate-document-id.mjs *)
  - Bash(node "${CLAUDE_PLUGIN_ROOT}/scripts/generate-document-id.mjs" *)
---

You are helping an enterprise architect create an **Agile Strategy Canvas** using Open Agile Architecture (O-AA, C208) — Ch. 11 Agile Strategy. This approach plans the dual transformation C208 is written for — the Digital Transformation of the enterprise together with its Agile Transformation — on a canvas that drives backlog-driven delivery.

## User Input

```text
$ARGUMENTS
```

## Trigger Guidance

Use this command when **any** of the following conditions are met:

- Client is pursuing a **dual transformation** in the O-AA sense: digital transformation (technology, product, operating model) together with agile transformation (organizational, cultural, team agility)

- Strategy needs to be **backlog-driven** rather than a static document on a shelf

- Client wants to map strategy to **product outcomes** rather than project deliverables

- **Agile strategy canvas** format preferred over traditional strategic plans (1-2 pages vs. 50+ pages)

- Client needs to sequence transformation waves while keeping legacy systems operational

**Do NOT use** when:

- Technology migration with no product, operating-model or organizational change — use `/arckit-togaf-adm:transition-architecture` instead

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

- **STKE** (Stakeholder Analysis) — Extract: Stakeholder drivers, goals and measures the strategy must serve

  - If missing: note that strategy traceability to stakeholder goals is limited, and suggest `/arckit:stakeholders`

- **REQ** (Requirements) — Extract: Business requirements (BR) and the business drivers behind them

  - If missing: note that strategy traceability to business requirements is limited, and suggest `/arckit:requirements`

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

- **Dual transformation**: C208 covers the Digital Transformation of the enterprise together with its Agile Transformation (C208 Ch. 1 and Ch. 3). The canvas therefore has two dimensions — digital (technology, product, operating model) and agile (organizational, cultural, team agility) — planned together. Legacy modernization is part of the technology area of the digital dimension, not a separate track

- **Agile strategy tenets**: C208 Ch. 11 frames agile strategy through six tenets — grasp the situation, frame strategy around hard-to-reverse choices, anticipate unintended consequences, strategy is a journey, mix stability and dynamism, and do not deploy strategy in silos — and covers strategy deployment. Use them to test the canvas's choices; cite them by title and do not quote text you cannot verify against C208

- **Strategy canvas**: Condense strategy into 1-2 pages — not a 50-page document nobody reads

- **Backlog-driven strategy**: Strategy items enter the product backlog as epics/features, not a separate workstream

- **Outcome-measured**: Strategy success measured by product outcomes (value, adoption, experience), not project milestones

- **O-AA Axiom 5 (Value Stream Alignment)**: strategy maps to value streams, so strategy and architecture stay in one system rather than splitting into two artefacts

### 4. Shared Artefact Definitions

The agile strategy canvas command defines artefacts whose structure is inlined in `agile-strategy-template.md`:

- **`strategy-canvas.yaml`** — the structured canvas: technology, product and operating-model transformation; organizational, cultural and team agility; design principles; resilience mapping; transformation waves; strategy-to-backlog mapping

It also reads two artefacts it does not define:

- **`vision.yaml`** — architecture vision constraints from O-AA ADM Lite (structure inlined in `oaa-adm-lite-template.md`) or the ADM Preliminary
- **`implementation-strategy.yaml`** — implementation waves from O-AA ADM Lite Sprint 3 (consistent with `/arckit-togaf-adm:transition-architecture`)

### 5. Generate Agile Strategy Canvas Document

Create the Agile Strategy Canvas document following the template structure.

#### Document Control

- Generate Document ID with `node ${CLAUDE_PLUGIN_ROOT}/scripts/generate-document-id.mjs {P} OASTR {VERSION} --filename` (canonical form: `ARC-{P}-OASTR-v{VERSION}`) Work out `{VERSION}` first with `${CLAUDE_PLUGIN_ROOT}/references/version-detection.md`: a re-run writes the next version beside the earlier file, never over it.

- Set owner, dates, status, classification

- Review cycle: Per sprint cycle (align with O-AA sprint cadence)

#### Digital Transformation Dimension (template Section 1)

- **Technology**: Current and target state, migration approach (strangler, dual-run, big-bang), technology risks, enabling technologies. Legacy systems from TRANS sit here, each with a modernization decision (keep/modify/replace/retire)

- **Product**: Current and target product model (project-based to permanent product teams), product outcomes, value streams mapped to product teams

- **Operating model**: Current and target operating model, capability gaps, platform strategy, and the funding model (project budgets to product or value-stream funding)

#### Agile Transformation Dimension (template Section 2)

- **Organizational agility**: Decision rights by level (team, cross-team, executive) and the governance model

- **Cultural agility**: Target culture, change initiatives, success indicators

- **Team agility**: Target team topology and composition, agile practices, flow metrics

#### Axiom-Based Design Principles and Resilience (template Sections 3-4)

- Design principles, each derived from a published O-AA axiom cited by number and name, with rationale, implications and exceptions

- Resilience targets (RTO/RPO) per threat, tagged to the transformation dimension they belong to

#### Transformation Wave Plan (template Section 5)

- Waves that combine digital and agile activities, run together rather than one after the other

- Each wave states the outcome it buys and the measure that would show it worked

- Resilience milestones and governance gates per wave; dependencies between digital and agile activities

#### Strategy-to-Backlog Mapping (template Section 6)

- Strategy epics → Features → Stories with architecture considerations

- Architecture guardrails per epic

- O-AA published-axiom compliance per feature (cite number + name)

- Each epic traces to a stakeholder goal (STKE) or business requirement (REQ) where available

### 6. External References

Populate the `## External References` section per `${CLAUDE_PLUGIN_ROOT}/references/citation-instructions.md`. Every claim taken from an `external/` document, a `projects/000-global/external/` policy, or a web source MUST carry an inline `[DOC_ID-CN]` citation marker resolving to a Document Register row. The Open Group *Open Agile Architecture* standard (C208) MUST appear in the Document Register with its primary URL and the verification date.

### 7. Quality Gate

Before writing the file, read `${CLAUDE_PLUGIN_ROOT}/references/quality-checklist.md` and verify all **Common Checks** plus the **OASTR** per-type checks pass. Fix any failures before proceeding.

### 8. Write the Document

**IMPORTANT**: The Agile Strategy Canvas document will be a substantial document (typically 180-300 lines). You MUST use the Write tool to create the file, NOT output the full content in chat.

Create the file at:

```text
projects/{P}/ARC-{P}-OASTR-v{VERSION}.md
```

### 9. Show Summary to User

After writing the file, show a concise summary (NOT the full document):

```markdown
## Agile Strategy Canvas Created

**Document**: `projects/{P}/ARC-{P}-OASTR-v{VERSION}.md`
**Document ID**: ARC-{P}-OASTR-v{VERSION}

### Dual Transformation Profile
- **Digital transformation**: [Technology, product and operating-model shifts in brief]

- **Agile transformation**: [Organizational, cultural and team agility shifts in brief]

- **Transformation waves**: [N] waves sequenced

### Strategy Canvas Highlights
| Area | Summary |
|------|---------|
| Technology | [Brief] |
| Product | [Brief] |
| Operating model | [Brief] |
| Organizational, cultural and team agility | [Brief] |

### Sprint Artifacts
- ✅ strategy-canvas.yaml

- ✅ vision.yaml (from O-AA Lite or ADM Preliminary)

### Synthesised From
- [✅/⚠️] Architecture Principles: ARC-000-PRIN-v[N].md

- [✅/⚠️] Stakeholder Analysis: ARC-{P}-STKE-v[N].md

- [✅/⚠️] Requirements: ARC-{P}-REQ-v[N].md

- [✅/⚠️] O-AA ADM Lite: ARC-{P}-OAAL-v[N].md

- [✅/⚠️] Product Architecture: ARC-{P}-OAPR-v[N].md

- [✅/⚠️] Transition Architecture: ARC-{P}-TRANS-v[N].md

- [✅/⚠️] Business Capability Map: ARC-{P}-BPCM-v[N].md

### Next Steps
1. Populate product backlog with strategy epics
2. Embed security into strategy rhythm: `/arckit-oaa:agile-security`
3. Establish governance cadence: `/arckit-oaa:agile-governance`
4. If the canvas changes product outcomes, refresh the product architecture: `/arckit-oaa:product-architecture`

**File location**: `projects/{P}/ARC-{P}-OASTR-v{VERSION}.md`
```

## Important Notes

1. **Dual Transformation**: C208's premise is that organizational agility is a key enabler of digital transformation. Plan the digital and agile dimensions together in each wave; do not defer the agile transformation to a later phase.

2. **Strategy Canvas is Living**: The strategy canvas is not a static document. It updates each sprint cycle as outcomes are measured and the environment changes. Treat it as a backlog item, not a shelf artifact.

3. **Sprint Artefacts**: The `strategy-canvas.yaml` structure is defined inline in `agile-strategy-template.md`; `vision.yaml` is defined in `oaa-adm-lite-template.md`. Validate artefacts against those structures; they stay consistent with the traditional TOGAF commands without sharing schema files.

4. **Use Write Tool**: The Agile Strategy Canvas document is typically 180-300 lines. ALWAYS use the Write tool to create it.

5. **Version Management**: If an Agile Strategy document already exists (`ARC-*-OASTR-v*.md`), create a new version (v2.0) rather than overwriting.

6. **Markdown escaping**: When writing less-than or greater-than comparisons, always include a space after `<` or `>` (e.g., `< 3 seconds`, `> 99.9% uptime`) to prevent markdown renderers from interpreting them as HTML tags or emoji.
