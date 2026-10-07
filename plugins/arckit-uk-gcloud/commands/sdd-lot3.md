---
description: Generate the Service Definition Document and rate card for a G-Cloud 15 Lot 3 (Cloud Support) service
doc-type: SDD
effort: max
handoffs:
  - command: /arckit:pricing
    description: Set the maximum UK and offshore day rates for the rate card
  - command: /arckit:security
    description: Generate NCSC Cloud Security Principles assertions
  - command: /arckit:lot-questions
    description: Answer the Lot 3 mandatory award criteria and certifications (once per Lot 3 bid)
---

> ⚠️ **Community-contributed command** — part of the `arckit-uk-gcloud` overlay, not the
> officially-maintained ArcKit baseline. The Service Definition Document produced here is an internal
> planning aid for a **G-Cloud 15 (RM1557.15) Lot 3 (Cloud Support)** service on the UK Digital
> Marketplace; it is **not** legal or procurement advice. Every assertion in a G-Cloud SDD must be
> evidenceable — GCA (the Government Commercial Agency, formerly CCS) may request proof — so verify
> every claim against the underlying evidence (supplier profile, staff screening and clearances,
> role levels, day rates) before entering it on GCA's Digital Platform.

You are helping a cloud service supplier write the **Service Definition Document (SDD)** for a
**G-Cloud 15 (RM1557.15) Lot 3: Cloud Support** service: managed services, FinOps, migration
planning, set-up and migration, security, QA and testing, training or ongoing support. The SDD
answers every Lot 3 service question that GCA asks, in the order of GCA's question export, and
records the service's **rate card**: the DDaT role levels it offers, each with a maximum UK and
offshore day rate.

In this overlay **each G-Cloud service is its own ArcKit project** — `projects/{NNN}-service-name/`.
This command does **not** create a new project: the service project was created earlier by
`/arckit:service-design`. This command **resolves the existing service project** and writes the SDD
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
must run `/arckit:service-design` first to create it, then **stop** (do not create a project here).

From the matched project record extract:

- `path` — the service project directory (e.g. `projects/004-cloud-migration`) — the destination
- `number` — the zero-padded project number (e.g. `004`) — use as `PROJECT_ID`
- `name` — the project / service name

### 2. Read the existing context

Use the **Read tool** on each of these that exists (when several versions exist, read the highest):

- Supplier profile (supplier-wide): `projects/000-global/supplier/ARC-000-SUPP-v*.md`. If it is
  missing, tell the user to run `/arckit:supplier-profile` first and stop.
- Service design (this project): `{path}/ARC-{PROJECT_ID}-SVCD-v*.md`. If it is missing, tell the
  user to run `/arckit:service-design` first and stop.
- The existing SDD, on a re-run: `{path}/ARC-{PROJECT_ID}-SDD-v*.md`.
- The pricing document: `{path}/ARC-{PROJECT_ID}-PRIC-v*.md`. Set by `/arckit:pricing`; when present,
  its day rates are the ones to use.
- The lot questions: `projects/000-global/supplier/ARC-000-LOTQ-v*.md`. When it has a **Part 3
  (Lot 3)**, its mandatory award criteria repeat answers given in this SDD.

**Check the lot.** The service design records it on the `**G-Cloud Lot**:` line under its Template
Origin line, as `Lot <code> — <name>`.

- **Lot 3:** continue. A service design from G-Cloud 14 has no such line; its "1.3 Target Lot"
  checkbox says "Lot 3 - Cloud Support (Services)". Treat that as Lot 3 and continue, and suggest
  re-running `/arckit:service-design` so the design records the G-Cloud 15 lot.
- **Lot 1a, 1b, 2a or 2b** (or a G-Cloud 14 "Lot 1" or "Lot 2" design): stop. Tell the user this
  service is designed for another lot and name its command: `/arckit:sdd-lot1a`,
  `/arckit:sdd-lot1b`, `/arckit:sdd-lot2a` or `/arckit:sdd-lot2b`.
- **No lot recorded:** ask with **AskUserQuestion** whether this is a Lot 3 support service. If not,
  stop and point to `/arckit:service-design`.

**Re-runs.** If an SDD already exists, start from it: keep the answers the supplier has confirmed,
and fill in any `[PENDING]` items you can now answer. Increment the version and add a Revision
History row saying what changed. Don't silently overwrite the previous version.

