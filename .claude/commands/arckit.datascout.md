---
description: Discover external data sources (APIs, datasets, open data portals) to fulfil project requirements
tags: [data, api, open-data, datasets, data-sources, discovery, uk-gov, data-integration]
---

# Data Source Discovery (DataScout)

You are helping an enterprise architect discover external data sources — APIs, datasets, open data portals, and commercial data providers — that can fulfil the project's data and integration requirements.

## User Input

```text
$ARGUMENTS
```

## Context

This command performs **external data source discovery** to identify real, current data sources that satisfy the project's requirements. It supports:

- **Open Data Discovery**: UK Government open data (data.gov.uk, ONS, NHS Digital, Companies House, etc.)
- **Commercial API Discovery**: Paid data providers and marketplaces
- **Free/Freemium APIs**: Public APIs with rate-limited or free tiers
- **Data Quality Assessment**: License, freshness, format, coverage, compliance
- **Data Utility Analysis**: Alternative and secondary uses of data beyond the primary requirement
- **Gap Analysis**: Requirements with no suitable external data source
- **Data Model Impact**: New entities/attributes needed from discovered sources
- **UK Government TCoP Point 10**: Make better use of data — prioritise open data

## Instructions

### 1. Check Prerequisites

**MANDATORY**:
- Check if any `ARC-*-REQ-*.md` file exists in `projects/{project}/`
  - If requirements don't exist, **STOP** and tell user to run `/arckit.requirements` first
  - Data source discovery MUST be driven by requirements (DR-xxx, FR-xxx, INT-xxx, NFR-xxx)

**OPTIONAL**:
- Check if any `ARC-*-DATA-*.md` file exists in `projects/{project}/`
  - Understand existing data entities — discover sources to populate or enrich them
  - Identify gaps where external data is needed but no entity exists yet

**RECOMMENDED**:
- Check if any `ARC-*-STKE-*.md` file exists in `projects/{project}/`
  - Understand stakeholder priorities for data source selection
- Check if any `ARC-*-PRIN-*.md` or `ARC-000-PRIN-*.md` file exists
  - Understand architecture principles (open standards, cloud first, etc.)
- Check if project is UK Government
  - Look for "UK Government", "Ministry of", "Department for", "NHS", "MOD" in project name or requirements
  - If UK Gov, prioritise UK Government open data portals and TCoP Point 10 compliance

### 2. Find the Project

- If user specifies project name or number, use that
- Otherwise, look for most recent project directory in `projects/`
- Use the same project directory where the requirements document exists

### 3. Read the Template

Read `.arckit/templates/datascout-template.md` to understand the output structure.

> **Note**: Read the `VERSION` file and update the version in the template metadata line when generating.

### 4. Extract Data Needs from Requirements

**Read the requirements document (`ARC-*-REQ-*.md`) and extract all data needs**:

**A. Data Requirements (DR-xxx)** — Primary source of data needs:
- External data sources explicitly mentioned
- Data entities requiring external population
- Data quality, freshness, and volume expectations
- Data retention and compliance requirements

**B. Functional Requirements (FR-xxx)** — Implied data needs:
- Features that require external data (e.g., "display real-time prices" → price feed API)
- Lookup/reference data (e.g., "validate postcode" → postcode API)
- Enrichment data (e.g., "show company details" → Companies House API)

**C. Integration Requirements (INT-xxx)** — External system data:
- Upstream data feeds and APIs
- Third-party system integrations
- Event-driven data streams

**D. Non-Functional Requirements (NFR-xxx)** — Data constraints:
- NFR-P-xxx: Latency, throughput for data ingestion
- NFR-SEC-xxx: Data classification, encryption requirements
- NFR-C-xxx: GDPR, data sovereignty, licensing compliance
- NFR-A-xxx: Availability and SLA requirements for data feeds

**If data model exists (`ARC-*-DATA-*.md`)**, also read it to:
- Identify entities that need external data sources
- Map discovered sources to existing entities and attributes
- Identify new entities/attributes needed from external sources

### 5. Dynamically Identify Data Source Categories

**CRITICAL**: Do NOT use a fixed list of categories. **Analyze requirements to identify what external data is needed**.

**Category Detection Logic**:

Scan requirements for keywords and patterns to identify data source categories:

#### Geospatial & Location Data
**Triggers**:
- DR/FR mentions: "location", "map", "postcode", "address", "coordinates", "geospatial", "GPS", "route", "distance"
- INT-xxx mentions: "Ordnance Survey", "Google Maps", "mapping"

**Research**:
- UK Gov: Ordnance Survey (OS Data Hub), AddressBase, ONS Geography
- Open: OpenStreetMap, GeoNames, What3Words
- Commercial: Google Maps Platform, HERE, Mapbox, TomTom

#### Financial & Economic Data
**Triggers**:
- DR/FR mentions: "price", "exchange rate", "stock", "financial", "economic", "inflation", "GDP", "interest rate"
- INT-xxx mentions: "market data", "trading", "FCA"

**Research**:
- UK Gov: Bank of England, ONS (CPI, GDP, employment), HMRC, FCA
- Open: ECB, World Bank, IMF, Yahoo Finance
- Commercial: Bloomberg, Refinitiv, Morningstar, Alpha Vantage

#### Company & Business Data
**Triggers**:
- DR/FR mentions: "company", "business", "registration", "director", "filing", "credit check", "due diligence"
- INT-xxx mentions: "Companies House", "Dun & Bradstreet"

**Research**:
- UK Gov: Companies House API (free), Charity Commission, FCA Register
- Commercial: Dun & Bradstreet, Experian Business, CreditSafe, Bureau van Dijk

#### Demographics & Population Data
**Triggers**:
- DR/FR mentions: "population", "census", "demographics", "age", "household", "deprivation"

**Research**:
- UK Gov: ONS Census, ONS Mid-Year Estimates, IMD (Index of Multiple Deprivation)
- Open: Nomis (ONS labour market), LSOA data

#### Weather & Environment Data
**Triggers**:
- DR/FR mentions: "weather", "temperature", "rainfall", "flood", "air quality", "environment", "climate"

**Research**:
- UK Gov: Met Office DataPoint, Environment Agency (flood, water quality), DEFRA
- Open: Open-Meteo, OpenWeatherMap
- Commercial: Met Office Commercial, AccuWeather, Tomorrow.io

#### Health & Medical Data
**Triggers**:
- DR/FR mentions: "health", "NHS", "patient", "clinical", "prescription", "hospital", "GP"
- INT-xxx mentions: "NHS Digital", "NHS Spine", "SNOMED"

**Research**:
- UK Gov: NHS Digital (TRUD, ODS, ePACT), PHE Fingertips, NHS BSA
- Open: SNOMED CT, ICD-10, BNF (British National Formulary)
- Commercial: EMIS, TPP SystmOne

#### Transport & Infrastructure Data
**Triggers**:
- DR/FR mentions: "transport", "road", "rail", "bus", "traffic", "vehicle", "DVLA", "journey"

**Research**:
- UK Gov: DfT, National Highways (NTIS), DVLA, Network Rail
- Open: Transport for London (TfL Unified API), Trainline, bus open data
- Commercial: HERE Traffic, TomTom Traffic

#### Energy & Utilities Data
**Triggers**:
- DR/FR mentions: "energy", "electricity", "gas", "fuel", "smart meter", "tariff", "consumption"

**Research**:
- UK Gov: Ofgem, BEIS, DCC (Smart Metering)
- Open: Elexon, National Grid ESO, DUKES
- Commercial: Energy supplier APIs, smart meter data platforms

#### Education Data
**Triggers**:
- DR/FR mentions: "school", "university", "education", "qualification", "student", "Ofsted"

**Research**:
- UK Gov: DfE (Get Information About Schools), Ofsted, UCAS, HESA
- Open: EduBase, school performance tables

#### Property & Land Data
**Triggers**:
- DR/FR mentions: "property", "land", "house price", "planning", "building", "EPC"

**Research**:
- UK Gov: Land Registry (Price Paid, CCOD), Valuation Office, EPC Register
- Commercial: Rightmove, Zoopla, CoreLogic

#### Identity & Verification Data
**Triggers**:
- DR/FR mentions: "identity", "verify", "KYC", "anti-money laundering", "AML", "passport", "driving licence"

**Research**:
- UK Gov: GOV.UK One Login, DWP, HMRC (RTI), Passport Office
- Commercial: Experian Identity, Onfido, Jumio, GBG

