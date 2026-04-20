---
description: Research UK government grants, charitable funding, and accelerator programmes with eligibility scoring
argument-hint: "<project ID or domain, e.g. '001', 'health tech AI'>"
tags: [grants, funding, ukri, innovate-uk, nihr, wellcome, nesta, accelerator, uk-government]
effort: max
handoffs:
  - command: sobc
    description: Feed grant funding data into Economic Case
  - command: plan
    description: Create project plan aligned to grant milestones
  - command: risk
    description: Add grant-specific risks (rejection, compliance, reporting)
---

# UK Grants Research

## User Input

```text
$ARGUMENTS
```

## Instructions

This command researches UK funding opportunities — government grants (UKRI, Innovate UK, NIHR, DSIT, DASA), charitable foundations (Wellcome, Nesta, Health Foundation), social impact investors, accelerator programmes, and open grants data (360Giving/GrantNav) — matching eligibility to the project's requirements.

**This command delegates to the `arckit-grants` agent** which runs as an autonomous subprocess. This keeps the extensive web research (dozens of WebSearch and WebFetch calls across UK funding bodies) isolated from your main conversation context.

### What to Do

1. **Determine the project**: If the user specified a project name/number, note it. Otherwise, identify the most recent project in `projects/`.

2. **Launch the agent**: Launch the **arckit-grants** agent in `acceptEdits` mode with the following prompt:

```text
Research UK funding opportunities for the project in projects/{project-dir}/.

User's additional context: {$ARGUMENTS}

Follow your full process: read requirements, build funding profile, search UK grant bodies, score eligibility, write report, spawn knowledge, return summary.
```

   If the user included `--no-spawn` in their arguments, append to the agent prompt: `Skip Step 8 (do not spawn tech notes).`

3. **Report the result**: When the agent completes, relay its summary to the user.

### Alternative: Direct Execution

If the Task tool is unavailable or the user prefers inline execution, fall back to the full research process:

1. Check prerequisites (requirements document recommended)
2. **Read the template** (with user override support):
   - **First**, check if `.arckit/templates/grants-template.md` exists in the project root
   - **If found**: Read the user's customized template (user override takes precedence)
   - **If not found**: Read `${CLAUDE_PLUGIN_ROOT}/templates/grants-template.md` (default)
   - **Tip**: Users can customize templates with `/arckit:customize grants`
3. Read existing project artifacts (REQ, STKE, SOBC) to build project funding profile — extract sector, organisation type, TRL, budget, timeline, key objectives
4. Read any external documents (`external/`, `policies/`) and apply **citation traceability**: follow `${CLAUDE_PLUGIN_ROOT}/references/citation-instructions.md` for inline `[DOC_ID-CN]` markers and the External References section
5. Use WebSearch and WebFetch across UK grant bodies (UKRI, Innovate UK, NIHR, DSIT, DASA, Wellcome, Nesta, Health Foundation, 360Giving/GrantNav, accelerators). All funding data must come from live web searches — do not use general knowledge for amounts or deadlines
6. Score each grant High/Medium/Low against the project profile with rationale
7. Before writing the file, read `${CLAUDE_PLUGIN_ROOT}/references/quality-checklist.md` and verify all **Common Checks** pass. Fix any failures before proceeding.
8. Write to `projects/{project-dir}/research/ARC-{PROJECT_ID}-GRNT-{NNN}-v1.0.md` using Write tool
9. Show summary only (not full document)

### Flags

| Flag | Effect |
|------|--------|
| `--no-spawn` | Skip knowledge compounding — produce the grants report only, without spawning tech notes. Useful for quick research or when you do not want additional files created. |

### Output

The agent writes the full grants report to file and returns a summary including:

- Total grants found with eligibility breakdown
- Top 3 matches with funding amounts and deadlines
- Total potential funding range
- Nearest application deadlines
- Spawned tech notes (unless `--no-spawn` was used)
- Next steps (`/arckit:sobc`, `/arckit:plan`, `/arckit:risk`)

#### Spawned Knowledge

In addition to the main grants document, the agent creates standalone files for reusable knowledge:

- **Tech notes** at `projects/{project}/tech-notes/{grant-slug}.md` — one per grant programme researched in depth (2+ substantive facts)

Existing notes are updated rather than duplicated. A `## Spawned Knowledge` section is appended to the grants document listing everything created or updated.

## Integration with Other Commands

- **Input**: Uses requirements document (`ARC-*-REQ-*.md`)
- **Input**: Uses stakeholder analysis (`ARC-*-STKE-*.md`), business case (`ARC-*-SOBC-*.md`)
- **Output**: Feeds into `/arckit:sobc` (Economic Case funding data)
- **Output**: Feeds into `/arckit:plan` (grant milestone alignment)
- **Output**: Feeds into `/arckit:risk` (grant-specific risks)
- **Output**: Spawns `tech-notes/{slug}.md` (reusable grant programme knowledge)

## Important Notes

- **Markdown escaping**: When writing less-than or greater-than comparisons, always include a space after `<` or `>` (e.g., `< 3 months`, `> £500k`) to prevent markdown renderers from interpreting them as HTML tags or emoji
- **UK-only scope**: This command searches UK funding bodies only
- **Deadlines change frequently**: The report notes the research date — users should verify deadlines before applying
