# ArcKit certification programme: design

> **Status:** draft for review, 14 October 2026. Section 4 (the levels) was agreed in conversation. Sections 5–10 use the recommended defaults and are marked **[default]** wherever a decision is still open.

## 1. Summary

ArcKit certification has four levels: **Awareness, Foundation, Practitioner and Expert**. Its job is adoption and credibility. It turns people who use ArcKit into named, visible practitioners, gives them a credential worth sharing, and feeds the adopter funnel in the [Q4 marketing plan](2026-09-22-marketing-strategy-q4.md).

It runs on GitHub and arckit.org. Awareness and Foundation are free online quizzes that issue a credential straight away. Practitioner and Expert are paid. Each one is a real piece of work that automated checks score first and the maintainer then reviews once a month.

## 2. Goals and non-goals

**Goals**

- Give people who use ArcKit a credential they want to share on LinkedIn, so that each certificate is public evidence of adoption.
- Produce named Practitioners and Experts, where today there are "no named reference customers".
- Teach the habits that make ArcKit output defensible: templates, citations, traceability, provenance, and people making the decisions.
- Turn Practitioner submissions and Expert contributions into case studies, adopters and contributors.

**Non-goals**

- **Not a general architecture qualification.** It certifies skill with ArcKit. It sits alongside TOGAF, BCS and the DDaT architecture roles and doesn't compete with them.
- **Not a revenue line.** The fees pay for review time and screen out low-effort submissions.
- **Not a proctored, high-stakes exam.** The free levels are open-book. Practitioner and Expert are the real assurance because they assess work, not recall.
- **Not a channel for real government data.** Submissions are fictional projects, public projects or anonymised projects. Nothing classified above OFFICIAL is ever submitted.

## 3. Audience

| Who | Likely levels | What they get |
|---|---|---|
| Architects in UK departments, ALBs, NHS bodies and MOD (primary) | Foundation → Practitioner | A way to show they use AI drafting in a governed way |
| G-Cloud and DOS suppliers and consultancies (secondary) | Practitioner → Expert | Evidence for bids: "our architects are ArcKit Practitioners" |
| Managers, assessors, procurement and spend-control teams | Awareness | Enough to judge ArcKit output and know what to ask for |
| ArcKit users outside the UK (visitors from 93 countries) | Any, plus a jurisdiction track | The same core, with tracks that follow the overlays |

## 4. The levels (agreed 14 October)

| | **Awareness** | **Foundation** | **Practitioner** | **Expert** |
|---|---|---|---|---|
| **Proves** | Knows what ArcKit is: AI drafts, people decide. Knows what templates, citations, provenance and DRAFT status are for | Can choose and run the right commands for a project; knows what each document contains and how traceability connects them | Has produced a governed, traceable set of documents on a real or realistic project, and improved them by hand | Can lead ArcKit adoption in an organisation and extend ArcKit |
| **For** | Anyone | Architects, analysts, consultants | Practising architects | Leads and consultancies |
| **Learn from** | 8-minute explainer + Beginners Part 1 (~30 min) | Full Beginners guide + core command films (~3 h) | Doing it (10–20 h) | Experience |
| **Assessment** | 10-question quiz, 80% to pass, retries allowed | 40 scenario questions from a bank of ~150, 70% to pass | A repo with a minimum document set + a 500-word reflection. Automated pre-check, then monthly review | A portfolio + one contribution + a 45-minute conversation |
| **Prerequisite** | None | None | Foundation | Practitioner + 3 months |
| **Price** | Free | Free | £95 | £295 |

**Practitioner minimum documents:**
- principles (PRIN), stakeholders (STKE), requirements (REQ) and a risk register (RISK)
- at least 2 ADRs and one diagram (DIAG)
- a traceability matrix (TRAC)
- an `/arckit:analyze` report (ANAL)

The reflection says what the candidate changed after ArcKit drafted each document, and why. The git history has to show those human edits.

**Expert contribution** is one of:
- an overlay command
- a template made with `/arckit:template-builder`
- a recipe for `/arckit:build`
- a published case study
- a pilot workshop the candidate ran

The contribution has to be public or verifiable.

## 5. What the learning covers

The course material already exists: the explainer, *ArcKit for Beginners* (four parts) and the 76 command films in the "ArcKit commands (experimental)" playlist. The certification pages link to them by level and add nothing new except the quizzes.

**Foundation syllabus [default]:**

