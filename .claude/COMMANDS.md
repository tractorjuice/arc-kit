# ArcKit Slash Commands Reference

Complete guide to all ArcKit slash commands for Claude Code.

## Quick Reference

| Command | Purpose | When to Use |
|---------|---------|-------------|
| `/arckit.plan` | Create project plan with timeline and gates | Project initiation, visualize full delivery |
| `/arckit.principles` | Create architecture principles | Start of organization/project |
| `/arckit.stakeholders` | Analyze stakeholder drivers, goals, and outcomes | After principles, BEFORE risk assessment |
| `/arckit.risk` | Create comprehensive risk register (Orange Book) | After stakeholders, BEFORE business case |
| `/arckit.sobc` | Create Strategic Outline Business Case (SOBC) | After risk assessment, BEFORE requirements |
| `/arckit.requirements` | Define comprehensive requirements | After SOBC approval, before data modeling |
| `/arckit.data-model` | Create comprehensive data model with ERD | After requirements, before vendor selection |
| `/arckit.dpia` | Generate Data Protection Impact Assessment | After data model when processing personal data |
| `/arckit.research` | Research technology and services for build vs buy | After requirements, inform procurement decisions |
| `/arckit.wardley` | Create strategic Wardley Maps | Strategic planning, build vs buy decisions |
| `/arckit.diagram` | Generate architecture diagrams (Mermaid) | Visualize system structure throughout project |
| `/arckit.gcloud-search` | Find G-Cloud services on UK Digital Marketplace | UK Gov procurement of off-the-shelf services |
| `/arckit.gcloud-clarify` | Generate supplier clarification questions | After G-Cloud search, validate service claims |
| `/arckit.dos` | Generate Digital Outcomes & Specialists docs | UK Gov procurement of custom development |
| `/arckit.sow` | Generate Statement of Work / RFP | After requirements, for vendor procurement |
| `/arckit.evaluate` | Evaluate vendor proposals | After receiving vendor responses |
| `/arckit.backlog` | Generate prioritized product backlog | After requirements, before development sprints |
| `/arckit.hld-review` | Review High-Level Design | After vendor selection, before implementation |
| `/arckit.dld-review` | Review Detailed Design | After HLD approval, before coding |
| `/arckit.servicenow` | Generate ServiceNow service design | After architecture, bridge to operations |
| `/arckit.traceability` | Generate traceability matrix | Throughout project, especially before release |
| `/arckit.analyze` | Comprehensive quality analysis | Periodically throughout project |
| `/arckit.principles-compliance` | Assess compliance with architecture principles | At project gates (Discovery/Alpha/Beta/Live) and quarterly |
| `/arckit.service-assessment` | GDS Service Standard assessment preparation | Before alpha/beta/live assessments (UK Gov) |
| `/arckit.tcop` | UK Gov Technology Code of Practice assessment | UK Government projects (all phases) |
| `/arckit.ai-playbook` | UK Gov AI Playbook compliance | UK Government AI projects |
| `/arckit.atrs` | UK Gov Algorithmic Transparency Record | UK Government AI systems |
| `/arckit.secure` | UK Gov Secure by Design (civilian) | UK Government security assessment |
| `/arckit.mod-secure` | MOD Secure by Design (defence) | UK Ministry of Defence security assessment |
| `/arckit.jsp-936` | MOD JSP 936 AI assurance | UK Ministry of Defence AI/ML systems |
| `/arckit.story` | Produce executive-ready programme story | After key milestones, before governance reviews |

---

## Workflow Overview

```
1. /arckit.plan
   ↓ (create project timeline with phases and gates)

2. /arckit.principles
   ↓ (establishes governance rules)

3. /arckit.stakeholders
   ↓ (understand who cares, what they need, why)

4. /arckit.risk
   ↓ (identify and assess risks - Orange Book)

5. /arckit.sobc
   ↓ (create business case using risk register)

6. /arckit.requirements
   ↓ (if approved, define detailed requirements)

7. /arckit.data-model
   ↓ (create data model with ERD, GDPR compliance)

8. /arckit.wardley
   ↓ (strategic planning, build vs buy decisions)

9. /arckit.sow
   ↓ (creates RFP for vendors)

10. /arckit.evaluate
   ↓ (scores vendor proposals)

11. /arckit.hld-review
   ↓ (reviews architecture before build)

12. /arckit.dld-review
   ↓ (reviews technical details before code)

13. Implementation happens
   ↓

14. /arckit.traceability
   ↓ (verifies all requirements met)

15. Release!
```

---

## Command Details

### 1. `/arckit.plan` - Project Plan

**Purpose**: Create comprehensive project plans with visual timelines, phases, gates, and Mermaid diagrams.

**Usage**:
```
/arckit.plan Create project plan for payment gateway modernization
/arckit.plan Create plan for NHS appointment system
/arckit.plan Generate timeline for HMRC chatbot project
```

**What it does**:
- Creates project plan with GDS Agile Delivery phases (Discovery → Alpha → Beta → Live)
- Generates Mermaid Gantt chart with timeline, dependencies, and milestones
- Creates workflow diagram showing gates and decision points
- Tailors timeline based on project complexity (small/medium/large)
- Integrates all ArcKit commands into project schedule
- Defines gate approval criteria (Discovery, Alpha, Beta assessments)
- Provides phase-by-phase activity tables

**Output**: `projects/{project-name}/project-plan.md`

**When to use**:
- Project initiation (visualize full delivery timeline)
- Before Discovery phase (set expectations)
- Gate reviews (update plan based on decisions)
- Stakeholder communication (show timeline and milestones)

**Next steps**: Review plan with stakeholders, start Discovery with `/arckit.stakeholders`

**Guide**: See [docs/guides/plan.md](../docs/guides/plan.md) for full documentation

---

### 2. `/arckit.principles` - Architecture Principles

**Purpose**: Create or update enterprise architecture principles that govern all technology decisions.

**Usage**:
```
/arckit.principles Create principles for financial services company
/arckit.principles Add API-first principle to existing principles
/arckit.principles Update security principles for HIPAA compliance
```

**What it does**:
- Creates `.arckit/memory/architecture-principles.md` (global principles)
- Defines strategic principles (Cloud-First, API-First, Security by Design)
- Sets technology standards (approved languages, frameworks, databases)
- Establishes validation gates for compliance checking
- Industry-specific customization (financial, healthcare, retail, government)

**Example principles**:
- Cloud-First Architecture
- API-First Design
- Security by Design
- Microservices Architecture
- Zero Trust Security Model
- Data Privacy by Design

**Output**: `.arckit/memory/architecture-principles.md`

**Next step**: Run `/arckit.stakeholders` to analyze who cares about this project and why, then create business case.

---

### 3. `/arckit.stakeholders` - Stakeholder Drivers & Goals Analysis

**Purpose**: Understand stakeholder drivers, map them to goals, and define measurable outcomes that satisfy each stakeholder.

**Usage**:
```
/arckit.stakeholders Analyze stakeholders for cloud migration where CFO wants cost savings and Operations worries about downtime
/arckit.stakeholders Map drivers to goals for project 001
/arckit.stakeholders Create stakeholder engagement plan for DWP benefits chatbot
```

**What it does**:
- Creates `projects/NNN-project-name/stakeholder-drivers.md`
- Identifies all relevant stakeholders (internal and external)
- Documents underlying drivers (STRATEGIC | OPERATIONAL | FINANCIAL | COMPLIANCE | PERSONAL | RISK | CUSTOMER)
- Maps drivers to specific SMART goals
- Maps goals to measurable business outcomes
- Creates complete Stakeholder → Driver → Goal → Outcome traceability
- Identifies conflicts between stakeholders and proposes resolutions
- Defines stakeholder engagement and communication strategies

**Stakeholder Types**:
- **Internal**: Executives, Business Units, Technical Teams, Operations, Compliance, Security, Finance
- **External**: Regulators, Customers, Vendors, Partners, Industry Bodies

**Driver Categories**:
- **STRATEGIC**: Competitive advantage, market position, innovation, digital transformation
- **OPERATIONAL**: Efficiency, quality, speed, reliability, workload reduction
- **FINANCIAL**: Cost reduction, revenue growth, ROI, budget constraints
- **COMPLIANCE**: Regulatory requirements, audit findings, risk mitigation, legal obligations
- **PERSONAL**: Career advancement, reputation, skill development
- **RISK**: Avoiding penalties, preventing failures, reducing exposure
- **CUSTOMER**: Satisfaction, retention, acquisition, experience improvement

**Traceability Chain**:
```
Stakeholder → Driver → Goal → Outcome

Example:
CFO → Reduce datacenter costs (FINANCIAL)
    → Reduce infrastructure costs 40% by end of Year 1 (GOAL)
    → £2M annual cost savings (OUTCOME)

Operations Director → Minimize downtime risk (RISK)
    → Zero unplanned downtime during migration (GOAL)
    → 99.95% uptime maintained (OUTCOME)
```

