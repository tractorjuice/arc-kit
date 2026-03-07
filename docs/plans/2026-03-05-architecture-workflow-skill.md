# Architecture Workflow Skill Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Create a process skill that replaces `/arckit:start` with an adaptive-depth, question-driven onboarding experience that recommends tailored command sequences.

**Architecture:** A new `architecture-workflow` skill in `arckit-claude/skills/` with a SKILL.md (process methodology + question flow) and 5 reference files (one per workflow path). The existing `/arckit:start` command becomes a thin wrapper delegating to the skill.

**Tech Stack:** Claude Code plugin skills (Markdown with YAML frontmatter), AskUserQuestion tool for interactive questions.

---

### Task 1: Create skill directory structure

**Files:**
- Create: `arckit-claude/skills/architecture-workflow/SKILL.md` (placeholder)
- Create: `arckit-claude/skills/architecture-workflow/references/` (directory)

**Step 1: Create the directories**

Run: `mkdir -p arckit-claude/skills/architecture-workflow/references`

**Step 2: Verify structure**

Run: `ls -la arckit-claude/skills/architecture-workflow/`
Expected: Empty directory with `references/` subdirectory

**Step 3: Commit**

```bash
git add arckit-claude/skills/architecture-workflow/
git commit -m "chore: scaffold architecture-workflow skill directory"
```

---

### Task 2: Create the standard-path reference file

**Files:**
- Create: `arckit-claude/skills/architecture-workflow/references/standard-path.md`
- Reference: `WORKFLOW-DIAGRAMS.md` lines 18-113 (Standard Project Path)
- Reference: `DEPENDENCY-MATRIX.md` lines 225-231 (Standard critical path)

**Step 1: Write the reference file**

```markdown
# Standard Project Path

## When This Path Applies

- Private sector projects
- Non-UK government public sector
- No AI/ML components
- No specific compliance framework requirements

## Phased Command Sequence

### Phase 1: Foundation (Mandatory)

| # | Command | Rationale | Artifacts |
|---|---------|-----------|-----------|
| 1 | `/arckit:principles` | Governance foundation — 21 downstream commands depend on this | ARC-000-PRIN-v1.0.md |
| 2 | `/arckit:stakeholders` | Identify who cares and what they need — drives everything downstream | ARC-{PID}-STKE-v1.0.md |
| 3 | `/arckit:risk` | Identify what could go wrong before committing resources | ARC-{PID}-RISK-v1.0.md |

### Phase 2: Business Justification

| # | Command | Rationale | Artifacts |
|---|---------|-----------|-----------|
| 4 | `/arckit:sobc` | Justify the investment before detailed technical work | ARC-{PID}-SOBC-v1.0.md |
| 5 | `/arckit:requirements` | Central artifact — 38 commands depend on this | ARC-{PID}-REQ-v1.0.md |

### Phase 3: Design & Analysis

| # | Command | Rationale | Artifacts |
|---|---------|-----------|-----------|
| 6 | `/arckit:data-model` | Define data structures from DR-xxx requirements | ARC-{PID}-DMOD-v1.0.md |
| 7 | `/arckit:research` | Technology options, build vs buy, vendor landscape | ARC-{PID}-RES-v1.0.md |
| 8 | `/arckit:wardley` | Strategic positioning and evolution analysis | ARC-{PID}-WARD-001-v1.0.md |
| 9 | `/arckit:roadmap` | Multi-year timeline from strategy analysis | ARC-{PID}-ROAD-v1.0.md |
| 10 | `/arckit:diagram` | Architecture diagrams (C4, DFD, sequence) | ARC-{PID}-DIAG-001-v1.0.md |

### Phase 4: Procurement (If Applicable)

| # | Command | Rationale | Artifacts |
|---|---------|-----------|-----------|
| 11 | `/arckit:sow` | Statement of work / RFP for vendors | ARC-{PID}-SOW-v1.0.md |
| 12 | `/arckit:evaluate` | Vendor evaluation framework and scoring | ARC-{PID}-EVAL-v1.0.md |

### Phase 5: Design Reviews

| # | Command | Rationale | Artifacts |
|---|---------|-----------|-----------|
| 13 | `/arckit:hld-review` | Validate high-level design against requirements | ARC-{PID}-HLDR-v1.0.md |
| 14 | `/arckit:dld-review` | Validate detailed design | ARC-{PID}-DLDR-v1.0.md |
| 15 | `/arckit:adr` | Record key architecture decisions | ARC-{PID}-ADR-001-v1.0.md |

### Phase 6: Implementation

| # | Command | Rationale | Artifacts |
|---|---------|-----------|-----------|
| 16 | `/arckit:backlog` | Product backlog from requirements + design | ARC-{PID}-BKLG-v1.0.md |
| 17 | `/arckit:trello` | Export backlog to Trello (optional) | Trello board |

### Phase 7: Operations & Quality

| # | Command | Rationale | Artifacts |
|---|---------|-----------|-----------|
| 18 | `/arckit:devops` | CI/CD, IaC, container orchestration strategy | ARC-{PID}-DVOP-v1.0.md |
| 19 | `/arckit:operationalize` | Operational readiness, SRE, runbooks | ARC-{PID}-OPS-v1.0.md |
| 20 | `/arckit:traceability` | End-to-end traceability matrix | ARC-{PID}-TRACE-v1.0.md |
| 21 | `/arckit:principles-compliance` | Principles adherence assessment | ARC-{PID}-PCOMP-v1.0.md |
| 22 | `/arckit:conformance` | ADR conformance checking | ARC-{PID}-CONF-v1.0.md |
| 23 | `/arckit:analyze` | Deep governance analysis | ARC-{PID}-ANAL-v1.0.md |

### Phase 8: Reporting

| # | Command | Rationale | Artifacts |
|---|---------|-----------|-----------|
| 24 | `/arckit:story` | Comprehensive project narrative | ARC-{PID}-STORY-v1.0.md |
| 25 | `/arckit:pages` | GitHub Pages documentation site | docs/index.html |

## Minimum Viable Path

For quick prototype documentation or proof of concept:

1. `/arckit:principles` → 2. `/arckit:stakeholders` → 3. `/arckit:requirements` → 4. `/arckit:research` → 5. `/arckit:diagram`

## Duration

- **Full path**: 4-8 months
- **Minimum viable**: 1-2 weeks
```

