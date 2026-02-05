---
description: Create Strategic Outline Business Case (SOBC) using UK Government Green Book 5-case model
---

You are helping an enterprise architect create a Strategic Outline Business Case (SOBC) to justify investment in a technology project.

## About SOBC

A **Strategic Outline Business Case (SOBC)** is the first stage in the UK Government business case lifecycle:
- **SOBC**: Strategic Outline (this command) - High-level case for change, done BEFORE detailed requirements
- **OBC**: Outline Business Case - After some design work, with refined costs
- **FBC**: Full Business Case - Detailed case with accurate costs, ready for final approval

This command creates the **SOBC** - the strategic case to secure approval to proceed with requirements and design.

## User Input

```text
$ARGUMENTS
```

## Instructions

This command creates a **Strategic Outline Business Case (SOBC)** following HM Treasury Green Book 5-case model. This is a high-level justification done BEFORE detailed requirements to secure approval and funding.

**When to use this:**
- **After**: `/arckit.stakeholders` (MANDATORY - SOBC must link to stakeholder goals)
- **Before**: `/arckit.requirements` (SOBC justifies whether to proceed with detailed requirements)
- **Purpose**: Secure executive approval and funding to proceed to next stage

**Note**: Later stages will create OBC (Outline Business Case) and FBC (Full Business Case) with more accurate costs. This SOBC uses strategic estimates and options analysis.

1. **Read Available Documents**:

   Scan the project directory for existing artifacts and read them to inform the SOBC:

   **MANDATORY** (warn if missing):
   - `ARC-*-STKE-*.md` in `projects/{project}/` — Stakeholder analysis
     - Extract: ALL stakeholder goals (become benefits), drivers (explain WHY needed), conflicts (become risks/mitigations), outcomes (become success criteria)
     - If missing: STOP and warn user to run `/arckit.stakeholders` first — every SOBC benefit MUST trace to a stakeholder goal

   **RECOMMENDED** (read if available, note if missing):
   - `ARC-000-PRIN-*.md` in `projects/000-global/` — Architecture principles
     - Extract: Strategic alignment, technology standards, compliance requirements
   - `ARC-*-RISK-*.md` in `projects/{project}/` — Risk register
     - Extract: Risks for Management Case, risk appetite, mitigations

   **OPTIONAL** (read if available, skip silently if missing):
   - `ARC-*-REQ-*.md` in `projects/{project}/` — Requirements specification
     - Extract: Detailed requirements for more accurate cost estimates
   - `ARC-*-PLAN-*.md` in `projects/{project}/` — Project plan
     - Extract: Timeline, phasing for Commercial Case delivery schedule

   **What to extract from each document**:
   - **Stakeholders**: Goals → benefits, drivers → strategic case, outcomes → success criteria
   - **Principles**: Strategic alignment, technology constraints
   - **Risk**: Risk register for Management Case Part E
   - **Requirements**: Scope detail for cost estimation accuracy

2. **Understand the request**: The user may be:
   - Creating initial SOBC (most common)
   - Updating existing SOBC with new information
   - Creating UK Government Green Book 5-case model (automatic for UK projects)
   - Evaluating multiple strategic options

3. **Check for External Documents** (optional):

   Scan for external (non-ArcKit) documents the user may have provided:

   **Budget Documents & Financial Forecasts**:
   - **Look in**: `projects/{project-dir}/external/`
   - **File types**: PDF (.pdf), Word (.docx), Markdown (.md)
   - **What to extract**: Budget allocations, cost forecasts, financial constraints, existing spend data, benefit projections
   - **Examples**: `budget-proposal.pdf`, `financial-forecast.docx`, `market-research.pdf`

   **Organizational Financial Policies**:
   - **Look in**: `projects/000-global/policies/`
   - **File types**: PDF, Word, Markdown
   - **What to extract**: Spending thresholds, approval gates, Green Book discount rates, procurement rules
   - **Examples**: `spending-policy.pdf`, `procurement-thresholds.docx`

   **User prompt**: If no external financial docs found but they would improve the business case, ask:
   "Do you have any budget documents, financial forecasts, or market research? I can read PDFs directly. Place them in `projects/{project-dir}/external/` and re-run, or skip."

   **Important**: This command works without external documents. They enhance output quality but are never blocking.

