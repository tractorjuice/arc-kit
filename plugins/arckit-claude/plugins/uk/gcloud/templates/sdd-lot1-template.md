# Service Definition Document: [PROJECT_NAME]

> **Template Origin**: Official | **ArcKit Version**: [VERSION] | **Command**: `/arckit-uk-gcloud:sdd-lot1a` or `/arckit-uk-gcloud:sdd-lot1b`

**G-Cloud Lot**: [Lot 1a — Infrastructure as a Service (IaaS) and Platform as a Service (PaaS) / Lot 1b — IaaS and PaaS above OFFICIAL]

## Document Control

<!-- DOC-CONTROL-HEADER -->
<!-- Resolved at command-execution time per _partials/RENDERING.md. -->

## Revision History

| Version | Date | Author | Changes | Approved By | Approval Date |
|---------|------|--------|---------|-------------|---------------|
| [VERSION] | [DATE] | ArcKit AI | Initial creation from `/arckit.[COMMAND]` command | [PENDING] | [PENDING] |

> G-Cloud 15 (RM1557.15) Service Definition Document, run by GCA (the Government Commercial Agency, formerly CCS).
> One template for Lot 1a (IaaS and PaaS) and Lot 1b (IaaS and PaaS above OFFICIAL): GCA asks both lots the same service questions, except where marked **Lot 1b differs**. Sections and questions follow GCA's question export, in its order.
> Questions are from GCA's question export `RM1557.15-G-Cloud-question-export.xlsx`, sheets ‘Services Iaas and Paas’ (1a) and ‘Service above official’ (1b).

## G-Cloud Details

| Field | Value |
|-------|-------|
| Service Name | [SERVICE_NAME] |
| Supplier | [SUPPLIER_NAME] |
| Framework | G-Cloud 15 (RM1557.15) |
| Lot | [1a — Infrastructure as a Service (IaaS) and Platform as a Service (PaaS) / 1b — IaaS and PaaS above OFFICIAL] |
| Highest classification handled (Lot 1b only) | [SECRET / TOP SECRET / Not applicable (Lot 1a)] |
| SDD command | [`/arckit-uk-gcloud:sdd-lot1a` / `/arckit-uk-gcloud:sdd-lot1b`] |
| Listing contact (from the supplier profile; shown on the listing) | [NAME], [EMAIL], [PHONE] |

<!-- The classification row is not a GCA question. It records why a Lot 1b service is in Lot 1b; leave it out of the uploaded document. -->

## How to Use This Document

This document holds the answers to every Lot 1a/1b service question, ready to enter on GCA's Digital Platform. It is also the source for the service definition document you upload at 25.1.

- Tick the options that apply (`- [x]`) and leave the others unticked. A *choose one* question takes exactly one tick.
- A question marked ↳ is asked only when its trigger answer is ticked. When it isn't, write `Not applicable` under it.
- Options are worded as the live G-Cloud 15 listings show them (scraped 7 October 2026), which is what buyers see. Where GCA's Digital Platform words an option differently (the question export), the platform's wording follows in a comment: tick that option when you enter the answer. Never reword an option.
- Write anything the supplier hasn't confirmed as `[PENDING]`. `/arckit-uk-gcloud:review` treats every `[PENDING]` as blocking.
- `<!-- GCA guidance -->` comments repeat GCA's help text and can stay in the working copy.
- **Limits:** service name 100 characters (name only, no extra keywords); description 500 characters; features, benefits, system requirements and backed-up items at most 10 each, 10 words each; and a word limit on each free-text answer, shown on its `**Words:**` line. GCA's export states none of those, but every live listing keeps within them; `framework-questions.md` in the overlay's `gcloud-framework` skill gives the evidence. Write the count in place of `[X]`.
- **Uploaded service definition document:** ODF or PDF/A, at most 5 MB, accessible, and **no prices**. Leave out the support level costs (7.14), Document Control, Revision History, G-Cloud Details, the appendices and External References when you produce it.
- **ISO 27018 (Lots 1a and 1b):** required for any service that includes public cloud (4.1), unless you resell and rely on the cloud provider's accreditations; a private-cloud-only service doesn't need it. It is asked in the lot questions (`/arckit-uk-gcloud:lot-questions`, Part 1 of `projects/000-global/supplier/ARC-000-LOTQ-v*.md`), not here. GCA's later tender updates superseded the export's wording, which ties it to Lot 1b.

### Lot 1b differs

- **19.2 Government security clearance:** Lot 1b offers only ‘Developed Vetting (DV)’ and ‘Security Clearance (SC)’ (‘Up to …’ on the Digital Platform).
- **Prices** go on GCA's separate, non-public platform, and Lot 1b services are not in the public Digital Marketplace search.

---

## 1. Service attributes

**1.1 Service type**

> GCA's export lists this attribute with no question text or guidance. Record the lot the service is submitted under, and check what the Digital Platform shows here when you enter the service.

[LOT LABEL]

---

## 2. Service name

**2.1 Service name** — What’s your service called?
<!-- GCA guidance: Include your service name only. Don’t use extra keywords. -->

```text
[SERVICE NAME]
```

**Characters:** [X]/100

---

## 3. About your service

**3.1 Service description** — Provide a summary describing what your service is for.

```text
[DESCRIPTION]
```

**Characters:** [X]/500

**3.2 Service categories** — Which categories does your service fit under? *(tick all that apply)*

<!-- Choose only from the Lot 1a tree in `g-cloud-15/categories.md` (Lot 1b uses the same tree). Roots: IaaS, PaaS. Write each category as its full path, for example `IaaS > IaaS Compute > Virtualised x86 > General purpose`.
     One root and one group per service: every category ticked shares the same first two levels of its path (`Root > Group`, for example `IaaS > IaaS Compute`). None of the 42,893 live G-Cloud 15 listings scraped on 7 October 2026 has categories in more than one group, although GCA's question export states no rule. A service that spans two groups is listed as two services. -->

