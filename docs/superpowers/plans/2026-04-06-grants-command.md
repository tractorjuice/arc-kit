# UK Grants Research Command — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add `/arckit.grants` command that researches UK government grants, charitable funding, and accelerator programmes, matching eligibility to project requirements and spawning reusable knowledge.

**Architecture:** Agent-delegated command following the same pattern as `/arckit.research`. Thin slash command delegates to `arckit-grants` agent for heavy web research. Agent writes grants report using template, spawns tech notes for grant programmes.

**Tech Stack:** Markdown (command, agent, template), JavaScript (doc-types.mjs config)

**Spec:** `docs/superpowers/specs/2026-04-06-grants-command-design.md`

---

### Task 1: Add GRNT document type to config

**Files:**
- Modify: `arckit-claude/config/doc-types.mjs`

- [ ] **Step 1: Add GRNT to DOC_TYPES**

In `arckit-claude/config/doc-types.mjs`, add to the Research section (after `'GLND'` on line 77):

```js
  'GRNT':      { name: 'Grants Research',                  category: 'Research' },
```

- [ ] **Step 2: Add GRNT to MULTI_INSTANCE_TYPES**

Add `'GRNT'` to the `MULTI_INSTANCE_TYPES` set (line 83-88). The set should include:

```js
export const MULTI_INSTANCE_TYPES = new Set([
  'ADR', 'DIAG', 'DFD', 'WARD', 'DMC',
  'RSCH', 'AWRS', 'AZRS', 'GCRS', 'DSCT',
  'WGAM', 'WCLM', 'WVCH',
  'GOVR', 'GCSR', 'GLND', 'GRNT',
]);
```

- [ ] **Step 3: Add GRNT to SUBDIR_MAP**

Add to the `SUBDIR_MAP` object (after `'GLND': 'research'` on line 110):

```js
  'GRNT': 'research',
```

- [ ] **Step 4: Verify syntax**

```bash
node -e "import('./arckit-claude/config/doc-types.mjs').then(m => { console.log(m.DOC_TYPES.GRNT); console.log('MULTI:', m.MULTI_INSTANCE_TYPES.has('GRNT')); console.log('SUBDIR:', m.SUBDIR_MAP.GRNT); })"
```

Expected:
```
{ name: 'Grants Research', category: 'Research' }
MULTI: true
SUBDIR: research
```

- [ ] **Step 5: Commit**

```bash
git add arckit-claude/config/doc-types.mjs
git commit -m "feat: add GRNT document type for grants research"
```

---

### Task 2: Create grants template

**Files:**
- Create: `arckit-claude/templates/grants-template.md`
- Create: `.arckit/templates/grants-template.md` (identical copy)

- [ ] **Step 1: Create the template**

Write to `arckit-claude/templates/grants-template.md`:

```markdown
# UK Grants Research: [PROJECT_NAME]

> **Template Origin**: Official | **ArcKit Version**: [VERSION] | **Command**: `/arckit.grants`

## Document Control

| Field | Value |
|-------|-------|
| **Document ID** | ARC-[PROJECT_ID]-GRNT-v[VERSION] |
| **Document Type** | UK Grants Research |
| **Project** | [PROJECT_NAME] (Project [PROJECT_ID]) |
| **Classification** | [PUBLIC / OFFICIAL / OFFICIAL-SENSITIVE / SECRET] |
| **Status** | [DRAFT / IN_REVIEW / APPROVED / PUBLISHED / SUPERSEDED / ARCHIVED] |
| **Version** | [VERSION] |
| **Created Date** | [YYYY-MM-DD] |
| **Last Modified** | [YYYY-MM-DD] |
| **Review Cycle** | [Monthly / Quarterly / Annual / On-Demand] |
| **Next Review Date** | [YYYY-MM-DD] |
| **Owner** | [OWNER_NAME_AND_ROLE] |
| **Reviewed By** | [REVIEWER_NAME] ([YYYY-MM-DD]) or PENDING |
| **Approved By** | [APPROVER_NAME] ([YYYY-MM-DD]) or PENDING |
| **Distribution** | [DISTRIBUTION_LIST] |

## Revision History

| Version | Date | Author | Changes | Approved By | Approval Date |
|---------|------|--------|---------|-------------|---------------|
| [VERSION] | [DATE] | ArcKit AI | Initial creation from `/arckit.grants` agent | PENDING | PENDING |

---

## Document Purpose

This document identifies and evaluates UK funding opportunities relevant to the project, including government grants, charitable foundations, social impact investors, and accelerator programmes. Each opportunity is scored for eligibility against the project profile.

## Project Funding Profile

| Attribute | Value |
|-----------|-------|
| **Sector** | [e.g., Health, Defence, Education, Digital, Environment] |
| **Organisation Type** | [e.g., Public Sector, SME, Charity, Academic, NHS Trust] |
| **TRL Level** | [1-9 or estimated range] |
| **Funding Sought** | [Amount or range] |
| **Project Timeline** | [Start — End] |
| **Key Objectives** | [2-3 bullet points from requirements] |

## Grant Opportunities

<!-- Repeat this section for each grant, sorted by eligibility score (High first) -->

### [GRANT_NAME]

| Attribute | Detail |
|-----------|--------|
| **Funding Body** | [e.g., Innovate UK, NIHR, Wellcome Trust] |
| **Programme** | [Specific programme name] |
| **Funding Range** | [MIN — MAX or fixed amount] |
| **Deadline** | [Specific date or "Rolling"] |
| **TRL Requirement** | [e.g., TRL 4-7] |
| **Eligibility Score** | [High / Medium / Low] |

**Eligibility Criteria:**

- [Criterion 1]
- [Criterion 2]
- [Criterion 3]

**Score Rationale:** [Why this score — what matches and what gaps exist]

**Application Process:** [Brief summary of how to apply, timeline, stages]

**URL:** [Link to grant programme page]

---

## Summary Comparison

| Grant | Funder | Amount | Deadline | Eligibility | TRL | Score |
|-------|--------|--------|----------|-------------|-----|-------|
| [GRANT_NAME] | [FUNDER] | [AMOUNT] | [DEADLINE] | [KEY_CRITERIA] | [TRL] | [SCORE] |

## Recommended Funding Strategy

### Top Recommendations

1. **[GRANT_1]** — [Rationale]
2. **[GRANT_2]** — [Rationale]
3. **[GRANT_3]** — [Rationale]

### Application Timeline

| Date | Action | Grant |
|------|--------|-------|
| [DATE] | [ACTION] | [GRANT] |

### Complementary Funding

[Identify combinations — e.g., Innovate UK + NIHR co-funding, or phased applications across multiple bodies]

### Total Potential Funding

[Sum of all recommended grants if all applications successful]

## Risks and Considerations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Application effort vs probability | [IMPACT] | [MITIGATION] |
| Co-funding requirements | [IMPACT] | [MITIGATION] |
| Reporting and compliance obligations | [IMPACT] | [MITIGATION] |
| Timeline alignment | [IMPACT] | [MITIGATION] |

## Spawned Knowledge

The following standalone knowledge files were created or updated from this research:

### Tech Notes

- `tech-notes/{grant-slug}.md` — {Created | Updated}

## External References

### Document Register

| Doc ID | Filename | Type | Source Location | Description |
|--------|----------|------|-----------------|-------------|
| *None provided* | — | — | — | — |

### Citations

| Citation ID | Doc ID | Page/Section | Category | Quoted Passage |
|-------------|--------|--------------|----------|----------------|

### Unreferenced Documents

| Filename | Source Location | Reason |
|----------|-----------------|--------|

---

**Generated by**: ArcKit `/arckit.grants` command
**Generated on**: [DATE]
**ArcKit Version**: [VERSION]
**Project**: [PROJECT_NAME]
**Model**: [AI_MODEL]
```

- [ ] **Step 2: Copy to CLI templates directory**

```bash
cp arckit-claude/templates/grants-template.md .arckit/templates/grants-template.md
```

- [ ] **Step 3: Commit**

```bash
git add arckit-claude/templates/grants-template.md .arckit/templates/grants-template.md
git commit -m "feat: add grants research template"
```

---

### Task 3: Create grants agent

**Files:**
- Create: `arckit-claude/agents/arckit-grants.md`

- [ ] **Step 1: Create the agent file**

Write to `arckit-claude/agents/arckit-grants.md`:

````markdown
---
name: arckit-grants
maxTurns: 50
disallowedTools: ["Edit"]
effort: max
description: |
  Use this agent when the user needs to research UK funding opportunities for a project, including government grants (UKRI, Innovate UK, NIHR, DSIT), charitable foundations (Wellcome, Nesta), social impact funding, and accelerator programmes. This agent performs extensive web research autonomously. Examples:

  <example>
  Context: User has a project and wants to find relevant UK grants
  user: "/arckit:grants Research funding opportunities for the NHS appointment booking project"
  assistant: "I'll launch the grants agent to research UK funding opportunities for the NHS appointment booking project. It will search government grants, charitable foundations, and accelerators, then produce an eligibility-scored report."
  <commentary>
  The grants agent is ideal here because it needs to perform dozens of WebSearch and WebFetch calls across multiple UK funding bodies. Running as an agent keeps this context-heavy work isolated.
  </commentary>
  </example>

  <example>
  Context: User wants to explore funding after creating requirements
  user: "Are there any UK grants we could apply for with this project?"
  assistant: "I'll launch the grants agent to discover and evaluate UK funding opportunities based on your project requirements."
  <commentary>
  Even without the explicit slash command, the request for grant/funding research should trigger this agent since it involves heavy web research.
  </commentary>
  </example>
model: inherit
---

You are a UK grants and funding research specialist. You conduct systematic research across UK government grant bodies, charitable foundations, social impact investors, and accelerator programmes to identify funding opportunities that match project requirements.

## Your Core Responsibilities

1. Read and analyze project requirements to build a funding profile
2. Conduct extensive web research across UK funding bodies
3. Gather real eligibility criteria, funding amounts, deadlines, and application details via WebSearch and WebFetch
4. Score each opportunity against the project profile
5. Write a comprehensive grants report to file
6. Spawn tech notes for significant grant programmes
7. Return only a summary to the caller

## Process

### Step 1: Read Available Documents

> **Note**: The ArcKit Project Context hook has already detected all projects, artifacts, external documents, and global policies. Use that context — no need to scan directories manually.

Find the project directory in `projects/` (user may specify name/number, otherwise use most recent). Scan for existing artifacts:

**MANDATORY** (warn if missing but proceed):

- `ARC-*-REQ-*.md` in `projects/{project}/` — Requirements specification
  - Extract: sector, budget range, objectives, TRL indicators, organisation type, compliance requirements
  - If missing: warn user to run `/arckit:requirements` first, but proceed using `$ARGUMENTS` as the project description

**RECOMMENDED** (read if available, note if missing):

- `ARC-*-STKE-*.md` in `projects/{project}/` — Stakeholder analysis
  - Extract: organisation type, stakeholder funding expectations, partnership opportunities
- `ARC-*-SOBC-*.md` in `projects/{project}/` — Business case
  - Extract: existing funding assumptions, budget gaps, cost-benefit data

**OPTIONAL** (read if available, skip silently if missing):

- `ARC-000-PRIN-*.md` in `projects/000-global/` — Architecture principles
  - Extract: technology constraints that affect grant eligibility (e.g., open source requirements)

### Step 2: Build Project Funding Profile

Extract from requirements and user arguments:

- **Sector**: health, defence, education, environment, digital, transport, energy, etc.
- **Organisation type**: public sector, SME, charity, academic, NHS trust
- **TRL level**: 1-9 (estimate from project maturity if not stated)
- **Funding range sought**: from budget/cost data or user input
- **Project timeline**: from project plan or requirements dates
- **Key objectives**: 2-3 bullet points summarising the project

### Step 3: Read external documents

- Read any **external documents** listed in the project context (`external/` files) — extract funding-relevant information
- Read any **enterprise standards** in `projects/000-global/external/` — extract existing funding policies or constraints
- **Citation traceability**: When referencing content from external documents, follow the citation instructions in `${CLAUDE_PLUGIN_ROOT}/references/citation-instructions.md`. Place inline citation markers (e.g., `[PP-C1]`) next to findings informed by source documents and populate the "External References" section in the template.

### Step 4: Research UK Grant Bodies

**Use WebSearch and WebFetch extensively.** Do NOT rely on general knowledge alone. Search for current, open funding rounds.

Search across these categories, skipping bodies clearly irrelevant to the project sector:

| Category | Bodies to Search |
|----------|-----------------|
| Government R&D | UKRI, Innovate UK, DSIT, BEIS |
| Health | NIHR, MHRA AI Airlock, NHS England |
| Charitable | Wellcome Trust, Nesta, Health Foundation, Nuffield Foundation |
| Social Impact | Big Society Capital, Access Foundation, Social Enterprise UK |
| Accelerators | Techstars, Barclays Eagle Labs, Digital Catapult, KTN |
| Defence/Security | DASA, DSTL Innovation |

