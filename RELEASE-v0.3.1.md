# ArcKit v0.3.1 Release Notes

**Release Date:** 2025-10-21
**Release Type:** Minor Feature Release
**Previous Version:** v0.3.0

---

## 🎉 New Feature: Data Modeling with ERD, GDPR Compliance, and Data Governance

### `/arckit.data-model` - Comprehensive Data Modeling Command

Added a powerful new command for creating enterprise-grade data models with complete compliance and governance.

**Key Features:**
- **Visual Entity-Relationship Diagram (ERD)** using Mermaid syntax (GitHub-renderable)
- **Detailed Entity Catalog** (E-001, E-002, etc.) with complete specifications
- **GDPR/DPA 2018 Compliance** - Automatic PII identification and privacy controls
- **Data Governance Matrix** - Clear ownership and accountability
- **CRUD Matrix** - Access control patterns
- **Data Integration Mapping** - Upstream/downstream data flows
- **Sector-Specific Compliance** - PCI-DSS, HIPAA, FCA, Government classifications
- **Data Quality Framework** - Measurable metrics and monitoring
- **Complete Traceability** - DR-xxx requirements → Entities → Attributes

---

## 📋 Detailed Features

### Visual ERD with Mermaid

Generates GitHub-renderable Entity-Relationship Diagrams showing:
- All entities and their relationships
- Cardinality notation (one-to-one, one-to-many, many-to-many)
- Primary keys, foreign keys, unique keys
- Organized by logical domain/bounded context

### Entity Catalog

For each entity (E-001, E-002, etc.), documents:
- **Description**: What this entity represents in business domain
- **Source Requirements**: Which DR-xxx requirements drive this entity
- **Business Owner**: From stakeholder RACI matrix
- **Data Classification**: Public, Internal, Confidential, Restricted
- **Volume Estimates**: Initial records + growth rate
- **Retention Period**: How long data is kept (GDPR requirement)
- **Attributes Table**: Type, Required, PII flag, Validation rules, Source requirement
- **Relationships**: Connections to other entities
- **Indexes**: Primary keys, foreign keys, performance indexes
- **Privacy Notes**: GDPR considerations

### GDPR/DPA 2018 Compliance

**PII Inventory:**
- Lists all personally identifiable information across entities
- Flags PII attributes for special handling

**Legal Basis for Processing:**
- Documents legal basis (consent, contract, legitimate interest, etc.)
- Per entity and purpose

**Data Subject Rights Implementation:**
- **Right to Access**: Subject access request endpoints
- **Right to Rectification**: Update mechanisms
- **Right to Erasure**: Hard delete or anonymization process
- **Right to Portability**: Export in machine-readable format
- **Right to Object**: Opt-out mechanisms
- **Right to Restrict Processing**: Restriction flag implementation

**Data Retention:**
- Active retention periods
- Archive periods
- Total retention (driven by GDPR, tax law, regulatory requirements)
- Deletion policy (hard delete, soft delete, anonymization)

**Cross-Border Transfers:**
- UK-EU adequacy considerations
- UK-US Standard Contractual Clauses (SCCs)
- Supplementary measures (encryption, access controls)

**Data Protection Impact Assessment (DPIA):**
- Determines if DPIA required (high-risk processing)
- Privacy risks identification
- Mitigation measures
- ICO consultation requirements

### Data Governance Matrix

For each entity, identifies:
- **Data Owner**: Business stakeholder accountable (from RACI matrix)
- **Data Steward**: Person responsible for quality and compliance
- **Data Custodian**: Technical team managing storage/backups
- **Access Control**: Who can view/modify (roles/permissions)
- **Sensitivity**: Classification level
- **Compliance**: Applicable regulations (GDPR, PCI-DSS, HIPAA, etc.)
- **Quality SLA**: Accuracy, completeness, timeliness targets

### CRUD Matrix

Shows which components/systems can:
- **C**reate new records
- **R**ead existing records
- **U**pdate existing records
- **D**elete records

Helps identify:
- Unauthorized access patterns
- Security boundary violations
- Least privilege enforcement
- Separation of duties

