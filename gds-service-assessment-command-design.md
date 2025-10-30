# GDS Service Assessment Command - Design Specification

**Command Name**: `/arckit.service-assessment`
**Version**: 0.5.0 (proposed)
**Status**: Design Phase
**Date**: 2025-10-30

---

## Executive Summary

This document proposes a new ArcKit command to help UK Government teams prepare for GDS Service Standard assessments. The command analyzes existing ArcKit artifacts, maps them to the 14-point Service Standard, identifies evidence gaps, and generates a comprehensive assessment readiness report.

**Key Value Proposition**: Automatically leverage all architecture work done in ArcKit to demonstrate Service Standard compliance, saving weeks of assessment preparation time.

---

## 1. Research Findings

### 1.1 GDS Service Standard Overview

**Current Standard**: 14 points (introduced July 2019, reduced from 18 points)

**The 14 Points**:

**Section 1: Meeting Users' Needs**
1. Understand users and their needs
2. Solve a whole problem for users
3. Provide a joined up experience across all channels
4. Make the service simple to use
5. Make sure everyone can use the service

**Section 2: Providing a Good Service**
6. Have a multidisciplinary team
7. Use agile ways of working
8. Iterate and improve frequently
9. Create a secure service which protects users' privacy
10. Define what success looks like and publish performance data

**Section 3: Using the Right Technology**
11. Choose the right tools and technology
12. Make new source code open
13. Use and contribute to open standards, common components and patterns
14. Operate a reliable service

### 1.2 Assessment Process

**When Assessments Happen**:
- **Alpha Assessment**: End of alpha phase (after prototyping, before building)
- **Beta Assessment**: Mid-way through beta (transition from private to public beta)
- **Live Assessment**: Before going live (production readiness)

**Assessment Format**:
- Duration: ~4 hours
- Location: In-person or remote
- Panel: 3-4 GDS assessors + service team
- Advance Notice: Book 5 weeks ahead
- Days: Tuesday, Wednesday, or Thursday

**Evidence Requirements**:
- Show actual work (prototypes, research findings, code, designs)
- Demonstrate user research
- Present team structure and ways of working
- Share documentation (strategy docs, Lucid boards, design histories)
- Provide links to artifacts for panel pre-reading

### 1.3 Assessment Outcomes

**RAG Rating System**:

**Green**:
- Service meets the Standard
- Can proceed to next phase
- No blocking issues

**Amber**:
- Standard not fully met, but issues not critical
- Can proceed with conditions
- Must fix within 3 months
- Progress tracked in "tracking amber evidence" document visible to assessment team

**Red**:
- Standard not met with critical issues
- Cannot proceed to next phase
- Must address issues and reassess

**Report Structure**:
- Overall RAG rating
- Individual RAG rating for each of 14 points
- Evidence gaps documented for each amber/red point
- Recommendations for next phase
- "Things done well" section
- Next steps and booking information

### 1.4 Evidence Patterns from Real Assessments

**Alpha Phase Evidence** (from analysis of actual reports):
- User research findings with diverse participant groups
- Prototypes tested with real users
- Technology spike results
- Team composition with skills audit
- Agile ceremonies established
- Security and privacy considerations identified
- Success metrics defined
- Technology options analysis

**Beta Phase Evidence** (from analysis of actual reports):
- End-to-end service working in production
- Assistive technology testing completed
- Content design reviewed by GDS
- Performance metrics being collected
- Source code repositories (public if possible)
- Multi-language support tested
- Operational procedures documented
- User satisfaction data

**Common Amber Reasons**:
1. Incomplete accessibility testing
2. Missing user research with diverse groups
3. Source code not yet open
4. Content not reviewed by GDS content designers
5. Performance data not yet published
6. Platform/routing guidance not user-centered
7. Translation testing incomplete

---

## 2. Design Rationale

### 2.1 Command Purpose

**Primary Goals**:
1. **Assessment Preparation**: Help teams prepare for upcoming GDS assessments
2. **Evidence Mapping**: Automatically map ArcKit artifacts to Service Standard points
3. **Gap Analysis**: Identify missing evidence for each point
4. **Readiness Scoring**: Provide clear RAG rating and readiness score
5. **Actionable Recommendations**: Tell teams exactly what to prepare

**Why This Command Matters**:
- Teams using ArcKit have already created substantial evidence (requirements, stakeholder analysis, security reviews, etc.)
- Manual mapping to Service Standard is time-consuming and error-prone
- Assessment preparation typically takes 2-4 weeks of intensive work
- This command automates evidence discovery and gap analysis
- Provides clear action plan to close gaps

