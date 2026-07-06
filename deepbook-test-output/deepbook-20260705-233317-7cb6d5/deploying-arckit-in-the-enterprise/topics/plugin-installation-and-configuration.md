# Plugin Installation and Configuration

## Overview

Deploying ArcKit in Claude Code begins with proper plugin installation and configuration. The ArcKit plugin for Claude Code provides architecture governance capabilities directly within your development environment, enabling real-time validation, decision tracking, and cross-platform consistency. This guide covers the complete installation and configuration process for enterprise deployments.

## Prerequisites

Before installing the ArcKit plugin for Claude Code, ensure the following prerequisites are met:

- **Claude Code Desktop Application**: Version 1.0 or later installed on each developer workstation
- **Node.js**: Version 18.x or later for local development and testing
- **Git**: Version 2.30 or later for version control operations
- **Python**: Version 3.10 or later for ArcKit CLI operations
- **Enterprise Repository Access**: Read/write access to your organization's ArcKit configuration repository
- **Administrative Privileges**: Local administrator rights for plugin installation (or enterprise deployment mechanisms)

## Installation Methods

### Method 1: Claude Code Plugin Marketplace (Recommended)

The simplest and most maintainable installation method for most enterprises:

1. **Access the Plugin Marketplace**:
   - Open Claude Code Desktop application
   - Navigate to the Extensions/Plugins section
   - Search for "ArcKit" in the marketplace

2. **Install the Plugin**:
   ```bash
   # Claude Code will handle the installation automatically
   # The plugin ID is: arckit-claude
   ```

3. **Restart Claude Code**:
   - After installation completes, restart the application
   - The ArcKit plugin will be activated automatically

4. **Verify Installation**:
   ```bash
   # In Claude Code chat:
   /arckit:status
   ```

### Method 2: Manual Installation from Source

For organizations requiring custom modifications or offline installations:

1. **Clone the ArcKit Repository**:
   ```bash
   git clone https://github.com/your-org/arckit.git
   cd arckit
   ```

2. **Navigate to Claude Plugin Directory**:
   ```bash
   cd plugins/arckit-claude
   ```

3. **Install Dependencies**:
   ```bash
   npm install
   ```

4. **Build the Plugin**:
   ```bash
   npm run build
   ```

5. **Install in Claude Code**:
   ```bash
   # Copy the built plugin to Claude Code's plugins directory
   # Default locations:
   # macOS: ~/Library/Application Support/ClaudeCode/plugins/
   # Windows: %APPDATA%\ClaudeCode\plugins\
   # Linux: ~/.config/ClaudeCode/plugins/
   
   cp -r dist/ ~/.config/ClaudeCode/plugins/arckit-claude/
   ```

6. **Enable the Plugin**:
   - Restart Claude Code
   - Enable ArcKit in the plugin settings

### Method 3: Enterprise Deployment via Configuration Management

For large-scale enterprise deployments, use your existing configuration management tools:

**Ansible Example**:
```yaml
- name: Install ArcKit plugin for Claude Code
  hosts: developer_workstations
  tasks:
    - name: Create Claude Code plugins directory
      file:
        path: ~/.config/ClaudeCode/plugins/arckit-claude
        state: directory
        mode: '0755'
    
    - name: Copy ArcKit plugin files
      copy:
        src: /path/to/arckit/plugins/arckit-claude/dist/
        dest: ~/.config/ClaudeCode/plugins/arckit-claude/
        owner: "{{ ansible_user }}"
        group: "{{ ansible_user }}"
    
    - name: Set plugin permissions
      file:
        path: ~/.config/ClaudeCode/plugins/arckit-claude
        state: directory
        recurse: yes
        mode: '0755'
```

**Puppet Example**:
```puppet
class arckit::claude {
  file { '/home/${user}/.config/ClaudeCode/plugins/arckit-claude':
    ensure => directory,
    source => 'puppet:///modules/arckit/claude-plugin',
    owner  => $user,
    group  => $user,
    mode   => '0755',
    recurse => true,
  }
}
```

## Configuration

### Basic Configuration

After installation, configure ArcKit for your enterprise environment:

1. **Initialize ArcKit in Your Project**:
   ```bash
   # Navigate to your project directory
   cd /path/to/your/project
   
   # Initialize ArcKit configuration
   arckit init
   ```

2. **Configure Repository Settings**:
   Edit `.arckit/config.json`:
   ```json
   {
     "repository": {
       "name": "your-enterprise-project",
       "description": "Enterprise project with ArcKit governance",
       "version": "1.0.0",
       "license": "Proprietary"
     },
     "plugins": {
       "claude": {
         "enabled": true,
         "version": "latest"
       }
     }
   }
   ```

### Enterprise-Specific Configuration

For enterprise deployments, customize the following configuration aspects:

**Team Configuration** (`.arckit/teams.json`):
```json
{
  "teams": [
    {
      "name": "architecture-review-board",
      "id": "arb",
      "description": "Enterprise Architecture Review Board",
      "members": ["alice@company.com", "bob@company.com"],
      "responsibilities": ["architecture-approval", "design-review"]
    },
    {
      "name": "platform-engineering",
      "id": "platform-eng",
      "description": "Platform Engineering Team",
      "members": ["charlie@company.com", "diana@company.com"],
      "responsibilities": ["infrastructure", "deployment"]
    }
  ]
}
```

**Notifications Configuration** (`.arckit/notifications.json`):
```json
{
  "notifications": {
    "slack": {
      "enabled": true,
      "webhook_url": "https://hooks.slack.com/services/YOUR/WEBHOOK/URL",
      "channels": {
        "architecture": "#architecture-governance",
        "alerts": "#arckit-alerts"
      }
    },
    "email": {
      "enabled": true,
      "smtp": {
        "host": "smtp.company.com",
        "port": 587,
        "secure": false,
        "auth": {
          "user": "arckit@company.com",
          "pass": "{{VAULT_EMAIL_PASSWORD}}"
        }
      },
      "templates": {
        "review_request": "templates/email/review-request.html"
      }
    }
  }
}
```

### Environment-Specific Settings

Configure ArcKit for different environments (development, staging, production):

**.arckit/environments/dev.json**:
```json
{
  "environment": "development",
  "strict_mode": false,
  "auto_approve": ["documentation-updates", "test-improvements"],
  "validation": {
    "enabled": true,
    "level": "warning"
  }
}
```

**.arckit/environments/prod.json**:
```json
{
  "environment": "production",
  "strict_mode": true,
  "auto_approve": [],
  "validation": {
    "enabled": true,
    "level": "error"
  },
  "requirements": {
    "adr_required": true,
    "peer_review_required": true,
    "security_review_required": true
  }
}
```

## Plugin Configuration in Claude Code

### Settings Interface

Access ArcKit settings through Claude Code's user interface:

1. **Open Settings**:
   - Press `Cmd+,` (macOS) or `Ctrl+,` (Windows/Linux)
   - Navigate to Extensions > ArcKit

2. **Configure Plugin Settings**:
   - **Enable/Disable**: Toggle plugin activation
   - **Auto-Activation**: Enable automatic activation for specific workspaces
   - **Command Prefix**: Customize the command prefix (default: `/arckit:`)
   - **Context Length**: Configure maximum context length for ArcKit operations

### Workspace Settings

Configure ArcKit settings per workspace:

**.vscode/settings.json** (Claude Code uses VS Code settings format):
```json
{
  "arckit.enabled": true,
  "arckit.autoDetect": true,
  "arckit.commandPrefix": "/arckit:",
  "arckit.maxContextLength": 16000,
  "arckit.showStatusBar": true,
  "arckit.telemetry.enabled": false,
  "arckit.validateOnSave": true,
  "arckit.validateOnCommit": true,
  
  "arckit.rules": {
    "requireAdrForArchitectureChanges": true,
    "requirePeerReviewForAdr": true,
    "enforceNamingConventions": true,
    "checkCrossReferences": true
  },
  
  "arckit.integrations": {
    "git": {
      "enabled": true,
      "hookTypes": ["pre-commit", "pre-push"]
    },
    "jira": {
      "enabled": true,
      "baseUrl": "https://jira.company.com",
      "apiToken": "{{VAULT_JIRA_TOKEN}}"
    }
  }
}
```

## Verifying the Installation

### Basic Verification

