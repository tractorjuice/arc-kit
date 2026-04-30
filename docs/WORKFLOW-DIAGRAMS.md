# ArcKit Workflow Diagrams

This document contains Mermaid diagrams for all 5 ArcKit workflow paths based on the Dependency Structure Matrix.

**Legend**:

- **Blue boxes** = Foundation commands (Tier 0-1)
- **Green boxes** = Core workflow (Tier 2-7)
- **Orange boxes** = Design & Implementation (Tier 8-9)
- **Purple boxes** = Quality & Operations (Tier 11-12)
- **Red boxes** = Compliance (Tier 13)
- **Gold boxes** = Project Story & Reporting (Tier 14)
- **Solid arrows (→)** = Mandatory sequential flow
- **Dotted arrows (-.->)** = Recommended dependencies or optional inputs

---

## 1. Standard Project Path (Non-AI, Non-Government)

For private sector and non-UK government projects without AI components.

```mermaid
graph TD
    %% Tier 0-1: Foundation
    A[plan] --> B[principles]
    B --> C[stakeholders]
    C --> D[risk]

    %% Tier 2-4: Business Case & Requirements
    D --> E[sobc]
    E --> F[requirements]

    %% Tier 5-6: Strategy & Design
    F --> G[platform-design]
    F --> F1[datascout]
    F1 -.-> H
    F --> H[data-model]
    G -.-> H
    H --> I[data-mesh-contract]
    H --> J[dpia]
    F --> K[research]
    F1 -.-> K
    K --> L[wardley]
    L --> M[roadmap]
    M --> M1[strategy]
    M1 -.-> M2[framework]
    H -.-> N[diagram]

    %% Tier 7: Procurement
    M --> O[sow]
    I -.-> O
    J -.-> O
    O --> P[evaluate]

    %% Tier 8: Design Reviews
    P --> Q[hld-review]
    Q --> R[dld-review]
    R --> S[adr]

    %% Tier 9: Implementation
    R --> T[backlog]

    %% Tier 10: Backlog Export
    T --> T1[trello]

    %% Tier 11-12: Operations & Quality
    T --> U[servicenow]
    U --> U1[devops]
    U1 --> U1a[finops]
    U1a --> U2[operationalize]
    U2 --> V[traceability]
    V --> V1[principles-compliance]
    V1 --> V2[conformance]
    V2 --> W[analyze]

    %% Tier 14: Reporting
    W --> X[story]

    style A fill:#87CEEB
    style B fill:#87CEEB
    style C fill:#87CEEB
    style D fill:#87CEEB
    style E fill:#90EE90
    style F fill:#90EE90
    style F1 fill:#90EE90
    style G fill:#90EE90
    style H fill:#90EE90
    style I fill:#90EE90
    style J fill:#90EE90
    style K fill:#90EE90
    style L fill:#90EE90
    style M fill:#90EE90
    style M1 fill:#90EE90
    style M2 fill:#90EE90
    style N fill:#90EE90
    style O fill:#90EE90
    style P fill:#90EE90
    style Q fill:#FFA500
    style R fill:#FFA500
    style S fill:#FFA500
    style T fill:#FFA500
    style U fill:#9370DB
    style U1 fill:#9370DB
    style U1a fill:#9370DB
    style U2 fill:#9370DB
    style V fill:#9370DB
    style V1 fill:#9370DB
    style V2 fill:#FF6B6B
    style W fill:#9370DB
    style X fill:#FFD700
```

**Duration**: 4-8 months
**Key Milestones**: SOBC Approval → Strategy/Requirements Sign-off → DPIA Complete → ADR Approved → Sprint 1 → Go Live

---

## 2. UK Government Project Path

For UK Government civilian departments (non-AI projects).

