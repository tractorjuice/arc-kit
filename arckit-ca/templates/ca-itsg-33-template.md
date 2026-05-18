# Canada ITSG-33 Statement of Applicability

> **Template Origin**: Community | **ArcKit Version**: [VERSION] | **Command**: `/arckit.ca-itsg-33`

## Document Control

<!-- DOC-CONTROL-HEADER -->
<!-- Resolved at command-execution time per _partials/RENDERING.md. -->
<!-- Classification line MUST be: -->
<!-- | Classification | UNCLASSIFIED / Protected A / Protected B / Protected C / CONFIDENTIAL / SECRET / TOP SECRET | -->

## Revision History

| Version | Date | Author | Changes | Approved By | Approval Date |
|---------|------|--------|---------|-------------|---------------|
| [VERSION] | [YYYY-MM-DD] | ArcKit AI | Initial creation from `/arckit.ca-itsg-33` | [PENDING] | [PENDING] |

## Executive Summary

[Two to three paragraphs describing the system, the system-level categorisation (UNCLASSIFIED / Protected A / Protected B / Protected C / CONFIDENTIAL / SECRET / TOP SECRET), the selected control profile (PBMM / PBMM-Cloud / Secret-High / Top-Secret-High), the headline tailoring posture, the count of Compensating Controls, the CMVP / FIPS 140-3 validation status, the supply chain posture under the *Direction on Vulnerable Suppliers*, and the authorisation status. Note any open items — pending CMVP confirmations, unresolved supplier flags, or conditions imposed by the authorising official.]

## Information Asset Categorisation

> Score Confidentiality (C), Integrity (I), and Availability (A) per the TBS *Standard on Security Categorization* injury-based matrix (Low / Medium / High). Aggregate to a system-level categorisation using the high-water mark across the asset inventory.

| Asset | Confidentiality (L/M/H) | Integrity (L/M/H) | Availability (L/M/H) | Aggregate (L/M/H) | Categorisation Level |
|-------|--------------------------|-------------------|----------------------|---------------------|----------------------|
| [Asset 1 — e.g. citizen application records] | [score + injury rationale] | [score + injury rationale] | [score + injury rationale] | [aggregate] | [UNCLASSIFIED / Protected A / Protected B / Protected C / CONFIDENTIAL / SECRET / TOP SECRET] |
| [Asset 2 — e.g. payment instructions] | [score + injury rationale] | [score + injury rationale] | [score + injury rationale] | [aggregate] | [level] |
| [Asset 3 — e.g. audit logs] | [score + injury rationale] | [score + injury rationale] | [score + injury rationale] | [aggregate] | [level] |
| [Asset 4 — e.g. cryptographic key material] | [score + injury rationale] | [score + injury rationale] | [score + injury rationale] | [aggregate] | [level] |

**System-level categorisation**: [high-water mark across the inventory] — [one-paragraph rationale]

## Control Profile Selection

| Selected Profile | Categorisation Rationale | Tailoring Summary | Approver |
|------------------|--------------------------|-------------------|----------|
| [PBMM / PBMM-Cloud / Secret-High / Top-Secret-High] | [why this profile matches the system-level categorisation] | [count of additions / removals / parameter overrides + one-line summary; full detail in the SoA below] | [Security Authority — name and role] |

## Statement of Applicability

> Per ITSG-33, structured by the 16 NIST SP 800-53-derived control families. Mark each control as **Applicable**, **Not Applicable**, or **Compensating Control**. Where Compensating, name the substitute control and capture the residual-risk acceptance rationale.

### AC — Access Control

| Control | Applicable / NA / Compensating | Tailoring | Rationale | Compensating Control (if any) |
|---------|--------------------------------|-----------|-----------|-------------------------------|
| AC-* | [A / NA / C] | [parameter values, additions, removals] | [why] | [substitute + residual-risk acceptance] |

### AU — Audit and Accountability

