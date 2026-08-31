/**
 * ArcKit Document Type Codes — Single Source of Truth (for hooks)
 *
 * Every hook and tool that needs doc-type metadata imports from here.
 * If you add or rename a type code, update this file FIRST.
 *
 * ⚠️ DUAL REGISTRATION REQUIRED — also update `arckit-claude/commands/pages.md`
 * (the `/arckit:pages` dashboard generator has its own "Only include these
 * known artifact types" allow-list inside the prompt). Without an entry
 * there, generated artifacts are silently omitted from the rendered
 * dashboard sidebar even though the manifest hook records them correctly.
 * See PR #317 for context — long term the two registries should be unified.
 * scripts/check-doc-type-registry.py enforces this parity in CI, along with
 * every code referenced by a recipe `output.type` or an `ARC-*-CODE-v`
 * filename in a command or agent body. A code missing from THIS file but
 * written by a command is fatal: validate-arc-filename.mjs blocks the write
 * and the command has no conforming name to fall back to (#712).
 *
 * MULTI_INSTANCE_TYPES used to be duplicated in bash and is not any more.
 * generate-document-id.sh carried its own space-separated copy, in TWO copies
 * of the script, and the lists drifted twice: v5.9.0 added TNDR/CMPT without
 * updating bash, so every /arckit:competitors run emitted the same colliding ID
 * (fixed v5.9.2, PR #566), and GRNT went the same way, caught in 2026-07 while
 * adding CDAU. A missing entry was silent -- the helper returned an ID with no
 * -NNN- sequence and each run of a multi-instance command overwrote the last.
 *
 * generate-document-id.mjs (#723) imports this file instead, so the set below
 * is the only copy and there is nothing left to keep in sync. Do not reintroduce
 * a hardcoded list anywhere; import from here.
 *
 * Schema per entry:
 *   name:      Human-readable display name shown on the dashboard sidebar.
 *   category:  Group used for KPI charts and the "Known artifact types" table.
 *   extension: Optional file extension (default '.md'). Set to '.html' for
 *              types produced as standalone HTML (e.g. AntV Infographic decks,
 *              Reveal.js exports). The /arckit:pages scanner enforces the
 *              extension — `ARC-001-DECK-v1.0.md` and `ARC-001-REQ-v1.0.html`
 *              are both rejected as type/extension mismatches.
 *   regime:    Optional jurisdiction tag — one of the codes in REGIMES below
 *              ('UK' | 'MOD' | 'AT' | 'AU' | 'CA' | 'EU' | 'FR' | 'UAE' | 'US').
 *              Drives per-regime grouping in /arckit:navigator and
 *              /arckit:graph-report, and selects the Document Control
 *              classification partial via REGIME_PARTIALS. Universal
 *              best-practice types (RISK, SECD, TRAC, CONF, PRIN-COMP)
 *              deliberately omit it.
 *   severity:  Optional governance weight — 'HIGH' marks a type that counts
 *              toward the Compliance Readiness scorecard in /arckit:graph-report.
 *              HIGH-severity coverage is computed per-regime so a UAE-only
 *              project is not penalised for missing UK Gov artifacts.
 */

