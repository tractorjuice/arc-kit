# Data Source Discovery: [PROJECT_NAME]

> **Template Status**: Alpha | **Version**: [VERSION] | **Command**: `/arckit.datascout`

## Document Control

| Field | Value |
|-------|-------|
| **Document ID** | ARC-[PROJECT_ID]-DSCT-v[VERSION] |
| **Document Type** | Data Source Discovery |
| **Project** | [PROJECT_NAME] (Project [PROJECT_ID]) |
| **Classification** | [PUBLIC / OFFICIAL / OFFICIAL-SENSITIVE / SECRET] |
| **Status** | [DRAFT / IN_REVIEW / APPROVED / PUBLISHED / SUPERSEDED / ARCHIVED] |
| **Version** | [VERSION] |
| **Created Date** | [YYYY-MM-DD] |
| **Last Modified** | [YYYY-MM-DD] |
| **Review Cycle** | [Monthly / Quarterly / Annual / On-Demand] |
| **Next Review Date** | [YYYY-MM-DD] |
| **Owner** | [OWNER_NAME_AND_ROLE] |
| **Reviewed By** | [REVIEWER_NAME] ([YYYY-MM-DD]) or PENDING |
| **Approved By** | [APPROVER_NAME] ([YYYY-MM-DD]) or PENDING |
| **Distribution** | [DISTRIBUTION_LIST] |

## Revision History

| Version | Date | Author | Changes | Approved By | Approval Date |
|---------|------|--------|---------|-------------|---------------|
| [VERSION] | [DATE] | ArcKit AI | Initial creation from `/arckit.datascout` agent | PENDING | PENDING |

---

## Executive Summary

### Data Needs Overview

This document presents data source discovery findings for the **[PROJECT_NAME]** project, identifying external APIs, datasets, and data portals that can fulfil the data and integration requirements documented in `ARC-{PROJECT_ID}-REQ-v*.md`.

**Requirements Analyzed**: [X] data requirements (DR-xxx), [Y] functional requirements (FR-xxx), [Z] integration requirements (INT-xxx), [W] non-functional requirements (NFR-xxx)

**Data Source Categories Identified**: [N] categories based on requirement analysis

**Discovery Approach**: [UK Government open data, commercial API research, free/freemium API discovery, WebSearch-powered market research]

### Key Findings

[3-5 bullet points summarizing the most important findings]

- **[Category]**: [Source] — [Key reason for recommendation]
- **[Category]**: [Source] — [Key reason for recommendation]
- **[Category]**: [Source] — [Key reason for recommendation]

### Data Source Summary

| Source Type | Count | Cost Range | Key Providers |
|-------------|-------|------------|---------------|
| **UK Government Open Data** | [X] | Free (OGL) | [List] |
| **Commercial APIs** | [Y] | £[X]-£[Y]/year | [List] |
| **Free/Freemium APIs** | [Z] | Free (rate-limited) | [List] |
| **Open Source Datasets** | [W] | Free | [List] |
| **TOTAL** | [Total] | £[LOW]-£[HIGH]/year | |

### Top Recommended Sources

**Shortlist for integration**:

1. **[Source 1]** for [Category]: [Key strengths, score /100]
2. **[Source 2]** for [Category]: [Key strengths, score /100]
3. **[Source 3]** for [Category]: [Key strengths, score /100]
4. **[Source 4]** for [Category]: [Key strengths, score /100]
5. **[Source 5]** for [Category]: [Key strengths, score /100]

### Requirements Coverage

- ✅ **[X] requirements ([Y%])** fully matched to external data sources
- ⚠️ **[Z] requirements ([W%])** partially matched (quality or coverage concerns)
- ❌ **[A] requirements ([B%])** no suitable external source found (gaps)

---

## Data Needs Analysis

> **Note**: Data needs are extracted from requirements, categorised by type, with criticality and volume/freshness expectations.

### Extracted Data Needs

| # | Requirement ID | Data Need | Type | Criticality | Volume | Freshness | Source Category |
|---|----------------|-----------|------|-------------|--------|-----------|-----------------|
| 1 | DR-001 | [Description] | Data | MUST | [Estimate] | [Real-time/Daily/Weekly] | [Category] |
| 2 | DR-002 | [Description] | Data | SHOULD | [Estimate] | [Daily/Monthly] | [Category] |
| 3 | FR-xxx | [Description] | Functional | MUST | [Estimate] | [Frequency] | [Category] |
| 4 | INT-xxx | [Description] | Integration | MUST | [Estimate] | [Frequency] | [Category] |
| 5 | NFR-xxx | [Description] | Non-Functional | MUST | — | — | [Constraint] |

