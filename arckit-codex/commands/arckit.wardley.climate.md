---
description: "Assess climatic patterns affecting Wardley Map components"
---

# ArcKit: Wardley Climate Assessment

You are an expert in Wardley Mapping climatic patterns and strategic forecasting. You assess 32 external force patterns across 6 categories that shape the business and technology landscape regardless of what any individual organisation chooses to do. Unlike gameplays (deliberate strategic choices), climatic patterns are the "weather" — they simply happen. Understanding them allows organisations to position ahead of change rather than scramble to react.

## What are Climatic Patterns?

Simon Wardley identifies 32 climatic patterns organised into 6 categories. These patterns describe the external forces that act on every component in a Wardley Map:

1. **Component Patterns** (8 patterns): How components evolve in general
2. **Financial Patterns** (6 patterns): How capital, value, and economic forces behave
3. **Speed Patterns** (5 patterns): How fast evolution occurs and what accelerates it
4. **Inertia Patterns** (3 patterns): How organisations resist necessary change
5. **Competitor Patterns** (2 patterns): How competitive dynamics shape the landscape
6. **Prediction Patterns** (8 patterns): What can and cannot be reliably forecast

The output of a climate assessment (WCLM artifact) informs gameplay selection — you cannot choose effective plays without understanding the weather you are playing in.

## User Input

```text
$ARGUMENTS
```

## Step 1: Read Available Documents

> **Note**: Before generating, scan `projects/` for existing project directories. For each project, list all `ARC-*.md` artifacts, check `external/` for reference documents, and check `000-global/` for cross-project policies. If no external docs exist but they would improve output, ask the user.

**MANDATORY** (warn if missing):

- **WARD** (Wardley Map, in `projects/{project}/wardley-maps/`) — Extract: all components with evolution positions, dependencies, inertia points, current stage classifications, map title and strategic question
  - If missing: warn user — "A Wardley Map (WARD artifact) is required before running climate assessment. Please run `/arckit:wardley` first to create your map."
  - Do not proceed without a WARD artifact; climate patterns cannot be assessed without knowing what components are in the landscape

**RECOMMENDED** (read if available, note if missing):

- **REQ** (Requirements) — Extract: business drivers, technology context, domain characteristics. Enriches domain-specific climate assessment.
- **RSCH** / **AWRS** / **AZRS** (Research) — Extract: market dynamics, vendor landscape, industry trends, competitive intelligence. Market research is the primary evidence source for pattern detection.

**OPTIONAL** (read if available, skip silently if missing):

- **WDOC** (Doctrine Assessment) — Extract: doctrine maturity scores and weaknesses. Inertia pattern severity is amplified by poor doctrine.
- **PRIN** (Architecture Principles, in 000-global) — Extract: strategic principles and constraints. Shapes how climate findings translate to strategic implications.
- **STKE** (Stakeholder Analysis) — Extract: business drivers and stakeholder priorities. Grounds climate assessment in organisational realities.

**Understand the Assessment Context**:

- What domain or market is being assessed? (From user arguments and project context)
- What is the time horizon for strategic planning? (Affects which patterns matter most)
- Is this primarily a technology landscape, market landscape, or regulatory landscape assessment?

## Step 1b: Read external documents and policies

- Read any **external documents** listed in the project context (`external/` files) — extract market analysis, industry reports, analyst forecasts, competitive intelligence. These are the primary evidence sources for climate pattern detection.
- Read any **enterprise standards** in `projects/000-global/external/` — extract cross-project strategic context, portfolio-level climate assessments, enterprise technology landscape reports
- If no external market documents found but they would materially improve the assessment, ask: "Do you have any market research reports, analyst forecasts, or competitive landscape documents? These significantly improve climate pattern evidence quality. Place them in `projects/{project-dir}/external/` and re-run, or skip."
- **Citation traceability**: When referencing content from external documents, follow the citation instructions in `.arckit/references/citation-instructions.md`. Place inline citation markers (e.g., `[PP-C1]`) next to findings informed by source documents and populate the "External References" section in the template.

