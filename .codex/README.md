# Using ArcKit with OpenAI Codex CLI

This directory contains ArcKit slash commands adapted for [OpenAI Codex CLI](https://chatgpt.com/features/codex).

## Prerequisites

1. **ChatGPT Plan**: Codex CLI is included with ChatGPT Plus, Pro, Business, Edu, or Enterprise plans
2. **Codex CLI installed**: Follow [installation instructions](https://developers.openai.com/codex/cli/)
3. **Git repository**: ArcKit works best in a git repository

## Setup

### Option 1: Project-Specific Commands (Recommended)

Set the `CODEX_HOME` environment variable to use this project's `.codex` directory:

```bash
# Add to your shell profile (~/.zshrc, ~/.bashrc, etc.)
export CODEX_HOME="/path/to/your/project/.codex"

# Or set it per-session
cd /path/to/your/project
export CODEX_HOME="$(pwd)/.codex"

# Start Codex CLI
codex
```

### Option 2: Global Commands

Copy commands to your global Codex prompts directory:

```bash
# Copy all ArcKit commands to global location
cp .codex/prompts/*.md ~/.codex/prompts/

# Start Codex CLI from your project directory
codex
```

## Command Invocation

Codex CLI uses the format `/prompts:command-name` to invoke custom commands.

**ArcKit commands:**

```bash
# Phase 1: Establish Governance
/prompts:arckit.principles Create architecture principles for financial services

# Phase 2: Stakeholder Analysis (NEW - v0.2.1)
/prompts:arckit.stakeholders Analyze stakeholders for cloud migration project

# Phase 3: Define Requirements
/prompts:arckit.requirements Create requirements for payment gateway modernization

# Phase 4: Vendor Selection
/prompts:arckit.sow Generate RFP statement of work
/prompts:arckit.evaluate Score vendors against requirements

# Phase 5: Design Reviews
/prompts:arckit.hld-review Review high-level design for scalability
/prompts:arckit.dld-review Review detailed design for security

# Phase 6: Compliance & Security
/prompts:arckit.secure UK Government Secure by Design review
/prompts:arckit.mod-secure MOD Secure by Design review
/prompts:arckit.tcop Technology Code of Practice assessment
/prompts:arckit.atrs AI Transparency Risk Standards assessment
/prompts:arckit.ai-playbook AI Playbook compliance check

# Phase 7: Analysis & Visualization
/prompts:arckit.analyze Analyze architecture for complexity
/prompts:arckit.diagram Generate architecture diagrams
/prompts:arckit.wardley Create Wardley map for digital services
/prompts:arckit.traceability Generate traceability matrix
/prompts:arckit.servicenow Export architecture to ServiceNow CMDB
```

## Workflow

### 1. Architecture Principles (Foundation)

```bash
/prompts:arckit.principles Create cloud-first principles for our organization
```

Creates: `.arckit/memory/architecture-principles.md`

### 2. Stakeholder Analysis (Before Requirements!)

```bash
/prompts:arckit.stakeholders Analyze stakeholders for cloud migration where CFO wants cost savings, CTO wants innovation, and Operations is worried about downtime
```

Creates: `projects/001-project-name/stakeholder-drivers.md`

**Key output:**
- Power-Interest Grid
- Driver → Goal → Outcome traceability
- Conflict analysis and resolutions
- RACI matrix

### 3. Requirements (Informed by Stakeholders)

```bash
/prompts:arckit.requirements Create requirements for the cloud migration project
```

Creates: `projects/001-project-name/requirements.md`

**Automatically traces back to stakeholder goals:**
- Example: "BR-001 addresses CFO's goal G-1: Reduce infrastructure costs 40%"
- Documents requirement conflicts and resolutions

### 4. Vendor RFP

```bash
/prompts:arckit.sow Generate statement of work for cloud migration RFP
```

Creates: `projects/001-project-name/sow.md`

### 5. Design Reviews

```bash
/prompts:arckit.hld-review Review the high-level design for our microservices architecture
```

Creates: `projects/001-project-name/hld-review-YYYYMMDD.md`

## Approval Modes

Codex CLI has different approval modes that affect how ArcKit commands work:

### Auto Mode (Recommended)

```bash
codex --auto
```

- Automatically executes bash scripts (`.arckit/scripts/bash/*.sh`)
- Auto-creates files in workspace
- Requires approval for network access or operations outside workspace

### Read Only Mode

```bash
codex --read-only
```

- Good for reviewing plans before making changes
- Won't execute scripts or create files automatically

### Full Access Mode (Use with Caution)

```bash
codex --auto --network
```

- Allows network access without approval
- Use only when needed (e.g., fetching remote templates)

## Differences from Claude Code

| Feature | Claude Code | Codex CLI |
|---------|-------------|-----------|
| **Command format** | `/arckit.principles` | `/prompts:arckit.principles` |
| **Command location** | `.claude/commands/` | `.codex/prompts/` |
| **Environment variable** | N/A | `CODEX_HOME` |
| **Approval modes** | Automatic | `--auto`, `--read-only`, `--network` |
| **Bash scripts** | ✅ Automatic | ✅ With approval (or `--auto`) |
| **File access** | ✅ Full workspace | ✅ Sandboxed to workspace |

## File Structure

```
your-project/
├── .codex/
│   ├── README.md (this file)
│   └── prompts/
│       ├── arckit.principles.md
│       ├── arckit.stakeholders.md
│       ├── arckit.requirements.md
│       ├── arckit.sow.md
│       ├── arckit.hld-review.md
│       ├── arckit.dld-review.md
│       ├── arckit.evaluate.md
│       ├── arckit.secure.md
│       ├── arckit.mod-secure.md
│       ├── arckit.tcop.md
│       ├── arckit.atrs.md
│       ├── arckit.ai-playbook.md
│       ├── arckit.analyze.md
│       ├── arckit.diagram.md
│       ├── arckit.wardley.md
│       ├── arckit.traceability.md
│       └── arckit.servicenow.md
├── .arckit/
│   ├── memory/
│   │   └── architecture-principles.md
│   ├── scripts/
│   │   └── bash/
│   │       └── create-project.sh
│   └── templates/
│       ├── architecture-principles-template.md
│       ├── stakeholder-drivers-template.md
│       ├── requirements-template.md
│       ├── sow-template.md
│       └── (other templates)
└── projects/
    └── 001-project-name/
        ├── stakeholder-drivers.md
        ├── requirements.md
        ├── sow.md
        └── (other artifacts)
```

## Troubleshooting

### Commands Not Found

If `/prompts:arckit.principles` doesn't work:

1. **Check CODEX_HOME** is set correctly:
   ```bash
   echo $CODEX_HOME
   # Should show /path/to/your/project/.codex
   ```

2. **Verify files exist**:
   ```bash
   ls -la $CODEX_HOME/prompts/
   # Should show arckit.*.md files
   ```

3. **Restart Codex**:
   ```bash
   # Exit and restart codex CLI
   exit
   codex
   ```

4. **Use global location** as fallback:
   ```bash
   cp .codex/prompts/*.md ~/.codex/prompts/
   ```

### Bash Scripts Require Approval

If Codex keeps asking for approval to run `.arckit/scripts/bash/*.sh`:

```bash
# Start Codex in auto mode
codex --auto
```

### Permission Denied Errors

Ensure bash scripts are executable:

```bash
chmod +x .arckit/scripts/bash/*.sh
```

## Version

ArcKit v0.2.1 (17 commands)

**What's New in v0.2.1:**
- ✨ Added `/prompts:arckit.stakeholders` command for stakeholder driver analysis
- 🔄 Updated requirements workflow to prioritize stakeholder analysis
- 🤝 Added conflict resolution framework for competing stakeholder drivers
- 📊 Enhanced traceability: requirements now trace back to stakeholder goals

## Support

- **Documentation**: See main [ArcKit README](../README.md)
- **Issues**: Report Codex-specific issues with `[Codex]` prefix
- **Workflow Guide**: See `.arckit/templates/` for template examples

## Comparison: ChatGPT Plus vs API

| Aspect | ChatGPT Plus + Codex CLI | OpenAI API (Custom Build) |
|--------|--------------------------|---------------------------|
| **Cost** | $20/month (unlimited) | ~$3-5 per project |
| **Setup** | Install CLI, set CODEX_HOME | Build custom CLI tool |
| **UX** | Native terminal experience | Programmatic control |
| **File Access** | ✅ Built-in | ❌ Must implement |
| **Bash Scripts** | ✅ Built-in | ❌ Must implement |
| **Best for** | Enterprise architects, individual users | CI/CD, automation, custom workflows |

**Recommendation**: Use Codex CLI for manual governance workflows. Use OpenAI API for automated compliance checks in CI/CD pipelines.

## Next Steps

1. **Set CODEX_HOME**: `export CODEX_HOME="$(pwd)/.codex"`
2. **Start Codex**: `codex --auto`
3. **Create principles**: `/prompts:arckit.principles Create cloud-first principles`
4. **Analyze stakeholders**: `/prompts:arckit.stakeholders <your project description>`
5. **Define requirements**: `/prompts:arckit.requirements <your project description>`

---

**Happy architecting with ArcKit + Codex CLI!** 🏗️✨
