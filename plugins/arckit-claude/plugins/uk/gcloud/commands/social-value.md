---
description: Create or update the supplier's G-Cloud 15 social value commitments (declaration Sections A–C and Operational Readiness)
doc-type: SOCV
effort: high
handoffs:
  - command: /arckit-uk-gcloud:service-design
    description: Design each service and choose its lot
  - command: /arckit-uk-gcloud:lot-questions
    description: Answer the lot questions once the services have their SDDs
  - command: /arckit-uk-gcloud:declaration
    description: The declaration's social value section summarises this document
---

> ⚠️ **Community-contributed command** — part of the `arckit-uk-gcloud` overlay, not the
> officially-maintained ArcKit baseline. The social value answers prepared here form part of the
> G-Cloud 15 (RM1557.15) supplier declaration for GCA (the Government Commercial Agency, formerly
> CCS). They are marked pass/fail and every measure selected is a commitment a buyer can hold the
> supplier to. Output is **not** legal or procurement advice — the supplier confirms every answer
> and enters it on the Digital Platform.

You are helping a cloud service supplier prepare the social value part of their G-Cloud 15
(RM1557.15) supplier declaration. Social value is worth 10% on every lot and is marked pass/fail, so
one wrong answer here disqualifies the whole tender.

The social value document is a **supplier-wide** artefact — its measures appear on every service
listing — so it lives in `projects/000-global/supplier/` rather than under a per-service project.

## User Input

```text
$ARGUMENTS
```

## Instructions

### 1. Load the supplier context

```bash
mkdir -p projects/000-global/supplier
ls projects/000-global/supplier/ 2>/dev/null
```

Use the **Read tool** on the highest version of:

- `projects/000-global/supplier/ARC-000-SUPP-v*.md` — the supplier profile. If it is missing, tell
  the user to run `/arckit-uk-gcloud:supplier-profile` first, then continue with what they give you.
- `projects/000-global/supplier/ARC-000-SOCV-v*.md` — an existing social value document. If it
  exists, this is an update. Show the user what it currently records: the Section A answers, how many
  measures under each mission, the Social Value Contact and the Operational Readiness answers. Ask
  what they want to change, and keep everything else as it is.

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

**Citation traceability**: When you fetch a supplier web page (social value, ESG, careers or
sustainability), or read a document the user has placed under `projects/000-global/supplier/` or an
`external/` directory, follow the citation instructions in
`${CLAUDE_PLUGIN_ROOT}/references/citation-instructions.md`. Place inline citation markers next to
the evidence they support and populate the **External References** section (Document Register,
Citations, Unreferenced Documents). WebSearch alone (search without fetch) is exploratory and is not
cited.

### 2. Read the references and template

Use the **Read tool** on:

- `${CLAUDE_PLUGIN_ROOT}/skills/gcloud-framework/references/g-cloud-15/social-value-model.md` —
  every mission, policy outcome and measure, worded as the live listings show them, which is what
  buyers see. It is built from the 42,893 listings scraped on 7 October 2026.
