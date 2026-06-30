---
description: Design multi-agent integration — inter-agent contracts, message protocols, shared state, failure isolation
argument-hint: "<project ID or agent group, e.g. '001', 'research swarm'>"
effort: high
handoffs:
  - command: agent-governance
    description: Apply governance to multi-agent orchestration
  - command: agent-security
    description: Secure inter-agent communication
---

You are helping an enterprise architect design the integration architecture for a multi-agent system — defining inter-agent contracts, message protocols, shared state, and failure isolation boundaries.

## User Input

```text
$ARGUMENTS
```

## Instructions

> **Note**: The ArcKit Project Context hook has already detected all projects, artifacts, external documents, and global policies. Use that context below — no need to scan directories manually.

### Prerequisites

- **AAGR** (Agent Architecture Specification, mandatory — at least one agent design)
- **AAGI** (Agent Inventory, recommended)
- **AAOV** (Agent Governance Framework, recommended)

1. **Determine integration scope**:

   Ask the user: *"What agents or agent group should this integration architecture cover? (e.g., a specific project, a swarm, a pipeline, or cross-project integration)"*

   Use the user's input and `$ARGUMENTS` to determine scope.

2. **Read existing artifacts from the project context:**

   **MANDATORY** (must be present to proceed):
   - **AAGR** (Agent Architecture Specification)
     - Extract: Agent definitions, capability profiles, interface requirements

   **RECOMMENDED** (read if available, note if missing):
   - **AAGI** (Agent Inventory)
     - Extract: Agent register, capabilities, deployment status
   - **AAOV** (Agent Governance Framework)
     - Extract: oversight model, approval workflow, audit requirements, and governance constraints

   **OPTIONAL** (read if available, skip silently if missing):
   - **AASE** (Agent Security Architecture)
     - Extract: Security controls, isolation requirements, threat models
   - **PRIN** (Principles)
     - Extract: Integration standards, interoperability requirements
   - **ADMP** (ADM Preliminary / Architecture Vision)
     - Extract: Integration architecture references, migration phases

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

   - **First**, check if `.arckit/templates-custom/agent-integration-template.md` exists in the project root
   - **If found**: Read the user's customized template (user override takes precedence)
   - **If not found**: Read `${CLAUDE_PLUGIN_ROOT}/templates/agent-integration-template.md` (default)

   > **Tip**: Users can customize templates with `/arckit:customize agent-integration`

5. **Analyze agent designs for integration points**:

   Read all AAGR documents to identify:
   - Agent interfaces (input/output schemas, communication methods)
   - Dependencies between agents
   - Shared data requirements
   - Orchestration needs (which agents need to coordinate)

   For each agent, document:
   - **Integration Role**: Producer, consumer, orchestrator, or broker
   - **Communication needs**: Synchronous vs. asynchronous
   - **Data contracts**: Input/output schemas
   - **SLA requirements**: Latency, throughput, availability

   > **If fewer than 3 agents are found**, ask the user: *"I've identified fewer than 3 agents for integration. Do you want to expand the scope, or proceed with what exists?"*

6. **Build the integration architecture**:

   **A. Integration Architecture Overview**:
   - Document the overall integration pattern for the multi-agent system
   - Select integration patterns based on requirements (Event-Driven, Request-Response, Message Queue, Shared State)
   - Justify pattern choices with requirements traceability

   **B. Inter-Agent Contracts**:
   - Define formal contracts between agent pairs
   - Document: Contract ID, source agent, target agent, interface, protocol, SLA
   - Include JSON schema for each contract input/output
   - Minimum: ≥3 agent contracts documented

   **C. Message Protocol** (Mermaid sequence diagram):
   - Create a sequence diagram showing agent communication flows
   - Include orchestrator-worker interactions, shared state reads/writes
   - Show message routing through intermediaries (queues, brokers)
   - Use Mermaid `sequenceDiagram` syntax

   **D. Shared State Design**:
   - Document shared state repositories and their purposes
   - Specify store type, access patterns, and consistency model
   - Include: Redis (session state), PostgreSQL (durable state), Qdrant (semantic search), or other stores
   - Document access patterns (read/write/search) per store

   **E. Failure Isolation Boundaries**:
   - Define isolation boundaries for different failure modes
   - Document: boundary type, isolation level, failure modes, recovery strategies
   - Cover: agent process isolation, tool execution sandboxing, message delivery guarantees
   - Include recovery strategies (restart, retry, fallback, deduplication)

   **F. Observability Design**:
   - Define metrics, alerts, and monitoring per component
   - Cover: agent health, message queue status, error rates
   - Include threshold values and alert conditions

7. **Read the quality checklist**:

   Before writing the file, read `${CLAUDE_PLUGIN_ROOT}/references/quality-checklist.md` and verify all **Common Checks** plus the **AAIN** per-type checks pass. Fix any failures before proceeding.

8. **Write the output**:
   - Write to `projects/{project-dir}/ARC-{PROJECT_ID}-AAIN-v1.0.md`
   - Use the exact template structure from `agent-integration-template.md`
   - Include all sections even if some areas need further refinement
   - Include Mermaid sequence diagram for message protocol
   - Include failure isolation boundaries table

**IMPORTANT - Auto-Populate Document Information Fields:**

Before completing the document, populate document information fields:

### Auto-populated fields

- `[PROJECT_ID]` → Extract from project path (e.g., "001")
- `[VERSION]` → Start with "1.0" for new documents
- `[DATE]` / `[YYYY-MM-DD]` → Current date in YYYY-MM-DD format
- `[DOCUMENT_TYPE_NAME]` → Document purpose
- `ARC-[PROJECT_ID]-AAIN-v[VERSION]` → Generated document ID
- `[STATUS]` → "DRAFT" for new documents
- `[CLASSIFICATION]` → Default to `${user_config.default_classification}`; if unavailable, use "OFFICIAL" (UK Gov) or "PUBLIC"

