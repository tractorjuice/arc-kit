# ArcKit v0.3.4 Release Notes

**Release Date:** 2025-10-23
**Release Type:** Minor Release (Bug Fix + Documentation)
**Previous Version:** v0.3.3

---

## 🔧 Critical Fix: Installation Bug

### Fixed Package Distribution

**Issue**: Templates, scripts, and .claude commands were not being included in the pip/uv wheel package, causing `arckit init` to fail after installation.

**Fix** (PR #3 by @umag):
- Added `[tool.hatch.build.targets.wheel.shared-data]` to pyproject.toml
- Enhanced `get_data_paths()` function to locate installed package data in multiple locations:
  - `~/.local/share/uv/tools/arckit-cli/share/arckit/` (uv tool installs)
  - Site-packages (pip installs)
  - Platformdirs user data directory
  - Source directory fallback (development mode)
- Added debug output showing resolved data paths
- Added warning messages if files not found

**Impact**: `arckit init` now works correctly for all installation methods.

---

## 📋 UI Implementation Plan

### Comprehensive Web UI Plan

Added `UI-IMPLEMENTATION-PLAN.md` - a complete technical specification for building a modern web interface to complement ArcKit's CLI workflow.

#### Key Features Planned

1. **Interactive Dashboard** - Project grid with status, statistics, activity feed
2. **Requirements Management** - Table view with filtering, sorting, form-based editor
3. **Traceability Visualization** - Interactive graph showing requirements → design → test links
4. **Diagram Viewers** - Mermaid diagrams and Wardley Maps with zoom/pan
5. **Vendor Comparison** - Side-by-side proposals, scoring matrices, evaluation scorecards
6. **AI Assistant Chat** - Execute `/arckit.*` commands from UI with streaming responses
7. **Real-time Sync** - File watchers and WebSockets keep CLI and UI in sync

#### Architecture

- **Frontend**: Next.js 14 (React + TypeScript)
- **Backend**: FastAPI (Python)
- **Real-time**: WebSockets for file synchronization
- **Data**: Markdown files remain source of truth (no database)

#### Implementation Roadmap

| Phase | Duration | Key Deliverables |
|-------|----------|------------------|
| Phase 1 | 2-3 weeks | Next.js + FastAPI setup, project views, markdown parser |
| Phase 2 | 3-4 weeks | Dashboard, requirements interface, traceability, diagrams |
| Phase 3 | 2-3 weeks | AI chat integration, slash command execution |
| Phase 4 | 3-4 weeks | Vendor comparison, workflow tracker, advanced viewers |
| Phase 5 | 2 weeks | Settings, export/import, testing, deployment |

**Total**: 12-16 weeks

#### Deployment Options

- **Local Web Server** (Recommended): `arckit serve --port 3000`
- **Desktop App**: Electron-based .dmg/.exe/.AppImage
- **Cloud**: Vercel + Railway with authentication

#### Philosophy

- ✅ CLI remains primary for document generation
- ✅ UI adds visualization and navigation
- ✅ Markdown files remain source of truth
- ✅ No vendor lock-in (no database)
- ✅ Real-time sync between interfaces

---

## 🚀 Installation

```bash
# Install with pip
pip install git+https://github.com/tractorjuice/arc-kit.git

# Or with uv
uv tool install arckit-cli --from git+https://github.com/tractorjuice/arc-kit.git

# Or run without installing
uvx --from git+https://github.com/tractorjuice/arc-kit.git arckit init my-project
```

**Now works correctly!** Templates, scripts, and commands are properly packaged.

---

## 📝 What's Included

### Fixed (v0.3.4)
- Critical installation bug preventing proper package distribution
- `arckit init` now works for all installation methods (pip, uv, uv tool)

### Added (v0.3.4)
- UI Implementation Plan documentation (925 lines)
- Complete architecture specifications
- API endpoint designs
- Component structure recommendations
- Risk assessment and mitigation strategies

### Unchanged
- All CLI functionality remains the same
- All slash commands work as before
- No breaking changes

---

## 🔜 What's Next

**v0.4.0 (Q1 2025)**: Phase 1 UI implementation
- Next.js + FastAPI foundation
- Project list and detail views
- Basic markdown viewer
- File watcher service

**v0.5.0 (Q2 2025)**: Phase 2 UI implementation
- Dashboard with statistics
- Requirements management interface
- Traceability visualization
- Diagram viewers

---

## 🤝 Contributors

Special thanks to:
- **@umag** - Fixed critical installation bug (PR #3)

---

## 🔗 Resources

- **GitHub Repository**: https://github.com/tractorjuice/arc-kit
- **Issues**: https://github.com/tractorjuice/arc-kit/issues
- **UI Implementation Plan**: `UI-IMPLEMENTATION-PLAN.md`
- **Changelog**: `CHANGELOG.md`

---

## 📊 Version Summary

| Component | Change |
|-----------|--------|
| **Installation** | Fixed - templates/scripts now packaged correctly |
| **UI Plan** | Added - comprehensive specification for web interface |
| **CLI** | Unchanged - all functionality remains the same |
| **Breaking Changes** | None |
| **Migration Required** | No |

---

**Built with ❤️ for enterprise architects who want systematic, AI-assisted governance.**
