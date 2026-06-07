# NHS DCB0160 Deployment Clinical Safety Case — Wrapper Template

> **Template Origin**: Community | **ArcKit Version**: [VERSION] | **Command**: `/arckit:uk-nhs-dcb0160`

This wrapper exists only for `/arckit:customize list` and the documentation site. The actual generated outputs are three files under `clinical-safety/deployment/`:

1. [`uk-nhs-dcb0160-deployment-safety-template.md`](./uk-nhs-dcb0160-deployment-safety-template.md) — renders to `clinical-safety/deployment/SAFETY.md`
2. [`uk-nhs-dcb0160-deployment-case-template.md`](./uk-nhs-dcb0160-deployment-case-template.md) — renders to `clinical-safety/deployment/DEPLOYMENT-SAFETY-CASE.md`
3. [`uk-nhs-dcb0160-deployment-hazard-template.md`](./uk-nhs-dcb0160-deployment-hazard-template.md) — renders to `clinical-safety/deployment/DEPLOYMENT-HAZARD-LOG.md`

The three files together implement the NHS DCB0160 deployer-side documentation expected by NHS England under the Health and Social Care Act 2012 s250. They follow Dr Marcus Baw's [SAFETY.md spec v2.0.0-draft](https://github.com/pacharanero/SAFETY.md) for filenames and YAML-frontmatter structure, prefixed with an ArcKit Document Control block.

DCB0160 sits alongside DCB0129 — neither replaces the other. The manufacturer's DCB0129 case is the input; the deployer's DCB0160 case argues that *this specific deployment* of the product, with this organisation's clinicians, workflows, integrations, training, and business continuity, is acceptably safe.
