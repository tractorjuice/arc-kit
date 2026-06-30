---
description: Catalog existing AI agents with capabilities, security classification, and oversight level
argument-hint: "<project ID or scope, e.g. '001', 'all agents', 'production agents'>"
effort: high
handoffs:
  - command: agent-design
    description: Design architecture for new or modified agents
  - command: agent-security
    description: Assess security posture for inventoried agents
---

You are helping an enterprise architect create a comprehensive AI agent inventory that catalogs all existing AI agents across the programme — documenting capabilities, security posture, and human oversight levels.

## User Input

```text
$ARGUMENTS
```

## Instructions

> **Note**: The ArcKit Project Context hook has already detected all projects, artifacts, external documents, and global policies. Use that context below — no need to scan directories manually.

### Prerequisites

- **ADMP** (ADM Preliminary / Architecture Vision, recommended — inherits from TOGAF if available)
- **APP** (Application Inventory, recommended)
- **PRIN** (Principles, recommended — from 000-global)

1. **Determine inventory scope**:

   Ask the user: *"What scope should this agent inventory cover? (e.g., all agents across the organisation, a specific project, or a specific environment like production/staging)"*

   Use the user's input and `$ARGUMENTS` to determine scope.

2. **Read existing artifacts from the project context:**

   **RECOMMENDED** (read if available, note if missing):
   - **PRIN** (Architecture Principles, in `000-global`)
     - Extract: AI governance standards, agent policy requirements, risk tolerance thresholds
   - **ADMP** (ADM Preliminary / Architecture Vision)
     - Extract: Agent programme scope, migration phases, existing agent references
   - **APP** (Application Inventory)
     - Extract: Application context, hosting platforms, integrations, lifecycle and ownership details

   **OPTIONAL** (read if available, skip silently if missing):
   - **AAGR** (Agent Architecture Specification)
     - Extract: Agent capability requirements, safety requirements, architecture patterns
   - **AAOV** (Agent Governance Framework)
     - Extract: Oversight model, approval workflow, audit requirements
   - **AASE** (Agent Security Architecture)
     - Extract: Threat models, security controls, isolation requirements
   - **AAIN** (Agent Integration Patterns)
     - Extract: Agent-to-agent communication patterns, orchestration models
   - **AAMT** (Agent Maturity Assessment)
     - Extract: Current maturity level, improvement targets

3. **Identify the target project**:

   - Use the **ArcKit Project Context** (above) to find the project matching the user's input (by name or number)
   - If no match, create a new project:
     1. Use Glob to list `projects/*/` directories and find the highest `NNN-*` number (or start at `001` if none exist)
     2. Calculate the next number (zero-padded to 3 digits, e.g., `002`)
     3. Slugify the project name (lowercase, replace non-alphanumeric with hyphens, trim)
     4. Use the Write tool to create `projects/{NNN}-{slug}/README.md` with the project name, ID, and date — the Write tool will create all parent directories automatically
     5. Also create `projects/{NNN}-{slug}/external/README.md` with a note to place external reference documents here
     6. Set `PROJECT_ID` = the 3-digit number, `PROJECT_PATH` = the new directory path

4. **Read the template** (with user override support):

   - **First**, check if `.arckit/templates-custom/agent-inventory-template.md` exists in the project root
   - **If found**: Read the user's customized template (user override takes precedence)
   - **If not found**: Read `${CLAUDE_PLUGIN_ROOT}/templates/agent-inventory-template.md` (default)

   > **Tip**: Users can customize templates with `/arckit:customize agent-inventory`

5. **Catalog agents from all sources:**

   Search for existing agent definitions across:
   - Agent design documents (`ARC-*-AAGR-*.md`)
   - Agent operational views (`ARC-*-AAOV-*.md`)
   - Agent security evaluations (`ARC-*-AASE-*.md`)
   - Code repositories and deployment configurations
   - Any external documents referencing AI agents
   - Known agent frameworks in use (LangGraph, CrewAI, AutoGen, etc.)

   For each agent found, document:
   - **Agent ID**: Unique identifier (AGT-001, AGT-002, etc.)
   - **Name**: Human-readable agent name
   - **Purpose**: What this agent does (1-2 sentences)
   - **Model**: Underlying LLM or model family (GPT-4, Claude, open-source, etc.)
   - **Deployment**: Current deployment status (Prod, Staging, Dev, Planned)
   - **Owner**: Business or technical owner
   - **Risk Level**: Critical, High, Medium, Low
   - **Oversight Level**: Human-in-the-loop, Human-on-the-loop, Autonomous with Audit

   > **If fewer than 3 agents are found**, ask the user: *"I've identified fewer than 3 agents. Do you have additional agents to include, or should I proceed with the agents found?"*

