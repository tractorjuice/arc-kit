# ArcKit - Enterprise Architecture Governance Toolkit

![ArcKit - Enterprise Architecture Governance Toolkit](docs/assets/arckit-banner-light.svg)

**Build better enterprise architecture through structured governance, vendor procurement, and design review workflows.**

ArcKit is a toolkit for enterprise architects that transforms architecture governance from scattered documents into a systematic, AI-assisted workflow for:
- 🏛️ Establishing and enforcing architecture principles
- 👥 Analyzing stakeholder drivers, goals, and outcomes
- 🛡️ Risk management (HM Treasury Orange Book)
- 💼 Business case justification (HM Treasury Green Book SOBC)
- 📋 Creating comprehensive requirements documents
- 🗄️ Data modeling with ERD, GDPR compliance, and data governance
- 🔬 Technology research with build vs buy analysis (web search powered)
- 🗺️ Strategic planning with Wardley Mapping
- 📊 Generating visual architecture diagrams (Mermaid)
- 🤝 Managing vendor RFP and selection processes
- ✅ Conducting formal design reviews (HLD/DLD)
- 🔧 ServiceNow service management design
- 🔗 Maintaining requirements traceability

---

## Quick Start

### Installation

Install ArcKit CLI:

```bash
# Install with pip
pip install git+https://github.com/tractorjuice/arc-kit.git

# Or with uv
uv tool install arckit-cli --from git+https://github.com/tractorjuice/arc-kit.git

# Or run without installing
uvx --from git+https://github.com/tractorjuice/arc-kit.git arckit init my-project
```

