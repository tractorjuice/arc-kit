---
description: Governance metrics dashboard — coverage by category, cross-reference density, compliance readiness, and project comparison across all working projects
argument-hint: ""
tags: [graph-report, metrics, governance, dashboard, comparison, graph]
effort: low
---

# Graph Report — governance metrics across all projects

You are producing a **governance metrics dashboard** for all working projects in the repo. The hook has already done all the computation — your job is to render it cleanly.

**This is a read-only diagnostic command. No files are written.**

## User Input

```text
$ARGUMENTS
```

(No arguments — graph-report always scans every working project under `projects/`, excluding `000-global`.)

---

## What This Command Does

The hook scans every working project and computes:

| Section | Meaning |
|---|---|
| **Project Comparison** | One row per project: artifact count, cross-reference count, density, compliance readiness |
| **Coverage by Category** | Per-project matrix of how many doc types are present in each category (Discovery, Planning, Architecture, Governance, Compliance, …) |
| **Compliance Readiness** | Per-project list of which HIGH-severity doc types are present and which are missing |
| **Cross-Reference Density** | Edges per artifact — a proxy for traceability strength |

The hook delivers this as a structured pre-processor block (`## Graph Report Pre-processor Complete (hook)`).

## Process

### Step 1: Read the hook output

The hook block at the top of your context contains:

- A summary line (projects scanned, total artifacts, total cross-references)
- A project comparison table
- A coverage-by-category matrix
- A per-project compliance readiness breakdown
- A density interpretation legend

If the hook block is missing (unlikely — it always fires for `/arckit:graph-report`), inform the user and stop.

### Step 2: Render the dashboard

Output to the console (no file written) using this structure:

```text
📊 ArcKit Graph Report — <N projects, M artifacts, K cross-refs>

PROJECT COMPARISON
   <render the project comparison table from the hook>

COVERAGE BY CATEGORY
   <render the category matrix>

COMPLIANCE READINESS (HIGH-severity doc types)
   <render the per-project breakdown>

DENSITY INTERPRETATION
   <render the legend>

🔎 Outliers
   - Lowest compliance readiness: <project, percentage>
   - Lowest cross-reference density: <project, density>
   - Projects missing whole categories: <list, if any>

▶ Recommended actions
   - <bullet list — for each project with <50% compliance readiness, suggest the top missing /arckit:* command>
```

### Step 3: Stop

No file is written. The output is the deliverable.

---

## Notes

- **Compliance readiness** counts the presence of these 12 HIGH-severity doc types: TCOP, SECD, SECD-MOD, DPIA, SVCASS, RISK, TRAC, CONF, PRIN-COMP, AIPB, ATRS, JSP936. Not all are required for every project — UK Gov projects need more of them than internal-only ones — but the dashboard surfaces gaps so the architect can decide.
- **Density** is `edges / nodes` per project. Higher density means better-connected artifacts. The legend in the hook output gives interpretation guidance.
- For a single-project repo the comparison table has one row — the report is still useful for category coverage and compliance readiness in that case.
- `000-global` (architecture principles) is excluded from the per-project rows but principles still inform the artifacts via cross-references in working projects.

## Related commands

- `/arckit:navigator <project>` — single-project "what's next" GPS, complementary to graph-report.
- `/arckit:analyze <project>` — deep governance analysis for one project (sections, requirements, principles, risks).
- `/arckit:health` — point-in-time health rules across all projects.
