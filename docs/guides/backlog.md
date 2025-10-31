# Product Backlog Guide

A comprehensive guide to generating sprint-ready product backlogs from ArcKit artifacts using the `/arckit.backlog` command.

---

## What is a Product Backlog?

A **product backlog** is a prioritised list of work items (user stories, technical tasks, bugs) that a development team will implement during a project. It's the single source of truth for what needs to be built.

### Key Components

**Epics**: Large features that group related user stories
- Typically align with Business Requirements (BR-xxx)
- Example: "User Authentication" epic contains registration, login, password reset stories

**User Stories**: User-facing features in GDS format
- "As a [persona] I want [capability] so that [goal]"
- Derived from Functional Requirements (FR-xxx)
- Include acceptance criteria and story points

**Technical Tasks**: Infrastructure and non-functional work
- Derived from Non-Functional Requirements (NFR-xxx)
- Examples: caching layer, security hardening, database optimisation

**Acceptance Criteria**: Measurable outcomes that define "done"
- Format: "It's done when [measurable outcome]"
- Testable and specific

**Story Points**: Effort estimates using Fibonacci sequence (1,2,3,5,8,13)
- Relative sizing, not time-based
- Team calibrates based on velocity

---

## When to Generate a Product Backlog

### Timing in GDS Agile Delivery

Run `/arckit.backlog` at these points:

**End of Alpha Phase** (after HLD approved):
- Detailed requirements complete
- Architecture designed
- Ready to transition to implementation
- **Most common time to run this command**

**Start of Beta Phase** (before Sprint 1):
- Generate backlog for implementation planning
- Organise work into sprints
- Establish baseline velocity

**Mid-Beta** (requirements change):
- Re-generate if significant new requirements added
- Update priorities based on learnings
- Adjust sprint plan

### Prerequisites

Before running `/arckit.backlog`, you should have:

✅ **`/arckit.requirements`** - BR, FR, NFR, INT, DR documented
✅ **`/arckit.hld`** - Architecture design complete
✅ **`/arckit.stakeholders`** - User personas identified
✅ **`/arckit.risk-register`** - Risks assessed (optional but recommended)
✅ **`/arckit.business-case`** - Value priorities established (optional)

**Minimum**: Requirements and HLD
**Recommended**: All artifacts for best prioritization

---

## Using the `/arckit.backlog` Command

### Basic Usage

```bash
# Generate backlog with default settings
/arckit.backlog

# Output:
# - projects/{project-dir}/backlog.md
# - 8 sprints planned
# - 20 story points per sprint
# - Multi-factor prioritization
```

### Custom Velocity and Duration

```bash
# Adjust for your team size and capacity
/arckit.backlog VELOCITY=25 SPRINTS=12

# Use cases:
# - Larger team → higher velocity (25-30 points)
# - Smaller team → lower velocity (15-20 points)
# - Longer project → more sprints (12-16)
```

### Export Formats

```bash
# Generate all formats for tool integration
/arckit.backlog FORMAT=all

# Output:
# - backlog.md (human-readable)
# - backlog.csv (Jira, Azure DevOps import)
# - backlog.json (API integration, custom tools)
```

### Prioritization Strategies

```bash
# Default: Multi-factor (MoSCoW + Risk + Value + Dependencies)
/arckit.backlog PRIORITY=multi

# Risk-first (prove feasibility early)
/arckit.backlog PRIORITY=risk

# Value-first (deliver ROI early)
/arckit.backlog PRIORITY=value

# MoSCoW only (regulatory/legal first)
/arckit.backlog PRIORITY=moscow
```

---

## What the Command Does

### 1. Scans All ArcKit Artifacts

Reads project artifacts:
- `requirements.md` - All requirement types
- `hld.md` / `dld.md` - Component mapping
- `stakeholder-analysis.md` - User personas
- `risk-register.md` - Risk levels
- `threat-model.md` - Security threats
- `business-case.md` - Value priorities
- `test-strategy.md` - Testing needs
- `principles.md` - Definition of Done

