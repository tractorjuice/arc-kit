# G-Cloud Service Design Guide

> **Guide Origin**: Community | **ArcKit Version**: [VERSION]

`/arckit:service-design` creates a per-service design document for a G-Cloud 15 (RM1557.15) Digital
Marketplace offering and fixes its lot. It is an internal planning document, not submitted to GCA
(the Government Commercial Agency, formerly CCS); every later document for the service is built
from it, and the SDD, pricing, security and review commands read the lot it records. In the G-Cloud
supplier overlay, each service is its own ArcKit project under `projects/<NNN>-<service-name>/`.

---

## Command

```bash
/arckit:service-design <service name, lot, and context>
```

Output:

```text
projects/<NNN>-<service-name>/ARC-<NNN>-SVCD-v1.0.md
```

Naming the lot in the arguments (for example `2b` or `SaaS`) skips the lot question.

A re-run updates the existing service project rather than creating a second one. The command looks
the service up by project number, name or path (`projects/004-secure-case-mgmt`) before it creates
anything, and asks when an existing project looks like the same offer under another name.

---

## When to Use

- To design a new G-Cloud 15 service and choose which of the five lots it belongs in.
- To capture the service name, description, categories, features, benefits, supplier type, support
  model and pricing approach before drafting the SDD.
- To ground pricing, security answers and the competitor benchmark in a single service design.

---

## Lots

| Lot | What it covers | Category roots | Search slug | SDD command |
|-----|----------------|----------------|-------------|-------------|
| 1a IaaS and PaaS | Processing and storing data, running software or networking | IaaS, PaaS | `iaas-and-paas` | `/arckit:sdd-lot1a` |
| 1b IaaS and PaaS above OFFICIAL | As 1a, for data above OFFICIAL | IaaS, PaaS | not publicly listed | `/arckit:sdd-lot1b` |
| 2a Infrastructure Software as a Service (iSaaS) | Systems infrastructure software | Systems Infrastructure Software; Application Development and Deployment | `isaas` | `/arckit:sdd-lot2a` |
| 2b Software as a Service (SaaS) | Applications | Applications; Application Development and Deployment | `saas` | `/arckit:sdd-lot2b` |
| 3 Cloud Support | Managed services, FinOps, migration, security, testing, training, support | Cloud Support Services | `cloud-support` | `/arckit:sdd-lot3` |

The design records the lot on a `**G-Cloud Lot**: Lot <code> — <name>` line. A lot name from G-Cloud
14 ("Lot 1", "Lot 2") doesn't settle the choice, because each became two lots.

---

## Inputs

| Input | Purpose |
|-------|---------|
| Service name | Creates or locates the service project |
| G-Cloud 15 lot | Selects the lot-specific questions and the SDD command |
| Supplier profile (`SUPP`) | Reuses company, certification, clearance and contact evidence |
| Service URL or existing listing | Supports citation-backed service facts |

---

## Output Sections

| Section | Purpose |
|---------|---------|
| Service overview | Name (≤ 100 characters, name only), description (≤ 500 characters), lot and justification, the one category group (`Root > Group`) and first-pass categories under it, target buyers |
| Value proposition | Problem, solution, differentiators, competitive advantages |
| Features and benefits | ≤ 10 of each, ≤ 10 words each, with word counts |
| Supplier type | GCA's four reseller options, worded as listings show them ("Not a reseller", "Reseller (no extras)" and so on) with the Digital Platform's wording beside them |
| Lot-specific design | 1a/1b deployment, backups, separation, energy efficiency (1b: classification and SC/DV); 2a/2b add-on, interfaces, data formats, public sector networks; 3 category group, delivery, staff security and DDaT role levels |
| Technical architecture, support model | Data location, integrations, support channels and hours, AI chatbot |
| Pricing approach | The lot's pricing model (1a/1b price formula, 2a/2b discount bands, Lot 3 day rates) |
| Compliance, go-to-market, risks, action plan | Certifications by lot, search keywords, competitor search, pre-submission tasks |

---

## Review Checklist

- The service name and description fit the G-Cloud 15 limits, and the name carries no extra keywords.
- Features and benefits are buyer-focused, evidence-backed and within 10 words each.
- The selected lot matches the service model; anything sold both as software and as support is two
  services.
- Every category sits under one category group (`Root > Group`): no live G-Cloud 15 listing has
  categories in two groups, so an offer that spans groups (migration and managed cloud, say) is one
  service per group.
- Anything unconfirmed is `[PENDING]`, not invented: every later document reuses this one.

---

## Related Commands

- `/arckit:supplier-profile` - Capture supplier-wide evidence first.
- `/arckit:sdd-lot1a`, `/arckit:sdd-lot1b`, `/arckit:sdd-lot2a`, `/arckit:sdd-lot2b`, `/arckit:sdd-lot3` - Generate the SDD for the chosen lot.
- `/arckit:lot-questions` - Lot questions, once per lot group bid for.
- `/arckit:social-value` - Social value commitments, once per supplier.
- `/arckit:pricing` - Price the service.