**Category group (one per service):** [ROOT > GROUP]

| # | Category (full path, as in the lot's tree) |
|---|---|
| 1 | [ROOT > GROUP > CATEGORY] |

---

## 4. Service features and benefits

**4.1 Service features** — List the service features.
<!-- GCA guidance: Include the technical features of your service, for example ‘real-time reporting’ or ‘remote access’. 10 words for each feature, 10 features maximum. -->

| # | Feature | Words |
|---|---|---|
| 1 | [FEATURE 1] | [X]/10 |
| 2 | [FEATURE 2] | [X]/10 |
| 3 | [FEATURE 3] | [X]/10 |

**Count:** [N]/10

**4.2 Service benefits** — List the service benefits.
<!-- GCA guidance: Include the benefits that show how your service helps users improve their working processes. Use active phrases, for example ‘publish content from multiple devices’ or ‘quickly manage content on the move’. 10 words for each benefit, 10 benefits maximum. -->

| # | Benefit | Words |
|---|---|---|
| 1 | [BENEFIT 1] | [X]/10 |
| 2 | [BENEFIT 2] | [X]/10 |
| 3 | [BENEFIT 3] | [X]/10 |

**Count:** [N]/10

---

## 5. Service scope

**5.1 Cloud deployment model** — Under which of the four NIST cloud deployment models is this service offered? *(tick all that apply)*

- [ ] Public cloud
- [ ] Private cloud
- [ ] Community cloud
- [ ] Hybrid cloud

**5.2 Service constraints** — Does your service have any constraints that buyers should know about?
<!-- GCA guidance: Constraints might include planned maintenance arrangements or support being limited to specific hardware configurations. -->

[ANSWER]

**Words:** [X]/100

**5.3 System requirements** — What system requirements does your service have?
<!-- GCA guidance: Examples of system requirements might be whether buyers have specific software licences or anti-virus technology for virtual machines. 10 words for each requirement, 10 requirements maximum. -->

| # | Requirement | Words |
|---|---|---|
| 1 | [REQUIREMENT 1] | [X]/10 |
| 2 | [REQUIREMENT 2] | [X]/10 |
| 3 | [REQUIREMENT 3] | [X]/10 |

**Count:** [N]/10

---

## 6. Reselling

> Lots 1a and 1b also ask, once per bid in the lot questions, whether you offer IaaS or PaaS as a **Reseller** or with **Sole Control of the Infrastructure**, with evidence of each reseller accreditation. That is answered with `/arckit-uk-gcloud:lot-questions` in Part 1 of the lot questions document (`projects/000-global/supplier/ARC-000-LOTQ-v*.md`); keep it consistent with the supplier type here.

<!-- GCA question group: Supplier type -->

**6.1 Supplier type** — Are you reselling another organisation’s services? *(choose one)*

- [ ] Not a reseller <!-- Digital Platform: “I’m not a reseller” -->
- [ ] Reseller providing extra features and support <!-- Digital Platform: “I’m a reseller providing extra features and support not available from the original supplier” -->
- [ ] Reseller providing extra support <!-- Digital Platform: “I’m a reseller providing extra support” -->
- [ ] Reseller (no extras) <!-- Digital Platform: “I’m a reseller not providing extra features or support” -->

**6.2 Organisation whose services are being resold** — Which organisation’s services do you resell? ↳ *Asked if 6.1 is ‘I’m a reseller providing extra features and support not available from the original supplier’, ‘I’m a reseller providing extra support’ or ‘I’m a reseller not providing extra features or support’.*

[ANSWER]

---

## 7. User support

<!-- GCA question group: Email or ticketing support -->

**7.1 Email or online ticketing support** — Do you provide email or online ticketing support? *(choose one)*

- [ ] Yes
- [ ] Yes, at extra cost
- [ ] No

**7.2 Support response times** — How quickly do you respond to questions? ↳ *Asked if 7.1 is ‘Yes’ or ‘Yes, at extra cost’.*
<!-- GCA guidance: Say if response times are different at weekends. -->

[ANSWER]

**Words:** [X]/100

**7.3 User can manage status and priority of support tickets** — Can users manage the status and priority of their support tickets? *(choose one)* ↳ *Asked if 7.1 is ‘Yes’ or ‘Yes, at extra cost’.*

- [ ] Yes
- [ ] No

**7.4 Online ticketing support accessibility** — What accessibility standards does your online ticketing support management meet? *(choose one)* ↳ *Asked if 7.3 is ‘Yes’.*

- [ ] WCAG 2.2 AAA
- [ ] WCAG 2.2 AA
- [ ] WCAG 2.2 A
- [ ] EN 301 549
- [ ] None or don’t know

<!-- GCA question group: Phone support -->

**7.5 Phone support** — Do you provide phone support? *(choose one)*

- [ ] Yes
- [ ] No

**7.6 Phone support availability** — When can users get phone support? *(choose one)* ↳ *Asked if 7.5 is ‘Yes’.*
<!-- GCA guidance: Choose the closest match to your phone support hours. -->

- [ ] 24 hours, 7 days a week
- [ ] 9 to 5 (UK time), 7 days a week
- [ ] 9 to 5 (UK time), Monday to Friday

<!-- GCA question group: Web chat support -->

**7.7 Web chat support** — Do you provide web chat support? *(choose one)*

- [ ] Yes
- [ ] Yes, at an extra cost
- [ ] No

