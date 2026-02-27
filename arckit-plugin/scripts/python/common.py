#!/usr/bin/env python3
"""
Common utilities for ArcKit scripts (plugin version).
Looks for projects/ directory as repo root indicator.
"""

import os
import re
import sys
import json
import shutil
import subprocess
from pathlib import Path

# ANSI color codes
RED = "\033[0;31m"
GREEN = "\033[0;32m"
YELLOW = "\033[1;33m"
BLUE = "\033[0;34m"
NC = "\033[0m"  # No Color


# ============================================================================
# Logging Functions
# ============================================================================

def log_info(msg):
    print(f"{BLUE}[INFO]{NC} {msg}", file=sys.stderr)


def log_success(msg):
    print(f"{GREEN}[SUCCESS]{NC} {msg}", file=sys.stderr)


def log_warning(msg):
    print(f"{YELLOW}[WARNING]{NC} {msg}", file=sys.stderr)


def log_error(msg):
    print(f"{RED}[ERROR]{NC} {msg}", file=sys.stderr)


# ============================================================================
# Repository Root Detection
# ============================================================================

def find_repo_root(start_dir=None):
    """Find the repository root by looking for projects/ directory."""
    current = Path(start_dir or os.getcwd()).resolve()
    while current != current.parent:
        if (current / "projects").is_dir():
            return str(current)
        current = current.parent
    log_error("Not in an ArcKit project (no projects/ directory found)")
    sys.exit(1)


# ============================================================================
# Project Management
# ============================================================================

def get_next_project_number(repo_root):
    """Get the next available project number (zero-padded to 3 digits)."""
    projects_dir = Path(repo_root) / "projects"
    if not projects_dir.is_dir():
        return "001"

    max_num = 0
    for entry in projects_dir.iterdir():
        if entry.is_dir():
            m = re.match(r"^(\d{3})-", entry.name)
            if m:
                num = int(m.group(1))
                if num > max_num:
                    max_num = num

    return f"{max_num + 1:03d}"


def slugify(text):
    """Convert text to kebab-case slug."""
    text = text.lower()
    text = re.sub(r"[^a-z0-9]+", "-", text)
    text = text.strip("-")
    return text


def create_project_dir(project_dir):
    """Create project directory structure with all required subdirectories."""
    subdirs = [
        "", "vendors", "external", "final",
        "decisions", "diagrams", "wardley-maps",
        "data-contracts", "reviews",
    ]
    for sub in subdirs:
        (Path(project_dir) / sub).mkdir(parents=True, exist_ok=True)
    log_success(f"Created project directory: {project_dir}")


# ============================================================================
# Project Finding
# ============================================================================

def find_project_dir_by_prefix(prefix, repo_root=None):
    """Find project directory by number or prefix (exact then fuzzy match)."""
    if repo_root is None:
        repo_root = find_repo_root()
    projects_dir = Path(repo_root) / "projects"
    if not projects_dir.is_dir():
        log_error("No projects directory found")
        return None

    # Exact match first
    for entry in sorted(projects_dir.iterdir()):
        if entry.is_dir():
            name = entry.name
            if name == prefix or name.startswith(f"{prefix}-"):
                return str(entry)

    # Fuzzy match
    for entry in sorted(projects_dir.iterdir()):
        if entry.is_dir() and prefix in entry.name:
            return str(entry)

    log_error(f"No project found matching: {prefix}")
    return None


def get_project_number_from_dir(dir_path):
    """Extract 3-digit project number from directory name."""
    name = Path(dir_path).name
    m = re.match(r"^(\d{3})-", name)
    return m.group(1) if m else None


def list_projects(repo_root=None):
    """List all projects."""
    if repo_root is None:
        repo_root = find_repo_root()
    projects_dir = Path(repo_root) / "projects"
    if not projects_dir.is_dir():
        print("No projects found")
        return

    dirs = sorted(d for d in projects_dir.iterdir() if d.is_dir())
    if not dirs:
        print("No projects found")
        return

    print("Available projects:")
    for d in dirs:
        print(f"  - {d.name}")


# ============================================================================
# Git Integration
# ============================================================================

def has_git():
    """Check if git is available."""
    return shutil.which("git") is not None


def get_repo_root():
    """Get repository root using git (fallback to find_repo_root)."""
    if has_git():
        try:
            result = subprocess.run(
                ["git", "rev-parse", "--show-toplevel"],
                capture_output=True, text=True, timeout=5,
            )
            if result.returncode == 0:
                return result.stdout.strip()
        except (subprocess.TimeoutExpired, FileNotFoundError):
            pass
    return find_repo_root()


def get_current_branch():
    """Get current git branch."""
    if has_git():
        try:
            result = subprocess.run(
                ["git", "rev-parse", "--abbrev-ref", "HEAD"],
                capture_output=True, text=True, timeout=5,
            )
            if result.returncode == 0:
                return result.stdout.strip()
        except (subprocess.TimeoutExpired, FileNotFoundError):
            pass
    return "main"


# ============================================================================
# Validation Helpers
# ============================================================================

def check_file(file_path, description=None):
    """Check if file exists and print status."""
    if description is None:
        description = Path(file_path).name
    if Path(file_path).is_file():
        print(f"  \u2713 {description}")
        return True
    print(f"  \u2717 {description}")
    return False


def check_dir(dir_path, description=None):
    """Check if directory exists and is not empty."""
    if description is None:
        description = Path(dir_path).name
    p = Path(dir_path)
    if p.is_dir() and any(p.iterdir()):
        print(f"  \u2713 {description}")
        return True
    print(f"  \u2717 {description}")
    return False


def require_file(file_path, description=None):
    """Require file to exist."""
    if description is None:
        description = Path(file_path).name
    if not Path(file_path).is_file():
        log_error(f"Required file not found: {description}")
        log_error(f"  Path: {file_path}")
        return False
    log_success(f"Found: {description}")
    return True


def require_dir(dir_path, description=None):
    """Require directory to exist."""
    if description is None:
        description = Path(dir_path).name
    if not Path(dir_path).is_dir():
        log_error(f"Required directory not found: {description}")
        log_error(f"  Path: {dir_path}")
        return False
    log_success(f"Found: {description}")
    return True


# ============================================================================
# JSON Helpers
# ============================================================================

def json_escape(s):
    """Escape string for JSON embedding."""
    return json.dumps(s)[1:-1]  # Strip surrounding quotes


def output_json_array(items):
    """Output a JSON array string from a list."""
    return json.dumps(items)


# ============================================================================
# Path Helpers
# ============================================================================

def get_arckit_dir(repo_root=None):
    """Get .arckit directory path."""
    if repo_root is None:
        repo_root = find_repo_root()
    return os.path.join(repo_root, ".arckit")


def get_templates_dir(repo_root=None):
    """Get templates directory path."""
    if repo_root is None:
        repo_root = find_repo_root()
    return os.path.join(repo_root, ".arckit", "templates")


def get_projects_dir(repo_root=None):
    """Get projects directory path."""
    if repo_root is None:
        repo_root = find_repo_root()
    return os.path.join(repo_root, "projects")


def get_memory_dir(repo_root=None):
    """Get memory directory path (000-global)."""
    if repo_root is None:
        repo_root = find_repo_root()
    return os.path.join(repo_root, "projects", "000-global")
