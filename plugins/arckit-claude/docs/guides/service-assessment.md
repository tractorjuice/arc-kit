# GDS Service Standard assessment: the 14 points and how to prepare

> **Guide Origin**: Official | **ArcKit Version**: [VERSION]

The GDS Service Standard sets out 14 points for creating and running UK government services. A service assessment checks that a service meets them. This guide covers when you need an assessment, who runs it, what happens on the day and how `/arckit:service-assessment` prepares your evidence.

---

## The 14 points of the Service Standard

The [Service Standard](https://www.gov.uk/service-manual/service-standard) is published in the GOV.UK Service Manual:

1. [Understand users and their needs](https://www.gov.uk/service-manual/service-standard/point-1-understand-user-needs)
2. [Solve a whole problem for users](https://www.gov.uk/service-manual/service-standard/point-2-solve-a-whole-problem)
3. [Provide a joined up experience across all channels](https://www.gov.uk/service-manual/service-standard/point-3-join-up-across-channels)
4. [Make the service simple to use](https://www.gov.uk/service-manual/service-standard/point-4-make-the-service-simple-to-use)
5. [Make sure everyone can use the service](https://www.gov.uk/service-manual/service-standard/point-5-make-sure-everyone-can-use-the-service)
6. [Have a multidisciplinary team](https://www.gov.uk/service-manual/service-standard/point-6-have-a-multidisciplinary-team)
7. [Use agile ways of working](https://www.gov.uk/service-manual/service-standard/point-7-use-agile-ways-of-working)
8. [Iterate and improve frequently](https://www.gov.uk/service-manual/service-standard/point-8-iterate-and-improve-frequently)
9. [Create a secure service which protects users' privacy](https://www.gov.uk/service-manual/service-standard/point-9-create-a-secure-service)
10. [Define what success looks like and publish performance data](https://www.gov.uk/service-manual/service-standard/point-10-define-success-publish-performance-data)
11. [Choose the right tools and technology](https://www.gov.uk/service-manual/service-standard/point-11-choose-the-right-tools-and-technology)
12. [Make new source code open](https://www.gov.uk/service-manual/service-standard/point-12-make-new-source-code-open)
13. [Use and contribute to open standards, common components and patterns](https://www.gov.uk/service-manual/service-standard/point-13-use-common-standards-components-patterns)
14. [Operate a reliable service](https://www.gov.uk/service-manual/service-standard/point-14-operate-a-reliable-service)

The Service Manual says some problems can't be iterated away. By the time real users use a service, it should always meet accessibility standards and be secure ([how to apply the Service Standard](https://www.gov.uk/service-manual/service-assessments/how-to-apply-the-service-standard)).

## When you need a service assessment

GOV.UK's guidance on [whether you need an assessment](https://www.gov.uk/service-manual/service-assessments/check-if-need-to-meet-service-standard) sets the scope:

- If you're developing a transactional service for central government, you must get it assessed. This applies even if only civil servants will use it.
- A service is transactional if users exchange information, money, permission, goods or services, or submit personal information that changes a government record.
- You won't need an assessment if you build a form on an assured form building platform and expect fewer than 10,000 transactions a year. Your department may still run a lighter review of higher-risk forms.
- Services outside these criteria can ask their department's assessment team for a voluntary assessment.

The Service Manual describes three assessments, one at each move between delivery phases:

| Assessment | When | A pass lets the service |
|------------|------|-------------------------|
| Alpha | At the end of [alpha](https://www.gov.uk/service-manual/agile-delivery/how-the-alpha-phase-works). Alphas tend to last 6 to 8 weeks, so book within a fortnight of starting | Move into beta |
| Beta | At the end of private beta, once you can run the service at scale. Book 6 weeks ahead ([beta phase](https://www.gov.uk/service-manual/agile-delivery/how-the-beta-phase-works)) | Open as a public beta |
| Live | At the end of public beta ([live phase](https://www.gov.uk/service-manual/agile-delivery/how-the-live-phase-works)) | Move into live |

## Who runs the assessment

- **A cross-government panel** assesses the service if it is likely to handle more than 100,000 transactions a year, or if civil servants in more than one organisation will use it.
- **A panel from your department** assesses everything else.
- Your department's assessment team agrees the date with you. It contacts GDS at least 4 weeks ahead when a cross-government panel is needed ([book a service assessment](https://www.gov.uk/service-manual/service-assessments/book-a-service-assessment)).
- Panels are normally a lead assessor, a user researcher, a designer and a technical lead, sometimes with a performance analyst or an AI specialist ([what happens at a service assessment](https://www.gov.uk/service-manual/service-assessments/how-service-assessments-work)).

### Results

| Result | Meaning |
|--------|---------|
| Green | The service meets the standard and can move to the next phase |
| Amber | Not yet met, but the issues aren't critical. The service can move on while you fix them, usually within 3 months, tracked in a live 'tracking amber evidence' document |
| Red | Not yet met, and the issues are critical. The service stays in its current phase until it is reassessed |

A cross-government panel sends its report within 3 to 5 working days. A departmental panel may rate the service 'met' or 'not met' instead. GDS publishes outcomes as [Service Standard reports](https://www.gov.uk/service-standard-reports), and you can fact check yours first.

## What changed in 2024 to 2026

- **2024**: the Service Manual changed how assessments are rated (April), giving the green, amber and red results above, and updated who is responsible for arranging assessments (May).
- **1 April 2026**: the [Digital Assurance Playbook](https://www.gov.uk/government/publications/digital-assurance-playbook) replaced the digital and technology spend controls. Organisations now run most of their own assurance. The playbook tells assurers to check that a new service follows the Service Manual, "including through the Service Assessment process". GOV.UK's guidance on whether you need an assessment (last updated September 2024) still says an assessment can be a condition of spend control approval; that wording predates the playbook.
- **September 2026**: new criteria for services that use AI. The service brief must say whether and how the service uses AI. If it does, the panel includes an AI specialist, and you'll be asked about the AI parts of the service and possibly about AI tools you used to design or build it. Services using AI must meet the same standards as any other service ([using AI in services](https://www.gov.uk/service-manual/technology/using-artificial-intelligence-ai-in-services)).

---

## Preparing for an assessment

### What to send before the assessment

The assessment team will ask for a short service brief:

- a description of the service and its users
- a recent prototype or a link to a development environment
- a high-level technical architecture diagram
- whether the service uses AI, and if so how

### Who should attend

The Service Manual recommends at least the service owner, a technical architect or lead developer, a user researcher, a designer and, for beta and live assessments, a performance analyst.

### Prep Checklist

- Evidence heatmap reviewed; gaps assigned owners.
- Show-and-tell deck created (use summary of prep doc).
- Service metrics dashboard ready (alpha/beta) or plan to publish (live).
- Accessibility and security testing signed off.
- Service manual guidance referenced for each point.
- Someone on the team can explain how the service uses AI, if it does.
- Assessment logistics: presenter list, dry run scheduled, Q&A roles agreed.

### Assessment Day Tips

- Assessments usually last about 4 hours. Spend the first 30 minutes on an overview of the service (about 10 minutes) and a walk through the user journey (about 20 minutes). The panel uses the rest of the time for questions.
- Show unhappy paths as well as the happy path, such as users who aren't eligible or can't provide evidence.
- Use real artefacts (screenshots, repo links) rather than talking points.
- Note assessor actions live and add to backlog within 24 hours.
- Update the prep doc with outcomes (green, amber or red, or met or not met; conditions; owners).

---

## Using /arckit:service-assessment

`/arckit:service-assessment` packages evidence for alpha, beta and live assessments against the 14-point Service Standard.

### Command

```bash
/arckit:service-assessment PHASE=<alpha|beta|live> DATE=<YYYY-MM-DD optional>
```

Output: `projects/<id>/ARC-<id>-SVCASS-v1.0.md`.

### Evidence Mapping (Summary)

| Service Standard Area | ArcKit Sources | Notes |
|-----------------------|----------------|-------|
| Understand users & solve the whole problem (Points 1–3) | Stakeholder analysis, requirements, Wardley Maps | Ensure latest research notes attached |
| Simple, accessible service (Points 4–5) | Requirements (WCAG), `/arckit:secure` outputs, journey maps | Include accessibility testing evidence |
| Team & delivery approach (Points 6–8) | Project plan, backlog, retrospectives, vendor governance | Highlight multidisciplinary team and agile cadence |
| Security, privacy, performance (Points 9–10,14) | `/arckit:secure`, `/arckit:dpia`, `/arckit:servicenow`, NFRs | Provide incident response and monitoring plans |
| Technology & openness (Points 11–13) | `/arckit:research`, `/arckit:tcop`, design reviews, repos | Reference open-source/code-reuse commitments |

If the service uses AI, add `/arckit:ai-playbook` and `/arckit:atrs` outputs to the evidence.

---

## Useful Links

- [The Service Standard](https://www.gov.uk/service-manual/service-standard)
- [Check if you need to meet the Service Standard or get an assessment](https://www.gov.uk/service-manual/service-assessments/check-if-need-to-meet-service-standard)
- [Book a service assessment](https://www.gov.uk/service-manual/service-assessments/book-a-service-assessment)
- [What happens at a service assessment](https://www.gov.uk/service-manual/service-assessments/how-service-assessments-work)
- [Published Service Standard reports](https://www.gov.uk/service-standard-reports)
- [Digital Assurance Playbook](https://www.gov.uk/government/publications/digital-assurance-playbook) (in force from 1 April 2026)
