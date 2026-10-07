---
description: Answer the G-Cloud 15 lot questions for each lot group bid for (conditions of participation, scored quality answers, award criteria, standards)
doc-type: LOTQ
effort: max
handoffs:
  - command: /arckit-uk-gcloud:declaration
    description: Prepare the supplier declaration once the lot questions are answered
  - command: /arckit-uk-gcloud:service-design
    description: Design a service in a lot group that has no service yet
---

> ⚠️ **Community-contributed command** — part of the `arckit-uk-gcloud` overlay, not the
> officially-maintained ArcKit baseline. The lot questions prepared here are answered on GCA's
> Digital Platform for G-Cloud 15 (RM1557.15); GCA is the Government Commercial Agency, formerly CCS.
> They include pass/fail conditions of participation and scored quality answers that an assessor
> holds the supplier to. Output is **not** legal or procurement advice — the supplier confirms every
> declaration and every claim before submitting.

You are helping a cloud service supplier answer the G-Cloud 15 (RM1557.15) lot questions. These are
answered once per supplier for each lot group, separately from the per-service SDDs, and they carry
most of the quality score:

| Lot group | Part of the LOTQ document | What the lot questions decide |
|-----------|---------------------------|-------------------------------|
| Lots 1a and 1b (IaaS and PaaS) | Part 1 | Conditions of participation (pass/fail), two written quality questions worth 40% each, non-scored mandatory questions, standards |
| Lots 2a and 2b (iSaaS and SaaS) | Part 2 | Four mandatory award criteria worth 2.5% each, Cyber Essentials (mandatory for call-offs), other standards |
| Lot 3 (Cloud Support) | Part 3 | Four mandatory award criteria worth 2.5% each, Cyber Essentials (mandatory for call-offs), other standards |

The lot questions are a **supplier-wide** artefact: one document,
`projects/000-global/supplier/ARC-000-LOTQ-v{VERSION}.md`, holding one Part per lot group the
supplier bids for. A re-run for another lot group adds its Part and bumps the version.

Where GCA's later tender documents (Updates to Tender Documents, Framework Schedule 1 v2.1,
Attachment 2 v5.0) differ from the question export, they win. Two changes matter here: ISO 27018 is
required for Lots 1a and 1b whenever the services include public cloud, and Cyber Essentials is
mandatory for call-off contracts under Lots 2a, 2b and 3. Cyber Essentials and Cyber Essentials Plus
are call-off requirements, not conditions of the bid: a missing certificate is a call-off warning,
never "would fail".

Social value (10% on every lot) is answered by `/arckit-uk-gcloud:social-value`, and price by `/arckit-uk-gcloud:pricing`.

## User Input

```text
$ARGUMENTS
```

## Instructions

### 1. Load the supplier context

```bash
mkdir -p projects/000-global/supplier
ls projects/000-global/supplier/ 2>/dev/null
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

Use the **Read tool** on the highest version of:

- `projects/000-global/supplier/ARC-000-SUPP-v*.md` — the supplier profile. If it is missing, tell
  the user to run `/arckit-uk-gcloud:supplier-profile` first, then continue with what they give you.
- `projects/000-global/supplier/ARC-000-LOTQ-v*.md` — an existing lot questions document. On a
  re-run, keep confirmed answers and update only what changed.
- `projects/000-global/supplier/ARC-000-SOCV-v*.md` — only to report social value status in the
  quality score tables; never duplicate its answers here. If missing, note it.

**Designs from the previous framework.** A design marked `NOT A G-CLOUD 15 LOT` records no lot this
command can place: a G-Cloud 14 design has no `**G-Cloud Lot**` line, only a "1.3 Target Lot"
checkbox, and an old "Lot 2" (or "Lot 1", "Cloud Software", "Cloud Hosting") could be 2a or 2b, or
1a or 1b. Don't guess. List each one, tell the user to re-run `/arckit-uk-gcloud:service-design` for it so the
design records a G-Cloud 15 lot, and leave it out of every lot group until then.

**Write the lot questions after the SDDs.** The Lot 2a/2b and Lot 3 award criteria repeat each
service's user support, data location, penetration testing, data sanitisation and staff security
answers, and must agree with every service in the lot group; the Lot 1a/1b quality answers draw on
the same SDDs and security documents. If a service in a group shows `SDD=MISSING` (or
`SECA=MISSING`), say so and recommend running its SDD command (and `/arckit-uk-gcloud:security`) first. Go on
only if the user wants a first draft now, and mark every answer that rests on a design alone as
`[PENDING: check against the SDD]`.

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

**Citation traceability**: When you fetch a URL (for example a published Carbon Reduction Plan), or
read a document the user has placed under `projects/000-global/supplier/` or an `external/`
directory, follow the citation instructions in
`${CLAUDE_PLUGIN_ROOT}/references/citation-instructions.md`. Place inline citation markers next to the
facts they support and populate the **External References** section (Document Register, Citations,
Unreferenced Documents). WebSearch alone (search without fetch) is exploratory and is not cited.

### 2. Choose the lot groups

Follow `${CLAUDE_PLUGIN_ROOT}/references/interview-pattern.md`: prefill, then ask what remains in one
**AskUserQuestion** call.

**$ARGUMENTS bypass:** map anything in `$ARGUMENTS` to lot groups and skip the question:

| Argument | Lot group | Part |
|----------|-----------|------|
| `1a`, `1b`, `1`, `lot 1`, IaaS, PaaS, hosting | Lots 1a and 1b | Part 1 |
| `2a`, `2b`, `2`, `lot 2`, iSaaS, SaaS, software | Lots 2a and 2b | Part 2 |
| `3`, `lot 3`, support | Lot 3 | Part 3 |
| `all` | Every group that has a service | |

Otherwise ask which lot groups the supplier is bidding for (multiple selections allowed). Mark the
groups that already have services; the **(Recommended)** default is exactly those groups:

```text
Which lot groups are you bidding for?

