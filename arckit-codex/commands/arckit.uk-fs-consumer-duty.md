---
description: "[COMMUNITY] Generate an FCA Consumer Duty annual Board Report — customer outcomes evidence pack across the four outcomes (Products & Services, Price & Value, Consumer Understanding, Consumer Support), price & value assessment, target market assessment, fair-value framework."
---

> ⚠️ **Community-contributed command** — not part of the officially-maintained ArcKit baseline. Output is
> **not** regulatory advice. The Consumer Duty Board Report MUST be reviewed, materially supplemented,
> and signed off by qualified UK FS regulatory counsel, the firm's Compliance Officer, the firm's MLRO
> (where the vulnerable-customer identification methodology or price-personalisation logic intersects
> with AML risk profiling or customer-onboarding flows), and the SMF holders who will attest the report
> before it is presented to the Board. FCA Consumer Duty publications (PS22/9, FG22/5, board-report
> observations) may have been updated since this command was authored — verify against the current FCA
> website before reliance.

You are a Consumer Duty lead drafting the Annual Board Report on retail customer outcomes for an
authorised UK Payment Service Provider (PSP), Electronic Money Institution (EMI), or Payment
Institution (PI) with retail customers, subject to FCA Principle 12 and PRIN 2A as introduced by
PS22/9 (Consumer Duty, 2022, in force 31 July 2023 for open products / 31 July 2024 for closed
products).

## User Input

```text
$ARGUMENTS
```

## Task

### Step 1 — Resolve the project path

Run:

```bash
.arckit/scripts/bash/create-project.sh --json --name "<product-context>"
```

If the project already exists, locate it by scanning `projects/` for the matching numbered directory
instead of recreating it. Extract `project_dir` and `project_number` from the JSON output.

### Step 2 — Generate the document ID

Run:

```bash
.arckit/scripts/bash/generate-document-id.sh <PROJECT_NUMBER> FSCD --filename
```

This produces a filename of the form `ARC-NNN-FSCD-v1.0.md`. FSCD is the doc-type code for this
artefact.

### Step 3 — Read the templates and rendering partials

Use the Read tool to read both templates (check `.arckit/templates-custom/` first, fall back to
`.arckit/templates/`):

- `.arckit/templates/uk-fs-consumer-duty-template.md` — master artefact template
- `.arckit/templates/uk-fs-consumer-duty-board-report-template.md` — board attestation
  and outcome summary block (inlined into §9 of the master template)

Then read the rendering and citation partials so the Document Control header and inline citation
markers are applied consistently with peer ArcKit commands:

- `.arckit/templates/_partials/RENDERING.md` — Document Control header rendering rules
  and Classification field substitution guidance (resolves the `<!-- DOC-CONTROL-HEADER -->` marker
  and the `{{CLASSIFICATION}}` placeholder from `user_config.default_classification`).
- `.arckit/references/citation-instructions.md` — inline citation marker format and
  External References block requirements.

### Step 4 — Gather context

Read (if present):

- `projects/000-global/ARC-000-PRIN-*.md` — architecture principles
- The project's REQ artefact — extract NFR-COMP requirements and any customer-facing
  commitments, pricing policies, or service-level definitions
- The project's STKE artefact — extract target market and stakeholder populations; these map
  directly to the Products & Services outcome target-market assessment
- The project's RISK artefact — extract any consumer-harm or conduct risk entries; these feed
  the Foreseeable Harms register in §7
- `projects/<project_dir>/external/` — any regulatory evidence, prior Board Reports, FCA
  correspondence, complaints data, or management information placed there by the user

### Step 5 — Assess outcome coverage

For each of the four Consumer Duty outcomes, determine the evidence the firm can document and flag
any outcomes where the evidence is thin (Amber or Red status):

| Outcome | Key evidence types | Common gaps for PSPs/EMIs/PIs |
|---------|-------------------|-------------------------------|
| Products & Services | Target market definition; distribution strategy; foreseeable-harm identification; product approval records | Poorly defined target markets; inherited legacy products not re-reviewed post-Duty |
| Price & Value | Total cost-to-consumer analysis; benchmarking against comparators; fair-value statement | Opaque FX spread mark-up; fee stacking; failure to include all ancillary charges |
| Consumer Understanding | Communications testing results; comprehension evidence; disclosure design review; pre-contract information | Assuming consumers understand payment jargon; PDF-only disclosure without accessibility testing |
| Consumer Support | Service-level data (call wait times, resolution rates); customer journey analysis; complaint trend analysis | Inadequate support for vulnerable customers; complaint-handling SLAs not tracked end-to-end |

For **Price & Value (Outcome 2)** specifically, document:

- Total cost to consumer broken down by fee type (transaction fee, FX spread, account fee,
  inactivity fee, ancillary charges)
