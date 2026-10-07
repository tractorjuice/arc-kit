---
description: Review a G-Cloud 15 service submission for completeness before submission to GCA
doc-type: GCRV
effort: high
handoffs:
  - command: /arckit-uk-gcloud:submission-pack
    description: Bundle the service documents once the review is clean
---

> ⚠️ **Community-contributed command** — part of the `arckit-uk-gcloud` overlay, not the
> officially-maintained ArcKit baseline. The review report produced here is an internal readiness aid
> for a G-Cloud 15 (RM1557.15) Digital Marketplace service submission; it is **not** legal,
> financial, or procurement advice and **does not guarantee acceptance** by GCA (the Government
> Commercial Agency, formerly CCS). GCA may request additional information, some issues only surface
> during its evaluation, and G-Cloud 15 bids are scored, so a pack that passes every check can still
> score poorly. Confirm framework requirements against GCA's current tender documents before
> submitting.

You are helping a cloud service supplier **review a G-Cloud 15 service submission for completeness
and consistency** before submitting it to GCA through the Digital Platform.

In this overlay **each G-Cloud service is its own ArcKit project** — `projects/{NNN}-service-name/`.
This command does **not** create a new project: the service project was created earlier by
`/arckit-uk-gcloud:service-design`. This command **resolves the existing service project**, checks its
per-service artefacts plus the supplier-wide documents, and writes a completeness/quality review
report into the project.

## User Input

```text
$ARGUMENTS
```

## Instructions

### 1. Resolve the existing service project

The user should identify the service in `$ARGUMENTS` by **service name** (or name fragment) or by
**project number** (e.g. `004` or `secure-case-mgmt`). List the existing projects as JSON and match
against `$ARGUMENTS`:

```bash
bash "${CLAUDE_PLUGIN_ROOT}/scripts/bash/list-projects.sh" --json
```

From the JSON `projects[]` array, each entry has `name`, `number`, and `path`. Resolve the target:

- If `$ARGUMENTS` is (or contains) a project number, match on `number`.
- Otherwise match the `name` field case-insensitively against the service name / fragment in
  `$ARGUMENTS`.
- If exactly one project matches, use it. If several match, use the **AskUserQuestion** tool to let
  the user pick. If `$ARGUMENTS` is empty, list the candidate projects and ask which one.

**$ARGUMENTS bypass for review scope:** If `$ARGUMENTS` contains `full`,`completeness`,
`consistency`, or`readiness` (beyond the service name), use that to set the review scope in Step 3
and skip the scope question.

**If no matching project is found**, tell the user the service project does not exist and that they
must run `/arckit-uk-gcloud:service-design` first to create it, then **stop** (do not create a project here).

From the matched project record extract:

- `path` — the service project directory (e.g. `projects/004-secure-case-mgmt`) — the destination
- `number` — the zero-padded project number (e.g. `004`) — use as `PROJECT_ID`
- `name` — the project / service name

### 2. Load the documents under review

Use the **Read tool** on the highest version of each artefact. Per-service artefacts live in the
resolved project directory; the supplier-wide documents live under `projects/000-global/supplier/`.

**Per-service artefacts (this project):**

- Service design — `{path}/ARC-{PROJECT_ID}-SVCD-v*.md` (written by `/arckit-uk-gcloud:service-design`)
- Service Definition Document — `{path}/ARC-{PROJECT_ID}-SDD-v*.md` (written by the lot's own
  command: `/arckit-uk-gcloud:sdd-lot1a`, `sdd-lot1b`, `sdd-lot2a`, `sdd-lot2b` or `sdd-lot3`)
- Pricing — `{path}/ARC-{PROJECT_ID}-PRIC-v*.md` (written by `/arckit-uk-gcloud:pricing`)
- Security evidence — `{path}/ARC-{PROJECT_ID}-SECA-v*.md` (written by `/arckit-uk-gcloud:security`)

**Supplier-wide documents:**

- Supplier profile — `projects/000-global/supplier/ARC-000-SUPP-v*.md` (`/arckit-uk-gcloud:supplier-profile`)
- Social value commitments — `projects/000-global/supplier/ARC-000-SOCV-v*.md`
  (`/arckit-uk-gcloud:social-value`)
