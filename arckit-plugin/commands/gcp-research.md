---
description: Research Google Cloud services and architecture patterns using Google Developer Knowledge MCP for authoritative guidance
tags: [gcp, google, cloud, architecture, mcp, research, architecture-framework]
---

# Google Cloud Technology Research

## User Input

```text
$ARGUMENTS
```

## Instructions

This command performs Google Cloud-specific technology research using the Google Developer Knowledge MCP server to match project requirements to Google Cloud services, architecture patterns, Architecture Framework guidance, Security Command Center controls, and UK Government compliance.

**This command delegates to the `arckit-gcp-research` agent** which runs as an autonomous subprocess. The agent makes 15-30+ MCP calls (search_documents, get_document, batch_get_documents) to gather authoritative Google Cloud documentation — running in its own context window to avoid polluting the main conversation with large documentation chunks.

### What to Do

1. **Determine the project**: If the user specified a project name/number, note it. Otherwise, identify the most recent project in `projects/`.

2. **Launch the agent**: Launch the **arckit-gcp-research** agent in `acceptEdits` mode with the following prompt:

   ```
   Research Google Cloud services and architecture patterns for the project in projects/{project-dir}/.

   User's additional context: {$ARGUMENTS}

   Follow your full process: read requirements, research Google Cloud services per category, Architecture Framework assessment, Security Command Center mapping, UK Government compliance, cost estimation, write document, return summary.
   ```

3. **Report the result**: When the agent completes, relay its summary to the user.

### Alternative: Direct Execution

If the Task tool is unavailable or the user prefers inline execution, fall back to the full research process:

1. Check prerequisites (requirements document must exist)
2. **Read the template** (with user override support):
   - **First**, check if `.arckit/templates/gcp-research-template.md` exists in the project root
   - **If found**: Read the user's customized template (user override takes precedence)
   - **If not found**: Read `${CLAUDE_PLUGIN_ROOT}/templates/gcp-research-template.md` (default)
   - **Tip**: Users can customize templates with `/arckit:customize gcp-research`
3. Extract Google Cloud service needs from requirements (compute, data, integration, security, AI/ML)
4. Use MCP tools for each category: service discovery, deep dive, architecture patterns, Architecture Framework assessment, Security Command Center mapping, code samples
5. UK Government: G-Cloud, europe-west2 data residency, NCSC compliance
6. Cost estimation with optimization (Committed Use Discounts, Sustained Use Discounts, Spot VMs)
7. Generate Mermaid architecture diagram
8. Write to `projects/{project-dir}/research/ARC-{PROJECT_ID}-GCRS-v1.0.md` using Write tool
9. Show summary only (not full document)

### Output

The agent writes the full research document to file and returns a summary including:
- Google Cloud services recommended per category
- Architecture pattern and reference
- Security alignment (Security Command Center, Architecture Framework)
- UK Government suitability (G-Cloud, europe-west2, classification)
- Estimated monthly cost
- Next steps (`/arckit:diagram`, `/arckit:secure`, `/arckit:devops`)

## Integration with Other Commands

- **Input**: Requires requirements document (`ARC-*-REQ-*.md`)
- **Input**: Uses data model (`ARC-*-DATA-*.md`) for database selection
- **Output**: Feeds into `/arckit:diagram` (Google Cloud-specific diagrams)
- **Output**: Feeds into `/arckit:secure` (validates against Secure by Design)
- **Output**: Feeds into `/arckit:devops` (Cloud Build pipeline design)
- **Output**: Feeds into `/arckit:finops` (Google Cloud cost management strategy)

## Resources

- **Google Developer Knowledge MCP**: https://developerknowledge.googleapis.com/mcp
- **Google Cloud Architecture Center**: https://cloud.google.com/architecture
- **Google Cloud Architecture Framework**: https://cloud.google.com/architecture/framework
- **Digital Marketplace (Google Cloud)**: https://www.digitalmarketplace.service.gov.uk/g-cloud/search?q=google+cloud
