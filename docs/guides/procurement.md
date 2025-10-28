# Vendor Procurement Guide

A comprehensive guide to managing vendor RFPs, evaluation, and selection using ArcKit.

---

## What is Vendor Procurement?

Vendor procurement is the structured process of selecting the right vendor to deliver your solution:
1. **Statement of Work (SOW/RFP)** - Define what you need
2. **Evaluation Framework** - Create objective scoring criteria
3. **Vendor Scoring** - Evaluate each vendor proposal
4. **Vendor Comparison** - Select the best vendor

### Why Vendor Procurement Matters

Without structured procurement:
- ❌ Vendors submit incomparable proposals (different formats, missing information)
- ❌ Selection based on "gut feel" or relationships, not merit
- ❌ Requirements gaps discovered after contract signing
- ❌ No objective justification for vendor selection (audit risk)
- ❌ Price-focused decisions that ignore technical capability
- ❌ Vendor lock-in without competitive alternatives

With structured procurement:
- ✅ Standardized proposals that are easy to compare
- ✅ Objective, defensible vendor selection
- ✅ Requirements validated before contract signing
- ✅ Audit trail showing fair, merit-based selection
- ✅ Best value (technical capability + price) selection
- ✅ Competitive tension drives better proposals

**Mandatory for:**
- UK Government procurements (all values)
- EU procurement regulations (above thresholds)
- Large procurements (typically > £100K)
- Systems handling sensitive data
- Multi-year contracts
- Mission-critical systems

---

## When to Use Procurement Commands

**Generate SOW/RFP:**
```bash
/arckit.sow Generate SOW for [project name]
```

**Create Evaluation Framework:**
```bash
/arckit.evaluate Create evaluation framework for [project]
```

**Score Vendor Proposal:**
```bash
/arckit.evaluate Score [vendor name] proposal for [project]
```

**Compare Vendors:**
```bash
/arckit.evaluate Compare all vendors for [project]
```

**Run at key gates:**
- **After requirements complete** - Generate SOW
- **Before vendor outreach** - Finalize evaluation criteria
- **During proposal evaluation** - Score each vendor
- **Before selection decision** - Compare all vendors

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

## Integration with Other Requirements

### Requirements Documentation
- **Link**: [Requirements Guide](requirements.md)
- **Integration**: SOW automatically includes all requirements from requirements.md
- **Action**: Complete requirements before generating SOW

### Architecture Principles
- **Link**: [Principles Guide](principles.md)
- **Integration**: Evaluation criteria derived from architecture principles
- **Action**: Vendor proposals scored on principles compliance

### Design Reviews
- **Link**: [Design Review Guide](design-review.md)
- **Integration**: Winning vendor's HLD/DLD reviewed using design review process
- **Action**: Schedule HLD review 4 weeks after vendor selection

### Risk Management
- **Link**: [Risk Management Guide](risk-management.md)
- **Integration**: Vendor risks (lock-in, capability, financial) added to risk register
- **Action**: Document vendor-specific risks during evaluation

### Technology Code of Practice (UK Gov)
- **Link**: [Technology Code of Practice](uk-government/technology-code-of-practice.md)
- **Integration**: SOW includes TCoP compliance requirements
- **Action**: Score vendors on TCoP alignment (especially Points 4, 5, 6, 10)

### Data Protection
- **Integration**: SOW includes GDPR/data protection requirements
- **Action**: Verify vendor has Data Protection Officer and GDPR processes

---

## Procurement Checklist

### SOW/RFP Checklist
- [ ] All requirements from requirements.md included
- [ ] Scope clearly defined (in-scope and out-of-scope)
- [ ] Timeline is realistic for scope
- [ ] Budget constraints documented (if applicable)
- [ ] Deliverables specified (HLD, DLD, code, tests, docs)
- [ ] Acceptance criteria defined for each deliverable
- [ ] Evaluation criteria and weights documented
- [ ] Mandatory qualifications specified
- [ ] Contract terms reviewed by legal
- [ ] Submission deadline and format specified
- [ ] Q&A process defined

