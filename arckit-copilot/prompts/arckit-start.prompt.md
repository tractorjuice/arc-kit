---
description: 'Get oriented with ArcKit — guided project onboarding, workflow selection, and command recommendations'
agent: 'agent'
tools: ['readFile', 'editFiles', 'runCommand', 'codebase', 'search']
---

# ArcKit: Project Onboarding

Use the **architecture-workflow** skill to guide this user through project onboarding and workflow selection.

## User Input

```text
${input:topic:Enter project name or topic}
```

## Instructions

1. Follow the architecture-workflow skill process exactly
2. If the user provided `${input:topic:Enter project name or topic}` with a specific focus (e.g., "procurement", "governance review"), use that as context during triage — it may let you skip some questions
3. The skill will detect project state, ask adaptive questions, and present a tailored command plan
4. Do NOT run any commands — only present the recommended plan for the user to execute
