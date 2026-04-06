---
description: "Generate requirements traceability matrix from requirements to design to tests"
---

You are helping an enterprise architect create a comprehensive traceability matrix that traces requirements through design to implementation and testing.

## User Input

```text
$ARGUMENTS
```

## Instructions

> **Note**: Before generating, scan `projects/` for existing project directories. For each project, list all `ARC-*.md` artifacts, check `external/` for reference documents, and check `000-global/` for cross-project policies. If no external docs exist but they would improve output, ask the user.

1. **Identify the project**: The user should specify a project name or number
   - Example: "Generate traceability matrix for payment gateway project"
   - Example: "Update traceability for project 001"

2. **Artifacts pre-extracted by hook**:

   > **Note**: The **Traceability Pre-processor Hook** has already:
   > 1. Extracted all requirement IDs with categories, priorities, and descriptions from REQ files
   > 2. Scanned all ADRs, vendor HLD/DLD files, and HLDR/DLDR reviews for requirement ID references
   > 3. Computed coverage analysis: covered vs orphan requirements, coverage by category and priority
   > 4. Detected existing TRAC version for version numbering
   >
   > Use the hook's pre-extracted data directly. **Do NOT re-read REQ, ADR, or review files for requirement IDs.**
   >
   > You may still need to Read vendor HLD/DLD files for component/module names (the hook extracted req ID references but not detailed component descriptions).
   >
   > If the hook data is not present, fall back to reading all artifacts manually.

   **Read the template** (with user override support):
   - **First**, check if `.arckit/templates/traceability-matrix-template.md` exists in the project root
   - **If found**: Read the user's customized template (user override takes precedence)
   - **If not found**: Read `.arckit/templates/traceability-matrix-template.md` (default)

   > **Tip**: Users can customize templates with `/arckit:customize traceability`

3. **Read external documents** (if needed):
   - The hook has NOT read external documents or vendor prose — Read these if needed for component names, test evidence, or implementation details
   - Read any **enterprise standards** in `projects/000-global/external/` if relevant
   - If no external docs found but they would improve traceability coverage, ask the user
   - **Citation traceability**: When referencing content from external documents, follow the citation instructions in `.arckit/references/citation-instructions.md`. Place inline citation markers (e.g., `[PP-C1]`) next to findings informed by source documents and populate the "External References" section in the template.

4. **Build the traceability matrix**:

   ### Forward Traceability (Requirements → Design → Implementation → Tests)

   For each requirement (BR, FR, NFR, INT, DR) from the hook's requirements table:

   **Step 1: Requirement Details** (pre-extracted by hook)
   - Requirement ID, description, priority, and category are in the hook's table
   - The "Covered" and "Referenced By" columns show which design docs already reference each requirement

   **Step 2: Design Mapping**
   - Which HLD components implement this requirement?
   - Which DLD modules/classes handle this?
   - Architecture patterns used
   - Design decisions made

   **Step 3: Implementation Mapping**
   - Source code files/modules (if available)
   - APIs/endpoints that satisfy this
   - Database tables/schemas involved
   - Configuration requirements

   **Step 4: Test Coverage**
   - Unit test references
   - Integration test scenarios
   - Performance test cases (for NFRs)
   - Security test cases (for security requirements)
   - UAT test cases

   **Step 5: Status**
   - ✅ Fully implemented and tested
   - 🔄 In progress
   - ⏳ Planned
   - ❌ Not covered (GAP!)

   ### Backward Traceability (Tests → Implementation → Design → Requirements)

   For each test case:
   - Which requirements does it verify?
   - Which design components does it test?
   - What's the expected outcome?

   ### Gap Analysis

   Use the hook's pre-computed data directly:
   - **Orphan Requirements**: Listed in the hook's "Orphan Requirements" section — requirements with NO design references
   - **Orphan Design Elements**: Listed in the hook's "Design-Only References" section — IDs referenced in design docs but absent from REQ files (scope creep?)
   - **Orphan Tests**: Tests not linked to requirements (what are they testing?)
   - **Coverage Gaps**: Requirements without adequate test coverage

