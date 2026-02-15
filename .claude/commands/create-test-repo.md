---
description: Create a new ArcKit test repo with full scaffolding, auto-detecting the next version number
allowed-tools: Bash, Read, Write, Glob
---

You are creating a new ArcKit test repository on GitHub. Follow these steps exactly.

## Arguments

The user provides: `$ARGUMENTS`

Parse this as: `<project-slug> [description]`

- **project-slug** (required): kebab-case name, e.g. `nhs-digital`
- **description** (optional): short project description. If omitted, derive one from the slug (e.g. `nhs-digital` → "NHS Digital")

If no arguments are provided, ask the user for a project slug.

## Step 1: Auto-detect next version number

Run this Bash command to find the highest existing version number:

```
gh repo list tractorjuice --limit 200 --json name --jq '.[].name' | grep -oP 'arckit-test-project-v\K\d+' | sort -n | tail -1
```

Add 1 to get the next version number. Store it as `NEXT_VERSION`.

## Step 2: Set variables

- `REPO_NAME` = `arckit-test-project-v${NEXT_VERSION}-${project-slug}`
- `REPO_FULL` = `tractorjuice/${REPO_NAME}`
- `VERSION` = read from `/workspaces/arc-kit/VERSION` (trim whitespace)
- `TODAY` = today's date in YYYY-MM-DD format
- `DISPLAY_NAME` = title-case version of project-slug (e.g. `nhs-digital` → `NHS Digital`)

## Step 3: Create GitHub repo

```bash
gh repo create tractorjuice/${REPO_NAME} --public --description "ArcKit test project: ${DISPLAY_NAME}" --clone --clone-dir /tmp/arckit-test-setup/${REPO_NAME}
```

If this fails, stop and report the error.

## Step 4: Scaffold files

Use the **Write** tool to create each file inside `/tmp/arckit-test-setup/${REPO_NAME}/`. Create them in this order:

### 4a. `.claude/settings.json`

```json
{
  "extraKnownMarketplaces": {
    "arc-kit": {
      "source": {
        "source": "github",
        "repo": "tractorjuice/arc-kit"
      }
    }
  },
  "enabledPlugins": {
    "arckit@arc-kit": true
  }
}
```

### 4b. `.devcontainer/devcontainer.json`

```json
{
  "postCreateCommand": "curl -fsSL https://claude.ai/install.sh | bash",
  "remoteEnv": {
    "CLAUDE_CODE_MAX_OUTPUT_TOKENS": "64000"
  }
}
```

### 4c. `projects/000-global/.gitkeep`

Empty file.

### 4d. `docs/guides/.gitkeep`

Empty file.

### 4e. `docs/README.md`

```markdown
# ${DISPLAY_NAME} - Documentation

This project uses **ArcKit v${VERSION}** for enterprise architecture governance.

## Getting Started

Run ArcKit commands using the Claude Code plugin:
- `/arckit.principles` - Define architecture principles
- `/arckit.stakeholders` - Stakeholder analysis
- `/arckit.requirements` - Requirements specification
- `/arckit.sobc` - Strategic Outline Business Case

See the [ArcKit Documentation](https://tractorjuice.github.io/arc-kit/) for the full command reference.

---

*ArcKit v${VERSION} | Generated ${TODAY}*
```

### 4f. `README.md`

```markdown
# ${DISPLAY_NAME}

${DESCRIPTION}

## Overview

This repository uses **ArcKit v${VERSION}** for enterprise architecture governance and documentation.

## Getting Started

### Prerequisites

- [Claude Code](https://claude.ai/code) installed
- GitHub Codespaces (recommended) or local development environment

### Setup

1. Open this repo in a GitHub Codespace (or clone locally)
2. Claude Code will auto-install via `.devcontainer/devcontainer.json`
3. The ArcKit plugin is auto-enabled via `.claude/settings.json`
4. Restart Claude Code once to resolve the marketplace plugin

### First Commands

```bash
# Check ArcKit is working
/arckit.init

# Define architecture principles (if not already done)
/arckit.principles

# Start with stakeholder analysis
/arckit.stakeholders ${DISPLAY_NAME}

