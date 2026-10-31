# Requirements traceability matrix: guide and template

> **Guide Origin**: Official | **ArcKit Version**: [VERSION]

A requirements traceability matrix (RTM) links each requirement to the design, code, tests and operational evidence that deliver it. This guide covers what an RTM is for, what goes in one, how to keep it current, and how `/arckit:traceability` builds one from your project's artefacts.

---

## What a traceability matrix is for

The IIBA's [Global Business Analysis Core Standard](https://www.iiba.org/globalassets/standards-and-resources/core-standard/iiba-core-standard.pdf) describes tracing requirements as analysing and maintaining the relationships between requirements, designs, solution components and other work products, for impact analysis, coverage and allocation. Its purpose is to keep requirements and designs at different levels aligned, and to manage the effects of a change at one level on related requirements.

A traceability matrix is where those links are recorded. It works in two directions:

| Direction | Path | Question it answers |
|-----------|------|---------------------|
| Forward | Requirement → design → implementation → tests | Has everything we committed to been designed, built and tested? |
| Backward | Tests → implementation → design → requirement | Does everything we built and tested trace to a requirement, or is it scope creep? |

---

## What goes in a requirements traceability matrix

| Column | Contents |
|--------|----------|
| Requirement ID and title | The ID from the requirements document, such as `FR-012` or `NFR-SEC-004` |
| Business requirement | The `BR-###` the requirement serves |
| Priority | The requirement's MoSCoW priority |
| Design | The high-level design component and the detailed design module that meet it |
| Implementation | The code, configuration or service that delivers it |
| Tests | The tests that verify it |
| Status | Covered, partially covered, or a gap |

Around the matrix, a useful RTM also reports coverage (the share of requirements with design and test evidence), the gaps, orphan components and tests with no requirement behind them, and the impact of recent requirement changes.

### Matrix Snapshot

| Requirement | Design | Implementation | Tests | Ops |
|-------------|--------|----------------|-------|-----|
| FR-012 Payment approvals | PaymentService (HLD), Approval Workflow (DLD) | `services/payment.py` | `tests/payment/test_approvals.py` | Runbook section 3 |
| NFR-SEC-004 Encryption at rest | Security architecture | Terraform KMS module | `tests/security/test_kms_rotation.py` | `/arckit:secure` evidence |

Gaps appear when any column lacks references.

---

## Keeping the matrix current

A matrix is only useful while it matches the project. Regenerate it when requirements or designs change, and work through the gaps it reports.

### Gap Triage Checklist

- Missing tests? Create stories and flag as release blocker if “MUST” requirement.
- Design mismatch? Update HLD/DLD or retire redundant components.
- Orphan artefacts? Remove or link to new requirements to avoid scope creep.
- Compliance evidence absent? Run relevant commands (`/arckit:secure`, `/arckit:dpia`, `/arckit:ai-playbook`).

### Tips

- Automate matrix generation in CI to detect regressions.
- Use coverage percentages in governance packs and release go/no-go meetings.
- Keep matrix lightweight by referencing artefact IDs/paths rather than copying content.

---

## Using /arckit:traceability

`/arckit:traceability` produces a forward/backward traceability matrix linking requirements to design, implementation, tests, and operational artefacts.

### Inputs

| Artefact | Used for |
|----------|----------|
| Requirements (`ARC-<id>-REQ-v1.0.md`) | Source requirements with IDs |
| Design reviews, diagrams | Map requirement → component |
| Backlog/test evidence | Link to implementation and verification |
| Service design / ops docs | Close the loop to run and monitor |

Run after design reviews or at least once per sprint to maintain coverage.

### Command

```bash
/arckit:traceability Generate traceability matrix for <project>
```

Output: `projects/<id>/ARC-<id>-TRAC-v1.0.md` (traceability matrix with coverage metrics and gap analysis)

> **Auto-versioning**: Re-running this command when a document already exists automatically increments the version (minor for refreshed content, major for changed scope) instead of overwriting.

### Spec Kit delivery evidence

When a delivery team builds with [Spec Kit](https://github.com/github/spec-kit) from an SDD handover pack (`/arckit:arc42-handover`), the matrix gains a **Delivery Trace (Spec Kit)** section. The command reads the `specs/` folder at the repository root, or a separate delivery repository's specs folder:

```text
/arckit:traceability 001 SPECS=../booking-service/specs
```

- **Ownership comes first.** Every project can have an `FR-001`, so a feature counts for a project only when its spec, plan or tasks carry that project's ownership tag, `[ArcKit Project 001]`, and no other project's. The handover pack puts the tag at the top of every feature description, and Spec Kit copies it into the spec.
- **Requirements travel as tags.** In owned features, `[ArcKit FR-012]` tags map requirements to features, and checked task lines that carry a tag show delivery progress. Spec Kit's own per-feature IDs, such as its `FR-001`, are never matched to ArcKit requirements.
- **Gaps are named, not guessed.** A feature with no ownership tag, or with tags for more than one project, is listed as not counted, with the fix. So is a tagged ID the requirements do not contain.

### Coverage targets

The command flags gaps against these targets: MUST requirements should be 100% covered, and SHOULD requirements over 80%. Lower-priority requirements can sit below 50%. A MUST requirement with no coverage is a critical gap, and security or compliance requirements without tests are high-risk gaps.

---

## Useful Links

- [IIBA Global Business Analysis Core Standard](https://www.iiba.org/globalassets/standards-and-resources/core-standard/iiba-core-standard.pdf) (PDF), including the Trace Requirements task
- [Requirements guide](requirements.md), for the requirement types and ID prefixes
