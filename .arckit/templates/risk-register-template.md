# Risk Register

> **Template Status**: Live | **Version**: [VERSION] | **Command**: `/arckit.risk`

## Document Control

| Field | Value |
|-------|-------|
| **Document ID** | ARC-[PROJECT_ID]-RISK-v[VERSION] |
| **Document Type** | Risk Register |
| **Project** | [PROJECT_NAME] (Project [PROJECT_ID]) |
| **Classification** | [PUBLIC / OFFICIAL / OFFICIAL-SENSITIVE / SECRET] |
| **Status** | [DRAFT / IN_REVIEW / APPROVED / PUBLISHED / SUPERSEDED / ARCHIVED] |
| **Version** | [VERSION] |
| **Created Date** | [YYYY-MM-DD] |
| **Last Modified** | [YYYY-MM-DD] |
| **Review Cycle** | [Monthly / Quarterly / Annual / On-Demand] |
| **Next Review Date** | [YYYY-MM-DD] |
| **Owner** | [OWNER_NAME_AND_ROLE] |
| **Reviewed By** | [REVIEWER_NAME] ([YYYY-MM-DD]) or PENDING |
| **Approved By** | [APPROVER_NAME] ([YYYY-MM-DD]) or PENDING |
| **Distribution** | [DISTRIBUTION_LIST] |

## Revision History

| Version | Date | Author | Changes | Approved By | Approval Date |
|---------|------|--------|---------|-------------|---------------|
| [VERSION] | [DATE] | ArcKit AI | Initial creation from `/arckit.risk` command | PENDING | PENDING |

---

## Executive Summary

### Risk Profile Overview

**Total Risks Identified:** [X] risks across 6 categories

| Risk Level | Inherent | Residual | Change |
|------------|----------|----------|--------|
| **Critical** (20-25) | X | Y | ↓ Z% |
| **High** (13-19) | X | Y | ↓ Z% |
| **Medium** (6-12) | X | Y | ↓ Z% |
| **Low** (1-5) | X | Y | ↓ Z% |
| **TOTAL** | XXX | YYY | ↓ ZZ% |

### Risk Category Distribution

| Category | Count | Avg Inherent | Avg Residual | Control Effectiveness |
|----------|-------|--------------|--------------|----------------------|
| **STRATEGIC** | X | 12.5 | 8.2 | 34% reduction |
| **OPERATIONAL** | X | 10.3 | 6.5 | 37% reduction |
| **FINANCIAL** | X | 11.8 | 7.1 | 40% reduction |
| **COMPLIANCE** | X | 15.2 | 9.8 | 36% reduction |
| **REPUTATIONAL** | X | 14.5 | 10.2 | 30% reduction |
| **TECHNOLOGY** | X | 13.1 | 8.5 | 35% reduction |

### Overall Risk Assessment

**Overall Residual Risk Score:** [YYY]/500
**Risk Reduction from Controls:** [ZZ]% reduction from inherent risk
**Risk Profile Status:** ✅ Acceptable | ⚠️ Concerning | ❌ Unacceptable

### Risks Exceeding Appetite

**Number of risks exceeding organizational appetite:** [N] risks

| Risk ID | Title | Category | Score | Appetite | Excess | Escalation |
|---------|-------|----------|-------|----------|--------|------------|
| R-001 | ... | STRATEGIC | 20 | 12 | +8 | Board approval required |

### Top 5 Critical Risks Requiring Immediate Attention

1. **R-001** (STRATEGIC, Critical 20): [Title] - Owner: [Name] - Status: [Status]
2. **R-002** (TECHNOLOGY, Critical 25): [Title] - Owner: [Name] - Status: [Status]
3. **R-003** (COMPLIANCE, High 16): [Title] - Owner: [Name] - Status: [Status]
4. **R-004** (FINANCIAL, High 15): [Title] - Owner: [Name] - Status: [Status]
5. **R-005** (REPUTATIONAL, High 15): [Title] - Owner: [Name] - Status: [Status]

### Key Findings and Recommendations

**Key Findings:**
- [Finding 1: e.g., "Heavy concentration of technology risks with single owner (CTO)"]
- [Finding 2: e.g., "3 critical risks have no mitigations in place"]
- [Finding 3: e.g., "Financial risks exceed appetite by average of 40%"]

**Recommendations:**
1. [Recommendation 1: e.g., "Escalate R-001, R-002, R-005 to Steering Committee immediately"]
2. [Recommendation 2: e.g., "Implement automated monitoring for technology risks"]
3. [Recommendation 3: e.g., "Obtain Board approval for risks exceeding financial appetite"]

---

## A. Risk Matrix Visualization

### Inherent Risk Matrix (Before Controls)