**7.8 Web chat support availability** — When can users get web chat support? *(choose one)* ↳ *Asked if 7.7 is ‘Yes’ or ‘Yes, at an extra cost’.*
<!-- GCA guidance: Choose the closest match to your web chat support hours. -->

- [ ] 24 hours, 7 days a week
- [ ] 9 to 5 (UK time), 7 days a week
- [ ] 9 to 5 (UK time), Monday to Friday

**7.9 AI chatbot** — Do you make available an AI driven self service tool (BOT) before you reach an operative? *(choose one)* ↳ *Asked if 7.7 is ‘Yes’ or ‘Yes, at an extra cost’.*

- [ ] Yes
- [ ] No

**7.10 Web chat support accessibility standard** — What accessibility standards does your web chat meet? *(choose one)* ↳ *Asked if 7.7 is ‘Yes’ or ‘Yes, at an extra cost’.*

- [ ] WCAG 2.2 AAA
- [ ] WCAG 2.2 AA
- [ ] WCAG 2.2 A
- [ ] EN 301 549
- [ ] None or don’t know

**7.11 How the web chat support is accessible** — Describe how your web chat is accessible. ↳ *Asked if 7.10 is ‘None or don’t know’.*
<!-- GCA guidance: Include details of what users can and can’t do. -->

[ANSWER]

**Words:** [X]/200

**7.12 Web chat accessibility testing** — Describe any web chat testing that you’ve done with assistive technology users. ↳ *Asked if 7.7 is ‘Yes’ or ‘Yes, at an extra cost’.*

[ANSWER]

**Words:** [X]/200

**7.13 Onsite support** — Do you provide onsite support? *(choose one)*

- [ ] Yes
- [ ] Yes, at extra cost
- [ ] No

**7.14 Support levels** — Describe your support levels
<!-- GCA guidance: Describe: the support levels you provide; how much the different support levels cost; whether you provide a technical account manager or cloud support engineer. -->

[ANSWER]

**Words:** [X]/200

**7.15 Support available to third parties** — Can third parties engaged by the buyer access the support features of your service? *(choose one)*

- [ ] Yes
- [ ] No

---

## 8. How users work with your service

<!-- GCA question group: Web interface -->

**8.1 Web browser interface** — Is there a web interface for your service? *(choose one)*

- [ ] Yes
- [ ] No

**8.2 Using the web interface** — Describe what users can and can’t do using your web interface. ↳ *Asked if 8.1 is ‘Yes’.*
<!-- GCA guidance: Include: how users can set up the service through the web interface; how users can make changes through the web interface; any limitations to how users can set up or make changes through the web interface. -->

[ANSWER]

**Words:** [X]/200

**8.3 Web interface accessibility standard** — What accessibility standards does your web interface meet? *(choose one)* ↳ *Asked if 8.1 is ‘Yes’.*

- [ ] WCAG 2.2 AAA
- [ ] WCAG 2.2 AA
- [ ] WCAG 2.2 A
- [ ] EN 301 549
- [ ] None or don’t know

**8.4 How the web interface is accessible** — Describe how your web interface is accessible. ↳ *Asked if 8.3 is ‘None or don’t know’.*
<!-- GCA guidance: Include details of what users can and can’t do. EN 301 549 clause 9 (Web) lists the features and constraints you should describe. -->

[ANSWER]

**Words:** [X]/200

**8.5 Web interface accessibility testing** — Describe any web interface testing you’ve done with assistive technology users. ↳ *Asked if 8.1 is ‘Yes’.*

[ANSWER]

**Words:** [X]/100

<!-- GCA question group: API -->

**8.6 API** — Is there an API for your service? *(choose one)*

- [ ] Yes
- [ ] No

**8.7 What users can and can't do using the API** — Describe what users can and can’t do using your API. ↳ *Asked if 8.6 is ‘Yes’.*
<!-- GCA guidance: Include: how users can set up the service through the API; how users can make changes through the API; any limitations to how users can set up or make changes through the API. -->

[ANSWER]

**Words:** [X]/200

**8.8 API automation tools** — Which standard automation tools work with your service’s API? *(tick all that apply)* ↳ *Asked if 8.6 is ‘Yes’.*

- [ ] Ansible
- [ ] Chef
- [ ] OpenStack
- [ ] SaltStack
- [ ] Terraform
- [ ] Puppet
- [ ] Other

**8.9 Other API automation tools** — List any other automation tools your service’s API uses. ↳ *Asked if 8.8 is ‘Other’.*

- [ITEM]

**8.10 API documentation** — Do you provide API documentation for your service? *(choose one)* ↳ *Asked if 8.6 is ‘Yes’.*

- [ ] Yes
- [ ] No

**8.11 API documentation formats** — How is your API documented? *(tick all that apply)* ↳ *Asked if 8.10 is ‘Yes’.*

- [ ] Open API (also known as Swagger)
- [ ] HTML
- [ ] ODF
- [ ] PDF
- [ ] Other

<!-- GCA question group: Command line interface -->

**8.12 Command line interface** — Is there a command line interface for your service? *(choose one)*

- [ ] Yes
- [ ] No

**8.13 Command line interface compatibility** — Which operating systems does your command line interface work with? *(tick all that apply)* ↳ *Asked if 8.12 is ‘Yes’.*

- [ ] Linux or Unix
- [ ] Windows
- [ ] MacOS <!-- Digital Platform: “macOS” -->
- [ ] Other

**8.14 Using the command line interface** — Describe what users can and can’t do using the command line interface. ↳ *Asked if 8.12 is ‘Yes’.*
<!-- GCA guidance: Include: how users can set up the service through the command line interface; how users can make changes through the command line; any limitations to how users can set up or make changes through the command line. -->

[ANSWER]

**Words:** [X]/200