1. Lots 1a/1b — IaaS and PaaS — conditions of participation and two written quality answers (80% of the score)
2. Lots 2a/2b — iSaaS and SaaS — four award criteria checkboxes; price is 80%
3. Lot 3 — Cloud Support — four award criteria checkboxes; the average day rate is 80%
```

For Lots 1 and 2, also confirm which lots in the group are bid for (1a, 1b or both; 2a, 2b or both).
The services' recorded lots are the starting point and the default. With no services and no answer,
stop and ask the user to name a lot group or run `/arckit-uk-gcloud:service-design` first.

### 3. For each lot group: read the questions, template and evidence

Use the **Read tool** on the group's lot questions — only the group's file:

- Lots 1a/1b: `${CLAUDE_PLUGIN_ROOT}/skills/gcloud-framework/references/g-cloud-15/lot-1-lot-questions.md`
- Lots 2a/2b: `${CLAUDE_PLUGIN_ROOT}/skills/gcloud-framework/references/g-cloud-15/lot-2-lot-questions.md`
- Lot 3: `${CLAUDE_PLUGIN_ROOT}/skills/gcloud-framework/references/g-cloud-15/lot-3-lot-questions.md`

**Read the template** (user override takes precedence):

- **First**, check `.arckit/templates-custom/lot-questions-template.md`
- **Then**, `.arckit/templates/lot-questions-template.md`
- **Fallback**, `${CLAUDE_PLUGIN_ROOT}/templates/lot-questions-template.md`
- **Then read** `${CLAUDE_PLUGIN_ROOT}/templates/_partials/RENDERING.md` and resolve the `<!-- DOC-CONTROL-HEADER -->` marker in the template before writing. Do not hand-write the Document Control table: the partial `RENDERING.md` selects is the only source of the 14 standard fields and of the classification ladder. Default the Classification field to `${user_config.default_classification}` (fall back to `OFFICIAL` for UK Gov context if unavailable).

The template has one Part per lot group. Keep the Parts for the lot groups bid for (including any
already in an existing LOTQ document) and delete the others.

Then read the evidence for every service in the group: for each service project whose SVCD's
`**G-Cloud Lot**` line names a lot in the group, use the **Read tool** on its
`ARC-{NNN}-SVCD-v*.md`, `ARC-{NNN}-SDD-v*.md`, `ARC-{NNN}-SECA-v*.md` and `ARC-{NNN}-PRIC-v*.md`
(highest versions, where present).

If no service matches, ask the user which services belong to the group. A lot group can be answered
before any service exists, but the answers then rest on the supplier profile and the user alone, and
must be checked again once the SDDs exist.

Every answer must come from the supplier profile, these documents, a URL the user gives, or the user.
Record each fact you use in the "Evidence Used" table with its file and section. **Never invent a
fact, figure, target, certificate or date.** Where the evidence is missing, write
`[PENDING: what is needed]`.

### 4. Lots 1a and 1b (Part 1)

#### 4a. Conditions of participation (pass/fail)

These are the supplier's declarations. Never answer them on the user's behalf, and give them no
default: an unanswered one is `[PENDING]`, including in a headless run. Ask four questions in one
**AskUserQuestion** call, with the export's answer options:

```text
1. Are you bidding to offer IaaS and/or PaaS as a reseller, or are you in sole control of the infrastructure?
   [Reseller / Sole Control of the Infrastructure]
   (Offering both proprietary and resold services as your core IaaS/PaaS → Reseller. Reselling only ancillary services → Sole Control.)