**Step 2: Verify file renders correctly**

Run: `wc -l arckit-claude/skills/architecture-workflow/references/standard-path.md`
Expected: ~90-100 lines

**Step 3: Commit**

```bash
git add arckit-claude/skills/architecture-workflow/references/standard-path.md
git commit -m "feat: add standard-path reference for architecture-workflow skill"
```

---

### Task 3: Create the uk-gov-path reference file

**Files:**
- Create: `arckit-claude/skills/architecture-workflow/references/uk-gov-path.md`
- Reference: `WORKFLOW-DIAGRAMS.md` lines 116-224 (UK Government Path)
- Reference: `DEPENDENCY-MATRIX.md` lines 236-240 (UK Gov critical path)

**Step 1: Write the reference file**

```markdown
# UK Government Project Path

## When This Path Applies

- UK Government civilian departments (non-MOD)
- Projects subject to GDS Service Standard
- Projects subject to Technology Code of Practice (TCoP)
- NCSC Cyber Assessment Framework applies
- G-Cloud or Digital Outcomes procurement likely

## Compliance Frameworks

- GDS Service Standard (14 points)
- Technology Code of Practice (TCoP)
- NCSC Cyber Assessment Framework (CAF)
- Secure by Design (civilian)
- Green Book / Orange Book (HM Treasury)

## Phased Command Sequence

### Phase 1: Foundation (Mandatory)

| # | Command | Rationale | Artifacts |
|---|---------|-----------|-----------|
| 1 | `/arckit:principles` | Governance foundation — must align with GDS and TCoP | ARC-000-PRIN-v1.0.md |
| 2 | `/arckit:stakeholders` | Map DDaT roles, SROs, policy owners | ARC-{PID}-STKE-v1.0.md |
| 3 | `/arckit:risk` | HMG Orange Book risk methodology | ARC-{PID}-RISK-v1.0.md |

### Phase 2: Business Justification

| # | Command | Rationale | Artifacts |
|---|---------|-----------|-----------|
| 4 | `/arckit:sobc` | HM Treasury Green Book SOBC with 5-case model | ARC-{PID}-SOBC-v1.0.md |
| 5 | `/arckit:requirements` | Requirements aligned to GDS service standard | ARC-{PID}-REQ-v1.0.md |

### Phase 3: Design & Analysis

| # | Command | Rationale | Artifacts |
|---|---------|-----------|-----------|
| 6 | `/arckit:datascout` | Discover UK Gov open data sources (TCoP Point 10) | ARC-{PID}-DSCT-v1.0.md |
| 7 | `/arckit:data-model` | Data architecture with GDPR/DPA considerations | ARC-{PID}-DMOD-v1.0.md |
| 8 | `/arckit:dpia` | Data Protection Impact Assessment (mandatory for personal data) | ARC-{PID}-DPIA-v1.0.md |
| 9 | `/arckit:research` | Technology research with Crown Commercial focus | ARC-{PID}-RES-v1.0.md |
| 10 | `/arckit:wardley` | Strategic positioning for GaaP components | ARC-{PID}-WARD-001-v1.0.md |
| 11 | `/arckit:roadmap` | Roadmap aligned to spending review cycles | ARC-{PID}-ROAD-v1.0.md |
| 12 | `/arckit:diagram` | Architecture diagrams (C4, sequence, DFD) | ARC-{PID}-DIAG-001-v1.0.md |

### Phase 4: Procurement (G-Cloud / DOS)

| # | Command | Rationale | Artifacts |
|---|---------|-----------|-----------|
| 13 | `/arckit:gcloud-search` | Search Digital Marketplace for G-Cloud services | Console output |
| 14 | `/arckit:gcloud-clarify` | Generate clarification questions for shortlisted services | ARC-{PID}-GCLR-v1.0.md |
| 15 | `/arckit:sow` | Statement of work for procurement | ARC-{PID}-SOW-v1.0.md |
| 16 | `/arckit:evaluate` | Vendor evaluation with value-for-money assessment | ARC-{PID}-EVAL-v1.0.md |

### Phase 5: Design Reviews

| # | Command | Rationale | Artifacts |
|---|---------|-----------|-----------|
| 17 | `/arckit:hld-review` | HLD review against GDS patterns | ARC-{PID}-HLDR-v1.0.md |
| 18 | `/arckit:dld-review` | DLD review for security and performance | ARC-{PID}-DLDR-v1.0.md |
| 19 | `/arckit:adr` | Architecture Decision Records | ARC-{PID}-ADR-001-v1.0.md |

### Phase 6: Implementation

| # | Command | Rationale | Artifacts |
|---|---------|-----------|-----------|
| 20 | `/arckit:backlog` | Product backlog from requirements + design | ARC-{PID}-BKLG-v1.0.md |

### Phase 7: Operations & Quality

| # | Command | Rationale | Artifacts |
|---|---------|-----------|-----------|
| 21 | `/arckit:devops` | CI/CD aligned to GDS technology standards | ARC-{PID}-DVOP-v1.0.md |
| 22 | `/arckit:operationalize` | Operational readiness, service desk integration | ARC-{PID}-OPS-v1.0.md |
| 23 | `/arckit:traceability` | End-to-end traceability matrix | ARC-{PID}-TRACE-v1.0.md |

### Phase 8: Compliance (UK Government Specific)

| # | Command | Rationale | Artifacts |
|---|---------|-----------|-----------|
| 24 | `/arckit:tcop` | Technology Code of Practice assessment | ARC-{PID}-TCOP-v1.0.md |
| 25 | `/arckit:secure` | Secure by Design assessment (NCSC CAF) | ARC-{PID}-SEC-v1.0.md |
| 26 | `/arckit:principles-compliance` | Principles adherence | ARC-{PID}-PCOMP-v1.0.md |
| 27 | `/arckit:conformance` | ADR conformance checking | ARC-{PID}-CONF-v1.0.md |
| 28 | `/arckit:analyze` | Deep governance analysis | ARC-{PID}-ANAL-v1.0.md |
| 29 | `/arckit:service-assessment` | GDS Service Assessment readiness | ARC-{PID}-SA-v1.0.md |

### Phase 9: Reporting

| # | Command | Rationale | Artifacts |
|---|---------|-----------|-----------|
| 30 | `/arckit:story` | Project narrative for governance boards | ARC-{PID}-STORY-v1.0.md |
| 31 | `/arckit:pages` | GitHub Pages documentation site | docs/index.html |

## Minimum Viable Path

For Alpha assessment preparation:

1. `/arckit:principles` → 2. `/arckit:stakeholders` → 3. `/arckit:requirements` → 4. `/arckit:research` → 5. `/arckit:tcop` → 6. `/arckit:secure`

## Duration

- **Full path**: 6-12 months
- **Minimum viable**: 2-4 weeks
```

