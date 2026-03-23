# govreposcrape Integration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Integrate govreposcrape (semantic search over 24,500+ UK gov repos) into ArcKit as a 5th MCP server, 3 new commands with agents, and enrichment of 5 existing agents.

**Architecture:** Add govreposcrape HTTP MCP server, create 3 command/agent/template/guide sets following existing cloud-research patterns, inject govreposcrape search steps into 5 existing research agents.

**Tech Stack:** Claude Code plugin (Markdown commands/agents with YAML frontmatter), MCP HTTP transport, bash/python scripts, HTML docs page.

**Spec:** `docs/superpowers/specs/2026-03-23-govreposcrape-integration-design.md`

---

## File Structure

### New Files (18 total)

| File | Purpose |
|------|---------|
| `arckit-claude/commands/gov-reuse.md` | Command wrapper — delegates to arckit-gov-reuse agent |
| `arckit-claude/commands/gov-code-search.md` | Command wrapper — delegates to arckit-gov-code-search agent |
| `arckit-claude/commands/gov-landscape.md` | Command wrapper — delegates to arckit-gov-landscape agent |
| `arckit-claude/agents/arckit-gov-reuse.md` | Autonomous reuse assessment agent |
| `arckit-claude/agents/arckit-gov-code-search.md` | Autonomous code search agent |
| `arckit-claude/agents/arckit-gov-landscape.md` | Autonomous landscape analysis agent |
| `arckit-claude/templates/gov-reuse-template.md` | Document template for GOVR type |
| `arckit-claude/templates/gov-code-search-template.md` | Document template for GCSR type |
| `arckit-claude/templates/gov-landscape-template.md` | Document template for GLND type |
| `.arckit/templates/gov-reuse-template.md` | CLI copy of GOVR template |
| `.arckit/templates/gov-code-search-template.md` | CLI copy of GCSR template |
| `.arckit/templates/gov-landscape-template.md` | CLI copy of GLND template |
| `docs/guides/gov-reuse.md` | Usage guide (source of truth) |
| `docs/guides/gov-code-search.md` | Usage guide (source of truth) |
| `docs/guides/gov-landscape.md` | Usage guide (source of truth) |
| `arckit-claude/guides/gov-reuse.md` | Plugin copy of guide |
| `arckit-claude/guides/gov-code-search.md` | Plugin copy of guide |
| `arckit-claude/guides/gov-landscape.md` | Plugin copy of guide |

### Modified Files (17 total)

| File | Change |
|------|--------|
| `arckit-claude/.mcp.json` | Add govreposcrape server entry |
| `arckit-claude/config/doc-types.mjs` | Add GOVR, GCSR, GLND to DOC_TYPES, MULTI_INSTANCE_TYPES, SUBDIR_MAP |
| `arckit-claude/references/quality-checklist.md` | Add per-type checks for GOVR, GCSR, GLND |
| `arckit-claude/scripts/bash/generate-document-id.sh` | Add GOVR GCSR GLND to MULTI_INSTANCE_TYPES |
| `arckit-claude/scripts/python/generate-document-id.py` | Add GOVR GCSR GLND to MULTI_INSTANCE_TYPES |
| `scripts/bash/generate-document-id.sh` | Add GOVR GCSR GLND to MULTI_INSTANCE_TYPES (root copy) |
| `arckit-claude/agents/arckit-research.md` | Add Step 5b: Government Code Reuse Check |
| `arckit-claude/agents/arckit-datascout.md` | Add Step 5e: Government Code for Data Integration |
| `arckit-claude/agents/arckit-aws-research.md` | Add Government Implementation Patterns step |
| `arckit-claude/agents/arckit-azure-research.md` | Add Government Implementation Patterns step |
| `arckit-claude/agents/arckit-gcp-research.md` | Add Government Implementation Patterns step |
| `README.md` | Add 3 commands, update count 64→67, add MCP server |
| `CLAUDE.md` | Update Current Agents table, update 64→67 |
| `docs/index.html` | Add 3 commands to web documentation |
| `docs/DEPENDENCY-MATRIX.md` | Add 3 rows + 3 columns for new commands |
| `docs/WORKFLOW-DIAGRAMS.md` | Add gov commands to workflow paths |
| `CHANGELOG.md` | Add feature entries |

---

### Task 1: Add govreposcrape MCP Server

**Files:**
- Modify: `arckit-claude/.mcp.json`

- [ ] **Step 1: Add govreposcrape to MCP config**

Edit `arckit-claude/.mcp.json` to add the govreposcrape server after the datacommons-mcp entry:

```json
    "govreposcrape": {
      "type": "http",
      "url": "https://govreposcrape-api-1060386346356.us-central1.run.app/mcp"
    }
```

The full file should have 5 servers: aws-knowledge, microsoft-learn, google-developer-knowledge, datacommons-mcp, govreposcrape.

- [ ] **Step 2: Commit**

```bash
git add arckit-claude/.mcp.json
git commit -m "feat: add govreposcrape MCP server for UK government code search"
```

---

### Task 2: Register Document Type Codes

**Files:**
- Modify: `arckit-claude/config/doc-types.mjs:12-102`
- Modify: `arckit-claude/scripts/bash/generate-document-id.sh:85`
- Modify: `arckit-claude/scripts/python/generate-document-id.py:27`
- Modify: `scripts/bash/generate-document-id.sh:85`

- [ ] **Step 1: Add types to doc-types.mjs DOC_TYPES**

In `arckit-claude/config/doc-types.mjs`, add three new entries to the `DOC_TYPES` object in the Research category (after GCRS on line 72):

```javascript
  'GOVR':      { name: 'Government Reuse Assessment',     category: 'Research' },
  'GCSR':      { name: 'Government Code Search Report',   category: 'Research' },
  'GLND':      { name: 'Government Landscape Analysis',   category: 'Research' },
```

