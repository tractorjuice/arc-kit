---
description: Design AI agent architecture — patterns, tool contracts, memory, orchestration, guardrails
argument-hint: "<agent name or project ID, e.g. 'research-agent', '001'>"
effort: high
handoffs:
  - command: agent-integration
    description: Design integration contracts for multi-agent systems
  - command: agent-security
    description: Design security architecture for agents
---

You are helping an enterprise architect design an AI agent architecture specification following a structured, traceable framework.

## User Input

```text
$ARGUMENTS
```

## Instructions

> **Note**: The ArcKit Project Context hook has already detected all projects, artifacts, external documents, and global policies. Use that context below — no need to scan directories manually.

### 1. Read existing artifacts from the project context

**MANDATORY** (warn if missing):

- **AAGI** (Agent Inventory, recommended) — Extract: agent catalogue, current capabilities, lifecycle status, and operational context
  - If missing: warn user to run `/arckit:agent-inventory` first
- **REQ** (Requirements, recommended) — Extract: FR/NFR for agent capabilities, tool requirements, memory requirements, guardrail requirements
  - If missing: warn user to run `/arckit:requirements` first

**RECOMMENDED** (read if available, note if missing):

- **PRIN** (Architecture Principles, in 000-global) — Extract: AI/agent principles, technology constraints, compliance requirements
- **STKE** (Stakeholder Analysis) — Extract: Agent user personas, operator roles, governance stakeholders
- **RISK** (Risk Register) — Extract: AI-specific risks, tool security risks, data handling risks
- **AIPB** (AI Playbook) — Extract: AI ethics principles, model governance, bias considerations

**OPTIONAL** (read if available, skip silently if missing):

- **HLDR** (High-Level Design Review) — Extract: existing system architecture the agent will integrate with
- **SECD** (Secure by Design) — Extract: security controls applicable to agent systems
- **AAGI** (Agent Inventory) — Extract: existing agents, capability baseline, ownership, and operational status

### 2. Identify the target project

- Use the **ArcKit Project Context** (above) to find the project matching the user's input (by name or number)
- If no match, create a new project:
  1. Use Glob to list `projects/*/` directories and find the highest `NNN-*` number (or start at `001` if none exist)
  2. Calculate the next number (zero-padded to 3 digits, e.g., `002`)
  3. Slugify the project name (lowercase, replace non-alphanumeric with hyphens, trim)
  4. Use the Write tool to create `projects/{NNN}-{slug}/README.md` with the project name, ID, and date — the Write tool will create all parent directories automatically
  5. Also create `projects/{NNN}-{slug}/external/README.md` with a note to place external reference documents here
  6. Set `PROJECT_ID` = the 3-digit number, `PROJECT_PATH` = the new directory path

### 3. Interactive Configuration

Before generating the agent design, use the **AskUserQuestion** tool to gather key parameters. **Skip any question where the user has already provided a clear answer in their arguments.**

**Gathering rules** (apply to all questions in this section):

- Ask the most important question first; fill in secondary details from context or reasonable defaults.
- **Maximum 2 rounds of questions.** After that, pick the best option from available context.
- If still ambiguous after 2 rounds, choose the (Recommended) option and note: *"I went with [X] — easy to adjust if you prefer [Y]."*

**Question 1** — header: `Pattern`, multiSelect: false
> "What agent architecture pattern best describes this agent?"

- **Single Agent (Recommended)**: Single LLM core with tools — best for focused tasks, simple domains
- **Chain**: Sequential pipeline of specialized agents — best for multi-step reasoning, complex workflows
- **Multi-Agent**: Parallel workers with a coordinator — best for complex domains, parallelization
- **Hierarchical**: Supervisor + worker agents — best for coordinated multi-agent systems, dynamic task allocation

**Question 2** — header: `Scope`, multiSelect: false
> "What is the primary scope of this agent?"

- **Task Automation**: Automating repetitive workflows (data processing, report generation, routine decisions)
- **Knowledge Work**: Research, analysis, synthesis (document analysis, market research, decision support)
- **Creative**: Generation and ideation (content creation, design, brainstorming)
- **Decision Support**: Recommendation and evaluation (risk assessment, prioritization, planning)

### 4. Read the template

**Read the template** (with user override support):

