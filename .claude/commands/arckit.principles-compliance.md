---
description: Assess compliance with architecture principles and generate scorecard with evidence, gaps, and recommendations
---

## User Input

```text
$ARGUMENTS
```

## Goal

Generate a comprehensive compliance assessment document that measures adherence to each architecture principle defined in `projects/000-global/ARC-000-PRIN-*.md`. The assessment includes RAG status (Red/Amber/Green), evidence links, gaps, and actionable recommendations.

**This is a point-in-time assessment** - run at key project gates (Discovery, Alpha, Beta, Live) to track compliance over time.

## Prerequisites

### Architecture Principles (MANDATORY)

a. **Architecture Principles Document** (MUST exist):
   - Check if any `ARC-000-PRIN-*.md` file exists in `projects/000-global/`
   - If NOT found: ERROR "Run /arckit.principles first to define governance standards for your organization"
   - Principles compliance cannot be assessed without defined principles

### Project Artifacts (RECOMMENDED)

More artifacts = better evidence = more accurate assessment:
- Any `ARC-*-REQ-*.md` file in `projects/{project-dir}/` - Requirements to assess against principles
- `projects/{project-dir}/vendors/{vendor}/hld-v*.md` - High-Level Design
- `projects/{project-dir}/vendors/{vendor}/dld-v*.md` - Detailed Low-Level Design
- Any `ARC-*-TCOP-*.md` file in `projects/{project-dir}/` - Technology Code of Practice compliance
- Any `ARC-*-SECD-*.md` file in `projects/{project-dir}/` - Security assessment
- Any `ARC-*-DATA-*.md` file in `projects/{project-dir}/` - Data architecture
- Any `ARC-*-TRAC-*.md` file in `projects/{project-dir}/` - Requirements traceability

**Note**: Assessment is possible with minimal artifacts, but accuracy improves with more evidence.

## Operating Constraints

**Non-Destructive Assessment**: Do NOT modify existing artifacts. Generate a new assessment document only.

**Dynamic Principle Extraction**: Do NOT assume a fixed number of principles. Organizations may define 5, 10, 20, or more principles. Extract ALL principles found in `ARC-000-PRIN-*.md` dynamically.

**Evidence-Based Assessment**: RAG status must be justified by concrete evidence (file references, section numbers, line numbers). Avoid vague statements like "design addresses this" - be specific.

**Honest Assessment**: Do not inflate scores. AMBER is better than false GREEN. RED principles require immediate attention or exception approval.

## Execution Steps

### 0. Read the Template

**Read the template** (with user override support):
- **First**, check if `.arckit/templates-custom/principles-compliance-assessment-template.md` exists (user override)
- **If found**: Read the user's customized template
- **If not found**: Read `.arckit/templates/principles-compliance-assessment-template.md` (default)

> **Note**: Read the `VERSION` file and update the version in the template metadata line when generating.
> **Tip**: Users can customize templates with `/arckit.customize principles-compliance`

### 1. Validate Prerequisites

**Check Architecture Principles**:
```bash
if [ ! -f projects/000-global/ARC-000-PRIN-*.md ]; then
    ERROR "Architecture principles not found. Run /arckit.principles first."
fi
```

### 1b. Check for External Documents (optional)

Scan for external (non-ArcKit) documents the user may have provided:

**External Audit Findings & Compliance Certificates**:
- **Look in**: `projects/{project-dir}/external/`
- **File types**: PDF (.pdf), Word (.docx), Markdown (.md)
- **What to extract**: Audit findings, compliance gaps, certification evidence, remediation plans
- **Examples**: `architecture-audit.pdf`, `compliance-certificate.pdf`, `remediation-plan.docx`

**Enterprise-Wide Compliance Frameworks**:
- **Look in**: `projects/000-global/external/`
- **File types**: PDF, Word, Markdown
- **What to extract**: Enterprise compliance frameworks, audit standards, cross-project compliance benchmarks

**User prompt**: If no external audit docs found but they would improve the compliance assessment, ask:
"Do you have any external audit findings or compliance certificates? I can read PDFs directly. Place them in `projects/{project-dir}/external/` and re-run, or skip."

**Important**: This command works without external documents. They enhance output quality but are never blocking.

