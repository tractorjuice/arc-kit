# G-Cloud Lot Questions: [PROJECT_NAME]

> **Template Origin**: Official | **ArcKit Version**: [VERSION] | **Command**: `/arckit-uk-gcloud:lot-questions`

## Document Control

<!-- DOC-CONTROL-HEADER -->
<!-- Resolved at command-execution time per _partials/RENDERING.md. -->

## Revision History

| Version | Date | Author | Changes | Approved By | Approval Date |
|---------|------|--------|---------|-------------|---------------|
| [VERSION] | [DATE] | ArcKit AI | Initial creation from `/arckit.[COMMAND]` command | [PENDING] | [PENDING] |

> G-Cloud 15 (RM1557.15) lot questions for GCA (the Government Commercial Agency, formerly CCS), answered once per supplier for each lot group bid for.
> Questions and answer options are from GCA's question export. Weightings and marking schemes are from Attachment 2d (Quality questionnaire) v4.0 and Attachment 2 (How to tender) v5.0.

<!-- One document per supplier, with one Part per lot group bid for:
     Part 1 (Lots 1a and 1b), Part 2 (Lots 2a and 2b), Part 3 (Lot 3).
     Keep the Parts for the lot groups bid for and delete the others. A re-run for
     another lot group adds its Part and bumps the version. -->

## G-Cloud Details

| Field | Value |
|-------|-------|
| Supplier | [COMPANY_NAME] |
| Framework | G-Cloud 15 (RM1557.15), Government Commercial Agency (GCA, formerly CCS) |
| Lot groups | [Lots 1a and 1b / Lots 2a and 2b / Lot 3] |
| Lots bid for | [1a / 1b / 2a / 2b / 3] |
| Services in these lot groups | [projects/NNN-name (lot), ...] |
| Confirmation status | Draft / Confirmed by [NAME, ROLE] on [DATE] |

---

## Part 1: Lots 1a and 1b (IaaS and PaaS)

### Evaluation at a Glance

| Element | Weight | Marking | Where it is answered |
|---------|--------|---------|----------------------|
| Conditions of participation | — | Pass/fail; failing any one disregards the tender | Section 1 below |
| Social value | 10% | Pass/fail | the SOCV document (`/arckit-uk-gcloud:social-value`) |
| Quality Cloud Services | 40% | 100/50/0 | Section 2.1 below |
| Maximising Buyer Value | 40% | 100/66/33/0 | Section 2.2 below |
| Price for onboarding | 5% | Price assessment | each service's PRIC document (`/arckit-uk-gcloud:pricing`) |
| Discount | 5% | Price assessment | each service's PRIC document (`/arckit-uk-gcloud:pricing`) |
| Non-scored mandatory questions | — | Must be answered | Section 3 below |

A mark of zero on either quality question disqualifies the tender for Lots 1a and 1b.

### 1. Conditions of Participation

#### 1.1 Reseller or Sole Control of the Infrastructure

**Are you are bidding to offer IaaS and/or PaaS as a reseller or are you in sole control of the infrastructure** — **The specification for this Lot requires that the Supplier is in sole control of the infrastructure that underlies its Services or can evidence that they are an accredited reseller of such infrastructure. Confirm whether you are bidding to offer IaaS and/or PaaS as a reseller**

- [ ] Reseller
- [ ] Sole Control of the Infrastructure

*Guidance: if you will offer both proprietary and resold services as part of your core IaaS and PaaS offering, select "Reseller". If you may resell another's service only where it is ancillary to the core IaaS or PaaS service, but provide the core services entirely without reselling in normal operation, select "Sole Control".*

**Answer:** [ANSWER] **Basis:** [EVIDENCE]

#### 1.2 Cloud Service Suppliers You Intend to Resell with Evidence *(Reseller only)*

**List the cloud service suppliers you intend to resell and identify for each evidence of accreditation or a partnership agreement (this may be in the form of a link to a published list of accredited resellers in which you are included).**

| # | Organisation name | Website address/upload for organisation | Website address, or file uploaded |
|---|-------------------|------------------------------------------|-----------------------------------|
| 1 | [ORGANISATION] | Website address / Upload | [URL or FILE] |

#### 1.3 Reliance on the Cloud Service Provider's Accreditations *(Reseller only)*

**Are you reliant on the Cloud Service Provider for some accreditations required by the specification for this Lot, such as cloud security related ISOs?**

- [ ] Yes
- [ ] No

*Guidance: because the services are resold in their entirety, the service may be accredited in the original supplier's name and you will not need to hold that accreditation directly.*

**Answer:** [ANSWER]

#### 1.4 Lot 1b and ISO 27018 *(asked for Sole Control, or for a Reseller answering "No" to 1.3)*

**Are you bidding to provide services under Lot 1b or both Lot 1a and Lot 1b?** — **You must provide your ISO 27018 certification if you are bidding for Lot 1b, but you do not need to provide this certification if you are only bidding for Lot 1a. Are you bidding to provide services under Lot 1b? (answer yes if you are bidding only for Lot 1b, and also if you are bidding for both Lot 1a and Lot 1b)**

- [ ] Yes
- [ ] No

*Answering "Yes" without uploading the ISO 27018 certificate leaves a Lot 1b bid incomplete.*

> **Superseded by GCA's update.** The question above is the export's wording. GCA's Updates to Tender Documents, Framework Schedule 1 v2.1 and Attachment 2 v5.0 changed the requirement: ISO 27018 is **mandatory for Lots 1a and 1b whenever the services include public cloud**, unless you are a Reseller relying on your provider's accreditations (1.3). Services offered only on private cloud deployment models don't need it. So hold and upload ISO 27018 if any of your Lot 1a or 1b services is offered on public cloud, even for a Lot 1a-only bid. If the Digital Platform still asks only the Lot 1b question, ask GCA through the Digital Platform how to provide the certificate.