4. **Determine project context**:
   - If user mentions "UK Government", "public sector", "department", "ministry" → Use full Green Book format
   - Otherwise → Use Green Book structure but adapt language for private sector
   - Check stakeholder analysis for government-specific stakeholders (Minister, Permanent Secretary, Treasury, NAO)

5. **Read stakeholder analysis carefully**:
   - Extract ALL stakeholder goals (these become benefits!)
   - Extract stakeholder drivers (these explain WHY project needed)
   - Extract conflicts (these become risks/mitigations)
   - Extract outcomes (these become success criteria)
   - Note: EVERY benefit in SOBC MUST trace to a stakeholder goal

6. **Generate comprehensive SOBC**:

   **Read the template** (with user override support):
   - **First**, check if `.arckit/templates-custom/sobc-template.md` exists (user override)
   - **If found**: Read the user's customized template
   - **If not found**: Read `.arckit/templates/sobc-template.md` (default)

   > **Note**: Read the `VERSION` file and update the version in the template metadata line when generating.
   > **Tip**: Users can customize templates with `/arckit.customize sobc`

   **Five Cases (HM Treasury Green Book Model)**:

   **A. Strategic Case**:
   - **Problem Statement**: What's broken? (from stakeholder pain points)
   - **Strategic Fit**: How does this align with organizational strategy?
   - **Stakeholder Drivers**: Map to stakeholder analysis
     - Link EACH driver to strategic imperative
     - Show intensity (CRITICAL/HIGH/MEDIUM)
   - **Scope**: What's in/out of scope (high-level)
   - **Dependencies**: What else must happen?
   - **Why Now?**: Urgency and opportunity cost

   **B. Economic Case**:
   - **Options Analysis** (CRITICAL):
     - Option 0: Do Nothing (baseline)
     - Option 1: Minimal viable solution
     - Option 2: Balanced approach (often recommended)
     - Option 3: Comprehensive solution
     - For EACH option:
       - High-level costs (rough order of magnitude)
       - Benefits delivered (% of stakeholder goals met)
       - Risks
       - Pros/cons
   - **Benefits Mapping**:
     - Link EACH benefit to specific stakeholder goal from ARC-{PROJECT_ID}-STKE-v*.md
     - Quantify where possible (use stakeholder outcomes for metrics)
     - Categorize: FINANCIAL | OPERATIONAL | STRATEGIC | COMPLIANCE | RISK
   - **Cost Estimates** (high-level):
     - Capital costs (build)
     - Operational costs (run)
     - 3-year TCO estimate
   - **Economic Appraisal**:
     - Qualitative assessment (this is strategic, not detailed)
     - Expected ROI range
     - Payback period estimate
   - **Recommended Option**: Which option and why

   **C. Commercial Case**:
   - **Procurement Strategy**:
     - UK Government: Digital Marketplace route (G-Cloud, DOS, Crown Hosting)
     - Private Sector: Build vs Buy vs Partner
   - **Market Assessment**:
     - Supplier availability
     - SME opportunities (UK Gov requirement)
     - Competition considerations
   - **Sourcing Route**: How will we acquire this?
   - **Contract Approach**: Framework, bespoke, managed service?

   **D. Financial Case**:
   - **Budget Requirement**: How much needed?
   - **Funding Source**: Where does money come from?
   - **Approval Thresholds**: Who must approve?
     - UK Gov: HMT approval needed above £X?
     - Private: Board approval needed?
   - **Affordability**: Can organization afford this?
   - **Cash Flow**: When do we need money?
   - **Budget Constraints**: Any spending controls?

   **E. Management Case**:
   - **Governance**:
     - Who owns this? (from stakeholder RACI matrix)
     - Steering committee membership
     - Decision authorities
   - **Project Approach**: Agile? Waterfall? Phased?
   - **Key Milestones**:
     - Approval gates
     - Major deliverables
     - Go-live target
   - **Resource Requirements**:
     - Team size (estimate)
     - Skills needed
     - External support
   - **Change Management**:
     - Stakeholder engagement plan (from stakeholder analysis)
     - Training needs
     - Resistance mitigation (from stakeholder conflict analysis)
   - **Benefits Realization**:
     - How will we measure success? (use stakeholder outcomes)
     - Who monitors benefits?
     - When do we expect to see benefits?
   - **Risk Management**:
     - Top 5-10 strategic risks
     - Mitigation strategies
     - Risk owners (from stakeholder RACI)

