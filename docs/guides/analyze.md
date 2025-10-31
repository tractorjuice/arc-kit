# Project Analysis Guide

A guide to running comprehensive quality analysis on projects using ArcKit.

---

## What is Project Analysis?

Project analysis provides a **health check** across all dimensions of project quality:
- Requirements coverage and completeness
- Risk management effectiveness
- Traceability integrity
- Compliance status
- Architecture quality
- Stakeholder alignment

### Why Run Analysis?

Without regular analysis:
- ❌ Hidden requirements gaps discovered late
- ❌ Unmitigated risks materialize
- ❌ Traceability breaks lead to audit failures
- ❌ Compliance issues discovered at gates
- ❌ Architecture drift goes unnoticed

With regular analysis:
- ✅ Early detection of issues
- ✅ Proactive risk mitigation
- ✅ Continuous compliance
- ✅ Audit-ready traceability
- ✅ Quality visibility for stakeholders

---

## When to Analyze

```bash
/arckit.analyze Run comprehensive analysis for [your project]
```

**Run analysis at these key points:**
- **Weekly** - During active development
- **Before gates** - Discovery, Alpha, Beta, Live assessments
- **Before reviews** - HLD/DLD reviews, design reviews
- **After major changes** - Architecture changes, new requirements
- **On demand** - When stakeholders request quality report

---

## What Gets Analyzed

### 1. Requirements Coverage

Analyzes completeness and quality of requirements:

**Checks:**
- All requirement types present (BR, FR, NFR, INT, DR)
- Requirements properly formatted with unique IDs
- MoSCoW prioritization assigned
- Acceptance criteria defined
- Stakeholder mapping complete
- No duplicate or conflicting requirements

**Output:**
```markdown
### Requirements Coverage: 85/100

**Strengths**:
- 45 functional requirements well-defined
- All requirements have acceptance criteria
- MoSCoW prioritization complete

**Gaps**:
- ❌ Missing NFR-A-001 to NFR-A-005 (accessibility requirements)
- ⚠️ Only 3 data requirements (expect 8-12 for e-commerce)
- ⚠️ No integration requirements for payment gateway

**Recommendations**:
1. Add WCAG 2.2 AA accessibility requirements (UK Gov mandatory)
2. Document GDPR data requirements (retention, consent, erasure)
3. Define Stripe integration requirements (API contracts)
```

### 2. Risk Assessment

Analyzes risk register completeness and mitigation:

**Checks:**
- All risk categories covered (Technical, Business, External, People, Compliance, Security)
- Risk assessment methodology used (5×5 matrix)
- High risks have mitigation plans
- Risk owners assigned
- Residual risk within appetite
- Review dates tracked

**Output:**
```markdown
### Risk Assessment: 72/100

**Risk Register**: 15 risks identified

**Risk Distribution**:
- HIGH: 3 risks (2 mitigated, 1 open ⚠️)
- MEDIUM: 8 risks (6 mitigated, 2 tolerated)
- LOW: 4 risks (tolerated)

**Critical Findings**:
- ❌ RISK-007 (HIGH) - No mitigation plan for vendor lock-in
- ⚠️ RISK-003 (MEDIUM) - GDPR compliance risk owner TBD
- ✅ All technical risks have mitigations

**Recommendations**:
1. Create mitigation plan for RISK-007 (vendor lock-in)
   - Consider multi-cloud or abstraction layer
   - Document exit strategy
2. Assign GDPR compliance risk to Data Protection Officer
3. Schedule quarterly risk reviews (currently missing)
```

### 3. Traceability Integrity

Analyzes traceability between artifacts:

**Checks:**
- Stakeholders → Drivers → Goals → Outcomes chain
- Requirements → Design → Implementation → Tests
- Risks → Mitigations → Controls
- Principles → Architecture decisions
- No orphan artifacts (untraced elements)

