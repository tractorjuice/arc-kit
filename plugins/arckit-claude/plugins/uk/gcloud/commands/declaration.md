---
description: Prepare the G-Cloud 15 supplier declaration (Procurement Act 2023) for the supplier to confirm and sign
doc-type: DECL
effort: high
handoffs:
  - command: /arckit-uk-gcloud:review
    description: Validate the declaration as part of submission completeness
---

> ⚠️ **Community-contributed command** — part of the `arckit-uk-gcloud` overlay, not the
> officially-maintained ArcKit baseline. The supplier declaration is a **LEGAL DOCUMENT** for the
> G-Cloud 15 (RM1557.15) framework run by GCA (the Government Commercial Agency, formerly CCS): an
> incomplete, inaccurate or misleading answer can exclude the supplier. Output is **not** legal or
> procurement advice — the supplier answers every declaration, has it reviewed (by legal counsel
> where appropriate), and an authorised signatory confirms and signs it on the Digital Platform.

You are helping a cloud service supplier prepare the G-Cloud 15 (RM1557.15) supplier declaration.
G-Cloud 15 is run under the Procurement Act 2023: the supplier registers on the Central Digital
Platform (CDP), gets a PPON, and declares exclusion grounds in its CDP core supplier information. The
declaration on the Digital Platform then asks about those, plus parent companies, the tender
structure, subcontractors, legal capacity, supply chain payments, modern slavery, social value,
third-party help, contacts, connected persons and a signed confirmation.

The declaration is a **supplier-wide** artefact — it covers every lot and service the supplier bids
for, so it lives in `projects/000-global/supplier/` rather than under a per-service project.

**This is a legal declaration.** You prepare it; the supplier answers every declaration question and
signs it. Never answer a declaration on the user's behalf.

## User Input

```text
$ARGUMENTS
```

## Instructions

### 1. Load the supplier context

The declaration is global to the supplier, not tied to a numbered project. Make sure the directory
exists:

```bash
mkdir -p projects/000-global/supplier
ls projects/000-global/supplier/ 2>/dev/null
```

Use the **Read tool** on the highest version of each of these, where present:

- `projects/000-global/supplier/ARC-000-SUPP-v*.md` — the supplier profile. If it is missing, advise
  the user to run `/arckit-uk-gcloud:supplier-profile` first, then continue by gathering company information
  directly.
- `projects/000-global/supplier/ARC-000-DECL-v*.md` — an existing declaration. On a re-run, show the
  user which answers are confirmed and which are still `[PENDING]`, and update only what changes.
- `projects/000-global/supplier/ARC-000-SOCV-v*.md` — the social value document. The declaration only
  summarises it; if missing, note "Document missing".
- `projects/000-global/supplier/ARC-000-LOTQ-v*.md` — the lot questions document, whose Parts show
  the lot groups bid for.

Find the lots bid for from the service designs too: list the service projects and the lot each
one's latest SVCD records.

```bash
bash "${CLAUDE_PLUGIN_ROOT}/scripts/bash/list-projects.sh" --json
# service lots: keep identical in lot-questions.md and declaration.md
# Each service project, the G-Cloud 15 lot its latest service design records, and whether its
# SDD and security evidence exist. find, not a bare glob: zsh aborts a glob that matches nothing
find projects -mindepth 1 -maxdepth 1 -type d -name '[0-9][0-9][0-9]-*' ! -name '000-*' 2>/dev/null | sort | while IFS= read -r d; do
    svcd=$(find "$d" -maxdepth 1 -name 'ARC-*-SVCD-v*.md' 2>/dev/null | sort -V | tail -1)
    [ -n "$svcd" ] || continue
    line=$(grep -m1 '^\*\*G-Cloud Lot\*\*' "$svcd")
    lot=$(printf '%s' "$line" | sed 's/^\*\*G-Cloud Lot\*\*:[[:space:]]*//' | grep -oE '^(Lot[[:space:]]*)?[123][ab]?' | grep -oE '[123][ab]?$')
    case "$lot" in
        1a|1b|2a|2b|3) ;;
        *) lot="NOT A G-CLOUD 15 LOT (${line:-no G-Cloud Lot line}): re-run /arckit-uk-gcloud:service-design" ;;
    esac
    sdd=$(find "$d" -maxdepth 1 -name 'ARC-*-SDD-v*.md' 2>/dev/null | grep -q . && echo yes || echo MISSING)
    seca=$(find "$d" -maxdepth 1 -name 'ARC-*-SECA-v*.md' 2>/dev/null | grep -q . && echo yes || echo MISSING)
    printf '%s\t%s\tSDD=%s\tSECA=%s\n' "$d" "$lot" "$sdd" "$seca"
done
```

