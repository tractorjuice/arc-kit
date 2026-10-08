---
name: DDaT Rate Card & Day Rates
description: "Answers questions about the G-Cloud 15 Lot 3 (Cloud Support) rate card: its DDaT job families, roles and role levels, the pricing rules (maximum UK and offshore day rates, £50 minimum, 7.5-hour day, reduce-only), how the average day rate is scored, what suppliers charge for common role levels, and mapping roles to SFIA skills to describe a team. Not needed when the request is for the Lot 3 service definition or the pricing document; /arckit-uk-gcloud:sdd-lot3 and pricing produce those from the same data."
---

# DDaT Rate Card & Day Rates

Conversational knowledge about the G-Cloud 15 Lot 3 rate card: its job families, roles and role levels, the rules for pricing them, and what suppliers actually charge.

## Purpose

On G-Cloud 15, every Lot 3 (Cloud Support) supplier has one rate card, shown in full on each of its Lot 3 services. Suppliers give a **maximum day rate, UK and offshore, for each role level they offer**, chosen from a fixed list of 9 job families, 58 roles and 222 role levels. The list follows the government's Digital, Data and Technology (DDaT) profession capability framework. SFIA rate cards, used on G-Cloud 14, are no longer part of the framework.

## When to Use

Activate when users ask about:

- Which roles and levels the Lot 3 rate card offers
- What day rate to set for a role level, or what the market charges
- UK versus offshore rates
- The pricing rules for Lot 3
- How a role maps to SFIA skills (still useful for describing a team)

## Quick Reference: Rate Card Rules

These come from the G-Cloud 15 pricing schedule (Framework Schedule 3) and How to tender (Attachment 2):

| Rule | Detail |
|------|--------|
| What you price | A maximum day rate per role level, UK (onshore) and optionally offshore |
| Scope | One card per supplier for all its Lot 3 services; every Lot 3 listing shows the whole card. The overlay keeps it in the supplier-wide `ARC-000-RATE` document, written by `/arckit-uk-gcloud:pricing` |
| Day length | 7.5 hours |
| Minimum rate | £50 a day |
| Travel and subsistence | Included in the rate within the M25 |
| Changing rates | Rates can be reduced during the framework, never increased |
| Risk | No uplift for risk or contingency may be built into a rate |
| Levels you can't provide | Leave them blank |
| Evaluation | Lot 3 price is 80% of the score. Your **average day rate** is every rate you enter, UK and offshore, added up and divided by how many there are (ignoring any under £50 or over £10,000). The lowest average in the tender scores the full 80%; others score in proportion |
| Where rates go | GCA's Digital Platform; the rate card then shows on every Lot 3 listing you have |

## Quick Reference: Job Families

| Job family | Roles |
|-----------|-------|
| Architecture roles | 7 (business, data, enterprise, network, security, solution, technical architect) |
| Chief digital and data roles | 3 (chief data officer, CISO, CTO) |
| Cyber security roles | 8 (audit and assurance, digital forensics, governance and risk, incident response, monitoring, secure design, testing, vulnerability management) |
| Data roles | 8 (analytics engineer, data analyst, data engineer, data ethicist, data governance manager, data scientist, ML engineer, performance analyst) |
| IT operations roles | 12 (application operations, change and release, incident, problem, service desk, IT service manager, infrastructure and more) |
| Product and delivery roles | 6 (business analyst, delivery manager, digital portfolio manager, product manager, programme delivery manager, service owner) |
| Quality assurance testing (QAT) roles | 3 (QAT analyst, test engineer, test manager) |
| Software development roles | 3 (DevOps engineer, frontend developer, software developer) |
| User-centred design roles | 8 (accessibility specialist, content designer, content strategist, graphic designer, interaction designer, service designer, technical writer, user researcher) |

Levels run from Apprentice, Trainee or Junior through Associate, the role itself, Senior and Lead, to Principal or Head. Each role has its own set; see `references/lot-3-rate-card.md`.

## Quick Reference: What Suppliers Charge

Maximum UK day rates on live G-Cloud 15 listings, across suppliers (each supplier counted once). Snapshot of 42,893 services scraped on 7 October 2026.

| Role level | Suppliers | Middle half (p25–p75) | Median | Offshore median |
|-----------|-----------|----------------------|--------|-----------------|
| Junior developer | 719 | £500–£800 | £650 | £500 |
| Developer | 828 | £654–£990 | £800 | £600 |
| Senior developer | 814 | £800–£1,200 | £950 | £745 |
| Lead developer | 776 | £900–£1,360 | £1,100 | £850 |
| DevOps engineer | 786 | £690–£998 | £800 | £600 |
| Data engineer | 825 | £650–£995 | £800 | £600 |
| Lead data engineer | 794 | £925–£1,374 | £1,100 | £850 |
| Solution architect | 1,029 | £800–£1,170 | £950 | £750 |
| Principal solution architect | 955 | £1,150–£1,680 | £1,400 | £1,100 |
| Business analyst | 965 | £660–£1,000 | £800 | £650 |
| Delivery manager | 1,016 | £750–£1,080 | £900 | £700 |
| User researcher | 664 | £650–£950 | £800 | £600 |

These are **maximum** rates; call-off prices are often lower. This overlay doesn't bundle the full benchmark table for all 222 role levels. For a role level not listed here, compare the rate cards on rival Lot 3 listings (`/arckit-uk-gcloud:gcloud-competitors`), and say how many listings the comparison rests on.

## Answering Questions

1. **Name roles and levels exactly as the rate card does**: buyers filter on them, and only the listed levels can be priced.
2. **Quote benchmarks as a range with their date and supplier count**, and say they are maximum rates from live listings, not contract prices.
3. **One card per supplier:** every Lot 3 listing shows the supplier's whole card, and only 2 of the 1,135 suppliers with more than one live Lot 3 service show different cards on different services. Price is scored on the average of every rate on it, UK and offshore alike, so senior levels and offshore rates both move the score. Offer the levels the supplier can staff at that rate across all its Lot 3 services.
4. **Roles outside DDaT** (procurement and commercial advisers, trainers): price them at the nearest DDaT role and level by the work and seniority, and say so in the service definition document. Live Lot 3 procurement listings price such people mostly as architects, IT service managers, delivery managers and business analysts.
5. **Use SFIA only to describe skills**, not to price: `references/sfia-skills.md` maps roles to SFIA skill codes and suggests team compositions.

## Related Commands

These ArcKit commands use the rate card:

| Command | Use |
|---------|-----|
| `/arckit-uk-gcloud:sdd-lot3` | Lists the role levels that deliver a service, named from these families, roles and levels |
| `/arckit-uk-gcloud:pricing` | Owns the supplier's one Lot 3 rate card (`projects/000-global/supplier/ARC-000-RATE-v*.md`): sets day rates against the pricing rules and the market |
| `/arckit-uk-gcloud:lot-questions` | Lot 3 mandatory award criteria |

## Additional Resources

### Reference Files

- **`references/lot-3-rate-card.md`** — Every job family, role and role level, in GCA's order, generated from GCA's Lot 3 rate card document (RM1557.15).
- **`references/sfia-skills.md`** — SFIA 8 skill codes, levels, DDaT-to-SFIA mappings, team compositions for common Lot 3 service types, and the UK Government AI Skills Framework. Use it to describe what a team does, not to price it.
