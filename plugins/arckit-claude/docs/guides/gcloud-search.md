# G-Cloud 15 (and G-Cloud 14): searching the Digital Marketplace

> **Guide Origin**: Official | **ArcKit Version**: [VERSION]

G-Cloud is a UK public sector framework agreement for buying cloud hosting, software and support, run by the Government Commercial Agency. This guide covers G-Cloud 15, which replaced G-Cloud 14 in 2026, where to search it on the Digital Marketplace, and how `/arckit:gcloud-search` shortlists services against your requirements.

---

## What G-Cloud is

G-Cloud helps the public sector buy cloud-based services such as hosting, software and support, including off-the-shelf and pay-as-you-go options. Suppliers list their services in a catalogue, and buyers award contracts from it ([G-Cloud 15, RM1557.15](https://www.gca.gov.uk/agreements/RM1557.15)).

- **Who runs it**: the Government Commercial Agency (GCA), an [executive agency sponsored by the Cabinet Office](https://www.gov.uk/government/organisations/government-commercial-agency). Crown Commercial Service became GCA on 1 April 2026, and some documents and links still use the CCS name.
- **Who can buy**: central government, charities, education, health, local authorities, blue light services, devolved administrations and British overseas territories.
- **What it excludes**: contingent labour, co-location, non-cloud services and consultancy, bespoke design and development, hardware and recruitment. For bespoke digital work and specialists, the Digital Marketplace also lists Digital Outcomes and Specialists 7 (see `/arckit:dos`).

## G-Cloud 15 and G-Cloud 14

GCA says "G-Cloud 15 has replaced G-Cloud 14".

| | G-Cloud 15 | G-Cloud 14 |
|---|------------|------------|
| Agreement number | [RM1557.15](https://www.gca.gov.uk/agreements/RM1557.15) | [RM1557.14](https://www.gca.gov.uk/agreements/RM1557.14) |
| Dates | Started 6 August 2026. Runs for 4 years, reopening after 18 months and again after 36 months | 29 October 2024 to 28 October 2026, after a six-month extension |
| Type | Open framework under the Procurement Act 2023 | Framework agreement |
| Lots | 1a IaaS and PaaS; 1b IaaS and PaaS above OFFICIAL; 2a Infrastructure Software as a Service (iSaaS); 2b Other Software as a Service (SaaS); 3 Cloud support services | 1 Cloud hosting; 2 Cloud software; 3 Cloud support |

## How to search and buy G-Cloud services

1. Read the buyer guide and FAQ on the [G-Cloud 15 agreement page](https://www.gca.gov.uk/agreements/RM1557.15) before you start. It explains what the agreement can and can't be used for, and how pricing works.
2. Search services on the [Digital Marketplace](https://www.digitalmarketplace.service.gov.uk/), which lists G-Cloud 15 and G-Cloud 14 services and supplier A to Z lists. [Search G-Cloud 15 by lot](https://www.applytosupply.digitalmarketplace.service.gov.uk/g-cloud-15/choose-lot). Lot 1b (above OFFICIAL) is not in the public search.
3. Create and save your supplier shortlist on the [Contract Award Service](https://redirect.contractawardservice.gca.gov.uk/), as the Digital Marketplace directs buyers to do.
4. Choose one of the two G-Cloud 15 routes:
   - **Award without competition**, where an existing catalogue service meets your statement of requirements: filter to a shortlist, award on lowest price and complete the order form.
   - **Competitive selection**: filter to a shortlist, issue an invitation to tender to all eligible suppliers on it, award on the most advantageous tender and complete the order form.

---

## Using /arckit:gcloud-search

`/arckit:gcloud-search` finds G-Cloud services on the UK Digital Marketplace with live search and comparison capabilities, and scores a shortlist against your requirements.

### Inputs

| Artefact | Purpose |
|----------|---------|
| Requirements (`ARC-<id>-REQ-v1.0.md`) | What capabilities are needed |
| Architecture principles | Technology and vendor standards |
| Budget constraints | Pricing parameters |

### Command

```bash
/arckit:gcloud-search Find G-Cloud services for <requirement>
```

Output: `projects/<id>/procurement/ARC-<id>-GCLD-v1.0.md`

### What the document contains

| Section | Contents |
|---------|----------|
| Service Overview | What is needed and why, strategic alignment, integration context |
| Must-Have and Desirable Requirements | What a service must and should meet, traced to requirement IDs |
| Success and Evaluation Criteria | How success is judged, and the weighted scoring model (50/25/15/10 by default) |
| Service Search Results | Queries, date and filters used, then 3 to 5 shortlisted services |
| Service Comparison Matrix | Weighted scores per service, and any must-have no service meets |
| Recommendation | Recommended service, alternatives, and what would change the choice |
| Next Steps and References | Owners and dates, Digital Marketplace guidance, search methodology |

---

## G-Cloud Categories (Lots)

| G-Cloud 15 lot | Description | G-Cloud 14 equivalent | Examples |
|----------------|-------------|-----------------------|----------|
| 1a: IaaS and PaaS | Platform or infrastructure services for running software, networking, or processing and storing data | Cloud Hosting | AWS, Azure, GCP |
| 1b: IaaS and PaaS above OFFICIAL | As 1a, for above OFFICIAL security classifications | Cloud Hosting | |
| 2a: Infrastructure Software as a Service (iSaaS) | Infrastructure and service management applications | Cloud Software | Service management tools |
| 2b: Software as a Service (SaaS) | Other and end-user applications | Cloud Software | CRM, collaboration tools |
| 3: Cloud support services | Professional services to set up and maintain cloud software, infrastructure and platforms | Cloud Support | Migration, training |

---

## Key Filters

The G-Cloud 15 search on the Digital Marketplace offers these filters, among others:

| Filter | Purpose |
|--------|---------|
| Lot and service category | Narrow by service type |
| Minimum government security clearance | BPSS, SC or DV for supplier staff |
| Data storage and processing locations | United Kingdom or European Economic Area (EEA) |
| Certifications | ISO 27001, Cyber Essentials, Cyber Essentials Plus and others |
| Supplier type | Not a reseller, or a reseller with or without extra features and support |
| Pricing options | Free trial, discount for educational organisations |
| Social value | Social value themes the supplier offers |

---

## One-Page Workflow

| Phase | Key Activities | ArcKit Commands |
|-------|----------------|-----------------|
| Requirements | Define what's needed | `/arckit:requirements` |
| Search | Find matching services | `/arckit:gcloud-search` |
| Shortlist | Compare and select candidates | Manual review |
| Clarify | Ask suppliers questions | `/arckit:gcloud-clarify` |
| Evaluate | Score and select | `/arckit:evaluate` |

---

## Review Checklist

- Search keywords match requirement terminology.
- Multiple service categories explored.
- SME suppliers included in search.
- Security certifications filtered appropriately.
- Data location requirements considered.
- Price ranges captured for comparison.
- At least 3 services shortlisted for evaluation.

---

## Digital Marketplace Tips

| Tip | Description |
|-----|-------------|
| Keyword Variation | Try synonyms and alternative terms |
| Category Browse | Browse categories, don't just search |
| Supplier Type | Use the supplier type filter to separate resellers from other suppliers |
| Feature Filter | Use feature checkboxes to narrow |
| Price Comparison | Compare prices on each service page to understand the range |

---

## Key Principles

1. **Fair Competition**: Search broadly to find all suitable services.
2. **SME Consideration**: Each department now sets its own direct SME spending target, running to 2028 (for example 40% for DSIT and 30% for Cabinet Office, [announced in March 2026](https://www.gov.uk/government/news/billions-to-go-directly-to-small-businesses-across-the-country-as-government-sets-new-targets-for-spending)). Check your organisation's target.
3. **Requirement Focus**: Search based on needs, not familiar vendors.
4. **Document Everything**: Record search criteria for audit trail.
5. **Compare Fairly**: Use consistent criteria across services.

---

## Useful Links

- [G-Cloud 15 (RM1557.15)](https://www.gca.gov.uk/agreements/RM1557.15) on gca.gov.uk
- [G-Cloud 14 (RM1557.14)](https://www.gca.gov.uk/agreements/RM1557.14) on gca.gov.uk
- [Digital Marketplace](https://www.gov.uk/digital-marketplace) (GOV.UK)
- [Contract Award Service](https://redirect.contractawardservice.gca.gov.uk/)
