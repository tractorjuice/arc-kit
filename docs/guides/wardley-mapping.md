# Wardley Mapping Guide

`/arckit.wardley` creates strategy maps that plot components from Genesis → Commodity and expose build/buy/reuse decisions.

---

## Quick Start

```bash
/arckit.wardley Create Wardley Map for <initiative> highlighting build vs buy
```

Output: `projects/<id>/wardley-maps/<map-name>.md` in Open Wardley Map format.

---

## Axes Cheat Sheet

| Y Axis (Visibility) | X Axis (Evolution) | Typical Action |
|---------------------|--------------------|----------------|
| High visibility | Genesis / Custom | Build, protect IP, experiment |
| Medium | Product | Evaluate vendors, consider SaaS |
| Low | Commodity / Utility | Use commodity cloud or shared services |

Evolution thresholds (guideline): 0.0–0.25 Genesis, 0.26–0.5 Custom, 0.51–0.75 Product, 0.76–1.0 Commodity.

---

## Map Anatomy

- **Value chain**: User need at top, supporting components below.
- **Annotations**: Build/Buy/Reuse tags, risk notes, policy constraints.
- **Regions**: Identify duplication (two custom solutions solving commodity need).
- **Climate patterns**: Use map insights to predict pressure (commoditisation, inertia).

---

## Using the Map

- Feed build/buy decisions into `/arckit.sow`, `/arckit.evaluate`, and architecture principles.
- Align product backlog prioritisation (innovate in Genesis, refactor commodity).
- Update map when research or procurement changes component positioning.
- Present in governance boards to defend strategic choices and investment.

Paste map content into [https://create.wardleymaps.ai](https://create.wardleymaps.ai) to render visuals.
