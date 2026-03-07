# Gameplay Patterns

Strategic moves based on landscape understanding. Apply these after creating a Wardley Map to identify opportunities and threats.

## Offensive Patterns

```yaml
offensive_gameplay:
  tower_and_moat:
    description: "Build differentiating capabilities on commodity foundation"
    when: "Strong custom components exist"
    action: "Commoditize dependencies, invest in differentiation"
    map_signature: "Custom components with commodity dependencies"

  land_and_expand:
    description: "Enter market with narrow offering, expand from there"
    when: "New market entry"
    action: "Start simple, add components over time"

  open_source_play:
    description: "Commoditize competitor's differentiator"
    when: "Competitor relies on custom component you can replicate"
    action: "Open source alternative to accelerate commoditization"

  ecosystem:
    description: "Create platform others build upon"
    when: "Control infrastructure component"
    action: "Enable others to build on your platform"

  two_factor:
    description: "Satisfy two markets with one platform"
    when: "Platform can serve multiple user types"
    action: "Connect both sides of a market"
```

## Defensive Patterns

```yaml
defensive_gameplay:
  patents_and_ip:
    description: "Protect innovations legally"
    when: "Genesis/custom stage innovations"
    action: "File patents, protect trade secrets"

  creating_constraint:
    description: "Slow evolution of component you control"
    when: "Evolution threatens your position"
    action: "Limit interoperability, create switching costs"

  embrace_and_extend:
    description: "Adopt standard then differentiate"
    when: "Commodity/product threatens differentiation"
    action: "Add proprietary extensions"
```

## Build vs. Buy vs. Outsource

Use the component's evolution position to guide sourcing decisions:

```yaml
build_buy_outsource:
  build:
    when:
      - "Component in Genesis/Custom stage"
      - "Core differentiator"
      - "No suitable market alternatives"
      - "Strategic advantage from ownership"
    examples:
      - "Core recommendation algorithm"
      - "Proprietary trading logic"

  buy:
    when:
      - "Component in Product stage"
      - "Not core differentiator"
      - "Multiple vendor options exist"
      - "Faster time to market needed"
    examples:
      - "CRM system"
      - "Marketing automation"

  outsource:
    when:
      - "Component is Commodity"
      - "No differentiation possible"
      - "Volume economics favor specialists"
      - "Operational burden not worth it"
    examples:
      - "Cloud infrastructure"
      - "Payment processing"
      - "Email delivery"
```

## Innovation Investment by Stage

```yaml
innovation_investment:
  genesis:
    investment_type: "Exploration"
    approach: "Experiments, PoCs, research"
    metrics: "Learning velocity, options created"
    failure_tolerance: "High"

  custom:
    investment_type: "Differentiation"
    approach: "Product development, custom builds"
    metrics: "Feature completion, user adoption"
    failure_tolerance: "Medium"

  product:
    investment_type: "Enhancement"
    approach: "Integration, configuration"
    metrics: "Time to value, TCO"
    failure_tolerance: "Low"

  commodity:
    investment_type: "Optimization"
    approach: "Cost reduction, automation"
    metrics: "Cost per unit, availability"
    failure_tolerance: "Very low"
```

## Common Map Patterns

Recognizable patterns to watch for when analyzing a completed map.

### Desirable Patterns

```yaml
desirable_patterns:
  tower_pattern:
    description: "Differentiation built on commodity foundation"
    structure:
      top: "Genesis/Custom differentiators"
      middle: "Product integrations"
      bottom: "Commodity infrastructure"
    example:
      differentiator: "Custom recommendation engine"
      product_layer: "E-commerce platform, CRM"
      commodity: "Cloud compute, databases"
    strategy: "Maximize commoditization at bottom to fund innovation at top"
```

### Anti-Patterns

```yaml
anti_patterns:
  legacy_trap:
    description: "Custom-built components that should be commodity"
    symptoms:
      - "Large team maintaining commodity-equivalent"
      - "High cost, slow innovation"
      - "Technical debt accumulation"
    example:
      component: "Custom identity management"
      market_alternatives: ["Auth0", "Azure AD B2C", "Okta"]
      waste: "Team of 5 maintaining what SaaS provides"
    resolution: "Migrate to product/commodity, redeploy team"

  premature_innovation:
    description: "Treating genesis component as if product/commodity"
    symptoms:
      - "Fixed-scope contracts for unknown work"
      - "Waterfall planning for experimental work"
      - "Outsourcing pioneer work"
    example:
      component: "Novel ML application"
      mistake: "Fixed-price contract with vendor"
      result: "Scope creep, failed project"
    resolution: "Match management approach to evolution stage"
```