### User-provided fields

- `[PROJECT_NAME]` → Full project name
- `[OWNER_NAME_AND_ROLE]` → Document owner

### Revision History

```markdown
| 1.0 | {DATE} | ArcKit AI | Initial creation from `/arckit:agent-integration` command |
```

### Generation Metadata Footer

```markdown
**Generated by**: ArcKit `/arckit:agent-integration` command
**Generated on**: {DATE}
**ArcKit Version**: {ARCKIT_VERSION}
**Project**: {PROJECT_NAME} (Project {PROJECT_ID})
**AI Model**: [Actual model name]
```

9. **Summarize what you created**:

- Number of integration points defined
- Number of inter-agent contracts documented
- Integration patterns selected and justified
- Shared state repositories and stores
- Failure isolation boundaries defined
- Observability metrics and alerts
- Suggested next steps

## Example Usage

User: `/arckit:agent-integration Design integration for the research swarm in project 003`

You should:

- Check prerequisites (AAGR mandatory, AAGI recommended)
- Find project directory (e.g., `projects/003-research-swarm/`)
- Read agent designs from AAGR documents to identify integration points
- Generate integration architecture:
  - Integration overview with pattern selection
  - Inter-agent contracts (≥3) with JSON schemas
  - Message protocol (Mermaid sequence diagram)
  - Shared state design (stores, access patterns)
  - Failure isolation boundaries (boundaries, recovery)
  - Observability design (metrics, alerts)
- **CRITICAL - Token Efficiency**: Use the **Write tool** to create `projects/003-research-swarm/ARC-003-AAIN-v1.0.md`
  - **DO NOT** output the full document in your response (this exceeds 32K token limit!)
- Show summary only (see Output Instructions below)

## Important Notes

- **AAGR is mandatory** — you need at least one agent design to define integration contracts
- **Contracts define behavior**: Each contract must specify input/output schemas, protocol, and SLA
- **≥3 agent contracts required** — fewer than 3 contracts indicates incomplete integration coverage
- **Sequence diagram is mandatory** — shows message routing and agent interactions
- **Failure isolation boundaries** must cover agent processes, tool executions, and message delivery
- **Observability must include alerts** with specific threshold values
- **Cross-reference AAGR, AAGI, AAOV** to ensure consistency with existing agent definitions
- **Traceability**: All integration decisions must link back to AAGR agent designs
- **Reference agent architecture reference** from `${CLAUDE_PLUGIN_ROOT}/references/agent-architecture-reference.md` for integration patterns and communication models

- **Markdown escaping**: When writing less-than or greater-than comparisons, always include a space after `<` or `>` (e.g., `< 3 seconds`, `> 99.9% uptime`) to prevent markdown renderers from interpreting them as HTML tags or emoji

## Integration with Other Commands

- **Input**: Uses AAGR (agent designs) and AAGI (agent inventory) to identify integration points
- **Output**: Feeds into `/arckit:agent-governance` (governance for multi-agent orchestration)
- **Output**: Feeds into `/arckit:agent-security` (securing inter-agent communication)
- **Output**: Feeds into `/arckit:agent-maturity` (maturity assessment of integration capabilities)

## Quality Checks

Before writing the output file, verify:

- **Inter-Agent Contracts**: ≥3 contracts with ID, source, target, interface, protocol, SLA
- **Contract Specification**: JSON schema for each contract with input/output types
- **Sequence Diagram**: Mermaid sequence diagram present showing message protocol
- **Shared State Design**: Stores documented with type, purpose, and access pattern
- **Failure Isolation Boundaries**: Boundaries defined with isolation level, failure mode, and recovery
- **Observability Metrics**: Metrics defined with specific alerts and thresholds

## Output Instructions

**CRITICAL - Token Efficiency:**

### 1. Generate Integration Architecture

Create the comprehensive integration architecture following the template structure with all sections.

### 2. Write Directly to File

**Use the Write tool** to create `projects/{project-dir}/ARC-{PROJECT_ID}-AAIN-v1.0.md` with the complete integration architecture.

**DO NOT** output the full document in your response. This would exceed token limits.

### 3. Show Summary Only

After writing the file, show ONLY a concise summary:

```markdown
## Agent Integration Architecture Complete ✅

**Project**: [Project Name]
**File Created**: `projects/[PROJECT]/ARC-{PROJECT_ID}-AAIN-v1.0.md`

### Integration Summary

**Agents**: [Number] agents integrated
**Contracts**: [Number] inter-agent contracts defined
**Patterns**: [Pattern 1, Pattern 2]

**Shared State Stores**: [Number] stores configured
- [Store 1]: [Type/Purpose]
- [Store 2]: [Type/Purpose]

**Failure Isolation**: [Number] boundaries defined
**Observability**: [Number] metrics with [Number] alert thresholds

### What's in the Document

- Integration Architecture Overview (pattern selection and justification)
- Inter-Agent Contracts (≥3 contracts with JSON schemas)
- Message Protocol (Mermaid sequence diagram)
- Shared State Design (stores, access patterns)
- Failure Isolation Boundaries (boundaries, recovery strategies)
- Observability Design (metrics, alerts, thresholds)
- Traceability (AAGR → AAIN links)

### Next Steps

- Run `/arckit:agent-governance` to apply governance to multi-agent orchestration
- Run `/arckit:agent-security` to secure inter-agent communication
```

**Statistics to Include**:

- Total agents integrated
- Number of inter-agent contracts
- Integration patterns selected
- Shared state stores
- Failure isolation boundaries
- Observability metrics and alerts

Generate the agent integration architecture now, write to file using Write tool, and show only the summary above.