```bash
# A supplier profile written for the previous framework has no Central Digital Platform or PPON section
SUPP=$(find projects/000-global/supplier -maxdepth 1 -name 'ARC-000-SUPP-v*.md' 2>/dev/null | sort -V | tail -1)
if [ -n "$SUPP" ] && ! grep -qiE 'PPON|Central Digital Platform' "$SUPP"; then
    echo "PREVIOUS FRAMEWORK: $SUPP has no Central Digital Platform or PPON section"
fi
```

If it reports the profile as written for the previous framework, warn the user before going on:
G-Cloud 15 needs the PPON, the Central Digital Platform record and the certificates as they stand
now, and an older profile lacks them. Recommend re-running `/arckit-uk-gcloud:supplier-profile` to update it,
and ask whether to continue meanwhile; mark anything taken from the outdated parts as
`[PENDING: confirm for G-Cloud 15]`.

The lots bid for come from the LOTQ document's Parts and the service designs. A design marked
`NOT A G-CLOUD 15 LOT` (for example a G-Cloud 14 design with no `**G-Cloud Lot**` line, or one
saying `Lot 2`) belongs to no G-Cloud 15 lot: don't guess one. List it under "Items Requiring
Attention" and tell the user to re-run `/arckit-uk-gcloud:service-design` for it. The declaration is best
written after `/arckit-uk-gcloud:lot-questions`, which settles the lots bid for.

**Citation traceability**: When you draw facts from the supplier profile, from documents the user
has placed under `projects/000-global/supplier/` or an `external/` directory, or from any URL you
fetch (e.g. Companies House or a published Modern Slavery statement), follow the citation
instructions in `${CLAUDE_PLUGIN_ROOT}/references/citation-instructions.md`. Place inline citation
markers next to the facts they support and populate the **External References** section accordingly.
WebSearch alone (search without fetch) is exploratory and is not cited.

### 2. Read the questions and the template

Use the **Read tool** on GCA's declaration questions, in the export's order:

- `${CLAUDE_PLUGIN_ROOT}/skills/gcloud-framework/references/g-cloud-15/declaration.md`

Skip its social value sections (from `### Social Value: Section A` up to
`### Visibility of third party agents or bid writers`): `/arckit-uk-gcloud:social-value` owns them.

**Read the template** (user override takes precedence):

- **First**, check `.arckit/templates-custom/declaration-template.md`
- **Then**, `.arckit/templates/declaration-template.md`
- **Fallback**, `${CLAUDE_PLUGIN_ROOT}/templates/declaration-template.md`
- **Then read** `${CLAUDE_PLUGIN_ROOT}/templates/_partials/RENDERING.md` and resolve the `<!-- DOC-CONTROL-HEADER -->` marker in the template before writing. Do not hand-write the Document Control table: the partial `RENDERING.md` selects is the only source of the 14 standard fields and of the classification ladder. Default the Classification field to `${user_config.default_classification}` (fall back to `OFFICIAL` for UK Gov context if unavailable).

Use the export's wording for every question, its answer options, and its follow-up questions (shown
as "Then: … if answer is …").

### 3. Answer rules

