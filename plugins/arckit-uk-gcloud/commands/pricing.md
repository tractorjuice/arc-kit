---
description: Generate the G-Cloud pricing document for a service
effort: high
handoffs:
  - command: /arckit:gcloud-competitors
    description: Benchmark this pricing against Digital Marketplace rivals
---

> ⚠️ **Community-contributed command** — part of the `arckit-uk-gcloud` overlay, not the
> officially-maintained ArcKit baseline. The pricing document produced here is an internal planning
> aid for a UK G-Cloud / Digital Marketplace service offering; it is **not** legal, financial, or
> procurement advice. All G-Cloud prices are **published and visible to every buyer**, must be in
> **GBP**, and can only be changed via the framework process — so confirm every figure with Finance
> before publishing a live framework listing.

You are helping a cloud service supplier generate a **pricing document** for their G-Cloud Digital
Marketplace service.

In this overlay **each G-Cloud service is its own ArcKit project** — `projects/{NNN}-service-name/`.
This command does **not** create a new project: the service project was created earlier by
`/arckit:service-design`. This command **resolves the existing service project** and writes the
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
must run `/arckit:service-design` first to create it, then **stop** (do not create a project here).

From the matched project record extract:

- `path` — the service project directory (e.g. `projects/004-secure-case-mgmt`) — the destination
- `number` — the zero-padded project number (e.g. `004`) — use as `PROJECT_ID`
- `name` — the project / service name

### 2. Read the existing context

Read the supplier profile and the service documents so the pricing is consistent with them — do not
re-ask for information already captured upstream:

- Supplier profile (supplier-wide): use the **Read tool** on
  `projects/000-global/supplier/ARC-000-SUPP-v1.0.md` if it exists.
- Service design (this project): use the **Read tool** on the resolved project's
  `ARC-{PROJECT_ID}-SVCD-v*.md` (the SVCD doc written by `/arckit:service-design`).
- Service Definition Document (this project): use the **Read tool** on the resolved project's
  `ARC-{PROJECT_ID}-SDD-v*.md` if it exists, so pricing tiers align with the SDD.

If the service-design document is missing, warn the user that running `/arckit:service-design` first
produces a richer, consistent pricing document, then continue with what is available.

### 3. Pricing model options

G-Cloud supports various pricing models — choose the model(s) appropriate to the service's lot:

#### For Lot 1 & 2 (Hosting & Software)

**Per user pricing:**

- Price per user per month
- User tiers (1–10, 11–50, 51–100, 100+)
- Named vs concurrent users
- Admin vs standard users

**Consumption-based:**

- Price per GB (storage)
- Price per compute hour
- Price per API call
- Price per transaction

**Flat fee:**

- Monthly subscription
- Annual subscription
- Enterprise licence

**Tiered packages:**

- Basic / Standard / Premium tiers
- Feature differentiation
- Support-level differentiation

#### For Lot 3 (Support)

**Day rates (SFIA rate card):**

- Rate per role / SFIA level
- Remote vs on-site rates
- Out-of-hours rates

**Fixed price:**

- Per deliverable
- Per project phase
- Outcome-based

### 4. Required pricing information

**Base pricing:**

- Minimum price point
- Standard price
- Enterprise / volume pricing
- Price currency (GBP required)

**What's included:**

- Core features at base price
- Support level included
- Storage / users / transactions included
- Training included

**What's extra:**

- Additional users / storage pricing
- Premium support upgrade
- Additional features / modules
- Professional services
- Training

**Discounts:**

- Volume discounts
- Multi-year discounts
- Education-sector discounts (strongly encouraged)
- Charity / non-profit discounts
- Public-sector discounts

**Free options:**

- Free trial (duration, limitations)
- Free tier (limitations)
- Freemium model

**Billing:**

- Billing frequency (monthly / quarterly / annual)
- Payment terms
- Minimum commitment period
- Cancellation terms

### 5. Price comparison

#### Anchor to real awarded-contract values (if available)

If `/arckit:tenders` has been run for this service, a tender-intelligence artefact
(`ARC-{PROJECT_ID}-TNDR-v*.md`) holds awarded-value benchmarks for comparable public-sector
contracts. Use the **Read tool** to read it and use it as the **primary** price anchor.

When present, use the artefact's **awarded-value benchmarks** (median, lower quartile Q1, upper
quartile Q3, sample size) to position day rates / unit prices within the real award band for
comparable contracts, and cite the supporting notice URLs in the pricing rationale. Carry the
artefact's caveat verbatim: **awarded value ≠ actual spend** — treat these figures as market context
and a sanity check, not as the sole basis for the price. Do not re-derive or invent figures; quote
them with their existing citations.

#### Fallback / supplement

Use **WebSearch** to benchmark against similar services (the only source when no tender-intelligence
artefact exists):

- What do competitors charge?
- What's the market rate range?
- Where does this service sit?

### 6. Read the pricing template

Use the **Read tool** to read the pricing template:

- `${CLAUDE_PLUGIN_ROOT}/templates/pricing-template.md`

Resolve the `<!-- DOC-CONTROL-HEADER -->` marker and any `{{CLASSIFICATION}}` placeholder per the
rendering rules in `${CLAUDE_PLUGIN_ROOT}/templates/_partials/RENDERING.md` if that partial is
present, defaulting the Classification field to `${user_config.default_classification}` (fall back to
`OFFICIAL` for UK Gov context if unavailable).

**Citation traceability**: When you fetch a competitor page or a G-Cloud listing, query an MCP
server, or read any document the user has placed under the project's `external/`, `policies/`, or
`vendors/` directories, follow the citation instructions in
`${CLAUDE_PLUGIN_ROOT}/references/citation-instructions.md`. Place inline citation markers (e.g.
`[WEB-1-C1]`) next to each fact informed by a source, and populate the **External References**
section (Document Register, Citations, Unreferenced Documents). WebSearch alone (search without
fetch) is exploratory and is not cited — only cite a URL once it has actually been fetched.

### 7. Determine the output filename

`PRIC` is a **single-instance** doc-type per service project. Generate the document ID and filename
with the ArcKit helper (no `--next-num` — PRIC is not multi-instance):

```bash
bash "${CLAUDE_PLUGIN_ROOT}/scripts/bash/generate-document-id.sh" \
     {PROJECT_ID} PRIC --filename
```

This returns `ARC-{NNN}-PRIC-v1.0.md` (using the zero-padded project number from Step 1). Use the
returned filename for the output document and take the version (`1.0`) from it. If the service
already has a pricing document, increment the version and add a Revision History row instead of
overwriting at v1.0.

### 8. Populate the template

Fill every `[PLACEHOLDER]` field with the information gathered above. Include:

1. Pricing summary table
2. Detailed pricing breakdown
3. What's included at each tier
4. Additional costs
5. Discount structure
6. Terms and conditions

Respect marketplace requirements: all prices in **GBP**, clear separation of what's included vs
extra, and meaningful volume / education discounts. Leave genuinely-unknown figures as `[PENDING]`
rather than inventing values. Where a fact came from a fetched source, attach the appropriate inline
citation marker (see Step 6).

Populate the Document Control header (Document ID = `ARC-{PROJECT_ID}-PRIC-v{VERSION}`) and Revision
History, and append the standard ArcKit Document Control footer:

```markdown
---

**Generated by**: ArcKit `/arckit:pricing` command
**Generated on**: [DATE]
**ArcKit Version**: [VERSION]
**Project**: [PROJECT_NAME] (Project [PROJECT_ID])
**Model**: [AI_MODEL]
```

### 9. Write the pricing document

Use the **Write tool** to save the completed document to:

`{path}/{filename}` — e.g. `projects/004-secure-case-mgmt/ARC-004-PRIC-v1.0.md`

(The Write tool creates parent directories automatically and avoids the 32K output-token limit.) Do
**not** echo the full document into your response — it is large and only a summary should be printed.

### 10. Output summary

Print only a short summary (not the full document):

```markdown
## Pricing Document Generated

**Service:** [Name]
**Saved to:** `{path}/ARC-{PROJECT_ID}-PRIC-v1.0.md`

### Pricing Summary

| Tier | Price | Users | Storage | Support |
|------|-------|-------|---------|---------|
| Basic | £X/month | Up to 10 | 10GB | Email |
| Standard | £X/month | Up to 50 | 100GB | Email + Chat |
| Premium | £X/month | Unlimited | 1TB | 24/7 Phone |

### Key Terms
- Minimum commitment: [X months]
- Billing: [Monthly/Annual]
- Education discount: [X%]

### Competitive Position
- Market average: £X
- Awarded-value band (from TNDR artefact, if available): £X (Q1) – £X (median) – £X (Q3), n=X [cite notice URLs]
- This service: £X
- Position: [Budget/Mid-range/Premium]

### Next Steps
- Benchmark this pricing against Digital Marketplace rivals: `/arckit:gcloud-competitors`
- Legal review of terms; Finance approval of margins

### Items Requiring Attention
- [Any [PENDING] figures the user must supply]
- [If the service design or supplier profile was missing: run `/arckit:service-design` /
  `/arckit:supplier-profile` to enrich this pricing document]
```

## Important Notes

- All prices must be in **GBP**.
- Prices are published and visible to all buyers.
- Education pricing is expected by many buyers.
- Volume discounts should be meaningful.
- Be clear about what's included vs extra.
- Prices can be updated but require the framework process.
- Consider total cost of ownership, not just the headline price.
- This command never creates a project — if none is found, direct the user to `/arckit:service-design`.
- **Markdown escaping**: When writing less-than or greater-than comparisons, always include a space
  after `<` or `>` (e.g. `< 3 seconds`, `> 99.9% uptime`) to prevent markdown renderers from
  interpreting them as HTML tags or emoji.