1. **Check Plugin Status**:
   ```bash
   # In Claude Code chat:
   /arckit:status
   ```
   
   Expected output:
   ```
   ArcKit Plugin Status:
   - Version: 4.20.1
   - Environment: development
   - Repository: your-enterprise-project
   - Status: Active
   - Commands: 45 registered
   ```

2. **List Available Commands**:
   ```bash
   /arckit:help
   ```

3. **Check Configuration**:
   ```bash
   /arckit:config list
   ```

### Advanced Verification

1. **Test Architecture Decision Creation**:
   ```bash
   /arckit:adr create --title "Test Installation" --description "Testing ArcKit installation"
   ```

2. **Validate Current State**:
   ```bash
   /arckit:validate
   ```

3. **Check Integration with Git**:
   ```bash
   # Make a test commit
   git add .
   git commit -m "Test ArcKit integration"
   # ArcKit should automatically validate the commit
   ```

## Troubleshooting Installation Issues

### Common Issues and Solutions

**Issue: Plugin not appearing in marketplace**
- **Solution**: Ensure Claude Code is updated to the latest version
- **Solution**: Check your organization's plugin allowlist if using enterprise controls
- **Solution**: Verify internet connectivity for marketplace access

**Issue: Manual installation fails with permission errors**
- **Solution**: Ensure proper file permissions (755 for directories, 644 for files)
- **Solution**: Check ownership of Claude Code plugins directory
- **Solution**: Run installation with elevated privileges if necessary

**Issue: Plugin loads but commands are not available**
- **Solution**: Restart Claude Code completely
- **Solution**: Check plugin logs in Claude Code Developer Tools (Help > Toggle Developer Tools)
- **Solution**: Verify plugin is enabled in settings

**Issue: Configuration files are not being read**
- **Solution**: Check file paths and permissions
- **Solution**: Ensure `.arckit/` directory exists in project root
- **Solution**: Verify JSON syntax in configuration files

### Debug Mode

Enable debug logging for detailed troubleshooting:

1. **Enable Debug Mode**:
   ```json
   // .vscode/settings.json
   {
     "arckit.debug": true,
     "arckit.logLevel": "debug"
   }
   ```

2. **View Logs**:
   - Open Claude Code Developer Tools
   - Navigate to Console tab
   - Filter for ArcKit messages

3. **Export Logs**:
   ```bash
   /arckit:debug export --file /tmp/arckit-debug.log
   ```

## Enterprise Deployment Checklist

- [ ] **Pilot Group**: Deploy to a small pilot group first
- [ ] **Documentation**: Update internal documentation with installation instructions
- [ ] **Training**: Schedule training sessions for developers
- [ ] **Support**: Establish support channels (Slack, email, etc.)
- [ ] **Monitoring**: Set up monitoring for plugin usage and errors
- [ ] **Feedback**: Create a feedback mechanism for issues and suggestions
- [ ] **Rollback Plan**: Document rollback procedures in case of issues

## Upgrading the Plugin

### Automatic Upgrades

Enable automatic upgrades in settings:
```json
{
  "arckit.autoUpdate": true,
  "arckit.updateChannel": "stable"
}
```

### Manual Upgrade

1. **Check Current Version**:
   ```bash
   /arckit:version
   ```

2. **Download Latest Version**:
   ```bash
   cd /path/to/arckit
   git pull origin main
   cd plugins/arckit-claude
   npm install
   npm run build
   ```

3. **Replace Plugin Files**:
   ```bash
   # Backup existing installation
   mv ~/.config/ClaudeCode/plugins/arckit-claude ~/.config/ClaudeCode/plugins/arckit-claude.bak
   
   # Copy new files
   cp -r dist/ ~/.config/ClaudeCode/plugins/arckit-claude/
   ```

4. **Restart Claude Code**

## Integration with Other Tools

### Git Integration

ArcKit automatically integrates with Git for pre-commit and pre-push validation:

**Enable Git Hooks**:
```bash
arckit git init
```

**Available Git Commands**:
```bash
# Validate before commit
arckit git pre-commit

# Validate before push
arckit git pre-push

# Check all commits in a range
arckit git validate --range HEAD~10..HEAD
```

### CI/CD Integration