- **The supplier answers every declaration.** These include: exclusion grounds and offences, the
  debarment list, legal capacity, the supply chain payment confirmations, modern slavery compliance,
  third-party help, the connected persons risk question, the confirmation, and the mandatory award
  question. Ask, and record exactly what the user says.
- **Never default an answer**, to "Yes" or to "No". A wrong "No" on an exclusion question is a false
  legal declaration; a wrong "Yes" on a pass/fail question is a false commitment. Anything the user
  hasn't answered is `[PENDING]`.
- **Factual fields** (names, addresses, registration numbers, DUNS, VAT, contacts) can be pre-filled
  from the supplier profile or public registers, then confirmed by the user. Never invent one.
- If the user's answer fails a pass/fail question, record it as given and tell them plainly what it
  means for the bid.
- The questions say "CCS"; they mean the Government Commercial Agency (GCA, formerly CCS).
- Ask questions following `${CLAUDE_PLUGIN_ROOT}/references/interview-pattern.md`: prefill from the
  supplier profile and arguments, and ask what remains in one **AskUserQuestion** call where the tool
  allows. Unlike the pattern's other questions, the declarations above have **no default**: an
  unanswered one stays `[PENDING]`, including in a headless run. Never block; write the document with
  the `[PENDING]` items listed.

### 4. Central Digital Platform first

Tell the user that the declaration depends on their CDP core supplier information, and that they
should complete and check it on the CDP (reached through Find a Tender) before answering Section 4.
Then ask, with **AskUserQuestion** (unless the supplier profile already records it):

```text
Where are you with the Central Digital Platform (CDP)?

1. Registered, supplier information complete — I have a PPON and a current share code
2. Registered, supplier information incomplete — I have a PPON but haven't finished my supplier information
3. Not registered yet
```

Ask for the PPON (12 characters with hyphens, for example `FWVS-3215-VJDX`) and the current share
code, unless the supplier profile already has them. Check the PPON's shape:

```bash
PPON="[PPON]"
printf '%s' "$PPON" | grep -Eiq '^[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$' && echo "PPON format OK" || echo "PPON format looks wrong: expected XXXX-XXXX-XXXX"
```

Remind the user that:

- the Digital Platform profile must agree with Companies House, D&B, the VAT register and the CDP;
- the CDP contact email and postal address are published in the contract award notice, so they must
  be generic, with no named individual;
- if their supplier information changes during the competition, they must tell GCA through the
  Digital Platform, update the CDP, and submit a new share code.

If CDP registration is incomplete, carry on with the other sections, and mark Section 4 and every
PPON or share code `[PENDING]`.

### 5. Work through the sections in order

**1–2. Ultimate and immediate parent companies.** Ask whether each exists. Pre-fill names, addresses,
registration numbers, DUNS and VAT numbers from the supplier profile, or from Companies House (use
**WebSearch**: `site:find-and-update.company-information.service.gov.uk [company name]`), and ask
the user to confirm.

**3. Tender information.** Ask: "Single Supplier" or "As part of a group or consortium". For a
consortium, ask which of the three joint venture or SPV statements applies, then follow the export's
branches:

- no SPV yet: the consortium's name and structure, whether the user is the lead bidder, and for each
  member its name, PPON, DUNS, share code, intended role (its part in delivery and its % share of the
  contract value), its Attachment 4b workbook, whether it is an associated person (and the technical
  elements relied on), whether it is on the debarment list, and whether it has declared offences;
- SPV already set up: confirmation that all SPV members are listed as connected persons on the CDP,
  and the PPON and share code of any connected person relied on for a condition of participation.

**4. Mandatory and discretionary exclusion grounds.** Show the question exactly as the export asks it:

> Have you or any of your connected persons declared in your core supplier information any offences listed as 'mandatory exclusion grounds' and 'discretionary exclusion grounds' in the Procurement Act 2023?

Explain that:

- the grounds themselves (Schedule 6 mandatory and Schedule 7 discretionary) are declared on the CDP,
  not in this declaration, so this answer has to match what the CDP holds;
