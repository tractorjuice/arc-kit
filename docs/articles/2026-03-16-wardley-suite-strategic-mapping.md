# ArcKit v4.3.0: A Complete Wardley Mapping Suite for AI-Assisted Strategic Architecture

Most architecture toolkits treat Wardley Maps as a single artefact. Draw a map, discuss it in a workshop, file it somewhere, move on. ArcKit v4.3.0 changes that. The release introduces four new commands that turn Wardley Mapping from a one-shot exercise into a structured analytical pipeline, covering value chain decomposition, doctrine maturity assessment, climatic pattern analysis, and gameplay selection. Together with the existing `/arckit.wardley` command, they form a five-command suite that mirrors Simon Wardley's own analytical framework.

This isn't a surface-level integration. Each command is backed by reference material distilled from three Wardley Mapping books, totalling over a million words of source material condensed into actionable reference files that the AI reads before generating any output. The result is that ArcKit now produces Wardley artefacts that reference the actual theory, not a language model's vague recollection of it.

Here's what the suite looks like in practice.

## The Five Commands and How They Connect

The Wardley suite follows a natural analytical flow. You don't have to run them in order, and each command works independently, but the outputs build on each other when they exist.

![Wardley Suite Command Flow](2026-03-16-wardley-suite-flow.png)

**`/arckit.wardley.value-chain`** starts at the beginning: what does the user actually need, and what components support that need? It decomposes a user need into a dependency chain, assigns visibility positions, identifies evolution stages, and outputs OWM-ready syntax. If you've ever stared at a blank Wardley Map canvas wondering where to start, this is your answer. Feed it a domain like "patient appointment booking" and it traces the chain from patient need through booking interface, appointment logic, identity verification, notification, down to infrastructure. Each component gets an evolution position and a visibility score.

**`/arckit.wardley`** takes those components (or starts fresh) and produces a full strategic Wardley Map with evolution analysis, build-vs-buy recommendations, and movement predictions. This command has existed since ArcKit's early versions, but v4.3.0 enhances it to read sibling artefacts. If a value chain, doctrine assessment, or climate analysis already exists in the project, the wardley command consumes them automatically for a more informed map.

**`/arckit.wardley.doctrine`** assesses your organisation's strategic maturity across 40+ universally useful principles, organised into Simon Wardley's four phases: Know Your Users, Systematise Learning, Leverage Strategic Play, and Adapt. Each principle gets scored from 1 (unaware) to 5 (embedded), with evidence requirements. The output is not a feel-good maturity model. It's a diagnostic that frequently reveals uncomfortable truths: organisations that believe they are data-driven but score 1.5 on "use appropriate methods", or teams that claim agility but score 2 on "remove bias and duplication".

**`/arckit.wardley.climate`** analyses the 32 external forces that shape your landscape regardless of what you choose to do. These are the climatic patterns: everything evolves through supply and demand, higher-order systems create new sources of value, efficiency enables innovation, success breeds inertia. The command evaluates which patterns are actively affecting your mapped components, scores their impact, and produces a forecast. This is the weather report for your strategy. You cannot choose effective plays without understanding the climate you're operating in.

**`/arckit.wardley.gameplay`** is where theory meets action. Drawing from a catalogue of 60+ strategic plays across 11 categories, this command analyses which plays are applicable to your current map position. Each play carries a D&D alignment classification: Lawful Good (creates genuine ecosystem value), Neutral (pragmatic, context-dependent), Lawful Evil (self-interested but within norms), and Chaotic Evil (destructive, to be recognised when used against you). The command doesn't just list applicable plays. It scores them against your position, checks compatibility between selected plays, flags anti-patterns, and produces an execution-ready analysis.

## What the Reference Material Actually Contains

Each command reads from a shared skill directory containing six reference files that the AI consults before generating output. These aren't prompt engineering tricks. They're structured knowledge bases distilled from source material:

**Doctrine reference** (40+ principles across 4 phases, 6 categories): Every principle includes a description, scoring rubric, evidence markers, and diagnostic questions. The six categories span Communication, Development, Operation, Structure, Learning, and Leading. A diagnostic checklist lets you self-assess without running the full command.

**Gameplay patterns reference** (60+ plays across 11 categories): Each play includes its D&D alignment, description, when to use it, evolution stage applicability, and compatibility notes. The categories span User Perception, Accelerators, De-accelerators, Dealing with Toxicity, Market, Defensive, Attacking, Ecosystem, Competitor, Positional, and Poison. Case study summaries show how AWS, Netflix, Tesla, Spotify, Apple, and others have deployed these plays in practice.

**Climatic patterns reference** (32 patterns across 6 categories): Each pattern includes a description, strategic implication, and assessment question. The reference also covers the Peace/War/Wonder economic cycle, pattern interaction maps, a per-component assessment template, and a taxonomy of six inertia types (Financial, Political, Cultural, Organisational, Knowledge, and Dependency) with diagnostic checklists for each.

**Evolution stages reference**: Detailed characteristics for Genesis, Custom-Built, Product, and Commodity stages, with transition heuristics for identifying when a component is shifting between stages and a talent model mapping the right team profiles to each stage.

