---
description: Generate the G-Cloud 15 pricing document for a service, laid out for its lot
doc-type: PRIC
effort: high
handoffs:
  - command: /arckit-uk-gcloud:security
    description: Generate NCSC Cloud Security Principles assertions
  - command: /arckit-uk-gcloud:gcloud-competitors
    description: Compare the prices, discounts or rate card with Digital Marketplace rivals
  - command: /arckit-uk-gcloud:review
    description: Check the pricing against the SDD and flag remaining [PENDING] items
---

> ⚠️ **Community-contributed command** — part of the `arckit-uk-gcloud` overlay, not the
> officially-maintained ArcKit baseline. The pricing document produced here is an internal planning
> aid for a **G-Cloud 15 (RM1557.15)** service on the UK Digital Marketplace; it is **not** legal,
> financial, or procurement advice. G-Cloud 15 prices are **maximums binding on every buyer** for the
> framework term, are scored in the tender, and can only change within each lot's rules (most can
> only go down) — so confirm every figure with Finance before entering it on the Digital Platform of
> GCA (the Government Commercial Agency, formerly CCS).

You are helping a cloud service supplier write the pricing for one **G-Cloud 15 (RM1557.15)**
service. G-Cloud 15 prices each lot differently, and price is scored: 10% of the bid on Lots 1a/1b,
80% on Lots 2a/2b and Lot 3. Build the document for the service's lot only. On Lot 3 this command
also keeps the supplier's one rate card, shared by every Lot 3 service, in
`projects/000-global/supplier/ARC-000-RATE-v*.md`.

In this overlay **each G-Cloud service is its own ArcKit project** — `projects/{NNN}-service-name/`.
This command does **not** create a new project: the service project was created earlier by
`/arckit-uk-gcloud:service-design`. This command **resolves the existing service project** and writes the
pricing document into it.

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

### 2. Read the existing context and find the lot

Use the **Read tool** on each of these that exists (when several versions exist, read the highest):

- Supplier profile (supplier-wide): `projects/000-global/supplier/ARC-000-SUPP-v*.md`. If it is
  missing, tell the user to run `/arckit-uk-gcloud:supplier-profile` first and stop.
- Service design (this project): `{path}/ARC-{PROJECT_ID}-SVCD-v*.md`.
- Service Definition Document (this project): `{path}/ARC-{PROJECT_ID}-SDD-v*.md`. Its pricing
  answers (deployment model, education discount, free trial, and for Lot 3 the role levels that
  deliver the service) must agree with this document.
- The existing pricing document, on a re-run: `{path}/ARC-{PROJECT_ID}-PRIC-v*.md`.
- **Lot 3:** the supplier's one rate card, `projects/000-global/supplier/ARC-000-RATE-v*.md`, shared
  by every Lot 3 service. This command owns it; if there is none yet, this run creates it.

**The lot decides everything below.** Read it from the `**G-Cloud Lot**:` line of the service design
(or of the SDD), recorded as `Lot <code> — <name>`. It must be `1a`, `1b`, `2a`, `2b` or `3`.

- A G-Cloud 14 service design has no such line; its "1.3 Target Lot" checkbox says Lot 1 (Cloud
  Hosting), Lot 2 (Cloud Software) or Lot 3 (Cloud Support). Treat old Lot 3 as Lot 3. For old Lot 1
  or Lot 2, ask with **AskUserQuestion** which G-Cloud 15 lot applies (1a or 1b; 2a or 2b), and
  recommend re-running `/arckit-uk-gcloud:service-design` so the design records it.
- If no lot is recorded anywhere, ask which lot the service is in, and recommend re-running
  `/arckit-uk-gcloud:service-design`.