| Control | Applicable / NA / Compensating | Tailoring | Rationale | Compensating Control (if any) |
|---------|--------------------------------|-----------|-----------|-------------------------------|
| AU-* | [A / NA / C] | [tailoring] | [why] | [substitute] |

### CA — Security Assessment and Authorization

| Control | Applicable / NA / Compensating | Tailoring | Rationale | Compensating Control (if any) |
|---------|--------------------------------|-----------|-----------|-------------------------------|
| CA-* | [A / NA / C] | [tailoring] | [why] | [substitute] |

### CM — Configuration Management

| Control | Applicable / NA / Compensating | Tailoring | Rationale | Compensating Control (if any) |
|---------|--------------------------------|-----------|-----------|-------------------------------|
| CM-* | [A / NA / C] | [tailoring] | [why] | [substitute] |

### CP — Contingency Planning

| Control | Applicable / NA / Compensating | Tailoring | Rationale | Compensating Control (if any) |
|---------|--------------------------------|-----------|-----------|-------------------------------|
| CP-* | [A / NA / C] | [tailoring] | [why] | [substitute] |

### IA — Identification and Authentication

| Control | Applicable / NA / Compensating | Tailoring | Rationale | Compensating Control (if any) |
|---------|--------------------------------|-----------|-----------|-------------------------------|
| IA-* | [A / NA / C] | [tailoring] | [why] | [substitute] |

### IR — Incident Response

| Control | Applicable / NA / Compensating | Tailoring | Rationale | Compensating Control (if any) |
|---------|--------------------------------|-----------|-----------|-------------------------------|
| IR-* | [A / NA / C] | [tailoring] | [why] | [substitute] |

### MA — Maintenance

| Control | Applicable / NA / Compensating | Tailoring | Rationale | Compensating Control (if any) |
|---------|--------------------------------|-----------|-----------|-------------------------------|
| MA-* | [A / NA / C] | [tailoring] | [why] | [substitute] |

### MP — Media Protection

| Control | Applicable / NA / Compensating | Tailoring | Rationale | Compensating Control (if any) |
|---------|--------------------------------|-----------|-----------|-------------------------------|
| MP-* | [A / NA / C] | [tailoring] | [why] | [substitute] |

### PE — Physical and Environmental Protection

| Control | Applicable / NA / Compensating | Tailoring | Rationale | Compensating Control (if any) |
|---------|--------------------------------|-----------|-----------|-------------------------------|
| PE-* | [A / NA / C] | [tailoring] | [why] | [substitute] |

### PL — Planning

| Control | Applicable / NA / Compensating | Tailoring | Rationale | Compensating Control (if any) |
|---------|--------------------------------|-----------|-----------|-------------------------------|
| PL-* | [A / NA / C] | [tailoring] | [why] | [substitute] |

### PS — Personnel Security

| Control | Applicable / NA / Compensating | Tailoring | Rationale | Compensating Control (if any) |
|---------|--------------------------------|-----------|-----------|-------------------------------|
| PS-* | [A / NA / C] | [tailoring] | [why] | [substitute] |

### RA — Risk Assessment

| Control | Applicable / NA / Compensating | Tailoring | Rationale | Compensating Control (if any) |
|---------|--------------------------------|-----------|-----------|-------------------------------|
| RA-* | [A / NA / C] | [tailoring] | [why] | [substitute] |

### SA — System and Services Acquisition

| Control | Applicable / NA / Compensating | Tailoring | Rationale | Compensating Control (if any) |
|---------|--------------------------------|-----------|-----------|-------------------------------|
| SA-* | [A / NA / C] | [tailoring] | [why] | [substitute] |

### SC — System and Communications Protection

| Control | Applicable / NA / Compensating | Tailoring | Rationale | Compensating Control (if any) |
|---------|--------------------------------|-----------|-----------|-------------------------------|
| SC-* | [A / NA / C] | [tailoring] | [why] | [substitute] |