**Output:**
```markdown
### Traceability: 78/100

**Traceability Chains**:
- Stakeholder → Requirements: 95% traced ✅
- Requirements → Design: 82% traced ⚠️
- Requirements → Tests: 65% traced ❌
- Risks → Mitigations: 90% traced ✅

**Orphan Artifacts**:
- ❌ 8 requirements not traced to design components
- ❌ 15 requirements not traced to tests
- ⚠️ 2 design components don't trace to requirements

**Recommendations**:
1. Map FR-012 to FR-019 to HLD components
2. Create test cases for NFR-P-001 to NFR-P-005
3. Justify design components: PaymentRetryService, NotificationQueue
```

### 4. Compliance Status

Analyzes compliance with standards and regulations:

**UK Government Checks:**
- Technology Code of Practice (TCoP) 13 points
- GDPR compliance (if handling personal data)
- Accessibility (WCAG 2.2 AA)
- Security (Cyber Essentials baseline)
- Service Standard (if public-facing)

**General Checks:**
- PCI-DSS (if handling payment cards)
- ISO 27001 (if required)
- Industry-specific regulations

**Output:**
```markdown
### Compliance: 68/100

**UK Government TCoP**:
- Point 1 (Users first): ✅ User research documented
- Point 2 (Multidisciplinary team): ✅ Team defined
- Point 3 (Agile): ✅ Agile ceremonies documented
- Point 4 (Open standards): ⚠️ API standards TBD
- Point 5 (Open source): ✅ Using Python, PostgreSQL
- Point 6 (Make things secure): ❌ No threat model
- Point 7 (Privacy integral): ⚠️ PIA not started
- Point 8 (Accessible): ❌ No accessibility testing
- Point 9 (One login): N/A (internal system)
- Point 10 (Cloud first): ✅ AWS architecture
- Point 11 (Sustainability): ⚠️ Not addressed
- Point 12 (Open data): N/A
- Point 13 (Common platforms): ✅ Using GDS patterns

**Critical Gaps**:
- ❌ No STRIDE threat model (TCoP Point 6)
- ❌ No accessibility requirements or testing (TCoP Point 8)
- ⚠️ Privacy Impact Assessment not started (TCoP Point 7)

**GDPR**:
- ⚠️ Data retention policy missing
- ⚠️ Right to erasure not documented
- ✅ Consent mechanism defined

**Recommendations**:
1. Run STRIDE threat modeling workshop
2. Add WCAG 2.2 AA requirements and testing
3. Complete Privacy Impact Assessment
4. Document data retention policy (7 years for financial records)
```

### 5. Architecture Quality

Analyzes architecture against principles and best practices:

**Checks:**
- Architecture principles compliance
- Scalability strategy
- Security design
- Resilience and disaster recovery
- Technology stack alignment
- No anti-patterns
- Documentation completeness

**Output:**
```markdown
### Architecture Quality: 75/100

**Principles Compliance**:
- CLOUD-001 (Cloud-first): ✅ AWS cloud-native
- API-001 (API-first): ✅ OpenAPI specs
- SEC-001 (Security by design): ⚠️ Missing threat model
- DATA-001 (Data integrity): ✅ ACID transactions
- SCALE-001 (Horizontal scaling): ✅ Auto-scaling groups

**Architecture Scores**:
- Scalability: 8/10 (good horizontal scaling, some DB concerns)
- Security: 6/10 (needs threat model, WAF)
- Resilience: 7/10 (multi-AZ but single-region)
- Maintainability: 8/10 (clean microservices)

**Anti-Patterns Detected**:
- ⚠️ Distributed Monolith: Services share database tables
- ⚠️ Chatty APIs: 12 calls for single user action

**Recommendations**:
1. Each microservice needs own database schema
2. Implement Backend for Frontend (BFF) pattern
3. Add threat model and WAF
4. Consider multi-region for 99.99% uptime
```

### 6. Stakeholder Alignment

Analyzes alignment between stakeholder goals and project direction:

**Checks:**
- All stakeholders have drivers documented
- Drivers map to goals
- Goals have measurable outcomes
- High-intensity drivers addressed
- Power-interest grid complete
- Communication plan defined

