# LinkedIn Post - ArcKit v1.0.2

**Date:** 2026-01-29
**Release:** v1.0.2 - Azure Research with Microsoft Learn MCP

---

**ArcKit v1.0.2: Azure Research Powered by Model Context Protocol**

Excited to release ArcKit's first MCP-powered command: `/arckit.azure-research`

This command uses the Microsoft Learn MCP server to access **official Azure documentation in real-time** — no more outdated training data or hallucinated service names.

**What it does:**

→ Maps your requirements directly to Azure services
→ Pulls reference architectures from Azure Architecture Center
→ Assesses against all 5 Well-Architected Framework pillars
→ Maps to 12 Azure Security Benchmark control domains
→ Generates Bicep/Terraform templates with real code samples
→ Includes UK Government compliance (G-Cloud, UK regions, NCSC)

**Why MCP matters for architecture:**

Traditional AI assistants work from static training data. MCP connects directly to authoritative sources — in this case, Microsoft Learn — giving you current, accurate guidance every time.

This is the first in a planned series:

| Command | Status |
|---------|--------|
| `/arckit.azure-research` | Live |
| `/arckit.aws-research` | Coming soon |
| `/arckit.gcp-research` | Coming soon |

**See it in action:**

Example output: https://tractorjuice.github.io/arckit-test-project-v14-scottish-courts/#projects/001-scts-genai-programme/research/ARC-001-AZRS-v1.0.md

**Try it:**

```
arckit init my-project --ai claude
/arckit.azure-research Research Azure services for [your project]
```

Requires: Microsoft Learn MCP server (`@anthropic/mcp-server-microsoft-docs`)

📖 Guide: https://github.com/tractorjuice/arc-kit/blob/main/docs/guides/azure-research.md
📦 Release: https://github.com/tractorjuice/arc-kit/releases/tag/v1.0.2

ArcKit now has **41 commands** for enterprise architecture governance.

#EnterpriseArchitecture #Azure #MCP #AIAssistants #ClaudeCode #CloudArchitecture #UKGov

---

**Character count:** ~1,450 (within LinkedIn's 3,000 character limit)

**Key messaging:**
- First MCP-powered command
- Real-time documentation access
- UK Government focus
- Part of cloud research series
