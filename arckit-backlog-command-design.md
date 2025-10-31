# ArcKit Backlog Command - Design Specification

## Executive Summary

**Command**: `/arckit.backlog`

**Purpose**: Generate a prioritized product backlog from existing ArcKit artifacts, converting requirements into actionable user stories, epics, and technical tasks organized for sprint planning.

**When to Use**:
- At start of Beta phase (after HLD approval)
- Before sprint planning begins
- When transitioning from design to implementation
- To refresh backlog mid-project based on updated artifacts

**Output**: `projects/{project-name}/backlog.md` (+ optional CSV/JSON exports)

---

## Problem Statement

### Current Gap

Teams transitioning from ArcKit design phase (Discovery/Alpha) to implementation (Beta) face a **translation gap**:

1. **Requirements exist but aren't sprint-ready**:
   - FR-001: "System shall process payments" ≠ sprintable user story
   - No acceptance criteria for developers
   - No story points or estimates
   - No dependency mapping

2. **No prioritization framework**:
   - Which requirements to build first?
   - How to sequence based on dependencies?
   - How to balance risk, value, and technical foundation?

3. **Manual backlog creation is time-consuming**:
   - Typical project: 50-100 requirements → 200-400 user stories
   - Manual conversion: 2-4 weeks
   - Prone to missed requirements and broken traceability

4. **Disconnect between architects and delivery teams**:
   - Architects write HLDs
   - Developers need user stories
   - Manual translation loses context and traceability

### What Teams Need

A command that automatically:
- Converts requirements into user stories with GDS format
- Breaks down epics into sprint-sized stories
- Prioritizes using MoSCoW + dependencies + risk
- Creates technical tasks for NFRs and infrastructure
- Organizes into recommended sprint plan
- Maintains traceability to requirements and design

---

## Research Findings

### GDS User Story Format (from gov.uk/service-manual)

**Structure**:
```
As a [user type]
I need/want/expect to [action]
So that [goal]

Acceptance Criteria:
- It's done when [measurable outcome 1]
- It's done when [measurable outcome 2]
- It's done when [measurable outcome 3]
```

**Example from Electoral Register**:
```
As a UK resident
I want to get my details on the electoral register
So that I can vote

Acceptance Criteria:
- It's done when I can submit my registration online
- It's done when I receive confirmation within 24 hours
- It's done when my details appear in the register
```

### GDS Backlog Management Principles

1. **Product Backlog**: All stories not yet started, prioritized
2. **Sprint Backlog**: Stories committed for current iteration
3. **Epic Breakdown**: Stories >1 week should be split
4. **Team Ownership**: Whole team writes and uses stories
5. **Regular Refinement**: Backlog reviewed and reprioritized
6. **Transparency**: Visible to all stakeholders

### Prioritization Approaches

**MoSCoW Method** (common in UK Gov):
- **Must Have**: Legal/regulatory requirements, critical path items
- **Should Have**: Important but not critical, workarounds exist
- **Could Have**: Desirable but not necessary for go-live
- **Won't Have**: Explicitly deferred to future releases

**Risk-Based Prioritization**:
- High-risk items tackled early (prove feasibility)
- Reduces uncertainty before late-stage surprises
- From /arckit.risk-register

**Dependency-Based Sequencing**:
- Technical foundation first (APIs, databases, auth)
- Integration points before dependent features
- Testing infrastructure before features

**Value-Based Prioritization**:
- From business requirements and business case
- High-value features prioritized (MVP focus)
- Early delivery of user-facing value

---

## Command Design

### Usage

```bash
# Basic usage - generate backlog for current project
/arckit.backlog

# Specify sprint duration (default: 2 weeks)
/arckit.backlog SPRINT_LENGTH=2w

# Generate with sprint planning (specify number of sprints)
/arckit.backlog SPRINTS=6

# Export formats
/arckit.backlog FORMAT=markdown,csv,json

# Prioritization approach
/arckit.backlog PRIORITY=moscow,risk,value,dependency

# Velocity for sprint sizing (story points per sprint)
/arckit.backlog VELOCITY=20
```

### Input: ArcKit Artifacts to Scan

The command analyzes existing project artifacts:

1. **Requirements** (`requirements.md`):
   - **Business Requirements (BR-xxx)** → Epics
   - **Functional Requirements (FR-xxx)** → User Stories
   - **Non-Functional Requirements (NFR-xxx)** → Technical Tasks
   - **Integration Requirements (INT-xxx)** → Integration Stories
   - **Data Requirements (DR-xxx)** → Data Tasks

2. **Architecture** (`hld.md`, `dld.md`):
   - Components → Technical Tasks (build component X)
   - APIs → Integration Stories
   - Databases → Data Tasks
   - Infrastructure → DevOps Tasks