```mermaid
graph TD
    %% Tier 0-1: Foundation
    A[plan] --> B[principles]
    B --> C[stakeholders]
    C --> D[risk]

    %% Tier 2-4: Business Case & Requirements
    D --> E[sobc]
    E --> F[requirements]

    %% Tier 5-6: Strategy & Design
    F --> G[platform-design]
    F --> F1[datascout]
    F1 -.-> H
    F --> H[data-model]
    G -.-> H
    H --> I[data-mesh-contract]
    H --> J[dpia]
    F --> K[research]
    F1 -.-> K
    K --> L[wardley]
    L --> M[roadmap]
    M --> M1[strategy]
    H -.-> V[diagram]

    %% Tier 7: UK Gov Procurement
    B -.-> N[gcloud-search]
    M --> N
    N --> O[gcloud-clarify]
    O --> P[evaluate]
    M -.-> Q[sow]
    Q -.-> P
    J -.-> P

    %% Tier 8: Design Reviews
    P --> R[hld-review]
    R --> S[dld-review]
    S --> T[adr]

    %% Tier 9: Implementation
    S --> U[backlog]

    %% Tier 10: Backlog Export
    U --> U1t[trello]

    %% Tier 11-12: Operations & Quality
    U --> W[servicenow]
    W --> W1[devops]
    W1 --> W1a[finops]
    W1a --> W2[operationalize]
    W2 --> X[traceability]

    %% Tier 13: UK Gov Compliance
    X --> X1[tcop]
    X1 --> X2[secure]
    X2 --> X3[principles-compliance]
    X3 --> X4[conformance]
    X4 --> Y[analyze]
    Y --> Z[service-assessment]

    %% Tier 14: Reporting
    Z --> AA[story]

    style A fill:#87CEEB
    style B fill:#87CEEB
    style C fill:#87CEEB
    style D fill:#87CEEB
    style E fill:#90EE90
    style F fill:#90EE90
    style F1 fill:#90EE90
    style G fill:#90EE90
    style H fill:#90EE90
    style I fill:#90EE90
    style J fill:#90EE90
    style K fill:#90EE90
    style L fill:#90EE90
    style M fill:#90EE90
    style M1 fill:#90EE90
    style N fill:#90EE90
    style O fill:#90EE90
    style P fill:#90EE90
    style Q fill:#90EE90
    style R fill:#FFA500
    style S fill:#FFA500
    style T fill:#FFA500
    style U fill:#FFA500
    style V fill:#90EE90
    style W fill:#9370DB
    style W1 fill:#9370DB
    style W1a fill:#9370DB
    style W2 fill:#9370DB
    style X fill:#9370DB
    style X1 fill:#FF6B6B
    style X2 fill:#FF6B6B
    style X3 fill:#9370DB
    style X4 fill:#FF6B6B
    style Y fill:#9370DB
    style Z fill:#FF6B6B
    style AA fill:#FFD700
```

**Duration**: 6-12 months
**Key Milestones**: SOBC Approval → Strategy/Requirements Sign-off → DPIA Complete → G-Cloud Clarifications → Service Assessment → Go Live

---

## 3. UK Government AI Project Path

For UK Government projects with AI/ML components.

```mermaid
graph TD
    %% Tier 0-1: Foundation
    A[plan] --> B[principles]
    B --> C[stakeholders]
    C --> D[risk]

    %% Tier 2-4: Business Case & Requirements
    D --> E[sobc]
    E --> F[requirements]

    %% Tier 5-6: Strategy & Design
    F --> G[platform-design]
    F --> F1[datascout]
    F1 -.-> H
    F --> H[data-model]
    G -.-> H
    H --> I[data-mesh-contract]
    H --> J[dpia]
    F --> K[research]
    F1 -.-> K
    K --> L[wardley]
    L --> M[roadmap]
    M --> M1[strategy]
    H -.-> W[diagram]

    %% Tier 7: UK Gov Procurement
    B -.-> N[gcloud-search]
    M --> N
    N --> O[gcloud-clarify]
    O --> P[evaluate]
    M -.-> Q[sow]
    Q -.-> P
    J -.-> P

    %% Tier 8: Design Reviews
    P --> R[hld-review]
    R --> S[dld-review]
    S --> T[adr]

    %% Tier 9: Implementation
    S --> U[backlog]

    %% Tier 10: Backlog Export
    U --> U1t[trello]

    %% Tier 11-12: Operations & Quality
    U --> V[servicenow]
    V --> V1[devops]
    V1 --> V1a[finops]
    V1a --> V2[mlops]
    V2 --> V3[operationalize]
    V3 --> X[traceability]

    %% Tier 13: UK Gov + AI Compliance
    X --> X1[tcop]
    X1 --> X2[ai-playbook]
    X2 --> X3[atrs]
    X3 --> X4[secure]
    X4 --> X5[principles-compliance]
    X5 --> X6[conformance]
    X6 --> Y[analyze]
    Y --> Z[service-assessment]

    %% Tier 14: Reporting
    Z --> AA[story]

    style A fill:#87CEEB
    style B fill:#87CEEB
    style C fill:#87CEEB
    style D fill:#87CEEB
    style E fill:#90EE90
    style F fill:#90EE90
    style F1 fill:#90EE90
    style G fill:#90EE90
    style H fill:#90EE90
    style I fill:#90EE90
    style J fill:#90EE90
    style K fill:#90EE90
    style L fill:#90EE90
    style M fill:#90EE90
    style M1 fill:#90EE90
    style N fill:#90EE90
    style O fill:#90EE90
    style P fill:#90EE90
    style Q fill:#90EE90
    style R fill:#FFA500
    style S fill:#FFA500
    style T fill:#FFA500
    style U fill:#FFA500
    style V fill:#9370DB
    style V1 fill:#9370DB
    style V1a fill:#9370DB
    style V2 fill:#9370DB
    style V3 fill:#9370DB
    style W fill:#90EE90
    style X fill:#9370DB
    style X1 fill:#FF6B6B
    style X2 fill:#FF6B6B
    style X3 fill:#FF6B6B
    style X4 fill:#FF6B6B
    style X5 fill:#9370DB
    style X6 fill:#FF6B6B
    style Y fill:#9370DB
    style Z fill:#FF6B6B
    style AA fill:#FFD700
```

