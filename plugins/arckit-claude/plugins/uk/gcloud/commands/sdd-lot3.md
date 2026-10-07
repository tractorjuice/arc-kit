---
description: Generate the Service Definition Document for a G-Cloud 15 Lot 3 (Cloud Support) service, with the role levels that deliver it
doc-type: SDD
effort: max
handoffs:
  - command: /arckit-uk-gcloud:pricing
    description: Build or update the supplier's one Lot 3 rate card so it covers this service's role levels
  - command: /arckit-uk-gcloud:security
    description: Generate NCSC Cloud Security Principles assertions
  - command: /arckit-uk-gcloud:lot-questions
    description: Answer the Lot 3 mandatory award criteria and certifications (once per Lot 3 bid)
---

> ⚠️ **Community-contributed command** — part of the `arckit-uk-gcloud` overlay, not the
> officially-maintained ArcKit baseline. The Service Definition Document produced here is an internal
> planning aid for a **G-Cloud 15 (RM1557.15) Lot 3 (Cloud Support)** service on the UK Digital
> Marketplace; it is **not** legal or procurement advice. Every assertion in a G-Cloud SDD must be
> evidenceable — GCA (the Government Commercial Agency, formerly CCS) may request proof — so verify
> every claim against the underlying evidence (supplier profile, staff screening and clearances,
> role levels) before entering it on GCA's Digital Platform.

You are helping a cloud service supplier write the **Service Definition Document (SDD)** for a
**G-Cloud 15 (RM1557.15) Lot 3: Cloud Support** service: managed services, FinOps, migration
planning, set-up and migration, security, QA and testing, training or ongoing support. The SDD
answers every Lot 3 service question that GCA asks, in the order of GCA's question export, and
lists the **DDaT role levels that deliver the service**. It sets no rates: Lot 3 is priced on the
supplier's **one rate card**, `projects/000-global/supplier/ARC-000-RATE-v*.md`, which
`/arckit-uk-gcloud:pricing` owns and every Lot 3 listing shows in full.

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
**project number** (e.g. `004` or `cloud-migration`). List the existing projects as JSON and match
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

- `path` — the service project directory (e.g. `projects/004-cloud-migration`) — the destination
- `number` — the zero-padded project number (e.g. `004`) — use as `PROJECT_ID`
- `name` — the project / service name

### 2. Read the existing context

Use the **Read tool** on each of these that exists (when several versions exist, read the highest):

- Supplier profile (supplier-wide): `projects/000-global/supplier/ARC-000-SUPP-v*.md`. If it is
  missing, tell the user to run `/arckit-uk-gcloud:supplier-profile` first and stop.
- Service design (this project): `{path}/ARC-{PROJECT_ID}-SVCD-v*.md`. If it is missing, tell the
  user to run `/arckit-uk-gcloud:service-design` first and stop.
- The existing SDD, on a re-run: `{path}/ARC-{PROJECT_ID}-SDD-v*.md`.
- The supplier's one Lot 3 rate card: `projects/000-global/supplier/ARC-000-RATE-v*.md`, owned by
  `/arckit-uk-gcloud:pricing`. Read it to check this service's role levels are on it; never copy its rates.
- The lot questions: `projects/000-global/supplier/ARC-000-LOTQ-v*.md`. When it has a **Part 3
  (Lot 3)**, its mandatory award criteria repeat answers given in this SDD.

**Check the lot.** The service design records it on the `**G-Cloud Lot**:` line under its Template
Origin line, as `Lot <code> — <name>`.

- **Lot 3:** continue. A service design from G-Cloud 14 has no such line; its "1.3 Target Lot"
  checkbox says "Lot 3 - Cloud Support (Services)". Treat that as Lot 3 and continue, and suggest
  re-running `/arckit-uk-gcloud:service-design` so the design records the G-Cloud 15 lot.
- **Lot 1a, 1b, 2a or 2b** (or a G-Cloud 14 "Lot 1" or "Lot 2" design): stop. Tell the user this
  service is designed for another lot and name its command: `/arckit-uk-gcloud:sdd-lot1a`,
  `/arckit-uk-gcloud:sdd-lot1b`, `/arckit-uk-gcloud:sdd-lot2a` or `/arckit-uk-gcloud:sdd-lot2b`.
- **No lot recorded:** ask with **AskUserQuestion** whether this is a Lot 3 support service. If not,
  stop and point to `/arckit-uk-gcloud:service-design`.

**Re-runs.** If an SDD already exists, start from it: keep the answers the supplier has confirmed,
and fill in any `[PENDING]` items you can now answer. Increment the version and add a Revision
History row saying what changed. Don't silently overwrite the previous version.

