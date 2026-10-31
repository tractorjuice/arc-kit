# arc42 Architecture Description Playbook

> **Guide Origin**: Community | **ArcKit Version**: [VERSION]

`/arckit-arc42:arc42` writes an [arc42](https://arc42.org) architecture description for a project. arc42 is a 12-section template for documenting the architecture of one software system, widely used by solution and software architects. The command does not design anything: it assembles each section from the artefacts ArcKit has already produced, cites them by Document ID, and lists the sections no artefact covers yet. The command is part of the `arckit-arc42` overlay, which needs the core `arckit` plugin.

The adapted template, including its structure, headings and guidance, is licensed under [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/), based on [arc42](https://arc42.org/license/) by Peter Hruschka and Gernot Starke. ArcKit changed the explanatory text and added Document Control, source citations, a Gap Register, a Source Artefacts table and assumptions for optional information. Every copied or embedded template retains this licence and attribution. Original ArcKit implementation code remains MIT-licensed. Project-specific content and cited artefacts retain their own licences and confidentiality rules.

---

## When to Use

| Use when any of these apply | Do not use when |
|-----------------------------|-----------------|
| A delivery team, reviewer or supplier expects architecture documentation in arc42 form | The project has no requirements, stakeholder analysis, principles, diagrams or ADRs yet: there is nothing to assemble |
| You want one readable description of a system, instead of pointing readers at a dozen artefacts | You need to make architecture decisions (use `/arckit:adr`) or review a design (use `/arckit:hld-review`) |
| You want to see which parts of the architecture are still undocumented | You want an enterprise-level view across many systems (use `/arckit:framework` or the TOGAF ADM overlay) |

---

## Inputs

An existing project is required. The command uses the project ID or name supplied, the explicitly active project, or the sole existing non-global project. It never allocates project numbers or creates project folders. If the project is missing or ambiguous, it stops without writing files and explains how to initialise source artefacts or re-run with an explicit ID.

No single artefact is mandatory. The command stops if the project has none of requirements, stakeholder analysis, principles, HLD review, diagrams or ADRs. Run `/arckit:stakeholders <project-name>` and `/arckit:requirements <project-name>` first when starting a project, with `/arckit:principles` for global principles.

### Optional Information and Unattended Runs

The command follows ArcKit's interview pattern and needs no interview. It uses the owner in the arguments or project metadata, otherwise `[PENDING]`. If no external documents are supplied, it proceeds with existing ArcKit artefacts. Defaults are recorded in the document's Assumptions section and closing summary; they never supply architecture decisions. Headless and recipe-worker runs do not wait for optional answers.

To add an external architecture description later, place it in the project's `external/` folder and re-run the command. To change a pending owner, supply the owner in the arguments or project metadata and re-run.

| Artefact | Feeds arc42 section |
|----------|---------------------|
| Requirements (`ARC-<id>-REQ-v*.md`) | 1 Introduction and Goals, 2 Constraints, 10 Quality Requirements |
| Stakeholder analysis (`ARC-<id>-STKE-v*.md`) | 1.3 Stakeholders |
| Business case (`ARC-<id>-SOBC-v*.md`) | 1 Introduction and Goals |
| Architecture principles (`ARC-000-PRIN-v*.md`) | 2 Constraints, 4 Solution Strategy |
| Architecture strategy, Wardley maps | 4 Solution Strategy |
| Diagrams (`diagrams/ARC-<id>-DIAG-*.md`, `DFD`) | 3 Context, 5 Building Blocks, 6 Runtime, 7 Deployment |
| HLD and DLD reviews, vendor HLD/DLD | 4, 5, 8 |
| ADRs (`decisions/ARC-<id>-ADR-*.md`) | 4 Solution Strategy, 9 Architecture Decisions |
| Data model (`ARC-<id>-DATA-v*.md`) | 5 Building Blocks, 8 Crosscutting Concepts |
| Platform design, DevOps strategy, operational readiness | 5, 7 Deployment View, 8 |
| Secure by Design (`ARC-<id>-SECD-v*.md`) | 8 Crosscutting Concepts (security) |
| Risk register, codebase audit | 11 Risks and Technical Debt |
| Glossary (`ARC-<id>-GLOS-v*.md`) | 12 Glossary |
| Project and enterprise external documents | Any section, with citations |

---

## Command

### Claude Code

```text
/arckit-arc42:arc42 <project ID or name>
```

### Codex CLI

```text
$arckit-arc42 <project ID or name>
```

Both commands write `projects/<id>/ARC-<id>-ARC42-v1.0.md`.

If an arc42 description already exists, the command writes the next version beside it instead of overwriting it.

### Building the Source Artefacts

The `arc42-full` recipe uses the **Claude Code only** build harness to generate the source artefacts and then assemble the description:

```text
/arckit:build <project-name> --recipe arc42-full --plan   # wave-plan dry run
/arckit:build <project-name> --recipe arc42-full          # full build
```

Add `--exclude SECD` to skip the Secure by Design assessment; the security concept in section 8 is then recorded as a gap.

In Codex, run the source commands individually before `$arckit-arc42`. Start with `$arckit-principles`, `$arckit-stakeholders` and `$arckit-requirements` if the project has no source artefacts. Add the sources for the sections you need; the Inputs table shows which command outputs each section uses.

For example, to build the recipe's sources for an appointment-booking system in project `001`, run these commands in order, completing each artefact before continuing:

```text
$arckit-principles
$arckit-stakeholders appointment-booking
$arckit-requirements appointment-booking
$arckit-adr 001 Top-level decomposition and technology approach
$arckit-adr 001 Deployment topology and hosting
$arckit-data-model 001
$arckit-diagram 001 C4 context
$arckit-diagram 001 C4 container
$arckit-diagram 001 sequence for the primary user journey
$arckit-diagram 001 deployment
$arckit-secure 001
$arckit-risk 001
$arckit-glossary 001
$arckit-arc42 001
```

Reuse source artefacts that already exist. A complete source set is not required to run the assembly command: missing sections are recorded in the Gap Register.

---

## How Sections Are Filled

- **Summarised, not copied.** Each section summarises its sources and cites them. The cited artefacts remain authoritative, so when an ADR changes you update the ADR and re-run `/arckit-arc42:arc42`.
- **Diagrams reproduced unchanged.** Context, container, sequence and deployment diagrams are copied from their `DIAG` artefacts. The command never draws a diagram no artefact backs.
- **Gaps recorded, not filled.** A section with no source says "Not yet documented." and appears in the Gap Register with the command that would fill it, such as `/arckit:diagram sequence <scenario>` for an empty Runtime View.
- **Inferences marked.** Quality scenarios derived from NFRs with measurable targets are marked "Inferred", with the NFR they came from.
- **Conflicts reported.** Where two artefacts disagree, the section cites both instead of choosing one silently.

---

## Deliverable Snapshot

| Section | Contents |
|---------|----------|
| Document Control | Document ID, owner, status, classification; sections complete and sources read |
| 1–12 | The arc42 sections, each summarising and citing its sources |
| Gap Register | Each empty or partial section, what is missing, and the command that would fill it |
| Source Artefacts | Every artefact read, its version, and the sections it fed |
| Assumptions | Defaults used for optional metadata and external documents |
| External References | Document Register and citations for external documents |

---

## Keeping It Current

The description is a view over the project's artefacts, so it goes out of date when they change. The Source Artefacts table records the version of each artefact it was built from. When a newer version of any of them exists, re-run `/arckit-arc42:arc42` to produce the next version of the description.

---

## Review Checklist

- All 12 arc42 sections are present, in order, with their arc42 numbers.
- Every populated section cites at least one source by Document ID.
- No section contains content without a source; empty sections are in the Gap Register.
- Diagram code matches the cited `DIAG` artefact.
- "Inferred" items have been checked by the architects who own the source artefacts.
- The adapted template's CC BY-SA 4.0 licence, attribution and changes notice are still in the document.

---

## Next Steps

- `/arckit:diagram` - Fill an empty Context, Building Block, Runtime or Deployment view.
- `/arckit:adr` - Record a decision the Solution Strategy relies on but no ADR covers.
- `/arckit:risk` - Add risks or technical debt the description surfaced.
- `/arckit:glossary` - Build the glossary the arc42 Glossary section summarises.
- `/arckit:traceability` - Check requirements trace through to the building blocks described.