#### Crime & Justice Data
**Triggers**:
- DR/FR mentions: "crime", "police", "court", "offender", "DBS", "safeguarding"

**Research**:
- UK Gov: Police API (data.police.uk), MOJ, CPS, DBS
- Open: police.uk open data

#### Reference & Lookup Data
**Triggers**:
- DR/FR mentions: "postcode", "currency", "country", "language", "classification", "taxonomy", "SIC code"

**Research**:
- UK Gov: ONS postcode directory, HMRC trade tariff, SIC codes
- Open: REST Countries, ISO standards, GeoNames
- Commercial: Postcodes.io, Ideal Postcodes, Loqate

**IMPORTANT**: Only research categories where requirements exist. If a project doesn't mention weather data, don't research weather APIs.

### 6. Conduct Internet Research for Each Category

**CRITICAL**: Use WebSearch and WebFetch tools to gather **real, current data source information**. Do NOT rely solely on general knowledge.

#### Web Research Strategy

For each identified data source category, perform systematic research.

**MANDATORY FIRST STEP — Always check the UK Government API Catalogue and developer hubs before any other research.**

#### A. UK Government API Catalogue (MANDATORY — Always Check First)

**CRITICAL**: Before researching individual categories, **always** search the UK Government API Catalogue at https://www.api.gov.uk/ — this is the authoritative directory of 240+ APIs across 34+ public sector organisations.

**Step 1: Search api.gov.uk**

Use WebFetch on https://www.api.gov.uk/ to browse available APIs. Then use WebSearch with:
- "site:api.gov.uk [topic]" (e.g., "site:api.gov.uk fuel", "site:api.gov.uk health")
- "api.gov.uk [department]" (e.g., "api.gov.uk environment agency")

The catalogue is organised by department. Key departments with the most APIs:

| Department | APIs | Key Areas |
|-----------|------|-----------|
| **NHS Digital** | 93 | Patient records, prescriptions, GP services, FHIR, HL7 |
| **HMRC** | 31 | Tax, VAT, customs, Making Tax Digital, trade tariffs |
| **HM Land Registry** | 13 | Property, land charges, title searches |
| **MHCLG** | 12 | Housing, planning, local government |
| **Environment Agency** | 10 | Flooding, water quality, ecology, bathing water |
| **DWP** | 10 | Benefits, citizen services, National Insurance |
| **Ordnance Survey** | 8 | Maps, addresses, boundaries, terrain |
| **GDS** | 7 | GOV.UK content, data.gov.uk, Notify |
| **DVLA** | 6 | Vehicle enquiry, MOT history, driver records |
| **Companies House** | 2 | Company search, filing history |
| **ONS** | 2 | Statistics, census data |
| **Food Standards Agency** | 2 | Hygiene ratings, allergen alerts |
| **UK Police** | 1 | Crime data, neighbourhood policing |

**Step 2: Check department-specific developer hubs**

Many departments maintain their own developer portals with richer documentation than the central catalogue. **Always check the relevant hub** for any department whose data is needed:

| Developer Hub | URL | Registration |
|--------------|-----|-------------|
| **HMRC Developer Hub** | https://developer.service.hmrc.gov.uk/api-documentation | OAuth 2.0, sandbox available |
| **NHS Digital API Catalogue** | https://digital.nhs.uk/developer/api-catalogue | Varies by API |
| **NHS Developer Portal** | https://developer.api.nhs.uk | API key |
| **Companies House** | https://developer.company-information.service.gov.uk/ | Free API key |
| **OS Data Hub** | https://osdatahub.os.uk/ | Free tier (public sector free) |
| **Environment Agency** | https://environment.data.gov.uk/ | Open access |
| **Defra Developer Portal** | https://developer-portal.trade.defra.gov.uk/ | Registration required |
| **Legislation API** | https://www.legislation.gov.uk/developer | Open access |
| **GOV.UK Content API** | https://content-api.publishing.service.gov.uk/ | Open access |
| **Border APIs** | https://www.gov.uk/government/publications/apis | Varies |

**Step 3: Search data.gov.uk for datasets**

Use WebFetch on https://www.data.gov.uk/ to search for bulk datasets (CSV, JSON, SPARQL) in addition to APIs.

