# Doctrine

Universally useful patterns for strategy, independent of context or landscape.

## Doctrine Categories

The following is a curated subset of Wardley's doctrine principles, covering the areas most actionable in mapping exercises. For the full set, see Simon Wardley's original writings.

```yaml
doctrine_categories:
  communication:
    - "Use a common language"
    - "Challenge assumptions"
    - "Focus on user needs"

  development:
    - "Use appropriate methods for evolution stage"
    - "Think small (cell-based structures)"
    - "Manage inertia"
    - "Use standards where appropriate"

  operation:
    - "Think FIRE (Fast, Inexpensive, Restrained, Elegant)"
    - "Manage failure appropriately"
    - "Optimize flow"

  learning:
    - "Use a systematic mechanism of learning"
    - "Know your users"
    - "Know your details"

  leading:
    - "Be the owner"
    - "Move fast"
    - "Accept that strategy is iterative"
```

## Doctrine Assessment Template

Use this template to evaluate an organization's doctrine maturity. Score each area 1-5:

| Score | Meaning |
|-------|---------|
| **1** | Not practiced — no evidence of this principle |
| **2** | Ad hoc — occasional, inconsistent application |
| **3** | Emerging — recognized as important, partially adopted |
| **4** | Established — consistently practiced with measurable results |
| **5** | Embedded — deeply ingrained in culture and decision-making |

```yaml
doctrine_assessment:
  communication:
    common_language:
      score: "{1-5}"
      evidence: "{How is strategic language standardized?}"

    challenge_assumptions:
      score: "{1-5}"
      evidence: "{How are assumptions questioned?}"

    focus_on_user_needs:
      score: "{1-5}"
      evidence: "{How are user needs identified and prioritized?}"

  development:
    appropriate_methods:
      score: "{1-5}"
      evidence: "{Are agile/lean/six sigma applied contextually by evolution stage?}"

    cell_based:
      score: "{1-5}"
      evidence: "{Are teams small and autonomous?}"

    manage_inertia:
      score: "{1-5}"
      evidence: "{How is organizational inertia identified and addressed?}"

    use_standards:
      score: "{1-5}"
      evidence: "{Are standards adopted where components are commodity/product?}"

  operation:
    think_fire:
      score: "{1-5}"
      evidence: "{Are solutions Fast, Inexpensive, Restrained, Elegant (FIRE)?}"

    manage_failure:
      score: "{1-5}"
      evidence: "{Is failure tolerance matched to evolution stage?}"

    optimize_flow:
      score: "{1-5}"
      evidence: "{Are bottlenecks identified and addressed?}"

  learning:
    systematic_learning:
      score: "{1-5}"
      evidence: "{Is there a feedback loop for strategic learning?}"

    know_users:
      score: "{1-5}"
      evidence: "{How well are users and their needs understood?}"

    know_details:
      score: "{1-5}"
      evidence: "{Is there deep understanding of component specifics?}"

  leading:
    ownership:
      score: "{1-5}"
      evidence: "{Is there clear ownership of strategy?}"

    move_fast:
      score: "{1-5}"
      evidence: "{How quickly are strategic decisions made?}"

    iterative_strategy:
      score: "{1-5}"
      evidence: "{Is strategy treated as continuous, not one-off?}"
```
