# Atomic Task Graphs for Documents, Not Tool Calls

## A July 2026 agentic-control paper independently validates ArcKit's build architecture — and its ablations tell us exactly what to build next

*Mark Craddock · medium.com/arckit*

---

A paper landed on arXiv this month that everyone building agentic pipelines should read, and almost nobody outside the agent-benchmark community will. It's called **Atomic Task Graph: A Unified Framework for Agentic Planning and Execution** (Zhang et al., arXiv:2607.01942), from teams at South China University of Technology and Tsinghua. On the surface it's about getting small open-source models through three long-horizon interactive benchmarks — ALFWorld, WebShop, and ScienceWorld. Underneath, it's the most rigorous articulation I've seen of a thesis I've been arguing for a year:

**Output quality in agentic systems is a control-framework problem, not a model-capability problem.**

The headline result: a 7B–8B open-source model wrapped in their control framework beats GPT-4 running ReAct on long-horizon interactive tasks. Not "approaches" — beats. Llama-3-8B with ATG scored 63.65 on ALFWorld against GPT-4 ReAct's 41.24. No fine-tuning, no additional supervision, purely inference-time orchestration. The gap between a well-orchestrated small model and a poorly-orchestrated frontier model is now larger than the gap between the models themselves.

What makes the paper personally interesting is something else, though. When I mapped its four mechanisms against ArcKit's parallel build harness, I found that two of them already ship in the current release, a third is on ArcKit's published roadmap, and only one is genuinely absent. Two systems built for entirely different domains — theirs navigates simulated households, mine writes NCSC CAF assessments — hit the same failure modes in linear LLM orchestration and independently derived the same structural answers.

That's convergent evolution, and it's the strongest kind of validation there is. When independent teams converge on a design, you're probably looking at something true about the problem rather than a fashion in the solution. Better still, the paper's ablation studies put numbers on components ArcKit adopted on engineering instinct — and those numbers reorder my roadmap.

## Five terms, quickly

Enterprise architects and ML researchers don't share a vocabulary, and this article sits on the boundary. Five terms carry most of the weight:

**DAG — directed acyclic graph.** A network of nodes connected by one-way arrows, with no loops. Here the nodes are tasks (or governance artefacts) and an arrow means "this must exist before that can start". The no-loops property is what makes it executable: there's always something you can do next. If you've read a project dependency chart or a PERT diagram, you've read a DAG.

**Topological sort.** The algorithm that turns a DAG into an execution order: repeatedly take everything whose prerequisites are all done, run that batch, repeat. Each batch is a "wave", and everything within a wave can run in parallel because nothing in it depends on anything else in it.

**ReAct.** The dominant agent pattern since 2023: the model reasons, acts, observes the result, appends it all to a growing transcript, and loops. Simple, general, and — as this paper measures — structurally prone to error propagation and hallucination as the transcript grows.

**Ablation study.** The experimental discipline of removing one component at a time and measuring the damage. It's how you learn which parts of a system actually earn their keep, rather than which parts the authors are fondest of. The ablation numbers are the most useful thing in this paper.

**Hallucinated action.** An agent attempting something that isn't valid in its environment — interacting with an object that doesn't exist, calling a tool with impossible arguments. The document-generation equivalent: citing a requirement ID that no requirements document contains.

With that loaded, the paper.

## The paper in ninety seconds

Most agent frameworks — ReAct, Reflexion, and their descendants — organise task-solving as a linear textual trajectory. The agent reasons, acts, observes, appends everything to a growing context, and repeats. The authors identify three structural failures of that paradigm. Errors couple to everything that came before them, so a mistake at step 4 poisons steps 5 through 40. Failures can't be localised, so recovery means backtracking or wholesale replanning. And the ever-growing context itself induces hallucinated actions in later stages — their measurement puts ReAct's hallucinatory action rate at 42.86%.

ATG's answer is to make the plan an explicit DAG and keep it explicit through execution — the graph isn't a planning sketch that gets flattened back into a transcript, it's the live data structure the agent executes against. Four mechanisms do the work:

1. **Interface-preserving recursive compilation.** A coarse task is recursively refined into subgraphs until every node is an atomic, directly executable unit. The constraint that makes this compositional: every refinement must preserve the parent node's input–output interface. You can swap a node for a subgraph without the rest of the graph noticing.

