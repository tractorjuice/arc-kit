# G-Cloud Service Clarification Questions

> **Template Origin**: Official | **ArcKit Version**: [VERSION] | **Command**: `/arckit.gcloud-clarify`

## Document Control

<!-- DOC-CONTROL-HEADER -->
<!-- Resolved at command-execution time to _partials/document-control-uk.md or _partials/document-control-uae.md based on plugin userConfig classification_scheme + governance_framework. See _partials/RENDERING.md (when present). -->

## Revision History

| Version | Date | Author | Changes | Approved By | Approval Date |
|---------|------|--------|---------|-------------|---------------|
| [VERSION] | [DATE] | ArcKit AI | Initial creation from `/arckit.gcloud-clarify` command | PENDING | PENDING |

---

## Executive Summary

**Purpose**: Validate G-Cloud services against requirements before procurement decision.

**Status**:

- Services Analyzed: [N]
- Critical Gaps Found: [N]
- High Priority Gaps: [N]
- Medium Priority Gaps: [N]

**Action Required**: [Send clarification questions to [N] suppliers / Eliminate [N] services due to critical gaps / Proceed with [Service Name]]

---

## Service 1: [Service Name] by [Supplier Name]

**Link**: [Service URL]

### Gap Summary

- ✅ **[N]** MUST requirements confirmed with evidence
- ⚠️ **[N]** MUST requirements mentioned ambiguously
- ❌ **[N]** MUST requirements NOT mentioned
- 🔵 **[N]** SHOULD requirements missing

**Overall Risk**: [🔴/🟠/🔵/🟢] [Risk Level]

---

### Critical Questions (MUST address before proceeding)

#### Q1: [Clear, specific question title]

**Requirement**: [REQ-ID] (MUST) - [requirement text]

**Gap**: [Describe what is missing, ambiguous, or unclear]

**Question**:
> [Specific question to supplier]
>
> - [Sub-question or specific aspect]
> - [Sub-question or specific aspect]
> - [Sub-question or specific aspect]

**Evidence Needed**:

- [Specific document or proof required]
- [Additional evidence needed]

**Priority**: 🔴 CRITICAL

---

### High Priority Questions (Affects evaluation scoring)

#### Q[N]: [Clear, specific question title]

**Requirement**: [REQ-ID] (MUST) - [requirement text]

**Gap**: [Describe what is ambiguous or unclear]

**Question**:
> [Specific question to supplier]
>
> - [Sub-question or specific aspect]
> - [Sub-question or specific aspect]

**Evidence Needed**:

- [Specific document or proof required]

**Priority**: 🟠 HIGH

---

### Medium Priority Questions (Due diligence)

#### Q[N]: [Clear, specific question title]

**Requirement**: [REQ-ID] (SHOULD) - [requirement text]

**Gap**: [Describe what is missing or unclear]

**Question**:
> [Specific question to supplier]

**Evidence Needed**:

- [Specific document or proof required]

**Priority**: 🔵 MEDIUM

---

### Low Priority Questions (Nice to know)

#### Q[N]: [Clear, specific question title]

**Requirement**: [REQ-ID] (SHOULD) - [requirement text]

**Gap**: [Describe optional feature not mentioned]

**Question**:
> [Specific question to supplier]

**Priority**: 🟢 LOW

---

### Service Risk Assessment

| Aspect | Status | Risk | Notes |
|--------|--------|------|-------|
| **Functional Requirements** | [✅/⚠️/❌] | [🔴/🟠/🔵/🟢] | [Brief note] |
| **Performance Requirements** | [✅/⚠️/❌] | [🔴/🟠/🔵/🟢] | [Brief note] |
| **Security Requirements** | [✅/⚠️/❌] | [🔴/🟠/🔵/🟢] | [Brief note] |
| **Compliance Requirements** | [✅/⚠️/❌] | [🔴/🟠/🔵/🟢] | [Brief note] |
| **Integration Requirements** | [✅/⚠️/❌] | [🔴/🟠/🔵/🟢] | [Brief note] |
| **Pricing Transparency** | [✅/⚠️/❌] | [🔴/🟠/🔵/🟢] | [Brief note] |

**Overall Risk**: [🔴 CRITICAL / 🟠 HIGH / 🔵 MEDIUM / 🟢 LOW]

**Risk Calculation**:

- ❌ [N] MUST requirements NOT confirmed
- ⚠️ [N] MUST requirements AMBIGUOUS
- 🔵 [N] SHOULD requirements missing

**Recommendation**: [DO NOT PROCEED / CLARIFY FIRST / PROCEED WITH CAUTION / PROCEED TO DEMO]

**Alternative**: [Suggest alternative service if this one has critical gaps]

---

### Email Template for Supplier

**Subject**: Technical Clarification Required - [Service Name]

Dear [Supplier Name] Team,

We are evaluating [Service Name] (Service ID: [ID]) for procurement via the Digital Marketplace. Before proceeding, we need clarification on several technical requirements:

**Critical Requirements (Blocking)**:
[List Q-numbers for critical questions]