**Lot-wide figures.** Some prices are set once per lot in the tender and apply to every service the
supplier lists in that lot: the onboarding table and minimum discount (1a/1b), the discount matrix
(2a/2b) and the whole rate card (Lot 3). Listings scraped on 7 October 2026 bear this out: of 1,135
suppliers with more than one Lot 3 service, 2 showed different rate cards, and of 1,994
supplier-lot pairs on 2a/2b, 1 showed different discount matrices. List the supplier's other service
projects (the `list-projects.sh` output from Step 1); for each one whose service design records the
same lot and which already has a `ARC-{NNN}-PRIC-v*.md`, read it and reuse its lot-wide figures. If
the supplier now wants different figures, say in the summary that every service in the lot must be
updated.

**Lot 3: this command owns the rate card.** The card is supplier-level, in
`projects/000-global/supplier/ARC-000-RATE-v*.md`, and every Lot 3 listing shows all of it. Only
this command writes it; the Lot 3 SDDs list the role levels that deliver each service and never hold
rates. Pricing a Lot 3 service therefore means creating the card (the first time) or checking and
updating it, then writing this service's short pricing document. A change to the card changes every
Lot 3 service: say so in the summary.

**Agree with the SDD.** If the SDD exists, take the deployment models (1a/1b) and the education
discount and free trial answers from it. For Lot 3, take only the role levels that deliver the
service (SDD section 11, or the service design's section 6C), which must all be on the card; never
take rates from an SDD. If the supplier now wants something different, write the new figure here and
list the mismatch in the summary so the SDD is updated too. `/arckit-uk-gcloud:review` checks the two against
each other.

**Re-runs.** If a pricing document already exists, start from it: keep confirmed figures, fill in
`[PENDING]` items you can now answer, increment the version and add a Revision History row saying
what changed. Don't silently overwrite it.

### 3. Read the template and the lot references

**Read the template** (user override takes precedence):

- **First**, check `.arckit/templates-custom/pricing-template.md`
- **Then**, `.arckit/templates/pricing-template.md`
- **Fallback**, `${CLAUDE_PLUGIN_ROOT}/templates/pricing-template.md`
- **Then read** `${CLAUDE_PLUGIN_ROOT}/templates/_partials/RENDERING.md` and resolve the `<!-- DOC-CONTROL-HEADER -->` marker in the template before writing. Do not hand-write the Document Control table: the partial `RENDERING.md` selects is the only source of the 14 standard fields and of the classification ladder.

Default the Classification field to `${user_config.default_classification}` (fall back to
`OFFICIAL` for UK Gov context if unavailable).

**Lot 3:** use the **Read tool** on
`${CLAUDE_PLUGIN_ROOT}/skills/ddat-rate-card/references/lot-3-rate-card.md` — the 9 job families,
58 roles and 222 role levels — and on `${CLAUDE_PLUGIN_ROOT}/skills/ddat-rate-card/SKILL.md` for its
"What Suppliers Charge" table. Also read the rate card template, which the supplier-wide card is
written from (user override first): `.arckit/templates-custom/rate-card-template.md`, then
`.arckit/templates/rate-card-template.md`, then `${CLAUDE_PLUGIN_ROOT}/templates/rate-card-template.md`.
Resolve its `<!-- DOC-CONTROL-HEADER -->` marker the same way.

**Market comparison — no bundled benchmark data.** This overlay bundles no benchmark files. Compare
proposed figures only against evidence you actually have:

- **Lot 3 rates:** for the 12 common role levels in the DDaT Rate Card skill's "What Suppliers
  Charge" table (maximum UK rates on 42,893 G-Cloud 15 listings scraped 7 October 2026, each
  supplier counted once), use its median, middle half (p25–p75), supplier count and offshore median.
  For any other level, use the rival rate cards in this service's GCMP artefact
  (`{path}/ARC-{PROJECT_ID}-GCMP-v*.md`, from `/arckit-uk-gcloud:gcloud-competitors`) if one exists.
- **Lots 2a/2b discounts:** no discount benchmark is available in this overlay. If the GCMP artefact
  records rivals' discount tiers, show them band by band; otherwise say there is no comparison.