### SI — System and Information Integrity

| Control | Applicable / NA / Compensating | Tailoring | Rationale | Compensating Control (if any) |
|---------|--------------------------------|-----------|-----------|-------------------------------|
| SI-* | [A / NA / C] | [tailoring] | [why] | [substitute] |

## Cryptographic Module Validation

> Every cryptographic module protecting Protected B and above must hold a current CMVP / FIPS 140-3 certificate. Modules off the active CMVP list are findings, not negotiation items.

| Module | Vendor | CMVP Certificate # | Validation Level (FIPS 140-3) | Algorithm Scope | Status (Active / Historical / Not Validated) |
|--------|--------|--------------------|---------------------------------|-----------------|------------------------------------------------|
| [Module 1 — e.g. TLS module on the API gateway] | [vendor] | [#xxxx] | [Level 1 / 2 / 3 / 4] | [AES-GCM, RSA-OAEP, ECDSA-P256, etc.] | [Active / Historical / Not Validated — finding if Historical or Not Validated] |
| [Module 2 — e.g. database TDE module] | [vendor] | [#xxxx] | [Level] | [scope] | [status] |
| [Module 3 — e.g. signing key HSM] | [vendor] | [#xxxx] | [Level] | [scope] | [status] |

## Supply Chain Security

> Apply the TBS *Direction on Vulnerable Suppliers* and the published sanctioned-entities list across the full inventory: prime, sub-processors, telecommunications equipment subject to PSPC restrictions, and managed services with inherited supplier dependencies.

| Supplier | Tier (Prime / Sub-processor / Equipment / Managed Service) | Vulnerable Suppliers Screen (Pass / Flag / Fail) | Sanctioned-Entities Screen (Pass / Flag / Fail) | Status / Action |
|----------|-------------------------------------------------------------|--------------------------------------------------|--------------------------------------------------|------------------|
| [Supplier 1 — prime contractor] | [tier] | [Pass / Flag / Fail + rationale] | [Pass / Flag / Fail + rationale] | [Cleared / Mitigation in place / Blocker] |
| [Supplier 2 — sub-processor or named third party] | [tier] | [screen] | [screen] | [status] |
| [Supplier 3 — telecommunications or network equipment] | [tier] | [screen] | [screen] | [status] |
| [Supplier 4 — managed service / hyperscaler / SaaS] | [tier] | [screen] | [screen] | [status] |

## Continuous Monitoring Plan

| Family | Control | Frequency | Tool / Evidence Source | Reporting Cadence | Owner |
|--------|---------|-----------|------------------------|-------------------|-------|
| AC | [Control] | [Continuous / Daily / Monthly / Quarterly / Annual] | [SIEM / IAM analytics / config-as-code repo] | [Cadence + recipients] | [Role] |
| AU | [Control] | [Frequency] | [Tool] | [Cadence] | [Role] |
| CA | [Control] | [Frequency] | [Tool] | [Cadence] | [Role] |
| CM | [Control] | [Frequency] | [Tool] | [Cadence] | [Role] |
| CP | [Control] | [Frequency] | [Tool] | [Cadence] | [Role] |
| IA | [Control] | [Frequency] | [Tool] | [Cadence] | [Role] |
| IR | [Control] | [Frequency] | [Tool] | [Cadence] | [Role] |
| MA | [Control] | [Frequency] | [Tool] | [Cadence] | [Role] |
| MP | [Control] | [Frequency] | [Tool] | [Cadence] | [Role] |
| PE | [Control] | [Frequency] | [Tool] | [Cadence] | [Role] |
| PL | [Control] | [Frequency] | [Tool] | [Cadence] | [Role] |
| PS | [Control] | [Frequency] | [Tool] | [Cadence] | [Role] |
| RA | [Control] | [Frequency] | [Tool] | [Cadence] | [Role] |
| SA | [Control] | [Frequency] | [Tool] | [Cadence] | [Role] |
| SC | [Control] | [Frequency] | [Tool] | [Cadence] | [Role] |
| SI | [Control] | [Frequency] | [Tool] | [Cadence] | [Role] |

**Re-categorisation triggers**: [list — new data elements; new processing purposes; change of operating environment; change of supplier; security incident materially altering the threat picture; expiry of the authorisation cycle]

## Authorisation Chain

| Role | Holder | Authorisation Date | Conditions | Re-authorisation Trigger |
|------|--------|--------------------|------------|--------------------------|
| System Owner | [name] | [YYYY-MM-DD] | [conditions, if any] | [trigger — periodic + event-driven] |
| Security Authority | [name] | [YYYY-MM-DD] | [conditions, if any] | [trigger] |
| Authorising Official (ADM or delegate) | [name] | [YYYY-MM-DD] | [conditions imposed on go-live or operation] | [periodic re-authorisation cycle + event-driven triggers] |

## Open Items

| ID | Description | Owner | Due Date | Status |
|----|-------------|-------|----------|--------|
| OI-1 | [Outstanding tailoring decision / unfinished CMVP confirmation / unresolved supplier flag / authorisation condition] | [Role] | [YYYY-MM-DD] | [Open / In Progress / Closed] |
| OI-2 | [item] | [owner] | [date] | [status] |

## External References

### Document Register

| Doc ID | Title | URL | Verified date |
|--------|-------|-----|---------------|
| CA-ITSG-33 | ITSG-33 — IT Security Risk Management: A Lifecycle Approach (CSE / Canadian Centre for Cyber Security) | <https://cyber.gc.ca/en/guidance/itsg-33> | [YYYY-MM-DD] |
| CA-TBS-CAT | TBS Standard on Security Categorization | <https://www.tbs-sct.canada.ca/pol/doc-eng.aspx?id=16578> | [YYYY-MM-DD] |
| CA-TBS-PGS | TBS Policy on Government Security | <https://www.tbs-sct.canada.ca/pol/doc-eng.aspx?id=16578> | [YYYY-MM-DD] |
| CA-VULN-SUP | TBS Direction on Vulnerable Suppliers | <https://www.canada.ca/en/government/system/digital-government/online-security-privacy.html> | [YYYY-MM-DD] |
| CA-CMVP | CMVP Active Validated Modules List | <https://csrc.nist.gov/projects/cryptographic-module-validation-program/validated-modules> | [YYYY-MM-DD] |
| CA-FIPS-140-3 | FIPS 140-3 — Security Requirements for Cryptographic Modules | <https://csrc.nist.gov/publications/detail/fips/140/3/final> | [YYYY-MM-DD] |

### Citations

| Citation | Doc ID | Section | Used in |
|----------|--------|---------|---------|
| [ITSG33-1] | CA-ITSG-33 | Categorisation methodology | Information Asset Categorisation |
| [ITSG33-2] | CA-ITSG-33 | Control profiles (PBMM / PBMM-Cloud / Secret / Top Secret) | Control Profile Selection |
| [ITSG33-3] | CA-ITSG-33 | 16-family control catalogue | Statement of Applicability |
| [TBS-CAT-1] | CA-TBS-CAT | Injury-based C / I / A scoring matrix | Information Asset Categorisation |
| [TBS-PGS-1] | CA-TBS-PGS | Authorisation chain and re-authorisation cycle | Authorisation Chain |
| [VULN-SUP-1] | CA-VULN-SUP | Supplier screening obligations and scope | Supply Chain Security |
| [CMVP-1] | CA-CMVP | Active validated modules list — modules off-list are findings | Cryptographic Module Validation |
| [FIPS-1] | CA-FIPS-140-3 | Validation levels (1–4) and algorithm scope | Cryptographic Module Validation |

### Unreferenced Documents

[List any documents read during generation but not cited, or "None".]
