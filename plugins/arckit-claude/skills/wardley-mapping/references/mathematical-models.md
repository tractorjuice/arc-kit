# Mathematical Models for Wardley Mapping

Quantitative formulas for component positioning, strategic decision-making, and evolution forecasting. These models complement the qualitative analysis in the other reference files — use them when users want numeric precision or data-driven positioning.

## A. Evolution Scoring

### Core Formula

Calculate a component's evolution score from two observable factors:

```
E(c) = (Ubiquity + Certainty) / 2
```

- **Ubiquity (U)**: How widespread is the component in the market? [0.0 - 1.0]
- **Certainty (C)**: How well understood and standardized are its practices? [0.0 - 1.0]
- **E(c)**: Evolution position on the X-axis [0.0 - 1.0]

This simple average works well for most positioning decisions. For components near stage boundaries where precision matters, use the sigmoid variant below.

### Sigmoid Variant (S-Curve)

Evolution in practice follows an S-curve — slow at first, rapid in the middle, plateauing at commodity:

```
E(c) = 1 / (1 + exp[-α(w₁·U + w₂·C - β)])
```

| Parameter | Default | Meaning |
|-----------|---------|---------|
| α | 6 | Steepness of the S-curve (higher = sharper transition) |
| w₁ | 0.5 | Weight for ubiquity |
| w₂ | 0.5 | Weight for certainty |
| β | 0.5 | Midpoint threshold |

For most use cases, equal weights (0.5/0.5) and defaults work. Adjust weights when one factor dominates — e.g., for infrastructure components where ubiquity matters more (w₁=0.6, w₂=0.4) or for regulated industries where certainty of practice matters more (w₁=0.4, w₂=0.6).

### Ubiquity Scoring Rubric

| Score | Label | Markers |
|-------|-------|---------|
| 0.0 - 0.2 | Rare/Novel | Only a few organizations use it; no established market; research/lab stage |
| 0.2 - 0.4 | Emerging | Growing adoption among early adopters; limited vendor options; conference talks about it |
| 0.4 - 0.6 | Common | Multiple vendors/implementations; most large organizations aware of it; analyst coverage |
| 0.6 - 0.8 | Widespread | Industry standard practice; assumed capability; multiple mature vendors |
| 0.8 - 1.0 | Universal/Utility | Everywhere; invisible infrastructure; pay-per-use available; not adopting is unusual |

### Certainty Scoring Rubric

| Score | Label | Markers |
|-------|-------|---------|
| 0.0 - 0.2 | Undefined | No established practices; high variation between implementations; "wild west" |
| 0.2 - 0.4 | Emerging practices | Some patterns forming; best practices debated; vendor-specific approaches |
| 0.4 - 0.6 | Accepted practices | Recognized methodologies; training courses available; professional certifications emerging |
| 0.6 - 0.8 | Well-defined | Industry standards exist; compliance frameworks; predictable outcomes |
| 0.8 - 1.0 | Fully standardized | ISO/formal standards; commoditized operations; deviating from standard is unusual |

### Stage Boundaries from Scores

| Evolution Score | Stage | Strategic Implication |
|----------------|-------|----------------------|
| 0.00 - 0.25 | Genesis | Build (R&D), accept high failure rate |
| 0.25 - 0.50 | Custom-Built | Build if differentiating, otherwise watch market |
| 0.50 - 0.75 | Product | Buy/configure, evaluate vendors |
| 0.75 - 1.00 | Commodity | Consume as utility, optimize cost |

### Worked Example: Tea Shop

Scoring each component of a simple tea shop:

| Component | Ubiquity (U) | Certainty (C) | E(c) = (U+C)/2 | Stage |
|-----------|-------------|---------------|-----------------|-------|
| Tea (the drink) | 0.95 | 0.95 | 0.95 | Commodity |
| Cup | 0.95 | 0.95 | 0.95 | Commodity |
| Hot Water | 0.90 | 0.95 | 0.93 | Commodity |
| Kettle | 0.85 | 0.90 | 0.88 | Commodity |
| Power Supply | 0.90 | 0.95 | 0.93 | Commodity |
| Tea Leaves | 0.70 | 0.80 | 0.75 | Product/Commodity boundary |
| Customer Experience | 0.40 | 0.30 | 0.35 | Custom |
| Artisan Blending | 0.15 | 0.20 | 0.18 | Genesis |

This confirms the intuitive positioning: infrastructure is commodity, the customer experience is custom and differentiating, and artisan blending (if offered) is genesis-stage innovation.

---

## B. Decision Metrics

