# Microsoft Learn MCP Integration Plan

## Executive Summary

**Objective**: Integrate Microsoft Learn Model Context Protocol (MCP) server into ArcKit commands to provide real-time access to official Microsoft documentation, Azure architecture guidance, and code samples.

**Scope**: Update 6 ArcKit commands across 3 AI platforms (Claude Code, Codex CLI, Gemini CLI) to consume Microsoft Learn MCP tools.

**Timeline**: 17 working days (~3.5 weeks)

**Resources**: 1 developer

**Version**: v0.5.0

**Total New Content**: ~3,500-4,500 lines of code and documentation

## Background

### What is MCP?

Model Context Protocol (MCP) is an open protocol created by Anthropic for connecting AI systems to external tools and data sources. It provides:

- **Standardized protocol**: JSON-RPC 2.0 over HTTP
- **Tool discovery**: AI systems can discover available tools
- **Secure execution**: Controlled access to external data
- **Platform support**: Native support in Claude Code, Codex CLI, and Gemini CLI

### Microsoft Learn MCP Server

**Endpoint**: https://learn.microsoft.com/api/mcp

**Available Tools**:

1. **microsoft_docs_search**
   - Semantic search across Microsoft documentation
   - Parameters: query (string), filters (optional)
   - Returns: Relevant documentation pages with summaries

2. **microsoft_docs_fetch**
   - Retrieve full documentation pages as markdown
   - Parameters: url (string)
   - Returns: Complete page content in markdown format

3. **microsoft_code_sample_search**
   - Search official Microsoft code samples
   - Parameters: query (string), language (optional)
   - Returns: Code samples with context and links

### Current Platform Support

| Platform | MCP Support | Configuration Method |
|----------|-------------|---------------------|
| **Claude Code** | ✅ Native | Add to `.claude/mcp-servers.json` |
| **Codex CLI** | ✅ Native | Add to `.codex/config.json` |
| **Gemini CLI** | ✅ Native | Add to `.gemini/mcp-config.json` |

## Architecture Overview

### Integration Approach

**Use native MCP support in each platform** instead of custom HTTP implementation:

1. **User Configuration**: Users add Microsoft Learn MCP to their AI CLI config
2. **Command Prompts**: Update command prompts to use MCP tools when available
3. **Graceful Degradation**: Commands work without MCP (just with reduced functionality)
4. **No Custom Code**: Leverage built-in MCP clients in each platform

### Example: How It Works

**Before (current)**:
```markdown
You are helping create Azure architecture documentation.
Search the web for relevant Azure best practices.
```

**After (with MCP)**:
```markdown
You are helping create Azure architecture documentation.

If microsoft_docs_search tool is available:
1. Use microsoft_docs_search to find relevant Azure documentation
2. Use microsoft_docs_fetch to retrieve full content
3. Use microsoft_code_sample_search for implementation examples

Otherwise, fall back to web search.
```

## Commands to Update

### 1. `/arckit.research` (Priority: HIGH)
**Current**: General technology research with web search
**Enhancement**: Query official Microsoft/Azure docs first
**MCP Tools**: microsoft_docs_search, microsoft_docs_fetch
**Impact**: More accurate, authoritative Azure guidance

### 2. `/arckit.secure` (Priority: HIGH)
**Current**: UK Government Secure by Design review
**Enhancement**: Reference Azure Security Benchmark
**MCP Tools**: microsoft_docs_search (filter: security)
**Impact**: Azure-specific security recommendations

### 3. `/arckit.mod-secure` (Priority: MEDIUM)
**Current**: MOD Secure by Design review
**Enhancement**: Use Azure Government guidance
**MCP Tools**: microsoft_docs_search (filter: government)
**Impact**: Official Azure Government compliance docs

### 4. `/arckit.requirements` (Priority: MEDIUM)
**Current**: Requirements gathering
**Enhancement**: Verify Azure service capabilities
**MCP Tools**: microsoft_docs_search, microsoft_code_sample_search
**Impact**: Requirements aligned with actual Azure capabilities

### 5. `/arckit.data-model` (Priority: LOW)
**Current**: Data modeling with GDPR compliance
**Enhancement**: Query Azure data services docs
**MCP Tools**: microsoft_docs_search (filter: data)
**Impact**: Azure-native data modeling patterns

