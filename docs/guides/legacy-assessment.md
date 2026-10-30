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
the headline chart. Inventoried components also produce `ARC-001-LEGACY-v1.0-components.svg`;
keep all generated files together when sharing the report.
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

The calculator now emits calculation version `1.2.0` and a digest of all assessor input.
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
solid outlined boxes show complete scores or a remaining one-axis range. The threshold curve and system
key distinguish red-rated results; hollow circles are reserved for suspected positions.
There are no invented official Medium/High bands. Being below 16 does not establish
Accepted classification under the updated definition.

Every fully scored system is plotted using unrounded calculated values. The system key
shows names, IDs, displayed scores and red-rated flags. Missing inputs draw a dotted indigo bounding envelope (or a range bar if one axis
is fixed), labelled with ? and the missing criteria. With no inputs, it spans the whole
domain. These are mathematical bounds, not estimates, confidence intervals or completed
scores; not every interior position is necessarily attainable. No midpoint or zero is
substituted; `risk-model none` omits the report image entirely.
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

## Clearer draft assessments

This is an unreleased format: regenerate stale draft results and obtain fresh approval;
there is no historical verifier or migration layer. Repository regression fixtures live
under `tests/fixtures/legacy-assessment/`; that test directory is not part of plugin installs.

- `--lint --format text|json` collects independent errors and evidence warnings, with codes, paths, IDs and corrective guidance. Parsing/resource failures stop immediately; dependent graph checks require valid prerequisites.
- `--explain ID` prints a system, finding, dependency or action with evidence-use diagnostics.
- `--approval-digest assessment|policy:ID|risk-acceptance:ID` prints the exact canonical content digest for an owner to approve. Printing it is not approval.

Approval targets need documentary `approvedOn` and `approvedDigest` values before they
verify. Missing binding remains pending; changed content is stale. Policy binding covers
the policy content and applicability, independently of report version. Assessment binding
covers assessor input excluding approval envelopes and approval-only records; risk acceptance
binds its content and assessment document ID. These hashes establish consistency, not authority
or signatures. Later assessment sign-off does not move the operational evidence cutoff.

`strongestKnown` and `blockers` explain each criterion without promoting Unknown to
Accepted. Numerical `bounds` show exact possible extrema, not a completed score.
`thresholdAssessment` describes whether all, none or some possible completions reach 16;
`redRated` remains null until every input is supported. A single missing input may have
a `tipping` value; this is sensitivity, not an official finding.

Evidence qualification is recorded per use, with reasons for rejection. An evidence
record can qualify for one subject/date/purpose and fail another. The generated block
contains inventory, policy, dependency, finding, evidence and action registers; report
verification checks those sections as well as the chart. It does not verify evidence truth
or assessor recommendations. Detailed evidence is in a collapsible appendix.

An action can address an explicit Unknown finding or use `addresses` for missing coverage,
a dependency or a risk input. Every entry includes `systemId`, plus `criterionId` for
coverage/risk input or `id` for dependency. An action addresses a planning gap without
resolving the evidence gap. Dated events retain source IDs; delivery targets and milestones
are separate from review triggers. Resume from saved draft input when external evidence
is outstanding. Use independently invented synthetic cases for feedback; no automatic
anonymisation or safe-sharing guarantee is provided.

### Chart legend and assessor judgement

- **Dotted outline:** plausible range, with confidence calculated from the numerical bounds. This is range precision, not a statistical confidence interval.
- **Solid box:** scored inputs giving a complete score or a remaining one-axis range; a range remains incomplete.
- **Hollow circle:** where the assessor suspects an incomplete system sits, only when that judgement is supplied.

Optional `riskInputs[].chartAnnotation` holds `suspectedPosition` (null or an object
with aggregate likelihood/impact factors) and a non-empty `rationale`. Both are required
if present. The position must lie within the calculated bounds and is explicitly labelled
as supplied judgement, not a completed score. There is no manually chosen confidence label.
Headline range precision is 100 × (1 − max(likelihood width/5, impact width/4)); high starts
at 80%, medium at 50%, otherwise low. This measures the numerical interval’s narrowness,
not probability, evidence reliability or official risk status. Classification, numerical
completeness and ranking stay unchanged by the supplied suspected position.

## Headline and component formats

`--svg` and its alias `--headline-svg` produce the headline likelihood–impact plot.
It focuses the lower axes where appropriate, labels their starts, and always includes
all calculated bounds. A solid score marker, dotted range and supplied suspected
position remain separate. Axis scaling does not change any score.

`--components-svg` produces a horizontal component breakdown across Accepted,
Action-Required and Legacy, with confidence-weighted bars, diamond markers and notes.
Save it beside the report as `{documentId}-components.svg`; the generated report embeds
it and `--check-report` verifies it. It is generated whenever components are inventoried,
including when numerical scoring is omitted. Empty inventory is reported explicitly.

Component outcomes come from component-scoped findings, not inherited system outcomes.
Seven-criterion coverage gaps remain Undetermined unless an established component Legacy
finding determines the outcome. `componentResults` records the underlying findings and
uncertainty independently of system classification and numerical risk.

Component positions and bars are calculated from numerical `measurements`, not chosen
from category labels. Each component can have one record for each D1–D7 criterion:
`lower`, `estimate` (or null), `upper`, `calibration`, `basis` (measured/estimated),
`evidenceIds` and `rationale`. Calibration declares `unit`, `baseline`, `actionRequired`,
`legacy` and `direction` (higher-is-worse/lower-is-worse). Sources and local anchors must
be documented; these are not government-mandated numerical thresholds. Measured inputs
need applicable dated evidence. Estimated quantities remain visibly estimated.

The local ArcKit method `arckit-component-index-1` normalizes each raw value piecewise
linearly through 0 at baseline, 1 at action-required and 2 at legacy, clipping to 0–3.
The warning-to-legacy step continues above 2. Lower-is-worse scales reverse direction.
The component point is the maximum of the criterion central indices. Lower and upper
bounds are the independent maxima of the criterion bounds, not a symmetric radius around
the point. Thus a point can sit low in Action-Required while its interval reaches Legacy.
Missing criteria contribute [0,3] and suppress the point; null central estimates also
suppress it. No categorical centre or midpoint is substituted.

Confidence is **range precision**, calculated as `100 × (1 − interval width / 3)`:
high at 80% or above, medium at 50% or above, otherwise low. This explicit local display
convention measures the stated interval’s narrowness, not statistical confidence,
source accuracy, readiness or government compliance. All raw values and calibration
anchors are preserved in the verified report. Recorded findings and approvals do not
change when plotting inputs change. Confidence bars are plain with rounded ends and no
end caps; exact narrow/zero-width bounds remain in labels and are never widened for appearance.

When only one numerical factor varies, the headline uses a rounded range box with
a dotted callout and labels the fixed factor explicitly. Its decorative width does
not imply uncertainty in the fixed factor. A supplied circle may sit within that
range without completing the numerical assessment.
