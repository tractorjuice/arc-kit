#!/usr/bin/env python3
"""
ArcKit Hook Utilities -- Shared module for all Gemini CLI hooks.

Python equivalent of arckit-claude/hooks/hook-utils.mjs.
Provides common helpers for stdin parsing, repo discovery, doc-type
metadata, and JSON output formatting.
"""

import json
import os
import re
import sys

# ── Document Type Codes (mirrors arckit-claude/config/doc-types.mjs) ──
#
# Copied by hand from doc-types.mjs (Python can't import it). tests/plugin/
# test_gemini_doc_types.py fails CI when DOC_TYPES, MULTI_INSTANCE_TYPES or
# SUBDIR_MAP drift from it; validate-filename.py blocks any code missing here.

DOC_TYPES = {
    # Discovery
    "REQ":        {"name": "Requirements",                                                  "category": "Discovery"},
    "STKE":       {"name": "Stakeholder Analysis",                                          "category": "Discovery"},
    "RSCH":       {"name": "Research Findings",                                             "category": "Discovery"},
    "DSCT":       {"name": "Data Source Discovery",                                         "category": "Discovery"},
    "TNDR":       {"name": "Procurement Market Intelligence",                               "category": "Discovery"},
    "CMPT":       {"name": "Competitor Landscape",                                          "category": "Discovery"},
    # Planning
    "SOBC":       {"name": "Strategic Outline Business Case",                               "category": "Planning"},
    "PLAN":       {"name": "Project Plan",                                                  "category": "Planning"},
    "ROAD":       {"name": "Roadmap",                                                       "category": "Planning"},
    "STRAT":      {"name": "Architecture Strategy",                                         "category": "Planning"},
    "BKLG":       {"name": "Product Backlog",                                               "category": "Planning"},
    # Architecture
    "PRIN":       {"name": "Architecture Principles",                                       "category": "Architecture"},
    "HLDR":       {"name": "High-Level Design Review",                                      "category": "Architecture"},
    "DLDR":       {"name": "Detailed Design Review",                                        "category": "Architecture"},
    "DATA":       {"name": "Data Model",                                                    "category": "Architecture"},
    "WARD":       {"name": "Wardley Map",                                                   "category": "Architecture"},
    "WDOC":       {"name": "Wardley Doctrine Assessment",                                   "category": "Architecture"},
    "WGAM":       {"name": "Wardley Gameplay Analysis",                                     "category": "Architecture"},
    "WCLM":       {"name": "Wardley Climate Assessment",                                    "category": "Architecture"},
    "WVCH":       {"name": "Wardley Value Chain",                                           "category": "Architecture"},
    "DIAG":       {"name": "Architecture Diagrams",                                         "category": "Architecture"},
    "DFD":        {"name": "Data Flow Diagram",                                             "category": "Architecture"},
    "ADR":        {"name": "Architecture Decision Records",                                 "category": "Architecture"},
    "PLAT":       {"name": "Platform Design",                                               "category": "Architecture"},
    # TOGAF ADM overlay
    "ADMP":       {"name": "ADM Preliminary / Architecture Vision",                         "category": "Architecture"},
    "BPCM":       {"name": "Business Capability Map",                                       "category": "Architecture"},
    "APP":        {"name": "Application Inventory",                                         "category": "Architecture"},
    "APPR":       {"name": "Application Rationalisation",                                   "category": "Architecture"},
    "GAPA":       {"name": "TOGAF Gap Analysis",                                            "category": "Governance"},
    "TRANS":      {"name": "Transition Architecture",                                       "category": "Planning"},
    "BORD":       {"name": "Architecture Board Charter",                                    "category": "Governance"},
    "ACHG":       {"name": "Architecture Change Request",                                   "category": "Governance"},
    "REPO":       {"name": "Architecture Repository",                                       "category": "Architecture"},
    # AI Agent Architecture overlay
    "AAGI":       {"name": "Agent Inventory",                                               "category": "Architecture"},
    "AAGR":       {"name": "Agent Architecture Specification",                              "category": "Architecture"},
    "AAOV":       {"name": "Agent Governance Framework",                                    "category": "Governance"},
    "AAIN":       {"name": "Agent Integration Architecture",                                "category": "Architecture"},
    "AASE":       {"name": "Agent Security Architecture",                                   "category": "Governance"},
    "AAMT":       {"name": "Agent Maturity Assessment",                                     "category": "Governance"},
    # Open Agile Architecture overlay
    "OASTR":      {"name": "Agile Strategy",                                                "category": "Planning"},
    "OAPR":       {"name": "Product Architecture",                                          "category": "Architecture"},
    "OAAL":       {"name": "ADM Lite Sprint Mapping",                                       "category": "Architecture"},
    "OASEC":      {"name": "Agile Security",                                                "category": "Governance"},
    "OAGOV":      {"name": "Agile Governance",                                              "category": "Governance"},
    # Governance
    "RISK":       {"name": "Risk Register",                                                 "category": "Governance"},
    "TRAC":       {"name": "Traceability Matrix",                                           "category": "Governance"},
    "PRIN-COMP":  {"name": "Principles Compliance",                                         "category": "Governance"},
    "CONF":       {"name": "Conformance Assessment",                                        "category": "Governance"},
    "PRES":       {"name": "Presentation",                                                  "category": "Reporting"},
    "DECK":       {"name": "Executive Deck",                                                "category": "Reporting"},
    "ANAL":       {"name": "Analysis Report",                                               "category": "Governance"},
    "GAPS":       {"name": "Gap Analysis",                                                  "category": "Governance"},
    "CDAU":       {"name": "Codebase Audit",                                                "category": "Governance"},
    "GLOS":       {"name": "Glossary",                                                      "category": "Governance"},
    "FWRK":       {"name": "Framework Overview",                                            "category": "Governance"},
    # Compliance
    "TCOP":       {"name": "TCoP Assessment",                                               "category": "Compliance"},
    "SECD":       {"name": "Secure by Design",                                              "category": "Compliance"},
    "SECD-MOD":   {"name": "MOD Secure by Design",                                          "category": "Compliance"},
    "AIPB":       {"name": "AI Playbook Assessment",                                        "category": "Compliance"},
    "ATRS":       {"name": "ATRS Record",                                                   "category": "Compliance"},
    "DPIA":       {"name": "Data Protection Impact Assessment",                             "category": "Compliance"},
    "JSP936":     {"name": "JSP 936 Assessment",                                            "category": "Compliance"},
    "SVCASS":     {"name": "Service Assessment",                                            "category": "Compliance"},
    # Operations
    "SNOW":       {"name": "ServiceNow Design",                                             "category": "Operations"},
    "DEVOPS":     {"name": "DevOps Strategy",                                               "category": "Operations"},
    "MLOPS":      {"name": "MLOps Strategy",                                                "category": "Operations"},
    "FINOPS":     {"name": "FinOps Strategy",                                               "category": "Operations"},
    "OPS":        {"name": "Operational Readiness",                                         "category": "Operations"},
    # Procurement
    "SOW":        {"name": "Statement of Work",                                             "category": "Procurement"},
    "EVAL":       {"name": "Evaluation Criteria",                                           "category": "Procurement"},
    "DOS":        {"name": "DOS Requirements",                                              "category": "Procurement"},
    "GCLD":       {"name": "G-Cloud Search",                                                "category": "Procurement"},
    "GCLC":       {"name": "G-Cloud Clarifications",                                        "category": "Procurement"},
    # G-Cloud supplier bid-authoring
    "SUPP":       {"name": "Supplier Profile",                                              "category": "Procurement"},
    "SVCD":       {"name": "Service Design",                                                "category": "Procurement"},
    "SDD":        {"name": "Service Definition Document",                                   "category": "Procurement"},
    "DECL":       {"name": "Supplier Declaration",                                          "category": "Procurement"},
    "PRIC":       {"name": "Pricing Document",                                              "category": "Procurement"},
    "SECA":       {"name": "Security Assertions",                                           "category": "Procurement"},
    "GCMP":       {"name": "G-Cloud Competitor Benchmark",                                  "category": "Procurement"},
    "GCRV":       {"name": "G-Cloud Submission Review",                                     "category": "Procurement"},
    "SOCV":       {"name": "Social Value Commitments",                                      "category": "Procurement"},
    "LOTQ":       {"name": "G-Cloud Lot Questions",                                         "category": "Procurement"},
    "RATE":       {"name": "G-Cloud Lot 3 Rate Card",                                       "category": "Procurement"},
    "DMC":        {"name": "Data Mesh Contract",                                            "category": "Procurement"},
    "VEND":       {"name": "Vendor Evaluation",                                             "category": "Procurement"},
    # Research
    "AWRS":       {"name": "AWS Research",                                                  "category": "Research"},
    "AZRS":       {"name": "Azure Research",                                                "category": "Research"},
    "GCRS":       {"name": "GCP Research",                                                  "category": "Research"},
    "GOVR":       {"name": "Government Reuse Assessment",                                   "category": "Research"},
    "GCSR":       {"name": "Government Code Search Report",                                 "category": "Research"},
    "GLND":       {"name": "Government Landscape Analysis",                                 "category": "Research"},
    "GRNT":       {"name": "Grants Research",                                               "category": "Research"},
    # Reporting
    "STORY":      {"name": "Project Story",                                                 "category": "Reporting"},
    # EU Regulatory Compliance
    "RGPD":       {"name": "GDPR Compliance Assessment",                                    "category": "Compliance"},
    "NIS2":       {"name": "NIS2 Compliance Assessment",                                    "category": "Compliance"},
    "AIACT":      {"name": "EU AI Act Compliance Assessment",                               "category": "Compliance"},
    "DORA":       {"name": "DORA Compliance Assessment",                                    "category": "Compliance"},
    "CRA":        {"name": "EU Cyber Resilience Act Assessment",                            "category": "Compliance"},
    "DSA":        {"name": "EU Digital Services Act Assessment",                            "category": "Compliance"},
    "DATAACT":    {"name": "EU Data Act Compliance Assessment",                             "category": "Compliance"},
    "EUCSF":      {"name": "EU Cloud Sovereignty Framework Assessment",                     "category": "Compliance"},
    # French Government
    "IRN":        {"name": "IRN — Indice de Résilience Numérique",                          "category": "Governance"},
    "CNIL":       {"name": "CNIL / French GDPR Assessment",                                 "category": "Compliance"},
    "SECNUM":     {"name": "SecNumCloud 3.2 Assessment",                                    "category": "Compliance"},
    "MARPUB":     {"name": "French Public Procurement",                                     "category": "Procurement"},
    "DINUM":      {"name": "DINUM Standards Assessment",                                    "category": "Compliance"},
    "EBIOS":      {"name": "EBIOS Risk Manager Study",                                      "category": "Governance"},
    "ANSSI":      {"name": "ANSSI Security Posture Assessment",                             "category": "Compliance"},
    "CARTO":      {"name": "ANSSI Information System Cartography",                          "category": "Architecture"},
    "DR":         {"name": "Diffusion Restreinte Handling Assessment",                      "category": "Compliance"},
    "ALGO":       {"name": "Public Algorithm Transparency Notice",                          "category": "Compliance"},
    "PSSI":       {"name": "Information System Security Policy",                            "category": "Compliance"},
    "REUSE":      {"name": "Public Code Reuse Assessment",                                  "category": "Procurement"},
    # Austrian Government
    "ATBFR":      {"name": "Austrian Accessibility Assessment (BaFG / WZG)",                "category": "Compliance"},
    "ATDSG":      {"name": "Austrian Data Protection Assessment",                           "category": "Compliance"},
    "ATNISG":     {"name": "Austrian NISG (NIS2) Assessment",                               "category": "Compliance"},
    "BVERGG":     {"name": "Austrian Public Procurement (BVergG 2018 idF VergabeRG 2026)",  "category": "Procurement"},
    # UAE Federal Overlay
    "PDPL":       {"name": "UAE PDPL Compliance Assessment",                                "category": "Compliance"},
    "IAS":        {"name": "UAE IAS Statement of Applicability",                            "category": "Compliance"},
    "CRES":       {"name": "UAE Sovereign Cloud Residency Assessment",                      "category": "Architecture"},
    "CLAS":       {"name": "UAE Smart Data Classification Register",                        "category": "Governance"},
    "UPASS":      {"name": "UAE Pass Integration Design",                                   "category": "Architecture"},
    "ZBUR":       {"name": "UAE Zero Bureaucracy Service Review",                           "category": "Governance"},
    "DREC":       {"name": "UAE Digital Records Plan",                                      "category": "Governance"},
    "DSHR":       {"name": "UAE Data Sharing Agreement",                                    "category": "Governance"},
    "NPRA":       {"name": "UAE National Priorities Alignment Statement",                   "category": "Governance"},
    "AICH":       {"name": "UAE AI Charter Compliance Assessment",                          "category": "Compliance"},
    "AUTI":       {"name": "UAE AI Autonomy Tier Posture",                                  "category": "Architecture"},
    "FPRO":       {"name": "UAE Federal Procurement Strategy",                              "category": "Procurement"},
    # Canada Federal Overlay
    "FITAA":      {"name": "Canada FITAA Compliance Assessment",                            "category": "Compliance"},
    "PIA":        {"name": "Canada Privacy Impact Assessment",                              "category": "Compliance"},
    "ATIP":       {"name": "Canada ATIP Reconciliation",                                    "category": "Compliance"},
    "AIA":        {"name": "Canada Algorithmic Impact Assessment",                          "category": "Compliance"},
    "CHRT":       {"name": "Canada Charter Rights Design Review",                           "category": "Governance"},
    "ITSG":       {"name": "Canada ITSG-33 Statement of Applicability",                     "category": "Architecture"},
    "SOIA":       {"name": "Canada Security of Information Act Handling Plan",              "category": "Compliance"},
    "CACR":       {"name": "Canada Sovereign Cloud Residency Assessment",                   "category": "Architecture"},
    "DIGSTD":     {"name": "Canada GC Digital Standards Conformance",                       "category": "Governance"},
    "OLA":        {"name": "Canada Official Languages Act Review",                          "category": "Compliance"},
    "PROC":       {"name": "Canada Federal Procurement Strategy",                           "category": "Procurement"},
    "OCAP":       {"name": "Canada First Nations OCAP Sovereignty Assessment",              "category": "Governance"},
    # USA Federal Civilian Overlay
    "FIPS199":    {"name": "US FIPS 199 System Categorization",                             "category": "Compliance"},
    "NIST":       {"name": "US NIST SP 800-53 Rev 5 Tailored Control Set",                  "category": "Architecture"},
    "FRSSP":      {"name": "US FedRAMP System Security Plan",                               "category": "Compliance"},
    "FRRR":       {"name": "US FedRAMP Readiness Assessment Report",                        "category": "Compliance"},
    "ZTA":        {"name": "US CISA Zero Trust Maturity Posture",                           "category": "Architecture"},
    "ICAM":       {"name": "US ICAM Architecture (OMB M-19-17 / NIST SP 800-63-3)",         "category": "Architecture"},
    "AIRMF":      {"name": "US NIST AI Risk Management Framework Assessment",               "category": "Compliance"},
    "AIIA":       {"name": "US AI Impact Assessment (OMB M-24-10 / M-25-21)",               "category": "Compliance"},
    "USPIA":      {"name": "US Privacy Impact Assessment (E-Gov §208)",                     "category": "Compliance"},
    "SBOM":       {"name": "US SBOM + Secure-Software Self-Attestation (EO 14028)",         "category": "Compliance"},
    # Australian Federal Overlay
    "AUE8":       {"name": "AU Essential Eight Maturity Posture",                           "category": "Compliance"},
    "AUISM":      {"name": "AU ISM Statement of Applicability",                             "category": "Compliance"},
    "AUPIA":      {"name": "AU Privacy Impact Assessment (Privacy Act 1988)",               "category": "Compliance"},
    "AUNDB":      {"name": "AU Notifiable Data Breach Response Playbook",                   "category": "Compliance"},
    "AUOT":       {"name": "AU OT Security Assessment",                                     "category": "Compliance"},
    "AUSOCI":     {"name": "AU SOCI CIRMP Governance Pack",                                 "category": "Compliance"},
    "AUAESCSF":   {"name": "AU AESCSF Maturity Assessment",                                 "category": "Compliance"},
    "AUENERGY":   {"name": "AU Energy Compliance Pack",                                     "category": "Compliance"},
    "AUDSS":      {"name": "AU DTA Digital Service Standard Conformance",                   "category": "Governance"},
    "AUPSPF":     {"name": "AU Protective Security Policy Framework Scorecard",             "category": "Governance"},
    "AUAIA":      {"name": "AU AI Assurance Baseline (DTA AI Policy v2.0)",                 "category": "Compliance"},
    "AUDISP":     {"name": "AU DISP Member Self-Attestation Pack",                          "category": "Compliance"},
    # Netherlands Public Sector Overlay
    "RBCLOUD":    {"name": "Rijksbreed Cloudbeleid Compliance Assessment",                  "category": "Compliance"},
    "TBB":        {"name": "Te Beschermen Belangen (TBB) Category Determination",           "category": "Compliance"},
    "BIO2":       {"name": "BIO2 Conformance Assessment",                                   "category": "Compliance"},
    "NLEXIT":     {"name": "NL Cloud Exit Plan",                                            "category": "Governance"},
    # UK Financial Services Payments Overlay
    "FSSCA":      {"name": "UK PSD2 SCA-RTS Exemption Design",                              "category": "Compliance"},
    "FSSAFE":     {"name": "UK EMI / PI Safeguarding Assessment",                           "category": "Compliance"},
    "FSCD":       {"name": "UK FCA Consumer Duty Board Report",                             "category": "Compliance"},
    "FSCTP":      {"name": "UK Critical Third Parties Dependency Assessment",               "category": "Compliance"},
    # UK NHS Clinical Safety Overlay
    "NHSDTAC":    {"name": "NHS Digital Technology Assessment Criteria (DTAC v3)",          "category": "Compliance"},
    "NHSMDR":     {"name": "UK MDR + EU MDR SaMD/AIaMD Classification",                     "category": "Compliance"},
    "MMOD":       {"name": "Maturity Model Assessment",                                     "category": "Governance"},
}

