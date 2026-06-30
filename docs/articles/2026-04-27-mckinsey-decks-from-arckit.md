# From ArcKit to McKinsey-Style Infographics in an Afternoon: AntV Infographic and the End of the £200k Wrap

The last article in this collection argued that ArcKit has removed the economic justification for roughly a billion pounds of UK public-sector consulting spend, by automating the document-drafting layer that consulting firms used to charge associate rates to produce.

A reasonable rebuttal: "the document is not the deliverable". The deliverable is the deck. The McKinsey-grade pitch the partner walks into the room with on the morning of decision day. Action titles. Pyramid Principle. SCQA opener. The 2x2 matrix. The five-step process flow. The hierarchy diagram with two layers of supporting evidence. Clean, consistent, and engineered to let the Permanent Secretary read the conclusion in 90 seconds and the rest only if they want to.

That visual layer is the bit that costs the £200k. Without it, the analysis looks unfinished, and procurement teams have been trained to read the absence as a signal of low effort. So even when the underlying work is solid, departments still pay for the wrap.

This article is about the open-source pipeline that closes that loop. ArcKit produces the structured artefact. The **AntV Infographic** plugin (`antvis/Infographic`) turns the artefact into McKinsey-grade visual output. Both are free.

## What AntV Infographic Actually Is

AntV is the open-source data-visualisation organisation inside Ant Group, the same outfit behind G2, G6, and L7. **AntV Infographic** is their newest project: a declarative infographic engine with a syntax that was deliberately tuned for AI generation. You feed it a short YAML-like description of what you want, it renders SVG.

Three properties matter for the consulting use case:

1. **Around 200 built-in templates** covering the structures that appear in every MBB deck: pyramids, 2x2 quadrants, hierarchies, comparisons, process flows, charts.
2. **Streaming AI output**. You can render an infographic as the model is still generating its description, so the visual appears progressively in front of the user. This is the demo-effect that makes a board presentation land.
3. **High-quality SVG** by default. Infinite zoom, editable in any vector tool, perfect when printed or projected.

The 16 structural design families ship out of the box. The relevant ones for consulting work map almost one-to-one onto the visual vocabulary of an MBB deck. `list-pyramid` produces the stacked horizontal bands narrowing toward the top — the Pyramid Principle visual itself. `compare-quadrant` produces the 2x2 matrix with positioned items, which is the McKinsey 2x2 in everything but name. `compare-hierarchy-row` produces side-by-side comparison stacks for vendor or option comparisons. `hierarchy-structure` produces org-chart-style decomposition for capability maps and accountability charts, while `hierarchy-mindmap` produces radial branching for stakeholder maps and root-cause analyses. `sequence-stairs` produces stepped progression for roadmaps and maturity curves; `sequence-interaction` produces lane-based flow for process diagrams. The chart family (`chart-bar`, `chart-column`, `chart-line`, `chart-pie`) covers standard charts for financial cases and sensitivity views. The list family (`list-zigzag`, `list-waterfall`, `list-row`) covers step-by-step lists with iconography for recommendations and action plans.

For ArcKit users this is unusually well-aligned. An ArcKit project already produces hierarchies (requirements, ADRs), comparisons (vendor scorecards), sequences (roadmaps, migration plans), and pyramids (business case structures). The infographic templates fit those shapes.

## How to Install It

Two paths:

**Marketplace (recommended).**

```text
/plugin marketplace add https://github.com/antvis/Infographic.git
/plugin install antv-infographic-skills@antv-infographic
```

**Direct npm**, if you want to render server-side or batch:

```bash
npm install @antv/infographic
```

The marketplace install registers five skills inside Claude Code:

- `infographic-creator` — generate a complete HTML file rendering an infographic
- `infographic-syntax-creator` — produce just the AntV Infographic source syntax
- `infographic-structure-creator` — design a custom structure when none of the 200 templates fit
- `infographic-item-creator` — design custom item components
- `infographic-template-updater` — for plugin developers extending the template library

For the workflow below, `infographic-creator` and `infographic-syntax-creator` are the only two you need.

## The McKinsey Principles, and Why ArcKit Already Satisfies Them

The McKinsey/Bain/BCG style is not a mystery. It rests on four principles, all of them documented:

1. **The Pyramid Principle** (Barbara Minto, McKinsey, 1960s). Lead with the conclusion, then supporting arguments, then evidence. Executives do not have time for your analytical journey. Give them the destination first.
2. **SCQA** as the opening structure: Situation, Complication, Question, Answer.
3. **Action titles** on every slide: a complete sentence stating the slide's main point, not a topic label.
4. **MECE** (Mutually Exclusive, Collectively Exhaustive). Categories must not overlap and must cover the space.

ArcKit's artefacts were designed as governance artefacts, not deck inputs. They happen to satisfy all four principles by construction.

**Pyramid Principle.** Every ArcKit document opens with a Document Control header and an executive summary, before any detail. Conclusion-first is how good architecture documentation already works.

**SCQA.** The Strategic Outline Business Case template (`/arckit.sobc`) is SCQA in long form. Strategic Case maps to Situation. Economic Case maps to Complication and options analysis. Commercial and Financial Cases map to Question. Management Case maps to Answer. HM Treasury's Five Case Model and McKinsey's SCQA are the same idea expressed in two different vocabularies.

**Action titles.** ArcKit requirement IDs (BR-001, FR-014, NFR-SEC-007, INT-022, DR-005) compress action titles into identifiers. Each requirement carries a single-sentence imperative statement. Drop one onto an infographic as the headline and you have a McKinsey-grade action title without writing it.

**MECE.** ArcKit's requirement prefixes are MECE by design. Business, Functional, Non-Functional (with explicit sub-categories: Performance, Security, Usability, Reliability, Compliance), Integration, Data. There is exactly one place each requirement belongs.

The structural work that consulting associates spend three weeks doing on a fresh engagement is already done by the time you have run `/arckit.requirements` and `/arckit.sobc`.

## The Pipeline

With both plugins enabled in the same Claude Code session, the workflow collapses to four prompts.

**1. Generate the source artefacts.**

```text
/arckit.requirements   "Replace the legacy citizen-services portal"
/arckit.sobc           "Replace the legacy citizen-services portal"
/arckit.wardley        "Citizen services delivery"
/arckit.research       "Replace the legacy citizen-services portal"
```

These produce structured Markdown in `projects/NNN-name/`: a requirements document with traced IDs, a Five Case Model SOBC, a Wardley Map with build/buy recommendations, and a vendor research report with citations.

**2. Generate the executive-summary infographic.**

```text
Read projects/001-citizen-services/ARC-001-SOBC-v1.0.md and produce
an executive-summary infographic. Use list-pyramid for the recommendation
hierarchy: top tier is the headline conclusion, second tier the three
supporting arguments, third tier the evidence. Stream the syntax so I
can see it form. Output as a standalone HTML file.
```

The `infographic-creator` skill emits AntV Infographic syntax, hands it to the renderer, and writes the HTML file. Open it in a browser. The pyramid renders SVG, scales to any screen, and prints to PDF without losing fidelity.

**3. Generate the 2x2.**

```text
Now generate a compare-quadrant infographic positioning the three
shortlisted vendors against axes of "compliance with NCSC CAF" and
"total 5-year cost". Pull positions from ARC-001-VEND-v1.0.md.
Use the same theme as the pyramid.
```

The McKinsey 2x2 is the most-photocopied artefact in consulting. The `compare-quadrant` template is exactly that, parameterised. Vendor scorecard data flows in directly.

**4. Generate the process flow and roadmap.**

```text
Generate a sequence-stairs infographic for the 18-month migration plan
from ARC-001-MIGR-v1.0.md, and a hierarchy-structure infographic for
the target operating model from ARC-001-TOM-v1.0.md.
```

Four infographics, all rendered as standalone SVG-backed HTML, all driven from the same Markdown source of truth. Stitch them together as the appendix to a slide deck or embed them in `docs/index.html` (which ArcKit already serves).

If a SOBC number changes, regenerate. The infographics rebuild from the Markdown automatically. There is no copy-paste in either direction.

## What This Replaces

The associate-week of work that produces the visual layer of a McKinsey-style deck breaks down roughly as follows. Numbers are industry-standard estimates and will vary by firm. Slide template selection and brand alignment runs about 4 hours at £400. First-pass charts and graphics runs 24 hours at £2,400. The 2x2 and pyramid visualisation accounts for another 12 hours at £1,200, and process and hierarchy diagrams another 16 hours at £1,600. Manager review cycles add 12 hours at £1,200, and partner review polish a further 6 hours at £1,800. The total comes to 74 associate-hours and roughly £8,600 of billed time per deliverable.

