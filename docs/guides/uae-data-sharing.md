# UAE Data Sharing Agreement Playbook

> **Guide Origin**: Community | **ArcKit Version**: [VERSION]

`/arckit.uae-data-sharing` generates a Data Sharing Agreement under the UAE Government Services Data Sharing Policy ("collect once, use securely"). Captures the collect-once mapping, federation / API plan, and PDPL lawful basis per share.

---

## Inputs

| Artefact | Purpose |
|----------|---------|
| Requirements (`ARC-<id>-REQ-v1.0.md`) | Cross-entity flows in scope |
| Integration spec (`ARC-<id>-INT-v1.0.md`) | Existing integration surface |
| Data requirements (`ARC-<id>-DR-v1.0.md`) | Per-share data categories |
| Data model (`ARC-<id>-DMOD-v1.0.md`) | Entity-level structure |
| Smart Data Classification Register (`ARC-<id>-CLAS-v*.md`) | Per-share sensitivity |
| PDPL assessment (`ARC-<id>-PDPL-v*.md`) | Lawful-basis register |

---

## Command

```bash
/arckit.uae-data-sharing <project ID or service name>
```

Output: `projects/<id>/ARC-<id>-DSHR-v1.0.md`

---

## Agreement Structure

| Section | Contents |
|---------|----------|
| Sharing Parties | Producing and consuming federal entities, roles, accountable owners |
| Datasets Shared | Per-share fields, classification, frequency, volume |
| Lawful Basis per Share | PDPL lawful basis (consent, contract, legal obligation, public interest, etc.) |
| Federation / API Mechanism | API contract, message schema, transport, identity model |
| Information-Security Safeguards | Encryption, access control, logging, IAS-control mapping |
| Data-Subject Rights Implications | Cascade of rights through the share |
| External References | Data Sharing Policy citations |

---

## "Collect Once, Use Securely" Levers

| Lever | Example |
|-------|---------|
| Authoritative source | Consume from federal register instead of re-collecting |
| Federated query | Query at the edge instead of bulk copy |
| Event-driven sync | Subscribe to changes only |
| Tokenisation | Share opaque tokens instead of raw PII |

---

## One-Page Workflow

| Phase | Key Activities | ArcKit Commands |
|-------|----------------|-----------------|
| Privacy | PDPL baseline + lawful basis | `/arckit.uae-pdpl` |
| Classification | Per-dataset Smart Data tags | `/arckit.uae-classification` |
| Sharing | Data Sharing Agreement | `/arckit.uae-data-sharing` |
| Integration | Federation / API contracts | `/arckit.integration` |

---

## Review Checklist

- Every share names producing and consuming entities with accountable owners.
- Lawful basis stated per share — reconciled to the PDPL lawful-basis register.
- Federation / API contract specified (no "TBD" transport).
- Security safeguards mapped to IAS controls.
- Data-subject rights cascade documented (e.g. erasure across consumers).
- "Collect once" justification — share is preferred over re-collection.

---

## Key Notes

- **Run after PDPL and classification**: This command consumes both — gaps are flagged when prerequisites are missing.
- **Tokenisation default**: Where Confidential or above must leave the producing entity, prefer tokenised exchange over raw payload.
- **Cascading rights**: Erasure and rectification must propagate to consumers — design the cascade explicitly.
- **Community-contributed**: Output should be reviewed by qualified DPO / federal compliance counsel before reliance.