---

## 9. Onboarding and offboarding

**9.1 Getting started** — How do you help users start using your service?
<!-- GCA guidance: Include, for example, whether you provide onsite training, online training, or user documentation. -->

[ANSWER]

**Words:** [X]/200

<!-- GCA question group: Documentation -->

**9.2 Service documentation** — Do you provide documentation for your service? *(choose one)*

- [ ] Yes
- [ ] No

**9.3 Documentation formats** — What formats do you provide documentation in? *(tick all that apply)* ↳ *Asked if 9.2 is ‘Yes’.*

- [ ] HTML
- [ ] ODF
- [ ] PDF
- [ ] Other

**9.4 Other documentation formats** — What other formats do you provide documentation in? ↳ *Asked if 9.3 is ‘Other’.*

- [ITEM]

**9.5 Documentation accessibility standard** — What accessibility standards does your documentation meet? *(choose one)* ↳ *Asked if 9.2 is ‘Yes’.*

- [ ] WCAG 2.2 AAA
- [ ] WCAG 2.2 AA
- [ ] WCAG 2.2 A
- [ ] EN 301 549
- [ ] None or don’t know

**9.6 How the documentation is accessible** — Describe how your onboarding and offboarding documentation is accessible. ↳ *Asked if 9.5 is ‘None or don’t know’.*

[ANSWER]

**Words:** [X]/200

**9.7 End-of-contract data extraction** — How do users extract their data when the contract ends?

[ANSWER]

**Words:** [X]/200

**9.8 End-of-contract process** — Describe what happens at the end of the contract.
<!-- GCA guidance: Describe what’s included in the price of the contract and what’s an additional cost. -->

[ANSWER]

**Words:** [X]/200

---

## 10. Backups and recovery

<!-- GCA question group: Backup and recovery -->

**10.1 Backup and recovery** — Does your service provide backup and recovery? *(choose one)*

- [ ] Yes
- [ ] No

**10.2 What’s backed up** — What can the service back up? ↳ *Asked if 10.1 is ‘Yes’.*
<!-- GCA guidance: Examples include files, virtual machines, or databases. 10 words for each backup item, 10 backup items maximum. -->

| # | Backup item | Words |
|---|---|---|
| 1 | [BACKUP ITEM 1] | [X]/10 |
| 2 | [BACKUP ITEM 2] | [X]/10 |
| 3 | [BACKUP ITEM 3] | [X]/10 |

**Count:** [N]/10

**10.3 Backup controls** — How do users control what backups are performed? ↳ *Asked if 10.1 is ‘Yes’.*
<!-- GCA guidance: Include, for example, whether users can back up different things on a different schedule. -->

[ANSWER]

**Words:** [X]/100

**10.4 Datacentre setup** — What’s your datacentre setup? *(tick all that apply)* ↳ *Asked if 10.1 is ‘Yes’.*

- [ ] Multiple datacentres with disaster recovery
- [ ] Multiple datacentres
- [ ] Single datacentre with multiple copies
- [ ] Single datacentre

**10.5 Scheduling backups** — How do users schedule backups? *(choose one)* ↳ *Asked if 10.1 is ‘Yes’.*

- [ ] Users schedule backups through a web interface
- [ ] Users contact the support team to schedule backups
- [ ] Supplier controls the whole backup schedule

**10.6 Backup recovery** — How do users recover backups? *(tick all that apply)* ↳ *Asked if 10.1 is ‘Yes’.*

- [ ] Users can recover backups themselves, for example through a web interface
- [ ] Users contact the support team

**10.7 RPO/RTO** — Do you provide recovery point objectives (RPO) and recovery time objectives (RTO)? *(choose one)* ↳ *Asked if 10.1 is ‘Yes’.*

- [ ] Yes
- [ ] No

---

## 11. Analytics

<!-- GCA question group: Metrics -->

**11.1 Infrastructure or application metrics** — Do you provide infrastructure or application metrics? *(choose one)*

- [ ] Yes
- [ ] No

**11.2 Metrics types** — What infrastructure or application metrics do you provide? *(tick all that apply)* ↳ *Asked if 11.1 is ‘Yes’.*

- [ ] CPU
- [ ] Disk
- [ ] HTTP request and response status
- [ ] Memory
- [ ] Network
- [ ] Number of active instances
- [ ] Other

**11.3 Other metrics** — What other infrastructure or application metrics do you provide? ↳ *Asked if 11.2 is ‘Other’.*

- [ITEM]

**11.4 Reporting types** — How do you provide infrastructure or application metrics? *(tick all that apply)* ↳ *Asked if 11.1 is ‘Yes’.*

- [ ] API access <!-- Digital Platform: “Through an API” -->
- [ ] Real-time dashboards
- [ ] Regular reports
- [ ] Reports on request

**11.5 Resource tagging** — Does your solution support resource tagging? *(choose one)* ↳ *Asked if 11.1 is ‘Yes’.*

- [ ] Yes
- [ ] No

**11.6 FOCUS resource tagging** — Does your solution support FOCUS resource tagging? *(choose one)* ↳ *Asked if 11.1 is ‘Yes’.*

- [ ] Yes
- [ ] No

---

## 12. Scaling

**12.1 Independence of resources** — How do you guarantee users aren’t affected by the demand other users are placing on your service?

[ANSWER]

**Words:** [X]/100

<!-- GCA question group: Usage notifications -->

**12.2 Usage notifications** — Do you notify users if usage nears service limits? *(choose one)*

- [ ] Yes
- [ ] No

**12.3 Usage reporting** — How are users notified if usage nears service limits? *(tick all that apply)* ↳ *Asked if 12.2 is ‘Yes’.*

