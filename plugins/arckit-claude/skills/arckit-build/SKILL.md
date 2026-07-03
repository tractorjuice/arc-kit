---
name: arckit-build
description: "This skill should be used when the user wants to bulk-build ArcKit artefacts in parallel rather than running individual /arckit:* commands one at a time. Invoke manually with /arckit:arckit-build when the task sounds like 'kick off a build', 'build everything', 'generate all artefacts', 'run all the commands', 'rebuild this project from scratch', 'resume the build', 'pick up where we left off', 'refresh the artefacts', 'run the recipe', 'build the whole project end-to-end', or 'parallel build', or mentions `--plan`, `--resume`, `--target`, `--refresh`, `--recipe`, or `.arckit/state.json`. The skill orchestrates parallel /arckit:* generation using subagent isolation: reads project state, computes the artefact dependency DAG, dispatches one subagent per target per wave (each subagent invokes a /arckit:* skill in its own context), validates outputs, commits the wave, and persists progress to .arckit/state.json for resumability."
disable-model-invocation: true
---

# ArcKit Build Harness (v0.4)

You are running the ArcKit build harness. Your job is **orchestration only** — never read or write artefact content yourself. Spawn subagents for that.

## Operating principles

- **Never read or write artefact content in main context.** That's what subagents are for.
- **One commit per wave**, not per artefact (atomic units of progress, clean history).
- **Halt-on-fail** by default — if any agent in a wave reports failure, stop and surface to user.
- **State is sacred** — update `projects/{P}-{NAME}/.arckit/state.json` after every wave, before moving on.
- **Single message, multiple Agent calls** for parallelism within a wave. Never loop sequential Agent calls.
- **Idempotency**: if state says `complete`, the file exists at the recorded path, AND every input file's SHA-256 matches the hash recorded at build time, skip. Otherwise the target is **stale** — rebuild it (and propagate staleness through the DAG). See § "Input-hash change detection".
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
| `--skip-hash-check` | Treat any `complete` target with its output file present as up-to-date; skip SHA-256 staleness detection. Fast resume; risks missing edits to inputs. |

## Recipe loading

Recipes are external YAML files. Lookup precedence for `--recipe NAME` (first hit wins):

1. **Project override**: `.arckit/recipes/{NAME}.yaml` — user customizations preserved across plugin updates.
2. **Core plugin**: `${CLAUDE_PLUGIN_ROOT}/skills/arckit-build/recipes/{NAME}.yaml` — recipes shipped with the `arckit` core plugin (`uk-saas`, `uk-mod-sovereign`).
3. **Sibling community plugins**: `${CLAUDE_PLUGIN_ROOT}/../arckit-*/recipes/{NAME}.yaml` — recipes shipped with installed community plugins (e.g. `arckit-uae/recipes/uae-federal-ai.yaml`, `arckit-ca/recipes/ca-federal-fitaa.yaml`).

Resolution: glob the parent directory of `${CLAUDE_PLUGIN_ROOT}` for `arckit-*/recipes/{NAME}.yaml` and take the first match. The glob works in both layouts — marketplace-installed plugins land as siblings under the same marketplace-source cache directory, and the dev-mode same-repo layout has them as sibling directories in the repo root.

Default recipe is `uk-saas`. To customize, copy the core default to `.arckit/recipes/uk-saas.yaml` and edit there:

```bash
mkdir -p .arckit/recipes
cp "${CLAUDE_PLUGIN_ROOT}/skills/arckit-build/recipes/uk-saas.yaml" .arckit/recipes/uk-saas.yaml
```

**Built-in recipes**:

| Recipe | Plugin | Use case |
|--------|--------|----------|
| `uk-saas` | `arckit` (core) | UK Government managed multi-tenant SaaS — civilian departments |
| `uk-mod-sovereign` | `arckit` (core) | UK MOD / sovereign / air-gapped — `mod-secure` + `jsp-936`, no SVCASS, sealed-media distribution |
| `uae-federal-ai` | `arckit-uae` | UAE Federal AI — full Cabinet agentic AI decree compliance with all 12 UAE community commands, integrated research wave (general AI + AWS / Azure UAE region availability), plus core ArcKit governance |
| `uae-agentic-transformation` | `arckit-uae` | UAE Federal Agentic AI Transformation — focused 24-month playbook for the 23 April 2026 Cabinet framework's 50%-of-services-by-April-2028 target; ADRs reshaped around agentic architecture (orchestration, human-in-the-loop, observability, kill-switch); PLAN + ROADMAP timeboxed to the 24-month window |
| `ca-federal-fitaa` | `arckit-ca` | Canadian Federal — FITAA, ITSG-33, GC Digital Standards |
| `au-federal` | `arckit-au` | Australian Federal / DISP-supplier — ASD Essential Eight, ISM, DTA DSS, Privacy Act 1988, OAIC NDB, PSPF, AI Assurance, DISP attestation (35 targets, 9 waves) |
| `au-energy` | `arckit-au-energy` (composes `arckit-au` baseline) | Australian Energy Sector — AESCSF maturity, AER ring-fencing, AEMC NER/NGR, AEMO interfaces, DERMS/DOE, CSIP-AUS layered on the AU federal baseline (Essential Eight, ISM, OT security, SOCI/CIRMP, Privacy Act/NDB). Optional default-off `SERVICE_INVENTORY` (`servicenow`). 22 targets. First **Australian sector** overlay. |
| `uk-nhs-clinical-safety` | `arckit` (core, references `arckit-uk-nhs` commands) | UK NHS Clinical Safety + UK/EU MDR — NHS DCB0129 (manufacturer) + DCB0160 (deployer) clinical safety case (Marcus Baw SAFETY.md 3-file spec), NHS DTAC v3, UK MDR 2002 + EU MDR 2017/745 SaMD/AIaMD classification. Composes with UK SaaS baseline (no swaps; adds clinical safety + medical-device regulation on top). 44 targets across 8 waves. First **sector** overlay. |

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

## Input-hash change detection

The orchestrator records the SHA-256 of every input artefact at build time and compares against the live filesystem on the next run. This catches the "user edited REQ after the build completed but never re-ran" case that pure `test -f` idempotency misses.

### What counts as an input

A target's inputs are the **resolved output paths of its `deps`** (after glob expansion). Externally-supplied inputs (e.g. `external/policies/*.md`) are not hashed by v0.4 — only artefacts the harness itself produced or recorded as `source: "pre-existing"`. Recipes that surface external inputs should hash them in v0.5.

### What's recorded

Each completed target's state entry gains an `input_hashes` map of dep-ID → SHA-256:

```json
"RISK": {
  "status": "complete",
  "path": "projects/001-arckit-saas/ARC-001-RISK-v1.0.md",
  "input_hashes": {
    "REQ":  "9f2a...c41e",
    "STKE": "1b88...07ad",
    "PRIN": "44e7...bc92"
  },
  ...
}
```

The map is populated by the orchestrator (Bash `sha256sum`) immediately after a target validates `complete` in step 5 — workers don't compute hashes.

### Staleness rules (skipped if `--skip-hash-check`)

At work-list computation (step 7 of the run order):

1. Start with `done = { t ∈ state.targets : t.status == "complete" AND test -f t.path }`.
2. **Direct staleness**: for each `t ∈ done`, recompute SHA-256 for every entry in `t.input_hashes`. If any current hash differs from the recorded value (or the input file is now missing), `t` is **stale** — move it from `done` back into pending and clear it from `state.targets[t].status` (set `"stale"`).
3. **Propagated staleness**: walk the DAG; any target whose deps (transitively) include a stale target is itself stale. Apply in topological order so a single REQ edit cascades to RISK, HLD, SOBC, PLAN, TRACE, …
4. Targets explicitly named in `--refresh NAME` are marked stale unconditionally (existing behaviour — overrides hash check).
5. With `--skip-hash-check`, skip steps 2–3 entirely. `done` is whatever survives the `test -f` filter.

