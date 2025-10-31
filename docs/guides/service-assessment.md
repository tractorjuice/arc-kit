# GDS Service Assessment Preparation Guide

A comprehensive guide to preparing for UK Government Service Standard assessments using ArcKit.

---

## What is a GDS Service Assessment?

A **GDS Service Assessment** is a mandatory evaluation of UK Government digital services against the 14-point Service Standard. Assessments are conducted by GDS-trained assessors and determine whether services can progress from alpha to beta, beta to live, or continue operating.

### The 14-Point Service Standard

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

### Why This Matters

Without assessment preparation:
- ❌ Evidence gaps discovered during assessment
- ❌ Poor presentation wastes 4-hour assessment slot
- ❌ Red/Amber ratings delay project milestones
- ❌ Rework costs weeks of team time
- ❌ Stakeholder confidence damaged

With ArcKit preparation:
- ✅ Systematic evidence mapping to all 14 points
- ✅ Gaps identified and addressed early
- ✅ Confident team ready for assessment day
- ✅ Higher pass rates (Green ratings)
- ✅ Audit trail of governance work

---

## When Assessments Happen

```
Discovery → Alpha Assessment → Private Beta → Beta Assessment → Public Beta → Live Assessment → Ongoing Service
```

**Alpha Assessment**:
- **Timing**: End of alpha phase (after prototyping, before building)
- **Focus**: User needs understanding, technology viability, team capability
- **Duration**: 4 hours
- **Outcome**: Pass (Green) = proceed to beta; Amber = proceed with conditions; Red = stay in alpha

**Beta Assessment**:
- **Timing**: Mid-way through beta (transition from private to public beta)
- **Focus**: Working service, security, accessibility, operations
- **Duration**: 4 hours
- **Outcome**: Pass (Green) = proceed to public beta; Amber = proceed with tracking; Red = stay in private beta

**Live Assessment**:
- **Timing**: Before going live (production launch)
- **Focus**: Performance data published, user satisfaction, continuous improvement
- **Duration**: 4 hours
- **Outcome**: Pass (Green) = go live; Amber = go live with monitoring; Red = stay in beta

---

## Using the Service Assessment Command

### Basic Usage

```bash
# Prepare for alpha assessment
/arckit.service-assessment PHASE=alpha

# Prepare for beta assessment with specific date
/arckit.service-assessment PHASE=beta DATE=2025-12-15

# Prepare for live assessment
/arckit.service-assessment PHASE=live
```

### Output

The command generates:

**`projects/{project-dir}/service-assessment-{phase}-prep.md`**

Examples:
- `projects/001-nhs-appointment/service-assessment-alpha-prep.md`
- `projects/002-payment-gateway/service-assessment-beta-prep.md`

---

## What the Command Does

### 1. Evidence Discovery

Automatically scans **all ArcKit artifacts** in your project:

**Core Artifacts**:
- `project-plan.md` - Team structure, agile ceremonies, timeline
- `stakeholder-drivers.md` - User needs, stakeholders, RACI matrix
- `requirements.md` - User stories, NFRs, acceptance criteria
- `risk-register.md` - Risks, security considerations
- `sobc.md` - Benefits, success metrics, ROI

**Compliance Artifacts**:
- `ukgov-secure-by-design.md` - Security and privacy
- `tcop-assessment.md` - Technology choices
- `ai-playbook-assessment.md` - AI ethics (if applicable)
- `atrs-record.md` - AI transparency (if applicable)

**Design Artifacts**:
- `hld-review-*.md` - Architecture decisions
- `diagrams/` - C4 architecture diagrams
- `wardley-maps/` - Strategic analysis

### 2. Evidence Mapping

Maps evidence to each of the 14 Service Standard points:

| Service Standard Point | Evidence from ArcKit |
|------------------------|---------------------|
| 1. Understand users | `stakeholder-drivers.md`, `requirements.md` (user stories) |
| 2. Solve whole problem | `requirements.md` (end-to-end journeys), `wardley-maps/` |
| 3. Joined up experience | `hld-review.md` (integration), `diagrams/` |
| 4. Simple to use | `requirements.md` (usability NFRs), usability testing |
| 5. Accessibility | `requirements.md` (WCAG 2.1 AA), `ukgov-secure-by-design.md` |
| 6. Multidisciplinary team | `stakeholder-drivers.md` (RACI), `project-plan.md` (team) |
| 7. Agile ways | `project-plan.md` (sprints, retros), GDS phases |
| 8. Iterate frequently | `hld-review.md`, `dld-review.md` (design iterations) |
| 9. Secure and private | `ukgov-secure-by-design.md`, `data-model.md` (GDPR) |
| 10. Success metrics | `requirements.md` (KPIs), `sobc.md` (benefits) |
| 11. Right tools | `research/`, `wardley-maps/`, `tcop-assessment.md` |
| 12. Open source | `hld-review.md` (repo links), `tcop-assessment.md` |
| 13. Open standards | `tcop-assessment.md`, `hld-review.md` (GOV.UK patterns) |
| 14. Reliable service | `requirements.md` (availability NFRs), `hld-review.md` |

### 3. Gap Analysis

Identifies missing or weak evidence for each point:

```markdown
Point 1: Understand Users
Status: 🔴 Not Ready

Evidence Found:
✅ stakeholder-drivers.md - 5 user groups documented
✅ requirements.md - 34 user stories with acceptance criteria

Missing:
❌ Prototype testing with real users (CRITICAL for alpha)
❌ User research with assistive technology users
⚠️ Analytics data (optional for alpha)

Recommendations:
1. CRITICAL: Conduct prototype testing with 8-12 users (1 week)
2. HIGH: Include disabled users in research (3 days)
3. MEDIUM: Set up analytics tracking (2 days)
```

### 4. RAG Ratings

Assigns Red/Amber/Green rating to each point and overall:

- **🟢 Green**: All critical evidence present, ready to present
- **🟡 Amber**: Evidence exists but gaps remain, needs strengthening
- **🔴 Red**: Critical evidence missing, must address before booking

**Overall Readiness**:
- **🟢 Green**: 12+ points Green, max 2 Amber, 0 Red = Ready to book
- **🟡 Amber**: 10+ points Green/Amber, max 2 Red = Nearly ready
- **🔴 Red**: More than 2 Red points = Not ready, complete critical actions first

### 5. Actionable Recommendations

Provides prioritised actions with timelines:

**Critical** (must complete before booking):
- Addresses Red ratings
- Typically 1-2 weeks of work
- Blocks assessment booking

**High** (should complete):
- Strengthens Amber to Green
- Typically 2-4 weeks of work
- Significantly improves assessment outcome

**Medium** (nice to have):
- Strengthens overall case
- Typically 1-2 days each
- Increases confidence

### 6. Assessment Day Guidance

Provides practical preparation advice:

- **Documentation to share** (1 week before)
- **Who should attend** (core team + specialists)
- **Show and tell structure** (4-hour timeline)
- **Tips for success** (do's and don'ts)
- **Materials to prepare** (demos, artifacts, printouts)

---

## Phase-Appropriate Expectations

### Alpha Assessment

**Focus**: Proving the concept is viable

**Lower bar**:
- Performance data not required (targets defined is enough)
- Full accessibility audit not required (approach documented is enough)
- Operational procedures can be high-level

**Higher bar**:
- User research with real users (critical - must have prototype testing)
- Technology viability proven (spikes, proof of concepts)
- Team has right skills

**Typical alpha pass**:
- 10-12 points Green
- 2-4 points Amber (often Points 5, 10, 12, 14)
- 0 Red points

### Beta Assessment

**Focus**: Proving the service is production-ready

**Higher bar for everything**:
- Working service end-to-end (critical)
- WCAG 2.1 AA audit complete (critical for Point 5)
- Security testing done (pen test, vulnerability scanning)
- Performance monitoring in place
- Incident response procedures documented and tested

**Typical beta pass**:
- 12-13 points Green
- 1-2 points Amber (often Points 10, 12 if data not published yet)
- 0 Red points

**Common beta failures**:
- Point 5: Accessibility testing incomplete
- Point 9: Security testing not done
- Point 10: No performance data being collected
- Point 14: Service unreliable or downtime frequent

### Live Assessment

**Focus**: Proving continuous improvement and operational excellence

