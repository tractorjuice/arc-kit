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

2. **Launch the agent**: Launch the **arckit-research** agent in `acceptEdits` mode with the following prompt:

```
Research technology and service options for the project in projects/{project-dir}/.

User's additional context: {$ARGUMENTS}

Follow your full process: read requirements, identify categories, conduct web research, build vs buy analysis, TCO comparison, write document, spawn reusable knowledge, return summary.
```

   If the user included `--no-spawn` in their arguments, append to the agent prompt: `Skip Step 11b (do not spawn vendor profiles or tech notes).`

3. **Report the result**: When the agent completes, relay its summary to the user.

### Alternative: Direct Execution

If the Task tool is unavailable or the user prefers inline execution, fall back to the full research process:

1. Check prerequisites (requirements document must exist)
2. **Read the template** (with user override support):
   - **First**, check if `.arckit/templates/research-findings-template.md` exists in the project root
   - **If found**: Read the user's customized template (user override takes precedence)
   - **If not found**: Read `${CLAUDE_PLUGIN_ROOT}/templates/research-findings-template.md` (default)
   - **Tip**: Users can customize templates with `/arckit:customize research`
3. Extract research categories from requirements
4. Use WebSearch and WebFetch for each category (vendors, pricing, reviews, open source, UK Gov)
5. Build vs buy analysis with 3-year TCO
6. Write to `projects/{project-dir}/ARC-{PROJECT_ID}-RSCH-v1.0.md` using Write tool
7. Show summary only (not full document)

### Flags

| Flag | Effect |
|------|--------|
| `--no-spawn` | Skip knowledge compounding — produce the research document only, without spawning vendor profiles or tech notes. Useful for quick research or when you do not want additional files created. |

### Output

The agent writes the full research document to file and returns a summary including:
- Categories researched and options found
- Build vs buy recommendations
- 3-year TCO range
- Requirements coverage
- Top vendor shortlist
- Spawned vendor profiles and tech notes (unless `--no-spawn` was used)
- Next steps (`/arckit:wardley`, `/arckit:sobc`, `/arckit:sow`)

#### Spawned Knowledge

In addition to the main research document, the agent creates standalone files for reusable knowledge:

- **Vendor profiles** at `projects/{project}/vendors/{vendor-slug}-profile.md` — one per vendor evaluated in depth (3+ data points)
- **Tech notes** at `projects/{project}/tech-notes/{topic-slug}.md` — one per significant technology finding (2+ substantive facts)

Existing profiles and notes are updated rather than duplicated. A `## Spawned Knowledge` section is appended to the research document listing everything created or updated. See the [Knowledge Compounding Guide](../../docs/guides/knowledge-compounding.md) for details.

## Integration with Other Commands

- **Input**: Requires requirements document (`ARC-*-REQ-*.md`)
- **Input**: Uses data model (`ARC-*-DATA-*.md`), stakeholder analysis (`ARC-*-STKE-*.md`)
- **Output**: Feeds into `/arckit:wardley` (evolution positioning)
- **Output**: Feeds into `/arckit:sobc` (Economic Case TCO data)
- **Output**: Feeds into `/arckit:sow` (RFP vendor requirements)
- **Output**: Feeds into `/arckit:hld-review` (validates technology choices)
- **Output**: Spawns `vendors/{slug}-profile.md` (reusable vendor knowledge)
- **Output**: Spawns `tech-notes/{slug}.md` (reusable technology knowledge)