**Key Outputs**:
- Power-Interest Grid (who to manage closely vs keep informed)
- Driver intensity analysis (CRITICAL | HIGH | MEDIUM | LOW)
- SMART goals with metrics, baselines, and targets
- Measurable outcomes with KPIs and timelines
- Conflict analysis and resolution strategies
- Engagement plan with stakeholder-specific messaging
- Change impact assessment (champions, fence-sitters, resisters)
- RACI matrix for decision authority
- Stakeholder-related risk register

**Why This Matters**:
- **Requirements Prioritization**: Align to high-impact drivers
- **Design Decisions**: Optimize for stakeholder outcomes
- **Communication Plans**: Message to each stakeholder's motivations
- **Change Management**: Address resistance rooted in threatened drivers
- **Success Metrics**: Measure what stakeholders actually care about
- **Governance**: Give decision rights to stakeholders with most at stake

**UK Government Context**:
For UK Government projects, includes:
- Minister accountability and parliamentary questions
- Permanent Secretary governance and NAO scrutiny
- Treasury spending controls and value for money
- Service assessment and GDS standards
- Public transparency requirements
- Citizen/user needs (digital inclusion, accessibility)
- ICO data protection requirements

**Output**: `projects/NNN-project-name/stakeholder-drivers.md`

**Next step**: Identify and assess project risks with `/arckit.risk` using Orange Book methodology, then create business case.

---

### 4. `/arckit.risk` - Risk Management (Orange Book)

**Purpose**: Create comprehensive risk register following HM Treasury Orange Book (2023) principles for systematic risk identification, assessment, and management.

**Usage**:
```
/arckit.risk Identify risks for cloud migration project
/arckit.risk Create risk register for payment gateway modernization
/arckit.risk Assess risks for DWP benefits chatbot with stakeholder concerns
```

**What it does**:
- Creates `projects/NNN-project-name/risk-register.md`
- **Requires stakeholder analysis** (MANDATORY - every risk needs an owner from RACI matrix)
- Follows HM Treasury Orange Book 2023 framework (Part I: 5 Principles, Part II: Risk Control Framework)
- Identifies risks across 6 categories (Strategic, Operational, Financial, Compliance, Reputational, Technology)
- Assesses inherent risk (before controls) and residual risk (after controls)
- Applies 4Ts response framework (Tolerate, Treat, Transfer, Terminate)
- Links risks to stakeholder concerns and objectives
- Monitors risk appetite compliance
- Feeds into SOBC Management Case Part E

**Orange Book 2023 Framework**:

**Part I - Risk Management Principles**:
- **A. Governance and Leadership**: Risk owners from senior stakeholders
- **B. Integration**: Risks linked to objectives, business case, requirements
- **C. Collaboration**: Multiple perspectives from stakeholder analysis
- **D. Risk Processes**: Systematic identification, assessment, response, monitoring
- **E. Continual Improvement**: Regular reviews, KRIs, lessons learned

**Part II - Risk Control Framework (4-Pillar Structure)**:
- Risk appetite and tolerance thresholds
- Risk ownership and governance
- Risk assessment methodology (5×5 matrix)
- Control effectiveness measurement

**6 Risk Categories**:

1. **STRATEGIC**: Risks to strategic objectives, competitive position, policy changes
   - Example: "Strategic direction changes mid-project due to ministerial reshuffle"

2. **OPERATIONAL**: Risks to operations, service delivery, business continuity
   - Example: "Insufficient cloud expertise in team for migration"

3. **FINANCIAL**: Budget overruns, funding shortfalls, ROI not achieved
   - Example: "Cloud costs exceed budget by 40% due to poor estimation"

4. **COMPLIANCE/REGULATORY**: Non-compliance with laws, regulations, policies
   - Example: "GDPR breach due to international data transfer"

5. **REPUTATIONAL**: Damage to reputation, stakeholder confidence, public perception
   - Example: "High-profile service outage damages citizen trust"

6. **TECHNOLOGY**: Technical failure, cyber security, legacy system issues
   - Example: "Legacy integration fails under production load"

**Risk Assessment (5×5 Matrix)**:

**Inherent Risk** (before controls):
- **Likelihood** (1-5): Rare → Unlikely → Possible → Likely → Almost Certain
- **Impact** (1-5): Negligible → Minor → Moderate → Major → Catastrophic
- **Score** = Likelihood × Impact (1-25)

**Residual Risk** (after controls):
- Same scales applied after existing controls
- Shows control effectiveness (% risk reduction)

**Risk Zones**:
- 🟥 **Critical (20-25)**: Immediate escalation to senior management
- 🟧 **High (13-19)**: Management attention, mitigation plan required
- 🟨 **Medium (6-12)**: Management monitoring, consider mitigation
- 🟩 **Low (1-5)**: Routine monitoring, accept or low-cost controls

**4Ts Response Framework**:

Each risk receives ONE primary response:

- **TOLERATE**: Accept the risk (within appetite, cost of mitigation exceeds benefit)
  - When to use: Low residual score (1-5), within risk appetite
  - Example: "Minor UI inconsistency - aesthetic only, no functional impact"

- **TREAT**: Mitigate or reduce the risk (implement additional controls)
  - When to use: Medium/High risk that can be reduced through actions
  - Example: "Implement automated testing pipeline to reduce defect risk"

- **TRANSFER**: Transfer risk to 3rd party (insurance, outsourcing, contracts)
  - When to use: Low likelihood/high impact, can be insured or contracted away
  - Example: "Purchase cyber insurance for breach liability coverage"

- **TERMINATE**: Stop the activity creating the risk
  - When to use: High likelihood/high impact, exceeds appetite, cannot be mitigated
  - Example: "Cancel high-risk vendor contract, source alternative supplier"

**Complete Stakeholder Integration**:

Every risk must trace to stakeholder analysis:

```
Stakeholder: CFO (from stakeholder-drivers.md)
  → Driver D-001: Reduce costs (FINANCIAL, HIGH)
    → Risk R-004: Cloud costs exceed budget by 40% (FINANCIAL, Score: 9)
      → Risk Owner: CFO (from RACI matrix - Accountable)
        → Current Controls: Monthly cost reviews, FinOps dashboards
          → Residual Score: 9 (Medium, within appetite)
            → Response: TREAT - Implement automated cost anomaly alerts
              → Target Score: 6 (Low, well within appetite)
```

**Risk Register Contents**:

**A. Executive Summary**:
- Risk profile overview (Critical/High/Medium/Low distribution)
- Top 5 risks requiring immediate attention
- Risks exceeding organisational appetite
- Overall risk assessment (Acceptable/Concerning/Unacceptable)
- Key findings and recommendations

**B. Risk Matrix Visualization**:
- Inherent risk matrix (5×5 grid showing risks before controls)
- Residual risk matrix (5×5 grid showing risks after controls)
- Risk movement analysis (control effectiveness)

**C. Top 10 Risks** (ranked by residual score):
- Table with ID, title, category, scores, owner, status, response

**D. Detailed Risk Register**:
For each risk (R-001, R-002, R-003...):
- Risk identification (description, root cause, trigger events, consequences)
- Affected stakeholders (links to stakeholder-drivers.md)
- Related objectives (stakeholder goals under threat)
- Inherent assessment (L×I before controls)
- Current controls and effectiveness
- Residual assessment (L×I after controls)
- 4Ts response with rationale
- Risk ownership (from stakeholder RACI)
- Action plan with owners, dates, costs, target risk reduction
- Risk appetite assessment (within/exceeds appetite)

**E. Risk Category Analysis**:
- Analysis per category (Strategic, Operational, etc.)
- Average scores, control effectiveness
- Key themes and patterns

**F. Risk Ownership Matrix**:
- Which stakeholder owns which risks
- Risk concentration analysis (load balancing)

**G. 4Ts Response Summary**:
- Distribution: Tolerate X% | Treat Y% | Transfer Z% | Terminate W%
- Response patterns by category

**H. Risk Appetite Compliance**:
- Compliance by category (within/exceeding appetite)
- Risks requiring escalation/approval
- Justification for appetite exceedances

**I. Prioritized Action Plan**:
- Priority 1 (URGENT): Critical risks or significant appetite exceedance
- Priority 2 (HIGH): High risks within appetite
- Priority 3 (MEDIUM): Medium risks requiring treatment
- Actions with owners, dates, costs, expected impact

**J. Integration with SOBC**:
- **Strategic Case**: Strategic risks demonstrate urgency ("Why Now?")
- **Economic Case**: Financial risks inform risk-adjusted costs (optimism bias)
- **Management Case Part E**: Full risk register included for risk management section
- **Recommendation**: High-risk profile influences option selection and phasing

**K. Monitoring and Review Framework**:
- Review schedule: Weekly (Critical/High), Monthly (Medium), Quarterly (Low)
- Key Risk Indicators (KRIs) - leading and lagging
- Escalation criteria (auto-escalation triggers)
- Reporting requirements (weekly/monthly/quarterly)

