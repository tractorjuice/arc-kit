---
description: Create platform strategy using Platform Design Toolkit (8 canvases for multi-sided ecosystems)
---

You are helping an enterprise architect design a **platform strategy** for a multi-sided ecosystem using the **Platform Design Toolkit (PDT)** from Boundaryless.io.

## User Input

```text
$ARGUMENTS
```

## Your Task

Generate a comprehensive platform strategy design document using PDT v2.2.1 methodology, covering all 8 strategy design canvases: Ecosystem Canvas, Entity Portraits, Motivations Matrix, Transactions Board, Learning Engine, Platform Experience Canvas, MVP Canvas, and Platform Design Canvas.

---

## Instructions

### Step 0: Read Available Documents

Scan the project directory for existing artifacts and read them to inform this platform design:

**MANDATORY** (warn if missing):
- `ARC-000-PRIN-*.md` in `projects/000-global/` — Architecture principles
  - Extract: Platform governance principles, ecosystem orchestration standards, technology choices
  - If missing: STOP — platform designs require architecture principles. Run `/arckit.principles` first.
- `ARC-*-REQ-*.md` in `projects/{project-dir}/` — Requirements specification
  - Extract: Platform capabilities from FR/NFR requirements, scalability, availability, security
  - If missing: warn user to run `/arckit.requirements` first

**RECOMMENDED** (read if available, note if missing):
- `ARC-*-STKE-*.md` in `projects/{project-dir}/` — Stakeholder analysis
  - Extract: Ecosystem entities from stakeholder drivers, user personas, goals
  - If missing: recommend running `/arckit.stakeholders` for better entity portraits
- `ARC-*-WARD-*.md` in `projects/{project-dir}/wardley-maps/` — Wardley maps
  - Extract: Evolution analysis for build vs buy decisions, component positioning

**OPTIONAL** (read if available, skip silently if missing):
- `ARC-*-RISK-*.md` in `projects/{project-dir}/` — Risk register
  - Extract: Platform risks, ecosystem risks, governance risks
- `ARC-*-DATA-*.md` in `projects/{project-dir}/` — Data model
  - Extract: Data exchange patterns, entity schemas, data governance
- `ARC-*-SOBC-*.md` in `projects/{project-dir}/` — Business case
  - Extract: Investment context, ROI targets, benefits

**What to extract from each document**:
- **Principles**: Platform governance, ecosystem orchestration, technology standards
- **Requirements**: Platform capabilities (FR-xxx), NFRs (scalability, security), integration points
- **Stakeholders**: Ecosystem entities, user personas, goals, value propositions
- **Wardley Maps**: Component evolution, build vs buy positioning

---

### Step 1: Identify or Create Project

**Project Management:**

Use the bash script to create or find the project:

```bash
bash .arckit/scripts/bash/create-project.sh --name "$PROJECT_NAME" --json
```

**Parse the JSON response** to get:
- `project_id` (e.g., "001")
- `project_path` (e.g., "projects/001-platform-name")
- `project_name` (e.g., "platform-name")
- `status` (e.g., "created" or "exists")

If `status` is "created":
- This is a new project
- Generate fresh platform design

If `status` is "exists":
- Project already has artifacts
- Check for existing `ARC-{PROJECT_ID}-PLAT-v*.md` files
- If exists, ask user if they want to overwrite or update

---

### Step 2: Read the Template

Read the platform design template:

**Read the template** (with user override support):
- **First**, check if `.arckit/templates-custom/platform-design-template.md` exists (user override)
- **If found**: Read the user's customized template
- **If not found**: Read `.arckit/templates/platform-design-template.md` (default)

> **Note**: Read the `VERSION` file and update the version in the template metadata line when generating.
> **Tip**: Users can customize templates with `/arckit.customize platform-design`

This template contains the structure for all 8 PDT canvases.

---

### Step 3: Auto-Populate from Existing Artifacts

**CRITICAL**: To create a high-quality, integrated platform design, extract data from existing ArcKit artifacts:

#### 3.1 Extract Stakeholder Data → Entity Portraits

If `projects/{project_id}/ARC-*-STKE-*.md` exists:

**Read the file** and extract:
- **Stakeholders** → Map to **Entities** in ecosystem
  - Example: "CFO" stakeholder → "Enterprise Buyer" entity (demand side)
  - Example: "Service Provider" stakeholder → "Independent Consultant" entity (supply side)

- **Drivers** → Map to **Performance Pressures**
  - Example: Driver "Reduce procurement costs" → Pressure "Cost reduction imperatives"

- **Goals** → Map to **Entity Goals**
  - Example: Goal "Reduce vendor search time by 50%" → Entity goal in portrait

- **RACI Matrix** → Map to **Ecosystem Roles**
  - Example: "Responsible" roles → Supply-side entities
  - Example: "Accountable" roles → Demand-side entities or regulators

**Extraction Logic**:
```
For each stakeholder in ARC-*-STKE-*.md:
  - Determine entity type (Supply/Demand/Supporting)
  - Create Entity Portrait (Section 2.2, 2.3, 2.4)
  - Populate context from stakeholder description
  - Populate pressures from drivers
  - Populate goals from stakeholder goals
  - Populate gains from outcomes
```

#### 3.2 Extract Requirements → Platform Capabilities

If `projects/{project_id}/ARC-*-REQ-*.md` exists:

**Read the file** and extract:
- **BR (Business Requirements)** → Map to **Value Creation** and **Revenue Model**
  - Example: "BR-001: Reduce vendor onboarding time by 80%" → Transaction T-002 cost reduction

- **FR (Functional Requirements)** → Map to **Platform Features** and **Transaction Engine**
  - Example: "FR-010: Provider search and filtering" → Core journey step, T-001 transaction

- **NFR (Non-Functional Requirements)** → Map to **Platform Architecture** and **MVP Scope**
  - Example: "NFR-S-002: Handle 10,000 transactions/month" → Transaction velocity target
  - Example: "NFR-A-001: 99.9% availability SLA" → Platform Experience Canvas SLA

- **DR (Data Requirements)** → Map to **Learning Engine** (analytics, insights)
  - Example: "DR-005: Performance analytics data" → Learning Service 1

**Extraction Logic**:
```
For each requirement in ARC-*-REQ-*.md:
  - Map BR-xxx to business model and value creation
  - Map FR-xxx to platform features and transactions
  - Map NFR-xxx to architecture and scale targets
  - Map DR-xxx to learning engine data flows
```

#### 3.3 Extract Wardley Map → Build vs. Buy Strategy

If `projects/{project_id}/wardley-maps/ARC-*-WARD-*.md` exists:

**Read Wardley map(s)** and extract:
- **Components** and their **Evolution Stages**:
  - Genesis (0.00-0.25) → **Build** (novel, differentiating)
  - Custom (0.25-0.50) → **Build or Partner** (emerging, core capability)
  - Product (0.50-0.75) → **Buy** (commercial products available)
  - Commodity (0.75-1.00) → **Use Utility** (cloud, SaaS, APIs)

**Use evolution analysis** in Platform Design Canvas (Section 8.3):
- Identify which platform components to build (Custom/Genesis)
- Identify which to buy/use (Product/Commodity)
- Example: "Service matching algorithm" at Custom (0.35) → Build as core differentiator
- Example: "Payment processing" at Product (0.70) → Use Stripe API

#### 3.4 Extract Architecture Principles → Platform Governance

Read `projects/000-global/ARC-000-PRIN-*.md`:

**Extract principles** that apply to platform strategy:
- Example: Principle "API-First" → Platform must expose APIs for ecosystem integrations
- Example: Principle "Data Privacy by Design" → Learning engine must anonymize entity data
- Example: Principle "Cloud-Native" → Platform runs on AWS/Azure, serverless where possible

**Apply principles** in Platform Design Canvas (Section 8.4 Strategic Alignment)

---

### Step 3b: Check for External Documents (optional)

Scan for external (non-ArcKit) documents the user may have provided:

**Existing Platform Documentation & Ecosystem Maps**:
- **Look in**: `projects/{project-dir}/external/`
- **File types**: PDF (.pdf), Word (.docx), Markdown (.md), Images (.png, .jpg)
- **What to extract**: Current platform architecture, ecosystem participants, API catalogues, platform metrics
- **Examples**: `platform-overview.pdf`, `ecosystem-map.png`, `api-catalogue.docx`

**User prompt**: If no external platform docs found but they would improve the design, ask:
"Do you have any existing platform documentation, ecosystem maps, or API catalogues? I can read PDFs and images directly. Place them in `projects/{project-dir}/external/` and re-run, or skip."

**Important**: This command works without external documents. They enhance output quality but are never blocking.

---

### Step 4: Detect Version

Before generating the document ID, check if a previous version exists:

1. Look for existing `ARC-{PROJECT_ID}-PLAT-v*.md` files in the project directory
2. **If no existing file**: Use VERSION="1.0"
3. **If existing file found**:
   - Read the existing document to understand its scope
   - Compare against current inputs and requirements
   - **Minor increment** (e.g., 1.0 → 1.1): Scope unchanged — refreshed content, updated entity details, corrected details
   - **Major increment** (e.g., 1.0 → 2.0): Scope materially changed — new ecosystem entities, fundamentally different platform strategy, significant new canvases
4. Use the determined version for document ID, filename, Document Control, and Revision History
5. For v1.1+/v2.0+: Add a Revision History entry describing what changed from the previous version

### Step 5: Generate Document Control Metadata

Use the bash script to generate document ID:

```bash
bash .arckit/scripts/bash/generate-document-id.sh "$PROJECT_ID" "PLAT" "${VERSION}"
```

This returns a document ID like: `ARC-001-PLAT-v1.0`

**Populate document control fields**:
- `document_id`: From script output
- `project_id`: From Step 1
- `project_name`: From Step 1
- `version`: Determined version from Step 4
- `author`: "ArcKit Platform Design Command"
- `date_created`: Current date (YYYY-MM-DD)
- `date_updated`: Current date (YYYY-MM-DD)
- `generation_date`: Current date and time
- `ai_model`: Your model name (e.g., "Claude 3.5 Sonnet")

---

### Step 6: Generate Platform Design Using PDT Methodology

**CRITICAL INSTRUCTIONS FOR QUALITY**:

1. **This is a LARGE document** (8 canvases, 1,800+ lines). You MUST use the **Write tool** to create the file. DO NOT output the full document to the user (you will exceed token limits).

2. **Follow PDT v2.2.1 methodology** (Boundaryless.io):
   - 8 canvases in sequence
   - Focus on multi-sided ecosystem thinking
   - Transaction cost reduction is core value proposition
   - Learning engine creates long-term defensibility

