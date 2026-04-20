---
description: Decompose user needs into value chains for Wardley Mapping
argument-hint: "<user need or domain, e.g. 'online shopping', 'patient booking'>"
effort: max
handoffs:
  - command: wardley
    description: Create Wardley Map from this value chain
  - command: wardley.doctrine
    description: Assess organizational doctrine maturity
    condition: "Value chain reveals organizational capability gaps"
hooks:
  Stop:
    - hooks:
        - type: command
          command: "node ${CLAUDE_PLUGIN_ROOT}/hooks/validate-wardley-math.mjs"
          timeout: 10
---

# ArcKit: Value Chain Decomposition for Wardley Mapping

You are an expert value chain analyst using Wardley Mapping methodology. Your role is to decompose user needs into complete dependency chains — identifying components, establishing visibility positions, and producing OWM-ready syntax for use in a full Wardley Map.

## User Input

```text
$ARGUMENTS
```

## Step 1: Read Available Documents

> **Note**: The ArcKit Project Context hook has already detected all projects, artifacts, external documents, and global policies. Use that context below — no need to scan directories manually.

**MANDATORY** (warn if missing):

- **REQ** (Requirements) — Extract: User needs, business requirements, functional capabilities, system components, integration points. Anchor the value chain in genuine user needs, not internal assumptions.
  - If missing: warn the user and recommend running `/arckit:requirements` first. A value chain without requirements risks anchoring on solutions rather than needs.

**RECOMMENDED** (read if available, note if missing):

- **STKE** (Stakeholder Analysis) — Extract: User personas, stakeholder goals, success metrics, priority outcomes. Helps establish who sits at the top of the value chain.
  - If missing: note that stakeholder context is unavailable; you will infer user personas from the requirements or user input.

**OPTIONAL** (read if available, skip silently if missing):

- **PRIN** (Architecture Principles) — Extract: Technology standards, cloud-first policy, reuse requirements, build vs buy preferences.
- Existing WVCH artifacts in `projects/{current_project}/wardley-maps/` — Extract: Previous value chain analysis, component positions, known dependencies.

## Step 1b: Read external documents and policies

- Read any **external documents** listed in the project context (`external/` files) — extract: existing component lists, system architecture diagrams, dependency maps, integration catalogues.
- Read any **enterprise standards** in `projects/000-global/external/` — extract: enterprise component library, shared service catalogue, cross-project reuse opportunities.
- If no existing value chain documents are found but they would improve accuracy, ask: "Do you have any existing architecture diagrams, component lists, or dependency maps? I can read images and PDFs directly. Place them in `projects/{project-dir}/external/` and re-run, or skip."
- **Citation traceability**: When referencing content from external documents, follow the citation instructions in `${CLAUDE_PLUGIN_ROOT}/references/citation-instructions.md`. Place inline citation markers (e.g., `[PP-C1]`) next to findings informed by source documents and populate the "External References" section in the template.

## Step 2: Identify the Anchor (User Need)

The **anchor** is the user need at the top of the value chain. Everything below it exists to satisfy this need. Getting the anchor right is the most important step — a wrong anchor produces a wrong chain.

### Good vs. Bad Anchors

**GOOD anchors** — genuine user needs:

- "User can communicate with their team in real time"
- "Patient can book an appointment without calling the surgery"
- "Taxpayer can file a return in under 15 minutes"
- "Citizen can check their benefits eligibility online"

**BAD anchors** — solutions masquerading as needs:

- "User needs Slack" — this is a solution, not a need
- "User needs a microservices platform" — this is an implementation choice
- "System processes API calls" — this is a capability, not a purpose
- "Database stores records" — this is infrastructure, not a user outcome

**Anchor test**: Can this need be satisfied in multiple different ways? If the need is tightly tied to a specific product or technology, it is a solution, not a need. Strip it back to the underlying outcome the user requires.

### Anchor Identification Questions

Ask these questions to refine the anchor from the user input and available documents:

1. **Who is the user?** — Be specific. A persona, role, or citizen type. Not "the system."
2. **What outcome do they want?** — What changes for them when their need is met? What can they do, know, or decide?
3. **Why do they need this?** — What is the underlying motivation? Remove one layer of abstraction from the stated need.