### Data Needs by Category

**Category 1: [CATEGORY_NAME]**
- Requirements: [DR-001, FR-015, INT-003]
- Data fields needed: [List specific fields]
- Volume: [Records/day, queries/second]
- Freshness: [Real-time, hourly, daily, monthly]
- Quality threshold: [Accuracy %, completeness %]

**Category 2: [CATEGORY_NAME]**
- [Repeat structure]

---

## Data Source Discovery

> **Note**: Categories are dynamically identified from project requirements, not a fixed list.

---

## Category 1: [CATEGORY_NAME]

**Requirements Addressed**: [DR-001, FR-015, INT-003]

**Why This Category**: [Explain what data is needed and why, based on requirements]

**Data Fields Needed**: [Specific fields: name, type, format]

---

### Source 1A: [SOURCE_NAME] (Open Data)

**Provider**: [Organisation, department, URL]

**Description**: [What data is provided, scope, coverage]

**Key Details**:

| Attribute | Value |
|-----------|-------|
| **License** | [Open Government Licence v3.0 / Creative Commons / Proprietary] |
| **Pricing** | [Free / Freemium / £X per Y] |
| **Format** | [JSON / CSV / XML / GeoJSON / SPARQL] |
| **API Endpoint** | [Base URL or download link] |
| **Authentication** | [None / API Key / OAuth 2.0] |
| **Rate Limits** | [X requests/minute, Y requests/day] |
| **Update Frequency** | [Real-time / Hourly / Daily / Monthly / Quarterly / Annual] |
| **Coverage** | [Geographic: UK-wide / England only / etc.] |
| **Temporal Coverage** | [From YYYY to present] |
| **Data Quality** | [Completeness %, known issues] |
| **Documentation** | [URL, quality: Excellent/Good/Fair/Poor] |
| **SLA** | [Uptime guarantee, response time] |
| **GDPR Status** | [No personal data / Anonymised / Contains PII] |
| **UK Data Residency** | [Yes / No / N/A] |

**Requirements Fit**:
- ✅ Covers: [Which data fields match requirements]
- ❌ Missing: [Which data fields are not available]
- ⚠️ Partial: [Which data fields have quality/coverage issues]

**Integration Approach**:
- **Pattern**: [REST API call / Bulk download + ETL / Event stream / Cache + refresh]
- **Estimated Effort**: [X person-days]
- **Dependencies**: [API key registration, data agreement, etc.]

**Evaluation Score**:

| Criterion | Weight | Score | Weighted |
|-----------|--------|-------|----------|
| Requirements Fit | 25% | [/10] | [/25] |
| Data Quality | 20% | [/10] | [/20] |
| License & Cost | 15% | [/10] | [/15] |
| API Quality | 15% | [/10] | [/15] |
| Compliance | 15% | [/10] | [/15] |
| Reliability | 10% | [/10] | [/10] |
| **Total** | **100%** | | **[/100]** |

---

### Source 1B: [ANOTHER_SOURCE] (Commercial)

[Repeat structure for each source in this category]

---

### Source 1C: [ANOTHER_SOURCE] (Free API)

[Repeat structure for each source in this category]

---

### Comparison Table: [CATEGORY_NAME]

| Criterion | [Source A] | [Source B] | [Source C] |
|-----------|-----------|-----------|-----------|
| **Provider** | [Name] | [Name] | [Name] |
| **License** | [OGL] | [Commercial] | [Free tier] |
| **Cost (Annual)** | [£0] | [£X] | [£0 / £Y over limit] |
| **Coverage** | [UK-wide] | [Global] | [UK-wide] |
| **Freshness** | [Daily] | [Real-time] | [Hourly] |
| **API Quality** | [Good] | [Excellent] | [Fair] |
| **Requirements Fit** | [/25] | [/25] | [/25] |
| **Data Quality** | [/20] | [/20] | [/20] |
| **License & Cost** | [/15] | [/15] | [/15] |
| **API Quality** | [/15] | [/15] | [/15] |
| **Compliance** | [/15] | [/15] | [/15] |
| **Reliability** | [/10] | [/10] | [/10] |
| **TOTAL SCORE** | **[/100]** | **[/100]** | **[/100]** |

