# Health Check Guide

> **Guide Origin**: Official | **ArcKit Version**: [VERSION]

`/arckit.health` scans all ArcKit projects for stale research, forgotten ADRs, unresolved review conditions, orphaned artifacts, missing traceability, and version drift -- reporting findings to the console without creating a file.

---

## Purpose

Architecture governance produces dozens of artifacts over weeks and months. Without regular health checks, projects accumulate governance debt:

- **Stale research** -- vendor pricing and market analysis older than 6 months leads to unreliable procurement decisions
- **Forgotten ADRs** -- decisions stuck in "Proposed" status create architectural ambiguity
- **Unresolved conditions** -- design reviews approved with conditions that are never formally resolved
- **Orphaned requirements** -- requirements not referenced by any ADR, lacking governance coverage
- **Missing traceability** -- ADRs without requirement references reduce audit confidence
- **Version drift** -- multiple artifact versions where the latest has gone stale
- **Unincorporated external files** -- new external documents not yet reflected in architecture artifacts

The `/arckit.health` command **performs a diagnostic scan** that:

- Applies seven detection rules across all projects and artifacts
- Assigns severity levels (HIGH, MEDIUM, LOW) to each finding
- Provides specific remediation actions for every issue
- Writes `docs/health.json` for dashboard integration with `/arckit.pages`
- Runs as a lightweight, repeatable check suitable for daily or weekly use

---

## Inputs

| Artifact | Requirement | What It Provides |
|----------|-------------|------------------|
| Any ARC-* artifacts | Required (at least one) | Artifacts to scan for governance health issues |

> **Note**: This command scans existing artifacts -- it does not require specific artifact types. The more artifacts present, the more comprehensive the health check. If no `projects/` directory or ARC-* artifacts exist, the command reports an error with guidance.

---

## Command

```bash
/arckit.health
```

### Arguments

| Argument | Required | Default | Description |
|----------|----------|---------|-------------|
| PROJECT | No | All projects | Restrict scan to a single project (e.g., `001-payment-gateway`) |
| SEVERITY | No | LOW | Minimum severity to report: `HIGH`, `MEDIUM`, or `LOW` |
| SINCE | No | Today | Override staleness baseline date in `YYYY-MM-DD` format |

```bash
# Scan a specific project
/arckit.health PROJECT=001-payment-gateway

# Show only high-severity issues
/arckit.health SEVERITY=HIGH

# Check what will be stale by a future date
/arckit.health SINCE=2026-06-01
```

Outputs: Console only (no file created). Also writes `docs/health.json` for dashboard integration.

---

## Detection Rules

| ID | Rule | Severity | Threshold |
|----|------|----------|-----------|
| STALE-RSCH | Stale Research | HIGH | Research documents with last modified date > 6 months old |
| FORGOTTEN-ADR | Forgotten ADR | HIGH | ADR with "Proposed" status for > 30 days with no review activity |
| UNRESOLVED-COND | Unresolved Conditions | HIGH | Review with "APPROVED WITH CONDITIONS" where conditions lack resolution evidence |
| STALE-EXT | Unincorporated External Files | HIGH | External file in `external/` newer than all ARC-* artifacts in the same project |
| ORPHAN-REQ | Orphaned Requirements | MEDIUM | Requirements not referenced by any ADR in the same project |
| MISSING-TRACE | Missing Traceability | MEDIUM | ADR documents that do not reference any requirement ID |
| VERSION-DRIFT | Version Drift | LOW | Multiple versions of the same artifact type where the latest is > 3 months old |

---

## Workflow Position

The health check is a utility command that sits alongside the main workflow, providing ongoing governance monitoring:

```text
┌──────────────────────────────────────────┐
│         Any artifact creation            │
│  (requirements, ADRs, research, etc.)    │
└────────────────────┬─────────────────────┘
                     │
                     ▼
          ┌─────────────────────┐
          │   /arckit.health    │  (run periodically)
          └──────────┬──────────┘
                     │
        ┌────────────┼────────────────┐
        ▼            ▼                ▼
 ┌────────────┐ ┌──────────┐  ┌──────────────┐
 │  /arckit   │ │ /arckit  │  │   /arckit    │
 │  .research │ │ .adr     │  │.traceability │
 │ (refresh)  │ │ (review) │  │   (fix)      │
 └────────────┘ └──────────┘  └──────────────┘
```

