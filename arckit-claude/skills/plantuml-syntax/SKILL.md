---
name: plantuml-syntax
description: "This skill should be used when the user asks about PlantUML syntax for C4-PlantUML, sequence, class, activity, state, ER, component, deployment, or use case diagrams, rendering errors, layout conflicts, skinparams, or themes."
---

# PlantUML Syntax Reference

A comprehensive reference for PlantUML diagram types with a focus on C4-PlantUML for architecture diagrams. This skill provides syntax documentation adapted from the [SpillwaveSolutions/plantuml](https://github.com/SpillwaveSolutions/plantuml) project, supplemented with ArcKit-specific C4 layout conflict rules and best practices.

## Supported Diagram Types

Select the appropriate diagram type and read the corresponding reference file:

| Type | Reference | ArcKit Commands Using It |
| ---- | --------- | ------------------------ |
| C4-PlantUML | [c4-plantuml.md](references/c4-plantuml.md) | `/arckit.diagram` (C4 Context, Container, Component) |
| Sequence Diagram | [sequence-diagrams.md](references/sequence-diagrams.md) | `/arckit.diagram` (Sequence mode) |
| Class Diagram | [class-diagrams.md](references/class-diagrams.md) | — |
| Activity Diagram | [activity-diagrams.md](references/activity-diagrams.md) | — |
| State Diagram | [state-diagrams.md](references/state-diagrams.md) | — |
| ER Diagram | [er-diagrams.md](references/er-diagrams.md) | — |
| Component Diagram | [component-diagrams.md](references/component-diagrams.md) | — |
| Use Case Diagram | [use-case-diagrams.md](references/use-case-diagrams.md) | — |
| Deployment Diagram | [deployment-diagrams.md](references/deployment-diagrams.md) | — |

## Styling & Errors

| Topic | Reference |
| ----- | --------- |
| Common Syntax Errors | [common-syntax-errors.md](references/common-syntax-errors.md) |
| Styling Guide | [styling-guide.md](references/styling-guide.md) |

## C4-PlantUML (Primary Use Case)

The C4-PlantUML reference is the most important file for ArcKit users. It covers:

- Include URLs for C4 libraries
- Element syntax (Person, System, Container, Component, and their variants)
- Boundary syntax (System_Boundary, Container_Boundary)
- **Directional relationships** (Rel_Down, Rel_Right, Rel_Up, Rel_Left, Rel_Neighbor)
- **Layout constraints** (Lay_Right, Lay_Down, Lay_Distance)
- **LAYOUT CONFLICT RULES** — critical rules to prevent rendering failures when layout hints contradict relationship directions
- Tier-based layout patterns
- Worked examples for Context, Container, and Component diagrams

For C4 layout science (Sugiyama algorithm, edge crossing targets, declaration ordering), also see the Mermaid skill's [c4-layout-science.md](../mermaid-syntax/references/c4-layout-science.md) — Section 7 covers PlantUML directional hints.

## Common Syntax Gotchas

These are the most common PlantUML syntax errors encountered when generating diagrams:

| Gotcha | Problem | Fix |
|--------|---------|-----|
| `Rel_Down` contradicts `Lay_Right` | Layout engine receives conflicting direction hints for the same element pair | Ensure every `Rel_*` direction is consistent with any `Lay_*` constraint on the same pair |
| Missing `@startuml`/`@enduml` | Diagram fails to render entirely | Always wrap PlantUML code in `@startuml` and `@enduml` |
| Wrong `!include` URL | C4 macros not found, syntax errors on Person/System/Container | Use exact URL from plantuml-stdlib: `https://raw.githubusercontent.com/plantuml-stdlib/C4-PlantUML/master/C4_Context.puml` |
| Generic `Rel` instead of directional | Layout engine places elements randomly without direction hints | Always use `Rel_Down`, `Rel_Right`, etc. instead of plain `Rel` |
| Missing element declaration | Relationship references an undeclared element ID | Declare ALL elements before ANY relationships |
| Spaces in element IDs | Parser fails on IDs with spaces or special characters | Use camelCase or underscores: `paymentApi`, `payment_api` |
| Nested boundaries without content | Empty boundaries may cause rendering errors | Ensure every boundary contains at least one element |
| `\n` in descriptions | Expects literal `\n` text but PlantUML renders it as a line break | This is expected behavior — PlantUML interprets `\n` as line breaks natively. Use `\\n` if literal text is needed |

## ArcKit Integration

This skill handles **conversational** PlantUML syntax questions — quick lookups, syntax examples, troubleshooting rendering issues, and learning about diagram types.

For **formal architecture diagram generation** with document control, project integration, layout science, and governance compliance, use the `/arckit:diagram` command instead. It generates versioned diagram artifacts saved to your project directory with full traceability to requirements and architecture principles.
