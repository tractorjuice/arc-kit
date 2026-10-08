---
description: Generate the G-Cloud 15 security answers and evidence document for a service, by lot, mapped to the NCSC cloud security principles
doc-type: SECA
effort: high
handoffs:
  - command: /arckit-uk-gcloud:lot-questions
    description: Answer the lot's certification questions and award criteria
  - command: /arckit:dpia
    description: Produce a Data Protection Impact Assessment using ArcKit core
  - command: /arckit-uk-gcloud:review
    description: Validate security evidence as part of submission completeness
---

> ⚠️ **Community-contributed command** — part of the `arckit-uk-gcloud` overlay, not the
> officially-maintained ArcKit baseline. The security document produced here is an internal
> planning aid for a G-Cloud 15 (RM1557.15) Digital Marketplace service; it is **not** legal or
> procurement advice. **Every security answer is published on the listing and must be
> evidenceable** — GCA (the Government Commercial Agency, formerly CCS) and buyers can ask for
> proof — so verify every claim against the underlying evidence (certificates, penetration-test
> reports, clearance records) before submission.

You are helping a cloud service supplier document the security of one **G-Cloud 15 (RM1557.15)**
service: the answers to the security sections of its lot's service questions, the certifications
the lot requires, and the evidence behind every claim, mapped to the **NCSC cloud security
principles**. Build the document for the service's lot only.

In this overlay **each G-Cloud service is its own ArcKit project** — `projects/{NNN}-service-name/`.
This command does **not** create a new project: the service project was created earlier by
`/arckit-uk-gcloud:service-design`. This command **resolves the existing service project** and writes the
security document into it.

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
must run `/arckit-uk-gcloud:service-design` first to create it, then **stop** (do not create a project here).

From the matched project record extract:

- `path` — the service project directory (e.g. `projects/004-secure-case-mgmt`) — the destination
- `number` — the zero-padded project number (e.g. `004`) — use as `PROJECT_ID`
- `name` — the project / service name

### 2. Read the existing context and find the lot

Use the **Read tool** on the highest version of each of these that exists:

- Supplier profile (supplier-wide): `projects/000-global/supplier/ARC-000-SUPP-v*.md`
- Service design: `{path}/ARC-{PROJECT_ID}-SVCD-v*.md`
- Service Definition Document: `{path}/ARC-{PROJECT_ID}-SDD-v*.md` — it carries the same security
  answers; this document must agree with it
- Lot questions (supplier-wide): `projects/000-global/supplier/ARC-000-LOTQ-v*.md` — certifications
  and award-criteria answers given at lot level, in the Part for this service's lot group
- Existing security document (on a re-run): `{path}/ARC-{PROJECT_ID}-SECA-v*.md`

If the supplier profile or service design is missing, warn the user that running
`/arckit-uk-gcloud:supplier-profile` and `/arckit-uk-gcloud:service-design` first produces a consistent document, then
continue with what is available.

**Find the lot.** The service design records it on its `**G-Cloud Lot**: Lot <code> — <name>` line:
`1a`, `1b`, `2a`, `2b` or `3`. The lot group for the lot questions is Part 1 (Lots 1a/1b), Part 2
(Lots 2a/2b) or Part 3 (Lot 3).

- A service design from the previous framework has a "1.3 Target Lot" checkbox instead. Old Lot 3
  (Cloud Support) is Lot 3: continue, and suggest re-running `/arckit-uk-gcloud:service-design` so the design
  records the G-Cloud 15 lot. Old Lot 1 (Cloud Hosting) or Lot 2 (Cloud Software) each became two
  lots: ask with **AskUserQuestion** whether it is 1a or 1b, or 2a or 2b.
- If no lot is recorded at all, ask which G-Cloud 15 lot the service is in, and recommend re-running
  `/arckit-uk-gcloud:service-design` so the design records it.

**Agree with the SDD.** The SDD answers the same security questions, and both feed the listing. If
an SDD exists, start from its answers and add the evidence for each. Where the supplier now gives a
different answer, write the new one here and list the mismatch in the summary so the SDD is updated
too. Never let the two silently disagree. If there is no SDD yet, this document becomes the source
the SDD takes its security answers from.

**Agree with the lot questions.** On Lots 2a/2b and 3, some lot-level award criteria repeat service
answers (Step 6 below). If the LOTQ document has the Part for this lot group, its answers and this
document's must match.

