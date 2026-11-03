# Legacy IT framework reference catalogue

Research checked: **28 October 2026**. Catalogue: `data/legacy-frameworks-1.0.json`.

Classification uses `uk-definition-2026-08-17`; optional numerical prioritisation uses
`published-2026-08-17`. The latter remains under review. Its earlier classification
rule does not determine the updated definition's outcomes. No complete public threshold
catalogue was identified: proposed local rules are ArcKit suggestions requiring owner review.
Recheck the linked sources for a revised framework or action plan before release and
when assessing current policy. Record unavailable verification as a limitation.

| Source | Source date | Assessment use |
|--------|-------------|----------------|
| [Updated Definition of Legacy IT](https://www.gov.uk/government/publications/guidance-on-the-legacy-it-risk-assessment-framework/updated-definition-of-legacy-it) | 2026-08-17 | Classification; owner thresholds must be evidenced. |
| [Published numerical framework](https://www.gov.uk/government/publications/guidance-on-the-legacy-it-risk-assessment-framework/guidance-on-the-legacy-it-risk-assessment-framework) | 2026-08-17 | Under review; separate three-year prioritisation model, not revised classification. |
| [Ministerial answer HL16286](https://questions-statements.parliament.uk/written-questions/detail/2026-04-13/HL16286/) | 2026-04-27 | Reporting suspended in 2025; old register instructions are not current obligations. |
| [Government response on digital government](https://publications.parliament.uk/pa/cm5902/cmselect/cmsctech/651/report.html) | 2026-10-22 | Data collection expected to resume; action plan expected later this year. Confirm arrangements. |
| [Managing legacy technology](https://www.gov.uk/guidance/managing-legacy-technology) | 2026-10-15 | Proportionate phased intervention selected in context. |
| [Prevent technical debt and legacy](https://www.gov.uk/guidance/prevent-technical-debt-and-legacy) | 2024-10-23 | Ownership, funding, risk management and asset registration; check current assurance process. |
| [Government Cyber Security Standard](https://www.gov.uk/guidance/follow-the-government-cyber-security-standard) | 2025-02-07 | Assess applicable CAF profile and Secure by Design evidence. |
| [Digital Assurance Playbook](https://www.gov.uk/government/publications/digital-assurance-playbook/digital-assurance-playbook) | 2026-04-01 | Assurance changed April 2026; check organisational arrangements. |

## Parliamentary policy context

Read `legacy-parliamentary-context-2026-10-22.md` for recommendations 13, 14 and 21.
It separates prospective coordination/reporting commitments, confidential ringfencing
and developing sourcing policy from completed outcomes and project-specific evidence.
It supplies context rather than assessment thresholds or funding approval.

## Local threshold prompts

These prompts are **not government-mandated thresholds**. For each rule record source,
owner, version, approval evidence, effective date, scope, unacceptable condition and
warning condition. Describe decisions in prose, not executable policy code.

| Criterion | Evidence to define the local rule |
|-----------|-----------------------------------|
| D1 Support | Exact version, provider or community arrangement, fixes, scope and expiry; extended support must demonstrably cover needed patches. |
| D2 Contracts | Operating rights, licence and support duties, continuity and procurement lead time; a contract alone proves no patch availability. |
| D3 Skills | Tested operation, restoration, patching and change capability; key-person coverage and knowledge transfer. |
| D4 Business needs | Measured failures against agreed user, statutory, performance and business requirements. |
| D5 Hardware | Capacity, failures, repairability, spares and recovery; record hosted responsibilities for SaaS/cloud. |
| D6 Cyber security | Applicable CAF profile and Secure by Design evidence, exploitability and verified controls; counts alone are insufficient. |
| D7 Dependencies | Directed reliance, dependency assessment date, classification and consequences under the local rule; a connection alone is insufficient. |

D7 is not the numerical model's L7 (historical incidents). Age, cloud hosting,
open-source licensing and recent introduction alone decide neither outcome nor score.

## Numerical assessment

Read `data/legacy-risk-rubric-2026-08-17.json`: it contains all 42 likelihood and
30 impact anchors, criterion descriptions, the three-year horizon, formula and worked
example. `data/legacy-definition-2026-08-17.json` contains the full current definition,
seven criteria, three outcomes and threshold text. Both are integrity-pinned in the
catalogue and bundled across every target and CLI install. No network is needed.

`legacy-risk-framework-2026-08-17.md` and `legacy-definition-2026-08-17.md` retain the
full dated source publications with Open Government Licence attribution. The risk
snapshot's older classification threshold and submission text are historical; follow
this catalogue's model distinction instead. Do not repair gaps in the source's
financial or operational examples or mistake them for new-definition thresholds.

The primary URLs support optional source refresh. A blocked URL is a source-freshness
limitation, not missing rubric material. Continue the full published-model assessment
with bundled tables and supplied system evidence. Leave a score unknown only when the
system evidence is missing or insufficient, not because an online table is inaccessible.
The calculator uses exact integer fractions for the red comparison and displays two
decimal places. The published worked example is 26.67. It validates arithmetic,
structure and references, not evidence truth or assessor judgement.
