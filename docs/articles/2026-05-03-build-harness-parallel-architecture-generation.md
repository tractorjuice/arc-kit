# Building a full architecture in one Claude Code session

`/arckit:build` is the new ArcKit build harness. Run one command and the whole architecture builds itself: requirements, stakeholder analysis, ADRs, risk register, business case, designs, secure-by-design assessment, DPIA, diagrams, traceability matrix, and post-build health check. It does this by reading a YAML recipe, computing the dependency graph, and dispatching subagents in parallel waves. One commit per wave, full audit trail, resumable state.

This article walks through what the harness does, the benefits it brings to architects and governance teams, and the live evidence from the first two real runs.

## What the harness does

`/arckit:build` is orchestration only. It reads the recipe, computes the dependency DAG, groups artefacts into waves where every dependency is satisfied, and dispatches one subagent per artefact per wave. Each subagent runs in its own fresh context, invokes the corresponding `/arckit:*` skill, writes its output, and returns a short summary. The orchestrator validates the outputs, commits the wave as a single git commit, and updates `projects/{P}/.arckit/state.json` so progress is visible and resumable.

The result is a workflow that takes a project from blank slate to governance-ready in under thirty minutes for a typical UK Government SaaS, with thirty-one architecture artefacts produced and committed in nine atomic waves.

## Recipes ship the governance baseline with you

The harness ships with two built-in recipes, both real YAML files you can read and edit.

`uk-saas` is the default. It builds the full UK Government civilian SaaS governance set: principles, requirements, stakeholder analysis, eight architecture decision records with seeded topics for the usual cloud, identity, and procurement choices, the strategy and Wardley map, the risk register, the high-level design, the strategic outline business case, the Technology Code of Practice review, the Secure by Design assessment, the Data Protection Impact Assessment, three architecture diagrams, the operational and DevOps plans, the FinOps strategy, the Service Standard assessment, and the traceability matrix. Thirty-one artefacts in total, every one of them template-driven and traceable.

`uk-mod-sovereign` is for Ministry of Defence and other accredited environments running fully air-gapped. The eight ADR topics are rewritten for sovereign deployment (cleared-personnel access, sealed-media distribution, JSP 440 alignment, on-premise AI integration), the Secure by Design step swaps to MOD Secure by Design with the Cyber Defence Authority Assurance Toolset, JSP 936 AI assurance is added for the on-premise AI route, ATRS algorithmic transparency is available as an opt-in, and the Service Standard step is dropped because sovereign deployments are not citizen-facing.

If neither fits your context, copy a recipe to `.arckit/recipes/` and edit. The harness reads project overrides first and falls back to the plugin defaults, so customisations survive plugin updates. The recipe schema (version 1) is documented in the SKILL.md, with an annotated reference YAML for newcomers.

## Built for parallelism, governance, and resumability

A few design choices make the harness genuinely useful in production.

**Parallel waves.** Targets in the same wave have no dependencies on each other, so they run as parallel subagents inside a single assistant message. A wave with six artefacts completes in roughly the time of one, not six. The `uk-saas` recipe spends most of its build time in the wide middle waves (eight ADRs in W2, six artefacts in W3 and W4) where parallelism delivers the biggest wins.

**Atomic commits.** One git commit per wave covers all artefacts in that wave plus the updated `state.json`. The commit message lists each target with its line count and headline result, so reviewers can read the architecture's evolution one wave at a time. Nothing half-finished ever lands on the branch.

**Hook-allocated paths.** Workers do not construct filenames. They invoke their assigned `/arckit:*` skill, the skill writes the file, and ArcKit's existing `validate-arc-filename.mjs` PreToolUse hook normalizes the path at write time: it allocates the next sequence number for ADRs and diagrams, applies the correct subfolders, and pads project IDs. The harness inherits this safety net for free, and recipes can stay focused on what to build rather than where the file lands.

**Build provenance.** The plugin's `provenance-stamp.mjs` PostToolUse hook stamps every artefact with a `## Build Provenance` block recording the recipe, wave, target ID, requested effort level, and effective effort level after any silent model downgrade. The block is markdown-rendered and visible to human reviewers. Auditors get a machine-stamped trail that complements the human-authored footer the command writes.

**Resumability.** If anything fails its validation check, the orchestrator writes the failure to `state.json` and surfaces a per-target outcome with a remediation hint. Run `/arckit:build 001 --resume` and the harness picks up exactly where it stopped. The recipe path is recorded in state, so resume works deterministically across recipe edits.

## What the live runs show

The first end-to-end run was project 001 in our reference repository, "ArcKit as a Service" itself, with the `uk-saas` recipe. Thirty-one of thirty-one targets completed cleanly across nine waves, including the post-build health check and documentation site regeneration. Wall-clock time was under thirty minutes. The commit history is the audit trail: nine wave commits plus the post-build hook commit, each one atomic, each one carrying its recipe and wave metadata in `state.json`.

The sovereign recipe is currently building project 002. Twenty-six of thirty-two artefacts have completed across the first six waves, including the eight sovereign-specific ADRs, MOD Secure by Design, DPIA, AI Playbook, and the air-gap-boundary diagram. The diff between the two recipes (replaces, adds, removes, eight rewritten ADR topics) survived first contact with reality and produced exactly the documents the recipe describes.

## Try it

If you have the ArcKit plugin installed, the harness is already there. Three commands to know:

`/arckit:build 001 --plan` shows the wave plan for any existing project without dispatching anything. Recommended first step on any new run.

`/arckit:build 001` runs the full default recipe and commits each wave as it completes.

`/arckit:build 002 --recipe uk-mod-sovereign` runs the sovereign recipe.

Add `--enable AIP` to opt in to AI Playbook on a non-AI default recipe. Add `--exclude SVCASS` to skip the Service Standard assessment when it does not apply. Add `--target NAME --refresh` to force-rebuild a single artefact and everything downstream of it.

The harness is one Claude Code session away from being your whole governance pipeline. Spend your day reviewing the artefacts. Let the recipe do the typing.

---

**Generated by**: Mark Craddock, ArcKit
**Date**: 3 May 2026
**ArcKit Version**: 4.12.3
