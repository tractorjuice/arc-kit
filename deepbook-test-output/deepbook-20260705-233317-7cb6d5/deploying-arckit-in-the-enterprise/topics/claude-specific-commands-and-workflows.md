# Claude-Specific Commands and Workflows

## Introduction

Claude Code's unique capabilities and integration patterns enable ArcKit to provide specialized commands and workflows that leverage the platform's strengths. These Claude-specific features transform ArcKit from a generic architecture governance tool into a Claude-optimized intelligence platform that understands your codebase at a profound level.

This chapter explores the specialized commands, workflows, and integration patterns that are uniquely available or optimized for the Claude Code platform. We'll cover everything from basic slash commands to advanced multi-step workflows that leverage Claude's reasoning capabilities for enterprise-grade architecture governance.

## Command Architecture

### Command Structure and Design Philosophy

ArcKit commands for Claude Code follow a consistent, intuitive structure designed for developer productivity and enterprise scalability.

**Command Format**:
```
/arckit:<command> [subcommand] [options] [arguments]
```

**Design Principles**:
1. **Clarity**: Commands should be self-explanatory and easy to remember
2. **Consistency**: Similar functionality should have similar command patterns
3. **Composability**: Commands should work well together in pipelines
4. **Safety**: Destructive actions require explicit confirmation
5. **Context-Awareness**: Commands should leverage available context intelligently
6. **Enterprise-Ready**: Support for team collaboration and organizational workflows

### Command Categories

ArcKit commands for Claude Code are organized into logical categories:

| Category | Prefix | Purpose | Example |
|----------|--------|---------|---------|
| **Core** | `/arckit:` | Essential functionality | `/arckit:status` |
| **ADR** | `/arckit:adr` | Architecture Decision Records | `/arckit:adr create` |
| **Validation** | `/arckit:validate` | Architecture validation | `/arckit:validate` |
| **Analysis** | `/arckit:analyze` | Code and architecture analysis | `/arckit:analyze dependencies` |
| **Context** | `/arckit:context` | Context management | `/arckit:context load` |
| **Reporting** | `/arckit:report` | Reporting and documentation | `/arckit:report generate` |
| **Integration** | `/arckit:integrate` | Third-party integrations | `/arckit:integrate jira` |
| **Configuration** | `/arckit:config` | Configuration management | `/arckit:config set` |
| **Utility** | `/arckit:utils` | Utility functions | `/arckit:utils health` |

## Core Commands

### Status and Health Commands

**1. Plugin Status**:
```bash
/arckit:status [--verbose] [--json]
```

Displays the current status of the ArcKit plugin, including version, configuration, and operational state.

**Options**:
- `--verbose`: Show detailed status information
- `--json`: Output in JSON format for programmatic consumption

**Example Output**:
```
ArcKit Plugin v4.20.1
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Status: Active
✅ Repository: enterprise-api (v2.3.1)
✅ Environment: production
✅ Configuration: Valid
✅ Last Sync: 2026-07-05T23:45:00Z

Commands: 45 registered
ADRs: 127 loaded
Rules: 89 active
Integrations: 3 configured (Jira, GitHub, Slack)

Memory Usage: 128MB / 512MB
Cache Size: 45MB
```

**2. Health Check**:
```bash
/arckit:health [--deep] [--fix]
```

Performs a comprehensive health check of the ArcKit installation and configuration.

**Options**:
- `--deep`: Perform deep health checks including file system validation
- `--fix`: Automatically fix identified issues where possible

**Health Check Areas**:
- Plugin installation and version
- Configuration files validity
- Repository structure compliance
- Dependency requirements
- Integration connectivity
- Performance metrics

**3. Version Information**:
```bash
/arckit:version [--full] [--check-updates]
```

Displays version information and checks for updates.

**Options**:
- `--full`: Show complete version information including dependencies
- `--check-updates`: Check for available updates

**4. Help System**:
```bash
/arckit:help [command] [--detailed]
```

Comprehensive help system with context-aware assistance.

**Usage Examples**:
```bash
# General help
/arckit:help

# Help for specific command
/arckit:help adr

# Detailed help with examples
/arckit:help adr create --detailed

# Interactive help
/arckit:help --interactive
```

## Architecture Decision Record (ADR) Commands

### ADR Lifecycle Commands

**1. Create ADR**:
```bash
/arckit:adr create [--title <title>] [--description <description>] [--template <template>] [--interactive]
```

Creates a new Architecture Decision Record with comprehensive metadata and structure.

**Options**:
- `--title`: ADR title (required if not interactive)
- `--description`: Initial description
- `--template`: Template to use (default, enterprise, minimal, etc.)
- `--interactive`: Interactive ADR creation wizard
- `--from-issue`: Create ADR from existing issue (Jira, GitHub, etc.)
- `--related`: Related ADRs or issues

