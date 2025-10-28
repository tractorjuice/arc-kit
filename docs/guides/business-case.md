# Business Case Guide (HM Treasury Green Book)

A comprehensive guide to creating Strategic Outline Business Cases (SOBC) using HM Treasury Green Book 5-case model with ArcKit.

---

## What is a Business Case?

A business case justifies investment in a project by demonstrating value for money, strategic fit, and deliverability. The SOBC is the first stage, providing a high-level case to secure approval before detailed planning.

### Why Business Cases Matter

Without a strong business case:
- ❌ Projects start without clear objectives
- ❌ No baseline for measuring success
- ❌ Budget approvals delayed or rejected
- ❌ Benefits not linked to costs
- ❌ Governance unclear

With a Green Book business case:
- ✅ Clear strategic justification
- ✅ Options analysis and recommendation
- ✅ Benefits linked to stakeholder goals
- ✅ Risk-adjusted costs
- ✅ Governance and delivery approach
- ✅ Go/no-go decision gate

---

## HM Treasury Green Book 5-Case Model

The Green Book mandates 5 cases for all UK Government investment decisions:

### 1. Strategic Case
**WHY** - Why the project is needed
- Problem statement
- Strategic fit
- Stakeholder drivers
- Scope and dependencies

### 2. Economic Case
**WHAT** - What options exist and which is best
- Options analysis (Do Nothing, Minimal, Balanced, Comprehensive)
- Benefits mapping to stakeholder goals
- Cost estimates (CapEx, OpEx, TCO)
- ROI and payback

### 3. Commercial Case
**HOW TO BUY** - How to procure
- Procurement strategy
- Market assessment
- Sourcing route
- Contract approach

### 4. Financial Case
**CAN WE AFFORD IT** - How to fund
- Budget requirement
- Funding source
- Affordability
- Cash flow

### 5. Management Case
**CAN WE DELIVER IT** - How to deliver
- Governance (from stakeholder RACI)
- Project approach
- Change management
- Benefits realization
- Risk management

---

## Business Case Lifecycle

### SOBC (Strategic Outline Business Case) ← THIS GUIDE
- **When**: Early, before detailed work
- **Purpose**: Go/no-go decision gate
- **Costs**: Rough Order of Magnitude (±50%)
- **ArcKit Command**: `/arckit.sobc`

### OBC (Outline Business Case)
- **When**: After some design work
- **Purpose**: Refine options, narrow choices
- **Costs**: Refined estimates (±25%)

### FBC (Full Business Case)
- **When**: Before final approval
- **Purpose**: Final go/no-go decision
- **Costs**: Accurate estimates (±10%)

---

## When to Create Business Case

Run `/arckit.sobc` after risk assessment, before requirements:

```
1. /arckit.principles        ← Establish governance
2. /arckit.stakeholders      ← WHO CARES? (Map benefits to goals)
3. /arckit.risk              ← WHAT CAN GO WRONG? (Inform costs)
4. /arckit.sobc              ← SHOULD WE DO THIS? (START HERE)
5. /arckit.requirements      ← IF APPROVED, define requirements
```

**CRITICAL**: You **must** run `/arckit.stakeholders` and `/arckit.risk` first because:
- **Strategic Case** - Built on stakeholder drivers
- **Benefits** - Must trace to stakeholder goals
- **Economic Case** - Risks inform optimism bias adjustments
- **Management Case Part E** - Includes full risk register

---

## Creating Business Case with ArcKit

### Step 1: Complete Prerequisites

```bash
# MANDATORY - Business case needs stakeholders and risks
/arckit.stakeholders Analyze stakeholders for [your project]
/arckit.risk Create risk register for [your project]
```

### Step 2: Run Business Case Command

```bash
/arckit.sobc Create SOBC for [your project]
```

**Examples**:
```bash
/arckit.sobc Create SOBC for cloud migration project

/arckit.sobc Generate business case for payment gateway modernization

/arckit.sobc Create strategic outline for NHS appointment booking system
```

### Step 3: Review the Output

ArcKit creates `projects/NNN-project-name/sobc.md` containing:

1. **Executive Summary** - Investment ask, recommendation, key benefits
2. **Strategic Case** - Problem, strategic fit, drivers, scope
3. **Economic Case** - Options, benefits, costs, ROI, recommendation
4. **Commercial Case** - Procurement strategy, market, sourcing
5. **Financial Case** - Budget, funding, affordability
6. **Management Case** - Governance, approach, change, benefits, risks

---

## Strategic Case: The "Why"

### Problem Statement
- What problem are we solving?
- Who is affected? (from stakeholder analysis)
- What is the current impact?
- What happens if we do nothing?

