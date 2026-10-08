---
description: Bundle all documents for a G-Cloud 15 service into a submission pack for GCA
doc-type: none
effort: medium
---

> ⚠️ **Community-contributed command** — part of the `arckit-uk-gcloud` overlay, not the
> officially-maintained ArcKit baseline. The submission pack assembled here is an internal aid for a
> G-Cloud 15 (RM1557.15) bid; it is **not** legal or procurement advice and **does not guarantee
> acceptance** by GCA (the Government Commercial Agency, formerly CCS). Application windows are
> strict and bids are scored — confirm requirements against GCA's tender documents at
> <https://www.gca.gov.uk/rm1557-15-g-cloud-15-tender-documents> before submitting.

You are helping a cloud service supplier **assemble a complete submission pack** for one G-Cloud 15
service: gathering the service's documents plus the supplier-wide bid documents into one folder,
with an index, the answers ready to copy into GCA's Digital Platform in the order GCA asks them, a
pre-submission checklist for the service's lot, and the order of work for submitting.

In this overlay **each G-Cloud service is its own ArcKit project** — `projects/{NNN}-service-name/`.
This command does **not** create a new project and **does not** create an ArcKit document. It is an
**export action**: it copies existing artefacts into a `submission/` folder inside the service
project and writes `submission/manifest.md` and `submission/answers-export.md`, plus the
supplier-level answers once per bid in `projects/000-global/supplier/submission/bid-answers.md`. The
bundle output itself gets **no ArcKit doc-type and no `ARC-…-` ID**.

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

- `path` — the service project directory (e.g. `projects/004-secure-case-mgmt`) — the source
- `number` — the zero-padded project number (e.g. `004`) — use as `PROJECT_ID`
- `name` — the project / service name

### 2. Verify the documents exist

Check that each required artefact exists. Per-service artefacts live in `{path}`; the supplier-wide
bid documents live under `projects/000-global/supplier/`:

```bash
PROJECT_PATH="{path}"   # e.g. projects/004-secure-case-mgmt
SUPPLIER=projects/000-global/supplier
# Latest version of a document, or nothing. find never aborts when nothing matches, as a bare
# glob does under zsh ("no matches found")
latest() { find "$1" -maxdepth 1 -name "$2" 2>/dev/null | sort -V | tail -1; }
echo "=== Supplier-wide (once per bid, shared by every service) ==="
[ -n "$(latest "$SUPPLIER" 'ARC-000-SUPP-v*.md')" ] && echo "✅ Supplier Profile"     || echo "❌ Supplier Profile MISSING"
[ -n "$(latest "$SUPPLIER" 'ARC-000-SOCV-v*.md')" ] && echo "✅ Social Value"         || echo "❌ Social Value MISSING"
[ -n "$(latest "$SUPPLIER" 'ARC-000-LOTQ-v*.md')" ] && echo "✅ Lot Questions"        || echo "❌ Lot Questions MISSING"
[ -n "$(latest "$SUPPLIER" 'ARC-000-DECL-v*.md')" ] && echo "✅ Supplier Declaration" || echo "❌ Supplier Declaration MISSING"
echo "=== Per-service ==="
[ -n "$(latest "$PROJECT_PATH" 'ARC-*-SVCD-v*.md')" ] && echo "✅ Service Design" || echo "❌ Service Design MISSING"
[ -n "$(latest "$PROJECT_PATH" 'ARC-*-SDD-v*.md')" ]  && echo "✅ SDD"            || echo "❌ SDD MISSING"
[ -n "$(latest "$PROJECT_PATH" 'ARC-*-PRIC-v*.md')" ] && echo "✅ Pricing"        || echo "❌ Pricing MISSING"
[ -n "$(latest "$PROJECT_PATH" 'ARC-*-SECA-v*.md')" ] && echo "✅ Security"       || echo "❌ Security MISSING"
SVCD=$(latest "$PROJECT_PATH" 'ARC-*-SVCD-v*.md')
{ [ -n "$SVCD" ] && grep -m1 '^\*\*G-Cloud Lot\*\*' "$SVCD"; } || echo "❌ Lot not recorded in the service design"
# Lot 3: the supplier's one rate card, shared by every Lot 3 service
if [ -n "$SVCD" ] && grep -qE '^\*\*G-Cloud Lot\*\*:[[:space:]]*(Lot[[:space:]]*)?3([^0-9ab]|$)' "$SVCD"; then
  [ -n "$(latest "$SUPPLIER" 'ARC-000-RATE-v*.md')" ] && echo "✅ Lot 3 Rate Card (supplier-wide)" || echo "❌ Lot 3 Rate Card MISSING (ARC-000-RATE)"
fi
```

