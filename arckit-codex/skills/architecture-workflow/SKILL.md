---
name: architecture-workflow
description: "This skill should be used when the user asks how to start an architecture project, which ArcKit commands to run and in what order, what workflow to follow, getting started, new project setup, guide me through, or what comes next."
---

# Architecture Workflow

Guides users through project onboarding using adaptive-depth questions and recommends a tailored command sequence.

<HARD-GATE>
Do NOT run any `/arckit:*` commands during this process. Your only output is a recommended command plan. The user decides when and what to execute. This applies regardless of how simple the project seems.
</HARD-GATE>

## Anti-Patterns

### "I already know what I need"

Even experienced architects benefit from the triage. It catches blind spots — missing compliance requirements, forgotten dependencies, stakeholder gaps. The triage is fast (3-4 questions). Skip it and you risk generating artifacts in the wrong order or missing mandatory prerequisites.

### "Just run everything"

A 30-command sequence helps nobody. The skill's job is to recommend the *right* commands for *this* project, in the *right* order. Every project is different — a compliance review needs 6 commands, not 30.

## Process

Follow these steps in order. Ask questions one at a time using AskUserQuestion. Prefer multiple-choice options.

### Step 1: Detect Project State

Automatically check the project context (no questions needed):

- Check if `projects/` directory exists and count projects
- Check for principles document (`ARC-000-PRIN-*`)
- Count existing artifacts per project

Based on findings, determine:

- **New project**: No `projects/` directory or empty — recommend starting from scratch
- **Early stage**: Projects exist but few artifacts (0-24% complete) — recommend next foundation steps
- **Mid stage**: Has requirements, some design artifacts (25-74%) — recommend design and procurement steps
- **Late stage**: Has most artifacts (75-100%) — recommend quality, compliance, and reporting steps

Display a brief status summary before asking questions:

```text
Project State: [1 project found, 4 artifacts, ~20% complete]
```

Or:

```text
Project State: No project structure found. Starting fresh.
```

### Step 2: Triage Questions

Ask these questions one at a time. Each uses AskUserQuestion with multiple-choice options.

**Question 1 — Sector:**

- UK Government (civilian departments)
- Defence (MOD, defence contractors)
- Public sector (non-UK)
- Private sector

**Question 2 — Project Type:**

- New system build
- System migration or modernization
- Procurement / vendor selection
- Data platform or analytics
- AI/ML system
- Strategy or governance review only

**Question 3 — Current Stage:**

- Just starting (no artifacts yet)
- Have stakeholders and/or requirements
- Have design artifacts (data model, research, diagrams)
- Need compliance review of existing work

**Question 4 — Primary Goal:**

- Full governance lifecycle (end-to-end)
- Specific deliverable (e.g., just requirements, just SOBC)
- Compliance check (assess existing work)
- Quick prototype documentation (minimum viable)

### Step 3: Deep Questions (Complex Projects Only)

Only ask these if the project triggers complexity:

- Sector is UK Government or Defence
- Project type is AI/ML
- Primary goal is full governance lifecycle

Ask one at a time:

**Q5 — Compliance Frameworks** (multiple select):

- GDS Service Standard
- Technology Code of Practice (TCoP)
- NCSC Cyber Assessment Framework
- AI Playbook
- JSP 440 / MOD Secure by Design
- JSP 936 / MOD AI Assurance
- None / not sure

**Q6 — Procurement** (if applicable):

- G-Cloud (Digital Marketplace)
- Digital Outcomes and Specialists (DOS)
- Open tender / framework agreement
- No procurement needed

**Q7 — Strategic Analysis:**

- Yes, need Wardley Maps and strategic positioning
- Yes, need platform design (multi-sided platform)
- No, straightforward technology choices

**Q8 — Timeline Pressure:**

- Weeks (urgent, minimum viable only)
- Months (standard delivery)
- Quarters (major programme, full governance)

### Step 4: Present Tailored Plan

Based on the answers, select the appropriate path and present the plan.

#### Decision Logic

**Base path selection:**

| Sector Answer | Base Path |
|---------------|-----------|
| Private sector or Public sector (non-UK) | [standard-path.md](references/standard-path.md) |
| UK Government | [uk-gov-path.md](references/uk-gov-path.md) |
| Defence | [defence-path.md](references/defence-path.md) |

**Modifiers (applied on top of base path):**

| Condition | Modifier |
|-----------|----------|
| Project type = AI/ML | Apply [ai-ml-path.md](references/ai-ml-path.md) |
| Project type = Data platform | Apply [data-path.md](references/data-path.md) |
| Both AI/ML and Data | Apply both modifiers |

**Scope adjustments:**

| Goal | Adjustment |
|------|------------|
| Full governance lifecycle | Show full path from base + modifiers |
| Specific deliverable | Show only the relevant phase |
| Compliance check | Show only compliance phase from base path |
| Quick prototype documentation | Show minimum viable path from base path |

| Stage | Adjustment |
|-------|------------|
| Just starting | Show full path (or scoped path) |
| Have stakeholders/requirements | Skip Phases 1-2, start from Phase 3 |
| Have design artifacts | Skip to Phase 4 (Procurement) or Phase 5 (Design Reviews) |
| Need compliance review | Skip to compliance phase |

| Timeline | Adjustment |
|----------|------------|
| Weeks | Show minimum viable path only |
| Months | Show full path, note optional commands |
| Quarters | Show full path with all optional additions |

#### Plan Output Format

Present the plan as a numbered list grouped by phase:

```text
Recommended Command Sequence
=============================

Based on: [UK Government] + [AI/ML] project, starting fresh, full lifecycle

Phase 1: Foundation
  1. $arckit-principles — Governance foundation (GDS + TCoP aligned)
  2. $arckit-stakeholders — Map DDaT roles, SROs, policy owners
  3. $arckit-risk — HMG Orange Book risk methodology

Phase 2: Business Justification
  4. $arckit-sobc — HM Treasury Green Book 5-case model
  5. $arckit-requirements — Central artifact for all downstream work

Phase 3: Design & Analysis
  6. $arckit-datascout — Discover UK Gov open data sources
  7. $arckit-data-model — Data architecture with GDPR considerations
  ...

[Total: N commands across M phases]
[Estimated duration: X-Y months]

Run commands in order. Each command will guide you through its process.
```

After presenting the plan, ask if they want to adjust anything or if they're ready to begin.

## Key Principles

- **One question at a time** — do not overwhelm with multiple questions per message
- **Multiple choice preferred** — easier to answer than open-ended
- **Adaptive depth** — simple projects get 4 questions, complex get 8
- **Scaled output** — minimum viable = 5 commands, full lifecycle = 25-30
- **No commands executed** — only present the plan, user drives execution
- **Reference existing artifacts** — skip phases where artifacts already exist

## ArcKit Integration

This skill is invoked by the `$arckit-start` command, which delegates project onboarding to this skill. Users can also trigger it by asking about getting started, command sequences, or workflow recommendations.

For the detailed command dependency matrix, see `DEPENDENCY-MATRIX.md` in the user's project root (installed by `arckit init`). For visual workflow diagrams, see `WORKFLOW-DIAGRAMS.md` in the user's project root.
