# The ArcKit Workflow, Phase by Phase

> **Guide Origin**: Official | **ArcKit Version**: [VERSION]

ArcKit's commands follow the order a project is governed in: plan, principles, stakeholders, risk, business case, requirements, research, procurement, design review, delivery and assurance. This guide goes through each phase: the command to run, what it produces and what it draws on.

You don't have to run every phase. Each command says what it needs first, and `/arckit:navigator` shows what a project has and what to run next. Every output is a draft for a qualified person to review.

## Phase 0: Project Planning

**`/arckit:plan`** → Create project plan with timeline, phases, and gates

Visualize your entire project delivery:

- GDS Agile Delivery phases (Discovery → Alpha → Beta → Live)
- Mermaid Gantt chart with timeline, dependencies, and milestones
- Workflow diagram showing gates and decision points
- Tailored timeline based on project complexity
- Integration of all ArcKit commands into schedule
- Gate approval criteria for governance

## Phase 1: Establish Governance

**`/arckit:principles`** → Create enterprise architecture principles

Define your organisation's architecture standards:

- Cloud strategy (AWS/Azure/GCP)
- Security frameworks (Zero Trust, compliance)
- Technology standards
- FinOps and cost governance

## Phase 2: Stakeholder Analysis

**`/arckit:stakeholders`** → Analyze stakeholder drivers, goals, and outcomes

**Do this BEFORE business case** to understand who cares about the project and why:

- Identify all stakeholders (internal and external)
- Document underlying drivers (strategic, operational, financial, compliance, risk, personal)
- Map drivers to SMART goals
- Map goals to measurable outcomes
- Create Stakeholder → Driver → Goal → Outcome traceability
- Identify conflicts and synergies
- Define engagement and communication strategies

## Phase 3: Risk Assessment

**`/arckit:risk`** → Create comprehensive risk register (Orange Book)

**Do this BEFORE business case** to identify and assess risks systematically:

- Follow HM Treasury Orange Book 2023 framework
- Identify risks across 6 categories (Strategic, Operational, Financial, Compliance, Reputational, Technology)
- Assess inherent risk (before controls) and residual risk (after controls)
- Apply 4Ts response framework (Tolerate, Treat, Transfer, Terminate)
- Link every risk to stakeholder from RACI matrix
- Monitor risk appetite compliance
- Feed into SOBC Management Case Part E

## Phase 4: Business Case Justification

**`/arckit:sobc`** → Create Strategic Outline Business Case (SOBC)

**Do this BEFORE requirements** to justify investment and secure approval:

- Use HM Treasury Green Book 5-case model (Strategic, Economic, Commercial, Financial, Management)
- Analyze strategic options (Do Nothing, Minimal, Balanced, Comprehensive)
- Map benefits to stakeholder goals (complete traceability)
- Provide high-level cost estimates (Rough Order of Magnitude)
- Economic appraisal (ROI range, payback period)
- Procurement and funding strategy
- Governance and risk management (uses risk register)
- Enable go/no-go decision BEFORE detailed requirements work

## Phase 5: Define Requirements

**`/arckit:requirements`** → Document comprehensive requirements

Create detailed requirements **informed by stakeholder goals** (if SOBC approved):

- Business requirements with rationale
- Functional requirements with acceptance criteria
- Non-functional requirements (performance, security, scalability, compliance)
- Integration requirements (upstream/downstream systems)
- Data requirements (DR-xxx)
- Success criteria and KPIs

## Phase 5.3: Platform Strategy Design (Optional - for Multi-Sided Platforms)

**`/arckit:platform-design`** → Design multi-sided platform strategy using Platform Design Toolkit

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

## Phase 5.5: Data Modeling

**`/arckit:data-model`** → Create comprehensive data model with ERD

Create data model based on Data Requirements (DR-xxx):