**Output:**
```markdown
### Stakeholder Alignment: 82/100

**Stakeholder Coverage**: 8 stakeholders documented ✅

**Driver Analysis**:
- HIGH intensity drivers: 5 (4 addressed, 1 gap)
- MEDIUM intensity drivers: 8 (all addressed)
- LOW intensity drivers: 3 (all addressed)

**Critical Gap**:
- ❌ CFO's FINANCIAL driver (Reduce costs 40%) not addressed
  - Current architecture: Cloud costs higher than on-prem
  - Missing: Cost optimisation strategy
  - Impact: Business case at risk

**Power-Interest Quadrants**:
- Manage Closely (High/High): 3 stakeholders ✅
- Keep Satisfied (Low/High): 2 stakeholders ✅
- Keep Informed (High/Low): 2 stakeholders ✅
- Monitor (Low/Low): 1 stakeholder ✅

**Recommendations**:
1. Address CFO cost concern:
   - Document FinOps strategy
   - Use reserved instances, spot instances
   - Add cost monitoring dashboard
2. Update business case with TCO comparison
```

### 7. Documentation Completeness

Analyzes project documentation:

**Checks:**
- Architecture principles documented
- Requirements documented
- Risk register maintained
- Design documentation (HLD/DLD)
- Test strategy defined
- Deployment procedures
- Runbooks for operations

**Output:**
```markdown
### Documentation: 70/100

**Present**:
- ✅ Architecture principles (12 principles)
- ✅ Requirements register (45 requirements)
- ✅ Risk register (15 risks)
- ✅ HLD approved
- ✅ DLD in progress

**Missing**:
- ❌ Test strategy not documented
- ❌ Deployment procedures missing
- ❌ Runbooks not created
- ⚠️ ADRs (Architecture Decision Records) sparse

**Recommendations**:
1. Document test strategy (unit, integration, performance, security)
2. Create deployment runbook (blue-green strategy)
3. Create operational runbooks (incident response, DR)
4. Use ADRs for major technical decisions
```

---

## Analysis Output

The analysis produces a comprehensive quality report:

```markdown
# Project Quality Analysis Report
**Project**: Payment Gateway Integration
**Date**: 2024-10-28
**Status**: AMBER (Proceed with Conditions)

---

## Executive Summary

**Overall Quality Score**: 74/100 (AMBER)

The project shows good progress with strong requirements and design, but has
critical gaps in compliance (threat modeling, accessibility) and cost alignment
(CFO's cost reduction goal not addressed).

**Recommendation**: Proceed to implementation with conditions below addressed.

---

## Dimension Scores

| Dimension | Score | Status | Priority |
|-----------|-------|--------|----------|
| Requirements Coverage | 85/100 | 🟢 GREEN | Medium |
| Risk Assessment | 72/100 | 🟡 AMBER | High |
| Traceability Integrity | 78/100 | 🟡 AMBER | Medium |
| Compliance Status | 68/100 | 🔴 RED | **CRITICAL** |
| Architecture Quality | 75/100 | 🟡 AMBER | High |
| Stakeholder Alignment | 82/100 | 🟢 GREEN | High |
| Documentation | 70/100 | 🟡 AMBER | Low |

**Overall**: 74/100 🟡 AMBER

---

## Critical Issues (Must Fix Before Launch)

### [CRITICAL-01] Missing Threat Model (TCoP Point 6)
**Impact**: Non-compliant with UK Government TCoP, security risks
**Action**: Run STRIDE threat modeling workshop
**Owner**: Security Architect
**Due**: 2024-11-15

### [CRITICAL-02] No Accessibility Requirements (TCoP Point 8)
**Impact**: Non-compliant with WCAG 2.2 AA, legal risk
**Action**: Add accessibility requirements and testing plan
**Owner**: Product Owner
**Due**: 2024-11-15

### [CRITICAL-03] CFO Cost Goal Not Addressed
**Impact**: Business case at risk, stakeholder misalignment
**Action**: Document FinOps strategy, update business case with TCO
**Owner**: Enterprise Architect
**Due**: 2024-11-20

---

## High Priority Issues (Should Fix)

### [HIGH-01] Vendor Lock-in Risk Not Mitigated
**Impact**: RISK-007 remains high, exit strategy unclear
**Action**: Create multi-cloud abstraction or exit plan
**Owner**: Tech Lead
**Due**: 2024-12-01

### [HIGH-02] Test Coverage Gaps
**Impact**: 35% of requirements not traced to tests
**Action**: Create test cases for NFR-P-001 to NFR-P-005, FR-012 to FR-019
**Owner**: QA Lead
**Due**: 2024-12-15

---

## Medium Priority Improvements

### [MEDIUM-01] Privacy Impact Assessment
**Action**: Complete PIA for GDPR compliance
**Owner**: Data Protection Officer
**Due**: 2025-01-15

### [MEDIUM-02] Distributed Monolith Anti-Pattern
**Action**: Separate microservice databases (each service own schema)
**Owner**: Tech Lead
**Timeline**: Refactor in Phase 2

---

## Strengths

- ✅ Strong requirements definition (85/100)
- ✅ Good stakeholder engagement (82/100)
- ✅ Solid architecture foundation (75/100)
- ✅ Clear HLD and DLD documentation

---

## Next Steps

1. Address CRITICAL issues before launch (3 issues)
2. Resolve HIGH priority issues in current phase (2 issues)
3. Plan MEDIUM priority improvements for next phase (2 issues)
4. Re-run analysis after issues addressed
5. Schedule weekly analysis during active development

---

## Trend Analysis

| Dimension | Last Week | This Week | Trend |
|-----------|-----------|-----------|-------|
| Requirements | 82/100 | 85/100 | ↗️ Improving |
| Risks | 75/100 | 72/100 | ↘️ Declining |
| Traceability | 75/100 | 78/100 | ↗️ Improving |
| Compliance | 65/100 | 68/100 | ↗️ Improving |

**Note**: Risk score declined due to new unmitigated RISK-007 (vendor lock-in).
```

---

## Integration with Other Requirements

Project analysis integrates with and validates other ArcKit artifacts:

### Links to Architecture Principles

**Analysis validates compliance with principles:**
- Security principles → Security requirements coverage
- Performance principles → NFR-P requirements quality
- Data principles → Data requirements completeness
- Cloud principles → Infrastructure requirements
- API principles → Integration requirements

**Example:**
If principle SEC-001 states "Zero Trust Architecture", analysis checks:
- ✅ NFR-S requirements enforce least privilege
- ✅ All API integrations use authentication
- ✅ No implicit trust relationships in architecture

**Action:** Analysis flags principle violations as high-priority issues.

### Links to Stakeholder Analysis

**Analysis validates stakeholder alignment:**
- Business requirements → Stakeholder goals (G-xxx)
- Success metrics → Stakeholder outcomes (O-xxx)
- Priority conflicts → Stakeholder driver conflicts
- Risk tolerance → Stakeholder concerns

**Example:**
If CFO has goal "G-1: Reduce costs 40%", analysis checks:
- ✅ Business requirements include cost reduction (BR-003)
- ✅ Success metrics measure TCO
- ✅ Architecture decisions favor cost over features

**Action:** Analysis identifies unaddressed stakeholder goals as gaps.

### Links to Risk Register

**Analysis validates risk management:**
- All CRITICAL/HIGH risks have mitigation plans
- Residual risk scores are acceptable
- Risk owners are assigned and active
- Risk-related requirements exist (e.g., RISK-005 → NFR-R-002)

**Example:**
If RISK-007 is "Vendor lock-in (HIGH)", analysis checks:
- ⚠️ No INT requirements for abstraction layer
- ⚠️ No multi-cloud architecture in design
- ⚠️ Mitigation plan is "TBD"

