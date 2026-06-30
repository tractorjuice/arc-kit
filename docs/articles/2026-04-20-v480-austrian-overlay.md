# What You Can Now Do in Austria with ArcKit v4.8

If you are an enterprise architect, DPO, CISO, or procurement officer working in an Austrian organisation, the toolkit you reach for to sketch a compliant architecture has always assumed you were somewhere else. The generic GDPR assessment would not know about the Austrian image-processing regime. The generic NIS2 command would not know that Austria transposed it through NISG with a three-tier CERT reporting chain. The procurement command would run EU thresholds without telling you about ANKÖ or the Stillhaltefrist. You would end up stapling your own Austrian specifics onto a half-right output.

v4.8.0, released today, ships three Austrian commands that close that gap for the most common scenarios. This article is about what you can actually produce with them, not the release mechanics.

Before we start: the three commands are community-contributed, tagged `[COMMUNITY]` in your `/help` listing, and domain-maintained by Tom Geiger ([@gtonic](https://github.com/gtonic)), an architect based in Austria who authored the original issue asking for non-UK jurisdiction support, wrote the commands, and verified every citation against the current gazette text including NISG idF BGBl. I Nr. 94/2025 and Delegated Regulation (EU) 2023/2495. A few items are marked `[NEEDS VERIFICATION]` where the underlying position is genuinely unpublished or evolving, and those should still go past an Austrian practitioner before you rely on the output. Everything else is grounded.

## Scenario 1: A Federal Ministry HR System with CCTV and Employee Monitoring

You are the architect on a federal ministry HR platform. It stores personal data for ~5,000 staff. It integrates CCTV feeds from the building entrances. It logs IT usage for security monitoring. Your DPO wants a privacy assessment next week.

Run `/arckit.eu-rgpd` first to produce the pan-EU GDPR baseline: lawful basis under Article 6, special category data mapping, the EDPB nine-criteria DPIA screening, international transfer analysis post-Schrems II. Then run `/arckit.at-dsgvo` on top of it and you get an Austrian-specific overlay that the EU floor does not cover:

For the CCTV feeds, the command produces a §§ 12 to 13 DSG assessment (in Austrian legal citation, `§§` means "sections", plural). That is a standalone Austrian image-processing regime with its own lawfulness grounds additional to Article 6 GDPR, the Kennzeichnungspflicht labelling obligation requiring visible notice at each camera, a 72-hour retention default unless you can document an exception, the prohibition of covert imaging outside narrow statutory cases, and the DSB Musterleitfaden Bildverarbeitung to align against. None of this lives in the generic EU GDPR assessment because Austria deliberately kept this regime when harmonising with GDPR.

For the IT usage logging, the command flags the §96a ArbVG Betriebsvereinbarung requirement. Under Austrian labour law, any system that enables employee monitoring requires a works-council agreement, regardless of whether GDPR lawfulness is established. If there is no Betriebsrat in scope, or no Betriebsvereinbarung covering the monitoring capability, the assessment flags that as a gap before you even ship.

For the HR data itself, the command applies the Austrian age of digital consent at fourteen, not the GDPR default of sixteen. That matters if any stakeholder in your system can be a minor.

Output goes to `projects/NNN-project/ARC-NNN-ATDSG-v1.0.md`, classified OFFICIAL-SENSITIVE because privacy assessments contain sensitive risk detail. A gap analysis at the end lists prioritised actions, including whether a full DPIA is mandatory and whether a Betriebsvereinbarung has to be drafted before rollout.

## Scenario 2: A Vienna Regional Hospital Group Integrating with ELGA

You are the solution architect on a hospital system rolling out a patient portal that integrates with the national ELGA platform. Health data is special category under Art. 9 GDPR. ELGA has its own legal framework.

Same pattern: `/arckit.eu-rgpd` first for the GDPR baseline, then `/arckit.at-dsgvo` for the Austrian layer. On top of what the previous scenario covers, the command produces an ELGA section: the ELGA-Gesetz interoperability requirements, Gesundheitstelematikgesetz 2012 telematics rules for data exchange between providers, the opt-out versus opt-in architecture for patient participation, and the controller's integration obligations. Art. 9(2) GDPR legal basis selection gets mapped to the Austrian specifics, typically §§ 7 to 8 DSG plus ELGA-G.

Because health data at scale is involved, the command sets the DPIA mandatory flag and hands off to `/arckit.dpia` as a suggested next step. By the time you close the DPIA, you have a complete privacy package: GDPR baseline, Austrian DSG overlay with ELGA specifics, and a full DPIA document, all traceable to the requirements in your Data Model.

## Scenario 3: A Styrian Regional Energy Distributor Under NIS2

You are the CISO at a Stromnetzbetreiber (electricity network operator) with 400 employees. You had Betreiber-wesentlicher-Dienste status under NISG 2018. The Austrian transposition of NIS2, published as BGBl. I Nr. 94/2025, is now in force and you need to know what changed and what your reporting obligations look like.

Run `/arckit.eu-nis2` to classify the entity against the pan-EU NIS2 Annex I/II taxonomy, confirm size thresholds, and baseline the ten Article 21 minimum security measures. Then run `/arckit.at-nisg` for the Austrian specifics.

The Austrian layer tells you several things the EU baseline does not. Your sectoral authority is E-Control for energy, so that is where sectoral guidance lives and where sectoral supervision will come from. Your reporting does not go to a single national CERT; it goes through a three-tier chain. Sectoral CERTs where they exist (Energy-CERT in your case), escalating to CERT.at operating under BMI, with GovCERT at the Bundeskanzleramt handling federal and Länder public administration. Your 24-hour early warning capability needs to hit the sectoral CERT first. The four-stage timeline of 24 hours, 72 hours, intermediate on request, and one month final report applies per the EU baseline, but the channel is Austrian.

Your previous Betreiber-wesentlicher-Dienste designation under NISG 2018 transitions automatically, but the new Essential or Important classification applies from the 2025 entry into force. The command captures the transition rules so you can see what was grandfathered and what is new.

Governance obligations get surfaced too. Management body approval of security measures is now a personal liability item under NIS2 and the Austrian transposition carries that through. Your Geschäftsleitung needs documented cybersecurity training. Supply chain security clauses need to reach your ICT suppliers through contracts, not just be an internal policy.

The output is a gap-analysis document at `projects/NNN-project/ARC-NNN-ATNISG-v1.0.md` with a maturity matrix across all ten Article 21 measures and a Mermaid Gantt roadmap across three horizons: 0 to 3 months for immediate exposure, 3 to 6 months for structural gaps, and 6 to 12 months for maturity uplift.

If your security monitoring processes personal data (logs, user activity, behavioural analytics), the command suggests handing off to `/arckit.at-dsgvo` to cover the DSG overlap. If you are a financial entity, it flags the DORA overlap and points at `/arckit.eu-dora` to avoid double-running controls.

## Scenario 4: A 1.8 Million Euro Federal IT Procurement

You are the procurement officer preparing an Ausschreibung for a federal digital identity platform, Auftragswert 1.8 million euros excluding VAT, classical sector (not Sektorenauftraggeber), processes personal data, and the contracting authority is Essential under NISG.

Run `/arckit.at-bvergg`. The command determines your threshold tier first. At 1.8M euros, classical sector, you are in Oberschwellenbereich (the current threshold for classical supplies and services is 221,000 euros excluding VAT per VO 2023/2495). That triggers both ANKÖ publication and TED publication, opens up the formal procedures (Offenes, Nicht-offenes, Verhandlungsverfahren mit Bekanntmachung, Wettbewerblicher Dialog, Innovationspartnerschaft), and applies the Oberschwellen timing requirements.

The command walks you through procedure selection with BVergG 2018 justification, drafts your Leistungsbeschreibung with traceability back to requirements (functional, non-functional, integration), sets Eignungskriterien (suitability criteria) to the proportionality standard in §20 BVergG so you are not overly restrictive, and produces Zuschlagskriterien (award criteria) on the Bestbieterprinzip default rather than lowest-price. Most Austrian public procurement runs on Bestbieter for supplies and services, and the command will flag it clearly if you try to use lowest-price without documented justification.

Because personal data is processed, the contract package includes Art. 28 GDPR Data Processing Agreement clauses tied back to your `/arckit.at-dsgvo` output. Because the contracting authority is Essential under NISG, the command pulls in NISG supply-chain security clauses from your `/arckit.at-nisg` output, so the vendor contract carries supplier security obligations at the right depth.

Timeline and publication are modelled precisely. ANKÖ publication window, minimum Angebotsfrist under §87 BVergG, the Stillhaltefrist (standstill period) after award notification before contract signing, which is where a BVwG (Bundesverwaltungsgericht) challenge typically lands if a losing bidder contests the award. Non-observance of the Stillhaltefrist is the single most common basis for successful BVwG applications, so the command makes that period explicit in the timeline.

Output is at `projects/NNN-project/ARC-NNN-BVERGG-v1.0.md`, classified OFFICIAL, with a Vergabeakt (procurement file) structure defined for Rechnungshof and EU audit defensibility.

## How the Chain Holds Together

The four scenarios above use one common shape. You start with the EU baseline (`eu-rgpd`, `eu-nis2`) to cover the pan-EU regulatory floor. You layer the Austrian command on top (`at-dsgvo`, `at-nisg`) to add what Austrian practice adds. For procurement, `at-bvergg` pulls references from both: GDPR processor clauses from your DSG output, NISG supply-chain clauses from your NISG output.

This is deliberate. The handoffs schema in each command is configured so your next suggested step is the command most likely to be useful. Run `at-dsgvo` without a prior `eu-rgpd` and it will warn you. Run `at-nisg` for a financial entity and it will flag the DORA overlap. Run `at-bvergg` on a contracting authority that has never assessed its NISG status and it will suggest running `at-nisg` first so the supply-chain clauses have a foundation.

You do not need to memorise the chain. The commands guide you through it.

## What Is Not Yet Covered

Three Austrian commands is not full parity with France's eleven, and that is by design. Depth will come as contributors work on specific instruments.

Not yet covered: Austrian cybersecurity certification regimes beyond NISG (CyFRis, which is a narrower competence layer), Bundesländer-specific procurement rules (for example the Wiener Vergaberichtlinien), EUR-Lex and RIS-Bund citation vocabulary wiring if Austrian practice warrants it, and sector-specific deeper dives (health procurement under GuKG, defence procurement under the separate Verteidigungs- und Sicherheitsvergabegesetz).

If any of those are the thing you need first, that is a good signal to open an issue or a PR. The CODEOWNERS entry for Austrian commands is active, and Tom is in the review path for anything under `at-*`. A PR that extends the overlay with CyFRis or Wiener Vergaberichtlinien support will get Austrian eyes on it before it merges.

## Getting Set Up

If you already have the ArcKit Claude Code plugin installed through the marketplace, v4.8.0 arrives automatically. After restart you will see three new commands in `/help`, each with a `[COMMUNITY]` prefix on its description. Running any of them renders a warning banner before the prompt body executes, and the generated artefacts carry `Template Origin: Community` in their Document Control header so the provenance travels with the document.

For Gemini CLI users, `gemini extensions update arckit` pulls the new commands. Codex CLI users update through the arckit-codex extension repo. OpenCode users get them through `arckit init` for new scaffolds or through their existing extension install. The Paperclip ArcKit plugin picks them up on its next cycle.

New to ArcKit entirely? The quickest path is `claude plugin install arckit` inside a Claude Code session. The plugin provides commands, templates, hooks, and MCP servers out of the box. Then just run `/arckit.at-dsgvo` against a scenario description and the command will scaffold a project, read your existing artefacts (or warn you if there are none), and produce the assessment.

## Release Details

Full release notes are at [github.com/tractorjuice/arc-kit/releases/tag/v4.8.0](https://github.com/tractorjuice/arc-kit/releases/tag/v4.8.0). The Austrian subsection of the README lists each command with a one-line summary. The contributors page at [arckit.org/contributors.html](https://arckit.org/contributors.html) has Tom's card.

Building something in Austria? The toolkit finally knows what you are actually up against. Welcome aboard, Tom.

<!-- arckit:related-articles -->
## Related Articles

- [ArcKit v4.7: 18 EU and French Regulatory Commands](article-viewer.html?a=2026-04-19-v470-eu-french-regulatory)
- [ArcKit v4.10: 12 UAE Federal Commands, Community Overlay](article-viewer.html?a=2026-04-30-uae-overlay-launch)
- [ArcKit v5.1: 10 US Federal Civilian Commands, Community Overlay](article-viewer.html?a=2026-05-24-v510-us-federal-civilian-overlay)
- [Wanted: /arckit:build Recipes for Your Jurisdiction](article-viewer.html?a=2026-05-03-community-recipes-wanted)

<!-- arckit:community-block -->
## Join the ArcKit Community

- **Discord** — real-time conversation, help with commands, and what people are building: [discord.gg/HsA4Y3hQ4](https://discord.gg/HsA4Y3hQ4)
- **LinkedIn Group** — announcements, case studies, and longer-form discussion: [linkedin.com/groups/17641034](https://www.linkedin.com/groups/17641034/)
- **GitHub** — code, issues, and contributions: [github.com/tractorjuice/arc-kit](https://github.com/tractorjuice/arc-kit)