- **Lots 1a/1b:** no benchmark for the minimum discount or onboarding prices. Use
  `/arckit-uk-gcloud:gcloud-competitors` to see similar live listings.
- Always say how many listings a comparison rests on and where it comes from, and say that listing
  figures are **maximum** rates and discounts, not contract prices. **Never invent a percentile, a
  median or a market figure**, and never fill in a market figure as the supplier's price.

**Citation traceability**: When you fetch a competitor page or a G-Cloud listing, or read any
document the user has placed under the project's `external/`, `policies/`, or `vendors/` directories,
follow the citation instructions in `${CLAUDE_PLUGIN_ROOT}/references/citation-instructions.md`.
Place inline citation markers (e.g. `[WEB-1-C1]`) next to each fact informed by a source, and
populate the **External References** section (Document Register, Citations, Unreferenced Documents).
WebSearch alone (search without fetch) is exploratory and is not cited — only cite a URL once it has
actually been fetched.

### 4. Rules for every lot

| Rule | Source |
|------|--------|
| Tender prices in GBP, excluding VAT, to at most two decimal places | Attachment 2 (How to tender) |
| Expenses are not added on top, except on a time-and-materials call-off whose Order Form allows them, and Lot 3 travel outside the M25 (Step 7) | Framework Schedule 3, paragraph 7 |
| Prices on the Digital Platform are the **maximum** a buyer pays; they can be lowered at call-off | Attachment 2; Framework Schedule 3 |
| Framework prices are not indexed for inflation | Framework Schedule 3 |
| No minimum-only prices, no unexplained ranges ("£100 = x, £200 = y" is fine, "£100–£300" is not), no "price on application", no "from £x" | Framework Schedule 1 (Specification) |
| No pricing in the service definition document; prices go in the pricing document (ODF or PDF/A, at most 5 MB, accessible) | Question export |
| GCA's 0.75% management charge is paid by the supplier on call-off value: allow for it inside your prices, don't add it as a line item | Attachment 2 |
| Prices must be sustainable: GCA can disregard an abnormally low tender | Attachment 2 |
| **Discount for educational organisations** (Yes/No) on every lot; **free trial** (with description and link) on Lots 1a/1b and 2a/2b only | Question export |

### 5. Lots 1a and 1b: the price formula

Framework Schedule 3, Annex 1, paragraph 3.2:

> **Framework Price = Baseline Price + Fixed Onboarding Costs − Framework Discount ± Further Supplier-Specific Schemes − Time Limited Discounts**

Listings show it as "Total Cost = Baseline Pricing − Minimum Discounting + Onboarding Activity +
Additional sources of cost − Additional sources of cost reduction", one formula for each deployment
model. Lay out one formula for each deployment model ticked in the SDD's "Cloud deployment model"
answer, explaining every term:

| Term | What to write | Rule |
|------|---------------|------|
| **Baseline Price** ("Baseline Pricing", plus a web link) | What the baseline is: a fixed price, or a unit price × units with its unit of measure. A reseller usually links the cloud provider's public price list. A list in US dollars is allowed; the buyer's Order Form sets the conversion to pounds | Can go up or down at any time. For the public cloud model, prices must be publicly visible on your or your subcontractor's website and linked from the listing; for private and community models, detailed prices are given at call-off |
| **Framework Discount** ("Minimum Discounting") | "Provide your minimum discount applicable to your baseline prices": the minimum discount every buyer gets on every service called off under the lot | **Scored 5%.** Fixed until the framework reopens; one figure for the lot |
| **Fixed Onboarding Costs** ("Onboarding Activity") | What onboarding covers and how it is priced, based on the onboarding examples in the tender | **Scored 5%** through the onboarding table below. Fixed for each call-off; only real onboarding work (access, account set-up, deployment, billing set-up); none on a continuation or extension of an existing contract |
| **Further Supplier-Specific Schemes** ("Additional sources of cost" and "Additional sources of cost reduction") | Anything that moves the price: management fees, currency conversion, mandatory support plans; volume, commitment or up-front payment discounts, public sector or private pricing programmes | Scheme discounts can be increased (prices cut further) at any time. State every added cost |
| **Time Limited Discounts** | Any extra time-limited offer, with its end date | Must be published transparently on the Digital Platform |

