# ArcKit Workflow Diagrams

This document contains Mermaid diagrams for all 5 ArcKit workflow paths based on the Dependency Structure Matrix.

**Legend**:
- **Blue boxes** = Foundation commands (Tier 0-1)
- **Green boxes** = Core workflow (Tier 2-5)
- **Orange boxes** = Design & Implementation (Tier 6-7)
- **Purple boxes** = Quality & Operations (Tier 8-9)
- **Red boxes** = Compliance (Tier 10)
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

    %% Tier 2-3: Business Case & Requirements
    D --> E[sobc]
    E --> F[requirements]

    %% Tier 4: Detailed Design
    F --> G[data-model]
    F --> H[research]
    G -.-> H
    C -.-> H
    H --> I[wardley]

    %% Tier 5: Procurement
    I --> J[sow]
    J --> K[evaluate]

    %% Tier 6: Design Reviews
    K --> L[hld-review]
    L --> M[dld-review]

    %% Tier 7: Implementation
    M --> N[backlog]

    %% Tier 8-9: Operations & Quality
    N --> O[servicenow]
    O --> P[traceability]
    P --> Q[analyze]

    %% Optional parallel paths
    F -.-> R[diagram]

    style A fill:#87CEEB
    style B fill:#87CEEB
    style C fill:#87CEEB
    style D fill:#87CEEB
    style E fill:#90EE90
    style F fill:#90EE90
    style G fill:#90EE90
    style H fill:#90EE90
    style I fill:#90EE90
    style J fill:#90EE90
    style K fill:#FFA500
    style L fill:#FFA500
    style M fill:#FFA500
    style N fill:#FFA500
    style O fill:#9370DB
    style P fill:#9370DB
    style Q fill:#9370DB
    style R fill:#90EE90
```

**Duration**: 4-8 months
**Key Milestones**: SOBC Approval → Requirements Sign-off → HLD Approval → DLD Approval → Sprint 1 → Go Live

---

## 2. UK Government Project Path

For UK Government civilian departments (non-AI projects).

```mermaid
graph TD
    %% Tier 0-1: Foundation
    A[plan] --> B[principles]
    B --> C[stakeholders]
    C --> D[risk]

    %% Tier 2-3: Business Case & Requirements
    D --> E[sobc]
    E --> F[requirements]

    %% Tier 4: Detailed Design
    F --> G[data-model]
    F --> H[research]
    G -.-> H
    C -.-> H
    H --> I[wardley]

    %% Tier 5: UK Gov Procurement
    B -.-> J[gcloud-search]
    I --> J
    J --> K[gcloud-clarify]
    K --> L[evaluate]

    %% Tier 6: Design Reviews
    L --> M[hld-review]
    M --> N[dld-review]

    %% Tier 7: Implementation
    N --> O[backlog]

    %% Tier 8-9: Operations & Quality
    O --> P[servicenow]
    P --> Q[traceability]
    Q --> R[analyze]

    %% Tier 10: UK Gov Compliance
    R --> S[service-assessment]
    S --> T[tcop]
    T --> U[secure]

    %% Optional parallel paths
    F -.-> V[diagram]

    style A fill:#87CEEB
    style B fill:#87CEEB
    style C fill:#87CEEB
    style D fill:#87CEEB
    style E fill:#90EE90
    style F fill:#90EE90
    style G fill:#90EE90
    style H fill:#90EE90
    style I fill:#90EE90
    style J fill:#90EE90
    style K fill:#90EE90
    style L fill:#90EE90
    style M fill:#FFA500
    style N fill:#FFA500
    style O fill:#FFA500
    style P fill:#9370DB
    style Q fill:#9370DB
    style R fill:#9370DB
    style S fill:#FF6B6B
    style T fill:#FF6B6B
    style U fill:#FF6B6B
    style V fill:#90EE90
