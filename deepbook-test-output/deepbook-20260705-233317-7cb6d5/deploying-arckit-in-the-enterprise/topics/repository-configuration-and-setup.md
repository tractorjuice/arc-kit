# Repository Configuration and Setup

## Introduction

Deploying ArcKit in GitHub Copilot environments presents unique opportunities and challenges. Unlike traditional IDE plugins, Copilot operates at the repository level, providing AI assistance directly within the GitHub ecosystem. This chapter covers comprehensive repository configuration and setup strategies for ArcKit in GitHub Copilot deployments, enabling enterprise-grade architecture governance across your GitHub organization.

## Understanding GitHub Copilot's Architecture Governance Capabilities

### Copilot's Role in Development

GitHub Copilot functions as an AI pair programmer that:

- **Generates Code**: Provides real-time code suggestions and completions
- **Answers Questions**: Responds to natural language queries about code and architecture
- **Explains Code**: Provides explanations of existing code and patterns
- **Assists with Workflows**: Helps with development tasks and processes

For ArcKit integration, Copilot's strengths include:
- Deep understanding of code context within repositories
- Natural language interface for architecture queries
- Integration with GitHub's native features (PRs, issues, discussions)
- Access to repository metadata and history

### Copilot Limitations for Architecture Governance

While Copilot is powerful, it has limitations that ArcKit addresses:

1. **No Persistent Memory**: Copilot doesn't remember architectural decisions across conversations
2. **Limited Context Window**: While large, context is still bounded by conversation length
3. **No Structured Decision Tracking**: No built-in Architecture Decision Record (ADR) management
4. **Limited Validation**: No automated architecture validation and enforcement
5. **No Cross-Repository Intelligence**: Limited knowledge sharing across repositories

This is where ArcKit integration becomes essential.

## Repository Setup Strategies

### Strategy 1: Centralized ArcKit Configuration Repository

**Overview**: Maintain a dedicated repository for ArcKit configurations, rules, and standards that all other repositories reference.

**Implementation**:

1. **Create Configuration Repository**:
```bash
# Create new repository
gh repo create arckit-config --public --clone
cd arckit-config

# Initialize ArcKit configuration
arckit init --template enterprise-config
```

2. **Repository Structure**:
```
arckit-config/
├── .github/
│   ├── workflows/
│   │   ├── arckit-validation.yml
│   │   ├── arckit-advance-check.yml
│   │   └── arckit-reporting.yml
├── configurations/
│   ├── enterprise-standards.json
│   ├── security-rules.json
│   ├── naming-conventions.json
│   └── validation-rules.json
├── templates/
│   ├── ADR-template.md
│   ├── architecture-review-template.md
│   └── validation-report-template.md
├── scripts/
│   ├── validate-all.sh
│   ├── generate-reports.sh
│   └── sync-configurations.sh
├── docs/
│   ├── architecture-governance.md
│   ├── setup-guide.md
│   └── best-practices.md
└── README.md
```

3. **Configuration Files**:

**.github/arckit-config.yml**:
```yaml
# ArcKit configuration for GitHub organization
version: "4.20.1"

# Organization settings
organization:
  name: "Enterprise Inc"
  id: "enterprise-org"
  default_branch: "main"
  
# ArcKit settings
arckit:
  enabled: true
  
  # Default configurations for all repositories
  defaults:
    validate_on_pr: true
    validate_on_push: true
    adr_required: true
    peer_review_required: true
    
  # Repository-specific overrides
  repositories:
    enterprise-api:
      environment: "production"
      strict_mode: true
      
    enterprise-web:
      environment: "production"
      strict_mode: true
      
    experimental-service:
      environment: "development"
      strict_mode: false
      auto_approve:
        - "documentation"
        - "tests"

# GitHub integration settings
github:
  app_id: "${{ secrets.ARCKIT_APP_ID }}"
  app_installation_id: "${{ secrets.ARCKIT_APP_INSTALLATION_ID }}"
  private_key: "${{ secrets.ARCKIT_APP_PRIVATE_KEY }}"
  webhook_secret: "${{ secrets.ARCKIT_WEBHOOK_SECRET }}"
```

**configurations/enterprise-standards.json**:
```json
{
  "standards": {
    "architecture": {
      "required_patterns": [
        "Repository Pattern",
        "Factory Pattern", 
        "Dependency Injection",
        "Event-Driven Architecture"
      ],
      "forbidden_patterns": [
        "God Object",
        "Singleton Abuse",
        "Circular Dependencies",
        "Tight Coupling"
      ],
      "complexity_limits": {
        "cyclomatic": 10,
        "cognitive": 15,
        "file_length": 500,
        "function_length": 50
      }
    },
    "naming": {
      "conventions": {
        "classes": "PascalCase",
        "functions": "camelCase",
        "variables": "camelCase",
        "constants": "UPPER_SNAKE_CASE",
        "files": "kebab-case",
        "directories": "kebab-case"
      },
      "prefixes": {
        "interfaces": "I",
        "abstract_classes": "Abstract",
        "tests": "describe",
        "mocks": "Mock"
      }
    },
    "documentation": {
      "required": [
        "README.md",
        "ARCHITECTURE.md",
        "CONTRIBUTING.md"
      ],
      "adr_directory": ".arckit/ADR",
      "adr_template": "templates/ADR-template.md"
    }
  },
  
  "compliance": {
    "required_checks": [
      "architecture-validation",
      "adr-completeness",
      "dependency-security",
      "code-quality"
    ],
    "blocking_checks": [
      "security-vulnerabilities",
      "license-compliance"
    ]
  }
}
```

### Strategy 2: Per-Repository Configuration

**Overview**: Each repository maintains its own ArcKit configuration tailored to its specific needs.

**Implementation**:

1. **Repository Setup Script**:
```bash
#!/bin/bash
# setup-arckit.sh - Setup ArcKit in a repository

REPO_NAME=$(basename $(git rev-parse --show-toplevel))
ORG_NAME=$(git remote get-url origin | sed 's/.*github.com\///' | sed 's/\/.*//')

echo "Setting up ArcKit for $ORG_NAME/$REPO_NAME"

# Create .arckit directory
mkdir -p .arckit/{ADR,templates,configurations,scripts}

# Initialize ArcKit
arckit init --name "$REPO_NAME" --organization "$ORG_NAME"

# Create ADR directory structure
mkdir -p .arckit/ADR/{accepted,proposed,rejected,deprecated,superseded}

# Copy templates from central config repo
git clone --depth 1 git@github.com:$ORG_NAME/arckit-config.git /tmp/arckit-config
cp /tmp/arckit-config/templates/* .arckit/templates/
cp /tmp/arckit-config/configurations/enterprise-standards.json .arckit/configurations/
rm -rf /tmp/arckit-config

# Create repository-specific configuration
cat > .arckit/config.json << EOF
{
  "repository": {
    "name": "$REPO_NAME",
    "organization": "$ORG_NAME",
    "environment": "development",
    "type": "$(get_repo_type)"
  },
  "arckit": {
    "version": "4.20.1",
    "initialized": "$(date -Iseconds)",
    "settings": {
      "validateOnPR": true,
      "validateOnPush": true,
      "adrRequired": true,
      "strictMode": false
    }
  }
}
EOF

# Create GitHub workflows
mkdir -p .github/workflows
cp /path/to/templates/arckit-validation.yml .github/workflows/

# Commit initial setup
git add .arckit/ .github/workflows/arckit-validation.yml
https://github.com/enterprise-org/arckit-config.gitgit commit -m "feat: initialize ArcKit configuration"
git push origin main

echo "ArcKit setup complete for $REPO_NAME"
```

2. **Repository Configuration**:

**.arckit/config.json**:
```json
{
  "repository": {
    "name": "enterprise-api",
    "organization": "enterprise-org",
    "description": "Main enterprise API service",
    "version": "2.3.1",
    "environment": "production",
    "type": "microservice",
    "language": "TypeScript",
    "framework": "Express.js",
    "team": "platform-engineering",
    "business_domain": "core-services"
  },
  
  "arckit": {
    "version": "4.20.1",
    "initialized": "2026-07-05T23:45:00Z",
    "last_updated": "2026-07-05T23:45:00Z",
    "settings": {
      "validateOnPR": true,
      "validateOnPush": true,
      "validateOnSchedule": ["0 2 * * *"],
      "adrRequired": true,
      "adrAutoNumber": true,
      "peerReviewRequired": true,
      "securityReviewRequired": true,
      "strictMode": true,
      "autoApprove": ["documentation", "tests", "dependencies"],
      "maxContextLength": 32000,
      "validateDependencies": true,
      "checkVulnerabilities": true,
      "enforceNamingConventions": true,
      "checkCrossReferences": true,
      "generateReports": true
    },
    "integrations": {
      "github": {
        "enabled": true,
        "checks": true,
        "comments": true,
        "status": true,
        "labels": true
      },
      "jira": {
        "enabled": true,
        "projectKey": "PLAT",
        "linkADRs": true
      },
      "slack": {
        "enabled": true,
        "channel": "#platform-architecture",
        "notifications": ["adr-created", "validation-failed"]
      }
    }
  },
  
  "rules": {
    "enabled": [
      "ARC-001",
      "ARC-002",
      "ARC-003",
      "SEC-001",
      "SEC-002"
    ],
    "disabled": [],
    "custom": [
      "ORG-001-Enterprise-Specific-Rule"
    ]
  },
  
  "policies": {
    "branch_protection": {
      "main": {
        "require_validation": true,
        "require_adr": true,
        "require_review": 2,
        "require_status_checks": true
      },
      "develop": {
        "require_validation": true,
        "require_adr": false,
        "require_review": 1
      }
    },
    "pr_requirements": {
      "require_adr_reference": true,
      "require_validation_pass": true,
      "require_architecture_review": true
    }
  }
}
```

### Strategy 3: Hybrid Configuration Approach

**Overview**: Combine centralized configuration with repository-specific overrides.

**Implementation**:

1. **Configuration Inheritance**:
```yaml
# .github/arckit-config.yml
arckit:
  # Inherit from central configuration
  extends: enterprise-org/arckit-config@main
  
  # Repository-specific overrides
  overrides:
    environment: "production"
    strict_mode: true
    custom_rules:
      - "REPO-001-Specific-Rule"
    
  # Repository-specific settings
  repository:
    name: "enterprise-api"
    type: "microservice"
    team: "platform-engineering"
    business_critical: true
```

2. **Configuration Sync Script**:
```bash
#!/bin/bash
# sync-arckit-config.sh - Sync ArcKit configurations from central repo

CENTRAL_REPO="enterprise-org/arckit-config"
CURRENT_REPO=$(git remote get-url origin | sed 's/.*github.com\///' | sed 's/\.git$//')

echo "Syncing ArcKit configuration for $CURRENT_REPO"

# Clone or update central config repo
git clone --depth 1 git@github.com:$CENTRAL_REPO.git /tmp/arckit-central || \
  (cd /tmp/arckit-central && git pull origin main)

# Copy updated configurations
cp /tmp/arckit-central/configurations/* .arckit/configurations/
cp /tmp/arckit-central/templates/* .arckit/templates/

# Validate configuration
arckit config validate

# Check for differences
echo "Configuration differences:"
git diff .arckit/

# Prompt for commit if there are changes
if [ -n "$(git diff .arckit/)" ]; then
  read -p "Commit configuration changes? [y/N]: " COMMIT
  if [ "$COMMIT" = "y" ] || [ "$COMMIT" = "Y" ]; then
    git add .arckit/
    git commit -m "chore: sync ArcKit configurations from central repo"
    git push origin main
  fi
fi

# Clean up
rm -rf /tmp/arckit-central

echo "Configuration sync complete"
```