- Lot questions — `projects/000-global/supplier/ARC-000-LOTQ-v*.md` (`/arckit-uk-gcloud:lot-questions`); only
  the Part for this service's lot group matters here: Part 1 (Lots 1a/1b), Part 2 (Lots 2a/2b) or
  Part 3 (Lot 3)
- Supplier declaration — `projects/000-global/supplier/ARC-000-DECL-v*.md` (`/arckit-uk-gcloud:declaration`)

Review whatever exists. Don't stop because a document is missing. For each document, record whether
it **exists** and its highest version. A missing document — or a LOTQ document without the Part for
this lot group — is a blocking finding; note the command that produces it.

**Find the lot.** The service design records it on its `**G-Cloud Lot**: Lot <code> — <name>`
line. It must be `1a`, `1b`, `2a`, `2b` or `3`. A service design from the previous framework (a
"1.3 Target Lot" checkbox with Lot 1 Cloud Hosting / Lot 2 Cloud Software / Lot 3 Cloud Support), or
no lot at all, is a blocking finding: re-run `/arckit-uk-gcloud:service-design` to choose a G-Cloud 15 lot.
Without a valid lot, the lot-specific checks below cannot run.

**Read the framework reference.** Use the **Read tool** on:

- `${CLAUDE_PLUGIN_ROOT}/skills/gcloud-framework/references/framework-questions.md` — the limits,
  evaluation weights, pricing rules and certification conditions
- this lot's service questions only: `${CLAUDE_PLUGIN_ROOT}/skills/gcloud-framework/references/g-cloud-15/lot-{LOT}-services.md`
  (the checklist for the SDD; together the `g-cloud-15/` files are about 280 KB, so don't read the
  others)
- this lot group's lot questions: `${CLAUDE_PLUGIN_ROOT}/skills/gcloud-framework/references/g-cloud-15/lot-{GROUP}-lot-questions.md`
  (the checklist for the LOTQ Part)
- for Lot 3 only, `${CLAUDE_PLUGIN_ROOT}/skills/ddat-rate-card/references/lot-3-rate-card.md`

Read `${CLAUDE_PLUGIN_ROOT}/skills/gcloud-framework/references/g-cloud-15/social-value-model.md`
only if a social value measure in the SOCV document needs checking against GCA's wording.

**Citation traceability**: When you read any document the user has placed under the project's
`external/`, `policies/`, or `vendors/` directories, or fetch a G-Cloud listing page or GCA
guidance, follow the citation instructions in
`${CLAUDE_PLUGIN_ROOT}/references/citation-instructions.md`. Place inline citation markers (e.g.
`[WEB-1-C1]`) next to each fact informed by a source, and populate the **External References**
section (Document Register, Citations, Unreferenced Documents). The ArcKit artefacts under review are
internal project documents and are referenced by their `ARC-` IDs, not as external citations.

### 3. Run the review checks

Set the review scope from the `$ARGUMENTS` bypass in Step 1, or — if none was given — ask in one
**AskUserQuestion** call, following `${CLAUDE_PLUGIN_ROOT}/references/interview-pattern.md`:

1. **Full review (Recommended)** — all checks (3a–3e) and a complete report
2. **Completeness check** — 3a only (documents + mandatory fields)
3. **Consistency audit** — 3b only (cross-document contradictions)
4. **Submission readiness** — 3a + 3c + 3e (completeness + limits + common rejections), pass/fail
   focused on blocking issues

In a headless run, take the full review and list it as an assumption. Reference each finding back to
the relevant `ARC-` document ID so the user can locate it.

#### 3a. Completeness checks

**Document existence** (reference each by its ARC-ID):

- [ ] Supplier profile — `ARC-000-SUPP`
- [ ] Social value commitments — `ARC-000-SOCV`
- [ ] Lot questions — `ARC-000-LOTQ`, with the Part for this service's lot group
- [ ] Supplier declaration — `ARC-000-DECL`
- [ ] Service design — `ARC-{PROJECT_ID}-SVCD`
- [ ] Service Definition Document — `ARC-{PROJECT_ID}-SDD`
- [ ] Pricing — `ARC-{PROJECT_ID}-PRIC`
- [ ] Security evidence — `ARC-{PROJECT_ID}-SECA`

**Lot:**

