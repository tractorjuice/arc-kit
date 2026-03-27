---
description: Create comprehensive risk register following HM Treasury Orange Book principles
argument-hint: "<project ID or category, e.g. '001', 'procurement risks'>"
effort: high
handoffs:
  - command: sobc
    description: Feed risk register into SOBC Management Case
  - command: requirements
    description: Create risk-driven requirements
  - command: secure
    description: Validate security controls against risks
---

You are helping an enterprise architect create a comprehensive risk register following the UK Government Orange Book (2023) risk management framework.

## About Orange Book Risk Management

The **Orange Book** is HM Treasury's guidance on risk management in government. The 2023 update provides:

- **Part I**: 5 Risk Management Principles (Governance & Leadership, Integration, Collaboration & Best Information, Risk Management Processes, Continual Improvement)
- **Part II**: Risk Control Framework (4-pillar "house" structure) underpinned by the Three Lines Model
- **Risk Treatment Options** (6 options per Orange Book 2023): Avoid, Take/Increase, Retain, Change Likelihood, Change Consequences, Share
- **Risk Assessment Methodology**: Likelihood × Impact for Inherent and Residual risk
- **Risk Appetite**: The nature and extent of principal risks the organisation is willing to take to achieve its objectives
- **Three Lines Model**: First line (management owns risk), Second line (risk/compliance functions provide oversight), Third line (internal audit provides independent assurance)

## User Input

```text
$ARGUMENTS
```

## Instructions

> **Note**: The ArcKit Project Context hook has already detected all projects, artifacts, external documents, and global policies. Use that context below — no need to scan directories manually.

This command creates a **comprehensive risk register** following HM Treasury Orange Book principles and integrates with ArcKit's stakeholder-driven workflow.

**When to use this:**

- **After**: `/arckit:stakeholders` (MANDATORY - every risk needs an owner)
- **Before**: `/arckit:sobc` (SOBC Management Case Part E uses risk register)
- **Purpose**: Identify, assess, and manage project risks using Orange Book methodology

1. **Read existing artifacts** from the project context:

   **MANDATORY** (warn if missing):
   - **STKE** (Stakeholder Analysis) — Extract: risk owners from RACI matrix, affected stakeholders, conflict analysis (conflicts ARE risks), stakeholder drivers (drivers under threat = strategic risks)
     - If missing: STOP and warn user to run `/arckit:stakeholders` first — every risk MUST have an owner

   **RECOMMENDED** (read if available, note if missing):
   - **PRIN** (Architecture Principles, in 000-global) — Extract: technology standards, compliance requirements — non-compliance creates risks
   - `projects/000-global/risk-appetite.md` — Extract: risk appetite thresholds for assessment calibration
   - **REQ** (Requirements) — Extract: complex requirements that create risks, NFRs that mitigate risks

   **OPTIONAL** (read if available, skip silently):
   - **SOBC** (Business Case) — Extract: financial risks, ROI assumptions at risk
   - **DPIA** (Data Protection Impact Assessment) — Extract: data protection risks, privacy risks

2. **Understand the request**: The user may be:
   - Creating initial risk register (most common)
   - Updating existing risk register with new risks
   - Reassessing risks after changes
   - Creating organizational risk appetite (advanced - if user asks for this specifically)

3. **Read external documents and policies**:
   - Read any **global policies** listed in the project context (`000-global/policies/`) — extract risk appetite, risk tolerance thresholds, threat landscape, industry benchmarks
   - Read any **external documents** listed in the project context (`external/` files) — extract previous risk findings, mitigation effectiveness, residual risks, lessons learned
   - Read any **enterprise standards** in `projects/000-global/external/` — extract enterprise risk frameworks, threat intelligence reports
   - If no external risk docs exist but they would improve the assessment, ask: "Do you have a risk appetite statement, previous risk assessments, or external threat reports? I can read PDFs directly. Place them in `projects/000-global/policies/` and re-run, or skip."

4. **Determine project context**:
   - If user mentions "UK Government", "public sector", "department", "ministry" → Include regulatory/parliamentary risks
   - If user mentions specific industry → Include industry-specific risk categories
   - Check stakeholder analysis for context on project scale, complexity, stakeholders

5. **Read stakeholder analysis carefully**:
   - Extract risk owners from RACI matrix (Accountable = Risk Owner)
   - Extract affected stakeholders (who cares about which risks?)
   - Extract stakeholder concerns from conflict analysis (these ARE risks!)
   - Extract stakeholder drivers (drivers under threat = strategic risks)
   - Note: EVERY risk MUST have a risk owner from stakeholder analysis

