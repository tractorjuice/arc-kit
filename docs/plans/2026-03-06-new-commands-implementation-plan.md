# New Commands Implementation Plan (Framework, Glossary, Maturity Model)

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add 3 new ArcKit commands (`/arckit.framework`, `/arckit.glossary`, `/arckit.maturity-model`) with templates, agents, guides, and full documentation updates.

**Architecture:** Each command follows the existing ArcKit pattern: YAML-frontmatter command file + template + guide. The framework command additionally delegates to an agent via the Task tool. All 3 are single-instance document types.

**Tech Stack:** Markdown (commands, templates, guides), Python (converter), HTML (docs/index.html), YAML frontmatter

**Design doc:** `docs/plans/2026-03-06-new-commands-framework-glossary-maturity-model.md`

---

## Reference Files

Commands to study for patterns:

- **Standard command**: `arckit-plugin/commands/strategy.md` (similar structure to glossary/maturity-model)
- **Agent-delegating command**: `arckit-plugin/commands/research.md` (pattern for framework)
- **Agent file**: `arckit-plugin/agents/arckit-research.md` (pattern for framework agent)
- **Template**: `.arckit/templates/architecture-strategy-template.md` (Document Control pattern)
- **Guide**: `docs/guides/strategy.md` (guide structure)
- **Quality checklist**: `arckit-plugin/references/quality-checklist.md`
- **New-command-docs skill**: `.claude/skills/new-command-docs/SKILL.md` (11-file checklist)
- **HTML card patterns**: `.claude/skills/new-command-docs/references/html-patterns.md`
- **DSM format**: `.claude/skills/new-command-docs/references/dependency-matrix-format.md`

---

### Task 1: Create glossary template

**Files:**

- Create: `.arckit/templates/glossary-template.md`
- Create: `arckit-plugin/templates/glossary-template.md` (identical copy)

**Step 1: Create the template**

Model after `.arckit/templates/architecture-strategy-template.md` for Document Control format. Content sections based on v20's `ARC-001-GLOS-v1.0.md` but generalized:

- H1: `Glossary: [PROJECT_NAME]`
- Template Origin blockquote
- Standard 14-field Document Control table (Document ID: `ARC-[PROJECT_ID]-GLOS-v[VERSION]`, Document Type: `Project Glossary`)
- Revision History table
- Sections:
  - Purpose (why this glossary exists, scope)
  - Conventions (how terms are organized, notation)
  - Glossary (alphabetical table: Term | Definition | Source Artifact | Category)
  - Acronyms & Abbreviations (table: Acronym | Expansion | Context)
  - Standards Reference Table (Standard | Version | Relevance | URL)
  - Traceability (which artifacts contributed terms)
- Standard footer

**Step 2: Copy to plugin templates**

The files must be identical. Create both `.arckit/templates/glossary-template.md` and `arckit-plugin/templates/glossary-template.md`.

**Step 3: Commit**

```bash
git add .arckit/templates/glossary-template.md arckit-plugin/templates/glossary-template.md
git commit -m "feat: add glossary template (GLOS)"
```

---

### Task 2: Create glossary command

**Files:**

- Create: `arckit-plugin/commands/glossary.md`

**Step 1: Create the command file**

Follow the pattern of `arckit-plugin/commands/strategy.md`. Key elements:

```yaml
---
description: Generate a consolidated project glossary of terms, acronyms, and definitions from existing artifacts
argument-hint: "<project ID or scope, e.g. '001', 'all projects'>"
handoffs:
  - command: data-model
    description: Review data model for entity/attribute terminology
---
```

Command body should follow this flow:

1. **User Input** section with `$ARGUMENTS`
2. **Prerequisites**: Read existing artifacts
   - RECOMMENDED: REQ (extract domain terminology), DATA (extract entity names, attribute definitions)
   - OPTIONAL: STKE, PRIN, SOBC, RSCH, ADR (extract terms from any available)
