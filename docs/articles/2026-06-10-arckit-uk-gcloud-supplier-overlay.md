# The Supplier Side of G-Cloud: ArcKit's New Bid-Authoring Overlay

**ArcKit has always governed the buyer — specifying, procuring and assuring public-sector technology. `arckit-uk-gcloud` turns the harness around to face the supplier, driving a G-Cloud 14 Digital Marketplace submission end to end, from a blank repository to a review-ready CCS submission pack.**

---

## The asymmetry nobody had closed

ArcKit grew up on the buyer's side of the table. Its commands help a department write requirements, build a Green Book business case, search G-Cloud, raise supplier clarifications, evaluate bids and score vendors. Every one of those assumes you are the organisation *buying* a service.

The supplier on the other side of that table has the harder, lonelier job. To list a single service on the Digital Marketplace they must answer around fifty mandatory questions per Service Definition Document, assemble a pricing document in a government-comparable format, evidence their security against the NCSC Cloud Security Principles, complete a supplier declaration covering exclusion grounds, insurance and tax, and bundle the whole thing for Crown Commercial Service — correctly, consistently, and often across several services at once. Most teams do this in a sprawl of Word documents and copy-paste, with no traceability and no second pair of eyes until it is too late to fix.

There was no harness for that work. Now there is.

## From blank repo to submitted bid

`arckit-uk-gcloud` is the **13th ArcKit marketplace plugin** and the fourth sector-specific overlay, after UK Finance Payments, UK NHS Clinical Safety and Australian Energy. It is the supplier-side counterpart to ArcKit's buyer-side procurement commands: ArcKit governs the buyer; this overlay helps the supplier win the work.

It ships **eleven commands** that map onto the real shape of a submission:

- `/arckit:supplier-profile` — a reusable company profile, written once and shared across every service you list
- `/arckit:service-design` — design a service offering before you commit it to a Service Definition Document
- `/arckit:sdd-lot1`, `/arckit:sdd-lot2`, `/arckit:sdd-lot3` — Service Definition Documents for Cloud Hosting, Cloud Software and Cloud Support, each carrying its lot-specific question set
- `/arckit:pricing` — a G-Cloud-compliant pricing document
- `/arckit:security` — security assertions mapped to the NCSC Cloud Security Principles
- `/arckit:gcloud-competitors` — a supplier-side benchmark of your service against rivals on the Digital Marketplace
- `/arckit:review` — a completeness check across the whole submission before you send it
- `/arckit:submission-pack` — bundles everything for CCS into a single submission folder with a manifest

The domain content — the fifty-question SDD sets, the NCSC mappings, the declaration's exclusion grounds — is ported intact from the standalone [gcloud-kit](https://github.com/tractorjuice/gcloud-kit) plugin. What is new is that it now runs *inside* ArcKit, with all the governance machinery that brings.

## How it composes with ArcKit

The overlay does not reinvent the parts ArcKit already does well. It adopts ArcKit's project and document model wholesale, which means everything downstream just works.

**Each G-Cloud service is its own ArcKit project.** Run `/arckit:service-design "Secure Case Management"` and you get `projects/004-secure-case-management/`, holding that service's design, Service Definition Document, pricing and security assertions as versioned `ARC-` documents with full Document Control headers and automatic build provenance. List ten services and you have ten clean projects — "many SDDs" falls out naturally instead of becoming a folder of near-identical files.

**Supplier-wide documents live once.** Your supplier profile and declaration are not per-service, so they live in `projects/000-global/supplier/` as `ARC-000-SUPP` and `ARC-000-DECL`, referenced by every service's submission rather than copied into each.

**The rest of ArcKit composes for free.** Because a service is a normal project, you can point `/arckit:diagram`, `/arckit:dpia` and `/arckit:research` at it without any special handling. `/arckit:health` and `/arckit:navigator` see your services. Eight new document types (Supplier Profile, Service Design, Service Definition Document, Pricing, Security Assertions, Competitor Benchmark and Submission Review) register in the same governance dashboard as every other artefact, and the high-stakes ones — the SDD, the declaration and the security assertions — count toward the compliance-readiness scorecard.

There is also a build recipe, `uk-gcloud-submission`, for the bulk-build harness: it drives one service from profile to a review-ready pack in a single orchestrated run.

## A competitor command, this time for the seller

ArcKit already has `/arckit:competitors`. That command is a *buyer's* market-landscape view — rival suppliers, awarded-value market share and concentration, drawn from the UK Tenders MCP. The new `/arckit:gcloud-competitors` is its mirror image: a *supplier's* benchmark of their own listed service against the field.

Point it at one of your services and it compares your features, pricing, certifications and support against rivals on the Digital Marketplace, runs a SWOT, plots a market-position quadrant, and recommends pricing and search-keyword changes to strengthen your listing. Where you have already run the buyer-side commands, it reads their output and backs the benchmark with real public-sector award evidence — always carrying ArcKit's standing caveat that awarded value is not actual spend.

The two commands are deliberately distinct artefacts with distinct codes, so a project can hold both the market view and the supplier view without one overwriting the other.

## What is deliberately left out

Two honest constraints are worth stating plainly.

First, this overlay is **proprietary and Claude Code only**. Unlike ArcKit's twelve other plugins, which are MIT-licensed and converted to Codex, Gemini, OpenCode and Copilot, `arckit-uk-gcloud` is licensed separately and ships only as a Claude Code marketplace plugin. That keeps proprietary content out of the public, MIT-licensed extension repositories by design.

Second, this first release is the **bid-authoring core**. The data-heavy market and sales-intelligence layer from gcloud-kit — sales analysis, marketplace-data extraction, customer URN lookup and target-account identification — is deferred to a second overlay, because it overlaps ArcKit's existing tenders and competitor commands and deserves a proper reconciliation rather than a hasty port.

## Getting started

`arckit-uk-gcloud` requires the `arckit` core plugin. Once both are installed:

```text
/arckit:supplier-profile          # write your reusable company profile (once)
/arckit:service-design "My SaaS"  # create the service project
/arckit:sdd-lot2                  # generate the Cloud Software SDD
/arckit:pricing                   # G-Cloud pricing document
/arckit:security                  # NCSC Cloud Security Principles assertions
/arckit:gcloud-competitors        # benchmark against the marketplace
/arckit:review                    # completeness check
/arckit:submission-pack           # bundle for CCS
```

Or hand the whole sequence to the build harness with the `uk-gcloud-submission` recipe and review the output as it lands.

ArcKit has spent its life making the buyer's governance legible. This overlay extends the same discipline — templates, traceability, document control, a second pair of eyes before you submit — to the supplier trying to win the work. Same harness, the other side of the table.

---

*`arckit-uk-gcloud` is the 13th ArcKit marketplace plugin. It requires the `arckit` core plugin, is proprietary (not covered by the repository's MIT licence), and is available for Claude Code.*

<!-- arckit:community-block -->
## Join the ArcKit Community

- **Discord** — real-time conversation, help with commands, and what people are building: [discord.gg/HsA4Y3hQ4](https://discord.gg/HsA4Y3hQ4)
- **LinkedIn Group** — announcements, case studies, and longer-form discussion: [linkedin.com/groups/17641034](https://www.linkedin.com/groups/17641034/)
- **GitHub** — code, issues, and contributions: [github.com/tractorjuice/arc-kit](https://github.com/tractorjuice/arc-kit)
