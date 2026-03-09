---
description: Analyse the blast radius of a change to a requirement, decision, or design document
argument-hint: "<document ID or requirement ID, e.g. 'ARC-001-REQ', 'BR-003', 'ADR-002'>"
tags: [impact, change, blast-radius, dependency, traceability, governance]
handoffs:
  - command: traceability
    description: Update traceability matrix after impact assessment
    condition: "Impact analysis revealed traceability gaps"
  - command: health
    description: Check health of impacted artifacts
    condition: "Impacted documents may be stale"
  - command: conformance
    description: Re-assess conformance after changes
    condition: "Impact includes architecture design documents"
---

# Impact Analysis

You are helping an enterprise architect understand the blast radius of a change to an existing requirement, decision, or design document. This is reverse dependency tracing — the complement of forward traceability.

## User Input

```text
$ARGUMENTS
```

> **Note**: The ArcKit Impact hook has already built a dependency graph from all project artifacts and provided it as structured JSON in the context. Use that data — do NOT scan directories manually.

## Instructions

1. **Parse the query** to identify the change source:
   - **ARC document ID** (e.g., `ARC-001-REQ`, `ARC-001-ADR-003`) → find all documents that reference it
   - **Requirement ID** (e.g., `BR-003`, `NFR-SEC-001`) → find all documents containing that requirement ID
   - **Document type + project** (e.g., `ADR --project=001`) → show all dependencies of ADRs in that project
   - **Plain text** → search node titles and suggest the most likely target

2. **Perform reverse traversal** using the dependency graph:
   - **Level 0**: The changed document itself
   - **Level 1**: Documents that directly reference it (via cross-references or shared requirement IDs)
   - **Level 2**: Documents that reference Level 1 documents
   - Continue until no more references found (max depth 5)

3. **Classify impact severity** using the `severity` field from the graph nodes:
   - **HIGH**: Compliance/Governance documents (TCOP, SECD, DPIA, SVCASS, RISK, TRAC, CONF) — may need formal re-assessment
   - **MEDIUM**: Architecture documents (HLDR, DLDR, ADR, DATA, DIAG, PLAT) — may need design updates
   - **LOW**: Planning/Other documents (PLAN, ROAD, BKLG, SOBC, OPS, PRES) — review recommended

4. **Output format** (console only — do NOT create a file):

   ```markdown
   ## Impact Analysis: BR-003 (Data Residency Requirement)

   ### Change Source
   - **Requirement:** BR-003 — "All customer data must reside within UK data centres"
   - **Defined in:** ARC-001-REQ-v2.0 (projects/001-payments/)

   ### Impact Chain

   | Level | Document | Type | Impact | Action Needed |
   |-------|----------|------|--------|---------------|
   | 1 | ARC-001-ADR-002-v1.0 | ADR | MEDIUM | Review cloud provider decision |
   | 1 | ARC-001-HLDR-v1.0 | HLDR | MEDIUM | Update deployment architecture |
   | 2 | ARC-001-SECD-v1.0 | SECD | HIGH | Re-assess data protection controls |
   | 2 | ARC-001-DPIA-v1.0 | DPIA | HIGH | Re-run DPIA assessment |
   | 3 | ARC-001-OPS-v1.0 | OPS | LOW | Check operational procedures |

   ### Summary
   - **Total impacted:** 5 documents
   - **HIGH severity:** 2 (compliance re-assessment needed)
   - **MEDIUM severity:** 2 (design updates needed)
   - **LOW severity:** 1 (review recommended)

   ### Recommended Actions
   1. Re-run `/arckit:secure` to update Secure by Design assessment
   2. Re-run `/arckit:dpia` to update Data Protection Impact Assessment
   3. Review ADR-002 decision rationale against updated requirement
   ```

5. **Recommend specific `/arckit:` commands** for HIGH severity impacts:
   - SECD impacted → `/arckit:secure`
   - DPIA impacted → `/arckit:dpia`
   - TCOP impacted → `/arckit:tcop`
   - HLDR impacted → `/arckit:hld-review`
   - RISK impacted → `/arckit:risk`
   - TRAC impacted → `/arckit:traceability`

6. **If no impacts found**, report that the document has no downstream dependencies. Note this may indicate a traceability gap — suggest running `/arckit:traceability` to check coverage.

7. **If the query matches multiple documents**, list them and ask the user to specify which one to analyse.
