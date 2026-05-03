---
name: arckit-build
description: "This skill should be used when the user asks to bulk-build ArcKit artefacts, run an end-to-end architecture build, generate multiple /arckit:* outputs in parallel, orchestrate a wave-based build, resume an interrupted build, or rebuild a project from scratch without exhausting main-context. Triggers: arckit-build, build harness, build all artefacts, generate full project, /arckit:* in parallel, run the recipe, --plan, --resume, --target, --refresh, --recipe, state.json. The skill orchestrates parallel /arckit:* generation using subagent isolation: reads project state, computes the artefact dependency DAG, dispatches one subagent per target per wave (each subagent invokes a /arckit:* skill in its own context), validates outputs, commits the wave, and persists progress to .arckit/state.json for resumability."
paths:
  - "projects/**/.arckit/state.json"
  - "projects/**/ARC-*-*.md"
  - ".arckit/recipes/*.yaml"
---

# ArcKit Build Harness (v0.4)

You are running the ArcKit build harness. Your job is **orchestration only** — never read or write artefact content yourself. Spawn subagents for that.

## Operating principles

- **Never read or write artefact content in main context.** That's what subagents are for.
- **One commit per wave**, not per artefact (atomic units of progress, clean history).
- **Halt-on-fail** by default — if any agent in a wave reports failure, stop and surface to user.
- **State is sacred** — update `projects/{P}-{NAME}/.arckit/state.json` after every wave, before moving on.
- **Single message, multiple Agent calls** for parallelism within a wave. Never loop sequential Agent calls.
- **Idempotency**: if state says `complete` and the file exists at the recorded path, skip.
- **Trust the path-allocation hook.** ArcKit's `validate-arc-filename.mjs` PreToolUse hook is the authoritative path normalizer — it allocates sequence numbers, applies subfolders, pads project IDs at write time. The orchestrator and workers never construct paths by string substitution or call `generate-document-id.sh` directly. Read the corrected path back from the Write tool result.

## Args

| Arg | Effect |
|-----|--------|
| `<project>` | Project directory name or numeric ID (e.g. `001` or `001-arckit-saas`). If absent, prompt user. |
| `--plan` | Dry run. Print the wave plan, do not dispatch any Agents, exit. |
| `--resume` | Read state.json; continue from last incomplete wave. |
| `--target NAME` | Build only NAME and its missing dependencies. |
| `--refresh NAME` | Force-rebuild NAME and everything downstream. |
| `--no-commit` | Skip the per-wave git commit. |
| `--recipe NAME` | Recipe name (default `uk-saas`). Resolved against the precedence list below. |
| `--enable ID` | Enable an optional target (e.g. `--enable AIP`). |
| `--exclude ID` | Exclude a default-on optional target (e.g. `--exclude SVCASS`). |

## Recipe loading

Recipes are external YAML files. Lookup precedence for `--recipe NAME` (first hit wins):

1. **Project override**: `.arckit/recipes/{NAME}.yaml` — user customizations preserved across plugin updates
2. **Plugin default**: `${CLAUDE_PLUGIN_ROOT}/skills/arckit-build/recipes/{NAME}.yaml` — ships with the ArcKit plugin

Default recipe is `uk-saas`. To customize, copy the plugin default to `.arckit/recipes/uk-saas.yaml` and edit there:

```bash
mkdir -p .arckit/recipes
cp "${CLAUDE_PLUGIN_ROOT}/skills/arckit-build/recipes/uk-saas.yaml" .arckit/recipes/uk-saas.yaml
```

**Built-in recipes** (shipped with the plugin):

| Recipe | Use case |
|--------|----------|
| `uk-saas` | UK Government managed multi-tenant SaaS — civilian departments |
| `uk-mod-sovereign` | UK MOD / sovereign / air-gapped — `mod-secure` + `jsp-936`, no SVCASS, sealed-media distribution |

### Recipe schema (v1)

See `${CLAUDE_PLUGIN_ROOT}/skills/arckit-build/recipes/uk-saas.yaml` for an annotated reference. Top-level keys:

- `recipe` — recipe name (string, must match filename stem)
- `schema_version` — recipe schema version (currently `1`)
- `description` — free text
- `defaults.version` — default version stamp for outputs (e.g. `"1.0"`)
- `optional_targets` — map of target ID → `{description, default}`
- `post_build_hooks` — list of `{skill, args}` to run after final wave (parallel)
- `targets` — list of target entries

Each `targets[]` entry:

| Field | Required | Notes |
|-------|----------|-------|
| `id` | yes | Unique target ID (e.g. `PRIN`, `ADR-001`, `DIAG-C4`) |
| `skill` | yes | ArcKit skill name (e.g. `arckit:requirements`) |
| `args` | yes | Args string passed to the skill, after substitution |
| `output.project` | yes | `"000-global"` or `"{P}-{NAME}"` |
| `output.type` | yes | ArcKit doc-type code (`PRIN`, `REQ`, `ADR`, `DIAG`, …) — used for state.json keys, NOT for path construction |
| `output.subfolder` | no | Orientation hint shown in `--plan` and worker prompts; the actual subfolder is enforced by `validate-arc-filename.mjs`'s `SUBDIR_MAP` at write time |
| `output.multi_instance` | no | Orientation hint; the hook's `MULTI_INSTANCE_TYPES` list is authoritative |
| `topic` | no | Used in commit messages and `{TOPIC}` substitution |
| `deps` | yes | List of target IDs, may include glob `"ADR-*"` |

The `output.subfolder` / `output.multi_instance` fields document recipe author intent for human readers and `--plan` output, but the path-allocation hook is the source of truth at write time. If a recipe says `subfolder: decisions` for a single-instance type the hook doesn't recognise, the file lands wherever the hook decides — debug via the hook, not the recipe.

### Variable substitution

The orchestrator substitutes these placeholders in `args` and `output.project` before dispatching to workers (workers never see placeholders):

| Placeholder | Source |
|-------------|--------|
| `{P}` | Project ID, zero-padded (e.g. `"001"`) |
| `{NAME}` | Project slug (e.g. `"arckit-saas"`) |
| `{V}` | `defaults.version` from the recipe |
| `{TOPIC}` | `target.topic` (multi-instance ADR/DIAG topics) |

### Dep resolution

`deps: ["ADR-*"]` matches all targets whose ID begins with `ADR-`. Exact IDs take precedence; globs expand at wave-computation time against the resolved target list (after optional-target filtering).

## Wave plan algorithm

Standard topological sort with parallelism:

1. `pending = recipe.targets ∩ enabled - (state.complete ∩ files-exist)` — where `enabled` reflects `--enable`/`--exclude` flags and `optional_targets[id].default`.
2. `done = state.complete`
3. While pending non-empty:
   - `wave = { t ∈ pending : deps(t) ⊆ done }` (after expanding globs)
   - If wave empty → cycle / unresolvable. Halt with error, list involved targets.
   - Emit wave; remove its members from pending; (after dispatch + validate) add to done.

**Worked example** — for project 001 (UK-SaaS recipe) **starting from empty state**, the algorithm produces something like:

- W0: PRIN
- W1: GLOSSARY, REQ, STKE
- W2: ADR-001..ADR-008 (parallel)
- W3: STRATEGY, WARDLEY, RISK, HLD, DEVOPS, FINOPS
- W4: SOBC, TCOP, SBD, DPIA, DIAG-C4, DIAG-SEQ
- W5: DIAG-DEP, PLAN, OPS, AIP (if enabled)
- W6: ROADMAP
- W7: SVCASS
- W8: TRACE
- W9 (post-build): health, pages

Treat this as illustrative only; the harness recomputes waves at runtime from the recipe DAG.

## Per-wave execution

For each wave, in order:

### 1. Plan dispatch

Print:

```
Wave {N}/{total}: {targets joined}
  - estimated agents: {len(wave)}
  - estimated duration: ~2-5 min wall-clock per agent (parallel)
```

### 2. Single message, multiple Agent calls — all in parallel

Use the **Agent tool** with `subagent_type: "general-purpose"`. One Agent call per target. **All in the same assistant message** so they run in parallel.

Per-agent prompt template (substitute `{...}` placeholders from the resolved target):

