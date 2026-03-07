#!/usr/bin/env python3
"""
List all ArcKit projects with status indicators.

Usage:
    python3 list-projects.py [OPTIONS]

Options:
    --json           Output in JSON format
    --verbose, -v    Show detailed artifact status
    --help, -h       Show help message
"""

import argparse
import json
import os
import sys
from pathlib import Path

# Add parent directory to path for common imports
sys.path.insert(0, os.path.dirname(__file__))
from common import (
    find_repo_root, get_projects_dir, get_project_number_from_dir,
    log_warning,
)


def check_artifact(project_dir, artifact):
    """Check if an artifact exists (file or non-empty directory)."""
    if artifact.endswith("/"):
        d = os.path.join(project_dir, artifact.rstrip("/"))
        return os.path.isdir(d) and bool(os.listdir(d))
    return os.path.isfile(os.path.join(project_dir, artifact))


def count_vendors(project_dir):
    """Count vendor proposal directories."""
    vendors_dir = os.path.join(project_dir, "vendors")
    if not os.path.isdir(vendors_dir):
        return 0
    return sum(1 for d in os.listdir(vendors_dir)
               if os.path.isdir(os.path.join(vendors_dir, d)))


def count_external_docs(project_dir):
    """Count external documents (excluding README.md)."""
    external_dir = os.path.join(project_dir, "external")
    if not os.path.isdir(external_dir):
        return 0
    extensions = {".pdf", ".docx", ".md", ".csv", ".sql", ".png", ".jpg"}
    count = 0
    for fname in os.listdir(external_dir):
        if fname == "README.md":
            continue
        fpath = os.path.join(external_dir, fname)
        if os.path.isfile(fpath) and Path(fname).suffix.lower() in extensions:
            count += 1
    return count


def calculate_completion(project_dir):
    """Calculate completion percentage based on standard artifacts."""
    total = 10
    completed = 0

    artifacts = [
        "stakeholder-drivers.md", "risk-register.md", "sobc.md",
        "requirements.md", "data-model.md", "research-findings.md",
        "sow.md", "evaluation-criteria.md",
    ]

    for artifact in artifacts:
        if os.path.isfile(os.path.join(project_dir, artifact)):
            completed += 1

    # Wardley maps
    wm_dir = os.path.join(project_dir, "wardley-maps")
    if os.path.isdir(wm_dir) and os.listdir(wm_dir):
        completed += 1

    # Vendors
    vendors_dir = os.path.join(project_dir, "vendors")
    if os.path.isdir(vendors_dir) and os.listdir(vendors_dir):
        completed += 1

    return completed * 100 // total


def get_status_emoji(percentage):
    """Get status indicator based on completion."""
    if percentage == 100:
        return "\u2705"
    elif percentage >= 75:
        return "\U0001f7e2"
    elif percentage >= 50:
        return "\U0001f7e1"
    elif percentage >= 25:
        return "\U0001f7e0"
    else:
        return "\U0001f534"


def main():
    parser = argparse.ArgumentParser(description="List all ArcKit projects with status indicators")
    parser.add_argument("--json", dest="json_mode", action="store_true", help="Output in JSON format")
    parser.add_argument("--verbose", "-v", action="store_true", help="Show detailed artifact status")
    args = parser.parse_args()

    repo_root = find_repo_root()
    projects_dir = get_projects_dir(repo_root)

    if not os.path.isdir(projects_dir):
        if args.json_mode:
            print('{"projects": []}')
        else:
            log_warning("No projects directory found")
            print()
            print("Run: /arckit.init to initialize an ArcKit repository")
        sys.exit(0)

    # Get sorted project directories
    project_dirs = sorted(
        d for d in Path(projects_dir).iterdir() if d.is_dir()
    )
    project_count = len(project_dirs)

    if project_count == 0:
        if args.json_mode:
            print('{"projects": []}')
        else:
            print("No projects found")
            print()
            print("Run: /arckit.create to create a new project")
        sys.exit(0)

    # JSON output mode
    if args.json_mode:
        projects = []
        for pd in project_dirs:
            pdir = str(pd)
            project_name = pd.name
            project_number = get_project_number_from_dir(pdir) or ""
            vendor_count = count_vendors(pdir)
            external_doc_count = count_external_docs(pdir)
            completion = calculate_completion(pdir)

            projects.append({
                "name": project_name,
                "number": project_number,
                "path": pdir,
                "completion_percentage": completion,
                "vendor_count": vendor_count,
                "external_doc_count": external_doc_count,
                "artifacts": {
                    "stakeholder_drivers": check_artifact(pdir, "stakeholder-drivers.md"),
                    "risk_register": check_artifact(pdir, "risk-register.md"),
                    "sobc": check_artifact(pdir, "sobc.md"),
                    "requirements": check_artifact(pdir, "requirements.md"),
                    "data_model": check_artifact(pdir, "data-model.md"),
                    "research_findings": check_artifact(pdir, "research-findings.md"),
                    "wardley_maps": check_artifact(pdir, "wardley-maps/"),
                    "sow": check_artifact(pdir, "sow.md"),
                    "evaluation_criteria": check_artifact(pdir, "evaluation-criteria.md"),
                    "vendors": check_artifact(pdir, "vendors/"),
                },
            })

        output = {
            "repository_root": repo_root,
            "projects_dir": projects_dir,
            "project_count": project_count,
            "projects": projects,
        }
        print(json.dumps(output, indent=2))
        sys.exit(0)

    # Text output mode
    print("ArcKit Projects")
    print("===============")
    print()
    print(f"Repository: {repo_root}")
    print(f"Projects found: {project_count}")
    print()

    for pd in project_dirs:
        pdir = str(pd)
        project_name = pd.name
        project_number = get_project_number_from_dir(pdir) or ""
        vendor_count = count_vendors(pdir)
        external_doc_count = count_external_docs(pdir)
        completion = calculate_completion(pdir)
        status = get_status_emoji(completion)

        print(f"{status} [{project_number}] {project_name} ({completion}% complete)")

        if args.verbose:
            print(f"    Path: {pdir}")
            print("    Artifacts:")

            checks = [
                ("stakeholder-drivers.md", "Stakeholder Drivers"),
                ("risk-register.md", "Risk Register"),
                ("sobc.md", "Strategic Outline Business Case"),
                ("requirements.md", "Requirements"),
                ("data-model.md", "Data Model"),
                ("research-findings.md", "Research Findings"),
                ("wardley-maps/", "Wardley Maps"),
                ("sow.md", "Statement of Work"),
                ("evaluation-criteria.md", "Evaluation Criteria"),
            ]

            for artifact, label in checks:
                mark = "\u2713" if check_artifact(pdir, artifact) else "\u2717"
                print(f"      {mark} {label}")

            if vendor_count > 0:
                print(f"      \u2713 Vendor Proposals ({vendor_count})")
            else:
                print("      \u2717 Vendor Proposals")

            if external_doc_count > 0:
                print(f"      \u2713 External Documents ({external_doc_count})")
            else:
                print("      \u2717 External Documents")

            print()

    print()
    print("Legend:")
    print("  \u2705 Complete (100%)")
    print("  \U0001f7e2 Mostly complete (75-99%)")
    print("  \U0001f7e1 In progress (50-74%)")
    print("  \U0001f7e0 Started (25-49%)")
    print("  \U0001f534 Not started (0-24%)")


if __name__ == "__main__":
    main()
