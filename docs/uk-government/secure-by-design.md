# UK Government Secure by Design Guide

A guide to UK Government (civilian) Secure by Design principles using ArcKit.

---

## What is Secure by Design?

Secure by Design embeds security from the start of the development lifecycle, not bolted on later. This guide covers the UK Government NCSC framework for civilian government services.

### Why Secure by Design Matters

Without security by design:
- ❌ Vulnerabilities discovered late (expensive to fix)
- ❌ Compliance failures (NCSC, Cyber Essentials)
- ❌ Breaches and incidents
- ❌ Audit findings

With security by design:
- ✅ Security built-in from start
- ✅ Proactive threat mitigation
- ✅ Compliance by design
- ✅ Lower total security cost

---

## When to Assess

```bash
/arckit.secure Assess UK Government Secure by Design for [your project]
```

Run at key gates:
- Discovery/Alpha - Establish security baseline
- Beta - Pre-launch security review
- Live - Ongoing security monitoring

---

## UK Government Framework

### NCSC Guidance
- NCSC Secure by Design principles
- WCAG 2.2 AA accessibility
- GDPR privacy by design
- Government Security Classifications (OFFICIAL, OFFICIAL-SENSITIVE)

---

## Core Principles

### 1. Establish Context
- What are you protecting? (data classification)
- Who are the threats? (threat actors)
- What are the risks? (threat modeling)

### 2. Make Compromise Difficult
- Strong authentication (MFA)
- Least privilege access
- Network segmentation
- Encryption at rest and in transit

### 3. Make Disruption Difficult
- Resilience and availability
- DDoS protection
- Backup and recovery
- Incident response plan

### 4. Make Compromise Detection Easier
- Logging and monitoring
- Security information and event management (SIEM)
- Anomaly detection
- Regular security audits

### 5. Reduce Impact of Compromise
- Damage limitation
- Incident response procedures
- Data minimization
- Quick recovery capability

---

## NCSC Cloud Security Principles

14 principles for assessing cloud services:

1. **Data in transit protection** - TLS 1.3, secure protocols
2. **Asset protection and resilience** - Data backup, disaster recovery
3. **Separation between users** - Multi-tenancy controls
4. **Governance framework** - Security policies, accountability
5. **Operational security** - Vulnerability management, patching
6. **Personnel security** - Background checks, vetting
7. **Secure development** - SDLC, code review, security testing
8. **Supply chain security** - Third-party risk assessment
9. **Secure user management** - Identity lifecycle management
10. **Identity and authentication** - MFA, strong authentication
11. **External interface protection** - API security, boundary protection
12. **Secure service administration** - Privileged access management
13. **Audit information** - Logging, audit trails, SIEM
14. **Secure use of the service** - User guidance, security awareness

---

## Cyber Essentials

**Mandatory baseline** for UK Government systems handling personal data.

### Five Controls:

1. **Firewalls** - Network boundary protection
2. **Secure Configuration** - Hardened systems, default deny
3. **Access Control** - User access management, least privilege
4. **Malware Protection** - Anti-malware, detection and response
5. **Patch Management** - Timely updates, vulnerability remediation

**Cyber Essentials Plus** required for:
- Systems handling personal data
- Government contracts over £5M
- HIGH impact services

---

## Government Security Classifications

### OFFICIAL
- Routine business information
- Public services data
- Low impact if compromised
- Standard protective measures

### OFFICIAL-SENSITIVE
- More damaging if compromised
- Personal data (GDPR)
- Commercial confidence
- Enhanced protective measures
- Need-to-know basis

---

## Threat Modeling

Use **STRIDE** methodology:

- **S**poofing - Impersonation attacks
- **T**ampering - Data modification
- **R**epudiation - Deny actions
- **I**nformation Disclosure - Data leaks
- **D**enial of Service - Availability attacks
- **E**levation of Privilege - Unauthorized access

Document threats and mitigations in risk register.

---

## GDPR and Privacy

### Privacy by Design

- Data minimization - Collect only what's needed
- Purpose limitation - Use data only for stated purpose
- Storage limitation - Retention policies
- Data subject rights - Access, rectification, erasure
- Privacy impact assessment (PIA) - For high-risk processing

### GDPR Article 22

Special requirements for automated decision-making:
- Right to human review
- Right to explanation
- Right to challenge decision

---

## Integration with Other Processes

### Links to TCoP
- **TCoP Point 6** - Make things secure
- Secure by Design provides the "how"
- NCSC principles align with TCoP requirements

### Links to Risk Register
- Security threats = Risks
- Security controls = Risk mitigations
- Risk owner = Security owner
- Risk assessment feeds security requirements

### Links to Requirements
- Security requirements (NFR-S-xxx)
- Derived from threat model
- Testable security criteria
- Acceptance criteria for security controls

---

## Best Practices

### 1. Security Champions
- Embed security expertise in team
- Not just a gate/checklist
- Continuous security mindset
- Bridge between security and delivery teams

### 2. Shift Left
- Security from Discovery, not just before Live
- Threat model in Alpha
- Security testing in CI/CD
- DevSecOps culture

### 3. Defense in Depth
- Multiple layers of security
- Don't rely on single control
- Assume breach, limit impact
- Layered protection (network, application, data)

### 4. Regular Reviews
- Quarterly security reviews
- After major changes
- Penetration testing annually
- Vulnerability scanning continuously

---

## Common Gaps

### 1. No Threat Modeling
**Gap**: Security added reactively
**Fix**: Run STRIDE in Alpha, document threats

### 2. Weak Authentication
**Gap**: Username/password only
**Fix**: Implement MFA, consider passwordless (FIDO2)

### 3. Poor Logging
**Gap**: No audit trail
**Fix**: Centralized logging, SIEM, retention policies (7 years for audit)

### 4. No Penetration Testing
**Gap**: Unknown vulnerabilities
**Fix**: Annual pen testing (CHECK scheme), address findings

### 5. Unencrypted Data
**Gap**: Data at risk
**Fix**: Encrypt at rest (AES-256), in transit (TLS 1.3)

### 6. Missing Privacy Impact Assessment
**Gap**: GDPR non-compliance
**Fix**: Conduct PIA for high-risk processing, document safeguards

---

## Compliance Checklist

- [ ] Cyber Essentials (or Plus) certification
- [ ] NCSC Cloud Security Principles assessed
- [ ] Threat model completed (STRIDE)
- [ ] Security requirements defined (NFR-S-xxx)
- [ ] Privacy Impact Assessment (if high-risk)
- [ ] Penetration testing scheduled
- [ ] Incident response plan documented
- [ ] Security monitoring configured (SIEM)
- [ ] Access control implemented (least privilege, MFA)
- [ ] Encryption configured (at rest and in transit)

---

## Support

For issues or questions:
- GitHub Issues: https://github.com/tractorjuice/arc-kit/issues
- NCSC Secure by Design: https://www.ncsc.gov.uk/collection/developers-collection
- NCSC Cloud Security Principles: https://www.ncsc.gov.uk/collection/cloud/the-cloud-security-principles
- Cyber Essentials: https://www.ncsc.gov.uk/cyberessentials

---

**Last updated**: 2025-10-28
**ArcKit Version**: 0.3.6
