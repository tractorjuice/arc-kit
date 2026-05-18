# Public Code Reuse Assessment

> **Template Origin**: Community | **ArcKit Version**: [VERSION] | **Command**: `/arckit.fr-code-reuse`
>
> ⚠️ **Community-contributed** — not yet validated against current ANSSI/CNIL/EU regulatory text. Verify all citations before relying on output.

## Document Control

<!-- DOC-CONTROL-HEADER -->
<!-- Resolved at command-execution time to _partials/document-control-uk.md or _partials/document-control-uae.md based on plugin userConfig classification_scheme + governance_framework. See _partials/RENDERING.md (when present). -->

## Revision History

| Version | Date | Author | Changes | Approved By | Approval Date |
|---------|------|--------|---------|-------------|---------------|
| [VERSION] | [YYYY-MM-DD] | ArcKit AI | Initial creation from `/arckit.fr-code-reuse` | [PENDING] | [PENDING] |

## Executive Summary

| Component Need | code.gouv.fr Match | SILL Match | Decision | Effort Saved |
|---------------|-------------------|-----------|----------|-------------|
| [Component 1] | [Yes / Partial / No] | [Yes / No] | [Reuse / Fork / Build] | [estimate] |
| [Component 2] | | | | |

**Build vs Reuse verdict**: [Reuse existing code for X% of components / Partial reuse for Y components / Build from scratch — justification]

---

## Legal Framework

### Obligation to Reuse and Publish

French public administrations are subject to two complementary obligations:

**1. Reuse before build** (Circulaire PM n°6264-SG, 27 April 2021)
Public administrations must search for and reuse existing public code before commissioning new development. This applies to all software developed or commissioned by the State.

**2. Publish custom code** (Loi République Numérique, Art. 16; DINUM mission logiciels libres)
Software developed by or for the administration must be published as open source, except where national security, trade secrets, or third-party rights prevent publication.

| Obligation | Applicable | Rationale |
|-----------|-----------|-----------|
| Search for existing public code before building | [Yes / No] | [Rationale] |
| Publish code developed for this project | [Yes / No / Partially] | [Rationale — exceptions if any] |
| Use SILL-recommended software where available | [Yes — best practice] | |
| Contribute improvements back upstream | [Yes — recommended] | |

---

## 1. Project Requirements Summary

Features and components being assessed for reuse:

| ID | Component / Feature | Technical Domain | Complexity | Priority |
|----|--------------------|-----------------|-----------|---------|
| COMP-01 | [e.g. Identity and authentication] | [IAM] | [High / Medium / Low] | [Must-have] |
| COMP-02 | [e.g. Document management] | [ECM] | | |
| COMP-03 | [e.g. API gateway] | [Integration] | | |

---

## 2. code.gouv.fr Assessment