- The declaration's social value questions in
  `${CLAUDE_PLUGIN_ROOT}/skills/gcloud-framework/references/g-cloud-15/declaration.md` — only the
  sections from `### Social Value: Section A` to `### Social Value: Section C` (Section B's row holds
  every checkbox in the question export's full wording, which the Digital Platform shows), and from
  `### Social Value: Section C` to `### Visibility of third party agents or bid writers`:

```bash
REF="${CLAUDE_PLUGIN_ROOT}/skills/gcloud-framework/references/g-cloud-15/declaration.md"
sed -n '/^### Social Value: Section A/,/^### Social Value: Section C/p' "$REF"
sed -n '/^### Social Value: Section C/,/^### Visibility of third party/p' "$REF"
```

**Read the template** (user override takes precedence):

- **First**, check `.arckit/templates-custom/social-value-template.md`
- **Then**, `.arckit/templates/social-value-template.md`
- **Fallback**, `${CLAUDE_PLUGIN_ROOT}/templates/social-value-template.md`
- **Then read** `${CLAUDE_PLUGIN_ROOT}/templates/_partials/RENDERING.md` and resolve the `<!-- DOC-CONTROL-HEADER -->` marker in the template before writing. Do not hand-write the Document Control table: the partial `RENDERING.md` selects is the only source of the 14 standard fields and of the classification ladder. Default the Classification field to `${user_config.default_classification}` (fall back to `OFFICIAL` for UK Gov context if unavailable).

### 3. Explain how it is assessed

Before asking anything, tell the user in a few lines:

- Social value is 10% of the score on every lot (1a, 1b, 2a, 2b and 3). It is pass/fail: a pass
  scores the full 10%, and a fail scores 0 and disqualifies the tender.
- **Section A:** five "do you understand" questions. A "No" to any of them makes the bid
  non-compliant.
- **Section B:** select at least one measure. Selecting more does not score more (Attachment 2d).
- **Section C:** commit to having a Social Value Contact and name them. Stating you will not have one
  is non-compliant.
- **Operational Readiness:** six questions. A "No" to any of them means the bid is disregarded.
- **After award:** a buyer may add a social value requirement to a call-off contract, and you must
  meet it where it is relevant and proportionate. Your selected measures appear on every one of your
  listings, and buyers can filter search results by social value. Choose only measures you can
  deliver and evidence.

The questions say "CCS"; they mean the Government Commercial Agency (GCA, formerly CCS).

### 4. How to ask

Follow `${CLAUDE_PLUGIN_ROOT}/references/interview-pattern.md`: prefill from the arguments, the
supplier profile and an existing SOCV document, say what you inferred, and ask the remaining questions
in as few **AskUserQuestion** calls as the tool's four-question limit allows. Two exceptions, both
load-bearing:

- **The pass/fail answers (Section A, Section C and Operational Readiness) have no default.** They
  are the supplier's own confirmations; never answer them on the user's behalf. An unanswered one is
  `[PENDING]`, including in a headless run.
- **No measure is ever selected by default.** In a headless run, record the measures you found
  evidence for as *proposed* under "Items Requiring Attention" and leave Section B `[PENDING]`.

Never block: write the document with the `[PENDING]` items listed.

### 5. Section A: understanding social value

Ask A1–A4 (Yes / No each), quoting the export wording:

```text
A1. Do you understand that CCS and users of the G-Cloud 15 agreement are required to deliver social value and to provide evidence of delivery during the contract?
A2. Do you understand that CCS will evaluate your G-Cloud 15 social value response as per the process described within Attachment 2?
A3. Do you understand that a buyer calling off under the G-Cloud 15 framework may include a social value requirement to a Call-Off contract?
A4. Do you understand that, provided that it is relevant and proportionate, you will be obligated to meet the social value requirement included in the Call-Off Contract(s)?
```

Ask A5 together with the Section C and Operational Readiness questions in Step 8. Record each answer
exactly as given. Anything unanswered is `[PENDING]`. If the user answers "No", record "No" and tell
them plainly that the bid will be non-compliant as it stands.

### 6. Section B: choose measures

**6a. Look for evidence first.** Scan the supplier profile, and any URL the user gave in
`$ARGUMENTS` (use **WebFetch** on their social value, ESG, careers or sustainability pages), for
things that already happen. For example:

| Evidence | Measure it may support (Policy Outcome) |
|----------|-----------------------------------------|
| Real Living Wage accreditation, or pay above the National Living Wage | 1: Payment of more than the National Minimum Wage or National Living Wage |
| Gender or ethnicity pay gap reporting | 1: Monitoring and reporting of gender and ethnicity pay gaps |
| Published modern slavery statement, supply chain due diligence | 1: the modern slavery measures |
| Volunteering days policy | 1: Volunteering opportunities for staff |
| Apprentices, supported internships, T Level placements | 2: Delivery of apprenticeships, supported internships and T Level industry placement opportunities |
| SME or VCSE subcontracting, opportunities advertised on Contracts Finder | 3: the supply chain measures |
| ISO 14001, a Carbon Reduction Plan, a net zero target | 4: the environmental measures |
| Disability Confident employer | 6: Other measures to provide equality of opportunity for disabled people |
| School, college or university outreach | 7: Creation of outreach activities to create a pipeline of employees |
| Wellbeing programme, mental health first aiders | 8: Actions to invest in the physical and mental health and wellbeing of the contract workforce |

Only propose a measure when you found evidence for it, and say what the evidence is.

**6b. Choose missions.** Ask with **AskUserQuestion** (multiple selections allowed) which of the four
missions the supplier commits to — at least one:

```text
1. Kick start economic growth — Outcomes 1 Fair work, 2 Skills for growth, 3 Resilient, innovative and flexible supply chains
2. Make Britain a clean energy superpower — Outcome 4 Sustainable procurement practices
3. Break down barriers to opportunity — Outcomes 6 Employment and training, 7 Creating a pipeline of opportunities
4. Build an NHS fit for the future — Outcome 8 Increasing productivity through physical and mental wellbeing
```

**6c. Choose measures.** For each chosen mission, show every measure of its outcomes from
`social-value-model.md`, numbered `outcome.position` (for example `4.2` is the second measure under
Policy Outcome 4). The numbers are only for this conversation; the document records the measure's
exact text. Mark the measures you proposed in 6a and the evidence behind each. Ask the user to reply
with the numbers they commit to.

- At least one measure in total is required.
- Some measures appear under two outcomes with the same wording (for example "Support for educational
  attainment…" under Outcomes 1 and 2). Record the one the user chose, under its outcome.
- Copy each measure exactly as `social-value-model.md` writes it: that is the wording the listing
  shows buyers. Never shorten or reword it.
- **The checkbox you tick on the Digital Platform can be longer.** The model is built from the live
  listings, and GCA's question export (Section B in `declaration.md`) words 59 of its 76 measures
  the same way. For the other 17, the checkbox adds illustrative examples or a trailing clause that
  listings cut off, and one Outcome 6 checkbox ("Collection of the views and expertise of disabled
  people…") adds a whole second measure. Match each chosen measure to its checkbox by its opening
  words, and tell the user which checkboxes carry extra text.
- Three checkboxes share one listing text, "Advertising, promotional and outreach activities
  designed to raise awareness of the offer to reach the target cohort", under Outcomes 6, 7 and 8;
  record the outcome the user means. Three export checkboxes under Outcome 4 ("Illustrative examples
  include:", "Illustrative examples:") are fragments, not measures: never offer them.

### 7. Evidence and a delivery plan for each measure

A buyer can turn any selected measure into a call-off requirement, so each one needs a plan the
supplier can deliver. For each measure, gather:

- **Evidence today:** the policy, certificate, report, data or URL that shows it already happens
- **What we will deliver on a call-off:** a concrete activity, for the contract workforce or the
  buyer's area
- **How it is measured:** the metric, baseline, target and reporting frequency
- **Owner:** the role accountable for delivery
- **Status:** delivering now, or planned from a date

Pre-fill from the profile and research, then ask the user to confirm or correct in grouped rounds,
not one field at a time. **Never invent a figure, target, date or policy.** Write anything the user
hasn't confirmed as `[PENDING]`.

### 8. Section A5, Section C and Operational Readiness

Ask these four questions in one **AskUserQuestion** call:

```text
A5. Do you agree to collaborate with stakeholders (e.g. buyers, end users, local communities etc) to design and deliver social value in each Call-Off Contract where required?  [Yes / No]

Section C. Please commit here to having a CCS Social Value Contact in the organisation to be responsible for your delivery of social value.
  [We WILL have a CCS Social Value Contact in the organisation / We will NOT have a CCS Social Value Contact in the organisation]

R1. Do you commit to reporting the Social Value you have delivered, as and when required?  [Yes / No]

R2–R6. Do you have, or will you have by the Framework Award date, an organisational process in place to:
  identify the social value opportunities within a contract;
  prioritise and implement social value opportunities for a contract;
  influence staff, suppliers, customers and communities through the delivery of the contract to support the delivery of Social Value;
  measure and report on the delivery of social value in Call-Off Contracts;
  measure and report social value from the Framework Award date?
  [Yes to all five / Not all five]
```

If the answer to R2–R6 is "Not all five", ask which ones are "No" and record each separately. For
every "Yes", ask briefly how the process works (who owns it and what evidence exists), and record it
in the "How" column. A described process is something the supplier can show a buyer.

Then ask for the **Social Value Contact's** name, job title and email address. A shared mailbox is
acceptable, but a named person is still required. If the user can't name anyone yet, the export
accepts the person ultimately responsible for delivering any contract or for the relationship with
GCA. Use the user's answer, or the profile's details if they confirm them; otherwise write
`[PENDING]`.

### 9. Generate the document

Populate the template:

- Group the commitments Mission → Policy Outcome → measure, as listings show them. Include only
  missions and outcomes with at least one selected measure, and fill in the counts table.
- Write one delivery plan block per selected measure.
- Record each answer exactly as the user gave it. Never default a pass/fail answer to "Yes" or "No";
  an unanswered question is `[PENDING]`.
- List every `[PENDING]` field, and every answer that would fail the tender, under "Items Requiring
  Attention".

Generate the document ID with the ArcKit helper (SOCV is single-instance):

```bash
node "${CLAUDE_PLUGIN_ROOT}/scripts/generate-document-id.mjs" 000 SOCV --filename
```

This returns `ARC-000-SOCV-v1.0.md`. On an update, increment the existing version instead and add a
Revision History row saying what changed.

Before writing, read `${CLAUDE_PLUGIN_ROOT}/references/quality-checklist.md` and verify all **Common Checks** plus the **SOCV** per-type checks pass. Fix any failures before proceeding.

Use the **Write tool** to save the document to:

`projects/000-global/supplier/ARC-000-SOCV-v{VERSION}.md`

Do **not** echo the full document into your response; print only the summary below.

Append the standard ArcKit Document Control footer at the end of the document:

```markdown
---

**Generated by**: ArcKit `/arckit-uk-gcloud:social-value` command
**Generated on**: [DATE]
**ArcKit Version**: [VERSION]
**Project**: Supplier-wide (000-global)
**Model**: [AI_MODEL]
```

### 10. Summary

Report what the document actually contains:

```markdown
## Social Value Updated

**Supplier:** [Company Name]
**Saved to:** `projects/000-global/supplier/ARC-000-SOCV-v{VERSION}.md`

### Pass/Fail Answers
- Section A: [N] Yes, [N] No, [N] PENDING
- Section C: [WILL have a contact: Name, Job title / will NOT have one / PENDING]
- Operational Readiness: [N] Yes, [N] No, [N] PENDING
- Section B: [N] measures selected [or "none selected: non-compliant"]

### Measures by Mission
- Kick start economic growth: [N] (Outcomes [list])
- Make Britain a clean energy superpower: [N]
- Break down barriers to opportunity: [N] (Outcomes [list])
- Build an NHS fit for the future: [N]

### Delivery Plans
- [N] of [M] measures have evidence, a metric and an owner
- [Each measure still missing evidence or a plan]

### Would Fail as Written
- [Each "No" answer, a missing measure or a missing contact, with its consequence, or "Nothing: every pass/fail answer is Yes and at least one measure is selected"]

### Items Requiring Attention
- [Each `[PENDING]` item, or "None"]

### Next Steps
1. `/arckit-uk-gcloud:service-design` — design each service and choose its lot, then its SDD, pricing and security
2. `/arckit-uk-gcloud:lot-questions` — once the services have their SDDs: the award criteria repeat their answers
3. `/arckit-uk-gcloud:declaration` — the declaration's social value section points to this document
4. `/arckit-uk-gcloud:review` — checks this document before submission
```

## Important Notes

- This is one supplier-level document. Its measures appear on every service listing, so keep it
  accurate and re-run this command when policies change.
- The answers go into the "Make your supplier declaration" section of the Digital Platform. This
  document prepares them; the supplier still enters and submits them.
- In an October 2026 sample of about 1,100 G-Cloud 15 suppliers' listings, the median supplier
  selected 37 measures and about two-thirds covered all four missions. More measures don't score
  more, and every one is a commitment a buyer can hold you to.
- The full social value model is PPN 002:
  <https://assets.publishing.service.gov.uk/media/67ae1529e270ceae39f9e1a0/2025-02-11_PPN_002_The_social_value_model.docx.pdf>
- The document is supplier-wide and lives in `projects/000-global/supplier/`, never under a
  per-service project directory.
- **Markdown escaping**: When writing less-than or greater-than comparisons, always include a space
  after `<` or `>` (e.g. `< 30 days`) to prevent markdown renderers from interpreting them as HTML
  tags or emoji.
