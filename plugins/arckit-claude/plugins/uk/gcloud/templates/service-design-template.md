# Service Design: [PROJECT_NAME]

> **Template Origin**: Official | **ArcKit Version**: [VERSION] | **Command**: `/arckit-uk-gcloud:service-design`

**G-Cloud Lot**: [Lot 1a — Infrastructure as a Service (IaaS) and Platform as a Service (PaaS) / Lot 1b — IaaS and PaaS above OFFICIAL / Lot 2a — Infrastructure Software as a Service (iSaaS) / Lot 2b — Software as a Service (SaaS) / Lot 3 — Cloud Support]

<!-- Keep exactly one lot on the line above, worded exactly as listed. The SDD, pricing, security and
     review commands read this line to find the service's lot. -->

## Document Control

<!-- DOC-CONTROL-HEADER -->
<!-- Resolved at command-execution time per _partials/RENDERING.md. -->

## Revision History

| Version | Date | Author | Changes | Approved By | Approval Date |
|---------|------|--------|---------|-------------|---------------|
| [VERSION] | [DATE] | ArcKit AI | Initial creation from `/arckit.[COMMAND]` command | [PENDING] | [PENDING] |

> Internal planning document for a G-Cloud 15 (RM1557.15) service. It is not submitted to GCA (the
> Government Commercial Agency, formerly CCS); every later document for this service is built from it.

## G-Cloud Details

| Field | Value |
|-------|-------|
| Service Name | [SERVICE_NAME] |
| Framework | G-Cloud 15 (RM1557.15) |
| SDD command | [`/arckit-uk-gcloud:sdd-lot1a`, `/arckit-uk-gcloud:sdd-lot1b`, `/arckit-uk-gcloud:sdd-lot2a`, `/arckit-uk-gcloud:sdd-lot2b` or `/arckit-uk-gcloud:sdd-lot3`] |

---

## 1. Service Overview

### 1.1 Service Name
<!-- 100 characters maximum. The name only: GCA's guidance is not to add extra keywords. -->

**Proposed Name:** [NAME]
**Characters:** [X]/100

### 1.2 Service Description
<!-- 500 characters maximum. A summary of what the service is for; the listing shows it in search results. -->

[DESCRIPTION]

**Characters:** [X]/500

### 1.3 Lot

| | Lot | What it covers | Category roots |
|---|-----|----------------|----------------|
| [ ] | **1a** IaaS and PaaS | Processing and storing data, running software or networking | IaaS, PaaS |
| [ ] | **1b** IaaS and PaaS above OFFICIAL | As 1a, for data classified above OFFICIAL | IaaS, PaaS (as 1a) |
| [ ] | **2a** Infrastructure Software as a Service (iSaaS) | Cloud-based systems infrastructure software | Systems Infrastructure Software; Application Development and Deployment |
| [ ] | **2b** Software as a Service (SaaS) | Applications hosted in the cloud | Applications; Application Development and Deployment |
| [ ] | **3** Cloud Support | Managed services, FinOps, migration planning, set-up, security, QA and testing, training, ongoing support | Cloud Support Services |

**Justification:** [WHY THIS LOT, AND WHY NOT THE NEAREST ALTERNATIVE]

<!-- A service sits in one lot, and in one category group within it (1.4). Something sold both as software and as support (for example a SaaS product plus implementation days) becomes two services, each with its own design; so does a support offer that spans two groups, such as migration and managed cloud. -->

### 1.4 Service Categories (first pass)
<!-- From this lot's tree in the overlay's skills/gcloud-framework/references/g-cloud-15/categories.md, written as full paths. The SDD command confirms them.
     One root and one group per service: every category shares the same first two levels of its path (`Root > Group`). None of the 42,893 live G-Cloud 15 listings scraped on 7 October 2026 has categories in more than one group, although GCA's question export states no rule. If the offer spans groups, choose the group this service is listed under and design the rest as separate services. -->

**Category group (one per service):** [ROOT > GROUP]

| # | Category (full path) | Why it fits |
|---|----------------------|-------------|
| 1 | [ROOT > GROUP > CATEGORY] | [REASON] |

