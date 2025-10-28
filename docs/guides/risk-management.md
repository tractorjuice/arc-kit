# Risk Management Guide (Orange Book)

A comprehensive guide to identifying, assessing, and managing risks using HM Treasury Orange Book 2023 methodology with ArcKit.

---

## What is Risk Management?

Risk management systematically identifies threats and opportunities that could affect project objectives, then implements controls to manage those risks within acceptable levels (risk appetite).

### Why Risk Management Matters

Without systematic risk management:
- ❌ Surprises derail projects late
- ❌ Risks discovered after they materialize
- ❌ No objective basis for risk prioritization
- ❌ Business cases lack risk-adjusted costs
- ❌ Audit findings on inadequate risk management

With Orange Book risk management:
- ✅ Proactive risk identification before problems occur
- ✅ Systematic assessment using 5×5 matrix
- ✅ Evidence-based prioritization and mitigation
- ✅ Risk-adjusted business cases (optimism bias)
- ✅ NAO/audit compliance

---

## HM Treasury Orange Book 2023 Framework

The Orange Book provides the UK Government standard for risk management:

### Part I: Five Principles of Risk Management
1. **Governance and Leadership** - Risk ownership at senior level
2. **Integration** - Risk embedded in decision-making
3. **Collaboration** - Multiple perspectives on risks
4. **Risk Processes** - Systematic identify, assess, respond, monitor
5. **Continual Improvement** - Learn and adapt

### Part II: Risk Control Framework
- Risk appetite and tolerance
- Risk ownership and governance
- Risk assessment methodology
- Control effectiveness measurement

---

## When to Run Risk Assessment

Run `/arckit.risk` after stakeholder analysis, before business case:

```
1. /arckit.principles        ← Establish governance
2. /arckit.stakeholders      ← WHO CARES? (Identify risk owners)
3. /arckit.risk              ← WHAT CAN GO WRONG? (START HERE)
4. /arckit.sobc              ← Use risks to inform business case
5. /arckit.requirements      ← Address risks in requirements
```

**CRITICAL**: You **must** run `/arckit.stakeholders` first because every risk needs an **owner** from the stakeholder RACI matrix.

---

## Creating Risk Register with ArcKit

### Step 1: Complete Stakeholder Analysis

```bash
# MANDATORY - Risks need owners from RACI matrix
/arckit.stakeholders Analyze stakeholders for [your project]
```

### Step 2: Run Risk Assessment

```bash
/arckit.risk Identify risks for [your project]
```

**Examples**:
```bash
/arckit.risk Create risk register for cloud migration project

/arckit.risk Assess risks for payment gateway modernization with stakeholder concerns

/arckit.risk Identify risks for NHS appointment booking system
```

### Step 3: Review the Output

ArcKit creates `projects/NNN-project-name/risk-register.md` containing:

1. **Executive Summary** - Risk profile, top risks, appetite compliance
2. **Risk Matrix Visualization** - 5×5 grids for inherent and residual risk
3. **Top 10 Risks** - Highest priority risks ranked by residual score
4. **Detailed Risk Register** - Complete assessment for each risk
5. **4Ts Response Summary** - Distribution of Tolerate/Treat/Transfer/Terminate
6. **Action Plan** - Prioritized risk mitigation activities
7. **Orange Book Compliance** - Checklist demonstrating compliance

---

## Risk Categories

ArcKit identifies risks across 6 categories:

### 1. STRATEGIC Risks
Risks to strategic objectives, competitive position, policy changes
- **Example**: Strategic direction changes mid-project due to ministerial reshuffle

### 2. OPERATIONAL Risks  
Risks to operations, service delivery, business continuity
- **Example**: Insufficient cloud expertise in team for migration

### 3. FINANCIAL Risks
Budget overruns, funding shortfalls, ROI not achieved
- **Example**: Cloud costs exceed budget by 40% due to poor estimation

### 4. COMPLIANCE/REGULATORY Risks
Non-compliance with laws, regulations, policies
- **Example**: GDPR breach due to international data transfer

### 5. REPUTATIONAL Risks
Damage to reputation, stakeholder confidence, public perception
- **Example**: High-profile service outage damages citizen trust

### 6. TECHNOLOGY Risks
Technical failure, cyber security, legacy system issues
- **Example**: Legacy integration fails under production load

---

## Risk Assessment: 5×5 Matrix

### Likelihood Scale (1-5)
- **1 - Rare**: <5% probability, hasn't happened in 10+ years
- **2 - Unlikely**: 5-25%, happened once in 5-10 years
- **3 - Possible**: 25-50%, happens occasionally (1-5 years)
- **4 - Likely**: 50-75%, happens frequently (yearly)
- **5 - Almost Certain**: >75%, happens regularly (multiple times per year)

### Impact Scale (1-5)
- **1 - Negligible**: <£10K cost, <1 day delay, no reputational impact
- **2 - Minor**: £10-50K, 1-7 days, local media mention
- **3 - Moderate**: £50-250K, 1-4 weeks, sector-wide concern
- **4 - Major**: £250K-1M, 1-3 months, national media, minister involved
- **5 - Catastrophic**: >£1M, >3 months, PM briefed, programme terminated

### Risk Score = Likelihood × Impact (1-25)

### Risk Zones
- 🟥 **Critical (20-25)**: Immediate escalation, senior management action
- 🟧 **High (13-19)**: Management attention, mitigation plan required
- 🟨 **Medium (6-12)**: Monitoring, consider mitigation
- 🟩 **Low (1-5)**: Routine monitoring, accept

---

## Inherent vs Residual Risk

