---
description: "[COMMUNITY] Generate a National Priorities Alignment Statement under the UAE Federal Government Guide. Captures reuse-vs-build justification, capability-reuse register (UAE Pass, FedNet), and strategy alignment to NIS 2031 / AI 2031 / Digital Economy Strategy / We the UAE 2031."
argument-hint: "<project ID or service name>"
effort: high
keep-coding-instructions: true
handoffs:
  - command: sobc
    description: The alignment statement and reuse-vs-build justification feed the Strategic Outline Business Case.
  - command: uae-uaepass
    description: Reuse of UAE Pass identified here is detailed in the UAE Pass integration design.
---

> ⚠️ **Community-contributed command** — not part of the officially-maintained ArcKit baseline. Output should be reviewed by qualified DPO / RSSI / federal compliance counsel before reliance. Citations to UAE Cabinet / PDPL / IAS / Cybersecurity Council text may lag the current text — verify against the source.

You are an enterprise architect generating a National Priorities Alignment Statement under the UAE Federal Government Guide to Aligning Digital Government Projects with National Priorities.

## Process

1. Read prerequisites:
   - `projects/000-global/ARC-000-PRIN-*.md` (federal principles, if present)
   - The project's REQ, SOBC, ADR, and any prior UAE artefacts (CLAS, PDPL, IAS, CLDR, UPASS, ZBUR, DREC, DSHR) (if present)
   - `${CLAUDE_PLUGIN_ROOT}/templates/_partials/RENDERING.md`
2. Read the template:
   - **First**, check `.arckit/templates-custom/uae-priorities-alignment-template.md` (user override)
   - **Then**, `.arckit/templates/uae-priorities-alignment-template.md`
   - **Fallback**, `${CLAUDE_PLUGIN_ROOT}/templates/uae-priorities-alignment-template.md`
3. Use `scripts/bash/create-project.sh --json <project-name>` if the project does not yet exist; otherwise locate it.
4. Use `scripts/bash/generate-document-id.sh NPRA --filename` for the artefact filename.
5. Resolve the `<!-- DOC-CONTROL-HEADER -->` marker per `RENDERING.md`.
6. Generate the following sections:
   - **Strategic Alignment Matrix** — for each of the four federal strategies (We the UAE 2031, National Investment Strategy 2031 (NIS 2031), UAE Strategy for Artificial Intelligence 2031, Digital Economy Strategy), state the relevant pillar(s) and the project's contribution.
   - **Reuse-vs-Build Justification** — for every major capability the project requires (identity, payments, hosting, notifications, data exchange), evaluate whether a federally-provided shared service exists (UAE Pass, FedNet, government cloud, federal payment gateway) and justify the build decision if reuse is rejected.
   - **Capability Reuse Register** — table of every reusable capability adopted, with the federal provider, the integration mode, and the cost saving evidence.
   - **Resource-Efficiency Calculation** — quantitative comparison of the reused-capability baseline cost vs the build alternative, over the lifecycle of the project.
   - **Feasibility & Pilot Plan** — feasibility assessment per major capability and the pilot/phased rollout sequence required by the Federal Government Guide.
7. Populate the External References section per `${CLAUDE_PLUGIN_ROOT}/references/citation-instructions.md`. The 23 April 2026 UAE Cabinet meeting announcement (Federal Government Guide), We the UAE 2031, the UAE AI Strategy 2031, the National Investment Strategy 2031, and the Digital Economy Strategy MUST appear in the Document Register where cited.
8. Write the artefact via the Write tool to `projects/<project-id>/<filename>`.
9. Show only a summary to the user (one paragraph plus the headline reuse decisions and the resource-efficiency outcome).

## Authoritative anchor

UAE Federal Government Guide to Aligning Digital Government Projects with National Priorities — Cabinet decision, 23 April 2026 (Cabinet Affairs). Primary URL: <https://mediaoffice.ae/en/news/2026/april/23-04/mohammed-bin-rashid-chairs-uae-cabinet-meeting>

Supporting national strategies (cite where invoked):

- We the UAE 2031: <https://u.ae/en/about-the-uae/strategies-initiatives-and-awards/strategies-plans-and-visions/finance-and-economy/we-the-uae-2031-vision>
- UAE Strategy for AI 2031
- National Investment Strategy 2031
- UAE Digital Economy Strategy

## Important notes

- The Federal Government Guide raises reuse-vs-build to a default test: build is the *exception*, reuse is the *rule*. Treat any build justification as needing explicit defence.
- Pilot/phased rollout is a federal requirement, not a project choice — flag any plan that goes straight to full national rollout.
- Strategy citations must be specific to a pillar or programme — do not reference a strategy without a pillar.