The two scored tender questions, which together make up the 10% price weight:

1. **Price for onboarding (5%).** A maximum total cost in each of 9 cells, each a scenario the
   Digital Platform defines, priced "as though for a reasonable requirement from a reasonably
   assumable buyer". The lowest average across the 9 cells scores 5%; others score
   (lowest ÷ theirs) × 5. Every cell must be filled or the question scores 0; £0 is evaluated as
   £0.01. Ask the user for the scenario wording and their prices; write `[PENDING]` for any cell
   they haven't given.
2. **Minimum discount (5%).** The highest discount across bidders scores 5%, others in proportion;
   0% is evaluated as 0.01%. A higher figure scores more but binds every service called off under
   the lot, for every buyer, until the framework reopens.

The platform asks two further pricing questions for Lots 1a/1b that are not scored but must be
answered. Ask the user to confirm what they are; don't guess.

Also record how the service meets Framework Schedule 1's billing requirements: available pay as you
go with no minimum commitment, consumption measured and billed per hour (compute) or per GB
(storage) or finer, and usage data exportable in a recognised format such as CSV.

**Lot 1b:** all pricing and discounts go on GCA's separate Lot 1b platform, which is not public. Say
so at the top of section 2 of the document.

### 6. Lots 2a and 2b: unit prices and the discount matrix

**Unit prices.** List every priced item with its unit of measure, unit price and what it includes.
Unit prices can be reduced during the framework, never increased, so don't publish a price you might
need to raise. A call-off is priced by Framework Schedule 3, paragraph 4.2: unit price × units over
the full term, ÷ years = annual contract value; the band that value falls in sets the discount.
Include one worked example using the supplier's own prices.

**The discount matrix carries the 80% price score.** Attachment 2 scores Lots 2a/2b by adding up the
six band discounts: the highest total across bidders scores 80%, others (their total ÷ highest) × 80.
Unit prices themselves are not scored. The matrix:

| Annual call-off contract value (ex VAT) |
|----------------------------------------|
| Less than £250,000 |
| Between £250,000 and £500,000 |
| Between £500,001 and £1,000,000 |
| Between £1,000,001 and £2,500,000 |
| Between £2,500,001 and £5,000,000 |
| Over £5,000,001 |

- Every band must have a value from 0% to 100%, to two decimal places. 0% is allowed. The matrix is
  public.
- It is fixed until the framework reopens and applies to every service called off under the lot.
- Show the total of the six discounts. The score depends on the highest total any bidder enters,
  which nobody knows in advance, so there is no "safe" figure: the trade-off is a higher score
  against a discount that binds every call-off for the framework term.
- Where the GCMP artefact records rivals' discount tiers, show them beside each band with the number
  of listings; otherwise write "no comparison available" (Step 3).
- If the supplier hasn't chosen discounts, ask. Never pick figures for them.

Time-limited discounts also apply to Lots 2a/2b and must be published on the Digital Platform.

### 7. Lot 3: the supplier rate card

**Build or update the card, not a per-service list.** Write the supplier-wide
`projects/000-global/supplier/ARC-000-RATE-v*.md` from the rate card template, and give this
service's pricing document only its §4 summary. Find the role levels each Lot 3 service needs: list
the service projects whose latest service design records Lot 3, and read each one's SVCD section 6C
and SDD section 11 with the **Read tool**:

```bash
# Lot 3 service projects: the latest service design's lot line names Lot 3
find projects -mindepth 1 -maxdepth 1 -type d -name '[0-9][0-9][0-9]-*' ! -name '000-*' 2>/dev/null | sort | while IFS= read -r d; do
    svcd=$(find "$d" -maxdepth 1 -name 'ARC-*-SVCD-v*.md' 2>/dev/null | sort -V | tail -1)
    if [ -n "$svcd" ] && grep -qE '^\*\*G-Cloud Lot\*\*:[[:space:]]*(Lot[[:space:]]*)?3([^0-9ab]|$)' "$svcd"; then echo "$svcd"; fi
done
```

**Which role levels.** Start from the existing card. Add any level a Lot 3 service needs that the
card lacks (its design or SDD names it), and list those additions in the summary. With no card yet,
take the levels every Lot 3 service needs as the starting point, then ask the user with
**AskUserQuestion** which other levels the supplier can staff. The card covers every Lot 3 service,
so it is wider than any one service: of the 27,496 live Lot 3 services, the median shows all 222
levels, while counting each supplier once the median card has 83 levels and 350 of 1,462 suppliers
price all 222. Use only the 222 levels in `lot-3-rate-card.md`, named exactly as it names them.
Levels the supplier can't provide are left blank, not priced.

**Roles outside DDaT.** Procurement and commercial advisers, trainers, bid and contract managers and
other roles the rate card doesn't name are priced at the nearest DDaT role and level, judged by the
work they do and their seniority, and the mapping goes in the card's section 5. That is what live
Lot 3 procurement services do: of the 179 with "procurement" in the name (listings scraped 7 October
2026), the 34 with short cards (30 levels or fewer) price mostly architect, IT service manager,
delivery manager and business analyst levels. None of the 179 says which level its procurement
people are priced at, and several still point buyers to an SFIA rate card, which G-Cloud 15 doesn't
use, so a buyer comparing cards can't tell what a "Senior delivery manager" day buys. Tell them: ask
the user to add one sentence to each affected service's definition document (and its pricing
document, if it has one), for example "Our procurement consultants are priced at the DDaT Senior
delivery manager level." Propose the mapping and mark it for the user to confirm; never present it
as GCA's.

**For each level offered**, give:

- The proposed **maximum UK (onshore) day rate** and, if offered, the **maximum offshore day rate**.
- A market comparison where Step 3 provides one: for a level in the skill's table, its median and
  middle half (p25–p75) with the supplier count, and its position (below p25, p25–p75, above p75);
  for a level compared against the GCMP artefact, the rival range and the number of listings; or
  "no comparison".

If the supplier hasn't given a rate, write `[PENDING]` (and show the comparison where there is one);
don't fill in a market median as their price.

**Projected average day rate.** Attachment 2 scores Lot 3 price (80%) on it. Every rate entered is
added up, UK and offshore, and divided by the number of rates; rates under £50 or over £10,000 are
left out. The lowest average across bidders scores 80, and others score (lowest ÷ theirs) × 80.
Compute it, rather than estimating by eye:

```bash
# Every rate entered, UK and offshore, one per line
printf '%s\n' 950 1100 750 600 | awk '$1 >= 50 && $1 <= 10000 { s += $1; n++ } END { if (n) printf "rates: %d  average: £%.2f\n", n, s / n }'
```

Where every level offered has a market median in the skill's table, run it again with those medians
and show the two averages side by side; otherwise say the comparison covers only the levels it
covers. Explain the trade-off plainly. Every level counts equally, so a card of only senior levels
raises the average, and junior or offshore levels lower it. But every rate is a ceiling for the
whole framework, and buyers call off against it. Advise offering only levels the supplier can staff
at that rate. Never pad the card to game the average.

**Lot 3 rules**, quoted in the document:

- A maximum day rate per role level, UK and optionally offshore. Onshore staff must be available in
  the UK; offshore staff may work outside it.
- A 7.5-hour working day and a minimum of £50 a day.
- Travel and subsistence inside the M25 are included in the rate. Elsewhere they are recoverable only
  if the rate card says so, at the buyer's standard rates.
