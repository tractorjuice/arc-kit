# Non-functional requirements and the business requirements document

> **Guide Origin**: Official | **ArcKit Version**: [VERSION]

A requirements document records why a change is needed, what the solution must do and how well it must do it. This guide explains business, functional and non-functional requirements, with examples for UK public services, and how `/arckit:requirements` writes them into one document.

---

## Types of requirement

The International Institute of Business Analysis (IIBA) classifies requirements into four types in its [Global Business Analysis Core Standard](https://www.iiba.org/globalassets/standards-and-resources/core-standard/iiba-core-standard.pdf), an abridged version of the foundational concepts in the BABOK Guide:

| Type | IIBA definition | Where ArcKit records it |
|------|-----------------|-------------------------|
| Business requirements | Goals, objectives and outcomes that describe why a change has been initiated | `BR-###` |
| Stakeholder requirements | The needs of stakeholders that must be met to achieve the business requirements | Stakeholder goals from `/arckit:stakeholders`, which each requirement traces to |
| Solution requirements: functional | The capabilities a solution must have, in terms of the behaviour and information it will manage | `FR-###`, plus `INT-###` for interfaces and `DR-###` for data |
| Solution requirements: non-functional | Conditions under which a solution must remain effective, or qualities it must have. Also called quality of service requirements | `NFR-<category>-###` |
| Transition requirements | Temporary capabilities and conditions needed to move from the current state to the future state, such as data conversion, training and business continuity | Data migration requirements in the data section |

### The business requirements document

A business requirements document (BRD) holds the business requirements for a change: the goals and outcomes it must achieve. IIBA's [requirement types guide](https://www.iiba.org/contentassets/38e412c7b77d456297d953de5bf5ca61/requirement-types-infograph.pdf) says business requirements are written at a strategic level and should not contain solution elements.

ArcKit keeps business, functional, non-functional, integration and data requirements in one document. Each solution requirement can then trace back to the business requirement and the stakeholder goal it serves.

---

## Non-functional requirements

A non-functional requirement (NFR) says how well the solution must work, not what it does. Write each one so it can be measured and tested, for example "95% of searches return in under 2 seconds" rather than "the system must be fast".

ArcKit's requirements template groups NFRs by category:

| Category | Prefix | Example |
|----------|--------|---------|
| Performance | `NFR-P-###` | P95 page response under 500ms at expected peak load |
| Availability and resilience | `NFR-A-###` | 99.9% availability, with recovery objectives for a regional outage |
| Scalability | `NFR-S-###` | Handle three times today's peak users without redesign |
| Security | `NFR-SEC-###` | Multi-factor authentication for all administrative access |
| Compliance and regulatory | `NFR-C-###` | Processing meets UK GDPR, with a completed DPIA |
| Usability and accessibility | `NFR-U-###` | Meets WCAG 2.2 Level AA |
| Maintainability and supportability | `NFR-M-###` | Structured logs and metrics for every service |
| Portability and interoperability | `NFR-I-###` | Public APIs follow open standards and are documented |

### Accessibility is a legal requirement for public services

GOV.UK's guidance on [accessibility requirements for public sector websites and apps](https://www.gov.uk/guidance/accessibility-requirements-for-public-sector-websites-and-apps) says they must meet the WCAG 2.2 AA standard, under the Public Sector Bodies (Websites and Mobile Applications) (No. 2) Accessibility Regulations 2018, and must publish an accessibility statement. The [Service Manual](https://www.gov.uk/service-manual/helping-people-to-use-your-service/understanding-wcag) says government services must achieve WCAG 2.2 level AA. Record this as an NFR with its own acceptance criteria.

---

## Reviewing a requirements document

### Review Checklist

- Every requirement includes acceptance criteria and traceability references (stakeholder IDs, risks, principles).
- Conflicts and dependencies are called out (e.g. BR vs NFR tension).
- Regulatory obligations (TCoP, GDPR, WCAG, PCI-DSS) are captured explicitly.
- Integration requirements specify protocols, authentication, and error handling.
- Data requirements include lawful basis and retention aligned with DPIA outputs.

---

## Using /arckit:requirements

`/arckit:requirements` produces a single living document covering business, functional, non-functional, integration, and data requirements.

### Preparation

| Artefact | Why it matters |
|----------|----------------|
| Stakeholder analysis | Links goals and success criteria |
| Architecture principles | Provides constraints and validation gates |
| Risk register | Captures early compliance and delivery risks |

### Command

```bash
/arckit:requirements Create requirements for <project>
```

Output: `projects/<id>/ARC-<id>-REQ-v1.0.md`.

> **Auto-versioning**: Re-running this command when a document already exists automatically increments the version (minor for refreshed content, major for changed scope) instead of overwriting.

### Requirements Matrix

| Type | Prefix | Purpose | Example prompts |
|------|--------|---------|-----------------|
| Business | `BR-###` | Outcomes, KPIs, investment cases | “Reduce payment processing costs by 30%” |
| Functional | `FR-###` | User-facing features & flows | “Process card payments and provide receipts” |
| Non-Functional | `NFR-<category>-###` | Performance, security, availability, accessibility | “P95 latency < 500ms”, “WCAG 2.2 AA” |
| Integration | `INT-###` | Interfaces with external systems | “Integrate with HMRC PAYE API” |
| Data | `DR-###` | Entities, retention, PII | “Store audit logs for 7 years encrypted at rest” |

Every requirement gets a MoSCoW priority (MUST_HAVE, SHOULD_HAVE, COULD_HAVE or WONT_HAVE), testable acceptance criteria and a rationale.

### After Generation

1. Workshop with stakeholders to confirm priorities and resolve conflicts.
2. Feed requirements into `/arckit:sow`, `/arckit:diagram`, `/arckit:backlog`.
3. For data mesh architectures, DR-xxx requirements inform `/arckit:data-mesh-contract` SLAs and quality rules.
4. Re-run the command whenever scope changes; commit deltas for audit.
5. Pair with `/arckit:traceability` to ensure design, tests, and operational artefacts stay aligned.

---

## Useful Links

- [IIBA Global Business Analysis Core Standard](https://www.iiba.org/globalassets/standards-and-resources/core-standard/iiba-core-standard.pdf) (PDF)
- [Accessibility requirements for public sector websites and apps](https://www.gov.uk/guidance/accessibility-requirements-for-public-sector-websites-and-apps) (GOV.UK)
- [Traceability guide](traceability.md), for linking requirements to design and tests