2. Have you been trading for less than 12 months?  [Yes / No]
3. Do you have a current Cyber Essentials Plus certificate for the services, awarded by IASME within the last 12 months?
   [Yes / No]
   If No, the alternative, worded as the export and the live Lot 1a listings word it:
   [In relation to the services you do not have a current and valid Cyber Essentials Plus certificate … but you are working towards gaining it, and will be in a position to confirm … by the date of framework award.
    / You do not have a current and valid Cyber Essentials Plus certificate, or will not have in place by the date of framework award but have an IASME certified equivalent.
    / None of the criteria]
4. Are you bidding for Lot 1b (alone or with 1a)?  [Yes / No]
```

Then follow the export's branches:

- **Reseller:** list each cloud service supplier resold, with evidence of accreditation or a
  partnership agreement (a web link or an uploaded certificate). Ask: "Are you reliant on the Cloud
  Service Provider for some accreditations required by the specification for this Lot, such as cloud
  security related ISOs?"
- **Certificates required:** ISO 9001, ISO 27001 and ISO 20000-1 on every branch. ISO 14001 and ISO
  27017 for Sole Control, or for a Reseller answering "No" to reliance. A Reseller relying on the
  provider's accreditations doesn't need 14001, 27017 or 27018.
- **ISO 27018:** the export still asks only "Are you bidding to provide services under Lot 1b…?", but
  GCA's update supersedes it: ISO 27018 is **mandatory for Lots 1a and 1b whenever the services
  include public cloud** (on the Sole Control and non-relying Reseller branches). Services offered
  only on private cloud deployment models don't need it. Check the deployment model recorded in each
  Lot 1a/1b service design or SDD, list the public cloud ones, and require ISO 27018 if there are any,
  even for a Lot 1a-only bid. Keep the export's question text in the document with the template's
  note. If the Digital Platform still asks only the Lot 1b question, tell the user to ask GCA through
  the Digital Platform how to provide the certificate.
- Fill each certificate's status, file and expiry from the supplier profile, and flag any required
  certificate that isn't held or that expires before the tender deadline. Attachment 2 also accepts
  evidence that accreditation has been started; a tender with neither is disregarded.
- **Carbon Reduction Plan:** trading under 12 months → confirm the organisation is taking steps to
  reduce greenhouse gas emissions and is publicly committed to Net Zero by 2050 (pass/fail), and the
  date a full plan will be published. Otherwise → confirm a plan meeting the PPN 006 standard exists
  (pass/fail), its web address (or an upload of the Attachment 2c template if there is no website),
  and the baseline and current Scope 1, 2 and 3 emissions in tCO2e. Take the emissions only from the
  published plan (use **WebFetch** on its URL). Never estimate them; the export accepts 0 where data
  is unavailable, with an explanation.
- **Cyber Essentials Plus:** mandatory for call-off contracts under Lots 1a and 1b (Framework
  Schedule 1 v2.1), not a condition of the bid: Attachment 2 v5.0 doesn't mark it mandatory for the
  tender, as it does the ISO certificates. Record the certificate number (format
  `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`) or the alternative chosen, with the template's exact
  option text. If it isn't held, list it under "Call-off Warnings": the supplier can't take a Lot
  1a/1b call-off until certified. Of the 1,829 live Lot 1a listings, the 105 without it all chose
  one of the first two alternatives.

#### 4b. Scored quality questions

Quality Cloud Services (40%) has parts a and b; Maximising Buyer Value (40%) has parts a, b and c.
Tell the user how they are marked (Attachment 2d):

- Each part is marked only on whether it **fully addresses** what that part asks. Quality Cloud
  Services scores 100/50/0 (each part is worth 20% of the total score). Maximising Buyer Value scores
  100/66/33/0 (each part is worth about 13.3%).
- A mark of zero on either question disqualifies the tender for Lots 1a and 1b.
- At most 250 words per part (500 and 750 for the whole question). The Digital Platform will not
  accept more.
- Answer the parts in order and start each with its label, for example "a) Cloud service
  performance:".
- No attachments, no hyperlinks to external content, no cross-references to other answers or to your
  website, and no costings. No generalised statements or irrelevant information.

For each part:

1. Copy the question's guidance and the "To fully address it" checklist from the template.
2. Gather the evidence from the SVCD, SDD and SECA documents of the Lot 1a/1b services, and the
   profile (for example SLAs and availability targets, scaling limits, monitoring, patching and
   upgrade practice, deprecation policy, billing and cost tools, FOCUS tagging, support tiers,
   training, roadmap and preview programmes). Add each fact to "Evidence Used".
3. Draft the answer as plain prose (the text box does not render Markdown) between the part's
   `<!-- answer:ID -->` markers. Be specific: name the targets, tools, processes and controls the
   evidence supports. Where the checklist needs something the evidence doesn't give, write
   `[PENDING: what is needed]` in the draft rather than filling the gap.
4. Tick a checklist item only when the draft covers it with evidence.

Ask the user to confirm or correct each draft. They know their service best, and an assessor will
hold them to every claim.

#### 4c. Non-scored mandatory questions

- "Also bidding Lot 2" and "Also bidding Lot 3": answer from the lot groups confirmed in Step 2.
- NCSC guidance adherence, and policies and controls for international sanctions, trade restrictions
  and embargoes: these are declarations that buyers may check or test. Ask the user; never assume
  "Yes".
- Customer contractual exit procedure, and engaging customers in a change of service and ensuring
  backward compatibility: draft each (at most 250 words) from the SDDs' offboarding, exit, data
  export, change management and versioning sections, between the `exit` and `change` markers.

#### 4d. Standards, and requirements outside the lot questions

Fill ISO 28000:2022, QMS, CSA STAR, PCI DSS and other security certifications from the supplier
profile. Record the status of the Technical Ability Certificate for each lot, the Gold FVRA with
published accounts, and the pricing and social value documents.

### 5. Lots 2a and 2b (Part 2), and Lot 3 (Part 3): mandatory award criteria

Each criterion is worth 2.5%, marked by the option chosen (Attachment 2d). GCA's rule for these
lots, in Attachment 2d (Quality questionnaire) v4.0 and in Attachment 2 (How to tender) v5.0,
disqualifies a tender that marks under 33 on **all four** criteria, that is a weighted quality score
of zero. A single "No" scores 0 and loses that criterion's 2.5%, but doesn't on its own disqualify.
Attachment 2's general quality-threshold paragraph says a zero on any scored question disqualifies;
the lot-specific rule is the one both documents repeat, and the live listings fit it (1,159 Lot 2b
services from 207 suppliers answer "Data sanitisation process: No"). Avoid any zero all the same: it
costs marks, and buyers can test every claim. The answer covers **all** the supplier's services in
the lot group, and has to agree with the User Support, Asset Protection, Staff Security and
Standards answers on each listing.

1. For each service in the group, read what its SDD and SECA document say for each criterion, and
   fill the per-service tables.
2. Work out the answer every service supports. If the services differ (for example one offers 24/7
   support and another 9 to 5 Monday to Friday), say so: the lot answer must be true for all of them,
   so either the weaker services change or the answer drops to their level.
3. Ask the four criteria in one **AskUserQuestion** call, showing each option's mark. The option the
   evidence supports is the **(Recommended)** default; with no evidence there is no default and the
   answer stays `[PENDING]`.

**Lots 2a and 2b:**

```text
1. User support availability for your SaaS services
   [24 hours, 7 days a week (100) / 9 to 5 (UK time), 7 days a week (66) / 9 to 5 (UK time), Monday to Friday (33) / No user support processes (0)]
