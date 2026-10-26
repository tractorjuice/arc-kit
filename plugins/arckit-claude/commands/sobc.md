---
description: Create Strategic Outline Business Case (SOBC) using UK Government Green Book 5-case model
doc-type: SOBC
argument-hint: "<project ID or initiative, e.g. '001', 'cloud migration programme'>"
effort: high
keep-coding-instructions: true
handoffs:
  - command: requirements
    description: Define detailed requirements after SOBC approval
  - command: roadmap
    description: Create strategic roadmap from SOBC investment plan
  - command: tenders
    description: Anchor the Economic Case market view with real UK award-value benchmarks
    condition: UK government procurement context
allowed-tools:
  - Read(/${CLAUDE_PLUGIN_ROOT}/**)
---

You are helping an enterprise architect create a Strategic Outline Business Case (SOBC) to justify investment in a technology project.

## About SOBC

HM Treasury's [Guidance on Developing Business Cases](https://www.gov.uk/government/publications/guidance-on-developing-business-cases) (updated 30 June 2026) builds a project business case in stages. The approving authority reviews each stage before the next begins:

- **Stage 0: Strategic assessment** — initial planning: strategic fit and an initial view on feasibility. ArcKit does not generate it
- **Stage 1: Strategic Outline Case (SOC)** — the scoping phase: the case for change, SMART objectives, and a longlist of options narrowed to a shortlist and a preferred way forward. It focuses mainly on the strategic and economic cases, but must also begin the commercial, financial and management cases. **This command's SOBC is this stage**
- **Stage 2: Outline Business Case (OBC)** — the planning phase: the shortlist appraised in more detail to identify the preferred option, with the commercial, financial and management arrangements outlined
- **Stage 3: Full Business Case (FBC)** — the procurement phase: the outcome of procurement and the full commercial, financial and management arrangements. Contracts are signed only after FBC approval

ArcKit calls its Stage 1 document a **Strategic Outline Business Case (SOBC)**; HM Treasury calls this stage the **Strategic Outline Case (SOC)**. Keep the SOBC name, doc-type and file name, and state in the document that it is HM Treasury's SOC stage. ArcKit does not generate the strategic assessment, OBC or FBC.

This command creates the **SOBC** - the case for change and preferred way forward, to secure approval to proceed to the OBC stage and, in ArcKit's workflow, to detailed requirements and design.

## User Input

```text
$ARGUMENTS
```

## Instructions

> **Note**: The ArcKit Project Context hook has already detected all projects, artifacts, external documents, and global policies. Use that context below — no need to scan directories manually.

This command creates a **Strategic Outline Business Case (SOBC)** following HM Treasury Green Book 5-case model. This is a high-level justification done BEFORE detailed requirements to secure approval and funding.

**When to use this:**

- **After**: `/arckit:stakeholders` (MANDATORY - SOBC must link to stakeholder goals)
- **Usually before**: `/arckit:requirements` (SOBC justifies whether to proceed with detailed requirements). Where requirements already exist, for example in a bulk build (`/arckit:build` recipes build REQ first) or a refresh, read them to sharpen the cost estimates; they are an OPTIONAL input below, never a reason to stop
- **Purpose**: Secure executive approval and funding to proceed to next stage

**Note**: HM Treasury's later stages, the OBC (Outline Business Case) and FBC (Full Business Case), refine the costs and arrangements; ArcKit does not generate them. This SOBC uses strategic estimates and options analysis.

1. **Read existing artifacts from the project context:**

   **MANDATORY** (warn if missing):
   - **STKE** (Stakeholder Analysis) in `projects/{project}/`
     - Extract: ALL stakeholder goals (become benefits), drivers (explain WHY needed), conflicts (become risks/mitigations), outcomes (become success criteria)
     - If missing: STOP and warn user to run `/arckit:stakeholders` first — every SOBC benefit MUST trace to a stakeholder goal

   **RECOMMENDED** (read if available, note if missing):
   - **PRIN** (Architecture Principles, in `projects/000-global/`)
     - Extract: Strategic alignment, technology standards, compliance requirements
   - **RISK** (Risk Register) in `projects/{project}/`
     - Extract: Risks for Management Case, risk appetite, mitigations

   **OPTIONAL** (read if available, skip silently if missing):
   - **REQ** (Requirements) in `projects/{project}/`
     - Extract: Detailed requirements for more accurate cost estimates
   - **PLAN** (Project Plan) in `projects/{project}/`
     - Extract: Timeline, phasing for Commercial Case delivery schedule
   - **TNDR** (Procurement Market Intelligence) at `projects/{project}/research/ARC-{P}-TNDR-*.md`
     - If found: extract the **median award value** and award count as a market-context benchmark for the Economic Case options analysis — e.g. to sanity-check an option's Rough Order of Magnitude cost against what comparable work has been awarded for in the market
     - **Critical:** awarded value is NOT actual spend and must NOT be used as the costed figure; cite it as market context and market view only, with that caveat stated explicitly whenever the figure appears
     - If no TNDR artefact exists, skip silently

2. **Understand the request**: The user may be:
   - Creating initial SOBC (most common)
   - Updating existing SOBC with new information
   - Creating UK Government Green Book 5-case model (automatic for UK projects)
   - Evaluating multiple strategic options

3. **Read external documents and policies**:
   - Read any **external documents** listed in the project context (`external/` files) — extract budget allocations, cost forecasts, financial constraints, existing spend data, benefit projections
   - Read any **global policies** listed in the project context (`000-global/policies/`) — extract spending thresholds, approval gates, Green Book discount rates, procurement rules
   - Read any **enterprise standards** in `projects/000-global/external/` — extract enterprise investment frameworks, strategic business plans, cross-project portfolio investment context
   - If no external docs exist but they would improve the business case, ask: "Do you have any budget documents, financial forecasts, or market research? I can read PDFs directly. Place them in `projects/{project-dir}/external/` and re-run, or skip."
   - **Citation traceability**: When referencing content from external documents, follow the citation instructions in `${CLAUDE_PLUGIN_ROOT}/references/citation-instructions.md`. Place inline citation markers (e.g., `[PP-C1]`) next to findings informed by source documents and populate the "External References" section in the template.

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

6. **Interactive Configuration**:

   Before generating the SOBC, use the **AskUserQuestion** tool to gather appraisal preferences. **Skip any question the user has already answered in their arguments.**

   **Gathering rules** — the one-message interview in `${CLAUDE_PLUGIN_ROOT}/references/interview-pattern.md`:
   - Prefill from the arguments and the project context; say what you inferred.
   - Ask every remaining question in **one** call. There is no second round.
   - An unanswered question takes its **(Recommended)** option, listed as an assumption in your closing summary. With no question tool available, take every default and never block.

   **Question 1** — header: `Options`, multiSelect: false
   > "How many shortlisted options should be appraised in the Economic Case?"
   - **5 options (Recommended)**: Business as usual (BAU) + Do minimum + Preferred way forward + More ambitious + Less ambitious preferred way forward — HM Treasury's shortlist of around five options
   - **3 options**: BAU + Do minimum (which is also the preferred way forward) + More ambitious preferred way forward — only when the preferred way forward is the do minimum, so the less ambitious version is left out
   - **More than 5**: the five above plus alternatives that differ in outputs or design choices rather than ambition — for complex proposals; every extra option must still meet the objectives and critical success factors

   **Question 2** — header: `Appraisal`, multiSelect: false
   > "What level of economic appraisal should be applied?"
   - **Strategic estimates (Recommended)**: Rough Order of Magnitude costs and qualitative benefits — appropriate for SOBC stage
   - **Semi-quantitative**: ROM costs with quantified key benefits and basic NPV — when some financial data is available
   - **Full quantitative**: Detailed costs, quantified benefits, NPV, BCR, sensitivity analysis — typically for OBC/FBC stage, but may be required for large investments

   Apply the user's selections: the option count determines how many alternatives are analyzed in Part B (Economic Case). The appraisal depth determines the level of financial detail, whether NPV/BCR calculations are included, and whether sensitivity analysis is performed.

7. **Generate comprehensive SOBC**:

   **Read the template** (with user override support):
   - **First**, check if `.arckit/templates-custom/sobc-template.md` exists in the project root, then `.arckit/templates/sobc-template.md`
   - **If found**: Read the user's customized template (user override takes precedence)
   - **If not found**: Read `${CLAUDE_PLUGIN_ROOT}/templates/sobc-template.md` (default)
   - **Then read** `${CLAUDE_PLUGIN_ROOT}/templates/_partials/RENDERING.md` and resolve the `<!-- DOC-CONTROL-HEADER -->` marker in the template before writing. Do not hand-write the Document Control table: the partial `RENDERING.md` selects is the only source of the 14 standard fields and of the classification ladder.

   > **Tip**: Users can customize templates with `/arckit:customize sobc`

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
   - **Options Analysis** (CRITICAL) — the shortlist HM Treasury's business case guidance and the Green Book set out (around five options):
     - Option 0: Business as usual (BAU) — what happens if current arrangements continue and the proposal is not implemented. Always shortlisted, as the benchmark, whether or not it meets the objectives. BAU is not "do nothing": the organisation still acts, and BAU has its own costs, benefits and risks. Never label it "Do Nothing" or cost it at £0 by default
     - Option 1: Do minimum — the option that just meets the objectives and goes no further. Always shortlisted
     - Option 2: Preferred way forward — the option that appears best to meet the objectives and critical success factors and offer the best value for money (it may be the same as the do minimum)
     - Option 3: More ambitious preferred way forward — more social benefits, at higher social costs or with more risk
     - Option 4: Less ambitious preferred way forward — lower social benefits, with lower social costs or less risk; leave it out if the preferred way forward is the do minimum
     - Apart from BAU, do not shortlist an option that fails to meet the proposal's objectives
     - At SOC stage the shortlist leads to a **preferred way forward**; HM Treasury's **preferred option** is identified later, at OBC stage. The recommended option in this SOBC is the preferred way forward: do not call it the preferred option
     - For EACH option, including BAU and any option you recommend rejecting:
       - High-level costs (rough order of magnitude)
       - Benefits delivered (% of stakeholder goals met)
       - Risks (its own **Risks** list: a rejected option still has risks, and they are part of why it is rejected)
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
   - **Approval Route**: Who must approve, and at which stages?
     - UK central government (bodies subject to Managing Public Money): the organisation's approving authority (a minister, the accounting officer or an investment committee) approves the business case after the organisation's own assurance. HM Treasury approval is needed as well if the proposal meets any criterion of HM Treasury's [Treasury Approvals Process](https://www.gov.uk/government/publications/treasury-approvals-process-for-programmes-and-projects) (updated 1 April 2026): its whole life costs meet or exceed any of the department's Delegated Authority Limits (DALs); it is novel, contentious or could cause repercussions elsewhere in the public sector; it is likely to breach agreed budget or Supply Estimate limits; it commits significant future spending for which budgets have not been set; it may set a potentially expensive precedent; it requires primary legislation; or statute requires HM Treasury consent. A qualifying project needs HM Treasury approval at each of SOC, OBC and FBC, and should usually have its SOC approved before any public announcement. A project whose costs start below the DAL and later rise above it also qualifies
     - HM Treasury sets DALs for each department (the department's delegation letter is the reference). Do not invent a £ threshold or attribute one to HM Treasury: quote the DAL only if the project context provides it, otherwise say it must be confirmed with the department's finance team or HM Treasury spending team
     - Digital and technology spend: the digital and technology spend controls were removed on 1 April 2026 and replaced by the [Digital Assurance Playbook](https://www.gov.uk/government/publications/digital-assurance-playbook). Do not describe a CDDO or GDS spend control approval. Record the organisation's own digital assurance route, and note that HM Treasury requires organisations to maintain and share a pipeline of upcoming spend
     - Local government and other bodies outside the Treasury Approvals Process: the body's own approving authority (in local government, mayors or councillors, who may delegate to chief executives or other officers)
     - Private sector: Board approval or the scheme of delegation
   - **Affordability**: Can organization afford this?
   - **Cash Flow**: When do we need money?
   - **Budget Constraints**: Budget cover, Spending Review settlement, delegated limits, and any conditions set by internal assurance

   **E. Management Case**:
   - **Governance**:
     - Who owns this? (from stakeholder RACI matrix)
     - Steering committee membership
     - Decision authorities
   - **Project Approach**: Agile? Waterfall? Phased?
   - **Key Milestones**:
     - Business case approval points: SOC (this SOBC), OBC and FBC. HM Treasury's guidance assures them through Gate Reviews held before each approval: Gate 1 (Business Justification) before SOC approval, Gate 2 (Delivery Strategy) before OBC approval, Gate 3 (Investment Decision) before FBC approval, then Gate 4 (Readiness for Service) before going live and Gate 5 (Operational Review and Benefits Realisation). For projects on the Government Major Projects Portfolio (GMPP), the National Infrastructure and Service Transformation Authority (NISTA) arranges independent assurance reviews; NISTA replaced the IPA, so do not name the IPA
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

8. **Ensure complete traceability**:

   Every element must link back to stakeholder analysis:

   ```text
   Stakeholder Driver D-1 (CFO: Reduce costs - FINANCIAL, HIGH)
     → Strategic Case: Cost pressure driving change
       → Economic Case: Benefit B-1: £2M annual savings (maps to CFO Goal G-1)
         → Financial Case: 18-month payback acceptable to CFO
           → Management Case: CFO sits on steering committee (RACI: Accountable)
             → Success Criterion: CFO Outcome O-1 measured monthly
   ```

9. **Include decision framework**:
   - **Executive Summary opens with the verdict**: the Go/No-Go recommendation and the recommended option come first, then the rationale, then context, costs and risks, as `${CLAUDE_PLUGIN_ROOT}/references/executive-summary-pattern.md` sets out. Every figure in the summary already appears in the five cases.
   - **Recommendation**: Which option to proceed with?
   - **Rationale**: Why this option? (reference stakeholder goals met)
   - **Go/No-Go Criteria**: Under what conditions do we proceed?
   - **Next Steps**: If approved, what happens next?
     - Typically: `/arckit:requirements` to define detailed requirements
     - Then: the Outline Business Case (OBC, HM Treasury Stage 2) with refined costs. ArcKit has no OBC command, so name the OBC as a next step without suggesting a command for it

**CRITICAL - Auto-Populate Document Control Fields**:

Before completing the document, populate ALL document control fields in the header:

### Step 0: Detect Version

Follow `${CLAUDE_PLUGIN_ROOT}/references/version-detection.md` for `ARC-{PROJECT_ID}-SOBC-v*.md` in the project directory. For a business case:

- **Minor increment** (e.g., 1.0 → 1.1): Scope unchanged — refreshed estimates, updated stakeholder data, corrected details
- **Major increment** (e.g., 1.0 → 2.0): Scope materially changed — new options added, fundamentally different recommendations, significant new stakeholder goals

### Step 1: Construct Document ID

- **Document ID**: `ARC-{PROJECT_ID}-SOBC-v{VERSION}` (e.g., `ARC-001-SOBC-v1.0`)

### Step 2: Populate Required Fields

**Auto-populated fields** (populate these automatically):

- `[PROJECT_ID]` → Extract from project path (e.g., "001" from "projects/001-project-name")
- `[VERSION]` → Determined version from Step 0
- `[DATE]` / `[YYYY-MM-DD]` → Current date in YYYY-MM-DD format
- `[DOCUMENT_TYPE_NAME]` → "Strategic Outline Business Case (SOBC)"
- **Classification** → comes from the resolved Document Control header, not from a placeholder. `_partials/RENDERING.md` fixes the ladder from the artefact's own regime; `${user_config.default_classification}` applies only where that regime falls through to user config.
- `[STATUS]` → "DRAFT" for new documents

**User-specified fields** (must be confirmed with user):

- `[OWNER]` → Who owns this business case? (typically from stakeholder RACI matrix)
- `[REVIEWED_BY]` → Who will review? (mark as "PENDING" if not yet reviewed)
- `[APPROVED_BY]` → Who must approve? (mark as "PENDING" if not yet approved)

10. **Write the output**:

- Create or update `projects/NNN-project-name/ARC-{PROJECT_ID}-SOBC-v${VERSION}.md`
- Use project directory structure (create if doesn't exist)
- File name pattern: `ARC-{PROJECT_ID}-SOBC-v{VERSION}.md`
- ArcKit has no OBC or FBC doc-type: never write an `ARC-{PROJECT_ID}-OBC-*` or `ARC-{PROJECT_ID}-FBC-*` file (the filename hook blocks unregistered codes). A refreshed business case is a new SOBC version

11. **Use appropriate language**:

- **UK Government**: Use Green Book terminology (intervention, public value, social costs and benefits, value for money, business as usual)
- **Private Sector**: Adapt to commercial language (investment, shareholder value, competitive advantage)
- **Always**: Link to stakeholder analysis for credibility

12. **Flag uncertainties**:
    - Mark estimates as "Rough Order of Magnitude (ROM)"
    - Flag where more analysis needed
    - Note dependencies on external factors
    - Recommend sensitivity analysis for key assumptions

## Output Format

Provide:

1. **Location**: `projects/NNN-project-name/ARC-{PROJECT_ID}-SOBC-v{VERSION}.md`
2. **Summary**:
   - "Created Strategic Outline Business Case (SOBC) for [project name]"
   - "Analyzed [X] options against [Y] stakeholder goals"
   - "Recommended: Option [X] - [name]"
   - "Estimated investment: £[X]M over 3 years"
   - "Expected benefits: £[X]M over 3 years from [stakeholder goals]"
   - "Payback period: [X] months"
   - "Business case stage: SOBC (HM Treasury Stage 1, Strategic Outline Case)"
3. **Next steps**:
   - "Present to [approving authority] for go/no-go decision"
   - "If approved: Run `/arckit:requirements` to define detailed requirements"
   - "Then: Outline Business Case (OBC, HM Treasury Stage 2) to appraise the shortlist in detail and identify the preferred option"
   - "After procurement: Full Business Case (FBC, HM Treasury Stage 3) for the investment decision, before contracts are signed"
4. **Traceability note**:
   - "All [X] benefits traced to stakeholder goals in ARC-{PROJECT_ID}-STKE-v*.md"
   - "All [Y] risks linked to stakeholder conflict analysis"

## Common Patterns

**Pattern 1: Technology Modernization**:

- Strategic Case: Legacy systems failing, stakeholder frustration high
- Economic Case: around five shortlisted options, from business as usual to a more ambitious complete rebuild
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

**Key HM Treasury references**: The Green Book provides the 5-case model, the [Magenta Book](https://www.gov.uk/government/publications/the-magenta-book) provides evaluation design guidance (theory of change, proportionality, impact evaluation), and the [Sourcing Playbook](https://www.gov.uk/government/publications/the-sourcing-and-consultancy-playbooks) covers should-cost modelling and market assessment. See `docs/guides/codes-of-practice.md` for the full Rainbow of Books mapping.

For UK Government/public sector projects, ensure:

1. **Strategic Case includes**:
   - Policy alignment (manifesto commitments, departmental objectives)
   - Public value (not just efficiency, but citizen outcomes)
   - Minister/Permanent Secretary drivers
   - Parliamentary accountability

2. **Economic Case includes**:
   - Social Cost Benefit Analysis (if required)
   - Green Book discount rate: the social time preference rate, 3.5% in real terms for years 1 to 30
   - Optimism bias adjustment: sized from the organisation's own evidence of past forecast errors or, if it has none, the generic values in the Green Book supplementary guidance on optimism bias. Do not quote a fixed uplift as an HM Treasury standard
   - Wider economic benefits

3. **Commercial Case includes**:
   - Digital Marketplace assessment (G-Cloud, DOS)
   - SME participation commitment
   - Social value (minimum 10% weighting)
   - Open source consideration

4. **Financial Case includes**:
   - Approval route: the organisation's approving authority, and whether the Treasury Approvals Process applies (see the Financial Case Approval Route above)
   - Spending Review settlement alignment
   - Value for money assessment
   - Whole-life costs

5. **Management Case includes**:
   - Service Standard assessment plan
   - Digital assurance under the Digital Assurance Playbook (in force from 1 April 2026), and early engagement with the Government Digital Service on digital transformation proposals, as the Treasury Approvals Process asks
   - Assurance plan: Gate Review 1 before SOC approval, and NISTA reviews if the project is on the GMPP
   - Cyber security (NCSC consultation)
   - Accessibility (WCAG 2.2 AA compliance)
   - Data protection (ICO/DPIA requirements)

## Error Handling

If stakeholder analysis doesn't exist:

- **DO NOT proceed** with SOBC
- Tell user: "SOBC requires stakeholder analysis to link benefits to stakeholder goals. Please run `/arckit:stakeholders` first."

If user wants detailed business case:

- Tell user: "This command creates the SOBC (Strategic Outline Business Case), ArcKit's name for HM Treasury's Strategic Outline Case: Stage 1, with high-level estimates. HM Treasury's later stages are the Outline Business Case (Stage 2), which identifies the preferred option, and the Full Business Case (Stage 3), completed after procurement and approved before contracts are signed. ArcKit does not generate the OBC or FBC."

If project seems too small for full 5-case:

- Still use 5-case structure but scale appropriately
- Smaller projects: 2-3 pages per case
- Major programmes: 10-20 pages per case

## Template Reference

Use the template at `${CLAUDE_PLUGIN_ROOT}/templates/sobc-template.md` as the structure. Fill in with:

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

Before writing the file, read `${CLAUDE_PLUGIN_ROOT}/references/quality-checklist.md` and verify all **Common Checks** plus the **SOBC** per-type checks pass. Fix any failures before proceeding.

### 2. Write Directly to File

**Use the Write tool** to create `projects/[PROJECT]/ARC-{PROJECT_ID}-SOBC-v${VERSION}.md` with the complete SOBC document.

**DO NOT** output the full document in your response. This would exceed token limits.

### 3. Show Summary Only

After writing the file, show ONLY a concise summary:

```markdown
## SOBC Complete ✅

**Project**: [Project Name]
**File Created**: `projects/[PROJECT]/ARC-{PROJECT_ID}-SOBC-v{VERSION}.md`

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

**Total Length**: [X] pages (ready for review by the approving authority)

### Next Steps

- Review `ARC-{PROJECT_ID}-SOBC-v{VERSION}.md` for full SOBC document
- Senior Responsible Owner (SRO) to submit it to the approving authority, after Gate Review 1 where it applies, and to HM Treasury if the Treasury Approvals Process applies
- If approved, run `/arckit:requirements` to define detailed requirements
- Then develop the Outline Business Case (OBC) with firmer costs
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

## Important Notes

- **Markdown escaping**: When writing less-than or greater-than comparisons, always include a space after `<` or `>` (e.g., `< 3 seconds`, `> 99.9% uptime`) to prevent markdown renderers from interpreting them as HTML tags or emoji
