---
hazards:
  - id: H001
    description: "Incorrect patient identity loaded into the product context (wrong-patient hazard)"
    cause: "Identity lookup mismatches similar names / DOBs; failure to confirm NHS Number; clinician selects wrong record from a search result"
    effect: "Clinical decisions or data entries applied to the wrong patient"
    severity: 2
    likelihood: 3
    risk: high
    controls:
      - C001
      - C002
    residual-severity: 2
    residual-likelihood: 5
    residual-risk: low
    status: open
    cso-reviewed: false
    date-raised: "[YYYY-MM-DD]"
    date-closed:
  - id: H002
    description: "Stale clinical data displayed (cache or sync failure)"
    cause: "Local cache served when upstream system has more recent data; eventual-consistency lag exceeds clinical-relevance window"
    effect: "Clinician acts on out-of-date information, e.g. ordering a duplicate test or missing a critical result"
    severity: 2
    likelihood: 3
    risk: high
    controls:
      - C003
      - C004
    residual-severity: 2
    residual-likelihood: 4
    residual-risk: medium
    status: open
    cso-reviewed: false
    date-raised: "[YYYY-MM-DD]"
    date-closed:
  - id: H003
    description: "Missing or incomplete audit trail of clinical decision"
    cause: "Logging not enabled on a code path; log destination unavailable at time of write; PII redaction strips clinical context"
    effect: "Inability to reconstruct what data the clinician saw at the time of decision; harms patient safety investigation and clinician indemnity"
    severity: 3
    likelihood: 3
    risk: medium
    controls:
      - C005
    residual-severity: 3
    residual-likelihood: 5
    residual-risk: low
    status: open
    cso-reviewed: false
    date-raised: "[YYYY-MM-DD]"
    date-closed:
  - id: H004
    description: "Authorisation bypass — clinician sees patient data outside their legitimate clinical relationship"
    cause: "RBAC misconfiguration; role/permission mapping defect; legitimate-relationship check missing on a code path"
    effect: "Confidentiality breach; potential GMC/NMC referral against the clinician; UK GDPR Article 5(1)(f) breach"
    severity: 3
    likelihood: 3
    risk: medium
    controls:
      - C006
      - C007
    residual-severity: 3
    residual-likelihood: 5
    residual-risk: low
    status: open
    cso-reviewed: false
    date-raised: "[YYYY-MM-DD]"
    date-closed:
  - id: H005
    description: "Notification or alert failure (urgent clinical communication not delivered)"
    cause: "Push notification provider outage; user opted out of notifications and not warned of clinical relevance; alert ranking buries critical alert in a queue"
    effect: "Time-critical clinical action delayed or missed"
    severity: 2
    likelihood: 3
    risk: high
    controls:
      - C008
      - C009
    residual-severity: 2
    residual-likelihood: 4
    residual-risk: medium
    status: open
    cso-reviewed: false
    date-raised: "[YYYY-MM-DD]"
    date-closed:
  - id: H006
    description: "Data integrity loss on write (clinical record corruption)"
    cause: "Concurrent-write race condition; partial write under failure; ORM defect serialising clinical data; encoding mismatch"
    effect: "Clinical record becomes inaccurate, incomplete, or unreadable; downstream clinical decisions based on corrupted data"
    severity: 2
    likelihood: 4
    risk: medium
    controls:
      - C010
      - C011
    residual-severity: 2
    residual-likelihood: 5
    residual-risk: low
    status: open
    cso-reviewed: false
    date-raised: "[YYYY-MM-DD]"
    date-closed:

controls:
  - id: C001
    description: "NHS Number is the canonical identifier on every clinical record; PDS lookup with demographic trace required for new-record creation; UI shows NHS Number + DOB + name + first line of address before any clinical action."
  - id: C002
    description: "Two-factor patient identification on search result selection — clinician must confirm NHS Number or scan a wristband/barcode before the patient context loads."
  - id: C003
    description: "Cache TTLs configured per data class with clinical-relevance windows (e.g. observations: 30s, allergies: 5min, demographics: 1hr). Cache age visible to clinician for any non-real-time data shown."
  - id: C004
    description: "Synchronous read-through cache for safety-critical data classes (current medications, active allergies, current observations); cache miss falls back to source-of-truth read, not silent stale return."
  - id: C005
    description: "Append-only audit log written before the clinical action is presented in the UI; log includes user, patient context, data class, action taken, and timestamp. Independent storage from the primary database with retention ≥ 8 years per NHS records management code of practice."
  - id: C006
    description: "Role-based access control enforced at the API layer (not only the UI); RBAC unit tests cover all roles × all resource types; periodic access review."
  - id: C007
    description: "Legitimate-relationship check (or sealed-envelope-style equivalent) on every patient-context load; non-relationship access permitted only via explicit break-glass with audit and notification."
  - id: C008
    description: "Critical clinical alerts use in-app delivery with synchronous acknowledgement, not only push notifications; non-acknowledged critical alerts escalate to a different recipient within a defined SLA."
  - id: C009
    description: "Alert ranking and presentation tested with clinical SMEs to avoid alert fatigue; critical alerts visually distinct and not collapsible."
  - id: C010
    description: "All clinical writes are transactional with optimistic concurrency control on a row-version field; conflicting writes return an explicit clinical-context error to the clinician (not a silent overwrite)."
  - id: C011
    description: "Daily integrity check across clinical record store with automated alerting on hash mismatch; backups verified by restore test on a recurring schedule."
