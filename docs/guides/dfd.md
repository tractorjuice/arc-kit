# Data flow diagram (DFD): Yourdon-DeMarco symbols and levels

> **Guide Origin**: Official | **ArcKit Version**: [VERSION]

A data flow diagram (DFD) shows how data moves through a system: where it comes from, what changes it, where it is kept and where it goes. This guide covers the four DFD symbols, context diagrams and levels, the balancing rule, and how `/arckit:dfd` draws a DFD from your requirements.

---

## What a data flow diagram is

Ed Yourdon describes the DFD in *Just Enough Structured Analysis*, chapter 9 (archived copy) as a tool that pictures "a system as a network of functional processes, connected to one another by 'pipelines' and 'holding tanks' of data".

Flows are data in motion. Stores are data at rest. A DFD does not show the order in which things happen: Yourdon calls it "a network of communicating, asynchronous processes", and the process numbers do not imply a sequence. For the structure of the data, draw a [data model](data-model.md) alongside it.

Yourdon notes that DFDs suit systems whose functions are more complex than the data they handle. Security teams also use them for threat modelling. Microsoft's [Threat Modeling Tool](https://learn.microsoft.com/azure/security/develop/threat-modeling-tool-getting-started), for example, has you draw a DFD and add trust boundaries to it.

---

## The four DFD symbols

The table uses Yourdon's names and shapes.

| Symbol | Drawn as | What it is |
|--------|----------|------------|
| Process (also called a bubble) | Circle | A part of the system that turns inputs into outputs. Name it with a verb and an object, such as "Validate payment" |
| Flow | Named arrow | Data moving between parts of the system. Each flow carries one kind of data, given by its name |
| Store | Two parallel lines | Data at rest. Yourdon names stores in the plural, after the data they hold, such as "Orders" |
| Terminator (external entity) | Rectangle | A person, organisation or other system outside the system boundary. You cannot change how it works |

Other notations draw processes differently. Yourdon notes that the circle is associated with the Yourdon-DeMarco notation, the oval with Gane and Sarson's, and the rectangle with SADT. He calls the differences "purely cosmetic". What matters is using one shape consistently.

---

## Context diagrams, levels and balancing

A real system has too many processes for one diagram. Yourdon's guideline is no more than about half a dozen processes on a diagram. So DFDs are drawn in levels, each adding detail to one part of the level above:

1. **Context diagram**: one process for the whole system, with every terminator and every flow that crosses the system boundary.
2. **Figure 0**: the major functions inside the system, numbered 1, 2, 3.
3. **Lower levels**: process 2 is broken down in Figure 2, whose processes are numbered 2.1, 2.2, 2.3, and so on.

