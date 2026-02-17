# ArcKit for OpenCode

Enterprise Architecture Governance & Vendor Procurement Toolkit for OpenCode.

## Overview

ArcKit provides a comprehensive set of commands for enterprise architects to manage:
- Architecture principles and governance
- Requirements documentation
- Vendor RFP/SOW generation
- Vendor evaluation and selection
- Design review processes (HLD/DLD)
- Requirements traceability

## Installation

```bash
# Install with pip
pip install git+https://github.com/tractorjuice/arc-kit.git

# Or with uv
uv tool install arckit-cli --from git+https://github.com/tractorjuice/arc-kit.git

# Or run without installing
uvx --from git+https://github.com/tractorjuice/arc-kit.git arckit init my-project

# Create a new architecture governance project
arckit init payment-modernization --ai opencode

# Or initialize in current directory
arckit init . --ai opencode
```

## Usage

Once installed, ArcKit commands are available directly in OpenCode:

```
/arckit.plan            # Create project plan
/arckit.principles      # Establish architecture principles
/arckit.requirements    # Define requirements
/arckit.sow             # Generate Statement of Work
/arckit.evaluate        # Evaluate vendor proposals
```

See [ArcKit Documentation](https://github.com/tractorjuice/arc-kit) for full details.
