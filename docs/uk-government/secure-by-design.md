# Secure by Design Guide

A guide to UK Government and MOD Secure by Design principles using ArcKit.

---

## What is Secure by Design?

Secure by Design embeds security from the start of the development lifecycle, not bolted on later. Both UK Government (civilian) and Ministry of Defence (MOD) have Secure by Design frameworks.

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

## Two Frameworks

### UK Government Secure by Design (Civilian)
- NCSC guidance for government services
- WCAG 2.2 AA accessibility
- GDPR privacy by design
- Cyber Essentials baseline

### MOD Secure by Design (Defence)
- Defence-specific security requirements
- Protective monitoring
- Accreditation requirements
- Classified information handling

---

## When to Assess

```bash
# UK Government (civilian)
/arckit.secure Assess UK Government Secure by Design for [your project]

# Ministry of Defence
/arckit.mod-secure Assess MOD Secure by Design for [your project]
```

Run at key gates:
- Discovery/Alpha - Establish security baseline
- Beta - Pre-launch security review
- Live - Ongoing security monitoring

---

## Core Principles (Both Frameworks)

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

## UK Government Specific Requirements

### NCSC Cloud Security Principles
14 principles for assessing cloud services:
1. Data in transit protection
2. Asset protection and resilience
3. Separation between users
4. Governance framework
5. Operational security
6. Personnel security
7. Secure development
8. Supply chain security
9. Secure user management
10. Identity and authentication
11. External interface protection
12. Secure service administration
13. Audit information
14. Secure use of the service

### Cyber Essentials
Baseline cybersecurity:
- Firewalls
- Secure configuration
- Access control
- Malware protection
- Patch management

**Cyber Essentials Plus** required for systems handling personal data.

---

## MOD Specific Requirements

### Defence Information Classification
- **OFFICIAL**: Routine business
- **OFFICIAL-SENSITIVE**: More damaging if compromised
- **SECRET**: Serious damage to national security
- **TOP SECRET**: Exceptionally grave damage

### Accreditation
- Security Risk Management Overview (SRMO)
- Business Impact Assessment (BIA)
- Risk Treatment Plan
- Authority to Operate (ATO)

### Protective Monitoring
- Real-time security monitoring
- Threat detection
- Incident response
- Compliance with JSP 440

---

## Threat Modeling

Use STRIDE methodology:

- **S**poofing - Impersonation attacks
- **T**ampering - Data modification
- **R**epudiation - Deny actions
- **I**nformation Disclosure - Data leaks
- **D**enial of Service - Availability attacks
- **E**levation of Privilege - Unauthorized access

Document threats and mitigations in risk register.

---

## Integration with Other Processes

### Links to TCoP
- **TCoP Point 6** - Make things secure
- Secure by Design provides the "how"

### Links to Risk Register
- Security threats = Risks
- Security controls = Risk mitigations
- Risk owner = Security owner

### Links to Requirements
- Security requirements (NFR-S-xxx)
- Derived from threat model
- Testable security criteria

---

## Best Practices

### 1. Security Champions
- Embed security expertise in team
- Not just a gate/checklist
- Continuous security mindset

### 2. Shift Left
- Security from Discovery, not just before Live
- Threat model in Alpha
- Security testing in CI/CD

### 3. Defense in Depth
- Multiple layers of security
- Don't rely on single control
- Assume breach, limit impact

### 4. Regular Reviews
- Quarterly security reviews
- After major changes
- Penetration testing annually

---

## Common Gaps

### 1. No Threat Modeling
**Gap**: Security added reactively
**Fix**: Run STRIDE in Alpha, document threats

### 2. Weak Authentication
**Gap**: Username/password only
**Fix**: Implement MFA, consider passwordless

### 3. Poor Logging
**Gap**: No audit trail
**Fix**: Centralized logging, SIEM, retention policies

### 4. No Penetration Testing
**Gap**: Unknown vulnerabilities
**Fix**: Annual pen testing, address findings

### 5. Unencrypted Data
**Gap**: Data at risk
**Fix**: Encrypt at rest (AES-256), in transit (TLS 1.3)

---

## Support

For issues or questions:
- GitHub Issues: https://github.com/tractorjuice/arc-kit/issues
- NCSC Secure by Design: https://www.ncsc.gov.uk/collection/developers-collection
- MOD JSP 440: https://www.gov.uk/government/publications/jsp-440-defence-manual-of-security

---

**Last updated**: 2025-10-28
**ArcKit Version**: 0.3.6