**L. Orange Book Compliance Checklist**:
- Demonstrates compliance with all 5 principles
- Risk Control Framework alignment

**UK Government Specific Risks**:

For UK Government/public sector projects:

**STRATEGIC**:
- Policy/ministerial direction change mid-project
- Manifesto commitment not delivered
- Machinery of government changes
- Parliamentary scrutiny and questions

**COMPLIANCE/REGULATORY**:
- HM Treasury spending controls (approval delays)
- NAO audit findings and recommendations
- PAC (Public Accounts Committee) scrutiny
- FOI requests revealing sensitive information
- Judicial review of procurement decisions

**REPUTATIONAL**:
- Media scrutiny of government IT failures
- Citizen complaints and service failures
- Social media backlash
- Select Committee inquiry

**OPERATIONAL**:
- GDS Service Assessment failure (cannot go live)
- CDDO digital spend control rejection
- Civil service headcount restrictions
- Security clearance delays (SC/DV)

**Why This Matters**:

- **Informed Decision-Making**: Risk register enables go/no-go decisions in SOBC
- **Proactive Management**: Identify and mitigate risks early, before they materialize
- **Stakeholder Confidence**: Demonstrates systematic risk management to Board/Treasury
- **Resource Allocation**: Prioritize risk mitigation budget (action plan costs)
- **Compliance**: Orange Book compliance required for UK Government assurance
- **Audit Trail**: Documented risk assessment for NAO/audit review
- **Integration**: Risks link to stakeholders, inform business case, shape requirements

**Output**: `projects/NNN-project-name/risk-register.md`

**Next step**: Use risk register to inform `/arckit.sobc` - Management Case Part E requires comprehensive risk assessment.

---

### 5. `/arckit.sobc` - Strategic Outline Business Case

**Purpose**: Create a Strategic Outline Business Case (SOBC) following HM Treasury Green Book 5-case model to justify investment in a technology project.

**Usage**:
```
/arckit.sobc Create SOBC for cloud migration project
/arckit.sobc Generate business case for payment modernization
/arckit.sobc Create strategic outline for DWP benefits chatbot
```

**What it does**:
- Creates `projects/NNN-project-name/sobc.md`
- **Requires stakeholder analysis** (MANDATORY - SOBC must link to stakeholder goals)
- Generates comprehensive business case following HM Treasury Green Book 5-case model
- Analyzes multiple strategic options (Do Nothing, Minimal, Balanced, Comprehensive)
- Maps benefits to stakeholder goals from stakeholder analysis
- Provides high-level cost estimates (Rough Order of Magnitude)
- Enables go/no-go decision BEFORE investing in detailed requirements

**Business Case Lifecycle**:
- **SOBC** (this command): Strategic Outline - High-level case for change with ROM estimates
- **OBC**: Outline Business Case - After some design work, with refined costs
- **FBC**: Full Business Case - Detailed case with accurate costs, ready for final approval

**The Five Cases (HM Treasury Green Book Model)**:

**A. Strategic Case**:
- Problem statement (from stakeholder pain points)
- Strategic fit and alignment with organisational strategy
- Stakeholder drivers mapped to strategic imperatives
- Scope definition (in/out of scope)
- Dependencies and urgency (why now?)

**B. Economic Case**:
- Options analysis (Do Nothing, Minimal, Balanced, Comprehensive)
- Benefits mapping (every benefit traces to stakeholder goal)
- High-level cost estimates (CapEx, OpEx, 3-year TCO)
- Economic appraisal (ROI range, payback period)
- Recommended option with rationale

**C. Commercial Case**:
- Procurement strategy (Digital Marketplace for UK Gov, Build/Buy/Partner for private)
- Market assessment (supplier availability, competition)
- Sourcing route and contract approach
- SME opportunities (UK Government requirement)

**D. Financial Case**:
- Budget requirement (how much needed?)
- Funding source (where does money come from?)
- Approval thresholds (who must approve?)
- Affordability assessment
- Cash flow and budget constraints

**E. Management Case**:
- Governance (from stakeholder RACI matrix)
- Project approach (Agile/Waterfall/Phased)
- Key milestones and deliverables
- Resource requirements (team size, skills)
- Change management (from stakeholder conflict analysis)
- Benefits realization (linked to stakeholder outcomes)
- Risk management (top 5-10 strategic risks)

**Complete Traceability**:
```
Stakeholder Driver → Strategic Case → Benefit → Financial Case → Success Criterion

Example:
CFO Driver D-1: Reduce costs (FINANCIAL, HIGH)
  → Strategic Case: Cost pressure driving change
    → Economic Case: Benefit B-1: £2M annual savings (maps to CFO Goal G-1)
      → Financial Case: 18-month payback acceptable to CFO
        → Management Case: CFO sits on steering committee (RACI: Accountable)
          → Success Criterion: CFO Outcome O-1 measured monthly
```

**UK Government Specific Features**:
- Policy alignment (manifesto commitments, departmental objectives)
- Public value and citizen outcomes
- Digital Marketplace assessment (G-Cloud, DOS)
- Social Cost Benefit Analysis with Green Book discount rates (3.5%)
- Optimism bias adjustment
- Social value (minimum 10% weighting)
- Service Standard assessment plan
- WCAG 2.2 AA accessibility compliance

**Output**: `projects/NNN-project-name/sobc.md`

**Next step**: Present SOBC to approval body for go/no-go decision. If approved, run `/arckit.requirements` to define detailed requirements.

---

### 6. `/arckit.requirements` - Requirements Definition

**Purpose**: Create comprehensive business and technical requirements for a project, informed by stakeholder goals.

**Usage**:
```
/arckit.requirements Create requirements for payment gateway modernization
/arckit.requirements Define requirements for customer portal project
/arckit.requirements Add compliance requirements to project 001
```

**What it does**:
- Creates new project in `projects/NNN-project-name/`
- Generates comprehensive requirements document
- **Checks for stakeholder analysis first** (recommends running `/arckit.stakeholders` if missing)
- **Traces requirements back to stakeholder goals** when stakeholder analysis exists
- Links requirements to architecture principles
- Includes Business, Functional, Non-Functional, Integration, and Data requirements
- Each requirement has unique ID, acceptance criteria, and priority
- **Identifies and resolves conflicts** between requirements based on stakeholder conflicts

**Requirements types**:
- **BR-xxx**: Business Requirements (ROI, cost savings, business objectives)
- **FR-xxx**: Functional Requirements (features, user stories, use cases)
- **NFR-xxx**: Non-Functional Requirements (performance, security, scalability)
  - **NFR-P-xxx**: Performance
  - **NFR-S-xxx**: Security
  - **NFR-R-xxx**: Reliability
  - **NFR-SC-xxx**: Scalability
  - **NFR-C-xxx**: Compliance
- **INT-xxx**: Integration Requirements (APIs, upstream/downstream systems)
- **DR-xxx**: Data Requirements (data models, retention, privacy)

**Output**: `projects/NNN-project-name/requirements.md`

**Next step**: Use `/arckit.data-model` to create the data model, or `/arckit.wardley` for strategic build vs buy analysis.

---

### 7. `/arckit.data-model` - Data Model with ERD

**Purpose**: Create comprehensive data model with entity-relationship diagrams, GDPR compliance, and data governance.

**Usage**:
```
/arckit.data-model Create data model for payment gateway project
/arckit.data-model Generate data model for project 001
/arckit.data-model Add GDPR compliance to customer data model
```

**What it does**:
- **REQUIRES `requirements.md`** (must have DR-xxx Data Requirements)
- Creates `projects/NNN-project-name/data-model.md`
- Extracts all DR-xxx (Data Requirements) from requirements.md
- Generates visual Entity-Relationship Diagram (ERD) using Mermaid
- Creates detailed entity catalog with attributes, types, validation rules
- Identifies PII (Personally Identifiable Information) and flags for GDPR compliance
- Defines data governance matrix (business owners, stewards, custodians)
- Creates CRUD matrix showing which components access which entities
- Documents data integration mapping (upstream/downstream systems)
- Ensures GDPR/DPA 2018 compliance (retention, erasure, subject access rights)
- Sector-specific compliance (PCI-DSS for payment data, HIPAA for health data)
- Data quality framework with measurable metrics
- Complete traceability: DR-xxx → Entity → Attribute

**Key Features**:
- **Visual ERD**: Mermaid diagram showing entities, relationships, cardinality
- **Entity Catalog**: Detailed entity definitions (E-001, E-002, etc.)
  - Attributes with types, validation rules, PII flags
  - Data classification (Public, Internal, Confidential, Restricted)
  - Volume estimates and retention policies
  - Relationships (one-to-one, one-to-many, many-to-many)
  - Indexes (primary keys, foreign keys, performance indexes)
- **GDPR Compliance**:
  - PII inventory across all entities
  - Legal basis for processing (consent, contract, legitimate interest)
  - Data subject rights (access, rectification, erasure, portability)
  - Data retention schedules and deletion policies
  - Cross-border transfer considerations (UK-EU, UK-US)
  - DPIA (Data Protection Impact Assessment) if required