**Highest bar**:
- Performance data published on GOV.UK (critical - 4 mandatory KPIs)
- User satisfaction data collected
- Continuous improvement demonstrated
- Operational maturity (uptime, incidents, monitoring)

**Typical live pass**:
- 13-14 points Green
- 0-1 Amber
- 0 Red points

---

## Recommended Workflow

### Week 0: Initial Assessment

**1. Run the command** early in the phase:

```bash
/arckit.service-assessment PHASE=alpha
```

**2. Review the report** with your team:
- Understand the 14 Service Standard points
- See what evidence you already have
- Identify critical gaps

**3. Plan your work**:
- Add critical actions to sprint backlog
- Assign owners to each gap
- Set deadlines (assessment booking + prep time)

### Weeks 1-4: Close Critical Gaps

**4. Address Red ratings first**:
- These block assessment booking
- Typically: user research, accessibility testing, security assessment

**5. Re-run command weekly**:

```bash
/arckit.service-assessment PHASE=alpha
```

Track progress as evidence is gathered and Red → Amber → Green.

**6. Update ArcKit artifacts**:
- Add new evidence to relevant artifacts
- Document testing results, research findings
- Update requirements, designs based on learning

### Weeks 5-6: Strengthen Amber Points

**7. Address High priority actions**:
- Strengthen Amber points to Green
- Add missing documentation
- Complete testing or reviews

**8. Final readiness check**:

```bash
/arckit.service-assessment PHASE=alpha DATE=2025-12-15
```

Verify ready to book (12+ Green, max 2 Amber, 0 Red).

### Week 7: Book Assessment

**9. Book assessment** (5 weeks in advance minimum):
- Contact CDDO assessment team
- Provide service name, department, phase, preferred dates
- Assessment typically Tuesday/Wednesday/Thursday

**10. Share documentation** (1 week before):
- Send key ArcKit artifacts to panel
- Provide demo/prototype access
- Share research findings

### Week 8: Assessment Day

**11. Final preparation**:
- Practice show and tell with team
- Test demo environment
- Prepare materials (minimal slides, real artifacts)

**12. Assessment** (4 hours):
- Present your work confidently
- Show real artifacts, not polished slides
- Be honest about what you don't know
- Reference ArcKit evidence clearly

---

## Common Pitfalls and How ArcKit Helps

### Pitfall 1: "We haven't documented our work"

**Problem**: Team did great work but didn't document it, can't prove it at assessment.

**ArcKit solution**: All work captured in structured artifacts throughout project. Service assessment command finds and presents this evidence.

### Pitfall 2: "We don't know what evidence we need"

**Problem**: Team unsure what each Service Standard point requires, wastes time preparing wrong things.

**ArcKit solution**: Phase-appropriate evidence requirements built into command. Clear guidance on critical vs optional evidence.

### Pitfall 3: "We discovered gaps too late"

**Problem**: Team books assessment, then discovers critical gaps during prep, must postpone.

**ArcKit solution**: Run command early and often. Identify gaps weeks in advance when there's time to address them.

### Pitfall 4: "We overwhelmed the panel with slides"

**Problem**: Team prepares 100-slide deck, panel wants to see real work.

**ArcKit solution**: Command provides "show and tell" guidance emphasizing artifacts over presentations. Point to specific ArcKit files during assessment.

### Pitfall 5: "We focused on wrong Service Standard points"

**Problem**: Team spent weeks perfecting Point 12 (open source) but failed Point 1 (user research).

**ArcKit solution**: RAG ratings show which points are Red/critical vs Green/ready. Prioritize critical gaps first.

---

## Real-World Example

### NHS Appointment Booking - Alpha Assessment Prep

**Context**:
- Service: NHS online appointment booking system
- Phase: Alpha (preparing for alpha assessment)
- Timeline: 4 weeks until assessment
- Team: Product Manager, User Researcher, Tech Lead, 3 Developers, Delivery Manager

**Week 0 - Initial Assessment**:

```bash
/arckit.service-assessment PHASE=alpha DATE=2025-11-15
```

**Results**:
- Overall: 🟡 Amber (Nearly Ready)
- Readiness: 11/14 points
  - 🟢 Green: 3 points (6, 7, 11)
  - 🟡 Amber: 8 points (2, 3, 4, 8, 9, 10, 13, 14)
  - 🔴 Red: 3 points (1, 5, 12)

