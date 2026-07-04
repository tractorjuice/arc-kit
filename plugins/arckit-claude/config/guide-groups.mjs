/**
 * Guide grouping metadata for ArcKit Pages.
 *
 * This is the source of truth for command guide category, lifecycle status,
 * top-level section, and overlay pack metadata. sync-guides.mjs writes these
 * fields to docs/manifest.json so Pages, llms.txt, and generated extensions do
 * not need browser-side filename heuristics.
 */

export const GUIDE_SECTIONS = {
  CORE: 'Core Workflows',
  PLUGIN: 'Plugin and Extension Operations',
  OVERLAY: 'Overlay Packs',
  COMMUNITY: 'Community Guides',
  OTHER: 'Other / Uncategorised',
};

export const GUIDE_SECTION_ORDER = [
  GUIDE_SECTIONS.CORE,
  GUIDE_SECTIONS.PLUGIN,
  GUIDE_SECTIONS.OVERLAY,
  GUIDE_SECTIONS.COMMUNITY,
  GUIDE_SECTIONS.OTHER,
];

export const GUIDE_CATEGORY_ORDER = [
  'Getting Started',
  'Discovery',
  'Planning',
  'Architecture',
  'Wardley Mapping',
  'Governance',
  'Compliance',
  'Operations',
  'Procurement',
  'Interoperability',
  'Integrations',
  'Reporting',
  'Plugin Operations',
  // Overlay packs: global/framework packs first, then country/region packs.
  'AI Agent Architecture Overlay',
  'FDE Site Generator',
  'Repository Plugin',
  'TOGAF ADM Overlay',
  'Australian Federal / Energy Overlay',
  'Community overlays - Austria',
  'Canada Federal Overlay',
  'Community overlays - EU',
  'Community overlays - France',
  'UAE Federal Overlay',
  'UK G-Cloud Supplier Overlay',
  'UK Finance Payments Overlay',
  'UK NHS Clinical Safety Overlay',
  'USA Federal Civilian Overlay',
  'Community',
  'Other',
];

const GUIDE_METADATA = {};

function add(section, category, status, stems, pack = null) {
  for (const stem of stems) {
    GUIDE_METADATA[stem] = {
      section,
      category,
      status,
      ...(pack ? { pack } : {}),
    };
  }
}

// Core workflows
add(GUIDE_SECTIONS.CORE, 'Getting Started', 'experimental', ['init']);
add(GUIDE_SECTIONS.CORE, 'Getting Started', 'beta', ['start']);
add(GUIDE_SECTIONS.CORE, 'Discovery', 'live', [
  'requirements',
  'stakeholders',
  'stakeholder-analysis',
]);
add(GUIDE_SECTIONS.CORE, 'Discovery', 'beta', ['research']);
add(GUIDE_SECTIONS.CORE, 'Discovery', 'experimental', [
  'datascout',
  'gov-reuse',
  'gov-code-search',
  'gov-landscape',
  'grants',
]);
add(GUIDE_SECTIONS.CORE, 'Planning', 'live', [
  'sobc',
  'business-case',
  'plan',
]);
add(GUIDE_SECTIONS.CORE, 'Planning', 'beta', [
  'backlog',
  'roadmap',
  'strategy',
]);
add(GUIDE_SECTIONS.CORE, 'Planning', 'experimental', ['migration']);
add(GUIDE_SECTIONS.CORE, 'Architecture', 'live', [
  'principles',
  'data-model',
  'diagram',
]);
add(GUIDE_SECTIONS.CORE, 'Architecture', 'beta', [
  'adr',
  'c4-layout-science',
  'design-review',
  'dld-review',
  'hld-review',
]);
add(GUIDE_SECTIONS.CORE, 'Architecture', 'alpha', ['data-mesh-contract']);
add(GUIDE_SECTIONS.CORE, 'Architecture', 'experimental', [
  'dfd',
  'framework',
  'platform-design',
]);
add(GUIDE_SECTIONS.CORE, 'Wardley Mapping', 'experimental', [
  'wardley',
  'wardley-value-chain',
  'wardley-doctrine',
  'wardley-climate',
  'wardley-gameplay',
]);
add(GUIDE_SECTIONS.CORE, 'Governance', 'live', [
  'risk',
  'risk-management',
  'traceability',
  'principles-compliance',
  'navigator',
  'graph-report',
]);
add(GUIDE_SECTIONS.CORE, 'Governance', 'beta', [
  'analyze',
  'artifact-health',
  'conformance',
  'data-quality-framework',
  'impact',
  'knowledge-compounding',
  'search',
]);
add(GUIDE_SECTIONS.CORE, 'Governance', 'experimental', [
  'health',
  'maturity-model',
]);
add(GUIDE_SECTIONS.CORE, 'Compliance', 'beta', [
  'codes-of-practice',
  'dpia',
  'govs-007-security',
  'national-data-strategy',
  'secure',
  'service-assessment',
  'tcop',
]);
add(GUIDE_SECTIONS.CORE, 'Compliance', 'alpha', [
  'ai-playbook',
  'atrs',
]);
add(GUIDE_SECTIONS.CORE, 'Compliance', 'experimental', [
  'jsp-936',
  'mod-secure',
]);
add(GUIDE_SECTIONS.CORE, 'Operations', 'experimental', [
  'devops',
  'finops',
  'mlops',
  'operationalize',
]);
add(GUIDE_SECTIONS.CORE, 'Procurement', 'live', [
  'evaluate',
  'sow',
]);
add(GUIDE_SECTIONS.CORE, 'Procurement', 'beta', [
  'competitors',
  'procurement',
  'score',
  'tenders',
]);
add(GUIDE_SECTIONS.CORE, 'Procurement', 'experimental', [
  'dos',
  'gcloud-clarify',
  'gcloud-search',
]);
add(GUIDE_SECTIONS.CORE, 'Interoperability', 'beta', [
  'export-okf',
  'import-okf',
]);
add(GUIDE_SECTIONS.CORE, 'Integrations', 'beta', [
  'servicenow',
]);
add(GUIDE_SECTIONS.CORE, 'Integrations', 'experimental', [
  'aws-research',
  'azure-research',
  'gcp-research',
  'trello',
]);
add(GUIDE_SECTIONS.CORE, 'Reporting', 'live', ['story']);
add(GUIDE_SECTIONS.CORE, 'Reporting', 'beta', ['presentation']);
add(GUIDE_SECTIONS.CORE, 'Reporting', 'alpha', ['pages']);
add(GUIDE_SECTIONS.CORE, 'Reporting', 'experimental', ['glossary']);

