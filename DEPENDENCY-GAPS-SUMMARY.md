# ArcKit Dependency Matrix - Complete Gaps Analysis

**Date**: 2025-11-01
**ArcKit Version**: 0.8.1
**Analysis Status**: COMPLETE - All 28 commands analyzed

---

## Executive Summary

**Total Gaps Found**: **50+ missing dependency relationships**

**Breakdown by Severity**:
- 🔴 **CRITICAL (Mandatory)**: 2 gaps (will cause command failures)
- 🟠 **HIGH (Recommended)**: 23 gaps (degrades quality significantly)
- 🟡 **MEDIUM (Optional)**: 25+ gaps (enhances command output)

**Most Impacted Commands**:
1. **service-assessment** - Missing 13+ dependencies
2. **plan** - Missing 5 dependencies
3. **diagram** - Missing 5 dependencies
4. **jsp-936** - Missing 2 dependencies
5. **wardley** - Missing 4 dependencies

---

## Critical Gaps (🔴 MANDATORY - Must Fix)

### 1. **evaluate** → **principles** (M)
- **File**: arckit.evaluate.md:22
- **Evidence**: "Read `.arckit/memory/architecture-principles.md` to ensure alignment with governance"
- **Current Matrix**: Missing
- **Impact**: Vendor evaluation cannot check governance compliance
- **Fix**: Add M dependency

### 2. **dos** → **principles** (M)
- **File**: arckit.dos.md:28-30
- **Evidence**: "MUST exist... If NOT found: ERROR"
- **Current Matrix**: Marked as R (WRONG)
- **Impact**: DOS procurement fails without governance
- **Fix**: Change from R to M

---

## High Priority Gaps (🟠 RECOMMENDED - Should Fix)

### By Command:

#### **service-assessment** (13 gaps)
| Missing Dependency | Type | Evidence |
|-------------------|------|----------|
| plan | R | Line 60: Reads "project-plan.md" |
| data-model | R | Line 65: Reads "data-model.md" |
| principles | R | Line 66: Reads "architecture-principles.md" |
| hld-review | O | Line 69: Reads "hld-review-*.md" |
| dld-review | O | Line 70: Reads "dld-review-*.md" |
| diagram | O | Implied from architecture artifacts |
| traceability | O | Mentioned in artifact scan |
| wardley | O | Mentioned in artifact scan |
| tcop | O | Mentioned in artifact scan |
| ai-playbook | O | Mentioned in artifact scan |
| atrs | O | Mentioned in artifact scan |
| secure | O | Mentioned in artifact scan |
| mod-secure | O | Mentioned in artifact scan |

#### **plan** (5 gaps)
| Missing Dependency | Type | Evidence |
|-------------------|------|----------|
| stakeholders | O | Line 29-32: Reads "stakeholder-analysis.md" |
| requirements | O | Line 34-37: Reads "requirements.md" |
| principles | O | Line 39-42: Reads "architecture-principles.md" |
| sobc | O | Line 44-47: Reads "business-case.md" |
| risk | O | Line 49-52: Reads "risk-register.md" |

#### **diagram** (5 gaps)
| Missing Dependency | Type | Evidence |
|-------------------|------|----------|
| principles | O | Line 47: Reads if available |
| DLD | O | Line 36: Reads if available |
| tcop | O | Line 51: Reads UK Gov assessments |
| ai-playbook | O | Line 52: Reads if available |
| atrs | O | Line 53: Reads if available |

#### **wardley** (4 gaps)
| Missing Dependency | Type | Evidence |
|-------------------|------|----------|
| principles | O | Line 34-36: Reads if available |
| tcop | O | Line 43-45: Reads UK Gov assessments |
| ai-playbook | O | Line 45: Reads if available |
| atrs | O | Line 46: Reads if available |

#### **secure** (3 gaps)
| Missing Dependency | Type | Evidence |
|-------------------|------|----------|
| diagram | O | Line 35: Reads architecture diagrams |
| tcop | O | Line 38: Reads TCoP assessments |
| risk | R | Line 39: Reads risk registers |

#### **tcop** (2 gaps)
| Missing Dependency | Type | Evidence |
|-------------------|------|----------|
| diagram | O | Line 44: Reads architecture documents/diagrams |
| principles | R | Checks "Cloud First" principle (Point 5) |

#### **research** (2 gaps)
| Missing Dependency | Type | Evidence |
|-------------------|------|----------|
| data-model | R | Line 38-39: Understands data entities |
| stakeholders | R | Line 40-42: Understands priorities |

#### **jsp-936** (2 gaps)
| Missing Dependency | Type | Evidence |
|-------------------|------|----------|
| data-model | O | Line 44: Reads data-model files |
| diagram | O | Line 45: Reads diagram files |

#### **dos** (2 gaps - beyond the critical one)
| Missing Dependency | Type | Evidence |
|-------------------|------|----------|
| stakeholders | R | Line 37-39: RECOMMENDED |
| sow | O | Line 42-44: OPTIONAL |

