# Architecture Governance Analysis Report: [PROJECT_NAME]

> **Template Origin**: Official | **ArcKit Version**: [VERSION] | **Command**: `/arckit.analyze`

## Document Control

| Field | Value |
|-------|-------|
| **Document ID** | ARC-[PROJECT_ID]-ANAL-v[VERSION] |
| **Document Type** | Governance Analysis Report |
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

## Revision History

| Version | Date | Author | Changes | Approved By | Approval Date |
|---------|------|--------|---------|-------------|---------------|
| [VERSION] | [DATE] | ArcKit AI | Initial creation from `/arckit.analyze` command | PENDING | PENDING |

---

## Executive Summary

**Overall Status**: [✅ Ready / ⚠️ Issues Found / ❌ Critical Issues]

**Key Metrics**:

- Total Requirements: [count]
- Requirements Coverage: [percentage]%
- Critical Issues: [count]
- High Priority Issues: [count]
- Medium Priority Issues: [count]
- Low Priority Issues: [count]

**Recommendation**: [PROCEED / RESOLVE CRITICAL ISSUES FIRST / MAJOR REWORK NEEDED]

---

## Findings Summary

| ID | Category | Severity | Location(s) | Summary | Recommendation |
|----|----------|----------|-------------|---------|----------------|
| R1 | [Category] | [CRITICAL/HIGH/MEDIUM/LOW] | [file:line] | [Summary] | [Action] |
| P1 | [Category] | [CRITICAL/HIGH/MEDIUM/LOW] | [file:line] | [Summary] | [Action] |
| T1 | [Category] | [CRITICAL/HIGH/MEDIUM/LOW] | [file:line] | [Summary] | [Action] |

---

## Requirements Analysis

### Requirements Coverage Matrix

| Requirement ID | Type | Priority | Design Coverage | Tests Coverage | Status |
|----------------|------|----------|-----------------|----------------|--------|
| BR-001 | Business | MUST | [✅/❌] | [✅/❌] | [✅/⚠️/❌] |
| FR-001 | Functional | MUST | [✅/❌] | [✅/❌] | [✅/⚠️/❌] |
| NFR-S-001 | Security | MUST | [✅/❌] | [✅/❌] | [✅/⚠️/❌] |

**Statistics**:

- Total Requirements: [count]
- Fully Covered: [count] ([percentage]%)
- Partially Covered: [count] ([percentage]%)
- Not Covered: [count] ([percentage]%)

### Uncovered Requirements (CRITICAL)

| Requirement ID | Priority | Description | Why Critical |
|----------------|----------|-------------|--------------|
| [REQ-ID] | MUST | [Description] | [Impact] |

---

## Architecture Principles Compliance

| Principle | Status | Evidence | Issues |
|-----------|--------|----------|--------|
| [Principle Name] | [✅ COMPLIANT / ⚠️ PARTIAL / ❌ NON-COMPLIANT] | [Evidence] | [Issues] |

**Critical Principle Violations**: [count]

---

## Stakeholder Traceability Analysis

**Stakeholder Analysis Exists**: [✅ Yes / ❌ No]

**Stakeholder-Requirements Coverage**:

- Requirements traced to stakeholder goals: [percentage]%
- Orphan requirements (no stakeholder justification): [count]
- Requirement conflicts documented and resolved: [✅ Yes / ⚠️ Partial / ❌ No]

**RACI Governance Alignment**:
| Artifact | Role | Aligned with RACI? | Issues |
|----------|------|-------------------|--------|
| [Artifact] | [Role] | [✅ Yes / ❌ No] | [Issues] |

---

## Risk Management Analysis

**Risk Register Exists**: [✅ Yes / ❌ No]

**Risk Coverage**:
| Risk ID | Category | Inherent | Residual | Response | Mitigation in Req? | Mitigation in Design? |
|---------|----------|----------|----------|----------|-------------------|---------------------|
| R-001 | [Category] | [Very High/High/Medium/Low] | [Score] | [4Ts] | [✅/❌] | [✅/❌] |

**High/Very High Risks Requiring Attention**:
| Risk ID | Description | Current Status | Required Action |
|---------|-------------|----------------|-----------------|
| [R-ID] | [Description] | [Status] | [Action] |

---

## Business Case Analysis

**SOBC Exists**: [✅ Yes / ❌ No]

**Benefits Traceability**:
| Benefit ID | Description | Stakeholder Goal | Requirements | Measurable? | Status |
|------------|-------------|------------------|--------------|-------------|--------|
| B-001 | [Description] | [Goal ID] | [REQ IDs] | [✅/❌] | [Status] |

**Benefits Coverage**:

- Total benefits: [count]
- Benefits traced to stakeholder goals: [percentage]%
- Benefits supported by requirements: [percentage]%
- Benefits measurable and verifiable: [percentage]%

---

## UK Government Compliance (if applicable)

### Technology Code of Practice (TCoP)

| TCoP Point | Status | Evidence | Gaps |
|------------|--------|----------|------|
| 1. Define user needs | [✅/⚠️/❌] | [Evidence] | [Gaps] |
| 2. Make things accessible | [✅/⚠️/❌] | [Evidence] | [Gaps] |
| [Continue for all 13 points...] | | | |

**TCoP Score**: [X]/130 ([percentage]%)

### AI Playbook Compliance (if AI system)

**AI Playbook Assessment Exists**: [✅ Yes / ❌ No]
**ATRS Record Exists**: [✅ Yes / ❌ No]

### Secure by Design (if applicable)

**SbD Assessment Exists**: [✅ Yes / ❌ No]
**MOD SbD Score** (if MOD): [X]/70 ([percentage]%)

