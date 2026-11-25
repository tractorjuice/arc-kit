# Getting Started with ArcKit

> **Guide Origin**: Official | **ArcKit Version**: [VERSION]

The `start` and `init` commands are your entry points to ArcKit. Start gives you orientation and routes you to the right workflow; init creates the project structure.

Command syntax depends on your AI platform:

| Platform | Start | Init | Principles |
| --- | --- | --- | --- |
| Claude Code | `/arckit:start` | `/arckit:init` | `/arckit:principles` |
| Gemini CLI | `/arckit:start` | `/arckit:init` | `/arckit:principles` |
| OpenCode CLI | `/arckit.start` | `/arckit.init` | `/arckit.principles` |
| Codex CLI | `$arckit-start` | `$arckit-init` | `$arckit-principles` |
| GitHub Copilot | `/arckit-start` | `/arckit-init` | `/arckit-principles` |

Examples below use Claude Code syntax. Translate commands using the table above for other platforms.

---

## Quick Start

### Step 0: Check your platform setup

If ArcKit is already installed and enabled for your platform, skip to Step 1.

For Claude Code, ArcKit needs Claude Code **v2.1.319 or later**, and Node.js on your `PATH`. From a terminal:

```bash
claude install latest
claude --version
```

If `claude` isn't on your PATH yet, follow the [official Claude Code install guide](https://docs.claude.com/en/docs/claude-code/quickstart) first, then run `claude install latest`. ArcKit will warn you at session start if your client is below the supported floor.

For Codex CLI, install or upgrade the ArcKit plugin marketplace and enable plugin hooks:

```bash
# First install
codex plugin marketplace add tractorjuice/arckit-codex

# Existing install
codex plugin marketplace upgrade arckit

# Required for plugin-bundled lifecycle hooks
codex features enable hooks
codex features enable plugin_hooks
```

Restart Codex, run `/plugins`, choose **ArcKit Plugins**, then install and enable **ArcKit**.

