# ICAM Architecture (OMB M-19-17 / NIST SP 800-63-3)

> **Template Origin**: Community | **ArcKit Version**: [VERSION] | **Command**: `/arckit:us-icam`

## Document Control

<!-- DOC-CONTROL-HEADER -->
<!-- Resolved at command-execution time per _partials/RENDERING.md. -->
<!-- Classification line MUST be: -->
<!-- | Classification | PUBLIC / OFFICIAL / OFFICIAL-SENSITIVE (set via `default_classification` user-config) | -->

## Revision History

| Version | Date | Author | Changes | Approved By | Approval Date |
|---------|------|--------|---------|-------------|---------------|
| [VERSION] | [YYYY-MM-DD] | ArcKit AI | Initial creation from `/arckit:us-icam` command | PENDING | PENDING |

---

## Executive Summary

[Two to three paragraphs: scope of the ICAM design, target user populations (employees, contractors, citizens, partners), federation pattern, IAL/AAL/FAL targets, and key implementation decisions (PIV vs derived credentials, login.gov vs Entra ID Gov, SAML vs OIDC).]

---

## 1. Identity Use Cases

| Use Case ID | Description | User Population | IAL | AAL | FAL | Rationale |
|-------------|-------------|-----------------|-----|-----|-----|-----------|
| UC-001 | Federal employee SSO to internal apps | [Federal employees] | IAL3 | AAL3 | FAL2 | [PIV-mandated by HSPD-12; AAL3 driven by privileged data access] |
| UC-002 | Contractor SSO to internal apps | [Contractors] | IAL3 | AAL3 | FAL2 | [PIV-I or equivalent per HSPD-12 contractor guidance] |
| UC-003 | Public citizen account on agency portal | [Citizens] | IAL2 | AAL2 | FAL2 | [Verified citizen identity required for benefits; login.gov default] |
| UC-004 | Partner agency federation | [Partner agency staff] | IAL3 | AAL2 | FAL2 | [Inter-agency federation; partner asserts IAL] |
| UC-005 | Privileged administrator | [Internal IT admins] | IAL3 | AAL3 | FAL2 | [Phishing-resistant MFA; just-in-time elevation] |

---

## 2. Identity Proofing Flow

### 2.1 Federal Employees and Contractors