- Visual Entity-Relationship Diagram (ERD) using Mermaid
- Detailed entity catalog with attributes, types, validation rules
- PII identification and GDPR/DPA 2018 compliance
- Data governance matrix (business owners, stewards, custodians)
- CRUD matrix showing component access patterns
- Data integration mapping (upstream sources, downstream consumers)
- Data quality framework with measurable metrics
- Requirements traceability (DR-xxx → Entity → Attribute)

## Phase 5.7: Data Protection Impact Assessment

**`/arckit:dpia`** → Generate [DPIA](https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/accountability-and-governance/data-protection-impact-assessments-dpias/) for UK GDPR Article 35 compliance

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

## Phase 5.8: Data Source Discovery

**`/arckit:datascout`** → Discover external data sources

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

## Phase 6: Technology Research

**`/arckit:research`** → Research technology, services, and products

Research the solutions available to meet requirements, with checked facts and published costs. It makes no build-or-buy decision: `/arckit:wardley` decides sourcing and `/arckit:sobc` appraises value for money.

- Dynamic category detection from requirements (authentication, payments, databases, etc.)
- Commercial SaaS options with pricing, reviews, and ratings (WebSearch)
- Open source alternatives with GitHub stats and community maturity
- UK Government GOV.UK platforms (One Login, Pay, Notify, Forms)
- Digital Marketplace suppliers (G-Cloud, DOS)
- Published 3-year costs, including supplier price documents on G-Cloud
- What each option meets and lacks against the requirements, all cited
- Market evidence for Wardley mapping (how many products cover each capability)
- Feeds into SOBC Economic Case (cost data)

## Phase 6.5: Grants & Funding Research

**`/arckit:grants`** → Research UK government grants, charitable funding, and accelerator programmes

Identify and evaluate funding opportunities with eligibility scoring:

- UK Innovate UK grants and R&D funding (e.g. Knowledge Transfer Partnerships, SBRI)
- UK Research and Innovation (UKRI) funding calls
- Charitable foundations and philanthropic funding (e.g. National Lottery Heritage Fund, Wellcome Trust)
- Accelerator and incubator programmes (e.g. DCMS, DSIT-backed cohorts)
- EU Horizon Europe successor funding open to UK entities
- Eligibility scoring matrix against project requirements and stakeholder profile
- Application timeline, deadlines, and award values
- Strategic fit assessment (alignment with project goals and public sector context)
- Outputs a structured GRNT funding opportunity register

## Phase 7: Strategic Planning with Wardley Mapping

**`/arckit:wardley`** → Create strategic Wardley Maps

Visualize strategic positioning with:

- Component evolution analysis (Genesis → Custom → Product → Commodity)
- Build vs Buy decision framework
- Vendor comparison and procurement strategy
- UK Government Digital Marketplace mapping
- Evolution predictions and strategic gameplay

## Phase 7.5: Strategic Roadmap

**`/arckit:roadmap`** → Create multi-year architecture roadmap

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

**Roadmap feeds into**: `/arckit:plan` for detailed phase execution, `/arckit:sobc` for investment business case, `/arckit:backlog` for prioritized user stories, `/arckit:strategy` for executive-level synthesis.

## Phase 7.6: Architecture Strategy Synthesis

**`/arckit:strategy`** → Synthesise strategic artifacts into executive-level Architecture Strategy

Create a comprehensive Architecture Strategy document that synthesises multiple strategic artifacts into a single coherent narrative:

- **Strategic vision**: 2-3 paragraphs articulating the transformation vision and success definition
- **Strategic drivers**: Summarised from stakeholder analysis with external drivers (regulatory, market, technology)
- **Guiding principles**: Key principles with strategic implications, compliance summary
- **Current state assessment**: Technology landscape, capability maturity baseline (L1-L5), technical debt, SWOT
- **Target state vision**: Future architecture, capability maturity targets, architecture vision diagram
- **Technology evolution**: Build vs buy decisions, technology radar (Adopt/Trial/Assess/Hold) from Wardley maps
- **Strategic themes**: 3-5 investment themes with objectives, initiatives, success criteria, principles alignment
- **Delivery roadmap summary**: Timeline, phases, milestones from roadmap artifact
- **Investment summary**: CAPEX/OPEX, NPV, IRR, payback period, benefits realisation from SOBC
- **Strategic risks**: Top risks with heat map, assumptions, constraints from risk register
- **Success metrics**: KPIs with baselines and year-over-year targets
- **Governance model**: Forums, decision rights, review cadence
- **Traceability**: Driver → Goal → Outcome → Theme → Principle → KPI chain

