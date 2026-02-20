# Artifact Health Guide

The `/arckit:health` command scans your projects for governance artifacts that need attention. This guide explains what each finding type means, why the thresholds exist, and how to resolve each issue.

## Overview

Architecture governance artifacts have a shelf life. Research data goes stale, decisions get forgotten, review conditions go unresolved, and traceability links break as projects evolve. The health command performs a quick, non-destructive scan to surface these issues before they become problems.

**Key principle**: The health check is a diagnostic tool, not a governance artifact. It outputs to the console and does not create files. Run it frequently — before governance gates, at the start of a sprint, or as part of your regular project hygiene.

---

## Finding Types

### STALE-RSCH — Stale Research

**Severity**: HIGH

**What it means**: A research document (`ARC-*-RSCH-*.md`) has not been updated in over 6 months. Research documents contain vendor pricing, feature comparisons, market analysis, and technology assessments that change rapidly.

**Why it matters**: Procurement decisions based on stale research risk cost overruns, missed alternatives, and selecting vendors whose offerings have materially changed. SaaS pricing, in particular, can shift quarterly.

**How to resolve**:
1. Run `/arckit:research` to generate a fresh research document
2. Compare the new findings against the original to identify material changes
3. If the original research is still valid (rare for pricing data), update the Document Control "Last Modified" date to acknowledge the review

**Example scenario**: Your team selected a cloud database vendor 8 months ago based on pricing in the RSCH document. Since then, the vendor has introduced a new pricing tier that is 30% cheaper for your workload — but no one checked.

---

### FORGOTTEN-ADR — Forgotten ADR

**Severity**: HIGH

**What it means**: An Architecture Decision Record has been in "Proposed" status for more than 30 days without being reviewed, accepted, or rejected.

**Why it matters**: Proposed ADRs represent architectural decisions that someone thought were important enough to document but that no one has formally evaluated. Teams may be proceeding with conflicting assumptions, or the decision may be blocking downstream work.

**How to resolve**:
1. Schedule an architecture review meeting to discuss the proposed ADR
2. After review, update the ADR status to "Accepted", "Rejected", or "Superseded"
3. If the ADR is no longer relevant, change status to "Deprecated" with an explanation

**Example scenario**: An engineer proposed switching from REST to gRPC for internal service communication 6 weeks ago. The ADR sits in "Proposed" status while two teams build new services — one using REST, one using gRPC — because no decision was formally made.

---

### UNRESOLVED-COND — Unresolved Review Conditions

**Severity**: HIGH

**What it means**: An HLD or DLD review was marked "APPROVED WITH CONDITIONS", but one or more conditions have no evidence of being resolved. The conditions were requirements for the approval to be valid.

**Why it matters**: "Approved with conditions" is a conditional pass — it means the architecture can proceed but specific changes are mandatory. If conditions are never addressed, the design ships with known gaps that the review board explicitly flagged.

**How to resolve**:
1. Read the specific conditions listed in the review document
2. For each condition:
   - If explicitly marked as resolved in the review document: resolution is clear
   - If addressed in implementation but not documented: document the resolution (e.g., "Addressed in DLD v2.0, Section 4.3")
   - If unclear: the health command flags it for manual verification — this is intentional, as unresolved conditions are governance risks
3. Optionally, schedule a follow-up review with `/arckit:hld-review` or `/arckit:dld-review`

**Example scenario**: The HLD review approved the payment gateway design with two conditions: (1) add a circuit breaker pattern for external API calls, and (2) document the failover strategy. Three months later, neither condition has been addressed, and the DLD is being written without them.

---

### ORPHAN-REQ — Orphaned Requirements

**Severity**: MEDIUM

**What it means**: Requirements in the REQ document are not referenced by any ADR in the same project. These requirements exist in isolation without documented architectural decisions explaining how they will be satisfied.

**Why it matters**: Not every requirement needs a dedicated ADR — straightforward requirements may be adequately covered by design reviews or traceability matrices. However, complex or contentious requirements benefit from explicit architectural decisions. This finding flags the gap for the architect to assess.

**How to resolve**:
1. Review the list of orphaned requirements
2. For each one, ask: "Does this requirement involve a non-trivial architectural choice?"
   - **If yes**: Create an ADR with `/arckit:adr` documenting the decision
   - **If no**: The requirement is likely covered by general design — no action needed
3. Run `/arckit:traceability` to generate a full traceability matrix showing how requirements connect to designs

**Example scenario**: The project has 45 requirements, but only 8 ADRs exist. Most functional requirements (FR-xxx) are straightforward, but NFR-S-008 (encryption key management) and INT-005 (third-party API authentication) involve significant architectural choices that should be documented as decisions.

---

### MISSING-TRACE — Missing Traceability