**Re-runs.** If a security document already exists, start from it: keep confirmed answers and
evidence, fill in `[PENDING]` items you can now answer, increment the version and add a Revision
History row saying what changed. Don't silently overwrite it.

### 3. Read the template and the lot's questions

Read the template (user override takes precedence):

- **First**, check `.arckit/templates-custom/security-template.md`
- **Then**, `.arckit/templates/security-template.md`
- **Fallback**, `${CLAUDE_PLUGIN_ROOT}/templates/security-template.md`
- **Then read** `${CLAUDE_PLUGIN_ROOT}/templates/_partials/RENDERING.md` and resolve the `<!-- DOC-CONTROL-HEADER -->` marker in the template before writing. Do not hand-write the Document Control table: the partial `RENDERING.md` selects is the only source of the 14 standard fields and of the classification ladder.

Default the Classification field to `${user_config.default_classification}` (fall back to `OFFICIAL`
for UK Gov context if unavailable).

Then read this lot's security sections and certification questions from GCA's question export
(substitute the lot code and lot group number):

```bash
REF="${CLAUDE_PLUGIN_ROOT}/skills/gcloud-framework/references/g-cloud-15"

# This lot's security sections, with every answer option (LOT = 1a, 1b, 2a, 2b or 3)
awk '/^### /{ keep = ($0 ~ /^### (Data-in-transit protection|Asset protection|Availability and resilience|Separation between users|Governance|Operational security|Staff security|Secure development|Identity and authentication|Audit information for users)$/) } keep' \
    "$REF/lot-{LOT}-services.md"

# This lot's certification questions and award criteria (GROUP = 1, 2 or 3)
awk '/^### /{ keep = ($0 ~ /^### (Cyber Essentials|Non-mandatory Standards and certifications|Mandatory award criteria.*|Non-scored mandatory questions)$/) } keep' \
    "$REF/lot-{GROUP}-lot-questions.md"
```

Also use the **Read tool** on
`${CLAUDE_PLUGIN_ROOT}/skills/cloud-security/references/compliance-frameworks.md` for certification
detail, evidence guidance and clearances.

Answer every question with the options as the template words them: the live listings' wording, which
buyers see. Where the Digital Platform words an option differently, the SDD template gives its
wording in a comment, so the supplier ticks the right option when entering it. Where a question says
"Then: ..." it opens a follow-up only for the answers named.

**Citation traceability**: When you fetch a supplier page or a G-Cloud listing, or read any document
the user has placed under the project's `external/`, `policies/`, or `vendors/` directories, follow
the citation instructions in `${CLAUDE_PLUGIN_ROOT}/references/citation-instructions.md`. Place
inline citation markers (e.g. `[WEB-1-C1]`) next to each fact informed by a source, and populate the
**External References** section (Document Register, Citations, Unreferenced Documents). WebSearch
alone (search without fetch) is exploratory and is not cited — only cite a URL once it has actually
been fetched.

### 4. Security sections by lot

| Section | 1a/1b | 2a/2b | 3 | NCSC cloud security principle |
|---------|:-----:|:-----:|:-:|-------------------------------|
| Data-in-transit protection | ✓ | ✓ | | 1 Data in transit protection |
| Asset protection | ✓ | ✓ | | 2 Asset protection and resilience |
| Availability and resilience | ✓ | ✓ | | 2 Asset protection and resilience |
| Separation between users | ✓ | | | 3 Separation between customers |
| Governance | ✓ | ✓ | | 4 Governance framework |
| Operational security | ✓ | ✓ | | 5 Operational security |
| Staff security | ✓ | ✓ | ✓ | 6 Personnel security |
| Secure development | ✓ | ✓ | | 7 Secure development |
| Identity and authentication | ✓ | ✓ | | 9 Secure user management, 10 Identity and authentication, 12 Secure service administration |
| Audit information for users | ✓ | ✓ | | 13 Audit information and alerting for customers |

What is new or different on G-Cloud 15:

- **Post-quantum cryptography** (Operational security, Lots 1a/1b and 2a/2b): "Are you compliant
  with NCSC guidance on post-quantum cryptography?" Framework Schedule 1 also requires Lots 1a/1b to
  commit to moving to a post-quantum standard. Evidence is a migration plan set against NCSC's
  timelines: discovery and a plan by 2028, priority migrations by 2031, complete by 2035. Answer Yes
  only if that plan exists.
