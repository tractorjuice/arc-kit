#!/usr/bin/env python3
"""
ArcKit UserPromptSubmit Hook

Pre-computes project context when any /arckit: command is run.
Injects project inventory, artifact lists, and external documents
as a systemMessage so commands don't need to discover this themselves.

Hook Type: UserPromptSubmit
Input (stdin): JSON with user_prompt, cwd, etc.
Output (stdout): JSON with systemMessage containing project context
"""

import json
import os
import re
import sys
from pathlib import Path

# Doc type code to human-readable name mapping
DOC_TYPE_NAMES = {
    "PRIN": "Architecture Principles",
    "STKE": "Stakeholder Analysis",
    "REQ": "Requirements",
    "RISK": "Risk Register",
    "SOBC": "Business Case",
    "PLAN": "Project Plan",
    "ROAD": "Roadmap",
    "STRAT": "Architecture Strategy",
    "BKLG": "Product Backlog",
    "HLDR": "High-Level Design Review",
    "DLDR": "Detailed Design Review",
    "DATA": "Data Model",
    "WARD": "Wardley Map",
    "DIAG": "Architecture Diagram",
    "DFD": "Data Flow Diagram",
    "ADR": "Architecture Decision Record",
    "TRAC": "Traceability Matrix",
    "TCOP": "TCoP Assessment",
    "SECD": "Secure by Design",
    "SECD-MOD": "MOD Secure by Design",
    "AIPB": "AI Playbook Assessment",
    "ATRS": "ATRS Record",
    "DPIA": "Data Protection Impact Assessment",
    "JSP936": "JSP 936 Assessment",
    "SVCASS": "Service Assessment",
    "SNOW": "ServiceNow Design",
    "DEVOPS": "DevOps Strategy",
    "MLOPS": "MLOps Strategy",
    "FINOPS": "FinOps Strategy",
    "OPS": "Operational Readiness",
    "PLAT": "Platform Design",
    "SOW": "Statement of Work",
    "EVAL": "Evaluation Criteria",
    "DOS": "DOS Requirements",
    "GCLD": "G-Cloud Search",
    "GCLC": "G-Cloud Clarifications",
    "DMC": "Data Mesh Contract",
    "RSCH": "Research Findings",
    "AWRS": "AWS Research",
    "AZRS": "Azure Research",
    "GCRS": "GCP Research",
    "DSCT": "Data Source Discovery",
    "STORY": "Project Story",
    "ANAL": "Analysis Report",
    "PRIN-COMP": "Principles Compliance",
    "CONF": "Conformance Assessment",
}

# Multi-instance types that have sequence numbers in filenames
MULTI_INSTANCE_RE = re.compile(r"^([A-Z]+-?[A-Z]*)-\d{3}$")


def doc_type_name(code):
    """Get human-readable name for a doc type code."""
    return DOC_TYPE_NAMES.get(code, code)


def extract_doc_type(filename):
    """Extract doc type code from ARC filename.

    ARC-001-REQ-v1.0.md -> REQ
    ARC-001-ADR-001-v1.0.md -> ADR
    ARC-001-SECD-MOD-v1.0.md -> SECD-MOD
    """
    # Strip ARC-NNN- prefix
    m = re.match(r"^ARC-\d{3}-(.+)$", filename)
    if not m:
        return filename
    rest = m.group(1)
    # Remove version suffix: -vN.N.md or -vN.N
    rest = re.sub(r"-v\d+(\.\d+)?\.md$", "", rest)
    rest = re.sub(r"-v\d+(\.\d+)?$", "", rest)
    # Strip trailing -NNN for multi-instance types
    mm = MULTI_INSTANCE_RE.match(rest)
    if mm:
        return mm.group(1)
    return rest


def find_repo_root(cwd):
    """Find repo root by looking for projects/ directory."""
    current = Path(cwd).resolve()
    while current != current.parent:
        if (current / "projects").is_dir():
            return str(current)
        current = current.parent
    return None


