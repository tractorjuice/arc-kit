# The Five Wardley Commands in ArcKit: Every Command, What It Does, When to Run It

Wardley Mapping is often reduced to the drawing. You sketch user needs at the top, arrange components by evolution, and call it a strategy. It is not. A single map captures one snapshot of situational awareness. The strategic value comes from what you do with the map: where does your organisation actually sit in Wardley's doctrine phases, which climatic patterns will reshape the landscape with or without you, and which gameplays are available given your current position.

ArcKit ships five slash commands that mirror Simon Wardley's own analytical pipeline. Each produces a separate, version-controlled artefact. Run them independently or chain them together, with each command reading the outputs of the others when they exist.

This is a walkthrough of each command, what it actually does, and when to reach for it.

## 1. /arckit.wardley.value-chain

**What it does.** Decomposes a user need into a ranked dependency chain. Takes a domain like "patient appointment booking" or "online shopping" and returns an anchor, visibility scores for every component, initial evolution estimates, and OWM-ready syntax.

**Why it matters.** The hardest part of Wardley Mapping is the first step. Most people freeze at the blank canvas. value-chain exists to remove that friction. It asks a series of decomposition questions, applies visibility heuristics (closer to the user equals higher visibility), and produces a chain you can iterate on rather than invent from nothing.

**When to run it.** Before /arckit.wardley, whenever you are starting a new mapping exercise. Also useful on its own during discovery to check that your team shares an understanding of what the user actually needs versus what the technology team thinks they need.

**Output artefact.** WVCH (Wardley Value Chain), stored in the project directory. Multi-instance, so you can model different user journeys separately.

**A detail that matters.** Every generated value chain passes a mathematical validation hook before the command exits. The hook applies formulas from the Wardley Map Math Model to check that visibility scores are internally consistent and that dependency depth is reasonable. If the chain is structurally broken, the command tells you before you commit to a bad foundation.

## 2. /arckit.wardley

**What it does.** Produces a full strategic Wardley Map with components positioned on evolution and visibility axes, build-versus-buy recommendations for each component, movement predictions, and OWM syntax for rendering. Since ArcKit 4.9.0, the map also renders inline as Mermaid wardley-beta in your generated docs/index.html dashboard.

**Why it matters.** This is the centerpiece of the suite. The map is the thing most people think of when you say "Wardley Map", and for good reason. It converts implicit strategy into an auditable artefact. The build-versus-buy column alone is worth the exercise: it forces you to name every Genesis or Custom-Built component and justify why you are building it, rather than defaulting to "we always build".

**When to run it.** After /arckit.wardley.value-chain, or directly if you already have a mental model of the components. Also run it after any major architectural decision to check that the decision still holds when viewed through an evolution lens.

**Output artefact.** WARD, multi-instance. You can have several maps per project covering different strategic views: current state, target state, or a specific capability.

**A detail that matters.** The command reads every sibling Wardley artefact that exists. If doctrine, climate, and gameplay analyses are already in the project, the generated map is informed by them automatically. It will, for example, soften evolution predictions if a relevant climatic inertia pattern has been flagged, or flag a component as a doctrine risk if the organisation's doctrine assessment scored low on the relevant principle.

## 3. /arckit.wardley.doctrine

**What it does.** Assesses your organisation's strategic maturity across 40-plus universally useful principles, organised into Simon Wardley's four phases (Stop Self-Harm, Becoming More Context Aware, Better for Less, Continuously Evolving) and six categories (Communication, Development, Operation, Structure, Learning, Leading). Each principle is scored 1 to 5 with evidence requirements.

**Why it matters.** Strategies fail in execution far more often than they fail in design. Doctrine assessment answers a question most organisations avoid: are we capable of executing the strategy this map implies? A map that requires genuine experimentation from an organisation scoring 1.5 on "focus on high-quality learning" is a map that will not land.

