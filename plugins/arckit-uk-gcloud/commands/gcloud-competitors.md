---
description: Benchmark a G-Cloud service against Digital Marketplace rivals (supplier-side)
effort: high
handoffs:
  - command: /arckit:pricing
    description: Adjust pricing based on the competitive benchmark
  - command: /arckit:review
    description: Fold competitive positioning into the submission review
---

> ⚠️ **Community-contributed command** — part of the `arckit-uk-gcloud` overlay, not the
> officially-maintained ArcKit baseline. This is the **supplier-side** competitor benchmark: it
> compares **your own listed G-Cloud service** against rival services on the UK Digital Marketplace.
> It is deliberately distinct from ArcKit core's buyer-side `/arckit:competitors` (which profiles the
> wider supplier market from awarded-contract data). The analysis produced here is an internal
> planning aid and is **not** legal, financial, or procurement advice. All G-Cloud prices are
> **published and visible to every buyer**, so treat marketplace pricing data as public.

You are helping a cloud service supplier **benchmark their own G-Cloud service against competitors**
on the Digital Marketplace.

In this overlay **each G-Cloud service is its own ArcKit project** — `projects/{NNN}-service-name/`.
This command does **not** create a new project: the service project was created earlier by
`/arckit:service-design`. This command **resolves the existing service project** and writes the
competitor benchmark into it.

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

### 2. Read the service's own artefacts

Read the service's existing documents so the benchmark reflects what you are actually offering — do
not re-ask for information already captured upstream. Use the **Read tool** on the resolved project's
files:

- Service design (this project): `ARC-{PROJECT_ID}-SVCD-v*.md` (the SVCD doc written by
  `/arckit:service-design`) — your service's features, lot, support model, certifications.
- Service Definition Document (this project): `ARC-{PROJECT_ID}-SDD-v*.md` if it exists.
- Pricing (this project): `ARC-{PROJECT_ID}-PRIC-v*.md` if it exists — your published price points,
  used to position against the market.

If the service-design document is missing, warn the user that running `/arckit:service-design` first
produces a richer, consistent benchmark, then continue with what is available.

### 3. Gather competitor data (WebSearch — primary path)

**WebSearch is the primary data path** for this command. Use it to discover comparable services on
the Digital Marketplace, then **WebFetch** the rival service listing pages to extract their details.

**Search queries to run:**

- `site:applytosupply.digitalmarketplace.service.gov.uk [service category]`
- `G-Cloud 14 [service type] suppliers`
- `Digital Marketplace [specific feature]`

Then use **WebFetch** on each competitor service URL to extract details.

**Key competitor information to gather (per rival service):**

- Service name and supplier
- Pricing model and price points
- Key features highlighted
- Support levels offered
- Certifications claimed
- Number of framework sales (if visible)

> Structured marketplace extraction via a `marketplace` MCP is a future enhancement (ships with the
> ArcKit market-intelligence overlay); this command uses WebSearch.

### 4. Anchor the benchmark to real award evidence (if available)

If `ARC-*-TNDR-*.md` or `ARC-*-CMPT-*.md` artefacts exist in this repo (produced by `/arckit:tenders`
/ `/arckit:competitors`), Read them and back the benchmark with their real award counts/values,
quoting their EXISTING citations and carrying the **awarded value ≠ actual spend** caveat.

This complements — it does not replace — the Digital Marketplace search above: the marketplace shows
*who is listed*; tender/competitor artefacts show *who actually won public contracts*. Use both for a
complete competitive picture.