## GitHub Integration Configuration

### GitHub App Setup for ArcKit

**Step 1: Create GitHub App**:

1. Go to GitHub Organization Settings > Developer settings > GitHub Apps
2. Click "New GitHub App"
3. Configure App:
   - **GitHub App name**: ArcKit Governance
   - **Homepage URL**: https://arckit.dev
   - **Callback URL**: https://arckit.dev/auth/github/callback
   - **Webhook URL**: https://arckit.dev/webhooks/github
   - **Webhook Secret**: Generate and store securely

4. **Permissions**:
   - Repository permissions:
     - **Contents**: Read and write
     - **Pull requests**: Read and write
     - **Issues**: Read and write
     - **Discussions**: Read and write
     - **Commit statuses**: Read and write
     - **Metadata**: Read-only
   - Organization permissions:
     - **Members**: Read-only (for team assignments)
     - **Administration**: Read-only

5. **Subscribe to events**:
   - Pull request
   - Push
   - Issue comment
   - Commit comment
   - Discussion
   - Discussion comment

**Step 2: Install App in Organization**:

1. After creating the app, install it in your organization
2. Select all repositories or specific repositories
3. Configure repository permissions

**Step 3: Store App Credentials**:

Store these secrets in your organization's secrets manager:
```bash
# GitHub App credentials
ARCKIT_APP_ID: "123456"
ARCKIT_APP_INSTALLATION_ID: "7890123"
ARCKIT_APP_PRIVATE_KEY: "-----BEGIN RSA PRIVATE KEY-----\n..."
ARCKIT_WEBHOOK_SECRET: "webhook-secret-12345"
```

### GitHub Actions Workflows

**1. ArcKit Validation Workflow**:

**.github/workflows/arckit-validation.yml**:
```yaml
name: ArcKit Validation

on:
  pull_request:
    types: [opened, synchronize, reopened, ready_for_review]
  push:
    branches: [main, develop]
  workflow_dispatch:
    inputs:
      ref:
        description: 'Branch or tag to validate'
        required: false
        default: ''
  schedule:
    - cron: '0 2 * * *'  # Daily at 2 AM

jobs:
  validate:
    name: ArcKit Validation
    runs-on: ubuntu-latest
    
    permissions:
      contents: read
      pull-requests: write
      commit-statuses: write
    
    steps:
    - name: Checkout repository
      uses: actions/checkout@v4
      with:
        fetch-depth: 0  # Fetch full history for accurate analysis
        
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '18'
        
    - name: Install ArcKit CLI
      run: npm install -g @arckit/cli
      
    - name: Configure ArcKit
      run: |
        mkdir -p ~/.arckit
        echo '${{ secrets.ARCKIT_CONFIG }}' > ~/.arckit/config.json
        
    - name: Run ArcKit Validation
      id: validation
      run: |
        # Determine what to validate
        if [ "${{ github.event_name }}" = "pull_request" ]; then
          # Validate PR changes
          arckit validate --scope changes --strict --format json > validation-results.json
          
          # Check if validation passed
          VALIDATION_PASSED=$(jq '.passed' validation-results.json)
          echo "validation_passed=$VALIDATION_PASSED" >> $GITHUB_OUTPUT
          
        elif [ "${{ github.event_name }}" = "push" ]; then
          # Validate entire repository
          arckit validate --scope all --strict --format json > validation-results.json
          
          VALIDATION_PASSED=$(jq '.passed' validation-results.json)
          echo "validation_passed=$VALIDATION_PASSED" >> $GITHUB_OUTPUT
          
        else
          # Scheduled validation
          arckit validate --scope all --strict --format json > validation-results.json
          
          VALIDATION_PASSED=$(jq '.passed' validation-results.json)
          echo "validation_passed=$VALIDATION_PASSED" >> $GITHUB_OUTPUT
        fi
        
        # Save detailed results
        cat validation-results.json
        
      continue-on-error: true
      
    - name: Upload Validation Results
      uses: actions/upload-artifact@v3
      with:
        name: arckit-validation-results
        path: validation-results.json
        
    - name: Post Validation Results to PR
      if: github.event_name == 'pull_request' && always()
      run: |
        # Parse validation results
        TOTAL_ISSUES=$(jq '.issues | length' validation-results.json)
        ERROR_COUNT=$(jq '.issues | map(select(.severity == "error")) | length' validation-results.json)
        WARNING_COUNT=$(jq '.issues | map(select(.severity == "warning")) | length' validation-results.json)
        
        # Create comment
        COMMENT="## ArcKit Validation Results

"
        COMMENT+="| Result | Count |\n"
        COMMENT+="|--------|-------|\n"
        COMMENT+="| Errors | $ERROR_COUNT |\n"
        COMMENT+="| Warnings | $WARNING_COUNT |\n"
        COMMENT+="| Total | $TOTAL_ISSUES |\n\n"
        
        if [ "${{ steps.validation.outputs.validation_passed }}" = "true" ]; then
          COMMENT+="✅ **Validation Passed**\n\n"
        else
          COMMENT+="❌ **Validation Failed**\n\n"
        fi
        
        # Add issues summary
        COMMENT+="### Issues Found\n\n"
        
        # Add errors
        if [ $ERROR_COUNT -gt 0 ]; then
          COMMENT+="**Errors:**\n"
          jq -r '.issues | map(select(.severity == "error")) | .[] | "- \(." validation-results.json | while read -r line; do
            COMMENT+="$line\n"
          done
          COMMENT+="\n"
        fi
        
        # Add warnings
        if [ $WARNING_COUNT -gt 0 ]; then
          COMMENT+="**Warnings:**\n"
          jq -r '.issues | map(select(.severity == "warning")) | .[] | "- \(." validation-results.json | while read -r line; do
            COMMENT+="$line\n"
          done
          COMMENT+="\n"
        fi
        
        # Post comment
        gh pr comment ${{ github.event.pull_request.number }} --body "$COMMENT"
        
      env:
        GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        
    - name: Set Commit Status
      if: github.event_name != 'pull_request'
      run: |
        if [ "${{ steps.validation.outputs.validation_passed }}" = "true" ]; then
          STATUS="success"
          DESCRIPTION="ArcKit validation passed"
        else
          STATUS="failure"
          DESCRIPTION="ArcKit validation failed"
        fi
        
        # Get commit SHA
        if [ "${{ github.event_name }}" = "push" ]; then
          SHA="${{ github.sha }}"
        else
          SHA="${{ github.event.pull_request.head.sha }}"
        fi
        
        # Create status
        curl -X POST \
          -H "Authorization: token ${{ secrets.GITHUB_TOKEN }}" \
          -H "Accept: application/vnd.github.v3+json" \
          -d "{\"state\": \"$STATUS\", \"description\": \"$DESCRIPTION\", \"context\": \"arckit/validation\"}" \
          "https://api.github.com/repos/${{ github.repository }}/statuses/$SHA"
```

