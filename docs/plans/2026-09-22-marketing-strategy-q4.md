# ArcKit Marketing Strategy — Q4 2026

> **Status:** draft for maintainer review. Messaging revised on 23 September after the competitive brief (`2026-09-23-competitive-brief.md`). Built with the marketing plugin's campaign-plan method, from the September traction report (`reports/traction/2026-09-01-traction.md`), `docs/INVESTOR-REPORT.md`, and the article archive.
> **Window:** 1 October – 31 December 2026 (13 weeks). **The launch was brought forward to 23 September**: the adopter form, `ADOPTERS.md`, the landing page and the launch article all went live that day, so the prep-week and week-1 rows below are done.
> **Budget:** close to zero. Owned and earned channels only. The real constraint is maintainer time, budgeted at about 6 hours a week.

---

## 1. Campaign Overview

**Campaign name:** *Show Your Working*. Assessors ask departments to show their working, and ArcKit is how you show it. The name also asks users to show *us* that they use it.

**Summary:** Turn ArcKit's anonymous UK public-sector usage into named, citable adopters and published case studies, so "reportedly used across UK Government and NHS" becomes "used by these organisations, and here is what they did with it".

**Why this goal, now:**

- **Stars have stopped being the story.** 2,211 stars and 279 forks, but the rate has fallen from ~221/day at the April trending peak to ~3/day, and the traction report expects 1–2/day in September. Growth moves when releases ship, not through organic discovery.
- **The biggest credibility gap is verification.** The investor report's watch-items are "used across UK Government and NHS is third-party reported" and "no named reference customers". Every downstream option (grants, support contracts, contributors, a second trending moment) is easier with named adopters.
- **ArcKit deliberately collects no telemetry.** So we cannot count users from the product. They have to be *asked*, and that is the campaign.

**Primary objective (SMART):** By 31 December 2026, **10 organisations publicly confirmed as ArcKit users** (at least 6 of them UK public sector) and **3 published case studies**, at least one co-published on a department or NHS blog.

**Secondary objectives:**

1. Build a repeatable adoption funnel: adopter sign-up → office hours → pilot workshop → case study.
2. Collect 25 adopter submissions, named or anonymous, to use as a qualitative usage baseline.
3. Keep the star rate at or above 3/day without a release spike, as a sign of organic discovery.

---

## 2. Target Audience

### Primary: UK public sector architects

> A **lead, principal or enterprise architect (or Technical Design Authority member) in a central department, arm's-length body, NHS organisation or MOD** who is struggling with **the documentation load of spend controls, service assessments, TCoP reviews and Secure by Design**, and is looking for **a way to produce assessor-ready evidence faster without handing governance to an unaccountable AI**. They typically discover tools through **peers in the cross-government architecture community, LinkedIn and GDS/department blogs**, and care most about **defensibility, security classification and not creating a procurement problem**.

**Pain points and motivations:**

| Pain | What ArcKit offers |
|------|-------------------|
| Weeks of drafting before a spend-control or service assessment | 75 commands that generate TCoP, Service Standard, Secure by Design, DPIA, SOBC and Orange Book artefacts from templates assessors recognise |
| Documents drift apart and traceability breaks | One traceability chain (stakeholders → requirements → design → stories), plus `/arckit:health` and `/arckit:traceability` |
| Wary of AI output in formal governance | Citation traceability, provenance stamping, hook-enforced gates, and a public statement of what is enforced versus only requested (`ENFORCEMENT.md`) |
| Can't buy new tools without a procurement exercise | MIT licensed and free. Nothing new to buy *if* the team already has an approved AI coding assistant (GitHub Copilot, not Microsoft 365 Copilot) |
| Already paid £80k–£430k for an EA repository (Bizzdesign, Ardoq, LeanIX) | Works alongside it. The EA tool holds the inventory, and ArcKit produces the assessment evidence from it |
| Already using Microsoft 365 Copilot or ChatGPT with ad-hoc prompts | The same kind of AI, with templates, citations, traceability and provenance, so the output survives review |
| Classification and data-handling worries | Nothing phones home, a `default_classification` setting, secret-detection and file-protection hooks, and every artefact is kept in your repo (prompts still go to the model provider) |

**Buying stage:** mostly *consideration*. Many have heard of ArcKit or starred it, but haven't run it on a real project or told anyone they have.

