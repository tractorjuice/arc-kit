---
description: Design AI agent security — sandboxing, permissions, injection defences, output validation
argument-hint: "<agent or project ID, e.g. 'research-agent', '001'>"
effort: high
handoffs:
  - command: agent-governance
    description: Align security controls with governance requirements
---

You are helping an enterprise architect design an AI agent security architecture that establishes sandboxing, permissions, injection defences, and output validation for autonomous AI agent systems.

## User Input

```text
$ARGUMENTS
```

## Instructions

> **Note**: The ArcKit Project Context hook has already detected all projects, artifacts, external documents, and global policies. Use that context below — no need to scan directories manually.

### 1. Identify the context

The user should specify:

- Project name/number or agent ID
- Scope of security assessment (single agent, multi-agent system, or full program)
- Applicable security frameworks (if known)

### 2. Read existing artifacts from the project context

**MANDATORY** (warn if missing):

- **AAGI** (Agent Inventory) — Extract: Agent list, capabilities, risk levels
  - If missing: warn user to run `/arckit:agent-inventory` first
- **AAGR** (Agent Design) — Extract: Design patterns, tool contracts, integration points
  - If missing: warn user to run `/arckit:agent-design` first

**RECOMMENDED** (read if available, note if missing):

- **SEC** or **SBD** (Secure by Design) — Extract: Existing security controls, threat models, security standards
  - If missing: warn user to run `/arckit:secure` or `/arckit:mod-secure` first
- **RISK** (Risk Register) — Extract: AI-specific risks, tool security risks, data handling risks
  - If missing: note that risk context is limited
- **PRIN** (Architecture Principles) — Extract: Security principles, technology constraints

**OPTIONAL** (read if available, skip silently if missing):

- **AAOV** (Agent Governance) — Extract: Oversight tiers, compliance requirements
- **DPIA** (Data Protection Impact Assessment) — Extract: Personal data processing, lawful basis
- **AIPB** (AI Playbook) — Extract: AI ethics, model governance, bias considerations

### 3. Read the template

**Read the template** (with user override support):

- **First**, check if `.arckit/templates-custom/agent-security-template.md` exists in the project root
- **If found**: Read the user's customized template (user override takes precedence)
- **If not found**: Read `${CLAUDE_PLUGIN_ROOT}/templates/agent-security-template.md` (default)

> **Tip**: Users can customize templates with `/arckit:customize agent-security`

### 4. Read agent designs and security context

- From AAGI: Extract all agents, their risk classifications, capabilities, and operational domains
- From AAGR: Extract tool contracts, memory architectures, guardrail configurations, and integration points
- From SEC/SBD: Extract existing security controls, threat models, and compliance requirements
- If AAGI/AAGR not available: ask user for agent details and risk assessments

### 5. Generate security architecture

#### A. Threat Model (Mermaid mindmap with ≥12 threat categories)

Map threats across four attack surface dimensions:

- **Input layer**: Prompt injection, data poisoning, context overflow, adversarial inputs, model probing, supply chain attacks
- **Execution layer**: Tool abuse, privilege escalation, sandboxing escape, resource exhaustion, tool chain manipulation, cross-agent injection
- **Output layer**: Data exfiltration, PII leakage, hallucination, prompt template extraction, instruction leakage, model weights extraction
- **Infrastructure layer**: Model theft, API abuse, side-channel attacks, denial of service, credential theft, infrastructure manipulation

#### B. Sandboxing Architecture

Define isolation boundaries:

- **Agent process isolation**: Container/sandbox boundaries, OS-level enforcement
- **Tool execution isolation**: Separate processes, permission boundaries
- **Memory isolation**: Scoped access, RBAC, cross-session boundaries
- **Network isolation**: API call boundaries, egress controls
- **Data isolation**: Input/output separation, context sandboxing

#### C. Tool Permission Matrix (≥5 tools)

For each tool in the agent design:

- **Tool ID and name** from AAGR tool contracts
- **Permission level**: Read / Write / Execute
- **Access scope**: Full / Limited / None
- **Risk classification**: Low / Medium / High
- **Mitigation**: Specific control for each high-risk tool

#### D. Data Handling Policy

Define handling per data classification:

- **PII**: Encryption at rest, masking in prompts, retention limits
- **Sensitive**: Encrypted storage, scoped access, audit logging
- **Public**: Standard handling, unrestricted access
- **Model weights**: Restricted access, integrity verification

#### E. Prompt Injection Defences (≥4 defences)

