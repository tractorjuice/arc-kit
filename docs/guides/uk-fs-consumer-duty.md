# Consumer Duty Annual Board Report (`/arckit:uk-fs-consumer-duty`)

> **Status**: EXPERIMENTAL · Community-contributed · **Output is not regulatory advice.**
> The Consumer Duty Board Report MUST be reviewed, materially supplemented, and signed off by
> qualified UK FS regulatory counsel, the firm's Compliance Officer, the firm's MLRO (where the
> vulnerable-customer identification methodology or price-personalisation logic intersects with AML
> risk profiling), and the SMF holders who will attest the report before it is presented to the
> Board. FCA Consumer Duty publications (PS22/9, FG22/5, board-report observations) may have been
> updated since this command was authored — verify against the current FCA website before reliance.

## Purpose

The `/arckit:uk-fs-consumer-duty` command generates an FCA Consumer Duty Annual Board Report for
an authorised UK Payment Service Provider (PSP), Electronic Money Institution (EMI), or Payment
Institution (PI) with retail customers. The report covers the four Consumer Duty outcomes introduced
by FCA PS22/9 (in force 31 July 2023 for open products / 31 July 2024 for closed products) and
anchored in FCA Principle 12 and PRIN 2A (introduced by FCA 2022/31).

The artefact is structured to support the Board attestation requirement — named SMF holders must
attest to each outcome section before the report is presented to the Board. It is not a template
for copying: fair-value assessments, vulnerable customer identification, and foreseeable harm
registers must be grounded in the firm's own evidence, not assumed demographics or generic
statements.

---

## When to Use

- **Annual Board Report cycle** — the FCA expects firms to produce an annual Board Report assessing
  performance against the four outcomes. The report should cover the period since the last report
  (or since Duty in-force date for the first report).
- **Product launch or material change** — a new product, a fee change, a change to the distribution
  strategy, or a change to the target market definition requires an updated target market assessment
  and, where the change affects Price and Value, a refreshed fair-value statement.
- **Post-FCA observation cycle** — the FCA's December 2024 good-and-poor-practice observations
  identified common weaknesses (backward-looking harm assessments, under-evidenced vulnerable
  customer sections, generic forward plans). If the firm's existing Board Report exhibits these
  weaknesses, this command provides a structured re-draft.
- **Vulnerable customer cohort refresh** — if the firm's identification methodology has changed
  (new proxy indicators, updated MI, changes to the customer support journey), the cohort summary
  needs updating independently of the annual cycle.
- **New product with price-personalisation** — dynamic FX rates, tiered fee structures, or
  behavioural pricing require a Price and Value assessment before launch; this command generates
  the structured evidence framework.

---

## Inputs

Pass the project ID and product context as `$ARGUMENTS`:

```text
/arckit:uk-fs-consumer-duty 003 retail FX cross-border payments
```

The argument should include:

- The project number or an existing project directory name.
- A brief description of the product or product portfolio in scope.
- Optionally: the reporting period (e.g. "July 2024 to July 2025"), whether any products are
  closed to new customers (different Duty timeline), and any known outcome gaps the firm wants to
  address explicitly.

The command reads the project's REQ, STKE, and RISK artefacts where present — the stakeholder
population in STKE maps directly to the target market assessment, and risk entries feed the
Foreseeable Harms register.

---

## Output

**Doc-type code**: FSCD

**Output path**: `projects/<NNN>-<slug>/payments-compliance/ARC-<NNN>-FSCD-v1.0.md`

The generated artefact contains the following sections:

1. Document Control (classification, owner, SMF holders, review cycle)
2. Scope and Reporting Period (products in scope, open vs closed product classification)
3. Products and Services Outcome (target market assessment, distribution strategy, foreseeable
   harms identified at product design level)
4. Price and Value Outcome (total cost-to-consumer breakdown; fair-value methodology; benchmarking
   against at least two comparators; cross-subsidisation assessment)
5. Consumer Understanding Outcome (communications testing evidence; comprehension evidence;
   disclosure design review; pre-contract information assessment)
6. Consumer Support Outcome (service-level data across all channels; complaint trend analysis;
   FOS referral rate; escalation pathway accessibility)
7. Vulnerable Customer Cohort Summary (per the FG22/5 four vulnerability drivers; evidence-based,
   not assumed)
8. Foreseeable Harms Register (HARM-NNN entries with severity, mitigations, residual risk, owner)
9. Board Attestation Block (SMF holder names, roles, attestation statements — inlined from
   the board-report template)
10. References (all required citations)

---

## Key Regulatory Anchors

**The four Consumer Duty outcomes** (PS22/9 / PRIN 2A):

| Outcome | Core obligation |
|---------|-----------------|
| Products and Services | Products and services must be designed to meet the needs of, and be sold to, an identified target market |
| Price and Value | The price a consumer pays must be reasonable relative to the benefit they receive |
| Consumer Understanding | Firms must communicate in a way that consumers can understand, enabling informed decisions |
| Consumer Support | Firms must provide support that meets consumers' needs throughout the product lifecycle |