- **Software Security Code of Practice** (Governance, Lots 2a/2b only): whether the organisation
  complies with the recommendations of the DSIT/NCSC code. Evidence is a dated self-assessment
  against the code. Don't answer Yes on the strength of ISO 27001 alone.
- **AI chatbot and FOCUS** are asked elsewhere in the service questions (user support; analytics), so
  the SDD records them. Where the lot commits to the FinOps FOCUS standard (1a/1b, 2a/2b), record the
  commitment in §4.1.
- **Staff security**: screening to BS7858:2019 or not, and the government clearance level you're
  prepared to provide. **Lot 1b offers only "Developed Vetting (DV)" or "Security Clearance (SC)"**
  (on the Digital Platform, "Up to …").
- **Separation between users** (virtualisation) and **Devices users manage the service through** are
  asked on Lots 1a/1b only.
- **Lot 3** asks no security sections except Staff security. Its document is short: staff security,
  certifications (§4), award criteria (§6) and the evidence register.

Principles 8 (supply chain security), 11 (external interface protection) and 14 (secure use of the
service) are not service questions. Cover them in the coverage table with a short supporting
statement where the lot asks for NCSC assurance. Lots 1a/1b must confirm in the lot questions that
they adhere to NCSC guidance, including the cloud security principles, supply chain security and
risk management, and buyers may test it. For 2a/2b and 3 the statement is optional supporting
material.

### 5. Certification requirements by lot

**Lots 1a and 1b**: conditions of participation (Attachment 2, as amended by GCA's Updates to Tender
Documents) and Framework Schedule 1:

| Requirement | Detail |
|-------------|--------|
| Cyber Essentials Plus | Awarded by an IASME-approved body in the last 12 months, or one of the export's alternatives: working towards it and certified by the date of framework award, or an IASME-certified equivalent. Mandatory for every 1a/1b call-off contract (Framework Schedule 1 v2.1), not a condition of the bid: Attachment 2 doesn't mark it mandatory for the tender. If it isn't held, it is a call-off warning |
| ISO 9001, ISO/IEC 20000-1, ISO/IEC 27001 | Mandatory |
| ISO 14001, ISO/IEC 27017 | Mandatory unless you resell and rely on the cloud service provider's accreditations |
| ISO/IEC 27018 | Mandatory on Lots 1a **and** 1b if the service is offered on the public cloud deployment model, unless you rely on the provider's. Not needed for private-cloud-only services. The question export still words this as a Lot 1b requirement; GCA's Updates to Tender Documents changed it |
| Certificate uploads | The certificate, or evidence that accreditation has been started; with neither, the tender is disregarded |
| Commitments | Post-quantum cryptography migration; NCSC cloud security principles; Security Policy Framework and Government Security Classifications policy; FinOps FOCUS standard |
| Carbon Reduction Plan | A condition of participation, handled by `/arckit-uk-gcloud:lot-questions` |

**Lot 1b also needs** an accredited secure facility under Facility Security Clearance policy within 6
months of the framework start. It also needs enough staff security cleared to an appropriate level,
acceptance of Security Aspects Letters, compliance with UK embargo policies, and NCSC supply chain
security principles applied.

