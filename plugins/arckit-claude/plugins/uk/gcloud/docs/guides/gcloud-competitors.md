# G-Cloud Competitor Benchmark Guide

> **Guide Origin**: Community | **ArcKit Version**: [VERSION]

`/arckit-uk-gcloud:gcloud-competitors` benchmarks a supplier's own G-Cloud 15 (RM1557.15) service against
comparable Digital Marketplace rivals in the same lot. It uses the service design, SDD, pricing and
social value documents, plus optional award evidence, to produce positioning, differentiation and
improvement evidence. It is the supplier-side counterpart of core `/arckit:competitors`.

---

## Command

```bash
/arckit-uk-gcloud:gcloud-competitors <service project or service name>
```

Output:

```text
projects/<NNN>-<service-name>/ARC-<NNN>-GCMP-v1.0.md
```

---

## When to Use

- After service design, SDD and pricing are drafted.
- Before final review, to test whether features, benefits and price positioning are credible.
- When a supplier wants to understand marketplace rivals for the same lot or capability.
- When existing `/arckit:tenders` or `/arckit:competitors` artefacts can back the analysis with real
  award counts and values.

---

## How Rivals Are Found

WebSearch and WebFetch on the Digital Marketplace, which lists only G-Cloud 15 services, searched
by the service's lot: `iaas-and-paas` for 1a (and 1b, which isn't publicly listed), `isaas` for 2a,
`saas` for 2b, `cloud-support` for Lot 3. The benchmark records the search terms, slug and number of
listings it rests on.

---

## Inputs

| Input | Purpose |
|-------|---------|
| Service design (`SVCD`) | Proposition, lot, supplier type, features, benefits |
| SDD (`SDD`) | Marketplace-facing claims and support model |
| Pricing (`PRIC`) | Price formula, band discounts or rate card |
| Social value (`SOCV`) | Policy outcomes committed to |
| Tender or competitor artefacts | Optional award evidence, with the awarded-value caveat |

---

## Output Sections

| Section | Purpose |
|---------|---------|
| Benchmark scope and award evidence | Rival set, search basis, real award outcomes |
| Feature comparison | Table stakes, gaps and differentiators |
| Pricing comparison | What the lot is scored on: Lot 3 day rates by role level, 2a/2b discount bands, 1a/1b onboarding costs and minimum discount |
| Certification and support comparison | Counts across the competitors analysed, not industry percentages |
| G-Cloud 15 listing comparison | Supplier type, social value, staff security, data location, FOCUS tagging |
| SWOT, market position and recommendations | Including search keywords and the reduce-only pricing rule |

---

## Related Commands

- `/arckit:tenders` - Procurement market intelligence.
- `/arckit:competitors` - Supplier landscape intelligence.
- `/arckit-uk-gcloud:pricing` - Adjust pricing after the benchmark.
- `/arckit-uk-gcloud:review` - Check readiness after benchmark-driven updates.
