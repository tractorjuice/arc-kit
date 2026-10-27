# AWS documentation MCP servers: Knowledge, Documentation, AWS MCP

> **Guide Origin**: Official | **ArcKit Version**: [VERSION]

AWS publishes three MCP servers that let an AI assistant search AWS documentation: AWS Knowledge, AWS Documentation and the AWS MCP Server. This guide compares them, says which to choose, and shows how to add each one to Claude Code.

---

## The three servers side by side

| | AWS Knowledge MCP Server | AWS MCP Server | AWS Documentation MCP Server |
|---|---|---|---|
| **What it is** | Hosted documentation server | Hosted server for documentation and AWS API calls, part of the Agent Toolkit for AWS | Open-source AWS Labs server |
| **Where it runs** | AWS, remote (streamable HTTP) | AWS, remote, one endpoint per Region | Your machine, as a local process (`uvx`) |
| **Endpoint** | `https://knowledge-mcp.global.api.aws` | `https://aws-mcp.<region>.api.aws/mcp` | None: runs locally |
| **AWS account or credentials** | Not needed | Not needed for documentation tools; IAM credentials for API tools | Its configuration takes no AWS profile or keys |
| **Documentation tools** | `search_documentation`, `read_documentation`, `list_regions`, `get_regional_availability`, `retrieve_skill` | `aws___search_documentation`, `aws___read_documentation`, `aws___list_regions`, `aws___get_regional_availability`, `aws___retrieve_skill` | `search_documentation`, `read_documentation`, `read_sections`, `search_table`, `recommend`, plus `get_available_services` for AWS China |
| **Tools that act on your account** | None | `aws___run_script`, `aws___get_presigned_url`, `aws___get_tasks` | None |
| **Regions** | Global | US East (N. Virginia), US West (Oregon), Asia Pacific (Singapore, Sydney, Tokyo), Europe (Frankfurt, Ireland, London) | Not applicable |
| **Status** | Generally available since 1 October 2025 | Generally available since 6 May 2026 | Open source, no deprecation notice |
| **Cost** | No cost | No additional charge; you pay for the AWS resources your agents use | Open source (Apache-2.0); you run it yourself |
| **Rate limits** | Rate-limited; no published figures | 10 requests a second per account per Region when authenticated; 5 a second per source IP address when not | Not documented |