### 2.2 Integration with ArcKit Workflow

**Perfect Fit with Existing Commands**:

| Service Standard Point | Evidence from ArcKit Artifacts |
|------------------------|--------------------------------|
| 1. Understand users | `stakeholder-drivers.md` (user needs), `requirements.md` (user stories) |
| 2. Solve whole problem | `requirements.md` (functional requirements), `wardley-map.md` (value chain) |
| 3. Joined up experience | `hld-review.md` (integration), `diagrams/` (architecture) |
| 4. Simple to use | `requirements.md` (usability NFRs), `hld-review.md` (UX review) |
| 5. Accessibility | `requirements.md` (WCAG 2.1 AA), `ukgov-secure-by-design.md` |
| 6. Multidisciplinary team | `stakeholder-drivers.md` (RACI matrix), `project-plan.md` (team) |
| 7. Agile ways of working | `project-plan.md` (GDS phases), `risk-register.md` (iterative) |
| 8. Iterate and improve | `hld-review.md`, `dld-review.md` (design iterations) |
| 9. Security and privacy | `ukgov-secure-by-design.md`, `data-model.md` (GDPR), `atrs-record.md` |
| 10. Success metrics | `requirements.md` (KPIs), `sobc.md` (benefits), `project-plan.md` |
| 11. Right tools | `research/`, `wardley-map.md` (build vs buy), `sow.md` (vendor selection) |
| 12. Open source code | *(External: GitHub/GitLab - can check if mentioned in docs)* |
| 13. Open standards | `tcop-assessment.md` (Point 13 TCoP), `hld-review.md` (standards) |
| 14. Reliable service | `requirements.md` (availability NFRs), `hld-review.md` (resilience) |

**Workflow Integration**:

```
Discovery Phase
├── /arckit.plan
├── /arckit.stakeholders
├── /arckit.risk
├── /arckit.sobc
└── /arckit.service-assessment PHASE=alpha     ← First checkpoint

Alpha Phase
├── /arckit.requirements
├── /arckit.principles
├── /arckit.data-model
├── /arckit.wardley
└── /arckit.service-assessment PHASE=alpha     ← Before alpha assessment

Beta Phase
├── /arckit.hld-review
├── /arckit.secure
├── /arckit.tcop
├── /arckit.diagram
└── /arckit.service-assessment PHASE=beta      ← Before beta assessment

Live Phase
├── (production deployment)
└── /arckit.service-assessment PHASE=live      ← Before live assessment
```

### 2.3 Phase-Appropriate Evidence

Different phases have different expectations:

**Alpha Assessment** (Lower bar - proving concept viability):
- Focus: User needs, prototypes, technology viability
- Evidence: Research findings, prototype testing, tech spikes
- Less critical: Performance data, full accessibility testing, operational metrics

**Beta Assessment** (Higher bar - proving production readiness):
- Focus: Working service, security, accessibility, operations
- Evidence: End-to-end service, testing results, performance monitoring
- Critical: Accessibility testing, security hardening, incident management

**Live Assessment** (Highest bar - continuous improvement):
- Focus: User satisfaction, performance data, continuous iteration
- Evidence: Real user data, published metrics, operational excellence
- Critical: Published performance data, user satisfaction scores, continuous improvement

### 2.4 Command Design Decisions

**Decision 1: Preparation vs Self-Assessment**
- **Chosen**: Assessment **Preparation** focus
- **Rationale**: Teams need help preparing FOR assessments, not simulating assessment panels. The command should be a practical preparation tool.

**Decision 2: Single File vs Phase-Specific Files**
- **Chosen**: Phase-specific files (`service-assessment-alpha-prep.md`)
- **Rationale**: Allows tracking progression across phases, historical record of preparation at each gate

**Decision 3: Evidence Discovery Approach**
- **Chosen**: Automated scanning of all ArcKit artifacts with explicit mapping
- **Rationale**: Reduces manual effort, ensures nothing is missed, provides traceability

**Decision 4: Readiness Scoring**
- **Chosen**: RAG rating per point + overall readiness score (X/14 points)
- **Rationale**: Matches GDS assessment format, provides clear quantitative and qualitative measure

**Decision 5: Recommendations Format**
- **Chosen**: Priority-ranked actions (Critical/High/Medium) with specific next steps
- **Rationale**: Teams need actionable guidance, not just gap identification

---

## 3. Command Specification

### 3.1 Command Signature

```
/arckit.service-assessment PHASE=<alpha|beta|live> [DATE=YYYY-MM-DD]
```

**Arguments**:
- `PHASE=<alpha|beta|live>` (required): Assessment phase
- `DATE=YYYY-MM-DD` (optional): Planned assessment date for timeline calculations