ArcKit calls the context diagram Level 0 and the first breakdown (Yourdon's Figure 0) Level 1. The process numbering is the same.

Levels must **balance**. In Yourdon's words, "the dataflows coming into and going out of a bubble at one level must correspond to the dataflows coming into and going out of an entire figure at the next lower level which describes that bubble."

Yourdon also lists common mistakes to check for:

- a process with inputs but no outputs (a "black hole")
- a process with outputs but no inputs ("spontaneous generation")
- a store that is only read or only written, unless it is an external store shared with a terminator

---

## Using /arckit:dfd

`/arckit:dfd` generates Yourdon-DeMarco Data Flow Diagrams (DFDs) with structured analysis notation, producing both `data-flow-diagram` DSL and Mermaid renderings in a single governance artifact.

## Purpose

Data Flow Diagrams are essential for understanding how data moves through a system -- who produces it, what processes transform it, and where it is stored. Without clear data flow visibility, teams face:

- **Integration blind spots** -- unknown data dependencies between systems and external entities
- **Security gaps** -- sensitive data flows not identified, classified, or protected
- **Incomplete requirements** -- data requirements (DR-xxx) and integration requirements (INT-xxx) that lack visual validation

The `/arckit:dfd` command **generates structured DFDs** using Yourdon-DeMarco notation that:

- Visualises data flows at multiple levels of abstraction (Context, Level 1, Level 2+)
- Produces diagrams in two formats: `data-flow-diagram` DSL (true Yourdon-DeMarco rendering) and Mermaid (inline rendering in GitHub/VS Code)
- Includes process specifications, data store descriptions, and a data dictionary
- Traces every DFD element back to requirements (DR, INT, FR)
- Validates diagrams against Yourdon-DeMarco balancing rules before output

---

## Inputs

| Artifact | Requirement | What It Provides |
|----------|-------------|------------------|
| Requirements Specification | Mandatory | Data requirements (DR-xxx), integration requirements (INT-xxx), functional requirements (FR-xxx), external systems, user actors |
| Data Model | Recommended | Entities, relationships, data types -- informs data store definitions |
| Stakeholder Analysis | Optional | External entity identification (users, organisations, partner systems) |
| Architecture Principles | Optional | Data governance standards, privacy requirements |
| Architecture Diagrams | Optional | System context, containers, components -- informs DFD decomposition |

> **Note**: At minimum, a Requirements Specification must exist before running this command. The data model is strongly recommended for accurate data store definitions.

---

## Command

```bash
/arckit:dfd Generate DFD for <system-or-process>
```

Optional level specification:

```bash
/arckit:dfd level 1 for <system-or-process>
```

Outputs: `projects/<id>/diagrams/ARC-<id>-DFD-<NNN>-v1.0.md`

---

## Output Structure

| Section | Contents |
|---------|----------|
| **Document Control** | Document ID, version, owner, classification, review cycle |
| **DFD in data-flow-diagram DSL** | True Yourdon-DeMarco notation in `dfd` code block (renderable via `pip install data-flow-diagram`) |
| **DFD in Mermaid** | Approximate Mermaid flowchart in `mermaid` code block for GitHub/VS Code rendering |
| **Process Specifications** | Table of each process with inputs, outputs, logic summary, and requirement trace |
| **Data Store Descriptions** | Table of each data store with contents, access patterns, retention, and PII flag |
| **Data Dictionary** | All data flows defined with composition, source, destination, and format |
| **Requirements Traceability** | Links DFD elements to requirements (DR, INT, FR) |

---

## Workflow Position

The DFD command transforms requirements and data models into visual data flow representations:

```text
                  ┌──────────────┐
                  │ Requirements │ (Mandatory)
                  └──────┬───────┘
                         │
┌─────────────┐          │          ┌──────────────┐
│  Data Model │──────────┼──────────│ Stakeholders │
│(Recommended)│          │          │  (Optional)  │
└─────────────┘          │          └──────────────┘
                         │
                         ▼
              ┌─────────────────────┐
              │    /arckit:dfd      │
              └──────────┬──────────┘
                         │
            ┌────────────┼────────────┐
            ▼            ▼            ▼
     ┌──────────┐ ┌─────────────┐ ┌─────────┐
     │ Diagram  │ │Traceability │ │ Analyze │
     └──────────┘ └─────────────┘ └─────────┘
```

**Best Practice**: Create the DFD AFTER requirements exist and ideally after a data model has been built. The DFD visualises data flows that should already be documented in DR-xxx and INT-xxx requirements.

---

## Example Usage

### Context Diagram (Level 0)

```bash
# Ensure requirements exist
/arckit:requirements Create requirements for NHS Appointment System

# Generate context diagram (default level)
/arckit:dfd Generate DFD for NHS Appointment System
```

### Specific Level

```bash
# Generate Level 1 decomposition
/arckit:dfd level 1 for NHS Appointment System

# Generate Level 2 detail for a specific process
/arckit:dfd level 2 process 1 for NHS Appointment System
```

### All Levels

```bash
# Build data model first for richer DFDs
/arckit:data-model Create data model for Fuel Price Service

# Generate Context + Level 1 in one document
/arckit:dfd all levels for Fuel Price Service
```

---

## Tips

- **Start with Level 0**: The context diagram establishes the system boundary and all external entities. Always create this first before decomposing into lower levels.

- **Use the data-flow-diagram DSL for formal reviews**: The [`data-flow-diagram`](https://github.com/pbauermeister/dfd) Python tool renders Yourdon-style notation (process bubbles, two-line stores, entity rectangles) through Graphviz -- preferred for architecture review boards. Install [Graphviz](https://graphviz.org/download/) first, then `pip install data-flow-diagram` (or `uv tool install data-flow-diagram`). Copy the `dfd` block into a file and run `data-flow-diagram context.dfd -o context.svg`. The tool has no `title` statement, so delete any `title` line, or turn it into a `#` comment, before rendering.

- **Use Mermaid for inline documentation**: The Mermaid output renders automatically in GitHub, VS Code, and online editors -- ideal for embedding in wikis and READMEs.

- **Validate balancing rules across levels**: All data flows entering/leaving the context diagram must appear at Level 1. No new external entities should be introduced at lower levels. The command checks these rules automatically.

- **Link to data model entities**: Data stores in the DFD should correspond to entities in your data model. Run `/arckit:data-model` first to establish these formally.

- **Multi-instance document**: Each DFD is a separate numbered document (DFD-001, DFD-002, etc.), allowing you to create DFDs for different subsystems or decomposition levels.

---

## Follow-On Commands

After creating a DFD, typical next steps include:

| Command | Purpose |
|---------|---------|
| `/arckit:diagram` | Generate C4 or deployment architecture diagrams |
| `/arckit:traceability` | Build full traceability matrix linking DFD elements to requirements |
| `/arckit:analyze` | Perform deeper governance analysis incorporating data flow insights |
| `/arckit:data-model` | Create or refine formal data model based on data stores identified |

---

## Output Example

```text
DFD Created: Context Diagram (Level 0) - NHS Appointment System

Location: projects/007-nhs-appointment/diagrams/ARC-007-DFD-001-v1.0.md

Rendering Options:
- data-flow-diagram CLI (needs Graphviz): pip install data-flow-diagram,
  then data-flow-diagram file.dfd -o file.svg
  (Produces Yourdon-style notation as SVG, PNG or PDF)
- Mermaid Live Editor: https://mermaid.live (paste Mermaid code)
- GitHub/VS Code: Mermaid code renders automatically

DFD Summary:
- External Entities: 5
- Processes: 1 (context level)
- Data Stores: 0 (visible at Level 1)
- Data Flows: 12

Next Steps:
- /arckit:dfd level 1 — Decompose into sub-processes
- /arckit:diagram — Generate C4 or deployment diagrams
- /arckit:data-model — Create formal data model from data stores
```
