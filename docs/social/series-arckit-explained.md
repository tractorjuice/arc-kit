# ArcKit Explained: a 14-day series

<!-- markdownlint-disable MD018 -- hashtag lines at the end of each post are post text, not headings -->

One post a day on the ArcKit LinkedIn page, walking through ArcKit the way an architect uses it: one project, from first command to review, one step a day. The running example is fictional: the Housing Benefits Digital Service at Ashcombe District Council, the project the evals fixtures (`plugins/arckit-claude/evals/fixtures/benefits-portal*`) are built on. Examples in the posts come from those fixtures.

Voice and rules: `SOCIAL.md` (warm "we", lead with what the reader can use, no costs, no mistakes, "GitHub Copilot" in full). Facts come from the README and each command's own description. Every post that shows a document says, or links to something that says, that ArcKit writes drafts for qualified people to review.

**Channels, per the plan in `SOCIAL.md`:**

- **ArcKit page:** every day from 30 September to 13 October, with that day's card (`docs/social/out/explained/slide-N-1080x1350.png`). Day 1 posted on the day; days 2 to 14 scheduled in LinkedIn's scheduler for 08:30.
- **LinkedIn group:** twice a week, a reworded question version (days 1, 5, 9 and 12: 30 September, 4, 8 and 11 October). Group posts can't be scheduled, so they go out on the day. Not daily: 161 members don't want 14 posts in a row.
- **Discord #announcements:** once, on day 1, pointing at the series. It changes nothing for existing users, so no daily posts there.

Links go to `https://arckit.org` pages with `?utm_campaign=arckit-explained&utm_source=linkedin`.

---

## Day 1. What ArcKit is (Wed 30 September)

Most architecture work isn't the thinking. It's writing the thinking down in the shape a review board expects.

ArcKit is a free, open-source toolkit that helps with that part. It adds 76 commands to AI coding assistants such as GitHub Copilot, Claude Code and Gemini CLI. Each command drafts one governance document from a template: principles, requirements, a risk register, a business case, a Secure by Design assessment and many more.

Over the next two weeks we'll walk through it the way you would use it: one project, from the first command to review, one step a day. Our example is fictional: a housing benefits service for Ashcombe District Council.

Everything ArcKit writes is a draft for qualified people to review. It does the drafting; you keep the judgement.

Tomorrow: getting started.

https://arckit.org?utm_campaign=arckit-explained&utm_source=linkedin

#EnterpriseArchitecture #DigitalGovernment #OpenSource

## Day 2. Getting started (Thu 1 October)

Getting started takes a few minutes.

In Claude Code, ArcKit installs as a plugin from its marketplace. For GitHub Copilot, Codex CLI, OpenCode and the others, the `arckit` command-line tool sets up your project.

Then run `/arckit:init`. It creates a `projects/` folder in your repository, with a global area for things every project shares, such as your architecture principles.

Not sure where to begin? `/arckit:start` asks a few questions about your project and suggests which commands to run, and in what order.

Every document ArcKit writes is a Markdown file in your repository, versioned in git alongside everything else. Nothing is sent to us.

Tomorrow: principles, the foundation everything else checks against.

#EnterpriseArchitecture #DigitalGovernment #GovTech

## Day 3. Principles first (Fri 2 October)

Every architecture review eventually asks the same question: does this follow our principles?

So that's where ArcKit starts. `/arckit:principles` drafts your organisation's architecture principles, each with a rationale and its implications, and saves them where every later command can read them.

From then on, the requirements, the design reviews and the assessments all check back against them. When a later document departs from a principle, it says so, rather than leaving it for the review board to spot.

For Ashcombe, that means principles like "citizen-centred, inclusive service" and "security by design" are written down once and tested everywhere.

Tomorrow: who the project is for.

#EnterpriseArchitecture #DigitalGovernment #ArchitecturePrinciples

## Day 4. Stakeholders and what they need (Sat 3 October)

A project that can't say who it's for can't say whether it worked.

`/arckit:stakeholders` maps the people with a stake in the project, what drives each of them, their goals, and the measurable outcomes that would show success.

For Ashcombe's housing benefits service, that means claimants, the caseworkers who process claims, and the Director of Resources, who has a savings target to meet. They agree on the what, faster and complete online claims, and differ on the how, which is exactly what this step is for surfacing.

Those goals become the thread that the rest of the work hangs from. Tomorrow, requirements pick them up and trace back to them.

#EnterpriseArchitecture #DigitalGovernment #UserCentredDesign

## Day 5. Requirements you can trace (Sun 4 October)

Requirements are where most projects either get specific or get vague.

