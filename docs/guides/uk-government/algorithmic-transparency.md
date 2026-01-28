# Algorithmic Transparency Recording Standard (ATRS) Guide

`/arckit.atrs` produces the public transparency record required for UK Government algorithmic tools that influence decisions about people.

---

## Command

```bash
/arckit.atrs Create Algorithmic Transparency Record for <AI system>
```

Output: `projects/<id>/ARC-<id>-ATRS-v1.0.md`.

---

## Record Template Highlights

| Section | Content | Source Artefacts |
|---------|---------|------------------|
| Organisation & contacts | Department, senior responsible officer, contact email | Governance plan, project charter |
| Description & purpose | What the algorithm does, why it exists, benefits | `/arckit.story`, `/arckit.sobc` |
| Decision impact | Human oversight, automation level, appeal routes | `/arckit.jsp-936`, service runbooks |
| Data used | Sources, categories, retention, lawful basis | `/arckit.data-model`, `/arckit.dpia` |
| Risk & mitigation | Bias, fairness, security, transparency measures | `/arckit.ai-playbook`, `/arckit.secure`, risk register |
| Publication & review | URL, review cadence, change log | Project plan, communications plan |

---

## Publication Checklist

- Record reviewed by legal, comms, and service owner.
- Sensitive details (security configuration, PII) removed before publication.
- Appeals / challenge process clearly signposted.
- Update schedule agreed (at least annually or after significant changes).
- Link record from GOV.UK service page or relevant policy page.

---

## Alignment

Pair the ATRS record with `/arckit.ai-playbook` and `/arckit.jsp-936` outputs to ensure consistency across ethical, assurance, and transparency artefacts.
