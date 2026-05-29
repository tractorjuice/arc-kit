# ArcKit — Australian Federal Overlay

12 slash commands plus the `au-federal` and `au-energy` build recipes covering Australian Federal Government, DISP-supplier, cross-sector critical infrastructure, and Australian energy-sector compliance:

- `/arckit.au-e8-posture` — ASD Essential Eight ML0–ML3 maturity assessment (8 mitigation strategies)
- `/arckit.au-pia` — Privacy Act 1988 s33D Privacy Impact Assessment (13 APPs)
- `/arckit.au-dss` — DTA Digital Service Standard (13 criteria) compliance assessment
- `/arckit.au-ism-controls` — ASD Information Security Manual Statement of Applicability (17 control domains)
- `/arckit.au-ndb-playbook` — OAIC Notifiable Data Breach response playbook (Privacy Act 1988 Part IIIC)
- `/arckit.au-ot-security` — ASD operational technology cyber security assessment for connected OT environments
- `/arckit.au-soci-cirmp` — SOCI Act / Critical Infrastructure Risk Management Program governance pack
- `/arckit.au-aescsf` — Australian Energy Sector Cyber Security Framework maturity assessment
- `/arckit.au-energy-compliance` — Australian energy compliance pack for AESCSF, AER, NER/NGR, AEMO, IT/OT, privacy, NDB, traceability, data flows, and ADR evidence
- `/arckit.au-pspf` — Protective Security Policy Framework (4 outcomes / 16 core requirements)
- `/arckit.au-ai-assurance` — DTA AI Assurance Framework + Responsible AI Policy v2.0 baseline
- `/arckit.au-disp-attestation` — DISP Member self-attestation pack (consolidates E8, ISM, PIA, NDB, PSPF)

Recipe: `au-federal` (35 default targets across 9 build waves, plus optional default-off OT and SOCI/CIRMP targets).

Recipe: `au-energy` composes the AU federal community overlay with optional `au-ot-security` and `au-soci-cirmp`, then layers AESCSF, AER ring-fencing, NER/NGR, AEMO obligations, IT/OT evidence, privacy, notifiable data breach, traceability, diagrams/data flows, data modelling, and ADR decisions on top.

`au-ot-security` and `au-soci-cirmp` are general Australian critical-infrastructure capabilities, not energy-specific commands. They are optional in `au-federal` and reused by the first industry-specific Australian menu, `au-energy`.

The AU energy fixture corpus under `tests/fixtures/au-energy` is intentionally synthetic, including synthetic organisations, scenarios, evidence, and personas. It is intended for public evaluation, regression testing, and community improvement.

## Requires arckit core plugin

```bash
claude plugin install arckit arckit-au
```

On Claude Code v2.1.143+, `claude plugin disable arckit` will refuse with a copy-pasteable disable-chain hint while `arckit-au` is enabled — earlier versions silently broke this overlay. Without `arckit` (core), recipes won't resolve their foundation commands (`arckit:principles`, `arckit:requirements`, etc.) and `validate-arc-filename` won't recognise AU doc-type codes (`AUE8`, `AUISM`, `AUPIA`, `AUNDB`, `AUOT`, `AUSOCI`, `AUAESCSF`, `AUENERGY`, `AUDSS`, `AUPSPF`, `AUAIA`, `AUDISP`).

## Validation

End-to-end validated against a real Australian SMB engagement (DISP-track, OFFICIAL:Sensitive). 25/25 evaluation scorecard pass at Run 3, 0 UK framework leakage, 220 AU framework references. See [`docs/au-federal-validation-scorecard.md`](https://github.com/tractorjuice/arc-kit/blob/main/docs/au-federal-validation-scorecard.md).

## Regulatory anchors

ASD Essential Eight Maturity Model · ASD Information Security Manual · ASD operational technology cyber security guidance · Security of Critical Infrastructure Act 2018 / CIRMP · Australian Energy Sector Cyber Security Framework · AER ring-fencing · National Electricity Rules / National Gas Rules · AEMO market, system-operator, and guidance material · DTA Digital Service Standard · Privacy Act 1988 (Cth) including Tranche 1 reforms (Dec 2024) · Defence Industry Security Program (DISP) · Protective Security Policy Framework · Commonwealth Procurement Rules (November 2025 overhaul) · DTA AI Assurance Framework + Responsible AI Policy v2.0 · PGPA Act 2013 s16 · IRAP.

## Maintainer

Domain co-maintainer: @royster70. Originally contributed via PR #441 (au-federal-recipe).
