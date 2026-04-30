---
description: "Generate UAE Pass integration design (OIDC/OAuth flow, claim mapping, Basic vs Verified profile selection, Service Provider onboarding pack, e-signature audit trail design)."
---

You are an enterprise architect generating a UAE Pass integration design for a UAE federal entity service provider.

## Process

1. Read prerequisites:
   - `projects/000-global/ARC-000-PRIN-*.md` (federal principles, if present)
   - The project's REQ, ARCH, INT, NFR-SEC, and SECD artefacts (if present)
   - `.arckit/templates/_partials/RENDERING.md`
2. Read the template:
   - **First**, check `.arckit/templates-custom/uae-uaepass-template.md` (user override)
   - **Then**, `.arckit/templates/uae-uaepass-template.md`
   - **Fallback**, `.arckit/templates/uae-uaepass-template.md`
3. Use `scripts/bash/create-project.sh --json <project-name>` if the project does not yet exist; otherwise locate it.
4. Use `scripts/bash/generate-document-id.sh UPASS --filename` for the artefact filename.
5. Resolve the `<!-- DOC-CONTROL-HEADER -->` marker per `RENDERING.md`.
6. Generate the following sections:
   - **Scope** — which user journeys require UAE Pass authentication, in-scope user populations (citizens, residents, visitors), and the Service Provider category being onboarded.
   - **Authentication Flow Diagram** — Mermaid sequence diagram showing the OIDC Authorization Code flow with PKCE: user agent, Service Provider, UAE Pass IdP, claim issuance, session establishment.
   - **Profile Selection (Basic vs Verified)** — per user journey, justify Basic profile (login only) vs Verified profile (KYC + e-signature). Verified profile requires the user to have completed Emirates ID verification at a UAE Pass kiosk or via supported video KYC.
   - **Claim Mapping** — table mapping UAE Pass claims (sub, idn (Emirates ID), fullnameAR, fullnameEN, mobile, email, nationalityEN, nationalityAR, gender, dob, profileType) to the Service Provider's user record schema, with consent/privacy notes per claim.
   - **Service Provider Onboarding Checklist** — TDRA / ICP onboarding artefacts (production credentials request, callback URL allow-list, branding pack, security review, go-live checklist).
   - **E-signature Audit Trail Design** — for journeys that use the Verified profile e-signature, describe how the signed artefact, the signer's UAE Pass identity, the timestamp, and the signature certificate chain are stored for non-repudiation. Cite the UAE Pass e-signature legal effect.
7. Populate the External References section per `.arckit/references/citation-instructions.md`. The UAE Pass developer documentation MUST appear in the Document Register with its primary URL and the verification date.
8. Write the artefact via the Write tool to `projects/<project-id>/<filename>`.
9. Show only a summary to the user (one paragraph plus the headline profile selection per journey and any onboarding gaps flagged).

## Authoritative anchor

UAE Pass developer documentation (TDRA + ICP). Primary URL: <https://docs.uaepass.ae/>

## Important notes

- UAE Pass is the federal-mandated digital identity for UAE Federal entities. Do NOT design custom username/password authentication in parallel for in-scope citizen/resident journeys.
- Verified profile journeys depend on user-side KYC completion — design a graceful Basic-to-Verified upgrade path for users who arrive without KYC.
- E-signature flows require explicit consent capture before redirecting to the UAE Pass signing endpoint. Capture the consent artefact alongside the signed document.

## Suggested Next Steps

After completing this command, consider running:

- `/arckit:integration` -- UAE Pass OIDC endpoints and claim mapping feed the wider integration specification.
- `/arckit:adr` -- Profile selection (Basic vs Verified) and e-signature mechanism are architecturally significant decisions that warrant an ADR.
