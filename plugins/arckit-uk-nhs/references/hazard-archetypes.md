# Hazard archetypes — systematic coverage checklist

> Generation guidance for the DCB0129 / DCB0160 hazard log.
> Walk every family below. For each, either raise at least one hazard in the hazard log or record why the family is not applicable to this product.

| Family | Prompting question |
|---|---|
| Patient identity | Could the wrong patient, context, or record be selected, matched, merged, or displayed? |
| Calculation / algorithm | Could an equation, threshold, rounding rule, unit, or logic path produce a harmful output? |
| Data freshness | Could stale, delayed, cached, or unsynchronised data affect a clinical decision? |
| Data integrity | Could data be corrupted, truncated, duplicated, silently overwritten, or mis-coded? |
| Interoperability | Could an API, interface, or terminology-mapping failure cause missing or wrong clinical information? |
| Access to information | Could clinicians be unable to reach necessary information at the point of care? |
| Alerts / notifications | Could urgent information fail to alert, over-alert, reach the wrong person, or be ignored? |
| Workflow mismatch | Could the product encourage an unsafe workflow, handoff, responsibility, or escalation pattern? |
| Usability / misuse | Could reasonable users misunderstand, misuse, over-trust, or bypass the product? |
| Configuration | Could local settings, thresholds, roles, formularies, or feature flags create unsafe behaviour? |
| Downtime / degraded mode | Could an outage, partial outage, failover, or fallback behaviour harm patients? |
| Auditability | Could an inability to reconstruct a clinical decision impede safety investigation or correction? |
| Security-as-safety | Could a confidentiality, integrity, or availability failure create patient harm? |
| Data migration | Could a migration, import, or export lose, duplicate, or misclassify clinical data? |
| Secondary use / analytics | Could research, analytics, dashboards, or derived data feed back into care unsafely? |
| AI / ML | Could model bias, drift, opacity, poor calibration, or automation bias affect care? |
| Decommissioning | Could retirement or replacement remove access, break continuity, or lose safety evidence? |

Design informed by Dr Marcus Baw's SAFETY.md hazard-workshop skill reference (CC BY-SA 4.0), <https://github.com/pacharanero/SAFETY.md>