5. **Analyze coverage metrics**:

   Use the hook's **COVERAGE SUMMARY** table directly — it already provides:
   - Overall coverage (covered / total / percentage)
   - Breakdown by category (Business, Functional, Non-Functional, Integration, Data)
   - Breakdown by priority (MUST, SHOULD, MAY)

   **Do NOT recalculate these metrics.** Enrich them with additional context:
   - **Implementation Coverage**: % of requirements with implementation evidence (from vendor HLD/DLD prose)
   - **Test Coverage**: % of requirements with test references (from project artifacts)

   Apply these thresholds when flagging gaps:
   - MUST requirements: Should be 100% covered
   - SHOULD requirements: Should be > 80% covered
   - MAY requirements: Can be < 50% covered

6. **Risk Assessment**:

   Flag high-risk gaps:
   - **CRITICAL**: MUST requirements not covered
   - **HIGH**: Security/compliance requirements without tests
   - **MEDIUM**: Performance requirements without validation
   - **LOW**: Optional features not implemented

7. **Generate Traceability Report**:

   Create comprehensive report with:

   **Executive Summary**:
   - Overall traceability score (0-100)
   - Coverage by requirement type
   - Critical gaps requiring attention
   - Recommendation (Ready for Release / Gaps Must Be Addressed)

   **Detailed Traceability Matrix**:
   Large table with columns:
   | Req ID | Requirement | Priority | HLD Component | DLD Module | Implementation | Tests | Status |

   **Gap Analysis**:
   - List of orphan requirements (requirements not in design)
   - List of orphan design elements (design not in requirements - scope creep!)
   - List of untested requirements
   - Recommendations for each gap

   **Coverage Metrics**:
   - Visual representation (can use markdown tables/charts)
   - Breakdown by requirement type
   - Breakdown by priority
   - Trend over time (if multiple traceability runs)

   **Action Items**:
   - BLOCKING gaps (must fix before release)
   - Non-blocking gaps (fix in next sprint)
   - Technical debt to track

Before writing the file, read `.arckit/references/quality-checklist.md` and verify all **Common Checks** plus the **TRAC** per-type checks pass. Fix any failures before proceeding.

8. **Write output**:
   - `projects/{project-dir}/ARC-{PROJECT_ID}-TRAC-v${VERSION}.md` - Full traceability matrix including coverage metrics and gap analysis (all in one document)

   **CRITICAL - Show Summary Only**:
   After writing the file, show ONLY a brief summary with coverage metrics and key gaps. Do NOT output the full traceability matrix content in your response, as matrices can be 800+ lines with detailed requirement-to-test mappings.

**CRITICAL - Auto-Populate Document Control Fields**:

Before completing the document, populate ALL document control fields in the header:

### Step 0: Detect Version

The hook provides the existing TRAC version and a suggested next version. Use these directly:

1. **If hook says "Existing TRAC version: none"**: Use VERSION="1.0"
2. **If hook provides an existing version** (e.g., "v1.0"):
   - Use the hook's **suggested next version** as the default (minor increment, e.g., 1.0 → 1.1)
   - **Major increment** (e.g., 1.0 → 2.0): Only if scope materially changed — new requirement categories traced, fundamentally different coverage, significant new artifacts added
3. Use the determined version for document ID, filename, Document Control, and Revision History
4. For v1.1+/v2.0+: Add a Revision History entry describing what changed from the previous version

### Step 1: Construct Document ID

- **Document ID**: `ARC-{PROJECT_ID}-TRAC-v{VERSION}` (e.g., `ARC-001-TRAC-v1.0`)

### Step 2: Populate Required Fields

**Auto-populated fields** (populate these automatically):

- `[PROJECT_ID]` → Extract from project path (e.g., "001" from "projects/001-project-name")
- `[VERSION]` → Determined version from Step 0
- `[DATE]` / `[YYYY-MM-DD]` → Current date in YYYY-MM-DD format
- `[DOCUMENT_TYPE_NAME]` → "Requirements Traceability Matrix"
- `ARC-[PROJECT_ID]-TRAC-v[VERSION]` → Construct using format from Step 1
- `[COMMAND]` → "arckit.traceability"
- `{ARCKIT_VERSION}` → Use the ArcKit Version from the hook's Project section (do NOT search for VERSION files)

**User-provided fields** (extract from project metadata or user input):

- `[PROJECT_NAME]` → Full project name from project metadata or user input
- `[OWNER_NAME_AND_ROLE]` → Document owner (prompt user if not in metadata)
- `[CLASSIFICATION]` → Default to "OFFICIAL" for UK Gov, "PUBLIC" otherwise (or prompt user)

**Calculated fields**:

- `[YYYY-MM-DD]` for Review Date → Current date + 30 days (requirements, research, risks)
- `[YYYY-MM-DD]` for Review Date → Phase gate dates (Alpha/Beta/Live for compliance docs)

**Pending fields** (leave as [PENDING] until manually updated):

- `[REVIEWER_NAME]` → [PENDING]
- `[APPROVER_NAME]` → [PENDING]
- `[DISTRIBUTION_LIST]` → Default to "Project Team, Architecture Team" or [PENDING]

### Step 3: Populate Revision History

```markdown
| 1.0 | {DATE} | ArcKit AI | Initial creation from `/arckit:traceability` command | [PENDING] | [PENDING] |
```

### Step 4: Populate Generation Metadata Footer

The footer should be populated with:

```markdown
**Generated by**: ArcKit `/arckit:traceability` command
**Generated on**: {DATE} {TIME} GMT
**ArcKit Version**: {ARCKIT_VERSION}
**Project**: {PROJECT_NAME} (Project {PROJECT_ID})
**AI Model**: [Use actual model name, e.g., "claude-sonnet-4-5-20250929"]
**Generation Context**: [Brief note about source documents used]
```

### Example Fully Populated Document Control Section

```markdown
## Document Control

| Field | Value |
|-------|-------|
| **Document ID** | ARC-001-TRAC-v1.0 |
| **Document Type** | {Document purpose} |
| **Project** | Windows 10 to Windows 11 Migration (Project 001) |
| **Classification** | OFFICIAL-SENSITIVE |
| **Status** | DRAFT |
| **Version** | 1.0 |
| **Created Date** | 2025-10-29 |
| **Last Modified** | 2025-10-29 |
| **Review Date** | 2025-11-30 |
| **Owner** | John Smith (Business Analyst) |
| **Reviewed By** | [PENDING] |
| **Approved By** | [PENDING] |
| **Distribution** | PM Team, Architecture Team, Dev Team |

## Revision History

| Version | Date | Author | Changes | Approved By | Approval Date |
|---------|------|--------|---------|-------------|---------------|
| 1.0 | 2025-10-29 | ArcKit AI | Initial creation from `/arckit:traceability` command | [PENDING] | [PENDING] |
```

## Example Usage

User: `/arckit:traceability Generate traceability matrix for payment gateway project`

You should:

- Use the hook's requirements table (70 requirements pre-extracted with IDs, categories, priorities, coverage status)
- Use the hook's coverage summary (by category and priority) as the baseline metrics
- Use the hook's orphan requirements and design-only references for gap analysis
- Read vendor HLD/DLD files for component/module names (hook only extracted req ID references)
- Build forward traceability using hook data + vendor prose:
  - FR-001 (Process payment) → PaymentService (HLD) → PaymentController.processPayment() (DLD) → Test: TC-001, TC-002
  - NFR-S-001 (PCI-DSS) → SecurityArchitecture (HLD) → TokenVault, Encryption (DLD) → Test: SEC-001 to SEC-015
  - BR-003 (Cost savings) → [NO DESIGN MAPPING] - ORPHAN! (from hook's orphan list)
- Flag gaps using hook's coverage data:
  - CRITICAL: BR-003 (Cost savings) has no success metrics defined
  - HIGH: NFR-R-002 (99.99% uptime) has no disaster recovery tests
  - MEDIUM: NFR-P-003 (Database performance) missing load tests
- **Overall Score**: 85/100 (Good, but gaps must be addressed)
- **Recommendation**: APPROVED WITH CONDITIONS - address 3 critical gaps
- Write detailed matrix (including gap analysis) to `projects/001-payment-gateway/ARC-001-TRAC-v1.0.md`

## Important Notes

- Traceability is required for compliance (ISO, FDA, automotive, etc.)
- Every MUST requirement MUST be traced to tests (non-negotiable)
- Orphan design elements may indicate scope creep (investigate!)
- Orphan requirements may indicate incomplete design (blocking issue!)
- Traceability matrix should be updated throughout project lifecycle
- Use this for:
  - Go/no-go release decisions
  - Audit trail for compliance
  - Impact analysis for change requests
  - Test coverage verification
- A requirement is only "done" when it's implemented AND tested
- Missing traceability = missing accountability
- **Markdown escaping**: When writing less-than or greater-than comparisons, always include a space after `<` or `>` (e.g., `< 3 seconds`, `> 99.9% uptime`) to prevent markdown renderers from interpreting them as HTML tags or emoji
