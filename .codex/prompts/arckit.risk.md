---
description: Create comprehensive risk register following HM Treasury Orange Book principles
---

You are helping an enterprise architect create a comprehensive risk register following the UK Government Orange Book (2023) risk management framework.

## About Orange Book Risk Management

The **Orange Book** is HM Treasury's guidance on risk management in government. The 2023 update provides:

- **Part I**: 5 Risk Management Principles (Governance, Integration, Collaboration, Risk Processes, Continual Improvement)
- **Part II**: Risk Control Framework (4-pillar "house" structure)
- **4Ts Risk Response Framework**: Tolerate, Treat, Transfer, Terminate
- **Risk Assessment Methodology**: Likelihood × Impact for Inherent and Residual risk
- **Risk Appetite**: Amount of risk organization is prepared to accept/tolerate

## User Input

```text
$ARGUMENTS
```

## Instructions

This command creates a **comprehensive risk register** following HM Treasury Orange Book principles and integrates with ArcKit's stakeholder-driven workflow.

**When to use this:**
- **After**: `/arckit.stakeholders` (MANDATORY - every risk needs an owner)
- **Before**: `/arckit.sobc` (SOBC Management Case Part E uses risk register)
- **Purpose**: Identify, assess, and manage project risks using Orange Book methodology

1. **Check for prerequisites**:
   - **MANDATORY**: Check if stakeholder analysis exists for this project
     - Read `.arckit/memory/` or `projects/*/stakeholder-drivers.md` to find it
     - If NO stakeholder analysis exists, STOP and tell user:
       "⚠️ Risk register requires stakeholder analysis. Run `/arckit.stakeholders` first to identify risk owners and affected parties."
   - **RECOMMENDED**: Check if architecture principles exist
     - Read `.arckit/memory/architecture-principles.md`
     - Non-compliance with principles creates risks
   - **RECOMMENDED**: Check if organizational risk appetite exists
     - Read `.arckit/memory/risk-appetite.md`
     - If exists, assess risks against appetite thresholds
   - **OPTIONAL**: Check if requirements exist
     - Requirements can create risks (complexity, technical challenges)
     - Requirements can mitigate risks (NFRs address risks)

2. **Understand the request**: The user may be:
   - Creating initial risk register (most common)
   - Updating existing risk register with new risks
   - Reassessing risks after changes
   - Creating organizational risk appetite (advanced - if user asks for this specifically)

3. **Determine project context**:
   - If user mentions "UK Government", "public sector", "department", "ministry" → Include regulatory/parliamentary risks
   - If user mentions specific industry → Include industry-specific risk categories
   - Check stakeholder analysis for context on project scale, complexity, stakeholders

4. **Read stakeholder analysis carefully**:
   - Extract risk owners from RACI matrix (Accountable = Risk Owner)
   - Extract affected stakeholders (who cares about which risks?)
   - Extract stakeholder concerns from conflict analysis (these ARE risks!)
   - Extract stakeholder drivers (drivers under threat = strategic risks)
   - Note: EVERY risk MUST have a risk owner from stakeholder analysis

5. **Identify risks across Orange Book categories**:

   Use these risk categories aligned to Orange Book framework:

   **STRATEGIC Risks**:
   - Risks to strategic objectives and organizational goals
   - Competitive position, market changes, policy changes
   - Stakeholder drivers under threat
   - Example: "Strategic direction changes mid-project"

   **OPERATIONAL Risks**:
   - Risks to operations, service delivery, business continuity
   - Resource availability, skills gaps, dependencies
   - Process failures, quality issues
   - Example: "Insufficient cloud migration expertise in team"

   **FINANCIAL Risks**:
   - Budget overruns, funding shortfalls, ROI not achieved
   - Cost escalation, currency fluctuations
   - Economic downturn impact
   - Example: "Cloud costs exceed budget by 40%"

   **COMPLIANCE/REGULATORY Risks**:
   - Non-compliance with laws, regulations, policies
   - Audit findings, regulatory penalties
   - Data protection (GDPR, DPA 2018), procurement rules
   - Example: "GDPR non-compliance due to data transfer"

   **REPUTATIONAL Risks**:
   - Damage to reputation, stakeholder confidence, public perception
   - Media scrutiny, parliamentary questions (UK Gov)
   - Service failures visible to public
   - Example: "High-profile service outage damages citizen trust"

   **TECHNOLOGY Risks**:
   - Technical failure, cyber security, legacy system issues
   - Vendor lock-in, technology obsolescence
   - Integration challenges, scalability limitations
   - Example: "Legacy integration fails during peak load"

