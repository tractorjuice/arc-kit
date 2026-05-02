# The CAIO's First 90 Days: Delivering the UAE Cabinet Agentic AI Mandate

You are a Chief AI Officer in a UAE federal entity. On 23 April 2026 the Cabinet, under the directives of His Highness Sheikh Mohammed bin Rashid Al Maktoum, set you a target: fifty per cent of your sectors and services on agentic AI within two years. H.H. Sheikh Mansour bin Zayed Al Nahyan oversees the programme. H.E. Mohammad Abdullah Al Gergawi, Minister of Cabinet Affairs, chairs the taskforce. Your performance, and that of your minister and director-general, will be assessed on adoption speed, AI mastery, and standards implementation. Twenty-four months. No grace period.

This article is for you. It is not an analysis of the mandate. It is a working plan for the first ninety days, written on the assumption that you have read the announcement, agree with the direction, and now need to move.

The plan covers four things you must lock down before week thirteen: what you are required to produce, what timeline is actually achievable, what team and budget you will need, and what architecture stack the artefacts have to fit. At the end is a note on a property of the toolset itself that matters for how you brief your minister.

## What You Are Required to Produce

Strip the four Cabinet-approved instruments to the artefacts they obligate you to generate, and the picture clarifies.

The **UAE Code for Government Services and Zero Bureaucracy** obligates you to design every in-scope service against a single federal reference model. Output: a portfolio-level architecture principles document that your services are demonstrably aligned to, plus a service-level design artefact for each in-scope service that traces back to those principles.

The **Government Services Digital Records Policy** obligates every artefact to carry classification, version, lineage, and a comprehensive records guide. Output: every document your team produces must have a Document Control header (Document ID, Type, Project, Classification on the PUBLIC / OFFICIAL / OFFICIAL-SENSITIVE / SECRET ladder, Status, Version, Owner, Reviewed By, Approved By, Distribution) and a Revision History. No exceptions.

The **Government Services Data Sharing Policy** — "collect once, use securely" — obligates explicit data and integration design at the centre of every service. Output: a data model per service, with data requirements (DR-xxx) traced through to the integration surface (INT-xxx), and a security treatment that satisfies federal information-security obligations.

The **Federal Government Guide to Aligning Digital Government Projects with National Priorities** obligates feasibility studies, pilot approaches, reuse of existing federal capabilities (UAE Pass, digital wallets), and explicit avoidance of duplication. Output: a Strategic Outline Business Case per service with a documented build-versus-reuse decision, a feasibility section, and a pilot plan.

Translated to the artefact set you will defend at every taskforce review: requirements specification (BR/FR/NFR/INT/DR), stakeholder map, risk register, data model, integration design, vendor and platform evaluation, strategic outline business case, architecture decision record per material decision, and a Wardley map per service for situational awareness. Per service. For half your portfolio. In two years.

That is the volume problem. Solve it and the rest is engineering.

## What Timeline Is Actually Achievable

Twenty-four months is not negotiable. What is negotiable is how you phase it.

A defensible phasing has three stages. **Stage one, months one to three: foundation.** You ratify federal-portfolio architecture principles, classify your service portfolio into in-scope and out-of-scope, identify your three to five pathfinder services, and stand up the toolchain that will produce every subsequent artefact. By the end of stage one you have a published principles document, a portfolio classification with taskforce sign-off, and an empty but configured project structure for each pathfinder.

**Stage two, months four to twelve: pathfinder delivery.** Each pathfinder service goes through the full artefact set — requirements, stakeholders, risks, data model, integration, vendor evaluation, SOBC, ADRs, Wardley map. Pilots start in month seven for the earliest pathfinder and month ten for the latest. By the end of stage two, three to five services are demonstrably running on agentic AI in production with the full governance trail behind them.

**Stage three, months thirteen to twenty-four: portfolio rollout.** The pathfinder artefacts become templates and patterns for the rest of the in-scope portfolio. Cadence accelerates: services that took eight weeks in stage two take three weeks in stage three because the principles, the data model fragments, the vendor evaluations, and the integration patterns are now reusable. By month twenty-four you are at fifty per cent.