2. Where is service user data stored and processed?
   [United Kingdom (100) / European Economic Area (EEA) (66) / Other (33) / Location not known (0)]
3. How often will penetration testing be conducted on the SaaS service?
   [At least every 6 months (100) / At least once a year (66) / Less than once a year (33) / No penetration testing (0)]
4. Do you have an industry standard data sanitisation process (overwriting before reallocation / Secure Erase, degaussing, or physical destruction)?
   [Yes (100) / No (0)]
```

The export lets you tick more than one data location, and Attachment 2d does not say how a
combination is marked. Record every location the services use, and flag the uncertainty.

**Lot 3:**

```text
1. User support availability for your Cloud Support services
   [24 hours, 7 days a week (100) / 9 to 5 (UK time), 7 days a week (66) / 9 to 5 (UK time), Monday to Friday (33) / No user support processes (0)]
2. How are staff security checks performed for staff with access to information or connected to delivery?
   [Screening that conforms to BS7858:2019 (100) / Screening that doesn't conform with BS7858:2019 (50) / No checks (0)]
3. What level of staff security clearance are you prepared to have in place should a Buyer require it?
   [Up to Developed Vetting (DV) (100) / Up to Security Clearance (SC) (66) / Up to BPSS (33) / Not prepared (0)]
4. Are you prepared to have in place Cyber Essentials (or equivalent or higher) certification should a Buyer require it?
   [Yes (100) / No (0)]
```

For Lot 3's clearance level, check the supplier profile's cleared staff counts and sponsoring
organisation; a commitment to DV is one the buyer can hold you to. Cyber Essentials is mandatory for
Lot 3 call-offs in any case (see item 5), so a "No" to question 4 contradicts that requirement as
well as scoring 0.

4. Record the answers as given, compute each mark and weighted score, and fill the quality score
   table: social value 10% (from the SOCV document: Pass only if every pass/fail answer there is
   "Yes" and at least one measure is selected, otherwise `[PENDING]` or Fail) plus 2.5% × mark for
   each criterion.
5. **Cyber Essentials is mandatory for call-off contracts** under Lots 2a, 2b and 3 (GCA's Updates
   to Tender Documents and Framework Schedule 1 v2.1), though the export lists it among
   "Non-mandatory Standards and certifications". It is not a condition of the bid: Attachment 2 v5.0
   lists no mandatory certificate for these lots, and 769 Lot 2b and 1,977 Lot 3 listings are live
   with "Cyber essentials: No" and "None of the criteria". Record the certificate number from the
   supplier profile, or the alternative chosen, using the template's option text: the live listings
   word the alternatives "within 12 months of the date of award", where the export says "by the date
   of framework award". If it isn't held, list it under "Call-off Warnings", never "Would Fail as
   Written": the supplier can't be awarded a call-off until it holds the certificate. Cyber
   Essentials Plus is optional for these lots.
6. Fill the non-mandatory standards (ISO/IEC 27001, ISO 28000:2022, ISO 9001, QMS, CSA STAR, PCI DSS,
   others) from the supplier profile, and the requirements outside the lot questions.

### 6. Write the document

Fill the **G-Cloud Details** table (supplier, lot groups, lots bid for, services in those groups).
List every `[PENDING]` item, every pass/fail answer that would fail, every required certificate not
held, every call-off warning, and every service that disagrees with a lot answer under "Items
Requiring Attention".

Generate the document ID with the ArcKit helper (LOTQ is single-instance — one document for all the
supplier's lot groups):

```bash
node "${CLAUDE_PLUGIN_ROOT}/scripts/generate-document-id.mjs" 000 LOTQ --filename
```

This returns `ARC-000-LOTQ-v1.0.md`. If a LOTQ document already exists, increment its version
instead and add a Revision History row saying which Parts changed.

Before writing, read `${CLAUDE_PLUGIN_ROOT}/references/quality-checklist.md` and verify all **Common Checks** plus the **LOTQ** per-type checks pass. Fix any failures before proceeding.

Use the **Write tool** to save the document to:

`projects/000-global/supplier/ARC-000-LOTQ-v{VERSION}.md`

Do **not** echo the full document into your response; print only the summary below.

Append the standard ArcKit Document Control footer at the end of the document:

```markdown
---

**Generated by**: ArcKit `/arckit-uk-gcloud:lot-questions` command
**Generated on**: [DATE]
**ArcKit Version**: [VERSION]
**Project**: Supplier-wide (000-global)
**Model**: [AI_MODEL]
```

**For Part 1 (Lots 1a/1b), count the words after writing:**

```bash
F="projects/000-global/supplier/ARC-000-LOTQ-v{VERSION}.md"
count() { awk -v s="<!-- answer:$1 -->" -v e="<!-- /answer:$1 -->" 'index($0, e) {f=0} f {print} index($0, s) {f=1}' "$F" | wc -w | tr -d ' '; }
qcs=0; mbv=0
for id in qcs-a qcs-b mbv-a mbv-b mbv-c exit change; do
    n=$(count "$id")
    case "$id" in qcs-*) qcs=$((qcs + n)) ;; mbv-*) mbv=$((mbv + n)) ;; esac
    if [ "$n" -gt 250 ]; then echo "$id: $n / 250 words (OVER by $((n - 250)))"; else echo "$id: $n / 250 words"; fi