**Example**:
```
Problem: Legacy datacenter infrastructure at end-of-life (EOL May 2026)
Impact: 500 users, £2M annual maintenance, 3x security incidents/year
Do Nothing: System failure risk 80% by EOL, regulatory non-compliance
```

### Strategic Fit
- How does this align with organizational strategy?
- What stakeholder drivers does it address? (from stakeholder-drivers.md)
- Policy alignment (for UK Government)

### Scope
- **In Scope**: What we will deliver
- **Out of Scope**: What we won't deliver
- **Dependencies**: What we need from others

---

## Economic Case: The "What"

### Options Analysis

ArcKit analyzes 4 standard options:

#### Option 1: Do Nothing (Baseline)
- Continue current approach
- Used as comparison baseline
- Often not viable due to risks

#### Option 2: Do Minimum
- Bare minimum to address problem
- Lowest cost but limited benefits
- May not fully solve problem

#### Option 3: Do Balanced (Often Recommended)
- Balances cost, risk, and benefits
- Addresses key stakeholder goals
- Acceptable risk profile

#### Option 4: Do Maximum
- Gold-plated solution
- Highest cost and benefits
- May exceed actual needs

### Benefits Mapping

**Every benefit MUST trace to a stakeholder goal:**

```
Stakeholder: CFO (from stakeholder-drivers.md)
  → Goal G-001: Reduce infrastructure costs 40% by Year 1
    → Benefit B-001: £2M annual cloud savings
      → Measurement: FinOps dashboard, monthly reporting
        → Baseline: £5M/year current spend
          → Target: £3M/year cloud spend
            → Realization: Month 12 post-migration
```

### Cost Estimates (ROM - Rough Order of Magnitude)

**CapEx (Capital Expenditure)**:
- One-time costs: Software licenses, hardware, implementation
- Range: ±50% at SOBC stage

**OpEx (Operational Expenditure)**:
- Recurring costs: Subscriptions, support, operations
- Annual or monthly

**TCO (Total Cost of Ownership)**:
- 3-year or 5-year total
- Includes CapEx + (OpEx × years)

**Example**:
```
Option 3: Balanced Cloud Migration
CapEx: £500K-£750K (migration, training, setup)
OpEx: £3M/year (cloud services, support)
3-Year TCO: £9.5M-£10M (CapEx + 3 years OpEx)

Current State:
OpEx: £5M/year (datacenter, maintenance)
3-Year TCO: £15M

Net Savings: £5M-£5.5M over 3 years
```

### Economic Appraisal

**ROI (Return on Investment)**:
```
ROI = (Benefits - Costs) / Costs × 100%

Example:
Benefits: £6M (3 years × £2M savings)
Costs: £10M (TCO)
ROI: (£6M - £10M) / £10M = -40% (Not financially positive)

BUT: Includes non-financial benefits (risk reduction, compliance)
```

**Payback Period**:
```
Payback = Investment / Annual Benefit

Example:
Investment: £750K CapEx
Annual Benefit: £2M savings
Payback: 0.375 years = 4.5 months
```

**Recommendation**:
- Which option to pursue
- Rationale (why this option?)
- Comparison to other options

---

## Commercial Case: The "How to Buy"

### UK Government Procurement

**Digital Marketplace** (preferred):
- **G-Cloud**: Off-the-shelf services (SaaS, hosting)
- **DOS**: Custom development, specialists
- Streamlined, pre-qualified suppliers

**Crown Commercial Service**:
- Framework agreements
- Approved suppliers

**Open Tender** (if no framework suitable):
- OJEU/Find a Tender
- Longer process

### Private Sector Procurement

**Build vs Buy Decision**:
- Build: Custom development
- Buy: Commercial product
- Partner: Co-development or white-label

**Sourcing Route**:
- RFP/RFI process
- Vendor evaluation criteria
- Contract type (fixed-price, T&M, outcome-based)

### Market Assessment
- Supplier availability
- Competition level
- Pricing benchmarks
- SME opportunities (UK Government)

---

## Financial Case: The "Can We Afford It"

### Budget Requirement
- How much money needed?
- When is it needed? (cash flow)

### Funding Source
- **UK Government**: Spending Review allocation, reserve claims
- **Private Sector**: Operating budget, capital budget, financing

### Approval Thresholds
- **UK Government**: 
  - <£100K: SRO approval
  - £100K-£10M: CDDO approval
  - >£10M: HM Treasury approval
- **Private Sector**: Varies by organization

### Affordability
- Is budget available?
- Impact on other programmes?
- Funding certainty

---

## Management Case: The "Can We Deliver It"

### Governance (from Stakeholder RACI)

