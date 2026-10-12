# G-Cloud Supplier Profile Guide

> **Guide Origin**: Community | **ArcKit Version**: [VERSION]

`/arckit:supplier-profile` creates or updates the supplier-wide profile used by the UK G-Cloud
supplier overlay. It is the foundation for every G-Cloud 15 (RM1557.15) document: the supplier
declaration, social value commitments, lot questions and each service's documents all read it. It
records company details, Central Digital Platform (CDP) details, contacts, certifications, security
clearances, data centres, insurance, the Carbon Reduction Plan, modern slavery, payment performance,
subcontractors and social value evidence.

---

## Command

```bash
/arckit:supplier-profile <supplier name or website URL>
```

Output:

```text
projects/000-global/supplier/ARC-000-SUPP-v1.0.md
```

---

## When to Use

- Before any other G-Cloud command: it is the starting point.
- When company details, CDP registration, certifications, contacts, insurance or accreditations
  change. A profile written before G-Cloud 15 is offered the new sections (CDP, parent companies,
  award form contacts, Social Value Contact, Carbon Reduction Plan, payment performance, social value
  evidence).
- Before submission review, so supplier-wide answers are consistent across all services.

---

## Inputs

| Input | Purpose |
|-------|---------|
| Supplier name or website URL | Web research: Companies House (including parent companies), certifications, the modern slavery statement registry, payment practices reports, the Carbon Reduction Plan |
| CDP record | PPON, share code, supplier information status |
| Certifications and insurance | Certificate numbers, bodies, dates and exclusions; cover levels and expiry |
| Policy evidence | Modern slavery, payment practices, carbon reduction, social value |

---

## Information Collected

- Company registration (Companies House number, legal form, DUNS, VAT, trading start date)
- Central Digital Platform: registration, PPON, share code, supplier information status
- Ultimate and immediate parent companies
- Contacts, including the listing contact every service listing shows (name, email and phone), the
  five framework award form contacts and the Social Value Contact
- Certifications (ISO 27001/27017/27018, Cyber Essentials and Plus, ISO 28000:2022, CSA STAR, SOC 2,
  ISO 9001/20000-1/14001/22301, QMS, PCI DSS, NHS DSPT)
- Security clearances (BPSS, CTC, SC, DV, eDV), BS7858:2019 screening and sponsoring organisation
- Data centres, cloud regions and UK data sovereignty
- UK GDPR measures, insurance against the levels GCA asks for at framework award, Carbon Reduction
  Plan (PPN 006) with Scope 1–3 emissions, modern slavery, supply chain payment performance
  (PPN 015), environmental credentials, subcontractors and social value evidence

Anything not confirmed is written `[PENDING]`, never guessed; a certificate is only marked held when
you confirm it.

---

## Review Checklist

- Registered company name, registration number, address, and contact details are correct.
- PPON and share code match the CDP, and published CDP contact details are generic.
- Certifications include certificate numbers, expiry dates, and certification bodies, and cover what
  each lot requires (ISO 9001/20000-1/27001 for Lot 1a/1b bids; Cyber Essentials Plus for Lot 1a/1b
  call-offs and Cyber Essentials for Lot 2a, 2b and 3 call-offs).
- Insurance meets the levels for the lots you bid for (Lot 1b's are higher).
- Emissions figures come from the published Carbon Reduction Plan.
- Every sourced fact has a citation where web or document evidence was used.

---

## Related Commands

- `/arckit:social-value` - Uses the social value evidence and Social Value Contact.
- `/arckit:lot-questions` - Uses certifications, clearances and the Carbon Reduction Plan.
- `/arckit:declaration` - Uses the CDP details, parent companies, contacts, payment performance and
  modern slavery answers.
- `/arckit:service-design` - Create a per-service G-Cloud offering.
- `/arckit:submission-pack` - Bundle approved documents for submission.
