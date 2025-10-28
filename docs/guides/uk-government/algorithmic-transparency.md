# Algorithmic Transparency Recording Standard (ATRS) Guide

A guide to creating Algorithmic Transparency Records for UK Government AI systems using ArcKit.

---

## What is ATRS?

The Algorithmic Transparency Recording Standard (ATRS) requires UK Government organizations to publish information about algorithmic tools that assist in significant decisions affecting individuals.

### Why ATRS Matters

**Mandatory for**:
- Algorithmic decision-making systems
- AI/ML models used in government services
- Automated processing affecting citizens

**Purpose**:
- Public transparency
- Accountability
- Build trust in government AI

---

## When to Create ATRS

```bash
/arckit.atrs Create Algorithmic Transparency Record for [your AI system]
```

**Required if your system**:
- Uses algorithms to assist decisions about individuals
- Operates in UK central government
- Affects significant outcomes (benefits, services, enforcement)

---

## ATRS Contents

1. **Organization Details** - Department, contact
2. **Algorithm Details** - Name, purpose, how it works
3. **Decision Details** - What decisions are influenced
4. **Data Used** - Input data sources and types
5. **Algorithm Type** - Rule-based, ML model, etc.
6. **Fairness and Bias** - Mitigation measures
7. **Human Oversight** - How humans review decisions
8. **Contact Information** - Public contact point

---

## Where ATRS is Published

- https://www.gov.uk/government/collections/algorithmic-transparency-recording-standard-hub
- Publicly accessible
- Updated when algorithm changes significantly

---

## Links to Other Requirements

- **AI Playbook** - Ethical AI development
- **GDPR Article 22** - Automated decision-making
- **TCoP Point 7** - Privacy integral

---

## Support

For issues or questions:
- GitHub Issues: https://github.com/tractorjuice/arc-kit/issues
- Official ATRS: https://www.gov.uk/government/publications/algorithmic-transparency-template

---

**Last updated**: 2025-10-28
**ArcKit Version**: 0.3.6