3. **Read the template** (user override support: check `.arckit/templates/glossary-template.md` first, fall back to `${CLAUDE_PLUGIN_ROOT}/templates/glossary-template.md`)
4. **Identify or Create Project** (standard pattern from strategy.md)
5. **Extract terms**: Scan all project artifacts for:
   - Domain-specific terms and their definitions
   - Acronyms and abbreviations
   - Technical standards referenced
   - Requirement ID prefixes and their meanings
   - Entity names from data models
6. **Generate glossary**: Populate template with extracted terms, organized alphabetically. Each term should reference its source artifact.
7. **Auto-Populate Document Control**: Document ID `ARC-{PROJECT_ID}-GLOS-v{VERSION}`, Document Type "Project Glossary"
8. **Quality check**: Read `${CLAUDE_PLUGIN_ROOT}/references/quality-checklist.md`, verify Common Checks pass
9. **Write to file**: `projects/{project-dir}/ARC-{PROJECT_ID}-GLOS-v1.0.md` using Write tool
10. **Show summary**: Term count, acronym count, source artifacts scanned, suggested next steps

**Step 2: Commit**

```bash
git add arckit-plugin/commands/glossary.md
git commit -m "feat: add /arckit.glossary command (GLOS)"
```

---

### Task 3: Create glossary guide

**Files:**

- Create: `docs/guides/glossary.md`
- Create: `arckit-plugin/guides/glossary.md` (identical copy)

**Step 1: Create the guide**

Model after `docs/guides/strategy.md`. Include:

- Title: `# Glossary Guide`
- Guide Origin blockquote
- Purpose section: Why a project glossary matters (shared vocabulary, reduced ambiguity)
- Inputs table (REQ recommended, DATA recommended, others optional)
- Command usage: `/arckit.glossary Generate glossary for <project-name>`
- Output: `projects/<id>/ARC-<id>-GLOS-v1.0.md`
- Glossary Structure table (sections and contents)
- Workflow Position diagram (ASCII, showing glossary sits after requirements/data-model)
- Example Usage (minimal and comprehensive)
- Tips (run after multiple artifacts exist, update as new artifacts are created)
- Follow-On Commands table
- Output Example (sample summary output)

**Step 2: Copy to plugin guides**

Files must be identical. Create both locations.

**Step 3: Commit**

```bash
git add docs/guides/glossary.md arckit-plugin/guides/glossary.md
git commit -m "docs: add glossary command guide"
```

---

### Task 4: Create maturity-model template

**Files:**

- Create: `.arckit/templates/maturity-model-template.md`
- Create: `arckit-plugin/templates/maturity-model-template.md` (identical copy)

**Step 1: Create the template**

Content sections based on v20's `ARC-001-MMOD-v1.0.md` but generalized:

- H1: `Maturity Model: [PROJECT_NAME]`
- Template Origin blockquote
- Standard 14-field Document Control table (Document ID: `ARC-[PROJECT_ID]-MMOD-v[VERSION]`, Document Type: `Maturity Model`)
- Revision History table
- Sections:
  - Executive Summary
  - Purpose and Scope (what this maturity model covers, target audience)
  - Maturity Model Overview (table: Level | Name | Description -- 5 levels: 1-Initial/Ad-Hoc, 2-Repeatable, 3-Defined, 4-Managed, 5-Optimised)
  - Capability Dimensions (table: Dimension ID | Dimension | Description)
  - Detailed Level Definitions (for each dimension, what each level looks like)
  - Transition Criteria Between Levels (what must be true to move up)
  - Self-Assessment Methodology (how to assess current maturity)
  - Self-Assessment Questionnaire (structured questions per dimension)
  - Principle Traceability (which principles align to which dimensions)
  - Glossary
  - External References
- Standard footer

**Step 2: Copy to plugin templates**

**Step 3: Commit**

