# ArcKit Self-Harness: When the Governance Harness Starts Improving Itself

**ArcKit's original autoresearch loop optimized command prompts. Self-Harness extends that idea to the whole harness: traces, weakness mining, candidate proposals, held-in and held-out validation, and conservative acceptance rules for prompts, agents, hooks, runtime settings and verification criteria.**

---

## Autoresearch was the first step

ArcKit's first autoresearch workflow borrowed a simple idea from machine-learning experiment loops: change one thing, run the benchmark, score the result, keep the change only if quality improves.

For ArcKit, the editable thing was a command prompt. The fixed benchmark was a scratch architecture project, a template, structural checks and an LLM-as-judge rubric. A run would create a worktree, execute a command such as `requirements` or `adr`, score the generated artifact, and either keep or discard the prompt edit.

That already changed the shape of prompt engineering. Instead of arguing about whether a line "felt better", the harness produced evidence: score, structural result, commit, status and description. Small prompt edits could be tested repeatedly against the same project fixture.

But a mature AI harness is more than a prompt.

## What Self-Harness changes

Self-Harness widens the optimization surface.

The prompt still matters, but ArcKit's behavior also depends on agents, hooks, runtime policy, context injection, verifier rules, templates and tool access. A bad result might come from vague wording in a command. It might also come from missing project context, a hook that injects the wrong graph depth, an agent with the wrong tool set, a verifier that accepts weak evidence, or a runtime policy that lets the assistant wander.

The Self-Harness program therefore adds modes:

- `mode:prompt` keeps the original behavior and optimizes a command Markdown file.
- `mode:full` can consider prompts, hooks, runtime settings, templates and verification rules.
- `mode:agent` targets an agent definition.
- `mode:hook` targets hook behavior directly.

That matters because the harness can now ask a better question: not "which sentence should we add to the prompt?", but "which addressable surface caused this failure?"

## The trace becomes evidence

The new workflow starts by capturing execution traces.

`autoresearch-tracer.mjs` records the target, mode, timestamp, model and effort metadata, tool calls, token count, duration, created artifacts, verifier output and final output. Those traces are written under `.arckit/autoresearch-traces/<target>/<mode>/`.

That gives the harness something concrete to analyze. A low score is not just a number. It is connected to the run that produced it: which tools were used, how long the run took, which artifacts were created, what the verifier saw, and whether the output failed structurally or merely underperformed.

Without traces, optimization becomes guesswork. With traces, the system can mine failure patterns.

## Weakness mining

`weakness-miner.mjs` turns failed or discarded runs into verifier-grounded failure signatures.

A signature has three parts:

- the verifier-level cause, such as missing document control, wrong path, invalid IDs or insufficient quality
- the agent-side behavior, such as early termination, excessive tool use, repeated actions or missing context
- the inferred mechanism, such as missing guidance, insufficient context, format violation or cross-reference gaps

Those signatures are clustered. If five runs fail because the command keeps omitting cross-references, that becomes a cluster. If several runs fail because the assistant stops early before filling required sections, that becomes another cluster. Each cluster is then mapped to addressable surfaces: prompt, context injection, runtime policy, verification rules or templates.

This is the point where Self-Harness becomes different from ordinary prompt iteration. It does not just observe that a result was weak. It tries to explain where the weakness lives.

## Candidate proposals

`harness-proposer.mjs` uses the clusters to generate targeted changes.

The constraints are deliberately conservative. Proposals should be minimal, grounded in a specific failure mechanism, and diverse enough that parallel candidates are not all trying the same edit. A prompt proposal might add explicit cross-reference guidance. A runtime proposal might bound exploration. A verification proposal might strengthen the rule that checks generated IDs.

In full mode, the system can generate several candidates for different clusters or surfaces. That is the useful expansion beyond the first autoresearch loop: instead of assuming every failure is a prompt failure, ArcKit can test whether the right fix lives elsewhere in the harness.

## Held-in and held-out validation

The hardest part of self-improvement is not making the benchmark score go up. It is preventing the harness from overfitting the benchmark.

Self-Harness adds held-in and held-out task splits. The candidate is allowed to learn from the held-in tasks, but it has to survive held-out validation before it is accepted. `harness-validator.mjs` applies a conservative rule: a candidate must avoid degrading either split and must improve at least one split by more than the threshold.

That rule is intentionally strict. If a change makes the familiar fixture better but hurts the held-out fixture, it is rejected. If it produces only noise-level movement, it is rejected. The point is not to produce the most exciting edit. The point is to accept changes that generalize.

For a governance harness, that is the right bias. A brittle prompt trick that works on one sample architecture project and fails on another is worse than no change.

## What can improve

The new Self-Harness workflow can target four kinds of ArcKit surface.

Commands can become more explicit, better structured and more aligned with templates. Agents can gain sharper tool instructions, better stopping rules or clearer output contracts. Hooks can improve context injection, traceability hints or validation behavior. Verification rules can become stricter where previous runs showed recurring gaps.

The practical result is a feedback loop around the whole architecture-governance method. ArcKit can run a command, inspect the artifact, identify the failure mechanism, propose a harness edit, test it across splits, and keep only the changes that improve the governed output.

That is not autonomy for its own sake. It is regression-tested method improvement.

## Why this fits ArcKit

ArcKit is already a harness around AI CLIs. It gives assistants commands, templates, document IDs, hooks, project structure and checks. Self-Harness makes that harness inspectable as an object of improvement.

The best version of this is not a system that rewrites itself wildly. It is a system that notices repeated failures and proposes small, reviewable changes with evidence attached. The human still reviews the diff. Git still records the change. Tests still matter. The harness just does more of the tedious experimental work.

For enterprise architecture teams, that is the interesting path. The method can improve without turning governance into a black box. Every accepted improvement can point back to traces, clusters, scores and held-out validation.

## The loop closes

Architecture governance has always had a feedback problem. Teams create methods, templates and assurance checks, but the method itself is rarely measured against output quality. It becomes habit.

Self-Harness gives ArcKit a way to measure and refine the method. Run the work. Capture the trace. Mine the weakness. Propose the smallest plausible improvement. Validate it against held-out tasks. Keep the change only when the evidence is good enough.

That is the right kind of self-improvement for a governance tool: explicit, bounded, reviewable and evidence-led.

## Links

- Pull request: [#606 -- add Self-Harness autoresearch implementation](https://github.com/tractorjuice/arc-kit/pull/606)
- Program: [`scripts/autoresearch/program-selfharness.md`](https://github.com/tractorjuice/arc-kit/blob/main/scripts/autoresearch/program-selfharness.md)
- Guide: [`docs/guides/autoresearch.md`](https://github.com/tractorjuice/arc-kit/blob/main/docs/guides/autoresearch.md)

<!-- arckit:community-block -->
## Join the ArcKit Community

- **Discord** — real-time conversation, help with commands, and what people are building: [discord.gg/HsA4Y3hQ4](https://discord.gg/HsA4Y3hQ4)
- **LinkedIn Group** — announcements, case studies, and longer-form discussion: [linkedin.com/groups/17641034](https://www.linkedin.com/groups/17641034/)
- **GitHub** — code, issues, and contributions: [github.com/tractorjuice/arc-kit](https://github.com/tractorjuice/arc-kit)
