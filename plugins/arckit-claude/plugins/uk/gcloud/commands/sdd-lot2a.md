---
description: Generate the Service Definition Document for a G-Cloud 15 Lot 2a (Infrastructure Software as a Service) service
doc-type: SDD
effort: max
handoffs:
  - command: /arckit-uk-gcloud:pricing
    description: Set the Lot 2a unit prices and the discount for each annual call-off value band
  - command: /arckit-uk-gcloud:security
    description: Generate the security evidence for this service
  - command: /arckit-uk-gcloud:lot-questions
    description: Answer the Lot 2a/2b mandatory award criteria and certifications (once per bid)
---

> ⚠️ **Community-contributed command** — part of the `arckit-uk-gcloud` overlay, not the
> officially-maintained ArcKit baseline. The Service Definition Document produced here is an internal
> planning aid for a **G-Cloud 15 (RM1557.15) Lot 2a (Infrastructure Software as a Service, iSaaS)**
> service on the UK Digital Marketplace; it is **not** legal or procurement advice. Every assertion in
> a G-Cloud SDD must be evidenceable — GCA (the Government Commercial Agency, formerly CCS) and buyers
> may ask for proof — so verify every answer against the underlying evidence (supplier profile,
> certificates, security accreditations) before entering it on GCA's Digital Platform.

You are helping a cloud service supplier write the Service Definition Document (SDD) for a
**G-Cloud 15 (RM1557.15) Lot 2a: Infrastructure Software as a Service (iSaaS)** service: cloud-based
systems infrastructure software. The SDD answers every Lot 2a service question that GCA asks, in the
order of GCA's question export. Lot 2b (SaaS) asks the same questions with different categories.

In this overlay **each G-Cloud service is its own ArcKit project** — `projects/{NNN}-service-name/`.
This command does **not** create a new project: the service project was created earlier by
`/arckit-uk-gcloud:service-design`. This command **resolves the existing service project** and writes the SDD
into it.

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

**If no matching project is found**, tell the user the service project does not exist and that they
must run `/arckit-uk-gcloud:service-design` first to create it, then **stop** (do not create a project here).

From the matched project record extract:

- `path` — the service project directory (e.g. `projects/004-secure-case-mgmt`) — the destination
- `number` — the zero-padded project number (e.g. `004`) — use as `PROJECT_ID`
- `name` — the project / service name

### 2. Read the existing context

Use the **Read tool** on each of these; where several versions exist, read the highest:

- **Supplier profile** (supplier-wide): `projects/000-global/supplier/ARC-000-SUPP-v*.md`. If it is
  missing, warn the user that `/arckit-uk-gcloud:supplier-profile` should run first, continue, and write every
  supplier-wide fact (certifications, locations, clearances, contacts) as `[PENDING]`.
- **Service design** (this project): `{path}/ARC-{PROJECT_ID}-SVCD-v*.md`. If it is missing, **stop**:
  tell the user to run `/arckit-uk-gcloud:service-design` first, because it records the lot this command checks.
- **Existing SDD** (present on a re-run): `{path}/ARC-{PROJECT_ID}-SDD-v*.md`.
- **Lot questions** (if written): `projects/000-global/supplier/ARC-000-LOTQ-v*.md`. Only **Part 2
  (Lots 2a and 2b)** matters here: its mandatory award criteria repeat SDD answers.

**Check the lot.** The service design records it on its `**G-Cloud Lot**:` line, for example
`**G-Cloud Lot**: Lot 2a — Infrastructure Software as a Service (iSaaS)`.

- **Lot 2a:** continue.
- **Lot 1a, 1b, 2b or 3:** stop. Tell the user this service is designed for another lot and name its
  command: `/arckit-uk-gcloud:sdd-lot1a`, `/arckit-uk-gcloud:sdd-lot1b`, `/arckit-uk-gcloud:sdd-lot2b` or `/arckit-uk-gcloud:sdd-lot3`.
- **No `**G-Cloud Lot**` line, or a lot from the previous framework** (a G-Cloud 14 design ticks
  "Lot 2 - Cloud Software" under 1.3 Target Lot): ask with **AskUserQuestion** whether the service is
  Lot 2a or Lot 2b. Lot 2a (iSaaS) is systems infrastructure software: security, IT operations and
  service management, endpoint management, operating systems and virtualisation, network and storage
  software, cloud financial management, and integration or application platforms. Lot 2b (SaaS) is
  applications: business, collaboration, CRM, finance and HR, content, engineering, sector-specific
  applications, and analytics, data and AI tools. For 2b, stop and point to `/arckit-uk-gcloud:sdd-lot2b`. For
  2a, continue, and suggest re-running `/arckit-uk-gcloud:service-design` so the design records the G-Cloud 15
  lot. Follow `${CLAUDE_PLUGIN_ROOT}/references/interview-pattern.md`: in a non-interactive run, take
  Lot 2a as the default (the command that was invoked) and list it under Assumptions in the summary.

