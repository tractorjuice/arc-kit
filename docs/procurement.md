# Vendor Procurement Guide

Complete guide to managing vendor RFPs, evaluation, and selection using ArcKit.

---

## Overview

ArcKit streamlines vendor procurement through three commands:
1. **`/arckit.sow`** - Generate Statement of Work / RFP
2. **`/arckit.evaluate`** - Create evaluation framework and score vendors
3. **`/arckit.evaluate`** (compare mode) - Compare multiple vendors

---

## Step 1: Generate RFP/SOW

### Prerequisites

- ✅ Architecture principles defined (`/arckit.principles`)
- ✅ Comprehensive requirements documented (`/arckit.requirements`)

### Generate SOW

```bash
/arckit.sow Generate SOW for [project name]
```

**Example**:
```bash
/arckit.sow Generate RFP for payment gateway modernization with 12-month timeline
```

### What Gets Generated

The SOW includes:

1. **Executive Summary**
   - Project overview and business objectives
   - Expected outcomes and ROI
   - Key success criteria

2. **Scope of Work**
   - What's in scope (explicit list)
   - What's out of scope (explicit list)
   - Assumptions and constraints

3. **Requirements** (imported from requirements.md)
   - All BR, FR, NFR, INT, DR requirements
   - Clearly marked MUST/SHOULD/MAY
   - Acceptance criteria for each

4. **Deliverables**
   - High-Level Design (HLD) with diagrams
   - Detailed Design (DLD) with specs
   - Source code and documentation
   - Test plans and results
   - Deployment runbooks
   - Training materials
   - Warranty terms

5. **Timeline and Milestones**
   - Suggested project phases
   - Key decision gates
   - Review and approval gates

6. **Vendor Qualifications**
   - Required certifications
   - Team experience requirements
   - Financial stability requirements

7. **Proposal Requirements**
   - Technical approach
   - Team composition
   - Project timeline
   - Pricing breakdown
   - Risk mitigation

8. **Evaluation Criteria**
   - Scoring methodology
   - Weighting (technical vs cost)

9. **Contract Terms**
   - Payment terms
   - Acceptance criteria
   - Change management
   - IP rights
   - Warranties

### Review and Customize

Output location: `projects/NNN-project-name/sow.md`

**Review checklist**:
- [ ] All requirements from requirements.md included
- [ ] Scope is clear and unambiguous
- [ ] Timeline is realistic
- [ ] Budget constraints mentioned (if any)
- [ ] Evaluation criteria aligned with priorities
- [ ] Contract terms reviewed by legal

### Send to Vendors

Distribute SOW/RFP to qualified vendors with:
- Submission deadline (typically 4-6 weeks)
- Q&A process (bidder questions due 2 weeks before deadline)
- Format requirements (PDF, max pages)
- Point of contact for questions

---

## Step 2: Create Evaluation Framework

### Generate Evaluation Criteria

```bash
/arckit.evaluate Create evaluation framework for [project]
```

**Example**:
```bash
/arckit.evaluate Create evaluation framework for payment gateway project
```

### What Gets Generated

**Mandatory Qualifications** (Pass/Fail):
- Required certifications (PCI-DSS, ISO 27001, SOC 2)
- Minimum experience (e.g., 5+ similar projects)
- Financial stability (credit rating, revenue)
- References (3+ from similar projects)

Any vendor failing mandatory qualifications is **disqualified** immediately.

**Scoring Criteria** (100 points total):

| Category | Weight | Max Points |
|----------|--------|------------|
| Technical Approach & Solution Design | 35% | 35 |
| Project Approach & Methodology | 20% | 20 |
| Team Qualifications & Experience | 25% | 25 |
| Company Experience & References | 10% | 10 |
| Pricing & Value | 10% | 10 |

**Detailed Scoring Rubric**:

Each category has specific criteria:

```markdown
### Technical Approach (35 points)

**Architecture Design** (15 points):
- 15: Cloud-native, highly scalable, aligns perfectly with principles
- 10: Good architecture with minor concerns
- 5: Acceptable but significant gaps
- 0: Poor architecture or major violations

**Technology Stack** (10 points):
- 10: All approved technologies, modern stack
- 7: Mostly approved with justified exceptions
- 3: Some unapproved technologies
- 0: Primarily unapproved or legacy stack

**Security Approach** (10 points):
- 10: Comprehensive security, exceeds requirements
- 7: Meets all security requirements
- 3: Meets most security requirements
- 0: Significant security gaps
```

### Customize Evaluation Criteria

Adjust weights based on priorities:
- **Innovation project**: Weight technical approach higher (45%)
- **Cost-sensitive**: Weight pricing higher (20%)
- **High-risk project**: Weight team experience higher (35%)