| Domain | Weight | Sources |
|---|---|---|
| D1 Governed AI drafting: templates, DRAFT status, human approval, what ArcKit won't do | 15% | Beginners Part 1, `ENFORCEMENT.md` |
| D2 Choosing commands: the core path, what comes next, handoffs | 25% | `architecture-workflow` skill, command films |
| D3 Document types and what each contains, Document Control | 20% | `docs/guides/`, templates |
| D4 The traceability chain and citations | 20% | Beginners Parts 2–3, `citation-instructions.md` |
| D5 What hooks enforce, what is only asked of the model, provenance | 10% | `ENFORCEMENT.md`, `hooks/README.md` |
| D6 Setup: plugin install, other assistants, overlays, `templates-custom` | 10% | README, `docs/guides` |

Questions test scenarios, not recall. For example: "Your stakeholder analysis is approved. Which two commands come next, and why?"

## 6. How assessment works

### 6.1 Awareness and Foundation quizzes

- **Pages:** quiz pages on arckit.org under `/certification/`. A small **Cloudflare Worker** marks the answers, so the answer key never reaches the browser. **[default]**
- **On a pass:** the Worker returns a signed credential (see §7), so there's no account and no database.
- **Question bank:** held in a private repo and served by the Worker. Each Foundation attempt draws 40 questions, weighted by domain.
- **Integrity:** these levels are open-book and low-stakes by design. The real gate is Practitioner.
- **Keeping it current:** a CI check confirms every command and doc-type named in a question still exists in `doc-types.mjs` and `commands/`, so questions can't silently go stale.

### 6.2 Practitioner

1. **Submit.** Through a GitHub issue form, "Practitioner submission". The candidate gives the repo URL (public, or private with read access granted to an `arckit-review` account), the reflection, the track (optional) and confirmation that the content is fictional, public or anonymised and nothing is classified above OFFICIAL.
2. **Automated pre-check.** A GitHub Action, using deterministic scripts only, posts a scored report on the issue within minutes. It checks:
   - the minimum document set is present, with valid `ARC-*` filenames (reusing `validate-arc-filename.mjs` and `doc-types.mjs`)
   - Document Control is complete and the documents carry Build Provenance blocks
   - traceability coverage: every requirement ID appears in the traceability matrix
   - citation markers resolve to an External References section
   - the git history shows human edits after the provenance-stamped drafts
   - no OFFICIAL-SENSITIVE or higher classification markers
3. **Payment.** It's requested only once the pre-check passes, so nobody pays for an automatic fail.
4. **Monthly review.** The maintainer scores five criteria from 0 to 4: completeness, traceability, quality of human judgement in the edits and reflection, correct command use, and governance hygiene. **A pass needs 14 of 20 with no zero.**
5. **Result.** Posted on the issue, with feedback either way. One free resubmission within 60 days.

### 6.3 Expert

- **Submission.** The candidate submits a portfolio: at least two Practitioner-grade projects, or one large real one described in a write-up. They add their contribution and a 300-word account of the adoption they led.
- **Conversation.** A 45-minute video call about the decisions they made, where ArcKit fell short and how they handled it.
- **Review.** The maintainer assesses at first. From the fifth Expert onward, an existing Expert is invited as second reviewer. **[default]**

### 6.4 Integrity

- **Identity.** For paid levels, the name on the credential must match the payment and a public profile.
- **Originality.** Submissions are checked for forks or copies of the public test repos and of earlier submissions.
- **What certification means.** It confirms the person's ArcKit skill. It doesn't endorse their work or their organisation. This sentence appears on every credential page.

## 7. Credentials

- **Format:** **Open Badges 3.0** (W3C Verifiable Credentials), signed with an ArcKit Ed25519 key. The issuer profile is published at `arckit.org/certification/issuer.json`. Anyone can verify a badge, and no third-party platform is involved.
- **Badge art:** one badge per level in the series look (navy blueprint, teal, the ArcKit mark), plus a small mark for each track.
- **LinkedIn:** each credential page has an "Add to LinkedIn" link that pre-fills name, issuing organisation (the ArcKit page), credential ID and URL.
- **Validity [default]:**
  - Awareness and Foundation name the major version (for example "ArcKit 6") and don't expire.
  - Practitioner and Expert are valid until the next major version plus 12 months, then renew through a free 15-question update quiz.
- **Public register:** `arckit.org/certified` lists Practitioners and Experts who opt in, with name, organisation, LinkedIn and tracks. This register is the "named" evidence the marketing plan needs.

