# Changelog

## Unreleased

- **New standalone plugin** `arckit-arc42` (#1053). Depends only on `arckit` core.

- 5 commands:

  - `arc42` assembles an arc42 architecture description (`ARC42`) from the project's existing artefacts, cites each source by Document ID, and lists uncovered sections in a Gap Register with the command that would fill each. It needs an existing project with at least one project-level source (requirements, stakeholder analysis, HLD review, diagrams or ADRs), never targets `000-global`, asks no questions and records the defaults it takes as assumptions, so it also runs unattended and inside build recipes
  - `arc42-quality` writes the quality tree and measurable quality scenarios for section 10 (`QUAL`), grouped by the nine Q42 dimensions; response measures quote their requirement's target, and goals without one are listed, never estimated
  - `arc42-concepts` documents the crosscutting concepts for section 8 (`CONC`), each traced to the decision or design that settles it; undecided concepts get candidate approaches for an ADR
  - `arc42-debt` consolidates recorded technical debt into a register for section 11.2 (`DEBT`), without estimating effort
  - `arc42-handover` writes an SDD handover pack for Spec Kit (`SDDH`): a constitution, one feature brief per epic and plan inputs, each tagged with its ArcKit IDs

- 5 templates. `arc42-template.md` holds the 12 arc42 sections with ArcKit's own guidance text; the adapted template is CC BY-SA 4.0, with attribution to Peter Hruschka and Gernot Starke, a licence link and a changes notice (see `templates/arc42-LICENSE.md`). Generated descriptions keep the attribution notice but not the template's licence metadata. `arc42-quality-template.md` and the Q42 classification in the `arc42-quality` command are adapted from the [Q42 quality model](https://quality.arc42.org) by Gernot Starke and licensed CC BY-SA 4.0, with attribution and a changes notice in the same file; generated quality documents keep the written attribution but not the licence metadata. The concepts, debt and handover templates are original ArcKit material under the MIT License

- Build recipe: `arc42-full` (principles → stakeholders → requirements → ADRs and data model → context, container, runtime and deployment diagrams → Secure by Design → risks → glossary → quality scenarios → crosscutting concepts → arc42), with optional `DEBT` and `SDDH` targets