**Interactive Creation Flow**:
```
User: /arckit:adr create --interactive

ArcKit: 📝 Let's create a new Architecture Decision Record

Title: Migrate from REST to GraphQL for API Layer
Description: Evaluate and document the decision to migrate our API layer from REST to GraphQL

Status: [Proposed/Accepted/Rejected/Deprecated/Superseded] (Proposed): 
Deciders: [alice@company.com, bob@company.com, charlie@company.com]
Date: [2026-07-05] (auto)

Context:
- Current REST API has 247 endpoints
- Frontend team requests more flexible querying
- Mobile app needs offline capabilities
- Performance concerns with over-fetching

Decision:
Adopt GraphQL as the primary API layer with REST fallback for external integrations

Consequences:
Positive:
- More flexible querying for frontend clients
- Reduced over-fetching and under-fetching
- Better mobile app performance
- Single endpoint simplifies API management

Negative:
- Learning curve for development team
- Migration effort for existing endpoints
- Potential performance issues with complex queries
- Caching complexity

Alternatives Considered:
1. Keep REST API as-is - Rejected due to frontend requirements
2. REST with query parameters - Rejected due to limited flexibility
3. gRPC - Rejected due to browser compatibility issues

ArcKit: ✅ ADR-023 created successfully!
File: .arckit/ADR/ADR-023-Migrate-to-GraphQL-v1.0.md
```

**2. List ADRs**:
```bash
/arckit:adr list [--all] [--status <status>] [--decider <decider>] [--tag <tag>] [--sort <field>] [--reverse]
```

Lists Architecture Decision Records with filtering and sorting capabilities.

**Options**:
- `--all`: Show all ADRs including deprecated and superseded
- `--status`: Filter by status (Proposed, Accepted, Rejected, Deprecated, Superseded)
- `--decider`: Filter by decision maker
- `--tag`: Filter by tag
- `--sort`: Sort by field (date, title, status, etc.)
- `--reverse`: Reverse sort order
- `--limit`: Limit number of results
- `--json`: Output in JSON format
- `--csv`: Output in CSV format

**Example Usage**:
```bash
# List all ADRs
/arckit:adr list --all

# List accepted ADRs from last 30 days
/arckit:adr list --status Accepted --since 30d

# List ADRs by specific decider
/arckit:adr list --decider alice@company.com

# List ADRs with specific tag
/arckit:adr list --tag microservices

# List and sort by date descending
/arckit:adr list --sort date --reverse
```

**3. View ADR**:
```bash
/arckit:adr view <adr-id> [--full] [--related] [--history]
```

Displays the content of a specific Architecture Decision Record.

**Options**:
- `--full`: Show full content including metadata
- `--related`: Show related ADRs and references
- `--history`: Show change history and revisions

**4. Update ADR**:
```bash
/arckit:adr update <adr-id> [--title <title>] [--description <description>] [--status <status>] [--interactive]
```

Updates an existing Architecture Decision Record.

**Options**:
- `--interactive`: Interactive update mode
- `--append`: Append to existing content
- `--version`: Update version number
- `--reason`: Reason for update

**5. Search ADRs**:
```bash
/arckit:adr search <query> [--fields <fields>] [--limit <limit>] [--case-sensitive]
```

Searches ADRs by content, title, or metadata.

**Example**:
```bash
# Search for ADRs containing "microservice"
/arckit:adr search microservice

# Search in specific fields
/arckit:adr search "database migration" --fields title,description

# Full-text search with limit
/arckit:adr search "performance optimization" --limit 10
```

### ADR Validation and Quality Commands

**1. Validate ADR**:
```bash
/arckit:adr validate <adr-id> [--check <check>] [--strict]
```

Validates an ADR against enterprise standards and best practices.

**Validation Checks**:
- `structure`: Validates ADR structure and required fields
- `quality`: Checks content quality and completeness
- `compliance`: Validates against enterprise architecture standards
- `consistency`: Checks for consistency with other ADRs
- `references`: Validates references and links
- `formatting`: Checks formatting and markdown quality

**Example**:
```bash
# Validate ADR structure
/arckit:adr validate ADR-023 --check structure

# Full validation with all checks
/arckit:adr validate ADR-023 --strict

# Validate all ADRs
/arckit:adr validate --all
```

**2. ADR Quality Score**:
```bash
/arckit:adr quality <adr-id> [--detailed] [--suggestions]
```

Calculates a quality score for an ADR based on multiple criteria.

**Quality Criteria**:
- Completeness of required fields
- Clarity of decision and alternatives
- Quality of consequences analysis
- Presence of context and justification
- Formatting and readability
- References and links

**3. ADR Review Workflow**:
```bash
/arckit:adr review <adr-id> [--assignee <assignee>] [--template <template>] [--send-notifications]
```

Initiates a formal review workflow for an ADR.

**Review States**:
- `Draft`: ADR is being prepared
- `In Review`: ADR is under review
- `Approved`: ADR has been approved
- `Rejected`: ADR has been rejected
- `Changes Requested`: ADR needs revisions

### ADR Management Commands

**1. Deprecate ADR**:
```bash
/arckit:adr deprecate <adr-id> --reason <reason> [--replacement <replacement-adr>] [--effective-date <date>]
```

Marks an ADR as deprecated with proper documentation.

**Example**:
```bash
/arckit:adr deprecate ADR-015 --reason "Superceded by new framework" --replacement ADR-042 --effective-date 2026-08-01
```

**2. Supersede ADR**:
```bash
/arckit:adr supersede <adr-id> --replacement <replacement-adr> [--reason <reason>]
```

Marks an ADR as superseded by another ADR.

