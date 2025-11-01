# Dependency Matrix - Gaps Analysis

**Date**: 2025-11-01
**Version**: 0.8.1
**Status**: DRAFT - Requires Validation

This document identifies missing dependencies in the initial Dependency Structure Matrix (DSM).

---

## Summary

**Total Gaps Identified**: 35+ missing dependency relationships across 13 commands

**Severity**:
- **CRITICAL (Mandatory missing)**: 3 gaps
- **IMPORTANT (Recommended missing)**: 18 gaps
- **MINOR (Optional missing)**: 14+ gaps

---

## Gaps by Command

### 1. **diagram** - Missing 5 dependencies

| Missing Dependency | Type | Evidence |
|-------------------|------|----------|
| principles | O | Line 47: "Read Architecture Principles (if available)" |
| DLD | O | Line 36: "Read DLD (if available)" |
| tcop | O | Line 51: "Read UK Government Assessments... tcop-assessment.md" |
| ai-playbook | O | Line 52: "ai-playbook-assessment.md" |
| atrs | O | Line 53: "atrs-record.md" |

**Impact**: Diagram command can leverage more artifacts for comprehensive visualizations.

---

### 2. **hld-review** - Missing 1 dependency

| Missing Dependency | Type | Evidence |
|-------------------|------|----------|
| sow | O | Line 23: "Read projects/{project-dir}/sow.md - Check deliverable expectations" |

**Impact**: HLD review should check vendor deliverables match SOW expectations.

---

### 3. **dld-review** - Missing 1 dependency

| Missing Dependency | Type | Evidence |
|-------------------|------|----------|
| hld-review | M | Line 21: "Read projects/{project-dir}/vendors/{vendor}/hld-review.md - Ensure HLD issues were addressed" |

**Impact**: CRITICAL - DLD review must verify HLD feedback was addressed.

**Note**: This is already in the matrix correctly.

---

### 4. **tcop** - Missing 2 dependencies

| Missing Dependency | Type | Evidence |
|-------------------|------|----------|
| diagram | O | Line 44: "Look for architecture documents in specs/*/diagrams/" |
| principles | R | Point 5 checks "Cloud First" principle compliance |

**Impact**: TCoP assessment should reference architecture diagrams and principles.

---

### 5. **secure** - Missing 3 dependencies

| Missing Dependency | Type | Evidence |
|-------------------|------|----------|
| diagram | O | Line 35: "Architecture diagrams in specs/*/diagrams/" |
| tcop | O | Line 38: "TCoP assessments (if available)" |
| risk | R | Line 39: "Risk registers or threat models" |

**Impact**: Security assessment should leverage risk register and TCoP findings.

---

### 6. **mod-secure** - Likely Similar Gaps

**Assumption**: Likely has same gaps as `secure` command (not fully verified).

| Missing Dependency | Type | Evidence |
|-------------------|------|----------|
| diagram | O | Expected similar to secure |
| risk | R | Expected similar to secure |

**Status**: NEEDS VERIFICATION

---

### 7. **service-assessment** - Missing 11+ dependencies

| Missing Dependency | Type | Evidence |
|-------------------|------|----------|
| plan | R | Line 60: "project-plan.md - Project phases, timeline, team structure, milestones" |
| data-model | O | Line 65: "data-model.md - Data entities, GDPR compliance, data governance" |
| principles | R | Line 66: ".arckit/memory/architecture-principles.md" |
| hld-review | O | Line 69: "hld-review-*.md - High-level design reviews" |
| dld-review | O | Line 70: "dld-review-*.md - Detailed design reviews" |
| diagram | O | Implied by reference to architecture artifacts |
| traceability | O | Mentioned in comprehensive artifact scan |
| wardley | O | Mentioned in comprehensive artifact scan |
| tcop | O | Mentioned in comprehensive artifact scan |
| ai-playbook | O | Mentioned in comprehensive artifact scan |
| atrs | O | Mentioned in comprehensive artifact scan |
| secure | O | Mentioned in comprehensive artifact scan |
| mod-secure | O | Mentioned in comprehensive artifact scan |

**Impact**: IMPORTANT - Service Assessment is comprehensive quality gate and needs visibility to all artifacts.

---

### 8. **evaluate** - Missing 1 dependency

| Missing Dependency | Type | Evidence |
|-------------------|------|----------|
| principles | M | Line 22: "Read .arckit/memory/architecture-principles.md to ensure alignment with governance" |

**Impact**: CRITICAL - Vendor evaluation must check governance compliance.

---

### 9. **dos** - Missing 3 dependencies + 1 correction

