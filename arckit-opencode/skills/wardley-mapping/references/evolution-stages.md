# Evolution Stages

Detailed characteristics, activities, and indicators for each Wardley Map evolution stage.

## Stage Characteristics

```yaml
evolution_stages:
  genesis:
    position: "Far left (0.0 - 0.25)"
    characteristics:
      - "Novel, unique, uncertain"
      - "Poorly understood"
      - "High failure rates"
      - "Requires experimentation"
    activities:
      - "Research & development"
      - "Exploration"
      - "Proof of concepts"
    examples:
      - "Quantum computing (for most use cases)"
      - "Novel AI architectures"
      - "Experimental materials"

  custom_built:
    position: "Center-left (0.25 - 0.50)"
    characteristics:
      - "Understood but unique implementation"
      - "Bespoke solutions"
      - "Differentiating"
      - "High cost, high expertise"
    activities:
      - "Custom development"
      - "Integration work"
      - "Specialized teams"
    examples:
      - "Custom recommendation engine"
      - "Bespoke trading platform"
      - "Specialized analytics"

  product:
    position: "Center-right (0.50 - 0.75)"
    characteristics:
      - "Increasingly understood"
      - "Multiple vendors/options"
      - "Feature differentiation"
      - "Growing competition"
    activities:
      - "Buy vs. build decisions"
      - "Vendor evaluation"
      - "Configuration over coding"
    examples:
      - "CRM systems"
      - "E-commerce platforms"
      - "Analytics tools"

  commodity:
    position: "Far right (0.75 - 1.0)"
    characteristics:
      - "Well understood"
      - "Essential, expected"
      - "Low differentiation"
      - "Volume operations"
    activities:
      - "Utility consumption"
      - "Cost optimization"
      - "Operational excellence"
    examples:
      - "Cloud compute (IaaS)"
      - "Email services"
      - "Payment processing"
```

## Evolution Indicators

| Indicator | Genesis | Custom | Product | Commodity |
|-----------|---------|--------|---------|-----------|
| **Ubiquity** | Rare | Rare-Common | Common | Widespread |
| **Certainty** | Uncertain | Uncertain-Defined | Defined | Defined |
| **Market** | Undefined | Forming | Mature | Utility |
| **Failure Mode** | Research | Learning | Differentiation | Operational |
| **Talent** | Pioneers | Settlers | Settlers-Planners | Town Planners |

## Numeric Scoring

For precise positioning, score a component on two dimensions — **Ubiquity** (how widespread) and **Certainty** (how standardized) — each on a 0.0 to 1.0 scale, then average them:

```
Evolution Score = (Ubiquity + Certainty) / 2
```

### Ubiquity Scale

| Score | Label | Markers |
|-------|-------|---------|
| 0.0 - 0.2 | Rare/Novel | Only a few organizations; no established market |
| 0.2 - 0.4 | Emerging | Early adopters; limited vendor options |
| 0.4 - 0.6 | Common | Multiple vendors; analyst coverage; most large orgs aware |
| 0.6 - 0.8 | Widespread | Industry standard; assumed capability |
| 0.8 - 1.0 | Universal | Everywhere; pay-per-use available; not adopting is unusual |

### Certainty Scale

| Score | Label | Markers |
|-------|-------|---------|
| 0.0 - 0.2 | Undefined | No established practices; high variation |
| 0.2 - 0.4 | Emerging | Some patterns forming; vendor-specific approaches |
| 0.4 - 0.6 | Accepted | Recognized methodologies; training courses available |
| 0.6 - 0.8 | Well-defined | Industry standards; compliance frameworks |
| 0.8 - 1.0 | Standardized | ISO/formal standards; commoditized operations |

### Score-to-Stage Mapping

| Evolution Score | Stage |
|----------------|-------|
| 0.00 - 0.25 | Genesis |
| 0.25 - 0.50 | Custom-Built |
| 0.50 - 0.75 | Product |
| 0.75 - 1.00 | Commodity |

For detailed formulas (sigmoid variant, decision metrics, weak signals), see [Mathematical Models](mathematical-models.md).

## Positioning Criteria

When placing a component on the evolution axis, assess:

1. **How well understood is it?** — Widely documented and standardized = further right
2. **How many alternatives exist?** — Many competing options = Product or Commodity
3. **Is it commoditized or unique?** — Utility/pay-per-use = Commodity
4. **What's the market maturity?** — Established vendors with stable offerings = Product+

### Common Positioning Mistakes

- Positioning based on **age** rather than market maturity
- Confusing **internal unfamiliarity** with market-wide genesis
- Not considering **industry context** (a component may be commodity in one industry but custom in another)
