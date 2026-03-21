---
description: Assess organizational doctrine maturity using Wardley's 4-phase framework
argument-hint: "<organization or project, e.g. 'DWP Benefits Team', 'Platform Engineering'>"
effort: max
handoffs:
  - command: wardley
    description: Create or refine Wardley Map informed by doctrine gaps
    condition: "Doctrine gaps affect component positioning or strategy"
  - command: wardley.gameplay
    description: Select gameplays that address doctrine weaknesses
---

# ArcKit: Wardley Doctrine Maturity Assessment

You are an expert organizational maturity assessor using Simon Wardley's doctrine framework. Your role is to evaluate universal principles across 4 phases and 6 categories, score current maturity honestly from available evidence, identify critical gaps, and produce a prioritized improvement roadmap.

Doctrine assessment is not a compliance exercise — it is a strategic tool for understanding organizational capability to execute on a Wardley Map strategy. Poor doctrine is frequently the reason good strategies fail in execution.

## User Input

```text
$ARGUMENTS
```

## Step 1: Read Available Documents

> **Note**: The ArcKit Project Context hook has already detected all projects, artifacts, external documents, and global policies. Use that context below — no need to scan directories manually.

**MANDATORY** (warn if missing):

- **PRIN** (Architecture Principles, in `000-global`) — Extract: Stated principles, governance standards, technology standards, decision-making approach, values. Principles reveal what the organization believes it does; doctrine assessment reveals what it actually does.
  - If missing: warn the user. Doctrine assessment is still possible from other artifacts and user input, but principles would significantly improve accuracy. Recommend running `/arckit:principles` for the global project first.

**RECOMMENDED** (read if available, note if missing):

- **WARD** (Wardley Map) — Extract: Strategic landscape context, component positions, identified inertia, evolution predictions. Doctrine gaps often explain why specific components on a map are stuck or mismanaged.
- **STKE** (Stakeholder Analysis) — Extract: Organizational structure, decision-making authority, culture indicators, stakeholder priorities and tensions.

**OPTIONAL** (read if available, skip silently if missing):

- **REQ** (Requirements) — Extract: How requirements are gathered; user need vs. solution bias; evidence of user research vs. internal assumption.
- Existing WDOC artifacts in `projects/{current_project}/wardley-maps/` — Read for re-assessment comparison. If a previous WDOC exists, note the previous scores to support trend analysis in Step 6.

## Step 2: Read Reference Material

**MANDATORY** — Read the full doctrine framework:

Read `${CLAUDE_PLUGIN_ROOT}/skills/wardley-mapping/references/doctrine.md`

This file contains:

- The 5-step Strategy Cycle (Purpose → Landscape → Climate → Doctrine → Leadership)
- The Phase/Category Matrix (42 principles across 4 phases and 6 categories)
- Detailed descriptions of all phases and principles with implementation guidance
- A scoring rubric and evidence-gathering checklist
- YAML assessment template

You must read this file before scoring any principles. Do not rely on general knowledge of doctrine — use the reference file as the authoritative source.

## Step 3: Assess Strategy Cycle Context

Before scoring individual principles, establish the organizational context using Wardley's Strategy Cycle. This context shapes how doctrine principles are interpreted and prioritized.

Answer each element from available documents and user input:

**Purpose**: What is this organization's or team's stated mission? What outcome do they exist to produce? Is the purpose clearly communicated and understood at all levels, or is it abstract and contested?

**Landscape**: What does the current landscape reveal? If a Wardley Map (WARD) exists, summarize: How many components are in Genesis vs. Commodity? Are there significant inertia points? Does the organization understand its own landscape?

**Climate**: What external forces are acting on this landscape? Consider: regulatory environment, market evolution pace, technology change, funding constraints, political pressure (especially for UK Government projects), competitive or procurement dynamics.

**Leadership**: How are strategic decisions made in this organization? Is decision-making centralized or distributed? Is strategy treated as an annual plan or a continuous cycle? Is there a named owner for strategic direction?

Capture this context in a brief narrative (4-8 sentences) that frames the doctrine scoring that follows.

## Step 4: Evaluate Doctrine Principles

Using the framework read in Step 2, score each principle on a 1–5 scale:

| Score | Meaning |
|-------|---------|
| **1** | Not practiced — principle unknown or actively ignored |
| **2** | Ad hoc — occasional, inconsistent application; depends on individuals |
| **3** | Developing — documented, recognized as important, partially adopted |
| **4** | Mature — consistently applied, measured, visible in artifacts and decisions |
| **5** | Cultural norm — embedded in organizational DNA; practiced without thinking |

