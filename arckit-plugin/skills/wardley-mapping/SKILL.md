---
name: wardley-mapping
description: "This skill should be used when the user asks about Wardley Mapping, evolution stages, strategic positioning, situational awareness, technology evolution, or competitive landscape. Covers creating maps, gameplay patterns, doctrine, build vs. buy, inertia, and quantitative analysis. Triggers: create a wardley map, map our value chain, what evolution stage is this component, should we build or buy, assess doctrine maturity, analyze competitive landscape, where should we invest vs outsource, score evolution, calculate ubiquity, quantitative positioning, evolution formula, differentiation pressure, commodity leverage, weak signal detection, readiness score."
---

# Wardley Mapping

A strategic mapping technique created by Simon Wardley for understanding competitive landscape, technology evolution, and making informed architectural decisions. A Wardley Map visualizes four dimensions: the **value chain** (components needed to meet user needs), **evolution** (how components mature over time), the **landscape** (competitive environment), and **movement** (how the landscape changes).

## Map Structure

The following diagram illustrates the conceptual axes of a Wardley Map. For the generation template with placeholders, see the Map Template section below.

```text
                    EVOLUTION

        Genesis    Custom     Product    Commodity
           ↓          ↓          ↓          ↓
        ┌──────────────────────────────────────────┐
        │                                          │
Visible │   User Need ●                            │  ← Anchor
        │       │                                  │
        │       ↓                                  │
        │   Component A ●──────────→ ●             │
        │       │                                  │
        │       ↓                                  │
        │   Component B    ●                       │
        │       │                                  │
Hidden  │       ↓                                  │
        │   Component C              ●             │
        │       │                                  │
        │       ↓                                  │
        │   Component D                       ●    │  ← Commodity
        │                                          │
        └──────────────────────────────────────────┘

        Y-axis: Visibility (to user)
        X-axis: Evolution (certainty)
```

## Evolution Stages (Summary)

| Stage | Position | Key Trait | Sourcing | Example |
|-------|----------|-----------|----------|---------|
| **Genesis** | Far left (0.0-0.25) | Novel, uncertain, high failure | Build (R&D) | Novel AI architectures |
| **Custom-Built** | Center-left (0.25-0.50) | Understood but bespoke, differentiating | Build (custom dev) | Bespoke trading platform |
| **Product** | Center-right (0.50-0.75) | Multiple vendors, feature competition | Buy (configure) | CRM systems |
| **Commodity** | Far right (0.75-1.0) | Well understood, essential, utility | Outsource (consume) | Cloud compute (IaaS) |

For detailed stage characteristics, indicators, and positioning criteria, see [references/evolution-stages.md](references/evolution-stages.md).

## How to Create a Wardley Map

Follow these steps in order when the user asks to create or analyze a Wardley Map.

### Step 1: Gather Context

Use the AskUserQuestion tool to interactively gather the information needed to create the map. Ask up to 3 questions at a time.

**First, identify the anchor and scope:**

Use AskUserQuestion to ask:
- **Who is the primary user?** — Options might include: "External customers", "Internal developers", "Business analysts", or let the user specify
- **What is the user need?** — e.g., "Purchase products online", "Deploy applications reliably", "Generate analytical reports"
- **What is the scope?** — Options: "Single product/service", "Business unit", "Entire organization", "Specific capability"

**Then, gather strategic context:**

Use AskUserQuestion to ask:
- **What is the primary goal?** — Options: "Identify investment priorities", "Evaluate build vs. buy", "Assess competitive position", "Plan technology evolution"
- **What industry/domain?** — Let the user specify (affects how components are positioned on the evolution axis)
- **What depth of analysis?** — Options: "Quick overview (5-10 components)", "Standard map (10-20 components)", "Deep analysis (20+ components with gameplay)"

### Step 2: Build the Value Chain

Work backwards from the user need. List every component required to deliver it, then arrange them by visibility (user-facing at top, infrastructure at bottom). For each component, identify what it depends on — dependencies flow downward.

