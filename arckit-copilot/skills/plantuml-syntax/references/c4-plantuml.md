# C4-PlantUML Reference

The C4-PlantUML library extends PlantUML with macros for creating C4 model architecture diagrams. This reference covers element syntax, relationship directions, layout constraints, and — critically — **layout conflict rules** to prevent rendering failures.

**Library**: [plantuml-stdlib/C4-PlantUML](https://github.com/plantuml-stdlib/C4-PlantUML)

---

## 1. Include URLs

Every C4-PlantUML diagram must include the appropriate library file. Use one include per diagram type:

```plantuml
' Context Diagram (Level 1)
!include https://raw.githubusercontent.com/plantuml-stdlib/C4-PlantUML/master/C4_Context.puml

' Container Diagram (Level 2)
!include https://raw.githubusercontent.com/plantuml-stdlib/C4-PlantUML/master/C4_Container.puml

' Component Diagram (Level 3)
!include https://raw.githubusercontent.com/plantuml-stdlib/C4-PlantUML/master/C4_Component.puml

' Deployment Diagram
!include https://raw.githubusercontent.com/plantuml-stdlib/C4-PlantUML/master/C4_Deployment.puml

' Dynamic Diagram
!include https://raw.githubusercontent.com/plantuml-stdlib/C4-PlantUML/master/C4_Dynamic.puml
```

**Container includes Context**, and **Component includes Container**, so you only need one include per diagram.

---

## 2. Element Syntax

### Context-Level Elements

| Macro | Description | Parameters |
|-------|-------------|------------|
| `Person(alias, label, description)` | A person/user interacting with the system | alias, label, description |
| `Person_Ext(alias, label, description)` | An external person | alias, label, description |
| `System(alias, label, description)` | The system being described | alias, label, description |
| `System_Ext(alias, label, description)` | An external system | alias, label, description |
| `SystemDb(alias, label, description)` | A database system | alias, label, description |
| `SystemDb_Ext(alias, label, description)` | An external database system | alias, label, description |
| `SystemQueue(alias, label, description)` | A queue system | alias, label, description |
| `SystemQueue_Ext(alias, label, description)` | An external queue system | alias, label, description |

### Container-Level Elements

| Macro | Description | Parameters |
|-------|-------------|------------|
| `Container(alias, label, technology, description)` | A container (application, service) | alias, label, tech, description |
| `ContainerDb(alias, label, technology, description)` | A database container | alias, label, tech, description |
| `ContainerQueue(alias, label, technology, description)` | A message queue container | alias, label, tech, description |
| `Container_Ext(alias, label, technology, description)` | An external container | alias, label, tech, description |
| `ContainerDb_Ext(alias, label, technology, description)` | An external database | alias, label, tech, description |
| `ContainerQueue_Ext(alias, label, technology, description)` | An external queue | alias, label, tech, description |

### Component-Level Elements

| Macro | Description | Parameters |
|-------|-------------|------------|
| `Component(alias, label, technology, description)` | A component within a container | alias, label, tech, description |
| `ComponentDb(alias, label, technology, description)` | A database component | alias, label, tech, description |
| `ComponentQueue(alias, label, technology, description)` | A queue component | alias, label, tech, description |
| `Component_Ext(alias, label, technology, description)` | An external component | alias, label, tech, description |
| `ComponentDb_Ext(alias, label, technology, description)` | An external database component | alias, label, tech, description |

---

## 3. Boundary Syntax

Boundaries group related elements visually:

```plantuml
System_Boundary(alias, label) {
    ' Elements inside this boundary
    Container(web, "Web App", "React", "User interface")
    Container(api, "API", "Node.js", "Business logic")
}

Container_Boundary(alias, label) {
    ' Components inside this container
    Component(ctrl, "Controller", "Express", "HTTP handlers")
    Component(svc, "Service", "Business Logic", "Core processing")
}

Enterprise_Boundary(alias, label) {
    ' Systems inside this enterprise
    System(crm, "CRM", "Customer relationship management")
    System(erp, "ERP", "Enterprise resource planning")
}
```

**Nesting**: Boundaries can be nested. `System_Boundary` inside `Enterprise_Boundary`, `Container_Boundary` inside `System_Boundary`.

---

## 4. Directional Relationships

Directional relationship macros control how the layout engine positions elements relative to each other.

### Relationship Macros

| Macro | Effect | Use For |
|-------|--------|---------|
| `Rel(from, to, label, protocol)` | Generic relationship (no layout hint) | **Avoid** — always prefer directional variants |
| `Rel_Down(from, to, label, protocol)` | Places `from` above `to` | Hierarchical tiers (user above system, API above database) |
| `Rel_Up(from, to, label, protocol)` | Places `from` below `to` | Callbacks, reverse dependencies |
| `Rel_Right(from, to, label, protocol)` | Places `from` left of `to` | Horizontal data flow (left-to-right reading) |
| `Rel_Left(from, to, label, protocol)` | Places `from` right of `to` | Reverse horizontal flow |
| `Rel_Neighbor(from, to, label, protocol)` | Forces `from` and `to` adjacent | Tightly coupled components |

**Best Practice**: Every relationship should use a directional variant. Generic `Rel` gives the layout engine no guidance, resulting in unpredictable placement.

### Relationship with Technology Tag

The `protocol` parameter is optional. Both are valid:

```plantuml
Rel_Right(web, api, "Calls", "REST/JSON")   ' With protocol
Rel_Down(api, db, "Reads/Writes")           ' Without protocol
```

---

## 5. Layout Constraints

Layout constraints are **invisible** — they force element positioning without drawing any visible arrow.

| Macro | Effect | Use For |
|-------|--------|---------|
| `Lay_Right(a, b)` | Forces `a` to appear to the left of `b` | Aligning elements within the same tier |
| `Lay_Down(a, b)` | Forces `a` to appear above `b` | Vertical tier alignment |
| `Lay_Left(a, b)` | Forces `a` to appear to the right of `b` | Reverse horizontal alignment |
| `Lay_Up(a, b)` | Forces `a` to appear below `b` | Reverse vertical alignment |
| `Lay_Distance(a, b, distance)` | Increases spacing between `a` and `b` | Separating logical groups |

---

## 6. LAYOUT CONFLICT RULES

**These rules are critical.** Violating them produces diagrams where elements overlap, arrows cross unnecessarily, or the layout engine produces unreadable output.

### Rule 1: Directional Consistency

> **If `Lay_Right(a, b)` exists, NEVER use `Rel_Down(a, b)` or `Rel_Up(a, b)` between the same pair. Use `Rel_Right(a, b)` instead.**

The layout engine receives conflicting instructions: `Lay_Right` says "put a left of b" while `Rel_Down` says "put a above b". The result is unpredictable — elements may overlap or arrows may cross multiple unrelated elements.

### Rule 2: Vertical Consistency

> **If `Lay_Down(a, b)` exists, NEVER use `Rel_Right(a, b)` or `Rel_Left(a, b)` between the same pair. Use `Rel_Down(a, b)` instead.**

Same principle as Rule 1 but for vertical constraints.

### Rule 3: All Pairs Must Agree

> **Every `Rel_*` direction must be consistent with any `Lay_*` constraint on the same element pair.**

Check every `Lay_*` line and verify that all `Rel_*` lines involving the same two elements use a compatible direction.

| Lay_* Constraint | Compatible Rel_* | Incompatible Rel_* |
|-----------------|-----------------|-------------------|
| `Lay_Right(a, b)` | `Rel_Right(a, b)`, `Rel_Left(b, a)` | `Rel_Down(a, b)`, `Rel_Up(a, b)` |
| `Lay_Down(a, b)` | `Rel_Down(a, b)`, `Rel_Up(b, a)` | `Rel_Right(a, b)`, `Rel_Left(a, b)` |
| `Lay_Left(a, b)` | `Rel_Left(a, b)`, `Rel_Right(b, a)` | `Rel_Down(a, b)`, `Rel_Up(a, b)` |
| `Lay_Up(a, b)` | `Rel_Up(a, b)`, `Rel_Down(b, a)` | `Rel_Right(a, b)`, `Rel_Left(a, b)` |

### Rule 4: Coverage

> **Every element should participate in at least one `Lay_*` constraint to prevent the layout engine from placing it arbitrarily.**

Elements without any layout constraint are "free-floating" — the engine places them wherever it finds space, often overlapping other elements.

### Validation Checklist

Before finalizing a PlantUML C4 diagram:

- [ ] Every `Rel_*` direction is compatible with any `Lay_*` on the same pair
- [ ] No generic `Rel` calls remain — all replaced with directional variants
- [ ] Every element has at least one `Lay_*` constraint
- [ ] Elements within the same tier share `Lay_Right` constraints
- [ ] Elements in adjacent tiers are connected with `Rel_Down` (higher to lower)

---

## 7. Tier-Based Layout Patterns

For architecture diagrams, declare and constrain elements by tier:

### Standard Tier Order (Top to Bottom)

1. **Actors** — Person, Person_Ext
2. **Presentation Layer** — Web applications, mobile apps, portals
3. **API Layer** — API gateways, load balancers, BFFs
4. **Service Layer** — Business logic, orchestrators, workers
5. **Data Layer** — Databases, caches, message queues, object stores
6. **External Systems** — Third-party APIs, legacy systems, SaaS providers

### Layout Pattern

```plantuml
@startuml
!include https://raw.githubusercontent.com/plantuml-stdlib/C4-PlantUML/master/C4_Container.puml

title Tier-Based Layout Example

' --- Tier 1: Actors ---
Person(user, "User", "End user")

' --- Tier 2: Presentation ---
Container(web, "Web App", "React", "User interface")

' --- Tier 3: API ---
Container(api, "API Gateway", "Kong", "Request routing")

' --- Tier 4: Service ---
Container(svc, "Service", "Node.js", "Business logic")

' --- Tier 5: Data ---
ContainerDb(db, "Database", "PostgreSQL", "Persistent storage")
ContainerQueue(queue, "Queue", "RabbitMQ", "Async events")

' --- Tier 6: External ---
System_Ext(ext, "Payment Provider", "External payment API")

' --- Relationships (direction matches tier flow) ---
Rel_Down(user, web, "Uses", "HTTPS")
Rel_Down(web, api, "Calls", "REST/JSON")
Rel_Down(api, svc, "Routes to", "gRPC")
Rel_Down(svc, db, "Reads/Writes", "SQL")
Rel_Down(svc, queue, "Publishes", "AMQP")
Rel_Right(svc, ext, "Processes via", "API")

' --- Layout constraints (same-tier alignment) ---
Lay_Right(db, queue)

@enduml
```

### Key Principles

- **Relationships flow downward** between tiers (user → presentation → API → service → data)
- **Relationships flow rightward** within the same tier or to external systems
- **`Lay_Right` aligns** elements within the same tier horizontally
- **`Lay_Down` separates** elements that should be in different tiers but aren't connected by a relationship

---

## 8. Worked Examples

### Example 1: C4 Context Diagram

```plantuml
@startuml
!include https://raw.githubusercontent.com/plantuml-stdlib/C4-PlantUML/master/C4_Context.puml

title System Context - Online Banking

Person(customer, "Customer", "A bank customer")
Person(admin, "Bank Admin", "Internal administrator")

System(banking, "Online Banking System", "Allows customers to view accounts and make transfers")

System_Ext(email, "Email System", "Sends notifications")
System_Ext(mainframe, "Core Banking", "Mainframe legacy system")

Rel_Down(customer, banking, "Views accounts, makes transfers", "HTTPS")
Rel_Down(admin, banking, "Manages users, reviews transactions", "HTTPS")
Rel_Right(banking, email, "Sends notifications", "SMTP")
Rel_Right(banking, mainframe, "Gets account data", "XML/HTTPS")

Lay_Right(customer, admin)
Lay_Right(email, mainframe)

@enduml
```

### Example 2: C4 Container Diagram

```plantuml
@startuml
!include https://raw.githubusercontent.com/plantuml-stdlib/C4-PlantUML/master/C4_Container.puml

title Container Diagram - Online Banking

Person(customer, "Customer", "A bank customer")

System_Boundary(banking, "Online Banking System") {
    Container(spa, "Single-Page App", "JavaScript, React", "Provides banking UI")
    Container(api, "API Application", "Node.js, Express", "Provides banking API")
    Container(auth, "Auth Service", "Node.js", "Handles authentication")
    ContainerDb(db, "Database", "PostgreSQL", "Stores user and account data")
    ContainerQueue(queue, "Message Queue", "RabbitMQ", "Async processing")
}

System_Ext(email, "Email System", "Sends notifications")
System_Ext(mainframe, "Core Banking", "Legacy mainframe")

Rel_Down(customer, spa, "Uses", "HTTPS")
Rel_Down(spa, api, "Calls", "REST/JSON")
Rel_Right(spa, auth, "Authenticates via", "OAuth2")
Rel_Down(api, db, "Reads/Writes", "SQL")
Rel_Down(api, queue, "Publishes events", "AMQP")
Rel_Right(api, email, "Sends via", "SMTP")
Rel_Right(api, mainframe, "Gets data", "XML/HTTPS")

Lay_Right(spa, auth)
Lay_Right(db, queue)

@enduml
```

### Example 3: C4 Component Diagram

```plantuml
@startuml
!include https://raw.githubusercontent.com/plantuml-stdlib/C4-PlantUML/master/C4_Component.puml

title Component Diagram - API Application

Container_Boundary(api, "API Application") {
    Component(router, "API Router", "Express", "Routes HTTP requests")
    Component(authMiddleware, "Auth Middleware", "Passport.js", "JWT validation")
    Component(accountCtrl, "Account Controller", "Controller", "Account operations")
    Component(transferCtrl, "Transfer Controller", "Controller", "Transfer operations")
    Component(accountSvc, "Account Service", "Business Logic", "Account processing")
    Component(transferSvc, "Transfer Service", "Business Logic", "Transfer processing")
    ComponentDb(repo, "Repository", "Sequelize", "Data access layer")
}

ContainerDb(db, "Database", "PostgreSQL", "Account data")
System_Ext(mainframe, "Core Banking", "Legacy system")

Rel_Right(router, authMiddleware, "Validates via")
Rel_Down(router, accountCtrl, "Routes to")
Rel_Down(router, transferCtrl, "Routes to")
Rel_Down(accountCtrl, accountSvc, "Uses")
Rel_Down(transferCtrl, transferSvc, "Uses")
Rel_Down(accountSvc, repo, "Reads/Writes via")
Rel_Down(transferSvc, repo, "Reads/Writes via")
Rel_Down(repo, db, "SQL queries")
Rel_Right(transferSvc, mainframe, "Initiates transfer", "XML/HTTPS")

Lay_Right(accountCtrl, transferCtrl)
Lay_Right(accountSvc, transferSvc)

@enduml
```

---

## 9. PlantUML vs Mermaid: When to Use Each

| Criterion | Mermaid | PlantUML |
|----------|---------|----------|
| Element count | 12 or fewer | More than 12 |
| Layout control needed | Low to moderate | High (directional hints) |
| Rendering | GitHub, VS Code, ArcKit Pages | PlantUML server, VS Code extension, CLI |
| Edge crossing control | Declaration order only | Directional hints + layout constraints |
| Native C4 support | C4Context/C4Container syntax | Full C4-PlantUML library |
| Best for | Quick diagrams, documentation | Complex architectures, precise layouts |

**ArcKit recommendation**: Start with Mermaid for simplicity. Switch to PlantUML when the diagram exceeds 12 elements or when you need precise control over element positioning.