**5×5 Likelihood × Impact Matrix**

```
                                    IMPACT
              1-Minimal   2-Minor    3-Moderate   4-Major    5-Severe
           ┌───────────┬───────────┬───────────┬───────────┬───────────┐
5-Almost   │           │           │   R-003   │   R-007   │   R-001   │
Certain    │    5      │    10     │    15     │    20     │    25     │
           ├───────────┼───────────┼───────────┼───────────┼───────────┤
4-Likely   │           │           │   R-005   │   R-009   │   R-004   │
           │    4      │    8      │    12     │    16     │    20     │
L          ├───────────┼───────────┼───────────┼───────────┼───────────┤
I 3-Possible│          │   R-006   │   R-002   │           │           │
K          │    3      │    6      │    9      │    12     │    15     │
E          ├───────────┼───────────┼───────────┼───────────┼───────────┤
L 2-Unlikely│          │   R-008   │   R-010   │           │           │
I          │    2      │    4      │    6      │    8      │    10     │
H          ├───────────┼───────────┼───────────┼───────────┼───────────┤
O 1-Rare   │           │           │           │           │           │
O          │    1      │    2      │    3      │    4      │    5      │
D          └───────────┴───────────┴───────────┴───────────┴───────────┘

Legend: ██ Critical (20-25)  ▓▓ High (13-19)  ░░ Medium (6-12)  ·· Low (1-5)
```

**Risk Zones:**
- **Critical (20-25)**: R-001, R-003, R-004 - Immediate escalation required
- **High (13-19)**: R-005, R-007, R-009 - Senior management attention
- **Medium (6-12)**: R-002, R-006, R-008, R-010 - Management monitoring
- **Low (1-5)**: None currently - Routine monitoring

### Residual Risk Matrix (After Controls)

**5×5 Likelihood × Impact Matrix - After Controls Applied**

```
                                    IMPACT
              1-Minimal   2-Minor    3-Moderate   4-Major    5-Severe
           ┌───────────┬───────────┬───────────┬───────────┬───────────┐
5-Almost   │           │           │           │           │           │
Certain    │    5      │    10     │    15     │    20     │    25     │
           ├───────────┼───────────┼───────────┼───────────┼───────────┤
4-Likely   │           │           │   R-003   │           │           │
           │    4      │    8      │    12     │    16     │    20     │
L          ├───────────┼───────────┼───────────┼───────────┼───────────┤
I 3-Possible│          │   R-001   │   R-002   │   R-005   │           │
K          │    3      │    6      │    9      │    12     │    15     │
E          ├───────────┼───────────┼───────────┼───────────┼───────────┤
L 2-Unlikely│          │   R-006   │   R-007   │   R-009   │           │
I          │    2      │    4      │   R-008   │    8      │    10     │
H          ├───────────┼───────────┼───────────┼───────────┼───────────┤
O 1-Rare   │   R-010   │           │           │   R-004   │           │
O          │    1      │    2      │    3      │    4      │    5      │
D          └───────────┴───────────┴───────────┴───────────┴───────────┘

Legend: ██ Critical (20-25)  ▓▓ High (13-19)  ░░ Medium (6-12)  ·· Low (1-5)
```

**Risk Movement Analysis:**
- **Significant Improvement**: R-001 (25→6), R-004 (20→4) - Controls very effective
- **Moderate Improvement**: R-002 (9→9), R-005 (16→12) - Additional controls needed
- **Limited Improvement**: R-003 (15→12) - Current controls insufficient
- **Monitoring**: R-006, R-008, R-010 - Stable, continue current approach

---

## B. Top 10 Risks (Ranked by Residual Score)

| Rank | ID | Title | Category | Inherent | Residual | Owner | Status | Response |
|------|----|-------|----------|----------|----------|-------|--------|----------|
| 1 | R-001 | [Risk title] | STRATEGIC | 25 | 16 | CEO | In Progress | Treat |
| 2 | R-002 | [Risk title] | TECHNOLOGY | 20 | 12 | CTO | In Progress | Treat |
| 3 | R-003 | [Risk title] | COMPLIANCE | 20 | 16 | CCO | Open | Treat |
| 4 | R-004 | [Risk title] | FINANCIAL | 16 | 9 | CFO | Monitoring | Transfer |
| 5 | R-005 | [Risk title] | REPUTATIONAL | 15 | 12 | CEO | In Progress | Treat |
| 6 | R-006 | [Risk title] | OPERATIONAL | 12 | 6 | COO | Monitoring | Tolerate |
| 7 | R-007 | [Risk title] | TECHNOLOGY | 15 | 8 | CTO | In Progress | Treat |
| 8 | R-008 | [Risk title] | OPERATIONAL | 9 | 4 | COO | Closed | Tolerate |
| 9 | R-009 | [Risk title] | FINANCIAL | 12 | 8 | CFO | In Progress | Treat |
| 10 | R-010 | [Risk title] | STRATEGIC | 6 | 3 | CEO | Monitoring | Tolerate |

