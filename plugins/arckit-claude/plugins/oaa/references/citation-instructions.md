# Citation Instructions for Source Material

When ArcKit commands gather evidence from source material — files in `external/`, `policies/`, `vendors/`, MCP server queries, or web pages fetched at runtime — use this citation system to create traceability from generated content back to that source material.

Three source types are covered:

- **Document** — A file on disk under `external/`, `policies/`, or `vendors/`

- **MCP Query** — A query sent to an MCP server (e.g., `search_uk_gov_code`, AWS Knowledge `search_documentation`)

- **Web URL** — A URL fetched at runtime via WebFetch

WebSearch (search-only, no fetch) is exploratory and does not produce citations. Cite a URL only once it has actually been fetched.

The instructions extend the existing `Document Register` / `Citations` / `Unreferenced Documents` template tables — the column names and structure stay the same, but each column's semantics now cover MCP queries and web URLs as well as files. Treat "Doc ID" as the generic Source ID for any source type.

## Source ID Rules

Derive a short Source ID for each piece of source material. The same Source ID is used in the Document Register and in inline citation markers.

### Documents (files)

1. Strip the file extension (`.pdf`, `.docx`, `.xlsx`, etc.)
2. Strip version numbers (`-v2`, `-v1.0`, `_v3`, etc.)
3. Take the first letter of each significant word (skip "the", "and", "of", "for", "in", "a", "an")
4. Uppercase the result

**Examples:**

| Filename | Source ID | Derivation |
|----------|-----------|------------|
| privacy-policy.pdf | PP | **P**rivacy **P**olicy |
| security-framework-v2.docx | SF | **S**ecurity **F**ramework |
| oaa-standard-c208.pdf | OAS-C | **O**pen **A**gile **A**rchitecture **C**208 |

### MCP Queries

Use a fixed per-server prefix plus a sequential query index. One Source ID per **unique query** to an MCP server (not per call — if the same query was issued multiple times, it is one citation source).

| MCP Server | Prefix | Example Source ID |
|------------|--------|-------------------|
| govreposcrape | GRSC | `GRSC-Q1`, `GRSC-Q2` |
| AWS Knowledge | AWSK | `AWSK-Q1` |
| Microsoft Learn | MSL | `MSL-Q1` |
| Google Developer Knowledge | GDK | `GDK-Q1` |
| DataCommons | DC | `DC-Q1` |

For MCP servers not listed above, derive a short uppercase prefix from the server name (e.g., `linear-mcp` → `LIN`).

### Web URLs

Use the prefix `WEB` plus a sequential index. One Source ID per **unique URL** fetched (not per call — refetching the same URL is one citation source).

Examples: `WEB-1`, `WEB-2`, `WEB-3`.

**Collision handling:** If two distinct sources collide on a derived ID, append a numeric suffix to the second (e.g., `PP`, `PP2`).

## Citation ID Format

Each inline citation uses the format: `[{SOURCE_ID}-C{N}]`

- `SOURCE_ID` — The Source ID derived above

- `C` — Literal "C" for "citation"

- `N` — Sequential number per source, starting at 1

Examples: `[PP-C1]`, `[PP-C2]`, `[OAS-C-C1]`, `[WEB-1-C1]`.

## Inline Marker Placement

Place citation markers **immediately after** the requirement, finding, risk, or statement that was informed by the source. Do not group citations at the end of paragraphs — attach them to the specific claim.

**Examples:**

```text
The sprint architecture vision must align with O-AA C208 Axiom 11 [OAS-C-C1] and cover all 8 ADM phases [OAS-C-C2].
```text

## Category Assignment

Assign each citation a usage category describing how the source material was used:

- **Business Requirement** — Source defines a business need or objective

- **Functional Requirement** — Source specifies system behaviour

- **Non-Functional Requirement** — Source defines quality attributes (performance, security, etc.)

- **Compliance Constraint** — Source imposes regulatory or policy obligations

- **Security Requirement** — Source defines security controls or standards

- **Architecture Decision** — Source influences an architectural or design choice

- **Stakeholder Need** — Source captures stakeholder goals, concerns, or expectations

- **O-AA Reference** — Source is the O-AA C208 standard or official documentation

- **Market Evidence** — Source provides vendor, pricing, or capability data informing options analysis

## O-AA C208 Standard Citation

When referencing the Open Agile Architecture standard:

- Source ID: `OAS-C` (O-AA Standard C208)

- Always include the specific chapter or axiom number (e.g., `[OAS-C-C1]` for Chapter 10, Axiom 11)

- Official source: Open Agile Architecture (openagilearchitecture.com)

## External References Section Structure

Populate the `## External References` section in the template with three sub-tables. The template ships with these tables already; the rules below describe how to fill them for each source type without changing column structure.

### Document Register

| Column | Documents | MCP Queries | Web URLs |
|--------|-----------|-------------|----------|
| **Doc ID** | Source ID derived from filename (e.g., `OAS-C`) | Per-server prefix + query index (e.g., `GRSC-Q1`) | `WEB-N` (e.g., `WEB-1`) |
| **Filename** | Original filename (e.g., `oaa-standard-c208.pdf`) | MCP tool + query | Full URL |
| **Type** | Document type (Standard / Policy / etc.) | `MCP Query` | `Web URL` |
| **Source Location** | Directory path relative to `projects/` | MCP server name | Domain |
| **Description** | Brief description of the document's purpose | Result count + brief summary | Page title |

### Citations

| Citation ID | Doc ID | Page/Section | Category | Quoted Passage |
|-------------|--------|--------------|----------|----------------|

- **Citation ID** — The `[SOURCE_ID-CN]` marker used inline

- **Doc ID** — Cross-reference to the Document Register

- **Page/Section** — Chapter/axiom number or page reference

- **Category** — One of the categories listed above

- **Quoted Passage** — The verbatim quote or result summary

### Unreferenced Documents

| Filename | Source Location | Reason |
|----------|-----------------|--------|

- Brief explanation for sources consulted but not cited.

### When No Source Material Was Consulted

If no documents, MCP queries, or web fetches were used, retain the placeholder row in the Document Register:

| Doc ID | Filename | Type | Source Location | Description |
|--------|----------|------|-----------------|-------------|
| *None consulted* | — | — | — | — |

Omit the Citations and Unreferenced Documents sub-tables.