- **Data Governance**:
  - Business Owner (accountable from stakeholder RACI matrix)
  - Data Steward (enforces quality and compliance)
  - Technical Custodian (manages storage and backups)
  - Access control rules per entity
- **CRUD Matrix**: Shows which components Create, Read, Update, Delete each entity
- **Integration Mapping**: Upstream sources and downstream consumers of data
- **Data Quality**: Accuracy, completeness, consistency, timeliness, uniqueness metrics

**Output**: `projects/NNN-project-name/data-model.md`

**Next step**: Use `/arckit.research` to explore build vs buy options, or `/arckit.wardley` for strategic analysis.

---

### 8. `/arckit.dpia` - Data Protection Impact Assessment

**Purpose**: Generate a GDPR-compliant Data Protection Impact Assessment that links privacy risks, mitigations, and accountability back to ArcKit artifacts.

**Usage**:
```
/arckit.dpia Create DPIA for payment gateway modernization
/arckit.dpia Generate DPIA for NHS appointment portal
```

**Prerequisites**:
- `projects/NNN-project-name/requirements.md` (with DR-xxx Data Requirements)
- `projects/NNN-project-name/data-model.md` (entities annotated with PII flags)
- Processing involves personal data or meets ICO high-risk indicators

**What it does**:
- Runs ICO 9-criteria screening to confirm DPIA necessity
- Compiles processing overview, lawful basis, and purpose from requirements and stakeholder drivers
- Pulls entities, attributes, and PII classifications from `data-model.md`
- Identifies risks to data subjects, evaluates likelihood × severity, and records residual scores
- Maps each risk to mitigating controls (including `/arckit.secure` outputs) and links back to `risk-register.md`
- Documents data subject rights handling, DPIA sign-off, review cadence, and international transfer safeguards
- Flags open actions that must be addressed before go-live (e.g., DPO review, ICO consultation)

**Outputs**:
- `projects/NNN-project-name/dpia.md`
- Updates `risk-register.md` with DPIA-xxx identifiers when risks already exist

**Next step**: Review with the Data Protection Officer, update `/arckit.risk` for any new risks, and ensure mitigations feed into `/arckit.backlog` or `/arckit.traceability`.

---

### 9. `/arckit.research` - Technology and Service Research

**Purpose**: Research available technologies, services, and products to meet requirements and inform build vs buy decisions.

**Usage**:
```
/arckit.research Research payment gateway solutions for project 001
/arckit.research Find CRM platforms that meet our requirements
/arckit.research Compare cloud hosting options for microservices architecture
```

**What it does**:
- Performs market research to identify available solutions
- Analyzes build vs buy tradeoffs
- Compares commercial products, SaaS platforms, and open source options
- Estimates Total Cost of Ownership (TCO)
- Maps solutions to requirements
- Recommends procurement approach (build custom, buy commercial, use open source)

**Research categories**:
- **Commercial Products**: Licensed software, enterprise platforms
- **SaaS Platforms**: Cloud-based subscription services
- **Open Source**: Community or commercially-supported OSS
- **UK Digital Marketplace**: G-Cloud services, DOS suppliers

**Key outputs**:
- Solution comparison matrix
- Build vs Buy analysis with TCO estimates
- Requirements coverage assessment
- Risk analysis for each option
- Procurement recommendations

**Output**: `projects/NNN-project-name/research-findings.md`

**Next step**: Use findings to inform `/arckit.wardley` mapping or proceed to procurement with `/arckit.gcloud-search`, `/arckit.dos`, or `/arckit.sow`.

---

### 10. `/arckit.gcloud-search` - G-Cloud Service Search

**Purpose**: Find and compare G-Cloud services on the UK Digital Marketplace for off-the-shelf procurement.

**Usage**:
```
/arckit.gcloud-search Find cloud hosting services for microservices
/arckit.gcloud-search Search for payment gateway SaaS on G-Cloud
/arckit.gcloud-search Compare CRM platforms available on Digital Marketplace
```

**What it does**:
- Searches UK Digital Marketplace G-Cloud framework
- Finds off-the-shelf cloud services (hosting, SaaS, PaaS, IaaS)
- Compares services against requirements
- Analyzes pricing and service levels
- Identifies suitable suppliers
- **No custom development** - procurement only

**When to use**:
- ✅ Buying off-the-shelf cloud services
- ✅ SaaS platforms and tools
- ✅ Cloud hosting (IaaS, PaaS)
- ❌ Custom development (use `/arckit.dos` instead)

**UK Government context**:
- G-Cloud is for services you can buy and use immediately
- Streamlined procurement process
- Pre-qualified suppliers
- Standard terms and conditions
- Call-off contracts under £100M

**Output**: `projects/NNN-project-name/gcloud-search-results.md`

**Next step**: Use `/arckit.gcloud-clarify` to generate clarification questions for shortlisted suppliers.

---

### 11. `/arckit.gcloud-clarify` - G-Cloud Clarification Questions

**Purpose**: Generate clarification questions to validate G-Cloud service claims and fill gaps in supplier information.

**Usage**:
```
/arckit.gcloud-clarify Generate questions for Supplier A cloud hosting service
/arckit.gcloud-clarify Validate compliance claims for payment gateway SaaS
/arckit.gcloud-clarify Check integration capabilities for CRM platform
```

**What it does**:
- Analyzes G-Cloud service descriptions for vagueness or gaps
- Generates specific technical clarification questions
- Validates compliance and security claims
- Checks integration capabilities
- Verifies SLA and support commitments
- Ensures requirements coverage

**Common clarification areas**:
- **Technical**: API specifications, integration patterns, data formats
- **Security**: Certifications, encryption standards, audit logs
- **Compliance**: GDPR, sector-specific regulations
- **Performance**: SLAs, uptime guarantees, scalability limits
- **Support**: Response times, escalation procedures, UK coverage
- **Pricing**: Hidden costs, data transfer fees, scaling costs

**Output**: `projects/NNN-project-name/vendors/supplier-name/clarification-questions.md`

**Next step**: Send questions to suppliers via Digital Marketplace, then evaluate responses with `/arckit.evaluate`.

---

### 12. `/arckit.dos` - Digital Outcomes and Specialists

**Purpose**: Generate Digital Outcomes and Specialists (DOS) procurement documentation for custom development on UK Digital Marketplace.

**Usage**:
```
/arckit.dos Create DOS brief for payment gateway development
/arckit.dos Generate user research specialist requirement
/arckit.dos Create digital outcome brief for customer portal project
```

**What it does**:
- Creates DOS-compliant procurement documentation
- Defines requirements for custom software development
- Specifies team composition (developers, architects, designers, specialists)
- Sets project outcomes and deliverables
- Includes evaluation criteria for DOS suppliers
- Aligns with GDS Service Standard

**When to use**:
- ✅ Custom software development
- ✅ Hiring developers, architects, designers, specialists
- ✅ Digital outcomes requiring custom implementation
- ❌ Off-the-shelf services (use `/arckit.gcloud-search` instead)

**DOS categories**:
- **Digital Outcomes**: Specific project outcomes (e.g., build a portal)
- **Digital Specialists**: Individual specialists (e.g., hire a Python developer)
- **User Research Studios**: User research services
- **User Research Participants**: Recruit research participants

**UK Government context**:
- DOS is for custom development and specialist hiring
- Competitive process with evaluation criteria
- Agile delivery approach
- GDS Service Standard compliance
- Maximum contract value per lot applies

**Output**: `projects/NNN-project-name/dos-brief.md`

**Next step**: Publish on Digital Marketplace, then use `/arckit.evaluate` to score supplier proposals.

---

### 13. `/arckit.sow` - Statement of Work / RFP

**Purpose**: Generate Statement of Work (SOW) document for vendor procurement / RFP.

**Usage**:
```
/arckit.sow Generate SOW for payment gateway project
/arckit.sow Create RFP for project 001
/arckit.sow Update SOW with new timeline for customer portal
```

**What it does**:
- Reads requirements from `requirements.md`
- Generates comprehensive RFP-ready document
- Includes scope, deliverables, timeline, evaluation criteria
- Defines mandatory vendor qualifications
- Specifies contract terms and acceptance criteria

**Key sections**:
- Executive Summary
- Scope of Work (in-scope, out-of-scope)
- Requirements (imported from requirements.md)
- Deliverables (HLD, DLD, code, tests, documentation)
- Timeline and Milestones
- Vendor Qualifications
- Proposal Requirements
- Evaluation Criteria
- Contract Terms

**Output**: `projects/NNN-project-name/sow.md`

**Next step**: Send SOW to vendors, then use `/arckit.evaluate` to score proposals.

---

### 14. `/arckit.evaluate` - Vendor Evaluation

**Purpose**: Create vendor evaluation framework and score vendor proposals.

**Usage**:
```
/arckit.evaluate Create evaluation framework for payment gateway project
/arckit.evaluate Score Acme Payment Solutions proposal for project 001
/arckit.evaluate Compare all vendors for payment gateway project
```

