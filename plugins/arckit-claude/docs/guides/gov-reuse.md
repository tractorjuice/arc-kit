# Government Code Reuse Assessment Guide

> **Guide Origin**: Official | **ArcKit Version**: 4.4.0

`/arckit:gov-reuse` searches 24,500+ UK government open-source repositories to discover existing implementations that can be reused, forked, or referenced before building from scratch.

> **Agent Architecture**: In Claude Code the command runs in your main session. It sends reader subagents to gather evidence, and a writer subagent with no network tools then writes the document, which keeps the research out of your main context. Other assistants run a single combined prompt instead. The readers run the govreposcrape searches for each capability and use WebFetch to assess each candidate's GitHub repository.

---

## Prerequisites

### govreposcrape MCP Server (AUTO-INSTALLED)

This command uses the govreposcrape MCP server which is **automatically included** with the ArcKit plugin. No manual setup required.

**Endpoint**: `https://govreposcrape-api-1060386346356.us-central1.run.app/mcp`

### Project Prerequisites

- Requirements document (`ARC-*-REQ-*.md`) - **MANDATORY**
- Architecture principles (`ARC-000-PRIN-*.md`) - Recommended
- Stakeholder analysis (`ARC-*-STKE-*.md`) - Optional

---

## Scenario Matrix

| Scenario | Prompt seed | Focus |
|---------|-------------|-------|
| Pre-build check | "Check for existing government code for `<capability>`" | Capability-by-capability reuse search |
| Open source evaluation | "Find government open source for `<domain>`" | License and code quality assessment |
| UK Government project | "Assess government reuse for UK Government `<project>`" | OGL-licensed, GDS-standard code |
| Specific tech stack | "Find government `<language/framework>` implementations for `<use case>`" | Tech stack alignment |
| Cost reduction | "What can we reuse to reduce build effort for `<project>`?" | Effort savings estimation |

Add constraints (language, framework, license) in the prompt for tailored results.

---

## Command

```bash
/arckit:gov-reuse <capability or domain>
```

Outputs: `projects/<id>/research/ARC-<id>-GOVR-<NNN>-v1.0.md`

> **Re-running**: each run writes a new report with the next sequence number (`GOVR-001`, `GOVR-002` and so on), so earlier reports are kept.

---

## How It Works

The command uses the govreposcrape semantic search API to query 24,500+ UK government repositories:

| Step | Action |
|------|--------|
| 1 | Extract capabilities from project requirements |
| 2 | Search govreposcrape with 3-5 query variations per capability |
| 3 | Fetch GitHub repo details via WebFetch for each candidate |
| 4 | Score candidates on 5 weighted criteria (0-100 scale) |
| 5 | Recommend strategy: Fork, Library, Reference, or None |

### Scoring Criteria

| Criterion | Weight | 5 (Best) | 1 (Worst) |
|-----------|--------|----------|-----------|
| License compatibility | 25% | OGL / MIT | Proprietary |
| Code quality | 20% | Tests, CI, clean | No tests, unmaintained |
| Documentation | 20% | Comprehensive README, guides | No documentation |
| Tech stack alignment | 20% | Same stack | Incompatible |
| Activity / maintenance | 15% | Active (recent commits) | Abandoned (>2 years) |

---

## Output Highlights

- **Reuse candidates** per capability with scores and strategies
- **License compatibility matrix** across all candidates
- **Tech stack alignment** comparison with your project
- **Gap analysis** for capabilities with no reusable code
- **Effort savings** estimates vs building from scratch

---

## Follow-on Actions

- Run `/arckit:research` to see the market options beside the reuse findings
- Run `/arckit:adr` to document reuse decisions
- Run `/arckit:requirements` to refine requirements based on discovered capabilities

---

## Comparison with /arckit:research

| Feature | `/arckit:gov-reuse` | `/arckit:research` |
|---------|--------------------|--------------------|
| Scope | UK government repos only | Multi-cloud, SaaS, open-source |
| Focus | Code reuse and adaptation | Build vs buy, vendor comparison |
| Source | govreposcrape + GitHub | Web search, vendor sites |
| Output | Reuse assessment with scoring | Market research with TCO |
| When to use | Before building, to find existing code | To evaluate commercial options |

**Workflow**: Run `/arckit:gov-reuse` first, then `/arckit:research` to compare reuse candidates against commercial alternatives.

---

## Resources

- [govreposcrape](https://github.com/chrisns/govreposcrape) - Semantic search over UK government repositories
- [govreposcrape API](https://govreposcrape-api-1060386346356.us-central1.run.app/openapi.json) - OpenAPI specification