**Examples**:
```bash
# Prepare for alpha assessment
/arckit.service-assessment PHASE=alpha

# Prepare for beta assessment with specific date
/arckit.service-assessment PHASE=beta DATE=2025-12-15

# Prepare for live assessment
/arckit.service-assessment PHASE=live
```

### 3.2 Output File

**File Path**: `projects/{project-dir}/service-assessment-{phase}-prep.md`

**Examples**:
- `projects/001-nhs-appointment/service-assessment-alpha-prep.md`
- `projects/002-payment-gateway/service-assessment-beta-prep.md`
- `projects/003-cloud-migration/service-assessment-live-prep.md`

### 3.3 Report Structure

```markdown
# GDS Service Assessment Preparation Report

**Project**: [Project Name]
**Assessment Phase**: Alpha / Beta / Live
**Assessment Date**: [If provided, else "Not yet scheduled"]
**Report Generated**: [Date]
**ArcKit Version**: 0.5.0

---

## Executive Summary

**Overall Readiness**: 🟢 Green / 🟡 Amber / 🔴 Red

**Readiness Score**: X/14 points ready

**Summary**:
[2-3 paragraph summary of readiness, critical gaps, and recommended actions]

**Critical Gaps** (Must address before assessment):
- [Gap 1]
- [Gap 2]
- [Gap 3]

**Recommended Timeline**: [Days/weeks until ready, based on gaps]

---

## Service Standard Assessment (14 Points)

### 1. Understand Users and Their Needs

**Status**: 🟢 Ready / 🟡 Partial / 🔴 Not Ready

**What This Point Means**:
[Brief explanation of the Service Standard point]

**Evidence Required for [Alpha/Beta/Live]**:
- [Evidence item 1]
- [Evidence item 2]
- [Evidence item 3]

**Evidence Found in ArcKit Artifacts**:
✅ **stakeholder-drivers.md** (line 45-67)
   - User needs documented for 6 user groups
   - Pain points identified through stakeholder workshops

✅ **requirements.md** (Section 2: User Stories)
   - 23 user stories with acceptance criteria
   - User journey maps for 3 primary personas

❌ **Missing**: Prototype testing results with real users
❌ **Missing**: User research findings with diverse groups (assistive technology users)

**Gap Analysis**:
[Assessment of what's present vs what's needed]

**Readiness Rating**: 🟡 Amber
- Strong: User needs documented, personas created
- Weak: No prototype testing evidence yet
- Missing: Assistive technology user research

**Recommendations**:
1. **Critical**: Conduct prototype testing with 8-12 users across diverse groups
2. **High**: Include assistive technology users in research (minimum 2 participants)
3. **Medium**: Document research findings in format suitable for assessment panel

**Assessment Day Guidance**:
- Prepare: Research playback slides showing key findings
- Show: Prototype videos with user testing sessions
- Bring: Lead user researcher to present findings
- Materials: Share research repository link with panel 1 week before

---

### 2. Solve a Whole Problem for Users

[Same structure as Point 1]

---

[... Repeat for all 14 points ...]

---

## Evidence Inventory

**Complete Traceability**: Service Standard Point → ArcKit Artifacts

| Service Standard Point | ArcKit Artifacts | Status | Gaps |
|------------------------|------------------|--------|------|
| 1. Understand users | stakeholder-drivers.md, requirements.md | 🟡 Partial | Prototype testing |
| 2. Solve whole problem | requirements.md, wardley-map.md | 🟢 Complete | None |
| 3. Joined up experience | hld-review.md, diagrams/ | 🟡 Partial | Channel strategy |
| ... | ... | ... | ... |

---

## Assessment Preparation Checklist

### Critical Actions (Must Complete Before Assessment)
- [ ] **Action 1**: Conduct prototype testing with diverse user groups
- [ ] **Action 2**: Complete assistive technology testing
- [ ] **Action 3**: Document security threat model

### High Priority Actions (Should Complete)
- [ ] **Action 4**: Create content design documentation
- [ ] **Action 5**: Document agile ceremonies and team composition
- [ ] **Action 6**: Prepare performance metrics dashboard

### Medium Priority Actions (Nice to Have)
- [ ] **Action 7**: Create slide deck summarizing key achievements
- [ ] **Action 8**: Prepare demo environment for assessment day
- [ ] **Action 9**: Rehearse with team

---

## Assessment Day Preparation

### What to Prepare

**Documentation to Share** (send to panel 1 week before):
- [ ] Project overview (1-2 pages)
- [ ] User research repository link
- [ ] Architecture diagrams
- [ ] Prototype/demo environment URL
- [ ] Key artifacts: [List of specific ArcKit files]

**Materials for Assessment Day**:
- [ ] Slide deck (max 10 slides - use sparingly!)
- [ ] Demo environment with test data
- [ ] Printouts of key artifacts (optional)
- [ ] Contact list for panel

### Who Should Attend

**Core Team** (required):
- Product Manager / Service Owner
- Lead User Researcher
- Technical Architect / Lead Developer
- Delivery Manager

**Additional Team Members** (phase-dependent):
- [Phase-specific recommendations]

**Roles During Assessment**:
- [Suggested role assignments]

### Show and Tell Recommendations

**Structure** (4-hour assessment):
- 0:00-0:15: Introductions and context setting
- 0:15-1:00: User research and needs findings
- 1:00-1:45: Service demonstration / prototype walkthrough
- 1:45-2:30: Technical architecture and security
- 2:30-3:00: Team, agile practices, and ways of working
- 3:00-3:45: Open Q&A on any Service Standard points
- 3:45-4:00: Panel deliberation (team steps out)

**Tips**:
- Show real work, not polished presentations
- Have team members who did the work present it
- Be honest about what you don't know yet
- Explain your approach to solving problems
- Demonstrate how you've iterated based on feedback

---

## Booking Information

### How to Book Assessment

1. **Timeline**: Book at least 5 weeks in advance
2. **Contact**: GDS Assessment team via [contact method]
3. **Information to Provide**:
   - Service name and department
   - Assessment phase (alpha/beta/live)
   - Preferred date range
   - Team location (if in-person)
   - Special requirements

### Before Booking

**Minimum Readiness Criteria**:
- [ ] At least 10/14 points rated 🟢 Green or 🟡 Amber
- [ ] No more than 2 points rated 🔴 Red
- [ ] Critical evidence gaps addressed
- [ ] Team available for 4-hour assessment
- [ ] Documentation ready to share 1 week before

**Current Status**:
[Assessment of whether team is ready to book]

---

## Next Steps

### Priority 1: Critical Gaps (Complete within 2 weeks)
1. [Action with timeline]
2. [Action with timeline]
3. [Action with timeline]

### Priority 2: High Priority (Complete within 4 weeks)
1. [Action with timeline]
2. [Action with timeline]

### Priority 3: Medium Priority (Complete within 6 weeks)
1. [Action with timeline]
2. [Action with timeline]

### Continuous Improvement
- Re-run `/arckit.service-assessment PHASE=[phase]` weekly to track progress
- Update this report as evidence is gathered
- Use checklist above to track completion

---

## Resources

### GDS Service Standard Resources
- [Service Manual: Service Standard](https://www.gov.uk/service-manual/service-standard)
- [What happens at a service assessment](https://www.gov.uk/service-manual/service-assessments/how-service-assessments-work)
- [Book a service assessment](https://www.gov.uk/service-manual/service-assessments/book-a-service-assessment)
- [Service Standard Reports](https://www.gov.uk/service-standard-reports) (browse examples)

### Phase-Specific Guidance
- [Alpha phase: What to do](https://www.gov.uk/service-manual/agile-delivery/how-the-alpha-phase-works)
- [Beta phase: What to do](https://www.gov.uk/service-manual/agile-delivery/how-the-beta-phase-works)
- [Live phase: What to do](https://www.gov.uk/service-manual/agile-delivery/how-the-live-phase-works)

### Related ArcKit Commands
- `/arckit.analyze` - Comprehensive governance analysis
- `/arckit.traceability` - Requirements traceability matrix
- `/arckit.tcop` - Technology Code of Practice (overlaps with Service Standard)

---

**Report Generated by**: ArcKit v0.5.0 `/arckit.service-assessment` command
**Next Review**: Re-run this command weekly to track assessment preparation progress
```