**Answer:** [ANSWER]

**Lot 1a/1b services offered on public cloud:** [SERVICE (deployment model), ... or "None: private cloud only"]

#### 1.5 ISO Certificates

*Uploads must be Open Document Format or PDF/A, at most 5 MB. Attachment 2 also accepts evidence that accreditation has been started; a tender with neither is disregarded. Certificates are checked again before framework award.*

| Certificate | Asked because | Held | File to upload | Expiry | Source |
|-------------|---------------|------|----------------|--------|--------|
| ISO 9001 certification | Always | Yes / No / [PENDING] | [FILE] | [DATE] | [SOURCE] |
| ISO 27001 certification | Always | Yes / No / [PENDING] | [FILE] | [DATE] | [SOURCE] |
| ISO 20000-1 certification | Always | Yes / No / [PENDING] | [FILE] | [DATE] | [SOURCE] |
| ISO 14001 certification | Sole Control, or Reseller answering "No" to 1.3 | Yes / No / Not asked / [PENDING] | [FILE] | [DATE] | [SOURCE] |
| ISO 27017 certification | Sole Control, or Reseller answering "No" to 1.3 | Yes / No / Not asked / [PENDING] | [FILE] | [DATE] | [SOURCE] |
| ISO 27018 certification | Any Lot 1a or 1b service includes public cloud, on the Sole Control or non-relying Reseller branches (GCA update; the export asks only for Lot 1b) | Yes / No / Not required / [PENDING] | [FILE] | [DATE] | [SOURCE] |

#### 1.6 Carbon Reduction Plan

*Pass/fail. The plan must follow the PPN 006 template, commit to Net Zero by 2050, report Scope 1 and 2 emissions and a defined subset of Scope 3 (or explain why not), set out the environmental management measures you will apply when performing the contract, have a reporting period no more than 12 months before the date the procurement began (or explain why), be published on your website (or uploaded if you have no website), and be signed off by a director or equivalent (a designated member for an LLP). A parent company plan must apply jointly to you and the parent.*

**Trading less than 12 months** — Have you been trading for less than 12 months? [Yes / No / [PENDING]]

If **Yes**:

| Question | Answer |
|----------|--------|
| **Taking steps to reduce GHG** — Please confirm that your organisation (and if applicable, each of your consortium members) is taking steps to reduce your greenhouse gas (GHG) emissions over time and is publicly committed to achieving Net Zero by 2050 *(pass/fail)* | Yes / No / [PENDING] |
| **Date CRP will be published** — Please confirm the date by which you will publish a full Carbon Reduction Plan (CRP) to your website | [DATE] |

If **No**:

| Question | Answer |
|----------|--------|
| **CRP completed** — Please confirm that you have detailed your environmental management measures by completing a Carbon Reduction Plan which meets the required reporting standard *(pass/fail)* | Yes / No / [PENDING] |
| **CRP published on website** — Is your Carbon Reduction Plan published on your website? | Yes / No / [PENDING] |
| **CRP website** — Please enter the web address for your latest carbon reduction plan *(if published)* | [URL] |
| **Copy of your CRP** — Please upload a copy of your latest carbon reduction plan *(if not published; use the Attachment 2c template)* | [FILE] |
| Baseline year Scope 1 emissions (tCO2e) | [NUMBER, or 0 if unavailable] |
| Baseline year Scope 2 emissions (tCO2e) | [NUMBER] |
| Baseline year Scope 3 emissions (tCO2e) | [NUMBER] |
| Current or most recent reporting year Scope 1 emissions (tCO2e) | [NUMBER] |
| Current or most recent reporting year Scope 2 emissions (tCO2e) | [NUMBER] |
| Current or most recent reporting year Scope 3 emissions (tCO2e) | [NUMBER] |
| **Explanation why CRP not reported** — If emissions are not reported for any Scopes or only for some Scopes, or the reporting period is more than 12 months from the date of commencement of the procurement, please provide an explanation why | [TEXT or "Not needed"] |

#### 1.7 Cyber Essentials Plus

*Framework Schedule 1 v2.1 makes Cyber Essentials Plus a mandatory requirement for call-off contracts under Lots 1a and 1b. Attachment 2 v5.0 lists it among the Lot 1a/1b standards without marking it mandatory for the tender, as it does the ISO certificates, so a missing certificate is a **call-off warning**, not a reason the bid fails. Of the 1,829 live Lot 1a listings, 105 answer "No" and every one of them chose one of the first two alternatives. The alternatives below are worded as the export and the live Lot 1a listings both word them.*

**Do you have a Cyber Essentials Plus certificate?** — **In relation to the services do you have a current and valid Cyber Essentials Plus certificate which has been awarded by one of the government-approved Cyber Essentials accreditation bodies (IASME) within the most recent 12 months.**

- [ ] Yes. **Cyber Essentials Plus certificate Number** (format `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`): [NUMBER]
- [ ] No. **Alternative** (please select an option):
  - [ ] In relation to the services you do not have a current and valid Cyber Essentials Plus certificate which has been awarded by one of the government approved Cyber Essentials accreditation bodies but you are working towards gaining it, and will be in a position to confirm that you have been awarded a current and valid Cyber Essentials Plus certificate by one of the government approved accreditation bodies, by the date of framework award.
  - [ ] You do not have a current and valid Cyber Essentials Plus certificate, or will not have in place by the date of framework award but have an IASME certified equivalent.
  - [ ] None of the criteria