For each body:
1. Search for their current funding opportunities page
2. WebFetch the results to get current open calls
3. Filter for relevance to the project sector and TRL

### Step 5: Gather Grant Details

For each relevant grant found, collect via WebSearch/WebFetch:

- Grant name and programme
- Funding body
- Funding range (min-max)
- Eligibility criteria (organisation type, sector, TRL, co-funding requirements)
- Application deadline (specific date or "rolling")
- Application process summary (stages, timeline)
- Success rate (if published)
- URL to application/guidance page

### Step 6: Score Eligibility

Rate each grant against the project funding profile:

- **High** — project meets all eligibility criteria, sector and TRL align, organisation type qualifies
- **Medium** — project meets most criteria, may need minor adaptation or partner involvement
- **Low** — partial match, significant gaps in eligibility or sector mismatch

Include a rationale for each score explaining what matches and what gaps exist.

### Step 7: Read Template and Write Report

1. **Read the template** (with user override support):
   - **First**, check if `.arckit/templates/grants-template.md` exists in the project root
   - **If found**: Read the user's customized template (user override takes precedence)
   - **If not found**: Read `${CLAUDE_PLUGIN_ROOT}/templates/grants-template.md` (default)

2. Before writing, read `${CLAUDE_PLUGIN_ROOT}/references/quality-checklist.md` and verify all **Common Checks** pass. Fix any failures before proceeding.

3. Generate the document ID: `ARC-{PROJECT_ID}-GRNT-{NNN}-v1.0` where `{NNN}` is the next available sequence number. Check existing files with Glob: `projects/{project-dir}/research/ARC-*-GRNT-*.md`

4. Write the complete report to `projects/{project-dir}/research/ARC-{PROJECT_ID}-GRNT-{NNN}-v1.0.md` using the **Write tool** (not inline output — avoids token limit).

Sort grant opportunities by eligibility score (High first, then Medium, then Low).

### Step 8: Spawn Knowledge

> **Skip this step** if the user passed `--no-spawn` in the original command arguments.

After writing the main grants report, extract reusable knowledge into standalone tech note files.

**Slug Generation Rule:**

1. Take the grant programme name (e.g., "Innovate UK Smart Grants")
2. Convert to lowercase: "innovate uk smart grants"
3. Replace spaces with hyphens: "innovate-uk-smart-grants"
4. Remove special characters
5. Remove leading/trailing hyphens
6. Collapse multiple consecutive hyphens to single

Examples:
- "MHRA AI Airlock" → "mhra-ai-airlock"
- "Wellcome Trust Digital Technology" → "wellcome-trust-digital-technology"
- "NIHR i4i Programme" → "nihr-i4i-programme"

**Tech Notes:**

For each grant programme researched in depth (2+ substantive facts gathered):

1. Check whether a tech note already exists: Glob for `projects/{project-dir}/tech-notes/*{grant-slug}*`
2. **If no tech note exists**: Read the tech note template at `${CLAUDE_PLUGIN_ROOT}/templates/tech-note-template.md` and create a new file at `projects/{project-dir}/tech-notes/{grant-slug}.md`. Populate from research findings.
3. **If a tech note exists**: Read the existing note and apply these merge rules per section:
   - **Summary**: Update only if understanding has significantly changed; otherwise keep existing
   - **Key Findings**: Append new findings; mark outdated ones with "(superseded as of YYYY-MM-DD)" rather than removing
   - **Relevance to Projects**: Add this project if not already listed
   - **Last Updated**: Update to today's date

**Traceability:**

Append a `## Spawned Knowledge` section at the end of the main grants document listing all created or updated files:

```markdown
## Spawned Knowledge

The following standalone knowledge files were created or updated from this research:

### Tech Notes
- `tech-notes/{grant-slug}.md` — {Created | Updated}
```

**Deduplication rule:** Always search for existing coverage before creating. Use filename glob patterns: `projects/{project-dir}/tech-notes/*{topic}*`. Slugs must be lowercase with hyphens.

### Step 9: Return Summary

Return ONLY a concise summary including:

- Total grants found and breakdown by score (High/Medium/Low)
- Top 3 matches with funding amounts and deadlines
- Total potential funding range (sum of recommended grants)
- Nearest application deadlines
- Number of tech notes created/updated (unless `--no-spawn`)
- Suggested next steps: `/arckit:sobc` (Economic Case), `/arckit:plan` (project plan), `/arckit:risk` (grant-specific risks)

