# ArcKit v0.3.5 Release Notes

**Release Date:** 2025-10-24
**Release Type:** Minor Release (Multi-AI Support)
**Previous Version:** v0.3.4

---

## 🚀 Major Feature: OpenAI Codex CLI Support

### Full Codex CLI Integration

**New Feature**: Complete support for OpenAI Codex CLI alongside Claude Code

ArcKit now works seamlessly with **two AI systems**:
1. **Claude Code** (Anthropic) - `.claude/commands/`
2. **OpenAI Codex CLI** - `.codex/prompts/`

### What's Included

**1. Codex Commands Directory** (`.codex/prompts/`)
- All 21 ArcKit commands converted to Codex format
- Uses `/prompts:arckit.*` invocation pattern
- Automatic `CODEX_HOME` environment setup

**2. Comprehensive Codex Documentation** (`.codex/README.md`)
- Setup instructions for project-specific and global commands
- Environment variable configuration guide
- Workflow examples for all commands
- Troubleshooting section
- Approval mode explanations (--auto, --read-only, --network)

**3. Automatic CODEX_HOME Setup**
- Environment automatically configured in supported shells
- Works in GitHub Codespaces
- Project-specific command isolation

### Command Format Comparison

| AI System | Command Format | Location |
|-----------|----------------|----------|
| **Claude Code** | `/arckit.principles` | `.claude/commands/` |
| **OpenAI Codex CLI** | `/prompts:arckit.principles` | `.codex/prompts/` |

### Setup Instructions

**Option 1: Project-Specific (Recommended)**
```bash
# Set CODEX_HOME to use project commands
export CODEX_HOME="$(pwd)/.codex"
codex --auto
```

**Option 2: Global Commands**
```bash
# Copy to global Codex directory
cp .codex/prompts/*.md ~/.codex/prompts/
codex
```

---

## 🎯 Benefits of Multi-AI Support

### Choice of AI System

Users can now choose their preferred AI system based on:
- **Subscription**: Claude Code vs ChatGPT Plus/Pro
- **Pricing**: Claude Code plans vs OpenAI plans
- **Features**: System-specific capabilities
- **Workflow**: Terminal experience preferences

### Consistent Functionality

- Same ArcKit workflow across both AI systems
- Identical command outputs and artifacts
- Shared `.arckit/` directory structure
- Compatible with all bash scripts and templates

---

## 📚 Documentation Updates

### New Documentation

**`.codex/README.md`** (comprehensive guide):
- Prerequisites (ChatGPT plan, Codex CLI installation)
- Setup options (project-specific vs global)
- Command invocation patterns
- Complete workflow examples
- Approval mode explanations
- File structure overview
- Troubleshooting guide
- Version history

### Updated Documentation

- Main README now shows both command formats
- Workflow examples for both AI systems
- Installation instructions for both platforms

---

## 🔄 Workflow Example

**Claude Code:**
```bash
/arckit.principles Create cloud-first principles
/arckit.stakeholders Analyze stakeholders for migration project
/arckit.requirements Create requirements for payment gateway
```

**OpenAI Codex CLI:**
```bash
/prompts:arckit.principles Create cloud-first principles
/prompts:arckit.stakeholders Analyze stakeholders for migration project
/prompts:arckit.requirements Create requirements for payment gateway
```

---

## 🚀 Installation

### For Claude Code Users
```bash
# Clone/download repository
git clone https://github.com/tractorjuice/arc-kit.git
cd arc-kit

# Commands available in .claude/commands/
# Use with /arckit.*
```

### For Codex CLI Users
```bash
# Clone/download repository
git clone https://github.com/tractorjuice/arc-kit.git
cd arc-kit

# Set environment
export CODEX_HOME="$(pwd)/.codex"

# Start Codex CLI
codex --auto

# Commands available as /prompts:arckit.*
```

---

## 📝 What's Included

### Added (v0.3.5)
- **`.codex/` directory** with all 21 commands in Codex format
- **`.codex/README.md`** - comprehensive setup and usage guide
- **`.codex/prompts/`** - all ArcKit commands for Codex CLI
- **Automatic CODEX_HOME setup** in supported environments
- **Multi-AI documentation** in main README

### Unchanged
- All CLI functionality identical across both AI systems
- `.arckit/` directory structure remains the same
- `.claude/` commands unchanged
- No breaking changes

---

## 📊 Command Coverage

**All 21 ArcKit Commands Available in Both Systems:**

| Category | Commands | Claude Format | Codex Format |
|----------|----------|---------------|--------------|
| Project Planning | 1 | `/arckit.plan` | `/prompts:arckit.plan` |
| Governance | 1 | `/arckit.principles` | `/prompts:arckit.principles` |
| Stakeholder & Risk | 2 | `/arckit.stakeholders`, `/arckit.risk` | `/prompts:arckit.*` |
| Business Case | 1 | `/arckit.sobc` | `/prompts:arckit.sobc` |
| Requirements | 1 | `/arckit.requirements` | `/prompts:arckit.requirements` |
| Data Modeling | 1 | `/arckit.data-model` | `/prompts:arckit.data-model` |
| Strategic Planning | 1 | `/arckit.wardley` | `/prompts:arckit.wardley` |
| Vendor Selection | 3 | `/arckit.sow`, `/arckit.evaluate`, `/arckit.specify` | `/prompts:arckit.*` |
| Design Reviews | 2 | `/arckit.hld-review`, `/arckit.dld-review` | `/prompts:arckit.*` |
| Compliance | 5 | `/arckit.secure`, `/arckit.tcop`, etc. | `/prompts:arckit.*` |
| Analysis | 4 | `/arckit.analyze`, `/arckit.diagram`, etc. | `/prompts:arckit.*` |
| Research | 1 | `/arckit.research` | `/prompts:arckit.research` |

---

## 🔜 What's Next

**v0.3.6**: Digital Marketplace commands for UK public sector procurement

**v0.4.0 (Q1 2025)**: Third AI system support (Gemini CLI)

**v0.5.0 (Q2 2025)**: Web UI Phase 1

---

## 📊 Version Summary

| Component | Change |
|-----------|--------|
| **Codex CLI Support** | Added - Full integration with OpenAI Codex CLI |
| **Multi-AI** | Added - Choose between Claude Code and Codex CLI |
| **Documentation** | Added - Comprehensive `.codex/README.md` guide |
| **Environment Setup** | Added - Automatic CODEX_HOME configuration |
| **Breaking Changes** | None |
| **Migration Required** | No |

---

## 🔗 Resources

- **GitHub Repository**: https://github.com/tractorjuice/arc-kit
- **Issues**: https://github.com/tractorjuice/arc-kit/issues
- **Codex Setup Guide**: `.codex/README.md`
- **Changelog**: `CHANGELOG.md`

---

## 💡 Comparison: ChatGPT Plus vs API

| Aspect | ChatGPT Plus + Codex CLI | OpenAI API (Custom) |
|--------|--------------------------|---------------------|
| **Cost** | $20/month (unlimited) | ~$3-5 per project |
| **Setup** | Install CLI, set CODEX_HOME | Build custom tool |
| **UX** | Native terminal | Programmatic |
| **File Access** | ✅ Built-in | ❌ Must implement |
| **Best for** | Architects, manual workflows | CI/CD, automation |

---

**Built with ❤️ for enterprise architects who want systematic, AI-assisted governance.**
