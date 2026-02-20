---
description: "Scan all projects for stale research, forgotten ADRs, unresolved review conditions, orphaned artifacts, missing traceability, and version drift"
---

# Artifact Health Check

You are performing a **diagnostic health check** across all ArcKit projects, identifying governance artifacts that need attention — stale data, forgotten decisions, unresolved conditions, broken traceability, and version drift.

**This is a diagnostic command. Output goes to the console only — do NOT create a file.** The health report is a point-in-time scan, not a governance artifact.

## User Input

```text
$ARGUMENTS
```

## Arguments

**PROJECT** (optional): Restrict scan to a single project directory
- Example: `PROJECT=001-payment-gateway`
- Default: scan all projects under `projects/`

**SEVERITY** (optional): Minimum severity to report (default: `LOW`)
- Valid: `HIGH`, `MEDIUM`, `LOW`
- Example: `SEVERITY=HIGH` shows only high-severity findings

**SINCE** (optional): Override staleness baseline date (default: today)
- Valid: ISO date `YYYY-MM-DD`
- Useful for "what would be stale as of date X" scenarios

**JSON** (optional): Write machine-readable output to `docs/health.json` for dashboard integration
- Example: `JSON=true`
- Default: console output only
- When enabled: writes `docs/health.json` AND still shows console output

---

## What This Command Does

Scans the `projects/` directory for all `ARC-*` artifacts and applies six detection rules to identify governance health issues. Each finding is assigned a severity (HIGH, MEDIUM, or LOW) with a suggested remediation action.

**This command does NOT modify any files.** It is a read-only diagnostic.

### Detection Rules

| ID | Rule | Severity | Threshold |
|----|------|----------|-----------|
| STALE-RSCH | Stale Research | HIGH | RSCH documents with created/modified date >6 months old |
| FORGOTTEN-ADR | Forgotten ADR | HIGH | ADR with status "Proposed" for >30 days with no review activity |
| UNRESOLVED-COND | Unresolved Conditions | HIGH | HLD/DLD review with "APPROVED WITH CONDITIONS" where conditions lack resolution evidence |
| ORPHAN-REQ | Orphaned Requirements | MEDIUM | REQ documents not referenced by any ADR in the same project |
| MISSING-TRACE | Missing Traceability | MEDIUM | ADR documents that do not reference any requirement (REQ, FR-xxx, NFR-xxx, BR-xxx) |
| VERSION-DRIFT | Version Drift | LOW | Multiple versions of the same artifact type where the latest version is >3 months old |

---

## Process

### Step 1: Identify Scan Scope

> **Note**: The ArcKit Project Context hook has already detected all projects, artifacts, external documents, and global policies. Use that context below — no need to scan directories manually.

Use the **ArcKit Project Context** (above) to determine which projects to scan:

- If `PROJECT` argument is provided: scan only that project directory
- If no argument: scan all project directories under `projects/` (excluding `000-global`)

For each project, build an inventory of all `ARC-*` artifacts, noting:
- Document type code (RSCH, ADR, REQ, HLDR, DLDR, TRAC, etc.)
- Version number
- File path

### Step 2: Read Artifact Metadata

For each artifact discovered, read the file and extract:

**For all artifacts:**
- Created/modified dates (from Document Control section or frontmatter)
- Version number (from filename pattern `ARC-{ID}-{TYPE}-v{VERSION}.md`)
- Status (from Document Control or content headings)

**For RSCH (Research) documents:**
- Created date and last modified date
- Any pricing data, vendor comparisons, or market analysis sections
- Whether the document references current-year data

**For ADR (Architecture Decision Record) documents:**
- Status field: look for "Proposed", "Accepted", "Deprecated", "Superseded"
- Date proposed / date accepted
- Whether any review comments or decision rationale exists
- References to requirements (FR-xxx, NFR-xxx, BR-xxx, INT-xxx, DR-xxx)

**For HLDR/DLDR (HLD Review / DLD Review) documents:**
- Overall verdict: "APPROVED", "APPROVED WITH CONDITIONS", "REJECTED", "PENDING"
- If "APPROVED WITH CONDITIONS": extract the specific conditions listed
- Whether conditions have resolution text (e.g., "Resolved", "Addressed in v2", "Condition met")

**For REQ (Requirements) documents:**
- Requirement IDs (BR-xxx, FR-xxx, NFR-xxx, INT-xxx, DR-xxx)
- Whether any ADR in the same project references these requirement IDs

**For TRAC (Traceability) documents:**
- Whether traceability matrix exists for the project

### Step 3: Apply Detection Rules

Apply each rule against the collected metadata. Use today's date (or the `SINCE` override) as the baseline for all staleness calculations.

#### Rule 1: STALE-RSCH — Stale Research

**Scan**: All `ARC-*-RSCH-*.md` files

