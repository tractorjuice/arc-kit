# `/arckit:graph-report` — governance metrics dashboard

A read-only multi-project dashboard. Run it when you want a portfolio view: which projects are best-governed, which have weak traceability, which are missing compliance artifacts.

## Quick start

```text
/arckit:graph-report
```

No arguments. The command always scans every working project under `projects/` (excluding `000-global`).

## What you get

A console dashboard (no file written) with four sections:

### 1. Project Comparison

One row per project:

| Column | What |
|---|---|
| **Artifacts** | Count of `ARC-*.md` documents |
| **Cross-refs** | Count of cross-reference edges originating in the project |
| **Density** | Cross-refs per artifact (a traceability proxy) |
| **Compliance readiness** | Fraction of 12 HIGH-severity doc types present |

### 2. Coverage by Category

A matrix showing each project's doc-type coverage in each ArcKit category (Discovery, Planning, Architecture, Governance, Compliance, Operations, Procurement, Research, Reporting). Each cell shows `present / total (%)`.

### 3. Compliance Readiness (HIGH-severity doc types)

For each project, lists which of these 12 HIGH-severity doc types are present and which are missing:

`TCOP, SECD, SECD-MOD, DPIA, SVCASS, RISK, TRAC, CONF, PRIN-COMP, AIPB, ATRS, JSP936`

Not every project needs all 12. UK Gov projects typically need TCOP / SECD / DPIA / SVCASS / TRAC / CONF; MOD projects add SECD-MOD / JSP936; AI-related projects add AIPB / ATRS. The dashboard surfaces gaps for the architect to decide.

### 4. Cross-Reference Density Interpretation

A legend mapping density values to qualitative meaning:

| Density | Meaning |
|---|---|
| 0.0 | Isolated artifacts, traceability broken |
| 0.0–0.5 | Sparse — most artifacts stand alone |
| 0.5–1.5 | Moderate — typical for early-stage projects |
| 1.5–3.0 | Healthy — good traceability for a mature project |
| 3.0+ | Dense — every artifact references multiple others |

Density is `edges / nodes`. Edges are extracted from `ARC-NNN-XXX-vN.M` references inside artifact bodies during the graph scan.

## When to run it

- **Portfolio review** — when you have multiple projects and need to compare them.
- **Steering committee prep** — to show which projects are governance-ready and which need attention.
- **Onboarding** — to orient a new architect to the relative maturity of each project.
- **After bulk imports** — when you've added many artifacts and want to verify traceability is intact (look at density).

## Differences from related commands

| Command | Scope | Focus |
|---|---|---|
| `/arckit:graph-report` | All projects | Cross-project comparison + compliance readiness |
| `/arckit:navigator <project>` | Single project | "What's next" recommendation |
| `/arckit:analyze <project>` | Single project | Deep governance analysis (sections, requirements, principles, risks) |
| `/arckit:health` | All projects | Point-in-time rules (stale, forgotten, orphaned) |

`graph-report` is the highest-level view; `analyze` is the deepest single-project view.

## Limitations

- **No trend data**: this is a point-in-time snapshot. Future enhancements could compare against historical manifests for delta tracking.
- **Compliance readiness is a presence check, not a quality check**: a one-paragraph DPIA counts the same as a complete DPIA. Use `/arckit:analyze` for quality signals.
- **Density doesn't measure direction**: a doc that references many others scores the same as one referenced by many. For directional traceability, use `/arckit:traceability`.
- **HIGH-severity list is fixed**: domain-specific compliance frameworks (e.g. EU AI Act community commands) aren't yet counted in the readiness score. They show up in the category matrix instead.