```

**Duration**: 6-12 months
**Key Milestones**: SOBC Approval → Alpha Assessment → Beta Assessment → Service Assessment → Go Live

---

## 3. UK Government AI Project Path

For UK Government projects with AI/ML components.

```mermaid
graph TD
    %% Tier 0-1: Foundation
    A[plan] --> B[principles]
    B --> C[stakeholders]
    C --> D[risk]

    %% Tier 2-3: Business Case & Requirements
    D --> E[sobc]
    E --> F[requirements]

    %% Tier 4: Detailed Design
    F --> G[data-model]
    F --> H[research]
    G -.-> H
    C -.-> H
    H --> I[wardley]

    %% Tier 5: UK Gov Procurement
    B -.-> J[gcloud-search]
    I --> J
    J --> K[evaluate]

    %% Tier 6: Design Reviews
    K --> L[hld-review]
    L --> M[dld-review]

    %% Tier 7: Implementation
    M --> N[backlog]

    %% Tier 8-9: Operations & Quality
    N --> O[servicenow]
    O --> P[traceability]
    P --> Q[analyze]

    %% Tier 10: UK Gov Compliance + AI Compliance
    Q --> R[service-assessment]
    R --> S[tcop]
    S --> T[ai-playbook]
    T --> U[atrs]
    U --> V[secure]

    %% Optional parallel paths
    F -.-> W[diagram]

    style A fill:#87CEEB
    style B fill:#87CEEB
    style C fill:#87CEEB
    style D fill:#87CEEB
    style E fill:#90EE90
    style F fill:#90EE90
    style G fill:#90EE90
    style H fill:#90EE90
    style I fill:#90EE90
    style J fill:#90EE90
    style K fill:#90EE90
    style L fill:#FFA500
    style M fill:#FFA500
    style N fill:#FFA500
    style O fill:#9370DB
    style P fill:#9370DB
    style Q fill:#9370DB
    style R fill:#FF6B6B
    style S fill:#FF6B6B
    style T fill:#FF6B6B
    style U fill:#FF6B6B
    style V fill:#FF6B6B
    style W fill:#90EE90
```

**Duration**: 9-18 months
**Key Milestones**: SOBC Approval → Alpha Assessment → AI Playbook Approval → Beta Assessment → ATRS Publication → Service Assessment → Go Live

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

    %% Tier 2-3: Business Case & Requirements
    D --> E[sobc]
    E --> F[requirements]

    %% Tier 4: Detailed Design
    F --> G[data-model]
    F --> H[research]
    G -.-> H
    C -.-> H
    H --> I[wardley]

    %% Tier 5: MOD Procurement
    B -.-> J[dos]
    C -.-> J
    I --> J
    J --> K[evaluate]

    %% Tier 6: Design Reviews
    K --> L[hld-review]
    L --> M[dld-review]

    %% Tier 7: Implementation
    M --> N[backlog]

    %% Tier 8-9: Operations & Quality
    N --> O[servicenow]
    O --> P[traceability]
    P --> Q[analyze]

    %% Tier 10: MOD Compliance
    Q --> R[service-assessment]
    R --> S[tcop]
    S --> T[mod-secure]

    %% Optional parallel paths
    F -.-> U[diagram]

    style A fill:#87CEEB
    style B fill:#87CEEB
    style C fill:#87CEEB
    style D fill:#87CEEB
    style E fill:#90EE90
    style F fill:#90EE90
    style G fill:#90EE90
    style H fill:#90EE90
    style I fill:#90EE90
    style J fill:#90EE90
    style K fill:#90EE90
    style L fill:#FFA500
    style M fill:#FFA500
    style N fill:#FFA500
    style O fill:#9370DB
    style P fill:#9370DB
    style Q fill:#9370DB
    style R fill:#FF6B6B
    style S fill:#FF6B6B
    style T fill:#FF6B6B
    style U fill:#90EE90
```

**Duration**: 12-24 months
**Key Milestones**: SOBC Approval → Alpha Assessment → MOD SbD Approval → Beta Assessment → Service Assessment → Go Live

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

    %% Tier 2-3: Business Case & Requirements
    D --> E[sobc]
    E --> F[requirements]

    %% Tier 4: Detailed Design
    F --> G[data-model]
    F --> H[research]
    G -.-> H
    C -.-> H
    H --> I[wardley]

    %% Tier 5: MOD Procurement
    B -.-> J[dos]
    C -.-> J
    I --> J
    J --> K[evaluate]

    %% Tier 6: Design Reviews
    K --> L[hld-review]
    L --> M[dld-review]

    %% Tier 7: Implementation
    M --> N[backlog]

    %% Tier 8-9: Operations & Quality
    N --> O[servicenow]
    O --> P[traceability]
    P --> Q[analyze]

    %% Tier 10: MOD + AI Compliance
    Q --> R[service-assessment]
    R --> S[tcop]
    S --> T[mod-secure]
    T --> U[jsp-936]

    %% Optional parallel paths
    F -.-> V[diagram]

    style A fill:#87CEEB
    style B fill:#87CEEB
    style C fill:#87CEEB
    style D fill:#87CEEB
    style E fill:#90EE90
    style F fill:#90EE90
    style G fill:#90EE90
    style H fill:#90EE90
    style I fill:#90EE90
    style J fill:#90EE90
    style K fill:#90EE90
    style L fill:#FFA500
    style M fill:#FFA500
    style N fill:#FFA500
    style O fill:#9370DB
    style P fill:#9370DB
    style Q fill:#9370DB
    style R fill:#FF6B6B
    style S fill:#FF6B6B
    style T fill:#FF6B6B
    style U fill:#FF6B6B
    style V fill:#90EE90