- [ ] API
- [ ] Email
- [ ] SMS
- [ ] Other

**12.4 Other usage reporting** — Describe the other ways users are notified if usage nears service limits ↳ *Asked if 12.3 is ‘Other’.*

[ANSWER]

**Words:** [X]/200

**12.5 Optimising consumption** — Does your solution provide information to help users optimise their consumption? *(choose one)* ↳ *Asked if 12.2 is ‘Yes’.*

- [ ] Yes
- [ ] No

**12.6 Automatic scaling** — Does your solution scale up and down automatically; reduce resources (and therefore cost) when under utilised, and/or increase resources in the event of additional demand? *(choose one)* ↳ *Asked if 12.2 is ‘Yes’.*

- [ ] Yes
- [ ] No

---

## 13. Data-in-transit protection

<!-- GCA question group: Protection between networks -->

**13.1 Data protection between buyer and supplier networks** — How do you protect data between the buyer’s network and your network? *(tick all that apply)*
<!-- GCA guidance: NCSC cloud security principle 1: Data-in-transit protection. -->

- [ ] Private network or public sector network
- [ ] TLS (version 1.2 or above) <!-- Digital Platform: “TLS (Version 1.2 or above)” -->
- [ ] IPsec or TLS VPN gateway
- [ ] Legacy SSL and TLS (under version 1.2) <!-- Digital Platform: “Legacy SSL and TLS (under 1.2)” -->
- [ ] Other

**13.2 Other protection between networks** — Describe how else you protect data between the buyer’s network and your network. ↳ *Asked if 13.1 is ‘Other’.*

[ANSWER]

**Words:** [X]/100

<!-- GCA question group: Protection within your network -->

**13.3 Data protection within supplier network** — How do you protect data within your network? *(tick all that apply)*
<!-- GCA guidance: NCSC cloud security principle 1: Data-in-transit protection. -->

- [ ] TLS (version 1.2 or above) <!-- Digital Platform: “TLS (Version 1.2 or above)” -->
- [ ] IPsec or TLS VPN gateway
- [ ] Legacy SSL and TLS (under version 1.2) <!-- Digital Platform: “Legacy SSL and TLS (under 1.2)” -->
- [ ] Other

**13.4 Other protection within supplier network** — Describe how else you protect data within your network. ↳ *Asked if 13.3 is ‘Other’.*

[ANSWER]

**Words:** [X]/100

---

## 14. Asset protection

<!-- GCA question group: Data storage and processing locations -->

**14.1 Knowledge of data storage and processing locations** — Do you know where your data is stored and processed? *(choose one)*

- [ ] Yes
- [ ] No

**14.2 Data storage and processing locations** — Where is data stored and processed? *(tick all that apply)* ↳ *Asked if 14.1 is ‘Yes’.*

- [ ] United Kingdom
- [ ] European Economic Area (EEA)
- [ ] Other locations

**14.3 User control over data storage and processing locations** — Can users specify where data is stored and processed? *(choose one)* ↳ *Asked if 14.1 is ‘Yes’.*

- [ ] Yes
- [ ] No

**14.4 Datacentre security standards** — With which standards does your datacentre security setup comply? *(choose one)*
<!-- GCA guidance: NCSC cloud security principle 2: Asset protection and resilience. -->

- [ ] Complies with a recognised standard (for example CSA CCM version 4.0) <!-- Digital Platform: “Complies with a recognised standard, for example CSA CCM v4.0 or SSAE-18 / ISAE 3402” -->
- [ ] Supplier-defined controls
- [ ] Managed by a third party

<!-- GCA question group: Penetration testing -->

**14.5 Penetration testing frequency** — How often do you do penetration testing? *(choose one)*

- [ ] At least every 6 months
- [ ] At least once a year
- [ ] Less than once a year
- [ ] Never

**14.6 Penetration testing approach** — What is your approach to penetration testing? *(choose one)* ↳ *Asked if 14.5 is ‘At least every 6 months’, ‘At least once a year’ or ‘Less than once a year’.*

- [ ] ‘IT Health Check’ performed by a CHECK service provider
- [ ] NCSC approved service provider
- [ ] ‘IT Health Check’ performed by a CREST-approved service provider
- [ ] Another external penetration testing organisation
- [ ] In-house

<!-- GCA question group: Protection of data at rest -->

**14.7 Protecting data at rest** — How do you protect data at rest? *(tick all that apply)*
<!-- GCA guidance: NCSC cloud security principle 2: Asset protection and resilience. -->

- [ ] Physical access control, complying with CSA CCM v4.0
- [ ] Physical access control, complying with SSAE-18 / ISAE 3402
- [ ] Physical access control, complying with another standard
- [ ] Encryption of all physical media
- [ ] Scale, obfuscating techniques, or data storage sharding
- [ ] Other

**14.8 Other data at rest protection approach** — Describe how else you protect data at rest. ↳ *Asked if 14.7 is ‘Other’.*

[ANSWER]

**Words:** [X]/100

<!-- GCA question group: Data sanitisation process -->

**14.9 Data sanitisation process** — Do you have a data sanitisation process? *(choose one)*
<!-- GCA guidance: NCSC cloud security principle 2: Asset protection and resilience. -->

- [ ] Yes
- [ ] No

**14.10 Data sanitisation type** — How do you make sure customer data is sanitised and/or permanently erased from your solution after use? *(tick all that apply)* ↳ *Asked if 14.9 is ‘Yes’.*

- [ ] Deleted data can’t be directly accessed / Cryptographic Erasure
- [ ] Data Erasure
- [ ] Explicit overwriting of storage before reallocation / Secure Erase
- [ ] Degaussing
- [ ] Physical Destruction / Hardware containing data is completely destroyed