# Generate requirements
/arckit.requirements ${DISPLAY_NAME}
```

## Project Structure

```
projects/
├── 000-global/          # Cross-project artifacts (principles, standards)
└── 001-${project-slug}/ # Project-specific artifacts (created by commands)
```

## Available Commands

This project uses the ArcKit plugin which provides 48 slash commands for architecture governance. See the [full command reference](https://tractorjuice.github.io/arc-kit/).

## Links

- [ArcKit Documentation](https://tractorjuice.github.io/arc-kit/)
- [ArcKit Repository](https://github.com/tractorjuice/arc-kit)
- [ArcKit Plugin Marketplace](https://github.com/tractorjuice/arc-kit)
```

### 4g. `CLAUDE.md`

```markdown
# CLAUDE.md

## Project: ${DISPLAY_NAME}

${DESCRIPTION}

## Architecture Toolkit

This project uses the **ArcKit plugin** (v${VERSION}) for enterprise architecture governance. All commands are provided by the plugin — no local command files are needed.

### Key Commands

- `/arckit.principles` - Architecture principles (start here)
- `/arckit.stakeholders` - Stakeholder analysis
- `/arckit.requirements` - Requirements specification
- `/arckit.sobc` - Strategic Outline Business Case
- `/arckit.adr` - Architecture Decision Records
- `/arckit.diagram` - Architecture diagrams (C4, sequence, etc.)

### Project Structure

- `projects/000-global/` - Cross-project artifacts (principles, standards)
- `projects/001-*/` - Numbered project directories with architecture documents
- `docs/` - Documentation and guides

### Document Naming Convention

All documents follow: `ARC-{PROJECT_ID}-{TYPE_CODE}-v{VERSION}.md`
- Example: `ARC-001-REQ-v1.0.md` (Requirements for project 001)
- Multi-instance types (ADR, DIAG): `ARC-001-ADR-001-v1.0.md`
```

### 4h. `CHANGELOG.md`

```markdown
# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

### Added
- Initial project setup with ArcKit v${VERSION}
- Plugin-based architecture governance (via ArcKit marketplace plugin)
- Created ${TODAY}
```

### 4i. `VERSION`

The same version string read from the main repo's `VERSION` file.

### 4j. `DEPENDENCY-MATRIX.md`

Copy the file from `/workspaces/arc-kit/DEPENDENCY-MATRIX.md` using Bash:
```bash
cp /workspaces/arc-kit/DEPENDENCY-MATRIX.md /tmp/arckit-test-setup/${REPO_NAME}/DEPENDENCY-MATRIX.md
```

### 4k. `WORKFLOW-DIAGRAMS.md`

Copy the file from `/workspaces/arc-kit/WORKFLOW-DIAGRAMS.md` using Bash:
```bash
cp /workspaces/arc-kit/WORKFLOW-DIAGRAMS.md /tmp/arckit-test-setup/${REPO_NAME}/WORKFLOW-DIAGRAMS.md
```

## Step 5: Commit and push

```bash
cd /tmp/arckit-test-setup/${REPO_NAME}
git add -A
git commit -m "Initial project setup with ArcKit v${VERSION}

Scaffolded by /create-test-repo command.

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
git push origin main
```

## Step 6: Clean up

```bash
rm -rf /tmp/arckit-test-setup/
```

## Step 7: Report

Output a summary like this:

```
Test repo created successfully!

  Repo:    https://github.com/tractorjuice/arckit-test-project-v${NEXT_VERSION}-${project-slug}
  Version: v${NEXT_VERSION}
  Name:    ${DISPLAY_NAME}
  ArcKit:  v${VERSION}

Files created:
  .claude/settings.json          (plugin marketplace config)
  .devcontainer/devcontainer.json (Claude Code auto-install)
  projects/000-global/.gitkeep   (global artifacts directory)
  docs/README.md                 (documentation index)
  docs/guides/.gitkeep           (guides directory)
  README.md                      (project readme)
  CLAUDE.md                      (Claude Code context)
  CHANGELOG.md                   (changelog)
  VERSION                        (version tracking)
  DEPENDENCY-MATRIX.md           (command dependencies)
  WORKFLOW-DIAGRAMS.md           (workflow diagrams)

Next steps:
  1. Open the repo in a GitHub Codespace
  2. Restart Claude Code to resolve the plugin
  3. Run /arckit.principles to get started
```

## Important Notes

- Always use `--public` for test repos (unless the user specifies `--private`)
- The `/tmp/arckit-test-setup/` directory is temporary — always clean up
- If any step fails, report the error and do NOT continue to subsequent steps
- Do NOT run verification/deletion of the repo — that's up to the user
