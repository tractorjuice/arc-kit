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
| Service categories | One root and one group per service: every category shares the first two levels of its path (`Root > Group`). A service spanning two groups is listed as two services | Seen on listings: none of the 42,893 has categories in more than one group. The export lists the categories with no rule |
| Features | 10 maximum, 10 words each | Export |
| Benefits | 10 maximum, 10 words each | Export |
| System requirements (1a/1b, 2a/2b) | 10 words each | Export |
| What's backed up (1a/1b) | 10 words each | Export |
| Quality Cloud Services (1a/1b) | 500 words in total (250 per part), parts answered in order, no attachments | Export, Quality questionnaire |
| Maximising Buyer Value (1a/1b) | 750 words in total (250 per part), parts answered in order, no attachments | Export, Quality questionnaire |
| Customer contractual exit procedure (1a/1b) | 250 words | Export |
| Engaging customers in a change of service (1a/1b) | 250 words | Export |
| Documents | ODF or PDF/A, at most 5 MB, accessible; no pricing in the service definition document; one terms and conditions document per service | Export and supplier guide |
| Free-text answers | 50, 100 or 200 words, depending on the question: see the tables below | Inferred from listings |

### Free-text word limits

GCA's question export states a word limit only for the fields in the table above. For every other free-text ("Textarea") question it gives none, yet live answers stop at exactly 50, 100 or 200 words, so the Digital Platform enforces a limit there too.

**Method.** From the full scrape of 42,893 live G-Cloud 15 listings on 7 October 2026, the longest answer to each question, counted in words (split on spaces), sets the limit: the smallest standard cap of 50, 75, 100 or 200 words at or above it. Lots that share a template are pooled (2a with 2b), and a question asked on several lots takes the limit its fullest evidence shows. Most limits are firm: hundreds of answers sit within 2 words of them (580 Lot 2b answers to "Information security policies and processes" are within 2 words of 200). Rows marked *inferred* have no answers at the limit, so the true cap could be higher; treat them as limits all the same. Questions whose longest answer is under 50 words were left out, because those values are mostly the text of a ticked option, not a limit.

The SDD templates show each limit on the answer's `**Words:**` line, the SDD commands fill in the count, and `/arckit-uk-gcloud:review` recounts every answer against it. The evidence column gives the longest live answer, with the number of answers within 2 words of the limit in brackets.

**Service questions** (the SDD templates):

