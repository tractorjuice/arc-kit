# ArcKit certification programme: design

> **Status:** draft for review, 14 October 2026. Section 4 (the levels) was agreed in conversation. Sections 5–10 use the recommended defaults and are marked **[default]** wherever a decision is still open. Also on 14 October, the maintainer adopted the exam design and policies drawn from GCATI (see the end of §1, and §6.5), and Awareness moved to a 30-question pool with a signed draw.

## 1. Summary

ArcKit certification has four levels: **Awareness, Foundation, Practitioner and Expert**. Its job is adoption and credibility. It turns people who use ArcKit into named, visible practitioners, gives them a credential worth sharing, and feeds the adopter funnel in the [Q4 marketing plan](2026-09-22-marketing-strategy-q4.md).

It runs on GitHub and arckit.org. Awareness and Foundation are free online quizzes that issue a credential straight away. Practitioner and Expert are paid. Each one is a real piece of work that automated checks score first and the maintainer then reviews once a month.

**Evidence from GCATI.** The exam design and policies draw on GCATI, the maintainer's earlier certification business, which ran a ladder from Awareness to Master in Wardley Mapping and other subjects. ArcKit takes its item-writing rules, its 4:1 question banks and domain weighting, and its policies on appeals, access arrangements, malpractice and conflicts of interest. It departs where GCATI's own evidence pointed the other way: a fixed 10-question quiz could be passed by elimination, its 80% pass mark was set for recall rather than scenarios, and it never finished an objective Practitioner exam.

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
| **Assessment** | 10 questions drawn from a pool of 30, 80% to pass, unlimited attempts (each a fresh draw) | 40 questions, mostly scenarios, from a bank of 160. 70% to pass, 60 minutes, retake after 24 hours | A repo with a minimum document set + a 500-word reflection. Automated pre-check, then monthly review | A portfolio + one contribution + a 45-minute conversation |
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

**Foundation syllabus:**

| Domain | Weight | Questions (paper / bank) | Sources |
|---|---|---|---|
| D1 Governed AI drafting: templates, DRAFT status, human approval, what ArcKit won't do | 15% | 6 / 24 | Beginners Part 1, `ENFORCEMENT.md` |
| D2 Choosing commands: the core path, what comes next, handoffs | 25% | 10 / 40 | `architecture-workflow` skill, command films |
| D3 Document types and what each contains, Document Control | 20% | 8 / 32 | `docs/guides/`, templates |
| D4 The traceability chain and citations | 20% | 8 / 32 | Beginners Parts 2–3, `citation-instructions.md` |
| D5 What hooks enforce, what is only asked of the model, provenance | 10% | 4 / 16 | `ENFORCEMENT.md`, `hooks/README.md` |
| D6 Setup: plugin install, other assistants, overlays, `templates-custom` | 10% | 4 / 16 | README, `docs/guides` |

The bank holds four questions for every one on the paper: 160 for a 40-question paper.

Most questions test scenarios, not recall. About 25% are at Bloom's level 2 (understand), mostly in D3 and D6. The other 75% are level-3 scenarios (apply). For example: "Your stakeholder analysis is approved. Which two commands come next, and why?"

Some questions share an exhibit: a REQ table, a TRAC row, a provenance block or a hook message, with 3–4 questions on each.

## 6. How assessment works

### 6.1 Awareness and Foundation quizzes

- **Pages:** quiz pages on arckit.org under `/certification/`. A small **Cloudflare Worker** marks the answers, so the answer key never reaches the browser. **[default]**
- **On a pass:** the Worker returns a signed credential (see §7). There's no account. The Worker keeps each issued credential (the name, level, time and signed credential) in Workers KV so its short credential link keeps working; nothing else is stored.
- **Question bank:** held in a private repo and served by the Worker. The Worker never sends answers or explanations with the questions.
- **Awareness draw (live since 14 October 2026):**
  - A pool of 30 questions, six in each of five domains: what ArcKit is and how it runs; people make the decisions; templates and document control; citations and provenance; requirements and traceability.
  - Each attempt draws 10, two from each domain, in random order. The Worker signs the draw, so a submission is marked against the questions it was given. A draw expires after 1 hour and can be submitted once.
  - Pass at 8 of 10. Attempts are unlimited, and each one is a fresh draw.
  - **On a pass**, the candidate sees every question with the correct answer and a short explanation.
  - **On a fail**, they see the areas to revisit (the domains where they got a question wrong), but not the score or which questions were wrong.
