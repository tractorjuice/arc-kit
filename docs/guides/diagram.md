# Architecture Diagram Guide

A guide to creating architecture diagrams using ArcKit and Mermaid.

---

## What are Architecture Diagrams?

Architecture diagrams visualize system structure, components, and relationships using standardized notation. ArcKit generates diagrams using **Mermaid** syntax, which renders beautifully in markdown.

### Why Create Diagrams?

Without diagrams:
- ❌ Architecture discussions lack shared visual reference
- ❌ New team members struggle to understand system structure
- ❌ Design reviews focus on text instead of visuals
- ❌ Stakeholders can't visualize the solution

With diagrams:
- ✅ Shared understanding of architecture
- ✅ Faster onboarding for new team members
- ✅ Visual design reviews
- ✅ Stakeholder alignment on solution approach

---

## When to Create Diagrams

```bash
/arckit.diagram Create [diagram type] diagram for [your project]
```

**Create diagrams at these points:**
- **Discovery/Alpha** - Context diagram to show system boundaries
- **Alpha/Beta** - Container and component diagrams for HLD
- **Beta** - Deployment diagram for infrastructure
- **Design reviews** - Visual aids for HLD/DLD reviews
- **Documentation** - Architecture documentation repository

---

## Diagram Types (C4 Model)

ArcKit uses the **C4 Model** for architecture diagrams:

### 1. Context Diagram (Level 1)

**Purpose**: Show the system in its environment

**Audience**: Everyone (stakeholders, users, developers)

**Shows**:
- Your system (single box)
- External systems it integrates with
- Users/actors who interact with it
- High-level relationships

**Example**:
```mermaid
graph TB
    Customer[Customer<br/>Person]
    PaymentGateway[Payment Gateway System]
    StripeAPI[Stripe API<br/>External System]
    BankingSystem[Core Banking<br/>External System]
    EmailService[SendGrid<br/>External System]

    Customer -->|Initiates payments| PaymentGateway
    PaymentGateway -->|Processes card payments| StripeAPI
    PaymentGateway -->|Transfers funds| BankingSystem
    PaymentGateway -->|Sends receipts| EmailService
```

**When to use**: Discovery, Alpha - to define system boundaries

---

### 2. Container Diagram (Level 2)

**Purpose**: Show major technology containers (apps, databases, services)

**Audience**: Technical team, architects, senior stakeholders

**Shows**:
- Web applications
- Mobile apps
- API services
- Databases
- Message queues
- Technology choices

**Example**:
```mermaid
graph TB
    subgraph "Payment Gateway System"
        WebApp[Payment Web App<br/>React, TypeScript]
        APIGateway[API Gateway<br/>AWS API Gateway]
        PaymentService[Payment Service<br/>Python, FastAPI]
        NotificationService[Notification Service<br/>Python, FastAPI]
        Database[(Payment Database<br/>PostgreSQL)]
        MessageQueue[Message Queue<br/>AWS SQS]
        Cache[(Redis Cache)]
    end

    Customer[Customer<br/>Web Browser]
    Stripe[Stripe API]
    SendGrid[SendGrid API]

    Customer -->|HTTPS| WebApp
    WebApp -->|JSON/HTTPS| APIGateway
    APIGateway -->|REST| PaymentService
    PaymentService -->|Read/Write| Database
    PaymentService -->|Publishes| MessageQueue
    PaymentService -->|Read/Write| Cache
    MessageQueue -->|Subscribes| NotificationService
    NotificationService -->|Sends emails| SendGrid
    PaymentService -->|Processes payments| Stripe
```

**When to use**: Alpha, Beta - for HLD documentation

---

### 3. Component Diagram (Level 3)

**Purpose**: Show internal structure of a container

**Audience**: Developers, technical leads

**Shows**:
- Components within a service
- Controllers, services, repositories
- Internal dependencies
- Design patterns

**Example**:
```mermaid
graph TB
    subgraph "Payment Service"
        PaymentController[Payment Controller<br/>REST API endpoints]
        PaymentBusinessLogic[Payment Business Logic<br/>Validation, orchestration]
        StripeAdapter[Stripe Adapter<br/>Payment gateway integration]
        PaymentRepository[Payment Repository<br/>Data access layer]
        NotificationPublisher[Notification Publisher<br/>Message publishing]
    end

    APIGateway[API Gateway]
    Database[(PostgreSQL Database)]
    StripeAPI[Stripe API]
    SQS[AWS SQS]

    APIGateway -->|HTTP Request| PaymentController
    PaymentController -->|Calls| PaymentBusinessLogic
    PaymentBusinessLogic -->|Calls| StripeAdapter
    PaymentBusinessLogic -->|Saves| PaymentRepository
    PaymentBusinessLogic -->|Publishes| NotificationPublisher
    StripeAdapter -->|API Call| StripeAPI
    PaymentRepository -->|SQL| Database
    NotificationPublisher -->|Publishes| SQS
```

**When to use**: Beta - for DLD documentation

---

### 4. Deployment Diagram (Level 4)