// All valid ArcKit document type codes with display name and category.
export const DOC_TYPES = {
  // Discovery
  'REQ':       { name: 'Requirements',                     category: 'Discovery' },
  'STKE':      { name: 'Stakeholder Analysis',             category: 'Discovery' },
  'RSCH':      { name: 'Research Findings',                category: 'Discovery' },
  'DSCT':      { name: 'Data Source Discovery',            category: 'Discovery' },
  'TNDR':      { name: 'Procurement Market Intelligence',  category: 'Discovery', regime: 'UK' },
  'CMPT':      { name: 'Competitor Landscape',             category: 'Discovery', regime: 'UK' },
  // Planning
  'SOBC':      { name: 'Strategic Outline Business Case',  category: 'Planning' },
  'PLAN':      { name: 'Project Plan',                     category: 'Planning' },
  'ROAD':      { name: 'Roadmap',                          category: 'Planning' },
  'STRAT':     { name: 'Architecture Strategy',            category: 'Planning' },
  'BKLG':      { name: 'Product Backlog',                  category: 'Planning' },
  // Architecture
  'PRIN':      { name: 'Architecture Principles',          category: 'Architecture' },
  'HLDR':      { name: 'High-Level Design Review',         category: 'Architecture' },
  'DLDR':      { name: 'Detailed Design Review',           category: 'Architecture' },
  'DATA':      { name: 'Data Model',                       category: 'Architecture' },
  'WARD':      { name: 'Wardley Map',                      category: 'Architecture' },
  'WDOC':      { name: 'Wardley Doctrine Assessment',  category: 'Architecture' },
  'WGAM':      { name: 'Wardley Gameplay Analysis',     category: 'Architecture' },
  'WCLM':      { name: 'Wardley Climate Assessment',    category: 'Architecture' },
  'WVCH':      { name: 'Wardley Value Chain',            category: 'Architecture' },
  'DIAG':      { name: 'Architecture Diagrams',            category: 'Architecture' },
  'DFD':       { name: 'Data Flow Diagram',                category: 'Architecture' },
  'ADR':       { name: 'Architecture Decision Records',    category: 'Architecture' },
  'PLAT':      { name: 'Platform Design',                  category: 'Architecture' },
  // TOGAF ADM overlay (community)
  'ADMP':      { name: 'ADM Preliminary / Architecture Vision', category: 'Architecture' },
  'BPCM':      { name: 'Business Capability Map',          category: 'Architecture' },
  'APP':       { name: 'Application Inventory',            category: 'Architecture' },
  'APPR':      { name: 'Application Rationalisation',      category: 'Architecture' },
  'GAPA':      { name: 'TOGAF Gap Analysis',               category: 'Governance' },
  'TRANS':     { name: 'Transition Architecture',          category: 'Planning' },
  'BORD':      { name: 'Architecture Board Charter',       category: 'Governance' },
  'ACHG':      { name: 'Architecture Change Request',      category: 'Governance' },
  'REPO':      { name: 'Architecture Repository',          category: 'Architecture' },
  // AI Agent Architecture overlay (community)
  'AAGI':      { name: 'Agent Inventory',                  category: 'Architecture' },
  'AAGR':      { name: 'Agent Architecture Specification', category: 'Architecture' },
  'AAOV':      { name: 'Agent Governance Framework',       category: 'Governance' },
  'AAIN':      { name: 'Agent Integration Architecture',   category: 'Architecture' },
  'AASE':      { name: 'Agent Security Architecture',      category: 'Governance', severity: 'HIGH' },
  'AAMT':      { name: 'Agent Maturity Assessment',        category: 'Governance' },
  // Open Agile Architecture overlay (arckit-oaa, community) — O-AA C208 agile
  // enterprise architecture: strategy canvas, product-centric architecture,
  // ADM Lite sprint mapping, security embedded in sprint rhythm, governance cadence.
  'OASTR':     { name: 'Agile Strategy',                   category: 'Planning' },
  'OAPR':      { name: 'Product Architecture',             category: 'Architecture' },
  'OAAL':      { name: 'ADM Lite Sprint Mapping',          category: 'Architecture' },
  'OASEC':     { name: 'Agile Security',                   category: 'Governance', severity: 'HIGH' },
  'OAGOV':     { name: 'Agile Governance',                 category: 'Governance' },
  // Governance — universal best-practice (no regime tag, HIGH-severity)
  'RISK':      { name: 'Risk Register',                    category: 'Governance', severity: 'HIGH' },
  'TRAC':      { name: 'Traceability Matrix',              category: 'Governance', severity: 'HIGH' },
  'PRIN-COMP': { name: 'Principles Compliance',            category: 'Governance', severity: 'HIGH' },
  'CONF':      { name: 'Conformance Assessment',           category: 'Governance', severity: 'HIGH' },
  'PRES':      { name: 'Presentation',                     category: 'Reporting' },
  'DECK':      { name: 'Executive Deck',                    category: 'Reporting', extension: '.html' },
  'ANAL':      { name: 'Analysis Report',                  category: 'Governance' },
  'GAPS':      { name: 'Gap Analysis',                     category: 'Governance' },
  'CDAU':      { name: 'Codebase Audit',                   category: 'Governance' },
  'GLOS':      { name: 'Glossary',                         category: 'Governance' },
  'FWRK':      { name: 'Framework Overview',               category: 'Governance' },
  // Compliance — UK Gov + MOD officially-maintained
  'TCOP':      { name: 'TCoP Assessment',                  category: 'Compliance', regime: 'UK',  severity: 'HIGH' },
  'SECD':      { name: 'Secure by Design',                 category: 'Compliance',                severity: 'HIGH' },
  'SECD-MOD':  { name: 'MOD Secure by Design',             category: 'Compliance', regime: 'MOD', severity: 'HIGH' },
  'AIPB':      { name: 'AI Playbook Assessment',           category: 'Compliance', regime: 'UK',  severity: 'HIGH' },
  'ATRS':      { name: 'ATRS Record',                      category: 'Compliance', regime: 'UK',  severity: 'HIGH' },
  'DPIA':      { name: 'Data Protection Impact Assessment', category: 'Compliance', regime: 'UK',  severity: 'HIGH' },
  'JSP936':    { name: 'JSP 936 Assessment',               category: 'Compliance', regime: 'MOD', severity: 'HIGH' },
  'SVCASS':    { name: 'Service Assessment',               category: 'Compliance', regime: 'UK',  severity: 'HIGH' },
  // Operations
  'SNOW':      { name: 'ServiceNow Design',                category: 'Operations' },
  'DEVOPS':    { name: 'DevOps Strategy',                  category: 'Operations' },
  'MLOPS':     { name: 'MLOps Strategy',                   category: 'Operations' },
  'FINOPS':    { name: 'FinOps Strategy',                  category: 'Operations' },
  'OPS':       { name: 'Operational Readiness',            category: 'Operations' },
  // Procurement
  'SOW':       { name: 'Statement of Work',                category: 'Procurement' },
  'EVAL':      { name: 'Evaluation Criteria',              category: 'Procurement' },
  'DOS':       { name: 'DOS Requirements',                 category: 'Procurement' },
  'GCLD':      { name: 'G-Cloud Search',                   category: 'Procurement' },
  'GCLC':      { name: 'G-Cloud Clarifications',           category: 'Procurement' },
  // G-Cloud supplier bid-authoring (community overlay: arckit-uk-gcloud)
  'SUPP':      { name: 'Supplier Profile',                 category: 'Procurement', regime: 'UK' },
  'SVCD':      { name: 'Service Design',                   category: 'Procurement', regime: 'UK' },
  'SDD':       { name: 'Service Definition Document',      category: 'Procurement', regime: 'UK', severity: 'HIGH' },
  'DECL':      { name: 'Supplier Declaration',             category: 'Procurement', regime: 'UK', severity: 'HIGH' },
  'PRIC':      { name: 'Pricing Document',                 category: 'Procurement', regime: 'UK' },
  'SECA':      { name: 'Security Assertions',              category: 'Procurement', regime: 'UK', severity: 'HIGH' },
  'GCMP':      { name: 'G-Cloud Competitor Benchmark',     category: 'Procurement', regime: 'UK' },
  'GCRV':      { name: 'G-Cloud Submission Review',        category: 'Procurement', regime: 'UK' },
  'DMC':       { name: 'Data Mesh Contract',               category: 'Procurement' },
  'VEND':      { name: 'Vendor Evaluation',                category: 'Procurement' },
  // Research
  'AWRS':      { name: 'AWS Research',                     category: 'Research' },
  'AZRS':      { name: 'Azure Research',                   category: 'Research' },
  'GCRS':      { name: 'GCP Research',                     category: 'Research' },
  'GOVR':      { name: 'Government Reuse Assessment',     category: 'Research' },
  'GCSR':      { name: 'Government Code Search Report',   category: 'Research' },
  'GLND':      { name: 'Government Landscape Analysis',   category: 'Research' },
  'GRNT':      { name: 'Grants Research',                  category: 'Research' },
  // Reporting
  'STORY':     { name: 'Project Story',                    category: 'Reporting' },
  // EU Regulatory Compliance (Community-contributed, maintained by @thomas-jardinet)
  'RGPD':      { name: 'GDPR Compliance Assessment',                   category: 'Compliance',  regime: 'EU', severity: 'HIGH' },
  'NIS2':      { name: 'NIS2 Compliance Assessment',                   category: 'Compliance',  regime: 'EU', severity: 'HIGH' },
  'AIACT':     { name: 'EU AI Act Compliance Assessment',              category: 'Compliance',  regime: 'EU', severity: 'HIGH' },
  'DORA':      { name: 'DORA Compliance Assessment',                   category: 'Compliance',  regime: 'EU', severity: 'HIGH' },
  'CRA':       { name: 'EU Cyber Resilience Act Assessment',           category: 'Compliance',  regime: 'EU', severity: 'HIGH' },
  'DSA':       { name: 'EU Digital Services Act Assessment',           category: 'Compliance',  regime: 'EU' },
  'DATAACT':   { name: 'EU Data Act Compliance Assessment',            category: 'Compliance',  regime: 'EU' },
  'EUCSF':     { name: 'EU Cloud Sovereignty Framework Assessment',    category: 'Compliance',  regime: 'EU', severity: 'HIGH' },
  // French Government (Community-contributed, maintained by @thomas-jardinet)
  'IRN':       { name: 'IRN — Indice de Résilience Numérique',         category: 'Governance',  regime: 'FR' },
  'CNIL':      { name: 'CNIL / French GDPR Assessment',                category: 'Compliance',  regime: 'FR', severity: 'HIGH' },
  'SECNUM':    { name: 'SecNumCloud 3.2 Assessment',                   category: 'Compliance',  regime: 'FR', severity: 'HIGH' },
  'MARPUB':    { name: 'French Public Procurement',                    category: 'Procurement', regime: 'FR' },
  'DINUM':     { name: 'DINUM Standards Assessment',                   category: 'Compliance',  regime: 'FR' },
  'EBIOS':     { name: 'EBIOS Risk Manager Study',                     category: 'Governance',  regime: 'FR', severity: 'HIGH' },
  'ANSSI':     { name: 'ANSSI Security Posture Assessment',            category: 'Compliance',  regime: 'FR', severity: 'HIGH' },
  'CARTO':     { name: 'ANSSI Information System Cartography',         category: 'Architecture', regime: 'FR' },
  'DR':        { name: 'Diffusion Restreinte Handling Assessment',     category: 'Compliance',  regime: 'FR' },
  'ALGO':      { name: 'Public Algorithm Transparency Notice',         category: 'Compliance',  regime: 'FR' },
  'PSSI':      { name: 'Information System Security Policy',           category: 'Compliance',  regime: 'FR', severity: 'HIGH' },
  'REUSE':     { name: 'Public Code Reuse Assessment',                 category: 'Procurement', regime: 'FR' },
  // Austrian Government (Community-contributed, maintained by @gtonic)
  'ATBFR':     { name: 'Austrian Accessibility Assessment (BaFG / WZG)', category: 'Compliance', regime: 'AT', severity: 'HIGH' },
  'ATDSG':     { name: 'Austrian Data Protection Assessment',          category: 'Compliance',  regime: 'AT', severity: 'HIGH' },
  'ATNISG':    { name: 'Austrian NISG (NIS2) Assessment',              category: 'Compliance',  regime: 'AT', severity: 'HIGH' },
  'BVERGG':    { name: 'Austrian Public Procurement (BVergG 2018 idF VergabeRG 2026)', category: 'Procurement', regime: 'AT' },
  // UAE Federal Overlay (Community-contributed, maintained by @tractorjuice — recruiting UAE domain co-maintainer) — anchored on 23 April 2026 Cabinet decree
  'PDPL':      { name: 'UAE PDPL Compliance Assessment',               category: 'Compliance',  regime: 'UAE', severity: 'HIGH' },
  'IAS':       { name: 'UAE IAS Statement of Applicability',           category: 'Compliance',  regime: 'UAE', severity: 'HIGH' },
  'CRES':      { name: 'UAE Sovereign Cloud Residency Assessment',     category: 'Architecture', regime: 'UAE' },
  'CLAS':      { name: 'UAE Smart Data Classification Register',       category: 'Governance',  regime: 'UAE' },
  'UPASS':     { name: 'UAE Pass Integration Design',                  category: 'Architecture', regime: 'UAE' },
  'ZBUR':      { name: 'UAE Zero Bureaucracy Service Review',          category: 'Governance',  regime: 'UAE' },
  'DREC':      { name: 'UAE Digital Records Plan',                     category: 'Governance',  regime: 'UAE' },
  'DSHR':      { name: 'UAE Data Sharing Agreement',                   category: 'Governance',  regime: 'UAE' },
  'NPRA':      { name: 'UAE National Priorities Alignment Statement',  category: 'Governance',  regime: 'UAE' },
  'AICH':      { name: 'UAE AI Charter Compliance Assessment',         category: 'Compliance',  regime: 'UAE', severity: 'HIGH' },
  'AUTI':      { name: 'UAE AI Autonomy Tier Posture',                 category: 'Architecture', regime: 'UAE', severity: 'HIGH' },
  'FPRO':      { name: 'UAE Federal Procurement Strategy',             category: 'Procurement', regime: 'UAE' },
  // Canada Federal Overlay (community)
  'FITAA':     { name: 'Canada FITAA Compliance Assessment',           category: 'Compliance',   regime: 'CA' },
  'PIA':       { name: 'Canada Privacy Impact Assessment',             category: 'Compliance',   regime: 'CA' },
  'ATIP':      { name: 'Canada ATIP Reconciliation',                   category: 'Compliance',   regime: 'CA' },
  'AIA':       { name: 'Canada Algorithmic Impact Assessment',         category: 'Compliance',   regime: 'CA' },
  'CHRT':      { name: 'Canada Charter Rights Design Review',          category: 'Governance',   regime: 'CA' },
  'ITSG':      { name: 'Canada ITSG-33 Statement of Applicability',    category: 'Architecture', regime: 'CA' },
  'SOIA':      { name: 'Canada Security of Information Act Handling Plan', category: 'Compliance',   regime: 'CA' },
  'CACR':      { name: 'Canada Sovereign Cloud Residency Assessment',  category: 'Architecture', regime: 'CA' },
  'DIGSTD':    { name: 'Canada GC Digital Standards Conformance',      category: 'Governance',   regime: 'CA' },
  'OLA':       { name: 'Canada Official Languages Act Review',         category: 'Compliance',   regime: 'CA' },
  'PROC':      { name: 'Canada Federal Procurement Strategy',          category: 'Procurement',  regime: 'CA' },
  'OCAP':      { name: 'Canada First Nations OCAP Sovereignty Assessment', category: 'Governance',   regime: 'CA' },
  // USA Federal Civilian Overlay (community) — FedRAMP, FISMA/NIST 800-53, CISA Zero Trust,
  // OMB M-19-17 ICAM, NIST AI RMF + OMB M-24-10/M-25-21, E-Gov §208 PIA, EO 14028 SBOM
  'FIPS199':   { name: 'US FIPS 199 System Categorization',            category: 'Compliance',   regime: 'US', severity: 'HIGH' },
  'NIST':      { name: 'US NIST SP 800-53 Rev 5 Tailored Control Set', category: 'Architecture', regime: 'US', severity: 'HIGH' },
  'FRSSP':     { name: 'US FedRAMP System Security Plan',              category: 'Compliance',   regime: 'US', severity: 'HIGH' },
  'FRRR':      { name: 'US FedRAMP Readiness Assessment Report',       category: 'Compliance',   regime: 'US', severity: 'HIGH' },
  'ZTA':       { name: 'US CISA Zero Trust Maturity Posture',          category: 'Architecture', regime: 'US' },
  'ICAM':      { name: 'US ICAM Architecture (OMB M-19-17 / NIST SP 800-63-3)', category: 'Architecture', regime: 'US' },
  'AIRMF':     { name: 'US NIST AI Risk Management Framework Assessment', category: 'Compliance', regime: 'US', severity: 'HIGH' },
  'AIIA':      { name: 'US AI Impact Assessment (OMB M-24-10 / M-25-21)', category: 'Compliance', regime: 'US', severity: 'HIGH' },
  'USPIA':     { name: 'US Privacy Impact Assessment (E-Gov §208)',    category: 'Compliance',   regime: 'US', severity: 'HIGH' },
  'SBOM':      { name: 'US SBOM + Secure-Software Self-Attestation (EO 14028)', category: 'Compliance', regime: 'US' },
  // Australian Federal Overlay (Community-contributed, maintained by @royster70) — ASD Essential Eight, ISM, DTA DSS, Privacy Act 1988 PIA,
  // OAIC NDB scheme, DISP, PSPF, DTA AI Assurance Framework + Responsible AI Policy v2.0,
  // plus optional cross-sector OT security and SOCI/CIRMP support for critical infrastructure.
  'AUE8':      { name: 'AU Essential Eight Maturity Posture',          category: 'Compliance',  regime: 'AU', severity: 'HIGH' },
  'AUISM':     { name: 'AU ISM Statement of Applicability',            category: 'Compliance',  regime: 'AU', severity: 'HIGH' },
  'AUPIA':     { name: 'AU Privacy Impact Assessment (Privacy Act 1988)', category: 'Compliance', regime: 'AU', severity: 'HIGH' },
  'AUNDB':     { name: 'AU Notifiable Data Breach Response Playbook',  category: 'Compliance',  regime: 'AU' },
  'AUOT':      { name: 'AU OT Security Assessment',                    category: 'Compliance',  regime: 'AU', severity: 'HIGH' },
  'AUSOCI':    { name: 'AU SOCI CIRMP Governance Pack',                category: 'Compliance',  regime: 'AU', severity: 'HIGH' },
  'AUAESCSF':  { name: 'AU AESCSF Maturity Assessment',                category: 'Compliance',  regime: 'AU', severity: 'HIGH' },
  'AUENERGY':  { name: 'AU Energy Compliance Pack',                    category: 'Compliance',  regime: 'AU', severity: 'HIGH' },
  'AUDSS':     { name: 'AU DTA Digital Service Standard Conformance',  category: 'Governance',  regime: 'AU', severity: 'HIGH' },
  'AUPSPF':    { name: 'AU Protective Security Policy Framework Scorecard', category: 'Governance', regime: 'AU', severity: 'HIGH' },
  'AUAIA':     { name: 'AU AI Assurance Baseline (DTA AI Policy v2.0)', category: 'Compliance',  regime: 'AU', severity: 'HIGH' },
  'AUDISP':    { name: 'AU DISP Member Self-Attestation Pack',         category: 'Compliance',  regime: 'AU', severity: 'HIGH' },
  // Netherlands Public Sector Overlay (arckit-nl) — community-contributed,
  // EXPERIMENTAL. Outputs require review by qualified NL counsel and, for any
  // rubricering determination, a departmental beveiligingsautoriteit or
  // rubriceringsambtenaar before reliance.
  'RBCLOUD':   { name: 'Rijksbreed Cloudbeleid Compliance Assessment',  category: 'Compliance',  regime: 'NL', severity: 'HIGH' },
  'TBB':       { name: 'Te Beschermen Belangen / VIRBI 2025 Rubricering', category: 'Compliance', regime: 'NL', severity: 'HIGH' },
  'BIO2':      { name: 'BIO2 Conformance Assessment',                   category: 'Compliance',  regime: 'NL', severity: 'HIGH' },
  'NLEXIT':    { name: 'NL Cloud Exit Plan',                            category: 'Governance',  regime: 'NL' },
  // UK Financial Services Payments Overlay (arckit-uk-finance) — community-contributed,
  // EXPERIMENTAL. Outputs require review by qualified UK FS regulatory counsel + firm
  // MLRO / Compliance Officer before reliance.
  'FSSCA':     { name: 'UK PSD2 SCA-RTS Exemption Design',                category: 'Compliance', regime: 'UK', severity: 'HIGH' },
  'FSSAFE':    { name: 'UK EMI / PI Safeguarding Assessment',             category: 'Compliance', regime: 'UK', severity: 'CRITICAL' },
  'FSCD':      { name: 'UK FCA Consumer Duty Board Report',               category: 'Compliance', regime: 'UK', severity: 'HIGH' },
  'FSCTP':     { name: 'UK Critical Third Parties Dependency Assessment', category: 'Compliance', regime: 'UK', severity: 'HIGH' },
  // UK NHS Clinical Safety Overlay (arckit-uk-nhs) — community-contributed, proposed maintainer @pacharanero.
  // NHS DTAC and UK/EU MDR SaMD/AIaMD classification. NHS DCB0129 / DCB0160 outputs (Marcus Baw SAFETY.md /
  // SAFETY-CASE.md / HAZARD-LOG.md) deliberately do NOT carry an ArcKit doc-type code or ARC- prefix — they
  // pass through validate-arc-filename untouched and are cross-referenced by relative path
  // (clinical-safety/SAFETY-CASE.md) rather than document ID.
  'NHSDTAC':   { name: 'NHS Digital Technology Assessment Criteria (DTAC v3)', category: 'Compliance', regime: 'UK', severity: 'HIGH' },
  'NHSMDR':    { name: 'UK MDR + EU MDR SaMD/AIaMD Classification',       category: 'Compliance', regime: 'UK', severity: 'HIGH' },
  'MMOD':      { name: 'Maturity Model Assessment',       category: 'Governance', severity: 'HIGH' },
};