**3. Link ADRs**:
```bash
/arckit:adr link <adr-id-1> <adr-id-2> [--type <type>] [--bidirectional]
```

Creates relationships between ADRs.

**Link Types**:
- `depends-on`: ADR-001 depends on ADR-002
- `related-to`: ADR-001 is related to ADR-002
- `implements`: ADR-001 implements ADR-002
- `conflicts-with`: ADR-001 conflicts with ADR-002
- `replaces`: ADR-001 replaces ADR-002

**4. ADR Impact Analysis**:
```bash
/arckit:adr impact <adr-id> [--scope <scope>] [--include-indirect] [--format <format>]
```

Analyzes the impact of an ADR on the codebase and other ADRs.

**Scope Options**:
- `code`: Impact on codebase
- `architecture`: Impact on architecture
- `dependencies`: Impact on dependencies
- `teams`: Impact on development teams
- `cost`: Financial impact

## Validation Commands

### Architecture Validation

**1. Validate Architecture**:
```bash
/arckit:validate [--check <check>] [--scope <scope>] [--strict] [--fix]
```

Comprehensive architecture validation against enterprise standards.

**Validation Checks**:
- `structure`: Validates project structure
- `patterns`: Validates architectural patterns
- `dependencies`: Validates dependency management
- `security`: Validates security practices
- `performance`: Validates performance considerations
- `testing`: Validates testing strategy
- `documentation`: Validates documentation completeness

**Scope Options**:
- `current`: Current project only
- `all`: All projects in workspace
- `changed`: Only changed files
- `specific`: Specific files or directories

**Example**:
```bash
# Full validation
/arckit:validate --strict

# Validate specific aspects
/arckit:validate --check structure --check patterns

# Validate with auto-fix
/arckit:validate --fix

# Validate specific files
/arckit:validate --scope specific --files "src/**/*.ts"
```

**2. Quick Validation**:
```bash
/arckit:validate:quick [--check <check>] [--scope <scope>]
```

Performs a quick validation with minimal checks for faster feedback.

**3. Validation Report**:
```bash
/arckit:validate:report [--format <format>] [--output <file>] [--include-details]
```

Generates a comprehensive validation report.

**Format Options**:
- `markdown`: Markdown format (default)
- `json`: JSON format
- `html`: HTML format
- `csv`: CSV format
- `pdf`: PDF format (requires additional dependencies)

### Rule-Specific Validation

**1. Validate Against Rules**:
```bash
/arckit:validate:rules [--rule <rule-id>] [--all] [--category <category>] [--severity <severity>]
```

Validates against specific ArcKit rules.

**Example**:
```bash
# Validate against all rules
/arckit:validate:rules --all

# Validate against specific rule
/arckit:validate:rules --rule ARC-001

# Validate by category
/arckit:validate:rules --category naming

# Validate by severity
/arckit:validate:rules --severity error
```

**2. Rule Management**:
```bash
/arckit:rule list [--category <category>] [--enabled] [--disabled]
/arckit:rule show <rule-id>
/arckit:rule enable <rule-id>
/arckit:rule disable <rule-id>
/arckit:rule test <rule-id> [--file <file>]
```

## Analysis Commands

### Code and Architecture Analysis

**1. Analyze Architecture**:
```bash
/arckit:analyze architecture [--focus <focus>] [--depth <depth>] [--format <format>]
```

Performs comprehensive architecture analysis.

**Focus Areas**:
- `structure`: Codebase structure analysis
- `patterns`: Architectural pattern identification
- `dependencies`: Dependency analysis
- `complexity`: Complexity analysis
- `coupling`: Coupling analysis
- `cohesion`: Cohesion analysis
- `layers`: Layer analysis
- `components`: Component analysis

**Example**:
```bash
# Full architecture analysis
/arckit:analyze architecture

# Focus on specific aspects
/arckit:analyze architecture --focus patterns --focus dependencies

# Analysis with specific depth
/arckit:analyze architecture --depth 3
```

**2. Analyze Dependencies**:
```bash
/arckit:analyze dependencies [--type <type>] [--depth <depth>] [--check-circular] [--check-vulnerabilities] [--format <format>]
```

Performs comprehensive dependency analysis.

**Dependency Types**:
- `code`: Code dependencies
- `package`: Package dependencies
- `service`: Service dependencies
- `module`: Module dependencies
- `external`: External dependencies

**Example**:
```bash
# Analyze all dependencies
/arckit:analyze dependencies

# Check for circular dependencies
/arckit:analyze dependencies --check-circular

# Check for vulnerabilities
/arckit:analyze dependencies --check-vulnerabilities

# Generate dependency graph
/arckit:analyze dependencies --format graphviz --output deps.dot
```

**3. Analyze Complexity**:
```bash
/arckit:analyze complexity [--metric <metric>] [--threshold <threshold>] [--scope <scope>] [--format <format>]
```

Analyzes code complexity using various metrics.

**Complexity Metrics**:
- `cyclomatic`: Cyclomatic complexity
- `cognitive`: Cognitive complexity
- `halstead`: Halstead complexity metrics
- `maintainability`: Maintainability index
- `lines`: Lines of code
- `functions`: Function complexity
- `classes`: Class complexity
- `files`: File complexity