**Action:** Analysis flags unmitigated high risks as blockers.

### Links to Business Case (SOBC)

**Analysis validates business case assumptions:**
- Requirements align with benefits claimed in Economic Case
- Risks identified match Management Case (Part E)
- Compliance requirements support Strategic Case
- Costs are reasonable given scope

**Example:**
If SOBC claims "£500K annual savings from automation", analysis checks:
- ✅ Functional requirements include automation (FR-015 to FR-022)
- ⚠️ No success metrics to measure savings (missing BR-xxx)
- ❌ No data requirements for reporting savings

**Action:** Analysis validates business case is achievable given current scope.

### Links to Requirements

**Analysis validates requirements quality:**
- All requirement types present (BR, FR, NFR, INT, DR)
- Unique IDs with no duplicates
- Acceptance criteria defined and testable
- MoSCoW prioritization complete
- No orphan requirements

**Example:**
If requirements.md has 45 FR but only 3 DR:
- ⚠️ Data requirements likely incomplete
- ⚠️ Expect 8-12 DR for typical system
- ⚠️ GDPR/data protection not fully addressed

**Action:** Analysis recommends adding missing requirement types.

### Links to Data Model

**Analysis validates data completeness:**
- All DR-xxx requirements have corresponding entities
- PII inventory matches GDPR requirements
- Data governance roles assigned
- No orphan entities (entities not required by any DR-xxx)

**Example:**
If DR-005 requires "Customer payment history", analysis checks:
- ✅ Entity E-004 (PaymentHistory) exists
- ✅ PII classification documented
- ✅ Retention schedule defined (7 years)

**Action:** Analysis flags data model gaps as high-priority.

### Links to Design Reviews

**Analysis validates architecture quality:**
- HLD addresses all non-functional requirements
- DLD provides implementation details for all FR
- Architecture aligns with principles
- Design decisions documented and rationale clear

**Example:**
If NFR-P-001 requires "< 200ms response time", analysis checks:
- ✅ HLD includes caching strategy
- ✅ DLD specifies Redis configuration
- ⚠️ No load testing plan in review checklist

**Action:** Analysis ensures design reviews are comprehensive.

### Links to Traceability

**Analysis uses traceability matrix:**
- Requirements → Design elements (coverage %)
- Requirements → Tests (validation %)
- Gaps identified and tracked
- Orphans flagged

**Example:**
Traceability matrix shows:
- ✅ 42/45 FR have design elements (93%)
- ⚠️ 35/45 FR have tests (78%)
- ❌ FR-012, FR-019, FR-031 have no tests

**Action:** Analysis identifies untested requirements as gaps.

### Integration Summary

**Analysis is the validation layer that ensures:**
1. **Principles** → Requirements → Design → Tests (vertical alignment)
2. **Stakeholders** → Goals → Requirements → Benefits (horizontal traceability)
3. **Risks** → Mitigations → Requirements → Architecture (risk-driven design)
4. **Compliance** → Requirements → Design → Evidence (audit readiness)

**Without analysis, these connections break and project quality suffers.**

---

## Best Practices

### 1. Run Analysis Regularly

**Frequency:**
- Weekly during active development
- Before all quality gates
- After major changes

**Benefit**: Early detection, not late surprises

### 2. Track Issues to Resolution

- Assign owners for all issues
- Set due dates
- Track in project management tool
- Don't let issues languish

### 3. Use Scores as Conversation Starters

- Don't obsess over exact numbers
- Use to identify focus areas
- Discuss trends with team

### 4. Integrate with Governance

- Share analysis reports with governance board
- Use for gate decision-making
- Track improvement over time

---

## Common Gaps and How to Fix Them

### Gap 1: Incomplete Requirements Coverage

**Symptom:**
- Analysis shows "Missing NFR-A-001 to NFR-A-005"
- Requirements score < 70/100
- Only 3 data requirements for complex system