- [ ] **Step 2: Add types to MULTI_INSTANCE_TYPES**

In the same file, add the three types to the `MULTI_INSTANCE_TYPES` set (line 78-82). Add them after `DSCT`:

```javascript
export const MULTI_INSTANCE_TYPES = new Set([
  'ADR', 'DIAG', 'DFD', 'WARD', 'DMC',
  'RSCH', 'AWRS', 'AZRS', 'GCRS', 'DSCT',
  'WGAM', 'WCLM', 'WVCH',
  'GOVR', 'GCSR', 'GLND',
]);
```

- [ ] **Step 3: Add types to SUBDIR_MAP**

In the same file, add entries to `SUBDIR_MAP` (after DSCT on line 101):

```javascript
  'GOVR': 'research',
  'GCSR': 'research',
  'GLND': 'research',
```

- [ ] **Step 4: Update plugin generate-document-id.sh**

In `arckit-claude/scripts/bash/generate-document-id.sh` line 85, add the three types AND sync the missing WGAM/WCLM/WVCH (fixing pre-existing drift with root script and doc-types.mjs):

```bash
MULTI_INSTANCE_TYPES="ADR DIAG DFD WARD DMC RSCH AWRS AZRS GCRS DSCT WGAM WCLM WVCH GOVR GCSR GLND"
```

Also update the comment on line 19 to list the correct count and types.

- [ ] **Step 5: Update root generate-document-id.sh**

In `scripts/bash/generate-document-id.sh` line 85, add the three types:

```bash
MULTI_INSTANCE_TYPES="ADR DIAG DFD WARD DMC RSCH AWRS AZRS GCRS DSCT WGAM WCLM WVCH GOVR GCSR GLND"
```

Also update the comment on line 19.

- [ ] **Step 6: Update generate-document-id.py**

In `arckit-claude/scripts/python/generate-document-id.py` line 27, add the three types AND sync the missing WGAM/WCLM/WVCH:

```python
MULTI_INSTANCE_TYPES = {"ADR", "DIAG", "DFD", "WARD", "DMC", "RSCH", "AWRS", "AZRS", "GCRS", "DSCT", "WGAM", "WCLM", "WVCH", "GOVR", "GCSR", "GLND"}
```

- [ ] **Step 7: Commit**

```bash
git add arckit-claude/config/doc-types.mjs arckit-claude/scripts/bash/generate-document-id.sh arckit-claude/scripts/python/generate-document-id.py scripts/bash/generate-document-id.sh
git commit -m "feat: register GOVR, GCSR, GLND document type codes"
```

---

### Task 3: Add Per-Type Quality Checks

**Files:**
- Modify: `arckit-claude/references/quality-checklist.md`

- [ ] **Step 1: Add GOVR per-type checks**

In `arckit-claude/references/quality-checklist.md`, after the GCRS section (line 97), add:

```markdown
### GOVR -- Government Reuse Assessment

- Reuse candidates scored on 5 criteria (license, code quality, documentation, tech stack, activity)
- License compatibility matrix present
- Tech stack alignment table comparing candidate tech to project tech
- Gap analysis covering capabilities with no reusable code found
- Recommended reuse strategy per candidate (Fork / Library / Reference / None)

### GCSR -- Government Code Search Report

- Search results grouped by relevance (high/medium)
- Repository profiles include org, language, license, last activity
- Code patterns section identifying common approaches across results
- Implementation approaches comparison table

### GLND -- Government Landscape Analysis

- Organisation landscape map with repo counts and activity levels
- Technology stack analysis covering languages, frameworks, databases
- Standards and patterns adoption table
- Maturity assessment per repository (activity, docs, tests, CI/CD, community)
- Collaboration opportunities identified
```

- [ ] **Step 2: Commit**

```bash
git add arckit-claude/references/quality-checklist.md
git commit -m "feat: add per-type quality checks for GOVR, GCSR, GLND"
```

---

### Task 4: Create Document Templates

**Files:**
- Create: `arckit-claude/templates/gov-reuse-template.md`
- Create: `arckit-claude/templates/gov-code-search-template.md`
- Create: `arckit-claude/templates/gov-landscape-template.md`
- Create: `.arckit/templates/gov-reuse-template.md` (copy)
- Create: `.arckit/templates/gov-code-search-template.md` (copy)
- Create: `.arckit/templates/gov-landscape-template.md` (copy)

Follow the pattern from `arckit-claude/templates/aws-research-template.md`: Document Control table, Revision History, Executive Summary, then domain-specific sections.

- [ ] **Step 1: Create gov-reuse-template.md**

Create `arckit-claude/templates/gov-reuse-template.md` with:

