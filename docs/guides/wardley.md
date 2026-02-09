# Wardley Mapping Playbook

`/arckit.wardley` creates strategic Wardley Maps for architecture decisions and build vs buy analysis.

---

## Inputs

| Artefact | Purpose |
|----------|---------|
| Requirements (`ARC-<id>-REQ-v1.0.md`) | Capabilities needed |
| Stakeholder drivers | User needs and business context |
| Architecture diagrams | Current components and dependencies |
| Market research | Vendor landscape for build vs buy |

---

## Command

```bash
/arckit.wardley Create Wardley Map for <initiative>
```

Output: `projects/<id>/ARC-<id>-WARD-001-v1.0.md` (uses multi-instance numbering)

---

## Wardley Map Structure

| Section | Contents |
|---------|----------|
| User Needs | Anchor at top - what users need |
| Value Chain | Components required to meet needs |
| Evolution Assessment | Where each component sits on evolution axis |
| Movement Analysis | Where components are heading |
| Strategic Plays | Recommendations based on map |
| Build vs Buy | Sourcing recommendations per component |

---

## Evolution Stages

| Stage | Characteristics | Sourcing |
|-------|-----------------|----------|
| Genesis | Novel, uncertain, competitive advantage | Build/experiment |
| Custom | Emerging understanding, still differentiating | Build with care |
| Product | Well-understood, rental options exist | Buy/rent |
| Commodity | Standardized, utility, no differentiation | Utility/outsource |

---

## Component Positioning

| Axis | Meaning |
|------|---------|
| Y-Axis (Visibility) | How visible to user (top = user-facing) |
| X-Axis (Evolution) | Maturity from Genesis (left) to Commodity (right) |

---

## Strategic Patterns

| Pattern | Description | Action |
|---------|-------------|--------|
| Commoditization | Component moving right | Switch to utility |
| Pioneer | Genesis component | Invest in experimentation |
| Settler | Custom to Product | Productize and scale |
| Town Planner | Product to Commodity | Industrialize |
| Inertia | Resistance to change | Manage organizational change |

---

## Build vs Buy Decision

| Evolution Stage | Default Position | Exceptions |
|-----------------|------------------|------------|
| Genesis | Build | Rarely buy (doesn't exist) |
| Custom | Build | Buy if available and fits |
| Product | Buy | Build if core differentiator |
| Commodity | Buy/Utility | Never build |

---

## One-Page Workflow

| Phase | Key Activities | ArcKit Commands |
|-------|----------------|-----------------|
| Discovery | Identify user needs and components | `/arckit.requirements`, `/arckit.stakeholders` |
| Mapping | Create Wardley Map | `/arckit.wardley` |
| Analysis | Identify strategic plays | Review workshop |
| Sourcing | Research market options | `/arckit.research`, `/arckit.gcloud-search` |
| Decision | Build vs buy recommendations | `/arckit.sow`, `/arckit.evaluate` |

---

## Review Checklist

- User needs clearly anchored at top of map.
- All components identified in value chain.
- Dependencies shown between components.
- Evolution stage justified for each component.
- Movement (evolution direction) indicated.
- Strategic plays derived from map.
- Build vs buy recommendation for each component.
- Map shared and validated with stakeholders.

---

## OnlineWardleyMaps Format

```
title Your Map Title
anchor User Need [0.95, 0.63]
component Component A [0.85, 0.45] label [-50, -10]
component Component B [0.70, 0.65]
component Component C [0.55, 0.78]
Component A->Component B
Component B->Component C
evolution Genesis->Custom->Product->Commodity
```

Visualize at: https://create.wardleymaps.ai

---

## Key Principles

1. **Start with User Needs**: Maps anchor on user needs, not technology.
2. **Everything Evolves**: Components move from genesis to commodity.
3. **Position Over Labeling**: Where something is matters more than what it's called.
4. **Context Specific**: Maps are specific to your organization and time.
5. **Communication Tool**: Maps facilitate strategic conversations.

---

## Quick Questions? Use the Wardley Mapping Skill

For casual Wardley Mapping questions — evolution stage lookups, doctrine assessments, build vs. buy guidance, or interactive map creation — just ask naturally. The **wardley-mapping** skill activates automatically for conversational queries without generating formal documents.

Use `/arckit:wardley` when you need a **formal architecture artifact** with document control, project integration, and UK Government compliance.
