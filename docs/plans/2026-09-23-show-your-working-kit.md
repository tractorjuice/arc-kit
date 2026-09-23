# Show Your Working: Campaign Kit

> **Status:** draft, ready to use. These are the reusable assets that sit behind the Q4 2026 campaign in `2026-09-22-marketing-strategy-q4.md`. The adopter form (`.github/ISSUE_TEMPLATE/adopter.yml`), `ADOPTERS.md` and the launch article (`docs/articles/2026-10-05-show-your-working.md`) are separate files.
> **Date:** 23 September 2026

---

## 1. Handling adopter submissions

Adopter issues are public, so treat each one as a first reply to someone who took a risk telling you.

1. **Within 48 hours:** thank them on the issue. If they ticked a follow-up box, say you'll message them directly, then do it on Discord or LinkedIn, not in the public thread.
2. **Update `ADOPTERS.md`:** add a named row, or increment the anonymous sector count. Link the PR to the issue.
3. **Close the issue** with the `adopter` label. Closed-and-labelled is the running count the weekly check reads.
4. **Private submissions** (Discord or LinkedIn): update the anonymous count only. Keep a private note of the organisation and contact in a local file that is never committed.
5. **Removal requests:** do them the same day, no questions asked.

Create the `adopter` label (colour `#0E8A16`, description "Organisation using ArcKit") before the form goes live. The form references it, and GitHub silently drops an unknown label.

---

## 2. Direct outreach message

For the 20 warm contacts: forkers, issue filers, contributors, article commenters. Send it personally, one at a time, and change the first line for each person.