**What it does**:

**Task A: Create Evaluation Framework**
- Defines mandatory qualifications (pass/fail)
- Creates scoring criteria (100 points total)
  - Technical Approach: 35 points
  - Project Approach: 20 points
  - Team Qualifications: 25 points
  - Company Experience: 10 points
  - Pricing: 10 points

**Task B: Score a Vendor**
- Creates vendor directory
- Scores proposal against criteria
- Documents strengths, weaknesses, risks
- Provides recommendation (Recommend/Consider/Not Recommended)

**Task C: Compare Vendors**
- Side-by-side comparison matrix
- Ranking and recommendation
- Contract negotiation points

**Outputs**:
- `projects/NNN-project-name/evaluation-criteria.md` (framework)
- `projects/NNN-project-name/vendors/vendor-name/evaluation.md` (scoring)
- `projects/NNN-project-name/vendor-comparison.md` (comparison)

**Next step**: Select vendor, then request HLD and use `/arckit.hld-review`.

---

### 15. `/arckit.hld-review` - High-Level Design Review

**Purpose**: Review High-Level Design (HLD) against architecture principles and requirements.

**Usage**:
```
/arckit.hld-review Review Acme Payment Solutions HLD for payment gateway
/arckit.hld-review Evaluate HLD for project 001
/arckit.hld-review Check HLD compliance with security principles
```

**What it does**:
- Reviews HLD against architecture principles (compliance check)
- Verifies requirements coverage
- Assesses architecture quality (scalability, security, resilience)
- Identifies anti-patterns and risks
- Validates technology stack choices

**Review areas**:
- **Principles Compliance**: Cloud-First? API-First? Security by Design?
- **Requirements Coverage**: All requirements addressed?
- **Scalability**: Horizontal scaling? Load balancing?
- **Security**: Authentication? Encryption? Compliance?
- **Resilience**: Fault tolerance? Disaster recovery?
- **Performance**: Caching? Database optimisation?
- **Operational Excellence**: Monitoring? CI/CD? Runbooks?

**Approval status**:
- ✅ **APPROVED**: Ready for DLD
- ⚠️ **APPROVED WITH CONDITIONS**: Fix blocking items first
- ❌ **REJECTED**: Major issues, needs redesign

**Output**: `projects/NNN-project-name/vendors/vendor-name/hld-review.md`

**Next step**: After HLD approval, request DLD and use `/arckit.dld-review`.

---

### 16. `/arckit.dld-review` - Detailed Design Review

**Purpose**: Review Detailed Design (DLD) for implementation readiness.

**Usage**:
```
/arckit.dld-review Review Acme Payment Solutions DLD for payment gateway
/arckit.dld-review Evaluate DLD implementation details for project 001
/arckit.dld-review Check database schema and API specs for customer portal
```

**What it does**:
- Verifies HLD was approved and issues resolved
- Reviews component design (interfaces, business logic, error handling)
- Validates API design (OpenAPI specs, endpoints, auth)
- Examines data model (ERD, schema, indexes, migrations)
- Checks security implementation (OAuth, encryption, secrets)
- Reviews integration design (patterns, error handling, contracts)
- Assesses testing strategy (unit, integration, performance tests)

**Review areas**:
- **Component Design**: APIs, data structures, business logic defined?
- **API Design**: OpenAPI specs? Proper REST conventions?
- **Data Model**: Complete ERD? Proper indexes? Migration strategy?
- **Security**: Auth flows detailed? Encryption algorithms specified?
- **Integration**: Sync/async? Retry logic? Circuit breakers?
- **Performance**: Caching? Connection pooling? Async processing?
- **Operations**: Monitoring? Logging? Health checks? CI/CD?
- **Testing**: Unit tests? Integration tests? Load tests?

**Approval status**:
- ✅ **APPROVED**: Ready to code!
- ⚠️ **APPROVED WITH CONDITIONS**: Fix blocking items before implementation
- ❌ **REJECTED**: Insufficient detail or major issues
- 🔄 **NEEDS HLD RE-REVIEW**: Architecture changed

**Output**: `projects/NNN-project-name/vendors/vendor-name/dld-review.md`

**Next step**: Implementation begins! Use `/arckit.traceability` throughout to track progress.

---

### 17. `/arckit.traceability` - Traceability Matrix

**Purpose**: Generate requirements traceability matrix from requirements → design → implementation → tests.

**Usage**:
```
/arckit.traceability Generate traceability matrix for payment gateway
/arckit.traceability Update traceability for project 001
/arckit.traceability Check test coverage for all requirements
```

**What it does**:
- Traces every requirement through design to tests
- Identifies orphan requirements (no design/implementation)
- Identifies orphan design elements (scope creep!)
- Calculates coverage metrics
- Flags critical gaps

**Traceability mapping**:
```
Requirement → HLD Component → DLD Module → Implementation → Tests → Status

Example:
FR-001 → PaymentService → PaymentController.processPayment() → payment.ts → TC-001, TC-002 → ✅
NFR-S-001 → SecurityArchitecture → TokenVault, Encryption → security/ → SEC-001-015 → ✅
BR-003 → [NO MAPPING] → [NO MAPPING] → [NO IMPLEMENTATION] → [NO TESTS] → ❌ GAP!
```

**Coverage metrics**:
- Business Requirements coverage
- Functional Requirements coverage
- Non-Functional Requirements coverage
- Coverage by priority (MUST/SHOULD/MAY)
- Overall traceability score (0-100)

**Gap analysis**:
- **Orphan Requirements**: Requirements without design (blocking!)
- **Orphan Design**: Design not tied to requirements (scope creep?)
- **Orphan Tests**: Tests not tied to requirements (what are they testing?)
- **Coverage Gaps**: Requirements without tests

**Outputs**:
- `projects/NNN-project-name/traceability-matrix.md` (full matrix)
- `projects/NNN-project-name/coverage-report.md` (metrics)
- `projects/NNN-project-name/gaps.md` (gap analysis)

**When to use**:
- After DLD approval (baseline)
- During implementation (track progress)
- Before release (go/no-go decision)
- For compliance audits (FDA, ISO, automotive)

---

### 18. `/arckit.service-assessment` - GDS Service Standard Assessment Preparation

**Purpose**: Prepare for mandatory UK Government GDS Service Standard assessments by analyzing evidence against all 14 points, identifying gaps, and generating readiness reports.

**Usage**:
```
/arckit.service-assessment PHASE=alpha
/arckit.service-assessment PHASE=beta DATE=2025-12-15
/arckit.service-assessment PHASE=live
```

**What it does**:
- Analyzes ALL ArcKit artifacts as evidence for 14 Service Standard points
- Provides phase-appropriate gap analysis (alpha/beta/live have different evidence requirements)
- Generates RAG (Red/Amber/Green) ratings per point + overall readiness score
- Creates actionable recommendations with priorities (Critical/High/Medium) and timelines
- Includes comprehensive assessment day preparation guidance
- Maps ArcKit artifacts to Service Standard evidence requirements
- Identifies what's ready vs what needs work before booking assessment

**The 14 Service Standard Points**:
1. Understand users and their needs
2. Solve a whole problem for users
3. Provide a joined up experience across all channels
4. Make the service simple to use
5. Make sure everyone can use the service
6. Have a multidisciplinary team
7. Use agile ways of working
8. Iterate and improve frequently
9. Create a secure service which protects users' privacy
10. Define what success looks like and publish performance data
11. Choose the right tools and technology
12. Make new source code open
13. Use and contribute to open standards, common components and patterns
14. Operate a reliable service

**Evidence Mapping Examples**:
```
Point 1 (Understand users) ← stakeholder-drivers.md + requirements.md (user stories)
Point 5 (Accessibility) ← requirements.md (WCAG 2.1 AA) + ukgov-secure-by-design.md
Point 9 (Security) ← ukgov-secure-by-design.md + data-model.md (GDPR) + atrs-record.md
Point 11 (Right tools) ← research/ + wardley-maps/ + tcop-assessment.md
Point 14 (Reliable) ← requirements.md (availability NFRs) + hld-review.md (resilience)
```

**RAG Rating System**:
- **🟢 Green**: All critical evidence present → Ready to present confidently
- **🟡 Amber**: Evidence exists but gaps/weaknesses → Needs strengthening (1-2 weeks)
- **🔴 Red**: Critical evidence missing → Must address before booking (3+ weeks)

**Overall Readiness**:
- **🟢 Ready to book**: 12+ points Green, max 2 Amber, 0 Red
- **🟡 Nearly ready**: 10+ points Green/Amber, max 2 Red
- **🔴 Not ready**: More than 2 Red points (complete critical actions first)

**Phase-Appropriate Evidence**:

**Alpha** (lower bar - proving viability):
- User research with real users (CRITICAL)
- Technology viability proven
- Team has right skills
- Performance data not required (targets defined is enough)

