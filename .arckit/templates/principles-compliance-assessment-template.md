# Architecture Principles Compliance Assessment

> **Template Status**: Live | **Version**: [VERSION] | **Command**: `/arckit.principles-compliance`

## Document Control

| Field | Value |
|-------|-------|
| **Document ID** | ARC-[PROJECT_ID]-PRIN-COMP-v[VERSION] |
| **Document Type** | Principles Compliance Assessment |
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
| **Assessment Date** | [YYYY-MM-DD] |
| **Project Phase** | [Discovery / Alpha / Beta / Live] |
| **Assessor** | ArcKit AI + [USER_NAME] |
| **Principles Source** | `projects/000-global/ARC-000-PRIN-v*.md` ([DATE]) |

## Revision History

| Version | Date | Author | Changes | Approved By | Approval Date |
|---------|------|--------|---------|-------------|---------------|
| [VERSION] | [DATE] | ArcKit AI | Initial assessment from `/arckit.principles-compliance` command | PENDING | PENDING |

---

## Executive Summary

**Purpose**: This document assesses project compliance with enterprise architecture principles defined in `projects/000-global/ARC-000-PRIN-v*.md`. This is a point-in-time assessment for the [PHASE] phase gate review.

**Scope**: Assessment covers all [N] architecture principles against available project artifacts.

**Overall Compliance**: [N] principles assessed

| Status | Count | Percentage | Description |
|--------|-------|------------|-------------|
| 🟢 GREEN | [N] | [%] | Fully compliant with strong evidence |
| 🟠 AMBER | [N] | [%] | Partial compliance, gaps with remediation plan |
| 🔴 RED | [N] | [%] | Non-compliant or principle violated |
| ⚪ NOT ASSESSED | [N] | [%] | Insufficient artifacts to assess |

**Critical Issues**: [[N] RED-status principles requiring immediate attention / None identified]

**Recommendation**: [❌ BLOCK / ⚠️ CONDITIONAL APPROVAL / ✅ PROCEED]

**Next Assessment**: [Phase name + target date]

---

## Compliance Scorecard

| # | Principle Name | Status | Evidence Count | Key Gaps | Next Action |
|---|----------------|--------|----------------|----------|-------------|
| 1 | [Principle Name] | [🔴🟠🟢⚪] | [N] artifacts | [Gap summary] | [Action summary] |
| 2 | [Principle Name] | [🔴🟠🟢⚪] | [N] artifacts | [Gap summary] | [Action summary] |

**Legend**:
- 🔴 RED: Non-compliant, principle violated or no compliance plan
- 🟠 AMBER: Partial compliance, gaps identified with remediation plan
- 🟢 GREEN: Fully compliant with strong evidence
- ⚪ NOT ASSESSED: Insufficient artifacts or too early in project lifecycle

---

## Detailed Principle Assessment

### [#]. [Principle Name] - Status: [🔴🟠🟢⚪]

**Principle Statement** (from ARC-000-PRIN-v*.md):
> [Quote the principle statement verbatim]

**Rationale** (why this principle exists):
> [Quote the rationale]

---

#### Evidence Analysis

**Evidence Found**:

**Requirements Coverage**:
- ✅ [N] requirements address this principle:
  - [REQ-ID]: "[Requirement text]" (line [N])
  - [List relevant requirements with file:line references]
- [OR]
- ❌ No requirements found addressing this principle

**Design Evidence**:
- ✅ **HLD Section [N] "[Section Title]"** (lines [N-M]):
  - [Brief description of how design addresses principle]
  - [Quote key design decisions]
- [OR]
- ❌ No design evidence found in HLD

**Implementation Evidence**:
- ✅ Infrastructure as Code: `[file path]` (lines [N-M])
- ✅ CI/CD pipeline: `[file path]`
- ✅ Test results: `[file path]` - [pass/fail status]
- [OR]
- ⚪ Implementation not yet started (project in [phase])

**Compliance Assessment Evidence**:
- ✅ **TCoP Point [N]**: [Assessment result]
- ✅ **Secure by Design - [Control]**: [Assessment result]
- [OR]
- ⚪ Compliance assessments not yet performed

**Validation Evidence**:
- ✅ Load test results: [summary]
- ✅ Penetration test: [summary]
- ✅ Monitoring dashboard: [link/description]
- [OR]
- ❌ No validation evidence found

