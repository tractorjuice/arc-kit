# Climate Assessment Playbook

> **Guide Origin**: Official | **ArcKit Version**: [VERSION]

`/arckit.wardley.climate` assesses 32 climatic patterns affecting mapped components.

---

## When to Use

Run this command **after** creating a Wardley Map to understand the external forces acting on your components. Climate patterns are the rules of the game -- they apply regardless of your strategy. Understanding them lets you anticipate change, identify inertia, and choose gameplay that works with (not against) external forces.

---

## Inputs

| Artefact | Purpose |
|----------|---------|
| Wardley Map (`ARC-<id>-WARD-*.md`) | **Mandatory** -- Map whose components are assessed for climatic forces |
| Requirements (`ARC-<id>-REQ-v1.0.md`) | Recommended -- Business context for impact assessment |
| Research findings (`ARC-<id>-RSCH-*.md`) | Recommended -- Market data to validate pattern detection |

---

## Command

```bash
/arckit.wardley.climate Assess climate for <initiative>
```

Output: `projects/<id>/wardley-maps/ARC-<id>-WCLM-<NNN>-v1.0.md` (uses multi-instance numbering)

---

## Climate Assessment Structure

| Section | Contents |
|---------|----------|
| Map Context | Summary of the Wardley Map being assessed |
| Pattern Assessment | 32 climatic patterns evaluated against components |
| Category Summary | Aggregated assessment across 6 pattern categories |
| Peace/War/Wonder Cycle | Current cycle phase and implications |
| Inertia Assessment | Components and organizations resisting change |
| Prediction Horizons | What can be predicted and with what confidence |
| Strategic Implications | How climate forces shape available strategies |

---

## Key Concepts

### 32 Climatic Patterns Across 6 Categories

| Category | Example Patterns |
|----------|-----------------|
| Competition | Competitors will copy successful plays, most competitors have poor situational awareness |
| Components | Everything evolves through supply and demand competition, characteristics change as components evolve |
| Financial | Higher-order systems create new sources of value, capital flows to new areas of value |
| Speed | Evolution does not respect corporate boundaries, no single method fits all |
| Prediction | Not everything is predictable, you can predict the direction of evolution |
| Ecosystem | Efficiency enables innovation, evolution of one component affects others |

### Peace / War / Wonder Cycle

The evolution of components follows a repeating cycle:

| Phase | Characteristics |
|-------|-----------------|
| Peace | Stable product competition, incremental improvement, predictable |
| War | Commodity transition, disruption, rapid change, casualties |
| Wonder | New genesis components emerge from commodity, novel value created |

Identifying which phase each component is in reveals whether stability or disruption is imminent.

### Inertia Assessment

Inertia is resistance to change. Climate assessment identifies:

- **Component inertia** -- Technology or practices that resist evolution
- **Organizational inertia** -- Cultural resistance, sunk cost, existing contracts
- **Market inertia** -- Vendor lock-in, switching costs, standards

### Prediction Horizons

Not all climate effects are equally predictable:

| Horizon | Confidence |
|---------|------------|
| Direction of evolution | High -- components always evolve toward commodity |
| Timing of evolution | Medium -- depends on competition and market forces |
| Specific disruptions | Low -- individual events are unpredictable |

---

## Workflow

| Phase | Key Activities | ArcKit Commands |
|-------|----------------|-----------------|
| Mapping | Create Wardley Map | `/arckit.wardley` |
| Climate | Assess external forces | `/arckit.wardley.climate` |
| Gameplay | Identify strategic plays | `/arckit.wardley.gameplay` |
| Strategy | Synthesise into strategy | `/arckit.strategy`, `/arckit.roadmap` |

---

## Review Checklist

- All 32 climatic patterns assessed against map components.
- Peace/War/Wonder phase identified for each key component.
- Inertia sources documented with severity.
- Prediction horizons are realistic (not overconfident).
- Strategic implications link back to specific components.
- Assessment is evidence-based, not speculative.

---

## Tips

1. **Climate before gameplay** -- Climate constrains which plays are viable. Always assess climate first.
2. **Look for war signals** -- Components approaching commodity transition are the highest-risk, highest-opportunity areas.
3. **Challenge inertia** -- Organizational inertia is often the hardest to overcome. Name it explicitly.
4. **Update with the map** -- Climate assessment is tied to a specific map version. When the map changes, re-assess.
5. **Use research data** -- Market research (`/arckit.research`) provides evidence for pattern detection. Do not assess climate in a vacuum.
