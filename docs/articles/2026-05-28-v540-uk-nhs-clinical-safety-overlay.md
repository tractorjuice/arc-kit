# ArcKit v5.4: NHS Clinical Safety, the Second Sector Overlay

ArcKit v5.4 ships today. It adds the second sector-specific community overlay, NHS clinical safety and UK / EU medical device classification, following the [UK Finance Payments overlay](https://arckit.org/article-viewer.html?a=2026-05-27-v530-uk-finance-payments-overlay) that opened the sector axis the day before. The marketplace grows from 9 plugins to 10. The total command count grows from 139 to 143.

For an engineering team building a digital health product for NHS deployment, this release is the moment the toolkit started speaking the regulatory language they actually need to write in. NHS DCB0129 manufacturer clinical safety case. NHS DCB0160 deployer clinical safety case. NHS DTAC v3 procurement assurance. UK MDR 2002 and EU MDR 2017/745 software as medical device classification. The four artefacts an NHS-deployed digital health product cannot ship without, generated through the same pipeline that already produces the firm's risk register, DPIA, ATRS, and Secure by Design assessment.

The sector pattern that UK Finance opened yesterday now has a second worked example. Both overlays stay inside the UK jurisdiction. Both layer regulatory specificity on top of the official baseline rather than replacing it. The pattern transfers. The shape was the right one.

## A Different Stakes Profile, the Same Plugin Shape

The architectural shape is identical to UK Finance. A community plugin scaffold, four commands prefixed with the sector identifier, four (well, two new) doc-type codes added to the registry, a recipe that composes overlay commands with the official baseline rather than swapping any of it out. The maintenance guide carries a citation register against the sector regulator, in this case NHS England, the MHRA, and the standards bodies that NHS clinical safety leans on (BSI for ISO 14971, IEC for 62304).

What is different is what an output that goes wrong does to the world.

A safeguarding misconfiguration in payments costs customers money. A clinical safety case that misses a hazard sends harm to a patient. The DCB0129 standard exists, and is mandated under the Health and Social Care Act 2012 section 250, because the consequence of getting it wrong is measurable in clinical incidents. So is DCB0160. So is medical device misclassification, which is why MDR enforcement carries criminal penalties.

That stakes profile shapes how the overlay is presented. Every command in this overlay carries an EXPERIMENTAL warning banner. Every output carries an explicit statement that it is not clinical advice and must be reviewed by a qualified Clinical Safety Officer with current GMC, NMC, HCPC, or GPhC registration before any deployment. The MDR classification command additionally requires sign off by a qualified Regulatory Affairs specialist or notified body adviser before any product, procurement, or market access decision is made on the basis of the output. The toolkit produces structured, traceable, standards-aligned artefacts. The named professionals make the call.

## What's in the Release

Four commands. Each is anchored on a published NHS England, MHRA, ISO, or IEC source. None are speculative.

**Manufacturer clinical safety case.** `uk-nhs-dcb0129` produces a Clinical Safety Case Report and Hazard Log for a manufacturer placing a digital health product on the NHS market, under NHS DCB0129 ("Clinical Risk Management: its Application in the Manufacture of Health IT Systems"). The output adopts Dr Marcus Baw's [SAFETY.md spec v2.0.0-draft](https://github.com/pacharanero/SAFETY.md) verbatim: three files (`SAFETY.md`, `SAFETY-CASE.md`, `HAZARD-LOG.md`) with YAML-frontmatter hazard data and rendered Markdown tables. The files land inside an ArcKit project subdirectory (`projects/{NNN}/clinical-safety/`) rather than at the repo root, with an ArcKit Document Control block prepended for provenance and review-cycle tracking. The body and the YAML schema follow Marcus's spec exactly so any tooling built around SAFETY.md works against ArcKit output unmodified. The four DCB0129 deliverables (Clinical Risk Management Plan, Hazard Log, Clinical Safety Case Report, Clinical Risk Management File) all flow from this single command, with the Clinical Risk Management File being the Git repository itself.

**Deployer clinical safety case.** `uk-nhs-dcb0160` produces the deployer-side companion under NHS DCB0160 ("Clinical Risk Management: its Application in the Deployment and Use of Health IT Systems"). The output is the same three-file shape, with the deployment scenario and the residual hazards from the manufacturer's DCB0129 case carried across as deployment hazards. NHS Trusts and integrated care systems deploying a digital health product are the audience here. The DCB0160 case captures the local configuration choices, the workflow integration, the user training plan, and the residual risk acceptance that the deploying organisation owns.

**DTAC v3 procurement assurance.** `uk-nhs-dtac` produces a NHS Digital Technology Assessment Criteria (DTAC v3) assessment, the procurement assurance pack that NHS buyers use to confirm a new digital product meets a baseline standard before deployment. The output covers all five DTAC sections (Clinical Safety, Data Protection, Technical Assurance, Interoperability, Usability and Accessibility) plus the AI annex. Section 1 (Clinical Safety) reads the SAFETY-CASE.md and HAZARD-LOG.md that `uk-nhs-dcb0129` produced. Section 2 (Data Protection) reads the project's DPIA. Section 3 (Technical Assurance) cross-references the Secure by Design assessment. The AI annex references the ATRS entry when the product uses AI or ML. The cross-references are not decorative: a DTAC submission is only as strong as the underlying artefacts, and the recipe ensures all of them get built. Doc-type code: `NHSDTAC`.

**SaMD / AIaMD classification.** `uk-mdr-classification` produces a software as medical device classification assessment under UK MDR 2002 (as amended by the Medical Devices (Amendment) (Great Britain) Regulations 2024) and EU MDR 2017/745. The output records whether the product is in scope of medical device regulation, the classification class under each regime (Class I, IIa, IIb, III for UK MDR; the equivalent under EU MDR Annex VIII Rule 11 for software), the conformity assessment route, the marking pathway (UKCA, UKNI, or CE), and the Windsor Framework handling for Northern Ireland placement. Post-market surveillance obligations and the relationship to the MHRA Software and AI as a Medical Device Programme are captured separately so the firm has a single document to hand to a notified body or to the MHRA on request. Doc-type code: `NHSMDR`.

Two new document-type codes land in the registry that the UK Finance, UK, EU, French, Austrian, Canadian, Australian, UAE, and USA codes already share: `NHSDTAC` and `NHSMDR`. Both carry HIGH severity. Marcus Baw's SAFETY.md filenames (`SAFETY.md`, `SAFETY-CASE.md`, `HAZARD-LOG.md`) deliberately do not carry ArcKit doc-type codes; they bypass the `validate-arc-filename` hook precisely because the SAFETY.md spec's filename contract is the point. Any tooling Marcus or anyone else builds around those filenames keeps working against ArcKit output.

## The uk-nhs-clinical-safety Recipe

The four commands are not designed to be run individually for a real NHS deployment. They share inputs with the official UK SaaS baseline (Stakeholders, Requirements, Risk, the DPIA, ATRS, the Technology Code of Practice review, the Secure by Design assessment), and they depend on each other in a known order. The `uk-nhs-clinical-safety` recipe encodes that dependency graph as 44 targets across 8 waves.

The waves move from foundations (principles, stakeholders, requirements) through risk and data protection (risk register, data model, DPIA), through the official UK baseline that NHS digital products still need (TCoP, Secure by Design, ATRS where AI is in play), through the NHS overlay itself (DCB0129 first, then DCB0160 reading its outputs, then MDR classification reading both, then DTAC reading all three), through architecture decisions and design, and finally through traceability and a health pass. The recipe composes with the UK SaaS baseline rather than swapping anything out, because an NHS digital product still needs the TCoP review and the Secure by Design assessment and the DPIA and the ATRS. The NHS overlay adds clinical safety and medical device regulation on top.

Run `claude /arckit:build <project> --recipe uk-nhs-clinical-safety` from a scaffolded project and the orchestrator dispatches one subagent per target per wave, validates the output, commits the wave, and saves progress to `.arckit/state.json`. The MDR classification command can be excluded with `--exclude UK_MDR_CLASSIFICATION` for products that are clearly not medical devices, but the recipe asks the project first because misclassifying a device as a non-device is the worse regulatory failure of the two.

## Why Defer to an Existing Community Spec

ArcKit usually produces its own templates. For DCB0129 and DCB0160, it deliberately does not.

Dr Marcus Baw's SAFETY.md spec at [github.com/pacharanero/SAFETY.md](https://github.com/pacharanero/SAFETY.md) is the de facto open standard for representing NHS clinical safety cases as markdown files in a Git repository. It is in active use across NHS digital teams, RCPCH, openEHR, and a chain of earlier work at [turva-uk](https://github.com/turva-uk) and Baw Medical. It defines a three file structure (`SAFETY.md` as the human-readable index and risk management plan, `SAFETY-CASE.md` as the GSN-inspired safety argument, `HAZARD-LOG.md` as the YAML-frontmatter-and-rendered-table hazard register) that any tooling built around clinical safety in NHS digital can read.

Inventing a parallel ArcKit template would have done two things: it would have created two competing clinical safety case shapes in the NHS digital ecosystem, and it would have signalled to Marcus and to the SAFETY.md community that the toolkit was here to replace their work rather than amplify it. Neither outcome was useful.

So the v1 design adopts SAFETY.md verbatim. Same filenames, same YAML schema, same three file structure. The only ArcKit addition is the Document Control block prepended to each file for provenance and review-cycle tracking, and the placement of the files inside `projects/{NNN}/clinical-safety/` rather than the repo root so the structure scales to multi-project ArcKit workspaces. Marcus reviewed the design before the PR opened. The locked decisions in the PR call out every place his judgment was load-bearing, and the body of the PR thanks him for pushing back where the early draft was wrong.

This matters for the next contributor. The pattern says: when an existing open spec already exists in the sector you are working on, defer to it. Do not reinvent. Add only the integration glue ArcKit needs (Document Control, project layout, recipe placement). The spec author is a candidate co-maintainer. The contribution flow is then a collaboration with the existing community, not a parallel build.

## A Named Co-Maintainer at Launch

The UK Finance overlay shipped EXPERIMENTAL with no named domain co-maintainer. NHS ships EXPERIMENTAL with a named proposed co-maintainer at launch.

Dr Marcus Baw is a clinical informatician at RCPCH, openEHR, and NHS England. He authored the SAFETY.md spec. He has been involved in NHS clinical informatics since before "clinical informatics" was the accepted term. His earlier DCB0129 markdown work at turva-uk and Baw Medical is part of the lineage this overlay sits on. Issue [#424](https://github.com/tractorjuice/arc-kit/issues/424) tracks the contribution. He has been invited as proposed domain co-maintainer for the NHS overlay, and the v1 design was paused for his review before being marked ready for merge.

Having a named co-maintainer at launch changes the maintenance guarantee. The overlay still ships EXPERIMENTAL, because the quality bar for promotion to the official tier requires demonstrated quarterly review cadence and a regression sweep across NHS test repositories, neither of which exists yet. But the path to promotion is in place. Quarterly citation review will happen on a schedule that Marcus and the project owner share. The DCB0129 / DCB0160 outputs will be validated against real NHS digital products before any move toward official tier promotion. Until then, the EXPERIMENTAL marker stays, and every command's warning banner reinforces that a qualified Clinical Safety Officer's sign off is non-negotiable.

The recruiting message that the UK Finance overlay launched with still applies for UK Finance. NHS launches with the co-maintainer angle already addressed. Sector overlays in other domains can come either way: with a named co-maintainer at launch (the stronger position) or with the recruiting call open (the position UK Finance is in today).

## What's Out of Scope

Five areas are deliberately out of scope for v5.4 and are tracked as candidate Phase 2 commands or sibling overlays.

GitHub Issues hazard log alternative is the first. Marcus's SAFETY.md spec supports a `--via=issues` variant that uses GitHub Issues as the hazard register rather than a markdown file. It is deferred to Phase 2 because the v1 design needed to land the canonical three file shape first; the Issues variant is a routing decision on top.

SAFETY-PLAN.md Tier 3 generation is the second. The SAFETY.md spec defines an optional SAFETY-PLAN.md file for Tier 3 / SaMD products that need a separately maintained Clinical Risk Management Plan. The v1 commands fold the plan content into SAFETY.md for Tier 1 and Tier 2 products; Tier 3 / SaMD generation is a Phase 2 addition.

Phase 2 candidate commands are the third group: `uk-nhs-cra` (NHS Clinical Risk Assessment), `uk-nhs-interop` (NHS Interoperability and FHIR UK Core conformance), `uk-mhra-saamd-roadmap` (MHRA Software and AI as Medical Device Programme alignment), and `uk-nhs-shared-care-record` (Shared Care Record participation). Marcus's openEHR and FHIR UK Core background will be the deciding factor on priority order once Phase 2 work opens.

Hardware medical devices are the fourth. `uk-mdr-classification` is SaMD only in v1. Hardware classification is a candidate Phase 2 addition; the patterns in the MHRA Conformity Assessment Notice on classification of medical devices are different enough from SaMD that they warrant their own command rather than a flag on the existing one.

NHS test repository is the fifth. There is no NHS-shaped public test repository in the ArcKit fleet yet (the fleet currently has 49 repositories covering UK Government, UAE, France, Canada, EU, Austria, Australia, USA federal civilian, and now UK Finance). An NHS fixture, likely something synthetic that exercises DCB0129 and DTAC end to end, is a candidate follow-on. Once a suitable fixture is identified, the recipe gets a regression test repository the way the other sectors do.

## The Sector Pattern Is Now Validated

UK Finance opened the sector axis yesterday. NHS validates it as a pattern by repeating it.

The repeatable shape is now clear:

1. Pick a sector prefix (`uk-fs-`, `uk-nhs-`, future `uk-insurance-`, `uk-banking-`, `us-healthcare-`, `eu-pharma-`).
2. Write commands that compose with the relevant jurisdictional baseline rather than swapping it out. NHS still needs TCoP, SBD, DPIA, ATRS. UK Finance still needs risk, DPIA, ADRs.
3. Register the sector's doc-type codes. NHS adds `NHSDTAC`, `NHSMDR`. UK Finance added `FSSCA`, `FSSAFE`, `FSCD`, `FSCTP`.
4. Ship a recipe that encodes the dependency graph between the sector commands and the baseline as ordered waves.
5. Add a maintenance guide with a citation register against the sector regulator (NHS England + MHRA for NHS; FCA + PRA + Bank of England for UK Finance).
6. Where an open community spec already exists in the sector, defer to it (SAFETY.md for NHS).
7. Recruit a named co-maintainer at launch where possible (Marcus Baw for NHS) or open the recruiting call where not (UK Finance).
8. Mark the overlay `[COMMUNITY]` and `EXPERIMENTAL` until the maintenance guarantees are demonstrably in place.
9. Open a PR.

The international applications are visible from here. US healthcare under HIPAA, HITECH, and the 21st Century Cures Act, with a likely defer-to-spec for HL7 FHIR and CCDA. EU healthcare under the EU Medical Device Regulation, the In Vitro Diagnostic Regulation, and the European Health Data Space. The pattern transfers. The regulator changes.

UK domestic sector candidates are visible too. Insurance under PRA SS1/23 model risk and SS2/21 outsourcing. Banking prudential under ICAAP, ILAAP, and recovery and resolution planning. Education under JISC procurement, the DfE digital and technology standards, and Ofsted data handling. Each needs a domain expert contributor willing to take the maintainer role, a handful of sector specific commands, and the willingness to keep them current.

Two sector overlays in two days is not the cadence to expect going forward. Both shipped together because both were ready. The next sector overlay is whoever shows up with a named co-maintainer and a willingness to do the work.

## How to Use

For users on the existing ArcKit Claude Code plugin, the v5.4.0 update arrives through the marketplace. Run `claude plugin install arckit arckit-uk-nhs` to install the core plugin and the NHS overlay together. The four new commands appear in `/help` with the `[COMMUNITY]` tag and a warning banner before each prompt body runs. Gemini CLI extension users get the same via `gemini extensions update arckit`. Codex, OpenCode, Copilot, and Paperclip users get the commands via their respective extension repos, or via `arckit init`.

The `arckit` core plugin is a hard dependency. Without it, the `uk-nhs-clinical-safety` recipe cannot resolve the foundation commands (`arckit:principles`, `arckit:requirements`, `arckit:risk`, `arckit:dpia`, `arckit:atrs`, `arckit:secure`, `arckit:tcop`), and the file name validation hook will not recognise the two new NHS doc-type codes. On Claude Code v2.1.143 and later, `claude plugin disable arckit` will refuse with a copy pasteable disable chain hint while `arckit-uk-nhs` is still enabled.

The full release notes are at [github.com/tractorjuice/arc-kit/releases/tag/v5.4.0](https://github.com/tractorjuice/arc-kit/releases/tag/v5.4.0). The maintenance guide and full citation register are at [`docs/guides/uk-nhs-clinical-safety-overlay.md`](https://github.com/tractorjuice/arc-kit/blob/main/docs/guides/uk-nhs-clinical-safety-overlay.md). Per command guides for all four are under [`docs/guides/uk-nhs-*.md`](https://github.com/tractorjuice/arc-kit/tree/main/docs/guides) and [`docs/guides/uk-mdr-classification.md`](https://github.com/tractorjuice/arc-kit/blob/main/docs/guides/uk-mdr-classification.md). The SAFETY.md spec lives at [github.com/pacharanero/SAFETY.md](https://github.com/pacharanero/SAFETY.md).

For NHS clinical informatics practitioners who would consider sustained contribution to the overlay, the right way in is via issue [#424](https://github.com/tractorjuice/arc-kit/issues/424) with a short note on your background.

Ten marketplace plugins. 143 commands. Eight jurisdictions and two sectors. The sector axis now has two worked examples. It will not have only two for long.

<!-- arckit:related-articles -->
## Related Articles

- [ArcKit v5.3: The First Sector Overlay, for UK Payments](article-viewer.html?a=2026-05-27-v530-uk-finance-payments-overlay)
- [ArcKit v5.1: 10 US Federal Civilian Commands, Community Overlay](article-viewer.html?a=2026-05-24-v510-us-federal-civilian-overlay)
- [Wanted: /arckit:build Recipes for Your Jurisdiction](article-viewer.html?a=2026-05-03-community-recipes-wanted)
- [ArcKit v4.7: 18 EU and French Regulatory Commands](article-viewer.html?a=2026-04-19-v470-eu-french-regulatory)

<!-- arckit:community-block -->
## Join the ArcKit Community

- **Discord** — real-time conversation, help with commands, and what people are building: [discord.gg/HsA4Y3hQ4](https://discord.gg/HsA4Y3hQ4)
- **LinkedIn Group** — announcements, case studies, and longer-form discussion: [linkedin.com/groups/17641034](https://www.linkedin.com/groups/17641034/)
- **GitHub** — code, issues, and contributions: [github.com/tractorjuice/arc-kit](https://github.com/tractorjuice/arc-kit)
