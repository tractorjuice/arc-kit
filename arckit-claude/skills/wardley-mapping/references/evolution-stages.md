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

For quantitative evolution scoring rubrics (Ubiquity Scale, Certainty Scale, Score-to-Stage Mapping) and decision metrics, see [Mathematical Models](mathematical-models.md).

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

---

## Enhanced Stage Indicators

Detailed checklists for assessing which stage a component belongs to across four dimensions:

### Genesis Stage Indicators

- **Ubiquity markers**: Used by fewer than a handful of organizations; no established market; found only in research labs or cutting-edge pilots; most practitioners have never heard of it
- **Certainty markers**: No agreed-upon approach; each implementation looks completely different; high variance in results; practitioners disagree on fundamentals
- **Market markers**: No commercial offerings; no analysts covering it; no conferences dedicated to it; possibly a single paper or blog post
- **Failure mode**: Betting on the wrong approach — you build the wrong thing, the concept doesn't pan out, or a competitor's approach proves fundamentally superior

### Custom-Built Stage Indicators

- **Ubiquity markers**: A few dozen organizations have built it; mostly in-house implementations; early adopters only; growing word-of-mouth in specialist communities
- **Certainty markers**: Patterns are beginning to emerge; blog posts and conference talks appear; approaches vary but converge around a few patterns
- **Market markers**: Small number of consultancies or niche vendors; no dominant standard; user groups forming; early analyst coverage
- **Failure mode**: Building it wrong — your custom implementation has the wrong architecture, accrues technical debt, or gets overtaken by a productized competitor before you've recovered your investment

### Product Stage Indicators

- **Ubiquity markers**: Most large organizations are aware of it; multiple commercial products compete; analyst firms rank vendors; industry press covers it regularly
- **Certainty markers**: Training courses, professional certifications, and established methodologies exist; outcomes are predictable; clear best practices documented
- **Market markers**: Multiple competing vendors with clear feature differentiation; pricing is feature-based; annual comparison reports published; RFP processes are standardized
- **Failure mode**: Differentiation failure — failing to stand out from competing products, losing on features, price, or brand while rivals commoditize faster

### Commodity Stage Indicators

- **Ubiquity markers**: Ubiquitous — every organization uses it; invisible infrastructure; not adopting it would be unusual; pay-per-use or subscription models dominate
- **Certainty markers**: Fully standardized; ISO or formal standards exist; deviating from standard approaches is unusual; operations are predictable and auditable
- **Market markers**: Utility pricing; multiple interchangeable providers; switching costs low; procurement is routine; the component is rarely discussed in strategic terms
- **Failure mode**: Operational inefficiency — paying too much, running it in-house when a utility exists, or accumulating operational overhead that commodity providers handle more cheaply

---

## Transition Timing Heuristics

Weak signals that a component is about to move between stages. These precede the transition by months to years — use them to get ahead of the curve.

### Genesis → Custom-Built

- Multiple independent teams build their own version without coordinating
- The first conference talks appear: "Here's how we did it at [Company X]"
- A startup forms specifically to productize the concept
- A handful of GitHub repositories appear with experimental implementations
- The phrase "we built our own X" starts appearing in engineering blog posts

### Custom-Built → Product

- Documentation proliferates: vendor docs, how-to guides, blog series
- Training courses and certifications emerge (Udemy, Pluralsight, vendor academies)
- Industry analysts publish first Magic Quadrant or Wave covering the space
- Standardization efforts begin (working groups, RFCs, consortia form)
- The question shifts from "should we build this?" to "which vendor should we choose?"

### Product → Commodity

- Pricing models shift to consumption-based or utility billing (per API call, per GB, per user-minute)
- Open-source alternatives appear and gain traction, driving down commercial pricing
- "Good enough" becomes the accepted standard — buyers stop comparing features and compare price
- The component disappears from strategic discussions; procurement handles it routinely
- Cloud providers add it as a native managed service

---

## Pioneers / Settlers / Town Planners Talent Model

The three evolution stages map naturally to three types of people. Mismatching talent to stage is one of the most common and costly strategic mistakes.

### Pioneers (Genesis)

- Comfortable with chaos, ambiguity, and high failure rates
- Driven by exploration and discovery; motivated by novelty, not process
- High failure tolerance — they expect most experiments to fail and see it as learning
- Often poor at documentation, standardization, or handing work off cleanly
- Best suited to: research, prototyping, proof-of-concept work, greenfield exploration

### Settlers (Custom-Built → Product)

- Take pioneer discoveries and make them useful and repeatable
- Product-oriented and systematic; skilled at listening to users and iterating
- Build out the patterns that emerge from pioneer experiments into reliable solutions
- Bridge between the wild experimentation of genesis and the industrialization of commodity
- Best suited to: product development, early productization, growing user bases

### Town Planners (Product → Commodity)

- Industrialize at scale; obsessed with efficiency, reliability, and cost reduction
- Process-oriented, metrics-driven, volume operations mindset
- Build the pipes that everything else runs on; thrive in predictable, repeatable work
- Often frustrated by ambiguity or constant change
- Best suited to: platform engineering, infrastructure, shared services, SRE at scale

### Handoff Friction

Managing transitions between these types is critical and frequently mismanaged:

- **Pioneers hate process**: Forcing pioneers to maintain and document their experiments alienates them and slows exploration. Hand off to settlers early.
- **Town Planners hate uncertainty**: Asking planners to work on genesis-stage components creates anxiety, over-engineering, and premature standardization.
- **Settlers are the connective tissue**: They translate pioneer output into planner input. Skipping settlers (pioneer → planner handoff) often produces brittle, hard-to-operate systems.
- **Reward systems must differ**: Pioneers need space to fail; planners need predictability metrics. A single performance framework for all three types destroys the talent mix.

---

## Assessment Questions per Stage

Use these diagnostic questions to quickly identify where a component sits:

| Question | If Yes → Stage |
|----------|---------------|
| "Is this available as a utility API or cloud service?" | Commodity |
| "Can anyone buy this off the shelf from multiple vendors?" | Product or Commodity |
| "Are there multiple competing approaches with no clear winner?" | Custom-Built |
| "Does building this require original research or experimentation?" | Genesis |
| "Are there training courses and certifications for this?" | Product or Commodity |
| "Would you be the first (or one of very few) to attempt this?" | Genesis |
| "Does everyone in the industry just use the same provider?" | Commodity |
| "Is this a competitive differentiator for your organization?" | Genesis or Custom-Built |
