# Climatic Patterns

External forces that affect the landscape over which you have no choice.

## Economic Patterns

### Everything Evolves

```yaml
pattern:
  name: "Everything Evolves"
  description: "All components evolve through genesis → custom → product → commodity"

  implications:
    - "No competitive advantage is permanent"
    - "Today's differentiator is tomorrow's commodity"
    - "Plan for evolution, don't fight it"

  example: "Cloud computing: mainframe → server → VM → container → serverless"
```

### Characteristics Change as Components Evolve

```yaml
pattern:
  name: "Characteristics Change"
  description: "How you manage a component changes with its evolution"

  changes:
    genesis:
      development: "Research, exploration"
      failure: "Expected, learning"
      team: "Pioneers"

    commodity:
      development: "Operations, optimization"
      failure: "Unacceptable, incident"
      team: "Town planners"

  implication: "Same team skills don't work across evolution stages"
```

### No One Thing Fits All

```yaml
pattern:
  name: "No One Size Fits All"
  description: "Different stages require different approaches"

  examples:
    methods:
      genesis: "Agile, experimental"
      commodity: "Six Sigma, lean"

    contracts:
      genesis: "Time & materials"
      commodity: "Fixed price"

    architecture:
      genesis: "Disposable PoCs"
      commodity: "Standardized patterns"
```

## Competitive Patterns

### Components Can Co-Evolve

```yaml
pattern:
  name: "Co-Evolution"
  description: "Changes in one component can accelerate another"

  types:
    practice_based:
      description: "New practices emerge with new components"
      example: "DevOps emerged with cloud infrastructure"

    symbiotic:
      description: "Components evolve together"
      example: "Mobile devices and mobile apps"

  implication: "Watch for enabler components that unlock other evolution"
```

### Efficiency Enables Innovation

```yaml
pattern:
  name: "Efficiency Enables Innovation"
  description: "Commoditization of one layer enables innovation above it"

  example:
    commodity: "Cloud computing"
    enabled_innovation: "ML platforms, serverless applications"

  implication: "Commoditize lower layers to free resources for higher-value work"
```

### Higher Order Systems Create New Sources of Worth

```yaml
pattern:
  name: "Higher Order Systems"
  description: "New value emerges from combining evolved components"

  examples:
    - "IoT = sensors + connectivity + cloud + analytics"
    - "AI applications = compute + data + algorithms + interfaces"

  implication: "Look for emerging higher-order systems"
```

## Predictability Patterns

### Past Success Breeds Inertia

```yaml
pattern:
  name: "Success Breeds Inertia"
  description: "Organizations resist change to what made them successful"

  causes:
    - "Financial success with current model"
    - "Skills and expertise tied to current technology"
    - "Political capital invested in status quo"
    - "Existing customer relationships"

  symptoms:
    - "Not invented here syndrome"
    - "Custom building commodity components"
    - "Resisting cloud migration"
    - "Maintaining outdated technology"

  counter_strategy: "Explicitly identify and address inertia"
```

### Capital Flows to New Industries

```yaml
pattern:
  name: "Capital Flows"
  description: "Investment follows evolution opportunities"

  pattern: "Money flows from commodity extraction to genesis exploration"

  implication: "Commoditization frees capital for new innovation"
```

## Technology Patterns

### Componentization Increases

```yaml
pattern:
  name: "Increasing Componentization"
  description: "Systems become more modular over time"

  stages:
    early: "Monolithic, integrated"
    middle: "Modular, connected"
    mature: "Composable, standardized interfaces"

  current_trends:
    - "Microservices vs. monoliths"
    - "APIs vs. point-to-point"
    - "Serverless vs. managed servers"
```

### New Paradigms Create Waves

```yaml
pattern:
  name: "Technology Waves"
  description: "New paradigms replace old but take time"

  wave_pattern:
    emergence: "New technology appears (genesis)"
    early_adoption: "Pioneers experiment"
    disruption: "Mainstream adoption begins"
    maturity: "Previous paradigm commoditizes"
    next_wave: "Cycle repeats"

  current_waves:
    establishing: "AI/ML, quantum (early)"
    disrupting: "Cloud native, serverless"
    maturing: "Mobile, SaaS"
    commoditized: "Internet, databases"
```

## Market Patterns

### Buyers and Suppliers Evolve

```yaml
pattern:
  name: "Market Evolution"
  description: "Markets themselves evolve from bespoke to utility"

  stages:
    nascent:
      buyers: "Early adopters, willing to experiment"
      suppliers: "Few, innovative"
      contracts: "Custom, relationship-based"

    growth:
      buyers: "Mainstream, looking for features"
      suppliers: "Many, competing on features"
      contracts: "Product licenses"

    commodity:
      buyers: "Price-sensitive, switching easy"
      suppliers: "Few large, many small"
      contracts: "Utility, pay-per-use"
```

### Disruption from New Entrants

```yaml
pattern:
  name: "Disruption Pattern"
  description: "New entrants often come from evolved infrastructure"

  mechanism:
    - "Incumbents have inertia in custom-built systems"
    - "New entrants build on commodity infrastructure"
    - "New entrants have lower costs, faster iteration"
    - "Incumbents can't match without cannibalizing"

  example:
    incumbent: "Traditional banks with custom core banking"
    disruptor: "Fintech on cloud with SaaS tools"
    advantage: "Lower cost, faster feature delivery"
```

## Using Climatic Patterns

### Assessment Questions

```yaml
assessment:
  evolution:
    - "What components are actively evolving?"
    - "Are we fighting natural evolution anywhere?"
    - "What will be commodity in 5 years?"

  competition:
    - "Who could commoditize our differentiators?"
    - "What commodity infrastructure enables new competitors?"
    - "What higher-order systems are emerging?"

  inertia:
    - "Where do we have success-based inertia?"
    - "What skills/politics resist necessary change?"
    - "Are we building custom where products exist?"
```

### Pattern Recognition Template

```yaml
pattern_analysis:
  component: "{Component name}"

  climatic_patterns_affecting:
    - pattern: "{Pattern name}"
      impact: "{How it affects this component}"
      timeframe: "{When impact expected}"
      action: "{What to do about it}"

  overall_assessment:
    urgency: "{High/Medium/Low}"
    strategic_importance: "{High/Medium/Low}"
    recommended_response: "{Description}"
```