6. **Identify risks across Orange Book categories**:

   Start by deriving at least one risk from each architecture principle — non-compliance with P-001 through P-006 each creates a specific risk. Then extend to cover all categories.

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

7. **For EACH risk identified, create comprehensive risk profile**:

   **Read the template** (with user override support):
   - **First**, check if `.arckit/templates/risk-register-template.md` exists in the project root
   - **If found**: Read the user's customized template (user override takes precedence)
   - **If not found**: Read `${CLAUDE_PLUGIN_ROOT}/templates/risk-register-template.md` (default)

   > **Tip**: Users can customize templates with `/arckit:customize risk-register`

   Populate the template with:

   **Risk Identification**:
   - **Risk ID**: R-001, R-002, R-003, etc. (sequential)
   - **Category**: STRATEGIC | OPERATIONAL | FINANCIAL | COMPLIANCE | REPUTATIONAL | TECHNOLOGY
   - **Risk Title**: Short, clear description (5-10 words)
   - **Risk Description**: Detailed description of the risk (2-3 sentences)
   - **Root Cause**: What underlying issue creates this risk?
   - **Trigger Events**: What events would cause this risk to materialize?
   - **Consequences if Realized**: What happens if this risk occurs? (tangible impacts)
   - **Affected Stakeholders**: Link to ARC-{PROJECT_ID}-STKE-v*.md (who is impacted?)
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

   **Inherent Risk Score**: Likelihood × Impact (1-25). Use these exact boundaries consistently throughout the document — when citing a risk's level in summaries, tables, and narratives, the label MUST match this scale:
   - **1-5**: Low (Green)
   - **6-12**: Medium (Yellow) — note: score 12 is Medium, not High
   - **13-19**: High (Orange) — note: score 13 is the threshold for High
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

   **Risk Response** (Orange Book 2023 treatment options):

   Select ONE or more responses from the six options defined in the Orange Book:

   - **AVOID**: Decide not to start or continue the activity causing the risk
     - When to use: Risk exceeds appetite, activity is not essential to objectives
     - Example: "Cancel use of untested vendor; source proven alternative"

   - **TAKE / INCREASE**: Pursue an opportunity despite the associated risk
     - When to use: Upside outweighs downside; risk is within appetite
     - Example: "Proceed with cloud migration despite short-term disruption risk, to capture long-term savings"

   - **RETAIN**: Accept the risk through an informed decision
     - When to use: Residual risk within appetite; cost of further treatment exceeds benefit
     - Example: "Accept minor UI inconsistency — aesthetic only, no functional impact"

   - **CHANGE LIKELIHOOD**: Reduce the probability of occurrence
     - When to use: Root cause can be addressed through preventive controls
     - Example: "Implement automated testing to reduce defect escape rate"

   - **CHANGE CONSEQUENCES**: Reduce the impact if the risk materialises (includes contingency planning)
     - When to use: Likelihood cannot be reduced but impact can be contained
     - Example: "Implement graceful degradation so legacy outage causes delay, not failure"

   - **SHARE**: Transfer or distribute risk to a third party (insurance, contracts, partnerships)
     - When to use: Risk can be contractually or financially transferred
     - Example: "Purchase cyber insurance for breach liability; include SLA penalties in vendor contract"

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

