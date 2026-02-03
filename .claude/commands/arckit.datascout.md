---
description: Discover external data sources (APIs, datasets, open data portals) to fulfil project requirements
tags: [data, api, open-data, datasets, data-sources, discovery, uk-gov, data-integration]
---

# Data Source Discovery (DataScout)

## User Input

```text
$ARGUMENTS
```

## Instructions

This command discovers external data sources — APIs, datasets, open data portals, and commercial data providers — that can fulfil the project's data and integration requirements. It covers UK Government open data (data.gov.uk, api.gov.uk), commercial APIs, free/freemium sources, and assesses data utility beyond primary requirements.

**This command delegates to the `arckit-datascout` agent** which runs as an autonomous subprocess. This keeps the extensive web research (searching api.gov.uk, data.gov.uk, department developer hubs, commercial API documentation) isolated from your main conversation context.

### What to Do

1. **Determine the project**: If the user specified a project name/number, note it. Otherwise, identify the most recent project in `projects/`.

2. **Launch the agent**: Use the Task tool to launch the datascout agent with the following prompt:

```
Discover external data sources for the project in projects/{project-dir}/.

User's additional context: {$ARGUMENTS}

Follow your full process: read requirements, check api.gov.uk and data.gov.uk first, discover sources per category, evaluate with weighted scoring, gap analysis, data utility analysis, write document, return summary.
```

Use the Task tool with `subagent_type: "general-purpose"` and include in the prompt:
- The project directory path
- The user's arguments
- Instruct it to follow the datascout agent process defined in `.claude/agents/arckit-datascout.md`
- Tell it to read that agent file first for its full instructions

3. **Report the result**: When the agent completes, relay its summary to the user.

### Alternative: Direct Execution

If the Task tool is unavailable or the user prefers inline execution, fall back to the full discovery process:

1. Check prerequisites (requirements document must exist)
2. Read `.arckit/templates/datascout-template.md` and `VERSION`
3. Extract data needs from requirements (DR-xxx, FR-xxx, INT-xxx, NFR-xxx)
4. Check api.gov.uk and data.gov.uk FIRST
5. Research each category (UK Gov open data, commercial APIs, free APIs, open datasets)
6. Evaluate with weighted scoring (requirements fit, data quality, license, API quality, compliance, reliability)
7. Gap analysis, data utility analysis, data model impact
8. Write to `projects/{project-dir}/ARC-{PROJECT_ID}-DSCT-v1.0.md` using Write tool
9. Show summary only (not full document)

### Output

The agent writes the full discovery document to file and returns a summary including:
- Categories researched and sources discovered
- UK Government open data sources found
- Top recommended sources with scores
- Requirements coverage percentage
- Gaps identified
- Data utility highlights
- Data model impact
- Next steps (`/arckit.data-model`, `/arckit.adr`, `/arckit.dpia`)

## Integration with Other Commands

- **Input**: Requires requirements document (`ARC-*-REQ-*.md`)
- **Input**: Uses data model (`ARC-*-DATA-*.md`), stakeholder analysis (`ARC-*-STKE-*.md`), principles
- **Output**: Feeds into `/arckit.data-model` (new entities/attributes from external sources)
- **Output**: Feeds into `/arckit.research` (data source pricing informs vendor cost analysis)
- **Output**: Feeds into `/arckit.adr` (data source selection decisions)
- **Output**: Feeds into `/arckit.dpia` (third-party data sources with personal data)
- **Output**: Feeds into `/arckit.diagram` (data flow diagrams)
- **Output**: Feeds into `/arckit.traceability` (DR-xxx mapped to sources)
