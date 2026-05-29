# ArcKit — Australian Federal Overlay

10 slash commands and the `au-federal` build recipe covering Australian Federal Government and DISP-supplier compliance:

- `/arckit:au-e8-posture` — ASD Essential Eight ML0–ML3 maturity assessment (8 mitigation strategies)
- `/arckit:au-pia` — Privacy Act 1988 s33D Privacy Impact Assessment (13 APPs)
- `/arckit:au-dss` — DTA Digital Service Standard (13 criteria) compliance assessment
- `/arckit:au-ism-controls` — ASD Information Security Manual Statement of Applicability (17 control domains)
- `/arckit:au-ndb-playbook` — OAIC Notifiable Data Breach response playbook (Privacy Act 1988 Part IIIC)
- `/arckit:au-ot-security` — ASD operational technology cyber security assessment for connected OT environments
- `/arckit:au-soci-cirmp` — SOCI Act / Critical Infrastructure Risk Management Program governance pack
- `/arckit:au-pspf` — Protective Security Policy Framework (4 outcomes / 16 core requirements)
- `/arckit:au-ai-assurance` — DTA AI Assurance Framework + Responsible AI Policy v2.0 baseline
- `/arckit:au-disp-attestation` — DISP Member self-attestation pack (consolidates E8, ISM, PIA, NDB, PSPF)

Recipe: `au-federal` (35 default targets across 9 build waves, plus optional default-off OT and SOCI/CIRMP targets).

`au-ot-security` and `au-soci-cirmp` are general Australian critical-infrastructure capabilities, not energy-specific commands. They are optional in `au-federal` and intended to be reused by the first industry-specific Australian menu, `au-energy`, which will layer AESCSF, AER ring-fencing, NER/NGR, and AEMO obligations on top.

## Requires arckit core plugin

```bash
claude plugin install arckit arckit-au
```

On Claude Code v2.1.143+, `claude plugin disable arckit` will refuse with a copy-pasteable disable-chain hint while `arckit-au` is enabled — earlier versions silently broke this overlay. Without `arckit` (core), recipes won't resolve their foundation commands (`arckit:principles`, `arckit:requirements`, etc.) and `validate-arc-filename` won't recognise AU doc-type codes (`AUE8`, `AUISM`, `AUPIA`, `AUNDB`, `AUOT`, `AUSOCI`, `AUDSS`, `AUPSPF`, `AUAIA`, `AUDISP`).

## Validation

End-to-end validated against a real Australian SMB engagement (DISP-track, OFFICIAL:Sensitive). 25/25 evaluation scorecard pass at Run 3, 0 UK framework leakage, 220 AU framework references. See [`docs/au-federal-validation-scorecard.md`](https://github.com/tractorjuice/arc-kit/blob/main/docs/au-federal-validation-scorecard.md).

## Regulatory anchors

ASD Essential Eight Maturity Model · ASD Information Security Manual · ASD operational technology cyber security guidance · Security of Critical Infrastructure Act 2018 / CIRMP · DTA Digital Service Standard · Privacy Act 1988 (Cth) including Tranche 1 reforms (Dec 2024) · Defence Industry Security Program (DISP) · Protective Security Policy Framework · Commonwealth Procurement Rules (November 2025 overhaul) · DTA AI Assurance Framework + Responsible AI Policy v2.0 · PGPA Act 2013 s16 · IRAP.

## Maintainer

Domain co-maintainer: @royster70. Originally contributed via PR #441 (au-federal-recipe).
