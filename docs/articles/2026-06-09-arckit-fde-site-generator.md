# ArcKit FDE is now a plugin: generate your own forward deploy site in one command

White-label the bootstrap sprint. Your brand, your pricing, your contact, published to GitHub Pages.

Last month we launched [ArcKit FDE](https://tractorjuice.github.io/arckit-fde/): real agentic AI in the room, a small embedded team, and a fixed-price bootstrap sprint that produces the principles, requirements, risk and stakeholder pack a programme needs to unlock its next decision. The site that sells it is a single hand-written page. Today that page becomes a plugin you can run for yourself.

The new `arckit-fde` plugin adds one command, `/arckit-fde:create`. It interviews you for the handful of things that actually change between firms, then renders a complete, accessible, GitHub-Pages-ready consulting site into `docs/`. No build step, no framework, no design work.

## What it asks, and what it assumes

The wizard prompts for the things that are genuinely yours: a market preset, your brand name and tagline, a brand colour and logo, two pricing tiers, and the contact and call to action. Everything else, the value propositions, the four-artefact pack, the Day 0 to Day 5 cadence, the policy alignment and the worked examples, comes from a market preset you can edit.

There are two presets. UK Public Sector reproduces the original ArcKit FDE framing, shaped around the Green Book, the Orange Book, the GOV.UK Service Standard, the Technology Code of Practice and GovS 005 Digital. Generic strips the jurisdiction-specific framing so a firm in any market can supply its own. Pick one in the wizard, then tune the rest in the config file.

## Edit once, regenerate forever

The wizard saves your answers to `fde-site.config.yaml` at your repo root. Re-running the command reads it back, so the site is data, not hand-edited HTML. Change a price, add a worked example, switch the brand colour, and regenerate. The brand colour is a single CSS custom property, so one value retints the whole page.

The output is a static site: `index.html`, `styles.css`, a logo and hero, a sample governance pack, and the discovery metadata that helps search engines and language models understand the page. Preview it locally with `python3 -m http.server`, then point GitHub Pages at the `/docs` folder and you are live.

## Lean by design

`arckit-fde` is Claude Code only and depends on nothing else in ArcKit. It does not touch the governance core, it adds no doc-types, and it carries no jurisdiction baggage. It is a focused tool that does one thing: turn a short conversation into a published consulting site.

The original FDE model was about compressing months of governance work into a focused sprint. This is the same idea pointed at the shop window. The pitch that used to take a designer and a week now takes a command and a few minutes.

Install it with `/plugin marketplace add tractorjuice/arc-kit` then `/plugin install arckit-fde`, and run `/arckit-fde:create`.

## About ArcKit

[ArcKit](https://arckit.org) is the enterprise architecture governance harness for AI coding assistants. It generates strategy, architecture, delivery and assurance artefacts on Claude Code, Codex, Gemini, OpenCode and Copilot, turning architecture governance from scattered documents into a systematic, template-driven process.

<!-- arckit:community-block -->
## Join the ArcKit Community

- **Discord** — real-time conversation, help with commands, and what people are building: [discord.gg/HsA4Y3hQ4](https://discord.gg/HsA4Y3hQ4)
- **LinkedIn Group** — announcements, case studies, and longer-form discussion: [linkedin.com/groups/17641034](https://www.linkedin.com/groups/17641034/)
- **GitHub** — code, issues, and contributions: [github.com/tractorjuice/arc-kit](https://github.com/tractorjuice/arc-kit)