**14.11 Equipment disposal approach** — How do you dispose of equipment? *(choose one)*
<!-- GCA guidance: NCSC cloud security principle 2: Asset protection and resilience. -->

- [ ] Complying with a recognised standard, for example CSA CCM v4.0, CAS (Sanitisation) or ISO/IEC 27001
- [ ] In-house destruction process
- [ ] A third-party destruction service

---

## 15. Availability and resilience

**15.1 Guaranteed availability** — Describe the level of availability you guarantee.
<!-- GCA guidance: Include any service level agreements (SLAs) you have for availability and how users are refunded if you don’t meet guaranteed levels of availability. -->

[ANSWER]

**Words:** [X]/200

**15.2 Approach to resilience** — Describe how your service is designed to be resilient.
<!-- GCA guidance: Include how your datacentre setup is resilient. If you don’t want to make this information public, you can say that it’s available on request. NCSC cloud security principle 2: Asset protection and resilience. -->

[ANSWER]

**Words:** [X]/200

**15.3 Outage reporting** — How does your service report any outages?
<!-- GCA guidance: Include if there’s: a public dashboard; an API; email alerts. -->

[ANSWER]

**Words:** [X]/200

---

## 16. Separation between users

<!-- GCA question group: Virtualisation -->

**16.1 Virtualisation technology used to keep applications and users sharing the same infrastructure apart** — Do you rely on virtualisation technology to keep applications and users sharing the same infrastructure apart? *(choose one)*
<!-- GCA guidance: NCSC cloud security principle 3: Separation between users. -->

- [ ] Yes
- [ ] No

**16.2 Who implements virtualisation** — Who implements the virtualisation technology? *(choose one)* ↳ *Asked if 16.1 is ‘Yes’.*

- [ ] Supplier
- [ ] Third-party

**16.3 Virtualisation technologies used** — What virtualisation technologies are used? *(choose one)* ↳ *Asked if 16.2 is ‘Supplier’.*

- [ ] VMware
- [ ] Hyper-V
- [ ] Citrix XenServer
- [ ] Oracle VM
- [ ] Red Hat Virtualisation
- [ ] KVM hypervisor
- [ ] Other

**16.4 Other virtualisation technology used** — Which other virtualisation technology do you use? ↳ *Asked if 16.3 is ‘Other’.*

[ANSWER]

**Words:** [X]/100

**16.5 Third-party virtualisation provider** — Which third-party service provider are you using for virtualisation? ↳ *Asked if 16.2 is ‘Third-party’.*

[ANSWER]

**16.6 How shared infrastructure is kept separate** — Describe how different organisations sharing the same infrastructure are kept apart. ↳ *Asked if 16.1 is ‘Yes’.*

[ANSWER]

**Words:** [X]/100

---

## 17. Governance

**17.1 Named board-level person responsible for service security** — Does your organisation have a named person with board-level (or equivalent) authorisation who’s responsible for the security of all of your services? *(choose one)*
<!-- GCA guidance: NCSC cloud security principle 4: Governance framework. -->

- [ ] Yes
- [ ] No

<!-- GCA question group: Security governance -->

**17.2 Security governance certified** — Is your security governance certified to a standard? *(choose one)*

- [ ] Yes
- [ ] No

**17.3 Security governance standards** — What security governance standards do you comply with? *(tick all that apply)* ↳ *Asked if 17.2 is ‘Yes’.*

- [ ] CSA CSM version 4.0 <!-- Digital Platform: “Physical access control, complying with CSA CCM v4.0” -->
- [ ] ISO/IEC 27001
- [ ] Other

**17.4 Other security governance standards** — List the other standards your governance standards comply with. ↳ *Asked if 17.3 is ‘Other’.*

[ANSWER]

**Words:** [X]/50

**17.5 Security governance approach** — Describe how you approach security governance. ↳ *Asked if 17.2 is ‘No’.*

[ANSWER]

**Words:** [X]/100

**17.6 Information security policies and processes** — What information security policies and processes do you follow?
<!-- GCA guidance: Include your reporting structure and how you ensure policies are followed. -->

[ANSWER]

**Words:** [X]/200

---

## 18. Operational security

**18.1 Configuration and change management standard** — Which configuration and change management processes does your organisation comply with? *(choose one)*
<!-- GCA guidance: NCSC cloud security principle 5: Operational security. -->

- [ ] Complies with a recognised standard, for example CSA CCM v4.0 or SSAE-18 / ISAE 3402
- [ ] Supplier-defined controls

**18.2 Configuration and change management approach** — Describe your configuration and change management processes.
<!-- GCA guidance: Include details of how: the components of your services are tracked through their lifetime; changes are assessed for potential security impact. -->

[ANSWER]

**Words:** [X]/100

**18.3 Vulnerability management type** — Which vulnerability management processes does your organisation comply with? *(choose one)*
<!-- GCA guidance: NCSC cloud security principle 5: Operational security. -->

- [ ] Complies with a recognised standard, for example CSA CCM v4.0 or SSAE-18 / ISAE 3402
- [ ] Supplier-defined controls
- [ ] Undisclosed

**18.4 Vulnerability management approach** — Describe your vulnerability management process?
<!-- GCA guidance: Include details of: how you assess potential threats to your services; how quickly you deploy patches to your services; where you get your information about potential threats from. -->

[ANSWER]

**Words:** [X]/100

**18.5 Protective monitoring type** — Which protective monitoring processes does your organisation comply with? *(choose one)*
<!-- GCA guidance: NCSC cloud security principle 5: Operational security. -->

- [ ] Complies with a recognised standard, for example CSA CCM v4.0 or SSAE-18 / ISAE 3402
- [ ] Supplier-defined controls
- [ ] Undisclosed