**Duration**: 9-18 months
**Key Milestones**: SOBC Approval → Strategy/Requirements Sign-off → DPIA Complete → G-Cloud Clarifications → AI Playbook Approval → ATRS Publication → Service Assessment → Go Live

**Critical Gates**:

- AI Playbook compliance required before Beta
- ATRS publication required before Live

---

## 4. MOD Defence Project Path

For Ministry of Defence projects (non-AI).

```mermaid
graph TD
    %% Tier 0-1: Foundation
    A[plan] --> B[principles]
    B --> C[stakeholders]
    C --> D[risk]

    %% Tier 2-4: Business Case & Requirements
    D --> E[sobc]
    E --> F[requirements]

    %% Tier 5-6: Strategy & Design
    F --> G[platform-design]
    F --> F1[datascout]
    F1 -.-> H
    F --> H[data-model]
    G -.-> H
    H --> I[data-mesh-contract]
    H --> J[dpia]
    F --> K[research]
    F1 -.-> K
    K --> L[wardley]
    L --> M[roadmap]
    M --> M1[strategy]
    H -.-> U[diagram]

    %% Tier 7: MOD Procurement
    B -.-> N[dos]
    C -.-> N
    M --> N
    N --> O[evaluate]
    M -.-> P[sow]
    P -.-> O
    J -.-> O

    %% Tier 8: Design Reviews
    O --> Q[hld-review]
    Q --> R[dld-review]
    R --> S[adr]

    %% Tier 9: Implementation
    R --> T[backlog]

    %% Tier 10: Backlog Export
    T --> T1t[trello]

    %% Tier 11-12: Operations & Quality
    T --> V[servicenow]
    V --> V1[devops]
    V1 --> V1a[finops]
    V1a --> V2[operationalize]
    V2 --> W[traceability]

    %% Tier 13: MOD Compliance
    W --> W1[tcop]
    W1 --> W2[mod-secure]
    W2 --> W3[principles-compliance]
    W3 --> W4[conformance]
    W4 --> X[analyze]
    X --> Y[service-assessment]

    %% Tier 14: Reporting
    Y --> Z[story]

    style A fill:#87CEEB
    style B fill:#87CEEB
    style C fill:#87CEEB
    style D fill:#87CEEB
    style E fill:#90EE90
    style F fill:#90EE90
    style F1 fill:#90EE90
    style G fill:#90EE90
    style H fill:#90EE90
    style I fill:#90EE90
    style J fill:#90EE90
    style K fill:#90EE90
    style L fill:#90EE90
    style M fill:#90EE90
    style M1 fill:#90EE90
    style N fill:#90EE90
    style O fill:#90EE90
    style P fill:#90EE90
    style Q fill:#FFA500
    style R fill:#FFA500
    style S fill:#FFA500
    style T fill:#FFA500
    style U fill:#90EE90
    style V fill:#9370DB
    style V1 fill:#9370DB
    style V1a fill:#9370DB
    style V2 fill:#9370DB
    style W fill:#9370DB
    style W1 fill:#FF6B6B
    style W2 fill:#FF6B6B
    style W3 fill:#9370DB
    style W4 fill:#FF6B6B
    style X fill:#9370DB
    style Y fill:#FF6B6B
    style Z fill:#FFD700
```

