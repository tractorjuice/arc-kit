# ArcKit OAA: Open Agile Architecture Becomes a Standalone Plugin

**Open Agile Architecture — The Open Group's O-AA standard, C208 — now ships as its own ArcKit plugin. `arckit-oaa` carries five commands (`oaa-adm-lite`, `product-architecture`, `agile-strategy`, `agile-security`, `agile-governance`), five doc-type codes, and the `oaa-full` build recipe, all tuned to 2–4 week sprint windows rather than quarterly architecture boards. It began life as an extension of the TOGAF ADM overlay and was reshaped into its own plugin before anything shipped — a community contribution by @terrygzhou that landed in v6.13.0.**

*Mark Craddock · medium.com/arckit*

---

## Why it isn't part of the TOGAF pack

O-AA arrived as a contribution that originally extended `arckit-togaf-adm`, and the packaging never quite fitted the content. TOGAF's ADM is a document-centric, stage-gate method: preliminary work, lettered phases, an architecture board, a repository. O-AA is a different practice — agile, product-driven, sprint-based — and bundling the two would have meant anyone who wanted one had to install both.

The split happened in review, before anything shipped — no released ArcKit ever bundled the two. O-AA landed as its own plugin with its own command namespace, doc-type codes, templates, and recipe. Neither plugin depends on the other; both depend only on the `arckit` core. It takes the community plugin count from thirteen to fourteen.

The extraction itself came in as a pull request from @terrygzhou, who also carried every blocker and fix from review through to merge. More on that below, because what the review caught is worth being honest about.

## Five commands, one sprint rhythm

The plugin installs under its own namespace, alongside the core:

`/arckit-oaa:agile-strategy` produces the dual transformation canvas — legacy modernisation and greenfield innovation side by side, with the operating-model shift from functional silos to platform and stream-aligned teams. Doc type `OASTR`.

`/arckit-oaa:product-architecture` makes architecture product-centric: a mission, measurable outcomes, a named cross-functional team, and architecture work expressed as first-class backlog items with story points, risk, and acceptance criteria. Doc type `OAPR`.

`/arckit-oaa:oaa-adm-lite` maps the ADM cycle onto sprints — vision in Sprint 0, business and data in Sprint 1, technology in Sprint 2, transition in Sprint 3, governance from Sprint 4 onwards, each with gate criteria. Doc type `OAAL`.

`/arckit-oaa:agile-security` embeds security in the sprint rhythm rather than a gate at the end: security stories on the backlog, risk-based scan frequency (critical means every commit), compliance expressed as executable rules, and a threat model that updates per sprint. Doc type `OASEC`, registered at HIGH severity in the doc-type registry.

`/arckit-oaa:agile-governance` replaces the quarterly board with a sprint cadence: pre- and post-sprint checklists, an architecture debt register with severity and resolution targets, and a quarterly health score. Doc type `OAGOV`.

The artefacts are deliberately small. Where the TOGAF overlay produces full deliverables, O-AA produces one-to-two-page canvases, at most two per sprint. The point is architecture that keeps pace with delivery, recorded with the same rigour: every output is a versioned `ARC-NNN-TYPE-vN.N.md` file with document control, provenance, and traceability, like everything else in the harness.

## The chain and the recipe

The commands sit on the core foundation and feed each other:

```text
PRIN → REQ/STKE → OASTR/OAPR → OAAL → OASEC → OAGOV
```

Principles, requirements, and stakeholders come first, from the core plugin. Strategy and product architecture build on those, the sprint map builds on the strategy, and security and governance close the loop. Each command declares handoffs, so Claude Code suggests the next step mid-engagement.

The `oaa-full` recipe runs all five in order on top of the foundation. One review fix mattered here: the security and governance targets originally defaulted to off, which made the "full" recipe quietly partial. They now default on, so `oaa-full` means what it says.

## O-AA or TOGAF ADM?

The two overlays answer different situations, and the decision guide ships in the plugin README. The short version: the TOGAF overlay runs on quarterly architecture boards, produces full deliverables, moves through stage gates, and treats security as a dedicated gate — pick it when you face a full regulatory audit and dozens of stakeholder sign-offs. O-AA runs in two-to-four-week sprints, produces one-to-two-page canvases capped at two per sprint, delivers from a backlog, and puts security on that backlog every sprint — pick it when the deadline is under eight weeks and the culture is already agile.

They are complementary, not competitors. A workable pattern is TOGAF ADM for the enterprise baseline, then O-AA to execute individual capabilities at sprint velocity. One core install satisfies both plugins' version pins, and the namespaces (`/arckit-togaf-adm:` vs `/arckit-oaa:`) and doc-type codes never collide.

## What review caught before it shipped

The first version of the contribution quoted O-AA axioms that the standard does not contain. It also referenced nine helper scripts and six JSON schemas that did not exist, and cited O-AA learning units by numbers that could not be verified.

This is the failure mode a governance harness has to take seriously, because a fabricated citation in an architecture artefact does not look fabricated — it looks like evidence. The review caught all of it, and the fixes set a useful precedent for standards-based overlays. Axioms are now cited by their published number and name only, mapped per command in the plugin's reference file, with no quoted wording — the full text of C208 sits behind The Open Group's sign-in wall, and the plugin does not pretend otherwise. Learning units are cited by topic and linked to the official publication page. The phantom tooling is gone; the sprint artefact structures live inline in the templates, where `/arckit:health` can check for drift.

Credit where due: @terrygzhou addressed every blocker, important, and minor item from that review, and the merged tree passed the full guard suite — 25 lint-workflow checks and over 1,500 tests — before it shipped.

## Organisation identity without hardcoding

The overlay's templates carry `${user_config.*}` placeholders for organisation name, issue prefix, safety checklist ID, and a references directory, prompted for when you enable the plugin and substituted at render time. Nothing organisation-specific is baked into the templates, and non-Claude targets fall back to plain environment-style placeholders.

## Get it

```bash
/plugin marketplace add tractorjuice/arckit-claude
claude plugin install arckit arckit-oaa
```

Then start where every ArcKit engagement starts — principles, requirements, stakeholders — and let the handoffs walk you through the sprint chain.

The overlay is community-maintained, and the maintainer note is an open invitation: it is recruiting a domain co-maintainer with O-AA expertise. If that is you, the repository is the place to say so.

---

*`arckit-oaa` is an MIT-licensed community overlay for Claude Code, contributed by @terrygzhou. It requires the core `arckit` plugin.*

<!-- arckit:community-block -->
## Join the ArcKit Community

- **Discord** - real-time conversation, help with commands, and what people are building: [discord.gg/HsA4Y3hQ4](https://discord.gg/HsA4Y3hQ4)
- **LinkedIn Group** - announcements, case studies, and longer-form discussion: [linkedin.com/groups/17641034](https://www.linkedin.com/groups/17641034/)
- **GitHub** - code, issues, and contributions: [github.com/tractorjuice/arc-kit](https://github.com/tractorjuice/arc-kit)