// Plugin and extension operations
add(GUIDE_SECTIONS.PLUGIN, 'Plugin Operations', 'live', [
  'build',
  'customize',
]);
add(GUIDE_SECTIONS.PLUGIN, 'Plugin Operations', 'beta', [
  'autoresearch',
  'custom-commands',
  'enterprise-scale',
  'hooks',
  'mcp-servers',
  'productivity',
  'remote-control',
  'security-hooks',
  'session-memory',
  'upgrading',
]);
add(GUIDE_SECTIONS.PLUGIN, 'Plugin Operations', 'alpha', ['template-builder']);
add(GUIDE_SECTIONS.PLUGIN, 'Plugin Operations', 'experimental', ['pinecone-mcp']);

// Overlay packs
add(GUIDE_SECTIONS.OVERLAY, 'AI Agent Architecture Overlay', 'community', [
  'agent-inventory',
  'agent-design',
  'agent-governance',
  'agent-integration',
  'agent-security',
  'agent-maturity',
], 'AI Agent Architecture Overlay');

add(GUIDE_SECTIONS.OVERLAY, 'FDE Site Generator', 'community', ['create'], 'FDE Site Generator');

add(GUIDE_SECTIONS.OVERLAY, 'Repository Plugin', 'community', [
  'repo-docs',
], 'Repository Plugin');

add(GUIDE_SECTIONS.OVERLAY, 'TOGAF ADM Overlay', 'community', [
  'adm-preliminary',
  'business-capability-map',
  'application-inventory',
  'application-rationalization',
  'gap-analysis',
  'transition-architecture',
  'architecture-board',
  'architecture-change',
  'architecture-repository',
], 'TOGAF ADM Overlay');

add(GUIDE_SECTIONS.OVERLAY, 'Australian Federal / Energy Overlay', 'community', [
  'au-aescsf',
  'au-ai-assurance',
  'au-disp-attestation',
  'au-dss',
  'au-e8-posture',
  'au-energy-compliance',
  'au-ism-controls',
  'au-ndb-playbook',
  'au-ot-security',
  'au-pia',
  'au-pspf',
  'au-soci-cirmp',
], 'Australian Federal / Energy Overlay');

add(GUIDE_SECTIONS.OVERLAY, 'Community overlays - Austria', 'community', [
  'at-bvergg',
  'at-dsgvo',
  'at-nisg',
], 'Community overlays - Austria');

add(GUIDE_SECTIONS.OVERLAY, 'Canada Federal Overlay', 'community', [
  'ca-aia',
  'ca-atip',
  'ca-charter',
  'ca-cloud-residency',
  'ca-fitaa',
  'ca-gc-digital-standards',
  'ca-itsg-33',
  'ca-ocap',
  'ca-ola',
  'ca-pia',
  'ca-pspc',
  'ca-soia',
], 'Canada Federal Overlay');