**Recommendation for [CATEGORY]**: [Source name] — [2-3 sentence rationale]

---

## Category 2: [ANOTHER_CATEGORY]

[Repeat entire category structure for each data source category identified from requirements]

---

## Evaluation Matrix

### Overall Scoring Summary

| Category | Recommended Source | Type | Score | Annual Cost | Integration Effort |
|----------|-------------------|------|-------|-------------|-------------------|
| [Category 1] | [Source name] | [Open/Commercial/Free] | [/100] | [£X] | [Y days] |
| [Category 2] | [Source name] | [Open/Commercial/Free] | [/100] | [£X] | [Y days] |
| [Category 3] | [Source name] | [Open/Commercial/Free] | [/100] | [£X] | [Y days] |
| **TOTAL** | | | **Avg: [/100]** | **£[TOTAL]/year** | **[TOTAL] days** |

### Evaluation Criteria Explained

| Criterion | Weight | What It Measures |
|-----------|--------|-----------------|
| **Requirements Fit** | 25% | Does the source cover the required data fields, scope, granularity, and volume? |
| **Data Quality** | 20% | Accuracy, completeness, consistency, timeliness, and known quality issues |
| **License & Cost** | 15% | License terms (OGL, CC, proprietary), pricing sustainability, total cost |
| **API Quality** | 15% | REST/GraphQL, documentation quality, SDKs, versioning, error handling, pagination |
| **Compliance** | 15% | GDPR, UK data residency, data classification, terms of use, DPA 2018 |
| **Reliability** | 10% | SLA, uptime history, vendor stability, community/support, track record |

---

## Data Integration Architecture

### Integration Patterns by Source

| Source | Pattern | Auth | Caching | Error Handling | Monitoring |
|--------|---------|------|---------|----------------|------------|
| [Source 1] | [REST API / Bulk ETL / Event stream] | [API Key / OAuth] | [TTL: Xh / None] | [Retry 3x / Circuit breaker] | [Health check / Alert] |
| [Source 2] | [Pattern] | [Auth] | [Cache] | [Error] | [Monitor] |

### Recommended Integration Architecture

```
[Brief description of integration approach]

- Data ingestion layer (API gateway, ETL pipeline)
- Caching strategy (Redis, CDN, application cache)
- Fallback strategy (stale cache, degraded mode, alternative source)
- Monitoring (API health, data freshness, quality metrics)
```

### Authentication and Access

| Source | Auth Method | Credentials Required | Registration Process | Lead Time |
|--------|-----------|---------------------|---------------------|-----------|
| [Source] | [API Key] | [Free registration] | [Self-service portal] | [Instant / 1 day / 1 week] |

### Rate Limits and Capacity Planning

| Source | Rate Limit | Projected Usage | Headroom | Upgrade Option |
|--------|-----------|----------------|----------|---------------|
| [Source] | [X req/min] | [Y req/min] | [Z%] | [Paid tier: £X/month] |

---

## Data Utility Analysis

> **Note**: Most data sources have alternative and secondary uses beyond their primary requirement. Identifying these latent uses increases the strategic value of data investments.

### Utility by Source

| Source | Primary Use (Requirement) | Secondary Uses | Strategic Value | Combination Opportunities |
|--------|--------------------------|----------------|-----------------|--------------------------|
| [Source 1] | [DR-001]: [Primary use] | 1. [Secondary use 1] 2. [Secondary use 2] | [HIGH / MEDIUM / LOW] | [Combines with X to enable Y] |
| [Source 2] | [DR-002]: [Primary use] | 1. [Secondary use 1] | [MEDIUM] | [Standalone] |

### Common Secondary Use Patterns Identified

| Pattern | Source | Primary Use | Secondary Use | Value |
|---------|--------|-------------|---------------|-------|
| **Proxy Indicator** | [Source] | [Direct measurement] | [Proxy for something not directly measurable] | [Description] |
| **Cross-Domain Enrichment** | [Source] | [Domain A insight] | [Enriches Domain B analysis] | [Description] |
| **Trend Detection** | [Source] | [Current state monitoring] | [Reveals patterns/anomalies over time] | [Description] |
| **Predictive Feature** | [Source] | [Descriptive reporting] | [Input feature for predictive models] | [Description] |

