# Google Cloud Technology Research Guide

`/arckit.gcp-research` researches Google Cloud services, architecture patterns, and implementation guidance using the Google Developer Knowledge MCP server for authoritative documentation.

> **Agent Architecture**: This command runs as an autonomous agent via the Task tool. The agent makes 15-30+ MCP calls to gather Google Cloud documentation in its own context window, keeping the main conversation clean. The slash command is a thin wrapper that delegates to the agent.

---

## Prerequisites

### Google Developer Knowledge MCP Server (REQUIRED)

This command **requires** the Google Developer Knowledge MCP server to be installed. It will not work without it.

**API Key Required**: Unlike AWS Knowledge and Microsoft Learn MCPs (which are free/unauthenticated), the Google Developer Knowledge MCP requires an API key. Get one from [Google AI Studio](https://aistudio.google.com/apikey) or the [Google Cloud Console](https://console.cloud.google.com/apis/credentials).

**Installation**:

Add to your Claude Code MCP configuration (`~/.claude/claude_desktop_config.json` or project `.mcp.json`):

```json
{
  "mcpServers": {
    "google-developer-knowledge": {
      "type": "http",
      "url": "https://developerknowledge.googleapis.com/mcp",
      "headers": {
        "X-Goog-Api-Key": "${GOOGLE_API_KEY}"
      }
    }
  }
}
```

Set the environment variable:
```bash
export GOOGLE_API_KEY="your-api-key-here"
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
| Service selection | "Research Google Cloud services for <capability>" | Maps requirements to Google Cloud services |
| Architecture pattern | "Research Google Cloud architecture pattern for <pattern>" | Reference architectures from Architecture Center |
| UK Government | "Research Google Cloud for UK Government <project>" | G-Cloud, europe-west2, NCSC compliance |
| AI/ML workloads | "Research Google Cloud AI services for <use case>" | Vertex AI, Gemini API |
| Migration | "Research Google Cloud migration options for <workload>" | Migrate to GCP, modernization paths |
| Security assessment | "Research Security Command Center for <domain>" | SCC mapping, Architecture Framework security |
| Data analytics | "Research Google Cloud data platform for <use case>" | BigQuery, Dataflow, Pub/Sub |

Add constraints (budget, classification, region) in the prompt for tailored results.

---

## Command

```bash
/arckit.gcp-research Research Google Cloud services for <project>
```

Outputs: `projects/<id>/research/ARC-<id>-GCRS-v1.0.md`

> **Auto-versioning**: Re-running this command when a document already exists automatically increments the version (minor for refreshed content, major for changed scope) instead of overwriting.

---

## MCP Tools Used

The command uses three Google Developer Knowledge MCP tools:

| Tool | Purpose |
|------|---------|
| `search_documents` | Search Google Cloud documentation for services, patterns, best practices |
| `get_document` | Retrieve complete documentation pages for detailed analysis |
| `batch_get_documents` | Fetch multiple related documentation pages in a single call |

---

## Output Highlights

- **Google Cloud Service Recommendations**: Mapped to specific requirements (FR, NFR, INT, DR)
- **Architecture Pattern**: Reference architecture from Google Cloud Architecture Center
- **Architecture Framework Assessment**: All 6 pillars evaluated per service
- **Security Command Center**: Finding categories and CIS Benchmark for GCP
- **UK Government Compliance**: G-Cloud, europe-west2 region, NCSC principles
- **Cost Estimates**: Monthly and 3-year TCO with optimization recommendations
- **Implementation Guidance**: Terraform templates, Cloud Build pipelines

---

## UK Government Features

When UK Government project detected:

| Area | Coverage |
|------|----------|
| **G-Cloud** | Framework reference, service IDs, procurement steps |
| **Data Residency** | europe-west2 (London) availability, cross-region replication |
| **Classification** | OFFICIAL, OFFICIAL-SENSITIVE suitability |
| **NCSC** | 14 Cloud Security Principles alignment |
| **Note** | No Google Cloud Government UK (US-only) — not suitable for SECRET |

---

## Follow-on Actions

- Feed Google Cloud findings into `/arckit.diagram` for GCP architecture diagrams
- Run `/arckit.secure` to validate against UK Secure by Design
- Run `/arckit.devops` to plan Cloud Build CI/CD pipelines
- Run `/arckit.finops` to create Google Cloud FinOps cost management strategy
- Run `/arckit.adr` to document Google Cloud service selection decisions

---

## Comparison with /arckit.research

| Feature | `/arckit.research` | `/arckit.gcp-research` |
|---------|-------------------|------------------------|
| Scope | Multi-cloud, SaaS, open-source | Google Cloud-specific only |
| Source | Web search, multiple sources | Google Developer Knowledge MCP (authoritative) |
| Depth | Build vs buy analysis | Deep Google Cloud service analysis |
| Compliance | General UK Gov | Google Cloud-specific UK compliance |
| Code samples | Limited | Terraform, Cloud Build |
| Cost estimates | High-level | Detailed Google Cloud pricing |

**When to use which**:
- Use `/arckit.research` for cloud-agnostic evaluation or build vs buy
- Use `/arckit.gcp-research` when Google Cloud is the target platform

---

## Resources

- [Google Developer Knowledge MCP](https://developerknowledge.googleapis.com/mcp) - MCP server endpoint
- [Google Cloud Architecture Center](https://cloud.google.com/architecture) - Reference architectures
- [Google Cloud Architecture Framework](https://cloud.google.com/architecture/framework) - Design guidance
- [Google Cloud Security Best Practices](https://cloud.google.com/security/best-practices) - Security controls
- [Google Cloud UK Compliance](https://cloud.google.com/security/compliance/offerings#/regions=Europe) - UK Government compliance
