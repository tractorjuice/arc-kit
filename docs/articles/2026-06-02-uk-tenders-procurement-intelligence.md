# Grounding Procurement Decisions in Real Award Data: New ArcKit Commands for UK Market Intelligence

**ArcKit v5.9.0 connects to a live index of UK public sector contract awards, so business cases, risk registers and vendor evaluations can cite who actually won what, and for how much, instead of relying on estimates.**

---

## The Problem: Assurance Built on Guesswork

When an architecture team prepares a Strategic Outline Business Case, scores a vendor, or assesses delivery risk, the hardest figures to source are the market ones. What does comparable work actually get awarded for? Which suppliers dominate this space? Has one incumbent quietly captured most of a buyer's spend?

Until now, ArcKit answered these questions the way most teams do. It read whatever the user uploaded into the project, leaned on the model's general knowledge, or pieced together fragments from the open web. None of those is authoritative. A Green Book economic case anchored to a guessed figure is still a guess, just with a spreadsheet around it. A vendor's "company experience" left blank because nobody had the data is a gap that quietly weakens the whole evaluation.

The information exists. UK public bodies are required to publish their contract notices, and they do, in their hundreds of thousands. The problem has never been the data. It has been getting that data to the point of an architectural decision, in a form a governance artefact can actually cite.

---

## A New Evidence Source: The UK Tenders MCP

ArcKit now bundles a new Model Context Protocol service, the UK Tenders MCP, built and operated by Chris Nesbitt-Smith (the same author behind the [govreposcrape](https://github.com/chrisns/govreposcrape) code-reuse engine ArcKit already uses).

It indexes roughly 677,000 UK contracting processes drawn from all five national publication portals: Find a Tender, Contracts Finder, Public Contracts Scotland, Sell2Wales and eTendersNI. Every record carries the official notice URL it came from, and the whole dataset is republished verbatim under the Open Government Licence v3.0. The service is keyless and freely available, and ArcKit loads it lazily, so a project that never asks a procurement question never touches it.

Just as importantly, ArcKit treats every response from this service as untrusted input. A single reader component is the only thing that talks to the service. It extracts the figures into a validated, schema-checked structure, and the commands that write your artefacts never see the raw response. That boundary is what lets an AI assistant pull live external data into a governance document without opening a prompt-injection hole.

---

## /arckit:tenders: Procurement Market Intelligence

The first new command answers the question "what is this market, and who holds it?"

Point it at a capability, a CPV code, or a named buyer, and it produces a Procurement Market Intelligence artefact: the median and total awarded value for comparable work, the suppliers ranked by how much of that value they hold, an incumbency read on who is entrenched with which buyer, and a concentration measure that flags when one supplier, or a small group, dominates. Every figure traces back to a published notice.

A worked example. Ask for case management work commissioned by HMRC, and instead of a model-guessed budget you get a real median award value to anchor an option, the suppliers who have actually won that work, and a clear signal if one of them holds sixty per cent of it.

---

## /arckit:competitors: The Competitive Set

The second command takes the supplier's view. Name a supplier, or a capability, and it maps the competitive set: the rival suppliers in that space, each one's share of awarded value as a market-share proxy, the buyers they serve, and how they stack up against each other. It also writes a Government Award History into each vendor's profile, so the evidence is waiting there the next time that supplier is evaluated.

The two commands share one secure reader and one data contract. Tenders is the buyer-and-market lens. Competitors is the supplier-rivalry lens. The same evidence, asked two different ways.

---

## Evidence That Flows Through the Harness

A standalone report is useful. Evidence that flows into the decisions you are already making is far more useful, and this is where ArcKit's design as a governance harness, rather than a loose bag of commands, earns its keep. The award data does not sit in a corner. It feeds the commands that were already short of it:

- Risk registers gain a supplier-concentration entry. When the data shows a single supplier holding most of a buyer's awarded value, that becomes a single-supplier-dependency risk, recorded with the evidence and the supplier named.
- Business cases gain a market-context benchmark. A Strategic Outline Business Case can sanity-check an option's rough cost against what comparable work has actually been awarded for.
- Build-versus-buy research gains real contract values and incumbency, in place of scraped estimates.
- Vendor scoring gains evidence for "company experience", drawn from the supplier's own award history.

Each consumer reads the evidence only when it is present, and only suggests running the upstream commands in a UK government context, so teams working in other jurisdictions are left untouched.

---

## Honest by Design

One number deserves a warning label, and ArcKit gives it one everywhere it appears. Awarded value is not actual spend. A contract can be awarded at one figure and spent at another, and framework call-offs make that gap routine. So ArcKit uses these numbers for market context and benchmarking, never as a costed line in an economic case, and it carries that caveat into every artefact, citation and quality check. The data also reports its own freshness, so a report can state how current it is rather than quietly pretending.

This is not a procurement system, and it does not try to be one. It complements the tools that show you what you can buy today, by adding the one thing they leave out: who actually won what, and for how much. The limits of that evidence are stated plainly, every time.

---

## Getting Started

Both commands are part of ArcKit and need no API key. Run `/arckit:tenders` on your next business case to anchor the market view in real award values, or `/arckit:competitors` before a vendor evaluation to build a citable picture of the field. The award evidence then carries forward automatically into your risk, business-case, research and scoring work.

The shift is small to describe and large in practice. Architectural decisions that used to rest on estimates can now rest on the public record, with a citation on every figure and an honest note on what that figure does and does not mean.

Find ArcKit, and the rest of the governance harness, at [arckit.org](https://arckit.org).

<!-- arckit:community-block -->
## Join the ArcKit Community

- **Discord** — real-time conversation, help with commands, and what people are building: [discord.gg/HsA4Y3hQ4](https://discord.gg/HsA4Y3hQ4)
- **LinkedIn Group** — announcements, case studies, and longer-form discussion: [linkedin.com/groups/17641034](https://www.linkedin.com/groups/17641034/)
- **GitHub** — code, issues, and contributions: [github.com/tractorjuice/arc-kit](https://github.com/tractorjuice/arc-kit)
