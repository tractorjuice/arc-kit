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
- ☁️ Azure-specific research using Microsoft Learn MCP for authoritative documentation
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

**Latest Release**: [v1.1.0](https://github.com/tractorjuice/arc-kit/releases/tag/v1.1.0)

### Initialize a Project

```bash
# Create a new architecture governance project
arckit init payment-modernization --ai claude

# Or use OpenAI Codex CLI
arckit init payment-modernization --ai codex

# Install all AI formats (Claude, Gemini, Codex)
arckit init payment-modernization --all-ai

# Minimal install (skip docs and guides)
arckit init payment-modernization --ai claude --minimal

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
- **Cabinet Office GenAI Platform** — [arckit-test-project-v9-cabinet-office-genai](https://github.com/tractorjuice/arckit-test-project-v9-cabinet-office-genai): Cross-government GenAI platform with responsible AI guardrails.
- **UK Government Training Marketplace** — [arckit-test-project-v10-training-marketplace](https://github.com/tractorjuice/arckit-test-project-v10-training-marketplace): AI training procurement platform with multi-sided marketplace design.
- **National Highways Data Architecture** — [arckit-test-project-v11-national-highways-data](https://github.com/tractorjuice/arckit-test-project-v11-national-highways-data): Strategic road network data platform modernization.
- **Scottish Courts GenAI** — [arckit-test-project-v14-scottish-courts](https://github.com/tractorjuice/arckit-test-project-v14-scottish-courts): Scottish Courts and Tribunals Service GenAI strategy with comprehensive MLOps and FinOps.
- **Doctors Appointment System** — [arckit-test-project-v16-doctors-appointment](https://github.com/tractorjuice/arckit-test-project-v16-doctors-appointment): Online appointment booking system with NHS integration.
- **UK Fuel Price Transparency** — [arckit-test-project-v17-fuel-prices](https://github.com/tractorjuice/arckit-test-project-v17-fuel-prices): UK Government fuel price transparency service with real-time pricing data.

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

See the demo repositories for end-to-end examples, especially `arckit-test-project-v7-nhs-appointment` (civilian services) and `arckit-test-project-v9-cabinet-office-genai` (AI governance).

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
**`/arckit.dpia`** → Generate [DPIA](https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/accountability-and-governance/data-protection-impact-assessments-dpias/) for UK GDPR Article 35 compliance

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

### Phase 5.8: Data Source Discovery
**`/arckit.datascout`** → Discover external data sources

Discover and evaluate external data sources to fulfil project data requirements:
- Data needs extraction from DR/FR/INT/NFR requirements
- UK Government open data portals (data.gov.uk, ONS, NHS Digital, Companies House, OS Data Hub)
- Commercial API providers and data marketplaces
- Free/freemium APIs and open source datasets
- Weighted evaluation scoring (Requirements Fit, Data Quality, License & Cost, API Quality, Compliance, Reliability)
- Gap analysis for unmet data needs
- Data model impact assessment (new entities, attributes, sync strategy)
- Requirements traceability (every DR-xxx mapped to a source or flagged as gap)
- TCoP Point 10 compliance (Make Better Use of Data)

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

**`/arckit.service-assessment`** → [GDS Service Standard](https://www.gov.uk/service-manual/service-assessments) assessment preparation

Prepare for mandatory GDS Service Standard assessments:
- Analyze evidence against all 14 Service Standard points
- Identify gaps for alpha, beta, or live assessments
- Generate RAG (Red/Amber/Green) ratings and overall readiness score
- Provide actionable recommendations with priorities and timelines
- Include assessment day preparation guidance
- Map ArcKit artifacts to Service Standard evidence requirements

Run at end of Discovery (for alpha prep), mid-Beta (for beta prep), or before Live to ensure readiness.

**`/arckit.tcop`** → [Technology Code of Practice](https://www.gov.uk/guidance/the-technology-code-of-practice) assessment

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

**`/arckit.ai-playbook`** → [UK Government AI Playbook](https://www.gov.uk/government/publications/ai-playbook-for-the-uk-government) compliance (for AI systems)

Responsible AI assessment:
- AI ethics principles
- Transparency and explainability
- Fairness and bias mitigation
- Data governance for AI
- Human oversight mechanisms
- Impact assessment

**`/arckit.atrs`** → [Algorithmic Transparency Recording Standard](https://www.gov.uk/government/collections/algorithmic-transparency-recording-standard-hub)

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

**`/arckit.jsp-936`** → [MOD JSP 936](https://www.gov.uk/government/publications/jsp-936-dependable-artificial-intelligence-ai-in-defence-part-1-directive) AI Assurance Documentation

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
│   ├── scripts/
│   │   └── bash/                          # Automation scripts
│   └── templates/                         # Document templates
├── projects/
│   ├── 000-global/
│   │   └── ARC-000-PRIN-v1.0.md          # Global principles
│   └── 001-payment-gateway/
│       ├── ARC-001-STKE-v1.0.md           # Stakeholder analysis
│       ├── ARC-001-RISK-v1.0.md           # Risk register (Orange Book)
│       ├── ARC-001-SOBC-v1.0.md           # Strategic Outline Business Case
│       ├── ARC-001-REQ-v1.0.md            # Comprehensive requirements
│       ├── ARC-001-DATA-v1.0.md           # Data model with ERD, GDPR compliance
│       ├── wardley-maps/                   # Strategic Wardley Maps
│       │   ├── ARC-001-WARD-001-v1.0.md   # Current architecture positioning
│       │   ├── ARC-001-WARD-002-v1.0.md   # Target architecture vision
│       │   ├── ARC-001-WARD-003-v1.0.md   # Gap analysis
│       │   └── ARC-001-WARD-004-v1.0.md   # Build vs buy decisions
│       ├── ARC-001-SOW-v1.0.md            # Statement of Work (RFP)
│       ├── ARC-001-EVAL-v1.0.md           # Vendor evaluation framework
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
│       ├── ARC-001-SNOW-v1.0.md           # Service management design
│       ├── ARC-001-TRAC-v1.0.md           # Traceability matrix
│       └── final/
│           ├── selected-vendor.md
│           ├── approved-hld.md
│           └── dld/
└── .claude/commands/                      # AI assistant commands
```

---

## Complete Command Reference

All 42 ArcKit commands with maturity status and example outputs from public test repositories.

### Status Legend

| Status | Description |
|--------|-------------|
| 🟢 **Live** | Production-ready, extensively tested |
| 🔵 **Beta** | Feature-complete, actively refined |
| 🟠 **Alpha** | Working, limited testing |
| 🟣 **Experimental** | New in v0.11.x, early adopters |

### Example Repositories

| Code | Repository | Description |
|------|------------|-------------|
| v1 | [arckit-test-project-v1-m365](https://github.com/tractorjuice/arckit-test-project-v1-m365) | Microsoft 365 GCC-H Migration |
| v2 | [arckit-test-project-v2-hmrc-chatbot](https://github.com/tractorjuice/arckit-test-project-v2-hmrc-chatbot) | HMRC Tax Assistant Chatbot |
| v3 | [arckit-test-project-v3-windows11](https://github.com/tractorjuice/arckit-test-project-v3-windows11) | Windows 11 Enterprise Deployment |
| v6 | [arckit-test-project-v6-patent-system](https://github.com/tractorjuice/arckit-test-project-v6-patent-system) | IPO Patent Application System |
| v7 | [arckit-test-project-v7-nhs-appointment](https://github.com/tractorjuice/arckit-test-project-v7-nhs-appointment) | NHS Appointment Booking |
| v8 | [arckit-test-project-v8-ons-data-platform](https://github.com/tractorjuice/arckit-test-project-v8-ons-data-platform) | ONS Data Platform Modernisation |
| v9 | [arckit-test-project-v9-cabinet-office-genai](https://github.com/tractorjuice/arckit-test-project-v9-cabinet-office-genai) | Cabinet Office GenAI Platform |
| v10 | [arckit-test-project-v10-training-marketplace](https://github.com/tractorjuice/arckit-test-project-v10-training-marketplace) | UK Government Training Marketplace |
| v11 | [arckit-test-project-v11-national-highways-data](https://github.com/tractorjuice/arckit-test-project-v11-national-highways-data) | National Highways Data Architecture |
| v14 | [arckit-test-project-v14-scottish-courts](https://github.com/tractorjuice/arckit-test-project-v14-scottish-courts) | Scottish Courts GenAI Strategy |
| v16 | [arckit-test-project-v16-doctors-appointment](https://github.com/tractorjuice/arckit-test-project-v16-doctors-appointment) | Doctors Online Appointment System |
| v17 | [arckit-test-project-v17-fuel-prices](https://github.com/tractorjuice/arckit-test-project-v17-fuel-prices) | UK Government Fuel Price Transparency Service |

### Foundation

| Command | Description | Examples | Status |
|---------|-------------|----------|--------|
| `/arckit.plan` | Create project plan with timeline, phases, gates, and Mermaid diagrams | [v3/001](https://tractorjuice.github.io/arckit-test-project-v3-windows11/#projects/001-windows-11-migration-intune/ARC-001-PLAN-v1.0.md) [v3/002](https://tractorjuice.github.io/arckit-test-project-v3-windows11/#projects/002-application-packaging-rationalisation/ARC-002-PLAN-v1.0.md) [v3/004](https://tractorjuice.github.io/arckit-test-project-v3-windows11/#projects/004-conference-facilities-modernization/ARC-004-PLAN-v1.0.md) [v3/005](https://tractorjuice.github.io/arckit-test-project-v3-windows11/#projects/005-cloud-pki/ARC-005-PLAN-v1.0.md) [v8](https://tractorjuice.github.io/arckit-test-project-v8-ons-data-platform/#projects/001-ons-data-platform-modernisation/ARC-001-PLAN-v1.0.md) [v9](https://tractorjuice.github.io/arckit-test-project-v9-cabinet-office-genai/#projects/001-cabinet-office-genai/ARC-001-PLAN-v1.0.md) [v10](https://tractorjuice.github.io/arckit-test-project-v10-training-marketplace/#projects/001-ai-training-marketplace/ARC-001-PLAN-v1.0.md) [v11](https://tractorjuice.github.io/arckit-test-project-v11-national-highways-data/#projects/001-national-highways-data-architecture-modernization/ARC-001-PLAN-v1.0.md) [v14](https://tractorjuice.github.io/arckit-test-project-v14-scottish-courts/#projects/001-scts-genai-programme/ARC-001-PLAN-v1.0.md) [v17](https://tractorjuice.github.io/arckit-test-project-v17-fuel-prices/#projects/001-uk-fuel-price-transparency-service/ARC-001-PLAN-v1.0.md) | 🟢 Live |
| `/arckit.principles` | Create or update enterprise architecture principles | [v1](https://tractorjuice.github.io/arckit-test-project-v1-m365/#projects/000-global/ARC-000-PRIN-v1.0.md) [v2](https://tractorjuice.github.io/arckit-test-project-v2-hmrc-chatbot/#projects/000-global/ARC-000-PRIN-v1.0.md) [v3](https://tractorjuice.github.io/arckit-test-project-v3-windows11/#projects/000-global/ARC-000-PRIN-v1.0.md) [v6](https://tractorjuice.github.io/arckit-test-project-v6-patent-system/#projects/000-global/ARC-000-PRIN-v1.0.md) [v8](https://tractorjuice.github.io/arckit-test-project-v8-ons-data-platform/#projects/000-global/ARC-000-PRIN-v1.0.md) [v9](https://tractorjuice.github.io/arckit-test-project-v9-cabinet-office-genai/#projects/000-global/ARC-000-PRIN-v1.0.md) [v10](https://tractorjuice.github.io/arckit-test-project-v10-training-marketplace/#projects/000-global/ARC-000-PRIN-v1.0.md) [v11](https://tractorjuice.github.io/arckit-test-project-v11-national-highways-data/#projects/000-global/ARC-000-PRIN-v1.0.md) [v7](https://tractorjuice.github.io/arckit-test-project-v7-nhs-appointment/#projects/000-global/ARC-000-PRIN-v1.0.md) [v14](https://tractorjuice.github.io/arckit-test-project-v14-scottish-courts/#projects/000-global/ARC-000-PRIN-v1.0.md) [v16](https://tractorjuice.github.io/arckit-test-project-v16-doctors-appointment/#projects/000-global/ARC-000-PRIN-v1.0.md) [v17](https://tractorjuice.github.io/arckit-test-project-v17-fuel-prices/#projects/000-global/ARC-000-PRIN-v1.0.md) [v18](https://tractorjuice.github.io/arckit-test-project-v18-smart-meter/#projects/000-global/ARC-000-PRIN-v1.0.md) | 🟢 Live |

### Strategic Context

| Command | Description | Examples | Status |
|---------|-------------|----------|--------|
| `/arckit.stakeholders` | Analyze stakeholder drivers, goals, and measurable outcomes | [v1](https://tractorjuice.github.io/arckit-test-project-v1-m365/#projects/001-exchange-online-migration/ARC-001-STKE-v1.0.md) [v3/001](https://tractorjuice.github.io/arckit-test-project-v3-windows11/#projects/001-windows-11-migration-intune/ARC-001-STKE-v1.0.md) [v3/003](https://tractorjuice.github.io/arckit-test-project-v3-windows11/#projects/003-peripherals-update-upgrade/ARC-003-STKE-v1.0.md) [v3/004](https://tractorjuice.github.io/arckit-test-project-v3-windows11/#projects/004-conference-facilities-modernization/ARC-004-STKE-v1.0.md) [v3/005](https://tractorjuice.github.io/arckit-test-project-v3-windows11/#projects/005-cloud-pki/ARC-005-STKE-v1.0.md) [v6](https://tractorjuice.github.io/arckit-test-project-v6-patent-system/#projects/001-patent-management-system-for-the-intellectual-property-office/ARC-001-STKE-v1.0.md) [v8](https://tractorjuice.github.io/arckit-test-project-v8-ons-data-platform/#projects/001-ons-data-platform-modernisation/ARC-001-STKE-v1.0.md) [v9](https://tractorjuice.github.io/arckit-test-project-v9-cabinet-office-genai/#projects/001-cabinet-office-genai/ARC-001-STKE-v1.0.md) [v10](https://tractorjuice.github.io/arckit-test-project-v10-training-marketplace/#projects/001-ai-training-marketplace/ARC-001-STKE-v1.0.md) [v11](https://tractorjuice.github.io/arckit-test-project-v11-national-highways-data/#projects/001-national-highways-data-architecture-modernization/ARC-001-STKE-v1.0.md) [v14](https://tractorjuice.github.io/arckit-test-project-v14-scottish-courts/#projects/001-scts-genai-programme/ARC-001-STKE-v1.0.md) [v16](https://tractorjuice.github.io/arckit-test-project-v16-doctors-appointment/#projects/001-doctors-appointment/ARC-001-STKE-v1.0.md) [v17](https://tractorjuice.github.io/arckit-test-project-v17-fuel-prices/#projects/001-uk-fuel-price-transparency-service/ARC-001-STKE-v1.0.md) [v18](https://tractorjuice.github.io/arckit-test-project-v18-smart-meter/#projects/001-smart-meter-app/ARC-001-STKE-v1.0.md) | 🟢 Live |
| `/arckit.risk` | Create comprehensive risk register following HM Treasury Orange Book principles | [v3/001](https://tractorjuice.github.io/arckit-test-project-v3-windows11/#projects/001-windows-11-migration-intune/ARC-001-RISK-v1.0.md) [v3/003](https://tractorjuice.github.io/arckit-test-project-v3-windows11/#projects/003-peripherals-update-upgrade/ARC-003-RISK-v1.0.md) [v3/004](https://tractorjuice.github.io/arckit-test-project-v3-windows11/#projects/004-conference-facilities-modernization/ARC-004-RISK-v1.0.md) [v8](https://tractorjuice.github.io/arckit-test-project-v8-ons-data-platform/#projects/001-ons-data-platform-modernisation/ARC-001-RISK-v1.0.md) [v9](https://tractorjuice.github.io/arckit-test-project-v9-cabinet-office-genai/#projects/001-cabinet-office-genai/ARC-001-RISK-v1.0.md) [v11](https://tractorjuice.github.io/arckit-test-project-v11-national-highways-data/#projects/001-national-highways-data-architecture-modernization/ARC-001-RISK-v1.0.md) [v14](https://tractorjuice.github.io/arckit-test-project-v14-scottish-courts/#projects/001-scts-genai-programme/ARC-001-RISK-v1.0.md) [v16](https://tractorjuice.github.io/arckit-test-project-v16-doctors-appointment/#projects/001-doctors-appointment/ARC-001-RISK-v1.0.md) [v17](https://tractorjuice.github.io/arckit-test-project-v17-fuel-prices/#projects/001-uk-fuel-price-transparency-service/ARC-001-RISK-v1.0.md) [v18](https://tractorjuice.github.io/arckit-test-project-v18-smart-meter/#projects/001-smart-meter-app/ARC-001-RISK-v1.0.md) | 🟢 Live |
| `/arckit.sobc` | Create Strategic Outline Business Case (SOBC) using UK Government Green Book 5-case model | [v3](https://tractorjuice.github.io/arckit-test-project-v3-windows11/#projects/001-windows-11-migration-intune/ARC-001-SOBC-v1.0.md) [v8](https://tractorjuice.github.io/arckit-test-project-v8-ons-data-platform/#projects/001-ons-data-platform-modernisation/ARC-001-SOBC-v1.0.md) [v9](https://tractorjuice.github.io/arckit-test-project-v9-cabinet-office-genai/#projects/001-cabinet-office-genai/ARC-001-SOBC-v1.0.md) | 🟢 Live |

### Requirements & Data

| Command | Description | Examples | Status |
|---------|-------------|----------|--------|
| `/arckit.requirements` | Create comprehensive business and technical requirements | [v1](https://tractorjuice.github.io/arckit-test-project-v1-m365/#projects/001-exchange-online-migration/ARC-001-REQ-v1.0.md) [v2](https://tractorjuice.github.io/arckit-test-project-v2-hmrc-chatbot/#projects/001-hmrc-chatbot/ARC-001-REQ-v1.0.md) [v3/001](https://tractorjuice.github.io/arckit-test-project-v3-windows11/#projects/001-windows-11-migration-intune/ARC-001-REQ-v1.0.md) [v3/002](https://tractorjuice.github.io/arckit-test-project-v3-windows11/#projects/002-application-packaging-rationalisation/ARC-002-REQ-v1.0.md) [v3/003](https://tractorjuice.github.io/arckit-test-project-v3-windows11/#projects/003-peripherals-update-upgrade/ARC-003-REQ-v1.0.md) [v3/004](https://tractorjuice.github.io/arckit-test-project-v3-windows11/#projects/004-conference-facilities-modernization/ARC-004-REQ-v1.0.md) [v3/005](https://tractorjuice.github.io/arckit-test-project-v3-windows11/#projects/005-cloud-pki/ARC-005-REQ-v1.0.md) [v3/006](https://tractorjuice.github.io/arckit-test-project-v3-windows11/#projects/006-large-format-printer/ARC-006-REQ-v1.0.md) [v3/007](https://tractorjuice.github.io/arckit-test-project-v3-windows11/#projects/007-vpn-service-windows11-autopilot/ARC-007-REQ-v1.0.md) [v6](https://tractorjuice.github.io/arckit-test-project-v6-patent-system/#projects/001-patent-management-system-for-the-intellectual-property-office/ARC-001-REQ-v1.0.md) [v8](https://tractorjuice.github.io/arckit-test-project-v8-ons-data-platform/#projects/001-ons-data-platform-modernisation/ARC-001-REQ-v1.0.md) [v9](https://tractorjuice.github.io/arckit-test-project-v9-cabinet-office-genai/#projects/001-cabinet-office-genai/ARC-001-REQ-v1.0.md) [v10](https://tractorjuice.github.io/arckit-test-project-v10-training-marketplace/#projects/001-ai-training-marketplace/ARC-001-REQ-v1.0.md) [v11](https://tractorjuice.github.io/arckit-test-project-v11-national-highways-data/#projects/001-national-highways-data-architecture-modernization/ARC-001-REQ-v1.0.md) [v7](https://tractorjuice.github.io/arckit-test-project-v7-nhs-appointment/#projects/001-nhs-appointment-booking/ARC-001-REQ-v1.0.md) [v14](https://tractorjuice.github.io/arckit-test-project-v14-scottish-courts/#projects/001-scts-genai-programme/ARC-001-REQ-v1.0.md) [v16](https://tractorjuice.github.io/arckit-test-project-v16-doctors-appointment/#projects/001-doctors-appointment/ARC-001-REQ-v1.0.md) [v17](https://tractorjuice.github.io/arckit-test-project-v17-fuel-prices/#projects/001-uk-fuel-price-transparency-service/ARC-001-REQ-v1.0.md) [v18](https://tractorjuice.github.io/arckit-test-project-v18-smart-meter/#projects/001-smart-meter-app/ARC-001-REQ-v1.0.md) | 🟢 Live |
| `/arckit.data-model` | Create comprehensive data model with entity relationships, GDPR compliance, and data governance | [v3/001](https://tractorjuice.github.io/arckit-test-project-v3-windows11/#projects/001-windows-11-migration-intune/ARC-001-DATA-v1.0.md) [v3/002](https://tractorjuice.github.io/arckit-test-project-v3-windows11/#projects/002-application-packaging-rationalisation/ARC-002-DATA-v1.0.md) [v8](https://tractorjuice.github.io/arckit-test-project-v8-ons-data-platform/#projects/001-ons-data-platform-modernisation/ARC-001-DATA-v1.0.md) [v9](https://tractorjuice.github.io/arckit-test-project-v9-cabinet-office-genai/#projects/001-cabinet-office-genai/ARC-001-DATA-v1.0.md) [v10](https://tractorjuice.github.io/arckit-test-project-v10-training-marketplace/#projects/001-ai-training-marketplace/ARC-001-DATA-v1.0.md) [v11](https://tractorjuice.github.io/arckit-test-project-v11-national-highways-data/#projects/001-national-highways-data-architecture-modernization/ARC-001-DATA-v1.0.md) [v14](https://tractorjuice.github.io/arckit-test-project-v14-scottish-courts/#projects/001-scts-genai-programme/ARC-001-DATA-v1.0.md) [v16](https://tractorjuice.github.io/arckit-test-project-v16-doctors-appointment/#projects/001-doctors-appointment/ARC-001-DATA-v1.0.md) [v17](https://tractorjuice.github.io/arckit-test-project-v17-fuel-prices/#projects/001-uk-fuel-price-transparency-service/ARC-001-DATA-v1.0.md) | 🟢 Live |
| `/arckit.data-mesh-contract` | Create federated data product contracts for mesh architectures with SLAs, governance, and interoperability guarantees | — | 🟠 Alpha |
| `/arckit.dpia` | Generate [Data Protection Impact Assessment (DPIA)](https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/accountability-and-governance/data-protection-impact-assessments-dpias/) for UK GDPR Article 35 compliance | [v3](https://tractorjuice.github.io/arckit-test-project-v3-windows11/#projects/001-windows-11-migration-intune/ARC-001-DPIA-v1.0.md) [v8](https://tractorjuice.github.io/arckit-test-project-v8-ons-data-platform/#projects/001-ons-data-platform-modernisation/ARC-001-DPIA-v1.0.md) [v9](https://tractorjuice.github.io/arckit-test-project-v9-cabinet-office-genai/#projects/001-cabinet-office-genai/ARC-001-DPIA-v1.0.md) [v14](https://tractorjuice.github.io/arckit-test-project-v14-scottish-courts/#projects/001-scts-genai-programme/ARC-001-DPIA-v1.0.md) [v16](https://tractorjuice.github.io/arckit-test-project-v16-doctors-appointment/#projects/001-doctors-appointment/ARC-001-DPIA-v1.0.md) [v17](https://tractorjuice.github.io/arckit-test-project-v17-fuel-prices/#projects/001-uk-fuel-price-transparency-service/ARC-001-DPIA-v1.0.md) | 🔵 Beta |

### Research & Strategy

| Command | Description | Examples | Status |
|---------|-------------|----------|--------|
| `/arckit.platform-design` | Create platform strategy using Platform Design Toolkit (8 canvases for multi-sided ecosystems) | [v8](https://tractorjuice.github.io/arckit-test-project-v8-ons-data-platform/#projects/001-ons-data-platform-modernisation/gaap-ecosystem-analysis.md) [v10](https://tractorjuice.github.io/arckit-test-project-v10-training-marketplace/#projects/001-ai-training-marketplace/ARC-001-PLAT-v1.0.md) | 🟣 Experimental |
| `/arckit.research` | Research technology, services, and products to meet requirements with build vs buy analysis | [v3/001](https://tractorjuice.github.io/arckit-test-project-v3-windows11/#projects/001-windows-11-migration-intune/ARC-001-RSCH-v1.0.md) [v3/002](https://tractorjuice.github.io/arckit-test-project-v3-windows11/#projects/002-application-packaging-rationalisation/ARC-002-RSCH-v1.0.md) [v14](https://tractorjuice.github.io/arckit-test-project-v14-scottish-courts/#projects/001-scts-genai-programme/research/ARC-001-RSCH-001-v1.0.md) [v17](https://tractorjuice.github.io/arckit-test-project-v17-fuel-prices/#projects/001-uk-fuel-price-transparency-service/ARC-001-RSCH-v1.0.md) [v18](https://tractorjuice.github.io/arckit-test-project-v18-smart-meter/#projects/001-smart-meter-app/ARC-001-RSCH-v1.0.md) | 🔵 Beta |
| `/arckit.wardley` | Create strategic Wardley Maps for architecture decisions and build vs buy analysis | [v3](https://tractorjuice.github.io/arckit-test-project-v3-windows11/#projects/001-windows-11-migration-intune/wardley-maps/ARC-001-WARD-001-v1.0.md) [v6](https://tractorjuice.github.io/arckit-test-project-v6-patent-system/#projects/001-patent-management-system-for-the-intellectual-property-office/wardley-maps/ARC-001-WARD-001-v1.0.md) [v11](https://tractorjuice.github.io/arckit-test-project-v11-national-highways-data/#projects/001-national-highways-data-architecture-modernization/wardley-maps/ARC-001-WARD-001-v1.0.md) [v14](https://tractorjuice.github.io/arckit-test-project-v14-scottish-courts/#projects/001-scts-genai-programme/wardley-maps/ARC-001-WARD-001-v1.0.md) | 🟣 Experimental |
| `/arckit.roadmap` | Create strategic architecture roadmap with multi-year timeline, capability evolution, and governance | [v3](https://tractorjuice.github.io/arckit-test-project-v3-windows11/#projects/001-windows-11-migration-intune/ARC-001-ROADMAP-v1.0.md) | 🔵 Beta |
| `/arckit.adr` | Document architectural decisions with options analysis and traceability | [v3/001](https://tractorjuice.github.io/arckit-test-project-v3-windows11/#projects/001-windows-11-migration-intune/decisions/ARC-001-ADR-001-v1.0.md) [v3/002](https://tractorjuice.github.io/arckit-test-project-v3-windows11/#projects/002-application-packaging-rationalisation/decisions/ARC-002-ADR-001-v1.0.md) [v3/003](https://tractorjuice.github.io/arckit-test-project-v3-windows11/#projects/003-peripherals-update-upgrade/decisions/ARC-003-ADR-001-v1.0.md) [v3/004](https://tractorjuice.github.io/arckit-test-project-v3-windows11/#projects/004-conference-facilities-modernization/decisions/ARC-004-ADR-001-v1.0.md) [v3/005](https://tractorjuice.github.io/arckit-test-project-v3-windows11/#projects/005-cloud-pki/decisions/ARC-005-ADR-001-v1.0.md) [v3/007](https://tractorjuice.github.io/arckit-test-project-v3-windows11/#projects/007-vpn-service-windows11-autopilot/decisions/ARC-007-ADR-001-v1.0.md) [v14](https://tractorjuice.github.io/arckit-test-project-v14-scottish-courts/#projects/001-scts-genai-programme/decisions/ARC-001-ADR-001-v1.0.md) | 🔵 Beta |

### Cloud Research (MCP)

These commands use [Model Context Protocol (MCP)](https://modelcontextprotocol.io/) servers to access authoritative cloud provider documentation in real-time. Each requires its respective MCP server to be installed.

| Command | Description | Examples | Status |
|---------|-------------|----------|--------|
| `/arckit.azure-research` | Research Azure services and architecture patterns using [Microsoft Learn MCP](https://www.npmjs.com/package/@anthropic/mcp-server-microsoft-docs) | [v3](https://tractorjuice.github.io/arckit-test-project-v3-windows11/#projects/001-windows-11-migration-intune/research/ARC-001-AZRS-v1.0.md) [v14](https://tractorjuice.github.io/arckit-test-project-v14-scottish-courts/#projects/001-scts-genai-programme/research/ARC-001-AZRS-v1.0.md) [v17](https://tractorjuice.github.io/arckit-test-project-v17-fuel-prices/#projects/001-uk-fuel-price-transparency-service/research/ARC-001-AZRS-v1.0.md) | 🟣 Experimental |
| `/arckit.aws-research` | Research AWS services and architecture patterns using [AWS Knowledge MCP](https://awslabs.github.io/mcp/servers/aws-knowledge-mcp-server) | [v14](https://tractorjuice.github.io/arckit-test-project-v14-scottish-courts/#projects/001-scts-genai-programme/research/ARC-001-AWRS-v1.0.md) [v17](https://tractorjuice.github.io/arckit-test-project-v17-fuel-prices/#projects/001-uk-fuel-price-transparency-service/research/ARC-001-AWRS-v1.0.md) | 🟣 Experimental |
| `/arckit.gcp-research` | Research Google Cloud services and architecture patterns (pending GCP documentation MCP server) | — | 🔮 Planned |

### Data Source Discovery

| Command | Description | Examples | Status |
|---------|-------------|----------|--------|
| `/arckit.datascout` | Discover external data sources (APIs, datasets, open data portals) to fulfil project requirements | — | 🟣 Experimental |

> **Note**: Google Cloud currently offers MCP servers for [resource management](https://docs.cloud.google.com/mcp/overview) (BigQuery, GKE, Compute Engine) but not documentation search. `/arckit.gcp-research` will be implemented when Google releases a documentation-focused MCP server equivalent to Microsoft Learn or AWS Knowledge MCP.

### Procurement

| Command | Description | Examples | Status |
|---------|-------------|----------|--------|
| `/arckit.sow` | Generate Statement of Work (SOW) / RFP document for vendor procurement | [v1](https://tractorjuice.github.io/arckit-test-project-v1-m365/#projects/001-exchange-online-migration/ARC-001-SOW-v1.0.md) [v2](https://tractorjuice.github.io/arckit-test-project-v2-hmrc-chatbot/#projects/001-hmrc-chatbot/ARC-001-SOW-v1.0.md) [v3/001](https://tractorjuice.github.io/arckit-test-project-v3-windows11/#projects/001-windows-11-migration-intune/ARC-001-SOW-v1.0.md) [v3/002](https://tractorjuice.github.io/arckit-test-project-v3-windows11/#projects/002-application-packaging-rationalisation/ARC-002-SOW-v1.0.md) [v3/003](https://tractorjuice.github.io/arckit-test-project-v3-windows11/#projects/003-peripherals-update-upgrade/ARC-003-SOW-v1.0.md) [v6](https://tractorjuice.github.io/arckit-test-project-v6-patent-system/#projects/001-patent-management-system-for-the-intellectual-property-office/ARC-001-SOW-v1.0.md) | 🟢 Live |
| `/arckit.dos` | Generate Digital Outcomes and Specialists (DOS) procurement documentation for UK Digital Marketplace | — | 🟣 Experimental |
| `/arckit.gcloud-search` | Find G-Cloud services on UK Digital Marketplace with live search and comparison | [v3](https://tractorjuice.github.io/arckit-test-project-v3-windows11/#projects/001-windows-11-migration-intune/ARC-001-GCLD-v1.0.md) | 🟣 Experimental |
| `/arckit.gcloud-clarify` | Analyze G-Cloud service gaps and generate supplier clarification questions | — | 🟣 Experimental |
| `/arckit.evaluate` | Create vendor evaluation framework and score vendor proposals | [v1](https://tractorjuice.github.io/arckit-test-project-v1-m365/#projects/001-exchange-online-migration/ARC-001-EVAL-v1.0.md) [v2](https://tractorjuice.github.io/arckit-test-project-v2-hmrc-chatbot/#projects/001-hmrc-chatbot/ARC-001-EVAL-v1.0.md) [v3/001](https://tractorjuice.github.io/arckit-test-project-v3-windows11/#projects/001-windows-11-migration-intune/ARC-001-EVAL-v1.0.md) [v3/002](https://tractorjuice.github.io/arckit-test-project-v3-windows11/#projects/002-application-packaging-rationalisation/ARC-002-EVAL-v1.0.md) [v3/003](https://tractorjuice.github.io/arckit-test-project-v3-windows11/#projects/003-peripherals-update-upgrade/ARC-003-EVAL-v1.0.md) [v3/005](https://tractorjuice.github.io/arckit-test-project-v3-windows11/#projects/005-cloud-pki/ARC-005-EVAL-v1.0.md) [v6](https://tractorjuice.github.io/arckit-test-project-v6-patent-system/#projects/001-patent-management-system-for-the-intellectual-property-office/ARC-001-EVAL-v1.0.md) | 🟢 Live |

### Design & Architecture

| Command | Description | Examples | Status |
|---------|-------------|----------|--------|
| `/arckit.diagram` | Generate architecture diagrams using Mermaid for visual documentation | [v1](https://tractorjuice.github.io/arckit-test-project-v1-m365/#projects/001-exchange-online-migration/diagrams/ARC-001-DIAG-001-v1.0.md) [v3/001](https://tractorjuice.github.io/arckit-test-project-v3-windows11/#projects/001-windows-11-migration-intune/diagrams/ARC-001-DIAG-001-v1.0.md) [v3/005](https://tractorjuice.github.io/arckit-test-project-v3-windows11/#projects/005-cloud-pki/diagrams/ARC-005-DIAG-001-v1.0.md) [v3/007](https://tractorjuice.github.io/arckit-test-project-v3-windows11/#projects/007-vpn-service-windows11-autopilot/diagrams/ARC-007-DIAG-001-v1.0.md) [v10](https://tractorjuice.github.io/arckit-test-project-v10-training-marketplace/#projects/001-ai-training-marketplace/diagrams/ARC-001-DIAG-001-v1.0.md) [v14](https://tractorjuice.github.io/arckit-test-project-v14-scottish-courts/#projects/001-scts-genai-programme/diagrams/ARC-001-DIAG-001-v1.0.md) [v17](https://tractorjuice.github.io/arckit-test-project-v17-fuel-prices/#projects/001-uk-fuel-price-transparency-service/diagrams/ARC-001-DIAG-001-v1.0.md) | 🟢 Live |
| `/arckit.hld-review` | Review High-Level Design (HLD) against architecture principles and requirements | [v3](https://tractorjuice.github.io/arckit-test-project-v3-windows11/#projects/001-windows-11-migration-intune/reviews/ARC-001-HLD-v1.0.md) [v14](https://tractorjuice.github.io/arckit-test-project-v14-scottish-courts/#projects/001-scts-genai-programme/reviews/ARC-001-HLD-v1.0.md) | 🔵 Beta |
| `/arckit.dld-review` | Review Detailed Design (DLD) for implementation readiness | — | 🔵 Beta |

### Operations

| Command | Description | Examples | Status |
|---------|-------------|----------|--------|
| `/arckit.backlog` | Generate prioritised product backlog from ArcKit artifacts - convert requirements to user stories, organise into sprints | [v3/001](https://tractorjuice.github.io/arckit-test-project-v3-windows11/#projects/001-windows-11-migration-intune/ARC-001-BLOG-v1.0.md) [v3/002](https://tractorjuice.github.io/arckit-test-project-v3-windows11/#projects/002-application-packaging-rationalisation/ARC-002-BLOG-v1.0.md) [v3/003](https://tractorjuice.github.io/arckit-test-project-v3-windows11/#projects/003-peripherals-update-upgrade/ARC-003-BLOG-v1.0.md) [v3/004](https://tractorjuice.github.io/arckit-test-project-v3-windows11/#projects/004-conference-facilities-modernization/ARC-004-BLOG-v1.0.md) [v9](https://tractorjuice.github.io/arckit-test-project-v9-cabinet-office-genai/#projects/001-cabinet-office-genai/ARC-001-BLOG-v1.0.md) [v14](https://tractorjuice.github.io/arckit-test-project-v14-scottish-courts/#projects/001-scts-genai-programme/ARC-001-BLOG-v1.0.md) [v17](https://tractorjuice.github.io/arckit-test-project-v17-fuel-prices/#projects/001-uk-fuel-price-transparency-service/ARC-001-BKLG-v1.0.md) | 🔵 Beta |
| `/arckit.servicenow` | Create comprehensive ServiceNow service design with CMDB, SLAs, incident management, and change control | [v3](https://tractorjuice.github.io/arckit-test-project-v3-windows11/#projects/001-windows-11-migration-intune/ARC-001-SNOW-v1.0.md) | 🔵 Beta |
| `/arckit.devops` | Create DevOps strategy with CI/CD pipelines, IaC, container orchestration, and developer experience | [v14](https://tractorjuice.github.io/arckit-test-project-v14-scottish-courts/#projects/001-scts-genai-programme/ARC-001-DEVOPS-v1.0.md) | 🟣 Experimental |
| `/arckit.mlops` | Create MLOps strategy with model lifecycle, training pipelines, serving, monitoring, and governance | [v14](https://tractorjuice.github.io/arckit-test-project-v14-scottish-courts/#projects/001-scts-genai-programme/ARC-001-MLOPS-v1.0.md) | 🟣 Experimental |
| `/arckit.finops` | Create FinOps strategy with cloud cost management, optimization, governance, and forecasting | [v14](https://tractorjuice.github.io/arckit-test-project-v14-scottish-courts/#projects/001-scts-genai-programme/ARC-001-FINOPS-v1.0.md) | 🟣 Experimental |
| `/arckit.operationalize` | Create operational readiness pack with support model, runbooks, DR/BCP, on-call, and handover documentation | [v14](https://tractorjuice.github.io/arckit-test-project-v14-scottish-courts/#projects/001-scts-genai-programme/ARC-001-OPS-v1.0.md) | 🟣 Experimental |
| `/arckit.traceability` | Generate requirements traceability matrix from requirements to design to tests | [v1](https://tractorjuice.github.io/arckit-test-project-v1-m365/#projects/001-exchange-online-migration/ARC-001-TRAC-v1.0.md) [v2](https://tractorjuice.github.io/arckit-test-project-v2-hmrc-chatbot/#projects/001-hmrc-chatbot/ARC-001-TRAC-v1.0.md) [v3/001](https://tractorjuice.github.io/arckit-test-project-v3-windows11/#projects/001-windows-11-migration-intune/ARC-001-TRAC-v1.0.md) [v3/002](https://tractorjuice.github.io/arckit-test-project-v3-windows11/#projects/002-application-packaging-rationalisation/ARC-002-TRAC-v1.0.md) [v3/003](https://tractorjuice.github.io/arckit-test-project-v3-windows11/#projects/003-peripherals-update-upgrade/ARC-003-TRAC-v1.0.md) [v6](https://tractorjuice.github.io/arckit-test-project-v6-patent-system/#projects/001-patent-management-system-for-the-intellectual-property-office/ARC-001-TRAC-v1.0.md) [v9](https://tractorjuice.github.io/arckit-test-project-v9-cabinet-office-genai/#projects/001-cabinet-office-genai/ARC-001-TRAC-v1.0.md) [v14](https://tractorjuice.github.io/arckit-test-project-v14-scottish-courts/#projects/001-scts-genai-programme/ARC-001-TRAC-v1.0.md) | 🟢 Live |

### Quality & Governance

| Command | Description | Examples | Status |
|---------|-------------|----------|--------|
| `/arckit.analyze` | Perform comprehensive governance quality analysis across architecture artifacts | [v6](https://tractorjuice.github.io/arckit-test-project-v6-patent-system/#projects/001-patent-management-system-for-the-intellectual-property-office/ARC-001-ANAL-v1.0.md) [v9](https://tractorjuice.github.io/arckit-test-project-v9-cabinet-office-genai/#projects/001-cabinet-office-genai/ARC-001-ANAL-v1.0.md) [v11](https://tractorjuice.github.io/arckit-test-project-v11-national-highways-data/#projects/001-national-highways-data-architecture-modernization/ARC-001-ANAL-v1.0.md) [v14](https://tractorjuice.github.io/arckit-test-project-v14-scottish-courts/#projects/001-scts-genai-programme/ARC-001-ANAL-v1.0.md) | 🔵 Beta |
| `/arckit.principles-compliance` | Assess compliance with architecture principles and generate scorecard with evidence, gaps, and recommendations | [v3](https://tractorjuice.github.io/arckit-test-project-v3-windows11/#projects/001-windows-11-migration-intune/ARC-001-PRIN-COMP-v1.0.md) [v14](https://tractorjuice.github.io/arckit-test-project-v14-scottish-courts/#projects/001-scts-genai-programme/ARC-001-PRIN-COMP-v1.0.md) | 🟢 Live |
| `/arckit.story` | Generate comprehensive project story with timeline analysis, traceability, and governance achievements | [v3](https://tractorjuice.github.io/arckit-test-project-v3-windows11/#projects/001-windows-11-migration-intune/ARC-001-STORY-v1.0.md) [v8](https://tractorjuice.github.io/arckit-test-project-v8-ons-data-platform/#projects/001-ons-data-platform-modernisation/ARC-001-STORY-v1.0.md) [v9](https://tractorjuice.github.io/arckit-test-project-v9-cabinet-office-genai/#projects/001-cabinet-office-genai/ARC-001-STORY-v1.0.md) [v14](https://tractorjuice.github.io/arckit-test-project-v14-scottish-courts/#projects/001-scts-genai-programme/ARC-001-STORY-v1.0.md) | 🟢 Live |

### UK Government

| Command | Description | Examples | Status |
|---------|-------------|----------|--------|
| `/arckit.service-assessment` | Prepare for [GDS Service Standard](https://www.gov.uk/service-manual/service-assessments) assessment - analyze evidence against 14 points, identify gaps, generate readiness report | [v16](https://tractorjuice.github.io/arckit-test-project-v16-doctors-appointment/#projects/001-doctors-appointment/ARC-001-SASS-v1.0.md) | 🔵 Beta |
| `/arckit.tcop` | Generate a [Technology Code of Practice (TCoP)](https://www.gov.uk/guidance/the-technology-code-of-practice) review document for a UK Government technology project | [v6](https://tractorjuice.github.io/arckit-test-project-v6-patent-system/#projects/001-patent-management-system-for-the-intellectual-property-office/ARC-001-TCOP-v1.0.md) [v8](https://tractorjuice.github.io/arckit-test-project-v8-ons-data-platform/#projects/001-ons-data-platform-modernisation/ARC-001-TCOP-v1.0.md) [v9](https://tractorjuice.github.io/arckit-test-project-v9-cabinet-office-genai/#projects/001-cabinet-office-genai/ARC-001-TCOP-v1.0.md) [v11](https://tractorjuice.github.io/arckit-test-project-v11-national-highways-data/#projects/001-national-highways-data-architecture-modernization/ARC-001-TCOP-v1.0.md) [v14](https://tractorjuice.github.io/arckit-test-project-v14-scottish-courts/#projects/001-scts-genai-programme/ARC-001-TCOP-v1.0.md) | 🔵 Beta |
| `/arckit.secure` | Generate a Secure by Design assessment for UK Government projects (civilian departments) | [v8](https://tractorjuice.github.io/arckit-test-project-v8-ons-data-platform/#projects/001-ons-data-platform-modernisation/ARC-001-SECD-v1.0.md) [v9](https://tractorjuice.github.io/arckit-test-project-v9-cabinet-office-genai/#projects/001-cabinet-office-genai/ARC-001-SECD-v1.0.md) [v11](https://tractorjuice.github.io/arckit-test-project-v11-national-highways-data/#projects/001-national-highways-data-architecture-modernization/ARC-001-SECD-v1.0.md) [v14](https://tractorjuice.github.io/arckit-test-project-v14-scottish-courts/#projects/001-scts-genai-programme/ARC-001-SECD-v1.0.md) [v16](https://tractorjuice.github.io/arckit-test-project-v16-doctors-appointment/#projects/001-doctors-appointment/ARC-001-SECD-v1.0.md) [v17](https://tractorjuice.github.io/arckit-test-project-v17-fuel-prices/#projects/001-uk-fuel-price-transparency-service/ARC-001-SECD-v1.0.md) | 🔵 Beta |
| `/arckit.ai-playbook` | Assess [UK Government AI Playbook](https://www.gov.uk/government/publications/ai-playbook-for-the-uk-government) compliance for responsible AI deployment | [v9](https://tractorjuice.github.io/arckit-test-project-v9-cabinet-office-genai/#projects/001-cabinet-office-genai/ARC-001-AIPB-v1.0.md) [v14](https://tractorjuice.github.io/arckit-test-project-v14-scottish-courts/#projects/001-scts-genai-programme/ARC-001-AIPB-v1.0.md) | 🟠 Alpha |
| `/arckit.atrs` | Generate [Algorithmic Transparency Recording Standard (ATRS)](https://www.gov.uk/government/collections/algorithmic-transparency-recording-standard-hub) record for AI/algorithmic tools | [v2](https://tractorjuice.github.io/arckit-test-project-v2-hmrc-chatbot/#projects/001-hmrc-chatbot/ARC-001-ATRS-v1.0.md) [v9](https://tractorjuice.github.io/arckit-test-project-v9-cabinet-office-genai/#projects/001-cabinet-office-genai/ARC-001-ATRS-v1.0.md) [v14](https://tractorjuice.github.io/arckit-test-project-v14-scottish-courts/#projects/001-scts-genai-programme/ARC-001-ATRS-v1.0.md) | 🟠 Alpha |

### UK MOD

| Command | Description | Examples | Status |
|---------|-------------|----------|--------|
| `/arckit.mod-secure` | Generate a MOD Secure by Design assessment for UK Ministry of Defence projects using CAAT and continuous assurance | [v3/001](https://tractorjuice.github.io/arckit-test-project-v3-windows11/#projects/001-windows-11-migration-intune/ARC-001-SECD-MOD-v1.0.md) [v3/006](https://tractorjuice.github.io/arckit-test-project-v3-windows11/#projects/006-large-format-printer/ARC-006-SECD-MOD-v1.0.md) | 🟣 Experimental |
| `/arckit.jsp-936` | Generate [MOD JSP 936](https://www.gov.uk/government/publications/jsp-936-dependable-artificial-intelligence-ai-in-defence-part-1-directive) AI assurance documentation for defence AI/ML systems | — | 🟣 Experimental |

### Documentation & Publishing

| Command | Description | Examples | Status |
|---------|-------------|----------|--------|
| `/arckit.pages` | Generate GitHub Pages documentation site with Mermaid diagram support | [v1](https://tractorjuice.github.io/arckit-test-project-v1-m365/) [v2](https://tractorjuice.github.io/arckit-test-project-v2-hmrc-chatbot/) [v3](https://tractorjuice.github.io/arckit-test-project-v3-windows11/) [v6](https://tractorjuice.github.io/arckit-test-project-v6-patent-system/) [v7](https://tractorjuice.github.io/arckit-test-project-v7-nhs-appointment/) [v8](https://tractorjuice.github.io/arckit-test-project-v8-ons-data-platform/) [v9](https://tractorjuice.github.io/arckit-test-project-v9-cabinet-office-genai/) [v10](https://tractorjuice.github.io/arckit-test-project-v10-training-marketplace/) [v11](https://tractorjuice.github.io/arckit-test-project-v11-national-highways-data/) [v14](https://tractorjuice.github.io/arckit-test-project-v14-scottish-courts/) [v16](https://tractorjuice.github.io/arckit-test-project-v16-doctors-appointment/) [v17](https://tractorjuice.github.io/arckit-test-project-v17-fuel-prices/) [v18](https://tractorjuice.github.io/arckit-test-project-v18-smart-meter/) | 🟠 Alpha |

---

## Wardley Mapping for Strategic Architecture

ArcKit uses Wardley Maps to expose the strategic position of every component before you commit to a solution. The `/arckit.wardley` command produces ready-to-visualise maps that:
- Trace user needs through the supporting value chain so gaps and duplicated effort are obvious.
- Plot evolution from Genesis → Commodity to reveal when to build, buy, reuse, or retire capabilities.
- Feed procurement, vendor evaluation, and design reviews with shared situational awareness.

Maps are emitted in the Open Wardley Map format — paste them straight into [https://create.wardleymaps.ai](https://create.wardleymaps.ai) for a visual view. Full example outputs live in the public demos such as `arckit-test-project-v1-m365` (cloud migration strategy) and `arckit-test-project-v9-cabinet-office-genai` (cross-government GenAI platform).

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
- Core guides: [docs/guides/principles.md](docs/guides/principles.md), [docs/guides/requirements.md](docs/guides/requirements.md), [docs/guides/procurement.md](docs/guides/procurement.md), [docs/guides/design-review.md](docs/guides/design-review.md).
- Traceability: [docs/guides/traceability.md](docs/guides/traceability.md) documents end-to-end coverage patterns.

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
- Core guides: [docs/guides/principles.md](docs/guides/principles.md), [docs/guides/requirements.md](docs/guides/requirements.md), [docs/guides/procurement.md](docs/guides/procurement.md), [docs/guides/design-review.md](docs/guides/design-review.md).
- Reference packs: [WORKFLOW-DIAGRAMS.md](WORKFLOW-DIAGRAMS.md) and [DEPENDENCY-MATRIX.md](DEPENDENCY-MATRIX.md) cover lifecycle visualisations and the 42×42 command matrix.
- Traceability: [docs/guides/traceability.md](docs/guides/traceability.md) documents end-to-end requirements coverage.

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
- **Latest Version**: [v1.1.0](https://github.com/tractorjuice/arc-kit/releases/tag/v1.1.0)

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