**Mathematical models reference**: Scoring formulas for evolution positioning, play-position matrices, and climate impact weighting, so the AI's recommendations are quantitative rather than hand-wavy.

**Mapping examples reference**: Worked examples including a TechnoGadget case study, e-commerce value chains, and strategic play applications, giving the AI concrete patterns to draw from.

## Document Types and Project Integration

Each command produces a versioned, traceable document following ArcKit's standard document control format:

- **wardley.value-chain** produces WVCH documents (e.g. `ARC-001-WVCH-001-v1.0`) — multi-instance, one per value chain
- **wardley** produces WARD documents (e.g. `ARC-001-WARD-001-v1.0`) — multi-instance, one per strategic map
- **wardley.doctrine** produces a single WDOC document (e.g. `ARC-001-WDOC-v1.0`) — one per project
- **wardley.climate** produces WCLM documents (e.g. `ARC-001-WCLM-001-v1.0`) — multi-instance, one per landscape assessment
- **wardley.gameplay** produces WGAM documents (e.g. `ARC-001-WGAM-001-v1.0`) — multi-instance, one per strategic analysis

All Wardley artefacts are stored in a `wardley-maps/` subdirectory within the project, alongside the existing WARD documents. The validate-wardley-math hook runs automatically when any Wardley-related document is written, checking that evolution coordinates, component counts, and OWM syntax are mathematically consistent.

Because ArcKit tracks artefact dependencies, the Wardley suite feeds directly into downstream commands. A `/arckit.roadmap` can consume the gameplay analysis to sequence strategic plays over time. A `/arckit.strategy` can synthesise Wardley insights with stakeholder priorities and risk assessments into a full architecture strategy document. The traceability chain extends from stakeholders through requirements, through Wardley analysis, into implementation planning.

## Cross-Platform Availability

Like every ArcKit command, the Wardley suite is available across all six distribution formats. The Claude Code plugin provides the richest experience with automatic handoff suggestions (finish a value chain and it suggests creating a map; finish a climate assessment and it suggests gameplay analysis), Stop hooks for output validation, and skill-based reference file access.

The Gemini CLI extension, Codex CLI extension, OpenCode CLI extension, and Copilot extension all receive the full command prompts and reference materials through ArcKit's converter pipeline. The only difference is that non-Claude platforms inline the full prompt rather than delegating to agents, since they don't support the Task/agent architecture. The strategic analysis is identical. The commands generate the same document formats, read the same reference material, and produce the same artefact types.

## Why This Matters for Enterprise Architecture

Wardley Mapping has always been powerful but underused in formal architecture governance. The barrier isn't intellectual. It's practical. Drawing a single map is useful. Maintaining a disciplined analytical practice across doctrine assessment, climate analysis, and gameplay selection is valuable but time-consuming. Most organisations manage one or two maps and then lose momentum.

ArcKit v4.3.0 lowers that barrier dramatically. A doctrine assessment that would take a consultant a week to compile can be drafted in minutes, with evidence markers tied to your existing architecture artefacts. A climate analysis that requires deep familiarity with all 32 patterns is produced by an AI that has read the source material and applies it systematically. Gameplay selection that normally requires a strategy workshop can be explored iteratively, checking play compatibility and alignment scores before committing to an approach.

The suite doesn't replace strategic thinking. It makes the structured parts of strategic analysis fast enough that teams can actually do them. When the boring parts are automated, the interesting conversations about what plays to execute and which doctrine gaps to close can happen more often, with better input data, across more projects.

ArcKit v4.3.0 is available now. Update via the Claude Code marketplace, `gemini extensions update arckit`, or pull the latest from GitHub. The four new commands are tagged as Experimental while they accumulate test coverage across ArcKit's 22 test repositories. The reference material, templates, and guides are stable.

<!-- arckit:related-articles -->
## Related Articles

- [ArcKit 4.9.0: Wardley Maps Render Natively in Architecture Docs](article-viewer.html?a=2026-04-22-v490-wardley-mapping-support)
- [The Five Wardley Commands in ArcKit: When to Run Each](article-viewer.html?a=2026-04-22-wardley-commands-walkthrough)
- [Your Wardley Maps Belong in Git: What Mermaid Support Changes](article-viewer.html?a=2026-05-19-wardley-maps-mermaid-github)
- [How ArcKit Tidies Wardley Map Labels: A Deterministic Placement Engine](article-viewer.html?a=2026-05-22-tidy-wardley-labels)

<!-- arckit:community-block -->
## Join the ArcKit Community

- **Discord** — real-time conversation, help with commands, and what people are building: [discord.gg/HsA4Y3hQ4](https://discord.gg/HsA4Y3hQ4)
- **LinkedIn Group** — announcements, case studies, and longer-form discussion: [linkedin.com/groups/17641034](https://www.linkedin.com/groups/17641034/)
- **GitHub** — code, issues, and contributions: [github.com/tractorjuice/arc-kit](https://github.com/tractorjuice/arc-kit)
