# Command Prompt Optimiser Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create a `program.md` that instructs Claude Code to autonomously improve ArcKit command prompts through a run/score/keep-discard experiment loop.

**Architecture:** Single instruction document (`scripts/autoresearch/program.md`) plus fixture files for the scratch project prerequisites. No code, no scripts. Claude reads `program.md` and follows it.

**Tech Stack:** Markdown, git

**Spec:** `docs/superpowers/specs/2026-03-20-command-prompt-optimiser-design.md`

---

### Task 1: Create scratch project fixture files

The experiment loop needs stable prerequisite artifacts for the scratch project. These are shipped as fixture files so that `program.md` can reference them rather than embedding large markdown blobs inline. Use `2026-03-20` for all dates in fixture Document Control tables (Created Date, Last Modified, Revision History). These are static fixture files, not dynamically generated.

**Files:**
- Create: `scripts/autoresearch/fixtures/000-global/ARC-000-PRIN-v1.0.md`
- Create: `scripts/autoresearch/fixtures/001-test-project/README.md`
- Create: `scripts/autoresearch/fixtures/001-test-project/ARC-001-STKE-v1.0.md`

- [ ] **Step 1: Create the architecture principles fixture**

Create `scripts/autoresearch/fixtures/000-global/ARC-000-PRIN-v1.0.md` — a minimal but realistic architecture principles document with 6 principles across business, data, application, and technology categories. Use the standard Document Control + Revision History structure. Project context: a fictional "Digital Appointment Booking Service" for a UK government department.

Principles to include:
1. Cloud-First (Technology) — prefer managed cloud services over on-premise
2. API-First Design (Application) — all capabilities exposed via APIs
3. Security by Design (Technology) — NCSC CAF alignment, zero-trust
4. Data Minimisation (Data) — collect only what's needed, GDPR aligned
5. Open Standards (Technology) — prefer open formats and protocols
6. User-Centred Design (Business) — GDS Service Standard, user research driven

- [ ] **Step 2: Create the project README fixture**

Create `scripts/autoresearch/fixtures/001-test-project/README.md`:

```markdown
# Digital Appointment Booking Service

**Project ID:** 001
**Created:** 2026-03-20

A UK government digital service enabling citizens to book, reschedule, and cancel
appointments online. Part of a department's digital transformation programme to
reduce call centre volume by 60% and improve citizen satisfaction.

## Key Stakeholders

- Service Owner (SRO)
- Head of Digital
- Lead Architect
- Call Centre Operations Manager
```

- [ ] **Step 3: Create the stakeholder analysis fixture**

Create `scripts/autoresearch/fixtures/001-test-project/ARC-001-STKE-v1.0.md` — a minimal stakeholder analysis with 4 stakeholders, power/interest grid, goals, and a brief RACI matrix. Use standard Document Control + Revision History. Keep it short (under 100 lines) but substantive enough for commands to reference.

Stakeholders:
1. **Service Owner (SRO)** — High power, high interest. Goals: reduce call centre costs 40%, launch within 12 months
2. **Head of Digital** — High power, medium interest. Goals: GDS compliance, reusable platform components
3. **Lead Architect** — Medium power, high interest. Goals: cloud-native, maintainable, secure
4. **Call Centre Operations Manager** — Low power, high interest. Goals: smooth transition, staff retraining support

- [ ] **Step 4: Commit fixture files**

```bash
git add scripts/autoresearch/fixtures/
git commit -m "feat: add scratch project fixtures for command prompt optimiser"
```

---

### Task 2: Write `program.md`