### Data Integration Mapping

**Upstream Systems (Data Sources):**
- Source system name and type
- Integration method (real-time API, batch ETL, event-driven, file transfer)
- Entity mapping and field transformations
- Update frequency and data quality SLA
- Reconciliation process

**Downstream Systems (Data Consumers):**
- Target system name and type
- Sync method (REST API, batch export, event streaming, file transfer)
- Data latency SLA
- Retry logic and monitoring

**Master Data Management:**
- System of record for each entity
- Conflict resolution rules
- Data lineage tracking

### Sector-Specific Compliance

**PCI-DSS (Payment Card Industry):**
- Cardholder data handling requirements
- PAN tokenization (full card numbers never stored)
- Encryption requirements (at rest and in transit)
- Key management (HSM, KMS)
- Access controls and audit logging

**HIPAA (Health Insurance Portability and Accountability Act):**
- PHI (Protected Health Information) handling
- HIPAA controls and BAA requirements

**FCA Regulations (Financial Conduct Authority - UK):**
- Financial data controls
- Record-keeping requirements

**Government Security Classifications (UK):**
- OFFICIAL, OFFICIAL-SENSITIVE, SECRET, TOP SECRET
- NCSC data security patterns

### Data Quality Framework

**Quality Dimensions:**
- **Accuracy**: Validation rules, reference data
- **Completeness**: Required field targets (e.g., "Customer email 99%")
- **Consistency**: Reconciliation rules across systems
- **Timeliness**: Update frequency, staleness tolerance
- **Uniqueness**: Deduplication rules
- **Validity**: Format conformance (regex, enums, ranges)

**Data Quality Metrics:**
- Measurable targets per entity
- Quality monitoring approach
- Issue resolution process with SLAs

### Requirements Traceability

Maps every DR-xxx (Data Requirement) to:
- Which entities satisfy the requirement
- Which attributes implement the requirement
- Rationale for design decisions
- Gaps (requirements not yet modeled)

**Example:**
```
| Requirement | Entity | Attributes | Rationale |
|-------------|--------|------------|-----------|
| DR-001 | E-001: Customer | customer_id, email, name | Store customer identity |
| DR-006 | E-001: Customer | [All PII fields] | GDPR: Right to erasure |
| DR-007 | E-003: PaymentMethod | [Tokenized PAN] | PCI-DSS: Secure card storage |
```

### Implementation Guidance

**Database Technology Recommendation:**
- Rationale for relational vs document vs graph vs time-series
- Cloud provider and high availability strategy

**Schema Migration Strategy:**
- Migration tool choice (Flyway, Liquibase, Alembic, etc.)
- Versioning and rollback procedures
- Zero-downtime migration patterns

**Backup and Recovery:**
- Backup strategy (full, incremental, transaction log)
- RPO (Recovery Point Objective) and RTO (Recovery Time Objective)
- Disaster recovery and failover

**Data Archival:**
- Active vs archived data policies
- Hot vs cold storage strategy
- Retrieval SLAs

**Testing Data Strategy:**
- Anonymization/pseudonymization for non-production
- Synthetic data generation
- Test data refresh process

---

## 📊 Updated Workflow

The complete ArcKit workflow now includes data modeling:

```
1. /arckit.principles
   ↓ (establishes governance rules)

2. /arckit.stakeholders
   ↓ (understand who cares, what they need, why)

3. /arckit.risk
   ↓ (identify and assess risks - Orange Book)

4. /arckit.sobc
   ↓ (create business case using risk register - Green Book)

5. /arckit.requirements
   ↓ (if approved, define detailed requirements)

6. /arckit.data-model ← NEW!
   ↓ (create data model with ERD, GDPR compliance)

7. /arckit.sow
   ↓ (creates RFP for vendors)

8. /arckit.evaluate
   ↓ (scores vendor proposals)

9. /arckit.hld-review
   ↓ (reviews architecture before build)

10. /arckit.dld-review
   ↓ (reviews technical details before code)

11. Implementation happens
   ↓

12. /arckit.traceability
   ↓ (verifies all requirements met)

13. Release!
```

---

