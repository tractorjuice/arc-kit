---
description: Create or update a reusable supplier profile for G-Cloud 15 submissions
doc-type: SUPP
effort: high
handoffs:
  - command: /arckit-uk-gcloud:social-value
    description: Commit to social value measures, worth 10% on every lot
  - command: /arckit-uk-gcloud:service-design
    description: Design the first service offering once the supplier profile exists
  - command: /arckit-uk-gcloud:declaration
    description: Prepare the supplier declaration from the profile
---

> ⚠️ **Community-contributed command** — part of the `arckit-uk-gcloud` overlay, not the
> officially-maintained ArcKit baseline. The supplier profile produced here is a reusable
> submission aid for G-Cloud 15 (RM1557.15) on the UK Digital Marketplace, run by GCA (the
> Government Commercial Agency, formerly CCS); it is **not** legal or procurement advice. Verify
> every certificate, clearance, insurance figure, PPON and emissions figure against the underlying
> evidence before relying on it in a live framework submission.

You are helping a cloud service supplier create or update their **supplier profile** for G-Cloud 15
(RM1557.15) Digital Marketplace submissions. The profile is the source for the supplier declaration
(`/arckit-uk-gcloud:declaration`), social value (`/arckit-uk-gcloud:social-value`), the lot questions
(`/arckit-uk-gcloud:lot-questions`) and every service document. It is a **supplier-wide** artefact — reused
across every service offering — so it lives in `projects/000-global/supplier/` rather than under a
per-service project.

## User Input

```text
$ARGUMENTS
```

## Instructions

### 1. Ensure the supplier directory exists

The supplier profile is global to the supplier, not tied to a numbered project. Create the
directory if it does not already exist:

```bash
mkdir -p projects/000-global/supplier
find projects/000-global/supplier -maxdepth 1 -name 'ARC-000-SUPP-v*.md' 2>/dev/null | sort -V
```

### 2. Check for an existing profile

If a profile exists, use the **Read tool** on its highest version and offer to update specific
sections rather than overwriting the whole document. Preserve any accurate fields the user does not
ask to change. A profile written before G-Cloud 15 will lack the CDP, parent company, award form
contact, Social Value Contact, Carbon Reduction Plan, payment performance and social value evidence
sections: offer to add them.

### 3. Research the supplier (if a URL is provided)

If the user provides a company website URL in `$ARGUMENTS`, use **WebFetch** to gather information:

- Extract the registered company name and registration details
- Find "About Us" / company information pages
- Look for certification / accreditation pages
- Find contact information
- Check for existing case studies / customers
- Look for a carbon reduction plan, modern slavery statement, social value, ESG or careers pages

Also use **WebSearch** to find:

- Companies House listing, including persons with significant control and any parent company:
  `site:find-and-update.company-information.service.gov.uk [company name]`
- Existing G-Cloud listings: `site:applytosupply.digitalmarketplace.service.gov.uk [company name]`
- Certification verification: `[company name] ISO 27001 certificate`
- Modern slavery statement: `site:modern-slavery-statement-registry.service.gov.uk [company name]`
- Payment practices reports: `site:check-payment-practices.service.gov.uk [company name]`
- Carbon Reduction Plan: `[company name] "carbon reduction plan"`

Read emissions figures only from the published Carbon Reduction Plan itself. Never estimate them.

**Citation traceability**: When you fetch a company website, Companies House page, or any other
URL, or read a document the user has placed under `projects/000-global/supplier/` or an
`external/` directory, follow the citation instructions in
`${CLAUDE_PLUGIN_ROOT}/references/citation-instructions.md`. Place inline citation markers (e.g.
`[WEB-1-C1]`, `[CHS-C1]`) next to each fact informed by a source, and populate the
**External References** section (Document Register, Citations, Unreferenced Documents) accordingly.
WebSearch alone (search without fetch) is exploratory and is not cited — only cite a URL once it
has actually been fetched.

### 4. Gather supplier information