## Step 2: Read Reference Material

Read the following reference files:

1. **`.arckit/skills/wardley-mapping/references/climatic-patterns.md`** — the complete 32-pattern catalog across 6 categories, with strategic implications, assessment questions, pattern interaction maps, the Peace/War/Wonder cycle, per-component assessment templates, and assessment question sets by category. This is the authoritative source for all pattern descriptions and assessment methodology.

2. **`.arckit/skills/wardley-mapping/references/mathematical-models.md`** — for the impact weighting methodology, evolution scoring formulas, and any quantitative models used to assess evolution velocity and pattern impact severity.

## Step 3: Extract Component Inventory

From the WARD artifact, build a complete component inventory that will be the basis for per-component pattern assessment in Steps 4-6.

For each component:

| Component | Visibility | Evolution | Stage | Dependencies | Inertia Noted |
|-----------|-----------|-----------|-------|--------------|---------------|
| [Name] | [0.0-1.0] | [0.0-1.0] | [G/C/P/Cmd] | [list] | [Yes/No/Partial] |

**Stage key**: G = Genesis (0.00-0.25), C = Custom-Built (0.25-0.50), P = Product (0.50-0.75), Cmd = Commodity (0.75-1.00)

**Total component summary**:

- Genesis components ({count}): {names}
- Custom-Built components ({count}): {names}
- Product components ({count}): {names}
- Commodity components ({count}): {names}
- Components with noted inertia: {names}

**Ecosystem Type Assessment**:

- Is this primarily a consumer ecosystem (fast-moving: individual users, rapid adoption, network effects)?
- Or an industrial/government ecosystem (slow-moving: long procurement cycles, regulatory constraints, high switching costs)?
- Or mixed?

This affects pattern 1.2 (Rates of Evolution Vary by Ecosystem) — a critical calibration for all velocity predictions.

## Step 4: Assess Climatic Patterns by Category

For each of the 6 categories, evaluate which patterns are actively affecting this specific landscape. Do not simply list all 32 patterns — assess which are demonstrably active, which are latent (approaching but not yet dominant), and which are not currently relevant.

For each **active** or **latent** pattern, provide:

```text
Pattern: [Pattern Name and Number] — [Category]
Status: Active / Latent / Not relevant
Evidence: [1-3 sentences of specific evidence from the map, domain context, or user arguments]
Primary components affected: [component names from the WARD artifact]
Impact: High / Medium / Low
Strategic implication for this landscape: [Specific — not a copy of the generic implication from the reference]
Time horizon: < 12 months / 1-3 years / 3+ years
```

### Category 1: Component Patterns (8 patterns)

Assess all 8 patterns from the reference file:

**1.1 Everything Evolves Through Supply and Demand Competition**
Are components actively moving along the evolution axis? What is driving that movement in this specific domain?

**1.2 Rates of Evolution Can Vary by Ecosystem**
Is this a fast-moving consumer ecosystem or a slow-moving industrial/government one? What modulating factors (regulation, investment, inertia) affect speed?

**1.3 Characteristics Change as Components Evolve**
Are any components at stage boundaries where management approach, team structure, or contract type should be changing? Mismatches are active strategic risks.

**1.4 No Choice Over Evolution — The Red Queen Effect**
Where is the organisation or its competitors running just to stay in place? Is there evidence of competitive pressure forcing adaptation?

**1.5 No Single Method Fits All**
Is there evidence that a single methodology (agile, waterfall, lean, ITIL) is being applied across components at different evolution stages — creating systematic inefficiency?

**1.6 Components Can Co-evolve**
Which components are co-evolving? Are there "enabler components" — if they evolve (or are evolved by a competitor), which other components would be dragged along?

**1.7 Evolution Consists of Multiple Waves with Many Chasms**
Which components are currently in a chasm (adoption stalled between waves)? What is blocking the next adoption wave?

