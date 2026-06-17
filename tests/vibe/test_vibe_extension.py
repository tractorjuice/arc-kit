"""Validate the generated Mistral Vibe extension structure."""

import json
import tomllib
from pathlib import Path

import pytest


REPO_ROOT = Path(__file__).resolve().parents[2]
VIBE_ROOT = REPO_ROOT / "extensions" / "arckit-vibe"

# Expected files
EXPECTED_FILES = {
    "config": VIBE_ROOT / "vibe-config.toml",
    "mcp": VIBE_ROOT / ".mcp.json",
    "readme": VIBE_ROOT / "README.md",
    "version": VIBE_ROOT / "VERSION",
    "license": VIBE_ROOT / "LICENSE",
}

# Expected directories
EXPECTED_DIRS = {
    "skills": VIBE_ROOT / "skills",
    "agents": VIBE_ROOT / "agents",
    "templates": VIBE_ROOT / "templates",
    "schemas": VIBE_ROOT / "schemas",
}

# Expected agent files
EXPECTED_AGENTS = [
    "arckit-research.toml",
    "arckit-aws-research.toml",
    "arckit-azure-research.toml",
    "arckit-gcp-research.toml",
    "arckit-datascout.toml",
    "arckit-framework.toml",
    "arckit-gov-code-search.toml",
    "arckit-gov-landscape.toml",
    "arckit-gov-reuse.toml",
    "arckit-grants.toml",
]

# Minimum expected skill count (core commands)
MIN_EXPECTED_SKILL_COUNT = 72  # Core commands converted (70 + principles + requirements)

# Expected template count
EXPECTED_TEMPLATE_COUNT = 66

# Expected schema count
EXPECTED_SCHEMA_COUNT = 5


class TestVibeExtensionStructure:
    """Test the basic extension structure."""

    def test_extension_directory_exists(self):
        """Verify extension directory exists."""
        assert VIBE_ROOT.exists(), "Vibe extension directory not found"
        assert VIBE_ROOT.is_dir(), "Vibe extension is not a directory"

    def test_required_files_exist(self):
        """Verify all required files exist."""
        for name, path in EXPECTED_FILES.items():
            assert path.exists(), f"Required file {name} not found at {path}"
            assert path.is_file(), f"{name} is not a file"

    def test_required_directories_exist(self):
        """Verify all required directories exist."""
        for name, path in EXPECTED_DIRS.items():
            assert path.exists(), f"Required directory {name} not found at {path}"
            assert path.is_dir(), f"{name} is not a directory"


class TestVibeConfig:
    """Test the vibe-config.toml configuration file."""

    def test_config_file_exists(self):
        """Verify config file exists."""
        config_path = VIBE_ROOT / "vibe-config.toml"
        assert config_path.exists(), "vibe-config.toml not found"

    def test_config_is_valid_toml(self):
        """Verify config file is valid TOML."""
        config_path = VIBE_ROOT / "vibe-config.toml"
        with open(config_path, "rb") as f:
            config = tomllib.load(f)
        assert "extension" in config, "Config missing 'extension' section"

    def test_config_has_required_fields(self):
        """Verify config has all required fields."""
        config_path = VIBE_ROOT / "vibe-config.toml"
        with open(config_path, "rb") as f:
            config = tomllib.load(f)
        
        ext = config.get("extension", {})
        assert "name" in ext, "Config missing extension.name"
        assert ext["name"] == "arckit", f"Expected name 'arckit', got {ext['name']}"
        assert "version" in ext, "Config missing extension.version"
        assert "description" in ext, "Config missing extension.description"

    def test_config_has_mcp_servers(self):
        """Verify config lists MCP servers."""
        config_path = VIBE_ROOT / "vibe-config.toml"
        with open(config_path, "rb") as f:
            config = tomllib.load(f)
        
        ext = config.get("extension", {})
        mcp = ext.get("mcp", {})
        servers = mcp.get("servers", [])
        
        assert len(servers) > 0, "No MCP servers listed in config"
        assert "aws-knowledge" in servers, "aws-knowledge not in MCP servers"
        assert "microsoft-learn" in servers, "microsoft-learn not in MCP servers"


class TestMcpConfig:
    """Test the MCP configuration file."""

    def test_mcp_file_exists(self):
        """Verify .mcp.json exists."""
        mcp_path = VIBE_ROOT / ".mcp.json"
        assert mcp_path.exists(), ".mcp.json not found"

    def test_mcp_is_valid_json(self):
        """Verify .mcp.json is valid JSON."""
        mcp_path = VIBE_ROOT / ".mcp.json"
        with open(mcp_path, encoding="utf-8") as f:
            mcp = json.load(f)
        assert "servers" in mcp, "MCP config missing 'servers'"

    def test_mcp_has_required_servers(self):
        """Verify MCP config has all required servers."""
        mcp_path = VIBE_ROOT / ".mcp.json"
        with open(mcp_path, encoding="utf-8") as f:
            mcp = json.load(f)
        
        servers = mcp.get("servers", {})
        required_servers = ["aws-knowledge", "microsoft-learn", "govreposcrape"]
        
        for server in required_servers:
            assert server in servers, f"Required MCP server {server} not found"