---

## 4. Implementation Approach

### 4.1 Evidence Discovery Algorithm

**Step 1: Scan Project Directory**
```
projects/{project-dir}/
├── project-plan.md          → Points 6, 7, 10
├── stakeholder-drivers.md   → Points 1, 6
├── risk-register.md         → Point 9
├── sobc.md                  → Points 10, 11
├── requirements.md          → Points 1, 2, 4, 5, 9, 10, 14
├── data-model.md            → Points 3, 9
├── ai-playbook-assessment.md → Point 9
├── atrs-record.md           → Point 9
├── tcop-assessment.md       → Points 11, 13
├── ukgov-secure-by-design.md → Point 9
├── sow.md                   → Point 11
├── hld-review-*.md          → Points 3, 4, 8, 11, 13, 14
├── dld-review-*.md          → Points 8, 9, 14
├── analysis-report.md       → Points 8, 10
├── traceability-matrix.md   → Point 10
├── diagrams/                → Points 3, 11, 14
│   ├── context-diagram.md
│   ├── container-diagram.md
│   └── deployment-diagram.md
├── wardley-maps/            → Points 2, 11
│   └── current-state.md
└── research/                → Point 11
    └── technology-name/
```

**Step 2: Extract Evidence by Service Standard Point**

For each of the 14 points:
1. Identify which ArcKit artifacts should contain relevant evidence
2. Search those artifacts for keywords and patterns
3. Extract relevant sections with line numbers
4. Assess completeness against phase requirements
5. Identify gaps