### 2. Extract All Principles Dynamically

Read any `ARC-000-PRIN-*.md` file in `projects/000-global/` and extract ALL principles found.

**Extraction Pattern**:

Principles are typically structured as:
```markdown
### [Number]. [Principle Name]

**Principle Statement**:
[Statement text]

**Rationale**:
[Rationale text]

**Implications**:
- [Implication 1]
- [Implication 2]

**Validation Gates**:
- [ ] Gate 1
- [ ] Gate 2
- [ ] Gate 3
```

**For EACH principle found**:
- Extract principle number (optional - may not exist)
- Extract principle name/title (REQUIRED)
- Extract principle statement (REQUIRED)
- Extract rationale (REQUIRED)
- Extract implications (OPTIONAL)
- Extract validation gates (OPTIONAL - but highly valuable for assessment)

**Important**: Do NOT hardcode principle names or count. Organizations customize their principles. Extract dynamically whatever exists in the file.

**Example Extraction**:
```
Principle 1: "Scalability and Elasticity"
Principle 2: "Resilience and Fault Tolerance"
Principle 3: "Security by Design"
...
[However many principles are defined]
```

### 3. Discover Project Context

Identify which project to assess:
- If user specifies project name: Use that project directory
- If only one project exists in `projects/`: Analyze that project
- If multiple projects exist: Ask user which project to assess

Expected project structure:
```
projects/
└── {project-dir}/
    ├── ARC-{PROJECT_ID}-REQ-v*.md
    ├── ARC-{PROJECT_ID}-DATA-v*.md
    ├── vendors/
    │   └── {vendor-name}/
    │       ├── hld-v1.md
    │       └── dld-v1.md
    ├── ARC-*-TCOP-*.md
    ├── ARC-*-SECD-*.md
    └── ARC-{PROJECT_ID}-TRAC-v*.md
```

### 4. Load Project Artifacts (Progressive Disclosure)

Load only the information needed for assessment. Do NOT read entire files - extract relevant sections.

**From any `ARC-*-REQ-*.md` file in `projects/{project-dir}/`** (if exists):
- Business requirements (BR-xxx) count and examples
- Functional requirements (FR-xxx) count and examples
- Non-functional requirements by category:
  - Security (NFR-SEC-xxx or NFR-S-xxx)
  - Performance (NFR-P-xxx)
  - Scalability (NFR-S-xxx)
  - Compliance (NFR-C-xxx)
  - Accessibility (NFR-A-xxx)
- Integration requirements (INT-xxx) count
- Data requirements (DR-xxx) count

**From `projects/{project-dir}/vendors/{vendor}/hld-v*.md`** (if exists):
- Table of contents or section headings
- Architecture overview section
- Technology stack / technology choices
- Security architecture section
- Deployment model (cloud provider, regions, availability zones)
- Integration patterns (APIs, events, messaging)
- Data architecture section
- Observability/monitoring approach

**From `projects/{project-dir}/vendors/{vendor}/dld-v*.md`** (if exists):
- Detailed component design
- API specifications
- Infrastructure as Code references
- Testing strategy
- CI/CD pipeline description

**From compliance assessments** (if exist):
- `ARC-*-TCOP-*.md` - TCoP point scores
- `ARC-*-SECD-*.md` - NCSC CAF assessment results
- `ARC-*-SECD-MOD-*.md` - MOD CAAT assessment
- `ARC-*-AIPB-*.md` - AI principles scores
- `ARC-*-ATRS-*.md` - Algorithmic transparency

**From other artifacts**:
- Any `ARC-*-DATA-*.md` file - Entity-relationship diagram, GDPR compliance
- Any `ARC-*-TRAC-*.md` file - Requirements coverage
- `ARC-*-SNOW-*.md` - Operational design
- Any `ARC-*-STKE-*.md` file - Business drivers
- Any `ARC-*-RISK-*.md` file - Risk mitigation plans

### 5. Assess Each Principle

**FOR EACH principle extracted** from ARC-000-PRIN-*.md:

#### A. Evidence Search

Look for evidence of compliance in project artifacts:

**Requirements Evidence**:
- Does ARC-*-REQ-*.md address this principle?
- Are there specific requirements (BR/FR/NFR) supporting this principle?
- Example: Security principle → Check for NFR-SEC-xxx requirements

