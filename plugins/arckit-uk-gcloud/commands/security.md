---
description: Generate NCSC Cloud Security Principles assertions and evidence for a service
effort: high
handoffs:
  - command: /arckit:dpia
    description: Produce a Data Protection Impact Assessment using ArcKit core
  - command: /arckit:review
    description: Validate security evidence as part of submission completeness
---

> ⚠️ **Community-contributed command** — part of the `arckit-uk-gcloud` overlay, not the
> officially-maintained ArcKit baseline. The security assertions produced here are an internal
> planning aid for a UK G-Cloud / Digital Marketplace service offering; they are **not** legal or
> procurement advice. **Every security assertion in a G-Cloud submission must be evidenceable** —
> CCS conducts random audits — so verify every claim against the underlying evidence (certificates,
> penetration-test reports, clearance records) before publishing a live framework listing.

You are helping a cloud service supplier document their **security posture and evidence** for the
G-Cloud Digital Marketplace, structured around the **NCSC Cloud Security Principles**.

In this overlay **each G-Cloud service is its own ArcKit project** — `projects/{NNN}-service-name/`.
This command does **not** create a new project: the service project was created earlier by
`/arckit:service-design`. This command **resolves the existing service project** and writes the
security assertions document into it.

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

Read the supplier profile and the service documents so the security assertions are consistent with
them — do not re-ask for information already captured upstream:

- Supplier profile (supplier-wide): use the **Read tool** on
  `projects/000-global/supplier/ARC-000-SUPP-v1.0.md` if it exists.
- Service design (this project): use the **Read tool** on the resolved project's
  `ARC-{PROJECT_ID}-SVCD-v*.md` (the SVCD doc written by `/arckit:service-design`).
- Service Definition Document (this project): use the **Read tool** on the resolved project's
  `ARC-{PROJECT_ID}-SDD-v*.md` if it exists, so security assertions align with the SDD.

If the service-design document is missing, warn the user that running `/arckit:service-design` first
produces a richer, consistent security document, then continue with what is available.

### 3. Security framework coverage

Document compliance with key frameworks. The **14 NCSC Cloud Security Principles** are the spine of
the document — address every one:

#### NCSC Cloud Security Principles (14 Principles)

1. **Data in transit protection**
   - TLS versions supported
   - Certificate management
   - VPN options

2. **Asset protection and resilience**
   - Physical security
   - Data centre standards
   - Equipment lifecycle

3. **Separation between users**
   - Multi-tenancy approach
   - Logical separation
   - Network isolation

4. **Governance framework**
   - Security policies
   - Risk management
   - Board responsibility

5. **Operational security**
   - Vulnerability management
   - Protective monitoring
   - Incident response

6. **Personnel security**
   - Background checks
   - Security clearances
   - Security training

7. **Secure development**
   - SDLC security
   - Code review
   - Security testing

8. **Supply chain security**
   - Subcontractor vetting
   - Third-party risk
   - Supplier security

9. **Secure user management**
   - Authentication
   - Access control
   - Identity federation

10. **Identity and authentication**
    - MFA options
    - SSO support
    - Password policies

11. **External interface protection**
    - API security
    - Firewall rules
    - DDoS protection

12. **Secure service administration**
    - Admin access controls
    - Privileged access management
    - Audit trails

13. **Audit information for users**
    - Logging available
    - Log retention
    - Export capabilities

14. **Secure use of the service**
    - User guidance
    - Security documentation
    - Configuration guidance

#### Certifications & Standards

**ISO 27001:**

- Certificate number
- Scope
- Certification body
- Last audit date
- Next recertification

**Cyber Essentials / Cyber Essentials Plus:**

- Certificate number
- Certification date
- Expiry date

**SOC 2 Type II:**

- Report date
- Trust service criteria covered
- Exceptions noted

**Other relevant:**

- ISO 22301 (Business Continuity)
- ISO 9001 (Quality)
- PCI DSS (if applicable)
- CSA STAR

#### Security testing

**Penetration testing:**

- Frequency
- Last test date
- Testing provider
- Scope coverage
- Remediation process

**Vulnerability scanning:**

- Frequency
- Tools used
- Remediation SLAs

#### Security clearances

| Clearance Level | Number of Staff | Renewal Process |
|-----------------|-----------------|-----------------|
| BPSS | X | Annual |
| SC | X | 10 years |
| DV | X | 7 years |

### 4. Evidence register

Create an evidence register linking each assertion to its proof:

| Assertion | Evidence | Location | Expiry |
|-----------|----------|----------|--------|
| ISO 27001 certified | Certificate PDF | /evidence/iso27001.pdf | 2025-12 |
| Cyber Essentials Plus | Certificate | /evidence/ce-plus.pdf | 2024-09 |
| Annual pen test | Report summary | /evidence/pentest-2024.pdf | 2025-03 |
| SC cleared staff | Staff register | Internal HR | Ongoing |

### 5. Read the security template

