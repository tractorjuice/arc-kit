# ArcKit v5.1: 10 US Federal Civilian Commands, Community Overlay

ArcKit v5.1 ships today. It adds ten commands that cover the US federal civilian regulatory stack, alongside the existing UK, EU, French, Austrian, Canadian, Australian, and UAE work. The marketplace grows from 7 plugins to 8. The total command count grows from 125 to 135.

The release closes the most-requested geographical gap in the toolkit. An architect inside a federal civilian agency, or a vendor pursuing FedRAMP authorisation to sell into one, can now generate a System Security Plan, a FIPS 199 categorisation, a Zero Trust assessment, a §208 Privacy Impact Assessment, and an EO 14028 software attestation from the same pipeline that already handles their UK or EU work.

The trigger was familiar. GitHub stars from US architects, issue traffic, and direct messages from federal agencies and cloud providers all pointed at one gap. ArcKit knew the UK Service Standard cold but had nothing to say about FISMA boundaries, FedRAMP authorisation paths, or the AI policy landscape after EO 14110 was revoked. v5.1 fills that gap, shipped as a community tier release while a US federal civilian co-maintainer is recruited.

## What's in the Release

Ten commands, grouped into five categories. Each one is anchored on a published federal source. None are speculative.

**Categorisation and controls.** `us-fisma-categorization` produces a FIPS 199 categorisation. It walks the project through Confidentiality, Integrity, and Availability impact levels using the NIST SP 800-60 information type catalogue, and records the high water mark. `us-nist-800-53` tailors the SP 800-53 Rev 5 control set against the Low, Moderate, or High baseline. It records every tailoring decision and produces a Statement of Applicability that the SSP author can use directly.

**FedRAMP authorisation.** `us-fedramp-ssp` produces a FedRAMP System Security Plan in the Moderate or High template, with the fifteen sections a 3PAO will read first. `us-fedramp-readiness` produces the 3PAO Readiness Assessment Report. That report is the gate that decides whether a cloud service provider can enter the JAB or Agency authorisation path. The decision itself is captured as an ADR rather than as a single checkbox.

**Operational posture.** `us-zero-trust` runs the CISA Zero Trust Maturity Model v2.0 across all five pillars (Identity, Devices, Networks, Applications and Workloads, Data) and the three cross-cutting capabilities (Visibility and Analytics, Automation and Orchestration, Governance). It places the project on the Traditional, Initial, Advanced, or Optimal level for each pillar and records the OMB M-22-09 commitments by date. `us-icam` produces the Identity, Credential, and Access Management design under OMB M-19-17 and NIST SP 800-63-3, covering the three assurance levels (identity, authenticator, federation), the PIV and login.gov integration shape, and the federation trust framework references.

**AI assurance.** `us-ai-rmf` runs the NIST AI Risk Management Framework across its four functions (Govern, Map, Measure, Manage). When the system uses generative AI, it layers the NIST AI 600-1 Generative AI Profile on top. The output is an AI risk register, a measurement plan, and a recurring management cadence. `us-ai-impact` produces the OMB M-24-10 determination of whether the system is rights impacting or safety impacting, the M-25-21 acquisition impact analysis for procured AI, and the artefacts the Chief AI Officer needs for the federal.ai.gov AI use case inventory.

**Privacy and supply chain.** `us-privacy-pia` produces the E-Government Act §208 Privacy Impact Assessment, applies the OMB M-03-22 guidance, and drafts a Privacy Act §552a System of Records Notice when the system meets the SORN criteria. `us-sbom-eo-14028` produces the secure software self attestation required by EO 14028 and the OMB M-22-18 / M-23-16 chain, generates the SBOM in CycloneDX or SPDX form against the NTIA Minimum Elements, and drafts the CISA Secure Software Attestation Form.

