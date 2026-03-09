# Init Guide

> **Guide Origin**: Official | **ArcKit Version**: [VERSION]

`/arckit.init` initializes the ArcKit project structure for enterprise architecture governance, creating the foundational directory layout and global artifacts needed before any project work begins.

---

## Purpose

Every ArcKit project needs a consistent directory structure to organise architecture artifacts, maintain cross-project governance, and enable commands to locate templates and scripts. Without initialization, commands cannot find project directories, generate document IDs, or apply global principles.

The `/arckit.init` command **creates the foundational structure** that:

- Establishes the `projects/` root directory for all architecture work
- Creates `000-global/` for cross-project artifacts (principles, policies, external references)
- Sets up subdirectories for organisation-wide policies and external documents
- Provides clear next steps to guide users into their first project
- Ensures all subsequent ArcKit commands can locate and create artifacts correctly

---

## Inputs

| Artifact | Requirement | What It Provides |
|----------|-------------|------------------|
| None | N/A | This command has no prerequisites -- it is the starting point |

> **Note**: This is typically the first ArcKit command you run. No existing artifacts or project structure is needed.

---

## Command

```bash
/arckit.init
```

Outputs: Console output only (directory structure created, next steps displayed). No governance artifact file is produced.

---

## Output Structure

| Item | Contents |
|------|----------|
| **projects/** | Root directory for all architecture projects |
| **projects/000-global/** | Cross-project artifacts shared across all projects |
| **projects/000-global/policies/** | Organisation-wide policies and standards |
| **projects/000-global/external/** | External reference documents (regulations, frameworks, vendor materials) |
| **Console output** | Directory tree visualisation and numbered next steps |

---

## Workflow Position

The init command is the entry point for all ArcKit work -- everything starts here:

```text
              ┌─────────────────────┐
              │    /arckit.init     │
              └──────────┬──────────┘
                         │
            ┌────────────┼────────────┐
            ▼            ▼            ▼
     ┌────────────┐ ┌──────────┐ ┌──────────────┐
     │ /arckit    │ │ /arckit  │ │   /arckit    │
     │.principles │ │ .plan    │ │.stakeholders │
     └────────────┘ └──────────┘ └──────────────┘
            │
            ▼
     ┌────────────┐
     │ /arckit    │
     │  .start    │
     └────────────┘
```

**Best Practice**: Run `/arckit.init` once when starting a new repository or workspace. After initialization, proceed to `/arckit.principles` to establish governance foundations, or `/arckit.start` for a guided onboarding experience.

---

## Example Usage

### Basic Initialization

```bash
/arckit.init
```

### Initialize and Follow Up

```bash
# Step 1: Initialize the project structure
/arckit.init

# Step 2: Create global architecture principles
/arckit.principles Create architecture principles for our organisation

# Step 3: Start your first project
/arckit.stakeholders Analyze stakeholders for NHS Appointment System
```

### Re-running on an Existing Structure

```bash
# If projects/ already exists, the command will inform you and ask
# whether to continue -- it will not overwrite existing artifacts
/arckit.init
```

---

## Tips

- **Run once per repository**: The init command only needs to run once. Subsequent ArcKit commands create individual project directories (001-*, 002-*) automatically via the `create-project.sh` helper script.

- **Start with principles**: After initialization, `/arckit.principles` creates the global architecture principles document (`ARC-000-PRIN-v1.0.md`) in `000-global/`. This document governs all subsequent projects.

- **Use /arckit.start for guided onboarding**: If you are new to ArcKit, run `/arckit.start` after init for a guided walkthrough that helps you choose the right commands for your project.

- **Safe to re-run**: If the `projects/` directory already exists, the command detects this and asks before proceeding. It will not overwrite existing artifacts.

- **Place external documents early**: After init, add any existing architecture documents, regulations, or vendor materials to `projects/000-global/external/`. ArcKit commands will read these to inform artifact generation.

- **This is for the plugin workflow**: If you are using the CLI (`arckit init`), the CLI handles initialization differently by also scaffolding `.codex/`, `.opencode/`, and `.arckit/` directories. The `/arckit.init` slash command is specifically for the Claude Code plugin workflow.

---

## Follow-On Commands

After initializing the project structure, typical next steps include:

| Command | Purpose |
|---------|---------|
| `/arckit.principles` | Create global architecture principles that govern all projects |
| `/arckit.plan` | Plan your architecture engagement and identify which commands to run |
| `/arckit.stakeholders` | Analyze stakeholders for your first project |
| `/arckit.start` | Guided onboarding walkthrough for new ArcKit users |

---

## Output Example

```text
ArcKit project structure initialized:

projects/
├── 000-global/
│   ├── policies/   (organization-wide policies)
│   └── external/   (external reference documents)

Next steps:
1. Run /arckit.principles to create architecture principles
2. Run /arckit.stakeholders to analyze stakeholders for a project
3. Run /arckit.requirements to create requirements

Individual projects will be created automatically in numbered
directories (001-*, 002-*).
```
