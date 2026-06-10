---
description: Design a new cloud service offering for the G-Cloud marketplace
effort: high
handoffs:
  - command: /arckit:sdd-lot2
    description: Generate the Service Definition Document for the chosen lot
  - command: /arckit:pricing
    description: Produce the G-Cloud pricing document for this service
---

> ⚠️ **Community-contributed command** — part of the `arckit-uk-gcloud` overlay, not the
> officially-maintained ArcKit baseline. The service design produced here is an internal planning
> aid for a UK G-Cloud / Digital Marketplace service offering; it is **not** legal or procurement
> advice. Service names, features, benefits, and pricing all carry strict marketplace constraints —
> verify every claim against the underlying evidence before publishing a live framework listing.

You are helping a cloud service supplier design a new **service offering** for the UK G-Cloud
Digital Marketplace. In this overlay **each G-Cloud service is its own ArcKit project** —
`projects/{NNN}-service-name/` — so this command **creates (or locates) the service project** and
writes the service-design document into it.

## User Input

```text
$ARGUMENTS
```

## Instructions

### 1. Determine the service name

Take the service name from `$ARGUMENTS`. If no name was supplied, ask the user for a concise
service name (this becomes both the project name and the marketplace listing name — max 100
characters for the Digital Marketplace).

### 2. Check for the supplier profile (recommended context)

The supplier profile is supplier-wide and feeds directly into every service design. Check whether
it exists:

```bash
ls -la projects/000-global/supplier/ARC-000-SUPP-v1.0.md 2>/dev/null
```

- **If it exists**, use the **Read tool** to read it for company details, certifications, data
  centres, security clearances, and insurance — pre-populate the service design from it rather than
  re-asking the user.
- **If it is missing**, warn the user that running `/arckit:supplier-profile` first will produce a
  richer, consistent service design, then continue (the supplier profile is recommended, not
  mandatory).

### 3. Research the service (optional web lookup)

If `$ARGUMENTS` includes a service URL, an existing G-Cloud listing, or a supplier website, use
**WebFetch** to extract service features, benefits, pricing structure, certifications, and support
details. Use **WebSearch** to find context such as:

- Existing G-Cloud listing: `site:applytosupply.digitalmarketplace.service.gov.uk "[service name]"`
- Competitor services in the same category and lot
- Market positioning: `"[service name]" review OR case study`

**Citation traceability**: When you fetch a service page, a G-Cloud listing, a supplier website, or
read any document the user has placed under the service project's `external/` directory, follow the
citation instructions in `${CLAUDE_PLUGIN_ROOT}/references/citation-instructions.md`. Place inline
citation markers (e.g. `[WEB-1-C1]`) next to each fact informed by a source, and populate the
**External References** section (Document Register, Citations, Unreferenced Documents) accordingly.
WebSearch alone (search without fetch) is exploratory and is not cited — only cite a URL once it has
actually been fetched.

### 4. Create (or locate) the service project

Each service is its own numbered project. Run the ArcKit project helper, passing the service name,
and request JSON output:

```bash
bash "${CLAUDE_PLUGIN_ROOT}/scripts/bash/create-project.sh" --name "<service name>" --json
```

From the JSON response, extract:

- `project_dir` — the service project directory (e.g. `projects/004-secure-case-mgmt`)
- `project_number` — the zero-padded project number (e.g. `004`)

Use `project_number` as `PROJECT_ID` and `project_dir` as the destination for the document. If the
user is re-running for a service that already has a project, use that existing project directory
instead of creating a duplicate.

### 5. Select the lot

**$ARGUMENTS bypass:** If `$ARGUMENTS` or the conversation already specifies the lot (e.g. "Lot 2",
"SaaS", "cloud hosting", "consulting"), skip this question and use the specified lot.

If the lot is not yet known, use the **AskUserQuestion** tool to ask which lot this service is for:

- **Lot 1: Cloud Hosting** — IaaS / PaaS — compute, storage, networking infrastructure
- **Lot 2: Cloud Software** — SaaS — applications delivered via the cloud
- **Lot 3: Cloud Support** — Professional services — migration, consulting, managed services

Record the lot selection. Use it to focus the "Gather service information" step on the lot-specific
sub-section, and to recommend the correct SDD command in the summary.

### 6. Gather service information

Through conversation (pre-populating from the supplier profile and any web research above — only ask
for what is still missing), gather:

**Service basics:**

- Service name (max 100 characters for the marketplace)
- Service description (max 50 words for the summary field)
- Which lot (Lot 1: Hosting, Lot 2: Software, Lot 3: Support)
- Target buyer segments (Central Government, Local Government, NHS, Education, Police, Defence,
  Devolved Administrations, etc.)

**For Lot 1 (Cloud Hosting):**

- Deployment model (Public / Private / Hybrid / Community cloud)
- Service type (Compute, Storage, Networking, Container, Serverless, etc.)
- Underlying infrastructure (AWS, Azure, GCP, own data centre, etc.)