**Duration**: 12-24 months
**Key Milestones**: SOBC Approval → Strategy/Requirements Sign-off → DPIA Complete → DOS Down-select → MOD Secure by Design Approval → Service Assessment → Go Live

**Critical Gates**:

- MOD Secure by Design (JSP 440, IAMM) required before Beta
- Security clearances required for team

---

## 5. MOD Defence AI Project Path

For Ministry of Defence projects with AI/ML components.

```mermaid
graph TD
    %% Tier 0-1: Foundation
    A[plan] --> B[principles]
    B --> C[stakeholders]
    C --> D[risk]

    %% Tier 2-4: Business Case & Requirements
    D --> E[sobc]
    E --> F[requirements]

    %% Tier 5-6: Strategy & Design
    F --> G[platform-design]
    F --> F1[datascout]
    F1 -.-> H
    F --> H[data-model]
    G -.-> H
    H --> I[data-mesh-contract]
    H --> J[dpia]
    F --> K[research]
    F1 -.-> K
    K --> L[wardley]
    L --> M[roadmap]
    M --> M1[strategy]
    H -.-> V[diagram]

    %% Tier 7: MOD Procurement
    B -.-> N[dos]
    C -.-> N
    M --> N
    N --> O[evaluate]
    M -.-> P[sow]
    P -.-> O
    J -.-> O

    %% Tier 8: Design Reviews
    O --> Q[hld-review]
    Q --> R[dld-review]
    R --> S[adr]

    %% Tier 9: Implementation
    R --> T[backlog]

    %% Tier 10: Backlog Export
    T --> T1t[trello]

    %% Tier 11-12: Operations & Quality
    T --> W[servicenow]
    W --> W1[devops]
    W1 --> W1a[finops]
    W1a --> W2[mlops]
    W2 --> W3[operationalize]
    W3 --> X[traceability]

    %% Tier 13: MOD + AI Compliance
    X --> X1[tcop]
    X1 --> X2[mod-secure]
    X2 --> X3[jsp-936]
    X3 --> X4[principles-compliance]
    X4 --> X5[conformance]
    X5 --> Y[analyze]
    Y --> Z[service-assessment]

    %% Tier 14: Reporting
    Z --> AA[story]

    style A fill:#87CEEB
    style B fill:#87CEEB
    style C fill:#87CEEB
    style D fill:#87CEEB
    style E fill:#90EE90
    style F fill:#90EE90
    style F1 fill:#90EE90
    style G fill:#90EE90
    style H fill:#90EE90
    style I fill:#90EE90
    style J fill:#90EE90
    style K fill:#90EE90
    style L fill:#90EE90
    style M fill:#90EE90
    style M1 fill:#90EE90
    style N fill:#90EE90
    style O fill:#90EE90
    style P fill:#90EE90
    style Q fill:#FFA500
    style R fill:#FFA500
    style S fill:#FFA500
    style T fill:#FFA500
    style V fill:#90EE90
    style W fill:#9370DB
    style W1 fill:#9370DB
    style W1a fill:#9370DB
    style W2 fill:#9370DB
    style W3 fill:#9370DB
    style X fill:#9370DB
    style X1 fill:#FF6B6B
    style X2 fill:#FF6B6B
    style X3 fill:#FF6B6B
    style X4 fill:#9370DB
    style X5 fill:#FF6B6B
    style Y fill:#9370DB
    style Z fill:#FF6B6B
    style AA fill:#FFD700
```

**Duration**: 18-36 months
**Key Milestones**: SOBC Approval → Strategy/Requirements Sign-off → DPIA Complete → DOS Down-select → MOD Secure by Design + JSP 936 Approval → Service Assessment → Go Live

**Critical Gates**:

- MOD Secure by Design required before Beta
- JSP 936 AI assurance required before Beta
- Risk classification determines approval pathway:
  - **Critical**: 2PUS/Ministerial approval
  - **Severe/Major**: Defence-Level JROC/IAC approval
  - **Moderate/Minor**: TLB-Level approval

---

## 6. Wardley Mapping Suite

The Wardley Mapping suite provides a focused strategic analysis pipeline. Value chain decomposition feeds into map creation, which then branches into three parallel analysis tracks.

```mermaid
graph TD
    %% Prerequisites
    A[requirements] --> B[wardley.value-chain]
    C[principles] -.-> B
    D[stakeholders] -.-> B

    %% Core mapping
    B --> E[wardley]

    %% Analysis tracks (parallel after map creation)
    E --> F[wardley.doctrine]
    E --> G[wardley.climate]
    E --> H[wardley.gameplay]

    %% Cross-feed between analysis tracks
    G -.-> H
    F -.-> H

    %% Downstream
    E --> I[roadmap]
    E --> J[strategy]
    H -.-> J

    style A fill:#90EE90
    style B fill:#87CEEB
    style C fill:#87CEEB
    style D fill:#87CEEB
    style E fill:#90EE90
    style F fill:#9370DB
    style G fill:#9370DB
    style H fill:#9370DB
    style I fill:#90EE90
    style J fill:#90EE90
```

**Key:**

- **Blue boxes** = Foundation inputs and value chain decomposition
- **Green boxes** = Core workflow (requirements, wardley map, downstream)
- **Purple boxes** = Wardley analysis tracks (doctrine, climate, gameplay)

**Duration**: 1-3 weeks (within the Alpha phase)

---

## 7. UAE Federal Workflow

For UAE federal entities, contracted suppliers, and CII operators, the canonical chain runs the 12 `uae-*` commands in sequence between the standard inputs (requirements, data-model, risk) and the cross-cutting outputs (sobc, wardley, framework).

```mermaid
graph TD
    %% Foundation
    A[principles] --> B[requirements]
    A --> C[data-model]
    B --> C
    B --> D[risk]

    %% UAE federal data + security
    C --> E[uae-classification]
    B --> F[uae-pdpl]
    C --> F
    D --> F
    B --> G[uae-ias]
    D --> G
    E --> H[uae-cloud-residency]

    %% UAE federal identity
    B --> I[uae-uaepass]

    %% UAE Cabinet instruments
    B --> J[uae-zero-bureaucracy]
    E --> K[uae-digital-records]
    C --> K
    E --> L[uae-data-sharing]
    F --> L
    J --> M[uae-priorities-alignment]
    K --> M
    L --> M

    %% UAE AI governance
    B --> N[uae-ai-charter]
    D --> N
    N --> O[uae-ai-autonomy-tier]

    %% Procurement
    B --> P[uae-procurement]

    %% Cross-cutting downstream
    M --> Q[sobc]
    P --> Q
    Q --> R[wardley]
    Q --> S[framework]

    style A fill:#90EE90
    style B fill:#90EE90
    style C fill:#90EE90
    style D fill:#90EE90
    style E fill:#FFB347
    style F fill:#FFB347
    style G fill:#FFB347
    style H fill:#FFB347
    style I fill:#87CEEB
    style J fill:#9370DB
    style K fill:#9370DB
    style L fill:#9370DB
    style M fill:#9370DB
    style N fill:#FFD700
    style O fill:#FFD700
    style P fill:#FFA07A
    style Q fill:#90EE90
    style R fill:#90EE90
    style S fill:#90EE90
```

**Key:**

- **Green boxes** = Foundation inputs and standard cross-cutting outputs
- **Orange boxes (light)** = UAE federal data and security (classification, PDPL, IAS, cloud residency)
- **Blue boxes** = UAE federal identity (UAE Pass)
- **Purple boxes** = UAE Cabinet instruments (Zero Bureaucracy, Digital Records, Data Sharing, National Priorities Alignment)
- **Gold boxes** = UAE AI governance (Charter, Autonomy Tier)
- **Salmon box** = UAE federal procurement (Decree-Law No. 11 of 2023)

**Prerequisites**: Set `governance_framework: UAE Federal` and `classification_scheme: UAE Smart Data` in plugin userConfig before running. The reference implementation is the `arckit-test-project-v20-uae-moi-ipad` test repo. Full overlay guide at [`docs/guides/uae-overlay.md`](guides/uae-overlay.md).

