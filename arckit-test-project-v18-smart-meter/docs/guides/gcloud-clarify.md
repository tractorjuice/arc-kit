# G-Cloud Clarification Questions Playbook

`/arckit.gcloud-clarify` analyzes G-Cloud service gaps and generates supplier clarification questions for procurement.

---

## Inputs

| Artefact | Purpose |
|----------|---------|
| Requirements (`ARC-<id>-REQ-v1.0.md`) | What the service must deliver |
| G-Cloud search results | Services being evaluated |
| Architecture principles | Governance standards to verify |
| Security requirements | NCSC, Cyber Essentials requirements |

---

## Command

```bash
/arckit.gcloud-clarify Generate clarification questions for <service>
```

Output: `projects/<id>/ARC-<id>-GCLC-v1.0.md`

---

## Clarification Document Structure

| Section | Contents |
|---------|----------|
| Service Summary | G-Cloud service being evaluated |
| Requirements Mapping | How service maps to requirements |
| Gap Analysis | Requirements not clearly addressed |
| Clarification Questions | Specific questions for supplier |
| Evaluation Impact | How answers affect scoring |

---

## Question Categories

| Category | Purpose | Examples |
|----------|---------|----------|
| Functional | Feature capabilities | "Does the service support X?" |
| Technical | Architecture and integration | "What APIs are available?" |
| Security | Security controls and compliance | "What certifications held?" |
| Commercial | Pricing and terms | "What's included in the price?" |
| Support | Service levels and support | "What SLAs are offered?" |
| Data | Data handling and location | "Where is data stored?" |

---

## Gap Types

| Gap Type | Description | Question Focus |
|----------|-------------|----------------|
| Missing | Requirement not mentioned | Does service support it? |
| Unclear | Vague description | Can supplier clarify? |
| Partial | Some but not all features | What's included/excluded? |
| Conflicting | Service description contradicts | Which is correct? |

---

## One-Page Workflow

| Phase | Key Activities | ArcKit Commands |
|-------|----------------|-----------------|
| Requirements | Define what's needed | `/arckit.requirements` |
| Search | Find candidate services | `/arckit.gcloud-search` |
| Analysis | Generate clarification questions | `/arckit.gcloud-clarify` |
| Clarification | Send questions to suppliers | Manual via Digital Marketplace |
| Evaluation | Score services with answers | `/arckit.evaluate` |

---

## Review Checklist

- Questions reference specific requirements (e.g., NFR-SEC-001).
- Questions are specific and answerable (not vague).
- Security questions cover required certifications.
- Data residency questions asked if relevant.
- Pricing questions clarify what's included.
- SLA questions align with NFR requirements.
- Integration questions cover required APIs.

---

## Digital Marketplace Process

| Step | Description |
|------|-------------|
| 1 | Identify services via G-Cloud search |
| 2 | Generate clarification questions |
| 3 | Submit via Digital Marketplace messaging |
| 4 | Supplier responds (usually 5 working days) |
| 5 | Evaluate responses against requirements |

---

## Key Principles

1. **Requirement Traceability**: Every question links to a requirement.
2. **Specificity**: Avoid vague questions that get vague answers.
3. **Fairness**: Ask same questions to all shortlisted suppliers.
4. **Completeness**: Cover all unclear areas before evaluation.
5. **Documentation**: Record questions and answers for audit trail.