If creating new, or the user wants a full update, gather the following (pre-populate from the web
research above where possible — only ask for what is still missing). Follow
`${CLAUDE_PLUGIN_ROOT}/references/interview-pattern.md`: say what you inferred and from where, then
ask in grouped rounds rather than one field at a time.

**Company Details:**

- Registered company name
- Company registration number and legal form
- DUNS number (if applicable)
- VAT number
- Registered address
- Trading name (if different)
- Website URL
- Year established, and the date trading started (under 12 months changes the Carbon Reduction Plan
  and payment questions)

**Central Digital Platform (CDP):** G-Cloud 15 is run under the Procurement Act 2023, and the
declaration relies on the supplier's CDP record:

- Registered on the CDP (Yes / No)
- PPON (12 characters with hyphens, e.g. `ABCD-1234-EFGH`) and the current share code, with the date
  it was generated
- Core supplier information complete, connected persons recorded, and exclusions reviewed (who and
  when)
- CDP contact email and postal address are generic (they are published in contract award notices)
- Digital Platform profile matches Companies House, D&B, the VAT register and the CDP

**Parent Companies:** for the ultimate and the immediate parent, whether one exists, and its full
name, registered or head office address, registration number, DUNS number and VAT number.

**Primary Contact:** name, email, phone, role / title.

**Listing Contact** (shown on every service listing): name, email and phone. Every live G-Cloud 15
listing shows a contact name and email, and almost all a phone number; suppliers keep one contact
across their services. It may be the primary contact.

**Contract Notice Contact** (for public contract notices): name, email.

**Secondary Contact** (optional): name, role, email, phone.

**Framework Award Form Contacts:** name, job title, email and phone for the framework manager,
authorised representative, compliance officer, data protection officer and marketing contact.

**Social Value Contact:** name, job title and email of the person responsible for delivering social
value. A shared mailbox is acceptable, but a named person is required.

**Company Size:**

- Number of employees
- Annual turnover and balance sheet total
- SME status (Micro / Small / Medium / Large; an SME has fewer than 250 staff, and turnover up to
  £44m or a balance sheet up to £38m)

**Certifications & Accreditations** (for each: held Yes / No, certificate number, certification
body, accreditation date, expiry date, and what it doesn't cover):

- Information security: ISO/IEC 27001, ISO/IEC 27017, ISO/IEC 27018, Cyber Essentials, Cyber
  Essentials Plus, ISO 28000:2022, CSA STAR (level), SOC 2 Type II (report date, auditor)
- Quality, service management and environment: ISO 9001, ISO/IEC 20000-1, ISO 14001, ISO 22301, and
  whether a quality management system (QMS) is in place
- Industry specific: PCI DSS (level), NHS DSPT (status), others
- For any certificate not yet held, whether accreditation has started

G-Cloud 15 bids for Lots 1a/1b need ISO 9001, ISO 20000-1 and ISO 27001, plus ISO 14001 and ISO
27017 (and ISO 27018 where services include public cloud) unless the supplier resells and relies on
its provider's accreditations. Cyber Essentials Plus (Lots 1a/1b) and Cyber Essentials (Lots 2a, 2b
and 3) are mandatory for call-off contracts, not for the bid: without one, the bid can go in but no
call-off can be awarded under the lot.

**Security Clearances and Screening:**

- Number of staff at each level: BPSS, CTC, SC, DV, eDV
- Whether staff security checks are performed, and whether the screening conforms to BS7858:2019
- The highest clearance level the supplier is prepared to put in place if a buyer requires it (DV,
  SC or BPSS)
- Sponsoring organisation for clearances
- Clearance renewal process and background check provider

**Data Centres** — for the primary and the secondary / DR data centre:

- Name / identifier and location (city, country)
- Operator (own, or colocation with which provider)
- Tier level (if applicable)
- Certifications (ISO 27001, SOC 2, PCI DSS, etc.)
- UK data sovereignty (Yes / No)
- For the DR site: distance from the primary (km)

**Cloud Infrastructure** (if applicable): providers used (AWS, Azure, GCP, other), the regions used,
whether a UK region is used, and the supplier's relationship with each (own platform, accredited
reseller or partner).

