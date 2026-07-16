# arc-kit × Clarivate / Web of Science — Integration Plan

**Status:** draft for review
**Owner:** Mark Craddock
**Scope:** wiring Clarivate research-intelligence APIs (Web of Science, Pivot-RP funding data, Derwent) into arc-kit as evidence sources for architecture and strategy artefacts.

---

## 1. Why this belongs in arc-kit

arc-kit's commercial argument is that it commoditises Big Four artefact production, leaving judgement and trust as the differentiators. The weak point in any AI-generated strategy artefact is *provenance* — a Wardley map or an options appraisal is only as defensible as the evidence under it. Clarivate's APIs supply exactly the class of evidence that is expensive to gather by hand and hard to dispute once cited: peer-reviewed publication volume, citation weight, funding flows, patent activity, and organisation-level research footprints.

Concretely, the integration lets arc-kit answer questions it currently can only assert:

- Where does a capability sit on the evolution axis? Publication and patent growth curves are a defensible proxy for the genesis → commodity transition.
- Who are the credible players in a technology area, by research output rather than marketing presence?
- Which funders are backing a field, at what scale, and is the money rising or falling? (Directly from the Pivot-RP awarded-grants layer.)
- What is a given institution's real research strength, for due-diligence or competitive-intelligence artefacts?

This turns arc-kit maps from opinion into evidenced opinion — the trust half of the commercial argument.

## 2. The API landscape (as tested)

Findings from live probing of the Clarivate developer platform, recorded so the next person doesn't repeat the reconnaissance:

| API | Host | Auth | Cost | Gives us |
|-----|------|------|------|----------|
| WoS Starter | `api.clarivate.com/apis/wos-starter/v1` | `X-ApiKey` | Free Trial: 50/day, **no times-cited**. Institutional Member: 5,000/day **with** times-cited | Bibliographic match, journal lookup, publication counts |
| WoS Expanded | `wos-api.clarivate.com/api/wos` | `X-ApiKey` | Paid licence | Full record: **funding acknowledgements, addresses/affiliations, cited references, GRANTS database**, citation categories |
| Derwent GraphQL | `api.clarivate.com/derwent-graphql` | `X-ApiKey` | Paid licence | Patent search / classification / assignee trees |
| InCites / JCR | portal | `X-ApiKey` | Paid | Normalised citation indicators, Journal Impact Factor |
| Pivot-RP | product, not open API | subscription | Curated funding opportunities + awarded grants |

**Key facts established by testing:**

- The **Free Trial plan is self-serve and instant** — register an application on the portal, subscribe it to WoS Starter, get a key. No wait.
- The Free Trial plan deliberately **withholds times-cited counts** — the citation graph is the monetised asset, not the metadata. For evolution scoring we need *either* the Institutional Member plan (free, but requires an org WoS subscription) *or* Expanded.
- The **Expanded `databaseId` enum includes `GRANTS`** as a first-class searchable database, alongside WOS, MEDLINE, DIIDW (Derwent), PPRN (preprints), PQDT (dissertations). This is the same funding data that surfaces in Pivot-RP's awarded-grants module — reachable programmatically through one endpoint.
- `optionView=FR` (FullRecord) is the single switch that returns funding + full affiliation blocks vs. the trimmed default.
- Derwent's GraphQL endpoint leaks its **schema** to unauthenticated introspection (8 query ops, ~40-field search input) but gates all **data** behind the key — useful for building a client offline, useless for pulling patents without a licence.

## 3. Architecture

Follow arc-kit's existing plugin/skill shape rather than bolting on a monolith.

```
arc-kit/
  plugins/
    clarivate/
      SKILL.md                # trigger + usage doc, same pattern as arckit:wardley-mapping
      client/
        wos_starter.py        # free-tier client (bibliographic + counts if licensed)
        wos_expanded.py       # paid client (funding, affiliations, grants, refs)
        derwent.py            # patent client (optional, licence-gated)
        cache.py              # local response cache — see §5
      transforms/
        evolution_signal.py   # publication/patent curves → evolution-stage hint
        funder_flows.py       # GRANTS/Pivot data → funder value-chain
        org_footprint.py      # affiliation rollup for an institution
      commands/
        /arckit:evidence-scan # pull evidence for a named capability/tech
        /arckit:funder-map    # build a funder value-chain for a field
```

**Design principles:**

