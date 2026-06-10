---
description: Generate the Service Definition Document for Lot 2 (Cloud Software / SaaS)
effort: max
handoffs:
  - command: /arckit:pricing
    description: Produce the pricing document for this service
  - command: /arckit:security
    description: Generate NCSC Cloud Security Principles assertions
---

> ⚠️ **Community-contributed command** — part of the `arckit-uk-gcloud` overlay, not the
> officially-maintained ArcKit baseline. The Service Definition Document produced here is an internal
> planning aid for a UK G-Cloud / Digital Marketplace **Lot 2 (Cloud Software)** service offering; it
> is **not** legal or procurement advice. Every assertion in a G-Cloud SDD must be evidenceable —
> CCS may request proof — so verify every claim against the underlying evidence (supplier profile,
> certificates, security accreditations) before publishing a live framework listing.

You are helping a cloud service supplier generate a complete **Service Definition Document (SDD)** for
**Lot 2 (Cloud Software — SaaS)** on the G-Cloud Digital Marketplace.

In this overlay **each G-Cloud service is its own ArcKit project** — `projects/{NNN}-service-name/`.
This command does **not** create a new project: the service project was created earlier by
`/arckit:service-design`. This command **resolves the existing service project** and writes the SDD
into it.

## User Input

```text
$ARGUMENTS
```

## Instructions

### 1. Resolve the existing service project

The user should identify the service in `$ARGUMENTS` by **service name** (or name fragment) or by
**project number** (e.g. `004` or `secure-case-mgmt`). List the existing projects as JSON and match
against `$ARGUMENTS`:

```bash
bash "${CLAUDE_PLUGIN_ROOT}/scripts/bash/list-projects.sh" --json
```

From the JSON `projects[]` array, each entry has `name`, `number`, and `path`. Resolve the target:

- If `$ARGUMENTS` is (or contains) a project number, match on `number`.
- Otherwise match the `name` field case-insensitively against the service name / fragment in
  `$ARGUMENTS`.
- If exactly one project matches, use it. If several match, use the **AskUserQuestion** tool to let
  the user pick. If `$ARGUMENTS` is empty, list the candidate projects and ask which one.

**If no matching project is found**, tell the user the service project does not exist and that they
must run `/arckit:service-design` first to create it, then **stop** (do not create a project here).

From the matched project record extract:

- `path` — the service project directory (e.g. `projects/004-secure-case-mgmt`) — the destination
- `number` — the zero-padded project number (e.g. `004`) — use as `PROJECT_ID`
- `name` — the project / service name

### 2. Read the existing context

Read the supplier profile and the service-design document so the SDD is consistent with them — do
not re-ask for information already captured upstream:

- Supplier profile (supplier-wide): use the **Read tool** on
  `projects/000-global/supplier/ARC-000-SUPP-v1.0.md` if it exists.
- Service design (this project): use the **Read tool** on the resolved project's
  `ARC-{PROJECT_ID}-SVCD-v*.md` (the SVCD doc written by `/arckit:service-design`).

If the service-design document is missing, warn the user that running `/arckit:service-design` first
produces a richer, consistent SDD, then continue with what is available.

### 3. Research service details (optional web lookup)

If service information is incomplete, use **WebFetch** to gather details and **WebSearch** for
context:

- **Supplier website / service page** — detailed feature descriptions, technical specifications, API
  documentation links, support hours and SLAs, certifications claimed.
- **Existing Digital Marketplace listing** —
  `site:applytosupply.digitalmarketplace.service.gov.uk "[service name]"` to see how the service is
  currently described, existing pricing model, and highlighted features.

**Citation traceability**: When you fetch a supplier page, a G-Cloud listing, query an MCP server, or
read any document the user has placed under the project's `external/`, `policies/`, or `vendors/`
directories, follow the citation instructions in
`${CLAUDE_PLUGIN_ROOT}/references/citation-instructions.md`. Place inline citation markers (e.g.
`[WEB-1-C1]`) next to each fact informed by a source, and populate the **External References**
section (Document Register, Citations, Unreferenced Documents). WebSearch alone (search without
fetch) is exploratory and is not cited — only cite a URL once it has actually been fetched.

### 4. Read the SDD template

Use the **Read tool** to read the Lot 2 template:

- `${CLAUDE_PLUGIN_ROOT}/templates/sdd-lot2-template.md`

Resolve the `<!-- DOC-CONTROL-HEADER -->` marker and any `{{CLASSIFICATION}}` placeholder per the
rendering rules in `${CLAUDE_PLUGIN_ROOT}/templates/_partials/RENDERING.md` if that partial is
present, defaulting the Classification field to `${user_config.default_classification}` (fall back to
`OFFICIAL` for UK Gov context if unavailable).

### 5. Generate the Service Definition Document

Generate answers for **all** questions in the G-Cloud Lot 2 framework. Use the service design and
supplier profile to provide accurate, **consistent** answers.

**CRITICAL:** The SDD must answer every mandatory question — missing answers cause rejection.

#### Question categories for Lot 2

**Service information:**