**Use this when**: You have multiple strategic artifacts (principles, stakeholders, wardley, roadmap, sobc) and need to create a single executive-level document that synthesises them into a coherent strategy. Ideal for Strategy Board presentations, executive briefings, or stakeholder communication.

**Unique requirement**: This is the only ArcKit command with TWO mandatory inputs (principles AND stakeholders). Strategy cannot be created without understanding both the decision framework and the stakeholder drivers.

**Strategy feeds into**: `/arckit:requirements` for detailed requirements, `/arckit:roadmap` for expanded timeline, `/arckit:plan` for project delivery.

## Phase 7.7: Architecture Decision Records

**`/arckit:adr`** → Document architectural decisions

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

**ADR feeds into**: `/arckit:diagram` (architecture diagrams reflect decisions), `/arckit:hld-review` and `/arckit:dld-review` (reviews verify decisions implemented), `/arckit:traceability` (decisions are key traceability artifacts).

## Phase 8: Vendor Procurement (if needed)

**`/arckit:sow`** → Generate Statement of Work (RFP)

Create RFP-ready documents with:

- Scope of work and deliverables
- Technical requirements
- Vendor qualifications
- Evaluation criteria
- Contract terms

**`/arckit:dos`** → Digital Outcomes and Specialists (DOS) procurement 🇬🇧

For UK public sector organizations needing custom development:

- Generate DOS-compliant procurement documentation
- Extract requirements from project artifacts (BR/FR/NFR/INT/DR)
- Essential vs desirable skills from requirements
- Success criteria (technology-agnostic)
- Evaluation framework (40% Technical, 30% Team, 20% Quality, 10% Value)
- Audit-ready documentation for Digital Marketplace

**`/arckit:gcloud-search`** → G-Cloud service search with live marketplace search 🇬🇧

For UK public sector organizations needing off-the-shelf cloud services:

- Generate G-Cloud requirements document
- **Live Digital Marketplace search** using WebSearch
- Find actual services with suppliers, prices, features, links
- Service comparison table with recommendations
- Shortlist top 3-5 matching services
- Links to Digital Marketplace guidance (gov.uk)

**`/arckit:gcloud-clarify`** → G-Cloud service validation and gap analysis 🇬🇧

Validate G-Cloud services and generate supplier clarification questions:

- **Systematic gap analysis** (MUST/SHOULD requirements vs service descriptions)
- Detect gaps: ✅ Confirmed, ⚠️ Ambiguous, ❌ Not mentioned
- Generate prioritised questions (🔴 Critical / 🟠 High / 🔵 Medium / 🟢 Low)
- Risk assessment matrix for each service
- Email templates for supplier engagement
- Evidence requirements specification
- Next steps checklist

**`/arckit:evaluate`** → Create vendor evaluation framework

Set up systematic scoring:

- Technical evaluation criteria (100 points)
- Cost evaluation methodology
- Reference check templates
- Decision matrix

**`/arckit:evaluate`** (compare mode) → Compare vendor proposals

Side-by-side analysis of:

- Technical approaches
- Cost breakdowns
- Risk assessments
- Value propositions

## Phase 9: Design Review

**`/arckit:hld-review`** → Review High-Level Design

Validate designs against:

- Architecture principles compliance
- Requirements coverage
- Security and compliance
- Scalability and resilience
- Operational readiness

**`/arckit:dld-review`** → Review Detailed Design

Implementation-ready validation:

- Component specifications
- API contracts (OpenAPI)
- Database schemas
- Security implementation
- Test strategy

