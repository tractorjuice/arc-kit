## Reconciliation Cadence and Sign-Off Chain

**Reconciliation frequency**: {{RECONCILIATION_FREQUENCY}}

### Position Reconciliation Steps

Position reconciliation compares the **safeguarded balance** (designated bank account balance) to
the **client-money obligation** (sum of customer ledger balances).

1. {{RECON_STEP_1_DESCRIPTION}} — owner: {{RECON_STEP_1_ROLE}}
2. {{RECON_STEP_2_DESCRIPTION}} — owner: {{RECON_STEP_2_ROLE}}
3. {{RECON_STEP_3_DESCRIPTION}} — owner: {{RECON_STEP_3_ROLE}}

<!-- Add additional reconciliation steps as needed -->

### Break Analysis Cadence and Ownership

Break analysis investigates the individual transactions or postings that explain any reconciliation
variance. The FCA expects firms to perform break analysis distinct from (and in addition to) the
position reconciliation itself.

| Field | Value |
|-------|-------|
| **Break analysis cadence** | {{BREAK_ANALYSIS_CADENCE}} |
| **Break analysis owner** | {{BREAK_ANALYSIS_OWNER_ROLE}} |
| **Break aging escalation threshold** | {{BREAK_AGING_ESCALATION_THRESHOLD}} |
| **Break analysis evidence format** | {{BREAK_ANALYSIS_EVIDENCE_FORMAT}} |

### Intraday Reconciliation (firms processing >£10m/day) — OPTIONAL

*Complete this section if the firm processes more than £10m in relevant funds per business day,
or if the FCA Approach Document (May 2026 edition) supervisory expectations otherwise apply. Mark
N/A if the firm operates below the intraday-cadence threshold.*

| Field | Value |
|-------|-------|
| **Intraday reconciliation applicable?** | {{INTRADAY_APPLICABLE}} |
| **Intraday reconciliation frequency** | {{INTRADAY_FREQUENCY}} |
| **Intraday cut-off windows** | {{INTRADAY_CUTOFF_WINDOWS}} |
| **Intraday sign-off owner** | {{INTRADAY_SIGNOFF_OWNER_ROLE}} |
| **Intraday variance escalation threshold** | {{INTRADAY_VARIANCE_ESCALATION_THRESHOLD}} |

### Sign-Off Chain

| Tier | Role | Trigger | SLA |
|------|------|---------|-----|
| 1 | {{TIER_1_ROLE}} | Daily close | {{TIER_1_SLA}} |
| 2 | {{TIER_2_ROLE}} | Variance > {{TIER_2_VARIANCE_THRESHOLD}} | {{TIER_2_SLA}} |
| 3 | {{TIER_3_ROLE}} | Variance > {{TIER_3_ESCALATION_THRESHOLD}} or repeat pattern | {{TIER_3_SLA}} |
| 4 | {{TIER_4_SMF_HOLDER}} | Material shortfall (FCA notification triggered) | {{TIER_4_SLA}} |

**Evidence retention**: 6 years (minimum per FCA SUP 16).

### Variance Handling Protocol

- Surplus: {{SURPLUS_PROCEDURE}}
- Shortfall: {{SHORTFALL_PROCEDURE_INCLUDING_FCA_NOTIFICATION_TRIGGER}}
- Unreconciled position older than {{UNRECONCILED_AGE_DAYS}} days: {{UNRECONCILED_ESCALATION_PROCEDURE}}

### SUP 16 Annex 34A / 34B Field Mapping

Map each FCA monthly safeguarding return field to the firm's source-of-truth data field, so the
return can be produced directly from the reconciliation data without manual transcription. APIs
submit Annex 34A; EMIs submit Annex 34B.

<!-- Map each Annex 34A/34B column to the firm's source-of-truth data field. See
https://www.handbook.fca.org.uk/handbook/SUP/16/ for the current annex specification. -->

| Annex 34A/34B field | Firm source-of-truth field | Source system | Calculation / aggregation |
|---------------------|-----------------------------|---------------|----------------------------|
| Total relevant funds held (period-end) | {{ANNEX_34_TOTAL_RELEVANT_FUNDS_SOURCE}} | {{ANNEX_34_TOTAL_RELEVANT_FUNDS_SYSTEM}} | {{ANNEX_34_TOTAL_RELEVANT_FUNDS_CALC}} |
| Safeguarded balance (designated account) | {{ANNEX_34_SAFEGUARDED_BALANCE_SOURCE}} | {{ANNEX_34_SAFEGUARDED_BALANCE_SYSTEM}} | {{ANNEX_34_SAFEGUARDED_BALANCE_CALC}} |
| Reconciliation variance (period-end) | {{ANNEX_34_VARIANCE_SOURCE}} | {{ANNEX_34_VARIANCE_SYSTEM}} | {{ANNEX_34_VARIANCE_CALC}} |
| Number of breaks in period | {{ANNEX_34_BREAK_COUNT_SOURCE}} | {{ANNEX_34_BREAK_COUNT_SYSTEM}} | {{ANNEX_34_BREAK_COUNT_CALC}} |
| Material shortfall events in period | {{ANNEX_34_SHORTFALL_EVENTS_SOURCE}} | {{ANNEX_34_SHORTFALL_EVENTS_SYSTEM}} | {{ANNEX_34_SHORTFALL_EVENTS_CALC}} |

<!-- Add additional Annex field-mapping rows as the firm's submission template requires -->
