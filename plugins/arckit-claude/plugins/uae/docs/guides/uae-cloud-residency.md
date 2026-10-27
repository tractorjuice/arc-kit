# UAE Sovereign Cloud Residency Playbook

> **Guide Origin**: Community | **ArcKit Version**: [VERSION]

`/arckit-uae:uae-cloud-residency` assesses sovereign cloud residency under the UAE National Cloud Security Policy, Version 2.0 (UAE Cyber Security Council, September 2025). Validates per-classification residency, checks candidate CSPs against the policy's tiers and minimum certifications, and captures the shared-responsibility matrix and exit / portability plan.

---

## Inputs

| Artefact | Purpose |
|----------|---------|
| Smart Data Classification Register (`ARC-<id>-CLAS-v*.md`) | **Required** — drives residency rules per dataset |
| Architecture (`diagrams/ARC-<id>-DIAG-*-v*.md`) | Workload topology and components |
| IAS Statement of Applicability (`ARC-<id>-IAS-v*.md`) | T-family technical controls constrain CSP choice |

> **Run after**: `/arckit-uae:uae-classification` — the command halts if the classification register is missing.

---

## Command

```bash
/arckit-uae:uae-cloud-residency <project ID or service name>
```

Output: `projects/<id>/ARC-<id>-CRES-v1.0.md`

---

## Assessment Structure

| Section | Contents |
|---------|----------|
| Scope | Workloads in scope, CII status, classification levels involved |
| Per-Dataset Residency Assessment | Smart Data class, policy level, required tier, actual hosting, gap, exception if any |
| CSP Due-Diligence Pack | Candidate CSPs checked against the tier requirements and the Appendix 6.6 minimum certifications |
| Shared-Responsibility Matrix | Customer / CSP responsibility per IAS control |
| Exit and Portability Plan | Lock-in mitigations, data egress, rebuild plan |
| External References | National Cloud Security Policy v2 citations |

---

## Residency Rule

The policy sets its own four data classification levels (Appendix 6.7: Open, Confidential/Restricted, Secret and Top Secret) and lets the consumer map its scheme onto them. The assessment records that mapping for each dataset. On the two documents' definitions, Smart Data `Open` is the policy's Open and `Confidential` is Confidential/Restricted. `Sensitive` sits above Confidential/Restricted when the dataset holds sensitive personal or health data (the policy places medical history and biometric data there) or its disclosure could cause significant harm at national, Emirate or sectoral level, and otherwise at Confidential/Restricted. Smart Data `Secret` sits above Confidential/Restricted.

| Policy level | Required tier | What it requires (clauses of the policy) |
|---|---|---|
| Open | Baseline Secure Cloud Requirements | No UAE-location requirement; the location must be known and the CSP must operate in an acceptable legal jurisdiction (§2.4.1.1–2.4.1.3) |
| Confidential/Restricted | Partial Sovereign Cloud or Sovereign Cloud (§2.4.1.4) | Data stored in the UAE (§3.4.1.1); keys and their backups generated, stored and managed in the UAE (§3.3.2.5); redundancy within the UAE (§3.9.1.4) |
| Above Confidential/Restricted | Sovereign Cloud only (§2.4.1.5) | Also processing and metadata in the UAE (§3.4.1.4–3.4.1.5); UAE-based HSMs (§3.3.2.6); no access from outside the UAE (§3.6.6.2) |

Source: UAE Cyber Security Council, *National Cloud Security Policy*, Version 2.0, September 2025, policy page <https://csc.gov.ae/en/w/national-cloud-security-policy>. The UAE Legislation Platform lists it with an issued date of 17 September 2025: <https://uaelegislation.gov.ae/en/policy/details/national-cloud-security-policy>.

---

## Candidate CSPs

The policy names no CSPs, keeps no approved-provider list and sets no accreditation scheme. Instead, each CSP keeps an up-to-date list of its services that meet the Partial Sovereign or Sovereign Cloud Requirements (§3.4.1.2, §3.4.1.6), and every cloud service must hold the minimum certifications in Appendix 6.6 (§3.1.5.1):

- **UAE-specific**: UAE Information Assurance Standard (self-assessment) and DESC Information Security Regulation (self-assessment).
- **International**: valid ISO/IEC 27001:2022, ISO/IEC 27017:2019, ISO/IEC 27018:2019 and ISO/IEC 22301:2019 certificates; SOC 1 and SOC 2 Type II attestation reports; CSA STAR 2 certification or attestation.

The providers below are common candidates, not approved ones. Check each service a dataset uses against the CSP's own list and the dataset's tier.

| Provider | Region(s) | Sovereign posture |
|----------|-----------|-------------------|
| Core42 / G42 Sovereign | UAE | Federal sovereign cloud |
| Microsoft Azure | UAE North, UAE Central | Hyperscaler with UAE residency |
| TDRA FedNet | UAE | Federal government network |
| e& Sovereign Launchpad on AWS | UAE | Sovereign overlay on AWS |

> AWS `me-south-1` is the Middle East (Bahrain) Region, so it is not UAE-resident and does not meet the residency rule for Confidential-and-above datasets. AWS's UAE Region is `me-central-1`, Middle East (UAE), open since August 2022 (AWS Availability Zones documentation, <https://docs.aws.amazon.com/global-infrastructure/latest/regions/aws-availability-zones.html>; AWS News Blog, <https://aws.amazon.com/blogs/aws/now-open-aws-region-in-the-united-arab-emirates-uae/>). Record the AWS Region for every AWS-hosted dataset. The policy sets no UAE-location requirement for Open data, so only an Open dataset may be stored in a non-UAE Region.

---

## One-Page Workflow

| Phase | Key Activities | ArcKit Commands |
|-------|----------------|-----------------|
| Classification | Smart Data ladder per dataset | `/arckit-uae:uae-classification` |
| Residency | CSP / region selection + SR matrix | `/arckit-uae:uae-cloud-residency` |
| Decisions | Capture CSP and region as ADRs | `/arckit:adr` |
| Security | Reconcile T-family gaps | `/arckit-uae:uae-ias`, `/arckit:risk` |

---

## Review Checklist

- Smart Data Classification Register exists and was the input.
- Every dataset carries its Smart Data class, the policy level it maps to and the reason.
- Every Confidential/Restricted dataset is on a Partial Sovereign or Sovereign Cloud with data stored in the UAE, and every dataset above it is on a Sovereign Cloud.
- Any exception cites the Cyber Security Council's approval (§1.4 of the policy).
- Each candidate CSP's Appendix 6.6 certifications recorded with the evidence seen and its date.
- Shared-responsibility matrix mapped to IAS controls (no orphans).
- Exit / portability plan covers data extraction format and timeline.
- Material decisions (CSP, region, derogations) captured as ADRs.

---

## Key Notes

- **Hard prerequisite**: This command halts without `ARC-<id>-CLAS-v*.md`. Run `/arckit-uae:uae-classification` first.
- **Who the policy applies to**: Ministries and federal authorities, and non-government Critical Information Infrastructure (CII) entities. Where an Emirate has a CIIP programme, its Emirate lead assesses applicability and enforces the policy for Emirate government and non-government CII entities; otherwise the policy applies to Emirate government entities (§1.2). The residency tier depends on the data's classification level, not on CII status.
- **Decision capture**: CSP and region selection are architecturally significant — produce ADRs via `/arckit:adr`.
- **Community-contributed**: Output should be reviewed by qualified federal compliance counsel before reliance.