**Design Evidence**:
- Does HLD/DLD demonstrate implementation of this principle?
- Are there design decisions explicitly addressing this principle?
- Example: Scalability principle → Check for auto-scaling, load balancing in HLD

**Validation Gates Evidence**:
- For each validation gate defined in the principle, check if satisfied
- Example: "Load testing demonstrates capacity growth" → Look for test results

**Compliance Assessment Evidence**:
- Do compliance assessments (TCoP, Secure by Design) validate this principle?
- Example: Security principle → Check ARC-*-SECD-*.md findings

#### B. RAG Status Assignment

Assign ONE of these statuses:

**🔴 RED (Non-Compliant)**:
- Principle is directly VIOLATED (design contradicts principle)
- No evidence of compliance AND no plan to comply
- Critical gaps with no remediation plan

**Criteria for RED**:
- Design explicitly violates principle (e.g., manual deployment when IaC principle exists)
- Security principle violated with no compensating controls
- No requirements or design addressing critical principle

**🟠 AMBER (Partial Compliance)**:
- Some evidence exists (typically requirements acknowledge principle)
- Design addresses principle but implementation gaps remain
- Clear remediation path defined with target dates
- "Principle in progress" - work underway but incomplete

**Criteria for AMBER**:
- Requirements exist but design incomplete
- Design exists but implementation/testing incomplete
- Some validation gates passed, others failed
- Gaps identified with remediation plan

**🟢 GREEN (Fully Compliant)**:
- Strong evidence across MULTIPLE artifacts (requirements + design + tests/assessments)
- Most or all validation gates satisfied
- No significant gaps identified

**Criteria for GREEN**:
- Requirements clearly address principle
- Design demonstrates implementation
- Validation evidence exists (tests, assessments, operational metrics)
- All or most validation gates passed

**⚪ NOT ASSESSED (Insufficient Evidence)**:
- Project too early in lifecycle (Discovery phase, no requirements yet)
- Artifacts needed for assessment don't exist yet
- Principle applies to later phases (e.g., operational principles before Go-Live)

**Criteria for NOT ASSESSED**:
- Project phase too early (Discovery with no requirements)
- Principle requires implementation evidence but only requirements exist
- Assessment deferred to later gate by design

#### C. Gap Identification

**If AMBER or RED** - identify specific gaps:

For each gap:
- **Description**: What's missing?
- **Impact**: What risk does this gap create?
- **Evidence Missing**: What artifact/proof is absent?
- **Remediation**: How can this gap be closed?
- **Owner**: Who should remediate? (suggest role)
- **Target Date**: When should this be fixed? (next gate)

**Example Gap**:
```
Gap: No load testing performed
Impact: Cannot validate system meets performance requirements under load
Evidence Missing: Load test results, performance metrics
Remediation: Conduct load testing with 10,000 concurrent users per NFR-P-001
Owner: Performance Engineer
Target Date: Before Beta gate (2025-02-15)
```

#### D. Recommendations

Generate actionable next steps:

**For RED principles**:
- IMMEDIATE actions required before proceeding to next gate
- OR exception request process if compliance impossible
- Assign clear ownership and deadlines

**For AMBER principles**:
- Actions to achieve GREEN status before next gate
- Evidence gathering needed (tests, threat models, etc.)
- Track in project backlog with target dates

**For GREEN principles**:
- How to maintain compliance (continuous monitoring)
- Next reassessment trigger (phase change, major design change)

**For NOT ASSESSED principles**:
- When to reassess (which gate/phase)
- What artifacts needed before assessment possible

### 6. Generate Assessment Document

Use the **Write tool** to create:
`projects/{project-dir}/ARC-{PROJECT_ID}-PRCO-v1.0.md`

**Document Structure** (see template below)

**IMPORTANT**: Use Write tool, not output to user. Document will be 500-2000 lines depending on:
- Number of principles (varies by organization)
- Number of artifacts available (more artifacts = more evidence)
- Number of gaps identified (RED/AMBER principles = more detail)

### 7. Show Summary to User

Display concise summary (NOT full document):