Integrate ArcKit validation into your CI/CD pipeline:

**GitHub Actions Example**:
```yaml
name: ArcKit Validation

on: [push, pull_request]

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4
    
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '18'
    
    - name: Install ArcKit CLI
      run: npm install -g @arckit/cli
    
    - name: Run ArcKit Validation
      run: arckit validate --strict
    
    - name: Check ADR Compliance
      run: arckit adr validate --all
```

### IDE Integration

Configure ArcKit to work with multiple IDEs across your organization:

**VS Code with ArcKit Extension**:
```json
{
  "arckit.claudeCompatibility": true,
  "arckit.syncWithClaude": true
}
```

## Security Considerations

### Authentication and Authorization

- **Plugin Authentication**: ArcKit uses your existing Claude Code authentication
- **Enterprise SSO**: Configure SSO integration for enterprise authentication
- **API Tokens**: Manage API tokens for external service integrations securely

### Data Protection

- **Local Storage**: All ArcKit data is stored locally by default
- **Enterprise Storage**: Configure central storage for architecture decisions and configurations
- **Encryption**: Enable encryption for sensitive configuration files

### Access Control

Define role-based access control for ArcKit operations:

**.arckit/access-control.json**:
```json
{
  "roles": {
    "developer": {
      "permissions": [
        "adr:create",
        "adr:view",
        "validate:run",
        "config:view"
      ]
    },
    "architect": {
      "permissions": [
        "adr:create",
        "adr:approve",
        "adr:deprecate",
        "validate:run",
        "config:edit"
      ]
    },
    "admin": {
      "permissions": ["*"],
      "can_grant_permissions": true
    }
  },
  
  "users": {
    "alice@company.com": ["admin", "architect"],
    "bob@company.com": ["architect"],
    "charlie@company.com": ["developer"]
  }
}
```

## Performance Optimization

### Caching Configuration

```json
{
  "arckit.cache": {
    "enabled": true,
    "maxSize": 100,
    "ttl": 86400,
    "compression": true
  }
}
```

### Resource Limits

```json
{
  "arckit.limits": {
    "maxContextLength": 32000,
    "maxFileSize": 1048576,
    "maxValidationTime": 30000,
    "concurrentOperations": 4
  }
}
```

## Best Practices for Enterprise Installation

1. **Standardize Configuration**: Create standardized configuration templates for different project types
2. **Centralize Documentation**: Maintain central documentation for installation and configuration procedures
3. **Establish Support Channels**: Create dedicated support channels for ArcKit-related questions
4. **Regular Training**: Schedule regular training sessions for new team members
5. **Monitor Usage**: Track plugin usage and identify opportunities for improvement
6. **Feedback Loop**: Establish a feedback loop with the ArcKit development team
7. **Version Management**: Implement version management processes for plugin updates

## Migration from Previous Versions

### Migration Checklist

- [ ] Backup existing configuration files
- [ ] Review breaking changes in release notes
- [ ] Update custom scripts and integrations
- [ ] Test in development environment
- [ ] Plan rollout to production
- [ ] Train team members on new features

### Version-Specific Migration Guides

**From v3.x to v4.x**:
- Configuration format changed from YAML to JSON
- Command syntax updated for consistency
- New validation rules engine
- Enhanced enterprise features

**From v2.x to v3.x**:
- Plugin architecture redesigned
- New command structure
- Improved performance
- Better error handling

## Conclusion

Proper installation and configuration of the ArcKit plugin for Claude Code is the foundation for successful enterprise architecture governance. By following the guidelines in this chapter, you can ensure that your organization has a robust, maintainable, and scalable ArcKit deployment that provides consistent governance across all development activities.

The installation methods and configuration options presented here provide flexibility for organizations of all sizes, from small teams to large enterprises with complex requirements. Choose the approach that best fits your organization's needs and infrastructure, and don't hesitate to customize the configuration to match your specific workflows and processes.

Once the plugin is installed and configured, your team can begin leveraging ArcKit's powerful architecture governance capabilities to improve software quality, maintain consistency across projects, and accelerate decision-making processes.

Next, we'll explore how to leverage Claude's large context window for comprehensive architecture reviews, enabling your team to analyze complex systems and make informed architectural decisions.