---

#### Validation Gates Status

- [x] **"[Validation gate text]"**
  - **Status**: [✅ PASS / ❌ FAIL / ⚪ N/A / 🔄 IN PROGRESS]
  - **Evidence**: [Specific file:section:line reference OR gap description]

[Repeat for each validation gate]

---

#### Assessment: [🔴🟠🟢⚪]

**Status Justification**:

[Explain why this RAG status was assigned with specific evidence]

---

#### Gaps Identified

[IF AMBER OR RED - LIST ALL GAPS]

**Gap [#]: [Gap Title]**
- **Description**: [What is missing or wrong]
- **Impact**: [Business/technical risk this gap creates]
- **Evidence Missing**: [What artifact/proof is absent]
- **Severity**: [CRITICAL / HIGH / MEDIUM / LOW]
- **Remediation**: [Specific actions to close gap]
- **Responsible**: [Suggested role]
- **Target Date**: [Next gate date or specific date]
- **Dependencies**: [What else needs to happen first]

[IF NO GAPS:]
✅ No gaps identified - principle fully satisfied

---

#### Recommendations

**Immediate Actions** [IF RED]:
1. [Action] - Owner: [Role] - Deadline: [Date]
2. [List critical remediations]

**OR**

**Exception Request** [IF RED AND compliance impossible]:
- If compliance is not feasible, submit formal exception request including:
  - Justification for non-compliance
  - Compensating controls (if any)
  - Business impact of enforcing compliance
  - Time-bound expiry date
  - Remediation plan for future compliance

**Before Next Gate** [IF AMBER]:
1. [Action] - Owner: [Role] - Deadline: [Next gate date]
2. [List actions to achieve GREEN status]

**Continuous Monitoring** [IF GREEN]:
- Maintain compliance through [monitoring approach]
- Reassess at [next gate or quarterly]
- Key metrics to track: [metric list]

**Next Assessment Trigger** [IF NOT ASSESSED]:
- Reassess during [phase] gate after [artifacts] are created
- Expected assessment date: [date]

---

[REPEAT ABOVE SECTION FOR ALL PRINCIPLES]

---

## Exception Register

[IF ANY EXCEPTIONS EXIST OR ARE RECOMMENDED]

| Exception ID | Principle | Status | Justification | Approved By | Approval Date | Expiry Date | Remediation Plan |
|--------------|-----------|--------|---------------|-------------|---------------|-------------|------------------|
| EXC-[NNN] | [Principle Name] | [REQUESTED / APPROVED / EXPIRED / REMEDIATED] | [Why exception needed] | [Name + Role] | [YYYY-MM-DD] | [YYYY-MM-DD] | [How/when achieve compliance] |

**Exception Process**:
1. **Request**: Document justification in this assessment
2. **Approval**: Requires CTO/CIO sign-off for all architecture principle exceptions
3. **Expiry**: All exceptions are time-bound (typically 3-6 months max)
4. **Review**: Exceptions reviewed quarterly, expired exceptions escalated automatically
5. **Remediation**: Must include plan to achieve compliance before expiry

[IF NO EXCEPTIONS:]
✅ No exceptions requested or approved - all principles assessed as GREEN, AMBER, or NOT ASSESSED with remediation plans.

---

## Summary & Recommendations

### Critical Findings

[IF RED PRINCIPLES EXIST:]

**❌ BLOCKING ISSUES** - The following principles are violated or non-compliant:

1. **[Principle Name]** - [Brief description]
   - **Impact**: [Risk description]
   - **Action Required**: [Immediate remediation or exception request]
   - **Owner**: [Role]
   - **Deadline**: [Date]

**Gate Decision**: ❌ **RECOMMEND BLOCKING** progression to [next phase] until RED principles remediated OR formal exceptions approved by CTO/CIO.

### Gaps Requiring Remediation

[IF AMBER PRINCIPLES EXIST:]

**⚠️ REMEDIATION REQUIRED** - The following principles have gaps:

1. **[Principle Name]** - [Brief gap description]
   - **Current Status**: AMBER
   - **Target Status**: GREEN by [next gate]
   - **Key Actions**: [Action summary]
   - **Owner**: [Role]

**Gate Decision**: ⚠️ **CONDITIONAL APPROVAL** - May proceed to [next phase] with tracked remediation. Review progress at [next gate].

### Actions Required Before Next Gate

**Priority 1 - CRITICAL** (RED principles - BLOCKING):
1. [Action] - Owner: [Role] - Due: [ASAP date]

**Priority 2 - HIGH** (AMBER principles - required for next gate):
1. [Action] - Owner: [Role] - Due: [Next gate date]

**Priority 3 - MEDIUM** (Enhancements - improve compliance):
1. [Action] - Owner: [Role] - Due: [Future date]

### Next Assessment

**Recommended Next Assessment**: [Phase name] gate review on [target date]

**Reassessment Triggers**:
- Major architecture changes or design revisions
- New compliance requirements introduced
- Technology stack changes
- Quarterly reviews for Live systems
- Exception expiry approaching
- Remediation actions completed

**Expected Progress by Next Assessment**:
- RED principles → AMBER or GREEN (with remediation)
- AMBER principles → GREEN (gaps closed)
- NOT ASSESSED principles → Assessed (artifacts now available)

---

## Artifacts Reviewed

**Architecture Principles** (source of truth):
- ✅ `projects/000-global/ARC-000-PRIN-v*.md` - [DATE] - [N] principles defined

**Project Artifacts** (evidence sources):
- ✅ `projects/[project-dir]/ARC-*-REQ-v*.md` - [DATE] - [N] requirements
- ✅ `projects/[project-dir]/vendors/[vendor]/hld-v1.md` - [DATE] - [N] sections
- ✅ `projects/[project-dir]/vendors/[vendor]/dld-v1.md` - [DATE] - [N] sections
- ✅ `projects/[project-dir]/ARC-*-TCOP-*.md` - [DATE]
- ✅ `projects/[project-dir]/ARC-*-SECD-*.md` - [DATE]
- [List all available artifacts]

**Artifacts Not Available** (limits assessment accuracy):
- ❌ `[artifact]` - [Reason not available]
- [List artifacts that would improve assessment if present]

**Assessment Limitations**:
- [Phase] phase - [limitation description]
- [Missing artifact] not available - [impact on assessment]

---

## Appendix: Assessment Methodology

### RAG Status Criteria

**🟢 GREEN (Fully Compliant)**:
- Evidence in multiple artifact types (requirements + design + implementation/validation)
- Most or all validation gates satisfied
- No significant gaps identified
- Principle demonstrably satisfied with proof

**🟠 AMBER (Partial Compliance)**:
- Some evidence exists (typically requirements or design)
- Clear gaps identified but remediation plan exists
- Work in progress with target completion dates
- Path to GREEN status clear and achievable

**🔴 RED (Non-Compliant)**:
- Principle directly violated by design decisions
- No evidence of compliance and no plan to comply
- Critical gaps with no remediation plan
- Requires immediate attention or exception approval

**⚪ NOT ASSESSED (Insufficient Evidence)**:
- Project phase too early for meaningful assessment
- Required artifacts don't exist yet (by design)
- Assessment deferred to appropriate later gate
- No concern - timing appropriate for project phase

### Evidence Types

**Primary Evidence** (strongest):
- Requirements with acceptance criteria
- Design documentation with specific technical decisions
- Implementation artifacts (IaC code, configs, CI/CD pipelines)
- Test results (load tests, pen tests, security scans)
- Operational metrics (monitoring dashboards, SLA reports)

**Secondary Evidence** (supporting):
- Compliance assessments (TCoP, Secure by Design, AI Playbook)
- Architecture diagrams showing principle implementation
- Traceability matrices linking requirements to design
- Stakeholder requirements driving principle adherence

**Weak Evidence** (insufficient alone):
- Aspirational statements without implementation details
- "We plan to..." without concrete requirements or design
- Vague references without file:section:line specificity

## External References

| Document | Type | Source | Key Extractions | Path |
|----------|------|--------|-----------------|------|
| *None provided* | — | — | — | — |

---

**Generated by**: ArcKit `/arckit.principles-compliance` command
**Generated on**: [DATE]
**ArcKit Version**: [VERSION]
**Project**: [PROJECT_NAME]
**Model**: [AI_MODEL]
