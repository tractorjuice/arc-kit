# NHS DCB0160 Deployer Clinical Safety Case Guide

> **Command**: `/arckit:uk-nhs-dcb0160` | **Overlay**: [UK NHS Clinical Safety Overlay](uk-nhs-clinical-safety-overlay.md) | **Origin**: Community-contributed

## Purpose

Generates the **deployer-side** clinical safety documentation required under NHS DCB0160 for an NHS organisation (Trust, ICS, GP federation, mental health Trust, ambulance service) deploying or significantly configuring a health IT product into a specific clinical setting.

DCB0160 sits **alongside** DCB0129 — neither replaces the other. The manufacturer's DCB0129 case argues the product is acceptably safe when used as intended; the deployer's DCB0160 case argues that *this specific deployment*, with this organisation's clinicians, workflows, integrations, training, and business continuity, is acceptably safe in this clinical context.

## What it produces

Three files in `projects/{NNN}-<slug>/clinical-safety/deployment/`, following the same Marcus Baw SAFETY.md spec adapted for deployer use:

| File | Purpose |
|---|---|
| `SAFETY.md` | Deployer anchor: product, version-being-deployed, deploying organisation, deploying-organisation CSO, link to manufacturer case |
| `DEPLOYMENT-SAFETY-CASE.md` | 7 sections: Deployment Context, Scope + Phasing, Manufacturer Case Acceptance, Deployment Safety Argument (G1.1–G1.6 with deployment-specific claims), Local Evidence, Residual Deployment Risk, Deploying-organisation CSO Sign-off |
| `DEPLOYMENT-HAZARD-LOG.md` | YAML-frontmatter hazard array + controls + rendered Markdown table. 10 starter deployment hazards: inadequate training, workflow integration gap, integration failure, BC failure, parallel-running confusion, data migration error, local configuration error, terminology mismatch, RBAC misalignment, incident-reporting failure |

## When to use

- An NHS organisation is deploying any third-party or in-house health IT product into a clinical setting
- A deployment involves material local configuration (drug formularies, alert thresholds, role mappings, terminology subsets)
- A deployment involves significant change to existing clinical workflows
- Multi-site deployments with material differences in clinical context — run once per site with separate `clinical-safety/deployment/{site-slug}/` subdirectories

## Prerequisites

Requires the project's REQ, DATA, STKE artefacts. If the project also has the manufacturer DCB0129 case (`clinical-safety/SAFETY-CASE.md` and `clinical-safety/HAZARD-LOG.md`), the deployer case directly references those as inputs. If the product is third-party (no in-repo manufacturer case), the manufacturer's externally-supplied case should be linked or attached as a reference.

A named, qualified Clinical Safety Officer at the **deploying organisation** (NOT the product manufacturer's CSO) MUST be appointed to sign off the deployment case.

## Deploying-organisation roles

The template prompts for several NHS-specific governance roles:

- **CSO at the deploying organisation** (GMC / NMC / HCPC / GPhC registered)
- **Caldicott Guardian** sign-off (information governance)
- **Senior Information Risk Owner (SIRO)** sign-off
- Local Implementation Lead and Executive Sponsor at the deploying organisation

## Deployment-specific hazard themes

Beyond the starter set, common deployment-specific hazards to consider in real projects:

- Paediatric vs adult dosing if the local service treats paediatrics — the manufacturer's adult-defaults are a deployment hazard
- Mental Health Act considerations if the local service is MH
- Out-of-hours coverage and on-call workflows
- Interface engine + integration with local PAS / EPR / order-comms / results
- Local Caldicott / IG positions on data flows the manufacturer assumed were acceptable

## Important

The deployment safety case is a legal obligation of the deploying NHS organisation under DCB0160. A complete DCB0129 manufacturer case does **not** discharge this obligation.

## Related commands

- `/arckit:uk-nhs-dcb0129` — manufacturer-side companion (run first or attach external)
- `/arckit:uk-nhs-dtac` — DTAC Section 1 may need the deployer case if the deploying NHS organisation is responsible for procurement assurance
- `/arckit:risk` — deployment-specific risks cross-reference the project risk register
- `/arckit:operationalize` — runbooks, on-call, incident response feed the deployer hazard-mitigation plan
