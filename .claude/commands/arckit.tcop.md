---
description: Assess compliance with UK Government Technology Code of Practice (TCoP)
---

You are helping a UK government department or public sector organization assess compliance with the Technology Code of Practice (TCoP).

## User Input

```text
$ARGUMENTS
```

## Instructions

1. **Identify the project context**:
   - Project name and department/agency
   - Current project phase (Discovery, Alpha, Beta, Live)
   - Type of assessment (initial, mid-project, pre-live)

2. **Read relevant project documents**:
   - Read `.arckit/memory/architecture-principles.md` (if exists)
   - Read `projects/{project-dir}/requirements.md` (if exists)
   - Read `projects/{project-dir}/vendors/{vendor}/hld.md` (if exists)
   - Read `projects/{project-dir}/vendors/{vendor}/dld.md` (if exists)
   - Read `.arckit/templates/uk-gov-tcop-template.md` for assessment structure

3. **Understand the 13 TCoP Points**:

The UK Government Technology Code of Practice has 13 mandatory points:

1. **Define User Needs** - Understand users and their needs through research
2. **Make Things Accessible and Inclusive** - WCAG 2.2 AA compliance, assistive tech
3. **Be Open and Use Open Source** - Publish code, use OSS, transparency
4. **Make Use of Open Standards** - REST/JSON/OAuth, no vendor lock-in
5. **Use Cloud First** - Public cloud first, justify on-premise
6. **Make Things Secure** - Cyber Essentials, NCSC guidance, threat modeling
7. **Make Privacy Integral** - UK GDPR, DPIA, privacy by design
8. **Share, Reuse and Collaborate** - Use GOV.UK services, Digital Marketplace
9. **Integrate and Adapt Technology** - API-first, modular, future-proof
10. **Make Better Use of Data** - Data strategy, analytics, open data
11. **Define Your Purchasing Strategy** - Digital Marketplace, commercial analysis
12. **Make Your Technology Sustainable** - Carbon impact, green hosting
13. **Meet the Service Standard** - Comply with all 14 Service Standard points

4. **Conduct comprehensive assessment**:

For **each of the 13 TCoP points**:

### Assessment Process

**A. Determine Compliance Status**:
- ✅ **COMPLIANT**: Fully meets the principle (score 8-10)
- ⚠️ **PARTIAL**: Partially meets the principle (score 5-7)
- ❌ **NON-COMPLIANT**: Does not meet the principle (score 0-4)

**B. Gather Evidence**:
Ask user for evidence or infer from existing documents:
- "Have you conducted user research?" (Point 1)
- "Is the code published on GitHub?" (Point 3)
- "Are you using AWS/Azure/GCP?" (Point 5)
- "Do you have Cyber Essentials certification?" (Point 6)
- "Have you completed a DPIA?" (Point 7)

**C. Map to Requirements**:
Link TCoP points to existing requirements:
- Point 2 (Accessibility) → NFR-A-xxx requirements
- Point 5 (Cloud First) → CLOUD-xxx principles
- Point 6 (Security) → NFR-S-xxx requirements
- Point 7 (Privacy) → NFR-P-xxx, GDPR requirements

**D. Score Each Point** (0-10):
- **10**: Exemplary - exceeds requirements
- **8-9**: Fully compliant - meets all requirements
- **6-7**: Good - meets most requirements with minor gaps
- **4-5**: Partial - meets some requirements, significant gaps
- **2-3**: Poor - few requirements met
- **0-1**: Non-compliant - does not meet principle

**E. Identify Gaps**:
For each non-compliant or partial point:
- What's missing?
- What's the risk?
- What needs to be done?
- Who should do it?
- When should it be done?

5. **Generate comprehensive TCoP assessment**:

Create a detailed assessment report with:

**Executive Summary**:
- Overall compliance score (X/130 points, Y%)
- Compliance status (Excellent/Good/Needs Improvement/Poor)
- Number of critical issues
- Top 3-5 recommendations

