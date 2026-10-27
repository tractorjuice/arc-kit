---
description: "[COMMUNITY] Generate an FCA Consumer Duty annual Board Report — customer outcomes evidence pack across the four outcomes (Products & Services, Price & Value, Consumer Understanding, Consumer Support), price & value assessment, target market assessment, fair-value framework."
doc-type: FSCD
argument-hint: "<project ID or product context, e.g. '003', 'retail FX cross-border payments'>"
effort: high
keep-coding-instructions: true
handoffs:
  - command: requirements
    description: Fair-value framework expresses as NFRs in the requirements artefact.
  - command: stakeholders
    description: Target market assessment feeds Goals + stakeholder traceability.
  - command: dpia
    description: Price-personalisation or vulnerable-customer scoring involves profiling — DPIA required.
  - command: risk
    description: Foreseeable harms map to Orange Book risk register entries.
  - command: uk-fs-sca-rts
    description: SCA biometric/accessibility design intersects with Consumer Understanding outcome for vulnerable customers.
  - command: uk-fs-safeguarding
    description: EMI/PI redemption accessibility under Consumer Support outcome intersects with safeguarding obligations.
allowed-tools:
  - Read(/${CLAUDE_PLUGIN_ROOT}/**)
  - Bash(bash ${CLAUDE_PLUGIN_ROOT}/scripts/bash/create-project.sh *)
  - Bash(bash "${CLAUDE_PLUGIN_ROOT}/scripts/bash/create-project.sh" *)
  - Bash(${CLAUDE_PLUGIN_ROOT}/scripts/bash/create-project.sh *)
  - Bash(node ${CLAUDE_PLUGIN_ROOT}/scripts/generate-document-id.mjs *)
  - Bash(node "${CLAUDE_PLUGIN_ROOT}/scripts/generate-document-id.mjs" *)
---

> ⚠️ **Community-contributed command** — not part of the officially-maintained ArcKit baseline. Output is
> **not** regulatory advice. The Consumer Duty Board Report MUST be reviewed, materially supplemented,
> and signed off by qualified UK FS regulatory counsel, the firm's Compliance Officer, the firm's MLRO
> (where the vulnerable-customer identification methodology or price-personalisation logic intersects
> with AML risk profiling or customer-onboarding flows), and the individuals who will sign the
> attestation for the governing body (SMF holders only if the firm is within SM&CR) before it is
> presented to the Board. FCA Consumer Duty publications (PS22/9, FG22/5, board-report observations)
> may have been updated since this command was authored — verify against the current FCA website
> before reliance.

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
bash ${CLAUDE_PLUGIN_ROOT}/scripts/bash/create-project.sh --json --name "<product-context>"
```

If the project already exists, locate it by scanning `projects/` for the matching numbered directory
instead of recreating it. Extract `project_dir` and `project_number` from the JSON output.

### Step 2 — Generate the document ID

Work out `{VERSION}` first with `${CLAUDE_PLUGIN_ROOT}/references/version-detection.md`: a re-run writes the next version beside the earlier file, never over it.

Run:

```bash
node ${CLAUDE_PLUGIN_ROOT}/scripts/generate-document-id.mjs <PROJECT_NUMBER> FSCD {VERSION} --filename
```

This produces a filename of the form `ARC-NNN-FSCD-v{VERSION}.md`. FSCD is the doc-type code for this
artefact.

### Step 3 — Read the templates and rendering partials

Use the Read tool to read both templates (check `.arckit/templates-custom/` first, fall back to
`${CLAUDE_PLUGIN_ROOT}/templates/`):

- `${CLAUDE_PLUGIN_ROOT}/templates/uk-fs-consumer-duty-template.md` — master artefact template
- `${CLAUDE_PLUGIN_ROOT}/templates/uk-fs-consumer-duty-board-report-template.md` — board attestation
  and outcome summary block (inlined into §9 of the master template)

Then read the rendering and citation partials so the Document Control header and inline citation
markers are applied consistently with peer ArcKit commands:

- `${CLAUDE_PLUGIN_ROOT}/templates/_partials/RENDERING.md` — Document Control header rendering rules
  and Classification field substitution guidance (resolves the `<!-- DOC-CONTROL-HEADER -->` marker
  and the `{{CLASSIFICATION}}` placeholder from `user_config.default_classification`).
- `${CLAUDE_PLUGIN_ROOT}/references/citation-instructions.md` — inline citation marker format and
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

Before writing, read `${CLAUDE_PLUGIN_ROOT}/references/quality-checklist.md` and verify all **Common Checks** plus the **FSCD** per-type checks pass. Fix any failures before proceeding.

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
  operational capability risks even where those harms have not yet occurred.
- **Price-personalisation (e.g. dynamic FX rates, tiered fee structures) is a high-scrutiny area.**
  Where the firm's pricing algorithm produces different prices for different consumers, it must
  demonstrate that the variation reflects genuine cost or risk differentials, not discriminatory
  profiling. DPIA and Article 22 UK GDPR alignment is required where automated decision-making
  affects individual consumers materially.
- **The governing body approves the report; name the individuals who sign for it.** PRIN 2A.8.4R
  requires the firm's governing body, at least annually, to review and approve the report, confirm
  whether it is satisfied the firm is complying with the Consumer Duty, and assess whether the
  firm's future business strategy is consistent with it; PRIN 3.1.1AR applies PRIN to EMIs,
  authorised and small payment institutions and RAISPs. The rule names no signatories. Name the
  individuals who sign the attestation block, not teams. Use SMF titles only if the firm is within
  SM&CR (FSMA-authorised, e.g. a bank or a firm with a Part 4A permission): typically SMF1 (Chief
  executive), SMF9 (Chair of the governing body) and SMF16 (Compliance oversight). A PI or EMI
  authorised only under the PSRs 2017 or EMRs 2011 is outside SM&CR: name its directors and the
  persons responsible for management notified to the FCA (PSRs 2017 reg 6(7)(b); EMRs 2011
  reg 6(6)(b)).
- **Read the FCA's two board-report publications before finalising.** "Consumer Duty board reports:
  good practice and areas for improvement" (published 11 December 2024; last updated 9 March 2026,
  with insight for smaller firms added on 24 February 2026) reviewed the first annual board reports
  from 180 firms. Its areas for improvement are data quality, a comprehensive view across
  distribution chains, analysis of different customer types including those with characteristics
  of vulnerability, challenge from the board, and taking effective action. The FCA blog "Year 2
  Consumer Duty Board Reports: progress and what comes next" (16 April 2026) found firms had
  improved but that gaps remained: data presented without saying what it shows about outcomes,
  weak monitoring of outcomes delivered through distribution chains, board challenge not
  documented, and less attention to consumer understanding and support than to products and value.
- **The FCA removed the mandatory Consumer Duty Board Champion requirement in February 2025.**
  Per the FCA's 27 February 2025 update to PS22/9: "We no longer expect firms to have a Consumer
  Duty Board champion, although they can retain the role should they wish to do so." If the firm
  voluntarily retains a Board Champion, their name should appear in `{{OTHER_ATTESTOR_NAMES}}` in the
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

> **Note on PRIN 2A (FCA Handbook)**: The FCA Handbook at `handbook.fca.org.uk` has stable links
> to each chapter and section, for example `https://handbook.fca.org.uk/handbook/prin2a` (PRIN 2A)
> and `https://handbook.fca.org.uk/handbook/prin2a/prin2as8` (PRIN 2A.8). Cite the section that
> holds the rule. FCA 2022/31 is the instrument that introduced Principle 12 and PRIN 2A; the
> Handbook shows the rules as amended since.
>
> **Note on FG22/5**: This document is published as PDF only. There is no standalone HTML publication
> page for FG22/5 on the FCA website. The PDF URL below was verified as live.

| Reference | Verified URL |
|-----------|-------------|
| FCA PS22/9 — A new Consumer Duty (policy statement, July 2022) | <https://www.fca.org.uk/publications/policy-statements/ps22-9-new-consumer-duty> |
| FCA FG22/5 — Guidance for firms on the Consumer Duty (PDF, August 2022) | <https://www.fca.org.uk/publication/finalised-guidance/fg22-5.pdf> |
| FCA PS22/9 — Policy Statement PDF | <https://www.fca.org.uk/publication/policy/ps22-9.pdf> |
| FCA Consumer Duty board reports: good practice and areas for improvement (11 December 2024, last updated 9 March 2026) | <https://www.fca.org.uk/publications/good-and-poor-practice/consumer-duty-board-reports-good-practice-areas-improvement> |
| FCA blog — Year 2 Consumer Duty Board Reports: progress and what comes next (16 April 2026) | <https://www.fca.org.uk/news/blogs/year-2-consumer-duty-board-reports-progress-and-what-comes-next> |
| FCA Consumer Duty — information for firms | <https://www.fca.org.uk/firms/consumer-duty/information-firms> |
| FCA Handbook PRIN 2A — The Consumer Duty | <https://handbook.fca.org.uk/handbook/prin2a> |
| FCA Handbook PRIN 2A.8 — Governance and culture (governing body report, PRIN 2A.8.3R to 2A.8.5R) | <https://handbook.fca.org.uk/handbook/prin2a/prin2as8> |
| FCA Handbook PRIN 2.1 — The Principles (Principle 12) | <https://handbook.fca.org.uk/handbook/prin2/prin2s1> |
| FCA Handbook PRIN 3.1 — Who? (PRIN 3.1.1AR applies PRIN to EMIs and payment institutions) | <https://handbook.fca.org.uk/handbook/prin3/prin3s1> |
| FCA 2022/31 — Consumer Duty Instrument 2022 (introduces Principle 12 and PRIN 2A) | <https://api-handbook.fca.org.uk/files/instrument/2022/FCA_2022_31.pdf> |

## Output Summary

After writing the artefact, print only:

- File path written
- Outcome coverage: list each of the four outcomes with Green / Amber / Red status as assessed
- Number of foreseeable harms identified
- Vulnerable customer cohorts identified (count and whether evidence-based or flagged as assumed)
- Board attestation block: signatories' names and roles populated or marked PENDING, and whether
  the firm is within SM&CR
- Citation count
- Any items flagged as requiring legal sign-off or Board review before the report is presented