### 2. Converts Requirements to User Stories

**Functional Requirements → User Stories**:

```
Input (requirements.md):
**FR-001**: User Registration
System shall allow users to create accounts with email/password.
Email verification required. GDPR consent must be captured.
Priority: Must Have

↓ Converts to ↓

Output (backlog.md):
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
```

**Non-Functional Requirements → Technical Tasks**:

```
Input:
**NFR-005**: Response time < 2 seconds (P95)
Implementation: Caching layer (Redis)
Priority: Should Have

↓ Converts to ↓

Output:
### Task-NFR-005: Implement Redis caching layer

**Type**: Technical Task
**Priority**: Should Have
**Story Points**: 5
**Sprint**: 2

**Description**:
Implement Redis caching to meet response time requirements.
Cache frequently accessed data (user sessions, product catalog).

**Acceptance Criteria**:
- It's done when Redis deployed to all environments
- It's done when cache hit rate > 80% for user sessions
- It's done when P95 response time < 2 seconds
- It's done when cache invalidation strategy implemented
```

### 3. Groups into Epics

**Business Requirements → Epics**:

```
BR-001: User Management (Must Have)
  ├─ Story-001: Create user account (8 points)
  ├─ Story-002: User login (5 points)
  ├─ Story-003: Password reset (5 points)
  ├─ Story-004: Update profile (3 points)
  ├─ Story-005: Delete account (5 points)
  └─ Story-006: View audit log (3 points)
  Total: 29 points across 6 stories
```

### 4. Prioritizes Using Multi-Factor Scoring

**Priority Score Calculation**:

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

**Example**:

```
Story-001: Create user account
  MoSCoW: Must Have (4)
  Risk: Medium - GDPR compliance (2)
  Value: High - Foundation feature (4)
  Dependency: Blocks many features (4)
  
  Score = (4*0.4) + (2*0.2) + (4*0.2) + (4*0.2)
        = 1.6 + 0.4 + 0.8 + 0.8
        = 3.6 (high priority)

Story-025: Export user preferences
  MoSCoW: Could Have (2)
  Risk: Low (1)
  Value: Low (2)
  Dependency: Blocks nothing (1)
  
  Score = (2*0.4) + (1*0.2) + (2*0.2) + (1*0.2)
        = 0.8 + 0.2 + 0.4 + 0.2
        = 1.6 (lower priority)
```

### 5. Organizes into Sprint Plan

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
  Buffer: Story-003 Password reset (5 points, move if needed)

Sprint 2 - Core Features:
  ✅ Stripe integration (8 points)
  ✅ Payment processing (8 points)
  ✅ Redis caching (3 points)
  ✅ GDPR audit log (2 points)
