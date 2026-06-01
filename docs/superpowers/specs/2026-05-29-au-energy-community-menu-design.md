# AU Energy Community Menu Design

## Context

Issue #440 requests the first Australian industry-specific community menu for ArcKit: an energy-sector overlay covering AESCSF, SOCI energy interpretation, AER ring-fencing, and NER/NGR / AEMO obligations. This work is intentionally stacked on the AU federal OT/SOCI PR because the energy menu reuses the general Australian federal and critical-infrastructure capabilities instead of redefining them privately.

The previous PR adds the reusable base:

- `au-e8-posture`
- `au-ism-controls`
- `au-pia`
- `au-ndb-playbook`
- `au-ot-security`
- `au-soci-cirmp`

The energy PR will add the sector-specific layer on top of those commands.

## Goals

- Add a complete `au-energy` community recipe that composes on the AU federal baseline.
- Add energy-specific commands for AESCSF maturity assessment and energy regulatory compliance.
- Include public synthetic evaluation fixtures so reviewers and future contributors can validate the recipe against realistic energy-sector inputs.
- Include evaluation expectations and result artefacts as part of the submission, not as private side material.
- Keep general OT and general SOCI coverage in the federal overlay; keep AESCSF, AER ring-fencing, NER/NGR, AEMO, and energy-specific SOCI interpretation in the energy overlay.

## Non-Goals

- Do not move general ASD OT guidance or general SOCI/CIRMP logic out of the AU federal overlay.
- Do not claim legal, regulatory, or AESCSF assessor status; generated outputs remain community-contributed decision-support artefacts requiring qualified review.
- Do not use confidential, client, employer, or real-network data in fixtures.
- Do not make the energy recipe part of ordinary AU federal builds. It is a separate sector recipe.

## Commands

### `au-aescsf`

Generates an Australian Energy Sector Cyber Security Framework assessment.

Expected output:

- AESCSF scope and criticality context.
- Domain-by-domain maturity assessment across the 11 AESCSF domains.
- MIL-1 / MIL-2 / MIL-3 evidence position by domain.
- OT/IT convergence and grid-edge security findings.
- AESCSF anti-patterns, maturity blockers, and uplift roadmap.
- Cross-reference to AU federal evidence, especially E8, ISM, OT security, SOCI/CIRMP, privacy, NDB, and risk artefacts.

Document type: `AUAESCSF`.

### `au-energy-compliance`

Generates an Australian energy regulatory architecture compliance pack.

Expected output:

- Applicability assessment for the energy-sector regulatory stack.
- AER ring-fencing assessment covering regulated / unregulated separation, information flows, shared systems, shared staff, branding, and cost allocation.
- NER/NGR and AEMO obligation mapping at architecture decision level.
- Energy-specific SOCI interpretation, using `au-soci-cirmp` as the general CIRMP base rather than duplicating it.
- Energy market / system-operator interface register.
- ADR seeds for major energy-sector architecture decisions.

Document type: `AUENERGY`.

## Recipe

Add `arckit-au/recipes/au-energy.yaml`.

The recipe follows the established jurisdiction / sector-overlay pattern used elsewhere in ArcKit. It composes the AU federal baseline and enables the critical-infrastructure capabilities by default for this sector:

- `AU_E8`
- `AU_ISM`
- `AU_PIA`
- `AU_NDB`
- `AU_OT`
- `AU_SOCI`
- `AU_AESCSF`
- `AU_ENERGY`

The recipe includes eight energy-specific ADR topics that differ meaningfully from the federal baseline:

1. OT/IT segmentation and Purdue / zone-conduit boundaries.
2. SOCI critical electricity or gas asset declaration and register obligations.
3. AESCSF target maturity profile and domain-level uplift priorities.
4. AER ring-fencing for shared platforms, identity, data, staff, and branding.
5. AEMO market / system-operator interfaces and operational data exchange.
6. DERMS / dynamic operating envelope / CSIP-AUS architecture controls.
7. Critical incident reporting pathways and 12-hour / 72-hour energy escalation.
8. Supplier, managed-service, and remote-access controls for OT and energy platforms.

## Synthetic Evaluation Fixtures

The synthetic fixture pack at:

`C:\Users\royst\OneDrive\Documents\Claude\cowork-projects\Active\2026-05_au-recipe-eval\inputs_energy`

will be copied into the repository as public test data under:

`tests/fixtures/au-energy/`

The fixture pack contains:

- `fixture-a-eastland-dnsp`: a positive DNSP case that triggers AESCSF, SOCI/CIRMP, AER ring-fencing, OT, privacy/NDB, and energy market obligations.
- `fixture-b-voltiq-supplier`: a negative supplier case that is not treated as a SOCI-covered entity, but still surfaces flow-down, sensitive-supplier, SaaS/data-handling, and customer obligation risks.
- Top-level README, methodology, references, provenance, and international data-source notes.

The fixtures retain their synthetic-composite disclaimers and provenance notes. Tests verify every fixture file includes a synthetic disclaimer or is explicitly listed as top-level methodology/reference material.

## Evaluation Results

The PR includes evaluation expectations and result artefacts in the repo using this reviewable structure:

- `tests/fixtures/au-energy/README.md` explains the fixture purpose and expected usage.
- `tests/fixtures/au-energy/EVAL_EXPECTATIONS.md` captures expected findings for Fixture A and Fixture B.
- `tests/fixtures/au-energy/EVAL_RESULTS.md` records the validation run, including date, commands/recipe exercised, expected-vs-observed result, and any gaps.

The first implementation pass uses deterministic repository tests for fixture hygiene and recipe structure. If full ArcKit command execution is manual or agent-mediated, the result artefact records the manual evaluation method clearly rather than pretending it is automated.

## Documentation

Update AU overlay documentation, including:

- `arckit-au/README.md`
- `arckit-au/CHANGELOG.md`
- `docs/guides/au-federal-overlay.md` only where the cross-reference needs to point to the now-added energy recipe.
- New guides for `au-aescsf` and `au-energy-compliance`.
- `docs/guides.html` guide index.

Generated targets receive command, skill, prompt, template, guide, and doc-type copies via `python scripts/converter.py`.

## Tests

Add focused tests for:

- `au-energy` recipe existence and target dependency shape.
- Energy targets consuming AU federal OT/SOCI outputs rather than duplicating them.
- New command source files and templates.
- New doc types registered in `doc-types.mjs` and `pages.md`.
- Generated command / skill / prompt outputs after converter run.
- Fixture file presence, synthetic disclaimers, and expected scenario coverage.
- Existing Paperclip command count and template consistency tests updated if required.

Validation includes:

- `python scripts/converter.py`
- `pytest tests/codex/test_codex_extension.py -q`
- focused AU energy tests
- `pytest tests/paperclip/test_commands_json.py -q`
- `pytest tests/plugin/test_template_consistency.py -q`
- `$env:PYTHONUTF8='1'; python scripts/check_recipes.py`
- `$env:PYTHONUTF8='1'; python scripts/check_doctype_collisions.py`
- `node scripts/tests/test-doc-types-dual-registration.mjs`
- `npx markdownlint-cli2 "**/*.md"`

## PR Strategy

This opens as a stacked draft PR against `tractorjuice/arc-kit:main`, with the PR body clearly stating that it depends on the AU federal OT/SOCI PR. If the base PR changes during review, this branch is rebased onto the merged `main` before marking ready for review.

The PR links issue #440 and explains that it is the first Australian industry-specific community menu.
