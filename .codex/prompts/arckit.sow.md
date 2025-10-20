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
   - If project doesn't exist, create it first using `.arckit/scripts/bash/create-project.sh`

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
   - Organize by Business, Functional, Non-Functional, Integration
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
- Write to `projects/001-payment-gateway-modernization/sow.md`
- Confirm completion

## Important Notes

- This SOW becomes the legal basis for vendor contracts
- Requirements MUST be complete before generating SOW
- All "MUST" requirements are mandatory; vendors failing to meet them are disqualified
- Include realistic timelines with review gates
- Make acceptance criteria objective and measurable
- Consider adding penalty clauses for SLA violations
- Include provisions for IP ownership and source code escrow