### 6. `/arckit.diagram` (Priority: LOW)
**Current**: Architecture diagram generation
**Enhancement**: Reference Azure Architecture Center
**MCP Tools**: microsoft_docs_search (filter: architecture)
**Impact**: Diagrams follow Azure reference architectures

## Implementation Plan

### Phase 0: Planning & Preparation (2 days)

**Day -2 to Day 0**: Pre-implementation setup

**Tasks**:
- [ ] Create project branch: `feature/mcp-integration`
- [ ] Set up MCP testing environment
- [ ] Configure Microsoft Learn MCP in all 3 platforms
- [ ] Test MCP connectivity and tool discovery
- [ ] Document MCP setup process

**Deliverables**:
- Working MCP setup in Claude Code, Codex CLI, Gemini CLI
- Setup documentation draft

### Phase 1: Documentation (Week 1, Days 1-3)

**Day 1**: User documentation

**Tasks**:
- [ ] Create `docs/mcp-setup-guide.md`
- [ ] Write setup instructions for Claude Code
- [ ] Write setup instructions for Codex CLI
- [ ] Write setup instructions for Gemini CLI
- [ ] Add troubleshooting section

**Deliverables**:
- `docs/mcp-setup-guide.md` (~500 lines)

**Day 2**: Update platform-specific READMEs

**Tasks**:
- [ ] Update `.claude/README.md` with MCP section
- [ ] Update `.codex/README.md` with MCP section
- [ ] Update `.gemini/README.md` with MCP section
- [ ] Add MCP configuration examples

**Deliverables**:
- 3 updated README files (~300 lines total)

**Day 3**: Update main documentation

**Tasks**:
- [ ] Update main `README.md` with MCP features
- [ ] Update `docs/quickstart.md` with MCP setup
- [ ] Create `docs/mcp-examples.md` with usage examples
- [ ] Update feature matrix in `docs/index.html`

**Deliverables**:
- Updated core documentation (~400 lines)

### Phase 2: Command Updates (Week 1 Day 4 - Week 2 Day 3)

**Template for Each Command**:

```markdown
---
description: [Original description] with Microsoft Learn MCP support
---

# [Command Name]

[Original prompt text]

## Microsoft Learn MCP Integration

If Microsoft Learn MCP tools are available, enhance your output by:

1. **Search Microsoft Documentation**:
   Use `microsoft_docs_search` to find:
   - [Specific search queries for this command]
   - [Filter criteria]

2. **Fetch Full Documentation**:
   Use `microsoft_docs_fetch` to retrieve:
   - [Specific pages to fetch]

3. **Find Code Samples** (if applicable):
   Use `microsoft_code_sample_search` to find:
   - [Language filters]
   - [Sample types]

## Fallback Behavior

If MCP tools are not available:
- [Existing behaviour]
- [Alternative approaches]

[Rest of original prompt]
```

**Day 4**: Update `/arckit.research`

**Tasks**:
- [ ] Update `.claude/commands/arckit.research.md`
- [ ] Update `.codex/prompts/arckit.research.md`
- [ ] Update `.gemini/commands/arckit/research.toml`
- [ ] Add MCP-specific examples
- [ ] Test in all 3 platforms

**Deliverables**:
- 3 updated command files (~600 lines total)

**Day 5**: Update `/arckit.secure`

**Tasks**:
- [ ] Update `.claude/commands/arckit.secure.md`
- [ ] Update `.codex/prompts/arckit.secure.md`
- [ ] Update `.gemini/commands/arckit/secure.toml`
- [ ] Add Azure Security Benchmark queries
- [ ] Test in all 3 platforms

**Deliverables**:
- 3 updated command files (~600 lines total)

**Day 6**: Update `/arckit.mod-secure`

**Tasks**:
- [ ] Update `.claude/commands/arckit.mod-secure.md`
- [ ] Update `.codex/prompts/arckit.mod-secure.md`
- [ ] Update `.gemini/commands/arckit/mod-secure.toml`
- [ ] Add Azure Government queries
- [ ] Test in all 3 platforms

**Deliverables**:
- 3 updated command files (~600 lines total)

**Day 7**: Update `/arckit.requirements`

**Tasks**:
- [ ] Update `.claude/commands/arckit.requirements.md`
- [ ] Update `.codex/prompts/arckit.requirements.md`
- [ ] Update `.gemini/commands/arckit/requirements.toml`
- [ ] Add service capability verification
- [ ] Test in all 3 platforms

**Deliverables**:
- 3 updated command files (~600 lines total)