Ten new document type codes are registered across the toolkit: `FIPS199`, `NIST`, `FRSSP`, `FRRR`, `ZTA`, `ICAM`, `AIRMF`, `AIIA`, `USPIA`, `SBOM`. They land in the same registry that the UK, EU, French, Austrian, Canadian, Australian, and UAE codes share, so every hook in the toolkit (file name validation, provenance stamping, manifest update, graph injection) picks them up without any further wiring.

## The us-federal Recipe

The ten commands are not designed to be run individually for a real authorisation push. They are nodes on a dependency graph, and the `us-federal` recipe encodes that graph. Five build waves, twenty targets, run in dependency order:

1. **Baseline.** `principles`, `stakeholders`, `requirements`, `risk` from the official core. The federal commands need these as input.
2. **Controls.** `us-fisma-categorization`, then `us-nist-800-53`. Categorisation drives the tailoring; tailoring drives everything downstream.
3. **Posture.** `us-zero-trust` and `us-icam` run in parallel. Both depend on the tailored control set; neither depends on the other.
4. **AI.** `us-ai-rmf`, then `us-ai-impact`. The framework first, then the agency facing decision.
5. **Authorisation.** `us-privacy-pia`, `us-sbom-eo-14028`, `us-fedramp-readiness`, `us-fedramp-ssp`. The SSP runs last because it consumes every prior artefact.

Run `claude /arckit:build --recipe us-federal` from a project and the orchestrator dispatches one subagent per target per wave, validates the output, commits the wave, and saves progress to `.arckit/state.json`. A long FedRAMP build can pause and resume across sessions without losing work. The same `arckit-build` skill that handles the UK, EU, French, Canadian, Australian, and UAE recipes handles this one. No new infrastructure was needed.

## Why Community Tier

The overlay ships as `[COMMUNITY]` rather than official baseline, for the same reason the UAE overlay did, and the EU and French overlays did before that.

The official tier carries a quality commitment. Every regulatory citation is verified on a quarterly cadence. The regression sweep covers all forty-three public reference repositories. The output meets a bar an architect can hand to counsel without a paragraph of caveats. That commitment needs more than one pair of eyes on a regulatory corpus that moves as fast as federal civilian policy does.

And it does move fast. EO 14110, the headline AI executive order of the previous administration, was revoked in January 2025. The active AI mandates are now OMB M-24-10 (use of AI) and OMB M-25-21 (acquisition of AI). Any AI command that still treats EO 14110 as live policy is wrong on its face. FedRAMP finished its Rev 5 transition in 2024, deprecating the Rev 4 baselines that older guidance still references. OMB M-22-18 and M-23-16 brought secure software self attestation live in 2024, with the CISA attestation form evolving since.

None of those are hard to track on their own. But tracking all of them, at the quality bar the official tier requires, is more than the project owner can credibly do solo while also covering seven other jurisdictions.

The community marker is the honest reading frame. The maintenance guide at `docs/guides/us-federal-overlay.md` carries a citation register: every source, the date it was last verified, and the next scheduled review (2026-08-23 for this release). Three items in this initial release are already flagged for the quarterly review: the M-25-21 URL resolves to an OMB landing page rather than a canonical PDF, the CISA Secure Software Attestation Form URL may have moved, and the FISMA Modernization Act source needs reconfirming. None of those block use of the commands. All of them are visible to anyone who reads the guide first. The `[COMMUNITY]` tag in `/help` and the warning banner before each prompt body make the same signal visible to anyone who runs a command without reading the guide first.

Recruiting a US federal civilian co-maintainer is now the v5.2 priority. The target profile is anyone with a CISO, SAOP, FedRAMP PMO, or CAIO background who can share the quarterly citation review load. Once a co-maintainer joins, the overlay becomes a candidate for promotion to the official tier in a future release. Until then, the community marker stays.

## What's Out of Scope

Three areas are deliberately out of scope for v5.1, and are tracked as candidate sibling overlays.

