# ArcKit v0.1.0 - Enterprise Architecture Governance & Vendor Procurement Toolkit

Initial MVP release of ArcKit with complete enterprise architecture lifecycle support.

## 🎉 What's New

### Complete Command Suite
ArcKit provides 7 slash commands for Claude Code that cover the entire enterprise architecture lifecycle:

- **`/arckit.principles`** - Create enterprise architecture governance principles
- **`/arckit.requirements`** - Define comprehensive business and technical requirements
- **`/arckit.sow`** - Generate Statement of Work / RFP documents
- **`/arckit.evaluate`** - Vendor evaluation framework and proposal scoring
- **`/arckit.hld-review`** - High-Level Design review gate
- **`/arckit.dld-review`** - Detailed Design review gate
- **`/arckit.traceability`** - Requirements traceability matrix

### Comprehensive Templates
8 production-ready templates (4,800+ lines total):

- Architecture principles template (600 lines)
- Requirements template (700 lines) - BR, FR, NFR, INT, DR
- Statement of Work / RFP template (850 lines)
- Vendor evaluation criteria template (600 lines)
- HLD review template (900 lines)
- DLD review template (400 lines)
- Vendor scoring template (300 lines)
- Traceability matrix template (400 lines)

### CLI Infrastructure
Complete Python CLI for project management:

- Project initialization and scaffolding
- Template and script management
- Multi-agent AI support (Claude Code, OpenAI Codex CLI, Gemini CLI)
- Git integration
- Rich terminal UI

### Industry-Specific Support
Built-in customization for regulated industries:

- **Financial Services** - PCI-DSS, SOX compliance, audit trails
- **Healthcare** - HIPAA, PHI data handling, consent management
- **Retail** - Payment processing, customer data privacy
- **Government** - Section 508 accessibility, security clearances

## 📦 Installation

```bash
# Install with pip
pip install git+https://github.com/tractorjuice/arc-kit.git

# Or with uv
uv tool install arckit-cli --from git+https://github.com/tractorjuice/arc-kit.git
```

## 🚀 Quick Start

```bash
# Initialize a new architecture project
arckit init my-enterprise-project --ai claude
cd my-enterprise-project

# Start Claude Code
claude

# Run the complete workflow
/arckit.principles Create principles for financial services
/arckit.requirements Define payment gateway requirements
/arckit.sow Generate RFP for vendor selection
/arckit.evaluate Score vendor proposals
/arckit.hld-review Review architecture design
/arckit.dld-review Review technical implementation
/arckit.traceability Verify all requirements met
```

## 📖 Documentation

- [README](https://github.com/tractorjuice/arc-kit/blob/main/README.md) - Overview and quick start
- [Commands Reference](https://github.com/tractorjuice/arc-kit/blob/main/.claude/COMMANDS.md) - Complete command documentation
- [Setup Guide](https://github.com/tractorjuice/arc-kit/blob/main/SETUP.md) - Installation and configuration

## 🎯 Use Cases

### 1. Enterprise Architecture Governance
- Establish architecture principles for your organization
- Enforce compliance through automated reviews
- Maintain consistency across all projects

### 2. Vendor RFP & Selection
- Generate comprehensive RFP documents
- Objective vendor evaluation with scoring
- Side-by-side vendor comparison

### 3. Design Review Gates
- HLD review before implementation (architecture gate)
- DLD review before coding (technical gate)
- Prevent costly mistakes early

### 4. Compliance & Traceability
- Requirements traceability for audits (FDA, ISO, automotive)
- Gap analysis for go/no-go decisions
- Coverage metrics by requirement type

## 📊 What's Included

- **7 slash commands** for complete architecture lifecycle (1,300+ lines)
- **8 templates** covering principles to traceability (4,800+ lines)
- **Bash automation scripts** for project management
- **Multi-agent support** (Claude Code, OpenAI Codex CLI, Gemini CLI)
- **Industry customization** (financial, healthcare, retail, government)
- **CLI infrastructure** with Python/typer

## 🔧 Technical Details

- **Language**: Python 3.11+
- **Dependencies**: typer, rich, httpx
- **CLI Framework**: typer with rich terminal UI
- **AI Agents**: Claude Code (primary), OpenAI Codex CLI, Gemini CLI
- **License**: MIT

## 🎓 Example Workflow

```
1. /arckit.principles → Establish governance
   ↓
2. /arckit.requirements → Define what you need
   ↓
3. /arckit.sow → Create RFP for vendors
   ↓
4. /arckit.evaluate → Score vendor proposals
   ↓
5. /arckit.hld-review → Review architecture
   ↓
6. /arckit.dld-review → Review technical details
   ↓
7. Implementation happens
   ↓
8. /arckit.traceability → Verify requirements met
   ↓
9. Release! 🚀
```

## 🙏 Credits

Built with [Claude Code](https://claude.com/claude-code) - AI-assisted software development.

## 🐛 Known Issues

None reported yet! Please file issues at: https://github.com/tractorjuice/arc-kit/issues

## 🔮 What's Next (v0.2.0)

Planned features for next release:
- Real-world validation with enterprise architects
- Video walkthrough and tutorials
- Additional helper commands (`/arckit.compare`, `/arckit.report`)
- Additional AI assistant integrations
- Web interface for stakeholder visibility

---

**Full Changelog**: https://github.com/tractorjuice/arc-kit/commits/v0.1.0

🤖 Generated with [Claude Code](https://claude.com/claude-code)
