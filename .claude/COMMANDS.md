# ArcKit Slash Commands Reference

Complete guide to all ArcKit slash commands for Claude Code.

## Quick Reference

| Command | Purpose | When to Use |
|---------|---------|-------------|
| `/arckit.principles` | Create architecture principles | Start of organization/project |
| `/arckit.stakeholders` | Analyze stakeholder drivers, goals, and outcomes | After principles, BEFORE business case |
| `/arckit.sobc` | Create Strategic Outline Business Case (SOBC) | After stakeholders, BEFORE requirements |
| `/arckit.requirements` | Define comprehensive requirements | After SOBC approval, before vendor selection |
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

3. /arckit.sobc
   ↓ (create business case to justify investment)

4. /arckit.requirements
   ↓ (if approved, define detailed requirements)

5. /arckit.sow
   ↓ (creates RFP for vendors)

6. /arckit.evaluate
   ↓ (scores vendor proposals)

7. /arckit.hld-review
   ↓ (reviews architecture before build)

8. /arckit.dld-review
   ↓ (reviews technical details before code)

9. Implementation happens
   ↓

10. /arckit.traceability
   ↓ (verifies all requirements met)

11. Release!
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

**Next step**: Create Strategic Outline Business Case with `/arckit.sobc` to justify investment and secure approval.

---

### 3. `/arckit.sobc` - Strategic Outline Business Case

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

### 4. `/arckit.requirements` - Requirements Definition

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

**Next step**: Use `/arckit.sow` for vendor procurement, or `/arckit.wardley` for strategic build vs buy analysis.

---

### 5. `/arckit.sow` - Statement of Work / RFP

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

### 6. `/arckit.evaluate` - Vendor Evaluation

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

### 7. `/arckit.hld-review` - High-Level Design Review

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

### 8. `/arckit.dld-review` - Detailed Design Review

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

### 9. `/arckit.traceability` - Traceability Matrix

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
3. Business Case THIRD (justify investment with SOBC)
4. Requirements FOURTH (if approved, define detailed requirements aligned to stakeholder goals)
5. SOW/RFP FIFTH (procurement)
6. Evaluate vendors
7. HLD review (architecture gate)
8. DLD review (implementation gate)
9. Traceability (verification)

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

# 3. Create business case to justify investment
/arckit.sobc Create SOBC for CRM modernization
/arckit.sobc Create SOBC for data platform migration

# 4. If approved, then create detailed requirements aligned to stakeholder goals
/arckit.requirements Create requirements for CRM modernization
/arckit.requirements Create requirements for data platform migration

# 5. Continue with each project...
```

### Pattern 2: Vendor Selection for Project

```bash
# 1. Analyze stakeholders
/arckit.stakeholders Analyze stakeholders for payment gateway project

# 2. Create business case to justify investment
/arckit.sobc Create SOBC for payment gateway modernization

# 3. If approved, define requirements based on stakeholder goals
/arckit.requirements Create requirements for payment gateway

# 4. Generate RFP
/arckit.sow Generate SOW for payment gateway project

# 5. After receiving proposals, evaluate
/arckit.evaluate Score Vendor A proposal for payment gateway
/arckit.evaluate Score Vendor B proposal for payment gateway
/arckit.evaluate Compare all vendors for payment gateway

# 6. Select vendor and review designs
/arckit.hld-review Review Vendor A HLD for payment gateway
/arckit.dld-review Review Vendor A DLD for payment gateway

# 7. Track implementation
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
