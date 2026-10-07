# G-Cloud 15 Framework Questions Reference

> G-Cloud 15 (agreement RM1557.15), run by the Government Commercial Agency (GCA, formerly Crown Commercial Service).
> Sources: GCA's official question export (`RM1557.15-G-Cloud-question-export.xlsx`) and tender documents at <https://www.gca.gov.uk/rm1557-15-g-cloud-15-tender-documents> (How to tender v5.0, Quality questionnaire v4.0, Framework Schedule 1 v2.1, Framework Schedule 3 and the Updates to Tender Documents), checked against 42,893 live G-Cloud 15 listings (October 2026).

This file is the overview. The full question lists are generated from GCA's export into `g-cloud-15/`; read only the file you need, because together they are about 280 KB.

| File | Contents | Read by |
|------|----------|---------|
| `g-cloud-15/lot-1a-services.md` | Service questions, Lot 1a | `sdd-lot1a` |
| `g-cloud-15/lot-1b-services.md` | Service questions, Lot 1b (as 1a, but staff clearance must be SC or DV) | `sdd-lot1b` |
| `g-cloud-15/lot-2a-services.md` | Service questions, Lot 2a | `sdd-lot2a` |
| `g-cloud-15/lot-2b-services.md` | Service questions, Lot 2b (as 2a, with SaaS categories) | `sdd-lot2b` |
| `g-cloud-15/lot-3-services.md` | Service questions, Lot 3 | `sdd-lot3` |
| `g-cloud-15/lot-1-lot-questions.md` | Lot questions for 1a/1b: conditions of participation, scored quality questions, mandatory items, certifications | `lot-questions` |
| `g-cloud-15/lot-2-lot-questions.md` | Lot questions for 2a/2b: mandatory award criteria, certifications | `lot-questions` |
| `g-cloud-15/lot-3-lot-questions.md` | Lot questions for Lot 3: mandatory award criteria, certifications | `lot-questions` |
| `g-cloud-15/declaration.md` | Supplier declaration, including social value | `declaration`, `social-value` |
| `g-cloud-15/social-value-model.md` | Missions, policy outcomes and every measure, grouped | `social-value` |
| `g-cloud-15/categories.md` | Every lot's service category tree | SDD commands, `service-design` |
| `../../ddat-rate-card/references/lot-3-rate-card.md` | Lot 3 job families, roles and role levels | `sdd-lot3`, `pricing` |

**Where GCA's later documents differ from the question export, they win.** The Updates to Tender Documents made Cyber Essentials mandatory for Lots 2a, 2b and 3, and ISO 27018 mandatory for Lots 1a and 1b whenever public cloud is offered; the export still shows the earlier wording. This overview follows the updated documents.

The `g-cloud-15/` files and `lot-3-rate-card.md` are shared with G-Cloud Kit, which generates them with `tools/framework_questions.py` in marketplace-research-suite (`--export <xlsx> --output-dir g-cloud-15/`, plus `--run-dir <scrape> --categories`, `--social-value` and `--rate-card`). When GCA reissues the export (for example at a reopening), regenerate them there and copy them across rather than editing them here.

---

## Framework at a Glance

| Item | G-Cloud 15 |
|------|-----------|
| Agreement | RM1557.15, an *open framework* under the Procurement Act 2023 |
| Live | 6 August 2026, for 4 years (to 5 August 2030) |
| New suppliers | It reopens after 18 months and after 36 months (about February 2028 and August 2029) |
| Previous framework | G-Cloud 14 call-offs must be signed by 28 October 2026 |
| Buyers | Search the Digital Marketplace, then shortlist and award through the Contract Award Service |
| Contract | Public Sector Contract (PSC) call-off terms |
| Call-off length | Lots 1a/1b up to 5 years plus 3 of extensions; Lots 2a/2b/3 up to 4 years plus 2 |
| Management charge | 0.75% |
| Supplier registration | Central Digital Platform (CDP), giving a 12-character PPON and share codes |

## Lots

| Lot | Name | What it covers | Marketplace search slug | Category roots |
|-----|------|----------------|------------------------|----------------|
| 1a | IaaS and PaaS | Processing and storing data, running software or networking | `iaas-and-paas` | IaaS, PaaS |
| 1b | IaaS and PaaS above OFFICIAL | As 1a, meeting the extra requirements of above-OFFICIAL classifications | not publicly listed | as 1a |
| 2a | Infrastructure Software as a Service (iSaaS) | Cloud-based systems infrastructure software | `isaas` | Systems Infrastructure Software, Application Development and Deployment |
| 2b | Software as a Service (SaaS) | Applications hosted in the cloud | `saas` | Applications, Application Development and Deployment |
| 3 | Cloud Support | Managed services, FinOps, migration planning, set-up, security, QA and testing, training, ongoing support | `cloud-support` | Cloud Support Services |

