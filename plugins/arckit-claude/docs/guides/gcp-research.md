# Google Cloud research with the Developer Knowledge MCP server

> **Guide Origin**: Official | **ArcKit Version**: [VERSION]

The Google Developer Knowledge MCP server lets AI assistants search and read Google's official developer documentation, including Google Cloud. This guide covers how to set it up and how `/arckit:gcp-research` uses it to research Google Cloud services, architecture patterns and implementation guidance.

> **How the command runs**: `/arckit:gcp-research` runs in your main session and sends a reader subagent to each research category. Only the readers call the MCP server, so the documentation they gather stays in their own context windows. A writer subagent with no network tools then renders the report.

---

## Google Developer Knowledge MCP server

Google's [Developer Knowledge MCP server page](https://developers.google.com/knowledge/mcp) says it "gives AI-powered development tools direct access to search and retrieve official Google developer documentation". It is the MCP face of the [Developer Knowledge API](https://developers.google.com/knowledge/api). Both entered public preview on 4 February 2026 and became generally available on 16 April 2026 ([release notes](https://developers.google.com/knowledge/release-notes)).

- **What it covers**: public Google developer documentation, in English only. The domains include Google Cloud (`cloud.google.com` and `docs.cloud.google.com`), Firebase, Android, Google Maps Platform, Chrome, Flutter, Dart, Go, Google AI, Google Workspace, web.dev and TensorFlow. GitHub, blogs and YouTube are not included. Google aims to re-index new or updated pages within 48 hours.
- **Endpoint**: `https://developerknowledge.googleapis.com/mcp` (global, streamable HTTP).
- **Key**: it needs credentials. For Claude Code, Cursor, GitHub Copilot and Codex, Google recommends an API key sent in the `X-Goog-Api-Key` header. OAuth and Application Default Credentials also work.

### Get an API key

Google's steps, from the MCP server page:

1. In a Google Cloud project, open the [Developer Knowledge API](https://console.cloud.google.com/apis/library/developerknowledge.googleapis.com) page and select **Enable**. Since 17 March 2026, enabling the API also enables the MCP server.
2. Go to the [Credentials page](https://console.cloud.google.com/apis/credentials), select **Create credentials**, then **API key**.
3. Edit the key, choose **Restrict key** under API restrictions, and select **Developer Knowledge API**.

With the gcloud CLI:

```bash
gcloud services enable developerknowledge.googleapis.com --project=PROJECT_ID
gcloud services api-keys create --project=PROJECT_ID --display-name="DK API Key"
```

Then restrict the key with `gcloud services api-keys update KEY_NAME --api-target=service=developerknowledge.googleapis.com`.

### Tools

| Tool | What it does |
|------|--------------|
| `search_documents` | Searches Google developer documentation and returns the most relevant page excerpts with their document names. |
| `get_documents` | Retrieves the full Markdown content of up to 20 documents in one call, using the names `search_documents` returns. |
| `answer_query` | Generates a structured answer drawn from the Developer Knowledge corpus. |

Google removed the earlier `get_document` and `batch_get_documents` tools on 8 March 2026 and replaced them with `get_documents`.

### Quotas

The [default quotas](https://developers.google.com/knowledge/quota) are per Google Cloud project: 100 search requests a minute, 100 document retrieval requests a minute, and 50 generated answers a day. A request over quota returns `429 RESOURCE_EXHAUSTED`.

### Add it to Claude Code on its own

ArcKit users don't need this, because the plugin already includes the server. To add it to Claude Code without ArcKit, Google gives:

```bash
claude mcp add google-developer-knowledge \
  --transport http https://developerknowledge.googleapis.com/mcp \
  --header "X-Goog-Api-Key: YOUR_API_KEY"
```

Google's page also covers Antigravity, Cursor, GitHub Copilot in VS Code, Codex and other clients.

### How ArcKit uses it

The ArcKit core plugin bundles the server as `google-developer-knowledge` and sends your key in the `X-Goog-Api-Key` header. `/arckit:gcp-research` is the only command that uses it. Each reader subagent can call only this server's tools, plus read-only file tools. The server has no region-availability tool, so readers take region evidence from Google Cloud's locations documentation.

Without a key the server shows as failed in `/mcp`, and the error may mention dynamic client registration. Google's remote MCP servers don't support OAuth Dynamic Client Registration, so a keyless connection has no other way to sign in. Everything else in ArcKit still works.

---

## Prerequisites

### Google Developer Knowledge MCP Server (REQUIRED)

This command **requires** the Google Developer Knowledge MCP server. It will not work without it.

**API Key Required**: unlike the AWS Knowledge and Microsoft Learn MCP servers, which need no sign-in, the Google Developer Knowledge MCP server needs an API key. Create one in the Google Cloud console as described in [Get an API key](#get-an-api-key).

**Setup**: the ArcKit plugin already includes this server; you only supply the key.

- **Claude Code:** the plugin asks for the Google API key when you enable it, as a sensitive setting kept in your system keychain. To add or change it later, open `/plugin`, choose **arckit**, and open its configure screen (or run `claude plugin configure arckit` on Claude Code v2.1.285+). Without a key the server shows as failed in `/mcp`, and everything else in ArcKit still works.
- **Other assistants** (Codex CLI, Gemini CLI, OpenCode, GitHub Copilot, Kimi, Mistral Vibe) read it from the environment: `export GOOGLE_API_KEY="your-api-key-here"`, then restart the assistant.

**Slow corporate network?** On TLS-inspecting proxies, VPN tunnels, or congested links, large-scope research prompts can exceed Claude Code's default per-request fetch timeout. Set `MCP_TOOL_TIMEOUT=300000` (5 minutes, in milliseconds) before launching Claude — see [MCP per-request timeout](mcp-servers.md#optional-mcp-per-request-timeout-claude-code-v21142) in the MCP setup guide. Requires Claude Code v2.1.142+.

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
/arckit:gcp-research Research Google Cloud services for <project>
```

Outputs: `projects/<id>/research/ARC-<id>-GCRS-v1.0.md`

> **Auto-versioning**: Re-running this command when a document already exists automatically increments the version (minor for refreshed content, major for changed scope) instead of overwriting.

---

## Long runs: Remote Control + push notifications

`/arckit:gcp-research` frequently exceeds 10 minutes as the agent issues dozens of Google Developer Knowledge MCP calls and fetches full documentation pages for cost and compliance analysis. To avoid babysitting the terminal, pair it with [Claude Code Remote Control](https://code.claude.com/docs/en/remote-control):

```bash
claude remote-control
```

Drive the session from claude.ai/code or the mobile app, then enable `/config → Push when Claude decides` so your phone gets a notification on completion or when the agent reaches a decision point (service shortlist confirmation, region selection). ArcKit's minimum Claude Code floor (v2.1.287) already covers the v2.1.110 RC requirement.

Caveats: Pro/Max plans only (no API keys, no Bedrock/Vertex/Foundry), push is a single on/off so chatty agents can over-notify, and the local `claude` process must keep running.

---

## MCP Tools Used

The research uses the Google Developer Knowledge MCP tools to find and read documentation:

| Tool | Purpose |
|------|---------|
| `search_documents` | Search Google Cloud documentation for services, patterns, best practices |
| `get_documents` | Retrieve complete documentation pages, up to 20 in one call, for detailed analysis |

Google replaced the earlier `get_document` and `batch_get_documents` tools with `get_documents` on 8 March 2026. See [Tools](#tools) for the full list.

---

## Output Highlights

- **Google Cloud Service Recommendations**: Mapped to specific requirements (FR, NFR, INT, DR)
- **Architecture Pattern**: Reference architecture from Google Cloud Architecture Center
- **Architecture Framework Assessment**: All 6 pillars evaluated per service. Google now calls this the [Google Cloud Well-Architected Framework](https://docs.cloud.google.com/architecture/framework).
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

- Feed Google Cloud findings into `/arckit:diagram` for GCP architecture diagrams
- Run `/arckit:secure` to validate against UK Secure by Design
- Run `/arckit:devops` to plan Cloud Build CI/CD pipelines
- Run `/arckit:finops` to create Google Cloud FinOps cost management strategy
- Run `/arckit:adr` to document Google Cloud service selection decisions

---

## Comparison with /arckit:research

| Feature | `/arckit:research` | `/arckit:gcp-research` |
|---------|-------------------|------------------------|
| Scope | Multi-cloud, SaaS, open-source | Google Cloud-specific only |
| Source | Web search, multiple sources | Google Developer Knowledge MCP (authoritative) |
| Depth | Build vs buy analysis | Deep Google Cloud service analysis |
| Compliance | General UK Gov | Google Cloud-specific UK compliance |
| Code samples | Limited | Terraform, Cloud Build |
| Cost estimates | High-level | Detailed Google Cloud pricing |

**When to use which**:

- Use `/arckit:research` for cloud-agnostic evaluation or build vs buy
- Use `/arckit:gcp-research` when Google Cloud is the target platform

---

## Resources

- [Google Developer Knowledge MCP server](https://developers.google.com/knowledge/mcp) - setup, tools and troubleshooting
- [Developer Knowledge API quotas](https://developers.google.com/knowledge/quota) - default limits
- [Google Cloud Architecture Center](https://cloud.google.com/architecture) - Reference architectures
- [Google Cloud Well-Architected Framework](https://docs.cloud.google.com/architecture/framework) - Design guidance (formerly the Architecture Framework)
- [Microsoft Learn MCP server](microsoft-learn-mcp.md) and [AWS documentation MCP servers](aws-documentation-mcp.md) - the other two cloud documentation servers ArcKit bundles
- [Google Cloud Security Best Practices](https://cloud.google.com/security/best-practices) - Security controls
- [Google Cloud UK Compliance](https://cloud.google.com/security/compliance/offerings#/regions=Europe) - UK Government compliance