#### B. UK Government Open Data (Category-Specific Research)

After checking the central catalogue, do category-specific research:

**Search Queries**:
- "data.gov.uk [topic]" (e.g., "data.gov.uk fuel prices")
- "[Department] API" (e.g., "DVLA API", "Companies House API")
- "[Department] open data" (e.g., "ONS open data", "NHS Digital open data")
- "[topic] UK Government API"

**Use WebFetch on**:
- Department API documentation pages found in the catalogue
- API developer portals listed above

**Extract per source**:
- Dataset/API name and URL
- Provider (department/agency)
- License (Open Government Licence, other)
- Format (JSON, CSV, XML, REST API, SPARQL, bulk download)
- Authentication (API key, OAuth, open)
- Rate limits and quotas
- Update frequency (real-time, daily, monthly, quarterly, annually)
- Coverage (geographic, temporal, entity scope)
- Quality indicators (completeness, accuracy, timeliness)
- Documentation quality

#### C. Commercial Data Providers

Use WebSearch to find commercial options:

**Search Queries**:
- "[topic] API pricing" (e.g., "company data API pricing")
- "[topic] data provider comparison" (e.g., "geospatial data provider comparison")
- "alternative to [known provider]" (e.g., "alternative to Google Maps API")

**Use WebFetch on**:
- Vendor pricing pages
- API documentation
- Developer portals

**Extract per source**:
- Provider name and product
- Pricing model (per call, per record, subscription, tiered)
- Free tier (if any — calls/month, records, features)
- API endpoints and format
- Authentication method
- Rate limits and SLA
- Data coverage and quality
- GDPR compliance and data residency
- Support and documentation quality

**D. Free/Freemium APIs**

Use WebSearch:
- "[topic] free API" (e.g., "weather free API")
- "[topic] open API" (e.g., "postcode lookup open API")
- "public APIs [topic]" (e.g., "public APIs financial data")

**E. Open Source Datasets**

Use WebSearch:
- "[topic] open dataset" (e.g., "UK fuel prices open dataset")
- "[topic] dataset GitHub" (e.g., "census data GitHub")
- "Kaggle [topic]" or "data.world [topic]"

### 7. Evaluate Each Data Source

For each discovered source, assess against these criteria:

#### Evaluation Criteria (Weighted Scoring)

| Criterion | Weight | Assessment Areas |
|-----------|--------|-----------------|
| **Requirements Fit** | 25% | Does it cover the data fields, scope, and granularity needed? |
| **Data Quality** | 20% | Accuracy, completeness, consistency, timeliness |
| **License & Cost** | 15% | Open Government Licence, commercial terms, pricing sustainability |
| **API Quality** | 15% | RESTful, documentation, SDKs, versioning, error handling |
| **Compliance** | 15% | GDPR, UK data residency, classification, DPA 2018 |
| **Reliability** | 10% | SLA, uptime history, vendor stability, community/support |

#### Per-Source Evaluation Card

For each source, document:
- **Provider**: Organisation and contact
- **Description**: What data is provided
- **License**: OGL, Creative Commons, proprietary, custom
- **Pricing**: Free, freemium, pay-per-use, subscription
- **API Details**: Base URL, auth, rate limits, pagination
- **Format**: JSON, CSV, XML, GeoJSON, etc.
- **Update Frequency**: Real-time, hourly, daily, monthly, annually
- **Coverage**: Geographic, temporal, entity scope
- **Data Quality**: Completeness, accuracy, known issues
- **Compliance**: GDPR status, data classification, terms of use
- **SLA**: Uptime guarantee, response time, support
- **Integration Effort**: Estimated person-days to integrate
- **Data Utility**: Alternative and secondary uses beyond primary requirement (see Data Utility Analysis)
- **Score**: Weighted score out of 100

### 8. Create Comparison Matrices

For each data source category, create side-by-side comparison tables:

| Criterion | Source A (Open) | Source B (Commercial) | Source C (Free API) |
|-----------|----------------|----------------------|---------------------|
| Requirements Fit | [Score /25] | [Score /25] | [Score /25] |
| Data Quality | [Score /20] | [Score /20] | [Score /20] |
| License & Cost | [Score /15] | [Score /15] | [Score /15] |
| API Quality | [Score /15] | [Score /15] | [Score /15] |
| Compliance | [Score /15] | [Score /15] | [Score /15] |
| Reliability | [Score /10] | [Score /10] | [Score /10] |
| **Total** | **[/100]** | **[/100]** | **[/100]** |