- connected persons include persons with significant control, directors and shadow directors, parent
  and subsidiary undertakings, and certain predecessor companies;
- GCA checks the supplier and its connected persons, associated persons, consortium members and
  subcontractors against the debarment list, and considers whether the circumstances behind any
  ground are continuing or likely to occur again;
- if anything has been declared, the supplier should take legal advice and make sure its CDP
  information shows the steps taken to stop it happening again.

Then ask the user for their answer. Don't suggest one. Record the review checks (who reviewed the
CDP exclusions, connected persons and the debarment list, and when) only as the user reports them.

**5. Subcontractors.** Start from the supplier profile's subcontracting section. For each
subcontractor, collect every field the export asks for, including its type (SME, VCSE, supported
employment provider, public service mutual or none), and whether it is:

- a **key subcontractor**: relied on to deliver a whole work package, performing a critical role, or
  with a subcontract worth over 10% of the forecast call-off charges;
- an **associated person**: relied on to satisfy a condition of participation. It then needs a PPON
  and CDP share code of its own.

The published email and postal address must be generic.

**6. Legal capacity.** Ask the pass/fail UK GDPR question. Map the evidence the supplier could produce
on request to each measure in the guidance (for example records of processing, privacy notices, DPIAs
from `/arckit:dpia`, transfer safeguards, and security testing). A missing piece of evidence is
`[PENDING]`; the answer itself is the user's.

**7. Payments in contracts above £5m per annum.** Ask whether the supplier intends to use a supply
chain. If it does:

- ask the three pass/fail confirmations;
- collect the payment figures for the two most recent six-month reporting periods;
- check each period's three percentages are whole numbers totalling 100, and add "within 30 days" and
  "31 to 60 days" to give the share paid within 60 days;
- state which pass route the figures meet, or which fail condition they fall into. Passing needs, in
  at least one of the two periods, 95% or more paid within 60 days with average payment days of 55 or
  less in the same period; or 90% to under 95% with an action plan. A new entrant trading under 12
  months can explain instead;
- if an action plan is needed, list what it must contain.

**8. Modern slavery.** Use the supplier profile's turnover and statement details. Ask whether the
supplier is a relevant commercial organisation (a turnover of £36m or more, and business carried on
in the UK) and, if not, whether its turnover is £36m or more. If a statement URL exists, read it with
**WebFetch** and report which of the required elements (a) to (f) it visibly covers. The compliance
answers stay the user's.

**9. Social value.** Don't ask the social value questions here. If the SOCV document exists, summarise
it in the table: Section A answers, the number of measures and missions, the Social Value Contact,
and the Operational Readiness answers. If it is missing, record "Document missing" and tell the user
to run `/arckit-uk-gcloud:social-value`.

**10. Visibility of third party agents or bid writers.** Show the question and its follow-ups exactly
as the export asks them:

> Have you engaged the services of a third party or agent in the preparation of your bid?
> If Yes: the third party agent or bid writer's organisation name; confirm full visibility of the ITT, tender notice, tender documents and terms; confirm full visibility of the content of your submitted tender; confirm you have authorised the person who will sign the declaration.

Tell the user:

- Attachment 2 makes the supplier responsible for the acts of any third parties, "including but not
  limited to professional advisors, agents, consultants and bid writers";
- if a bid-writing agency or consultant helped, or an AI drafting tool such as ArcKit was used to
  prepare answers, that may be relevant to this question;
- **they must decide and answer it themselves.** If unsure, they can ask GCA a clarification
  question through the Digital Platform.

Don't recommend an answer. Record the user's answer if they give one; otherwise leave it
`[PENDING — the supplier decides and answers this]`.

**11. Framework award form details.** Collect the name, job title, email and phone number of the
framework manager, authorised representative, compliance officer, data protection officer and
marketing contact. Pre-fill them from the profile's contacts and ask the user to confirm. Also record
any commercially sensitive information, with its date, details and how long it stays confidential.