**Answer:** [ANSWER] **Award date:** [DATE] **Source:** [SOURCE]

### 2. Scored Quality Questions

*Rules from Attachment 2d and the export: answer every part, in the order listed, and state which part you are answering. Stick to what each part asks; no generalised statements or irrelevant information. At most 250 words per part, which the Digital Platform enforces. No attachments, no hyperlinks to external content, no cross-references to other answers or your website, and no costings. Write plain text: the text box does not render Markdown. A part only scores if it is fully addressed.*

#### 2.1 Quality Cloud Services (40%, marked 100/50/0)

*From the export: "CCS requires you to demonstrate your approach to providing quality cloud services to Buyers. Your response must be in relation to the services that are within the scope of the Framework Schedule 1 - Specification, Section 7.1 (Provision of 'IaaS' and 'PaaS') for lot 1a and Section 8.2 (Provision of 'IaaS' and 'PaaS') for lot 1b." CCS is now GCA.*

| Part | Fully addressed earns | Share of total score | Words |
|------|----------------------|----------------------|-------|
| a) Cloud service performance | 50 of 100 marks | 20% | [N] / 250 |
| b) Operational Continuity and Evergreen Maintenance | 50 of 100 marks | 20% | [N] / 250 |
| **Total** | | **40%** | **[N] / 500** |

##### a) Cloud service performance

**The question asks:** Explain how your technology and processes will ensure that your services will perform in the critical areas of scalability and reliability, to meet buyer requirements. Clearly demonstrate relevant performance targets that you will provide, along with the measures, processes and controls that you will use to meet them.

*Framework Schedule 1 reference: 6.6.1 (F) in Attachment 2d v4.0; the export says 6.5.1.4.*

**To fully address it, the answer covers:**

- [ ] The technology and processes that ensure scalability
- [ ] The technology and processes that ensure reliability
- [ ] How these meet buyer requirements
- [ ] The performance targets you will provide
- [ ] The measures, processes and controls you use to meet those targets

**Answer:**

<!-- answer:qcs-a -->
a) Cloud service performance: [DRAFT]
<!-- /answer:qcs-a -->

**Word count:** [N] / 250

##### b) Operational Continuity and Evergreen Maintenance

**The question asks:** Demonstrate how your cloud solutions will prevent the creation of any new technical debt ("technical debt" is the hidden cost of adopting short term design decisions instead of long term solutions, including the implied cost of additional work in the future) by remaining "evergreen" through continuous updates and improvements. Explain measures which will be undertaken to ensure that the process of continuous updates and improvements will cause minimal disruption and impact to service users providing operational continuity.

*Framework Schedule 1 reference: 6.6.1 (J) in Attachment 2d v4.0; the export says 6.5.1.8.*

**To fully address it, the answer covers:**

- [ ] How the service avoids creating new technical debt
- [ ] How it stays evergreen through continuous updates and improvements
- [ ] The measures that keep disruption and impact on users minimal during updates
- [ ] How operational continuity is maintained

**Answer:**

<!-- answer:qcs-b -->
b) Operational Continuity and Evergreen Maintenance: [DRAFT]
<!-- /answer:qcs-b -->

**Word count:** [N] / 250

#### 2.2 Maximising Buyer Value (40%, marked 100/66/33/0)

*From the export: "CCS requires you to demonstrate how you will maximise the value Buyers will gain from implementing your cloud services, through your 'as a service' delivery model."*

| Part | Fully addressed earns | Share of total score | Words |
|------|----------------------|----------------------|-------|
| a) Account Management and Billing Transparency/Optimisation | 33 of 100 marks (66 for two parts, 100 for all three) | about 13.3% | [N] / 250 |
| b) Technology Support and User Enablement | as above | about 13.3% | [N] / 250 |
| c) Access to Innovation and Technical Advancement | as above | about 13.3% | [N] / 250 |
| **Total** | | **40%** | **[N] / 750** |

##### a) Account Management and Billing Transparency/Optimisation

**The question asks:** Explain how you will enable Buyers to understand and optimise their service usage and costs. Your response must clearly describe the specific tools, processes or services you will provide, your approach to standardised and transparent billing, and explain how these will help Buyers monitor usage and manage financial expenditure.

*Framework Schedule 1 reference: 6.6.1 (I) in Attachment 2d v4.0; the export says 6.5.1.7.*

**To fully address it, the answer covers:**

- [ ] The specific tools, processes or services that let buyers understand and optimise usage and cost
- [ ] Your approach to standardised and transparent billing
- [ ] How these help buyers monitor usage
- [ ] How these help buyers manage financial expenditure

**Answer:**

<!-- answer:mbv-a -->
a) Account Management and Billing Transparency/Optimisation: [DRAFT]
<!-- /answer:mbv-a -->

**Word count:** [N] / 250

##### b) Technology Support and User Enablement

**The question asks:** Demonstrate how you will equip users with the skills and knowledge to maximise the effectiveness of your cloud solution. Your response must clearly describe the support services and training initiatives you will offer, including how they are accessed, to enhance user proficiency and ensure efficient utilisation of your services.

*Framework Schedule 1 reference: 6.6.1 (L) in Attachment 2d v4.0; the export says 6.5.1.9.*

**To fully address it, the answer covers:**

- [ ] The support services you offer, and how users access them
- [ ] The training initiatives you offer, and how users access them
- [ ] How these raise user proficiency and make efficient use of the service

**Answer:**

<!-- answer:mbv-b -->
b) Technology Support and User Enablement: [DRAFT]
<!-- /answer:mbv-b -->