**Logic**:
1. Extract the created date and last modified date from the Document Control section
2. Calculate age = baseline date - last modified date (or created date if no modified date)
3. If age > 180 days (6 months): **flag as HIGH severity**

**Rationale**: Research documents contain pricing data, vendor comparisons, and market analysis that becomes unreliable after 6 months. Procurement decisions based on stale research risk cost overruns and missed alternatives.

**Output per finding**:
```
[HIGH] STALE-RSCH: {filepath}
  Last modified: {date} ({N} days ago)
  Action: Re-run /arckit:research to refresh pricing and vendor data
```

#### Rule 2: FORGOTTEN-ADR — Forgotten ADR

**Scan**: All `ARC-*-ADR-*-*.md` files

**Logic**:
1. Extract the status field from the ADR content
2. If status is "Proposed":
   a. Extract the proposed/created date
   b. Calculate age = baseline date - proposed date
   c. If age > 30 days: **flag as HIGH severity**

**Rationale**: An ADR stuck in "Proposed" status for over 30 days indicates a decision that has been raised but never reviewed. This creates architectural ambiguity — teams may proceed without a formal decision or make conflicting assumptions.

**Output per finding**:
```
[HIGH] FORGOTTEN-ADR: {filepath}
  Status: Proposed since {date} ({N} days without review)
  Action: Schedule architecture review or accept/reject the decision
```

#### Rule 3: UNRESOLVED-COND — Unresolved Review Conditions

**Scan**: All `ARC-*-HLDR-*.md` and `ARC-*-DLDR-*.md` files, plus review files in `reviews/` subdirectories

**Logic**:
1. Check the overall verdict/status in the review document
2. If verdict is "APPROVED WITH CONDITIONS":
   a. Extract the list of conditions (typically in a "Conditions" or "Required Changes" section)
   b. For each condition, search for resolution evidence:
      - **Keywords indicating closure:** "Resolved", "Addressed", "Completed", "Condition met", "Fixed in v", "Implemented", "Mitigated", "Satisfied"
      - **Follow-up documentation:** A later review document, ADR, or design document that references and resolves the condition
      - **Implementation evidence:** If unclear whether resolution exists, flag it as unresolved AND note in output that manual architect verification is needed
   c. If ANY condition lacks resolution evidence: **flag as HIGH severity**

**Rationale**: "Approved with conditions" means the design can proceed but specific changes are required. If conditions are never formally resolved, the design may ship with known gaps — creating technical debt or compliance risk.

**Output per finding**:
```
[HIGH] UNRESOLVED-COND: {filepath}
  Verdict: APPROVED WITH CONDITIONS
  Unresolved conditions: {count}
  Conditions:
    - {condition 1 text}
    - {condition 2 text}
  Action: Address conditions and update review document, or schedule follow-up review
```

#### Rule 4: ORPHAN-REQ — Orphaned Requirements

**Scan**: All `ARC-*-REQ-*.md` files, cross-referenced with `ARC-*-ADR-*-*.md` files in the same project

**Logic**:
1. For each project that has a REQ document:
   a. Extract the list of requirement IDs from the REQ document (BR-xxx, FR-xxx, NFR-xxx, INT-xxx, DR-xxx)
   b. Read all ADR documents in the same project
   c. Search each ADR for references to any requirement ID
   d. Identify requirement IDs that are NOT referenced by any ADR
   e. If orphaned requirements exist: **flag as MEDIUM severity**

**Note**: Not all requirements need a dedicated ADR. This rule flags the gap for awareness — the architect decides whether an ADR is needed. Requirements covered by traceability matrices (TRAC) or design reviews (HLDR/DLDR) may be adequately governed without a specific ADR.

**Output per finding**:
```
[MEDIUM] ORPHAN-REQ: {project-dir}
  Requirements document: {filepath}
  Total requirements: {count}
  Requirements not referenced by any ADR: {count}
  Examples: {first 5 orphaned requirement IDs}
  Action: Review whether these requirements need architectural decisions documented as ADRs
```

#### Rule 5: MISSING-TRACE — Missing Traceability

**Scan**: All `ARC-*-ADR-*-*.md` files

**Logic**:
1. For each ADR document:
   a. Search the content for references to requirement IDs (patterns: `BR-\d{3}`, `FR-\d{3}`, `NFR-\w+-\d{3}`, `INT-\d{3}`, `DR-\d{3}`)
   b. Also check for references to REQ documents (`ARC-*-REQ-*`)
   c. If the ADR does not reference ANY requirement: **flag as MEDIUM severity**

**Rationale**: ADRs should be traceable to the requirements they address. An ADR with no requirement references may indicate a decision made without clear justification, or simply missing cross-references that should be added.