An SDD written for G-Cloud 14 (its intro names G-Cloud 14, or it has an SFIA rate card, an SFIA
skills mapping, or planning, set-up and migration, QA and testing, security testing, training and
ongoing support sections) has a different structure. Carry over each confirmed answer that still
matches a G-Cloud 15 question. Those old service sections have no G-Cloud 15 question; use them only
to choose categories. **Never carry SFIA levels or SFIA day rates over**: map each old role to the
nearest DDaT role level as a role that delivers the service (section 11), mark the mapping as
proposed, and ask the supplier to confirm it. Rates belong on the supplier rate card, set with
`/arckit-uk-gcloud:pricing`. List in the summary what didn't carry over.

### 3. Read the Lot 3 questions, categories and rate card

Use the **Read tool** on:

- `${CLAUDE_PLUGIN_ROOT}/skills/gcloud-framework/references/g-cloud-15/lot-3-services.md` — every
  Lot 3 service question, its answer options and GCA's guidance.
- The Lot 3 category tree (root Cloud Support Services) — only the `## Lot 3:` section of the
  category file:

  ```bash
  sed -n '/^## Lot 3:/,$p' "${CLAUDE_PLUGIN_ROOT}/skills/gcloud-framework/references/g-cloud-15/categories.md"
  ```

- `${CLAUDE_PLUGIN_ROOT}/skills/ddat-rate-card/references/lot-3-rate-card.md` — the 9 job families,
  58 roles and 222 role levels: the only names a rate card can use.

Read only these. The other lots' question files are large and ask different questions.

### 4. Research service details (optional web lookup)

Where the supplier profile and service design leave a question open, research it.

- **Supplier website / services page** (**WebFetch**) — what the service delivers and for which
  platforms; whether it is delivered remotely, on site or both; support channels, hours and support
  levels; staff screening (BS7858:2019) and the clearances staff hold; the roles that deliver it and
  their seniority.
- **Digital Marketplace (G-Cloud 15 listings)** (**WebSearch**, then **WebFetch** on a result) —
  this service's own listing if it has one, and comparable Lot 3 services:
  `site:applytosupply.digitalmarketplace.service.gov.uk "[service name]"` or
  `site:applytosupply.digitalmarketplace.service.gov.uk "Cloud Support" "[service type]"`.

Competitors' listings show how comparable services answer and which role levels they offer. Never
copy their answers: the SDD states only the supplier's own facts.

**Citation traceability**: When you fetch a supplier page or a G-Cloud listing, or read any document
the user has placed under the project's `external/`, `policies/`, or `vendors/` directories, follow
the citation instructions in `${CLAUDE_PLUGIN_ROOT}/references/citation-instructions.md`. Place
inline citation markers (e.g. `[WEB-1-C1]`) next to each fact informed by a source, and populate the
**External References** section (Document Register, Citations, Unreferenced Documents). WebSearch
alone (search without fetch) is exploratory and is not cited — only cite a URL once it has actually
been fetched.

### 5. Read the SDD template

**Read the template** (user override takes precedence):

- **First**, check `.arckit/templates-custom/sdd-lot3-template.md`
- **Then**, `.arckit/templates/sdd-lot3-template.md`
- **Fallback**, `${CLAUDE_PLUGIN_ROOT}/templates/sdd-lot3-template.md`
- **Then read** `${CLAUDE_PLUGIN_ROOT}/templates/_partials/RENDERING.md` and resolve the `<!-- DOC-CONTROL-HEADER -->` marker in the template before writing. Do not hand-write the Document Control table: the partial `RENDERING.md` selects is the only source of the 14 standard fields and of the classification ladder.

Default the Classification field to `${user_config.default_classification}` (fall back to
`OFFICIAL` for UK Gov context if unavailable).

### 6. Generate the Service Definition Document

Fill in the template:

- **`**G-Cloud Lot**` line:** `Lot 3 — Cloud Support`.
- **G-Cloud Details:** the Listing contact row from the supplier profile's Listing Contact (name, email
  and phone), or `[PENDING]`.
- **1.1 Service type:** `Lot 3: Cloud Support Service`.
- **Every question:** answer each one under its number, ticking the template's options exactly as
  worded: the live listings' wording, with the Digital Platform's in a comment where it differs
  (tick that one when entering the answer). A follow-up marked ↳ gets an answer only when its
  trigger is ticked; otherwise write `Not applicable`. If `lot-3-services.md` has a question the
  template lacks (a customised template, or a reissued export), add it in its section and say so in
  the summary.