def main():
    try:
        raw = sys.stdin.read()
        if not raw or not raw.strip():
            sys.exit(0)
        data = json.loads(raw)
    except (json.JSONDecodeError, ValueError, EOFError):
        sys.exit(0)

    user_prompt = data.get("user_prompt", "")

    # Only run for /arckit: commands
    if not user_prompt.startswith("/arckit:"):
        sys.exit(0)

    # Commands that don't need project context
    m = re.match(r"^/arckit:([a-z_-]*)", user_prompt)
    if m:
        command = m.group(1)
        if command in ("pages", "customize", "create", "init", "list", "trello"):
            sys.exit(0)

    # Find repo root
    cwd = data.get("cwd", os.getcwd())
    repo_root = find_repo_root(cwd)
    if not repo_root:
        sys.exit(0)

    projects_dir = os.path.join(repo_root, "projects")
    if not os.path.isdir(projects_dir):
        sys.exit(0)

    # Build context string
    lines = []
    lines.append("## ArcKit Project Context (auto-detected by hook)\n")
    lines.append(f"Repository: {repo_root}\n")

    # Count projects
    project_entries = sorted(
        e for e in os.listdir(projects_dir)
        if os.path.isdir(os.path.join(projects_dir, e))
    )
    lines.append(f"**{len(project_entries)} project(s) found:**\n")

    # Scan each project
    for project_name in project_entries:
        project_dir = os.path.join(projects_dir, project_name)

        # Extract project number
        project_number = ""
        pm = re.match(r"^(\d{3})-", project_name)
        if pm:
            project_number = pm.group(1)

        lines.append(f"### {project_name}")
        lines.append(f"- **Path**: {project_dir}")
        if project_number:
            lines.append(f"- **Project ID**: {project_number}")

        # Scan for ARC-* artifacts in main project dir
        artifact_list = []
        artifact_count = 0
        newest_artifact_mtime = 0

        for f in sorted(os.listdir(project_dir)):
            fp = os.path.join(project_dir, f)
            if os.path.isfile(fp) and f.startswith("ARC-") and f.endswith(".md"):
                dtype = extract_doc_type(f)
                dname = doc_type_name(dtype)
                artifact_list.append(f"  - `{f}` ({dname})")
                artifact_count += 1
                amtime = os.path.getmtime(fp)
                if amtime > newest_artifact_mtime:
                    newest_artifact_mtime = amtime

        # Also scan subdirectories
        for subdir in ("decisions", "diagrams", "wardley-maps", "data-contracts", "reviews"):
            sub_path = os.path.join(project_dir, subdir)
            if os.path.isdir(sub_path):
                for f in sorted(os.listdir(sub_path)):
                    fp = os.path.join(sub_path, f)
                    if os.path.isfile(fp) and f.startswith("ARC-") and f.endswith(".md"):
                        dtype = extract_doc_type(f)
                        dname = doc_type_name(dtype)
                        artifact_list.append(f"  - `{subdir}/{f}` ({dname})")
                        artifact_count += 1
                        amtime = os.path.getmtime(fp)
                        if amtime > newest_artifact_mtime:
                            newest_artifact_mtime = amtime

        if artifact_count > 0:
            lines.append(f"- **Artifacts** ({artifact_count}):")
            lines.extend(artifact_list)
        else:
            lines.append("- **Artifacts**: none")

        # Check for vendor directories
        vendors_dir = os.path.join(project_dir, "vendors")
        if os.path.isdir(vendors_dir):
            vendor_list = []
            for vname in sorted(os.listdir(vendors_dir)):
                vpath = os.path.join(vendors_dir, vname)
                if os.path.isdir(vpath):
                    vendor_list.append(f"  - {vname}")
            if vendor_list:
                lines.append(f"- **Vendors** ({len(vendor_list)}):")
                lines.extend(vendor_list)

        # Check for external documents
        external_dir = os.path.join(project_dir, "external")
        if os.path.isdir(external_dir):
            ext_list = []
            for f in sorted(os.listdir(external_dir)):
                fp = os.path.join(external_dir, f)
                if not os.path.isfile(fp):
                    continue
                if f == "README.md":
                    continue
                ext_mtime = os.path.getmtime(fp)
                if ext_mtime > newest_artifact_mtime:
                    ext_list.append(f"  - `{f}` (**NEW** \u2014 newer than latest artifact)")
                else:
                    ext_list.append(f"  - `{f}`")
            if ext_list:
                lines.append(f"- **External documents** ({len(ext_list)}) in `external/`:")
                lines.extend(ext_list)

        lines.append("")  # blank line between projects

    # Check for global policies
    policies_dir = os.path.join(projects_dir, "000-global", "policies")
    if os.path.isdir(policies_dir):
        policy_list = []
        for f in sorted(os.listdir(policies_dir)):
            fp = os.path.join(policies_dir, f)
            if os.path.isfile(fp):
                policy_list.append(f"  - `{f}`")
        if policy_list:
            lines.append("### Global Policies (000-global/policies/)")
            lines.extend(policy_list)
            lines.append("")

    context_text = "\n".join(lines)

    output = {
        "suppressOutput": True,
        "systemMessage": context_text,
    }
    print(json.dumps(output))


if __name__ == "__main__":
    main()