**Severity**: MEDIUM

**What it means**: An ADR does not reference any requirement ID (BR-xxx, FR-xxx, NFR-xxx, INT-xxx, DR-xxx). The decision exists but is not linked back to the requirements it addresses.

**Why it matters**: Traceability is a governance best practice. ADRs without requirement references are harder to audit, harder to assess for impact when requirements change, and may indicate decisions made without clear justification.

**How to resolve**:
1. Open the flagged ADR
2. Identify which requirements motivated the decision
3. Add references in the ADR body (e.g., "This decision addresses FR-015 and NFR-P-003")
4. Run `/arckit:traceability` to validate the full traceability chain

**Example scenario**: ADR-005 documents the decision to use PostgreSQL as the primary database. The ADR explains the reasoning well, but does not reference DR-001 (relational data storage) or NFR-P-002 (query performance <100ms). Adding these references makes the decision auditable.

---

### VERSION-DRIFT — Version Drift

**Severity**: LOW

**What it means**: Multiple versions of the same artifact type exist for a project, and the latest version has not been updated in over 3 months. This suggests the artifact was being actively iterated but the iteration has stalled.

**Why it matters**: Version drift can indicate abandoned revisions, teams working from outdated versions, or simply a completed artifact that has accumulated old versions. The risk is low but worth periodic review.

**How to resolve**:
1. Check whether the latest version is still the authoritative document
2. If the latest version is current and complete: no action needed (the age is acceptable)
3. If older versions are superseded: consider archiving or deleting them to reduce confusion
4. If the latest version is incomplete: either complete it or revert to the last stable version

**Example scenario**: The requirements document exists in v1.0, v1.1, and v2.0. Version 2.0 was created 4 months ago during a major scope change but was never completed. The team is still referencing v1.1 without realising v2.0 exists.

---

## Staleness Thresholds

| Finding Type | Threshold | Rationale |
|-------------|-----------|-----------|
| Stale Research | 6 months | Vendor pricing, SaaS features, and market conditions change materially within 6 months. Procurement decisions require current data. |
| Forgotten ADR | 30 days | Architecture decisions should be reviewed within one or two sprint cycles. 30 days provides a generous buffer. |
| Unresolved Conditions | Any age | Conditions are requirements for the approval to be valid. There is no safe period to defer them. |
| Orphaned Requirements | Any age | Flagged for awareness. The architect decides whether ADR coverage is needed based on requirement complexity. |
| Missing Traceability | Any age | Traceability is a best practice for auditability. Missing references should be added as part of regular governance hygiene. |
| Version Drift | 3 months | Multiple versions indicate active iteration. Three months of inactivity suggests the iteration has stalled or been abandoned. |

---

## Usage Examples

### Daily Hygiene Check

```bash
/arckit:health
```

Quick scan across all projects. Run this at the start of a session to see what needs attention.

### Pre-Gate Check

```bash
/arckit:health PROJECT=001-payment-gateway SEVERITY=HIGH
```

Before a governance gate, check a specific project for high-severity issues only. Any HIGH findings should be resolved before proceeding.

### Planning Ahead

```bash
/arckit:health SINCE=2026-06-01
```

Project forward — "what will be stale by June?" Useful for planning refresh cycles and scheduling reviews.

---

## Relationship to /arckit:analyze

The health check and the analyse command serve different purposes:

| Aspect | `/arckit:health` | `/arckit:analyze` |
|--------|------------------|-------------------|
| **Scope** | Cross-project staleness and hygiene | Single-project deep governance analysis |
| **Output** | Console only (diagnostic) | Saved to `ARC-*-ANLZ-*.md` (governance artifact) |
| **Depth** | Metadata scan (dates, statuses, references) | Content analysis (quality, compliance, traceability) |
| **Speed** | Quick (seconds) | Thorough (minutes) |
| **Use case** | Regular hygiene, pre-gate checks | Formal governance reviews, audit preparation |

**Recommended workflow**: Run `/arckit:health` frequently for quick checks. Run `/arckit:analyze` before formal gates or when the health check reveals issues that need deeper investigation.

---

## Customising Thresholds (Future Enhancement)

A future release will support a `.arckit/health-config.yaml` file to override default thresholds:

```yaml
# .arckit/health-config.yaml (planned — not yet implemented)
thresholds:
  stale-research-days: 90      # Default: 180
  forgotten-adr-days: 14       # Default: 30
  version-drift-days: 60       # Default: 90

exclude:
  projects:
    - 000-global               # Always excluded
    - 999-archive              # Skip archived projects
  types:
    - PRES                     # Presentation decks don't need freshness checks
```

Until this is implemented, the built-in thresholds apply. If you need different thresholds, specify the `SINCE` argument to shift the baseline date.
