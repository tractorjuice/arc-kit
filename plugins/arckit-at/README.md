# ArcKit — Austrian Overlay

3 slash commands covering Austrian regulatory compliance:

- `/arckit:at-bvergg` — Austrian public procurement (Bundesvergabegesetz 2018, ANKÖ, BVwG)
- `/arckit:at-dsgvo` — Austrian DSG / DSGVO obligations (Datenschutzbehörde, §§12–13 DSG)
- `/arckit:at-nisg` — Austrian NISG obligations (BGBl. I Nr. 94/2025, BKA/BMI reporting)

Recipes: No recipes ship in this overlay yet.

## Requires arckit core plugin

```bash
claude plugin install arckit@arckit-claude
claude plugin install arckit-at@arckit-claude
```

On Claude Code v2.1.143+, `claude plugin disable arckit` will refuse with a copy-pasteable disable-chain hint while `arckit-at` is enabled — earlier versions silently broke this overlay. Without `arckit` (core), recipes won't resolve their foundation commands (`arckit:principles`, `arckit:requirements`, etc.) and `validate-arc-filename` won't recognise AT doc-type codes.

## Maintainer

Currently maintained by @tractorjuice. Recruiting an Austrian domain co-maintainer — see [CONTRIBUTING.md](https://github.com/tractorjuice/arc-kit/blob/main/CONTRIBUTING.md).
