# O-AA Agile Security Playbook

> **Guide Origin**: Community | **ArcKit Version**: [VERSION]

`/arckit:agile-security` creates an Agile Security document based on Open Agile Architecture (O-AA, C208) Axiom 16 (Secure by Design), C208 Ch. 4.6 and the O-AA Security Playbook (G216). Security becomes backlog work inside the product sprint rhythm rather than a separate gate or phase: the threat model is updated every sprint, compliance evidence is produced alongside development, testing depth follows risk, and continuous validation replaces phase-gate checkpoints. Security is the team's responsibility, not a separate security team's gate. The command is part of the `arckit-oaa` overlay, which needs the core `arckit` plugin.

---

## When to Use

| Use when any of these apply | Do not use when |
|-----------------------------|-----------------|
| The client wants security embedded in the sprint rhythm rather than in separate phases | The client requires a traditional security audit with separate audit phases (use the full TOGAF ADM with a dedicated security phase) |
| The product needs continuous compliance evidence generated with development artefacts | It is a multi-year security programme with 50+ review gates outside the sprint cadence |
| Threat modelling needs to be a backlog item, not a one-off activity | The client needs standalone penetration testing or a security assessment |
| The client is regulated (APRA, GDPR, APP, AI Act) and needs sprint-aligned compliance | |
| AI/ML systems need algorithmic transparency and bias assessment each sprint | |

---

## Inputs

| Artefact | Purpose |
|----------|---------|
| Architecture principles (`ARC-000-PRIN-v*.md`) | Recommended. Security principles, compliance requirements, data classification standards. If missing, the command warns you to run `/arckit:principles` first |
| Agile product architecture (`ARC-<id>-OAPR-v*.md`) | Recommended. Product mission, guardrails, technology constraints |
| O-AA ADM Lite (`ARC-<id>-OAAL-v*.md`) | Recommended. Sprint plan, governance cadence, compliance mapping |
| Agile strategy canvas (`ARC-<id>-OASTR-v*.md`) | Recommended. Risk profile, transformation risks, security strategy |
| Requirements (`ARC-<id>-REQ-v*.md`) | Recommended. Security NFRs (NFR-SEC) that every security story traces to |
| Project external documents (`projects/<id>/external/`) | Read if present. Security policies, compliance requirements, threat models, regulatory obligations |
| Enterprise standards (`projects/000-global/external/`) | Read if present. Security standards, data classification policies, incident response procedures |

---

## Command

```bash
/arckit:agile-security <product or programme name>
```

Output: `projects/<id>/ARC-<id>-OASEC-v1.0.md`

If the named project does not exist, the command creates it. If an OASEC document already exists, it writes a new version (v2.0) instead of overwriting. Sprint artefacts: `security-backlog.yaml`, `threat-model.yaml` and `compliance-evidence.yaml`, with security constraints inherited from the `vision.yaml` of `/arckit:oaa-adm-lite`.

---

## Security in the Sprint

| Area | What the document sets out |
|------|----------------------------|
| Security backlog | Epic categories (data protection, authentication and authorisation, encryption, monitoring, incident response, compliance reporting); a target of 20-30% of sprint capacity, adjusted to risk; stories in the form "As a [role], I want [security control] so that [threat mitigated]" with testable acceptance criteria, each traced to an NFR-SEC requirement |
| Threat modelling | A Sprint 0 model structured by STRIDE category (or a named equivalent), updated each sprint as a backlog item, fed by SAST and DAST tools |
| Compliance evidence | Evidence produced with each feature and mapped to GDPR, APRA, APP and the AI Act; always current, never gathered for an audit |
| Guardrails | Non-negotiable constraints, approved security building blocks, forbidden approaches (such as rolling your own crypto or hardcoded credentials), lightweight sprint-level reviews |
| AI/ML security | ATRS compliance per sprint, automated bias testing in CI/CD, mitigations for model poisoning, data leakage and adversarial attacks, differential privacy or federated learning where applicable |
| Exceptions | A path for a failing security check under delivery pressure: sign-off by severity, accepted risk with a resolution deadline, review at each sprint boundary |

---

## Deliverable Snapshot

| Section | Contents |
|---------|----------|
| Document Control | Document ID, owner, status, classification; review cycle per sprint |
| Trigger Guidance | When to use the template and when not to |
| Core Thesis (G216) | Four continuous security pillars that replace phase-gate checkpoints |
| Pillar 1: Embedded Security Per Sprint | Security activity per sprint ceremony, security story estimation, risk categories |
| Pillar 2: Risk-Based Security Testing Automation | Scan frequency and depth by risk level (critical every commit, high every PR, medium at sprint gate, low weekly), classification rules, test categories |
| Pillar 3: Compliance-as-Code Integration Points | Regulatory controls as executable validation rules feeding `governance-report.yaml` |
| Pillar 4: Continuous Security Validation (Replacing Phase Gates) | Traditional gate against its continuous replacement and evidence; sprint-gate validation pipeline |
| Sprint Security Backlog Template | `security-backlog.yaml`: component risk classification, security stories, security debt |
| Threat Model Per Sprint (STRIDE) | STRIDE questions and `threat-model.yaml`: threats per component with likelihood, impact, mitigating story and residual risk |
| Compliance Evidence Per Sprint | `compliance-evidence.yaml`: evidence per control with owner, requirement, artefact and result |
| Security Architecture Guardrails | Non-negotiable constraints, approved building blocks, anti-patterns, review gates |
| AI/ML Security Considerations | Transparency, bias, model security and privacy activities per sprint |
| Security Exception Path | Sign-off by severity, accepted risk with a resolution deadline, escalation |
| Requirements Traceability (NFR-SEC) | Security stories and threats per NFR-SEC requirement; gaps |
| Security Metrics Dashboard | Posture metrics with thresholds and alerts |
| TOGAF ADM Phase Mapping | Agile security activity for each ADM phase |
| Integration Points | TOGAF Phase G, the organisation's reference documents where they exist, and the agile governance template |
| Example CI Checks (Illustrative) | Pipeline shape only; ArcKit does not ship these tools |
| Risk Assessment | Risks of the approach itself and their mitigations |
| Acceptance Criteria | Checklist for the completed document |
| External References | Document Register (C208 with URL and verification date), citations |

---

## Review Checklist

- Security activities sit inside the sprint rhythm, each with its trigger stated.
- Threat modelling is tied to a sprint event, not an annual review.
- Compliance evidence is a per-sprint output with a named owner.
- The document names the phase gates it replaces and the gates that remain.
- There is an exception path for a failing security check under delivery pressure, with a named sign-off.
- Findings carry a severity and a resolution deadline.
- Security stories trace to NFR-SEC requirements, and untraced requirements are listed as gaps.

---

## Next Steps

- `/arckit:agile-governance` - Establish governance cadence including security review gates.
- `/arckit:agile-strategy` - Align security strategy with the dual transformation dimensions.
