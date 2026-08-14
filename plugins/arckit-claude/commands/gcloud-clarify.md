---
description: Analyze G-Cloud service gaps and generate supplier clarification questions
doc-type: GCLC
argument-hint: "<service name, e.g. 'Salesforce CRM Lot 2'>"
effort: high
---

You are helping an enterprise architect validate G-Cloud services and generate clarification questions for suppliers.

## User Input

```text
$ARGUMENTS
```

## Context

After using `/arckit:gcloud-search` to find G-Cloud services, you have a shortlist but face challenges:

- Service descriptions may be vague or use marketing language
- Technical details may be missing or ambiguous
- Compliance claims may lack evidence
- Integration capabilities may be unclear

This command analyzes gaps between requirements and service descriptions, then generates structured clarification questions to send to suppliers.

## Instructions

> **Note**: The ArcKit Project Context hook has already detected all projects, artifacts, external documents, and global policies. Use that context below — no need to scan directories manually.

### 1. Read existing artifacts from the project context

**MANDATORY** (warn if missing):

- **REQ** (Requirements) — Extract: All MUST requirements (BR-xxx, FR-xxx, NFR-xxx, INT-xxx, DR-xxx), SHOULD requirements, compliance (NFR-C-xxx), integration (INT-xxx), performance (NFR-P-xxx), security (NFR-S-xxx)
  - If missing: ERROR "Run `/arckit:requirements` first — need source requirements"
- **GCLD** (G-Cloud Search, in procurement/) — Extract: Shortlisted services (top 3-5), service names, supplier names, service links, key features, Must-Have Match scores, Desirable Features scores, compliance mentions, pricing
  - If missing: ERROR "Run `/arckit:gcloud-search` first — need service search results"

**RECOMMENDED** (read if available, note if missing):

- **PRIN** (Architecture Principles, in 000-global) — Extract: Technology standards, compliance requirements, approved platforms for gap analysis context

**OPTIONAL** (read if available, skip silently if missing):

- **RSCH** (Research) — Extract: Market landscape, alternative services, technology recommendations

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

### 3b. Read the Template

**Read the template** (user override takes precedence):

- **First**, check `.arckit/templates-custom/gcloud-clarify-template.md`
- **Then**, `.arckit/templates/gcloud-clarify-template.md`
- **Fallback**, `${CLAUDE_PLUGIN_ROOT}/templates/gcloud-clarify-template.md`
- **Then read** `${CLAUDE_PLUGIN_ROOT}/templates/_partials/RENDERING.md` and resolve the `<!-- DOC-CONTROL-HEADER -->` marker in the template before writing. Do not hand-write the Document Control table: the partial `RENDERING.md` selects is the only source of the 14 standard fields and of the classification ladder.

The template owns the document structure and the per-question, per-service and risk-matrix block shapes. The steps below decide *what* goes in them; the template decides the shape.

### 4. Generate Clarification Questions

For each gap or ambiguity, generate a structured question:

**Question format**: use the template's `#### Q[N]:` block — requirement ID and text, the gap, the question with its sub-questions, the evidence needed, and a priority. Group questions under the template's Critical / High Priority / Medium Priority / Low Priority headings rather than numbering them in one flat run.

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

Fill the template's **Service Risk Assessment** block for each service. It ships the six requirement-category rows, the overall risk, the risk calculation and both the recommendation and the alternative — complete every row rather than adding a matrix of your own.

**Risk Levels**:

- 🔴 **CRITICAL**: 1+ MUST requirements not confirmed → DO NOT PROCEED
- 🟠 **HIGH**: 2+ MUST requirements ambiguous → CLARIFY FIRST
- 🔵 **MEDIUM**: 1 MUST ambiguous OR 3+ SHOULD missing → PROCEED WITH CAUTION
- 🟢 **LOW**: All MUST confirmed, few SHOULD missing → PROCEED TO DEMO

---

**CRITICAL - Auto-Populate Document Control Fields**:

Before completing the document, populate ALL document control fields in the header:

**Construct Document ID**:

- **Document ID**: `ARC-{PROJECT_ID}-GCLC-v{VERSION}` (e.g., `ARC-001-GCLC-v1.0`)

**Populate Required Fields**:

*Auto-populated fields* (populate these automatically):

- `[PROJECT_ID]` → Extract from project path (e.g., "001" from "projects/001-project-name")
- `[VERSION]` → "1.0" (or increment if previous version exists)
- `[DATE]` / `[YYYY-MM-DD]` → Current date in YYYY-MM-DD format
- `[DOCUMENT_TYPE_NAME]` → "G-Cloud Clarification Questions"
- `ARC-[PROJECT_ID]-GCLC-v[VERSION]` → Construct using format above
- `[COMMAND]` → "arckit.gcloud-clarify"

