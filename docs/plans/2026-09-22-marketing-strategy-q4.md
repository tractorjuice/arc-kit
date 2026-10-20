# ArcKit Marketing Strategy — Q4 2026

> **Status:** draft for maintainer review. Messaging revised on 23 September after the competitive brief (`2026-09-23-competitive-brief.md`). Built with the marketing plugin's campaign-plan method, from the September traction report (`reports/traction/2026-09-01-traction.md`), `docs/INVESTOR-REPORT.md`, and the article archive.
> **Window:** 1 October – 31 December 2026 (13 weeks). **The launch was brought forward to 23 September**: the adopter form, `ADOPTERS.md`, the landing page and the launch article all went live that day, so the prep-week and week-1 rows below are done.
> **Budget:** close to zero. Owned and earned channels only. The real constraint is maintainer time, budgeted at about 6 hours a week.
> **Updated 11 October:** ArcKit was pitched to The Next New Thing's weekly GitHub roundup (§4, §5), and the 10-second intro videos now exist (§6).
> **Updated 19 October:** a scan of public UK government code shows where AI coding assistants are already in use, and that controls lag behind them. It changes where to start (§2), adds an audience and a message (§2, §3), and adds a way to find adopters without telemetry (§4–§7). The scan covers public GitHub repositories only, so every figure from it is a lower bound.

---

## 1. Campaign Overview

**Campaign name:** *Show Your Working*. Assessors ask departments to show their working, and ArcKit is how you show it. The name also asks users to show *us* that they use it.

**Summary:** Turn ArcKit's anonymous UK public-sector usage into named, citable adopters and published case studies, so "reportedly used across UK Government and NHS" becomes "used by these organisations, and here is what they did with it".

**Why this goal, now:**

- **Stars have stopped being the story.** 2,211 stars and 279 forks, but the rate has fallen from ~221/day at the April trending peak to ~3/day, and the traction report expects 1–2/day in September. Growth moves when releases ship, not through organic discovery.
- **The biggest credibility gap is verification.** The investor report's watch-items are "used across UK Government and NHS is third-party reported" and "no named reference customers". Every downstream option (grants, support contracts, contributors, a second trending moment) is easier with named adopters.
- **ArcKit deliberately collects no telemetry.** So we cannot count users from the product. They have to be *asked*, and that is the campaign.
- **ArcKit's prerequisite is now visible in public code.** ArcKit needs an approved AI coding assistant. On 19 October a scan of 25,362 public UK government GitHub repositories found a clear sign of one in 1,607 of them, and in one in six (16.3%) of those changed in the past year. GitHub Copilot appears in 817 repositories and Claude in 570. Repositories showing their first AI co-authored commit or AI-opened pull request rose from 12 a quarter in early 2025 to 410 in the second quarter of 2026. Departments are no longer asking whether to use AI in delivery but how to control it, which is the question ArcKit answers.

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
| Can't buy new tools without a procurement exercise | MIT licensed and free. Nothing new to buy *if* the team already has an approved AI coding assistant (GitHub Copilot, not Microsoft 365 Copilot). GDS's 2024–25 trial redeemed 1,100 GitHub Copilot licences across more than 50 organisations, and 74 government organisations now show an AI coding assistant in their public code |
| Already paid £80k–£430k for an EA repository (Bizzdesign, Ardoq, LeanIX) | Works alongside it. The EA tool holds the inventory, and ArcKit produces the assessment evidence from it |
| Already using Microsoft 365 Copilot or ChatGPT with ad-hoc prompts | The same kind of AI, with templates, citations, traceability and provenance, so the output survives review |
| Classification and data-handling worries | Nothing phones home, a `default_classification` setting, secret-detection and file-protection hooks, and every artefact is kept in your repo (prompts still go to the model provider) |

**Buying stage:** mostly *consideration*. Many have heard of ArcKit or starred it, but haven't run it on a real project or told anyone they have.

