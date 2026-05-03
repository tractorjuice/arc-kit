# Build Harness Guide

> **Guide Origin**: Official | **ArcKit Version**: [VERSION] | **Claude Code only**

`/arckit:build` orchestrates parallel `/arckit:*` artefact generation against a YAML recipe. It is the only command that doesn't produce a single artefact — it produces *many*, one per recipe target, dispatched as parallel subagents and committed in waves.

---

## Why this exists

Running `/arckit:requirements` then `/arckit:risk` then `/arckit:tcop`… sequentially in main context exhausts the conversation window past about five artefacts. The build harness solves this by spawning one `general-purpose` subagent per artefact per wave, each running its own isolated context. Main session stays small and only orchestrates.

## Quick start

```text
/arckit:build 001 --plan                 # Dry run — show the wave plan, exit
/arckit:build 001                        # Build everything in the default uk-saas recipe
/arckit:build 001 --resume               # Pick up after a halt
/arckit:build 002 --recipe uk-mod-sovereign
```

## Arguments

| Arg | Effect |
|-----|--------|
| `<project>` | Project ID (e.g. `001`) or full directory name (`001-arckit-saas`) |
| `--plan` | Dry run; print the wave plan and exit |
| `--resume` | Read state.json; continue from last incomplete wave |
| `--target NAME` | Build only `NAME` and its missing dependencies |
| `--refresh NAME` | Force-rebuild `NAME` and everything downstream |
| `--no-commit` | Skip the per-wave git commit |
| `--recipe NAME` | Recipe to use; default `uk-saas` |
| `--enable ID` | Enable an optional target (e.g. `--enable AIP`) |
| `--exclude ID` | Exclude a default-on optional target (e.g. `--exclude SVCASS`) |

## Built-in recipes

| Recipe | Targets | Use case |
|--------|--------:|----------|
| `uk-saas` | 31 | UK Government managed multi-tenant SaaS — civilian departments, GDS Service Standard, NCSC CAF |
| `uk-mod-sovereign` | 32 | UK MOD / sovereign / air-gapped — `mod-secure` + `jsp-936`, no SVCASS, sealed-media distribution |

Recipes ship at `${CLAUDE_PLUGIN_ROOT}/skills/arckit-build/recipes/{name}.yaml`. Override per project at `.arckit/recipes/{name}.yaml`.

## How it works

1. **Recipe loaded** from `.arckit/recipes/{name}.yaml` if present, else `${CLAUDE_PLUGIN_ROOT}/skills/arckit-build/recipes/{name}.yaml`
2. **Optional-target filter** applied (`--enable` / `--exclude` / recipe defaults)
3. **Subagent skill smoke-test** — confirms `arckit:*` skills are reachable from `general-purpose` subagents in this session (~5 sec halt-or-go check)
4. **Topological wave computation** — targets group into waves where every dep is complete; wave 0 is no-deps targets, wave 1 depends only on wave 0, etc.
5. **Per-wave dispatch** — single assistant message containing N `Agent` tool calls runs in parallel; each subagent invokes its assigned `arckit:*` skill, validates the output, returns a ≤200-word summary
6. **Per-wave commit** — atomic git commit covering all artefacts in the wave plus the updated `state.json`
7. **Halt-on-fail** — if any subagent fails or validation fails, write state, do *not* commit, surface a per-target error report. Resume with `--resume`
8. **Post-build hooks** — `arckit:health` and `arckit:pages` run in parallel after the final target wave

## Path allocation — trust the hook

Workers don't construct filenames or call `generate-document-id.sh` themselves. The plugin's `validate-arc-filename.mjs` PreToolUse hook normalizes paths at write time: allocates the next sequence number for ADR/DIAG, applies `decisions/` and `diagrams/` subfolders, pads project IDs. Workers read the corrected `ACTUAL_PATH` from the Skill tool result and report it back.

## Customizing recipes

To customize the UK-SaaS recipe for your organization:

```bash
mkdir -p .arckit/recipes
cp "${CLAUDE_PLUGIN_ROOT}/skills/arckit-build/recipes/uk-saas.yaml" .arckit/recipes/uk-saas.yaml
# Edit .arckit/recipes/uk-saas.yaml — add/remove targets, change ADR topics, change defaults
/arckit:build 001 --plan                 # Confirm the new wave plan
```

The same pattern works for `uk-mod-sovereign`. To create a fresh recipe (e.g. `eu-saas`):

```bash
cp "${CLAUDE_PLUGIN_ROOT}/skills/arckit-build/recipes/uk-saas.yaml" .arckit/recipes/eu-saas.yaml
# Edit — change recipe: name to "eu-saas", swap UK-specific targets for EU equivalents
/arckit:build 003 --recipe eu-saas --plan
```

## State and resumability

`projects/{P}-{NAME}/.arckit/state.json` records the build's progress. Schema:

```json
{
  "state_format_version": "0.4",
  "project_id": "001",
  "project_name": "001-arckit-saas",
  "recipe": "uk-saas",
  "recipe_path": "...",
  "started_at": "2026-05-03T16:00:00Z",
  "last_wave_completed": 5,
  "current_wave": 6,
  "targets": {
    "PRIN":   {"status": "complete", "path": "...", "wave": 0, "skill": "arckit:principles"},
    "REQ":    {"status": "complete", "path": "...", "wave": 1, "skill": "arckit:requirements"},
    "SVCASS": {"status": "pending"}
  }
}
```

The recipe path is recorded so `--resume` works deterministically across recipe edits.

## When NOT to use this

- **Single-artefact tweaks** — just call `/arckit:requirements` etc directly
- **First-time exploration of ArcKit** — start with `/arckit:start` for guided onboarding
- **CI / scripted runs** — not yet supported (planned v0.6 with `--validate-only`)

## Build provenance

Every artefact written by the build harness gets a `## Build Provenance` block injected by `provenance-stamp.mjs`, recording the recipe, wave, target ID, requested effort, and effective effort. See [Plugin Hooks → Provenance stamping](../../CLAUDE.md#provenance-stamping-provenance-stampmjs) in CLAUDE.md.

## Troubleshooting

| Symptom | Likely cause | Fix |
|---------|-------------|-----|
| Smoke-test halts: "subagents do not have access to plugin skills" | Plugin enabled at project-scope only | Enable at user-scope, or run `claude --print '/skill list'` to confirm |
| Wave halts with "unresolvable cycle" | Bad `deps:` in custom recipe | Run `--plan` and inspect cycle target list |
| `--resume` re-runs targets that already completed | `state.json` corrupted, deleted, or `recipe_path` mismatch | Delete `state.json` and re-run from scratch with `--target` |
| ADR-009 written when ADR-008 already exists | Hook auto-allocated next slot | Expected behaviour — multi-instance numbering is monotonic |

## See also

- [`SKILL.md`](../../arckit-claude/skills/arckit-build/SKILL.md) — full orchestration spec
- [`recipes/uk-saas.yaml`](../../arckit-claude/skills/arckit-build/recipes/uk-saas.yaml) — annotated reference recipe
- [`recipes/uk-mod-sovereign.yaml`](../../arckit-claude/skills/arckit-build/recipes/uk-mod-sovereign.yaml) — sovereign-deployment variant
- [Plugin Hooks → Provenance stamping](../../CLAUDE.md#provenance-stamping-provenance-stampmjs) — how build provenance is captured

---

**Generated by**: ArcKit `/arckit:build` documentation
**ArcKit Version**: [VERSION]
