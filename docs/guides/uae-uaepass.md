# UAE Pass Integration Playbook

> **Guide Origin**: Community | **ArcKit Version**: [VERSION]

`/arckit.uae-uaepass` generates a UAE Pass integration design for federal entity service providers. Covers the OIDC / OAuth flow, claim mapping, Basic vs Verified profile selection, the Service Provider onboarding pack, and the e-signature audit-trail design.

---

## Inputs

| Artefact | Purpose |
|----------|---------|
| Requirements (`ARC-<id>-REQ-v1.0.md`) | Citizen-facing flows that need authentication |
| Architecture (`ARC-<id>-ARCH-v1.0.md`) | Service topology and identity boundaries |
| Integration spec (`ARC-<id>-INT-v1.0.md`) | Existing integration surface |
| Security NFRs (`ARC-<id>-NFR-SEC-v1.0.md`) | Authentication / e-signature requirements |

---

## Command

```bash
/arckit.uae-uaepass <project ID or service name>
```

Output: `projects/<id>/ARC-<id>-UPASS-v1.0.md`

---

## Design Structure

| Section | Contents |
|---------|----------|
| Scope | Services integrated, channels (web / mobile), user types (resident / visitor / business) |
| Authentication Flow Diagram | OIDC / OAuth sequence with redirect URIs and back-channel calls |
| Profile Selection | Basic vs Verified profile per flow with rationale |
| Claim Mapping | UAE Pass claims → application user model (with PII minimisation) |
| Service Provider Onboarding Checklist | Registration, certificates, environments, go-live gates |
| E-signature Audit Trail Design | Hash chain, evidence retention, dispute handling |
| External References | UAE Pass developer portal and policy citations |

---

## Profile Selection Cheat Sheet

| Use case | Profile |
|----------|---------|
| Anonymous / public information | None |
| Lightweight account creation | Basic |
| Government service requiring identity verification | Verified |
| Financial / regulated transaction | Verified + e-signature |
| Cross-border / non-resident user | Profile may be unavailable — design fallback |

---

## One-Page Workflow

| Phase | Key Activities | ArcKit Commands |
|-------|----------------|-----------------|
| Architecture | Identity boundaries and integration surface | `/arckit.platform-design`, `/arckit.integration` |
| UAE Pass | Integration design + onboarding pack | `/arckit.uae-uaepass` |
| Decisions | Profile choice and e-signature mechanism as ADRs | `/arckit.adr` |
| Security | Reconcile with IAS T5 (Access Control) controls | `/arckit.uae-ias` |

---

## Review Checklist

- Profile selection rationale documented per flow.
- Claim mapping is minimised — only requested claims used.
- Redirect URIs and back-channel endpoints listed for every environment.
- E-signature audit trail meets retention and tamper-evidence requirements.
- Onboarding gates (certificates, sandbox tests, go-live approvals) sequenced.
- Profile selection and e-signature mechanism captured as ADRs.

---

## Key Notes

- **Loa-to-eIDAS mapping**: UAE Pass Loa-to-eIDAS mapping is flagged as `[NEEDS VERIFICATION]` in the overlay maintenance log — confirm before relying on cross-border interoperability claims.
- **Non-resident fallback**: UAE Pass is for residents and citizens — non-resident flows need an alternative IdP path.
- **Sandbox first**: All integration testing must complete in the UAE Pass sandbox before production credentials are issued.
- **Community-contributed**: Output should be reviewed by qualified federal compliance counsel before reliance.