G-Cloud 15 replaces G-Cloud 14 Lots 1–3, G-Cloud 14 Lot 4 and Cloud Compute 2. Lot 1b prices are published on a separate, non-public platform.

---

## Limits

| Field | Limit | Source |
|-------|-------|--------|
| Service name | 100 characters; the name only, no extra keywords | Character limit seen on listings (none longer than 100); keyword rule in the export |
| Service description | 500 characters | Seen on listings (none longer than 500) |
| Features | 10 maximum, 10 words each | Export |
| Benefits | 10 maximum, 10 words each | Export |
| System requirements (1a/1b, 2a/2b) | 10 words each | Export |
| What's backed up (1a/1b) | 10 words each | Export |
| Quality Cloud Services (1a/1b) | 500 words in total (250 per part), parts answered in order, no attachments | Export, Quality questionnaire |
| Maximising Buyer Value (1a/1b) | 750 words in total (250 per part), parts answered in order, no attachments | Export, Quality questionnaire |
| Customer contractual exit procedure (1a/1b) | 250 words | Export |
| Engaging customers in a change of service (1a/1b) | 250 words | Export |
| Documents | ODF or PDF/A, at most 5 MB, accessible; no pricing in the service definition document; one terms and conditions document per service | Export and supplier guide |

---

## Service Questions by Lot

Sections in the order the export asks them. 1a and 1b share one question set, as do 2a and 2b.

| Section | 1a/1b | 2a/2b | 3 |
|---------|:----:|:----:|:-:|
| Service name, description, categories | ✓ | ✓ (plus multi-cloud support) | ✓ |
| Features and benefits | ✓ | ✓ | ✓ |
| Service scope (deployment model, constraints, system requirements; 2a/2b add software add-on) | ✓ | ✓ | constraints only |
| Reselling (supplier type) | ✓ | ✓ | ✓ |
| User support (email/ticketing, phone, web chat, AI chatbot, support levels) | ✓ | ✓ | ✓ |
| How users work with your service (web interface, API, CLI or app, accessibility) | ✓ | ✓ | |
| Onboarding and offboarding | ✓ | ✓ | |
| Backups and recovery | ✓ | | |
| Data importing and exporting | | ✓ | |
| Analytics (metrics, reporting, FOCUS resource tagging) | ✓ | ✓ | |
| Scaling | ✓ | ✓ | |
| Public sector networks | | ✓ | |
| Data-in-transit protection, asset protection, availability and resilience | ✓ | ✓ | |
| Separation between users | ✓ | | |
| Governance (incl. Software Security Code of Practice for 2a/2b) | ✓ | ✓ | |
| Operational security (incl. post-quantum cryptography) | ✓ | ✓ | |
| Staff security | ✓ (1b: SC or DV only) | ✓ | ✓ |
| Secure development, identity and authentication, audit information | ✓ | ✓ | |
| Energy efficiency | ✓ | | |
| Pricing (education discount; free trial for 1a/1b, 2a/2b) | ✓ | ✓ | ✓ |
| Documents (service definition, terms and conditions, pricing) | ✓ | ✓ | ✓ |

Supplier type options (every lot): I'm not a reseller; I'm a reseller providing extra features and support not available from the original supplier; I'm a reseller providing extra support; I'm a reseller not providing extra features or support. For a reseller, also name the organisation resold. Lots 1a/1b ask this per service too, and also ask once, in the lot questions, whether you bid as a Reseller or with Sole Control of the Infrastructure.

---

## Lot Questions and Evaluation

G-Cloud 15 scores bids; G-Cloud 14 did not.

