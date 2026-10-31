# ArcKit — arc42 Overlay

1 slash command and the `arc42-full` build recipe for producing an [arc42](https://arc42.org) architecture description from the artefacts ArcKit already generates:

| Command | Doc Type | Description |
|---------|----------|-------------|
| `/arckit-arc42:arc42` | `ARC42` | Assembles all 12 arc42 sections from the project's artefacts, cites each source, and lists the sections no artefact covers yet in a Gap Register |

Recipe: `arc42-full` — principles, stakeholders, requirements, two ADRs, data model, the four C4/runtime/deployment diagrams, Secure by Design, risk register and glossary, then the arc42 assembly.

## Requires arckit core plugin

```bash
claude plugin install arckit arckit-arc42
```

Without `arckit` (core), the recipe cannot resolve the commands the description is assembled from (`arckit:requirements`, `arckit:diagram`, `arckit:adr`, etc.), and `validate-arc-filename` will not recognise the `ARC42` doc-type code.

## Why One Command

arc42 is a documentation structure, not a process like the TOGAF ADM, and most of its sections map onto artefacts ArcKit already produces. One command per section would duplicate core commands and drift from them. `/arckit-arc42:arc42` is instead a view over the project: it summarises and cites its sources, and those sources stay authoritative.

| arc42 section | Assembled from |
|---------------|----------------|
| 1. Introduction and Goals | `REQ` (BR/FR), `SOBC`, `STKE` |
| 2. Architecture Constraints | `PRIN`, `REQ`, enterprise standards in `000-global/external/` |
| 3. Context and Scope | `DIAG` (C4 Context), `DFD`, INT requirements |
| 4. Solution Strategy | `ADR`, `STRAT`, `WARD`, `HLDR` |
| 5. Building Block View | `DIAG` (C4 Container), `DATA`, `PLAT`, `DLDR`, vendor HLD/DLD |
| 6. Runtime View | `DIAG` (Sequence), `DFD` |
| 7. Deployment View | `DIAG` (Deployment), `PLAT`, `DEVOPS`, `OPS` |
| 8. Crosscutting Concepts | `SECD`, `DATA`, `DEVOPS`, `HLDR` — only concepts a source covers |
| 9. Architecture Decisions | `ADR` |
| 10. Quality Requirements | `REQ` (NFR); quality scenarios inferred from NFRs with measurable targets |
| 11. Risks and Technical Debt | `RISK`, `CDAU`, `DLDR` |
| 12. Glossary | `GLOS` |

Sections with no source are marked "Not yet documented." and listed in the Gap Register with the command that would fill them. Re-run `/arckit-arc42:arc42` after running those commands, or after any source changes, to produce the next version.

## Artefact Naming

| Artefact | Example filename |
|----------|-----------------|
| arc42 Architecture Description | `ARC-001-ARC42-v1.0.md` |

## Configuration (userConfig)

| Key | Default | Effect |
|-----|---------|--------|
| `organisation_name` | empty | Organisation name in the Document Control header |
| `default_classification` | `PUBLIC` | Classification where the artefact's regime falls through to user config |

## Licence and Attribution

This overlay contains separately licensed parts (`MIT AND CC-BY-SA-4.0` in its licence metadata). Original ArcKit command logic, recipes and scripts remain MIT-licensed. The adapted [`arc42-template.md`](templates/arc42-template.md), including its structure, headings and guidance, and every distributed or embedded copy are **CC BY-SA 4.0**. It is adapted from [arc42](https://arc42.org/license/) by Peter Hruschka and Gernot Starke. ArcKit rewrote the explanatory text and added Document Control, source citations, a Gap Register, a Source Artefacts table and assumptions for optional information.

See [LICENSE](LICENSE) and the [template's third-party notice](templates/arc42-LICENSE.md). Retain attribution, licence links and the changes notice when customising or distributing the template. Project-specific content and cited artefacts retain their own licences and confidentiality rules.

## Roadmap

Phase 1 (this release) is the assembly command and recipe. Possible later additions, tracked on [#1053](https://github.com/tractorjuice/arc-kit/issues/1053):

- Quality scenarios and a quality requirements overview for section 10, beyond what can be inferred from NFRs
- Crosscutting concepts for section 8 where no core artefact covers them
- Technical debt for section 11
- A handover from the arc42 description to a Specification Driven Development tool such as [Spec Kit](https://github.com/github/spec-kit)