**Best Practice**: Run the health check regularly -- before governance gates, after completing a batch of artifacts, or on a schedule using `/loop 30m /arckit.health SEVERITY=HIGH`.

---

## Example Usage

### Scan All Projects

```bash
/arckit.health
```

### Scan a Specific Project

```bash
/arckit.health PROJECT=001-payment-gateway
```

### High-Severity Issues Only

```bash
/arckit.health SEVERITY=HIGH
```

### Future Staleness Check

```bash
# What will be stale by June?
/arckit.health SINCE=2026-06-01
```

### Continuous Monitoring

```bash
# Run every 30 minutes during architecture sessions
/loop 30m /arckit.health SEVERITY=HIGH
```

---

## Tips

- **Run before governance gates**: Always run a health check before architecture review boards or procurement decisions to ensure no stale data or unresolved conditions are overlooked.

- **Use SEVERITY filtering for triage**: Start with `SEVERITY=HIGH` to address critical issues first, then work down to MEDIUM and LOW findings.

- **Combine with /arckit.pages**: The health check writes `docs/health.json` automatically. Run `/arckit.pages` afterwards to see health data on your governance dashboard.

- **Not all findings require action**: ORPHAN-REQ and MISSING-TRACE findings are flagged for awareness. The architect decides whether ADR coverage or traceability links are needed for each case.

- **Use SINCE for planning**: The `SINCE` parameter lets you preview what will become stale by a future date, useful for scheduling research refreshes or review meetings.

- **This is diagnostic, not analytical**: For deeper governance analysis that produces a formal report, use `/arckit.analyze` instead. The health check is lightweight and repeatable; the analyze command is comprehensive and artifact-producing.

---

## Follow-On Commands

After reviewing health check findings, typical next steps include:

| Command | Purpose |
|---------|---------|
| `/arckit.analyze` | Perform deeper governance analysis producing a formal report |
| `/arckit.conformance` | Systematic conformance checking against standards |
| `/arckit.research` | Refresh stale research documents flagged by STALE-RSCH |
| `/arckit.adr` | Create or review ADRs for forgotten decisions or orphaned requirements |
| `/arckit.traceability` | Fix missing traceability links between ADRs and requirements |

---

## Output Example

```text
========================================
  ArcKit Artifact Health Report
  Scanned: 2026-03-08
  Projects scanned: 3
  Artifacts scanned: 42
========================================

SUMMARY
-------
  HIGH:   3 findings
  MEDIUM: 5 findings
  LOW:    1 finding
  TOTAL:  9 findings

FINDINGS BY TYPE
----------------
  STALE-RSCH:       1
  FORGOTTEN-ADR:    1
  UNRESOLVED-COND:  1
  STALE-EXT:        0
  ORPHAN-REQ:       3
  MISSING-TRACE:    2
  VERSION-DRIFT:    1

PROJECT: 001-payment-gateway
  Artifacts scanned: 15

  [HIGH] STALE-RSCH: research/ARC-001-RSCH-001-v1.0.md
    Last modified: 2025-06-15 (266 days ago)
    Action: Re-run /arckit.research to refresh pricing and vendor data

  [HIGH] FORGOTTEN-ADR: decisions/ARC-001-ADR-003-v1.0.md
    Status: Proposed since 2025-12-01 (97 days without review)
    Action: Schedule architecture review or accept/reject the decision

  [MEDIUM] ORPHAN-REQ: ARC-001-REQ-v2.0.md
    Total requirements: 45
    Requirements not referenced by any ADR: 12
    Examples: FR-015, FR-016, NFR-P-003, NFR-S-008, INT-005
    Action: Review whether these requirements need architectural decisions

PROJECT: 002-data-platform
  Artifacts scanned: 8
  No issues found.

RECOMMENDED ACTIONS (prioritised)
----------------------------------
1. [HIGH] Address 1 stale research document
   Run: /arckit.research for affected projects
2. [HIGH] Review 1 forgotten ADR
   Schedule architecture review meeting
3. [MEDIUM] Check 3 orphaned requirement sets
   Run: /arckit.adr for requirements needing decisions
```