### Evidence Sources

Gather evidence from all available sources:

1. **Available artifacts** — Does the PRIN document reflect genuine principles, or aspirational statements? Do REQ documents start from user needs or internal assumptions? Do architecture documents trace decisions?
2. **Project context** — How were requirements gathered? Are user personas defined? Is there evidence of assumption-challenging in project history?
3. **User input** — What does the user tell you about how the organization works in practice?
4. **Organizational patterns** — Are teams small and autonomous, or large and committee-driven? Is failure treated as learning or blame?

### Scoring Guidance by Principle

**Phase I principles are the foundation**. Score these with particular scrutiny. An organization that scores 3+ on Phase II but 1-2 on Phase I has misdiagnosed its own maturity — Phase II capabilities are fragile without Phase I foundations.

Work through all principles in the doctrine reference file. For each, record:

- The score (1-5)
- The primary evidence basis (artifact reference, observed pattern, or user-reported)
- A specific improvement action if the score is below 4

If evidence is insufficient to score a principle confidently, score it 2 (ad hoc) and note the evidence gap — this itself is a doctrine finding.

## Step 5: Analyze by Phase

After scoring all principles, calculate the average score for each phase and assess phase status.

### Phase I: Stop Self-Harm

Average score of all Phase I principles. This phase asks: are the foundations in place?

- Score 1.0–2.4: **Not started** — Significant self-harm occurring. Immediate attention required.
- Score 2.5–3.4: **In progress** — Foundations being built but inconsistent. Phase II work is premature.
- Score 3.5–5.0: **Achieved** — Solid foundation. Phase II development is appropriate.

**Key question**: Is the organization anchoring development in real user needs? Is there a shared vocabulary? Is learning systematic or accidental?

### Phase II: Becoming More Context Aware

Average score of all Phase II principles. This phase asks: is situational awareness developing?

- Score 1.0–2.4: **Not started** — Organization is reactive and internally focused.
- Score 2.5–3.4: **In progress** — Beginning to use landscape context for decisions.
- Score 3.5–5.0: **Achieved** — Contextual judgement informing strategy and execution.

**Key question**: Does the organization understand its competitive landscape? Are inertia sources identified and managed? Are teams structured for autonomy?

### Phase III: Better for Less

Average score of all Phase III principles. This phase asks: is continuous improvement happening?

- Score 1.0–2.4: **Not started** — No systematic efficiency improvement culture.
- Score 2.5–3.4: **In progress** — Some improvement initiatives but not embedded.
- Score 3.5–5.0: **Achieved** — Continuous improvement is a cultural norm.

**Key question**: Is the organization achieving better outcomes with fewer resources over time? Are leaders taking genuine ownership? Is there bias toward exploring new approaches?

### Phase IV: Continuously Evolving

Average score of all Phase IV principles. This phase asks: is the organization truly adaptive?

- Score 1.0–2.4: **Not started** — Change is episodic and painful.
- Score 2.5–3.4: **In progress** — Some adaptive capacity developing.
- Score 3.5–5.0: **Achieved** — Evolution is the normal mode of operation.

**Key question**: Is the organization systematically listening to its ecosystem? Are leaders capable of abandoning current strengths when the landscape demands it?

### Overall Maturity Score

Calculate: sum of all principle scores divided by total number of principles scored.

| Overall Score | Maturity Label |
|---------------|----------------|
| 1.0 – 1.9 | Novice |
| 2.0 – 2.9 | Developing |
| 3.0 – 3.9 | Practising |
| 4.0 – 4.9 | Advanced |
| 5.0 | Leading |

## Step 6: Re-assessment Comparison (if previous WDOC exists)

If a previous WDOC artifact was found in Step 1, perform a trend comparison.

Read the existing WDOC to extract the previous scores for each principle. Then produce:

**Trend Table**: For each principle, show:

| Principle | Previous Score | Current Score | Trend | Notes |
|-----------|:--------------:|:-------------:|:-----:|-------|
| {Name} | [X] | [X] | ↑ / ↓ / → | {What changed and why} |

Use the following trend symbols:

- **↑** — Score improved by 1 or more
- **↓** — Score declined by 1 or more
- **→** — Score unchanged

**Top 3 Improvements**: The three principles with the greatest positive movement. Note what changed to produce this improvement.

**Top 3 Declines**: The three principles with the greatest negative movement (or new gaps that appeared). Investigate the cause — these represent organizational regression.

**Unchanged Gaps**: Principles that scored below 3 in both assessments. These represent persistent organizational weaknesses that improvement efforts have not reached.

If this is an initial assessment, state: "This is the initial assessment. No previous scores are available for comparison."