7. **Ensure complete traceability**:

   Every element must link back to stakeholder analysis:

   ```
   Stakeholder Driver D-1 (CFO: Reduce costs - FINANCIAL, HIGH)
     → Strategic Case: Cost pressure driving change
       → Economic Case: Benefit B-1: £2M annual savings (maps to CFO Goal G-1)
         → Financial Case: 18-month payback acceptable to CFO
           → Management Case: CFO sits on steering committee (RACI: Accountable)
             → Success Criterion: CFO Outcome O-1 measured monthly
   ```

8. **Include decision framework**:
   - **Recommendation**: Which option to proceed with?
   - **Rationale**: Why this option? (reference stakeholder goals met)
   - **Go/No-Go Criteria**: Under what conditions do we proceed?
   - **Next Steps**: If approved, what happens next?
     - Typically: `/arckit.requirements` to define detailed requirements
     - Then: `/arckit.business-case-detailed` with accurate costs

**CRITICAL - Auto-Populate Document Control Fields**:

Before completing the document, populate ALL document control fields in the header:

### Step 0: Detect Version

Before generating the document ID, check if a previous version exists:

1. Look for existing `ARC-{PROJECT_ID}-SOBC-v*.md` files in the project directory
2. **If no existing file**: Use VERSION="1.0"
3. **If existing file found**:
   - Read the existing document to understand its scope
   - Compare against current inputs and requirements
   - **Minor increment** (e.g., 1.0 → 1.1): Scope unchanged — refreshed estimates, updated stakeholder data, corrected details
   - **Major increment** (e.g., 1.0 → 2.0): Scope materially changed — new options added, fundamentally different recommendations, significant new stakeholder goals
4. Use the determined version for document ID, filename, Document Control, and Revision History
5. For v1.1+/v2.0+: Add a Revision History entry describing what changed from the previous version

### Step 1: Generate Document ID
```bash
# Use the ArcKit document ID generation script
DOC_ID=$(.arckit/scripts/bash/generate-document-id.sh "${PROJECT_ID}" "SOBC" "${VERSION}")
# Example output: ARC-001-SOBC-v1.0
```

### Step 2: Populate Required Fields

**Auto-populated fields** (populate these automatically):
- `[PROJECT_ID]` → Extract from project path (e.g., "001" from "projects/001-project-name")
- `[VERSION]` → Determined version from Step 0
- `[DATE]` / `[YYYY-MM-DD]` → Current date in YYYY-MM-DD format
- `[DOCUMENT_TYPE_NAME]` → "Strategic Outline Business Case (SOBC)"
- `[CLASSIFICATION]` → Default to "OFFICIAL" for UK Gov, "INTERNAL" for private sector
- `[STATUS]` → "DRAFT" for new documents

**User-specified fields** (must be confirmed with user):
- `[OWNER]` → Who owns this business case? (typically from stakeholder RACI matrix)
- `[REVIEWED_BY]` → Who will review? (mark as "PENDING" if not yet reviewed)
- `[APPROVED_BY]` → Who must approve? (mark as "PENDING" if not yet approved)