**Day 8**: Update `/arckit.data-model`

**Tasks**:
- [ ] Update `.claude/commands/arckit.data-model.md`
- [ ] Update `.codex/prompts/arckit.data-model.md`
- [ ] Update `.gemini/commands/arckit/data-model.toml`
- [ ] Add Azure data services queries
- [ ] Test in all 3 platforms

**Deliverables**:
- 3 updated command files (~600 lines total)

**Day 9**: Update `/arckit.diagram`

**Tasks**:
- [ ] Update `.claude/commands/arckit.diagram.md`
- [ ] Update `.codex/prompts/arckit.diagram.md`
- [ ] Update `.gemini/commands/arckit/diagram.toml`
- [ ] Add Azure Architecture Center queries
- [ ] Test in all 3 platforms

**Deliverables**:
- 3 updated command files (~600 lines total)

### Phase 3: Testing & Validation (Week 2 Days 4-5, Week 3 Day 1)

**Day 10**: Functional testing

**Tasks**:
- [ ] Test each command WITH MCP configured
- [ ] Test each command WITHOUT MCP configured
- [ ] Verify graceful degradation
- [ ] Check output quality improvements
- [ ] Document test results

**Test Matrix**:
| Command | Claude (MCP) | Claude (No MCP) | Codex (MCP) | Codex (No MCP) | Gemini (MCP) | Gemini (No MCP) |
|---------|--------------|-----------------|-------------|----------------|--------------|-----------------|
| research | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| secure | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| mod-secure | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| requirements | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| data-model | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| diagram | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |

**Deliverables**:
- Test results document
- Bug fixes as needed

**Day 11**: Integration testing

**Tasks**:
- [ ] Test complete workflow with MCP (plan → research → secure → diagram)
- [ ] Test cross-command data flow
- [ ] Verify all MCP queries produce useful results
- [ ] Check for redundant queries
- [ ] Optimize query patterns

**Deliverables**:
- Integration test results
- Performance optimisation notes

**Day 12**: Documentation review

**Tasks**:
- [ ] Review all documentation for accuracy
- [ ] Add screenshots of MCP configuration
- [ ] Add example outputs WITH vs WITHOUT MCP
- [ ] Review troubleshooting guide
- [ ] Get peer review on documentation

**Deliverables**:
- Final documentation ready for release

### Phase 4: Release Preparation (Week 3 Days 2-3)

**Day 13**: Update CHANGELOG and version

**Tasks**:
- [ ] Update `CHANGELOG.md` for v0.5.0
- [ ] Document all MCP features added
- [ ] Update version references across all files
- [ ] Create migration guide from v0.4.1
- [ ] Tag release candidate

**Deliverables**:
- `CHANGELOG.md` updated
- Version v0.5.0-rc1 tagged

**Day 14**: Test repository updates

**Tasks**:
- [ ] Create test script to update all 6 test repos
- [ ] Push v0.5.0 to test repos
- [ ] Verify MCP configuration in test repos
- [ ] Test commands in each test repo
- [ ] Document any issues

**Deliverables**:
- All test repos updated to v0.5.0-rc1
- Test results documented

### Phase 5: Deployment (Week 3 Days 4-5)

**Day 15**: Main repository release

**Tasks**:
- [ ] Merge `feature/mcp-integration` to main
- [ ] Create GitHub release v0.5.0
- [ ] Upload release notes
- [ ] Update main branch protection
- [ ] Monitor for issues

**Deliverables**:
- v0.5.0 released on main branch
- GitHub release published

**Day 16**: Test repository deployment

**Tasks**:
- [ ] Run update script for all 6 test repos
- [ ] Push v0.5.0 to all test repos
- [ ] Verify deployment in each repo
- [ ] Test MCP setup in sample project
- [ ] Document final deployment

**Script**: Similar to `/tmp/remove-deprecated-from-test-repos.sh` but for MCP updates

**Deliverables**:
- All 6 test repos updated to v0.5.0

### Phase 6: Launch & Communication (Week 3 Day 5+)

**Day 17**: Documentation finalization

**Tasks**:
- [ ] Update website (`docs/index.html`) with MCP features
- [ ] Create blog post announcement
- [ ] Update README with MCP benefits
- [ ] Create video tutorial (optional)
- [ ] Update comparison tables

**Deliverables**:
- Website updated
- Announcement materials ready

**Post-Release**:
- [ ] Monitor GitHub issues for MCP-related problems
- [ ] Collect user feedback
- [ ] Plan v0.5.1 for any critical fixes

