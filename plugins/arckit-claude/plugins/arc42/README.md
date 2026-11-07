# ArcKit — arc42 Overlay

5 slash commands and the `arc42-full` build recipe for producing an [arc42](https://arc42.org) architecture description from the artefacts ArcKit already generates, and for handing it over to a Specification Driven Development tool:

| Command | Doc Type | Description |
|---------|----------|-------------|
| `/arckit-arc42:arc42` | `ARC42` | Assembles all 12 arc42 sections from the project's artefacts, cites each source, and lists the sections no artefact covers yet in a Gap Register |
| `/arckit-arc42:arc42-quality` | `QUAL` | Quality tree and measurable quality scenarios for section 10, classified by the nine Q42 dimensions; goals without a measurable target are listed, never estimated |
| `/arckit-arc42:arc42-concepts` | `CONC` | Crosscutting concepts for section 8, each Decided, Partially decided, Open, Not applicable or Not assessed, traced to the ADRs and designs that settle it |
| `/arckit-arc42:arc42-debt` | `DEBT` | Technical debt register for section 11.2, consolidated from audits, conformance assessments, reviews, ADRs and risks |
| `/arckit-arc42:arc42-handover` | `SDDH` | SDD handover pack for Spec Kit: a constitution, one feature brief per epic and plan inputs, each tagged with its ArcKit IDs |

Recipe: `arc42-full` — principles, stakeholders, requirements, two ADRs, data model, the four C4/runtime/deployment diagrams, Secure by Design, risk register, glossary, quality scenarios and crosscutting concepts, then the arc42 assembly. `--enable DEBT` adds the technical debt register and `--enable SDDH` the handover pack. Existing evidence (backlog, codebase audits, conformance assessment, design reviews, principles compliance) is adopted and read, never generated; `--enable` builds one that does not exist yet.

## Requires arckit core plugin

```bash
claude plugin install arckit arckit-arc42
```

Without `arckit` (core), the recipe cannot resolve the commands the description is assembled from (`arckit:requirements`, `arckit:diagram`, `arckit:adr`, etc.), and `validate-arc-filename` will not recognise the overlay's doc-type codes.

## Why an Assembly Command and Four Source Commands

arc42 is a documentation structure, not a process like the TOGAF ADM, and most of its sections map onto artefacts ArcKit already produces. One command per section would duplicate core commands and drift from them. `/arckit-arc42:arc42` is instead a view over the project: it summarises and cites its sources, and those sources stay authoritative.

Three sections have no core artefact behind them: crosscutting concepts (8), quality scenarios (10) and technical debt (11.2). The overlay's source commands write those artefacts, and the assembly cites them like any other source. They never make architecture decisions or invent targets: an undecided concept is routed to an ADR, and a goal without a measurable target is listed as "Target needed". `/arckit-arc42:arc42-handover` then turns the description into inputs for [Spec Kit](https://github.com/github/spec-kit).

| arc42 section | Assembled from |
|---------------|----------------|
| 1. Introduction and Goals | `REQ` (BR/FR), `SOBC`, `STKE`; top quality goals from `QUAL` |
| 2. Architecture Constraints | `PRIN`, `REQ`, enterprise standards in `000-global/external/` |
| 3. Context and Scope | `DIAG` (C4 Context), `DFD`, INT requirements |
| 4. Solution Strategy | `ADR`, `STRAT`, `WARD`, `HLDR` |
| 5. Building Block View | `DIAG` (C4 Container), `DATA`, `PLAT`, `DLDR`, vendor HLD/DLD |
| 6. Runtime View | `DIAG` (Sequence), `DFD` |
| 7. Deployment View | `DIAG` (Deployment), `PLAT`, `DEVOPS`, `OPS` |
| 8. Crosscutting Concepts | `CONC`; otherwise `SECD`, `DATA`, `DEVOPS`, `HLDR` — only concepts a source covers |
| 9. Architecture Decisions | `ADR` |
| 10. Quality Requirements | `QUAL`; otherwise `REQ` (NFR), with scenarios inferred from NFRs with measurable targets |
| 11. Risks and Technical Debt | `RISK`; debt from `DEBT`, otherwise `CDAU`, `CONF` or `DLDR` |
| 12. Glossary | `GLOS` |

Sections with no source are marked "Not yet documented." and listed in the Gap Register with the command that would fill them. Re-run `/arckit-arc42:arc42` after running those commands, or after any source changes, to produce the next version. `/arckit:health` flags a description, or a handover pack, whose sources have moved on as `STALE-VIEW`.

## Artefact Naming

| Artefact | Example filename |
|----------|-----------------|
| arc42 Architecture Description | `ARC-001-ARC42-v1.0.md` |
| Quality Scenarios | `ARC-001-QUAL-v1.0.md` |
| Crosscutting Concepts | `ARC-001-CONC-v1.0.md` |
| Technical Debt Register | `ARC-001-DEBT-v1.0.md` |
| SDD Handover Pack | `ARC-001-SDDH-v1.0.md` |

## Configuration (userConfig)

| Key | Default | Effect |
|-----|---------|--------|
| `organisation_name` | empty | Organisation name in the Document Control header |
| `default_classification` | `PUBLIC` | Classification where the artefact's regime falls through to user config |

## Licence and Attribution

This overlay contains separately licensed parts (`MIT AND CC-BY-SA-4.0` in its licence metadata). Original ArcKit command logic, recipes and scripts remain MIT-licensed. The adapted [`arc42-template.md`](templates/arc42-template.md), including its structure, headings and guidance, and every distributed or embedded copy are **CC BY-SA 4.0**. It is adapted from [arc42](https://arc42.org/license/) by Peter Hruschka and Gernot Starke. ArcKit rewrote the explanatory text and added Document Control, source citations, a Gap Register, a Source Artefacts table and assumptions for optional information.

The quality material is CC BY-SA 4.0 too: [`arc42-quality-template.md`](templates/arc42-quality-template.md) as a whole, and the Q42 classification in the `arc42-quality` command (its dimension names and the table mapping each dimension to the goals it covers). Both are adapted from the [Q42 quality model](https://quality.arc42.org) by Gernot Starke, with attribution and a changes notice; no endorsement by Q42 or its author is implied. The concepts, debt and handover templates are original ArcKit material under the MIT License.

See [LICENSE](LICENSE) and the [template's third-party notice](templates/arc42-LICENSE.md). Retain attribution, licence links and the changes notice when customising or distributing the template. Project-specific content and cited artefacts retain their own licences and confidentiality rules: as arc42's licence page puts it, publishing an architecture document in arc42 structure does not place your content under CC BY-SA.

## Roadmap

Phase 1, tracked on [#1053](https://github.com/tractorjuice/arc-kit/issues/1053), delivered the assembly command and recipe. Phase 2 added the quality, concepts, debt and handover commands, Spec Kit evidence in `/arckit:traceability`, `/arckit:conformance` and `/arckit-repo:repo-audit`, and `STALE-VIEW` in `/arckit:health`; it and any later additions are tracked in separate follow-on issues. Possible later additions:

- A link from `/arckit-repo:repo-docs` to the arc42 description, since arc42 is a common target format for code-level architecture documentation
- Behavioural eval cases for the overlay's commands, once the eval harness can load an overlay beside core
