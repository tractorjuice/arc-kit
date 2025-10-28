# ArcKit Bash Scripts

<p align="center">
  <img src="../docs/assets/ArcKit_Logo_Horizontal_Dark.svg" alt="ArcKit" height="32">
</p>

This directory contains bash scripts for ArcKit project management and automation.

## Overview

ArcKit provides a set of bash scripts to support enterprise architecture governance workflows. These scripts help with project creation, validation, and management tasks.

## Available Scripts

### 1. common.sh

**Purpose**: Shared utility functions for all ArcKit scripts

**Key Functions**:

**Logging**:
- `log_info()` - Blue info messages
- `log_success()` - Green success messages
- `log_warning()` - Yellow warning messages
- `log_error()` - Red error messages

**Repository Management**:
- `find_repo_root()` - Find ArcKit repository root (.arckit directory)
- `get_repo_root()` - Get repository root using git or .arckit
- `get_next_project_number()` - Get next project number (001, 002, etc.)
- `create_project_dir()` - Create project directory structure

**Git Integration**:
- `has_git()` - Check if git is available
- `get_current_branch()` - Get current git branch
- `check_git_clean()` - Check if working directory is clean

**Project Finding**:
- `find_project_dir_by_prefix()` - Find project by number or name prefix
- `list_projects()` - List all available projects
- `get_project_number_from_dir()` - Extract project number from directory name

**Validation Helpers**:
- `check_file()` - Check if file exists and print status
- `check_dir()` - Check if directory exists and is not empty
- `require_file()` - Require file to exist (exit if not)
- `require_dir()` - Require directory to exist (exit if not)

**JSON Helpers**:
- `json_escape()` - Escape string for JSON
- `output_json_array()` - Output bash array as JSON array
- `is_json_mode()` - Check if running in JSON mode

**Path Helpers**:
- `get_arckit_dir()` - Get .arckit directory path
- `get_projects_dir()` - Get projects directory path
- `get_memory_dir()` - Get memory directory path
- `get_templates_dir()` - Get templates directory path

**Utilities**:
- `slugify()` - Convert string to kebab-case
- `output_json()` - Output project JSON for AI agents

### 2. check-prerequisites.sh

**Purpose**: Validate environment and check for required files

**Usage**:
```bash
./check-prerequisites.sh [OPTIONS]
```

**Options**:
- `--json` - Output in JSON format
- `--project <prefix>` - Specify project by number or name prefix
- `--require-file <file>` - Require specific file to exist (can be used multiple times)
- `--paths-only` - Only output path variables (no validation)
- `--list-projects` - List all available projects
- `--help, -h` - Show help message

**Examples**:
```bash
# Check prerequisites in JSON mode
./check-prerequisites.sh --json

# Find project by prefix
./check-prerequisites.sh --project "payment"

# Require specific files
./check-prerequisites.sh --project "001" --require-file "requirements.md"

# List all projects
./check-prerequisites.sh --list-projects

# Get environment paths only
./check-prerequisites.sh --paths-only
```

**JSON Output Format**:
```json
{
  "REPO_ROOT": "/workspaces/arc-kit",
  "ARCKIT_DIR": "/workspaces/arc-kit/.arckit",
  "PROJECTS_DIR": "/workspaces/arc-kit/projects",
  "MEMORY_DIR": "/workspaces/arc-kit/memory",
  "TEMPLATES_DIR": "/workspaces/arc-kit/templates",
  "PROJECT_DIR": "/workspaces/arc-kit/projects/001-payment-gateway",
  "PROJECT_NUMBER": "001",
  "AVAILABLE_DOCS": [
    "stakeholder-drivers.md",
    "risk-register.md",
    "requirements.md"
  ]
}
```

**Detected Artifacts**:
- stakeholder-drivers.md
- risk-register.md
- sobc.md
- requirements.md
- data-model.md
- research-findings.md
- sow.md
- evaluation-criteria.md
- traceability-matrix.md
- servicenow-design.md
- wardley-maps/ (directory)
- vendors/ (directory)