Federal defence is the first. CMMC, the DoD Risk Management Framework, DISA STIGs, JSIG, and the SP 800-171 CUI baseline for non federal systems all need separate domain ownership. They are candidates for a future `arckit-us-dod` sibling overlay, not part of this one.

State and local regimes are the second. StateRAMP, TX-RAMP, AZ-RAMP, CJIS, IRS Publication 1075, CCPA, and the rest of the state privacy laws each justify their own overlay. State coverage is a natural next layer for vendors who sell to both federal civilian and state agencies.

Sector specific regimes are the third. HIPAA for HHS covered entities, GLBA for financial services, SOX for publicly traded firms, FERPA for education, and PCI DSS for payment card data each layer on top of the federal baseline. They are good candidates for sector specific community contributions in the shape that the EU and French work already demonstrates.

Section 508 accessibility is deferred to v5.2. Until then, use the agency Section 508 guidance and the GSA accessibility resources directly.

## A Pattern That Now Has Eight Worked Examples

The most useful thing about a jurisdiction launch is not the commands themselves. It is the pattern they reinforce for the next contributor.

The shape is now consistent across the UK, EU, French, Austrian, Canadian, Australian, UAE, and US overlays:

1. Pick a country or region code prefix.
2. Write commands that handoff to the official baseline (principles, stakeholders, requirements, risk, sobc, wardley, framework) rather than duplicating it.
3. Register your document type codes in `doc-types.mjs` so every hook picks them up.
4. Ship a build recipe that encodes the dependency graph between your commands as ordered waves.
5. Add a maintenance guide with a citation register and a quarterly review date.
6. Mark the overlay `[COMMUNITY]` until the co-maintainer bench is deep enough to honour the official tier commitment.
7. Open a PR.

Issue traffic identifies the obvious next candidates. India's MeitY and CERT-In framework. Germany's BSI IT-Grundschutz and Vergabeverordnung. Japan's NISC and the Act on the Protection of Personal Information. Singapore's IM8 and Cybersecurity Act. Brazil's LGPD and the GovBR digital identity stack. The African Union Data Protection Convention. Each needs a domain expert contributor willing to take the maintainer role, a handful of jurisdiction specific commands, and the willingness to keep them current as regulations shift.

The pattern is not theoretical. There are eight worked examples to copy.

## How to Use

For users on the existing ArcKit Claude Code plugin, the v5.1.0 update arrives through the marketplace. Run `claude plugin install arckit arckit-us` to install the core plugin and the US overlay together. The ten new commands appear in `/help` with the `[COMMUNITY]` tag and a warning banner before each prompt body runs. Gemini CLI extension users get the same via `gemini extensions update arckit`. Codex, OpenCode, Copilot, and Paperclip users get the commands via their respective extension repos, or via `arckit init`.

The `arckit` core plugin is a hard dependency. Without it, the `us-federal` recipe cannot resolve the foundation commands (`arckit:principles`, `arckit:requirements`, `arckit:risk`), and the file name validation hook will not recognise the ten new US document type codes. On Claude Code v2.1.143 and later, `claude plugin disable arckit` will refuse with a copy pasteable disable chain hint while `arckit-us` is still enabled.

The full release notes are at [github.com/tractorjuice/arc-kit/releases/tag/v5.1.0](https://github.com/tractorjuice/arc-kit/releases/tag/v5.1.0). The maintenance guide and full citation register are at [`docs/guides/us-federal-overlay.md`](https://github.com/tractorjuice/arc-kit/blob/main/docs/guides/us-federal-overlay.md). Per command guides for all ten are under [`docs/guides/us-*.md`](https://github.com/tractorjuice/arc-kit/tree/main/docs/guides).

For US resident architects who would consider the co-maintainer role: open an issue tagged `us-overlay` and `co-maintainer` with a short note on your background. The recruiting brief is in the maintenance guide.

Eight jurisdictions, 135 commands, one toolkit. The federal civilian stack is the latest chapter. It will not be the last.