- List **capabilities**, not just technologies
- Include **people, practices, and data** alongside technical components
- Map both **technical and business** components
- Ask: "What components are needed?", "What does each depend on?", "What is hidden from the user?"

If component identification is uncertain, use AskUserQuestion to ask the user about key capabilities, technologies, and processes in their domain.

### Step 3: Position on Evolution

For each component, assess its evolution stage using the indicators in [references/evolution-stages.md](references/evolution-stages.md). Place it on the X-axis accordingly.

Key questions for each component:
- How well understood is it in the market?
- How many alternatives exist?
- Is it commoditized or unique?
- What's the market maturity?

Avoid common mistakes: don't position based on age (use market maturity), don't confuse internal unfamiliarity with market-wide genesis, and always consider industry context.

If positioning is ambiguous for key components, use AskUserQuestion to clarify with the user — e.g., "Is your recommendation engine a custom differentiator or are you using an off-the-shelf product?"

### Step 4: Add Movement

Add arrows showing how components are evolving. All components naturally drift rightward over time, but some move faster or slower.

- `→` Natural evolution (component moving right over time)
- `×` Inertia (resistance to movement from past success, skills, or politics)
- `>>` Acceleration (forced rapid evolution from competition or disruption)

### Step 5: Analyze and Recommend

After drawing the map, apply the analysis checklist below, then review gameplay patterns in [references/gameplay-patterns.md](references/gameplay-patterns.md) and climatic patterns in [references/climatic-patterns.md](references/climatic-patterns.md) to identify strategic moves.

Use AskUserQuestion to confirm priorities with the user before finalizing recommendations — e.g., "The map suggests these three strategic moves. Which areas are most important to your organization right now?"

### Step 6: Quantitative Analysis (Optional)

When the user asks for numeric precision, scoring, or data-driven positioning, apply the mathematical models from [references/mathematical-models.md](references/mathematical-models.md):

1. **Evolution Scoring** — Score each component's Ubiquity (0-1) and Certainty (0-1), then calculate `E(c) = (U + C) / 2` to get a precise X-axis position. Use the rubrics in [references/evolution-stages.md](references/evolution-stages.md) for scoring guidance.

2. **Decision Metrics** — For each component, calculate:
   - **Differentiation Pressure**: `D(v) = visibility × (1 - evolution)` — high means invest to differentiate
   - **Commodity Leverage**: `K(v) = (1 - visibility) × evolution` — high means outsource/consume
   - **Dependency Risk**: `R(a,b) = visibility(a) × (1 - evolution(b))` — high means critical dependency on immature component

3. **Weak Signal Detection** — When the user asks whether a component is about to transition stages, assess the four readiness factors (Concept, Technology, Suitability, Attitude) and calculate `R(t) = C × T × S × A`. A score above 0.7 signals imminent transition.

Present results as a table alongside the qualitative analysis — the numbers should confirm or challenge the intuitive positioning, not replace it.

## Analysis Checklist

Apply this checklist to every completed map:

```yaml
analysis_checklist:
  completeness:
    - "Is the anchor (user need) clearly defined?"
    - "Are all components necessary to meet the need included?"
    - "Are dependencies shown?"
    - "Are movement arrows present?"

  positioning:
    - "Is each component positioned based on market evolution, not internal capability?"
    - "Are commodity components on the right?"
    - "Are genuinely novel components on the left?"

  insights:
    - "What components have inertia?"
    - "Where are there opportunities to commoditize?"
    - "What genesis activities could become differentiators?"
    - "Where is there technical debt (building custom where products exist)?"

  strategic:
    - "What gameplay patterns apply?"
    - "Where should we invest vs. outsource?"
    - "What climatic patterns affect our landscape?"
    - "What doctrine weaknesses exist?"
```