**Where they spend time:** LinkedIn; the cross-government architecture community of practice (show-and-tells, Slack); UK Government Digital Slack; GDS, CDDO and department digital blogs; Digital Leaders, techUK and Think Digital events; the UK Wardley mapping community (Map Camp).

### Secondary: G-Cloud and DOS suppliers and consultancies

Suppliers who sell architecture and assurance work *to* government. They feel the same pain on the delivery side, they talk about their tooling in public more readily than civil servants do, and the `arckit-uk-gcloud` overlay and `arckit-fde` plugin are built for them. They make easier early case studies while public-sector ones clear comms sign-off.

---

## 3. Key Messages

**Core message** (revised after the competitive brief):
> **Show your working. ArcKit gives your AI coding assistant the UK templates, traceability and checks to produce governance evidence you can defend in a review, with every claim cited and every artefact kept in your own repository.**

Two phrases from the first draft are retired because a security reviewer would fail them. "The AI assistant you already use" is untrue for most civil servants: their Copilot is the Microsoft 365 one, where ArcKit doesn't run. And "never leaves your repository" overclaims, because prompts go to the model provider.

| # | Supporting message | Pain it answers | Proof points |
|---|-------------------|-----------------|--------------|
| 1 | **Same AI, with its working shown.** Plain Copilot or ChatGPT prompts give you plausible prose. ArcKit gives the AI templates, cites every claim, traces requirements through to design, and stamps how each document was made. | The real competitor: ad-hoc prompting (HMRC has 32,000 M365 Copilot licences, MoJ has 2,500 ChatGPT Enterprise seats) | `ENFORCEMENT.md`, citation markers, provenance, behavioural evals. AI Playbook principles 4 and 10 (human control, assurance) |
| 2 | **Speaks the assessor's language.** TCoP, Service Standard, NCSC CAF, Secure by Design, Green and Orange Book, G-Cloud and DOS are built in. No EA platform claims this. | Drafting load | 75 commands, 70+ templates, 22 public test repos modelled on NHS, HMRC, MOD, ONS and Cabinet Office scenarios |
| 3 | **Nothing new to buy, nothing sent to us.** Free and MIT licensed, runs in eight AI coding assistants, and collects no data. Prompts go only to the model provider you've already approved, and research commands query public sources. | Procurement and data-handling risk | Nine distribution formats, no telemetry by design, honest data-handling FAQ on the landing page |
| 4 | **Works alongside your EA repository.** Bizzdesign, Ardoq or LeanIX holds the inventory. ArcKit turns it into assessment evidence, versioned in git. | "We already bought an EA tool" (Bizzdesign alone: Ofgem, FCA, NHS Property Services, MCA) | Reads exports as external source material. Rewritten README comparison |
| 5 | **Built in the open, with public servants.** Overlays for NHS clinical safety, UK Finance, G-Cloud suppliers, and nine other jurisdictions, several contributed by practitioners. | "Is this maintained? Who else uses it?" | 100+ releases, 8 external PRs merged in August, `umag`'s NL and EU overlays, `ADOPTERS.md` |

Always write "GitHub Copilot" in full. Never write "Copilot" alone.

**Anchor asset:** a side-by-side comparison of one TCoP review produced by a plain prompt and by ArcKit, on the same public test project, marked up for citations, gaps and traceability. It carries message 1 better than any claim can.

**Channel variations:**

- **LinkedIn:** first person and practical, leading with a single artefact ("This SOBC took 20 minutes. Here's what I still had to fix.").
- **Community show-and-tells:** a live demo on a public test repo, ending with an ask for adopters.
- **Department blogs:** the adopter's voice, not ArcKit's. Their problem, what they did, what changed. ArcKit is named once, as the tool.
- **Articles (`docs/articles/`, Medium):** follow the existing rule. Plain language, lead with what changed for the reader, no Markdown tables.

---

## 4. Channel Strategy

