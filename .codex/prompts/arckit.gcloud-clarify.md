---
description: Analyze G-Cloud service gaps and generate supplier clarification questions
---

You are helping an enterprise architect validate G-Cloud services and generate clarification questions for suppliers.

## User Input

```text
$ARGUMENTS
```

## Context

After using `/arckit.gcloud-search` to find G-Cloud services, you have a shortlist but face challenges:
- Service descriptions may be vague or use marketing language
- Technical details may be missing or ambiguous
- Compliance claims may lack evidence
- Integration capabilities may be unclear

This command analyzes gaps between requirements and service descriptions, then generates structured clarification questions to send to suppliers.

## Instructions

### 1. Read Available Documents

Scan the project directory for existing artifacts and read them to inform this analysis:

**MANDATORY** (warn if missing):
- `ARC-*-REQ-*.md` in `projects/{project}/` — Requirements specification
  - Extract: All MUST requirements (BR-xxx, FR-xxx, NFR-xxx, INT-xxx, DR-xxx), SHOULD requirements, compliance (NFR-C-xxx), integration (INT-xxx), performance (NFR-P-xxx), security (NFR-S-xxx)
  - If missing: ERROR "Run `/arckit.requirements` first — need source requirements"
- `ARC-*-GCLD-*.md` in `projects/{project}/procurement/` — G-Cloud search results
  - Extract: Shortlisted services (top 3-5), service names, supplier names, service links, key features, Must-Have Match scores, Desirable Features scores, compliance mentions, pricing
  - If missing: ERROR "Run `/arckit.gcloud-search` first — need service search results"

**RECOMMENDED** (read if available, note if missing):
- `ARC-000-PRIN-*.md` in `projects/000-global/` — Architecture principles
  - Extract: Technology standards, compliance requirements, approved platforms for gap analysis context

**OPTIONAL** (read if available, skip silently if missing):
- `ARC-*-RSCH-*.md` in `projects/{project}/` — Technology research
  - Extract: Market landscape, alternative services, technology recommendations

**What to extract from each document**:
- **Requirements**: MUST/SHOULD requirements with IDs for systematic gap analysis
- **G-Cloud Search**: Shortlisted services with features and scores for clarification targeting
- **Principles**: Technology constraints and compliance standards for gap context

### 3. Gap Analysis

For **each shortlisted service**, perform systematic gap analysis:

#### A. MUST Requirements Analysis

For each MUST requirement (BR-xxx, FR-xxx, NFR-xxx, INT-xxx with MUST priority):

**Check Coverage**:
- ✅ **CONFIRMED**: Service description explicitly mentions this capability with specifics
- ⚠️ **AMBIGUOUS**: Service mentions related capability but vaguely (needs clarification)
- ❌ **NOT MENTIONED**: Service does not mention this requirement at all

**Examples**:
- Requirement: "MUST export metrics in Prometheus format"
  - ✅ CONFIRMED: "Supports Prometheus 2.x metric export via /metrics endpoint"
  - ⚠️ AMBIGUOUS: "Industry-standard monitoring integrations" (which standards?)
  - ❌ NOT MENTIONED: No mention of Prometheus or metrics export

#### B. Ambiguous Claims Detection

Identify vague marketing language that needs clarification:
- "Industry-standard" → Which specific standards?
- "High availability" → What specific SLA percentage?
- "Scalable" → To what capacity? What are the limits?
- "Secure" → Which security certifications?
- "Fast" → What specific performance metrics?
- "Compatible with" → Which versions? What level of compatibility?
- "Enterprise-grade" → What does this mean specifically?
- "Comprehensive" → What is included? What is excluded?

#### C. Compliance Gaps

For compliance requirements (NFR-C-xxx):
- Are required certifications explicitly mentioned? (ISO 27001, Cyber Essentials Plus, etc.)
- Are certification numbers provided?
- Are expiry dates mentioned?
- Is data residency specified? (UK data centers)
- Is GDPR compliance confirmed?