2. **Dependency-aware execution.** Edges carry data dependencies — this output feeds that input — not just ordering. Execution readiness is determined by the graph, independent branches run in parallel, and each node sees only the context it actually consumes.

3. **A pre-execution thought experiment.** Before touching the environment, the system cheaply simulates the plan to catch missing steps, invalid dependencies, and tool mismatches. It flags roughly 19–27% of plans as risky before execution, with precision above 74%.

4. **Minimal necessary subgraph repair.** When something fails, the system traces the failed node back through the graph's refinement history, finds the smallest region the failure could have originated from, freezes everything validated, and repairs only the affected subgraph. Their ablations show this is the single most valuable component — in most settings, removing it costs more than removing anything else.

The hallucination result deserves its own sentence: ATG cuts the hallucinatory action rate from ReAct's 42.86% to 12.14%, and the authors attribute the reduction primarily to context localisation — each atomic node operating on a narrow, relevant slice of context instead of the full accumulated trajectory.

## Where ArcKit already got there

ArcKit generates enterprise architecture governance artefacts: requirements specifications, risk registers, business cases, DPIAs, Wardley Maps, design reviews. These artefacts have hard dependencies — you can't write a Strategic Outline Business Case without stakeholder goals, can't build a data model without data requirements. The `/arckit:arckit-build` harness exists to generate a whole project's artefact set without a human sequencing thirty commands by hand, and it works like this:

**An explicit, executed DAG.** Build recipes declare each target's dependencies; the harness runs a topological sort with parallelism, dispatching each wave of independent targets simultaneously and halting on cycles. That's ATG's dependency-aware execution — same algorithm, same rationale.

**Context localisation via subagent isolation.** Every target runs in its own subagent with an explicit list of the only files it may read. The main orchestrator never touches artefact content at all — its operating rules literally begin with "never read or write artefact content yourself". This was an instinct-driven decision: research-heavy commands making dozens of web searches were polluting the main context and quality degraded. ATG's ablations now supply the controlled evidence — a 71.7% relative reduction in hallucinated actions, attributed primarily to exactly this mechanism. It's rare that a paper retroactively hands you the experiment you didn't run for a decision you already shipped.

**Content-addressed node state.** As of v0.4, the harness records the SHA-256 of every dependency artefact at build time — a cryptographic fingerprint of the file's exact content, so any edit, however small, is detectable. On the next run, any target whose recorded input hashes no longer match the live files is marked stale, and staleness propagates through the DAG in topological order — edit the requirements document and the risk register, HLD, business case, plan, and traceability matrix all correctly re-enter the build. This is ATG's node-level state recording pushed one step further, into what Make and Bazel have done for fifty years: if inputs are unchanged and the output validated, skip the target. Governance artefacts suit this unusually well — the inputs are Markdown files with stable, machine-readable IDs, not the noisy environment observations the paper had to work with.

So of ATG's four mechanisms, ArcKit ships dependency-aware execution and state-tracked incremental rebuilds today, and gets the hallucination benefit of context localisation as a side effect of the subagent architecture. What's left is more interesting than what's done.

## What the ablations say to build next

### Typed edges — already on the roadmap, now with a sharper why

ArcKit's DAG currently encodes dependencies at *file* level: RISK depends on REQ. ATG's edges are typed at *interface* level: this output feeds that input. The ArcKit translation — each command declaring the artefact sections and ID ranges it consumes (DR-xxx, NFR-xxx, stakeholder goals) and the doc-type and IDs it emits — is already written into the harness's published v1.0 plan: skills declare their I/O in frontmatter, and the harness reads it directly.

The paper sharpens the argument for prioritising it. First, granularity: whole-file hashes mean fixing a typo in the requirements introduction rebuilds everything downstream, whereas interface-level edges scope the cascade to artefacts that actually consume what changed. Second — and this is the part specific to ArcKit — the dependency knowledge currently lives in four places: recipe YAML, each command's own prose, the human-readable dependency matrix and workflow guides, and the reference graph that `/arckit:traceability` reconstructs from finished documents after the fact. Four representations, no shared source of truth, free to drift. Frontmatter I/O declarations collapse them into one: recipes shrink to target selection, workflow recommendations derive from the same data, and traceability gains a new job — validating that each artefact's *actual* cross-references match its command's *declared* inputs. Declared versus observed is what turns interface contracts from documentation into something enforceable.

