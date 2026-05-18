# Canada Charter Rights Design Review

> **Template Origin**: Community | **ArcKit Version**: [VERSION] | **Command**: `/arckit.ca-charter`

## Document Control

<!-- DOC-CONTROL-HEADER -->
<!-- Resolved at command-execution time per _partials/RENDERING.md. -->
<!-- Classification line MUST be: -->
<!-- | Classification | UNCLASSIFIED / Protected A / Protected B / Protected C / CONFIDENTIAL / SECRET / TOP SECRET | -->

## Revision History

| Version | Date | Author | Changes | Approved By | Approval Date |
|---------|------|--------|---------|-------------|---------------|
| [VERSION] | [YYYY-MM-DD] | ArcKit AI | Initial creation from `/arckit.ca-charter` | [PENDING] | [PENDING] |

## Executive Summary

[Two to three paragraphs describing the system, the Charter sections engaged (default for FITAA-class apps: s.2(b), s.2(d), s.7, s.8, s.15), the headline risks per right, the Oakes proportionality posture, the residual rating, and the DOJ counsel sign-off status. Note any open items — pending sign-offs, jurisprudence verification, or design changes required to clear residual risk.]

## Charter Engagement Surface

| Section | Engaged? (Y / N) | Justification |
|---------|------------------|---------------|
| s.2(a) — freedom of conscience and religion | [Y / N] | [One-paragraph reasoning. If N, state why religious-belief and conscience interests are not engaged.] |
| s.2(b) — freedom of expression | [Y / N — default Y for FITAA-class apps] | [Identify chilling-effect surface: advocacy, journalism, academic inquiry, diaspora speech.] |
| s.2(c) — freedom of peaceful assembly | [Y / N] | [Reasoning.] |
| s.2(d) — freedom of association | [Y / N — default Y for FITAA-class apps] | [Identify disincentive surface: civil-society engagement, diaspora communities, political associations.] |
| s.7 — life, liberty, security of the person | [Y / N — default Y for FITAA-class apps] | [Identify any deprivation: liberty effects of registration, security-of-person effects of disclosure.] |
| s.8 — search and seizure | [Y / N — default Y for FITAA-class apps] | [Identify reasonable-expectation-of-privacy interests; reference the PIA personal-information inventory.] |
| s.15 — equality | [Y / N — default Y for FITAA-class apps] | [Identify protected-ground populations subject to differential impact.] |

## s.2 Analysis

### s.2(a) — Freedom of Conscience and Religion

| Engagement | Risk | Mitigation | Residual |
|------------|------|------------|----------|
| [Religious-belief interests engaged by, e.g., classification of religious advocacy as registrable activity] | [Suppression of religious expression; differential burden on religious communities] | [Carve-out / threshold / process safeguard] | [Low / Med / High] |

### s.2(b) — Freedom of Expression

| Engagement | Risk | Mitigation | Residual |
|------------|------|------------|----------|
| [Chilling effect on advocacy / journalism / academic inquiry] | [Self-censorship; reduced public-interest reporting; advocacy withdrawal] | [Journalism / academic exemption; threshold tests; appeal route] | [Low / Med / High] |
| [Public-register disclosure of speech-adjacent activity] | [Reputational harm; over-disclosure beyond transparency objective] | [Severance rules; minimum-data-on-public-register principle] | [Low / Med / High] |

### s.2(c) — Freedom of Peaceful Assembly

| Engagement | Risk | Mitigation | Residual |
|------------|------|------------|----------|
| [Registration capturing convening / event organisation] | [Disincentive to legitimate assembly] | [Threshold / exemption / appeal] | [Low / Med / High] |

### s.2(d) — Freedom of Association

| Engagement | Risk | Mitigation | Residual |
|------------|------|------------|----------|
| [Disincentive to civil-society or diaspora engagement] | [Withdrawal of legitimate association; chilling of community organising] | [Carve-outs; identity-verification minimisation; appeal route] | [Low / Med / High] |
| [Differential impact on diaspora communities] | [Disproportionate registration burden on particular national-origin groups] | [Substantive-equality review; differential-impact monitoring] | [Low / Med / High] |

## s.7 Analysis

| Engagement | Deprivation | Procedural Safeguard | Residual |
|------------|-------------|----------------------|----------|
| [Liberty interest engaged by registration obligation backed by penal consequences] | [Risk of penal sanction for non-registration; impact on freedom of movement / employment] | [Notice; right to representation; appeal to independent decision-maker; principles of fundamental justice per *Carter*] | [Low / Med / High] |
| [Security of person engaged by disclosure of registrant identity in sensitive contexts] | [Risk of harassment, threats, or transnational repression following disclosure] | [Threat-assessment screen; protective-disclosure carve-out; severance to protected register] | [Low / Med / High] |