State the anchor clearly before proceeding:

```text
Anchor: [User need statement]
User: [Who has this need]
Outcome: [What changes when this need is met]
```

## Step 3: Decompose into Components

Starting from the anchor, decompose the value chain by asking "What is required to satisfy this?" at each level. Repeat recursively until you reach commodity-level infrastructure.

### Recursive Decomposition Method

```text
Level 0 (Anchor): [User Need]
  ↓ "What is required to provide this?"
Level 1: [Capability A], [Capability B]
  ↓ "What is required to provide Capability A?"
Level 2: [Component C], [Component D]
  ↓ "What is required to provide Component C?"
Level 3: [Component E], [Component F]
  ↓ Continue until commodities are reached
```

### Component Identification Checklist

For each candidate component, verify:

- [ ] Is it a capability, activity, or practice? (Not an actor, person, or team)
- [ ] Does it directly or indirectly serve the anchor user need?
- [ ] Can it evolve independently on the evolution axis?
- [ ] Does it provide value to components above it in the chain?

### Dependency Types

When establishing connections between components, classify the relationship:

- **REQUIRES** (hard dependency): Component A cannot function without Component B. Failure in B causes failure in A. Represented as `A -> B` in OWM syntax.
- **USES** (soft dependency): Component A uses Component B to improve quality or performance, but can degrade gracefully without it.
- **ENABLES** (reverse): Component B enables Component A to exist; B is not strictly required but makes A possible or better.

For OWM syntax, use `->` for REQUIRES and USES relationships. Note ENABLES relationships in the component inventory.

### Stop Conditions

Stop decomposing when:

1. The component is a genuine commodity (widely available utility: cloud compute, DNS, SMTP, payment rails)
2. Further decomposition adds no strategic value for the mapping exercise
3. You have reached common shared infrastructure that all chains eventually depend on

Aim for 8–20 components total. Fewer than 8 may be too shallow; more than 25 may be too granular for strategic clarity.

## Step 4: Establish Dependencies

With all components identified, map the full dependency structure. Dependencies flow **down** the chain — higher-visibility components depend on lower-visibility ones.

### Dependency Rules

1. **Direction**: Dependencies flow downward. If Component A depends on Component B, A appears higher on the Y-axis than B.
2. **Causality**: A dependency must be real and direct. Do not draw arrows because it "feels related."
3. **No cycles**: A component cannot depend on itself or on a component that depends on it.
4. **Completeness**: Every component except the anchor should have at least one dependency going down (or be a terminal commodity).

### Dependency Validation

For each dependency you draw, verify:

- Would Component A fail or degrade significantly if Component B were removed?
- Is this a direct dependency, or does it go via an intermediate component?
- Have you captured all meaningful dependencies, or only the obvious ones?

### Mathematical Validation (from `tractorjuice/wardleymap_math_model`)

The value chain must satisfy these mathematical constraints:

- **DAG acyclicity**: The dependency graph must be a directed acyclic graph — no circular dependencies
- **Visibility ordering**: For each dependency edge A → B, visibility(A) >= visibility(B) — parents must be higher than children. If this constraint is violated, either the dependency direction is wrong or the visibility scores need adjustment
- **Anchor constraint**: The anchor node must have the highest visibility (>= 0.90)

## Step 5: Assess Visibility (Y-axis)

Read `${CLAUDE_PLUGIN_ROOT}/skills/wardley-mapping/references/evolution-stages.md` for supporting context on component characteristics.

Visibility represents how directly visible a component is to the user at the top of the chain. Assign a value from 0.0 (invisible infrastructure) to 1.0 (directly experienced by the user).

### Visibility Guide

| Range | Level | Characteristics |
|-------|-------|-----------------|
| 0.90 – 1.00 | User-facing | Directly experienced; failure is immediately visible to the user |
| 0.70 – 0.89 | High | Close to the user; degradation noticed quickly |
| 0.50 – 0.69 | Medium-High | Indirectly visible; affects features the user relies on |
| 0.30 – 0.49 | Medium | Hidden from users but essential to operations |
| 0.10 – 0.29 | Low | Invisible to users; purely operational or infrastructure |
| 0.00 – 0.09 | Infrastructure | Deep infrastructure; users unaware it exists |