[code.gouv.fr](https://code.gouv.fr/sources/) lists open source code published by French public administrations. Search by keyword, domain, or technology.]

### 2.1 Search Results

| Component | Search Terms Used | Results Found | Best Match | Licence | Actively Maintained | Notes |
|-----------|-----------------|---------------|-----------|---------|-------------------|-------|
| COMP-01 | [keywords] | [N] | [Repo name or "None"] | [MIT / EUPL / LGPL] | [Yes / No / Unknown] | |
| COMP-02 | | | | | | |

### 2.2 Candidate Repository Assessment

For each promising match from code.gouv.fr:

| Field | COMP-01 Candidate | COMP-02 Candidate |
|-------|------------------|------------------|
| Repository | [URL] | [URL] |
| Publishing entity | [Ministry / Agency] | |
| Last commit | [YYYY-MM-DD] | |
| Stars / forks | [N / N] | |
| Open issues | [N] | |
| Documentation quality | [Good / Partial / Poor] | |
| Test coverage | [Stated %] | |
| Community / contributors | [Active / Dormant] | |
| Deployment complexity | [Docker / k8s / Manual] | |
| Compatibility with project stack | [High / Medium / Low] | |
| **Reuse recommendation** | [✅ Reuse / ⚠️ Fork / ❌ Build] | |

---

## 3. SILL Assessment (Socle Interministériel de Logiciels Libres)

The [SILL](https://code.gouv.fr/sill/) is the recommended free and open source software list for French public administrations. Software on the SILL has been assessed by an interministerial working group and has a named referent in the French administration.

### 3.1 SILL Matches

| Component | SILL Software | Category | Status | Referent Ministry | Version | Notes |
|-----------|-------------|---------|--------|------------------|---------|-------|
| COMP-01 | [e.g. Keycloak] | [Identity] | [In use / Recommended] | [DINUM] | [v24] | |
| COMP-02 | [e.g. Nextcloud] | [Collaboration] | | | | |

### 3.2 SILL Compliance

| SILL Requirement | Status | Notes |
|-----------------|--------|-------|
| SILL consulted before vendor selection | ☐ | |
| SILL-listed alternatives documented where not chosen | ☐ | |
| Rationale for not using SILL software documented | ☐ | |

---

## 4. European and International Public Code

Beyond French public code, the following sources should be consulted:

| Source | URL | Purpose |
|--------|-----|---------|
| Joinup (EU) | joinup.ec.europa.eu | EU institutions and member state public code |
| GitHub government organisations | github.com/[ministry-slug] | Other nation government repositories |
| eGovernment Core Vocabularies | data.europa.eu | EU semantic interoperability components |

### 4.1 Joinup / EU Public Code Results

| Component | EU Match | Publisher | Licence | Notes |
|-----------|---------|---------|---------|-------|
| COMP-01 | [Name or "None"] | [EU institution / Member state] | | |

---

## 5. Open Source Licence Compatibility

For all reused components, verify licence compatibility with the project's intended licence.

| Component | Candidate Licence | Project Licence | Compatible | Constraint |
|-----------|-----------------|----------------|-----------|-----------|
| COMP-01 | [MIT / EUPL / GPL v3] | [EUPL-1.2] | [Yes / No / Conditional] | [e.g. Copyleft requires publishing modifications] |

**EUPL-1.2 note**: The European Union Public Licence is the recommended licence for public code in France (Circulaire 2021). It is compatible with GPL, LGPL, AGPL, and several other major open source licences.

| Licence Type | Compatible with EUPL-1.2 | Notes |
|-------------|--------------------------|-------|
| MIT | Yes | Permissive |
| Apache 2.0 | Yes | Permissive |
| GPL v2 | Yes | Copyleft — project code becomes GPL |
| GPL v3 | Yes | Copyleft |
| LGPL | Yes | Weak copyleft |
| AGPL | Yes | Strong copyleft — network use triggers obligation |
| EUPL | Yes | Same licence |
| Proprietary | No | Cannot integrate into open source project |

---

## 6. Contribution-Back Plan

Where the project uses or forks existing public code, the Circulaire 2021 and DINUM mission logiciels libres encourage contributing improvements back upstream.

| Component | Planned Contributions | Contribution Timeline | Upstream Repository |
|-----------|---------------------|----------------------|---------------------|
| COMP-01 | [Bug fixes / New feature / Documentation] | [Within project delivery] | [URL] |
| COMP-02 | | | |

---

## 7. Decision Matrix

| Component | Option | Total Effort | Risk | Recommendation | Justification |
|-----------|--------|-------------|------|----------------|---------------|
| COMP-01 | Reuse as-is | Low | Low | ✅ **Reuse** | Meets 90% of requirements, active community |
| COMP-02 | Fork and adapt | Medium | Medium | ⚠️ **Fork** | Meets 60% of needs, requires 2 months adaptation |
| COMP-03 | Build from scratch | High | High | ❌ **Build** | No existing solution matches — document justification |

---

## 8. Reused Components Register

Final register of components selected for reuse. This feeds into procurement documentation and the software bill of materials (SBOM).

| Component | Source | Repository | Version Pinned | Licence | Integration Method | Maintenance Owner |
|-----------|--------|-----------|---------------|---------|-------------------|------------------|
| [Name] | code.gouv.fr / SILL / Joinup / GitHub | [URL] | [v1.2.3] | [MIT] | [Dependency / Fork / API] | [Team] |

---

**Generated by**: ArcKit `/arckit.fr-code-reuse` command
**Generated on**: [YYYY-MM-DD]
**ArcKit Version**: [VERSION]
**Project**: [PROJECT_NAME]
**Model**: [AI_MODEL]