The core deliverable. This is a single markdown file that Claude Code reads and follows autonomously. Structure mirrors [karpathy/autoresearch `program.md`](https://github.com/karpathy/autoresearch/blob/master/program.md).

**Files:**
- Create: `scripts/autoresearch/program.md`

- [ ] **Step 1: Write the Setup section**

Write the opening of `scripts/autoresearch/program.md` with:

- Title and overview (what this is, inspired by autoresearch)
- Setup instructions:
  1. Agree on target command with user
  2. Create branch `autoresearch/<command>-<date>`
  3. Read the command file, find its template (search for `templates/` in the command `.md`), read quality checklist
  4. Agent delegation check: if command contains "Launch the agent" or Task tool invocation, follow "Alternative: Direct Execution" fallback
  5. Copy fixture files from `scripts/autoresearch/fixtures/` into `scratch/projects/` (i.e., `fixtures/000-global/` becomes `scratch/projects/000-global/`, `fixtures/001-test-project/` becomes `scratch/projects/001-test-project/`)
  6. Set fixed `$ARGUMENTS` = `"001"`
  7. Initialize `results.tsv` with header row
  8. Run the command unmodified against the scratch project, score the output using both evaluation layers, and log the result as the baseline row in `results.tsv` (status: `keep`, description: `baseline`)
  9. Confirm setup, then begin

Include the "How Commands Are Executed" subsection:
- Read command `.md` and follow instructions directly
- Substitute `$ARGUMENTS` with `"001"`
- Replace `${CLAUDE_PLUGIN_ROOT}` with `arckit-claude/`
- Ignore "ArcKit Project Context hook" references — scan `scratch/projects/` manually
- Write artifacts to `scratch/projects/`

- [ ] **Step 2: Write the Evaluation section**

Add the two-layer evaluation system:

**Layer 1: Structural Checks** — the pass/fail gate. List all checks from the spec (Document Control fields, Document ID pattern, Revision History, footer, template sections, file path, domain-specific IDs).

**Layer 2: LLM-as-Judge** — five dimensions (Completeness, Specificity, Traceability, Actionability, Clarity), each 1-10, combined as arithmetic mean.

Include the adversarial scoring discipline instruction: adopt reviewer persona, cite evidence, don't anchor, re-read template + quality checklist before every scoring pass.

- [ ] **Step 3: Write the Experiment Loop section**

Add the loop with all 11 steps from the spec:

1. Read current prompt + results.tsv
2. Identify ONE improvement
3. Edit command `.md`
4. Git commit
5. Clean scratch project (delete generated artifacts, keep fixtures)
6. Execute command instructions
7. Score (structural gate → LLM judge)
8. Compare to previous best (minimum delta >= 0.3)
9. Log to results.tsv
10. If DISCARD: run `git checkout <previous-best-commit> -- arckit-claude/commands/<command>.md` to restore the file, then create a new commit with message `revert: <description> (no improvement)`. Do NOT use `git revert`
11. Loop

Include the plateau detection rule (5 consecutive discards → shift strategy).

- [ ] **Step 4: Write the Constraints and Results sections**

Add:

- Results TSV format (tab-separated, 5 columns, example rows including plateau marker)
- Constraints (only modify command `.md`, one change per iteration, minimum delta 0.3, never stop, simplicity criterion — a marginal score improvement that adds significant prompt complexity should be discarded; simplifying the prompt while maintaining score is a keep, no new dependencies, log everything, no git reset --hard)
- What Is Read-Only table
- What you CAN do / CANNOT do (matching autoresearch's style)
- What Is NOT In Scope (6 items from spec: no custom scripts, no CI, no multi-command sweeps, no template modifications, no plugin structure changes, no agent-delegated commands without fallback)
- Note that `results.tsv` and the `scratch/` directory are ephemeral — they live on the experiment branch and are not merged to main
- Usage section: brief example of how the human starts a run

- [ ] **Step 5: Write the NEVER STOP section**

Add the autonomous operation instruction (matching autoresearch's tone):

- Never pause to ask the human
- If you run out of ideas, re-read template line by line, review quality checklist, try simplification, combine near-misses
- The human might be asleep — keep working indefinitely until manually interrupted
- Each iteration takes ~2-3 minutes, so you can run ~20-30/hour

- [ ] **Step 6: Commit program.md**

```bash
git add scripts/autoresearch/program.md
git commit -m "feat: add command prompt optimiser program.md"
```

---

### Task 3: Verify completeness

- [ ] **Step 1: Cross-check program.md against spec**

Read both files and verify every section from the spec is represented in `program.md`:

- [ ] Setup Phase (all 7 steps)
- [ ] How Commands Are Executed (all 4 substitution rules)
- [ ] Structural Checks (all 7 checks)
- [ ] LLM-as-Judge (all 5 dimensions + scoring discipline)
- [ ] Experiment Loop (all 11 steps)
- [ ] Plateau Detection
- [ ] Results TSV format
- [ ] All 8 constraints
- [ ] Read-Only table
- [ ] Not-in-scope list
- [ ] Usage section
- [ ] Ephemeral files note

- [ ] **Step 2: Verify fixture files are realistic**

Read each fixture file and confirm:
- ARC-000-PRIN-v1.0.md has Document Control, Revision History, 6 principles
- ARC-001-STKE-v1.0.md has Document Control, Revision History, 4 stakeholders, power/interest grid
- README.md has project name, ID, description

- [ ] **Step 3: Final commit if any fixes needed**

```bash
git add scripts/autoresearch/
git commit -m "fix: address completeness issues in program.md"
```
