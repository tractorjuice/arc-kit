# ArcKit v0.3.3 Release Notes

**Release Date:** 2025-10-21
**Release Type:** Minor Release (Features + Bug Fixes + Documentation)
**Previous Version:** v0.3.2

---

## 🚀 New Features

### 1. Internet Research Command

**New Command**: `/arckit.research`

Added comprehensive technology research capabilities with dynamic category detection:

- **Automatic Category Detection**: Intelligently identifies research type (language, framework, standard, tool, service, etc.)
- **Multi-Source Research**: Fetches information from official docs, GitHub, technical blogs, and community resources
- **Structured Output**: Generates comprehensive markdown reports with:
  - Executive summary
  - Technical specifications
  - Use cases and adoption
  - Pros/cons analysis
  - Integration considerations
  - Alternative comparisons
  - Recommendations

**Example:**
```bash
/arckit.research Research FastAPI for building REST APIs
/arckit.research Research PCI-DSS 4.0 compliance requirements
/arckit.research Research AWS Lambda vs Azure Functions
```

### 2. Enhanced Bash Scripts

**Phase 3 Enhancements** (Tasks 3.1-3.5):
- Improved error handling and validation
- Better prerequisite checking
- Enhanced user feedback and progress indicators
- Standardized script structure across all `.arckit/scripts/bash/*.sh` files

---

## 🔧 Bug Fixes & Improvements

### Token Limit Handling

**Issue**: Large commands (HLD/DLD review, diagram, traceability) were hitting 32K token output limits on Claude Code Free plan.

**Solutions Implemented**:

1. **Write Tool Strategy**: High-risk commands now use Write tool instead of streaming output, bypassing token limits
2. **Documentation**: Added comprehensive token limit guide to all affected commands
3. **Environment Variable**: Added `CLAUDE_CODE_MAX_OUTPUT_TOKENS` support for Team/Enterprise plans (100K tokens)

**Commands Updated**:
- `/arckit.hld-review` - Write tool strategy
- `/arckit.dld-review` - Write tool strategy
- `/arckit.diagram` - Write tool strategy
- `/arckit.traceability` - Write tool strategy
- `/arckit.analyze` - Write tool strategy

### Command Flow Improvements

- **`/arckit.principles`**: Now recommends `/arckit.stakeholders` as next step (technology-agnostic)
- **`/arckit.requirements`**: Now recommends correct next steps based on workflow

### Codespaces Integration

- Auto-install Claude Code CLI in GitHub Codespaces for seamless development experience
- Automatic setup of dependencies and environment

---

## 📚 Documentation

### Token Limit Documentation

Added comprehensive documentation explaining:
- Claude Code token limits (Free: 32K, Team/Enterprise: 100K)
- Impact on large document generation
- Solutions and workarounds
- Environment variable configuration

### Version Synchronization

- Established VERSION file as single source of truth
- Synchronized version across all package files

### Research Command Documentation

- Added complete guide in `docs/guides/research.md`
- Usage examples for different research scenarios
- Integration with other ArcKit commands

---

## 🔄 Workflow Updates

Updated command ordering in documentation:
1. `/arckit.principles` - Architecture foundation (technology-agnostic)
2. `/arckit.stakeholders` - Stakeholder analysis
3. `/arckit.risk` - Risk assessment
4. `/arckit.sobc` - Business case
5. `/arckit.requirements` - Requirements definition
...

---

## 🚀 Installation

```bash
# Install with pip
pip install git+https://github.com/tractorjuice/arc-kit.git@v0.3.3

# Or with uv
uv tool install arckit-cli --from git+https://github.com/tractorjuice/arc-kit.git@v0.3.3
```

---

## 📝 What's Included

### Added (v0.3.3)
- `/arckit.research` command for technology research
- Token limit documentation and solutions
- Enhanced bash scripts with better error handling
- Codespaces auto-setup
- VERSION file as single source of truth

### Fixed (v0.3.3)
- Token limit issues on large document generation (Write tool strategy)
- Command flow recommendations (principles → stakeholders)
- Requirements command next step suggestions
- Command ordering in documentation

### Improved (v0.3.3)
- Bash script error handling and validation
- User feedback and progress indicators
- Documentation consistency
- Version synchronization

---

## 📊 Command Count

**Total Commands**: 21
- Project Planning: 1
- Governance: 1
- Stakeholder & Risk: 2
- Business Case: 1
- Requirements: 1
- Data Modeling: 1
- Strategic Planning: 1
- Vendor Selection: 3
- Design Reviews: 2
- Compliance: 5
- Analysis & Visualization: 4
- Research: 1

---

## 🔜 What's Next

**v0.3.4**: Installation bug fixes and UI implementation plan

**v0.4.0 (Q1 2025)**: Web UI Phase 1
- Next.js + FastAPI foundation
- Project views and navigation
- Markdown viewer

---

## 📊 Version Summary

| Component | Change |
|-----------|--------|
| **Research Command** | Added - Internet research with category detection |
| **Token Limits** | Fixed - Write tool strategy for large outputs |
| **Bash Scripts** | Enhanced - Better error handling |
| **Codespaces** | Added - Auto-setup support |
| **Documentation** | Improved - Token limits, workflow updates |
| **Breaking Changes** | None |
| **Migration Required** | No |

---

## 🔗 Resources

- **GitHub Repository**: https://github.com/tractorjuice/arc-kit
- **Issues**: https://github.com/tractorjuice/arc-kit/issues
- **Research Guide**: `docs/guides/research.md`
- **Changelog**: `CHANGELOG.md`

---

**Built with ❤️ for enterprise architects who want systematic, AI-assisted governance.**