**Where to start** (added 19 October): departments whose engineers visibly use an AI coding assistant already have what ArcKit needs, so a pilot there skips the tool-approval step. The largest public footprints are DEFRA (373 repositories, 18.6% of its public code), the Ministry of Justice (245), HMCTS (211), DfE (89), The National Archives (62), ONS (54) and Companies House (50). Smaller teams with a high share include i.AI (26.2%), BEIS (25.2%) and CDDO (16.4%). Several large estates show little public trace, which more likely means their code is private than that they don't use AI. Reach those through the architecture community, not their repositories.

**Where they spend time:** LinkedIn; the cross-government architecture community of practice (show-and-tells, Slack); UK Government Digital Slack; GDS, CDDO and department digital blogs; Digital Leaders, techUK and Think Digital events; the UK Wardley mapping community (Map Camp).

### Secondary: G-Cloud and DOS suppliers and consultancies

Suppliers who sell architecture and assurance work *to* government. They feel the same pain on the delivery side, they talk about their tooling in public more readily than civil servants do, and the `arckit-uk-gcloud` overlay and `arckit-fde` plugin are built for them. They make easier early case studies while public-sector ones clear comms sign-off.

### Secondary: teams governing AI in delivery (added 19 October)

The CTOs, chief architects, heads of engineering, CISOs and AI assurance leads now putting controls around AI coding assistants. The scan shows why the work is urgent:

- the GitHub Copilot coding agent has opened pull requests in 154 government repositories;
- 701 repositories carry hand-written instruction files for AI assistants;
- there is no common way to record which code an AI wrote.

The tension they manage is pace against assurance. Engineers are already using AI, and security, information-risk and data-protection owners won't sanction it until data boundaries and human accountability are proven.

ArcKit produces the governance pack such a rollout needs:

- principles, stakeholders and requirements;
- a DPIA (`/arckit:dpia`);
- a Secure by Design assessment (`/arckit:secure`);
- a risk register (`/arckit:risk`);
- an AI Playbook assessment (`/arckit:ai-playbook`);
- the cross-government picture from `/arckit:gov-landscape`.

ArcKit also shows the practice they're asking for: every artefact carries a provenance stamp, and `ENFORCEMENT.md` says which rules are enforced. This audience overlaps the primary one (chief architects sit in both) but arrives through a different problem.

---

## 3. Key Messages

**Core message** (revised after the competitive brief):
> **Show your working. ArcKit gives your AI coding assistant the UK templates, traceability and checks to produce governance evidence you can defend in a review, with every claim cited and every artefact kept in your own repository.**

Two phrases from the first draft are retired because a security reviewer would fail them. "The AI assistant you already use" is untrue for most civil servants: their Copilot is the Microsoft 365 one, where ArcKit doesn't run. And "never leaves your repository" overclaims, because prompts go to the model provider.

The 19 October scan narrows the first retirement without lifting it. Many architects still have only Microsoft 365 Copilot. But where a department's public code shows its engineers using GitHub Copilot or Claude Code, a targeted version is true and worth saying: *"If your engineers already use GitHub Copilot or Claude Code, ArcKit runs there."* Use it only for those departments.