```
✅ Principles compliance assessment generated

📊 **Overall Compliance Summary**:
   - [X] principles assessed
   - 🟢 GREEN: [X] principles ([%])
   - 🟠 AMBER: [X] principles ([%])
   - 🔴 RED: [X] principles ([%])
   - ⚪ NOT ASSESSED: [X] principles ([%])

[IF RED > 0:]
⚠️ **Critical Issues**: [X] RED principle(s) require immediate attention:
   - [Principle Name]: [Brief description]
   [List all RED principles]

[IF AMBER > 0:]
📋 **Gaps Identified**: [X] AMBER principle(s) with remediation needed:
   - [Principle Name]: [Brief gap description]
   [List all AMBER principles]

📄 **Document**: projects/{project-dir}/ARC-{PROJECT_ID}-PRIN-COMP-v{VERSION}.md

[OVERALL RECOMMENDATION:]
🔍 **Recommendation**:
   [IF RED > 0:] ❌ BLOCK - Address RED principles before proceeding to next gate
   [IF AMBER > 0 AND RED == 0:] ⚠️ CONDITIONAL APPROVAL - Remediate AMBER principles by [next gate]
   [IF ALL GREEN OR NOT ASSESSED:] ✅ PROCEED - All assessed principles compliant

**Next Steps**:
1. Review detailed assessment in generated document
2. [IF RED:] Assign remediation owners for RED principles immediately
3. [IF AMBER:] Track AMBER remediation actions in project backlog
4. [IF RED AND no remediation possible:] Submit exception requests with justification
5. Schedule next assessment at [next gate/phase]
```

## Document Structure Template

