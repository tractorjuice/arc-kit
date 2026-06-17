# ArcKit Self-Harness Enhanced Autoresearch Program

<!-- markdownlint-disable MD009 MD022 MD031 MD032 MD040 -->

**Status**: DRAFT - Self-Harness Integration  
**Based on**: "Self-Harness: Harnesses That Improve Themselves" (Zhang et al., 2026, arXiv:2606.09498v1)  
**Version**: 1.0  
**Date**: 2026-06-17

---

## Overview

This document extends `scripts/autoresearch/program.md` with **Self-Harness** capabilities based on the paper by Zhang et al. (2026). It adds:

1. **Multi-dimensional optimization**: Beyond prompt text to full harness (prompts + tools + runtime + verification)
2. **Verifier-grounded weakness mining**: Automated clustering of failure signatures from execution traces
3. **Held-in/held-out validation**: Conservative acceptance rule to prevent overfitting
4. **Agent and hook optimization**: Extends beyond commands to optimize agents and hooks

**Reference**: All Self-Harness concepts are based on Zhang et al. (2026, arXiv:2606.09498v1)

---

## Quick Start

To use Self-Harness enhanced autoresearch:

```text
read scripts/autoresearch/program-selfharness.md and optimize the requirements command
```

Specify optimization mode:
- `optimize command requirements` - Command prompt optimization (default, backward compatible)
- `optimize command requirements mode:full` - Full harness optimization for command
- `optimize agent research` - Agent definition optimization
- `optimize hook graph-inject` - Hook behavior optimization

---

## 1. Setup

### 1.1 Standard Setup (Same as program.md)

1. **Agree on target**: Command, agent, or hook name
2. **Create worktree**: 
   ```bash
   git worktree add ../autoresearch-<target> -b autoresearch/<target>-<tag>
   cd ../autoresearch-<target>
   ```
3. **Determine optimization mode**:
   - `mode: prompt` (default) - Optimize command `.md` only (backward compatible)
   - `mode: full` - Full harness optimization (prompt + tools + runtime + verification)
   - `mode: agent` - Optimize agent definition
   - `mode: hook` - Optimize hook behavior

4. **Read in-scope files** (varies by mode):
   - **prompt mode**: `plugins/arckit-claude/commands/<command>.md` (ONLY file you modify)
   - **full mode**: commands/ + hooks/ + .mcp.json + templates/ (multiple files)
   - **agent mode**: `plugins/arckit-claude/agents/<agent>.md` (ONLY file you modify)
   - **hook mode**: `plugins/arckit-claude/hooks/<hook>.mjs` (ONLY file you modify)

5. **Read templates and checklists** (read-only):
   - Template file for expected output structure
   - `plugins/arckit-claude/references/quality-checklist.md`

### 1.2 Enhanced Setup (Self-Harness)

6. **Create held-in/held-out fixtures**:
   ```bash
   # Copy base fixtures
   cp -r scripts/autoresearch/fixtures/001-test-project scripts/autoresearch/fixtures/held-in/001-test-project
   
   # Create additional held-in fixtures (2-4 more)
   cp -r scripts/autoresearch/fixtures/001-test-project scripts/autoresearch/fixtures/held-in/002-test-project
   cp -r scripts/autoresearch/fixtures/001-test-project scripts/autoresearch/fixtures/held-in/003-test-project
   
   # Create held-out fixtures (2-3)
   mkdir -p scripts/autoresearch/fixtures/held-out/004-test-project
   mkdir -p scripts/autoresearch/fixtures/held-out/005-test-project
   # Note: held-out fixtures should have variations to test generalization
   ```

7. **Set task lists**:
   ```bash
   export HELD_IN_TASKS=("001" "002" "003")
   export HELD_OUT_TASKS=("004" "005")
   ```

8. **Initialize trace storage**:
   ```bash
   mkdir -p .arckit/autoresearch-traces/<target>
   ```

9. **Initialize results.tsv** with extended header:
   ```text
   commit  structural  score  effort  model  status  description  held_in_score  held_out_score  cluster  trace_id
   ```

