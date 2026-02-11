# Strategic Outline Business Case (SOBC) Guide

Use `/arckit.sobc` to produce HM Treasury Green Book Strategic Outline Business Cases. The command pulls from stakeholders, risks, and principles to assemble the five-case model with traceability back to ArcKit artefacts.

---

## Flow at a Glance

```text
1. /arckit.principles
2. /arckit.stakeholders
3. /arckit.risk
4. /arckit.sobc   ← generates SOBC (`projects/<id>/ARC-<id>-SOBC-v1.0.md`)
5. /arckit.requirements (only if SOBC approved)
```

_Do not skip steps 2–3: stakeholder drivers feed benefits; risks drive optimism bias and management case._

---

## Five-Case Matrix

| Case | Key Questions | ArcKit Inputs | Output Highlights |
|------|---------------|---------------|-------------------|
| Strategic | Why change? Who cares? | Stakeholder map, principles, problem statement | Problem/vision, stakeholder alignment, scope |
| Economic | Which option wins? | Risk register, research, Wardley map (optional) | Option shortlist, cost/benefit table, NPV & ROI |
| Commercial | How will we buy? | Procurement strategy, supplier insights | Route to market (G-Cloud/DOS/open tender), contract model |
| Financial | Can we afford it? | Cost estimates, finance constraints | Funding profile, affordability analysis, sensitivity |
| Management | Can we deliver it? | Project plan, risk register, governance model | Delivery approach, roles (SRO/SI), change plan, benefits realisation |

---

## Command Usage

```bash
# minimal
/arckit.sobc Create SOBC for NHS appointment booking modernisation

# emphasise public sector controls
/arckit.sobc Create SOBC for HMRC cloud migration referencing TCoP and spend controls
```

Outputs are markdown-first (`projects/<id>/ARC-<id>-SOBC-v1.0.md`). Use Docs → Export to produce PDF if needed.

---

## Review Checklist

- Executive summary states investment ask, recommendation, and headline benefits.
- Benefits map back to stakeholder goals (IDs referenced in text).
- Risk section cites HIGH risks with mitigation owners and review cadence.
- Procurement route aligns with spend controls (Digital Marketplace, OJEU, etc.).
- Management case lists governance forums and stage gates.
- Annex includes dependencies on related programmes (if any).

---

## After the SOBC

| If outcome is… | Next step |
|----------------|-----------|
| Approved | Proceed to `/arckit.requirements`, update project plan, and start procurement preparation. |
| Conditional | Address actions (often risk mitigations or cost refinements) then re-run `/arckit.sobc`. |
| Rejected | Revisit stakeholder goals, problem statement, or option appraisal; consider discovery reset. |

Store the final SOBC alongside board minutes and upload to approval tooling as evidence.