6. **Build the agent inventory:**

   **A. Agent Register**:
   - Create a complete table of all agents with ID, name, purpose, model, deployment status, owner, risk level, and oversight level

   **B. Capability Matrix**:
   - For each agent, document: tools available, skills/capabilities, memory type (Session, Durable, Vector), and output types (Text, API, File, Action)

   **C. Agent Dependencies** (Mermaid flowchart):
   - Create a dependency map showing how agents interact
   - Include orchestration relationships, data flows, and tool-sharing patterns
   - Use Mermaid `flowchart TD` syntax

   **D. Security Classification**:
   - For each agent, document: data sensitivity level, access level, isolation method, and whether audit is required
   - Reference security evaluations from AASE documents if available

   **E. Agent Lifecycle**:
   - Document current status (Active, In Development, Deprecating, Retired), creation date, last updated date, and version
   - Include lifecycle stage rationale

   **F. Human Oversight Level**:
   - Define oversight model per agent:
     - **Human-in-the-loop**: Critical decisions require explicit human approval
     - **Human-on-the-loop**: Human monitors and can intervene but doesn't approve each action
     - **Autonomous with Audit**: Agent operates independently with comprehensive logging and periodic review
   - Link oversight level to risk classification

7. **Read the quality checklist**:

   Before writing the file, read `${CLAUDE_PLUGIN_ROOT}/references/quality-checklist.md` and verify all **Common Checks** plus the **AAGI** per-type checks pass. Fix any failures before proceeding.

8. **Write the output**:
   - Write to `projects/{project-dir}/ARC-{PROJECT_ID}-AAGI-v1.0.md`
   - Use the exact template structure from `agent-inventory-template.md`
   - Include Mermaid dependency diagram
   - Include all sections even if some are marked as "No agents found" or "TBD"

**IMPORTANT - Auto-Populate Document Information Fields:**

Before completing the document, populate document information fields:

### Auto-populated fields

- `[PROJECT_ID]` → Extract from project path (e.g., "001")
- `[VERSION]` → Start with "1.0" for new documents
- `[DATE]` / `[YYYY-MM-DD]` → Current date in YYYY-MM-DD format
- `[DOCUMENT_TYPE_NAME]` → Document purpose
- `ARC-[PROJECT_ID]-AAGI-v[VERSION]` → Generated document ID
- `[STATUS]` → "DRAFT" for new documents
- `[CLASSIFICATION]` → Default to `${user_config.default_classification}`; if unavailable, use "OFFICIAL" (UK Gov) or "PUBLIC"

### User-provided fields

- `[PROJECT_NAME]` → Full project name
- `[OWNER_NAME_AND_ROLE]` → Document owner

### Revision History

```markdown
| 1.0 | {DATE} | ArcKit AI | Initial creation from `/arckit:agent-inventory` command |
```

### Generation Metadata Footer

```markdown
**Generated by**: ArcKit `/arckit:agent-inventory` command
**Generated on**: {DATE}
**ArcKit Version**: {ARCKIT_VERSION}
**Project**: {PROJECT_NAME} (Project {PROJECT_ID})
**AI Model**: [Actual model name]
```

9. **Summarize what you created**:

- Total number of agents inventoried (AGT-001, AGT-002, etc.)
- Breakdown by deployment status (Prod, Staging, Dev, Planned)
- Breakdown by risk level (Critical, High, Medium, Low)
- Breakdown by oversight level (Human-in-the-loop, Human-on-the-loop, Autonomous)
- Number of unique tools across all agents
- Agent dependency count (number of agent-to-agent connections)
- Agents requiring audit (count)
- Suggested next steps (e.g., "Run `/arckit:agent-security` to assess security posture" or "Run `/arckit:agent-design` for new agent architecture")

## Example Usage

User: `/arckit:agent-inventory Catalog all AI agents in the data processing pipeline`

You should:

- Check prerequisites (ADMP, APP, PRIN recommended)
- Find project directory (e.g., `projects/001-data-pipeline/`)
- Search for existing agent definitions across documents and configurations
- Generate comprehensive agent inventory:
  - Agent register with AGT-001 through AGT-005 (data ingestion, validation, transformation, analysis, reporting)
  - Capability matrix showing tools (MCP clients, file systems, APIs, vector stores)
  - Dependency flowchart showing orchestration chain
  - Security classification (sensitivity levels, isolation methods)
  - Lifecycle status (active, in development, deprecated)
  - Oversight levels per agent (risk-based)
