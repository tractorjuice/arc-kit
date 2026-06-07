# Impact Analysis

Analyse the blast radius of a change to a requirement, decision, or design document. This is reverse dependency tracing — the complement of forward traceability (`/arckit:traceability`).

## Usage

```bash
/arckit:impact <document ID or requirement ID>
```

## Examples

```bash
# Impact of changing a requirement
/arckit:impact BR-003
/arckit:impact NFR-SEC-001

# Impact of changing a document
/arckit:impact ARC-001-REQ
/arckit:impact ARC-001-ADR-002

# Show all dependencies for a document type in a project
/arckit:impact ADR --project=001
```

## How It Works

A pre-processing hook builds a dependency graph on invocation:

1. Scans all ARC-\*.md files across all projects
2. Extracts cross-references between documents (ARC-NNN-TYPE patterns)
3. Maps requirement IDs to the documents that contain them
4. Classifies each document's impact severity by type category

The command then performs reverse traversal through the graph to find all downstream dependencies.

## Impact Severity

| Severity | Category | Document Types | Action |
|----------|----------|---------------|--------|
| **HIGH** | Compliance/Governance | TCOP, SECD, DPIA, SVCASS, RISK, TRAC, CONF | Formal re-assessment likely needed |
| **MEDIUM** | Architecture | HLDR, DLDR, ADR, DATA, DIAG, PLAT | Design updates may be needed |
| **LOW** | Planning/Other | PLAN, ROAD, BKLG, SOBC, OPS, PRES | Review recommended |

## Traversal Depth

The analysis traces dependencies up to 5 levels deep:

- **Level 0**: The changed document itself
- **Level 1**: Documents that directly reference it
- **Level 2**: Documents that reference Level 1 documents
- **Level 3-5**: Further indirect dependencies

## When to Use

- **Before changing a requirement** — understand what other documents will be affected
- **Before updating an ADR** — check if compliance documents reference it
- **After a design review** — trace what else needs updating when conditions are imposed
- **During change governance** — document the full impact chain for approval boards

## Relationship to Traceability

| Command | Direction | Question |
|---------|-----------|----------|
| `/arckit:traceability` | Forward | "Are my requirements covered by design decisions?" |
| `/arckit:impact` | Reverse | "If I change this requirement, what breaks?" |

Use traceability to check coverage. Use impact to assess change risk.
