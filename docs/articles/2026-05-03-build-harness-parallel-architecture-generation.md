# Why ArcKit needed a build harness, and what it does

If you have ever tried to take an architecture project from blank slate to governance-ready by running ArcKit slash commands one at a time, you already know the problem. You start with `/arckit:principles`, then `/arckit:requirements`, then `/arckit:stakeholders`. Each command produces a real, traceable, template-driven artefact. The first three feel productive. The fourth starts to slow down. By the fifth or sixth, the conversation context is full of upstream documents the model is trying to keep in mind, and the seventh command begins to forget the requirement IDs from the second. By the time you reach the traceability matrix, you are starting fresh sessions to keep the artefacts coherent.

Generating a full UK Government architecture properly takes around thirty distinct artefacts. Doing that sequentially is a few days of work and a long sequence of paste-and-pray context refreshes. We have heard the same complaint enough times to be sure it was real, and a few weeks ago we did something about it.

## What `/arckit:build` actually does

`/arckit:build` is a build harness for ArcKit. It reads a YAML recipe that lists every artefact you need, computes the dependency graph, groups artefacts into parallel waves, and dispatches one subagent per artefact per wave. Each subagent runs in its own isolated context, invokes the corresponding `/arckit:*` skill, writes its output, and reports back a short summary. The orchestrator collects the summaries, validates the outputs, commits the wave as a single git commit, and updates a state file so the run is resumable.

In plain terms: instead of running thirty commands in a row over three days, you run one command and the architecture builds itself in under an hour, with one git commit per wave and a clean audit trail.

The orchestration model is what makes this work. The main session never reads or writes artefact content. It only reads the recipe, computes waves, dispatches subagents, validates results, and commits. Everything heavy happens inside the subagents, each of which has its own fresh context. There is no context exhaustion because nothing accumulates in main session.

## Recipes, not configuration

The recipes are real YAML files you can read and edit. We ship two with the plugin. The first is `uk-saas`, designed for civilian UK Government departments shipping a multi-tenant SaaS. It runs thirty-one artefacts: principles, requirements, stakeholder analysis, eight architecture decision records with seeded topics for the usual cloud and identity choices, the strategy and Wardley map, the risk register, the high-level design, the strategic outline business case, the Technology Code of Practice review, the Secure by Design assessment, the Data Protection Impact Assessment, three diagrams, the operational and DevOps plans, the Service Standard assessment, and the traceability matrix that ties it all back together.

The second recipe is `uk-mod-sovereign`, designed for Ministry of Defence and other accredited environments running fully air-gapped. Same shape, but the eight ADR topics are rewritten for sovereign deployment (cleared-personnel access, sealed-media distribution, JSP 440 alignment, on-premise AI integration), the Secure by Design step swaps to MOD Secure by Design with CAAT, JSP 936 AI assurance is added for the on-premise model route, and the Service Standard step is dropped because sovereign deployments are not citizen-facing.

If neither fits, copy a recipe to `.arckit/recipes/` in your project and edit. The harness reads project overrides first, then falls back to the plugin defaults, so customisations survive plugin updates.

## Built for halts, resumes, and audit

The harness assumes things will go wrong. If a subagent fails its validation check, the orchestrator writes the failure to `state.json`, refuses to commit the wave (no half-baked atomic units), and surfaces the per-target outcome with a remediation hint. You fix the underlying issue and run `/arckit:build 001 --resume`. The harness picks up exactly where it stopped, with no duplicate work and no lost progress.

We also added a build provenance hook that stamps every artefact with a small block recording the recipe, wave, target ID, requested effort level, and the effective effort level after any silent model downgrade. Documents written via the build harness can be traced back to the wave and recipe that produced them. UK Government auditors will recognise the value here: every artefact carries machine-stamped provenance that complements the human-authored footer.

## What the live runs show

The first end-to-end validation was project 001 in our test repository, "ArcKit as a Service" itself, running the `uk-saas` recipe. Thirty-one out of thirty-one targets completed cleanly across nine waves, including the post-build health check and documentation site regeneration. Total wall-clock was under thirty minutes. A handful of bug-fix commits during that run, included in the commit history, show exactly the kind of drift the recipe-driven approach catches early: a path-helper invocation argument order error, an interactive question that needed default handling, a missing capture variable in the worker prompt. Each one was caught in flight, fixed, and the next wave proceeded.

The sovereign recipe is mid-flight on project 002 as we write this. Twenty-six of thirty-two artefacts have built cleanly, with the remaining six (Service Assessment dropped by design, plus optional AI assurance and traceability) waiting for the next session. The shape of the diff between the two recipes (replaces, adds, removes, eight rewritten ADR topics) survived first contact with reality and produced exactly the documents we expected.

## Try it, then customise it

If you have the ArcKit plugin installed, the build harness is already there. Run `/arckit:build 001 --plan` against any existing project to see the wave plan. Add `--recipe uk-mod-sovereign` if you are building a sovereign deployment. Drop the `--plan` flag when you are ready to commit (literally: each wave is a real git commit).

The harness is one Claude Code session away from being your whole governance pipeline. We would rather you spent your day reviewing the artefacts than typing the commands that produce them. That was the design brief, and the early evidence is that it works.

---

**Generated by**: Mark Craddock, ArcKit
**Date**: 3 May 2026
**ArcKit Version**: 4.12.3