**Output per finding**:
```
[MEDIUM] MISSING-TRACE: {filepath}
  ADR title: {title from document}
  Status: {status}
  Action: Add requirement references to link this decision to specific requirements
```

#### Rule 6: VERSION-DRIFT — Version Drift

**Scan**: All `ARC-*` files, grouped by project and document type

**Logic**:
1. Group all artifacts by project and document type code (e.g., all REQ files for project 001)
2. For each group with multiple versions:
   a. Identify the latest version by version number
   b. Extract the last modified date of the latest version
   c. Calculate age = baseline date - last modified date
   d. If age > 90 days (3 months): **flag as LOW severity**

**Rationale**: Multiple versions of an artifact suggest active iteration. If the latest version has not been updated in over 3 months, the artifact may have been abandoned mid-revision or the team may be working from an outdated version.

**Output per finding**:
```
[LOW] VERSION-DRIFT: {project-dir}/{type}
  Versions found: {list of version numbers}
  Latest version: {filepath} (last modified: {date}, {N} days ago)
  Action: Confirm the latest version is current, or archive superseded versions
```

### Step 4: Compile Health Report

Produce the health report as **console output only** (do NOT write a file). Structure the report as follows:

#### 4.1: Summary Table

```
========================================
  ArcKit Artifact Health Report
  Scanned: {date}
  Projects scanned: {count}
  Artifacts scanned: {count}
========================================

SUMMARY
-------
  HIGH:   {count} findings
  MEDIUM: {count} findings
  LOW:    {count} findings
  TOTAL:  {count} findings

FINDINGS BY TYPE
----------------
  STALE-RSCH:       {count}
  FORGOTTEN-ADR:    {count}
  UNRESOLVED-COND:  {count}
  ORPHAN-REQ:       {count}
  MISSING-TRACE:    {count}
  VERSION-DRIFT:    {count}
```

#### 4.2: Findings by Project

Group findings by project directory, then by finding type within each project.

For each project:
```
PROJECT: {project-dir}
  Artifacts scanned: {count}

  [HIGH] STALE-RSCH: ARC-001-RSCH-v1.0.md
    Last modified: 2025-06-15 (250 days ago)
    Action: Re-run /arckit:research to refresh pricing and vendor data

  [HIGH] FORGOTTEN-ADR: decisions/ARC-001-ADR-003-v1.0.md
    Status: Proposed since 2025-12-01 (81 days without review)
    Action: Schedule architecture review or accept/reject the decision

  [MEDIUM] ORPHAN-REQ: ARC-001-REQ-v2.0.md
    Total requirements: 45
    Requirements not referenced by any ADR: 12
    Examples: FR-015, FR-016, NFR-P-003, NFR-S-008, INT-005
    Action: Review whether these requirements need architectural decisions

  ... (continue for all findings in this project)
```

If a project has no findings:
```
PROJECT: {project-dir}
  Artifacts scanned: {count}
  No issues found.
```

#### 4.3: Recommended Actions

At the end of the report, provide a prioritised action list:

```
RECOMMENDED ACTIONS (prioritised)
----------------------------------

1. [HIGH] Address {count} stale research documents
   Run: /arckit:research for affected projects
   Why: Pricing data older than 6 months is unreliable for procurement decisions

2. [HIGH] Review {count} forgotten ADRs
   Schedule architecture review meetings for proposed decisions >30 days old
   Why: Unresolved decisions create architectural ambiguity

3. [HIGH] Resolve {count} review conditions
   Update review documents with resolution evidence
   Why: Unresolved conditions may indicate unaddressed design gaps

4. [MEDIUM] Check {count} orphaned requirements
   Run: /arckit:adr for requirements needing architectural decisions
   Why: Requirements without ADR coverage may lack governance

5. [MEDIUM] Add traceability to {count} ADRs
   Update ADRs with requirement references
   Run: /arckit:traceability to generate full traceability matrix
   Why: Untraceable decisions reduce audit confidence

6. [LOW] Review {count} artifacts with version drift
   Confirm latest versions are current or archive old versions
   Why: Stale multi-version artifacts may indicate abandoned work
```

#### 4.4: Clean Report

If no findings are detected across all projects:

```
========================================
  ArcKit Artifact Health Report
  Scanned: {date}
  Projects scanned: {count}
  Artifacts scanned: {count}
========================================

All clear. No stale artifacts, forgotten decisions, or traceability gaps detected.
```

### Step 5: Write JSON Output (if JSON=true)

If the user specified `JSON=true`, write a machine-readable `docs/health.json` file using the Write tool. This file is consumed by the `/arckit:pages` dashboard.

**Schema**:

```json
{
  "generated": "2026-02-20T14:30:00Z",
  "scanned": {
    "projects": 3,
    "artifacts": 42
  },
  "summary": {
    "HIGH": 2,
    "MEDIUM": 5,
    "LOW": 1,
    "total": 8
  },
  "byType": {
    "STALE-RSCH": 1,
    "FORGOTTEN-ADR": 1,
    "UNRESOLVED-COND": 0,
    "ORPHAN-REQ": 3,
    "MISSING-TRACE": 2,
    "VERSION-DRIFT": 1
  },
  "projects": [
    {
      "id": "001-project-name",
      "artifacts": 15,
      "findings": [
        {
          "severity": "HIGH",
          "rule": "STALE-RSCH",
          "file": "ARC-001-RSCH-v1.0.md",
          "message": "Last modified: 2025-06-15 (250 days ago)",
          "action": "Re-run /arckit:research to refresh pricing and vendor data"
        }
      ]
    }
  ]
}
```

**Field definitions**:
- `generated` — ISO 8601 timestamp of when the scan was run
- `scanned.projects` — number of projects scanned
- `scanned.artifacts` — total number of artifacts scanned across all projects
- `summary` — finding counts by severity level (HIGH, MEDIUM, LOW) plus total
- `byType` — finding counts per detection rule (always include all 6 rule IDs, using 0 for rules with no findings)
- `projects[]` — per-project breakdown; each entry includes the project directory ID, artifact count, and an array of findings
- Each finding includes: `severity`, `rule` (detection rule ID), `file` (artifact filename), `message` (human-readable detail), and `action` (suggested remediation)

**Important**: Still show the console report (Step 4) even when JSON=true. The JSON file is an additional output, not a replacement.

**Dashboard integration**: Run `/arckit:health JSON=true` then `/arckit:pages` to see health data on the governance dashboard.

---

## Error Handling

**No projects directory**:
```
No projects/ directory found. Run /arckit:init to create your first project.
```

**No artifacts found**:
```
No ARC-* artifacts found in projects/. Generate artifacts using /arckit commands first.
```

**Single project specified but not found**:
```
Project directory not found: projects/{PROJECT}
Available projects:
  - 001-payment-gateway
  - 002-data-platform
```

---

## Examples

### Example 1: Scan All Projects

```bash
/arckit:health
```

Scans every project under `projects/` and reports all findings.

### Example 2: Scan a Specific Project

```bash
/arckit:health PROJECT=001-payment-gateway
```

Scans only the specified project.

### Example 3: Show Only High-Severity Issues

```bash
/arckit:health SEVERITY=HIGH
```

Filters output to show only HIGH severity findings.

### Example 4: Check Staleness as of a Future Date

```bash
/arckit:health SINCE=2026-06-01
```

Useful for planning — "what will be stale by June?"

---

## Integration with Other Commands

### Run After:
- `/arckit:analyze` — health check complements the deeper governance analysis
- Any artifact creation — verify new artifacts don't introduce drift

### Triggers For:
- `/arckit:research` — refresh stale RSCH documents
- `/arckit:adr` — create ADRs for orphaned requirements
- `/arckit:traceability` — fix missing traceability links
- `/arckit:hld-review` or `/arckit:dld-review` — follow up on unresolved conditions

---

## Design Notes

### Why Console Output, Not a File?

The health check is a **diagnostic tool**, not a governance artifact. Unlike `/arckit:analyze` which produces a formal analysis report (saved as `ARC-*-ANLZ-*.md`), the health check is:

- **Ephemeral**: Results change every time you run it
- **Actionable**: Designed to trigger other commands, not to be filed
- **Lightweight**: Quick scan, not a deep analysis
- **Repeatable**: Run it daily, weekly, or before any governance gate

### Threshold Rationale

| Threshold | Value | Rationale |
|-----------|-------|-----------|
| Research staleness | 6 months | Vendor pricing and SaaS feature sets change significantly within 6 months; procurement decisions require current data |
| ADR forgotten | 30 days | Architecture decisions should be reviewed within a sprint cycle; 30 days is generous |
| Review conditions | Any age | Unresolved conditions are a blocker regardless of age; there is no safe window to ignore them |
| Requirements orphaned | Any age | Flagged for awareness, not urgency; architect decides if ADR coverage is needed |
| ADR traceability | Any age | Traceability is a governance best practice; missing references should be added when convenient |
| Version drift | 3 months | Multiple versions indicate active iteration; 3 months of inactivity suggests the iteration has stalled |

### Example 5: Generate JSON for Dashboard

```bash
/arckit:health JSON=true
```

Writes `docs/health.json` for the pages dashboard, in addition to the console report.

### Future Enhancements

- **Custom thresholds**: Allow `.arckit/health-config.yaml` to override default thresholds
- **Trend tracking**: Compare current scan against previous scan to show improvement/regression
- **CI integration**: Exit code 1 if HIGH findings exist (for pipeline gates)