done
echo "Quality Cloud Services total: $qcs / 500 words"
echo "Maximising Buyer Value total: $mbv / 750 words"
```

Put each count into the document's "Word count" lines and tables (with the **Edit tool**). If a part
is over 250 words, tighten it and count again; never cut something a checklist item depends on
without telling the user. `wc -w` can differ slightly from the Digital Platform's counter, so leave a
few words' margin. `[PENDING: …]` placeholders are counted too, so counts change once they are
filled.

### 7. Summary

Report what the document actually contains, for each Part written:

```markdown
## Lot Questions Updated

**Saved to:** `projects/000-global/supplier/ARC-000-LOTQ-v{VERSION}.md`

### Part 1: Lots 1a and 1b
**Lots bid for:** [1a / 1b / both]  **Services:** [list]
- Conditions of participation: [Reseller / Sole Control]; public cloud services [list or "none"]; certificates required [list], held [list], missing [list or "none"]; Carbon Reduction Plan [route and status]; Cyber Essentials Plus [certificate / alternative / PENDING]
- Quality Cloud Services (40%): a) [N]/250 words, [N] of [M] checklist items covered; b) [N]/250, [N] of [M]
- Maximising Buyer Value (40%): a) [N]/250, b) [N]/250, c) [N]/250 words; checklist items covered [N] of [M]
- Non-scored: NCSC [answer], sanctions [answer], exit [N]/250 words, change of service [N]/250 words