**2. ADR Management Workflow**:

**.github/workflows/arckit-adr.yml**:
```yaml
name: ArcKit ADR Management

on:
  push:
    paths:
      - '.arckit/ADR/**'
      - '.arckit/ADR/**/*'
  workflow_dispatch:
    inputs:
      adr_path:
        description: 'Path to ADR file'
        required: false
      action:
        description: 'Action to perform (validate, link, notify)'
        required: false

jobs:
  process-adr:
    name: Process ADR
    runs-on: ubuntu-latest
    
    permissions:
      contents: read
      pull-requests: write
      issues: write
    
    steps:
    - name: Checkout repository
      uses: actions/checkout@v4
      
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '18'
        
    - name: Install ArcKit CLI
      run: npm install -g @arckit/cli
      
    - name: Validate ADRs
      run: |
        # Find changed ADR files
        if [ "${{ github.event_name }}" = "push" ]; then
          CHANGED_FILES=$(git diff --name-only ${{ github.event.before }} ${{ github.sha }} | grep '.arckit/ADR/')
        else
          CHANGED_FILES=$(find .arckit/ADR -name "*.md" -type f)
        fi
        
        echo "Processing ADR files: $CHANGED_FILES"
        
        # Validate each changed ADR
        for file in $CHANGED_FILES; do
          echo "Validating $file"
          arckit adr validate "$file" --strict --format json > "${file%.md}-validation.json"
          
          # Check validation result
          VALID=$(jq '.valid' "${file%.md}-validation.json")
          if [ "$VALID" = "false" ]; then
            echo "❌ ADR validation failed: $file"
            # Extract issues
            ISSUES=$(jq '.issues' "${file%.md}-validation.json")
            echo "Issues: $ISSUES"
          else
            echo "✅ ADR validation passed: $file"
          fi
        done
        
    - name: Link ADRs to Issues
      if: inputs.action == 'link' || github.event_name == 'push'
      run: |
        # Find ADRs that reference issues
        ADR_FILES=$(find .arckit/ADR -name "*.md" -type f)
        
        for file in $ADR_FILES; do
          # Extract issue references from ADR
          ISSUES=$(grep -oP ' #[A-Z]+-\d+' "$file" | tr -d ' ') 
          
          for issue in $ISSUES; do
            echo "Linking ADR $file to issue $issue"
            # Use GitHub API to link ADR to issue
            # This would require additional implementation
          done
        done
        
    - name: Notify Stakeholders
      if: inputs.action == 'notify' || github.event_name == 'push'
      run: |
        # Find newly created ADRs
        NEW_ADRS=$(git diff --name-only ${{ github.event.before }} ${{ github.sha }} | grep '.arckit/ADR/' | grep -v 'validation.json')
        
        for adr_file in $NEW_ADRS; do
          # Extract ADR ID from filename
          ADR_ID=$(basename "$adr_file" | grep -oP 'ADR-\d+')
          
          # Get ADR details
          TITLE=$(grep '^# ' "$adr_file" | sed 's/# //')
          STATUS=$(grep -oP '^Status: \K.*' "$adr_file")
          DECIDERS=$(grep -oP '^Deciders: \K.*' "$adr_file")
          
          echo "New ADR detected: $ADR_ID - $TITLE"
          echo "Status: $STATUS"
          echo "Deciders: $DECIDERS"
          
          # Here you would send notifications to stakeholders
          # Implementation would depend on your notification system
          
        done
```

**3. Scheduled Architecture Review Workflow**:

**.github/workflows/arckit-review.yml**:
```yaml
name: ArcKit Architecture Review

on:
  schedule:
    - cron: '0 3 * * 1'  # Every Monday at 3 AM
  workflow_dispatch:
    inputs:
      scope:
        description: 'Scope of review (all, specific)'
        required: false
        default: 'all'
      focus:
        description: 'Focus area (architecture, security, performance)'
        required: false

jobs:
  architecture-review:
    name: Architecture Review
    runs-on: ubuntu-latest
    
    permissions:
      contents: read
      issues: write
      pull-requests: read
    
    steps:
    - name: Checkout repository
      uses: actions/checkout@v4
      with:
        fetch-depth: 0
        
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '18'
        
    - name: Install ArcKit CLI
      run: npm install -g @arckit/cli
      
    - name: Run Architecture Analysis
      run: |
        # Run comprehensive analysis
        arckit analyze architecture --format json > architecture-analysis.json
        arckit analyze dependencies --format json > dependencies-analysis.json
        arckit analyze complexity --format json > complexity-analysis.json
        
        # Check for architecture debt
        arckit analyze debt --type architecture --format json > architecture-debt.json
        
    - name: Generate Architecture Review Report
      run: |
        # Create markdown report
        cat > architecture-review.md << 'EOF'
# Architecture Review Report
*Generated on $(date)*

## Summary

This report provides an overview of the current architecture state and identifies areas for improvement.

## Architecture Analysis

### Patterns
EOF
        
        # Add patterns analysis
        jq -r '.patterns | to_entries[] | "### \(.key)" + "\n" + .value.description + "\n" + "- **Count**: " + (.value.count | tostring) + "\n" + "- **Status**: " + (.value.status // "unknown") + "\n\n"' architecture-analysis.json >> architecture-review.md
        
        cat >> architecture-review.md << 'EOF'

### Dependencies
EOF
        
        # Add dependencies analysis
        jq -r '.dependencies | to_entries[] | "#### \(.key)" + "\n" + "- **Count**: " + (.value.count | tostring) + "\n" + "- **Issues**: " + (.value.issues | join(", ")) + "\n\n"' dependencies-analysis.json >> architecture-review.md
        
        cat >> architecture-review.md << 'EOF'

## Architecture Debt

### High Priority
EOF
        
        # Add high priority debt
        jq -r '.debt | map(select(.priority == "high")) | .[] | "- [ ] " + .description + " (Impact: " + .impact + ")\n"' architecture-debt.json >> architecture-review.md
        
        cat >> architecture-review.md << 'EOF'

### Medium Priority
EOF
        
        # Add medium priority debt
        jq -r '.debt | map(select(.priority == "medium")) | .[] | "- [ ] " + .description + " (Impact: " + .impact + ")\n"' architecture-debt.json >> architecture-review.md
        
        cat >> architecture-review.md << 'EOF'

## Recommendations

### Immediate Actions
1. Address high priority architecture debt items
2. Review and update outdated dependencies
3. Validate compliance with enterprise standards

### Long-term Improvements
1. Implement identified architectural patterns
2. Reduce complexity in high-complexity modules
3. Establish regular architecture review process

---
*Report generated by ArcKit v4.20.1*
EOF
        
        # Save report
        cp architecture-review.md architecture-review-$(date +%Y%m%d).md
        
    - name: Create GitHub Issue for Review
      run: |
        # Create issue with review findings
        TITLE="Architecture Review - $(date +%Y-%m-%d)"
        
        # Count issues
        HIGH_DEBT=$(jq '.debt | map(select(.priority == "high")) | length' architecture-debt.json)
        MEDIUM_DEBT=$(jq '.debt | map(select(.priority == "medium")) | length' architecture-debt.json)
        
        BODY="## Architecture Review Summary

"
        BODY+="| Category | Count |\n"
        BODY+="|----------|-------|\n"
        BODY+="| High Priority Debt | $HIGH_DEBT |\n"
        BODY+="| Medium Priority Debt | $MEDIUM_DEBT |\n\n"
        
        BODY+="**Full Report:** [architecture-review-$(date +%Y%m%d).md](https://github.com/${{ github.repository }}/blob/${{ github.sha }}/architecture-review-$(date +%Y%m%d).md)\n\n"
        
        BODY+="---\n"
        BODY+="*Generated by ArcKit Governance System*"
        
        # Create issue
        gh issue create --title "$TITLE" --body "$BODY" --label "architecture-review","arckit"
        
      env:
        GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        
    - name: Upload Report Artifact
      uses: actions/upload-artifact@v3
      with:
        name: architecture-review-report
        path: |
          architecture-review-*.md
          *.json
```

## Repository-Specific Configuration Examples

### Enterprise API Repository

**.arckit/config.json**:
```json
{
  "repository": {
    "name": "enterprise-api",
    "organization": "enterprise-org",
    "description": "Main enterprise API service handling core business logic",
    "version": "2.3.1",
    "environment": "production",
    "type": "microservice",
    "language": "TypeScript",
    "framework": "Express.js",
    "database": "PostgreSQL",
    "team": "platform-engineering",
    "business_domain": "core-services",
    "criticality": "high",
    "dependencies": [
      "enterprise-auth",
      "enterprise-data",
      "enterprise-common"
    ]
  },
  
  "arckit": {
    "version": "4.20.1",
    "settings": {
      "validateOnPR": true,
      "validateOnPush": true,
      "validateOnSchedule": ["0 3 * * *"],
      "adrRequired": true,
      "adrAutoNumber": true,
      "peerReviewRequired": true,
      "securityReviewRequired": true,
      "strictMode": true,
      "autoApprove": ["documentation", "tests", "dependency-updates"],
      "maxContextLength": 40000,
      "validateDependencies": true,
      "checkVulnerabilities": true,
      "enforceNamingConventions": true,
      "checkCrossReferences": true,
      "generateReports": true,
      "reportFormat": "markdown"
    }
  },
  
  "integrations": {
    "github": {
      "enabled": true,
      "checks": true,
      "comments": true,
      "status": true,
      "labels": true,
      "issue_creation": true
    },
    "jira": {
      "enabled": true,
      "projectKey": "PLAT",
      "linkADRs": true,
      "syncStatus": true
    },
    "slack": {
      "enabled": true,
      "channel": "#platform-architecture",
      "notifications": [
        "adr-created",
        "validation-failed",
        "high-debt-identified",
        "security-issue-found"
      ]
    },
    "datadog": {
      "enabled": true,
      "metrics": [
        "validation-pass-rate",
        "adr-creation-rate",
        "architecture-debt"
      ]
    }
  },
  
  "policies": {
    "branch_protection": {
      "main": {
        "require_validation": true,
        "require_adr": true,
        "require_review": 2,
        "require_status_checks": true,
        "require_linear_history": true
      },
      "develop": {
        "require_validation": true,
        "require_adr": false,
        "require_review": 1
      },
      "feature/*": {
        "require_validation": true,
        "require_adr": false,
        "require_review": 1
      }
    },
    "pr_requirements": {
      "require_adr_reference": true,
      "require_validation_pass": true,
      "require_architecture_review": true,
      "require_security_scan": true,
      "require_size_limit": 500
    },
    "commit_requirements": {
      "require_message_format": true,
      "message_pattern": "^(feat|fix|docs|style|refactor|perf|test|chore|revert)(!)?: .+",
      "require_signing": true
    }
  },
  
  "rules": {
    "enabled": [
      "ARC-001-Architecture-Patterns",
      "ARC-002-Layer-Separation",
      "ARC-003-Dependency-Management",
      "SEC-001-Authentication-Required",
      "SEC-002-Input-Validation",
      "SEC-003-Error-Handling",
      "NAM-001-Naming-Conventions",
      "NAM-002-File-Organization",
      "DOC-001-Documentation-Required",
      "DOC-002-Code-Comments"
    ],
    "custom": [
      "ORG-001-Enterprise-Specific-Auth",
      "ORG-002-Service-Boundary-Rules",
      "ORG-003-Database-Access-Patterns"
    ]
  }
}
```

