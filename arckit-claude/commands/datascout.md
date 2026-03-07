---
description: Discover external data sources (APIs, datasets, open data portals) to fulfil project requirements
argument-hint: "<data need, e.g. 'real-time traffic data UK', 'company financials'>"
tags: [data, api, open-data, datasets, data-sources, discovery, uk-gov, data-integration]
handoffs:
  - command: data-model
    description: Add discovered sources to data model
  - command: research
    description: Research data source pricing and vendors
  - command: adr
    description: Record data source selection decisions
  - command: dpia
    description: Assess third-party data sources with personal data
  - command: diagram
    description: Create data flow diagrams
  - command: traceability
    description: Map DR-xxx requirements to discovered sources
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

2. **Launch the agent**: Launch the **arckit-datascout** agent in `acceptEdits` mode with the following prompt:

```text
Discover external data sources for the project in projects/{project-dir}/.

User's additional context: {$ARGUMENTS}

Follow your full process: read requirements, check api.gov.uk and data.gov.uk first, discover sources per category, evaluate with weighted scoring, gap analysis, data utility analysis, write document, return summary.
```

3. **Report the result**: When the agent completes, relay its summary to the user.

### Alternative: Direct Execution

If the Task tool is unavailable or the user prefers inline execution, fall back to the full discovery process:

1. Check prerequisites (requirements document must exist)
2. **Read the template** (with user override support):
   - **First**, check if `.arckit/templates/datascout-template.md` exists in the project root
   - **If found**: Read the user's customized template (user override takes precedence)
   - **If not found**: Read `${CLAUDE_PLUGIN_ROOT}/templates/datascout-template.md` (default)

   - **Tip**: Users can customize templates with `/arckit:customize datascout`
3. Extract data needs from requirements (DR-xxx, FR-xxx, INT-xxx, NFR-xxx)
4. Check api.gov.uk and data.gov.uk FIRST
5. Research each category (UK Gov open data, commercial APIs, free APIs, open datasets)
6. Evaluate with weighted scoring (requirements fit, data quality, license, API quality, compliance, reliability)
7. Gap analysis, data utility analysis, data model impact
Before writing the file, read `${CLAUDE_PLUGIN_ROOT}/references/quality-checklist.md` and verify all **Common Checks** plus the **DSCT** per-type checks pass. Fix any failures before proceeding.

8. Write to `projects/{project-dir}/research/ARC-{PROJECT_ID}-DSCT-v1.0.md` using Write tool
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
- Next steps (`/arckit:data-model`, `/arckit:adr`, `/arckit:dpia`)

## Integration with Other Commands

- **Input**: Requires requirements document (`ARC-*-REQ-*.md`)
- **Input**: Uses data model (`ARC-*-DATA-*.md`), stakeholder analysis (`ARC-*-STKE-*.md`), principles
- **Output**: Feeds into `/arckit:data-model` (new entities/attributes from external sources)
- **Output**: Feeds into `/arckit:research` (data source pricing informs vendor cost analysis)
- **Output**: Feeds into `/arckit:adr` (data source selection decisions)
- **Output**: Feeds into `/arckit:dpia` (third-party data sources with personal data)
- **Output**: Feeds into `/arckit:diagram` (data flow diagrams)
- **Output**: Feeds into `/arckit:traceability` (DR-xxx mapped to sources)

## Important Notes

- **Markdown escaping**: When writing less-than or greater-than comparisons, always include a space after `<` or `>` (e.g., `< 3 seconds`, `> 99.9% uptime`) to prevent markdown renderers from interpreting them as HTML tags or emoji