### Evaluation Checklist
- [ ] Evaluation framework approved before sending SOW
- [ ] Multiple evaluators assigned (3-5 people)
- [ ] Mandatory qualifications defined (pass/fail)
- [ ] Scoring rubric detailed with examples
- [ ] Weights assigned based on project priorities
- [ ] Conflict of interest checks completed
- [ ] Reference check questions prepared

### Vendor Scoring Checklist
- [ ] Mandatory qualifications verified (certifications, experience)
- [ ] Technical approach scored against criteria
- [ ] Team qualifications assessed
- [ ] Company experience validated
- [ ] References checked (minimum 3)
- [ ] Pricing analyzed (fixed vs T&M, breakdown)
- [ ] Risks identified and documented
- [ ] Justification provided for every score
- [ ] Strengths and weaknesses documented
- [ ] Recommendation made (select, consider, reject)

### Selection Decision Checklist
- [ ] All vendor proposals scored by multiple evaluators
- [ ] Scores averaged and normalized
- [ ] Vendor comparison matrix created
- [ ] Best value vendor identified (not just cheapest)
- [ ] Selection rationale documented
- [ ] Approval obtained from decision authority
- [ ] Unsuccessful vendors notified professionally
- [ ] Contract negotiation initiated with winning vendor

---

## Common Gaps and How to Fix Them

### Gap 1: Vague SOW
**Problem**: "Vendor should modernize the system"
**Fix**: Specific requirements, success criteria, deliverables, acceptance tests

### Gap 2: No Mandatory Qualifications
**Problem**: Unqualified vendors waste evaluation time
**Fix**: Define must-have certifications and experience upfront (PCI-DSS, 5+ similar projects)

### Gap 3: Price-Only Evaluation
**Problem**: Selecting cheapest vendor without considering capability
**Fix**: Weight technical approach 60-70%, price 10-30%

### Gap 4: No Reference Checks
**Problem**: Trusting vendor's claims without validation
**Fix**: Call 3+ references, ask specific questions about performance

### Gap 5: Subjective Scoring
**Problem**: "Architecture looks good" without criteria
**Fix**: Detailed rubric with examples for each score level

### Gap 6: Single Evaluator
**Problem**: One person's bias affects decision
**Fix**: 3-5 evaluators score independently, then discuss outliers

### Gap 7: Ignoring Red Flags
**Problem**: Accepting unrealistic timelines or unclear proposals
**Fix**: Disqualify vendors with major gaps or request clarification

### Gap 8: No Contract Flexibility
**Problem**: SOW locks in requirements that may need to change
**Fix**: Include change management process with pricing mechanism

---

## Next Steps

1. **Requirements complete?** If not, run `/arckit.requirements`
2. **Generate SOW**: Run `/arckit.sow`
3. **Legal review**: Have legal review SOW and contract terms
4. **Send to vendors**: Distribute with clear deadline and Q&A process
5. **Create evaluation criteria**: Run `/arckit.evaluate`
6. **Vendor briefing**: Hold Q&A session with vendors (optional)
7. **Score proposals**: Run `/arckit.evaluate Score [vendor]` for each vendor
8. **Reference checks**: Call references for shortlisted vendors
9. **Compare**: Run `/arckit.evaluate Compare all vendors`
10. **Select vendor**: Make decision and obtain approval
11. **Notify vendors**: Inform all vendors of decision
12. **Contract negotiation**: Negotiate terms with winning vendor
13. **Design review**: Run `/arckit.hld-review` when vendor submits HLD

---

## Related Documentation

- [Requirements Guide](requirements.md) - Create requirements before SOW
- [Design Review Guide](design-review.md) - Review winning vendor's designs
- [Principles Guide](principles.md) - Use principles in evaluation criteria
- [Risk Management Guide](risk-management.md) - Vendor risks management
- [Technology Code of Practice](uk-government/technology-code-of-practice.md) - UK Gov compliance

---

## Support

For issues or questions:
- GitHub Issues: https://github.com/tractorjuice/arc-kit/issues

---

**Remember**: Procurement decisions are expensive to reverse. Invest time in thorough evaluation. The cost of a bad vendor selection far exceeds the cost of a rigorous procurement process.

---

**Last updated**: 2025-10-28
**ArcKit Version**: 0.3.6