- **Foundation attempts:**
  - Each attempt draws 40 questions from the bank of 160, weighted by domain (§5).
  - Pass at 70%, because most questions are scenarios. GCATI's 80% was set for recall questions.
  - 60 minutes, enforced by the Worker, with 25% more time as an access arrangement (§6.5).
  - A retake is allowed after 24 hours, and each one is a fresh draw.
  - Open book and unproctored.
- **Writing Foundation questions:**
  - Each question has one correct answer and plausible distractors.
  - No "all of the above" or "none of the above", and no negatives in the stem.
  - Every option carries a rationale: why it is right, or why it is wrong.
  - Each question moves through Draft → Reviewed (by a second reviewer) → Approved → Retired.
- **Integrity:** these levels are open-book and low-stakes by design. The draw from a larger pool and Foundation's 24-hour wait make it harder to pass by elimination or to harvest the bank. The real gate is Practitioner.
- **Keeping it current:** a CI check confirms every command and doc-type named in a question still exists in `doc-types.mjs` and `commands/`, and retires any question that names a stale command. Questions can't silently go stale.

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
4. **Monthly review.** The maintainer scores five criteria from 0 to 4: completeness, traceability, quality of human judgement in the edits and reflection, correct command use, and governance hygiene. **A pass needs 14 of 20 with no zero.** The published rubric describes what a 2 and a 4 look like on each criterion.
5. **Result.** Posted on the issue, with feedback either way. One free resubmission within 60 days. The candidate can ask for a re-check or appeal (§6.5).

### 6.3 Expert

- **Submission.** The candidate submits a portfolio: at least two Practitioner-grade projects, or one large real one described in a write-up. Each project must be under 3 years old and on the current major version. They add their contribution and a 300-word account of the adoption they led.
- **Conversation.** A 45-minute video call about the decisions they made, where ArcKit fell short and how they handled it.
- **Review.** The maintainer assesses at first. From the fifth Expert onward, an existing Expert is invited as second reviewer. **[default]**
- **No Master level.** Expert is the top level. The title "Master" is reserved for trained reviewers later.

### 6.4 Integrity

- **Identity.** For paid levels, the name on the credential must match the payment and a public profile.
- **Originality.** Submissions are checked for forks or copies of the public test repos and of earlier submissions.
- **What certification means.** It confirms the person passed the ArcKit assessment at that level. It doesn't endorse their work or their organisation. This sentence appears on every credential page.

### 6.5 Policies