**18.6 Protective monitoring approach** — Describe your protective monitoring processes.
<!-- GCA guidance: Include: how you identify potential compromises; how you respond when you find a potential compromise; how quickly you respond to incidents. -->

[ANSWER]

**Words:** [X]/100

**18.7 Incident management type** — Which incident management processes does your organisation comply with? *(choose one)*
<!-- GCA guidance: NCSC cloud security principle 5: Operational security. -->

- [ ] Complies with a recognised standard, for example, CSA CCM v4.0 or ISO/IEC 27035:2011 or SSAE-18 / ISAE 3402
- [ ] Supplier-defined controls
- [ ] Undisclosed

**18.8 Post-quantum cryptography secure** — Are you compliant with NCSC guidance on Post-quantum cryptography secure? *(choose one)*

- [ ] Yes
- [ ] No

**18.9 Incident management approach** — Describe your incident management processes.
<!-- GCA guidance: Include: whether you have pre-defined processes for common events; how users report incidents; how you provide incident reports. -->

[ANSWER]

**Words:** [X]/100

---

## 19. Staff security

**19.1 Staff security clearance** — How do you manage staff security clearance checks? *(choose one)*
<!-- GCA guidance: NCSC cloud security principle 6: Personnel security. -->

- [ ] Conforms to BS7858:2019 <!-- Digital Platform: “Staff screening performed which conforms to BS7858:2019” -->
- [ ] Other security clearance <!-- Digital Platform: “Staff screening performed but doesn’t conform with BS7858:2019” -->
- [ ] Staff screening not performed

**19.2 Government security clearance** — If the role requires it, what level of security clearance are you prepared to make sure your staff have? *(choose one)*

> **Lot 1b differs here.** Lot 1b offers only ‘Developed Vetting (DV)’ and ‘Security Clearance (SC)’. ‘Baseline Personnel Security Standard (BPSS)’ and ‘None’ are Lot 1a options only. Lot 1b isn't publicly listed, so its options are worded as Lot 1a's listings show them.

- [ ] Developed Vetting (DV) <!-- Digital Platform: “Up to Developed Vetting (DV)” -->
- [ ] Security Clearance (SC) <!-- Digital Platform: “Up to Security Clearance (SC)” -->
- [ ] Baseline Personnel Security Standard (BPSS) <!-- Digital Platform: “Up to Baseline Personnel Security Standard (BPSS)” -->
- [ ] None

---

## 20. Secure development

**20.1 Approach to secure software development best practice** — How does your organisation demonstrate that it adheres to best practice in secure software development? *(choose one)*
<!-- GCA guidance: NCSC cloud security principle 7: Secure development. -->

- [ ] Independent review of processes (for example CESG CPA Build Standard, ISO/IEC 27034, ISO/IEC 27001 or CSA CCM v4.0)
- [ ] Conforms to a recognised standard, but self-assessed
- [ ] Supplier-defined process

---

## 21. Identity and authentication

<!-- GCA question group: User authentication -->

**21.1 User authentication needed** — Do users need to be authenticated when using your service? *(choose one)*

- [ ] Yes
- [ ] No

**21.2 User authentication** — How do you authenticate users when they access the service? *(tick all that apply)* ↳ *Asked if 21.1 is ‘Yes’.*
<!-- GCA guidance: NCSC cloud security principle 10: Identity and authentication. -->

- [ ] Multi-Factor Authentication (MFA)
- [ ] Public key authentication (including by TLS client certificate)
- [ ] Identity federation with existing provider (for example Google Apps) <!-- Digital Platform: “Identity federation with existing provider (for example Google apps)” -->
- [ ] Limited access network (for example PSN) <!-- Digital Platform: “Limited access over government network (for example PSN)” -->
- [ ] Dedicated link (for example VPN) <!-- Digital Platform: “Dedicated link (for example VPN or bonded fibre)” -->
- [ ] Username or password
- [ ] Other

**21.3 Other user authentication** — Describe how you authenticate users when they access the service. ↳ *Asked if 21.2 is ‘Other’.*

[ANSWER]

**Words:** [X]/100

**21.4 Access restrictions in management interfaces and support channels** — Describe how you restrict access in management interfaces and support channels.

[ANSWER]

**Words:** [X]/100

**21.5 Access restriction testing frequency** — How often do you test your access controls? *(choose one)*

- [ ] At least every 6 months
- [ ] At least once a year
- [ ] Less than once a year
- [ ] Never

<!-- GCA question group: Management access -->

**21.6 Management access authentication** — How do you authenticate management access to your service? *(tick all that apply)*

- [ ] Multi-Factor Authentication (MFA)
- [ ] Public key authentication (including by TLS client certificate)
- [ ] Identity federation with existing provider (for example Google Apps) <!-- Digital Platform: “Identity federation with existing provider (for example Google apps)” -->
- [ ] Limited access network (for example PSN) <!-- Digital Platform: “Limited access over government network (for example PSN)” -->
- [ ] Dedicated link (for example VPN) <!-- Digital Platform: “Dedicated link (for example VPN or bonded fibre)” -->
- [ ] Username or password
- [ ] Other

**21.7 Description of management access authentication** — Describe how you authenticate management access to your service. ↳ *Asked if 21.6 is ‘Other’.*

[ANSWER]

**Words:** [X]/100

**21.8 Devices users manage the service through** — Which devices can be used to manage the service? *(tick all that apply)*

- [ ] Dedicated device on a segregated network (providers own provision)
- [ ] Dedicated device on a government network (for example PSN)
- [ ] Dedicated device over multiple services or networks
- [ ] Any device but through a bastion host (a bastion host is a server that provides access to a private network from an external network such as the internet)
- [ ] Directly from any device which may also be used for normal business (for example web browsing or viewing external email)

