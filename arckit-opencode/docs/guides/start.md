# Getting Started with ArcKit

`/arckit.start` is your entry point to ArcKit — it detects project state, checks connected tools, and routes you to the right workflow.

---

## Inputs

None — this is an entry point command. Optionally provide a focus area.

---

## Command

```bash
# Full onboarding experience
/arckit.start

# Jump to a specific workflow area
/arckit.start new project
/arckit.start procurement
/arckit.start governance review
```

Output: Console only (no file created). This is a navigation aid, not a governance artifact.

---

## What It Does

1. **Welcome banner** — shows ArcKit version, command count, and mode
2. **Project detection** — scans `projects/` for existing artifacts and estimates completeness
3. **Tool survey** — checks for connected MCP servers (AWS Knowledge, Microsoft Learn, Google Developer)
4. **Command decision tree** — visual routing guide organised by workflow area
5. **Context-aware recommendations** — suggests 3-5 next steps based on your project maturity
6. **Conversational entry points** — three quick-start paths for common scenarios

---

## Example Output

```
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

- **Run `/arckit:start` at the beginning of any session** — it gives you a quick snapshot of where things stand and what to do next.
- **Use a focus argument** like `/arckit:start procurement` to skip directly to that section of the decision tree.
- **No prerequisites** — this command works with or without existing projects, making it the ideal first command for new users.
- **Pairs well with `/arckit:health`** — start gives you navigation, health gives you artifact-level diagnostics.

---

## Related Commands

- `/arckit.init` — Create project structure (suggested when no projects exist)
- `/arckit.health` — Detailed artifact health scan
- `/arckit.plan` — Create project plan with timeline and phases
- `/arckit.customize` — Customize document templates