- **3.2 Service categories:** only categories from the Lot 3 tree, written as full paths, and only
  ones the service really delivers. Several leaves share a name ("Other", "Application management"),
  so the full path matters. All of them must sit under one root and one group, the first two levels
  of the path, recorded on the template's **Category group** line: none of the 42,893 live G-Cloud
  15 listings (scraped 7 October 2026) has categories in two groups. If the service design's
  categories span groups, ask the user with **AskUserQuestion** which group this listing covers, and
  suggest `/arckit-uk-gcloud:service-design` for a separate service for the others.
- **Limits:** count the characters in the service name (100) and description (500), and the words in
  every feature and benefit (10 each, at most 10 items). Every free-text answer has a word limit on
  its `**Words:**` line (50, 100 or 200 words, inferred from the live listings because GCA's export
  states none): write each answer within it and fill in the count. Rewrite anything over a limit
  rather than cutting it off, and fill in the template's counters.
- **6.1 Supplier type:** from the service design, with the organisation resold for any reseller
  option.
- **Mandatory award criteria:** user support (section 7), staff security clearance checks and
  clearance level (section 8) are repeated in the Lot 3 lot questions, each scored at 2.5%. If the
  LOTQ document has a Part 3, check the answers agree and report any mismatch; don't edit the lot
  questions.

#### Role levels and the rate card (section 11)

Lot 3 has **one rate card per supplier**. Every Lot 3 listing shows the whole card, and on the live
listings scraped on 7 October 2026 only 2 of the 1,135 suppliers with more than one Lot 3 service
show different cards on different services. `/arckit-uk-gcloud:pricing` owns it, in the supplier-wide
`ARC-000-RATE` document. This SDD never holds rates: it records which role levels deliver the
service, so the card can be checked to cover them.

1. **List the role levels that deliver the service.** Take them from the service design (section
   6C). Otherwise propose the role levels the service's categories and features need, mark them as
   proposed, and ask the supplier to confirm them. Use the job family, role and role level names
   exactly as `lot-3-rate-card.md` writes them. Fill in 11.1 with what each level does on this
   service.