```markdown
# Government Reuse Assessment: [PROJECT_NAME]

> **Template Origin**: Official | **ArcKit Version**: [VERSION] | **Command**: `/arckit.gov-reuse`

## Document Control

| Field | Value |
|-------|-------|
| **Document ID** | ARC-[PROJECT_ID]-GOVR-v[VERSION] |
| **Document Type** | Government Reuse Assessment |
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
| [VERSION] | [DATE] | ArcKit AI | Initial creation from `/arckit.gov-reuse` agent | PENDING | PENDING |

---

## Executive Summary

### Search Scope

This document assesses reusable code across 24,500+ UK government open-source repositories for the project's capability needs, using the govreposcrape semantic search service.

**Capabilities Assessed**: [X] capabilities extracted from requirements

**Repositories Discovered**: [X] relevant repos across [Y] government organisations

**Research Sources**: [govreposcrape semantic search, GitHub repository analysis]

### Key Findings

| Capability | Best Candidate | Organisation | Reuse Strategy | Effort Saved |
|-----------|---------------|--------------|----------------|--------------|
| [Capability 1] | [Repo name] | [Org] | [Fork / Library / Reference / None] | [X]% |
| [Capability 2] | [Repo name] | [Org] | [Fork / Library / Reference / None] | [X]% |
| [Capability 3] | — | — | Build from scratch | 0% |

### Reuse Summary

- **Reusable**: [X] capabilities with viable candidates
- **Partial**: [Y] capabilities with reference-only candidates
- **No match**: [Z] capabilities requiring new development

---

## Capability Analysis

### Capability 1: [CAPABILITY_NAME]

**Requirements Addressed**: [FR-001, FR-015]

**Why This Capability**: [Explain based on requirements]

#### Candidate Repositories

##### [Repository Name]

| Field | Value |
|-------|-------|
| **Organisation** | [Gov org name] |
| **Repository** | [GitHub URL] |
| **Language** | [Primary language] |
| **License** | [MIT / OGL / Apache-2.0 / etc.] |
| **Last Activity** | [YYYY-MM-DD] |
| **Stars** | [X] |
| **Contributors** | [X] |
| **Documentation** | [Good / Fair / Poor] |

**Relevance**: [How this repo relates to the capability need]

**Reusability Assessment**:

| Criterion | Score (1-5) | Notes |
|-----------|-------------|-------|
| License compatibility | [X] | [Notes] |
| Code quality | [X] | [Notes] |
| Documentation quality | [X] | [Notes] |
| Tech stack alignment | [X] | [Notes] |
| Activity / maintenance | [X] | [Notes] |
| **Overall** | **[X.X]** | |

**Recommended Strategy**: [Fork / Library / Reference / None]

**Estimated Effort Saved**: [X]% compared to building from scratch

---

## License Compatibility Matrix

| Repository | License | Compatible with OGL | Compatible with MIT | Compatible with Proprietary | Notes |
|-----------|---------|--------------------|--------------------|---------------------------|-------|
| [Repo 1] | [License] | [Yes/No] | [Yes/No] | [Yes/No] | [Notes] |

---

## Tech Stack Alignment

| Repository | Language | Framework | Our Stack | Alignment | Integration Effort |
|-----------|----------|-----------|-----------|-----------|-------------------|
| [Repo 1] | [Lang] | [Framework] | [Our tech] | [High/Medium/Low] | [X] person-days |

---

## Gap Analysis

| Capability | Status | Notes | Recommended Action |
|-----------|--------|-------|-------------------|
| [Cap 1] | ✅ Reusable | [Best candidate] | Fork and adapt |
| [Cap 2] | ⚠️ Partial | Reference only | Use as design reference |
| [Cap 3] | ❌ No match | Nothing found | Build from scratch |

---

## Recommendations

### Reuse Strategy Summary

[Overall recommendation on which repos to reuse, which to reference, and which capabilities to build fresh]

### Implementation Priority

| Priority | Capability | Strategy | Estimated Effort |
|----------|-----------|----------|-----------------|
| 1 | [Cap] | [Strategy] | [X] person-days |

### Risk Considerations

- [Dependency on external repos, maintenance risk, license concerns]

---

**Generated by**: ArcKit `/arckit.gov-reuse` agent
**Generated on**: [DATE]
**ArcKit Version**: [VERSION]
**Project**: [PROJECT_NAME]
**Model**: [AI_MODEL]
```

- [ ] **Step 2: Create gov-code-search-template.md**

Create `arckit-claude/templates/gov-code-search-template.md` with:

```markdown
# Government Code Search Report: [PROJECT_NAME]

> **Template Origin**: Official | **ArcKit Version**: [VERSION] | **Command**: `/arckit.gov-code-search`

## Document Control

| Field | Value |
|-------|-------|
| **Document ID** | ARC-[PROJECT_ID]-GCSR-v[VERSION] |
| **Document Type** | Government Code Search Report |
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
| [VERSION] | [DATE] | ArcKit AI | Initial creation from `/arckit.gov-code-search` agent | PENDING | PENDING |

---

## Executive Summary

### Search Query

**Original Query**: "[USER_QUERY]"

**Query Variations Searched**: [List of query variations used]

**Results Found**: [X] repositories across [Y] government organisations

**Research Sources**: [govreposcrape semantic search]

### Top Results

| # | Repository | Organisation | Relevance | Language | Last Active |
|---|-----------|--------------|-----------|----------|-------------|
| 1 | [Repo name] | [Org] | [High/Medium] | [Lang] | [Date] |
| 2 | [Repo name] | [Org] | [High/Medium] | [Lang] | [Date] |
| 3 | [Repo name] | [Org] | [High/Medium] | [Lang] | [Date] |

---

## Search Results

### High Relevance

#### [Repository Name]

| Field | Value |
|-------|-------|
| **Organisation** | [Gov org name] |
| **Repository** | [GitHub URL] |
| **Description** | [Repo description] |
| **Language** | [Primary language] |
| **License** | [License] |
| **Last Activity** | [YYYY-MM-DD] |
| **Stars** | [X] |

**Why Relevant**: [How this relates to the search query]

**Key Patterns**: [Notable implementation patterns, frameworks, or approaches]

---

### Medium Relevance

[Same structure as above, for less directly relevant results]

---

## Code Patterns Identified

| Pattern | Repositories Using It | Description |
|---------|----------------------|-------------|
| [Pattern 1] | [Repo 1, Repo 2] | [Description] |

---

## Implementation Approaches Compared

| Approach | Used By | Pros | Cons |
|----------|---------|------|------|
| [Approach 1] | [Repos] | [Pros] | [Cons] |

---

## Recommendations

[Summary of findings and suggested next steps based on what was discovered]

---

**Generated by**: ArcKit `/arckit.gov-code-search` agent
**Generated on**: [DATE]
**ArcKit Version**: [VERSION]
**Project**: [PROJECT_NAME]
**Model**: [AI_MODEL]
```