**Step 3: Phase-Appropriate Assessment**

Apply different criteria based on phase:
- **Alpha**: Lower expectations, focus on research and prototyping
- **Beta**: Higher expectations, focus on working service and testing
- **Live**: Highest expectations, focus on performance and continuous improvement

**Step 4: RAG Rating Logic**

For each point:
```
IF all critical evidence found for phase → 🟢 Green
ELSE IF partial evidence found, minor gaps → 🟡 Amber
ELSE IF missing critical evidence → 🔴 Red
```

Overall readiness:
```
IF 12+ points Green → 🟢 Overall Green (Ready)
ELSE IF 10+ points Green/Amber, max 2 Red → 🟡 Overall Amber (Nearly Ready)
ELSE → 🔴 Overall Red (Not Ready)
```

### 4.2 Phase-Specific Evidence Requirements

**Alpha Phase - Evidence Matrix**:

| Point | Critical Evidence | Optional Evidence |
|-------|------------------|-------------------|
| 1 | User research findings, prototype testing | Analytics data |
| 2 | User journey maps, problem definition | Service blueprint |
| 3 | Channel mapping | Integration architecture |
| 4 | Usability testing results | Cognitive walkthrough |
| 5 | Accessibility considerations documented | WCAG audit |
| 6 | Team composition, skills audit | Team charter |
| 7 | Sprint cadence, retrospectives | Agile maturity assessment |
| 8 | Prototype iterations documented | A/B testing results |
| 9 | Threat model, GDPR assessment | Penetration test |
| 10 | Success metrics defined | Metrics dashboard |
| 11 | Technology options analysis | Proof of concepts |
| 12 | Open source approach decided | Repository created |
| 13 | Standards identified | GOV.UK patterns used |
| 14 | Reliability requirements | N/A at alpha |

**Beta Phase - Evidence Matrix**:

| Point | Critical Evidence | Optional Evidence |
|-------|------------------|-------------------|
| 1 | Ongoing user research, diverse participants | Ethnographic studies |
| 2 | End-to-end service working | Omnichannel support |
| 3 | All channels integrated | Assisted digital support |
| 4 | Usability testing passed | User satisfaction >4/5 |
| 5 | WCAG 2.1 AA testing complete | Assistive tech testing videos |
| 6 | Team stable, skills current | Career development plans |
| 7 | Agile ceremonies mature | DevOps maturity |
| 8 | Iteration log with user feedback | Continuous deployment |
| 9 | Security testing complete | SOC 2 certification |
| 10 | Performance data being published | Real-time dashboards |
| 11 | Technology justified, documented | TCO analysis |
| 12 | Code repositories public | Open source contributions |
| 13 | GOV.UK patterns used, documented | Standards contributions |
| 14 | Uptime metrics, incident management | 99.9% uptime achieved |

**Live Phase - Evidence Matrix**:

| Point | Critical Evidence | Optional Evidence |
|-------|------------------|-------------------|
| 1 | User satisfaction tracked | Net Promoter Score |
| 2 | User completion rates high | Service improvements logged |
| 3 | Channel shift monitored | Cost per transaction tracked |
| 4 | Task completion >90% | Support ticket volume low |
| 5 | Accessibility complaints = 0 | Accessibility award |
| 6 | Team retention high | Internal satisfaction high |
| 7 | Continuous improvement demonstrated | Innovation sprints |
| 8 | Monthly iterations with user feedback | Feature flagging |
| 9 | Zero security incidents | Annual pen test |
| 10 | Performance data public on GOV.UK | Real-time dashboards |
| 11 | Tech debt managed | Cloud cost optimized |
| 12 | Active open source community | External contributions |
| 13 | Standards compliance reviewed | Standards leadership |
| 14 | SLA met consistently | Auto-scaling, chaos testing |

### 4.3 Recommendation Generation