10. **Set optimization parameters**:
    ```bash
    export MIN_DELTA=0.3           # Minimum improvement to accept
    export MAX_ITERATIONS=50       # Iteration budget
    export PLATEAU_THRESHOLD=15    # Discards before plateau detection
    export PARALLEL_CANDIDATES=3   # Number of parallel proposals (for full mode)
    ```

11. **Run baseline on all tasks**:
    - For each task in HELD_IN_TASKS + HELD_OUT_TASKS:
      - Execute with current harness
      - Capture trace
      - Score output
    - Compute average held-in and held-out scores
    - Log baseline with status `baseline`

---

## 2. How Commands/Agents/Hooks Are Executed

Execution method varies by optimization mode:

### Mode: Prompt (Default - Backward Compatible)
Same as original `program.md`:
1. Read `plugins/arckit-claude/commands/<command>.md`
2. Follow instructions directly
3. Apply substitutions: `$ARGUMENTS`, `${CLAUDE_PLUGIN_ROOT}`
4. Write to `scratch/projects/`

### Mode: Full (Harness Optimization)
1. Read current harness configuration (multiple files)
2. Apply harness to execution environment
3. Execute command with configured harness
4. Capture full execution trace

### Mode: Agent
1. Launch agent with current definition
2. Provide test input based on fixtures
3. Capture agent execution trace (subagent calls, tool uses, decisions)
4. Score final output

### Mode: Hook
1. Trigger hook with test input
2. Capture hook execution trace (modifications, context injections)
3. Measure impact on downstream command/agent
4. Score based on effectiveness and side effects

---

## 3. Evaluation

### 3.1 Structural Checks (Layer 1 - Gate)

Same as original `program.md` - 8 checks must all pass:
1. Document Control table with all 14 required fields
2. Document ID follows `ARC-NNN-TYPE-vX.Y` pattern
3. Revision History table present
4. Standard footer present
5. All major template sections present
6. File written to correct path
7. Domain-specific IDs correct (BR-xxx, FR-xxx, etc.)
8. Wardley Map math validation (WARD commands only)

If ANY check fails: score = `FAIL 0.0`, skip to logging

### 3.2 LLM-as-Judge (Layer 2 - Quality)

Same 5 dimensions, 1-10 scale:
- **Completeness**: All sections substantively filled
- **Specificity**: References actual project context
- **Traceability**: Cross-references present and correct
- **Actionability**: Could be used as-is by vendor/review board
- **Clarity**: Well-structured, no contradictions

Combined score = arithmetic mean, rounded to 1 decimal

### 3.3 Trace Collection (NEW - Self-Harness)

After each execution, capture:
```json
{
  "iteration": N,
  "target": "<command|agent|hook>",
  "mode": "<prompt|full|agent|hook>",
  "timestamp": "ISO8601",
  "environment": {
    "model": "claude-3-5-sonnet",
    "effort": "high"
  },
  "execution": {
    "toolCalls": [
      {"name": "Read", "path": "...", "tokensIn": 100, "tokensOut": 500},
      {"name": "WebSearch", "query": "...", "tokensIn": 20, "tokensOut": 300}
    ],
    "totalTokens": 1500,
    "durationMs": 45000,
    "artifactsCreated": ["projects/001/ARC-001-REQ-v1.0.md"]
  },
  "output": "...",
  "verifier": {
    "passed": true,
    "failures": []
  }
}
```

Save to: `.arckit/autoresearch-traces/<target>/<mode>/iteration-N.json`

---

## 4. Weakness Mining (NEW - Self-Harness Section 3.2)

After scoring, mine execution trace for failure patterns:

### 4.1 Extract Failure Signature

```javascript
// Based on Zhang et al. (2026, Section 3.2)
function extractFailureSignature(trace, verifierOutput, score) {
  // If structural failure
  if (score === 0.0) {
    return {
      verifierCause: getVerifierCause(verifierOutput),
      agentBehavior: getAgentBehavior(trace),
      mechanism: "structural_violation"
    };
  }
  
  // If score < MIN_DELTA improvement or discard
  if (score < previousBest || (score - previousBest) < MIN_DELTA) {
    return {
      verifierCause: "quality_insufficient",
      agentBehavior: analyzeAgentBehavior(trace),
      mechanism: inferMechanism(trace, verifierOutput)
    };
  }
  
  return null; // No weakness if accepted
}
```