| Defence | Method | Coverage |
|---------|--------|----------|
| Input sanitization | Regex, LLM guard, allowlist filtering | Direct prompts |
| Context boundary | System prompt separation, delimiter enforcement | Indirect injection |
| Output validation | Schema check, content filter, format enforcement | Response |
| Tool call validation | Permission check, argument validation, rate limiting | Tool abuse |

#### F. Output Validation Pipeline (Mermaid flowchart)

Design pipeline stages:

- **Schema validation**: Format and structure checks
- **Content filtering**: Safety and policy enforcement
- **PII scanning**: Automated detection and redaction
- **Human review gate**: Flagged content routing
- **Release**: Approved output delivery

#### G. Secret Management

Define secret lifecycle:

- **API keys**: Vault storage, scoped access, 90-day rotation
- **Model credentials**: Secrets manager, scoped access, 90-day rotation
- **Database credentials**: Vault storage, scoped access, 30-day rotation
- **Encryption keys**: HSM or KMS, automated rotation, 30-day cycle

#### H. Incident Response

Define severity-based response:

- **Critical** (<15 min): SRE owner — isolate, investigate, patch
- **High** (<1h): Security owner — contain, assess, remediate
- **Medium** (<24h): Team owner — patch, monitor
- **Low** (<72h): Team owner — log, review, improve

### 6. Risk Assessment

Identify security risks:

- **HIGH**: No sandboxing, unrestricted tool access, missing input sanitization, no output validation, unencrypted secrets
- **MEDIUM**: Partial isolation, limited injection defences, weak secret rotation, incomplete audit logging
- **LOW**: Documentation gaps, missing monitoring alerts, incomplete compliance mapping

### 7. Generate Security Document

**CRITICAL INSTRUCTIONS FOR QUALITY**:

1. **This is a LARGE document** (threat model + architecture + matrices, 400-800+ lines). You MUST use the **Write tool** to create the file. DO NOT output the full document to the user (you will exceed token limits).

2. **Follow the template structure** with all 9 sections:
   - **Section 1: Threat Model** — Mermaid mindmap with ≥12 threat categories across 4 dimensions
   - **Section 2: Sandboxing Architecture** — Isolation boundary table with components, isolation levels, enforcement
   - **Section 3: Tool Permission Matrix** — ≥5 tools with permissions, access, risk
   - **Section 4: Data Handling Policy** — Data type table with handling, access, retention
   - **Section 5: Prompt Injection Defences** — ≥4 defences with method and coverage
   - **Section 6: Output Validation Pipeline** — Mermaid flowchart with pipeline stages
   - **Section 7: Secret Management** — Secret types, storage, access, rotation schedule
   - **Section 8: Incident Response** — Severity tiers with response times and owners
   - **Section 9: Traceability** — AAGI → AAGR → AASE → SEC links

3. **Auto-populate from artifacts**:
   - Tool list from AAGR tool contracts
   - Risk categories from RISK register
   - Security controls from SEC/SBD
   - Agent capabilities from AAGI

4. **Mermaid diagram requirements**:
   - Mindmap for threat model (4 root branches with ≥3 sub-branches each)
   - Flowchart for output validation pipeline (at least 5 stages)
   - All diagrams must use valid Mermaid syntax

### 8. Auto-Populate Document Control Fields

**CRITICAL - Auto-Populate Document Control Fields**:

Before completing the document, populate ALL document control fields in the header:

**Construct Document ID**:

- **Document ID**: `ARC-{PROJECT_ID}-AASE-v{VERSION}` (e.g., `ARC-001-AASE-v1.0`)

**Populate Required Fields**:

*Auto-populated fields* (populate these automatically):

- `[PROJECT_ID]` → Extract from project path (e.g., "001" from "projects/001-project-name")
- `[VERSION]` → "1.0" (or increment if previous version exists)
- `[DATE]` / `[YYYY-MM-DD]` → Current date in YYYY-MM-DD format
- `[DOCUMENT_TYPE_NAME]` → "Agent Security Architecture"
- `ARC-[PROJECT_ID]-AASE-v[VERSION]` → Construct using format above
- `[COMMAND]` → "arckit.agent-security"

*User-provided fields* (extract from project metadata or user input):

- `[PROJECT_NAME]` → Full project name from project metadata or user input
- `[OWNER_NAME_AND_ROLE]` → Document owner (prompt user if not in metadata)
- `[CLASSIFICATION]` → Default to `${user_config.default_classification}`; if unavailable, use "OFFICIAL" for UK Gov, "PUBLIC" otherwise (or prompt user)

*Calculated fields*:

- `[YYYY-MM-DD]` for Next Review → Current date + 90 days (quarterly review cycle)

*Pending fields* (leave as [PENDING] until manually updated):

- `[REVIEWER_NAME]` → [PENDING]
- `[APPROVER_NAME]` → [PENDING]
- `[DISTRIBUTION_LIST]` → Default to "Security Team, Architecture Team, Agent Governance Board" or [PENDING]

**Populate Revision History**:

```markdown
| 1.0 | {DATE} | ArcKit AI | Initial creation from `/arckit:agent-security` command | [PENDING] | [PENDING] |
```

**Populate Generation Metadata Footer**:

The footer should be populated with:

```markdown
**Generated by**: ArcKit `/arckit:agent-security` command
**Generated on**: {DATE} {TIME} GMT
**ArcKit Version**: {ARCKIT_VERSION}
**Project**: {PROJECT_NAME} (Project {PROJECT_ID})
**AI Model**: [Use actual model name, e.g., "claude-sonnet-4-5-20250929"]
**Generation Context**: [Brief note about source documents used]
```

---

Before writing the file, read `${CLAUDE_PLUGIN_ROOT}/references/quality-checklist.md` and verify all **Common Checks** plus the **AASE** per-type checks pass. Fix any failures before proceeding.

### 9. Quality Checks

Verify the security architecture meets minimum standards:

- **Threat model**: ≥12 threat categories across 4 attack surface dimensions (Input, Execution, Output, Infrastructure)
- **Sandboxing architecture**: At least 3 components with isolation levels and enforcement mechanisms
- **Tool permission matrix**: ≥5 tools with permissions, access levels, and risk ratings
- **Data handling policy**: At least 3 data types with handling, access, and retention policies
- **Prompt injection defences**: ≥4 defences covering direct, indirect, output, and tool abuse
- **Output validation pipeline**: Complete Mermaid flowchart with at least 5 stages
- **Secret management**: At least 3 secret types with storage, access, and rotation policies
- **Incident response**: At least 3 severity levels with response times and owners
- **Traceability links**: Established to AAGI, AAGR, and SEC/SBD documents

### 10. Write output

- `projects/{project-dir}/ARC-{PROJECT_ID}-AASE-v1.0.md` — Full security architecture document
- Update traceability matrix with security references

**CRITICAL - Show Summary Only**:
After writing the file, show ONLY a brief summary with key security metrics (threat categories covered, defences implemented, risk posture). Do NOT output the full security document content in your response.

## Example Usage

User: `/arckit:agent-security research-agent`

You should:

- Read AAGI (agent inventory) for research-agent project
- Read AAGR (agent design) for tool contracts and integration points
- Read SEC/SBD for existing security controls
- Generate threat model with ≥12 categories across 4 dimensions
- Design sandboxing architecture with isolation boundaries
- Build tool permission matrix (≥5 tools with risk ratings)
- Define data handling policy for PII, sensitive, and public data
- Implement ≥4 prompt injection defences
- Design output validation pipeline with Mermaid flowchart
- Establish secret management with rotation schedules
- Define incident response with 3+ severity levels
- **Status**: SECURITY ARCHITECTURE COMPLETE
- **Key findings**:
  - ✅ 14 threat categories identified across 4 dimensions
  - ✅ 4-layer sandboxing with OS-level enforcement
  - ✅ 7 tool permissions assessed, 2 high-risk tools with mitigations
  - ✅ 4 injection defences covering all attack vectors
  - ✅ Output validation pipeline with 6 stages
  - ✅ Secret rotation: 30-day (DB), 90-day (API, model)
- Write to `projects/001-research-agent/ARC-001-AASE-v1.0.md`

## Important Notes

- Security architecture is a LIVING document — review quarterly or after significant agent changes
- Be thorough on threat modelling (gaps are BLOCKING for deployment)
- All security controls must reference specific agent capabilities and threat categories
- Sandboxing requirements increase with agent autonomy and tool access
- Audit trails for tool executions must be immutable and cryptographically verifiable
- Prompt injection defences must cover both direct and indirect attack vectors
- Output validation must be automated with human review escalation for flagged content
- Secret management must follow zero-trust principles — no hardcoded credentials
- Security architecture feeds into governance requirements — handoff to `/arckit:agent-governance` after completion
- **Markdown escaping**: When writing less-than or greater-than comparisons, always include a space after `<` or `>` (e.g., `< 15 min response`, `> 99% coverage`) to prevent markdown renderers from interpreting them as HTML tags or emoji