**Example**:
```bash
# Analyze cyclomatic complexity
/arckit:analyze complexity --metric cyclomatic

# Analyze with thresholds
/arckit:analyze complexity --metric cyclomatic --threshold high

# Analyze specific scope
/arckit:analyze complexity --metric all --scope "src/**/services/**"
```

**4. Analyze Patterns**:
```bash
/arckit:analyze patterns [--type <type>] [--min-occurrences <count>] [--format <format>]
```

Identifies architectural and coding patterns.

**Pattern Types**:
- `architectural`: Architectural patterns (MVC, microservices, etc.)
- `design`: Design patterns (Singleton, Factory, etc.)
- `anti-patterns`: Anti-patterns (God object, Spaghetti code, etc.)
- `coding`: Coding patterns and conventions
- `testing`: Testing patterns
- `documentation`: Documentation patterns

**Example**:
```bash
# Identify architectural patterns
/arckit:analyze patterns --type architectural

# Find anti-patterns
/arckit:analyze patterns --type anti-patterns

# Find patterns with minimum occurrences
/arckit:analyze patterns --min-occurrences 5
```

### Specialized Analysis Commands

**1. Security Analysis**:
```bash
/arckit:analyze security [--check <check>] [--severity <severity>] [--format <format>]
```

Performs security-focused architecture analysis.

**Security Checks**:
- `authentication`: Authentication mechanisms
- `authorization`: Authorization patterns
- `data-protection`: Data protection and encryption
- `input-validation`: Input validation
- `injection`: Injection vulnerabilities
- `xss`: Cross-site scripting
- `csrf`: Cross-site request forgery
- `secrets`: Secrets management
- `dependencies`: Vulnerable dependencies

**2. Performance Analysis**:
```bash
/arckit:analyze performance [--focus <focus>] [--threshold <threshold>] [--format <format>]
```

Analyzes performance-related architectural aspects.

**Focus Areas**:
- `bottlenecks`: Performance bottlenecks
- `caching`: Caching strategy
- `database`: Database performance
- `api`: API performance
- `memory`: Memory usage
- `cpu`: CPU usage

**3. Cost Analysis**:
```bash
/arckit:analyze cost [--type <type>] [--period <period>] [--format <format>]
```

Analyzes cost implications of architectural decisions.

**Cost Types**:
- `infrastructure`: Infrastructure costs
- `development`: Development costs
- `operational`: Operational costs
- `licensing`: Licensing costs
- `scaling`: Scaling costs

## Context Management Commands

### Context Loading and Management

**1. Load Context**:
```bash
/arckit:context load [--strategy <strategy>] [--files <files>] [--exclude <exclude>] [--max-tokens <tokens>]
```

Loads context for analysis and operations.

**Strategies**:
- `default`: Default context loading
- `project`: Load entire project
- `files`: Load specific files
- `pattern`: Load by file pattern
- `architecture`: Load architecture-specific files
- `testing`: Load testing-related files
- `documentation`: Load documentation files

**Example**:
```bash
# Load with default strategy
/arckit:context load

# Load specific files
/arckit:context load --files "ARCHITECTURE.md" "package.json"

# Load with pattern
/arckit:context load --pattern "**/services/**"

# Load with token limit
/arckit:context load --max-tokens 150000
```

**2. Context Information**:
```bash
/arckit:context info [--detailed] [--json]
```

Displays information about the current context.

**3. Clear Context**:
```bash
/arckit:context clear [--all] [--keep <keep>]
```

Clears the current context.

**Options**:
- `--all`: Clear all context
- `--keep`: Keep specific context items

**4. Context Discovery**:
```bash
/arckit:context discover [--pattern <pattern>] [--type <type>] [--limit <limit>]
```

Discovers files and content that could be added to context.

**5. Context Compare**:
```bash
/arckit:context compare [--context1 <context1>] [--context2 <context2>] [--format <format>]
```

Compares different contexts.

### Context Manipulation Commands

**1. Add to Context**:
```bash
/arckit:context add [--files <files>] [--pattern <pattern>] [--summarize] [--compress]
```

Adds files or content to the current context.

**2. Remove from Context**:
```bash
/arckit:context remove [--files <files>] [--pattern <pattern>] [--all]
```

Removes files or content from the current context.

**3. Context Export**:
```bash
/arckit:context export [--format <format>] [--output <file>] [--include-metadata]
```

Exports the current context for sharing or backup.

**4. Context Import**:
```bash
/arckit:context import [--file <file>] [--format <format>] [--merge]
```

Imports context from a previously exported file.

## Reporting Commands

### Report Generation

**1. Generate Report**:
```bash
/arckit:report generate [--type <type>] [--format <format>] [--output <file>] [--template <template>]
```

Generates comprehensive reports based on analysis and validation.

**Report Types**:
- `architecture-review`: Architecture review report
- `validation`: Validation report
- `analysis`: Analysis report
- `compliance`: Compliance report
- `audit`: Audit report
- `custom`: Custom report

**Format Options**:
- `markdown`: Markdown format (default)
- `html`: HTML format
- `pdf`: PDF format
- `json`: JSON format
- `csv`: CSV format

**Example**:
```bash
# Generate architecture review report
/arckit:report generate --type architecture-review --format markdown --output review.md

# Generate validation report in HTML
/arckit:report generate --type validation --format html --output validation-report.html

# Generate custom report with template
/arckit:report generate --type custom --template enterprise-architecture --output custom-report.md
```