**Verifier Causes** (from structural checks):
- `missing_document_control`
- `invalid_id_format`
- `missing_revision_history`
- `missing_footer`
- `missing_sections`
- `wrong_path`
- `invalid_ids`
- `wardley_math_error`

**Agent Behaviors** (from trace analysis):
- `early_termination`: Stopped before completing all sections
- `excessive_tool_use`: Too many tool calls
- `insufficient_exploration`: Didn't explore enough
- `wrong_tool_selection`: Used incorrect tool
- `missing_context`: Didn't reference project context
- `repetitive_actions`: Repeated same action without progress
- `ignored_guidance`: Didn't follow prompt instructions

**Mechanisms** (inferred):
- `insufficient_context`: Not enough project-specific info
- `missing_guidance`: Prompt didn't provide enough direction
- `unbounded_exploration`: No limits on tool use
- `format_violation`: Output didn't match template
- `cross_ref_missing`: Didn't link to other artifacts
- `generic_output`: Too much boilerplate

### 4.2 Cluster Failures

Group failures by signature:
```json
{
  "cluster_001": {
    "signature": {
      "verifierCause": "missing_sections",
      "agentBehavior": "early_termination",
      "mechanism": "missing_guidance"
    },
    "count": 5,
    "frequency": 0.45,  // 45% of all failures
    "traces": ["iteration-1", "iteration-3", "iteration-7", "iteration-12", "iteration-15"],
    "addressableSurfaces": ["prompt", "templates", "verification_rules"],
    "severity": "high"
  }
}
```

Save to: `.arckit/autoresearch-traces/<target>/<mode>/clusters.json`

### 4.3 Addressable Surfaces Mapping

Based on failure signature, determine what can be changed:

| Verifier Cause | Agent Behavior | Mechanism | Addressable Surfaces |
|---------------|----------------|-----------|---------------------|
| missing_sections | early_termination | missing_guidance | prompt, templates, verification_rules |
| wrong_path | * | * | prompt, runtime_policy |
| invalid_ids | * | format_violation | prompt, verification_rules, templates |
| * | excessive_tool_use | unbounded_exploration | runtime_policy, tool_restrictions, prompt |
| * | * | insufficient_context | prompt, context_injection, bootstrap_instruction |
| * | * | cross_ref_missing | prompt, context_injection, verification_rules |
| quality_insufficient | * | generic_output | prompt, context_injection |

---

## 5. The Experiment Loop

### LOOP UNTIL STOP CONDITION

**Stop conditions** (extended from Zhang et al., 2026, Algorithm 1):
1. Score target hit: best >= 9.5
2. Iteration budget exhausted: iter >= MAX_ITERATIONS
3. Double plateau detected: two plateau markers within 10 iterations
4. Manual stop by user

### 5.1 Standard Loop Steps (Extended)

1. **READ**: Current harness configuration + results history + clusters
2. **IDENTIFY**: ONE specific improvement based on:
   - Low-scoring dimensions from LLM-as-judge
   - Structural failures
   - Template gaps
   - Quality checklist criteria
   - **NEW**: Top failure clusters from weakness mining
   - **NEW**: Previous near-misses in results history
   - **NEW**: For full mode: consider all addressable surfaces

3. **GENERATE CANDIDATES** (NEW for full mode):
   - If mode = `prompt`: Generate 1 candidate (original behavior)
   - If mode = `full`: Generate PARALLEL_CANDIDATES (default: 3)
     - Each candidate targets different cluster OR different surface
     - Ensure diversity: different clusters, surfaces, or mechanisms

4. **EDIT**: Apply change(s) to harness
   - For prompt mode: Edit command `.md` file
   - For full mode: Edit appropriate harness file(s)
   - For agent mode: Edit agent `.md` file
   - For hook mode: Edit hook `.mjs` file

5. **COMMIT**: Git commit with description of changes
   - Format: "[harness] <description> | cluster: <cluster_id> | surface: <surface>"

