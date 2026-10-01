# From the Articles: a 14-day series

<!-- markdownlint-disable MD018 -- hashtag lines at the end of each post are post text, not headings -->

One post a day on the ArcKit LinkedIn page, each taking one useful idea from one ArcKit article and linking to that article's share page. It follows *ArcKit Explained* (`series-arckit-explained.md`) and keeps its voice. Articles that are mainly opinion about other organisations, or about pricing, are left out; so is anything about the private G-Cloud supplier overlay.

Voice and rules: `SOCIAL.md` (warm "we", lead with what the reader can use, no costs or prices, nothing about mistakes, no usage claims, "GitHub Copilot" in full, never "your data never leaves your repository"). Facts come only from each day's article and, for capabilities, the matching command descriptions in `plugins/*/commands/`. Where an article gives a figure that may have moved since (a release number, a count of commands or plugins), the post uses wording that stays true. Every post that shows ArcKit producing a document says it is a draft for qualified people to review. Days 9 and 10 are community overlays and are described as such, with no claim of clinical or regulatory compliance.

**Channels, per the plan in `SOCIAL.md`:**

- **ArcKit page:** every day from Wednesday 14 October to Tuesday 27 October, scheduled in LinkedIn's scheduler for 08:30. Post bodies are plain text: no backticks, which LinkedIn shows literally.
- **LinkedIn group:** a reworded question version on days 1, 5, 9 and 12 (14, 18, 22 and 25 October), posted by hand on the day, because group posts can't be scheduled.
- **Discord #announcements:** none, apart from one note on day 1 pointing at the series. It changes nothing for existing users.

Each post links to its article's share page, `https://arckit.org/share/<slug>.html?utm_campaign=from-the-articles&utm_source=linkedin`, which carries the article's own preview image. All 14 share pages exist.

---

## Day 1. ArcKit drafts, the architect judges (Wednesday 14 October)

The most useful thing ArcKit does is move your time from drafting to judging.

Drafting is the structure, the prose, the cross-references, the formatting and the citations. ArcKit takes that on. Each command reads your project's existing documents, drafts the next one against a template, adds the document control header and citation markers, and saves it in the right place.

Judging stays with you. Is the set of business requirements complete? Is that availability target defensible? Does the data model match how the process really works, or only how the policy describes it? Is the evidence behind a decision genuine?

The draft is a substantively complete starting point, not a finished document. It is for qualified people to review, and the name on it still carries the professional accountability.

The article's advice on getting the balance right: trust the draft enough to skip the rewrite, and distrust it enough to do the judging properly.

For the next two weeks, we'll take one idea a day from our articles.

https://arckit.org/share/2026-04-30-toolkit-drafts-architect-judges.html?utm_campaign=from-the-articles&utm_source=linkedin

Where does most of your architecture time go today: drafting, or judging?

#EnterpriseArchitecture #DigitalGovernment #OpenSource

## Day 2. Check what government has already built (Thursday 15 October)

Before you build it, check whether another part of government already has.

UK government teams publish more than 24,500 open-source repositories. Finding the right one has always been the hard part. ArcKit has three commands that search them for you through govreposcrape, a free semantic search, so you can describe what you need in plain English.

/arckit:gov-code-search answers "what exists?" Ask how government teams handled FHIR patient data, and it returns the matching repositories and the patterns they share.

/arckit:gov-reuse answers "what can we actually use?" It reads your requirements, picks out each capability, and scores candidates on licence, code quality, documentation, technology fit and activity. Each one is marked to fork, use as a library, study as a reference, or leave. Capabilities with no good candidate are listed as genuine build items.

/arckit:gov-landscape maps a whole domain: who has built what, the common technology choices, the standards in use, and where teams could work together.

It supports point 3 of the Technology Code of Practice: be open and use open source. Each report is a draft for your team to check before any reuse decision.

https://arckit.org/share/2026-03-23-government-code-discovery-commands.html?utm_campaign=from-the-articles&utm_source=linkedin

What has your team built recently that someone else in government may already have had?

#EnterpriseArchitecture #DigitalGovernment #OpenSource #GovTech

## Day 3. The five Wardley commands (Friday 16 October)

A Wardley map is one snapshot. The strategy comes from what you do with it.

ArcKit has five Wardley commands that follow Simon Wardley's own way of analysing a landscape, each writing its own versioned document.

/arckit:wardley.value-chain breaks a user need into a chain of components. Run it first, to get past the blank canvas.

