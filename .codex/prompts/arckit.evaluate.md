---
description: "Create vendor evaluation framework and score vendor proposals"
---

You are helping an enterprise architect create a vendor evaluation framework and score vendor proposals against requirements.

## User Input

```text
$ARGUMENTS
```

## Instructions

1. **Identify the project**: The user should specify a project name or number
   - Example: "Create evaluation framework for payment gateway project"
   - Example: "Evaluate vendors for project 001"

2. **Read Available Documents**:

   Scan the project directory for existing artifacts and read them to inform this evaluation:

   **MANDATORY** (warn if missing):
   - `ARC-*-REQ-*.md` in `projects/{project-dir}/` — Requirements specification
     - Extract: BR/FR/NFR/INT/DR requirements to evaluate vendors against
     - If missing: warn user to run `/arckit.requirements` first
   - `ARC-000-PRIN-*.md` in `projects/000-global/` — Architecture principles
     - Extract: Technology standards, governance constraints, compliance requirements for evaluation criteria
     - If missing: warn user to run `/arckit.principles` first

   **RECOMMENDED** (read if available, note if missing):
   - `ARC-*-SOW-*.md` in `projects/{project-dir}/` — Statement of Work
     - Extract: Pre-defined evaluation criteria, scope, deliverables
   - `ARC-*-DOS-*.md` in `projects/{project-dir}/` — DOS procurement documentation
     - Extract: Evaluation criteria, essential/desirable skills, assessment approach
   - `ARC-*-RSCH-*.md` or `ARC-*-AWSR-*.md` or `ARC-*-AZUR-*.md` in `projects/{project-dir}/` — Technology research
     - Extract: Market landscape, vendor options, technology recommendations
   - `ARC-*-GCLD-*.md` in `projects/{project-dir}/procurement/` — G-Cloud search results
     - Extract: Shortlisted services, feature comparisons, compliance matches

   **OPTIONAL** (read if available, skip silently if missing):
   - `ARC-*-STKE-*.md` in `projects/{project-dir}/` — Stakeholder analysis
     - Extract: Evaluation panel composition, stakeholder priorities
   - `ARC-*-DPIA-*.md` in `projects/{project-dir}/` — DPIA
     - Extract: Data protection requirements for vendor assessment

   **What to extract from each document**:
   - **Principles**: Governance standards, technology constraints for evaluation alignment
   - **Requirements**: BR/FR/NFR/INT/DR IDs and priorities to score vendors against
   - **SOW/DOS**: Pre-defined evaluation criteria, scope, deliverables
   - **Research**: Market context, vendor landscape, technology recommendations

3. **Read the templates** (with user override support):
   - **First**, check if `.arckit/templates-custom/evaluation-criteria-template.md` exists (user override)
   - **If found**: Read the user's customized template
   - **If not found**: Read `.arckit/templates/evaluation-criteria-template.md` (default)
   - **Also read** the scoring template: check `.arckit/templates-custom/vendor-scoring-template.md` first, then `.arckit/templates/vendor-scoring-template.md`

   > **Note**: Read the `VERSION` file and update the version in the template metadata line when generating.
   > **Tip**: Users can customize templates with `/arckit.customize evaluate`

4. **Check for External Documents** (optional):

   Scan for external (non-ArcKit) documents the user may have provided:

   **Vendor Proposals & Capability Statements**:
   - **Look in**: `projects/{project-dir}/vendors/{vendor}/`
   - **File types**: PDF (.pdf), Word (.docx), Markdown (.md)
   - **What to extract**: Proposed solution, pricing, team qualifications, case studies, certifications, SLA commitments
   - **Examples**: `proposal-v1.0.pdf`, `capability-statement.docx`, `pricing-schedule.pdf`

   **Evaluation Reference Documents**:
   - **Look in**: `projects/{project-dir}/external/`
   - **File types**: PDF, Word, Markdown
   - **What to extract**: Industry benchmarks, analyst reports, reference check notes
   - **Examples**: `gartner-mq-2025.pdf`, `reference-check-notes.md`

   **Enterprise-Wide Evaluation Frameworks**:
   - **Look in**: `projects/000-global/external/`
   - **File types**: PDF, Word, Markdown
   - **What to extract**: Enterprise evaluation frameworks, procurement scoring templates, cross-project vendor assessment benchmarks

   **User prompt**: If no vendor proposals found, ask:
   "Do you have vendor proposal documents to evaluate? I can read PDFs and Word docs directly. Place them in `projects/{project-dir}/vendors/{vendor-name}/` and re-run, or skip to create the evaluation framework only."

   **Important**: This command works without external documents. They enhance output quality but are never blocking.