### 9. Perform Gap Analysis

Identify requirements where **no suitable external data source** exists:

For each gap:
- **Requirement ID**: DR-xxx, FR-xxx, or INT-xxx
- **Data Need**: What data is missing
- **Why No Source**: No public API exists, data is proprietary, coverage insufficient, quality too low
- **Impact**: What cannot be delivered without this data
- **Recommended Action**: Build internal data collection, negotiate data sharing agreement, commission bespoke data, defer requirement, use proxy data

### 10. Data Utility Analysis

Most data sources have **alternative and secondary uses** beyond the primary requirement that triggered their discovery. Identifying these latent uses increases the strategic value of data investments and can unlock new capabilities.

**For each recommended data source, assess**:

#### A. Direct Utility (Primary Use)
- The requirement(s) this source was discovered to fulfil
- The data fields consumed for the primary use case

#### B. Derived Utility (Secondary Uses)
Identify alternative applications of the same data. Think laterally about what insights, predictions, or features the data could support beyond its obvious purpose.

**Common secondary use patterns**:

| Pattern | Description | Example |
|---------|-------------|---------|
| **Proxy Indicators** | Data serves as a proxy for something not directly measurable | Satellite imagery of oil storage tanks → predict oil price movements; car park occupancy data → estimate retail footfall |
| **Cross-Domain Enrichment** | Data from one domain enriches analysis in another | Weather data enriches energy demand forecasting; transport data enriches property valuations |
| **Trend & Anomaly Detection** | Time-series data reveals patterns beyond its primary subject | Smart meter data → identify fuel poverty; prescription data → detect disease outbreaks |
| **Benchmark & Comparison** | Data enables relative positioning against peers | Energy tariff data → benchmark supplier costs; school performance data → compare regional outcomes |
| **Predictive Features** | Data serves as a feature in predictive models | Demographics + property data → predict service demand; traffic data → predict air quality |
| **Regulatory & Compliance Evidence** | Data supports compliance beyond its primary use | Carbon intensity data supports both energy reporting and ESG compliance |

#### C. Strategic Value Assessment

For each source, document:
- **Primary use**: [Requirement ID] — [Description]
- **Secondary uses**: [List 2-5 alternative applications with brief rationale]
- **Strategic value**: [LOW / MEDIUM / HIGH] — considering both primary and secondary utility
- **Data combination opportunities**: [Which other sources, when combined, unlock new insights?]

**IMPORTANT**: Data utility is not speculative — ground secondary uses in plausible project or organisational needs. The satellite-oil-storage example works because the proxy relationship is well-established. Avoid tenuous connections.

### 11. Assess Impact on Data Model

If a data model (`ARC-*-DATA-*.md`) exists:
- **New Entities**: External data sources that introduce new entities not in current model
- **New Attributes**: Additional attributes on existing entities from external sources
- **New Relationships**: Cross-references between internal and external data
- **Sync Strategy**: How external data will be ingested (real-time API call, scheduled batch, event-driven, cached)
- **Data Freshness**: How stale can cached external data be?
- **Fallback Strategy**: What happens when external source is unavailable?

### 12. UK Government Open Data Opportunities (if UK Gov project)

**MANDATORY** if this is a UK Government project:

#### TCoP Point 10: Make Better Use of Data

Assess opportunities to:
- **Consume** existing open data instead of building new data collection
- **Publish** project data as open data (Open Government Licence)
- **Link** to National Data Strategy priorities
- **Use** common data standards and identifiers (e.g., UPRN, URN, company number)
- **Comply** with Data Ethics Framework

#### UK Government Data Sources Checklist

Search these portals for relevant datasets:
- **data.gov.uk**: Central UK Government open data portal
- **ONS**: Office for National Statistics
- **NHS Digital**: Health and social care data
- **Environment Agency**: Environmental monitoring
- **Ordnance Survey**: Geospatial data (OS Data Hub)
- **Land Registry**: Property and land data
- **Companies House**: Company data
- **DVLA**: Vehicle and driver data
- **DfE**: Education data
- **HMRC**: Tax and trade data
- **DWP**: Benefits and labour market data
- **MOJ**: Justice data
- **Police**: Crime data (data.police.uk)