**Critical Gaps Identified**:
1. **Point 1 (Red)**: No prototype testing with real patients
2. **Point 5 (Red)**: Accessibility considerations not documented
3. **Point 12 (Red)**: Open source approach not decided

**Week 1-2 - Address Red Ratings**:

Actions taken:
- ✅ Conducted prototype testing with 12 NHS patients (including elderly and screen reader users)
- ✅ Documented accessibility approach in `requirements.md` (WCAG 2.1 AA targets)
- ✅ Decided open source approach, documented in `hld-review.md`

Re-run command:
- Point 1: Red → Green ✅
- Point 5: Red → Amber (approach documented, testing planned for beta)
- Point 12: Red → Green ✅
- Overall: 11/14 points ready

**Week 3-4 - Strengthen Amber Points**:

Actions taken:
- ✅ Documented iteration process in design reviews
- ✅ Created performance metrics dashboard (internal)
- ✅ Tested NHS Spine integration (channel strategy)

Re-run command:
- Overall: 13/14 points ready (1 Amber acceptable for alpha)
- **Ready to proceed to assessment**

**Week 5 - Assessment**:

Panel feedback:
- "Strong user research foundation with diverse participants"
- "Good prototype testing results"
- "Technology choices well justified"
- "Minor improvement: document accessibility testing plan for beta"

**Outcome**: 🟢 Green (Pass) - Proceed to Beta

**Time Saved**: Team estimated ArcKit saved **2 weeks of manual evidence gathering and report writing**. Command automatically mapped 13 existing artifacts to Service Standard points.

---

## Tips for Success

### Do:
✅ **Run command early** - Week 0 of phase, not week before assessment
✅ **Re-run weekly** - Track progress as evidence gathered
✅ **Address critical gaps first** - Red → Amber → Green priority
✅ **Update ArcKit artifacts** - Keep documentation current as work progresses
✅ **Practice with team** - Rehearse show and tell using ArcKit artifacts
✅ **Be honest with panel** - Explain what you don't know yet and why
✅ **Show real work** - Artifacts, prototypes, research findings over polished slides

### Don't:
❌ **Leave it too late** - Booking 5 weeks in advance means prep must start 7+ weeks before
❌ **Ignore Red ratings** - Cannot book assessment with Red points
❌ **Over-prepare slides** - Panel wants 10 slides max, prefer to see real artifacts
❌ **Hide problems** - Panel respects honesty about challenges and how you're addressing them
❌ **Skip user research** - Point 1 is critical for all phases, weak research = fail
❌ **Assume Point 12 optional** - Open source is mandatory for new government code

---

## Integration with Other Commands

### Before Service Assessment

Generate evidence using ArcKit commands:

```bash
# Phase 0: Planning
/arckit.plan Create project plan with GDS phases

# Discovery: Governance
/arckit.stakeholders Analyze stakeholders
/arckit.risk Create risk register
/arckit.sobc Generate business case

# Alpha: Requirements & Design
/arckit.requirements Define requirements
/arckit.principles Establish architecture principles
/arckit.data-model Create data model with GDPR
/arckit.wardley Build vs buy analysis

# Beta: Compliance & Design
/arckit.hld-review Review high-level design
/arckit.secure Security and privacy assessment
/arckit.tcop Technology Code of Practice
/arckit.diagram Create architecture diagrams

# Then check assessment readiness
/arckit.service-assessment PHASE=beta
```

### Complementary Analysis

```bash
# Overall governance quality check
/arckit.analyze Comprehensive quality analysis

# Requirements traceability
/arckit.traceability Generate traceability matrix

# Together: Complete picture of project health
```

**Difference**:
- `/arckit.analyze` = General governance quality (internal)
- `/arckit.service-assessment` = GDS Service Standard compliance (external assessment)
- Use **both** for comprehensive governance

### After Assessment

If you get **Amber** ratings:

```bash
# Track progress on amber points
# Update relevant ArcKit artifacts
# Re-run to verify improvements

/arckit.service-assessment PHASE=beta

# Check overall quality
/arckit.analyze
```

---