**Beta** (higher bar - proving production readiness):
- WCAG 2.1 AA audit completed (CRITICAL)
- Security testing done
- Performance monitoring in place
- End-to-end service working

**Live** (highest bar - operational excellence):
- Performance data published on GOV.UK (CRITICAL - 4 mandatory KPIs)
- User satisfaction tracked
- Continuous improvement demonstrated
- Operational maturity proven

**Outputs**:
- `projects/{project-dir}/service-assessment-alpha-prep.md` (for alpha)
- `projects/{project-dir}/service-assessment-beta-prep.md` (for beta)
- `projects/{project-dir}/service-assessment-live-prep.md` (for live)

**Report Structure**:
1. **Executive Summary**: Overall readiness, score (X/14), critical gaps, timeline
2. **14-Point Assessment**: Detailed section per point with evidence found, gaps, recommendations
3. **Evidence Inventory**: Complete traceability matrix (Service Standard Point → ArcKit Artifacts)
4. **Preparation Checklist**: Critical/High/Medium priority actions with timelines
5. **Assessment Day Prep**: Documentation to share, who should attend, 4-hour timeline, tips
6. **After Assessment**: Handling Amber ratings, tracking progress, next steps

**When to use**:
- **Early in phase**: Week 0-1 to understand evidence requirements and plan work
- **Mid-phase**: Week 4-6 to check progress and identify emerging gaps
- **Pre-assessment**: 2 weeks before assessment date for final readiness check
- **Weekly**: Re-run weekly during assessment prep to track Red → Amber → Green progress

**Assessment Timeline**:
```
Week 0: Run command, identify critical gaps (Red ratings)
Week 1-2: Address Red ratings (user research, accessibility approach, security)
Week 3-4: Strengthen Amber ratings (testing, documentation, reviews)
Week 5-6: Final prep, book assessment (5 weeks in advance)
Week 7: Share documentation with panel (1 week before)
Week 8: Assessment day (4 hours with GDS panel)
```

**Time Savings**:
- Manual assessment prep: **2-4 weeks**
- With this command: **2-3 days**
- **~80% reduction in preparation time**

**UK Government Context**:
Mandatory for all UK Government digital services at:
- End of alpha (before building)
- Mid-beta (private to public beta transition)
- Before live (production launch)

Assessments conducted by GDS-trained panels, 4 hours, resulting in Green (pass), Amber (conditional pass), or Red (fail) ratings.

**Next steps**:
- If Green/Amber → Book assessment 5 weeks in advance
- If Red → Complete critical actions first, re-run command weekly
- After assessment → Track any Amber points, update artifacts

**Guide**: See [docs/guides/service-assessment.md](../docs/guides/service-assessment.md) for complete workflow

---

## Best Practices

### 1. Follow the Workflow

Always follow the recommended sequence:
1. Principles FIRST (establishes governance)
2. Stakeholders SECOND (understand who cares and why)
3. Risk Assessment THIRD (identify and assess risks using Orange Book)
4. Business Case FOURTH (justify investment with SOBC using risk register)
5. Requirements FIFTH (if approved, define detailed requirements aligned to stakeholder goals)
6. Data Model SIXTH (create data model with ERD, GDPR compliance)
7. Wardley Mapping SEVENTH (strategic planning, build vs buy decisions)
8. SOW/RFP EIGHTH (procurement)
9. Evaluate vendors
10. HLD review (architecture gate)
11. DLD review (implementation gate)
12. Traceability (verification)

### 2. Keep Principles Updated

Architecture principles should be:
- Living documents (update as you learn)
- Specific enough to enforce
- Flexible enough to allow innovation
- Aligned with industry regulations

### 3. Be Thorough with Requirements

- Every requirement needs unique ID
- Every requirement needs acceptance criteria
- Every "MUST" requirement is mandatory
- Include WHY (rationale) not just WHAT

### 4. Make SOW Legally Sound

- Have legal review before sending to vendors
- Be specific and unambiguous
- Include clear acceptance criteria
- Define change management process

### 5. Objective Vendor Evaluation

- Use documented criteria (no arbitrary scores)
- Reference specific requirements
- Document conflicts of interest
- Keep vendor proposals confidential

### 6. HLD is the Architecture Gate

- Implementation cannot start without HLD approval
- All architectural decisions happen here
- Changes after HLD approval require re-review
- Security and compliance are non-negotiable

### 7. DLD is the Implementation Gate

- Coding cannot start without DLD approval
- DLD must be detailed enough for ANY developer
- All ambiguities must be resolved
- Test strategy must be comprehensive

### 8. Maintain Traceability

- Update throughout project lifecycle
- Every MUST requirement MUST be traced to tests
- Use for impact analysis of change requests
- Required for compliance in regulated industries

---

## Common Patterns

### Pattern 1: New Enterprise Architecture Program

```bash
# 1. Establish governance
/arckit.principles Create architecture principles for our enterprise

# 2. For each major initiative, analyze stakeholders
/arckit.stakeholders Analyze stakeholders for CRM modernization
/arckit.stakeholders Analyze stakeholders for data platform migration

# 3. Identify and assess risks
/arckit.risk Create risk register for CRM modernization
/arckit.risk Create risk register for data platform migration

# 4. Create business case using risk register
/arckit.sobc Create SOBC for CRM modernization
/arckit.sobc Create SOBC for data platform migration

# 5. If approved, then create detailed requirements aligned to stakeholder goals
/arckit.requirements Create requirements for CRM modernization
/arckit.requirements Create requirements for data platform migration

# 6. Continue with each project...
```

### Pattern 2: Vendor Selection for Project

```bash
# 1. Analyze stakeholders
/arckit.stakeholders Analyze stakeholders for payment gateway project

# 2. Assess risks
/arckit.risk Create risk register for payment gateway

# 3. Create business case using risk register
/arckit.sobc Create SOBC for payment gateway modernization

# 4. If approved, define requirements based on stakeholder goals
/arckit.requirements Create requirements for payment gateway

# 5. Create data model with ERD and GDPR compliance
/arckit.data-model Create data model for payment gateway

# 6. Create strategic Wardley Map for build vs buy decisions
/arckit.wardley Create Wardley Map for payment gateway showing build vs buy strategy

# 7. Generate RFP
/arckit.sow Generate SOW for payment gateway project

# 8. After receiving proposals, evaluate
/arckit.evaluate Score Vendor A proposal for payment gateway
/arckit.evaluate Score Vendor B proposal for payment gateway
/arckit.evaluate Compare all vendors for payment gateway

# 9. Select vendor and review designs
/arckit.hld-review Review Vendor A HLD for payment gateway
/arckit.dld-review Review Vendor A DLD for payment gateway

# 10. Track implementation
/arckit.traceability Generate traceability for payment gateway
```

### Pattern 3: Design Review Gate

```bash
# 1. HLD review (architecture decision gate)
/arckit.hld-review Review HLD for project 001

# 2. If approved, move to detailed design
/arckit.dld-review Review DLD for project 001

# 3. If approved, implementation starts

# 4. Before release, verify traceability
/arckit.traceability Check coverage for project 001
```

---

## Troubleshooting

### "Architecture principles not found"

Run `/arckit.principles` first to establish governance rules.

### "Project doesn't exist"

The command will create the project automatically, or you can specify an existing project number.

### "HLD not approved yet"

DLD review requires HLD approval first. Complete HLD review and address all conditions.

### "Requirements not defined"

Run `/arckit.requirements` before generating SOW or evaluation criteria.

### "Gaps in traceability"

This is expected during implementation. Address CRITICAL gaps (MUST requirements without tests) before release.

---

## File Structure Reference

After using all commands, your project structure will look like:

```
my-arckit-project/
├── .arckit/
│   ├── memory/
│   │   └── architecture-principles.md      ← Global principles
│   ├── templates/                           ← Command templates
│   └── scripts/                             ← Automation scripts
│
├── projects/
│   └── 001-payment-gateway/
│       ├── stakeholder-drivers.md          ← /arckit.stakeholders
│       ├── risk-register.md                ← /arckit.risk (Orange Book)
│       ├── sobc.md                         ← /arckit.sobc (Strategic Outline Business Case)
│       ├── requirements.md                 ← /arckit.requirements
│       ├── sow.md                          ← /arckit.sow
│       ├── evaluation-criteria.md          ← /arckit.evaluate
│       ├── vendor-comparison.md            ← /arckit.evaluate (compare)
│       ├── traceability-matrix.md          ← /arckit.traceability
│       ├── coverage-report.md              ← /arckit.traceability
│       ├── gaps.md                         ← /arckit.traceability
│       │
│       └── vendors/
│           ├── acme-payment-solutions/
│           │   ├── proposal.pdf            (vendor's proposal)
│           │   ├── evaluation.md           ← /arckit.evaluate (score)
│           │   ├── hld.md                  (vendor's HLD)
│           │   ├── hld-review.md           ← /arckit.hld-review
│           │   ├── dld.md                  (vendor's DLD)
│           │   └── dld-review.md           ← /arckit.dld-review
│           │
│           └── bestpay-solutions/
│               └── ... (same structure)
│
└── .claude/commands/                        ← Slash commands
```

