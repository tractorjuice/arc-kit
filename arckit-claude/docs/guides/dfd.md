# Data Flow Diagram Guide

> **Guide Origin**: Official | **ArcKit Version**: [VERSION]

`/arckit.dfd` generates Yourdon-DeMarco Data Flow Diagrams (DFDs) with structured analysis notation, producing both `data-flow-diagram` DSL and Mermaid renderings in a single governance artifact.

---

## Purpose

Data Flow Diagrams are essential for understanding how data moves through a system -- who produces it, what processes transform it, and where it is stored. Without clear data flow visibility, teams face:

- **Integration blind spots** -- unknown data dependencies between systems and external entities
- **Security gaps** -- sensitive data flows not identified, classified, or protected
- **Incomplete requirements** -- data requirements (DR-xxx) and integration requirements (INT-xxx) that lack visual validation

The `/arckit.dfd` command **generates structured DFDs** using Yourdon-DeMarco notation that:

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
/arckit.dfd Generate DFD for <system-or-process>
```

Optional level specification:

```bash
/arckit.dfd level 1 for <system-or-process>
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
              │    /arckit.dfd      │
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
/arckit.requirements Create requirements for NHS Appointment System

# Generate context diagram (default level)
/arckit.dfd Generate DFD for NHS Appointment System
```

### Specific Level

```bash
# Generate Level 1 decomposition
/arckit.dfd level 1 for NHS Appointment System

# Generate Level 2 detail for a specific process
/arckit.dfd level 2 process 1 for NHS Appointment System
```

### All Levels

```bash
# Build data model first for richer DFDs
/arckit.data-model Create data model for Fuel Price Service

# Generate Context + Level 1 in one document
/arckit.dfd all levels for Fuel Price Service
```

---

## Tips

- **Start with Level 0**: The context diagram establishes the system boundary and all external entities. Always create this first before decomposing into lower levels.

- **Use the data-flow-diagram DSL for formal reviews**: The `data-flow-diagram` Python tool (`pip install data-flow-diagram`) renders true Yourdon-DeMarco notation with circles, parallel lines, and rectangles -- preferred for architecture review boards.

- **Use Mermaid for inline documentation**: The Mermaid output renders automatically in GitHub, VS Code, and online editors -- ideal for embedding in wikis and READMEs.

- **Validate balancing rules across levels**: All data flows entering/leaving the context diagram must appear at Level 1. No new external entities should be introduced at lower levels. The command checks these rules automatically.

- **Link to data model entities**: Data stores in the DFD should correspond to entities in your data model. Run `/arckit.data-model` first to establish these formally.

- **Multi-instance document**: Each DFD is a separate numbered document (DFD-001, DFD-002, etc.), allowing you to create DFDs for different subsystems or decomposition levels.

---

## Follow-On Commands

After creating a DFD, typical next steps include:

| Command | Purpose |
|---------|---------|
| `/arckit.diagram` | Generate C4 or deployment architecture diagrams |
| `/arckit.traceability` | Build full traceability matrix linking DFD elements to requirements |
| `/arckit.analyze` | Perform deeper governance analysis incorporating data flow insights |
| `/arckit.data-model` | Create or refine formal data model based on data stores identified |

---

## Output Example

```text
DFD Created: Context Diagram (Level 0) - NHS Appointment System

Location: projects/007-nhs-appointment/diagrams/ARC-007-DFD-001-v1.0.md

Rendering Options:
- data-flow-diagram CLI: pip install data-flow-diagram && dfd < file.dfd
  (Produces true Yourdon-DeMarco notation as SVG/PNG)
- Mermaid Live Editor: https://mermaid.live (paste Mermaid code)
- GitHub/VS Code: Mermaid code renders automatically

DFD Summary:
- External Entities: 5
- Processes: 1 (context level)
- Data Stores: 0 (visible at Level 1)
- Data Flows: 12

Next Steps:
- /arckit.dfd level 1 — Decompose into sub-processes
- /arckit.diagram — Generate C4 or deployment diagrams
- /arckit.data-model — Create formal data model from data stores
```