# Set of all valid type codes
KNOWN_TYPES = set(DOC_TYPES.keys())

# Multi-instance types requiring sequence numbers (ADR-001, DIAG-002, etc.)
MULTI_INSTANCE_TYPES = {
    "ADR", "DIAG", "DFD", "WARD", "DMC", "RSCH", "AWRS", "AZRS",
    "GCRS", "DSCT", "TNDR", "CMPT", "WGAM", "WCLM", "WVCH", "GOVR",
    "GCSR", "GLND", "GRNT", "CDAU", "ACHG",
}

# Type code -> required subdirectory
SUBDIR_MAP = {
    "ADR":   "decisions",
    "DIAG":  "diagrams",
    "DFD":   "diagrams",
    "WARD":  "wardley-maps",
    "WDOC":  "wardley-maps",
    "WGAM":  "wardley-maps",
    "WCLM":  "wardley-maps",
    "WVCH":  "wardley-maps",
    "DMC":   "data-contracts",
    "RSCH":  "research",
    "AWRS":  "research",
    "AZRS":  "research",
    "GCRS":  "research",
    "DSCT":  "research",
    "TNDR":  "research",
    "CMPT":  "research",
    "GOVR":  "research",
    "GCSR":  "research",
    "GLND":  "research",
    "GRNT":  "research",
    "CDAU":  "audits",
    "FWRK":  "framework",
    "ACHG":  "changes",
    "GCLD":  "procurement",
    "DOS":   "procurement",
    "GCLC":  "procurement",
}

