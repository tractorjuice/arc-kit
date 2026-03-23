---
description: Map the UK government code landscape for a domain — who built what, common patterns, standards, maturity
argument-hint: "<domain, e.g. 'health data integration', 'citizen identity verification'>"
tags: [gov, landscape, uk-gov, government-code, patterns, standards, discovery]
effort: max
handoffs:
  - command: gov-reuse
    description: Assess specific repos for reuse
  - command: framework
    description: Incorporate patterns into architecture framework
  - command: wardley
    description: Map landscape evolution
---

# Government Code Landscape Analysis

## User Input

```text
$ARGUMENTS
```

## Instructions

This command maps the UK government code landscape for a given domain across 24,500+ repositories via govreposcrape. It identifies which organisations have built what, common technology stacks, emerging standards, maturity levels, and collaboration opportunities. The output informs strategic architecture decisions by showing what the wider UK government has already solved.

**This command delegates to the `arckit-gov-landscape` agent** which runs as an autonomous subprocess. The agent makes multiple WebSearch and WebFetch calls against the govreposcrape API and individual GitHub repositories to gather organisational profiles, technology inventories, and activity signals — running in its own context window to avoid polluting the main conversation with large repository content.

### What to Do

1. **Determine the project**: If the user specified a project name/number, note it. Otherwise, identify the most recent project in `projects/`.

2. **Launch the agent**: Launch the **arckit-gov-landscape** agent in `acceptEdits` mode with the following prompt:

   ```text
   Map the UK government code landscape for the project in projects/{project-dir}/.

   Domain focus: {$ARGUMENTS}

   Follow your full process: search govreposcrape across domain, map organisations, analyse tech stacks, assess maturity, write landscape analysis, return summary.
   ```

3. **Report the result**: When the agent completes, relay its summary to the user.

### Alternative: Direct Execution

If the Task tool is unavailable or the user prefers inline execution, fall back to the full research process:

1. Check prerequisites (requirements document recommended)
2. **Read the template** (with user override support):
   - **First**, check if `.arckit/templates/gov-landscape-template.md` exists in the project root
   - **If found**: Read the user's customized template (user override takes precedence)
   - **If not found**: Read `${CLAUDE_PLUGIN_ROOT}/templates/gov-landscape-template.md` (default)

   - **Tip**: Users can customize templates with `/arckit:customize gov-landscape`
3. Derive domain search terms from the user's input and any project requirements
4. Search govreposcrape broadly across the domain using multiple WebSearch and WebFetch calls against the govreposcrape API
5. For each organisation active in the domain: fetch their profile, repository list, and technology signals via WebFetch
6. Map technology stacks: languages, frameworks, infrastructure patterns, shared components
7. Assess domain maturity: activity levels, test coverage signals, documentation quality, GDS assessments where identifiable
8. Identify shared standards (GOV.UK Design System, NHS Design System, FHIR, etc.) and how widely adopted they are
9. Surface collaboration opportunities: organisations solving similar problems, shared components, potential reuse
Before writing the file, read `${CLAUDE_PLUGIN_ROOT}/references/quality-checklist.md` and verify all **Common Checks** pass. Fix any failures before proceeding.

10. Write to `projects/{project-dir}/research/ARC-{PROJECT_ID}-GOVL-v1.0.md` using Write tool
11. Show summary only (not full document)

### Output

The agent writes the full landscape analysis document to file and returns a summary including:

- Landscape map: organisations active in the domain and their key repositories
- Common technology stacks and languages
- Emerging and established standards in use
- Domain maturity assessment
- Collaboration and reuse opportunities
- Next steps (`/arckit:gov-reuse`, `/arckit:framework`, `/arckit:wardley`)

## Integration with Other Commands

- **Input**: Uses requirements document (`ARC-*-REQ-*.md`) — RECOMMENDED
- **Input**: Uses architecture principles (`ARC-000-PRIN-*.md`) — RECOMMENDED
- **Output**: Feeds into `/arckit:gov-reuse` (assess specific repositories for reuse)
- **Output**: Feeds into `/arckit:framework` (incorporate domain patterns into architecture framework)
- **Output**: Feeds into `/arckit:wardley` (map landscape evolution and component maturity)

## Resources

- **govreposcrape GitHub**: https://github.com/chrisns/govreposcrape
- **govreposcrape API**: https://govreposcrape.chrisns.net
- **GOV.UK GitHub organisation**: https://github.com/alphagov
- **NHSX GitHub organisation**: https://github.com/nhsx

## Important Notes

- **Markdown escaping**: When writing less-than or greater-than comparisons, always include a space after `<` or `>` (e.g., `< 3 seconds`, `> 99.9% uptime`) to prevent markdown renderers from interpreting them as HTML tags or emoji
