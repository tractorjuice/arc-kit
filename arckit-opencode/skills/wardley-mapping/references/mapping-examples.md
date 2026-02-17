# Wardley Mapping Examples

## Example 1: E-Commerce Platform

### Map

```text
Title: Online Retail Platform
Anchor: Customer needs to purchase products online
Date: YYYY-MM-DD

                    Genesis    Custom     Product    Commodity
                       │          │          │          │
Visible            ┌───┼──────────┼──────────┼──────────┼───┐
                   │   │          │          │          │   │
                   │   │  ● Customer Experience          │   │
                   │   │  │                              │   │
                   │   │  ├──────────────────┐           │   │
                   │   │  │                  │           │   │
                   │   │  ↓                  ↓           │   │
                   │   │  ● Product         ● Shopping  │   │
                   │   │    Recommendations   Cart       │   │
                   │   │    │                 │          │   │
                   │   │    │                 │          │   │
                   │   │    ↓                 ↓          │   │
                   │   │    ●────────────────●──────────→●  │
                   │   │    Personalization  Checkout    │   │
                   │   │    Engine           │           │   │
                   │   │    │                │           │   │
Hidden             │   │    │                ↓           │   │
                   │   │    │                ● Payment──→●  │
                   │   │    │                  Gateway   │   │
                   │   │    │                │           │   │
                   │   │    ↓                ↓           │   │
                   │   │    ●────────────────●──────────→●  │
                   │   │    Customer Data    Cloud       │   │
                   │   │                     Compute     │   │
                   └───┴──────────────────────────────────┘

Legend: ● Current position, → Evolution direction
```

### Analysis

```yaml
e_commerce_analysis:
  anchor:
    user: "Online shopper"
    need: "Purchase products conveniently online"

  components:
    customer_experience:
      evolution: "Custom"
      position: 0.35
      notes: "Differentiating, unique brand experience"

    product_recommendations:
      evolution: "Custom → Product"
      position: 0.40
      movement: "evolving"
      notes: "ML-based, moving toward productized solutions"

    personalization_engine:
      evolution: "Custom"
      position: 0.30
      notes: "Key differentiator, in-house built"
      depends_on: ["customer_data"]

    shopping_cart:
      evolution: "Product"
      position: 0.65
      notes: "Many solutions available, configure don't build"

    checkout:
      evolution: "Product → Commodity"
      position: 0.70
      movement: "evolving"
      notes: "Standard patterns, increasingly commoditized"

    payment_gateway:
      evolution: "Commodity"
      position: 0.85
      notes: "Stripe, Adyen - utility services"

    customer_data:
      evolution: "Custom"
      position: 0.35
      notes: "Proprietary, valuable for personalization"

    cloud_compute:
      evolution: "Commodity"
      position: 0.90
      notes: "AWS, Azure - utility"

  strategic_insights:
    opportunities:
      - "Double down on personalization as differentiator"
      - "Commoditize checkout to reduce cost"
      - "Use customer data to improve recommendations"

    threats:
      - "Amazon's personalization superiority"
      - "Recommendation engines becoming commoditized"

    recommendations:
      - action: "Invest in personalization engine"
        rationale: "Key differentiator, not yet commoditized"

      - action: "Migrate to SaaS checkout"
        rationale: "No competitive advantage in custom checkout"

      - action: "Build customer data platform"
        rationale: "Enables differentiation in personalization"
```

### Quantitative Positioning

Applying evolution scoring and decision metrics (see [Mathematical Models](mathematical-models.md)) to validate the qualitative analysis above.

#### Evolution Scoring

| Component | Ubiquity (U) | Certainty (C) | E(c) = (U+C)/2 | Stage | Qualitative Match? |
|-----------|-------------|---------------|-----------------|-------|--------------------|
| Customer Experience | 0.40 | 0.30 | 0.35 | Custom | Yes (0.35 in analysis) |
| Personalization Engine | 0.25 | 0.35 | 0.30 | Custom | Yes (0.30 in analysis) |
| Shopping Cart | 0.75 | 0.70 | 0.73 | Product | Close (0.65 in analysis — could revise up) |
| Payment Gateway | 0.90 | 0.85 | 0.88 | Commodity | Close (0.85 in analysis) |
| Cloud Compute | 0.95 | 0.90 | 0.93 | Commodity | Close (0.90 in analysis) |

The scoring confirms most qualitative positions. Shopping Cart scores higher (0.73) than the qualitative estimate (0.65) — suggesting it may be further toward commodity than initially assessed.

#### Decision Metrics

| Component | Visibility | Evolution | D(v) Differentiation | K(v) Commodity Leverage | Verdict |
|-----------|-----------|-----------|----------------------|------------------------|---------|
| Customer Experience | 0.90 | 0.35 | **0.59** | 0.07 | Invest to differentiate |
| Personalization Engine | 0.55 | 0.30 | **0.39** | 0.32 | Invest — key differentiator |
| Shopping Cart | 0.70 | 0.73 | 0.19 | 0.22 | Buy/configure — standard |
| Payment Gateway | 0.40 | 0.88 | 0.05 | **0.53** | Outsource |
| Cloud Compute | 0.15 | 0.93 | 0.01 | **0.79** | Consume as utility |

#### Dependency Risk

| Dependency | R(a,b) | Risk Level |
|-----------|--------|------------|
| Customer Experience → Personalization Engine | 0.90 × (1 - 0.30) = **0.63** | High — visible component depends on immature tech |
| Checkout → Payment Gateway | 0.70 × (1 - 0.88) = **0.08** | Low — mature dependency |