**Data Protection (UK GDPR):** ICO registration number, data protection officer, whether records of
processing are kept, privacy notice URL, the data subject rights process, transfers outside the UK
and their safeguards, and when these measures were last reviewed.

**Insurance** (for each: provider, coverage amount, expiry date). GCA asks for evidence at framework
award:

- Employer's (compulsory) liability: £5,000,000 for every lot
- Public liability: £1,000,000 minimum (Lot 1b: £20,000,000)
- Professional indemnity: £1,000,000 (Lot 1b: £50,000,000)
- Cyber insurance (optional)

**Carbon Reduction Plan (PPN 006):** commitment to Net Zero by 2050; whether a plan is published, its
URL, whether it uses the PPN 006 template, who signed it off, and whether it is a parent company
plan; the current reporting period; the baseline year; baseline and most recent Scope 1, 2 and 3
emissions in tCO2e; an explanation for any Scope not reported; and, if trading under 12 months, the
date a full plan will be published.

**Modern Slavery Statement:**

- Relevant commercial organisation under section 54 (turnover of £36m or more, and business carried
  on in the UK), or turnover of £36m or more otherwise
- Published (Yes / No), URL and statement date
- Whether it covers elements (a) to (f): structure and supply chains, policies, due diligence, risks
  and how they are managed, effectiveness, and training
- Supply chain due diligence

**Supply Chain Payment Performance (PPN 015):** whether a supply chain will be used on call-offs; the
payment practices report URL; how payment systems, disputed invoices and 30-day terms work; and, for
the two most recent six-month reporting periods, the percentage of invoices paid within 30 days, in
31–60 days and in 61 days or more, the percentage due but unpaid by the contractual date, and the
average days to pay.

**Environmental Credentials:**

- ISO 14001 certified (Yes / No)
- Carbon neutral (Yes / No) and net zero target year
- Sustainability report (published Yes / No, URL)
- Sustainability initiatives

**Subcontracting:**

- Uses subcontractors (Yes / No) and subcontractor policy
- Key subcontractors: the services they provide, their % of delivery, their type (SME, VCSE,
  supported employment provider, public service mutual or none), whether each is a key subcontractor
  or an associated person (relied on for a condition of participation), and its Companies House
  number or PPON

**Social Value Evidence:** what already happens, for `/arckit-uk-gcloud:social-value` to propose measures: Real
Living Wage or pay above the National Living Wage, pay gap reporting, apprenticeships and placements,
volunteering, SME or VCSE subcontracting, Disability Confident, wellbeing programmes, and school or
college outreach.

**Never invent a value.** Write any field the user hasn't confirmed and research hasn't found as
`[PENDING]`. That includes certificate numbers, expiry dates, insurance amounts, PPONs, share codes,
emissions and payment figures. Never mark a certification ✅ unless the user has confirmed it is
held. Supplier-profile data feeds directly into framework declarations, and false data is grounds
for exclusion.

### 5. Read the supplier profile template

**Read the template** (user override takes precedence):

- **First**, check `.arckit/templates-custom/supplier-profile-template.md`
- **Then**, `.arckit/templates/supplier-profile-template.md`
- **Fallback**, `${CLAUDE_PLUGIN_ROOT}/templates/supplier-profile-template.md`
- **Then read** `${CLAUDE_PLUGIN_ROOT}/templates/_partials/RENDERING.md` and resolve the `<!-- DOC-CONTROL-HEADER -->` marker in the template before writing. Do not hand-write the Document Control table: the partial `RENDERING.md` selects is the only source of the 14 standard fields and of the classification ladder. Default the Classification field to `${user_config.default_classification}` (fall back to `OFFICIAL` for UK Gov context if unavailable).

### 6. Populate the template

Fill every `[PLACEHOLDER]` field in the template with the information gathered above. Leave unknown
fields as `[PENDING]` rather than inventing values. Where a fact came from a fetched source, attach
the appropriate inline citation marker (see Step 3).

Generate the document ID with the ArcKit helper (SUPP is single-instance):

