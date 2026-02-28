# Getting Started with ArcKit

`/arckit.start` and `/arckit.init` are your entry points to ArcKit. Start gives you orientation and routes you to the right workflow; init creates the project structure.

---

## Quick Start

```bash
# Step 1: Get oriented — see project status and available commands
/arckit.start

# Step 2: Initialize project structure (if no projects/ directory exists)
/arckit.init

# Step 3: Create architecture principles (prerequisite for most commands)
/arckit.principles
```

---

## `/arckit.start` — Get Oriented

**Inputs**: None required. Optionally provide a focus area.

```bash
# Full onboarding experience
/arckit.start

# Jump to a specific workflow area
/arckit.start new project
/arckit.start procurement
/arckit.start governance review
```

Output: Console only (no file created). This is a navigation aid, not a governance artifact.

### What It Does

1. **Welcome banner** — shows ArcKit version, command count, and mode
2. **Project detection** — scans `projects/` for existing artifacts and estimates completeness
3. **Tool survey** — checks for connected MCP servers (AWS Knowledge, Microsoft Learn, Google Developer)
4. **Command decision tree** — visual routing guide organised by workflow area
5. **Context-aware recommendations** — suggests 3-5 next steps based on your project maturity
6. **Conversational entry points** — three quick-start paths for common scenarios

### Example Output

```text
ArcKit — Enterprise Architecture Governance Toolkit
Version 2.10.0 | 53 commands | Plugin mode

Your AI-powered assistant for architecture governance, vendor procurement,
and compliance — all driven by templates and traceability.

Projects
--------
🟢 [001] nhs-appointment (12 artifacts, ~75% complete)
🟠 [002] data-platform   (4 artifacts, ~30% complete)

Global foundations:
  ✓ Architecture Principles (ARC-000-PRIN-v1.0.md)
  ✓ Policies directory
  ✗ No external reference documents

Connected Tools
---------------
✓ AWS Knowledge — AWS service research and architecture patterns
✓ Microsoft Learn — Azure and Microsoft documentation
✗ Google Developer — not connected (GCP research available via web search fallback)

What are you working on?

Starting a new project
├── No project structure?     → /arckit:init
├── Need principles first?    → /arckit:principles
├── Planning phases & gates?  → /arckit:plan
└── Ready to scope?           → /arckit:stakeholders → /arckit:requirements

...

Suggested next steps
--------------------
1. Project [002] data-platform needs attention (30% complete)
2. Run /arckit:research for data-platform to evaluate technology options
3. Run /arckit:health to scan all projects for stale artifacts

How can I help today?

1. "I'm starting a new project"
2. "I need to make an architecture decision"
3. "I want to review existing work"
```

---

## `/arckit.init` — Create Project Structure

**Inputs**: None required.

```bash
# Initialize project structure
/arckit.init
```

Output: Creates `projects/` directory structure. No governance artifact is generated.

### What It Does

1. **Checks for existing structure** — looks for a `projects/` directory in the current working directory
2. **Creates the global directory** — sets up `projects/000-global/` with `policies/` and `external/` subdirectories
3. **Shows next steps** — recommends the first commands to run

### Example Output

```text
ArcKit project structure initialized:

projects/
├── 000-global/
│   ├── policies/   (organization-wide policies)
│   └── external/   (external reference documents)

Next steps:
1. Run /arckit:principles to create architecture principles
2. Run /arckit:stakeholders to analyze stakeholders for a project
3. Run /arckit:requirements to create requirements

Individual projects will be created automatically in numbered directories (001-*, 002-*).
```

### Project Structure

After initialization and running a few commands, your project grows into:

```text
projects/
├── 000-global/
│   ├── ARC-000-PRIN-v1.0.md      (architecture principles)
│   ├── policies/                   (organization-wide policies)
│   └── external/                   (external reference documents)
├── 001-project-name/
│   ├── ARC-001-REQ-v1.0.md        (requirements)
│   ├── ARC-001-STKE-v1.0.md       (stakeholder analysis)
│   ├── ARC-001-RISK-v1.0.md       (risk register)
│   └── vendors/                    (vendor evaluations)
└── 002-another-project/
    └── ...
```

Each command automatically creates numbered project directories (001-\*, 002-\*) as needed.

---

## Workflow Paths

`/arckit.start` connects to all five standard ArcKit workflows:

| Workflow | Entry Point | Key Commands |
|----------|-------------|--------------|
| Standard Delivery | "I'm starting a new project" | `init` → `principles` → `stakeholders` → `requirements` |
| UK Government | Compliance focus | `service-assessment`, `tcop`, `secure`, `ai-playbook` |
| AI/ML Projects | Architecture decisions | `research` → `adr` → `mlops` → `ai-playbook` |
| Cloud Migration | Platform strategy | `aws-research` / `azure-research` → `platform-design` → `wardley` |
| Data Platform | Data architecture | `data-model` → `datascout` → `data-mesh-contract` |

See [WORKFLOW-DIAGRAMS.md](../../WORKFLOW-DIAGRAMS.md) for visual workflow diagrams.

---

## Tips

- **Run `/arckit.start` at the beginning of any session** — it gives you a quick snapshot of where things stand and what to do next.
- **Run `/arckit.init` once per repository** — it creates the project structure. Safe to re-run if the structure already exists.
- **Use a focus argument** like `/arckit.start procurement` to skip directly to that section of the decision tree.
- **Principles next** — after init, run `/arckit.principles` as most commands depend on architecture principles.
- **Pairs well with `/arckit.health`** — start gives you navigation, health gives you artifact-level diagnostics.

---

## Related Commands

- `/arckit.principles` — Create architecture principles (run after init)
- `/arckit.plan` — Create project plan with timeline and phases
- `/arckit.health` — Detailed artifact health scan
- `/arckit.customize` — Customize document templates