## 8. Specialist tracks

Tracks are optional add-ons to Practitioner and follow the overlays. A track adds the jurisdiction's documents to the submission:

| Track | Extra documents | Launch |
|---|---|---|
| **UK Government** | TCoP review, service assessment prep, Secure by Design | **At launch** |
| UK Health | DTAC and clinical safety (DCB0129/0160) via the NHS overlay | When an overlay contributor co-reviews |
| EU, France, Canada, Australia, UAE, US federal, Netherlands, Austria | The overlay's own assessments | Same |
| UK Finance Payments, TOGAF ADM | The overlay's own documents | Same |

- **Fee:** **[default]** included at first submission, or £45 to add a track later.
- **Reviewers:** each new track needs a co-reviewer from the overlay's contributors. That also gives community maintainers a role.

## 9. Operations

- **Monthly cycle [default]:**
  - Submissions close on the last Friday of the month.
  - Reviews happen in the first week of the next month, with results by the 10th.
- **Capacity cap [default]:** 10 Practitioner and 3 Expert reviews a month, then a waitlist. Allowing about 30 minutes per Practitioner (the pre-check does the counting) and 90 minutes per Expert, that's roughly **10 hours a month**.
- **Payments [default]:**
  - **Provider:** **Lemon Squeezy or Paddle as merchant of record**, so they handle UK and EU VAT on digital services. That's simpler than plain Stripe.
  - **Refunds:** in full if a submission is withdrawn before review.
- **Issuer:** the legal entity behind the credentials and payments still needs deciding (see §12).
- **Data protection:**
  - **What is kept:** name, email, LinkedIn URL and the result.
  - **Retention:** copies of submissions are deleted 90 days after the result.
  - **Notice:** a privacy notice sits on the certification pages.
  - **Register:** opt-in only.
- **Use of the name:** a short note on how certified people may describe themselves ("ArcKit Practitioner, ArcKit 6") and the badge artwork they may use.

## 10. Build and launch plan

| Phase | What | Fits the Q4 plan |
|---|---|---|
| **1. Awareness (2 weeks)** | `/certification/` landing page, Awareness quiz, Worker marking and signing, Open Badges issuer, badge art, LinkedIn link | Launch at Office hours #1 (26 Oct) |
| **2. Foundation (3 weeks)** | Syllabus, a 150-question bank written from `docs/guides` and `ENFORCEMENT.md`, the staleness CI check, Foundation quiz | Live by mid-November |
| **3. Practitioner pilot (4 weeks)** | Issue form, pre-check Action, rubric, payment, register. First cohort by invitation: the first adopters (#923/#924) and LinkedIn group members | December pilot, first named Practitioners |
| **4. Expert + UK Government track** | Expert form and conversation, UK Government track, second-reviewer scheme | Q1 2027 |

## 11. Success measures (end of Q1 2027)

| Measure | Target |
|---|---|
| Awareness credentials | 300+ |
| Foundation credentials | 100+ |
| Practitioners (pilot and first intakes) | 10 |
| Experts | Intake open. 3 by the end of Q2 2027, since Expert needs 3 months as a Practitioner |
| Certified people who become named adopters or case studies | 5 |
| Credentials shared on LinkedIn (from the link's click-through) | 40% of those issued |

## 12. Risks and open questions

| Risk | Mitigation |
|---|---|
| Review time grows faster than expected | Monthly cap and waitlist, with Experts as second reviewers from the fifth Expert |
| Questions go stale as commands change (76 and counting) | Questions test stable concepts; a CI check catches commands and doc-types that no longer exist |
| Free levels get gamed | Accepted by design. Assurance comes from Practitioner, which assesses real work |
| Real government content gets submitted | Declaration on the form, a classification-marker check in the pre-check, and deletion after 90 days |
| Seen as competing with TOGAF or BCS | Positioned as skill with a tool that works alongside them |
| Payments and VAT | A merchant of record |

**Open questions for the maintainer**

1. **Issuer:** which legal entity issues the credentials and takes payments?
2. **Currency:** sterling only, or regional prices?
3. **Projects:** can a Practitioner submission be fully fictional? Recommended: yes, but it must be original, not a copy of a test repo.
4. **Badge art:** should it be a HyperFrames job in the series look, or commissioned?
5. **Second reviewer:** start the Expert second-reviewer scheme at the fifth Expert, or sooner?
