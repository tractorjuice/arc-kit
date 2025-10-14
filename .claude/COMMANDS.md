# ArcKit Slash Commands Reference

Complete guide to all ArcKit slash commands for Claude Code.

## Quick Reference

| Command | Purpose | When to Use |
|---------|---------|-------------|
| `/arckit.principles` | Create architecture principles | Start of organization/project |
| `/arckit.requirements` | Define comprehensive requirements | After principles, before vendor selection |
| `/arckit.sow` | Generate Statement of Work / RFP | After requirements, for vendor procurement |
| `/arckit.evaluate` | Evaluate vendor proposals | After receiving vendor responses |
| `/arckit.hld-review` | Review High-Level Design | After vendor selection, before implementation |
| `/arckit.dld-review` | Review Detailed Design | After HLD approval, before coding |
| `/arckit.traceability` | Generate traceability matrix | Throughout project, especially before release |

---

## Workflow Overview

```
1. /arckit.principles
   ↓ (establishes governance rules)

2. /arckit.requirements
   ↓ (defines what you need)

3. /arckit.sow
   ↓ (creates RFP for vendors)

4. /arckit.evaluate
   ↓ (scores vendor proposals)

5. /arckit.hld-review
   ↓ (reviews architecture before build)

6. /arckit.dld-review
   ↓ (reviews technical details before code)

7. Implementation happens
   ↓

8. /arckit.traceability
   ↓ (verifies all requirements met)

9. Release!
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

**Next step**: Run `/arckit.requirements` to create project requirements that align with these principles.

---

### 2. `/arckit.requirements` - Requirements Definition

**Purpose**: Create comprehensive business and technical requirements for a project.

**Usage**:
```
/arckit.requirements Create requirements for payment gateway modernization
/arckit.requirements Define requirements for customer portal project
/arckit.requirements Add compliance requirements to project 001
```

**What it does**:
- Creates new project in `projects/NNN-project-name/`
- Generates comprehensive requirements document
- Links requirements to architecture principles
- Includes Business, Functional, Non-Functional, Integration, and Data requirements
- Each requirement has unique ID, acceptance criteria, and priority

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

**Next step**: Run `/arckit.sow` to generate RFP document for vendor procurement.

---

### 3. `/arckit.sow` - Statement of Work / RFP

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

### 4. `/arckit.evaluate` - Vendor Evaluation

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

### 5. `/arckit.hld-review` - High-Level Design Review

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

### 6. `/arckit.dld-review` - Detailed Design Review

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

### 7. `/arckit.traceability` - Traceability Matrix

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
2. Requirements SECOND (defines what you need)
3. SOW/RFP THIRD (procurement)
4. Evaluate vendors
5. HLD review (architecture gate)
6. DLD review (implementation gate)
7. Traceability (verification)

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

# 2. For each major initiative, create requirements
/arckit.requirements Create requirements for CRM modernization
/arckit.requirements Create requirements for data platform migration

# 3. Continue with each project...
```

### Pattern 2: Vendor Selection for Project

```bash
# 1. Define requirements
/arckit.requirements Create requirements for payment gateway

# 2. Generate RFP
/arckit.sow Generate SOW for payment gateway project

# 3. After receiving proposals, evaluate
/arckit.evaluate Score Vendor A proposal for payment gateway
/arckit.evaluate Score Vendor B proposal for payment gateway
/arckit.evaluate Compare all vendors for payment gateway

# 4. Select vendor and review designs
/arckit.hld-review Review Vendor A HLD for payment gateway
/arckit.dld-review Review Vendor A DLD for payment gateway

# 5. Track implementation
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
│       ├── requirements.md                  ← /arckit.requirements
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

**Last updated**: 2025-10-14
**ArcKit Version**: 0.1.0