| Lot | Scored | Weight | Other lot questions |
|-----|--------|--------|---------------------|
| 1a/1b | Social value | 10% | Conditions of participation: reseller or sole control, reliance on the cloud provider's accreditations, bidding for Lot 1b, trading under 12 months |
| | Quality Cloud Services: a) cloud service performance; b) operational continuity and evergreen maintenance | 40% | Non-scored mandatory: NCSC guidance, policies and controls, contractual exit procedure, change of service |
| | Maximising Buyer Value: a) account management and billing transparency; b) technology support and user enablement; c) access to innovation | 40% | Mandatory certificates: Cyber Essentials Plus, ISO 9001, ISO 20000-1 and ISO 27001; plus ISO 14001, ISO 27017 and (if public cloud is offered) ISO 27018 unless you resell and rely on your cloud provider's accreditations. A Carbon Reduction Plan |
| | Onboarding price (average of the onboarding table) | 5% | Two further pricing questions are not scored |
| | Minimum discount (the highest scores 5%, others in proportion) | 5% | |
| 2a/2b | Social value | 10% | Mandatory award criteria: user support, asset protection (data location), penetration testing frequency, data sanitisation |
| | Four mandatory award criteria (2.5% each) | 10% | **Cyber Essentials is mandatory** for call-offs (Framework Schedule 1 v2.1). Other standards asked: ISO 27001, ISO 9001, ISO 28000:2022, QMS, CSA STAR, PCI |
| | Price: the six band discounts are totalled; the highest total scores 80%, others in proportion. Unit prices are not scored | 80% | |
| 3 | Social value | 10% | Mandatory award criteria: user support, staff security clearance checks, clearance level, Cyber Essentials |
| | Four mandatory award criteria (2.5% each) | 10% | **Cyber Essentials is mandatory** for call-offs; other standards as Lots 2a/2b |
| | Price: the average of every rate entered (UK and offshore, ignoring any under £50 or over £10,000); the lowest average scores 80%, others in proportion | 80% | |

All lots need a Technical Ability Certificate. Weights are from Attachment 2d (Quality questionnaire) and Attachment 2 (How to tender). A zero mark on a scored question can exclude the bid.

**Evidence at award.** Certificates are sent after evaluation. Insurance: employer's liability £5m, public liability £1m and professional indemnity £1m for every lot except 1b; Lot 1b needs professional indemnity £50m, public liability £20m and employer's liability £5m.

---

## Pricing Rules

| Lot | What you price | Rules |
|-----|---------------|-------|
| 1a/1b | Baseline Price + Fixed Onboarding Costs − Framework Discount ± Further Supplier-Specific Schemes − Time Limited Discounts, per deployment model; a baseline pricing web link | Baseline prices can move; the framework (minimum) discount is fixed. 1b prices go on the non-public platform |
| 2a/2b | Unit prices in a pricing document, plus a discount % for each annual call-off value band: under £250,000; £250,000–£500,000; £500,001–£1m; £1,000,001–£2.5m; £2,500,001–£5m; over £5m | Prices can be reduced, not increased; the discount matrix is fixed for each term |
| 3 | A maximum day rate, UK and offshore, for each role level offered (DDaT job families); leave levels you can't provide blank | Minimum £50; 7.5-hour day; travel and subsistence inside the M25 included; no uplift for risk or contingency; reduce only |
| All | — | No "price on application", "from £x" or unexplained ranges |

---

## Supplier Declaration (Procurement Act 2023)

Sections in `g-cloud-15/declaration.md`:

1. Ultimate and immediate parent companies
2. Tender information: single supplier or consortium, consortium members' PPONs and CDP share codes, associated persons, debarment list
3. Mandatory and discretionary exclusion grounds: one question, whether you or a connected person declared any offence in your **core supplier information on the CDP** (the grounds themselves are declared there, under Schedules 6 and 7)
4. Subcontractor details
5. Legal capacity
6. Payments in contracts above £5m a year
7. Modern slavery
8. Social value: A understanding (pass/fail), B commitment (measures chosen), C organisational readiness (a named Social Value Contact), operational readiness
9. Visibility of third-party agents or bid writers: whether a third party or agent helped prepare the bid, and confirmations that you have full sight of the tender and your submission
10. Framework award form details, connected persons, confirmation, mandatory award question

---

## What Changed from G-Cloud 14

- **Lots:** four plus 1b, instead of three. Cloud software splits into 2a and 2b.
- **Evaluation:** bids are scored, with social value at 10% on every lot.
- **Lot 3:** services keep categories and support details, but the planning, training, set-up, QA, security testing and ongoing support question sections are gone. Pricing is a DDaT rate card, not an SFIA rate card.
- **New questions:** AI chatbot, web chat accessibility, FOCUS resource tagging, post-quantum cryptography, Software Security Code of Practice, multi-cloud support, ISO 28000:2022, quality management systems.
- **Legal basis:** Procurement Act 2023 with CDP registration, instead of the Public Contracts Regulations 2015.
- **Terms:** the Public Sector Contract replaces bespoke G-Cloud terms.