> Hi [name], I noticed you [forked ArcKit / filed #NNN / commented on the NHS overlay article]. Thank you.
>
> I'm trying to find out who actually uses ArcKit, since it deliberately collects no usage data. If you or your team use it, would you tell me? There's a two-minute form, and you can be listed anonymously by sector or not listed at all: [adopter form link]
>
> I'm also running four free two-hour pilot workshops this quarter, on a real project of yours or a public test one. If that would help your team, just reply.
>
> Either way, thanks for being part of it. Mark

---

## 3. Office hours

**Slot:** monthly, 60 minutes, on the same weekday each month. An open video call link, posted on LinkedIn, Discord and the arckit.org events line one week and one day before.

**Running order:**

| Min | Segment |
|----:|---------|
| 0–5 | Welcome. What ArcKit is in two sentences, and what's new since last month |
| 5–15 | Live demo on a public test repo (below) |
| 15–50 | Questions. Take the awkward ones first |
| 50–55 | One ask: the adopter form, and pilot workshop slots if any are left |
| 55–60 | Next session date and theme |

**Themes and demo repos:**

| Session | Theme | Demo repo |
|---------|-------|-----------|
| #1 (late Oct) | "From blank repo to TCoP review in 10 minutes" | `arckit-test-project-v7-nhs-appointment` |
| #2 (late Nov) | "Can I use this on OFFICIAL-SENSITIVE work?" Classification, what stays local, the enforcement page | `arckit-test-project-v9-cabinet-office-genai` |
| #3 (mid Dec) | "Wardley mapping a build-versus-buy decision" | `arckit-test-project-v50-post-office-horizon` |

After each session, post the recording on the ArcKit LinkedIn page and in Discord, with the adopter form link in the description.

---

## 4. Pilot workshop runbook (2 hours)

**Before:** a 15-minute call to agree the project (theirs, or a public test repo if classification rules it out), which AI assistant they're allowed to use, and which assessment is coming up next. Confirm they can install the plugin or extension on their machines. That's the most common blocker, so check it before the day, not on it.

| Time | Step | Commands |
|------|------|----------|
| 0:00 | Introductions. What they're preparing for, and what "good" looks like by the end | — |
| 0:10 | Install check and project scaffold | `/arckit:start`, `/arckit:init` |
| 0:20 | Principles and stakeholders, from their existing documents where possible | `/arckit:principles`, `/arckit:stakeholders` |
| 0:45 | Requirements | `/arckit:requirements` |
| 1:05 | Break | — |
| 1:10 | The assessment they have coming up, one of: TCoP, Service Standard, Secure by Design, DPIA, SOBC | `/arckit:tcop`, `/arckit:service-assessment`, `/arckit:secure`, `/arckit:dpia`, `/arckit:sobc` |
| 1:35 | Review together: what's right, what's wrong, what they'd change. Show citations and the provenance block | `/arckit:health` |
| 1:50 | Next steps, and what they'd need to keep using it. Ask about the adopter form and a case study, softly, once | — |

**Timing (opt-in):** with the team's consent, ask how long the assessment document at 1:10 normally takes them, then time it. Record both numbers and the review time at 1:35. One honest number from a real team beats any vendor's percentage, but only publish it with their approval.

**After:** within 2 days, send a short summary and anything that broke. File every bug the workshop found as a GitHub issue (with their permission) and credit them.

---

## 5. Case-study interview script (30 minutes)

Ask for permission to record for note-taking only. Nothing is published without their approval of the text.

1. **Context (5 min).** What does your team do? What were you preparing for when you first tried ArcKit?
2. **Before (5 min).** How did you produce those documents before? How long did it take, and who was involved? What went wrong?
3. **What you did (8 min).** Which commands did you run, in what order? What did you have to fix by hand? Did anything surprise you?
4. **What changed (7 min).** What's different now: time, quality, the conversation with assessors or the design authority? Is there a number you'd be comfortable sharing, even a rough one?
5. **Honest gaps (3 min).** What didn't work, or what would you need before recommending it to another team?
6. **Close (2 min).** How do you want to be named (organisation, role only, anonymous)? Would your comms team rather publish it on your own blog?

---

## 6. Case-study template

Target 800–1,200 words. Follow the article rules: plain language, no Markdown tables, and lead with what changed for them.

```markdown
# [Organisation or sector]: [the outcome, in their words]

**[One-paragraph summary: who they are, what they needed, what changed. Include one number if they approved it.]**

## The situation
[What they were preparing for. The pressure: a deadline, an assessment, the team's size.]

## What they tried before
[How the documents were produced, and what that cost.]

## What they did with ArcKit
[The commands in the order they ran them, in plain language. What they fixed by hand.]

## What changed
[The outcome. A quote from the adopter goes here.]

## What they'd tell another team
[Their advice, including the honest gaps.]

---

*[Organisation] uses ArcKit, the open-source architecture governance harness. [Adopter form link] · [Discord] · [LinkedIn group]*
```

**Approval checklist:** named quote approved word-for-word · organisation name use approved (or anonymised) · any numbers approved · their comms team has seen it, if they need to · publication date agreed.

---

## 7. First four LinkedIn posts

Written for the ArcKit page. Adapt them, don't paste them. Each links to the adopter form or the landing page with `?utm_campaign=show-your-working&utm_source=linkedin`.

**Post 1 (launch, week 1):**

> ArcKit has more than 2,200 stars on GitHub, and I can name almost none of the organisations using it.
>
> That's deliberate. ArcKit collects no usage data, and it never will. A governance tool shouldn't report on the projects it helps.
>
> So I'm asking instead. If your team uses ArcKit, tell me. You can be named, listed anonymously by sector, or not listed at all. Two minutes: [link]
>
> In return: monthly office hours, four free pilot workshops this quarter, and a say in what gets built next.

**Post 2 (artefact walkthrough, week 2):**

> One artefact, 20 minutes: a Strategic Outline Business Case.
>
> I ran /arckit:sobc on a public test project, an NHS appointment booking service. Here's what it produced, following the Green Book five-case structure, and here are the three things I still had to fix by hand. [screenshots]
>
> That second list matters. ArcKit writes the first draft and shows where every figure came from. Sign-off stays with a person. [link]

**Post 3 (objection, week 3):**

> "We can't use AI on governance documents."
>
> A fair position. Here's what ArcKit does about it. Every claim cites its source. Every document records which model and settings produced it. Documents start as DRAFT, because approval is a human act. And there's a single page listing which rules are enforced in code and which still depend on the AI following instructions.
>
> It runs in AI coding assistants, including GitHub Copilot (not the Microsoft 365 one). If your team already has one approved, there's nothing new to buy. [link to landing page]

**Post 4 (office hours, week 3):**

> ArcKit office hours, [date], 60 minutes, open to anyone.
>
> Ten minutes of demo, from a blank repo to a Technology Code of Practice review, then your questions. Bring the awkward ones. [link]