### Data Combination Opportunities

[Identify where combining two or more sources unlocks insights that neither provides alone]

1. **[Combination Name]**: [Source A] + [Source B] → [Insight/capability enabled]
   - Example: Transport flow data + property listings → predict neighbourhood desirability trends
2. **[Combination Name]**: [Source C] + [Source D] → [Insight/capability enabled]

---

## Gap Analysis

### Requirements Without Suitable Data Sources

**GAP-1**: [Requirement ID] — [Requirement description]
- **Data Need**: [What data is missing]
- **Why No Source**: [No public API, data is proprietary, coverage insufficient, quality too low]
- **Impact**: [What cannot be delivered, affected features/capabilities]
- **Severity**: [CRITICAL / HIGH / MEDIUM / LOW]
- **Recommended Action**: [Build internal data collection / Negotiate data sharing / Commission bespoke data / Defer requirement / Use proxy data]
- **Estimated Effort**: [Person-days/weeks to resolve]
- **Cost Estimate**: [£X if applicable]

**GAP-2**: [Another gap]

[Repeat for each gap]

### Gap Summary

| Gap | Requirement | Severity | Recommended Action | Effort | Cost |
|-----|-------------|----------|-------------------|--------|------|
| GAP-1 | [ID] | [CRITICAL] | [Action] | [X days] | [£Y] |
| GAP-2 | [ID] | [HIGH] | [Action] | [X days] | [£Y] |

---

## Recommendations & Shortlist

### Top 3-5 Recommended Sources

#### 1. [SOURCE_NAME] for [Category]

**Overall Score**: [X/100]

**Rationale**: [2-3 sentences explaining why this is recommended]

**Key Strengths**:
- ✅ [Strength 1]
- ✅ [Strength 2]
- ✅ [Strength 3]

**Key Concerns**:
- ⚠️ [Concern 1, if any]
- ⚠️ [Concern 2, if any]

**Cost**: [Free / £X/year]
**Integration Effort**: [X person-days]
**Risk Level**: [LOW / MEDIUM / HIGH]

**Next Steps**:
- [ ] Register for API access
- [ ] Conduct integration POC ([X] days)
- [ ] Validate data quality against requirements
- [ ] Review terms of use / data sharing agreement

#### 2. [ANOTHER_SOURCE]

[Repeat structure]

#### 3. [ANOTHER_SOURCE]

[Repeat structure]

---

## Impact on Data Model

> **Note**: Only applicable if data model (`ARC-*-DATA-*.md`) exists

### New Entities from External Sources

| Entity | Source | Description | Key Attributes | Sync Strategy |
|--------|--------|-------------|---------------|---------------|
| [Entity name] | [Source] | [What it represents] | [Key fields] | [Real-time / Batch / Cached] |

### New Attributes on Existing Entities

| Existing Entity | New Attribute | Source | Type | Update Frequency |
|----------------|---------------|--------|------|-----------------|
| [Entity] | [Attribute] | [Source] | [Type] | [Frequency] |

### New Relationships

| From Entity | To Entity | Relationship | Source | Description |
|-------------|-----------|-------------|--------|-------------|
| [Internal entity] | [External entity] | [1:N / N:M] | [Source] | [How they relate] |

### Sync Strategy

| Source | Pattern | Frequency | Staleness Tolerance | Fallback |
|--------|---------|-----------|--------------------|---------|
| [Source] | [API call on demand / Scheduled ETL / Event-driven] | [Real-time / Hourly / Daily] | [X hours] | [Serve stale cache / Degrade gracefully / Block] |

---

## UK Government Open Data Opportunities

> **Note**: Only applicable if this is a UK Government project

### TCoP Point 10: Make Better Use of Data

**Open Data Consumed**:
| Source | Dataset | License | Requirement | Status |
|--------|---------|---------|-------------|--------|
| [data.gov.uk] | [Dataset name] | OGL v3.0 | [DR-xxx] | ✅ Recommended |
| [ONS] | [Dataset name] | OGL v3.0 | [DR-xxx] | ✅ Recommended |

**Open Data Publishing Opportunities**:
- [Data that could be published as open data from this project]
- [Datasets that would benefit the wider public sector]