```markdown
# Architecture Principles Compliance Assessment

## Document Information

| Field | Value |
|-------|-------|
| **Document ID** | ARC-{PROJECT_ID}-PRIN-COMP-v1.0 |
| **Project** | {PROJECT_NAME} (Project {PROJECT_ID}) |
| **Document Type** | Principles Compliance Assessment |
| **Classification** | [OFFICIAL / OFFICIAL-SENSITIVE] |
| **Assessment Date** | {YYYY-MM-DD} |
| **Project Phase** | [Discovery / Alpha / Beta / Live] |
| **Assessor** | ArcKit AI + {USER_NAME} |
| **Principles Source** | `projects/000-global/ARC-000-PRIN-*.md` ({DATE}) |
| **Status** | [DRAFT / FINAL] |

## Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | {DATE} | ArcKit AI | Initial assessment |

---

## Executive Summary

**Purpose**: This document assesses project compliance with enterprise architecture principles defined in `projects/000-global/ARC-000-PRIN-*.md`. This is a point-in-time assessment for the {PHASE} phase gate review.

**Scope**: Assessment covers all {N} architecture principles against available project artifacts.

**Overall Compliance**: {N} principles assessed

| Status | Count | Percentage | Description |
|--------|-------|------------|-------------|
| 🟢 GREEN | {N} | {%} | Fully compliant with strong evidence |
| 🟠 AMBER | {N} | {%} | Partial compliance, gaps with remediation plan |
| 🔴 RED | {N} | {%} | Non-compliant or principle violated |
| ⚪ NOT ASSESSED | {N} | {%} | Insufficient artifacts to assess |

**Critical Issues**: [{N} RED-status principles requiring immediate attention / None identified]

[IF RED > 0:]
**RED Principles** (CRITICAL):
1. **{Principle Name}** - {Brief description of violation}
2. [List all RED principles]

**Recommendation**: ❌ **BLOCK progression to next gate** until RED principles remediated OR exceptions approved by CTO/CIO.

[IF RED == 0 AND AMBER > 0:]
**Recommendation**: ⚠️ **CONDITIONAL APPROVAL** - Proceed with tracked remediation for AMBER principles. Target completion by {next gate}.

[IF ALL GREEN OR NOT ASSESSED:]
**Recommendation**: ✅ **PROCEED** - All assessed principles show compliance. Continue to next gate.

**Next Assessment**: {Phase name + target date}

---

## Compliance Scorecard

| # | Principle Name | Status | Evidence Count | Key Gaps | Next Action |
|---|----------------|--------|----------------|----------|-------------|
| 1 | {Principle Name} | [🔴🟠🟢⚪] | {N} artifacts | [Gap summary] | [Action summary] |
| 2 | {Principle Name} | [🔴🟠🟢⚪] | {N} artifacts | [Gap summary] | [Action summary] |
| ... | ... | ... | ... | ... | ... |

**Legend**:
- 🔴 RED: Non-compliant, principle violated or no compliance plan
- 🟠 AMBER: Partial compliance, gaps identified with remediation plan
- 🟢 GREEN: Fully compliant with strong evidence
- ⚪ NOT ASSESSED: Insufficient artifacts or too early in project lifecycle

---

## Detailed Principle Assessment

[REPEAT THIS SECTION FOR EACH PRINCIPLE DYNAMICALLY]

### {#}. {Principle Name} - Status: [🔴🟠🟢⚪]

**Principle Statement** (from ARC-000-PRIN-*.md):
> {Quote the principle statement verbatim}

**Rationale** (why this principle exists):
> {Quote the rationale}

---

#### Evidence Analysis

**Evidence Found**:

[DYNAMICALLY GENERATE BASED ON ARTIFACTS]

**Requirements Coverage**:
[IF ARC-*-REQ-*.md exists:]
- ✅ {N} requirements address this principle:
  - {REQ-ID}: "{Requirement text}" (line {N})
  - {REQ-ID}: "{Requirement text}" (line {N})
  - [List relevant requirements with file:line references]
- [OR]
- ❌ No requirements found addressing this principle

**Design Evidence**:
[IF HLD exists:]
- ✅ **HLD Section {N} "{Section Title}"** (lines {N-M}):
  - {Brief description of how design addresses principle}
  - {Quote key design decisions}
- [OR]
- ❌ No design evidence found in HLD

[IF DLD exists:]
- ✅ **DLD Section {N} "{Section Title}"** (lines {N-M}):
  - {Detailed implementation approach}
- [OR]
- ⚪ DLD not yet created (expected at Beta phase)

**Implementation Evidence**:
[IF implementation artifacts exist:]
- ✅ Infrastructure as Code: `{file path}` (lines {N-M})
- ✅ CI/CD pipeline: `{file path}`
- ✅ Test results: `{file path}` - {pass/fail status}
- [OR]
- ⚪ Implementation not yet started (project in {phase})

**Compliance Assessment Evidence**:
[IF compliance docs exist:]
- ✅ **TCoP Point {N}**: {Assessment result}
- ✅ **Secure by Design - {Control}**: {Assessment result}
- ✅ **AI Playbook Principle {N}**: {Assessment result}
- [OR]
- ⚪ Compliance assessments not yet performed

**Validation Evidence**:
[IF tests/metrics exist:]
- ✅ Load test results: {summary}
- ✅ Penetration test: {summary}
- ✅ Monitoring dashboard: {link/description}
- [OR]
- ❌ No validation evidence found

---

#### Validation Gates Status

[IF principle defines validation gates in ARC-000-PRIN-*.md:]

[FOR EACH validation gate - quote from principle definition]:
- [x] **"{Validation gate text}"**
  - **Status**: [✅ PASS / ❌ FAIL / ⚪ N/A / 🔄 IN PROGRESS]
  - **Evidence**: {Specific file:section:line reference OR gap description}

Example:
- [x] **"System can scale horizontally (add more instances)"**
  - **Status**: ✅ PASS
  - **Evidence**: HLD Section 5.2 "Auto-scaling Groups" - describes horizontal scaling from 2 to 20 instances based on CPU utilization

- [ ] **"Load testing demonstrates capacity growth with added resources"**
  - **Status**: ❌ FAIL
  - **Evidence**: No load test results found. Required before Beta gate per NFR-P-001.

[IF no validation gates defined:]
- ⚪ No validation gates defined for this principle in ARC-000-PRIN-*.md

---

#### Assessment: [🔴🟠🟢⚪]

**Status Justification**:

[FOR 🟢 GREEN - Example:]
This principle is **fully compliant** with strong evidence:
- Requirements clearly define {requirement type} addressing principle (NFR-{XXX}-{NNN})
- HLD Section {N} demonstrates implementation approach with {technology/pattern}
- {Validation evidence} confirms principle satisfaction
- {N} of {M} validation gates passed
- No significant gaps identified

[FOR 🟠 AMBER - Example:]
This principle is **partially compliant** with gaps identified:
- Requirements acknowledge principle ({N} requirements found)
- HLD describes approach (Section {N}) but implementation incomplete
- {Validation gates} not yet satisfied
- Clear remediation path defined (see Gaps section)
- Expected to achieve GREEN by {next gate} phase

[FOR 🔴 RED - Example:]
This principle is **violated** or non-compliant:
- HLD Section {N} describes {approach} which directly contradicts principle requirement for {expected approach}
- No requirements addressing this mandatory principle
- No remediation plan found
- No exception request submitted
- **CRITICAL**: Requires immediate remediation or CTO/CIO exception approval

[FOR ⚪ NOT ASSESSED - Example:]
This principle **cannot be assessed** at current project phase:
- Project currently in {phase} phase
- Principle requires {artifact type} which doesn't exist yet
- Assessment deferred to {next phase} gate
- Expected artifacts: {list}
- No concerns at this stage - timing appropriate

---

#### Gaps Identified

[IF AMBER OR RED - DYNAMICALLY LIST ALL GAPS]

**Gap {#}: {Gap Title}**
- **Description**: {What is missing or wrong}
- **Impact**: {Business/technical risk this gap creates}
- **Evidence Missing**: {What artifact/proof is absent}
- **Severity**: [CRITICAL / HIGH / MEDIUM / LOW]
- **Remediation**: {Specific actions to close gap}
- **Responsible**: {Suggested role - e.g., "Solution Architect", "Security Engineer"}
- **Target Date**: {Next gate date or specific date}
- **Dependencies**: {What else needs to happen first}

[Example:]
**Gap 1: No load testing performed**
- **Description**: System scalability not validated under load. NFR-P-001 requires support for 10,000 concurrent users, but no load test performed.
- **Impact**: Risk of production performance failure. Cannot validate auto-scaling configuration works as designed.
- **Evidence Missing**: Load test results, performance metrics under stress
- **Severity**: HIGH
- **Remediation**:
  1. Define load test scenarios based on NFR-P requirements
  2. Execute load tests using {tool suggestion based on stack}
  3. Validate auto-scaling triggers at 70% CPU threshold (per HLD Section 5.2)
  4. Document results and update compliance assessment
- **Responsible**: Performance Engineer / QA Lead
- **Target Date**: Before Beta gate review (2025-02-15)
- **Dependencies**: Auto-scaling configuration must be deployed to test environment

[IF NO GAPS:]
✅ No gaps identified - principle fully satisfied

---

#### Recommendations

**Immediate Actions** [IF RED]:
1. {Action} - Owner: {Role} - Deadline: {Date}
2. [List critical remediations required before proceeding]

**OR**

**Exception Request** [IF RED AND compliance impossible]:
- If compliance is not feasible, submit formal exception request to CTO/CIO including:
  - Justification for non-compliance
  - Compensating controls (if any)
  - Business impact of enforcing compliance
  - Time-bound expiry date
  - Remediation plan for future compliance

**Before Next Gate** [IF AMBER]:
1. {Action} - Owner: {Role} - Deadline: {Next gate date}
2. [List actions to achieve GREEN status]

**Continuous Monitoring** [IF GREEN]:
- Maintain compliance through {monitoring approach}
- Reassess at {next gate or quarterly}
- Key metrics to track: {metric list}

**Next Assessment Trigger** [IF NOT ASSESSED]:
- Reassess during {phase} gate after {artifacts} are created
- Expected assessment date: {date}

---

[END OF PRINCIPLE SECTION - REPEAT FOR ALL PRINCIPLES]

---

## Exception Register

[IF ANY EXCEPTIONS EXIST OR ARE RECOMMENDED]

| Exception ID | Principle | Status | Justification | Approved By | Approval Date | Expiry Date | Remediation Plan |
|--------------|-----------|--------|---------------|-------------|---------------|-------------|------------------|
| EXC-{NNN} | {Principle Name} | [REQUESTED / APPROVED / EXPIRED / REMEDIATED] | {Why exception needed} | {Name + Role} | {YYYY-MM-DD} | {YYYY-MM-DD} | {How/when achieve compliance} |

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

1. **{Principle Name}** - {Brief description}
   - **Impact**: {Risk description}
   - **Action Required**: {Immediate remediation or exception request}
   - **Owner**: {Role}
   - **Deadline**: {Date - typically ASAP or before next gate}

[Repeat for all RED principles]

**Gate Decision**: ❌ **RECOMMEND BLOCKING** progression to {next phase} until RED principles remediated OR formal exceptions approved by CTO/CIO.

### Gaps Requiring Remediation

[IF AMBER PRINCIPLES EXIST:]

**⚠️ REMEDIATION REQUIRED** - The following principles have gaps:

1. **{Principle Name}** - {Brief gap description}
   - **Current Status**: AMBER
   - **Target Status**: GREEN by {next gate}
   - **Key Actions**: {Action summary}
   - **Owner**: {Role}

[Repeat for all AMBER principles]

**Gate Decision**: ⚠️ **CONDITIONAL APPROVAL** - May proceed to {next phase} with tracked remediation. Review progress at {next gate}.

### Actions Required Before Next Gate

[PRIORITIZED REMEDIATION ACTIONS - ALL RED AND AMBER]

**Priority 1 - CRITICAL** (RED principles - BLOCKING):
1. {Action} - Owner: {Role} - Due: {ASAP date}
2. [List all critical actions]

**Priority 2 - HIGH** (AMBER principles - required for next gate):
1. {Action} - Owner: {Role} - Due: {Next gate date}
2. [List all high-priority actions]

**Priority 3 - MEDIUM** (Enhancements - improve compliance):
1. {Action} - Owner: {Role} - Due: {Future date}
2. [List nice-to-have improvements]

### Next Assessment

**Recommended Next Assessment**: {Phase name} gate review on {target date}

**Reassessment Triggers**:
- Major architecture changes or design revisions
- New compliance requirements introduced
- Technology stack changes
- Quarterly reviews for Live systems (after Go-Live)
- Exception expiry approaching
- Remediation actions completed (verify GREEN status)

**Expected Progress by Next Assessment**:
- RED principles → AMBER or GREEN (with remediation)
- AMBER principles → GREEN (gaps closed)
- NOT ASSESSED principles → Assessed (artifacts now available)

---

## Artifacts Reviewed

This assessment was based on the following artifacts:

**Architecture Principles** (source of truth):
- ✅ `projects/000-global/ARC-000-PRIN-*.md` - {DATE} - {N} principles defined

**Project Artifacts** (evidence sources):
[LIST ALL FILES ACTUALLY READ WITH DATES:]
- ✅ `projects/{project-dir}/ARC-*-REQ-*.md` - {DATE} - {N} requirements
- ✅ `projects/{project-dir}/vendors/{vendor}/hld-v1.md` - {DATE} - {N} sections
- ✅ `projects/{project-dir}/vendors/{vendor}/dld-v1.md` - {DATE} - {N} sections
- ✅ `projects/{project-dir}/ARC-*-TCOP-*.md` - {DATE} - {N} points assessed
- ✅ `projects/{project-dir}/ARC-*-SECD-*.md` - {DATE} - {N} controls assessed
- ✅ `projects/{project-dir}/ARC-*-DATA-*.md` - {DATE} - {N} entities
- ✅ `projects/{project-dir}/ARC-*-TRAC-*.md` - {DATE}
- [List all available artifacts]

**Artifacts Not Available** (limits assessment accuracy):
[LIST EXPECTED BUT MISSING ARTIFACTS:]
- ❌ `projects/{project-dir}/vendors/{vendor}/dld-v1.md` - Not yet created
- ❌ Threat model - Expected for Beta phase
- ❌ Load test results - Expected before Go-Live
- ❌ Penetration test report - Expected before Go-Live
- [List artifacts that would improve assessment if present]

**Assessment Limitations**:
- {Phase} phase - implementation evidence limited
- {Missing artifact} not available - {principle} assessment less accurate
- [Note any constraints on assessment accuracy]

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
- Requirements with acceptance criteria (NFR requirements especially strong)
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

### Validation Approach

For each principle:
1. **Extract** principle definition and validation gates from ARC-000-PRIN-*.md
2. **Search** for evidence across all available project artifacts
3. **Link** evidence to specific files, sections, and line numbers
4. **Assess** validation gates (pass/fail/n/a for each)
5. **Assign** RAG status based on evidence strength and validation coverage
6. **Identify** gaps where evidence is weak or missing
7. **Recommend** specific actions to achieve GREEN status

---

**Generated by**: ArcKit `/arckit.principles-compliance` command
**Generated on**: {YYYY-MM-DD HH:MM UTC}
**ArcKit Version**: {VERSION}
**AI Model**: {MODEL_NAME}
**Command Arguments**: {USER_INPUT}
```