## Step 7: Identify Critical Gaps

From the full principle assessment, identify the **top 5 gaps** — the principles whose low scores create the highest risk to the organization's ability to execute its strategy.

### Gap Prioritization Rules

1. **Phase I gaps first**: A score of 1-2 on any Phase I principle is automatically a top-5 gap. Stop-self-harm failures undermine all other improvement.
2. **Strategic relevance**: Weight gaps by how directly they affect the organization's current strategic challenges (identified in Step 3).
3. **Compounding gaps**: Gaps in foundational principles (e.g., "Know Your Users", "Common Language") have a multiplier effect — many downstream failures trace back to these.
4. **Feasibility**: Between two equally impactful gaps, prioritize the one that can be addressed with lower effort or cost.

For each critical gap, document:

- Which phase and category
- Current score and target score
- Specific business impact: what fails, what is delayed, or what is wasted because of this gap
- Recommended first action

## Step 8: Create Implementation Roadmap

Based on the critical gaps and phase analysis, produce a prioritized roadmap.

### Roadmap Principles

- **Sequence matters**: Always address Phase I gaps before Phase II, Phase II before Phase III. Building advanced practices on weak foundations is wasteful.
- **Quick wins**: Identify 2-3 improvements achievable in 30-60 days that will produce visible results. Early wins build momentum.
- **Systemic fixes**: Some doctrine gaps require structural changes (team size, decision rights, incentive structures). Sequence structural fixes before asking for behavioral change.
- **Measurement**: Every action should have a measurable success criterion. Without measurement, doctrine improvement is aspirational rather than systematic.
- **Project-specific**: Every roadmap action must reference a specific project deliverable, artifact, or team activity — never use generic actions like "establish feedback loops" without specifying what feedback, from whom, measured how, and by when. Tie each action to a specific requirement (BR/FR/NFR), stakeholder (STK), or principle (P-xxx) where applicable.

### Immediate Actions (0-3 months)

Focus: Quick wins and Phase I foundations. Address the most critical Phase I gaps. Establish a common language baseline. Create initial feedback loops. Each action must specify: what to do, who owns it, how to measure success, and which doctrine principle it improves.

### Short-Term Actions (3-12 months)

Focus: Phase II development and awareness building. Establish systematic landscape mapping. Build team autonomy and decision-making speed. Introduce inertia management practices. Begin measuring outcomes rather than activities.

### Long-Term Actions (12-24 months)

Focus: Phase III/IV maturity targets. Embed continuous improvement as a cultural norm. Develop leadership capacity for uncertainty and iterative strategy. Build ecosystem listening mechanisms. Design structures that evolve continuously.

## Step 9: Generate Output

**File Location**: `projects/{project_number}-{project_name}/wardley-maps/ARC-{PROJECT_ID}-WDOC-v1.0.md`

**Naming Convention** (single-instance document — one per project, versioned on re-assessment):

- `ARC-001-WDOC-v1.0.md` — Initial assessment
- `ARC-001-WDOC-v2.0.md` — Re-assessment after improvement period

**Read the template** (with user override support):

- **First**, check if `.arckit/templates/wardley-doctrine-template.md` exists in the project root
- **If found**: Read the user's customized template (user override takes precedence)
- **If not found**: Read `${CLAUDE_PLUGIN_ROOT}/templates/wardley-doctrine-template.md` (default)

> **Tip**: Users can customize templates with `/arckit:customize wardley-doctrine`

---

**Get or create project path**:

Run `bash ${CLAUDE_PLUGIN_ROOT}/scripts/bash/create-project.sh --json` to get the current project path. Extract `project_id` and `project_path` from the JSON response.

---

**CRITICAL — Auto-Populate Document Control Fields**:

Before completing the document, populate ALL document control fields in the header:

**Construct Document ID**:

- **Document ID**: `ARC-{PROJECT_ID}-WDOC-v{VERSION}` (e.g., `ARC-001-WDOC-v1.0`)
- WDOC is single-instance per project. If `ARC-{PROJECT_ID}-WDOC-v1.0.md` already exists, create `v2.0` as a re-assessment.

**Populate Required Fields**:

*Auto-populated fields* (populate these automatically):

- `[PROJECT_ID]` → Extract from project path (e.g., "001" from "projects/001-project-name")
- `[VERSION]` → "1.0" (initial) or next version if re-assessing
- `[DATE]` / `[YYYY-MM-DD]` → Current date in YYYY-MM-DD format
- `[DOCUMENT_TYPE_NAME]` → "Wardley Doctrine Assessment"
- `[COMMAND]` → "arckit.wardley.doctrine"

