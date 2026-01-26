---
description: Create vendor evaluation framework and score vendor proposals
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

2. **Prerequisites Check**:

**IMPORTANT**: Check prerequisites before proceeding:

a. **Architecture Principles** (MUST exist):
   - Check if `.arckit/memory/architecture-principles.md` exists
   - If NOT found: ERROR "Run /arckit.principles first to define governance standards"
   - Vendor evaluation MUST align with organizational governance

b. **Project Requirements** (MUST exist):
   - Check if user specified a project name/number
   - Look for `projects/{project-dir}/requirements.md`
   - If NOT found: ERROR "Run /arckit.requirements first to define what you're evaluating"

c. **Statement of Work** (RECOMMENDED):
   - Check if `projects/{project-dir}/sow.md` or `projects/{project-dir}/procurement/dos.md` exists
   - If NOT found: WARN "Consider running /arckit.sow or /arckit.dos to define evaluation criteria"
   - If exists: Read it to understand pre-defined evaluation criteria

3. **Read project context**:
   - Read `projects/{project-dir}/requirements.md` to understand what's being evaluated
   - Read `projects/{project-dir}/sow.md` to understand evaluation criteria already defined
   - Read `.arckit/memory/architecture-principles.md` to ensure alignment with governance

4. **Read the template**: Read `.arckit/templates/evaluation-criteria-template.md`

   > **Note**: Read the `VERSION` file and update the version in the template metadata line when generating.

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

4. **Write output** to `projects/{project-dir}/evaluation-criteria.md`

### Task B: Score a Vendor Proposal

If scoring a specific vendor:

1. **Create vendor directory**: `projects/{project-dir}/vendors/{vendor-name}/`

2. **Ask key questions** to gather information:
   - "Do you have access to the vendor's proposal document?"
   - "What strengths stood out in their proposal?"
   - "What concerns or gaps did you notice?"
   - "How well does their approach align with requirements?"

3. **Score each category** based on the evaluation criteria:
   - Use the point system from evaluation-criteria.md
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
   - Update `projects/{project-dir}/vendor-scoring-summary.md` - Comparative table

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

4. **Write output** to `projects/{project-dir}/vendor-comparison.md`

## Example Usage

### Example 1: Create Framework

User: `/arckit.evaluate Create evaluation framework for payment gateway project`

You should:
- Read requirements and SOW
- Define mandatory quals: PCI-DSS certified, 5+ years payment processing
- Create scoring criteria: Technical (35), Project (20), Team (25), Experience (10), Price (10)
- Write to `projects/001-payment-gateway/evaluation-criteria.md`

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
- Write to `projects/001-payment-gateway/vendor-comparison.md`

## Important Notes

- Evaluation must be objective and based on documented criteria
- All scores require specific justification (no arbitrary numbers)
- Mandatory qualifications are pass/fail (missing any = disqualified)
- Reference specific requirements (e.g., "Meets NFR-S-001 for PCI-DSS compliance")
- Document any conflicts of interest or bias
- Keep vendor proposals confidential (don't commit PDFs to git by default)
- Final decision authority always stays with the architect/client