- No risk or contingency uplift in a day rate.
- Rates can be reduced at any time, never increased. Any out-of-hours or urgent-work charge must
  still keep the day charged at or below the maximum.
- Pricing on Lot 3 is a rate card for all services listed, and it is the same card on every Lot 3
  service. It lives once, in `projects/000-global/supplier/ARC-000-RATE-v*.md`.

### 8. Market context (optional)

If `/arckit:tenders` has been run for this service, a tender-intelligence artefact
(`{path}/research/ARC-{PROJECT_ID}-TNDR-*-v*.md`) holds awarded-value benchmarks for comparable
public-sector contracts. Use the **Read tool** to read it as a sanity check on the overall price
level, not to set framework rates or discounts. Quote its figures with their existing citations.
Carry its caveat verbatim: **awarded value ≠ actual spend**. Don't re-derive or invent figures.

### 9. Determine the output filename

`PRIC` is a **single-instance** doc-type per service project. Generate the document ID and filename
with the ArcKit helper (no `--next-num` — PRIC is not multi-instance):

```bash
node "${CLAUDE_PLUGIN_ROOT}/scripts/generate-document-id.mjs" \
     {PROJECT_ID} PRIC --filename
```

This returns `ARC-{NNN}-PRIC-v1.0.md` (using the zero-padded project number from Step 1). Use the
returned filename for a new document and take the version (`1.0`) from it. On a re-run, increment the
existing document's version instead and add a Revision History row.

**Lot 3 also writes the supplier rate card.** `RATE` is single-instance and supplier-wide, like the
supplier profile:

```bash
node "${CLAUDE_PLUGIN_ROOT}/scripts/generate-document-id.mjs" 000 RATE --filename
```

This returns `ARC-000-RATE-v1.0.md` for a new card. When a card already exists, keep its version if
nothing on it changes; otherwise increment it and add a Revision History row saying what changed.

### 10. Generate the pricing document

Populate the template. Fill the `**G-Cloud Lot**` line with the service's lot. Keep only this lot's
section (§2 for 1a/1b, §3 for 2a/2b, §4 for Lot 3), plus the sections for every lot, and fill in the
compliance check in §6 honestly. Delete the other lots' sections rather than marking them N/A.

**Lot 3:** first write (or update) the supplier rate card from the rate card template: every role
level offered with its maximum UK and offshore rate and market comparison, the average day rate, the
roles mapped to DDaT levels, and the role levels each Lot 3 service needs (its section 6). Then this
service's §4 summarises the card: its ID and version, the average day rate, this service's role
levels and whether all are on the card. Never copy the rates into the pricing document.

Write any price, discount, scenario or term the supplier hasn't confirmed as `[PENDING]`. Never
invent a figure to fill the gap. These prices are maximums binding on every buyer for the framework
term, so a guessed price is worse than a visible gap. `/arckit-uk-gcloud:review` treats any remaining
`[PENDING]` as blocking. Where a fact came from a fetched source, attach the appropriate inline
citation marker (see Step 3).

Don't use the old minimum/maximum price, pricing unit and billing interval fields, or SFIA-level day
rates. G-Cloud 15 has none of them (changed from G-Cloud 14).

Populate the Document Control header (Document ID = `ARC-{PROJECT_ID}-PRIC-v{VERSION}`) and Revision
History, and append the standard ArcKit Document Control footer:

```markdown
---

**Generated by**: ArcKit `/arckit-uk-gcloud:pricing` command
**Generated on**: [DATE]
**ArcKit Version**: [VERSION]
**Project**: [PROJECT_NAME] (Project [PROJECT_ID])
**Model**: [AI_MODEL]
```

### 11. Write the pricing document

Before writing, read `${CLAUDE_PLUGIN_ROOT}/references/quality-checklist.md` and verify all **Common Checks** plus the **PRIC** per-type checks pass. Fix any failures before proceeding.