**2. Report Templates**:
```bash
/arckit:report template list
/arckit:report template show <template-id>
/arckit:report template create <template-id> [--from <source>]
/arckit:report template update <template-id>
/arckit:report template delete <template-id>
```

Manages report templates for consistent reporting across the enterprise.

### Custom Reports

**1. Create Custom Report**:
```bash
/arckit:report create [--name <name>] [--description <description>] [--template <template>] [--interactive]
```

Creates a custom report definition.

**2. Run Custom Report**:
```bash
/arckit:report run <report-id> [--parameters <parameters>] [--output <file>]
```

Runs a previously defined custom report.

**3. Schedule Report**:
```bash
/arckit:report schedule <report-id> [--frequency <frequency>] [--start <start>] [--end <end>]
```

Schedules reports to run automatically.

**Frequency Options**:
- `hourly`: Run every hour
- `daily`: Run every day
- `weekly`: Run every week
- `monthly`: Run every month
- `custom`: Custom cron expression

## Configuration Commands

### Configuration Management

**1. Configuration Status**:
```bash
/arckit:config status [--detailed] [--json]
```

Displays the current configuration status.

**2. Set Configuration**:
```bash
/arckit:config set <key> <value> [--scope <scope>] [--force]
```

Sets a configuration value.

**Scope Options**:
- `global`: Global configuration (user-level)
- `workspace`: Workspace configuration (project-level)
- `project`: Project configuration
- `environment`: Environment-specific configuration

**Example**:
```bash
# Set global configuration
/arckit:config set arckit.maxContextLength 32000 --scope global

# Set workspace configuration
/arckit:config set arckit.validateOnSave true --scope workspace

# Set project configuration
/arckit:config set arckit.environment production --scope project
```

**3. Get Configuration**:
```bash
/arckit:config get <key> [--scope <scope>] [--all]
```

Gets a configuration value.

**4. List Configuration**:
```bash
/arckit:config list [--scope <scope>] [--filter <filter>] [--show-defaults]
```

Lists all configuration values.

**5. Remove Configuration**:
```bash
/arckit:config remove <key> [--scope <scope>]
```

Removes a configuration value.

**6. Reset Configuration**:
```bash
/arckit:config reset [--scope <scope>] [--all]
```

Resets configuration to defaults.

### Configuration Validation

**1. Validate Configuration**:
```bash
/arckit:config validate [--scope <scope>] [--strict]
```

Validates the current configuration.

**2. Configuration Diff**:
```bash
/arckit:config diff [--scope1 <scope1>] [--scope2 <scope2>] [--format <format>]
```

Compares configuration between different scopes.

## Integration Commands

### Third-Party Integrations

**1. List Integrations**:
```bash
/arckit:integrate list [--configured] [--available] [--detailed]
```

Lists available and configured integrations.

**2. Configure Integration**:
```bash
/arckit:integrate configure <integration-id> [--interactive] [--settings <settings>]
```

Configures a third-party integration.

**3. Test Integration**:
```bash
/arckit:integrate test <integration-id> [--connection] [--authentication]
```

Tests an integration configuration.

**4. Integration Commands**:
```bash
/arckit:integrate <integration-id>:<command> [options]
```

Runs integration-specific commands.

**Example Integrations**:
```bash
# Jira integration
/arckit:integrate jira:link --issue KEY-123 --adr ADR-023
/arckit:integrate jira:create --type adr --summary "New Architecture Decision" --description "..."

# GitHub integration
/arckit:integrate github:pr --create --title "Architecture Update" --adr ADR-023
/arckit:integrate github:comment --pr 456 --adr ADR-023

# Slack integration
/arckit:integrate slack:notify --channel #architecture --message "ADR-023 needs review"
/arckit:integrate slack:reminder --adr ADR-023 --due 2026-07-12
```

## Advanced Workflows

### Multi-Step Workflows

**1. Architecture Review Workflow**:
```bash
# Step 1: Load context
/arckit:context load --strategy architecture-review

# Step 2: Validate current architecture
/arckit:validate architecture --strict

# Step 3: Analyze dependencies
/arckit:analyze dependencies --check-circular --check-vulnerabilities

# Step 4: Identify architecture debt
/arckit:analyze debt --type architecture --prioritize

# Step 5: Generate report
/arckit:report generate --type architecture-review --output review.md

# Step 6: Create improvement ADR
/arckit:adr create --title "Architecture Improvements" --from-report review.md
```

**2. ADR Creation and Review Workflow**:
```bash
# Step 1: Create ADR
/arckit:adr create --interactive --title "Microservice Extraction"

# Step 2: Validate ADR
/arckit:adr validate ADR-045 --strict

# Step 3: Impact analysis
/arckit:adr impact ADR-045 --scope all

# Step 4: Link to Jira issue
/arckit:integrate jira:link --adr ADR-045 --issue PROJ-123

# Step 5: Request review
/arckit:adr review ADR-045 --assignee alice@company.com --send-notifications

# Step 6: Generate implementation plan
/arckit:plan implementation --adr ADR-045 --include-timeline --include-resources
```