**Step 2: Commit**

```bash
git add arckit-claude/skills/architecture-workflow/references/uk-gov-path.md
git commit -m "feat: add uk-gov-path reference for architecture-workflow skill"
```

---

### Task 4: Create the defence-path reference file

**Files:**
- Create: `arckit-claude/skills/architecture-workflow/references/defence-path.md`
- Reference: `WORKFLOW-DIAGRAMS.md` lines 349-461 (MOD Defence Path)
- Reference: `DEPENDENCY-MATRIX.md` lines 262-276 (MOD critical paths)

**Step 1: Write the reference file**

Content follows the same table structure as uk-gov-path but with these differences:
- Procurement uses `/arckit:dos` (Digital Outcomes and Specialists) instead of G-Cloud
- Compliance adds `/arckit:mod-secure` (JSP 440, IAMM) instead of civilian `/arckit:secure`
- If AI/ML is involved, adds `/arckit:jsp-936` (MOD AI Assurance) and `/arckit:mlops`
- Security clearance notes added
- Duration: 12-24 months (non-AI) or 18-36 months (AI)
- Critical gates: MOD Secure by Design required before Beta, JSP 936 for AI

Key differences from UK Gov path:
- Phase 4 uses DOS procurement: `/arckit:dos` → `/arckit:evaluate`
- Phase 8 compliance: `/arckit:tcop` → `/arckit:mod-secure` → `/arckit:principles-compliance` → `/arckit:conformance` → `/arckit:analyze` → `/arckit:service-assessment`
- If AI: Add `/arckit:jsp-936` after mod-secure, add `/arckit:mlops` in operations