**Word count:** [N] / 250

##### c) Access to Innovation and Technical Advancement

**The question asks:** Demonstrate how you will support Buyers to access innovation to inform both their technology strategy and business service delivery. Your response must clearly describe how you will provide or enable access to emerging technologies including new and innovative approaches to operating their cloud service.

*Framework Schedule 1 reference: 6.6.1 (M) in Attachment 2d v4.0; the export says 6.5.1.10.*

**To fully address it, the answer covers:**

- [ ] How innovation informs buyers' technology strategy
- [ ] How innovation informs buyers' business service delivery
- [ ] How you provide or enable access to emerging technologies
- [ ] New and innovative approaches to operating their cloud service

**Answer:**

<!-- answer:mbv-c -->
c) Access to Innovation and Technical Advancement: [DRAFT]
<!-- /answer:mbv-c -->

**Word count:** [N] / 250

### 3. Non-scored Mandatory Questions

| Question | Answer |
|----------|--------|
| Are you also bidding to provide services through Lot 2? | Yes / No / [PENDING] |
| Are you also bidding to provide services through Lot 3? | Yes / No / [PENDING] |
| Do you adhere to relevant NCSC guidance, including but not limited to cloud security principles, supply chain security and risk management frameworks to ensure the resilience and security of your services? *(Buyers must be able to see your adherence at call-off, and may check or test it)* | Yes / No / [PENDING] |
| Do you have policies and controls in place to ensure full compliance with applicable international sanctions, trade restrictions and embargoes as issued by the UK Government and relevant international bodies? *(The policies must be available to buyers at call-off, and may be checked or tested)* | Yes / No / [PENDING] |

#### 3.1 Customer Contractual Exit

**Please describe in no more than 250 words your high level procedure for customer contractual exit.** *(Framework Schedule 1: 7.6 Exit Planning in Lot 1a; 8.7 Exit Planning in Lot 1b. You may refer to publicly available documents, but must describe the content.)*

<!-- answer:exit -->
[DRAFT]
<!-- /answer:exit -->

**Word count:** [N] / 250

#### 3.2 Change of Service and Backward Compatibility

**Please describe in no more than 250 words how you engage your customer in a change of service and how you ensure backward compatibility.** *(Framework Schedule 1: 6.6.1 (K) in Attachment 2d v4.0; the export says 6.5.1.8.1. You may refer to publicly available documents, but must describe the content.)*

<!-- answer:change -->
[DRAFT]
<!-- /answer:change -->

**Word count:** [N] / 250

### 4. Non-mandatory Standards and Certifications

| Question | Answer | Source |
|----------|--------|--------|
| **ISO 28000:2022 certification** — Do you have a current ISO 28000:2022 certification that covers the security of your supply chain? | Yes / No / [PENDING] | [SOURCE] |
| **Who accredited the ISO 28000:2022** — Who accredited the ISO 28000:2022 certification? | [BODY] | |
| **ISO 28000:2022 accreditation date** — When was the certification accredited? | [DD/MM/YYYY] | |
| **What the ISO 28000:2022 doesn't cover** — What is not covered by your ISO 28000:2022 certification? | [TEXT] | |
| **Quality management systems (QMS)** — Do you have a quality management system? | Yes / No / [PENDING] | [SOURCE] |
| **CSA STAR certification** — Do you have a current CSA Security, Trust & Assurance Registry (STAR) certification that covers the security of your services? | Yes / No / [PENDING] | [SOURCE] |
| **CSA STAR accreditation date** — When was the certification accredited? | [DD/MM/YYYY] | |
| **CSA STAR certification level** — What level is the certification? | Level 1: CSA STAR Self-Assessment / Level 2: CSA STAR Attestation | |
| **What the CSA STAR doesn't cover** — What parts of your service are not covered by your CSA STAR certification? *(at most 200 words)* | [TEXT] | |
| **PCI certification** — Do you have a current Payment Card Industry Data Security Standard (PCI DSS) certification? | Yes / No / [PENDING] | [SOURCE] |
| **Who accredited the PCI DSS certification** — Who accredited you? | [BODY] | |
| **PCI DSS accreditation date** — When was the certification accredited? | [DD/MM/YYYY] | |
| **What the PCI DSS doesn't cover** — What is not covered by your PCI DSS certification? *(at most 200 words)* | [TEXT] | |
| **Other security certifications** — Do you have any other security certifications that cover this service? | Yes / No / [PENDING] | [SOURCE] |
| **Any other security certifications** — What other security certifications do you have? | [LIST] | |

*The follow-up rows apply only when the certification is held.*

### 5. Other Lot 1a and 1b Requirements (Outside the Lot Questions)

| Requirement | Status | Where |
|-------------|--------|-------|
| Technical Ability Certificate, one for each lot bid for, completed in the Digital Platform and signed electronically by your customer for the contract example (Attachment 2b) | [STATUS] | Digital Platform |
| Gold financial viability risk assessment (Attachment 5a), with two sets of published accounts covering three years, and the same for the parent and ultimate parent | [STATUS] | Digital Platform |
| Price for onboarding (5%) and discount (5%), plus the two unscored pricing questions | [STATUS] | `/arckit-uk-gcloud:pricing` |
| Social value (10%) | [STATUS] | `/arckit-uk-gcloud:social-value` |

---

## Part 2: Lots 2a and 2b (iSaaS and SaaS)

### Evaluation at a Glance