---

## Industry-Specific Notes

### Financial Services
- Add PCI-DSS, SOX compliance requirements
- Include audit trail requirements
- Focus on transaction integrity
- Strong encryption and key management

### Healthcare
- Add HIPAA compliance requirements
- Include PHI data handling principles
- Focus on consent management
- Patient data privacy by design

### Retail
- Add payment processing compliance (PCI)
- Include inventory system integration
- Focus on customer data privacy
- Scale for peak shopping seasons

### Government
- Add Section 508 accessibility
- Include public records requirements
- Focus on security clearances
- Compliance with government standards

---

## Support

For issues or questions:
- GitHub Issues: https://github.com/tractorjuice/arc-kit/issues
- Documentation: https://github.com/tractorjuice/arc-kit

---

**Last updated**: 2025-11-04
**ArcKit Version**: 0.8.3

### 19. `/arckit.backlog` - Product Backlog Generation

**Purpose**: Automatically generate prioritised product backlogs from ArcKit artifacts, converting requirements into sprint-ready GDS-format user stories.

**When to Use**: After HLD approval, before Sprint 1 (Alpha → Beta transition)

**Usage**:
```
/arckit.backlog
/arckit.backlog VELOCITY=25 SPRINTS=12
/arckit.backlog FORMAT=all PRIORITY=risk
```

**Arguments**:
- `SPRINT_LENGTH` (optional): Sprint duration - `1w`, `2w` (default), `3w`, `4w`
- `SPRINTS` (optional): Number of sprints to plan (default: 8)
- `VELOCITY` (optional): Team velocity in story points/sprint (default: 20)
- `FORMAT` (optional): Output formats - `markdown` (default), `csv`, `json`, `all`
- `PRIORITY` (optional): Prioritization approach - `multi` (default), `moscow`, `risk`, `value`, `dependency`

**What It Does**:

**1. Scans ArcKit Artifacts**:
- `requirements.md` - BRs, FRs, NFRs, INTs, DRs
- `hld.md` / `dld.md` - Component mapping
- `stakeholder-analysis.md` - User personas
- `risk-register.md` - Risk levels
- `business-case.md` - Value priorities
- `threat-model.md` - Security threats
- `principles.md` - Definition of Done

**2. Converts Requirements to User Stories**:

| Requirement Type | Converts To | Example |
|-----------------|-------------|---------|
| BR-xxx (Business) | Epic | Epic: User Authentication (34 points, 8 stories) |
| FR-xxx (Functional) | User Story | Story-001: Create user account (8 points) |
| NFR-xxx (Non-Functional) | Technical Task | Task-NFR-005: Implement Redis caching (5 points) |
| INT-xxx (Integration) | Integration Story | Story-015: Connect to Stripe API (8 points) |
| DR-xxx (Data) | Data Task | Task-DR-002: Design payment history schema (3 points) |

**3. Generates GDS-Compliant User Stories**:
```markdown
### Story-001: Create user account

**As a** new user
**I want** to create an account with email and password
**So that** I can access the service and save my preferences

**Acceptance Criteria**:
- It's done when I can enter email and password on registration form
- It's done when email verification is sent within 1 minute
- It's done when account is created after I verify my email
- It's done when GDPR consent is captured and stored

**Technical Tasks**:
- Task-001-A: Design user table schema (2 points)
- Task-001-B: Implement registration API (3 points)
- Task-001-C: Email verification service (3 points)

**Story Points**: 8
**Priority**: Must Have
**Sprint**: 1
**Component**: User Service
**Requirements**: FR-001, NFR-008 (GDPR)
```

**4. Multi-Factor Prioritization**:
```
Priority Score = (
  MoSCoW_Weight * 40% +
  Risk_Weight * 20% +
  Value_Weight * 20% +
  Dependency_Weight * 20%
)

Weights:
- MoSCoW: Must=4, Should=3, Could=2, Won't=1
- Risk: Critical=4, High=3, Medium=2, Low=1
- Value: High=4, Medium=3, Low=2, None=1
- Dependency: Blocks many=4, some=3, few=2, none=1
```

**5. Organizes into Sprint Plan**:

**Sprint Structure** (default 20-point velocity):
```
Sprint Capacity Allocation:
  60% Features (12 points) - User-facing value
  20% Technical (4 points) - Infrastructure, NFRs
  15% Testing (3 points) - Quality assurance
   5% Buffer (1 point) - Unexpected work

Sprint 1 - Foundation:
  ✅ User authentication (8+5 = 13 points)
  ✅ Database setup (2 points)
  ✅ CI/CD pipeline (2 points)
  ✅ Testing framework (1 point)
  ✅ Rate limiting (1 point)
  Buffer: Story-003 (5 points, move if needed)

Sprint 2 - Core Features:
  ✅ Payment integration (8 points)
  ✅ Process payment (8 points)
  ✅ Redis caching (3 points)
  ✅ GDPR audit log (2 points)
```

**Dependency Management**:
- Sprint 1 always: Auth, Database, CI/CD, Testing
- Technical foundation before features
- Integration points before dependent features

**6. Generates Traceability Matrix**:
```
| Requirement | Type | Stories | Sprint | Status |
|-------------|------|---------|--------|--------|
| BR-001 | Business | Story-001..008 | 1-2 | Planned |
| FR-001 | Functional | Story-001 | 1 | Planned |
| FR-005 | Functional | Story-016 | 2 | Planned |
| NFR-005 | Non-Functional | Task-NFR-005 | 2 | Planned |
```

**Output Files**:
```
projects/{project-dir}/
├── backlog.md (primary)
├── backlog.csv (Jira/Azure DevOps import)
└── backlog.json (API integration)
```

**Output Structure**:

**backlog.md Contents**:
1. Executive Summary
   - Total stories, epics, story points
   - Priority breakdown (Must/Should/Could)
   - Epic breakdown

2. How to Use section
   - Guidance for Product Owners
   - Guidance for Dev Teams
   - Guidance for Scrum Masters
   - Backlog refinement schedule

3. Epics Section
   - All epics with descriptions
   - Stories grouped by epic
   - Epic dependencies and points

4. Prioritized Backlog
   - All user stories (sorted by priority)
   - Technical tasks
   - Acceptance criteria
   - Story points and sprint assignments

5. Sprint Plan
   - Detailed sprint backlogs (Sprints 1-8)
   - Sprint goals
   - Dependencies and risks
   - Definition of Done

6. Appendices
   - Requirements traceability matrix
   - Dependency graph
   - Epic overview table
   - Story points distribution
   - Risk prioritization
   - Definition of Done criteria

**Story Point Estimation**:

Fibonacci sequence: **1, 2, 3, 5, 8, 13**

- **1 point**: Trivial, < 2 hours (config change)
- **2 points**: Simple, half day (basic form)
- **3 points**: Moderate, 1 day (API with validation)
- **5 points**: Complex, 2-3 days (workflow)
- **8 points**: Very complex, 1 week (major feature)
- **13+ points**: Too large - break down

**Time Savings**:

**Manual backlog creation**:
- Convert requirements: 2-3 weeks
- Prioritize and sequence: 1 week
- Sprint planning: 1 week
- **Total: 4-6 weeks (80-120 hours)**

**With /arckit.backlog**:
- Run command: 2-5 minutes
- Review and refine: 1-2 days
- Team refinement: 2-3 days
- **Total: 3-5 days (24-40 hours)**

**Time savings: 75-85%**

**Example - Real World**:

**Project**: NHS Appointment Booking System
**Requirements**: 65 (12 BR, 30 FR, 15 NFR, 5 INT, 3 DR)
**Team**: 8 developers, 2 testers
**Duration**: 16 weeks (8 sprints)

```bash
/arckit.backlog VELOCITY=25 SPRINTS=8
```

**Generated Backlog**:
- Total Stories: 45
- Total Epics: 8
- Total Story Points: 197
- Estimated Duration: 8 sprints (16 weeks at 25 points/sprint)

**Top Epics**:
1. User Registration & Authentication (34 points, 7 stories)
2. Appointment Booking (42 points, 9 stories)
3. NHS Spine Integration (28 points, 5 stories)
4. GP Practice Management (25 points, 6 stories)
5. Notifications (18 points, 4 stories)

**Sprint 1** (25 points):
- Story-001: Create patient account (8 pts) - Must Have
- Story-002: Patient login with NHS number (5 pts) - Must Have
- Task-DB-001: PostgreSQL setup (2 pts) - Must Have
- Task-CI-001: GitHub Actions CI/CD (2 pts) - Must Have
- Task-TEST-001: Jest + Supertest (2 pts) - Should Have
- Task-NFR-008: GDPR audit logging (1 pt) - Must Have
- Story-003: View appointments (3 pts) - Could Have [Buffer]

**Best Practices**:

**1. Velocity Calibration**:
- Initial velocity (20) is assumed
- After Sprint 1, calculate actual velocity
- Adjust Sprint 2+ capacity accordingly
- Track velocity trend over time