| Channel | Type | Why it fits | Formats | Effort |
|---------|------|------------|---------|--------|
| **Adopter programme** (`ADOPTERS.md`, "I use ArcKit" issue form, adopters section on arckit.org) | Owned | The conversion mechanism the whole campaign points at. Has a named tier and an anonymous tier ("a central government department") because civil servants often can't endorse tools publicly | Issue form, adopters page, badge | Medium (one-off build) |
| **Monthly office hours** (60 min, open video call) | Owned | Gives consideration-stage architects a low-risk first step, and surfaces case-study candidates | Live Q&A + demo, recording posted afterwards | Medium |
| **"ArcKit on your project" pilot workshops** (free, 2 hours, 1 team) | Owned | Moves a team from starring to using on real work. Each pilot becomes a case-study candidate | Remote workshop on the team's own (or a test) project | High, so cap at 4 this quarter |
| **LinkedIn: ArcKit page, [LinkedIn group](https://www.linkedin.com/groups/17641034/) + maintainer posts** | Owned | Where the primary audience already is. Past articles already run there | 2 posts a week: artefact walkthroughs, adopter spotlights, office-hours reminders | Medium |
| **[Discord](https://discord.gg/HsA4Y3hQ4)** | Owned | Existing community. Also the private route for adopters who can't post a public GitHub issue | Office-hours reminders, adopter DMs, a `#show-your-working` channel | Low |
| **arckit.org + articles** | Owned | GA4 has been live since 29 June, so it's the one place usage can be measured | Case-study pages, a "for UK public sector" landing page, 1 article every 2 weeks | Medium |
| **Cross-government architecture community** | Earned | The most trusted peer channel for the primary audience | Show-and-tell slot, posts in community Slack channels | Medium |
| **Department and NHS digital blogs** | Earned | Their endorsement carries more weight than anything ArcKit says about itself | Co-written case study, published by the adopter | High (sign-off lead times) |
| **Map Camp / Wardley community** | Earned | The Wardley suite is a distinctive draw, and this community overlaps heavily with public-sector architecture | Talk or lightning-talk submission, map walkthrough | Medium (confirm 2026 dates and CFP) |
| **Supplier and consultancy outreach** | Earned | Secondary audience, faster to publish case studies | Direct outreach to 10 G-Cloud suppliers already using or forking ArcKit | Low–Medium |

**Deliberately not used this quarter:** paid ads (no budget, and a poor fit for public-sector buyers); star-chasing launches on Hacker News or Product Hunt (they don't serve the adoption goal, but keep one in reserve for the v7 release).

---

## 5. Content Calendar

Weeks start on Monday. Status is *Planned* for every row until work starts.

| Week | Content piece | Channel | Owner/Notes | Status |
|------|--------------|---------|-------------|--------|
| Prep (28 Sep) | `ADOPTERS.md` + "I use ArcKit" issue form (named/anonymous tiers) | GitHub | Maintainer. **Must be live before any public ask** | Planned |
| Prep (28 Sep) | Case-study template + 30-min interview script | Internal | Maintainer. Reused for every case study | Planned |
| 1 (5 Oct) | "For UK public sector" landing page on arckit.org (messages 1–3, security/classification FAQ, adopter CTA) | Website | Depends on the adopter form | Planned |
| 1 (5 Oct) | Campaign launch article: *"Show your working: who uses ArcKit?"* (why we're asking, how to join anonymously) | Articles, Medium, LinkedIn | Follow RELEASING.md article rules | Planned |
| 2 (12 Oct) | Office hours #1 announced (held week 4) | LinkedIn, community Slack | Book a recurring slot (e.g. first Thursday of the month) | Planned |
| 2 (12 Oct) | LinkedIn series begins, "One artefact, 20 minutes": SOBC on a public test repo | LinkedIn | 2 posts a week from here, alternating artefact walkthroughs and community posts | Planned |
| 3 (19 Oct) | Pilot workshop offer: 4 free slots, direct outreach to known forkers, issue filers and article commenters | Email/DM, LinkedIn | Prioritise contacts with a public-sector link | Planned |
| 3 (19 Oct) | Submit to a cross-government architecture community show-and-tell | Earned | Lead time varies. Ask early | Planned |
| 3 (19 Oct) | Article: *"AI you can defend in a review"* (ENFORCEMENT.md for non-maintainers), brought forward from week 8 after the competitive brief | Articles, LinkedIn | Answers the top objection before pilots start | Planned |
| 4 (26 Oct) | **Office hours #1** + recording | Owned | Collect adopter-form signups live | Planned |
| 4 (26 Oct) | Supplier outreach: 10 G-Cloud/DOS suppliers | Direct | Source from uk-gcloud overlay users and forks | Planned |
| 5 (2 Nov) | Pilot workshops 1–2 | Owned | Ask each team for a case-study interview at the end | Planned |
| 5 (2 Nov) | **Anchor asset:** *"Same AI, with its working shown"*, a plain-prompt versus ArcKit TCoP review side by side | Articles, landing page, LinkedIn | Use a public test repo. Carries message 1 | Planned |
| 6 (9 Nov) | **Case study #1** (supplier or consultancy, fastest to publish) | Website, LinkedIn | Interview → draft → adopter approval | Planned |
| 6 (9 Nov) | Adopter spotlight post (first named adopters) | LinkedIn | Only with explicit permission | Planned |
| 7 (16 Nov) | Pilot workshops 3–4 | Owned | — | Planned |
| 7 (16 Nov) | **Mid-campaign review**: adopter count, office-hours attendance, GA4 landing-page sessions | Internal | Rebalance weeks 8–13 | Planned |
| 8 (23 Nov) | **Office hours #2** (theme: security, classification, "can I use this on OFFICIAL-SENSITIVE work?") | Owned | Answer the top objection directly | Planned |
| 8 (23 Nov) | Article: *"ArcKit alongside Bizzdesign, Ardoq and LeanIX"* (the EA tool holds the inventory, ArcKit produces the evidence) | Articles, LinkedIn | Message 4 | Planned |
| 9 (30 Nov) | **Case study #2** (UK public sector, anonymous tier acceptable) | Website, LinkedIn | Comms sign-off may need 3+ weeks. Start the draft in week 6 | Planned |
| 10 (7 Dec) | Community show-and-tell delivered (if slot confirmed) | Earned | Demo on a public test repo, adopter CTA | Planned |
| 10 (7 Dec) | Co-publication pitch for case study #3 on a department or NHS blog | Earned | The adopter's comms team owns publication | Planned |
| 11 (14 Dec) | **Office hours #3** + "year in review" preview | Owned | — | Planned |
| 11 (14 Dec) | **Case study #3** (target: co-published on an adopter's blog) | Earned + owned mirror | Fall back to an arckit.org publication if the blog slips | Planned |
| 12 (21 Dec) | Article: *"ArcKit in 2026: who's using it and what they built"* (adopter roll-up) | Articles, Medium, LinkedIn | Includes adopter count and anonymous-tier summary | Planned |
| 13 (28 Dec) | Holiday week, no new content. Campaign report drafted for the January traction report | Internal | — | Planned |

About 20% of LinkedIn slots stay open for release news and anything reactive (new overlays, contributor spotlights).

**Critical dependencies:** adopter form → landing page → launch article → every CTA. Case studies need about 3 weeks of lead time for public-sector comms sign-off. Pilot workshops feed case studies 2 and 3.

---

## 6. Content Pieces Needed

| Asset | Type | Description | Priority | Ready by |
|-------|------|-------------|----------|----------|
| `ADOPTERS.md` + issue form | Repo | Named and anonymous tiers, org type, sector, which commands, permission to quote | Must | Prep week |
| Case-study template + interview script | Internal | Problem → what they ran → what changed → what they'd fix. 30-minute interview | Must | Prep week |
| UK public sector landing page | Web page | Messages 1–3, security/classification FAQ, adopter CTA, links to the test repos | Must | Week 1 |
| Launch article | Article | Why we're asking, why there's no telemetry, how to join anonymously | Must | Week 1 |
| Office-hours format + slides | Deck (`/arckit:presentation` on a test repo) | 10-minute demo, 50-minute Q&A | Must | Week 2 |
| Pilot workshop runbook | Internal | 2-hour agenda: `/arckit:start` → requirements → one assessment artefact → review | Must | Week 3 |
| LinkedIn series (~20 posts) | Social | Artefact walkthroughs with screenshots from the public test repos | Must | Rolling |
| 3 case studies | Web + article | 800–1,200 words, with an adopter quote where approved | Must | Weeks 6, 9, 11 |
| Plain prompt versus ArcKit side by side | Article + landing-page section | One TCoP review both ways on a public test repo | Must | Week 5 |
| "AI you can defend" article | Article | Plain-language ENFORCEMENT.md | Must | Week 3 |
| "Alongside your EA tool" article | Article | Message 4 | Nice | Week 8 |
| Adopters section on arckit.org | Web | Logo wall or text list, anonymous-tier counts | Must | Week 6 |
| Map Camp talk submission | Talk | Wardley suite + public-sector strategy mapping | Nice | CFP deadline (confirm) |
| Year-in-review article | Article | Adopter roll-up + 2027 roadmap tease | Must | Week 12 |

---

## 7. Success Metrics

**ArcKit collects no product telemetry, and the campaign should not change that.** Every metric below comes from public or opt-in signals.

| KPI | Target (by 31 Dec) | How tracked |
|-----|-------------------|-------------|
| **Organisations publicly confirmed (primary)** | **10** (≥6 UK public sector) | `ADOPTERS.md` named entries |
| **Published case studies (primary)** | **3** (≥1 co-published by an adopter) | Articles listing |
| Adopter-form submissions (named + anonymous) | 25 | GitHub issues with the adopter label |
| Pilot workshops delivered | 4 | Calendar |
| Time saved on one workshop task (opt-in, timed) | 1 honest number to publish | Timed during pilot workshops with the team's consent. Our answer to vendor productivity claims |
| Office-hours attendance | 15+ per session on average | Call attendance |
| UK public sector landing-page sessions | 1,500 across the quarter | GA4 |
| Star rate outside release weeks | ≥3/day | Monthly traction report |
| External PR authors | ≥5 in the quarter | Traction report |

**Tracking notes:**

- GitHub's traffic API only keeps **14 days** of clone and view data. Snapshot it weekly or the quarter's baseline is lost.
- Add UTM parameters to every campaign link (`utm_campaign=show-your-working`) so GA4 separates campaign traffic from release traffic.

**Reporting cadence:** a weekly self-check (5 minutes: adopter count, form submissions, GA4 sessions). The monthly traction report gains a "Show Your Working" section from October. A full campaign report goes into the January 2027 traction report.

---

## 8. Budget Allocation

Cash spend is close to zero. What the campaign really spends is maintainer time.

| Activity | Hours/week (avg) | Share |
|----------|-----------------:|------:|
| Content (articles, LinkedIn, case studies) | 2.5 | 40% |
| Office hours + pilot workshops | 1.5 | 25% |
| Outreach and community (DMs, Slack, show-and-tells, suppliers) | 1.0 | 17% |
| Adopter programme build + measurement | 0.5 | 8% |
| Contingency (reactive posts, comms sign-off chasing) | 0.5 | 10% |
| **Total** | **~6** | 100% |

Optional cash spend, only if a case study lands early: about £300 to boost the best-performing case-study post on LinkedIn, targeted at UK public-sector job titles. Decide this at the week-7 review.

---

## 9. Risks and Mitigations

| Risk | Likelihood | Mitigation |
|------|-----------|-----------|
| **Civil servants can't publicly endorse tools** (departmental comms and commercial rules) | High | The anonymous tier counts toward adopter submissions. Lead with supplier case studies. Frame public-sector pieces as "how we approached X" on the adopter's own blog, not as an endorsement |
| **Maintainer bandwidth**: the campaign competes with a ~2-day release cadence | High | Hold the 6-hour cap, reuse release articles as campaign content, and let the release cadence slow in weeks 5–11 if needed |
| **The security and AI-policy objection stalls pilots** ("we can't use AI on this") | Medium | The landing-page FAQ and office hours #2 address it directly. Be precise: ArcKit needs an approved AI *coding* assistant such as GitHub Copilot, not Microsoft 365 Copilot. Point to the no-telemetry design and the data-handling FAQ |
| **Too few adopters respond to the public ask** | Medium | Direct outreach to known forkers, issue filers and external contributors (for example `chrismckelt`, `johnfelipe`, `umag`) converts better than broadcast |
| **Case-study sign-off slips past 31 December** | Medium | Start drafts 3 weeks early, keep a supplier case study ready as a fallback, and let a slipped piece count as Q1 carry-over |

---

## 10. Next Steps

**This week (prep):**

1. Approve or adjust this plan, especially the campaign name and the anonymous-tier approach.
2. Build `ADOPTERS.md` and the "I use ArcKit" issue form.
3. Book a recurring office-hours slot and create the event page.
4. List 20 warm contacts for direct outreach (forkers, issue filers, contributors, article commenters, LinkedIn connections in government architecture roles).

**Decisions needed:**

- Can adopters be listed anonymously, and if so, what counts as "confirmed"?
- Will pilot workshops take a department's own project, or only public test repos (simpler on classification)?
- Is Map Camp 2026 worth a submission? Confirm the dates and CFP first.
- Does the week-7 review release the optional ~£300 boost?

**Stakeholder approvals:** only the maintainer for ArcKit-owned channels. Each adopter's comms team for any named quote or co-published case study.

---

*Plan built with the marketing plugin's `campaign-plan` skill. Traction figures from `reports/traction/2026-09-01-traction.md`.*