For Gemini CLI, OpenCode CLI, and GitHub Copilot, use the platform-specific install steps on the [Getting Started page](https://arckit.org/getting-started.html).

### Step 1: Run the workflow

```bash
# Claude Code / OpenCode: get oriented, initialize, then create principles
/arckit:start
/arckit:init
/arckit:principles
```

For Codex CLI, the same workflow is:

```bash
$arckit-start
$arckit-init
$arckit-principles
```

> **Claude Code users — ArcKit "workflows" are unrelated to Claude Code's dynamic-workflows feature.** Throughout this guide, "workflow" means an ArcKit command sequence. Claude Code's built-in dynamic workflows (which fan work out across many agents) are a separate feature; as of Claude Code v2.1.160 their free-text trigger keyword is `ultracode` — the word *workflow* no longer starts one — so the term is safe to type here. ArcKit ships no `ultracode` content, and running a slash command (`/arckit:start`) or the `architecture-workflow` skill never starts a dynamic workflow. Other platforms (Codex, Gemini, OpenCode, Copilot) have no equivalent feature.

---

## Vibe Start — The 3-Prompt Super Prompt

If you want to skip the triage and let ArcKit do the heavy lifting, this is the fastest possible path from empty repo to a fully-populated project. Three prompts, no manual orchestration:

```text
1. /arckit:init  This is a project for {one-line description of what you're building}.

2. /arckit:principles

3. Now create all the artifacts. Take your time. Do not stop until complete.
```

### What Happens

- **Prompt 1** — `init` scaffolds the `projects/` structure and the one-line description seeds the project context.
- **Prompt 2** — `principles` generates `ARC-000-PRIN-v1.0.md`, the prerequisite that most other commands depend on.
- **Prompt 3** — the assistant works through the standard delivery workflow autonomously: `stakeholders` → `requirements` → `risk` → `sobc` → `adr` → `data-model` → `hld-review` → `roadmap`, etc., chaining via the `handoffs:` metadata in each command's frontmatter.

### When To Use It

- **Greenfield projects** where you want a complete first-pass set of artifacts to react to.
- **Demos and proofs of concept** where speed matters more than per-command supervision.
- **Vibe-coding sessions** where you want the assistant to keep going until everything is on disk.

### When Not To Use It

- **Heavily regulated work** (UK Gov Secure by Design, MOD, EU AI Act) where each artifact needs reviewer sign-off before the next is generated.
- **Existing projects** with artifacts already on disk — run `/arckit:navigator` first to see what is missing rather than regenerating.
- **Token-constrained sessions** — the full chain can run dozens of commands. Use the Claude Code session default and move to Claude Fable 5.2 (the default Fable model since Claude Code v2.1.321) only where your tenant exposes it and the work justifies the higher tier.

### Tips For Vibe Start

- Add constraints to prompt 1: `/arckit:init This is a project for X. Target users are Y. Budget is Z.`
- Use prompt 3 verbatim — the phrase "do not stop until complete" reliably suppresses early stopping. Followed by `/arckit:health` to spot anything skipped.
- If the run stalls, resume with: `Continue from where you stopped. Do not stop until complete.`

---

## `/arckit:start` — Get Oriented

**Inputs**: None required. Optionally provide a focus area.

```bash
# Full onboarding experience
/arckit:start

# Jump to a specific workflow area
/arckit:start new project
/arckit:start procurement
/arckit:start governance review
```

Output: Console only (no file created). This is a navigation aid, not a governance artifact. The command runs nothing for you: it presents a plan and you run the commands.

### What It Does

`/arckit:start` follows the `architecture-workflow` skill.

1. **Project detection** — scans `projects/` for existing projects, the principles document and the artifacts each project already has, and classes the project as new, early, mid or late stage
2. **Triage questions** — asks four questions, one at a time: sector, project type, current stage and primary goal. A focus argument may let it skip some
3. **Deeper questions** — for UK Government, Defence, AI/ML or full-lifecycle projects it also asks about compliance frameworks, procurement, strategic analysis and timeline
4. **Tailored plan** — selects a base workflow for your sector, adds modifiers for AI/ML or data projects, drops phases you have already done, and lists the commands in order, grouped by phase
5. **Adjustment** — asks whether you want to change the plan or are ready to begin

### Example Output

```text
Project State: [1 project found, 4 artifacts, ~20% complete]

Recommended Command Sequence
=============================

Based on: [UK Government] + [AI/ML] project, starting fresh, full lifecycle

Phase 1: Foundation
  1. /arckit:principles — Governance foundation (GDS + TCoP aligned)
  2. /arckit:stakeholders — Map DDaT roles, SROs, policy owners
  3. /arckit:risk — HMG Orange Book risk methodology

Phase 2: Business Justification
  4. /arckit:sobc — HM Treasury Green Book 5-case model
  5. /arckit:requirements — Central artifact for all downstream work

...

[Total: N commands across M phases]

Run commands in order. Each command will guide you through its process.
```

---

## `/arckit:init` — Create Project Structure

**Inputs**: None required.

```bash
# Initialize project structure
/arckit:init
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

`/arckit:start` picks a base workflow from your sector, then applies modifiers:

| Workflow | Chosen when | Reference |
|----------|-------------|-----------|
| Standard | Private sector or public sector outside the UK | `standard-path` |
| UK Government | Sector is UK Government (civilian departments) | `uk-gov-path` |
| Defence | Sector is Defence (MOD, defence contractors) | `defence-path` |
| AI/ML (modifier) | Project type is AI/ML | `ai-ml-path` |
| Data (modifier) | Project type is a data platform or analytics | `data-path` |

If a project is both AI/ML and data, both modifiers apply. The plan is then scaled to your goal, stage and timeline.

See [WORKFLOW-DIAGRAMS.md](../WORKFLOW-DIAGRAMS.md) for visual workflow diagrams.

---

## Tips

- **Run `/arckit:start` at the beginning of any session** — it gives you a quick snapshot of where things stand and what to do next.
- **Run `/arckit:init` once per repository** — it creates the project structure. Safe to re-run if the structure already exists.
- **Use a focus argument** like `/arckit:start procurement`. It is used as context during triage and may let the command skip some questions.
- **Principles next** — after init, run `/arckit:principles` as most commands depend on architecture principles.
- **Pairs well with `/arckit:health`** — start gives you navigation, health gives you artifact-level diagnostics.

---

## Related Commands

- `/arckit:principles` — Create architecture principles (run after init)
- `/arckit:plan` — Create project plan with timeline and phases
- `/arckit:health` — Detailed artifact health scan
- `/arckit:customize` — Customize document templates