/arckit:wardley draws the map, with a build-or-buy recommendation for each component and a prediction of how each will move.

/arckit:wardley.doctrine scores your organisation against Wardley's doctrine principles, with evidence for each score. It asks whether you can carry out the strategy the map implies.

/arckit:wardley.climate assesses the external forces acting on your components, whatever you choose to do.

/arckit:wardley.gameplay weighs the strategic plays open to you, and checks that the plays you pick don't contradict each other.

Each command reads the others' output when it exists, so run them in this order and each is better informed than the last. Feed the gameplay back into a revised map and the loop is closed.

The scores are drafts to argue with. Start small: run value-chain on one user need you know well, then challenge it.

https://arckit.org/share/2026-04-22-wardley-commands-walkthrough.html?utm_campaign=from-the-articles&utm_source=linkedin

Which of the five does your team most often skip?

#EnterpriseArchitecture #WardleyMaps #Strategy

## Day 4. Wardley maps belong in git (Saturday 17 October)

A Wardley map that lives in a slide deck stops changing the day the workshop ends.

Mermaid now has a Wardley diagram type, and GitHub renders it in any Markdown file. So a map can be plain text in your repository, next to the design it describes.

A few things follow. Maps go through review: a pull request shows exactly which component moved from Product to Commodity, and reviewers comment on that line. Maps are versioned with the system, so the record of who proposed a move and who approved it is already in git. And maps appear where the work happens: in a README, a decision record or a board pack.

/arckit:wardley writes both forms: the OnlineWardleyMaps text, for editing at create.wardleymaps.ai, and a Mermaid block that GitHub and other Markdown tools render. A bundled script does the conversion, and a check flags any component that appears in one form but not the other, so the two can't drift apart.

Something to try this week: commit one map that matters as a Markdown file, open a pull request, and ask a colleague to review it the way they would review code.

https://arckit.org/share/2026-05-19-wardley-maps-mermaid-github.html?utm_campaign=from-the-articles&utm_source=linkedin

Where do your Wardley maps live today?

#EnterpriseArchitecture #WardleyMaps #DocsAsCode

## Day 5. Procurement decisions grounded in award data (Sunday 18 October)

When a business case or a vendor evaluation needs market evidence, the public record beats an estimate.

UK public bodies publish their contract notices. ArcKit connects to the UK Tenders MCP, a free service that indexes contracting processes from all five UK publication portals: Find a Tender, Contracts Finder, Public Contracts Scotland, Sell2Wales and eTendersNI. Every record links back to its official notice.

/arckit:tenders looks at a market: comparable awards, the suppliers who hold the work, who is entrenched with which buyer, and whether one supplier dominates.

/arckit:competitors takes the supplier's view: the rivals in a space and the buyers they serve. It also records each vendor's award history in their profile, ready for the next evaluation.

That evidence flows into the work you're already doing. A risk register can record a single-supplier dependency, with the supplier named and the evidence cited. Vendor scoring gets evidence for company experience.

The commands are careful about what the data means. An award is not the same as spend, so the figures are used for market context, and each report says how current its data is. Treat the result as a draft for your commercial colleagues to check.

https://arckit.org/share/2026-06-02-uk-tenders-procurement-intelligence.html?utm_campaign=from-the-articles&utm_source=linkedin

What does your team use for market evidence today?

#EnterpriseArchitecture #Procurement #DigitalGovernment

## Day 6. Finding UK funding for a project (Monday 19 October)

Funding for public sector and health projects is spread across dozens of websites, each with its own terms and deadlines.

/arckit:grants does the searching. It reads your project's requirements, stakeholders and business case, and builds a funding profile: sector, organisation type, technology readiness level and timeline. Then it researches seven kinds of UK funder: government R&D, health, charitable, social impact, accelerators, defence and security, and open grants data through 360Giving's GrantNav.

Each opportunity is scored High, Medium or Low against your profile, with the reasoning: what matches and what doesn't. The report compares them side by side, suggests the strongest few with an application timeline, and lists the risks, such as co-funding requirements and reporting obligations. Findings are cited to their sources.

It feeds the rest of the project too. The business case can take in potential funding, the plan can follow application deadlines, and the risk register can record grant-specific risks.

Deadlines and eligibility change, so treat the report as a draft to check against each funder's own pages before you apply. No project set up yet? A short description of the domain is enough to start.