Print the staleness reason in the `--plan` output so users can see why a target rebuilt:

```text
Wave 1: REQ
  (stale) REQ ← file edited since last build (sha mismatch)
Wave 3: RISK, HLD, STRATEGY, ...
  (stale-cascade) RISK ← REQ changed since 2026-05-12T10:14:03Z
```

### Performance note

SHA-256 of typical ArcKit artefacts (≤500 KB markdown) is sub-millisecond per file. A 50-target project incurs <100 ms of hashing on `--resume`. Workers do no hashing; only the orchestrator does (single shell loop in step 5/step 7).

## Wave plan algorithm

Standard topological sort with parallelism:

1. `pending = recipe.targets ∩ enabled - done` — where `enabled` reflects `--enable`/`--exclude` flags and `optional_targets[id].default`, and `done` is computed by the staleness rules in § "Input-hash change detection" (i.e. `complete` AND `test -f` AND every input hash matches, unless `--skip-hash-check` is set). Stale targets stay in `pending`.
2. `done` from staleness computation above.
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
    "agent_summary": "{≤200-word agent report}",
    "input_hashes": {
      "<DEP_ID>": "{SHA256_OF_state.targets[DEP_ID].path}"
    }
  }
}
```

Compute `input_hashes` via Bash `sha256sum` on each resolved dep's `state.targets[DEP_ID].path` immediately before persisting state. Skip deps whose target has no recorded path (e.g. external inputs). Targets with no deps get `input_hashes: {}`.

For failures: `status: "failed"`, `error: "..."`, `wave: {WAVE_N}` — do not record `input_hashes` for failed targets.

### 6. Git commit

If `--no-commit` not set:

```bash
git add {OUTPUT_PATHS} projects/{P}-{NAME}/.arckit/state.json
git commit -m "$(cat <<'EOF'
Build wave {N}: {targets joined} via arckit-build

{One-line per target with line count and headline result}