The ArcKit plus AntV Infographic pipeline collapses the visualisation work to roughly 30 minutes of prompting and 30 minutes of human review. The structural templates do the design heavy lifting that associates would otherwise hand-craft in PowerPoint. Across a typical six-month engagement producing twelve to twenty deliverables, the compounded saving is what makes the headline number from the previous article credible.

## What This Does Not Replace

Worth being precise about. AntV Infographic is an infographic engine, not a slide-deck builder. The HTML it produces is page-shaped, not deck-shaped. For a continuous keyboard-driven slide deck you still need a presentation layer (Marp, Reveal.js, or a paid alternative). What AntV gives you is the **content of every slide that matters** — the pyramid, the 2x2, the process flow, the hierarchy. Stitch those into a slide-runner and you have a deck.

It also does not give you:

- **Bespoke narrative arcs** shaped by what the CFO asked off the record three weeks ago. Models cannot do this without being told, and the prompting overhead approaches the saving.
- **Brand-perfect typography and identity.** AntV ships clean, professional themes (hand-drawn, gradients, patterns, several presets). It does not match the McKinsey blue or the Bain red. If brand identity is part of the credibility play, you need a designer.
- **Custom illustration and photography.** Stock-quality consulting illustrations are still a designer's job.
- **Live animated demos.** Static SVG. If you need clickable prototypes, use a different tool.

For the other 80 per cent of consulting decks, the pipeline produces visual output that is structurally identical and visually equivalent.

## The Honest Implication

Two open-source plugins, both installable from a marketplace in under a minute, between them produce the structured analysis and the McKinsey-style visualisation that a Big 4 engagement charges £200k to £400k for. The remaining premium for the engagement is workshops, partner judgement, and the name on the cover page.

Departments that do not adopt this pipeline are not paying for capability they could not build. They are paying for the absence of the capability they have already built but not deployed. The cost of the wrap is the cost of pretending the inside does not exist.

The deliverable is dead. The visual layer the deliverable hides inside is also now dead. What remains, as the last article argued, is genuinely harder work, and worth paying for at the right rate.

## Sources

- [AntV Infographic on GitHub](https://github.com/antvis/Infographic)
- [AntV Infographic documentation](https://infographic.antv.vision)
- [AntV Infographic gallery (200+ templates)](https://infographic.antv.vision/gallery)
- [The McKinsey Slide Playbook for Claude — Guillermo Flor](https://www.productmarketfit.tech/p/the-mckinsey-slide-playbook-for-claude)
- [Pyramid Principle and SCQA: A Consultant's Guide — Deckary](https://deckary.com/blog/pyramid-principle-consulting)
- [PowerPoint Storytelling: How McKinsey, Bain, and BCG Use SCQA — Analyst Academy](https://www.theanalystacademy.com/powerpoint-storytelling/)
- [McKinsey Presentation Structure — SlideModel](https://slidemodel.com/mckinsey-presentation-structure/)

<!-- arckit:related-articles -->
## Related Articles

- [How ArcKit Is Quietly Destroying a Billion-Pound Consulting Business](article-viewer.html?a=2026-04-20-consulting-deliverable-is-dead)
- [From Brief to Investment-Ready in Four £25k Weeks](article-viewer.html?a=2026-04-27-bootstrap-25k-week)
- [Pricing the ArcKit Project: What Would an Investor Pay?](article-viewer.html?a=2026-04-28-pricing-arckit-investor)
- [Internal Memo, Somewhere in a Big 4 Consulting Company](article-viewer.html?a=2026-05-01-consulting-internal-memo)

<!-- arckit:community-block -->
## Join the ArcKit Community

- **Discord** — real-time conversation, help with commands, and what people are building: [discord.gg/HsA4Y3hQ4](https://discord.gg/HsA4Y3hQ4)
- **LinkedIn Group** — announcements, case studies, and longer-form discussion: [linkedin.com/groups/17641034](https://www.linkedin.com/groups/17641034/)
- **GitHub** — code, issues, and contributions: [github.com/tractorjuice/arc-kit](https://github.com/tractorjuice/arc-kit)