**2. Team Poker**:
- Review AI estimates with team
- Use team poker for consensus
- Re-estimate based on team context
- Track actual vs estimated

**3. Backlog Refinement**:
- Weekly: Refine next 2 sprints
- Bi-weekly: Groom beyond 2 sprints
- Monthly: Review epic priorities
- Per sprint: Update based on learnings

**4. Definition of Done**:
- Extracted from `principles.md`
- Applied to every story
- Includes quality, security, testing, documentation criteria

**Integration with Other Commands**:

**Inputs From**:
- `/arckit.requirements` - Source of all stories (BRs, FRs, NFRs)
- `/arckit.hld` - Component mapping
- `/arckit.stakeholders` - User personas
- `/arckit.risk-register` - Risk priorities
- `/arckit.business-case` - Value priorities
- `/arckit.threat-model` - Security stories

**Outputs To**:
- `/arckit.traceability` - Requirements → Stories → Sprints
- `/arckit.test-strategy` - Test cases from acceptance criteria
- `/arckit.analyze` - Backlog completeness validation

**Common Pitfalls**:

**❌ Don't**:
- Accept AI estimates without team validation
- Ignore dependencies (features before foundation)
- Let backlog go stale (no refinement)
- Skip DoD criteria
- Forget to track velocity after Sprint 1

**✅ Do**:
- Review and refine all story points with team
- Validate dependencies in sprint planning
- Refine backlog weekly
- Update DoD in principles.md
- Calibrate velocity after each sprint
- Re-generate when requirements change significantly

**Export Formats**:

**CSV (Jira/Azure DevOps import)**:
```csv
Type,Key,Epic,Summary,Description,Acceptance Criteria,Priority,Story Points,Sprint,Status
Epic,EPIC-001,,"User Management","Foundation epic",,Must Have,34,1-2,To Do
Story,STORY-001,EPIC-001,"Create user account","As a new user...",...,Must Have,8,1,To Do
Task,TASK-001-A,STORY-001,"Design user table schema","PostgreSQL schema",,Must Have,2,1,To Do
```

**JSON (API integration)**:
```json
{
  "project": "payment-gateway",
  "summary": {
    "total_stories": 87,
    "total_points": 342
  },
  "stories": [
    {
      "id": "STORY-001",
      "title": "Create user account",
      "as_a": "new user",
      "story_points": 8,
      "sprint": 1
    }
  ]
}
```

**Related Documentation**:
- [Product Backlog Guide](docs/guides/backlog.md)
- [Requirements Guide](docs/guides/requirements.md)
- [Traceability Guide](docs/guides/traceability.md)
- [GDS Agile Delivery](https://www.gov.uk/service-manual/agile-delivery)
- [GDS User Stories](https://www.gov.uk/service-manual/agile-delivery/writing-user-stories)

---

### 20. `/arckit.story` - Project Story & Governance Summary

**Purpose**: Create an executive-ready narrative that summarises delivery progress, governance outcomes, and next steps across the entire ArcKit lifecycle.

**Usage**:
```
/arckit.story Generate programme story for payment gateway
/arckit.story Create delivery update for Cabinet Office GenAI platform
```

**Prerequisites**:
- Core governance artifacts (`plan.md`, `principles.md`, `stakeholder-drivers.md`, `risk-register.md`, `sobc.md`)
- Delivery evidence (`requirements.md`, `traceability-matrix.md`, `backlog.md`, `hld-review.md`, `dld-review.md`)
- Latest compliance outputs (`dpia.md`, `/arckit.secure`, `/arckit.service-assessment` where applicable)

**What it does**:
- Builds a timeline of major milestones, decisions, and approvals mapped to GDS phases
- Highlights governance achievements (principles adoption, risk mitigation, compliance scores)
- Summarises delivery health: scope burn-up, velocity trends, outstanding actions
- Surfaces red/amber issues that require steering input and links back to source artifacts
- Provides stakeholder-specific call-outs and recommended next milestones
- Includes annexes with traceability snapshots and data protection status (e.g., DPIA readiness)

**Outputs**:
- `projects/NNN-project-name/story.md` (narrative)
- `projects/NNN-project-name/story-summary.md` (bullet executive briefing)
- Optional `story-slides.md` for rapid conversion into presentation format

**Next step**: Circulate with the steering group, update `/arckit.plan` gates if dates change, and feed actions into `/arckit.backlog` or governance registers.

---

### 21. `/arckit.jsp-936` - MOD JSP 936 AI Assurance Documentation

**Purpose**: Generate comprehensive JSP 936 (Dependable Artificial Intelligence in Defence) compliance documentation for UK Ministry of Defence AI/ML systems.

**Usage**:
```
/arckit.jsp-936 Generate JSP 936 documentation for threat detection ML system
/arckit.jsp-936 Assess satellite imagery analysis CNN model for JSP 936 compliance
/arckit.jsp-936 Create AI assurance for autonomous drone navigation
```

**What it does**:
- Identifies all AI/ML components in the project
- Performs ethical risk classification using likelihood × impact matrix (1-5 scale)
- Assesses against 5 Ethical Principles: Human-Centricity, Responsibility, Understanding, Bias & Harm Mitigation, Reliability
- Documents all 8 AI Lifecycle Phases: Planning, Requirements, Architecture, Algorithm Design, Model Development, V&V, Integration & Use, Quality Assurance
- Defines governance structure (RAISOs, Ethics Managers, Independent Assurance for Critical systems)
- Determines approval pathway based on risk classification:
  - **Critical (20-25)**: 2PUS or Ministerial approval
  - **Severe/Major (10-19)**: Defence-Level (JROC/IAC)
  - **Moderate/Minor (1-9)**: TLB-Level (delegated)
- Designs human-AI teaming strategy (human-in-loop, human-on-loop, human-out-of-loop)
- Assesses AI-specific security threats (adversarial examples, data poisoning, model extraction, model inversion, backdoors, drift)
- Documents supplier assurance (if third-party AI components)
- Creates continuous monitoring and re-assessment plan (drift detection, retraining triggers, annual review)
- Generates comprehensive compliance matrix (27 JSP 936 requirements)

**AI Component Types Identified**:
1. **Machine Learning Models**: Supervised/unsupervised learning, deep learning, neural networks
2. **AI Algorithms**: Decision trees, SVMs, Bayesian networks, expert systems
3. **Autonomous Systems**: Autonomous vehicles/drones, robotic systems, automated decision-making
4. **Decision Support Systems**: Recommendation engines, risk assessment tools, predictive analytics
5. **Natural Language Processing**: Chatbots, text classification, NER, machine translation
6. **Computer Vision**: Object detection, face recognition, image classification, video analysis
7. **Generative AI**: Large language models, image generation, synthetic data generation

**Ethical Risk Matrix**:
```
Risk Score = Likelihood (1-5) × Impact (1-5)

Likelihood: Rare (1) → Unlikely (2) → Possible (3) → Likely (4) → Almost Certain (5)
Impact: Insignificant (1) → Minor (2) → Moderate (3) → Major (4) → Catastrophic (5)

Classification:
20-25 = Critical → 2PUS/Ministerial approval
15-19 = Severe → Defence-Level approval
10-14 = Major → Defence-Level approval
5-9 = Moderate → TLB-Level approval
1-4 = Minor → TLB-Level approval
```

**Output**: `.arckit/jsp-936/jsp-936-assessment.md`

**When to use**:
- Discovery/Alpha: Initial ethical risk screening for AI/ML projects
- Alpha: Full JSP 936 assessment before significant development
- Beta: Updated assessment as AI system develops
- Live: Annual re-assessment and continuous monitoring

**Next steps**:
- Submit to Ethics Manager for review
- RAISO endorsement
- Independent assurance (if Critical classification)
- Submission to appropriate approval authority
- Continuous monitoring implementation

**Guide**: See [docs/guides/jsp-936.md](../docs/guides/jsp-936.md) for comprehensive guide

**Integration**:
- **Inputs From**: `/arckit.requirements`, `/arckit.architecture`, `/arckit.data-model`, `/arckit.mod-secure`
- **Complements**: `/arckit.ai-playbook`, `/arckit.atrs`, `/arckit.risk`
- **Outputs To**: `/arckit.backlog` (compliance tasks), `/arckit.traceability` (ethical requirements)

**Example - Threat Detection ML System**:

**AI Component**: Deep CNN for satellite imagery threat detection
- **Risk Assessment**: Likelihood 4 (Likely) × Impact 4 (Major) = 16 (Severe classification)
- **Approval**: Defence-Level (JROC/IAC)
- **Human-AI Teaming**: Human-on-loop (analyst monitors, can override)
- **Key Risks**: False negatives (missed threats), adversarial examples, bias in training data
- **Mitigations**: Diverse training data, adversarial robustness testing, explainability (heatmaps), continuous bias monitoring

---

*Last updated: 2025-11-04 | Version: 0.8.3*
