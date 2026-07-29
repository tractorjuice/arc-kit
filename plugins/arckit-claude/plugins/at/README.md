# ArcKit — Austrian Overlay

3 slash commands covering Austrian regulatory compliance:

- `/arckit-at:at-bvergg` — Austrian public procurement (Bundesvergabegesetz 2018 as amended by the Vergaberechtsgesetz 2026, BGBl. I Nr. 8/2026; ANKÖ, BVwG)
- `/arckit-at:at-dsgvo` — Austrian DSG / DSGVO obligations (Datenschutzbehörde, §§12–13 DSG)
- `/arckit-at:at-nisg` — Austrian NISG 2026 obligations (BGBl. I Nr. 94/2025, in force 1 Oct 2026, Cybersicherheitsbehörde registration + CSIRT reporting)

Recipes: No recipes ship in this overlay yet.

## Requires arckit core plugin

```bash
claude plugin install arckit@arckit-claude
claude plugin install arckit-at@arckit-claude
```

On Claude Code v2.1.143+, `claude plugin disable arckit` will refuse with a copy-pasteable disable-chain hint while `arckit-at` is enabled — earlier versions silently broke this overlay. Without `arckit` (core), recipes won't resolve their foundation commands (`arckit:principles`, `arckit:requirements`, etc.) and `validate-arc-filename` won't recognise AT doc-type codes.

## Recommended: arckit-eu overlay

`/arckit-at:at-dsgvo` and `/arckit-at:at-nisg` layer Austrian specifics on top of the pan-EU baselines. For the full workflow, also install the EU overlay so the "run `/arckit-eu:eu-rgpd` / `/arckit-eu:eu-nis2` first" steps resolve:

```bash
claude plugin install arckit-eu@arckit-claude
```

Without it, those handoffs reference commands that are not installed.

## Maintainer

Austrian domain maintained by @gtonic (with @tractorjuice as repo maintainer). See [CONTRIBUTING.md](https://github.com/tractorjuice/arc-kit/blob/main/CONTRIBUTING.md).
