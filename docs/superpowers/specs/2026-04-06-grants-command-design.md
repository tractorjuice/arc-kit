# UK Grants Research Command

**Date**: 2026-04-06
**Status**: Draft

## Problem

ArcKit has no command for researching funding opportunities. Users working on UK public sector or health projects need to identify relevant grants, match eligibility, and understand application timelines — currently a manual process across dozens of funding body websites.

## Design

### New Files

| File | Purpose |
|------|---------|
| `arckit-claude/commands/grants.md` | Thin slash command, delegates to agent |
| `arckit-claude/agents/arckit-grants.md` | Autonomous web research agent (10th agent) |
| `arckit-claude/templates/grants-template.md` | Document template with citation support |
| `.arckit/templates/grants-template.md` | CLI copy of template |

### Config Changes

| File | Change |
|------|--------|
| `arckit-claude/config/doc-types.mjs` | Add `'GRNT': { name: 'Grants Research', category: 'Research' }` |

### Command: `/arckit.grants`

- **File**: `arckit-claude/commands/grants.md`
- **Description**: Research UK government grants, charitable funding, and accelerator programmes
- **Argument hint**: `"<project ID or domain, e.g. '001', 'health tech AI'>"`
- **Effort**: `max`
- **Handoffs**:
  - `sobc` — feed grant funding into Economic Case
  - `plan` — create project plan aligned to grant milestones
  - `risk` — add grant-specific risks (rejection, compliance, reporting)
- Thin wrapper that launches `arckit-grants` agent in `acceptEdits` mode
- Supports `--no-spawn` flag to skip knowledge spawning

### Agent: `arckit-grants`

- **File**: `arckit-claude/agents/arckit-grants.md`
- **Frontmatter**: `name: arckit-grants`, `maxTurns: 50`, `disallowedTools: ["Edit"]`, `effort: max`, `model: inherit`
- **UK-only** — hardcoded grant body list

#### Process

**Step 1: Read project context**

Read from project context (injected by hook):
- **REQ** (mandatory) — extract sector, budget, objectives, TRL indicators
- **STKE** (recommended) — organisation type, stakeholder funding expectations
- **SOBC** (optional) — existing funding assumptions, budget gaps

If REQ is missing, warn user but proceed with user's `$ARGUMENTS` as the project description.

**Step 2: Classify project profile**

Extract from requirements and arguments:
- Sector (health, defence, education, environment, digital, transport, energy, etc.)
- Organisation type (public sector, SME, charity, academic, NHS trust)
- TRL level (1-9, or estimated from project maturity)
- Funding range sought
- Project timeline

**Step 3: Search UK grant bodies**

WebSearch and WebFetch across these hardcoded categories:

| Category | Bodies |
|----------|--------|
| Government R&D | UKRI, Innovate UK, DSIT, BEIS |
| Health | NIHR, MHRA AI Airlock, NHS England |
| Charitable | Wellcome Trust, Nesta, Health Foundation, Nuffield Foundation |
| Social Impact | Big Society Capital, Access Foundation, Social Enterprise UK |
| Accelerators | Techstars, Barclays Eagle Labs, Digital Catapult, KTN |
| Defence/Security | DASA, DSTL Innovation |

For each body, search for open/upcoming funding rounds matching the project profile. Skip bodies clearly irrelevant to the project sector.

**Step 4: Gather grant details**

For each grant found, collect via WebSearch/WebFetch:
- Grant name and programme
- Funding body
- Funding range (min-max)
- Eligibility criteria (organisation type, sector, TRL, co-funding requirements)
- Application deadline (specific date or "rolling")
- Application process summary
- Success rate (if published)
- URL to application page

**Step 5: Score eligibility**

Rate each grant against the project profile:
- **High** — project meets all eligibility criteria, sector and TRL align
- **Medium** — project meets most criteria, may need adaptation
- **Low** — partial match, significant gaps in eligibility

Include rationale for each score.

**Step 6: Write grants report**

Read the template (check `.arckit/templates/grants-template.md` first for user override, fall back to `${CLAUDE_PLUGIN_ROOT}/templates/grants-template.md`). Write to `projects/{project-dir}/research/ARC-{NNN}-GRNT-v1.0.md` using the Write tool.

**Step 7: Spawn knowledge**

> Skip if user passed `--no-spawn`.

For each grant programme researched in depth (2+ substantive facts gathered):

1. Check if tech note exists: Glob for `projects/{project-dir}/tech-notes/*{grant-slug}*`
2. **If none**: Read tech note template, create `projects/{project-dir}/tech-notes/{grant-slug}.md`
3. **If exists**: Read existing note, merge using same rules as research agent (append findings, mark outdated with date, update Last Updated)

Slug rules: same as research agent (lowercase, hyphens, no special chars).

Examples:
- "Innovate UK Smart Grants" -> `innovate-uk-smart-grants`
- "MHRA AI Airlock" -> `mhra-ai-airlock`
- "Wellcome Trust Digital Technology" -> `wellcome-trust-digital-technology`

Append `## Spawned Knowledge` section to the grants report listing all created/updated tech notes.

**Step 8: Return summary**

Return ONLY a concise summary including:
- Total grants found
- Top 3 matches with eligibility score
- Total potential funding range
- Nearest deadlines
- Number of tech notes created/updated (unless `--no-spawn`)

### Template: `grants-template.md`

Standard ArcKit document control header, then:

#### Sections

1. **Project Funding Profile**
   - Sector, organisation type, TRL level, funding sought, project timeline
   - Extracted from requirements and user input

2. **Grant Opportunities** (one subsection per grant, sorted by eligibility score descending)
   - Grant name, funding body, programme
   - Funding range
   - Eligibility criteria
   - Application deadline
   - TRL requirements
   - Eligibility score (High/Medium/Low) with rationale
   - Application process
   - URL

3. **Summary Comparison Table**

   | Grant | Funder | Amount | Deadline | Eligibility | TRL | Score |
   |-------|--------|--------|----------|-------------|-----|-------|

4. **Recommended Funding Strategy**
   - Top 3 grants with rationale
   - Application timeline
   - Complementary funding combinations (e.g., Innovate UK + NIHR co-funding)
   - Total potential funding if all successful

5. **Risks and Considerations**
   - Application effort vs probability
   - Co-funding requirements
   - Reporting and compliance obligations
   - Timeline alignment with project milestones

6. **Spawned Knowledge**
   - List of tech notes created/updated

7. **External References**
   - Citation traceability section (Document Register, Citations, Unreferenced Documents)

Standard ArcKit footer.

## What Changes

- 4 new files (command, agent, 2x template)
- 1 config change (doc-types.mjs: add GRNT)
- Run `scripts/converter.py` to generate all extension formats
- Update documentation (README, DEPENDENCY-MATRIX, command count 67->68)

## What Does NOT Change

- Existing commands and agents
- Manifest schema (GRNT files go under `research/` in the manifest like RSCH)
- Hook system
