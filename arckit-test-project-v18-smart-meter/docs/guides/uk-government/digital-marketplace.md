# Digital Marketplace Procurement Guide

Use `/arckit.sow`, `/arckit.evaluate`, and `/arckit.research` to prepare compliant procurements via the UK Government Digital Marketplace (G-Cloud, DOS, Crown Hosting).

---

## Route Decision Flow

| Question | Yes → | No → |
|----------|-------|------|
| Buying cloud hosting/software/support? | G-Cloud | Next question |
| Buying a delivered outcome or team? | Digital Outcomes (DOS) | Next question |
| Hiring individuals at day rates? | Digital Specialists (DOS) | Next question |
| Need physical datacentre space? | Crown Hosting (requires spend-control justification) | Consider alternative or reassess |

---

## Inputs

- Requirements aligned to Cloud First and open standards.
- Budget and commercial constraints approved by commercial/procurement leads.
- Security/compliance artefacts ready (Cyber Essentials, DPIA, Secure by Design).

---

## ArcKit Workflow

| Step | Command | Purpose |
|------|---------|---------|
| Supplier landscape | `/arckit.research Research G-Cloud services for <capability>` | Build shortlist, identify price points |
| SOW / Outcome spec | `/arckit.sow Generate SOW for <route>` | Structure scope, deliverables, timelines, evaluation |
| Evaluation design | `/arckit.evaluate Create evaluation framework for <procurement>` | Weight criteria (technical, delivery, compliance, price, social value) |
| Proposal scoring | `/arckit.evaluate Score <supplier>` | Consistent scoring, evidence, comments |
| Comparison | `/arckit.evaluate Compare vendors for <procurement>` | Final justification and recommendation |

Store outputs under `projects/<id>/vendors/` for audit.

---

## Evidence Checklist

- Procurement route rationale (spend control requirement).
- Shortlist / longlist notes with exclusions justified.
- Evaluation weights approved by governance board.
- Standstill letters or award notifications drafted.
- Security and compliance clauses embedded in contract terms.

---

## Links

- Digital Marketplace: https://www.digitalmarketplace.service.gov.uk/
- Crown Commercial Service guidance: https://www.gov.uk/guidance/the-digital-marketplace-buyers-guide
