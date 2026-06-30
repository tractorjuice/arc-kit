![ArcKit v5.3 UK Finance Payments Overlay launch hero. The first sector overlay. UK Finance Payments. Eight jurisdiction-overlay chips along the top, a dashed green branch dropping from the UK chip to an arckit-uk-finance card, and a four-row command panel listing the FSSCA, FSSAFE, FSCD, and FSCTP commands with their regulatory anchors.](https://arckit.org/articles/2026-05-27-v530-uk-finance-payments-overlay-hero.png)

# ArcKit v5.3: The First Sector Overlay, for UK Payments

ArcKit v5.3 ships today. It introduces a new kind of community overlay, a sector overlay rather than a jurisdiction overlay, and four commands that cover the FCA payments stack for established UK Payment Service Providers, E-Money Institutions, and Payment Institutions. The marketplace grows from 8 plugins to 9. The total command count grows from 135 to 139.

For an architect inside a UK PSP or EMI rebuilding a payment rail on top of an existing FCA authorisation, this release is the day the toolkit started speaking their regulatory language. Strong Customer Authentication exemption design, safeguarding methodology, the FCA Consumer Duty board report, and the new Critical Third Parties regime under PS24/16 are all first class artefacts now, generated through the same pipeline that already produces the firm's Wardley Maps, ADRs, and DPIAs.

The release also opens a new axis in how the toolkit grows. The seven prior community overlays (UAE, France, Canada, EU, Austria, Australia, USA federal civilian) cover legal territories. UK Finance Payments stays inside the UK but narrows to a single industry vertical. Both shapes share the same plugin scaffolding, the same recipe machinery, and the same build harness. The difference is what they replace versus what they layer on top of.

## Why a Sector Overlay, and Why Now

The trigger was the same as the trigger for every prior overlay. Issue traffic, direct messages, and a steady drip of GitHub stars from architects inside UK PSPs and EMIs all pointed at the same gap. ArcKit knew the UK Government Service Standard and the NCSC CAF well. It had nothing to say about Article 18 fraud rate bands under the UK SCA-RTS, or about safeguarding methodology under the EMR 2011, or about how to structure a Consumer Duty board report so that it reads the way the FCA's December 2024 (updated March 2026) good-practice observations expect it to read.

The regulatory cadence forced the timing. FCA PS24/9 reformed safeguarding in 2024. FCA PS24/16 brought the Bank of England, PRA, and FCA Critical Third Parties regime live in January 2025. The FCA's Consumer Duty board-report observations have evolved through 2025 and into 2026. Three of the four commands in this release exist because the regime they cover has shifted inside the last eighteen months and an architect's compliance documentation needs to shift with it.

The decision to ship this as a sector overlay rather than a UK-jurisdiction expansion was deliberate. The official UK baseline (principles, stakeholders, requirements, risk, ADRs, the DPIA, the diagram commands, the Wardley work) is sector neutral. A payments firm needs all of it. A central government department needs all of it. Stuffing FCA-specific commands into the official baseline would have made the toolkit heavier for every user who would never touch a payment rail, in exchange for marginally easier discovery for the users who would. A sector overlay keeps the baseline lean and puts the payments load behind an opt-in install.

## What's in the Release

Four commands. Each is anchored on a published FCA, PRA, or Treasury source. None are speculative.

**SCA-RTS exemption design.** `uk-fs-sca-rts` produces an SCA-RTS exemption design pack for an authorised PSP, EMI, or PI subject to the Payment Services Regulations 2017 and the UK Technical Standards on Strong Customer Authentication (FCA 2020/70 as amended by PS21/19). The artefact covers an exemption applicability matrix for Articles 10, 10A, 11, and 13 through 18, with Article 12 deliberately out of scope as AISP-only. It walks the project through the Transaction Risk Analysis fraud rate band assessment under Article 18, captures the authentication architecture across the knowledge, possession, and inherence factor inventory, draws the dynamic linking implementation, and records the fraud monitoring framework including the reporting cadence and the MLRO notification triggers. Doc-type code: `FSSCA`.

**EMI and PI safeguarding assessment.** `uk-fs-safeguarding` produces a safeguarding assessment for an authorised EMI or API, or for a Small Payment Institution that voluntarily safeguards, under EMR 2011 Regulations 20 to 22 and PSRs 2017 Regulation 23. The artefact carries the highest severity flag in the overlay (CRITICAL) because the documented enforcement cases (Allied Wallet in 2021, Premier FX in 2018) make the consequences of getting safeguarding wrong as concrete as they get. It covers the safeguarding method statement (segregation in a designated bank account, comparable insurance policy, or comparable guarantee), the designated safeguarding bank or insurer details, the end-to-end client funds flow diagram, the daily reconciliation framework with a four-tier sign-off chain, the audit plan aligned to FCA REP-CRIM expectations and the monthly safeguarding return (SUP 16 Annex 34A for payment institutions, SUP 16 Annex 34B for EMIs), and the failure scenarios and recovery plans. Doc-type code: `FSSAFE`.

**Consumer Duty annual board report.** `uk-fs-consumer-duty` produces an FCA Consumer Duty Annual Board Report covering the four Consumer Duty outcomes (Products and Services, Price and Value, Consumer Understanding, Consumer Support) introduced by PS22/9 and anchored on FCA Principle 12 and PRIN 2A. The artefact carries per-outcome evidence assessment, a fair value framework, a target market assessment, vulnerable customer cohort identification using the FG22/5 four vulnerability drivers (health, life events, resilience, capability), a foreseeable harms register, and a board attestation block for SMF holder sign-off. The structure follows the shape of the FCA's December 2024 (updated March 2026) good-practice observations so the document is recognisable to a supervisor reading it. Doc-type code: `FSCD`.

**Critical Third Parties dependency assessment.** `uk-fs-ctp-dependency` produces a CTP dependency register and resilience testing plan under the joint Bank of England, PRA, and FCA CTP regime established by PS24/16 (effective January 2025) and grounded in the Financial Services and Markets Act 2023. The artefact identifies the firm's designated CTPs and material non-CTPs (cloud hyperscalers, payment networks, BaaS providers), runs each through a four-dimension materiality scoring framework (IBS dependency, substitution difficulty, recovery time impact, concentration risk contribution), frames the Nth-party (sub-contractor) dependency picture, analyses concentration risk across geographic, vendor, and functional dimensions, and produces a resilience testing plan with exit and substitution drills. The designated CTP list is still maturing, so the command points back to the HMT publication page for re-verification rather than baking a static list into the artefact. Doc-type code: `FSCTP`.

Four new document-type codes land in the registry that the UK, EU, French, Austrian, Canadian, Australian, UAE, and USA codes already share: `FSSCA`, `FSSAFE`, `FSCD`, `FSCTP`. Every hook in the toolkit (file name validation, provenance stamping, manifest update, graph injection) picks them up without any further wiring. `FSSAFE` is the first overlay doc-type registered with a CRITICAL severity marker, which flags it for elevated sign-off and more frequent review than the standard compliance artefacts.

## The uk-fs-payments Recipe

The four commands are not designed to be run individually for a real compliance push. They share inputs with the official baseline (Stakeholders, Requirements, Risk, ADRs, the DPIA), and they depend on each other in a known order. The `uk-fs-payments` recipe encodes that dependency graph as four build waves and eleven targets:

1. **Foundation.** `principles`, `stakeholders` from the official core. The payments commands need these as context.
2. **Requirements and risk.** `requirements`, `risk`. Risk reads the requirements; everything downstream reads risk.
3. **Payments overlay, parallel where possible.** `uk-fs-sca-rts`, `uk-fs-safeguarding`, `uk-fs-consumer-duty`, `uk-fs-ctp-dependency` all run in parallel because their dependencies are upstream, not on each other.
4. **Cross-cutting.** `data-model`, `dpia`, `adr`, then a traceability sweep and a health pass.

Run `claude /arckit:build <project> --recipe uk-fs-payments` from a scaffolded project and the orchestrator dispatches one subagent per target per wave, validates the output, commits the wave, and saves progress to `.arckit/state.json`. A long payments compliance build can pause and resume across sessions without losing work. The same `arckit-build` skill that handles the UK, EU, French, Canadian, Australian, UAE, and USA recipes handles this one. The recipe scaffolding earned its keep again.

## Why Community Tier, Why EXPERIMENTAL

The overlay ships as `[COMMUNITY]` and `EXPERIMENTAL`, for the same reason every prior community overlay ships that way, plus one specific to financial services.

The general reason is the quality commitment. The official tier promises quarterly regulatory citation review, a regression sweep across the public reference repositories, and an output bar an architect can hand to counsel without a paragraph of caveats. That commitment needs more than one pair of eyes on a regulatory corpus that moves as fast as UK payments regulation does.

The payments-specific reason is the stakes. A safeguarding failure has put firms out of business. An SCA-RTS misconfiguration is a fraud loss that customers see. A Consumer Duty board report that does not match what the supervisor expects becomes a supervisory finding. None of these are the toolkit's calls to make on a firm's behalf. The overlay produces structured, traceable, regulator-shaped artefacts. The firm's regulatory counsel, MLRO or Compliance Officer, and the SMF holder with primary accountability for payment services own the sign-off. The `EXPERIMENTAL` marker is the toolkit's way of being honest about which side of that line it sits on.

The maintenance guide carries a citation register: every primary regulatory source the four commands cite, the date it was last verified, and the next scheduled review. Anyone running these commands should read [the overlay guide](https://github.com/tractorjuice/arc-kit/blob/main/docs/guides/uk-fs-payments-overlay.md) first.

Recruiting a UK FS domain co-maintainer is now the v5.4 priority. The target profiles are an FCA-authorised payments firm compliance lead, a payment services solicitor, a Big Four FS regulatory adviser, or an architect with direct FCA supervisory engagement experience. A co-maintainer would share the quarterly citation review load, would be the named voice on PSR-side changes (the APP fraud reimbursement scheme moved to the PSR in 2024, and the Open Banking Variable Recurring Payments rollout is still in flux), and would unlock a credible case for promotion to the official tier in a future release.

## What's Out of Scope

Five areas are deliberately out of scope for v5.3 and are tracked as candidate v2 commands or sibling overlays.

Operational resilience is the first. The FCA and PRA operational resilience framework (important business services, impact tolerance setting, severe-but-plausible scenarios) overlaps with the Critical Third Parties dependency assessment, and was deferred to keep v1 focused. It is the obvious next addition, candidate command name `uk-fs-payments-or`.

APP fraud reimbursement is the second. The Payment Systems Regulator's mandatory reimbursement policy went live in October 2024 and is under active supervisory focus. It needs its own command (`uk-fs-app-fraud`) covering the reimbursement obligation framework, the Confirmation of Payee scheme rules, and the consumer standard of caution exception.

AML Regulation 18 is the third. The MLR 2017 firm-wide risk assessment under Regulation 18 sits adjacent to the safeguarding command but is its own document with its own structure. A `uk-fs-aml-reg18` command is a strong v2 candidate, and would close the MLRO-shaped gap that the current commands touch only at the edges.

DORA mapping is the fourth. UK firms with EU-regulated entities have to align their CTP dependency picture with the EU Digital Operational Resilience Act's ICT third-party risk requirements. A `uk-fs-dora-mapping` command would bridge between this overlay's CTP work and the EU overlay's DORA work for firms that need both.

Open Banking conformance is the fifth. API conformance testing evidence, OBIE Directory enrolment artefacts, and the FAPI 1.0 Advanced profile mapping are a separate concern with a separate audience (Third Party Providers rather than Account Servicing Payment Service Providers). They are a candidate for a sibling `arckit-uk-open-banking` overlay rather than commands inside this one.

Banking prudential regulation (ICAAP, ILAAP, SS1/23 model risk management), insurance, and asset management are all out of scope by design. Each is a candidate sector overlay of its own.

## What This Pattern Now Says to the Next Contributor

The most useful thing about a sector launch is not the four commands. It is the shape it opens for the next contributor.

Two patterns now exist for community overlays in the marketplace:

1. **Jurisdiction overlays** replace or supplement the UK governance framework for a different legal territory. UAE, France, Canada, EU, Austria, Australia, USA federal civilian. The shape is a country or region prefix on every command, doc-type codes that reflect the jurisdiction, a recipe that orchestrates the local stack, and a maintenance guide with a citation register against the local regulator.

2. **Sector overlays** stay inside a jurisdiction but narrow the regulatory focus to an industry vertical. UK Finance Payments is the first. The shape is a sector prefix on every command, doc-type codes that reflect the sector, a recipe that composes the sector commands with the baseline, and a maintenance guide with a citation register against the sector regulator.

Both shapes share the same plugin scaffolding, the same `dependencies` field declaring exact-version core compatibility, the same `${user_config.*}` substitution, the same hook surface, and the same `[COMMUNITY]` warning banner. The difference is in what the overlay assumes about the rest of the toolkit. A jurisdiction overlay can replace the UK baseline because the user is operating in a different legal territory. A sector overlay must compose with the baseline because the user is still in the same legal territory and still needs the baseline artefacts; the sector just adds a regulatory layer on top.

The sector pattern is now a worked example. The obvious next candidates are visible from here. UK Insurance (PRA SS1/23 model risk, SS2/21 outsourcing, Lloyd's market specifics). UK Banking prudential (ICAAP, ILAAP, recovery and resolution planning). NHS / UK Healthcare (DCB0129 and DCB0160 clinical safety, DTAC, MHRA medical device classification). UK Government (already largely covered by the official baseline, but with specific gaps around AI assurance, transparency, and data sharing for which dedicated commands would help). UK Education (a thin overlay covering JISC procurement, the DfE digital and technology standards, and Ofsted data handling). Each needs a domain expert contributor willing to take the maintainer role, a handful of sector specific commands, and the willingness to keep them current.

Internationally, the sector pattern travels. US healthcare (HIPAA covered entities). US financial services (FFIEC, GLBA, SOX). EU pharma (EMA, GxP). The shape transfers; only the regulator changes.

The toolkit's contribution model is now ready for both axes.

## How to Use

For users on the existing ArcKit Claude Code plugin, the v5.3.0 update arrives through the marketplace. Run `claude plugin install arckit arckit-uk-finance` to install the core plugin and the UK Finance overlay together. The four new commands appear in `/help` with the `[COMMUNITY]` tag and a warning banner before each prompt body runs. Gemini CLI extension users get the same via `gemini extensions update arckit`. Codex, OpenCode, Copilot, and Paperclip users get the commands via their respective extension repos, or via `arckit init`.

The `arckit` core plugin is a hard dependency. Without it, the `uk-fs-payments` recipe cannot resolve the foundation commands (`arckit:principles`, `arckit:requirements`, `arckit:risk`, `arckit:adr`, `arckit:dpia`), and the file name validation hook will not recognise the four new UK Finance doc-type codes. On Claude Code v2.1.143 and later, `claude plugin disable arckit` will refuse with a copy pasteable disable chain hint while `arckit-uk-finance` is still enabled.

The [overlay maintenance guide and full citation register](https://github.com/tractorjuice/arc-kit/blob/main/docs/guides/uk-fs-payments-overlay.md) is the place to start. Per command guides for all four (SCA-RTS, safeguarding, Consumer Duty, CTP dependency) sit alongside it under [`docs/guides/uk-fs-*.md`](https://github.com/tractorjuice/arc-kit/tree/main/docs/guides).

Nine marketplace plugins. 139 commands. Eight jurisdictions and one sector. The sector axis is the latest chapter. It will not be the last.

---

*Originally published at [arckit.org](https://arckit.org/article-viewer.html?a=2026-05-27-v530-uk-finance-payments-overlay).*

<!-- arckit:related-articles -->
## Related Articles

- [ArcKit v5.4: NHS Clinical Safety, the Second Sector Overlay (Medium)](article-viewer.html?a=2026-05-28-v540-uk-nhs-clinical-safety-overlay-medium)
- [ArcKit v5.4: NHS Clinical Safety, the Second Sector Overlay](article-viewer.html?a=2026-05-28-v540-uk-nhs-clinical-safety-overlay)
- [ArcKit v5.1: 10 US Federal Civilian Commands, Community Overlay](article-viewer.html?a=2026-05-24-v510-us-federal-civilian-overlay)
- [Five Patterns to Steal from anthropics/financial-services](article-viewer.html?a=2026-05-06-anthropics-financial-services-architecture-lesson)

<!-- arckit:community-block -->
## Join the ArcKit Community

- **Discord** — real-time conversation, help with commands, and what people are building: [discord.gg/HsA4Y3hQ4](https://discord.gg/HsA4Y3hQ4)
- **LinkedIn Group** — announcements, case studies, and longer-form discussion: [linkedin.com/groups/17641034](https://www.linkedin.com/groups/17641034/)
- **GitHub** — code, issues, and contributions: [github.com/tractorjuice/arc-kit](https://github.com/tractorjuice/arc-kit)
