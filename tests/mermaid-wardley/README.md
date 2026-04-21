# Mermaid Wardley-Beta Test Suite

Validates ArcKit's generated Mermaid `wardley-beta` syntax against the official Mermaid parser. `wardley-beta` shipped in [mermaid@11.14.0](https://github.com/mermaid-js/mermaid/releases/tag/mermaid%4011.14.0) (2026-04-01), originally landed in [PR #7147](https://github.com/mermaid-js/mermaid/pull/7147).

## Setup

```bash
cd tests/mermaid-wardley
npm install
```

## Run

```bash
# Parse validation only (fast, no browser needed)
npm run validate

# SVG rendering (requires Chromium/Puppeteer)
npm run render

# Both
npm test
```

## Synthetic Fixtures

| File | Tests | Result |
|------|-------|--------|
| `01-basic-map.mmd` | Core syntax: title, size, anchor, component, links | PASS |
| `02-decorators.mmd` | Sourcing decorators: build, buy, outsource, inertia | PASS |
| `03-pipeline.mmd` | Pipeline parent/child syntax | PASS |
| `04-evolve.mmd` | Evolution arrows (no labels) | PASS |
| `05-notes-annotations.mmd` | Notes and numbered annotations | PASS |
| `06-complex-full.mmd` | Realistic 22-component map with all features | PASS |
| `07-edge-cases.mmd` | Spaces, quotes, boundary coords, 30+ components | PASS |
| `08a-08k` | New Mermaid features (market, flows, dashed, evolve labels, etc.) | ALL PASS |

## Real-World Maps

Tests 147 maps from [swardley/WARDLEY-MAP-REPOSITORY](https://github.com/swardley/WARDLEY-MAP-REPOSITORY), converted from OWM to Mermaid `wardley-beta` format.

```bash
# Clone the source maps (one-time)
git clone --depth 1 https://github.com/swardley/WARDLEY-MAP-REPOSITORY.git owm-maps

# Run real-world validation (default: 100 maps)
node test-real-maps.mjs

# All 147 maps
node test-real-maps.mjs --limit 200

# Save converted .mmd files for inspection
node test-real-maps.mjs --limit 200 --save-converted --verbose
```

**Results**: 144/147 pass (98%). 3 failures are source data errors in the original maps (typos, malformed coordinates).

## Conversion Fidelity

In addition to syntax validation, `test-fidelity.mjs` measures how much information survives the OWM → Mermaid `wardley-beta` conversion. It parses the source OWM and the converted Mermaid with the same grammar, then reports component / anchor / link retention, coordinate drift (|Δε|, |Δν|), and the pooled |Δε| distribution. Methodology is modelled on [`wardleymap_math_model/skills/wardley-map-workspace/compare_all_25.py`](https://github.com/tractorjuice/wardleymap_math_model/blob/main/skills/wardley-map-workspace/compare_all_25.py), adapted for deterministic conversion rather than stochastic skill generation.

```bash
# Quick run — 10 maps
node test-fidelity.mjs --limit 10

# All 147 maps
npm run fidelity

# Save per-map diff JSON for maps with any loss
node test-fidelity.mjs --limit 200 --save-diffs
```

**Current results (all 147 maps, 4905 components, 5172 links)**:

| Metric | Result |
|--------|--------|
| Component retention | **100%** (4905 / 4905) |
| Anchor retention | **100%** (43 / 43) |
| Link retention | **100%** (5172 / 5172) |
| `\|Δε\|` across all matched pairs | **0.0 exactly** (evolution coords round-trip losslessly) |
| Mean `\|Δν\|` | 0.008 |
| ν-bias (signed) | +0.007 |
| Lossless-placement rate | 55% |

Every component name, anchor, link, and evolution coordinate round-trips perfectly. The mean `|Δν|` of 0.008 is **grammar-level**, not a converter bug: Mermaid `wardley-beta`'s pipeline-block syntax uses a 1-D `[evo]` for children which forces them to inherit parent visibility. OWM source files occasionally place children at slightly different visibility to their parent; that offset is lost in projection. No way to preserve it without widening the Mermaid grammar. Lossless-placement rate (55%) reflects how many components had exact ν preserved — the other 45% are pipeline children.

Per-map JSON summary is written to `output/fidelity-summary.json`.

## Mermaid Version

Pinned to the official release:

```json
"mermaid": "^11.14.0"
```

`wardley-beta` shipped natively in 11.14.0 — no pre-release builds required.

## Troubleshooting

**Puppeteer fails in codespace**: Install missing deps:

```bash
sudo apt-get install -y libgbm1 libnss3 libatk-bridge2.0-0 libdrm2 libxkbcommon0 libxcomposite1 libxdamage1 libxrandr2 libgbm-dev
```