Three formulas that use a component's **visibility** (Y-axis, 0-1) and **evolution** (X-axis, 0-1) to guide strategic action.

### Differentiation Pressure

```
D(v) = visibility × (1 - evolution)
```

**Interpretation**: How much pressure exists to invest in differentiating this component.

| D(v) Range | Meaning | Action |
|------------|---------|--------|
| 0.6 - 1.0 | High pressure | Must invest — users see it and it's not commoditized; competitive advantage here |
| 0.3 - 0.6 | Moderate | Evaluate case-by-case — may warrant targeted investment |
| 0.0 - 0.3 | Low pressure | Either hidden from users or already commoditized — don't over-invest |

**Example**: A customer-facing personalization engine at visibility=0.80, evolution=0.30 gives D = 0.80 × 0.70 = **0.56** (moderate-to-high — invest to differentiate).

### Commodity Leverage

```
K(v) = (1 - visibility) × evolution
```

**Interpretation**: How much opportunity exists to outsource or consume this component as a service.

| K(v) Range | Meaning | Action |
|------------|---------|--------|
| 0.6 - 1.0 | High leverage | Strong candidate for outsourcing/utility — hidden and commoditized |
| 0.3 - 0.6 | Moderate | Could outsource; evaluate vendor options and lock-in risk |
| 0.0 - 0.3 | Low leverage | Either too visible or too immature to outsource effectively |

**Example**: Cloud compute at visibility=0.20, evolution=0.90 gives K = 0.80 × 0.90 = **0.72** (high leverage — consume as utility).

### Dependency Risk

```
R(a,b) = visibility(a) × (1 - evolution(b))
```

**Interpretation**: How risky is it that visible component **a** depends on immature component **b**?

| R(a,b) Range | Meaning | Action |
|--------------|---------|--------|
| 0.6 - 1.0 | High risk | Critical: a user-visible component relies on something immature — add redundancy, invest in b's maturity |
| 0.3 - 0.6 | Moderate | Monitor closely; have fallback plans |
| 0.0 - 0.3 | Low risk | Either a is hidden or b is mature — acceptable dependency |

**Example**: If "Customer Portal" (visibility=0.85) depends on "Custom NLP Model" (evolution=0.25), then R = 0.85 × 0.75 = **0.64** (high risk — portal stability depends on immature technology).

### Combined Decision Matrix

Apply all three metrics together for a complete picture:

| Component | Vis. | Evol. | D(v) | K(v) | Verdict |
|-----------|------|-------|------|------|---------|
| High vis, low evol | 0.80 | 0.20 | 0.64 | 0.16 | **Invest to differentiate** |
| High vis, high evol | 0.80 | 0.85 | 0.12 | 0.13 | **Standard — buy/configure** |
| Low vis, high evol | 0.15 | 0.90 | 0.02 | 0.77 | **Outsource/consume utility** |
| Low vis, low evol | 0.15 | 0.20 | 0.12 | 0.17 | **Evaluate — often technical debt** |

---

## C. Weak Signal Detection

A framework for identifying when a component is approaching a stage transition (especially the critical Custom → Product or Product → Commodity shift).

### Four Readiness Factors

Each factor is scored 0.0 to 1.0:

| Factor | Symbol | What It Measures | Scoring Guide |
|--------|--------|-----------------|---------------|
| **Concept Readiness** | C(t) | Is the concept well understood? | 0.0 = novel idea, 0.5 = documented pattern, 1.0 = textbook knowledge |
| **Technology Readiness** | T(t) | Does enabling technology exist? | 0.0 = no tooling, 0.5 = emerging tools, 1.0 = mature platforms |
| **Suitability** | S(t) | Does it fit the user's context? | 0.0 = poor fit, 0.5 = requires adaptation, 1.0 = direct applicability |
| **Attitude** | A(t) | Is the market receptive? | 0.0 = resistance/skepticism, 0.5 = cautious interest, 1.0 = active demand |

### Combined Readiness Score

```
R(t) = C(t) × T(t) × S(t) × A(t)
```

The product (not average) is used deliberately — a zero in **any** factor blocks the transition regardless of the others.

### Transition Threshold

| R(t) Range | Signal | Interpretation |
|------------|--------|----------------|
| 0.70 - 1.00 | Strong | Component is ready to transition — expect movement within 6-12 months |
| 0.40 - 0.70 | Moderate | Transition is building — monitor quarterly; one factor may be lagging |
| 0.10 - 0.40 | Weak | Early signals only — track but don't act yet |
| 0.00 - 0.10 | None | No transition imminent — at least one factor is near zero |

### Publication Signal

