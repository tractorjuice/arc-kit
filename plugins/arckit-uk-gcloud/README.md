# ArcKit — UK G-Cloud Supplier Bid-Authoring Overlay

**PROPRIETARY, Claude Code only, EXPERIMENTAL.** 15 supplier-side slash commands and the `uk-gcloud-submission` build recipe for writing a UK G-Cloud 15 (RM1557.15) Digital Marketplace bid, run by the Government Commercial Agency (GCA, formerly CCS). It is for a supplier preparing its own submission, not for a buyer.

**Supplier-wide (once per bid)**:

- `/arckit-uk-gcloud:supplier-profile` — Supplier profile: company, CDP and PPON, contacts, certifications, insurance (`SUPP`)
- `/arckit-uk-gcloud:social-value` — Social value commitments and operational readiness, pass/fail on every lot (`SOCV`)
- `/arckit-uk-gcloud:lot-questions` — Lot questions for each lot group: conditions of participation, scored quality answers, award criteria (`LOTQ`)
- `/arckit-uk-gcloud:declaration` — Procurement Act 2023 supplier declaration, for the supplier to confirm and sign (`DECL`)

**Per service**:

- `/arckit-uk-gcloud:service-design` — Service design, lot choice and value proposition (`SVCD`)
- `/arckit-uk-gcloud:sdd-lot1a` — Service Definition Document, Lot 1a IaaS and PaaS (`SDD`)
- `/arckit-uk-gcloud:sdd-lot1b` — Service Definition Document, Lot 1b IaaS and PaaS above OFFICIAL (`SDD`)
- `/arckit-uk-gcloud:sdd-lot2a` — Service Definition Document, Lot 2a Infrastructure Software as a Service (`SDD`)
- `/arckit-uk-gcloud:sdd-lot2b` — Service Definition Document, Lot 2b Software as a Service (`SDD`)
- `/arckit-uk-gcloud:sdd-lot3` — Service Definition Document, Lot 3 Cloud Support, with the DDaT role levels that deliver it (`SDD`)
- `/arckit-uk-gcloud:pricing` — Pricing laid out for the service's lot: 1a/1b price formula, 2a/2b discount bands, Lot 3 DDaT rate card (`PRIC`, `RATE`)
- `/arckit-uk-gcloud:security` — Security answers and evidence by lot, mapped to the NCSC Cloud Security Principles (`SECA`)
- `/arckit-uk-gcloud:gcloud-competitors` — Benchmark against rival Digital Marketplace services (`GCMP`)
- `/arckit-uk-gcloud:review` — Completeness review before submission to GCA (`GCRV`)
- `/arckit-uk-gcloud:submission-pack` — Bundle a service's documents into a submission pack for GCA

Recommended order: supplier-profile → social-value → service-design → the lot's SDD command → pricing and security → lot-questions → declaration → review → submission-pack.

Skills: `gcloud-framework`, `cloud-security`, `ddat-rate-card`. Recipe: `uk-gcloud-submission`. Guides for each command are in [`docs/guides/`](docs/guides/).

## Requires arckit core plugin

```bash
claude plugin marketplace add tractorjuice/arckit-claude
claude plugin install arckit-uk-gcloud@arckit-claude
claude plugin enable arckit-uk-gcloud
```

Installing the overlay installs `arckit` (core), which it depends on. The overlay is switched off until you enable it. It needs Claude Code 2.1.319 or later.

This overlay ships for Claude Code only. It is not converted to the other assistants ArcKit supports.

## Data

This overlay adds commands, templates, skills and reference material. It has no hooks and no MCP servers of its own. Several of its commands search and fetch web pages through Claude's own web tools, and they run alongside the `arckit` core plugin, whose README lists what that plugin sends and when. Privacy policy: <https://arckit.org/privacy.html>.

Output is a draft for the supplier to check and sign. It is not legal or commercial advice, and GCA decides what the framework accepts.

## Licence

Proprietary. This overlay is not covered by the MIT licence that governs the rest of the ArcKit repository. Copyright (c) 2026 Mark Craddock, all rights reserved: no permission is granted to use, copy, modify, publish or distribute it, in whole or in part, without the copyright holder's prior written consent. See [LICENSE](LICENSE) for the full terms and for licensing enquiries.
