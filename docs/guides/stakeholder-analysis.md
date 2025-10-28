# Stakeholder Analysis Guide

A comprehensive guide to identifying stakeholders, understanding their drivers, and mapping them to project goals using ArcKit.

---

## What is Stakeholder Analysis?

Stakeholder analysis identifies **who cares** about your project, **what drives them**, and **what outcomes will satisfy them**. It's the foundation for requirements prioritization, risk assessment, and change management.

### Why Stakeholder Analysis Matters

Without stakeholder analysis:
- ❌ Requirements don't address real stakeholder needs
- ❌ Risks miss critical stakeholder concerns
- ❌ Business cases fail to demonstrate value to key decision-makers
- ❌ Change resistance surprises you late in the project
- ❌ Success metrics don't measure what stakeholders actually care about

With stakeholder analysis:
- ✅ Requirements trace to stakeholder goals
- ✅ Risks address stakeholder concerns proactively
- ✅ Business cases speak to stakeholder priorities
- ✅ Change management anticipates and addresses resistance
- ✅ Success criteria aligned with stakeholder outcomes

---

## When to Run Stakeholder Analysis

**Run `/arckit.stakeholders` EARLY** - ideally as step 2 in your project workflow:

```
1. /arckit.principles        ← Establish governance
2. /arckit.stakeholders      ← WHO CARES AND WHY? (START HERE)
3. /arckit.risk              ← Use stakeholder concerns to identify risks
4. /arckit.sobc              ← Use stakeholder goals to build business case
5. /arckit.requirements      ← Use stakeholder needs to define requirements
```

---

## Creating Stakeholder Analysis with ArcKit

### Step 1: Ensure Principles Exist

```bash
# Check if principles are defined
ls .arckit/memory/architecture-principles.md

# If not, create them first
/arckit.principles Create principles for [your organization]
```

### Step 2: Run Stakeholder Analysis

```bash
/arckit.stakeholders Analyze stakeholders for [your project]
```

**Examples**:
```bash
/arckit.stakeholders Analyze stakeholders for cloud migration where CFO wants cost savings and Operations worries about downtime

/arckit.stakeholders Map stakeholder drivers for DWP benefits chatbot project

/arckit.stakeholders Create stakeholder engagement plan for NHS appointment booking system
```

### Step 3: Review the Output

ArcKit creates `projects/NNN-project-name/stakeholder-drivers.md` containing:

1. **Stakeholder Inventory** - Complete list of internal and external stakeholders
2. **Driver Analysis** - What motivates each stakeholder (7 driver types)
3. **Goal Mapping** - SMART goals derived from drivers
4. **Outcome Definition** - Measurable outcomes that satisfy goals
5. **Traceability Chain** - Stakeholder → Driver → Goal → Outcome
6. **Power-Interest Grid** - Who to manage closely vs keep informed
7. **Conflict Analysis** - Competing interests and resolution strategies
8. **Engagement Plan** - Communication strategies per stakeholder
9. **RACI Matrix** - Decision authority and accountability

---

## Understanding Stakeholder Drivers

ArcKit identifies 7 types of drivers that motivate stakeholders:

### 1. STRATEGIC Drivers
- Competitive advantage, market position, innovation
- Digital transformation, strategic objectives
- **Example**: CTO wants to modernize tech stack to attract talent

### 2. OPERATIONAL Drivers
- Efficiency, quality, speed, reliability
- Workload reduction, process improvement
- **Example**: Operations Director wants to reduce manual processing by 80%

### 3. FINANCIAL Drivers
- Cost reduction, revenue growth, ROI
- Budget constraints, value for money
- **Example**: CFO wants £2M annual infrastructure cost savings

### 4. COMPLIANCE Drivers
- Regulatory requirements, audit findings
- Risk mitigation, legal obligations
- **Example**: CISO must achieve Cyber Essentials Plus certification

### 5. PERSONAL Drivers
- Career advancement, reputation, skill development
- Job security, recognition
- **Example**: Project Manager wants successful delivery for promotion

### 6. RISK Drivers
- Avoiding penalties, preventing failures
- Reducing exposure, managing threats
- **Example**: CIO wants to avoid another high-profile outage

### 7. CUSTOMER Drivers
- Satisfaction, retention, acquisition
- Experience improvement, accessibility
- **Example**: Customer Service Director wants to reduce complaint calls

---

## The Traceability Chain

Every stakeholder should have a complete traceability chain:

```
Stakeholder → Driver → Goal → Outcome

Example:
CFO (Stakeholder)
  → Reduce datacenter costs (FINANCIAL Driver - HIGH intensity)
    → Reduce infrastructure costs 40% by end of Year 1 (SMART Goal)
      → £2M annual cost savings measured via FinOps dashboard (Measurable Outcome)
```

This chain ensures:
- **Requirements** address stakeholder needs
- **Risks** protect stakeholder goals
- **Business case** demonstrates value to stakeholders
- **Success metrics** measure stakeholder outcomes

---

## Power-Interest Grid

ArcKit categorizes stakeholders into 4 quadrants:

### High Power, High Interest → **MANAGE CLOSELY**
- Key decision-makers and primary beneficiaries
- Require active engagement and detailed communication
- **Example**: CIO, CFO, Project Sponsor

### High Power, Low Interest → **KEEP SATISFIED**
- Can block project but not day-to-day engaged
- Need periodic updates to maintain support
- **Example**: CEO, Board members

### Low Power, High Interest → **KEEP INFORMED**
- Affected by project but limited influence
- Need regular communication about changes
- **Example**: End users, operational teams

### Low Power, Low Interest → **MONITOR**
- Minimal impact and influence
- Basic awareness sufficient
- **Example**: Peripheral business units

---

## Stakeholder Conflict Resolution

When stakeholders have conflicting goals, ArcKit identifies conflicts and proposes resolution strategies:

### Example Conflict
- **CFO** wants minimal upfront cost (FINANCIAL)
- **Operations** wants enterprise-grade reliability (OPERATIONAL)
- **Conflict**: Cheap solution vs robust solution

### Resolution Strategies
1. **Prioritize by power/interest** - CFO has higher power, cost wins
2. **Find win-win** - Phased approach: start cheap, scale to enterprise
3. **Escalate** - Let Project Sponsor decide trade-off
4. **Data-driven** - Run POC to prove cheap solution can meet reliability SLA

---

## UK Government Context

For UK Government projects, ArcKit includes specific stakeholder categories:

### Political Stakeholders
- **Ministers** - Accountability to Parliament, manifesto commitments
- **Permanent Secretary** - Accounting Officer, NAO scrutiny
- **Senior Responsible Owner (SRO)** - Programme accountability

### Governance Stakeholders
- **HM Treasury** - Spending controls, value for money
- **CDDO** - Digital spend control, technology strategy
- **GDS** - Service Standard, service assessments
- **ICO** - Data protection compliance

### Public Stakeholders
- **Citizens/Users** - Digital inclusion, accessibility (WCAG 2.2 AA)
- **Civil Society** - Transparency, accountability
- **Media** - Public scrutiny, reputational risk

### Compliance Bodies
- **NAO (National Audit Office)** - Value for money audits
- **PAC (Public Accounts Committee)** - Parliamentary scrutiny
- **NCSC** - Cyber security requirements

---

## Using Stakeholder Analysis in Other Commands

Once you've completed stakeholder analysis, it feeds into:

### `/arckit.risk` - Risk Management
- **Every risk needs an owner** from the stakeholder RACI matrix
- Risks address stakeholder concerns (e.g., CFO cost overrun risk)
- Risk appetite varies by stakeholder

### `/arckit.sobc` - Business Case
- **Strategic Case** - Built on stakeholder pain points and drivers
- **Benefits Mapping** - Every benefit traces to a stakeholder goal
- **Management Case** - Governance from stakeholder RACI matrix
- **Economic Case** - ROI calculation uses stakeholder outcome metrics

### `/arckit.requirements` - Requirements
- Requirements prioritized by stakeholder power/interest
- Conflicts resolved using stakeholder conflict strategies
- Acceptance criteria based on stakeholder outcomes

### Change Management
- **Champions** - High interest stakeholders who support
- **Fence-sitters** - Neutral stakeholders to convert
- **Resisters** - Stakeholders with threatened drivers

---

## Common Mistakes

### 1. Skipping Stakeholder Analysis
**Mistake**: "We know what users want, let's just start requirements"
**Impact**: Requirements miss key stakeholder concerns, leading to rejection
**Fix**: Always run `/arckit.stakeholders` before `/arckit.requirements`

### 2. Only Identifying Obvious Stakeholders
**Mistake**: "It's just IT and Business"
**Impact**: Hidden stakeholders (Security, Compliance, Finance) block project late
**Fix**: Use ArcKit's comprehensive stakeholder categories