`/arckit:requirements` drafts them in five kinds: business (BR), functional (FR), non-functional (NFR), integration (INT) and data (DR). Every requirement gets a priority, a rationale and acceptance criteria, so a tester knows what "done" means.

Each one traces back to a stakeholder goal from yesterday, so when someone asks "why do we need this?", the answer is already written down.

For Ashcombe, that's everything from complete online claims with save-and-resume to response times and accessibility.

Tomorrow: what could go wrong.

#EnterpriseArchitecture #DigitalGovernment #Requirements

## Day 6. A risk register in the Orange Book's shape (Mon 5 October)

Every project has risks. The useful question is whether they're written down in a form your organisation recognises.

`/arckit:risk` drafts a risk register following HM Treasury's Orange Book principles: each risk scored for likelihood and impact before and after controls, with an owner and a response, and measured against your organisation's risk appetite if you've recorded one.

It reads your requirements and stakeholders first, so the risks are about this project, not a generic list.

Tomorrow: seeing the landscape before deciding what to build.

#EnterpriseArchitecture #DigitalGovernment #RiskManagement

## Day 7. Wardley maps for build or buy (Tue 6 October)

Before deciding what to build, it helps to see what's already a commodity.

`/arckit:wardley` drafts a Wardley map of your project: the components users need, how they depend on each other, and how mature each one is. Mature components are candidates to buy or reuse. The novel ones are where your own effort belongs.

The map is written in a text format you can open and adjust at create.wardleymaps.ai. Follow-on commands add the climate, doctrine and gameplay views.

For Ashcombe, GOV.UK Notify, the GOV.UK Design System and the payment run are marked to buy or reuse; the claim record and the hand-off between systems are worth building. The map marks those as recommendations: the council's design authority decides.

Tomorrow: researching what's out there.

#EnterpriseArchitecture #WardleyMaps #DigitalGovernment

## Day 8. Research, with sources (Wed 7 October)

Once you know what to buy, the next question is: from whom?

`/arckit:research` looks at the market for each capability your requirements need: products, open-source options and UK government platforms, with a build-or-buy view for each. Where it matters, it notes G-Cloud and Digital Outcomes routes, and `/arckit:gcloud-search` searches the Digital Marketplace directly.

Every claim it makes is cited to its source, so you can check it before it goes anywhere near a decision.

Tomorrow: making the case.

#EnterpriseArchitecture #DigitalGovernment #Procurement

## Day 9. A business case in the Green Book's five cases (Thu 8 October)

A business case is where the architecture meets the money, and it has to speak the Treasury's language.

`/arckit:sobc` drafts a Strategic Outline Business Case using the Green Book's five-case model: strategic, economic, commercial, financial and management. The options include doing nothing, and each option carries its own risks.

It builds on what you've already written, the stakeholder goals, the requirements and the research, so the case and the architecture tell the same story.

Tomorrow: the data, and protecting it.

#EnterpriseArchitecture #DigitalGovernment #GreenBook

## Day 10. Data model and DPIA (Fri 9 October)

A benefits service holds some of the most sensitive data a council has, so the data needs designing as carefully as the service.

`/arckit:data-model` drafts the entities, their relationships and a diagram, with UK GDPR considerations and data governance for each.

`/arckit:dpia` then drafts the Data Protection Impact Assessment that UK GDPR Article 35 requires for high-risk processing, drawing on that model.

Both are drafts for your data protection officer to review. They give that review a head start.

Tomorrow: diagrams and decisions.

#EnterpriseArchitecture #DataProtection #DigitalGovernment

## Day 11. Diagrams and decisions (Sat 10 October)

Two things every design review wants to see: the picture, and why you chose it.

`/arckit:diagram` draws architecture diagrams in Mermaid or PlantUML C4, as text in your repository, so they change alongside the design instead of drifting away from it.

`/arckit:adr` records each significant decision as an Architecture Decision Record: the options considered, the one chosen, and the reasoning, traced to the requirements it serves.

Six months later, when someone asks why the service uses a particular integration pattern, the answer is still there.

Tomorrow: security and the Technology Code of Practice.

#EnterpriseArchitecture #DigitalGovernment #SoftwareArchitecture

## Day 12. Secure by Design and the Technology Code of Practice (Sun 11 October)

Two assessments almost every UK public sector project meets.

`/arckit:secure` drafts a Secure by Design assessment for your project, with the security actions it needs and an owner for each.

`/arckit:tcop` reviews the project against all 13 points of the Technology Code of Practice, drawing on the documents you've already produced.

Neither replaces your security team or your assessors. Both mean they start from a structured draft, not a blank page.

Tomorrow: joining it all up.

#EnterpriseArchitecture #SecureByDesign #DigitalGovernment

## Day 13. Traceability, and keeping it healthy (Mon 12 October)