**CRITICAL**: Do NOT output the full document. It was already written to file. Only return the summary.

## Important Notes

- **All funding data must come from WebSearch/WebFetch** — do not use general knowledge for grant amounts, deadlines, or eligibility
- **Markdown escaping**: When writing less-than or greater-than comparisons, always include a space after `<` or `>` to prevent markdown rendering issues
- **Deadlines change frequently** — always note the date of research and warn the user to verify deadlines before applying
- **UK-only scope** — this agent covers UK funding bodies only
````

- [ ] **Step 2: Commit**

```bash
git add arckit-claude/agents/arckit-grants.md
git commit -m "feat: add arckit-grants agent for UK funding research"
```

---

### Task 4: Create grants slash command

**Files:**
- Create: `arckit-claude/commands/grants.md`

- [ ] **Step 1: Create the command file**

Write to `arckit-claude/commands/grants.md`:

````markdown
---
description: Research UK government grants, charitable funding, and accelerator programmes with eligibility scoring
argument-hint: "<project ID or domain, e.g. '001', 'health tech AI'>"
tags: [grants, funding, ukri, innovate-uk, nihr, wellcome, nesta, accelerator, uk-government]
effort: max
handoffs:
  - command: sobc
    description: Feed grant funding data into Economic Case
  - command: plan
    description: Create project plan aligned to grant milestones
  - command: risk
    description: Add grant-specific risks (rejection, compliance, reporting)
---

# UK Grants Research

## User Input

```text
$ARGUMENTS
```

## Instructions

This command researches UK funding opportunities — government grants (UKRI, Innovate UK, NIHR, DSIT, DASA), charitable foundations (Wellcome, Nesta, Health Foundation), social impact investors, and accelerator programmes — matching eligibility to the project's requirements.

**This command delegates to the `arckit-grants` agent** which runs as an autonomous subprocess. This keeps the extensive web research (dozens of WebSearch and WebFetch calls across UK funding bodies) isolated from your main conversation context.

### What to Do

1. **Determine the project**: If the user specified a project name/number, note it. Otherwise, identify the most recent project in `projects/`.

2. **Launch the agent**: Launch the **arckit-grants** agent in `acceptEdits` mode with the following prompt:

```text
Research UK funding opportunities for the project in projects/{project-dir}/.

User's additional context: {$ARGUMENTS}

Follow your full process: read requirements, build funding profile, search UK grant bodies, score eligibility, write report, spawn knowledge, return summary.
```

   If the user included `--no-spawn` in their arguments, append to the agent prompt: `Skip Step 8 (do not spawn tech notes).`

3. **Report the result**: When the agent completes, relay its summary to the user.

### Alternative: Direct Execution

If the Task tool is unavailable or the user prefers inline execution, fall back to the full research process:

1. Check prerequisites (requirements document recommended)
2. **Read the template** (with user override support):
   - **First**, check if `.arckit/templates/grants-template.md` exists in the project root
   - **If found**: Read the user's customized template (user override takes precedence)
   - **If not found**: Read `${CLAUDE_PLUGIN_ROOT}/templates/grants-template.md` (default)
   - **Tip**: Users can customize templates with `/arckit:customize grants`
3. Build project funding profile from requirements
4. Use WebSearch and WebFetch across UK grant bodies
5. Score eligibility and build comparison table
6. Before writing the file, read `${CLAUDE_PLUGIN_ROOT}/references/quality-checklist.md` and verify all **Common Checks** pass. Fix any failures before proceeding.
7. Write to `projects/{project-dir}/research/ARC-{PROJECT_ID}-GRNT-{NNN}-v1.0.md` using Write tool
8. Show summary only (not full document)

### Flags

| Flag | Effect |
|------|--------|
| `--no-spawn` | Skip knowledge compounding — produce the grants report only, without spawning tech notes. Useful for quick research or when you do not want additional files created. |

### Output

The agent writes the full grants report to file and returns a summary including:

- Total grants found with eligibility breakdown
- Top 3 matches with funding amounts and deadlines
- Total potential funding range
- Nearest application deadlines
- Spawned tech notes (unless `--no-spawn` was used)
- Next steps (`/arckit:sobc`, `/arckit:plan`, `/arckit:risk`)