A practical heuristic from weak signal research:

> When publications shift from **"how it works"** to **"how to use it"**, the component is approaching commodity.

| Publication Type | Dominant Content | Stage Signal |
|-----------------|-----------------|--------------|
| Research papers, patents | "How it works" (mechanism) | Genesis → Custom |
| Best practice guides, vendor docs | "How to use it" (application) | Custom → Product |
| Comparison sites, pricing pages | "Which one / how much" (selection) | Product → Commodity |

### Practical Assessment Checklist

Use this checklist when evaluating whether a component is about to transition:

```yaml
transition_assessment:
  component: "{Component Name}"
  current_stage: "{Genesis/Custom/Product/Commodity}"

  concept_readiness:
    score: # 0.0-1.0
    evidence:
      - "Is it documented in industry publications?"
      - "Do training courses exist?"
      - "Can you explain it to a non-specialist?"

  technology_readiness:
    score: # 0.0-1.0
    evidence:
      - "Are there multiple implementations/platforms?"
      - "Do open-source options exist?"
      - "Is tooling mature enough for non-experts?"

  suitability:
    score: # 0.0-1.0
    evidence:
      - "Does it solve a real problem in this context?"
      - "Are there successful reference implementations?"
      - "Can it integrate with existing systems?"

  attitude:
    score: # 0.0-1.0
    evidence:
      - "Is there market demand/pull?"
      - "Are competitors adopting it?"
      - "Is leadership receptive?"

  combined_readiness: # C × T × S × A
  transition_signal: # Strong/Moderate/Weak/None
  recommendation: # "Monitor", "Prepare to transition", "Act now"
```

### Worked Example: Container Orchestration (circa 2018)

| Factor | Score | Rationale |
|--------|-------|-----------|
| Concept (C) | 0.90 | Well documented, understood by most DevOps teams |
| Technology (T) | 0.85 | Kubernetes mature, multiple managed options (EKS, GKE, AKS) |
| Suitability (S) | 0.80 | Fits most deployment scenarios, broad applicability |
| Attitude (A) | 0.85 | Strong industry demand, CNCF ecosystem thriving |

**R(t) = 0.90 × 0.85 × 0.80 × 0.85 = 0.52**

Moderate-to-strong signal — transitioning from Product to Commodity. (And indeed, by 2020 managed Kubernetes was effectively a commodity cloud service.)

---

---

## D. Play-Position Scoring

A quantitative framework for evaluating which gameplay options are viable given your current map position.

### Core Formula

```
Play Score = Position_Match(0-1) × Capability_Fit(0-1) × (1 - Risk_Factor(0-1))
```

Higher scores indicate plays that are well-aligned with your position, executable with current capabilities, and have acceptable downside risk.

### Position Match

How well does the gameplay play align with the evolution position of the target components?

```
Position_Match scoring:
  Play targets your current stage:        1.0   (e.g., ILC play on a Custom-Built component)
  Play targets an adjacent stage:         0.6   (one stage left or right of current)
  Play targets a distant stage:           0.2   (two stages away)
```

**Example**: An "Open Source" commoditization play on a Product-stage component (adjacent — targeting Commodity) scores 0.6. The same play on a Genesis-stage component (distant — skipping two stages) scores 0.2.

### Capability Fit

Can your organization actually execute this play? Assess against the prerequisites for the specific gameplay.

```
Capability_Fit scoring:
  Have all prerequisites:                 1.0   (full capability to execute)
  Have most prerequisites:                0.7   (minor gaps, fillable with investment)
  Missing one key capability:             0.3   (significant gap requiring major effort)
  Missing multiple key capabilities:      0.1   (play is currently out of reach)
```

**Example**: An ILC play requires engineering scale, platform capabilities, and sales channels. A startup with strong engineering but no sales or platform infrastructure scores 0.3.

### Risk Factor

What is the downside if the play fails or conditions change?

```
Risk_Factor scoring:
  Low risk, fully reversible:             0.1   (easy to stop, low sunk cost)
  Medium risk, partially reversible:      0.4   (moderate investment, some recovery possible)
  High risk, largely irreversible:        0.8   (major commitment, hard to unwind)
  Existential risk, irreversible:         0.95  (bet-the-company, failure = shutdown)
```

Note: The Risk_Factor is subtracted from 1.0 before multiplying — so higher risk *reduces* the play score.

### Worked Example: Evaluating Three Plays

A company with a Custom-Built analytics platform evaluates three possible plays:

| Play | Position_Match | Capability_Fit | Risk_Factor | Play Score | Verdict |
|------|---------------|----------------|-------------|------------|---------|
| Productize platform (sell to others) | 1.0 (Custom→Product) | 0.7 (engineering ok, sales gap) | 0.4 (medium) | 1.0 × 0.7 × 0.6 = **0.42** | Viable with investment |
| Open source to commoditize | 0.6 (adjacent→Commodity) | 0.3 (no community mgmt) | 0.4 (medium) | 0.6 × 0.3 × 0.6 = **0.11** | Not viable yet |
| Deepen custom differentiation | 1.0 (stay in Custom) | 1.0 (core strength) | 0.1 (low) | 1.0 × 1.0 × 0.9 = **0.90** | Strong — continue investing |

The scoring confirms the intuitive recommendation: double down on differentiation while building the sales capability needed to eventually productize.

### Play Score Interpretation

| Play Score | Recommendation |
|------------|---------------|
| 0.70 - 1.00 | Execute — strong alignment, capability, and acceptable risk |
| 0.40 - 0.70 | Conditional — viable but address the weakest factor first |
| 0.15 - 0.40 | Weak — significant gaps; develop prerequisites before attempting |
| 0.00 - 0.15 | Avoid — misaligned, incapable, or too risky at current position |

---

## E. Climate Pattern Impact Weighting

A scoring framework for prioritizing which components face the greatest strategic pressure from climatic patterns.

### Impact Matrix

For each climatic pattern identified on a map, score its impact on each component:

```
Impact Matrix: Pattern × Component → Score (1-5)

Scoring scale:
  5 = Pattern directly threatens or enables this component's current position
  4 = Pattern significantly affects this component's evolution trajectory
  3 = Pattern has moderate influence on this component
  2 = Pattern has minor relevance to this component
  1 = Pattern has negligible or no effect on this component
```

A score of 5 means: if you ignore this pattern for this component, you will likely make a wrong strategic decision. A score of 1 means: the pattern exists but has no actionable implication for this component.

### Aggregate Scoring

Once the matrix is populated, calculate three aggregate scores:

```
Component Risk Score  = Sum of all pattern impact scores for that component
  → Identifies which components face the most cumulative climatic pressure

Pattern Criticality   = Sum of all component impact scores for that pattern
  → Identifies which patterns have the broadest effect across the value chain

Priority Focus        = Components with the highest Component Risk Scores
  → Where to direct monitoring, investment, or contingency planning
```

### Worked Example: TechnoGadget Smart Home

Applying 5 climatic patterns to the TechnoGadget map (from [Mapping Examples](mapping-examples.md)):

| Component | Everything Evolves | Inertia | Higher-Order Systems | Efficiency Enables Innovation | Competitors Change Game | Risk Score |
|-----------|-------------------|---------|---------------------|------------------------------|------------------------|------------|
| Smart thermostat | 4 | 5 | 2 | 1 | 5 | **17** |
| Mobile app | 3 | 4 | 2 | 1 | 4 | **14** |
| Cloud infrastructure | 2 | 1 | 5 | 5 | 1 | **14** |
| Data analytics | 4 | 2 | 5 | 4 | 3 | **18** |
| R&D | 3 | 1 | 4 | 4 | 2 | **14** |
| API | 5 | 2 | 3 | 3 | 4 | **17** |
| **Pattern Criticality** | **21** | **15** | **21** | **18** | **19** | |

**Interpretation**:

- **Data analytics** (18) and **Smart thermostat / API** (17 each) face the highest cumulative climatic pressure — these are the priority focus components
- **Everything Evolves** and **Higher-Order Systems** tie as the most broadly impactful patterns (21 each) — both affect nearly every component
- **Inertia** (15) scores lowest in criticality but scores highest on Smart thermostat (5) — it is highly concentrated on one critical component, not broadly distributed

### Using the Matrix in Practice

1. List all climatic patterns identified on the map (typically 3-8 for a focused analysis)
2. Score each pattern against each component (5-minute workshop exercise per pattern)
3. Sum rows (component risk) and columns (pattern criticality)
4. Rank components by risk score — highest scores demand strategic attention
5. For components scoring 15+ (in a 5-pattern analysis), develop explicit contingency responses

The matrix is most useful as a workshop tool: it forces explicit discussion about *why* a pattern affects a component, surfaces disagreements in the team's mental models, and produces a defensible prioritization.

---

## Further Reading

These models are drawn from a broader mathematical framework for Wardley Mapping that includes game theory, stochastic processes, topological analysis, and Bayesian inference. For the full academic treatment, see the [Wardley Map Mathematical Model](https://github.com/tractorjuice/wardleymap_math_model) repository.