- **CRITICAL - Token Efficiency**: Use the **Write tool** to create `projects/001-data-pipeline/ARC-001-AAGI-v1.0.md`
  - **DO NOT** output the full document in your response (this exceeds 32K token limit!)
- Show summary only (see Output Instructions below)

## Important Notes

- **Agent inventory is the foundation** for all subsequent agent architecture work (design, governance, security, maturity)
- **Every agent MUST have an owner** — unowned agents are a governance risk
- **Risk classification drives oversight**: Critical/High risk agents require Human-in-the-loop or Human-on-the-loop
- **Low risk agents** can operate autonomously with audit logging
- **Security classification is mandatory** — every agent needs sensitivity, access, isolation, and audit status defined
- **Dependency map must show all agent-to-agent communication** — orphan agents indicate design gaps
- **Use Mermaid flowchart TD syntax** for dependency diagrams (GitHub-renderable)
- **Reference agent architecture reference** from `${CLAUDE_PLUGIN_ROOT}/references/agent-architecture-reference.md` for design patterns, memory architectures, and security models
- **Cross-reference existing AAGR, AAOV, AASE documents** to avoid duplicating definitions
- **Traceability**: All agents must link back to ADMP programme scope and PRIN governance principles

- **Markdown escaping**: When writing less-than or greater-than comparisons, always include a space after `<` or `>` (e.g., `< 3 seconds`, `> 99.9% uptime`) to prevent markdown renderers from interpreting them as HTML tags or emoji

## Integration with Other Commands

- **Output**: Feeds into `/arckit:agent-design` (architecture for new or modified agents based on inventory gaps)
- **Output**: Feeds into `/arckit:agent-security` (security assessment for each inventoried agent)
- **Output**: Feeds into `/arckit:agent-governance` (oversight framework built on inventory)
- **Output**: Feeds into `/arckit:agent-integration` (integration patterns between inventoried agents)
- **Output**: Feeds into `/arckit:agent-maturity` (maturity assessment across all agents)

## Quality Checks

Before writing the output file, verify:

- **Agent Register**: ≥3 agents documented with all required fields
- **Capability Matrix**: All agents have tools, skills, memory, and output types defined
- **Dependency Diagram**: Mermaid flowchart present with all agent-to-agent connections
- **Security Classification**: All agents have sensitivity, access level, isolation, and audit status
- **Lifecycle Status**: All agents have status, dates, and version
- **Oversight Level**: All agents have explicit oversight model defined

## Output Instructions

**CRITICAL - Token Efficiency:**

### 1. Generate Agent Inventory

Create the comprehensive agent inventory following the template structure with all sections.

### 2. Write Directly to File

**Use the Write tool** to create `projects/{project-dir}/ARC-{PROJECT_ID}-AAGI-v1.0.md` with the complete agent inventory.

**DO NOT** output the full document in your response. This would exceed token limits.

### 3. Show Summary Only

After writing the file, show ONLY a concise summary:

```markdown
## Agent Inventory Complete ✅

**Project**: [Project Name]
**File Created**: `projects/[PROJECT]/ARC-{PROJECT_ID}-AAGI-v1.0.md`

### Inventory Summary

**Agents**: [Number] agents catalogued
- Production: [Number]
- Staging: [Number]
- Development: [Number]
- Planned: [Number]

**Risk Levels**:
- Critical: [Number]
- High: [Number]
- Medium: [Number]
- Low: [Number]

**Oversight**:
- Human-in-the-loop: [Number]
- Human-on-the-loop: [Number]
- Autonomous with Audit: [Number]

**Dependencies**: [Number] agent-to-agent connections mapped

### What's in the Document

- Agent Register (complete table with ID, name, purpose, model, owner, risk, oversight)
- Capability Matrix (tools, skills, memory, outputs per agent)
- Dependency Map (Mermaid flowchart)
- Security Classification (sensitivity, access, isolation, audit)
- Agent Lifecycle (status, dates, versions)
- Oversight Levels (per-agent governance model)
- Traceability (ADMP, APP, PRIN links)

### Next Steps

- Run `/arckit:agent-security` to assess security posture for inventoried agents
- Run `/arckit:agent-design` to design architecture for new or modified agents
- Run `/arckit:agent-governance` to establish oversight frameworks
```

**Statistics to Include**:

- Total agents in register
- Agents by deployment status
- Agents by risk level
- Agents by oversight level
- Total agent-to-agent dependencies
- Agents requiring audit

Generate the agent inventory now, write to file using Write tool, and show only the summary above.
