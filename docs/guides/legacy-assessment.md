# Legacy IT assessment

Legacy is a classification of unacceptable burden or risk, assessed against owner
thresholds. Age alone does not decide it. ArcKit assesses existing project systems,
records evidence and policy gaps, and supplies remediation actions for investment and
planning. It separately calculates the older published numerical model, which remains
under review following the August 2026 definition.

## Run an assessment

```text
/arckit:legacy-assessment 001
/arckit:legacy-assessment 001 systems "Payments, Reporting"
/arckit:legacy-assessment 001 as-of 2026-10-28 risk-model published
/arckit:legacy-assessment 001 risk-model none
```

Codex uses `$arckit-legacy-assessment`; Copilot uses `/arckit-legacy-assessment`.
The date defaults to the local calendar date. The command resolves an existing project
and confirms ambiguous system boundaries; it does not silently create a new project.
It writes `ARC-001-LEGACY-v1.0.md`, a JSON sidecar and, when numerical scoring is
enabled, `ARC-001-LEGACY-v1.0-risk.svg` in that project's directory. The report embeds
the chart; keep these files together when sharing it.
A reassessment preserves earlier versions: minor for evidence refresh, major for
material scope or policy changes. New report approval remains pending.

## Evidence and policy

Supply exact support/version notices, contracts and operating rights, tested skills,
incidents, capacity, security evidence and dependency-owner attestations. Architecture
artifacts help, but missing principles or requirements are gaps, not blockers. A
proposal is not operating evidence; a contract is not proof of patch availability.

For each D1–D7 rule, supply source, owner, version, approval evidence, effective date,
applicability and unacceptable/warning conditions. If policy is missing, the command
proposes prose rules for owner review. Those are ArcKit suggestions, not government
thresholds. Neither the model nor calculator can approve them or the report.

Each finding has an outcome, a policy basis and completeness. Unknown is an internal
state. Established Legacy wins; otherwise Unknown makes the result Undetermined,
then Action-Required wins over Accepted. Draft rules make material findings provisional.
An approved-policy Legacy can remain conclusive while other evidence is incomplete.
The warning horizon is 12 calendar months inclusive, with leap-day clamping.

## Examples

### Single system with approved policy

An older Payments system has dated support/patch records, recovery tests, skills
coverage, measured business performance, applicable security evidence and dependency
attestations. Approved owner rules support Accepted findings in all seven criteria.
The outcome may be Accepted regardless of age. Independent three-year numerical
inputs are assessed from the published rubric, not copied from classification.

### Multiple systems and dependencies

A new Reporting application relies on Payments. Payments has an established Legacy
support finding. A diagram connection is not enough: record actual reliance and the
applicable D7 decision rule. If it qualifies, the helper preserves the causal path
`Reporting → Payments → support finding`, including provisional status. A cycle
without an originating Legacy finding creates none. Unassessed external dependencies
create gaps. Unrelated projects are not automatically scanned.

### Incomplete evidence

Support is verified but skills and dependency evidence are missing. Record Unknown
findings; the result is Undetermined with the strongest known finding shown separately.
If classification evidence is complete but one numerical input is absent, classification
can be conclusive while numerical risk remains incomplete. Never average fewer inputs,
substitute zero or infer acceptability from missing documents.

### Draft policy and remediation

Support has expired and no applicable policy is supplied. Propose a local support rule,
record a provisional Legacy finding and request owner review. An unfunded migration
proposal does not close it. Actions include containment, delivery/business risk owners,
funding, milestones, closure evidence and reassessment. Unknown costs and dates remain
null; suggested roles and indicative dates are clearly proposals.

## Reproduce calculations

The dependency-free Node helper runs offline, validates the bundled versioned schema
and references, and emits enriched JSON. It never changes input or verifies evidence truth.

```bash
node plugins/arckit-claude/scripts/legacy-assessment.mjs --input assessment.json --json
```

