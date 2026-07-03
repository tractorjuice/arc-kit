# AWS Technology Research Guide

> **Guide Origin**: Official | **ArcKit Version**: [VERSION]

`/arckit:aws-research` researches AWS services, architecture patterns, and implementation guidance using the AWS Knowledge MCP server for authoritative documentation.

> **Agent Architecture**: This command runs as an autonomous agent via the Task tool. The agent makes 15-30+ MCP calls to gather AWS documentation in its own context window, keeping the main conversation clean. The slash command is a thin wrapper that delegates to the agent.

---

## Prerequisites

### AWS Knowledge MCP Server (REQUIRED)

This command **requires** the AWS Knowledge MCP server to be installed. It will not work without it.

**Installation**:

Add to your Claude Code MCP configuration (`~/.claude/claude_desktop_config.json` or project `.mcp.json`):

```json
{
  "mcpServers": {
    "aws-knowledge": {
      "type": "http",
      "url": "https://knowledge-mcp.global.api.aws"
    }
  }
}
```

After installation, restart Claude Code to load the MCP server.

**Slow corporate network?** On TLS-inspecting proxies, VPN tunnels, or congested links, large-scope research prompts can exceed Claude Code's default per-request fetch timeout. Set `MCP_TOOL_TIMEOUT=300000` (5 minutes, in milliseconds) before launching Claude — see [MCP per-request timeout](mcp-servers.md#optional-mcp-per-request-timeout-claude-code-v21142) in the MCP setup guide. Requires Claude Code v2.1.142+.

### Project Prerequisites

- Requirements document (`ARC-*-REQ-*.md`) - **MANDATORY**
- Data model (`ARC-*-DATA-*.md`) - Recommended for database selection
- Stakeholders (`ARC-*-STKE-*.md`) - Recommended for priorities

---

## Scenario Matrix

| Scenario | Prompt seed | Focus |
|---------|-------------|-------|
| Service selection | "Research AWS services for <capability>" | Maps requirements to AWS services |
| Architecture pattern | "Research AWS architecture pattern for <pattern>" | Reference architectures from AWS Architecture Center |
| UK Government | "Research AWS for UK Government <project>" | G-Cloud, eu-west-2, NCSC compliance |
| AI/ML workloads | "Research AWS AI services for <use case>" | Bedrock, SageMaker |
| Migration | "Research AWS migration options for <workload>" | Migration Hub, modernization paths |
| Security assessment | "Research AWS Security Hub for <domain>" | Control mapping, Well-Architected security |

Add constraints (budget, classification, region) in the prompt for tailored results.

---

## Command

```bash
/arckit:aws-research Research AWS services for <project>
```

Outputs: `projects/<id>/research/ARC-<id>-AWRS-v1.0.md`

> **Auto-versioning**: Re-running this command when a document already exists automatically increments the version (minor for refreshed content, major for changed scope) instead of overwriting.

---

## Long runs: Remote Control + push notifications

`/arckit:aws-research` frequently exceeds 10 minutes as the agent issues dozens of AWS Knowledge MCP calls and fetches full documentation pages for cost and compliance analysis. To avoid babysitting the terminal, pair it with [Claude Code Remote Control](https://code.claude.com/docs/en/remote-control):

```bash
claude remote-control
```

Drive the session from claude.ai/code or the mobile app, then enable `/config → Push when Claude decides` so your phone gets a notification on completion or when the agent reaches a decision point (service shortlist confirmation, region selection). ArcKit's minimum Claude Code floor (v2.1.200) already covers the v2.1.110 RC requirement.

Caveats: Pro/Max plans only (no API keys, no Bedrock/Vertex/Foundry), push is a single on/off so chatty agents can over-notify, and the local `claude` process must keep running.

---

## MCP Tools Used

The command uses five AWS Knowledge MCP tools:

| Tool | Purpose |
|------|---------|
| `search_documentation` | Search AWS documentation for services, patterns, best practices |
| `read_documentation` | Retrieve complete documentation pages for detailed analysis |
| `get_regional_availability` | Check service/feature availability in eu-west-2 (London) |
| `list_regions` | Get all AWS regions for multi-region planning |
| `recommend` | Get content recommendations for AWS topics |

---

## Output Highlights

- **AWS Service Recommendations**: Mapped to specific requirements (FR, NFR, INT, DR)
- **Architecture Pattern**: Reference architecture from AWS Architecture Center
- **Well-Architected Assessment**: All 6 pillars evaluated per service (including Sustainability)
- **AWS Security Hub**: Foundational Security Best Practices mapping
- **UK Government Compliance**: G-Cloud, eu-west-2 region, NCSC principles
- **Cost Estimates**: Monthly and 3-year TCO with optimization recommendations
- **Implementation Guidance**: CDK/CloudFormation/Terraform templates

---

## UK Government Features

When UK Government project detected:

| Area | Coverage |
|------|----------|
| **G-Cloud** | Framework reference, service IDs, procurement steps |
| **Data Residency** | eu-west-2 (London) availability via `get_regional_availability` |
| **Classification** | OFFICIAL, OFFICIAL-SENSITIVE suitability |
| **NCSC** | 14 Cloud Security Principles alignment |
| **Note** | AWS GovCloud is US-only (not available for UK SECRET) |

---

## Follow-on Actions

- Feed AWS findings into `/arckit:diagram` for AWS architecture diagrams
- Run `/arckit:secure` to validate against UK Secure by Design
- Run `/arckit:devops` to plan AWS CodePipeline CI/CD
- Run `/arckit:finops` to create AWS FinOps cost management strategy
- Run `/arckit:adr` to document AWS service selection decisions

---

## Comparison with /arckit:research

| Feature | `/arckit:research` | `/arckit:aws-research` |
|---------|-------------------|------------------------|
| Scope | Multi-cloud, SaaS, open-source | AWS-specific only |
| Source | Web search, multiple sources | AWS Knowledge MCP (authoritative) |
| Depth | Build vs buy analysis | Deep AWS service analysis |
| Regional | General | `get_regional_availability` for eu-west-2 |
| Compliance | General UK Gov | AWS-specific UK compliance |
| Code samples | Limited | CDK, CloudFormation, Terraform |
| Cost estimates | High-level | Detailed AWS pricing |

**When to use which**:

- Use `/arckit:research` for cloud-agnostic evaluation or build vs buy
- Use `/arckit:aws-research` when AWS is the target platform

---

## Resources

- [AWS Knowledge MCP](https://awslabs.github.io/mcp/servers/aws-knowledge-mcp-server) - MCP server documentation
- [AWS Architecture Center](https://aws.amazon.com/architecture/) - Reference architectures
- [AWS Well-Architected Framework](https://aws.amazon.com/architecture/well-architected/) - Design guidance
- [AWS Security Best Practices](https://aws.amazon.com/security/) - Security controls
- [AWS UK Compliance](https://aws.amazon.com/compliance/uk-data-protection/) - UK Government compliance
