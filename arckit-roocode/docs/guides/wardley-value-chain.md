# Value Chain Decomposition Playbook

> **Guide Origin**: Official | **ArcKit Version**: [VERSION]

`/arckit.wardley.value-chain` decomposes user needs into value chains for Wardley Mapping.

---

## When to Use

Run this command **before** creating a Wardley Map when you need to decompose a domain into its constituent components. Value chain decomposition identifies all the capabilities, services, and activities required to meet user needs -- producing the raw material that `/arckit.wardley` then positions on an evolution axis.

---

## Inputs

| Artefact | Purpose |
|----------|---------|
| Requirements (`ARC-<id>-REQ-v1.0.md`) | **Mandatory** -- Capabilities, user needs, and business context |
| Stakeholder analysis (`ARC-<id>-STKE-v1.0.md`) | Recommended -- User roles and business drivers |
| Architecture diagrams | Optional -- Existing component landscape |

---

## Command

```bash
/arckit.wardley.value-chain Decompose value chain for <initiative>
```

Output: `projects/<id>/wardley-maps/ARC-<id>-WVCH-<NNN>-v1.0.md` (uses multi-instance numbering)

---

## Value Chain Structure

| Section | Contents |
|---------|----------|
| Anchor Identification | User needs vs internal solution anchors |
| Recursive Decomposition | Break each need into sub-components until atomic |
| Visibility Mapping | How visible each component is to the end user |
| Dependency Analysis | Which components depend on which |
| Component Catalogue | Full list with descriptions, types, and owners |

---

## Key Concepts

### Anchors: User Needs vs Solutions

Wardley Maps start from **user needs**, not technology. Value chain decomposition distinguishes:

- **User-need anchors** -- What the user actually wants (e.g., "book an appointment")
- **Solution anchors** -- Internal capabilities that serve the need (e.g., "appointment scheduling service")

Always anchor at user needs; solutions are components in the chain below.

### Recursive Decomposition

Each user need is broken down recursively:

1. Identify the top-level need
2. Ask "what is needed to provide this?"
3. For each answer, repeat until you reach atomic components
4. Atomic = a component that can be sourced as a single unit (build, buy, or utility)

### Visibility Axis

Components sit on a visibility spectrum:

| Position | Description |
|----------|-------------|
| Top (visible) | User-facing capabilities, directly experienced |
| Middle | Supporting services, seen by operators |
| Bottom (invisible) | Infrastructure and utilities, invisible to users |

### Dependency Types

| Type | Description |
|------|-------------|
| Direct | Component A cannot function without Component B |
| Indirect | Component A benefits from Component B but can operate without it |
| Shared | Multiple components depend on a common service |

---

## Workflow

| Phase | Key Activities | ArcKit Commands |
|-------|----------------|-----------------|
| Requirements | Define user needs and capabilities | `/arckit.requirements` |
| Decomposition | Break needs into value chains | `/arckit.wardley.value-chain` |
| Mapping | Position components on evolution axis | `/arckit.wardley` |
| Analysis | Assess doctrine, climate, gameplay | `/arckit.wardley.doctrine`, `/arckit.wardley.climate`, `/arckit.wardley.gameplay` |

---

## Review Checklist

- All user needs identified and used as anchors.
- Decomposition is recursive to atomic components.
- Visibility axis reflects real user perspective.
- Dependencies between components are explicit.
- No technology assumptions baked into anchors.
- Component catalogue is complete with descriptions.

---

## Tips

1. **Start with users, not technology** -- If your first anchor is a database, you have started too low.
2. **Challenge "obvious" components** -- Decompose even well-understood areas; hidden dependencies live there.
3. **Use stakeholder analysis** -- Stakeholder drivers reveal needs that requirements alone may miss.
4. **One chain per user need** -- Separate chains keep the analysis focused.
5. **Feed into Wardley Map** -- The value chain output is the direct input to `/arckit.wardley`.

---

## Viewing Your Map

**OnlineWardleyMaps** (primary): Copy the `wardley` code block and paste into [https://create.wardleymaps.ai](https://create.wardleymaps.ai) for an interactive editor.

**Mermaid** (secondary): Expand the `<details>` block in your generated artifact to see the Mermaid `wardley-beta` equivalent. This will render inline in GitHub, VS Code, and other Mermaid-enabled viewers once Mermaid ships `wardley-beta` in a stable release. Value chain maps do not include sourcing decorators — those are added by `/arckit.wardley` when creating the full positioned map.

---

## Feeds Into

- `/arckit.wardley` -- Use the decomposed value chain to create a positioned Wardley Map
- `/arckit.data-model` -- Components often map to data entities