3. **Stakeholder Analysis** (`stakeholder-analysis.md`):
   - Stakeholder types → User personas
   - User roles → "As a..." statement

4. **Risk Register** (`risk-register.md`):
   - High/Critical risks → Early priority tasks
   - Risk mitigation actions → Dedicated stories

5. **Threat Model** (`threat-model.md`):
   - STRIDE threats → Security Stories
   - Mitigations → Security Tasks

6. **Test Strategy** (`test-strategy.md`):
   - Test types → Test Tasks
   - Test infrastructure → Setup Tasks

7. **Principles** (`principles.md`):
   - Technical constraints → Definition of Done criteria

### Processing Logic

#### Step 1: Extract and Classify Requirements

Parse all requirements and classify by type:

```
FR-001: Payment Processing
  → User Story: "Process credit card payment"

NFR-005: Response time < 2 seconds
  → Technical Task: "Implement caching layer"

INT-003: Integrate with Stripe API
  → Integration Story: "Connect to Stripe payment gateway"

DR-002: Store user payment history
  → Data Task: "Design payment_history table"
```

#### Step 2: Generate User Stories from FRs

**Conversion Algorithm**:

```
For each FR-xxx:
  1. Extract action verb (process, create, update, delete, view, etc.)
  2. Identify actor from stakeholder analysis
  3. Infer goal from parent BR or FR description
  4. Generate "As a... I want... So that..." format
  5. Create acceptance criteria from FR's acceptance criteria
  6. Add story points estimate (Fibonacci: 1,2,3,5,8,13)
  7. Tag with component from HLD
```

**Example Conversion**:

```markdown
**FR-005**: System shall allow users to submit payment details securely

↓ Converts to ↓

**Story-005**: Process secure payment
As a service user
I want to submit my payment details securely
So that I can pay for the service without my information being compromised

Acceptance Criteria:
- It's done when payment form uses HTTPS
- It's done when card details are not stored (PCI-DSS)
- It's done when payment confirmation is displayed
- It's done when payment receipt is emailed

Story Points: 5
Priority: Must Have
Epic: Payment Processing
Component: Payment Service (from HLD)
Requirements: FR-005, NFR-012 (security), NFR-008 (PCI-DSS)
```

#### Step 3: Group into Epics

```
Epics are created from:
  1. Business Requirements (BR-xxx) → Natural epic grouping
  2. Major features in HLD (e.g., "Payment System")
  3. Integration points (e.g., "Stripe Integration")
  4. Cross-cutting concerns (e.g., "Security Hardening")

Epic hierarchy:
  Epic
    ↓
  User Stories (3-10 per epic)
    ↓
  Technical Tasks (1-5 per story)
```

**Example Epic Structure**:

```markdown
## Epic 1: User Registration and Authentication (BR-001)

Priority: Must Have
Business Value: High (enables all other features)
Risk: Medium (GDPR compliance required)
Dependencies: None (foundation epic)
Total Story Points: 34

### Stories in this Epic:

**Story-001**: Create user account (8 points)
As a new user
I want to create an account
So that I can access the service

Acceptance Criteria:
- It's done when I can enter email and password
- It's done when email verification is sent
- It's done when account is created after verification
- It's done when GDPR consent is recorded

Tasks:
- Task-001-A: Design user table schema (2 points)
- Task-001-B: Implement registration API endpoint (3 points)
- Task-001-C: Create email verification service (3 points)

---

**Story-002**: User login (5 points)
As a registered user
I want to log in to my account
So that I can access my personalized dashboard

Acceptance Criteria:
- It's done when I can login with email/password
- It's done when invalid credentials show error
- It's done when successful login redirects to dashboard
- It's done when session expires after 30 minutes

Tasks:
- Task-002-A: Implement authentication middleware (2 points)
- Task-002-B: Create login UI (2 points)
- Task-002-C: Add session management (1 point)

[... more stories in epic ...]
```

#### Step 4: Create Technical Tasks

From NFRs, infrastructure, and technical debt:

```markdown
**Task-NFR-005**: Implement Redis caching layer
Type: Technical Task (NFR)
Requirement: NFR-005 (Response time < 2s)
Priority: Should Have
Story Points: 5
Sprint: 2

Description:
Implement Redis caching to meet response time requirements.
Cache frequently accessed data (user sessions, product catalog).

Acceptance Criteria:
- It's done when Redis is deployed and configured
- It's done when cache hit rate > 80% for user sessions
- It's done when P95 response time < 2 seconds
- It's done when cache invalidation strategy is implemented

Dependencies: Task-001-A (database schema must exist)
```

#### Step 5: Prioritization

