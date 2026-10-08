---
description: Design a new cloud service offering for G-Cloud 15 and choose its lot
doc-type: SVCD
effort: high
handoffs:
  - command: /arckit-uk-gcloud:sdd-lot1a
    description: Generate the Service Definition Document for the service
    condition: "Lot 1a (IaaS and PaaS) selected"
  - command: /arckit-uk-gcloud:sdd-lot1b
    description: Generate the Service Definition Document for the service
    condition: "Lot 1b (IaaS and PaaS above OFFICIAL) selected"
  - command: /arckit-uk-gcloud:sdd-lot2a
    description: Generate the Service Definition Document for the service
    condition: "Lot 2a (iSaaS) selected"
  - command: /arckit-uk-gcloud:sdd-lot2b
    description: Generate the Service Definition Document for the service
    condition: "Lot 2b (SaaS) selected"
  - command: /arckit-uk-gcloud:sdd-lot3
    description: Generate the Service Definition Document and the role levels that deliver the service
    condition: "Lot 3 (Cloud Support) selected"
  - command: /arckit-uk-gcloud:pricing
    description: Produce the G-Cloud 15 pricing document for this service
---

> ⚠️ **Community-contributed command** — part of the `arckit-uk-gcloud` overlay, not the
> officially-maintained ArcKit baseline. The service design produced here is an internal planning
> aid for a G-Cloud 15 (RM1557.15) Digital Marketplace service offering; it is **not** legal or
> procurement advice. GCA (the Government Commercial Agency, formerly CCS) sets strict limits on
> service names, descriptions, features and benefits, and the lot cannot be changed after
> submission — verify every claim against the underlying evidence before publishing a live listing.

You are helping a cloud service supplier design a new service offering for **G-Cloud 15
(RM1557.15)** on the Digital Marketplace. The service design fixes the service's lot, identity,
features and approach; every later document for the service is built from it. In this overlay
**each G-Cloud service is its own ArcKit project** — `projects/{NNN}-service-name/` — so this command
**creates (or locates) the service project** and writes the service-design document into it.

## User Input

```text
$ARGUMENTS
```

## Instructions

### 1. Read the supplier profile (recommended context)

The supplier profile is supplier-wide and feeds every service design. Find the latest version:

```bash
find projects/000-global/supplier -maxdepth 1 -name 'ARC-000-SUPP-v*.md' 2>/dev/null | sort -V
```

- **If it exists**, use the **Read tool** on the highest version for company details,
  certifications, data centres, security clearances and insurance, and pre-populate the service
  design from it rather than re-asking the user.
- **If it is missing**, warn the user that running `/arckit-uk-gcloud:supplier-profile` first produces a
  richer, consistent service design, then continue (the profile is recommended, not mandatory).

### 2. Research the service (optional web lookup)

If `$ARGUMENTS` includes a service URL, an existing G-Cloud listing or a supplier website, use
**WebFetch** to extract the service's features, benefits, categories, pricing structure,
certifications, supplier type and support details. On G-Cloud 15 listings these also include the
rate card (Lot 3), discount tiers (Lots 2a/2b) or price formula (Lot 1a), and social value.

Use **WebSearch** to find:

- An existing G-Cloud listing: `site:applytosupply.digitalmarketplace.service.gov.uk "[service name]"`
- Competitor services: `site:applytosupply.digitalmarketplace.service.gov.uk G-Cloud 15 [service category]`
- Market positioning: `"[service name]" review OR case study`

The Digital Marketplace lists only G-Cloud 15 services. Its lot search slugs are:

| Lot | Slug |
|-----|------|
| 1a IaaS and PaaS | `iaas-and-paas` |
| 1b IaaS and PaaS above OFFICIAL | not publicly listed; search `iaas-and-paas` for comparable services |
| 2a Infrastructure Software as a Service (iSaaS) | `isaas` |
| 2b Software as a Service (SaaS) | `saas` |
| 3 Cloud Support | `cloud-support` |

Lot names from the previous framework, such as `cloud-software`, no longer filter the search. While
the lot is still undecided between 2a and 2b, look at both `isaas` and `saas` listings: where similar
services are listed is evidence for the choice.