## s.8 Analysis

| Engagement | Reasonable Expectation of Privacy Analysis | Warrant or Production-Order Interface | Residual |
|------------|--------------------------------------------|----------------------------------------|----------|
| [Collection of registrant / foreign-principal personal information] | [REP analysis under *Hunter v Southam*: subjective expectation, objective reasonableness, totality of the circumstances] | [Production-order workflow; warrant requirement for any compelled access beyond statutory authority] | [Low / Med / High] |
| [Investigative back-end interfaces with RCMP / CSIS] | [Heightened REP for investigative metadata; *R v Spencer* line on subscriber identifiers] | [Severance audit per `ca-atip`; warrant or production-order required for compelled disclosure] | [Low / Med / High] |
| [Cross-reference to PIA personal-information inventory] | [REP analysis grounded in PIA-classified data elements] | [Lawful-authority chain per Privacy Act §4–§8] | [Low / Med / High] |

## s.15 Analysis

| Protected Ground | Differential Impact | Substantive-Equality Test | Residual |
|------------------|---------------------|----------------------------|----------|
| Race, national or ethnic origin, colour | [Disproportionate registration burden on specific diaspora communities] | [Distinction creating disadvantage; perpetuation of pre-existing disadvantage; not merely formal equality] | [Low / Med / High] |
| Religion | [Targeting of religious advocacy / community structures] | [Substantive impact on religious communities; not formal neutrality] | [Low / Med / High] |
| Sex, gender identity, sexual orientation | [Differential exposure / harassment risk on disclosure] | [Substantive impact across gendered patterns of advocacy and online harassment] | [Low / Med / High] |
| Age | [Younger / older user-experience burden of registration] | [Substantive accessibility test] | [Low / Med / High] |
| Mental or physical disability | [Accessibility of registration channels; cognitive burden of compliance] | [WCAG / accommodation duty; substantive-equality lens, not formal lens] | [Low / Med / High] |
| Analogous grounds (e.g. citizenship, immigration status) | [Differential impact on permanent residents, foreign nationals, refugees] | [Court-recognised analogous-ground test] | [Low / Med / High] |

## Oakes Proportionality Analysis

> Run the four-step test for **each engaged right**. Partial analysis is a common review failure.

### Right: s.2(b) — Freedom of Expression

| Step | Question | Answer |
|------|----------|--------|
| Pressing and substantial objective | What is the objective the limit serves, and is it pressing and substantial in a free and democratic society? | [Objective + evidence of substantiality] |
| Rational connection | Is the means rationally connected to the objective? | [Yes / No — explain] |
| Minimal impairment | Does the design impair the right as little as reasonably possible? | [Identify the least-restrictive alternatives considered and why this design is at the minimum-impairment frontier] |
| Proportional effects | Do the salutary effects outweigh the deleterious effects on the right-holder? | [Reasoning] |

### Right: s.2(d) — Freedom of Association

| Step | Question | Answer |
|------|----------|--------|
| Pressing and substantial objective | [As above for the association limit] | [Answer] |
| Rational connection | [As above] | [Answer] |
| Minimal impairment | [As above] | [Answer] |
| Proportional effects | [As above] | [Answer] |

### Right: s.7 — Life, Liberty, Security of the Person

| Step | Question | Answer |
|------|----------|--------|
| Pressing and substantial objective | [As above] | [Answer] |
| Rational connection | [As above] | [Answer] |
| Minimal impairment | [As above] | [Answer] |
| Proportional effects | [As above] | [Answer] |

### Right: s.8 — Search and Seizure

| Step | Question | Answer |
|------|----------|--------|
| Pressing and substantial objective | [As above for the search / production-order regime] | [Answer] |
| Rational connection | [As above] | [Answer] |
| Minimal impairment | [As above] | [Answer] |
| Proportional effects | [As above] | [Answer] |

### Right: s.15 — Equality

| Step | Question | Answer |
|------|----------|--------|
| Pressing and substantial objective | [As above for the differential-impact effect] | [Answer] |
| Rational connection | [As above] | [Answer] |
| Minimal impairment | [As above] | [Answer] |
| Proportional effects | [As above] | [Answer] |

## Mitigation Register