By now Ashcombe's project has a dozen documents. The value is in how they connect.

`/arckit:traceability` builds a matrix from requirements through to design and tests, and shows any requirement with nothing behind it.

`/arckit:health` scans your projects for research that has gone stale, decisions left open, review conditions not yet closed, and gaps in traceability.

And when the service assessment approaches, `/arckit:service-assessment` checks your evidence against all 14 points of the GDS Service Standard and lists the gaps.

Tomorrow: showing your working.

#EnterpriseArchitecture #DigitalGovernment #ServiceStandard

## Day 14. Show your working (Tue 13 October)

Two weeks, one project, a full set of governance documents. The last step is making them easy to trust.

Every ArcKit document cites its sources inline, so a reviewer can follow any claim back to where it came from. Each one also records how it was made: which command, which model and when.

`/arckit:pages` then turns the project into a documentation site with a governance dashboard, so the whole team can read the work without opening a repository.

ArcKit is free and open source. If you'd like to try it on your own project, start here:
https://arckit.org?utm_campaign=arckit-explained&utm_source=linkedin

Thank you for following along. What would you like us to walk through next?

#EnterpriseArchitecture #DigitalGovernment #OpenSource

---

## LinkedIn group versions (days 1, 5, 9 and 12)

Question voice, no hashtags, posted the same day as the page post.

**Day 1.** How much of your architecture time goes on writing things down in the shape a review board expects? We're spending the next two weeks walking through ArcKit, a free, open-source toolkit that drafts governance documents from templates inside AI coding assistants such as GitHub Copilot, one step a day on a fictional council project. We'd like to hear which documents take your team the longest.

**Day 5.** How does your team make sure every requirement traces back to something a stakeholder actually needs? In ArcKit, each requirement carries a priority, a rationale and acceptance criteria, and points back to a stakeholder goal. We're curious how others handle this, especially on long-running programmes.

**Day 9.** Does your business case and your architecture tell the same story? ArcKit drafts the Strategic Outline Business Case from the requirements and research already written, so the options line up with the design. How do you keep the two in step?

**Day 12.** Which assessment does your team find hardest to prepare for: Secure by Design, the Technology Code of Practice, or the Service Standard? ArcKit drafts the first two and checks readiness for the third. We'd like to know where the effort really goes.

---

## Discord (day 1 only)

> 📝 **New series: ArcKit Explained**
> For the next two weeks, one post a day on the ArcKit LinkedIn page, walking through ArcKit on a fictional council project, from the first command to review.
> Questions as it goes: #show-your-working
> <https://www.linkedin.com/company/arckit-org/>

---

## Next run: From the Articles (outline, copy to follow)

Starts on 14 October, the day after *ArcKit Explained* ends, one post a day on the page, same voice. Each post takes one useful idea from one article and links to its share page (`https://arckit.org/share/<slug>.html?utm_campaign=from-the-articles&utm_source=linkedin`), which carries the article's own preview image. Articles that are mainly opinion about other organisations, or about pricing, are left out; so is anything about the private G-Cloud supplier overlay.

| Day | Article | The idea for users |
|---|---|---|
| 1 | `2026-04-30-toolkit-drafts-architect-judges` | ArcKit drafts; the architect judges. What that split looks like in practice |
| 2 | `2026-03-23-government-code-discovery-commands` | Check what government has already built before you build it |
| 3 | `2026-04-22-wardley-commands-walkthrough` | The five Wardley commands, and when to run each |
| 4 | `2026-05-19-wardley-maps-mermaid-github` | Your Wardley maps belong in git, next to the design |
| 5 | `2026-06-02-uk-tenders-procurement-intelligence` | Ground procurement decisions in real award data |
| 6 | `2026-04-07-v464-grants-command-funding-research` | Find UK funding for a public sector project |
| 7 | `2026-05-03-build-harness-parallel-architecture-generation` | Build a full set of architecture documents in one session |
| 8 | `2026-09-03-arckit-v6-14-enforce-ask-measure` | What ArcKit enforces, what it asks, and what it measures |
| 9 | `2026-05-28-v540-uk-nhs-clinical-safety-overlay` | NHS clinical safety, as a sector overlay |
| 10 | `2026-05-27-v530-uk-finance-payments-overlay` | UK payments, as a sector overlay |
| 11 | `2026-05-18-arckit-v5-plugin-split` | Install only what you need: core plus overlays for your jurisdiction |
| 12 | `2026-07-01-arckit-togaf-adm` | TOGAF's ADM as a governed workflow |
| 13 | `2026-06-30-arckit-agent-architecture` | Governed design for AI agents |
| 14 | `2026-09-23-show-your-working` | Using ArcKit on real work? Tell us (the fortnightly adopter ask) |