8. **Generate comprehensive risk register** with these sections:

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

   **B. Risk Matrix Visualization** (using ASCII 5×5 matrix):

   Create TWO 5×5 matrices showing Likelihood (rows) × Impact (columns):

   **Inherent Risk Matrix** (before controls):

   ```text
                                       IMPACT
                 1-Minimal   2-Minor    3-Moderate   4-Major    5-Severe
              ┌───────────┬───────────┬───────────┬───────────┬───────────┐
   5-Almost   │           │           │   R-003   │   R-007   │   R-001   │
   Certain    │    5      │    10     │    15     │    20     │    25     │
              ├───────────┼───────────┼───────────┼───────────┼───────────┤
   4-Likely   │           │           │           │   R-009   │   R-004   │
              │    4      │    8      │    12     │    16     │    20     │
   L          ├───────────┼───────────┼───────────┼───────────┼───────────┤
   I 3-Possible│          │           │   R-002   │           │           │
   K          │    3      │    6      │    9      │    12     │    15     │
   ...        └───────────┴───────────┴───────────┴───────────┴───────────┘

   Legend: Critical (20-25)  High (13-19)  Medium (6-12)  Low (1-5)
   ```

   **Residual Risk Matrix** (after controls): Same format showing new positions

   Show movement: "R-001 moved from Critical (25) to Medium (6) after controls"

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
   - Risk Response (Orange Book treatment)
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

   **G. Risk Treatment Summary** (Orange Book 2023 options):

   | Response | Count | % | Key Examples |
   |----------|-------|---|--------------|
   | Avoid | 1 risk | 5% | R-008 (cancel activity) |
   | Take/Increase | 0 risks | 0% | — |
   | Retain | 3 risks | 15% | R-006, R-010... |
   | Change Likelihood | 8 risks | 40% | R-001, R-002... |
   | Change Consequences | 5 risks | 25% | R-005, R-013... |
   | Share | 3 risks | 15% | R-004 (insurance), R-012 (contract) |

   **H. Risk Interdependencies**:

   Identify risks that are causally linked — where one risk materialising would increase the likelihood or impact of another. Show the dependency chains and highlight cascade risks:

   | Trigger Risk | Affected Risk(s) | Cascade Effect |
   |-------------|------------------|----------------|
   | R-001 (funding delay) | R-003 (cost overrun), R-005 (timeline) | Budget pressure forces scope cuts, compressing schedule |

   Flag cascade risks where a single trigger could escalate 3+ risks simultaneously.

   **I. Risk Appetite Compliance** (if organizational appetite exists):

   | Category | Appetite Threshold | Risks Within | Risks Exceeding | Action Required |
   |----------|-------------------|--------------|-----------------|-----------------|
   | STRATEGIC | Medium (12) | 3 | 2 | Escalate to Board |
   | FINANCIAL | Low (6) | 5 | 1 | CFO approval needed |

   **J. Action Plan** (include cost and expected risk reduction per action):

   Prioritized list of risk mitigation actions:

   | Priority | Action | Risk(s) Addressed | Owner | Due Date | Cost | Expected Score Reduction | Status |
   |----------|--------|-------------------|-------|----------|------|--------------------------|--------|
   | 1 | Implement automated backups | R-001 (Critical) | CTO | 2025-11-15 | £10K | 25→12 (-13 pts) | In Progress |
   | 2 | Obtain cyber insurance | R-005 (High) | CFO | 2025-12-01 | £8K/yr | 15→9 (-6 pts, share) | Not Started |

   Include total investment, total expected risk reduction, and cost-per-risk-point-reduced at the bottom of the action plan

   **K. Monitoring and Review Framework**:

   - **Review Frequency**: Monthly for Critical/High risks, Quarterly for Medium/Low
   - **Escalation Criteria**: Any risk increasing by 5+ points, any new Critical risk
   - **Reporting Requirements**:
     - Weekly: Critical risks to Steering Committee
     - Monthly: All risks to Project Board
     - Quarterly: Risk appetite compliance to Audit Committee
   - **Next Review Date**: [Date]
   - **Risk Register Owner**: [Name from stakeholder RACI]

   **L. Integration with SOBC**:

   Note which sections of SOBC use this risk register:
   - **Strategic Case**: Strategic risks inform "Why Now?" and urgency
   - **Economic Case**: Risk-adjusted costs use financial risks + optimism bias
   - **Management Case Part E**: Full risk register feeds into risk management section
   - **Recommendation**: High risks may influence option selection

9. **Ensure complete traceability to stakeholders**:

   Every risk must link back to stakeholder analysis:

   ```text
   Stakeholder: CFO (from ARC-{PROJECT_ID}-STKE-v*.md)
     → Concern: Budget overrun risk (from conflict analysis)
       → Risk R-003: Cloud costs exceed budget 40% (FINANCIAL, High)
         → Risk Owner: CFO (from RACI matrix - Accountable)
           → Action: Implement FinOps controls, monthly cost reviews
             → Success Criterion: Costs within 5% of budget monthly
   ```

10. **Flag risks that need escalation**:

   Identify risks that require immediate action:

- **Critical risks** (score 20-25): Escalate to steering committee immediately
- **Risks exceeding appetite**: Escalate to risk owner + approval authority
- **Increasing risk trends**: Risks getting worse over time
- **Unmitigated high risks**: High risks with no treatment plan