6. **CLEAN**: Remove previously generated artifacts, keep fixtures

7. **EXECUTE**: 
   - For each task in HELD_IN_TASKS:
     - Clean scratch project
     - Copy fixtures
     - Execute with candidate harness
     - Capture trace
     - Score output
   - Compute average held-in score

8. **MINE**: Run weakness mining on all held-in execution traces
   - Extract failure signatures
   - Update clusters
   - Identify dominant patterns

9. **VALIDATE** (Zhang et al., 2026, Section 3.4):
   - For each task in HELD_OUT_TASKS:
     - Clean scratch project
     - Copy fixtures
     - Execute with candidate harness
     - Score output
   - Compute average held-out score
   - Compute deltas:
     - Δ_in = avg_held_in - prev_avg_held_in
     - Δ_out = avg_held_out - prev_avg_held_out

10. **ACCEPT/REJECT** (Zhang et al., 2026, Algorithm 1):
    ```
    IF Δ_in >= 0 AND Δ_out >= 0 AND max(Δ_in, Δ_out) > MIN_DELTA:
        STATUS = "keep"
        Merge changes into active harness
        Update previous best scores
    ELSE:
        STATUS = "discard"
        Revert to previous best harness
    ```

11. **LOG**: Append row to results.tsv with all metrics

12. **PRINT STATUS**:
    ```text
    [mode:<mode> iter N] score: X.X/X.X (best: Y.Y/Y.Y) | effort: high model: inherit | status: keep/discard | keeps: K discards: D | cluster: <top_cluster> | Δ_in: +A.A Δ_out: +B.B | streak: S/PL to plateau
    ```

13. **CHECK STOP CONDITIONS** (before step 1)

### 5.2 Parallel Candidate Evaluation (Full Mode Only)

For full mode with PARALLEL_CANDIDATES > 1:

1. Generate N candidates (N = PARALLEL_CANDIDATES)
2. For each candidate:
   - Apply candidate changes
   - Execute on held-in tasks
   - Score and mine
   - Validate on held-out tasks
   - Determine accept/reject
3. **Merge accepted candidates**:
   - If multiple candidates accepted and compatible (no conflicts):
     - Merge all changes
     - Single commit with merged changes
   - If candidates conflict:
     - Accept highest-scoring candidate
     - Reject others
4. **Compatible**: Changes to different files OR non-overlapping changes to same file

### 5.3 Plateau Detection (Extended)

**Trigger**: Last PLATEAU_THRESHOLD (default: 15) consecutive iterations discarded

**Strategy shift** (Zhang et al., 2026, Section 4.3):
1. Re-read the template line by line for unaddressed sections
2. Review quality checklist for uncovered criteria
3. **NEW**: Review top failure clusters:
   - Focus on highest-frequency cluster
   - Generate candidates specifically for this cluster
4. Try prompt simplification
5. Try combining ideas from previous near-misses
6. Try changing effort: or model: if not already tested
7. **NEW**: Try different optimization surface:
   - If only prompt changes tried: try tool configuration
   - If only tool changes tried: try runtime mechanism
8. Reset discard streak to 0 after strategy shift

**Double plateau**: If second plateau within 10 iterations → exit with status `complete`

---

## 6. Output Format

### 6.1 Results TSV (Extended)

Tab-separated, header:
```text
commit  structural  score  effort  model  status  description  held_in_score  held_out_score  cluster  trace_id
```

Example:
```text
commit structural score effort model status description held_in_score held_out_score cluster trace_id
a1b2c3d PASS 8.4 high inherit keep baseline 8.4 8.3 - iter-001
b2c3d4e PASS 8.8 high inherit keep add cross-ref guidance 8.8 8.7 missing_cross_refs iter-002
c3d4e5f PASS 9.0 high inherit discard simplify prompt 8.9 8.6 - iter-003
d4e5f6g PASS 9.2 high inherit keep add context injection 9.2 9.1 generic_boilerplate iter-004
e5f6g7h FAIL 0.0 high inherit discard remove doc control 0.0 0.0 structural_invalid iter-005
```

### 6.2 Trace Files