### 3. Describing Roles, Not Drivers
**Mistake**: "CFO cares about finance" (too vague)
**Impact**: Can't prioritize between conflicting requirements
**Fix**: Specific drivers like "CFO wants to reduce cloud costs 30% by Q4"

### 4. No Measurable Outcomes
**Mistake**: "CFO wants cost savings" (not measurable)
**Impact**: Can't prove project success to CFO
**Fix**: "CFO wants £2M annual savings measured via FinOps dashboard"

### 5. Ignoring Low-Power Stakeholders
**Mistake**: "End users have no power, we can ignore them"
**Impact**: User rebellion tanks adoption, project fails
**Fix**: Keep informed, involve in design, address accessibility needs

---

## Best Practices

### 1. Interview Stakeholders Directly
Don't guess what stakeholders want - ask them:
- What problems are you trying to solve?
- What does success look like for you?
- What are your constraints?
- What keeps you up at night?

### 2. Document Intensity Levels
Not all drivers are equal:
- **CRITICAL** - Will block project if not addressed
- **HIGH** - Major concern, needs mitigation plan
- **MEDIUM** - Important, should address if possible
- **LOW** - Nice to have, consider if no cost

### 3. Update Throughout Project
Stakeholder analysis isn't static:
- Drivers change (new CFO, different priorities)
- New stakeholders emerge (regulator attention)
- Conflicts resolve or escalate
- Update quarterly or when major changes occur

### 4. Use for Risk Management
Stakeholder concerns = Risk sources:
- CFO cost concern → Cost overrun risk
- Operations downtime concern → Availability risk
- CISO security concern → Breach risk

### 5. Link to Requirements
Every requirement should trace to a stakeholder:
- **No stakeholder = Question if requirement is needed**
- **Low-power stakeholder = Low priority requirement**
- **High-power stakeholder = MUST requirement**

---

## Example Output

When you run `/arckit.stakeholders`, you get a structured document like:

```markdown
# Stakeholder Drivers & Goals Analysis

## Executive Summary
- 12 stakeholders identified (6 internal, 6 external)
- 18 drivers across 7 categories
- 4 critical conflicts requiring resolution
- 15 SMART goals with measurable outcomes

## Stakeholder Inventory

### S-001: Chief Financial Officer (CFO)
- **Role**: Financial accountability
- **Power/Interest**: HIGH POWER, HIGH INTEREST → Manage Closely
- **Driver D-001** (FINANCIAL, HIGH): Reduce cloud costs 30% by Q4 2025
  - **Goal G-001**: Migrate 80% workloads to reserved instances
  - **Outcome O-001**: £2M annual savings via FinOps dashboard
- **Driver D-002** (RISK, MEDIUM): Avoid budget overruns
  - **Goal G-002**: Implement cost anomaly detection
  - **Outcome O-002**: Zero budget surprises >£100K

### S-002: Operations Director
- **Role**: Service reliability
- **Power/Interest**: HIGH POWER, HIGH INTEREST → Manage Closely
- **Driver D-003** (OPERATIONAL, CRITICAL): Maintain 99.95% uptime
  - **Goal G-003**: Zero unplanned downtime during migration
  - **Outcome O-003**: 99.95% uptime SLA maintained
...

## Conflicts
### C-001: Cost vs Reliability
- **Stakeholders**: CFO (S-001) vs Operations (S-002)
- **Conflict**: CFO wants minimal cloud costs vs Operations wants multi-AZ
- **Resolution**: Phased approach - Single AZ for dev, Multi-AZ for prod
...
```

---

## Integration with Project Workflow

Stakeholder analysis creates the foundation for your entire project:

```
stakeholder-drivers.md
  ↓ (stakeholder concerns)
risk-register.md
  ↓ (risks inform business case)
sobc.md (business case)
  ↓ (if approved)
requirements.md
  ↓ (requirements based on stakeholder goals)
data-model.md
  ↓
...rest of workflow
```

**Without stakeholder analysis**, you're building in the dark.
**With stakeholder analysis**, every decision is traceable to stakeholder value.

---

## Support

For issues or questions:
- GitHub Issues: https://github.com/tractorjuice/arc-kit/issues
- Documentation: https://github.com/tractorjuice/arc-kit

---

**Last updated**: 2025-10-28
**ArcKit Version**: 0.3.6