**Step 2: Commit**

```bash
git add arckit-claude/skills/architecture-workflow/references/defence-path.md
git commit -m "feat: add defence-path reference for architecture-workflow skill"
```

---

### Task 5: Create the ai-ml-path reference file

**Files:**
- Create: `arckit-claude/skills/architecture-workflow/references/ai-ml-path.md`
- Reference: `WORKFLOW-DIAGRAMS.md` lines 227-346 (UK Gov AI Path)
- Reference: `DEPENDENCY-MATRIX.md` lines 251-258 (UK Gov AI critical path)

**Step 1: Write the reference file**

Content adds AI-specific commands to whichever base path applies:
- `/arckit:ai-playbook` — AI Playbook compliance (UK Gov)
- `/arckit:atrs` — Algorithmic Transparency Recording Standard
- `/arckit:mlops` — ML model lifecycle, training pipelines, serving
- `/arckit:jsp-936` — MOD AI Assurance (Defence only)
- Additional considerations: model governance, bias assessment, explainability

This reference is a **modifier** — it specifies which additional commands to add and where they slot in, depending on whether base path is standard, UK Gov, or Defence.

**Step 2: Commit**

```bash
git add arckit-claude/skills/architecture-workflow/references/ai-ml-path.md
git commit -m "feat: add ai-ml-path reference for architecture-workflow skill"
```

---

### Task 6: Create the data-path reference file

**Files:**
- Create: `arckit-claude/skills/architecture-workflow/references/data-path.md`

**Step 1: Write the reference file**

