---
description: Perform comprehensive governance quality analysis across architecture artifacts (requirements, principles, designs, assessments)
---

## User Input

```text
$ARGUMENTS
```

## Goal

Identify inconsistencies, gaps, ambiguities, and compliance issues across all architecture governance artifacts before implementation or procurement. This command performs **non-destructive, read-only analysis** and produces a structured report with actionable recommendations.

## Operating Constraints

**STRICTLY READ-ONLY**: Do **not** modify any files. Output a structured analysis report only.

**Architecture Principles Authority**: The architecture principles (`.arckit/memory/architecture-principles.md`) are **non-negotiable**. Any conflicts with principles are automatically CRITICAL and require adjustment of requirements, designs, or vendor proposals—not dilution or reinterpretation of the principles.

**UK Government Compliance Authority** (if applicable): TCoP, AI Playbook, and ATRS compliance are mandatory for UK government projects. Non-compliance is CRITICAL.

## Execution Steps

### 1. Discover Project Context

Identify the project directory to analyze:
- If user specifies project: Use specified project directory
- If only one project exists: Analyze that project
- If multiple projects: Ask user which project to analyze

Expected structure:
```
projects/
└── {project-dir}/
    ├── requirements.md
    ├── sow.md (if vendor procurement)
    ├── evaluation-criteria.md (if vendor procurement)
    ├── vendors/
    │   └── {vendor-name}/
    │       ├── hld-v1.md
    │       ├── dld-v1.md
    │       └── reviews/
    ├── tcop-assessment.md (if UK Gov)
    ├── ai-playbook-assessment.md (if UK Gov AI)
    ├── atrs-record.md (if UK Gov AI)
    └── traceability-matrix.md
```

### 2. Load Artifacts (Progressive Disclosure)

Load only minimal necessary context from each artifact:

**From `.arckit/memory/architecture-principles.md`** (if exists):
- Strategic principles (Cloud-First, API-First, etc.)
- Security principles
- Data principles
- Technology standards
- Compliance requirements

**From `projects/{project-dir}/requirements.md`** (if exists):
- Business requirements (BR-xxx)
- Functional requirements (FR-xxx)
- Non-functional requirements (NFR-xxx)
  - Security (NFR-S-xxx)
  - Performance (NFR-P-xxx)
  - Compliance (NFR-C-xxx)
  - Accessibility (NFR-A-xxx)
- Integration requirements (INT-xxx)
- Data requirements (DR-xxx)
- Success criteria

**From `projects/{project-dir}/sow.md`** (if exists):
- Scope of work
- Deliverables
- Technical requirements
- Timeline and budget

**From `projects/{project-dir}/vendors/{vendor}/hld-v*.md`** (if exists):
- Architecture overview
- Component design
- Technology stack
- Security architecture
- Data architecture

**From `projects/{project-dir}/vendors/{vendor}/dld-v*.md`** (if exists):
- Component specifications
- API contracts
- Database schemas
- Security implementation

**From UK Government Assessments** (if exist):
- `tcop-assessment.md`: TCoP compliance status
- `ai-playbook-assessment.md`: AI Playbook compliance status
- `atrs-record.md`: ATRS record completeness

### 3. Build Semantic Models

Create internal representations (do not include raw artifacts in output):

**Requirements Inventory**:
- Each requirement with ID, type, priority (MUST/SHOULD/MAY)
- Map to principles (which principles does this requirement satisfy?)
- Map to success criteria

**Principles Compliance Matrix**:
- Each principle with validation criteria
- Which requirements/designs satisfy each principle?

**Design Coverage Matrix**:
- Which requirements are addressed in HLD/DLD?
- Which components implement which requirements?

**UK Government Compliance Matrix** (if applicable):
- TCoP: 13 points with compliance status
- AI Playbook: 10 principles + 6 themes with compliance status
- ATRS: Mandatory fields completion status

### 4. Detection Passes (Token-Efficient Analysis)

