# Service Definition Document: [PROJECT_NAME]

> **Template Origin**: Official | **ArcKit Version**: [VERSION] | **Command**: `/arckit:sdd-lot3`

**G-Cloud Lot**: Lot 3 — Cloud Support

## Document Control

<!-- DOC-CONTROL-HEADER -->
<!-- Resolved at command-execution time per _partials/RENDERING.md. -->

## Revision History

| Version | Date | Author | Changes | Approved By | Approval Date |
|---------|------|--------|---------|-------------|---------------|
| [VERSION] | [DATE] | ArcKit AI | Initial creation from `/arckit.[COMMAND]` command | [PENDING] | [PENDING] |

> G-Cloud 15 (RM1557.15) Service Definition Document for a Lot 3 (Cloud Support) service, run by the Government Commercial Agency (GCA, formerly CCS).
> Sections 1–10 follow GCA's Lot 3 service questions, in the export's order. Section 11 is the service's rate card, which GCA collects on the Digital Platform rather than as a service question.

## G-Cloud Details

| Field | Value |
|-------|-------|
| Service Name | [SERVICE_NAME] |
| Supplier | [SUPPLIER_NAME] |
| Framework | G-Cloud 15 (RM1557.15) |
| Lot | 3 — Cloud Support |
| Question source | GCA question export `RM1557.15-G-Cloud-question-export.xlsx`, sheet ‘Services cloud support’ |

---

## How to Use This Document

This document holds the answers to every Lot 3 service question and the service's rate card, ready to enter on GCA's Digital Platform. It is also the source for the service definition document you upload at 10.1.

- Tick the options that apply (`- [x]`) and leave the others unticked. A *choose one* question takes exactly one tick.
- A question marked ↳ is asked only when its trigger answer is ticked. When it isn't, write `Not applicable` under it.
- Option wording is GCA's own and is what buyers filter on, so never reword it.
- Write anything the supplier hasn't confirmed as `[PENDING]`. `/arckit:review` treats every `[PENDING]` as blocking.
- `<!-- GCA guidance -->` comments repeat GCA's help text and can stay in the working copy.
- **Limits:** service name 100 characters (name only, no extra keywords); description 500 characters; features and benefits at most 10 each, 10 words each.
- **Uploaded service definition document:** ODF or PDF/A, at most 5 MB, accessible, and **no prices**. Leave out the rate card (section 11), the support level costs (7.13), Document Control, Revision History, G-Cloud Details, the appendix and External References when you produce it.
- **Scored answers:** three of the four Lot 3 mandatory award criteria (2.5% each, answered with `/arckit:lot-questions`) repeat answers given here: user support availability, staff security clearance checks and clearance level. The sections they mirror are marked.
- **Changed from G-Cloud 14:** the planning, set-up and migration, QA and testing, security testing, training and ongoing support question sections are gone (those areas are now service categories), and the SFIA rate card is replaced by the role levels in section 11.

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

<!-- Choose only from the Lot 3 tree in `g-cloud-15/categories.md`. Root: Cloud Support Services, with groups Cloud Migration Planning, Set Up and Migration, Managed Cloud, Cloud Financial Management Services, Security Services, Quality Assurance and Performance Testing, Training and Ongoing Support. Several categories share a name (‘Other’, ‘Application management’), so write each as its full path, for example `Cloud Support Services > Managed Cloud > Managed Public cloud > Managed Public IaaS`. -->

| # | Category (full path, as in the lot's tree) |
|---|---|
| 1 | [ROOT > GROUP > CATEGORY] |

---

## 4. Service features and benefits

**4.1 Service features** — List the service features.
<!-- GCA guidance: Include the features that best describe your service, for example ‘system design and assurance’ or ‘help choosing systems and vendors’. 10 words for each feature, 10 features maximum. -->

| # | Feature | Words |
|---|---|---|
| 1 | [FEATURE 1] | [X]/10 |
| 2 | [FEATURE 2] | [X]/10 |
| 3 | [FEATURE 3] | [X]/10 |

**Count:** [N]/10

**4.2 Service benefits** — List the service benefits.
<!-- GCA guidance: Include the benefits that show how your service helps users improve their working processes. Use active phrases, for example ‘reduces deployment times’ or ‘reduces business risk and costs’. 10 words for each benefit, 10 benefits maximum. -->

| # | Benefit | Words |
|---|---|---|
| 1 | [BENEFIT 1] | [X]/10 |
| 2 | [BENEFIT 2] | [X]/10 |
| 3 | [BENEFIT 3] | [X]/10 |

**Count:** [N]/10

---

## 5. Service scope

**5.1 Service constraints** — Does your service have any constraints that buyers should know about?
<!-- GCA guidance: Constraints might include support only being available remotely. -->

[ANSWER]

---

## 6. Reselling

<!-- GCA question group: Supplier type -->

**6.1 Supplier type** — Are you reselling another organisation’s services? *(choose one)*

- [ ] I’m not a reseller
- [ ] I’m a reseller providing extra features and support not available from the original supplier
- [ ] I’m a reseller providing extra support
- [ ] I’m a reseller not providing extra features or support

**6.2 Organisation whose services are being resold** — Which organisation’s services do you resell? ↳ *Asked if 6.1 is ‘I’m a reseller providing extra features and support not available from the original supplier’, ‘I’m a reseller providing extra support’ or ‘I’m a reseller not providing extra features or support’.*

[ANSWER]

---

## 7. User support

> Lot 3 mandatory award criterion (2.5%, answered with `/arckit:lot-questions`): whether you have processes to provide user support, and when it is available. Keep this section consistent with that answer.