- The fair-value methodology: how the firm determines whether price is reasonable relative to the
  benefit delivered to the consumer
- Benchmarking approach: how the firm has compared its pricing to at least two comparable
  competitors or market indices
- Whether any cross-subsidisation occurs (e.g., profitable customer segments subsidising loss-making
  ones) and whether this is consistent with the fair-value obligation

For **Consumer Support (Outcome 4)** specifically, include:

- Service-level evidence across all contact channels (phone, chat, email, in-app)
- Complaint volumes, root-cause analysis, and trend direction year-on-year
- Escalation and FOS referral rates
- Evidence that the support journey is accessible to customers with characteristics of vulnerability

### Step 6 — Generate the vulnerable customer cohort summary

Produce the vulnerable customer section (§6) using evidence-based identification, not assumed
demographics. The four vulnerability drivers per FG22/5 are: **health** (physical or mental),
**life events** (bereavement, divorce, job loss), **resilience** (low financial literacy, low
savings buffer), and **capability** (language barriers, low digital literacy).

For each cohort the firm has identified, document:

- Estimated proportion of customer base (quantitative, even if approximate)
- Identification method (self-declaration, proxy indicators, customer support flags)
- Additional support offered and evidence it is effective
- Any gap between the proportion of customers with characteristics of vulnerability and the
  proportion accessing the firm's additional-support pathways (a material gap is a red flag)

### Step 7 — Populate the foreseeable harms register

For each foreseeable harm identified in Step 5, create a row in the Foreseeable Harms register (§7)
with:

- A unique harm identifier (HARM-001, HARM-002, …)
- Harm description and the outcome it falls under
- Severity (High / Medium / Low) — assess both likelihood and impact
- Mitigations in place (both product-design and operational controls)
- Residual risk (post-mitigation severity)
- Owner (named role, not a team name)
- Cross-reference to the project RISK artefact entry (if populated in Step 4)

Foreseeable harm is a **forward-looking standard** — past complaints data alone is not sufficient.
The firm must consider harms that could arise from the product design, the distribution channel, the
target market, and the firm's operational capability even where those harms have not yet materialised.

### Step 8 — Write the artefact

Create the output directory if it does not already exist:
`<project_dir>/payments-compliance/`

Use the **Write tool** to save the completed document to:
`projects/<NNN>-<slug>/payments-compliance/ARC-<NNN>-FSCD-v1.0.md`

Do **not** echo the full document to the console — the Write tool avoids the 32K output limit.

Inline the completed board-report block from `uk-fs-consumer-duty-board-report-template.md` into
the `{{INSERT_BOARD_REPORT_BLOCK_HERE}}` placeholder in §9 of the master template.

Append the standard ArcKit Document Control footer at the end of the document:

```markdown
---

**Generated by**: ArcKit `/arckit:uk-fs-consumer-duty` command
**Generated on**: [DATE]
**ArcKit Version**: [VERSION]
**Project**: [PROJECT_NAME]
**Model**: [AI_MODEL]
```

The `provenance-stamp.mjs` hook in core automatically appends a `## Build Provenance` block to
artefacts under `projects/**` — do not include it manually.

### Step 9 — Output summary

Print the summary per `## Output Summary` below. Do not echo the full artefact.

## Important Notes

- **Consumer Duty applies to firms with retail customers only.** Wholesale-only firms (no retail
  customer relationships) are out of scope. Firms with a mixed book should document which products
  and channels are in scope and mark wholesale-only sections N/A with an explicit rationale.
- **Fair-value assessment is a year-round obligation, not a one-time exercise.** The Board Report
  attests to the firm's ongoing fair-value position — it does not create that position. If the firm
  lacks a documented fair-value framework running throughout the year, the Board cannot validly attest
  to Outcome 2 and this gap must be surfaced explicitly.
- **Vulnerable customer cohort identification must be evidence-based, not assumed.** Stating that
  "5% of customers may be vulnerable" without a documented identification method or proxy-indicator
  analysis is not compliant with FCA FG22/5. The firm must show how it identifies customers with
  characteristics of vulnerability in practice.
- **"Foreseeable harm" is a forward-looking standard — past complaints data is necessary but not
  sufficient.** The harm assessment must consider product-design risks, distribution risks, and
  operational capability risks even where those harms have not yet occurred. FCA board-report
  observations (December 2024) found many firms were backward-looking only.
- **Price-personalisation (e.g. dynamic FX rates, tiered fee structures) is a high-scrutiny area.**
  Where the firm's pricing algorithm produces different prices for different consumers, it must
  demonstrate that the variation reflects genuine cost or risk differentials, not discriminatory
  profiling. DPIA and Article 22 UK GDPR alignment is required where automated decision-making
  affects individual consumers materially.
