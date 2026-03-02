---
description: Get oriented with ArcKit — check project status, explore available commands, and choose your next step
argument-hint: "[workflow focus, e.g. 'new project', 'procurement', 'governance review']"
tags: [start, onboarding, getting-started, welcome, help, overview, guide]
---

# ArcKit: Onboarding & Navigation

You are providing a **guided onboarding and navigation experience** for ArcKit. This is a console-only diagnostic command — do NOT create a file. Your output is a navigation aid, not a governance artifact.

## User Input

```text
$ARGUMENTS
```

---

## Process

### Step 1: Welcome Banner

Use the ArcKit version from context (provided by the SessionStart hook), then display:

```text
ArcKit — Enterprise Architecture Governance Toolkit
Version X.Y.Z | 53 commands | Plugin mode

Your AI-powered assistant for architecture governance, vendor procurement,
and compliance — all driven by templates and traceability.
```

Replace `X.Y.Z` with the actual version from context.

### Step 2: Detect Project State

Use the **ArcKit Project Context** (above) to get the project inventory. Display a compact summary:

```text
Projects
--------
🟢 [001] project-name (N artifacts)
🟠 [002] another-project (N artifacts)

Global foundations:
  ✓ Architecture Principles (ARC-000-PRIN-v1.0.md)
  ✗ No policies directory
  ✗ No external reference documents
```

**Completeness heuristic** — estimate project completeness based on artifact types present:

- 0-24%: Only stakeholders/principles/requirements
- 25-49%: Has research, data-model, or ADRs
- 50-74%: Has design reviews, SOW, or evaluations
- 75-100%: Has traceability, governance analysis, conformance

**If no `projects/` directory exists**, show:

```text
No project structure found. Run /arckit:init to create your first project.
```

**If `list-projects.sh` is not available**, fall back to manually checking for `projects/` directory.

> **Note**: The ArcKit Project Context hook may have already detected projects and artifacts. Use that context when available rather than scanning manually.

### Step 3: Check Connected Tools

Check which MCP tools are available by listing available tools. Look for:

- **AWS Knowledge** — tools with `aws` in the name (enables `/arckit:aws-research`)
- **Microsoft Learn** — tools with `microsoft` in the name (enables `/arckit:azure-research`)
- **Google Developer** — tools with `google` in the name (enables `/arckit:gcp-research`)

Report which are connected:

```text
Connected Tools
---------------
✓ AWS Knowledge — AWS service research and architecture patterns
✓ Microsoft Learn — Azure and Microsoft documentation
✗ Google Developer — not connected (GCP research available via web search fallback)
```

Only show this section if at least one cloud research MCP is detected. If none are connected, skip this section entirely.

### Step 4: Show Command Decision Tree

If the user provided `$ARGUMENTS` with a specific focus area (e.g., "procurement", "new project", "governance"), skip directly to the relevant section of the tree and expand it with more detail.

Otherwise, show the full navigation tree:

```text
What are you working on?

Starting a new project
├── No project structure?     → /arckit:init
├── Need principles first?    → /arckit:principles (global, required by most commands)
├── Planning phases & gates?  → /arckit:plan
└── Ready to scope?           → /arckit:stakeholders → /arckit:requirements

Architecture decisions
├── Technology research?      → /arckit:research (build vs buy, market scan)
├── Cloud service research?   → /arckit:aws-research, /arckit:azure-research, /arckit:gcp-research
├── Data architecture?        → /arckit:data-model → /arckit:datascout
├── Platform strategy?        → /arckit:platform-design → /arckit:wardley
└── Record a decision?        → /arckit:adr

Procurement & evaluation
├── Statement of work / RFP?  → /arckit:sow
├── G-Cloud services?         → /arckit:gcloud-search → /arckit:gcloud-clarify
├── Digital Outcomes?          → /arckit:dos
└── Evaluate vendors?         → /arckit:evaluate

Quality & governance
├── Artifact health scan?     → /arckit:health
├── Governance analysis?      → /arckit:analyze
├── Architecture conformance? → /arckit:conformance
├── Principles compliance?    → /arckit:principles-compliance
└── Traceability matrix?      → /arckit:traceability

UK Government compliance
├── GDS Service Standard?     → /arckit:service-assessment
├── Technology Code of Practice? → /arckit:tcop
├── Secure by Design?         → /arckit:secure
├── AI Playbook?              → /arckit:ai-playbook
└── MOD Secure by Design?     → /arckit:mod-secure

Reporting & publishing
├── Project narrative?        → /arckit:story
├── MARP presentation?        → /arckit:presentation
└── GitHub Pages site?        → /arckit:pages
```

### Step 5: Context-Aware Recommendations

Based on what was detected in Step 2, provide 3-5 specific **suggested next steps**. Use this decision logic:

| Project State | Recommendations |
|---|---|
| No `projects/` directory | "Run `/arckit:init` to create your project structure" |
| No principles (no `000-global/ARC-000-PRIN-*`) | "Run `/arckit:principles` — this is required by most downstream commands" |
| Project at 0-24% completeness | Suggest: `/arckit:stakeholders` → `/arckit:requirements` → `/arckit:risk` (the standard opening sequence) |
| Project at 25-49% completeness | Suggest: `/arckit:research`, `/arckit:data-model`, or `/arckit:adr` based on what artifact types are missing |
| Project at 50-74% completeness | Suggest: `/arckit:sow`, `/arckit:evaluate`, or design review commands based on what's missing |
| Project at 75-100% completeness | Suggest: governance commands (`/arckit:health`, `/arckit:analyze`, `/arckit:conformance`, `/arckit:traceability`) |
| Multiple projects | Highlight which project needs the most attention (fewest artifacts relative to others) |

Format as a numbered list:

```text
Suggested next steps
--------------------
1. Run /arckit:principles to establish architecture principles (required by most commands)
2. Run /arckit:stakeholders to analyze stakeholder drivers and goals
3. Run /arckit:requirements to create your requirements specification
```

### Step 6: Conversational Entry Points

Present three conversational entry points to help the user choose their path:

```text
How can I help today?

1. "I'm starting a new project"
   → I'll guide you through init → principles → stakeholders → requirements

2. "I need to make an architecture decision"
   → I'll help with research, ADRs, and design reviews

3. "I want to review existing work"
   → I'll run health checks, governance analysis, and compliance scans
```

### Step 7: Wait for Response

Wait for user input and route to the appropriate command or workflow based on their response. If they choose one of the three entry points, begin guiding them through that workflow.

---

## Important Notes

- **Console output only** — do NOT create a file. This is a navigation aid, not a governance artifact.
- **Use the ArcKit Project Context hook** — the hook has already detected projects and artifacts; use that data rather than scanning directories manually where possible.
- If `list-projects.sh` is not available (e.g., running outside plugin context), fall back to manually checking for `projects/` directory.
- **Markdown escaping**: When writing less-than or greater-than comparisons, always include a space after `<` or `>` to prevent markdown renderers from interpreting them as HTML tags.