**When to run it.** Annually as a health check, or whenever you are about to commit to a multi-year strategic programme. Also useful before a reorganisation to establish a baseline that you can re-measure against.

**Output artefact.** WDOC, single-instance (one assessment per project), with a versioning pattern so you can compare re-assessments over time. The command explicitly supports re-assessment comparison and will diff the current scores against the previous WDOC if one exists.

**A detail that matters.** The scoring is evidence-based, not aspirational. The command asks you to name specific artefacts, incidents, decisions, or public commitments that justify each score. If you cannot cite evidence, the score stays at 1 regardless of how confident the leadership team feels.

## 4. /arckit.wardley.climate

**What it does.** Analyses the 32 external forces that act on your landscape regardless of your choices. Climatic patterns include "everything evolves", "efficiency enables innovation", "past success breeds inertia", and 29 others, grouped into six categories: Component, Financial, Speed, Inertia, Competitor, and Prediction patterns. The command scores each pattern's impact on your mapped components and produces a forecast.

**Why it matters.** Climate is the weather of strategy. You can choose your gameplay, but you cannot choose the climate. Most strategic failures trace back to a misread of climate: believing a pattern is optional when it is universal, or underestimating how quickly a component will commodify. The climate command is the closest thing to an aerial photograph of the forces around you.

**When to run it.** After the initial map, and especially before /arckit.wardley.gameplay. Also re-run it whenever a major external event shifts the landscape: a new entrant, a regulatory change, a commodity offering from a hyperscaler.

**Output artefact.** WCLM, multi-instance. Typically one per strategic horizon (twelve-month climate, three-year climate).

**A detail that matters.** The output includes a Peace/War/Wonder positioning analysis for each mapped component. Peace/War/Wonder is Wardley's model of how competitive landscapes cycle through phases of stability, disruption, and genesis of novel forms. Knowing which phase a component sits in changes which plays are available to you, which is why climate must precede gameplay.

## 5. /arckit.wardley.gameplay

**What it does.** Evaluates which strategic plays are applicable to your current map position, drawn from a catalogue of 60-plus gameplays across 11 categories. Each play is scored against your position, checked for compatibility with other selected plays, and annotated with a Dungeons and Dragons alignment (Lawful Good, Neutral, Lawful Evil, Chaotic Evil) so you can be explicit about the ethics of what you are choosing to do.

**Why it matters.** Gameplay is where strategy stops being abstract. "Open source the reference implementation" is a play. "Sensibly poison a competitor's commodity dependency" is also a play, and it has a moral colour. The command refuses to pretend these are value-neutral. It shows you the full catalogue, including the Chaotic Evil plays, because you need to recognise them when they are used against you even if you would never deploy them yourself.

**When to run it.** After /arckit.wardley.climate has been completed. Plays that look attractive in isolation become inappropriate when climatic context is added. Also run it when evaluating a competitor's move, by mapping their visible position and asking which plays they are likely running.

**Output artefact.** WGAM, multi-instance. You can model different gameplay portfolios side by side (defensive, opportunistic, market-shaping) and compare them.

**A detail that matters.** The command checks compatibility between your selected plays. Two plays that both make strategic sense individually can be incompatible when run together. For example, a platform play combined with a closed-source commodity play sends a contradictory signal to the ecosystem. The compatibility check catches these before you commit to a contradictory portfolio.

## How They Chain Together

You can run any of the five commands independently. The value multiplies when they are used together.

A typical deep analysis pipeline runs as follows.

Start with value-chain to establish what the user actually needs and what supports it. Run wardley to produce the map. Run doctrine to check whether the organisation can execute on what the map implies. Run climate to map the external forces shaping the landscape. Finally, run gameplay to pick the plays that fit your position, your climate, and your doctrine maturity. Feed the gameplay findings back into a revised map, and you have closed the loop.

Each command reads every relevant sibling artefact that exists. So if you run them in this order, each subsequent command's output is progressively better informed than its predecessors. You do not need to re-enter context manually.

