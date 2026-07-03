---
description: Design AI agent governance — oversight models, approval workflows, audit requirements, compliance mapping
argument-hint: "<agent or project ID, e.g. 'research-agent', '001'>"
effort: high
handoffs:
  - command: agent-security
    description: Align security controls with governance requirements
---

You are helping an enterprise architect design an AI agent governance framework that establishes oversight models, approval workflows, audit requirements, and compliance mappings for autonomous AI agent programs.

## User Input

```text
$ARGUMENTS
```

## Instructions

> **Note**: The ArcKit Project Context hook has already detected all projects, artifacts, external documents, and global policies. Use that context below — no need to scan directories manually.

1. **Identify the context**: The user should specify:
   - Project name/number or agent ID
   - Scope of governance (single agent, multi-agent system, or full program)
   - Applicable regulatory frameworks (if known)

2. **Read Available Documents**:

   **MANDATORY** (warn if missing):
   - **AAGI** (Agent Inventory) — Extract: Agent list, capabilities, risk levels
     - If missing: warn user to run `/arckit:agent-inventory` first
   - **AAGR** (Agent Design) — Extract: Design patterns, decision-making autonomy, integration points
     - If missing: warn user to run `/arckit:agent-design` first

   **RECOMMENDED** (read if available, note if missing):
   - **PRIN** (Architecture Principles) — Extract: Governance principles, human oversight requirements
     - If missing: warn user to run `/arckit:principles` first
   - **BORD** (Board Review) — Extract: Board-approved policies, risk appetite, compliance mandates
     - If missing: note that board context is limited

   **Read the template** (with user override support):
   - **First**, check if `.arckit/templates-custom/agent-governance-template.md` exists in the project root
   - **If found**: Read the user's customized template (user override takes precedence)
   - **If not found**: Read `${CLAUDE_PLUGIN_ROOT}/templates/agent-governance-template.md` (default)

   > **Tip**: Users can customize templates with `/arckit:customize agent-governance`

3. **Read external documents and policies**:
   - Read any **regulatory requirements** in `projects/000-global/external/` — extract compliance frameworks, governance standards, audit mandates
   - Read any **existing governance policies** in `projects/{project-dir}/governance/` — extract current oversight models, approval hierarchies
   - If no governance context found, ask: "Please provide governance requirements or confirm this is a new governance framework. I can work with minimal context to generate a baseline framework."

4. **Read agent inventory and design**:
   - From AAGI: Extract all agents, their risk classifications, capabilities, and operational domains
   - From AAGR: Extract decision-making patterns, autonomy levels, and integration architectures
   - If AAGI/AAGR not available: ask user for agent details and risk assessments