**Multi-Factor Prioritization Algorithm**:

```
Priority Score = (
  MoSCoW_Weight * 40% +
  Risk_Weight * 20% +
  Value_Weight * 20% +
  Dependency_Weight * 20%
)

MoSCoW_Weight:
  Must Have = 4
  Should Have = 3
  Could Have = 2
  Won't Have = 1

Risk_Weight (from risk register):
  Critical = 4
  High = 3
  Medium = 2
  Low = 1

Value_Weight (from business case):
  High ROI / user impact = 4
  Medium = 3
  Low = 2
  None = 1

Dependency_Weight:
  Blocks many items = 4
  Blocks some items = 3
  Blocks few items = 2
  Blocks nothing = 1

Then sort backlog by Priority Score descending.
```

**Dependency Rules**:

```
1. Technical foundation before features
   - Auth system before user features
   - Database schema before data operations
   - API gateway before integrations

2. Integration points before dependent features
   - Stripe API before payment processing UI
   - Email service before notifications

3. Test infrastructure before features
   - Unit test framework Sprint 1
   - Integration test setup Sprint 2
   - CI/CD pipeline Sprint 1

4. Security hardening throughout
   - Not left to end
   - Distributed across sprints
```

#### Step 6: Sprint Planning

**Sprint Sizing Algorithm**:

```
Inputs:
  - Team velocity (story points per sprint, default: 20)
  - Sprint length (default: 2 weeks)
  - Number of sprints (from timeline, default: 8-12)

Process:
  1. Sort backlog by priority score
  2. For each sprint (1..N):
     a. Add highest priority stories until velocity reached
     b. Check dependencies are met
     c. Balance story types (not all technical tasks)
     d. Include testing tasks (20% of capacity)
     e. Include bug buffer (10% of capacity)
  3. Generate sprint backlog for each sprint

Balancing Rules:
  - Max 60% feature stories per sprint
  - Min 20% technical tasks per sprint
  - Min 15% testing tasks per sprint
  - 5% bug buffer per sprint
```

**Sprint Structure**:

```markdown
## Sprint 1: Foundation (Weeks 1-2)

Velocity: 20 story points
Theme: Technical foundation and core infrastructure

### Must Have (12 points):
- Story-001: Create user account (8 points) [Epic: Authentication]
- Task-DB-001: Setup PostgreSQL database (2 points) [Epic: Infrastructure]
- Task-CI-001: Setup CI/CD pipeline (2 points) [Epic: DevOps]

### Should Have (6 points):
- Story-002: User login (5 points) [Epic: Authentication]
- Task-TEST-001: Setup Jest testing framework (1 point) [Epic: Testing]

### Could Have (2 points):
- Story-003: Password reset (3 points) [Epic: Authentication]
  → Carry to Sprint 2 if capacity issues

### Testing Tasks:
- Test-001: Unit tests for user registration (included in story points)
- Test-002: Integration test for login flow (included in story points)

### Dependencies Satisfied:
✅ None (foundation sprint)

### Dependencies Created:
→ Sprint 2 requires: User auth (Story-001, Story-002)
→ Sprint 2 requires: Database (Task-DB-001)

### Sprint Goals:
- Deploy working CI/CD pipeline
- Users can create accounts and login
- Unit testing framework operational
- Database schema v1 deployed to dev environment

### Definition of Done (from principles):
- [ ] Code reviewed and approved
- [ ] Unit tests written (80% coverage)
- [ ] Security scan passed (no critical issues)
- [ ] Documentation updated
- [ ] Deployed to dev environment
- [ ] Demo-able to stakeholders
```

### Output Format

#### Primary Output: `backlog.md`

