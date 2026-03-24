# Citation Instructions for External Documents

When ArcKit commands read external documents (from `external/`, `policies/`, `vendors/`), use this citation system to create traceability from generated content back to source material.

## Document Abbreviation Rules

Derive a short Doc ID from each external filename:

1. Strip the file extension (`.pdf`, `.docx`, `.xlsx`, etc.)
2. Strip version numbers (`-v2`, `-v1.0`, `_v3`, etc.)
3. Take the first letter of each significant word (skip "the", "and", "of", "for", "in", "a", "an")
4. Uppercase the result

**Examples:**

| Filename | Doc ID | Derivation |
|----------|--------|------------|
| privacy-policy.pdf | PP | **P**rivacy **P**olicy |
| security-framework-v2.docx | SF | **S**ecurity **F**ramework |
| data-protection-impact-assessment.pdf | DPIA | **D**ata **P**rotection **I**mpact **A**ssessment |
| nhs-digital-service-manual.pdf | NDSM | **N**HS **D**igital **S**ervice **M**anual |
| cloud-hosting-strategy.pdf | CHS | **C**loud **H**osting **S**trategy |

**Collision handling:** If two documents produce the same abbreviation, append a numeric suffix to the second (e.g., `PP`, `PP2`). Alternatively, use more letters from the distinguishing word (e.g., `PRIV` for privacy-policy vs `PROC` for procurement-process).

## Citation ID Format

Each citation uses the format: `[{DOC_ID}-C{N}]`

- `DOC_ID` — The document abbreviation from the table above
- `C` — Literal "C" for "citation"
- `N` — Sequential number per document, starting at 1

Examples: `[PP-C1]`, `[PP-C2]`, `[SF-C1]`, `[DPIA-C3]`

## Inline Marker Placement

Place citation markers **immediately after** the requirement, finding, risk, or statement that was informed by the source document. Do not group citations at the end of paragraphs — attach them to the specific claim.

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

## Quoting Rules

For each citation, quote the **specific passage** from the source document that informed the finding:

1. Keep quotes to 1-3 sentences — enough to verify the source, not a full extract
2. Use double quotes around the passage
3. Include the page number, section number, or heading if identifiable
4. If the source is a table or diagram, describe the relevant content rather than quoting verbatim

## External References Section Structure

Populate the `## External References` section in the template with three sub-tables:

### Document Register

Lists every external document that was read, whether or not it was cited.

| Doc ID | Filename | Type | Source Location | Description |
|--------|----------|------|-----------------|-------------|

- **Doc ID** — The abbreviation derived using the rules above
- **Filename** — Original filename as found in the directory
- **Type** — Document type (e.g., Policy, Standard, Strategy, RFP, Specification, Report, Guidance)
- **Source Location** — Directory path relative to `projects/` (e.g., `001-project/external/`, `000-global/policies/`)
- **Description** — Brief description of the document's purpose

### Citations

Lists every inline citation used in the document body.

| Citation ID | Doc ID | Page/Section | Category | Quoted Passage |
|-------------|--------|--------------|----------|----------------|

- **Citation ID** — The `[DOC_ID-CN]` marker used inline
- **Doc ID** — Cross-reference to the Document Register
- **Page/Section** — Page number, section number, or heading where the passage was found. Use "—" if not identifiable
- **Category** — One of the categories listed above
- **Quoted Passage** — The specific passage that informed the finding

### Unreferenced Documents

Lists external documents that were read but did not contribute to this artifact. This demonstrates that all input documents were reviewed.

| Filename | Source Location | Reason |
|----------|-----------------|--------|

- **Reason** — Brief explanation (e.g., "No content relevant to requirements", "Covers operational procedures outside scope of this artifact")

### When No External Documents Exist

If no external documents were provided or found, retain the placeholder row in the Document Register:

| Doc ID | Filename | Type | Source Location | Description |
|--------|----------|------|-----------------|-------------|
| *None provided* | — | — | — | — |

Omit the Citations and Unreferenced Documents sub-tables.