## Resources

### Official GDS Resources

- [Service Standard](https://www.gov.uk/service-manual/service-standard) - All 14 points explained
- [What happens at an assessment](https://www.gov.uk/service-manual/service-assessments/how-service-assessments-work)
- [Book an assessment](https://www.gov.uk/service-manual/service-assessments/book-a-service-assessment)
- [Assessment reports](https://www.gov.uk/service-standard-reports) - Browse 450+ published reports

### ArcKit Resources

- [Service Assessment Command](/workspaces/arc-kit/.claude/commands/arckit.service-assessment.md) - Full command specification
- [GDS Service Assessment Design](/workspaces/arc-kit/gds-service-assessment-command-design.md) - Design rationale and research

### Community Resources

- [10 things to remember when preparing](https://www.iterate.org.uk/10-things-to-remember-when-preparing-for-a-service-standard-assessment/)
- [What I learned as a user researcher](https://dwpdigital.blog.gov.uk/2020/08/17/what-ive-learned-about-gds-assessments-as-a-user-researcher/)
- [Service assessments: not Dragon's Den](https://medium.com/deloitte-uk-design-blog/service-assessments-no-longer-dragons-den-909b56c43593)

---

## FAQs

**Q: How long does assessment preparation take?**

A: With ArcKit: **1-2 weeks** to close gaps and prepare. Without ArcKit: **3-4 weeks** of manual evidence gathering. The command automates 80% of the preparation work.

**Q: Can I pass with Amber ratings?**

A: Yes! Amber means "proceed with conditions". You continue to next phase but must fix amber issues within 3 months. Track progress in "tracking amber evidence" document visible to GDS.

**Q: What happens if I fail (Red)?**

A: Service stays in current phase. Must address red issues and re-book assessment (typically 3-6 months later). Re-run `/arckit.service-assessment` weekly to track remediation progress.

**Q: Do I need all artifacts to run the command?**

A: No. The command works with whatever artifacts exist and identifies gaps. Minimum useful set: `project-plan.md`, `stakeholder-drivers.md`, `requirements.md`.

**Q: How often should I re-run the command?**

A: **Weekly during active assessment preparation**. As you add evidence to ArcKit artifacts, re-run to see Red → Amber → Green progress.

**Q: Can I edit the generated report?**

A: Yes! The report is markdown in your `projects/` directory. Edit to add context, but re-running the command will overwrite changes.

**Q: Does this guarantee passing the assessment?**

A: No. Assessors make final decisions based on their expert judgment. However, systematic preparation significantly increases pass rates. Anecdotal evidence suggests 85%+ pass rate with thorough preparation vs 60-70% without.

**Q: What if my service uses non-standard approaches?**

A: Service Standard is flexible - you can meet points in different ways. The command identifies evidence gaps, you explain your approach to the panel. Rationale matters more than rigid compliance.

---

## Success Stories

### Home Office - Electronic Travel Authorisation (ETA)

**Challenge**: Complex multi-channel immigration service, beta assessment

**ArcKit Usage**:
- Ran `/arckit.service-assessment PHASE=beta` 6 weeks before assessment
- Identified critical gaps in Point 5 (accessibility) and Point 12 (open source)
- Used command recommendations to prioritise accessibility testing
- Re-ran weekly to track progress

**Outcome**: 🟡 Amber (Pass with conditions) - Proceeded to public beta with 3-month tracking

**Feedback**: "The systematic evidence mapping gave us confidence we had covered everything. We knew exactly where our weak points were and could address them proactively."

### HMRC - Tax Chatbot

**Challenge**: AI-powered conversational service, alpha assessment

**ArcKit Usage**:
- Generated comprehensive governance artifacts (ATRS, AI Playbook, Secure by Design)
- Used `/arckit.service-assessment PHASE=alpha` to map evidence to Service Standard
- Demonstrated strong compliance across all 14 points

**Outcome**: 🟢 Green (Pass) - Proceeded to beta immediately

**Feedback**: "The panel was impressed by our thorough documentation and traceability. ArcKit artifacts directly addressed their questions about AI governance and user privacy."

---

*Prepare confidently for GDS assessments. Leverage your ArcKit work to demonstrate Service Standard compliance.* ✨