| Missing Dependency | Type | Evidence |
|-------------------|------|----------|
| principles | **M** | Line 28-30: "MUST exist" - "If NOT found: ERROR" |
| stakeholders | R | Line 37-39: "RECOMMENDED" - "Consider running /arckit.stakeholders" |
| sow | O | Line 42-44: "OPTIONAL" - "If exists: Reference it" |

**Current Matrix Error**: principles is marked as R but should be **M** (MANDATORY)

**Impact**: CRITICAL - DOS procurement requires governance standards.

---

### 10. **wardley** - Missing 4 dependencies

| Missing Dependency | Type | Evidence |
|-------------------|------|----------|
| principles | O | Line 34-36: "Read Architecture Principles (if available)" |
| tcop | O | Line 43-45: "Read UK Government Assessments... tcop-assessment.md" |
| ai-playbook | O | Line 45: "ai-playbook-assessment.md" |
| atrs | O | Line 46: "atrs-record.md" |

**Impact**: Wardley maps should incorporate governance and compliance context.

---

### 11. **research** - Missing 2 dependencies

| Missing Dependency | Type | Evidence |
|-------------------|------|----------|
| data-model | R | Line 38-39: "RECOMMENDED... Understand data entities and integration needs" |
| stakeholders | R | Line 40-42: "RECOMMENDED... Understand stakeholder priorities for research focus" |

**Impact**: Research should prioritize based on stakeholder needs and data requirements.

---

### 12. **gcloud-search** - Missing 1 dependency

| Missing Dependency | Type | Evidence |
|-------------------|------|----------|
| principles | R | Line 37-40: "RECOMMENDED... Read it for cloud strategy, security requirements" |

**Impact**: G-Cloud search should align with architecture principles.

---

### 13. **gcloud-clarify** - Dependencies Correct

**Status**: ✅ No gaps found. Current matrix shows: requirements (M), gcloud-search (M)

---

## Critical Gaps (MANDATORY Dependencies Missing)

1. **evaluate** → **principles** (M) - Vendor evaluation MUST check governance
2. **dos** → **principles** (M) - DOS procurement MUST have governance (currently marked as R, should be M)
3. **dld-review** → **hld-review** (M) - Already in matrix ✅

---

## High-Priority Gaps (RECOMMENDED Dependencies Missing)

1. **service-assessment** → **plan** (R)
2. **service-assessment** → **principles** (R)
3. **tcop** → **principles** (R)
4. **secure** → **risk** (R)
5. **research** → **data-model** (R)
6. **research** → **stakeholders** (R)
7. **dos** → **stakeholders** (R)
8. **gcloud-search** → **principles** (R)

---

## Optional Dependencies (Lower Priority)

All remaining gaps are OPTIONAL (O) dependencies where commands can read additional context if available but don't require it.

---

## Compliance Command Interconnections

**Major Gap**: Compliance commands often reference each other but this isn't captured in the matrix:

- **secure** can read **tcop** findings
- **service-assessment** can read **tcop**, **ai-playbook**, **atrs**, **secure**, **mod-secure**
- **wardley** can read **tcop**, **ai-playbook**, **atrs**
- **diagram** can read **tcop**, **ai-playbook**, **atrs**

These are all OPTIONAL but create a web of inter-dependencies not fully mapped.

---

## Recommendations

### Immediate Actions

1. **Fix critical gaps**:
   - Add `evaluate` → `principles` (M)
   - Change `dos` → `principles` from R to M
   - Add `service-assessment` → `principles` (R)

2. **Add high-priority RECOMMENDED dependencies**:
   - All listed in "High-Priority Gaps" section above

3. **Consider adding optional compliance interconnections**:
   - Create "compliance artifact" node that represents all compliance outputs
   - Show optional dependencies from later commands to compliance artifacts

### Matrix Enhancement

Create a **second-order dependency view** showing:
- Direct dependencies (current matrix)
- Transitive dependencies (A→B→C implies A can benefit from C)
- Optional cross-references (compliance command interconnections)

### Documentation Update

Update command documentation to clearly mark:
- **MUST** (M) - Command fails without this
- **SHOULD** (R) - Command works but quality degraded
- **MAY** (O) - Command enhanced if available
- **N/A** - Not applicable

---

## Validation Required

The following commands need deeper analysis:

1. **ai-playbook** - Haven't checked its dependencies yet
2. **atrs** - Haven't checked its dependencies yet
3. **jsp-936** - Haven't checked its dependencies yet
4. **mod-secure** - Assumed similar to secure, needs verification
5. **plan** - Haven't checked its dependencies yet (assumed none)

---

## Version History

- **v1.0** (2025-11-01): Initial gaps analysis based on command file review