5. **Generate governance framework**:

   ### A. Oversight Model Design

   Define oversight tiers based on risk assessment:
   - **Tier 1 (Human-in-the-loop)**: For critical decisions affecting safety, compliance, or significant business impact
   - **Tier 2 (Human-on-the-loop)**: For routine operations with continuous monitoring and intervention capability
   - **Tier 3 (Human-out-of-the-loop)**: For fully automated, auditable tasks with post-facto review

   For each agent, assign oversight tier based on:
   - Risk classification (Critical, High, Medium, Low)
   - Decision domain (safety, financial, operational, informational)
   - Regulatory requirements (specific mandates for human oversight)
   - Historical performance and reliability data

   ### B. Approval Matrix

   Design approval workflows by risk tier:
   - **Critical**: Named person + Board approval, formal sign-off, documented rationale
   - **High**: Team lead approval with director oversight, time-bound SLAs
   - **Medium**: System-level automated approval with human monitoring
   - **Low**: Fully automated with anomaly detection and escalation triggers

   Define SLAs, escalation paths, and delegation authorities for each tier.

   ### C. Audit Requirements

   Establish audit program with three layers:
   - **Full audit** (Quarterly): Comprehensive review of all agent actions, decisions, and outcomes
   - **Spot check** (Weekly): Random sample of outputs for quality assurance
   - **Security audit** (Monthly): Focused review of security-relevant actions and access patterns

   Define scope, retention periods, and reporting requirements for each audit type.

   ### D. Monitoring KPIs

   Define measurable indicators for governance effectiveness:
   - **Approval rate**: Percentage of automated decisions approved without modification
   - **Escalation rate**: Percentage of decisions requiring human escalation
   - **Mean time to audit**: Average time from action to audit completion
   - **Compliance score**: Percentage of regulatory requirements met
   - **Oversight response time**: Average time for human oversight to respond to escalations

   ### E. Escalation Procedures

   Design escalation workflow:
   - Low-risk anomaly: Log, continue operation, schedule review
   - Medium-risk: Notify human monitor, increased logging, short-term watch
   - High-risk: Halt operations, escalate to incident response, notify stakeholders
   - Critical: Immediate halt, emergency procedures, regulatory notification

   ### F. Incident Response Plan

   Define incident response lifecycle:
   - Detection: Automated monitoring triggers and thresholds
   - Containment: Isolation procedures and scope limitation
   - Assessment: Impact analysis and root cause identification
   - Resolution: Fix deployment and verification
   - Post-mortem: Root cause analysis, preventive measures, timeline

   ### G. Compliance Mapping

   Map governance framework to applicable regulatory frameworks:
   - **UK AI Playbook**: Risk-based approach, human oversight, transparency
   - **EU AI Act**: Risk categories, conformity assessment, post-market monitoring
   - **NIST AI RMF**: Govern, Map, Measure, Manage functions with specific controls

   For each framework, identify specific requirements, compliance status, and evidence sources.

6. **Risk Assessment**:

   Identify governance risks:
   - **HIGH**: No human oversight for critical decisions, missing audit trails, regulatory non-compliance
   - **MEDIUM**: Inadequate escalation procedures, insufficient monitoring coverage, audit gaps
   - **LOW**: Documentation inconsistencies, minor process gaps, reporting delays

7. **Generate Governance Document**:

   Create comprehensive governance framework with:
   - Executive summary of oversight model and compliance status
   - Detailed oversight assignments and justification
   - Approval matrix with SLAs and escalation paths
   - Audit program with schedules and retention policies
   - Monitoring KPIs with targets and current baselines
   - Escalation procedures with decision trees
   - Incident response plan with timelines
   - Compliance mapping with evidence
   - Traceability links to upstream documents

---

**CRITICAL - Auto-Populate Document Control Fields**:

Before completing the document, populate ALL document control fields in the header:

**Construct Document ID**:

- **Document ID**: `ARC-{PROJECT_ID}-AAOV-v{VERSION}` (e.g., `ARC-001-AAOV-v1.0`)

**Populate Required Fields**:

*Auto-populated fields* (populate these automatically):

- `[PROJECT_ID]` → Extract from project path (e.g., "001" from "projects/001-project-name")
- `[VERSION]` → "1.0" (or increment if previous version exists)
- `[DATE]` / `[YYYY-MM-DD]` → Current date in YYYY-MM-DD format
- `[DOCUMENT_TYPE_NAME]` → "Agent Governance Framework"
- `ARC-[PROJECT_ID]-AAOV-v[VERSION]` → Construct using format above
- `[COMMAND]` → "arckit.agent-governance"

*User-provided fields* (extract from project metadata or user input):

- `[PROJECT_NAME]` → Full project name from project metadata or user input
- `[OWNER_NAME_AND_ROLE]` → Document owner (prompt user if not in metadata)
- `[CLASSIFICATION]` → Default to `${user_config.default_classification}`; if unavailable, use "OFFICIAL" for UK Gov, "PUBLIC" otherwise (or prompt user)

*Calculated fields*:

- `[YYYY-MM-DD]` for Next Review → Current date + 90 days (quarterly review cycle)

*Pending fields* (leave as [PENDING] until manually updated):