These apply at every level. A public policies page is being published at `https://arckit.org/certification/policies.html`. Requests and complaints go to [GitHub issues](https://github.com/tractorjuice/arc-kit/issues) or the ArcKit Discord. For anything sensitive, say "private" in the issue and we move to email.

- **Appeals:**
  1. Ask for a re-check within 10 working days of the result. ArcKit answers within 10 working days.
  2. Then make a procedural appeal within a further 10 working days. Someone not involved in the original decision decides it: an Expert or an overlay co-reviewer.
  3. Appeals cover procedure and fairness, not the reviewer's academic judgement.
- **Access arrangements** (reasonable adjustments):
  - They remove barriers without giving an advantage.
  - They include up to 25% extra time, alternative formats, and, at Practitioner and Expert, a video or audio reflection in place of written evidence.
  - A candidate can defer to the next review cycle free of charge.
  - Ask before the assessment, through a GitHub issue marked private or by email. No medical detail is needed beyond what's relevant.
- **Malpractice:**
  - This covers plagiarism, impersonation, submitting someone else's work and giving false information.
  - The credential is suspended while an investigation runs, and revoked if the finding is upheld (§7).
  - An appeal against a malpractice finding succeeds only on procedure or new evidence.
- **Conflicts of interest:** reviewers declare their interests every year and step aside from colleagues, clients and trainees. If that can't be avoided, a second reviewer checks the result.
- **Complaints** about the service go to a GitHub issue or by email. ArcKit acknowledges them within 5 working days.
- **Yearly report:** ArcKit publishes pass rates, appeals and access arrangements once a year.

## 7. Credentials

- **Format:** **Open Badges 3.0** (W3C Verifiable Credentials), signed with an ArcKit RSA key (RS256, the Open Badges 3.0 baseline that every verifier supports). The issuer profile is published at `arckit.org/certification/issuer.json`. Anyone can verify a badge, and no third-party platform is involved.
- **Badge art:** one badge per level in the series look (navy blueprint, teal, the ArcKit mark), plus a small mark for each track.
- **Wording:** each credential says what the person passed, for example "has passed ArcKit Awareness (ArcKit 6)". It never says "proficiency" or "certified competence".
- **LinkedIn:** each credential page has an "Add to LinkedIn" link that pre-fills name, issuing organisation (the ArcKit page), credential ID and URL.
- **Validity:** pinned to the ArcKit major version, never to a fixed term. GCATI's 2–3-year expiry is not adopted.
  - Awareness and Foundation name the major version (for example "ArcKit 6") and don't expire.
  - Once a successor major version ships, new credentials issued for the old version carry a `validUntil` date.
  - Practitioner and Expert are valid until the next major version plus 12 months, then renew through a free 15-question update quiz. **[default]**
- **Revocation:** a credential revoked for malpractice (§6.5) is published through an Open Badges 3.0 `credentialStatus` list, once that's implemented. Until then, the credential record is removed and its page shows "Not valid".
- **Public register:** `arckit.org/certified` lists Practitioners and Experts who opt in, with name, organisation, LinkedIn and tracks. This register is the "named" evidence the marketing plan needs.

## 8. Specialist tracks

Tracks are optional add-ons to Practitioner and follow the overlays. A track adds the jurisdiction's documents to the submission:

| Track | Extra documents | Launch |
|---|---|---|
| **UK Government** | TCoP review, service assessment prep, Secure by Design | **At launch** |
| UK Health | DTAC and clinical safety (DCB0129/0160) via the NHS overlay | When an overlay contributor co-reviews |
| EU, France, Canada, Australia, UAE, US federal, Netherlands, Austria | The overlay's own assessments | Same |
| UK Finance Payments, TOGAF ADM | The overlay's own documents | Same |

- **Credential:** each track is a linked micro-credential, for example "ArcKit Practitioner – UK Government". Adding a track issues a new badge rather than re-issuing the Practitioner one.
- **Fee:** **[default]** included at first submission, or £45 to add a track later.
- **Reviewers:** each new track needs a co-reviewer from the overlay's contributors. That also gives community maintainers a role.

## 9. Operations

- **Monthly cycle [default]:**
  - Submissions close on the last Friday of the month.
  - Reviews happen in the first week of the next month, with results by the 10th.
- **Reviewers:** follow the conflicts-of-interest policy (§6.5).
- **Capacity cap [default]:** 10 Practitioner and 3 Expert reviews a month, then a waitlist. Allowing about 30 minutes per Practitioner (the pre-check does the counting) and 90 minutes per Expert, that's roughly **10 hours a month**.
- **Payments [default]:**
  - **Provider:** **Lemon Squeezy or Paddle as merchant of record**, so they handle UK and EU VAT on digital services. That's simpler than plain Stripe.
  - **Refunds:** in full if a submission is withdrawn before review. The review is the service, so the 14-day cancellation right ends when the review starts.
  - **Waivers:** students and people in low-income countries can ask for a waiver at Practitioner and Expert.
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
| **1. Awareness (2 weeks)** | `/certification/` landing page, Awareness quiz (30-question pool and signed draw since 14 Oct), Worker marking and signing, Open Badges issuer, badge art, LinkedIn link, policies page | Launch at Office hours #1 (26 Oct) |
| **2. Foundation (3 weeks)** | Syllabus, a 160-question bank written from `docs/guides` and `ENFORCEMENT.md` and second-reviewed, the staleness CI check, Foundation quiz with a 60-minute limit | Live by mid-November |
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

Pass rates, appeals and access arrangements also go into the yearly report (§6.5).

## 12. Risks and open questions

| Risk | Mitigation |
|---|---|
| Review time grows faster than expected | Monthly cap and waitlist, with Experts as second reviewers from the fifth Expert |
| Questions go stale as commands change (76 and counting) | Questions test stable concepts; a CI check catches commands and doc-types that no longer exist and retires those questions |
| Free levels get gamed | Accepted by design, but limited: each attempt is a fresh draw from a larger pool, and Foundation retakes wait 24 hours. Assurance comes from Practitioner, which assesses real work |
| Real government content gets submitted | Declaration on the form, a classification-marker check in the pre-check, and deletion after 90 days |
| Seen as competing with TOGAF or BCS | Positioned as skill with a tool that works alongside them |
| Payments and VAT | A merchant of record |

**Open questions for the maintainer**

1. **Issuer:** which legal entity issues the credentials and takes payments?
2. **Currency:** sterling only, or regional prices? **Answered (14 Oct):** waivers instead of regional prices. Students and people in low-income countries can ask for a waiver at the paid levels (§9).
3. **Projects:** can a Practitioner submission be fully fictional? Recommended: yes, but it must be original, not a copy of a test repo.
4. **Badge art:** should it be a HyperFrames job in the series look, or commissioned?
5. **Second reviewer:** start the Expert second-reviewer scheme at the fifth Expert, or sooner?
