# Technology Code of Practice Guide

A guide to assessing UK Government Technology Code of Practice (TCoP) compliance using ArcKit.

---

## What is the Technology Code of Practice?

The Technology Code of Practice (TCoP) is a set of 13 criteria for designing, building and buying technology in UK Government. It ensures technology projects are secure, accessible, value for money, and aligned with standards.

### Why TCoP Matters

For UK Government projects, TCoP compliance is **mandatory**:
- ❌ Non-compliance blocks approvals (CDDO, HMT)
- ❌ Service assessments fail
- ❌ Audit findings from NAO

With TCoP compliance:
- ✅ CDDO digital spend control approval
- ✅ Service assessment readiness
- ✅ NAO audit compliance
- ✅ Best practice technology delivery

---

## The 13 TCoP Points

1. **Define user needs** - Understand users and their needs
2. **Make things accessible** - WCAG 2.2 AA compliance
3. **Be open and use open source** - Publish code, use OSS
4. **Make use of open standards** - APIs, data formats
5. **Use cloud first** - Public cloud preferred
6. **Make things secure** - NCSC Cloud Security Principles
7. **Make privacy integral** - GDPR, privacy by design
8. **Share, reuse and collaborate** - Avoid duplication
9. **Integrate and adapt technology** - Work with existing systems
10. **Make better use of data** - Data architecture
11. **Define your purchasing strategy** - Digital Marketplace
12. **Make your technology sustainable** - Carbon footprint
13. **Meet the Service Standard** - If public-facing service

---

## When to Assess TCoP

```bash
/arckit.tcop Assess Technology Code of Practice compliance for [your project]
```

Run at key project gates:
- Discovery/Alpha - Baseline assessment
- Beta - Pre-launch compliance check
- Live - Ongoing compliance monitoring

---

## TCoP Assessment Output

ArcKit creates `projects/NNN-project-name/tcop-review.md` containing:

1. **Executive Summary** - Overall compliance status
2. **13 Point Assessments** - Status, evidence, gaps for each point
3. **Compliance Scorecard** - Visual summary
4. **Critical Issues** - Blockers requiring immediate action
5. **Recommendations** - Prioritized action plan
6. **Next Steps** - Timeline for addressing gaps

---

## Key Requirements

### Point 2: Accessibility
- WCAG 2.2 Level AA compliance (legal requirement)
- Accessibility statement published
- Assistive technology testing
- Regular accessibility audits

### Point 5: Cloud First
- Public cloud considered first option
- If not public cloud, justification documented
- Data residency (UK/EU)

### Point 6: Security
- NCSC Cloud Security Principles assessed
- Cyber Essentials Plus for systems handling personal data
- Threat modeling completed
- Penetration testing planned

### Point 7: Privacy
- DPIA (Data Protection Impact Assessment) completed
- UK GDPR compliance
- Privacy by design
- ICO registration if required

### Point 13: Service Standard
- If public-facing, must meet GDS Service Standard
- Service assessments at Alpha, Beta, Live
- Performance metrics defined

---

## Best Practices

### 1. Assess Early
- Run TCoP assessment in Discovery/Alpha
- Address gaps before Beta
- Don't wait until pre-live

### 2. Document Everything
- Evidence for each TCoP point
- Decisions and rationale
- Gaps and mitigation plans

### 3. Link to Other Governance
- SOBC includes TCoP compliance
- Risk register includes TCoP risks
- Requirements include TCoP obligations

### 4. Regular Reviews
- Quarterly TCoP reviews
- Update after major changes
- Track compliance over time

---

## Common Gaps

### Point 1: User Needs
**Gap**: No user research conducted
**Fix**: Run user interviews, create personas, test with real users

### Point 2: Accessibility
**Gap**: Not tested with assistive technology
**Fix**: Test with screen readers, keyboard navigation, magnification

### Point 6: Security
**Gap**: No threat modeling
**Fix**: Run STRIDE or similar, document threats and mitigations

### Point 7: Privacy
**Gap**: No DPIA completed
**Fix**: Complete DPIA, identify PII, define retention policies

### Point 11: Procurement
**Gap**: Not using Digital Marketplace
**Fix**: Search G-Cloud/DOS first, justify if alternatives used

---

## Support

For issues or questions:
- GitHub Issues: https://github.com/tractorjuice/arc-kit/issues
- Official TCoP: https://www.gov.uk/guidance/the-technology-code-of-practice

---

**Last updated**: 2025-10-28
**ArcKit Version**: 0.3.6
