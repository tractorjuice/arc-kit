---
description: "[COMMUNITY] Generate a UAE PDPL (Federal Decree-Law 45/2021) compliance assessment including DPIA, lawful-basis register, data-subject-rights procedure, and cross-border transfer log. Anchored on the UAE Data Office statutory framework."
doc-type: PDPL
argument-hint: "<project ID or service name>"
effort: high
keep-coding-instructions: true
handoffs:
  - command: risk
    description: DPIA outputs feed the risk register's privacy and regulatory entries.
  - command: uae-data-sharing
    description: Per-share lawful-basis mapping continues into the data sharing agreement.
  - command: uae-classification
    description: PDPL-relevant datasets must be classified appropriately.
allowed-tools:
  - Read(/${CLAUDE_PLUGIN_ROOT}/**)
  - Bash(node ${CLAUDE_PLUGIN_ROOT}/scripts/generate-document-id.mjs *)
  - Bash(node "${CLAUDE_PLUGIN_ROOT}/scripts/generate-document-id.mjs" *)
---

> ⚠️ **Community-contributed command** — not part of the officially-maintained ArcKit baseline. Output should be reviewed by qualified DPO / RSSI / federal compliance counsel before reliance. Citations to UAE Cabinet / PDPL / IAS / Cybersecurity Council text may lag the current text — verify against the source.

## User Request

```text
$ARGUMENTS
```

You are an enterprise architect generating a UAE PDPL Compliance Assessment. Do not assume the Decree-Law applies: Article 2(2)(b) excludes governmental entities that control or process personal data, so the Scope test below decides first whether it applies. For a federal ministry or authority acting as controller it normally does not, and the assessment then measures alignment with PDPL controls rather than statutory compliance.

## Process

1. Read prerequisites:
   - `projects/000-global/ARC-000-PRIN-*.md` (federal principles, if present)
   - The project's REQ (including its `DR-*` data requirements) and DATA (data model) artefacts (if present)
   - `${CLAUDE_PLUGIN_ROOT}/templates/_partials/RENDERING.md`
2. Read the template:
   - **First**, check `.arckit/templates-custom/uae-pdpl-template.md` (user override)
   - **Then**, `.arckit/templates/uae-pdpl-template.md`
   - **Fallback**, `${CLAUDE_PLUGIN_ROOT}/templates/uae-pdpl-template.md`
3. Use `node ${CLAUDE_PLUGIN_ROOT}/scripts/generate-document-id.mjs <PROJECT_ID> PDPL {VERSION} --filename` for the artefact filename. Work out `{VERSION}` first with `${CLAUDE_PLUGIN_ROOT}/references/version-detection.md`: a re-run writes the next version beside the earlier file, never over it.
4. Resolve the `<!-- DOC-CONTROL-HEADER -->` marker per `RENDERING.md`.
5. Generate the following sections:
   - **Scope** — what processing is covered, and whether the PDPL applies to it at all. Article 2(1) covers processing by a controller or processor in the State (of data subjects inside or outside it), by one outside the State of data subjects in it, and for data subjects resident or doing business in the State. Article 2(2) then excludes seven cases. Test each against the controller, each processor and each processing activity, and record applies / does not apply / not determined, with the reason:
     - (a) Government Data
     - (b) governmental entities that control or process personal data
     - (c) personal data held by the security and judicial authorities
     - (d) a data subject processing their own data for personal purposes
     - (e) personal health data that has legislation regulating its protection and processing
     - (f) personal banking and credit data and information that have legislation regulating their protection and processing
     - (g) companies and establishments in a free zone that has its own personal data protection legislation, such as the DIFC (Data Protection Law, DIFC Law No. 5 of 2020) and ADGM (Data Protection Regulations 2021)

     Where an exclusion applies (for example, the controller is a federal ministry or authority, or the data is Government Data), say so at the top of the Scope section and in the Executive Summary: the PDPL does not apply to that processing, and the rest of the assessment for it measures alignment with PDPL controls, not statutory compliance. Name the regime that applies instead only where a primary source you have read says so, and cite it; otherwise record "governing instrument not identified" for counsel to settle. Article 1 defines neither "Government Data" nor "governmental entities", and its definition of "Establishment" includes companies wholly or partly owned by the federal or a local government, so record the basis for treating any body as a governmental entity. For (e) and (f), the Decree-Law's preamble lists Federal Law No. 2 of 2019 (ICT in the health fields), Federal Law No. 6 of 2010 (credit information) and Federal Decree-Law No. 14 of 2018 (Central Bank) among the laws reviewed, but does not say they are the legislation those exclusions mean: check the instrument's own text before relying on it. Healthcare data may also fall under ADHICS.
   - **Lawful basis register** — record the lawful basis for each processing activity. Article 4 prohibits processing without the data subject's consent unless one of its exceptions applies: (1) the public interest; (2) data the data subject has made public; (3) legal claims, defence of rights, or judicial or security procedures; (4) occupational or preventive medicine, diagnosis, health or social care, treatment or health insurance; (5) public health; (6) archiving, or scientific, historical or statistical studies; (7) protecting the data subject's interests; (8) employment, social security or social protection obligations and rights; (9) a contract the data subject is party to, or steps at their request towards one; (10) specific obligations of the controller under other laws; (11) cases set by the Executive Regulations. Where consent is relied on, show it meets Article 6: provable; clear, simple, unambiguous and easily accessible, in writing or electronically; and stating the right to withdraw it, which the data subject may do at any time. Every activity must also meet the Article 5 processing controls (fair, transparent and lawful processing; a specific purpose; data limited to what is necessary; accuracy; security; no retention once the purpose is exhausted), but Article 5 is not itself a lawful basis.
   - **Data subject rights procedure** — access, rectification, erasure, restriction, portability, object, withdraw consent, complain to the Data Office. State the channel, the response SLA, and the operational owner for each right.
   - **DPIA** — assess each Article 21 case: use of a modern technology that would pose a high risk to the privacy and confidentiality of personal data (21(1)); a systematic and comprehensive assessment of the data subject's personal aspects by automated processing, including profiling, with legal consequences or serious impact (21(2)(a)); and processing a large volume of Sensitive Personal Data, as defined in Article 1 (21(2)(b)). Where a case applies, the assessment is made before processing and covers at least what Article 21(3) requires: the processing and its purpose, its necessity and suitability for that purpose, the risks to privacy and confidentiality, and the measures to reduce them. Also record the residual risk, coordinate with the Data Protection Officer (21(5)), and review the results regularly (21(7)).
   - **Cross-border transfer log** — record each transfer's destination and the ground it relies on. Article 22 allows a transfer, in cases the Data Office approves, where the destination has personal data protection legislation with a judicial or regulatory authority that enforces it (22(1)), or where the UAE has joined a bilateral or multilateral data protection agreement with it (22(2)); record whether the Data Office has approved the destination, with the date checked. Otherwise Article 23(1) allows a transfer on any one of six grounds: (a) a contract binding the recipient, in a country without data protection law, to the Decree-Law's measures; (b) the data subject's explicit consent, where the transfer does not conflict with the State's public or security interest; (c) fulfilling obligations or establishing, exercising or defending rights before judicial bodies; (d) concluding or performing a contract between the controller and the data subject, or with a third party in the data subject's interest; (e) international judicial cooperation; (f) protecting the public interest. Article 23(2) leaves the controls for these grounds to the Executive Regulations, so record their status against each Article 23 transfer. Data classification still governs where the data may be stored: run `/arckit-uae:uae-cloud-residency` for the National Cloud Security Policy rules.
   - **Breach notification playbook** — PDPL Article 9 obligations and the operational owner. On becoming aware of a breach that would prejudice the privacy, confidentiality and security of the data, the controller notifies the Data Office with the content Article 9(1)(a)–(f) lists: the nature, form and causes of the breach and the approximate number of records; the Data Protection Officer's details; its likely effects; the corrective measures taken or proposed; the supporting documents; and anything else the Data Office requires. It also notifies affected data subjects where the breach would prejudice the privacy and confidentiality of their data (9(2)), and a processor notifies the controller as soon as it becomes aware (9(3)). Article 9 leaves the notification periods to the Executive Regulations: state the period they set or, where none are in force at the verification date, say so and record any internal target as the entity's own choice, not a statutory deadline.
   - **Penalties (informational only)** — reference current administrative fines per the relevant Cabinet Resolution. This section is informational and is not used for compliance scoring.
6. Populate the External References section per `${CLAUDE_PLUGIN_ROOT}/references/citation-instructions.md`. Federal Decree-Law No. 45 of 2021 MUST appear in the Document Register with its primary URL and the verification date.
7. Before writing the file, read `${CLAUDE_PLUGIN_ROOT}/references/quality-checklist.md` and verify all **Common Checks** plus the **PDPL** per-type checks pass. Fix any failures before proceeding.
8. Write the artefact via the Write tool to `projects/<project-id>/<filename>`.
9. Show only a summary to the user (one paragraph plus the headline DPIA outcome and any cross-border transfers flagged).

## Authoritative anchor

Federal Decree-Law No. 45 of 2021 on the Protection of Personal Data. Authority: UAE Data Office. Primary URL: <https://uaelegislation.gov.ae/en/legislations/1972/download>

Federal Decree-Law No. 45 of 2021 was issued on 20 September 2021, published in Official Gazette No. 712 (supplement) on 26 September 2021, and has been in force since 2 January 2022. Its Executive Regulations are a separate Cabinet instrument, and the UAE Government portal's data protection page (<https://u.ae/en/about-the-uae/digital-uae/data/data-protection-laws>, updated 4 December 2025) names none. Before writing, check the UAE Legislation portal (<https://uaelegislation.gov.ae>) for a Cabinet resolution issuing them, and record the result in the External References section as "PDPL Executive Regulations: [instrument and date / none located] — verified as of [date]", because publication status changes.

## Important notes

- Do NOT confuse the federal PDPL with the DIFC DPL or ADGM DPR free-zone regimes — those are separately maintained and out of scope of this command.
- Healthcare data in some emirates additionally falls under ADHICS — flag as a follow-up where relevant.
- Where no Executive Regulations are in force at the verification date, base the assessment on the Decree-Law text alone, and treat any draft or commentary describing them as informational only.
