---
description: Transform existing project artifacts into a structured, phased framework with overview and executive guide
argument-hint: "<project ID or name, e.g. '001', 'data governance framework'>"
effort: max
handoffs:
  - command: glossary
    description: Generate glossary of framework terminology
  - command: maturity-model
    description: Create maturity model for framework adoption
---

# Framework Generation

This command transforms existing project artifacts (requirements, strategies, stakeholder analyses, data models, research findings) into a structured, phased framework. It produces a framework overview document (FWRK) that organises recommendations into logical implementation phases, plus an Executive Guide for senior stakeholders.

## User Input

```text
$ARGUMENTS
```

## Instructions

This command delegates to the `arckit-framework` agent which runs as an autonomous subprocess. This keeps the artifact reading and synthesis work (potentially dozens of file reads) isolated from your main conversation context.

### What to Do

1. **Determine the project**: If the user specified a project name/number, note it. Otherwise, identify the most recent project in `projects/`.

2. **Launch the agent**: Launch the **arckit-framework** agent in `acceptEdits` mode with the following prompt:

```text
Create a structured framework for the project in projects/{project-dir}/.

User's additional context: {$ARGUMENTS}

Follow your full process: read all artifacts, categorise into phases, create framework directory structure, generate FWRK overview document, generate Executive Guide, return summary.
```

3. **Report the result**: When the agent completes, relay its summary to the user.

### Alternative: Direct Execution

If the Task tool is unavailable or the user prefers inline execution, fall back to the full framework process:

1. Check prerequisites:
   - **MANDATORY**: Architecture Principles (`ARC-*-PRIN-*.md`) and Requirements (`ARC-*-REQ-*.md`) must exist
   - **RECOMMENDED**: Stakeholder analysis (`ARC-*-STKE-*.md`), Strategy (`ARC-*-STRAT-*.md`), Data model (`ARC-*-DATA-*.md`), Research findings (`ARC-*-RSCH-*.md`)
2. **Read the template** (with user override support):
   - **First**, check if `.arckit/templates/framework-overview-template.md` exists in the project root
   - **If found**: Read the user's customized template (user override takes precedence)
   - **If not found**: Read `${CLAUDE_PLUGIN_ROOT}/templates/framework-overview-template.md` (default)
   - **Tip**: Users can customize templates with `/arckit:customize framework`
3. Read all project artifacts in `projects/{project-dir}/`
4. Categorise recommendations and requirements into logical implementation phases
5. Create framework directory structure under `projects/{project-dir}/framework/`
6. Generate the FWRK overview document
7. Generate the Executive Guide
Before writing files, read `${CLAUDE_PLUGIN_ROOT}/references/quality-checklist.md` and verify all **Common Checks** plus the **FWRK** per-type checks pass. Fix any failures before proceeding.

8. Write files using Write tool
9. Show summary only (not full documents)

### Output

The agent writes the framework documents to file and returns a summary including:

- Artifacts read and synthesised
- Number of phases identified
- Key themes per phase
- Framework files created
- Next steps (`/arckit:glossary`, `/arckit:maturity-model`)

## Integration with Other Commands

- **Input**: Requires principles (`ARC-*-PRIN-*.md`) and requirements (`ARC-*-REQ-*.md`)
- **Input**: Uses stakeholder analysis (`ARC-*-STKE-*.md`), strategy (`ARC-*-STRAT-*.md`), data model (`ARC-*-DATA-*.md`), research (`ARC-*-RSCH-*.md`)
- **Output**: Feeds into `/arckit:glossary` (framework terminology)
- **Output**: Feeds into `/arckit:maturity-model` (adoption maturity levels)

## Important Notes

- **Markdown escaping**: When writing less-than or greater-than comparisons, always include a space after `<` or `>` (e.g., `< 3 seconds`, `> 99.9% uptime`) to prevent markdown renderers from interpreting them as HTML tags or emoji