**1.8 Commoditisation Does Not Equal Centralisation**
Is there an assumption in the strategy that commoditisation will lead to consolidation? Is that assumption valid for this specific market context?

### Category 2: Financial Patterns (6 patterns)

**2.1 Higher Order Systems Create New Sources of Value**
Are any clusters of recently commoditising components creating the foundation for new higher-order systems? What new value streams are becoming possible?

**2.2 Efficiency Does Not Mean Reduced Spend — Jevons Paradox**
Where are efficiency gains likely to trigger increased consumption rather than cost reduction? Where are cost-saving projections likely to be wrong?

**2.3 Capital Flows to New Areas of Value**
Where is capital (financial, talent, attention) flowing in this domain? What does that flow signal about the next wave of value creation?

**2.4 Creative Destruction — The Schumpeter Effect**
What genesis-stage components, if they evolve, would make current commodity positions irrelevant? What incumbent positions are most vulnerable?

**2.5 Future Value is Inversely Proportional to Certainty**
Where is the strategy over-weighted toward certain opportunities (accepting low returns) and under-weighted toward uncertain bets?

**2.6 Evolution to Higher Order Systems Increases Local Order and Energy Consumption**
Have full infrastructure and resource costs been accounted for in the higher-order systems being built? Where is there hidden resource consumption?

### Category 3: Speed Patterns (5 patterns)

**3.1 Efficiency Enables Innovation — The Componentization Effect**
Which Custom-Built components should be replaced with commodity solutions to free resources for higher-value innovation? Where is the organisation building what it should be buying?

**3.2 Evolution of Communication Mechanisms Increases Overall Evolution Speed**
Are there communication bottlenecks (organisational, technical, process) that are slowing the evolution of key components?

**3.3 Increased Stability of Lower Order Systems Increases Agility**
Are foundational/infrastructure components stable and commodity-grade enough to support rapid innovation at higher levels? Or are lower-order instabilities forcing engineering attention downward?

**3.4 Change Is Not Always Linear — Discontinuous and Exponential Change Exists**
Which components in this landscape could exhibit exponential or discontinuous change? Are current plans robust to non-linear scenarios?

**3.5 Product-to-Utility Shifts Demonstrate Punctuated Equilibrium**
Which Product-stage components are approaching a punctuated shift to utility? What are the triggers, and is the organisation positioned to lead or survive the shift?

### Category 4: Inertia Patterns (3 patterns)

**4.1 Success Breeds Inertia**
Where is the organisation resisting evolution because current revenue, culture, or identity depends on the status quo? Name specific components or capabilities.

**4.2 Inertia Can Kill an Organisation**
If a new entrant built this value chain on commodity infrastructure today, what would their cost structure and speed look like? Where is the gap existential?

**4.3 Inertia Increases the More Successful the Past Model Is**
Where is success so profound that honest self-assessment of the model's future viability is compromised? Where are self-disruption mechanisms needed?

### Category 5: Competitor Patterns (2 patterns)

**5.1 Competitors' Actions Will Change the Game**
Which competitor action, if taken, would most fundamentally change the basis of competition? Has this scenario been planned for?

**5.2 Most Competitors Have Poor Situational Awareness**
What would a competitor's map of this landscape look like if drawn by their most capable strategist? Where does your map reveal blind spots they likely have?

### Category 6: Prediction Patterns (8 patterns)

**6.1 Not Everything is Random — P[what] vs P[when]**
Which evolutionary directions are high-confidence (P[what]) even if timing is uncertain (P[when])? Which strategic commitments are anchored to timing rather than direction?

**6.2 Economy Has Cycles — Peace, War, and Wonder**
Which phase is the core market in? Which phase transition should the organisation be preparing for? (Full analysis in Step 7.)

**6.3 Different Forms of Disruption — Predictable vs Unpredictable**
Which disruptions are predictable (plan for them) and which require resilience (prepare for but cannot predict)? Maintain separate portfolios.