```bash
git add .arckit/templates/maturity-model-template.md arckit-plugin/templates/maturity-model-template.md
git commit -m "feat: add maturity model template (MMOD)"
```

---

### Task 5: Create maturity-model command

**Files:**

- Create: `arckit-plugin/commands/maturity-model.md`

**Step 1: Create the command file**

```yaml
---
description: Generate a capability maturity model with assessment criteria and level definitions
argument-hint: "<project ID or domain, e.g. '001', 'data management maturity'>"
handoffs:
  - command: roadmap
    description: Create phased roadmap based on maturity progression
  - command: strategy
    description: Incorporate maturity targets into architecture strategy
---
```

Command body flow:

1. **User Input** with `$ARGUMENTS`
2. **Prerequisites**:
   - RECOMMENDED: PRIN (extract principles to align maturity dimensions)
   - OPTIONAL: STRAT, REQ, STKE (context for capability dimensions)
3. **Read the template** (user override support)
4. **Identify or Create Project**
5. **Design maturity model**:
   - Identify 4-6 capability dimensions relevant to the project domain
   - Define 5 maturity levels per dimension (from Ad-Hoc to Optimised)
   - Create transition criteria between levels
   - Design self-assessment questionnaire (3-5 questions per dimension)
   - Map principles to dimensions
6. **Auto-Populate Document Control**: Document ID `ARC-{PROJECT_ID}-MMOD-v{VERSION}`, Document Type "Maturity Model"
7. **Quality check**
8. **Write to file**: `projects/{project-dir}/ARC-{PROJECT_ID}-MMOD-v1.0.md`
9. **Show summary**: Dimension count, level count, questions count, principles mapped

**Step 2: Commit**

```bash
git add arckit-plugin/commands/maturity-model.md
git commit -m "feat: add /arckit.maturity-model command (MMOD)"
```

---

### Task 6: Create maturity-model guide

**Files:**

- Create: `docs/guides/maturity-model.md`
- Create: `arckit-plugin/guides/maturity-model.md` (identical copy)

**Step 1: Create the guide**

Same structure as glossary guide but for maturity models. Include:

- Purpose: Why maturity models matter (structured improvement, measurable progress)
- Inputs table (PRIN recommended, others optional)
- Command usage
- Output structure
- Workflow position (maturity-model sits after principles, feeds into roadmap/strategy)
- Example usage
- Tips (customize dimensions to domain, use assessment questionnaire with stakeholders)
- Follow-On Commands

**Step 2: Copy to plugin guides**

**Step 3: Commit**

```bash
git add docs/guides/maturity-model.md arckit-plugin/guides/maturity-model.md
git commit -m "docs: add maturity-model command guide"
```

---

### Task 7: Create framework-overview template

**Files:**

- Create: `.arckit/templates/framework-overview-template.md`
- Create: `arckit-plugin/templates/framework-overview-template.md` (identical copy)

**Step 1: Create the template**

Content sections based on v20's `ARC-001-FWRK-v1.0.md` but generalized:

- H1: `Framework Overview: [PROJECT_NAME]`
- Template Origin blockquote
- Standard 14-field Document Control table (Document ID: `ARC-[PROJECT_ID]-FWRK-v[VERSION]`, Document Type: `Framework Overview`)
- Revision History table
- Sections:
  - Executive Summary (vision, challenge, solution, scope)
  - Framework Architecture (dimensions, layers, cross-cutting concerns -- with Mermaid diagram)
  - Design Philosophy (key design decisions, principles alignment)
  - Document Map (table: Phase | Documents | Description -- organized by phase)
  - Standards Alignment (table: Standard | Version | How Used)
  - Adoption Guidance (how to adopt this framework, entry points by role)
  - Traceability (source artifacts table)
- Standard footer

**Step 2: Copy to plugin templates**

**Step 3: Commit**

```bash
git add .arckit/templates/framework-overview-template.md arckit-plugin/templates/framework-overview-template.md
git commit -m "feat: add framework overview template (FWRK)"
```