**Lots 2a, 2b and 3**: **Cyber Essentials is mandatory** for every call-off. Framework Schedule 1
and GCA's Updates to Tender Documents say so, and Call-Off Schedule 27 is used on every call-off. At
the bid it is not a condition: the lot questions ask for it among the "non-mandatory standards",
Attachment 2 v5.0 lists no mandatory certificate for these lots, and 769 Lot 2b and 1,977 Lot 3
listings are live with "Cyber essentials: No" and "None of the criteria". The live listings word the
alternatives "within 12 months of the date of award" (the export says "by the date of framework
award"). Record it as required for call-offs, and report a missing certificate as a call-off
warning, not a bid failure. Lots 2a/2b also commit to adopting the FOCUS standard.

**Other standards the lot questions ask** (none of them mandatory):

| Lots | Standards |
|------|-----------|
| 1a/1b | ISO 28000:2022 (supply chain security), quality management system (QMS), CSA STAR (Level 1 Self-Assessment or Level 2 Attestation), PCI DSS, other security certifications |
| 2a/2b and 3 | ISO/IEC 27001, ISO 28000:2022, ISO 9001 (2015 or later), QMS, CSA STAR, PCI DSS, Cyber Essentials Plus, other security certifications |

For each, record who accredited it, when, and what it doesn't cover. Those are the export's
follow-up questions. An ISO/IEC 27001:2013 certificate can no longer be current, because the
transition to the 2022 edition ended on 31 October 2025. Query any certificate that says 2013.

All lots also need a Technical Ability Certificate. That is a contract-experience condition handled
by `/arckit-uk-gcloud:lot-questions`, not a security certificate.

### 6. Lot award criteria that repeat security answers

On Lots 2a/2b and 3, four mandatory award criteria are scored at 2.5% each. GCA requires their
answers to be "in accordance with" the service questions, so the lot answer and the service answer
must agree. Show the mark each answer earns:

| Lot | Criterion | Marks (Attachment 2d) |
|-----|-----------|-----------------------|
| 2a/2b | Where service user data is stored and processed | UK 100, EEA 66, other 33, not known 0 |
| 2a/2b | Penetration testing frequency | At least every 6 months 100, at least once a year 66, less than once a year 33, none 0 |
| 2a/2b | Industry standard data sanitisation process | Yes 100, No 0 |
| 3 | Staff security clearance checks | BS7858:2019 screening 100, screening not to BS7858 50, none 0 |
| 3 | Clearance level prepared to provide if a buyer requires it | DV 100, SC 66, BPSS 33, none 0 |
| 3 | Prepared to hold Cyber Essentials (or equivalent or higher) if a buyer requires it | Yes 100, No 0 |

The fourth criterion on each lot is user support, which the SDD covers. A tender marking under 33 on
all four is disqualified (Attachment 2d v4.0 and Attachment 2 v5.0); a single zero loses that
criterion's 2.5%. `/arckit-uk-gcloud:lot-questions` states the same rule. Never raise an answer to earn a mark
the supplier can't evidence: the mark
comes from the claim, but buyers can test the claim.

### 7. Evidence

Build the evidence register from the supplier profile and the user's answers.

- **Provide:** certificates whose scope covers this service; certificate numbers (Cyber Essentials
  numbers look like `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`); CSA STAR registry links; a PCI DSS
  Attestation of Compliance; a penetration test executive summary or letter of attestation, on
  request. Uploads must be ODF or PDF/A and at most 5 MB.
- **Don't provide:** full audit reports, penetration test findings, vulnerability data, internal
  policy documents, staff names or clearance records, or unredacted contracts. "Approach to
  resilience" may say details are available on request.
- **Check scope and dates:** a certificate whose scope excludes the service evidences nothing for
  it. Flag any certificate expiring within 90 days. Cyber Essentials and Cyber Essentials Plus last
  12 months, so they need renewing every year of the framework.
- **Clearances:** BPSS has no fixed expiry (it holds while the person stays with the employer that
  ran it; a new employer re-runs it); SC is reviewed at 10 years and DV at 7.

**Never assert what isn't evidenced.** If the supplier profile and the user don't confirm a
certification, test, control or answer, write it as `[PENDING]`; don't describe it as in place, and
never record a certificate as held without evidence. Mark a principle "Evidenced" only when every
answer under it has evidence. Ask for missing answers in one AskUserQuestion call, following
`${CLAUDE_PLUGIN_ROOT}/references/interview-pattern.md`; a certification or clearance answer the user
doesn't give stays `[PENDING]` — it has no default.

### 8. Determine the output filename

`SECA` is a **single-instance** doc-type per service project. Generate the document ID and filename
with the ArcKit helper (no `--next-num` — SECA is not multi-instance):

```bash
node "${CLAUDE_PLUGIN_ROOT}/scripts/generate-document-id.mjs" \
     {PROJECT_ID} SECA --filename
```

This returns `ARC-{NNN}-SECA-v1.0.md` (using the zero-padded project number from Step 1). Use the
returned filename and take the version from it. If the service already has a security document,
increment the version instead and add a Revision History row.

### 9. Populate the template

Keep only the sections the template's lot profile (§1) marks for this lot; delete the others. For
Lot 3 that leaves staff security (§2.7), the coverage table with most principles marked "Not asked
for this lot", certifications, award criteria, testing if the supplier has any, and the evidence
register. Fill the `**G-Cloud Lot**` line with the service's lot exactly as the service design
records it. List every `[PENDING]` item and gap in §8 Items Requiring Attention. Pen-test references
are executive-summary level only. Where a fact came from a fetched source, attach the inline citation
marker (see Step 3).

Populate the Document Control header (Document ID = `ARC-{PROJECT_ID}-SECA-v{VERSION}`) and Revision
History, and append the standard ArcKit footer:

```markdown
---

**Generated by**: ArcKit `/arckit-uk-gcloud:security` command
**Generated on**: [DATE]
**ArcKit Version**: [VERSION]
**Project**: [PROJECT_NAME] (Project [PROJECT_ID])
**Model**: [AI_MODEL]
```

### 10. Write the security document

Before writing, read `${CLAUDE_PLUGIN_ROOT}/references/quality-checklist.md` and verify all **Common Checks** plus the **SECA** per-type checks pass. Fix any failures before proceeding.

Use the **Write tool** to save the completed document to:

`{path}/{filename}` — e.g. `projects/004-secure-case-mgmt/ARC-004-SECA-v1.0.md`

(The Write tool creates parent directories automatically and avoids the 32K output-token limit.) Do
**not** echo the full document into your response — print only the summary below.

### 11. Output summary

Report what the document actually contains:

```markdown
## Security Evidence Document Generated

**Service:** [Name]
**Lot:** Lot [1a / 1b / 2a / 2b / 3] — [Lot name]
**Saved to:** `{path}/ARC-{PROJECT_ID}-SECA-v[X.Y].md`

### Required Certifications for This Lot

| Standard | Status | Expiry |
|----------|--------|--------|
| [Each standard Step 5 lists as required for this lot] | [Held / Working towards / Not held / PENDING] | [DATE] |

[Flag any certificate expiring within 90 days, and any required standard not held.]

### Service Security Answers
- Sections answered: [X] of [X] for Lot [lot]
- New G-Cloud 15 questions: post-quantum cryptography [answer / not asked]; Software Security Code of Practice [answer / not asked]
- Staff screening: [answer]; clearance prepared to provide: [answer]

### NCSC Principles
- Evidenced: [X]; partly evidenced: [X]; gaps: [X]; not asked for this lot: [X]

### Award Criteria (Lots 2a/2b and 3)
- [Each criterion: answer and mark; whether it matches the LOTQ Part, or "lot questions not written yet"]

### Items Requiring Attention
- [Each `[PENDING]` item, gap and SDD or lot-questions mismatch, with the evidence or decision needed, or "None"]

### Next Steps
1. Gather the evidence files listed in the register
2. Re-run the SDD command if any security answer here differs from the SDD
3. `/arckit-uk-gcloud:lot-questions` for the lot's certificates and award criteria, if not done
4. `/arckit:dpia` if the service processes personal data
5. `/arckit-uk-gcloud:review [service]`
```

## Important Notes

- Every answer is published on the listing and every assertion must be evidenceable. GCA (formerly
  CCS) and buyers can ask for proof.
- Cyber Essentials Plus is mandatory for every Lot 1a/1b call-off, and Cyber Essentials for every
  Lot 2a/2b and Lot 3 call-off. Neither is a condition of the bid, but without a current certificate
  the supplier can't be awarded a call-off, and a lapsed one puts call-offs at risk.
- Lot 1b offers only SC or DV clearance, needs an accredited secure facility within 6 months of the
  framework start, and publishes nothing publicly.
- Certificates must cover the service being offered. Check the scope statement, not just the
  certificate's existence.
- Sources: GCA's question export, Framework Schedule 1 (Specification) v2.1, Attachment 2 (How to
  tender) v5.0, Attachment 2d (Quality questionnaire) v4.0 and Updates to Tender Documents, at
  <https://www.gca.gov.uk/rm1557-15-g-cloud-15-tender-documents>.
- This command never creates a project — if none is found, direct the user to `/arckit-uk-gcloud:service-design`.
- **Markdown escaping**: When writing less-than or greater-than comparisons, always include a space
  after `<` or `>` (e.g. `< 3 seconds`, `> 99.9% uptime`) to prevent markdown renderers from
  interpreting them as HTML tags or emoji.