#### **atrs** (2 gaps + 1 correction)
| Missing Dependency | Type | Evidence |
|-------------------|------|----------|
| ai-playbook | O | Line 36: Reads if exists (for AI systems) |
| requirements | O | Line 35: Reads if exists |
| **CORRECTION**: requirements should be O not M | | Current matrix has M |

#### **ai-playbook** (1 correction)
| Missing Dependency | Type | Evidence |
|-------------------|------|----------|
| **CORRECTION**: requirements should be O not M | | Line 46: Reads if exists |

#### **gcloud-search** (1 gap)
| Missing Dependency | Type | Evidence |
|-------------------|------|----------|
| principles | R | Line 37-40: RECOMMENDED for cloud strategy |

#### **hld-review** (1 gap)
| Missing Dependency | Type | Evidence |
|-------------------|------|----------|
| sow | O | Line 23: Checks deliverable expectations |

---

## Medium Priority Gaps (🟡 OPTIONAL - Nice to Have)

These are all OPTIONAL dependencies that enhance command output but aren't required:

### Compliance Command Interconnections

Many compliance commands can reference each other's outputs:

```
diagram → [tcop, ai-playbook, atrs]
wardley → [tcop, ai-playbook, atrs]
secure → [tcop]
service-assessment → [tcop, ai-playbook, atrs, secure, mod-secure]
```

**Note**: These are already partially documented above but represent a web of optional inter-dependencies.

---

## Dependency Corrections Required

### Incorrect Dependencies in Current Matrix

1. **ai-playbook** → **requirements**: Change from M to O
   - Command reads requirements "if exists" (Line 46)
   - Not mandatory - can assess AI principles without full requirements

2. **atrs** → **requirements**: Change from M to O
   - Command reads requirements "if exists" (Line 35)
   - Not mandatory - can create ATRS record from user description

3. **dos** → **principles**: Change from R to M (CRITICAL)
   - Command explicitly errors if principles not found
   - Must be mandatory dependency

---

## Impact Analysis

### Commands with No Dependencies (Tier 0)
✅ **principles** - Confirmed correct (no dependencies)
❌ **plan** - WRONG - Actually has 5 optional dependencies

### Commands with Comprehensive Dependencies Needed

**service-assessment** is the quality gate and needs visibility to almost everything:
- Currently shows: requirements (M), stakeholders (R), risk (R), analyze (R)
- Missing: plan, data-model, principles, hld-review, dld-review, diagram, traceability, wardley, and all compliance artifacts

### Procurement Command Family Inconsistencies

| Command | Currently Has | Missing |
|---------|--------------|---------|
| sow | requirements (M), research (R) | ✅ Complete |
| dos | requirements (M), principles (R⚠️) | principles should be M, missing stakeholders (R), sow (O) |
| gcloud-search | requirements (M), research (R) | principles (R) |
| gcloud-clarify | requirements (M), gcloud-search (M) | ✅ Complete |
| evaluate | requirements (M), sow/dos (R), research (R) | principles (M) |

---

## Recommendations

### Phase 1: Critical Fixes (Immediate)
1. Add `evaluate` → `principles` (M)
2. Change `dos` → `principles` from R to M
3. Change `ai-playbook` → `requirements` from M to O
4. Change `atrs` → `requirements` from M to O

### Phase 2: High-Priority Enhancements (Next Sprint)
1. Add `service-assessment` → All 13 missing dependencies
2. Add `plan` → All 5 missing dependencies
3. Add `secure` → `risk` (R)
4. Add `research` → `stakeholders` (R), `data-model` (R)
5. Add `tcop` → `principles` (R)

### Phase 3: Optional Enhancements (Future)
1. Add all diagram dependencies (5 gaps)
2. Add all wardley dependencies (4 gaps)
3. Add compliance interconnections
4. Add jsp-936 dependencies (2 gaps)

### Phase 4: Matrix Redesign (Long-term)
Consider creating two matrices:
1. **Primary Dependencies** - Direct MUST/SHOULD dependencies
2. **Context Dependencies** - Optional MAY dependencies

This would make the matrix more readable while capturing all relationships.

---

## Testing Strategy

After fixing gaps, validate each corrected dependency by:

1. **Positive Test**: Run command WITH the dependency present
   - Verify enhanced output quality
   - Confirm no errors

2. **Negative Test**: Run command WITHOUT the dependency
   - For M dependencies: Verify command fails gracefully with clear error
   - For R dependencies: Verify command succeeds but warns about degraded output
   - For O dependencies: Verify command succeeds silently

3. **Integration Test**: Run full workflow to verify dependency chain
   - Example: principles → stakeholders → risk → sobc → requirements → evaluate

---

## Files to Update

1. **DEPENDENCY-MATRIX.md** - Update the DSM with all corrections
2. **README.md** - Update workflow documentation to reflect true dependencies
3. **Command files** - Consider adding explicit dependency declarations in YAML frontmatter:
   ```yaml
   ---
   description: Command description
   dependencies:
     mandatory: [principles, requirements]
     recommended: [stakeholders, risk]
     optional: [diagram, tcop]
   ---
   ```

---

## Version History

- **v1.0** (2025-11-01): Complete analysis of all 28 commands - 50+ gaps identified