# Compound types (contain hyphens) -- checked first during extraction
COMPOUND_TYPES = [k for k in DOC_TYPES if "-" in k]

# Regex for ARC filenames: ARC-NNN-TYPE[-SEQ]-vN.N.md
ARC_PATTERN = re.compile(r"^ARC-\d{3}-.+-v\d+(\.\d+)?\.md$")

# Subdirectory name -> manifest array key
SUBDIR_TO_KEY = {}
for _dir in set(SUBDIR_MAP.values()):
    # Convert kebab-case to camelCase: "wardley-maps" -> "wardleyMaps"
    _key = re.sub(r"-([a-z])", lambda m: m.group(1).upper(), _dir)
    SUBDIR_TO_KEY[_dir] = _key
SUBDIR_TO_KEY["reviews"] = "reviews"

# Subdirectories to scan for artifacts
ARTIFACT_SUBDIRS = list(set(SUBDIR_MAP.values())) + ["reviews"]


# ── File System Helpers ──

def is_dir(path):
    """Check if path is a directory."""
    return os.path.isdir(path)


def is_file(path):
    """Check if path is a file."""
    return os.path.isfile(path)


def read_text(path):
    """Read file contents as text, return None on failure."""
    try:
        with open(path, "r", encoding="utf-8") as f:
            return f.read()
    except (OSError, IOError):
        return None