#### D. Integration Gaps

For integration requirements (INT-xxx):
- Is integration method specified? (API, webhook, agent, etc.)
- Are API versions specified?
- Is integration architecture documented?
- Are code examples or SDKs available?

#### E. Performance Gaps

For performance requirements (NFR-P-xxx):
- Are specific SLAs mentioned? (uptime %, response time, throughput)
- Are capacity limits specified?
- Are performance benchmarks provided?

#### F. Pricing Gaps

- Is pricing model clear? (per user, per GB, per transaction)
- Are there hidden costs? (setup fees, support costs, overage charges)
- Are scaling costs predictable?

### 4. Generate Clarification Questions

For each gap or ambiguity, generate a structured question:

**Question Format**:
```markdown
#### Q[N]: [Clear, specific question title]
**Requirement**: [REQ-ID] (MUST/SHOULD) - [requirement text]

**Gap**: [Describe what is missing, ambiguous, or unclear]

**Question**:
> [Specific question to supplier]
> - [Sub-question or specific aspect]
> - [Sub-question or specific aspect]
> - [Sub-question or specific aspect]

**Evidence Needed**:
- [Specific document or proof required]
- [Additional evidence needed]

**Priority**: [🔴 CRITICAL / 🟠 HIGH / 🔵 MEDIUM / 🟢 LOW]
```

#### Question Priority Levels

**🔴 CRITICAL** (Blocking):
- MUST requirement not confirmed at all (❌ NOT MENTIONED)
- Compliance requirement without evidence
- Blocker for procurement

**🟠 HIGH** (Affects Scoring):
- MUST requirement mentioned ambiguously (⚠️ AMBIGUOUS)
- Integration requirement unclear
- SLA not specified
- Certification mentioned but not confirmed

**🔵 MEDIUM** (Due Diligence):
- SHOULD requirement not mentioned
- Pricing details incomplete
- Data residency not confirmed
- Support terms unclear

**🟢 LOW** (Nice to Know):
- Nice-to-have features
- Future roadmap questions
- General support questions

### 5. Generate Risk Assessment

Create risk matrix for each service:

```markdown
## 📊 Service Risk Assessment

| Aspect | Status | Risk | Notes |
|--------|--------|------|-------|
| **[Requirement Category]** | [✅/⚠️/❌] | [🔴/🟠/🔵/🟢] | [Brief note] |
| ... | ... | ... | ... |

**Overall Risk**: [🔴 CRITICAL / 🟠 HIGH / 🔵 MEDIUM / 🟢 LOW]

**Risk Calculation**:
- ❌ [N] MUST requirements NOT confirmed
- ⚠️ [N] MUST requirements AMBIGUOUS
- 🔵 [N] SHOULD requirements missing

**Recommendation**:
- [Clear action: DO NOT PROCEED / CLARIFY FIRST / PROCEED WITH CAUTION / PROCEED TO DEMO]
```

**Risk Levels**:
- 🔴 **CRITICAL**: 1+ MUST requirements not confirmed → DO NOT PROCEED
- 🟠 **HIGH**: 2+ MUST requirements ambiguous → CLARIFY FIRST
- 🔵 **MEDIUM**: 1 MUST ambiguous OR 3+ SHOULD missing → PROCEED WITH CAUTION
- 🟢 **LOW**: All MUST confirmed, few SHOULD missing → PROCEED TO DEMO


---

**CRITICAL - Auto-Populate Document Control Fields**:

Before completing the document, populate ALL document control fields in the header:

**Generate Document ID**:
```bash
# Use the ArcKit document ID generation script
DOC_ID=$(.arckit/scripts/bash/generate-document-id.sh "${PROJECT_ID}" "GCLC" "${VERSION}")
# Example output: ARC-001-GCLC-v1.0
```

**Populate Required Fields**:

*Auto-populated fields* (populate these automatically):
- `[PROJECT_ID]` → Extract from project path (e.g., "001" from "projects/001-project-name")
- `[VERSION]` → "1.0" (or increment if previous version exists)
- `[DATE]` / `[YYYY-MM-DD]` → Current date in YYYY-MM-DD format
- `[DOCUMENT_TYPE_NAME]` → "G-Cloud Clarification Questions"
- `ARC-[PROJECT_ID]-GCLC-v[VERSION]` → Use generated DOC_ID
- `[COMMAND]` → "arckit.gcloud-clarify"

*User-provided fields* (extract from project metadata or user input):
- `[PROJECT_NAME]` → Full project name from project metadata or user input
- `[OWNER_NAME_AND_ROLE]` → Document owner (prompt user if not in metadata)
- `[CLASSIFICATION]` → Default to "OFFICIAL" for UK Gov, "PUBLIC" otherwise (or prompt user)

*Calculated fields*:
- `[YYYY-MM-DD]` for Review Date → Current date + 30 days

*Pending fields* (leave as [PENDING] until manually updated):
- `[REVIEWER_NAME]` → [PENDING]
- `[APPROVER_NAME]` → [PENDING]
- `[DISTRIBUTION_LIST]` → Default to "Project Team, Architecture Team" or [PENDING]

**Populate Revision History**:

```markdown
| 1.0 | {DATE} | ArcKit AI | Initial creation from `/arckit.gcloud-clarify` command | [PENDING] | [PENDING] |
```

**Populate Generation Metadata Footer**:

The footer should be populated with:
```markdown
**Generated by**: ArcKit `/arckit.gcloud-clarify` command
**Generated on**: {DATE} {TIME} GMT
**ArcKit Version**: [Read from VERSION file]
**Project**: {PROJECT_NAME} (Project {PROJECT_ID})
**AI Model**: [Use actual model name, e.g., "claude-sonnet-4-5-20250929"]
**Generation Context**: [Brief note about source documents used]
```

---

### 6. Generate Output Document

Create `projects/[project]/procurement/ARC-{PROJECT_ID}-GCLC-v1.0.md`:

```markdown
# G-Cloud Service Clarification Questions

**Project**: [PROJECT_NAME]
**Date**: [DATE]
**Services Analyzed**: [N]

---

## Executive Summary

**Purpose**: Validate G-Cloud services against requirements before procurement decision.

**Status**:
- Services Analyzed: [N]
- Critical Gaps Found: [N]
- High Priority Gaps: [N]
- Medium Priority Gaps: [N]

**Action Required**: [Send clarification questions to [N] suppliers / Eliminate [N] services due to critical gaps / Proceed with [Service Name]]

---

## Service 1: [Service Name] by [Supplier Name]

**Link**: [Service URL]

### 📋 Gap Summary

- ✅ **[N]** MUST requirements confirmed with evidence
- ⚠️ **[N]** MUST requirements mentioned ambiguously
- ❌ **[N]** MUST requirements NOT mentioned
- 🔵 **[N]** SHOULD requirements missing

**Overall Risk**: [🔴/🟠/🔵/🟢] [Risk Level]

---

### 🚨 Critical Questions (MUST address before proceeding)

[Generate Q1, Q2, Q3... for each critical gap using format above]

---

### ⚠️ High Priority Questions (Affects evaluation scoring)

[Generate Q[N]... for each high priority gap]

---

### 🔵 Medium Priority Questions (Due diligence)

[Generate Q[N]... for each medium priority gap]

---

### 🟢 Low Priority Questions (Nice to know)

[Generate Q[N]... for each low priority question]

---

### 📊 Service Risk Assessment

[Generate risk matrix table as defined above]

**Recommendation**:
[Clear recommendation based on risk level]

**Alternative**: [Suggest alternative service if this one has critical gaps]

---

### 📧 Email Template for Supplier

Subject: Technical Clarification Required - [Service Name]

Dear [Supplier Name] Team,

We are evaluating [Service Name] (Service ID: [ID]) for procurement via the Digital Marketplace. Before proceeding, we need clarification on several technical requirements:

**Critical Requirements (Blocking)**:
[List Q-numbers for critical questions]

**High Priority Requirements**:
[List Q-numbers for high priority questions]

Could you please provide:
- Written responses to questions [Q1-QN]
- Supporting documentation ([list evidence needed])
- Access to demo/trial environment for technical validation

We aim to make a procurement decision by [DATE + 2 weeks]. Please respond by [DATE + 1 week].

Thank you,
[User name if provided, otherwise: Your Name]
[Organization name if available]

---

[REPEAT FOR EACH SERVICE: Service 2, Service 3, etc.]

---

## 📊 Service Comparison - Risk Summary

| Service | Supplier | Critical Gaps | High Gaps | Medium Gaps | Overall Risk | Action |
|---------|----------|---------------|-----------|-------------|--------------|--------|
| [Service 1] | [Supplier 1] | [N] | [N] | [N] | [🔴/🟠/🔵/🟢] | [Action] |
| [Service 2] | [Supplier 2] | [N] | [N] | [N] | [🔴/🟠/🔵/🟢] | [Action] |
| [Service 3] | [Supplier 3] | [N] | [N] | [N] | [🔴/🟠/🔵/🟢] | [Action] |

**Recommended Priority Order**:
1. **[Service Name]** - [Risk Level] - [Action]
2. **[Service Name]** - [Risk Level] - [Action]
3. **[Service Name]** - [Risk Level] - [Action]

---

## 📋 Next Steps

### Immediate Actions (This Week)

1. ✅ **Send clarification questions**:
   - [ ] Email sent to [Supplier 1]
   - [ ] Email sent to [Supplier 2]
   - [ ] Email sent to [Supplier 3]

2. ✅ **Set response deadline**: [DATE + 1 week]

3. ✅ **Schedule follow-up**: [DATE + 1 week] to review responses

### Upon Receiving Responses (Week 2)

4. ✅ **Review supplier responses**:
   - [ ] Check all critical questions answered
   - [ ] Validate evidence provided
   - [ ] Update risk assessment

5. ✅ **Schedule technical demos**:
   - [ ] Demo with [top-ranked service]
   - [ ] Demo with [second-ranked service]

6. ✅ **Validate critical requirements**:
   - [ ] Test integration in demo environment
   - [ ] Confirm performance metrics
   - [ ] Verify compliance certificates

### Decision Point (Week 3)

7. ✅ **Final evaluation**:
   - [ ] Use `/arckit.evaluate` to score suppliers
   - [ ] Compare responses and demos
   - [ ] Select winning service

8. ✅ **Contract award**:
   - [ ] Award via Digital Marketplace
   - [ ] Publish on Contracts Finder

**Parallel Activity**: While waiting for responses, prepare evaluation criteria with `/arckit.evaluate`.

---

## 📎 Referenced Documents

- **Requirements**: projects/[project]/ARC-*-REQ-*.md
- **G-Cloud Search**: projects/[project]/procurement/gcloud-ARC-*-REQ-*.md
- **Service Pages**: [list all service URLs]

---

**Generated**: [DATE]
**Tool**: /arckit.gcloud-clarify
**Next Command**: `/arckit.evaluate` (after supplier responses received)
```

### 7. Quality Validation

Before finalizing, validate output:

- ✅ All MUST requirements analyzed
- ✅ Each gap has a corresponding question
- ✅ Questions are specific and actionable
- ✅ Evidence requirements are clear
- ✅ Priority levels are appropriate
- ✅ Risk assessment is accurate
- ✅ Email templates are complete
- ✅ Next steps are actionable

### 8. Report Completion

Output to user:

```
✅ Generated G-Cloud clarification questions for [PROJECT_NAME]

Services Analyzed: [N]
Document: projects/[project]/procurement/ARC-{PROJECT_ID}-GCLC-v1.0.md

Gap Analysis Summary:
- [Service 1]: [Risk Level] - [N] critical gaps, [N] high gaps
- [Service 2]: [Risk Level] - [N] critical gaps, [N] high gaps
- [Service 3]: [Risk Level] - [N] critical gaps, [N] high gaps

Recommendations:
- 🔴 [N] services have CRITICAL gaps (do not proceed without clarification)
- 🟠 [N] services have HIGH gaps (clarify before proceeding)
- 🟢 [N] services are LOW risk (proceed to technical demo)

Next Steps:
1. Review generated questions in ARC-{PROJECT_ID}-GCLC-v1.0.md
2. Send email to suppliers using provided templates
3. Set response deadline: [DATE + 1 week]
4. Schedule follow-up to review responses
5. Use /arckit.evaluate after receiving responses to score and compare

Important: Do not award contracts to services with CRITICAL gaps until gaps are resolved.
```

## Key Principles

1. **Systematic Analysis**: Check every MUST requirement against every service
2. **Clear Prioritization**: Critical gaps block procurement, high gaps affect scoring
3. **Specific Questions**: Every question links to a specific requirement ID
4. **Evidence-Based**: Specify what proof is needed to satisfy requirements
5. **Actionable Output**: Email templates and next steps make it easy to act
6. **Risk-Driven**: Risk assessment guides procurement decisions
7. **Traceability**: Link questions back to requirements for audit trail

## Gap Detection Examples

**Example 1: Explicit Gap**
- Requirement: FR-003 (MUST) - "Export metrics in Prometheus format"
- Service: "Industry-standard monitoring integrations"
- Gap: ❌ NOT MENTIONED - Prometheus not mentioned at all
- Priority: 🔴 CRITICAL
- Question: "Does the service support Prometheus metric export? If yes, which Prometheus versions and what is the export format?"

**Example 2: Ambiguous Gap**
- Requirement: NFR-P-001 (MUST) - "99.9% uptime SLA"
- Service: "High availability architecture"
- Gap: ⚠️ AMBIGUOUS - "High availability" is vague, no specific SLA
- Priority: 🟠 HIGH
- Question: "What is the specific uptime SLA? Is it 99.9% or higher? What are the SLA credits if uptime falls below target?"

**Example 3: Compliance Gap**
- Requirement: NFR-C-002 (MUST) - "ISO 27001 certified"
- Service: "ISO certified, secure by design"
- Gap: ⚠️ AMBIGUOUS - ISO mentioned but which standard? Certificate number?
- Priority: 🟠 HIGH
- Question: "Please confirm ISO 27001 certification with certificate number, expiry date, and scope of certification."

## Error Handling

- **No ARC-*-REQ-*.md**: ERROR "Requirements not found - run /arckit.requirements first"
- **No gcloud-ARC-*-REQ-*.md**: ERROR "G-Cloud search results not found - run /arckit.gcloud-search first"
- **No services shortlisted**: ERROR "No services to clarify - gcloud-search found no results"
- **All MUST requirements confirmed**: INFO "All MUST requirements confirmed with evidence - minimal clarification needed. Proceed to /arckit.evaluate"

## Integration with Workflow

**Complete G-Cloud Procurement Workflow**:
1. `/arckit.requirements` → Define service needs
2. `/arckit.gcloud-search` → Find services on Digital Marketplace
3. **`/arckit.gcloud-clarify`** → Identify gaps, generate questions
4. *Supplier engagement* → Send questions, receive responses
5. `/arckit.evaluate` → Score suppliers based on responses
6. *Technical demo* → Validate critical requirements
7. *Contract award* → Select winning service

This command is the **critical validation step** between finding services and evaluating them.