```

**Duration**: 18-36 months
**Key Milestones**: SOBC Approval → Alpha Assessment → MOD SbD + JSP 936 Approval → Beta Assessment → Service Assessment → Go Live

**Critical Gates**:
- MOD Secure by Design required before Beta
- JSP 936 AI assurance required before Beta
- Risk classification determines approval pathway:
  - **Critical**: 2PUS/Ministerial approval
  - **Severe/Major**: Defence-Level JROC/IAC approval
  - **Moderate/Minor**: TLB-Level approval

---

## Command Dependency Legend

### Dependency Types in Diagrams

- **Solid arrows (→)**: Mandatory/Recommended sequential flow
- **Dotted arrows (-.->)**: Optional parallel activities

### Tier Groupings

| Tier | Phase | Commands |
|------|-------|----------|
| 0 | Foundation | plan, principles |
| 1 | Strategic Context | stakeholders, risk |
| 2 | Business Justification | sobc |
| 3 | Requirements | requirements |
| 4 | Detailed Design | data-model, research, wardley |
| 5 | Procurement | sow, dos, gcloud-search, gcloud-clarify, evaluate |
| 6 | Design Reviews | hld-review, dld-review |
| 7 | Implementation | backlog |
| 8-9 | Operations & Quality | servicenow, traceability, analyze |
| 10 | Compliance | service-assessment, tcop, ai-playbook, atrs, secure, mod-secure, jsp-936 |

---

## Alternative View: Gantt Chart Format

For project planning purposes, here's a Gantt chart representation of a typical UK Government AI project:

```mermaid
gantt
    title UK Government AI Project Timeline (Typical 12-month project)
    dateFormat YYYY-MM-DD
    section Discovery (8 weeks)
    plan                    :a1, 2025-01-01, 1w
    principles              :a2, after a1, 1w
    stakeholders            :a3, after a2, 2w
    risk                    :a4, after a3, 2w
    sobc                    :a5, after a4, 2w
    section Alpha (12 weeks)
    requirements            :b1, after a5, 3w
    data-model              :b2, after b1, 2w
    research                :b3, after b2, 2w
    wardley                 :b4, after b3, 2w
    gcloud-search           :b5, after b4, 2w
    evaluate                :b6, after b5, 2w
    section Beta (20 weeks)
    hld-review              :c1, after b6, 2w
    dld-review              :c2, after c1, 2w
    backlog                 :c3, after c2, 1w
    Sprint 1-8              :c4, after c3, 16w
    section Live Prep (12 weeks)
    servicenow              :d1, after c4, 2w
    traceability            :d2, after d1, 2w
    analyze                 :d3, after d2, 2w
    service-assessment      :d4, after d3, 2w
    tcop                    :d5, after d4, 1w
    ai-playbook             :d6, after d5, 2w
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

    style A fill:#90EE90
    style B fill:#90EE90
    style C fill:#90EE90
    style D fill:#90EE90
    style E fill:#FFA500
    style F fill:#FFA500
    style G fill:#FFA500
```

**Duration**: 2-4 months
**Use When**: Enhancement to existing system, clear architecture patterns

### Compliance-Only Path

For auditing existing projects:

```mermaid
graph LR
    A[analyze] --> B[service-assessment]
    B --> C[tcop]
    C --> D[secure]

    style A fill:#9370DB
    style B fill:#FF6B6B
    style C fill:#FF6B6B
    style D fill:#FF6B6B
```

**Duration**: 2-4 weeks
**Use When**: Pre-assessment preparation, audit requirements

---

## Version

- **ArcKit Version**: 0.8.2
- **Document Date**: 2025-11-02
- **Based On**: DEPENDENCY-MATRIX.md (with Phase 2 R-level dependencies)
- **Key Changes**: Added recommended dependencies (dotted lines) for data-model→research, stakeholders→research, principles→gcloud-search, stakeholders→dos
