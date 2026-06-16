# Notifiable Data Breach (NDB) Response Playbook

> **Template Origin**: Community | **ArcKit Version**: [VERSION] | **Command**: `/arckit:au-ndb-playbook`

## Document Control

<!-- DOC-CONTROL-HEADER -->
<!-- Resolved at command-execution time per _partials/RENDERING.md. -->
<!-- Classification line MUST be: -->
<!-- | Classification | UNOFFICIAL / OFFICIAL / OFFICIAL:Sensitive / PROTECTED / SECRET | -->

## Revision History

| Version | Date | Author | Changes | Approved By | Approval Date |
|---------|------|--------|---------|-------------|---------------|
| [VERSION] | [YYYY-MM-DD] | ArcKit AI | Initial creation from `/arckit:au-ndb-playbook` command | PENDING | PENDING |

---

## Executive Summary

[One to two paragraphs: APP entity status, NDB scheme applicability, playbook readiness, last test date, key risks.]

---

## 1. Entity Profile

| Field | Value |
|-------|-------|
| **APP Entity Status** | [Australian Government agency / APP organisation per s 6C / s 6D] |
| **Privacy Officer** | [Name + role + contact] |
| **Accountable Officer for NDB Response** | [Name + role; named single accountable officer] |
| **Business Hours Response Team Lead** | [Name + role + contact] |
| **After-Hours Response Team Lead** | [Name + role + 24/7 contact] |
| **External Legal Counsel** | [Firm name + contact] |
| **Communications Lead** | [Name + role] |
| **CISO / Security Officer** | [Name + role; cross-ref ARC-{P}-AUE8 governance] |
| **Last Tabletop Exercise** | [YYYY-MM-DD] |
| **Last Live Incident** | [YYYY-MM-DD or N/A] |

---

## 2. NDB Eligibility Test (Decision Tree)

```text
Step 1: Has there been unauthorised access to,
         unauthorised disclosure of, or loss of
         personal information?
       │
       ├── No  → Not an eligible data breach. Document as
       │         "incident — not eligible". STOP.
       │
       └── Yes
           │
           ▼
Step 2: Is serious harm likely to result to one
         or more individuals?
         (Financial loss, identity theft, emotional
         distress, physical safety, reputational harm)
       │
       ├── No (assessed conservatively) → Not eligible. Document. STOP.
       │
       └── Yes
           │
           ▼
Step 3: Can the entity remediate through reasonable
         steps to prevent the serious harm?
       │
       ├── Yes → Take reasonable steps. If steps successful, NOT eligible
       │         for notification (document the reasonable-steps action).
       │         If steps fail or cannot be applied in time, return to
       │         Step 2.
       │
       └── No  → ELIGIBLE DATA BREACH.
                 30-day notification clock starts from when reasonable
                 grounds to believe were established (typically Day 0).
                 Notify OAIC + affected individuals.
```

---

## 3. 30-Day Timeline Plan

| Day | Milestone | Owner | Output |
|-----|-----------|-------|--------|
| **Day 0** | Detect → Contain → Activate playbook → Notify Privacy Officer + accountable officer | SOC / detector | Incident ticket, containment evidence |
| **Day 0–1** | Initial scoping → preliminary eligibility assessment → set 30-day clock | Privacy Officer | Eligibility memo (preliminary) |
| **Day 1–3** | Forensic investigation → identify affected individuals + types of personal information involved | Security Officer + Privacy Officer | Scope statement |
| **Day 3–7** | Serious-harm assessment per individual cohort → identify reasonable-steps mitigations | Privacy Officer + Legal | Harm assessment + mitigation list |
| **Day 7–10** | Reasonable-steps execution → re-test eligibility | Security Officer | Mitigation evidence |
| **Day 10–14** | Final eligibility decision → if eligible, draft OAIC notification + individual notifications | Privacy Officer + Legal + Comms | Draft notifications |
| **Day 14–21** | Legal review → executive sign-off → finalise OAIC form + individual notification | Legal + accountable officer | Approved notifications |
| **Day 21–25** | Submit OAIC notification → execute individual notifications | Privacy Officer + Comms | OAIC submission receipt; individual notification log |
| **Day 25–30** | Public statement if required → media response → regulator follow-up | Comms + accountable officer | Public statement; media log |
| **Day 30** | Notification deadline → all required notifications complete | Privacy Officer | Compliance evidence pack |
| **Day 30+** | Post-incident review (within 90 days) → lessons-learned → AUE8/AUISM/AUPIA artefact updates | Privacy Officer + Security Officer | Post-incident review document |

---

## 4. Roles & Responsibilities (RACI)