### 13. Requirements Traceability

Map every data-related requirement to a discovered source or flag as a gap:

| Requirement ID | Requirement | Data Source | Score | Status |
|----------------|-------------|-------------|-------|--------|
| DR-001 | [Description] | [Source name] | [/100] | ✅ Matched |
| DR-002 | [Description] | — | — | ❌ Gap |
| FR-015 | [Description] | [Source name] | [/100] | ✅ Matched |
| INT-003 | [Description] | [Source name] | [/100] | ⚠️ Partial |

**Coverage Summary**:
- ✅ [X] requirements fully matched to data sources
- ⚠️ [Y] requirements partially matched (quality or coverage issues)
- ❌ [Z] requirements with no suitable external source (gaps)

### 14. Write the Output

- Write to `projects/{project-dir}/ARC-{PROJECT_ID}-DSCT-v1.0.md`
- Use the exact template structure from `datascout-template.md`
- Include all identified data source categories
- Include evaluation matrices with weighted scoring
- Include gap analysis
- Include data model impact assessment
- Include requirements traceability

**IMPORTANT - Auto-Populate Document Information Fields**:

Before completing the document, populate document information fields:

### Auto-populated fields:
- `[PROJECT_ID]` → Extract from project path (e.g., "001")
- `[VERSION]` → Start with "1.0" for new documents
- `[DATE]` / `[YYYY-MM-DD]` → Current date in YYYY-MM-DD format
- `[DOCUMENT_TYPE_NAME]` → Data Source Discovery
- `ARC-[PROJECT_ID]-DSCT-v[VERSION]` → Generated document ID
- `[STATUS]` → "DRAFT" for new documents
- `[CLASSIFICATION]` → Default to "OFFICIAL" (UK Gov) or "PUBLIC"

### User-provided fields:
- `[PROJECT_NAME]` → Full project name
- `[OWNER_NAME_AND_ROLE]` → Document owner

### Revision History:
```markdown
| 1.0 | {DATE} | ArcKit AI | Initial creation from `/arckit.datascout` command |
```

### Generation Metadata Footer:
```markdown
**Generated by**: ArcKit `/arckit.datascout` command
**Generated on**: {DATE}
**ArcKit Version**: [VERSION from VERSION file]
**Project**: {PROJECT_NAME} (Project {PROJECT_ID})
**AI Model**: [Actual model name]
```

### 15. Summarize What You Created

Provide a summary:

**Data Source Discovery Summary**:
- Number of data source categories identified: [X]
- Number of sources discovered: [Y] ([A] open data, [B] commercial, [C] free API)
- UK Government open data sources: [List if UK Gov project]
- Top recommended sources: [Top 3-5 with rationale]

**Requirements Coverage**:
- [X%] of data requirements matched to external sources
- [Y] requirements partially matched (quality/coverage concerns)
- [Z] requirements with no suitable source (gaps)

**Key Findings**:
- [Finding 1]: e.g., "Companies House API provides free company data covering DR-003, DR-007"
- [Finding 2]: e.g., "No open data source for real-time fuel prices — commercial API needed (£2K/year)"
- [Finding 3]: e.g., "ONS Census data available under OGL, covers 80% of demographics requirements"

**Data Utility**:
- [X] sources with identified secondary uses beyond primary requirements
- [Key example]: e.g., "Smart meter data supports both energy monitoring (DR-001) and fuel poverty identification (secondary)"

**Data Model Impact**:
- [X] new entities recommended
- [Y] new attributes on existing entities
- [Z] integration patterns needed (real-time, batch, cached)

**Next Steps**:
- Review data source recommendations with stakeholders
- Run `/arckit.data-model` to update data model with external data entities
- Create ADRs for significant data source decisions (`/arckit.adr`)
- Conduct DPIA for third-party data sources with personal data (`/arckit.dpia`)
- Begin API trials/POCs for shortlisted commercial sources

## Example Usage

### Example 1: UK Government Fuel Price Transparency Service

User: `/arckit.datascout Discover data sources for fuel price transparency project`