**3. Cross-Project Analysis Workflow**:
```bash
# Step 1: Load multiple project contexts
/arckit:context load --strategy cross-project --projects project-a project-b project-c

# Step 2: Compare architectures
/arckit:analyze architecture --compare --focus patterns dependencies

# Step 3: Check consistency
/arckit:check consistency --standards enterprise --report-all

# Step 4: Identify best practices
/arckit:analyze patterns --type architectural --min-occurrences 3

# Step 5: Generate standardization recommendations
/arckit:recommend standardization --focus patterns conventions

# Step 6: Create standardization ADR
/arckit:adr create --title "Enterprise Architecture Standards" --from-analysis
```

### Batch Operations

**1. Batch Validation**:
```bash
/arckit:batch validate --all-projects --strict --output validation-results.json
```

**2. Batch ADR Processing**:
```bash
/arckit:batch adr --all --validate --quality-check --generate-reports
```

**3. Batch Analysis**:
```bash
/arckit:batch analyze --projects project-a project-b project-c --focus complexity dependencies --output analysis-results.json
```

### Interactive Workflows

**1. Interactive Architecture Review**:
```bash
/arckit:interactive architecture-review
```

Guides you through a comprehensive architecture review with prompts and suggestions.

**2. Interactive ADR Creation**:
```bash
/arckit:interactive adr-create
```

Step-by-step ADR creation with validation and suggestions.

**3. Interactive Troubleshooting**:
```bash
/arckit:interactive troubleshoot [--issue <issue>]
```

Interactive troubleshooting for architecture and implementation issues.

## Command Customization

### Custom Command Creation

**1. Create Custom Command**:
```bash
/arckit:command create <command-id> [--description <description>] [--interactive]
```

Creates a custom ArcKit command.

**2. Edit Custom Command**:
```bash
/arckit:command edit <command-id>
```

Edits an existing custom command.

**3. Delete Custom Command**:
```bash
/arckit:command delete <command-id>
```

Deletes a custom command.

**4. List Custom Commands**:
```bash
/arckit:command list [--built-in] [--custom]
```

### Command Aliases

**1. Create Alias**:
```bash
/arckit:alias create <alias> <command> [--description <description>]
```

Creates a command alias for frequently used commands.

**Example**:
```bash
# Create alias for architecture validation
/arckit:alias create val /arckit:validate architecture --strict

# Create alias for ADR creation
/arckit:alias create newadr /arckit:adr create --interactive

# Create alias for full analysis
/arckit:alias create fullscan /arckit:analyze architecture --focus all --depth 3
```

**2. List Aliases**:
```bash
/arckit:alias list
```

**3. Remove Alias**:
```bash
/arckit:alias remove <alias>
```

## Enterprise Workflows

### Team Collaboration Workflows

**1. Team Onboarding**:
```bash
# Step 1: Load team context
/arckit:context load --strategy team-onboarding --team platform-engineering

# Step 2: Validate team standards compliance
/arckit:validate --check standards --check patterns --scope team

# Step 3: Generate team report
/arckit:report generate --type team-onboarding --output team-report.md

# Step 4: Create onboarding checklist
/arckit:checklist create --type onboarding --from-template enterprise-onboarding
```

**2. Sprint Planning**:
```bash
# Step 1: Load sprint context
/arckit:context load --strategy sprint-planning --sprint current

# Step 2: Analyze architecture impact of planned features
/arckit:analyze impact --features sprint-backlog --scope architecture

# Step 3: Validate proposed changes
/arckit:validate --check architecture --check dependencies --scope changes

# Step 4: Generate sprint architecture plan
/arckit:plan sprint --include-architecture --include-dependencies --output sprint-plan.md
```

**3. Code Review Workflow**:
```bash
# Step 1: Load PR context
/arckit:context load --strategy code-review --pr 456

# Step 2: Validate changes
/arckit:validate --scope changes --strict

# Step 3: Analyze architecture impact
/arckit:analyze impact --pr 456 --scope architecture

# Step 4: Check ADR compliance
/arckit:adr check --pr 456 --require-compliance

# Step 5: Generate review comments
/arckit:review generate --pr 456 --format comments --output review-comments.md
```

### Governance Workflows

**1. Architecture Review Board Workflow**:
```bash
# Step 1: Load board context
/arckit:context load --strategy arb-meeting --date 2026-07-06

# Step 2: Review pending ADRs
/arckit:adr list --status Proposed --since 2026-07-01

# Step 3: Validate pending ADRs
/arckit:adr validate --all --status Proposed --strict

# Step 4: Generate board meeting agenda
/arckit:report generate --type arb-agenda --date 2026-07-06 --output meeting-agenda.md

# Step 5: Update ADR statuses based on decisions
/arckit:adr update --batch --from-meeting arb-2026-07-06
```

**2. Compliance Audit Workflow**:
```bash
# Step 1: Load compliance context
/arckit:context load --strategy compliance-audit --standard enterprise-architecture

# Step 2: Validate all projects
/arckit:validate --all-projects --check compliance --strict

# Step 3: Check ADR compliance
/arckit:adr validate --all --check compliance

# Step 4: Generate compliance report
/arckit:report generate --type compliance --standard enterprise-architecture --output compliance-report.md

# Step 5: Create compliance issues
/arckit:integrate jira:create --type compliance --from-report compliance-report.md
```

