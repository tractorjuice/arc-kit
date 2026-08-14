# G-Cloud Submission Review: [SERVICE_NAME]

> **Template Origin**: Official | **ArcKit Version**: [VERSION] | **Command**: `/arckit-uk-gcloud:review`

## Document Control

<!-- DOC-CONTROL-HEADER -->
<!-- Resolved at command-execution time per _partials/RENDERING.md. -->

## Revision History

| Version | Date | Author | Changes | Approved By | Approval Date |
|---------|------|--------|---------|-------------|---------------|
| [VERSION] | [DATE] | ArcKit AI | Initial creation from `/arckit-uk-gcloud:review` command | [PENDING] | [PENDING] |

> Pre-submission readiness review of a supplier's G-Cloud service pack.
> Every finding cites the `ARC-` ID of the document it concerns, so it can be fixed at source.

---

## 1. Review Scope

| Field | Value |
|-------|-------|
| **Service** | [SERVICE_NAME] (Project [PROJECT_ID]) |
| **Lot** | [Lot 1 Cloud Hosting / Lot 2 Cloud Software / Lot 3 Cloud Support] |
| **Framework** | [G-Cloud 14 / current framework] |
| **Review date** | [DATE] |
| **Review scope** | [Full / Completeness / Consistency / Readiness] |
| **Submission deadline** | [DATE or PENDING] |

---

## 2. Overall Status

**Status**: [🟢 READY / 🟡 NEEDS WORK / 🔴 NOT READY]

[One paragraph: what would happen if this pack were submitted today.]

| Gate | Result |
|------|--------|
| All mandatory documents present | [✅/❌] |
| All mandatory fields complete | [✅/❌] |
| No blocking consistency conflicts | [✅/❌] |
| All entries within character limits | [✅/❌] |
| All claimed evidence verifiable | [✅/❌] |

---

## 3. Document Completeness

| Document | ARC-ID | Status | Issues |
|----------|--------|--------|--------|
| Supplier Profile | `ARC-000-SUPP` | [✅/🟡/❌] | [-] |
| Supplier Declaration | `ARC-000-DECL` | [✅/🟡/❌] | [-] |
| Service Design | `ARC-[PROJECT_ID]-SVCD` | [✅/🟡/❌] | [-] |
| Service Definition (SDD) | `ARC-[PROJECT_ID]-SDD` | [✅/🟡/❌] | [-] |
| Pricing | `ARC-[PROJECT_ID]-PRIC` | [✅/🟡/❌] | [-] |
| Security | `ARC-[PROJECT_ID]-SECA` | [✅/🟡/❌] | [-] |

**Missing documents**: [list, or "None"]

---

## 4. Mandatory Field Status

| Measure | Count |
|---------|-------|
| Complete | [X] / [Y] |
| Incomplete | [X] |
| Invalid | [X] |

### Incomplete or Invalid Fields

| ARC-ID | Field | Problem | Fix |
|--------|-------|---------|-----|
| `ARC-[PROJECT_ID]-SDD` | [Field name] | [Empty / placeholder left in / wrong format] | [Command to re-run or value needed] |

---

## 5. Consistency Issues

Conflicts between two documents in the pack. Name both `ARC-` IDs — a conflict has two sides and fixing the wrong one leaves the pack still inconsistent.

| # | Issue | Documents in conflict | Resolution |
|---|-------|-----------------------|------------|
| 1 | [What disagrees] | `ARC-...` vs `ARC-...` | [Which is correct and why] |

*If nothing conflicts, write "No consistency issues found." rather than omitting the section.*

---

## 6. Character and Word-Limit Status

| Measure | Count |
|---------|-------|
| Within limits | [X] / [Y] |
| Exceeding limits | [X] |

### Entries Over Limit

| ARC-ID | Field | Limit | Actual | Over by |
|--------|-------|-------|--------|---------|
| `ARC-[PROJECT_ID]-SDD` | [Field] | [N] | [N] | [N] |

---

## 7. Evidence Status

Claims in the pack that a buyer or CCS could ask you to substantiate.

| Measure | Count |
|---------|-------|
| Verified | [X] / [Y] |
| Missing | [X] |

| ARC-ID | Claim | Evidence required | Held? |
|--------|-------|-------------------|-------|
| `ARC-[PROJECT_ID]-SECA` | [e.g. ISO 27001 certified] | [Certificate number and expiry] | [✅/❌] |

---

## 8. Common Rejection Reasons Checked

| Reason | Applies? | Detail |
|--------|----------|--------|
| Service does not meet the lot definition | [✅ Clear / ⚠️ Risk] | [-] |
| Pricing document missing or unpublished | [✅ Clear / ⚠️ Risk] | [-] |
| Mandatory declaration unanswered | [✅ Clear / ⚠️ Risk] | [-] |
| Service description exceeds limits | [✅ Clear / ⚠️ Risk] | [-] |
| Claimed certification not held or expired | [✅ Clear / ⚠️ Risk] | [-] |

---

## 9. Actions Required

### Must Fix (Blocking)

| # | Action | ARC-ID | Command to re-run |
|---|--------|--------|-------------------|
| 1 | [Action] | `ARC-...` | [command to re-run] |

### Should Fix (Recommended)

| # | Action | ARC-ID |
|---|--------|--------|
| 1 | [Action] | `ARC-...` |

### Nice to Have

| # | Action | ARC-ID |
|---|--------|--------|
| 1 | [Action] | `ARC-...` |

*Leave genuinely-unknown values as `[PENDING]` rather than inventing them.*

---

## External References

Sources fetched while running this review — CCS framework guidance, lot definitions, certification registers.

### Document Register

| Doc ID | Source | Category | Retrieved |
|--------|--------|----------|-----------|
| [WEB-1] | [URL] | [CCS guidance / Certification register] | [DATE] |

### Citations

| Citation ID | Doc ID | Page/Section | Quoted Passage |
|-------------|--------|--------------|----------------|
| [WEB-1-C1] | [WEB-1] | [Section] | [Quoted passage] |

### Unreferenced Documents

| Doc ID | Reason not cited |
|--------|------------------|
| [WEB-N] | [Reviewed, nothing material] |

---

**Generated by**: ArcKit `/arckit-uk-gcloud:review` command
**Generated on**: [DATE]
**ArcKit Version**: [VERSION]
**Project**: [PROJECT_NAME]
**Model**: [AI_MODEL]