// Derived: regimes in canonical order (officially-maintained first, then community alphabetical)
// CA + AU + US added retroactively — each shipped doc-types without REGIMES registration
// (CA since v4.15.0, AU in v5.0.0, US in v5.1.0; see #545). REGIME_LABELS ordering matches.
export const REGIMES = ['UK', 'MOD', 'AT', 'AU', 'CA', 'EU', 'FR', 'NL', 'UAE', 'US'];

// Human-readable regime labels
export const REGIME_LABELS = {
  UK:  'UK Gov',
  MOD: 'MOD',
  AT:  'Austria',
  AU:  'Australia',
  CA:  'Canada',
  EU:  'EU',
  FR:  'France',
  NL:  'Netherlands',
  UAE: 'UAE',
  US:  'USA Federal',
};

// Document Control classification partial per regime, resolved by the command
// that reads a template carrying the <!-- DOC-CONTROL-HEADER --> marker.
// See templates/_partials/RENDERING.md, which carries the same routing as a
// self-contained table — that file, not this one, is what the model reads at
// runtime, because community overlay plugins ship templates/_partials but no
// config/ directory.
//
// Every regime names a partial, so the CI guard can require one. Regimes listed
// in UK_FALLBACK_BY_DESIGN below name the UK partial as the *default outcome*
// of the user-config chain rather than as a hard route — see that constant.
export const REGIME_PARTIALS = {
  UK:  'document-control-uk.md',
  MOD: 'document-control-uk.md',
  AT:  'document-control-at.md',
  AU:  'document-control-au.md',
  CA:  'document-control-ca.md',
  EU:  'document-control-uk.md',
  FR:  'document-control-fr.md',
  NL:  'document-control-nl.md',
  UAE: 'document-control-uae.md',
  US:  'document-control-us.md',
};

