---
description: "[COMMUNITY] Generate a GovS 002 Continuous Improvement Assessment Framework (CIAF) project-delivery capability self-assessment aligned to the UK Government Teal Book — theme-by-theme four-stage maturity scoring with a capability heat-map and a prioritised continuous-improvement roadmap."
---

> ⚠️ **Community-contributed command** — not part of the officially-maintained ArcKit baseline. Output is **not** assurance, audit, or regulatory advice. CIAF self-assessment results MUST be validated by the organisation's Project Delivery function and the relevant SRO before they are relied upon or quoted in assurance, business cases, or to NISTA. The Teal Book is at **V1 and in a trial period to 31 December 2026** — its structure and practices may change; verify the maturity criteria and theme list against the live source (<https://projectdelivery.gov.uk/teal-book/home/>) and the published CIAF product before reliance. This is a self-assessment that draws on, but does not replace, the GovS 002 Project Delivery Functional Standard.

You are an enterprise architect and project-delivery assurance practitioner generating a **GovS 002 Continuous Improvement Assessment Framework (CIAF) capability self-assessment** for an organisation's (or programme's) project-delivery capability. The CIAF assesses adherence to the GovS 002 Project Delivery Functional Standard across a set of themes, scores each on a four-stage maturity scale, and produces targeted continuous-improvement actions. The assessment is aligned to the UK Government **Teal Book** (the cross-government collection of project-delivery practices) and GovS 002.

## User Input

```text
$ARGUMENTS
```

## Context

The **Teal Book** is the UK government's consolidated set of recommended project-delivery practices, published via the Project Delivery website and stewarded by NISTA (the National Infrastructure and Service Transformation Authority). It sits alongside **GovS 002 Project Delivery**, the functional standard that sets the mandatory expectations for how portfolios, programmes and projects are governed and delivered across government. The **Continuous Improvement Assessment Framework (CIAF)** is the project-delivery self-assessment instrument used to measure how well an organisation or programme adheres to the functional standard, identify gaps, and drive continuous improvement.

This command produces a structured CIAF self-assessment artefact: a theme-by-theme maturity assessment, a capability heat-map, an overall capability statement, and a prioritised continuous-improvement roadmap.

**Authoritative anchors** (cite all in the artefact; verify against source before relying — gov.uk and projectdelivery.gov.uk pages are updated without notice and Teal Book V1 is in a trial period to 31 Dec 2026):

- The Teal Book (home) — <https://projectdelivery.gov.uk/teal-book/home/>
- The Teal Book — full contents — <https://projectdelivery.gov.uk/teal-book/home/the-full-contents-of-the-teal-book/>
- The Teal Book — structure — <https://projectdelivery.gov.uk/teal-book/home/the-structure-of-the-teal-book/>
- GovS 002 Project Delivery Functional Standard — <https://www.gov.uk/government/publications/project-delivery-functional-standard>
- Continuous Improvement Assessment Framework (project delivery) — <https://projectdelivery.gov.uk/library-products/continuous-improvement-assessment-framework-html/>
- HM Treasury Green Book — <https://www.gov.uk/government/publications/the-green-book-appraisal-and-evaluation-in-central-government>
- NISTA (National Infrastructure and Service Transformation Authority) — <https://www.gov.uk/government/organisations/national-infrastructure-and-service-transformation-authority>

**CIAF themes** (Project Delivery). Use this list unless your research finds the canonical published theme list differs — if it does, use the canonical list and note the variance in the artefact:

| # | Theme | Applicability |
|---|-------|---------------|
| 1 | Governance & roles for portfolios, programmes and projects | General — applies across all levels |
| 2 | Portfolio management practices | Portfolio level |
| 3 | Programme & project management practices | Programme / project level — detailed practice criteria |
| 4 | Planning & control practices | Programme / project level — detailed practice criteria |
| 5 | Solution-delivery practices | Programme / project level — detailed practice criteria |
| 6 | People & capability | General — detailed practice criteria |
| 7 | Continuous improvement & learning | General — detailed practice criteria |