### Enterprise Web Repository

**.arckit/config.json**:
```json
{
  "repository": {
    "name": "enterprise-web",
    "organization": "enterprise-org",
    "description": "Enterprise web application providing user interfaces",
    "version": "3.2.0",
    "environment": "production",
    "type": "frontend",
    "language": "TypeScript",
    "framework": "React",
    "ui_framework": "Material-UI",
    "team": "frontend-engineering",
    "business_domain": "user-experience",
    "criticality": "high",
    "dependencies": [
      "enterprise-api",
      "enterprise-auth",
      "design-system"
    ]
  },
  
  "arckit": {
    "version": "4.20.1",
    "settings": {
      "validateOnPR": true,
      "validateOnPush": true,
      "validateOnSchedule": ["0 4 * * *"],
      "adrRequired": true,
      "adrAutoNumber": true,
      "peerReviewRequired": true,
      "designReviewRequired": true,
      "strictMode": true,
      "autoApprove": ["documentation", "styles", "component-refactoring"],
      "maxContextLength": 35000,
      "validateDependencies": true,
      "checkVulnerabilities": true,
      "enforceNamingConventions": true,
      "checkCrossReferences": true,
      "generateReports": true,
      "accessibilityChecks": true
    }
  },
  
  "integrations": {
    "github": {
      "enabled": true,
      "checks": true,
      "comments": true,
      "status": true,
      "labels": true
    },
    "figma": {
      "enabled": true,
      "link_components": true
    },
    "storybook": {
      "enabled": true,
      "auto_generate": true
    }
  },
  
  "policies": {
    "branch_protection": {
      "main": {
        "require_validation": true,
        "require_adr": true,
        "require_review": 2,
        "require_status_checks": true
      },
      "develop": {
        "require_validation": true,
        "require_adr": false,
        "require_review": 1
      }
    },
    "pr_requirements": {
      "require_adr_reference": true,
      "require_validation_pass": true,
      "require_design_review": true,
      "require_visual_regression_tests": true
    }
  },
  
  "rules": {
    "enabled": [
      "ARC-001-Architecture-Patterns",
      "ARC-004-Component-Design",
      "ARC-005-State-Management",
      "SEC-001-Authentication-Required",
      "SEC-004-Frontend-Security",
      "NAM-001-Naming-Conventions",
      "NAM-003-Component-Naming",
      "ACC-001-Accessibility-Standards",
      "DOC-001-Documentation-Required",
      "DOC-003-Component-Documentation"
    ]
  }
}
```

### Experimental Service Repository

**.arckit/config.json**:
```json
{
  "repository": {
    "name": "experimental-service",
    "organization": "enterprise-org",
    "description": "Experimental service for testing new technologies",
    "version": "0.1.0",
    "environment": "development",
    "type": "experimental",
    "language": "Rust",
    "framework": "Actix Web",
    "team": "innovation-lab",
    "business_domain": "research",
    "criticality": "low",
    "experimental": true
  },
  
  "arckit": {
    "version": "4.20.1",
    "settings": {
      "validateOnPR": true,
      "validateOnPush": false,
      "validateOnSchedule": ["0 5 * * 1"],  # Weekly
      "adrRequired": false,
      "adrAutoNumber": true,
      "peerReviewRequired": false,
      "strictMode": false,
      "autoApprove": ["*"],  # Auto-approve all for experimental
      "maxContextLength": 25000,
      "validateDependencies": true,
      "checkVulnerabilities": true,
      "enforceNamingConventions": false,
      "checkCrossReferences": true,
      "generateReports": false,
      "learningMode": true
    }
  },
  
  "policies": {
    "branch_protection": {
      "main": {
        "require_validation": true,
        "require_adr": false,
        "require_review": 1
      }
    },
    "pr_requirements": {
      "require_validation_pass": false,
      "require_architecture_review": false
    }
  },
  
  "rules": {
    "enabled": [
      "ARC-001-Architecture-Patterns",
      "SEC-001-Authentication-Required",
      "SEC-002-Input-Validation"
    ],
    "disabled": [
      "NAM-001-Naming-Conventions",
      "DOC-001-Documentation-Required"
    ]
  }
}
```

## Configuration Management

### Configuration Inheritance

ArcKit supports configuration inheritance across multiple levels:

```
Configuration Hierarchy:
1. Repository-specific configuration (.arckit/config.json)
2. Organization-wide configuration (from central repo)
3. Team-specific configuration (from team repo)
4. ArcKit defaults
```

**Inheritance Example**:

```json
// Repository config extends organization config
{
  "extends": "enterprise-org/arckit-config@main",
  "repository": {
    "name": "enterprise-api",
    "type": "microservice"
  },
  "overrides": {
    "validateOnPR": true,
    "strictMode": true
  }
}
```