**Citation traceability**: When you fetch a service page, a G-Cloud listing, a supplier website, or
read any document the user has placed under the service project's `external/` directory, follow the
citation instructions in `${CLAUDE_PLUGIN_ROOT}/references/citation-instructions.md`. Place inline
citation markers (e.g. `[WEB-1-C1]`) next to each fact informed by a source, and populate the
**External References** section (Document Register, Citations, Unreferenced Documents) accordingly.
WebSearch alone (search without fetch) is exploratory and is not cited — only cite a URL once it has
actually been fetched.

### 3. Find or create the service project

**Look for an existing service first.** A re-run often uses a different name from the first run
("Case Management Platform" after "Case Mgmt"), and the project helper always allocates a new
number, so creating straight away would leave two projects for one service. List the projects as
JSON:

```bash
bash "${CLAUDE_PLUGIN_ROOT}/scripts/bash/list-projects.sh" --json
```

From the `projects[]` array (each entry has `name`, `number` and `path`), check whether `$ARGUMENTS`
names a service project by number (`004`), by name or name fragment, or by path
(`projects/004-secure-case-mgmt`):

- **One project matches:** this is a re-run. Use that project, even if the service now has another
  name (change the name inside the document, not the directory). If the input was only part of a
  name and could be a new service ("case" when `004-secure-case-mgmt` exists), confirm with
  **AskUserQuestion** first.
- **Several match:** ask the user which one they mean.
- **None match:** if a listed project looks like this offer under another name, ask with
  **AskUserQuestion** whether to update that project or create a new one. Otherwise create a new one.

On a re-run, set `PROJECT_ID` to the project's `number` and use its `path` as the destination. Read
its existing `ARC-{PROJECT_ID}-SVCD-v*.md` and update it rather than starting over: keep confirmed
answers, increment the version and add a Revision History row saying what changed.

**To create one,** settle on a short service name: take it from `$ARGUMENTS`, or from the research
above if the input was a URL or a description. If there is still no name, ask for one (Step 5's
question call). Never create a project from an empty name. Each service is its own numbered project.
Run the ArcKit project helper, passing the service name, and request JSON output:

```bash
bash "${CLAUDE_PLUGIN_ROOT}/scripts/bash/create-project.sh" --name "<service name>" --json
```

From the JSON response, extract:

- `project_dir` — the service project directory (e.g. `projects/004-secure-case-mgmt`)
- `project_number` — the zero-padded project number (e.g. `004`)

Use `project_number` as `PROJECT_ID` and `project_dir` as the destination.

### 4. Select the lot

G-Cloud 15 has five lots. A service belongs to exactly one; a supplier who sells software and the
services around it lists them as separate services (separate ArcKit projects).

| Lot | What it covers | Category roots | SDD command |
|-----|----------------|----------------|-------------|
| **1a** IaaS and PaaS | Processing and storing data, running software or networking | IaaS, PaaS | `/arckit-uk-gcloud:sdd-lot1a` |
| **1b** IaaS and PaaS above OFFICIAL | As 1a, for buyers whose data is classified above OFFICIAL | IaaS, PaaS (as 1a) | `/arckit-uk-gcloud:sdd-lot1b` |
| **2a** Infrastructure Software as a Service (iSaaS) | Cloud-based systems infrastructure software | Systems Infrastructure Software; Application Development and Deployment | `/arckit-uk-gcloud:sdd-lot2a` |
| **2b** Software as a Service (SaaS) | Applications hosted in the cloud | Applications; Application Development and Deployment | `/arckit-uk-gcloud:sdd-lot2b` |
| **3** Cloud Support | Managed services, FinOps, migration planning, set-up and migration, security, QA and testing, training, ongoing support | Cloud Support Services | `/arckit-uk-gcloud:sdd-lot3` |

**Choosing between lots:**