---

## Step 3: Score Vendor Proposals

### Score Individual Vendor

```bash
/arckit.evaluate Score [vendor name] proposal for [project]
```

**Example**:
```bash
/arckit.evaluate Score Acme Payment Solutions proposal for payment gateway
```

### Evaluation Process

**1. Mandatory Qualifications Check**:
```markdown
## Mandatory Qualifications: Acme Payment Solutions

- [x] PCI-DSS Level 1 Certified (expires 2026-03-15)
- [x] 5+ similar projects (provided 7 references)
- [x] $50M+ annual revenue (FY2024: $85M)
- [x] 3+ references (provided 5, all positive)

**Result**: PASS - Proceeds to scoring
```

If any box is unchecked → **DISQUALIFIED**

**2. Detailed Scoring**:

For each category, score objectively with justification:

```markdown
### Technical Approach: 28/35

**Architecture Design**: 12/15
- Cloud-native AWS architecture
- Good use of serverless (Lambda, API Gateway)
- **Concern**: Single-region deployment (needs multi-region for 99.99% SLA)
- **Justification**: Strong architecture but DR strategy incomplete

**Technology Stack**: 8/10
- Approved: Python, PostgreSQL, Redis, Kafka
- **Minor concern**: Using older Python 3.9 (recommend 3.11+)

**Security Approach**: 8/10
- OAuth 2.0 + JWT implemented
- PCI-DSS compliant architecture
- **Gap**: Missing WAF/rate limiting details
```

**3. Final Scoring**:

```markdown
## Overall Score: 76/100

| Category | Score | Max | Percentage |
|----------|-------|-----|------------|
| Technical Approach | 28 | 35 | 80% |
| Project Approach | 16 | 20 | 80% |
| Team Qualifications | 20 | 25 | 80% |
| Company Experience | 8 | 10 | 80% |
| Pricing | 4 | 10 | 40% |
| **TOTAL** | **76** | **100** | **76%** |

**Pricing**: $850K (above budget of $600K)
```

**4. Strengths and Weaknesses**:

```markdown
## Strengths

1. **Strong PCI-DSS expertise**: Team has 10+ years payment processing experience
2. **Good reference projects**: 5 references, all rated vendor 9+/10
3. **Modern architecture**: Cloud-native, microservices approach
4. **Clear methodology**: Agile with 2-week sprints, daily standups

## Weaknesses

1. **Above budget**: $850K vs $600K budget (42% over)
2. **Single-region DR**: Needs multi-region for 99.99% uptime requirement
3. **Limited cloud experience**: Only 2 years with AWS (prefer 5+)
4. **Aggressive timeline**: 6 months seems unrealistic for scope

## Risks

- **HIGH**: Cost overruns likely given aggressive timeline
- **MEDIUM**: DR strategy insufficient for uptime SLA
- **LOW**: Team turnover (3 team members, no bench strength mentioned)
```

**5. Recommendation**:

```markdown
## Recommendation: CONSIDER

**Summary**: Acme has strong technical capabilities and excellent references,
but pricing significantly exceeds budget and timeline seems aggressive.

**Conditions for Selection**:
1. Negotiate price down to $700K (15% reduction)
2. Extend timeline to 9 months (more realistic)
3. Require multi-region DR architecture
4. Add WAF and rate limiting to design

**Alternative**: If price negotiation fails, recommend BestPay Solutions
(score: 82/100, price: $620K)
```

---

## Step 4: Compare Multiple Vendors

### Generate Comparison

```bash
/arckit.evaluate Compare all vendors for [project]
```

**Example**:
```bash
/arckit.evaluate Compare all vendors for payment gateway project
```

### Comparison Matrix