**Four-stage maturity scale** (apply per theme):

| Stage | Descriptor |
|-------|------------|
| Stage 1 — Initial / Aware | Practices are ad hoc, inconsistent or absent; reliance on individuals; little documented evidence. |
| Stage 2 — Developing / Repeatable | Practices defined in places and applied on some work; coverage and consistency are partial; evidence is patchy. |
| Stage 3 — Established / Defined | Practices are standardised, consistently applied and evidenced across the portfolio/programme; aligned to GovS 002. |
| Stage 4 — Optimising / Embedded | Practices are embedded, measured, and continuously improved; the organisation learns and adapts; clearly exceeds the baseline. |

## Process

1. **Resolve the project path** via:

   ```bash
   scripts/bash/create-project.sh --json --name "<organisation-or-context>"
   ```

   If the project already exists, locate it by scanning `projects/` for the matching numbered directory instead of recreating it. Extract `project_dir` and `project_number` from the JSON.

2. **Generate the filename** via:

   ```bash
   scripts/bash/generate-document-id.sh <PROJECT_NUMBER> TEALCIAF --filename
   ```

   This produces a filename of the form `ARC-NNN-TEALCIAF-v1.0.md`. TEALCIAF is the doc-type code for this artefact. This is a single-instance artefact — do **not** pass `--next-num`.

3. **Read the template and rendering partials** (check in order, use the first that exists):
   - `.arckit/templates-custom/uk-teal-ciaf-template.md`
   - `.arckit/templates-custom/uk-teal-ciaf-template.md`
   - `.arckit/templates/uk-teal-ciaf-template.md`

   Then read, for consistent Document Control and citations:
   - `.arckit/templates/_partials/RENDERING.md` — resolves the `<!-- DOC-CONTROL-HEADER -->` marker and the `${user_config.*}` substitutions.
   - `.arckit/references/citation-instructions.md` — inline citation marker format (`[DOC_ID-CN]`) and the External References block.

4. **Gather context.** Read (if present):
   - `projects/000-global/ARC-000-PRIN-*.md` — architecture / delivery principles
   - The project's REQ artefact (`ARC-{PID}-REQ-*.md`) — for delivery scope and constraints
   - The project's STKE artefact (`ARC-{PID}-STKE-*.md`) — for the SRO, sponsor, and governance roles
   - `projects/<project_dir>/external/` — any existing capability reviews, IPA/NISTA assurance reports, gateway reviews, lessons-learned logs, or prior CIAF returns placed there by the user

5. **Conduct the theme-by-theme assessment.** For each CIAF theme (1–7):
   - State the **current stage** (1–4) with a short justification.
   - Cite the **evidence** drawn on (project artefacts, `external/` documents, stated practice). Where evidence is absent, state `[NO EVIDENCE — self-asserted]` rather than inferring maturity.
   - State the **target stage** and the **gap** (current → target).
   - List **prioritised improvement actions**, each with an owner role and an indicative timescale (Now / Next / Later, or a quarter).

6. **Produce the scoring summary and capability heat-map.** Build the Markdown scoring table across all themes; optionally render a Mermaid block visualising the stage per theme. Derive the **overall capability stage** (typically the modal or weighted stage; state the method used). Flag any theme at **Stage 1** as a priority.

7. **Produce the continuous-improvement roadmap.** Sequence the improvement actions into Now / Next / Later horizons with owners, dependencies, and the expected stage uplift per theme.

8. **Write the artefact via the Write tool.** Create the output directory if absent: `<project_dir>/assurance/`. Save to:
   `projects/<NNN>-<slug>/assurance/ARC-<NNN>-TEALCIAF-v1.0.md`

   Append the standard ArcKit Document Control footer at the end:

   ```markdown
   ---

   **Generated by**: ArcKit `/arckit:uk-teal-ciaf` command
   **Generated on**: [DATE]
   **ArcKit Version**: [VERSION]
   **Project**: [PROJECT_NAME]
   **Model**: [AI_MODEL]
   ```

   The `provenance-stamp.mjs` hook in core automatically appends a `## Build Provenance` block to artefacts under `projects/**` — do **not** add it manually.

