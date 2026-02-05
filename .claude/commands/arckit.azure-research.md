---
description: Research Azure services and architecture patterns using Microsoft Learn MCP for authoritative guidance
tags: [azure, microsoft, cloud, architecture, mcp, research, well-architected, security-benchmark]
---

# Azure Technology Research

## User Input

```text
$ARGUMENTS
```

## Instructions

This command performs Azure-specific technology research using the Microsoft Learn MCP server to match project requirements to Azure services, architecture patterns, Well-Architected guidance, Security Benchmark controls, and UK Government compliance.

**This command delegates to the `arckit-azure-research` agent** which runs as an autonomous subprocess. The agent makes 15-30+ MCP calls (microsoft_docs_search, microsoft_docs_fetch, microsoft_code_sample_search) to gather authoritative Azure documentation — running in its own context window to avoid polluting the main conversation with large documentation chunks.

### What to Do

1. **Determine the project**: If the user specified a project name/number, note it. Otherwise, identify the most recent project in `projects/`.

2. **Launch the agent**: Use the Task tool with `subagent_type: "general-purpose"` and include in the prompt:
   - The project directory path
   - The user's arguments
   - Instruct it to follow the Azure research agent process defined in `.claude/agents/arckit-azure-research.md`
   - Tell it to read that agent file first for its full instructions

3. **Report the result**: When the agent completes, relay its summary to the user.

### Alternative: Direct Execution

If the Task tool is unavailable or the user prefers inline execution, fall back to the full research process:

1. **Check MCP availability first** — verify `microsoft_docs_search`, `microsoft_docs_fetch`, `microsoft_code_sample_search` tools exist. If not, STOP and show installation instructions:
   ```
   Add to .mcp.json:
   { "mcpServers": { "microsoft-docs": { "command": "npx", "args": ["-y", "@anthropic/mcp-server-microsoft-docs"] } } }
   ```
2. Check prerequisites (requirements document must exist)
3. **Read the template** (with user override support):
   - **First**, check if `.arckit/templates-custom/azure-research-template.md` exists (user override)
   - **If found**: Read the user's customized template
   - **If not found**: Read `.arckit/templates/azure-research-template.md` (default)
   - Read the `VERSION` file and update the version in the template metadata line when generating
   - **Tip**: Users can customize templates with `/arckit.customize azure-research`
4. Extract Azure service needs from requirements (compute, data, integration, security, AI/ML)
5. Use MCP tools for each category: service discovery, deep dive, architecture patterns, Well-Architected assessment, Security Benchmark mapping, code samples
6. UK Government: G-Cloud, UK South/West data residency, NCSC compliance
7. Cost estimation with optimization (Reserved Instances, Azure Hybrid Benefit, Spot VMs)
8. Generate Mermaid architecture diagram
9. Write to `projects/{project-dir}/research/ARC-{PROJECT_ID}-AZRS-v1.0.md` using Write tool
10. Show summary only (not full document)

### Output

The agent writes the full research document to file and returns a summary including:
- Azure services recommended per category
- Architecture pattern and reference
- Security alignment (Security Benchmark, Well-Architected)
- UK Government suitability (G-Cloud, UK regions, classification)
- Estimated monthly cost
- Next steps (`/arckit.diagram`, `/arckit.secure`, `/arckit.devops`)

## Integration with Other Commands

- **Input**: Requires requirements document (`ARC-*-REQ-*.md`)
- **Input**: Uses data model (`ARC-*-DATA-*.md`) for database selection
- **Output**: Feeds into `/arckit.diagram` (Azure-specific diagrams)
- **Output**: Feeds into `/arckit.secure` (validates against Secure by Design)
- **Output**: Feeds into `/arckit.devops` (Azure DevOps pipeline design)
- **Output**: Feeds into `/arckit.finops` (Azure cost management strategy)

## Resources

- **Microsoft Learn MCP**: https://www.npmjs.com/package/@anthropic/mcp-server-microsoft-docs
- **Azure Architecture Center**: https://learn.microsoft.com/azure/architecture/
- **Azure Well-Architected**: https://learn.microsoft.com/azure/well-architected/
- **Azure Security Benchmark**: https://learn.microsoft.com/security/benchmark/azure/
- **Digital Marketplace (Azure)**: https://www.digitalmarketplace.service.gov.uk/g-cloud/search?q=azure
