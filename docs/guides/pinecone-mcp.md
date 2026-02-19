# Pinecone MCP Integration Guide

Pinecone is an optional vector database MCP that enables semantic search across architecture artifacts and organisational documents. Unlike the bundled MCPs (AWS Knowledge, Microsoft Learn, Google Developer Knowledge, Data Commons), Pinecone is **not included in the ArcKit plugin** and must be configured separately.

> **Optional Integration**: This MCP is for advanced users who want semantic search capabilities. ArcKit works fully without it.

---

## What Pinecone MCP Provides

Pinecone's MCP server offers 9 tools for vector database operations:

| Tool | Purpose |
|------|---------|
| `search-docs` | Search Pinecone documentation |
| `list-indexes` | List available indexes |
| `describe-index` | Get index details |
| `describe-index-stats` | Get index statistics |
| `create-index-for-model` | Create new indexes |
| `upsert-records` | Insert/update vector records |
| `search-records` | Query with metadata filtering & reranking |
| `cascading-search` | Search across multiple indexes |
| `rerank-documents` | Rerank results using specialised models |

---

## Wardley Book Knowledge Base

ArcKit maintains a Pinecone vector database containing Simon Wardley's complete published works on Wardley Mapping — doctrine, case studies, strategic plays, evolution analysis, and climatic patterns.

When the Pinecone MCP is configured, the `/arckit.wardley` command automatically searches this knowledge base to:

- **Ground component positioning** in Wardley's analysis of evolution stages
- **Find relevant case studies** matching the project's domain and strategic situation
- **Identify applicable gameplay patterns** with examples from the books
- **Surface doctrine lessons** relevant to the organisation's context

This complements the local reference files (`wardley-mapping/references/`) which contain curated extracts. The Pinecone index provides access to the full depth of the source material — extended reasoning, historical examples, and nuanced strategic advice.

---

## Other Use Cases

| Use Case | Description |
|----------|-------------|
| **Cross-project search** | "Which projects have requirements related to data sovereignty?" across dozens of projects |
| **Impact analysis** | "What stakeholders and risks are affected by a change to the authentication service?" |
| **Duplicate detection** | Find overlapping or contradictory requirements across projects |
| **Portfolio search** | "Show me all ADRs related to cloud migration decisions" |
| **Policy alignment** | Check architecture decisions against existing corporate policies and standards |
| **Knowledge discovery** | Surface relevant existing documentation when starting a new project |

---

## Prerequisites

1. **Pinecone account** — Free tier available (limited to 1 index). Sign up at https://www.pinecone.io/
2. **Pinecone API key** — Generate from the Pinecone console
3. **Node.js** — Required to run the MCP server via `npx`

---

## Configuration

Add to your project `.mcp.json` (not the plugin — configure per-project):

```json
{
  "mcpServers": {
    "pinecone": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "@pinecone-database/mcp"],
      "env": {
        "PINECONE_API_KEY": "${PINECONE_API_KEY}"
      }
    }
  }
}
```

Set the environment variable:

```bash
export PINECONE_API_KEY="your-api-key-here"
```

Restart Claude Code after adding the configuration.

---

## How It Differs from Bundled MCPs

| | Bundled MCPs | Pinecone |
|---|---|---|
| **Included in plugin** | Yes (auto-configured) | No (user-configured) |
| **Server type** | `http` (remote endpoint) | `stdio` (local process) |
| **Local dependencies** | None | Node.js required |
| **Cost** | Free (AWS, Microsoft Learn) or free API key (Google, Data Commons) | Free tier limited; paid for production |
| **Data** | Pre-loaded (documentation, public datasets) | Wardley books index pre-populated; other indexes user-managed |
| **Setup effort** | Zero-config or env var only | Account + API key + Node.js |

---

## ArcKit Command Integration

| Command | How Pinecone is used |
|---------|---------------------|
| `/arckit.wardley` | Searches Wardley book corpus for relevant strategic context, case studies, gameplay patterns, and evolution analysis to ground map creation |

The wardley command detects Pinecone tools automatically and uses them when available. If not configured, it falls back to local reference files — no functionality is lost.

---

## Working Example

The `arckit-test-project-v7-nhs-appointment` test repo has a working Pinecone MCP configuration that can be used as a reference.

---

## Resources

- [Pinecone MCP Server Documentation](https://docs.pinecone.io/guides/operations/mcp-server)
- [Pinecone MCP GitHub](https://github.com/pinecone-io/pinecone-mcp)
- [Pinecone Console](https://app.pinecone.io/) — API key management
- [Pinecone Free Tier](https://www.pinecone.io/pricing/) — 1 index, 2GB storage
