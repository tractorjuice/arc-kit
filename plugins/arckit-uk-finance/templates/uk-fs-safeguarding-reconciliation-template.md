## Reconciliation Cadence and Sign-Off Chain

**Reconciliation frequency**: {{RECONCILIATION_FREQUENCY}} (minimum: internal and external
safeguarding reconciliations as frequently as necessary and no less than once each reconciliation
day — CASS 15.8.19R and CASS 15.8.42R, from 7 May 2026)

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

### Intraday Reconciliation — OPTIONAL

*Complete this section if the firm has decided to reconcile more than once each reconciliation
day. There is no regulatory volume threshold for intraday reconciliation; record the firm's own
trigger (for example a daily relevant-funds volume) and the reason for it. Mark N/A otherwise.*

| Field | Value |
|-------|-------|
| **Intraday reconciliation applicable?** | {{INTRADAY_APPLICABLE}} |
| **Firm's intraday trigger** | {{INTRADAY_TRIGGER}} |
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

**Evidence retention**: 5 years (CASS 15.8.8R(3): records made under CASS 15 are kept for 5 years
unless a CASS 15 rule states otherwise).

### Variance Handling Protocol

- Surplus: {{SURPLUS_PROCEDURE}}
- Shortfall: {{SHORTFALL_PROCEDURE_INCLUDING_FCA_NOTIFICATION_TRIGGER}} (CASS 15.8.60R: inform the
  FCA in writing without delay where the firm will be unable to, or materially fails to, pay a
  shortfall into a relevant funds account or conduct its reconciliations)
- Unreconciled position older than {{UNRECONCILED_AGE_DAYS}} days: {{UNRECONCILED_ESCALATION_PROCEDURE}}

### Monthly Safeguarding Return (SUP 16 Annex 29BR) Field Mapping

Map each FCA monthly safeguarding return field to the firm's source-of-truth data field, so the
return can be produced directly from the reconciliation data without manual transcription. The
return (REP027) is required by SUP 16.14A, due within 15 business days of each month end, and
its content is set by SUP 16 Annex 29BR. There is one return for authorised PIs, authorised and
small EMIs, credit unions issuing e-money and SPIs that opt in.

<!-- The rows below follow the content list in the FCA Approach Document (May 2026), Chapter 13
(REP027). Check the current form in SUP 16 Annex 29BR at https://handbook.fca.org.uk/handbook/sup16
and in RegData before go-live. -->

| Safeguarding return item | Firm source-of-truth field | Source system | Calculation / aggregation |
|--------------------------|-----------------------------|---------------|----------------------------|
| Amounts of relevant funds safeguarded | {{RETURN_RELEVANT_FUNDS_SOURCE}} | {{RETURN_RELEVANT_FUNDS_SYSTEM}} | {{RETURN_RELEVANT_FUNDS_CALC}} |
| Number of clients for which relevant funds were safeguarded | {{RETURN_CLIENT_COUNT_SOURCE}} | {{RETURN_CLIENT_COUNT_SYSTEM}} | {{RETURN_CLIENT_COUNT_CALC}} |
| Relevant funds bank accounts and relevant assets accounts (and the institutions holding them) | {{RETURN_ACCOUNTS_SOURCE}} | {{RETURN_ACCOUNTS_SYSTEM}} | {{RETURN_ACCOUNTS_CALC}} |
| Any excess or shortfall identified, and adjustments made | {{RETURN_EXCESS_SHORTFALL_SOURCE}} | {{RETURN_EXCESS_SHORTFALL_SYSTEM}} | {{RETURN_EXCESS_SHORTFALL_CALC}} |
| Whether internal and external reconciliations were carried out every reconciliation day | {{RETURN_RECON_COMPLETENESS_SOURCE}} | {{RETURN_RECON_COMPLETENESS_SYSTEM}} | {{RETURN_RECON_COMPLETENESS_CALC}} |
| Notifiable breaches | {{RETURN_BREACHES_SOURCE}} | {{RETURN_BREACHES_SYSTEM}} | {{RETURN_BREACHES_CALC}} |

<!-- Add additional Annex field-mapping rows as the firm's submission template requires -->
