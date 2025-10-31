# MOD Secure by Design Guide

A guide to Ministry of Defence Secure by Design principles using ArcKit.

---

## What is MOD Secure by Design?

MOD Secure by Design embeds security from the start of the development lifecycle, tailored for defence-specific requirements including classified information handling, protective monitoring, and accreditation.

### Why MOD Secure by Design Matters

Without security by design:
- ❌ Accreditation failures and delays
- ❌ Classified data breaches
- ❌ Non-compliance with JSP 440
- ❌ Operational security risks

With security by design:
- ✅ Security built-in from start
- ✅ Faster accreditation (ATO)
- ✅ JSP 440 compliance
- ✅ Operational readiness

---

## When to Assess

```bash
/arckit.mod-secure Assess MOD Secure by Design for [your project]
```

Run at key gates:
- Initial Gate - Establish security baseline and classification
- Main Gate - Pre-deployment security review and accreditation
- In-Service - Ongoing protective monitoring and compliance

---

## MOD Framework

### Key Standards
- JSP 440 - Defence Manual of Security
- JSP 604 - Accreditation of Defence Information Systems
- HMG Security Policy Framework
- Defence Cyber Protection Partnership (DCPP)

---

## Core Principles

### 1. Establish Context
- **Classification** - What protection level? (OFFICIAL to TOP SECRET)
- **Threat actors** - Nation states, insider threats, cyber criminals
- **Defence implications** - Operational impact, strategic risk

### 2. Make Compromise Difficult
- Strong authentication (MFA, PKI certificates)
- Least privilege access (need-to-know)
- Network segmentation (defence in depth)
- Encryption at rest and in transit (CESG approved cryptography)

### 3. Make Disruption Difficult
- Resilience and availability (mission critical systems)
- DDoS protection
- Backup and recovery (including classified backups)
- Incident response plan (integrated with SOC)

### 4. Make Compromise Detection Easier
- Protective monitoring (mandatory for SECRET and above)
- Security information and event management (SIEM)
- Anomaly detection
- Regular security audits and assessments

### 5. Reduce Impact of Compromise
- Damage limitation (containment strategies)
- Incident response procedures (aligned with DCPP)
- Data minimization
- Quick recovery capability (RTO/RPO objectives)

---

## Defence Information Classification

### OFFICIAL
- **Protection**: Standard protective measures
- **Examples**: Routine business, low-impact operational data
- **Clearance**: None required
- **Accreditation**: Light-touch ITHC

### OFFICIAL-SENSITIVE
- **Protection**: Enhanced protective measures
- **Examples**: Personal data, commercial confidence, operational planning
- **Clearance**: Security Check (SC) for system administrators
- **Accreditation**: ITHC, accreditation authority sign-off

### SECRET
- **Protection**: Strict protective measures
- **Examples**: Military operations, intelligence, serious damage to national security
- **Clearance**: Developed Vetting (DV) required
- **Accreditation**: Full RMADS, SRMO, ATO from Accreditation Authority
- **Protective Monitoring**: Mandatory real-time monitoring

### TOP SECRET
- **Protection**: Highest protective measures
- **Examples**: Exceptionally grave damage to national security
- **Clearance**: Enhanced DV required
- **Accreditation**: Full RMADS, SRMO, ATO from Senior Accreditation Authority
- **Protective Monitoring**: Continuous monitoring, dedicated SOC

---

## Accreditation Process

### Security Risk Management Overview (SRMO)

Comprehensive security documentation:

1. **System Description** - Architecture, components, data flows
2. **Business Impact Assessment (BIA)** - Confidentiality, integrity, availability impact levels
3. **Threat Assessment** - Threat actors, attack vectors
4. **Vulnerability Assessment** - Technical and procedural weaknesses
5. **Risk Assessment** - Likelihood × Impact, residual risk
6. **Risk Treatment Plan** - Security controls, mitigations
7. **Statement of Sensitivity** - Classification rationale
8. **Operating Procedures** - Security operations, incident response

### Authority to Operate (ATO)

- **Interim ATO** - Limited deployment for testing (6-12 months)
- **Full ATO** - Production operation (typically 3 years)
- **Re-accreditation** - Before ATO expiry or after major changes

**Accreditation Authority approves** based on:
- Acceptable residual risk
- Appropriate security controls
- Compliance with JSP 440
- Protective monitoring in place

---

## Protective Monitoring

**Mandatory for SECRET and above**, recommended for OFFICIAL-SENSITIVE.

### Requirements

- Real-time security monitoring
- Threat detection and alerting
- Automated response capabilities
- Integration with MOD Security Operations Centre (SOC)
- Log retention (minimum 7 years for audit)

### Key Indicators

- Failed authentication attempts
- Privilege escalation
- Data exfiltration patterns
- Malware detection
- Configuration changes
- Anomalous user behaviour

### JSP 440 Compliance

- Protective Monitoring Plans documented
- Reviewed by accreditation authority
- Regular testing and validation
- Incident response integration