| Role | Detect | Contain | Assess Eligibility | Notify OAIC | Notify Individuals | Public Statement | Lessons Learned |
|------|--------|---------|---------------------|-------------|--------------------|--------------------|-----------------|
| Privacy Officer | I | I | **R+A** | **R** | **R** | C | **R+A** |
| Security Officer / CISO | I | **R+A** | C | I | I | I | C |
| SOC / Detection team | **R** | C | I | I | I | I | I |
| Accountable Officer (Director / CEO) | I | I | A | A | A | **R+A** | A |
| Legal Counsel | I | C | C | C | C | **R+A** | C |
| Communications | I | I | I | I | C | **R+A** | C |
| Affected business owner | I | C | C | I | I | I | C |

R = Responsible · A = Accountable · C = Consulted · I = Informed

---

## 5. Detection + Containment Procedures

### Detection sources

- SIEM alerts (cross-ref ARC-{P}-AUE8 + ARC-{P}-AUISM Domain 11)
- Customer / data-subject reports (front-line intake to Privacy Officer)
- Vendor / supply-chain notification (cross-ref AUDISP supply-chain provisions)
- Insider report
- Regulator notification
- Media discovery

### Immediate containment

- Isolate affected systems (cross-ref ARC-{P}-AUE8 incident response capability)
- Preserve evidence (logs, system images) per ISM Domain 11 retention
- Engage forensic capability (internal SOC + external IR retainer)
- **Do not** publicly comment until eligibility assessment complete

---

## 6. Assessment Procedure

### Three statutory tests

1. Unauthorised access / disclosure / loss
2. Likely serious harm
3. No reasonable-steps remediation

### Serious-harm criteria (broadly read)

- **Financial harm**: identity theft, financial loss, fraud
- **Emotional / psychological harm**: humiliation, anxiety, stress
- **Physical safety**: violence, intimidation, stalking
- **Reputational harm**: defamation, social impact
- **Discrimination harm**: protected attributes exposure
- **Loss of opportunity**: employment, services, insurance

### Reasonable-steps test

- Encryption recovery (e.g., breach is of encrypted data + key not compromised)
- Wiping recovered devices
- Rapid password reset + MFA enforcement
- Data deletion at recipient (with verification)
- Court order / contractual return of data

If reasonable steps **successful**, document and treat as a non-eligible incident. If **unsuccessful or unavailable**, eligible breach — proceed to notification.

---

## 7. OAIC Notification Form Content

Required fields per OAIC NDB form:

- Entity name + contact details
- Description of the breach (concise factual summary)
- Kind of information involved (PII categories)
- Likely consequences for individuals (serious-harm assessment)
- Recommendations for affected individuals (e.g., change passwords, monitor accounts, contact IDCare)
- Steps the entity has taken / will take to remediate

### Sample notification text (placeholder — adapt per incident)

> [Entity name] regrets to advise that a data breach occurred on [DATE] affecting [INDIVIDUAL COHORT — number + type]. The breach involved [INFORMATION CATEGORY]. The breach is believed to have been caused by [CAUSE]. We have taken the following steps to contain the breach: [STEPS]. Affected individuals are advised to: [RECOMMENDATIONS]. Please contact our Privacy Officer at [CONTACT] with any questions.

---

## 8. Individual Notification Approach

| Aspect | Detail |
|--------|--------|
| **Direct or publication-based** | [Direct preferred where contactable; publication where direct not practicable] |
| **Channel** | [Email primary; SMS / postal mail backup; published notice if required] |
| **Language + accessibility** | [Plain-English; alternative formats on request] |
| **Content** | [What happened, what info, what consequences, what to do, who to contact] |
| **Cohort segmentation** | [Tailor notification by data-subject category if appropriate] |

---

## 9. Communications Plan

| Audience | Channel | Pre-Approved Holding Statement |
|----------|---------|---------------------------------|
| Internal staff | All-staff email + leadership briefing | [Holding statement] |
| Affected individuals | Direct (email/SMS/post) | [Per §8] |
| OAIC | OAIC NDB form | [Per §7] |
| Media | Statement + spokesperson | [Pre-written holding statement] |
| Sector regulator (if applicable — APRA / AHPRA / etc.) | Sector reporting channel | [Per sector requirement] |

---

## 10. Post-Incident Review

Conducted within 90 days of incident closure.

