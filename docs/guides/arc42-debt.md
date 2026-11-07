# arc42 Technical Debt Register Playbook

> **Guide Origin**: Community | **ArcKit Version**: [VERSION]

`/arckit:arc42-debt` keeps a technical debt register for a system: the shortcuts, deferred fixes, workarounds and outdated parts it carries, what each costs to keep and what it would take to repay. arc42 section 11 lists technical debt beside technical risks. The command consolidates debt the project's artefacts already record, from codebase audits, conformance assessments, design reviews, ADR consequences, accepted risks and principle exceptions. It never invents debt or estimates effort. The command is part of the `arckit-arc42` overlay, which needs the core `arckit` plugin.

---

## When to Use

| Use when any of these apply | Do not use when |
|-----------------------------|-----------------|
| Debt is recorded across several audits, assessments and reviews, and you want one register | No audit, assessment, review, ADR or risk register exists yet: there is nothing to consolidate |
| The arc42 description's section 11.2 is a gap | You want to find new debt in code; run `/arckit:repo-audit` first |
| You need to agree owners and a repayment order for known debt | You need a risk register; use `/arckit:risk` and link the two |

---

## Inputs

An existing project with at least one debt source is required. The command never creates projects and never targets `000-global`.

| Debt source | What it supplies |
|-------------|------------------|
| Codebase audit (`audits/ARC-<id>-CDAU-*.md`) | Findings (`F-NNN`) with dimension, severity and evidence |
| Conformance assessment (`ARC-<id>-CONF-v*.md`) | Known and untracked architecture debt (`ATD-NNN`), deviations and expired exceptions |
| HLD and DLD reviews (`reviews/`) | Conditions, deferred items and findings |
| ADRs (`decisions/`) | Negative consequences a decision accepted; superseded decisions not yet migrated |
| Risk register (`ARC-<id>-RISK-v*.md`) | Risks accepted as trade-offs |
| Principles compliance | Approved exceptions (`EXC-NNN`) and their expiry dates |

The previous version of the register, if any, keeps item IDs, owners and statuses stable. The command asks no questions, so it also runs unattended.

---

## Command

```text
/arckit:arc42-debt <project ID or name>
```

Output: `projects/<id>-<name>/ARC-<id>-DEBT-v1.0.md`. A re-run writes the next version beside the earlier one.

---

## How the Register Is Built

- **One item per gap.** When an audit finding and a conformance item describe the same workaround, they become one item that links both.
- **Debt and risk stay apart.** Debt is already true; a risk may happen. Where a risk exists because of a debt item, the two are linked.
- **Each item** (`TD-NNN`) has a category (architecture, code, test, infrastructure, dependency, security, data or documentation), an origin (deliberate or inadvertent), its interest (what keeping it costs now), its principal (what repaying it takes), severity, status, owner, due date and sources.
- **Never estimated.** Interest, principal and severity come from the sources; a value no source states is "Not stated" or "Not rated".
- **Repayment candidates** are the items the sources show are blocking a quality goal or a decision. The list is marked "Proposed"; the order is the team's decision.

---

## Deliverable Snapshot

| Section | Contents |
|---------|----------|
| Summary | Items by category, origin and severity; overdue or expired items |
| Register | One row per item with its status, owner, due date and linked IDs |
| Item Details | Interest, principal, affected building blocks and sources per item |
| Repayment Candidates | Up to five proposed items, with why each blocks a goal or decision |
| Gap Register, Source Artefacts, Assumptions | Areas with no debt source, what was read, and the defaults taken |

---

## Review Checklist

- Every item links the source that recorded it.
- No duplicate items remain across audit, conformance and review findings.
- No interest, principal or severity has been estimated.
- Items repaid since the last version are marked Resolved, not deleted.

---

## Next Steps

- `/arckit:repo-audit` - Audit the codebase to find debt no artefact records yet.
- `/arckit:conformance` - Surface known and untracked architecture debt.
- `/arckit:risk` - Record debt whose interest is a risk.
- `/arckit:arc42` - Re-assemble the arc42 description so section 11.2 cites this register.