// Regimes that deliberately resolve to `document-control-uk.md` rather than to a
// partial of their own — and which therefore do NOT hard-route. An artefact in
// one of these regimes falls through to the user-config chain (step 2 of
// RENDERING.md) exactly as it did before regime routing existed, so a UAE- or
// AT-configured entity running a UK-regime command keeps its own ladder. Hard
// routing these would have silently changed the rendered header for 52
// doc-types.
//
// Membership is a registered decision, not an oversight, and the reason differs
// per regime:
//   UK       — the UK partial IS the UK ladder; nothing to defer.
//   MOD      — MOD artefacts use the UK Government ladder.
//   EU       — EU commands assess EU instruments from a member state's
//              perspective; EUCI governs EU-institution material, not this.
//
// US was the fourth member and is not one any more (#746). It sat here as a
// deferral rather than a decision, because no ladder wording existed in this
// repository and a wrong ladder in a Document Control header reads more
// authoritative than a fallback does. document-control-us.md now ships, sourced
// from the two primary instruments — EO 13526 §1.2 for the classified tiers and
// 32 CFR 2002.20 for CUI — so all 10 federal civilian doc-types stopped
// rendering the UK ladder. The judgement the deferral was waiting on is
// recorded in step 7 of RENDERING.md: CUI is a control marking rather than a
// classification level, and a FIPS 199 impact level never belongs in the field.
//
// scripts/tests/test-regime-registration.mjs enforces both halves: a regime in
// this set must map to the UK partial, and a regime outside it must map to
// `document-control-<lowercased regime>.md`. Pointing CA at the Australian
// ladder previously passed CI.
export const UK_FALLBACK_BY_DESIGN = new Set(['UK', 'MOD', 'EU']);