**You should**:
1. Read requirements in `projects/001-fuel-price-transparency/` (any `ARC-*-REQ-*.md`)
2. Detect UK Government project
3. Extract data needs:
   - DR-001: Real-time fuel prices from retailers
   - DR-002: Fuel station locations and metadata
   - DR-003: Historical price trends
   - FR-010: Price comparison across geographic areas
   - INT-001: BEIS fuel price data feed
4. Research categories:
   - **Fuel price data**: BEIS weekly fuel prices (free, OGL), PetrolPrices.com API (commercial), Experian Catalist (commercial)
   - **Location data**: OS Data Hub (free for public sector), Google Places API (commercial)
   - **Economic context**: ONS CPI fuel component (free, OGL), Bank of England inflation data
5. Evaluate each source with weighted scoring
6. Gap analysis: Real-time retailer prices may need direct data collection
7. Write to `projects/001-fuel-price-transparency/ARC-001-DSCT-v1.0.md`

### Example 2: Smart Meter Consumer App

User: `/arckit.datascout Find data sources for smart meter mobile app`

**You should**:
1. Read requirements
2. Extract data needs:
   - DR-001: Smart meter consumption data (half-hourly)
   - DR-002: Energy tariff information
   - DR-003: Carbon intensity data
   - FR-005: Compare usage with similar households
   - INT-001: DCC smart metering infrastructure
3. Research categories:
   - **Smart meter data**: DCC (Data Communications Company), n3rgy consumer API
   - **Tariff data**: Octopus Energy API (free), Ofgem tariff comparison
   - **Carbon intensity**: National Grid ESO Carbon Intensity API (free)
   - **Benchmarking**: BEIS Household Energy Statistics (OGL)
4. Evaluate, score, and recommend
5. Write output

## Important Notes

- **Data source discovery is requirements-driven**: Only search for sources that fulfil actual requirements
- **Dynamic category detection**: DO NOT use a fixed category list — analyze requirements to identify data needs
- **UK Government MUST prioritise open data** (TCoP Point 10, Open Government Licence)
- **WebSearch is MANDATORY**: Must search for real, current data sources — do not rely on general knowledge
- **Evaluate data quality**: Not all open data is good data — assess completeness, accuracy, freshness
- **License matters**: Open Government Licence vs Creative Commons vs proprietary — affects cost and compliance
- **GDPR applies to external data too**: Personal data from external sources still requires lawful basis
- **Rate limits and SLAs matter**: Production systems need reliable data feeds, not just demo APIs
- **Caching strategy is critical**: Most APIs have rate limits — plan caching and fallback
- **Data model updates feed back**: Discovered sources may require data model changes
- **Consider data utility**: Most data has alternative uses beyond its primary purpose — satellite imagery can predict oil storage levels, smart meter data can identify fuel poverty, transport data can enrich property valuations. Identify these secondary uses to maximise the value of data investments

## Integration with Other Commands

- **Input**: Requires requirements document (`ARC-*-REQ-*.md`) — identifies data needs from DR/FR/INT/NFR
- **Input**: Uses data model (`ARC-*-DATA-*.md`) — understands existing entities needing external data
- **Input**: Uses stakeholder analysis (`ARC-*-STKE-*.md`) — prioritises data sources by stakeholder needs
- **Input**: Uses principles (`ARC-*-PRIN-*.md`) — applies open data and cloud first principles
- **Output**: Feeds into `/arckit.data-model` — recommends new entities/attributes from external sources
- **Output**: Feeds into `/arckit.research` — informs vendor cost analysis with data source pricing
- **Output**: Feeds into `/arckit.adr` — data source selection decisions documented as ADRs
- **Output**: Feeds into `/arckit.dpia` — third-party data sources assessed for privacy impact
- **Output**: Feeds into `/arckit.diagram` — data flow diagrams show external data integration
- **Output**: Feeds into `/arckit.traceability` — every DR-xxx mapped to a data source or flagged as gap

## Resources