- Service name (≤ 100 chars)
- Service description / summary (≤ 50 words)
- Service features (up to 10, ≤ 100 chars each)
- Service benefits (up to 10, ≤ 100 chars each)

**Pricing:** pricing model; price variations; free trial / version; education pricing.

**Technical:** cloud deployment model (Public / Private / Hybrid / Community); service constraints;
API availability and documentation; command line interface; web interface; supported browsers;
mobile support; devices for service management.

**Data:** data storage and processing locations; user control over data location; data import
formats; data export formats; data extraction at end of contract; end-of-contract process.

**Security:** security governance standards (ISO 27001, CSA CCM, etc.); security governance approach;
data-centre security standards; data protection between networks; data protection within network;
penetration testing; vulnerability management; protective monitoring; incident management; audit
trails (buyer actions, supplier actions); access-restriction management; board-level security
responsibility.

**Identity & access:** user authentication; access management; identity federation; device
management.

**Operations:** backup approach; backup controls; backup scheduling; backup data-centre location;
disaster recovery; configuration management; change management.

**Support:** support availability; support channels (email, phone, web chat); support response
times; service levels; onboarding support; training; documentation; documentation accessibility.

**Scaling:** scaling approach; scaling independence; usage monitoring / reporting.

**Resilience:** approach to resilience; data replication; guaranteed availability.

**Standards & certifications:** government security clearances; quality assurance and testing;
accreditations.

**End of service:** data sanitisation approach; equipment disposal.

### 6. Determine the output filename

`SDD` is a **single-instance** doc-type per service project. Generate the document ID and filename
with the ArcKit helper (no `--next-num` — SDD is not multi-instance):

```bash
bash "${CLAUDE_PLUGIN_ROOT}/scripts/bash/generate-document-id.sh" \
     {PROJECT_ID} SDD --filename
```

This returns `ARC-{NNN}-SDD-v1.0.md` (using the zero-padded project number from Step 1). Use the
returned filename for the output document and take the version (`1.0`) from it. If the service
already has an SDD, increment the version and add a Revision History row instead of overwriting at
v1.0.

### 7. Populate the template

Fill every `[PLACEHOLDER]` field with the information gathered above. The template already carries a
`**G-Cloud Lot**` line — record this service as **Lot 2 (Cloud Software)**. Respect marketplace
limits (≤ 100 chars per feature/benefit, ≤ 50 words for the service summary). Leave genuinely-unknown
fields as `[PENDING]` rather than inventing values. Where a fact came from a fetched source, attach
the appropriate inline citation marker (see Step 3). Verify consistency with the supplier profile
(certifications, data-centre locations) and with the service design.

Populate the Document Control header (Document ID = `ARC-{PROJECT_ID}-SDD-v{VERSION}`) and Revision
History, and append the standard ArcKit Document Control footer:

```markdown
---

**Generated by**: ArcKit `/arckit:sdd-lot2` command
**Generated on**: [DATE]
**ArcKit Version**: [VERSION]
**Project**: [PROJECT_NAME] (Project [PROJECT_ID])
**Model**: [AI_MODEL]
```

### 8. Write the SDD

Use the **Write tool** to save the completed document to:

`{path}/{filename}` — e.g. `projects/004-secure-case-mgmt/ARC-004-SDD-v1.0.md`

(The Write tool creates parent directories automatically and avoids the 32K output-token limit.) Do
**not** echo the full document into your response — it is large and only a summary should be printed.

### 9. Output summary

Print only a short summary (not the full document):

```markdown
## Service Definition Document Generated

**Service:** [Name]
**Lot:** 2 — Cloud Software
**Saved to:** `{path}/ARC-{PROJECT_ID}-SDD-v1.0.md`

### Completion Status
- Service Information: ✅ Complete
- Pricing: ✅ Complete
- Technical: ✅ Complete
- Data: ✅ Complete
- Security: ✅ Complete
- Support: ✅ Complete
- Operations: ✅ Complete

### Key Assertions
- ISO 27001: [Yes/No]
- Cyber Essentials: [Yes/No]
- UK Data Centres: [Yes/No]
- 24/7 Support: [Yes/No]

### Word / Character Limits
- Description: [X]/50 words
- Features: [X]/10 (all ≤ 100 chars)
- Benefits: [X]/10 (all ≤ 100 chars)

### Next Steps
- Produce the pricing document for this service: `/arckit:pricing`
- Generate NCSC Cloud Security Principles assertions: `/arckit:security`

### Items Requiring Attention
- [Any [PENDING] fields the user must supply]
- [If the service design or supplier profile was missing: run `/arckit:service-design` /
  `/arckit:supplier-profile` to enrich this SDD]
```

## Important Notes

- Every assertion must be evidenceable — CCS may request proof.
- Security certifications must be current and verifiable; data-centre locations must match the
  supplier profile.
- Pricing model must align with the pricing document; support hours must be achievable and
  monitorable.
- This command never creates a project — if none is found, direct the user to `/arckit:service-design`.
- **Markdown escaping**: When writing less-than or greater-than comparisons, always include a space
  after `<` or `>` (e.g. `< 3 seconds`, `> 99.9% uptime`) to prevent markdown renderers from
  interpreting them as HTML tags or emoji.
