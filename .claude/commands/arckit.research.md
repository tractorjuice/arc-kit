---
description: Research technology, services, and products to meet requirements with build vs buy analysis
tags: [research, build-vs-buy, vendor, procurement, digital-marketplace, tco, saas, open-source]
---

# Technology and Service Research

## User Input

```text
$ARGUMENTS
```

## Instructions

This command performs market research to identify available technologies, services, and products that can satisfy the project's requirements. It covers SaaS vendors, open source, managed cloud services, and UK Government platforms (GOV.UK, Digital Marketplace).

**This command delegates to the `arckit-research` agent** which runs as an autonomous subprocess. This keeps the extensive web research (dozens of WebSearch and WebFetch calls for vendor pricing, reviews, compliance data) isolated from your main conversation context.

### What to Do

1. **Determine the project**: If the user specified a project name/number, note it. Otherwise, identify the most recent project in `projects/`.

2. **Launch the agent**: Use the Task tool to launch the `arckit-research` agent with the following prompt:

```
Research technology and service options for the project in projects/{project-dir}/.

User's additional context: {$ARGUMENTS}

Follow your full process: read requirements, identify categories, conduct web research, build vs buy analysis, TCO comparison, write document, return summary.
```

Use `subagent_type` of `general-purpose` is NOT correct. Instead provide the full agent instructions by reading `.claude/agents/arckit-research.md` and passing its content as the prompt context, OR simply describe what needs to happen since the agent definition handles the details.

**Actually**: Use the Task tool with `subagent_type: "general-purpose"` and include in the prompt:
- The project directory path
- The user's arguments
- Instruct it to follow the research agent process defined in `.claude/agents/arckit-research.md`
- Tell it to read that agent file first for its full instructions

3. **Report the result**: When the agent completes, relay its summary to the user.

### Alternative: Direct Execution

If the Task tool is unavailable or the user prefers inline execution, fall back to the full research process:

1. Check prerequisites (requirements document must exist)
2. **Read the template** (with user override support):
   - **First**, check if `.arckit/templates-custom/research-findings-template.md` exists (user override)
   - **If found**: Read the user's customized template
   - **If not found**: Read `.arckit/templates/research-findings-template.md` (default)
   - Read the `VERSION` file and update the version in the template metadata line when generating
   - **Tip**: Users can customize templates with `/arckit.customize research`
3. Extract research categories from requirements
4. Use WebSearch and WebFetch for each category (vendors, pricing, reviews, open source, UK Gov)
5. Build vs buy analysis with 3-year TCO
6. Write to `projects/{project-dir}/ARC-{PROJECT_ID}-RSCH-v1.0.md` using Write tool
7. Show summary only (not full document)

### Output

The agent writes the full research document to file and returns a summary including:
- Categories researched and options found
- Build vs buy recommendations
- 3-year TCO range
- Requirements coverage
- Top vendor shortlist
- Next steps (`/arckit.wardley`, `/arckit.sobc`, `/arckit.sow`)

## Integration with Other Commands

- **Input**: Requires requirements document (`ARC-*-REQ-*.md`)
- **Input**: Uses data model (`ARC-*-DATA-*.md`), stakeholder analysis (`ARC-*-STKE-*.md`)
- **Output**: Feeds into `/arckit.wardley` (evolution positioning)
- **Output**: Feeds into `/arckit.sobc` (Economic Case TCO data)
- **Output**: Feeds into `/arckit.sow` (RFP vendor requirements)
- **Output**: Feeds into `/arckit.hld-review` (validates technology choices)
