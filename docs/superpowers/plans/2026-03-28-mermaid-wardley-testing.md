# Mermaid Wardley-Beta Testing Suite Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create a standalone test suite that validates ArcKit's generated Mermaid `wardley-beta` syntax against the real Mermaid parser (PR #7147) and renders SVGs for visual inspection.

**Architecture:** A `tests/mermaid-wardley/` directory with its own `package.json`, 8 `.mmd` fixture files covering all syntax features, a `validate.mjs` script that runs `mermaid.parse()` on each fixture, and a `render.mjs` script that shells out to `mmdc` for SVG rendering. No test framework — just Node.js scripts.

**Tech Stack:** Node.js (v24), mermaid (pre-release from PR #7147), @mermaid-js/mermaid-cli (mmdc + Puppeteer)

**Spec:** `docs/superpowers/specs/2026-03-28-mermaid-wardley-testing-design.md`

---

## File Structure

| File | Responsibility |
|------|---------------|
| `tests/mermaid-wardley/package.json` | Dependencies: mermaid (PR build), @mermaid-js/mermaid-cli |
| `tests/mermaid-wardley/validate.mjs` | Parse validation — imports mermaid, calls `parse()` on each fixture |
| `tests/mermaid-wardley/render.mjs` | SVG rendering — shells out to mmdc for each fixture |
| `tests/mermaid-wardley/puppeteer-config.json` | Headless Chrome args for codespace |
| `tests/mermaid-wardley/fixtures/01-basic-map.mmd` | Core syntax: title, size, anchor, component, links |
| `tests/mermaid-wardley/fixtures/02-decorators.mmd` | Sourcing decorators: build, buy, outsource, inertia |
| `tests/mermaid-wardley/fixtures/03-pipeline.mmd` | Pipeline parent/child syntax |
| `tests/mermaid-wardley/fixtures/04-evolve.mmd` | Evolution arrows (no labels) |
| `tests/mermaid-wardley/fixtures/05-notes-annotations.mmd` | Notes and numbered annotations |
| `tests/mermaid-wardley/fixtures/06-complex-full.mmd` | Realistic 20+ component map with all features |
| `tests/mermaid-wardley/fixtures/07-edge-cases.mmd` | Names with spaces, quotes, boundary coords, 30+ components |
| `tests/mermaid-wardley/fixtures/08-new-features.mmd` | Exploratory: market, custom evolution, dashed arrows, flows, accelerators |
| `tests/mermaid-wardley/output/.gitkeep` | Empty dir for rendered SVGs |
| `tests/mermaid-wardley/.gitignore` | Ignore node_modules/ and output/*.svg |
| `tests/mermaid-wardley/README.md` | How to install, run, and interpret results |

---

### Task 1: Project Scaffolding

**Files:**
- Create: `tests/mermaid-wardley/package.json`
- Create: `tests/mermaid-wardley/puppeteer-config.json`
- Create: `tests/mermaid-wardley/.gitignore`
- Create: `tests/mermaid-wardley/output/.gitkeep`

- [ ] **Step 1: Create `package.json`**

```json
{
  "name": "arckit-mermaid-wardley-tests",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "description": "Validates ArcKit's generated Mermaid wardley-beta syntax against the real Mermaid parser",
  "scripts": {
    "validate": "node validate.mjs",
    "render": "node render.mjs",
    "test": "node validate.mjs && node render.mjs"
  },
  "dependencies": {
    "mermaid": "https://pkg.pr.new/mermaid@7147",
    "@mermaid-js/mermaid-cli": "^11.4.0"
  }
}
```

- [ ] **Step 2: Create `puppeteer-config.json`**

```json
{
  "executablePath": "",
  "args": ["--no-sandbox", "--disable-setuid-sandbox"]
}
```

> Note: `executablePath` empty string means mmdc will use its bundled Chromium. If that fails, set it to the system Chromium path.

- [ ] **Step 3: Create `.gitignore`**

```
node_modules/
output/*.svg
output/*.png
```

- [ ] **Step 4: Create `output/.gitkeep`**

Empty file — ensures the `output/` directory is tracked by git even though SVGs are gitignored.

- [ ] **Step 5: Install dependencies**

Run:
```bash
cd tests/mermaid-wardley && npm install
```

Expected: `node_modules/` created, mermaid installed from PR build, mmdc installed with Puppeteer/Chromium.

If the `pkg.pr.new` URL fails (build expired), fall back to:
```bash
npm install mermaid@next @mermaid-js/mermaid-cli@latest
```

- [ ] **Step 6: Verify mermaid import works**

Run:
```bash
cd tests/mermaid-wardley && node -e "import('mermaid').then(m => console.log('mermaid version:', m.default.mermaidAPI ? 'ok' : 'ok (default)'))"
```

Expected: Prints `mermaid version: ok` without errors.

- [ ] **Step 7: Commit**

```bash
git add tests/mermaid-wardley/package.json tests/mermaid-wardley/package-lock.json tests/mermaid-wardley/puppeteer-config.json tests/mermaid-wardley/.gitignore tests/mermaid-wardley/output/.gitkeep
git commit -m "feat: scaffold mermaid wardley-beta test suite"
```

---

### Task 2: Fixture 01 — Basic Map

**Files:**
- Create: `tests/mermaid-wardley/fixtures/01-basic-map.mmd`

- [ ] **Step 1: Create `01-basic-map.mmd`**

This tests the core syntax every Wardley command generates: keyword, title, size, anchors, components with coordinates, and dependency links.

```
wardley-beta
title Digital Service Platform
size [1100, 800]

anchor Public Users [0.95, 0.63]
anchor Internal Staff [0.90, 0.35]

component Web Application [0.82, 0.58]
component API Gateway [0.70, 0.62]
component Authentication [0.65, 0.72]
component Database [0.50, 0.78]
component Hosting [0.35, 0.90]
component Monitoring [0.40, 0.82]
component Logging [0.30, 0.85]

Public Users -> Web Application
Internal Staff -> Web Application
Web Application -> API Gateway
API Gateway -> Authentication
API Gateway -> Database
Web Application -> Monitoring
Monitoring -> Logging
Database -> Hosting
Authentication -> Hosting
```

- [ ] **Step 2: Commit**

```bash
git add tests/mermaid-wardley/fixtures/01-basic-map.mmd
git commit -m "test: add basic map fixture for mermaid wardley-beta"
```

---

### Task 3: Fixture 02 — Decorators

**Files:**
- Create: `tests/mermaid-wardley/fixtures/02-decorators.mmd`

- [ ] **Step 1: Create `02-decorators.mmd`**

Tests all sourcing strategy decorators individually and in combination with `(inertia)`.

```
wardley-beta
title Sourcing Strategy Map
size [1100, 800]

anchor User Need [0.95, 0.50]

component Custom ML Model [0.80, 0.20] (build)
component Bespoke Integration [0.70, 0.35] (build) (inertia)
component CRM Platform [0.65, 0.60] (buy)
component Email Service [0.55, 0.72] (buy) (inertia)
component Managed Hosting [0.45, 0.65] (outsource)
component Payroll Processing [0.40, 0.80] (outsource) (inertia)
component Cloud Compute [0.30, 0.92]
component DNS [0.20, 0.95]

User Need -> Custom ML Model
User Need -> CRM Platform
Custom ML Model -> Bespoke Integration
CRM Platform -> Email Service
CRM Platform -> Managed Hosting
Managed Hosting -> Cloud Compute
Email Service -> DNS
Payroll Processing -> Cloud Compute
```

- [ ] **Step 2: Commit**

```bash
git add tests/mermaid-wardley/fixtures/02-decorators.mmd
git commit -m "test: add decorators fixture for mermaid wardley-beta"
```

---

### Task 4: Fixture 03 — Pipelines

**Files:**
- Create: `tests/mermaid-wardley/fixtures/03-pipeline.mmd`

- [ ] **Step 1: Create `03-pipeline.mmd`**

Tests the pipeline parent/child syntax. Pipeline children use a single coordinate (evolution only) and must be quoted.

```
wardley-beta
title Pipeline Components Map
size [1100, 800]

anchor Customer [0.95, 0.55]

component Customer Service [0.82, 0.45]
component Data Storage [0.50, 0.70]
component Compute [0.35, 0.85]

pipeline Customer Service {
  component "Phone Support" [0.20]
  component "Email Support" [0.45]
  component "Chat Bot" [0.65]
  component "Self Service Portal" [0.80]
}

pipeline Data Storage {
  component "Legacy SQL" [0.55]
  component "Cloud Database" [0.78]
  component "Object Storage" [0.90]
}

Customer -> Customer Service
Customer Service -> Data Storage
Data Storage -> Compute
```

- [ ] **Step 2: Commit**

```bash
git add tests/mermaid-wardley/fixtures/03-pipeline.mmd
git commit -m "test: add pipeline fixture for mermaid wardley-beta"
```

---

### Task 5: Fixture 04 — Evolve

**Files:**
- Create: `tests/mermaid-wardley/fixtures/04-evolve.mmd`

- [ ] **Step 1: Create `04-evolve.mmd`**

Tests evolution arrows. Our commands strip the `label` keyword from evolve lines (Mermaid doesn't support it). This fixture confirms the bare `evolve Name target` syntax works.

```
wardley-beta
title Evolution Movement Map
size [1100, 800]

anchor User [0.95, 0.50]

component Identity Service [0.80, 0.30]
component Payment Processing [0.70, 0.45]
component Notification System [0.60, 0.40]
component Data Analytics [0.50, 0.25]
component Content Delivery [0.45, 0.60]

User -> Identity Service
User -> Payment Processing
Payment Processing -> Notification System
Identity Service -> Data Analytics
Payment Processing -> Content Delivery

evolve Identity Service 0.62
evolve Payment Processing 0.70
evolve Data Analytics 0.55
evolve Notification System 0.75
```

- [ ] **Step 2: Commit**

```bash
git add tests/mermaid-wardley/fixtures/04-evolve.mmd
git commit -m "test: add evolve fixture for mermaid wardley-beta"
```

---

### Task 6: Fixture 05 — Notes and Annotations

**Files:**
- Create: `tests/mermaid-wardley/fixtures/05-notes-annotations.mmd`

- [ ] **Step 1: Create `05-notes-annotations.mmd`**

Tests note syntax (quoted text required) and the two-part annotation system (annotation index position + numbered annotations at specific coordinates).

```
wardley-beta
title Notes and Annotations Map
size [1100, 800]

anchor End User [0.95, 0.55]

component Web Portal [0.82, 0.60]
component API Layer [0.70, 0.58]
component Auth Service [0.60, 0.72]
component Database [0.45, 0.80]

End User -> Web Portal
Web Portal -> API Layer
API Layer -> Auth Service
API Layer -> Database

note "This service is under review for replacement" [0.62, 0.78]
note "Planned migration to managed service Q3" [0.47, 0.86]

annotations [0.05, 0.05]
annotation 1,[0.83, 0.65] "Primary user entry point"
annotation 2,[0.71, 0.63] "Rate limiting applied here"
annotation 3,[0.46, 0.85] "GDPR compliance required"
```

- [ ] **Step 2: Commit**

```bash
git add tests/mermaid-wardley/fixtures/05-notes-annotations.mmd
git commit -m "test: add notes and annotations fixture for mermaid wardley-beta"
```

---

### Task 7: Fixture 06 — Complex Full Map

**Files:**
- Create: `tests/mermaid-wardley/fixtures/06-complex-full.mmd`

- [ ] **Step 1: Create `06-complex-full.mmd`**

A realistic 22-component map combining all features our commands generate. Modelled on a UK Government digital service similar to what `/arckit.wardley` actually produces.

```
wardley-beta
title NHS Appointment Booking Service
size [1100, 800]

anchor Citizens [0.97, 0.63]
anchor NHS Staff [0.93, 0.35]

component Appointment Booking [0.85, 0.55] (build)
component Patient Record Access [0.82, 0.48] (build)
component GP Surgery Integration [0.78, 0.42] (build) (inertia)
component Identity Verification [0.75, 0.68] (buy)
component NHS Login [0.72, 0.72] (buy)
component Notification Service [0.68, 0.62] (buy)
component SMS Gateway [0.55, 0.82] (outsource)
component Email Delivery [0.52, 0.85] (outsource)
component Scheduling Engine [0.65, 0.38] (build)
component Calendar Service [0.58, 0.55] (buy)
component Waiting List Manager [0.60, 0.30] (build) (inertia)
component Clinical Data Store [0.48, 0.45] (build) (inertia)
component Audit Logging [0.42, 0.78] (buy)
component API Gateway [0.70, 0.70] (buy)
component Content Delivery Network [0.30, 0.92]
component Cloud Hosting [0.25, 0.95]
component DNS [0.20, 0.98]
component Database Service [0.35, 0.88]
component Object Storage [0.28, 0.90]
component Monitoring [0.38, 0.82] (buy)
component Vulnerability Scanning [0.32, 0.75] (buy)
component Penetration Testing [0.34, 0.28] (outsource)

Citizens -> Appointment Booking
Citizens -> Patient Record Access
NHS Staff -> GP Surgery Integration
NHS Staff -> Patient Record Access
Appointment Booking -> Identity Verification
Appointment Booking -> Scheduling Engine
Appointment Booking -> Notification Service
Appointment Booking -> API Gateway
Patient Record Access -> NHS Login
Patient Record Access -> Clinical Data Store
GP Surgery Integration -> Scheduling Engine
GP Surgery Integration -> Clinical Data Store
Identity Verification -> NHS Login
Notification Service -> SMS Gateway
Notification Service -> Email Delivery
Scheduling Engine -> Calendar Service
Scheduling Engine -> Waiting List Manager
Calendar Service -> Database Service
Clinical Data Store -> Database Service
Clinical Data Store -> Object Storage
API Gateway -> Cloud Hosting
SMS Gateway -> Cloud Hosting
Email Delivery -> Cloud Hosting
Cloud Hosting -> Content Delivery Network
Content Delivery Network -> DNS
Database Service -> Cloud Hosting
Monitoring -> Cloud Hosting
Audit Logging -> Database Service
Vulnerability Scanning -> Cloud Hosting
Penetration Testing -> Vulnerability Scanning

pipeline Notification Service {
  component "SMS Alerts" [0.55]
  component "Email Alerts" [0.70]
  component "Push Notifications" [0.40]
}

evolve GP Surgery Integration 0.65
evolve Waiting List Manager 0.55
evolve Clinical Data Store 0.68
evolve Scheduling Engine 0.60

note "NHS Digital mandate: NHS Login required for citizen identity" [0.74, 0.76]
note "Legacy system - migration planned for Q2" [0.62, 0.25]

annotations [0.05, 0.05]
annotation 1,[0.86, 0.60] "GDS Service Standard applies"
annotation 2,[0.79, 0.47] "HL7 FHIR integration required"
annotation 3,[0.49, 0.50] "DSPT compliance - annual review"
annotation 4,[0.33, 0.80] "CHECK penetration testing"
annotation 5,[0.26, 0.96] "G-Cloud 14 framework"
```

- [ ] **Step 2: Commit**

```bash
git add tests/mermaid-wardley/fixtures/06-complex-full.mmd
git commit -m "test: add complex full map fixture for mermaid wardley-beta"
```

---

### Task 8: Fixture 07 — Edge Cases

**Files:**
- Create: `tests/mermaid-wardley/fixtures/07-edge-cases.mmd`

- [ ] **Step 1: Create `07-edge-cases.mmd`**

Tests grammar edge cases: unquoted names with spaces, quoted names, boundary coordinates (0.00/1.00), high component count, deep dependency chains, and decimal precision.

```
wardley-beta
title Edge Case Stress Test
size [1100, 800]

anchor Primary End User [0.97, 0.50]
anchor "Secondary User Group" [0.95, 0.40]

component "Component With Quotes" [0.90, 0.60]
component Simple [1.00, 0.50]
component Bottom Left [0.00, 0.00]
component Top Right [1.00, 1.00]
component Mid Point [0.50, 0.50]
component Precision Test A [0.33, 0.67]
component Precision Test B [0.01, 0.99]
component Precision Test C [0.99, 0.01]
component Component Alpha [0.85, 0.20]
component Component Beta [0.80, 0.25]
component Component Gamma [0.75, 0.30]
component Component Delta [0.70, 0.35]
component Component Epsilon [0.65, 0.40]
component Component Zeta [0.60, 0.45]
component Component Eta [0.55, 0.50]
component Component Theta [0.50, 0.55]
component Component Iota [0.45, 0.60]
component Component Kappa [0.40, 0.65]
component Component Lambda [0.35, 0.70]
component Component Mu [0.30, 0.75]
component Component Nu [0.25, 0.80]
component Component Xi [0.20, 0.85]
component Component Omicron [0.15, 0.90]
component Component Pi [0.10, 0.95]
component Deep Dep One [0.88, 0.15]
component Deep Dep Two [0.83, 0.18]
component Deep Dep Three [0.78, 0.22]
component Deep Dep Four [0.73, 0.26]
component Deep Dep Five [0.68, 0.30]
component Deep Dep Six [0.63, 0.34]

Primary End User -> "Component With Quotes"
"Secondary User Group" -> Simple
"Component With Quotes" -> Component Alpha
Component Alpha -> Component Beta
Component Beta -> Component Gamma
Component Gamma -> Component Delta
Component Delta -> Component Epsilon
Component Epsilon -> Component Zeta
Component Zeta -> Component Eta
Component Eta -> Component Theta
Component Theta -> Component Iota
Component Iota -> Component Kappa
Component Kappa -> Component Lambda
Component Lambda -> Component Mu
Component Mu -> Component Nu
Component Nu -> Component Xi
Component Xi -> Component Omicron
Component Omicron -> Component Pi

Deep Dep One -> Deep Dep Two
Deep Dep Two -> Deep Dep Three
Deep Dep Three -> Deep Dep Four
Deep Dep Four -> Deep Dep Five
Deep Dep Five -> Deep Dep Six
Primary End User -> Deep Dep One
```

- [ ] **Step 2: Commit**

```bash
git add tests/mermaid-wardley/fixtures/07-edge-cases.mmd
git commit -m "test: add edge cases fixture for mermaid wardley-beta"
```

---

### Task 9: Fixture 08 — New Features (Exploratory)

**Files:**
- Create: `tests/mermaid-wardley/fixtures/08-new-features.mmd`

- [ ] **Step 1: Create `08-new-features.mmd`**

Tests Mermaid features ArcKit doesn't yet generate. Some may fail — that's expected and informative. Each feature is labelled with a comment for easy identification.

```
wardley-beta
title New Features Exploration
size [1100, 800]

# Custom evolution stage labels
evolution Genesis -> Custom Built -> Product -> Commodity

anchor User [0.95, 0.55]

# (market) decorator
component Market Component [0.80, 0.70] (market)

# Standard decorators for reference
component Build Thing [0.75, 0.20] (build)
component Buy Thing [0.70, 0.60] (buy)

# Label offset for positioning
component Offset Label Test [0.65, 0.50] label [-20, 10]

# Dashed arrow (weak dependency)
User -> Market Component
Market Component -.-> Build Thing

# Long arrow
Build Thing --> Buy Thing

# Flow forward (arrow at target)
Buy Thing +> Offset Label Test

# Flow backward (arrow at source)
Offset Label Test +< Build Thing

# Bidirectional flow
Market Component +<> Buy Thing

# Labeled flow
Build Thing +'data feed'> Market Component

# Link annotation (semicolon syntax)
User -> Buy Thing; primary procurement path

# Evolve
evolve Build Thing 0.45

# Accelerator and deaccelerator
accelerator "Cloud Migration" [0.55, 0.80]
deaccelerator "Regulatory Compliance" [0.60, 0.30]

# Note
note "Testing all new Mermaid features" [0.40, 0.50]

# Annotations
annotations [0.05, 0.05]
annotation 1,[0.81, 0.75] "Market sourcing strategy"
```

- [ ] **Step 2: Commit**

```bash
git add tests/mermaid-wardley/fixtures/08-new-features.mmd
git commit -m "test: add new features exploration fixture for mermaid wardley-beta"
```

---

### Task 10: Validation Script

**Files:**
- Create: `tests/mermaid-wardley/validate.mjs`

- [ ] **Step 1: Create `validate.mjs`**

```javascript
#!/usr/bin/env node
/**
 * Mermaid Wardley-Beta Syntax Validator
 *
 * Imports mermaid, iterates over all .mmd fixtures, and calls mermaid.parse()
 * on each one. Reports pass/fail with error details.
 *
 * Usage: node validate.mjs
 * Exit code: 0 if all pass, 1 if any fail
 */

import { readFileSync, readdirSync } from 'node:fs';
import { join, basename } from 'node:path';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';
import mermaid from 'mermaid';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const fixturesDir = join(__dirname, 'fixtures');

// ANSI colors
const GREEN = '\x1b[32m';
const RED = '\x1b[31m';
const YELLOW = '\x1b[33m';
const RESET = '\x1b[0m';
const BOLD = '\x1b[1m';

async function main() {
  // Initialize mermaid (required before parse)
  mermaid.initialize({
    startOnLoad: false,
    suppressErrors: false,
  });

  // Collect .mmd files sorted by name
  const files = readdirSync(fixturesDir)
    .filter(f => f.endsWith('.mmd'))
    .sort();

  if (files.length === 0) {
    console.log(`${YELLOW}No .mmd fixtures found in ${fixturesDir}${RESET}`);
    process.exit(0);
  }

  console.log(`${BOLD}Mermaid Wardley-Beta Syntax Validation${RESET}`);
  console.log(`${'='.repeat(50)}`);
  console.log(`Found ${files.length} fixtures\n`);

  let passed = 0;
  let failed = 0;
  const failures = [];

  for (const file of files) {
    const filePath = join(fixturesDir, file);
    const content = readFileSync(filePath, 'utf8');
    const name = basename(file, '.mmd');

    try {
      await mermaid.parse(content);
      console.log(`  ${GREEN}PASS${RESET}  ${name}`);
      passed++;
    } catch (err) {
      console.log(`  ${RED}FAIL${RESET}  ${name}`);
      const msg = err.message || String(err);
      // Extract line info if available
      const lineMatch = msg.match(/line\s*(\d+)/i);
      if (lineMatch) {
        console.log(`        Line ${lineMatch[1]}: ${msg.split('\n')[0]}`);
      } else {
        console.log(`        ${msg.split('\n')[0]}`);
      }
      failed++;
      failures.push({ name, error: msg });
    }
  }

  console.log(`\n${'='.repeat(50)}`);
  console.log(`${BOLD}Results: ${passed}/${files.length} passed${RESET}`);
  if (failed > 0) {
    console.log(`${RED}${failed} fixture(s) failed${RESET}\n`);
    for (const f of failures) {
      console.log(`${RED}--- ${f.name} ---${RESET}`);
      console.log(f.error);
      console.log();
    }
  } else {
    console.log(`${GREEN}All fixtures passed!${RESET}`);
  }

  process.exit(failed > 0 ? 1 : 0);
}

main();
```

- [ ] **Step 2: Verify script runs (will need fixtures from previous tasks)**

Run:
```bash
cd tests/mermaid-wardley && node validate.mjs
```

Expected: Runs against all 8 fixtures. Fixtures 01-07 should all PASS. Fixture 08 may have mixed results depending on which new features the parser accepts.

- [ ] **Step 3: Commit**

```bash
git add tests/mermaid-wardley/validate.mjs
git commit -m "feat: add mermaid wardley-beta validation script"
```

---

### Task 11: Render Script

**Files:**
- Create: `tests/mermaid-wardley/render.mjs`

- [ ] **Step 1: Create `render.mjs`**

```javascript
#!/usr/bin/env node
/**
 * Mermaid Wardley-Beta SVG Renderer
 *
 * Uses @mermaid-js/mermaid-cli (mmdc) to render each .mmd fixture to SVG.
 * SVGs are written to the output/ directory for visual inspection.
 *
 * Usage: node render.mjs
 * Exit code: 0 if all render, 1 if any fail
 */

import { readdirSync, mkdirSync, statSync } from 'node:fs';
import { join, basename } from 'node:path';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const fixturesDir = join(__dirname, 'fixtures');
const outputDir = join(__dirname, 'output');
const puppeteerConfig = join(__dirname, 'puppeteer-config.json');

// ANSI colors
const GREEN = '\x1b[32m';
const RED = '\x1b[31m';
const YELLOW = '\x1b[33m';
const RESET = '\x1b[0m';
const BOLD = '\x1b[1m';
const DIM = '\x1b[2m';

function fileSize(path) {
  try {
    const stat = statSync(path);
    const kb = (stat.size / 1024).toFixed(1);
    return `${kb} KB`;
  } catch {
    return 'unknown size';
  }
}

function findMmdc() {
  // mmdc is in node_modules/.bin/
  const localMmdc = join(__dirname, 'node_modules', '.bin', 'mmdc');
  try {
    statSync(localMmdc);
    return localMmdc;
  } catch {
    // Fall back to global
    return 'mmdc';
  }
}

async function main() {
  // Ensure output directory exists
  mkdirSync(outputDir, { recursive: true });

  const mmdc = findMmdc();

  // Collect .mmd files sorted by name
  const files = readdirSync(fixturesDir)
    .filter(f => f.endsWith('.mmd'))
    .sort();

  if (files.length === 0) {
    console.log(`${YELLOW}No .mmd fixtures found in ${fixturesDir}${RESET}`);
    process.exit(0);
  }

  console.log(`${BOLD}Mermaid Wardley-Beta SVG Renderer${RESET}`);
  console.log(`${'='.repeat(50)}`);
  console.log(`Found ${files.length} fixtures`);
  console.log(`Output: ${outputDir}\n`);

  let rendered = 0;
  let failed = 0;
  const failures = [];

  for (const file of files) {
    const inputPath = join(fixturesDir, file);
    const name = basename(file, '.mmd');
    const outputPath = join(outputDir, `${name}.svg`);

    try {
      await execFileAsync(mmdc, [
        '-i', inputPath,
        '-o', outputPath,
        '-p', puppeteerConfig,
        '-b', 'transparent',
      ], { timeout: 30000 });

      const size = fileSize(outputPath);
      console.log(`  ${GREEN}RENDERED${RESET}  ${name}  ${DIM}(${size})${RESET}`);
      rendered++;
    } catch (err) {
      const msg = err.stderr || err.message || String(err);
      console.log(`  ${RED}FAILED${RESET}    ${name}`);
      console.log(`            ${msg.split('\n')[0]}`);
      failed++;
      failures.push({ name, error: msg });
    }
  }

  console.log(`\n${'='.repeat(50)}`);
  console.log(`${BOLD}Results: ${rendered}/${files.length} rendered${RESET}`);
  if (failed > 0) {
    console.log(`${RED}${failed} fixture(s) failed to render${RESET}\n`);
    for (const f of failures) {
      console.log(`${RED}--- ${f.name} ---${RESET}`);
      console.log(f.error);
      console.log();
    }
  } else {
    console.log(`${GREEN}All fixtures rendered successfully!${RESET}`);
    console.log(`\nSVGs available in: ${outputDir}`);
  }

  process.exit(failed > 0 ? 1 : 0);
}

main();
```

- [ ] **Step 2: Verify script runs**

Run:
```bash
cd tests/mermaid-wardley && node render.mjs
```

Expected: Each fixture produces an SVG in `output/`. Reports file sizes. May fail if Puppeteer/Chromium isn't available — that's documented as a known risk. Parse validation (Task 10) is the primary test; rendering is supplementary.

- [ ] **Step 3: Commit**

```bash
git add tests/mermaid-wardley/render.mjs
git commit -m "feat: add mermaid wardley-beta SVG render script"
```

---

### Task 12: README

**Files:**
- Create: `tests/mermaid-wardley/README.md`

- [ ] **Step 1: Create `README.md`**

```markdown
# Mermaid Wardley-Beta Test Suite

Validates ArcKit's generated Mermaid `wardley-beta` syntax against the real Mermaid parser from [PR #7147](https://github.com/mermaid-js/mermaid/pull/7147).

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

## Fixtures

| File | Tests | Expected |
|------|-------|----------|
| `01-basic-map.mmd` | Core syntax: title, size, anchor, component, links | PASS |
| `02-decorators.mmd` | Sourcing decorators: build, buy, outsource, inertia | PASS |
| `03-pipeline.mmd` | Pipeline parent/child syntax | PASS |
| `04-evolve.mmd` | Evolution arrows (no labels) | PASS |
| `05-notes-annotations.mmd` | Notes and numbered annotations | PASS |
| `06-complex-full.mmd` | Realistic 22-component map with all features | PASS |
| `07-edge-cases.mmd` | Spaces, quotes, boundary coords, 30+ components | PASS |
| `08-new-features.mmd` | Exploratory: new Mermaid features not yet in ArcKit | Mixed |

## Mermaid Version

Currently uses the pre-release build from PR #7147:

```
"mermaid": "https://pkg.pr.new/mermaid@7147"
```

Once the next Mermaid minor release ships (11.14.0+), update to `mermaid@latest`.

## Troubleshooting

**Puppeteer fails in codespace**: Install missing deps:

```bash
sudo apt-get install -y libgbm1 libnss3 libatk-bridge2.0-0 libdrm2 libxkbcommon0 libxcomposite1 libxdamage1 libxrandr2 libgbm-dev
```

**pkg.pr.new URL expired**: Switch to `mermaid@next` or `mermaid@latest` if the PR build is no longer available.
```

- [ ] **Step 2: Commit**

```bash
git add tests/mermaid-wardley/README.md
git commit -m "docs: add README for mermaid wardley-beta test suite"
```

---

### Task 13: Run Full Validation and Document Results

- [ ] **Step 1: Run parse validation**

Run:
```bash
cd tests/mermaid-wardley && node validate.mjs
```

Document which fixtures pass and which fail. If any of fixtures 01-07 fail, that indicates a syntax issue in our commands/templates that needs fixing.

- [ ] **Step 2: Run SVG rendering**

Run:
```bash
cd tests/mermaid-wardley && node render.mjs
```

Document rendering results and file sizes. If Puppeteer setup fails, document the error and note that parse validation is the primary test.

- [ ] **Step 3: Inspect rendered SVGs**

Open each SVG in `output/` and verify:
- Components appear at roughly correct positions
- Links connect the right components
- Decorators are visible
- Pipeline boxes contain children
- Evolve arrows show movement
- Notes and annotations are readable

- [ ] **Step 4: Document findings**

If any syntax issues are found in fixtures 01-07, document them as bugs to fix in our Wardley commands.

For fixture 08, document which new features work and which don't — this informs which features we can adopt.

- [ ] **Step 5: Final commit**

```bash
git add -A tests/mermaid-wardley/
git commit -m "test: complete mermaid wardley-beta validation suite"
```