6. **For EACH risk identified, create comprehensive risk profile**:

   Use the template at `.arckit/templates/risk-register-template.md` and populate:

   **Risk Identification**:
   - **Risk ID**: R-001, R-002, R-003, etc. (sequential)
   - **Category**: STRATEGIC | OPERATIONAL | FINANCIAL | COMPLIANCE | REPUTATIONAL | TECHNOLOGY
   - **Risk Title**: Short, clear description (5-10 words)
   - **Risk Description**: Detailed description of the risk (2-3 sentences)
   - **Root Cause**: What underlying issue creates this risk?
   - **Trigger Events**: What events would cause this risk to materialize?
   - **Consequences if Realized**: What happens if this risk occurs? (tangible impacts)
   - **Affected Stakeholders**: Link to stakeholder-drivers.md (who is impacted?)
   - **Related Objectives**: Link to stakeholder goals/business objectives that are threatened

   **Inherent Risk Assessment** (BEFORE controls):

   **Inherent Likelihood** (1-5 scale):
   - **1 - Rare**: < 5% probability, highly unlikely
   - **2 - Unlikely**: 5-25% probability, could happen but probably won't
   - **3 - Possible**: 25-50% probability, reasonable chance
   - **4 - Likely**: 50-75% probability, more likely to happen than not
   - **5 - Almost Certain**: > 75% probability, expected to occur

   **Inherent Impact** (1-5 scale):
   - **1 - Negligible**: Minimal impact, easily absorbed, < 5% variance
   - **2 - Minor**: Minor impact, manageable within reserves, 5-10% variance
   - **3 - Moderate**: Significant impact, requires management effort, 10-20% variance
   - **4 - Major**: Severe impact, threatens objectives, 20-40% variance
   - **5 - Catastrophic**: Existential threat, project failure, > 40% variance

   **Inherent Risk Score**: Likelihood × Impact (1-25)
   - **1-5**: Low (Green)
   - **6-12**: Medium (Yellow)
   - **13-19**: High (Orange)
   - **20-25**: Critical (Red)

   **Current Controls and Mitigations**:
   - **Existing Controls**: What controls are already in place?
   - **Control Effectiveness**: Weak | Adequate | Strong
   - **Control Owners**: Who maintains these controls?
   - **Evidence of Effectiveness**: How do we know controls work?

   **Residual Risk Assessment** (AFTER controls):

   **Residual Likelihood** (1-5): Likelihood after controls applied
   **Residual Impact** (1-5): Impact after controls applied
   **Residual Risk Score**: Likelihood × Impact (after controls)

   **Risk Response (4Ts Framework)**:

   Select ONE primary response:

   - **TOLERATE**: Accept the risk (within risk appetite, cost of mitigation exceeds benefit)
     - When to use: Low residual risk score (1-5), within appetite
     - Example: "Minor UI inconsistency - aesthetic only, no functional impact"

   - **TREAT**: Mitigate or reduce the risk (implement additional controls)
     - When to use: Medium/High risk, can be reduced through actions
     - Example: "Implement automated testing to reduce defect risk"

   - **TRANSFER**: Transfer risk to 3rd party (insurance, outsourcing, contracts)
     - When to use: Low likelihood/high impact, can be insured or contracted out
     - Example: "Purchase cyber insurance for breach liability"

   - **TERMINATE**: Stop the activity creating the risk
     - When to use: High likelihood/high impact, exceeds appetite, cannot be mitigated
     - Example: "Cancel high-risk vendor contract, source alternative"

   **Risk Ownership**:
   - **Risk Owner**: From stakeholder RACI matrix (Accountable role = Risk Owner)
   - **Action Owner**: Responsible for implementing mitigations
   - **Escalation Path**: Who to escalate to if risk materializes?

   **Action Plan**:
   - **Additional Mitigations Needed**: What else should we do?
   - **Specific Actions**: Concrete steps with owners
   - **Target Date**: When will mitigations be in place?
   - **Target Residual Risk**: What score are we aiming for after mitigations?
   - **Success Criteria**: How will we know mitigations are effective?

   **Risk Status**:
   - **Open**: Newly identified, not yet addressed
   - **In Progress**: Mitigations underway
   - **Monitoring**: Mitigations in place, monitoring effectiveness
   - **Closed**: Risk no longer applicable
   - **Accepted**: Risk tolerated within appetite

   **Risk Appetite Assessment** (if organizational appetite exists):
   - **Risk Appetite Threshold**: What's the appetite for this category?
   - **Assessment**: Within Appetite | Exceeds Appetite | Significantly Exceeds Appetite
   - **Justification**: Why is this acceptable/not acceptable?
   - **Escalation Required**: Yes/No (if exceeds appetite)