> **Use award evidence where it exists.** For any competitor that appears in the TNDR/CMPT supplier
> aggregates or top-incumbent line, back the analysis with their real award count and total awarded
> value, and cite the supporting notice URLs as recorded in that artefact (e.g. "won 3 comparable DWP
> contracts 2021–24, total awarded £4.2m"). Quote figures with their **existing** citations — never
> re-derive or invent them — and carry the artefact's **awarded value ≠ actual spend** caveat. Do not
> invent figures.

#### Award Evidence (from TNDR/CMPT artefacts, if available)

| Competitor | Comparable awards | Total awarded value | Notice URLs |
|------------|-------------------|---------------------|-------------|
| [Competitor A] | X | £X | [link] |

### 5. Competitive analysis framework

#### Feature Comparison

| Feature | Your Service | Competitor A | Competitor B | Competitor C |
|---------|--------------|--------------|--------------|--------------|
| [Feature 1] | ✅ | ✅ | ❌ | ✅ |
| [Feature 2] | ✅ | ❌ | ✅ | ❌ |
| ... | | | | |

#### Pricing Comparison

| Tier | Your Price | Market Low | Market Average | Market High |
|------|------------|------------|----------------|-------------|
| Entry | £X | £X | £X | £X |
| Standard | £X | £X | £X | £X |
| Premium | £X | £X | £X | £X |

#### Certification Comparison

| Certification | Your Service | Industry % |
|---------------|--------------|------------|
| ISO 27001 | ✅/❌ | ~80% |
| Cyber Essentials Plus | ✅/❌ | ~60% |
| SOC 2 | ✅/❌ | ~40% |
| UK Data Centres | ✅/❌ | ~70% |

#### Support Comparison

| Aspect | Your Service | Market Standard |
|--------|--------------|-----------------|
| Hours | X | 9-5 M-F |
| Channels | X | Email + Phone |
| Response SLA | X | 4-8 hours |

### 6. Competitive positioning analysis (SWOT)

**Strengths (vs competitors):**

- List unique differentiators
- Price advantages
- Feature advantages
- Support advantages
- Certification advantages

**Weaknesses (vs competitors):**

- Missing features
- Price disadvantages
- Support gaps
- Certification gaps

**Opportunities:**

- Underserved market segments
- Features competitors lack
- Pricing gaps to exploit
- Emerging requirements

**Threats:**

- Strong competitors
- Price pressure
- Feature commoditization
- New entrants

### 7. Recommendations

Based on the analysis, provide recommendations:

**Pricing Recommendations:**

- Is current pricing competitive?
- Should tiers be adjusted?
- Are discounts appropriate?

**Feature Recommendations:**

- Missing table-stakes features?
- Differentiation opportunities?
- Features to highlight?

**Positioning Recommendations:**

- Unique value proposition
- Target buyer segments
- Messaging recommendations

**Search Optimisation:**

- Keywords competitors use
- Features to emphasize in description
- Benefits that resonate with buyers

### 8. Citation traceability

When you fetch a competitor page or a G-Cloud listing, query an MCP server, or read any document the
user has placed under the project's `external/`, `policies/`, or `vendors/` directories, follow the
citation instructions in `${CLAUDE_PLUGIN_ROOT}/references/citation-instructions.md`. Place inline
citation markers (e.g. `[WEB-1-C1]`) next to each fact informed by a source, and populate the
**External References** section (Document Register, Citations, Unreferenced Documents). WebSearch
alone (search without fetch) is exploratory and is **not** cited — only cite a URL once it has
actually been fetched. When you carry award figures from a TNDR/CMPT artefact, quote that artefact's
**existing** citations rather than minting new ones.

### 9. Determine the output filename

`GCMP` is a **single-instance** doc-type per service project. Generate the document ID and filename
with the ArcKit helper (no `--next-num` — GCMP is not multi-instance):

```bash
bash "${CLAUDE_PLUGIN_ROOT}/scripts/bash/generate-document-id.sh" \
     {PROJECT_ID} GCMP --filename
```

This returns `ARC-{NNN}-GCMP-v1.0.md` (using the zero-padded project number from Step 1). Use the
returned filename for the output document and take the version (`1.0`) from it. If the service
already has a competitor benchmark, increment the version and add a Revision History row instead of
overwriting at v1.0.

### 10. Write the benchmark report

Use the **Write tool** to save the completed benchmark to:

`{path}/{filename}` — e.g. `projects/004-secure-case-mgmt/ARC-004-GCMP-v1.0.md`

There is no separate template for this doc-type; structure the report inline using the sections
above (Award Evidence → Feature / Pricing / Certification / Support comparison tables → SWOT →
Recommendations → Market Position quadrant → Search Keywords → External References). Start the
document with a standard ArcKit Document Control header (Document ID = `ARC-{PROJECT_ID}-GCMP-v{VERSION}`,
Document Type = `G-Cloud Competitor Benchmark`, Classification defaulting to
`${user_config.default_classification}` and falling back to `OFFICIAL` for UK Gov context) and a
Revision History table, and append the standard ArcKit Document Control footer:

```markdown
---

**Generated by**: ArcKit `/arckit:gcloud-competitors` command
**Generated on**: [DATE]
**ArcKit Version**: [VERSION]
**Project**: [PROJECT_NAME] (Project [PROJECT_ID])
**Model**: [AI_MODEL]
```

(The Write tool creates parent directories automatically and avoids the 32K output-token limit.) Do
**not** echo the full document into your response — it is large and only a summary should be printed.

### 11. Output summary

Print only a short summary (not the full document):

```markdown
## Competitor Benchmark Complete

**Service:** [Name]
**Saved to:** `{path}/ARC-{PROJECT_ID}-GCMP-v1.0.md`
**Competitors Analysed:** [X]

### Market Position

```mermaid
quadrantChart
    title Market Position
    x-axis Basic Features --> Advanced Features
    y-axis Budget --> Premium
    quadrant-1 Feature Leaders
    quadrant-2 Market Leaders
    quadrant-3 Budget Options
    quadrant-4 Value Players
    Your Service: [0.6, 0.6]
    Competitor A: [0.8, 0.8]
    Competitor B: [0.4, 0.3]
    Competitor C: [0.7, 0.4]
```text

### Competitive Summary

| Dimension | Position | Action Needed |
|-----------|----------|---------------|
| Pricing | Mid-market | None |
| Features | Above average | Add [X] |
| Support | Below average | Extend hours |
| Security | Industry leading | Maintain |

### Key Differentiators

1. [Unique strength 1]
2. [Unique strength 2]
3. [Unique strength 3]

### Gaps to Address

1. [Gap 1] - Priority: High
2. [Gap 2] - Priority: Medium

### Recommended Actions

**Before Submission:**

1. [Action 1]
2. [Action 2]

**Post-Submission:**

1. [Action 1]
2. [Action 2]

---

## Search Keywords to Include

Based on the competitor analysis, ensure these appear in your service description:

- [Keyword 1]
- [Keyword 2]
- [Keyword 3]

### Next Steps

- Adjust pricing based on this benchmark: `/arckit:pricing`
- Fold competitive positioning into the submission review: `/arckit:review`

```

## Important Notes

- This is the **supplier-side** benchmark of your own listing — distinct from core buyer-side
  `/arckit:competitors`.
- Digital Marketplace pricing is public — competitors can see your prices too.
- Market changes during the framework period — periodic re-analysis is recommended.
- Buyer feedback on previous iterations is valuable competitive intelligence.
- Consider what makes buyers choose competitors over similar services.
- Features alone don't win — positioning and clarity matter.
- Never invent award figures: carry only what the TNDR/CMPT artefacts record, with their existing
  citations and the **awarded value ≠ actual spend** caveat.
- This command never creates a project — if none is found, direct the user to `/arckit:service-design`.
- **Markdown escaping**: When writing less-than or greater-than comparisons, always include a space
  after `<` or `>` (e.g. `< 3 seconds`, `> 99.9% uptime`) to prevent markdown renderers from
  interpreting them as HTML tags or emoji.
