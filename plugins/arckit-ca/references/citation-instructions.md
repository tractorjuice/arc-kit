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
| data-protection-impact-assessment.pdf | DPIA | **D**ata **P**rotection **I**mpact **A**ssessment |
| nhs-digital-service-manual.pdf | NDSM | **N**HS **D**igital **S**ervice **M**anual |
| cloud-hosting-strategy.pdf | CHS | **C**loud **H**osting **S**trategy |

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

### UK Tenders MCP sourcing

Tender figures returned by the `uk-tenders` MCP server are sourced from official UK procurement notices (Find a Tender Service, Contracts Finder, Public Contracts Scotland, Sell2Wales, eTendersNI) and re-published verbatim under the **Open Government Licence v3.0**. Every notice record carries a `notice_url` pointing back to the source portal.

- Every supplier figure, benchmark value, and award count cited in a TNDR artefact **must** carry a `notice_url` citation (e.g., `[TNDR-C1]` where the Document Register entry records the `notice_url`).
- The artefact **must** include the attribution line: `Contains public sector information licensed under the Open Government Licence v3.0.`
- The mandatory caveat — `Awarded value is not actual spend; figures are for market context and benchmarking, not the costed Economic Case.` — must also appear verbatim; it is not a citation but a data-quality disclaimer required by the OGL sourcing.

### Web URLs

Use the prefix `WEB` plus a sequential index. One Source ID per **unique URL** fetched (not per call — refetching the same URL is one citation source).

Examples: `WEB-1`, `WEB-2`, `WEB-3`.

**Collision handling:** If two distinct sources collide on a derived ID, append a numeric suffix to the second (e.g., `PP`, `PP2`).

## Citation ID Format

Each inline citation uses the format: `[{SOURCE_ID}-C{N}]`

- `SOURCE_ID` — The Source ID derived above
- `C` — Literal "C" for "citation"
- `N` — Sequential number per source, starting at 1

Examples: `[PP-C1]`, `[PP-C2]`, `[SF-C1]`, `[DPIA-C3]`, `[GRSC-Q1-C1]`, `[AWSK-Q1-C1]`, `[WEB-1-C1]`.

## Inline Marker Placement

Place citation markers **immediately after** the requirement, finding, risk, or statement that was informed by the source. Do not group citations at the end of paragraphs — attach them to the specific claim.

**Examples:**

```text
The system must encrypt all personal data at rest using AES-256 [SF-C1] and in transit using TLS 1.3 [SF-C2].
```

```text
| BR-001 | The platform must support 10,000 concurrent users [RFP-C1] | Must | Scalability |
```

```text
Risk R-005: Non-compliance with data retention policy [PP-C3] could result in ICO enforcement action.
```

```text
East Sussex County Council have published `Escc.ActiveDirectory` [WEB-1-C1], a reusable .NET library for AD lookups, identified via govreposcrape search [GRSC-Q1-C1].
```

```text
Amazon Bedrock Guardrails support PII redaction across input and output flows [AWSK-Q1-C1].
```

## Category Assignment

Assign each citation a usage category describing how the source material was used:

- **Business Requirement** — Source defines a business need or objective
- **Functional Requirement** — Source specifies system behaviour
- **Non-Functional Requirement** — Source defines quality attributes (performance, security, etc.)
- **Compliance Constraint** — Source imposes regulatory or policy obligations
- **Security Requirement** — Source defines security controls or standards
- **Data Requirement** — Source specifies data handling, retention, or classification rules
- **Risk Factor** — Source identifies or informs a risk assessment
- **Design Decision** — Source influences an architectural or design choice
- **Stakeholder Need** — Source captures stakeholder goals, concerns, or expectations
- **Integration Requirement** — Source defines interfaces with external systems
- **Procurement Constraint** — Source restricts or guides procurement approach
- **Reuse Evidence** — Source demonstrates an existing implementation that informs build vs reuse analysis
- **Market Evidence** — Source provides vendor, pricing, or capability data informing options analysis

## Quoting Rules

For each citation, capture the **specific evidence** from the source that informed the finding:

1. **Documents and Web URLs** — Quote 1-3 sentences verbatim. Use double quotes. Include page number, section number, or heading if identifiable.
2. **MCP Queries** — Summarise the result set rather than quoting (e.g., `"3 repos returned: east-sussex-county-council/Escc.ActiveDirectory, hmrc/auth-stub, dwp/identity-verifier"`). For documentation-style MCP responses (AWS Knowledge, Microsoft Learn), quote the salient passage as for documents.
3. **Tables, diagrams, code blocks** — Describe the relevant content rather than quoting verbatim.

## External References Section Structure

Populate the `## External References` section in the template with three sub-tables. The template ships with these tables already; the rules below describe how to fill them for each source type without changing column structure.

### Document Register

Lists every source that was consulted (documents, MCP queries, fetched URLs), whether or not it was cited.

| Column | Documents | MCP Queries | Web URLs |
|--------|-----------|-------------|----------|
| **Doc ID** | Source ID derived from filename (e.g., `PP`) | Per-server prefix + query index (e.g., `GRSC-Q1`) | `WEB-N` (e.g., `WEB-1`) |
| **Filename** | Original filename (e.g., `privacy-policy.pdf`) | MCP tool + query (e.g., `search_uk_gov_code("active directory C#")`) | Full URL (e.g., `https://github.com/east-sussex-county-council/Escc.ActiveDirectory`) |
| **Type** | Document type (Policy / Standard / RFP / etc.) | `MCP Query` | `Web URL` |
| **Source Location** | Directory path relative to `projects/` (e.g., `001-project/external/`) | MCP server name (e.g., `govreposcrape`) | Domain (e.g., `github.com`) |
| **Description** | Brief description of the document's purpose | Result count + brief summary (e.g., `8 repos returned, top 3 relevant`) | Page title or what was being looked up |

### Citations

Lists every inline citation used in the document body. Schema unchanged.

| Citation ID | Doc ID | Page/Section | Category | Quoted Passage |
|-------------|--------|--------------|----------|----------------|

- **Citation ID** — The `[SOURCE_ID-CN]` marker used inline
- **Doc ID** — Cross-reference to the Document Register
- **Page/Section** — Page number, section number, heading, or MCP result index where the evidence was found. Use "—" if not applicable.
- **Category** — One of the categories listed above
- **Quoted Passage** — The verbatim quote (documents, web pages, doc-style MCP responses) or result summary (search-style MCP responses)

### Unreferenced Documents

Lists sources that were consulted but did not contribute to this artifact. Demonstrates that all retrieved material was reviewed. Now also covers MCP queries that returned nothing useful and fetched URLs that proved off-topic.

| Filename | Source Location | Reason |
|----------|-----------------|--------|

- **Filename** — Filename, MCP query, or URL (mirroring the Document Register's Filename column)
- **Source Location** — Directory path, MCP server name, or domain
- **Reason** — Brief explanation (e.g., "No content relevant to requirements", "Returned no results", "Covers operational procedures outside scope of this artifact")

### When No Source Material Was Consulted

If no documents, MCP queries, or web fetches were used, retain the placeholder row in the Document Register:

| Doc ID | Filename | Type | Source Location | Description |
|--------|----------|------|-----------------|-------------|
| *None consulted* | — | — | — | — |

Omit the Citations and Unreferenced Documents sub-tables.
