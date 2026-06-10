---
description: Generate the supplier declaration for the G-Cloud framework
effort: high
handoffs:
  - command: /arckit:review
    description: Validate the declaration as part of submission completeness
---

> ⚠️ **Community-contributed command** — part of the `arckit-uk-gcloud` overlay, not the
> officially-maintained ArcKit baseline. The supplier declaration is a **LEGAL DOCUMENT** for the
> UK G-Cloud framework: false statements are grounds for exclusion and directors are personally
> liable for accuracy. Output is **not** legal or procurement advice — have it reviewed and signed
> off by an authorised company signatory (and legal counsel where appropriate) before submission.

You are helping a cloud service supplier generate the **supplier declaration** required for UK
G-Cloud Digital Marketplace submissions. The declaration is a **supplier-wide** artefact — it
applies to all services submitted under the framework, so it lives in
`projects/000-global/supplier/` rather than under a per-service project.

## User Input

```text
$ARGUMENTS
```

## Instructions

### 1. Ensure the supplier directory exists and load the supplier profile

The declaration is global to the supplier, not tied to a numbered project. Make sure the directory
exists:

```bash
mkdir -p projects/000-global/supplier
```

Then load the supplier profile so company information can be pre-populated:

```bash
ls -la projects/000-global/supplier/ARC-000-SUPP-v1.0.md 2>/dev/null
```

If it exists, use the **Read tool** to read `projects/000-global/supplier/ARC-000-SUPP-v1.0.md` and
carry the registration details, contacts, certifications, insurance, and modern-slavery status into
the declaration. If it does **not** exist, advise the user to run `/arckit:supplier-profile` first,
then continue by gathering the required company information directly through conversation.

**Citation traceability**: When you draw facts from the supplier profile, from documents the user
has placed under `projects/000-global/supplier/` or an `external/` directory, or from any URL you
fetch (e.g. a published Modern Slavery statement), follow the citation instructions in
`${CLAUDE_PLUGIN_ROOT}/references/citation-instructions.md`. Place inline citation markers next to
the facts they support and populate the **External References** section accordingly.

### 2. Read the declaration template

Use the **Read tool** to read the template:

- `${CLAUDE_PLUGIN_ROOT}/templates/declaration-template.md`

Resolve the `<!-- DOC-CONTROL-HEADER -->` marker and any `{{CLASSIFICATION}}` placeholder per the
rendering rules in `${CLAUDE_PLUGIN_ROOT}/templates/_partials/RENDERING.md` if that partial is
present, defaulting the Classification field to `${user_config.default_classification}` (fall back
to `OFFICIAL` for UK Gov context if unavailable).

### 3. Declaration sections

The G-Cloud supplier declaration covers these mandatory areas. Work through each with the user,
recording their answer for every question. Do not skip or paraphrase the exclusion grounds — they
are reproduced verbatim in the template and each must be answered explicitly.

#### Company Information

- Registered company name
- Company registration number
- DUNS number
- Registered address
- Primary contact details
- Contract notice contact details

#### Service Offerings

- Can provide services from day one of framework
- Services do not include prohibited items
- Services have or support cloud hosting / software / support
- Subcontracting arrangements

#### Grounds for Mandatory Exclusion

Declare that the organisation and directors have NOT been convicted of:

- Conspiracy (Section 1 Criminal Law Act 1977)
- Corruption/bribery (Public Bodies Corrupt Practices Act 1889, etc.)
- Fraud and theft (Theft Act 1968, Fraud Act 2006)
- Organised crime (Proceeds of Crime Act 2002)
- Terrorism (Terrorism Act 2000)
- Money laundering (Proceeds of Crime Act 2002)
- Tax evasion (Criminal Finances Act 2017)

#### Grounds for Discretionary Exclusion

Declare status on:

- Bankruptcy/insolvency
- Grave professional misconduct
- Distorting competition
- Conflict of interest
- Significant deficiencies in prior contracts
- Serious misrepresentation
- Undue influence on contracting authority