**Priority Levels**:
- **Critical**: Must fix before assessment (would result in Red rating)
- **High**: Should fix before assessment (would result in Amber rating)
- **Medium**: Nice to have (would strengthen Green rating)

**Recommendation Templates**:

```
Critical: [Point X] - [Gap Description]
Action: [Specific action to take]
Timeline: [Days/weeks to complete]
Owner: [Suggested role]
Resources: [Links to guidance]
```

---

## 5. Example Scenarios

### 5.1 Scenario: NHS Appointment Booking (Alpha Assessment)

**Context**:
- Project: NHS appointment booking system
- Phase: End of alpha, preparing for alpha assessment
- ArcKit artifacts: stakeholder-drivers.md, requirements.md, hld-review.md, secure-by-design.md, data-model.md

**Command**:
```
/arckit.service-assessment PHASE=alpha DATE=2025-11-15
```

**Expected Output** (excerpt):

```markdown
# GDS Service Assessment Preparation Report

**Project**: NHS Appointment Booking System
**Assessment Phase**: Alpha
**Assessment Date**: 15 November 2025 (16 days away)
**Overall Readiness**: 🟡 Amber - Nearly Ready

**Readiness Score**: 11/14 points ready (3 🟢 Green, 8 🟡 Amber, 3 🔴 Red)

**Critical Gaps**:
- Point 1: No prototype testing with real patients documented
- Point 5: Accessibility testing not yet conducted
- Point 8: Iteration process not clearly documented

**Recommended Timeline**: 2 weeks to address critical gaps before assessment

---

## Service Standard Assessment (14 Points)

### 1. Understand Users and Their Needs

**Status**: 🔴 Not Ready

**Evidence Found**:
✅ **stakeholder-drivers.md** (lines 78-145)
   - 5 user groups identified (patients, GPs, practice managers, NHS 111, hospital schedulers)
   - Pain points documented from stakeholder workshops

✅ **requirements.md** (Section 2.1: User Stories)
   - 34 user stories with acceptance criteria
   - User personas for 3 primary groups

❌ **Missing**: Prototype testing results with real patients
❌ **Missing**: User research with elderly users and those using assistive technologies

**Gap Analysis**:
Strong stakeholder analysis and requirements, but **no evidence of prototype testing with actual users**. This is critical for alpha assessment.

**Readiness Rating**: 🔴 Red
- Strong: User needs documented comprehensively
- Weak: No testing evidence
- Missing: Prototype testing with diverse users (critical for alpha)

**Recommendations**:
1. **Critical**: Conduct prototype testing with 8-12 NHS patients across age groups (include 65+ and assistive tech users) - 1 week
2. **Critical**: Document research findings in shareable format for assessment panel - 2 days
3. **High**: Create research playback presentation for assessment day - 1 day

---

### 6. Have a Multidisciplinary Team

**Status**: 🟢 Ready

**Evidence Found**:
✅ **stakeholder-drivers.md** (RACI Matrix, lines 234-267)
   - Team composition documented: Product Manager, UX Researcher, Content Designer, Tech Lead, 3 Developers, QA Lead, Delivery Manager
   - Skills coverage: UX research, clinical safety, NHS integration, accessibility

✅ **project-plan.md** (Section 4: Team Structure)
   - Team has right mix of skills
   - Clinical safety officer assigned
   - IG Toolkit specialist on team

**Gap Analysis**:
Excellent team composition with NHS-specific expertise. Well documented.

**Readiness Rating**: 🟢 Green
- All required roles present
- NHS-specific expertise included
- Skills documented clearly

**Recommendations**:
1. **Medium**: Prepare team introduction slides for assessment (photos, roles, experience) - 1 day
2. **Medium**: Have each team member prepare 2-minute intro about their role - 2 days

---

[... continues for all 14 points ...]

## Assessment Preparation Checklist

### Critical Actions (Complete within 1 week)
- [ ] **Prototype testing with patients**: Book research sessions with 8-12 patients including elderly and assistive tech users
- [ ] **Accessibility audit**: Conduct WCAG 2.1 evaluation of prototype
- [ ] **Document iteration process**: Create log showing design changes based on feedback

**Assessment Day Preparation**:
- Prepare: User research playback showing prototype testing
- Show: Prototype with actual NHS test data
- Bring: Lead User Researcher and Clinical Safety Officer
- Materials: Share research repository and prototype link 1 week before assessment

**Booking Recommendation**: ⚠️ Do not book assessment yet. Complete critical actions first, then re-run this command to verify readiness.
```

### 5.2 Scenario: Payment Gateway (Beta Assessment)