**Point-by-Point Assessment**:
For each of the 13 points:
- Compliance status (✅/⚠️/❌)
- Evidence gathered
- Score (0-10)
- Findings (what's implemented well)
- Gaps (what's missing)
- Requirements mapping
- Remediation actions (if needed)

**Overall Scorecard**:
Table showing all 13 points with scores and status

**Critical Issues**:
List of blocking issues that must be addressed

**Action Plan**:
Prioritized recommendations with owners and timelines

6. **Provide context-specific guidance**:

**If Discovery Phase**:
- Focus on Points 1 (User Needs), 11 (Purchasing Strategy)
- Validate user research has been conducted
- Ensure procurement strategy considers TCoP

**If Alpha Phase**:
- Focus on Points 1-5 (User Needs, Accessibility, Open Source, Standards, Cloud)
- Ensure prototypes meet accessibility standards
- Validate technology choices (open source, cloud first)

**If Beta Phase**:
- Assess all 13 points (comprehensive review)
- Ensure security accreditation in progress (Point 6)
- Validate Service Standard assessment (Point 13)

**If Live Phase**:
- All 13 points must be compliant
- Continuous improvement documented
- Ongoing monitoring and reporting

7. **Highlight UK Government-specific requirements**:

**Mandatory Services to Consider**:
- GOV.UK Pay (for payments)
- GOV.UK Notify (for emails/SMS)
- GOV.UK PaaS (for hosting - now deprecated, use cloud providers)
- GOV.UK Design System (for UI consistency)

**Mandatory Certifications**:
- Cyber Essentials (minimum)
- Cyber Essentials Plus (for high-risk systems)
- ISO 27001 (for sensitive data)

**Mandatory Assessments**:
- Service Standard assessment (3 phases: Alpha, Beta, Live)
- DPIA (for personal data)
- Security risk assessment

**Mandatory Compliance**:
- UK GDPR
- Accessibility Regulations 2018 (WCAG 2.2 AA)
- Public Sector Bodies Accessibility Regulations
- Data Protection Act 2018

8. **Write comprehensive output**:

Output location: `projects/{project-dir}/tcop-assessment.md`

Use the template structure from `uk-gov-tcop-template.md`

9. **Summarize and provide next steps**:

After generating the assessment:
- Summary of compliance level
- Top 3 critical issues
- Recommended next actions
- Timeline for remediation

## Example Usage

User: `/arckit.tcop Assess TCoP compliance for HMRC tax filing modernization project in Beta phase`

You should:
- Identify project: HMRC tax filing, Beta phase
- Read existing requirements and design documents
- Assess each of 13 TCoP points:
  - Point 1 (User Needs): ✅ COMPLIANT - extensive user research, 50+ user interviews
  - Point 2 (Accessibility): ✅ COMPLIANT - WCAG 2.2 AA, tested with JAWS/NVDA
  - Point 3 (Open Source): ⚠️ PARTIAL - code not yet published (planned for Live)
  - Point 4 (Open Standards): ✅ COMPLIANT - REST API with OpenAPI spec
  - Point 5 (Cloud First): ✅ COMPLIANT - AWS cloud-native architecture
  - Point 6 (Security): ⚠️ PARTIAL - Cyber Essentials obtained, penetration test pending
  - Point 7 (Privacy): ✅ COMPLIANT - DPIA completed, GDPR controls implemented
  - Point 8 (Share/Reuse): ⚠️ PARTIAL - using GOV.UK Notify, not using GOV.UK Pay
  - Point 9 (Integrate): ✅ COMPLIANT - API-first, microservices architecture
  - Point 10 (Data): ✅ COMPLIANT - data strategy, analytics dashboard
  - Point 11 (Purchasing): ✅ COMPLIANT - G-Cloud procurement, exit strategy defined
  - Point 12 (Sustainable): ⚠️ PARTIAL - carbon assessment not yet completed
  - Point 13 (Service Standard): ⚠️ PARTIAL - Beta assessment passed, some conditions remain
- Calculate score: 98/130 (75%) - Good, compliant with minor gaps
- Identify critical issues:
  - Code publication needed before Live (Point 3)
  - Penetration testing must be completed (Point 6)
  - Carbon assessment required (Point 12)
- Write detailed assessment to `projects/NNN-hmrc-tax-filing/tcop-assessment.md`
- Provide summary: "75% compliant, 3 issues to address before Live phase"

## Important Notes

- TCoP compliance is **mandatory** for all UK government technology projects
- Non-compliance can block project progression and funding
- Service Standard assessment is separate but related (Point 13)
- All 13 points must be addressed, even if some are "not applicable" (must justify)
- TCoP applies to central government, local authorities, NHS, and public bodies
- Regular reassessment recommended (quarterly during delivery, annually in Live)
- Senior Responsible Owner (SRO) must sign off on assessment
- Technology Code of Practice aligns with GDS Service Manual
- For sensitive systems (OFFICIAL-SENSITIVE, SECRET), additional accreditation required

## Related GDS Standards

- Service Standard (14 points)
- Service Manual
- GDS Design Principles
- Technology Service Principles
- Cloud First policy
- Open Standards for Government
- Greening Government ICT Strategy

## Resources

- Technology Code of Practice: https://www.gov.uk/guidance/the-technology-code-of-practice
- Service Standard: https://www.gov.uk/service-manual/service-standard
- Service Manual: https://www.gov.uk/service-manual
- GDS Design System: https://design-system.service.gov.uk/
- Digital Marketplace: https://www.digitalmarketplace.service.gov.uk/