Content adds data-focused commands to whichever base path applies:
- `/arckit:datascout` — Discover external data sources (APIs, datasets, open data)
- `/arckit:data-model` — Comprehensive data architecture
- `/arckit:data-mesh-contract` — Federated data product contracts
- `/arckit:dpia` — Data Protection Impact Assessment
- `/arckit:platform-design` — Multi-sided platform strategy (data marketplaces)
- Cloud-specific research: `/arckit:aws-research`, `/arckit:azure-research`, `/arckit:gcp-research`

This reference is a **modifier** like ai-ml-path — specifies additions and where they slot into the base path.

**Step 2: Commit**

```bash
git add arckit-claude/skills/architecture-workflow/references/data-path.md
git commit -m "feat: add data-path reference for architecture-workflow skill"
```

---

### Task 7: Create the SKILL.md

**Files:**
- Create: `arckit-claude/skills/architecture-workflow/SKILL.md`
- Reference: `arckit-claude/skills/wardley-mapping/SKILL.md` (for frontmatter pattern)
- Reference: `arckit-claude/commands/start.md` (for project detection logic)
- Reference: Design doc at `docs/plans/2026-03-05-architecture-workflow-skill-design.md`

**Step 1: Write the SKILL.md**

The skill must contain:

1. **YAML Frontmatter** with `name: architecture-workflow` and comprehensive `description` trigger text (see design doc)

2. **Overview** — one paragraph explaining what this skill does

3. **Hard Gate** — `<HARD-GATE>` block: Do NOT run any `/arckit:*` commands. Only present the recommended plan.

4. **Anti-Patterns** — "I already know what I need" and "Just run everything"

5. **Process** with 4 steps:

   **Step 1: Detect Project State** (automatic, no questions)
   - Check for `projects/` directory
   - Check for principles document (`ARC-000-PRIN-*`)
   - Count existing artifacts per project
   - Use ArcKit Project Context from hooks if available
   - Determine: new project vs continue existing

   **Step 2: Triage Questions** (one at a time via AskUserQuestion)
   - Q1 Sector: UK Government / Defence / Public sector (non-UK) / Private sector
   - Q2 Project type: New system build / System migration / Procurement / Data platform / AI/ML / Strategy only
   - Q3 Current stage: Just starting / Have requirements / Have design / Need compliance review
   - Q4 Primary goal: Full governance lifecycle / Specific deliverable / Compliance check / Quick prototype documentation

   **Step 3: Deep Questions** (only if complex — UK Gov, Defence, AI/ML, or full lifecycle)
   - Existing stakeholder analysis?
   - Compliance frameworks? (multiple choice: GDS, TCoP, NCSC CAF, AI Playbook, JSP 440)
   - Procurement involvement? (G-Cloud, DOS, open tender, none)
   - Strategic analysis needed? (Wardley Maps, platform design)
   - Timeline pressure? (weeks, months, quarters)

   **Step 4: Present Tailored Plan**
   - Select base path reference: standard-path, uk-gov-path, or defence-path
   - Apply modifiers: ai-ml-path and/or data-path if applicable
   - Adjust for current stage (skip completed phases)
   - Present numbered command sequence grouped by phase
   - Each entry: command name, one-line rationale
   - Include "Minimum Viable Path" for quick starts

6. **Decision Logic** — mapping from triage answers to reference files:
   ```
   Sector = Private/Non-UK → standard-path.md
   Sector = UK Gov → uk-gov-path.md
   Sector = Defence → defence-path.md
   Project type = AI/ML → add ai-ml-path.md
   Project type = Data platform → add data-path.md
   Goal = Compliance check → show compliance phase only from relevant path
   Goal = Quick prototype → show minimum viable path only
   ```

7. **Output Format** — example of what the presented plan looks like

8. **ArcKit Integration** — note that `/arckit:start` delegates to this skill

**Step 2: Verify the skill is well-formed**

Run: `head -5 arckit-claude/skills/architecture-workflow/SKILL.md`
Expected: YAML frontmatter with `name: architecture-workflow`

**Step 3: Commit**

