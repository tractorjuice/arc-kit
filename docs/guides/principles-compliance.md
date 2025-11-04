# Principles Compliance Assessment Guide

## What is a Principles Compliance Assessment?

A **Principles Compliance Assessment** measures how well your project adheres to the architecture principles defined in `.arckit/memory/architecture-principles.md`.

Unlike `/arckit.analyze` (which checks for violations and gaps across all artifacts), `/arckit.principles-compliance` generates a comprehensive, principle-by-principle scorecard showing:
- ✅ Which principles you're complying with (GREEN)
- ⚠️ Which principles have gaps (AMBER)
- ❌ Which principles are violated (RED)
- 📋 What evidence supports each assessment
- 🎯 What actions are needed to achieve full compliance

## Why It Matters

**Without Principles Compliance Tracking**:
- ❌ Architecture drift goes unnoticed until production
- ❌ Principle violations discovered too late (after implementation)
- ❌ No audit trail showing governance due diligence
- ❌ Governance becomes box-ticking, not value-adding
- ❌ Exception management is ad-hoc and undocumented

**With Principles Compliance Tracking**:
- ✅ Catch violations early (Discovery/Alpha phases)
- ✅ Track compliance progress across project gates
- ✅ Demonstrate governance rigor to auditors
- ✅ Evidence-based architecture reviews with clear decisions
- ✅ Managed exceptions with expiry dates and remediation plans

---

## When to Run `/arckit.principles-compliance`

### Discovery Phase
**Goal**: Understand which principles apply to this project

```bash
/arckit.principles-compliance Assess principles for NHS appointment booking
```

**Expected Result**: Mostly ⚪ NOT ASSESSED (too early) - but identifies critical principles requiring immediate attention (e.g., security, data sovereignty).

**Value**: Early awareness of governance requirements influences design decisions.

---

### Alpha Phase
**Goal**: Validate requirements and HLD align with principles

```bash
/arckit.principles-compliance Alpha assessment for project 001
```

**Expected Result**: Mix of 🟢 GREEN (requirements address principles), 🟠 AMBER (partial evidence), ⚪ NOT ASSESSED (implementation details pending).

**Value**: Confirms requirements satisfy principles before vendor procurement or build begins.

---

### Beta Phase
**Goal**: Confirm implementation matches principles

```bash
/arckit.principles-compliance Beta pre-go-live assessment
```

**Expected Result**: Mostly 🟢 GREEN, few 🟠 AMBER (operational evidence pending), zero 🔴 RED.

**Value**: Final validation before production deployment - catches implementation drift.

---

### Live / Quarterly Reviews
**Goal**: Monitor compliance drift, review exceptions

```bash
/arckit.principles-compliance Q2 2025 compliance review
```

**Expected Result**: All 🟢 GREEN, exceptions reviewed, no new violations.

**Value**: Continuous governance - prevents architectural erosion over time.

---

## Creating a Principles Compliance Assessment with ArcKit

### Step 1: Ensure Principles Exist

```bash
# If not already created:
/arckit.principles Create architecture principles for [organization name]
```

This generates `.arckit/memory/architecture-principles.md` with your organization's principles (16 default principles, but organizations can customize).

**Note**: Principles are **global** (organization-wide), not project-specific. All projects are assessed against the same principles.

---

### Step 2: Gather Project Artifacts

**Minimum** (for basic assessment):
- `projects/XXX/requirements.md` - At least requirements needed

**Recommended** (for thorough assessment):
- `projects/XXX/requirements.md` - Business, functional, NFR requirements
- `projects/XXX/vendors/{vendor}/hld-v1.md` - High-level architecture design
- `projects/XXX/vendors/{vendor}/dld-v1.md` - Detailed implementation design
- `projects/XXX/tcop-assessment.md` - Technology Code of Practice (UK Gov)
- `projects/XXX/secure-by-design.md` - Security assessment

**Optional** (enhances assessment):
- `projects/XXX/data-model.md` - Data architecture and GDPR compliance
- `projects/XXX/traceability-matrix.md` - Requirements traceability
- `projects/XXX/stakeholder-drivers.md` - Business drivers
- `projects/XXX/risk-register.md` - Risk mitigation plans