**3. Architecture Standards Enforcement**:
```bash
# Step 1: Load standards context
/arckit:context load --strategy standards-enforcement --standards enterprise

# Step 2: Check all projects for standards compliance
/arckit:check standards --all-projects --enterprise --report-violations

# Step 3: Generate standards compliance report
/arckit:report generate --type standards-compliance --output standards-report.md

# Step 4: Create standardization plan
/arckit:plan standardization --from-report standards-report.md --include-timeline
```

## Workflow Automation

### Scheduled Workflows

**1. Schedule Workflow**:
```bash
/arckit:schedule create <workflow-id> [--frequency <frequency>] [--start <start>] [--end <end>] [--parameters <parameters>]
```

Schedules a workflow to run automatically.

**Example**:
```bash
# Schedule daily architecture validation
/arckit:schedule create daily-validation --frequency daily --start "02:00" --parameters "--strict --all-projects"

# Schedule weekly compliance check
/arckit:schedule create weekly-compliance --frequency weekly --start "Monday 03:00" --parameters "--check compliance --enterprise"

# Schedule monthly architecture review
/arckit:schedule create monthly-review --frequency monthly --start "1st 04:00" --parameters "--type architecture-review --output monthly-review.md"
```

**2. List Scheduled Workflows**:
```bash
/arckit:schedule list [--active] [--inactive] [--upcoming]
```

**3. Manage Scheduled Workflows**:
```bash
/arckit:schedule enable <workflow-id>
/arckit:schedule disable <workflow-id>
/arckit:schedule update <workflow-id> [--frequency <frequency>] [--parameters <parameters>]
/arckit:schedule delete <workflow-id>
/arckit:schedule run <workflow-id> [--now]
```

### Trigger-Based Workflows

**1. Create Trigger**:
```bash
/arckit:trigger create <trigger-id> [--event <event>] [--condition <condition>] [--action <action>]
```

Creates a trigger that runs workflows based on events.

**Event Types**:
- `git:commit`: Trigger on git commit
- `git:push`: Trigger on git push
- `git:pr:open`: Trigger on PR open
- `git:pr:merge`: Trigger on PR merge
- `file:change`: Trigger on file change
- `adr:create`: Trigger on ADR creation
- `adr:update`: Trigger on ADR update
- `validation:fail`: Trigger on validation failure
- `schedule`: Trigger on schedule

**Example**:
```bash
# Trigger validation on PR open
/arckit:trigger create pr-validation --event git:pr:open --action "/arckit:validate --scope changes --strict"

# Trigger ADR validation on ADR create
/arckit:trigger create adr-validation --event adr:create --action "/arckit:adr validate --strict"

# Trigger architecture analysis on push to main
/arckit:trigger create main-analysis --event git:push --condition "branch = main" --action "/arckit:analyze architecture --depth 2"
```

**2. List Triggers**:
```bash
/arckit:trigger list [--active] [--inactive]
```

**3. Manage Triggers**:
```bash
/arckit:trigger enable <trigger-id>
/arckit:trigger disable <trigger-id>
/arckit:trigger update <trigger-id> [--event <event>] [--action <action>]
/arckit:trigger delete <trigger-id>
/arckit:trigger test <trigger-id> [--simulate]
```

## Command Chaining and Pipelines

### Command Chaining

ArcKit commands can be chained together to create powerful pipelines:

```bash
# Validate, then analyze, then report
/arckit:validate --strict && /arckit:analyze architecture && /arckit:report generate --type validation

# Load context, validate, create ADR
/arckit:context load --strategy architecture && /arckit:validate --strict && /arckit:adr create --from-validation

# Full architecture review pipeline
/arckit:context load --strategy full && \
/arckit:validate --strict && \
/arckit:analyze architecture --focus all && \
/arckit:analyze dependencies --check-circular && \
/arckit:report generate --type architecture-review --output review.md
```

### Command Output Redirection

```bash
# Save command output to file
/arckit:validate --strict > validation-results.txt

# Pipe command output to another command
/arckit:adr list --status Proposed | /arckit:adr validate --from-stdin

# Use command output as input to another command
/arckit:analyze dependencies --check-vulnerabilities --format json > deps.json
/arckit:report generate --type dependencies --input deps.json
```

### Conditional Execution

```bash
# Only run analysis if validation passes
/arckit:validate --scope changes --quiet && /arckit:analyze impact --scope changes

# Run different commands based on validation result
if /arckit:validate --scope changes --quiet; then
  /arckit:analyze impact --scope changes
else
  /arckit:report generate --type validation-failure
fi
```

## Best Practices for Claude-Specific Commands

### 1. Command Organization

- **Use Meaningful Names**: Create custom commands with descriptive names
- **Group Related Commands**: Organize commands into logical groups
- **Consistent Naming**: Follow consistent naming conventions
- **Document Commands**: Add descriptions and examples to custom commands

### 2. Command Usage

- **Start Simple**: Begin with basic commands and build complexity gradually
- **Use Help**: Leverage the help system for command discovery and usage
- **Check Validation**: Always validate your architecture before making changes
- **Use Context Wisely**: Load appropriate context for each operation
- **Leverage Integration**: Use integrations to streamline workflows

