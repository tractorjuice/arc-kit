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