### 3. create-project.sh

**Purpose**: Create a new ArcKit project with proper structure

**Usage**:
```bash
./create-project.sh [OPTIONS]
```

**Options**:
- `--name "PROJECT_NAME"` - Name of the project (optional - will prompt if not provided)
- `--json` - Output JSON for AI agent consumption
- `--force` - Skip prerequisites check (not recommended)
- `--help, -h` - Show help message

**Examples**:
```bash
# Create project with name
./create-project.sh --name "Payment Gateway Modernization"

# Interactive mode (prompts for name)
./create-project.sh

# JSON mode for AI agents
./create-project.sh --name "M365 Integration" --json

# Force creation without prerequisites
./create-project.sh --name "Test Project" --force
```

**Prerequisites**:
- Must have `templates/architecture-principles.md` file
- Use `--force` to skip this check

**What It Creates**:
- Project directory: `projects/NNN-project-name/`
- Subdirectories: `vendors/`, `final/`
- Placeholder files: `requirements.md`, `sow.md`, `evaluation-criteria.md`, `traceability-matrix.md`
- Project README with status checklist

**JSON Output Format**:
```json
{
  "success": true,
  "project_dir": "/workspaces/arc-kit/projects/001-payment-gateway",
  "project_number": "001",
  "project_name": "Payment Gateway Modernization",
  "requirements_file": "/workspaces/arc-kit/projects/001-payment-gateway/requirements.md",
  "sow_file": "/workspaces/arc-kit/projects/001-payment-gateway/sow.md",
  "evaluation_file": "/workspaces/arc-kit/projects/001-payment-gateway/evaluation-criteria.md",
  "vendors_dir": "/workspaces/arc-kit/projects/001-payment-gateway/vendors",
  "traceability_file": "/workspaces/arc-kit/projects/001-payment-gateway/traceability-matrix.md",
  "next_steps": [
    "/arckit.stakeholders - Analyze stakeholder drivers and goals"
  ]
}
```

**Smart Next Steps**:
The script automatically determines the next steps based on what artifacts exist:
1. /arckit.stakeholders (if stakeholder-drivers.md missing)
2. /arckit.risk (if risk-register.md missing)
3. /arckit.sobc (if sobc.md missing)
4. /arckit.requirements (if requirements.md missing)
5. /arckit.data-model (if data-model.md missing)
6. /arckit.research or /arckit.wardley (if wardley-maps/ missing)
7. /arckit.sow (if sow.md missing)
8. /arckit.evaluate (if all above complete)

### 4. list-projects.sh

**Purpose**: List all projects with status indicators

**Usage**:
```bash
./list-projects.sh [OPTIONS]
```

**Options**:
- `--json` - Output in JSON format
- `--verbose, -v` - Show detailed artifact status
- `--help, -h` - Show help message

**Examples**:
```bash
# List all projects
./list-projects.sh

# List with detailed artifact status
./list-projects.sh --verbose

# Output in JSON format
./list-projects.sh --json
```

**Text Output**:
```
ArcKit Projects
===============

Repository: /workspaces/arc-kit
Projects found: 3

🟢 [001] payment-gateway-modernization (87% complete)
🟡 [002] m365-integration (62% complete)
🔴 [003] digital-transformation (12% complete)
```

**Verbose Output**:
```
🟢 [001] payment-gateway-modernization (87% complete)
    Path: /workspaces/arc-kit/projects/001-payment-gateway-modernization
    Artifacts:
      ✓ Stakeholder Drivers
      ✓ Risk Register
      ✓ Strategic Outline Business Case
      ✓ Requirements
      ✓ Data Model
      ✓ Research Findings
      ✓ Wardley Maps
      ✓ Statement of Work
      ✗ Evaluation Criteria
      ✓ Vendor Proposals (3)
```

**Status Legend**:
- ✅ Complete (100%)
- 🟢 Mostly complete (75-99%)
- 🟡 In progress (50-74%)
- 🟠 Started (25-49%)
- 🔴 Not started (0-24%)