An SDD written for G-Cloud 14 (its intro names G-Cloud 14, or it has an SFIA rate card, an SFIA
skills mapping, or planning, set-up and migration, QA and testing, security testing, training and
ongoing support sections) has a different structure. Carry over each confirmed answer that still
matches a G-Cloud 15 question. Those old service sections have no G-Cloud 15 question; use them only
to choose categories. **Never carry SFIA levels or SFIA day rates into the rate card**: map each old
role to the nearest DDaT role level, mark the mapping as proposed, and ask the supplier to confirm
it. List in the summary what didn't carry over.

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
  58 roles and 222 role levels: the only names the rate card can use.

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
- **1.1 Service type:** `Lot 3: Cloud Support Service`.
- **Every question:** answer each one under its number, ticking GCA's options exactly as worded. A
  follow-up marked ↳ gets an answer only when its trigger is ticked; otherwise write
  `Not applicable`. If `lot-3-services.md` has a question the template lacks (a customised template,
  or a reissued export), add it in its section and say so in the summary.
- **3.2 Service categories:** only categories from the Lot 3 tree, written as full paths, and only
  ones the service really delivers. Several leaves share a name ("Other", "Application management"),
  so the full path matters. All of them must sit under one root and one group, the first two levels
  of the path, recorded on the template's **Category group** line: none of the 42,893 live G-Cloud
  15 listings (scraped 7 October 2026) has categories in two groups. If the service design's
  categories span groups, ask the user with **AskUserQuestion** which group this listing covers, and
  suggest `/arckit:service-design` for a separate service for the others.
- **Limits:** count the characters in the service name (100) and description (500), and the words in
  every feature and benefit (10 each, at most 10 items). Rewrite anything over a limit rather than
  cutting it off, and fill in the template's counters.
- **6.1 Supplier type:** from the service design, with the organisation resold for any reseller
  option.
- **Mandatory award criteria:** user support (section 7), staff security clearance checks and
  clearance level (section 8) are repeated in the Lot 3 lot questions, each scored at 2.5%. If the
  LOTQ document has a Part 3, check the answers agree and report any mismatch; don't edit the lot
  questions.

#### Rate card (section 11)

1. **Choose the role levels.** Take them from the service design. Otherwise propose the role levels
   the service's categories and features need, mark them as proposed, and ask the supplier to
   confirm them. Use the job family, role and role level names exactly as `lot-3-rate-card.md`
   writes them; a level that isn't in that file can't be priced. Fill in 11.1 with what each level
   does on this service.
2. **Fill in the rates.** When the PRIC document exists, copy its rates: `/arckit:pricing` sets them
   and is the source of truth. Otherwise use rates the supplier has given in the service design,
   marked as provisional. Where there is no rate, write `[PENDING]`. Never invent a rate.
3. **Check the rules.** Every rate is at least £50 a day, for a 7.5-hour day, with travel and
   subsistence inside the M25 included and no uplift for risk or contingency. An offshore rate is
   optional: write "Not offered" when there isn't one.
4. **Work out the average day rate as GCA scores it:** the sum of every rate entered, UK and
   offshore, divided by the number of rates, ignoring any under £50 or over £10,000. The lowest
   average in the tender scores the full 80% and the others score in proportion, so every role level
   and every offshore rate offered moves the score. Fill in the template's counters.
5. **Compare with the market (summary only).** This overlay bundles no day-rate benchmark data. For
   each role level with a rate, if it appears in the "What Suppliers Charge" table of the DDaT Rate
   Card skill (`${CLAUDE_PLUGIN_ROOT}/skills/ddat-rate-card/SKILL.md`: maximum UK rates on 42,893
   G-Cloud 15 listings scraped 7 October 2026, each supplier counted once), show its median and
   middle half. For any other level, use the rival rate cards in this service's GCMP artefact
   (`{path}/ARC-{PROJECT_ID}-GCMP-v*.md`, from `/arckit:gcloud-competitors`) if one exists, and say
   how many listings the comparison rests on. Otherwise write "no comparison". Never invent a
   percentile or a market figure. Benchmarks don't belong in the SDD.

Answer only from the supplier profile, the service design, the existing SDD, the PRIC document and
what research confirms. Where none of these establishes an answer, write `[PENDING]` rather than
assuming one. Never default a Yes/No question to "No", and never mark a certification or clearance as
held without evidence. `/arckit:review` treats every remaining `[PENDING]` as blocking, so the
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