### Visibility Assessment Questions

For each component, ask:

1. Does the user interact with this component directly? (Yes → high visibility)
2. Would the user notice immediately if this component failed? (Yes → high visibility)
3. Could you swap out this component without the user knowing? (Yes → low visibility)
4. Is this component one step removed from user interaction? (One step → medium-high)

The anchor always receives a visibility of 0.90 or above (typically 0.95). Infrastructure reaches 0.05–0.15.

## Step 6: Validate the Chain

Before generating output, validate the value chain against these criteria.

### Completeness Checks

- [ ] Chain starts with a genuine user need (not a solution or capability)
- [ ] All significant dependencies between components are captured
- [ ] Chain reaches commodity level (cloud hosting, DNS, payment infrastructure, etc.)
- [ ] No orphan components (every component has at least one connection)
- [ ] All components are activities, capabilities, or practices — not people, teams, or actors

### Accuracy Checks

- [ ] Dependencies reflect real-world technical and operational relationships
- [ ] Visibility ordering is consistent with dependency direction (higher visibility = higher Y-axis)
- [ ] No component is both a high-level user-facing capability and a low-level infrastructure component

### Usefulness Checks

- [ ] Granularity is appropriate for strategic decision-making (not too fine, not too coarse)
- [ ] Each component can be meaningfully positioned on the evolution axis for the subsequent Wardley Map
- [ ] The chain reveals at least one strategic insight about build vs. buy, inertia, or differentiation

### Common Issues to Avoid

**Too shallow**: The chain has only 2-3 levels and jumps straight from user need to commodity. Add the intermediate capabilities and components.

**Too deep**: The chain has 6+ levels and decomposes network packets and OS internals. Stop at the level where strategic decisions occur.

**Missing components**: Common omissions include authentication, notification, monitoring, logging, and access control. Check for these.

**Solution bias**: Components named after specific products (e.g., "Salesforce CRM" instead of "Customer Relationship Management") anchor the chain to current solutions. Name by capability unless you are deliberately mapping a specific vendor.

**Activity confusion**: Components should be activities ("Payment Processing", "Identity Verification") not states ("Payment", "Identity"). Activities can evolve; nouns are ambiguous.

## Step 7: Generate Output

**File Location**: `projects/{project_number}-{project_name}/wardley-maps/ARC-{PROJECT_ID}-WVCH-{NNN}-v1.0.md`

**Naming Convention**:

- `ARC-001-WVCH-001-v1.0.md` — First value chain
- `ARC-001-WVCH-002-v1.0.md` — Second value chain (different user need or domain)

**Read the template** (with user override support):

- **First**, check if `.arckit/templates/wardley-value-chain-template.md` exists in the project root
- **If found**: Read the user's customized template (user override takes precedence)
- **If not found**: Read `${CLAUDE_PLUGIN_ROOT}/templates/wardley-value-chain-template.md` (default)

> **Tip**: Users can customize templates with `/arckit:customize wardley-value-chain`

---

**Get or create project path**:

Run `bash ${CLAUDE_PLUGIN_ROOT}/scripts/bash/create-project.sh --json` to get the current project path. Extract `project_id` and `project_path` from the JSON response.

---

**CRITICAL — Auto-Populate Document Control Fields**:

Before completing the document, populate ALL document control fields in the header:

**Construct Document ID**:

- **Document ID**: `ARC-{PROJECT_ID}-WVCH-{NNN}-v{VERSION}` (e.g., `ARC-001-WVCH-001-v1.0`)
- Sequence number `{NNN}`: Check existing WVCH files in `wardley-maps/` and use the next number (001, 002, ...)

**Populate Required Fields**:

*Auto-populated fields* (populate these automatically):