*User-provided fields* (extract from project metadata or user input):

- `[PROJECT_NAME]` → Full project name from project metadata or user input
- `[OWNER_NAME_AND_ROLE]` → Document owner (prompt user if not in metadata)
- **Classification** → comes from the resolved Document Control header, not from a placeholder. `_partials/RENDERING.md` fixes the ladder from the artefact's own regime; `${user_config.default_classification}` applies only where that regime falls through to user config.

*Calculated fields*:

- `[YYYY-MM-DD]` for Next Review Date → Current date + 30 days

*Pending fields* (leave as [PENDING] until manually updated):

- `[REVIEWER_NAME]` → [PENDING]
- `[APPROVER_NAME]` → [PENDING]
- `[DISTRIBUTION_LIST]` → Default to "Project Team, Architecture Team" or [PENDING]

**Populate Revision History**:

```markdown
| 1.0 | {DATE} | ArcKit AI | Initial creation from `/arckit:gcloud-clarify` command | [PENDING] | [PENDING] |
```

**Populate Generation Metadata Footer**:

The footer should be populated with:

```markdown
**Generated by**: ArcKit `/arckit:gcloud-clarify` command
**Generated on**: {DATE} {TIME} GMT
**ArcKit Version**: {ARCKIT_VERSION}
**Project**: {PROJECT_NAME} (Project {PROJECT_ID})
**AI Model**: [Use actual model name, e.g., "Claude Sonnet 5 (session default)"]
**Generation Context**: [Brief note about source documents used]
```

---

### 6. Write the Document

Populate the template read in Step 3b:

- **Executive Summary** — services analysed, total questions raised by priority, and the headline recommendation.
- **Service N** blocks — one per service, each with its Gap Summary, the four question priority groups, the Service Risk Assessment, and the Email Template for Supplier. The template ships two service blocks and says to repeat the structure; add as many as there are services.
- **Service Comparison - Risk Summary** — the cross-service view.
- **Next Steps** — immediate actions, what happens on receiving responses, and the decision point. Name owners and dates rather than leaving the week labels bare.
- **Gap Detection Reference** — the gap coverage status, ambiguous-claims detection, priority levels and risk levels used in this assessment, so a reader can audit the judgements.
- **Referenced Documents** and **External References** — every requirement artefact and supplier service page the assessment drew on. Follow the citation instructions in `${CLAUDE_PLUGIN_ROOT}/references/citation-instructions.md`: inline citation markers next to claims taken from a supplier's page, and each source registered in the External References tables.

**CRITICAL**: Use the **Write tool** to save the completed document to
`projects/[project]/procurement/ARC-{PROJECT_ID}-GCLC-v1.0.md`. Writing it inline
risks the 32K output-token limit; the Write tool also creates parent directories.

Before writing, read `${CLAUDE_PLUGIN_ROOT}/references/quality-checklist.md` and verify all **Common Checks** plus the **GCLC** per-type checks pass. Fix any failures before proceeding.

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

```text
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
5. Use /arckit:evaluate after receiving responses to score and compare

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

- **No ARC-*-REQ-*.md**: ERROR "Requirements not found - run /arckit:requirements first"
- **No gcloud-ARC-*-REQ-*.md**: ERROR "G-Cloud search results not found - run /arckit:gcloud-search first"
- **No services shortlisted**: ERROR "No services to clarify - gcloud-search found no results"
- **All MUST requirements confirmed**: INFO "All MUST requirements confirmed with evidence - minimal clarification needed. Proceed to /arckit:evaluate"

## Integration with Workflow

**Complete G-Cloud Procurement Workflow**:

1. `/arckit:requirements` → Define service needs
2. `/arckit:gcloud-search` → Find services on Digital Marketplace
3. **`/arckit:gcloud-clarify`** → Identify gaps, generate questions
4. *Supplier engagement* → Send questions, receive responses
5. `/arckit:evaluate` → Score suppliers based on responses
6. *Technical demo* → Validate critical requirements
7. *Contract award* → Select winning service

This command is the **critical validation step** between finding services and evaluating them.

## Important Notes

- **Markdown escaping**: When writing less-than or greater-than comparisons, always include a space after `<` or `>` (e.g., `< 3 seconds`, `> 99.9% uptime`) to prevent markdown renderers from interpreting them as HTML tags or emoji
