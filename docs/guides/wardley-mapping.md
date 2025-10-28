# Wardley Mapping Guide

A guide to creating Wardley Maps for strategic planning and build vs buy decisions using ArcKit.

---

## What is a Wardley Map?

A Wardley Map is a strategic planning tool that visualizes the evolution of components from genesis (novel) to commodity (standard). It helps make build vs buy decisions and identify competitive advantages.

### Why Wardley Mapping Matters

Without strategic mapping:
- ❌ Build custom solutions for commodity problems
- ❌ Miss opportunities for competitive advantage
- ❌ Unclear technology evolution strategy
- ❌ Poor vendor selection decisions

With Wardley mapping:
- ✅ Clear build vs buy decisions
- ✅ Identify where to compete (novel) vs where to standardize (commodity)
- ✅ Technology roadmap aligned with evolution
- ✅ Strategic positioning vs competitors

---

## When to Create Wardley Maps

Run `/arckit.wardley` after data model, for strategic analysis:

```
6. /arckit.data-model        ← Understand system components
7. /arckit.wardley           ← STRATEGIC ANALYSIS (START HERE)
8. /arckit.sow               ← Informed by build vs buy decisions
```

---

## Creating Wardley Maps with ArcKit

```bash
/arckit.wardley Create Wardley Map for [your project]
```

**Examples**:
```bash
/arckit.wardley Create Wardley Map for payment gateway showing build vs buy strategy

/arckit.wardley Map evolution of customer portal components

/arckit.wardley Analyze strategic positioning for NHS appointment system
```

---

## Evolution Axis

Components evolve from left (novel) to right (commodity):

### I. Genesis (Novel)
- Unique, custom-built
- Competitive advantage
- High risk, high reward
- **Action**: Build in-house, protect IP

### II. Custom-Built
- Bespoke but understood
- Differentiating but not unique
- **Action**: Build or partner

### III. Product/Rental
- Packaged products available
- Standard with customization
- **Action**: Buy commercial product

### IV. Commodity/Utility
- Standardized, ubiquitous
- No differentiation
- **Action**: Use commodity service

---

## Build vs Buy Decisions

**Build (Genesis/Custom)**:
- Core competitive differentiator
- No suitable products exist
- Strategic IP to protect

**Buy (Product/Commodity)**:
- Non-differentiating functionality
- Good products available
- Lower TCO than building

**Example**:
```
Build: Proprietary risk-scoring algorithm (competitive advantage)
Buy: Payment processing (commodity, use Stripe)
Buy: Email sending (commodity, use GOV.UK Notify)
```

---

## Support

For issues or questions:
- GitHub Issues: https://github.com/tractorjuice/arc-kit/issues

---

**Last updated**: 2025-10-28
**ArcKit Version**: 0.3.6