```markdown
# Product Backlog: {Project Name}

**Generated**: 2025-10-30
**Project**: {project-name}
**Phase**: Beta (Implementation)
**Team Velocity**: 20 points/sprint (assumed, adjust as team establishes velocity)
**Sprint Length**: 2 weeks
**Total Sprints**: 8 (16 weeks)

---

## Executive Summary

**Total Stories**: 87
**Total Epics**: 12
**Total Story Points**: 342
**Estimated Duration**: 18 sprints (36 weeks at 20 points/sprint)

### Priority Breakdown:
- Must Have: 45 stories (180 points) - 53%
- Should Have: 28 stories (98 points) - 29%
- Could Have: 14 stories (64 points) - 18%

### Epic Breakdown:
1. User Authentication (34 points, 8 stories)
2. Payment Processing (56 points, 12 stories)
3. Integration with Stripe (28 points, 6 stories)
[... all epics listed ...]

---

## Backlog Items (Prioritized)

### Epic 1: User Authentication (34 points)

**Priority**: Must Have
**Business Value**: High - Foundation for all user-facing features
**Risk**: Medium - GDPR compliance critical
**Dependencies**: None (foundation epic)

#### Story-001: Create user account (8 points)

**Priority**: Must Have
**As a** new user
**I want** to create an account
**So that** I can access the service

**Acceptance Criteria**:
- It's done when I can enter email and password
- It's done when email verification is sent
- It's done when account is created after verification
- It's done when GDPR consent is recorded

**Technical Tasks**:
- Task-001-A: Design user table schema (2 points)
- Task-001-B: Implement registration API (3 points)
- Task-001-C: Email verification service (3 points)

**Requirements Traceability**:
- FR-001: User Registration
- NFR-008: GDPR Compliance
- NFR-012: Email Verification

**Component**: User Service (from HLD)
**Sprint**: 1
**Dependencies**: None

---

[... continue for all stories ...]

---

## Sprint Plan

### Sprint 1: Foundation (Weeks 1-2, 20 points)

**Theme**: Core infrastructure and authentication foundation

**Stories**:
1. Story-001: Create user account (8 points) - Must Have
2. Story-002: User login (5 points) - Must Have
3. Task-DB-001: PostgreSQL setup (2 points) - Must Have
4. Task-CI-001: CI/CD pipeline (2 points) - Must Have
5. Task-TEST-001: Testing framework (1 point) - Should Have
6. Story-003: Password reset (3 points) - Could Have [Buffer]

**Sprint Goal**: Users can register and login; dev infrastructure operational

**Dependencies**: None (foundation sprint)

**Risks**:
- GDPR compliance review needed (Story-001)
- Email service selection (Story-001)

**Testing**: Unit tests for auth flows, integration test for login

---

### Sprint 2: Core Features (Weeks 3-4, 20 points)

**Theme**: Payment integration foundation

**Stories**:
1. Story-015: Connect to Stripe API (8 points) - Must Have
2. Story-016: Process credit card payment (8 points) - Must Have
3. Task-NFR-005: Redis caching (5 points) - Should Have
[... more stories ...]

**Dependencies**:
✅ Sprint 1: User authentication (Story-001, Story-002)
✅ Sprint 1: Database (Task-DB-001)

**Risks**:
- Stripe sandbox environment access needed
- PCI-DSS compliance requirements

---

[... continue for all sprints ...]

---

## Appendices

### A. Requirements Traceability Matrix

| Requirement | User Stories | Sprint | Status |
|-------------|-------------|--------|--------|
| BR-001: User Management | Story-001, Story-002, Story-003 | 1 | Planned |
| FR-001: User Registration | Story-001 | 1 | Planned |
| FR-002: User Login | Story-002 | 1 | Planned |
| NFR-005: Response time | Task-NFR-005 | 2 | Planned |
[... all requirements mapped ...]

### B. Dependency Graph

```
Sprint 1 (Foundation)
  ├─ Story-001: User Registration
  ├─ Story-002: User Login
  ├─ Task-DB-001: Database Setup
  └─ Task-CI-001: CI/CD Pipeline
        ↓
Sprint 2 (Core Features)
  ├─ Story-015: Stripe Integration (depends: Story-001)
  └─ Story-016: Payment Processing (depends: Story-015)
        ↓
Sprint 3 (Feature Build)
  └─ Story-025: User Payment History (depends: Story-016)