<!-- GCA question group: Email or ticketing support -->

**7.1 Email or online ticketing support** — Do you provide email or online ticketing support? *(choose one)*

- [ ] Yes
- [ ] Yes, at extra cost
- [ ] No

**7.2 Support response times** — How quickly do you respond to questions? ↳ *Asked if 7.1 is ‘Yes’ or ‘Yes, at extra cost’.*
<!-- GCA guidance: Say if response times are different at weekends. -->

[ANSWER]

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

**7.12 Web chat accessibility testing** — Describe any web chat testing that you’ve done with assistive technology users. ↳ *Asked if 7.7 is ‘Yes’ or ‘Yes, at an extra cost’.*

[ANSWER]

**7.13 Support levels** — Describe your support levels
<!-- GCA guidance: Describe: the support levels you provide; how much the different support levels cost; whether you provide a technical account manager or cloud support engineer. -->

[ANSWER]

---

## 8. Staff security

> Two Lot 3 mandatory award criteria (2.5% each, answered with `/arckit:lot-questions`) mirror this section: whether and how you perform staff security clearance checks, and the level of clearance you are prepared to put in place if a buyer requires it. Keep the answers consistent.

**8.1 Staff security clearance** — How do you manage staff security clearance checks? *(choose one)*
<!-- GCA guidance: NCSC cloud security principle 6: Personnel security. -->

- [ ] Staff screening performed which conforms to BS7858:2019
- [ ] Staff screening performed but doesn’t conform with BS7858:2019
- [ ] Staff screening not performed

**8.2 Government security clearance** — If the role requires it, what level of security clearance are you prepared to make sure your staff have? *(choose one)*

- [ ] Up to Developed Vetting (DV)
- [ ] Up to Security Clearance (SC)
- [ ] Up to Baseline Personnel Security Standard (BPSS)
- [ ] None

---

## 9. Pricing

> Day rates are not answered here: they go in the rate card (section 11) and are set with `/arckit:pricing`.

**9.1 Discount for educational organisations** — Do you offer special pricing for educational organisations? *(choose one)*

- [ ] Yes
- [ ] No

---

## 10. Documents

> Upload one terms and conditions document per service. The service definition document must not contain prices. All three documents are uploaded on GCA's Digital Platform and are not indexed by the Digital Marketplace search, so the listing's own answers carry the keywords.

**10.1 Service definition document** — Add your service definition document
<!-- GCA guidance: Read the suppliers’ guide for guidance on what to include. This document will not be indexed by search on the Digital Marketplace. Your document should: be an Open Document Format (ODF) or PDF/A; have a maximum file size of 5MB; meet accessibility standards. -->

**File:** [FILE NAME] — ODF or PDF/A, [X] MB of 5 MB, accessibility checked: [YES/PENDING]

**10.2 Terms and conditions document** — Add your terms and conditions document
<!-- GCA guidance: This document will not be indexed by search on the Digital Marketplace. Your document should: be an Open Document Format (ODF) or PDF/A; have a maximum file size of 5MB; meet accessibility standards. -->

**File:** [FILE NAME] — ODF or PDF/A, [X] MB of 5 MB, accessibility checked: [YES/PENDING]

**10.3 Pricing document** — Add your pricing document
<!-- GCA guidance: This document will not be indexed by search on the Digital Marketplace. Your document should: be an Open Document Format (ODF) or PDF/A; have a maximum file size of 5MB; meet accessibility standards. -->

**File:** [FILE NAME] — ODF or PDF/A, [X] MB of 5 MB, accessibility checked: [YES/PENDING]

---

## 11. Rate Card

> Not a service question in GCA's export: Lot 3 day rates are entered on GCA's Digital Platform and appear on the listing as the service's rate card. List every role level this service offers, using the exact job family, role and role level names from the overlay's `skills/ddat-rate-card/references/lot-3-rate-card.md` (9 job families, 58 roles, 222 role levels). Only listed role levels can be priced.
>
> Rates are finalised with `/arckit:pricing`, which records them in the service's pricing document (PRIC); this section copies them from there. **Lot 3 price is 80% of the score.** GCA averages every rate you enter, UK and offshore (the sum of the rates divided by how many there are, ignoring any under £50 or over £10,000). The lowest average in the tender scores the full 80% and the others score in proportion, so offer the role levels the service really needs rather than every level.
>
> Rules: a **maximum** day rate per role level, UK and (optionally) offshore; a 7.5-hour day; minimum £50 a day; travel and subsistence inside the M25 included; no uplift for risk or contingency; rates can be reduced during the framework but never increased. Leave this section out of the uploaded service definition document.

| # | Job family | Role | Role level | Maximum UK day rate | Maximum offshore day rate |
|---|------------|------|------------|---------------------|---------------------------|
| 1 | [JOB FAMILY] | [ROLE] | [ROLE LEVEL] | £[RATE] | £[RATE] / Not offered |

**Role levels offered:** [N] of 222 | **Rates entered:** [N] (UK and offshore) | **Average day rate, as GCA scores it:** £[X]
**Rates agree with the pricing document (PRIC):** [Yes / No pricing document yet — run `/arckit:pricing`]

### 11.1 Why Each Role Level Is Needed

<!-- One line per role level: what that level does on this service. This keeps the rate card to the levels the service needs, which matters because the average day rate is scored. -->

| Role level | What they do on this service |
|------------|------------------------------|
| [ROLE LEVEL] | [CONTRIBUTION] |

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