- `[REVIEWER_NAME]` → [PENDING]
- `[APPROVER_NAME]` → [PENDING]
- `[DISTRIBUTION_LIST]` → Default to "Agent Governance Board, Compliance Team, Architecture Team" or [PENDING]

**Populate Revision History**:

```markdown
| 1.0 | {DATE} | ArcKit AI | Initial creation from `/arckit:agent-governance` command | [PENDING] | [PENDING] |
```

**Populate Generation Metadata Footer**:

The footer should be populated with:

```markdown
**Generated by**: ArcKit `/arckit:agent-governance` command
**Generated on**: {DATE} {TIME} GMT
**ArcKit Version**: {ARCKIT_VERSION}
**Project**: {PROJECT_NAME} (Project {PROJECT_ID})
**AI Model**: [Use actual model name, e.g., "Claude Sonnet 5 (session default)"]
**Generation Context**: [Brief note about source documents used]
```

---

Before writing the file, read `${CLAUDE_PLUGIN_ROOT}/references/quality-checklist.md` and verify all **Common Checks** plus the **AAOV** per-type checks pass. Fix any failures before proceeding.

8. **Quality Checks**:

   Verify the governance framework meets minimum standards:
   - ≥3 oversight tiers defined with clear criteria
   - Approval matrix covers ≥3 risk tiers with specific approvers
   - Audit requirements define frequency, scope, and retention
   - ≥3 monitoring KPIs with measurable targets
   - Escalation procedures cover low, medium, and high risk scenarios
   - Incident response plan includes all phases (detection through post-mortem)
   - Compliance mapping covers ≥2 regulatory frameworks
   - Traceability links established to AAGI and AAGR documents

9. **Write output**:
   - `projects/{project-dir}/ARC-{PROJECT_ID}-AAOV-v1.0.md` - Full governance framework
   - Update traceability matrix with governance references

   **CRITICAL - Show Summary Only**:
   After writing the file, show ONLY a brief summary with key governance metrics (oversight tiers assigned, compliance status, pending approvals). Do NOT output the full governance document content in your response.

## Example Usage

User: `/arckit:agent-governance research-agent`

You should:

- Read AAGI (agent inventory) for research-agent project
- Read AAGR (agent design) for design patterns and autonomy levels
- Generate oversight model:
  - ✅ Tier 1 assigned to AGT-001 (Critical - financial decisions require human approval)
  - ✅ Tier 2 assigned to AGT-002 (High - operational decisions with monitoring)
  - ✅ Tier 3 assigned to AGT-003 (Medium - automated data processing)
- Generate approval matrix with 4 risk tiers and specific approvers
- Define audit program: quarterly full audits, weekly spot checks, monthly security audits
- Establish KPIs: approval rate >95%, escalation rate <5%, audit completion <24h
- Map to UK AI Playbook (Req IDs), EU AI Act (Annex requirements), NIST AI RMF (Functions)
- **Status**: GOVERNANCE FRAMEWORK ESTABLISHED
- **Key findings**:
  - ✅ 3 oversight tiers defined with agent assignments
  - ✅ Approval matrix covers all risk levels
  - ✅ Compliance mapping to 3 frameworks (2 with partial compliance)
- Write to `projects/001-research-agent/ARC-001-AAOV-v1.0.md`

## Important Notes

- Governance is a LIVING framework — review and update quarterly or after significant agent changes
- Be thorough on regulatory compliance (gaps are BLOCKING for deployment)
- All oversight decisions must reference specific agent capabilities and risk assessments
- Human oversight requirements increase with agent autonomy and decision impact
- Audit trails must be immutable and cryptographically verifiable
- Compliance evidence must be traceable to specific governance controls
- Escalation procedures must be tested regularly (drill schedule recommended)
- Governance framework feeds into agent security requirements — handoff to `/arckit:agent-security` after completion
- **Markdown escaping**: When writing less-than or greater-than comparisons, always include a space after `<` or `>` (e.g., `< 5% escalation rate`, `> 95% approval`) to prevent markdown renderers from interpreting them as HTML tags or emoji