- **Board attestation is a regulatory artefact — SMF holders sign, not just the executive sponsoring
  the product.** The attestation must be signed by the named SMF holders (typically SMF3 — CEO,
  SMF7 — Group Entity Senior Manager or equivalent, and the SMF for Compliance Oversight). The FCA's
  December 2024 observations noted a pattern of attestation blocks that listed teams rather than
  named individuals.
- **The FCA's December 2024 good-and-poor-practice observations show what "doing it right" looks
  like.** The FCA reviewed 180 firms' first annual Board Reports and found common weaknesses: lack
  of outcome-specific metrics, backward-looking harm assessments, under-evidenced vulnerable customer
  sections, and forward plans that were generic rather than firm-specific. Read these observations
  before finalising.
- **The FCA removed the mandatory Consumer Duty Board Champion requirement in February 2025.**
  Per the FCA's 27 February 2025 update to PS22/9: "We no longer expect firms to have a Consumer
  Duty Board champion, although they can retain the role should they wish to do so." If the firm
  voluntarily retains a Board Champion, their name should appear in `{{OTHER_SMF_NAMES}}` in the
  board-report block; if not, this field need not include that role. Verify the firm's governance
  model against the FCA's Feb 2025 update before relying on any Board Champion language carried
  over from earlier templates. The FCA has indicated FG22/5 will be updated to reflect this change
  in due course.
- **Note on FG22/5 format**: FG22/5 (Guidance for firms on the Consumer Duty, August 2022) is
  published by the FCA as a PDF only — there is no standalone HTML page. The verified PDF URL is
  cited in the Required Citations table below.

## Required Citations

Each of these URLs was verified as live at authoring time. Include all of them in the §10 References
section of the generated document. Verify against the source before relying on this output — FCA
publications are updated without prior notice.

> **Note on PRIN 2A (FCA Handbook)**: The `handbook.fca.org.uk` interface (maintained by FinregE)
> does not support stable deep links to individual chapters — all deep-link attempts return the
> handbook homepage. The stable reference for PRIN 2A is via the FCA's published instrument
> FCA 2022/31 (Consumer Duty instrument introducing PRIN 2A), or navigate to PRIN 2A via the
> FCA Handbook homepage at `https://www.handbook.fca.org.uk`.
>
> **Note on FG22/5**: This document is published as PDF only. There is no standalone HTML publication
> page for FG22/5 on the FCA website. The PDF URL below was verified as live.

| Reference | Verified URL |
|-----------|-------------|
| FCA PS22/9 — A new Consumer Duty (policy statement, July 2022) | <https://www.fca.org.uk/publications/policy-statements/ps22-9-new-consumer-duty> |
| FCA FG22/5 — Guidance for firms on the Consumer Duty (PDF, August 2022) | <https://www.fca.org.uk/publication/finalised-guidance/fg22-5.pdf> |
| FCA PS22/9 — Policy Statement PDF | <https://www.fca.org.uk/publication/policy/ps22-9.pdf> |
| FCA Consumer Duty board reports: good practice and areas for improvement (December 2024, updated March 2026) | <https://www.fca.org.uk/publications/good-and-poor-practice/consumer-duty-board-reports-good-practice-areas-improvement> |
| FCA Consumer Duty — information for firms | <https://www.fca.org.uk/firms/consumer-duty/information-firms> |
| FCA Handbook (entry point — navigate to PRIN 2A for Consumer Duty rules) | <https://www.handbook.fca.org.uk> |
| FCA 2022/31 — Consumer Duty instrument (introduces Principle 12 and PRIN 2A) | <https://www.fca.org.uk/publication/policy/fca-2022-31.pdf> |

## Output Summary

After writing the artefact, print only:

- File path written
- Outcome coverage: list each of the four outcomes with Green / Amber / Red status as assessed
- Number of foreseeable harms identified
- Vulnerable customer cohorts identified (count and whether evidence-based or flagged as assumed)
- Board attestation block: SMF holder roles populated or marked PENDING
- Citation count
- Any items flagged as requiring legal sign-off or Board review before the report is presented

## Suggested Next Steps

After completing this command, consider running:

- `/arckit:requirements` -- Fair-value framework expresses as NFRs in the requirements artefact.
- `/arckit:stakeholders` -- Target market assessment feeds Goals + stakeholder traceability.
- `/arckit:dpia` -- Price-personalisation or vulnerable-customer scoring involves profiling — DPIA required.
- `/arckit:risk` -- Foreseeable harms map to Orange Book risk register entries.
- `/arckit:uk-fs-sca-rts` -- SCA biometric/accessibility design intersects with Consumer Understanding outcome for vulnerable customers.
- `/arckit:uk-fs-safeguarding` -- EMI/PI redemption accessibility under Consumer Support outcome intersects with safeguarding obligations.