**Latest Release**: [v0.10.0](https://github.com/tractorjuice/arc-kit/releases/tag/v0.10.0)

### Initialize a Project

```bash
# Create a new architecture governance project
arckit init payment-modernization --ai claude

# Or use OpenAI Codex CLI
arckit init payment-modernization --ai codex

# Or initialize in current directory
arckit init . --ai claude
```

### Start Using ArcKit

```bash
cd payment-modernization
claude  # or your chosen AI assistant

# Inside your AI assistant, use ArcKit commands:
/arckit.principles Create principles for a financial services company
/arckit.requirements Build a payment processing system...
/arckit.sow Generate RFP for vendor selection
```

---

### Explore Example Outputs

Public demonstration repositories showcase complete ArcKit deliverables:
- **NHS Appointment Booking** — [arckit-test-project-v7-nhs-appointment](https://github.com/tractorjuice/arckit-test-project-v7-nhs-appointment): Digital health platform with NHS Spine integration and GDPR safeguards.
- **M365 GCC-H Migration** — [arckit-test-project-v1-m365](https://github.com/tractorjuice/arckit-test-project-v1-m365): Government cloud migration with compliance mapping and change management.
- **HMRC Tax Assistant** — [arckit-test-project-v2-hmrc-chatbot](https://github.com/tractorjuice/arckit-test-project-v2-hmrc-chatbot): Conversational AI service covering PII protection and bilingual support.
- **Windows 11 Deployment** — [arckit-test-project-v3-windows11](https://github.com/tractorjuice/arckit-test-project-v3-windows11): Enterprise OS rollout with policy migration and security baselines.
- **Patent Application System** — [arckit-test-project-v6-patent-system](https://github.com/tractorjuice/arckit-test-project-v6-patent-system): Intellectual property workflow automation using GOV.UK Pay and Notify.
- **ONS Data Platform** — [arckit-test-project-v8-ons-data-platform](https://github.com/tractorjuice/arckit-test-project-v8-ons-data-platform): Official statistics analytics environment with Five Safes governance.
- **Cabinet Office GenAI Platform** — [arckit-test-project-v8-cabinet-office-genai](https://github.com/tractorjuice/arckit-test-project-v8-cabinet-office-genai): Cross-government GenAI platform with responsible AI guardrails.

---

## Why ArcKit?

### Problem: Architecture Governance is Broken

Traditional enterprise architecture suffers from:
- ❌ Scattered documents across tools (Word, Confluence, PowerPoint)
- ❌ Inconsistent governance enforcement
- ❌ Manual vendor evaluation with bias
- ❌ Lost traceability between requirements and design
- ❌ Stale documentation that doesn't match reality

### Solution: Structured, AI-Assisted Governance

ArcKit provides:
- ✅ **Template-Driven Quality**: Comprehensive templates ensure nothing is forgotten
- ✅ **Systematic Workflows**: Clear processes from requirements → procurement → design review
- ✅ **AI Assistance**: Let AI handle document generation, you focus on decisions
- ✅ **Enforced Traceability**: Automatic gap detection and coverage analysis
- ✅ **Version Control**: Git-based workflow for all architecture artifacts

---

## UK Government Compliance

ArcKit includes dedicated commands for UK public sector delivery:
- `/arckit.tcop` — Assess all 13 Technology Code of Practice points across delivery phases.
- `/arckit.ai-playbook` — Produce responsible AI assessments aligned to the UK Government AI Playbook and ATRS.
- `/arckit.secure` — Generate Secure by Design artefacts covering NCSC CAF, Cyber Essentials, and UK GDPR controls.
- `/arckit.mod-secure` — Map MOD Secure by Design requirements (JSP 440, IAMM, clearance pathways).
- `/arckit.jsp-936` — Deliver JSP 936 AI assurance packs for defence AI systems.

See the demo repositories for end-to-end examples, especially `arckit-test-project-v7-nhs-appointment` (civilian services) and `arckit-test-project-v8-cabinet-office-genai` (AI governance).

---

## The ArcKit Workflow

ArcKit guides you through the enterprise architecture lifecycle:

### Phase 0: Project Planning
**`/arckit.plan`** → Create project plan with timeline, phases, and gates

Visualize your entire project delivery:
- GDS Agile Delivery phases (Discovery → Alpha → Beta → Live)
- Mermaid Gantt chart with timeline, dependencies, and milestones
- Workflow diagram showing gates and decision points
- Tailored timeline based on project complexity
- Integration of all ArcKit commands into schedule
- Gate approval criteria for governance

### Phase 1: Establish Governance
**`/arckit.principles`** → Create enterprise architecture principles

Define your organisation's architecture standards:
- Cloud strategy (AWS/Azure/GCP)
- Security frameworks (Zero Trust, compliance)
- Technology standards
- FinOps and cost governance

### Phase 2: Stakeholder Analysis
**`/arckit.stakeholders`** → Analyze stakeholder drivers, goals, and outcomes

**Do this BEFORE business case** to understand who cares about the project and why:
- Identify all stakeholders (internal and external)
- Document underlying drivers (strategic, operational, financial, compliance, risk, personal)
- Map drivers to SMART goals
- Map goals to measurable outcomes
- Create Stakeholder → Driver → Goal → Outcome traceability
- Identify conflicts and synergies
- Define engagement and communication strategies

### Phase 3: Risk Assessment
**`/arckit.risk`** → Create comprehensive risk register (Orange Book)

**Do this BEFORE business case** to identify and assess risks systematically:
- Follow HM Treasury Orange Book 2023 framework
- Identify risks across 6 categories (Strategic, Operational, Financial, Compliance, Reputational, Technology)
- Assess inherent risk (before controls) and residual risk (after controls)
- Apply 4Ts response framework (Tolerate, Treat, Transfer, Terminate)
- Link every risk to stakeholder from RACI matrix
- Monitor risk appetite compliance
- Feed into SOBC Management Case Part E

### Phase 4: Business Case Justification
**`/arckit.sobc`** → Create Strategic Outline Business Case (SOBC)

**Do this BEFORE requirements** to justify investment and secure approval:
- Use HM Treasury Green Book 5-case model (Strategic, Economic, Commercial, Financial, Management)
- Analyze strategic options (Do Nothing, Minimal, Balanced, Comprehensive)
- Map benefits to stakeholder goals (complete traceability)
- Provide high-level cost estimates (Rough Order of Magnitude)
- Economic appraisal (ROI range, payback period)
- Procurement and funding strategy
- Governance and risk management (uses risk register)
- Enable go/no-go decision BEFORE detailed requirements work

### Phase 5: Define Requirements
**`/arckit.requirements`** → Document comprehensive requirements

Create detailed requirements **informed by stakeholder goals** (if SOBC approved):
- Business requirements with rationale
- Functional requirements with acceptance criteria
- Non-functional requirements (performance, security, scalability, compliance)
- Integration requirements (upstream/downstream systems)
- Data requirements (DR-xxx)
- Success criteria and KPIs

### Phase 5.3: Platform Strategy Design (Optional - for Multi-Sided Platforms)
**`/arckit.platform-design`** → Design multi-sided platform strategy using Platform Design Toolkit

Use this phase when designing **ecosystem-based platforms** (Government as a Platform, marketplaces, data platforms):
- **Ecosystem Canvas**: Map supply side, demand side, supporting entities with relationship diagrams
- **Entity-Role Portraits**: Deep dive into 3-5 key entities (context, pressures, goals, gains)
- **Motivations Matrix**: Identify synergies and conflicts across entities with mitigation strategies
- **Transactions Board**: Design 10-20 transactions with cost reduction analysis (search, information, negotiation, coordination, enforcement)
- **Learning Engine Canvas**: 5+ services that help participants improve (data, feedback loops, network effects)
- **Platform Experience Canvas**: Journey maps with business model and unit economics
- **MVP Canvas**: Liquidity bootstrapping strategy to solve chicken-and-egg problem
- **Platform Design Canvas**: Synthesize all 8 canvases into cohesive platform strategy
- **UK Government Context**: Aligns with Government as a Platform (GaaP), TCoP Point 8 (share/reuse), Digital Marketplace

**Use Cases**: NHS appointment booking, local authority data marketplaces, training procurement platforms, citizen services portals

### Phase 5.5: Data Modeling
**`/arckit.data-model`** → Create comprehensive data model with ERD

Create data model based on Data Requirements (DR-xxx):
- Visual Entity-Relationship Diagram (ERD) using Mermaid
- Detailed entity catalog with attributes, types, validation rules
- PII identification and GDPR/DPA 2018 compliance
- Data governance matrix (business owners, stewards, custodians)
- CRUD matrix showing component access patterns
- Data integration mapping (upstream sources, downstream consumers)
- Data quality framework with measurable metrics
- Requirements traceability (DR-xxx → Entity → Attribute)

### Phase 5.7: Data Protection Impact Assessment
**`/arckit.dpia`** → Generate DPIA for UK GDPR Article 35 compliance

**MANDATORY for high-risk processing** - assess privacy risks before technology selection:
- ICO 9-criteria automated screening (sensitive data, large scale, vulnerable subjects, AI/ML, etc.)
- Auto-populated from data model (entities, PII, special category data, lawful basis)
- Risk assessment focused on impact on individuals (privacy harm, discrimination)
- Data subject rights implementation checklist (SAR, deletion, portability)
- Children's data assessment (age verification, parental consent)
- AI/ML algorithmic processing assessment (bias, explainability, human oversight)
- ICO prior consultation flagging for high residual risks
- International transfer safeguards (SCCs, BCRs, adequacy decisions)
- Bidirectional links to risk register (DPIA-xxx risk IDs)
- Links mitigations to Secure by Design security controls

### Phase 6: Technology Research
**`/arckit.research`** → Research technology, services, and products

Research available solutions to meet requirements with build vs buy analysis:
- Dynamic category detection from requirements (authentication, payments, databases, etc.)
- Commercial SaaS options with pricing, reviews, and ratings (WebSearch)
- Open source alternatives with GitHub stats and community maturity
- UK Government GOV.UK platforms (One Login, Pay, Notify, Forms)
- Digital Marketplace suppliers (G-Cloud, DOS)
- Total Cost of Ownership (TCO) comparison (3-year)
- Build vs Buy vs Adopt recommendations
- Vendor shortlisting for deeper evaluation
- Integration with Wardley mapping (evolution positioning)
- Feeds into SOBC Economic Case (cost data, options analysis)

### Phase 7: Strategic Planning with Wardley Mapping
**`/arckit.wardley`** → Create strategic Wardley Maps

Visualize strategic positioning with:
- Component evolution analysis (Genesis → Custom → Product → Commodity)
- Build vs Buy decision framework
- Vendor comparison and procurement strategy
- UK Government Digital Marketplace mapping
- Evolution predictions and strategic gameplay

### Phase 7.5: Strategic Roadmap
**`/arckit.roadmap`** → Create multi-year architecture roadmap

Create strategic roadmap for multi-year transformation programs:
- **Multi-year timeline**: 3-5 year roadmap with Mermaid Gantt chart aligned to financial years (FY 2024/25, etc.)
- **Strategic themes**: Cloud migration, data modernization, security & compliance, DevOps transformation
- **Capability evolution**: Maturity progression from L1 (Initial) to L5 (Optimized) over time
- **Investment planning**: CAPEX/OPEX budget by financial year, ROI projections, benefits realization
- **Governance framework**: ARB monthly, Programme Board monthly, Steering Committee quarterly
- **Service Standard gates**: Alpha/Beta/Live assessment milestones (UK Government)
- **Dependencies**: Mermaid flowchart showing initiative sequencing and critical path
- **Success metrics**: Cloud adoption %, technical debt reduction, deployment frequency, time to market
- **Traceability**: Links roadmap themes to stakeholder drivers, architecture principles, requirements
- **UK Government specifics**: Spending Review alignment, TCoP compliance timeline, NCSC CAF progression

**Use this when**: You have a multi-year transformation program with multiple initiatives running in parallel. Roadmaps are strategic (multi-year, multi-initiative, executive communication) vs project plans which are tactical (single initiative, detailed tasks, team execution).

**Roadmap feeds into**: `/arckit.plan` for detailed phase execution, `/arckit.sobc` for investment business case, `/arckit.backlog` for prioritized user stories.

### Phase 7.7: Architecture Decision Records
**`/arckit.adr`** → Document architectural decisions

Create Architecture Decision Records (ADRs) following MADR v4.0 format enhanced with UK Government requirements:
- **Decision metadata**: Sequential numbering (ADR-001, ADR-002), status (Proposed/Accepted/Superseded), escalation level (Team/Cross-team/Department/Cross-government)
- **Stakeholder RACI**: Deciders (accountable), Consulted (SMEs, two-way), Informed (one-way communication)
- **Context and problem statement**: Why this decision is needed, business/technical/regulatory drivers
- **Decision drivers**: Technical forces (performance, security, scalability), business forces (cost, time), compliance forces (GDS Service Standard, TCoP, NCSC, UK GDPR)
- **Options analysis**: Minimum 2-3 options plus "Do Nothing" baseline, each with pros/cons, cost (CAPEX/OPEX/TCO), GDS Service Standard impact, Wardley evolution stage
- **Y-Statement**: Structured justification - "In the context of X, facing Y, we decided for Z to achieve A, accepting B"
- **Consequences**: Positive (benefits, capabilities), Negative (trade-offs, technical debt), Neutral (training, infrastructure), Risks and mitigations
- **Validation**: How implementation will be verified (design reviews, code reviews, testing, monitoring)
- **Traceability**: Links to requirements, principles, stakeholders, research, Wardley maps, diagrams, risk register
- **UK Government specifics**: Escalation levels (Team → Cross-team → Department → Cross-government), governance forums (ARB, TDA, Programme Board), Service Standard/TCoP compliance documentation

**Use this when**: Making significant architectural decisions that affect system structure, quality attributes, or behavior - technology choices (databases, frameworks, cloud services), integration patterns, security approaches, deployment strategies, data management.

**ADR feeds into**: `/arckit.diagram` (architecture diagrams reflect decisions), `/arckit.hld-review` and `/arckit.dld-review` (reviews verify decisions implemented), `/arckit.traceability` (decisions are key traceability artifacts).

### Phase 8: Vendor Procurement (if needed)
**`/arckit.sow`** → Generate Statement of Work (RFP)

Create RFP-ready documents with:
- Scope of work and deliverables
- Technical requirements
- Vendor qualifications
- Evaluation criteria
- Contract terms

**`/arckit.dos`** → Digital Outcomes and Specialists (DOS) procurement 🇬🇧

For UK public sector organizations needing custom development:
- Generate DOS-compliant procurement documentation
- Extract requirements from project artifacts (BR/FR/NFR/INT/DR)
- Essential vs desirable skills from requirements
- Success criteria (technology-agnostic)
- Evaluation framework (40% Technical, 30% Team, 20% Quality, 10% Value)
- Audit-ready documentation for Digital Marketplace

**`/arckit.gcloud-search`** → G-Cloud service search with live marketplace search 🇬🇧

For UK public sector organizations needing off-the-shelf cloud services:
- Generate G-Cloud requirements document
- **Live Digital Marketplace search** using WebSearch
- Find actual services with suppliers, prices, features, links
- Service comparison table with recommendations
- Shortlist top 3-5 matching services
- Links to Digital Marketplace guidance (gov.uk)

**`/arckit.gcloud-clarify`** → G-Cloud service validation and gap analysis 🇬🇧

Validate G-Cloud services and generate supplier clarification questions:
- **Systematic gap analysis** (MUST/SHOULD requirements vs service descriptions)
- Detect gaps: ✅ Confirmed, ⚠️ Ambiguous, ❌ Not mentioned
- Generate prioritised questions (🔴 Critical / 🟠 High / 🔵 Medium / 🟢 Low)
- Risk assessment matrix for each service
- Email templates for supplier engagement
- Evidence requirements specification
- Next steps checklist

**`/arckit.evaluate`** → Create vendor evaluation framework

Set up systematic scoring:
- Technical evaluation criteria (100 points)
- Cost evaluation methodology
- Reference check templates
- Decision matrix

**`/arckit.evaluate`** (compare mode) → Compare vendor proposals

Side-by-side analysis of:
- Technical approaches
- Cost breakdowns
- Risk assessments
- Value propositions

### Phase 9: Design Review
**`/arckit.hld-review`** → Review High-Level Design

Validate designs against:
- Architecture principles compliance
- Requirements coverage
- Security and compliance
- Scalability and resilience
- Operational readiness

**`/arckit.dld-review`** → Review Detailed Design

Implementation-ready validation:
- Component specifications
- API contracts (OpenAPI)
- Database schemas
- Security implementation
- Test strategy

### Phase 10: Sprint Planning
**`/arckit.backlog`** → Generate prioritised product backlog

Transform requirements into sprint-ready user stories:
- Convert requirements (BR/FR/NFR/INT/DR) to GDS-format user stories
- Multi-factor prioritization (MoSCoW + risk + value + dependencies)
- Organise into sprint plan with capacity balancing
- Generate traceability matrix (requirements → stories → sprints)
- Export to Jira/Azure DevOps (CSV) or custom tools (JSON)
- **Time savings**: 75%+ (4-6 weeks → 3-5 days)

**When to run**: After HLD approval, before Sprint 1 (Alpha → Beta transition)

### Phase 11: ServiceNow Service Management Design
**`/arckit.servicenow`** → Generate ServiceNow service design

Bridge architecture to operations:
- CMDB design (derived from architecture diagrams)
- SLA definitions (derived from NFRs)
- Incident management design
- Change management plan
- Monitoring and alerting plan
- Service transition plan

### Phase 12: Traceability
**`/arckit.traceability`** → Generate traceability matrix

Ensure complete coverage:
- Requirements → Design mapping
- Design → Test mapping
- Gap analysis and orphan detection
- Change impact tracking

### Phase 13: Quality Assurance
**`/arckit.analyze`** → Comprehensive governance quality analysis

Periodically assess governance quality across all artifacts:
- Architecture principles compliance
- Requirements coverage and traceability
- Stakeholder alignment verification
- Risk management completeness
- Design review quality
- Documentation completeness and quality
- Gap identification and recommendations

**When to use**: Run periodically (before milestones, design reviews, or procurement decisions) to identify gaps and ensure governance standards are maintained.

### Phase 14: Compliance Assessment (UK Government)
For UK Government and public sector projects:

**`/arckit.service-assessment`** → GDS Service Standard assessment preparation

Prepare for mandatory GDS Service Standard assessments:
- Analyze evidence against all 14 Service Standard points
- Identify gaps for alpha, beta, or live assessments
- Generate RAG (Red/Amber/Green) ratings and overall readiness score
- Provide actionable recommendations with priorities and timelines
- Include assessment day preparation guidance
- Map ArcKit artifacts to Service Standard evidence requirements

Run at end of Discovery (for alpha prep), mid-Beta (for beta prep), or before Live to ensure readiness.

**`/arckit.tcop`** → Technology Code of Practice assessment

Assess compliance with all 13 TCoP points:
- Point 1: Define user needs
- Point 2: Make things accessible
- Point 3: Be open and use open source
- Point 4: Make use of open standards
- Point 5: Use cloud first
- Point 6: Make things secure
- Point 7: Make privacy integral
- Point 8: Share, reuse and collaborate
- Point 9: Integrate and adapt technology
- Point 10: Make better use of data
- Point 11: Define your purchasing strategy
- Point 12: Meet the Digital Spend Controls
- Point 13: Define your responsible AI use

**`/arckit.secure`** → UK Government Secure by Design assessment

Security compliance assessment:
- NCSC Cloud Security Principles
- NCSC Cyber Assessment Framework (CAF)
- Cyber Essentials / Cyber Essentials Plus
- UK GDPR and DPA 2018 compliance
- Security architecture review
- Threat modeling

**`/arckit.ai-playbook`** → AI Playbook compliance (for AI systems)

Responsible AI assessment:
- AI ethics principles
- Transparency and explainability
- Fairness and bias mitigation
- Data governance for AI
- Human oversight mechanisms
- Impact assessment

**`/arckit.atrs`** → Algorithmic Transparency Recording Standard

Generate ATRS record for algorithmic decision-making:
- Algorithm details and logic
- Purpose and use case
- Data sources and data quality
- Performance metrics and monitoring
- Impact assessment and mitigation

**For MOD Projects**:

**`/arckit.mod-secure`** → MOD Secure by Design assessment

MOD-specific security compliance:
- JSP 440 (Defence Project & Programme Management)
- Information Assurance Maturity Model (IAMM)
- MOD Security clearances and vetting
- STRAP classification handling
- Security Operating Procedures (SyOPs)
- Supplier attestation requirements

**`/arckit.jsp-936`** → MOD JSP 936 AI Assurance Documentation

For defence projects using AI/ML systems:
- JSP 936 (Dependable Artificial Intelligence in Defence)
- 5 Ethical Principles (Human-Centricity, Responsibility, Understanding, Bias & Harm Mitigation, Reliability)
- 5 Risk Classification Levels (Critical to Minor)
- 8 AI Lifecycle Phases (Planning to Quality Assurance)
- Approval pathways (2PUS/Ministerial → Defence-Level → TLB-Level)
- RAISOs and Ethics Manager governance
- Human-AI teaming strategy and continuous monitoring

### Phase 15: Project Story & Reporting
**`/arckit.story`** → Generate comprehensive project story

Create narrative historical record with complete timeline analysis:
- **Timeline Analysis**: 4 visualization types (Gantt chart, linear flowchart, detailed table, phase duration pie chart)
- **Timeline Metrics**: Project duration, velocity, phase analysis, critical path identification
- **Complete Timeline**: All events from git log or file modification dates with days-from-start
- **8 Narrative Chapters**: Foundation → Business Case → Requirements → Research → Procurement → Design → Delivery → Compliance
- **Traceability Demonstration**: End-to-end chains with Mermaid diagrams showing stakeholder → goals → requirements → stories → sprints
- **Governance Achievements**: Showcase compliance (TCoP, Service Standard, NCSC CAF), risk management, decision rationale
- **Strategic Context**: Wardley Map insights, build vs buy decisions, vendor selection rationale
- **Lessons Learned**: Pacing analysis, timeline deviations, recommendations for future projects
- **Comprehensive Appendices**: Artifact register, chronological activity log, DSM, command reference, glossary

**When to use**: At project milestones or completion to create shareable story for stakeholders, leadership, or portfolio reporting. Perfect for demonstrating systematic governance and ArcKit workflow value.

### Phase 16: Documentation Publishing
**`/arckit.pages`** → Generate GitHub Pages documentation site

Publish all project documentation as an interactive website:
- **GitHub Pages Integration**: Generates `docs/index.html` and `docs/manifest.json` for GitHub Pages hosting
- **Mermaid Diagram Rendering**: All architecture diagrams render inline with mermaid.js
- **Project Navigation**: Sidebar with collapsible project tree and document categories
- **GOV.UK Styling**: Professional government design system styling
- **Document Index**: Manifest.json provides programmatic access to all artifacts

**When to use**: When you want to share project documentation with stakeholders via a professional web interface, or to create a portfolio view of all architecture artifacts.

---

## Supported AI Agents

| Agent | Support | Notes |
|-------|---------|-------|
| [Claude Code](https://www.anthropic.com/claude-code) | ✅ | Recommended |
| [OpenAI Codex CLI](https://chatgpt.com/features/codex) | ✅ | ChatGPT Plus/Pro/Enterprise ([Setup Guide](.codex/README.md)) |
| [Gemini CLI](https://github.com/google-gemini/gemini-cli) | ✅ | |

### Using with Codex CLI

For OpenAI Codex CLI users, commands use the `/prompts:` format:

```bash
# Set CODEX_HOME to use project-specific commands
export CODEX_HOME="$(pwd)/.codex"
codex --auto

# Then use ArcKit commands
/prompts:arckit.principles Create principles for financial services
/prompts:arckit.stakeholders Analyze stakeholders for cloud migration
/prompts:arckit.requirements Create comprehensive requirements
```

See [.codex/README.md](.codex/README.md) for full Codex CLI setup and usage.


## Project Structure

ArcKit creates this structure:

```
payment-modernization/
├── .arckit/
│   ├── memory/
│   │   └── architecture-principles.md    # Global principles
│   ├── scripts/
│   │   └── bash/                          # Automation scripts
│   └── templates/                         # Document templates
├── projects/
│   └── 001-payment-gateway/
│       ├── stakeholder-drivers.md         # Stakeholder analysis
│       ├── risk-register.md                # Risk register (Orange Book)
│       ├── sobc.md                         # Strategic Outline Business Case
│       ├── requirements.md                 # Comprehensive requirements
│       ├── data-model.md                   # Data model with ERD, GDPR compliance
│       ├── wardley-maps/                   # Strategic Wardley Maps
│       │   ├── current-state.md            # Current architecture positioning
│       │   ├── future-state.md             # Target architecture vision
│       │   ├── gap-analysis.md             # Current vs future comparison
│       │   └── procurement-strategy.md     # Build vs buy decisions
│       ├── sow.md                          # Statement of Work (RFP)
│       ├── evaluation-criteria.md          # Vendor evaluation framework
│       ├── vendors/
│       │   ├── acme-corp/
│       │   │   ├── proposal.pdf
│       │   │   ├── scoring.md
│       │   │   ├── hld-v1.md
│       │   │   └── reviews/
│       │   │       └── hld-v1-review.md
│       │   ├── beta-systems/
│       │   │   └── ...
│       │   └── comparison.md
│       ├── servicenow-design.md            # Service management design
│       ├── traceability-matrix.md
│       └── final/
│           ├── selected-vendor.md
│           ├── approved-hld.md
│           └── dld/
└── .claude/commands/                      # AI assistant commands
```

---

## Complete Command Reference

All 40 ArcKit commands with maturity status and example outputs from public test repositories.

### Status Legend

| Status | Description |
|--------|-------------|
| 🟢 **Live** | Production-ready, extensively tested |
| 🔵 **Beta** | Feature-complete, actively refined |
| 🟠 **Alpha** | Working, limited testing |
| 🟣 **Experimental** | New in v0.10.0, early adopters |

### Example Repositories

| Code | Repository | Description |
|------|------------|-------------|
| v1 | [arckit-test-project-v1-m365](https://github.com/tractorjuice/arckit-test-project-v1-m365) | Microsoft 365 GCC-H Migration |
| v2 | [arckit-test-project-v2-hmrc-chatbot](https://github.com/tractorjuice/arckit-test-project-v2-hmrc-chatbot) | HMRC Tax Assistant Chatbot |
| v3 | [arckit-test-project-v3-windows11](https://github.com/tractorjuice/arckit-test-project-v3-windows11) | Windows 11 Enterprise Deployment |
| v6 | [arckit-test-project-v6-patent-system](https://github.com/tractorjuice/arckit-test-project-v6-patent-system) | IPO Patent Application System |
| v8 | [arckit-test-project-v8-ons-data-platform](https://github.com/tractorjuice/arckit-test-project-v8-ons-data-platform) | ONS Data Platform Modernisation |
| v9 | [arckit-test-project-v9-cabinet-office-genai](https://github.com/tractorjuice/arckit-test-project-v9-cabinet-office-genai) | Cabinet Office GenAI Platform |
| v10 | [arckit-test-project-v10-training-marketplace](https://github.com/tractorjuice/arckit-test-project-v10-training-marketplace) | UK Government Training Marketplace |
| v11 | [arckit-test-project-v11-national-highways-data](https://github.com/tractorjuice/arckit-test-project-v11-national-highways-data) | National Highways Data Architecture |

### Foundation

| Command | Description | Examples | Status |
|---------|-------------|----------|--------|
| `/arckit.plan` | Create project plan with timeline, phases, gates, and Mermaid diagrams | [v3/001](https://github.com/tractorjuice/arckit-test-project-v3-windows11/blob/main/projects/001-windows-11-migration-intune/project-plan.md) [v3/002](https://github.com/tractorjuice/arckit-test-project-v3-windows11/blob/main/projects/002-application-packaging-rationalisation/project-plan.md) [v3/004](https://github.com/tractorjuice/arckit-test-project-v3-windows11/blob/main/projects/004-conference-facilities-modernization/project-plan.md) [v3/005](https://github.com/tractorjuice/arckit-test-project-v3-windows11/blob/main/projects/005-cloud-pki/project-plan.md) [v8](https://github.com/tractorjuice/arckit-test-project-v8-ons-data-platform/blob/main/projects/001-ons-data-platform-modernisation/project-plan.md) [v9](https://github.com/tractorjuice/arckit-test-project-v9-cabinet-office-genai/blob/main/projects/001-cabinet-office-genai/project-plan.md) [v10](https://github.com/tractorjuice/arckit-test-project-v10-training-marketplace/blob/main/projects/001-ai-training-marketplace/project-plan.md) [v11](https://github.com/tractorjuice/arckit-test-project-v11-national-highways-data/blob/main/projects/001-national-highways-data-architecture-modernization/project-plan.md) | 🟢 Live |
| `/arckit.principles` | Create or update enterprise architecture principles | [v1](https://github.com/tractorjuice/arckit-test-project-v1-m365/blob/main/.arckit/memory/architecture-principles.md) [v2](https://github.com/tractorjuice/arckit-test-project-v2-hmrc-chatbot/blob/main/.arckit/memory/architecture-principles.md) [v3](https://github.com/tractorjuice/arckit-test-project-v3-windows11/blob/main/.arckit/memory/architecture-principles.md) [v6](https://github.com/tractorjuice/arckit-test-project-v6-patent-system/blob/main/.arckit/memory/architecture-principles.md) [v8](https://github.com/tractorjuice/arckit-test-project-v8-ons-data-platform/blob/main/.arckit/memory/architecture-principles.md) [v9](https://github.com/tractorjuice/arckit-test-project-v9-cabinet-office-genai/blob/main/.arckit/memory/architecture-principles.md) [v10](https://github.com/tractorjuice/arckit-test-project-v10-training-marketplace/blob/main/.arckit/memory/architecture-principles.md) [v11](https://github.com/tractorjuice/arckit-test-project-v11-national-highways-data/blob/main/.arckit/memory/architecture-principles.md) | 🟢 Live |

### Strategic Context

| Command | Description | Examples | Status |
|---------|-------------|----------|--------|
| `/arckit.stakeholders` | Analyze stakeholder drivers, goals, and measurable outcomes | [v3/001](https://github.com/tractorjuice/arckit-test-project-v3-windows11/blob/main/projects/001-windows-11-migration-intune/stakeholder-drivers.md) [v3/003](https://github.com/tractorjuice/arckit-test-project-v3-windows11/blob/main/projects/003-peripherals-update-upgrade/stakeholder-drivers.md) [v3/004](https://github.com/tractorjuice/arckit-test-project-v3-windows11/blob/main/projects/004-conference-facilities-modernization/stakeholder-drivers.md) [v3/005](https://github.com/tractorjuice/arckit-test-project-v3-windows11/blob/main/projects/005-cloud-pki/stakeholder-drivers.md) [v8](https://github.com/tractorjuice/arckit-test-project-v8-ons-data-platform/blob/main/projects/001-ons-data-platform-modernisation/stakeholder-drivers.md) [v9](https://github.com/tractorjuice/arckit-test-project-v9-cabinet-office-genai/blob/main/projects/001-cabinet-office-genai/stakeholder-drivers.md) [v10](https://github.com/tractorjuice/arckit-test-project-v10-training-marketplace/blob/main/projects/001-ai-training-marketplace/stakeholder-drivers.md) [v11](https://github.com/tractorjuice/arckit-test-project-v11-national-highways-data/blob/main/projects/001-national-highways-data-architecture-modernization/stakeholder-drivers.md) | 🟢 Live |
| `/arckit.risk` | Create comprehensive risk register following HM Treasury Orange Book principles | [v3/001](https://github.com/tractorjuice/arckit-test-project-v3-windows11/blob/main/projects/001-windows-11-migration-intune/risk-register.md) [v3/003](https://github.com/tractorjuice/arckit-test-project-v3-windows11/blob/main/projects/003-peripherals-update-upgrade/risk-register.md) [v3/004](https://github.com/tractorjuice/arckit-test-project-v3-windows11/blob/main/projects/004-conference-facilities-modernization/risk-register.md) [v8](https://github.com/tractorjuice/arckit-test-project-v8-ons-data-platform/blob/main/projects/001-ons-data-platform-modernisation/risk-register.md) [v9](https://github.com/tractorjuice/arckit-test-project-v9-cabinet-office-genai/blob/main/projects/001-cabinet-office-genai/risk-register.md) [v11](https://github.com/tractorjuice/arckit-test-project-v11-national-highways-data/blob/main/projects/001-national-highways-data-architecture-modernization/risk-register.md) | 🟢 Live |
| `/arckit.sobc` | Create Strategic Outline Business Case (SOBC) using UK Government Green Book 5-case model | [v3](https://github.com/tractorjuice/arckit-test-project-v3-windows11/blob/main/projects/001-windows-11-migration-intune/sobc.md) [v8](https://github.com/tractorjuice/arckit-test-project-v8-ons-data-platform/blob/main/projects/001-ons-data-platform-modernisation/sobc.md) | 🟢 Live |

### Requirements & Data

| Command | Description | Examples | Status |
|---------|-------------|----------|--------|
| `/arckit.requirements` | Create comprehensive business and technical requirements | [v1](https://github.com/tractorjuice/arckit-test-project-v1-m365/blob/main/projects/001-exchange-online-migration/requirements.md) [v2](https://github.com/tractorjuice/arckit-test-project-v2-hmrc-chatbot/blob/main/projects/001-hmrc-chatbot/requirements.md) [v3/001](https://github.com/tractorjuice/arckit-test-project-v3-windows11/blob/main/projects/001-windows-11-migration-intune/requirements.md) [v3/002](https://github.com/tractorjuice/arckit-test-project-v3-windows11/blob/main/projects/002-application-packaging-rationalisation/requirements.md) [v3/003](https://github.com/tractorjuice/arckit-test-project-v3-windows11/blob/main/projects/003-peripherals-update-upgrade/requirements.md) [v3/004](https://github.com/tractorjuice/arckit-test-project-v3-windows11/blob/main/projects/004-conference-facilities-modernization/requirements.md) [v3/005](https://github.com/tractorjuice/arckit-test-project-v3-windows11/blob/main/projects/005-cloud-pki/requirements.md) [v3/006](https://github.com/tractorjuice/arckit-test-project-v3-windows11/blob/main/projects/006-large-format-printer/requirements.md) [v3/007](https://github.com/tractorjuice/arckit-test-project-v3-windows11/blob/main/projects/007-vpn-service-windows11-autopilot/requirements.md) [v6](https://github.com/tractorjuice/arckit-test-project-v6-patent-system/blob/main/projects/001-patent-management-system-for-the-intellectual-property-office/requirements.md) [v8](https://github.com/tractorjuice/arckit-test-project-v8-ons-data-platform/blob/main/projects/001-ons-data-platform-modernisation/requirements.md) [v9](https://github.com/tractorjuice/arckit-test-project-v9-cabinet-office-genai/blob/main/projects/001-cabinet-office-genai/requirements.md) [v10](https://github.com/tractorjuice/arckit-test-project-v10-training-marketplace/blob/main/projects/001-ai-training-marketplace/requirements.md) [v11](https://github.com/tractorjuice/arckit-test-project-v11-national-highways-data/blob/main/projects/001-national-highways-data-architecture-modernization/requirements.md) | 🟢 Live |
| `/arckit.data-model` | Create comprehensive data model with entity relationships, GDPR compliance, and data governance | [v3/001](https://github.com/tractorjuice/arckit-test-project-v3-windows11/blob/main/projects/001-windows-11-migration-intune/data-model.md) [v3/002](https://github.com/tractorjuice/arckit-test-project-v3-windows11/blob/main/projects/002-application-packaging-rationalisation/data-model.md) [v8](https://github.com/tractorjuice/arckit-test-project-v8-ons-data-platform/blob/main/projects/001-ons-data-platform-modernisation/data-model.md) [v9](https://github.com/tractorjuice/arckit-test-project-v9-cabinet-office-genai/blob/main/projects/001-cabinet-office-genai/data-model.md) [v10](https://github.com/tractorjuice/arckit-test-project-v10-training-marketplace/blob/main/projects/001-ai-training-marketplace/data-model.md) [v11](https://github.com/tractorjuice/arckit-test-project-v11-national-highways-data/blob/main/projects/001-national-highways-data-architecture-modernization/data-model.md) | 🟢 Live |
| `/arckit.data-mesh-contract` | Create federated data product contracts for mesh architectures with SLAs, governance, and interoperability guarantees | — | 🟠 Alpha |
| `/arckit.dpia` | Generate Data Protection Impact Assessment (DPIA) for UK GDPR Article 35 compliance | [v3](https://github.com/tractorjuice/arckit-test-project-v3-windows11/blob/main/projects/001-windows-11-migration-intune/dpia.md) [v8](https://github.com/tractorjuice/arckit-test-project-v8-ons-data-platform/blob/main/projects/001-ons-data-platform-modernisation/dpia.md) [v9](https://github.com/tractorjuice/arckit-test-project-v9-cabinet-office-genai/blob/main/projects/001-cabinet-office-genai/dpia.md) | 🔵 Beta |

### Research & Strategy

| Command | Description | Examples | Status |
|---------|-------------|----------|--------|
| `/arckit.platform-design` | Create platform strategy using Platform Design Toolkit (8 canvases for multi-sided ecosystems) | [v8](https://github.com/tractorjuice/arckit-test-project-v8-ons-data-platform/blob/main/projects/001-ons-data-platform-modernisation/gaap-ecosystem-analysis.md) [v10](https://github.com/tractorjuice/arckit-test-project-v10-training-marketplace/blob/main/projects/001-ai-training-marketplace/platform-design.md) | 🟣 Experimental |
| `/arckit.research` | Research technology, services, and products to meet requirements with build vs buy analysis | [v3/001](https://github.com/tractorjuice/arckit-test-project-v3-windows11/blob/main/projects/001-windows-11-migration-intune/research-findings.md) [v3/002](https://github.com/tractorjuice/arckit-test-project-v3-windows11/blob/main/projects/002-application-packaging-rationalisation/research-findings.md) [v3/003](https://github.com/tractorjuice/arckit-test-project-v3-windows11/blob/main/projects/003-peripherals-update-upgrade/research-findings-dell.md) | 🔵 Beta |
| `/arckit.wardley` | Create strategic Wardley Maps for architecture decisions and build vs buy analysis | [v3](https://github.com/tractorjuice/arckit-test-project-v3-windows11/blob/main/projects/001-windows-11-migration-intune/wardley-maps/procurement-strategy.md) [v6](https://github.com/tractorjuice/arckit-test-project-v6-patent-system/blob/main/projects/001-patent-management-system-for-the-intellectual-property-office/wardley-maps/procurement-strategy.md) [v11](https://github.com/tractorjuice/arckit-test-project-v11-national-highways-data/blob/main/projects/001-national-highways-data-architecture-modernization/wardley-maps/current-state-procurement-strategy.md) | 🟣 Experimental |
| `/arckit.roadmap` | Create strategic architecture roadmap with multi-year timeline, capability evolution, and governance | [v3](https://github.com/tractorjuice/arckit-test-project-v3-windows11/blob/main/projects/001-windows-11-migration-intune/roadmap.md) | 🔵 Beta |
| `/arckit.adr` | Document architectural decisions with options analysis and traceability | [v3/001](https://github.com/tractorjuice/arckit-test-project-v3-windows11/blob/main/projects/001-windows-11-migration-intune/decisions/ADR-001-cloud-native-endpoint-management-platform-selection.md) [v3/002](https://github.com/tractorjuice/arckit-test-project-v3-windows11/blob/main/projects/002-application-packaging-rationalisation/decisions/ADR-001-application-packaging-format-strategy.md) [v3/003](https://github.com/tractorjuice/arckit-test-project-v3-windows11/blob/main/projects/003-peripherals-update-upgrade/adr-001-multi-vendor-peripheral-procurement-strategy.md) [v3/004](https://github.com/tractorjuice/arckit-test-project-v3-windows11/blob/main/projects/004-conference-facilities-modernization/decisions/ADR-001-use-microsoft-teams-rooms.md) [v3/005](https://github.com/tractorjuice/arckit-test-project-v3-windows11/blob/main/projects/005-cloud-pki/decisions/ADR-001-use-cloud-pki-service.md) | 🔵 Beta |

### Procurement

| Command | Description | Examples | Status |
|---------|-------------|----------|--------|
| `/arckit.sow` | Generate Statement of Work (SOW) / RFP document for vendor procurement | [v1](https://github.com/tractorjuice/arckit-test-project-v1-m365/blob/main/projects/001-exchange-online-migration/sow.md) [v2](https://github.com/tractorjuice/arckit-test-project-v2-hmrc-chatbot/blob/main/projects/001-hmrc-chatbot/sow.md) [v3/001](https://github.com/tractorjuice/arckit-test-project-v3-windows11/blob/main/projects/001-windows-11-migration-intune/sow.md) [v3/002](https://github.com/tractorjuice/arckit-test-project-v3-windows11/blob/main/projects/002-application-packaging-rationalisation/sow.md) [v3/003](https://github.com/tractorjuice/arckit-test-project-v3-windows11/blob/main/projects/003-peripherals-update-upgrade/sow.md) [v6](https://github.com/tractorjuice/arckit-test-project-v6-patent-system/blob/main/projects/001-patent-management-system-for-the-intellectual-property-office/sow.md) | 🟢 Live |
| `/arckit.dos` | Generate Digital Outcomes and Specialists (DOS) procurement documentation for UK Digital Marketplace | — | 🟣 Experimental |
| `/arckit.gcloud-search` | Find G-Cloud services on UK Digital Marketplace with live search and comparison | [v3](https://github.com/tractorjuice/arckit-test-project-v3-windows11/blob/main/projects/001-windows-11-migration-intune/procurement/gcloud-requirements.md) | 🟣 Experimental |
| `/arckit.gcloud-clarify` | Analyze G-Cloud service gaps and generate supplier clarification questions | — | 🟣 Experimental |
| `/arckit.evaluate` | Create vendor evaluation framework and score vendor proposals | [v1](https://github.com/tractorjuice/arckit-test-project-v1-m365/blob/main/projects/001-exchange-online-migration/evaluation-criteria.md) [v2](https://github.com/tractorjuice/arckit-test-project-v2-hmrc-chatbot/blob/main/projects/001-hmrc-chatbot/evaluation-criteria.md) [v3/001](https://github.com/tractorjuice/arckit-test-project-v3-windows11/blob/main/projects/001-windows-11-migration-intune/evaluation-criteria.md) [v3/002](https://github.com/tractorjuice/arckit-test-project-v3-windows11/blob/main/projects/002-application-packaging-rationalisation/evaluation-criteria.md) [v3/003](https://github.com/tractorjuice/arckit-test-project-v3-windows11/blob/main/projects/003-peripherals-update-upgrade/evaluation-criteria.md) [v3/005](https://github.com/tractorjuice/arckit-test-project-v3-windows11/blob/main/projects/005-cloud-pki/evaluation-criteria.md) [v6](https://github.com/tractorjuice/arckit-test-project-v6-patent-system/blob/main/projects/001-patent-management-system-for-the-intellectual-property-office/evaluation-criteria.md) | 🟢 Live |

### Design & Architecture

| Command | Description | Examples | Status |
|---------|-------------|----------|--------|
| `/arckit.diagram` | Generate architecture diagrams using Mermaid for visual documentation | [v1](https://github.com/tractorjuice/arckit-test-project-v1-m365/blob/main/projects/001-exchange-online-migration/diagrams/container-m365-exchange-online.md) [v3/001](https://github.com/tractorjuice/arckit-test-project-v3-windows11/blob/main/projects/001-windows-11-migration-intune/diagrams/container-intune-architecture.md) [v3/005](https://github.com/tractorjuice/arckit-test-project-v3-windows11/blob/main/projects/005-cloud-pki/diagrams/container-hybrid-pki.md) [v3/007](https://github.com/tractorjuice/arckit-test-project-v3-windows11/blob/main/projects/007-vpn-service-windows11-autopilot/diagrams/container-vpn-architecture.md) [v10](https://github.com/tractorjuice/arckit-test-project-v10-training-marketplace/blob/main/projects/001-ai-training-marketplace/diagrams/container-ai-training-marketplace.md) | 🟢 Live |
| `/arckit.hld-review` | Review High-Level Design (HLD) against architecture principles and requirements | [v3](https://github.com/tractorjuice/arckit-test-project-v3-windows11/blob/main/projects/001-windows-11-migration-intune/hld.md) | 🔵 Beta |
| `/arckit.dld-review` | Review Detailed Design (DLD) for implementation readiness | — | 🔵 Beta |

### Operations

| Command | Description | Examples | Status |
|---------|-------------|----------|--------|
| `/arckit.backlog` | Generate prioritised product backlog from ArcKit artifacts - convert requirements to user stories, organise into sprints | [v3/001](https://github.com/tractorjuice/arckit-test-project-v3-windows11/blob/main/projects/001-windows-11-migration-intune/backlog.md) [v3/002](https://github.com/tractorjuice/arckit-test-project-v3-windows11/blob/main/projects/002-application-packaging-rationalisation/backlog.md) [v3/003](https://github.com/tractorjuice/arckit-test-project-v3-windows11/blob/main/projects/003-peripherals-update-upgrade/backlog.md) [v3/004](https://github.com/tractorjuice/arckit-test-project-v3-windows11/blob/main/projects/004-conference-facilities-modernization/backlog.md) [v9](https://github.com/tractorjuice/arckit-test-project-v9-cabinet-office-genai/blob/main/projects/001-cabinet-office-genai/backlog.md) | 🔵 Beta |
| `/arckit.servicenow` | Create comprehensive ServiceNow service design with CMDB, SLAs, incident management, and change control | [v3](https://github.com/tractorjuice/arckit-test-project-v3-windows11/blob/main/projects/001-windows-11-migration-intune/servicenow-design.md) | 🔵 Beta |
| `/arckit.devops` | Create DevOps strategy with CI/CD pipelines, IaC, container orchestration, and developer experience | — | 🟣 Experimental |
| `/arckit.mlops` | Create MLOps strategy with model lifecycle, training pipelines, serving, monitoring, and governance | — | 🟣 Experimental |
| `/arckit.finops` | Create FinOps strategy with cloud cost management, optimization, governance, and forecasting | — | 🟣 Experimental |
| `/arckit.operationalize` | Create operational readiness pack with support model, runbooks, DR/BCP, on-call, and handover documentation | — | 🟣 Experimental |
| `/arckit.traceability` | Generate requirements traceability matrix from requirements to design to tests | [v1](https://github.com/tractorjuice/arckit-test-project-v1-m365/blob/main/projects/001-exchange-online-migration/traceability-matrix.md) [v2](https://github.com/tractorjuice/arckit-test-project-v2-hmrc-chatbot/blob/main/projects/001-hmrc-chatbot/traceability-matrix.md) [v3/001](https://github.com/tractorjuice/arckit-test-project-v3-windows11/blob/main/projects/001-windows-11-migration-intune/traceability-matrix.md) [v3/002](https://github.com/tractorjuice/arckit-test-project-v3-windows11/blob/main/projects/002-application-packaging-rationalisation/traceability-matrix.md) [v3/003](https://github.com/tractorjuice/arckit-test-project-v3-windows11/blob/main/projects/003-peripherals-update-upgrade/traceability-matrix.md) [v6](https://github.com/tractorjuice/arckit-test-project-v6-patent-system/blob/main/projects/001-patent-management-system-for-the-intellectual-property-office/traceability-matrix.md) [v9](https://github.com/tractorjuice/arckit-test-project-v9-cabinet-office-genai/blob/main/projects/001-cabinet-office-genai/traceability-matrix.md) | 🟢 Live |

### Quality & Governance

| Command | Description | Examples | Status |
|---------|-------------|----------|--------|
| `/arckit.analyze` | Perform comprehensive governance quality analysis across architecture artifacts | [v9](https://github.com/tractorjuice/arckit-test-project-v9-cabinet-office-genai/blob/main/projects/001-cabinet-office-genai/analysis-report.md) [v11](https://github.com/tractorjuice/arckit-test-project-v11-national-highways-data/blob/main/projects/001-national-highways-data-architecture-modernization/analysis-report.md) | 🔵 Beta |
| `/arckit.principles-compliance` | Assess compliance with architecture principles and generate scorecard with evidence, gaps, and recommendations | [v3](https://github.com/tractorjuice/arckit-test-project-v3-windows11/blob/main/projects/001-windows-11-migration-intune/principles-compliance-assessment-2025-11-04.md) | 🟢 Live |
| `/arckit.story` | Generate comprehensive project story with timeline analysis, traceability, and governance achievements | [v3](https://github.com/tractorjuice/arckit-test-project-v3-windows11/blob/main/projects/001-windows-11-migration-intune/PROJECT-STORY.md) [v8](https://github.com/tractorjuice/arckit-test-project-v8-ons-data-platform/blob/main/projects/001-ons-data-platform-modernisation/PROJECT-STORY.md) [v9](https://github.com/tractorjuice/arckit-test-project-v9-cabinet-office-genai/blob/main/projects/001-cabinet-office-genai/PROJECT-STORY.md) | 🟢 Live |

### UK Government

| Command | Description | Examples | Status |
|---------|-------------|----------|--------|
| `/arckit.service-assessment` | Prepare for GDS Service Standard assessment - analyze evidence against 14 points, identify gaps, generate readiness report | — | 🔵 Beta |
| `/arckit.tcop` | Generate a Technology Code of Practice (TCoP) review document for a UK Government technology project | [v6](https://github.com/tractorjuice/arckit-test-project-v6-patent-system/blob/main/projects/001-patent-management-system-for-the-intellectual-property-office/tcop-assessment.md) [v8](https://github.com/tractorjuice/arckit-test-project-v8-ons-data-platform/blob/main/projects/001-ons-data-platform-modernisation/tcop-review.md) [v9](https://github.com/tractorjuice/arckit-test-project-v9-cabinet-office-genai/blob/main/projects/001-cabinet-office-genai/tcop-review.md) [v11](https://github.com/tractorjuice/arckit-test-project-v11-national-highways-data/blob/main/projects/001-national-highways-data-architecture-modernization/tcop-assessment.md) | 🔵 Beta |
| `/arckit.secure` | Generate a Secure by Design assessment for UK Government projects (civilian departments) | [v8](https://github.com/tractorjuice/arckit-test-project-v8-ons-data-platform/blob/main/projects/001-ons-data-platform-modernisation/ukgov-secure-by-design.md) [v9](https://github.com/tractorjuice/arckit-test-project-v9-cabinet-office-genai/blob/main/projects/001-cabinet-office-genai/ukgov-secure-by-design.md) [v11](https://github.com/tractorjuice/arckit-test-project-v11-national-highways-data/blob/main/projects/001-national-highways-data-architecture-modernization/ukgov-secure-by-design.md) | 🔵 Beta |
| `/arckit.ai-playbook` | Assess UK Government AI Playbook compliance for responsible AI deployment | [v9](https://github.com/tractorjuice/arckit-test-project-v9-cabinet-office-genai/blob/main/projects/001-cabinet-office-genai/ai-playbook-assessment.md) | 🟠 Alpha |
| `/arckit.atrs` | Generate Algorithmic Transparency Recording Standard (ATRS) record for AI/algorithmic tools | [v2](https://github.com/tractorjuice/arckit-test-project-v2-hmrc-chatbot/blob/main/projects/001-hmrc-chatbot/atrs-record.md) [v9](https://github.com/tractorjuice/arckit-test-project-v9-cabinet-office-genai/blob/main/projects/001-cabinet-office-genai/atrs-record.md) | 🟠 Alpha |

### UK MOD

| Command | Description | Examples | Status |
|---------|-------------|----------|--------|
| `/arckit.mod-secure` | Generate a MOD Secure by Design assessment for UK Ministry of Defence projects using CAAT and continuous assurance | [v3/001](https://github.com/tractorjuice/arckit-test-project-v3-windows11/blob/main/projects/001-windows-11-migration-intune/mod-secure-by-design.md) [v3/006](https://github.com/tractorjuice/arckit-test-project-v3-windows11/blob/main/projects/006-large-format-printer/mod-secure-by-design.md) | 🟣 Experimental |
| `/arckit.jsp-936` | Generate MOD JSP 936 AI assurance documentation for defence AI/ML systems | — | 🟣 Experimental |

### Documentation & Publishing

| Command | Description | Examples | Status |
|---------|-------------|----------|--------|
| `/arckit.pages` | Generate GitHub Pages documentation site with Mermaid diagram support | — | 🟠 Alpha |

---

## Wardley Mapping for Strategic Architecture

ArcKit uses Wardley Maps to expose the strategic position of every component before you commit to a solution. The `/arckit.wardley` command produces ready-to-visualise maps that:
- Trace user needs through the supporting value chain so gaps and duplicated effort are obvious.
- Plot evolution from Genesis → Commodity to reveal when to build, buy, reuse, or retire capabilities.
- Feed procurement, vendor evaluation, and design reviews with shared situational awareness.

Maps are emitted in the Open Wardley Map format — paste them straight into [https://create.wardleymaps.ai](https://create.wardleymaps.ai) for a visual view. Full example outputs live in the public demos such as `arckit-test-project-v1-m365` (cloud migration strategy) and `arckit-test-project-v8-cabinet-office-genai` (cross-government GenAI platform).

---

## Architecture Diagrams with Mermaid

**ArcKit generates visual architecture diagrams using Mermaid for clear technical communication.**

### What are Architecture Diagrams?

Architecture diagrams visualize system structure, interactions, and deployment for:
- **Technical Communication**: Share architecture with stakeholders
- **Design Documentation**: Document current and future state
- **Vendor Evaluation**: Compare vendor technical approaches
- **UK Government Compliance**: Visualize Cloud First, GOV.UK services, PII handling

### Diagram Types

ArcKit supports 6 essential diagram types based on the C4 Model and enterprise architecture best practices:

| Diagram Type | Level | Purpose | When to Use |
|--------------|-------|---------|-------------|
| **C4 Context** | Level 1 | System in context with users and external systems | After requirements, to show system boundaries |
| **C4 Container** | Level 2 | Technical containers and technology choices | After HLD, for vendor review |
| **C4 Component** | Level 3 | Internal components within a container | After DLD, for implementation |
| **Deployment** | Infrastructure | Cloud resources and network topology | Cloud First compliance, cost estimation |
| **Sequence** | Interaction | API flows and request/response patterns | Integration requirements, API design |
| **Data Flow** | Data | How data moves, PII handling, GDPR compliance | UK GDPR, DPIA requirements |

Use `/arckit.diagram` directly, or supply an explicit type such as `context`, `container`, `sequence`, or `dataflow`. Outputs bundle component inventories with Wardley evolution tags, built-in GOV.UK compliance scaffolding (Notify, Pay, Design System), Cloud First network patterns, GDPR annotations, and traceability back to requirements and tests. For full examples, browse the diagram folders in `arckit-test-project-v2-hmrc-chatbot` and `arckit-test-project-v6-patent-system`.

## ServiceNow Service Management Design

ArcKit turns architecture artefacts into an operations-ready ServiceNow pack. The `/arckit.servicenow` command builds:
- CMDB hierarchies, SLAs, and change risk straight from requirements, diagrams, and Wardley Maps.
- ITIL-aligned runbooks covering incident, change, monitoring, and transition activities.
- UK government extras such as GDS Service Standard, Technology Code of Practice, and GOV.UK Pay/Notify dependencies when relevant.

For full outputs, explore the public demos (for example `arckit-test-project-v7-nhs-appointment` and `arckit-test-project-v1-m365`) where the generated ServiceNow design files and checklists are published end-to-end.

---

## Documentation

Key references live in `docs/` and top-level guides:
- Quick tour: [docs/index.html](docs/index.html) mirrors the public landing page.
- Lifecycle visuals: [WORKFLOW-DIAGRAMS.md](WORKFLOW-DIAGRAMS.md) and [DEPENDENCY-MATRIX.md](DEPENDENCY-MATRIX.md) cover command flow and relationships.
- Core guides: [docs/principles.md](docs/principles.md), [docs/requirements.md](docs/requirements.md), [docs/procurement.md](docs/procurement.md), [docs/design-review.md](docs/design-review.md).
- Traceability: [docs/traceability.md](docs/traceability.md) documents end-to-end coverage patterns.

---

## Comparison to Other Tools

| Feature | ArcKit | Sparx EA | Ardoq | LeanIX | Confluence |
|---------|--------|----------|-------|--------|------------|
| **AI-Assisted** | ✅ | ❌ | ❌ | ❌ | ❌ |
| **Wardley Mapping** | ✅ | ❌ | ⚠️ Limited | ❌ | ❌ |
| **Version Control** | ✅ Git | ❌ | ❌ | ❌ | ⚠️ Limited |
| **Vendor RFP** | ✅ | ❌ | ❌ | ❌ | ⚠️ Manual |
| **Design Review Gates** | ✅ | ⚠️ Manual | ❌ | ❌ | ⚠️ Manual |
| **Traceability** | ✅ Automated | ⚠️ Manual | ✅ | ⚠️ Limited | ❌ |
| **Cost** | Free | $$$$ | $$$$ | $$$$ | $$ |
| **Learning Curve** | Low | High | Medium | Medium | Low |

---

## Requirements

- **Python 3.11+**
- **Git** (optional but recommended)
- **AI Coding Agent**: Claude Code, OpenAI Codex CLI, or Gemini CLI
- **uv** for package management: [Install uv](https://docs.astral.sh/uv/)

---

## Installation from Source

```bash
# Clone the repository
git clone https://github.com/tractorjuice/arc-kit.git
cd arc-kit

# Install in development mode
pip install -e .

# Run the CLI
arckit init my-project
```

---

## Documentation

Full guidance lives in `docs/` and the static site.
- Quick tour: [docs/index.html](docs/index.html) (mirrors the public landing page).
- Core guides: [docs/principles.md](docs/principles.md), [docs/requirements.md](docs/requirements.md), [docs/procurement.md](docs/procurement.md), [docs/design-review.md](docs/design-review.md).
- Reference packs: [WORKFLOW-DIAGRAMS.md](WORKFLOW-DIAGRAMS.md) and [DEPENDENCY-MATRIX.md](DEPENDENCY-MATRIX.md) cover lifecycle visualisations and the 40×40 command matrix.
- Traceability: [docs/traceability.md](docs/traceability.md) documents end-to-end requirements coverage.

## Relationship to Spec Kit

ArcKit is inspired by [Spec Kit](https://github.com/github/spec-kit) but targets a different audience:

| | Spec Kit | ArcKit |
|---|----------|--------|
| **Audience** | Product Managers, Developers | Enterprise Architects, Procurement |
| **Focus** | Feature development (0→1 code generation) | Architecture governance & vendor management |
| **Workflow** | Spec → Plan → Tasks → Code | Requirements → RFP → Design Review → Traceability |
| **Output** | Working code | Architecture documentation & governance |

---

## Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

**Areas we need help**:
- Integration with enterprise tools (Jira, Azure DevOps)
- Additional AI agent support
- Template improvements based on real-world usage
- Documentation and examples
- ServiceNow API integration for automated CI creation

---

## Troubleshooting

### Token Limit Error

If you see: `API Error: Claude's response exceeded the 32000 output token maximum`

**The Problem**: ArcKit generates large documents that can exceed Claude's 32K token output limit.

**⚠️ IMPORTANT**: Your Claude subscription plan determines the maximum tokens:
- 🔴 Free/Pro plans: **32K max** (cannot be increased)
- ✅ Team/Enterprise plans: Can increase to 64K via environment variable

**Solutions**:

1. **For Team/Enterprise plans** - Increase token limit:
   ```bash
   export CLAUDE_CODE_MAX_OUTPUT_TOKENS=64000
   ```

2. **For ALL plans** (including Free/Pro) - Use **Write tool strategy**:
   ```
   User: /arckit.requirements but write directly to file using Write tool, show me only a summary
   ```

   This tells Claude to use the Write tool to create the file (doesn't count toward output tokens) and only show you a summary.

**Which commands are affected?**
- 🔴 HIGH RISK: `/arckit.research`, `/arckit.sobc`, `/arckit.requirements`, `/arckit.data-model`, `/arckit.sow`
- 🟡 MEDIUM RISK: `/arckit.risk`, `/arckit.evaluation`, `/arckit.principles`

**See full guide**: [docs/TOKEN-LIMITS.md](docs/TOKEN-LIMITS.md)

### Common Issues

**Command not found**: Ensure Claude Code is installed and commands are loaded
```bash
# Check if .claude/commands/ directory exists
ls .claude/commands/
```

**Template not found**: Ensure you've run `/arckit.principles` first
```bash
# Check if templates exist
ls templates/
```

**Project creation fails**: Ensure you have an ArcKit repository initialized
```bash
# Initialize if needed
arckit init .
```

---

## Support

- **Issues**: [GitHub Issues](https://github.com/tractorjuice/arc-kit/issues)
- **Releases**: [GitHub Releases](https://github.com/tractorjuice/arc-kit/releases)
- **Latest Version**: [v0.10.0](https://github.com/tractorjuice/arc-kit/releases/tag/v0.10.0)

---

## License

MIT License - see [LICENSE](LICENSE) for details

---

## Acknowledgements

ArcKit is inspired by the methodology and patterns from [Spec Kit](https://github.com/github/spec-kit), adapted for enterprise architecture governance workflows.

---

<p align="center">
  <img src="docs/assets/ArcKit_Logo_Horizontal_Dark.svg" alt="ArcKit" height="40">
</p>

<p align="center">
  <strong>Built with ❤️ for enterprise architects who want systematic, AI-assisted governance.</strong>
</p>