- **IaaS/PaaS (1a) or software (2a/2b):** Lot 1a is the infrastructure or platform itself: compute,
  storage, quantum infrastructure, and platforms buyers build and run their own applications on.
  Software the buyer uses as a finished product is Lot 2a or 2b. Some category names appear in both
  trees; decide on what the buyer is buying, then check the lot's own tree.
- **iSaaS (2a) or SaaS (2b):** iSaaS is software that runs or protects IT: security, identity and
  access, IT operations and service management, endpoint management, operating systems and
  virtualisation, network and storage software, cloud financial management, integration middleware
  and application servers. SaaS is software for the business: collaboration, CRM, finance, HR,
  procurement, content, engineering, public sector operations, and analytics, data and AI tools.
  Both lots share the "Application Development and Deployment" root, but its categories differ
  between them. Where similar services are listed (the `isaas` and `saas` searches) is good evidence.
- **1b only above OFFICIAL:** choose Lot 1b only for a service built to handle data classified above
  OFFICIAL (SECRET or TOP SECRET). It needs staff cleared to SC or DV, and its prices go on GCA's
  separate, non-public platform. Lot 1b isn't in the public Digital Marketplace search.
- **Lot 3 is people-based:** managed services, consultancy, migration, FinOps, testing and training,
  priced as day rates for DDaT role levels. A managed service of a cloud platform is Lot 3; the
  platform itself is Lot 1a.

**$ARGUMENTS bypass:** if `$ARGUMENTS` or the conversation already names a G-Cloud 15 lot, use it and
don't ask:

- `1a`, "IaaS", "PaaS", "hosting" → 1a, unless the service is above OFFICIAL ("1b", "SECRET",
  "above OFFICIAL") → 1b
- `2a`, "iSaaS", "infrastructure software" → 2a
- `2b`, "SaaS", "application" → 2b
- `3`, "support", "consultancy", "managed service", "migration", "FinOps" → 3

A lot name from the previous framework ("Lot 1", "Lot 2", "Cloud Hosting", "Cloud Software") doesn't
settle it, because each became two lots: ask the narrowing question below.

**Otherwise, ask** in Step 5's single question call, following
`${CLAUDE_PLUGIN_ROOT}/references/interview-pattern.md`. AskUserQuestion takes at most four options,
so ask the lot as one question with the four most likely lots for this service and its
**(Recommended)** option inferred from the arguments, the research and the supplier profile, for
example: **Lot 1a — IaaS and PaaS**, **Lot 2a — iSaaS**, **Lot 2b — SaaS**, **Lot 3 — Cloud
Support**. Offer **Lot 1b — IaaS and PaaS above OFFICIAL** in place of the least likely option only
when the service handles data above OFFICIAL. Each option's description summarises the guidance
above. In a headless run, take the recommended lot and list it as an assumption.

On a re-run, if the lot changes and the project already has an `ARC-{PROJECT_ID}-SDD-v*.md`, warn
that the SDD was written for the old lot and must be regenerated with the new lot's command; the
questions differ.

Record the lot code and its full name, exactly one of:

- `Lot 1a — Infrastructure as a Service (IaaS) and Platform as a Service (PaaS)`
- `Lot 1b — IaaS and PaaS above OFFICIAL`
- `Lot 2a — Infrastructure Software as a Service (iSaaS)`
- `Lot 2b — Software as a Service (SaaS)`
- `Lot 3 — Cloud Support`

Use the lot to choose the lot-specific questions in Step 5 and the SDD command in the summary.

### 5. Gather service information

Pre-populate from the supplier profile and the research above, and ask only for what is still
missing and matters to the design, in **one** AskUserQuestion call per
`${CLAUDE_PLUGIN_ROOT}/references/interview-pattern.md` (the lot question from Step 4 goes first).
Anything else unconfirmed is written as `[PENDING]`.

**Service basics:**

- Service name: at most 100 characters, the name only (GCA says not to add extra keywords)
- Service description: at most 500 characters, a summary of what the service is for
- Target buyer segments (central government, local government, NHS, education, police, defence,
  devolved administrations)