Use the **Read tool** to read the security template:

- `${CLAUDE_PLUGIN_ROOT}/templates/security-template.md`

Resolve the `<!-- DOC-CONTROL-HEADER -->` marker and any `{{CLASSIFICATION}}` placeholder per the
rendering rules in `${CLAUDE_PLUGIN_ROOT}/templates/_partials/RENDERING.md` if that partial is
present, defaulting the Classification field to `${user_config.default_classification}` (fall back to
`OFFICIAL` for UK Gov context if unavailable).

**Citation traceability**: When you fetch a supplier page or a G-Cloud listing, query an MCP server,
or read any document the user has placed under the project's `external/`, `policies/`, or `vendors/`
directories, follow the citation instructions in
`${CLAUDE_PLUGIN_ROOT}/references/citation-instructions.md`. Place inline citation markers (e.g.
`[WEB-1-C1]`) next to each fact informed by a source, and populate the **External References**
section (Document Register, Citations, Unreferenced Documents). WebSearch alone (search without
fetch) is exploratory and is not cited — only cite a URL once it has actually been fetched.

### 6. Determine the output filename

`SECA` is a **single-instance** doc-type per service project. Generate the document ID and filename
with the ArcKit helper (no `--next-num` — SECA is not multi-instance):

```bash
bash "${CLAUDE_PLUGIN_ROOT}/scripts/bash/generate-document-id.sh" \
     {PROJECT_ID} SECA --filename
```

This returns `ARC-{NNN}-SECA-v1.0.md` (using the zero-padded project number from Step 1). Use the
returned filename for the output document and take the version (`1.0`) from it. If the service
already has a security document, increment the version and add a Revision History row instead of
overwriting at v1.0.

### 7. Populate the template

Fill every `[PLACEHOLDER]` field with the information gathered above, addressing all **14 NCSC Cloud
Security Principles**, the certification status, security testing, clearances, and the evidence
register.

**CRITICAL:** ALL security assertions must be **evidenceable** — link each to the evidence register.
Leave genuinely-unknown fields as `[PENDING]` rather than inventing values. Pen-test references
should be executive-summary level only (not full findings). Where a fact came from a fetched source,
attach the appropriate inline citation marker (see Step 5).

Populate the Document Control header (Document ID = `ARC-{PROJECT_ID}-SECA-v{VERSION}`) and Revision
History, and append the standard ArcKit Document Control footer:

```markdown
---

**Generated by**: ArcKit `/arckit:security` command
**Generated on**: [DATE]
**ArcKit Version**: [VERSION]
**Project**: [PROJECT_NAME] (Project [PROJECT_ID])
**Model**: [AI_MODEL]
```

### 8. Write the security document

Use the **Write tool** to save the completed document to:

`{path}/{filename}` — e.g. `projects/004-secure-case-mgmt/ARC-004-SECA-v1.0.md`

(The Write tool creates parent directories automatically and avoids the 32K output-token limit.) Do
**not** echo the full document into your response — it is large and only a summary should be printed.

### 9. Output summary

Print only a short summary (not the full document):

```markdown
## Security Evidence Document Generated

**Service:** [Name]
**Saved to:** `{path}/ARC-{PROJECT_ID}-SECA-v1.0.md`

### Certification Status

| Standard | Status | Expiry |
|----------|--------|--------|
| ISO 27001 | Current | Dec 2025 |
| Cyber Essentials Plus | Current | Sep 2024 |
| SOC 2 Type II | Current | Mar 2025 |

### NCSC Principles Coverage
- Principles addressed: 14/14
- Fully compliant: [X]
- Partially compliant: [X]
- Gaps identified: [X]

### Security Clearances
- SC Cleared: [X] staff
- DV Cleared: [X] staff

### Evidence Checklist
- [ ] ISO 27001 certificate uploaded
- [ ] Cyber Essentials certificate uploaded
- [ ] Pen test executive summary available
- [ ] Security clearance process documented

### Next Steps
- Produce a Data Protection Impact Assessment using ArcKit core: `/arckit:dpia`
- Validate security evidence as part of submission completeness: `/arckit:review`

### Items Requiring Attention
- [Any [PENDING] fields the user must supply]
- [If the service design or supplier profile was missing: run `/arckit:service-design` /
  `/arckit:supplier-profile` to enrich this security document]
```

## Important Notes

- ALL security assertions must be evidenceable.
- CCS conducts random audits — keep evidence current.
- Certificate expiry during the framework period requires an update.
- Pen-test reports should be executive summary only (not full findings).
- Security clearances are verified against government databases.
- ISO 27001 scope must cover the service being offered.
- This command never creates a project — if none is found, direct the user to `/arckit:service-design`.
- **Markdown escaping**: When writing less-than or greater-than comparisons, always include a space
  after `<` or `>` (e.g. `< 3 seconds`, `> 99.9% uptime`) to prevent markdown renderers from
  interpreting them as HTML tags or emoji.
