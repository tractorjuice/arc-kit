# UAE Federal Overlay Guide

> **Overlay Origin**: Official Baseline | **ArcKit Version**: [VERSION]

The UAE Federal Overlay adds 12 official-baseline commands covering the federal regulatory and digital-government instruments that apply to UAE federal entities, contracted suppliers, and Critical Information Infrastructure (CII) operators. It is anchored on the Cabinet decree of 23 April 2026 mandating that 50% of federal services run on agentic AI by April 2028, and on the federal data, identity, AI, and procurement frameworks that the decree references.

This guide is the entry point. The companion document `uae-overlay-maintenance.md` is the source of truth for citation provenance, known gaps, and the quarterly review cadence.

---

## Purpose

Five jobs in one overlay:

1. Make UAE federal regulatory text easy to apply during architecture work, not bolted on at the end.
2. Embed UAE Smart Data classification into the same Document Control header that UK and Generic ladders already use, controlled by a single `classification_scheme` userConfig value.
3. Capture the four Cabinet instruments (Zero Bureaucracy, Digital Records, Data Sharing, National Priorities Alignment) as first-class artefact types.
4. Ground AI delivery in the UAE Charter for AI and a three-tier autonomy posture so the federal AI mandate has architectural rails, not just slides.
5. Tie procurement to UAE Federal Decree-Law No. 11 of 2023 and the Ministry of Finance Digital Procurement Platform.

---

## When to Use

Use the overlay if any of the following apply to the project:

- The contracting authority is a UAE federal entity (ministry, federal authority, federal council, or federally-owned company).
- The project handles personal data of UAE residents and is in scope of Federal Decree-Law No. 45 of 2021 (PDPL).
- The project provides citizen-facing services that need UAE Pass authentication.
- The system is designated as Critical Information Infrastructure (CII) by the UAE Cybersecurity Council and must align to the Information Assurance Standard (IAS).
- The procurement is run through the Ministry of Finance Digital Procurement Platform.
- The project is one of the agentic-AI pathfinders under the 23 April 2026 Cabinet mandate.

For non-UAE projects the overlay is dormant: existing UK and Generic ladders are unchanged, and Document Control output remains byte-identical to v4.9.4.

---

## Prerequisites

Before running the commands, set the plugin userConfig values:

| userConfig key | Value |
|---|---|
| `governance_framework` | `UAE Federal` |
| `classification_scheme` | `UAE Smart Data` |
| `organisation_name` | the federal entity name |
| `default_classification` | one of `Open`, `Shared`, `Confidential`, `Secret`, `Top Secret` |

The first two values switch the Document Control header into UAE rendering. The third and fourth populate the per-artefact header automatically. With these set, every artefact across the entire toolkit (UAE-specific or otherwise) uses the UAE Smart Data classification ladder.

