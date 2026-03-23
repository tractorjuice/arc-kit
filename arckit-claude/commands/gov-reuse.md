---
description: Discover reusable UK government code before building from scratch
argument-hint: "<capability or domain, e.g. 'case management', 'appointment booking NHS'>"
tags: [gov, reuse, open-source, uk-gov, code-discovery, government-code]
effort: max
handoffs:
  - command: research
    description: Feed reuse findings into build vs buy analysis
  - command: adr
    description: Record reuse decisions
  - command: requirements
    description: Refine requirements based on discovered capabilities
---

# Government Code Reuse Assessment

## User Input

```text
$ARGUMENTS
```

## Instructions

This command searches 24,500+ UK government repositories via govreposcrape to find existing implementations before building from scratch. It extracts capabilities from project requirements, identifies candidate repositories, assesses reusability and maturity, scores each candidate, and produces a reuse assessment document to inform build vs buy decisions.

**This command delegates to the `arckit-gov-reuse` agent** which runs as an autonomous subprocess. The agent makes multiple WebSearch and WebFetch calls against the govreposcrape API and individual GitHub repositories to gather code, README, licence, and activity data — running in its own context window to avoid polluting the main conversation with large repository content.

### What to Do

1. **Determine the project**: If the user specified a project name/number, note it. Otherwise, identify the most recent project in `projects/`.

2. **Launch the agent**: Launch the **arckit-gov-reuse** agent in `acceptEdits` mode with the following prompt:

   ```text
   Assess reusable UK government code for the project in projects/{project-dir}/.

   User's additional context: {$ARGUMENTS}

   Follow your full process: read requirements, extract capabilities, search govreposcrape, assess reusability via WebFetch, score candidates, write document, return summary.
   ```

3. **Report the result**: When the agent completes, relay its summary to the user.

### Alternative: Direct Execution

If the Task tool is unavailable or the user prefers inline execution, fall back to the full research process:

1. Check prerequisites (requirements document must exist)
2. **Read the template** (with user override support):
   - **First**, check if `.arckit/templates/gov-reuse-template.md` exists in the project root
   - **If found**: Read the user's customized template (user override takes precedence)
   - **If not found**: Read `${CLAUDE_PLUGIN_ROOT}/templates/gov-reuse-template.md` (default)

   - **Tip**: Users can customize templates with `/arckit:customize gov-reuse`
3. Extract capabilities from the requirements document (functional areas, integrations, data concerns)
4. Search govreposcrape for each capability using WebSearch and WebFetch on the govreposcrape API
5. For each promising candidate: fetch the repository README, licence, last-commit date, open issues, and any live service links via WebFetch
6. Score each candidate on reusability (licence, activity, documentation, test coverage, dependency health)
7. Assess integration effort and adaptation work required per candidate
Before writing the file, read `${CLAUDE_PLUGIN_ROOT}/references/quality-checklist.md` and verify all **Common Checks** plus any **GOVR** per-type checks pass. Fix any failures before proceeding.

8. Write to `projects/{project-dir}/research/ARC-{PROJECT_ID}-GOVR-v1.0.md` using Write tool
9. Show summary only (not full document)

### Output

The agent writes the full reuse assessment document to file and returns a summary including:

- Capabilities extracted from project requirements
- Top-scored reusable repositories per capability
- Reusability scores and justification
- Recommended reuse, adapt, or ignore decision per candidate
- Estimated integration effort
- Next steps (`/arckit:research`, `/arckit:adr`)

## Integration with Other Commands

- **Input**: Requires requirements document (`ARC-*-REQ-*.md`) — MANDATORY
- **Input**: Uses architecture principles (`ARC-000-PRIN-*.md`) — RECOMMENDED
- **Output**: Feeds into `/arckit:research` (build vs buy analysis informed by reuse findings)
- **Output**: Feeds into `/arckit:adr` (record reuse decisions with rationale)

## Resources

- **govreposcrape GitHub**: https://github.com/chrisns/govreposcrape
- **govreposcrape API**: https://govreposcrape.chrisns.net
- **GOV.UK GitHub organisation**: https://github.com/alphagov
- **NHSX GitHub organisation**: https://github.com/nhsx

## Important Notes

- **Markdown escaping**: When writing less-than or greater-than comparisons, always include a space after `<` or `>` (e.g., `< 3 seconds`, `> 99.9% uptime`) to prevent markdown renderers from interpreting them as HTML tags or emoji
