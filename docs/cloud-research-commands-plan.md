# Cloud Research Commands Plan

## Overview

This plan outlines the implementation of cloud-specific research commands that leverage Model Context Protocol (MCP) servers for authoritative, real-time documentation access.

**Version**: v1.1.0 (azure-research), v1.2.0 (aws/gcp-research)
**Created**: 2026-01-29
**Status**: Implementation In Progress

## Microsoft Learn MCP Coverage

Much broader than just Azure:

| Product Area | MCP Server | Status |
|--------------|------------|--------|
| **Microsoft Learn** | [Microsoft Learn MCP](https://learn.microsoft.com/en-us/training/support/mcp) | GA |
| **Azure** | [Azure MCP Server](https://learn.microsoft.com/en-us/azure/developer/azure-mcp-server/) | GA |
| **Dynamics 365 ERP** | [D365 ERP MCP](https://learn.microsoft.com/en-us/dynamics365/fin-ops-core/dev-itpro/copilot/copilot-mcp) | Preview |
| **Dynamics 365 Sales** | [D365 Sales MCP](https://learn.microsoft.com/en-us/dynamics365/sales/connect-to-model-context-protocol-sales) | Preview |
| **Microsoft 365** | M365 Development MCP | Available |

## AWS MCP Coverage

| Product Area | MCP Server | Status |
|--------------|------------|--------|
| **AWS Documentation** | [AWS Docs MCP](https://awslabs.github.io/mcp/servers/aws-documentation-mcp-server) | GA |
| **AWS Services** | [AWS MCP Server](https://docs.aws.amazon.com/aws-mcp/latest/userguide/what-is-mcp-server.html) | GA |
| **Amazon EKS** | [EKS MCP](https://docs.aws.amazon.com/eks/latest/userguide/eks-mcp-introduction.html) | Preview |
| **Amazon MSK** | MSK MCP | GA |
| **Serverless/Containers** | AWS Labs servers | GA |

## Google Cloud MCP Coverage

| Product Area | MCP Server | Status |
|--------------|------------|--------|
| **Google Cloud** | [GCP MCP Overview](https://docs.cloud.google.com/mcp/overview) | GA |
| **Compute Engine** | [Compute MCP](https://docs.cloud.google.com/compute/docs/reference/mcp) | GA |
| **Cloud Run** | Hosting support | GA |
| **Data Commons** | Public data access | GA |

---

## Proposed Commands

### 1. `/arckit.azure-research` (Priority: HIGH)

**MCP Servers:**
- Microsoft Learn MCP: `https://learn.microsoft.com/api/mcp`
- Azure MCP Server (optional): For live resource queries

**Coverage:**
- Azure services documentation
- Azure Architecture Center patterns
- Azure Well-Architected Framework
- Azure Security Benchmark
- ARM/Bicep/Terraform templates
- Azure Government guidance

**Output Structure:**
```markdown
# Azure Research: [Topic]

## Executive Summary
## Recommended Azure Services
## Architecture Pattern (Mermaid diagram)
## Security & Compliance (Security Benchmark mappings)
## Implementation (Code samples, IaC templates)
## UK Government Suitability (G-Cloud, classification)
## References (Microsoft Learn links)
```

**Differentiation from `/arckit.research`:**

| Aspect | `/arckit.research` | `/arckit.azure-research` |
|--------|---------------------|--------------------------|
| Scope | General technology (any vendor) | Azure/Microsoft only |
| Data source | Web search | Microsoft Learn MCP (primary) |
| Output focus | Build vs buy analysis | Azure service selection, architecture patterns |
| Code samples | Generic | Official Microsoft samples |
| Compliance | General | Azure-specific (Security Benchmark, Well-Architected) |

---

### 2. `/arckit.aws-research` (Priority: MEDIUM)

**MCP Servers:**
- AWS Documentation MCP: Via [awslabs/mcp](https://github.com/awslabs/mcp)
- AWS MCP Server (optional): For live resource queries

**Coverage:**
- AWS services documentation
- AWS Well-Architected Framework
- AWS Architecture Center patterns
- AWS Security best practices
- CloudFormation/CDK/Terraform templates
- AWS GovCloud guidance

**Output Structure:**
```markdown
# AWS Research: [Topic]

## Executive Summary
## Recommended AWS Services
## Architecture Pattern (Mermaid diagram)
## Security & Compliance (AWS Security Hub, Config rules)
## Implementation (Code samples, IaC templates)
## UK Government Suitability (AWS UK regions, OFFICIAL)
## References (AWS documentation links)
```

---

### 3. `/arckit.gcp-research` (Priority: MEDIUM)

**MCP Servers:**
- Google Cloud MCP: `https://docs.cloud.google.com/mcp`

**Coverage:**
- Google Cloud services documentation
- Google Cloud Architecture Framework
- Security Command Center guidance
- Terraform/Deployment Manager templates
- Google Cloud UK region guidance

**Output Structure:**
```markdown
# GCP Research: [Topic]

## Executive Summary
## Recommended GCP Services
## Architecture Pattern (Mermaid diagram)
## Security & Compliance (Security Command Center)
## Implementation (Code samples, IaC templates)
## UK Government Suitability (GCP UK regions, certifications)
## References (Google Cloud documentation links)
```

---

## Implementation Plan

### Phase 1: `/arckit.azure-research` (Week 1)

| Day | Task | Deliverables |
|-----|------|--------------|
| 1 | Create template | `.arckit/templates/azure-research-template.md` |
| 2 | Create Claude command | `.claude/commands/arckit.azure-research.md` |
| 3 | Create Codex/Gemini commands | `.codex/prompts/`, `.gemini/commands/` |
| 4 | Create usage guide | `docs/guides/azure-research.md` |
| 5 | Test with/without MCP | Test in v3 (Windows 11), v9 (GenAI) repos |

### Phase 2: `/arckit.aws-research` (Week 2)

| Day | Task | Deliverables |
|-----|------|--------------|
| 6 | Create template | `.arckit/templates/aws-research-template.md` |
| 7 | Create Claude command | `.claude/commands/arckit.aws-research.md` |
| 8 | Create Codex/Gemini commands | Convert via script |
| 9 | Create usage guide | `docs/guides/aws-research.md` |
| 10 | Test with/without MCP | Test in appropriate repos |

### Phase 3: `/arckit.gcp-research` (Week 3)

| Day | Task | Deliverables |
|-----|------|--------------|
| 11 | Create template | `.arckit/templates/gcp-research-template.md` |
| 12 | Create Claude command | `.claude/commands/arckit.gcp-research.md` |
| 13 | Create Codex/Gemini commands | Convert via script |
| 14 | Create usage guide | `docs/guides/gcp-research.md` |
| 15 | Test with/without MCP | Test in appropriate repos |

### Phase 4: Documentation & Release (Week 3-4)

| Day | Task | Deliverables |
|-----|------|--------------|
| 16 | Update README.md | Add 3 new commands |
| 17 | Update docs/index.html | Add to command table |
| 18 | Update MCP integration plan | Link to cloud research commands |
| 19 | Test all 3 commands | Full test matrix |
| 20 | Release v1.2.0 | CHANGELOG, git tag |

---

## MCP Configuration Examples

### Claude Code `.claude/mcp-servers.json`

```json
{
  "mcpServers": {
    "microsoft-learn": {
      "type": "http",
      "url": "https://learn.microsoft.com/api/mcp"
    },
    "aws-docs": {
      "command": "uvx",
      "args": ["awslabs.aws-documentation-mcp-server@latest"]
    },
    "gcp": {
      "type": "http",
      "url": "https://mcp.googleapis.com/v1/servers/gcp"
    }
  }
}
```

### Codex CLI `.codex/config.json`

```json
{
  "mcp": {
    "servers": {
      "microsoft-learn": {
        "endpoint": "https://learn.microsoft.com/api/mcp",
        "enabled": true
      },
      "aws-docs": {
        "command": "uvx",
        "args": ["awslabs.aws-documentation-mcp-server@latest"],
        "enabled": true
      }
    }
  }
}
```

### Gemini CLI `.gemini/mcp-config.json`

```json
{
  "mcp_servers": [
    {
      "name": "microsoft-learn",
      "url": "https://learn.microsoft.com/api/mcp",
      "enabled": true
    },
    {
      "name": "gcp",
      "url": "https://mcp.googleapis.com/v1/servers/gcp",
      "enabled": true
    }
  ]
}
```

---

## Version Plan

| Version | Content |
|---------|---------|
| v1.1.0 | `/arckit.azure-research` + MCP setup guide |
| v1.2.0 | `/arckit.aws-research` + `/arckit.gcp-research` |

---

## File Checklist

### `/arckit.azure-research` (v1.1.0)

- [ ] `.arckit/templates/azure-research-template.md`
- [ ] `.claude/commands/arckit.azure-research.md`
- [ ] `.codex/prompts/arckit/azure-research.md`
- [ ] `.gemini/commands/arckit/azure-research.toml`
- [ ] `docs/guides/azure-research.md`
- [ ] Update `README.md`
- [ ] Update `docs/index.html`
- [ ] Update `DEPENDENCY-MATRIX.md`

### `/arckit.aws-research` (v1.2.0)

- [ ] `.arckit/templates/aws-research-template.md`
- [ ] `.claude/commands/arckit.aws-research.md`
- [ ] `.codex/prompts/arckit/aws-research.md`
- [ ] `.gemini/commands/arckit/aws-research.toml`
- [ ] `docs/guides/aws-research.md`

### `/arckit.gcp-research` (v1.2.0)

- [ ] `.arckit/templates/gcp-research-template.md`
- [ ] `.claude/commands/arckit.gcp-research.md`
- [ ] `.codex/prompts/arckit/gcp-research.md`
- [ ] `.gemini/commands/arckit/gcp-research.toml`
- [ ] `docs/guides/gcp-research.md`

---

## Sources

- [Microsoft Learn MCP Server](https://learn.microsoft.com/en-us/training/support/mcp)
- [Azure MCP Server](https://learn.microsoft.com/en-us/azure/developer/azure-mcp-server/)
- [AWS MCP Servers (GitHub)](https://github.com/awslabs/mcp)
- [AWS Documentation MCP](https://awslabs.github.io/mcp/servers/aws-documentation-mcp-server)
- [Google Cloud MCP Overview](https://docs.cloud.google.com/mcp/overview)
- [10 Microsoft MCP Servers](https://developer.microsoft.com/blog/10-microsoft-mcp-servers-to-accelerate-your-development-workflow)