## 🔗 Integration with Other Commands

### Input (Requires/Uses)

**MANDATORY:**
- **`requirements.md`** - Extracts DR-xxx (Data Requirements)
  - If requirements don't exist, command will STOP and tell user to run `/arckit.requirements` first

**RECOMMENDED:**
- **`stakeholder-drivers.md`** - Identifies data owners from RACI matrix
  - Uses stakeholder roles to assign data ownership and governance responsibilities

**OPTIONAL:**
- **`sobc.md`** - References data-related benefits and costs
  - Links data model to business value

### Output (Feeds Into)

**Design Review:**
- **`/arckit.hld-review`** - Validates database technology choices
  - Checks if recommended database (PostgreSQL, MongoDB, Neo4j, etc.) aligns with requirements
  - Reviews data architecture patterns

- **`/arckit.dld-review`** - Validates schema design, indexes, query patterns
  - Ensures proper normalization or denormalization
  - Reviews index strategy for performance
  - Validates foreign key relationships and constraints

**Vendor Procurement:**
- **`/arckit.sow`** - RFP includes data migration and data governance requirements
  - Data migration scope based on entity volumes
  - Data governance policies vendor must comply with

**Traceability:**
- **`/arckit.traceability`** - Supports complete traceability chain
  - DR-xxx → Entity → Attribute → HLD Component → Implementation → Test

---

## 📦 Files Added

- **`.claude/commands/arckit.data-model.md`** (218 lines) - Command specification
- **`templates/data-model-template.md`** (720 lines) - Comprehensive data modeling template
- **`.codex/prompts/arckit.data-model.md`** - OpenAI Codex CLI support

---

## 📚 Documentation Updates

### Updated Files

- **`README.md`** - Added Phase 5.5: Data Modeling
  - Updated feature list to include data modeling, risk, and SOBC
  - Added `/arckit.data-model` to Core Commands table
  - Updated payment gateway example to include data modeling step
  - Updated project structure to show `data-model.md`
  - Renumbered subsequent phases (6→7, 7→8, 8→9, 9→10)

- **`.claude/COMMANDS.md`** - Added comprehensive section 6 for data modeling
  - Renumbered subsequent sections (6→7, 7→8, 8→9, 9→10, 10→11)
  - Updated workflow overview and best practices
  - Updated common patterns to include data modeling step

- **`.codex/README.md`** - Added Phase 5.5: Data Model
  - Updated to v0.3.1 with 20 commands
  - Updated file structure examples to show data-model files
  - Added data modeling to command list and workflow

---

## 🚀 Getting Started with Data Modeling

### Prerequisites

1. **Run `/arckit.requirements` first** (MANDATORY)
   - Data model is based on DR-xxx (Data Requirements)
   - Command will stop if requirements.md doesn't exist

2. **Run `/arckit.stakeholders`** (RECOMMENDED)
   - Provides RACI matrix for data ownership assignments
   - Links data governance to stakeholder accountability

### Example Usage

```bash
# 1. Create requirements (includes DR-xxx data requirements)
/arckit.requirements Build payment gateway with customer data, transaction records,
payment methods, PCI-DSS compliance, and 7-year data retention

# 2. Create data model based on DR-xxx requirements
/arckit.data-model Create data model for payment gateway with PCI-DSS compliance

# Output: projects/001-payment-gateway/data-model.md
```

### What You'll Get

A comprehensive `data-model.md` file with:
- Visual Mermaid ERD showing Customer, Transaction, PaymentMethod, Merchant entities
- Detailed entity catalog with:
  - E-001: Customer (email, name, phone - all flagged as PII)
  - E-002: Transaction (amount, currency, status)
  - E-003: PaymentMethod (tokenized card data - PCI-DSS compliant)
  - E-004: Merchant (business information)
- GDPR compliance:
  - PII identified (email, name, phone, address)
  - Legal basis: Contract (payment processing)
  - Retention: 7 years (tax law requirement)
  - Erasure: Anonymize PII after retention period
- Data governance:
  - Business Owner: CFO (from stakeholder RACI)
  - Data Steward: Data Governance Lead
  - Technical Custodian: Database Team