- **First**, check if `.arckit/templates-custom/agent-design-template.md` exists in the project root
- **If found**: Read the user's customized template (user override takes precedence)
- **If not found**: Read `${CLAUDE_PLUGIN_ROOT}/templates/agent-design-template.md` (default)

> **Tip**: Users can customize templates with `/arckit:customize agent-design`

### 5. Gather agent design information

**Agent identity and purpose**:

- **Agent name**: Short, descriptive name (e.g., "Research Analyst Agent")
- **Agent ID**: Unique identifier (e.g., "AGT-001")
- **Purpose**: One-sentence description of what the agent does
- **Domain**: Domain of expertise (e.g., "financial analysis", "code review")

**Architecture decisions** (from Questions or context):

- **Architecture pattern**: Single / Chain / Multi-Agent / Hierarchical (from Question 1)
- **Scope**: Task Automation / Knowledge Work / Creative / Decision Support (from Question 2)
- **LLM model**: Primary model (e.g., "Claude Sonnet 5 (session default)")
- **Hosting**: Local / Cloud / Hybrid

**Tool inventory** (minimum 3 tools):

Extract from REQ artifacts or define new:

- **Tool ID**: Unique identifier (e.g., "T-001")
- **Tool name**: Descriptive name
- **Tool type**: MCP / REST / Function / Database
- **Permissions**: Read / Write / Execute
- **Input schema**: Key parameters
- **Output schema**: Return format

**Memory design**:

- **Session memory**: In-memory context, session-scoped
- **Durable memory**: Persistent storage, cross-session
- **Vector memory**: Semantic search, embedding-based retrieval

**Guardrail requirements** (minimum 2 guardrails):

- **Output validation**: Regex / LLM-based / Heuristic checks
- **Input sanitization**: Prompt injection prevention
- **Rate limiting**: Usage controls
- **Content filtering**: Safety boundaries

**Testing approach**:

- **Unit tests**: Tool contract validation
- **Integration tests**: End-to-end agent flow
- **Security tests**: Prompt injection, jailbreak resistance

### 6. Auto-Populate from Existing Artifacts

**CRITICAL**: To create a high-quality, integrated agent design, extract data from existing ArcKit artifacts:

#### 6.1 Extract Requirements → Tool Contracts

If `projects/{project_id}/ARC-*-REQ-*.md` exists:

**Read the file** and extract:

- **FR (Functional Requirements)** → Map to **Tool Capabilities**
  - Example: "FR-010: Query knowledge base" → Tool T-001 (Knowledge Base MCP)
- **NFR (Non-Functional Requirements)** → Map to **Guardrails and Memory**
  - Example: "NFR-S-001: Respond within 5 seconds" → Guardrail: timeout
  - Example: "NFR-P-002: Remember user preferences" → Memory: Durable layer

#### 6.2 Extract Risks → Guardrail Configuration

If `projects/{project_id}/ARC-*-RISK-*.md` exists:

**Read the risk register** and extract:

- **Security risks** → Guardrails (prompt injection, data exfiltration)
- **Reliability risks** → Redundancy patterns, fallback mechanisms
- **Compliance risks** → Audit logging, data retention policies

#### 6.3 Extract Stakeholders → Agent Persona

If `projects/{project_id}/ARC-*-STKE-*.md` exists:

**Read stakeholder analysis** and extract:

- **End users** → Agent interaction patterns, tone, complexity level
- **Operators** → Monitoring requirements, admin capabilities
- **Governance** → Approval workflows, audit requirements

### 7. Detect Version

Before generating the document ID, check if a previous version exists:

1. Look for existing `ARC-{PROJECT_ID}-AAGR-v*.md` files in the project directory
2. **If no existing file**: Use VERSION="1.0"
3. **If existing file found**:
   - Read the existing document to understand its scope
   - Compare against current inputs and agent requirements
   - **Minor increment** (e.g., 1.0 → 1.1): Same pattern — updated tools, refined guardrails, corrected details
   - **Major increment** (e.g., 1.0 → 2.0): Pattern changed (single → multi-agent), fundamentally different tools, new memory architecture
4. Use the determined version for document ID, filename, Document Control, and Revision History
5. For v1.1+/v2.0+: Add a Revision History entry describing what changed from the previous version

### 8. Construct Document Control Metadata

- **Document ID**: `ARC-{PROJECT_ID}-AAGR-v{VERSION}` (e.g., `ARC-001-AAGR-v1.0`)

**Populate document control fields**:

- `document_id`: Constructed from format above
- `project_id`: From Step 2
- `project_name`: From Step 2
- `version`: Determined version from Step 7
- `author`: "ArcKit Agent Design Command"
- `date_created`: Current date (YYYY-MM-DD)
- `date_updated`: Current date (YYYY-MM-DD)
- `generation_date`: Current date and time
- `ai_model`: Your model name

### 9. Generate Agent Architecture Specification

**CRITICAL INSTRUCTIONS FOR QUALITY**:

1. **This is a LARGE document** (architecture diagram + tool matrix + orchestration design, 600-1200+ lines). You MUST use the **Write tool** to create the file. DO NOT output the full document to the user (you will exceed token limits).

2. **Follow the template structure** with all 7 sections:

   **Section 1: Agent Architecture Overview**
   - Architecture pattern selection with justification
   - Architecture pattern comparison table (Single / Chain / Multi-Agent / Hierarchical)
   - Component diagram (Mermaid C4) showing: LLM Core, Tool Layer, Memory, Guardrails
   - Agent capabilities summary table

   **Section 2: Tool Contracts** (minimum 3 tools)
   - Tool contract matrix with: Tool ID, Name, Type, Permissions, Input Schema, Output Schema
   - MCP server configurations
   - Tool dependency graph (Mermaid)

   **Section 3: Memory Architecture**
   - Memory layer table: Session / Durable / Vector
   - Storage technology, retention policy, access patterns
   - Memory flow diagram (Mermaid)

   **Section 4: Orchestration Design**
   - Orchestration table: Component, Framework, Role, Handoff
   - Flow diagram (Mermaid flowchart) showing node transitions
   - Error handling and retry strategies
   - State management approach

   **Section 5: Guardrail Configuration** (minimum 2 guardrails)
   - Guardrail table: Name, Type, Threshold, Action
   - Prompt injection prevention strategy
   - Output validation pipeline
   - Rate limiting and quota management

   **Section 6: Testing Strategy**
   - Test matrix: Unit / Integration / Security / Performance
   - Coverage targets and tooling
   - Evaluation framework (benchmarks, golden datasets)

   **Section 7: Traceability**
   - AAGI → AAGR → REQ traceability links
   - Cross-references to related artifacts

3. **Auto-populate from artifacts** (from Step 6):
   - Tool contracts from ARC-*-REQ-*.md
   - Guardrails from ARC-*-RISK-*.md
   - Agent personas from ARC-*-STKE-*.md

4. **Mermaid diagram requirements**:
   - C4Component diagram for architecture overview
   - Flowchart for orchestration design
   - All diagrams must use consistent styling
   - Include element descriptions in `Person()`, `Component()`, etc.

### 10. Quality Checks

Before writing the file, read `${CLAUDE_PLUGIN_ROOT}/references/quality-checklist.md` and verify all **Common Checks** plus the **AAGR** per-type checks pass. Fix any failures before proceeding.

**AAGR-specific quality checks**:

- **Architecture pattern defined**: One of Single, Chain, Multi-Agent, or Hierarchical — not left as placeholder
- **Component diagram present**: Valid Mermaid C4Component diagram with LLM Core, Tool Layer, Memory, Guardrails
- **Tool contracts**: At least 3 tools defined with complete schema (ID, name, type, permissions, input, output)
- **Memory architecture**: All 3 layers (Session, Durable, Vector) documented with storage and retention
- **Orchestration diagram**: Valid Mermaid flowchart with at least 3 nodes
- **Guardrails**: At least 2 guardrails defined with type, threshold, and action
- **Testing strategy**: At least 3 test types covered (Unit, Integration, Security)
- **No placeholder text**: No remaining `[Name]`, `[Model]`, `[MCP servers]`, or `[Schema]` tokens

### 11. Use Write tool to create the agent design file

- **CRITICAL**: Because agent designs are large documents (600-1200+ lines), you MUST use the Write tool to create the file
- Do NOT output the full content in your response (this will exceed token limits)
- Use Write tool with the full agent design content
- Path: `projects/{PROJECT_ID}-{project-name}/ARC-{PROJECT_ID}-AAGR-v{VERSION}.md`

**CRITICAL - Auto-Populate Document Control Fields**:

Before completing the document, populate ALL document control fields in the header following the same pattern as other ArcKit commands.

### Step 0: Detect Version

