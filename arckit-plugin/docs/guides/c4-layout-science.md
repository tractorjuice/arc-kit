# C4 Layout Science Guide

A research-backed guide to creating readable C4 architecture diagrams with minimal edge crossings and clear visual hierarchy. This guide covers the graph drawing theory behind layout engines, practical declaration ordering strategies, quality targets from empirical research, and a structured validation checklist.

For the full reference template used by the `/arckit:diagram` command, see `arckit-plugin/templates/c4-diagram-reference.md`.

---

## Graph Drawing Theory

### The Sugiyama Algorithm

Mermaid's layout engine uses Dagre, which implements the **Sugiyama hierarchical layout algorithm** — the most widely-used method for drawing directed graphs in layers. Understanding how this algorithm works explains why certain authoring choices produce better diagrams.

The algorithm proceeds in four stages:

**Stage 1: Cycle Removal**
The algorithm temporarily reverses edges that create cycles in the graph. This ensures the graph can be processed as a directed acyclic graph (DAG). Reversed edges are restored with their original direction after layout is complete.

**Stage 2: Layer Assignment**
Each node is assigned to a horizontal or vertical layer (rank). Nodes that depend on other nodes are placed in later layers, creating the top-to-bottom or left-to-right hierarchy. Long edges that span multiple layers are broken into segments with invisible intermediate nodes.

**Stage 3: Crossing Minimisation**
This is the critical stage where declaration order matters. The algorithm reorders nodes within each layer to minimise the number of edge crossings. The most common technique is the **barycentric method**: for each node, compute the average position of its connected neighbours in the adjacent layer, then sort nodes by this average.

The barycentric method is a local optimisation heuristic — it improves an initial ordering but does not guarantee a global optimum. This means the initial order (determined by the order nodes appear in the source code) significantly affects the final result. A good starting order produces fewer crossings.

**Stage 4: Coordinate Assignment**
Final x/y coordinates are calculated for each node, respecting minimum spacing, edge routing, and the layer assignments from Stage 2.

### Why This Matters for Architecture Diagrams

When you write a Mermaid or PlantUML diagram, you are providing the initial ordering for Stage 3. If your declaration order already matches the intended visual layout, the crossing minimisation heuristic starts from a near-optimal position and produces a clean diagram. If elements are declared in random order, the heuristic starts from a poor position and may converge to a layout with unnecessary crossings.

---

## Declaration Ordering

### The Tier-Based Strategy

For architecture diagrams, the most effective declaration strategy is **tier-based ordering**: declare elements in the order they should appear visually, following the natural data flow of the system.

For a `flowchart LR` (left-to-right) diagram:

| Order | Tier | Examples | Position |
|-------|------|----------|----------|
| 1 | Actors | Citizens, administrators, operators | Leftmost |
| 2 | Presentation | Web applications, mobile apps, portals | Left |
| 3 | API | API gateways, load balancers, BFF services | Centre-left |
| 4 | Service | Business logic, orchestrators, workers | Centre |
| 5 | Data | Databases, caches, queues, object stores | Centre-right |
| 6 | External systems | Third-party APIs, GOV.UK services, banks | Rightmost |

For a `flowchart TB` (top-to-bottom) diagram, the same tiers apply vertically: actors at the top, external systems at the bottom.

### Three Rules

1. **Declare ALL elements before ANY relationships.** The layout engine positions nodes as it encounters them. If a relationship references an undeclared node, the engine creates it at that point, often in a suboptimal position.

2. **Within each tier, declare elements in the order you want them to appear.** For a horizontal layout, declare left-to-right. For a vertical layout, declare top-to-bottom.

3. **Group related elements with `subgraph`.** This constrains the layout engine to keep grouped elements together, reinforcing the visual hierarchy.

### C4-Specific Ordering

For C4 native syntax (`C4Context`, `C4Container`), the recommended declaration order is:

1. `Person(...)` — all actors
2. `System(...)` — the system being described
3. `System_Boundary(...)` — system boundaries containing:
   - `Container(...)` — in tier order within the boundary
   - `ContainerDb(...)` — databases
   - `ContainerQueue(...)` — queues (PlantUML only)
4. `System_Ext(...)` — all external systems
5. `Rel(...)` — all relationships last

---

## Edge Crossing Targets

### The Research

Purchase et al. conducted empirical studies measuring how different graph aesthetics affect human comprehension. Their key finding: **edge crossings are the strongest negative predictor of diagram comprehension**, significantly more impactful than:

- Node overlap
- Edge bends
- Symmetry violations
- Minimum angle between edges

Participants shown diagrams with fewer crossings understood them faster, answered questions about them more accurately, and rated them as more readable.

### Practical Targets

Based on this research and practical experience with architecture diagrams:

| Complexity | Element Count | Target Crossings | Notes |
|-----------|--------------|-----------------|-------|
| Simple | 6 or fewer | 0 | Easily achievable with tier-based ordering |
| Medium | 7-12 | Fewer than 3 | Requires careful ordering; subgraphs help |
| Complex | More than 12 | Fewer than 5 | May need diagram splitting or PlantUML hints |

### Counting Crossings

When evaluating a rendered diagram:

- Count each point where two edges intersect (not at a node)
- Self-loops and edges to/from the same subgraph boundary do not count
- Edges that run parallel closely but do not intersect do not count
- If you cannot count crossings easily, the diagram is too complex — split it

---

## Visual Hierarchy

### The Gestalt Proximity Principle

The Gestalt principle of proximity states that elements placed close together are perceived as belonging to the same group. In architecture diagrams, this principle supports two practices:

1. **Use `subgraph` blocks** to visually group related elements. Mermaid draws a visible boundary around subgraph contents, creating an immediate visual grouping.

2. **Nest subgraphs** to represent hierarchical containment. For example, a system boundary containing multiple subsystem boundaries containing individual containers.

### Applying Visual Hierarchy in C4

| C4 Level | Visual Treatment | How to Achieve |
|----------|-----------------|----------------|
| Context | System boundary is the largest visual element | Single `subgraph` or `System_Boundary` containing all internal elements |
| Container | Containers grouped by architectural tier | Nested `subgraph` blocks for presentation, service, and data tiers |
| Component | Components grouped by responsibility | `subgraph` blocks for handlers, services, repositories |
| Deployment | Infrastructure zones (VPC, subnets, regions) | Deeply nested `subgraph` blocks matching network topology |

### Boundary Styling

Use dashed borders for trust boundaries and solid borders for system boundaries:

```mermaid
%% Trust boundary (dashed)
subgraph TrustBoundary["DMZ"]
    style TrustBoundary stroke:#1168BD,stroke-dasharray:5 5,fill:none
end

%% System boundary (solid)
subgraph SystemBoundary["Payment Gateway"]
    style SystemBoundary stroke:#1168BD,stroke-width:2px,fill:#E8F0FE
end
```

---

## Validation Checklist

After generating any architecture diagram, evaluate it against these six criteria:

| # | Criterion | Target | How to Evaluate |
|---|-----------|--------|----------------|
| 1 | **Edge crossings** | 0 for simple, fewer than 3 for medium, fewer than 5 for complex | Count intersection points of edges (not at nodes) |
| 2 | **Visual hierarchy** | System boundary is the most prominent visual element | Check that the main system boundary is immediately identifiable |
| 3 | **Grouping** | Related elements are proximate | Verify that architecturally-related elements appear visually close |
| 4 | **Flow direction** | Consistent left-to-right or top-to-bottom | Check that the primary data flow follows one consistent direction |
| 5 | **Relationship traceability** | Each line can be followed from source to target | Trace each edge visually — if any edge is ambiguous, the diagram needs improvement |
| 6 | **Abstraction level** | One C4 level per diagram | Verify that the diagram does not mix context-level and container-level elements |

### Quality Gate Integration

The `/arckit:diagram` command includes a **Step 5b: Diagram Quality Gate** that automatically evaluates generated diagrams against these criteria and reports results in a structured table. Any failing criterion triggers an iterative refinement cycle.

---

## Iterative Refinement

When a diagram fails one or more validation criteria, follow this systematic process:

### Step 1: Reorder Declarations

The most common fix. Rearrange element declarations to match the intended tier layout:

- Actors first (leftmost or topmost)
- Internal elements in data-flow order
- External systems last (rightmost or bottommost)

This alone resolves most edge crossing issues.

### Step 2: Add Subgraph Grouping

Group related elements using `subgraph` blocks:

```mermaid
subgraph Services["Business Services"]
    PaymentService["Payment Service"]
    NotificationService["Notification Service"]
    AuditService["Audit Service"]
end
```

This constrains the layout engine to keep grouped elements together, reducing crossings between unrelated edges.

### Step 3: Reorder Within Subgraphs

The same tier-ordering principle applies within each subgraph. If elements within a group produce crossings, reorder their declarations.

### Step 4: Change Orientation

