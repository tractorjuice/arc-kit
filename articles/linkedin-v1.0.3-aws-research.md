# LinkedIn Post - ArcKit v1.0.3

**Date:** 2026-01-29
**Release:** v1.0.3 - AWS Research with AWS Knowledge MCP

---

**ArcKit v1.0.3: AWS Research Powered by Model Context Protocol**

Just shipped the second cloud research command for ArcKit: `/arckit.aws-research`

This command connects directly to AWS's official documentation via the AWS Knowledge MCP server — giving you authoritative, real-time guidance instead of outdated training data.

**What makes it powerful:**

→ Maps your requirements directly to AWS services
→ Pulls reference architectures from AWS Architecture Center
→ Assesses against all 6 Well-Architected Framework pillars (including Sustainability)
→ Maps to AWS Security Hub controls
→ **Real-time regional availability checks** for eu-west-2 (London)
→ Generates CloudFormation, CDK, and Terraform templates
→ Includes UK Government compliance (G-Cloud, NCSC)

**The regional availability check is the game-changer.**

Before deploying to UK Government projects, you need to know if services are available in eu-west-2 (London). The `get_regional_availability` MCP tool checks this in real-time — no more discovering limitations after you've designed the architecture.

**Cloud Research commands now available:**

| Command | MCP Server |
|---------|------------|
| `/arckit.azure-research` | Microsoft Learn MCP |
| `/arckit.aws-research` | AWS Knowledge MCP |
| `/arckit.gcp-research` | Coming soon |

**Quick start:**

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

Then run:
```
/arckit.aws-research Research AWS services for [your project]
```

ArcKit now has **42 commands** for enterprise architecture governance.

📖 Guide: https://github.com/tractorjuice/arc-kit/blob/main/docs/guides/aws-research.md
📦 Release: https://github.com/tractorjuice/arc-kit/releases/tag/v1.0.3

#EnterpriseArchitecture #AWS #MCP #CloudArchitecture #AIAssistants #ClaudeCode #UKGov #WellArchitected

---

**Character count:** ~1,650 (within LinkedIn's 3,000 character limit)

**Key messaging:**
- Real-time documentation access via MCP
- Regional availability checking (unique to AWS MCP)
- UK Government focus (eu-west-2, G-Cloud)
- 42 commands milestone
- Part of cloud research series (Azure done, GCP planned)