| Aspect | Detail |
|--------|--------|
| **Root cause analysis** | [5-whys methodology] |
| **Control effectiveness review** | [What worked, what didn't] |
| **Artefact updates triggered** | [AUE8 strategy refresh / AUISM domain refresh / AUPIA APP refresh] |
| **Lessons learned cycle** | [Action register; review at next risk forum] |
| **Tabletop exercise refresh** | [Update annual exercise scenario based on incident pattern] |

---

## 11. Coordination With Other Reporting Obligations

| Obligation | Trigger | Timeline | Coordination Note |
|------------|---------|----------|-------------------|
| SOCI cyber incident (if SOCI-covered entity) | Significant operational impact | 12 hours | Runs parallel to NDB; coordinate so 12hr report doesn't pre-commit eligibility position |
| SOCI cyber incident (relevant impact) | Relevant impact | 72 hours | As above |
| DISP-relevant incident | Defence-classified content involvement | 24 hours | Cross-ref ARC-{P}-AUDISP-v* incident reporting |
| Sector regulator (e.g., APRA CPS 234) | Material information security incident | 72 hours | Sector-specific |
| EU GDPR (if EU residents affected) | Personal data breach | 72 hours | Concurrent jurisdiction — legal counsel coordinate |
| NZ Privacy Act (if NZ residents) | Notifiable privacy breach | "As soon as practicable" | Trans-Tasman coordination |

---

## 12. Tabletop Exercise Plan

| Aspect | Detail |
|--------|--------|
| **Cadence** | [Annual minimum; semi-annual recommended] |
| **Last Exercise** | [YYYY-MM-DD] |
| **Next Scheduled** | [YYYY-MM-DD] |
| **Scenario Theme (next exercise)** | [E.g., ransomware on payroll system; insider exfiltration; vendor compromise] |
| **Participants** | [Privacy Officer, Security Officer, Legal, Comms, accountable officer] |
| **Evidence Retention** | [Years; storage location] |

---

## 13. External References

### ArcKit Evidence Integration

| Evidence Area | ArcKit Artefact | How It Supports NDB Response | Gap / Follow-up |
|---------------|-----------------|------------------------------|-----------------|
| Breach data flows | `/arckit:dfd` / ARC-*-DFD-* | Personal-information flows, external entities, stores, disclosure paths, and notification channels | [Gap / follow-up] |
| Affected data scope | `/arckit:data-model` / ARC-*-DATA-* | Personal-information entities, sensitive attributes, retention, owners, and affected cohorts | [Gap / follow-up] |
| Incident workflow | `/arckit:servicenow` / ARC-*-SNOW-* | Incident queues, escalation groups, problem/change workflows, and evidence capture | [Gap / follow-up] |
| Breach risks | `/arckit:risk` / ARC-*-RISK-* | NDB risks, remediation, residual harm, and control treatment ownership | [Gap / follow-up] |
| Notification traceability | `/arckit:traceability` / ARC-*-TRAC-* | Eligibility tests, decisions, notifications, controls, and lessons learned mapped to evidence | [Gap / follow-up] |
| Coverage view | `/arckit:graph-report` | AUNDB coverage across privacy, security, risk, and traceability artefacts | [Gap / follow-up] |

### Document Register

| Doc ID | Filename | Type | Source | Description |
|--------|----------|------|--------|-------------|
| PA88 | Privacy Act 1988 (Cth) Part IIIC | Legislation | legislation.gov.au | NDB scheme statute |
| OAIC-NDB | OAIC NDB scheme guidance | Guidance | oaic.gov.au | Operational guidance |
| AUPIA | ARC-{P}-AUPIA-v* | ArcKit Artefact | projects/ | APP 11 cross-ref |
| AUE8 | ARC-{P}-AUE8-v* | ArcKit Artefact | projects/ | Security baseline |
| AUISM | ARC-{P}-AUISM-v* | ArcKit Artefact | projects/ | Domain 2 (incidents) cross-ref |

### Verification

| Standard | URL | Verification Date |
|----------|-----|-------------------|
| Privacy Act 1988 (Cth) | https://www.legislation.gov.au/Details/C2024C00301 | [YYYY-MM-DD] |
| OAIC NDB Scheme | https://www.oaic.gov.au/privacy/notifiable-data-breaches | [YYYY-MM-DD] |

---

## Visual Evidence Decision Rule

Generate companion visual artefacts only when the available evidence includes enough structure to identify real nodes and relationships. If evidence is incomplete but structurally useful, create a clearly marked draft visual with `Pending Input` labels. If structural evidence is insufficient, do not create a diagram; record a Visual Evidence Gap and list the minimum inputs needed.

---

**Generated by**: ArcKit `/arckit:au-ndb-playbook` command
**Generated on**: [DATE]
**ArcKit Version**: [VERSION]
**Project**: [PROJECT_NAME]
**Model**: [AI_MODEL]