```

**Dependency Management**:
- Sprint 1 always includes: Auth, Database, CI/CD, Testing
- Dependent stories scheduled after dependencies
- Technical foundation before features

### 6. Generates Traceability Matrix

Links requirements → stories → sprints:

```
| Requirement | Type | Stories | Sprint | Status |
|-------------|------|---------|--------|--------|
| BR-001 | Business | Story-001..008 | 1-2 | Planned |
| FR-001 | Functional | Story-001 | 1 | Planned |
| FR-005 | Functional | Story-016 | 2 | Planned |
| NFR-005 | Non-Functional | Task-NFR-005 | 2 | Planned |
```

---

## Understanding the Output

### Primary Output: backlog.md

**Structure**:

1. **Executive Summary**
   - Total stories, epics, story points
   - Priority breakdown (Must/Should/Could)
   - Epic breakdown

2. **How to Use** section
   - Guidance for Product Owners, Dev Teams, Scrum Masters
   - Backlog refinement schedule

3. **Epics Section**
   - All epics with descriptions
   - Stories grouped by epic
   - Epic dependencies

4. **Prioritized Backlog**
   - All user stories (sorted by priority)
   - Technical tasks
   - Acceptance criteria
   - Story points and sprint assignments

5. **Sprint Plan**
   - Detailed sprint backlogs (Sprint 1-8)
   - Sprint goals
   - Dependencies and risks
   - Definition of Done

6. **Appendices**
   - Requirements traceability matrix
   - Dependency graph
   - Epic overview table
   - Story points distribution
   - Risk prioritization
   - Definition of Done criteria

### Secondary Outputs: CSV and JSON

**backlog.csv** - For Jira/Azure DevOps import:
```csv
Type,Key,Epic,Summary,Description,Acceptance Criteria,Priority,Story Points,Sprint,Status
Epic,EPIC-001,,"User Management","Foundation epic",,Must Have,34,1-2,To Do
Story,STORY-001,EPIC-001,"Create user account","As a new user...",...,Must Have,8,1,To Do
```

**backlog.json** - For programmatic access:
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

---

## Real-World Example: NHS Appointment Booking

### Project Context

**Project**: NHS Appointment Booking System
**Phase**: Alpha complete, starting Beta
**Artifacts**: 65 requirements (12 BR, 30 FR, 15 NFR, 5 INT, 3 DR)
**Team**: 8 developers, 2 testers
**Duration**: 16 weeks (8 sprints)

### Step 1: Run Command

```bash
/arckit.backlog VELOCITY=25 SPRINTS=8
```

### Step 2: Review Generated Backlog

**Executive Summary**:
- Total Stories: 45
- Total Epics: 8
- Total Story Points: 197
- Estimated Duration: 8 sprints (16 weeks at 25 points/sprint)

**Top 5 Epics**:
1. User Registration & Authentication (34 points, 7 stories)
2. Appointment Booking (42 points, 9 stories)
3. NHS Spine Integration (28 points, 5 stories)
4. GP Practice Management (25 points, 6 stories)
5. Notifications (18 points, 4 stories)

### Step 3: Sprint 1 (Foundation)

**Sprint 1 Backlog** (25 points):

**Features** (15 points):
- Story-001: Create patient account (8 points)
- Story-002: Patient login with NHS number (5 points)
- Story-003: View available appointments (3 points)

**Technical** (5 points):
- Task-DB-001: PostgreSQL with patient table (2 points)
- Task-CI-001: GitHub Actions CI/CD (2 points)
- Task-NFR-012: Rate limiting (1 point)

**Testing** (4 points):
- Task-TEST-001: Jest + Supertest setup (2 points)
- Integration tests for auth (included in stories)

**Security** (1 point):
- Task-NFR-008: GDPR audit logging (1 point)

**Sprint Goals**:
- Patients can create accounts and login
- View appointment availability
- Database and CI/CD operational

### Step 4: Sprint 2 (NHS Spine Integration)

**Sprint 2 Backlog** (25 points):

**Features** (13 points):
- Story-015: Connect to NHS Spine (8 points)
- Story-016: Verify patient NHS number (5 points)

**Technical** (8 points):
- Task-INT-003: NHS Spine authentication (3 points)
- Task-NFR-005: Redis caching (3 points)
- Task-NFR-014: HL7 FHIR message formatting (2 points)

**Testing** (4 points):
- Task-TEST-002: NHS Spine integration tests (2 points)
- Mock NHS Spine for testing (2 points)

**Dependencies**:
- ✅ Sprint 1: Patient auth (Story-001, Story-002)
- ✅ Sprint 1: Database (Task-DB-001)

**Risks**:
- NHS Spine sandbox access needed (week 3)
- HL7 FHIR complexity (spike may be needed)

### Step 5: Velocity Tracking

**After Sprint 1**:
- Planned: 25 points
- Completed: 22 points (Story-003 rolled to Sprint 2)
- Actual velocity: 22 points

**Adjustment for Sprint 2**:
- Reduce capacity to 22 points (realistic)
- Move lower-priority task to Sprint 3

### Step 6: Backlog Refinement (Week 3)

**Weekly grooming session**:
1. Story-015 (NHS Spine) - Added spike story (3 points) after complexity discovered
2. Story-003 (View appointments) - Moved from Sprint 2 to Sprint 3 (lower priority)
3. Story-025 (Email notifications) - Refined acceptance criteria with stakeholders

---

## Backlog Management Best Practices

### 1. Velocity Calibration

**Initial Velocity is Assumed**:
- Default: 20 points per sprint
- Based on typical team of 5-7 developers
- **Must be calibrated after Sprint 1**

**Calculate Actual Velocity**:
```
Velocity = Sum of story points for "Done" stories in sprint