**Context**:
- Project: GOV.UK Pay integration
- Phase: Preparing for beta assessment (private to public beta transition)
- Rich set of ArcKit artifacts including design reviews, security assessments, performance testing

**Command**:
```
/arckit.service-assessment PHASE=beta
```

**Expected Outcome**:
- Higher bar for evidence requirements
- More focus on working service, security testing, performance metrics
- Likely 🟢 Green overall if alpha was passed and team has been working well
- Recommendations focused on continuous improvement and live readiness

---

## 6. Command Integration

### 6.1 When to Use This Command

**Recommended Usage Pattern**:

1. **Early in Phase** (Week 1-2):
   - Run command to understand what evidence will be needed
   - Use output to plan work and ensure evidence is gathered

2. **Mid-Phase** (Week 4-6):
   - Re-run to check progress
   - Identify emerging gaps early

3. **Pre-Assessment** (2 weeks before):
   - Final readiness check
   - Generate assessment day materials
   - Verify all evidence is documented

4. **Weekly Check-Ins**:
   - Re-run command weekly during assessment preparation
   - Track progress against checklist
   - Adjust priorities based on updated gaps

### 6.2 Complementary Commands

**Before Service Assessment**:
```
# Generate all key artifacts first
/arckit.plan
/arckit.stakeholders
/arckit.requirements
/arckit.hld-review
/arckit.secure
/arckit.diagram

# Then check assessment readiness
/arckit.service-assessment PHASE=alpha

# Address gaps, then analyze overall governance
/arckit.analyze
/arckit.traceability
```

**After Service Assessment**:
- Use assessment report feedback to update ArcKit artifacts
- Address amber points with relevant ArcKit commands
- Track progress in "tracking amber evidence" document

### 6.3 Overlap with Existing Commands

**Comparison: `/arckit.service-assessment` vs `/arckit.analyze`**:

| Feature | /arckit.service-assessment | /arckit.analyze |
|---------|---------------------------|-----------------|
| **Focus** | GDS Service Standard compliance | Overall governance quality |
| **Criteria** | 14-point Service Standard | Best practices, traceability, completeness |
| **Output** | Assessment preparation report | Governance analysis report |
| **When to Use** | Before GDS assessments | General quality check |
| **Scoring** | RAG per point, X/14 ready | Governance Health Score, letter grade |
| **Audience** | GDS assessment panel prep | Internal governance review |

**These commands are complementary**:
- Use `/arckit.analyze` for general governance quality throughout project
- Use `/arckit.service-assessment` specifically when preparing for GDS assessments
- Together they provide comprehensive view of project health

**Comparison: `/arckit.service-assessment` vs `/arckit.tcop`**:

| Feature | /arckit.service-assessment | /arckit.tcop |
|---------|---------------------------|--------------|
| **Framework** | GDS Service Standard (14 points) | Technology Code of Practice (13 points) |
| **Scope** | Whole service (user needs, team, tech, operations) | Technology decisions only |
| **Overlap** | Points 11, 13 overlap with TCoP | All 13 TCoP points |
| **Detail** | Broad service assessment | Deep technology assessment |

**Recommendation**:
- Generate `/arckit.tcop` assessment during alpha/beta
- Include TCoP assessment as evidence for Service Standard Points 11 and 13
- `/arckit.service-assessment` will reference TCoP assessment if present

---

## 7. Implementation Priorities

### Phase 1: Core Functionality (MVP)
- ✅ Evidence discovery across all ArcKit artifacts
- ✅ Mapping to 14 Service Standard points
- ✅ Gap analysis per point
- ✅ RAG rating per point and overall
- ✅ Phase-appropriate evidence requirements (alpha/beta/live)
- ✅ Generate comprehensive markdown report

### Phase 2: Enhanced Features
- ⏳ Assessment day preparation guidance
- ⏳ Team role recommendations
- ⏳ Timeline calculations (days until ready, based on gaps)
- ⏳ Evidence inventory table
- ⏳ Booking readiness indicator

### Phase 3: Advanced Features
- 📋 Interactive checklist tracking (mark items complete)
- 📋 Progress tracking across multiple runs
- 📋 Automated slide deck generation (optional)
- 📋 Link to example assessment reports for reference
- 📋 Integration with `/arckit.analyze` for combined report

---

## 8. Success Criteria

**This command will be successful if**:

1. **Time Savings**: Teams save 1-2 weeks of manual assessment preparation
2. **Better Outcomes**: Higher pass rate (more Green, fewer Amber/Red ratings)
3. **Confidence**: Teams feel prepared and confident going into assessments
4. **Reusability**: Command run multiple times throughout phase for continuous tracking
5. **Actionability**: Teams can directly action recommendations without further interpretation
6. **Accuracy**: Evidence mapping correctly identifies relevant artifacts
7. **Completeness**: No Service Standard points overlooked

