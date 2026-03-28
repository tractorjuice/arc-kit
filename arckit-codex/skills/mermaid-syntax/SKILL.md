---
name: mermaid-syntax
description: "This skill should be used when the user asks about Mermaid diagram syntax, how to write flowchart, sequence, class, state, ER, Gantt, C4, mindmap, timeline, or other diagram types, node shapes, styling, theming, or rendering errors."
---

# Mermaid Syntax Reference

A comprehensive reference for all 23 Mermaid diagram types plus configuration and theming. This skill provides official Mermaid syntax documentation sourced from the [mermaid-skill](https://github.com/WH-2099/mermaid-skill) project (auto-synced from upstream Mermaid docs).

To look up syntax for a specific diagram type, identify the type from the table below and read the corresponding reference file.

## Supported Diagram Types

Select the appropriate diagram type and read the corresponding reference file:

| Type | Reference | ArcKit Commands Using It |
| ---- | --------- | ------------------------ |
| Flowchart | [flowchart.md](references/flowchart.md) | `/arckit.diagram`, `/arckit.dfd`, `/arckit.roadmap`, `/arckit.plan`, `/arckit.backlog`, `/arckit.strategy`, `/arckit.story`, `/arckit.jsp-936` |
| Sequence Diagram | [sequenceDiagram.md](references/sequenceDiagram.md) | `/arckit.diagram` |
| Class Diagram | [classDiagram.md](references/classDiagram.md) | — |
| State Diagram | [stateDiagram.md](references/stateDiagram.md) | — |
| ER Diagram | [entityRelationshipDiagram.md](references/entityRelationshipDiagram.md) | `/arckit.data-model` |
| Gantt Chart | [gantt.md](references/gantt.md) | `/arckit.roadmap`, `/arckit.plan`, `/arckit.strategy`, `/arckit.story`, `/arckit.presentation` |
| Pie Chart | [pie.md](references/pie.md) | `/arckit.story`, `/arckit.presentation` |
| Mindmap | [mindmap.md](references/mindmap.md) | `/arckit.story` |
| Timeline | [timeline.md](references/timeline.md) | `/arckit.story` |
| Git Graph | [gitgraph.md](references/gitgraph.md) | — |
| Quadrant Chart | [quadrantChart.md](references/quadrantChart.md) | `/arckit.presentation` |
| Requirement Diagram | [requirementDiagram.md](references/requirementDiagram.md) | — |
| C4 Diagram | [c4.md](references/c4.md) | `/arckit.diagram`, `/arckit.presentation` |
| Sankey Diagram | [sankey.md](references/sankey.md) | — |
| XY Chart | [xyChart.md](references/xyChart.md) | — |
| Block Diagram | [block.md](references/block.md) | — |
| Packet Diagram | [packet.md](references/packet.md) | — |
| Kanban | [kanban.md](references/kanban.md) | — |
| Architecture Diagram | [architecture.md](references/architecture.md) | — |
| Radar Chart | [radar.md](references/radar.md) | — |
| Treemap | [treemap.md](references/treemap.md) | — |
| User Journey | [userJourney.md](references/userJourney.md) | — |
| ZenUML | [zenuml.md](references/zenuml.md) | — |

## Configuration & Theming

| Topic | Reference |
| ----- | --------- |
| Theming | [config-theming.md](references/config-theming.md) |
| Directives | [config-directives.md](references/config-directives.md) |
| Layouts | [config-layouts.md](references/config-layouts.md) |
| Configuration | [config-configuration.md](references/config-configuration.md) |
| Math | [config-math.md](references/config-math.md) |
| Tidy Tree | [config-tidy-tree.md](references/config-tidy-tree.md) |
| Examples | [examples.md](references/examples.md) |

## C4 Layout Science

For research-backed C4 diagram layout guidance (declaration ordering, edge crossing targets, colour standards, PlantUML directional hints), see [c4-layout-science.md](references/c4-layout-science.md). This ArcKit-specific reference supplements the upstream C4 syntax reference with graph drawing science and layout optimisation techniques.

## Common Syntax Gotchas

These are the most common Mermaid syntax errors encountered when generating diagrams:

| Gotcha | Problem | Fix |
|--------|---------|-----|
| `<br/>` in flowchart edge labels | Mermaid flowchart parser rejects HTML in edge labels | Use comma-separated text: `-->\|"Uses, HTTPS"\|` |
| `end` as node ID | `end` is a reserved keyword in Mermaid | Use a different ID: `EndNode["End"]` |
| Gantt date formats | Gantt requires specific date format | Use `YYYY-MM-DD` (e.g., `2025-01-15`) |
| Gantt task status | Invalid task status keywords | Valid: `done`, `active`, `crit`, `milestone` |
| Parentheses in labels | Unescaped `()` breaks node parsing | Wrap in quotes: `Node["Label (with parens)"]` |
| Special chars in IDs | Hyphens, dots, spaces in node IDs | Use camelCase or underscores: `apiGateway`, `api_gateway` |
| Missing semicolons in ER | ER diagram attributes need specific syntax | Follow `entity { type name }` pattern |
| Subgraph naming | Subgraph IDs with spaces need quotes | `subgraph "My Group"` |

## ArcKit Integration

This skill handles **conversational** Mermaid syntax questions — quick lookups, syntax examples, troubleshooting rendering issues, and learning about diagram types.

For **formal architecture diagram generation** with document control, project integration, C4 layout science, and governance compliance, use the `$arckit-diagram` command instead. It generates versioned diagram artifacts saved to your project directory with full traceability to requirements and architecture principles.