[For federal employees, identity proofing is performed during PIV enrolment per FIPS 201-3. Reference the agency's HSPD-12 sponsor / registrar / issuer roles. Derived PIV credentials (NIST SP 800-157) may be issued for mobile devices once the primary PIV is established.]

```text
Sponsor → Registrar (proofing — I-9 docs, biometrics) → Issuer (PIV card) → Activator → Cardholder
```

### 2.2 Public Citizens (login.gov)

[Identity proofing for citizen-facing systems is performed by login.gov per GSA's IAL2 process. Agencies do not perform direct identity proofing for the public.]

```text
Citizen → login.gov account creation → IAL2 proofing (ID upload + selfie or in-person USPS PostalProof) → AAL2 authenticator binding → Agency RP receives proofed assertion
```

---

## 3. Identity Provider Selection

| IdP Option | Use Case | Rationale | Status |
|-----------|----------|-----------|--------|
| **PIV / PIV-D (agency PKI)** | Federal employees + contractors | [Mandated by HSPD-12; provides AAL3 phishing-resistant authenticator] | [Selected — primary] |
| **login.gov** | Public citizens | [GSA-operated; IAL2 + AAL2 default; no agency-side proofing burden] | [Selected — citizen] |
| **Microsoft Entra ID Government** | Federal employees if Microsoft-centric agency | [Tight integration with M365 GCC / GCC-High; supports FIDO2 + PIV federation] | [Conditional] |
| **Okta Identity Cloud for Government** | Federal employees | [FedRAMP-Moderate authorised; broad SaaS connector library] | [Conditional] |
| **Agency-internal SAML / OIDC IdP** | Bespoke internal use | [When PIV is the trust anchor but additional attribute store needed] | [Conditional] |

[Document the selected IdP per use case with FedRAMP authorisation reference, supported authenticators, and any custom claims required.]

---

## 4. PIV Integration Architecture (Federal Employees)

| Element | Selection |
|---------|-----------|
| **Primary credential** | [PIV card per FIPS 201-3] |
| **Mobile credential** | [Derived PIV per NIST SP 800-157 / SP 800-157A] |
| **Card lifecycle** | [Agency HSPD-12 issuer; revocation via OCSP / CRL] |
| **Federation point** | [Agency SAML IdP fronting PIV; or direct PIV-Auth via PKINIT to Entra ID] |
| **Browser support** | [Smart-card middleware: ActivClient / native macOS / Linux pcsc-lite] |
| **Derived credential issuer** | [Agency-internal CA or commercial issuer (Entrust, IdenTrust, etc.)] |
| **Fallback for PIV-incompatible apps** | [Reverse-proxy with PIV-to-OIDC bridge] |

---

## 5. login.gov Integration Architecture (Public Citizens)

| Element | Selection |
|---------|-----------|
| **Federation protocol** | [SAML 2.0 or OIDC — OIDC preferred for new integrations] |
| **IAL target** | [IAL1 (no proofing) / IAL2 (verified)] |
| **AAL target** | [AAL2] |
| **Attribute mapping** | [email, sub, given_name, family_name, ssn (IAL2), birthdate (IAL2), address (IAL2)] |
| **Account linking strategy** | [login.gov sub claim as primary key; legacy account migration plan] |
| **PII minimisation** | [Request only attributes the agency needs; document lawful authority for each] |
| **Sandbox URL** | [https://idp.int.identitysandbox.gov/] |
| **Production URL** | [https://secure.login.gov/] |
| **Integration agreement (IAA)** | [GSA login.gov IAA reference] |

---

## 6. Federation Pattern

| Pattern | Choice | Rationale |
|---------|--------|-----------|
| **Employee → Internal apps** | [SAML 2.0 / OIDC] | [SAML where SaaS support is mature; OIDC for new builds] |
| **Citizen → Citizen-facing apps** | [OIDC] | [login.gov OIDC support; mobile-friendly] |
| **Inter-agency federation** | [SAML 2.0] | [FICAM Trust Framework Solutions (TFS) certified] |
| **Workload identity (service-to-service)** | [SPIFFE / mTLS / OAuth 2.0 client_credentials] | [Per Zero Trust apps & workloads pillar] |

---

## 7. Credential Lifecycle

| Stage | Process | Owner |
|-------|---------|-------|
| **Issuance** | [PIV: HSPD-12 enrolment; login.gov: GSA-managed; agency: IT onboarding] | [HSPD-12 issuer / GSA / IT ops] |
| **Activation** | [In-person PIV activation; login.gov: self-service email + phone] | [Cardholder / user] |
| **Use** | [Daily authentication; MFA challenge per AAL] | [User] |
| **Suspension** | [Lost-card / compromised-credential workflow; immediate OCSP revocation] | [HSPD-12 issuer / login.gov] |
| **Revocation** | [Separation, role-change-to-non-eligible, fraud — irreversible] | [HSPD-12 issuer] |
| **Recovery** | [Reissue per agency policy; identity proofing repeated if > 12 months elapsed] | [HSPD-12 issuer / login.gov] |

---

## 8. Privileged Access Management (PAM)

| Capability | Implementation |
|-----------|----------------|
| **Break-glass accounts** | [Documented owners; checked into vault; alarm on use; quarterly review] |
| **Just-in-time elevation** | [PAM tool with approval workflow; max session 4 hours] |
| **MFA for privileged** | [Phishing-resistant AAL3 — PIV or FIDO2 WebAuthn only; no SMS / TOTP] |
| **Session recording** | [Full keystroke + video for privileged sessions; retain ≥ 1 year] |
| **Vaulted credentials** | [PAM vault — service-account creds rotated daily; never in scripts] |
| **Logging** | [PAM logs forwarded to SIEM; SOC alert on anomalous patterns] |

---

## 9. Compliance to NIST SP 800-63-3

### Volume A (Identity Proofing)

| Requirement | IAL2 Status | IAL3 Status |
|-------------|------------|-------------|
| Identity evidence (strong + superior or 2× strong) | [Met / Gap] | [N/A — IAL3 via PIV] |
| Address confirmation | [Met / Gap] | [N/A] |
| Knowledge-based verification (where used) | [Met / Gap] | [N/A] |
| Biometric capture (IAL3) | [N/A] | [Met / Gap] |
| Trusted referee allowed | [Yes / No] | [Yes — supervised remote] |

### Volume B (Authenticators and Lifecycle)

| Requirement | AAL2 Status | AAL3 Status |
|-------------|------------|-------------|
| Multi-factor (something you have + something you know/are) | [Met] | [Met] |
| Phishing resistance | [Recommended] | [Required — PIV / FIDO2 WebAuthn] |
| Verifier-impersonation resistance | [Recommended] | [Required] |
| Replay resistance | [Required] | [Required] |
| Cryptographic authenticator | [Recommended] | [Required] |

### Volume C (Federation Assertion)

| Requirement | FAL2 Status |
|-------------|------------|
| Bearer assertion with audience restriction | [Met / Gap] |
| Encrypted assertion (or transport TLS) | [Met — TLS 1.2+] |
| Holder-of-key assertion (FAL3) | [Conditional — only where required] |
| Replay protection on assertion | [Met] |

---

## 10. Compliance Crosswalk

| Framework Requirement | ICAM Element Satisfying |
|-----------------------|-------------------------|
| OMB M-19-17 — ICAM modernisation | [Federation architecture; IdP selection] |
| OMB M-22-09 — phishing-resistant MFA | [PIV + FIDO2 mandate] |
| HSPD-12 | [PIV issuance per FIPS 201-3] |
| FIPS 201-3 | [PIV card spec] |
| NIST SP 800-63-3 | [IAL / AAL / FAL targets] |
| NIST SP 800-157 / 157A | [Derived PIV] |

---

## 11. References

| Reference | Citation | URL |
|-----------|----------|-----|
| OMB M-19-17 | Enabling Mission Delivery through Improved Identity, Credential, and Access Management | <https://www.whitehouse.gov/wp-content/uploads/2019/05/M-19-17.pdf> |
| NIST SP 800-63-3 | Digital Identity Guidelines | <https://pages.nist.gov/800-63-3/> |
| NIST SP 800-63A | Enrollment and Identity Proofing | <https://pages.nist.gov/800-63-3/sp800-63a.html> |
| NIST SP 800-63B | Authentication and Lifecycle Management | <https://pages.nist.gov/800-63-3/sp800-63b.html> |
| NIST SP 800-63C | Federation and Assertions | <https://pages.nist.gov/800-63-3/sp800-63c.html> |
| FIPS 201-3 | Personal Identity Verification (PIV) of Federal Employees and Contractors | <https://doi.org/10.6028/NIST.FIPS.201-3> |
| NIST SP 800-157 | Derived PIV Credentials | <https://doi.org/10.6028/NIST.SP.800-157> |
| login.gov developer docs | login.gov developer documentation | <https://developers.login.gov/> |
| FICAM | Federal Identity, Credential, and Access Management | <https://www.idmanagement.gov/> |

---

## 12. Approvals

| Role | Name | Signature | Date |
|------|------|-----------|------|
| ICAM Programme Lead | [Name] | [Signature] | [YYYY-MM-DD] |
| CISO | [Name] | [Signature] | [YYYY-MM-DD] |
| Privacy Officer (SAOP) | [Name] | [Signature] | [YYYY-MM-DD] |
| CIO | [Name] | [Signature] | [YYYY-MM-DD] |

---

**Generated by**: ArcKit `/arckit:us-icam` command
**Generated on**: [DATE]
**ArcKit Version**: [VERSION]
**Project**: [PROJECT_NAME]
**Model**: [AI_MODEL]