**Rule**: More artifacts = better evidence = more accurate assessment

---

### Step 3: Run Assessment Command

```bash
/arckit.principles-compliance [description]
```

**Examples**:
```bash
/arckit.principles-compliance Initial discovery assessment
/arckit.principles-compliance Alpha gate review
/arckit.principles-compliance Pre-production compliance check
/arckit.principles-compliance Q3 2025 quarterly review
```

The command will:
1. ✅ Read architecture principles from `.arckit/memory/architecture-principles.md`
2. ✅ Extract ALL principles defined (dynamic - not hardcoded count)
3. ✅ Scan project artifacts for compliance evidence
4. ✅ Assess each principle with RAG status
5. ✅ Generate comprehensive assessment document
6. ✅ Show summary to user

---

### Step 4: Review Generated Document

The command generates: `projects/XXX/principles-compliance-assessment-YYYY-MM-DD.md`

**Key Sections to Review**:

1. **Executive Summary** (page 1):
   - Overall compliance snapshot
   - RED/AMBER/GREEN/NOT ASSESSED counts
   - Critical issues requiring immediate attention
   - Gate decision recommendation (BLOCK / CONDITIONAL / PROCEED)

2. **Compliance Scorecard** (page 2):
   - One-line summary for each principle
   - Quick scan to see which principles need attention

3. **Detailed Assessments** (bulk of document):
   - Evidence found for each principle (with file:line references)
   - Validation gates status (PASS/FAIL for each gate)
   - RAG status justification
   - Gaps identified (if AMBER/RED)
   - Actionable recommendations

4. **Exception Register**:
   - Approved waivers and expiry dates
   - Remediation plans for exceptions

5. **Summary & Recommendations**:
   - Prioritized action list (Priority 1 CRITICAL → Priority 3 MEDIUM)
   - Next assessment date and triggers

---

### Step 5: Act on Findings

**If 🔴 RED principles exist**:
1. ❌ **BLOCK** progression to next gate
2. Assign remediation owner immediately
3. Define remediation plan with specific actions
4. **Either**:
   - Remediate violation (update design/requirements)
   - **Or** submit exception request for CTO/CIO approval
5. Re-run assessment to verify GREEN status

**If 🟠 AMBER principles exist**:
1. ⚠️ **CONDITIONAL APPROVAL** - may proceed with tracking
2. Add gaps to project backlog (Jira, Azure DevOps, etc.)
3. Assign owners for each remediation action
4. Set target completion dates (typically next gate)
5. Track progress through project management tools

**If all 🟢 GREEN**:
1. ✅ **PROCEED** to next gate
2. Schedule next assessment (quarterly for Live systems)
3. Maintain compliance through monitoring

**If ⚪ NOT ASSESSED**:
1. ℹ️ Expected at early project phases
2. Identify when artifacts will be available
3. Schedule reassessment at appropriate gate

---

## Understanding RAG Status

### 🟢 GREEN - Fully Compliant

**Criteria**:
- Strong evidence in **multiple** artifact types (requirements AND design)
- All or most validation gates satisfied
- No significant gaps identified
- Principle demonstrably satisfied with proof

**Example**:
```markdown
Principle: Security by Design - Status: 🟢 GREEN

Evidence:
✅ 12 NFR-SEC requirements defined (requirements.md lines 89-156)
✅ HLD Section 4 "Security Architecture" (8 pages of detail)
✅ Threat model completed (threats-v1.0.md)
✅ TCoP Point 6 (Make systems secure) - GREEN status
✅ Penetration test passed (0 critical, 2 medium findings addressed)

Validation Gates:
✅ Threat model completed - PASS
✅ Security controls mapped to requirements - PASS
✅ Security testing plan defined - PASS
✅ Incident response runbook created - PASS

Assessment: GREEN - Fully compliant with strong evidence across multiple artifacts
```

---

### 🟠 AMBER - Partial Compliance

**Criteria**:
- Some evidence exists (typically requirements OR design, not both)
- Design addresses principle but implementation/testing gaps remain
- Clear remediation path defined with target dates
- "Work in progress" with visible path to GREEN

