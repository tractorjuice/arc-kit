# AWS Well-Architected Framework: the six pillars and AWS research

> **Guide Origin**: Official | **ArcKit Version**: [VERSION]

The AWS Well-Architected Framework is AWS's guidance for building secure, reliable, efficient, cost-effective and sustainable workloads, in six pillars. This guide lists the pillars and shows how `/arckit:aws-research` uses them to compare AWS services for your project.

The research runs on the AWS Knowledge MCP server: see [AWS documentation MCP servers](aws-documentation-mcp.md) for how it compares with the AWS MCP Server and the AWS Documentation MCP Server.

---

## What the AWS Well-Architected Framework is

The [AWS Well-Architected Framework](https://docs.aws.amazon.com/wellarchitected/latest/framework/welcome.html) is a set of foundational questions and best practices for checking whether an architecture on AWS follows cloud best practice. AWS describes a review as "a constructive conversation about architectural decisions", not an audit. The current edition was published on 6 November 2024.

AWS also offers the AWS Well-Architected Tool, which reviews workloads against the framework at no charge. In the tool, the framework itself is applied as a lens, and you can add [lenses](https://docs.aws.amazon.com/wellarchitected/latest/userguide/lenses.html) from the AWS Lens Catalog or write custom lenses with your own questions.

## The six pillars

| Pillar | What it covers |
|--------|----------------|
| [Operational excellence](https://docs.aws.amazon.com/wellarchitected/latest/framework/operational-excellence.html) | Organising your team, designing your workload, operating it at scale and evolving it over time |
| [Security](https://docs.aws.amazon.com/wellarchitected/latest/framework/security.html) | Protecting data, systems and assets |
| [Reliability](https://docs.aws.amazon.com/wellarchitected/latest/framework/reliability.html) | A workload doing its intended job correctly and consistently when expected, across its whole lifecycle |
| [Performance efficiency](https://docs.aws.amazon.com/wellarchitected/latest/framework/performance-efficiency.html) | Using cloud resources efficiently to meet performance requirements, and keeping that efficiency as demand and technology change |
| [Cost optimization](https://docs.aws.amazon.com/wellarchitected/latest/framework/cost-optimization.html) | Running systems to deliver business value at the lowest price point |
| [Sustainability](https://docs.aws.amazon.com/wellarchitected/latest/framework/sustainability.html) | Environmental impact, especially energy consumption and efficiency |

Sustainability is the newest pillar. AWS added it in November 2021, which took the framework from five pillars to six.

---

## Using /arckit:aws-research

`/arckit:aws-research` researches AWS services, architecture patterns and implementation guidance for your requirements, using the AWS Knowledge MCP server for authoritative AWS documentation. It rates each candidate service against the six pillars.

> **Agent Architecture**: This command uses a three-tier reader/writer subagent split. The slash command dispatches one **`arckit-aws-research-reader`** subagent per research category; each reader queries the AWS Knowledge MCP and returns evidence as JSON, keeping that I/O out of your main context window. The command validates each payload against the `cloud-research-handoff.schema.json` schema, scores every service against the six pillars from a fixed rubric, and excludes services that are unavailable in a region the project requires. The shared **`arckit-cloud-research-writer`** subagent then renders the artefact. On runtimes without subagent dispatch (Codex, Gemini, OpenCode, Copilot, Paperclip, Vibe, Kimi), the command ships as the equivalent single-agent `arckit-aws-research` prompt instead.

---

## Prerequisites

### AWS Knowledge MCP Server (REQUIRED)

This command **requires** the AWS Knowledge MCP server. It will not work without it.

The ArcKit Claude Code plugin bundles the server (`aws-knowledge`), so there is nothing to install. If your setup doesn't include it, add it to your MCP configuration. For Claude Code, that is the project `.mcp.json` (or `~/.claude.json` for user scope):

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

After adding it, restart Claude Code to load the MCP server.

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

Output: `projects/<id>/research/ARC-<id>-AWRS-<NNN>-v1.0.md` (`AWRS` is a multi-instance type, numbered `AWRS-001`, `AWRS-002`, and so on)

> **Auto-versioning**: Re-running this command when a document already exists automatically increments the version (minor for refreshed content, major for changed scope) instead of overwriting.

---

## Long runs: Remote Control + push notifications

`/arckit:aws-research` frequently exceeds 10 minutes as the agent issues dozens of AWS Knowledge MCP calls and fetches full documentation pages for cost and compliance analysis. To avoid babysitting the terminal, pair it with [Claude Code Remote Control](https://code.claude.com/docs/en/remote-control):

```bash
claude remote-control
```

Drive the session from claude.ai/code or the mobile app, then enable `/config → Push when Claude decides` so your phone gets a notification on completion or when the agent reaches a decision point (service shortlist confirmation, region selection). ArcKit's minimum Claude Code floor (v2.1.287) already covers the v2.1.110 RC requirement.

Caveats: Pro/Max plans only (no API keys, no Bedrock/Vertex/Foundry), push is a single on/off so chatty agents can over-notify, and the local `claude` process must keep running.

---

## MCP Tools Used

The command uses five AWS Knowledge MCP tools:

| Tool | Purpose |
|------|---------|
| `search_documentation` | Search AWS documentation for services, patterns, best practices |
| `read_documentation` | Retrieve complete documentation pages for detailed analysis |
| `get_regional_availability` | Check service/feature availability in the project's required regions (for UK projects, normally eu-west-2 London) |
| `list_regions` | Get all AWS regions for multi-region planning |

---

## Output Highlights

- **AWS Service Recommendations**: Mapped to specific requirements (FR, NFR, INT, DR)
- **Architecture Pattern**: Reference architecture from AWS Architecture Center
- **Well-Architected Assessment**: Each service scored 0 to 100 on all six pillars (including Sustainability) from a fixed rubric, using only capabilities the AWS documentation states; the star ratings are derived from those scores
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
- [AWS Well-Architected Framework](https://docs.aws.amazon.com/wellarchitected/latest/framework/welcome.html) - The framework and its six pillars
- [AWS Well-Architected](https://aws.amazon.com/architecture/well-architected/) - Tool, lenses and partner reviews
- [AWS Security Best Practices](https://aws.amazon.com/security/) - Security controls
- [Operational Best Practices for NCSC Cloud Security Principles](https://docs.aws.amazon.com/config/latest/developerguide/operational-best-practices-for-ncsc.html) - AWS Config conformance pack mapped to the NCSC principles