| # | Supporting message | Pain it answers | Proof points |
|---|-------------------|-----------------|--------------|
| 1 | **Same AI, with its working shown.** Plain Copilot or ChatGPT prompts give you plausible prose. ArcKit gives the AI templates, cites every claim, traces requirements through to design, and stamps how each document was made. | The real competitor: ad-hoc prompting (HMRC has 32,000 M365 Copilot licences, MoJ has 2,500 ChatGPT Enterprise seats). In engineering teams it takes the form of hand-written instruction files, found in 701 public government repositories | `ENFORCEMENT.md`, citation markers, provenance, behavioural evals. AI Playbook principles 4 and 10 (human control, assurance) |
| 2 | **Speaks the assessor's language.** TCoP, Service Standard, NCSC CAF, Secure by Design, Green and Orange Book, G-Cloud and DOS are built in. No EA platform claims this. | Drafting load | 75 commands, 70+ templates, 22 public test repos modelled on NHS, HMRC, MOD, ONS and Cabinet Office scenarios |
| 3 | **Nothing new to buy, nothing sent to us.** Free and MIT licensed, runs in eight AI coding assistants, and collects no data. Prompts go only to the model provider you've already approved, and research commands query public sources. | Procurement and data-handling risk | Nine distribution formats, including the two most common in public government code, GitHub Copilot (817 repositories) and Claude Code (570). No telemetry by design, honest data-handling FAQ on the landing page |
| 4 | **Works alongside your EA repository.** Bizzdesign, Ardoq or LeanIX holds the inventory. ArcKit turns it into assessment evidence, versioned in git. | "We already bought an EA tool" (Bizzdesign alone: Ofgem, FCA, NHS Property Services, MCA) | Reads exports as external source material. Rewritten README comparison |
| 5 | **Built in the open, with public servants.** Overlays for NHS clinical safety, UK Finance, G-Cloud suppliers, and nine other jurisdictions, several contributed by practitioners. | "Is this maintained? Who else uses it?" | 100+ releases, 8 external PRs merged in August, `umag`'s NL and EU overlays, `ADOPTERS.md` |
| 6 | **Governs AI in your delivery, and shows how.** Coding agents already open pull requests in government repositories, and provenance practice varies by tool. ArcKit writes the DPIA, Secure by Design assessment, risk register and AI Playbook assessment for an AI coding rollout, and stamps how each of its own documents was made. (Added 19 October) | "Our engineers already use AI, and we can't show it's controlled" | GitHub Copilot coding agent pull requests in 154 government repositories, instruction files in 701. `/arckit:ai-playbook`, `/arckit:dpia`, `/arckit:secure`, provenance stamping |

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
| **AI-builder shows**: [The Next New Thing](https://thenextnewthing.ai)'s weekly GitHub roundup (added 11 October) | Earned | Not the primary audience: about 63.5K YouTube subscribers, mostly AI founders and builders. But the show has featured Archify (number one on 4 September), Paperclip and several Claude Code plugins, and ends each Friday episode with audience submissions. A feature would bring stars and GitHub traffic rather than adopters | One email pitch, plus a 60-second screen recording if they ask | Low |
| **Data article: AI in UK government code** (added 19 October) | Earned + owned | The scan is new evidence from public sources that trade press and the architecture community can use. It carries messages 3 and 6 without selling, and a quarterly refresh gives a recurring reason to post | Article on arckit.org and Medium, a LinkedIn post, a pitch to PublicTechnology and Computer Weekly. Repeat each quarter | Medium (re-run, write-up) |
| **Adopter trace search** (added 19 October) | Owned | The scan's method, pointed at ArcKit: an exact GitHub code search of public UK government repositories for ArcKit's own traces (a `.arckit/` folder, `ARC-` file names, the "Generated by: ArcKit" footer, the provenance block). It finds users without adding telemetry. govreposcrape's semantic search doesn't find these files, so it has to be GitHub's exact search. A hit is a warm contact, not an adopter, until they say yes | Monthly search, results kept out of the public repo | Low |

**Deliberately not used this quarter:** paid ads (no budget, and a poor fit for public-sector buyers); star-chasing launches on Hacker News or Product Hunt (they don't serve the adoption goal, but keep one in reserve for the v7 release). The Next New Thing pitch is the one exception: a single email, and the show already covers the tools ArcKit builds on.

**Later option, not this quarter: ArcKit reference for ChatGPT Enterprise workspaces** (noted 1 October 2026). OpenAI's [Hosting a plugin with ChatGPT Sites](https://help.openai.com/en/articles/20001547-hosting-a-plugin-with-chatgpt-sites) lets a workspace host MCP tools on a ChatGPT Site and use them as a plugin in ChatGPT and Codex. It reaches the departments that have ChatGPT Enterprise rather than a coding assistant (MoJ's 2,500 seats). It would carry reference material only: find the right template, what the Technology Code of Practice or Service Standard expects, the quality checklist for a document type. It can't generate governed documents, because there is no repository, no hooks and no provenance. Constraints: sharing stays inside one Business or Enterprise workspace (personal and Pro accounts can't share at all), admins must turn on "Create plugins with MCPs" and "Upload plugins" (off by default in Enterprise), and content on a Site is held by OpenAI, so it suits public templates and guidance, not project documents. So each organisation would host its own copy; ArcKit's part would be a short guide and a ready-made prompt for their admin. Revisit once Sites is generally available, ideally with a ChatGPT Enterprise adopter as part of a pilot workshop. The Codex extension does not change: it is already a Codex plugin with skills, hooks and templates, which a Site-hosted plugin can't carry.

