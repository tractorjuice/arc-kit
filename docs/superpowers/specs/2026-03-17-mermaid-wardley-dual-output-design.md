# Mermaid Wardley Map Dual Output — Design Spec

**Date**: 2026-03-17
**Status**: Draft
**Scope**: Add Mermaid `wardley-beta` output alongside existing OnlineWardleyMaps (OWM) syntax in Wardley map artifacts

---

## Context

Mermaid.js has merged Wardley Map support (`wardley-beta` keyword) into its develop branch via [PR #7147](https://github.com/mermaid-js/mermaid/pull/7147). The syntax is nearly identical to OnlineWardleyMaps (OWM) — same `[visibility, evolution]` coordinate system, same component/anchor/evolve/pipeline concepts — but adds sourcing strategy decorators (`(build)`, `(buy)`, `(outsource)`, `(inertia)`), named pipeline children, and will render natively in GitHub, VS Code, and other Mermaid-enabled viewers once shipped in a stable release.

ArcKit currently generates OWM syntax exclusively across its 2 map-producing commands (`wardley`, `wardley.value-chain`). This spec adds Mermaid `wardley-beta` as a secondary output format alongside OWM, positioned in a collapsible `<details>` block.

## Design Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Output strategy | Dual output: OWM primary + Mermaid secondary | Backward-compatible; OWM is proven; Mermaid matures into primary over time |
| Mermaid enhancement | Use sourcing decorators (`build`/`buy`/`outsource`/`inertia`) | Main value-add over OWM; maps directly to ArcKit's build vs buy analysis |
| Pipeline translation | Convert OWM pipelines to Mermaid named-child format | More expressive; core Wardley concept worth supporting |
| Placement in artifact | Mermaid in collapsible `<details>` block below OWM | OWM stays primary; Mermaid available without cluttering the default view |
| Validation hook | OWM-only (no Mermaid validation) | Both generated from same source data; if OWM is correct, Mermaid will be too |
| Command scope | `wardley` + `wardley.value-chain` only | Only commands that generate map code blocks; doctrine/climate/gameplay produce tables |

## Mermaid Syntax Reference

The `wardley-beta` keyword uses this syntax (coordinates identical to OWM):

```text
wardley-beta
title Map Title
size [1100, 800]

anchor User [0.95, 0.63]

component "Component Name" [visibility, evolution] (build|buy|outsource) (inertia)
Component A -> Component B

pipeline Parent {
  component "Child A" [evolution_a]
  component "Child B" [evolution_b]
}

evolve Component 0.85

note "Note text" [visibility, evolution]
annotations [0.05, 0.05]
annotation 1,[visibility, evolution] "Annotation text"
```

### Key Differences from OWM

| Feature | OWM | Mermaid `wardley-beta` |
|---------|-----|----------------------|
| Declaration | `style wardley` at end | `wardley-beta` at start |
| Canvas size | Implicit | `size [width, height]` |
| Notes | `note text [vis, evo]` | `note "text" [vis, evo]` (quoted) |
| Annotations | `annotation N [vis, evo] text` | `annotation N,[vis, evo] "text"` (comma, quoted) |
| Pipelines | `pipeline Name [vis, evo_start, evo_end]` | `pipeline Name { component "Child" [evo] }` |
| Sourcing | Not supported | `(build)`, `(buy)`, `(outsource)` (also `(market)` — not used by ArcKit) |
| Inertia | Not visual | `(inertia)` decorator |
| Evolve labels | `evolve Name 0.85 label text` | `evolve Name 0.85` (no label support) |

### Decorator Mapping Rules

The AI derives sourcing decorators from the Build vs Buy analysis in the same artifact:

| Condition | Decorator |
|-----------|-----------|
| Evolution < 0.50 AND strategic differentiator | `(build)` |
| Product stage, procured from market | `(buy)` |
| Outsourced to vendor | `(outsource)` |
| Commodity/utility (> 0.75) | `(buy)` or no decorator |
| Component has identified inertia | Append `(inertia)` |

For `wardley.value-chain`: no sourcing decorators (build/buy analysis not yet performed at value chain stage).

## Changes

### 1. Templates (4 files)

**`arckit-claude/templates/wardley-map-template.md`** and its CLI mirror **`.arckit/templates/wardley-map-template.md`**:

Insert after the existing OWM code fence closing (after `style wardley` block around line 53, before the `---` separator on line 55). Note: the template also contains a separate Mermaid `flowchart TD` block in the "Dependencies and Value Chain" section (line 341) — that is a dependency diagram, not a Wardley map; leave it unchanged.

```markdown
<details>
<summary>Mermaid Wardley Map (renders in GitHub, VS Code, and other Mermaid-enabled viewers)</summary>

> **Note**: Mermaid Wardley Maps use the `wardley-beta` keyword. This feature is in Mermaid's develop branch and may not render in all viewers yet.

```mermaid
wardley-beta
title {map_name}
size [1100, 800]

anchor {anchor_component} [0.95, 0.63]

component {Component_Name} [visibility, evolution] (build|buy|outsource)
component {Component_Name} [visibility, evolution] (buy) (inertia)
{Component_Name} -> {Dependency_Name}

pipeline {Pipeline_Parent} {
  component "{Child_1}" [evolution_1]
  component "{Child_2}" [evolution_2]
}

evolve {Component_Name} {target_evolution}

note "{note_text}" [visibility, evolution]
annotations [0.05, 0.05]
annotation {N},[visibility, evolution] "{annotation_text}"
```

**Decorator Guide**:

- `(build)` — Genesis/Custom components built in-house (triangle marker)
- `(buy)` — Product/Commodity components procured from market (diamond marker)
- `(outsource)` — Components outsourced to vendors (square marker)
- `(inertia)` — Components with resistance to change (vertical line)

</details>
```

**`arckit-claude/templates/wardley-value-chain-template.md`** and its CLI mirror **`.arckit/templates/wardley-value-chain-template.md`**:

Same `<details>` pattern but without sourcing decorators. Insert after the OWM code block in the Value Chain Diagram section.

### 2. Commands (2 files)

**`arckit-claude/commands/wardley.md`**:

**Edit A** — Add new subsection after "Map Code Generation" (after line ~220), before "Strategic Analysis":

```markdown
### Mermaid Wardley Map (Enhanced)

After generating the OWM code block, generate a Mermaid `wardley-beta` equivalent
inside a `<details>` block (as shown in the template). The Mermaid version adds
sourcing strategy decorators derived from the Build vs Buy analysis:

- Components with evolution < 0.50 that are strategic differentiators: `(build)`
- Components procured from market (Product stage): `(buy)`
- Components outsourced to vendors: `(outsource)`
- Commodity/utility components: no decorator (or `(buy)` if via G-Cloud/marketplace)
- Components with identified inertia: append `(inertia)`

**Pipeline translation**: Convert OWM `pipeline Name [vis, evo_start, evo_end]` to
Mermaid's named-child format where pipeline variants are identified:

```text
pipeline Parent {
  component "Variant A" [evo_a]
  component "Variant B" [evo_b]
}
```

**Syntax differences from OWM** (apply these when translating):

- Start with `wardley-beta` keyword (not `style wardley` at end)
- Add `size [1100, 800]` after title
- Wrap note text in double quotes: `note "text" [vis, evo]`
- Annotations use comma separator: `annotation N,[vis, evo] "text"`
- Add `annotations [0.05, 0.05]` to position the annotation list
- Remove `style wardley` line
- Remove the `label` keyword and any text after the target evolution number on `evolve` lines (Mermaid does not support evolve labels)
- Use ` ```mermaid ` as the code fence language identifier (not ` ```wardley-beta ` or ` ```text `)

```text
```

**Edit B** — Update "Output Contents" bullet 2 (around line 413):

```markdown
2. **Map Visualization Code**:
   - Complete Wardley Map in OnlineWardleyMaps syntax (primary)
   - URL: https://create.wardleymaps.ai
   - Instructions to paste code into create.wardleymaps.ai
   - Mermaid `wardley-beta` equivalent in collapsible `<details>` block
     with sourcing decorators (`build`/`buy`/`outsource`/`inertia`)
```

**Edit C** — Update example in "Example: UK Government Benefits Chatbot" section (around line 533). Add a Mermaid equivalent of the existing OWM example in a `<details>` block, demonstrating decorator usage:

```markdown
<details>
<summary>Mermaid Wardley Map</summary>

```mermaid
wardley-beta
title DWP Benefits Eligibility Chatbot - Procurement Strategy
size [1100, 800]

anchor Citizen [0.95, 0.63]

component Benefits Eligibility Guidance [0.92, 0.25] (build)
component Conversational Interface [0.85, 0.38] (build)
component Human Review Queue [0.82, 0.45] (build)
component GPT-4 LLM Service [0.68, 0.72] (buy)
component Benefits Rules Engine [0.65, 0.42] (build)
component Bias Testing Framework [0.62, 0.35] (build)
component GOV.UK Notify [0.55, 0.92] (buy)
component GOV.UK Design System [0.72, 0.75] (buy)
component Authentication [0.48, 0.68] (buy)
component DWP Benefits Database [0.45, 0.52] (build) (inertia)
component Cloud Hosting AWS [0.28, 0.95] (buy)
component PostgreSQL RDS [0.25, 0.92] (buy)

Citizen -> Benefits Eligibility Guidance
Benefits Eligibility Guidance -> Conversational Interface
Benefits Eligibility Guidance -> Human Review Queue
Conversational Interface -> GPT-4 LLM Service
Conversational Interface -> Benefits Rules Engine
Human Review Queue -> GOV.UK Notify
Conversational Interface -> GOV.UK Design System
Conversational Interface -> Authentication
Benefits Rules Engine -> DWP Benefits Database
Benefits Rules Engine -> Bias Testing Framework
GPT-4 LLM Service -> Cloud Hosting AWS
DWP Benefits Database -> PostgreSQL RDS
PostgreSQL RDS -> Cloud Hosting AWS

evolve GPT-4 LLM Service 0.85
evolve Benefits Rules Engine 0.68

note "HIGH-RISK AI - Human oversight mandatory" [0.35, 0.25]
note "Use GOV.UK services - do not build" [0.85, 0.92]
note "G-Cloud procurement for commodity/product" [0.75, 0.15]

annotations [0.05, 0.05]
annotation 1,[0.48, 0.45] "Build custom - competitive advantage"
```

</details>
```

**`arckit-claude/commands/wardley.value-chain.md`**:

**Edit A** — Add Mermaid subsection in the "Output Contents" section, after bullet 3 ("Value Chain Diagram" which references OWM syntax around line 309). This command has no standalone OWM syntax section — the OWM reference is inline within the output contents bullets:

```markdown
### Mermaid Value Chain Map

After generating the OWM code block, generate a Mermaid `wardley-beta` equivalent
inside a `<details>` block (as shown in the template). At the value chain stage,
no sourcing decorators are used (build/buy analysis has not been performed yet).

**Syntax differences from OWM** (apply these when translating):
- Start with `wardley-beta` keyword (not `style wardley` at end)
- Add `size [1100, 800]` after title
- Wrap note text in double quotes: `note "text" [vis, evo]`
- Remove `style wardley` line
```

**Edit B** — Update output contents to mention Mermaid block.

### 3. Guides (2 files)

**`docs/guides/wardley.md`** and **`docs/guides/wardley-value-chain.md`**:

Add a "Viewing Your Map" section (or update existing visualization guidance):

```markdown
### Viewing Your Map

**OnlineWardleyMaps** (primary): Copy the `wardley` code block and paste into
[https://create.wardleymaps.ai](https://create.wardleymaps.ai) for an interactive editor.

**Mermaid** (secondary): Expand the `<details>` block to see the Mermaid `wardley-beta`
equivalent. This will render inline in GitHub, VS Code, and other Mermaid-enabled
viewers once Mermaid ships `wardley-beta` in a stable release. The Mermaid version
includes sourcing strategy markers (build/buy/outsource/inertia) as visual decorators
on each component.
```

### 4. Reference Examples (1 file)

**`arckit-claude/skills/wardley-mapping/references/mapping-examples.md`**:

Add Mermaid equivalents of the existing worked examples. Each example gets a `wardley-beta` code block with decorators demonstrating the enhanced format. This gives the AI concrete reference examples when generating Mermaid output.

### 5. Post-Implementation

Run `python scripts/converter.py` to propagate command changes to:

- `arckit-codex/skills/` (Codex CLI)
- `arckit-opencode/commands/` (OpenCode CLI)
- `arckit-gemini/commands/` (Gemini CLI)
- `arckit-copilot/prompts/` (GitHub Copilot)

Verify that `<details>` HTML blocks survive the conversion to TOML (Gemini) and `.prompt.md` (Copilot) formats:

```bash
python scripts/converter.py && grep -l '<details>' arckit-gemini/commands/arckit/wardley*.toml
```

## Files Changed

| # | File | Change |
|---|------|--------|
| 1 | `arckit-claude/templates/wardley-map-template.md` | Add `<details>` Mermaid block after OWM |
| 2 | `.arckit/templates/wardley-map-template.md` | Mirror of #1 |
| 3 | `arckit-claude/templates/wardley-value-chain-template.md` | Add `<details>` Mermaid block (no decorators) |
| 4 | `.arckit/templates/wardley-value-chain-template.md` | Mirror of #3 |
| 5 | `arckit-claude/commands/wardley.md` | Mermaid syntax reference + decorator rules + example + output update |
| 6 | `arckit-claude/commands/wardley.value-chain.md` | Mermaid syntax reference (no decorators) + output update |
| 7 | `docs/guides/wardley.md` | Add Mermaid viewing guidance |
| 8 | `docs/guides/wardley-value-chain.md` | Add Mermaid viewing guidance |
| 9 | `arckit-claude/skills/wardley-mapping/references/mapping-examples.md` | Add Mermaid examples with decorators |

## Not Changed

- `arckit-claude/hooks/validate-wardley-math.mjs` — OWM-only validation per decision
- `arckit-claude/commands/wardley.doctrine.md` — no map code blocks
- `arckit-claude/commands/wardley.climate.md` — no map code blocks
- `arckit-claude/commands/wardley.gameplay.md` — no map code blocks
- `scripts/converter.py` — Mermaid instructions flow through existing path rewriting
- `docs/DEPENDENCY-MATRIX.md` — no new commands

## Risks and Mitigations

| Risk | Likelihood | Mitigation |
|------|-----------|------------|
| `wardley-beta` syntax changes before stable release | Medium | Keyword is `wardley-beta` (beta designation); changes will be minor. Monitor mermaid-js/mermaid releases. |
| AI generates inconsistent OWM vs Mermaid coordinates | Low | Both generated from same Component Inventory table. OWM validation hook catches table/OWM drift. |
| `<details>` HTML not preserved in Gemini TOML conversion | Low | Test converter output; Gemini TOML supports raw HTML in prompt fields. |
| Users confused by non-rendering Mermaid blocks | Medium | Clear note in `<details>` summary explaining beta status and when rendering will work. |
