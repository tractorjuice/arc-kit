# ArcKit Slash Commands Reference

Complete guide to all ArcKit slash commands for Claude Code.

## Quick Reference

| Command | Purpose | When to Use |
|---------|---------|-------------|
| `/arckit.principles` | Create architecture principles | Start of organization/project |
| `/arckit.stakeholders` | Analyze stakeholder drivers, goals, and outcomes | After principles, BEFORE risk assessment |
| `/arckit.risk` | Create comprehensive risk register (Orange Book) | After stakeholders, BEFORE business case |
| `/arckit.sobc` | Create Strategic Outline Business Case (SOBC) | After risk assessment, BEFORE requirements |
| `/arckit.requirements` | Define comprehensive requirements | After SOBC approval, before data modeling |
| `/arckit.data-model` | Create comprehensive data model with ERD | After requirements, before vendor selection |
| `/arckit.wardley` | Create strategic Wardley Maps | Strategic planning, build vs buy decisions |
| `/arckit.diagram` | Generate architecture diagrams (Mermaid) | Visualize system structure throughout project |
| `/arckit.sow` | Generate Statement of Work / RFP | After requirements, for vendor procurement |
| `/arckit.evaluate` | Evaluate vendor proposals | After receiving vendor responses |
| `/arckit.hld-review` | Review High-Level Design | After vendor selection, before implementation |
| `/arckit.dld-review` | Review Detailed Design | After HLD approval, before coding |
| `/arckit.servicenow` | Generate ServiceNow service design | After architecture, bridge to operations |
| `/arckit.traceability` | Generate traceability matrix | Throughout project, especially before release |
| `/arckit.analyze` | Comprehensive quality analysis | Periodically throughout project |
| `/arckit.tcop` | UK Gov Technology Code of Practice assessment | UK Government projects (all phases) |
| `/arckit.ai-playbook` | UK Gov AI Playbook compliance | UK Government AI projects |
| `/arckit.atrs` | UK Gov Algorithmic Transparency Record | UK Government AI systems |
| `/arckit.secure` | UK Gov Secure by Design (civilian) | UK Government security assessment |
| `/arckit.mod-secure` | MOD Secure by Design (defence) | UK Ministry of Defence security assessment |

---

## Workflow Overview

```
1. /arckit.principles
   ↓ (establishes governance rules)

2. /arckit.stakeholders
   ↓ (understand who cares, what they need, why)

3. /arckit.risk
   ↓ (identify and assess risks - Orange Book)

4. /arckit.sobc
   ↓ (create business case using risk register)

5. /arckit.requirements
   ↓ (if approved, define detailed requirements)

6. /arckit.data-model
   ↓ (create data model with ERD, GDPR compliance)

7. /arckit.wardley
   ↓ (strategic planning, build vs buy decisions)

8. /arckit.sow
   ↓ (creates RFP for vendors)

9. /arckit.evaluate
   ↓ (scores vendor proposals)

10. /arckit.hld-review
   ↓ (reviews architecture before build)

11. /arckit.dld-review
   ↓ (reviews technical details before code)

12. Implementation happens
   ↓

13. /arckit.traceability
   ↓ (verifies all requirements met)

14. Release!
```

---

## Command Details

### 1. `/arckit.principles` - Architecture Principles

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

### 2. `/arckit.stakeholders` - Stakeholder Drivers & Goals Analysis

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

### 3. `/arckit.risk` - Risk Management (Orange Book)

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
- Risks exceeding organizational appetite
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

### 4. `/arckit.sobc` - Strategic Outline Business Case

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
- Strategic fit and alignment with organizational strategy
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

### 5. `/arckit.requirements` - Requirements Definition

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

### 6. `/arckit.data-model` - Data Model with ERD

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

**Next step**: Use `/arckit.sow` for vendor procurement, or `/arckit.hld-review` to validate database choices.

---

### 7. `/arckit.sow` - Statement of Work / RFP

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

### 8. `/arckit.evaluate` - Vendor Evaluation

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

### 9. `/arckit.hld-review` - High-Level Design Review

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
- **Performance**: Caching? Database optimization?
- **Operational Excellence**: Monitoring? CI/CD? Runbooks?

**Approval status**:
- ✅ **APPROVED**: Ready for DLD
- ⚠️ **APPROVED WITH CONDITIONS**: Fix blocking items first
- ❌ **REJECTED**: Major issues, needs redesign

**Output**: `projects/NNN-project-name/vendors/vendor-name/hld-review.md`

**Next step**: After HLD approval, request DLD and use `/arckit.dld-review`.

---

### 10. `/arckit.dld-review` - Detailed Design Review

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

### 11. `/arckit.traceability` - Traceability Matrix

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

**Last updated**: 2025-10-20
**ArcKit Version**: 0.2.2