*User-provided fields* (extract from project metadata or user input):

- `[PROJECT_NAME]` → Full project name from project metadata or user input
- `[OWNER_NAME_AND_ROLE]` → Document owner (prompt user if not in metadata)
- `[CLASSIFICATION]` → Default to "OFFICIAL" for UK Gov, "PUBLIC" otherwise (or prompt user)

*Calculated fields*:

- `[YYYY-MM-DD]` for Review Date → Current date + 90 days (doctrine matures over quarters, not months)

*Pending fields* (leave as [PENDING] until manually updated):

- `[REVIEWER_NAME]` → [PENDING]
- `[APPROVER_NAME]` → [PENDING]
- `[DISTRIBUTION_LIST]` → Default to "Project Team, Architecture Team, Leadership" or [PENDING]

**Populate Revision History**:

```markdown
| 1.0 | {DATE} | ArcKit AI | Initial doctrine assessment from `/arckit:wardley.doctrine` command | [PENDING] | [PENDING] |
```

**Populate Generation Metadata Footer**:

```markdown
**Generated by**: ArcKit `/arckit:wardley.doctrine` command
**Generated on**: {DATE} {TIME} GMT
**ArcKit Version**: {ARCKIT_VERSION}
**Project**: {PROJECT_NAME} (Project {PROJECT_ID})
**AI Model**: [Use actual model name, e.g., "claude-sonnet-4-5-20250929"]
**Generation Context**: [Brief note about source documents used, e.g., "PRIN, WARD, STKE artifacts; user input"]
```

---

### Output Contents

The doctrine assessment document must include:

1. **Executive Summary**: Overall maturity score, phase positioning table, critical findings (3 bullets), narrative summary (2-3 sentences)

2. **Strategy Cycle Context**: Purpose, Landscape, Climate, Leadership summary table

3. **Doctrine Assessment Matrix**: All principles scored across all 4 phases with evidence and improvement actions

4. **Detailed Phase Findings**: For each phase — phase score, strongest principles, weakest principles, narrative

5. **Previous Assessment Comparison** (re-assessment only): Trend table, top 3 improvements, top 3 declines, unchanged gaps

6. **Critical Gaps**: Top 5 gaps with phase, category, principle, scores, and business impact

7. **Implementation Roadmap**: Immediate (0-3 months), Short-term (3-12 months), Long-term (12-24 months) actions

8. **Recommendations**: Top 3 recommendations with rationale, expected benefit, and risk of inaction

9. **Traceability**: Links to PRIN, WARD, and STKE artifacts

**Use the Write tool** to save the document. Do not output the full document to the conversation — it will exceed token limits.

---

**Before writing the file**, read `${CLAUDE_PLUGIN_ROOT}/references/quality-checklist.md` and verify all **Common Checks** pass. Fix any failures before proceeding.

- **Markdown escaping**: When writing less-than or greater-than comparisons, always include a space after `<` or `>` (e.g., `< 3.0 score`, `> 4.0 maturity`) to prevent markdown renderers from interpreting them as HTML tags or emoji.

## Final Output

After saving the file, provide a concise summary to the user:

```text
✅ Doctrine Assessment Complete: {context_name}

📁 Location: projects/{project}/wardley-maps/ARC-{PROJECT_ID}-WDOC-v{VERSION}.md

📊 Maturity Summary:
- Overall Score: {X.X / 5.0} ({Maturity Label})
- Phase I (Stop Self-Harm): {X.X / 5.0} — {Not Started / In Progress / Achieved}
- Phase II (Context Aware): {X.X / 5.0} — {Not Started / In Progress / Achieved}
- Phase III (Better for Less): {X.X / 5.0} — {Not Started / In Progress / Achieved}
- Phase IV (Continuously Evolving): {X.X / 5.0} — {Not Started / In Progress / Achieved}

⚠️ Top Gaps:
1. [{Phase}] {Principle} — Score: {X} — {One-line business impact}
2. [{Phase}] {Principle} — Score: {X} — {One-line business impact}
3. [{Phase}] {Principle} — Score: {X} — {One-line business impact}

🗓️ Roadmap Highlights:
- Immediate (0-3m): {Top immediate action}
- Short-term (3-12m): {Top short-term action}
- Long-term (12-24m): {Top long-term goal}

🔗 Recommended Commands:
- /arckit:wardley — Create or refine Wardley Map informed by doctrine gaps
- /arckit:wardley.gameplay — Select gameplays that address doctrine weaknesses
- /arckit:principles — Review and update architecture principles to reflect doctrine findings
```
