# Cloud Exit Plan (Clause 3.2) Playbook

> **Guide Origin**: Community | **ArcKit Version**: [VERSION]

`/arckit:nl-exit` produces the Cloud Exit Plan required under clause 3.2 of the Herziening rijksbreed cloudbeleid 2026 (Ministerie van Economische Zaken en Klimaat, 3 July 2026, definitief). The plan is mandatory, documented and self-tested wherever materieel publiek cloudgebruik applies. It covers two scenarios, a planned exit and a disruptive interruption of service, plus destruction of data at the provider after migration, a self-test plan with evidence, an annual review and residual risks. Existing cloud use has a four-year transition; the exit plan itself has a twelve-month production deadline. The command does not decide cloud eligibility: it assumes a hosting decision already exists, or is being justified under clause 4.5(b), and plans the exit from it.

See also: [Netherlands overlay guide](nl-overlay.md)

---

## Inputs

| Artefact | Purpose |
|----------|---------|
| Requirements (`ARC-<id>-REQ-v1.0.md`) | **Mandatory.** System description, hosting model, dependencies, data volumes. The command warns if it is missing. |
| Rijksbreed Cloudbeleid assessment (`ARC-<id>-RBCLOUD-v1.0.md`) | **Recommended.** The materieel cloudgebruik determination that triggers the plan, and whether the plan is being produced to satisfy clause 4.5(b). If missing, the command warns that the trigger is not established and recommends running `/arckit:nl-cloud` first. |
| Risk register (`ARC-<id>-RISK-v1.0.md`) | **Recommended.** Existing provider-concentration or lock-in risks |
| Data model (`ARC-<id>-DATA-v1.0.md`) | **Optional.** Data formats and volumes relevant to portability |
| External documents (`external/`) | Existing provider contracts, service-level agreements, prior exit or continuity plans |
| Global policies (`000-global/policies/`) | Business continuity policy, data retention policy |

---

## Command

```bash
/arckit:nl-exit <project ID or cloud service description>
```

In Claude Code the overlay installs as its own plugin, `arckit-nl`, so the command is `/arckit-nl:nl-exit`.

Example: `/arckit:nl-exit Produce the exit plan for a departmental email and document collaboration service currently in public cloud, no prior exit test conducted`

Output: `projects/<id>/ARC-<id>-NLEXIT-v1.0.md`

---

## The Two Scenarios

| Scenario | Example triggers | What the plan records |
|----------|------------------|-----------------------|
| A — Planned exit | Contract expiry, a policy decision to move | Export method, target environment, timeline, cost (including egress fees and rebuild effort), dependencies, owner |
| B — Disruptive interruption of service | Provider insolvency, a sanctions event, sudden withdrawal of service | The same elements, plus the minimum viable continuity path, RTO and RPO |

Both scenarios are mandatory. A plan that only documents a planned, orderly exit does not satisfy clause 3.2. Scenario B assumes the provider may not cooperate, so if its recovery method depends on the provider actively helping, the command flags that as a gap.

---

## Deliverable Snapshot

| Section | Contents |
|---------|----------|
| Scope Statement | System or service, provider(s) as actually contracted (not an endorsement), trigger, twelve-month production deadline |
| 1. Obligation Statement | What clause 3.2 requires |
| 2. Scenario A — Planned Exit | Trigger conditions, data export method, target environment, timeline, cost, dependencies, owner |
| 3. Scenario B — Disruptive Interruption of Service | Trigger conditions, minimum viable continuity path, data recovery method without provider cooperation, RTO, RPO, dependencies, owner |
| 4. Destruction of Data at the Provider | Contractual destruction clause, method, verification or attestation, logging |
| 5. Self-Test Plan and Evidence | Test cadence, last test date, scope (full dry-run / partial / tabletop), findings, remediation actions |
| 6. Annual Review | Annual cycle, next review date, review owner |
| 7. Residual Risk | Risks such as data-format lock-in and provider non-cooperation, with likelihood, impact and mitigation |
| 8. External References | Herziening rijksbreed cloudbeleid 2026, clause 3.2, in the Document Register with its verification date |

---

## Review Checklist

- The trigger is stated: materieel cloudgebruik per `/arckit:nl-cloud`, clause 4.5(b), or both. With no prior `nl-cloud` assessment, it is an open item, not an invented trigger.
- Scenario A and Scenario B are both documented.
- Scenario B does not depend on provider cooperation and states a minimum viable continuity path with RTO and RPO.
- Destruction of data at the provider has a verification method for both scenarios.
- Self-test evidence is present, or its absence is flagged. A plan with no test evidence is not yet compliant.
- The annual review has a named owner and a next review date.
- Residual risks, including proprietary managed-service coupling, have likelihood, impact and mitigation.
- Qualified counsel, the departmental CISO and CISO Rijk review the output before anyone relies on it.

---

## Next Steps

- `/arckit:nl-cloud` — confirm the materieel cloudgebruik determination that triggered this plan, or satisfy clause 4.5(b), if no `nl-cloud` assessment exists. Where clause 4.5(b) is the trigger, reference this plan from `nl-cloud` Section 3.2; one plan can serve both purposes if it is referenced, not duplicated.
- `/arckit:risk` — add residual exit risks (data-format lock-in, provider non-cooperation under disruption) to the risk register.
