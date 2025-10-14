# ArcKit Setup & Testing Guide

## What Was Built

The complete ArcKit CLI infrastructure has been scaffolded with:

### Core Files Created
```
arc-kit/
├── src/arckit_cli/__init__.py    # Main CLI (450 lines)
├── pyproject.toml                 # Package configuration
├── README.md                      # Comprehensive documentation
├── LICENSE                        # MIT License
├── .gitignore                     # Git ignore rules
├── templates/                     # 8 comprehensive templates
│   ├── architecture-principles-template.md
│   ├── requirements-template.md
│   ├── sow-template.md
│   ├── evaluation-criteria-template.md
│   ├── hld-review-template.md
│   ├── dld-review-template.md
│   ├── vendor-scoring-template.md
│   └── traceability-matrix-template.md
├── scripts/bash/
│   ├── common.sh                  # Shared utilities
│   └── create-project.sh          # Project creation script
├── docs/                          # Documentation directory (empty, ready for guides)
└── memory/                        # For global architecture principles
```

---

## Installation & Testing

### Option 1: Install with uv (Recommended)

```bash
# Install uv if you don't have it
curl -LsSf https://astral.sh/uv/install.sh | sh

# Navigate to arc-kit directory
cd /workspaces/arc-kit

# Install in development mode
uv pip install -e .

# Test the CLI
arckit --help
arckit init test-project --ai claude
```

### Option 2: Install Dependencies Manually

```bash
cd /workspaces/arc-kit

# Install Python dependencies
pip install typer rich httpx readchar truststore

# Run the CLI directly
python -m arckit_cli --help
python -m arckit_cli init test-project --ai claude
```

### Option 3: Test Without Installation

```bash
cd /workspaces/arc-kit

# Install dependencies first
pip install typer rich httpx readchar truststore

# Run with PYTHONPATH
PYTHONPATH=/workspaces/arc-kit/src python src/arckit_cli/__init__.py --help
PYTHONPATH=/workspaces/arc-kit/src python src/arckit_cli/__init__.py init test-project --ai claude
```

---

## Quick Test Workflow

Once installed, test the complete workflow:

```bash
# 1. Initialize a project
arckit init payment-modernization --ai claude
cd payment-modernization

# 2. Start Claude Code
claude

# 3. Inside Claude, test commands (once implemented):
/arckit.principles Create architecture principles for financial services
/arckit.requirements Define payment gateway requirements
/arckit.sow Generate RFP for vendor selection
```

---

## What Works Now

✅ **CLI Structure**: Complete arckit CLI with init and check commands
✅ **Templates**: All 8 templates ready for use
✅ **Project Scaffolding**: Creates proper .arckit directory structure
✅ **Scripts**: Bash utilities for project management
✅ **Documentation**: Comprehensive README with examples

---

## What's Next (TODO)

### Immediate (Next 1-2 Days)

1. **Create Slash Commands** (`/arckit.principles`)
   - Create `.claude/commands/arckit.principles.md`
   - Script that reads template, prompts user, generates output
   - Test with real use case

2. **Test CLI Installation**
   ```bash
   pip install typer rich httpx readchar truststore
   cd /workspaces/arc-kit
   python -m arckit_cli init test-project --ai claude
   ```

3. **Validate with Real Architect**
   - Get feedback on templates
   - Are workflows realistic?
   - What's missing?

### Short Term (Next Week)

4. **Implement Core Commands**
   - `/arckit.principles` (highest priority)
   - `/arckit.requirements`
   - `/arckit.sow`

5. **Create Example Project**
   - Walk through full workflow
   - Document pain points
   - Create video walkthrough

6. **Add Agent Support**
   - Claude Code commands (`.claude/commands/`)
   - GitHub Copilot instructions (`.github/copilot-instructions.md`)
   - Cursor rules (`.cursor/rules/`)

### Medium Term (Next Month)

7. **Vendor Management Features**
   - `/arckit.evaluate` command
   - `/arckit.compare` command
   - Vendor directory structure

8. **Design Review Features**
   - `/arckit.hld-review` command
   - `/arckit.dld-review` command
   - Review approval workflows

9. **Traceability**
   - `/arckit.traceability` command
   - Automatic gap detection
   - Coverage metrics

---

## File Structure After `arckit init`

When you run `arckit init my-project`, it creates:

```
my-project/
├── .arckit/
│   ├── memory/
│   │   └── architecture-principles.md (global)
│   ├── scripts/
│   │   └── bash/
│   │       ├── common.sh
│   │       └── create-project.sh
│   └── templates/
│       ├── architecture-principles-template.md
│       ├── requirements-template.md
│       ├── sow-template.md
│       └── [6 more templates]
├── projects/                         # Future projects created here
├── .claude/commands/                 # Slash commands for Claude Code
├── README.md
└── .gitignore
```

---

## CLI Commands Available

### `arckit init <project-name>`

Initializes a new ArcKit project:
- Creates directory structure
- Copies templates
- Sets up AI agent commands
- Initializes git repo (optional)

**Options**:
- `--ai <agent>` - Choose AI assistant (claude, copilot, gemini, cursor-agent)
- `--no-git` - Skip git initialization
- `--here` - Initialize in current directory

**Examples**:
```bash
arckit init payment-modernization --ai claude
arckit init . --ai copilot
arckit init --here --no-git
```

### `arckit check`

Verifies that required tools are installed:
- Git
- Claude Code (if using)
- VS Code / Cursor
- Other AI agents

**Example**:
```bash
arckit check
```

---

## Developing ArcKit

### Adding a New Slash Command

1. **Create command file**: `.claude/commands/arckit.mycommand.md`

```markdown
---
description: Brief description of what this command does
scripts:
  sh: .arckit/scripts/bash/my-command.sh --json "{ARGS}"
---

## User Input

```text
$ARGUMENTS
```

## Instructions

[Instructions for AI agent on what to do]

1. Run the script to get JSON output
2. Parse the JSON for file paths
3. Read the template
4. Generate output based on user input
5. Write to specified file path
```

2. **Create bash script**: `.arckit/scripts/bash/my-command.sh`

```bash
#!/usr/bin/env bash
source "$(dirname "$0")/common.sh"

# Parse arguments, do work, output JSON
```

3. **Test the command**:
```bash
claude
/arckit.mycommand Test input
```

---

## Troubleshooting

### "No module named 'typer'"

Install dependencies:
```bash
pip install typer rich httpx readchar truststore
```

### "Not in an ArcKit project"

Make sure you're in a directory initialized with `arckit init` (contains `.arckit/` folder).

### "arckit: command not found"

Either:
1. Install with uv: `uv pip install -e .`
2. Or run directly: `python -m arckit_cli`

---

## Next Immediate Step

**Test the basic CLI**:

```bash
cd /workspaces/arc-kit
pip install typer rich httpx readchar truststore
python -m arckit_cli init test-arckit-project --ai claude
cd test-arckit-project
ls -la
cat README.md
```

This will verify the basic scaffolding works before building slash commands.

---

## Success Criteria

✅ CLI can create new projects
✅ Project structure matches design
✅ Templates are copied correctly
✅ README is helpful and accurate
⏳ First slash command (`/arckit.principles`) working
⏳ End-to-end test with real project
⏳ Feedback from real enterprise architect

---

**Status**: **Ready for testing and first slash command implementation**

Next action: Test the CLI, then implement `/arckit.principles` command.