- [ ] The lot is one of `1a`, `1b`, `2a`, `2b`, `3`, and the SVCD, SDD, PRIC and SECA all give the
  same lot on their `**G-Cloud Lot**` lines
- [ ] The service fits that lot's definition (Lot 1b only for services meeting above-OFFICIAL
  requirements)
- [ ] Service categories come from the lot's category roots: 1a/1b IaaS, PaaS; 2a Systems
  Infrastructure Software, Application Development and Deployment; 2b Applications, Application
  Development and Deployment; 3 Cloud Support Services

**SDD mandatory fields** (`ARC-{PROJECT_ID}-SDD`): every question in the lot's
`g-cloud-15/lot-{LOT}-services.md` has an answer. In particular:

- [ ] Service name (≤ 100 characters, the name only with no extra keywords)
- [ ] Service description (≤ 500 characters)
- [ ] Service features (≤ 10 items, each ≤ 10 words)
- [ ] Service benefits (≤ 10 items, each ≤ 10 words)
- [ ] Supplier type (reselling) answered on every lot: one of the four options (not a reseller;
  reseller with extra features and support; reseller with extra support; reseller with no extras),
  naming the organisation resold for any reseller. Lots 1a/1b also answer Reseller or Sole Control of
  the Infrastructure in Part 1 of the LOTQ document, and the two answers must agree
- [ ] Lots 2a/2b: multi-cloud support answered
- [ ] Lots 1a/1b, 2a/2b: system requirements (each ≤ 10 words)

**Pricing fields by lot** (`ARC-{PROJECT_ID}-PRIC`):

- [ ] **1a/1b:** baseline price with its pricing web link, fixed onboarding costs, framework
  (minimum) discount, any further supplier-specific schemes and time-limited discounts, per
  deployment model. Lot 1b: prices go on the separate non-public platform
- [ ] **2a/2b:** unit prices in the pricing document, and a discount % for each of the six annual
  call-off value bands (under £250,000; £250,000–£500,000; £500,001–£1m; £1,000,001–£2.5m;
  £2,500,001–£5m; over £5m)
- [ ] **3:** a DDaT rate card: a maximum UK day rate (and offshore, if offered) for every role level
  offered, each role and level present in `lot-3-rate-card.md`, every rate at least £50, for a
  7.5-hour day with travel and subsistence inside the M25 included
- [ ] Education pricing addressed; free trial addressed (1a/1b, 2a/2b)
- [ ] Prices in GBP; no forbidden pricing: no "price on application" or POA, no "from £x", no
  unexplained ranges
- [ ] No prices in the service definition document (they belong in the pricing document)

Price scoring, for context when reporting a pricing finding: on Lots 1a/1b price is 10% (onboarding
price 5%, minimum discount 5%); on Lots 2a/2b the six band discounts are totalled and the highest
total scores the full 80% (unit prices are not scored); on Lot 3 the lowest average day rate scores
the full 80%.

**Security fields** (`ARC-{PROJECT_ID}-SECA` and the SDD):

- [ ] Security standards declared
- [ ] Data-in-transit protection, asset protection, availability and resilience (1a/1b, 2a/2b)
- [ ] Separation between users (1a/1b)
- [ ] Governance, operational security (including post-quantum cryptography), secure development,
  identity and authentication, audit information (1a/1b, 2a/2b); 2a/2b also the Software Security
  Code of Practice
- [ ] Staff security answered (Lot 1b: SC or DV only)

**Support and data fields** (`ARC-{PROJECT_ID}-SDD`):

- [ ] User support: email or ticketing, phone, web chat, AI chatbot and support levels answered
- [ ] Support availability and response times specified
- [ ] Onboarding and offboarding (1a/1b, 2a/2b)
- [ ] Backups and recovery, including what's backed up, each ≤ 10 words (1a/1b)
- [ ] Data importing and exporting (2a/2b)
- [ ] Data locations specified
- [ ] End of contract process and data extraction

**Social value** (`ARC-000-SOCV`): mandatory on every lot and scored pass/fail; a pass earns the
full 10%.

- [ ] Section A (understanding), B (commitment), C (organisational readiness) and operational
  readiness all answered
- [ ] A named Social Value Contact
- [ ] At least one Model Award Criteria activity selected, as mission → policy outcome → measure
  from the social value model (outcomes 1–4 and 6–8; outcome 5 is not used)