---

### Task 8: Create framework agent

**Files:**

- Create: `arckit-plugin/agents/arckit-framework.md`

**Step 1: Create the agent file**

Model after `arckit-plugin/agents/arckit-research.md`. Key differences:

- This agent reads project artifacts (not web research)
- Produces 2 outputs: FWRK overview + Executive Guide

```yaml
---
name: arckit-framework
description: |
  Use this agent when the user wants to transform existing project artifacts into a structured framework with phased organization, an overview document, and an executive guide. This agent reads all project artifacts and synthesizes them into a coherent framework structure. Examples:

  <example>
  Context: User has multiple artifacts and wants to create a framework
  user: "/arckit:framework Create framework for the data governance project"
  assistant: "I'll launch the framework agent to read all project artifacts and create a structured framework with phased organization and executive guide."
  <commentary>
  The framework agent reads many artifacts to synthesize the overview, benefiting from agent isolation.
  </commentary>
  </example>
model: inherit
---
```

Agent body (system prompt) should cover:

1. **Role**: You are an enterprise architecture framework specialist
2. **Process**:
   - Step 1: Read ALL project artifacts (scan `projects/{PID}-*/` for every ARC-*.md file)
   - Step 2: Read global artifacts (`projects/000-global/`)
   - Step 3: Read external documents (`external/` directories)
   - Step 4: Read the template (user override support)
   - Step 5: Analyze and categorize artifacts into logical phases
   - Step 6: Create `framework/` directory structure with phase subdirectories
   - Step 7: Generate FWRK overview document (`ARC-{PID}-FWRK-v1.0.md`) in the framework directory
   - Step 8: Generate Executive Guide (`{Project-Name}-Executive-Guide.md`) in the framework directory
   - Step 9: Return summary only (artifact count, phases identified, documents generated)
3. **Phase organization guidance**:
   - Phase 1 Foundation: principles, stakeholders, glossary, maturity model
   - Phase 2 Requirements & Data: requirements, data model, data sources
   - Phase 3 Architecture & Design: strategy, diagrams, platform design, ADRs
   - Phase 4 Governance & Compliance: risk, conformance, ethics, DPIA
   - Phase 5 Delivery & Operations: roadmap, backlog, devops, operationalize
   - Adapt phases based on what artifacts actually exist
4. **Executive Guide structure**:
   - Document Control
   - Executive Summary (what the framework covers, why it matters)
   - Alignment with Requirements/SOW (how artifacts fulfill requirements)
   - Document Map (table of all framework documents by phase)
   - Phase-by-phase walkthrough (for each phase, describe what each document covers and why)
   - Standards and Compliance Alignment
5. **Output rules**: Write both files using Write tool, return only summary

**Step 2: Commit**

```bash
git add arckit-plugin/agents/arckit-framework.md
git commit -m "feat: add arckit-framework agent for framework generation"
```

---

### Task 9: Create framework command

**Files:**

- Create: `arckit-plugin/commands/framework.md`

**Step 1: Create the command file**

Model after `arckit-plugin/commands/research.md` (agent-delegating pattern):

```yaml
---
description: Transform existing project artifacts into a structured, phased framework with overview and executive guide
argument-hint: "<project ID or name, e.g. '001', 'data governance framework'>"
handoffs:
  - command: glossary
    description: Generate glossary of framework terminology
  - command: maturity-model
    description: Create maturity model for framework adoption
---
```

Command body:

1. **User Input** with `$ARGUMENTS`
2. **This command delegates to the `arckit-framework` agent** (explain why: reads many artifacts, needs isolated context)
3. **What to Do**:
   - Determine the project from user input
   - Launch the **arckit-framework** agent in `acceptEdits` mode with prompt including project path and user arguments