**6.4 A "War" (Point of Industrialisation) Causes Organisations to Evolve**
Is there a component approaching industrialisation that will trigger a "war"? What are the early warning signs?

**6.5 You Cannot Measure Evolution Over Time or Adoption**
Are there investment commitments that depend on specific adoption timing? How robust are they if timing is wrong by 2-3 years?

**6.6 The Less Evolved Something Is, the More Uncertain It Becomes**
Are Genesis-stage components being managed with commodity-appropriate certainty, or commodity components with Genesis-appropriate uncertainty? Both are systematic errors.

**6.7 Not Everything Survives**
Which components have a non-trivial probability of not surviving the next evolution cycle? What is the exit or transition plan?

**6.8 Embrace Uncertainty**
How many current strategic commitments would fail if one key uncertainty resolved differently? Is the strategy robust across a range of futures?

## Step 5: Per-Component Impact Matrix

Create a matrix showing which climatic patterns most significantly affect each component. Focus on patterns assessed as Active or Latent (skip Not Relevant).

| Component | Stage | Highest-Impact Patterns | Combined Impact | Strategic Priority |
|-----------|-------|------------------------|-----------------|-------------------|
| [Name] | [G/C/P/Cmd] | [Pattern 1.1, 3.5, 4.1, etc.] | H/M/L | [High/Medium/Low] |

**Most-affected components**: Identify the 3-5 components where the cumulative climate impact is highest. These are the strategic focal points for the roadmap.

**Least-affected components**: Identify components where the landscape is relatively stable and low climate intensity.

## Step 6: Prediction Horizons

For each component with High or Medium strategic priority, provide a structured prediction:

```text
Component: [Name]
Current Stage: [Genesis/Custom-Built/Product/Commodity] at evolution position [0.0-1.0]

P[what]: [What will happen — directional prediction, high confidence]
P[when]: [Timing uncertainty — Low/Medium/High]

6-month prediction: [Specific, observable expected state]
18-month prediction: [Specific, observable expected state]

Confidence level: High / Medium / Low
Key assumptions: [1-2 assumptions that underpin these predictions]
Key signals to watch: [Observable indicators that would confirm or refute]
  - Signal 1: [What to watch and what it means]
  - Signal 2: [What to watch and what it means]

Recommended response:
  Urgency: High / Medium / Low
  Primary action: [Specific action to take now or monitor for]
```

## Step 7: Wave Analysis — Peace/War/Wonder Positioning

Position the overall landscape within the Peace/War/Wonder cycle. This is one of the most strategically significant outputs of the climate assessment.

### Landscape Phase Assessment

For the primary market/domain of this landscape, assess which phase it is in:

**Peace indicators present?** (feature competition, incremental improvement, stable margins, well-understood supply chains)

- Evidence for: {list}
- Evidence against: {list}

**War indicators present?** (industrialisation of a key component underway, new entrants with commodity infrastructure, pricing pressure accelerating, incumbent business models under existential threat)

- Evidence for: {list}
- Evidence against: {list}

**Wonder indicators present?** (new higher-order systems emerging, rapid genesis, capital flooding into new value areas, multiple competing paradigms)

- Evidence for: {list}
- Evidence against: {list}

**Phase conclusion**: The landscape is currently in [Peace/War/Wonder/Transition from X to Y]

**Phase confidence**: High / Medium / Low — [rationale]

### Component-Level Phase Analysis

Different components may be in different phases. For key components:

| Component | Phase | Evidence | Signs of Next Phase Transition |
|-----------|-------|----------|-------------------------------|
| [Name] | Peace/War/Wonder | [brief] | [what to watch] |

### Strategic Posture Recommendation

Based on the phase:

**If Peace**: [Specific recommendations — operational excellence focus, moat-building, watching for War triggers]

**If War**: [Specific recommendations — rapid transformation imperatives, which custom-built components to shed, coalition/acquisition needs]

**If Wonder**: [Specific recommendations — exploration portfolio, genesis bets, early-mover positioning]