1. **Key handling out of band.** Read `CLARIVATE_STARTER_KEY` / `CLARIVATE_EXPANDED_KEY` from environment or a git-ignored `.arckit/secrets.env`. Never commit keys; never echo them into artefacts or logs. (This matters doubly given Mark's security-clearance context — treat keys as secrets by default.)
2. **Graceful degradation by plan.** The client detects whether times-cited is present in responses and downgrades the evolution-signal transform accordingly, rather than failing. A Free Trial key still produces publication-*volume* signals; only citation-weighted signals need the paid/institutional tier.
3. **Evidence is cited, not laundered.** Every datum pulled carries its WoS UID / grant reference ID / DOI into the artefact, so a reader can verify. This is the whole point — provenance is the product.
4. **Rate-limit aware.** Free Trial is 1 req/s, 50/day. The client must throttle and cache hard, or a single map build will exhaust the quota.

## 4. Concrete use cases mapped to arc-kit artefacts

| arc-kit artefact | Clarivate input | Transform |
|------------------|-----------------|-----------|
| Wardley map — evolution positioning | WoS publication count by year for a capability's search terms; patent count from Derwent | Rising publication curve + emerging patents → *custom-built → product*; plateau + heavy patents → *product → commodity*. Feeds the x-axis as an evidence hint, not an auto-placement. |
| Wardley map — component players | WoS org-enhanced (`OG=`) counts; affiliation rollup | Rank real research contributors for a component; distinguishes genuine capability from marketing noise |
| Funder value-chain | Expanded `GRANTS` database + Pivot-RP awarded grants | Map funders → schemes → recipients as a value chain; size by award value; trend by year |
| Options appraisal / five-case model (economic case) | Funding-flow trend for a field | Evidence the "do nothing / grow market" narrative with actual funder investment direction |
| Due-diligence / competitive-intelligence pack | `org_footprint` for a named institution or company | Research strength, top fields, collaboration network, funding won — defensible institutional profile |
| Technology radar / horizon scan | Preprints (`PPRN`) + publication velocity | Early-signal detection ahead of the citation lag |

The evolution-signal use case is the headline one — it directly strengthens the Wardley skill arc-kit already ships, and it's the hardest thing to do credibly by hand.

## 5. Caching and reproducibility

Architecture artefacts must be reproducible — a map built today should rebuild identically next month unless deliberately refreshed. So:

- Cache every API response keyed by the exact query, under `.arckit/cache/clarivate/`.
- Store the snapshot date alongside. Artefacts cite "WoS data as of YYYY-MM-DD".
- `--refresh` forces a re-pull; default reuses cache. This mirrors the existing arckit-build `--refresh` / `--resume` semantics, so it's one consistent mental model.
- Caching also protects the 50/day free quota during iterative artefact development.

## 6. Phased delivery

**Phase 0 — spike (done in principle).** Reconnaissance complete: endpoints, auth, plan differences, GRANTS database, swagger specs all confirmed. Test harness (`wos_test.sh`) exists covering Starter + Expanded.

**Phase 1 — free-tier evidence-scan.** Ship `wos_starter.py` + `evolution_signal.py` (volume-only) + `/arckit:evidence-scan` against a Free Trial key. Deliverable: any capability in a Wardley map can pull a publication-volume evidence note with cited UIDs. No licence cost. Proves the value.

**Phase 2 — citation-weighted signals.** Add Institutional Member plan support (if an affiliated org has a WoS subscription) or Expanded. Upgrade the evolution transform to citation-weighted curves. Add `org_footprint`.

**Phase 3 — funder value-chain.** `wos_expanded.py` GRANTS support + `funder_flows.py` + `/arckit:funder-map`. This is the piece that ties back to the original Pivot-RP question and produces a genuinely novel artefact type.

**Phase 4 — patents (optional).** Derwent client, licence permitting. Adds the patent axis to evolution scoring.

## 7. Commercial framing

This is consistent with the arc-kit thesis, and worth stating explicitly in positioning: the *raw* bibliographic metadata is increasingly commoditised (Crossref, OpenAlex, OpenAIRE cover much of it openly), so a fully open-source evidence layer is a credible Phase 2b — swap the Clarivate client for an OpenAlex client behind the same transform interface. Clarivate buys quality, normalisation, and the citation graph; OpenAlex buys zero-cost and no licence friction. Designing the `transforms/` layer to be **source-agnostic** from day one means arc-kit can offer both and let the user choose — which is itself an instance of arc-kit commoditising something the incumbents charge for.

## 8. Risks and open questions

- **Licence terms.** WoS API Product/Service Terms restrict redistribution of retrieved data. arc-kit must treat pulled records as evidence *within* an artefact for the licensed user, not as a redistributable dataset. Read the terms before Phase 2; this constrains whether cached data can travel with a shared artefact.
- **Plan availability.** Citation-weighted signals depend on either a paid Expanded licence or an institutional WoS subscription. Free-tier-only users get volume signals only — set expectations in the skill doc.
- **Entity resolution.** Same weakness identified in the govbuy work: organisation and funder names need normalisation. WoS `OG=` (organisation-enhanced) and Expanded's normalised org names help, but funder-name variants in the GRANTS/Pivot data will need a resolution pass — reuse the approach from the procurement-data analysis.
- **Rate limits vs. build size.** A large parallel arckit-build touching many components could blow the free quota fast. Caching mitigates; consider a build-level budget guard.

## 9. Immediate next step

Register a Free Trial application on developer.clarivate.com, generate a Starter key, and run the existing `wos_test.sh starter` harness to confirm real-record retrieval. Then build Phase 1 against that key. Everything above Phase 1 waits on a licence or institutional-plan decision.