---

## Post-Generation Actions

After generating the assessment document:

1. **Commit to Git** (if project is git-initialized):
   ```bash
   git add projects/{project-dir}/ARC-{PROJECT_ID}-PRIN-COMP-v{VERSION}.md
   git commit -m "docs: principles compliance assessment for {phase} gate"
   ```

2. **Suggest Follow-up Commands**:
   ```
   📋 **Related Commands**:
   - /arckit.analyze - Run comprehensive gap analysis
   - /arckit.hld-review - Review vendor HLD against principles
   - /arckit.dld-review - Review vendor DLD against principles
   - /arckit.service-assessment - GDS Service Standard assessment (UK Gov)
   ```

3. **Track in Project**:
   Suggest adding remediation actions to project tracking:
   - Jira tickets for RED/AMBER gaps
   - Assign owners for each remediation action
   - Set target completion dates aligned with next gate review

---

## Example Output Scenarios

### Scenario 1: Discovery Phase (Minimal Artifacts)

**Input**: Project in Discovery, only stakeholders and risk register exist

**Expected Output**:
- Most principles: ⚪ NOT ASSESSED (too early)
- A few principles: 🟠 AMBER (if stakeholder/risk docs address them)
- Overall: "Assessment deferred to Alpha gate after requirements created"

### Scenario 2: Alpha Phase (Requirements + HLD)