Example Sprint 1:
  Story-001: 8 points ✅ Done
  Story-002: 5 points ✅ Done
  Story-003: 3 points ❌ In Progress
  Task-DB-001: 2 points ✅ Done
  Task-CI-001: 2 points ✅ Done
  
Actual Velocity = 8 + 5 + 2 + 2 = 17 points
```

**Adjust Future Sprints**:
- Sprint 2+ capacity = Actual velocity from Sprint 1
- Track trend over 3-4 sprints
- Account for holidays, team changes

### 2. Story Point Estimation

**Fibonacci Sequence** (1, 2, 3, 5, 8, 13):

- **1 point**: Trivial, < 2 hours
  - Example: Update button text, add logging

- **2 points**: Simple, half day
  - Example: Simple API endpoint, basic form

- **3 points**: Moderate, 1 day
  - Example: API with validation, UI component

- **5 points**: Complex, 2-3 days
  - Example: Multi-step workflow, integration

- **8 points**: Very complex, 1 week
  - Example: Major feature, payment integration

- **13+ points**: Too large - break down
  - Example: "Build entire admin dashboard" → 4-5 stories

**Team Poker**:
- Entire team estimates together
- Discuss discrepancies (3 vs 8)
- Reach consensus
- Re-estimate AI suggestions

### 3. Backlog Refinement Schedule

**Weekly** (Refine Next 2 Sprints):
- Add details to stories
- Break down large stories (>8 points)
- Clarify acceptance criteria
- Identify dependencies
- **Duration**: 1-2 hours

**Bi-Weekly** (Groom Beyond 2 Sprints):
- Re-prioritise based on learnings
- Add new stories from bugs/feedback
- Remove obsolete stories
- Adjust epic priorities
- **Duration**: 1 hour

**Monthly** (Strategic Review):
- Review epic priorities with stakeholders
- Align with business changes
- Validate roadmap
- Update business case
- **Duration**: 2 hours

**Per Sprint** (Retrospective):
- Review completed work
- Update velocity
- Identify blockers
- Adjust process
- **Duration**: 1 hour

### 4. Dependency Management

**Types of Dependencies**:

1. **Technical Dependencies** (hard blockers):
   - Auth system before user features
   - Database before data operations
   - API before integrations
   - → Must be scheduled sequentially

2. **Business Dependencies** (soft):
   - Payment before payment history
   - Registration before profile update
   - → Should be scheduled sequentially

3. **Knowledge Dependencies**:
   - Spike story before complex feature
   - Proof of concept before full implementation
   - → Schedule spike 1-2 sprints before

**Dependency Tracking**:
```
Story-016: Process payment
  Dependencies:
    ✅ Story-015: Stripe integration (Sprint 2)
    ✅ Story-001: User authentication (Sprint 1)
  Status: Ready for Sprint 3
  
Story-025: Payment history
  Dependencies:
    ❌ Story-016: Process payment (Sprint 3, not done yet)
  Status: Blocked, cannot start Sprint 3