Each iteration produces:
- `.arckit/autoresearch-traces/<target>/<mode>/iteration-N.json` - Full execution trace
- `.arckit/autoresearch-traces/<target>/<mode>/clusters.json` - All clusters (updated each iteration)

---

## 7. Optimization Modes Deep Dive

### 7.1 Mode: Prompt (Default)

**Backward compatible** with original `program.md`

**Target**: `commands/<command>.md`

**Editable**:
- Instruction text
- Examples
- Formatting
- effort: YAML field
- model: YAML field
- Section ordering

**Read-only**:
- Template
- Quality checklist
- Fixtures
- Evaluation rubric

**Proposal types**:
- Add/remove instruction
- Reword guidance
- Add/remove example
- Change effort/model
- Reorder sections

### 7.2 Mode: Full

**Target**: Full harness for a command

**Editable surfaces**:
- `commands/<command>.md` (prompt, effort, model)
- `hooks/*.mjs` that affect this command
- `.mcp.json` tool configuration
- `templates/<template>.md` for output
- `config/*.mjs` for document types

**Proposal types**:
- **Type A - Prompt**: Same as mode:prompt
- **Type B - Tools**: Enable/disable MCP servers, adjust tool permissions
- **Type C - Runtime**: Modify hook behavior (graph depth, context injection)
- **Type D - Verification**: Add/strengthen validation rules
- **Type E - Orchestration**: Modify project context injection

**Constraints**:
- One surface per candidate (for parallel evaluation)
- Minimal, targeted changes
- Grounded in failure cluster

### 7.3 Mode: Agent

**Target**: `agents/<agent>.md`

**Editable**:
- Agent prompt/instructions
- tools: list
- maxTurns:
- effort:
- model:
- description:

**Proposal types**:
- Add/remove tools
- Strengthen instructions
- Add pre-checks/post-checks
- Adjust maxTurns
- Change effort/model

**Evaluation**:
- Run agent on test scenarios
- Score output artifacts
- Validate on held-out scenarios

### 7.4 Mode: Hook

**Target**: `hooks/<hook>.mjs`

**Editable**:
- Matcher patterns
- Timeout values
- Configuration options
- Logic flow
- Error handling

**Proposal types**:
- Adjust timeout
- Modify matcher
- Add/remove configuration
- Optimize logic
- Improve error handling

**Evaluation**:
- Test hook with various inputs
- Measure impact on commands/agents
- Validate no regressions

---

## 8. File Structure

```
autoresearch-<target>/
├── plugins/
│   └── arckit-claude/
│       ├── commands/           # Modified in prompt/full mode
│       │   └── <command>.md
│       ├── agents/            # Modified in agent mode
│       │   └── <agent>.md
│       └── hooks/             # Modified in hook/full mode
│           └── <hook>.mjs
├── .arckit/
│   └── autoresearch-traces/
│       └── <target>/
│           ├── prompt/        # mode:prompt traces
│           │   ├── iteration-001.json
│           │   ├── iteration-002.json
│           │   └── clusters.json
│           └── full/          # mode:full traces
│               ├── iteration-001.json
│               └── clusters.json
├── scripts/
│   └── autoresearch/
│       └── fixtures/
│           ├── held-in/
│           │   ├── 001-test-project/
│           │   ├── 002-test-project/
│           │   └── 003-test-project/
│           └── held-out/
│               ├── 004-test-project/
│               └── 005-test-project/
├── scratch/                  # Test execution area
│   └── projects/
│       └── <project>/
├── results.tsv               # Extended format
└── program-selfharness.md    # This file
```

---

## 9. Tips

### 9.1 Running Overnight

- Each iteration takes 3-5 minutes with Self-Harness (vs 2-3 with original)
- ~12-20 experiments per hour
- Set MAX_ITERATIONS accordingly
- Enable prompt caching: `ENABLE_PROMPT_CACHING_1H=1`

### 9.2 Strategy Selection

- **New command**: Start with mode:prompt, then escalate to mode:full
- **Mature command**: Use mode:full directly
- **Agent optimization**: Use mode:agent with agent-specific fixtures
- **Hook optimization**: Use mode:hook with hook-specific tests

### 9.3 Cluster Analysis