**JSON Output Format**:
```json
{
  "repository_root": "/workspaces/arc-kit",
  "projects_dir": "/workspaces/arc-kit/projects",
  "project_count": 3,
  "projects": [
    {
      "name": "001-payment-gateway-modernization",
      "number": "001",
      "path": "/workspaces/arc-kit/projects/001-payment-gateway-modernization",
      "completion_percentage": 87,
      "vendor_count": 3,
      "artifacts": {
        "stakeholder_drivers": true,
        "risk_register": true,
        "sobc": true,
        "requirements": true,
        "data_model": true,
        "research_findings": true,
        "wardley_maps": true,
        "sow": true,
        "evaluation_criteria": false,
        "vendors": true
      }
    }
  ]
}
```

**Completion Calculation**:
The completion percentage is based on 10 standard artifacts:
1. Stakeholder Drivers (stakeholder-drivers.md)
2. Risk Register (risk-register.md)
3. Strategic Outline Business Case (sobc.md)
4. Requirements (requirements.md)
5. Data Model (data-model.md)
6. Research Findings (research-findings.md)
7. Wardley Maps (wardley-maps/)
8. Statement of Work (sow.md)
9. Evaluation Criteria (evaluation-criteria.md)
10. Vendor Proposals (vendors/)

### 5. converter.py

**Purpose**: Convert Claude Code commands to Gemini CLI TOML format

**Usage**:
```bash
python scripts/converter.py
```

**Description**:

Automatically converts all Claude Code slash commands from `.claude/commands/*.md` format to Gemini CLI `.gemini/commands/arckit/*.toml` format.

**Key Features**:
- Extracts YAML frontmatter from Claude markdown commands
- Converts `description` field to TOML format
- Replaces `$ARGUMENTS` with `{{args}}` for Gemini syntax
- Creates `.gemini/commands/arckit/` directory if needed
- Processes all `.md` files in `.claude/commands/`

**Conversion Process**:
1. Reads each `.claude/commands/arckit.*.md` file
2. Extracts frontmatter description
3. Converts prompt body
4. Writes to `.gemini/commands/arckit/*.toml`

**Example**:
```bash
# From repository root
python scripts/converter.py

# Output:
# Converted .claude/commands/arckit.plan.md to .gemini/commands/arckit/plan.toml
# Converted .claude/commands/arckit.principles.md to .gemini/commands/arckit/principles.toml
# ... (25 commands total)
```

**Use Cases**:
- After adding new Claude commands
- After updating existing Claude command descriptions
- Setting up Gemini CLI for the first time
- Syncing changes from Claude to Gemini

**Requirements**:
- Python 3.6+
- No external dependencies (uses standard library only)

**Related**:
- Claude commands: `.claude/commands/`
- Gemini commands: `.gemini/commands/arckit/`
- See RELEASE-v0.3.6.md for Gemini CLI setup

---

## Developer Guide

### Prerequisites

- Bash 4.0 or higher
- Git (optional but recommended)
- Standard Unix utilities (sed, awk, find, etc.)

### Testing Scripts Locally

```bash
# Navigate to arc-kit repository
cd /path/to/arc-kit

# Test check-prerequisites.sh
./scripts/bash/check-prerequisites.sh --paths-only
./scripts/bash/check-prerequisites.sh --list-projects
./scripts/bash/check-prerequisites.sh --json

# Test list-projects.sh
./scripts/bash/list-projects.sh
./scripts/bash/list-projects.sh --verbose
./scripts/bash/list-projects.sh --json

# Test create-project.sh
./scripts/bash/create-project.sh --name "Test Project" --json
```

### Error Handling

All scripts use `set -e` (exit on error) and `set -u` (error on undefined variables) for safety.

**Common Exit Codes**:
- `0` - Success
- `1` - General error (missing files, validation failed, etc.)

**Error Messages**:
All errors are logged to stderr using `log_error()` function with red [ERROR] prefix.

### Sourcing common.sh

All scripts source common.sh for shared utilities:

```bash
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/common.sh"
```

This ensures common.sh is always found relative to the script location.