**Find the lot** from the service design's `**G-Cloud Lot**: Lot <code> — <name>` line: `1a`, `1b`,
`2a`, `2b` or `3`. The lot group decides which Part of the lot questions document applies: Part 1
(Lots 1a/1b), Part 2 (Lots 2a/2b) or Part 3 (Lot 3). Use the **Read tool** on the highest version of
the LOTQ document and check it has that Part.

If any required document is missing, the lot isn't one of the five G-Cloud 15 lots, or the LOTQ
document lacks the Part for this lot group, **stop** and advise the user to create it first:

| Missing | Command |
|---------|---------|
| Supplier profile | `/arckit-uk-gcloud:supplier-profile` |
| Social value | `/arckit-uk-gcloud:social-value` |
| Lot questions, or the Part for this lot group | `/arckit-uk-gcloud:lot-questions` |
| Declaration | `/arckit-uk-gcloud:declaration` |
| Service design, or a lot that isn't 1a/1b/2a/2b/3 | `/arckit-uk-gcloud:service-design` |
| SDD | `/arckit-uk-gcloud:sdd-lot1a`, `sdd-lot1b`, `sdd-lot2a`, `sdd-lot2b` or `sdd-lot3`, matching the lot |
| Pricing, or the Lot 3 rate card (`ARC-000-RATE`) | `/arckit-uk-gcloud:pricing` |
| Security evidence | `/arckit-uk-gcloud:security` |

### 3. Check the review report

Use the **Read tool** on the highest version of `{path}/ARC-{PROJECT_ID}-GCRV-v*.md` if it exists.

- **No report:** warn the user that the pack is being built without a review, and recommend running
  `/arckit-uk-gcloud:review [service]` first.
- **Report status is not 🟢 READY:** show its status and its "Must Fix (Blocking)" actions
  prominently, before anything else. Say that GCA will likely reject or mark down the bid if it is
  submitted as it stands.
- **Report is older than any of the documents it reviewed** (a reviewed document has a later version
  or modification date): say it may be stale and recommend re-running the review.

These are warnings, not blocks. Build the pack anyway so the user can see the whole submission, and
carry the warning into the summary. Also list the unfinished answers still in the documents: each is
an answer that has to be supplied before submission. Use the placeholder scan `/arckit-uk-gcloud:review` runs,
so the two agree on what is unfinished: `[PENDING]` in every form (`[PENDING: …]`,
`[PENDING — …]`), older markers (`[TODO]`, `[TBC]`, `[CONFIRM]`, `*[TO BE ADDED]*`) and template
fields never filled in. It leaves out the Revision History and the Document Control **Reviewed By**
and **Approved By** rows, which are not bid answers:

```bash
PROJECT_PATH="{path}"   # e.g. projects/004-secure-case-mgmt
LOT="{lot}"             # this service's lot: 1a, 1b, 2a, 2b or 3
latest() { find "$1" -maxdepth 1 -name "$2" 2>/dev/null | sort -V | tail -1; }
# placeholder scan: keep identical in review.md and submission-pack.md
{
    find "${CLAUDE_PLUGIN_ROOT}/templates" .arckit/templates-custom -maxdepth 1 -name '*-template.md' 2>/dev/null
    echo phase=2
    for t in SUPP SOCV LOTQ DECL; do latest projects/000-global/supplier "ARC-000-$t-v*.md"; done
    [ "$LOT" = 3 ] && latest projects/000-global/supplier 'ARC-000-RATE-v*.md'
    for t in SVCD SDD PRIC SECA; do latest "$PROJECT_PATH" "ARC-*-$t-v*.md"; done
} | tr '\n' '\0' | xargs -0 awk '
    FNR == 1 { inc = 0; fence = 0; sect = "" }
    phase != 2 {
        s = $0
        while (match(s, /\[[^][]*\]/)) {
            tok = substr(s, RSTART, RLENGTH); s = substr(s, RSTART + RLENGTH)
            if (substr(s, 1, 1) != "(" && tok != "[ ]" && tok != "[x]" && tok !~ /-C[0-9]+\]$/) field[tok] = 1
        }
        next
    }
    /^```/ { fence = !fence; next }
    fence { next }
    {
        s = $0; t = ""
        while (s != "") {
            if (inc) { p = index(s, "-->"); if (!p) s = ""; else { s = substr(s, p + 3); inc = 0 } }
            else { p = index(s, "<!--"); if (!p) { t = t s; s = "" } else { t = t substr(s, 1, p - 1); s = substr(s, p + 4); inc = 1 } }
        }
        gsub(/`[^`]*\[[^`]*`/, "", t)
    }
    /^## / { sect = $0 }
    sect ~ /Revision History/ || $0 ~ /^\| *\*\*(Reviewed By|Approved By)\*\* *\|/ { next }
    {
        while (match(t, /\[[^][]*\]/)) {
            tok = substr(t, RSTART, RLENGTH); txt = substr(tok, 2, RLENGTH - 2)
            pre = substr(t, 1, RSTART - 1); t = substr(t, RSTART + RLENGTH)
            if (substr(t, 1, 1) == "(") continue
            k = ""
            if (txt ~ /^(PENDING|TODO|TBD|TBC|CONFIRM|TO BE [A-Z]+|PLACEHOLDER|INSERT|ENTER|YOUR|CHANGE THIS|UPDATE|REQUIRED)([^A-Za-z0-9].*)?$/) k = "pending"
            else if ((tok in field) || txt ~ /^[A-Z][A-Z0-9]*(_[A-Z0-9]+)+$/) {
                if (txt ~ /^[Xx]$/ && (pre ~ /^[ \t]*([-*+]|[0-9]+\.)[ \t]*$/ || (pre ~ /\|[ \t]*$/ && t ~ /^[ \t]*\|/))) continue
                k = "template"
            }
            if (k != "") { printf "%s:%d: %s %s\n", FILENAME, FNR, k, tok; n++ }
        }
    }
    END { printf "placeholders: %d\n", n + 0 }'
```

Then check that no document was written for the previous framework, with the same check
`/arckit-uk-gcloud:review` runs. The markers: a title or opening quote naming an earlier G-Cloud as its
framework, a Framework row or an agreement number from an earlier G-Cloud (RM1557.14 or below), a
lot from the three-lot framework (`Lot 1`, `Lot 2`, Cloud Hosting, Cloud Software) or a "1.3 Target
Lot" checkbox, an SFIA rate card, the old minimum or maximum price, pricing unit and billing
interval fields, a supplier profile with no Central Digital Platform or PPON section, or a Public
Contracts Regulations declaration.

```bash
PROJECT_PATH="{path}"   # e.g. projects/004-secure-case-mgmt
LOT="{lot}"             # this service's lot: 1a, 1b, 2a, 2b or 3
latest() { find "$1" -maxdepth 1 -name "$2" 2>/dev/null | sort -V | tail -1; }
# previous-framework check: keep identical in review.md and submission-pack.md
{
    for t in SUPP SOCV LOTQ DECL; do latest projects/000-global/supplier "ARC-000-$t-v*.md"; done
    [ "$LOT" = 3 ] && latest projects/000-global/supplier 'ARC-000-RATE-v*.md'
    for t in SVCD SDD PRIC SECA; do latest "$PROJECT_PATH" "ARC-*-$t-v*.md"; done
} | tr '\n' '\0' | xargs -0 awk '
    function flush(   i) {
        if (prev == "") return
        if (prev ~ /-SUPP-v[^\/]*\.md$/ && !cdp) r[++nr] = "no Central Digital Platform or PPON section, which every G-Cloud 15 bid needs"
        if (prev ~ /-DECL-v[^\/]*\.md$/ && pcr && !pa) r[++nr] = "a Public Contracts Regulations declaration; G-Cloud 15 runs under the Procurement Act 2023"
        if (nr) { found++; printf "%s: written for the previous framework\n", prev; for (i = 1; i <= nr && i <= 5; i++) printf "    %s\n", r[i] }
    }
    FNR == 1 { flush(); prev = FILENAME; nr = 0; cdp = 0; pa = 0; pcr = 0 }
    {
        l = tolower($0)
        if (l ~ /ppon|central digital platform/) cdp = 1
        if (l ~ /procurement act 2023/) pa = 1
        if (l ~ /public contracts regulations|pcr ?2015/) pcr = 1
        if (FNR <= 60 && l ~ /^(#+|>)[ \t]/ && l ~ /g-cloud ?(1[0-4]|[1-9])([^0-9]|$)/ && l !~ /g-cloud ?15/) r[++nr] = "line " FNR ": its title names an earlier framework"
        if (l ~ /^\| *\**framework\** *\|/ && l ~ /g-cloud ?(1[0-4]|[1-9])([^0-9]|$)|rm1557\.(1[0-4]|[1-9])([^0-9]|$)/) r[++nr] = "line " FNR ": its Framework row names an earlier framework"
        else if (l ~ /rm1557\.(1[0-4]|[1-9])([^0-9]|$)/) r[++nr] = "line " FNR ": names an earlier agreement"
        v = ""
        if (l ~ /^\*\*g-cloud lot\*\*:/) { v = l; sub(/^\*\*g-cloud lot\*\*:[ \t]*/, "", v) }
        else if (l ~ /^\| *\**(target )?lot\** *\|/) { v = l; sub(/^\| *\**(target )?lot\** *\|[ \t]*/, "", v); sub(/\|.*/, "", v) }
        if (v ~ /^(lot ?)?[12]([^0-9ab]|$)|cloud hosting|cloud software/) r[++nr] = "line " FNR ": a lot from the previous three-lot framework"
        if (l ~ /1\.3 target lot/) r[++nr] = "line " FNR ": a Target Lot checkbox from the previous framework"
        if ((l ~ /^#+ / && l ~ /sfia/ && l ~ /rate|pric|card/) || l ~ /^\|.*sfia.*\|.*(rate|£|price)/) r[++nr] = "line " FNR ": an SFIA rate card (G-Cloud 15 prices Lot 3 on the DDaT rate card)"
        if (l ~ /^\| *\**(minimum price|maximum price|pricing unit|billing interval)\** *\|/) r[++nr] = "line " FNR ": a pricing field G-Cloud 15 no longer has"
    }
    END { flush(); printf "previous-framework documents: %d\n", found + 0 }'
```

Warn prominently about every document it reports: it was written for the previous framework and has
to be regenerated with its command before submission, whatever the review report says.

### 4. Assemble the submission folder

Create the `submission/` folder inside the service project and copy the latest version of each
artefact into it. Use bash `mkdir -p` and `cp` (do **not** rewrite document contents — this is a
straight export of the approved files):

```bash
PROJECT_PATH="{path}"
LOT="{lot}"   # this service's lot: 1a, 1b, 2a, 2b or 3
SUBMISSION_DIR="$PROJECT_PATH/submission"
mkdir -p "$SUBMISSION_DIR/evidence"

# Per-service artefacts (latest version of each)
for type in SVCD SDD PRIC SECA GCRV; do
  f=$(find "$PROJECT_PATH" -maxdepth 1 -name "ARC-*-$type-v*.md" 2>/dev/null | sort -V | tail -1)
  [ -n "$f" ] && cp "$f" "$SUBMISSION_DIR/"
done

# Supplier-wide bid documents (latest version of each), and the rate card for a Lot 3 service
for type in SUPP SOCV LOTQ DECL RATE; do
  [ "$type" = RATE ] && [ "$LOT" != 3 ] && continue
  f=$(find projects/000-global/supplier -maxdepth 1 -name "ARC-000-$type-v*.md" 2>/dev/null | sort -V | tail -1)
  [ -n "$f" ] && cp "$f" "$SUBMISSION_DIR/"
done

ls -1 "$SUBMISSION_DIR"
```

If the supplier has evidence files (certificates, terms and conditions, SLAs, the Technical Ability
Certificate) under the project's `external/`, `vendors/`, or `evidence/` directories that the SDD,
security document or lot questions reference, copy them into `submission/evidence/` and list them in
the manifest.

### 5. Write the answers

The supplier declaration, social value and lot questions are entered once per bid, not per service,
so they go in one supplier-level file, never in each service's export.

**Bid answers (supplier level, once per bid).** Check whether they are current:

```bash
BID=projects/000-global/supplier/submission/bid-answers.md
mkdir -p projects/000-global/supplier/submission
# Rewrite bid-answers.md if any supplier-level document is newer than it
if [ -f "$BID" ]; then
    find projects/000-global/supplier -maxdepth 1 -name 'ARC-000-*.md' -newer "$BID" 2>/dev/null | sort
else
    echo "NO BID ANSWERS YET: $BID"
fi
```

Write `bid-answers.md` with the **Write tool** if it doesn't exist; rewrite it if a supplier-level
document is newer than it, or this service's lot group has no section in it yet. Otherwise leave it
and say it is current. It holds, in the order GCA asks them, copied verbatim with every `[PENDING]`
kept visible:

1. **Supplier declaration** from `ARC-000-DECL`, with the social value sections (A understanding, B
   commitment, C organisational readiness, operational readiness, the Social Value Contact) taken
   from `ARC-000-SOCV`.
2. **Lot questions** from each LOTQ Part bid for, one section per lot group. For Lots 1a/1b, give
   each scored answer with its word count against its limit (250 words for each part of Quality
   Cloud Services and Maximising Buyer Value, and for the exit procedure and change of service), as
   plain text with no attachments.
3. **Lot 3 rate card**, if the supplier bids for Lot 3: the maximum day rate, UK and offshore, for
   each role level on `ARC-000-RATE`. It is entered once and shows on every Lot 3 listing.

**Service answers.** Use the **Write tool** to write `{path}/submission/answers-export.md`: this
service's answers, ready to copy into GCA's Digital Platform in the order GCA asks them. It starts
with one line pointing to `projects/000-global/supplier/submission/bid-answers.md` for the
supplier-level answers, and holds only:

1. **Service questions** from `ARC-{PROJECT_ID}-SDD`, in the order of the lot's service questions,
   organised by question section.
2. **Pricing** from `ARC-{PROJECT_ID}-PRIC`, by the lot's pricing model: the 1a/1b price formula
   components and baseline pricing link (1b prices go on the separate non-public platform) or the
   2a/2b discount % for each annual call-off value band. For Lot 3, a line pointing to the rate card
   in the bid answers.

Copy answers verbatim from the documents; never rewrite or invent one.

### 6. Write the submission manifest

Use the **Write tool** to write `{path}/submission/manifest.md` — an index of everything in the
pack, the documents to upload, a pre-submission checklist for the service's lot, and the order of
work for submitting. This manifest is a plain index file: it has **no** ArcKit Document Control
header and **no** `ARC-…-` ID (it is not an ArcKit doc-type). Drop checklist items that don't apply
to the service's lot. Structure:

```markdown
# G-Cloud 15 Submission Pack — [Service Name]

**Service:** [Name] (Project [PROJECT_ID])
**Lot:** Lot [1a / 1b / 2a / 2b / 3] — [lot name]
**Framework:** G-Cloud 15 (RM1557.15), Government Commercial Agency (GCA, formerly CCS)
**Assembled:** [DATE]
**Review status:** [🟢 READY / 🟡 NEEDS WORK / 🔴 NOT READY / ⚠️ Not reviewed]
**Unfinished answers:** [the count the placeholder scan printed, by document, or "None"]

## Pack Contents

| File | Source ARC-ID | Description |
|------|---------------|-------------|
| ARC-000-SUPP-v[X.Y].md | ARC-000-SUPP | Supplier profile |
| ARC-000-SOCV-v[X.Y].md | ARC-000-SOCV | Social value commitments |
| ARC-000-LOTQ-v[X.Y].md | ARC-000-LOTQ | Lot questions (Part [N] applies to this service) |
| ARC-000-DECL-v[X.Y].md | ARC-000-DECL | Supplier declaration |
| ARC-000-RATE-v[X.Y].md | ARC-000-RATE | Lot 3 rate card, shared by every Lot 3 service (Lot 3 only) |
| ARC-[PROJECT_ID]-SVCD-v[X.Y].md | ARC-[PROJECT_ID]-SVCD | Service design |
| ARC-[PROJECT_ID]-SDD-v[X.Y].md | ARC-[PROJECT_ID]-SDD | Service Definition Document |
| ARC-[PROJECT_ID]-PRIC-v[X.Y].md | ARC-[PROJECT_ID]-PRIC | Pricing |
| ARC-[PROJECT_ID]-SECA-v[X.Y].md | ARC-[PROJECT_ID]-SECA | Security evidence |
| ARC-[PROJECT_ID]-GCRV-v[X.Y].md | ARC-[PROJECT_ID]-GCRV | Submission review |
| answers-export.md | — | This service's answers, ready to copy, in GCA's order |
| `projects/000-global/supplier/submission/bid-answers.md` (not copied) | — | The supplier-level answers, shared by every service: declaration, social value, lot questions and the Lot 3 rate card |

## Documents to Upload
Every document must be ODF or PDF/A, at most 5 MB, and accessible.
- [ ] Service definition document (no prices in it)
- [ ] Terms and conditions (one document per service)
- [ ] Pricing document (Lots 1a/1b and 2a/2b; optional on Lot 3, where the rate card carries the prices and 71% of the 27,496 live Lot 3 listings have one)
- [ ] Technical Ability Certificate (all lots)
- [ ] Certificates claimed (Lots 1a/1b: Cyber Essentials Plus, ISO 9001, 27001, 20000-1, Carbon Reduction Plan, ISO 27018 with public cloud; Lots 2a/2b and 3: Cyber Essentials)
- [ ] Penetration test executive summary (on request)

## Pre-Submission Checklist

### Registration and Application
- [ ] Registered on the Central Digital Platform (CDP), with the 12-character PPON
- [ ] Core supplier information complete on the CDP, including the mandatory and discretionary exclusion grounds (Procurement Act 2023, Schedules 6 and 7)
- [ ] Share codes ready for any consortium members and associated persons
- [ ] Digital Marketplace supplier account active
- [ ] G-Cloud 15 open to new suppliers (it reopens after 18 and 36 months, around February 2028 and August 2029)

### Supplier Declaration (ARC-000-DECL)
- [ ] Parent companies
- [ ] Tender information: single supplier or consortium, PPONs and share codes, associated persons, debarment list
- [ ] Exclusion grounds question answered (consistent with the CDP)
- [ ] Subcontractors and legal capacity
- [ ] Payments in contracts above £5m a year
- [ ] Modern slavery
- [ ] Social value sections A–C and operational readiness, matching ARC-000-SOCV
- [ ] Third-party agent or bid writer visibility answered by you (including any AI-assisted drafting you need to declare)
- [ ] Award form details, connected persons and confirmation

### Social Value (ARC-000-SOCV)
- [ ] Social Value Contact named
- [ ] At least one Model Award Criteria activity selected
- [ ] Evidence for each commitment

### Lot Questions (ARC-000-LOTQ, Part [N])
- [ ] 1a/1b: conditions of participation (reseller or sole control, accreditation reliance, ISO 27018 if the service includes public cloud, trading under 12 months)
- [ ] 1a/1b: each part of Quality Cloud Services (a–b) and Maximising Buyer Value (a–c) ≤ 250 words, parts in order
- [ ] 1a/1b: NCSC guidance, sanctions policies, exit procedure (≤ 250 words), change of service (≤ 250 words)
- [ ] 1a/1b: ISO 9001, 27001, 20000-1, Carbon Reduction Plan; ISO 27018 if the service includes public cloud
- [ ] 2a/2b: user support, data location, penetration testing frequency, data sanitisation
- [ ] 3: user support, staff security clearance checks, clearance level, Cyber Essentials if a buyer requires it
- [ ] Cyber Essentials Plus (1a/1b) or Cyber Essentials (2a/2b, 3) held, or the alternative chosen: mandatory for call-offs, not for the bid. Without it the bid can go in, but no call-off can be awarded

### Service Information
- [ ] Correct lot selected: [1a / 1b / 2a / 2b / 3]
- [ ] Service name entered (≤ 100 characters, no extra keywords)
- [ ] Service description entered (≤ 500 characters)
- [ ] Service categories selected from the lot's category roots
- [ ] Features entered (≤ 10, each ≤ 10 words)
- [ ] Benefits entered (≤ 10, each ≤ 10 words)
- [ ] Supplier type selected (and the organisation resold, for a reseller)
- [ ] All service questions for the lot answered; security answers consistent with the lot questions

### Pricing
- [ ] 1a/1b: baseline price and link, fixed onboarding costs, framework discount, supplier-specific schemes, time-limited discounts (1b: on the separate non-public platform)
- [ ] 2a/2b: unit prices in the pricing document and a discount % for each of the six annual call-off value bands
- [ ] 3: the supplier's one rate card from `ARC-000-RATE`: maximum day rates, UK and offshore, for each role level offered (at least £50), entered once for all Lot 3 services
- [ ] No "price on application", "from £x" or unexplained ranges; prices in GBP
- [ ] Education pricing and free trial answered (where the lot asks)

### Support
- [ ] Support hours, channels (email or ticketing, phone, web chat, AI chatbot) and response times entered
- [ ] Documentation links provided

### Final Checks
- [ ] Preview reviewed, links tested, spell check complete
- [ ] Colleague review complete and sign-off obtained

## Submission Instructions
The order of work, not a screen-by-screen script. GCA's Attachment 2 (How to tender), at <https://www.gca.gov.uk/rm1557-15-g-cloud-15-tender-documents>, shows the exact screens.

1. **Register on the Central Digital Platform:** create or update your organisation, note your 12-character PPON, complete your core supplier information including the exclusion grounds, and get share codes for any consortium members and associated persons.
2. **Start the G-Cloud 15 application:** sign in to your Digital Marketplace supplier account and start the RM1557.15 application while G-Cloud 15 is open to new suppliers (framework details: <https://www.gca.gov.uk/agreements/RM1557.15>).
3. **Complete the supplier declaration:** copy the supplier-level answers from `projects/000-global/supplier/submission/bid-answers.md`, once for the whole bid. Answer the third-party agent or bid writer question yourself.
4. **Answer the lot questions:** for each lot group you bid for, copy the answers from `bid-answers.md` into GCA's Digital Platform, once per lot group. For Lots 1a/1b, paste the scored answers as plain text within their word limits; attachments are not accepted.
5. **Add the service:** select Lot [code] and enter the exact service name from the SDD.
6. **Complete the service questions:** copy each answer from `answers-export.md`, section by section.
7. **Enter pricing:** [Lot 1a/1b: the price formula components and baseline pricing link; 1b prices go on the separate non-public platform / Lot 2a/2b: the discount % for each annual call-off value band / Lot 3: the maximum day rate for each role level, UK and offshore, from `ARC-000-RATE`; the card is entered once and shows on every Lot 3 listing].
8. **Upload documents:** the list above.
9. **Preview and submit** before GCA's deadline for this application window, and note the submission reference.
10. **After submission:** monitor GCA communications and respond to clarification requests by the deadline GCA gives in each request.
```

Fill the table with the **actual filenames copied** in Step 4 (latest versions). Leave unknown
values (dates, deadlines) as `[PENDING]` rather than inventing them.

### 7. Output summary

Print only a short summary (not the manifest contents):

```markdown
## Submission Pack Assembled

**Service:** [Name]
**Lot:** [1a / 1b / 2a / 2b / 3]
**Location:** `{path}/submission/`
**Review status:** [🟢 READY / 🟡 NEEDS WORK / 🔴 NOT READY / ⚠️ Not reviewed — run `/arckit-uk-gcloud:review`]
**Unfinished answers:** [the count the placeholder scan printed, by document, or "None"]

### Pack Contents
- [N] documents copied (supplier profile, social value, lot questions, declaration, SVCD, SDD, pricing, security, review)
- `answers-export.md` — this service's answers, ready to copy, in GCA's order
- `projects/000-global/supplier/submission/bid-answers.md` — the supplier-level answers, shared by every service: [written / refreshed / already current]
- `manifest.md` — index, documents to upload, pre-submission checklist, submission steps

### Documents Still to Upload
- [Each upload from the manifest not yet in `submission/evidence/`]

### Next Steps
1. Work through `submission/manifest.md`
2. Submit through GCA's Digital Platform before the application window's deadline
3. Respond to GCA clarification requests by the deadline GCA gives; queries to info@gca.gov.uk or the contact named in the tender documents
```

## Important Notes

- This is an **export action** — it copies artefacts and writes an index and the answers exports; it
  creates **no** ArcKit doc-type and **no** `ARC-…-` ID for the bundle.
- Run `/arckit-uk-gcloud:review` first; a pack built without a 🟢 READY review carries the warning.
- This command never creates a project — if none is found, direct the user to
  `/arckit-uk-gcloud:service-design`.
- G-Cloud 15 runs from 6 August 2026 to 5 August 2030 and reopens to new suppliers after 18 and 36
  months (around February 2028 and August 2029). Application deadlines are strict: plan ahead.
- Bids are scored: social value is 10% on every lot. Lots 1a/1b: quality answers 80%, price 10%
  (onboarding price and minimum discount). Lots 2a/2b: price 80%, scored on the total of the six
  band discounts (unit prices are not scored). Lot 3: price 80%, where the lowest average day rate
  scores in full.
- The supplier declaration, social value and lot questions are answered once per bid; each service
  then has its own service questions, pricing and documents.
- Prices can be reduced but not increased during the framework (the Lot 1a/1b baseline price can
  move; the framework discount cannot).
- Keep evidence files for the life of the framework and of any call-off contracts, which can run up
  to 5 + 3 years (Lots 1a/1b) or 4 + 2 years (Lots 2a/2b/3).
- This pack does **not** guarantee acceptance by GCA.
