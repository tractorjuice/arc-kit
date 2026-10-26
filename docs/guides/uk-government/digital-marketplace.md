# Digital Marketplace Procurement Guide

> **Guide Origin**: Official | **ArcKit Version**: [VERSION]

Use `/arckit:sow`, `/arckit:evaluate`, and `/arckit:research` to prepare compliant procurements on G-Cloud 15 and Digital Outcomes and Specialists 7 (DOS7), the Government Commercial Agency (GCA) frameworks, or through Crown Hosting. G-Cloud services are listed on the Digital Marketplace. DOS7 buying runs on GCA's Contract Award Service (CAS), which you reach through the Public Procurement Gateway (PPG).

---

## Route Decision Flow

| Question | Yes → | No → |
|----------|-------|------|
| Buying cloud hosting/software/support? | G-Cloud | Next question |
| Buying a delivered outcome or project? | DOS7 Lot 1: Digital Outcomes | Next question |
| Need a partner for a long-term transformation programme? | DOS7 Lot 2: Digital Capability and Delivery Partners | Next question |
| Adding specialists in specific digital roles to your team? | DOS7 Lot 3: Digital Specialists | Next question |
| Need physical datacentre space? | Crown Hosting (justify it against Cloud First) | Consider alternative or reassess |

---

## Inputs

- Requirements aligned to Cloud First and open standards.
- Budget and commercial constraints approved by commercial/procurement leads.
- Security/compliance artefacts ready (Cyber Essentials, DPIA, Secure by Design).

---

## ArcKit Workflow

| Step | Command | Purpose |
|------|---------|---------|
| Supplier landscape | `/arckit:research Research G-Cloud services for <capability>` | Build shortlist, identify price points |
| SOW / Outcome spec | `/arckit:sow Generate SOW for <route>` | Structure scope, deliverables, timelines, evaluation |
| Evaluation design | `/arckit:evaluate Create evaluation framework for <procurement>` | Weight criteria (technical, delivery, compliance, price, social value) |
| Proposal scoring | `/arckit:evaluate Score <supplier>` | Consistent scoring, evidence, comments |
| Comparison | `/arckit:evaluate Compare vendors for <procurement>` | Final justification and recommendation |

Store outputs under `projects/<id>/vendors/` for audit.

---

## Evidence Checklist

- Procurement route rationale, for your approval and assurance route under the Digital Assurance Playbook (it replaced the spend controls on 1 April 2026).
- Shortlist / longlist notes with exclusions justified.
- Evaluation weights approved by governance board.
- Contract award notice (UK6) drafted for Find a Tender. A framework call-off has no mandatory standstill (Procurement Act 2023 s.51(3)(d)); a voluntary standstill set in the notice must be at least eight working days (s.51(4)–(5)).
- Security and compliance clauses embedded in contract terms.

---

## Links

- G-Cloud 15 agreement page: https://www.gca.gov.uk/agreements/RM1557.15
- DOS7 agreement page: https://www.gca.gov.uk/agreements/RM1043.9
- Digital Marketplace (G-Cloud service search): https://www.digitalmarketplace.service.gov.uk/
- DOS buyers guide (GOV.UK): https://www.gov.uk/guidance/digital-outcomes-and-specialists-buyers-guide
