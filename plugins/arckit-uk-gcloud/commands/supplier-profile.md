---
description: Create or update a reusable supplier profile for G-Cloud submissions
effort: high
handoffs:
  - command: /arckit:service-design
    description: Design the first service offering once the supplier profile exists
---

> ⚠️ **Community-contributed command** — part of the `arckit-uk-gcloud` overlay, not the
> officially-maintained ArcKit baseline. The supplier profile produced here is a reusable
> submission aid for the UK G-Cloud / Digital Marketplace framework; it is **not** legal or
> procurement advice. Verify every certificate, clearance, and insurance figure against the
> underlying evidence before relying on it in a live framework submission.

You are helping a cloud service supplier create or update their **supplier profile** for UK
G-Cloud Digital Marketplace submissions. The supplier profile is a **supplier-wide** artefact —
it is reused across every service offering, so it lives in `projects/000-global/supplier/` rather
than under a per-service project.

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
```

### 2. Check for an existing profile

Check whether a supplier profile already exists:

```bash
ls -la projects/000-global/supplier/ARC-000-SUPP-v1.0.md 2>/dev/null
```

If it exists, use the **Read tool** to read it and offer to update specific sections rather than
overwriting the whole document. Preserve any accurate fields the user does not ask to change.

### 3. Research the supplier (if a URL is provided)

If the user provides a company website URL in `$ARGUMENTS`, use **WebFetch** to gather information:

- Extract the registered company name and registration details
- Find "About Us" / company information pages
- Look for certification / accreditation pages
- Find contact information
- Check for existing case studies / customers

Also use **WebSearch** to find:

- Companies House listing: `site:find-and-update.company-information.service.gov.uk [company name]`
- Existing G-Cloud listings: `site:digitalmarketplace.service.gov.uk [company name]`
- Certification verification: `[company name] ISO 27001 certificate`

**Citation traceability**: When you fetch a company website, Companies House page, or any other
URL, or read a document the user has placed under `projects/000-global/supplier/` or an
`external/` directory, follow the citation instructions in
`${CLAUDE_PLUGIN_ROOT}/references/citation-instructions.md`. Place inline citation markers (e.g.
`[WEB-1-C1]`, `[CHS-C1]`) next to each fact informed by a source, and populate the
**External References** section (Document Register, Citations, Unreferenced Documents) accordingly.
WebSearch alone (search without fetch) is exploratory and is not cited — only cite a URL once it
has actually been fetched.

### 4. Gather supplier information

If creating new, or the user wants a full update, gather the following through conversation
(pre-populate from the web research above where possible — only ask for what is still missing):

**Company Details:**

- Registered company name
- Company registration number
- DUNS number (if applicable)
- VAT number
- Registered address
- Trading name (if different)
- Website URL
- Year established

**Primary Contact:**

- Name
- Email
- Phone
- Role / Title

**Contract Notice Contact** (for public contract notices):

- Name
- Email

**Company Size:**

- Number of employees
- Annual turnover
- SME status (Micro / Small / Medium / Large)

**Certifications & Accreditations** (status, certificate number, expiry, certification body):

- ISO/IEC 27001, ISO/IEC 27017, ISO/IEC 27018
- ISO 9001, ISO 22301, ISO 20000
- Cyber Essentials, Cyber Essentials Plus
- CSA STAR (level)
- SOC 2 Type II (report date)
- PCI DSS (level)
- NHS DSPT
- Any other certifications

**Security Clearances** (number of staff per level):

- BPSS, CTC, SC, DV, eDV
- Sponsoring organisation and clearance renewal process

**Data Centres** — for each location:

- Name / identifier
- Location (city, country)
- Operator (own / colocation provider)
- Tier level (if applicable)
- UK data sovereignty (Yes / No)
- Certifications (ISO 27001, SOC 2, etc.)
- Backup / DR location and distance from primary
- Cloud infrastructure regions used (AWS / Azure / GCP UK regions), if applicable

**Insurance** (provider, coverage amount, expiry):

- Professional indemnity
- Public liability
- Employers liability
- Cyber insurance

**Modern Slavery:**

- Turnover threshold met (Yes / No — £36m+)
- Statement published (Yes / No) and URL
- Supply chain due diligence approach

**Environmental Credentials:**

- ISO 14001 certified (Yes / No)
- Carbon neutral (Yes / No) and net zero target year
- Sustainability report URL
- Key environmental initiatives

**Subcontracting:**

- Uses subcontractors (Yes / No)
- Subcontractor policy and key subcontractors

### 5. Read the supplier profile template

Use the **Read tool** to read the template:

- `${CLAUDE_PLUGIN_ROOT}/templates/supplier-profile-template.md`

Resolve the `<!-- DOC-CONTROL-HEADER -->` marker and any `{{CLASSIFICATION}}` placeholder per the
rendering rules in `${CLAUDE_PLUGIN_ROOT}/templates/_partials/RENDERING.md` if that partial is
present, defaulting the Classification field to `${user_config.default_classification}` (fall back
to `OFFICIAL` for UK Gov context if unavailable).

### 6. Populate the template

Fill every `[PLACEHOLDER]` field in the template with the information gathered above. Leave
unknown fields as `[PENDING]` rather than inventing values — supplier-profile data feeds directly
into framework declarations and false data is grounds for exclusion. Where a fact came from a
fetched source, attach the appropriate inline citation marker (see Step 3).

Populate the Document Control header and Revision History (version `1.0` for a new profile;
increment for an update and add a Revision History row describing what changed).

### 7. Write the supplier profile

Use the **Write tool** to save the completed document to:

`projects/000-global/supplier/ARC-000-SUPP-v1.0.md`

(The Write tool creates parent directories automatically; the `mkdir -p` in Step 1 also guarantees
the directory exists.) Do **not** echo the full document into your response — it is large and only
a summary should be printed.

Append the standard ArcKit Document Control footer at the end of the document:

```markdown
---

**Generated by**: ArcKit `/arckit:supplier-profile` command
**Generated on**: [DATE]
**ArcKit Version**: [VERSION]
**Project**: Supplier-wide (000-global)
**Model**: [AI_MODEL]
```

### 8. Output summary

Print only a short summary (not the full document):

```markdown
## Supplier Profile Created

**Company:** [Name]
**Registration:** [Number]
**Saved to:** `projects/000-global/supplier/ARC-000-SUPP-v1.0.md`

### Certifications
- ISO 27001: ✅/❌
- Cyber Essentials Plus: ✅/❌
- SOC 2 Type II: ✅/❌

### Data Centres
- [Location 1] — UK Sovereign: ✅/❌
- [Location 2] — UK Sovereign: ✅/❌

### Security Clearances
- SC Cleared Staff: [X]
- DV Cleared Staff: [X]

### Reused By
This profile is automatically referenced when generating:
- Supplier declarations (`/arckit:declaration`)
- Service definitions (`/arckit:service-design`)
- Security evidence

### Items Requiring Attention
- [Any [PENDING] fields the user must supply]
- [Any certificates expiring within 90 days]
```

## Important Notes

- This profile is reused across **all** service definitions — keep it accurate and current.
- Certificate expiry dates should be monitored and updated; flag any expiring within 90 days.
- A DUNS number is required for G-Cloud submissions.
- UK data sovereignty is critical for many public sector buyers — record it explicitly per data
  centre.
- The profile is supplier-wide and lives in `projects/000-global/supplier/`, never under a
  per-service project directory.