### Failure-localised repair — the half that's missing

ArcKit's staleness cascade runs *forward*: an input changed, so invalidate the downstream closure. ATG's repair mechanism also runs *backward*: a validation failed, so trace through the graph's history to the smallest region that could have introduced the fault, freeze everything verified, and regenerate only that.

ArcKit hits the forward case well and the backward case not at all. When the traceability matrix surfaces orphaned requirements, or a `/arckit:conformance` pass flags a design that has drifted from the ADR it was meant to implement, today's options are re-run the failed target or refresh broadly — precisely the "patch the symptom or replan globally" pattern the paper demolishes. The analytical machinery for doing better already exists in `/arckit:impact` and the traceability matrix; the missing move is wiring impact analysis into the build loop so repair scope is *computed* rather than commanded. The ablation numbers justify the effort: removing subgraph repair cost 7.72 points on ALFWorld — the largest single-component degradation in most settings. Failures in long-horizon pipelines are overwhelmingly local. Treat them locally.

### Semantic pre-flight — the genuine gap

Before dispatching a node, ATG runs a cheap internal simulation: are the inputs sufficient, the dependencies valid, the tool assignments plausible? ArcKit's harness does structural checks — the dry-run plan, a subagent capability smoke-test — but nothing semantic. Nothing asks whether a target's inputs actually contain enough substance to generate from.

The economics here are *stronger* for ArcKit than for the paper's benchmarks. Their "expensive execution" is environment steps; mine is a subagent invocation that can run to tens of thousands of tokens for a JSP 936 defence AI assurance pack. Discovering after that spend that the stakeholder analysis never defined measurable goals — so the business case had nothing to trace benefits to — is an expensive way to learn something a sub-1K-token pre-flight check would have caught. At the paper's rates — 19–27% of plans flagged, precision above 74% — even a mediocre implementation pays for itself on the first prevented dispatch.

## What ArcKit will *not* adopt

The paper's recursive decomposition drives everything down to atomic tool calls. ArcKit won't follow it there, and the reason is a design position, not an omission.

ArcKit's atoms are whole governance documents, and that granularity is deliberate. A requirements specification is not a bag of independent tool calls; it's a coherent argument whose sections must agree with each other. Decomposing below artefact level would fight the template-driven quality model that makes the outputs reviewable by humans and defensible in front of an assessment panel. The atom should match the unit of *accountability*, and in governance work that unit is the document.

The one abstraction worth extracting from that section is **interface preservation**: when any artefact regenerates, its externally-referenced IDs must survive, so downstream references never break. That's currently a convention in ArcKit. It should be a hard contract, enforced in hooks, with regeneration that violates it rejected before it lands.

## The point

The sequencing falls out of the dependencies between the mechanisms themselves — which is fitting. Typed interfaces first, because both repair and enforcement need them. Failure-localised repair second, because the ablations rank it highest and the impact machinery already exists. Semantic pre-flight third, cheap and immediately profitable.

Step back from the mechanics, though, and the paper's real contribution is the framing. For two years the industry's default answer to unreliable AI output has been *wait for the next model*. ATG is a controlled, ablated demonstration that the harness around the model is worth more than the next model tier — that an 8B model in a good control structure outperforms a frontier model in a bad one. And the convergence tells you this isn't one team's clever trick: independent builders keep arriving at explicit dependency graphs, isolated node contexts, validated incremental state, and localised repair, because those are what the problem demands.

ArcKit's wager has always been that the same holds for enterprise architecture: the value isn't in the model that drafts your risk register, it's in the dependency structure, validation gates, and traceability that make the register *trustworthy*. The artefact production is commoditising on schedule. The control framework — and the judgement encoded in it — is the part that compounds.

The graph, it turns out, is the product.

---

*ArcKit is an open-source enterprise architecture governance harness for Claude Code, Gemini CLI, Copilot, and Codex — github.com/tractorjuice/arc-kit. The paper is Zhang et al., "Atomic Task Graph: A Unified Framework for Agentic Planning and Execution", arXiv:2607.01942.*