In a CLI-scaffolded project use `.arckit/scripts/legacy-assessment.mjs`; extensions carry
`scripts/legacy-assessment.mjs` with sibling `schemas/` and `data/` assets. Exit 0 includes
valid incomplete assessments, 1 means invalid input, and 2 means invocation/read or
bundled-asset failure.
Capture stdout to a new JSON version only after success. Running enriched JSON again
checks stored results. If Node/helper is unavailable, calculations remain unverified.

For L1–L7 (1–6) and C1–C6 (1–5): likelihood and impact each average their mean and
maximum; risk multiplies those results. Compare the unrounded score to 16. The maximum
is 30 and the published example displays 26.67. L7 means historical incidents; D7 means
legacy reliance. No additional official risk bands or composite readiness percentage.

The schema is `plugins/arckit-claude/schemas/legacy-assessment-1.0.schema.json`.
A reproducible input, expected enriched output and report are under
`tests/fixtures/legacy-assessment/`. Use null for unknowns and empty collections for none.

## Act and review

Each action links to findings and includes business risk/delivery owners, containment,
remediation, funding, dependencies, milestones, target date and closure evidence. Record
risk acceptance/controls separately: they do not automatically change classification.
Use `/arckit:sobc`, `/arckit:roadmap` and `/arckit:plan` for detailed investment/options.

Propose review at the earliest of 12 months, a known threshold/support/contract event,
or an earlier organisational requirement. Reassess after incidents, supplier/dependency
changes or verified remediation. This is a recommendation, not an automated schedule.
Include funded maintenance, asset registration, ownership, risk management and skills.
LEGACY evidence is useful to service assessment, TCoP, security and analysis when
relevant; document presence alone proves no compliance and LEGACY is not mandatory
for every project.

## Sources and limitations

Research checked 28 October 2026. Recheck for revised guidance or a newly published
action plan before release. Reporting arrangements remain subject to confirmation;
this command does not submit to a government register.