The stage-three cadence collapse is the load-bearing assumption in this plan. Without it, the maths does not work. The way you make it work is by making sure every artefact in stages one and two is generated, not bespoke. More on this below.

## What Team and Budget You Will Need

Resourcing for this mandate at federal entity scale lands inside three buckets.

**Architecture team.** The minimum credible shape is a chief architect, three senior solution architects, two data architects, and one security architect — seven people, all senior. At UAE federal compensation bands and a modest allocation for benefits and overhead this is in the range of AED 8 to 12 million a year fully loaded. Below this size the artefact production rate cannot sustain stage two and your stage three cadence collapse will not happen.

**Engineering and AI delivery team.** Per pathfinder, plan for a delivery lead, two senior AI engineers, two backend engineers, one platform engineer, and a designer. Five pathfinders running in parallel during stage two is therefore a thirty-five person engineering bench, before you count the rollout teams in stage three. At UAE federal rates this is in the AED 35 to 50 million range annually, which is the bulk of your budget envelope.

**Platform and licensing.** Frontier AI model access, cloud capacity, the agentic orchestration layer, the architecture toolchain, and the security tooling combine into a platform line in the AED 8 to 15 million range annually for an entity of moderate size. The agentic AI consumption costs will be the largest variable item; budget conservatively because per-token economics in 2026 are still moving.

Round the envelope to AED 50 to 75 million annually for a mid-sized federal entity running this programme to the Cabinet timeline. Smaller entities can run a leaner version; larger entities (Interior, Health, Education, Federal Tax Authority) will need multiples.

The number that matters more than the headline is the architecture-to-engineering ratio. Seven architects supporting thirty-five engineers is one to five, which is sustainable only if the architects are not hand-writing artefacts. The ratio breaks immediately if they are.

## What Architecture Stack the Artefacts Have to Fit

Three layers, in order from the artefact down to the runtime.

**Governance layer.** Every artefact your team produces must be machine-readable, version-controlled, classified at the document level, and citation-traceable back to the federal source it derives from. Practically this means flat-file Markdown artefacts in a Git repository, a Document Control standard enforced at the template level, and a citation marker convention that lets an auditor trace any decision back to a specific paragraph in a specific source document. This is the layer the Digital Records Policy actually mandates, even though the policy uses the language of records rather than of source control.

**Service architecture layer.** Each service has a directory of versioned ARC-xxx artefacts: requirements, stakeholders, risks, data model, integration design, vendor evaluation, SOBC, ADRs, Wardley map. The artefacts reference each other through stable IDs (BR-1, NFR-SEC-3, ADR-007), so changes propagate in review rather than silently.