3. **Complete ALL 8 canvases** with depth:

   **Canvas 1: Ecosystem Canvas**
   - Map 5-15 entity types (Supply side, Demand side, Supporting)
   - Create Mermaid diagram showing relationships
   - Catalog entities with roles, resources provided/consumed
   - Define ecosystem boundaries and interfaces

   **Canvas 2: Entity-Role Portraits** (3-5 portraits minimum)
   - Portrait 1: Primary supply-side entity (e.g., service providers, sellers, creators)
   - Portrait 2: Primary demand-side entity (e.g., buyers, consumers, learners)
   - Portrait 3: Supporting entity (e.g., regulator, payment provider, insurer)
   - For EACH portrait:
     - Context: Who they are, current situation, constraints
     - Performance Pressures: External and internal forces
     - Goals: Short-term (0-6mo), medium-term (6-18mo), long-term (18+mo)
     - Gains Sought: 5 value propositions with metrics
     - Linkage to Platform Features: Map goals → features → value delivery

   **Canvas 3: Motivations Matrix**
   - Cross-entity motivation analysis (NxN matrix where N = number of entities)
   - Identify synergies (aligned motivations)
   - Identify conflicts (misaligned motivations)
   - For each conflict: Platform solution to resolve it

   **Canvas 4: Transactions Board** (10-20 transactions minimum)
   - Catalog all transactions in ecosystem
   - For EACH transaction:
     - Transaction name
     - From entity → To entity
     - Existing? (Yes/No - does it happen today?)
     - Current channel and transaction costs
     - Platform channel and reduced costs
     - Cost reduction percentage
   - Analyze transaction costs: Search, Information, Negotiation, Coordination, Enforcement
   - Calculate total value created (cost savings × transaction volume)

   **Canvas 5: Learning Engine Canvas** (5+ learning services)
   - Design services that help entities improve continuously
   - For EACH learning service:
     - What: Service description
     - Inputs: Data sources
     - Outputs: Delivered value
     - How Entity Improves: Specific improvements
     - Platform Benefit: Why this creates defensibility
     - Success Metric: Measurable impact
   - Define learning services business model (freemium, premium tiers)

   **Canvas 6: Platform Experience Canvas** (2+ core journeys)
   - Journey 1: Supply-side onboarding and first sale
   - Journey 2: Demand-side discovery and first purchase
   - For EACH journey:
     - Journey map: 8-10 stages from awareness to retention
     - For each stage: Entity action, platform service, transaction ID, learning service, touchpoint, pain point addressed
     - Journey metrics: Time, cost, completion rate, satisfaction
   - Business Model Canvas: Revenue streams, cost structure, unit economics, LTV:CAC ratios

   **Canvas 7: Minimum Viable Platform Canvas**
   - Critical assumptions (5+): What must be true for platform to succeed?
   - For each assumption: Riskiness (High/Medium/Low), evidence needed, test method
   - MVP feature set: What's IN, what's OUT (defer to post-validation)
   - Liquidity bootstrapping strategy: How to solve chicken-and-egg problem
     - Phase 1: Curate initial supply
     - Phase 2: Seed demand
     - Phase 3: Test transaction velocity
     - Phase 4: Expand liquidity
   - Validation metrics: 10+ success criteria for Go/No-Go decision after 90 days
   - MVP timeline and budget

   **Canvas 8: Platform Design Canvas (Synthesis)**
   - The 6 Building Blocks:
     1. Ecosystem: Who participates, ecosystem size targets
     2. Value Creation: Value for supply, demand, overall ecosystem
     3. Value Capture: Revenue model, pricing rationale
     4. Network Effects: Same-side, cross-side, data, learning effects; defensibility
     5. Transaction Engine: Core transactions, cost reductions, velocity targets
     6. Learning Engine: Learning services summary, revenue, impact
   - Strategic Alignment: Link to stakeholders, requirements, principles, Wardley maps
   - UK Government Context: GaaP, TCoP, Service Standard, Digital Marketplace

5. **Auto-populate from artifacts** (from Step 3):
   - Entity portraits from ARC-*-STKE-*.md
   - Platform capabilities from ARC-*-REQ-*.md
   - Build vs. buy from wardley-maps/ARC-*-WARD-*.md
   - Governance from ARC-000-PRIN-*.md

6. **UK Government Context** (if applicable):
   - Government as a Platform (GaaP) principles
   - Technology Code of Practice (TCoP) alignment
   - GDS Service Standard implications
   - Digital Marketplace positioning (G-Cloud, DOS)

7. **Generate complete traceability** (Section 9):
   - Stakeholder → Entity → Value Proposition
   - Requirement → Platform Feature → Implementation
   - Wardley Component → Build/Buy Decision
   - Risk → Platform Mitigation

8. **Provide actionable next steps** (Section 10):
   - Immediate actions (30 days): Validate assumptions, prototype MVP
   - MVP build phase (Months 2-4): Product development, provider acquisition
   - MVP validation phase (Months 5-7): Buyer onboarding, transaction velocity
   - Go/No-Go decision (Month 7): Review validation metrics
   - Scale phase (Months 8-24): Full feature set, growth, funding

---

### Step 7: Write the Document

**USE THE WRITE TOOL** to create the platform design document:

```
File path: projects/{project_id}-{project_name}/ARC-{PROJECT_ID}-PLAT-v${VERSION}.md
Content: [Complete platform design following template, all 8 canvases filled out]
```

**IMPORTANT**:
- This document will be 1,500-2,500 lines
- DO NOT output the full document in chat (token limit)
- Use Write tool to create file
- Only show summary to user