**Example**:
```markdown
Principle: Infrastructure as Code - Status: 🟠 AMBER

Evidence:
✅ HLD Section 6 mentions Terraform (1 paragraph)
✅ NFR-OPS-003: "All infrastructure defined as code"
⚠️ No Terraform code found in repository
❌ No CI/CD pipeline defined yet

Validation Gates:
❌ Infrastructure defined as code - FAIL (planned, not implemented)
❌ Infrastructure code version-controlled - FAIL (not written yet)
❌ Automated deployment pipeline - FAIL (in backlog)

Gaps:
1. Terraform code not written yet - Target: Before Beta gate (2025-03-01)
2. CI/CD pipeline design pending - Target: Before Beta gate

Assessment: AMBER - Principle acknowledged in requirements and HLD,
implementation pending. Clear remediation path.
Recommendation: Complete IaC before Beta gate review.
```

---

### 🔴 RED - Non-Compliant

**Criteria**:
- Principle is directly **VIOLATED** (design contradicts principle)
- No evidence of compliance AND no plan to comply
- Critical gaps with no remediation plan
- Requires immediate attention or exception approval

**Example**:
```markdown
Principle: Automated Testing - Status: 🔴 RED

Evidence:
❌ HLD Section 7 states "manual testing only" (line 342)
❌ No test strategy defined
❌ Zero test requirements (no NFR-T-xxx)
❌ No CI/CD pipeline (no automated test execution)

Validation Gates:
❌ Automated tests exist - FAIL (none planned)
❌ Test coverage meets thresholds - FAIL (0% coverage)
❌ Critical paths have E2E tests - FAIL (manual only)

Assessment: RED - Principle directly violated. HLD explicitly describes
manual testing approach, contradicting Automated Testing principle.

Recommendation:
BLOCK Alpha gate until one of:
1. Test strategy approved and automated testing planned (PREFERRED)
2. Exception request submitted to CTO with justification and expiry date

Impact: Without automated testing, continuous integration is impossible,
deployment risk is high, and regression testing becomes bottleneck.
```

---

### ⚪ NOT ASSESSED - Insufficient Evidence

**Criteria**:
- Project too early in lifecycle (Discovery phase with no requirements)
- Artifacts needed for assessment don't exist yet **by design**
- Principle applies to later phases (e.g., operational principles before Go-Live)
- Assessment deferred to appropriate later gate

**Example**:
```markdown
Principle: Observability and Operational Excellence - Status: ⚪ NOT ASSESSED

Evidence:
⚪ Project currently in Discovery phase
⚪ No HLD/DLD created yet
⚪ Operational requirements not defined
⚪ Monitoring strategy expected at Beta phase

Assessment: NOT ASSESSED - Too early in project lifecycle.
Operational principles require implementation details not yet available.

Next Assessment: Beta gate review (after operational design completed)
Expected Date: 2025-04-15
```

---

## Handling Exceptions

### When Exceptions Are Acceptable

**Valid reasons for exception**:
- ✅ Transitional state during migration (time-bound, end date defined)
- ✅ Pilot/proof-of-concept with defined end date
- ✅ Technical constraints preventing compliance (with compensating controls)
- ✅ Regulatory requirements creating conflict (rare but possible)
- ✅ Legacy system integration requiring temporary workaround

**NOT valid reasons**:
- ❌ "We don't have time" (poor planning)
- ❌ "It's too expensive" (business decision, not technical exception)
- ❌ "We've always done it this way" (resistance to change)
- ❌ "The principle doesn't apply to us" (without rigorous justification)
- ❌ "We'll fix it later" (without specific plan and date)

---

### Exception Approval Process

1. **Document Exception Request** in compliance assessment document
2. **Justify** why compliance is not possible (technical/regulatory reasons)
3. **Define Compensating Controls** (if any) to mitigate risk
4. **Create Remediation Plan** with specific target date
5. **Seek Approval** from Enterprise Architecture / CTO / CIO
6. **Set Expiry Date** (exceptions are time-bound, typically 3-6 months max)
7. **Track in Exception Register** for quarterly review