- Review clusters.json regularly
- Focus on highest-frequency clusters first
- Some clusters may indicate template issues (not harness issues)
- Document cluster patterns for future reference

### 9.4 Cleanup

- Cherry-pick kept commits to clean branch
- Remove worktree when done: `git worktree remove ../autoresearch-<target>`
- Archive traces: `tar -czvf traces-<target>.tar.gz .arckit/autoresearch-traces/<target>`

---

## 10. Limitations

### 10.1 Self-Evaluation Bias

- Same model generates and judges (mitigated by adversarial scoring)
- Consider using different model for scoring (future enhancement)

### 10.2 Computational Cost

- Full mode: PARALLEL_CANDIDATES x (|HELD_IN| + |HELD_OUT|) executions per iteration
- Recommend: PARALLEL_CANDIDATES=2-3, |HELD_IN|=3, |HELD_OUT|=2 for balance

### 10.3 Non-Determinism

- LLM output is non-deterministic
- Use MIN_DELTA threshold to filter noise
- Consider multiple runs for statistical significance

### 10.4 Overhead

- Trace collection adds ~10-20% overhead
- Weakness mining adds ~5-10 seconds per iteration
- Held-out validation doubles execution time

---

## 11. Usage Examples

### Example 1: Standard Command Optimization (Backward Compatible)

```text
read scripts/autoresearch/program-selfharness.md and optimize the requirements command
```

This uses mode:prompt (default), same as original program.md

### Example 2: Full Harness Optimization

```text
read scripts/autoresearch/program-selfharness.md and optimize the requirements command mode:full
```

Optimizes prompt + tools + runtime + verification for requirements command

### Example 3: Agent Optimization

```text
read scripts/autoresearch/program-selfharness.md and optimize agent research
```

Optimizes arckit-research.md agent definition

### Example 4: Hook Optimization

```text
read scripts/autoresearch/program-selfharness.md and optimize hook graph-inject
```

Optimizes graph-inject.mjs hook behavior

---

## 12. Implementation Notes

### 12.1 Based on Zhang et al. (2026)

This enhanced program implements the **Self-Harness** paradigm from:

Zhang, H., Zhang, S., Li, K., Chen, Y., Zhang, Y., Bai, L., Hu, S. (2026). *Self-Harness: Harnesses That Improve Themselves*. arXiv preprint arXiv:2606.09498v1. Shanghai Artificial Intelligence Laboratory.

**Key concepts implemented:**
- Three-stage loop: Weakness Mining → Harness Proposal → Proposal Validation
- Conservative acceptance rule (Algorithm 1)
- Verifier-grounded failure signatures (Section 3.2)
- Held-in/held-out split validation (Section 3.4)
- Diverse, minimal candidate generation (Section 3.3)

### 12.2 Extensions Beyond Paper

- **Multi-mode optimization**: prompt, full, agent, hook
- **Parallel candidate evaluation**: Multiple candidates per iteration
- **Backward compatibility**: mode:prompt matches original behavior
- **ArcKit-specific**: Integration with ArcKit hooks, agents, commands

### 12.3 Backward Compatibility

To use original behavior (no Self-Harness):
```text
read scripts/autoresearch/program.md and optimize the requirements command
```

Or with Self-Harness enhanced version:
```text
read scripts/autoresearch/program-selfharness.md and optimize the requirements command mode:prompt
```

Both produce identical results for mode:prompt

---

## Document Control

| Document Control | | |
|---|---|---|
| **Document ID** | program-selfharness-v1.0 | |
| **Document Type** | Program Specification | |
| **Project** | ArcKit Autoresearch | |
| **Classification** | Internal | |
| **Status** | DRAFT | |
| **Version** | 1.0 | |
| **Created Date** | 2026-06-17 | |
| **Last Modified** | 2026-06-17 | |
| **Cites** | Self-Harness: Harnesses That Improve Themselves (Zhang et al., 2026, arXiv:2606.09498v1) | |

---

*Based on Self-Harness paper by Zhang et al. (2026, arXiv:2606.09498v1). Generated by Mistral Vibe. Co-Authored-By: Mistral Vibe <vibe@mistral.ai>*