```

### 5. Definition of Done

**Every story must meet DoD before marking "Done"**:

✅ Code Quality:
- Code reviewed by 2+ team members
- No merge conflicts
- Linting passed

✅ Testing:
- Unit tests (80%+ coverage)
- Integration tests for APIs
- Manual testing complete
- Acceptance criteria verified

✅ Security:
- Security scan passed (no critical/high)
- OWASP Top 10 checks
- No secrets in code

✅ Performance:
- Meets NFR thresholds
- No N+1 queries
- Response times acceptable

✅ Deployment:
- Deployed to dev environment
- Database migrations tested
- Config updated

✅ Documentation:
- API docs updated
- README updated
- Runbook updated

✅ Stakeholder:
- Demoed to Product Owner
- Acceptance criteria validated

### 6. Sprint Planning Meeting

**Agenda** (2 hours for 2-week sprint):

**Part 1: Sprint Goal** (30 minutes):
- Review product backlog (top 20 stories)
- Define sprint goal (1-2 sentences)
- Validate priorities with Product Owner

**Part 2: Story Selection** (60 minutes):
- Pull stories from backlog (top-down)
- Stop when velocity reached
- Validate dependencies met
- Discuss implementation approach

**Part 3: Task Breakdown** (30 minutes):
- Break stories into tasks (if needed)
- Identify technical blockers
- Assign initial ownership
- Confirm team commitment

**Output**:
- Sprint backlog (committed stories)
- Sprint goal
- Task breakdown
- Identified risks

---

## Common Issues and Solutions

### Issue 1: AI-Generated Story Points Too High/Low

**Problem**: Team disagrees with AI estimates

**Solution**:
1. Review AI estimates in sprint planning
2. Use team poker to re-estimate
3. Track actual vs estimated over sprints
4. Provide feedback to improve future estimates

**Example**:
```
AI Estimate: Story-015 (Stripe integration) = 5 points
Team Estimate: 8 points (team unfamiliar with Stripe)
→ Use 8 points for sprint planning
→ After completion, actual was 8 points
→ AI learns team's context over time
```

### Issue 2: Dependencies Not Captured

**Problem**: Story depends on another not identified by AI

**Solution**:
1. Review dependencies in backlog refinement
2. Add dependency links
3. Re-sequence sprints if needed
4. Update in backlog.md

**Example**:
```
Story-025: Export user data (GDPR)
  AI didn't identify dependency on:
    → Story-007: Audit logging (Sprint 2)
  
Manual adjustment:
  Move Story-025 from Sprint 3 to Sprint 4
  Add dependency note in backlog.md
```

### Issue 3: Velocity Significantly Different

**Problem**: Team velocity is 15, not 20 (default)

**Solution**:
1. After Sprint 1, calculate actual velocity
2. Adjust Sprint 2+ capacity
3. May need more sprints to complete backlog
4. Communicate timeline change to stakeholders

**Example**:
```
Default plan: 200 points / 20 velocity = 10 sprints
Actual velocity: 15 points
Revised plan: 200 points / 15 velocity = 14 sprints (+4 sprints)
```

### Issue 4: Priorities Changed

**Problem**: Business priorities shifted, backlog order wrong

**Solution**:
1. Update priorities in requirements.md
2. Re-run `/arckit.backlog`
3. Compare with previous backlog
4. Communicate changes to team
5. Adjust in-flight sprint if needed

### Issue 5: Missing User Personas

**Problem**: User stories have generic "user" actor

**Solution**:
1. Run `/arckit.stakeholders` to identify personas
2. Re-run `/arckit.backlog`
3. Stories will have specific personas:
   - "new patient"
   - "GP receptionist"
   - "system administrator"

---

## Integration with Other ArcKit Commands

### Before Generating Backlog

1. **`/arckit.requirements`** (required)
   - Defines all BRs, FRs, NFRs, INTs, DRs
   - Source of all user stories

2. **`/arckit.hld`** (required)
   - Defines components
   - Maps stories to architecture

3. **`/arckit.stakeholders`** (recommended)
   - Identifies user personas
   - Improves "As a..." statements

4. **`/arckit.risk-register`** (recommended)
   - Risk-based prioritization
   - High-risk items addressed early

5. **`/arckit.business-case`** (optional)
   - Value-based prioritization
   - ROI-driven sequencing

### After Generating Backlog

1. **`/arckit.traceability`**
   - Creates Requirements → Stories → Code matrix
   - Uses backlog as middle layer

2. **`/arckit.test-strategy`**
   - Generates test cases from acceptance criteria
   - Maps tests to stories

3. **`/arckit.analyze`**
   - Validates backlog completeness
   - Identifies gaps

---

## Export and Tool Integration

### Jira Import (CSV)

**Steps**:
1. Generate backlog: `/arckit.backlog FORMAT=csv`
2. In Jira: Settings → System → External System Import
3. Select CSV file: `backlog.csv`
4. Map columns:
   - Type → Issue Type
   - Key → Issue Key
   - Epic → Epic Link
   - Summary → Summary
   - Story Points → Story Points
   - Sprint → Sprint (custom field)
5. Import and validate

### Azure DevOps Import (CSV)

**Steps**:
1. Generate backlog: `/arckit.backlog FORMAT=csv`
2. In Azure DevOps: Boards → Backlog → Import
3. Select CSV file: `backlog.csv`
4. Map columns to work item fields
5. Import and validate

### GitHub Projects Import (JSON)

**Steps**:
1. Generate backlog: `/arckit.backlog FORMAT=json`
2. Use GitHub API to create issues:
```bash
curl -X POST \
  -H "Authorization: token YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d @backlog.json \
  https://api.github.com/repos/owner/repo/issues