- A first pass at categories from the lot's tree, **all under one root and one group** (the first
  two levels of the path, such as `Cloud Support Services > Managed Cloud`). None of the 42,893 live
  G-Cloud 15 listings scraped on 7 October 2026 has categories in two groups, although GCA's
  question export states no rule. If the offer spans groups, ask the user with **AskUserQuestion**
  which group this service is listed under, and design each other group as its own service (run this
  command again for each). Read only the lot's section of
  `${CLAUDE_PLUGIN_ROOT}/skills/gcloud-framework/references/g-cloud-15/categories.md`:

  ```bash
  # One lot's tree: 1a (also used by 1b), 2a, 2b or 3
  sed -n '/^## Lot 2b:/,/^## Lot 3:/p' "${CLAUDE_PLUGIN_ROOT}/skills/gcloud-framework/references/g-cloud-15/categories.md"
  ```

  Use the lot's own heading: `/^## Lot 1a:/,/^## Lot 2a:/p`, `/^## Lot 2a:/,/^## Lot 2b:/p`,
  `/^## Lot 2b:/,/^## Lot 3:/p` or `/^## Lot 3:/,$p`.

**Features and benefits:** at most 10 of each, 10 words each. Features are technical capabilities
("real-time reporting", "remote access"); benefits are active phrases about how users' work improves
("publish content from multiple devices").

**Supplier type**, asked per service. Listings show these options as "Not a reseller", "Reseller
providing extra features and support", "Reseller providing extra support" and "Reseller (no
extras)"; the Digital Platform words them:

- I’m not a reseller
- I’m a reseller providing extra features and support not available from the original supplier
- I’m a reseller providing extra support
- I’m a reseller not providing extra features or support

For a reseller, the organisation whose services are resold. For Lots 1a/1b, note that the lot
questions (`/arckit-uk-gcloud:lot-questions`) also ask, once per bid, whether the bid is as a Reseller or with
Sole Control of the Infrastructure.

**Lot-specific questions** (from GCA's service questions for the lot):

- **Lots 1a/1b:** NIST deployment model (public, private, community, hybrid); own infrastructure or
  resold, and which providers; datacentre setup; backup and recovery, what is backed up, RPO/RTO; how
  users are separated (virtualisation technology and who implements it); web interface, API (and
  automation tools such as Terraform or Ansible) and command line; metrics, resource tagging and
  FOCUS resource tagging; usage notifications and automatic scaling; EU code of conduct for
  energy-efficient datacentres; whether an ISO 27018 certificate is held (required on Lots 1a and 1b
  for a service that includes public cloud, unless you resell and rely on the provider's
  accreditations). **Lot 1b also:** the highest classification handled and the staff clearance
  offered (Lot 1b allows only Security Clearance (SC) or Developed Vetting (DV)).
- **Lots 2a/2b:** whether it is an add-on to other software; NIST deployment model; multi cloud
  support; browser, installed application (which operating systems) and mobile access; API, API
  sandbox, customisation; data import and export formats; public sector networks (PSN, PNN, JANET,
  SWAN, HSCN); Software Security Code of Practice compliance; usage metrics and FOCUS resource
  tagging.
- **Lot 3:** the one category group the service sits in; remote or on-site delivery; platforms
  supported; staff screening (to BS7858:2019 or not) and the highest clearance offered; the **role
  levels** that deliver it, named exactly as in
  `${CLAUDE_PLUGIN_ROOT}/skills/ddat-rate-card/references/lot-3-rate-card.md`. Rates are not set per
  service: `/arckit-uk-gcloud:pricing` keeps one rate card for all the supplier's Lot 3 services
  (`ARC-000-RATE`), and every Lot 3 listing shows it in full, so these levels only have to be on it.
  A role the rate card doesn't name (procurement or commercial adviser, trainer) goes in at the
  nearest DDaT role and level by its work and seniority, with its own name beside it.

**Technical details:** architecture, where data is stored and processed (United Kingdom, EEA,
other), whether users can choose, integrations.

**Support model:** email or online ticketing (and response times), phone and web chat (and hours: 24
hours, 7 days a week; 9 to 5 UK time, 7 days a week; 9 to 5 UK time, Monday to Friday), AI chatbot,
onsite support (not asked for Lot 3), support levels.

**Pricing approach** (prices themselves come from `/arckit-uk-gcloud:pricing`):

- **1a/1b:** the price formula: baseline price, fixed onboarding costs, framework discount, any
  supplier-specific schemes and time-limited discounts
- **2a/2b:** unit prices and the intended discount for each annual call-off value band
- **3:** the supplier's one rate card (`ARC-000-RATE`), which must cover this service's role levels
- **All:** education discount; free trial (Lots 1a/1b, 2a/2b)

**Certifications:** current status for the ones this lot's lot questions cover (see the template's
section 10). Call-offs need Cyber Essentials Plus under Lots 1a/1b and Cyber Essentials under Lots 2a,
2b and 3; neither is a condition of the bid, so a missing certificate is a call-off warning.