### Inherent Risk
Risk level **before** any controls are applied
- "What's the worst that could happen if we did nothing?"
- Used to assess if risk is worth managing

### Residual Risk
Risk level **after** current controls are applied
- "What's the risk level with our existing mitigations?"
- Used to decide if additional action is needed
- Compared against risk appetite

### Control Effectiveness
```
Control Effectiveness = (Inherent Score - Residual Score) / Inherent Score × 100%

Example:
Inherent: L=4, I=5, Score=20 (Critical)
Residual: L=3, I=3, Score=9 (Medium)
Effectiveness: (20-9)/20 = 55% risk reduction
```

---

## The 4Ts: Risk Response Framework

Every risk receives **ONE** primary response:

### 1. TOLERATE (Accept)
- **When**: Residual risk within appetite, mitigation cost exceeds benefit
- **Example**: Minor UI inconsistency - aesthetic only, low score
- **Action**: Document acceptance, monitor periodically

### 2. TREAT (Mitigate)
- **When**: Medium/High risk that can be reduced through actions
- **Example**: Implement automated testing to reduce defect risk from 12 to 6
- **Action**: Implement additional controls, reduce likelihood or impact

### 3. TRANSFER (Outsource/Insure)
- **When**: Low likelihood but high impact, can be contracted away
- **Example**: Purchase cyber insurance for breach liability
- **Action**: Insurance, warranties, outsourcing, contractual clauses

### 4. TERMINATE (Eliminate)
- **When**: High likelihood + high impact, exceeds appetite, can't mitigate
- **Example**: Cancel high-risk vendor, source alternative
- **Action**: Stop the activity creating the risk

---

## Risk Ownership

**Every risk must have an owner** from the stakeholder RACI matrix:

```
Stakeholder: CFO (from stakeholder-drivers.md)
  → Driver D-001: Reduce costs (FINANCIAL)
    → Risk R-004: Cloud costs exceed budget by 40%
      → Risk Owner: CFO (Accountable in RACI)
        → Current Controls: Monthly cost reviews, FinOps dashboard
          → Residual Score: 9 (Medium, within appetite)
            → Response: TREAT - Implement cost anomaly alerts
              → Target Score: 6 (Low)
```

Risk owners are responsible for:
- Monitoring the risk
- Implementing mitigation actions
- Reporting risk status
- Escalating if risk exceeds appetite

---

## UK Government Specific Risks

### STRATEGIC
- Policy/ministerial direction change mid-project
- Manifesto commitment not delivered
- Machinery of government changes

### COMPLIANCE
- HM Treasury spending controls (approval delays)
- NAO audit findings
- PAC (Public Accounts Committee) scrutiny
- GDS Service Assessment failure

### REPUTATIONAL
- Media scrutiny of government IT failures
- Social media backlash
- Select Committee inquiry

### OPERATIONAL
- Security clearance delays (SC/DV)
- Civil service headcount restrictions
- CDDO digital spend control rejection

---

## Integration with Business Case

Risk register feeds directly into SOBC Management Case Part E:

### Strategic Case
- Strategic risks demonstrate urgency ("Why Now?")
- High risk profile = compelling case for action

### Economic Case
- Financial risks inform optimism bias adjustment
- Risk-adjusted costs (HM Treasury Green Book guidance)
- Contingency budgets based on risk scores

### Management Case Part E
- Full risk register included
- Risk management approach documented
- Monitoring and review schedule defined

---

## Best Practices

### 1. Be Specific
❌ Bad: "Technology might fail"
✅ Good: "Legacy mainframe integration fails under production load (2000+ TPS)"

### 2. Link to Stakeholders
Every risk should trace to a stakeholder concern:
- CFO cost concern → Cost overrun risk
- Operations downtime concern → Availability risk

### 3. Quantify Impact
❌ Bad: "High cost"
✅ Good: "£500K budget overrun, 3-month delay"

### 4. Document Controls
List what you're already doing to mitigate:
- Technical controls (automated testing, monitoring)
- Process controls (change approval, peer review)
- People controls (training, certifications)

### 5. Update Regularly
- Review Critical/High risks: **Weekly**
- Review Medium risks: **Monthly**  
- Review Low risks: **Quarterly**
- Update after major project changes

---

## Common Mistakes

### 1. Skipping Stakeholder Analysis
**Mistake**: Creating risks without identifying owners
**Impact**: No one accountable for managing risks
**Fix**: Always run `/arckit.stakeholders` before `/arckit.risk`

### 2. Generic Risk Descriptions
**Mistake**: "Security risk", "Cost risk" (too vague)
**Impact**: Can't develop specific mitigations
**Fix**: "SQL injection vulnerability in payment API exposes 500K card details"

### 3. Confusing Inherent and Residual
**Mistake**: Rating risk after controls as inherent risk
**Impact**: Can't measure control effectiveness
**Fix**: Always assess inherent first (worst case), then residual (with controls)

### 4. Wrong 4Ts Response
**Mistake**: Choosing TREAT for low risks or TOLERATE for critical risks
**Impact**: Wasted effort or unmanaged critical risks
**Fix**: Use decision tree: Critical/High = TREAT or TRANSFER, Low = TOLERATE

### 5. No Action Plan
**Mistake**: Identifying risks but not defining mitigation actions
**Impact**: Risk register is just documentation, not management
**Fix**: Every TREAT risk needs specific actions with owners and dates

---

## Support

For issues or questions:
- GitHub Issues: https://github.com/tractorjuice/arc-kit/issues
- Documentation: https://github.com/tractorjuice/arc-kit

---

**Last updated**: 2025-10-28
**ArcKit Version**: 0.3.6