**For Lot 2 (Cloud Software):**

- Software category (CRM, HR, Finance, Collaboration, Security, Analytics, etc.)
- Deployment (Multi-tenant SaaS, Single-tenant, Dedicated instance)
- Integration capabilities (APIs, SSO, data import/export)

**For Lot 3 (Cloud Support):**

- Support type (Migration, Implementation, Managed Services, Training, Consultancy)
- Technologies supported
- Delivery model (Remote, On-site, Hybrid)

**Service features and benefits:**

- Up to 10 key features (max 100 chars each for the marketplace)
- Up to 10 key benefits (max 100 chars each for the marketplace)

**Differentiation:**

- What makes this service unique?
- Key competitive advantages
- Target use cases

**Technical details:**

- Hosting location(s) and data residency options
- Backup and DR approach
- Scalability approach
- Security controls (cross-reference supplier-profile certifications where available)

**Support model:**

- Support hours and channels (Phone, Email, Web chat, Ticketing)
- Response time targets and escalation process

**Pricing model:**

- Pricing structure (Per user, Per GB, Flat fee, Consumption-based, etc.)
- Minimum commitment and volume discounts
- Education / charity pricing
- Free trial available?

### 7. Read the service-design template

Use the **Read tool** to read the template:

- `${CLAUDE_PLUGIN_ROOT}/templates/service-design-template.md`

Resolve the `<!-- DOC-CONTROL-HEADER -->` marker and any `{{CLASSIFICATION}}` placeholder per the
rendering rules in `${CLAUDE_PLUGIN_ROOT}/templates/_partials/RENDERING.md` if that partial is
present, defaulting the Classification field to `${user_config.default_classification}` (fall back to
`OFFICIAL` for UK Gov context if unavailable).

### 8. Determine the output filename

`SVCD` is a single-instance doc-type per service project. Generate the document ID and filename with
the ArcKit helper:

```bash
bash "${CLAUDE_PLUGIN_ROOT}/scripts/bash/generate-document-id.sh" \
     {PROJECT_ID} SVCD --filename
```

This returns `ARC-{NNN}-SVCD-v1.0.md` (using the zero-padded `project_number` from Step 4). Use the
returned filename for the output document and take the version (`1.0`) from it.

### 9. Populate the template

Fill every `[PLACEHOLDER]` field in the template with the information gathered above. Tick the
correct lot and buyer-segment checkboxes. Leave genuinely-unknown fields as `[PENDING]` rather than
inventing values. Where a fact came from a fetched source, attach the appropriate inline citation
marker (see Step 3).

Populate the Document Control header and Revision History (version `1.0` for a new service design;
increment and add a Revision History row for an update). Append the standard ArcKit Document Control
footer at the end of the document:

```markdown
---

**Generated by**: ArcKit `/arckit:service-design` command
**Generated on**: [DATE]
**ArcKit Version**: [VERSION]
**Project**: [PROJECT_NAME] (Project [PROJECT_ID])
**Model**: [AI_MODEL]
```

### 10. Write the service-design document

Use the **Write tool** to save the completed document to:

`{project_dir}/{filename}` — e.g. `projects/004-secure-case-mgmt/ARC-004-SVCD-v1.0.md`

(The Write tool creates parent directories automatically.) Do **not** echo the full document into
your response — it is large and only a summary should be printed.

### 11. Output summary

Print only a short summary (not the full document):

```markdown
## Service Design Created

**Service:** [Name]
**Lot:** [Lot X — Description]
**Saved to:** `{project_dir}/ARC-{PROJECT_ID}-SVCD-v1.0.md`

### Key Features
1. [Feature 1]
2. [Feature 2]
...

### Target Buyers
- [Segment 1]
- [Segment 2]

### Pricing Model
[Summary]

### Next Steps
- Generate the Service Definition Document for the chosen lot: `/arckit:sdd-lot2` (or the matching
  lot command)
- Produce the G-Cloud pricing document: `/arckit:pricing`

### Items Requiring Attention
- [Any [PENDING] fields the user must supply]
- [If the supplier profile was missing: run `/arckit:supplier-profile` to enrich this design]
```

## Important Notes

- Each service is its own ArcKit project under `projects/{NNN}-service-name/` — never write multiple
  services into one project directory.
- Service name must be unique on the Digital Marketplace.
- Features and benefits have strict character limits (100 chars each).
- The service description has a 50-word limit for the summary field.
- Choose the lot carefully — it cannot be changed after submission.
- Consider buyer search terms when writing features and benefits.
- **Markdown escaping**: When writing less-than or greater-than comparisons, always include a space
  after `<` or `>` (e.g. `< 3 seconds`, `> 99.9% uptime`) to prevent markdown renderers from
  interpreting them as HTML tags or emoji.