```

### C. Epic Overview

| Epic | Stories | Points | Priority | Dependencies |
|------|---------|--------|----------|--------------|
| 1. User Authentication | 8 | 34 | Must Have | None |
| 2. Payment Processing | 12 | 56 | Must Have | Epic 1 |
| 3. Stripe Integration | 6 | 28 | Must Have | Epic 1 |
[... all epics ...]

### D. Story Points Distribution

```
Sprint 1:  ████████████████████ 20 points
Sprint 2:  ████████████████████ 20 points
Sprint 3:  ████████████████████ 20 points
Sprint 4:  ████████████████████ 20 points
Sprint 5:  ████████████████████ 20 points
Sprint 6:  ████████████████████ 20 points
Sprint 7:  ████████████████████ 20 points
Sprint 8:  ████████████████████ 20 points
Total: 160 points allocated / 342 points total
Remaining: 182 points (9 more sprints needed)
```

### E. Risk-Based Prioritization

**High Risk Items (Addressed Early)**:
- Sprint 1: GDPR compliance implementation (Story-001)
- Sprint 2: PCI-DSS payment security (Story-016)
- Sprint 3: Stripe API integration stability (Story-015)

**Medium Risk Items**:
- Sprint 4-6: Performance optimization (Task-NFR-005, Task-NFR-007)
- Sprint 5: Third-party integrations (INT-003, INT-005)

### F. Definition of Done (from Architecture Principles)

Every story must meet these criteria before marking "Done":

- [ ] Code reviewed by 2+ team members
- [ ] Unit tests written (minimum 80% coverage)
- [ ] Integration tests written for API endpoints
- [ ] Security scan passed (no critical/high vulnerabilities)
- [ ] Performance tested (meets NFR thresholds)
- [ ] Documentation updated (API docs, runbooks)
- [ ] Accessibility tested (WCAG 2.1 AA)
- [ ] Deployed to dev environment
- [ ] Demoed to Product Owner
- [ ] Acceptance criteria verified

---

**End of Backlog**

---

## How to Use This Backlog

### For Product Owners:
1. Review epic priorities - adjust based on business needs
2. Refine story acceptance criteria before sprint planning
3. Validate user stories with actual users
4. Adjust sprint sequence based on stakeholder priorities

### For Development Teams:
1. Review stories in upcoming sprint (Sprint Planning)
2. Break down stories into tasks (if needed)
3. Estimate effort (use story points as guide)
4. Identify technical blockers early
5. Update story status as work progresses

### For Scrum Masters:
1. Track velocity after each sprint
2. Adjust future sprint loading based on actual velocity
3. Monitor dependency chains
4. Escalate blockers early
5. Facilitate backlog refinement sessions

### Backlog Refinement:
- **Weekly**: Review and refine next 2 sprints
- **Bi-weekly**: Groom backlog beyond 2 sprints
- **Monthly**: Reassess epic priorities
- **Per sprint**: Update based on completed work and learnings

---

**Note**: This backlog was auto-generated from ArcKit artifacts. It should be reviewed and refined by the team before sprint planning begins. Story points are estimates and should be re-estimated by the delivery team based on their velocity and capacity.

```

#### Secondary Outputs

**CSV Export** (`backlog.csv` for Jira/Azure DevOps import):

```csv
Type,Key,Epic,Summary,Description,Acceptance Criteria,Priority,Story Points,Sprint,Status,Assignee,Component,Requirements
Epic,EPIC-001,,"User Authentication","Foundation epic for user management",,Must Have,34,1-2,To Do,,User Service,BR-001
Story,STORY-001,EPIC-001,"Create user account","As a new user I want to create an account so that I can access the service","It's done when I can enter email and password; It's done when email verification is sent; It's done when account is created after verification; It's done when GDPR consent is recorded",Must Have,8,1,To Do,,User Service,"FR-001, NFR-008, NFR-012"
Task,TASK-001-A,STORY-001,"Design user table schema","PostgreSQL schema for users table with GDPR fields",,Must Have,2,1,To Do,,User Service,FR-001
[... all items ...]
```

**JSON Export** (`backlog.json` for API integration):

```json
{
  "project": "payment-gateway-modernization",
  "generated": "2025-10-30",
  "team_velocity": 20,
  "sprint_length": "2 weeks",
  "total_sprints": 8,
  "summary": {
    "total_stories": 87,
    "total_epics": 12,
    "total_points": 342,
    "must_have_points": 180,
    "should_have_points": 98,
    "could_have_points": 64
  },
  "epics": [
    {
      "id": "EPIC-001",
      "title": "User Authentication",
      "priority": "Must Have",
      "points": 34,
      "stories": [
        {
          "id": "STORY-001",
          "title": "Create user account",
          "as_a": "new user",
          "i_want": "to create an account",
          "so_that": "I can access the service",
          "acceptance_criteria": [
            "It's done when I can enter email and password",
            "It's done when email verification is sent",
            "It's done when account is created after verification",
            "It's done when GDPR consent is recorded"
          ],
          "priority": "Must Have",
          "story_points": 8,
          "sprint": 1,
          "status": "To Do",
          "requirements": ["FR-001", "NFR-008", "NFR-012"],
          "component": "User Service",
          "tasks": [
            {
              "id": "TASK-001-A",
              "title": "Design user table schema",
              "points": 2,
              "sprint": 1
            }
          ]
        }
      ]
    }
  ],
  "sprints": [
    {
      "number": 1,
      "duration": "Weeks 1-2",
      "theme": "Foundation",
      "velocity": 20,
      "stories": ["STORY-001", "STORY-002"],
      "tasks": ["TASK-DB-001", "TASK-CI-001"],
      "dependencies": [],
      "risks": ["GDPR compliance review needed"]
    }
  ]
}
```

---

## Integration with Existing ArcKit Commands

### Inputs From:

1. **`/arckit.requirements`** → Source of all stories
   - BRs → Epics
   - FRs → User Stories
   - NFRs → Technical Tasks
   - INTs → Integration Stories
   - DRs → Data Tasks

