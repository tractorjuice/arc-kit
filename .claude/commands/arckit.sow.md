---
description: Generate Statement of Work (SOW) / RFP document for vendor procurement
---

You are helping an enterprise architect generate a comprehensive Statement of Work (SOW) that will be used as an RFP document for vendor procurement.

## User Input

```text
$ARGUMENTS
```

## Instructions

1. **Find the project**: The user should specify a project name or number
   - Example: "Generate SOW for payment gateway modernization"
   - Example: "Create SOW for project 001"
   - If project doesn't exist, create it first using:
     ```bash
     .arckit/scripts/bash/create-project.sh --name "project-name" --json
     ```
     Parse the JSON output to get the project path and ID

2. **Read the requirements**: Read `projects/{project-dir}/requirements.md`
   - If requirements don't exist, suggest running `/arckit.requirements` first
   - Requirements are the source of truth for the SOW

3. **Read the template**: Read `.arckit/templates/sow-template.md` to understand the structure

4. **Generate comprehensive SOW** with these sections:

   **Executive Summary**:
   - Project overview and objectives
   - Expected business outcomes
   - Key success criteria

   **Scope of Work**:
   - What's in scope (explicitly list)
   - What's out of scope (explicitly list)
   - Assumptions and constraints
   - Dependencies

   **Requirements**:
   - Import from requirements.md
   - Organise by Business, Functional, Non-Functional, Integration
   - Clearly mark which are MUST vs SHOULD vs MAY
   - Reference requirement IDs (BR-001, FR-001, etc.)

   **Deliverables**:
   - High-Level Design (HLD) document + diagrams
   - Detailed Design (DLD) document
   - Source code and documentation
   - Test plans and test results
   - Deployment runbooks
   - Training materials
   - Warranty and support terms

   **Timeline and Milestones**:
   - Suggested project phases
   - Key milestones and decision gates
   - Review and approval gates (HLD review, DLD review)

   **Vendor Qualifications**:
   - Required certifications
   - Team experience requirements
   - Reference requirements
   - Financial stability requirements

   **Proposal Requirements**:
   - Technical approach and methodology
   - Team composition and CVs
   - Project timeline with milestones
   - Pricing breakdown (fixed-price or T&M)
   - Risk mitigation approach
   - References

   **Evaluation Criteria**:
   - How proposals will be scored
   - Weighting for technical vs cost
   - Mandatory qualifications (pass/fail)
   - Reference to evaluation-criteria-template.md

   **Contract Terms**:
   - Payment terms and milestones
   - Acceptance criteria
   - Change management process
   - Intellectual property rights
   - Warranties and support
   - Termination clauses

5. **Ensure alignment**:
   - Cross-reference architecture principles from `.arckit/memory/architecture-principles.md`
   - Ensure all requirements from requirements.md are included
   - Add validation gates that align with principles

6. **Make it RFP-ready**:
   - Use formal language appropriate for legal review
   - Be specific and unambiguous
   - Include submission instructions and deadline
   - Specify format requirements (e.g., "proposals must be PDF")

7. **Write the output**:
   - Write to `projects/{project-dir}/sow.md`
   - Use the exact template structure




**CRITICAL - Auto-Populate Document Control Fields**:

Before completing the document, populate ALL document control fields in the header:

### Step 1: Generate Document ID
```bash
# Use the ArcKit document ID generation script
DOC_ID=$(.arckit/scripts/bash/generate-document-id.sh "${PROJECT_ID}" "SOW" "1.0")
# Example output: ARC-001-SOW-v1.0
```

### Step 2: Populate Required Fields

**Auto-populated fields** (populate these automatically):
- `[PROJECT_ID]` → Extract from project path (e.g., "001" from "projects/001-project-name")
- `[VERSION]` → Start with "1.0" for new documents
- `[DATE]` / `[YYYY-MM-DD]` → Current date in YYYY-MM-DD format
- `[DOCUMENT_TYPE_NAME]` → Use the document purpose (e.g., "Business and Technical Requirements")
- `ARC-[PROJECT_ID]-SOW-v[VERSION]` → Use generated DOC_ID from Step 1
- `[COMMAND]` → Current command name (e.g., "arckit.sow")

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
| 1.0 | {DATE} | ArcKit AI | Initial creation from `/arckit.sow` command | [PENDING] | [PENDING] |
```

### Step 4: Populate Generation Metadata Footer

The footer should be populated with:
```markdown
**Generated by**: ArcKit `/arckit.sow` command
**Generated on**: {DATE} {TIME} GMT
**ArcKit Version**: [Read from .arckit/VERSION file or use "0.6.0"]
**Project**: {PROJECT_NAME} (Project {PROJECT_ID})
**AI Model**: [Use actual model name, e.g., "claude-sonnet-4-5-20250929"]
**Generation Context**: [Brief note about source documents used]
```

### Example Fully Populated Document Control Section:

```markdown
## Document Control

