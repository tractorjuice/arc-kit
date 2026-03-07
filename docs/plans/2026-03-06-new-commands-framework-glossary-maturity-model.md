# Design: 3 New ArcKit Commands (Framework, Glossary, Maturity Model)

**Date**: 2026-03-06
**Status**: Approved
**Origin**: Analysis of [arckit-test-project-v20-uae-moi-ipad](https://github.com/tractorjuice/arckit-test-project-v20-uae-moi-ipad) filename patterns

## Background

Review of test repo v20 (UAE MOI IPAD Framework) identified 40 unique doc type codes, of which 26 had no corresponding ArcKit command. After filtering for reusability and overlap with existing commands (data-model already covers DQAL/DCLS), 3 new commands were selected.

## New Commands

### 1. `/arckit.framework` (FWRK)

**Purpose**: Process/orchestration command that reads all existing project artifacts and transforms them into a structured, phased framework.

**What it does**:

1. Reads all existing project artifacts (PRIN, REQ, STKE, RSCH, DATA, RISK, diagrams, wardley maps, etc.)
2. Creates `projects/{PID}-{name}/framework/` directory with phase subdirectories organized based on what exists
3. Generates **FWRK overview** (`ARC-{PID}-FWRK-v1.0.md`):
   - Executive Summary (vision, challenge, solution)
   - Framework Architecture (dimensions, layers, cross-cutting concerns)
   - Design Philosophy / Principles Alignment
   - Document Map (all existing artifacts organized by phase)
   - Standards Alignment
   - Adoption Guidance
4. Generates **Executive Guide** (`{Project}-Executive-Guide.md`):
   - Maps artifacts to business objectives
   - SOW/requirements traceability
   - Phase-by-phase walkthrough of every document

**Agent**: Yes -- `arckit-claude/agents/arckit-framework.md`. Reads many artifacts, needs isolated context. Command is a thin wrapper delegating via Task tool.

**Template**: `framework-overview-template.md`
**Doc type code**: FWRK (single-instance)
**Dependencies**: M: principles, M: requirements, R: stakeholders, R: strategy, R: data-model, R: research
**Handoffs**: glossary, maturity-model

### 2. `/arckit.glossary` (GLOS)

**Purpose**: Generate a project glossary consolidating terms, acronyms, and definitions from existing artifacts.

**What it does**:

1. Reads existing project artifacts to extract terms and definitions
2. Generates a structured glossary with:
   - Alphabetical term definitions
   - Acronym table
   - Standards reference table
   - Cross-references to source artifacts

**Agent**: No -- standard command pattern.
**Template**: `glossary-template.md`
**Doc type code**: GLOS (single-instance)
**Dependencies**: R: requirements, R: data-model
**Handoffs**: data-model

### 3. `/arckit.maturity-model` (MMOD)

**Purpose**: Generate a maturity model defining capability levels and assessment criteria for the project domain.

**What it does**:

1. Reads principles and any existing governance/strategy artifacts
2. Generates a maturity model with:
   - Maturity level definitions (e.g., Ad-Hoc through Optimized/Autonomous)
   - Capability dimensions
   - Detailed level descriptions per dimension
   - Transition criteria between levels
   - Self-assessment methodology
   - Principle traceability

**Agent**: No -- standard command pattern.
**Template**: `maturity-model-template.md`
**Doc type code**: MMOD (single-instance)
**Dependencies**: R: principles
**Handoffs**: roadmap, strategy

## Per-Command Deliverables

Each command requires:

1. **Template**: `.arckit/templates/{name}-template.md` + `arckit-claude/templates/{name}-template.md`
   - Standard 14 Document Control fields, Revision History, standard footer
   - Generalized sections (not IPAD-specific)
2. **Command**: `arckit-claude/commands/{name}.md`
   - YAML frontmatter: `description`, `argument-hint`, `handoffs`
   - Execution: read template, check prerequisites, create-project.sh, generate-document-id.sh, populate, Write tool, summary
3. **Agent** (framework only): `arckit-claude/agents/arckit-framework.md`
4. **Guide**: `docs/guides/{name}.md` + `arckit-claude/guides/{name}.md`
5. **Converter output**: Run `python scripts/converter.py` for Codex/OpenCode/Gemini formats

## Dependency Matrix Updates

Add 3 new rows and columns to `DEPENDENCY-MATRIX.md`:

| Command | Key dependencies |
|---------|-----------------|
| framework | M: principles, M: requirements, R: stakeholders, R: strategy, R: data-model, R: research |
| glossary | R: requirements, R: data-model |
| maturity-model | R: principles |

## Handoffs

| Command | Suggested next steps |
|---------|---------------------|
| framework | glossary, maturity-model |
| glossary | data-model |
| maturity-model | roadmap, strategy |

## Documentation Updates

- `DEPENDENCY-MATRIX.md` -- add 3 rows + columns
- `README.md` -- command count 54 to 57
- `docs/index.html` -- 3 new entries
- `CHANGELOG.md` -- document additions

## What Does NOT Change

- `generate-document-id.sh` -- already accepts any type code
- Multi-instance types list -- none of these 3 are multi-instance
- Existing commands -- no modifications

## Discarded Alternatives

- **DQAL (Data Quality)** and **DCLS (Data Classification)**: Dropped -- existing `/arckit.data-model` command already generates data quality framework (Section H) and per-entity classification (Section D)
- **GOVR (Governance)**, **COST (Cost Analysis)**, **ETHC (Ethics)**: Deferred -- reusable but not prioritized for this iteration
- **AIGV, BOOK, DCST, DCON, DMOD, FWRK layers (LAY1-8), INSD, MAST, SECR, TMPL**: Project-specific to IPAD, not generalizable