---

### Exception Template

```markdown
**Exception ID**: EXC-001

**Principle**: Infrastructure as Code

**Status**: REQUESTED (awaiting CTO approval)

**Justification**:
3-month pilot project testing new AI platform capabilities. Manual infrastructure
deployment acceptable for pilot due to:
- Pilot duration: 3 months (2025-01-15 to 2025-04-15)
- Non-production environment only
- Limited scope: 5 VMs, no customer data
- Learning phase before production rollout

**Compensating Controls**:
- All infrastructure changes documented in runbook
- Change approval required for any infrastructure modification
- Weekly infrastructure review with Enterprise Architecture

**Business Impact**:
Enforcing IaC for pilot would delay evaluation by 4-6 weeks, preventing
timely decision on platform suitability.

**Approved By**: [Pending CTO review]

**Expiry Date**: 2025-04-15 (end of pilot)

**Remediation Plan**:
- If pilot succeeds: Migrate to Terraform-managed infrastructure by 2025-05-01
- If pilot fails: Decommission environment by 2025-04-20
- No exception extension beyond 2025-04-15
```

---

### Exception Review Process

**Quarterly Reviews**:
- Enterprise Architecture reviews all active exceptions
- Exceptions approaching expiry flagged for remediation or renewal
- Expired exceptions without remediation automatically escalated to CTO/CIO

**Exception Renewal**:
- Requires new justification (cannot reuse original)
- Maximum 1 renewal (6 months total)
- After 6 months, must either comply or permanent waiver (rare, requires CTO/CIO)

**Exception Remediation**:
- Once remediated, update compliance assessment
- Re-run `/arckit.principles-compliance` to verify GREEN status
- Close exception in register

---

## Best Practices

### 1. Assess Early and Often

**Don't wait until Beta** to discover principle violations.

✅ **DO**:
- Run compliance assessment at every gate (Discovery, Alpha, Beta, Live)
- Reassess quarterly for Live systems
- Reassess after major architecture changes

❌ **DON'T**:
- Run once at end of project
- Skip Discovery/Alpha assessments ("too early")
- Assume once GREEN, always GREEN (compliance can drift)

---

### 2. Evidence Over Aspiration

**Link to real artifacts**, not intentions.

✅ **DO**:
- "HLD Section 4.2 'MFA Implementation' describes two-factor authentication (lines 156-203)"
- "NFR-SEC-001 (line 89) requires MFA for all users"
- "Penetration test report pentest-2025-01-10.pdf shows 0 auth bypass vulnerabilities"

❌ **DON'T**:
- "We plan to implement security"
- "The design is secure"
- "Security is mentioned in the HLD"

**Rule**: If you can't cite `file:section:line`, the evidence is weak.

---

### 3. Be Honest with RAG Status

**Amber is better than false green.**

✅ **DO**:
- Mark AMBER if gaps exist, even if embarrassing
- Mark RED if principle violated, even if uncomfortable
- Provide honest assessment to enable good decisions

❌ **DON'T**:
- Mark GREEN to "look good"
- Mark AMBER to avoid confrontation (when actually RED)
- Inflate scores for political reasons

**Remember**: False GREEN harms governance, creates risk, and undermines trust. Honest assessment enables effective remediation.

---

### 4. Track Remediation

**Follow up on AMBER/RED principles.**

✅ **DO**:
- Assign specific owners (names, not roles)
- Set target dates aligned with project gates
- Track in project management tools (Jira, Azure DevOps)
- Review progress at sprint planning / standup meetings
- Update assessment after remediation complete

❌ **DON'T**:
- Generate assessment and ignore findings
- Assign to "team" without specific owner
- Set vague deadlines ("before go-live")
- Let AMBER principles linger without progress

**Example tracking**:
```
Jira Ticket: ARCH-123
Title: [AMBER] Complete threat model for Security by Design principle
Owner: Jane Smith (Security Architect)
Due Date: 2025-02-15 (Beta gate)
Linked Assessment: principles-compliance-assessment-2025-01-15.md
Acceptance Criteria:
- Threat model completed using STRIDE methodology
- Reviewed by security team
- Mitigations documented in HLD Section 4
- Re-run /arckit.principles-compliance shows GREEN status
```

