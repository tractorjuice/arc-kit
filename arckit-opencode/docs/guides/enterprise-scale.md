# ArcKit at Enterprise Scale

> **Guide Origin**: Official | **ArcKit Version**: [VERSION]

ArcKit's quick-start docs assume a single repo with a single architecture project. Real enterprises don't look like that. A typical large organisation runs dozens — sometimes hundreds — of applications, each split across multiple repositories, with a central EA function setting principles and standards that downstream teams must follow.

This guide covers how to apply ArcKit in that shape: repo topology, artifact placement, ownership, and avoiding principle duplication across teams.

Tracking issue: [#346](https://github.com/tractorjuice/arc-kit/issues/346).

---

## The Core Pattern: `000-global/` + numbered projects

Every ArcKit repo reserves `projects/000-global/` for **cross-cutting artifacts** — principles, enterprise standards, reference patterns, and common ADRs that apply across every downstream project.

```text
projects/
├── 000-global/
│   ├── ARC-000-PRIN-v1.0.md      # Enterprise architecture principles
│   ├── ARC-000-ADR-001-v1.0.md   # Enterprise-wide decisions (e.g. cloud provider)
│   └── ARC-000-FRAM-v1.0.md      # Reference frameworks (data, security, AI)
├── 001-customer-portal/           # Application project 1
├── 002-billing-platform/          # Application project 2
└── 042-identity-service/          # Application project N
```

Downstream projects **reference** `000-global/` artifacts by Document ID rather than restating them. Traceability stays unambiguous because IDs are scoped (`ARC-000-PRIN-*` is global, `ARC-042-REQ-*` is identity-service-specific).

This is the building block for everything below.

---

## Three Repo Topologies

No single topology fits every enterprise. Pick the one that matches your org boundaries — and be ready to evolve as you learn what governs well.

### Topology 1: Single enterprise-architecture repo

All ArcKit artifacts — global and per-application — live in one repo owned by the EA function.

```text
enterprise-architecture/
└── projects/
    ├── 000-global/
    ├── 001-customer-portal/
    ├── 002-billing-platform/
    └── …
```

| Pros | Cons |
|------|------|
| One source of truth; easy to cross-reference | Scales poorly past ~30 applications |
| Central governance is trivial | App teams feel locked out of "their" artifacts |
| Principles and app artifacts evolve in lockstep | Review bottlenecks on the EA team |

**Use when**: EA is highly centralised, application count is low-to-medium, and solution architects report into the EA function.

### Topology 2: Per-application repos, co-located with code

Each application's ArcKit artifacts live in the same repo as its code, under `projects/NNN-app/`. A separate enterprise-architecture repo holds only `000-global/`.

```text
enterprise-architecture/           # EA-owned
└── projects/
    └── 000-global/

customer-portal/                   # App team-owned
├── src/
└── projects/
    └── 001-customer-portal/

billing-platform/                  # App team-owned
├── src/
└── projects/
    └── 002-billing-platform/
```

| Pros | Cons |
|------|------|
| App teams own their architecture artifacts | Cross-app traceability needs tooling |
| Artifacts evolve with the code that implements them | `000-global/` must be synced downstream (see below) |
| Scales to hundreds of applications | Project numbering needs a registry to stay unique |
| Natural fit for federated governance | EA has less direct editorial control |

**Use when**: Application teams own delivery end-to-end, you already federate ownership of code, and the EA function's job is to set guardrails rather than gate every change.

### Topology 3: Grouped solution-architecture repos (hybrid)

Applications that belong to the same business domain or platform share a `solution-architecture` repo. Enterprise-wide artifacts still live in their own repo.

```text
enterprise-architecture/
└── projects/000-global/

payments-solution-architecture/    # Domain-owned
└── projects/
    ├── 010-payment-gateway/
    ├── 011-fraud-detection/
    └── 012-reconciliation/

identity-solution-architecture/    # Domain-owned
└── projects/
    ├── 040-customer-identity/
    └── 041-workforce-identity/
```

| Pros | Cons |
|------|------|
| Balances central control with domain autonomy | Requires clear domain boundaries |
| Related apps cross-reference easily | Still needs `000-global/` sync |
| Maps cleanly onto platform/team topologies | Domain boundaries drift over time |

**Use when**: You have a platform or domain-driven org structure (e.g. Team Topologies, domain-driven design), and a pure app-per-repo model would fragment closely-related architecture work.

---

## Ownership Model

Whichever topology you pick, assign ownership explicitly:

| Scope | Typical Owner | Review Cadence |
|-------|---------------|----------------|
| `000-global/` principles | Chief Architect / EA function | Annual |
| `000-global/` enterprise ADRs | Architecture Review Board | Per-decision |
| `000-global/` reference frameworks | EA + SMEs (security, data, AI) | Quarterly |
| Solution-level artifacts | Solution / Domain Architect | Per-project |
| Application-level artifacts | Application team's architect or tech lead | Per-release |

The Document Control header in every ArcKit artifact has `Owner`, `Reviewed By`, and `Approved By` fields — use them. They're the audit trail.

---

## Avoiding Principle Duplication

The single biggest anti-pattern at enterprise scale is copy-pasting `000-global/ARC-000-PRIN-v1.0.md` into every downstream repo. It drifts, creates false authority, and undermines the EA function.

Three approaches that work:

### 1. Reference by Document ID (simplest)

Downstream artifacts cite the global principle by ID:

> NFR-SEC-012 — Shall comply with enterprise principle `ARC-000-PRIN-v1.0#P-07` (zero-trust network access).

No copy. Just a stable pointer. ArcKit's [Citation Traceability](../../arckit-claude/references/citation-instructions.md) pattern handles this out of the box.

### 2. Git submodule / subtree sync

Per-application repos pull `000-global/` in as a git submodule or subtree, read-only:

```bash
git submodule add https://github.com/yourorg/enterprise-architecture projects/000-global
```

App teams can **read** global artifacts but can't modify them. Updates propagate via `git submodule update`. Works well for Topology 2.

### 3. CI-enforced sync with a manifest

Maintain a `governance-manifest.yaml` in each downstream repo that pins the EA repo commit SHA:

```yaml
enterprise_architecture:
  repo: yourorg/enterprise-architecture
  pinned_sha: a3f8b21
  required_artifacts:
    - ARC-000-PRIN-v1.0.md
    - ARC-000-FRAM-SEC-v1.0.md
```

A CI job (in the EA repo) opens PRs downstream whenever the manifest falls behind. Combine with `/arckit.principles-compliance` to prove conformance on every downstream PR.

---

## Project Numbering at Scale

With a central EA repo (Topology 1) numbering is trivial — the `create-project.sh` script allocates the next free number.

With federated repos (Topologies 2 and 3), you need a **registry** so project IDs stay unique across the enterprise. Options:

- **Shared spreadsheet or wiki page** — low-tech, works up to ~50 apps
- **Lightweight registry service** — issues IDs on request; stores `id → repo` mapping
- **Namespaced IDs** — prefix per domain (`PAY-010-REQ-*`, `IAM-040-REQ-*`) to decentralise allocation (note: this requires a small tweak to `scripts/bash/generate-document-id.sh`)

Pick the lightest option that your auditors will accept.

---

## ArcKit + Spec Kit Handoff

ArcKit and [Spec Kit](https://github.com/github/spec-kit) operate at different altitudes:

- **ArcKit** — the governance layer: principles, requirements, stakeholders, ADRs, business cases, procurement, compliance.
- **Spec Kit** — the implementation layer: specification-driven delivery of a given piece of software.

A natural pipeline:

```text
ArcKit                                 Spec Kit
───────                                ────────
/arckit.requirements   ──(FR/NFR)──▶  /spec-kit specify
/arckit.data-model     ──(DR)─────▶  /spec-kit plan
/arckit.adr            ──(constr.)─▶  /spec-kit tasks
                                      /spec-kit implement
/arckit.conformance   ◀─(evidence)── (built artifacts)
```

Keep requirement IDs (`FR-xxx`, `NFR-xxx`, `DR-xxx`) in the Spec Kit spec frontmatter so traceability survives the handoff.

---

## Worked Example (placeholder)

We're looking for a real-world enterprise case study to anchor this guide — ideally a large org with 50+ applications across multiple repos, Topology 2 or 3. If that's you, leave a comment on [issue #346](https://github.com/tractorjuice/arc-kit/issues/346); we'll anonymise however you need.

---

## Related Guides

- [ArcKit Init](init.md) — bootstrapping a new repo
- [Knowledge Compounding](knowledge-compounding.md) — reusable vendor profiles across projects
- [Conformance](conformance.md) — proving downstream artifacts meet upstream principles
- [Traceability](traceability.md) — linking requirements across artifacts
