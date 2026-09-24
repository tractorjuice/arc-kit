# Interactive Diagram Guide

> **Guide Origin**: Official | **ArcKit Version**: [VERSION]

`/arckit:archify` renders ArcKit's governed artefacts as **interactive, self-contained HTML diagrams** — a single file with inline SVG, dark and light themes, pan and zoom, and click-to-trace dependencies, that opens offline and makes no external requests.

---

## Purpose

ArcKit's `/arckit:diagram` produces Mermaid and PlantUML C4 as text inside a governed markdown artefact. That is portable and diff-friendly, and it stays the canonical record. But text diagrams have limits:

- **No exploration** — a static image cannot be filtered, traced or focused
- **External dependency** — Wardley Maps previously required pasting OWM code into `create.wardleymaps.ai`, which sends the map to a third-party site
- **Rendering drift** — Mermaid syntax behaviour changes between versions

`/arckit:archify` closes those gaps by delivering a **rendering** alongside the artefact. The markdown artefact remains the governed record; the HTML is a view of it.

---

## Two engines, one command

| Requested type | Engine | Availability |
|---|---|---|
| `architecture`, `workflow`, `sequence`, `dataflow`, `lifecycle` | [Archify](https://github.com/tt-a1i/archify) (third party, MIT) | Only if the user installs it |
| `wardley` | ArcKit's built-in `owm-to-html.mjs` | Always — ships with the plugin |

### Why ArcKit does not bundle Archify

Archify is an independently maintained agent skill by [tt-a1i](https://github.com/tt-a1i/archify), MIT licensed. ArcKit **detects** it rather than vendoring it:

- It is roughly 7.5MB of renderer. ArcKit's `sync-shared-assets.py` copies shared assets into ten community plugins and `converter.py` ships them to seven generated extensions, so a vendored copy would multiply many times over.
- It moves quickly (v2.17 development series). A fork would drift within weeks, and ArcKit would own the divergence.
- Its skill contract includes an update check that contacts `tt-a1i.github.io`. That is the upstream project's choice to make, not one ArcKit should silently inherit on a user's behalf.

Detection keeps upstream's release cadence and licence obligations where they belong, and lets the user decide whether to install it at all.

### Why Wardley is ArcKit's own

Archify has no Wardley diagram type, and a Wardley Map is a poor fit for its intermediate representation: Archify's five types are discrete node-graph and rail layouts, whereas a Wardley Map positions components on a **continuous two-dimensional plane** (evolution against value chain) where the coordinates carry the meaning. ArcKit already owned an OWM parser for its Mermaid conversion, so rendering the map directly was both smaller and more faithful than bending it into someone else's IR.

---

## Inputs

| Artifact | Requirement | What It Provides |
|----------|-------------|------------------|
| **WARD** (Wardley Map) | Required for `wardley` | The OWM code block that is rendered |
| **HLD** / **DIAG** / **REQ** | Recommended for `architecture` | Containers, technology choices, boundaries |
| **DLD** / **INT** | Recommended for `sequence` | Participants, ordered messages, returns |
| **DFD** / **DM** / **DPIA** | Recommended for `dataflow` | Sources, transformations, stores, PII flows |
| **SOW** / **PLAN** | Recommended for `workflow` | Stages, approval gates, owners |

The command depicts what the artefacts actually say. If there is nothing to depict, it stops rather than inventing an architecture.

---

## Usage

```text
/arckit:archify wardley 001
/arckit:archify architecture booking platform
/arckit:archify sequence login flow
```

### Installing Archify (only for the non-Wardley types)

```bash
npx skills add tt-a1i/archify -g
```

Or point ArcKit at an existing checkout:

```bash
export ARCKIT_ARCHIFY_HOME=/path/to/archify
```

Check what ArcKit can see:

```bash
node ${CLAUDE_PLUGIN_ROOT}/scripts/archify-detect.mjs --json
```

If Archify is absent, `/arckit:archify` says so plainly and offers `/arckit:diagram` instead. It never fabricates an HTML file and presents it as an Archify render.

---

## Outputs

### Wardley Maps

Rendering happens automatically as part of `/arckit:wardley` (pass `--no-html` to skip it), and can be re-run standalone:

```bash
node ${CLAUDE_PLUGIN_ROOT}/scripts/owm-to-html.mjs map.owm map.html --title "My Map" --json
```

The rendered map shows:

- **Evolution axis** — Genesis, Custom Built, Product (+rental), Commodity (+utility), with banded backgrounds
- **Value chain axis** — visible to invisible
- **Sourcing** — build, buy and outsource decisions as coloured component rings, counted in the legend
- **Evolution movement** — `evolve` targets as dashed arrows with their labels
- **Inertia** — resistance markers on components that carry them
- **Pipelines** — evolution ranges beneath their parent component
- **Annotations and notes** — numbered markers with leader lines, listed in the sidebar

Click any component to trace its dependencies; everything unrelated dims. Press `Esc` or click the background to clear. The evolution profile panel counts components per stage, which makes an over-weighted Genesis column obvious at a glance.

The `--json` receipt reports counts and **warnings**. A warning such as `Link references unknown component "X"` means the OWM source declares a dependency on a component that was never defined — usually a typo or a rename. Fix the OWM block; do not ship a map with unresolved warnings.

### Archify types

The command follows Archify's own authoring contract: write the typed JSON IR, validate, repair from the machine-readable diagnostics, then deliver. A showcase pass reports **9 checks, 0 errors, 0 warnings**, and delivery returns SHA-256 receipts for both the specification and the artefact. Those receipts are recorded in the governed markdown artefact.

Diagnostics are precise and usually carry a literal fix, for example:

```text
Label "queue message" overlaps component "api" — adjust labelDx/labelDy/labelSegment or set labelAt.
  Suggested fix: labelAt [615, 322] or labelDy +24 (below)
```

Repair from the diagnostic rather than guessing, and never delete a semantic relationship label just to force a pass.

---

## Classification and offline use

Both engines produce files that make **no external requests**: no CDN, no fonts, no telemetry. That matters for OFFICIAL-SENSITIVE work and air-gapped review, where pasting a map into `create.wardleymaps.ai` would not be acceptable. The Wardley renderer also embeds its OWM source in the page, so the map round-trips from the artefact you shipped.

Note that the Archify **skill** performs an update check when its own agent workflow runs. That is upstream behaviour in the installed skill, not in the diagrams it produces; it can be disabled with `ARCHIFY_UPDATE_CHECK_DISABLED=1`.

---

## Related Commands

| Command | Relationship |
|---------|--------------|
| `/arckit:wardley` | Creates the WARD artefact and renders its HTML automatically |
| `/arckit:diagram` | Mermaid/PlantUML companion; the fallback when Archify is absent |
| `/arckit:pages` | Publishes renders into the documentation site |
| `/arckit:hld-review` | Reviews the design the diagram depicts |

---

## Attribution

Archify is copyright (c) 2026 tt-a1i, MIT licensed, and is **not** distributed with ArcKit. Source and documentation: <https://github.com/tt-a1i/archify>. Archify itself credits `Cocoon-AI/architecture-diagram-generator` (MIT) as its basis.