### 3. Performance Optimization

- **Cache Results**: Use caching for frequently run analyses
- **Limit Scope**: Focus commands on relevant scopes to improve performance
- **Batch Operations**: Use batch commands for large-scale operations
- **Schedule Heavy Operations**: Run resource-intensive operations during off-peak hours

### 4. Team Collaboration

- **Standardize Commands**: Establish command standards across teams
- **Share Custom Commands**: Share useful custom commands across the organization
- **Document Workflows**: Document common workflows and best practices
- **Train Team Members**: Provide training on Claude-specific ArcKit commands

### 5. Security and Compliance

- **Audit Commands**: Regularly audit custom commands for security
- **Validate Inputs**: Always validate inputs to commands
- **Limit Permissions**: Restrict sensitive commands to authorized users
- **Monitor Usage**: Monitor command usage for compliance and optimization

## Troubleshooting and Debugging

### Common Issues

**1. Command Not Found**:
```bash
/arckit:help
# Check if the command exists

/arckit:command list
# List all available commands
```

**2. Invalid Arguments**:
```bash
/arckit:help <command>
# Get help for specific command

/arckit:<command> --help
# Show command usage
```

**3. Context Issues**:
```bash
/arckit:context info
# Check current context

/arckit:context clear
# Clear and reload context
```

**4. Configuration Issues**:
```bash
/arckit:config status
# Check configuration status

/arckit:config validate
# Validate configuration
```

### Debug Commands

**1. Debug Mode**:
```bash
/arckit:debug on
/arckit:debug off
```

Enables/disables debug mode for detailed logging.

**2. Debug Log**:
```bash
/arckit:debug log [--level <level>] [--output <file>]
```

Views and manages debug logs.

**3. Debug Command**:
```bash
/arckit:debug command <command> [arguments]
```

Runs a command in debug mode with detailed output.

**4. Profile Command**:
```bash
/arckit:debug profile <command> [arguments]
```

Profiles a command to identify performance bottlenecks.

### Error Handling

**1. Error Information**:
```bash
/arckit:error info <error-code>
```

Get detailed information about an error code.

**2. Error Log**:
```bash
/arckit:error log [--recent] [--all] [--clear]
```

View and manage error logs.

**3. Recovery Commands**:
```bash
# Recover from context errors
/arckit:context recover

# Recover from configuration errors
/arckit:config recover

# Reset plugin state
/arckit:reset [--soft] [--hard]
```

## Command Reference

### Complete Command Reference

For a complete list of all available commands and their options, use:

```bash
/arckit:help --all
/arckit:help --detailed
```

Or refer to the [ArcKit Claude Plugin Documentation](https://docs.arckit.dev/plugins/claude).

### Command Categories Overview

| Category | Commands | Purpose |
|----------|----------|---------|
| **Core** | status, health, version, help | Essential plugin operations |
| **ADR** | create, list, view, update, search, validate, deprecate, supersede, link, impact | Architecture Decision Record management |
| **Validation** | validate, quick, report, rules | Architecture validation |
| **Analysis** | architecture, dependencies, complexity, patterns, security, performance, cost | Code and architecture analysis |
| **Context** | load, info, clear, discover, compare, add, remove, export, import | Context management |
| **Reporting** | generate, template, create, run, schedule | Report generation and management |
| **Configuration** | status, set, get, list, remove, reset, validate, diff | Configuration management |
| **Integration** | list, configure, test, jira, github, slack, etc. | Third-party integrations |
| **Advanced** | batch, interactive, schedule, trigger, command, alias | Advanced workflows and customization |
| **Debug** | on, off, log, command, profile, error | Debugging and troubleshooting |

## Conclusion

Claude-specific ArcKit commands and workflows provide a powerful, flexible foundation for enterprise architecture governance. By leveraging Claude's unique capabilities—particularly its large context window and advanced reasoning—the ArcKit plugin transforms architecture governance from a manual, time-consuming process into an intelligent, automated system.

The commands and workflows outlined in this chapter represent the core functionality available in the ArcKit Claude plugin. However, the true power lies in how you combine and customize these commands to fit your organization's specific needs, workflows, and architectural challenges.

**Key Takeaways**:

1. **Start with the Basics**: Master the core commands for ADR management, validation, and analysis before moving to advanced features.

2. **Leverage Context**: Use Claude's large context window to its full potential by carefully selecting and organizing the files and information you load.

3. **Automate Workflows**: Implement scheduled and trigger-based workflows to ensure consistent, repeatable architecture governance.

4. **Customize for Your Needs**: Create custom commands, aliases, and workflows that match your organization's specific requirements.

5. **Collaborate Effectively**: Use ArcKit's team and integration features to facilitate collaboration across your organization.

6. **Continuously Improve**: Regularly review and refine your command usage, workflows, and configurations to optimize your architecture governance processes.

The combination of ArcKit's comprehensive architecture governance capabilities and Claude's advanced AI reasoning creates a powerful synergy that can significantly improve your organization's software development practices. By implementing the commands and workflows described in this chapter, you'll be well-equipped to maintain architectural consistency, quality, and governance across your entire enterprise.

In the next section, we'll explore how to integrate ArcKit with Claude's Project and Memory features to create an even more powerful and personalized architecture governance experience.