- [ ] Evidence recorded for each commitment

**Lot questions** (`ARC-000-LOTQ`, the Part for this service's lot group):

- [ ] **1a/1b, conditions of participation:** reseller or sole control; reliance on the cloud
  provider's accreditations; ISO 27018 where the service includes public cloud; trading under 12
  months
- [ ] **1a/1b, scored answers (40% each):** every part ≤ 250 words and answered in order: Quality
  Cloud Services parts a and b (500 words in all), Maximising Buyer Value parts a, b and c (750 words
  in all); no attachments
- [ ] **1a/1b, non-scored mandatory:** NCSC guidance, sanctions policies and controls, customer
  contractual exit procedure (≤ 250 words), engaging customers in a change of service (≤ 250 words)
- [ ] **1a/1b, certification conditions:** Cyber Essentials Plus (mandatory) awarded in the last 12
  months with its certificate number (or working towards it by framework award, or an IASME-certified
  equivalent); ISO 9001, ISO 27001 and ISO 20000-1; ISO 27018 if the service includes public cloud
  (Lots 1a and 1b; not needed for private cloud only); ISO 14001 and 27017 where the reseller answers
  require them; a Carbon Reduction Plan with its emissions figures
- [ ] **2a/2b and 3:** Cyber Essentials, which is mandatory for call-offs on these lots
- [ ] **2a/2b, mandatory award criteria:** user support (and when it is available), where user data
  is stored and processed, penetration testing frequency, an industry-standard data sanitisation
  process
- [ ] **3, mandatory award criteria:** user support (and when it is available), staff security
  clearance checks (BS7858:2019 or not), the clearance level you are prepared to implement, being
  prepared to hold Cyber Essentials if a buyer requires it
- [ ] Every certification answered is held and in date; a Technical Ability Certificate is ready (all
  lots)

**Declaration** (`ARC-000-DECL`): every declaration question answered by the supplier (none
`[PENDING]`), and the third-party agents or bid writers question decided by the supplier.

#### 3b. Consistency checks

Cross-reference documents for contradictions:

- **`ARC-000-SUPP` ↔ `ARC-{PROJECT_ID}-SDD` and `ARC-000-LOTQ`** — company name, certifications
  (including the lot questions' certificate numbers and dates), data-centre locations and security
  clearances match
- **`ARC-{PROJECT_ID}-SVCD` ↔ `ARC-{PROJECT_ID}-SDD`** — features, benefits, lot, supplier type and
  technical details consistent
- **`ARC-000-LOTQ` ↔ `ARC-{PROJECT_ID}-SDD` and `ARC-{PROJECT_ID}-SECA`** — user support
  availability matches the SDD; 2a/2b: data storage and processing locations and penetration testing
  frequency match the SDD and SECA; 3: staff screening and clearance level match the SDD's staff
  security answers; 1a/1b: reseller or sole control matches the SDD
- **`ARC-{PROJECT_ID}-SDD` ↔ `ARC-{PROJECT_ID}-PRIC`** — pricing model follows the lot's pricing
  rules, included features and support levels align; 1a/1b: onboarding costs and framework discount
  match any figures in Part 1 of `ARC-000-LOTQ`
- **`ARC-{PROJECT_ID}-SDD` ↔ `ARC-{PROJECT_ID}-SECA`** — certifications, security controls and
  clearances align
- **`ARC-000-SOCV` ↔ `ARC-000-DECL`** — the declaration's social value summary gives the same
  contact and commitments as the social value document

#### 3c. Character / word-limit validation

Count and validate the limits numerically, reporting actual against limit:

```text
Service name: [X]/100 characters
Description: [X]/500 characters
Feature 1: [X]/10 words
...
Benefit 1: [X]/10 words
...
System requirement 1: [X]/10 words                      (1a/1b, 2a/2b)
What's backed up 1: [X]/10 words                        (1a/1b)
Quality Cloud Services a), b): [X]/250 words each       (1a/1b, ARC-000-LOTQ Part 1)
Maximising Buyer Value a), b), c): [X]/250 words each   (1a/1b, ARC-000-LOTQ Part 1)
Customer contractual exit procedure: [X]/250 words      (1a/1b)
Change of service: [X]/250 words                        (1a/1b)
```

#### 3d. Evidence verification

Check that assertions in `ARC-{PROJECT_ID}-SECA`, `ARC-000-LOTQ`, `ARC-000-SOCV` and `ARC-000-SUPP`
have supporting evidence:

| Assertion | Evidence required | Status |
|-----------|-------------------|--------|
| Cyber Essentials (2a/2b, 3) / Cyber Essentials Plus (1a/1b) | Certificate number and award date (Plus: within 12 months) | ✅ / ❌ |
| ISO 27001, 9001, 20000-1 (1a/1b); 27018 (1a/1b with public cloud) | Certificate | ✅ / ❌ |
| Carbon Reduction Plan (1a/1b) | Published plan with emissions figures | ✅ / ❌ |
| Technical Ability Certificate | Certificate ready to upload | ✅ / ❌ |
| Social value commitments | Evidence for each measure | ✅ / ❌ |
| Penetration testing | Report summary and frequency | ✅ / ❌ |
| SC / DV clearances | Staff count | ✅ / ❌ |
| Data centres | Locations verified | ✅ / ❌ |

#### 3e. Common rejection reasons

These are the same reasons listed in section 8 of the review template:

- [ ] Lot missing or not one of 1a, 1b, 2a, 2b, 3; service does not fit the lot definition
- [ ] Social value missing or incomplete (it is pass/fail, and a fail loses the whole 10%)
- [ ] Lot questions for the service's lot missing, unanswered or over their word limits
- [ ] A mandatory certification not held: Cyber Essentials Plus, ISO 9001, 27001, 20000-1 and a
  Carbon Reduction Plan for 1a/1b (plus ISO 27018 with public cloud); Cyber Essentials for 2a/2b and 3
- [ ] A mandatory declaration question unanswered
- [ ] A claimed certification that is not held or has expired
- [ ] `[PENDING]` or placeholder text remaining (e.g. `[TO BE COMPLETED]`). Every `[PENDING]` value
  in any document is a blocking finding
- [ ] `N/A` where an answer is actually required
- [ ] Contradictory statements, unsubstantiated claims or marketing hyperbole
- [ ] Competitor mentions
- [ ] Extra keywords in the service name
- [ ] Forbidden pricing ("price on application", "from £x", unexplained ranges), prices in the
  service definition document, or pricing not in GBP
- [ ] Lot 3: rate card missing, or a rate below £50
- [ ] Documents not planned as ODF or PDF/A, at most 5 MB and accessible; more than one terms and
  conditions document per service
- [ ] Invalid URLs or contact details

### 4. Determine the output filename

`GCRV` is a **single-instance** doc-type per service project. Generate the document ID and filename
with the ArcKit helper (no `--next-num` — GCRV is not multi-instance):

```bash
node "${CLAUDE_PLUGIN_ROOT}/scripts/generate-document-id.mjs" \
     {PROJECT_ID} GCRV --filename
```

This returns `ARC-{NNN}-GCRV-v1.0.md` (using the zero-padded project number from Step 1). Use the
returned filename and take the version from it. If the service already has a review report,
increment the version instead and add a Revision History row.

### 5. Build the review report

**Read the template** (user override takes precedence):

- **First**, check `.arckit/templates-custom/review-template.md`
- **Then**, `.arckit/templates/review-template.md`
- **Fallback**, `${CLAUDE_PLUGIN_ROOT}/templates/review-template.md`
- **Then read** `${CLAUDE_PLUGIN_ROOT}/templates/_partials/RENDERING.md` and resolve the `<!-- DOC-CONTROL-HEADER -->` marker in the template before writing. Do not hand-write the Document Control table: the partial `RENDERING.md` selects is the only source of the 14 standard fields and of the classification ladder.

Set the Document ID to `ARC-{PROJECT_ID}-GCRV-v{VERSION}` and the Document Type to
`G-Cloud Submission Review`, and the `**G-Cloud Lot**` line to the lot from the service design.
Populate the template from Step 3:

| Template section | Filled from |
|---|---|
| **Review Scope** | Step 1 (service project), the lot and its LOTQ Part, and the scope argument |
| **Overall Status** | the roll-up of every gate, using the template's READY / NEEDS WORK / NOT READY rules |
| **Document Completeness** | 3a |
| **Mandatory Field Status** | 3a |
| **Consistency Issues** | 3b — name **both** `ARC-` IDs in every conflict |
| **Character and Word-Limit Status** | 3c |
| **Evidence Status** | 3d |
| **Common Rejection Reasons Checked** | 3e |
| **Actions Required** | the fixes implied by 3a-3e, each naming the `ARC-` ID and the command to re-run |
| **External References** | any GCA guidance or certification register fetched during the review |

Reference every finding against the `ARC-` ID of the document it concerns — a finding that does not
say which document is wrong cannot be actioned. Report only what you found: counts, statuses and
issues come from this review, not from the template's examples. Leave genuinely-unknown values as
`[PENDING]` rather than inventing them. The template carries the standard ArcKit footer; populate it
rather than appending a second one.

### 6. Write the review report

Before writing, read `${CLAUDE_PLUGIN_ROOT}/references/quality-checklist.md` and verify all **Common Checks** plus the **GCRV** per-type checks pass. Fix any failures before proceeding.

Use the **Write tool** to save the completed report to:

`{path}/{filename}` — e.g. `projects/004-secure-case-mgmt/ARC-004-GCRV-v1.0.md`

(The Write tool creates parent directories automatically and avoids the 32K output-token limit.) Do
**not** echo the full report into your response — print only the summary below.

### 7. Output summary

Report what the review actually found:

```markdown
## G-Cloud Submission Review Complete

**Service:** [Name]
**Lot:** [1a / 1b / 2a / 2b / 3]
**Saved to:** `{path}/ARC-{PROJECT_ID}-GCRV-v[X.Y].md`

### Overall Status: [🟢 READY / 🟡 NEEDS WORK / 🔴 NOT READY]

| Document | ARC-ID | Status |
|----------|--------|--------|
| Supplier Profile | ARC-000-SUPP | [✅/🟡/❌] |
| Social Value | ARC-000-SOCV | [✅/🟡/❌] |
| Lot Questions (Part [N]) | ARC-000-LOTQ | [✅/🟡/❌] |
| Supplier Declaration | ARC-000-DECL | [✅/🟡/❌] |
| Service Design | ARC-[PROJECT_ID]-SVCD | [✅/🟡/❌] |
| SDD | ARC-[PROJECT_ID]-SDD | [✅/🟡/❌] |
| Pricing | ARC-[PROJECT_ID]-PRIC | [✅/🟡/❌] |
| Security | ARC-[PROJECT_ID]-SECA | [✅/🟡/❌] |

### Counts
- Mandatory fields complete: [X]/[Y]; incomplete (including `[PENDING]`): [X]
- Entries over limit: [X]
- Consistency issues: [X]
- Evidence missing: [X]

### Top Actions Required
1. [Most important blocking action, with its ARC-ID and command — or "None"]

### Next Steps
- If 🟢 READY: bundle the documents — `/arckit-uk-gcloud:submission-pack [service]`
- If 🟡 / 🔴: address the actions above, then re-run `/arckit-uk-gcloud:review [service]`
```

## Important Notes

- This review **does not guarantee acceptance** by GCA (formerly CCS) — GCA may request
  clarification, and some issues only surface during its evaluation.
- G-Cloud 15 bids are scored: a pack that passes every check can still score poorly on the quality
  answers (1a/1b) or on price.
- This command never creates a project — if none is found, direct the user to
  `/arckit-uk-gcloud:service-design`.
- A missing document is a blocking finding; name the command that produces it (the lot's
  SDD command (`/arckit-uk-gcloud:sdd-lot1a`, `/arckit-uk-gcloud:sdd-lot1b`, `/arckit-uk-gcloud:sdd-lot2a`, `/arckit-uk-gcloud:sdd-lot2b` or `/arckit-uk-gcloud:sdd-lot3`), `/arckit-uk-gcloud:pricing`, `/arckit-uk-gcloud:security`, `/arckit-uk-gcloud:supplier-profile`,
  `/arckit-uk-gcloud:social-value`, `/arckit-uk-gcloud:lot-questions`, `/arckit-uk-gcloud:declaration`).
- Keep evidence files organised and accessible; consider a colleague's manual review as well.
- **Markdown escaping**: always include a space after `<` or `>` in comparisons (e.g. `< 100
  characters`, `> 99.9% uptime`) so markdown renderers do not treat them as HTML tags.