Focus on high-signal findings. Limit to 50 findings total; aggregate remainder in overflow summary.

#### A. Requirements Quality Analysis

**Duplication Detection**:
- Near-duplicate requirements across BR/FR/NFR categories
- Redundant requirements that should be consolidated

**Ambiguity Detection**:
- Vague adjectives lacking measurable criteria ("fast", "secure", "scalable", "intuitive")
- Missing acceptance criteria for functional requirements
- Unresolved placeholders (TODO, TBD, TBC, ???, `<placeholder>`)

**Underspecification**:
- Requirements with verbs but missing measurable outcomes
- Missing non-functional requirements (no security, no performance, no compliance)
- Missing data requirements (system handles sensitive data but no DR-xxx)
- Missing integration requirements (integrates with external systems but no INT-xxx)

**Priority Issues**:
- All requirements marked as MUST (no prioritization)
- No MUST requirements (everything is optional)
- Conflicting priorities

#### B. Architecture Principles Alignment

**Principle Violations** (CRITICAL):
- Requirements or designs that violate architecture principles
- Technology choices that conflict with approved stack
- Security approaches that violate security-by-design principle
- Cloud architecture that violates Cloud-First principle

**Missing Principle Coverage**:
- Principles not reflected in requirements
- Principles not validated in design reviews

**Principle Drift**:
- Inconsistent interpretation of principles across artifacts

#### C. Requirements → Design Traceability

**Coverage Gaps**:
- Requirements with zero design coverage (not addressed in HLD/DLD)
- Critical MUST requirements not covered
- Security requirements (NFR-S-xxx) not reflected in security architecture
- Performance requirements (NFR-P-xxx) not validated in design
- Compliance requirements (NFR-C-xxx) not addressed

**Orphan Design Elements**:
- Components in HLD/DLD not mapped to any requirement
- Technology choices not justified by requirements
- Architecture complexity not justified by requirements

**Traceability Completeness**:
- Does traceability matrix exist?
- Are all requirements mapped?
- Are all design elements mapped?

#### D. Vendor Procurement Analysis (if applicable)

**SOW Quality**:
- SOW requirements match requirements.md?
- All technical requirements from requirements.md included in SOW?
- Missing evaluation criteria?
- Ambiguous acceptance criteria?

**Vendor Evaluation**:
- Evaluation criteria align with requirements priorities?
- Scoring methodology fair and unbiased?
- All critical requirements included in evaluation?

**Vendor Design Review**:
- HLD addresses all SOW requirements?
- Technology stack matches approved standards?
- Security architecture meets NFR-S requirements?
- Performance architecture meets NFR-P requirements?

#### E. UK Government Compliance (if applicable)

**Technology Code of Practice (TCoP)**:
- Assessment exists?
- All 13 points assessed?
- Critical issues resolved?
- Evidence provided for each point?

**AI Playbook** (for AI systems):
- Assessment exists for AI/ML systems?
- Risk level determined (High/Medium/Low)?
- All 10 principles assessed?
- All 6 ethical themes assessed?
- Mandatory assessments completed (DPIA, EqIA, Human Rights)?
- Bias testing completed?
- Human oversight model defined?

**ATRS** (for AI systems):
- ATRS record exists for algorithmic tools?
- Tier 1 (public summary) completed?
- Tier 2 (technical details) completed?
- All mandatory fields filled?
- Ready for GOV.UK publication?

**Compliance Alignment**:
- Requirements aligned with TCoP?
- Design complies with TCoP (Cloud First, Open Standards, Secure)?
- AI requirements comply with AI Playbook?
- ATRS record reflects requirements and design?

#### F. Consistency Across Artifacts

**Terminology Drift**:
- Same concept named differently across files
- Inconsistent capitalization/formatting of terms
- Conflicting definitions

**Data Model Consistency**:
- Data entities referenced in requirements match design
- Database schemas in DLD match data requirements (DR-xxx)
- Data sharing agreements align across artifacts