Sources: the [AWS Knowledge MCP Server page](https://awslabs.github.io/mcp/servers/aws-knowledge-mcp-server) and [GA announcement](https://aws.amazon.com/about-aws/whats-new/2025/10/aws-knowledge-mcp-server-generally-available/); the AWS MCP Server [overview](https://docs.aws.amazon.com/agent-toolkit/latest/userguide/mcp-server.html), [tools](https://docs.aws.amazon.com/agent-toolkit/latest/userguide/understanding-mcp-server-tools.html), [quotas](https://docs.aws.amazon.com/agent-toolkit/latest/userguide/aws-mcp-limits.html), [GA announcement](https://aws.amazon.com/about-aws/whats-new/2026/05/aws-mcp-server/) and [Region expansion](https://aws.amazon.com/about-aws/whats-new/2026/10/aws-mcp-server-six-additional-regions/); the [AWS Documentation MCP Server page](https://awslabs.github.io/mcp/servers/aws-documentation-mcp-server).

### AWS Knowledge MCP Server

A remote server that AWS runs. It needs no authentication and no AWS account, but it is rate-limited. It indexes the AWS documentation and API references, What's New posts, Getting Started content, blog posts, architectural references, Well-Architected guidance, troubleshooting guides, Amplify, CDK and CloudFormation material, the Strands Agents SDK docs, and AWS agent skills. It also knows the regional availability of AWS services, features, SDK APIs and CloudFormation resources.

### AWS MCP Server

AWS's managed MCP server and the core of the [Agent Toolkit for AWS](https://aws.amazon.com/about-aws/whats-new/2026/05/agent-toolkit/). AWS's overview says agents "can search AWS documentation and retrieve service information without authentication". To call AWS APIs, run Python scripts in a sandbox or follow curated skills, agents authenticate with your IAM credentials, through OAuth 2.1 (AWS Sign-in) or SigV4 (the [MCP Proxy for AWS](https://github.com/aws/mcp-proxy-for-aws)). Every capability sits behind one endpoint, with IAM condition keys for guardrails, CloudWatch metrics, and CloudTrail logs of every API call.

It launched in US East (N. Virginia) and Europe (Frankfurt). Six more Regions were added on 2 October 2026. The server can reach services in all commercial AWS Regions, wherever its endpoint runs.

### AWS Documentation MCP Server

An open-source server from [AWS Labs](https://github.com/awslabs/mcp) that you run yourself. It needs `uv` and Python 3.10 or newer. Set `AWS_DOCUMENTATION_PARTITION` to `aws-cn` to search AWS China documentation instead of the global docs. Two tools have no counterpart on the hosted servers: `read_sections` fetches named sections of a page, and `search_table` returns matching rows from large tables such as service quotas or pricing.

The AWS Labs repository README says the Agent Toolkit for AWS "is the successor to the MCP servers, plugins, and skills available on AWS Labs". It also says the repository "continues to work and accept contributions".

---

## Which one to choose

- **You want documentation only, with no AWS account**: the AWS Knowledge MCP Server, or the AWS MCP Server without credentials. Unauthenticated use of the AWS MCP Server is limited to its read-only knowledge tools, at 5 requests a second per source IP address.
- **You want an agent to work in your AWS account**: the AWS MCP Server, authenticated with OAuth or SigV4. It is the only one of the three that can call AWS APIs, and IAM governs what it can do.
- **You need AWS China documentation, table search or section reads, or a server that runs locally**: the AWS Documentation MCP Server.

### AWS's switch recommendation

AWS's [AWS MCP Server setup guide](https://docs.aws.amazon.com/agent-toolkit/latest/userguide/getting-started-aws-mcp-server.html) says: "If you are currently using the AWS API MCP Server or AWS Knowledge MCP Server, we recommend switching to the AWS MCP Server." It asks you to remove the older entries from your MCP client configuration "to avoid tool conflicts that can confuse AI agents and reduce performance". The AWS Knowledge MCP Server and the AWS MCP Server expose documentation tools with the same names, so don't configure both in one client.

AWS has not deprecated the AWS Knowledge MCP Server. On 25 October 2026 its page still says "This MCP server is in general availability" and carries no deprecation notice.

---

## Add each server to Claude Code

The commands follow the forms in the [Claude Code MCP documentation](https://code.claude.com/docs/en/mcp). Add `--scope user` to make a server available in every project. Run `/mcp` afterwards to check the connection.

### AWS Knowledge MCP Server

```bash
claude mcp add --transport http aws-knowledge https://knowledge-mcp.global.api.aws
```

### AWS MCP Server

AWS's setup guide gives two ways in. With OAuth, attach the `AWSMCPSignInOAuthAccessPolicy` managed policy to your IAM role or user, then add the endpoint directly:

```bash
claude mcp add aws-mcp https://aws-mcp.us-east-1.api.aws/mcp --transport http
```

AWS says that when you first invoke a tool, your client opens a browser window to AWS Sign-in. To connect to another Region, change `us-east-1` in the URL.

With SigV4, sign in with the AWS CLI (version 2.32.0 or later) using `aws login`, install `uv`, and run the MCP Proxy for AWS as a local process:

```bash
claude mcp add-json aws-mcp '{"type":"stdio","command":"uvx","args":["mcp-proxy-for-aws-cli@latest","https://aws-mcp.us-east-1.api.aws/mcp","--metadata","AWS_REGION=us-west-2"],"env":{}}'
```

`AWS_REGION` sets the default Region for AWS operations. AWS suggests SigV4 if you use a terminal or IDE coding agent such as Claude Code, or switch between AWS accounts often.

AWS's [getting started page](https://docs.aws.amazon.com/agent-toolkit/latest/userguide/quick-start.html) also offers a Claude Code plugin that bundles the AWS MCP Server with AWS agent skills:

```text
/plugin install aws-core@claude-plugins-official
```

### AWS Documentation MCP Server

```bash
claude mcp add --env FASTMCP_LOG_LEVEL=ERROR --transport stdio aws-documentation \
  -- uvx awslabs.aws-documentation-mcp-server@latest
```

Add `--env AWS_DOCUMENTATION_PARTITION=aws-cn` before the server name for AWS China documentation.

---

## How ArcKit uses the AWS Knowledge MCP Server

The ArcKit core plugin bundles the AWS Knowledge MCP Server as `aws-knowledge`, pointing at `https://knowledge-mcp.global.api.aws`. It needs no AWS account and no key, so it works as soon as the plugin is installed.

[`/arckit:aws-research`](aws-research.md) is the command that uses it:

1. The command reads the project's requirements and groups them into three to six research categories.
2. It sends one reader subagent, `arckit-aws-research-reader`, to each category, up to six at a time.
3. Each reader can call only the AWS Knowledge tools `aws___search_documentation`, `aws___read_documentation`, `aws___get_regional_availability` and `aws___list_regions`, plus read-only file tools. It cannot reach the web or any other MCP server.
4. The reader checks every service against the project's required Regions with `aws___get_regional_availability`, rather than reading availability from documentation prose.
5. The command scores the evidence, and a writer subagent with no network tools renders the AWS research report (`ARC-<id>-AWRS-v1.0.md`).

The AWS Knowledge MCP Server has no tools that act on an AWS account, so a research run cannot change anything in AWS.

If you also add the AWS MCP Server to Claude Code yourself, ArcKit's tools keep their own `mcp__plugin_arckit_aws-knowledge__` prefix, so the two stay distinct. Your main conversation will still see two sets of AWS documentation tools, which is the overlap AWS's switch advice is about. ArcKit's reader subagent can only call its own server's tools either way.

See the [MCP server setup guide](mcp-servers.md) for approving tool calls and for timeouts on slow networks.

---

## Resources

- [AWS Knowledge MCP Server](https://awslabs.github.io/mcp/servers/aws-knowledge-mcp-server)
- [Agent Toolkit for AWS user guide](https://docs.aws.amazon.com/agent-toolkit/latest/userguide/what-is-agent-toolkit.html), including [setting up the AWS MCP Server](https://docs.aws.amazon.com/agent-toolkit/latest/userguide/getting-started-aws-mcp-server.html)
- [AWS Documentation MCP Server](https://awslabs.github.io/mcp/servers/aws-documentation-mcp-server)
- [AWS Labs MCP repository](https://github.com/awslabs/mcp)
- [AWS research guide](aws-research.md): the ArcKit command that uses the Knowledge server
- [Microsoft Learn MCP server](microsoft-learn-mcp.md) and [Google Developer Knowledge MCP server](gcp-research.md#google-developer-knowledge-mcp-server): the other two cloud documentation servers ArcKit bundles