---

# Hazard Log — [PRODUCT_NAME]

> **Template Origin**: Community | **ArcKit Version**: [VERSION] | **Command**: `/arckit:uk-nhs-dcb0129` | **Filename**: `HAZARD-LOG.md` (DCB0129 manufacturer)

## Document Control

| Field | Value |
|---|---|
| **Document ID** | `HAZARD-LOG.md` (Marcus Baw SAFETY.md spec convention; no ARC- prefix) |
| **Document Type** | Hazard Log (DCB0129 manufacturer) |
| **Project** | [PROJECT_NAME] (Project [PROJECT_ID]) |
| **Classification** | [OFFICIAL / OFFICIAL-SENSITIVE] |
| **Status** | DRAFT |
| **Version** | [VERSION] |
| **Created Date** | [YYYY-MM-DD] |
| **Last Modified** | [YYYY-MM-DD] |
| **Review Cycle** | Monthly (hazard logs are *living* documents) |
| **Next Review Date** | [YYYY-MM-DD] |
| **Owner** | [PRODUCT_OWNER_NAME_AND_ROLE] |
| **Reviewed By** | [PENDING — CSO] |
| **Approved By** | [PENDING — CSO] |
| **Distribution** | [DISTRIBUTION_LIST] |

## Risk scoring scales (DCB0129 convention)

- **Severity**: `1` Catastrophic | `2` Major | `3` Considerable | `4` Significant | `5` Minor
- **Likelihood**: `1` Very High | `2` High | `3` Medium | `4` Low | `5` Very Low
- **Risk level**: `unacceptable` | `high` | `medium` | `low`
- **Status**: `open` | `mitigated` | `accepted` | `closed`

> ⚠️ DCB0129 inverts the usual Orange Book convention where 5 = highest. The numbers above carry the opposite meaning from the project risk register.

---

## Hazards

*Rendered from the structured YAML at the top of this file. Keep in sync — edit YAML first, then re-render this table (the `/arckit:uk-nhs-dcb0129` command regenerates both together).*

| ID | Description | Sev | Like | Risk | Controls | Residual Risk | Status |
|---|---|---|---|---|---|---|---|
| H001 | Incorrect patient identity loaded (wrong-patient hazard) | 2 | 3 | HIGH | C001, C002 | LOW | Open |
| H002 | Stale clinical data displayed (cache / sync failure) | 2 | 3 | HIGH | C003, C004 | MEDIUM | Open |
| H003 | Missing or incomplete audit trail of clinical decision | 3 | 3 | MEDIUM | C005 | LOW | Open |
| H004 | Authorisation bypass — clinician sees data outside their relationship | 3 | 3 | MEDIUM | C006, C007 | LOW | Open |
| H005 | Notification / alert failure (urgent communication not delivered) | 2 | 3 | HIGH | C008, C009 | MEDIUM | Open |
| H006 | Data integrity loss on write (clinical record corruption) | 2 | 4 | MEDIUM | C010, C011 | LOW | Open |

## Controls

| ID | Description |
|---|---|
| C001 | NHS Number canonical; PDS lookup on new records; UI shows NHS Number + DOB + name + address before action |
| C002 | Two-factor patient ID on search-result selection (NHS Number confirm or barcode scan) |
| C003 | Per-data-class cache TTLs (observations 30s, allergies 5min, demographics 1hr); cache age visible |
| C004 | Synchronous read-through cache for safety-critical data; cache miss falls back to source-of-truth |
| C005 | Append-only audit log written before clinical action presented; independent storage; ≥ 8yr retention |
| C006 | RBAC enforced at API layer (not only UI); RBAC unit tests cover all roles × resources |
| C007 | Legitimate-relationship check on every patient-context load; break-glass explicit and audited |
| C008 | Critical alerts use in-app sync acknowledgement; non-ack escalates to different recipient on SLA |
| C009 | Alert ranking and presentation usability-tested; critical alerts visually distinct and non-collapsible |
| C010 | Clinical writes transactional with optimistic concurrency control; conflicts return explicit error |
| C011 | Daily integrity check with hash mismatch alerting; backups verified by recurring restore test |

---

## How to extend this hazard log

- Add new hazards to the `hazards:` array in the YAML frontmatter
- Add new controls to the `controls:` array
- Re-render the Markdown tables (or re-run `/arckit:uk-nhs-dcb0129` which regenerates both)
- Have the CSO review each new hazard before flipping `cso-reviewed: true`
- Move hazards through statuses (`open` → `mitigated` → `closed`) as controls are evidenced
- For accepted residual risks above `low`, capture the acceptance rationale in `SAFETY-CASE.md` §5

---

## Important

The six hazards above are a **starter set** drawn from common patterns in NHS digital health products. They are not a substitute for project-specific hazard identification by the CSO and clinical SMEs. Many real products have 30–80 hazards in their log after a proper identification workshop. **A short hazard log is more often a sign of insufficient analysis than of a safe product.**

---

**Generated by**: ArcKit `/arckit:uk-nhs-dcb0129` command
**Generated on**: [YYYY-MM-DD]
**ArcKit Version**: [VERSION]
**Project**: [PROJECT_NAME]
**Model**: [AI_MODEL]
**Spec lineage**: [Marcus Baw SAFETY.md v2.0.0-draft](https://github.com/pacharanero/SAFETY.md)
