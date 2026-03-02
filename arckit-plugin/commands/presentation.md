---
description: Generate MARP presentation slides from existing project artifacts for governance boards and stakeholder briefings
argument-hint: "<project ID and audience, e.g. '001 executive board'>"
---

You are helping an enterprise architect **generate a MARP-format presentation** from existing ArcKit project artifacts. The presentation summarises the project's architecture, requirements, risks, and roadmap in a slide deck suitable for governance boards, stakeholder briefings, and gate reviews.

This command creates an **ARC-{PROJECT_ID}-PRES-v1.0.md** document that serves as:

- A slide deck in [MARP](https://marp.app/) format (renders to PDF/PPTX/HTML via MARP CLI or VS Code extension)
- A governance-ready summary drawing from existing ArcKit artifacts
- A tailored presentation for different audiences (executive, technical, stakeholder)

## User Input

```text
$ARGUMENTS
```

## Instructions

> **Note**: The ArcKit Project Context hook has already detected all projects, artifacts, external documents, and global policies. Use that context below — no need to scan directories manually.

### Step 1: Identify the target project

- Use the **ArcKit Project Context** (above) to find the project matching the user's input (by name or number)
- If no match, create a new project:
  1. Use Glob to list `projects/*/` directories and find the highest `NNN-*` number (or start at `001` if none exist)
  2. Calculate the next number (zero-padded to 3 digits, e.g., `002`)
  3. Slugify the project name (lowercase, replace non-alphanumeric with hyphens, trim)
  4. Use the Write tool to create `projects/{NNN}-{slug}/README.md` with the project name, ID, and date — the Write tool will create all parent directories automatically
  5. Also create `projects/{NNN}-{slug}/external/README.md` with a note to place external reference documents here
  6. Set `PROJECT_ID` = the 3-digit number, `PROJECT_PATH` = the new directory path

### Step 2: Read existing artifacts from the project context

**MANDATORY** (warn if missing):

- **PRIN** (Architecture Principles, in `projects/000-global/`)
  - Extract: Governance standards, technology constraints, compliance framework
  - If missing: warn user to run `/arckit:principles` first

**RECOMMENDED** (read if available, note if missing):

- **STKE** (Stakeholder Analysis) — personas, goals, priorities → Stakeholder slide
- **REQ** (Requirements) — BR/FR/NFR/INT/DR counts and critical items → Requirements slide
- **RISK** (Risk Register) — top risks, mitigations, distribution → Risk slide
- **PLAN** (Project Plan) — phases, milestones, Gantt → Timeline slide
- **ROAD** (Roadmap) — delivery roadmap → Roadmap slide
- **STRAT** (Architecture Strategy) — vision, decisions → Context slide
- **SOBC** (Business Case) — benefits, costs, ROI → Executive summary
- **DIAG** (Architecture Diagrams) — C4, deployment, data flow → Architecture slide
- **WARD** (Wardley Map) — strategic positioning → Strategy slide
- **RSCH** / **AWSR** / **AZUR** / **GCRS** — technology research → Technology decisions
- **SOW** / **DOS** — procurement → Procurement status
- **HLDR** / **DLDR** (Design Reviews) → Quality assurance
- **TCOP** / **SECD** / **MSBD** — compliance assessments → Compliance slide
- **DPIA** (DPIA) → Data protection
- **AIPB** / **ATRS** — AI governance → AI compliance
- **DEVOPS** (DevOps Strategy) → Delivery approach

**Minimum artifact check**: A meaningful presentation requires at least 3 artifacts. If the project has fewer than 3, warn:

```text
⚠️  Warning: This project only has [N] artifacts.

A useful presentation typically requires at least:
- Architecture principles (global)
- Stakeholder analysis or requirements
- Risk register or project plan

Run more /arckit commands first, then re-run /arckit:presentation.
```

### Step 3: Interactive Configuration

Before generating the presentation, use the **AskUserQuestion** tool to gather preferences. **Skip any question the user has already answered in their arguments.**

**Gathering rules** (apply to all questions in this section):

- Ask the most important question first; fill in secondary details from context or reasonable defaults.
- **Maximum 2 rounds of questions.** After that, pick the best option from available context.
- If still ambiguous after 2 rounds, choose the (Recommended) option and note: *"I went with [X] — easy to adjust if you prefer [Y]."*

**Question 1** — header: `Focus`, multiSelect: false
> "What audience is this presentation for?"

- **Executive (Recommended)**: High-level summary — business case, timeline, risks, decisions needed. Fewer slides, minimal technical detail.
- **Technical**: Architecture detail — diagrams, technology decisions, integration points, data model. More slides, Mermaid diagrams.
- **Stakeholder**: Benefits-focused — user impact, timeline, risks, change management. Balanced detail, emphasis on outcomes.
- **Procurement**: Vendor-focused — requirements summary, evaluation criteria, timeline, contract structure. For RFP briefings.

**Question 2** — header: `Slides`, multiSelect: false
> "How many slides should the presentation contain?"

- **10-12 slides (Recommended)**: Standard governance board deck — covers all key areas concisely
- **6-8 slides**: Brief update — executive summary, key decisions, next steps only
- **15-20 slides**: Comprehensive briefing — detailed sections with supporting data and diagrams

Apply the user's selections: the focus determines which artifacts are emphasised and the level of technical detail. The slide count constrains how much content is included per section.

### Step 4: Read the template (with user override support)

- **First**, check if `.arckit/templates/presentation-template.md` exists in the project root
- **If found**: Read the user's customized template (user override takes precedence)
- **If not found**: Read `${CLAUDE_PLUGIN_ROOT}/templates/presentation-template.md` (default)

> **Tip**: Users can customize templates with `/arckit:customize presentation`

### Step 4b: Load Mermaid Syntax References

Read `${CLAUDE_PLUGIN_ROOT}/skills/mermaid-syntax/references/quadrantChart.md`, `${CLAUDE_PLUGIN_ROOT}/skills/mermaid-syntax/references/c4.md`, `${CLAUDE_PLUGIN_ROOT}/skills/mermaid-syntax/references/pie.md`, and `${CLAUDE_PLUGIN_ROOT}/skills/mermaid-syntax/references/gantt.md` for official Mermaid syntax — quadrant chart axes, C4 diagram elements, pie chart syntax, date formats, and styling options.

### Step 5: Generate the MARP presentation

Build the slide deck by extracting key content from each artifact:

**Title Slide**: Project name, date, classification, presenter/team

**Context & Objectives** (from STRAT, SOBC, REQ):

- Business challenge and strategic opportunity
- Key objectives and success criteria

**Stakeholder Landscape** (from STKE):

- Key stakeholders with roles, interest, and influence
- Mermaid quadrant chart if data available (see Mermaid label rules below)

**Architecture Overview** (from DIAG, STRAT):

- Current state summary and pain points
- Target state and key changes
- Embed Mermaid C4 context diagram or reference existing diagrams

**Technology Decisions** (from RSCH, AWSR, AZUR, GCRS, ADR):

- Key build vs buy decisions
- Technology choices with rationale

**Key Requirements** (from REQ):

- Summary counts by category (BR/FR/NFR/INT/DR)
- Top 3-5 critical requirements

**Risk Summary** (from RISK):

- Top 3-5 risks with likelihood/impact/mitigation
- Mermaid pie chart of risk distribution

**Roadmap & Timeline** (from PLAN, ROAD):

- Mermaid Gantt chart of project phases
- Key milestones with status

**Compliance & Governance** (from TCOP, SECD, MSBD, DPIA, AIPB):

- Standards compliance status table
- Only include if UK Government or compliance-heavy project

**Recommendations & Next Steps**:

- Immediate actions with owners and deadlines
- Decisions required from the audience

**Questions & Discussion**: Contact details and next review date

**Slide count guidelines**:

- **6-8 slides**: Title + Context + Architecture + Requirements + Risks + Timeline + Next Steps
- **10-12 slides**: All of the above + Stakeholders + Technology Decisions + Compliance + Questions
- **15-20 slides**: All sections expanded with additional detail slides, data model, integration points

### Step 6: MARP formatting rules

- Use `---` between slides (MARP slide separator)
- Include MARP YAML frontmatter: `marp: true`, `theme: default`, `paginate: true`
- Use `header` and `footer` for persistent slide branding
- Keep each slide to 3-5 bullet points or one table/diagram — avoid overloading
- Use Mermaid diagrams where data supports them (Gantt, pie, C4, quadrant)
- Use `<!-- fit -->` for headings that need auto-sizing
- Tables should have no more than 5 rows per slide

**Mermaid label rules** (applies to ALL Mermaid diagrams, especially `quadrantChart`):

- **No accented characters**: Use ASCII only in labels — replace é→e, í→i, ó→o, ñ→n, ü→u, etc.
- **No hyphens in data point labels**: Use spaces instead — e.g., `DST Cybersecurity` not `DST-Cybersecurity`
- **No special characters**: Avoid colons, parentheses, brackets, or quotes in labels
- These restrictions exist because Mermaid's parser breaks on non-ASCII and certain punctuation

### Step 7: Write the output

Before writing the file, read `${CLAUDE_PLUGIN_ROOT}/references/quality-checklist.md` and verify all **Common Checks** plus the **PRES** per-type checks pass. Fix any failures before proceeding.

- Write to `projects/{project-dir}/ARC-{PROJECT_ID}-PRES-v${VERSION}.md`
- Use the exact template structure with MARP frontmatter

**CRITICAL - Auto-Populate Document Control Fields**:

#### Step 7a: Detect Version

Before generating the document ID, check if a previous version exists:

1. Look for existing `ARC-{PROJECT_ID}-PRES-v*.md` files in the project directory
2. **If no existing file**: Use VERSION="1.0"
3. **If existing file found**:
   - Read the existing document to understand its scope
   - Compare against current inputs and requirements
   - **Minor increment** (e.g., 1.0 → 1.1): Same focus and artifact set — refreshed content
   - **Major increment** (e.g., 1.0 → 2.0): Different focus, significantly different artifact set, or new audience
4. Use the determined version for document ID, filename, Document Control, and Revision History
5. For v1.1+/v2.0+: Add a Revision History entry describing what changed from the previous version

#### Step 7b: Construct Document ID

- **Document ID**: `ARC-{PROJECT_ID}-PRES-v{VERSION}` (e.g., `ARC-001-PRES-v1.0`)

#### Step 7c: Populate Required Fields

**Auto-populated fields** (populate these automatically):

- `[PROJECT_ID]` → Extract from project path (e.g., "001" from "projects/001-project-name")
- `[VERSION]` → Determined version from Step 7a
- `[DATE]` / `[YYYY-MM-DD]` → Current date in YYYY-MM-DD format
- `[DOCUMENT_TYPE_NAME]` → "Architecture Presentation"
- `ARC-[PROJECT_ID]-PRES-v[VERSION]` → Construct using format from Step 7b
- `[COMMAND]` → "arckit.presentation"

**User-provided fields** (extract from project metadata or user input):

- `[PROJECT_NAME]` → Full project name from project metadata or user input
- `[OWNER_NAME_AND_ROLE]` → Document owner (prompt user if not in metadata)
- `[CLASSIFICATION]` → Default to "OFFICIAL" for UK Gov, "PUBLIC" otherwise (or prompt user)

**Pending fields** (leave as [PENDING] until manually updated):

- `[REVIEWER_NAME]` → [PENDING]
- `[APPROVER_NAME]` → [PENDING]
- `[DISTRIBUTION_LIST]` → Default to "Project Team, Architecture Team" or [PENDING]

#### Step 7d: Populate Revision History

```markdown
| 1.0 | {DATE} | ArcKit AI | Initial creation from `/arckit:presentation` command | [PENDING] | [PENDING] |
```

#### Step 7e: Populate Generation Metadata Footer

```markdown
**Generated by**: ArcKit `/arckit:presentation` command
**Generated on**: {DATE} {TIME} GMT
**ArcKit Version**: {ARCKIT_VERSION}
**Project**: {PROJECT_NAME} (Project {PROJECT_ID})
**AI Model**: [Use actual model name, e.g., "claude-sonnet-4-5-20250929"]
**Generation Context**: [Brief note about source documents used]
```

### Step 8: Summarize what you created

Show ONLY a concise summary after writing the file.

## Example Usage

User: `/arckit:presentation Generate executive presentation for NHS appointment booking`

You should:

- Find project 007-nhs-appointment
- Read all available artifacts (STKE, REQ, RISK, PLAN, DIAG, etc.)
- Ask about focus (executive) and slide count (10-12)
- Generate MARP slide deck with executive focus
- Write to `projects/007-nhs-appointment/ARC-007-PRES-v1.0.md`
- Show summary only

## Important Notes

- **MARP rendering**: The output `.md` file can be rendered using [MARP CLI](https://github.com/marp-team/marp-cli) (`marp --pdf ARC-001-PRES-v1.0.md`) or the [MARP for VS Code](https://marketplace.visualstudio.com/items?itemName=marp-team.marp-vscode) extension
- **Mermaid diagrams**: MARP supports Mermaid natively — use them for Gantt charts, pie charts, C4 diagrams, and quadrant charts
- This command **reads** existing artifacts and reformats them — it does not generate new analysis
- If no artifacts exist, recommend running `/arckit:plan` or `/arckit:requirements` first
- Keep slides concise: 3-5 bullets per slide, one table or diagram per slide
- For UK Government projects, include GDS Service Standard and TCoP compliance status

- **Markdown escaping**: When writing less-than or greater-than comparisons, always include a space after `<` or `>` (e.g., `< 3 seconds`, `> 99.9% uptime`) to prevent markdown renderers from interpreting them as HTML tags or emoji

## Resources

- [MARP Official Documentation](https://marp.app/)
- [MARP CLI](https://github.com/marp-team/marp-cli)
- [MARP Themes](https://github.com/marp-team/marp-core/tree/main/themes)
- [Mermaid Diagram Syntax](https://mermaid.js.org/)

## Output Instructions

**CRITICAL - Token Efficiency**:

### 1. Generate Presentation

Create the MARP slide deck following the template structure and user's focus/slide preferences.

### 2. Write Directly to File

**Use the Write tool** to create `projects/[PROJECT]/ARC-{PROJECT_ID}-PRES-v${VERSION}.md` with the complete presentation.

**DO NOT** output the full document in your response. This would exceed token limits.

### 3. Show Summary Only

After writing the file, show ONLY a concise summary:

```markdown
## Presentation Complete ✅

**Project**: [Project Name]
**File Created**: `projects/[PROJECT]/ARC-{PROJECT_ID}-PRES-v1.0.md`

### Presentation Summary

**Focus**: [Executive / Technical / Stakeholder / Procurement]
**Slides**: [N] slides
**Theme**: [default / gaia / uncover]

**Content Sources**:
- [List artifacts read and what was extracted from each]

**Slide Deck**:
1. Title — [Project name, date, classification]
2. Context & Objectives — [Key points]
3. Stakeholder Landscape — [Key stakeholders]
4. Architecture Overview — [Current → Target]
5. Key Requirements — [N] total ([N] BR, [N] FR, [N] NFR)
6. Risk Summary — [N] risks ([N] high, [N] medium, [N] low)
7. Roadmap — [Duration], [N] milestones
8. Next Steps — [N] actions, [N] decisions

**Rendering**:
- VS Code: Install [MARP for VS Code](https://marketplace.visualstudio.com/items?itemName=marp-team.marp-vscode) → Open file → Preview
- CLI: `marp --pdf ARC-{PROJECT_ID}-PRES-v1.0.md` (requires [MARP CLI](https://github.com/marp-team/marp-cli))
- HTML: `marp ARC-{PROJECT_ID}-PRES-v1.0.md` → opens in browser

### Next Steps

- Review slides for accuracy and completeness
- Customize MARP theme if needed (`theme: gaia` or `theme: uncover`)
- Export to PDF/PPTX: `marp --pdf` or `marp --pptx`
- Run `/arckit:story` for a full narrative companion document
```

Generate the presentation now, write to file using Write tool, and show only the summary above.