Try switching between `flowchart LR` and `flowchart TB`. Some architectures produce fewer crossings in one orientation than the other:

- **Horizontal (LR)** works well for data-flow architectures (request flows left to right)
- **Vertical (TB)** works well for hierarchical architectures (users at top, infrastructure at bottom)

### Step 5: Use PlantUML Directional Hints

If Mermaid cannot achieve acceptable results, switch to PlantUML with the C4-PlantUML library and use directional hints:

| Hint | Effect |
|------|--------|
| `Rel_Down(a, b, ...)` | Places a above b |
| `Rel_Right(a, b, ...)` | Places a left of b |
| `Lay_Right(a, b)` | Forces a left of b (invisible) |
| `Lay_Down(a, b)` | Forces a above b (invisible) |

### Step 6: Split the Diagram

If the element count exceeds 15 or crossings remain above the target after all other refinements, split the diagram at a natural boundary:

- **System boundary** — separate context from internal structure
- **Trust boundary** — separate public-facing from internal components
- **Domain boundary** — separate bounded contexts
- **Deployment boundary** — separate cloud regions or availability zones

### Step 7: Document Trade-Offs

If a crossing or layout imperfection cannot be eliminated without sacrificing clarity elsewhere, document it explicitly in the diagram's architecture decisions section.

---

## Format Selection Guide

Choose the right format based on diagram complexity and requirements:

| Scenario | Format | Reason |
|----------|--------|--------|
| Simple C4 (12 or fewer elements) | Mermaid `C4Context` / `C4Container` | Native C4 syntax, renders in GitHub markdown and VS Code |
| Complex C4 (more than 12 elements) | PlantUML with C4-PlantUML | Directional hints (`Rel_Right`, `Lay_Down`) for precise crossing control |
| Deployment diagrams | Mermaid `flowchart` | `subgraph` nesting maps naturally to infrastructure zones (VPC, subnets, AZs) |
| Sequence diagrams | Mermaid `sequenceDiagram` | Native support for request/response flows, alt/opt blocks, participant ordering |
| Data flow diagrams | Mermaid `flowchart` | PII annotations, data classification labels, retention metadata in node labels |
| Wardley Maps | Online Wardley Mapping (OWM) | Specialised positioning by evolution and value chain; not achievable in Mermaid |

### Rendering Environments

| Environment | Mermaid Support | PlantUML Support |
|-------------|----------------|-----------------|
| GitHub markdown | Native rendering | Requires image embedding |
| VS Code | Mermaid Preview extension | PlantUML extension |
| mermaid.live | Full interactive editor | N/A |
| PlantUML Server | N/A | Full rendering |
| Confluence | Mermaid plugin (varies) | PlantUML plugin |
| PDF export | Via Mermaid CLI (`mmdc`) | Via PlantUML JAR |

---

## References

1. **Purchase, H.C., Cohen, R.F., and James, M.I.** (1997). "An Experimental Study of the Basis for Graph Drawing Aesthetics." *Journal of Visual Languages and Computing*, 8(1), 32-50.

2. **Purchase, H.C.** (2002). "Metrics for Graph Drawing Aesthetics." *Journal of Visual Languages and Computing*, 13(5), 501-516. Establishes that edge crossings have the strongest negative effect on comprehension.

3. **Sugiyama, K., Tagawa, S., and Toda, M.** (1981). "Methods for Visual Understanding of Hierarchical System Structures." *IEEE Transactions on Systems, Man, and Cybernetics*, 11(2), 109-125. The foundational algorithm for layered graph drawing.

4. **Brown, S.** The C4 Model for Visualising Software Architecture. [https://c4model.com](https://c4model.com). Defines the four abstraction levels (Context, Container, Component, Code) and standard visual notation.

5. **Wertheimer, M.** (1923). "Untersuchungen zur Lehre von der Gestalt II." *Psychologische Forschung*, 4(1), 301-350. Establishes the proximity principle used to justify subgraph grouping.

6. **Mermaid Documentation** — Flowchart Syntax. [https://mermaid.js.org/syntax/flowchart.html](https://mermaid.js.org/syntax/flowchart.html).

7. **C4-PlantUML** — PlantUML macros for C4 diagrams. [https://github.com/plantuml-stdlib/C4-PlantUML](https://github.com/plantuml-stdlib/C4-PlantUML).

---

*This guide is part of the ArcKit documentation. For the template used by the diagram command, see `arckit-plugin/templates/c4-diagram-reference.md`. For the diagram command itself, see `/arckit:diagram`.*