**Project Board**:
- Senior Responsible Owner (SRO) - Accountable
- Project Manager - Responsible
- Business Lead - Consulted
- Technical Lead - Consulted

### Project Approach

**Agile** (preferred for UK Government):
- Iterative delivery
- User-centered design
- MVP then iterate

**Phased**:
- Phase 1: Quick wins
- Phase 2: Core capability
- Phase 3: Full rollout

**Waterfall** (avoid if possible):
- Full requirements upfront
- Sequential delivery

### Change Management (from Stakeholder Conflicts)

**Champions** (high interest, support):
- Engage as advocates
- Use for user acceptance testing

**Fence-sitters** (neutral):
- Show early wins
- Address concerns

**Resisters** (opposition):
- Understand drivers (from stakeholder analysis)
- Mitigate threatened interests

### Benefits Realization

**Tracking**:
- KPI dashboard
- Monthly reporting to Project Board
- Link to stakeholder outcomes

**Responsibility**:
- Benefit Owner (from stakeholder RACI)
- Measurement frequency
- Corrective actions if off-track

### Risk Management (from risk-register.md)

**Management Case Part E**:
- Full risk register included
- Top 5-10 risks highlighted
- Risk appetite compliance
- Mitigation plans and costs

---

## UK Government Specific Requirements

### Social Value
- Minimum 10% weighting in evaluation
- Fighting climate change
- Creating jobs
- Wellbeing

### Digital Spend Control
- CDDO approval required for technology spend
- Must demonstrate value for money
- Alignment with technology strategy

### Service Standard
- If public-facing service, must meet Service Standard
- Assessments at Alpha, Beta, Live
- GDS assessment team

### Optimism Bias
- HM Treasury Green Book requirement
- Adjust costs upward based on risk profile
- Standard uplifts:
  - Low complexity: +15%
  - Medium complexity: +25%
  - High complexity: +40%

**Example**:
```
Base estimate: £10M
Complexity: High (new technology, uncertain scope)
Optimism bias: +40%
Risk-adjusted estimate: £14M
```

---

## Integration with Project Workflow

Business case is the **approval gate**:

```
stakeholder-drivers.md
  ↓ (inform Strategic Case)
risk-register.md
  ↓ (inform Economic Case - optimism bias)
sobc.md ← APPROVAL GATE
  ↓ (if approved)
requirements.md
  ↓
...rest of workflow
```

**If SOBC is rejected**:
- Project does not proceed
- Or: Refine options and resubmit
- Or: Descope to lower cost option

**If SOBC is approved**:
- Budget allocated
- Project team mobilized
- Move to requirements definition

---

## Best Practices

### 1. Be Realistic About Costs
❌ Bad: Low estimates to get approval
✅ Good: Risk-adjusted estimates with optimism bias

### 2. Link Benefits to Stakeholders
❌ Bad: "Improved efficiency" (vague)
✅ Good: "Operations team saves 500 hours/month on manual processing (Goal G-003)"

### 3. Analyze Real Options
❌ Bad: Only one option presented (pre-determined)
✅ Good: 3-4 genuine options with trade-offs

### 4. Document Assumptions
- State all assumptions explicitly
- What could invalidate the business case?
- Sensitivity analysis (what if costs 20% higher?)

### 5. Use Risk Register
- Link risks to costs (contingency)
- Show risk-adjusted TCO
- Demonstrate risk management maturity

---

## Common Mistakes

### 1. Skipping Stakeholder Analysis
**Mistake**: Writing Strategic Case without knowing stakeholder drivers
**Impact**: Benefits don't resonate with decision-makers
**Fix**: Always run `/arckit.stakeholders` before `/arckit.sobc`

### 2. Benefits Not Measurable
**Mistake**: "Improved user experience" with no KPI
**Impact**: Can't prove value delivered
**Fix**: Every benefit needs baseline, target, measurement, owner

### 3. Underestimating Costs
**Mistake**: Only including obvious costs (software licenses)
**Impact**: Budget overruns, project failure
**Fix**: Include training, change management, operations, decommissioning

### 4. No Risk Adjustment
**Mistake**: Presenting base costs without optimism bias
**Impact**: HM Treasury rejects business case
**Fix**: Apply Green Book optimism bias uplifts

### 5. Pre-determined Solution
**Mistake**: Only analyzing preferred option
**Impact**: Appears biased, not rigorous
**Fix**: Analyze 3-4 genuine options with objective criteria

---

## Support

For issues or questions:
- GitHub Issues: https://github.com/tractorjuice/arc-kit/issues
- Documentation: https://github.com/tractorjuice/arc-kit

---

**Last updated**: 2025-10-28
**ArcKit Version**: 0.3.6