7. **Generate comprehensive risk register** with these sections:

   **A. Executive Summary**:
   - Total risks identified (by category)
   - Risk profile distribution:
     - Critical risks (score 20-25): X risks
     - High risks (score 13-19): Y risks
     - Medium risks (score 6-12): Z risks
     - Low risks (score 1-5): W risks
   - Risks exceeding organizational appetite: N risks
   - Overall risk profile: Acceptable | Concerning | Unacceptable
   - Key risks requiring immediate attention (top 3-5)
   - Recommended actions and decisions needed

   **B. Risk Matrix Visualization** (5x5 grid):

   Create TWO matrices:

   **Inherent Risk Matrix** (before controls):
   ```
   LIKELIHOOD ↑
       5 |     | R-3 | R-7 |     | R-1 |  ← Almost Certain
       4 |     |     | R-5 | R-9 |     |
       3 | R-6 |     | R-2 |     | R-4 |  ← Possible
       2 |     | R-8 |     |     |     |
       1 |     |     | R-10|     |     |  ← Rare
         +---------------------------→
           1     2     3     4     5
                IMPACT →
   ```

   **Residual Risk Matrix** (after controls):
   ```
   [Similar 5x5 grid showing risk positions AFTER controls]
   ```

   Show movement: "R-001 moved from Critical (25) to Medium (9) after controls"

   **C. Top 10 Risks** (by residual score):

   Ranked table:
   | Rank | ID | Title | Category | Residual Score | Owner | Status | Response |
   |------|-----|-------|----------|----------------|-------|--------|----------|
   | 1 | R-001 | ... | STRATEGIC | 20 | CEO | In Progress | Treat |

   **D. Risk Register** (detailed table):

   Full table with columns:
   - Risk ID
   - Category
   - Title
   - Description
   - Inherent L/I/Score
   - Controls
   - Residual L/I/Score
   - 4Ts Response
   - Owner
   - Status
   - Actions
   - Target Date

   **E. Risk by Category Analysis**:

   For each category (STRATEGIC, OPERATIONAL, etc.):
   - Number of risks
   - Average inherent score
   - Average residual score
   - Effectiveness of controls (% reduction)
   - Key themes

   **F. Risk Ownership Matrix**:

   Show which stakeholder owns which risks (from RACI):

   | Stakeholder | Owned Risks | Critical/High Risks | Notes |
   |-------------|-------------|---------------------|-------|
   | CFO | R-003, R-007, R-012 | 1 Critical, 2 High | Heavy concentration of financial risks |
   | CTO | R-001, R-004, R-009 | 2 Critical | Technology risk owner |

   **G. 4Ts Response Summary**:

   | Response | Count | % | Key Examples |
   |----------|-------|---|--------------|
   | Tolerate | 5 risks | 25% | R-006, R-010... |
   | Treat | 12 risks | 60% | R-001, R-002... |
   | Transfer | 2 risks | 10% | R-005 (insurance) |
   | Terminate | 1 risk | 5% | R-008 (cancel activity) |

   **H. Risk Appetite Compliance** (if organizational appetite exists):

   | Category | Appetite Threshold | Risks Within | Risks Exceeding | Action Required |
   |----------|-------------------|--------------|-----------------|-----------------|
   | STRATEGIC | Medium (12) | 3 | 2 | Escalate to Board |
   | FINANCIAL | Low (6) | 5 | 1 | CFO approval needed |

   **I. Action Plan**:

   Prioritized list of risk mitigation actions:

   | Priority | Action | Risk(s) Addressed | Owner | Due Date | Status |
   |----------|--------|-------------------|-------|----------|--------|
   | 1 | Implement automated backups | R-001 (Critical) | CTO | 2025-11-15 | In Progress |
   | 2 | Obtain cyber insurance | R-005 (High) | CFO | 2025-12-01 | Not Started |

   **J. Monitoring and Review Framework**:

   - **Review Frequency**: Monthly for Critical/High risks, Quarterly for Medium/Low
   - **Escalation Criteria**: Any risk increasing by 5+ points, any new Critical risk
   - **Reporting Requirements**:
     - Weekly: Critical risks to Steering Committee
     - Monthly: All risks to Project Board
     - Quarterly: Risk appetite compliance to Audit Committee
   - **Next Review Date**: [Date]
   - **Risk Register Owner**: [Name from stakeholder RACI]

   **K. Integration with SOBC**:

   Note which sections of SOBC use this risk register:
   - **Strategic Case**: Strategic risks inform "Why Now?" and urgency
   - **Economic Case**: Risk-adjusted costs use financial risks + optimism bias
   - **Management Case Part E**: Full risk register feeds into risk management section
   - **Recommendation**: High risks may influence option selection