Use the **Write tool** to save the completed document to:

`{path}/{filename}` — e.g. `projects/004-secure-case-mgmt/ARC-004-PRIC-v1.0.md`

For Lot 3, check the card against the **RATE** per-type checks in the same checklist, and save it,
before the pricing document, to `projects/000-global/supplier/ARC-000-RATE-v{VERSION}.md`.

(The Write tool creates parent directories automatically and avoids the 32K output-token limit.) Do
**not** echo the full document into your response — it is large and only a summary should be printed.

### 12. Output summary

Print only a short summary. Report what the document actually contains, in the shape for its lot:

```markdown
## Pricing Document Generated

**Service:** [Name]
**Lot:** [1a / 1b / 2a / 2b / 3] — [Lot name]
**Saved to:** `{path}/ARC-{PROJECT_ID}-PRIC-v[X.Y].md`

### What Is Scored
[1a/1b: onboarding average £X (9 cells) and minimum discount X%, 5% each]
[2a/2b: six-band discount total X%]
[3: the supplier rate card (ARC-000-RATE-vX.Y, created / unchanged / updated): N rates (N UK, N offshore), average day rate £X; this service's role levels all on the card, or the levels added]

### Market Comparison
[2a/2b: one line per band: your X% | rivals in GCMP (N listings): X%–X% — or "no comparison available"]
[3: one line per level: your £X | median £X (p25–p75 £X–£X), N suppliers (DDaT Rate Card skill, 7 Oct 2026) or rivals in GCMP (N listings) or no comparison | position]
[1a/1b: none bundled; see /arckit-uk-gcloud:gcloud-competitors]

### Every Lot
- Education discount: [Yes / No / PENDING]
- Free trial: [Yes / No / not asked on Lot 3]
- Compliance check: [all pass / the checks that fail]
- Lot-wide figures: [match services X, Y / first service priced in this lot / differ from X: update needed]

### Items Requiring Attention
- [Each `[PENDING]` item and each SDD mismatch, with what the supplier needs to confirm, or "None"]

### Next Steps
1. Finance approval of margins (allow for the 0.75% management charge)
2. Re-run the SDD command if this document changed the deployment model, education discount or free
   trial. For Lot 3, re-run `/arckit-uk-gcloud:sdd-lot3` for any service whose role levels were added to the
   card, and check every other Lot 3 service still matches the updated card
3. Competitor listings: `/arckit-uk-gcloud:gcloud-competitors`
4. Security evidence: `/arckit-uk-gcloud:security`
5. Submission review: `/arckit-uk-gcloud:review`
```

## Important Notes

- Prices are maximums for the framework term. Lots 2a/2b unit prices and Lot 3 rates can only go
  down; 1a/1b baseline prices can move, but the minimum discount can't.
- The scored figures are lot-wide: one onboarding table and minimum discount (1a/1b), one discount
  matrix (2a/2b), one rate card (Lot 3, kept in `projects/000-global/supplier/ARC-000-RATE-v*.md` and
  owned by this command).
- Lot 1b pricing is not public. It goes on GCA's separate Lot 1b platform.
- Market figures come from live listings and are maximums. Quote them with their listing count and
  date; this overlay bundles no benchmark data, so never quote a figure you don't have.
- G-Cloud 15 is run by the Government Commercial Agency (GCA, formerly CCS). Sources: Framework
  Schedule 3 (Framework Prices), Attachment 2 (How to tender) v5.0, Framework Schedule 1
  (Specification) v2.1, at <https://www.gca.gov.uk/rm1557-15-g-cloud-15-tender-documents>.
- This command never creates a project — if none is found, direct the user to `/arckit-uk-gcloud:service-design`.
- **Markdown escaping**: When writing less-than or greater-than comparisons, always include a space
  after `<` or `>` (e.g. `< 3 seconds`, `> 99.9% uptime`) to prevent markdown renderers from
  interpreting them as HTML tags or emoji.