**Re-runs.** If an SDD already exists, start from it: keep the answers the supplier has confirmed,
and fill in any `[PENDING]` items you can now answer. Increment the version and add a Revision
History row saying what changed. Don't silently overwrite the previous version.

An SDD written for the previous framework (it names an earlier G-Cloud framework or "Lot 2 — Cloud
Software", or it has minimum and maximum price fields) has a different structure. Carry over each
confirmed answer that still matches a G-Cloud 15 question, write it into the G-Cloud 15 structure,
and list in the summary what had no G-Cloud 15 question to go to. Its categories never carry over:
choose new ones from the Lot 2a tree.

### 3. Read the Lot 2a questions and categories

Use the **Read tool** on the Lot 2a service questions:

- `${CLAUDE_PLUGIN_ROOT}/skills/gcloud-framework/references/g-cloud-15/lot-2a-services.md`

Then read only the Lot 2a category tree (roots Systems Infrastructure Software and Application
Development and Deployment):

```bash
sed -n '/^## Lot 2a:/,/^## Lot 2b:/p' "${CLAUDE_PLUGIN_ROOT}/skills/gcloud-framework/references/g-cloud-15/categories.md"
```

Read only these. The other lots' question files are large, and Lot 2b's category tree is different
even under the root the two lots share.

### 4. Research service details (web lookup)

Where the supplier profile and service design leave a question open, research it with **WebFetch**
and **WebSearch**:

- **Supplier website / product page** — whether it is an add-on to other software, and deployment
  model; browsers, installed applications and operating systems, mobile support; API, API
  documentation and sandbox, customisation; data import and export formats, public sector network
  connections; usage metrics, resource tagging and FOCUS support; hosting locations, penetration
  testing, data sanitisation, security governance.
- **Digital Marketplace (G-Cloud 15 listings)** — this service's own listing, if it has one, and
  comparable Lot 2a services: `site:applytosupply.digitalmarketplace.service.gov.uk "[service name]"`
  or `"[service type]"` (Lot 2a's search slug is `isaas`).

Competitors' listings show how comparable services answer. Never copy their answers: the SDD states
only the supplier's own facts.

**Citation traceability**: When you fetch a supplier page or a G-Cloud listing, or read any document
the user has placed under the project's `external/`, `policies/`, or `vendors/` directories, follow
the citation instructions in `${CLAUDE_PLUGIN_ROOT}/references/citation-instructions.md`. Place
inline citation markers (e.g. `[WEB-1-C1]`) next to each fact informed by a source, and populate the
**External References** section (Document Register, Citations, Unreferenced Documents). WebSearch
alone (search without fetch) is exploratory and is not cited — only cite a URL once it has actually
been fetched.

### 5. Read the SDD template

**Read the template** (user override takes precedence):

- **First**, check `.arckit/templates-custom/sdd-lot2-template.md`
- **Then**, `.arckit/templates/sdd-lot2-template.md`
- **Fallback**, `${CLAUDE_PLUGIN_ROOT}/templates/sdd-lot2-template.md`
- **Then read** `${CLAUDE_PLUGIN_ROOT}/templates/_partials/RENDERING.md` and resolve the `<!-- DOC-CONTROL-HEADER -->` marker in the template before writing. Do not hand-write the Document Control table: the partial `RENDERING.md` selects is the only source of the 14 standard fields and of the classification ladder. Default the Classification field to `${user_config.default_classification}` (fall back to `OFFICIAL` for UK Gov context if unavailable).

The template is shared by Lots 2a and 2b.

### 6. Generate the Service Definition Document

Fill in the template for Lot 2a:

- **Header and G-Cloud Details:** set
  `**G-Cloud Lot**: Lot 2a — Infrastructure Software as a Service (iSaaS)`; in the G-Cloud Details
  table set the Lot row to `2a — Infrastructure Software as a Service (iSaaS)`, the SDD command to
  `/arckit-uk-gcloud:sdd-lot2a` and the Listing contact row to the supplier profile's Listing Contact (name,
  email and phone), or `[PENDING]`.
- **1.1 Service type:** `Lot 2a: Infrastructure Software as a Service (iSaaS)`.
- **Every question:** answer each one under its number, ticking the template's options exactly as
  worded: the live listings' wording, with the Digital Platform's in a comment where it differs
  (tick that one when entering the answer). A follow-up marked ↳ gets an answer only when its
  trigger is ticked; otherwise write `Not applicable`. If `lot-2a-services.md` has a question the
  template lacks (a customised template, or a reissued export), add it in its section and say so in
  the summary.
- **3.2 Service categories:** only categories from the Lot 2a tree, written as full paths, and
  only ones the service really delivers. Start from the service design's first pass. A category that
  exists only in the Lot 2b tree means the service may belong in Lot 2b: say so in the summary
  rather than using it. All of them must sit under one root and one group, the first two levels of
  the path, recorded on the template's **Category group** line: none of the 42,893 live G-Cloud 15
  listings (scraped 7 October 2026) has categories in two groups. If the service design's categories
  span groups, ask the user with **AskUserQuestion** which group this listing covers, and suggest
  `/arckit-uk-gcloud:service-design` for a separate service for the others.
- **Limits:** count the characters in the service name (100) and description (500), and the words in
  every feature, benefit and system requirement (10 each, at most 10 items). Every free-text answer
  has a word limit on its `**Words:**` line (50, 100 or 200 words, inferred from the live listings
  because GCA's export states none): write each answer within it and fill in the count. Rewrite
  anything over a limit rather than cutting it off, and fill in the template's counters.
- **6.1 Supplier type:** from the service design, with the organisation resold for any reseller
  option.
- **Mandatory award criteria:** user support (section 7), data storage and processing locations,
  penetration testing frequency and data sanitisation (section 15) are repeated in the Lot 2a/2b lot
  questions, each scored at 2.5%. If Part 2 of the lot questions document exists, check the answers
  agree and report any mismatch; don't edit the lot questions.
- **23. Pricing:** only the education discount and free trial questions. Unit prices and the discount
  bands belong to `/arckit-uk-gcloud:pricing`.
- **24. Documents:** record the file names if they are known, otherwise `[PENDING]`.

Answer only from the supplier profile, the service design, the existing SDD and what research
confirms. Where none of these establishes an answer, write `[PENDING]` rather than assuming one. Never
default a Yes/No question to "No", and never mark a certification as held without evidence.
`/arckit-uk-gcloud:review` treats every remaining `[PENDING]` as blocking, so the supplier sees exactly what's
left to confirm. Where a fact came from a fetched source, attach its inline citation marker (see
Step 4).

### 7. Determine the output filename

`SDD` is a **single-instance** doc-type per service project. Generate the document ID and filename
with the ArcKit helper (no `--next-num` — SDD is not multi-instance):

```bash
node "${CLAUDE_PLUGIN_ROOT}/scripts/generate-document-id.mjs" \
     {PROJECT_ID} SDD --filename
```

This returns `ARC-{NNN}-SDD-v1.0.md` (using the zero-padded project number from Step 1). Use the
returned filename for a new SDD. On a re-run, use the incremented version instead (e.g.
`ARC-{NNN}-SDD-v1.1.md`) and add the Revision History row.

Populate the Document Control header (Document ID = `ARC-{PROJECT_ID}-SDD-v{VERSION}`, Document Type
= `Service Definition Document`) and Revision History, and finish with the standard ArcKit footer:

```markdown
---

**Generated by**: ArcKit `/arckit-uk-gcloud:sdd-lot2a` command
**Generated on**: [DATE]
**ArcKit Version**: [VERSION]
**Project**: [PROJECT_NAME] (Project [PROJECT_ID])
**Model**: [AI_MODEL]
```

### 8. Validate and write the SDD

Before writing, read `${CLAUDE_PLUGIN_ROOT}/references/quality-checklist.md` and verify all **Common Checks** plus the **SDD** per-type checks pass. Then check:

- [ ] Every question is answered, ticked, `Not applicable` or `[PENDING]`
- [ ] Each *choose one* question has exactly one tick, and every ticked option is worded
  exactly as the template words it
- [ ] Every category comes from the Lot 2a tree, all under one root and one group
- [ ] Service name ≤ 100 characters; description ≤ 500 characters
- [ ] At most 10 features, benefits and system requirements, each ≤ 10 words
- [ ] Every free-text answer within the limit on its `**Words:**` line
- [ ] Consistent with the supplier profile (certifications, locations, clearances), the service
  design and, if present, Part 2 of the lot questions document
- [ ] No prices, except the support level costs GCA asks for at 7.14
- [ ] No template placeholders (`[SERVICE_NAME]`, `[ANSWER]`, `[X]`) left

Fix any failures, then use the **Write tool** to save the completed document to `{path}/{filename}` —
e.g. `projects/004-secure-case-mgmt/ARC-004-SDD-v1.0.md`. Do **not** echo the full document into your
response — it is large and only the summary below should be printed.

Then recount every free-text answer against the limit on its `**Words:**` line, correct any counter
the recount disagrees with, and rewrite any answer it marks OVER (then count again). Words are
counted by splitting on spaces, which can differ by a word or two from the Digital Platform's
counter, so leave a small margin:

```bash
SDD="{path}/{filename}"   # the SDD just written
# word count: keep identical in review.md and the five sdd-lot commands
awk '
    FNR == 1 { if (prev != "" && !found) printf "%s: no word counters\n", prev; prev = FILENAME; found = 0; q = ""; inc = 0 }
    inc { if (index($0, "-->")) inc = 0; next }
    /^[ \t]*<!--/ { if (!index($0, "-->")) inc = 1; next }
    /^\*\*[0-9]+\.[0-9]+ / { q = $0; sub(/^\*\*/, "", q); sub(/\*\*.*$/, "", q); n = 0; next }
    /^\*\*Words:\*\*/ {
        if (q != "") {
            found++; s = $0; sub(/^\*\*Words:\*\*[ \t]*/, "", s)
            split(s, a, "/"); c = a[1]; gsub(/[ \t]/, "", c); lim = a[2] + 0; note = ""
            if (n > lim) { note = ", OVER by " (n - lim); over++ }
            else if (c ~ /^[0-9]+$/ && c + 0 != n) note = " (the counter says " c ")"
            printf "%s:%s: %d/%d words%s\n", FILENAME, q, n, lim, note
        }
        q = ""; next
    }
    /^(#|---)/ { q = ""; next }
    q != "" && $0 !~ /^[ \t]*(>|```)/ { n += NF }
    END { if (prev != "" && !found) printf "%s: no word counters\n", prev; printf "answers over their limit: %d\n", over + 0 }' "$SDD"
```

### 9. Show the summary

Report what the document contains, counted from what you wrote:

```markdown
## Service Definition Document Generated

**Service:** [Name]
**Lot:** 2a — Infrastructure Software as a Service (iSaaS)
**Saved to:** `{path}/ARC-{PROJECT_ID}-SDD-v[X.Y].md` ([new / updated from vX.Y])

### Questions
- Answered: [N]
- Not applicable (follow-up not triggered): [N]
- Pending: [N] (sections [list])

### Limits
| Field | In the document | Limit |
|-------|-----------------|-------|
| Service name | [X] characters | 100 |
| Description | [X] characters | 500 |
| Features | [N] items, longest [X] words | 10 items, 10 words |
| Benefits | [N] items, longest [X] words | 10 items, 10 words |
| System requirements | [N] items, longest [X] words | 10 items, 10 words |
| Free-text answers | [N] counted, [N] over their limit | 50, 100 or 200 words each (`**Words:**` lines) |

### Key Answers (as recorded)
- Categories: [full paths]
- Deployment model: [ticked options]; multi cloud support: [Yes/No]
- Supplier type: [ticked option, and organisation resold]
- Support: [channels and hours as ticked]
- Data stored and processed in: [ticked options]
- Penetration testing: [frequency]; data sanitisation: [Yes/No, types]
- Public sector networks: [ticked networks / None]

### Items Requiring Attention
- [Each `[PENDING]` item, with its question number and what the supplier needs to confirm — or "None"]
- [Each disagreement with the supplier profile, service design or lot questions — or omit]

### Assumptions
- [Each default taken without asking, e.g. "Lot: 2a (default; legacy design, not asked)" — or omit]

### Next Steps
1. **Review for accuracy:** check every ticked option against what the service really does
2. **Price the service:** `/arckit-uk-gcloud:pricing [service]` — unit prices and the discount for each annual call-off value band (price is 80% of the Lot 2a score)
3. **Security evidence:** `/arckit-uk-gcloud:security [service]`
4. **Lot questions:** `/arckit-uk-gcloud:lot-questions` — the four mandatory award criteria and certifications (once per Lot 2a/2b bid, not per service)
5. **Review completeness:** `/arckit-uk-gcloud:review [service]`
```

## Important Notes

- Every assertion must be evidenceable: GCA and buyers can ask for proof.
- The ticked options appear on the listing, so a wrong tick either misleads buyers or promises
  something the service can't deliver.
- The uploaded service definition document is ODF or PDF/A, at most 5 MB, accessible, and contains no
  prices.
- Four SDD answers are scored again as mandatory award criteria, so they must say the same thing in
  both places.
- Cyber Essentials is mandatory for Lot 2a/2b call-offs; it is answered in the lot questions, not
  here.
- This command never creates a project — if none is found, direct the user to `/arckit-uk-gcloud:service-design`.
- **Markdown escaping**: When writing less-than or greater-than comparisons, always include a space
  after `<` or `>` (e.g. `< 3 seconds`, `> 99.9% uptime`) to prevent markdown renderers from
  interpreting them as HTML tags or emoji.
