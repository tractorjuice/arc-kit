# ArcKit and OKF: Knowledge Interoperability Without Giving Up Governance

**ArcKit now treats Open Knowledge Format as an interoperability boundary. Native ARC artifacts remain the source of truth, but architecture knowledge can be exported into an OKF-shaped Markdown bundle, imported back as reviewable research notes, and optionally stamped with portable frontmatter when a team wants wider tool compatibility.**

---

## The problem OKF solves

Architecture knowledge is usually trapped in the shape of the tool that produced it.

One team has ADRs in a repository. Another has procurement notes in a wiki. A third has model cards, supplier research, policy extracts and service maps spread across folders. The content is valuable, but the identity model is local. The links are local. The metadata is local. Every assistant, catalogue, dashboard or analysis tool has to rediscover the same structure from scratch.

That is the problem Open Knowledge Format is trying to solve. It takes the useful part of the LLM-maintained wiki pattern -- Markdown files, stable paths, cross-links and lightweight metadata -- and makes it portable enough for different producers and consumers to share. It is a format, not a platform. The important unit is still a file you can commit, diff, review and move.

For ArcKit, that matters because architecture governance is already a knowledge graph hiding in plain sight. A project is not one document. It is a chain of principles, stakeholders, requirements, risks, options, decisions, diagrams, tests, delivery plans and assurance evidence. ArcKit already gives those artifacts stable IDs, templates, document control, provenance and traceability. OKF gives that work a cleaner exchange surface.

## Why ArcKit should not simply become OKF

The tempting answer would be to replace ArcKit's native artifact model with OKF frontmatter everywhere.

That would be premature.

ArcKit's native format has jobs that OKF should not have to own. It encodes architecture document IDs such as `ARC-001-ADR-001-v1.0.md`. It carries document control tables, revision history, ownership, classification, review dates, template-specific sections and governance checks. It supports commands like `/arckit:health`, `/arckit:traceability`, `/arckit:principles-compliance` and graph injection hooks that expect ArcKit's conventions.

Those conventions are not accidental. They are the governance contract.

OKF is better treated as an exchange layer: a way to project ArcKit knowledge into a portable shape without weakening the native source. That is the design ArcKit now follows. Native ARC artifacts remain canonical. OKF sits at the boundary.

## What the compatibility layer adds

The new OKF compatibility workflow adds three practical capabilities.

First, `/arckit:export-okf` copies ArcKit artifacts into an OKF-shaped Markdown bundle. The export includes portable frontmatter, an index and an export log, so another OKF-aware consumer can understand the bundle without learning every ArcKit convention first.

Second, `/arckit:import-okf` scans an OKF Markdown bundle and writes a review report to `.arckit/tmp/okf-import-report.json`. Safe imported knowledge is materialized as reviewable `RSCH` notes rather than silently rewriting the project. That is deliberate. Imported knowledge should become evidence for an architect to review, not an invisible mutation of the governed baseline.

Third, ArcKit can optionally stamp native source artifacts with OKF-compatible frontmatter. Teams enable that through `ARCKIT_OKF_FRONTMATTER=1` or `.arckit/config.json` with `okfFrontmatter: true`. The default stays conservative: no source-format churn unless the project opts in.

That combination gives teams a useful migration path. They can export today, import with review gates, and only turn on source stamping when they actually need native OKF metadata in the canonical files.

## Export is a boundary

Exporting to OKF is not just a file conversion.

It says: "Here is the architecture knowledge this project is willing to share, with enough identity and metadata for another tool to consume it."

That could feed a static visualizer, a knowledge catalogue, a portfolio analysis workflow, a cloud research agent or another team's LLM-maintained wiki. The consumer does not need to understand every ArcKit command. It can read Markdown, frontmatter, paths and links.

The native ArcKit project still keeps its richer controls. The OKF bundle becomes a portable view over that controlled source. That is a cleaner split than asking every downstream tool to parse ArcKit document-control tables or asking ArcKit to abandon the governance structures that make its artifacts auditable.

## Import is a quarantine

Import is the more dangerous direction, so it is more constrained.

An OKF bundle can contain useful knowledge, stale knowledge, duplicate knowledge, badly typed knowledge or knowledge that conflicts with the project baseline. ArcKit should not absorb that automatically into requirements, risks or ADRs.

The import workflow therefore behaves like an intake gate. It scans the bundle, records what it found, writes a report, and materializes safe content as research notes for review. Those notes can then inform native ArcKit artifacts through the normal governed workflow.

That keeps provenance clear. The project can say where a claim came from, whether it was accepted, and which governed artifact eventually depended on it. It also means imported OKF knowledge can be useful even when it is not authoritative.

## What this enables

The immediate win is portability.

An ArcKit project can publish an OKF bundle for another tool to inspect. A team can bring in an OKF bundle from a research workflow and review it inside ArcKit. A portfolio can gather architecture knowledge across projects without forcing every project to use exactly the same internal document shape.

The bigger win is compounding knowledge.

LLM-maintained knowledge bases work when the assistant is not merely answering questions but maintaining a body of knowledge over time: adding pages, updating links, recording contradictions, filing useful answers and preserving evidence. ArcKit already does that for enterprise architecture. OKF gives that compounding work a language that other tools can share.

For architects, the important detail is that the graph stays inspectable. It is still Markdown. It is still Git-friendly. It is still reviewable. The assistant can help maintain the structure, but the knowledge does not disappear into a proprietary store.

## A pragmatic standard boundary

The best standards integrations are boring at the point of use.

ArcKit's OKF workflow should feel like that. Export when you need to share. Import when you need to review outside knowledge. Enable native frontmatter only when the project benefits from OKF metadata in source files. Keep ArcKit's document IDs, templates, traceability and checks in charge of the governed baseline.

That is the useful middle ground: open enough for knowledge exchange, strict enough for architecture governance.

OKF gives ArcKit a bridge to the wider AI knowledge ecosystem. ArcKit gives OKF a concrete, governed producer and consumer for enterprise architecture work. The result is not a new document store. It is a better boundary between local governance and portable knowledge.

## Links

- Pull request: [#603 -- add OKF compatibility workflows](https://github.com/tractorjuice/arc-kit/pull/603)
- Follow-up docs: [#605 -- complete OKF documentation coverage](https://github.com/tractorjuice/arc-kit/pull/605)
- Issue: [#604 -- OKF compatibility](https://github.com/tractorjuice/arc-kit/issues/604)

<!-- arckit:community-block -->
## Join the ArcKit Community

- **Discord** — real-time conversation, help with commands, and what people are building: [discord.gg/HsA4Y3hQ4](https://discord.gg/HsA4Y3hQ4)
- **LinkedIn Group** — announcements, case studies, and longer-form discussion: [linkedin.com/groups/17641034](https://www.linkedin.com/groups/17641034/)
- **GitHub** — code, issues, and contributions: [github.com/tractorjuice/arc-kit](https://github.com/tractorjuice/arc-kit)
