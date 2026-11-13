# Technology and Service Research: [PROJECT_NAME]

> **Template Origin**: Official | **ArcKit Version**: [VERSION] | **Command**: `/arckit:research`

## Document Control

<!-- DOC-CONTROL-HEADER -->
<!-- Resolved at command-execution time per _partials/RENDERING.md. -->

## Revision History

| Version | Date | Author | Changes | Approved By | Approval Date |
|---------|------|--------|---------|-------------|---------------|
| [VERSION] | [DATE] | ArcKit AI | Initial creation from `/arckit:research` agent | PENDING | PENDING |

---

## Executive Summary

### Key Findings

**Headline**: [One sentence: what the research found across the categories, e.g. "Off-the-shelf options cover [Y] of [Total] categories in full; no option covers [Category]."]

[One bullet per research category. As many as there are categories; not a fixed number.]

- **[Category]**: [What was found: options covering it, utility or GOV.UK platform, open source, cost range]
- **[Category]**: [What was found]
- **[Category]**: [What was found]

### Market Summary

| Category | Options Found | Cover Fully | Cover 70%+ (Vendors) | Utility or GOV.UK Platform | Open Source | Published 3-Year Cost Range |
|----------|---------------|-------------|----------------------|----------------------------|-------------|-----------------------------|
| [Category 1] | [X] | [Y] | [Z] ([V] vendors) | [Name or none] | [Name or none] | £[MIN] to £[MAX] ([U] unpriced) |
| [Category 2] | [X] | [Y] | [Z] ([V] vendors) | [Name or none] | [Name or none] | £[MIN] to £[MAX] ([U] unpriced) |

### Requirements Coverage

- ✅ **[X%]** of requirements are covered by at least one option
- ⚠️ **[Y]** requirements are covered by no option found
- 🔍 **[Z]** requirements need further research or clarification

### Research Scope

This document reports the technology, services and products found that could meet the requirements documented in `ARC-{PROJECT_ID}-REQ-v*.md`: what each offers and lacks, with sources, and what it costs. It makes no build-or-buy decision and ranks no option. `/arckit:wardley` decides how to source each capability, `/arckit:sobc` appraises value for money, and `/arckit:evaluate` scores suppliers.

**Requirements Analyzed**: [X] functional, [Y] non-functional, [Z] integration, [W] data requirements

**Research Categories Identified**: [X] categories based on requirement analysis

**Research Approach**: [Market research, UK Government Digital Marketplace search, open source assessment, supplier price documents]

---

## Research Categories

> **Note**: Research categories are dynamically identified based on project requirements, not a fixed list. Options within a category are listed by how much of it they cover. That order is for reading, not a ranking.

---

## Category 1: [CATEGORY_NAME]

**Requirements Addressed**: [List requirement IDs: FR-001, FR-015, NFR-SEC-003]