If you are migrating an existing UK-classified project, run the one-time helper described under [Migration from UK Ladder](#migration-from-uk-ladder) below.

---

## The 12 Commands

### Federal Data and Security

#### `/arckit.uae-classification`

Generates a UAE Smart Data Classification Register for the project, mapping every dataset to one of `Open`, `Shared`, `Confidential`, `Secret`, or `Top Secret` with handling rules and a declassification schedule. Anchored on the UAE Smart Data Framework. Handoffs: `data-model` (per-entity sensitivity tags), `uae-cloud-residency` (residency obligations follow from classification), `uae-data-sharing` (per-share sensitivity).

#### `/arckit.uae-pdpl`

Generates a UAE PDPL (Federal Decree-Law No. 45 of 2021) compliance assessment including DPIA, lawful-basis register, data-subject-rights procedure, and cross-border transfer log. Anchored on the UAE Data Office statutory framework. Handoffs: `risks` (DPIA into the risk register), `uae-data-sharing` (lawful basis into shares), `uae-classification` (PDPL-relevant datasets must be classified).

#### `/arckit.uae-ias`

Generates a UAE IAS Statement of Applicability against the 188 controls (60 management M1 to M6 plus 128 technical T1 to T9), priority-tiered P1 to P4. Anchored on the UAE Cybersecurity Council Information Assurance Standard v2. Handoffs: `risks` (gaps and treatment plan), `uae-cloud-residency` (T-family controls constrain CSP choice).

#### `/arckit.uae-cloud-residency`

Assesses sovereign cloud residency under the UAE National Cloud Security Policy v2. Validates per-classification residency, names approved CSP options (Core42 / G42 sovereign, Microsoft UAE North and Central, TDRA FedNet, e& Sovereign Launchpad on AWS), and captures the shared-responsibility matrix and exit/portability plan. Handoffs: `uae-classification` (depends on it), `adr` (residency decisions captured as ADRs).

### Federal Identity

#### `/arckit.uae-uaepass`

Generates a UAE Pass integration design covering the OIDC/OAuth flow, claim mapping, Basic vs Verified profile selection, the Service Provider onboarding pack, and the e-signature audit trail. Handoffs: `integration` (OIDC endpoints into the integration spec), `adr` (profile selection and e-signature mechanism are architecturally significant).

### Cabinet Instruments

#### `/arckit.uae-zero-bureaucracy`

Generates a Service Catalogue review under the UAE Code for Government Services and the Zero Bureaucracy programme. Captures service catalogue mapping, bureaucracy-elimination baseline, and customer-experience KPIs. Handoffs: `uae-priorities-alignment` (service-level outputs feed the alignment statement).

#### `/arckit.uae-digital-records`

Generates a Digital Records Plan under the UAE Government Services Digital Records Policy. Captures the source-of-truth register per service, retention schedule, and records-as-official-source designation. Handoffs: `data-model` (source-of-truth into entity ownership), `uae-data-sharing` (official-source records feed shares).

#### `/arckit.uae-data-sharing`

Generates a Data Sharing Agreement under the UAE Government Services Data Sharing Policy ("collect once, use securely"). Captures collect-once mapping, federation/API plan, and PDPL lawful basis per share. Handoffs: `integration` (federation mechanisms), `uae-pdpl` (lawful basis into the PDPL assessment).

#### `/arckit.uae-priorities-alignment`

Generates a National Priorities Alignment Statement under the UAE Federal Government Guide. Captures reuse-vs-build justification, capability-reuse register (UAE Pass, FedNet), and strategy alignment to NIS 2031 / AI 2031 / Digital Economy Strategy / We the UAE 2031. Handoffs: `sobc` (alignment into the business case), `uae-uaepass` (reuse becomes integration design).

### AI Governance

#### `/arckit.uae-ai-charter`

Generates a UAE Charter for AI compliance assessment against the 12 principles (human-machine ties, safety, bias mitigation, data privacy, transparency, human oversight, governance/accountability, technological excellence, human commitment, peaceful coexistence, inclusive access, lawful compliance). Handoffs: `uae-ai-autonomy-tier` (charter posture into the per-tier guard-rails), `risks` (gaps into the risk register).

#### `/arckit.uae-ai-autonomy-tier`

Generates a three-tier AI autonomy posture (Tier 1 internal-productivity, Tier 2 investor-facing-with-approval, Tier 3 regulated/financial). Captures per-tier guard-rails, approval gates, audit obligations, and tier-promotion criteria. Handoffs: `adr` (tier-promotion is architecturally significant), `risks` (per-tier residual risks).

### Procurement

#### `/arckit.uae-procurement`

Generates a federal procurement strategy under UAE Federal Decree-Law No. 11 of 2023. Produces ITT/RFP packs against the MoF Digital Procurement Platform templates, an In-Country Value (ICV) plan, the evaluation report structure, and the contract register. Handoffs: `evaluate` (formal supplier evaluation), `sobc` (procurement strategy and ICV into the business case).

---

## The Canonical Chain

For a federal pathfinder project the recommended sequence is:

```text
principles
  → uae-classification
  → uae-pdpl
  → uae-ias
  → uae-cloud-residency
  → uae-uaepass
  → uae-zero-bureaucracy
  → uae-digital-records
  → uae-data-sharing
  → uae-ai-charter
  → uae-ai-autonomy-tier
  → uae-priorities-alignment
  → uae-procurement
  → sobc
  → wardley
  → framework
```

The UAE-specific commands sit between requirements/data-model and the cross-cutting commands (sobc, wardley, framework) that already exist in the toolkit. The handoffs declared in each command's frontmatter render as a `## Suggested Next Steps` section in non-Claude variants and as marketplace-driven follow-ups in Claude Code.

---

## Document Control Rendering

Every artefact carries a Document Control header. The header used to be a hard-coded table per template; from v4.10 it is rendered at command-execution time from a `<!-- DOC-CONTROL-HEADER -->` marker, using the rules in `templates/_partials/RENDERING.md`.

Three rendering paths exist:

| `governance_framework` | `classification_scheme` | Classification ladder rendered |
|---|---|---|
| `UK Gov` | (any) | UK Government: PUBLIC / OFFICIAL / OFFICIAL-SENSITIVE / SECRET / TOP SECRET |
| `Generic` | (any) | Generic: PUBLIC / INTERNAL / CONFIDENTIAL / RESTRICTED |
| `UAE Federal` | `UAE Smart Data` | UAE Smart Data: Open / Shared / Confidential / Secret / Top Secret |

The conditional means the same template renders correctly across jurisdictions without per-jurisdiction template duplication. Non-UAE projects produce byte-identical output to v4.9.4.

---

## Migration from UK Ladder

If a project already has artefacts using the UK ladder and you are switching to the UAE Smart Data ladder, run:

```bash
arckit migrate-classification --root projects   # report only, no writes
arckit migrate-classification --root projects --apply  # apply mappings
```

The mapping is:

| From (UK) | To (UAE Smart Data) |
|---|---|
| `PUBLIC` | `Open` |
| `OFFICIAL` | `Shared` |
| `OFFICIAL-SENSITIVE` | `Confidential` |
| `SECRET` | `Secret` |
| `TOP SECRET` | `Top Secret` |

The helper writes a unified diff to stdout. Review it before the `--apply` run. The mapping is intentionally conservative; an architect should verify Confidential and above against the UAE Data Office sensitivity guidance before publication.

---

## Reference Implementation

Test repo `arckit-test-project-v20-uae-moi-ipad` (private, in the `tractorjuice` organisation) is the reference implementation for the overlay. It exercises the full canonical chain end-to-end and is the regression baseline for v20 in the `phase-c-canonical` test pack.

---

## Known Limitations

The maintenance document lists six citations that the overlay flags as not-yet-verified:

1. PDPL Executive Regulation status
2. Smart Data Classifications exact level names
3. UAE Pass Loa-to-eIDAS mapping
4. AWS me-south-1 acceptability under the Cloud Security Policy
5. UAE Central Bank AI guidance
6. Cabinet Affairs vs National Archives ownership of the Digital Records Policy

See `uae-overlay-maintenance.md` for the canonical list and the GitHub issues tracking each gap. Commands that touch these citations carry an inline `[NEEDS VERIFICATION]` marker on the affected paragraph until the gap is closed.

---

## Contributing

The overlay is currently maintained by [@tractorjuice](https://github.com/tractorjuice). A UAE domain co-maintainer is being recruited; the recruiting brief is in `uae-overlay-maintenance.md`. Pull requests touching the `uae-*` paths auto-request review through CODEOWNERS.

If you find a regulatory citation that has shifted, an Executive Regulation that has been gazetted, or a Cabinet Resolution that supersedes a referenced instrument, please open an issue with the source URL and the verified date. The maintenance document's citation register will be updated and the affected commands re-tested.

---

**Generated by**: ArcKit overlay documentation
**ArcKit Version**: [VERSION]
**Companion**: [`uae-overlay-maintenance.md`](./uae-overlay-maintenance.md)