class TestAgents:
    """Test agent TOML files."""

    def test_agents_directory_exists(self):
        """Verify agents directory exists."""
        agents_dir = VIBE_ROOT / "agents"
        assert agents_dir.exists(), "Agents directory not found"
        assert agents_dir.is_dir(), "Agents is not a directory"

    def test_expected_agents_exist(self):
        """Verify expected agent files exist."""
        agents_dir = VIBE_ROOT / "agents"
        for agent_file in EXPECTED_AGENTS:
            agent_path = agents_dir / agent_file
            assert agent_path.exists(), f"Agent {agent_file} not found"

    def test_agents_are_valid_toml(self):
        """Verify all agent files are valid TOML."""
        agents_dir = VIBE_ROOT / "agents"
        for agent_file in agents_dir.glob("*.toml"):
            with open(agent_file, "rb") as f:
                try:
                    tomllib.load(f)
                except tomllib.TOMLDecodeError as e:
                    pytest.fail(f"Agent {agent_file.name} is not valid TOML: {e}")

    def test_agents_have_required_fields(self):
        """Verify agents have required fields."""
        agents_dir = VIBE_ROOT / "agents"
        required_fields = ["agent_type", "display_name", "description"]
        
        for agent_file in agents_dir.glob("*.toml"):
            with open(agent_file, "rb") as f:
                agent = tomllib.load(f)
            
            for field in required_fields:
                assert field in agent, f"Agent {agent_file.name} missing field {field}"


class TestSkills:
    """Test skill files."""

    def test_skills_directory_exists(self):
        """Verify skills directory exists."""
        skills_dir = VIBE_ROOT / "skills"
        assert skills_dir.exists(), "Skills directory not found"
        assert skills_dir.is_dir(), "Skills is not a directory"

    def test_minimum_skill_count(self):
        """Verify minimum number of skills exist."""
        skills_dir = VIBE_ROOT / "skills"
        skill_files = list(skills_dir.glob("arckit-*.md"))
        assert len(skill_files) >= MIN_EXPECTED_SKILL_COUNT, \
            f"Expected at least {MIN_EXPECTED_SKILL_COUNT} skills, found {len(skill_files)}"

    def test_skills_have_frontmatter(self):
        """Verify all skills have YAML frontmatter."""
        skills_dir = VIBE_ROOT / "skills"
        for skill_file in skills_dir.glob("arckit-*.md"):
            content = skill_file.read_text()
            assert content.startswith("---"), \
                f"Skill {skill_file.name} missing YAML frontmatter"
            assert "name:" in content, \
                f"Skill {skill_file.name} missing name field in frontmatter"
            assert "description:" in content, \
                f"Skill {skill_file.name} missing description field in frontmatter"

    def test_skills_have_display_name(self):
        """Verify skills have display_name field."""
        skills_dir = VIBE_ROOT / "skills"
        for skill_file in skills_dir.glob("arckit-*.md"):
            content = skill_file.read_text()
            assert "display_name:" in content, \
                f"Skill {skill_file.name} missing display_name field"


class TestTemplates:
    """Test template files."""

    def test_templates_directory_exists(self):
        """Verify templates directory exists."""
        templates_dir = VIBE_ROOT / "templates"
        assert templates_dir.exists(), "Templates directory not found"

    def test_expected_template_count(self):
        """Verify expected number of templates exist."""
        templates_dir = VIBE_ROOT / "templates"
        template_files = list(templates_dir.rglob("*.md"))
        assert len(template_files) >= EXPECTED_TEMPLATE_COUNT, \
            f"Expected at least {EXPECTED_TEMPLATE_COUNT} templates, found {len(template_files)}"


class TestSchemas:
    """Test schema files."""

    def test_schemas_directory_exists(self):
        """Verify schemas directory exists."""
        schemas_dir = VIBE_ROOT / "schemas"
        assert schemas_dir.exists(), "Schemas directory not found"

    def test_expected_schema_count(self):
        """Verify expected number of schemas exist."""
        schemas_dir = VIBE_ROOT / "schemas"
        schema_files = list(schemas_dir.rglob("*"))
        schema_files = [f for f in schema_files if f.is_file()]
        assert len(schema_files) >= EXPECTED_SCHEMA_COUNT, \
            f"Expected at least {EXPECTED_SCHEMA_COUNT} schemas, found {len(schema_files)}"


class TestReadme:
    """Test the README file."""

    def test_readme_exists(self):
        """Verify README exists."""
        readme_path = VIBE_ROOT / "README.md"
        assert readme_path.exists(), "README.md not found"

    def test_readme_has_required_sections(self):
        """Verify README has required sections."""
        readme_path = VIBE_ROOT / "README.md"
        content = readme_path.read_text()
        
        required_sections = [
            "# ArcKit for Mistral Vibe",
            "## Installation",
            "## Usage",
            "## Configuration",
        ]
        
        for section in required_sections:
            assert section in content, f"README missing section: {section}"


class TestVersionFile:
    """Test the VERSION file."""

    def test_version_exists(self):
        """Verify VERSION file exists."""
        version_path = VIBE_ROOT / "VERSION"
        assert version_path.exists(), "VERSION file not found"

    def test_version_is_valid(self):
        """Verify VERSION file contains a valid version string."""
        version_path = VIBE_ROOT / "VERSION"
        version = version_path.read_text().strip()
        assert version, "VERSION file is empty"
        # Simple version format check (X.Y.Z)
        assert re.match(r"^\d+\.\d+\.\d+$", version), \
            f"VERSION file has invalid format: {version}"


class TestLicense:
    """Test the LICENSE file."""

    def test_license_exists(self):
        """Verify LICENSE file exists."""
        license_path = VIBE_ROOT / "LICENSE"
        assert license_path.exists(), "LICENSE file not found"

    def test_license_has_content(self):
        """Verify LICENSE file has content."""
        license_path = VIBE_ROOT / "LICENSE"
        content = license_path.read_text()
        assert len(content) > 100, "LICENSE file seems too short"


# Import re at module level for version check
import re