---

## 22. Audit information for users

<!-- GCA question group: Audit for buyers’ users’ actions -->

**22.1 Access to user activity audit information** — How do buyers access audit information about the actions their users have taken? *(choose one)*
<!-- GCA guidance: NCSC cloud security principle 13: Audit information for users. -->

- [ ] Users have access to real-time audit information
- [ ] Users receive audit information on a regular basis
- [ ] Users contact the support team to get audit information
- [ ] You control when users can access audit information
- [ ] No audit information available

**22.2 How long user audit data is stored for** — How long do you store users’ audit data for? *(choose one)* ↳ *Asked if 22.1 is ‘Users have access to real-time audit information’, ‘Users receive audit information on a regular basis’, ‘Users contact the support team to get audit information’ or ‘You control when users can access audit information’.*

- [ ] User-defined
- [ ] At least 12 months
- [ ] Between 6 months and 12 months
- [ ] Between 1 month and 6 months
- [ ] Less than 1 month

<!-- GCA question group: Audit for suppliers’ users’ actions -->

**22.3 Access to supplier activity audit information** — How do buyers access audit information about the actions your organisation has taken? *(choose one)*

- [ ] Users have access to real-time audit information
- [ ] Users receive audit information on a regular basis
- [ ] Users contact the support team to get audit information
- [ ] You control when users can access audit information
- [ ] No audit information available

**22.4 How long supplier audit data is stored for** — How long do you store your organisation’s audit data for? *(choose one)* ↳ *Asked if 22.3 is ‘Users have access to real-time audit information’, ‘Users receive audit information on a regular basis’, ‘Users contact the support team to get audit information’ or ‘You control when users can access audit information’.*

- [ ] User-defined
- [ ] At least 12 months
- [ ] Between 6 months and 12 months
- [ ] Between 1 month and 6 months
- [ ] Less than 1 month

**22.5 How long system logs are stored for** — How long are system logs stored for? *(choose one)*
<!-- GCA guidance: Buyers may want reassurance about your ability to investigate security incidents. -->

- [ ] User-defined
- [ ] At least 12 months
- [ ] Between 6 months and 12 months
- [ ] Between 1 month and 6 months
- [ ] Less than 1 month

---

## 23. Energy efficiency

**23.1 Energy-efficient datacentres** — Do your datacentres adhere to the EU code of conduct for energy-efficient datacentres? *(choose one)*

- [ ] Yes
- [ ] No

**23.2 Description of energy efficient datacentres** — Describe how your datacentres adhere to the EU Code of Conduct for Energy Efficient datacentres ↳ *Asked if 23.1 is ‘Yes’.*

[ANSWER]

**Words:** [X]/200

---

## 24. Pricing

> Prices are not answered here. The Lot 1a/1b price formula (baseline price, fixed onboarding costs, framework discount, further supplier-specific schemes, time-limited discounts) and the baseline pricing web link are set with `/arckit-uk-gcloud:pricing` in the service's pricing document (`ARC-{PROJECT_ID}-PRIC-v*.md`). Onboarding price and minimum discount are each scored at 5%. Lot 1b prices go on GCA's separate, non-public platform.

**24.1 Discount for educational organisations** — Do you offer special pricing for educational organisations? *(choose one)*

- [ ] Yes
- [ ] No

<!-- GCA question group: Free or trial versions -->

**24.2 Free trial available** — Do you provide a free trial option for your service? *(choose one)*

- [ ] Yes
- [ ] No

**24.3 Description of free trial** — Describe the free version of your service. ↳ *Asked if 24.2 is ‘Yes’.*
<!-- GCA guidance: Include: what’s included; what isn’t included; if there’s a limited time period. -->

[ANSWER]

**Words:** [X]/50

**24.4 Link to free trial** — Provide a link to the free version of your service ↳ *Asked if 24.2 is ‘Yes’.*

[ANSWER]

---

## 25. Documents

> Upload one terms and conditions document per service. The service definition document must not contain prices. All three documents are uploaded on GCA's Digital Platform and are not indexed by the Digital Marketplace search, so the listing's own answers carry the keywords.

**25.1 Service definition document** — Add your service definition document
<!-- GCA guidance: Read the suppliers’ guide for guidance on what to include. This document will not be indexed by search on the Digital Marketplace. Your document should: be an Open Document Format (ODF) or PDF/A; have a maximum file size of 5MB; meet accessibility standards. -->

**File:** [FILE NAME] — ODF or PDF/A, [X] MB of 5 MB, accessibility checked: [YES/PENDING]

**25.2 Terms and conditions document** — Add your terms and conditions document
<!-- GCA guidance: This document will not be indexed by search on the Digital Marketplace. Your document should: be an Open Document Format (ODF) or PDF/A; have a maximum file size of 5MB; meet accessibility standards. -->

**File:** [FILE NAME] — ODF or PDF/A, [X] MB of 5 MB, accessibility checked: [YES/PENDING]

**25.3 Pricing document** — Add your pricing document
<!-- GCA guidance: This document will not be indexed by search on the Digital Marketplace. Your document should: be an Open Document Format (ODF) or PDF/A; have a maximum file size of 5MB; meet accessibility standards. -->

**File:** [FILE NAME] — ODF or PDF/A, [X] MB of 5 MB, accessibility checked: [YES/PENDING]

---

## Appendix A: Evidence Register

Evidence for assertions buyers or GCA may ask you to prove. Leave this appendix out of the uploaded document.

| Assertion | Question | Evidence | Location |
|-----------|----------|----------|----------|
| [ASSERTION] | [N.N] | [DOCUMENT] | [URL/PATH] |

---

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