// Derived: HIGH-severity type codes, grouped per regime (plus 'UNIVERSAL' for
// types that apply regardless of jurisdiction).
export const HIGH_SEVERITY_BY_REGIME = (() => {
  const map = { UNIVERSAL: [] };
  for (const r of REGIMES) map[r] = [];
  for (const [code, info] of Object.entries(DOC_TYPES)) {
    if (info.severity !== 'HIGH') continue;
    const bucket = info.regime || 'UNIVERSAL';
    (map[bucket] ||= []).push(code);
  }
  return map;
})();

// Derived: every HIGH-severity type code (flat list).
export const HIGH_SEVERITY_TYPES = Object.values(HIGH_SEVERITY_BY_REGIME).flat();

// Multi-instance types that require sequence numbers (e.g. ADR-001, RSCH-002)
export const MULTI_INSTANCE_TYPES = new Set([
  'ADR', 'DIAG', 'DFD', 'WARD', 'DMC',
  'RSCH', 'AWRS', 'AZRS', 'GCRS', 'DSCT', 'TNDR', 'CMPT',
  'WGAM', 'WCLM', 'WVCH',
  'GOVR', 'GCSR', 'GLND', 'GRNT',
  'CDAU',
]);

// Type code -> required subdirectory
// Multi-instance types use sequence numbers (ADR-001, DIAG-002, etc.)
// Single-instance types in subdirs (RSCH) do not get sequence numbers
export const SUBDIR_MAP = {
  'ADR':  'decisions',
  'DIAG': 'diagrams',
  'DFD':  'diagrams',
  'WARD': 'wardley-maps',
  'WDOC': 'wardley-maps',
  'WGAM': 'wardley-maps',
  'WCLM': 'wardley-maps',
  'WVCH': 'wardley-maps',
  'DMC':  'data-contracts',
  'RSCH': 'research',
  'AWRS': 'research',
  'AZRS': 'research',
  'GCRS': 'research',
  'DSCT': 'research',
  'TNDR': 'research',
  'CMPT': 'research',
  'GOVR': 'research',
  'GCSR': 'research',
  'GLND': 'research',
  'GRNT': 'research',
  'CDAU': 'audits',
  'FWRK': 'framework',
};

// Derived: set of all valid type codes
export const KNOWN_TYPES = new Set(Object.keys(DOC_TYPES));
