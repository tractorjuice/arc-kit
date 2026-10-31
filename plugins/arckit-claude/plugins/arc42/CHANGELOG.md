# Changelog

## Unreleased

- Clarified mixed licensing: original ArcKit implementation remains MIT; the adapted arc42 template and every copied or embedded template are CC BY-SA 4.0, with attribution and a changes notice.
- Require an existing project and follow the interview pattern with documented defaults for optional owner and external documents, including unattended recipe runs.
- Index the guide in `docs/README.md` and document the existing-project prerequisite and optional-information defaults.

- **New standalone plugin** `arckit-arc42` (#1053). Depends only on `arckit` core.

- 1 command: `arc42`, which assembles an arc42 architecture description (`ARC42`) from the project's existing artefacts, cites each source by Document ID, and lists uncovered sections in a Gap Register with the command that would fill each

- 1 template: `arc42-template.md`, the 12 arc42 sections with ArcKit's own guidance text and the arc42 CC BY-SA 4.0 attribution

- Build recipe: `arc42-full` (principles → stakeholders → requirements → ADRs and data model → context, container, runtime and deployment diagrams → Secure by Design → risks → glossary → arc42)