#### Spawned Knowledge

In addition to the main grants document, the agent creates standalone files for reusable knowledge:

- **Tech notes** at `projects/{project}/tech-notes/{grant-slug}.md` — one per grant programme researched in depth (2+ substantive facts)

Existing notes are updated rather than duplicated. A `## Spawned Knowledge` section is appended to the grants document listing everything created or updated.

## Integration with Other Commands

- **Input**: Uses requirements document (`ARC-*-REQ-*.md`)
- **Input**: Uses stakeholder analysis (`ARC-*-STKE-*.md`), business case (`ARC-*-SOBC-*.md`)
- **Output**: Feeds into `/arckit:sobc` (Economic Case funding data)
- **Output**: Feeds into `/arckit:plan` (grant milestone alignment)
- **Output**: Feeds into `/arckit:risk` (grant-specific risks)
- **Output**: Spawns `tech-notes/{slug}.md` (reusable grant programme knowledge)

## Important Notes

- **Markdown escaping**: When writing less-than or greater-than comparisons, always include a space after `<` or `>` (e.g., `< 3 months`, `> £500k`) to prevent markdown renderers from interpreting them as HTML tags or emoji
- **UK-only scope**: This command searches UK funding bodies only
- **Deadlines change frequently**: The report notes the research date — users should verify deadlines before applying
````

- [ ] **Step 2: Commit**

```bash
git add arckit-claude/commands/grants.md
git commit -m "feat: add /arckit.grants slash command"
```

---

### Task 5: Regenerate extensions and update documentation

**Files:**
- Modify: Multiple generated files (via `scripts/converter.py`)
- Modify: `README.md` (command count, new command entry)
- Modify: `docs/DEPENDENCY-MATRIX.md` (add GRNT)

- [ ] **Step 1: Run the converter**

```bash
python scripts/converter.py
```

Expected: output shows 68 commands per format (was 67).

- [ ] **Step 2: Update README command count**

Search for `67` in README.md and update to `68` where it refers to command count. Also add an entry for `/arckit.grants` in the command table.

Search for the research command entry in README and add a grants entry nearby in the appropriate section.

- [ ] **Step 3: Update CLAUDE.md command count**

Search for `67` in CLAUDE.md and update to `68` where it refers to command count.

- [ ] **Step 4: Update docs/DEPENDENCY-MATRIX.md**

Add GRNT to the dependency matrix, showing it reads REQ (mandatory), STKE and SOBC (recommended), and feeds into SOBC, PLAN, RISK.

- [ ] **Step 5: Update the bump-version.sh and any other references to command count**

Search the codebase for `67 commands` or `67 slash` and update to `68`.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: regenerate extensions and update docs for grants command (68 commands)"
```

---

### Task 6: Verify end-to-end

- [ ] **Step 1: Verify command file is discovered**

```bash
ls arckit-claude/commands/grants.md
```

- [ ] **Step 2: Verify agent file exists**

```bash
ls arckit-claude/agents/arckit-grants.md
```

- [ ] **Step 3: Verify template exists in both locations**

```bash
ls arckit-claude/templates/grants-template.md .arckit/templates/grants-template.md
```

- [ ] **Step 4: Verify doc type config**

```bash
node -e "import('./arckit-claude/config/doc-types.mjs').then(m => { console.log('DOC_TYPES:', !!m.DOC_TYPES.GRNT); console.log('MULTI:', m.MULTI_INSTANCE_TYPES.has('GRNT')); console.log('SUBDIR:', m.SUBDIR_MAP.GRNT); })"
```

Expected: `DOC_TYPES: true`, `MULTI: true`, `SUBDIR: research`

- [ ] **Step 5: Verify converter output includes grants**

```bash
grep -l "grants" arckit-codex/prompts/ arckit-opencode/commands/ arckit-gemini/commands/arckit/ arckit-copilot/prompts/ 2>/dev/null | head -5
```

Expected: one file per extension format containing the grants command.

- [ ] **Step 6: Run markdownlint**

```bash
npx markdownlint-cli2 "arckit-claude/commands/grants.md" "arckit-claude/agents/arckit-grants.md" "arckit-claude/templates/grants-template.md"
```

Expected: no errors.

- [ ] **Step 7: Final commit if fixups needed**

```bash
git add -A
git commit -m "fix: address any review issues from grants command"
```

Only if changes were made in this step.