---

## Data Model Analysis (if ARC-*-DATA-v*.md exists)

**Data Model Exists**: [✅ Yes / ❌ No]

**Data Requirements Coverage**:
| DR-ID | Entity | Covered in Model? | GDPR Basis | Issues |
|-------|--------|-------------------|------------|--------|
| DR-001 | [Entity] | [✅/❌] | [Basis] | [Issues] |

---

## Design Quality Analysis

### HLD Analysis (if exists)

**HLD Exists**: [✅ Yes / ❌ No]

| Aspect | Status | Issues |
|--------|--------|--------|
| Requirements Coverage | [percentage]% | [Issues] |
| Principles Alignment | [✅/⚠️/❌] | [Issues] |
| Security Architecture | [✅/⚠️/❌] | [Issues] |
| Integration Design | [✅/⚠️/❌] | [Issues] |

### DLD Analysis (if exists)

**DLD Exists**: [✅ Yes / ❌ No]

| Aspect | Status | Issues |
|--------|--------|--------|
| HLD Alignment | [✅/⚠️/❌] | [Issues] |
| Implementation Detail | [✅/⚠️/❌] | [Issues] |
| Test Coverage | [✅/⚠️/❌] | [Issues] |

---

## Detailed Findings

### Critical Issues

#### [FINDING-ID]: [Finding Title]

**Severity**: 🔴 CRITICAL
**Category**: [Requirements Quality / Principles Alignment / Traceability / UK Gov Compliance / etc.]
**Location**: [file:line or artifact reference]

**Description**:
[Detailed description of the issue]

**Impact**:
[What happens if this is not addressed]

**Recommendation**:
[Specific action to resolve]

**Evidence**:

- [Evidence 1]
- [Evidence 2]

---

### High Priority Issues

[Repeat structure for HIGH severity findings]

---

### Medium Priority Issues

[Repeat structure for MEDIUM severity findings]

---

### Low Priority Issues

[Repeat structure for LOW severity findings]

---

## Recommendations Summary

### Immediate Actions (Before Procurement/Implementation)

1. **[Action 1]**: [Description] - Addresses [FINDING-ID]
2. **[Action 2]**: [Description] - Addresses [FINDING-ID]
3. **[Action 3]**: [Description] - Addresses [FINDING-ID]

### Short-term Actions (Within 2 weeks)

1. **[Action 1]**: [Description]
2. **[Action 2]**: [Description]

### Medium-term Actions (Within 1 month)

1. **[Action 1]**: [Description]
2. **[Action 2]**: [Description]

---

## Appendix A: Artifacts Analyzed

| Artifact | Location | Last Modified | Status |
|----------|----------|---------------|--------|
| Architecture Principles | `projects/000-global/ARC-000-PRIN-v*.md` | [Date] | [✅ Analyzed / ❌ Not Found] |
| Stakeholder Drivers | `projects/[project]/ARC-*-STKE-v*.md` | [Date] | [✅ Analyzed / ❌ Not Found] |
| Requirements | `projects/[project]/ARC-*-REQ-v*.md` | [Date] | [✅ Analyzed / ❌ Not Found] |
| Risk Register | `projects/[project]/ARC-*-RISK-v*.md` | [Date] | [✅ Analyzed / ❌ Not Found] |
| SOBC | `projects/[project]/ARC-*-SOBC-v*.md` | [Date] | [✅ Analyzed / ❌ Not Found] |
| Data Model | `projects/[project]/ARC-*-DATA-v*.md` | [Date] | [✅ Analyzed / ❌ Not Found] |
| HLD | `projects/[project]/vendors/[vendor]/hld-v1.md` | [Date] | [✅ Analyzed / ❌ Not Found] |
| DLD | `projects/[project]/vendors/[vendor]/dld-v1.md` | [Date] | [✅ Analyzed / ❌ Not Found] |
| TCoP Assessment | `projects/[project]/ARC-*-TCOP-*.md` | [Date] | [✅ Analyzed / ❌ Not Found] |
| Traceability Matrix | `projects/[project]/ARC-*-TRAC-*.md` | [Date] | [✅ Analyzed / ❌ Not Found] |

---

## Appendix B: Analysis Methodology

**Analysis Date**: [DATE]
**Analyzed By**: ArcKit `/arckit.analyze` command

**Checks Performed**:

- Requirements completeness and quality
- Architecture principles compliance
- Stakeholder traceability
- Risk coverage and mitigation
- Business case alignment
- UK Government compliance (if applicable)
- Design quality (HLD/DLD)

**Severity Classification**:

- 🔴 **CRITICAL**: Blocks procurement/implementation, must resolve immediately
- 🟠 **HIGH**: Significant risk, resolve before major milestones
- 🟡 **MEDIUM**: Should be addressed, can proceed with caution
- 🟢 **LOW**: Minor issues, address when convenient

## External References

> This section provides traceability from generated content back to source documents.
> Follow citation instructions in the project's citation reference guide.

### Document Register

| Doc ID | Filename | Type | Source Location | Description |
|--------|----------|------|-----------------|-------------|
| *None provided* | — | — | — | — |

### Citations

| Citation ID | Doc ID | Page/Section | Category | Quoted Passage |
|-------------|--------|--------------|----------|----------------|
| — | — | — | — | — |

### Unreferenced Documents

| Filename | Source Location | Reason |
|----------|-----------------|--------|
| — | — | — |

---

**Generated by**: ArcKit `/arckit.analyze` command
**Generated on**: [DATE]
**ArcKit Version**: [VERSION]
**Project**: [PROJECT_NAME]
**Model**: [AI_MODEL]
