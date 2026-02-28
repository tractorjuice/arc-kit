# ArcKit Plugin Setup Guide

This guide covers installing the ArcKit plugin, configuring MCP servers, and complementary plugins that enhance architecture workflows.

---

## Installing the ArcKit Plugin

### Prerequisites

- **Claude Code** v2.1.50 or later (or **Claude Cowork** desktop app)
- **Bash** shell (for helper scripts)

### Step 1: Add the marketplace

In Claude Code, run:

```text
/plugin marketplace add tractorjuice/arc-kit
```

### Step 2: Install the plugin

```text
/plugin
```

Go to the **Discover** tab, find **arckit**, and install it. Or via CLI:

```bash
claude plugin install arckit@arc-kit
```

### Step 3: Restart Claude Code

The plugin loads MCP servers and hooks at startup. **A restart is required** after first installation.

### Verifying installation

After restart, open the plugin manager (`/plugin`) and navigate to **Installed**. You should see:

- **Commands**: 53 slash commands
- **Agents**: 5 autonomous research agents
- **Skills**: 1 (Wardley Mapping)
- **Hooks**: SessionStart, UserPromptSubmit, PreToolUse, PermissionRequest

> **Tip**: You may see 2 MCP errors about missing API keys for Google and Data Commons. These are harmless — see [Servers Requiring API Keys](#servers-requiring-api-keys) below.

### Auto-enabling for team repos

To have the plugin auto-enable for anyone who opens your repo, add `.claude/settings.json`:

```json
{
  "extraKnownMarketplaces": {
    "arc-kit": {
      "source": {
        "source": "github",
        "repo": "tractorjuice/arc-kit"
      }
    }
  },
  "enabledPlugins": {
    "arckit@arc-kit": true
  }
}
```

---

## MCP Servers

ArcKit includes 4 bundled MCP (Model Context Protocol) servers for cloud research, plus support for optional third-party MCPs like Pinecone.

> **Two servers work out of the box** (AWS Knowledge, Microsoft Learn). The other two require free API keys (Google Developer Knowledge, Data Commons). If you don't configure the API keys, you'll see errors in the plugin UI — **these are harmless and all other commands work normally**.

---

## Bundled MCP Servers

| MCP Server | API Key | Used By | Status |
|------------|---------|---------|--------|
| AWS Knowledge | Not required | `/arckit:aws-research` | Works out of the box |
| Microsoft Learn | Not required | `/arckit:azure-research` | Works out of the box |
| Google Developer Knowledge | `GOOGLE_API_KEY` | `/arckit:gcp-research` | Requires setup |
| Data Commons | `DATA_COMMONS_API_KEY` | Data statistics lookups | Requires setup |

---

## No-Setup Servers

### AWS Knowledge

Provides access to official AWS documentation, service details, regional availability, and architecture guidance.

- **Type**: HTTP (remote endpoint)
- **Commands**: `/arckit:aws-research`
- **Tools**: `search_documentation`, `read_documentation`, `get_regional_availability`, `list_regions`, `recommend`
- **Setup**: None — works immediately after plugin installation

### Microsoft Learn

Provides access to official Microsoft and Azure documentation, code samples, and architecture guidance.

- **Type**: HTTP (remote endpoint)
- **Commands**: `/arckit:azure-research`
- **Tools**: `microsoft_docs_search`, `microsoft_code_sample_search`, `microsoft_docs_fetch`
- **Setup**: None — works immediately after plugin installation

---

## Servers Requiring API Keys

### Google Developer Knowledge

Provides access to Google Cloud documentation for GCP service research.

- **Type**: HTTP (remote endpoint)
- **Commands**: `/arckit:gcp-research`
- **Tools**: `search_documents`, `get_document`, `batch_get_documents`

**Setup**:

1. Get a free API key from [Google AI Studio](https://aistudio.google.com/apikey) or the [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Set the environment variable:

```bash
# Add to your shell profile (~/.bashrc, ~/.zshrc, etc.)
export GOOGLE_API_KEY="your-api-key-here"
```

3. Restart Claude Code

### Data Commons

Provides access to public statistical data from Data Commons (demographics, economics, health, environment) for grounding architecture decisions in real-world data.

- **Type**: HTTP (remote endpoint)
- **Commands**: Used by research commands for data lookups
- **Tools**: Various data query tools

**Setup**:

1. Get an API key from [Data Commons](https://datacommons.org)
2. Set the environment variable:

```bash
# Add to your shell profile (~/.bashrc, ~/.zshrc, etc.)
export DATA_COMMONS_API_KEY="your-api-key-here"
```

3. Restart Claude Code

---

## Troubleshooting

### "Missing environment variables" errors in plugin UI

```text
Invalid MCP server config for 'google-developer-knowledge': Missing environment variables: GOOGLE_API_KEY
Invalid MCP server config for 'datacommons-mcp': Missing environment variables: DATA_COMMONS_API_KEY
```

**These errors are harmless.** They mean you haven't configured the optional API keys. All 53 commands, 5 agents, hooks, and skills work without them. Only `/arckit:gcp-research` and Data Commons lookups are affected.

**To fix**: Set the environment variables as described above and restart Claude Code.

### MCP server not responding after setup

1. Verify the environment variable is set: `echo $GOOGLE_API_KEY`
2. Restart Claude Code (MCP servers load at startup)
3. Check the plugin UI — errors should disappear once the key is valid

### API key works but commands fail

- **Google**: Ensure the API key has the "Generative Language API" enabled in Google Cloud Console
- **Data Commons**: Ensure the key is active and not rate-limited

---

## Optional Third-Party MCPs

ArcKit also supports integration with third-party MCP servers that are **not bundled** with the plugin. These must be configured per-project in your `.mcp.json`.

| MCP | Purpose | Guide |
|-----|---------|-------|
| Pinecone | Vector search across architecture artifacts and Wardley Mapping knowledge base | [Pinecone MCP Guide](pinecone-mcp.md) |

---

## Configuration Reference

The plugin's bundled MCP configuration (`.mcp.json`):

```json
{
  "mcpServers": {
    "aws-knowledge": {
      "type": "http",
      "url": "https://knowledge-mcp.global.api.aws"
    },
    "microsoft-learn": {
      "type": "http",
      "url": "https://learn.microsoft.com/api/mcp"
    },
    "google-developer-knowledge": {
      "type": "http",
      "url": "https://developerknowledge.googleapis.com/mcp",
      "headers": {
        "X-Goog-Api-Key": "${GOOGLE_API_KEY}"
      }
    },
    "datacommons-mcp": {
      "type": "http",
      "url": "https://api.datacommons.org/mcp",
      "headers": {
        "X-API-Key": "${DATA_COMMONS_API_KEY}"
      }
    }
  }
}
```

> **Note**: You do not need to copy this configuration — it is automatically loaded by the plugin. This is shown for reference only.

---

## Complementary Skills for Architects

Anthropic publishes document skills in the `anthropics/skills` marketplace that pair well with ArcKit. These skills let Claude produce polished, client-ready deliverables directly from ArcKit's Markdown artifacts.

### Installing the document skills

```text
/plugin marketplace add anthropics/skills
/plugin
```

Navigate to **Discover** > **anthropic-agent-skills** > **document-skills** and install.

### Available document skills

| Skill | What it does | Architecture use case |
|-------|-------------|----------------------|
| **PDF** (`/pdf`) | Create and edit PDF documents | Export requirements, risk registers, or business cases as formatted PDFs for stakeholder review |
| **DOCX** (`/docx`) | Create and edit Word documents | Produce editable architecture documents for governance boards that require Word format |
| **PPTX** (`/pptx`) | Create and edit PowerPoint presentations | Turn `/arckit:presentation` output or architecture summaries into slide decks for steering committees |
| **XLSX** (`/xlsx`) | Create and edit Excel spreadsheets | Export evaluation matrices, risk scores, or FinOps data into spreadsheets for analysis |

### Example workflows

**Architecture board submission**:

1. Run `/arckit:sobc` to generate a Strategic Outline Business Case
2. Use `/docx` to convert it into a branded Word document with your organisation's template
3. Use `/pptx` to create an executive summary deck from the key findings

**Vendor evaluation pack**:

1. Run `/arckit:evaluate` to score vendors
2. Use `/xlsx` to export the evaluation matrix as a spreadsheet
3. Use `/pdf` to create a sealed PDF for procurement records

**Stakeholder briefing**:

1. Run `/arckit:stakeholders` and `/arckit:requirements`
2. Use `/pptx` to build a slide deck covering stakeholder map, goals, and top-level requirements
3. Share with project sponsors for sign-off

> **Note**: The document skills are maintained by Anthropic in a separate marketplace (`anthropics/skills`). They are not part of the ArcKit plugin but complement it well. They work in both Claude Code and Claude Cowork.

For detailed workflows and real-world examples, see the [Architecture Productivity Guide](productivity.md).

---

## Resources

- [AWS Knowledge MCP](https://awslabs.github.io/mcp/servers/aws-knowledge-mcp-server) — AWS documentation server
- [Microsoft Learn MCP](https://learn.microsoft.com/api/mcp) — Azure documentation server
- [Google Developer Knowledge MCP](https://developerknowledge.googleapis.com/mcp) — Google Cloud documentation server
- [Data Commons](https://datacommons.org) — Public statistical data
- [Model Context Protocol](https://modelcontextprotocol.io/) — MCP specification
- [Anthropic Skills](https://github.com/anthropics/skills) — Document skills (PDF, DOCX, PPTX, XLSX)
- [Claude Plugins Directory](https://claude.com/plugins) — Browse all available plugins