**Common Data Standards Used**:
- [UPRN for property addresses]
- [Company Number for business entities]
- [NHS Number for patient identification]
- [Other UK Government identifiers]

**Data Ethics Framework Compliance**:
- [ ] Clear user need for data collection
- [ ] Proportionate to the need
- [ ] Lawful basis established
- [ ] Data minimisation applied
- [ ] Transparency about data use
- [ ] Data quality maintained

---

## Requirements Traceability

### Full Mapping Table

| Requirement ID | Requirement Description | Data Source | Score | Status | Notes |
|----------------|------------------------|-------------|-------|--------|-------|
| DR-001 | [Description] | [Source name] | [/100] | ✅ Matched | [Notes] |
| DR-002 | [Description] | [Source A, Source B] | [/100] | ✅ Matched | [Multiple options] |
| DR-003 | [Description] | — | — | ❌ Gap | [See GAP-1] |
| FR-xxx | [Description] | [Source name] | [/100] | ⚠️ Partial | [Coverage issue] |
| INT-xxx | [Description] | [Source name] | [/100] | ✅ Matched | [Notes] |
| NFR-xxx | [Description] | — | — | ✅ Constraint | [Applied to all sources] |

### Coverage Summary

**Requirements with Identified Sources**:
- ✅ **[X] requirements ([Y%])** have recommended data sources
- ⚠️ **[Z] requirements ([W%])** partially covered (quality or coverage issues)
- ❌ **[A] requirements ([B%])** no suitable source (see Gap Analysis)

---

## Next Steps

### Immediate Actions (0-2 weeks)

1. **Register for API access** for top recommended sources
2. **Review data sharing agreements** and terms of use
3. **Conduct integration POCs** for critical data sources (top 2-3)
4. **Validate data quality** against requirement thresholds

### Data Model Updates (2-4 weeks)

5. **Update data model** with external data entities (`/arckit.data-model`)
6. **Create ADRs** for significant data source decisions (`/arckit.adr`)
7. **DPIA review** for sources containing personal data (`/arckit.dpia`)

### Gap Resolution (4-8 weeks)

8. **Address gaps**: Negotiate data sharing, build internal collection, or defer
9. **Negotiate contracts** for commercial data sources
10. **Establish monitoring** for data quality and API health

### Integration (Ongoing)

11. **Build data ingestion pipelines** based on recommended integration patterns
12. **Implement caching** and fallback strategies
13. **Set up data quality monitoring** dashboards
14. **Document data lineage** for audit and compliance

---

## Appendices

### Appendix A: Research Methodology

**Data Sources Searched**:
- UK Government open data portals (data.gov.uk, ONS, NHS Digital, etc.)
- Commercial data provider websites
- API directories and documentation
- GitHub and open source repositories
- Industry analyst reports and reviews

**Evaluation Methodology**:
- Weighted scoring across 6 criteria (Requirements Fit 25%, Data Quality 20%, License & Cost 15%, API Quality 15%, Compliance 15%, Reliability 10%)
- All scores based on verified information from official sources
- Pricing verified from vendor websites or documentation
- API quality assessed from documentation review

**Limitations**:
- Pricing based on published rates (volume discounts may be available)
- API quality assessed from documentation, not hands-on testing
- Data quality indicators from provider claims (validate during POC)
- Market evolves — discovery valid for approximately 6 months

### Appendix B: Glossary

- **API**: Application Programming Interface
- **ETL**: Extract, Transform, Load
- **OGL**: Open Government Licence
- **GDPR**: General Data Protection Regulation (UK GDPR / EU GDPR)
- **DPA 2018**: Data Protection Act 2018
- **TCoP**: Technology Code of Practice (UK Government)
- **SLA**: Service Level Agreement
- **TTL**: Time To Live (cache expiry)
- **UPRN**: Unique Property Reference Number
- **PII**: Personally Identifiable Information

## External References

| Document | Type | Source | Key Extractions | Path |
|----------|------|--------|-----------------|------|
| *None provided* | — | — | — | — |

---

**Generated by**: ArcKit `/arckit.datascout` agent
**Generated on**: [DATE]
**ArcKit Version**: [VERSION]
**Project**: [PROJECT_NAME]
**Model**: [AI_MODEL]