## Configuration Examples

### Claude Code: `.claude/mcp-servers.json`

```json
{
  "mcpServers": {
    "microsoft-learn": {
      "url": "https://learn.microsoft.com/api/mcp",
      "description": "Official Microsoft documentation and code samples"
    }
  }
}
```

### Codex CLI: `.codex/config.json`

```json
{
  "mcp": {
    "servers": {
      "microsoft-learn": {
        "endpoint": "https://learn.microsoft.com/api/mcp",
        "enabled": true
      }
    }
  }
}
```

### Gemini CLI: `.gemini/mcp-config.json`

```json
{
  "mcp_servers": [
    {
      "name": "microsoft-learn",
      "url": "https://learn.microsoft.com/api/mcp",
      "enabled": true
    }
  ]
}
```

## Expected Benefits

### For Users

1. **Authoritative Sources**: Direct access to official Microsoft documentation
2. **Up-to-Date Information**: Always current Azure service information
3. **Code Samples**: Official Microsoft code examples
4. **Better Architecture**: Designs aligned with Azure best practices
5. **Compliance**: Azure Government and security standards

### For ArcKit

1. **Differentiation**: First architecture toolkit with native MCP support
2. **Azure Focus**: Better Azure architecture support
3. **Quality**: More accurate, authoritative outputs
4. **Extensibility**: Foundation for future MCP servers (AWS, GCP, etc.)

### Metrics to Track

- **Adoption Rate**: % of users who configure MCP
- **Usage Frequency**: How often MCP tools are invoked
- **Output Quality**: User feedback on MCP-enhanced outputs
- **Documentation Accuracy**: Reduction in outdated/incorrect references

## Risk Management

### Risk 1: MCP Server Availability

**Risk**: Microsoft Learn MCP server downtime or changes
**Mitigation**: Graceful degradation to non-MCP behaviour
**Severity**: Low (commands still work without MCP)

### Risk 2: Platform MCP Support Changes

**Risk**: AI platforms change MCP implementation
**Mitigation**: Monitor platform updates, test regularly
**Severity**: Medium (may require config changes)

### Risk 3: User Configuration Complexity

**Risk**: Users struggle with MCP setup
**Mitigation**: Comprehensive documentation, examples, troubleshooting
**Severity**: Low (MCP is optional)

### Risk 4: Performance Impact

**Risk**: MCP queries slow down command execution
**Mitigation**: Parallel queries, caching, timeout handling
**Severity**: Low (queries are async)

### Risk 5: Scope Creep

**Risk**: Adding too many MCP features delays release
**Mitigation**: Strict scope (6 commands only), phased approach
**Severity**: Medium (could delay v0.5.0)

## Success Criteria

### Must Have (v0.5.0)

- ✅ All 6 commands updated with MCP support
- ✅ Documentation complete for all 3 platforms
- ✅ Graceful degradation when MCP not configured
- ✅ All test repos updated
- ✅ GitHub release published

### Should Have (v0.5.0)

- ✅ MCP setup guide with screenshots
- ✅ Example outputs showing MCP benefits
- ✅ Troubleshooting documentation
- ✅ Performance optimisation

### Nice to Have (v0.5.1+)

- 📹 Video tutorial
- 🎯 Analytics on MCP usage
- 🚀 Additional MCP servers (AWS, GCP)
- 🔄 MCP server health monitoring

## Future Enhancements (v0.6.0+)

### Additional MCP Servers

1. **AWS Documentation MCP** (if available)
   - AWS Well-Architected Framework
   - AWS service documentation
   - AWS code samples

2. **GCP Documentation MCP** (if available)
   - Google Cloud architecture guidance
   - GCP service documentation
   - GCP code samples

3. **GitHub MCP** (community-built)
   - Search repositories
   - Code examples
   - Best practices

### Enhanced Commands

- `/arckit.compare` - Compare cloud providers using MCP
- `/arckit.cost` - Cost estimation using cloud pricing APIs via MCP
- `/arckit.compliance` - Multi-framework compliance using various MCP sources

### Analytics

- Track which MCP tools are most useful
- Measure output quality improvements
- User satisfaction surveys

## Appendix A: File Checklist

### Documentation Files (New)
- [ ] `docs/mcp-setup-guide.md` (~500 lines)
- [ ] `docs/mcp-examples.md` (~300 lines)
- [ ] `docs/mcp-integration-plan.md` (this file, ~600 lines)