| Field | Value |
|-------|-------|
| **Document ID** | ARC-001-SOW-v1.0 |
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
| 1.0 | 2025-10-29 | ArcKit AI | Initial creation from `/arckit.sow` command | [PENDING] | [PENDING] |
```


8. **Summarize what you created**:
   - Key scope items
   - Major deliverables
   - Suggested timeline
   - Next steps (e.g., "Now run `/arckit.evaluate` to create vendor evaluation framework")

## Example Usage

User: `/arckit.sow Generate SOW for payment gateway modernization project`

You should:
- Find project 001-payment-gateway-modernization
- Read requirements.md from that project
- Read architecture principles
- Generate comprehensive SOW:
  - Executive summary with business case
  - Scope: Payment processing, fraud detection, reporting (IN); mobile app (OUT)
  - All requirements from requirements.md with IDs
  - Deliverables: HLD, DLD, code, tests, runbooks
  - Timeline: 16 weeks (4 weeks HLD, 4 weeks DLD approval, 8 weeks implementation)
  - Vendor quals: PCI-DSS experience, financial services references
  - Evaluation: 60% technical, 40% cost
  - Contract: Milestone-based payments, 90-day warranty
- **CRITICAL - Token Efficiency**: Use the **Write tool** to create `projects/001-payment-gateway-modernization/sow.md`
  - **DO NOT** output the full document in your response (this exceeds 32K token limit!)
- Show summary only (see Output Instructions below)

## Important Notes

- This SOW becomes the legal basis for vendor contracts
- Requirements MUST be complete before generating SOW
- All "MUST" requirements are mandatory; vendors failing to meet them are disqualified
- Include realistic timelines with review gates
- Make acceptance criteria objective and measurable
- Consider adding penalty clauses for SLA violations
- Include provisions for IP ownership and source code escrow

## Output Instructions

**CRITICAL - Token Efficiency**:

### 1. Generate SOW Document

Create the comprehensive Statement of Work following the template structure.

### 2. Write Directly to File

**Use the Write tool** to create `projects/[PROJECT]/sow.md` with the complete SOW.

**DO NOT** output the full document in your response. This would exceed token limits.

### 3. Show Summary Only

After writing the file, show ONLY a concise summary:

```markdown
## SOW Complete ✅

**Project**: [Project Name]
**File Created**: `projects/[PROJECT]/sow.md`

### SOW Summary

**Scope**:
- In Scope: [List key deliverables in scope]
- Out of Scope: [List explicitly excluded items]
- Assumptions: [Number] key assumptions documented

**Requirements**:
- Total Requirements: [Number]
  - Business Requirements: [Number]
  - Functional Requirements: [Number]
  - Non-Functional Requirements: [Number]
  - Data Requirements: [Number]
  - Integration Requirements: [Number]
- Compliance: [List: PCI-DSS, GDPR, HIPAA, etc.]

**Deliverables**:
- Architecture: [e.g., HLD, DLD, ERD]
- Code: [e.g., Source code, unit tests, integration tests]
- Documentation: [e.g., User guides, runbooks, API docs]
- Other: [e.g., Training, data migration]

**Timeline**:
- Total Duration: [Number] weeks
- Phase 1 (HLD): [Number] weeks
- Phase 2 (DLD): [Number] weeks
- Phase 3 (Implementation): [Number] weeks
- Phase 4 (Testing & UAT): [Number] weeks

**Vendor Qualifications**:
- Required Experience: [e.g., 5+ years in financial services]
- Required Certifications: [e.g., PCI-DSS, ISO 27001]
- Team Size: Minimum [Number] FTEs
- References: [Number] client references required

**Evaluation Criteria**:
- Technical Approach: [X]%
- Cost: [X]%
- Experience & References: [X]%
- Timeline & Delivery Plan: [X]%

**Contract Terms**:
- Payment: [e.g., Milestone-based, monthly]
- Warranty: [e.g., 90 days post-delivery]
- SLA Penalties: [Yes/No]
- IP Ownership: [e.g., Client owns all IP]

**UK Government Specific** (if applicable):
- Procurement Route: [e.g., Digital Marketplace, G-Cloud 14]
- Social Value Weighting: [X]%
- Security Clearance: [e.g., SC, DV required]
- Open Source Policy: [Compliance noted]

### What's in the Document

- Executive Summary (business case and objectives)
- Project Scope (in/out/assumptions/dependencies)
- Complete Requirements (all BR, FR, NFR, DR, INT with IDs)
- Deliverables & Acceptance Criteria
- Project Timeline with Review Gates
- Vendor Qualifications & Experience Requirements
- Proposal Evaluation Criteria with Weightings
- Contract Terms & Conditions
- Technical Environment & Constraints
- Appendices (glossary, references, architecture principles)

**Total Length**: [X] pages (ready for RFP release)

### Next Steps

- Review `sow.md` for full SOW document
- Get legal review of contract terms
- Get procurement/finance approval
- Publish to Digital Marketplace (if UK Gov)
- Run `/arckit.evaluate` to create vendor evaluation framework
```

**Statistics to Include**:
- Total requirements
- Number of deliverables
- Timeline duration (weeks)
- Number of vendor qualifications
- Number of evaluation criteria
- Page count

Generate the SOW now, write to file using Write tool, and show only the summary above.
