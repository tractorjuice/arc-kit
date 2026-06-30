# ArcKit 4.9.0: Wardley Maps Now Render Natively In Your Architecture Docs

If you have ever tried to embed a Wardley Map into a governance document, you know the usual story. You draft the map in create.wardleymaps.ai, screenshot it, paste a PNG into a Word file or a static site, and then watch it go stale the moment someone edits the underlying components. The map becomes a picture, not a living artefact.

ArcKit 4.9.0, released on 21 April 2026, fixes that for anyone generating architecture artefacts through the toolkit.

## What changed

Mermaid 11.14.0 shipped a new diagram type called wardley-beta. It is a first-class Mermaid renderer for Wardley Maps, which means any surface that already renders Mermaid, GitHub README files, GitLab wikis, static site generators, Obsidian, and of course ArcKit's generated docs/index.html dashboards, can now render Wardley Maps inline from plain text.

ArcKit 4.9.0 adopts this across the board. We bumped the Mermaid CDN in all six pages-template.html files, covering the plugin and all five extensions (Codex, Copilot, Gemini, OpenCode, Paperclip). Run /arckit.pages in any ArcKit repo and your generated dashboard will render Wardley Maps alongside your requirements, ADRs, risk registers, and business cases.

## Why conversion fidelity mattered

We could have stopped at "Mermaid supports it now, good luck." We did not, because Wardley Maps are not decorative. They carry real decisions about evolution, dependency, and where to build versus buy. Losing components or drifting evolution values during conversion changes the strategic meaning of the map.

So we built a fidelity test suite. The methodology borrows from Simon Wardley's own mathematical model work. We take every Wardley Map in the reference repository at swardley/WARDLEY-MAP-REPOSITORY, 147 real-world maps drawn from books, blog posts, and Wardley's own teaching material, convert each one from create.wardleymaps.ai syntax to Mermaid wardley-beta, re-parse the output, and measure what was preserved.

The current result across 4,905 matched component pairs:

- 100 percent component retention
- 100 percent anchor retention
- 100 percent link retention
- Evolution delta of exactly zero (no drift in evolution values)

That last one matters most. If a component sits at evolution 0.62 in the source, it sits at 0.62 in the converted map. Not 0.61. Not rounded. Identical.

## The fixes that got us there

Getting to 100 percent required three specific fixes, each rooted in a real-world create.wardleymaps.ai file that broke something.

First, the converter now handles create.wardleymaps.ai' hybrid pipeline syntax, which lets you declare a pipeline with a range and a block of child components on the same construct. It also handles evolve statements whose names contain slashes and dots. This pushed the real-world parse rate from 144 out of 147 to 146 out of 147. The last failing map has an unfixable typo in the upstream source.

Second, component names now follow conditional quoting rules driven by the wardley-beta grammar. If a name contains hyphens, dots, slashes, or starts with a digit, it gets quoted. If the first word matches a reserved keyword like labelling, marketplace, or evolved, it gets quoted. Previously, unquoted names like "Real-Time Data Processing" or "GPT-4 LLM Service" silently broke rendering because Mermaid's lexer read the hyphen as the start of an arrow operator.

Third, label offsets are now preserved. create.wardleymaps.ai lets you nudge a component label with a "label [x, y]" decorator to prevent overlapping text. The old converter silently dropped every one of those. A single map, Wardley's sustainability introduction example, was losing 20 labels on each conversion. The fix touches all three emission sites: top-level components, explicit pipeline block children, and auto-injected pipeline children.

## The companion repository

Alongside 4.9.0, we published tractorjuice/wardley-maps-mermaid. It is a public mirror of the upstream Wardley Map repository with all 147 maps converted to Mermaid wardley-beta alongside their create.wardleymaps.ai originals. Every map renders under Mermaid 11.14.0. The conversion tooling ships with it for local regeneration. Content is licensed CC-BY-SA 4.0 to match upstream.

If you are teaching Wardley Mapping, comparing syntaxes, or just want a validated corpus to test your own tooling against, it is all there.

## What this unlocks for practitioners

Three practical things.

If you are using ArcKit to run architecture governance, your Wardley Maps now live in the same dashboard as your requirements, stakeholder analysis, risk register, business case, and ADRs. One URL, all artefacts, all current.

If you work in UK public sector and need to demonstrate strategic thinking alongside GDS Service Standard points, TCoP compliance, or NCSC CAF evidence, the map is now a first-class citizen of the evidence pack, not an appendix image.

If you are a consultant or architect writing for clients, you can commit a plain-text Wardley Map to a repository, review it in a pull request, diff it cleanly between versions, and render it automatically wherever Mermaid runs. No more chasing screenshots.

## Getting started

If you already have ArcKit installed as a Claude Code plugin, update the marketplace and the new version picks up automatically. If you are using the Codex, Gemini, OpenCode, or Copilot extension, pull the latest from the respective repository. If you are new, "pip install arckit-cli" or install the plugin via "/plugin marketplace add tractorjuice/arc-kit" inside Claude Code.

Then run /arckit.wardley on any project and check your generated docs/index.html. The map will be there, rendered, linkable, and version-controlled.

---

**Links**

- ArcKit: https://github.com/tractorjuice/arc-kit
- Wardley Maps Mermaid companion: https://github.com/tractorjuice/wardley-maps-mermaid
- Mermaid 11.14.0 release: https://github.com/mermaid-js/mermaid/releases
- create.wardleymaps.ai: https://create.wardleymaps.ai

<!-- arckit:related-articles -->
## Related Articles

- [The Five Wardley Commands in ArcKit: When to Run Each](article-viewer.html?a=2026-04-22-wardley-commands-walkthrough)
- [ArcKit v4.3.0: A Complete Wardley Mapping Suite](article-viewer.html?a=2026-03-16-wardley-suite-strategic-mapping)
- [Your Wardley Maps Belong in Git: What Mermaid Support Changes](article-viewer.html?a=2026-05-19-wardley-maps-mermaid-github)
- [How ArcKit Tidies Wardley Map Labels: A Deterministic Placement Engine](article-viewer.html?a=2026-05-22-tidy-wardley-labels)

<!-- arckit:community-block -->
## Join the ArcKit Community

- **Discord** — real-time conversation, help with commands, and what people are building: [discord.gg/HsA4Y3hQ4](https://discord.gg/HsA4Y3hQ4)
- **LinkedIn Group** — announcements, case studies, and longer-form discussion: [linkedin.com/groups/17641034](https://www.linkedin.com/groups/17641034/)
- **GitHub** — code, issues, and contributions: [github.com/tractorjuice/arc-kit](https://github.com/tractorjuice/arc-kit)