Co-Authored-By: Claude Code <noreply@anthropic.com>
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
  "state_format_version": "0.4",
  "project_id": "001",
  "project_name": "001-arckit-saas",
  "recipe": "uk-saas",
  "recipe_path": ".claude/skills/arckit-build/recipes/uk-saas.yaml",
  "started_at": "2026-05-03T16:00:00Z",
  "last_wave_completed": 5,
  "current_wave": 6,
  "targets": {
    "PRIN":   {"status": "complete", "path": "projects/000-global/ARC-000-PRIN-v1.0.md", "wave": 0, "source": "pre-existing", "input_hashes": {}},
    "REQ":    {"status": "complete", "path": "...", "wave": 1, "source": "pre-existing", "input_hashes": {"PRIN": "44e7...bc92"}},
    "RISK":   {"status": "complete", "path": "...", "wave": 3, "skill": "arckit:risk", "input_hashes": {"REQ": "9f2a...c41e", "STKE": "1b88...07ad", "PRIN": "44e7...bc92"}},
    "SVCASS": {"status": "pending"}
  },
  "waves": [
    {"n": 0, "targets": ["PRIN"], "status": "complete", "completed_at": "..."},
    {"n": 3, "targets": ["RISK", "STRATEGY"], "status": "complete", "completed_at": "..."}
  ]
}
```

State written by older versions (`state_format_version: "0.3"`) is read-compatible: targets without `input_hashes` are treated as if all hashes match (no spurious rebuild on upgrade). The next successful build of any such target records its hashes and migrates the entry to 0.4 in place. The orchestrator rewrites `state_format_version` to `"0.4"` on first write.

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
7. **Compute work list**: apply the staleness rules from § "Input-hash change detection". `done` = targets where `status: complete` AND file exists AND every recorded input hash still matches AND no transitive dep is stale (steps 2–3 of the staleness rules). `pending` = `enabled-targets − done`. Stale targets have their `state.targets[id].status` rewritten to `"stale"` and re-enter the wave plan. With `--skip-hash-check`, skip the hash + cascade checks (`test -f` only).
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

## Pairing with `/goal` (Claude Code v2.1.139+)

`/goal` keeps Claude working across turns until a completion condition is met, showing live elapsed / turns / tokens overhead. It composes naturally with this build harness when the user's intent stretches beyond a single recipe pass:

- **"Build until APPROVED"** — `/goal every artefact under projects/001-*/ has Document Control Status: APPROVED and no Next Review Date in the past`, then run `/arckit:build 001 --recipe uk-saas --resume`. The harness rebuilds stale targets; `/goal` keeps re-running it until the post-condition holds.
- **"Refresh a stale slice"** — `/goal no artefact under projects/001-*/ has been flagged by the stale-artifact-scan monitor`, then `/arckit:build 001 --refresh REQ` (or whichever target the monitor flagged).
- **"Drive a project to GA"** — wrap the build under a goal that also requires zero open `/arckit:conformance` violations and a green `/arckit:health` scan; `/goal` will sequence `build → conformance → health → refresh-violator → build` until clean.

Caveats:

- `/goal` is **Claude Code only** (not exposed in Codex / OpenCode / Gemini). Document the manual loop ("re-run `/arckit:build --resume` until state.json shows all targets complete") for non-Claude runtimes.
- Stop-hook block cap (v2.1.143, default 8) applies — if a Stop hook keeps blocking inside the goal loop the turn ends with a warning. ArcKit's Stop hooks (`session-learner`, `session-end-stamp`) are observational and never block, so the cap should not interfere.
- One `/goal` per session; don't nest. The harness's own halt-on-fail still fires inside the goal loop.

## Failure modes to watch for

- **Subagent doesn't have access to `arckit:*` skills** — detected by the smoke-test in step 6 of the run order; halts the build before any wave dispatches. Workaround if smoke-test fails: load the skill prompt in main context once, pass as plain text to agent (deferred to v0.4+).
- **Recipe file missing or malformed** — halt at step 3 with the exact YAML parse error and the precedence list of paths checked. If a community recipe is requested but the corresponding community plugin isn't installed, surface a concrete install command: `"Recipe 'uae-federal-ai' not found. It ships in the arckit-uae community plugin. Install with: claude plugin install arckit-uae"`. The orchestrator maps recipe name to expected plugin via the built-in recipes table; recipes the table doesn't know about fall back to the generic precedence-list error.
- **Skill expects interactive Q&A** — the worker prompt's defaults table covers this. The recipe's `args` field should be specific enough to skip interaction in the first place.
- **Output path collision** — two targets writing to same path. Recipe must have unique `(output.project, output.type, output.subfolder, multi_instance)` tuples for non-multi-instance targets, and unique `id`s for multi-instance ones.
- **State drift** — user manually deletes/edits artefacts after build. Deletions are caught by `test -f`. Edits are caught by the SHA-256 hash check (§ "Input-hash change detection") — the edited artefact's downstream targets are marked stale and rebuilt in dep order. Use `--skip-hash-check` to bypass.
- **Cycle in dependencies** — wave algorithm halts with "unresolvable cycle" error and lists the involved targets. Glob deps (`ADR-*`) are expanded before cycle detection.

## Future versions

- v0.4 (remaining): orchestrator-side fallback for skills inaccessible to subagents — load `arckit:*` skill prompts in main context once and inline them in worker prompts when the smoke-test returns `NOT_AVAILABLE`. (File-hash change detection shipped in v0.4 — see § "Input-hash change detection".)
- v0.5: cross-reference + schema validators between waves; recipe inheritance (`extends: uk-saas`); hash external inputs (e.g. `external/policies/*.md`) in addition to dep artefacts.
- v0.6: CI mode (`--validate-only` for GitHub Actions).
- v1.0: skills declare I/O in frontmatter; harness reads frontmatter directly; dedicated `arckit:artefact-worker` subagent type; recipe "Expected output path" computed from skill metadata (single source of truth).