**12. Connected persons.** Explain that the contract award notice publishes connected persons' details
from the CDP, which can include name, date of birth, nationality and service address. Ask whether
disclosure would put any of them, or anyone living with them, at risk. If it would, record each name
exactly as submitted on the CDP.

**13. Confirmation.** Show the confirmation statement. Never tick it: the signatory confirms it on the
Digital Platform, where entering their name is an electronic signature with the same legal effect as
a handwritten one. Record the signatory's name, role, phone, email and postal address.

**14. Mandatory award question.** Ask, quoting the export, whether the supplier will deliver in full
all mandatory service requirements in Framework Schedule 1 (Specification) for each lot it tenders
for. It is pass/fail.

**Evidence at framework award (not a declaration question).** Fill the template's "Evidence at
Framework Award" section so the supplier knows what GCA asks for after evaluation (Attachment 2
v5.0). It must be sent by the date in the assessment summary, or GCA may withdraw the offer of a
framework contract:

| Insurance | Lots 1a, 2a, 2b and 3 | Lot 1b |
|-----------|-----------------------|--------|
| Employer's (compulsory) liability | £5,000,000 | £5,000,000 |
| Public liability | £1,000,000 minimum | £20,000,000 |
| Professional indemnity | £1,000,000 | £50,000,000 |

- **Certificates:** for Lots 1a/1b, ISO 9001, 20000-1 and 27001, plus ISO 14001 and 27017 (and ISO
  27018 where the services include public cloud) unless the supplier resells and relies on its
  provider's accreditations. Cyber Essentials Plus (Lots 1a/1b) and Cyber Essentials (Lots 2a, 2b
  and 3) are mandatory for call-off contracts, not for the bid. The details are in
  `/arckit-uk-gcloud:lot-questions`.
- Compare the supplier profile's insurance with the levels for the lots bid for, and list any
  shortfall or expiry before award under "Items Requiring Attention". Never assume cover the profile
  doesn't record.
- Award is conditional on valid certificates and proof wherever the supplier self-certified (from
  every member, for a consortium without an SPV). The framework contract is signed through DocuSign
  within 8 working days.

### 6. Generate the declaration

Populate the template in the export's section order, delete the branches that don't apply (for
example the consortium tables for a single supplier), and list every `[PENDING]` item and every
answer that would fail under "Items Requiring Attention". Fill the **G-Cloud Details** table
(supplier, lots bid for, PPON, signatory).

Generate the document ID with the ArcKit helper (DECL is single-instance):

```bash
node "${CLAUDE_PLUGIN_ROOT}/scripts/generate-document-id.mjs" 000 DECL --filename
```

This returns `ARC-000-DECL-v1.0.md`. If a declaration already exists, increment its version instead
and add a Revision History row saying what changed; never silently overwrite the previous version.

Before writing, read `${CLAUDE_PLUGIN_ROOT}/references/quality-checklist.md` and verify all **Common Checks** plus the **DECL** per-type checks pass. Fix any failures before proceeding.

Use the **Write tool** to save the declaration to:

`projects/000-global/supplier/ARC-000-DECL-v{VERSION}.md`

Do **not** echo the full document into your response; print only the checklist and summary below.

Append the standard ArcKit Document Control footer at the end of the document:

```markdown
---

**Generated by**: ArcKit `/arckit-uk-gcloud:declaration` command
**Generated on**: [DATE]
**ArcKit Version**: [VERSION]
**Project**: Supplier-wide (000-global)
**Model**: [AI_MODEL]
```

### 7. Verification checklist

Show the supplier this checklist after generating:

```markdown
## Declaration Verification Checklist

### Central Digital Platform
- [ ] Core supplier information complete and accurate, including connected persons and exclusions
- [ ] PPON and current share code recorded; Digital Platform profile matches Companies House, D&B, VAT register and CDP
- [ ] CDP contact email and postal address are generic

### Exclusions and Debarment
- [ ] Exclusion answer matches what the CDP supplier information declares
- [ ] Connected persons, associated persons, consortium members and subcontractors checked against the debarment list
- [ ] Legal advice taken if any ground applies

### Conditions of Participation
- [ ] Legal capacity (UK GDPR) evidence ready to produce on request
- [ ] Supply chain payment figures checked against finance records, and an action plan if one is needed
- [ ] Modern slavery statement covers elements (a) to (f), if required

### Other Sections
- [ ] Social value document complete (`/arckit-uk-gcloud:social-value`)
- [ ] Third-party agents or bid writers question decided and answered by the supplier
- [ ] Framework award form contacts confirmed
- [ ] Connected persons risk question answered

### Evidence at Framework Award
- [ ] Insurance meets the levels for the lots bid for (Lot 1b's are higher), with certificates ready
- [ ] Certificates for each lot ready to send by the date in the assessment summary

### Sign-off
- [ ] No `[PENDING]` answers remain
- [ ] Legal review done; authorised signatory identified
- [ ] Process in place to tell GCA, update the CDP and resubmit a share code if anything changes
```

### 8. Summary

Report what the document actually says, not what a compliant declaration would say:

```markdown
## Supplier Declaration Prepared

**Supplier:** [Company Name]
**PPON:** [PPON or PENDING]
**Saved to:** `projects/000-global/supplier/ARC-000-DECL-v{VERSION}.md`

### Section Status
- Central Digital Platform: [registered and complete / incomplete / not registered]
- Parent companies: [ultimate: name or none or PENDING; immediate: name or none or PENDING]
- Tender: [single supplier / consortium with N members / PENDING]
- Exclusion grounds: [the supplier's answer, or PENDING]
- Subcontractors: [none / N, of which N key and N associated persons / PENDING]
- Legal capacity: [answer]
- Supply chain payments: [not using a supply chain / figures meet route X / figures fail: reason / PENDING]
- Modern slavery: [route and answer, or not required, or PENDING]
- Social value: [summary from the SOCV document / document missing]
- Third-party agents or bid writers: [the supplier's answer, or PENDING]
- Award form contacts: [N of 5 complete]
- Connected persons at risk: [answer]
- Confirmation: [signatory recorded: Name, Role / PENDING] (confirmed and signed on the Digital Platform, not here)
- Mandatory award question: [answer]
- Evidence at framework award: insurance [meets the levels for lots X / shortfall: details / PENDING]; certificates [ready / missing: list]

### Would Fail as Written
- [Each pass/fail answer that would fail, with its consequence, or "None among the answers given"]

### Items Requiring Attention
- [Each `[PENDING]` question, with what is needed to answer it, or "None"]

### Required Actions
1. Complete and check the CDP supplier information if it isn't already
2. Legal review before submission
3. The authorised signatory confirms and signs on the Digital Platform
```

## Important Notes

- The declaration is a legal document. The confirmation accepts that the supplier may be excluded if
  any answer is incomplete, inaccurate or misleading.
- It covers every lot the supplier bids for. The lot-specific conditions of participation
  (certificates, Carbon Reduction Plan, Cyber Essentials) are in `/arckit-uk-gcloud:lot-questions`, and the
  social value questions in `/arckit-uk-gcloud:social-value`.
- Changed from G-Cloud 14: the declaration no longer lists the Public Contracts Regulations 2015
  exclusion grounds, or asks about insurance, service types or reselling. Exclusion grounds are
  declared on the CDP under Schedules 6 and 7 of the Procurement Act 2023. Insurance is now evidence
  GCA asks for at framework award (above), and buyers may set their own requirements at call-off.
- Keep the CDP information up to date for the life of the framework, and tell GCA through the
  Digital Platform when anything changes.
- The declaration is supplier-wide and lives in `projects/000-global/supplier/`, never under a
  per-service project directory.
- **Markdown escaping**: When writing less-than or greater-than comparisons, always include a space
  after `<` or `>` (e.g. `< 30 days`, `> £5m`) to prevent markdown renderers from interpreting them as
  HTML tags or emoji.