- [ ] **Step 3: Create gov-landscape-template.md**

Create `arckit-claude/templates/gov-landscape-template.md` with:

```markdown
# Government Landscape Analysis: [PROJECT_NAME]

> **Template Origin**: Official | **ArcKit Version**: [VERSION] | **Command**: `/arckit.gov-landscape`

## Document Control

| Field | Value |
|-------|-------|
| **Document ID** | ARC-[PROJECT_ID]-GLND-v[VERSION] |
| **Document Type** | Government Landscape Analysis |
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
| [VERSION] | [DATE] | ArcKit AI | Initial creation from `/arckit.gov-landscape` agent | PENDING | PENDING |

---

## Executive Summary

### Domain Overview

This document maps the UK government open-source landscape for [DOMAIN], analysing what departments have built, common technology patterns, standards adopted, and maturity levels across 24,500+ government repositories.

**Domain**: [DOMAIN_NAME]

**Organisations Identified**: [X] government organisations with relevant code

**Repositories Analysed**: [X] repositories across the domain

**Research Sources**: [govreposcrape semantic search, GitHub repository analysis]

### Key Findings

- **Most Active Organisations**: [Top 3 orgs by repo count/activity]
- **Dominant Tech Stack**: [Most common language/framework combination]
- **Common Standards**: [GDS, FHIR, UPRN, etc.]
- **Maturity Level**: [Overall domain maturity assessment]

---

## Domain Landscape Map

### Organisations and Their Contributions

| Organisation | Repos | Primary Language | Focus Area | Activity Level |
|-------------|-------|-----------------|------------|---------------|
| [Org 1] | [X] | [Lang] | [Focus] | [Active/Moderate/Dormant] |

---

### Organisation Detail: [ORG_NAME]

**GitHub Org**: [GitHub org URL]

**Relevant Repositories**:

| Repository | Purpose | Language | Stars | Last Active |
|-----------|---------|----------|-------|-------------|
| [Repo 1] | [Purpose] | [Lang] | [X] | [Date] |

---

## Technology Stack Analysis

### Languages

| Language | Repo Count | Percentage | Notable Projects |
|---------|------------|------------|-----------------|
| [Lang 1] | [X] | [X]% | [Projects] |

### Frameworks

| Framework | Repo Count | Used By |
|-----------|------------|---------|
| [Framework 1] | [X] | [Orgs] |

### Databases & Storage

| Technology | Repo Count | Used By |
|-----------|------------|---------|
| [DB 1] | [X] | [Orgs] |

---

## Standards and Patterns

| Standard/Pattern | Adoption | Description | Repos |
|-----------------|----------|-------------|-------|
| [GDS Service Standard] | [Wide/Moderate/Limited] | [Description] | [Repos] |

---

## Maturity Assessment

| Repository | Activity | Documentation | Tests | CI/CD | Community | Overall |
|-----------|----------|---------------|-------|-------|-----------|---------|
| [Repo 1] | [1-5] | [1-5] | [1-5] | [1-5] | [1-5] | [Score] |

**Maturity Levels**: 5=Exemplary, 4=Mature, 3=Developing, 2=Basic, 1=Minimal

---

## Collaboration Opportunities

| Opportunity | Organisations | Description | Potential Value |
|------------|--------------|-------------|----------------|
| [Shared component] | [Orgs working on similar things] | [Description] | [High/Medium/Low] |

---

## Gaps and Opportunities

| Gap | Impact | Opportunity |
|-----|--------|-------------|
| [Missing capability] | [Impact on domain] | [What could be built] |

---

## Recommendations

[Summary of landscape findings, key patterns to adopt, collaboration opportunities, and suggested next steps]

---

**Generated by**: ArcKit `/arckit.gov-landscape` agent
**Generated on**: [DATE]
**ArcKit Version**: [VERSION]
**Project**: [PROJECT_NAME]
**Model**: [AI_MODEL]
```

