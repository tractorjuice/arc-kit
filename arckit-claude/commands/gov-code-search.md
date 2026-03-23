---
description: Search 24,500+ UK government repositories using natural language queries
argument-hint: "<query, e.g. 'FHIR patient data integration', 'GOV.UK Design System form components'>"
tags: [gov, code-search, uk-gov, government-code, semantic-search, repositories]
effort: high
handoffs:
  - command: gov-reuse
    description: Deep reuse assessment of interesting finds
  - command: research
    description: Broader market research
  - command: adr
    description: Record pattern decisions
---

# Government Code Search

## User Input

```text
$ARGUMENTS
```

## Instructions

This command searches 24,500+ UK government repositories via govreposcrape using natural language queries. It identifies relevant repositories, analyses patterns and common approaches across the codebase, and surfaces implementation examples to accelerate development decisions. Project context is OPTIONAL — the command works equally well as a standalone discovery tool.

**This command delegates to the `arckit-gov-code-search` agent** which runs as an autonomous subprocess. The agent makes multiple WebSearch and WebFetch calls against the govreposcrape API and individual GitHub repositories to gather search results, README content, and code patterns — running in its own context window to avoid polluting the main conversation with large repository content.

### What to Do

1. **Determine the project**: If the user specified a project name/number, note it. Otherwise, check if any project exists in `projects/`. Project context is optional for this command.

2. **Launch the agent**: Launch the **arckit-gov-code-search** agent in `acceptEdits` mode with the following prompt:

   ```text
   Search UK government repositories for: {$ARGUMENTS}

   Project context (if available): projects/{project-dir}/

   Follow your full process: search govreposcrape with query variations, analyse results, identify patterns, write report, return summary.
   ```

3. **Report the result**: When the agent completes, relay its summary to the user.

### Alternative: Direct Execution

If the Task tool is unavailable or the user prefers inline execution, fall back to the full research process:

1. Check prerequisites (project context optional)
2. **Read the template** (with user override support):
   - **First**, check if `.arckit/templates/gov-code-search-template.md` exists in the project root
   - **If found**: Read the user's customized template (user override takes precedence)
   - **If not found**: Read `${CLAUDE_PLUGIN_ROOT}/templates/gov-code-search-template.md` (default)

   - **Tip**: Users can customize templates with `/arckit:customize gov-code-search`
3. Generate query variations from the user's search terms (synonyms, acronyms, related technologies)
4. Search govreposcrape for each query variation using WebSearch and WebFetch on the govreposcrape API
5. For each result: fetch the repository README, language, last-commit date, and star/fork count via WebFetch
6. Group results by pattern, technology stack, or organisational approach
7. Identify the most common implementation patterns and any emerging standards
Before writing the file, read `${CLAUDE_PLUGIN_ROOT}/references/quality-checklist.md` and verify all **Common Checks** pass. Fix any failures before proceeding.

8. Write to `projects/{project-dir}/research/ARC-{PROJECT_ID}-GOCS-v1.0.md` (or a standalone report if no project context) using Write tool
9. Show summary only (not full document)

### Output

The agent writes the full search report to file and returns a summary including:

- Top matching repositories per query variation
- Common patterns and implementation approaches across results
- Technology stacks and languages in use
- Organisations leading in this domain
- Recommended repositories for deeper reuse assessment
- Next steps (`/arckit:gov-reuse`, `/arckit:research`)

## Integration with Other Commands

- **Input**: Uses requirements document (`ARC-*-REQ-*.md`) — OPTIONAL
- **Output**: Feeds into `/arckit:gov-reuse` (deep reuse assessment of interesting finds)
- **Output**: Feeds into `/arckit:research` (broader market research context)

## Resources

- **govreposcrape GitHub**: https://github.com/chrisns/govreposcrape
- **govreposcrape API**: https://govreposcrape.chrisns.net
- **GOV.UK GitHub organisation**: https://github.com/alphagov
- **NHSX GitHub organisation**: https://github.com/nhsx

## Important Notes

- **Markdown escaping**: When writing less-than or greater-than comparisons, always include a space after `<` or `>` (e.g., `< 3 seconds`, `> 99.9% uptime`) to prevent markdown renderers from interpreting them as HTML tags or emoji