8. **Ensure complete traceability to stakeholders**:

   Every risk must link back to stakeholder analysis:

   ```
   Stakeholder: CFO (from stakeholder-drivers.md)
     → Concern: Budget overrun risk (from conflict analysis)
       → Risk R-003: Cloud costs exceed budget 40% (FINANCIAL, High)
         → Risk Owner: CFO (from RACI matrix - Accountable)
           → Action: Implement FinOps controls, monthly cost reviews
             → Success Criterion: Costs within 5% of budget monthly
   ```

9. **Flag risks that need escalation**:

   Identify risks that require immediate action:
   - **Critical risks** (score 20-25): Escalate to steering committee immediately
   - **Risks exceeding appetite**: Escalate to risk owner + approval authority
   - **Increasing risk trends**: Risks getting worse over time
   - **Unmitigated high risks**: High risks with no treatment plan

10. **Write the output**:
    - Create or update `projects/NNN-project-name/risk-register.md`
    - Use project directory structure (create if doesn't exist)
    - File name pattern: `risk-register.md` (standard name)
    - Update date and version in header

## Output Format

Provide:
1. **Location**: `projects/NNN-project-name/risk-register.md`
2. **Summary**:
   - "Created comprehensive risk register following HM Treasury Orange Book"
   - "Identified [X] risks across 6 categories"
   - "Risk profile: [X] Critical, [Y] High, [Z] Medium, [W] Low"
   - "Overall residual risk score: [X]/500 ([Y]% reduction from inherent)"
   - "All [X] risks have owners from stakeholder RACI matrix"
   - "[N] risks require immediate escalation (exceed appetite or critical)"
3. **Top 3 Risks**:
   - "1. R-001 (STRATEGIC, Critical 20): [Title] - Owner: [Name]"
   - "2. R-002 (TECHNOLOGY, High 16): [Title] - Owner: [Name]"
   - "3. R-003 (FINANCIAL, High 15): [Title] - Owner: [Name]"
4. **4Ts Distribution**:
   - "Tolerate: X% | Treat: Y% | Transfer: Z% | Terminate: W%"
5. **Next steps**:
   - "Review with [Risk Owners] to validate assessment"
   - "Escalate [N] critical/high risks to Steering Committee"
   - "Use risk register for SOBC Management Case Part E"
   - "Implement priority actions from Action Plan"
   - "Schedule monthly risk review meeting"

## Orange Book Compliance Checklist

Ensure the risk register demonstrates Orange Book compliance:

- ✅ **Governance and Leadership**: Risk owners assigned from senior stakeholders
- ✅ **Integration**: Risks linked to objectives, stakeholders, and business case
- ✅ **Collaboration**: Risks sourced from stakeholder concerns and expert judgment
- ✅ **Risk Processes**: Systematic identification, assessment, response, monitoring
- ✅ **Continual Improvement**: Review framework and action plan for ongoing management

## Common Risk Patterns

**Pattern 1: Technology Modernization**:
- TECHNOLOGY: Legacy system failure during migration (High)
- OPERATIONAL: Skills gap in new technology (Medium)
- FINANCIAL: Cloud costs exceed estimates (Medium)
- REPUTATIONAL: Service outage during cutover (High)

**Pattern 2: New Digital Service**:
- STRATEGIC: User adoption below target (High)
- TECHNOLOGY: Scalability limitations at peak (High)
- COMPLIANCE: GDPR/Accessibility non-compliance (Critical)
- OPERATIONAL: Support team not ready for go-live (Medium)

**Pattern 3: Vendor Procurement**:
- FINANCIAL: Vendor pricing increases post-contract (Medium)
- OPERATIONAL: Vendor delivery delays (Medium)
- TECHNOLOGY: Vendor lock-in limits future options (High)
- REPUTATIONAL: Vendor security breach affects reputation (High)

## UK Government Specific Risks

For UK Government/public sector projects, include:

**STRATEGIC**:
- Policy/ministerial direction change mid-project
- Manifesto commitment not delivered
- Machinery of government changes

**COMPLIANCE/REGULATORY**:
- Spending controls (HMT approval delays)
- NAO audit findings
- PAC scrutiny and recommendations
- FOI requests reveal sensitive information
- Judicial review of procurement

**REPUTATIONAL**:
- Parliamentary questions and media scrutiny
- Citizen complaints and service failures
- Social media backlash
- Select Committee inquiry

**OPERATIONAL**:
- GDS Service Assessment failure
- CDDO digital spend control rejection
- Civil service headcount restrictions
- Security clearance delays

## Error Handling

If stakeholder analysis doesn't exist:
- **DO NOT proceed** with risk register
- Tell user: "Risk register requires stakeholder analysis to identify risk owners and affected parties. Please run `/arckit.stakeholders` first."

If risks are very high/critical:
- Flag explicitly: "⚠️ WARNING: [N] Critical risks (score 20-25) identified. Immediate escalation required. Consider if project should proceed."

If all risks exceed appetite:
- Flag: "⚠️ WARNING: Project risk profile significantly exceeds organizational appetite. Senior approval required to proceed."

## Template Reference

Use the template at `.arckit/templates/risk-register-template.md` as the structure. Fill in with:
- Stakeholder analysis data (owners, affected parties, concerns)
- Architecture principles (non-compliance risks)
- Organizational risk appetite (if exists)
- User's project description
- Industry/sector specific risks
- UK Government risks (if applicable)

Generate a comprehensive, Orange Book-compliant risk register that enables informed decision-making and effective risk management.