def list_dir(path):
    """List directory contents sorted, return empty list on failure."""
    try:
        return sorted(os.listdir(path))
    except (OSError, IOError):
        return []


def list_files_recursive(root_dir):
    """List files below root_dir with stable slash-separated relative paths."""
    files = []

    def walk(current_dir, parts):
        for entry in list_dir(current_dir):
            full_path = os.path.join(current_dir, entry)
            next_parts = parts + [entry]
            if is_dir(full_path):
                walk(full_path, next_parts)
            elif is_file(full_path):
                files.append({
                    "name": entry,
                    "path": full_path,
                    "relative_path": "/".join(next_parts),
                })

    if is_dir(root_dir):
        walk(root_dir, [])
    return files


def mtime_ms(path):
    """Get file modification time in milliseconds, 0 on failure."""
    try:
        return os.stat(path).st_mtime * 1000
    except (OSError, IOError):
        return 0


# ── Repository Discovery ──

def find_repo_root(cwd):
    """Walk up from cwd until a directory containing projects/ is found."""
    current = os.path.abspath(cwd)
    while True:
        if is_dir(os.path.join(current, "projects")):
            return current
        parent = os.path.dirname(current)
        if parent == current:
            break
        current = parent
    return None


# ── Doc Type Extraction ──

def extract_doc_type(filename):
    """Extract the document type code from an ARC filename."""
    m = re.match(r"^ARC-\d{3}-(.+)-v\d+(\.\d+)?\.md$", filename)
    if not m:
        return None
    rest = m.group(1)

    # Try compound types first (e.g. SECD-MOD, PRIN-COMP)
    for code in COMPOUND_TYPES:
        if rest.startswith(code):
            return code

    # Strip trailing -NNN for multi-instance types (ADR-001, DIAG-002)
    rest = re.sub(r"-\d{3}$", "", rest)
    return rest


def extract_version(filename):
    """Extract version string from ARC filename."""
    m = re.search(r"-v(\d+(?:\.\d+)?)\.md$", filename)
    return m.group(1) if m else None


def doc_type_name(code):
    """Get display name for a doc type code."""
    entry = DOC_TYPES.get(code)
    return entry["name"] if entry else code


# ── Hook Input/Output ──

def parse_hook_input():
    """Read JSON from stdin. Return empty dict on failure."""
    try:
        raw = sys.stdin.read()
    except Exception:
        return {}
    if not raw or not raw.strip():
        return {}
    try:
        return json.loads(raw)
    except (json.JSONDecodeError, ValueError):
        return {}


def output_json(data):
    """Write JSON to stdout."""
    print(json.dumps(data))


def output_context(text):
    """Output additionalContext via hookSpecificOutput."""
    output_json({
        "hookSpecificOutput": {
            "additionalContext": text,
        }
    })


def output_block(reason):
    """Write reason to stderr and exit with code 2 (block)."""
    sys.stderr.write(reason + "\n")
    sys.exit(2)