**Capabilities Required**: [The category's required capability tags]

**Why This Category**: [Explain why this capability is needed based on requirements]

---

### Option 1A: Build Estimate

> An orchestrator estimate for building this capability in-house, for `/arckit:sobc`'s options appraisal. No supplier sourced it.

**Description**: [What would be built]

**Effort Estimate**:

- **Development**: [X] person-weeks
- **Basis**: [How the estimate was made]

**Cost Breakdown**:
| Cost Item | Year 1 | Year 2 | Year 3 | Notes |
|-----------|--------|--------|--------|-------|
| Development | £[X] | £0 | £0 | [Rate] × [person-weeks] |
| Run (20% of build a year) | £[Z] | £[Z] | £[Z] | Hosting, fixes, updates |
| **Total** | **£[T1]** | **£[T2]** | **£[T3]** | |
| **3-Year Cost** | | | **£[TOTAL]** | Estimate |

---

### Option 1B: [VENDOR_NAME / PRODUCT_NAME]

**Description**: [What the product does, as its own pages describe it]

**Option Type**: [SaaS | Marketplace listing | Managed service | Self-hosted commercial]

**Coverage**: [X of Y required capabilities (Z%), missing: …] [CITATION]

**Meets**:

- ✅ [Requirement or condition met, with evidence] [CITATION]
- ✅ [Requirement or condition met, with evidence] [CITATION]

**Lacks**:

- ❌ [Requirement or condition not met, with evidence] [CITATION]

**Not Evidenced**: [Fields the research could not confirm either way]

**Pricing Model**: [Per user, per transaction, tiered, usage-based, custom quote]

**Cost Breakdown**:
| Cost Item | Year 1 | Year 2 | Year 3 | Notes |
|-----------|--------|--------|--------|-------|
| Setup/onboarding | £[X] | £0 | £0 | One-time, as published |
| Subscription | £[Y] | £[Y] | £[Y] | [Tier], as published |
| **Total** | **£[T1]** | **£[T2]** | **£[T3]** | |
| **3-Year Cost** | | | **£[TOTAL]** | Published prices only |

**Pricing Tiers** (as published):

- **[Tier]**: £[X]/[period] - [Included limits]

**Integration**:

- **APIs**: [Protocols, as published]
- **SDKs**: [Languages, as published]
- **Authentication**: [Methods, as published]

**Compliance & Security**:

- **Certifications**: [As published]
- **UK Data Residency**: [Yes | No | Not evidenced]
- **GDPR Data Processing Agreement**: [Yes | No | Not evidenced]
- **Accessibility**: [WCAG conformance, as stated]

**Vendor**:

- **Founded**: [Year]
- **Ownership**: [Public company, private, foundation, government]
- **Customers**: [Count or named customers, as stated]
- **Analyst Rating**: [Source, position and year, only where a named source states it]

**Support**:

- **Support Tiers**: [As published]
- **SLA**: [Uptime commitment, as published]

**Exit**:

- **Data Export**: [Formats, as published]
- **Licence**: [Licence]
- **Deployment Models**: [As published]

**Procurement**: [G-Cloud | DOS | Other framework | None found]

**References**:

- [Source pages and citation IDs]

---

### Option 1C: [ANOTHER_VENDOR / PRODUCT]

[Repeat structure for each further option]

---

### Option 1D: [OPEN_SOURCE_PROJECT] (Open Source)

**Description**: [What it does, as its own pages describe it]

**Coverage**: [X of Y required capabilities (Z%), missing: …] [CITATION]

**Meets** / **Lacks** / **Not Evidenced**: [As for Option 1B]

**Project Details**:

- **License**: [MIT, Apache 2.0, GPL, AGPL]
- **Repository**: [URL, stars, contributors]
- **Last Commit**: [Date]

**Hosting Options**:

- **Self-hosted**: Deploy on own infrastructure
- **Managed Service**: [If available, with its published price]

**Cost Breakdown**:
| Cost Item | Year 1 | Year 2 | Year 3 | Notes |
|-----------|--------|--------|--------|-------|
| Licence | £0 | £0 | £0 | Open source |
| Commercial Support (if published) | £[W] | £[W] | £[W] | As published |
| **3-Year Cost** | | | **£[TOTAL]** | Excludes hosting and operation |

**License Considerations**:

- [License name and key terms]
- [Copyleft requirements if GPL/AGPL]

---

### Option 1E: GOV.UK Platform - [PLATFORM_NAME] (UK Government Only)

> **Note**: Only applicable if this is a UK Government project (central gov, devolved administrations, NHS, local authorities, blue light services)

**Description**: [What the platform does]

**Coverage**: [X of Y required capabilities (Z%), missing: …] [CITATION]

**Eligibility**: [Who can use it, as the platform states: all public sector, central government only, etc.]

**Cost Model**:

- **Setup**: [As published]
- **Usage**: [As published]
- **Transaction Fees**: [If applicable, as published]

**Meets** / **Lacks** / **Not Evidenced**: [As for Option 1B]

**Support**:

- **Documentation**: [URL to docs]
- **SLA**: [If published]

**Mandate**: [Mandatory, recommended or neither, as the platform or policy states, with source]

---

### Market Evidence for [CATEGORY]

> Evidence for `/arckit:wardley` to judge how evolved this capability is, and for `/arckit:sobc` to appraise the options. It is not a placement or a decision.

| Measure | Finding |
|---------|---------|
| Options found | [X] |
| Cover all required capabilities | [Y] |
| Cover 70% or more | [Z], from [V] different vendors |
| Utility, managed service or GOV.UK platform covering 70%+ | [Name or none] |
| Open source covering 70%+ | [Name or none] |
| Published 3-year cost range | £[MIN] to £[MAX] ([U] options publish no price) |
| Build estimate | £[TOTAL] over 3 years ([X] person-weeks, estimate) |
| Existing Wardley map | [Map ID, component, evolution coordinate, sourcing line] or "No map covers this capability" |

**Over Budget**: [Options whose 3-year cost exceeds the stated budget, or "None" or "No budget stated"]

---

## Category 2: [ANOTHER_CATEGORY]

[Repeat structure for each research category identified from requirements]

---

## Published Costs

### Costs by Category

| Category | Options with Published Cost | Lowest 3-Year Cost | Highest 3-Year Cost | Build Estimate (3-Year) |
|----------|-----------------------------|--------------------|---------------------|-------------------------|
| [Category 1] | [X of Y] | £[MIN] | £[MAX] | £[BUILD] |
| [Category 2] | [X of Y] | £[MIN] | £[MAX] | £[BUILD] |

### Cost Assumptions

- Engineering rate for build estimates: £[X]/day
- Tier chosen: the one whose stated limits cover the project's scale, otherwise the second-cheapest, as noted per option
- Published list prices only; discounts and negotiated prices are not included
- Exchange rates: [fx_note]
- Awarded contract values from `/arckit:tenders`, where present: [Figures, with the caveat that awarded value is not actual spend]

---

## Requirements Traceability

### Requirements Coverage Matrix

| Requirement ID | Requirement Description | Research Category | Options Covering It | Evidence |
|----------------|------------------------|-------------------|---------------------|----------|
| FR-001 | [Requirement text] | [Category] | [Options] | [Citation IDs] |
| FR-002 | [Requirement text] | [Category] | [Options or gap] | [Citation IDs] |
| NFR-SEC-001 | [Requirement text] | [Category] | [Options] | [Citation IDs] |
| INT-001 | [Requirement text] | [Category] | [Options] | [Citation IDs] |
| DR-001 | [Requirement text] | [Category] | [Options] | [Citation IDs] |

### Coverage Summary

- ✅ **[X] requirements ([Y%])** are covered by at least one option found
- ⚠️ **[Z] requirements ([W%])** are covered by no option found
- 🔍 **[A] requirements ([B%])** need further research or clarification

### Gaps

**GAP-1**: [Requirement ID]: [What no option was found to cover, and why]

**GAP-2**: [Another gap]

---

## UK Government Considerations

> **Note**: Only applicable if this is a UK Government project

### Technology Code of Practice Evidence

What the research found that bears on the Technology Code of Practice. Assessing compliance is for `/arckit:tcop`.

| TCoP Point | Evidence Found |
|-----------|----------------|
| **3. Be open and use open standards** | [Options publishing open APIs and standards] |
| **4. Make use of open source** | [Open-source options found] |
| **5. Use cloud first** | [Cloud and managed options found] |
| **6. Make things secure** | [Certifications found] |
| **7. Make privacy integral** | [UK residency and data processing agreements found] |
| **8. Share, reuse and collaborate** | [GOV.UK platforms and reusable government code found] |
| **11. Define your purchasing strategy** | [Framework listings found] |

### GOV.UK Common Platforms Found

| Platform | Category | Covers | Eligibility | Source |
|----------|----------|--------|-------------|--------|
| [Platform] | [Category] | [X of Y capabilities] | [As the platform states] | [Citation] |

### Digital Marketplace Listings

| Category | Framework | Listings Found | With Published Price |
|----------|-----------|----------------|----------------------|
| [Category] | [G-Cloud 15 / DOS] | [X] | [Y] |

### Data Residency Evidence

**Data Classification**: [OFFICIAL | OFFICIAL-SENSITIVE | SECRET]

| Option | UK Data Residency | Source |
|--------|-------------------|--------|
| [Option] | [Yes, No or not evidenced] | [Citation] |

---

## Evidence for Wardley Mapping

> `/arckit:wardley` places each capability on the evolution axis and decides how to source it. This section gives it the market evidence. It does not place anything.

| Capability | Options Covering 70%+ | Vendors | Utility or GOV.UK Platform | Open Source | Existing Map Position |
|-----------|-----------------------|---------|----------------------------|-------------|-----------------------|
| [Category 1] | [Z] | [V] | [Name or none] | [Name or none] | [Map ID: evolution 0.xx, sourcing line] or none |
| [Category 2] | [Z] | [V] | [Name or none] | [Name or none] | [Map ID: evolution 0.xx, sourcing line] or none |

**Next Step**: Run `/arckit:wardley` to place these capabilities and decide how to source each one.

---

## Evidence for the Business Case

> `/arckit:sobc` builds the options, appraises value for money and identifies the preferred way forward. This section gives it the costs found. It does not choose an option.

### Cost Data for SOBC

| Category | Option | One-Off Cost | Annual Cost | 3-Year Cost | Source |
|----------|--------|--------------|-------------|-------------|--------|
| [Category] | Build estimate | £[X] | £[Y] | £[TOTAL] | Orchestrator estimate |
| [Category] | [Option] | £[X] | £[Y] | £[TOTAL] | [Citation] |

**Unpriced Options**: [Options with no published price; an RFI via `/arckit:sow` would be needed before costing them]

---

## Risks in the Evidence

Risks the evidence shows for particular options. Weighing them is for `/arckit:sobc`, `/arckit:evaluate` and `/arckit:risk`.

| Option | Risk Shown by the Evidence | Source |
|--------|---------------------------|--------|
| [Option] | [e.g. no UK data residency stated; no export format published; GPL licence] | [Citation] |

---

## Next Steps

1. **Place and source each capability**: Run `/arckit:wardley` with this research
2. **Appraise value for money**: Run `/arckit:sobc` with the cost data above
3. **Score suppliers**: Run `/arckit:evaluate` and `/arckit:score` against weighted criteria
4. **Request missing prices**: Run `/arckit:sow` for options that publish none
5. **Record the decision**: Run `/arckit:adr` once build or buy is decided
6. **Ground the market**: Run `/arckit:tenders` for real awarded contract values (UK public sector)

---

## Appendices

### Appendix A: Research Methodology

**Data Sources**:

- Vendor websites and documentation
- UK Government Digital Marketplace listings and supplier price documents
- GitHub (for open source projects)
- Analyst positions, only where a named source states them

**What Was Checked**:

- Coverage of each category's required capabilities
- Certifications, UK data residency and data processing agreements
- Integration protocols, authentication methods and SDKs
- Framework listings
- Data export, licence and deployment models
- Accessibility conformance
- Published prices

**Coverage Gaps**: [unfetched_urls and reader_errors]

**Limitations**:

- Pricing based on published list prices (discounts may be available)
- Facts are as the supplier states them, checked against the supplier's own pages
- Market rapidly evolves (research valid for ~6 months)

### Appendix B: Glossary

[Define terms used in this document]

- **SaaS**: Software as a Service
- **PaaS**: Platform as a Service
- **IaaS**: Infrastructure as a Service
- **SLA**: Service Level Agreement
- **API**: Application Programming Interface
- **SDK**: Software Development Kit
- **TCoP**: Technology Code of Practice (UK Government)

### Appendix C: Vendor Contact Information

[Contact details as published by the vendors found]

### Appendix D: Detailed Pricing Sheets

[Published pricing detail, with sources]

---

**Document History**

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 0.1 | [DATE] | [AUTHOR] | Initial draft |
| 0.2 | [DATE] | [AUTHOR] | Stakeholder feedback incorporated |
| 1.0 | [DATE] | [AUTHOR] | Approved version |

## External References

> This section provides traceability from generated content back to source documents.
> Follow citation instructions in the project's citation reference guide.

### Document Register

| Doc ID | Filename | Type | Source Location | Description |
|--------|----------|------|-----------------|-------------|
| *None provided* | — | — | — | — |

### Citations

| Citation ID | Doc ID | Page/Section | Category | Quoted Passage |
|-------------|--------|--------------|----------|----------------|
| — | — | — | — | — |

### Unreferenced Documents

| Filename | Source Location | Reason |
|----------|-----------------|--------|
| — | — | — |

---

**Generated by**: ArcKit `/arckit:research` agent
**Generated on**: [DATE]
**ArcKit Version**: [VERSION]
**Project**: [PROJECT_NAME]
**Model**: [AI_MODEL]