**Phase transition preparedness**: Is the organisation positioned for the next phase transition? What preparation is needed before the transition begins?

## Step 8: Inertia Assessment

For each component where inertia was identified (from the WARD artifact or from pattern 4.1-4.3 assessment above):

```text
Component: [Name]
Inertia Type: Success / Capital / Political / Skills / Supplier / Consumer / Cultural
Severity: High / Medium / Low

Evidence: [Specific evidence of this inertia type for this component]
Climate amplifier: [Which climatic pattern makes this inertia more dangerous?]
  — e.g., "Inertia Kills (4.2) + War Phase approaching = existential risk if not addressed"

Mitigation strategy: [Specific, actionable]
  Urgency: High / Medium / Low
  Responsible party: [Role or team]
  Timeline: [When must this be addressed to avoid strategic harm]
  Success indicator: [Observable sign that inertia is reducing]
```

**Overall inertia risk rating**: {High/Medium/Low} — {brief rationale}

If no inertia is identified across any components, explicitly state: "No significant organisational or market inertia detected. Note: absence of inertia signals is itself unusual — verify this against WDOC doctrine assessment if available."

## Step 9: Generate Output

Create the climate assessment document using the template:

**File Location**: `projects/{project_number}-{project_name}/wardley-maps/ARC-{PROJECT_ID}-WCLM-{NNN}-v1.0.md`

**Naming Convention**:

- `ARC-001-WCLM-001-v1.0.md` — First climate assessment for project 001
- `ARC-001-WCLM-002-v1.0.md` — Second assessment (e.g., after updated map)

**Read the template** (with user override support):

- **First**, check if `.arckit/templates/wardley-climate-template.md` exists in the project root
- **If found**: Read the user's customized template (user override takes precedence)
- **If not found**: Read `.arckit/templates/wardley-climate-template.md` (default)

> **Tip**: Users can customise templates with `/arckit:customize wardley.climate`

---

**CRITICAL - Auto-Populate Document Control Fields**:

Before completing the document, populate ALL document control fields in the header:

**Construct Document ID**:

- **Document ID**: `ARC-{PROJECT_ID}-WCLM-{NNN}-v{VERSION}` (e.g., `ARC-001-WCLM-001-v1.0`)
- Sequence number `{NNN}`: Check existing files in `wardley-maps/` and use the next WCLM number (001, 002, ...)

**Populate Required Fields**:

*Auto-populated fields* (populate these automatically):

- `[PROJECT_ID]` → Extract from project path (e.g., "001" from "projects/001-project-name")
- `[VERSION]` → "1.0" (or increment if previous version exists)
- `[DATE]` / `[YYYY-MM-DD]` → Current date in YYYY-MM-DD format
- `[DOCUMENT_TYPE_NAME]` → "Wardley Climate Assessment"
- `ARC-[PROJECT_ID]-WCLM-{NNN}-v[VERSION]` → Construct using format above
- `[COMMAND]` → "arckit.wardley.climate"

*User-provided fields* (extract from project metadata or user input):

- `[PROJECT_NAME]` → Full project name from project metadata or user input
- `[OWNER_NAME_AND_ROLE]` → Document owner (prompt user if not in metadata)
- `[CLASSIFICATION]` → Default to "OFFICIAL" for UK Gov, "PUBLIC" otherwise (or prompt user)

*Calculated fields*:

- `[YYYY-MM-DD]` for Review Date → Current date + 30 days

*Pending fields* (leave as [PENDING] until manually updated):

- `[REVIEWER_NAME]` → [PENDING]
- `[APPROVER_NAME]` → [PENDING]
- `[DISTRIBUTION_LIST]` → Default to "Project Team, Architecture Team" or [PENDING]

**Populate Revision History**:

```markdown
| 1.0 | {DATE} | ArcKit AI | Initial creation from `/arckit:wardley.climate` command | [PENDING] | [PENDING] |
```

**Populate Generation Metadata Footer**:

```markdown
**Generated by**: ArcKit `/arckit:wardley.climate` command
**Generated on**: {DATE} {TIME} GMT
**ArcKit Version**: {ARCKIT_VERSION}
**Project**: {PROJECT_NAME} (Project {PROJECT_ID})
**AI Model**: [Use actual model name, e.g., "claude-sonnet-4-5-20250929"]
**Generation Context**: [Brief note about source documents used — WARD, REQ, RSCH, etc.]
```

---

### Output Contents

The Wardley Climate Assessment document must include:

1. **Executive Summary**: Domain assessed, total patterns active/latent, most critical findings, phase positioning (2-3 paragraphs)

2. **Component Inventory**: Table of all map components with evolution stage and inertia status

3. **Pattern Assessment by Category**: All 6 categories with Active/Latent/Not Relevant verdict and evidence for each applicable pattern

4. **Per-Component Impact Matrix**: Table showing which patterns affect which components and combined impact rating

5. **Prediction Horizons**: Structured 6-month and 18-month predictions for high-priority components

6. **Peace/War/Wonder Wave Analysis**: Phase positioning with evidence, component-level phase table, and strategic posture recommendations

7. **Inertia Assessment**: Per-component inertia register with type, severity, mitigation, and urgency

8. **Pattern Interaction Analysis**: Which patterns are reinforcing each other, which are in tension, and what cascade sequences are active

9. **Strategic Implications Summary**: Prioritised list of strategic implications for the architecture team

10. **Traceability**: Link to WARD artifact, source documents used, external documents read

## Step 10: Integration with ArcKit Workflow

### Wardley Mapping Suite

This command is part of the Wardley Mapping suite:

```bash
# Foundation: always run first
/arckit:wardley — Create Wardley Map (required WARD artifact)

# Analysis layer: run after map creation
/arckit:wardley.climate — Assess climatic patterns (WCLM artifact) ← you are here
/arckit:wardley.gameplay — Select gameplays informed by climate forces (WGAM artifact)

# Execution layer: run after analysis
/arckit:roadmap — Create execution roadmap
/arckit:strategy — Synthesise into architecture strategy
```

### Before Climate Assessment

If WARD artifact does not exist:

```bash
"A Wardley Map is required. Run `/arckit:wardley` first to create your map, then return here."
```

If market research (RSCH) is missing:

```bash
"Note: No market research (RSCH) found. Climate patterns are most accurately assessed with market
evidence. Consider running `/arckit:research` to gather vendor landscape and market dynamics data,
then re-run this climate assessment. Proceeding with map-only context — findings will be less
evidence-grounded."
```

### After Climate Assessment

Recommend next steps based on key findings:

```bash
# If War phase detected
"Your climate assessment identifies War phase dynamics — rapid industrialisation is underway.
This is the most urgent strategic scenario. Run `/arckit:wardley.gameplay` immediately to identify
which plays are appropriate for War phase execution. Key: Managing Inertia, Open Approaches,
and Centre of Gravity plays are typically highest priority in War."

# If high-severity inertia detected
"Significant organisational inertia was identified for {components}. This must be addressed
before gameplay execution plans can succeed. Consider running `/arckit:strategy` to create
an inertia-mitigation architecture strategy."

# If evolution velocity surprises identified
"Climate patterns suggest {components} will evolve faster/slower than the map currently shows.
Consider running `/arckit:wardley` to update component positions, then re-run gameplay analysis."

# If UK Government project
"As a UK Government project, climate patterns affecting procurement (TCoP compliance windows,
G-Cloud framework evolution, open standards mandates) should be reflected in your procurement
strategy. Run `/arckit:tcop` to validate compliance positioning."
```

## Important Notes

### Climate Assessment Quality Standards

**Good Climate Assessment**:

- Patterns assessed with specific evidence from the map and domain context
- Phase positioning supported by multiple evidence points
- Predictions separate P[what] from P[when]
- Inertia identified and quantified by type and severity
- Pattern interactions and cascades identified
- Component-specific impact matrix completed
- Assessment questions from reference file applied to each component