ADRs and agent designs follow the same version detection logic:

**Creating a new document** (default): Use `VERSION="1.0"`

**Updating an existing document** (user explicitly references an existing document):

1. Look for existing `ARC-{PROJECT_ID}-AAGR-v*.md` files in `projects/{project-dir}/`
2. **If no existing file**: Use VERSION="1.0"
3. **If existing file found**:
   - Read the existing document
   - **Minor increment** (e.g., 1.0 → 1.1): Same pattern — updated tools, refined guardrails
   - **Major increment** (e.g., 1.0 → 2.0): Pattern changed, fundamentally different architecture
4. Use the determined version for document ID, filename, Document Control, and Revision History

### Step 1: Populate Revision History

```markdown
| 1.0 | {DATE} | ArcKit AI | Initial creation from `/arckit:agent-design` command | [PENDING] | [PENDING] |
```

### Step 2: Populate Generation Metadata Footer

The footer should be populated with:

```markdown
**Generated by**: ArcKit `/arckit:agent-design` command
**Generated on**: {DATE} {TIME} GMT
**ArcKit Version**: {ARCKIT_VERSION}
**Project**: {PROJECT_NAME} (Project {PROJECT_ID})
**AI Model**: [Use actual model name]
**Generation Context**: [Brief note about source documents used]
```

### 12. Show summary to user (NOT full document)

```markdown
## Agent Architecture Specification Created

**Agent**: {agent_name}
**Document**: projects/{PROJECT_ID}-{project-name}/ARC-{PROJECT_ID}-AAGR-v1.0.md
**Document ID**: ARC-{PROJECT_ID}-AAGR-v1.0

### Architecture Pattern

**Pattern**: {Single Agent / Chain / Multi-Agent / Hierarchical}
**Justification**: {One-sentence rationale}

### Components

- **LLM Core**: {model} — {primary model}
- **Tool Layer**: {N} tools — {tool names}
- **Memory**: Session + Durable + Vector
- **Guardrails**: {N} guardrails — {guardrail names}

### Tool Contracts

| Tool ID | Name | Type |
|---------|------|------|
| T-001 | {name} | {type} |
| T-002 | {name} | {type} |
| T-003 | {name} | {type} |

### Memory Architecture

| Layer | Storage | Retention |
|-------|---------|-----------|
| Session | In-memory | Session only |
| Durable | {DB} | Indefinite |
| Vector | {Vector DB} | Configurable |

### Orchestration

- **Framework**: {LangGraph/CrewAI/etc}
- **Nodes**: {N} nodes in pipeline
- **Error handling**: {Strategy}

### Guardrails

| Guardrail | Type | Action |
|-----------|------|--------|
| {name} | {type} | {action} |
| {name} | {type} | {action} |

### Testing Strategy

| Test Type | Coverage | Tool |
|-----------|----------|------|
| Unit | Tool contracts | pytest |
| Integration | Agent flow | {framework} |
| Security | Prompt injection | {tool} |

### Traceability

- **AAGI**: {N} references
- **REQ**: {N} requirements traced
- **RISK**: {N} risks addressed

### Next Steps

- [ ] Review and validate architecture with stakeholders
- [ ] Create detailed designs for each component
- [ ] Set up tool contracts and MCP servers
- [ ] Implement guardrails and safety layer
- [ ] Develop testing framework
- [ ] Run `/arckit:agent-integration` for multi-agent coordination
- [ ] Run `/arckit:agent-security` for security review

### Files Created

📄 `projects/{PROJECT_ID}-{project-name}/ARC-{PROJECT_ID}-AAGR-v1.0.md` ({line_count} lines)
```

## Important Notes

- **Token Limit**: Agent designs are large documents. Always use Write tool to create the file, never output full content
- **Minimum requirements**: At least 3 tool contracts, 2 guardrails, all memory layers documented
- **Mermaid diagrams**: Must use valid syntax — C4Component for architecture, flowchart for orchestration
- **Markdown escaping**: When writing less-than or greater-than comparisons, always include a space after `<` or `>` (e.g., `< 3 seconds`, `> 99.9% uptime`) to prevent markdown renderers from interpreting them as HTML tags or emoji
- **Template customization**: Users can override the template by placing their own `agent-design-template.md` in `.arckit/templates-custom/`
- **Versioning**: Always check for existing versions before creating a new file — increment appropriately
