# ArcKit v6.11: Four New Plugins, Twenty-Five New Commands

**Since the last release write-up, ArcKit has gained a Netherlands public-sector pack, an EU Cloud Sovereignty assessment, Austrian accessibility coverage, a codebase audit plugin, TOGAF ADM and AI agent architecture overlays, Open Knowledge Format import and export, and a ninth distribution format. Document Control also stopped guessing: a Canadian assessment now carries Canadian classification markings rather than British ones.**

*Mark Craddock · medium.com/arckit*

---

## The Netherlands joins the harness

`arckit-nl` is the newest jurisdiction pack, and it arrived as a community contribution. The Netherlands had no coverage at all, and its central-government cloud rules had changed substantially, so this fills a genuine gap rather than adding a variation on an existing one.

Four commands ship:

`/arckit:nl-bio` assesses BIO2 conformance, the Baseline Informatiebeveiliging Overheid, against ISO/IEC 27001:2023 and 27002:2022 controls plus the mandatory overheidsmaatregelen that sit on top of them.

`/arckit:nl-cloud` assesses Rijksbreed cloudbeleid compliance, including the materieel cloudgebruik determination and the clause 5.2 and 4.5 eligibility questions that decide whether a public cloud service can be used at all.

`/arckit:nl-exit` produces the cloud exit plan that clause 3.2 makes mandatory, covering both the planned exit and the disruptive interruption scenario, provider data destruction, and the annual self-test.

`/arckit:nl-tbb` determines the Te Beschermen Belangen category for a system or dataset using the BIV scoring method, applying any existing VIRBI 2025 rubricering as a floor.

That last one is worth dwelling on, because it shipped with the systematiek running backwards. The command originally derived a VIRBI rubricering from the determined TBB category. The Dutch method runs the other way: an existing rubricering constrains the outcome rather than following from it. It is now fixed, and it is a good illustration of why jurisdiction packs benefit from domain maintainers who will notice that kind of inversion.

## EU Cloud Sovereignty

`/arckit:eu-cloud-sovereignty` implements the European Commission's EU Cloud Sovereignty Framework, published in October 2025 to supplement conventional security assurance with sovereignty criteria for cloud procurement. The command scores the eight sovereignty objectives and records SEAL-level evidence against each.

It also had a rough start. Three objective weights were wrong, and the framework had no aggregate sovereignty score at all while already describing a minimum SEAL as the tender's rejection gate. Both are corrected in v6.11.0, along with a scoring formula that referenced terms it never defined. If you ran this command before today, run it again.

## Austrian accessibility

`/arckit:at-barrierefreiheit` covers Austrian digital accessibility across both of Austria's transposition tracks: BaFG, which carries the European Accessibility Act into the private sector, and WZG for the public sector. It handles EN 301 549 and WCAG conformance, the Barrierefreiheitserklärung, and market surveillance.

It was requested by a contributor who pointed out that the Austrian pack had data protection, procurement, and network security, but nothing on accessibility. The Austrian pack also gained the InfoSiG classification scheme, so Austrian artefacts now carry Austrian markings.

## Auditing the code you actually built

The `arckit-repo` plugin closes a gap that had been open since the beginning. ArcKit was good at governing the architecture you intended, and silent on the architecture that exists.

`/arckit:repo-audit` audits a codebase against your architecture principles and requirements, surfacing drift, risk, and decisions that were made in code but never recorded. It takes the current repository, a local path, or a remote GitHub or GitLab URL, and writes a governed audit artefact into a new `audits/` subdirectory, so one project can accumulate audits of several repositories over time. It renders the as-built C4 container diagram in Mermaid or PlantUML.

Alongside it, `/arckit:repo-docs` generates and maintains agent-readable repository documentation from source, docs, and git history.

## TOGAF ADM and AI agent architecture

Two overlays landed together at the end of June.

`arckit-togaf-adm` turns the TOGAF Architecture Development Method into versioned artefacts across nine commands, covering preliminary work, business capability mapping, application inventory and rationalization, gap analysis, transition architecture, the architecture board, change management, and repository synthesis. It ships with a `togaf-adm-full` build recipe, so the whole method can be generated as one governed run.

`arckit-agent-architecture` does the same for AI agent programmes, with six commands: inventory of existing agents with security classification and oversight level, agent design covering patterns and tool contracts and memory and guardrails, multi-agent integration, agent security including sandboxing and injection defences, agent governance, and a maturity assessment.

That second one is ArcKit governing the same class of system it is built on, which felt overdue.

## Open Knowledge Format, both directions

Two core commands now bridge ArcKit and OKF. `/arckit:export-okf` exports project artefacts as an OKF bundle without touching the source ARC files, and `/arckit:import-okf` brings an OKF bundle in as reviewable research notes rather than dropping it straight into your governed set. The asymmetry is deliberate: exporting is lossless, importing is a proposal you review.

## Kimi Code CLI, the ninth distribution format

ArcKit now ships for Kimi Code CLI, its ninth distribution format and eighth AI assistant surface. Every command is available in Kimi Code as an Agent Skill, and the plugin manifest wires sixteen governance and security hooks plus the bundled knowledge servers. As with Codex, Gemini, OpenCode, Copilot, Paperclip and Mistral Vibe, it is generated from the same canonical plugin sources rather than maintained as a separate fork, so it does not drift.

## Document Control follows the artefact now

This is the change most likely to affect work you have already produced.

Every ArcKit artefact carries a Document Control header, and part of that header is a classification ladder. A Canadian Privacy Impact Assessment was carrying the UK ladder of PUBLIC, OFFICIAL, OFFICIAL-SENSITIVE and SECRET, because the ladder came from the person running the command rather than the jurisdiction the artefact belongs to. A US federal artefact had the same problem.

Classification is now routed by regime. A Canadian assessment carries Canadian markings, a US federal artefact carries a US ladder, and an Austrian one can carry InfoSiG. For anyone using the jurisdiction packs to build evidence for a regulator, that is the difference between an artefact that is usable and one that is quietly wrong.

The NHS pack also gained DUAA 2025 coverage, a hazard-archetype checklist, and re-review triggers.

## A note on the rest of it

A large share of this period went on correctness work that does not make a feature list: quality checks that were referenced but did not exist, citation sections pointing at tables that were never in the template, document-type codes that broke a command outright. Thirteen new CI guards now cover those defect classes, and two of them found real problems on their first run.

It is unglamorous, and it is the reason the features above can be trusted. A governance harness that silently produces a plausible-looking artefact is worse than one that stops, because the output still looks like evidence.

ArcKit is available for Claude Code, Codex CLI, Gemini CLI, OpenCode CLI, GitHub Copilot, Paperclip, Mistral Vibe, Kimi Code CLI, and as a Python CLI. Start at [arckit.org](https://arckit.org).