2. **`/arckit.hld`** → Component mapping
   - Assigns stories to HLD components
   - Identifies infrastructure tasks

3. **`/arckit.stakeholders`** → User personas
   - Generates "As a [persona]..." statements
   - Prioritizes by stakeholder power/interest

4. **`/arckit.risk-register`** → Risk-based prioritization
   - High-risk items addressed early
   - Creates risk mitigation stories

5. **`/arckit.threat-model`** → Security stories
   - STRIDE threats → Security Stories
   - Mitigations → Security Tasks

6. **`/arckit.business-case`** → Value prioritization
   - High ROI features prioritized
   - Benefits tracking per epic

7. **`/arckit.principles`** → Definition of Done
   - Architecture principles → DoD criteria

### Outputs To:

1. **`/arckit.traceability`** → Traceability matrix
   - Requirements → Stories → Sprints → Code
   - Backlog provides middle layer

2. **`/arckit.test-strategy`** → Test planning
   - Stories inform test cases
   - Acceptance criteria → Test scenarios

3. **`/arckit.analyze`** → Gap analysis
   - Identifies missing stories
   - Validates backlog completeness

4. **Sprint Planning Meetings** → Team artifact
   - Backlog is input to sprint planning
   - Team refines and commits to stories

---

## Example: Payment Gateway Modernization

### Input Artifacts:

**requirements.md** (excerpt):
```markdown
### Business Requirements

**BR-001**: User Management
- Users must be able to create accounts, login, and manage profiles
- Priority: Must Have

**BR-002**: Payment Processing
- System must process credit card payments securely
- Priority: Must Have

### Functional Requirements

**FR-001**: User Registration
- System shall allow users to create accounts with email/password
- Email verification required
- GDPR consent must be captured
- Priority: Must Have

**FR-005**: Process Payment
- System shall process credit card payments via Stripe
- Support Visa, Mastercard, Amex
- PCI-DSS Level 1 compliance required
- Priority: Must Have

### Non-Functional Requirements

**NFR-005**: Response Time
- P95 response time < 2 seconds
- Implementation: Caching layer (Redis)
- Priority: Should Have
```

### Generated Backlog (excerpt):

```markdown
## Epic 1: User Authentication (BR-001)

### Story-001: Create user account (8 points)
As a new user
I want to create an account
So that I can access the payment service

Acceptance Criteria:
- It's done when I can enter email and password
- It's done when email verification is sent within 1 minute
- It's done when account is created after email verification
- It's done when GDPR consent is recorded in database

Requirements: FR-001, NFR-008 (GDPR), NFR-012 (Email)
Component: User Service (from HLD)
Sprint: 1
Priority: Must Have

Tasks:
- Task-001-A: Design user table schema with GDPR fields (2 points)
- Task-001-B: Implement POST /api/users/register endpoint (3 points)
- Task-001-C: Implement email verification service (SendGrid) (3 points)

---

## Epic 2: Payment Processing (BR-002)

### Story-015: Connect to Stripe API (8 points)
As a system
I need to integrate with Stripe payment gateway
So that I can process credit card payments securely

Acceptance Criteria:
- It's done when Stripe API keys are configured
- It's done when test payment succeeds in sandbox
- It's done when webhook endpoint receives payment events
- It's done when PCI-DSS compliance is validated

Requirements: FR-005, INT-003 (Stripe), NFR-014 (PCI-DSS)
Component: Payment Service (from HLD)
Sprint: 2
Priority: Must Have
Dependencies: Story-001 (user must be authenticated to pay)

Tasks:
- Task-015-A: Setup Stripe SDK and API keys (2 points)
- Task-015-B: Implement payment intent creation (3 points)
- Task-015-C: Setup webhook endpoint for payment events (3 points)

---

### Story-016: Process credit card payment (8 points)
As a service user
I want to pay with my credit card
So that I can complete my transaction

Acceptance Criteria:
- It's done when I can enter card details on secure form
- It's done when payment is processed via Stripe
- It's done when payment confirmation is displayed
- It's done when payment receipt is emailed

Requirements: FR-005, NFR-014 (PCI-DSS)
Component: Payment Service, Email Service
Sprint: 2
Priority: Must Have
Dependencies: Story-015 (Stripe integration must exist)

Tasks:
- Task-016-A: Create payment UI form (Stripe Elements) (3 points)
- Task-016-B: Implement payment processing logic (3 points)
- Task-016-C: Send payment confirmation email (2 points)

---

## Sprint Plan

### Sprint 1: Foundation (20 points)
- Story-001: Create user account (8 points)
- Story-002: User login (5 points)
- Task-DB-001: PostgreSQL setup (2 points)
- Task-CI-001: CI/CD pipeline (2 points)
- Task-TEST-001: Jest testing framework (1 point)
- Story-003: Password reset (3 points) [Buffer]

**Dependencies**: None (foundation sprint)
**Risks**: GDPR compliance review needed

### Sprint 2: Payment Foundation (20 points)
- Story-015: Connect to Stripe API (8 points)
- Story-016: Process credit card payment (8 points)
- Task-NFR-005: Redis caching layer (5 points)

**Dependencies**: ✅ Sprint 1 (user auth)
**Risks**: Stripe sandbox access, PCI-DSS compliance
```