## Where the Knowledge Comes From

Every Wardley command reads from a shared reference skill before generating output. That skill contains structured knowledge distilled from three Wardley Mapping books and over a million words of primary source material, organised into six reference files.

The doctrine reference carries all 40-plus principles with scoring rubrics, evidence markers, and diagnostic questions.

The gameplay patterns reference carries all 60-plus plays with D&D alignments, evolution-stage applicability, and compatibility notes. It also includes case study summaries showing how AWS, Netflix, Tesla, Spotify, and Apple have deployed specific plays in practice.

The climatic patterns reference carries all 32 patterns with strategic implications and assessment questions, plus the Peace/War/Wonder cycle model and a taxonomy of six inertia types (Financial, Political, Cultural, Organisational, Knowledge, and Dependency).

The evolution stages reference describes Genesis, Custom-Built, Product, and Commodity with transition heuristics and a talent model matching the right team profile to each stage.

The mathematical models reference carries scoring formulas for evolution positioning, play-position matrices, and climate impact weighting, which is what makes the scoring quantitative rather than vibes-based.

The mapping examples reference contains worked cases that give the model concrete patterns to draw from.

This is why the output is not a generic LLM gloss on Wardley Mapping. The model reads the theory before it opens its mouth.

## Getting Started

If you already have ArcKit installed as a Claude Code plugin, the five Wardley commands are available as /arckit.wardley.value-chain, /arckit.wardley, /arckit.wardley.doctrine, /arckit.wardley.climate, and /arckit.wardley.gameplay. The same commands exist in the Codex, Gemini, OpenCode, Copilot, and Paperclip extensions with platform-appropriate naming.

If you are new to ArcKit, install it via /plugin marketplace add tractorjuice/arc-kit inside Claude Code, or pip install arckit-cli for the CLI-based workflow.

Start small. Run value-chain on a single user need you know well. Let it generate a chain. Look at the scores, argue with them where they feel wrong, commit a revised version. Then run wardley on the same project and watch how the map inherits the chain's structure. Then keep going. By the time you have run all five, you will have a strategic artefact pack that most consultancies charge five-figure sums to produce.

The maps, assessments, and gameplays all version-control as markdown. They diff cleanly in pull requests. They render inline in your ArcKit dashboard thanks to Mermaid wardley-beta. They are the closest thing the architecture governance community has to executable strategy.

---

**Links**

- ArcKit: https://github.com/tractorjuice/arc-kit
- Wardley Maps Mermaid companion: https://github.com/tractorjuice/wardley-maps-mermaid
- Simon Wardley's book: https://medium.com/wardleymaps
- create.wardleymaps.ai: https://create.wardleymaps.ai

<!-- arckit:related-articles -->
## Related Articles

- [ArcKit 4.9.0: Wardley Maps Render Natively in Architecture Docs](article-viewer.html?a=2026-04-22-v490-wardley-mapping-support)
- [ArcKit v4.3.0: A Complete Wardley Mapping Suite](article-viewer.html?a=2026-03-16-wardley-suite-strategic-mapping)
- [Your Wardley Maps Belong in Git: What Mermaid Support Changes](article-viewer.html?a=2026-05-19-wardley-maps-mermaid-github)
- [How ArcKit Tidies Wardley Map Labels: A Deterministic Placement Engine](article-viewer.html?a=2026-05-22-tidy-wardley-labels)

<!-- arckit:community-block -->
## Join the ArcKit Community

- **Discord** — real-time conversation, help with commands, and what people are building: [discord.gg/HsA4Y3hQ4](https://discord.gg/HsA4Y3hQ4)
- **LinkedIn Group** — announcements, case studies, and longer-form discussion: [linkedin.com/groups/17641034](https://www.linkedin.com/groups/17641034/)
- **GitHub** — code, issues, and contributions: [github.com/tractorjuice/arc-kit](https://github.com/tractorjuice/arc-kit)