11. **Write the output**:

    Before writing the file, read `${CLAUDE_PLUGIN_ROOT}/references/quality-checklist.md` and verify all **Common Checks** plus the **RISK** per-type checks pass. Fix any failures before proceeding.

    - Create or update `projects/NNN-project-name/ARC-{PROJECT_ID}-RISK-v1.0.md`
    - Use project directory structure (create if doesn't exist)
    - File name pattern: `ARC-{PROJECT_ID}-RISK-v{VERSION}.md`
    - Update date and version in header

**IMPORTANT - Auto-Populate Document Information Fields**:

Before completing the document, populate document information fields:

### Auto-populated fields

- `[PROJECT_ID]` → Extract from project path (e.g., "001")
- `[VERSION]` → Start with "1.0" for new documents
- `[DATE]` / `[YYYY-MM-DD]` → Current date in YYYY-MM-DD format
- `[DOCUMENT_TYPE_NAME]` → Document purpose
- `ARC-[PROJECT_ID]-RISK-v[VERSION]` → Generated document ID
- `[STATUS]` → "DRAFT" for new documents
- `[CLASSIFICATION]` → Default to "OFFICIAL" (UK Gov) or "PUBLIC"

### User-provided fields

- `[PROJECT_NAME]` → Full project name
- `[OWNER_NAME_AND_ROLE]` → Document owner

### Revision History

```markdown
| 1.0 | {DATE} | ArcKit AI | Initial creation from `/arckit:risk` command |
```

### Generation Metadata Footer

```markdown
**Generated by**: ArcKit `/arckit:risk` command
**Generated on**: {DATE}
**ArcKit Version**: {ARCKIT_VERSION}
**Project**: {PROJECT_NAME} (Project {PROJECT_ID})
**AI Model**: [Actual model name]
```

## Output Format

Provide:

1. **Location**: `projects/NNN-project-name/ARC-{PROJECT_ID}-RISK-v1.0.md`
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
4. **Treatment Distribution** (Orange Book options):
   - "Avoid: X% | Retain: Y% | Change Likelihood: Z% | Change Consequences: A% | Share: B%"
5. **Next steps**:
   - "Review with [Risk Owners] to validate assessment"
   - "Escalate [N] critical/high risks to Steering Committee"
   - "Use risk register for SOBC Management Case Part E"
   - "Implement priority actions from Action Plan"
   - "Schedule monthly risk review meeting"

## Orange Book Compliance Checklist

Ensure the risk register demonstrates Orange Book (2023) compliance:

- ✅ **A. Governance and Leadership**: Risk owners assigned from senior stakeholders; escalation paths to board/audit committee; risk appetite set and monitored
- ✅ **B. Integration**: Risks linked to objectives, stakeholders, and business case; risk management embedded in project governance
- ✅ **C. Collaboration and Best Information**: Risks sourced from stakeholder concerns and expert judgment; evidence-based assessment
- ✅ **D. Risk Management Processes**: Systematic identification, assessment using 6 Orange Book treatment options, monitoring with KRIs
- ✅ **E. Continual Improvement**: Review framework, lessons learned, risk register version control
- ✅ **Three Lines Model**: First line (risk owners manage day-to-day), second line (PMO/risk function oversight), third line (audit committee/internal audit assurance)

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
- Tell user: "Risk register requires stakeholder analysis to identify risk owners and affected parties. Please run `/arckit:stakeholders` first."

If risks are very high/critical:

- Flag explicitly: "⚠️ WARNING: [N] Critical risks (score 20-25) identified. Immediate escalation required. Consider if project should proceed."

If all risks exceed appetite:

- Flag: "⚠️ WARNING: Project risk profile significantly exceeds organizational appetite. Senior approval required to proceed."

## Template Reference

Use the template at `${CLAUDE_PLUGIN_ROOT}/templates/risk-register-template.md` as the structure. Fill in with:

- Stakeholder analysis data (owners, affected parties, concerns)
- Architecture principles (non-compliance risks)
- Organizational risk appetite (if exists)
- User's project description
- Industry/sector specific risks
- UK Government risks (if applicable)

Generate a comprehensive, Orange Book-compliant risk register that enables informed decision-making and effective risk management.

## Important Notes

- **Markdown escaping**: When writing less-than or greater-than comparisons, always include a space after `<` or `>` (e.g., `< 3 seconds`, `> 99.9% uptime`) to prevent markdown renderers from interpreting them as HTML tags or emoji
- **Document Approval specificity**: The Document Approval table must use realistic distinct names for each role (Risk Register Owner, Project Manager, Senior Responsible Owner, Steering Committee Chair) — do not repeat the same name/role for all entries
- **External References**: Include references to all key legislation and standards cited in the risk register (e.g., GDPR, DPA 2018, FOI Act, Equality Act, GDS Service Standard, TCoP, NCSC CAF, Orange Book) with URLs where applicable
