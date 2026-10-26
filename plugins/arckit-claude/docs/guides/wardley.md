# Wardley mapping: value chains, evolution and build vs buy

> **Guide Origin**: Official | **ArcKit Version**: [VERSION]

A Wardley map shows a user need, the chain of components that meet it, and how evolved each component is, from genesis to commodity. This guide explains how to draw one, following Simon Wardley's own steps, and how `/arckit:wardley` uses a map for build vs buy decisions.

---

## What a Wardley map is

Simon Wardley drew his first map in 2005, for an online photo service he ran. In [*Wardley Maps*, chapter 2](https://medium.com/wardleymaps/finding-a-path-cdb1249078c0), he says any map has four basic elements: it is visual, it is context specific, it shows the position of components relative to an anchor, and it shows movement.

On a Wardley map:

- **The anchor** is the user and their needs, at the top of the map.
- **The vertical axis is the value chain.** Each component needs the components below it. The higher a component sits, the more visible it is to the user.
- **The horizontal axis is evolution.** Components move from left to right over time, "driven by supply and demand competition".

Wardley calls maps "fundamentally a communication and learning tool". His book can be read online, and [Learn Wardley Mapping](https://learnwardleymapping.com/book/) lists the editions. It is published under the Creative Commons Attribution-ShareAlike 4.0 licence.

---

## How to draw a Wardley map

These steps follow chapter 2 of Wardley's book.

### 1. Start with user needs

Choose a scope, such as a service, a system or a whole organisation, and list the needs of its users. Wardley warns against a common trap: describing your own needs, such as making a profit, instead of your users' needs.

### 2. Map the value chain

For each need, ask what components you need to meet it. Then ask the same question of each component, until you reach things outside your scope, such as power bought from a utility. Write each component once. Put the components the user sees at the top and draw lines to the components they depend on.

Wardley uses "value chain" to mean a chain of needs, ordered by what the user values. He also warns that a value chain on its own has no movement, so it says little about strategy until you add evolution. In ArcKit, `/arckit:wardley.value-chain` does this step ([guide](wardley-value-chain.md)).

### 3. Place each component on the evolution axis

Wardley names four stages of evolution:

| Stage | Wardley's description | Focus |
|-------|-----------------------|-------|
| Genesis | The unique, the very rare, the uncertain, the constantly changing and the newly discovered | Exploration |
| Custom built | Very uncommon and still being learned about. Made for a specific environment, and frequently changing | Learning and craft |
| Product (including rental) | Increasingly common, made through a repeatable process, better understood | Refining and improving |
| Commodity (including utility) | Highly standardised and undifferentiated, produced at scale and volume | Industrialisation and operational efficiency |

To place a component, Wardley suggests asking:

- How ubiquitous and well defined is it?
- Do all my competitors use it?
- Is it available as a product or a utility service?
- Is it something new?

If the group cannot agree where something sits, it may be several components. Break it down.

### 4. Share it and invite challenge

Share the map with others in your organisation and let them challenge it. Look for unmet needs, missing components, and components you are building that you could buy or rent.

---

## Climate, doctrine and gameplay

Wardley built his [strategy cycle](https://medium.com/wardleymaps/on-being-lost-2ef5f05eb1ec) from five factors he took from Sun Tzu (purpose, landscape, climate, doctrine and leadership), joined with John Boyd's OODA loop (observe, orient, decide, act). The map is the landscape. The other factors are:

- **Climate**: "the forces that act upon the environment", including competitors' actions. You don't choose them, but you can discover them.
- **Doctrine**: "the universal principles, the set of beliefs that appear to work regardless of the landscape that is faced".
- **Leadership**: the strategy you choose for your context. Wardley calls these context-specific moves gameplay.

ArcKit has a command for each: `/arckit:wardley.climate`, `/arckit:wardley.doctrine` and `/arckit:wardley.gameplay`.

---

## Using /arckit:wardley

`/arckit:wardley` creates strategic Wardley Maps for architecture decisions and build vs buy analysis.

## Wardley Mapping Suite

ArcKit provides a full suite of Wardley Mapping commands that work together as a strategic analysis pipeline:

| Command | Purpose | Output |
|---------|---------|--------|
| `/arckit:wardley.value-chain` | Decompose user needs into value chains | WVCH |
| `/arckit:wardley` | Create positioned Wardley Maps | WARD |
| `/arckit:wardley.doctrine` | Assess organizational doctrine maturity | WDOC |
| `/arckit:wardley.climate` | Assess 32 climatic patterns | WCLM |
| `/arckit:wardley.gameplay` | Analyze 60+ strategic gameplay patterns | WGAM |

**Recommended workflow order:**

1. **Value Chain** -- Decompose domain into components ([guide](wardley-value-chain.md))
2. **Wardley Map** -- Position components on evolution axis (this guide)
3. **Doctrine** -- Assess organizational maturity ([guide](wardley-doctrine.md))
4. **Climate** -- Understand external forces ([guide](wardley-climate.md))
5. **Gameplay** -- Identify strategic plays ([guide](wardley-gameplay.md))
6. **Strategy / Roadmap** -- Synthesise findings into actionable plans

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
/arckit:wardley Create Wardley Map for <initiative>
```

Output: `projects/<id>/wardley-maps/ARC-<id>-WARD-001-v1.0.md` (uses multi-instance numbering)

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

## Where Each Component Came From

The Component Inventory carries a **Source** column, and it is checked before the map
is written. Each cell has to name something that exists:

| Source | Meaning |
|--------|---------|
| `ARC-nnn-WVCH-001-v1.0` | Decomposed from that value chain (value chains are numbered; copy the ID from the project context) |
| `ARC-nnn-REQ-v1.0` | Came from a requirement |
| `WVCH`, `REQ` | Any artefact of that type the project holds |
| `[DOC_ID-C1]` | A citation declared in the map's own Citations table |
| `VENDOR-A` | An external document listed in the map's Document Register |
| `Assumption` | Your own judgement, with no source document behind it |

A Source naming a document that is not in the repository is a fabricated provenance.
On Claude Code the plugin rejects the write and the map is not written — an invented
document ID is the failure this catches; on the other runtimes the rule is yours to
keep. `Assumption` is always available and always acceptable; the point is to say so
rather than manufacture a citation.

**Visibility is owned by the value chain.** Where a component's Source is a WVCH
artefact, its visibility must be that value chain's own number. Two documents that
disagree about how visible something is are a governance problem, not a rounding
difference. If the value chain is wrong, correct it with `/arckit:wardley.value-chain`
and re-run the map.

Components sourced anywhere else are not joined against the value chain, so a map
deliberately anchored on a different user need is free to position them differently.

---

## Strategic Patterns

| Pattern | Description | Action |
|---------|-------------|--------|
| Commoditization | Component moving right | Switch to utility |
| Pioneer | Genesis component | Invest in experimentation |
| Settler | Custom to Product | Productize and scale |
| Town Planner | Product to Commodity | Industrialize |
| Inertia | Resistance to change | Manage organizational change |

Pioneer, settler and town planner are Wardley's names for [attitudes](https://medium.com/wardleymaps/a-smorgasbord-of-the-slightly-useful-2498a1163dd6): the kinds of people and culture suited to each part of the map, rather than patterns of change. In [his words](https://medium.com/wardleymaps/round-round-get-around-i-loop-around-d88e865d4337), "Pioneers eXplore, Settlers eXpand our understanding and Town Planners eXploit by industrialising".

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
| Discovery | Identify user needs and components | `/arckit:requirements`, `/arckit:stakeholders` |
| Mapping | Create Wardley Map | `/arckit:wardley` |
| Analysis | Identify strategic plays | Review workshop |
| Sourcing | Research market options | `/arckit:research`, `/arckit:gcloud-search` |
| Decision | Build vs buy recommendations | `/arckit:sow`, `/arckit:evaluate` |

---

## Review Checklist

- User needs clearly anchored at top of map.
- All components identified in value chain.
- Dependencies shown between components.
- Evolution stage justified for each component.
- Source recorded for each component, and `Assumption` used where there is no source document.
- Visibility of value-chain components matches the value chain.
- Movement (evolution direction) indicated.
- Strategic plays derived from map.
- Build vs buy recommendation for each component.
- Map shared and validated with stakeholders.

---

## OnlineWardleyMaps Format

```text
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

## Viewing Your Map

**OnlineWardleyMaps** (primary): Copy the `wardley` code block and paste into [https://create.wardleymaps.ai](https://create.wardleymaps.ai) for an interactive editor with drag-and-drop repositioning.

**Mermaid** (secondary): Expand the `<details>` block in your generated artifact to see the Mermaid `wardley-beta` equivalent. Mermaid added [Wardley maps](https://mermaid.js.org/syntax/wardley.html) in version 11.14.0 (April 2026), still under the beta keyword `wardley-beta`. The block renders in any viewer running Mermaid 11.14.0 or later; a viewer on an older Mermaid version cannot draw it. The Mermaid version includes sourcing strategy markers (`build`/`buy`/`outsource`/`inertia`) as visual decorators on each component.

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