**Purpose**: Show physical/virtual infrastructure

**Audience**: DevOps, infrastructure team, operations

**Shows**:
- Servers/containers/instances
- Networks and subnets
- Load balancers
- Databases (instances)
- Availability zones/regions

**Example**:
```mermaid
graph TB
    subgraph "AWS Cloud"
        subgraph "VPC"
            subgraph "Public Subnets"
                ALB[Application Load Balancer<br/>us-east-1a, us-east-1b]
            end
            subgraph "Private Subnets - AZ1"
                ECS1[ECS Cluster<br/>Payment Service<br/>t3.large x 3]
                RDS1[RDS Primary<br/>PostgreSQL 15<br/>db.r5.xlarge]
            end
            subgraph "Private Subnets - AZ2"
                ECS2[ECS Cluster<br/>Payment Service<br/>t3.large x 3]
                RDS2[RDS Read Replica<br/>PostgreSQL 15<br/>db.r5.xlarge]
            end
        end
        CloudFront[CloudFront CDN]
        S3[S3 Bucket<br/>Static Assets]
        ElastiCache[ElastiCache<br/>Redis 7]
    end

    Internet[Internet]
    Customer[Customer]

    Customer -->|HTTPS| Internet
    Internet -->|HTTPS| CloudFront
    CloudFront -->|Origin| S3
    CloudFront -->|API Requests| ALB
    ALB -->|Routes| ECS1
    ALB -->|Routes| ECS2
    ECS1 -->|Reads/Writes| RDS1
    ECS2 -->|Reads/Writes| RDS1
    ECS1 -->|Reads| RDS2
    ECS2 -->|Reads| RDS2
    ECS1 -->|Cache| ElastiCache
    ECS2 -->|Cache| ElastiCache
```

**When to use**: Beta, Live - for deployment planning and ops documentation

---

## Mermaid Syntax

### Basic Flowchart

```mermaid
graph LR
    A[Square Box] --> B{Decision}
    B -->|Yes| C[Result 1]
    B -->|No| D[Result 2]
```

### Entity Relationship Diagram (ERD)

```mermaid
erDiagram
    CUSTOMER ||--o{ ORDER : places
    ORDER ||--|{ ORDER_ITEM : contains
    PRODUCT ||--o{ ORDER_ITEM : "ordered in"

    CUSTOMER {
        uuid customer_id PK
        string email
        string name
    }

    ORDER {
        uuid order_id PK
        uuid customer_id FK
        timestamp created_at
        decimal total_amount
    }

    PRODUCT {
        uuid product_id PK
        string name
        decimal price
    }
```

### Sequence Diagram

```mermaid
sequenceDiagram
    participant Customer
    participant WebApp
    participant PaymentService
    participant Stripe
    participant Database

    Customer->>WebApp: Submit payment
    WebApp->>PaymentService: POST /payments
    PaymentService->>Database: Check customer
    Database-->>PaymentService: Customer valid
    PaymentService->>Stripe: Create payment intent
    Stripe-->>PaymentService: Payment intent ID
    PaymentService->>Database: Save payment
    PaymentService-->>WebApp: 201 Created
    WebApp-->>Customer: Payment initiated
```

### State Diagram

```mermaid
stateDiagram-v2
    [*] --> Pending
    Pending --> Processing: Payment initiated
    Processing --> Succeeded: Payment confirmed
    Processing --> Failed: Payment declined
    Failed --> Pending: Retry
    Succeeded --> Refunded: Refund requested
    Refunded --> [*]
    Failed --> [*]
```

---

## Best Practices

### 1. Use the Right Level of Abstraction

- **Context**: Don't show internal details, only boundaries
- **Container**: Don't show classes, only major deployable units
- **Component**: Don't show every class, only significant components
- **Deployment**: Show actual infrastructure, not logical

### 2. Keep Diagrams Simple

- **7±2 rule**: Maximum 5-9 boxes per diagram
- If more complex, split into multiple diagrams
- Focus on what's important for the audience

### 3. Use Consistent Notation

- Solid lines: Synchronous calls
- Dashed lines: Asynchronous messages
- Colors: Same technology/layer same color
- Shape: Rectangles for systems, cylinders for databases

### 4. Label Relationships

```mermaid
graph LR
    A[Service A] -->|JSON/HTTPS<br/>POST /users| B[Service B]
```

Better than:
```mermaid
graph LR
    A[Service A] --> B[Service B]
```

### 5. Update Diagrams with Code

- Diagrams are documentation - keep them current
- Store diagrams in git with code
- Review diagrams in PRs
- Automate diagram generation where possible

---

## Common Diagram Patterns

### Microservices Architecture

