# GEMMA Alignment Assessment

> **Template Origin**: Community | **ArcKit Version**: [VERSION] | **Command**: `/arckit:nl-gemma`
>
> ⚠️ **Community-contributed** — not yet validated by VNG Realisatie. GEMMA names and relations come from the extract named in Section 1; verify against [gemmaonline.nl](https://www.gemmaonline.nl) before relying on this assessment. This document maps applications to GEMMA component types; it does not judge products.

## Document Control

<!-- DOC-CONTROL-HEADER -->
<!-- Resolved at command-execution time per _partials/RENDERING.md. -->

## Revision History

| Version | Date | Author | Changes | Approved By | Approval Date |
|---------|------|--------|---------|-------------|---------------|
| [VERSION] | [YYYY-MM-DD] | ArcKit AI | Initial creation from `/arckit:nl-gemma` | [PENDING] | [PENDING] |

## Executive Summary

**Scope**: [Gemeente — whole landscape / domain / project]

**GEMMA source**: [Extract filename(s) and source version]

**Mapping**: [N] applications — [N] Stated · [N] Inferred · [N] Unmapped

**Coverage**: [N] referentiecomponenten filled (overlap on [N]) · [N] unfilled and expected · [N] bedrijfsfuncties not supported

**Key findings**:

- [Finding 1]
- [Finding 2]
- [Finding 3]

> Inferred mappings are ArcKit's reading of the sources and need validation by application owners. Filling a referentiecomponent says what an application is used for, not that the product is GEMMA-compliant.

---

## 1. Scope and Sources

| Element | Value |
|---------|-------|
| Gemeente | [Name] |
| Scope of the mapping | [Whole application landscape / domain / project] |
| GEMMA referentiecomponenten extract | [Path, source version] |
| GEMMA bedrijfsfunctiemodel extract | [Path, source version / Not available — Section 4 skipped] |
| GEMMA principles extract | [Path, source version / Not available — no GAP links in Section 7] |

### Landscape sources

| Source | Type | Date | Strength |
|--------|------|------|----------|
| [Filename or artefact ID] | [Softwarecatalogus export / ArchiMate model or extract / APP inventory / application list / user input] | [Date] | [Explicit mapping / Description only] |

### Source limitations

[Data notes from the extracts that affect this mapping, gaps in the landscape sources, and anything not considered. "None" if there are none.]

---

## 2. Application Mapping

| Application | Product / supplier (as stated) | Referentiecomponent(en) | Confidence | Rationale or source |
|-------------|--------------------------------|-------------------------|------------|---------------------|
| [Name as the source gives it] | [As stated, or —] | [Exact name(s) from the extract, or —] | [Stated / Inferred / Unmapped] | [Source citation for Stated; one-line rationale for Inferred; why nothing fits for Unmapped] |

---

## 3. Coverage of Referentiecomponenten

### 3.1 Filled components

| Referentiecomponent | Groep | Filled by | Overlap | Explanation |
|---------------------|-------|-----------|---------|-------------|
| [Name from extract] | [Groep from extract] | [Applications] | [Yes / No] | [Sector-specific use / to examine / —] |

### 3.2 Unfilled components

<!-- Group by the extract's Groep. For a project or domain scope, list only components relevant to that scope and say the rest were not considered. -->

#### [Groep]

| Referentiecomponent | Relevance | Reason |
|---------------------|-----------|--------|
| [Name from extract] | [Expected / Possibly not needed / To be confirmed] | [Reason] |

---

## 4. Bedrijfsfunctie Coverage

<!-- Requires the bedrijfsfunctiemodel extract. Otherwise: "Not assessed — bedrijfsfunctiemodel extract not available." -->

| Top-level group | Functions in scope | Supported | Not supported | No GEMMA component |
|-----------------|--------------------|-----------|---------------|--------------------|
| [Group from extract] | [n] | [n] | [n] | [n] |

### Not supported bedrijfsfuncties

| Bedrijfsfunctie | Path in the model | Supporting components in GEMMA (none filled) |
|-----------------|-------------------|----------------------------------------------|
| [Name] | [Group › … › Function] | [Component names from extract] |

> Support is derived as in the extract: referentiecomponent → applicatieservice → bedrijfsfunctie. Some GEMMA components have no such relation; *No GEMMA component* is a property of the reference model, not a gap in the landscape.

---

## 5. Standards

| Referentiecomponent | Standaard (from extract) | Application | Support | Evidence |
|---------------------|--------------------------|-------------|---------|----------|
| [Name] | [Standard name] | [Application] | [Supported / Not supported / Unknown] | [Evidence or "No evidence found"] |

---

## 6. Data Exchange and Buitengemeentelijke Voorzieningen

### Data exchange between filled components

| From (component) | To (component) | Applications involved | In the landscape | Evidence |
|------------------|----------------|-----------------------|------------------|----------|
| [Name] | [Name] | [App → App] | [Present / Absent / Unknown] | [Evidence] |

### Buitengemeentelijke voorzieningen

| Voorziening (from extract) | Connected | Through | Evidence |
|----------------------------|-----------|---------|----------|
| [Name] | [Yes / No / Unknown] | [Application or component] | [Evidence] |

---

## 7. Roadmap Candidates

| # | Action | Finding (section) | Components / functions | Priority | Serves principle | Reason |
|---|--------|-------------------|------------------------|----------|------------------|--------|
| 1 | [Rationalise / Fill / Standardise / Integrate / Replace or keep] | [e.g. 3.1 overlap on X] | [Names from extract] | 🔴 High | [GAP ID from extract, or —] | [Reason] |

**Next steps**: Validate the Inferred mappings with application owners. Run `/arckit:roadmap` to sequence these candidates. Run `/arckit:adr` for keep-or-replace decisions on Unmapped applications. Run `/arckit:nl-nora` to assess NORA and GEMMA principle conformance.

---

## 8. External References

> This section provides traceability from generated content back to source documents.
> Follow citation instructions in the project's citation reference guide.

### Document Register

| Doc ID | Filename | Type | Source Location | Description |
|--------|----------|------|-----------------|-------------|
| [DOC_ID] | [gemma-referentiecomponenten.md] | External document | projects/000-global/external/ | GEMMA referentiecomponenten extract — [source version]. GEMMA © VNG Realisatie, EUPL |
| [DOC_ID] | [Landscape source] | [Type] | [Location] | [Description, date] |
| WEB-1 | <https://www.gemmaonline.nl> | Web URL | gemmaonline.nl | GEMMA — Gemeentelijke Model Architectuur (source of the extract; not fetched during this assessment) |

### Citations

| Citation ID | Doc ID | Page/Section | Category | Quoted Passage |
|-------------|--------|--------------|----------|----------------|
| [DOC_ID-C1] | [DOC_ID] | [Section] | [Mapping evidence] | [Passage] |

### Unreferenced Documents

| Filename | Source Location | Reason |
|----------|-----------------|--------|
| — | — | — |

---

**Generated by**: ArcKit `/arckit:nl-gemma` command
**Generated on**: [YYYY-MM-DD]
**ArcKit Version**: [VERSION]
**Project**: [PROJECT_NAME]
**Model**: [AI_MODEL]