add(GUIDE_SECTIONS.OVERLAY, 'Community overlays - EU', 'community', [
  'eu-ai-act',
  'eu-cra',
  'eu-data-act',
  'eu-dora',
  'eu-dsa',
  'eu-nis2',
  'eu-rgpd',
], 'Community overlays - EU');

add(GUIDE_SECTIONS.OVERLAY, 'Community overlays - France', 'community', [
  'fr-algorithme-public',
  'fr-anssi',
  'fr-anssi-carto',
  'fr-code-reuse',
  'fr-dinum',
  'fr-dr',
  'fr-ebios',
  'fr-irn',
  'fr-marche-public',
  'fr-pssi',
  'fr-rgpd',
  'fr-secnumcloud',
], 'Community overlays - France');

add(GUIDE_SECTIONS.OVERLAY, 'UAE Federal Overlay', 'community', [
  'uae-ai-autonomy-tier',
  'uae-ai-charter',
  'uae-classification',
  'uae-cloud-residency',
  'uae-data-sharing',
  'uae-digital-records',
  'uae-ias',
  'uae-pdpl',
  'uae-priorities-alignment',
  'uae-procurement',
  'uae-uaepass',
  'uae-zero-bureaucracy',
], 'UAE Federal Overlay');

add(GUIDE_SECTIONS.OVERLAY, 'UK G-Cloud Supplier Overlay', 'community', [
  'supplier-profile',
  'service-design',
  'sdd-lot1',
  'sdd-lot2',
  'sdd-lot3',
  'declaration',
  'pricing',
  'security',
  'gcloud-competitors',
  'review',
  'submission-pack',
], 'UK G-Cloud Supplier Overlay');

add(GUIDE_SECTIONS.OVERLAY, 'UK Finance Payments Overlay', 'community', [
  'uk-fs-consumer-duty',
  'uk-fs-ctp-dependency',
  'uk-fs-safeguarding',
  'uk-fs-sca-rts',
], 'UK Finance Payments Overlay');

add(GUIDE_SECTIONS.OVERLAY, 'UK NHS Clinical Safety Overlay', 'community', [
  'uk-mdr-classification',
  'uk-nhs-dcb0129',
  'uk-nhs-dcb0160',
  'uk-nhs-dtac',
], 'UK NHS Clinical Safety Overlay');

add(GUIDE_SECTIONS.OVERLAY, 'USA Federal Civilian Overlay', 'community', [
  'us-ai-impact',
  'us-ai-rmf',
  'us-fedramp-readiness',
  'us-fedramp-ssp',
  'us-fisma-categorization',
  'us-icam',
  'us-nist-800-53',
  'us-privacy-pia',
  'us-sbom-eo-14028',
  'us-zero-trust',
], 'USA Federal Civilian Overlay');

export { GUIDE_METADATA };

export function guideMetadataForStem(stem) {
  return GUIDE_METADATA[stem] || {
    section: GUIDE_SECTIONS.OTHER,
    category: 'Other',
    status: 'beta',
  };
}

export const ROLE_FAMILIES = {
  'enterprise-architect': 'Architecture',
  'solution-architect': 'Architecture',
  'data-architect': 'Architecture',
  'security-architect': 'Architecture',
  'business-architect': 'Architecture',
  'technical-architect': 'Architecture',
  'network-architect': 'Architecture',
  'cto-cdio': 'Chief Digital and Data',
  cdo: 'Chief Digital and Data',
  ciso: 'Chief Digital and Data',
  'product-manager': 'Product and Delivery',
  'delivery-manager': 'Product and Delivery',
  'business-analyst': 'Product and Delivery',
  'service-owner': 'Product and Delivery',
  'data-governance-manager': 'Data',
  'performance-analyst': 'Data',
  'it-service-manager': 'IT Operations',
  'devops-engineer': 'Software Development',
};

export const ROLE_COMMAND_COUNTS = {
  'enterprise-architect': 12,
  'solution-architect': 10,
  'data-architect': 4,
  'security-architect': 5,
  'business-architect': 5,
  'technical-architect': 5,
  'network-architect': 3,
  'cto-cdio': 5,
  cdo: 4,
  ciso: 5,
  'product-manager': 5,
  'delivery-manager': 6,
  'business-analyst': 4,
  'service-owner': 3,
  'data-governance-manager': 4,
  'performance-analyst': 4,
  'it-service-manager': 3,
  'devops-engineer': 3,
};