### JSON Mode

Scripts support JSON mode for AI agent consumption:

```bash
# Enable JSON mode
JSON_MODE=true

# Check if in JSON mode
if is_json_mode; then
    echo '{"status": "success"}'
else
    log_success "Operation complete"
fi
```

### Adding New Scripts

When creating new bash scripts:

1. **Use common.sh**: Source it for shared utilities
2. **Add help**: Implement `--help` flag with usage examples
3. **Support JSON**: Add `--json` flag for AI agents
4. **Error handling**: Use `set -e` and proper error messages
5. **Make executable**: `chmod +x your-script.sh`
6. **Document**: Update this README

**Template**:
```bash
#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/common.sh"

# Parse arguments
JSON_MODE=false

while [[ $# -gt 0 ]]; do
    case "$1" in
        --json)
            JSON_MODE=true
            shift
            ;;
        --help|-h)
            cat << 'EOF'
Usage: your-script.sh [OPTIONS]

Description of your script.

OPTIONS:
  --json       Output in JSON format
  --help, -h   Show this help message

EXAMPLES:
  ./your-script.sh
  ./your-script.sh --json

EOF
            exit 0
            ;;
        *)
            log_error "Unknown option: $1"
            exit 1
            ;;
    esac
done

# Your script logic here
```

## CI/CD Integration

These scripts are designed for both human use and CI/CD automation:

### GitHub Actions Example

```yaml
- name: Check Prerequisites
  run: |
    cd arc-kit
    ./scripts/bash/check-prerequisites.sh --json > prerequisites.json

- name: List Projects
  run: |
    cd arc-kit
    ./scripts/bash/list-projects.sh --json > projects.json
```

### AI Agent Integration

Scripts provide JSON output for AI agents:

```python
import subprocess
import json

# Check prerequisites
result = subprocess.run(
    ["./scripts/bash/check-prerequisites.sh", "--json"],
    capture_output=True,
    text=True
)
data = json.loads(result.stdout)
print(f"Projects found: {len(data['AVAILABLE_DOCS'])}")

# List projects
result = subprocess.run(
    ["./scripts/bash/list-projects.sh", "--json"],
    capture_output=True,
    text=True
)
projects = json.loads(result.stdout)
print(f"Total projects: {projects['project_count']}")
```

## Platform Support

**Tested Platforms**:
- ✅ Linux (Ubuntu, Debian, RHEL, etc.)
- ✅ macOS
- ⚠️ Windows (WSL2 or Git Bash required)

**Requirements**:
- Bash 4.0+
- Standard Unix utilities
- Git (optional)

## Troubleshooting

### "Not in an ArcKit project" Error

**Problem**: Script can't find .arckit directory

**Solution**:
```bash
# Ensure you're in an ArcKit project
cd /path/to/your/arc-kit-project

# Or run /arckit.init to initialize
```

### "Prerequisites not met" Error

**Problem**: create-project.sh requires architecture-principles.md

**Solution**:
```bash
# Run /arckit.principles first
# Or use --force flag (not recommended)
./scripts/bash/create-project.sh --name "My Project" --force
```

### "No projects found" Message

**Problem**: list-projects.sh shows no projects

**Solution**:
```bash
# Create a project first
./scripts/bash/create-project.sh --name "My First Project"

# Or check if projects directory exists
ls -la projects/
```

## Version History

- **v0.3.2** (2025-01-XX)
  - Added check-prerequisites.sh for environment validation
  - Enhanced common.sh with 239 lines of new functionality
  - Updated create-project.sh with prerequisites check and interactive mode
  - Added list-projects.sh for project status tracking
  - Added comprehensive JSON output for AI agents

- **v0.2.x** (2024-XX-XX)
  - Initial bash scripts (create-project.sh, common.sh)

## Contributing

When contributing to bash scripts:

1. Follow existing code style
2. Add comprehensive help text
3. Support both text and JSON output
4. Test on Linux and macOS
5. Update this README
6. Add examples to help text

## License

MIT License - See LICENSE file in repository root
