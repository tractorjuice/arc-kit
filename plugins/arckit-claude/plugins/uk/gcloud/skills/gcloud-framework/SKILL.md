---
name: G-Cloud Framework Questions
description: "Answers quick questions about the G-Cloud 15 (RM1557.15) question set for a supplier's submission: the five lots (1a, 1b, 2a, 2b, 3) and their categories, character and word limits, how many features and benefits, how each lot is scored, social value, the lot questions, pricing rules, the Procurement Act 2023 declaration (Central Digital Platform, PPON, exclusion grounds) and what changed from G-Cloud 14. Not needed when the request is for the submission content itself; /arckit-uk-gcloud:service-design, the sdd-lot commands, lot-questions, social-value, pricing and declaration write that."
---

# G-Cloud Framework Questions

Conversational knowledge about the G-Cloud 15 framework (RM1557.15): its lots, the questions suppliers answer, the limits, how bids are scored, and the supplier declaration. G-Cloud 15 is run by the Government Commercial Agency (GCA, formerly Crown Commercial Service).

## Purpose

Answer common questions about the G-Cloud 15 question set without generating documents. Every answer here comes from GCA's official question export, the tender documents, or what live G-Cloud 15 listings show.

## When to Use

Activate when users ask about:

- Which lots exist and which one a service belongs in
- Character or word limits for a field
- How bids are evaluated and weighted
- The supplier declaration, the Procurement Act 2023 or the Central Digital Platform
- Social value requirements
- What changed since G-Cloud 14

## Quick Reference: Lots

| Lot | Name | Search slug |
|-----|------|------------|
| 1a | IaaS and PaaS | `iaas-and-paas` |
| 1b | IaaS and PaaS above OFFICIAL | not publicly listed |
| 2a | Infrastructure Software as a Service (iSaaS) | `isaas` |
| 2b | Software as a Service (SaaS) | `saas` |
| 3 | Cloud Support (managed services, FinOps, migration, security, testing, training, support) | `cloud-support` |

## Quick Reference: Limits

| Field | Limit |
|-------|-------|
| Service name | 100 characters, name only |
| Service description | 500 characters |
| Service categories | One root and one group (`Root > Group`) per service; split a service that spans groups |
| Features / benefits | 10 each, 10 words each |
| System requirements | 10 words each |
| Quality Cloud Services (1a/1b) | 500 words (2 parts, 250 each) |
| Maximising Buyer Value (1a/1b) | 750 words (3 parts, 250 each) |
| Exit procedure, change of service (1a/1b) | 250 words each |
| Other free-text answers | 50, 100 or 200 words by question (for example support levels 200, service constraints 100, free trial 50). Not in GCA's export: inferred from the live listings, tabulated by lot in `references/framework-questions.md` |
| Documents | ODF or PDF/A, 5 MB, accessible, no pricing in the service definition |

## Quick Reference: Evaluation

| Lot | Weights |
|-----|---------|
| 1a/1b | Social value 10%, Quality Cloud Services 40%, Maximising Buyer Value 40%, onboarding price 5%, minimum discount 5% |
| 2a/2b | Social value 10%, four mandatory award criteria 10%, price 80%: the six band discounts are totalled and the highest total scores 80% |
| 3 | Social value 10%, four mandatory award criteria 10%, price 80%: the lowest average day rate (every rate entered, UK and offshore) scores 80% |

Mandatory certificates for the bid: ISO 9001, 20000-1 and 27001 for Lots 1a/1b (plus ISO 14001, 27017 and, with public cloud, 27018 unless relying on a provider's accreditations). Mandatory for call-off contracts, not for the bid: Cyber Essentials Plus on Lots 1a/1b and Cyber Essentials on Lots 2a, 2b and 3.

## Quick Reference: Declaration

G-Cloud 15 runs under the Procurement Act 2023. Suppliers register on the Central Digital Platform (CDP), which gives a 12-character PPON, and declare mandatory and discretionary exclusion grounds (Schedules 6 and 7) in their core supplier information there. The G-Cloud 15 declaration then covers parent companies, consortium and associated persons (with PPONs and share codes), the debarment list, subcontractors, payments in contracts above £5m a year, modern slavery, social value, whether a third party or bid writer helped prepare the bid, and connected persons.

## Answering Questions

1. **Check the quick reference tables above first.**
2. **Consult `references/framework-questions.md`** for the overview: every section by lot, the lot questions, pricing rules and what changed from G-Cloud 14. It lists which detailed file to read next.
3. **For an exact question, its options or GCA's guidance**, read the one file you need from `references/g-cloud-15/` (per-lot service questions, lot questions, the declaration, the social value model or the category trees). Don't read them all; together they are about 280 KB.
4. **Be specific about lots:** 1a/1b and 2a/2b share question sets, but Lot 1b allows only SC or DV staff clearance, and 2a and 2b have different categories.
5. **Say where a fact comes from** when it is inferred rather than stated by GCA (for example, the 100 and 500 character limits come from what listings show).

## Related Commands

These ArcKit commands generate documents that answer framework questions:

| Command | Framework Area |
|---------|---------------|
| `/arckit-uk-gcloud:service-design` | Lot choice, service identity, features, benefits, categories |
| `/arckit-uk-gcloud:sdd-lot1a`, `sdd-lot1b`, `sdd-lot2a`, `sdd-lot2b`, `sdd-lot3` | Each lot's service questions |
| `/arckit-uk-gcloud:lot-questions` | Lot questions, including the scored 1a/1b quality answers |
| `/arckit-uk-gcloud:social-value` | Social value commitments for the declaration and listings |
| `/arckit-uk-gcloud:pricing` | Pricing for each lot |
| `/arckit-uk-gcloud:security` | Security and compliance answers |
| `/arckit-uk-gcloud:declaration` | The supplier declaration |

## Additional Resources

### Reference Files

- **`references/framework-questions.md`** — G-Cloud 15 overview: framework facts, lots, limits, sections by lot, evaluation, pricing rules, declaration and changes from G-Cloud 14, with an index of the detailed files.
- **`references/g-cloud-15/`** — The full question lists, generated from GCA's question export, plus the social value model and category trees built from live listings.