### 1.5 Target Market

**Primary Buyers:**

- [ ] Central Government
- [ ] Local Government
- [ ] NHS and health
- [ ] Education
- [ ] Police and justice
- [ ] Defence and national security
- [ ] Devolved Administrations
- [ ] Other Public Sector

**Buyer Personas:**

1. [Persona 1: role, needs, pain points]
2. [Persona 2: role, needs, pain points]

---

## 2. Value Proposition

### 2.1 Problem Statement

[What problem does this service solve?]

### 2.2 Solution

[How does this service solve the problem?]

### 2.3 Key Differentiators

1. [Differentiator 1]
2. [Differentiator 2]
3. [Differentiator 3]

### 2.4 Competitive Advantages

- **vs. [Competitor A]:** [Advantage]
- **vs. [Competitor B]:** [Advantage]
- **vs. building in-house:** [Advantage]

---

## 3. Service Features
<!-- At most 10 features, 10 words each. GCA: technical features, for example ‘real-time reporting’ or ‘remote access’ (Lot 3: for example ‘system design and assurance’). -->

| # | Feature | Words | Unique? |
|---|---------|-------|---------|
| 1 | [FEATURE] | [X]/10 | Yes/No |
| 2 | [FEATURE] | [X]/10 | Yes/No |
| 3 | [FEATURE] | [X]/10 | Yes/No |

**Count:** [N]/10

---

## 4. Service Benefits
<!-- At most 10 benefits, 10 words each. GCA: active phrases that show how users' work improves, for example ‘publish content from multiple devices’ or ‘reduces deployment times’. -->

| # | Benefit | Words | Metric/Evidence |
|---|---------|-------|-----------------|
| 1 | [BENEFIT] | [X]/10 | [METRIC] |
| 2 | [BENEFIT] | [X]/10 | [METRIC] |
| 3 | [BENEFIT] | [X]/10 | [METRIC] |

**Count:** [N]/10

### 4.1 ROI/Business Case

[Typical return or business case for buyers]

---

## 5. Supplier Type
<!-- Asked per service on every lot. Options are worded as listings show them; the Digital Platform's wording is in each comment. -->

- [ ] Not a reseller <!-- Digital Platform: “I’m not a reseller” -->
- [ ] Reseller providing extra features and support <!-- Digital Platform: “I’m a reseller providing extra features and support not available from the original supplier” -->
- [ ] Reseller providing extra support <!-- Digital Platform: “I’m a reseller providing extra support” -->
- [ ] Reseller (no extras) <!-- Digital Platform: “I’m a reseller not providing extra features or support” -->

**Organisation whose services are being resold:** [ORGANISATION / Not applicable]

<!-- Lots 1a/1b only: the lot questions also ask, once per bid, whether you offer IaaS/PaaS as a Reseller (with evidence of accreditation for each provider) or with Sole Control of the Infrastructure, and whether you rely on the cloud provider for accreditations. That is answered once per bid with /arckit-uk-gcloud:lot-questions (Part 1 of the LOTQ document). -->

---

## 6. Lot-Specific Design
<!-- Keep only the subsection for this service's lot and delete the others. -->

### 6A. Lots 1a and 1b (IaaS and PaaS)