**UK Government API Catalogues & Developer Hubs** (ALWAYS CHECK THESE):
- **UK Government API Catalogue**: https://www.api.gov.uk/ — 240+ APIs across 34+ organisations
- **API Catalogue Dashboard**: https://www.api.gov.uk/dashboard/ — browse by department
- **API Catalogue GitHub**: https://github.com/co-cddo/api-catalogue — source data, contributions
- **HMRC Developer Hub**: https://developer.service.hmrc.gov.uk/api-documentation — tax, VAT, customs, MTD
- **NHS Digital API Catalogue**: https://digital.nhs.uk/developer/api-catalogue — 93 health APIs
- **NHS Developer Portal**: https://developer.api.nhs.uk — NHS website APIs
- **Companies House API**: https://developer.company-information.service.gov.uk/ — company data
- **Ordnance Survey Data Hub**: https://osdatahub.os.uk/ — maps, addresses, geospatial
- **Defra Developer Portal**: https://developer-portal.trade.defra.gov.uk/ — agriculture, trade, environment
- **Legislation API**: https://www.legislation.gov.uk/developer — UK legislation
- **GOV.UK Content API**: https://content-api.publishing.service.gov.uk/ — GOV.UK content
- **Border APIs**: https://www.gov.uk/government/publications/apis — customs, immigration

**UK Government Open Data Portals**:
- **data.gov.uk**: https://www.data.gov.uk/ — central open data portal
- **ONS**: https://www.ons.gov.uk/ — statistics, census, demographics
- **Environment Agency**: https://environment.data.gov.uk/ — flooding, water quality, ecology
- **Land Registry**: https://use-land-property-data.service.gov.uk/ — property, land ownership
- **Police API**: https://data.police.uk/docs/ — crime data
- **Transport (Bus Open Data)**: https://www.bus-data.dft.gov.uk/ — bus timetables, fares
- **National Grid ESO**: https://carbon-intensity.github.io/api-definitions/ — carbon intensity

**Open Data Portals (International)**:
- **European Data Portal**: https://data.europa.eu/
- **World Bank Open Data**: https://data.worldbank.org/
- **Public APIs list**: https://github.com/public-apis/public-apis

**UK Government Data Guidance**:
- **Technology Code of Practice Point 10**: https://www.gov.uk/guidance/make-better-use-of-data
- **Data Ethics Framework**: https://www.gov.uk/government/publications/data-ethics-framework
- **Open Government Licence**: https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/
- **National Data Strategy**: https://www.gov.uk/government/publications/uk-national-data-strategy

## Output Instructions

**CRITICAL - Token Efficiency**:

To avoid exceeding Claude Code's 32K token output limit, you MUST use the following strategy:

### 1. Generate Data Source Discovery Document

Create the full datascout document following the template structure.

### 2. Write Directly to File

**Use the Write tool** to create `projects/[PROJECT]/ARC-{PROJECT_ID}-DSCT-v1.0.md` with the complete document.

**DO NOT** output the full document in your response. This would exceed token limits.

### 3. Show Summary Only

After writing the file, show ONLY a concise summary:

```markdown
## Data Source Discovery Complete

**Project**: [Project Name]
**File Created**: `projects/[PROJECT]/ARC-{PROJECT_ID}-DSCT-v1.0.md`

### Discovery Summary

**Categories Researched**: [Number] categories identified from requirements
- [Category 1]: [Number] sources discovered ([X] open, [Y] commercial, [Z] free)
- [Category 2]: [Number] sources discovered
- ...

**Top Recommended Sources**:
1. [Source] for [Category] — [Key reason, score]
2. [Source] for [Category] — [Key reason, score]
3. [Source] for [Category] — [Key reason, score]

**Requirements Coverage**: [X%] matched, [Y] partial, [Z] gaps

**UK Government Open Data** (if applicable):
- Sources used: [List]
- TCoP Point 10 compliance: [Summary]

### What's in the Document

- Executive summary with data needs analysis
- [N] data source categories with evaluation matrices
- Per-source evaluation cards with weighted scoring
- Comparison tables per category
- Data integration architecture recommendations
- Gap analysis for unmet data needs
- Impact on data model (new entities/attributes)
- Requirements traceability matrix
- UK Government open data opportunities (if applicable)

### Next Steps

- Review `ARC-{PROJECT_ID}-DSCT-v1.0.md` for detailed findings
- Run `/arckit.data-model` to update data model with external sources
- Run `/arckit.adr` for significant data source decisions
- Run `/arckit.dpia` for third-party data with personal data
```

Generate the data source discovery document now, write to file using Write tool, and show only the summary above.