### 6. Read the service-design template

Read the template (user override takes precedence):

- **First**, check `.arckit/templates-custom/service-design-template.md`
- **Then**, `.arckit/templates/service-design-template.md`
- **Fallback**, `${CLAUDE_PLUGIN_ROOT}/templates/service-design-template.md`
- **Then read** `${CLAUDE_PLUGIN_ROOT}/templates/_partials/RENDERING.md` and resolve the `<!-- DOC-CONTROL-HEADER -->` marker in the template before writing. Do not hand-write the Document Control table: the partial `RENDERING.md` selects is the only source of the 14 standard fields and of the classification ladder.

Default the Classification field to `${user_config.default_classification}` (fall back to `OFFICIAL`
for UK Gov context if unavailable).

### 7. Determine the output filename

`SVCD` is a single-instance doc-type per service project. Generate the document ID and filename with
the ArcKit helper:

```bash
node "${CLAUDE_PLUGIN_ROOT}/scripts/generate-document-id.mjs" \
     {PROJECT_ID} SVCD --filename
```

This returns `ARC-{NNN}-SVCD-v1.0.md` (using the zero-padded `project_number` from Step 3). Use the
returned filename and take the version from it. If the service already has a service design,
increment the version instead and add a Revision History row.

### 8. Populate the template

Fill it in:

- **`**G-Cloud Lot**` line:** exactly one of the five lot names from Step 4, worded exactly. The SDD,
  pricing, security and review commands read this line. Set the **SDD command** row in G-Cloud
  Details to the matching SDD command: `/arckit-uk-gcloud:sdd-lot1a`, `/arckit-uk-gcloud:sdd-lot1b`, `/arckit-uk-gcloud:sdd-lot2a`, `/arckit-uk-gcloud:sdd-lot2b` or `/arckit-uk-gcloud:sdd-lot3`.
- **1.3 Lot:** tick the lot and write the justification, including why the nearest alternative lot
  doesn't fit.
- **1.4 Service categories:** the one category group on its **Category group** line, and only
  categories under it.
- **Section 6:** keep only the lot's subsection.
- **Counters:** fill in the name and description character counts and each feature's and benefit's
  word count.
- **Section 11.2:** record the search used (query, lot slug, result count, date).

Write anything the supplier hasn't confirmed, and research doesn't establish, as `[PENDING]`. Never
invent it. That covers features, certifications, hosting locations, support hours, role levels and
prices. Every later document reuses this one, so an invented detail spreads into the SDD, pricing and
security evidence. `/arckit-uk-gcloud:review` treats any remaining `[PENDING]` as blocking. Where a fact came
from a fetched source, attach the inline citation marker (see Step 2).

Populate the Document Control header and Revision History, and append the standard ArcKit footer:

```markdown
---

**Generated by**: ArcKit `/arckit-uk-gcloud:service-design` command
**Generated on**: [DATE]
**ArcKit Version**: [VERSION]
**Project**: [PROJECT_NAME] (Project [PROJECT_ID])
**Model**: [AI_MODEL]
```

### 9. Write the service-design document

Before writing, read `${CLAUDE_PLUGIN_ROOT}/references/quality-checklist.md` and verify all **Common Checks** plus the **SVCD** per-type checks pass. Fix any failures before proceeding.