**Target Metrics**:
- 90% of users find report "very helpful" for assessment prep
- 80% of teams pass assessment on first attempt (vs industry baseline ~83%)
- 50% reduction in time spent preparing for assessment
- 100% of relevant ArcKit artifacts mapped to Service Standard points

---

## 9. Future Enhancements

### Version 0.6.0+
- **Amber Tracking Integration**: If team receives Amber ratings, generate "tracking amber evidence" document and track progress
- **Post-Assessment Report**: Compare self-assessment vs actual assessment outcomes, learn and improve
- **Multi-Service Standard Support**: Support NHS Service Standard, Scottish Service Standard, MOD equivalents
- **Assessment Panel Simulation**: AI-powered mock assessment with typical panel questions
- **Evidence Quality Scoring**: Not just presence/absence, but quality assessment of evidence
- **Auto-Evidence Generation**: Suggest specific content to add to artifacts to close gaps
- **Integration with Jira/Azure DevOps**: Pull in sprint data, user story completion, test results automatically

---

## 10. Conclusion

The `/arckit.service-assessment` command represents a natural evolution of ArcKit's value proposition:

**From**: "Help teams generate architecture documentation"
**To**: "Help teams demonstrate compliance with UK Government standards"

By automating the mapping between ArcKit artifacts and the GDS Service Standard, this command:
- Saves significant time (weeks → hours)
- Improves assessment outcomes (better preparation → higher pass rates)
- Provides continuous feedback (re-run weekly to track progress)
- Maximizes ROI from ArcKit adoption (leverage all created artifacts)

**This command transforms ArcKit from a documentation tool into a governance and compliance platform.**

---

## Appendices

### Appendix A: Full 14-Point Service Standard

1. **Understand users and their needs** - Take time to understand your users' needs and the problem you're trying to solve for them
2. **Solve a whole problem for users** - Work towards creating a service that solves a whole problem for users
3. **Provide a joined up experience across all channels** - Work towards creating a service that is joined up across all channels
4. **Make the service simple to use** - Build a service that's simple to use so that people can succeed first time
5. **Make sure everyone can use the service** - Make sure everyone can use your service, including disabled people and people with other legally protected characteristics
6. **Have a multidisciplinary team** - Put in place a sustainable multidisciplinary team
7. **Use agile ways of working** - Create the service using agile ways of working
8. **Iterate and improve frequently** - Make sure you have the capacity, resources and technical flexibility to iterate and improve the service frequently
9. **Create a secure service which protects users' privacy** - Take an approach to security and privacy which ensures users' data is kept secure and their privacy is protected
10. **Define what success looks like and publish performance data** - Work out what success looks like and use metrics and data to inform decisions
11. **Choose the right tools and technology** - Choose tools and technology that let you build a good service in an efficient, cost effective way
12. **Make new source code open** - Make all new source code open and reusable, and publish it under appropriate licences
13. **Use and contribute to open standards, common components and patterns** - Build on open standards and common components and patterns from inside and outside government
14. **Operate a reliable service** - Minimise service downtime and have a plan to deal with it when it does happen

### Appendix B: Assessment Report Examples

- [Electronic Travel Authorisation (ETA) - Beta](https://www.gov.uk/service-standard-reports/electronic-travel-authorisation-eta-beta-assessment)
- [GOV.UK Design System - Alpha](https://www.gov.uk/service-standard-reports/gov-uk-design-system-alpha-assessment)
- [Browse all reports](https://www.gov.uk/service-standard-reports)

### Appendix C: Related Frameworks

**Technology Code of Practice** (13 points):
- Overlaps with Service Standard Points 11, 13
- ArcKit command: `/arckit.tcop`
- More technology-focused, less user-focused

**NHS Service Standard** (17 points):
- Based on GDS Service Standard
- Additional healthcare-specific points
- Future ArcKit enhancement opportunity

**Scottish Service Standard** (14 points):
- Same structure as GDS Service Standard
- Scottish government context

---

**End of Design Document**

**Next Steps**:
1. Review and approve design
2. Implement Phase 1 (MVP)
3. Test with real ArcKit projects
4. Iterate based on feedback
5. Deploy to production

**Questions for Review**:
1. Is the scope appropriate (preparation vs simulation)?
2. Is the phase-specific evidence matrix comprehensive?
3. Should we generate separate files per phase or single file?
4. Are the RAG rating criteria clear and appropriate?
5. What's the minimum viable version for launch?
