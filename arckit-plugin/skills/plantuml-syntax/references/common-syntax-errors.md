# PlantUML Common Syntax Errors Reference

A catalogue of frequently encountered PlantUML syntax errors, their causes, and fixes. Organised by diagram type.

---

## Universal Errors (All Diagram Types)

| Error | Cause | Fix |
|-------|-------|-----|
| No diagram rendered | Missing `@startuml` / `@enduml` | Always wrap code in `@startuml` and `@enduml` |
| "Syntax Error?" message | Invalid character in diagram body | Check for unescaped special characters: `{`, `}`, `<`, `>` in labels |
| Blank output | Empty diagram body or only comments | Ensure at least one element is declared between `@startuml` and `@enduml` |
| "Cannot find skin" | Invalid skinparam name | Check spelling of skinparam names (case-sensitive) |
| Encoding issues | Non-ASCII characters in source | Use UTF-8 encoding; avoid copy-pasted special quotes (" ") — use straight quotes (" ") |
| Unexpected layout | Too many elements without layout hints | Add directional arrows (`-down->`, `-right->`) or use `Lay_*` constraints |
| "File not found" on `!include` | Network issue or wrong URL | Verify URL is accessible; use `!includeurl` for remote files in older PlantUML versions |

## C4-PlantUML Errors

| Error | Cause | Fix |
|-------|-------|-----|
| "Unknown function Person" | Missing or wrong `!include` URL | Include the correct C4 library: `!include https://raw.githubusercontent.com/plantuml-stdlib/C4-PlantUML/master/C4_Context.puml` |
| Elements overlap | Conflicting `Lay_*` and `Rel_*` directions | Ensure every `Rel_*` direction is consistent with `Lay_*` constraints on the same pair (see layout conflict rules) |
| Random element placement | Using generic `Rel` without direction hints | Replace all `Rel(a, b, ...)` with `Rel_Down(a, b, ...)` or `Rel_Right(a, b, ...)` |
| Boundary renders empty | No elements inside boundary block | Add at least one element inside every `System_Boundary` or `Container_Boundary` |
| "Syntax error: )" | Wrong number of parameters in element macro | Check parameter count: Context elements take 3 params, Container/Component take 4 |
| Invisible relationships | `Lay_*` used where `Rel_*` intended | `Lay_Right`, `Lay_Down` are invisible — use `Rel_Right`, `Rel_Down` for visible arrows |

## Sequence Diagram Errors

| Error | Cause | Fix |
|-------|-------|-----|
| Missing participant | Participant referenced but not declared | Declare all participants before the first message |
| "Unknown arrow" | Invalid arrow syntax | Use `->` (solid), `-->` (dashed), `->>` (async), `-->>` (async dashed) |
| Misaligned activation | `activate`/`deactivate` mismatch | Match every `activate` with a `deactivate`, or use `++`/`--` shorthand |
| "alt" without "end" | Missing closing `end` for grouping block | Close every `alt`, `opt`, `loop`, `par`, `group` with `end` |
| Overlapping boxes | Box declarations conflict | Ensure `box` groupings don't overlap and all participants belong to at most one box |

## Class Diagram Errors

| Error | Cause | Fix |
|-------|-------|-----|
| Relationship direction wrong | Arrow drawn in unexpected direction | Use `-up-\|>`, `-down-\|>`, `-left-\|>`, `-right-\|>` for explicit direction |
| Duplicate class | Same class name declared twice | Use aliases: `class "Name" as alias1` |
| "Cannot find class" | Referencing undeclared class in relationship | Declare all classes before defining relationships |
| Visibility icons missing | `skinparam classAttributeIconSize 0` set | Remove or adjust this skinparam |

## Activity Diagram Errors

| Error | Cause | Fix |
|-------|-------|-----|
| "Unexpected token" | Missing `;` at end of activity | Activities must end with `;`: `:Do something;` |
| Infinite loop in render | Unclosed `while` or `repeat` | Ensure every `while` has `endwhile` and every `repeat` has `repeat while` |
| Missing swimlane content | Empty swimlane partition | Add at least one activity in each swimlane |
| "if" without "endif" | Missing closing `endif` | Close every `if` block with `endif` |

## State Diagram Errors

| Error | Cause | Fix |
|-------|-------|-----|
| "Cannot parse" | Using activity diagram syntax in state diagram | State transitions use `-->` between state names, not `:activity;` syntax |
| Missing final state | No path to `[*]` end state | Ensure at least one state transitions to `[*]` |
| Nested state rendering issues | Too many nesting levels | Limit nesting to 2-3 levels; split complex state machines into multiple diagrams |

## ER Diagram Errors

| Error | Cause | Fix |
|-------|-------|-----|
| Relationship lines missing | Wrong cardinality syntax | Use `\|\|--o{` notation (pipe, pipe, dash, dash, o, curly brace) |
| Entity renders as class | Using `class` keyword instead of `entity` | Use `entity "Name" as alias` syntax |
| Attributes not showing | Missing attribute block format | Use `entity Name { * field : type }` format with `*` for mandatory fields |

## Component Diagram Errors

| Error | Cause | Fix |
|-------|-------|-----|
| Component renders as class | Wrong syntax | Use `component [Name]` or `component "Name" as alias` |
| Interface not connecting | Wrong interface syntax | Provided: `-()` (lollipop); Required: `-(` (socket) |
| Package overlap | Nested packages with same names | Use unique names or aliases for all packages |

## Version-Specific Issues

| PlantUML Version | Issue | Workaround |
|-----------------|-------|------------|
| < 1.2023.1 | C4-PlantUML `!include` may fail | Use `!includeurl` instead of `!include` |
| < 1.2022.0 | `ContainerQueue` not available | Use `Container` with `<<queue>>` stereotype |
| All versions | Large diagrams (more than 50 elements) may timeout | Split into multiple diagrams; increase timeout with `-DPLANTUML_LIMIT_SIZE=8192` |
| All versions | Remote `!include` blocked by firewall | Download C4 `.puml` files locally and use local `!include` path |

## Debugging Tips

1. **Start minimal**: Begin with 2-3 elements and add incrementally
2. **Check the PlantUML server**: Paste code at https://www.plantuml.com/plantuml/uml/ for immediate feedback
3. **Read error messages carefully**: PlantUML error messages usually point to the exact line
4. **Comment out sections**: Use `' comment` syntax to isolate problematic sections
5. **Check `!include` URLs**: Open the URL in a browser to verify it's accessible
6. **Use `!pragma layout smetana`**: Alternative layout engine that may produce better results for some diagrams