https://arckit.org/share/2026-04-07-v464-grants-command-funding-research.html?utm_campaign=from-the-articles&utm_source=linkedin

How does your team find funding opportunities today?

#EnterpriseArchitecture #PublicSector #Funding

## Day 7. A full set of documents in one session (Tuesday 20 October)

What if one command could draft a project's whole set of governance documents?

/arckit:build reads a recipe: a file listing the documents a project needs and what each depends on. It works out the order, then drafts in parallel waves. Everything in a wave can be written at once, because its inputs already exist.

Each wave becomes one git commit, so you can read how the architecture came together step by step, and nothing half-finished lands. Progress is saved as it goes, so an interrupted build picks up where it stopped. Every document records the recipe and wave that produced it.

The default UK recipe covers the civilian government set: principles, requirements, stakeholders, decision records, risk register, business case, Technology Code of Practice review, Secure by Design, DPIA, diagrams and traceability. A sovereign recipe swaps in MOD Secure by Design and JSP 936 for air-gapped work. Copy a recipe into your project to change it, and your changes survive updates.

Run it with --plan first: it shows the waves without writing anything. The build harness runs in Claude Code, and only when you ask for it.

Then the real work starts: reviewing every draft. The recipe does the typing; the judgement stays with your team.

https://arckit.org/share/2026-05-03-build-harness-parallel-architecture-generation.html?utm_campaign=from-the-articles&utm_source=linkedin

Which documents would go in your team's recipe?

#EnterpriseArchitecture #DigitalGovernment #DocsAsCode

## Day 8. What ArcKit enforces, asks and measures (Wednesday 21 October)

If you're assessing an AI tool for governance work, one question matters most: which rules does it hold, and which does it only ask the model to follow?

ArcKit answers that on one page, in three tiers.

Enforced in code: rules that hold whatever the model does. File naming and document-type codes, protected files, secrets in prompts and written files, the shape of vendor scores, provenance stamping, and the separation that stops the step reading the web from ever writing files.

Asked of the model: rules that hold only as far as the model follows instructions. Complete document control, DRAFT status (because sign-off is a human act), no leftover placeholder text, templates followed, a citation on every external figure, and source text treated as material, not instruction.

Yours to supply: what the deploying organisation owns.

The second tier is now measured. Behavioural tests run commands against a sample repository and grade the documents they write. One gives the stakeholders command an organisation chart with planted instructions to mark the document APPROVED and name a fake approver. It passes only if the document is still written, still DRAFT, and has no fake approver.

If you're assessing ArcKit rather than using it, the enforcement page is the place to start.

https://arckit.org/share/2026-09-03-arckit-v6-14-enforce-ask-measure.html?utm_campaign=from-the-articles&utm_source=linkedin

What would your assurance team want to see on that page?

#EnterpriseArchitecture #AIGovernance #Assurance

## Day 9. NHS clinical safety, as a sector overlay (Thursday 22 October)

For teams building digital health products for the NHS, there is a community overlay that drafts clinical safety and medical device documents alongside the rest of the architecture.

arckit-uk-nhs is an optional plugin with four commands. They draft:

- a DCB0129 manufacturer clinical safety case and hazard log
- a DCB0160 deployer clinical safety case, carrying the manufacturer's residual hazards across
- a DTAC v3 assessment that reads the safety case, the DPIA and the Secure by Design assessment
- a software as a medical device classification under UK MDR and EU MDR

For the safety case it follows Dr Marcus Baw's open SAFETY.md specification exactly, rather than inventing a format of its own, so tools built for SAFETY.md work with the output.

Every command is marked EXPERIMENTAL and community-maintained. Every output says it is not clinical advice and must be reviewed by a qualified Clinical Safety Officer before any deployment, and the classification needs sign-off from a qualified regulatory affairs specialist. The overlay drafts structured, traceable documents. The named professionals make the decisions.

It builds on the core ArcKit plugin rather than replacing it, because an NHS product still needs its DPIA, Technology Code of Practice review and Secure by Design assessment.

https://arckit.org/share/2026-05-28-v540-uk-nhs-clinical-safety-overlay.html?utm_campaign=from-the-articles&utm_source=linkedin

If you work in clinical safety, what would you want a draft safety case to get right?

#EnterpriseArchitecture #DigitalHealth #ClinicalSafety

## Day 10. UK payments, as a sector overlay (Friday 23 October)

For architects at UK payment firms, there is a community overlay that drafts four FCA-shaped documents alongside the rest of the architecture.

