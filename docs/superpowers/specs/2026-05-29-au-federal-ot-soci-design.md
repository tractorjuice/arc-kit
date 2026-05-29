# AU Federal OT + SOCI Baseline Design

## Context

The Australian federal community overlay now provides the reusable AU baseline for federal, DISP-supplier, and adjacent regulated projects. Issue #440 will add the first Australian industry sector recipe, `au-energy`, covering AESCSF, SOCI energy interpretation, AER ring-fencing, and NER/NGR obligations.

Before that sector recipe lands, two cross-sector capabilities should be added to the AU community plugin:

- ASD operational technology cyber security guidance.
- SOCI Act / Critical Infrastructure Risk Management Program support.

These are not energy-only concerns. SOCI applies across critical infrastructure sectors, and ASD OT guidance is reusable anywhere Australian organisations operate connected operational technology. The energy recipe should consume these capabilities, not define them privately.

## Goals

- Add two reusable AU commands to `arckit-au`:
  - `au-ot-security`
  - `au-soci-cirmp`
- Keep both commands optional in the existing `au-federal` recipe.
- Make the PR rationale clear: this is general AU critical infrastructure and OT support, and it will be consumed by the first industry-specific AU menu, `au-energy`.
- Avoid bloating the default federal/DISP recipe for projects that do not involve OT or SOCI-regulated critical assets.

## Non-Goals

- Do not implement AESCSF in this PR.
- Do not add the `au-energy` recipe in this PR.
- Do not include AER ring-fencing, NER/NGR, AEMO market obligations, or energy-specific SOCI interpretation in the federal update.
- Do not make OT or SOCI targets default-on for all AU federal builds.

## Command Scope

### `au-ot-security`

Produces an ASD-aligned OT security assessment for connected operational technology environments. It should focus on reusable architecture and control evidence:

- OT architecture visibility and authoritative asset view.
- IT/OT segmentation and trust boundaries.
- Secure connectivity patterns for OT environments.
- Remote access and supplier access pathways.
- Monitoring, logging, and detection for OT networks.
- Incident response integration with cyber and operational teams.
- Safety, availability, and operational continuity constraints.
- AI-in-OT considerations where relevant, without turning this into an AI-specific command.

Suggested document type code: `AUOT`.

### `au-soci-cirmp`

Produces a SOCI Act / CIRMP governance and risk pack for Australian critical infrastructure entities. It should focus on cross-sector obligations:

- Critical asset applicability and responsible entity context.
- CIRMP risk domains and accountable governance.
- Cyber and information security hazards.
- Personnel, supply chain, physical security, and natural hazard considerations.
- Incident reporting obligations and evidence trail.
- Dependencies on existing security, privacy, and incident response artefacts.

Suggested document type code: `AUSOCI`.

## Recipe Integration

Update `arckit-au/recipes/au-federal.yaml` with optional targets:

```yaml
optional_targets:
  AU_OT:
    description: ASD operational technology cyber security guidance for connected OT environments
    default: false
  AU_SOCI:
    description: SOCI Act / Critical Infrastructure Risk Management Program support
    default: false
```

Add targets with dependencies that reuse the AU baseline:

```yaml
- id: AU_OT
  skill: arckit:au-ot-security
  args: "{P}"
  output: { project: "{P}-{NAME}", type: AUOT }
  deps: [REQ, STKE, AU_E8, AU_ISM]

- id: AU_SOCI
  skill: arckit:au-soci-cirmp
  args: "{P}"
  output: { project: "{P}-{NAME}", type: AUSOCI }
  deps: [REQ, STKE, AU_E8, AU_ISM, AU_PIA, AU_NDB]
```

The later `au-energy` recipe should enable or include both by default before `au-aescsf` and `au-energy-compliance`.

## Files To Update

- `arckit-au/commands/au-ot-security.md`
- `arckit-au/commands/au-soci-cirmp.md`
- `arckit-au/templates/au-ot-security-template.md`
- `arckit-au/templates/au-soci-cirmp-template.md`
- `arckit-au/recipes/au-federal.yaml`
- `arckit-au/README.md`
- `arckit-au/CHANGELOG.md`
- `arckit-claude/config/doc-types.mjs`
- `arckit-claude/commands/pages.md`
- generated target outputs from `python scripts/converter.py`
- relevant docs and tests for new command registration

## Testing

- Run the converter after adding the source commands and templates.
- Run Codex extension tests because generated outputs and command conversion will change.
- Run relevant plugin tests for document type and recipe validation.
- Validate that `au-federal` still runs without OT/SOCI by default, and that both targets appear only when explicitly enabled.

## PR Narrative

The PR should explain that this is a federal AU overlay enhancement, not the energy-sector PR. It adds reusable ASD OT and SOCI/CIRMP capabilities because both apply beyond energy. The forthcoming `au-energy` menu will be the first industry-specific AU recipe to consume them, layering AESCSF and energy market obligations on top.
