# Azure Technology Research Guide

`/arckit.azure-research` researches Azure services, architecture patterns, and implementation guidance using the Microsoft Learn MCP server for authoritative documentation.

> **Agent Architecture**: This command runs as an autonomous agent via the Task tool. The agent makes 15-30+ MCP calls to gather Azure documentation in its own context window, keeping the main conversation clean. The slash command is a thin wrapper that delegates to the agent.

---

## Prerequisites

### Microsoft Learn MCP Server (REQUIRED)

This command **requires** the Microsoft Learn MCP server to be installed. It will not work without it.

**Installation**:

Add to your Claude Code MCP configuration (`~/.claude/claude_desktop_config.json` or project `.mcp.json`):

```json
{
  "mcpServers": {
    "microsoft-docs": {
      "command": "npx",
      "args": ["-y", "@anthropic/mcp-server-microsoft-docs"]
    }
  }
}
```

After installation, restart Claude Code to load the MCP server.

### Project Prerequisites

- Requirements document (`ARC-*-REQ-*.md`) - **MANDATORY**
- Data model (`ARC-*-DATA-*.md`) - Recommended for database selection
- Stakeholders (`ARC-*-STKE-*.md`) - Recommended for priorities

---

## Scenario Matrix

| Scenario | Prompt seed | Focus |
|---------|-------------|-------|
| Service selection | "Research Azure services for <capability>" | Maps requirements to Azure services |
| Architecture pattern | "Research Azure architecture pattern for <pattern>" | Reference architectures from Azure Architecture Center |
| UK Government | "Research Azure for UK Government <project>" | G-Cloud, data residency, NCSC compliance |
| AI/ML workloads | "Research Azure AI services for <use case>" | Azure OpenAI, Cognitive Services, ML |
| Migration | "Research Azure migration options for <workload>" | Azure Migrate, modernization paths |
| Security assessment | "Research Azure Security Benchmark for <domain>" | Control mapping, Well-Architected security |

Add constraints (budget, classification, region) in the prompt for tailored results.

---

## Command

```bash
/arckit.azure-research Research Azure services for <project>
```

Outputs: `projects/<id>/research/ARC-<id>-AZRS-v1.0.md`

> **Auto-versioning**: Re-running this command when a document already exists automatically increments the version (minor for refreshed content, major for changed scope) instead of overwriting.

---

## MCP Tools Used

The command uses three Microsoft Learn MCP tools:

| Tool | Purpose |
|------|---------|
| `microsoft_docs_search` | Search Azure documentation for services, patterns, best practices |
| `microsoft_docs_fetch` | Retrieve complete documentation pages for detailed analysis |
| `microsoft_code_sample_search` | Find Bicep, Terraform, and SDK code samples |

---

## Output Highlights

- **Azure Service Recommendations**: Mapped to specific requirements (FR, NFR, INT, DR)
- **Architecture Pattern**: Reference architecture from Azure Architecture Center
- **Well-Architected Assessment**: All 5 pillars evaluated per service
- **Azure Security Benchmark**: 12 control domains mapped
- **UK Government Compliance**: G-Cloud, UK regions, NCSC principles
- **Cost Estimates**: Monthly and 3-year TCO with optimization recommendations
- **Implementation Guidance**: Bicep/Terraform templates, Azure DevOps pipelines

---

## UK Government Features

When UK Government project detected:

| Area | Coverage |
|------|----------|
| **G-Cloud** | Framework reference, service IDs, procurement steps |
| **Data Residency** | UK South/UK West availability, geo-replication |
| **Classification** | OFFICIAL, OFFICIAL-SENSITIVE, SECRET suitability |
| **NCSC** | 14 Cloud Security Principles alignment |
| **Scottish Government** | AI Strategy, Cyber Resilience Framework |

---

## Follow-on Actions

- Feed Azure findings into `/arckit.diagram` for Azure architecture diagrams
- Run `/arckit.secure` to validate against UK Secure by Design
- Run `/arckit.devops` to plan Azure DevOps CI/CD pipelines
- Run `/arckit.finops` to create Azure FinOps cost management strategy
- Run `/arckit.adr` to document Azure service selection decisions

---

## Comparison with /arckit.research

| Feature | `/arckit.research` | `/arckit.azure-research` |
|---------|-------------------|-------------------------|
| Scope | Multi-cloud, SaaS, open-source | Azure-specific only |
| Source | Web search, multiple sources | Microsoft Learn MCP (authoritative) |
| Depth | Build vs buy analysis | Deep Azure service analysis |
| Compliance | General UK Gov | Azure-specific UK compliance |
| Code samples | Limited | Bicep, Terraform, SDKs |
| Cost estimates | High-level | Detailed Azure pricing |

**When to use which**:
- Use `/arckit.research` for cloud-agnostic evaluation or build vs buy
- Use `/arckit.azure-research` when Azure is the target platform

---

## Resources

- [Microsoft Learn MCP](https://learn.microsoft.com/en-us/training/support/mcp) - MCP server documentation
- [Azure Architecture Center](https://learn.microsoft.com/azure/architecture/) - Reference architectures
- [Azure Well-Architected Framework](https://learn.microsoft.com/azure/well-architected/) - Design guidance
- [Azure Security Benchmark](https://learn.microsoft.com/security/benchmark/azure/) - Security controls
- [Azure UK Compliance](https://learn.microsoft.com/azure/compliance/offerings/offering-uk-g-cloud) - UK Government compliance