| Question | Lots 1a/1b | Lots 2a/2b | Lot 3 | Evidence: longest live answer (answers near the limit) |
|---|---|---|---|---|
| Service constraints | 100 | 100 | 100 | 1a 100 (37); 2a/2b 100 (411); 3 100 (597) |
| What software services is the service an extension to | — | 50 | — | 2a/2b 50 (714) |
| Support response times | 100 | 100 | 100 | 1a 100 (262); 2a/2b 100 (819); 3 100 (673) |
| How the web chat support is accessible | 200 | 200 | 200 | *Inferred:* 2a/2b 198 (1); 3 195 (0); too few long answers on 1a |
| Web chat accessibility testing | 200 | 200 | 200 | 1a 183 (0); 2a/2b 200 (25); 3 200 (20) |
| Support levels | 200 | 200 | 200 | 1a 200 (3); 2a/2b 200 (407); 3 200 (695) |
| Using the web interface | 200 | — | — | 1a 200 (7) |
| How the web interface is accessible | 200 | — | — | 1a 200 (4) |
| Web interface accessibility testing | 100 | — | — | 1a 100 (288) |
| What users can and can't do using the API | 200 | 200 | — | 1a 200 (2); 2a/2b 200 (211) |
| Using the command line interface | 200 | — | — | 1a 200 (6) |
| Differences between the mobile and desktop service | — | 100 | — | 2a/2b 100 (229) |
| Description of service interface | — | 100 | — | 2a/2b 100 (448) |
| Description of accessibility | — | 100 | — | 2a/2b 100 (196) |
| Accessibility testing | — | 200 | — | 2a/2b 200 (70) |
| Description of customisation | — | 200 | — | 2a/2b 200 (175) |
| Getting started | 200 | 200 | — | 1a 199 (10); 2a/2b 200 (333) |
| How the documentation is accessible | 200 | 200 | — | 1a 177 (0); 2a/2b 200 (6) |
| End-of-contract data extraction | 200 | 200 | — | 1a 197 (0); 2a/2b 200 (278) |
| End-of-contract process | 200 | 200 | — | 1a 200 (127); 2a/2b 200 (224) |
| Backup controls | 100 | — | — | 1a 100 (19) |
| Data export approach | — | 100 | — | 2a/2b 100 (591) |
| Metrics types | — | 100 | — | 2a/2b 100 (561) |
| Independence of resources | 100 | 100 | — | 1a 100 (21); 2a/2b 100 (1,007) |
| Other usage reporting | 200 | — | — | *Inferred:* 1a 187 (0) |
| Other protection between networks | 100 | 100 | — | 1a 100 (304); 2a/2b 100 (378) |
| Other protection within supplier network | 100 | 100 | — | 1a 100 (2); 2a/2b 100 (98) |
| Other data at rest protection approach | 100 | 100 | — | 1a 100 (515); 2a/2b 100 (415) |
| Guaranteed availability | 200 | 200 | — | 1a 200 (20); 2a/2b 200 (118) |
| Approach to resilience | 200 | 200 | — | 1a 200 (337); 2a/2b 200 (652) |
| Outage reporting | 200 | 200 | — | 1a 194 (0); 2a/2b 200 (97) |
| Other virtualisation technology used | 100 | — | — | *Inferred:* 1a 85 (0) |
| How shared infrastructure is kept separate | 100 | — | — | 1a 100 (20) |
| Other security governance standards | 50 | 50 | — | 1a 50 (301); 2a/2b 50 (405) |
| Security governance approach | 100 | 100 | — | 2a/2b 100 (55); too few long answers on 1a |
| Information security policies and processes | 200 | 200 | — | 1a 200 (28); 2a/2b 200 (672) |
| Configuration and change management approach | 100 | 100 | — | 1a 100 (416); 2a/2b 100 (2,704) |
| Vulnerability management approach | 100 | 100 | — | 1a 100 (72); 2a/2b 100 (2,130) |
| Protective monitoring approach | 100 | 100 | — | 1a 100 (597); 2a/2b 100 (1,990) |
| Incident management approach | 100 | 100 | — | 1a 100 (100); 2a/2b 100 (2,270) |
| Other user authentication | 100 | 100 | — | 1a 99 (16); 2a/2b 100 (436) |
| Access restrictions in management interfaces and support channels | 100 | 100 | — | 1a 100 (248); 2a/2b 100 (852) |
| Description of management access authentication | 100 | 100 | — | 1a 99 (2); 2a/2b 100 (420) |
| Description of energy efficient datacentres | 200 | — | — | 1a 199 (8) |
| Description of free trial | 50 | 50 | — | 1a 50 (71); 2a/2b 50 (1,061) |

**Lot questions** (the lot questions template; listings show these answers under "Standards and certifications"):

| Question | Lots 1a/1b | Lots 2a/2b | Lot 3 | Evidence: longest live answer (answers near the limit) |
|---|---|---|---|---|
| What the ISO/IEC 27001 doesn't cover | — | 200 | 200 | 2a/2b 200 (5); 3 183 (0) |
| What the ISO 9001 doesn't cover | — | 200 | 200 | 2a/2b 199 (32); 3 199 (26) |
| What the PCI DSS doesn't cover | 200 | 200 | 200 | 1a 200 (13); 2a/2b 199 (33); 3 200 (26) |
| What the CSA STAR doesn't cover | 200 | 200 | 200 | *Inferred:* 2a/2b 190 (0); 3 114 (0); 1a 56 (0) |

Not established: "What the ISO 28000:2022 doesn't cover" (longest live answer 62 words, from only 223 answers on Lots 2a/2b and 558 on Lot 3, none near a cap), and short list items such as "Other data export formats", which the export gives no limit for. Lot 1b isn't publicly listed; its questions are Lot 1a's, so it takes Lot 1a's limits.

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

Supplier type options (every lot), as the Digital Platform words them: I'm not a reseller; I'm a reseller providing extra features and support not available from the original supplier; I'm a reseller providing extra support; I'm a reseller not providing extra features or support. Listings show them as Not a reseller; Reseller providing extra features and support; Reseller providing extra support; Reseller (no extras).

**Options on listings.** Live listings show some options worded differently from the export, and the SDD templates use the listing wording with the export's in a comment. Besides the supplier type: "Conforms to BS7858:2019" and "Other security clearance" for the staff screening options; "Developed Vetting (DV)", "Security Clearance (SC)" and "Baseline Personnel Security Standard (BPSS)" without "Up to"; "API access" for "Through an API"; "TLS (version 1.2 or above)" and "Legacy SSL and TLS (under version 1.2)"; "Complies with a recognised standard (for example CSA CCM version 4.0)" for datacentre security standards; "CSA CSM version 4.0" (GCA's spelling) for the CSA option of security governance standards; "Google Apps", "Limited access network (for example PSN)" and "Dedicated link (for example VPN)" in the authentication options; "IOS" and "MacOS". Source: the 42,893 listings scraped on 7 October 2026. For a reseller, also name the organisation resold. Lots 1a/1b ask this per service too, and also ask once, in the lot questions, whether you bid as a Reseller or with Sole Control of the Infrastructure.