```

### Custom Tool Integration (JSON)

**Example - Slack notification**:
```python
import json

with open('backlog.json') as f:
    backlog = json.load(f)

sprint1 = backlog['sprints'][0]
message = f"Sprint 1 has {len(sprint1['stories'])} stories, {sprint1['velocity']} points"

# Send to Slack
```

---

## Tips for Success

### 1. Start Small

**First time using `/arckit.backlog`**:
- Generate for 4 sprints (8 weeks)
- Review with team thoroughly
- Refine and adjust
- Then extend to 8+ sprints

### 2. Trust But Verify

**AI is helpful but not perfect**:
- Review all story points (team poker)
- Validate all dependencies
- Check priorities with Product Owner
- Adjust acceptance criteria

### 3. Track Velocity

**After every sprint**:
- Calculate actual velocity
- Update spreadsheet or tool
- Adjust future sprint capacity
- Share with stakeholders

### 4. Refine Regularly

**Don't let backlog get stale**:
- Weekly refinement (next 2 sprints)
- Bi-weekly grooming (beyond 2 sprints)
- Monthly strategic review (epics)

### 5. Link to Requirements

**Maintain traceability**:
- Every story links to FR/NFR
- Use `/arckit.traceability` to validate
- Update when requirements change

### 6. Communicate Changes

**When backlog changes**:
- Notify team immediately
- Explain why (business need, learning, blocker)
- Update sprint plans if needed
- Document in sprint review

---

## FAQs

### Q: How accurate are AI-generated story points?

**A**: AI estimates are reasonable starting points but should be validated by your team:
- Accuracy improves over time as AI learns your context
- Use team poker to refine estimates
- Track actual vs estimated to calibrate
- Typical accuracy: ±30% initially, ±15% after 3-4 sprints

### Q: Can I re-generate the backlog mid-project?

**A**: Yes, in these scenarios:
- Requirements significantly changed
- New epics added
- Business priorities shifted
- Architecture redesigned

**Process**:
1. Update source artifacts (requirements.md, etc.)
2. Re-run `/arckit.backlog`
3. Compare with previous backlog (diff)
4. Merge changes (keep completed stories, update planned)
5. Communicate to team

### Q: What if my team velocity is very different from 20?

**A**: Velocity varies widely by team:
- Small team (3-5 devs): 15-20 points
- Medium team (5-8 devs): 20-30 points
- Large team (8-12 devs): 30-40 points

**Adjust with VELOCITY parameter**:
```bash
/arckit.backlog VELOCITY=15    # Small team
/arckit.backlog VELOCITY=35    # Large team
```

### Q: How do I handle bugs and incidents?

**A**: Allocate buffer capacity:
- 5% buffer in each sprint (default)
- For bug-prone projects: increase to 10-15%
- Create "Bug" epic for tracking
- Reprioritize if critical bug

**Example**:
```bash
# Higher buffer for legacy system
/arckit.backlog VELOCITY=20
→ 19 points planned, 1 point buffer
→ Adjust: 18 points planned, 2 points buffer
```

### Q: Can I customise the Definition of Done?

**A**: Yes, in `principles.md`:
1. Document your team's DoD criteria
2. `/arckit.backlog` will extract and include
3. Appears in Appendix F of backlog.md

**Example principles.md**:
```markdown
## Definition of Done