**Technology Stack Consistency**:
- Stack choices in HLD match principles
- Technology in DLD matches HLD
- Third-party dependencies consistently listed

**Timeline/Budget Consistency** (if vendor procurement):
- SOW timeline realistic for requirements scope?
- Budget adequate for requirements complexity?
- Vendor proposal timeline/budget match SOW?

#### G. Security & Compliance Analysis

**Security Coverage**:
- Security requirements (NFR-S-xxx) exist?
- Threat model documented?
- Security architecture in HLD?
- Security implementation in DLD?
- Security testing plan?

**Compliance Coverage**:
- Compliance requirements (NFR-C-xxx) exist?
- Regulatory requirements identified (GDPR, PCI-DSS, HIPAA, etc.)?
- Compliance validated in design?
- Audit requirements addressed?

**Data Protection**:
- Personal data handling defined?
- GDPR/UK GDPR compliance addressed?
- Data retention policy defined?
- Data breach procedures defined?

### 5. Severity Assignment

Use this heuristic to prioritize findings:

**CRITICAL**:
- Violates architecture principles (MUST)
- Missing core artifact (no requirements.md)
- MUST requirement with zero design coverage
- UK Gov: TCoP non-compliance for mandatory points
- UK Gov: AI Playbook blocking issues for high-risk AI
- UK Gov: Missing mandatory ATRS for central government AI
- Security requirement with no design coverage
- Compliance requirement with no validation

**HIGH**:
- Duplicate or conflicting requirements
- Ambiguous security/performance attribute
- Untestable acceptance criterion
- Missing non-functional requirements category (no security, no performance)
- Vendor design doesn't address SOW requirements
- UK Gov: TCoP partial compliance with gaps
- UK Gov: AI Playbook non-compliance for medium-risk AI

**MEDIUM**:
- Terminology drift
- Missing optional non-functional requirement coverage
- Underspecified edge case
- Minor traceability gaps
- Documentation incomplete
- UK Gov: TCoP minor gaps

**LOW**:
- Style/wording improvements
- Minor redundancy not affecting execution
- Documentation formatting
- Non-critical missing optional fields

### 6. Produce Compact Analysis Report

Output a Markdown report (no file writes) with the following structure:

```markdown
# Architecture Governance Analysis Report

**Project**: {project-name}
**Date**: {current-date}
**Analyzed By**: ArcKit v{version}

---

## Executive Summary

**Overall Status**: ✅ Ready / ⚠️ Issues Found / ❌ Critical Issues

**Key Metrics**:
- Total Requirements: {count}
- Requirements Coverage: {percentage}%
- Critical Issues: {count}
- High Priority Issues: {count}
- Medium Priority Issues: {count}
- Low Priority Issues: {count}

**Recommendation**: [PROCEED / RESOLVE CRITICAL ISSUES FIRST / MAJOR REWORK NEEDED]

---

## Findings Summary

| ID | Category | Severity | Location(s) | Summary | Recommendation |
|----|----------|----------|-------------|---------|----------------|
| R1 | Requirements Quality | HIGH | requirements.md:L45-52 | Duplicate security requirements | Merge NFR-S-001 and NFR-S-005 |
| P1 | Principles Alignment | CRITICAL | requirements.md:L120 | Violates Cloud-First principle | Change to cloud-native architecture |
| T1 | Traceability | HIGH | No HLD coverage | NFR-P-002 (10K TPS) not addressed | Add performance architecture section to HLD |
| UK1 | UK Gov Compliance | CRITICAL | Missing DPIA | AI system requires DPIA before deployment | Complete DPIA for AI Playbook compliance |

---

## Requirements Analysis

### Requirements Coverage Matrix

| Requirement ID | Type | Priority | Design Coverage | Tests Coverage | Status |
|----------------|------|----------|-----------------|----------------|--------|
| BR-001 | Business | MUST | ✅ HLD | ❌ Missing | ⚠️ Partial |
| FR-001 | Functional | MUST | ✅ HLD, DLD | ✅ Tests | ✅ Complete |
| NFR-S-001 | Security | MUST | ❌ Missing | ❌ Missing | ❌ Not Covered |

**Statistics**:
- Total Requirements: {count}
- Fully Covered: {count} ({percentage}%)
- Partially Covered: {count} ({percentage}%)
- Not Covered: {count} ({percentage}%)

### Uncovered Requirements (CRITICAL)

| Requirement ID | Priority | Description | Why Critical |
|----------------|----------|-------------|--------------|
| NFR-S-003 | MUST | Encrypt data at rest | Security requirement |
| NFR-P-002 | MUST | Support 10K TPS | Performance critical |

---

## Architecture Principles Compliance

| Principle | Status | Evidence | Issues |
|-----------|--------|----------|--------|
| Cloud-First | ✅ COMPLIANT | AWS architecture in HLD | None |
| API-First | ⚠️ PARTIAL | REST APIs defined, missing OpenAPI specs | Document API contracts |
| Security-by-Design | ❌ NON-COMPLIANT | No threat model, missing security architecture | Add security sections |

**Critical Principle Violations**: {count}

---

## UK Government Compliance Analysis

### Technology Code of Practice (TCoP)

**Overall Score**: {score}/130 ({percentage}%)
**Status**: ✅ Compliant / ⚠️ Partial / ❌ Non-Compliant

| Point | Requirement | Status | Score | Issues |
|-------|-------------|--------|-------|--------|
| 1 | Define User Needs | ✅ | 9/10 | Minor: User research from 2023 (update) |
| 5 | Use Cloud First | ✅ | 10/10 | AWS cloud-native |
| 6 | Make Things Secure | ❌ | 3/10 | Missing: Cyber Essentials, threat model |

**Critical TCoP Issues**: {count}

### AI Playbook (if AI system)

**Risk Level**: HIGH-RISK / MEDIUM-RISK / LOW-RISK
**Overall Score**: {score}/160 ({percentage}%)
**Status**: ✅ Compliant / ⚠️ Partial / ❌ Non-Compliant

**Blocking Issues**:
- [ ] DPIA not completed (MANDATORY for high-risk)
- [ ] No human-in-the-loop (REQUIRED for high-risk)
- [ ] ATRS not published (MANDATORY for central government)

### ATRS (if AI system)

**Completeness**: {percentage}%
**Status**: ✅ Ready for Publication / ⚠️ Incomplete / ❌ Missing

**Missing Mandatory Fields**:
- [ ] Senior Responsible Owner
- [ ] Bias testing results
- [ ] Fallback procedures

---

## Traceability Analysis

**Traceability Matrix**: ✅ Exists / ❌ Missing

**Forward Traceability** (Requirements → Design → Tests):
- Requirements → HLD: {percentage}%
- HLD → DLD: {percentage}%
- DLD → Tests: {percentage}%

**Backward Traceability** (Tests → Requirements):
- Orphan components (not linked to requirements): {count}

**Gap Summary**:
- {count} requirements with no design coverage
- {count} design elements with no requirement justification
- {count} components with no test coverage

---

## Vendor Procurement Analysis

### SOW Quality
**Status**: ✅ Complete / ⚠️ Issues / ❌ Insufficient

**Issues**:
- [ ] SOW missing NFR-P-xxx performance requirements
- [ ] Acceptance criteria ambiguous for deliverable 3
- [ ] Timeline unrealistic for scope (6 months vs 50 requirements)

### Vendor Evaluation
**Evaluation Criteria Defined**: ✅ Yes / ❌ No

**Alignment Check**:
- All MUST requirements in scoring? ✅ Yes / ❌ No
- Scoring methodology fair? ✅ Yes / ⚠️ Issues / ❌ No
- Technical evaluation covers all areas? ✅ Yes / ⚠️ Gaps / ❌ No

### Vendor Design Review
**HLD Review Completed**: ✅ Yes / ❌ No
**DLD Review Completed**: ✅ Yes / ❌ No

**Coverage Analysis**:
| SOW Requirement | HLD Coverage | DLD Coverage | Status |
|-----------------|--------------|--------------|--------|
| Cloud infrastructure | ✅ | ✅ | Complete |
| Security architecture | ❌ | ❌ | Missing |
| Performance (10K TPS) | ⚠️ | ❌ | Insufficient |

---

## Security & Compliance Summary

### Security Posture
- Security requirements defined: ✅ Yes / ❌ No
- Threat model documented: ✅ Yes / ❌ No
- Security architecture in HLD: ✅ Yes / ⚠️ Partial / ❌ No
- Security implementation in DLD: ✅ Yes / ⚠️ Partial / ❌ No
- Security testing plan: ✅ Yes / ❌ No

**Security Coverage**: {percentage}%

### Compliance Posture
- Regulatory requirements identified: ✅ Yes / ❌ No
- GDPR/UK GDPR compliance: ✅ Yes / ⚠️ Partial / ❌ No
- Industry compliance (PCI-DSS, HIPAA, etc.): ✅ Yes / ⚠️ Partial / ❌ No / N/A
- Audit readiness: ✅ Yes / ⚠️ Partial / ❌ No

**Compliance Coverage**: {percentage}%

---

## Recommendations

### Critical Actions (MUST resolve before implementation/procurement)

1. **[P1] Add Cloud-First architecture**: Current design violates Cloud-First principle. Redesign with AWS/Azure/GCP.
2. **[R1] Cover security requirements**: NFR-S-003, NFR-S-007, NFR-S-012 have no design coverage. Add security architecture to HLD.
3. **[UK1] Complete DPIA**: HIGH-RISK AI system requires completed DPIA before deployment (AI Playbook MANDATORY).

### High Priority Actions (SHOULD resolve before implementation/procurement)

1. **[T1] Document API contracts**: Add OpenAPI specifications for all REST APIs.
2. **[T2] Add performance architecture**: NFR-P-002 (10K TPS) not addressed in design. Add performance section to HLD.
3. **[V1] Update SOW acceptance criteria**: Deliverable 3 acceptance criteria too vague. Add measurable criteria.

### Medium Priority Actions (Improve quality)

1. **[Q1] Consolidate duplicate requirements**: Merge NFR-S-001 and NFR-S-005 (identical).
2. **[Q2] Fix terminology drift**: "User" vs "Customer" used inconsistently. Standardize.
3. **[D1] Complete traceability matrix**: Add backward traceability from tests to requirements.

### Low Priority Actions (Optional improvements)

1. **[S1] Improve requirement wording**: Replace "fast" with measurable criteria (e.g., "< 200ms p95").
2. **[S2] Add edge case documentation**: Document edge cases for error handling.

---

## Metrics Dashboard

### Requirement Quality
- Total Requirements: {count}
- Ambiguous Requirements: {count}
- Duplicate Requirements: {count}
- Untestable Requirements: {count}
- **Quality Score**: {percentage}%

### Architecture Alignment
- Principles Compliant: {count}/{total}
- Principles Violations: {count}
- **Alignment Score**: {percentage}%

### Traceability
- Requirements Covered: {count}/{total}
- Orphan Components: {count}
- **Traceability Score**: {percentage}%

### UK Government Compliance (if applicable)
- TCoP Score: {score}/130 ({percentage}%)
- AI Playbook Score: {score}/160 ({percentage}%)
- ATRS Completeness: {percentage}%
- **Compliance Score**: {percentage}%

### Overall Governance Health
**Score**: {percentage}%
**Grade**: A / B / C / D / F

**Grade Thresholds**:
- A (90-100%): Excellent governance, ready to proceed
- B (80-89%): Good governance, minor issues
- C (70-79%): Adequate governance, address high-priority issues
- D (60-69%): Poor governance, major rework needed
- F (<60%): Insufficient governance, do not proceed

---

## Next Steps

### Immediate Actions

1. **If CRITICAL issues exist**: ❌ **DO NOT PROCEED** with implementation/procurement until resolved.
   - Run: `/arckit.requirements` to fix requirements issues
   - Run: `/arckit.hld-review` to address design gaps
   - Run: `/arckit.ai-playbook` (if AI system) to complete mandatory assessments

2. **If only HIGH/MEDIUM issues**: ⚠️ **MAY PROCEED** with caution, but address issues in parallel.
   - Document exceptions for HIGH issues
   - Create remediation plan for MEDIUM issues

3. **If only LOW issues**: ✅ **READY TO PROCEED**
   - Address LOW issues during implementation as improvements

### Suggested Commands

Based on findings, consider running:
- `/arckit.requirements` - Refine requirements to address ambiguity/gaps
- `/arckit.principles` - Update architecture principles if needed
- `/arckit.hld-review` - Re-review HLD after addressing issues
- `/arckit.dld-review` - Re-review DLD after addressing issues
- `/arckit.tcop` - Complete TCoP assessment for UK Gov projects
- `/arckit.ai-playbook` - Complete AI Playbook assessment for AI systems
- `/arckit.atrs` - Generate ATRS record for algorithmic tools
- `/arckit.traceability` - Generate/update traceability matrix
- `/arckit.evaluate` - Update vendor evaluation criteria

### Re-run Analysis

After making changes, re-run analysis:
```bash
/arckit.analyze
```

Expected improvement in scores after addressing findings.

---

## Detailed Findings

(Expand top findings with examples and specific recommendations)

### Finding R1: Duplicate Security Requirements (HIGH)

**Location**: `requirements.md:L45-52` and `requirements.md:L120-125`

**Details**:
```
NFR-S-001: System MUST encrypt data at rest using AES-256
NFR-S-005: All stored data SHALL be encrypted with AES-256 encryption
```

**Issue**: These are duplicate requirements with inconsistent language (MUST vs SHALL).

**Impact**: Confuses implementation team, wastes evaluation points in vendor scoring.

**Recommendation**:
1. Keep NFR-S-001 (clearer wording)
2. Delete NFR-S-005
3. Update traceability matrix

**Estimated Effort**: 10 minutes

---

### Finding P1: Violates Cloud-First Principle (CRITICAL)

**Location**: `requirements.md:L120`, Architecture Principles violation

**Details**:
```
FR-025: System SHALL deploy to on-premise servers in corporate datacenter
```

**Issue**: Violates "Cloud-First" architecture principle defined in `.arckit/memory/architecture-principles.md`. Principle states "MUST use public cloud (AWS/Azure/GCP) unless explicitly justified exception."

**Impact**: Architecture doesn't align with organization standards. Blocks procurement approval.

**Recommendation**:
1. Change FR-025 to require AWS/Azure/GCP deployment
2. OR: Document formal exception with justification (security, regulatory, etc.)
3. Get exception approved by Architecture Review Board

**Estimated Effort**: 2 hours (requirement change + design update)

---

(Continue with detailed findings for top 10-20 issues)

---

## Appendix: Analysis Methodology

**Artifacts Analyzed**:
- {list of files}

**Detection Rules Applied**:
- {count} duplication checks
- {count} ambiguity patterns
- {count} principle validations
- {count} traceability checks

**Analysis Runtime**: {duration}

**Analysis Version**: ArcKit v{version}

---

**END OF ANALYSIS REPORT**
```