**Agentic delivery layer.** Frontier model access (Claude, GPT, Gemini at minimum, with regional providers where sovereignty requires), an agentic orchestration runtime (AI assistants in the architect's IDE: Claude Code, Codex CLI, Gemini CLI, Copilot), and the agentic AI services running in production for the deployed services. UAE Pass integration. Federal data sharing endpoints. Standard observability and security tooling.

The ArcKit toolkit was built for this exact stack. It is open source, runs across all the major AI assistants in use today (seven distribution formats currently, including Claude Code, Codex CLI, Gemini CLI, OpenCode CLI, GitHub Copilot, the standalone Codex extension, and the Paperclip TypeScript plugin), ships 86 commands covering the artefact set above (68 officially maintained, 18 community-contributed for EU and French regulatory overlays), and has 47 reference repositories the maintainer regression-tests against. It is in active use today on a project for the UAE Ministry of Interior — `projects/006-moi-agentic-ai-pathfinder` — and the Cabinet announcement of 23 April is already in that project's citation register as `WEB-CABINET-23APR2026`, anchoring the Federal Mandate section of the research artefact.

A UAE-specific overlay (`uae-*` commands covering the four Cabinet instruments, UAE Pass integration, federal classification handling, Ministry of AI strategy alignment) is a natural next contribution and would be community-maintained under the same CODEOWNERS pattern that the EU and French overlays use today. If you want this in your toolchain inside ninety days, the route is to contribute it.

## What to Do in Week One

Concrete actions, not aspirational ones.

Day one: read the four Cabinet instruments end to end. Not the press release. The instruments themselves.

Day two: classify your service portfolio into in-scope and out-of-scope for the fifty-per-cent target. Use the federal scoring guidance the taskforce will publish; in the absence of it, score on transaction volume, citizen impact, and decision-rule clarity.

Day three: identify your three to five pathfinder services. Bias toward services with high transaction volume, clean data, and a defensible build-versus-reuse story.

Day four: stand up the toolchain. Install ArcKit (the Claude Code plugin via marketplace, the Codex CLI extension, or the Gemini CLI extension depending on which AI assistant your architects use). Configure the federal organisation name and default classification at plugin enable time so every generated artefact carries them automatically.

Day five: run `arckit.principles` once at the federal-portfolio level. The output is a starting point your chief architect adapts in an afternoon and circulates for endorsement.

End of week one you have a classified portfolio, named pathfinders, a working toolchain, and a draft principles document. That is more than most federal entities anywhere in the world will have at this point in the timeline.

## The First Pathfinder

Week two starts the first pathfinder. The command sequence is direct: `arckit.requirements` to generate the BR/FR/NFR/INT/DR set against the existing service definition; `arckit.stakeholders` for the stakeholder map; `arckit.risks` for the risk register. Each command reads the existing material, drafts the artefact against a versioned template, applies the Document Control header with your federal classification, and writes it to the project directory as a citation-traceable Markdown file.

Weeks three to five run the heavier commands: `arckit.data-model`, `arckit.integration`, `arckit.research` for vendor and platform evaluation, `arckit.sobc` for the strategic outline business case the federal funding gates require, and `arckit.adr` for each material decision. The `arckit.gov-reuse` agent runs the build-versus-reuse decision against open government code repositories — UK, France, EU, and any UAE national repository as it becomes available — so the Federal Government Guide's "avoid duplication" obligation is satisfied with evidence rather than assertion.

Week six: review with the taskforce. By this point you have a complete artefact set for one service — requirements, stakeholders, risks, data model, integration, vendor evaluation, SOBC, ADRs, all classified, all versioned, all citation-traceable. The artefact set is exactly what the Cabinet's four instruments oblige you to produce, in the form an auditor can follow.

Weeks seven to twelve: the second through fifth pathfinders. Each one runs faster than the previous because the principles are stable, the data model fragments are reusable, and the vendor evaluations cover ground the next pathfinder shares.

By week thirteen you have five pathfinder services with full artefact sets, a configured toolchain, a named team, a defensible budget envelope, and a phasing plan that arithmetically reaches fifty per cent by April 2028. That is what good looks like in the first ninety days.

## What to Tell Your Minister

When your minister asks why this approach will deliver the Cabinet target where the conventional approach will not, the answer is one sentence.

The artefacts that the four Cabinet instruments oblige you to produce are themselves generated by agentic AI, against templates, in your architects' IDEs, with classification and citation traceability built into the output. The same technology the Cabinet has mandated for service delivery is the technology that produces the governance trail behind the service delivery. The architecture-to-engineering headcount ratio that makes a two-year timeline arithmetically possible only works if the architecture artefacts are generated rather than hand-written. They are. That is the lever.

That is the bonus. The toolset that helps you deliver the agentic AI mandate is itself an example of the agentic AI mandate. The artefact in front of your minister is, in a real sense, the demonstration. Once the minister sees that the fifty-page strategic outline business case, the fully-traced requirements specification, and the citation-anchored research document were produced in a working week by one architect with an AI assistant, the conversation about whether the two-year deadline is achievable changes in the room.

That conversation has to happen in your first ninety days. Make sure when it does, you have the artefacts to put on the table.