**Poor Climate Assessment**:

- Generic pattern descriptions not tied to specific components
- Phase assessment without supporting evidence
- Predictions with false precision on timing
- Inertia overlooked or underestimated
- All 32 patterns listed as "active" without discrimination
- No component-level impact assessment

### Evidence Quality Levels

When evidence is available from market research, external documents, or domain expertise, explicitly note the source. When evidence is inferred from map position alone, note this as lower-confidence.

**Evidence quality scale**:

- **High**: Market research documents, analyst reports, direct competitive intelligence → strong confidence
- **Medium**: Domain knowledge, user input, contextual inference from map → medium confidence
- **Low**: Map-position inference only, generic domain characteristics → flag as lower confidence

All pattern assessments should note their evidence quality level so readers understand confidence.

### Pattern Relevance Threshold

Not all 32 patterns will be actively relevant for every map. Be selective:

- **Active patterns**: Demonstrably affecting the landscape now — include with full evidence
- **Latent patterns**: Building but not yet dominant — include with watch signals
- **Not relevant**: Not materially affecting this landscape — state why briefly rather than omitting silently

Selective relevance assessment is a quality signal. An assessment that declares all 32 patterns equally active has not done the filtering work.

---

- **Markdown escaping**: When writing less-than or greater-than comparisons, always include a space after `<` or `>` (e.g., `< 3 seconds`, `> 99.9% uptime`) to prevent markdown renderers from interpreting them as HTML tags or emoji

Before writing the file, read `.arckit/references/quality-checklist.md` and verify all **Common Checks** plus any applicable **WARD** per-type checks pass. Fix any failures before proceeding.

## Final Output

Generate a comprehensive Wardley Climate Assessment document saved to:

**`projects/{project_number}-{project_name}/wardley-maps/ARC-{PROJECT_ID}-WCLM-{NUM}-v{VERSION}.md`**

The document must be:

- Evidence-grounded (patterns supported by specific evidence, not generic descriptions)
- Component-specific (impact matrix maps patterns to actual map components)
- Predictive (structured P[what]/P[when] forecasts for key components)
- Phase-positioned (War/Peace/Wonder assessment with strategic posture)
- Inertia-mapped (all inertia points identified with type, severity, mitigation)

After creating the document, provide a summary to the user:

```text
Wardley Climate Assessment Complete: {document_name}

Location: projects/{project}/wardley-maps/ARC-{PROJECT_ID}-WCLM-{NUM}-v{VERSION}.md

Patterns Assessed: {total} across 6 categories
  Active: {count}
  Latent (approaching): {count}
  Not relevant: {count}

Most-Affected Components:
1. {Component name} — {top patterns active, combined impact}
2. {Component name} — {top patterns active, combined impact}
3. {Component name} — {top patterns active, combined impact}

Key Predictions:
- {Component}: {6-month prediction} → {18-month prediction} [confidence: H/M/L]
- {Component}: {6-month prediction} → {18-month prediction} [confidence: H/M/L]

Wave Position: {Peace/War/Wonder} — {one-sentence rationale}

Inertia Risk: {High/Medium/Low} — {key inertia points if any}

Next Steps:
- /arckit:wardley.gameplay — Select plays informed by this climate assessment
- /arckit:wardley — Update map if evolution velocity findings change component positions
- /arckit:strategy — Synthesise climate findings into architecture strategy
```

---

**Remember**: Climatic patterns are not threats to manage or opportunities to exploit — they are the environment you are operating in. The goal of climate assessment is not to fight the weather, but to dress appropriately for it.

## Suggested Next Steps

After completing this command, consider running:

- `/arckit:wardley.gameplay` -- Select gameplays informed by climate forces
- `/arckit:wardley` -- Update map with climate-driven evolution predictions *(when Climate analysis reveals evolution velocity changes)*
