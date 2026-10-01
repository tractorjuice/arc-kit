# Regulation week (draft)

<!-- markdownlint-disable MD018 MD024 -- hashtag lines are post text; post headings repeat by design -->

Dates: Wednesday 28 October to Sunday 1 November 2026, after the current daily series ends.

Channels:

- ArcKit LinkedIn page: one post a day, days 1 to 5.
- LinkedIn group: question versions on day 1 (Wed 28 Oct) and day 4 (Sat 31 Oct).
- Discord: one note on day 1.

One fictional product runs through the week: Hearthline, a smart heating controller with a cloud app, sold across the EU. Commands used: eu-nis2, eu-cra, eu-data-act, eu-rgpd, eu-ai-act, from the community EU overlay (plugins/arckit-eu). Campaign link on days 1 and 5 only.

## Day 1. NIS2: start with who you are (Wednesday 28 October)

Five EU regulations, one product, five drafts. That is our week.

From today to Sunday we will show what ArcKit's EU overlay drafts for one regulation a day. The overlay is community-maintained. It adds eight EU commands alongside the core ArcKit plugin.

Our example all week is Hearthline, a fictional smart heating controller with a cloud app, sold across the EU. Using one product lets you see how the regulations stack up.

Day 1 is NIS2. In Claude Code you run /arckit-eu:eu-nis2. Before anything else, the draft works out whether the organisation is an Essential Entity, an Important Entity or out of scope, using the Annex I and II sectors and the size thresholds.

It then walks through all ten Article 21 minimum measures with status and gaps. It sets out the reporting clock: early warning in 24 hours, notification in 72 hours, final report within a month. And it flags that management bodies carry personal liability.

Every document it writes is a DRAFT. Qualified legal, compliance and security people review it before anyone relies on it.

To try it, install the core plugin, then the overlay:
claude plugin install arckit@arckit-claude
claude plugin install arckit-eu@arckit-claude

https://github.com/tractorjuice/arc-kit/tree/main/plugins/arckit-eu?utm_campaign=regulation-week&utm_source=linkedin

#EnterpriseArchitecture #NIS2 #Cybersecurity #EURegulation

## Day 2. CRA: the product itself (Thursday 29 October)

NIS2 looks at the organisation. The Cyber Resilience Act looks at the product.

Day 2 of Regulation week. Hearthline, our fictional heating controller, is a product with digital elements placed on the EU market, so the CRA comes next. /arckit-eu:eu-cra drafts the assessment.

The draft opens with scope and class: Default, Important (Class I) or Critical (Class II), from Annex III. The class decides the conformity route, and whether a notified body is needed.

Then it checks the twelve security-by-design requirements in Annex I, Part I. Secure by default. Signed updates with rollback. A stated end-of-support date. No known exploitable vulnerabilities when the product goes on the market.

The vulnerability section treats the SBOM as a requirement, not good practice: machine-readable, top-level dependencies at minimum, in SPDX or CycloneDX. It also checks for a published disclosure policy, and for 24-hour reporting of actively exploited vulnerabilities to ENISA and the national CSIRT.

It closes with a gap table set against 11 December 2027, when the full obligations apply.

As always, this is a DRAFT for your product security, compliance and legal reviewers to check and correct.

Which of the twelve requirements takes your teams longest to evidence?

#EnterpriseArchitecture #CyberResilienceAct #ProductSecurity #SBOM

## Day 3. Data Act: who gets the data (Friday 30 October)

Hearthline's users generate the data. The Data Act asks who can get it, and how.

Day 3 of Regulation week. /arckit-eu:eu-data-act drafts a Data Act assessment. Most of the regulation's obligations have applied since 12 September 2025.

The draft starts with roles: manufacturer of a connected product, provider of a related service, data holder, cloud provider. Hearthline, our fictional heating controller and its app, may hold more than one of these, and each role brings different chapters.

For users, it checks the Chapter II basics. Were buyers told before purchase what data the product generates? Can they access it free of charge, in a structured, machine-readable format? Can they have it shared with a third party they choose, such as an installer?

For business-to-business sharing, it checks for fair, reasonable and non-discriminatory terms. It also looks for a way to protect trade secrets that is not a blanket refusal.

It covers Article 27, on access requests from non-EU governments. And it notes that the Data Act does not replace GDPR. When the data is personal, both apply.

The output is a DRAFT. Your data protection, legal and commercial reviewers decide what it should say.