**Duration**: 4-8 weeks for a full federal pathfinder (the AI tier and procurement work runs in parallel with the data and security stream).

---

## 8. Government Code Discovery

For UK Government projects, run these commands during Alpha/Beta to check for reusable code before building from scratch. Uses the govreposcrape MCP server (no API key required).

```mermaid
graph TD
    %% Prerequisites
    A[requirements] --> B[gov-reuse]
    C[gov-code-search] -.-> B

    %% Discovery flow
    B -.-> D[research]
    B -.-> E[adr]

    %% Landscape analysis
    F[gov-landscape] -.-> G[framework]
    F -.-> H[wardley]
    C -.-> B

    style A fill:#90EE90
    style B fill:#87CEEB
    style C fill:#87CEEB
    style D fill:#90EE90
    style E fill:#FFA500
    style F fill:#87CEEB
    style G fill:#90EE90
    style H fill:#90EE90
```

**Key:**

- **Blue boxes** = Government code discovery commands (use govreposcrape MCP)
- **Green boxes** = Standard workflow commands that consume discovery outputs
- **Orange boxes** = Decision records informed by reuse assessment

**When to use:**

- Run `gov-code-search` first to find relevant existing code
- Run `gov-reuse` after requirements to assess specific reuse opportunities before build-vs-buy
- Run `gov-landscape` to understand the broader government code ecosystem for a domain

**Duration**: 0.5-2 days (before or during research phase)

---

## Command Dependency Legend

### Dependency Types in Diagrams

- **Solid arrows (→)**: Mandatory/Recommended sequential flow
- **Dotted arrows (-.->)**: Optional parallel activities

### Tier Groupings

| Tier | Phase | Commands |
|------|-------|----------|
| 0 | Foundation | plan, principles |
| 1 | Strategic Context | stakeholders |
| 2 | Risk Assessment | risk |
| 3 | Business Justification | sobc |
| 4 | Requirements | requirements |
| 5 | Strategic Planning & Synthesis | platform-design, roadmap, strategy, framework, glossary |
| 6 | Detailed Design | data-model, data-mesh-contract, dpia, research, azure-research*, aws-research*, gcp-research*, datascout, gov-reuse†, gov-code-search†, gov-landscape†, dfd, wardley, wardley.value-chain, wardley.doctrine, wardley.gameplay, wardley.climate, diagram, adr |
| 7 | Procurement | sow, dos, gcloud-search, gcloud-clarify, evaluate, score |
| 8 | Design Reviews | hld-review, dld-review |
| 9 | Implementation | backlog |
| 10 | Backlog Export | trello |
| 11-12 | Operations & Quality | servicenow, devops, finops, mlops (AI projects), operationalize, traceability, analyze, principles-compliance |
| 13 | Compliance | conformance, maturity-model, service-assessment, tcop, ai-playbook, atrs, secure, mod-secure, jsp-936 |
| 14 | Reporting | story, presentation |
| 15 | Publishing | pages |

> **\*** `azure-research` and `aws-research` are alternatives to `research` for cloud-specific projects. Each requires its respective MCP server.
> **datascout** discovers external data sources (APIs, datasets, open data portals) and feeds into data-model and research.
> **†** `gov-reuse`, `gov-code-search`, and `gov-landscape` use the govreposcrape MCP server (no API key required) to search 24,500+ UK government repositories.

---

## Alternative View: Gantt Chart Format

For project planning purposes, here's a Gantt chart representation of a typical UK Government AI project:

```mermaid
gantt
    title UK Government AI Project Timeline (Typical 12-month project)
    dateFormat YYYY-MM-DD
    section Discovery (8 weeks)
    plan                    :a1, 2026-01-01, 1w
    principles              :a2, after a1, 1w
    stakeholders            :a3, after a2, 2w
    risk                    :a4, after a3, 2w
    sobc                    :a5, after a4, 2w
    section Alpha (12 weeks)
    requirements            :b1, after a5, 3w
    datascout               :b1a, after b1, 1w
    data-model              :b2, after b1a, 2w
    research                :b3, after b2, 2w
    wardley                 :b4, after b3, 2w
    gcloud-search           :b5, after b4, 2w
    evaluate                :b6, after b5, 2w
    section Beta (20 weeks)
    hld-review              :c1, after b6, 2w
    dld-review              :c2, after c1, 2w
    backlog                 :c3, after c2, 1w
    Sprint 1-8              :c4, after c3, 16w
    section Live Prep (14 weeks)
    servicenow              :d1, after c4, 1w
    devops                  :d1a, after d1, 1w
    finops                  :d1b, after d1a, 1w
    mlops                   :d1c, after d1b, 1w
    operationalize          :d1d, after d1c, 1w
    traceability            :d2, after d1d, 1w
    analyze                 :d3, after d2, 1w
    principles-compliance   :d3a, after d3, 1w
    conformance             :d3b, after d3a, 1w
    service-assessment      :d4, after d3b, 2w
    tcop                    :d5, after d4, 1w
    ai-playbook             :d6, after d5, 1w
    atrs                    :d7, after d6, 1w
    secure                  :d8, after d7, 1w
    section Live
    Go Live                 :milestone, after d8, 0d
```

---

## Workflow Decision Tree

Use this decision tree to determine which workflow path to follow:

```mermaid
graph TD
    START[Start New Project] --> Q1{UK Government Project?}

    Q1 -->|No| Q2{AI/ML Components?}
    Q1 -->|Yes| Q3{MOD/Defence?}

    Q2 -->|No| W1[Standard Project Path]
    Q2 -->|Yes| W2[Standard AI Project Path<br/>Consider UK AI Playbook principles]

    Q3 -->|No| Q4{AI/ML Components?}
    Q3 -->|Yes| Q5{AI/ML Components?}

    Q4 -->|No| W3[UK Government Project Path]
    Q4 -->|Yes| W4[UK Government AI Project Path]

    Q5 -->|No| W5[MOD Defence Project Path]
    Q5 -->|Yes| W6[MOD Defence AI Project Path]

    style START fill:#87CEEB
    style W1 fill:#90EE90
    style W2 fill:#90EE90
    style W3 fill:#FFA500
    style W4 fill:#FF6B6B
    style W5 fill:#9370DB
    style W6 fill:#FF0000,color:#FFF
```

---

## Common Variations

### Fast-Track Path (Existing Architecture)

If architecture principles and governance already established:

```mermaid
graph LR
    A[requirements] --> B[data-model]
    A --> C[research]
    B -.-> C
    C --> D[evaluate]
    D --> E[hld-review]
    E --> F[dld-review]
    F --> G[backlog]
    G --> H[trello]

    style A fill:#90EE90
    style B fill:#90EE90
    style C fill:#90EE90
    style D fill:#90EE90
    style E fill:#FFA500
    style F fill:#FFA500
    style G fill:#FFA500
    style H fill:#FFA500
```

**Duration**: 2-4 months
**Use When**: Enhancement to existing system, clear architecture patterns

### Compliance-Only Path

For auditing existing projects:

```mermaid
graph LR
    A[tcop] --> B[secure]
    B --> C[principles-compliance]
    C --> D[conformance]
    D --> E[analyze]
    E --> F[service-assessment]

    style A fill:#FF6B6B
    style B fill:#FF6B6B
    style C fill:#9370DB
    style D fill:#FF6B6B
    style E fill:#9370DB
    style F fill:#FF6B6B
```

**Duration**: 2-4 weeks
**Use When**: Pre-assessment preparation, audit requirements

---

## Version

- **ArcKit Version**: 1.3.0
- **Document Date**: 2026-03-16
- **Based On**: DEPENDENCY-MATRIX.md (with Phase 2 R-level dependencies)
- **Commands Documented**: 48
- **Key Changes**:
  - Added Wardley Mapping Suite workflow diagram (wardley.value-chain, wardley.doctrine, wardley.climate, wardley.gameplay)
  - Updated Tier 6 Detailed Design to include 4 new Wardley suite commands
  - Previous: Added conformance node to all 5 workflow paths (between principles-compliance and analyze)
  - Added conformance to Compliance-Only Path and Gantt chart
  - Updated Tier 13 Compliance to include conformance
  - Previous: Added missing style definitions for finops nodes in all workflow diagrams
  - Previous: Updated Tier Groupings table to include all 68 commands across 16 tiers
  - Previous: Added principles-compliance to Operations & Quality tier