2. **Roles outside DDaT.** A procurement or commercial adviser, a trainer, or any other role the
   rate card doesn't name is listed at the nearest DDaT role and level by the work they do and their
   seniority, marked as proposed, with the role's own name beside it. Add one sentence to the
   service definition document saying so (for example "Our procurement consultants are priced at the
   DDaT Senior delivery manager level"); live procurement listings don't, and buyers can't otherwise
   tell what the level buys. The card's section 5 records the mapping for every service.
3. **Check them against the card.** If the RATE document exists, mark each level "On the card" or
   "Not on the card". A level that isn't on the card can't be called off: list it in the summary for
   `/arckit-uk-gcloud:pricing` to add. If there is no card yet, write "No rate card yet" and point to
   `/arckit-uk-gcloud:pricing`.
4. **Copy no rates.** Section 11 names the card and its version; rates, the average day rate and the
   market comparison stay on the card, so they can never disagree with it.

Answer only from the supplier profile, the service design, the existing SDD, the rate card and what
research confirms. Where none of these establishes an answer, write `[PENDING]` rather than
assuming one. Never default a Yes/No question to "No", and never mark a certification or clearance as
held without evidence. `/arckit-uk-gcloud:review` treats every remaining `[PENDING]` as blocking, so the
supplier sees exactly what's left to confirm. Where a fact came from a fetched source, attach the
appropriate inline citation marker (see Step 4).

### 7. Determine the output filename

`SDD` is a **single-instance** doc-type per service project. Generate the document ID and filename
with the ArcKit helper (no `--next-num` — SDD is not multi-instance):

```bash
node "${CLAUDE_PLUGIN_ROOT}/scripts/generate-document-id.mjs" \
     {PROJECT_ID} SDD --filename
```

This returns `ARC-{NNN}-SDD-v1.0.md` (using the zero-padded project number from Step 1). Use the
returned filename for a new document and take the version (`1.0`) from it. On a re-run, increment the
existing SDD's version instead (e.g. `ARC-{NNN}-SDD-v1.1.md`) and add a Revision History row.

Populate the Document Control header (Document ID = `ARC-{PROJECT_ID}-SDD-v{VERSION}`) and Revision
History, and append the standard ArcKit Document Control footer:

```markdown
---

**Generated by**: ArcKit `/arckit-uk-gcloud:sdd-lot3` command
**Generated on**: [DATE]
**ArcKit Version**: [VERSION]
**Project**: [PROJECT_NAME] (Project [PROJECT_ID])
**Model**: [AI_MODEL]
```

### 8. Validate and write the SDD

Before writing, check:

- [ ] Every question is answered, ticked, `Not applicable` or `[PENDING]`
- [ ] Each *choose one* question has exactly one tick, and every ticked option is worded
  exactly as the template words it
- [ ] Every category comes from the Lot 3 tree, as a full path, all under one root and one group
- [ ] Service name ≤ 100 characters; description ≤ 500 characters
- [ ] At most 10 features and benefits, each ≤ 10 words
- [ ] Every free-text answer within the limit on its `**Words:**` line
- [ ] Every role level in section 11 uses exact names from `lot-3-rate-card.md`, and each is marked
      on or not on the supplier rate card
- [ ] Section 11 holds no rates: it names the `ARC-000-RATE` document and its version
- [ ] Consistent with the supplier profile (clearances, screening), the service design and, if
      present, Part 3 of the LOTQ document
- [ ] No prices anywhere, except the support level costs GCA asks for at 7.13
- [ ] No template placeholders (`[SERVICE NAME]`, `[ANSWER]`, `[X]`) left

Then read `${CLAUDE_PLUGIN_ROOT}/references/quality-checklist.md` and verify all **Common Checks** plus the **SDD** per-type checks pass. Fix any failures before proceeding.

Use the **Write tool** to save the completed document to:

`{path}/{filename}` — e.g. `projects/004-cloud-migration/ARC-004-SDD-v1.0.md`

(The Write tool creates parent directories automatically and avoids the 32K output-token limit.) Do
**not** echo the full document into your response — it is large and only a summary should be printed.

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

### 9. Output summary

Print only this summary. Report what the document contains, counted from what you wrote:

```markdown
## Service Definition Document Generated

**Service:** [Name]
**Lot:** 3 — Cloud Support
**Saved to:** `{path}/ARC-{PROJECT_ID}-SDD-v[X.Y].md`
**Version:** [X.Y] ([new / updated from X.Y])

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
| Free-text answers | [N] counted, [N] over their limit | 50, 100 or 200 words each (`**Words:**` lines) |

### Key Answers (as recorded)
- Categories: [full paths]
- Supplier type: [ticked option, and organisation resold]
- Support: [channels and hours as ticked]
- Staff security: [screening]; clearance [level]

### Role Levels and the Rate Card
- Role levels that deliver this service: [N] ([N] proposed, awaiting confirmation)
- Rate card: [ARC-000-RATE-vX.Y, [N] levels, average day rate £X / no rate card yet: run `/arckit-uk-gcloud:pricing`]
- Not on the card: [levels, for `/arckit-uk-gcloud:pricing` to add / none]
- Roles priced at the nearest DDaT level: [role → level / none]

### Items Requiring Attention
- [Each `[PENDING]` item, with its question number and what the supplier needs to confirm — or "None"]
- [Each proposed role level awaiting confirmation, each level not on the rate card, and each
  disagreement with the supplier profile, service design or lot questions — or omit]
- [What didn't carry over from a G-Cloud 14 SDD — or omit]

### Next Steps
1. **Review for accuracy:** check every ticked option and role level against what the service
   really delivers
2. **Set or update the rate card:** `/arckit-uk-gcloud:pricing` — builds the supplier's one Lot 3 rate card (or
   adds this service's missing levels to it); the card's average day rate is 80% of the Lot 3 score
3. **Security evidence:** `/arckit-uk-gcloud:security`
4. **Lot questions:** `/arckit-uk-gcloud:lot-questions` — the four Lot 3 mandatory award criteria and
   certifications (once per Lot 3 bid, not per service)
5. **Review completeness:** `/arckit-uk-gcloud:review`
```

## Important Notes

- Lot 3 is people-based: staff screening and clearance answers are scored again as mandatory award
  criteria, so keep them identical in both places.
- The rate card belongs to the supplier, not the service: one card, shown on every Lot 3 listing and
  set with `/arckit-uk-gcloud:pricing`. Lot 3 price, 80% of the score, is the average of every rate on it (UK
  and offshore).
- The rate card is entered on GCA's Digital Platform. The uploaded service definition document is ODF
  or PDF/A, at most 5 MB, accessible, and contains no prices.
- SFIA is not part of G-Cloud 15. `${CLAUDE_PLUGIN_ROOT}/skills/ddat-rate-card/references/sfia-skills.md`
  can still help describe a team's skills, but never to price it.
- This command never creates a project — if none is found, direct the user to `/arckit-uk-gcloud:service-design`.
- **Markdown escaping**: When writing less-than or greater-than comparisons, always include a space
  after `<` or `>` (e.g. `< 3 seconds`, `> 99.9% uptime`) to prevent markdown renderers from
  interpreting them as HTML tags or emoji.