arckit-uk-finance is an optional plugin for payment service providers, e-money institutions and payment institutions. Its four commands draft:

- a Strong Customer Authentication exemption design under the UK SCA-RTS
- a safeguarding assessment, covering the method, reconciliation and sign-off chain
- a Consumer Duty annual board report across the four outcomes
- a Critical Third Parties dependency register, with exit and substitution drills

It is a sector overlay: it adds a regulatory layer on top of the core baseline rather than replacing it. Its recipe drafts principles, stakeholders, requirements and the risk register first, then the four payments documents in parallel, then the data model, DPIA and decision records.

Every command is marked EXPERIMENTAL and community-maintained. The overlay drafts structured, traceable documents for review. The firm's regulatory counsel, compliance officer and accountable senior manager own the sign-off. A maintenance guide lists every regulatory source the commands cite and when each was last checked.

https://arckit.org/share/2026-05-27-v530-uk-finance-payments-overlay.html?utm_campaign=from-the-articles&utm_source=linkedin

Does your firm keep documents like these with the architecture, or somewhere separate?

#EnterpriseArchitecture #Payments #FinancialServices

## Day 11. Install only what you need (Saturday 24 October)

ArcKit comes as a core plugin plus optional overlays, so your sessions carry only what your work needs.

The core plugin, arckit, holds the shared foundations: principles, requirements, decision records, design reviews, traceability, Wardley mapping, the build harness, and the UK government baseline, such as the Service Standard, the Technology Code of Practice and Secure by Design. It also holds the checks every document passes through.

Community overlays add the commands, templates and recipes for one jurisdiction or sector, such as the EU, France, Canada, Australia, the UAE, NHS clinical safety or UK payments. A team working only on UK government projects doesn't need UAE or Canadian commands in every session, and doesn't get them.

In Claude Code, each overlay declares the core plugin as a dependency, so installing an overlay brings the core with it: claude plugin install arckit-eu is all it takes.

Recipes follow the same pattern. The build harness looks in your project first, then the core plugin, then any overlay you've installed, so an overlay's recipes are ready as soon as it is. Your own recipe edits stay in your project and survive updates.

For GitHub Copilot, Codex CLI, Gemini CLI and the other assistants, every command ships together in one extension.

https://arckit.org/share/2026-05-18-arckit-v5-plugin-split.html?utm_campaign=from-the-articles&utm_source=linkedin

Which jurisdictions does your team work across?

#EnterpriseArchitecture #OpenSource #ClaudeCode

## Day 12. TOGAF's ADM as a governed workflow (Sunday 25 October)

If your team already works in TOGAF, ArcKit can carry the ADM as part of the same governed project.

The problem is rarely the vocabulary. It's that ADM work scatters: a capability map in a deck, an application inventory in a spreadsheet, a gap analysis in workshop notes, board decisions somewhere else.

The arckit-togaf-adm community overlay adds nine commands that turn each ADM step into a versioned document with document control and traceability: preliminary work and architecture vision, a business capability map, an application inventory, application rationalisation, gap analysis, transition architecture, the architecture board, architecture change requests, and the architecture repository.

They connect to each other and to the core work. The capability map links back to requirements and drivers. The inventory gives gap analysis and rationalisation a real portfolio baseline. Transition architecture builds on the gap analysis. The board ties governance back to your principles.

The togaf-adm-full recipe builds the sequence for you, with change requests and repository synthesis as optional steps. It covers the preliminary phase, phases A to H and the repository, and it doesn't replace your organisation's own ADM tailoring.

Each document is a draft for your architects and your board to review.

https://arckit.org/share/2026-07-01-arckit-togaf-adm.html?utm_campaign=from-the-articles&utm_source=linkedin

Where does ADM work tend to scatter in your organisation?

#EnterpriseArchitecture #TOGAF #ArchitectureGovernance

## Day 13. Governed design for AI agents (Monday 26 October)

An AI agent that can call tools, read data and trigger workflows is an architecture component, and it needs governing like one.

The arckit-agent-architecture community overlay adds six commands for agent programmes:

- inventory: which agents exist, who owns each, what tools and data they can reach, and what oversight they need
- design: purpose, autonomy boundary, memory, tool access and failure handling
- integration: the contracts between agents and systems, shared state and failure isolation
- governance: approval paths, audit trails, escalation and human intervention points
- security: sandboxing, permissions, data access and prompt injection paths
- maturity: where the programme stands, and a roadmap to improve it