| Question | Answer |
|----------|--------|
| NIST deployment model (Public / Private / Community / Hybrid cloud) | [MODELS] |
| Infrastructure: own datacentres, or resold (which providers) | [DETAIL] |
| Datacentre setup (Multiple datacentres with disaster recovery / Multiple datacentres / Single datacentre with multiple copies / Single datacentre) | [SETUP] |
| Backup and recovery provided; what is backed up | [YES/NO; ITEMS] |
| RPO/RTO provided | [YES/NO; VALUES] |
| Separation between users: virtualisation technology and who implements it | [DETAIL] |
| Interfaces: web interface, API (automation tools such as Terraform, Ansible), command line | [DETAIL] |
| Infrastructure or application metrics; resource tagging; FOCUS resource tagging | [DETAIL] |
| Automatic scaling; usage notifications | [DETAIL] |
| Datacentres follow the EU code of conduct for energy-efficient datacentres | [YES/NO] |
| ISO 27018 certificate (required on Lots 1a and 1b if the service includes public cloud, unless you resell and rely on the provider's accreditations; asked in the lot questions) | [HELD / NOT NEEDED: PRIVATE CLOUD ONLY / NOT NEEDED: RELYING ON PROVIDER / PENDING] |

**Lot 1b only:**

| Question | Answer |
|----------|--------|
| Highest classification the service handles (above OFFICIAL) | [SECRET / TOP SECRET] |
| Staff clearance offered (Lot 1b allows only Security Clearance (SC) or Developed Vetting (DV)) | [SC / DV] |

### 6B. Lots 2a and 2b (iSaaS and SaaS)

| Question | Answer |
|----------|--------|
| iSaaS (2a, systems infrastructure software) or SaaS (2b, applications) | [2a/2b, WITH REASON] |
| Add-on or extension to other software (Yes / Yes, but can also be used as a standalone service / No) | [ANSWER] |
| NIST deployment model (Public / Private / Community / Hybrid cloud) | [MODELS] |
| Multi cloud support | [YES/NO] |
| Access: browser (which browsers), installed application (which operating systems), mobile | [DETAIL] |
| API, API sandbox or test environment | [DETAIL] |
| Customisation by buyers | [DETAIL] |
| Data export and import formats (CSV, ODF, other) | [FORMATS] |
| Public sector networks connected (PSN, PNN, JANET, SWAN, HSCN, other) | [NETWORKS / NONE] |
| Complies with the Software Security Code of Practice | [YES/NO] |
| Service usage metrics; resource tagging; FOCUS resource tagging | [DETAIL] |

### 6C. Lot 3 (Cloud Support)

| Question | Answer |
|----------|--------|
| Category group, one per service (Cloud Migration Planning, Set Up and Migration, Managed Cloud, Cloud Financial Management Services, Security Services, Quality Assurance and Performance Testing, Training, Ongoing Support); the same group as 1.4 | [GROUP] |
| Delivery: remote, on site, or both (a constraint buyers should know about) | [DETAIL] |
| Platforms and technologies supported | [DETAIL] |
| Staff screening (Conforms to BS7858:2019 / Other security clearance / Staff screening not performed) | [ANSWER] |
| Highest clearance you will provide if a role requires it (Developed Vetting (DV) / Security Clearance (SC) / Baseline Personnel Security Standard (BPSS) / None) | [ANSWER] |

**Role levels that deliver the service** (exact names from the overlay's `skills/ddat-rate-card/references/lot-3-rate-card.md`). Lot 3 is priced on one rate card for all your Lot 3 services, which every Lot 3 listing shows in full; `/arckit-uk-gcloud:pricing` sets it in the supplier-wide `ARC-000-RATE` document. This list makes sure the card covers this service; it doesn't limit the card to these levels.

| Job family | Role | Role level | Your role, if it isn't a DDaT role | Why the service needs it |
|------------|------|------------|------------------------------------|--------------------------|
| [JOB FAMILY] | [ROLE] | [ROLE LEVEL] | [YOUR ROLE / —] | [REASON] |

<!-- A role the DDaT rate card doesn't name (procurement or commercial adviser, trainer, bid or contract manager) goes in at the nearest DDaT role and level, judged by the work and seniority, with its own name in the fourth column. The service definition document then says so, for example "Our procurement consultants are priced at the DDaT Senior delivery manager level". Live Lot 3 procurement listings price such people mostly as architects, IT service managers, delivery managers and business analysts, and none says which level they are priced at. -->

---

## 7. Technical Architecture

### 7.1 Architecture Overview

```text
[Architecture diagram or description]
```

### 7.2 Hosting and Data Location

| Item | Answer |
|------|--------|
| Data stored and processed in (United Kingdom / European Economic Area (EEA) / Other locations) | [LOCATIONS] |
| Users can choose where data is stored and processed | [YES/NO] |
| Cloud providers and regions | [PROVIDERS/REGIONS] |

### 7.3 Integration Capabilities

| Integration Type | Supported | Details |
|------------------|-----------|---------|
| REST API | Yes/No | [VERSION] |
| Webhooks | Yes/No | [EVENTS] |
| SSO (SAML / OIDC) | Yes/No | [DETAILS] |
| File import/export | Yes/No | [FORMATS] |

### 7.4 Technology Stack

- **Frontend:** [TECHNOLOGIES]
- **Backend:** [TECHNOLOGIES]
- **Database:** [TECHNOLOGIES]
- **Infrastructure:** [TECHNOLOGIES]

---

## 8. Support Model
<!-- These match GCA's user support questions. Onsite support is not asked for Lot 3. -->

| Channel | Offered (Yes / Yes, at extra cost / No; web chat's option is "Yes, at an extra cost") | Hours (24 hours, 7 days a week / 9 to 5 (UK time), 7 days a week / 9 to 5 (UK time), Monday to Friday) |
|---------|------------------------------------------|------------------------------------------|
| Email or online ticketing | [ANSWER] | Response times: [DETAIL] |
| Phone | [YES/NO] | [HOURS] |
| Web chat | [ANSWER] | [HOURS] |
| AI chatbot before reaching an operative | [YES/NO] | — |
| Onsite (Lots 1a/1b, 2a/2b) | [ANSWER] | — |

**Support levels** (what each includes, what it costs, whether a technical account manager or cloud support engineer is provided): [DETAIL]

**Escalation path:** [L1 → L2 → L3 → management]

**Onboarding:** [How users get started: training, documentation]

---

## 9. Pricing Approach
<!-- The approach only. Prices are set with /arckit-uk-gcloud:pricing against the G-Cloud 15 pricing rules. Never "price on application", "from £x" or an unexplained range. -->

**Lots 1a/1b:** Baseline Price + Fixed Onboarding Costs − Framework Discount ± Further Supplier-Specific Schemes − Time Limited Discounts, per deployment model, with a baseline pricing web link. Onboarding price and minimum discount are each scored at 5%.

**Lots 2a/2b:** unit prices (reduce-only during the framework) and a discount for each annual call-off value band: under £250,000; £250,000–£500,000; £500,001–£1m; £1,000,001–£2.5m; £2,500,001–£5m; over £5m. Price is 80% of the score.

**Lot 3:** one rate card for all your Lot 3 services (the supplier-wide `ARC-000-RATE` document), with a maximum UK (and optional offshore) day rate for each role level offered and no uplift for risk or contingency. It must include every role level in section 6C. Price is 80% of the score: GCA averages every rate on the card, UK and offshore, and the lowest average in the tender scores the full 80%.

| Item | Answer |
|------|--------|
| Pricing model / unit | [MODEL] |
| Intended position (budget / mid-market / premium) and why | [POSITION] |
| Discount for educational organisations | [YES/NO] |
| Free trial (Lots 1a/1b, 2a/2b) | [YES/NO; WHAT IS INCLUDED] |

---

## 10. Compliance and Security

### 10.1 Certifications
<!-- Status for this service. The lot questions (/arckit-uk-gcloud:lot-questions) cover these once per lot bid:
     Lots 1a/1b (conditions of participation): ISO 9001, ISO 27001, ISO 20000-1, Cyber Essentials Plus and a Carbon Reduction Plan; ISO 14001 and ISO 27017 unless you rely on the cloud provider's accreditations; ISO 27018 for any service that includes public cloud, unless you resell and rely on the cloud provider's accreditations.
     Lots 2a/2b and 3 (standards and certifications): Cyber Essentials and Cyber Essentials Plus (with an option if you are working towards them), ISO 27001, ISO 9001, ISO 28000:2022, a quality management system, CSA STAR and PCI.
     Call-offs need Cyber Essentials Plus under Lots 1a/1b and Cyber Essentials under Lots 2a, 2b and 3. -->

| Certification | Status | Gap/Action |
|---------------|--------|------------|
| [CERTIFICATION] | Held / In progress / Gap | [ACTION] |

### 10.2 Security Classification and Public Sector Needs

| Requirement | Answer | Notes |
|-------------|--------|-------|
| Highest classification handled (OFFICIAL; above OFFICIAL means Lot 1b) | [CLASSIFICATION] | [NOTES] |
| Public sector network connections (PSN, HSCN, other) | [NETWORKS] | [NOTES] |
| Sector assurance (for example NHS DSPT) | [ANSWER] | [NOTES] |

---

## 11. Go-to-Market

### 11.1 Search Keywords
<!-- The Digital Marketplace search uses light stemming and no synonyms, so use the words buyers type. The service name must not carry extra keywords; put them in the description, features and benefits. -->
- [Keyword 1]
- [Keyword 2]
- [Keyword 3]

### 11.2 Competitor Analysis
<!-- From the Digital Marketplace search for this lot (slug: iaas-and-paas for 1a/1b, isaas for 2a, saas for 2b, cloud-support for 3). -->

**Search used:** "[QUERY]", lot `[SLUG]`, [N] results on [DATE]

| Competitor service | Supplier | Strengths | Weaknesses | Our advantage |
|--------------------|----------|-----------|------------|---------------|
| [SERVICE] | [SUPPLIER] | [STRENGTHS] | [WEAKNESSES] | [ADVANTAGE] |

### 11.3 Success Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Framework sales | £X | Quarterly |
| Win rate | X% | Per opportunity |
| Customer retention | X% | Annual |

---

## 12. Risks and Mitigations

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| [RISK] | High/Med/Low | High/Med/Low | [ACTION] |

---

## 13. Action Plan

### 13.1 Pre-Submission Tasks

| Task | Command | Owner | Due Date | Status |
|------|---------|-------|----------|--------|
| Supplier profile (SUPP) | `/arckit-uk-gcloud:supplier-profile` | [NAME] | [DATE] | ⬜ |
| Social value commitments (SOCV) | `/arckit-uk-gcloud:social-value` | [NAME] | [DATE] | ⬜ |
| Lot questions for this lot group (LOTQ) | `/arckit-uk-gcloud:lot-questions` | [NAME] | [DATE] | ⬜ |
| Supplier declaration (DECL) | `/arckit-uk-gcloud:declaration` | [NAME] | [DATE] | ⬜ |
| Service definition (SDD) | The lot's SDD command (`/arckit-uk-gcloud:sdd-lot1a`, `/arckit-uk-gcloud:sdd-lot1b`, `/arckit-uk-gcloud:sdd-lot2a`, `/arckit-uk-gcloud:sdd-lot2b` or `/arckit-uk-gcloud:sdd-lot3`) | [NAME] | [DATE] | ⬜ |
| Pricing (PRIC) | `/arckit-uk-gcloud:pricing` | [NAME] | [DATE] | ⬜ |
| Security evidence (SECA) | `/arckit-uk-gcloud:security` | [NAME] | [DATE] | ⬜ |
| Competitor benchmark (GCMP, optional) | `/arckit-uk-gcloud:gcloud-competitors` | [NAME] | [DATE] | ⬜ |
| Review (GCRV) | `/arckit-uk-gcloud:review` | [NAME] | [DATE] | ⬜ |
| Submission pack | `/arckit-uk-gcloud:submission-pack` | [NAME] | [DATE] | ⬜ |

### 13.2 Post-Submission Tasks

| Task | Owner | Due Date | Status |
|------|-------|----------|--------|
| Respond to GCA clarification questions | [NAME] | As needed | ⬜ |
| Update the sales team | [NAME] | [DATE] | ⬜ |
| Create sales collateral | [NAME] | [DATE] | ⬜ |

---

## Approvals

| Role | Name | Date | Signature |
|------|------|------|-----------|
| Product Owner | | | |
| Commercial | | | |
| Legal | | | |
| Security | | | |

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

**Generated by**: ArcKit `/arckit:{command}` command
**Generated on**: [DATE]
**ArcKit Version**: [VERSION]
**Project**: [PROJECT_NAME]
**Model**: [AI_MODEL]
