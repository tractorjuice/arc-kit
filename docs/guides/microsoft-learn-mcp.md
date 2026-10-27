# Microsoft Learn MCP server: setup, tools and endpoint

> **Guide Origin**: Official | **ArcKit Version**: [VERSION]

The Microsoft Learn MCP Server is Microsoft's free, hosted MCP server that lets AI assistants search and read official Microsoft documentation. This guide covers its tools, endpoint and limits, how to add it to Claude Code, Codex CLI, Gemini CLI and GitHub Copilot, and how ArcKit uses it.

---

## What the Microsoft Learn MCP Server is

Microsoft's [Learn MCP Server overview](https://learn.microsoft.com/training/support/mcp) describes a remote MCP server that brings "trusted and up-to-date information directly from Microsoft's official documentation" to clients such as GitHub Copilot and other AI agents. Agents can search the documentation, fetch a complete article and search code samples.

- **Name**: Microsoft released it on 12 June 2025 as the Microsoft Learn Docs MCP Server, and its [release notes](https://learn.microsoft.com/training/support/mcp-release-notes) and [FAQ](https://learn.microsoft.com/training/support/mcp-faq) still use that name. The overview page and the [MicrosoftDocs/mcp repository](https://github.com/MicrosoftDocs/mcp) now call it the Microsoft Learn MCP Server.
- **Status**: generally available since 7 November 2025.
- **What it covers**: publicly available Microsoft documentation, including Azure, and official code samples. It does not hold training content or user profile information.
- **Freshness**: the knowledge service behind it refreshes incrementally after content updates and runs a full refresh once a day.
- **Sign-in and cost**: no authentication is needed and there is no charge. Use is covered by the [Microsoft Learn Terms of Use](https://learn.microsoft.com/legal/termsofuse).

The server is an interface to the same Learn knowledge service that powers Ask Learn and Copilot for Azure.

## Endpoint

```text
https://learn.microsoft.com/api/mcp
```

The endpoint uses the streamable HTTP transport. It is built for MCP clients, so opening it in a browser returns `405 Method Not Allowed`.

Microsoft's [best practices page](https://learn.microsoft.com/training/support/mcp-best-practices) documents one option: add `?maxTokenBudget=2000` (or another number) to the URL to cap the size of search results. Fetched pages are always returned in full.

## Tools

| Tool | What it does |
|------|--------------|
| `microsoft_docs_search` | Semantic search across Microsoft's official technical documentation. Returns short content chunks with titles and URLs. |
| `microsoft_docs_fetch` | Fetches a Microsoft documentation page by URL and converts it to Markdown. |
| `microsoft_code_sample_search` | Searches official Microsoft and Azure code samples. Takes an optional `language` filter. |

Microsoft's [developer reference](https://learn.microsoft.com/training/support/mcp-developer-reference) warns that the tool list and its request formats may change. A client should call `tools/list` each time it connects rather than hard-code tool names.

## Limits

- **Rate limits**: Microsoft's FAQ says "As a public and free endpoint, our service does have rate limits in place to ensure fair usage". It publishes no figures.
- **No filtering**: the server cannot pre-filter results. Put the scope in the question instead.
- **Public content only**: no training modules, no user profile data, and nothing behind a sign-in.

---

## Add it to your assistant

ArcKit users don't need to do this: the ArcKit plugin already includes the server (see [How ArcKit uses it](#how-arckit-uses-it)). These steps are for adding it on its own.

### Claude Code

```bash
claude mcp add --transport http microsoft-learn https://learn.microsoft.com/api/mcp
```

This uses the `claude mcp add --transport http <name> <url>` form from the [Claude Code MCP documentation](https://code.claude.com/docs/en/mcp). Add `--scope user` to make it available in every project, or `--scope project` to share it through the repository's `.mcp.json`. Run `/mcp` to check that it connected.

Microsoft also publishes a Claude Code plugin that bundles the server with three agent skills. Its [getting started article](https://learn.microsoft.com/training/support/mcp-get-started) gives:

```text
/plugin marketplace add microsoftdocs/mcp
/plugin install microsoft-docs@microsoft-docs-marketplace
```

### Codex CLI

From the [MicrosoftDocs/mcp README](https://github.com/MicrosoftDocs/mcp):

```bash
codex mcp add microsoft-learn --url https://learn.microsoft.com/api/mcp
```

Or add it to `~/.codex/config.toml`, using the `[mcp_servers.<name>]` table that the [Codex MCP documentation](https://learn.chatgpt.com/docs/extend/mcp?surface=cli) describes:

```toml
[mcp_servers.microsoft-learn]
url = "https://learn.microsoft.com/api/mcp"
```

### Gemini CLI

Add the server to `~/.gemini/settings.json` (all projects) or `.gemini/settings.json` (one project):

```json
{
  "mcpServers": {
    "microsoft-learn": {
      "httpUrl": "https://learn.microsoft.com/api/mcp"
    }
  }
}
```

In Gemini CLI, `httpUrl` selects the streamable HTTP transport and `url` selects SSE, so use `httpUrl` here ([Gemini CLI MCP documentation](https://geminicli.com/docs/tools/mcp-server/)). The same page documents a command form: `gemini mcp add --transport http microsoft-learn https://learn.microsoft.com/api/mcp`.

### GitHub Copilot in VS Code

Add the server to `.vscode/mcp.json` in your workspace, or to the `mcp.json` in your VS Code user profile. VS Code uses a top-level `servers` key ([VS Code MCP configuration reference](https://code.visualstudio.com/docs/copilot/reference/mcp-configuration)):

```json
{
  "servers": {
    "microsoft-learn": {
      "type": "http",
      "url": "https://learn.microsoft.com/api/mcp"
    }
  }
}
```

Microsoft's README also offers a one-click install button, or you can search for `@mcp learn` in the Extensions view.

### GitHub Copilot CLI

Microsoft's getting started article gives:

```text
/plugin install microsoftdocs/mcp
```

---

## How ArcKit uses it

The ArcKit core plugin bundles the Microsoft Learn MCP Server as `microsoft-learn`, pointing at `https://learn.microsoft.com/api/mcp`. It needs no key and no sign-in, so it works as soon as the plugin is installed.

[`/arckit:azure-research`](azure-research.md) is the command that uses it:

1. The command reads the project's requirements and groups them into three to six research categories, such as "Container orchestration" or "Managed identity".
2. It sends one reader subagent, `arckit-azure-research-reader`, to each category, up to six at a time.
3. Each reader can call only the three Microsoft Learn tools above, plus read-only file tools. It cannot reach the web or any other MCP server, and it returns cited evidence, not recommendations.
4. The server has no region-availability tool, so the reader takes region evidence from Azure's products-by-region documentation page.
5. The command scores the evidence, and a writer subagent with no network tools renders the Azure research report (`ARC-<id>-AZRS-v1.0.md`).

Claude Code asks before the first Microsoft Learn tool call. To stop it asking, add `mcp__plugin_arckit_microsoft-learn` to `permissions.allow`, as the [MCP server setup guide](mcp-servers.md#approving-mcp-tool-calls) shows. On a slow or TLS-inspecting network, raise `MCP_TOOL_TIMEOUT` as described in [MCP per-request timeout](mcp-servers.md#optional-mcp-per-request-timeout-claude-code-v21142).

---

## Resources

- [Microsoft Learn MCP Server overview](https://learn.microsoft.com/training/support/mcp)
- [Developer reference](https://learn.microsoft.com/training/support/mcp-developer-reference), [best practices](https://learn.microsoft.com/training/support/mcp-best-practices), [release notes](https://learn.microsoft.com/training/support/mcp-release-notes) and [FAQ](https://learn.microsoft.com/training/support/mcp-faq)
- [MicrosoftDocs/mcp on GitHub](https://github.com/MicrosoftDocs/mcp): setup for other clients, issues and discussions
- [Azure research guide](azure-research.md): the ArcKit command that uses this server
- [AWS documentation MCP servers](aws-documentation-mcp.md) and [Google Developer Knowledge MCP server](gcp-research.md#google-developer-knowledge-mcp-server): the other two cloud documentation servers ArcKit bundles