### Documentation Files (Updated)
- [ ] `README.md` (+100 lines)
- [ ] `docs/quickstart.md` (+50 lines)
- [ ] `docs/index.html` (+100 lines)
- [ ] `.claude/README.md` (+100 lines)
- [ ] `.codex/README.md` (+100 lines)
- [ ] `.gemini/README.md` (+100 lines)
- [ ] `CHANGELOG.md` (+50 lines)

### Command Files (Updated)
- [ ] `.claude/commands/arckit.research.md` (+150 lines)
- [ ] `.claude/commands/arckit.secure.md` (+150 lines)
- [ ] `.claude/commands/arckit.mod-secure.md` (+150 lines)
- [ ] `.claude/commands/arckit.requirements.md` (+150 lines)
- [ ] `.claude/commands/arckit.data-model.md` (+150 lines)
- [ ] `.claude/commands/arckit.diagram.md` (+150 lines)
- [ ] `.codex/prompts/arckit.research.md` (+150 lines)
- [ ] `.codex/prompts/arckit.secure.md` (+150 lines)
- [ ] `.codex/prompts/arckit.mod-secure.md` (+150 lines)
- [ ] `.codex/prompts/arckit.requirements.md` (+150 lines)
- [ ] `.codex/prompts/arckit.data-model.md` (+150 lines)
- [ ] `.codex/prompts/arckit.diagram.md` (+150 lines)
- [ ] `.gemini/commands/arckit/research.toml` (+150 lines)
- [ ] `.gemini/commands/arckit/secure.toml` (+150 lines)
- [ ] `.gemini/commands/arckit/mod-secure.toml` (+150 lines)
- [ ] `.gemini/commands/arckit/requirements.toml` (+150 lines)
- [ ] `.gemini/commands/arckit/data-model.toml` (+150 lines)
- [ ] `.gemini/commands/arckit/diagram.toml` (+150 lines)

### Configuration Examples (New)
- [ ] `.claude/mcp-servers.json.example` (~20 lines)
- [ ] `.codex/config.json.example` (+20 lines to existing)
- [ ] `.gemini/mcp-config.json.example` (~20 lines)

**Total New Lines**: ~3,500-4,500

## Appendix B: Testing Checklist

### Functional Testing

**For Each Command (research, secure, mod-secure, requirements, data-model, diagram)**:

#### Claude Code
- [ ] Command executes with MCP configured
- [ ] Command executes without MCP configured
- [ ] MCP tools are used when available
- [ ] Output quality improved with MCP
- [ ] Graceful degradation works
- [ ] Error handling works

#### Codex CLI
- [ ] Command executes with MCP configured
- [ ] Command executes without MCP configured
- [ ] MCP tools are used when available
- [ ] Output quality improved with MCP
- [ ] Graceful degradation works
- [ ] Error handling works

#### Gemini CLI
- [ ] Command executes with MCP configured
- [ ] Command executes without MCP configured
- [ ] MCP tools are used when available
- [ ] Output quality improved with MCP
- [ ] Graceful degradation works
- [ ] Error handling works

### Integration Testing

- [ ] Complete workflow (plan → research → secure → diagram) with MCP
- [ ] Cross-command data consistency
- [ ] Performance acceptable (< 10s for MCP queries)
- [ ] No redundant MCP queries
- [ ] Cache hit rate > 50% (if caching implemented)

### Documentation Testing

- [ ] Setup instructions work for Claude Code
- [ ] Setup instructions work for Codex CLI
- [ ] Setup instructions work for Gemini CLI
- [ ] Troubleshooting guide covers common issues
- [ ] Examples produce expected outputs
- [ ] Screenshots are current

### Deployment Testing

- [ ] Main repo deploys successfully
- [ ] All 6 test repos deploy successfully
- [ ] Version numbers consistent across all files
- [ ] CHANGELOG accurate
- [ ] GitHub release created correctly

## Appendix C: Communication Templates

### GitHub Release Notes (v0.5.0)