### Configuration Validation

```bash
# Validate current configuration
arckit config validate

# Validate against schema
arckit config validate --schema enterprise

# Check for configuration errors
arckit config check --all-repositories

# Compare configurations across repositories
arckit config compare --repo1 enterprise-api --repo2 enterprise-web
```

### Configuration Synchronization

**1. Central to Repository**:
```bash
# Sync configurations from central repo
arckit config sync --from enterprise-org/arckit-config --to .

# Sync specific configuration files
arckit config sync --from enterprise-org/arckit-config --files rules.json,standards.json

# Force sync (overwrite local changes)
arckit config sync --from enterprise-org/arckit-config --force
```

**2. Repository to Central**:
```bash
# Push local configurations to central repo
arckit config push --to enterprise-org/arckit-config

# Push specific changes
arckit config push --to enterprise-org/arckit-config --files custom-rules.json

# Create pull request for configuration changes
arckit config push --to enterprise-org/arckit-config --create-pr
```

### Configuration Versioning

```bash
# View configuration history
arckit config history

# View configuration at specific commit
arckit config history --commit abc123

# Rollback to previous configuration
arckit config rollback --to abc123

# Compare configuration versions
arckit config diff --version1 abc123 --version2 def456
```

## Environment-Specific Configurations

### Development Environment

**.arckit/environments/dev.json**:
```json
{
  "environment": "development",
  "settings": {
    "strictMode": false,
    "validateOnSave": false,
    "validateOnCommit": true,
    "autoApprove": ["documentation", "tests", "refactoring"],
    "learningMode": true,
    "debugMode": true
  },
  "rules": {
    "enabled": ["ARC-001", "SEC-001"],
    "disabled": ["DOC-001", "NAM-001"]
  },
  "validation": {
    "level": "warning",
    "failOnError": false,
    "failOnWarning": false
  }
}
```

### Staging Environment

**.arckit/environments/staging.json**:
```json
{
  "environment": "staging",
  "settings": {
    "strictMode": true,
    "validateOnSave": true,
    "validateOnCommit": true,
    "validateOnPush": true,
    "autoApprove": ["documentation", "tests"],
    "learningMode": false,
    "debugMode": false
  },
  "rules": {
    "enabled": ["ARC-001", "ARC-002", "SEC-001", "SEC-002"],
    "disabled": ["DOC-002"]
  },
  "validation": {
    "level": "error",
    "failOnError": true,
    "failOnWarning": false
  }
}
```

### Production Environment

**.arckit/environments/prod.json**:
```json
{
  "environment": "production",
  "settings": {
    "strictMode": true,
    "validateOnSave": true,
    "validateOnCommit": true,
    "validateOnPush": true,
    "validateOnSchedule": ["0 2 * * *"],
    "autoApprove": [],
    "learningMode": false,
    "debugMode": false,
    "auditMode": true
  },
  "rules": {
    "enabled": ["*"],
    "disabled": []
  },
  "validation": {
    "level": "error",
    "failOnError": true,
    "failOnWarning": true
  },
  "security": {
    "requireApproval": true,
    "requireSecurityReview": true,
    "blockVulnerableDependencies": true
  }
}
```

## Best Practices for Repository Configuration

### 1. Configuration Organization

**Standard Structure**:
```
.arckit/
├── config.json              # Main configuration
├── environments/            # Environment-specific configs
│   ├── dev.json
│   ├── staging.json
│   └── prod.json
├── configurations/          # Shared configurations
│   ├── rules.json
│   ├── standards.json
│   └── patterns.json
├── templates/              # Templates
│   ├── ADR-template.md
│   └── validation-report.md
└── scripts/                # Custom scripts
    └── validate.sh
```

**Configuration Separation**:
- **Repository-specific**: Settings unique to this repository
- **Environment-specific**: Settings that vary by environment
- **Organization-wide**: Shared configurations and standards
- **Team-specific**: Team-level configurations

### 2. Configuration Management

**Use Configuration Files**: Always use configuration files rather than manual settings for:
- Reproducibility across environments
- Version control and audit trail
- Easier sharing across repositories
- Disaster recovery

**Document Configurations**: Include documentation for:
- Purpose of each configuration option
- Recommended values
- Security implications
- Performance impact

**Validate Configurations**: Regularly validate configurations to ensure:
- Syntax correctness
- Semantic validity
- Compliance with organizational standards
- Security best practices

### 3. Security Best Practices

**Secure Sensitive Data**:
```bash
# Never commit secrets to repository
# Use GitHub secrets for:
arckit_app_id: ${{ secrets.ARCKIT_APP_ID }}
arckit_private_key: ${{ secrets.ARCKIT_APP_PRIVATE_KEY }}

# Use environment-specific configurations
# Don't commit production configuration to development branches
```

**Access Control**:
- Restrict who can modify ArcKit configurations
- Require pull request approvals for configuration changes
- Use CODEOWNERS for configuration files
- Implement branch protection for configuration files

**Audit Trail**:
- Maintain history of configuration changes
- Log configuration modifications
- Review configuration changes regularly
- Document rationale for configuration decisions

### 4. Performance Optimization

**Context Management**:
```json
{
  "context": {
    "maxTokens": 32000,
    "cacheEnabled": true,
    "cacheSize": 100,
    "cacheTTL": 86400,
    "compression": true
  }
}
```

**Rule Optimization**:
```json
{
  "rules": {
    "performance": {
      "skipPatterns": ["**/node_modules/**", "**/build/**"],
      "parallelProcessing": true,
      "maxWorkers": 4,
      "timeout": 30000
    }
  }
}
```

**Selective Validation**:
```json
{
  "validation": {
    "include": ["src/**", "lib/**"],
    "exclude": ["tests/**", "docs/**", "examples/**"],
    "changedOnly": true
  }
}
```

### 5. Team Collaboration

