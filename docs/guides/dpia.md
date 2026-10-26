# Data protection impact assessment (DPIA): when you need one and how

> **Guide Origin**: Official | **ArcKit Version**: [VERSION]

A data protection impact assessment (DPIA) is how you find and reduce the data protection risks of a project. UK GDPR requires one before any processing that is likely to result in a high risk to individuals. This guide covers when a DPIA is required, what it must contain, the ICO's steps for doing one, and how `/arckit:dpia` drafts one.

> **Guidance under review**: the ICO says its DPIA guidance is under review because of changes made by the Data (Use and Access) Act. Check the ICO pages linked below before you rely on a detail.

---

## When a DPIA is required

[Article 35 of UK GDPR](https://www.legislation.gov.uk/eur/2016/679/article/35) says the controller must carry out a DPIA before starting processing that is likely to result in a high risk to the rights and freedoms of individuals. This applies to any controller, public or private. Article 35(3) names three cases that always need one:

- A systematic and extensive evaluation of people, based on automated processing (including profiling), that leads to decisions with legal or similarly significant effects.
- Processing special category data, or criminal convictions and offences data, on a large scale.
- Systematic monitoring of a publicly accessible area on a large scale.

The ICO's page [When do we need to do a DPIA?](https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/accountability-and-governance/data-protection-impact-assessments-dpias/when-do-we-need-to-do-a-dpia/) adds two more tests:

- **The ICO's list of high-risk processing**: innovative technology, denial of service, large-scale profiling, biometrics, genetic data, data matching, invisible processing, tracking, targeting of children or other vulnerable individuals, and risk of physical harm. Some of these need a DPIA on their own. Others need one when they are combined with any of the screening criteria below.
- **Nine screening criteria from the European guidelines**: evaluation or scoring; automated decision-making with legal or similar significant effect; systematic monitoring; sensitive data or data of a highly personal nature; data processed on a large scale; matching or combining datasets; data concerning vulnerable data subjects; innovative use or applying new technological or organisational solutions; and preventing data subjects from exercising a right or using a service or contract. In most cases two of these together mean you need a DPIA. The ICO says this is not a strict rule, and one may be enough.

If in doubt, the ICO recommends doing a DPIA. Failing to do one when it is required can lead to enforcement action, including a fine of up to £8.7 million or 2% of global annual turnover if higher ([ICO: What is a DPIA?](https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/accountability-and-governance/data-protection-impact-assessments-dpias/what-is-a-dpia/)).

---

## What a DPIA must contain

Article 35(7) sets the minimum content:

| Content | What it covers |
|---------|----------------|
| Description of the processing | A systematic description of the processing operations and their purposes, including any legitimate interest pursued |
| Necessity and proportionality | Whether the processing is necessary and proportionate to its purposes |
| Risks to individuals | An assessment of the risks to people's rights and freedoms |
| Measures | The safeguards, security measures and other mechanisms planned to address the risks and show compliance |

Article 35 also requires you to seek the advice of your data protection officer (DPO), where you have one, and to seek the views of the people affected or their representatives where appropriate. The ICO expects the DPIA to record the DPO's advice, the residual risk after mitigation, and whether you need to consult the ICO.

---

## How to do a DPIA

The ICO's page [How do we do a DPIA?](https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/accountability-and-governance/data-protection-impact-assessments-dpias/how-do-we-do-a-dpia/) sets out seven steps:

1. Identify the need for a DPIA.
2. Describe the processing.
3. Consider consultation.
4. Assess necessity and proportionality.
5. Identify and assess risks.
6. Identify measures to mitigate the risks.
7. Sign off and record outcomes.

Do the DPIA before processing starts, and early enough to shape the design. The ICO publishes a [sample DPIA template](https://ico.org.uk/media2/migrated/2553993/dpia-template.docx) (Word). Using it is optional: you can adapt it or use your own format if it covers the same elements.

### If a high risk remains

If you cannot reduce a high risk, you must consult the ICO before you start the processing. The ICO's page [Do we need to consult the ICO?](https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/accountability-and-governance/data-protection-impact-assessments-dpias/do-we-need-to-consult-the-ico/) explains what to send. The ICO aims to give written advice within eight weeks, or up to 14 weeks in complex cases. It does not approve a DPIA. Its response can let the processing go ahead, advise further mitigation, issue a warning, or limit or ban the processing.

### Keep it under review

A DPIA is not a one-off exercise. Article 35(11) requires a review at least when the risk of the processing changes.

---

## Using /arckit:dpia

### Minimum Inputs

| Artefact | Purpose |
|----------|---------|
| `ARC-<id>-DATA-v1.0.md` | Supplies PII inventory, lawful basis, retention |
| Stakeholder analysis | Highlights vulnerable groups, consultation needs |
| Risk register | Seeds privacy risk scoring and mitigations |

### Screening Checklist

Tick any of the nine criteria that apply. Two or more usually means a DPIA is needed, and one can be enough. The Article 35(3) cases and some items on the ICO's list need a DPIA regardless (see [When a DPIA is required](#when-a-dpia-is-required)).

- Evaluation or scoring (profiling, ranking, credit risk)
- Automated decisions with legal/significant effect
- Systematic monitoring or surveillance
- Sensitive data or data of a highly personal nature (special category, criminal offence data)
- Large scale processing (volume, geography, duration)
- Dataset matching/combining
- Vulnerable data subjects (children, patients, benefit claimants, etc.)
- Innovative technology (AI/ML, biometrics, IoT)
- Prevents people exercising a right or using a service or contract

ArcKit screens these automatically; use the list to confirm completeness.

### Command

```bash
/arckit:dpia Generate DPIA for <project>
```

Output: `projects/<id>/ARC-<id>-DPIA-v1.0.md`

> **Auto-versioning**: Re-running this command when a document already exists automatically increments the version (minor for refreshed content, major for changed scope) instead of overwriting.

### Action Flow

```text
1. Confirm prerequisites (data model + stakeholders + risks)
2. Run /arckit:dpia
3. Review:
   - Screening result and justification
   - Risk table and residual scores
   - Mitigation action plan and owners
4. Log actions in backlog/assurance tracker
5. Re-run after mitigations; if a high risk remains, consult the ICO before processing starts
```

### Sections to Validate

| Section | Focus | Reviewer |
|---------|-------|----------|
| Screening | Criteria flagged for Article 35 | Data Protection Officer |
| Processing Description | Purposes, categories, data flows | Service Owner / Product |
| Risk & Impact | Harm scenarios, likelihood, severity | Security, Legal |
| Mitigations & Controls | Technical/organisational measures | Engineering & Operations |
| Sign-off | DPO, SIRO/SRO, Project Lead | Governance board |

### Linkages

- Feed mitigation actions into `/arckit:risk` and `/arckit:servicenow`.
- Reference DPIA outcomes in `/arckit:ai-playbook` and `/arckit:secure`.
- Store signed versions with a review cadence. UK GDPR requires a review at least when the risk changes; the ArcKit DPIA also sets a 12-month review trigger.

---

## Useful Links

- [UK GDPR Article 35](https://www.legislation.gov.uk/eur/2016/679/article/35) (legislation.gov.uk)
- [ICO guidance on DPIAs](https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/accountability-and-governance/data-protection-impact-assessments-dpias/)
- [ICO sample DPIA template](https://ico.org.uk/media2/migrated/2553993/dpia-template.docx) (Word)
