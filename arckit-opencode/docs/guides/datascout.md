# Data Source Discovery Guide

`/arckit.datascout` discovers external data sources — APIs, datasets, open data portals, and commercial providers — that can fulfil a project's data and integration requirements.

> **Agent Architecture**: This command delegates to the `arckit-datascout` autonomous agent. The agent runs as a subprocess with its own context window, searching api.gov.uk, data.gov.uk, department developer hubs, and commercial API providers without polluting your main conversation. The slash command launches the agent and relays its summary back to you.

---

## What is Data Source Discovery?

Data source discovery is the systematic identification and evaluation of external data sources that a project needs. Rather than building internal data collection from scratch, many projects can consume existing APIs, open datasets, and commercial data feeds.

**Key question**: What external data does the project need, and where can it be sourced?

---

## When to Use

- **After requirements** are defined (MANDATORY — data needs come from DR-xxx, FR-xxx, INT-xxx)
- **Before or alongside data modeling** — discovered sources influence the data model
- **Before vendor procurement** — data source costs feed into TCO analysis
- **When requirements reference external data** (e.g., "display real-time prices", "validate postcode", "show company details")

---

## Prerequisites and Dependencies

| Artifact | Dependency | Why |
|----------|-----------|-----|
| Requirements (`ARC-*-REQ-*.md`) | **MANDATORY** | Data needs extracted from DR/FR/INT/NFR requirements |
| Data Model (`ARC-*-DATA-*.md`) | OPTIONAL | Maps sources to existing entities, identifies gaps |
| Stakeholders (`ARC-*-STKE-*.md`) | RECOMMENDED | Prioritises sources by stakeholder needs |
| Principles (`ARC-000-PRIN-*.md`) | RECOMMENDED | Applies open data and cloud-first principles |

---

## Scenario Matrix

| Scenario | Prompt seed | Focus |
|---------|-------------|-------|
| Open data first | "Discover UK Government open data sources for <project>" | Prioritises data.gov.uk, ONS, NHS Digital |
| Commercial APIs | "Find commercial data APIs for <capability>" | Compares pricing, SLAs, coverage |
| Gap analysis | "Identify which data requirements have no external source" | Highlights gaps needing internal collection |
| Data model enrichment | "Find sources to populate the data model for <project>" | Maps sources to existing entities |
| Cost analysis | "Compare free vs commercial data sources for <need>" | TCO comparison for data feeds |

Add constraints (budget, data residency, freshness) in the prompt for tailored results.

---

## Command

```bash
/arckit.datascout Discover data sources for <project>
```

Outputs: `projects/<id>/ARC-<id>-DSCT-v1.0.md`

> **Auto-versioning**: Re-running this command when a document already exists automatically increments the version (minor for refreshed content, major for changed scope) instead of overwriting.

---

## Output Highlights

- **Data needs analysis** extracted from requirements (DR/FR/INT/NFR)
- **Data utility analysis** identifying secondary and alternative uses for each source beyond the primary requirement (e.g., satellite imagery → oil storage estimation → price prediction; smart meter data → energy monitoring + fuel poverty identification)
- **Per-source evaluation cards** with license, pricing, API details, quality, compliance
- **Weighted scoring matrix** (Requirements Fit 25%, Data Quality 20%, License & Cost 15%, API Quality 15%, Compliance 15%, Reliability 10%)
- **Side-by-side comparison tables** per category
- **Gap analysis** for unmet data needs with recommended actions
- **Data model impact** (new entities, attributes, sync strategy)
- **Requirements traceability** (every DR-xxx mapped to a source or flagged as gap)
- **UK Government open data opportunities** (TCoP Point 10 compliance)

---

## Evaluation Criteria Explained

| Criterion | Weight | What It Measures |
|-----------|--------|-----------------|
| **Requirements Fit** | 25% | Covers required data fields, scope, granularity, volume |
| **Data Quality** | 20% | Accuracy, completeness, consistency, timeliness |
| **License & Cost** | 15% | OGL vs commercial, pricing sustainability, total cost |
| **API Quality** | 15% | RESTful, documentation, SDKs, versioning, error handling |
| **Compliance** | 15% | GDPR, UK data residency, classification, DPA 2018 |
| **Reliability** | 10% | SLA, uptime, vendor stability, support |

---

## UK Government Open Data Guidance

For UK Government projects, datascout prioritises open data sources.

### UK Government API Catalogue (Always Checked)

The command always searches https://www.api.gov.uk/ first — the authoritative directory of UK public sector APIs maintained by the Data Standards Authority. It dynamically discovers available departments, API counts, and developer hubs at runtime rather than relying on a static list.

It also fetches https://www.api.gov.uk/dashboard/ to identify which departments have APIs relevant to the project's requirements, then follows links to discover each department's own developer portal for richer documentation, sandbox environments, and registration details.

### Key UK Open Data Portals

| Portal | URL | Coverage |
|--------|-----|----------|
| data.gov.uk | https://www.data.gov.uk/ | Central UK open data |
| ONS | https://www.ons.gov.uk/ | Statistics and demographics |
| NHS Digital | https://digital.nhs.uk/ | Health and social care |
| OS Data Hub | https://osdatahub.os.uk/ | Geospatial data |
| Companies House | https://developer.company-information.service.gov.uk/ | Company data |
| Environment Agency | https://environment.data.gov.uk/ | Environmental data |
| Land Registry | https://use-land-property-data.service.gov.uk/ | Property data |
| Police API | https://data.police.uk/docs/ | Crime data |

### TCoP Point 10: Make Better Use of Data

The Technology Code of Practice requires UK Government projects to:
- Consume existing open data before building new data collection
- Use common data standards and identifiers (UPRN, company number, etc.)
- Consider publishing project data as open data (OGL)
- Comply with the Data Ethics Framework

---

## Integration with Other Commands

| Direction | Command | Integration |
|-----------|---------|-------------|
| **Input** | `/arckit.requirements` | Data needs from DR/FR/INT/NFR requirements |
| **Input** | `/arckit.data-model` | Existing entities needing external data |
| **Output** | `/arckit.data-model` | New entities/attributes from discovered sources |
| **Output** | `/arckit.research` | Data source costs inform vendor TCO |
| **Output** | `/arckit.adr` | Data source selection recorded as decisions |
| **Output** | `/arckit.dpia` | Third-party sources assessed for privacy |
| **Output** | `/arckit.diagram` | Data flow diagrams show external integration |
| **Output** | `/arckit.traceability` | DR-xxx → data source mapping |

---

## Follow-on Actions

- Update data model with external data entities (`/arckit.data-model`)
- Create ADRs for significant data source decisions (`/arckit.adr`)
- Conduct DPIA for sources with personal data (`/arckit.dpia`)
- Feed data source costs into research TCO analysis (`/arckit.research`)
- Build data flow diagrams showing external integration (`/arckit.diagram`)
- Add data source risks to risk register (`/arckit.risk`)