Every story must:
- Code reviewed by 2+ team members
- 90% unit test coverage (our standard)
- Accessibility tested (WCAG 2.1 AA)
- Deployed to staging environment
- PO acceptance
```

### Q: What if HLD doesn't exist yet?

**A**: Backlog still generated but with limitations:
- Stories won't map to components
- Less accurate task breakdown
- Missing infrastructure tasks

**Recommendation**:
- Run `/arckit.hld` or `/arckit.diagram` first
- Then re-run `/arckit.backlog`
- Much better component mapping

### Q: How do I integrate with our existing backlog?

**A**: Merge strategies:

**Option 1: Fresh start** (recommended for new projects):
- Export existing backlog
- Generate new backlog with `/arckit.backlog`
- Manually merge critical items
- Mark old backlog as archived

**Option 2: Incremental** (for in-flight projects):
- Generate new backlog
- Compare with existing (diff)
- Add net-new stories to existing backlog
- Update priorities based on AI recommendations

### Q: Can I use different sprint lengths?

**A**: Yes, use SPRINT_LENGTH parameter:
```bash
/arckit.backlog SPRINT_LENGTH=1w    # 1-week sprints
/arckit.backlog SPRINT_LENGTH=3w    # 3-week sprints
```

**Typical sprint lengths**:
- 1 week: Fast-paced teams, small stories
- 2 weeks: Most common (recommended)
- 3 weeks: Complex features, slower cadence
- 4 weeks: Long-term planning, less agile

---

## Resources

### GDS Service Manual
- [Agile Delivery](https://www.gov.uk/service-manual/agile-delivery)
- [Writing User Stories](https://www.gov.uk/service-manual/agile-delivery/writing-user-stories)
- [Agile Tools and Techniques](https://www.gov.uk/service-manual/agile-delivery/agile-tools-techniques)
- [Planning Agile](https://www.gov.uk/service-manual/agile-delivery/planning-agile)

### Related ArcKit Guides
- [Requirements Guide](requirements.md) - Define FRs, NFRs, INTs, DRs
- [Plan Guide](plan.md) - Project planning with GDS phases
- [Traceability Guide](traceability.md) - Requirements → Code tracking
- [Test Strategy Guide](test-strategy.md) - Testing approach

### Tools
- **Jira**: [CSV Import Guide](https://confluence.atlassian.com/jirakb/how-to-import-data-from-csv-file-779160655.html)
- **Azure DevOps**: [Work Item Import](https://docs.microsoft.com/en-us/azure/devops/boards/backlogs/office/bulk-add-modify-work-items-excel)
- **GitHub Projects**: [API Documentation](https://docs.github.com/en/rest/issues/issues#create-an-issue)

### Books
- *User Stories Applied* by Mike Cohn
- *Agile Estimating and Planning* by Mike Cohn
- *Essential Scrum* by Kenneth Rubin

---

## Support

For issues or questions:
- **GitHub Issues**: https://github.com/tractorjuice/arc-kit/issues
- **Documentation**: https://github.com/tractorjuice/arc-kit/docs
- **Examples**: See test projects in repository

---

**Last updated**: 2025-10-30
**ArcKit Version**: 0.6.0