| Element | Weight | Marking |
|---------|--------|---------|
| Social value | 10% | Pass/fail (the SOCV document (`/arckit-uk-gcloud:social-value`)) |
| User support | 2.5% | 100/66/33/0 |
| Asset protection | 2.5% | 100/66/33/0 |
| Penetration testing | 2.5% | 100/66/33/0 |
| Data sanitisation | 2.5% | 100/0 |
| Price | 80% | Price assessment (each service's PRIC document (`/arckit-uk-gcloud:pricing`)) |
| Cyber Essentials | — | Mandatory for call-off contracts, not for the bid (Section 2) |

*Attachment 2d v4.0 and Attachment 2 v5.0 disqualify a tender that marks under 33 on all four criteria below. A single "No" scores 0 and loses its 2.5% without disqualifying on its own (Attachment 2's general paragraph says a zero on any scored question disqualifies, but the lot-specific rule is the one both documents repeat). Avoid any zero. These answers cover all your Lot 2a and 2b services, and must agree with the User Support and Asset Protection answers on each listing.*

### 1. Mandatory Award Criteria

#### 1.1 How You Will Provide User Support

**Will your organisation have in place processes to provide user support for the SaaS services in lots 2a and/or 2b?** [Yes / No / [PENDING]]

**When is user support available?**

| Option | Mark | Selected |
|--------|------|----------|
| 24 hours, 7 days a week | 100 | [ ] |
| 9 to 5 (UK time), 7 days a week | 66 | [ ] |
| 9 to 5 (UK time), Monday to Friday | 33 | [ ] |
| No (no user support processes) | 0 | [ ] |

| Service | Support hours in its SDD | Agrees with the answer |
|---------|--------------------------|------------------------|
| [SERVICE] | [HOURS] | Yes / No |

#### 1.2 How You Will Provide Asset Protection

**Will your organisation know the location where the service user data is stored and processed?** [Yes / No / [PENDING]]

**Where is service user data stored and processed?**

| Option | Mark | Selected |
|--------|------|----------|
| United Kingdom | 100 | [ ] |
| European Economic Area (EEA) | 66 | [ ] |
| Other | 33 | [ ] |
| No (location not known) | 0 | [ ] |

*The export lets you tick more than one location. Attachment 2d marks each location but does not say how a combination is marked.*

| Service | Data locations in its SDD | Agrees with the answer |
|---------|---------------------------|------------------------|
| [SERVICE] | [LOCATIONS] | Yes / No |

#### 1.3 What Frequency Will Penetration Testing Be Conducted

**Will penetration testing be conducted?** — Will penetration testing be conducted on the SaaS service? [Yes / No / [PENDING]]

**How often will penetration testing be conducted on the SaaS service?**

| Option | Mark | Selected |
|--------|------|----------|
| At least every 6 months | 100 | [ ] |
| At least once a year | 66 | [ ] |
| Less than once a year | 33 | [ ] |
| No (no penetration testing) | 0 | [ ] |

| Service | Testing frequency in its SDD or security document | Agrees with the answer |
|---------|---------------------------------------------------|------------------------|
| [SERVICE] | [FREQUENCY] | Yes / No |

#### 1.4 How You Will Provide Data Sanitisation

**Do you have an industry standard data sanitisation process?** — Do you have an industry standard data sanitisation process, such as explicit overwriting of storage before reallocation / Secure Erase, degaussing, or physical destruction / hardware containing data is completely destroyed?

| Option | Mark | Selected |
|--------|------|----------|
| Yes | 100 | [ ] |
| No | 0 | [ ] |

| Service | Sanitisation process in its SDD | Agrees with the answer |
|---------|---------------------------------|------------------------|
| [SERVICE] | [PROCESS] | Yes / No |

#### 1.5 Quality Score

| Criterion | Answer | Mark | Weighted |
|-----------|--------|------|----------|
| Social value | Pass / Fail / [PENDING] | 100 / 0 | [10% / 0%] |
| User support | [ANSWER] | [MARK] | [MARK × 2.5%] |
| Asset protection | [ANSWER] | [MARK] | [MARK × 2.5%] |
| Penetration testing | [ANSWER] | [MARK] | [MARK × 2.5%] |
| Data sanitisation | [ANSWER] | [MARK] | [MARK × 2.5%] |
| **Quality score** | | | **[N]% of a possible 20%** |

### 2. Cyber Essentials (Mandatory for Call-Offs)

*The export lists Cyber Essentials among its "Non-mandatory Standards and certifications". GCA's Updates to Tender Documents and Framework Schedule 1 v2.1 make Cyber Essentials certification **a mandatory requirement for call-off contracts under Lots 2a and 2b**, not a condition of the bid. Attachment 2 v5.0 lists no mandatory certificate for Lots 2a, 2b and 3, and Framework Schedule 1 v2.1 makes Cyber Essentials mandatory for call-off contracts. The live listings scraped on 7 October 2026 confirm it doesn't fail the bid: 769 Lot 2b and 1,977 Lot 3 listings show "Cyber essentials: No" with "None of the criteria". Cyber Essentials Plus is optional here.*

| Question | Answer | Source |
|----------|--------|--------|
| **Cyber essentials** — Do you have a current Cyber Essentials certification? | Yes / No / [PENDING] | [SOURCE] |
| Please provide your Cyber Essentials Certificate Number *(if "Yes"; format `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`)* | [NUMBER] | |
| **Cyber essentials plus** — Do you have a current Cyber Essentials Plus certification? | Yes / No / [PENDING] | [SOURCE] |
| Please provide your Cyber Essentials Plus Certificate Number *(if "Yes")* | [NUMBER] | |

**Cyber Essentials Alternative** — Please select an option below *(if Cyber essentials is "No")*:

- [ ] In relation to the services you do not have a current and valid Cyber Essentials certificate which has been awarded by one of the government approved Cyber Essentials accreditation bodies but you are working towards gaining it, and will be in a position to confirm that you have been awarded a current and valid Cyber Essentials certificate by one of the government approved accreditation bodies within 12 months of the date of award.
- [ ] You do not have a current and valid Cyber Essentials certificate, or will not have in place within 12 months of the date of award but have an IASME certified equivalent.
- [ ] None of the criteria

**Cyber Essentials Alternative** — Please select an option below *(if Cyber essentials plus is "No")*:

- [ ] In relation to the services you do not have a current and valid Cyber Essentials Plus certificate which has been awarded by one of the government approved Cyber Essentials accreditation bodies but you are working towards gaining it, and will be in a position to confirm that you have been awarded a current and valid Cyber Essentials Plus certificate by one of the government approved accreditation bodies within 12 months of the date of award.
- [ ] You do not have a current and valid Cyber Essentials Plus certificate, or will not have in place within 12 months of the date of award but have an IASME certified equivalent.
- [ ] None of the criteria

*Options are worded as the live Lot 2a and 2b listings show them. GCA's question export words the first two "by the date of framework award"; the listings say "within 12 months of the date of award". Tick the option on the Digital Platform that means the same.*

*A missing Cyber Essentials certificate, even with "None of the criteria", doesn't fail the bid, but it is a **call-off warning**: you can't be awarded a call-off contract under this lot until you hold one.*

### 3. Non-mandatory Standards and Certifications

| Question | Answer | Source |
|----------|--------|--------|
| **ISO/IEC 27001 certification** — Do you have a current ISO/IEC 27001 certification (2013 or 2022) that covers the security of your service? | Yes / No / [PENDING] | [SOURCE] |
| **Who accredited the ISO/IEC 27001** — Who accredited the ISO/IEC 27001 certification? | [BODY] | |
| **ISO/IEC 27001 accreditation date** — When was the certification accredited? | [DD/MM/YYYY] | |
| **What the ISO/IEC 27001 doesn't cover** — What is not covered by your ISO/IEC 27001 certification? *(at most 200 words)* | [TEXT] | |
| **ISO 28000:2022 certification** — Do you have a current ISO 28000:2022 certification that covers the security of your supply chain? | Yes / No / [PENDING] | [SOURCE] |
| **Who accredited the ISO 28000:2022** — Who accredited the ISO 28000:2022 certification? | [BODY] | |
| **ISO 28000:2022 accreditation date** — When was the certification accredited? | [DD/MM/YYYY] | |
| **What the ISO 28000:2022 doesn't cover** — What is not covered by your ISO 28000:2022 certification? | [TEXT] | |
| **ISO 9001 certification** — Do you have a current ISO 9001 certification (2015 or later)? | Yes / No / [PENDING] | [SOURCE] |
| **Who accredited the ISO 9001 certification** — Who accredited the ISO 9001 certification? | [BODY] | |
| **ISO 9001 accreditation date** — When was the certification accredited? | [DD/MM/YYYY] | |
| **What the ISO 9001 doesn't cover** — What is not covered by your ISO 9001 certification? *(at most 200 words)* | [TEXT] | |
| **Quality management systems (QMS)** — Do you have a quality management system? | Yes / No / [PENDING] | [SOURCE] |
| **CSA STAR certification** — Do you have a current CSA Security, Trust & Assurance Registry (STAR) certification that covers the security of your services? | Yes / No / [PENDING] | [SOURCE] |
| **CSA STAR accreditation date** — When was the certification accredited? | [DD/MM/YYYY] | |
| **CSA STAR certification level** — What level is the certification? | Level 1: CSA STAR Self-Assessment / Level 2: CSA STAR Attestation | |
| **What the CSA STAR doesn't cover** — What parts of your service are not covered by your CSA STAR certification? *(at most 200 words)* | [TEXT] | |
| **PCI certification** — Do you have a current Payment Card Industry Data Security Standard (PCI DSS) certification? | Yes / No / [PENDING] | [SOURCE] |
| **Who accredited the PCI DSS certification** — Who accredited you? | [BODY] | |
| **PCI DSS accreditation date** — When was the certification accredited? | [DD/MM/YYYY] | |
| **What the PCI DSS doesn't cover** — What is not covered by your PCI DSS certification? *(at most 200 words)* | [TEXT] | |
| **Other security certifications** — Do you have any other security certifications that cover this service? | Yes / No / [PENDING] | [SOURCE] |
| **Any other security certifications** — What other security certifications do you have? | [LIST] | |

*The follow-up rows apply only when the certification is held.*

### 4. Other Lot 2a and 2b Requirements (Outside the Lot Questions)

| Requirement | Status | Where |
|-------------|--------|-------|
| Technical Ability Certificate, one for each lot bid for, signed electronically by your customer in the Digital Platform (Attachment 2b) | [STATUS] | Digital Platform |
| Bronze financial viability risk assessment (Attachment 5b), only if GCA asks after the enhanced sift | [STATUS] | Digital Platform |
| Unit prices and the discount for each annual call-off value band (price is 80%) | [STATUS] | `/arckit-uk-gcloud:pricing` |
| Social value (10%) | [STATUS] | `/arckit-uk-gcloud:social-value` |

---

## Part 3: Lot 3 (Cloud Support)

### Evaluation at a Glance

| Element | Weight | Marking |
|---------|--------|---------|
| Social value | 10% | Pass/fail (the SOCV document (`/arckit-uk-gcloud:social-value`)) |
| User support | 2.5% | 100/66/33/0 |
| Staff security clearance checks | 2.5% | 100/50/0 |
| Security clearance level | 2.5% | 100/66/33/0 |
| Cyber Essentials if a buyer requires it | 2.5% | 100/0 |
| Price (average day rate) | 80% | Price assessment (the supplier's one Lot 3 rate card, `ARC-000-RATE` (`/arckit-uk-gcloud:pricing`)) |
| Cyber Essentials | — | Mandatory for call-off contracts, not for the bid (Section 2) |

*Attachment 2d v4.0 and Attachment 2 v5.0 disqualify a tender that marks under 33 on all four criteria below. A single "No" scores 0 and loses its 2.5% without disqualifying on its own (Attachment 2's general paragraph says a zero on any scored question disqualifies, but the lot-specific rule is the one both documents repeat). Avoid any zero. These answers cover all your Lot 3 services, and must agree with the User Support, Staff Security and Standards answers on each listing.*

### 1. Mandatory Award Criteria

#### 1.1 How You Will Provide User Support

**Will your organisation have in place processes to provide user support for the Cloud Support services in lot 3?** [Yes / No / [PENDING]]

**When is user support available?**

| Option | Mark | Selected |
|--------|------|----------|
| 24 hours, 7 days a week | 100 | [ ] |
| 9 to 5 (UK time), 7 days a week | 66 | [ ] |
| 9 to 5 (UK time), Monday to Friday | 33 | [ ] |
| No (no user support processes) | 0 | [ ] |

| Service | Support hours in its SDD | Agrees with the answer |
|---------|--------------------------|------------------------|
| [SERVICE] | [HOURS] | Yes / No |

#### 1.2 How Do You Manage Staff Security Clearance Checks

**Will your organisation perform staff security clearance checks for staff with access to information or connected to the delivery of your Cloud Support services?** [Yes / No / [PENDING]]

**How are staff security checks performed?**

| Option | Mark | Selected |
|--------|------|----------|
| Staff screening performed which conforms to BS7858:2019 | 100 | [ ] |
| Staff screening performed but doesn't conform with BS7858:2019 | 50 | [ ] |
| No (no checks) | 0 | [ ] |

#### 1.3 What Level of Security Clearance Are You Prepared to Implement

**Are you prepared to make sure your staff have staff security clearance if required by the Buyer?** [Yes / No / [PENDING]]

**What level of staff security clearance are you prepared to have in place should a Buyer require it?**

| Option | Mark | Selected |
|--------|------|----------|
| Up to Developed Vetting (DV) | 100 | [ ] |
| Up to Security Clearance (SC) | 66 | [ ] |
| Up to Baseline Personnel Security Standard (BPSS) | 33 | [ ] |
| No | 0 | [ ] |

| Service | Staff security answers in its SDD | Agrees with 1.2 and 1.3 |
|---------|-----------------------------------|-------------------------|
| [SERVICE] | [CHECKS, LEVEL] | Yes / No |

#### 1.4 Are You Prepared to Have in Place Cyber Essentials

**Are you prepared to have in place Cyber Essentials certification?** — Are you prepared to have in place Cyber Essentials (or equivalent or higher) certification should a Buyer require it?

*Cyber Essentials is mandatory for Lot 3 call-off contracts in any case (Framework Schedule 1 v2.1; see Section 2), so answer consistently with that. This criterion asks whether you are prepared to hold it, not whether you hold it now.*

| Option | Mark | Selected |
|--------|------|----------|
| Yes | 100 | [ ] |
| No | 0 | [ ] |

#### 1.5 Quality Score

| Criterion | Answer | Mark | Weighted |
|-----------|--------|------|----------|
| Social value | Pass / Fail / [PENDING] | 100 / 0 | [10% / 0%] |
| User support | [ANSWER] | [MARK] | [MARK × 2.5%] |
| Staff security clearance checks | [ANSWER] | [MARK] | [MARK × 2.5%] |
| Security clearance level | [ANSWER] | [MARK] | [MARK × 2.5%] |
| Cyber Essentials if required | [ANSWER] | [MARK] | [MARK × 2.5%] |
| **Quality score** | | | **[N]% of a possible 20%** |

### 2. Cyber Essentials (Mandatory for Call-Offs)

*The export lists Cyber Essentials among its "Non-mandatory Standards and certifications". GCA's Updates to Tender Documents and Framework Schedule 1 v2.1 make Cyber Essentials certification **a mandatory requirement for call-off contracts under Lot 3**, not a condition of the bid. Attachment 2 v5.0 lists no mandatory certificate for Lots 2a, 2b and 3, and Framework Schedule 1 v2.1 makes Cyber Essentials mandatory for call-off contracts. The live listings scraped on 7 October 2026 confirm it doesn't fail the bid: 769 Lot 2b and 1,977 Lot 3 listings show "Cyber essentials: No" with "None of the criteria". Cyber Essentials Plus is optional here.*

| Question | Answer | Source |
|----------|--------|--------|
| **Cyber essentials** — Do you have a current Cyber Essentials certification? | Yes / No / [PENDING] | [SOURCE] |
| Please provide your Cyber Essentials Certificate Number *(if "Yes"; format `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`)* | [NUMBER] | |
| **Cyber essentials plus** — Do you have a current Cyber Essentials Plus certification? | Yes / No / [PENDING] | [SOURCE] |
| Please provide your Cyber Essentials Plus Certificate Number *(if "Yes")* | [NUMBER] | |

**Cyber Essentials Alternative** — Please select an option below *(if Cyber essentials is "No")*:

- [ ] In relation to the services you do not have a current and valid Cyber Essentials certificate which has been awarded by one of the government approved Cyber Essentials accreditation bodies but you are working towards gaining it, and will be in a position to confirm that you have been awarded a current and valid Cyber Essentials certificate by one of the government approved accreditation bodies within 12 months of the date of award.
- [ ] You do not have a current and valid Cyber Essentials certificate, or will not have in place within 12 months of the date of award but have an IASME certified equivalent.
- [ ] None of the criteria

**Cyber Essentials Alternative** — Please select an option below *(if Cyber essentials plus is "No")*:

- [ ] In relation to the services you do not have a current and valid Cyber Essentials Plus certificate which has been awarded by one of the government approved Cyber Essentials accreditation bodies but you are working towards gaining it, and will be in a position to confirm that you have been awarded a current and valid Cyber Essentials Plus certificate by one of the government approved accreditation bodies within 12 months of the date of award.
- [ ] You do not have a current and valid Cyber Essentials Plus certificate, or will not have in place within 12 months of the date of award but have an IASME certified equivalent.
- [ ] None of the criteria

*Options are worded as the live Lot 3 listings show them. GCA's question export words the first two "by the date of framework award"; the listings say "within 12 months of the date of award". Tick the option on the Digital Platform that means the same.*

*A missing Cyber Essentials certificate, even with "None of the criteria", doesn't fail the bid, but it is a **call-off warning**: you can't be awarded a call-off contract under this lot until you hold one.*

### 3. Non-mandatory Standards and Certifications

| Question | Answer | Source |
|----------|--------|--------|
| **ISO/IEC 27001 certification** — Do you have a current ISO/IEC 27001 certification (2013 or 2022) that covers the security of your service? | Yes / No / [PENDING] | [SOURCE] |
| **Who accredited the ISO/IEC 27001** — Who accredited the ISO/IEC 27001 certification? | [BODY] | |
| **ISO/IEC 27001 accreditation date** — When was the certification accredited? | [DD/MM/YYYY] | |
| **What the ISO/IEC 27001 doesn't cover** — What is not covered by your ISO/IEC 27001 certification? *(at most 200 words)* | [TEXT] | |
| **ISO 28000:2022 certification** — Do you have a current ISO 28000:2022 certification that covers the security of your supply chain? | Yes / No / [PENDING] | [SOURCE] |
| **Who accredited the ISO 28000:2022** — Who accredited the ISO 28000:2022 certification? | [BODY] | |
| **ISO 28000:2022 accreditation date** — When was the certification accredited? | [DD/MM/YYYY] | |
| **What the ISO 28000:2022 doesn't cover** — What is not covered by your ISO 28000:2022 certification? | [TEXT] | |
| **ISO 9001 certification** — Do you have a current ISO 9001 certification (2015 or later)? | Yes / No / [PENDING] | [SOURCE] |
| **Who accredited the ISO 9001 certification** — Who accredited the ISO 9001 certification? | [BODY] | |
| **ISO 9001 accreditation date** — When was the certification accredited? | [DD/MM/YYYY] | |
| **What the ISO 9001 doesn't cover** — What is not covered by your ISO 9001 certification? *(at most 200 words)* | [TEXT] | |
| **Quality management systems (QMS)** — Do you have a quality management system? | Yes / No / [PENDING] | [SOURCE] |
| **CSA STAR certification** — Do you have a current CSA Security, Trust & Assurance Registry (STAR) certification that covers the security of your services? | Yes / No / [PENDING] | [SOURCE] |
| **CSA STAR accreditation date** — When was the certification accredited? | [DD/MM/YYYY] | |
| **CSA STAR certification level** — What level is the certification? | Level 1: CSA STAR Self-Assessment / Level 2: CSA STAR Attestation | |
| **What the CSA STAR doesn't cover** — What parts of your service are not covered by your CSA STAR certification? *(at most 200 words)* | [TEXT] | |
| **PCI certification** — Do you have a current Payment Card Industry Data Security Standard (PCI DSS) certification? | Yes / No / [PENDING] | [SOURCE] |
| **Who accredited the PCI DSS certification** — Who accredited you? | [BODY] | |
| **PCI DSS accreditation date** — When was the certification accredited? | [DD/MM/YYYY] | |
| **What the PCI DSS doesn't cover** — What is not covered by your PCI DSS certification? *(at most 200 words)* | [TEXT] | |
| **Other security certifications** — Do you have any other security certifications that cover this service? | Yes / No / [PENDING] | [SOURCE] |
| **Any other security certifications** — What other security certifications do you have? | [LIST] | |

*The follow-up rows apply only when the certification is held.*

### 4. Other Lot 3 Requirements (Outside the Lot Questions)

| Requirement | Status | Where |
|-------------|--------|-------|
| Technical Ability Certificate, signed electronically by your customer in the Digital Platform (Attachment 2b) | [STATUS] | Digital Platform |
| Bronze financial viability risk assessment (Attachment 5b), only if GCA asks after the enhanced sift | [STATUS] | Digital Platform |
| Maximum day rates for each role level offered, on one rate card for all your Lot 3 services; the average day rate is the price score (80%) | [STATUS] | `/arckit-uk-gcloud:pricing` (`ARC-000-RATE`) |
| Social value (10%) | [STATUS] | `/arckit-uk-gcloud:social-value` |

---

## Evidence Used

| # | Source file | Section | Fact used |
|---|-------------|---------|-----------|
| 1 | [FILE] | [SECTION] | [FACT] |

---

## Items Requiring Attention

| # | Item | What is needed | Owner |
|---|------|----------------|-------|
| 1 | [ITEM] | [WHAT_IS_NEEDED] | [OWNER] |

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