#### Modern Slavery

- Modern Slavery Act 2015 compliance
- Statement publication (if turnover >£36m)
- Supply chain due diligence

#### Equality and Diversity

- Equality Act 2010 compliance
- Non-discrimination policies
- Reasonable adjustments

#### Environmental and Social

- Environmental law compliance
- Labour law compliance
- Social responsibility

#### Insurance

- Employers liability insurance
- Professional indemnity insurance
- Public liability insurance

#### Tax Compliance

- Tax obligations current
- GAAR (General Anti-Abuse Rule) compliance
- No tax evasion convictions

#### Data and Confidentiality

- Confidential information handling
- Data protection compliance
- GDPR readiness

#### Framework Terms

- Accept terms and conditions
- Accept terms of participation
- Understand how to ask questions
- Can respond within 10 working days
- Provide accurate information
- Accept publishing of contracts

### 4. Generate the declaration document

Populate every field and answer in the template with the supplier's responses. Leave any unanswered
question as `[PENDING]` rather than assuming a "No" — the supplier must confirm each declaration
explicitly. Record any "Yes" answers and their mitigating detail in the Mitigating Information
section (Part 8) of the template.

Use the **Write tool** to save the completed declaration to:

`projects/000-global/supplier/ARC-000-DECL-v1.0.md`

This is a reusable document — it applies to ALL services submitted under the framework. Do **not**
echo the full document into your response; print only the summary below.

Append the standard ArcKit Document Control footer at the end of the document:

```markdown
---

**Generated by**: ArcKit `/arckit:declaration` command
**Generated on**: [DATE]
**ArcKit Version**: [VERSION]
**Project**: Supplier-wide (000-global)
**Model**: [AI_MODEL]
```

### 5. Verification Checklist

After generating, the supplier MUST verify:

```markdown
## Declaration Verification Checklist

### Mandatory Exclusions
- [ ] Verified no directors convicted of listed offences
- [ ] Checked Companies House for director history
- [ ] Reviewed any past legal proceedings

### Discretionary Exclusions
- [ ] Verified company not bankrupt/insolvent
- [ ] Reviewed any past contract performance issues
- [ ] Checked for any ongoing investigations

### Insurance
- [ ] Employers liability ≥£5m (if applicable)
- [ ] Professional indemnity current
- [ ] Public liability current

### Modern Slavery
- [ ] Statement published (if required)
- [ ] Supply chain reviewed

### Tax
- [ ] All tax obligations current
- [ ] No ongoing HMRC disputes
- [ ] GAAR compliant

### Accuracy
- [ ] All information accurate as of submission date
- [ ] Authorised signatory identified
- [ ] Process for updating if circumstances change
```

### 6. Summary

Print only a short summary (not the full document):

```markdown
## Supplier Declaration Generated

**Supplier:** [Company Name]
**Registration:** [Number]
**DUNS:** [Number]
**Saved to:** `projects/000-global/supplier/ARC-000-DECL-v1.0.md`

### Declaration Status
- Mandatory Exclusions: ✅ None declared
- Discretionary Exclusions: ✅ None declared
- Modern Slavery: ✅ Compliant
- Insurance: ✅ Adequate
- Tax: ✅ Compliant

### Required Actions
1. Legal review recommended before submission
2. Director sign-off required
3. Keep evidence file for each assertion

### Evidence to Maintain
- Certificate of incorporation
- Director details from Companies House
- Insurance certificates
- Modern slavery statement URL
- Tax clearance evidence
```

## Important Notes

- Declaration is a LEGAL DOCUMENT - false statements are grounds for exclusion
- Directors are personally liable for accuracy
- Must be updated if circumstances change during framework period
- CCS conducts spot checks and may request evidence
- Criminal convictions apply to organisation AND individual directors
- "Spent" convictions under Rehabilitation of Offenders Act still apply for some offences
- The declaration is supplier-wide and lives in `projects/000-global/supplier/`, never under a
  per-service project directory