---

### Step 8: Generate Summary for User

After writing the file, provide a **concise summary** (NOT the full document):

```markdown
✅ Platform Strategy Design Created

**Project**: {project_name} ({project_id})
**Document**: projects/{project_id}-{project_name}/ARC-{PROJECT_ID}-PLAT-v1.0.md
**Document ID**: {document_id}

## Platform Overview

**Platform Name**: {platform_name}
**Platform Vision**: {one-sentence vision}

**Ecosystem Size (3-year target)**:
- {X} supply-side entities
- {Y} demand-side entities
- £{Z}M Gross Merchandise Value (GMV) annually

## The 8 PDT Canvases (Summary)

### 1. Ecosystem Canvas
- **Entities Mapped**: {N} entity types
- **Supply Side**: {entity types}
- **Demand Side**: {entity types}
- **Supporting**: {entity types}

### 2. Entity Portraits
- **Portraits Created**: {N} (supply-side, demand-side, supporting)
- **Key Entity 1**: {name} - {primary value sought}
- **Key Entity 2**: {name} - {primary value sought}

### 3. Motivations Matrix
- **Key Synergies**: {N synergies identified}
- **Key Conflicts**: {N conflicts to resolve}
- **Example Synergy**: {brief description}
- **Example Conflict**: {brief description + platform solution}

### 4. Transactions Board
- **Transactions Cataloged**: {N} transactions
- **Transaction Cost Reduction**: {X}% average reduction
- **Annual Value Created**: £{Y}M in transaction cost savings
- **Key Transaction**: {T-ID}: {name} - {cost reduction}%

### 5. Learning Engine
- **Learning Services**: {N} services designed
- **Supply-Side Services**: {list}
- **Demand-Side Services**: {list}
- **Learning Revenue**: £{X}K/year projected

### 6. Platform Experience
- **Core Journeys Mapped**: {N} journeys
- **Journey 1**: {name} - {completion time} ({X}% faster than current)
- **Journey 2**: {name} - {completion time} ({X}% faster than current)
- **Business Model**: {revenue model summary}
- **Unit Economics**: Supply LTV:CAC = {X}:1, Demand LTV:CAC = {Y}:1

### 7. Minimum Viable Platform (MVP)
- **Critical Assumptions**: {N} assumptions to validate
- **MVP Scope**: {X} features IN, {Y} features deferred
- **Liquidity Strategy**: {brief description of chicken-and-egg solution}
- **Validation Target**: {X} transactions in 90 days
- **MVP Budget**: £{X}K
- **Go/No-Go Metrics**: {N} success criteria

### 8. Platform Design Canvas (Synthesis)
- **Value Creation**: £{X} per transaction cost savings
- **Value Capture**: {commission}% transaction fee + £{Y}/mo subscriptions
- **Network Effects**: {type} - {brief description}
- **Defensibility**: {key moat}
- **Year 1 Revenue**: £{X}K projected

## Auto-Population Sources

{IF ARC-*-STKE-*.md used:}
✅ **Stakeholders** → Entity portraits auto-populated from ARC-*-STKE-*.md
   - {N} stakeholders mapped to {M} ecosystem entities

{IF ARC-*-REQ-*.md used:}
✅ **Requirements** → Platform capabilities auto-populated from ARC-*-REQ-*.md
   - {N} BR requirements → Value creation
   - {M} FR requirements → Platform features
   - {K} NFR requirements → Architecture and scale

{IF wardley-maps used:}
✅ **Wardley Maps** → Build vs. buy strategy from {map_name}
   - {N} components to BUILD (Custom/Genesis)
   - {M} components to BUY (Product/Commodity)

{IF ARC-000-PRIN-*.md used:}
✅ **Architecture Principles** → Platform governance from ARC-000-PRIN-*.md
   - {N} principles applied to platform design

## UK Government Context

{IF applicable:}
✅ **Government as a Platform (GaaP)** alignment documented
✅ **Technology Code of Practice (TCoP)** compliance approach
✅ **GDS Service Standard** implications analyzed
✅ **Digital Marketplace** positioning (G-Cloud/DOS)

## Traceability

✅ **Stakeholder-to-Platform**: {N} linkages created
✅ **Requirements-to-Platform**: {M} linkages created
✅ **Wardley-to-Strategy**: {K} linkages created
✅ **Risk-to-Mitigation**: {J} linkages created

## Next Steps (Immediate Actions)

1. **Validate Assumptions** (Next 30 days):
   - Interview {X} potential supply-side entities
   - Interview {Y} potential demand-side entities
   - Test pricing sensitivity

2. **Prototype MVP** (Next 30 days):
   - Design wireframes for core journeys
   - Build tech stack proof-of-concept
   - Test payment escrow

3. **Fundraising**:
   - Pitch deck based on Platform Design Canvas
   - Financial model (GMV, revenue, unit economics)
   - Raise £{X}K seed funding for MVP

## Files Created

📄 `projects/{project_id}-{project_name}/ARC-{PROJECT_ID}-PLAT-v1.0.md` ({file_size} lines)

## Related Commands

**Prerequisites** (should run before platform design):
- `/arckit.principles` - Architecture principles
- `/arckit.stakeholders` - Stakeholder analysis (highly recommended)
- `/arckit.requirements` - Platform requirements (recommended)
- `/arckit.wardley` - Value chain analysis (recommended)

**Next Steps** (run after platform design):
- `/arckit.sow` - RFP for platform development vendors
- `/arckit.hld-review` - Review high-level platform architecture
- `/arckit.backlog` - Generate sprint backlog from platform features

## Methodology Reference

**Platform Design Toolkit (PDT) v2.2.1**
- Source: Boundaryless.io
- License: Creative Commons CC-BY-SA
- Documentation: https://boundaryless.io/pdt-toolkit/
- Guide: docs/guides/platform-design.md

---

💡 **Tip**: The platform design document is comprehensive (1,500-2,500 lines). Review each canvas section to understand:
- Who participates in your ecosystem
- What value you create and how you capture it
- How transactions and learning create defensibility
- What MVP to build and how to validate it

The Platform Design Canvas (Section 8) provides a single-page synthesis perfect for executive presentations and fundraising.
```

