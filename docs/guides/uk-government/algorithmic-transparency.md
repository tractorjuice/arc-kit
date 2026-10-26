# Algorithmic Transparency Recording Standard (ATRS): who must publish and how

> **Guide Origin**: Official | **ArcKit Version**: [VERSION]

The Algorithmic Transparency Recording Standard (ATRS) is how UK public sector organisations publish information about the algorithmic tools they use and why. This guide covers who must publish a record, what a record contains, how it is cleared and published, and how `/arckit:atrs` drafts one.

---

## Who must publish a record

GOV.UK's [ATRS guidance for public sector bodies](https://www.gov.uk/government/publications/guidance-for-organisations-using-the-algorithmic-transparency-recording-standard/algorithmic-transparency-recording-standard-guidance-for-public-sector-bodies) (updated May 2025) sets the scope:

- The ATRS is mandatory for all government departments, and for arm's-length bodies (ALBs) that deliver public or frontline services or directly interact with the general public.
- Within those organisations, it is mandatory for algorithmic tools that have a significant influence on a decision-making process with public effect, or that directly interact with the general public.
- The Data Standards Authority recommends it for the rest of the public sector.

A scope and exemptions policy sets out what can be left out of a record, or when a whole record can be withheld. The guidance generally prefers partial redaction, with an explanation, to not publishing a record at all.

---

## What a record contains

| Tier | Audience | Contents |
|------|----------|----------|
| Tier 1 | The general public, in clear and simple language | One summary information sheet |
| Tier 2 | Specialist audiences, though still public | Eight further sheets: ownership, description, deployment, tool and model specifications, data, and risks |

### Where the evidence comes from

| Section | Content | Source Artefacts |
|---------|---------|------------------|
| Organisation & contacts | Department, senior responsible officer, contact email | Governance plan, project charter |
| Description & purpose | What the algorithm does, why it exists, benefits | `/arckit:story`, `/arckit:sobc` |
| Decision impact | Human oversight, automation level, appeal routes | `/arckit:jsp-936`, service runbooks |
| Data used | Sources, categories, retention, lawful basis | `/arckit:data-model`, `/arckit:dpia` |
| Risk & mitigation | Bias, fairness, security, transparency measures | `/arckit:ai-playbook`, `/arckit:secure`, risk register |
| Publication & review | URL, review cadence, change log | Project plan, communications plan |

---

## Completing and publishing a record

1. Contact your organisation's single point of contact (SPOC) for the ATRS before you start work on a record.
2. Download the [ATRS template](https://www.gov.uk/government/publications/algorithmic-transparency-template) in Excel or Google Sheets format, and keep its format unchanged.
3. Complete it in plain language, ideally checking it with people who have no connection to the tool.
4. Send the completed template to your SPOC or the ATRS team (algorithmic-transparency@dsit.gov.uk) for a readability check.
5. Get written confirmation that the record has passed your organisation's internal sign-off.
6. The ATRS team publishes the record to the [GOV.UK repository of algorithmic transparency records](https://www.gov.uk/algorithmic-transparency-records).

A substantive change to the tool means updating the record, clearing it again and sending the update to the ATRS team.

### Publication checklist

- Record reviewed by legal, comms, and service owner.
- Sensitive details (security configuration, PII) removed before publication.
- Appeals / challenge process clearly signposted.
- Update schedule agreed (at least annually or after significant changes).
- Link record from GOV.UK service page or relevant policy page.

---

## Using /arckit:atrs

```bash
/arckit:atrs Create Algorithmic Transparency Record for <AI system>
```

Output: `projects/<id>/ARC-<id>-ATRS-v1.0.md`. The command drafts the record from your project's artefacts; clearing and publishing it follow the steps above.

---

## Alignment

Pair the ATRS record with `/arckit:ai-playbook` and `/arckit:jsp-936` outputs to ensure consistency across ethical, assurance, and transparency artefacts.

---

## Useful Links

- [ATRS guidance for public sector bodies](https://www.gov.uk/government/publications/guidance-for-organisations-using-the-algorithmic-transparency-recording-standard/algorithmic-transparency-recording-standard-guidance-for-public-sector-bodies) (GOV.UK)
- [ATRS template](https://www.gov.uk/government/publications/algorithmic-transparency-template)
- [Published algorithmic transparency records](https://www.gov.uk/algorithmic-transparency-records)