```markdown
# ArcKit v0.5.0: Microsoft Learn MCP Integration

## 🚀 What's New

**Microsoft Learn MCP Support**: ArcKit now integrates with Microsoft Learn's Model Context Protocol (MCP) server to provide real-time access to official Microsoft documentation, Azure best practices, and code samples.

### Enhanced Commands

Six commands now leverage Microsoft Learn MCP when configured:

1. **`/arckit.research`**: Query official Microsoft/Azure documentation
2. **`/arckit.secure`**: Reference Azure Security Benchmark
3. **`/arckit.mod-secure`**: Use Azure Government guidance
4. **`/arckit.requirements`**: Verify Azure service capabilities
5. **`/arckit.data-model`**: Query Azure data services documentation
6. **`/arckit.diagram`**: Reference Azure Architecture Center

### Platform Support

✅ **Claude Code**: Native MCP support via `.claude/mcp-servers.json`
✅ **Codex CLI**: Native MCP support via `.codex/config.json`
✅ **Gemini CLI**: Native MCP support via `.gemini/mcp-config.json`

### Key Features

- **Authoritative Sources**: Direct access to official Microsoft docs
- **Up-to-Date Information**: Always current Azure service information
- **Code Samples**: Official Microsoft code examples
- **Graceful Degradation**: Commands work with or without MCP configured
- **Easy Setup**: Simple JSON configuration, no code changes needed

## 📚 Documentation

- **Setup Guide**: `docs/mcp-setup-guide.md`
- **Examples**: `docs/mcp-examples.md`
- **Platform Guides**: Updated `.claude/README.md`, `.codex/README.md`, `.gemini/README.md`

## 🔧 Breaking Changes

None. MCP is optional and commands continue to work without it.

## 📦 Installation

```bash
# Existing users
git pull origin main

# New users
git clone https://github.com/tractorjuice/arc-kit.git
```

## 🎯 Getting Started

1. Follow the setup guide: `docs/mcp-setup-guide.md`
2. Configure your AI CLI platform with Microsoft Learn MCP
3. Run commands as normal - they'll automatically use MCP when available

## 🙏 Acknowledgments

Thanks to:
- Anthropic for the Model Context Protocol specification
- Microsoft for the public Microsoft Learn MCP server
- All contributors and users providing feedback

---

**Full Changelog**: https://github.com/tractorjuice/arc-kit/blob/main/CHANGELOG.md
```

### Blog Post Announcement

```markdown
# ArcKit v0.5.0: Real-Time Microsoft Documentation in Your Architecture Workflow

Today we're excited to announce ArcKit v0.5.0, featuring integration with Microsoft Learn's Model Context Protocol (MCP) server.

## What This Means for You

When you run commands like `/arckit.research` or `/arckit.secure`, ArcKit can now:

- **Search official Microsoft documentation** in real-time
- **Fetch complete Azure best practice guides**
- **Find Microsoft code samples** for your specific scenario
- **Reference Azure Architecture Center** patterns

All automatically, using the same commands you're already familiar with.

## How It Works

MCP is an open protocol created by Anthropic that lets AI systems connect to external tools and data sources. We've integrated Microsoft Learn's MCP server, which provides three powerful tools:

1. `microsoft_docs_search` - Semantic search across all Microsoft docs
2. `microsoft_docs_fetch` - Retrieve full documentation pages
3. `microsoft_code_sample_search` - Find official code samples

## Example: Enhanced Research

**Before** (without MCP):
```
/arckit.research Research Azure Kubernetes Service for microservices
```
Output: General web search results, may include outdated or third-party information

**After** (with MCP):
```
/arckit.research Research Azure Kubernetes Service for microservices
```
Output:
- Official AKS documentation from Microsoft Learn
- Azure Architecture Center microservices patterns
- Microsoft code samples for AKS deployment
- Current best practices and security guidance

## Getting Started

Setup is simple - just add one JSON configuration file to your AI CLI:

**Claude Code**: Create `.claude/mcp-servers.json`
**Codex CLI**: Update `.codex/config.json`
**Gemini CLI**: Create `.gemini/mcp-config.json`

Full setup guide: https://github.com/tractorjuice/arc-kit/blob/main/docs/mcp-setup-guide.md

## What's Next

This is the foundation for more MCP integrations. We're exploring:

- AWS Documentation MCP (when available)
- GCP Documentation MCP (when available)
- GitHub code search MCP
- Custom organisational MCP servers

## Try It Today

Update to v0.5.0:
```bash
git pull origin main
```

Questions? Issues? Let us know: https://github.com/tractorjuice/arc-kit/issues

Happy architecting! 🏗️✨
```

---

**End of Plan**

**Version**: v0.5.0 Integration Plan
**Created**: 2025-10-29
**Status**: Planning Complete, Implementation Pending