---

## C. Detailed Risk Register

### Risk R-001: [Risk Title]

**Category:** STRATEGIC
**Status:** In Progress
**Risk Owner:** [Name, Role] (from Stakeholder RACI: Accountable)
**Action Owner:** [Name, Role]

#### Risk Identification

**Risk Description:**
[Detailed description of the risk - 2-3 sentences explaining what the risk is]

**Root Cause:**
[What underlying issue creates this risk?]

**Trigger Events:**
- [Event 1 that would cause this risk to materialize]
- [Event 2 that would cause this risk to materialize]
- [Event 3 that would cause this risk to materialize]

**Consequences if Realized:**
[What happens if this risk occurs? Tangible impacts:]
- [Impact 1: e.g., "£2M budget overrun"]
- [Impact 2: e.g., "6-month project delay"]
- [Impact 3: e.g., "Loss of stakeholder confidence"]

**Affected Stakeholders:**
- **[Stakeholder 1]** (from ARC-{PROJECT_ID}-STKE-v*.md): [How they are affected]
- **[Stakeholder 2]**: [How they are affected]
- **[Stakeholder 3]**: [How they are affected]

**Related Objectives:**
- [Stakeholder Goal G-001]: [How this risk threatens the goal]
- [Stakeholder Goal G-005]: [How this risk threatens the goal]

#### Inherent Risk Assessment (Before Controls)

| Assessment | Rating | Justification |
|------------|--------|---------------|
| **Likelihood** | 5 - Almost Certain | [Why this is almost certain to happen without controls] |
| **Impact** | 5 - Catastrophic | [Why the impact would be catastrophic] |
| **Inherent Risk Score** | **25** (Critical) | 5 × 5 = 25 |

**Risk Zone:** 🟥 Critical (20-25)

#### Current Controls and Mitigations

**Existing Controls:**
1. **[Control 1]**: [Description of control]
   - Owner: [Name]
   - Effectiveness: Weak | Adequate | **Strong**
   - Evidence: [How we know this control works]

2. **[Control 2]**: [Description of control]
   - Owner: [Name]
   - Effectiveness: Weak | **Adequate** | Strong
   - Evidence: [How we know this control works]

**Overall Control Effectiveness:** Adequate (reduces risk from 25 to 16)

#### Residual Risk Assessment (After Controls)

| Assessment | Rating | Justification |
|------------|--------|---------------|
| **Likelihood** | 4 - Likely | [Why still likely even with controls] |
| **Impact** | 4 - Major | [Why impact is still major] |
| **Residual Risk Score** | **16** (High) | 4 × 4 = 16 |

**Risk Zone:** 🟧 High (13-19)
**Risk Reduction:** 36% reduction from inherent (25 → 16)

#### Risk Response (4Ts Framework)

**Primary Response:** TREAT (Mitigate/Reduce)

**Rationale:**
[Why this response was chosen - e.g., "Risk exceeds appetite but can be mitigated through additional controls at reasonable cost"]

**Alternative Responses Considered:**
- **Tolerate**: Rejected - Risk score too high, exceeds appetite
- **Transfer**: Considered - Would require £X insurance, cost-prohibitive
- **Terminate**: Not viable - Activity essential to strategic objectives

#### Risk Appetite Assessment

**Organizational Risk Appetite for STRATEGIC risks:** Medium (Score ≤ 12)
**Current Residual Risk Score:** 16 (High)
**Assessment:** ❌ **Exceeds Appetite** by 4 points (33% over threshold)

**Justification:**
[Why proceeding despite exceeding appetite - e.g., "Strategic imperative from CEO driver D-001, Board approval obtained 2025-10-15"]

**Escalation Required:** Yes - Board approval required for risks exceeding strategic appetite

#### Action Plan

**Additional Mitigations Needed:**

1. **[Mitigation Action 1]**
   - Description: [Detailed action]
   - Owner: [Name, Role]
   - Due Date: [Date]
   - Cost: £[X]
   - Expected Impact: Reduce likelihood from 4 to 3

2. **[Mitigation Action 2]**
   - Description: [Detailed action]
   - Owner: [Name, Role]
   - Due Date: [Date]
   - Cost: £[X]
   - Expected Impact: Reduce impact from 4 to 3

**Target Residual Risk After Mitigations:**
- Target Likelihood: 3 (Possible)
- Target Impact: 3 (Moderate)
- Target Score: 9 (Medium) ✅ Within appetite (≤ 12)

