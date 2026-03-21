# Autoresearch Guide: Self-Improving Command Prompts

> **Guide Origin**: Official | **ArcKit Version**: [VERSION]

ArcKit includes an autonomous prompt optimisation system inspired by [karpathy/autoresearch](https://github.com/karpathy/autoresearch). It lets Claude Code iteratively improve any command prompt by running it, scoring the output, tweaking the prompt, and keeping or discarding the change based on whether quality improved.

You start a run and walk away. The system loops until you stop it.

---

## Quick Start

In the ArcKit repo, tell Claude Code:

```text
read scripts/autoresearch/program.md and optimise the requirements command
```

Replace `requirements` with any command name (e.g., `adr`, `backlog`, `risk`, `stakeholders`).

Claude will:

1. Create a git worktree (`../autoresearch-requirements`) on a new branch -- your main checkout stays clean
2. Set up a scratch project with fixture data inside the worktree
3. Run the command, score the output, log the baseline
4. Enter the experiment loop -- tweaking, re-running, keeping or discarding

To stop: interrupt Claude at any time. The worktree has the best prompt.

---

## How It Works

The system adapts autoresearch's ML experiment loop to prompt engineering:

- **autoresearch**: modifies `train.py` to minimise `val_bpb`
- **ArcKit autoresearch**: modifies a command `.md` file to maximise a quality score

### The Loop

Each iteration follows the same cycle:

1. **Read** the current prompt and results history
2. **Identify** one specific improvement
3. **Edit** the command `.md` file
4. **Commit** the change to git
5. **Clean** the scratch project (delete generated artifacts, keep fixtures)
6. **Execute** the command against the scratch project
7. **Score** the output (structural checks then LLM-as-judge)
8. **Compare** to the previous best score
9. **Keep or discard** based on a minimum delta threshold (>= 0.3)
10. **Log** the result to `results.tsv`

If discarded, the prompt is reverted via `git checkout` to the previous best version. The full history (including discards) is preserved in `results.tsv`.

### Status Line

After each iteration, a status line is printed:

```text
[iter 3] score: 9.2 (best: 8.8) | status: keep | keeps: 3 discards: 1 | streak: 0/5 to plateau
```

This gives live terminal visibility without needing to read files.

---

## Evaluation: Two Layers

### Layer 1: Structural Gate (pass/fail)

Eight checks that must all pass:

1. Document Control table with all 14 required fields
2. Document ID follows `ARC-NNN-TYPE-vX.Y` pattern
3. Revision History table present
4. Standard footer present
5. All major template sections present
6. File written to correct path
7. Domain-specific IDs correct (BR-xxx, FR-xxx, etc.)
8. Wardley Map math validation (WARD commands only): stage-evolution alignment, coordinate range [0.00-1.00], OWM-to-table consistency

If any check fails, the iteration scores `FAIL 0.0` and is discarded immediately.

### Layer 2: LLM-as-Judge (1.0-10.0)

Five dimensions, each scored 1-10:

- **Completeness** -- all sections substantively filled
- **Specificity** -- references actual project context, not generic boilerplate
- **Traceability** -- cross-references between artifacts present and correct
- **Actionability** -- a vendor or review board could use this document as-is
- **Clarity** -- well-structured, no contradictions

The combined score is the arithmetic mean, rounded to one decimal place.

Scoring uses an adversarial reviewer persona to prevent self-evaluation bias.

---

## What Gets Modified (and What Doesn't)

**Editable** (the only variable):

- `arckit-claude/commands/<command>.md` -- the prompt being optimised

**Read-only** (the fixed benchmark):

- Template file (defines expected output structure)
- Quality checklist (evaluation standard)
- Scratch project fixtures (controlled input)
- Test argument (`$ARGUMENTS = "001"`)
- Evaluation rubric

This mirrors autoresearch's design: `prepare.py` is read-only, `train.py` is the only file modified.

---

## Constraints

- **One change per iteration** -- isolate variables
- **Minimum delta of 0.3** -- filters noise from non-deterministic evaluation
- **Simplicity criterion** -- marginal improvement + added complexity = not worth it; simplification + same score = keep
- **Log everything** -- every iteration gets a row in `results.tsv`
- **No git reset --hard** -- use targeted `git checkout` + revert commits

---

## Results

Results are logged to `results.tsv` (tab-separated):

```text
commit  structural  score  status   description
a1b2c3d PASS        8.4    keep     baseline
b2c3d4e PASS        8.8    keep     expand NFR subcategories
c3d4e5f PASS        9.0    discard  derive NFR targets from context (delta < 0.3)
d4e5f6g PASS        9.2    keep     add use case structure instruction
```

Status values: `keep`, `discard`, `plateau`, `crash`.

### Plateau Detection

If 5 consecutive iterations are discarded, the system shifts strategy:

- Re-reads the template for unaddressed sections
- Reviews the quality checklist for uncovered criteria
- Tries prompt simplification
- Combines ideas from previous near-misses

---

## Practical Results

Commands optimised so far and their score improvements:

- **requirements**: 8.4 to 9.2 (+0.8) in 3 iterations
  - Expanded NFR subcategories (5 generic to 7 specific with sub-prefixes)
  - Added explicit use case structure (UC-xxx with main/alt/exception flows)
- **adr**: 8.6 to 9.0 (+0.4) in 1 iteration
  - Strengthened Consequences section with project-specific metrics, mitigation owners, after-action review
- **backlog**: 8.0 to 8.8 (+0.8) in 1 iteration
  - Strengthened acceptance criteria rules (banned vague phrases, required measurable thresholds)

Net prompt changes are typically 3-8 lines. The improvements are small and high-leverage.

---

## Which Commands to Optimise

Good candidates:

- Commands that produce long, structured documents (requirements, backlog, sobc, risk)
- Commands with detailed templates that the prompt may not fully leverage
- Commands where output quality varies between runs

Not suitable:

- Agent-delegated commands without a direct-execution fallback (research, datascout, aws-research, azure-research, gcp-research, framework) -- the prompt is a thin wrapper
- Simple utility commands (customize, init, health) -- too short to benefit

---

## File Structure

```text
scripts/autoresearch/
  program.md              # The instruction file Claude follows
  fixtures/
    000-global/
      ARC-000-PRIN-v1.0.md    # Architecture principles (6 principles)
    001-test-project/
      README.md                # Project description
      ARC-001-STKE-v1.0.md    # Stakeholder analysis (4 stakeholders)
```

The experiment runs in a **git worktree** (`../autoresearch-<command>`), keeping the main checkout clean. The scratch project, results TSV, and all experiment commits live in the worktree. The branch tip (the improved command `.md`) is the deliverable.

---

## Tips

- **Run overnight** -- each iteration takes 2-3 minutes, so you get 20-30 experiments per hour
- **Review the results.tsv** -- the discard history tells you what didn't work, which is as valuable as what did
- **Check against standards** -- before starting a run, review relevant external standards (e.g., UK Gov ADR Framework for ADRs, GDS Service Standard for assessments) to prime the system with specific gaps to target
- **Create a PR for the prompt change only** -- the experiment branch has noise (scratch files, results, reverts); cherry-pick the kept commits onto a clean branch
- **One command per worktree** -- each optimisation run gets its own `../autoresearch-<command>` worktree
- **Cleanup** -- after cherry-picking results, remove the worktree: `git worktree remove ../autoresearch-<command>`

---

## Limitations

- **Self-evaluation bias** -- the same model generates and judges; adversarial scoring instructions mitigate but don't eliminate this
- **Fast convergence** -- most commands reach 8.8-9.2 within 2-3 kept changes; further improvements are incremental
- **Fixture dependency** -- a thin test project constrains what improvements the system can discover; richer fixtures reveal more gaps
- **Non-deterministic scoring** -- the 0.3 delta threshold is empirically chosen; genuine improvements near the threshold may be discarded
