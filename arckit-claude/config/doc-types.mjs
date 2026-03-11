/**
 * ArcKit Document Type Codes — Single Source of Truth
 *
 * Every hook and tool that needs doc-type metadata imports from here.
 * If you add or rename a type code, update ONLY this file.
 *
 * NOTE: scripts/bash/generate-document-id.sh has its own MULTI_INSTANCE_TYPES
 * list (bash, 10 entries). Keep it in sync manually — low drift risk.
 */

// All valid ArcKit document type codes with display name and category.
export const DOC_TYPES = {
  // Discovery
  'REQ':       { name: 'Requirements',                     category: 'Discovery' },
  'STKE':      { name: 'Stakeholder Analysis',             category: 'Discovery' },
  'RSCH':      { name: 'Research Findings',                category: 'Discovery' },
  'DSCT':      { name: 'Data Source Discovery',            category: 'Discovery' },
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
  'DIAG':      { name: 'Architecture Diagrams',            category: 'Architecture' },
  'DFD':       { name: 'Data Flow Diagram',                category: 'Architecture' },
  'ADR':       { name: 'Architecture Decision Records',    category: 'Architecture' },
  'PLAT':      { name: 'Platform Design',                  category: 'Architecture' },
  // Governance
  'RISK':      { name: 'Risk Register',                    category: 'Governance' },
  'TRAC':      { name: 'Traceability Matrix',              category: 'Governance' },
  'PRIN-COMP': { name: 'Principles Compliance',            category: 'Governance' },
  'CONF':      { name: 'Conformance Assessment',           category: 'Governance' },
  'PRES':      { name: 'Presentation',                     category: 'Governance' },
  'ANAL':      { name: 'Analysis Report',                  category: 'Governance' },
  'GAPS':      { name: 'Gap Analysis',                     category: 'Governance' },
  // Compliance
  'TCOP':      { name: 'TCoP Assessment',                  category: 'Compliance' },
  'SECD':      { name: 'Secure by Design',                 category: 'Compliance' },
  'SECD-MOD':  { name: 'MOD Secure by Design',             category: 'Compliance' },
  'AIPB':      { name: 'AI Playbook Assessment',           category: 'Compliance' },
  'ATRS':      { name: 'ATRS Record',                      category: 'Compliance' },
  'DPIA':      { name: 'Data Protection Impact Assessment', category: 'Compliance' },
  'JSP936':    { name: 'JSP 936 Assessment',               category: 'Compliance' },
  'SVCASS':    { name: 'Service Assessment',               category: 'Compliance' },
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
  'DMC':       { name: 'Data Mesh Contract',               category: 'Procurement' },
  'VEND':      { name: 'Vendor Evaluation',                category: 'Procurement' },
  // Research
  'AWRS':      { name: 'AWS Research',                     category: 'Research' },
  'AZRS':      { name: 'Azure Research',                   category: 'Research' },
  'GCRS':      { name: 'GCP Research',                     category: 'Research' },
  // Other
  'STORY':     { name: 'Project Story',                    category: 'Planning' },
};

// Multi-instance types that require sequence numbers (e.g. ADR-001, RSCH-002)
export const MULTI_INSTANCE_TYPES = new Set([
  'ADR', 'DIAG', 'DFD', 'WARD', 'DMC',
  'RSCH', 'AWRS', 'AZRS', 'GCRS', 'DSCT',
]);

// Type code -> required subdirectory
// Multi-instance types use sequence numbers (ADR-001, DIAG-002, etc.)
// Single-instance types in subdirs (RSCH) do not get sequence numbers
export const SUBDIR_MAP = {
  'ADR':  'decisions',
  'DIAG': 'diagrams',
  'DFD':  'diagrams',
  'WARD': 'wardley-maps',
  'DMC':  'data-contracts',
  'RSCH': 'research',
  'AWRS': 'research',
  'AZRS': 'research',
  'GCRS': 'research',
  'DSCT': 'research',
};

// Derived: set of all valid type codes
export const KNOWN_TYPES = new Set(Object.keys(DOC_TYPES));