**Success Criteria:**
- [Criterion 1: How we'll know mitigations are working]
- [Criterion 2: Measurable indicator]

**Monitoring Plan:**
- **Frequency:** Weekly review in Steering Committee
- **Key Indicators:**
  - [KPI 1 to monitor]
  - [KPI 2 to monitor]
- **Escalation Triggers:**
  - Score increases by 3+ points
  - Mitigation actions delayed > 2 weeks

---

### Risk R-002: [Risk Title]

**Category:** TECHNOLOGY
**Status:** Open
**Risk Owner:** [Name, Role]
**Action Owner:** [Name, Role]

[Repeat full structure as above for each risk]

---

## D. Risk Category Analysis

### STRATEGIC Risks

**Total STRATEGIC Risks:** [X]
**Average Inherent Score:** 14.2 (High)
**Average Residual Score:** 9.8 (Medium)
**Control Effectiveness:** 31% reduction

**Risk List:**
- R-001: [Title] - Residual: 16 (High)
- R-005: [Title] - Residual: 12 (Medium)
- R-010: [Title] - Residual: 3 (Low)

**Key Themes:**
- [Theme 1: e.g., "Strategic direction uncertainty from policy changes"]
- [Theme 2: e.g., "Stakeholder alignment challenges"]

**Category Risk Profile:** ⚠️ Concerning - 2 risks exceed appetite, additional controls needed

---

### OPERATIONAL Risks

**Total OPERATIONAL Risks:** [X]
**Average Inherent Score:** 10.5 (Medium)
**Average Residual Score:** 6.2 (Medium)
**Control Effectiveness:** 41% reduction

**Risk List:**
- R-006: [Title] - Residual: 6 (Medium)
- R-008: [Title] - Residual: 4 (Low)

**Key Themes:**
- [Theme 1: e.g., "Resource availability and skills gaps"]
- [Theme 2: e.g., "Process maturity issues"]

**Category Risk Profile:** ✅ Acceptable - All risks within appetite, good control effectiveness

---

### FINANCIAL Risks

**Total FINANCIAL Risks:** [X]
**Average Inherent Score:** 12.0 (Medium)
**Average Residual Score:** 8.5 (Medium)
**Control Effectiveness:** 29% reduction

**Risk List:**
- R-004: [Title] - Residual: 9 (Medium)
- R-009: [Title] - Residual: 8 (Medium)

**Key Themes:**
- [Theme 1: e.g., "Cost estimation uncertainty"]
- [Theme 2: e.g., "Funding dependency on external approval"]

**Category Risk Profile:** ✅ Acceptable - Risks within appetite, monitoring required

---

### COMPLIANCE/REGULATORY Risks

**Total COMPLIANCE Risks:** [X]
**Average Inherent Score:** 16.0 (High)
**Average Residual Score:** 11.3 (Medium)
**Control Effectiveness:** 29% reduction

**Risk List:**
- R-003: [Title] - Residual: 16 (High)

**Key Themes:**
- [Theme 1: e.g., "GDPR/DPA 2018 compliance complexity"]
- [Theme 2: e.g., "Regulatory change during project"]

**Category Risk Profile:** ⚠️ Concerning - Compliance risks harder to mitigate, legal review needed

---

### REPUTATIONAL Risks

**Total REPUTATIONAL Risks:** [X]
**Average Inherent Score:** 13.5 (High)
**Average Residual Score:** 10.0 (Medium)
**Control Effectiveness:** 26% reduction

**Risk List:**
- R-005: [Title] - Residual: 12 (Medium)

**Key Themes:**
- [Theme 1: e.g., "Public/media scrutiny of government IT projects"]
- [Theme 2: e.g., "Service failure visibility"]

**Category Risk Profile:** ⚠️ Concerning - Reputational risks difficult to recover from, prevention critical

---

### TECHNOLOGY Risks

**Total TECHNOLOGY Risks:** [X]
**Average Inherent Score:** 15.0 (High)
**Average Residual Score:** 9.3 (Medium)
**Control Effectiveness:** 38% reduction

**Risk List:**
- R-002: [Title] - Residual: 12 (Medium)
- R-007: [Title] - Residual: 8 (Medium)

**Key Themes:**
- [Theme 1: e.g., "Legacy system integration challenges"]
- [Theme 2: e.g., "Technology maturity and scaling"]

**Category Risk Profile:** ✅ Acceptable - Good control effectiveness, CTO actively managing

---

## E. Risk Ownership Matrix

**Risk Ownership Distribution by Stakeholder:**

| Stakeholder | Role | Owned Risks | Critical | High | Medium | Low | Total Score | Risk Concentration |
|-------------|------|-------------|----------|------|--------|-----|-------------|-------------------|
| CEO | Strategic Lead | R-001, R-005, R-010 | 0 | 2 | 1 | 0 | 31 | ⚠️ High concentration |
| CTO | Technology Lead | R-002, R-007 | 0 | 1 | 1 | 0 | 20 | Moderate |
| CFO | Financial Lead | R-004, R-009 | 0 | 0 | 2 | 0 | 17 | Moderate |
| CCO | Compliance Lead | R-003 | 0 | 1 | 0 | 0 | 16 | Focused |
| COO | Operations Lead | R-006, R-008 | 0 | 0 | 1 | 1 | 10 | Low |

**Risk Concentration Analysis:**
- ⚠️ **CEO owns 3 risks totaling 31 points** - Consider delegating some risks
- **CTO concentration on technology risks** - Expected and appropriate
- **Good distribution across financial and operational risks**

**Escalation Paths:**
- **Critical/High Strategic Risks** → CEO → Board
- **Critical/High Technology Risks** → CTO → Steering Committee
- **All Compliance Risks** → CCO → Audit Committee

---

## F. 4Ts Response Framework Summary

**Risk Response Distribution:**

| Response | Count | % | Total Risk Score | Key Examples |
|----------|-------|---|------------------|--------------|
| **TOLERATE** | 2 | 20% | 7 (Low) | R-008, R-010 - Low risks within appetite |
| **TREAT** | 6 | 60% | 68 (High) | R-001, R-002, R-003, R-005, R-007, R-009 - Active mitigation |
| **TRANSFER** | 1 | 10% | 9 (Medium) | R-004 - Cyber insurance obtained |
| **TERMINATE** | 1 | 10% | 6 (Medium) | R-006 - High-risk vendor option cancelled |
| **TOTAL** | 10 | 100% | 90 | |

**Response Breakdown by Category:**

| Category | Tolerate | Treat | Transfer | Terminate | Predominant Response |
|----------|----------|-------|----------|-----------|---------------------|
| STRATEGIC | 1 | 2 | 0 | 0 | Treat (67%) |
| OPERATIONAL | 1 | 0 | 0 | 1 | Mixed |
| FINANCIAL | 0 | 1 | 1 | 0 | Mixed |
| COMPLIANCE | 0 | 1 | 0 | 0 | Treat (100%) |
| REPUTATIONAL | 0 | 1 | 0 | 0 | Treat (100%) |
| TECHNOLOGY | 0 | 2 | 0 | 0 | Treat (100%) |

**Key Insights:**
- **60% of risks require active treatment** - Significant mitigation effort needed
- **Only 20% can be tolerated** - Indicates challenging risk environment
- **Limited transfer opportunities** - Most risks internal to project
- **1 termination** - Demonstrates willingness to stop risky activities

---

## G. Risk Appetite Compliance

**Organizational Risk Appetite Thresholds:**

| Category | Appetite Level | Threshold Score | Description |
|----------|---------------|-----------------|-------------|
| STRATEGIC | Medium | ≤ 12 | Willing to accept medium strategic risks for growth |
| OPERATIONAL | Low | ≤ 6 | Low tolerance for operational disruption |
| FINANCIAL | Medium | ≤ 9 | Moderate financial risk for appropriate return |
| COMPLIANCE | Very Low | ≤ 4 | Minimal tolerance for compliance breaches |
| REPUTATIONAL | Low | ≤ 6 | Low tolerance for reputational damage |
| TECHNOLOGY | Medium | ≤ 12 | Willing to adopt new technology with controls |

**Compliance Summary:**

| Category | Appetite | Risks Within | Risks Exceeding | Avg Excess | Action Required |
|----------|----------|--------------|-----------------|------------|-----------------|
| STRATEGIC | ≤ 12 | 1 (33%) | 2 (67%) | +5.5 points | ⚠️ Board approval required |
| OPERATIONAL | ≤ 6 | 2 (100%) | 0 (0%) | N/A | ✅ Compliant |
| FINANCIAL | ≤ 9 | 2 (100%) | 0 (0%) | N/A | ✅ Compliant |
| COMPLIANCE | ≤ 4 | 0 (0%) | 1 (100%) | +12 points | ❌ Urgent action required |
| REPUTATIONAL | ≤ 6 | 0 (0%) | 1 (100%) | +6 points | ⚠️ CEO approval required |
| TECHNOLOGY | ≤ 12 | 2 (100%) | 0 (0%) | N/A | ✅ Compliant |

**Overall Appetite Compliance:** ⚠️ 60% of risk categories exceed appetite

**Risks Significantly Exceeding Appetite (>50% over threshold):**

| Risk ID | Category | Appetite | Actual | Excess | % Over | Escalation |
|---------|----------|----------|--------|--------|--------|------------|
| R-003 | COMPLIANCE | 4 | 16 | +12 | 300% | ❌ Audit Committee escalation required |
| R-005 | REPUTATIONAL | 6 | 12 | +6 | 100% | ⚠️ CEO approval obtained 2025-10-15 |
| R-001 | STRATEGIC | 12 | 16 | +4 | 33% | ⚠️ Board approval pending |

**Recommendations:**
1. **URGENT**: Escalate R-003 (COMPLIANCE) to Audit Committee - 300% over appetite
2. **HIGH PRIORITY**: Obtain Board approval for R-001 (STRATEGIC) - pending approval
3. **MONITOR**: R-005 (REPUTATIONAL) - CEO approval obtained, monitor closely

---

## H. Prioritized Action Plan

**Priority Actions for Risk Mitigation:**

### Priority 1: URGENT (Critical Risks or Significant Appetite Exceedance)

| Priority | Action | Risk(s) Addressed | Owner | Due Date | Cost | Expected Impact | Status |
|----------|--------|-------------------|-------|----------|------|-----------------|--------|
| 1 | [Action 1] | R-003 (COMPLIANCE) | CCO | 2025-11-01 | £50K | Reduce from 16 to 8 | Not Started |
| 2 | [Action 2] | R-001 (STRATEGIC) | CEO | 2025-11-15 | £20K | Reduce from 16 to 9 | In Progress |

**Total Urgent Actions:** 2
**Total Cost:** £70K
**Expected Risk Reduction:** 15 points total

### Priority 2: HIGH (High Risks Within Appetite)

| Priority | Action | Risk(s) Addressed | Owner | Due Date | Cost | Expected Impact | Status |
|----------|--------|-------------------|-------|----------|------|-----------------|--------|
| 3 | [Action 3] | R-002 (TECHNOLOGY) | CTO | 2025-12-01 | £30K | Reduce from 12 to 6 | Not Started |
| 4 | [Action 4] | R-005 (REPUTATIONAL) | CEO | 2025-12-15 | £15K | Reduce from 12 to 8 | Planning |

**Total High Priority Actions:** 2
**Total Cost:** £45K
**Expected Risk Reduction:** 10 points total

### Priority 3: MEDIUM (Medium Risks Requiring Treatment)

| Priority | Action | Risk(s) Addressed | Owner | Due Date | Cost | Expected Impact | Status |
|----------|--------|-------------------|-------|----------|------|-----------------|--------|
| 5 | [Action 5] | R-007 (TECHNOLOGY) | CTO | 2026-01-15 | £10K | Reduce from 8 to 4 | Not Started |
| 6 | [Action 6] | R-009 (FINANCIAL) | CFO | 2026-02-01 | £5K | Reduce from 8 to 6 | Not Started |

**Total Medium Priority Actions:** 2
**Total Cost:** £15K
**Expected Risk Reduction:** 6 points total

**Overall Action Plan Summary:**
- **Total Actions:** 6
- **Total Investment:** £130K
- **Expected Risk Reduction:** 31 points (34% reduction)
- **Target Completion:** 2026-02-01

---

## I. Integration with SOBC

**How this Risk Register feeds into Strategic Outline Business Case (SOBC):**

### SOBC Strategic Case (Part A)
- **"Why Now?" section** uses strategic risks to demonstrate urgency
- **R-001** (STRATEGIC, 16): Demonstrates need for immediate action to address [strategic driver]

### SOBC Economic Case (Part B)
- **Risk-adjusted costs** use financial risks + HM Treasury optimism bias
- **R-004** (FINANCIAL, 9): £2M budget risk → Add 15% contingency (£300K)
- **R-009** (FINANCIAL, 8): Cost escalation risk → Add 10% contingency (£200K)
- **Total risk contingency:** £500K added to Economic Case costs

### SOBC Management Case (Part E - Risk Management)
- **Full risk register** included in Management Case Part E
- **Top 10 risks** highlighted with mitigation plans
- **Risk ownership matrix** demonstrates clear accountability
- **Monitoring framework** shows ongoing risk management capability

### SOBC Recommendation
- **High-risk profile** (60% exceeding appetite) may influence:
  - Option selection (prefer lower-risk options)
  - Phasing strategy (de-risk early phases first)
  - Go/no-go decision (if risk profile unacceptable)

---

## J. Monitoring and Review Framework

### Review Schedule

| Risk Level | Review Frequency | Reviewed By | Escalated To | Report Format |
|------------|------------------|-------------|--------------|---------------|
| **Critical (20-25)** | Weekly | Risk Owner + PMO | Steering Committee | Dashboard + narrative |
| **High (13-19)** | Bi-weekly | Risk Owner | Project Board | Dashboard |
| **Medium (6-12)** | Monthly | Risk Owner | Project Manager | Exception report |
| **Low (1-5)** | Quarterly | Action Owner | Risk Owner | Status update |

### Key Risk Indicators (KRIs)

**Leading Indicators** (predict future risk changes):
- [KRI 1: e.g., "Team turnover rate > 10% → increases operational risk"]
- [KRI 2: e.g., "Vendor SLA breaches → increases technology risk"]
- [KRI 3: e.g., "Budget variance > 5% → increases financial risk"]

**Lagging Indicators** (confirm risk materialization):
- [KRI 4: e.g., "Defect rate > 5 per release → technology risk realized"]
- [KRI 5: e.g., "Schedule delay > 2 weeks → operational risk realized"]

### Escalation Criteria

**Automatic Escalation Triggers:**
1. Any risk increases by 5+ points
2. Any new Critical risk (score 20-25) identified
3. Any risk exceeds appetite and no mitigation plan
4. Any mitigation action delayed > 1 month
5. 3+ risks in same category exceed appetite

### Reporting Requirements

**Weekly** (Critical Risks Only):
- Dashboard to Steering Committee
- Narrative update on top 3 critical risks
- Action plan progress

**Monthly** (All Risks):
- Full risk register to Project Board
- Risk matrix visualization
- Risk appetite compliance summary
- Action plan status

**Quarterly** (Strategic Review):
- Risk register to Audit Committee (if applicable)
- Risk trend analysis (improving/deteriorating)
- Risk appetite threshold review
- Lessons learned and process improvements

### Risk Register Maintenance

**Risk Register Owner:** [Name, Role]

**Responsibilities:**
- Maintain accuracy of risk register
- Coordinate risk reviews with risk owners
- Update risk scores based on evidence
- Track mitigation action completion
- Escalate risks per criteria
- Produce risk reports

**Update Process:**
1. Risk owners submit updates weekly (critical/high) or monthly (medium/low)
2. Risk register owner validates and updates register
3. PMO reviews for consistency and completeness
4. Steering Committee approves material changes

**Version Control:**
- Version increments with each update
- Change log maintained in Document Control section
- Previous versions archived for audit trail

---

## K. Orange Book Compliance Checklist

This risk register demonstrates compliance with HM Treasury Orange Book (2023):

### Part I - Risk Management Principles

- ✅ **A. Governance and Leadership**
  - Risk owners assigned from senior stakeholders (from RACI matrix)
  - Escalation paths defined to Board/Audit Committee
  - Risk appetite set and monitored

- ✅ **B. Integration**
  - Risks linked to strategic objectives (stakeholder goals)
  - Risks inform business case (SOBC Management Case)
  - Risk management embedded in project governance

- ✅ **C. Collaboration and Best Information**
  - Risks sourced from stakeholder concerns and expert judgment
  - Multiple perspectives considered (stakeholder analysis)
  - Evidence-based assessment (likelihood and impact justified)

- ✅ **D. Risk Management Processes**
  - Systematic identification across 6 categories
  - Consistent assessment methodology (5×5 matrix)
  - 4Ts response framework applied
  - Inherent and residual risk tracked

- ✅ **E. Continual Improvement**
  - Regular review schedule (weekly/monthly/quarterly)
  - Key Risk Indicators defined
  - Lessons learned process
  - Risk register version control

### Part II - Risk Control Framework

- ✅ **4-Pillar "House" Structure**
  - Risk appetite and tolerance defined
  - Risk ownership and governance established
  - Risk assessment methodology documented
  - Control effectiveness measured (inherent vs residual)

---

## Appendix A: Risk Assessment Scales

### Likelihood Scale (1-5)

| Score | Rating | Probability | Description |
|-------|--------|-------------|-------------|
| 1 | Rare | < 5% | Highly unlikely, exceptional circumstances only |
| 2 | Unlikely | 5-25% | Could happen but probably won't, low probability |
| 3 | Possible | 25-50% | Reasonable chance, has happened before |
| 4 | Likely | 50-75% | More likely to happen than not, expected |
| 5 | Almost Certain | > 75% | Expected to occur, highly probable |

### Impact Scale (1-5)

| Score | Rating | Financial Impact | Schedule Impact | Stakeholder Impact | Description |
|-------|--------|------------------|-----------------|-------------------|-------------|
| 1 | Negligible | < £50K | < 1 week | Minimal concern | Easily absorbed, routine management |
| 2 | Minor | £50K-£200K | 1-4 weeks | Minor concern | Manageable within contingency |
| 3 | Moderate | £200K-£500K | 1-2 months | Significant concern | Requires management effort and approval |
| 4 | Major | £500K-£2M | 2-6 months | Severe concern | Threatens key objectives, difficult recovery |
| 5 | Catastrophic | > £2M | > 6 months | Existential threat | Project failure, major stakeholder impact |

### Risk Score Matrix (Likelihood × Impact)

| Score Range | Risk Level | Color | Action Required |
|-------------|------------|-------|-----------------|
| 20-25 | Critical | 🟥 Red | Immediate escalation, senior management action |
| 13-19 | High | 🟧 Orange | Management attention, mitigation plan required |
| 6-12 | Medium | 🟨 Yellow | Management monitoring, consider mitigation |
| 1-5 | Low | 🟩 Green | Routine monitoring, accept or apply low-cost controls |

---

## Appendix B: Stakeholder-Risk Linkage

**Traceability from Stakeholders to Risks:**

| Stakeholder | Driver (from ARC-{PROJECT_ID}-STKE-v*.md) | Risk ID | Risk Title | Category | Score |
|-------------|-------------------------------------|---------|------------|----------|-------|
| CFO | D-001: Reduce costs (FINANCIAL, HIGH) | R-004 | Cloud costs exceed budget 40% | FINANCIAL | 9 |
| CFO | D-001: Reduce costs | R-009 | ROI not achieved due to low adoption | FINANCIAL | 8 |
| CTO | D-002: Modernize architecture (STRATEGIC, HIGH) | R-001 | Strategic direction changes mid-project | STRATEGIC | 16 |
| CTO | D-002: Modernize architecture | R-002 | Legacy integration fails at scale | TECHNOLOGY | 12 |
| CCO | D-003: Ensure compliance (COMPLIANCE, CRITICAL) | R-003 | GDPR non-compliance in data transfer | COMPLIANCE | 16 |
| Operations | D-004: Minimize downtime (OPERATIONAL, HIGH) | R-006 | Service outage during cutover | OPERATIONAL | 6 |
| CEO | D-005: Protect reputation (REPUTATIONAL, HIGH) | R-005 | Public service failure damages trust | REPUTATIONAL | 12 |

**Stakeholder Concerns Mapped to Risks:**

| Stakeholder Conflict (from ARC-{PROJECT_ID}-STKE-v*.md) | Risk(s) Created | Mitigation |
|---------------------------------------------------|-----------------|------------|
| CFO vs CTO: Cost reduction vs innovation | R-004, R-009 | Phased approach, prove ROI early |
| Operations vs CTO: Stability vs modernization | R-002, R-006 | Blue-green deployment, rollback plan |
| Compliance vs Speed: Rigor vs agility | R-003 | Early legal review, compliance gates |

---

## Document Approval

| Role | Name | Signature | Date |
|------|------|-----------|------|
| **Risk Register Owner** | [Name] | | |
| **Project Manager** | [Name] | | |
| **Senior Responsible Owner** | [Name] | | |
| **Steering Committee Chair** | [Name] | | |

---

## Next Steps

1. **Immediate Actions** (This Week):
   - [ ] Escalate R-003 (COMPLIANCE, Critical) to Audit Committee
   - [ ] Obtain Board approval for R-001 (STRATEGIC exceeds appetite)
   - [ ] Schedule risk review meetings with all risk owners
   - [ ] Initiate priority 1 mitigations (R-001, R-003)

2. **Short-term Actions** (This Month):
   - [ ] Integrate risk register into SOBC Management Case Part E
   - [ ] Set up weekly risk dashboard for Steering Committee
   - [ ] Implement Key Risk Indicators (KRIs) monitoring
   - [ ] Complete all priority 1 and 2 mitigation actions

3. **Medium-term Actions** (This Quarter):
   - [ ] Quarterly risk appetite compliance review
   - [ ] Lessons learned from risk materialization (if any)
   - [ ] Risk register process improvement review
   - [ ] Train new risk owners on Orange Book methodology

---

**END OF RISK REGISTER**

---

*This risk register follows HM Treasury Orange Book (2023) principles and integrates with ArcKit's stakeholder-driven architecture governance framework.*

*For questions or updates, contact: [Risk Register Owner Name and Email]*

## External References

| Document | Type | Source | Key Extractions | Path |
|----------|------|--------|-----------------|------|
| *None provided* | — | — | — | — |

---

**Generated by**: ArcKit `/arckit.risk` command
**Generated on**: [DATE]
**ArcKit Version**: [VERSION]
**Project**: [PROJECT_NAME]
**Model**: [AI_MODEL]