| Charter Risk | Mitigation | Owner | Status | Residual |
|--------------|------------|-------|--------|----------|
| s.2(b) chilling effect on advocacy / journalism | [Journalism / academic exemption + appeal route] | [Service Owner] | [Open / Closed] | [Low / Med / High] |
| s.2(d) disincentive to diaspora civil-society engagement | [Carve-outs + identity-verification minimisation] | [Service Owner] | [Open / Closed] | [Low / Med / High] |
| s.7 liberty effect of penal-backed registration | [Notice + representation + appeal to independent decision-maker] | [Departmental Justice Counsel] | [Open / Closed] | [Low / Med / High] |
| s.7 security-of-person effect of disclosure | [Threat-assessment screen + protective severance] | [DSO + Service Owner] | [Open / Closed] | [Low / Med / High] |
| s.8 over-collection beyond statutory authority | [Lawful-authority chain per PIA + warrant interface for compelled access] | [Privacy Counsel] | [Open / Closed] | [Low / Med / High] |
| s.15 differential impact on protected groups | [Substantive-equality monitoring + targeted accommodation] | [Service Owner + DOJ Counsel] | [Open / Closed] | [Low / Med / High] |

## DOJ Counsel Sign-Off Block

> Charter design review without named counsel sign-off is a draft, not an artefact. Constitutional matters route to DOJ HQ.

| Role | Counsel | Date | Conditions |
|------|---------|------|------------|
| Departmental Justice Counsel | [name] | [YYYY-MM-DD] | [conditions / open items / further analysis required] |
| DOJ HQ Constitutional Advisor (where the risk warrants) | [name] | [YYYY-MM-DD] | [conditions / open items] |
| ATIP coordinator (s.8 / privacy-adjacent matters) | [name] | [YYYY-MM-DD] | [conditions / open items] |
| Departmental Security Officer (s.7 security-of-person) | [name] | [YYYY-MM-DD] | [conditions / open items] |
| ADM accountable | [name] | [YYYY-MM-DD] | [conditions / open items] |

## External References

### Document Register

| Doc ID | Title | URL | Verified date |
|--------|-------|-----|---------------|
| CA-CHARTER | Canadian Charter of Rights and Freedoms (Constitution Act, 1982, Part I) | <https://laws-lois.justice.gc.ca/eng/const/page-12.html> | [YYYY-MM-DD] |
| CA-OAKES | *R v Oakes* [1986] 1 SCR 103 | <https://scc-csc.lexum.com/scc-csc/scc-csc/en/item/117/index.do> | [YYYY-MM-DD] |
| CA-HUNTER | *Hunter v Southam* [1984] 2 SCR 145 | <https://scc-csc.lexum.com/scc-csc/scc-csc/en/item/5274/index.do> | [YYYY-MM-DD] |
| CA-SPENCER | *R v Spencer* [2014] 2 SCR 212 | <https://scc-csc.lexum.com/scc-csc/scc-csc/en/item/14233/index.do> | [YYYY-MM-DD] |
| CA-CARTER | *Carter v Canada (AG)* [2015] 1 SCR 331 | <https://scc-csc.lexum.com/scc-csc/scc-csc/en/item/14637/index.do> | [YYYY-MM-DD] |
| CA-DOJ-CHARTER-STMT | DOJ Charter Statements guidance | <https://www.justice.gc.ca/eng/csj-sjc/pl/charter-charte/index.html> | [YYYY-MM-DD] |

### Citations

| Citation | Doc ID | Section | Used in |
|----------|--------|---------|---------|
| [CHARTER-1] | CA-CHARTER | s.1 — reasonable limits, justification under Oakes | Oakes Proportionality Analysis |
| [CHARTER-2] | CA-CHARTER | s.2 — fundamental freedoms | s.2 Analysis |
| [CHARTER-3] | CA-CHARTER | s.7 — life, liberty, security of the person | s.7 Analysis |
| [CHARTER-4] | CA-CHARTER | s.8 — search and seizure | s.8 Analysis |
| [CHARTER-5] | CA-CHARTER | s.15 — equality | s.15 Analysis |
| [OAKES-1] | CA-OAKES | Four-step proportionality test | Oakes Proportionality Analysis |
| [HUNTER-1] | CA-HUNTER | Reasonable expectation of privacy | s.8 Analysis |
| [SPENCER-1] | CA-SPENCER | Subscriber-identifier REP in digital contexts | s.8 Analysis |
| [CARTER-1] | CA-CARTER | Principles of fundamental justice under s.7 | s.7 Analysis |
| [DOJ-CS-1] | CA-DOJ-CHARTER-STMT | Charter Statement methodology and counsel-engagement guidance | DOJ Counsel Sign-Off Block |

### Unreferenced Documents

[List any documents read during generation but not cited, or "None".]