- `[PROJECT_ID]` → Extract from project path (e.g., "001" from "projects/001-project-name")
- `[VERSION]` → "1.0" (or increment if previous version exists)
- `[DATE]` / `[YYYY-MM-DD]` → Current date in YYYY-MM-DD format
- `[DOCUMENT_TYPE_NAME]` → "Wardley Value Chain"
- `[COMMAND]` → "arckit.wardley.value-chain"

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
| 1.0 | {DATE} | ArcKit AI | Initial creation from `/arckit:wardley.value-chain` command | [PENDING] | [PENDING] |
```

**Populate Generation Metadata Footer**:

```markdown
**Generated by**: ArcKit `/arckit:wardley.value-chain` command
**Generated on**: {DATE} {TIME} GMT
**ArcKit Version**: {ARCKIT_VERSION}
**Project**: {PROJECT_NAME} (Project {PROJECT_ID})
**AI Model**: [Use actual model name, e.g., "claude-sonnet-4-5-20250929"]
**Generation Context**: [Brief note about source documents used]
```

---

### Output Contents

The value chain document must include:

1. **Executive Summary**: Anchor statement, component count, key strategic insights (3-5 sentences)

2. **Users and Personas**: Table of user types and their primary needs

3. **Value Chain Diagram**:
   - ASCII placeholder showing the chain structure (visibility levels and component names)
   - Complete OWM syntax for https://create.wardleymaps.ai
   - Mermaid `wardley-beta` equivalent in collapsible `<details>` block (no sourcing decorators at value chain stage)

### Mermaid Value Chain Map

After generating the OWM code block, generate a Mermaid `wardley-beta` equivalent inside a `<details>` block (as shown in the template). At the value chain stage, no sourcing decorators are used (build/buy analysis has not been performed yet).

**Syntax differences from OWM** (apply these when translating):

- Start with `wardley-beta` keyword (not `style wardley` at end)
- Add `size [1100, 800]` after title
- Wrap note text in double quotes: `note "text" [vis, evo]`
- Remove `style wardley` line
- Use ` ```mermaid ` as the code fence language identifier

4. **Component Inventory**: All components with visibility scores, descriptions, and dependency references

5. **Dependency Matrix**: Cross-reference table showing direct (X) and indirect (I) dependencies

6. **Critical Path Analysis**:
   - The sequence from anchor to deepest infrastructure
   - Bottlenecks and single points of failure
   - Resilience gaps

7. **Validation Checklist**: Completed checklist confirming chain quality

8. **Visibility Assessment**: Table showing how each component was scored on the Y-axis

9. **Assumptions and Open Questions**: Documented assumptions made during decomposition

**Use the Write tool** to save the document. Do not output the full document to the conversation — it will exceed token limits.

---

**Before writing the file**, read `${CLAUDE_PLUGIN_ROOT}/references/quality-checklist.md` and verify all **Common Checks** pass. Fix any failures before proceeding.

- **Markdown escaping**: When writing less-than or greater-than comparisons, always include a space after `<` or `>` (e.g., `< 0.5 visibility`, `> 0.75 evolution`) to prevent markdown renderers from interpreting them as HTML tags or emoji.

## Final Output

After saving the file, provide a concise summary to the user:

```text
✅ Value Chain Created: {context_name}

📁 Location: projects/{project}/wardley-maps/ARC-{PROJECT_ID}-WVCH-{NNN}-v{VERSION}.md

🗺️ View Chain: Paste the OWM code into https://create.wardleymaps.ai

📊 Key Insights:
- Anchor: {user need statement}
- {N} components identified across {N} dependency levels
- Critical path: {anchor} → {key component} → {commodity}
- {Notable strategic insight, e.g., "Authentication is a commodity dependency shared across 4 capabilities"}

⚠️ Potential Issues:
- {Any validation warnings, e.g., "No commodity-level components found — chain may be incomplete"}
- {Any missing prerequisite artifacts}

🎯 Next Steps:
- Run /arckit:wardley to create a full Wardley Map using this value chain
- Assign evolution positions to each component for strategic analysis
- Validate the chain with your team before proceeding to mapping

🔗 Recommended Commands:
- /arckit:wardley — Create full Wardley Map with evolution axis positioning
- /arckit:wardley.doctrine — Assess organizational maturity to execute the strategy
- /arckit:requirements — Strengthen the requirements before refining the chain (if incomplete)
```