---

## Lot Questions and Evaluation

G-Cloud 15 scores bids; G-Cloud 14 did not.

| Lot | Scored | Weight | Other lot questions |
|-----|--------|--------|---------------------|
| 1a/1b | Social value | 10% | Conditions of participation: reseller or sole control, reliance on the cloud provider's accreditations, bidding for Lot 1b, trading under 12 months |
| | Quality Cloud Services: a) cloud service performance; b) operational continuity and evergreen maintenance | 40% | Non-scored mandatory: NCSC guidance, policies and controls, contractual exit procedure, change of service |
| | Maximising Buyer Value: a) account management and billing transparency; b) technology support and user enablement; c) access to innovation | 40% | Mandatory certificates: ISO 9001, ISO 20000-1 and ISO 27001; plus ISO 14001, ISO 27017 and (if public cloud is offered) ISO 27018 unless you resell and rely on your cloud provider's accreditations. A Carbon Reduction Plan. Cyber Essentials Plus is mandatory for call-off contracts, not for the bid |
| | Onboarding price (average of the onboarding table) | 5% | Two further pricing questions are not scored |
| | Minimum discount (the highest scores 5%, others in proportion) | 5% | |
| 2a/2b | Social value | 10% | Mandatory award criteria: user support, asset protection (data location), penetration testing frequency, data sanitisation |
| | Four mandatory award criteria (2.5% each) | 10% | **Cyber Essentials is mandatory** for call-offs (Framework Schedule 1 v2.1), not for the bid: 769 Lot 2b listings are live with "Cyber essentials: No" and "None of the criteria". Other standards asked: ISO 27001, ISO 9001, ISO 28000:2022, QMS, CSA STAR, PCI |
| | Price: the six band discounts are totalled; the highest total scores 80%, others in proportion. Unit prices are not scored | 80% | |
| 3 | Social value | 10% | Mandatory award criteria: user support, staff security clearance checks, clearance level, Cyber Essentials |
| | Four mandatory award criteria (2.5% each) | 10% | **Cyber Essentials is mandatory** for call-offs; other standards as Lots 2a/2b |
| | Price: the average of every rate entered (UK and offshore, ignoring any under £50 or over £10,000); the lowest average scores 80%, others in proportion | 80% | |

All lots need a Technical Ability Certificate. Weights are from Attachment 2d (Quality questionnaire) and Attachment 2 (How to tender). Disqualification: on Lots 1a/1b, a zero on either quality question; on Lots 2a/2b and 3, under 33 on all four award criteria (Attachment 2d v4.0 and Attachment 2 v5.0's rule for those lots; Attachment 2's general paragraph says any zero, but the listings fit the lot-specific rule). A single zero on Lots 2a/2b or 3 loses that criterion's 2.5%.

**Evidence at award.** Certificates are sent after evaluation. Insurance: employer's liability £5m, public liability £1m and professional indemnity £1m for every lot except 1b; Lot 1b needs professional indemnity £50m, public liability £20m and employer's liability £5m.

---

## Pricing Rules

| Lot | What you price | Rules |
|-----|---------------|-------|
| 1a/1b | Baseline Price + Fixed Onboarding Costs − Framework Discount ± Further Supplier-Specific Schemes − Time Limited Discounts, per deployment model; a baseline pricing web link | Baseline prices can move; the framework (minimum) discount is fixed. 1b prices go on the non-public platform |
| 2a/2b | Unit prices in a pricing document, plus a discount % for each annual call-off value band: under £250,000; £250,000–£500,000; £500,001–£1m; £1,000,001–£2.5m; £2,500,001–£5m; over £5m | Prices can be reduced, not increased; the discount matrix is fixed for each term |
| 3 | A maximum day rate, UK and offshore, for each role level offered (DDaT job families); leave levels you can't provide blank. One card per supplier: every Lot 3 listing shows the whole card (only 2 of the 1,135 suppliers with several live Lot 3 services show different cards) | Minimum £50; 7.5-hour day; travel and subsistence inside the M25 included; no uplift for risk or contingency; reduce only |
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