---

## Important Notes

1. **Template-Driven**: Use platform-design-template.md as structure, fill with project-specific content

2. **Auto-Population**: Extract data from existing artifacts to create integrated, traceability-rich design

3. **PDT Methodology**: Follow Boundaryless.io Platform Design Toolkit v2.2.1 rigorously
   - 8 canvases in sequence
   - Transaction cost economics
   - Learning engine as moat
   - Network effects analysis
   - MVP validation strategy

4. **UK Government Context**: If project is UK gov/public sector, emphasize GaaP, TCoP, Digital Marketplace

5. **Multi-Sided Markets**: Platform design is for 2+ sided markets (supply-demand). If project is not a platform/marketplace, suggest alternative commands.

6. **Token Management**: Use Write tool for large document. Show summary only to user.

7. **Traceability**: Every platform decision should link back to stakeholders, requirements, principles, or Wardley maps

8. **MVP Focus**: Canvas 7 (MVP) is critical - help architect define smallest testable platform to validate riskiest assumptions

9. **Liquidity Bootstrapping**: Canvas 7 must address chicken-and-egg problem with specific strategy

10. **Network Effects**: Canvas 8 must articulate defensibility through network effects, data moats, learning loops

---

## Example Use Cases

**Good Use Cases for Platform Design**:
- Multi-sided marketplaces (e.g., supplier-buyer platforms, G-Cloud)
- Data sharing platforms (e.g., cross-government data mesh, NHS data sharing)
- Service platforms (e.g., GOV.UK services ecosystem, local government platforms)
- Ecosystem orchestration (e.g., vendor ecosystem, partner network, app store)

**Not Suitable for Platform Design**:
- Single-product SaaS applications (use /arckit.requirements and /arckit.hld-review instead)
- Internal enterprise systems without multi-sided ecosystem (use /arckit.requirements)
- Point-to-point integrations (use /arckit.diagram for architecture)

If user's project doesn't fit platform pattern, recommend appropriate alternative command.
