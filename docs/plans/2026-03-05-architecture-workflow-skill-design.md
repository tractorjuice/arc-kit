# Architecture Workflow Skill Design

**Date**: 2026-03-05
**Status**: Approved
**Author**: Claude + User

## Problem

ArcKit has 53 commands, 5 documented workflow paths, and a dependency matrix — but no skill-level guidance for new users. Users don't know which commands to run or in what order. The existing `/arckit:start` command provides some navigation but lacks the structured, question-driven methodology that process skills (like the Claude Code brainstorming skill) offer.

## Decision

Create a new **process skill** called `architecture-workflow` that replaces `/arckit:start` with an adaptive-depth, question-driven onboarding experience. The skill asks questions to understand the project, then presents a tailored command sequence as a plan.

## Approach

**Skill + reference files** (Approach B) — consistent with existing ArcKit skill patterns (wardley-mapping, mermaid-syntax, plantuml-syntax).

## Skill Identity

- **Name**: `architecture-workflow`
- **Location**: `arckit-claude/skills/architecture-workflow/`
- **Replaces**: `/arckit:start` (command becomes thin wrapper delegating to skill)

## File Structure

```text
arckit-claude/skills/architecture-workflow/
├── SKILL.md                           # Process methodology + question flow
└── references/
    ├── standard-path.md               # Non-government, non-AI projects
    ├── uk-gov-path.md                 # UK Government (GDS + TCoP)
    ├── defence-path.md                # MOD/Defence (JSP 440 + MOD Secure)
    ├── ai-ml-path.md                  # AI/ML projects (AI Playbook + MLOps)
    └── data-path.md                   # Data platforms (Data Mesh + DataScout)
```

## Process Flow

```text
┌─────────────────────────────┐
│ 1. DETECT PROJECT STATE     │  Check for existing artifacts
│    (automatic, no questions)│  (projects/, .arckit/, principles)
└──────────────┬──────────────┘
               ▼
┌─────────────────────────────┐
│ 2. TRIAGE (3-4 questions)   │  Sector, project type,
│    Everyone gets these      │  what stage, goals
└──────────────┬──────────────┘
               ▼
        ┌──────┴──────┐
        │  Complex?   │
        └──┬──────┬───┘
       no  │      │  yes
           ▼      ▼
┌──────────┐  ┌──────────────────┐
│ SHORT    │  │ 3. DEEP QUESTIONS│
│ PATH     │  │   (4-8 more)     │
│ (3-5     │  │   Compliance,    │
│ commands)│  │   stakeholders,  │
└────┬─────┘  │   constraints    │
     │        └────────┬─────────┘
     │                 │
     ▼                 ▼
┌─────────────────────────────┐
│ 4. PRESENT TAILORED PLAN    │  Numbered command sequence
│    with rationale per step  │  with why each matters
└─────────────────────────────┘
```

### Step 1: Detect Project State (Automatic)

- Check if `projects/` exists, count existing artifacts
- Check if `.arckit/` is set up
- Check if principles document exists
- Determines "start from scratch" vs "continue from where you left off"

### Step 2: Triage Questions (Everyone, One at a Time)

1. **Sector**: UK Government / Defence / Public sector (non-UK) / Private sector
2. **Project type**: New system build / System migration / Procurement / Data platform / AI/ML / Strategy only
3. **Current stage**: Just starting / Have requirements / Have design / Need compliance review
4. **Primary goal**: Full governance lifecycle / Specific deliverable / Compliance check / Quick prototype documentation

### Step 3: Deep Questions (Complex Projects Only)

Triggered by: UK Gov, Defence, AI/ML, or "full governance lifecycle" selections.

- Do you have existing stakeholder analysis?
- What compliance frameworks apply? (GDS, TCoP, NCSC CAF, AI Playbook, JSP 440)
- Is there procurement involved? (G-Cloud, DOS)
- Do you need Wardley Maps / strategic analysis?
- What's the timeline pressure?

### Step 4: Present Tailored Plan

- Numbered list of recommended commands in execution order
- Each entry: command name, one-line rationale, estimated artifacts produced
- Grouped by phase (Foundation, Analysis, Design, Procurement, Implementation, Compliance)
- User drives execution from here

## /arckit:start Replacement Strategy

The `/arckit:start` command becomes a thin wrapper:

```markdown
---
description: Start a new architecture project with guided workflow selection
---
Use the architecture-workflow skill to guide this user through project onboarding.
```

Users can still type `/arckit:start` but get the skill's structured methodology.

## Patterns Borrowed from Brainstorming Skill

| Pattern | Application |
|---------|-------------|
| Hard gate | Do NOT run commands, only present the plan |
| Anti-patterns | "I already know what I need" / "Just run everything" |
| One question at a time | All questions via individual `AskUserQuestion` calls |
| Multiple choice preferred | All questions use options with "Other" available |
| Adaptive depth | Simple = 3-5 commands, complex = 10-15+ |
| Scaled sections | Plan output scales with project complexity |
| Checklist with tasks | Task tracking for: detect, triage, deep, present |

## Intentional Differences from Brainstorming

- **No design doc output** — presents command sequence in conversation only
- **No skill chaining** — terminates with presented plan, user drives from there
- **No incremental section approval** — plan presented as a whole (it's a list, not a document)

## SKILL.md Specifications

~200-250 lines containing:

- Frontmatter with comprehensive trigger description
- Process overview
- Question definitions with multiple-choice options
- Decision logic mapping triage answers to path reference files
- Plan output format
- Hard gate and anti-patterns

## Reference File Specifications

Each ~80-120 lines containing:

- Path description and when it applies
- Phased command sequence (Foundation, Analysis, Design, etc.)
- Per-command rationale
- Optional vs mandatory commands for the path
- Compliance requirements specific to the path
- Example output plan