```
You are an ArcKit artefact worker subagent (orchestrated by arckit-build, wave {WAVE_N}).

Project: {PROJECT_ID} ({PROJECT_NAME})
Target: {TARGET_ID}
Skill to invoke: {SKILL}
Skill args: {ARGS_RESOLVED}
Expected directory: {EXPECTED_DIR}     # for orientation only — actual filename is hook-allocated

Inputs you may read (only these):
{INPUT_PATHS_BULLETED}

Steps:
1. Use the Skill tool to invoke `{SKILL}` with the args above verbatim.

   **Interactive Q&A handling (CRITICAL — subagents have no user available):**
   If the skill calls `AskUserQuestion`, you MUST select the option marked `(Recommended)`
   without asking. If no option is marked Recommended, use these defaults:

   | Question header | Default |
   |-----------------|---------|
   | Scope | `Full system` |
   | Consultation | `Surveys` |
   | Phase | value from skill args, else `alpha` |
   | AI mode / scope | derive from REQ FRs (AI-in-scope iff any FR mentions AI/ML/LLM) |
   | Risk appetite | `Medium` |
   | Anything else | first option in the list |

   Document the choice you made in your final report so the orchestrator can record it.
   Never block waiting for an answer.

2. Capture the actual file path the skill wrote to. Inside the Write tool call,
   the ArcKit `validate-arc-filename.mjs` PreToolUse hook normalizes the path
   (allocates the next sequence number for multi-instance types like ADR/DIAG,
   moves into the correct subfolder, pads project IDs). The hook returns the
   corrected path as `updatedInput.file_path` and the actual write proceeds
   there. You will see this corrected path in the Skill tool's result.

   Read `ACTUAL_PATH` from that result. Do NOT call `generate-document-id.sh`
   yourself or construct paths by string substitution — the hook is the
   authoritative path allocator.

3. Sanity check the corrected path via Bash:
   - `test -f "$ACTUAL_PATH"` returns success
   - `[ "$(wc -l < "$ACTUAL_PATH")" -gt 100 ]`
   - `grep -c '^## Document Control\|^| Document ID' "$ACTUAL_PATH"` returns ≥ 1

4. Do NOT git commit. Do NOT modify other files. The orchestrator handles version control.

Report back ≤ 200 words:
- Actual file path written + exact line count
- Top 3 findings, scores, or RAG ratings (whatever the skill produces as headline result)
- Validation result: PASS or FAIL (with reason)
- Any failures, partial completions, or warnings
- AskUserQuestion choices made (if any)

Do NOT include the document content in your report. Just the summary.
```

### 3. Wait for all agents

When all return, collect summaries.

### 4. Validate

For each target in wave:

- File exists at expected path (`test -f`).
- Line count > 100 (`wc -l`).
- Document control header present (`grep -c '^## Document Control'` ≥ 1).

### 5. Update state.json

Read `projects/{P}-{NAME}/.arckit/state.json`, update each target with:

```json
{
  "<TARGET_ID>": {
    "status": "complete",
    "path": "{ACTUAL_PATH}",
    "built_at": "{ISO_TIMESTAMP}",
    "wave": {WAVE_N},
    "line_count": {LC},
    "skill": "{SKILL}",
    "topic": "{TOPIC_OR_NULL}",
    "agent_summary": "{≤200-word agent report}"
  }
}
```

For failures: `status: "failed"`, `error: "..."`, `wave: {WAVE_N}`.

### 6. Git commit

If `--no-commit` not set:

```bash
git add {OUTPUT_PATHS} projects/{P}-{NAME}/.arckit/state.json
git commit -m "$(cat <<'EOF'
Build wave {N}: {targets joined} via arckit-build

{One-line per target with line count and headline result}

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

### 7. Halt-on-fail

If any agent in the wave reported `FAIL` or validation failed:

- **DO write state.json** — record `status: "failed"`, `error: "..."`, `wave: {WAVE_N}` for failed targets, and `status: "complete"` for the targets in the wave that *did* succeed. State is needed for `--resume`.
- **Do NOT git commit** (don't half-commit a wave). Successfully-written artefacts are left in the working tree; they get bundled into the resume commit.
- Surface to user: per-target outcome, error summary, suggested remediation.
- Suggest `--resume` once fixed.
- Stop the build.

### 8. Move to next wave

Otherwise, proceed.

## State file shape

`projects/{P}-{NAME}/.arckit/state.json`:

```json
{
  "state_format_version": "0.3",
  "project_id": "001",
  "project_name": "001-arckit-saas",
  "recipe": "uk-saas",
  "recipe_path": ".claude/skills/arckit-build/recipes/uk-saas.yaml",
  "started_at": "2026-05-03T16:00:00Z",
  "last_wave_completed": 5,
  "current_wave": 6,
  "targets": {
    "PRIN":   {"status": "complete", "path": "projects/000-global/ARC-000-PRIN-v1.0.md", "wave": 0, "source": "pre-existing"},
    "REQ":    {"status": "complete", "path": "...", "wave": 1, "source": "pre-existing"},
    "RISK":   {"status": "complete", "path": "...", "wave": 3, "skill": "arckit:risk"},
    "SVCASS": {"status": "pending"}
  },
  "waves": [
    {"n": 0, "targets": ["PRIN"], "status": "complete", "completed_at": "..."},
    {"n": 3, "targets": ["RISK", "STRATEGY"], "status": "complete", "completed_at": "..."}
  ]
}
```

## When invoked, perform these steps in order

1. **Parse arguments** from skill input (project, --plan, --resume, --recipe, --enable, --exclude, etc.). If project not specified, ask user.
2. **Detect project**: resolve `<project>` arg → `projects/{P}-{slug}/`. Confirm directory exists.
3. **Load recipe**: resolve `--recipe NAME` (default `uk-saas`) against the precedence list. Read the YAML with the Read tool. Validate top-level shape (`recipe`, `schema_version`, `targets`, `defaults.version`). Halt with a clear error if the recipe file is missing or malformed.
4. **Resolve enabled targets**: drop `optional_targets` whose `default: false` unless `--enable ID` was passed; drop `optional_targets` named in `--exclude ID`. Apply `{P}/{NAME}/{V}/{TOPIC}` substitution to every `args` and `output.project` field.
5. **Load state.json** at `projects/{P}-{NAME}/.arckit/state.json`. If absent, scan project dir for existing `ARC-{P}-*-v*.md` files and infer initial state.
6. **Subagent capability smoke-test** (first wave only, skip on `--resume`): before dispatching the real wave, spawn one throwaway `general-purpose` Agent with this prompt:

   > "Examine your system-reminder messages — they enumerate the skills available in this conversation. Return exactly one line:
   > - `AVAILABLE` if the list contains `arckit:principles` (or any other `arckit:*` skill).
   > - `NOT_AVAILABLE` otherwise.
   > Do NOT invoke any skill. Do NOT call any tool other than reading your own context."

   This is a metadata check, not a skill invocation — it should complete in seconds. If the response is `NOT_AVAILABLE`, halt: subagents in this session do not have access to plugin skills (Failure mode #1). Suggest enabling the plugin at user-scope or running the harness from a session where `claude --print '/skill list'` shows the `arckit:*` family.
7. **Compute work list**: enabled-targets minus `state.targets` whose `status: complete` AND file exists.
8. **If `--plan`**: print plan (each wave + targets + line `(skip|build) target ← deps`), exit.
9. **For each wave** (sequential outer loop):
   - Print wave header.
   - Build the per-agent prompt for each target in wave.
   - **Send a single assistant message containing N Agent tool calls** (one per target, all parallel).
   - Collect summaries when all complete.
   - Validate each output.
   - Update state.json (Write tool).
   - git commit (Bash) unless `--no-commit`.
   - Halt if any fail.
10. **Post-build hooks**: spawn parallel agents — one per `recipe.post_build_hooks[]` entry.
11. **Final report**:
    - Targets built (with line counts) / skipped / failed.
    - Total wall-clock.
    - Post-build hook outcomes.
    - Next recommended action (e.g., "review pre-GA blockers in TCOP §Critical Issues").

## Failure modes to watch for

- **Subagent doesn't have access to `arckit:*` skills** — detected by the smoke-test in step 6 of the run order; halts the build before any wave dispatches. Workaround if smoke-test fails: load the skill prompt in main context once, pass as plain text to agent (deferred to v0.4+).
- **Recipe file missing or malformed** — halt at step 3 with the exact YAML parse error and the precedence list of paths checked.
- **Skill expects interactive Q&A** — the worker prompt's defaults table covers this. The recipe's `args` field should be specific enough to skip interaction in the first place.
- **Output path collision** — two targets writing to same path. Recipe must have unique `(output.project, output.type, output.subfolder, multi_instance)` tuples for non-multi-instance targets, and unique `id`s for multi-instance ones.
- **State drift** — user manually deletes/edits artefacts after build. Detected via `test -f` validation + optional file-hash check (deferred to v0.4+).
- **Cycle in dependencies** — wave algorithm halts with "unresolvable cycle" error and lists the involved targets. Glob deps (`ADR-*`) are expanded before cycle detection.

## Future versions

- v0.4: file-hash-based change detection — skip if all inputs unchanged; orchestrator-side fallback for skills inaccessible to subagents.
- v0.5: cross-reference + schema validators between waves; recipe inheritance (`extends: uk-saas`).
- v0.6: CI mode (`--validate-only` for GitHub Actions).
- v1.0: skills declare I/O in frontmatter; harness reads frontmatter directly; dedicated `arckit:artefact-worker` subagent type; recipe "Expected output path" computed from skill metadata (single source of truth).