**Why It Happens:**
- Teams focus on functional requirements
- Non-functional requirements overlooked
- Data/integration requirements left to "implementation"

**How to Fix:**
1. Run `/arckit.requirements` with comprehensive template
2. Explicitly address all requirement types:
   - BR (Business): 5-10 requirements
   - FR (Functional): 20-50 requirements
   - NFR (Non-Functional): 15-25 requirements (P, S, R, SC, U, M, A)
   - INT (Integration): 3-8 per external system
   - DR (Data): 8-15 requirements for GDPR/data protection
3. Review each section with stakeholders
4. Don't skip acceptance criteria

**Prevention:** Use the requirements template checklist before running analysis.

### Gap 2: Unmitigated High/Critical Risks

**Symptom:**
- Analysis shows "3 CRITICAL risks with no mitigation"
- Risk score < 60/100
- Mitigation plans say "TBD" or "Under discussion"

**Why It Happens:**
- Risk workshops identify risks but don't assign owners
- Mitigation planning deferred to "later"
- No governance forcing mitigation

**How to Fix:**
1. For each CRITICAL/HIGH risk, immediately:
   - Assign owner (named person from RACI)
   - Set mitigation due date (before next gate)
   - Choose 4Ts strategy: Tolerate, Treat, Transfer, Terminate
2. If "Treat", create specific requirements (e.g., RISK-007 → INT-005)
3. Update risk register with mitigation actions
4. Track weekly until residual risk is MEDIUM or lower

**Prevention:** Don't leave risk workshop without assigned owners and due dates.

### Gap 3: Poor Traceability Coverage (< 80%)

**Symptom:**
- Analysis shows "12 orphan requirements"
- Traceability score < 70/100
- Requirements have no design elements or tests

**Why It Happens:**
- Requirements written but not designed
- Design elements not linked back to requirements
- Testing disconnected from requirements
- No traceability matrix maintained

**How to Fix:**
1. Run `/arckit.traceability` to generate matrix
2. For each orphan requirement:
   - Confirm it's still needed (delete if obsolete)
   - Create design element (component, API, database table)
   - Write test case (unit, integration, or acceptance test)
   - Document the links in traceability matrix
3. Update matrix weekly as design evolves
4. Target 90%+ coverage before HLD review

**Prevention:** Update traceability matrix every sprint, don't wait until gate.

### Gap 4: Missing Compliance Evidence

**Symptom:**
- Analysis shows "GDPR: No DPA 2018 evidence"
- Compliance score < 65/100
- No documented compliance checks

**Why It Happens:**
- Compliance seen as "legal problem" not architecture problem
- Evidence scattered across multiple documents
- No systematic compliance checking

**How to Fix:**
1. For UK Gov projects:
   - Run `/arckit.tcop` → Technology Code of Practice assessment
   - Run `/arckit.secure` → Secure by Design review
   - Run `/arckit.ai-playbook` → AI compliance (if AI system)
2. For GDPR/DPA 2018:
   - Ensure data model includes PII inventory
   - Document legal basis for processing
   - Create data subject rights procedures
   - Define retention schedules
3. Store all compliance evidence in `compliance/` directory
4. Reference evidence in requirements (e.g., "NFR-C-001: GDPR Article 17 satisfied by DR-008")

**Prevention:** Run compliance commands early (Alpha phase), not late (Beta).

### Gap 5: Architecture-Principle Misalignment

**Symptom:**
- Analysis shows "Violates SEC-001: Zero Trust"
- Architecture score < 70/100
- Design decisions contradict principles

**Why It Happens:**
- Principles created but not enforced
- Architects unaware of principles
- Convenience overrides principles

**How to Fix:**
1. Review `.arckit/memory/architecture-principles.md`
2. For each violated principle:
   - Understand the principle rationale
   - Refactor design to align (or justify deviation)
   - Add requirements to enforce principle (e.g., SEC-001 → NFR-S-003)
3. Update HLD to reference principles explicitly
4. In design reviews, check compliance with principles