Where does your product sit: manufacturer, data holder, or both?

#EnterpriseArchitecture #DataAct #IoT #DataGovernance

## Day 4. GDPR: screen first (Saturday 31 October)

Heating schedules from a home say a lot about the people who live there. So the next draft is GDPR.

Day 4 of Regulation week. /arckit-eu:eu-rgpd drafts a GDPR assessment that is neutral across member states, which helps when one product ships into several.

For Hearthline, our fictional heating controller, it reads the project's data model to see what personal data exists and where it flows. Then it scores the nine EDPB screening criteria for a data protection impact assessment, such as systematic monitoring, innovative technology like IoT, and large-scale processing. Two or more met means a DPIA is required, and the draft points to /arckit:dpia in core ArcKit for the full assessment.

The rest follows the regulation. A lawful basis for each processing activity. A mechanism and response time for each data subject right. A processor list checked against Article 28 contract terms. Transfers outside the EU, with transfer impact assessments. The 72-hour breach notification route to the lead supervisory authority.

For UK teams buying from or selling to the EU, it sets out the EU baseline in one structured document.

Every assessment is a DRAFT for your DPO and legal advisers to review.

When does your DPIA screening happen: before design, or after?

#EnterpriseArchitecture #GDPR #DataProtection #PrivacyByDesign

## Day 5. AI Act, and the week in one project (Sunday 1 November)

Hearthline learns when a home needs heat. Is that an AI system under the AI Act? That is where the last draft starts.

Day 5 of Regulation week. /arckit-eu:eu-ai-act first tests the AI system definition, then whether the organisation is a provider or a deployer. Before any risk tier, it checks the Article 5 prohibited practices. If one applies, the draft stops and says the system cannot be placed on the EU market.

Only then does it classify: high risk under Annex I or Annex III, limited risk with transparency duties, or minimal risk. For high risk, it works through risk management, data governance, logging, human oversight, accuracy and robustness, and the conformity route.

That closes the week. Five regulations, one fictional product. NIS2 for the organisation. CRA for the device. The Data Act for the data it generates. GDPR for the people behind that data. The AI Act for the feature that learns. Each command writes its own document into the same project, so reviewers can read them side by side.

All five are DRAFTS. Qualified legal, compliance and security people make the calls.

The overlay is community-maintained and is looking for an EU regulatory co-maintainer. Read the commands and get involved:
https://github.com/tractorjuice/arc-kit/tree/main/plugins/arckit-eu?utm_campaign=regulation-week&utm_source=linkedin

#EnterpriseArchitecture #AIAct #EURegulation #Compliance

## LinkedIn group versions

### Day 1 (Wednesday 28 October)

A question for the NIS2 and CRA people here. When you scope NIS2 for a new product or service, what do you settle first: Essential or Important Entity status, or the 24-hour early warning route?

We are spending this week on ArcKit's community-maintained EU overlay, one regulation a day, using a fictional connected heating controller as the example. Today's command, /arckit-eu:eu-nis2, drafts the entity classification first, then the ten Article 21 measures and the 24-hour, 72-hour and one-month reporting stages. Everything it writes is a DRAFT for qualified legal, compliance and security review.

We would value your view on what a first draft should get right.

### Day 4 (Saturday 31 October)

For those working on GDPR for connected products: when does your DPIA screening happen, before design or once the data flows are built?

Today's command in ArcKit's community-maintained EU overlay, /arckit-eu:eu-rgpd, scores the nine EDPB screening criteria from the project's data model. Two or more met means a DPIA is required. It then drafts lawful basis, data subject rights, processors, transfers and the 72-hour breach route. It is a DRAFT for your DPO and legal advisers to review.

UK architects working with EU suppliers: does a member-state-neutral EU baseline help you, or do you need the national layer from the start?

## Discord (day 1)

Regulation week starts today on the ArcKit LinkedIn page. Five posts, Wednesday 28 October to Sunday 1 November, each showing what one command in the community-maintained EU overlay drafts: NIS2, CRA, Data Act, GDPR and AI Act, all for one fictional product (Hearthline, a connected heating controller). Install the core plugin and then the overlay with claude plugin install arckit@arckit-claude and claude plugin install arckit-eu@arckit-claude, then run /arckit-eu:eu-nis2. Every output is a DRAFT for qualified review. If you work on EU regulation and want to help maintain the overlay, say hello here.

## Cards