---

### 5. Review Exceptions Quarterly

**Exceptions expire** - don't let them become permanent.

✅ **DO**:
- Track exception expiry dates in calendar
- Review all exceptions quarterly (even if not expiring)
- Escalate expired exceptions to CTO/CIO automatically
- Celebrate exception closures (show improvement)

❌ **DON'T**:
- Grant open-ended exceptions without expiry
- Forget about exceptions after approval
- Renew exceptions indefinitely without justification

**Exception Dashboard** (quarterly review):
```
Active Exceptions: 3
- EXC-001 (IaC): Expires 2025-04-15 (60 days) - ON TRACK
- EXC-002 (Load Testing): Expires 2025-03-01 (30 days) - AT RISK
- EXC-003 (Threat Model): Expires 2025-02-15 (15 days) - AT RISK

Recently Closed: 2
- EXC-004 (Monitoring): Closed 2025-01-10 - Remediated (CloudWatch deployed)
- EXC-005 (CI/CD): Closed 2025-01-05 - Pilot ended, environment decommissioned

Action Required:
- EXC-002: Assign load testing engineer, create plan
- EXC-003: Escalate to security team, threat model overdue
```

---

## ArcKit Workflow Integration

### Discovery Phase
1. `/arckit.plan` - Create project plan with gates and timeline
2. `/arckit.principles` - Define architecture principles (if not exist - global)
3. `/arckit.stakeholders` - Analyze stakeholders and business drivers
4. `/arckit.risk` - Create risk register
5. `/arckit.sobc` - Business case justification
6. **`/arckit.principles-compliance` - Initial baseline assessment**
   - Expected: Mostly NOT ASSESSED, identify critical principles
   - Value: Early awareness of governance requirements

---

### Alpha Phase
1. `/arckit.requirements` - Define comprehensive requirements
2. `/arckit.data-model` - Design data model with GDPR compliance
3. `/arckit.dpia` - Data Protection Impact Assessment (if personal data)
4. `/arckit.research` - Build vs buy analysis
5. `/arckit.wardley` - Strategic positioning
6. `/arckit.hld-review` - Review vendor HLD (or internal HLD)
7. **`/arckit.principles-compliance` - Alpha gate assessment**
   - Expected: Mix GREEN/AMBER/NOT ASSESSED
   - Value: Validate requirements and HLD align with principles
   - Gate Decision: Conditional approval with AMBER remediation

---

### Beta Phase
1. `/arckit.dld-review` - Review detailed design
2. `/arckit.diagram` - Architecture diagrams (C4 model)
3. `/arckit.backlog` - Convert requirements to user stories
4. `/arckit.traceability` - Requirements traceability matrix
5. `/arckit.servicenow` - Operational design (CMDB, SLAs)
6. `/arckit.analyze` - Comprehensive gap analysis
7. `/arckit.tcop` - Technology Code of Practice (UK Gov)
8. `/arckit.secure` - Secure by Design assessment (UK Gov)
9. **`/arckit.principles-compliance` - Beta gate pre-go-live assessment**
   - Expected: Mostly GREEN, few AMBER, zero RED
   - Value: Final validation before production
   - Gate Decision: Proceed if all GREEN/AMBER with remediation

---

### Live / Ongoing
1. **`/arckit.principles-compliance` - Quarterly compliance review**
2. Update exception register
3. Track compliance drift
4. Re-assess after major architecture changes
5. `/arckit.analyze` - Periodic gap analysis
6. `/arckit.service-assessment` - GDS Service Standard (UK Gov annual review)

---

## Common Issues & Troubleshooting

### Issue: "All principles show NOT ASSESSED"

**Cause**: Project too early (Discovery phase, no requirements/design yet)

**Solution**:
- ✅ **Expected** at Discovery phase
- Wait until Alpha phase after requirements created
- Some principles (strategic, security) may still assess based on stakeholder analysis
- Re-run assessment at Alpha gate