5. **Determine the task**: The user may want to:
   - **Create evaluation framework** (before receiving proposals)
   - **Score a specific vendor** (after receiving proposal)
   - **Compare multiple vendors** (after receiving several proposals)

### Task A: Create Evaluation Framework

If creating a new framework:

1. **Define mandatory qualifications** (pass/fail):
   - Required certifications (e.g., PCI-DSS, ISO 27001, SOC 2)
   - Minimum experience requirements
   - Financial stability requirements
   - References from similar projects

2. **Create scoring criteria** (100 points total):
   - **Technical Approach** (typically 35 points):
     - Solution design quality
     - Architecture alignment with principles
     - Technology choices
     - Innovation and best practices
   - **Project Approach** (typically 20 points):
     - Methodology (Agile, Waterfall, hybrid)
     - Risk management approach
     - Quality assurance process
     - Change management approach
   - **Team Qualifications** (typically 25 points):
     - Relevant experience
     - Team composition
     - Key personnel CVs
     - Training and certifications
   - **Company Experience** (typically 10 points):
     - Similar project references
     - Industry expertise
     - Financial stability
     - Client retention rate
   - **Pricing** (typically 10 points):
     - Cost competitiveness
     - Pricing model clarity
     - Value for money

3. **Define evaluation process**:
   - Scoring methodology
   - Evaluation team composition
   - Review timeline
   - Decision criteria (e.g., must score >70 to be considered)


---

**CRITICAL - Auto-Populate Document Control Fields**:

Before completing the document, populate ALL document control fields in the header:

**Generate Document ID**:
```bash
# Use the ArcKit document ID generation script
DOC_ID=$(.arckit/scripts/bash/generate-document-id.sh "${PROJECT_ID}" "EVAL" "${VERSION}")
# Example output: ARC-001-EVAL-v1.0
```

**Populate Required Fields**:

*Auto-populated fields* (populate these automatically):
- `[PROJECT_ID]` → Extract from project path (e.g., "001" from "projects/001-project-name")
- `[VERSION]` → "1.0" (or increment if previous version exists)
- `[DATE]` / `[YYYY-MM-DD]` → Current date in YYYY-MM-DD format
- `[DOCUMENT_TYPE_NAME]` → "Vendor Evaluation Framework"
- `ARC-[PROJECT_ID]-EVAL-v[VERSION]` → Use generated DOC_ID
- `[COMMAND]` → "arckit.evaluate"

*User-provided fields* (extract from project metadata or user input):
- `[PROJECT_NAME]` → Full project name from project metadata or user input
- `[OWNER_NAME_AND_ROLE]` → Document owner (prompt user if not in metadata)
- `[CLASSIFICATION]` → Default to "OFFICIAL" for UK Gov, "PUBLIC" otherwise (or prompt user)

*Calculated fields*:
- `[YYYY-MM-DD]` for Review Date → Current date + 30 days

*Pending fields* (leave as [PENDING] until manually updated):
- `[REVIEWER_NAME]` → [PENDING]
- `[APPROVER_NAME]` → [PENDING]
- `[DISTRIBUTION_LIST]` → Default to "Project Team, Architecture Team" or [PENDING]

**Populate Revision History**:

```markdown
| 1.0 | {DATE} | ArcKit AI | Initial creation from `/arckit.evaluate` command | [PENDING] | [PENDING] |
```

**Populate Generation Metadata Footer**:

The footer should be populated with:
```markdown
**Generated by**: ArcKit `/arckit.evaluate` command
**Generated on**: {DATE} {TIME} GMT
**ArcKit Version**: [Read from VERSION file]
**Project**: {PROJECT_NAME} (Project {PROJECT_ID})
**AI Model**: [Use actual model name, e.g., "claude-sonnet-4-5-20250929"]
**Generation Context**: [Brief note about source documents used]
```

---

4. **Write output** to `projects/{project-dir}/ARC-{PROJECT_ID}-EVAL-v1.0.md`

### Task B: Score a Vendor Proposal

If scoring a specific vendor:

1. **Create vendor directory**: `projects/{project-dir}/vendors/{vendor-name}/`

2. **Ask key questions** to gather information:
   - "Do you have access to the vendor's proposal document?"
   - "What strengths stood out in their proposal?"
   - "What concerns or gaps did you notice?"
   - "How well does their approach align with requirements?"

3. **Score each category** based on the evaluation criteria:
   - Use the point system from ARC-{PROJECT_ID}-EVAL-v*.md
   - Provide specific justification for each score
   - Reference requirement IDs where applicable
   - Flag any mandatory qualifications that are missing (instant disqualification)

4. **Document findings**:
   - Overall score (e.g., 78/100)
   - Category breakdown
   - Strengths (what they did well)
   - Weaknesses (gaps or concerns)
   - Risk assessment
   - Recommendation (Recommend/Consider/Not Recommended)

5. **Write outputs**:
   - `projects/{project-dir}/vendors/{vendor-name}/evaluation.md` - Detailed scoring
   - `projects/{project-dir}/vendors/{vendor-name}/notes.md` - Additional notes
   - Update `projects/{project-dir}/ARC-{PROJECT_ID}-EVAL-v*.md` - Comparative table

### Task C: Compare Multiple Vendors

If comparing vendors:

1. **Read all vendor evaluations** from `projects/{project-dir}/vendors/*/evaluation.md`

2. **Create comparison matrix**:
   - Side-by-side scoring table
   - Strengths comparison
   - Risk comparison
   - Cost comparison (if available)

3. **Generate recommendation**:
   - Top choice with justification
   - Runner-up option
   - Risk mitigation for chosen vendor
   - Contract negotiation points

4. **Write output** to `projects/{project-dir}/ARC-{PROJECT_ID}-VEND-v1.0.md`

## Example Usage

### Example 1: Create Framework

User: `/arckit.evaluate Create evaluation framework for payment gateway project`

You should:
- Read requirements and SOW
- Define mandatory quals: PCI-DSS certified, 5+ years payment processing
- Create scoring criteria: Technical (35), Project (20), Team (25), Experience (10), Price (10)
- Write to `projects/001-payment-gateway/ARC-001-EVAL-v1.0.md`

### Example 2: Score Vendor

User: `/arckit.evaluate Score Acme Payment Solutions proposal for project 001`

You should:
- Ask for proposal details
- Create `projects/001-payment-gateway/vendors/acme-payment-solutions/`
- Score against criteria (e.g., Technical: 28/35, Team: 20/25, Total: 76/100)
- Document strengths: "Strong PCI-DSS expertise, good reference projects"
- Document weaknesses: "Limited cloud experience, timeline aggressive"
- Write evaluation and update summary table

### Example 3: Compare Vendors

User: `/arckit.evaluate Compare all vendors for payment gateway project`

You should:
- Read evaluations for all vendors in projects/001-payment-gateway/vendors/
- Create comparison: Acme (76), BestPay (82), CloudPayments (71)
- Recommend: BestPay - highest score, best cloud experience
- Write to `projects/001-payment-gateway/ARC-001-VEND-v1.0.md`

## Important Notes

- Evaluation must be objective and based on documented criteria
- All scores require specific justification (no arbitrary numbers)
- Mandatory qualifications are pass/fail (missing any = disqualified)
- Reference specific requirements (e.g., "Meets NFR-S-001 for PCI-DSS compliance")
- Document any conflicts of interest or bias
- Keep vendor proposals confidential (don't commit PDFs to git by default)
- Final decision authority always stays with the architect/client