4. **Report the result** when agent completes
5. **Alternative: Direct Execution** fallback if Task tool unavailable:
   - Prerequisites: MANDATORY: PRIN, REQ. RECOMMENDED: STKE, STRAT, DATA, RSCH. OPTIONAL: all others
   - Read the template (user override support)
   - Read all project artifacts
   - Categorize into phases
   - Create framework directory structure
   - Generate FWRK overview and Executive Guide
   - Write both files using Write tool
   - Show summary

**Step 2: Commit**

```bash
git add arckit-plugin/commands/framework.md
git commit -m "feat: add /arckit.framework command (FWRK) with agent delegation"
```

---

### Task 10: Create framework guide

**Files:**

- Create: `docs/guides/framework.md`
- Create: `arckit-plugin/guides/framework.md` (identical copy)

**Step 1: Create the guide**

Emphasize that this is a transformation/orchestration command:

- Purpose: Transform scattered artifacts into a structured framework
- Inputs table (PRIN mandatory, REQ mandatory, others recommended/optional)
- Command usage
- What it produces: framework/ directory with phases, FWRK overview, Executive Guide
- Workflow position (framework sits late in the workflow, after many artifacts exist)
- Example usage (show running after creating multiple artifacts)
- Tips (run when you have 5+ artifacts, re-run to update as artifacts evolve)
- Follow-On Commands (glossary, maturity-model)
- Key differentiators table: `/arckit.strategy` (executive narrative) vs `/arckit.framework` (structural organization)

**Step 2: Copy to plugin guides**

**Step 3: Commit**

```bash
git add docs/guides/framework.md arckit-plugin/guides/framework.md
git commit -m "docs: add framework command guide"
```

---

### Task 11: Run converter

**Step 1: Generate Codex/OpenCode/Gemini formats**

Run: `python scripts/converter.py`

Expected: New files created in `.codex/prompts/`, `.opencode/commands/`, `arckit-opencode/commands/`, and `arckit-gemini/commands/arckit/` for all 3 new commands. The converter extracts the framework agent prompt and inlines it into non-Claude formats.

**Step 2: Verify output**

Run: `ls .codex/prompts/arckit.glossary.md .codex/prompts/arckit.maturity-model.md .codex/prompts/arckit.framework.md`

Expected: All 3 files exist.

Run: `ls arckit-gemini/commands/arckit/glossary.toml arckit-gemini/commands/arckit/maturity-model.toml arckit-gemini/commands/arckit/framework.toml`

Expected: All 3 files exist.

**Step 3: Commit**

```bash
git add .codex/ .opencode/ arckit-opencode/ arckit-gemini/
git commit -m "chore: generate Codex/OpenCode/Gemini formats for new commands"
```

---

### Task 12: Update documentation (11-file checklist)

Use the `new-command-docs` skill for exact patterns. Run it 3 times (once per command), or batch all 3 together since counts increment by 3 total (54 to 57).

**Files to update:**

1. `README.md` -- 4 count locations (54 to 57) + 3 new command table rows
2. `docs/index.html` -- 8 count locations (54 to 57) + 3 new HTML command cards
3. `arckit-plugin/.claude-plugin/plugin.json` -- description count
4. `.claude-plugin/marketplace.json` -- description count
5. `arckit-plugin/README.md` -- any count references
6. `DEPENDENCY-MATRIX.md` -- 3 new rows + columns, tier assignments, changelog entries
7. `WORKFLOW-DIAGRAMS.md` -- add framework to relevant Mermaid diagrams if applicable
8. `docs/README.md` -- 3 new coverage table rows, coverage count
9. `CLAUDE.md` -- update command count (54 to 57), add framework agent to Agent System table
10. `CHANGELOG.md` (root) -- add entries for 3 new commands
11. `arckit-plugin/CHANGELOG.md` -- add entries for 3 new commands

**Dependency Matrix details:**

- glossary: consumed by framework (R). Consumes: requirements (R), data-model (R)
- maturity-model: consumed by framework (R). Consumes: principles (R)
- framework: consumes principles (M), requirements (M), stakeholders (R), strategy (R), data-model (R), research (R), glossary (R), maturity-model (R)