**Input**: Project in Alpha, requirements and HLD exist

**Expected Output**:
- Strategic principles: 🟢 GREEN (requirements + HLD evidence)
- Security principles: 🟠 AMBER (requirements exist, validation pending)
- Operational principles: ⚪ NOT ASSESSED (too early)
- Overall: "Conditional approval, operational validation at Beta"

### Scenario 3: Beta Phase (Complete Design)

**Input**: Project in Beta, requirements + HLD + DLD exist

**Expected Output**:
- Most principles: 🟢 GREEN (strong evidence)
- Some principles: 🟠 AMBER (testing pending)
- Operational principles: 🟠 AMBER (post-deployment validation needed)
- Overall: "Proceed to Go-Live after AMBER gaps closed"

### Scenario 4: Principle Violation Detected

**Input**: HLD describes manual deployment, violates IaC principle

**Expected Output**:
- IaC principle: 🔴 RED (direct violation)
- Other principles: Mix of GREEN/AMBER
- Overall: "BLOCK - Critical violation of Infrastructure as Code principle"
- Recommendation: "Revise deployment approach OR submit exception request"

---

## Notes for AI Model

**Critical Implementation Points**:

1. **Dynamic Extraction**: NEVER assume 16 principles exist. Extract however many are in ARC-000-PRIN-*.md.

2. **Evidence Specificity**: ALWAYS link to file:section:line. Bad: "Design addresses this". Good: "HLD Section 4.2 'Security Architecture' (lines 156-203) describes MFA implementation".

3. **Honest Assessment**: Don't inflate scores. If evidence is weak, mark AMBER or RED. False GREEN status harms governance.

4. **Document Length**: Use Write tool. Document will be 500-2000 lines. Do NOT output full document to user - show summary only.

5. **Validation Gates**: If principle defines validation gates, assess each gate individually. This provides granular, actionable feedback.

6. **Context Sensitivity**: NOT ASSESSED is appropriate for Discovery phase. RED is appropriate when principle violated. Choose status based on project context, not to "look good".

7. **Actionable Recommendations**: Every AMBER/RED principle needs specific, actionable remediation steps with owners and dates. Avoid vague advice like "improve security".

8. **Exception Handling**: If RED principle cannot be remediated, guide user through exception request process with CTO/CIO approval.