- PCI-DSS compliance:
  - PAN (Primary Account Number) NOT stored - tokenized by payment processor
  - CVV/CVC NOT stored (prohibited)
  - Cardholder name encrypted at rest
  - TLS 1.3 for all transmissions
- CRUD matrix showing Payment API can create transactions, Admin can read all, Reporting is read-only
- Complete traceability back to DR-001 through DR-008 requirements

---

## 📊 Command Count

**Total Commands:** 19 → **20 commands**

---

## 🐛 Bug Fixes

None in this release.

---

## 📈 Benefits

### For Enterprise Architects

- **Database Design Guidance**: Data model informs database technology choices in HLD review
- **Complete Traceability**: DR-xxx requirements → Entities → Attributes → Database schema
- **Compliance Built-in**: GDPR, PCI-DSS, HIPAA, FCA compliance automatically documented
- **Visual Communication**: Mermaid ERDs render in GitHub for stakeholder review

### For Data Protection Officers (DPOs)

- **GDPR Compliance**: Automatic PII inventory and data subject rights documentation
- **DPIA Support**: Identifies when DPIA required and key privacy risks
- **Retention Management**: Clear retention schedules and deletion policies
- **Cross-Border Transfers**: Documents UK-EU and UK-US data transfer mechanisms

### For Database Administrators

- **Schema Blueprint**: Detailed entity catalog with types, constraints, indexes
- **Migration Planning**: Volume estimates and growth projections inform capacity planning
- **Backup Strategy**: RPO/RTO targets and backup frequency documented
- **Performance Optimization**: Index recommendations based on query patterns

### For Developers

- **API Contracts**: Entities map directly to REST API resources
- **Validation Rules**: Clear validation logic for each attribute
- **Integration Clarity**: CRUD matrix shows which services access which data
- **Test Data Strategy**: Anonymization rules for non-production environments

---

## 🔄 Migration from v0.3.0

No breaking changes. New command is additive.

**If you're currently using:**
```
/arckit.requirements → /arckit.sow → Vendor selection
```

**You can now insert data modeling:**
```
/arckit.requirements → /arckit.data-model → /arckit.sow → Vendor selection
```

**Benefits:**
- Data model created BEFORE vendor RFP ensures vendors understand data requirements
- HLD review can validate database technology choices against data model
- DLD review can validate schema design against entity catalog
- Complete traceability from DR-xxx requirements through to database implementation

---

## 📦 Installation

### New Projects

```bash
# Install ArcKit CLI
pip install git+https://github.com/tractorjuice/arc-kit.git

# Or with uv
uv tool install arckit-cli --from git+https://github.com/tractorjuice/arc-kit.git

# Initialize project
arckit init my-project --ai claude
cd my-project
```

### Existing Projects

```bash
# Pull latest from arc-kit repository
cd your-arckit-project
git pull

# Or reinitialize with latest version
arckit init . --ai claude --force
```

---

## 🔗 Resources

- **GitHub Repository**: https://github.com/tractorjuice/arc-kit
- **Documentation**: README.md, .claude/COMMANDS.md
- **Templates**: `templates/data-model-template.md` (720 lines)
- **GDPR Guidance**: https://ico.org.uk/for-organisations/guide-to-data-protection/
- **PCI-DSS Standards**: https://www.pcisecuritystandards.org/

---

## 🙏 Acknowledgments

This release implements:
- **UK GDPR / Data Protection Act 2018** - Data privacy and protection
- **ICO Data Protection Guidance** - UK data protection authority
- **PCI Security Standards** - Payment card data security
- **NCSC Cloud Security Principles** - UK government cloud security
- **HM Treasury Green Book** - Business case integration (data costs/benefits)
- **HM Treasury Orange Book** - Risk management integration (data-related risks)

---

## 📝 Full Changelog

See [CHANGELOG.md](CHANGELOG.md) for complete version history.

---

**Full Release:** v0.3.1
**Tag:** `v0.3.1`
**Previous Release:** [v0.3.0](https://github.com/tractorjuice/arc-kit/releases/tag/v0.3.0)

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
