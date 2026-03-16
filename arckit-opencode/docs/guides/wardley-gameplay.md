# Gameplay Analysis Playbook

> **Guide Origin**: Official | **ArcKit Version**: [VERSION]

`/arckit.wardley.gameplay` analyzes strategic plays from 60+ gameplay patterns.

---

## When to Use

Run this command **after** creating a Wardley Map to identify strategic plays available to your organization. Gameplay analysis examines your map and recommends actions based on component positions, movements, and the competitive landscape. Best combined with climate assessment (`/arckit.wardley.climate`) for a complete strategic picture.

---

## Inputs

| Artefact | Purpose |
|----------|---------|
| Wardley Map (`ARC-<id>-WARD-*.md`) | **Mandatory** -- Map to analyze for strategic plays |
| Climate assessment (`ARC-<id>-WCLM-*.md`) | Recommended -- External forces affecting gameplay choices |
| Doctrine assessment (`ARC-<id>-WDOC-*.md`) | Recommended -- Organizational readiness for each play |

---

## Command

```bash
/arckit.wardley.gameplay Analyze gameplay for <initiative>
```

Output: `projects/<id>/wardley-maps/ARC-<id>-WGAM-<NNN>-v1.0.md` (uses multi-instance numbering)

---

## Gameplay Structure

| Section | Contents |
|---------|----------|
| Map Context | Summary of the Wardley Map being analyzed |
| Applicable Plays | Strategic plays identified from component positions |
| Play-Position Matrix | Which plays apply to which components |
| Alignment Classification | D&D alignment for each play (Lawful/Neutral/Chaotic) |
| Recommended Actions | Prioritized list of strategic actions |
| Risk Assessment | Risks and counter-plays for each recommendation |

---

## Key Concepts

### 11 Gameplay Categories

| Category | Focus |
|----------|-------|
| User Perception | Shaping how users see value |
| Accelerators | Speeding evolution of components |
| De-accelerators | Slowing evolution to protect advantage |
| Market | Creating or reshaping markets |
| Defensive | Protecting current position |
| Attacking | Disrupting competitors |
| Ecosystem | Building or leveraging ecosystems |
| Positional | Exploiting map position |
| Poison | Undermining competitor strategies |
| Military | Direct competitive confrontation |
| Political | Influencing rules and standards |

### 60+ Plays

Examples include open source (accelerator), create a constraint (de-accelerator), tower and moat (defensive), two-factor markets (ecosystem), and standards game (political). Each play has specific applicability based on component evolution stage and visibility.

### D&D Alignment Classification

Plays are classified on two axes:

| Axis | Options |
|------|---------|
| Lawful / Neutral / Chaotic | How the play relates to established norms |
| Good / Neutral / Evil | The ethical dimension of the play |

This classification helps organizations choose plays that align with their values and governance requirements.

### Play-Position Matrix

The matrix maps each play to the evolution stages where it is most effective:

| Evolution Stage | Example Plays |
|-----------------|---------------|
| Genesis | Experimentation, talent raid, first mover |
| Custom | Sensing engines, co-creation |
| Product | Industrialisation plays, ecosystem building |
| Commodity | Standards game, utility plays, commoditisation |

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

- Wardley Map is current and validated.
- All applicable plays identified for each component.
- D&D alignment classification is consistent.
- Risks and counter-plays documented for each recommendation.
- Play-position matrix is populated.
- Recommendations are prioritized by impact and feasibility.
- Organizational readiness considered (doctrine assessment).

---

## Tips

1. **Map first, play second** -- Never select gameplay without a current Wardley Map.
2. **Combine with climate** -- Climate patterns constrain which plays are viable. Assess climate first.
3. **Check doctrine readiness** -- Some plays require organizational maturity. A Phase I organization cannot execute Phase III plays.
4. **Consider ethics** -- The D&D alignment classification is not decorative. Choose plays consistent with your governance.
5. **Revisit after map changes** -- When components move or the landscape shifts, gameplay analysis must be refreshed.