```markdown
## Vendor Comparison: Payment Gateway Modernization

| Criterion | Acme Corp | BestPay | CloudPayments |
|-----------|-----------|---------|---------------|
| **Overall Score** | 76/100 | 82/100 | 71/100 |
| **Price** | $850K | $620K | $750K |
| **Timeline** | 6 months | 9 months | 8 months |
| **Technical** | 28/35 (80%) | 30/35 (86%) | 25/35 (71%) |
| **Team** | 20/25 (80%) | 22/25 (88%) | 18/25 (72%) |
| **Experience** | 8/10 (80%) | 9/10 (90%) | 7/10 (70%) |
| **Price Score** | 4/10 (40%) | 9/10 (90%) | 6/10 (60%) |

## Detailed Comparison

### Technical Approach

**BestPay** (Winner): Multi-region AWS, comprehensive DR, best security approach
**Acme**: Good architecture but single-region
**CloudPayments**: Hybrid cloud approach, less mature

### Team Qualifications

**BestPay** (Winner): 15 years payment experience, strong bench
**Acme**: Good team but small (3 people)
**CloudPayments**: Large team but less payment-specific experience

### Pricing

**BestPay** (Winner): $620K - within budget, fixed price
**CloudPayments**: $750K - over budget but reasonable
**Acme**: $850K - significantly over budget

## Recommendation

### 1st Choice: BestPay Solutions

**Score**: 82/100
**Price**: $620K (within budget)
**Timeline**: 9 months (realistic)

**Strengths**:
- Highest technical score
- Best team qualifications
- Strong payment processing experience
- Within budget
- Multi-region architecture included

**Risks**:
- Longer timeline (9 vs 6 months)
- Not the cheapest (but best value)

**Conditions**:
- None - proposal is acceptable as-is

### 2nd Choice: Acme Corp (if price negotiated)

**Score**: 76/100
**Price**: $850K → Target $700K
**Timeline**: 6 months → Recommend 9 months

**Only if**:
- Price reduced to $700K
- Timeline extended to 9 months
- Multi-region DR added

### Not Recommended: CloudPayments

**Score**: 71/100
**Reasons**:
- Lowest technical score
- Hybrid cloud approach doesn't align with cloud-first principle
- Team lacks payment-specific experience
- Over budget with less capability than BestPay
```

---

## Best Practices

### 1. Objective Scoring

- ✅ Use documented criteria
- ✅ Require justification for every score
- ✅ Reference specific requirements
- ❌ No arbitrary "gut feel" scores

### 2. Blind Evaluation (if possible)

- Evaluate technical approach before seeing price
- Prevents price bias in technical scoring

### 3. Multiple Evaluators

- 3-5 evaluators score independently
- Average scores for objectivity
- Discuss outliers

### 4. Document Everything

- All vendor communications
- Q&A responses
- Evaluation notes
- Rationale for selection/rejection

### 5. Reference Checks

- Call all provided references
- Ask specific questions:
  - "Would you hire this vendor again?"
  - "Were they on time and on budget?"
  - "How did they handle problems?"
  - "Any concerns we should know about?"

### 6. Legal Review

- Have legal review SOW before sending
- Have legal review contract terms
- Ensure IP ownership is clear
- Include termination clauses

---

## Common Pitfalls

### 1. Choosing Lowest Price

❌ Cheapest vendor often = highest risk
✅ Choose best value (score + price combined)

### 2. No Mandatory Qualifications

❌ Evaluating unqualified vendors wastes time
✅ Disqualify early if missing certifications/experience

### 3. Vague Evaluation Criteria

❌ "Good architecture" - what does that mean?
✅ Specific criteria: multi-region, auto-scaling, cloud-native

### 4. No Reference Checks

❌ Trust vendor's claims
✅ Verify with actual customers

### 5. Ignoring Red Flags

- Unrealistic timeline
- Team that's too small
- No similar project experience
- Unclear pricing

---

## Timeline

**Typical vendor procurement timeline**:

| Phase | Duration | Activities |
|-------|----------|------------|
| **Requirements** | 2-4 weeks | Define requirements with stakeholders |
| **SOW Creation** | 1 week | Generate and review RFP document |
| **Vendor Outreach** | 1 week | Identify and contact qualified vendors |
| **Proposal Period** | 4-6 weeks | Vendors prepare proposals |
| **Q&A** | 2 weeks | Answer bidder questions |
| **Evaluation** | 2 weeks | Score proposals, reference checks |
| **Presentations** | 1 week | Shortlisted vendors present |
| **Selection** | 1 week | Final decision and negotiations |
| **Contract** | 2-4 weeks | Legal review and signing |
| **TOTAL** | **3-4 months** | Requirements to contract signing |

---

## Next Steps

1. **Requirements complete?** If not, run `/arckit.requirements`
2. **Generate SOW**: Run `/arckit.sow`
3. **Legal review**: Have legal review SOW
4. **Send to vendors**: Distribute with clear deadline
5. **Create evaluation criteria**: Run `/arckit.evaluate`
6. **Score proposals**: Run `/arckit.evaluate Score [vendor]` for each
7. **Compare**: Run `/arckit.evaluate Compare all vendors`
8. **Select vendor**: Make decision and notify
9. **Design review**: Run `/arckit.hld-review` when vendor submits HLD

---

## Related Documentation

- [Requirements Guide](requirements.md) - Create requirements before SOW
- [Design Review Guide](design-review.md) - Review winning vendor's designs
- [Principles Guide](principles.md) - Use principles in evaluation criteria

---

**Remember**: Procurement decisions are expensive to reverse. Invest time in thorough evaluation.