---

## 5. Content Calendar

Weeks start on Monday. Status is *Planned* for every row until work starts.

| Week | Content piece | Channel | Owner/Notes | Status |
|------|--------------|---------|-------------|--------|
| Prep (28 Sep) | `ADOPTERS.md` + "I use ArcKit" issue form (named/anonymous tiers) | GitHub | Maintainer. **Must be live before any public ask** | Planned |
| Prep (28 Sep) | Case-study template + 30-min interview script | Internal | Maintainer. Reused for every case study | Planned |
| 1 (5 Oct) | "For UK public sector" landing page on arckit.org (messages 1–3, security/classification FAQ, adopter CTA) | Website | Depends on the adopter form | Planned |
| 1 (5 Oct) | Campaign launch article: *"Show your working: who uses ArcKit?"* (why we're asking, how to join anonymously) | Articles, Medium, LinkedIn | Follow RELEASING.md article rules | Planned |
| 1 (5 Oct) | Pitch to The Next New Thing's GitHub roundup (audience submissions), sent to hi@thenextnewthing.ai on 11 Oct. It opened with Archify and covered enterprise-architecture support and the regional and sector add-ons | Email (earned) | Maintainer. No reply yet | Sent |
| 1 (5 Oct) | 10-second intro videos: 16:9 and 9:16, each with a fade-in title and with the logo built from its parts | Video | Made with HyperFrames on 11 Oct. Not yet posted | Done |
| 2 (12 Oct) | Check the Friday 16 Oct episode, and the following Fridays, for ArcKit in audience submissions. If it's featured, post on the page, then the group, then Discord, and offer the 60-second recording | LinkedIn, Discord | Reactive slot. Same channel order as every other post | Planned |
| 2 (12 Oct) | Office hours #1 announced (held week 4) | LinkedIn, community Slack | Book a recurring slot (e.g. first Thursday of the month) | Planned |
| 2 (12 Oct) | LinkedIn series begins, "One artefact, 20 minutes": SOBC on a public test repo | LinkedIn | 2 posts a week from here, alternating artefact walkthroughs and community posts | Planned |
| 3 (19 Oct) | Pilot workshop offer: 4 free slots, direct outreach to known forkers, issue filers and article commenters | Email/DM, LinkedIn | Prioritise contacts with a public-sector link, then teams in the departments in §2 whose public code shows an AI coding assistant | Planned |
| 3 (19 Oct) | Adopter trace search, first run. Add hits, and teams with public `CLAUDE.md`, `AGENTS.md` or Copilot instruction files in the §2 departments, to the warm-contact list | Internal | Results stay out of the public repo. Ask before listing anyone | Planned |
| 3 (19 Oct) | Submit to a cross-government architecture community show-and-tell | Earned | Lead time varies. Ask early | Planned |
| 3 (19 Oct) | Article: *"AI you can defend in a review"* (ENFORCEMENT.md for non-maintainers), brought forward from week 8 after the competitive brief | Articles, LinkedIn | Answers the top objection before pilots start | Planned |
| 4 (26 Oct) | **Office hours #1** + recording | Owned | Collect adopter-form signups live | Planned |
| 4 (26 Oct) | Supplier outreach: 10 G-Cloud/DOS suppliers | Direct | Source from uk-gcloud overlay users and forks | Planned |
| 4 (26 Oct) | Article: *"One in six: AI-assisted development in UK government code"*, from a fresh re-run of the 19 October scan | Articles, Medium, LinkedIn, trade press pitch | Only if the §10 decision is yes. Lead with what teams are doing and the lower-bound caveat, not a ranking | Planned |
| 5 (2 Nov) | Pilot workshops 1–2 | Owned | Ask each team for a case-study interview at the end | Planned |
| 5 (2 Nov) | **Anchor asset:** *"Same AI, with its working shown"*, a plain-prompt versus ArcKit TCoP review side by side | Articles, landing page, LinkedIn | Use a public test repo. Carries message 1 | Planned |
| 6 (9 Nov) | **Case study #1** (supplier or consultancy, fastest to publish) | Website, LinkedIn | Interview → draft → adopter approval | Planned |
| 6 (9 Nov) | Adopter spotlight post (first named adopters) | LinkedIn | Only with explicit permission | Planned |
| 7 (16 Nov) | Pilot workshops 3–4 | Owned | — | Planned |
| 7 (16 Nov) | **Mid-campaign review**: adopter count, office-hours attendance, GA4 landing-page sessions, adopter trace search re-run | Internal | Rebalance weeks 8–13 | Planned |
| 8 (23 Nov) | **Office hours #2** (theme: security, classification, "can I use this on OFFICIAL-SENSITIVE work?", and what to have in place before coding agents open pull requests) | Owned | Answer the top objection directly. Message 6 | Planned |
| 8 (23 Nov) | Article: *"ArcKit alongside Bizzdesign, Ardoq and LeanIX"* (the EA tool holds the inventory, ArcKit produces the evidence) | Articles, LinkedIn | Message 4 | Planned |
| 9 (30 Nov) | **Case study #2** (UK public sector, anonymous tier acceptable) | Website, LinkedIn | Comms sign-off may need 3+ weeks. Start the draft in week 6 | Planned |
| 9 (30 Nov) | Public test repo: ArcKit governance pack for a fictional department's AI coding assistant rollout (principles, DPIA, Secure by Design, risk register, AI Playbook assessment), from public sources only | GitHub, LinkedIn | Carries message 6 for the AI-in-delivery audience. Start in week 6 | Planned |
| 10 (7 Dec) | Community show-and-tell delivered (if slot confirmed) | Earned | Demo on a public test repo, adopter CTA | Planned |
| 10 (7 Dec) | Co-publication pitch for case study #3 on a department or NHS blog | Earned | The adopter's comms team owns publication | Planned |
| 11 (14 Dec) | **Office hours #3** + "year in review" preview | Owned | — | Planned |
| 11 (14 Dec) | **Case study #3** (target: co-published on an adopter's blog) | Earned + owned mirror | Fall back to an arckit.org publication if the blog slips | Planned |
| 12 (21 Dec) | Article: *"ArcKit in 2026: who's using it and what they built"* (adopter roll-up) | Articles, Medium, LinkedIn | Includes adopter count and anonymous-tier summary | Planned |
| 13 (28 Dec) | Holiday week, no new content. Campaign report drafted for the January traction report | Internal | Re-run the landscape scan for the January refresh | Planned |

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
| Intro videos (4) | Video | 10-second silent brand intros on the navy blueprint background. 16:9 (1920×1080) and 9:16 (1080×1920), each in two styles: a fade-in title, and the logo built from its parts (brackets, caret, cursor line, nodes, pin). They open demos and office-hours recordings, and suit LinkedIn, Discord, Shorts and Reels | Nice | Done (11 Oct). Not yet in the repo |
| 60-second screen recording | Video | One command running end to end on a public test repo, opened by an intro video. Offered in The Next New Thing pitch | Nice | On request |
| Warm-contact list | Internal | Teams in the §2 departments with public `CLAUDE.md`, `AGENTS.md` or Copilot instruction files, plus any repository with ArcKit's traces. Kept out of the public repo | Must | Week 3 |
| "AI in UK government code" article | Article + LinkedIn | A re-run of the 19 October scan: headline figures, growth by quarter, the tools, and what teams are doing about controls. Method and lower-bound caveat included, and no ranking of low-share departments | Nice (Must if §10 says yes) | Week 4 |
| AI coding rollout test repo | Public test repo | ArcKit governance pack for a fictional department rolling out an AI coding assistant, built from public sources only | Nice | Week 9 |

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
| Public UK government repositories with ArcKit's traces | Baseline from the week-3 search, higher at week 13 | Adopter trace search (monthly) |

**Tracking notes:**

- GitHub's traffic API only keeps **14 days** of clone and view data. Snapshot it weekly or the quarter's baseline is lost.
- The landscape figures come from public repositories only. Quote them as a lower bound every time.
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
| **The security and AI-policy objection stalls pilots** ("we can't use AI on this") | Medium | The landing-page FAQ and office hours #2 address it directly. Be precise: ArcKit needs an approved AI *coding* assistant such as GitHub Copilot, not Microsoft 365 Copilot. Point to the no-telemetry design and the data-handling FAQ. Lead with the §2 departments, where an AI coding assistant is already in visible use |
| **Landscape figures read as a league table**, and a department shown as slow takes offence | Medium | Quote the lower-bound caveat, lead with what teams are doing rather than a ranking, and don't name low-share departments in public pieces |
| **Government's tool mix moves toward assistants ArcKit doesn't run in** (Cursor appears in 103 public repositories, Amazon Q or Kiro in 8, and trade press reports the wider rollout may include Amazon Q) | Low–Medium | Track the tool counts in each quarterly scan, and decide on a Cursor format for Q1 (§10) |
| **Too few adopters respond to the public ask** | Medium | Direct outreach to known forkers, issue filers and external contributors (for example `chrismckelt`, `johnfelipe`, `umag`) converts better than broadcast |
| **Case-study sign-off slips past 31 December** | Medium | Start drafts 3 weeks early, keep a supplier case study ready as a fallback, and let a slipped piece count as Q1 carry-over |

---

## 10. Next Steps

**This week (prep):**

1. Approve or adjust this plan, especially the campaign name and the anonymous-tier approach.
2. Build `ADOPTERS.md` and the "I use ArcKit" issue form.
3. Book a recurring office-hours slot and create the event page.
4. List 20 warm contacts for direct outreach (forkers, issue filers, contributors, article commenters, LinkedIn connections in government architecture roles).

**Week of 19 October:**

1. Run the first adopter trace search (§4).
2. Build the warm-contact list from public instruction files in the §2 departments.
3. Send the pilot workshop offer to that list.

**Decisions needed:**

- Publish the "AI in UK government code" article in week 4? If yes, re-run the scan first and publish the method with it.
- Is Cursor, at 103 public government repositories, worth a distribution format in Q1?
- Can adopters be listed anonymously, and if so, what counts as "confirmed"?
- Will pilot workshops take a department's own project, or only public test repos (simpler on classification)?
- Is Map Camp 2026 worth a submission? Confirm the dates and CFP first.
- Does the week-7 review release the optional ~£300 boost?

**Stakeholder approvals:** only the maintainer for ArcKit-owned channels. Each adopter's comms team for any named quote or co-published case study.

---

*Plan built with the marketing plugin's `campaign-plan` skill. Traction figures from `reports/traction/2026-09-01-traction.md`. Landscape figures from a scan of public UK government GitHub repositories on 19 October 2026: the govreposcrape index of 25,362 repositories in 212 organisations, plus GitHub code, commit and pull request search. GDS trial figures from the [AI coding assistant trial findings](https://www.gov.uk/government/publications/ai-coding-assistant-trial/ai-coding-assistant-trial-uk-public-sector-findings-report), published 12 September 2025.*
