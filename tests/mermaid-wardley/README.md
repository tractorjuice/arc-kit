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