**Prevention:** Reference principles when making architecture decisions, not after.

### Gap 6: Stakeholder Goals Not Addressed

**Symptom:**
- Analysis shows "CFO goal G-1 not addressed"
- Stakeholder alignment score < 75/100
- No requirements trace to stakeholder goals

**Why It Happens:**
- Stakeholder analysis done but not used
- Requirements written in isolation
- No one checks if goals are satisfied

**How to Fix:**
1. Open `stakeholder-drivers.md`
2. For each unaddressed goal:
   - Create business requirement (BR-xxx) that satisfies goal
   - Define success metric to measure goal achievement
   - Assign priority based on stakeholder power/interest
3. Add traceability: "BR-003 addresses CFO's goal G-1"
4. Review with stakeholder to confirm alignment

**Prevention:** Write requirements WITH stakeholder analysis open, not separate.

### Gap 7: No Success Metrics or KPIs

**Symptom:**
- Analysis shows "No measurable success criteria"
- Business requirements score < 60/100
- Can't tell if project succeeded

**Why It Happens:**
- Focus on "what to build" not "what success looks like"
- Metrics seen as PM problem not architecture problem
- Fear of accountability for measurable targets

**How to Fix:**
1. For each business requirement, add:
   - **Baseline**: Current state (e.g., "Current: 5-day procurement cycle")
   - **Target**: Desired state (e.g., "Target: 1-day procurement cycle")
   - **Metric**: How to measure (e.g., "Average days from RFP to vendor selected")
   - **Measurement**: When/how often (e.g., "Monthly, tracked in PowerBI")
2. Ensure metrics align with stakeholder outcomes (O-xxx)
3. Include metrics in business case Economic Case (benefits)
4. Plan measurement infrastructure (data collection, dashboards)

**Prevention:** Don't approve BR without measurable acceptance criteria.

### Gap 8: Analysis Run Too Late

**Symptom:**
- Analysis run at Beta gate, finds 40 critical issues
- Project delayed 6 weeks to fix issues
- Cost of fixing 10x higher than if caught in Alpha

**Why It Happens:**
- Analysis seen as "gate requirement" not "quality tool"
- Team thinks analysis is for auditors not developers
- No culture of continuous improvement

**How to Fix:**
1. Run `/arckit.analyze` weekly during active development
2. Treat analysis as sprint retrospective input
3. Fix issues immediately when found (cost is low)
4. Track improvement trend over time
5. Celebrate score improvements

**Prevention:** Integrate analysis into sprint cadence, not just gates.

---

## Common Patterns

### High Quality Projects (Score 85+)

- Comprehensive requirements with acceptance criteria
- All high risks mitigated
- 95%+ traceability coverage
- Full compliance documentation
- Architecture aligns with principles
- Stakeholder goals clearly addressed

### Medium Quality Projects (Score 70-84)

- Good requirements but some gaps
- Most risks mitigated but some open
- 80%+ traceability
- Compliance started but incomplete
- Architecture mostly sound with some concerns
- Stakeholder alignment mostly good

### Low Quality Projects (Score < 70)

- Requirements incomplete or poorly defined
- High risks not mitigated
- Poor traceability (< 80%)
- Compliance gaps (especially security, privacy)
- Architecture issues or anti-patterns
- Stakeholder misalignment

**If your project scores < 70, stop and address fundamentals before proceeding.**

---

## Related Documentation

- [Requirements Guide](requirements.md) - How to write good requirements
- [Risk Management Guide](risk-management.md) - HM Treasury Orange Book methodology
- [Traceability Guide](traceability.md) - How to maintain traceability
- [Stakeholder Analysis Guide](stakeholder-analysis.md) - Stakeholder engagement
- [Technology Code of Practice](uk-government/technology-code-of-practice.md) - UK Gov compliance

---

## Support

For issues or questions:
- GitHub Issues: https://github.com/tractorjuice/arc-kit/issues

---

**Last updated**: 2025-10-28
**ArcKit Version**: 0.6.0