**When to worry**: If still NOT ASSESSED at Beta phase, artifacts are missing.

---

### Issue: "How do I fix a RED principle?"

**Cause**: Principle violated or no compliance plan

**Solution**:
1. **Read "Gaps Identified" section** in assessment for principle
2. **Follow "Recommendations"** for specific remediation steps
3. **Update requirements/design** to address principle violation
4. **Re-run assessment** to verify GREEN status
5. **If compliance impossible**:
   - Request exception with justification
   - Define compensating controls
   - Set expiry date
   - Get CTO/CIO approval

**Example**:
```
RED Principle: Infrastructure as Code
Gap: HLD describes manual deployment
Remediation:
1. Update HLD Section 6 to specify Terraform
2. Create Terraform code for infrastructure
3. Add NFR-OPS-003: "All infrastructure defined as code"
4. Set up CI/CD pipeline for IaC deployment
5. Re-run /arckit.principles-compliance
Expected Result: GREEN status
```

---

### Issue: "Evidence exists but principle marked AMBER"

**Cause**: Partial evidence or validation gates not fully satisfied

**Solution**:
- Review **"Validation Gates Status"** section
- Identify which gates **FAILED**
- Gather missing evidence:
  - Tests (load tests, pen tests, security scans)
  - Documentation (threat models, runbooks)
  - Operational evidence (monitoring dashboards, SLA reports)
- Update artifacts with missing evidence
- Re-run assessment

**Example**:
```
Principle: Performance and Efficiency - AMBER

Validation Gates:
✅ Performance requirements defined - PASS
✅ Load testing performed - FAIL ← Missing evidence
✅ Performance metrics monitored - FAIL ← Missing evidence

Action:
1. Conduct load testing per NFR-P requirements
2. Set up CloudWatch performance metrics dashboard
3. Document results in test-results/load-test-2025-01-15.md
4. Re-run assessment
Expected Result: GREEN status
```

---

### Issue: "Assessment different from last time"

**Cause**: New artifacts added, design evolved, or interpretation changed

**Solution**: **This is expected!** Compliance assessments are point-in-time snapshots.

**Normal progression**:
- **Discovery**: Mostly NOT ASSESSED (no artifacts)
- **Alpha**: Mix GREEN/AMBER/NOT ASSESSED (requirements + HLD)
- **Beta**: Mostly GREEN/AMBER (design + some implementation)
- **Live**: All GREEN (implementation + operational evidence)

**Compare assessments** to track progress:
```bash
# Alpha assessment (2025-01-15)
GREEN: 8 principles
AMBER: 5 principles
NOT ASSESSED: 3 principles

# Beta assessment (2025-03-01)
GREEN: 14 principles (↑ 6 from Alpha)
AMBER: 2 principles (↓ 3 from Alpha)
NOT ASSESSED: 0 principles (↓ 3 from Alpha)

Progress: 75% → 88% compliant (GREEN)
```

**When to worry**: If GREEN → AMBER or GREEN → RED (compliance drift - investigate).

---

### Issue: "Principle not relevant to our project"

**Cause**: Architecture principles are organization-wide, not all apply to every project

**Solution**:
- **If genuinely not applicable**: Mark NOT ASSESSED with justification
- **Example**: "Asynchronous Communication" principle for simple CRUD app
- **Document why**: "Project has no integration requirements (standalone system)"

**But be careful**:
- Don't dismiss principles lightly
- Most principles apply to most projects
- If unsure, discuss with Enterprise Architecture team
- "Not relevant" is **not** an excuse for non-compliance

---

### Issue: "Assessment takes too long to run"

**Cause**: Command reads many large files, AI model processes slowly

**Solution**:
- ✅ **Use Write tool**: Command should write document, not output to console
- ✅ **Progressive disclosure**: Command should extract relevant sections, not read entire files
- ✅ **Typical runtime**: 2-5 minutes for full assessment

**If slower than 5 minutes**:
- Check artifact sizes (very large HLD/DLD > 500KB)
- Consider splitting large design documents
- Report performance issue to ArcKit team

---

## Summary Checklist

