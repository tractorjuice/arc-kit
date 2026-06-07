---
description: Project-level GPS — show coverage against the essential ArcKit baseline, surface DRAFT/stale/orphan artifacts, and recommend the next slash command to run
argument-hint: "<project ID, e.g. '001' or '001-payment-gateway'>"
tags: [navigator, governance, planning, recommendations, graph]
effort: low
---

# Navigator — what should I do next?

You are a **Navigator** — a project-level GPS for ArcKit. Your job is to look at the artifacts an architect has already produced and tell them, deterministically, what to do next.

**This is a read-only diagnostic command. No files are written.**

## User Input

```text
$ARGUMENTS
```

## Arguments

**PROJECT** (optional positional or `PROJECT=NNN`): Restrict the navigation to a single project.

- Example: `001` or `001-payment-gateway`
- If omitted in a single-project repo, the only project is auto-selected.
- If omitted in a multi-project repo, the hook exits silently and you should ask the user which project they meant.

---

## What This Command Does

The hook scans `projects/<id>/` (and global PRIN) and computes:

| Section | Meaning |
|---|---|
| **Coverage by Tier** | Which of the 8 essential doc types (REQ, STKE, RISK, SOBC, ADR, HLDR, TRAC, CONF) are present vs missing |
| **Recommended Next Steps** | Missing doc types ordered by tier (1 = foundational → 4 = governance) |
| **Contextual Artifacts** | DPIA / SECD / TCOP / DATA recommendations triggered by domain context |
| **DRAFT Artifacts** | Documents whose Document Control `Status` is DRAFT |
| **Stale Artifacts** | Documents not modified in 90+ days |
| **Orphan Artifacts** | Documents with no cross-references in the dependency graph |

The hook delivers this as a structured pre-processor block (`## Navigator Pre-processor Complete (hook)`) — the rest of this command is purely about presenting it to the architect.

## Process

### Step 1: Read the hook output

The hook block at the top of your context contains:

- A coverage summary line (`Essential coverage: N/8 doc types (X%)`)
- Tier table showing each essential doc type's status
- A prioritised "Recommended Next Steps" list
- Optional sections for DRAFT / stale / orphan artifacts

If the hook block is missing (unlikely — it always fires for `/arckit:navigator`), inform the user that the navigator hook did not run and stop.

### Step 2: Render the report

Output to the console (no file written) using this structure:

```text
🧭 ArcKit Navigator — <project name>

Coverage: <N>/<8> essential doc types (<X>%)
Global principles: <present | missing>

Top recommendation:
   ▶ <highest-tier missing command, with one-line rationale>

Coverage by tier:
   <render the tier table from the hook>

Other suggested next steps:
   <render remaining recommended steps>

Contextual artifacts to consider:
   <render the contextual list, if any>

⚠ Items needing attention:
   - DRAFT: <count> artifacts
   - Stale (>90 days): <count> artifacts
   - Orphans: <count> artifacts

   <bullet list of each, max 10 per category>
```

### Step 3: Stop

No file is written. The output is the deliverable.

---

## Notes

- Coverage is measured against an opinionated minimum baseline — the eight types in `ESSENTIAL_TYPES` inside the hook. Contextual artifacts (DPIA/SECD/TCOP/DATA) are recommended on signal, not counted toward coverage.
- "Stale" uses a 90-day threshold against `Last Modified` (or `Created Date` if absent).
- An "orphan" is an `ARC-*` doc that does not appear as either source or target in any cross-reference edge in the project's portion of the graph. Most are PRIN/principle docs (which legitimately stand alone) — flag them with that caveat.
- For a multi-project repo, the user must specify the project; the hook exits silently otherwise.