**Team-Specific Configurations**:
```json
{
  "teams": {
    "platform-engineering": {
      "settings": {
        "strictMode": true,
        "adrRequired": true,
        "validationLevel": "error"
      },
      "responsibilities": ["core-services", "infrastructure"]
    },
    "frontend-engineering": {
      "settings": {
        "strictMode": true,
        "adrRequired": true,
        "accessibilityChecks": true
      },
      "responsibilities": ["user-interfaces", "user-experience"]
    },
    "data-science": {
      "settings": {
        "strictMode": false,
        "adrRequired": false,
        "learningMode": true
      },
      "responsibilities": ["ml-models", "data-pipelines"]
    }
  }
}
```

**Cross-Team Standards**:
```json
{
  "standards": {
    "cross_team": {
      "shared_rules": ["SEC-001", "SEC-002", "DOC-001"],
      "consistent_patterns": ["Repository Pattern", "Dependency Injection"],
      "common_tools": ["ESLint", "Prettier", "TypeScript"]
    }
  }
}
```

## Troubleshooting Configuration Issues

### Common Issues and Solutions

**1. Configuration Not Loading**:
```bash
# Check configuration file exists
ls -la .arckit/config.json

# Validate configuration syntax
arckit config validate

# Check file permissions
ls -la .arckit/

# Solution: Ensure file exists, is valid JSON, and has correct permissions
```

**2. Configuration Not Applied**:
```bash
# Check current configuration
arckit config current

# Check if configuration is being read
arckit debug config-loading

# Solution: Check environment variables, file paths, and reload ArcKit
```

**3. Environment-Specific Configuration Not Working**:
```bash
# Check environment detection
arckit debug environment-detection

# Check environment configuration file
ls -la .arckit/environments/

# Solution: Ensure environment file matches current environment
```

**4. GitHub Integration Not Working**:
```bash
# Check GitHub app installation
gh api /app/installations

# Check webhook delivery
gh api /repos/${{ github.repository }}/hooks/deliveries

# Check app permissions
gh api /app

# Solution: Verify app installation, permissions, and webhook configuration
```

**5. Workflow Failing**:
```bash
# Check workflow runs
gh run list

# Check workflow logs
gh run view --log

# Solution: Check workflow syntax, permissions, and secrets
```

## Monitoring and Maintenance

### Configuration Monitoring

**Health Checks**:
```bash
# Check configuration health
arckit config health

# Monitor configuration usage
arckit monitor config --period 30d

# Check for configuration drift
arckit config check --drift
```

**Alerting**:
```yaml
# .github/workflows/config-monitoring.yml
name: Configuration Monitoring

on:
  schedule:
    - cron: '0 8 * * *'  # Daily at 8 AM
  workflow_dispatch:

jobs:
  monitor:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4
    
    - name: Install ArcKit CLI
      run: npm install -g @arckit/cli
    
    - name: Check configuration health
      run: arckit config health --format json > config-health.json
    
    - name: Check for drift
      run: arckit config check --drift --format json > config-drift.json
    
    - name: Alert on issues
      if: always()
      run: |
        # Parse results and create alerts
        HEALTH_ISSUES=$(jq '.issues | length' config-health.json)
        DRIFT_ISSUES=$(jq '.issues | length' config-drift.json)
        
        if [ $HEALTH_ISSUES -gt 0 ] || [ $DRIFT_ISSUES -gt 0 ]; then
          # Create GitHub issue or send notification
          gh issue create --title "ArcKit Configuration Issues" \
            --body "Health issues: $HEALTH_ISSUES, Drift issues: $DRIFT_ISSUES" \
            --label "arckit","configuration"
        fi
```

### Regular Maintenance Tasks

**1. Configuration Review**:
```bash
# Review all configurations
arckit config review --all

# Check for outdated configurations
arckit config check --outdated

# Update configurations from central repo
arckit config update --from central
```

**2. Dependency Updates**:
```bash
# Update ArcKit CLI
npm update -g @arckit/cli

# Update dependencies
arckit dependencies update

# Check for security vulnerabilities
arckit dependencies check --vulnerabilities
```

**3. Performance Tuning**:
```bash
# Analyze validation performance
arckit monitor performance --validation

# Optimize configurations
arckit config optimize

# Clean up cache
arckit cache clear --all
```

## Conclusion

Repository configuration and setup is the foundation for successful ArcKit deployment in GitHub Copilot environments. By implementing the strategies, patterns, and best practices outlined in this chapter, your organization can establish a robust, maintainable, and scalable architecture governance system across all your GitHub repositories.

**Key Takeaways**:

1. **Start with a Solid Foundation**: Establish centralized configuration repositories and consistent structures across all repositories.

2. **Leverage GitHub's Native Features**: Use GitHub Apps, Actions, and workflows to integrate ArcKit deeply into your development process.

3. **Tailor to Your Needs**: Customize configurations for different repository types, environments, and teams to optimize the governance experience.

4. **Automate Everything**: Implement comprehensive automation for validation, ADR management, reporting, and monitoring to reduce manual effort and ensure consistency.

5. **Secure Your Configuration**: Protect sensitive data, control access, and maintain audit trails for all configuration changes.

6. **Monitor and Maintain**: Regularly review configurations, monitor usage, and perform maintenance to keep your system running smoothly.

7. **Iterate and Improve**: Continuously refine your configurations based on usage data, feedback, and changing requirements.

The repository configuration and setup patterns described in this chapter provide a comprehensive framework for deploying ArcKit in GitHub Copilot environments. By implementing these approaches, your organization can achieve consistent architecture governance, improved code quality, and accelerated development processes across all your repositories.

In the next section, we'll explore how to leverage Copilot's unique capabilities—particularly its deep integration with the GitHub ecosystem—for advanced architecture governance workflows, including Copilot Chat integration for architecture queries and automated architecture validation in pull requests.