---

## Threat Modeling for Defence

Use **STRIDE** methodology with defence context:

- **S**poofing - State-sponsored identity theft, insider impersonation
- **T**ampering - Data manipulation by adversary, supply chain compromise
- **R**epudiation - Deniable actions, lack of attribution
- **I**nformation Disclosure - Classified data leaks, SIGINT interception
- **D**enial of Service - Kinetic attacks, cyber attacks on mission systems
- **E**levation of Privilege - Unauthorized access to classified systems

**Additional Defence Threats:**
- **Insider threat** - Malicious insider, negligent user
- **Supply chain** - Compromised components, nation-state backdoors
- **Physical security** - Site intrusion, equipment theft

Document all threats in Security Risk Management Overview (SRMO).

---

## MOD-Specific Security Controls

### CESG Approved Cryptography

- Use CESG approved products for SECRET and above
- FIPS 140-2/3 validated for OFFICIAL
- Key management aligned with CPA guidelines

### Personnel Security

- **Security Check (SC)** - OFFICIAL-SENSITIVE system administrators
- **Developed Vetting (DV)** - SECRET and above access
- **Enhanced DV** - TOP SECRET or higher
- Regular vetting reviews and refreshes

### Physical Security

- Secure areas for classified systems (JSP 440)
- TEMPEST protection for SECRET and above
- Emanation security assessments
- Controlled access (biometric, dual authentication)

### Supply Chain Security

- Vendor security assessments
- Component origin verification
- No high-risk vendors (HCSEC guidance)
- Secure development and delivery

---

## Integration with Other Processes

### Links to Defence Architecture

- Defence Architecture Framework (MODAF)
- Security View (SV) integrated with architecture
- Operational View (OV) includes security considerations

### Links to Risk Register

- Security threats = Operational risks
- Risk owner = Information Asset Owner (IAO)
- Residual risk accepted by Accreditation Authority

### Links to Requirements

- Security requirements (SyRS-S-xxx)
- Derived from threat model and BIA
- Testable acceptance criteria
- Linked to security controls

---

## Best Practices

### 1. Engage Accreditation Authority Early
- Start accreditation process in concept phase
- Regular engagement throughout lifecycle
- Avoid late surprises and rework

### 2. Threat Intelligence Integration
- Subscribe to MOD threat intelligence feeds
- Integrate with DCPP threat sharing
- Update threat model with emerging threats

### 3. Defense in Depth
- Multiple layers of security
- Assume breach, limit impact
- Network segmentation by classification
- Layered access controls

### 4. Security Testing
- IT Health Check (ITHC) by CHECK approved testers
- Penetration testing for SECRET and above
- Vulnerability scanning continuously
- Red team exercises for critical systems

---

## Common Gaps

### 1. Late Accreditation Engagement
**Gap**: Accreditation as afterthought, delays deployment
**Fix**: Engage Accreditation Authority at Initial Gate

### 2. Inadequate Protective Monitoring
**Gap**: No real-time monitoring, delayed incident detection
**Fix**: Implement SIEM, integrate with MOD SOC, 24/7 monitoring

### 3. Classification Errors
**Gap**: Under-classified (security risk) or over-classified (unnecessary cost)
**Fix**: Conduct proper Business Impact Assessment, review with IAO

### 4. Weak Key Management
**Gap**: Poor cryptographic key handling
**Fix**: CESG approved key management, HSM for SECRET+

### 5. Insider Threat Not Addressed
**Gap**: Focus only on external threats
**Fix**: User behaviour analytics, need-to-know enforcement, vetting

### 6. Missing SRMO Documentation
**Gap**: Incomplete accreditation documentation
**Fix**: Follow JSP 604 SRMO template, engage early with Accreditor

---

## Accreditation Checklist

- [ ] Business Impact Assessment (BIA) completed
- [ ] Information Asset Owner (IAO) assigned
- [ ] Threat assessment completed (STRIDE + insider threat)
- [ ] Security requirements defined (SyRS-S-xxx)
- [ ] Security Risk Management Overview (SRMO) drafted
- [ ] Accreditation Authority engaged
- [ ] IT Health Check (ITHC) scheduled
- [ ] Protective monitoring configured
- [ ] Personnel vetting appropriate for classification
- [ ] CESG approved cryptography (if SECRET+)
- [ ] Physical security measures in place
- [ ] Incident response plan aligned with DCPP
- [ ] Authority to Operate (ATO) obtained

---

## Support

For issues or questions:
- GitHub Issues: https://github.com/tractorjuice/arc-kit/issues
- JSP 440: https://www.gov.uk/government/publications/jsp-440-defence-manual-of-security
- JSP 604: https://www.gov.uk/government/publications/jsp-604-accreditation-of-defence-information-systems
- Defence Cyber Protection Partnership: https://www.gov.uk/government/groups/defence-cyber-protection-partnership

---

**Last updated**: 2025-10-28
**ArcKit Version**: 0.3.6