**High Priority Requirements**:
[List Q-numbers for high priority questions]

Could you please provide:

- Written responses to questions [Q1-QN]
- Supporting documentation ([list evidence needed])
- Access to demo/trial environment for technical validation

We aim to make a procurement decision by [DATE + 2 weeks]. Please respond by [DATE + 1 week].

Thank you,
[User name if provided, otherwise: Your Name]
[Organization name if available]

---

## Service 2: [Service Name] by [Supplier Name]

[REPEAT STRUCTURE FOR EACH SERVICE]

---

## Service Comparison - Risk Summary

| Service | Supplier | Critical Gaps | High Gaps | Medium Gaps | Overall Risk | Action |
|---------|----------|---------------|-----------|-------------|--------------|--------|
| [Service 1] | [Supplier 1] | [N] | [N] | [N] | [🔴/🟠/🔵/🟢] | [Action] |
| [Service 2] | [Supplier 2] | [N] | [N] | [N] | [🔴/🟠/🔵/🟢] | [Action] |
| [Service 3] | [Supplier 3] | [N] | [N] | [N] | [🔴/🟠/🔵/🟢] | [Action] |

**Recommended Priority Order**:

1. **[Service Name]** - [Risk Level] - [Action]
2. **[Service Name]** - [Risk Level] - [Action]
3. **[Service Name]** - [Risk Level] - [Action]

---

## Next Steps

### Immediate Actions (This Week)

1. **Send clarification questions**:
   - [ ] Email sent to [Supplier 1]
   - [ ] Email sent to [Supplier 2]
   - [ ] Email sent to [Supplier 3]

2. **Set response deadline**: [DATE + 1 week]

3. **Schedule follow-up**: [DATE + 1 week] to review responses

### Upon Receiving Responses (Week 2)

4. **Review supplier responses**:
   - [ ] Check all critical questions answered
   - [ ] Validate evidence provided
   - [ ] Update risk assessment

5. **Schedule technical demos**:
   - [ ] Demo with [top-ranked service]
   - [ ] Demo with [second-ranked service]

6. **Validate critical requirements**:
   - [ ] Test integration in demo environment
   - [ ] Confirm performance metrics
   - [ ] Verify compliance certificates

### Decision Point (Week 3)

7. **Final evaluation**:
   - [ ] Use `/arckit.evaluate` to score suppliers
   - [ ] Compare responses and demos
   - [ ] Select winning service

8. **Contract award**:
   - [ ] Award via Digital Marketplace
   - [ ] Publish on Contracts Finder

**Parallel Activity**: While waiting for responses, prepare evaluation criteria with `/arckit.evaluate`.

---

## Gap Detection Reference

### Gap Coverage Status

- ✅ **CONFIRMED**: Service description explicitly mentions this capability with specifics
- ⚠️ **AMBIGUOUS**: Service mentions related capability but vaguely (needs clarification)
- ❌ **NOT MENTIONED**: Service does not mention this requirement at all

### Ambiguous Claims Detection

Common vague marketing language requiring clarification:

- "Industry-standard" → Which specific standards?
- "High availability" → What specific SLA percentage?
- "Scalable" → To what capacity? What are the limits?
- "Secure" → Which security certifications?
- "Fast" → What specific performance metrics?
- "Compatible with" → Which versions? What level of compatibility?
- "Enterprise-grade" → What does this mean specifically?
- "Comprehensive" → What is included? What is excluded?

### Priority Levels

**🔴 CRITICAL** (Blocking):

- MUST requirement not confirmed at all (❌ NOT MENTIONED)
- Compliance requirement without evidence
- Blocker for procurement

**🟠 HIGH** (Affects Scoring):

- MUST requirement mentioned ambiguously (⚠️ AMBIGUOUS)
- Integration requirement unclear
- SLA not specified
- Certification mentioned but not confirmed

**🔵 MEDIUM** (Due Diligence):

- SHOULD requirement not mentioned
- Pricing details incomplete
- Data residency not confirmed
- Support terms unclear

**🟢 LOW** (Nice to Know):

- Nice-to-have features
- Future roadmap questions
- General support questions

### Risk Levels

- 🔴 **CRITICAL**: 1+ MUST requirements not confirmed → DO NOT PROCEED
- 🟠 **HIGH**: 2+ MUST requirements ambiguous → CLARIFY FIRST
- 🔵 **MEDIUM**: 1 MUST ambiguous OR 3+ SHOULD missing → PROCEED WITH CAUTION
- 🟢 **LOW**: All MUST confirmed, few SHOULD missing → PROCEED TO DEMO

---

## Referenced Documents

- **Requirements**: projects/[project]/ARC-*-REQ-v*.md
- **G-Cloud Search**: projects/[project]/procurement/ARC-*-GCLOUD-v*.md
- **Service Pages**: [list all service URLs]

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

**Generated by**: ArcKit `/arckit.gcloud-clarify` command
**Generated on**: [DATE]
**ArcKit Version**: [VERSION]
**Project**: [PROJECT_NAME]
**Model**: [AI_MODEL]