Before running principles compliance assessment:
- [ ] Architecture principles defined (`.arckit/memory/architecture-principles.md`)
- [ ] Project artifacts available (minimum: requirements.md)
- [ ] Know project phase (Discovery/Alpha/Beta/Live)
- [ ] Understand expected RAG distribution for current phase

After generating assessment:
- [ ] Review Executive Summary for critical issues
- [ ] Check Compliance Scorecard for RED/AMBER principles
- [ ] Read detailed assessments for RED/AMBER principles
- [ ] Create remediation actions (Jira/Azure DevOps tickets)
- [ ] Assign owners and target dates
- [ ] Track exceptions in Exception Register
- [ ] Make gate decision (BLOCK / CONDITIONAL / PROCEED)
- [ ] Schedule next assessment (next gate or quarterly)

Quarterly (for Live systems):
- [ ] Re-run `/arckit.principles-compliance`
- [ ] Review exception register (expiry dates)
- [ ] Check for compliance drift (GREEN → AMBER/RED)
- [ ] Celebrate improvements (AMBER → GREEN, exceptions closed)

---

## Related Commands

**Foundation**:
- `/arckit.principles` - Create/update architecture principles (run this first!)
- `/arckit.plan` - Create project plan with gates and timeline

**Assessment Commands**:
- `/arckit.analyze` - Comprehensive gap analysis across all artifacts
- `/arckit.hld-review` - High-level design review
- `/arckit.dld-review` - Detailed design review
- `/arckit.traceability` - Requirements traceability matrix

**UK Government Compliance**:
- `/arckit.service-assessment` - GDS Service Standard (14 points)
- `/arckit.tcop` - Technology Code of Practice (13 points)
- `/arckit.secure` - Secure by Design (NCSC CAF, Cyber Essentials)
- `/arckit.ai-playbook` - AI Playbook (responsible AI)
- `/arckit.atrs` - Algorithmic Transparency Recording Standard

---

## Example: End-to-End Workflow

### Scenario: NHS Appointment Booking System

#### Discovery Phase (Week 1)
```bash
/arckit.principles Create architecture principles for NHS Digital

# Creates .arckit/memory/architecture-principles.md with 16 principles
```

#### Alpha Phase (Week 4)
```bash
/arckit.requirements Define requirements for NHS appointment booking

# Creates projects/001-nhs-appointment/requirements.md

/arckit.hld-review Review vendor HLD

# Vendor submits HLD, review shows gaps

/arckit.principles-compliance Alpha gate assessment for NHS appointment booking

# Assessment shows:
# GREEN: 8 principles (security, data sovereignty addressed)
# AMBER: 5 principles (performance testing pending, IaC planned)
# NOT ASSESSED: 3 principles (operational, too early)

# Gate Decision: CONDITIONAL APPROVAL - proceed with AMBER tracking
```

#### Beta Phase (Week 12)
```bash
/arckit.dld-review Review vendor DLD

/arckit.diagram Create C4 architecture diagrams

/arckit.traceability Generate traceability matrix

/arckit.principles-compliance Beta pre-go-live assessment

# Assessment shows:
# GREEN: 14 principles (↑ 6 from Alpha)
# AMBER: 2 principles (penetration test scheduled, monitoring dashboard in progress)
# RED: 0 principles
# NOT ASSESSED: 0 principles

# Gate Decision: PROCEED - close AMBER gaps before go-live
```

#### Go-Live + 6 Months (Live Phase)
```bash
/arckit.principles-compliance Q3 2025 quarterly review

# Assessment shows:
# GREEN: 16 principles (100% compliant)
# AMBER: 0 principles
# RED: 0 principles
# NOT ASSESSED: 0 principles

# Exception Register:
# EXC-001 (Load testing): CLOSED - Remediated 2025-08-15
# EXC-002 (Threat model): CLOSED - Completed 2025-07-01

# Result: Full compliance maintained, no exceptions, excellent governance
```

---

**Questions? Issues?**
- GitHub: https://github.com/tractorjuice/arc-kit/issues
- Documentation: https://github.com/tractorjuice/arc-kit/blob/main/docs/README.md