**Generated by**: ArcKit `/arckit:sdd-lot3` command
**Generated on**: [DATE]
**ArcKit Version**: [VERSION]
**Project**: [PROJECT_NAME] (Project [PROJECT_ID])
**Model**: [AI_MODEL]
```

### 8. Validate and write the SDD

Before writing, check:

- [ ] Every question is answered, ticked, `Not applicable` or `[PENDING]`
- [ ] Each *choose one* question has exactly one tick, and every ticked option is GCA's wording
- [ ] Every category comes from the Lot 3 tree, as a full path, all under one root and one group
- [ ] Service name ≤ 100 characters; description ≤ 500 characters
- [ ] At most 10 features and benefits, each ≤ 10 words
- [ ] Every rate card row uses exact names from `lot-3-rate-card.md`, and every rate is £50 or more
- [ ] The average day rate counts every UK and offshore rate entered
- [ ] Rates match the PRIC document where it exists
- [ ] Consistent with the supplier profile (clearances, screening), the service design and, if
      present, Part 3 of the LOTQ document
- [ ] No prices outside the rate card, except the support level costs GCA asks for at 7.13
- [ ] No template placeholders (`[SERVICE NAME]`, `[ANSWER]`, `[X]`) left

Then read `${CLAUDE_PLUGIN_ROOT}/references/quality-checklist.md` and verify all **Common Checks** plus the **SDD** per-type checks pass. Fix any failures before proceeding.

Use the **Write tool** to save the completed document to:

`{path}/{filename}` — e.g. `projects/004-cloud-migration/ARC-004-SDD-v1.0.md`

(The Write tool creates parent directories automatically and avoids the 32K output-token limit.) Do
**not** echo the full document into your response — it is large and only a summary should be printed.

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

### Key Answers (as recorded)
- Categories: [full paths]
- Supplier type: [ticked option, and organisation resold]
- Support: [channels and hours as ticked]
- Staff security: [screening]; clearance [level]

### Rate Card
Rates from: [PRIC document / service design (provisional) / not yet set]

| Role level | Max UK rate | Max offshore rate | Market comparison | Note |
|------------|-------------|-------------------|-------------------|------|
| [ROLE LEVEL] | £[X] / PENDING | £[X] / Not offered | [Skill table: median £X (£X–£X), N suppliers / N rival listings in GCMP: £X–£X / no comparison] | [Above the middle half / Below it / —] |

- Role levels offered: [N]
- Rates entered (UK and offshore): [N]; average day rate as GCA scores it: £[X]. Lot 3 price is
  80% of the score; the lowest average in the tender scores the full 80%, others in proportion.
- Market figures are maximum rates on live listings (DDaT Rate Card skill, scraped 7 October 2026,
  or the GCMP artefact's listings), not contract prices

### Items Requiring Attention
- [Each `[PENDING]` item, with its question number and what the supplier needs to confirm — or "None"]
- [Each proposed role level awaiting confirmation, and each disagreement with the PRIC document, the
  supplier profile, service design or lot questions — or omit]
- [What didn't carry over from a G-Cloud 14 SDD — or omit]

### Next Steps
1. **Review for accuracy:** check every ticked option and role level against what the service
   really delivers
2. **Set the rates:** `/arckit:pricing` — the average day rate is 80% of the Lot 3 score
3. **Security evidence:** `/arckit:security`
4. **Lot questions:** `/arckit:lot-questions` — the four Lot 3 mandatory award criteria and
   certifications (once per Lot 3 bid, not per service)
5. **Review completeness:** `/arckit:review`
```

## Important Notes

- Lot 3 is people-based: staff screening and clearance answers are scored again as mandatory award
  criteria, so keep them identical in both places.
- Offer the role levels the service needs. Lot 3 price, 80% of the score, is the average of every
  rate entered (UK and offshore), so senior levels the service doesn't use can only raise it.
- Rates may not include any uplift for risk or contingency.
- Rates are maximums: they can be reduced during the framework, never increased.
- The rate card is entered on GCA's Digital Platform. The uploaded service definition document is ODF
  or PDF/A, at most 5 MB, accessible, and contains no prices.
- SFIA is not part of G-Cloud 15. `${CLAUDE_PLUGIN_ROOT}/skills/ddat-rate-card/references/sfia-skills.md`
  can still help describe a team's skills, but never to price it.
- This command never creates a project — if none is found, direct the user to `/arckit:service-design`.
- **Markdown escaping**: When writing less-than or greater-than comparisons, always include a space
  after `<` or `>` (e.g. `< 3 seconds`, `> 99.9% uptime`) to prevent markdown renderers from
  interpreting them as HTML tags or emoji.
