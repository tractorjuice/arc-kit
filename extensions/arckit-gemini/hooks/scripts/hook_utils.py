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

DOC_TYPES = {
    # Discovery
    "REQ":       {"name": "Requirements",                      "category": "Discovery"},
    "STKE":      {"name": "Stakeholder Analysis",              "category": "Discovery"},
    "RSCH":      {"name": "Research Findings",                 "category": "Discovery"},
    "DSCT":      {"name": "Data Source Discovery",             "category": "Discovery"},
    # Planning
    "SOBC":      {"name": "Strategic Outline Business Case",   "category": "Planning"},
    "PLAN":      {"name": "Project Plan",                      "category": "Planning"},
    "ROAD":      {"name": "Roadmap",                           "category": "Planning"},
    "STRAT":     {"name": "Architecture Strategy",             "category": "Planning"},
    "BKLG":      {"name": "Product Backlog",                   "category": "Planning"},
    # Architecture
    "PRIN":      {"name": "Architecture Principles",           "category": "Architecture"},
    "HLDR":      {"name": "High-Level Design Review",          "category": "Architecture"},
    "DLDR":      {"name": "Detailed Design Review",            "category": "Architecture"},
    "DATA":      {"name": "Data Model",                        "category": "Architecture"},
    "WARD":      {"name": "Wardley Map",                       "category": "Architecture"},
    "DIAG":      {"name": "Architecture Diagrams",             "category": "Architecture"},
    "DFD":       {"name": "Data Flow Diagram",                 "category": "Architecture"},
    "ADR":       {"name": "Architecture Decision Records",     "category": "Architecture"},
    "PLAT":      {"name": "Platform Design",                   "category": "Architecture"},
    # Governance
    "RISK":      {"name": "Risk Register",                     "category": "Governance"},
    "TRAC":      {"name": "Traceability Matrix",               "category": "Governance"},
    "PRIN-COMP": {"name": "Principles Compliance",             "category": "Governance"},
    "CONF":      {"name": "Conformance Assessment",            "category": "Governance"},
    "PRES":      {"name": "Presentation",                      "category": "Governance"},
    "ANAL":      {"name": "Analysis Report",                   "category": "Governance"},
    "GAPS":      {"name": "Gap Analysis",                      "category": "Governance"},
    # Compliance
    "TCOP":      {"name": "TCoP Assessment",                   "category": "Compliance"},
    "SECD":      {"name": "Secure by Design",                  "category": "Compliance"},
    "SECD-MOD":  {"name": "MOD Secure by Design",              "category": "Compliance"},
    "AIPB":      {"name": "AI Playbook Assessment",            "category": "Compliance"},
    "ATRS":      {"name": "ATRS Record",                       "category": "Compliance"},
    "DPIA":      {"name": "Data Protection Impact Assessment", "category": "Compliance"},
    "JSP936":    {"name": "JSP 936 Assessment",                "category": "Compliance"},
    "SVCASS":    {"name": "Service Assessment",                "category": "Compliance"},
    # Operations
    "SNOW":      {"name": "ServiceNow Design",                 "category": "Operations"},
    "DEVOPS":    {"name": "DevOps Strategy",                   "category": "Operations"},
    "MLOPS":     {"name": "MLOps Strategy",                    "category": "Operations"},
    "FINOPS":    {"name": "FinOps Strategy",                   "category": "Operations"},
    "OPS":       {"name": "Operational Readiness",             "category": "Operations"},
    # Procurement
    "SOW":       {"name": "Statement of Work",                 "category": "Procurement"},
    "EVAL":      {"name": "Evaluation Criteria",               "category": "Procurement"},
    "DOS":       {"name": "DOS Requirements",                  "category": "Procurement"},
    "GCLD":      {"name": "G-Cloud Search",                    "category": "Procurement"},
    "GCLC":      {"name": "G-Cloud Clarifications",            "category": "Procurement"},
    "DMC":       {"name": "Data Mesh Contract",                "category": "Procurement"},
    "VEND":      {"name": "Vendor Evaluation",                 "category": "Procurement"},
    # Research
    "AWRS":      {"name": "AWS Research",                      "category": "Research"},
    "AZRS":      {"name": "Azure Research",                    "category": "Research"},
    "GCRS":      {"name": "GCP Research",                      "category": "Research"},
    # Other
    "STORY":     {"name": "Project Story",                     "category": "Other"},
}

# Set of all valid type codes
KNOWN_TYPES = set(DOC_TYPES.keys())

# Multi-instance types requiring sequence numbers (ADR-001, DIAG-002, etc.)
MULTI_INSTANCE_TYPES = {
    "ADR", "DIAG", "DFD", "WARD", "DMC",
    "RSCH", "AWRS", "AZRS", "GCRS", "DSCT",
}

# Type code -> required subdirectory
SUBDIR_MAP = {
    "ADR":  "decisions",
    "DIAG": "diagrams",
    "DFD":  "diagrams",
    "WARD": "wardley-maps",
    "DMC":  "data-contracts",
    "RSCH": "research",
    "AWRS": "research",
    "AZRS": "research",
    "GCRS": "research",
    "DSCT": "research",
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