---

## Implementation Considerations

### Story Point Estimation

Use **Fibonacci sequence** (1, 2, 3, 5, 8, 13, 21):

- **1 point**: Trivial, < 2 hours (config change, simple UI tweak)
- **2 points**: Simple, half day (small API endpoint, basic UI form)
- **3 points**: Moderate, 1 day (API with validation, UI component with logic)
- **5 points**: Complex, 2-3 days (multi-step workflow, integration)
- **8 points**: Very complex, 1 week (major feature, multiple components)
- **13 points**: Epic-level, 2 weeks (break down into smaller stories)
- **21+ points**: Too large, must break down

**AI-generated estimates should be validated by team** based on their velocity and experience.

### Acceptance Criteria Best Practices

- Use "It's done when..." format (from GDS guidance)
- Make measurable and testable
- Include success and error cases
- Reference NFRs where applicable
- Include GDPR/security requirements

### Sprint Velocity Calibration

- **Initial velocity is assumed** (default: 20 points)
- **After Sprint 1**: Calculate actual velocity
- **Adjust future sprints** based on team's actual capacity
- **Track velocity trend** over time

**Velocity = Sum of story points for stories marked "Done" in sprint**

### Backlog Refinement Cadence

- **Weekly**: Refine next 2 sprints (add details, break down stories)
- **Bi-weekly**: Groom backlog beyond 2 sprints (adjust priorities)
- **Monthly**: Review epic priorities (business value changes)
- **Per sprint**: Update based on learnings and completed work

---

## Time Savings Analysis

### Manual Backlog Creation (Traditional Approach)

**For typical 50-requirement project**:

1. **Convert requirements to stories**: 2-3 weeks
   - Read and understand all requirements
   - Write user stories in proper format
   - Create acceptance criteria
   - Identify technical tasks
   - Manual effort: 40-60 hours

2. **Prioritization and sequencing**: 1 week
   - Analyze dependencies
   - Map to architecture components
   - Create priority framework
   - Manual effort: 20-30 hours

3. **Sprint planning**: 1 week
   - Organize into sprints
   - Balance capacity
   - Validate dependencies
   - Manual effort: 20-30 hours

**Total Manual Effort**: 4-6 weeks, 80-120 hours

### With `/arckit.backlog` Command

1. **Run command**: 2-5 minutes (AI processing)
2. **Review and refine**: 1-2 days (validate stories, adjust priorities)
3. **Team refinement**: 2-3 days (team estimates, adds detail)

**Total Effort**: 3-5 days, 24-40 hours

**Time Savings**: ~75-85% (4-5 weeks → 3-5 days)

---

## Success Criteria

The backlog command is successful if:

1. **Completeness**:
   - ✅ Every requirement (FR/NFR/INT/DR) maps to at least one story/task
   - ✅ No orphaned requirements
   - ✅ Traceability maintained

2. **Quality**:
   - ✅ User stories follow GDS format ("As a... I want... So that...")
   - ✅ Acceptance criteria are measurable ("It's done when...")
   - ✅ Story points are reasonable (validated by team)

3. **Prioritization**:
   - ✅ MoSCoW priorities align with business case
   - ✅ High-risk items addressed early
   - ✅ Dependencies respected in sprint sequence

4. **Usability**:
   - ✅ Backlog is clear and actionable for dev team
   - ✅ Sprint plan is realistic (based on velocity)
   - ✅ Output formats are tool-compatible (CSV, JSON)

5. **Integration**:
   - ✅ Links to other ArcKit artifacts maintained
   - ✅ Feeds into traceability matrix
   - ✅ Aligns with architecture (HLD/DLD)

6. **Time Savings**:
   - ✅ Reduces backlog creation time by 75%+
   - ✅ Team can start sprint planning within days, not weeks

---

## Future Enhancements (v2)