### 7. Provide Remediation Guidance

After outputting the report, ask:

> **Would you like me to suggest concrete remediation steps for the top {N} critical/high priority issues?**
>
> I can provide:
> 1. Specific edits to fix requirements
> 2. Design review guidance
> 3. Command sequences to address gaps
> 4. Templates for missing artifacts
>
> (I will NOT make changes automatically - you must approve each action)

## Operating Principles

### Context Efficiency

- **Minimal high-signal tokens**: Focus on actionable findings, not exhaustive documentation
- **Progressive disclosure**: Load artifacts incrementally; don't dump all content into analysis
- **Token-efficient output**: Limit findings table to 50 rows; summarize overflow
- **Deterministic results**: Rerunning without changes should produce consistent IDs and counts

### Analysis Guidelines

- **NEVER modify files** (this is read-only analysis)
- **NEVER hallucinate missing sections** (if absent, report them accurately)
- **Prioritize principle violations** (these are always CRITICAL)
- **Prioritize UK Gov compliance issues** (mandatory for public sector)
- **Use examples over exhaustive rules** (cite specific instances, not generic patterns)
- **Report zero issues gracefully** (emit success report with metrics)
- **Be specific**: Cite line numbers, requirement IDs, exact quotes
- **Be actionable**: Every finding should have a clear recommendation
- **Be fair**: Flag real issues, not nitpicks