### Part 2: Lots 2a and 2b
- User support [answer, mark]; asset protection [answer, mark]; penetration testing [answer, mark]; data sanitisation [answer, mark]. Any criterion marked 0 costs its 2.5%; all four under 33 disqualifies
- Quality score: [N]% of a possible 20%
- Cyber Essentials (mandatory for call-offs): [certificate number / alternative chosen / PENDING]
- Services that disagree with a lot answer: [list or "none"]

### Part 3: Lot 3
- [As Lots 2a and 2b, for its four criteria]

### Would Fail as Written
- [Each failing pass/fail answer, zero mark on a Lot 1a/1b quality question, all four Lot 2a/2b or Lot 3 criteria marked under 33, missing required certificate (the Lot 1a/1b ISO certificates, including ISO 27018 for public cloud, and the Carbon Reduction Plan) or part over 250 words, or "Nothing found"]

### Call-off Warnings
- [Cyber Essentials Plus (Lots 1a/1b) or Cyber Essentials (Lots 2a/2b, 3) not held: the alternative chosen, and that no call-off can be awarded under the lot until the certificate is held, or "None"]

### Items Requiring Attention
- [Each `[PENDING]` item, or "None"]

### Assumptions
- [Each default taken under the interview pattern, or "None"]

### Next Steps
1. `/arckit-uk-gcloud:social-value` — if the SOCV document is missing or has pending answers
2. The SDD, `/arckit-uk-gcloud:pricing` and `/arckit-uk-gcloud:security` for any service in the group that lacks them —
   the award criteria repeat their answers
3. `/arckit-uk-gcloud:declaration` — the supplier declaration, which records the lots bid for
4. `/arckit-uk-gcloud:review [service]` — checks limits and consistency before submission
```

## Important Notes

- These answers go into the Digital Platform's lot questions, one set per lot group, not into each
  service listing. The Lot 2 and Lot 3 award criteria must still agree with every listing in the lot.
- The Lot 1a/1b quality answers are read by assessors and moderated at a consensus meeting. Specific,
  evidenced statements score; generalised ones don't.
- The Framework Schedule 1 paragraph numbers differ between the question export (6.5.1.x) and
  Attachment 2d v4.0 (6.6.1 (F) to (M)). Check them against the version of Schedule 1 you are bidding
  against.
- Re-run this command when a service is added to a lot group or an SDD changes, so the lot answers
  stay true for every service.
- The document is supplier-wide and lives in `projects/000-global/supplier/`, never under a
  per-service project directory.
- **Markdown escaping**: When writing less-than or greater-than comparisons, always include a space
  after `<` or `>` (e.g. `< 12 months`) to prevent markdown renderers from interpreting them as HTML
  tags or emoji.