## Phase 10: Sprint Planning

**`/arckit:backlog`** → Generate prioritised product backlog

Transform requirements into sprint-ready user stories:

- Convert requirements (BR/FR/NFR/INT/DR) to GDS-format user stories
- Multi-factor prioritization (MoSCoW + risk + value + dependencies)
- Organise into sprint plan with capacity balancing
- Generate traceability matrix (requirements → stories → sprints)
- Export to Jira/Azure DevOps (CSV) or custom tools (JSON)
- **Time savings**: 75%+ (4-6 weeks → 3-5 days)

**When to run**: After HLD approval, before Sprint 1 (Alpha → Beta transition)

## Phase 10.5: Backlog Export

**`/arckit:trello`** → Export product backlog to Trello

Push your backlog directly to Trello for sprint execution:

- Create Trello board with sprint-based lists (Product Backlog + per-sprint + In Progress + Done)
- Cards with priority labels, story points, and acceptance criteria checklists
- Colour-coded labels by MoSCoW priority and requirement type
- Rate-limit-aware Trello API integration
- Requires `TRELLO_API_KEY` and `TRELLO_TOKEN` environment variables

**When to run**: After `/arckit:backlog` generates the product backlog (requires JSON export)

## Phase 11: ServiceNow Service Management Design

**`/arckit:servicenow`** → Generate ServiceNow service design

Bridge architecture to operations:

- CMDB design (derived from architecture diagrams)
- SLA definitions (derived from NFRs)
- Incident management design
- Change management plan
- Monitoring and alerting plan
- Service transition plan

## Phase 12: Traceability

**`/arckit:traceability`** → Generate traceability matrix

Ensure complete coverage:

- Requirements → Design mapping
- Design → Test mapping
- Gap analysis and orphan detection
- Change impact tracking

## Phase 13: Quality Assurance

**`/arckit:analyze`** → Comprehensive governance quality analysis

Periodically assess governance quality across all artifacts:

- Architecture principles compliance
- Requirements coverage and traceability
- Stakeholder alignment verification
- Risk management completeness
- Design review quality
- Documentation completeness and quality
- Gap identification and recommendations

**When to use**: Run periodically (before milestones, design reviews, or procurement decisions) to identify gaps and ensure governance standards are maintained.

## Phase 14: Compliance Assessment (UK Government)

For UK Government and public sector projects:

**`/arckit:service-assessment`** → [GDS Service Standard](https://www.gov.uk/service-manual/service-assessments) assessment preparation

Prepare for mandatory GDS Service Standard assessments:

- Analyze evidence against all 14 Service Standard points
- Identify gaps for alpha, beta, or live assessments
- Generate RAG (Red/Amber/Green) ratings and overall readiness score
- Provide actionable recommendations with priorities and timelines
- Include assessment day preparation guidance
- Map ArcKit artifacts to Service Standard evidence requirements

Run at end of Discovery (for alpha prep), mid-Beta (for beta prep), or before Live to ensure readiness.

**`/arckit:tcop`** → [Technology Code of Practice](https://www.gov.uk/guidance/the-technology-code-of-practice) assessment

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

**`/arckit:secure`** → UK Government Secure by Design assessment

Security compliance assessment:

- NCSC Cloud Security Principles
- NCSC Cyber Assessment Framework (CAF)
- Cyber Essentials / Cyber Essentials Plus
- UK GDPR and DPA 2018 compliance
- Security architecture review
- Threat modeling

**`/arckit:ai-playbook`** → [UK Government AI Playbook](https://www.gov.uk/government/publications/ai-playbook-for-the-uk-government) compliance (for AI systems)

Responsible AI assessment:

- AI ethics principles
- Transparency and explainability
- Fairness and bias mitigation
- Data governance for AI
- Human oversight mechanisms
- Impact assessment

**`/arckit:atrs`** → [Algorithmic Transparency Recording Standard](https://www.gov.uk/government/collections/algorithmic-transparency-recording-standard-hub)

Generate ATRS record for algorithmic decision-making:

- Algorithm details and logic
- Purpose and use case
- Data sources and data quality
- Performance metrics and monitoring
- Impact assessment and mitigation

**For MOD Projects**:

**`/arckit:mod-secure`** → MOD Secure by Design assessment

MOD-specific security compliance:

- JSP 440 (Defence Project & Programme Management)
- Information Assurance Maturity Model (IAMM)
- MOD Security clearances and vetting
- STRAP classification handling
- Security Operating Procedures (SyOPs)
- Supplier attestation requirements

**`/arckit:jsp-936`** → [MOD JSP 936](https://www.gov.uk/government/publications/jsp-936-dependable-artificial-intelligence-ai-in-defence-part-1-directive) AI Assurance Documentation

For defence projects using AI/ML systems:

- JSP 936 (Dependable Artificial Intelligence in Defence)
- 5 Ethical Principles (Human-Centricity, Responsibility, Understanding, Bias & Harm Mitigation, Reliability)
- 5 Risk Classification Levels (Critical to Minor)
- 8 AI lifecycle phases (ArcKit's grouping of JSP 936 sections 6 and 7)
- Approval pathways (2PUS or Ministers by exception → Defence-Level → TLB-Level)
- RAISOs and Ethics Manager governance
- Human-AI teaming strategy and continuous monitoring

## Phase 14.5: Compliance Assessment (EU and French Government)

ArcKit includes commands for EU regulatory compliance and French public sector governance. These commands are applicable to organisations operating in the EU or under French jurisdiction — whether public sector or private.

### EU Regulations

**`/arckit:eu-rgpd`** → GDPR compliance assessment (Regulation 2016/679)

Assess personal data processing obligations:

- Legal basis determination (consent, contract, legitimate interest, legal obligation)
- Data subject rights implementation (access, erasure, portability, objection)
- CNIL registration and DPO obligations (France)
- Cross-border transfer safeguards (SCCs, BCRs, adequacy decisions)
- Integration with DPIA (`/arckit:dpia`) for high-risk processing

**`/arckit:eu-ai-act`** → EU AI Act compliance (Regulation 2024/1689)

Assess AI system obligations under the EU's risk-based AI framework:

- Risk classification (unacceptable / high-risk / limited-risk / minimal)
- High-risk system obligations: conformity assessment, CE marking, EUDB registration
- GPAI model obligations for providers of general-purpose AI
- Human oversight, transparency, and fundamental rights impact assessment
- Prohibited practices (social scoring, real-time biometric surveillance)

**`/arckit:eu-nis2`** → NIS2 Directive compliance (Directive 2022/2555)

Assess cybersecurity obligations for essential and important entities:

- Sector classification (Annex I Essential vs Annex II Important)
- French OIV/OSE designation under current law (OIV: Code de la défense; OSE: loi n° 2018-133, the NIS1 transposition), pending France's NIS2 transposition bill
- Governance, risk management, and incident reporting obligations
- Supply chain security and vulnerability disclosure
- ANSSI notification timeline (24h → 72h → 30-day final report)

**`/arckit:eu-dora`** → DORA compliance (Regulation 2022/2554) for financial entities

Digital Operational Resilience Act obligations for banks, insurers, and investment firms:

- ICT risk management framework (5 pillars)
- Major ICT-related incident classification and reporting (4h → 72h → monthly final)
- TLPT (Threat-Led Penetration Testing) requirements for significant institutions
- Third-party ICT provider management and critical provider designation
- Contractual requirements for ICT service agreements

**`/arckit:eu-cra`** → Cyber Resilience Act compliance (Regulation 2024/2847)

Mandatory cybersecurity requirements for products with digital elements (hardware + software):

- Product classification (Default / Important Class I / Critical Class II)
- 12 Annex I Part I security-by-design requirements
- SBOM in SPDX or CycloneDX format (mandatory)
- Vulnerability Disclosure Policy and 24h ENISA reporting
- Conformity assessment route (internal control vs notified body)
- Full application deadline: 11 December 2027

**`/arckit:eu-dsa`** → EU Digital Services Act compliance (Regulation 2022/2065)

Tiered obligations for online intermediary services:

- Provider classification (mere conduit / hosting / platform / VLOP / VLOSE)
- VLOP/VLOSE designation threshold: 45M monthly active EU users
- Content moderation, recommender system transparency, advertising obligations
- ARCOM as French Digital Services Coordinator (DSC)
- Systemic risk assessment and independent audit for VLOPs

**`/arckit:eu-data-act`** → EU Data Act compliance (Regulation 2023/2854)

Data sharing obligations for connected products and cloud providers:

- Role determination: manufacturer / data holder / DAPS / public sector body
- User data access rights (Chapter II) and B2B sharing (Chapter III)
- Cloud switching obligations (Chapter VI) — switching charges withdrawn from 12 January 2027
- Safeguards against unlawful international governmental access (Chapter VII, Article 32)
- Application date: 12 September 2025

### French Public Sector Governance

**`/arckit:fr-rgpd`** → French GDPR compliance with CNIL-specific requirements

Extends EU GDPR with French context:

- CNIL enforcement priorities and sector-specific guidelines
- French DPO registration and CNIL prior consultation obligations
- Biometric data processing under French law (CNIL authorisation required)

**`/arckit:fr-ebios`** → EBIOS Risk Manager methodology (ANSSI 2018)

French standard risk analysis for IS homologation:

- 5-workshop structure (Framework, Risk Sources, Strategic Scenarios, Operational Scenarios, Risk Treatment)
- OIV/OSE/public sector IS homologation evidence
- Attack path modelling and feared events
- Integration with PSSI and SecNumCloud qualification

**`/arckit:fr-anssi`** → ANSSI 42 Cybersecurity Hygiene Measures assessment

Assess compliance with ANSSI's foundational hygiene guide:

- 10 chapters: awareness and training, knowing the IS, authentication and access control, workstations, network, administration, mobile working, updates, monitoring/audit/response, going further
- ANSSI recommendations for hosting sensitive IS in the cloud (July 2024)
- Gap analysis with prioritised remediation (High / Medium / Low)
- Integration with EBIOS and PSSI

**`/arckit:fr-anssi-carto`** → ANSSI SI Cartography (4-level IS mapping)

Generate structured IS cartography following ANSSI's 4-level methodology:

- Level 1: Business processes and core missions
- Level 2: Application and data mapping
- Level 3: Server, database, and system inventory
- Level 4: Network topology, firewall rules, interconnections
- Attack surface summary and sensitive flow identification

**`/arckit:fr-secnumcloud`** → SecNumCloud qualification assessment

Assess cloud provider and customer obligations under ANSSI's SecNumCloud referential:

- Visa vs qualification distinction (only full qualification satisfies OIV/ministerial use)
- IS homologation prerequisites for SecNumCloud deployment
- SecNumCloud-compatible architecture requirements
- Procurement clauses for public-cloud contracts

**`/arckit:fr-dinum`** → DINUM digital doctrine assessment

Assess compliance with French digital government doctrine:

- RGI (Référentiel Général d'Interopérabilité) — interoperability standards
- RGAA (Référentiel Général d'Amélioration de l'Accessibilité) — accessibility
- Doctrine cloud (cloud native, cloud first, SecNumCloud for sensitive data)
- SILL (Socle Interministériel de Logiciels Libres) — recommended open source stack

**`/arckit:fr-marche-public`** → French public procurement (Code de la Commande Publique)

Generate procurement documentation compliant with French public contract law:

- Marché public thresholds and procedures (below/above EU thresholds)
- Requirements statement, award criteria, and security and sovereignty clauses for the consultation file
- Environmental award criterion and execution conditions (Code de la commande publique, since August 2026)
- ANSSI-qualified provider requirements (PACS, PASSI, PRIS, PDIS, PAMS)
- Digital State doctrine checklist (cloud, RGI, RGAA, RGESN, open source, GDPR)

**`/arckit:fr-pssi`** → PSSI (Politique de Sécurité des Systèmes d'Information)

Generate IS security policy for French public sector entities:

- 9-section structure approved by the Highest Authority (AA)
- 8 security domains (access management, network, workstations, applications, data protection, physical, business continuity, vulnerability management)
- RSSI, DPO, DSI, and FSSI roles
- Review cycle and integration with EBIOS and homologation

**`/arckit:fr-dr`** → Diffusion Restreinte (DR) handling compliance

Assess document and IS handling requirements under the DR administrative classification:

- II 901/SGDSN rules for DR document lifecycle
- Electronic storage, transmission, and physical handling obligations
- IS homologation for DR-processing systems
- Scope explicitly bounded: DR only — IGI 1300 (Secret or Très Secret) is out of scope

**`/arckit:fr-algorithme-public`** → French Public Algorithm Transparency Notice

Generate mandatory transparency notice under CRPA Art. L311-3-1:

- Scope determination: which automated decisions are covered
- Plain-language description per algorithm, parameters, and weights
- Human oversight mechanisms and appeal rights
- GDPR Art. 22 intersection (automated individual decisions)
- EU AI Act flagging for ML-based systems
- More legally binding than the UK ATRS equivalent

**`/arckit:fr-code-reuse`** → French Public Code Reuse Assessment (Circulaire PM n°6264/SG, 2021)

Assess code reuse obligations before building or procuring:

- code.gouv.fr search (French public code catalogue)
- SILL (Socle Interministériel de Logiciels Libres) — ministerially recommended open source
- EU public code alternatives (Joinup, European Commission repositories)
- Licence compatibility matrix (EUPL-1.2 recommended for public code publication)
- Decision matrix: reuse / fork / SILL adoption / procure / build
- Publication duty for source code (CRPA L300-2 / L312-1-1) and contribution-back for modified public code (Circulaire 2021)

## Phase 15: Project Story & Reporting

**`/arckit:story`** → Generate comprehensive project story

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

**`/arckit:presentation`** → Generate MARP slide deck from project artifacts

Create presentation slides from existing architecture artifacts:

- **MARP Format**: Markdown-based slides with `---` separators — exports to PDF, PPTX, or HTML
- **Focus Modes**: Executive (board-level), Technical (architecture detail), Stakeholder (benefits-focused), Procurement (RFP briefings)
- **Artifact-Driven**: Reads all available project artifacts and extracts key content into slides
- **Mermaid Diagrams**: Gantt charts, C4 diagrams, pie charts, and quadrant charts embedded natively
- **Configurable**: Choose slide count (6-8, 10-12, 15-20) and MARP theme (default, gaia, uncover)
- **Doc type code**: `PRES`

**When to use**: Before governance boards, stakeholder briefings, gate reviews, or quarterly portfolio presentations. Run after creating most project artifacts for the richest slide deck.

## Phase 16: Documentation Publishing

**`/arckit:pages`** → Generate documentation site

Publish all project documentation as an interactive website:

- **Static Site Generation**: Generates `docs/index.html` and `docs/manifest.json` — deployable to any static host (GitHub Pages, Netlify, Vercel, S3, etc.)
- **Mermaid Diagram Rendering**: All architecture diagrams render inline with mermaid.js
- **Project Navigation**: Sidebar with collapsible project tree, document categories, and version badges — documents with multiple versions show an inline dropdown selector
- **GOV.UK Styling**: Professional government design system styling
- **Document Index**: Manifest.json provides programmatic access to all artifacts
- **LLM Discovery**: Generates `docs/llms.txt` ([llmstxt.org](https://llmstxt.org/) format) so LLM agents and crawlers can index every artifact, guide, and project. Hand-curated `docs/llms.txt` files (without the ArcKit generation marker) are preserved on re-runs

**When to use**: When you want to share project documentation with stakeholders via a professional web interface, or to create a portfolio view of all architecture artifacts.
