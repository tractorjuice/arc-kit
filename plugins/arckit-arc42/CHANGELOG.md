# Changelog

## Unreleased

- **New standalone plugin** `arckit-arc42` (#1053). Depends only on `arckit` core.

- 1 command: `arc42`, which assembles an arc42 architecture description (`ARC42`) from the project's existing artefacts, cites each source by Document ID, and lists uncovered sections in a Gap Register with the command that would fill each. It needs an existing project with at least one project-level source (requirements, stakeholder analysis, HLD review, diagrams or ADRs), never targets `000-global`, asks no questions and records the defaults it takes as assumptions, so it also runs unattended and inside build recipes

- 1 template: `arc42-template.md`, the 12 arc42 sections with ArcKit's own guidance text. The adapted template is CC BY-SA 4.0, with attribution to Peter Hruschka and Gernot Starke, a licence link and a changes notice (see `templates/arc42-LICENSE.md`); the overlay's code is MIT. Generated descriptions keep the attribution notice but not the template's licence metadata

- Build recipe: `arc42-full` (principles → stakeholders → requirements → ADRs and data model → context, container, runtime and deployment diagrams → Secure by Design → risks → glossary → arc42)