```bash
git add arckit-claude/skills/architecture-workflow/SKILL.md
git commit -m "feat: add architecture-workflow process skill"
```

---

### Task 8: Modify /arckit:start to delegate to skill

**Files:**
- Modify: `arckit-claude/commands/start.md` (entire file — replace content)

**Step 1: Read the current start.md to confirm contents**

Run: `wc -l arckit-claude/commands/start.md`
Expected: 189 lines (the current full command)

**Step 2: Replace with thin wrapper**

The new `start.md` should be:

```markdown
---
description: Get oriented with ArcKit — guided project onboarding, workflow selection, and command recommendations
argument-hint: "[workflow focus, e.g. 'new project', 'procurement', 'governance review']"
---

# ArcKit: Project Onboarding

Use the **architecture-workflow** skill to guide this user through project onboarding and workflow selection.

## User Input

```text
$ARGUMENTS
```

## Instructions

1. Follow the architecture-workflow skill process exactly
2. If the user provided $ARGUMENTS with a specific focus (e.g., "procurement", "governance review"), use that as context during triage — it may let you skip some questions
3. The skill will detect project state, ask adaptive questions, and present a tailored command plan
4. Do NOT run any commands — only present the recommended plan for the user to execute
```

**Step 3: Verify the replacement**

Run: `wc -l arckit-claude/commands/start.md`
Expected: ~18-20 lines (much shorter than 189)

**Step 4: Commit**

```bash
git add arckit-claude/commands/start.md
git commit -m "refactor: make /arckit:start delegate to architecture-workflow skill"
```

---

### Task 9: Update MEMORY.md skill count

**Files:**
- Modify: `/home/codespace/.claude/projects/-workspaces-arc-kit/memory/MEMORY.md`

**Step 1: Update the Quick Reference line**

Change the skill count from `2 skills` to `3 skills` and add `Architecture Workflow` to the list:

```
- **54 commands**, **5 agents**, **3 skills** (Wardley Mapping, Mermaid Syntax, PlantUML Syntax, Architecture Workflow), **18 DDaT role guides**
```

Wait — that's 4 skills now (wardley-mapping, mermaid-syntax, plantuml-syntax, architecture-workflow). Update accordingly.

**Step 2: Commit**

No git commit for memory files — they're outside the repo.

---

### Task 10: Test the skill end-to-end

**Step 1: Verify skill auto-discovery**

Open a test repo with the arckit plugin enabled and check that the skill appears in the available skills list. Type a message like "how do I start an architecture project" and verify the architecture-workflow skill triggers.

**Step 2: Verify /arckit:start delegation**

Run `/arckit:start` and verify it invokes the architecture-workflow skill rather than the old inline logic.

**Step 3: Walk through the question flow**

- Answer triage questions for each sector type
- Verify correct path is selected
- Verify plan output matches the reference file content
- Verify deep questions only appear for complex projects

**Step 4: Verify edge cases**

- Empty project (no `projects/` directory)
- Existing project with artifacts at different completeness levels
- Specific $ARGUMENTS like "procurement" or "compliance review"

**Step 5: Commit any fixes**

```bash
git add -A
git commit -m "fix: address issues found during skill testing"
```

---

## Summary

| Task | Files | Type |
|------|-------|------|
| 1 | Directory scaffold | Create |
| 2 | `references/standard-path.md` | Create (~100 lines) |
| 3 | `references/uk-gov-path.md` | Create (~120 lines) |
| 4 | `references/defence-path.md` | Create (~120 lines) |
| 5 | `references/ai-ml-path.md` | Create (~80 lines) |
| 6 | `references/data-path.md` | Create (~80 lines) |
| 7 | `SKILL.md` | Create (~200-250 lines) |
| 8 | `arckit-claude/commands/start.md` | Modify (189 → ~20 lines) |
| 9 | `MEMORY.md` | Modify (skill count) |
| 10 | End-to-end testing | Test |

**Total new content**: ~750-800 lines across 7 new files
**Modified files**: 2 (start.md, MEMORY.md)
**No converter run needed**: Skills are Claude Code plugin only
**No template/guide needed**: This is a process skill, not a document-generating command
