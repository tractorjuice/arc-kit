# AI Agent Architecture Reference

## Agent Design Patterns

### Single Agent

A solitary agent with a defined purpose, tool access, and goal. Best for well-scoped, linear tasks. Key considerations include prompt design, tool selection, and failure recovery. Single agents minimise complexity but are limited by their single-threaded reasoning and tool access.

### Multi-Agent Chain

Sequential or branching chains of specialised agents where output from one agent flows to the next. Common patterns include:

- **Pipeline chains**: Linear flow (e.g., research → analysis → report)
- **Fan-out/fan-in**: One agent distributes work to parallel agents, then consolidates results
- **Router chains**: A dispatcher agent routes tasks to specialist agents based on classification

Key design decisions: chain topology, error propagation strategy, state passing between stages, and rollback mechanisms.

### Swarm

Homogeneous or heterogeneous groups of agents operating concurrently on shared state. Swarms excel at:

- Exploration and search (e.g., optimisation problems)
- Parallel data processing
- Emergent behaviour through agent interactions

Considerations: coordination protocols, shared state consistency, convergence criteria, and resource contention.

### Hierarchical

A supervisor agent delegates subtasks to specialised worker agents, reviews outputs, and iterates. Patterns include:

- **Supervisor-worker**: Single coordinator manages a team of specialists
- **Multi-level hierarchy**: Supervisors of supervisors for large-scale programmes
- **Debate/review**: Separate proposal and review agents for quality assurance

Key considerations: delegation criteria, supervision overhead, deadlock detection, and escalation paths.

## Tool Contracts

### MCP Specification

Agents interact with external systems via the Model Context Protocol (MCP):

- **Transport**: stdio, HTTP/SSE, WebSocket
- **Resources**: Read/write access to structured data sources
- **Tools**: Parameterised functions with JSON Schema contracts
- **Prompts**: Pre-built prompt templates for common workflows
- **Security**: Per-transport authentication, capability scoping, rate limiting

### Skill Design

Reusable agent capabilities packaged as first-class units:

- **Interface contract**: Input schema, output schema, error codes
- **Statefulness**: Stateless skills vs. skills with persistent context
- **Discovery**: Skill registries, capability manifests, versioning
- **Composition**: Skills that call other skills, inheritance patterns

### Permission Models

Controlling what agents may do:

- **Capability-based**: Explicit grant of tool/skill access
- **Role-based**: Groups of capabilities assigned to agent roles
- **Policy-based**: Attribute-based decisions (who, what, where, when)
- **Dynamic**: Runtime permission evaluation based on context
- **Least privilege**: Default-deny with explicit allow-listing

## Memory Architectures

### Session Memory

Short-term context maintained during a single agent run:

- Conversation history with token management
- Scratchpad/blackboard for intermediate reasoning
- Working sets of active data

### Durable Memory

Persistence across sessions:

- Fact storage with retrieval
- Agent profiles and preferences
- Learned patterns and heuristics
- Checkpoint and resume capability

### Vector Search

Semantic retrieval for long-term memory:

- Embedding models and similarity search
- Index management and freshness
- Hybrid search combining vector and keyword
- Re-ranking and recall strategies

### Episodic Memory

Recorded experiences for learning:

- Success/failure case archives
- Decision rationales and outcomes
- Transfer learning between similar scenarios
- Reflection and self-evaluation cycles

## Orchestration Patterns

### LangGraph Nodes

Graph-based execution where nodes are agents/operations:

- **Directed graph topology**: Checkpoints, conditional edges, cycles
- **State management**: Typed state with schema validation
- **Streaming**: Real-time updates through graph execution
- **Error handling**: Retry policies, fallback edges, circuit breakers

### CrewAI Roles

Team-based coordination with defined roles:

- **Agent roles**: Task specialists with goal definitions
- **Task delegation**: Crew manager assigns and collects results
- **Role contracts**: Input/output expectations between crew members
- **Process models**: Sequential, hierarchical, and consensual processes

### Event-Driven Pipelines

Async communication between agents:

- **Event bus**: Pub/sub messaging between agent components
- **Reactive patterns**: Trigger-based workflows
- **Message queues**: Reliable delivery with persistence
- **Saga patterns**: Distributed transactions with compensating actions

## Security Models

### Sandboxing

Isolation of agent execution:

- Container isolation (Docker, gVisor, Firecracker)
- System call filtering and seccomp profiles
- Network isolation and proxy requirements
- Resource limits (CPU, memory, I/O)

### Tool Permissions

Controlling agent tool access:

- Capability manifests per agent
- Runtime approval gates for sensitive operations
- Tool output size and type validation
- Rate limiting and quota enforcement

### Output Validation

Ensuring agent outputs meet expectations:

- Schema validation and type checking
- Content safety filtering
- Determinism checks for compliance-critical outputs
- Adversarial output detection

### Secret Management

Managing credentials and sensitive data:

- Secret injection at runtime (never in prompts)
- Key lifecycle management and rotation
- Access logging and audit trails
- Encryption at rest and in transit for stored secrets

## Governance Frameworks

### Human-in-the-Loop

Critical decisions require human approval before execution:

- **Approval gates**: Defined checkpoints requiring sign-off
- **Escalation criteria**: Automated escalation based on risk threshold
- **Override capability**: Humans can halt or redirect any agent
- **Decision logging**: Immutable record of human interventions

### Human-on-the-Loop

Humans monitor and can intervene but don't approve each action:

- **Dashboard monitoring**: Real-time agent activity visibility
- **Alert thresholds**: Anomaly detection triggers human attention
- **Emergency stop**: Immediate halt capability
- **Periodic review**: Scheduled audits of agent decisions

### Autonomous with Audit

Agents operate independently with comprehensive logging:

- **Immutable audit trails**: Tamper-proof logs of all decisions
- **Automated compliance checks**: Policy evaluation of agent actions
- **Periodic human review**: Sampling and full audits at intervals
- **Post-incident review**: Root cause analysis capability