**Fair-value assessment** is a year-round obligation, not an annual exercise. The Board cannot
validly attest to Outcome 2 unless the firm has run a documented fair-value framework throughout
the period — the Board Report attests to that position, it does not create it.

**Vulnerable customer identification** must use the four vulnerability drivers per FCA FG22/5:
health (physical or mental condition), life events (bereavement, divorce, job loss), resilience
(low financial literacy, low savings buffer), and capability (language barriers, low digital
literacy). Stating that "5% of customers may be vulnerable" without a documented identification
method is not compliant.

**February 2025 update**: The FCA removed the mandatory Consumer Duty Board Champion requirement
on 27 February 2025. Firms that voluntarily retain the role may include the Board Champion's name
in the attestation block; firms that do not retain the role need not include it. The command
implements this update — do not carry over Board Champion language from templates drafted before
February 2025 without verifying the firm's current governance model.

**PRIN 2A** (the Consumer Duty sourcebook rules) is accessed via the FCA Handbook at
`https://www.handbook.fca.org.uk`. The Handbook does not support stable deep links to individual
chapters; navigate via the Handbook homepage or cite FCA 2022/31 (the instrument that introduced
PRIN 2A) for a stable legislative anchor.

---

## Composes With

| Command | Relationship |
|---------|--------------|
| `/arckit:requirements` | Fair-value framework obligations express as NFR-COMP requirements in the requirements artefact. Cross-reference FSCD entries to the relevant NFR-COMP IDs. |
| `/arckit:stakeholders` | Target market assessment (Outcome 1) maps directly to the stakeholder Goals section — use the STKE artefact as the primary input. |
| `/arckit:dpia` | Price-personalisation (dynamic FX rates, tiered fees) or vulnerable-customer scoring using proxy indicators involves profiling under UK GDPR — a DPIA is required. |
| `/arckit:risk` | Foreseeable harms in the Consumer Duty report map to Orange Book risk entries. Cross-reference HARM-NNN identifiers to RISK artefact entries for traceability. |
| `/arckit:uk-fs-sca-rts` | SCA biometric and device-fingerprinting design intersects with the Consumer Understanding outcome for customers with accessibility needs or characteristics of vulnerability. |
| `/arckit:uk-fs-safeguarding` | EMI and PI redemption accessibility under the Consumer Support outcome intersects with safeguarding obligations — customers must be able to redeem funds promptly. |

---

## Important Caveats

- **Consumer Duty applies to firms with retail customers only.** Wholesale-only firms are out of
  scope. Firms with a mixed book must document which products and channels are in scope and mark
  wholesale-only sections explicitly as N/A with a rationale.
- **"Foreseeable harm" is a forward-looking standard.** The FCA's December 2024 board-report
  observations found many firms were backward-looking — using past complaints data as the primary
  harm evidence. Past data is necessary but not sufficient. The harm assessment must consider
  product-design risks, distribution risks, and operational capability risks that could arise even
  where they have not yet materialised.
- **Board attestation requires named SMF holders, not teams.** The FCA's December 2024 observations
  noted a pattern of attestation blocks listing teams rather than named individuals. The attestation
  must be signed by the named SMFs — typically SMF3 (CEO), SMF7 (Group Entity Senior Manager or
  equivalent), and the SMF for Compliance Oversight — not by "the Compliance Team".
- **Price-personalisation is a high-scrutiny area.** Where the firm's pricing algorithm produces
  different prices for different consumers, it must demonstrate that variation reflects genuine cost
  or risk differentials, not discriminatory profiling. DPIA and Article 22 UK GDPR alignment is
  required where automated decision-making affects individual consumers materially.
- **The Board Report is a regulatory artefact.** The FCA expects the report to be presented to
  the Board — not merely filed internally. The attestation block must reflect actual Board
  engagement, not a sign-off-by-email trail.

---

## References

| Reference | URL |
|-----------|-----|
| FCA PS22/9 — A new Consumer Duty (policy statement, July 2022) | <https://www.fca.org.uk/publications/policy-statements/ps22-9-new-consumer-duty> |
| FCA FG22/5 — Guidance for firms on the Consumer Duty (PDF, August 2022) | <https://www.fca.org.uk/publication/finalised-guidance/fg22-5.pdf> |
| FCA PS22/9 — Policy Statement PDF | <https://www.fca.org.uk/publication/policy/ps22-9.pdf> |
| FCA Consumer Duty board reports: good practice and areas for improvement (December 2024, updated March 2026) | <https://www.fca.org.uk/publications/good-and-poor-practice/consumer-duty-board-reports-good-practice-areas-improvement> |
| FCA Consumer Duty — information for firms | <https://www.fca.org.uk/firms/consumer-duty/information-firms> |
| FCA Handbook (entry point — navigate to PRIN 2A for Consumer Duty rules) | <https://www.handbook.fca.org.uk> |
| FCA 2022/31 — Consumer Duty instrument (introduces Principle 12 and PRIN 2A) | <https://www.fca.org.uk/publication/policy/fca-2022-31.pdf> |