The high dependency risk (0.63) between Customer Experience and the Personalization Engine confirms the strategic recommendation to invest in the personalization engine — it's both a differentiator and a risk if left immature.

## Example 2: DevOps Platform

### Map

```text
Title: Internal Developer Platform
Anchor: Developers need to deploy applications reliably
Date: YYYY-MM-DD

                    Genesis    Custom     Product    Commodity
                       │          │          │          │
Visible            ┌───┼──────────┼──────────┼──────────┼───┐
                   │   │          │          │          │   │
                   │   │          │  ● Developer        │   │
                   │   │          │    Portal           │   │
                   │   │          │    │                │   │
                   │   │          │    ├──────────┐     │   │
                   │   │          │    │          │     │   │
                   │   │  ● Golden│    │          │     │   │
                   │   │    Paths │    │          │     │   │
                   │   │    │     │    │          │     │   │
                   │   │    │     ↓    ↓          ↓     │   │
                   │   │    │     ●────●──────────●     │   │
                   │   │    │     CI/CD  Container  IaC │   │
                   │   │    │     │      Orchestration  │   │
Hidden             │   │    │     │      │          │   │   │
                   │   │    │     │      │          │   │   │
                   │   │    ↓     ↓      ↓          ↓   │   │
                   │   │    ●─────●──────●──────────●   │   │
                   │   │    Platform  Kubernetes  Cloud │   │
                   │   │    Config    │          │      │   │
                   │   │              │          │      │   │
                   │   │              ↓          ↓      │   │
                   │   │              ●──────────●      │   │
                   │   │              Compute    Network│   │
                   └───┴──────────────────────────────────┘
```

### Analysis

```yaml
devops_analysis:
  strategic_positioning:
    differentiation_zone:
      components: ["Developer Portal", "Golden Paths"]
      strategy: "Build custom, focus on developer experience"
      rationale: "Competitive advantage in developer productivity"

    leverage_zone:
      components: ["CI/CD", "Container Orchestration", "IaC"]
      strategy: "Buy/configure products"
      rationale: "Mature products exist, don't rebuild"

    utility_zone:
      components: ["Kubernetes", "Cloud", "Compute"]
      strategy: "Consume as utility"
      rationale: "Commodity, optimize for cost"

  inertia_points:
    - component: "Platform Config"
      inertia: "Custom scripts accumulated over years"
      resolution: "Migrate to IaC gradually"

  evolution_watch:
    - component: "CI/CD"
      current: "Product"
      trend: "Moving toward commodity/utility (GitHub Actions, etc.)"
      action: "Prepare to migrate when utility options mature"
```

## Example 3: Machine Learning Product

### Map

```text
Title: ML-Powered Document Processing
Anchor: Business users need to extract data from documents
Date: YYYY-MM-DD

                    Genesis    Custom     Product    Commodity
                       │          │          │          │
Visible            ┌───┼──────────┼──────────┼──────────┼───┐
                   │   │          │          │          │   │
                   │   │          │     ● Document      │   │
                   │   │          │       Portal        │   │
                   │   │          │       │             │   │
                   │   │          │       │             │   │
                   │   │   ● Custom│      │             │   │
                   │   │     NLP  │←──────┘             │   │
                   │   │     Models│                    │   │
                   │   │     │     │                    │   │
                   │   │     │     ↓                    │   │
                   │   │     │     ●────────────────────●   │
                   │   │     │     Human Review   OCR      │
                   │   │     │     Workflow            │   │
Hidden             │   │     │     │                   │   │
                   │   │     │     │                   │   │
                   │   │     ↓     ↓                   │   │
                   │   │     ●─────●───────────────────●   │
                   │   │     ML    Training   Document │   │
                   │   │     Pipeline Data     Storage │   │
                   │   │     │                 │       │   │
                   │   │     ↓                 ↓       │   │
                   │   │     ●─────────────────●       │   │
                   │   │     GPU Compute  Cloud      │   │
                   └───┴──────────────────────────────────┘
```

### Strategic Decision

```yaml
ml_strategy:
  key_decision: "Build vs. Buy ML Models"

  analysis:
    custom_nlp_models:
      current_position: "Genesis/Custom (0.25)"
      alternatives:
        - "Azure AI Document Intelligence (Product)"
        - "AWS Textract (Product)"
        - "Google Document AI (Product)"

      considerations:
        build:
          pros:
            - "Tailored to specific document types"
            - "IP ownership"
            - "Potential long-term differentiator"
          cons:
            - "High expertise required"
            - "Slow time to market"
            - "Maintenance burden"

        buy:
          pros:
            - "Fast time to market"
            - "Continuous improvement by vendor"
            - "No ML expertise needed"
          cons:
            - "Less customization"
            - "Vendor lock-in"
            - "No differentiation"

  recommendation:
    decision: "Hybrid approach"
    strategy:
      - "Start with product (Azure AI) for 80% of documents"
      - "Build custom models only for unique document types"
      - "Focus differentiation on human-in-loop workflow"

    rationale: |
      Document AI products are mature enough for most use cases.
      True differentiation is in the workflow, not the ML models.
      Custom models only where product gaps exist.
```

For common mapping patterns and anti-patterns (Tower, Legacy Trap, Premature Innovation), see [Gameplay Patterns](gameplay-patterns.md).