1. **Velocity Learning**: Track actual velocity, auto-adjust future sprints
2. **Jira Integration**: Direct push to Jira/Azure DevOps via API
3. **Story Templates**: Domain-specific templates (e-commerce, healthcare, etc.)
4. **Burndown Charts**: Auto-generate sprint burndown predictions
5. **Capacity Planning**: Factor in team size, holidays, leave
6. **Cost Estimation**: Map story points to cost estimates
7. **Release Planning**: Multi-sprint release roadmaps
8. **Epic Decomposition**: AI-assisted epic breakdown into stories
9. **Retrospective Integration**: Learn from past sprint velocity/issues
10. **Stakeholder Dashboard**: Visual backlog status for non-technical stakeholders

---

## Command Prompt Structure

The command prompt will include:

```markdown
# Instructions

You are creating a prioritized product backlog for an ArcKit project.

## Your Task

1. **Scan Artifacts**: Read all ArcKit artifacts in the project directory
2. **Extract Requirements**: Parse BRs, FRs, NFRs, INTs, DRs
3. **Generate User Stories**: Convert FRs into "As a... I want... So that..." format
4. **Create Epics**: Group related stories from BRs
5. **Add Technical Tasks**: From NFRs and architecture
6. **Prioritize**: Use MoSCoW + dependencies + risk + value
7. **Sprint Planning**: Organize into sprints (default velocity: 20 points)
8. **Generate Output**: Create backlog.md with full backlog and sprint plan

## Story Format

For each FR, generate a user story:

```
### Story-{ID}: {Title}

**As a** {persona from stakeholder analysis}
**I want** {capability from FR}
**So that** {goal from BR or FR description}

**Acceptance Criteria**:
- It's done when {measurable outcome 1}
- It's done when {measurable outcome 2}
- It's done when {measurable outcome 3}

**Requirements Traceability**: {FR-xxx, NFR-xxx, etc.}
**Component**: {from HLD}
**Story Points**: {1,2,3,5,8,13}
**Priority**: {Must/Should/Could Have}
**Sprint**: {sprint number}
**Dependencies**: {other stories that must be done first}
```

## Prioritization Algorithm

Calculate priority score:
- MoSCoW weight (40%): Must=4, Should=3, Could=2, Won't=1
- Risk weight (20%): Critical=4, High=3, Medium=2, Low=1
- Value weight (20%): High=4, Medium=3, Low=2, None=1
- Dependency weight (20%): Blocks many=4, some=3, few=2, none=1

Sort by priority score descending.

## Sprint Planning Rules

- Sprint velocity: {VELOCITY} points (default: 20)
- Sprint length: {SPRINT_LENGTH} (default: 2 weeks)
- Balance: 60% features, 20% technical, 15% testing, 5% buffer
- Foundation first: Auth, database, CI/CD in Sprint 1
- Respect dependencies: Don't schedule dependent stories before prerequisites

## Output Structure

Generate markdown file with:
1. Executive summary (total stories, points, sprints)
2. Epic breakdown
3. Prioritized backlog (all stories with full details)
4. Sprint plan (stories organized by sprint)
5. Appendices (traceability matrix, dependency graph, DoD)

Also generate CSV and JSON exports for tool import.

---

## Example Conversions

**Input** (from requirements.md):
```
**FR-001**: User Registration
System shall allow users to create accounts with email/password.
Email verification required. GDPR consent must be captured.
Priority: Must Have
```

**Output** (user story):
```
### Story-001: Create user account

**As a** new user
**I want** to create an account
**So that** I can access the service

**Acceptance Criteria**:
- It's done when I can enter email and password
- It's done when email verification is sent within 1 minute
- It's done when account is created after email verification
- It's done when GDPR consent is recorded

**Requirements Traceability**: FR-001, NFR-008 (GDPR)
**Component**: User Service (from HLD)
**Story Points**: 8
**Priority**: Must Have
**Sprint**: 1
**Dependencies**: None
```

[... include more examples and detailed instructions for the AI to follow ...]
```

---

## Conclusion

The `/arckit.backlog` command bridges the gap between ArcKit's design phase (Discovery/Alpha) and implementation phase (Beta) by automatically converting requirements into a sprint-ready product backlog.

**Key Benefits**:
- ✅ **Time savings**: 75%+ reduction in backlog creation time
- ✅ **Consistency**: GDS-compliant user story format
- ✅ **Traceability**: Requirements → Stories → Sprints → Code
- ✅ **Prioritization**: Multi-factor prioritization (MoSCoW, risk, value, dependencies)
- ✅ **Integration**: Works with all existing ArcKit commands
- ✅ **Tool compatibility**: Exports to Jira, Azure DevOps, GitHub Projects

This command enables teams to transition seamlessly from architecture to implementation with a clear, prioritized roadmap.

---

**Next Steps**: Review this design, gather feedback, implement command prompt, test with real projects.

**Design Version**: 1.0
**Date**: 2025-10-30
**Author**: ArcKit Design Team