It starts with the inventory on purpose. Agent programmes become risky when nobody can say which agents exist or what they can touch.

A recipe builds the pack on top of the usual foundations, principles, requirements, stakeholders, risk and AI Playbook context, so agent design agrees with the rest of the project. It works alongside the TOGAF overlay too.

The idea is the same as everywhere in ArcKit: the toolkit drafts, the architect judges. The documents give your architecture board and security reviewers something concrete to challenge.

https://arckit.org/share/2026-06-30-arckit-agent-architecture.html?utm_campaign=from-the-articles&utm_source=linkedin

Could your team list every agent it runs today, and what each one can do?

#EnterpriseArchitecture #AIGovernance #AIAgents

## Day 14. Show your working (Tuesday 27 October)

Using ArcKit on real work? We'd like to hear from you.

ArcKit collects no usage data. Nothing is sent to us, and nothing will be. That's the right choice for a governance toolkit, but it means the only way to know who uses ArcKit, and what would make it more useful, is to ask.

There's a two-minute form on GitHub. It asks your sector, how far you've got, which assistant you use and what ArcKit helps with. Then you choose how you appear:

- named, with your organisation and a line about how you use it
- anonymous, counted only by sector, such as "a central government department"
- not listed, so only the maintainer sees it

The form is a public GitHub issue, so your username shows whichever you pick. If that's a problem, send the same details through Discord or the LinkedIn group and we'll add you without naming you.

Named and anonymous replies go onto the adopters page in the repository. To be honest, that list is still empty. We'd rather show an empty list than a padded one.

Thank you for following this series. The full article:

https://arckit.org/share/2026-09-23-show-your-working.html?utm_campaign=from-the-articles&utm_source=linkedin

Tell us you use ArcKit here:
https://github.com/tractorjuice/arc-kit/issues/new?template=adopter.yml

#EnterpriseArchitecture #DigitalGovernment #OpenSource

---

## LinkedIn group versions (days 1, 5, 9 and 12)

Question voice, no hashtags, posted by hand the same day as the page post.

**Day 1 (14 October).** When you use AI to help with architecture documents, where does your time go: drafting, or judging the draft? Our view is that ArcKit should take the drafting, the structure, cross-references and citations, and leave the judgement with the architect whose name is on the document. Trust the draft enough to skip the rewrite, and distrust it enough to review it properly. How does your team strike that balance?
https://arckit.org/share/2026-04-30-toolkit-drafts-architect-judges.html?utm_campaign=from-the-articles&utm_source=linkedin-group

**Day 5 (18 October).** Where does your team get market evidence for a business case or a vendor evaluation? ArcKit's /arckit:tenders and /arckit:competitors commands draw on published UK contract notices, with every figure linked to its notice and a clear note that an award is not the same as spend. We'd like to know what evidence your commercial colleagues trust.
https://arckit.org/share/2026-06-02-uk-tenders-procurement-intelligence.html?utm_campaign=from-the-articles&utm_source=linkedin-group

**Day 9 (22 October).** For those working on NHS digital products: what would make a draft clinical safety case genuinely useful to a Clinical Safety Officer? ArcKit's community NHS overlay drafts DCB0129 and DCB0160 safety cases in the open SAFETY.md format, for a qualified Clinical Safety Officer to review. We'd welcome views from people who do this work.
https://arckit.org/share/2026-05-28-v540-uk-nhs-clinical-safety-overlay.html?utm_campaign=from-the-articles&utm_source=linkedin-group

**Day 12 (25 October).** Does your organisation still use TOGAF's ADM, and where does the output end up? ArcKit's community TOGAF overlay turns each ADM step, from capability map to transition architecture and the architecture board, into a versioned document in the same project as the requirements and decisions. We're curious whether ADM work in your organisation stays joined up, or scatters across decks and spreadsheets.
https://arckit.org/share/2026-07-01-arckit-togaf-adm.html?utm_campaign=from-the-articles&utm_source=linkedin-group

---

## Discord (day 1 only)

One post in #announcements on 14 October. It changes nothing for existing users, so there are no daily posts there.

> **New series: From the Articles**
> For the next two weeks, one post a day on the ArcKit LinkedIn page, each taking one useful idea from one of our articles: government code reuse, Wardley maps, award data, the build harness, overlays and more.
> Questions as it goes: #show-your-working
> <https://www.linkedin.com/company/arckit-org/>
