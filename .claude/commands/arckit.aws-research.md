---
description: Research AWS services and architecture patterns using AWS Knowledge MCP for authoritative guidance
tags: [aws, amazon, cloud, architecture, mcp, research, well-architected, security-hub]
---

# AWS Technology Research

## User Input

```text
$ARGUMENTS
```

## Instructions

This command performs AWS-specific technology research using the AWS Knowledge MCP server to match project requirements to AWS services, architecture patterns, Well-Architected guidance, Security Hub controls, and UK Government compliance.

**This command delegates to the `arckit-aws-research` agent** which runs as an autonomous subprocess. The agent makes 15-30+ MCP calls (search_documentation, read_documentation, get_regional_availability, recommend) to gather authoritative AWS documentation — running in its own context window to avoid polluting the main conversation with large documentation chunks.

### What to Do

1. **Determine the project**: If the user specified a project name/number, note it. Otherwise, identify the most recent project in `projects/`.

2. **Launch the agent**: Launch the **arckit-aws-research** agent with the following prompt:

   ```
   Research AWS services and architecture patterns for the project in projects/{project-dir}/.

   User's additional context: {$ARGUMENTS}

   Follow your full process: read requirements, research AWS services per category, Well-Architected assessment, Security Hub mapping, UK Government compliance, cost estimation, write document, return summary.
   ```

3. **Report the result**: When the agent completes, relay its summary to the user.

### Alternative: Direct Execution

If the Task tool is unavailable or the user prefers inline execution, fall back to the full research process:

1. Check prerequisites (requirements document must exist)
2. **Read the template** (with user override support):
   - **First**, check if `.arckit/templates-custom/aws-research-template.md` exists (user override)
   - **If found**: Read the user's customized template
   - **If not found**: Read `.arckit/templates/aws-research-template.md` (default)
   - Read the `VERSION` file and update the version in the template metadata line when generating
   - **Tip**: Users can customize templates with `/arckit.customize aws-research`
3. Extract AWS service needs from requirements (compute, data, integration, security, AI/ML)
4. Use MCP tools for each category: service discovery, deep dive, regional availability (eu-west-2), architecture patterns, Well-Architected assessment, Security Hub mapping, code samples
5. UK Government: G-Cloud, data residency, NCSC compliance
6. Cost estimation with optimization (Reserved Instances, Savings Plans, Spot, Graviton)
7. Generate Mermaid architecture diagram
8. Write to `projects/{project-dir}/research/ARC-{PROJECT_ID}-AWRS-v1.0.md` using Write tool
9. Show summary only (not full document)

### Output

The agent writes the full research document to file and returns a summary including:
- AWS services recommended per category
- Architecture pattern and reference
- Security alignment (Security Hub, Well-Architected)
- UK Government suitability (G-Cloud, eu-west-2, classification)
- Estimated monthly cost
- Next steps (`/arckit.diagram`, `/arckit.secure`, `/arckit.devops`)

## Integration with Other Commands

- **Input**: Requires requirements document (`ARC-*-REQ-*.md`)
- **Input**: Uses data model (`ARC-*-DATA-*.md`) for database selection
- **Output**: Feeds into `/arckit.diagram` (AWS-specific diagrams)
- **Output**: Feeds into `/arckit.secure` (validates against Secure by Design)
- **Output**: Feeds into `/arckit.devops` (AWS CodePipeline design)
- **Output**: Feeds into `/arckit.finops` (AWS cost management strategy)

## Resources

- **AWS Knowledge MCP**: https://awslabs.github.io/mcp/servers/aws-knowledge-mcp-server
- **AWS Architecture Center**: https://aws.amazon.com/architecture/
- **AWS Well-Architected**: https://aws.amazon.com/architecture/well-architected/
- **Digital Marketplace (AWS)**: https://www.digitalmarketplace.service.gov.uk/g-cloud/search?q=amazon+web+services