- [ ] **Step 4: Copy templates to .arckit/templates/**

Copy all three templates:

```bash
cp arckit-claude/templates/gov-reuse-template.md .arckit/templates/gov-reuse-template.md
cp arckit-claude/templates/gov-code-search-template.md .arckit/templates/gov-code-search-template.md
cp arckit-claude/templates/gov-landscape-template.md .arckit/templates/gov-landscape-template.md
```

- [ ] **Step 5: Commit**

```bash
git add arckit-claude/templates/gov-reuse-template.md arckit-claude/templates/gov-code-search-template.md arckit-claude/templates/gov-landscape-template.md .arckit/templates/gov-reuse-template.md .arckit/templates/gov-code-search-template.md .arckit/templates/gov-landscape-template.md
git commit -m "feat: add document templates for gov-reuse, gov-code-search, gov-landscape"
```

---

### Task 4: Create Three New Agents

**Files:**
- Create: `arckit-claude/agents/arckit-gov-reuse.md`
- Create: `arckit-claude/agents/arckit-gov-code-search.md`
- Create: `arckit-claude/agents/arckit-gov-landscape.md`

Follow the pattern from `arckit-claude/agents/arckit-aws-research.md`: YAML frontmatter with name, description (with examples), model, maxTurns, disallowedTools, effort, then role statement, core responsibilities, multi-step process, quality standards, edge cases.

- [ ] **Step 1: Create arckit-gov-reuse agent**

Create `arckit-claude/agents/arckit-gov-reuse.md`. Use `arckit-claude/agents/arckit-aws-research.md` as the structural pattern (268 lines). The agent must include:

**Frontmatter**: `name: arckit-gov-reuse`, `model: sonnet`, `maxTurns: 40`, `disallowedTools: ["Edit"]`, `effort: max`. Description must include 3 `<example>` blocks showing triggering conditions (e.g., "has anyone in government built X?", "check for existing government code", "reuse assessment for NHS project").

**Process steps** (follow arckit-aws-research step structure):
1. Check for external documents in `projects/{project}/external/` (optional)
2. Read available documents — requirements (mandatory, stop if missing), principles (recommended), stakeholders (optional)
3. Read template: `${CLAUDE_PLUGIN_ROOT}/templates/gov-reuse-template.md`
4. Extract capabilities from FR/NFR/INT requirements
5. Search govreposcrape for each capability (multiple query variations per capability)
6. Use WebFetch on GitHub repos to assess reusability (license, activity, code quality, docs, tech stack)
7. Score each candidate on 5 criteria (1-5 scale): license compatibility, code quality, documentation, tech stack alignment, activity/maintenance
8. Build license compatibility matrix and tech stack alignment table
9. Perform gap analysis for capabilities with no matches
10. Detect existing version, determine increment (same pattern as arckit-aws-research Step 9)
11. Read `${CLAUDE_PLUGIN_ROOT}/references/quality-checklist.md`, verify Common Checks + GOVR per-type checks pass
12. Write document to `projects/{project-dir}/research/ARC-{ID}-GOVR-v{VERSION}.md` using Write tool
13. Return summary only

**Quality standards and edge cases sections** (follow existing pattern): no requirements = stop, no govreposcrape results = note and suggest manual search, markdown escaping note.

- [ ] **Step 2: Create arckit-gov-code-search agent**

Create `arckit-claude/agents/arckit-gov-code-search.md`. Use same structural pattern as arckit-gov-reuse.

**Frontmatter**: `name: arckit-gov-code-search`, `model: sonnet`, `maxTurns: 40`, `disallowedTools: ["Edit"]`, `effort: high`. Description must include 3 `<example>` blocks (e.g., "how did gov teams implement FHIR?", "who uses Redis for session management?", "search government repos for accessibility testing").

**Process steps**:
1. Read project context if available (optional — this command works without a project)
2. Take user's query from arguments
3. Search govreposcrape with original query
4. Generate broadened/narrowed query variations and search those too
5. Group results by relevance (high/medium)
6. For high-relevance results: use WebFetch on GitHub repo pages for detail (org, language, last activity, stars, license)
7. Identify code patterns across results
8. Compare implementation approaches
9. Read template: `${CLAUDE_PLUGIN_ROOT}/templates/gov-code-search-template.md`
10. Detect existing version, determine increment
11. Read `${CLAUDE_PLUGIN_ROOT}/references/quality-checklist.md`, verify Common Checks + GCSR per-type checks
12. Write document to `projects/{project-dir}/research/ARC-{ID}-GCSR-v{VERSION}.md`
13. Return summary only

- [ ] **Step 3: Create arckit-gov-landscape agent**

Create `arckit-claude/agents/arckit-gov-landscape.md`. Use same structural pattern.

**Frontmatter**: `name: arckit-gov-landscape`, `model: sonnet`, `maxTurns: 50`, `disallowedTools: ["Edit"]`, `effort: max`. Description must include 3 `<example>` blocks (e.g., "what's the government landscape for health data?", "map government identity verification projects", "survey government use of event-driven architecture").

**Process steps**:
1. Read available documents — requirements (recommended), principles (recommended)
2. Read template: `${CLAUDE_PLUGIN_ROOT}/templates/gov-landscape-template.md`
3. Identify domain from requirements and user arguments
4. Search govreposcrape with multiple domain queries (broad: "health data", specific: "FHIR patient records NHS", etc.)
5. For each result: use WebFetch on GitHub org/repo pages for detail (tech stack, activity, stars, contributors)
6. Map organisations and their contributions
7. Analyse technology stacks (languages, frameworks, databases)
8. Identify standards and patterns (GDS, FHIR, UPRN, etc.)
9. Assess maturity per repo (activity, docs, tests, CI/CD, community) on 1-5 scale
10. Identify collaboration opportunities (teams working on similar problems)
11. Perform gap analysis
12. Detect existing version, determine increment
13. Read `${CLAUDE_PLUGIN_ROOT}/references/quality-checklist.md`, verify Common Checks + GLND per-type checks
14. Write document to `projects/{project-dir}/research/ARC-{ID}-GLND-v{VERSION}.md`
15. Return summary only

- [ ] **Step 4: Commit**

```bash
git add arckit-claude/agents/arckit-gov-reuse.md arckit-claude/agents/arckit-gov-code-search.md arckit-claude/agents/arckit-gov-landscape.md
git commit -m "feat: add gov-reuse, gov-code-search, gov-landscape agents"
```

---

### Task 5: Create Three New Commands

**Files:**
- Create: `arckit-claude/commands/gov-reuse.md`
- Create: `arckit-claude/commands/gov-code-search.md`
- Create: `arckit-claude/commands/gov-landscape.md`

Follow the pattern from `arckit-claude/commands/aws-research.md`: YAML frontmatter (description, argument-hint, tags, effort, handoffs), then Instructions section with agent delegation, alternative direct execution, output section, integration with other commands, resources.

- [ ] **Step 1: Create gov-reuse command**

Create `arckit-claude/commands/gov-reuse.md` with:

Frontmatter:
```yaml
---
description: Discover reusable UK government code before building from scratch
argument-hint: "<capability or domain, e.g. 'case management', 'appointment booking NHS'>"
tags: [gov, reuse, open-source, uk-gov, code-discovery, government-code]
effort: max
handoffs:
  - command: research
    description: Feed reuse findings into build vs buy analysis
  - command: adr
    description: Record reuse decisions
  - command: requirements
    description: Refine requirements based on discovered capabilities
---
```

Body: Agent delegation to `arckit-gov-reuse` in acceptEdits mode. Prompt template:

```text
Assess reusable UK government code for the project in projects/{project-dir}/.

User's additional context: {$ARGUMENTS}

Follow your full process: read requirements, extract capabilities, search govreposcrape, assess reusability via WebFetch, score candidates, write document, return summary.
```

Alternative direct execution fallback. Output section listing summary contents. Integration with other commands section. Resources section linking to govreposcrape GitHub and API.

- [ ] **Step 2: Create gov-code-search command**

Create `arckit-claude/commands/gov-code-search.md` with:

Frontmatter:
```yaml
---
description: Search 24,500+ UK government repositories using natural language queries
argument-hint: "<query, e.g. 'FHIR patient data integration', 'GOV.UK Design System form components'>"
tags: [gov, code-search, uk-gov, government-code, semantic-search, repositories]
effort: high
handoffs:
  - command: gov-reuse
    description: Deep reuse assessment of interesting finds
  - command: research
    description: Broader market research
  - command: adr
    description: Record pattern decisions
---
```

Body: Agent delegation to `arckit-gov-code-search`. Note that project context is optional for this command.

- [ ] **Step 3: Create gov-landscape command**

Create `arckit-claude/commands/gov-landscape.md` with:

Frontmatter:
```yaml
---
description: Map the UK government code landscape for a domain — who built what, common patterns, standards, maturity
argument-hint: "<domain, e.g. 'health data integration', 'citizen identity verification'>"
tags: [gov, landscape, uk-gov, government-code, patterns, standards, discovery]
effort: max
handoffs:
  - command: gov-reuse
    description: Assess specific repos for reuse
  - command: framework
    description: Incorporate patterns into architecture framework
  - command: wardley
    description: Map landscape evolution
---
```

Body: Agent delegation to `arckit-gov-landscape`.

- [ ] **Step 4: Commit**

```bash
git add arckit-claude/commands/gov-reuse.md arckit-claude/commands/gov-code-search.md arckit-claude/commands/gov-landscape.md
git commit -m "feat: add gov-reuse, gov-code-search, gov-landscape commands"
```

---

### Task 6: Create Guides

**Files:**
- Create: `docs/guides/gov-reuse.md`
- Create: `docs/guides/gov-code-search.md`
- Create: `docs/guides/gov-landscape.md`
- Create: `arckit-claude/guides/gov-reuse.md` (copy)
- Create: `arckit-claude/guides/gov-code-search.md` (copy)
- Create: `arckit-claude/guides/gov-landscape.md` (copy)

Follow the pattern from `docs/guides/aws-research.md`: Guide Origin header, description with agent architecture note, prerequisites, scenario matrix, command usage, output highlights, UK government features, follow-on actions, comparison section, resources.

- [ ] **Step 1: Create gov-reuse guide**

Create `docs/guides/gov-reuse.md` following the aws-research guide pattern:
- Guide Origin header
- Description: "searches 24,500+ UK government repos to find existing implementations before building from scratch"
- Agent Architecture note
- Prerequisites: govreposcrape MCP (auto-installed with plugin), requirements document (mandatory), principles (recommended)
- Scenario matrix: 5-6 scenarios (e.g., "Before building a new feature", "Evaluating open-source options", "UK Government project", "Specific tech stack search", "Cost reduction research")
- Command: `/arckit.gov-reuse <capability>`
- Output: `projects/<id>/research/ARC-<id>-GOVR-v1.0.md`
- Output highlights: reuse candidates, license matrix, tech stack alignment, gap analysis, effort estimates
- Follow-on actions: `/arckit.research`, `/arckit.adr`, `/arckit.requirements`
- Comparison with `/arckit.research` (focus: reuse vs market research)
- Resources: govreposcrape GitHub, API endpoint

- [ ] **Step 2: Create gov-code-search guide**

Create `docs/guides/gov-code-search.md`:
- Description: "general-purpose natural language search across government repositories"
- Note: project context is optional
- Scenario matrix: "How did gov teams implement X?", "Who uses Y technology?", "Pattern research", "Standards discovery"
- Search tips: good vs bad queries (from govreposcrape README)
- Comparison with `/arckit.gov-reuse` (search vs assessment) and `/arckit.gov-landscape` (search vs synthesis)

- [ ] **Step 3: Create gov-landscape guide**

Create `docs/guides/gov-landscape.md`:
- Description: "maps what government has built in a domain"
- Scenario matrix: "Domain mapping", "Technology survey", "Standards adoption", "Collaboration discovery", "Gap analysis"
- Output highlights: landscape map, tech stack analysis, standards, maturity, collaboration opportunities
- Follow-on actions: `/arckit.gov-reuse`, `/arckit.framework`, `/arckit.wardley`

- [ ] **Step 4: Copy guides to plugin directory**

```bash
cp docs/guides/gov-reuse.md arckit-claude/guides/gov-reuse.md
cp docs/guides/gov-code-search.md arckit-claude/guides/gov-code-search.md
cp docs/guides/gov-landscape.md arckit-claude/guides/gov-landscape.md
```

- [ ] **Step 5: Commit**

```bash
git add docs/guides/gov-reuse.md docs/guides/gov-code-search.md docs/guides/gov-landscape.md arckit-claude/guides/gov-reuse.md arckit-claude/guides/gov-code-search.md arckit-claude/guides/gov-landscape.md
git commit -m "feat: add usage guides for gov-reuse, gov-code-search, gov-landscape"
```

---

### Task 7: Enrich Existing Research Agents

**Files:**
- Modify: `arckit-claude/agents/arckit-research.md`
- Modify: `arckit-claude/agents/arckit-datascout.md`
- Modify: `arckit-claude/agents/arckit-aws-research.md`
- Modify: `arckit-claude/agents/arckit-azure-research.md`
- Modify: `arckit-claude/agents/arckit-gcp-research.md`

- [ ] **Step 1: Add Step 5b to arckit-research.md**

In `arckit-claude/agents/arckit-research.md`, add a new step after Step 5 (line ~136, after the UK Government research section) and before Step 6 (Build vs Buy Analysis):

```markdown
### Step 5b: Government Code Reuse Check

Search govreposcrape for existing UK government implementations of each research category:

For each category identified in Step 4:

1. **Search govreposcrape**: Query "[category] UK government implementation", "[category] open source government", "[category] GDS"
2. **Assess results**: For each relevant result, note:
   - Repository name and GitHub organisation
   - Technology stack (language, frameworks)
   - Activity level (last commit date, stars)
   - License (OGL, MIT, Apache-2.0, etc.)
3. **Feed into Build vs Buy**: Add a 5th option to the analysis: **Reuse Government Code**
   - Alongside: Build Custom / Buy SaaS / Adopt Open Source / GOV.UK Platform / Reuse Government Code
   - For reuse candidates: estimate integration/adaptation effort instead of build effort
   - TCO impact: typically lower license cost but integration effort varies

If govreposcrape tools are unavailable, skip this step silently and proceed — all research continues via WebSearch/WebFetch.
```

Also update Step 6 Build vs Buy to reference the 5th option in the comparison table.

- [ ] **Step 2: Add Step 5e to arckit-datascout.md**

In `arckit-claude/agents/arckit-datascout.md`, add a new step after Step 5d (Data Commons, line ~219) and before Step 6 (Category-Specific Research):

```markdown
### Step 5e: Government Code for Data Integration

Search govreposcrape for existing government code that integrates with the data sources being researched:

1. **Search by data source**: For each data source category, query govreposcrape:
   - "[data source] API integration", "[data source] client library"
   - "[department] data pipeline", "[API name] SDK"
2. **Discover reusable integration code**: Look for:
   - API client libraries (e.g., Companies House API wrapper, OS Data Hub client)
   - Data adapters and ETL pipelines
   - Data validation and transformation utilities
3. **Include in evaluation**: Add "Existing Government Integration Code" field to source evaluation cards in Step 7:
   - Link to discovered repos
   - Note language/framework compatibility
   - Adjust integration effort estimates downward where reusable code exists

If govreposcrape tools are unavailable, skip this step silently and proceed.
```

- [ ] **Step 3: Add Government Implementation Patterns step to arckit-aws-research.md**

In `arckit-claude/agents/arckit-aws-research.md`, add a new step after Step 7 (Cost Estimation) and before Step 8 (Generate Architecture Diagram):

```markdown
### Step 7b: Government Implementation Patterns

Search govreposcrape for existing UK government implementations using the AWS services recommended above:

1. **Search by service**: For each recommended AWS service, query govreposcrape:
   - "[AWS service] UK government", "AWS [service] implementation"
   - Example: "AWS Lambda UK government", "Amazon DynamoDB government"
2. **Note findings**: For each relevant result:
   - Which department/organisation uses this service
   - Architecture patterns observed (serverless, containerised, etc.)
   - Common configurations or companion services
3. **Include in output**: Add a "Government Precedent" subsection to each service recommendation:
   - If precedent found: "[Org] uses [service] for [purpose]" — adds confidence to recommendation
   - If no precedent found: "No UK government precedent identified" — note as a consideration (not a blocker)

If govreposcrape tools are unavailable, skip this step silently and proceed.
```

- [ ] **Step 4: Add same step to arckit-azure-research.md**

Same pattern as Step 3 but for Azure services:
- Query: "[Azure service] UK government", "Azure [service] implementation"
- Example: "Azure Functions UK government", "Cosmos DB government"

- [ ] **Step 5: Add same step to arckit-gcp-research.md**

Same pattern as Step 3 but for GCP services:
- Query: "[GCP service] UK government", "Google Cloud [service] implementation"
- Example: "Cloud Run UK government", "BigQuery government"

- [ ] **Step 6: Commit**

```bash
git add arckit-claude/agents/arckit-research.md arckit-claude/agents/arckit-datascout.md arckit-claude/agents/arckit-aws-research.md arckit-claude/agents/arckit-azure-research.md arckit-claude/agents/arckit-gcp-research.md
git commit -m "feat: enrich 5 research agents with govreposcrape integration"
```

---

### Task 8: Update Documentation

**Files:**
- Modify: `README.md`
- Modify: `CLAUDE.md`
- Modify: `docs/DEPENDENCY-MATRIX.md`
- Modify: `docs/WORKFLOW-DIAGRAMS.md`
- Modify: `CHANGELOG.md`
- Modify: `docs/index.html`

- [ ] **Step 1: Update README.md**

1. Update command count from "64" to "67" (search for all occurrences — lines 43, 793, 811)
2. Add 3 commands to the command table in the appropriate section (Research/Discovery category)
3. Add govreposcrape to the MCP servers section (around line 795-796)

New command table entries:

| Command | Description |
|---------|-------------|
| `/arckit.gov-reuse` | Discover reusable UK government code before building from scratch |
| `/arckit.gov-code-search` | Search 24,500+ UK government repositories using natural language |
| `/arckit.gov-landscape` | Map the UK government code landscape for a domain |

New MCP server entry: govreposcrape — semantic search over 24,500+ UK government repositories (no API key required)

- [ ] **Step 2: Update CLAUDE.md**

1. Update "64 slash commands" to "67 slash commands" on line 7
2. Add 3 agents to the Current Agents table (lines 133-141):

| Agent | Command | Purpose |
|-------|---------|---------|
| `arckit-gov-reuse` | `/arckit.gov-reuse` | Government code reuse assessment |
| `arckit-gov-code-search` | `/arckit.gov-code-search` | Government code semantic search |
| `arckit-gov-landscape` | `/arckit.gov-landscape` | Government code landscape analysis |

- [ ] **Step 3: Update docs/DEPENDENCY-MATRIX.md**

Add 3 new columns (gov-reuse, gov-code-search, gov-landscape) to the header row and 3 new rows:

**gov-reuse row**: requirements=M, principles=R, stakeholders=O. Produces for: research=O, adr=O
**gov-code-search row**: requirements=O (optional, project context helpful). Produces for: gov-reuse=O, research=O, adr=O
**gov-landscape row**: requirements=R, principles=R. Produces for: gov-reuse=O, framework=O, wardley=O

- [ ] **Step 4: Update docs/WORKFLOW-DIAGRAMS.md**

Add gov commands to the Discovery/Research workflow diagrams. The three commands should appear in the research phase, with arrows showing:
- `requirements` → `gov-reuse` → `research` (reuse before build-vs-buy)
- `gov-code-search` → `gov-reuse` (search then assess)
- `gov-landscape` → `framework` / `wardley` (landscape informs architecture)

- [ ] **Step 5: Update CHANGELOG.md**

Add under the next version section:

```markdown
### Added

- **govreposcrape MCP server** — Semantic search over 24,500+ UK government repositories (no API key required)
- `/arckit.gov-reuse` command — Discover reusable UK government code before building from scratch (agent: `arckit-gov-reuse`)
- `/arckit.gov-code-search` command — Search UK government repositories using natural language queries (agent: `arckit-gov-code-search`)
- `/arckit.gov-landscape` command — Map the UK government code landscape for a domain (agent: `arckit-gov-landscape`)
- Government Code Reuse Check step in `/arckit.research` agent — adds "Reuse Government Code" as 5th build-vs-buy option
- Government Code for Data Integration step in `/arckit.datascout` agent — discovers existing API client libraries
- Government Implementation Patterns step in AWS, Azure, and GCP research agents — checks for government precedent
- Document type codes: GOVR (Government Reuse Assessment), GCSR (Government Code Search Report), GLND (Government Landscape Analysis)
```

- [ ] **Step 6: Update docs/index.html**

Add 3 commands to the web documentation page in the appropriate category section. Follow the existing HTML pattern for command entries.

- [ ] **Step 7: Commit**

```bash
git add README.md CLAUDE.md docs/DEPENDENCY-MATRIX.md docs/WORKFLOW-DIAGRAMS.md CHANGELOG.md docs/index.html
git commit -m "docs: add gov-reuse, gov-code-search, gov-landscape to all documentation"
```

---

### Task 9: Lint All Markdown

- [ ] **Step 1: Run markdown linter on new files**

```bash
npx markdownlint-cli2 "arckit-claude/commands/gov-*.md" "arckit-claude/agents/arckit-gov-*.md" "arckit-claude/templates/gov-*.md" ".arckit/templates/gov-*.md" "docs/guides/gov-*.md" "arckit-claude/guides/gov-*.md" "arckit-claude/references/quality-checklist.md"
```

- [ ] **Step 2: Auto-fix lint violations**

```bash
npx markdownlint-cli2 --fix "arckit-claude/commands/gov-*.md" "arckit-claude/agents/arckit-gov-*.md" "arckit-claude/templates/gov-*.md" ".arckit/templates/gov-*.md" "docs/guides/gov-*.md" "arckit-claude/guides/gov-*.md"
```

Review auto-fixes and manually fix anything the auto-fixer can't handle.

- [ ] **Step 3: Lint modified existing files**

```bash
npx markdownlint-cli2 "arckit-claude/agents/arckit-research.md" "arckit-claude/agents/arckit-datascout.md" "arckit-claude/agents/arckit-aws-research.md" "arckit-claude/agents/arckit-azure-research.md" "arckit-claude/agents/arckit-gcp-research.md" "README.md" "CLAUDE.md" "CHANGELOG.md"
```

- [ ] **Step 4: Commit any lint fixes**

```bash
git add -A
git commit -m "style: fix markdown lint violations in gov commands"
```

---

### Task 10: Run Converter and Verify

**Files:**
- Generated by converter (not manually edited)

- [ ] **Step 1: Run converter**

```bash
python scripts/converter.py
```

This auto-discovers the 3 new commands in `arckit-claude/commands/` and generates:
- Codex extension skills in `arckit-codex/skills/arckit-gov-reuse/`, `arckit-codex/skills/arckit-gov-code-search/`, `arckit-codex/skills/arckit-gov-landscape/`
- OpenCode commands in `arckit-opencode/commands/`
- Gemini extension commands in `arckit-gemini/commands/arckit/`
- Copilot prompt files in `arckit-copilot/prompts/`

It also propagates the updated `generate-document-id.sh` to extension dirs and includes govreposcrape in the Codex `config.toml`.

- [ ] **Step 2: Verify converter output**

Check that files were generated:

```bash
ls arckit-codex/skills/arckit-gov-reuse/SKILL.md
ls arckit-opencode/commands/arckit.gov-reuse.md
ls arckit-gemini/commands/arckit/gov-reuse.toml
ls arckit-copilot/prompts/arckit-gov-reuse.prompt.md
```

- [ ] **Step 3: Commit converter output**

```bash
git add arckit-codex/ arckit-opencode/ arckit-gemini/ arckit-copilot/
git commit -m "chore: regenerate extension formats for gov commands"
```

---

### Task 11: Update Memory

- [ ] **Step 1: Update MEMORY.md**

Update the Key Facts section:
- Command count: 64 → 67
- Agent count: 6 → 9
- MCP server count: 4 → 5 (add govreposcrape)

- [ ] **Step 2: Commit**

```bash
git add /home/codespace/.claude/projects/-workspaces-arc-kit/memory/MEMORY.md
git commit -m "chore: update memory with govreposcrape integration counts"
```

---