Use the **Write tool** to save the completed document to:

`{project_dir}/{filename}` — e.g. `projects/004-secure-case-mgmt/ARC-004-SVCD-v1.0.md`

(The Write tool creates parent directories automatically.) Do **not** echo the full document into
your response — print only the summary below.

### 10. Output summary

Check which supplier-wide documents exist, so the next steps list only what is missing:

```bash
for t in SOCV LOTQ DECL; do
    find projects/000-global/supplier -maxdepth 1 -name "ARC-000-$t-v*.md" 2>/dev/null | grep . || echo "MISSING: $t"
done
```

For the LOTQ document, also check that it has the Part for this service's lot group (Part 1 for Lots
1a/1b, Part 2 for Lots 2a/2b, Part 3 for Lot 3).

Print only a short summary, reporting what the document contains:

```markdown
## Service Design Created

**Service:** [Name]
**Lot:** Lot [code] — [full name]
**Saved to:** `{project_dir}/ARC-{PROJECT_ID}-SVCD-v[X.Y].md`

### Limits
| Field | In the document | Limit |
|-------|-----------------|-------|
| Service name | [X] characters | 100 |
| Description | [X] characters | 500 |
| Features | [N] items, longest [X] words | 10 items, 10 words |
| Benefits | [N] items, longest [X] words | 10 items, 10 words |

### Key Features
1. [Feature 1]
2. [Feature 2]
...

### Lot and Categories
- Why this lot: [one line]
- Category group: [Root > Group]; categories (first pass): [full paths]
- Other groups the offer spans, to design as separate services: [groups, or "None"]
- Supplier type: [option]

### Target Buyers
- [Segment 1]
- [Segment 2]

### Pricing Approach
[Summary, by the lot's pricing model]

### Items Requiring Attention
- [Each `[PENDING]` item, with what the supplier needs to confirm — or "None"]
- [If the supplier profile was missing: run `/arckit-uk-gcloud:supplier-profile` to enrich this design]

### Assumptions
- [Each default taken because a question was not answered — or omit]

### Next Steps
1. **Generate the Service Definition Document:** the lot's SDD command, `/arckit-uk-gcloud:sdd-lot1a`, `/arckit-uk-gcloud:sdd-lot1b`, `/arckit-uk-gcloud:sdd-lot2a`, `/arckit-uk-gcloud:sdd-lot2b` or `/arckit-uk-gcloud:sdd-lot3`, with `[service]`
2. **Price the service:** `/arckit-uk-gcloud:pricing [service]`
3. **Security evidence:** `/arckit-uk-gcloud:security [service]`
4. [Only if missing] **Social value:** `/arckit-uk-gcloud:social-value` (once per supplier; 10% of every lot's score)
5. [Only if missing] **Lot questions for Lots [group]:** `/arckit-uk-gcloud:lot-questions`, once this service has its SDD, pricing and security evidence (once per lot group bid for, as a Part of `projects/000-global/supplier/ARC-000-LOTQ-v*.md`; its award criteria repeat the SDD's answers)
6. [Only if missing] **Supplier declaration:** `/arckit-uk-gcloud:declaration`, after the lot questions
```

Show only the SDD command for this service's lot.

## Important Notes

- Each service is its own ArcKit project under `projects/{NNN}-service-name/` — never write multiple
  services into one project directory.
- Choose the lot carefully: it can't be changed after submission, and 1a/1b, 2a/2b and 3 each ask
  different lot questions and are scored differently.
- Service name: 100 characters, name only. Description: 500 characters. Features and benefits: 10
  each, 10 words each.
- The Digital Marketplace search uses light stemming and no synonyms, so use the words buyers type
  in the description, features and benefits.
- Lot 1b is not publicly listed, and its prices go on GCA's separate platform.
- **Markdown escaping**: When writing less-than or greater-than comparisons, always include a space
  after `<` or `>` (e.g. `< 3 seconds`, `> 99.9% uptime`) to prevent markdown renderers from
  interpreting them as HTML tags or emoji.