9. **Write the output**:
   - Create or update `projects/NNN-project-name/ARC-{PROJECT_ID}-SOBC-v${VERSION}.md`
   - Use project directory structure (create if doesn't exist)
   - File name pattern: `ARC-{PROJECT_ID}-SOBC-v{VERSION}.md`
   - Later stages will be: `ARC-{PROJECT_ID}-OBC-v*.md` (Outline Business Case), `ARC-{PROJECT_ID}-FBC-v*.md` (Full Business Case)


**IMPORTANT - Populate Metadata Footer**:
Before completing, populate the metadata footer at the end of the generated document with:
- `[DATE]` → Current date in YYYY-MM-DD format
- `[VERSION]` → Current ArcKit version read from `VERSION` (always use the exact value in that file—do not hardcode or fall back)
- `[PROJECT_NAME]` → The actual project name
- `[AI_MODEL]` → The AI model used (e.g., "claude-sonnet-4-5-20250929", "gpt-4", "gemini-pro")

Example populated footer:
```markdown
**Generated by**: ArcKit `/arckit.requirements` command
**Generated on**: 2025-10-29
**ArcKit Version**: v{ARC_VERSION}
**Project**: Windows 10 to Windows 11 Migration using Microsoft InTune (Project 001)
**Model**: claude-sonnet-4-5-20250929
```


10. **Use appropriate language**:
   - **UK Government**: Use Green Book terminology (intervention, public value, social benefit, spending controls)
   - **Private Sector**: Adapt to commercial language (investment, shareholder value, competitive advantage)
   - **Always**: Link to stakeholder analysis for credibility

11. **Flag uncertainties**:
    - Mark estimates as "Rough Order of Magnitude (ROM)"
    - Flag where more analysis needed
    - Note dependencies on external factors
    - Recommend sensitivity analysis for key assumptions

## Output Format

Provide:
1. **Location**: `projects/NNN-project-name/ARC-{PROJECT_ID}-SOBC-v1.0.md`
2. **Summary**:
   - "Created Strategic Outline Business Case (SOBC) for [project name]"
   - "Analyzed [X] options against [Y] stakeholder goals"
   - "Recommended: Option [X] - [name]"
   - "Estimated investment: £[X]M over 3 years"
   - "Expected benefits: £[X]M over 3 years from [stakeholder goals]"
   - "Payback period: [X] months"
   - "Business case lifecycle stage: SOBC (strategic outline)"
3. **Next steps**:
   - "Present to [approval body] for go/no-go decision"
   - "If approved: Run `/arckit.requirements` to define detailed requirements"
   - "After requirements: Create OBC (Outline Business Case) with refined costs"
   - "After design: Create FBC (Full Business Case) for final approval"
4. **Traceability note**:
   - "All [X] benefits traced to stakeholder goals in ARC-{PROJECT_ID}-STKE-v*.md"
   - "All [Y] risks linked to stakeholder conflict analysis"

## Common Patterns

**Pattern 1: Technology Modernization**:
- Strategic Case: Legacy systems failing, stakeholder frustration high
- Economic Case: 3-5 options from do-nothing to complete rebuild
- Commercial Case: Cloud migration, Digital Marketplace G-Cloud
- Financial Case: £2-5M over 3 years, CFO approval needed
- Management Case: Phased migration, minimal disruption

**Pattern 2: New Digital Service**:
- Strategic Case: Citizen/customer demand, competitive pressure
- Economic Case: MVP vs full-featured comparison
- Commercial Case: Build in-house vs platform vendor
- Financial Case: £500K-2M year 1, ongoing £200K/year
- Management Case: Agile delivery, beta to live

**Pattern 3: Compliance/Risk Driven**:
- Strategic Case: Regulatory requirement, audit findings
- Economic Case: Minimum compliance vs best practice
- Commercial Case: Specialist vendors, certification needed
- Financial Case: Non-negotiable spend, insurance cost reduction
- Management Case: Deadline-driven, stakeholder compliance team owns

## UK Government Specific Guidance

For UK Government/public sector projects, ensure:

1. **Strategic Case includes**:
   - Policy alignment (manifesto commitments, departmental objectives)
   - Public value (not just efficiency, but citizen outcomes)
   - Minister/Permanent Secretary drivers
   - Parliamentary accountability

2. **Economic Case includes**:
   - Social Cost Benefit Analysis (if required)
   - Green Book discount rates (3.5% standard)
   - Optimism bias adjustment (add contingency)
   - Wider economic benefits

3. **Commercial Case includes**:
   - Digital Marketplace assessment (G-Cloud, DOS)
   - SME participation commitment
   - Social value (minimum 10% weighting)
   - Open source consideration

4. **Financial Case includes**:
   - HM Treasury approval thresholds
   - Spending Review settlement alignment
   - Value for money assessment
   - Whole-life costs

5. **Management Case includes**:
   - Service Standard assessment plan
   - GDS/CDDO engagement
   - Cyber security (NCSC consultation)
   - Accessibility (WCAG 2.2 AA compliance)
   - Data protection (ICO/DPIA requirements)

## Error Handling

If stakeholder analysis doesn't exist:
- **DO NOT proceed** with SOBC
- Tell user: "SOBC requires stakeholder analysis to link benefits to stakeholder goals. Please run `/arckit.stakeholders` first."

If user wants detailed business case:
- Tell user: "This command creates SOBC (Strategic Outline Business Case) - the first stage with high-level estimates. After `/arckit.requirements`, create OBC (Outline Business Case) with refined costs. After design, create FBC (Full Business Case) for final approval."

If project seems too small for full 5-case:
- Still use 5-case structure but scale appropriately
- Smaller projects: 2-3 pages per case
- Major programmes: 10-20 pages per case

## Template Reference

Use the template at `.arckit/templates/sobc-template.md` as the structure. Fill in with:
- Stakeholder analysis data (goals, drivers, outcomes, conflicts)
- Architecture principles (strategic alignment)
- User's project description
- Industry/sector best practices
- UK Government guidance (if applicable)

## Output Instructions

**CRITICAL - Token Efficiency**:

To avoid exceeding Claude Code's 32K token output limit, you MUST use the following strategy:

### 1. Generate SOBC Document

Create the comprehensive, executive-ready Strategic Outline Business Case following the 5-case model template structure.

### 2. Write Directly to File

**Use the Write tool** to create `projects/[PROJECT]/ARC-{PROJECT_ID}-SOBC-v${VERSION}.md` with the complete SOBC document.

**DO NOT** output the full document in your response. This would exceed token limits.

### 3. Show Summary Only

After writing the file, show ONLY a concise summary:

```markdown
## SOBC Complete ✅

**Project**: [Project Name]
**File Created**: `projects/[PROJECT]/ARC-{PROJECT_ID}-SOBC-v1.0.md`

### SOBC Summary

**Strategic Case**:
- Strategic Alignment: [Brief summary of how project aligns with strategy]
- Spending Objectives: [List 3-5 key objectives linked to stakeholder goals]
- Critical Success Factors: [3-5 CSFs]

**Economic Case**:
- Options Appraised: [Number] options evaluated
- Preferred Option: [Option number and name]
- NPV over [X] years: £[Amount]
- BCR (Benefit-Cost Ratio): [Ratio]
- Key Benefits: [Top 3-5 benefits with £ values]

**Commercial Case**:
- Procurement Route: [e.g., Digital Marketplace, G-Cloud, Open tender]
- Contract Strategy: [e.g., Single supplier, Framework, Multi-supplier]
- Risk Allocation: [Public/Private split]

**Financial Case**:
- Total Budget Required: £[Amount]
- Funding Source: [e.g., Spending Review settlement, reserves]
- Affordability: [Confirmed/To be confirmed]
- Cash Flow: [Summary of phasing]

**Management Case**:
- Project Approach: [Agile/Waterfall/Hybrid]
- Governance: [Board/SRO structure]
- Key Risks: [Top 3-5 risks]
- Timeline: [Start] - [End] ([Duration])

**UK Government Specific** (if applicable):
- Green Book Compliance: [5-case model, options appraisal, sensitivity analysis]
- Technology Code of Practice: [Points addressed]
- Service Standard: [Assessment plan]
- Social Value: [% weighting in procurement]

### What's in the Document

- Executive Summary (2-3 pages)
- Strategic Case: Why we need to act (10-15 pages)
- Economic Case: Options and value for money (15-20 pages)
- Commercial Case: Procurement approach (5-10 pages)
- Financial Case: Funding and affordability (5-10 pages)
- Management Case: Delivery capability (10-15 pages)
- Appendices: Stakeholder analysis, risk register, assumptions

**Total Length**: [X] pages (ready for senior leadership and Treasury approval)

### Next Steps

- Review `ARC-{PROJECT_ID}-SOBC-v1.0.md` for full SOBC document
- Present to Senior Responsible Owner (SRO) for approval
- If approved, run `/arckit.requirements` to define detailed requirements
- After requirements, refine to Outline Business Case (OBC) with firmer costs
```

**Statistics to Include**:
- Number of options evaluated
- NPV and BCR for preferred option
- Total budget required
- Timeline (start date - end date)
- Number of stakeholder goals addressed
- Number of critical success factors
- Number of key risks identified

Generate the SOBC now, write to file using Write tool, and show only the summary above.