**CLAUDE.md Agent System table -- add:**

```markdown
| `arckit-framework` | `/arckit.framework` | Framework synthesis from project artifacts |
```

**Step 1: Update all 11 files**

Use the `new-command-docs` skill references for exact grep patterns and HTML card templates.

**Step 2: Verify no old counts remain**

Run: `grep -rn "54 commands\|54 slash commands\|54 AI-assisted" README.md docs/index.html arckit-plugin/.claude-plugin/plugin.json .claude-plugin/marketplace.json docs/README.md DEPENDENCY-MATRIX.md CLAUDE.md`

Expected: No matches (all should show 57).

**Step 3: Commit**

```bash
git add README.md docs/index.html arckit-plugin/.claude-plugin/plugin.json .claude-plugin/marketplace.json arckit-plugin/README.md DEPENDENCY-MATRIX.md WORKFLOW-DIAGRAMS.md docs/README.md CLAUDE.md CHANGELOG.md arckit-plugin/CHANGELOG.md
git commit -m "docs: update documentation for 3 new commands (framework, glossary, maturity-model)"
```

---

### Task 13: Verify and test

**Step 1: Verify all files exist**

```bash
# Templates (6 files -- 3 commands x 2 locations)
ls .arckit/templates/glossary-template.md .arckit/templates/maturity-model-template.md .arckit/templates/framework-overview-template.md
ls arckit-plugin/templates/glossary-template.md arckit-plugin/templates/maturity-model-template.md arckit-plugin/templates/framework-overview-template.md

# Commands (3 files)
ls arckit-plugin/commands/glossary.md arckit-plugin/commands/maturity-model.md arckit-plugin/commands/framework.md

# Agent (1 file)
ls arckit-plugin/agents/arckit-framework.md

# Guides (6 files -- 3 commands x 2 locations)
ls docs/guides/glossary.md docs/guides/maturity-model.md docs/guides/framework.md
ls arckit-plugin/guides/glossary.md arckit-plugin/guides/maturity-model.md arckit-plugin/guides/framework.md

# Converter output (verify at least Codex files exist)
ls .codex/prompts/arckit.glossary.md .codex/prompts/arckit.maturity-model.md .codex/prompts/arckit.framework.md
```

Expected: All files exist.

**Step 2: Verify command count consistency**

```bash
grep -rn "57 commands\|57 slash commands\|57 AI-assisted" README.md docs/index.html arckit-plugin/.claude-plugin/plugin.json .claude-plugin/marketplace.json CLAUDE.md | wc -l
```

Expected: Multiple matches confirming count is 57 everywhere.

**Step 3: Verify template consistency**

```bash
diff .arckit/templates/glossary-template.md arckit-plugin/templates/glossary-template.md
diff .arckit/templates/maturity-model-template.md arckit-plugin/templates/maturity-model-template.md
diff .arckit/templates/framework-overview-template.md arckit-plugin/templates/framework-overview-template.md
```

Expected: No differences.

**Step 4: Verify guide consistency**

```bash
diff docs/guides/glossary.md arckit-plugin/guides/glossary.md
diff docs/guides/maturity-model.md arckit-plugin/guides/maturity-model.md
diff docs/guides/framework.md arckit-plugin/guides/framework.md
```

Expected: No differences.

**Step 5: Run markdown lint**

```bash
npx markdownlint-cli2 "arckit-plugin/commands/glossary.md" "arckit-plugin/commands/maturity-model.md" "arckit-plugin/commands/framework.md" ".arckit/templates/glossary-template.md" ".arckit/templates/maturity-model-template.md" ".arckit/templates/framework-overview-template.md" "docs/guides/glossary.md" "docs/guides/maturity-model.md" "docs/guides/framework.md"
```

Expected: No lint errors (or only pre-existing violations).