```bash
node "${CLAUDE_PLUGIN_ROOT}/scripts/generate-document-id.mjs" 000 SUPP --filename
```

This returns `ARC-000-SUPP-v1.0.md` for a new profile. For an update, increment the existing
version instead and add a Revision History row describing what changed.

### 7. Write the supplier profile

Before writing, read `${CLAUDE_PLUGIN_ROOT}/references/quality-checklist.md` and verify all **Common Checks** plus the **SUPP** per-type checks pass. Fix any failures before proceeding.

Use the **Write tool** to save the completed document to:

`projects/000-global/supplier/ARC-000-SUPP-v{VERSION}.md`

(The Write tool creates parent directories automatically; the `mkdir -p` in Step 1 also guarantees
the directory exists.) Do **not** echo the full document into your response — it is large and only
a summary should be printed.

Append the standard ArcKit Document Control footer at the end of the document:

```markdown
---

**Generated by**: ArcKit `/arckit-uk-gcloud:supplier-profile` command
**Generated on**: [DATE]
**ArcKit Version**: [VERSION]
**Project**: Supplier-wide (000-global)
**Model**: [AI_MODEL]
```

### 8. Output summary

Print only a short summary of what the profile actually records (not the full document):

```markdown
## Supplier Profile Created

**Company:** [Name]
**Registration:** [Number]
**PPON:** [PPON or PENDING]  **CDP supplier information:** [complete / incomplete / not registered / PENDING]
**Saved to:** `projects/000-global/supplier/ARC-000-SUPP-v{VERSION}.md`

### Certifications
- ISO 27001: ✅/❌/PENDING
- Cyber Essentials: ✅/❌/PENDING
- Cyber Essentials Plus: ✅/❌/PENDING [awarded DATE]
- ISO 9001 / 20000-1 / 14001 / 27017 / 27018: [✅/❌/PENDING each]
- SOC 2: ✅/❌/PENDING

### G-Cloud 15 Requirements
- Lots 1a/1b: [which required certificates are held or missing]
- Cyber Essentials Plus (Lot 1a/1b call-offs) and Cyber Essentials (Lot 2a/2b and 3 call-offs): [held / missing: a call-off warning, not a bid failure / PENDING]
- Insurance: [meets the levels for Lots 1a, 2a, 2b and 3 / meets Lot 1b's / shortfall: details / PENDING]
- Carbon Reduction Plan: [published URL / not published / PENDING]

### Expiring Soon
- [Any certificate or insurance policy expiring within 90 days of today, with its date, or "None"]

### Data Centres
- [Location 1] — UK Sovereign: ✅/❌
- [Location 2] — UK Sovereign: ✅/❌

### Security Clearances
- SC Cleared Staff: [X]
- DV Cleared Staff: [X]
- BS7858:2019 screening: [Yes / No / PENDING]

### Reused By
- Social value commitments (`/arckit-uk-gcloud:social-value`)
- Lot questions (`/arckit-uk-gcloud:lot-questions`)
- Supplier declarations (`/arckit-uk-gcloud:declaration`)
- Service designs and definitions (`/arckit-uk-gcloud:service-design`, the `sdd-lot` commands)
- Security evidence (`/arckit-uk-gcloud:security`)

### Items Requiring Attention
- [Each `[PENDING]` field, or "None"]
```

## Important Notes

- This profile is reused across **all** service definitions and supplier documents — keep it
  accurate and current.
- Certificate expiry dates should be monitored and updated; flag any expiring within 90 days.
- A PPON and complete CDP supplier information are needed before the declaration can be finished;
  keep the CDP and this profile in step, and request a new share code whenever the CDP record
  changes.
- DUNS numbers are asked for parent companies and consortium members.
- UK data sovereignty is critical for many public sector buyers — record it explicitly per data
  centre.
- The profile is supplier-wide and lives in `projects/000-global/supplier/`, never under a
  per-service project directory.
- **Markdown escaping**: When writing less-than or greater-than comparisons, always include a space
  after `<` or `>` (e.g. `< 250 staff`) to prevent markdown renderers from interpreting them as HTML
  tags or emoji.