```mermaid
graph TB
    subgraph "External"
        Customer[Customer]
        Admin[Administrator]
    end

    subgraph "Frontend Layer"
        CustomerWeb[Customer Web App<br/>React]
        AdminWeb[Admin Portal<br/>React]
    end

    subgraph "API Layer"
        APIGateway[API Gateway<br/>Kong]
    end

    subgraph "Services"
        UserService[User Service<br/>Python]
        OrderService[Order Service<br/>Python]
        PaymentService[Payment Service<br/>Python]
        NotificationService[Notification Service<br/>Python]
    end

    subgraph "Data Layer"
        UserDB[(User DB<br/>PostgreSQL)]
        OrderDB[(Order DB<br/>PostgreSQL)]
        PaymentDB[(Payment DB<br/>PostgreSQL)]
    end

    subgraph "Messaging"
        MessageBus[Message Bus<br/>Kafka]
    end

    Customer -->|HTTPS| CustomerWeb
    Admin -->|HTTPS| AdminWeb
    CustomerWeb -->|REST| APIGateway
    AdminWeb -->|REST| APIGateway
    APIGateway --> UserService
    APIGateway --> OrderService
    APIGateway --> PaymentService
    UserService --> UserDB
    OrderService --> OrderDB
    PaymentService --> PaymentDB
    OrderService -->|Order created event| MessageBus
    PaymentService -->|Payment received event| MessageBus
    MessageBus -->|Subscribes| NotificationService
```

### Event-Driven Architecture

```mermaid
graph LR
    OrderService[Order Service] -->|OrderCreated| EventBus[Event Bus<br/>AWS EventBridge]
    EventBus -->|OrderCreated| InventoryService[Inventory Service]
    EventBus -->|OrderCreated| PaymentService[Payment Service]
    EventBus -->|OrderCreated| NotificationService[Notification Service]

    PaymentService -->|PaymentProcessed| EventBus
    EventBus -->|PaymentProcessed| FulfillmentService[Fulfillment Service]
```

### CQRS Pattern

```mermaid
graph TB
    subgraph "Command Side (Write)"
        CommandAPI[Command API]
        CommandHandler[Command Handlers]
        WriteDB[(Write Database<br/>PostgreSQL)]
    end

    subgraph "Query Side (Read)"
        QueryAPI[Query API]
        ReadDB[(Read Database<br/>Elasticsearch)]
    end

    EventBus[Event Bus]

    Client[Client] -->|Commands| CommandAPI
    CommandAPI --> CommandHandler
    CommandHandler -->|Writes| WriteDB
    CommandHandler -->|Publishes events| EventBus
    EventBus -->|Updates projections| ReadDB
    Client -->|Queries| QueryAPI
    QueryAPI -->|Reads| ReadDB
```

---

## Integration with ArcKit Workflow

### 1. After Principles Definition
Create **Context Diagram** showing system boundaries

### 2. During HLD
Create **Container Diagram** showing major services and datastores

### 3. During DLD
Create **Component Diagrams** for each complex service

### 4. Before Deployment
Create **Deployment Diagram** showing infrastructure

### 5. Design Reviews
Use diagrams as visual aids for `/arckit.hld-review` and `/arckit.dld-review`

---

## Diagram Checklist

### Context Diagram
- [ ] System boundary clearly defined
- [ ] All external systems shown
- [ ] All user types/actors shown
- [ ] Relationships labeled with purpose
- [ ] Technology choices NOT shown (too detailed for context)

### Container Diagram
- [ ] All deployable units shown (apps, services, databases)
- [ ] Technology stack labeled (language, framework)
- [ ] Communication protocols specified (HTTP, gRPC, messaging)
- [ ] Data stores shown separately
- [ ] Internal vs external systems distinguished

### Component Diagram
- [ ] Significant components only (not every class)
- [ ] Component responsibilities clear
- [ ] Dependencies shown
- [ ] Design patterns evident (adapter, repository, etc.)
- [ ] Interfaces/APIs labeled

### Deployment Diagram
- [ ] Infrastructure components shown (servers, containers, networks)
- [ ] Availability zones / regions shown
- [ ] Load balancers, caches, CDNs included
- [ ] Instance types/sizes specified
- [ ] Network security boundaries (VPC, subnets, security groups)

---

## Tools and Rendering

### Mermaid Renderers

**GitHub/GitLab**: Native rendering in markdown
**VS Code**: Mermaid Preview extension
**Online**: mermaid.live for testing
**Documentation**: Docusaurus, MkDocs support Mermaid

### Alternative Tools

**For complex diagrams**:
- draw.io (diagrams.net)
- Lucidchart
- PlantUML
- Structurizr (C4 model tooling)

**Best practice**: Start with Mermaid (code-based, version control friendly). Use visual tools only if Mermaid can't represent complexity.

---

## Related Documentation

- [Design Review Guide](design-review.md) - Using diagrams in HLD/DLD reviews
- [Principles Guide](principles.md) - Architecture principles that inform diagrams
- [Data Model Guide](data-model.md) - Creating ERD diagrams for data models
- [Requirements Guide](requirements.md) - Deriving architecture from requirements

---

## Support

For issues or questions:
- GitHub Issues: https://github.com/tractorjuice/arc-kit/issues
- Mermaid Documentation: https://mermaid.js.org/
- C4 Model: https://c4model.com/

---

**Last updated**: 2025-10-28
**ArcKit Version**: 0.3.6