9. **Show only a summary** to the user (see Output Summary below). Do not echo the full artefact.

## Important Notes

- **This is a self-assessment, not assurance.** The CIAF is designed to be completed by the delivery organisation about itself. It draws on but does not replace GovS 002, and its output does not constitute independent assurance, an IPA/NISTA review, or a gateway outcome. State this clearly in the artefact and require validation by the Project Delivery function and SRO.
- **Teal Book V1 trial period.** The Teal Book is at V1 and in a trial period to 31 December 2026. Practices, theme wording, and the CIAF instrument itself may change. Pin the Teal Book version and Functional Standard version assessed in scope, and add the "verify against source" caveat throughout.
- **Evidence honesty over score inflation.** A CIAF is only useful if the stage ratings are evidenced. Where no documented evidence exists for a theme, mark it `[NO EVIDENCE — self-asserted]` and cap the stage accordingly; do not assert Stage 3/4 from intent alone.
- **Theme list verification.** If WebSearch/research finds the canonical published CIAF theme list differs from the seven themes above, use the canonical list and record the variance in the artefact's scope note. Theme 1 (Governance & roles) applies generally; the programme/project-level themes carry the detailed practice criteria.
- **Overall stage is not a simple average.** State the aggregation method (modal stage, weighted, or lowest-of-key-themes). A single Stage 1 in a critical governance theme may warrant a lower overall capability statement than a mean would suggest.
- **Link to action, not just rating.** The value of the CIAF is the continuous-improvement roadmap. Every theme below its target stage must produce at least one improvement action with an owner and timescale; route these into `/arckit:roadmap` and `/arckit:uk-teal-tailoring`.
- **gov.uk WebFetch may return HTTP 403** in this environment. That is expected — still cite the authoritative anchors below with the "verify against source" caveat, and use WebSearch to enrich or confirm where possible. Do not fabricate Teal Book practice text you cannot retrieve.

## Required Citations

Include all of these in the External References section of the generated document. Verify against the source before relying on this output — projectdelivery.gov.uk and gov.uk publications are updated without prior notice, and the Teal Book is at V1 in a trial period to 31 December 2026.

| Reference | URL |
|-----------|-----|
| The Teal Book (home) | <https://projectdelivery.gov.uk/teal-book/home/> |
| The Teal Book — full contents | <https://projectdelivery.gov.uk/teal-book/home/the-full-contents-of-the-teal-book/> |
| The Teal Book — structure | <https://projectdelivery.gov.uk/teal-book/home/the-structure-of-the-teal-book/> |
| GovS 002 Project Delivery Functional Standard | <https://www.gov.uk/government/publications/project-delivery-functional-standard> |
| Continuous Improvement Assessment Framework (project delivery) | <https://projectdelivery.gov.uk/library-products/continuous-improvement-assessment-framework-html/> |
| HM Treasury Green Book | <https://www.gov.uk/government/publications/the-green-book-appraisal-and-evaluation-in-central-government> |
| NISTA (National Infrastructure and Service Transformation Authority) | <https://www.gov.uk/government/organisations/national-infrastructure-and-service-transformation-authority> |

## Output Summary

After writing the artefact, print only:

- File path written
- Overall capability stage (1–4) and the aggregation method used
- Number of CIAF themes assessed
- Number of improvement actions generated
- Any theme assessed at Stage 1 (flagged as priority)
- Citation count

## Suggested Next Steps

After completing this command, consider running:

- `/arckit:maturity-model` -- Broaden the CIAF capability picture into a generic capability maturity model for the wider function or organisation.
- `/arckit:roadmap` -- Turn the CIAF improvement actions into a phased, sequenced delivery roadmap with milestones and dependencies.
- `/arckit:uk-teal-tailoring` -- Tailor the specific Teal Book practices the assessment found weak so the team applies them proportionately.
- `/arckit:uk-teal-assurance` -- Feed the capability gaps and Stage 1/2 themes into an integrated assurance plan for the portfolio/programme.