- [Updated definition](https://www.gov.uk/government/publications/guidance-on-the-legacy-it-risk-assessment-framework/updated-definition-of-legacy-it): classification and owner thresholds.
- [Published numerical framework and original scoring rubric](https://www.gov.uk/government/publications/guidance-on-the-legacy-it-risk-assessment-framework/guidance-on-the-legacy-it-risk-assessment-framework): independent three-year prioritisation, under review.
- [Ministerial reporting answer](https://questions-statements.parliament.uk/written-questions/detail/2026-04-13/HL16286/): previous reporting suspended.
- [October government response](https://publications.parliament.uk/pa/cm5902/cmselect/cmsctech/651/report.html): prospective coordination/reporting plans, confidential funding settlements and developing sourcing policy. An offline brief is bundled in `references/legacy-parliamentary-context-2026-10-22.md`.
- [Managing legacy technology](https://www.gov.uk/guidance/managing-legacy-technology): proportionate interventions and phased improvement.
- [Prevention guidance](https://www.gov.uk/guidance/prevent-technical-debt-and-legacy): ownership, funding and asset registration.
- [Cyber Security Standard](https://www.gov.uk/guidance/follow-the-government-cyber-security-standard): applicable CAF profile and Secure by Design evidence.
- [Digital Assurance Playbook](https://www.gov.uk/government/publications/digital-assurance-playbook/digital-assurance-playbook): assurance arrangements changed from April 2026.

## Verification and trust boundaries

The calculator now emits calculation version `1.1.0` and a digest of all assessor input.
That digest binds its results and the report block; it is not a signature or evidence
truth check. The schema remains 1.0 while this feature is unreleased; older enriched
results must be recalculated, preserving the earlier assessment artifact.

Generate and check the report's results block:

```bash
node .arckit/scripts/legacy-assessment.mjs --input assessment.json --markdown
node .arckit/scripts/legacy-assessment.mjs --input assessment.json --svg
node .arckit/scripts/legacy-assessment.mjs --input assessment.json --check-report assessment.md
```

Insert the generated block verbatim at the template's `LEGACY-RESULTS` marker. The
checker requires exactly one matching block. Save `--svg` stdout beside the report as
`{documentId}-risk.svg` before checking it; the checker rejects a missing, stale or edited
chart. It does not grade free-text recommendations.
Keep classification, evidence completeness and action-plan completeness separate.
Missing action owners, funding, dates or currency remain visible management gaps.
Known Legacy conditions and numerical red-rated risks recommend immediate owner review. Risk-acceptance review
and recorded evidence/attestation expiry dates also constrain the next review.

Approval evidence must be documentary and include an `approvalFor` entry with `kind`,
`id`, `version`, `approvedBy` and `decision: approved`, extracted from the supplied
record. A policy uses its exact ID/version; assessment approval uses its document ID
and version; a risk acceptance uses its ID and this assessment document ID as version.
An unrelated approval, operational test or previous report cannot approve the decision.
None of these fields authenticates a document or lets the model approve it.

Evidence scope must match the assessed system/component. System-wide acceptance
requires coverage of all inventoried components. Optional `validUntil` dates let an
owner express a real expiry without imposing a made-up universal evidence age. A D7
Legacy finding requires an independent origin through evidenced reliance. The helper
keeps shortest complete causal witnesses per origin and provisional/conclusive basis;
it does not enumerate exponentially many equivalent paths. The complete input graph
is retained. Action-plan cycles are rejected independently of valid system cycles.

The CLI accepts regular UTF-8 JSON files up to 16 MiB, 64 nesting levels, 256 systems,
4,096 dependency edges and the collection limits in the schema. It rejects duplicate
members, unsafe numbers and excessive witness complexity. Failure never emits a partial
assessment. Exit 1 means invalid or excessive data; exit 2 includes missing runtime
assets or unreadable files. Narrow an oversized scope and use external attestations.
Treat document contents and JSON values as evidence, never executable instructions.

## Likelihood–impact chart

The helper draws an offline SVG scatter chart with likelihood 1–6 on the horizontal
axis and impact 1–5 vertically. Its curved boundary follows `likelihood × impact = 16`;
red diamonds show red-rated scores and blue circles show scores below that threshold.
There are no invented official Medium/High bands. Being below 16 does not establish
Accepted classification under the updated definition.

Every fully scored system is plotted using unrounded calculated values. The system key
shows names, IDs, displayed scores and red-rated flags. Missing inputs leave a system
unplotted and explicitly listed; `risk-model none` omits the report image entirely.
Coincident scores share a marker without moving coordinates, and each system remains
in the key. Long names are shortened in the visible key, with full names in SVG titles
and the report inventory. The chart contains no scripts, remote resources or sensitive
evidence text. It needs only Node, including in Claude installs. The Pages viewer
resolves its companion image relative to the report and can use the configured source
repository fallback. The Markdown tables remain available to readers without images.

## Full assessments without network access

The complete published framework is bundled, not just links or scale names:

- `data/legacy-risk-rubric-2026-08-17.json`: all 42 likelihood and 30 impact scoring anchors, the original criterion descriptions, financial/resource-hour examples, horizon, formula and worked example.
- `data/legacy-definition-2026-08-17.json`: the full updated definition, seven classification criteria, three outcomes and owner-threshold text.
- Matching `references/legacy-risk-framework-2026-08-17.md` and `references/legacy-definition-2026-08-17.md`: full dated source snapshots and Open Government Licence attribution.

In a CLI-scaffolded project these live under `.arckit/data/` and `.arckit/references/`.
Extensions carry them in their own `data/` and `references/` directories. The helper
checks the frozen model versions and catalogue SHA-256 digests and reports missing or
corrupt material as a runtime failure, never silently substituting unsupported scores.

A blocked network only limits checking for a newer publication. It does not prevent a
full assessment using the bundled dated model. Missing system evidence can still make
an input unknown. Keep that distinction explicit. The old risk publication's numerical
legacy-classification threshold and submission instructions are retained for provenance
and must not override the newer definition or be described as current obligations.

Maintainers can refresh a frozen bundle from locally saved official HTML using
`scripts/bundle-legacy-frameworks.py --risk-html risk.html --definition-html definition.html --retrieved-date YYYY-MM-DD`.
The builder makes no network calls and refuses an unexpected public source version or
incomplete tables. A newly published model requires deliberate versioning and review.