### Enterprise Architecture Focus

Unlike Spec Kit's focus on code implementation, ArcKit analyze focuses on:
- **Governance compliance**: Principles, standards, policies
- **Requirements quality**: Completeness, testability, traceability
- **Procurement readiness**: SOW quality, vendor evaluation fairness
- **Design alignment**: Requirements → design traceability
- **UK Government compliance**: TCoP, AI Playbook, ATRS (if applicable)
- **Security & compliance**: Not just mentioned, but architected
- **Decision quality**: Objective, defensible, auditable

## Example Usage

User: `/arckit.analyze`

You should:
1. Identify project (if multiple, ask which)
2. Load artifacts progressively:
   - Architecture principles
   - Requirements (BR, FR, NFR, INT, DR)
   - Designs (HLD, DLD)
   - UK Gov assessments (TCoP, AI Playbook, ATRS)
   - Traceability matrix
3. Run detection passes:
   - Requirements quality (duplication, ambiguity, underspecification)
   - Principles alignment (violations, coverage)
   - Traceability (coverage gaps, orphans)
   - UK Gov compliance (TCoP, AI Playbook, ATRS)
   - Consistency (terminology, data model, tech stack)
   - Security & compliance coverage
4. Assign severity (CRITICAL, HIGH, MEDIUM, LOW)
5. Generate comprehensive report with:
   - Executive summary
   - Findings table
   - Coverage matrices
   - UK Gov compliance dashboard
   - Metrics dashboard
   - Next steps and recommendations
6. Ask if user wants remediation guidance

Example output: "Architecture Governance Analysis Report" with 15 findings (2 CRITICAL, 5 HIGH, 6 MEDIUM, 2 LOW), 85% requirements coverage, TCoP score 92/130 (71%), recommendation: "Resolve 2 CRITICAL issues before procurement"

## Important Notes

- This is **read-only analysis** - no files are modified
- Run `/arckit.analyze` after major changes to requirements, designs, or assessments
- Ideal times to run:
  - Before issuing SOW/RFP to vendors
  - After receiving vendor proposals
  - Before design review meetings
  - Before implementation kickoff
  - Before deployment to production
- Analysis identifies issues; you decide how to resolve them
- Re-run after fixing issues to verify improvements
- Target: 90%+ governance health score before proceeding

## Related Commands

After analysis, you may need:
- `/arckit.requirements` - Fix requirements issues
- `/arckit.principles` - Update architecture principles
- `/arckit.hld-review` - Re-review high-level design
- `/arckit.dld-review` - Re-review detailed design
- `/arckit.tcop` - Complete TCoP assessment
- `/arckit.ai-playbook` - Complete AI Playbook assessment
- `/arckit.atrs` - Generate ATRS record
- `/arckit.traceability` - Update traceability matrix