For deeper strategic analysis, consult:
- [Gameplay Patterns](references/gameplay-patterns.md) for offensive/defensive moves and build vs. buy guidance
- [Climatic Patterns](references/climatic-patterns.md) for external forces affecting the landscape
- [Doctrine](references/doctrine.md) for organizational maturity weaknesses

## Map Template

Always produce the visual map using the template below. Also produce the structured YAML output (using the Output Format section) when writing the map to a file; for conversational responses, the visual map alone is sufficient.

Use this template when generating a visual Wardley Map:

```text
Title: {Map Name}
Anchor: {User Need}
Date: {ISO-8601}

                    Genesis    Custom     Product    Commodity
                       │          │          │          │
Visible            ┌───┼──────────┼──────────┼──────────┼───┐
                   │   │          │          │          │   │
                   │   │  {User Need}                       │
                   │   │      │                             │
                   │   │      ↓                             │
                   │   │  {Component 1}    ●──────→         │
                   │   │      │                             │
                   │   │      ├───────────────┐             │
                   │   │      ↓               ↓             │
                   │   │  {Component 2}  {Component 3}      │
                   │   │      ●               ●             │
                   │   │      │               │             │
                   │   │      ↓               │             │
                   │   │  {Component 4}       │             │
                   │   │           ●          │             │
Hidden             │   │           │          │             │
                   │   │           ↓          ↓             │
                   │   │  {Component 5}───────┘             │
                   │   │                  ●                 │
                   │   │                                    │
                   └───┴────────────────────────────────────┘

Legend: ● Current position, → Evolution direction, × Inertia
```

## Output Format

When generating a Wardley Map document, use this structure:

```yaml
wardley_map:
  metadata:
    title: "{Map Name}"
    author: "{Author}"
    date: "{ISO-8601}"
    version: "1.0"
    scope: "{What this map covers}"

  anchor:
    user: "{User description}"
    need: "{User need statement}"

  components:
    - name: "{Component Name}"
      evolution: "{Genesis/Custom/Product/Commodity}"
      position: "{0.0-1.0}"
      visibility: "{0.0-1.0}"
      depends_on:
        - "{Dependency 1}"
        - "{Dependency 2}"
      notes: "{Strategic notes}"
      movement: "{evolving/accelerating/inertia/none}"

  analysis:
    opportunities:
      - "{Opportunity 1}"
      - "{Opportunity 2}"

    threats:
      - "{Threat 1}"
      - "{Threat 2}"

    inertia_points:
      - component: "{Component}"
        reason: "{Why inertia exists}"

  recommendations:
    immediate:
      - "{Action with rationale}"
    short_term:
      - "{Action with rationale}"
    long_term:
      - "{Action with rationale}"
```

## References

Consult these reference files for deeper analysis:

- [Evolution Stages](references/evolution-stages.md) — Detailed stage characteristics, indicators, and positioning criteria
- [Climatic Patterns](references/climatic-patterns.md) — External forces affecting the landscape (economic, competitive, technology, market patterns)
- [Gameplay Patterns](references/gameplay-patterns.md) — Offensive/defensive strategic moves, build vs. buy vs. outsource, anti-patterns
- [Doctrine](references/doctrine.md) — Universal strategy patterns and organizational maturity assessment
- [Mapping Examples](references/mapping-examples.md) — Worked examples: E-Commerce, DevOps Platform, ML Product
- [Mathematical Models](references/mathematical-models.md) — Evolution scoring formulas, decision metrics, weak signal detection

## ArcKit Integration

This skill handles **conversational** Wardley Mapping — quick questions, evolution stage lookups, doctrine assessments, and interactive map creation.

For **formal architecture documents** with document control, project integration, UK Government compliance (TCoP, GDS, AI Playbook), and OnlineWardleyMaps syntax for https://create.wardleymaps.ai, use the `/arckit:wardley` command instead. It generates versioned Wardley Map artifacts saved to your project directory with full traceability to requirements and architecture principles.
