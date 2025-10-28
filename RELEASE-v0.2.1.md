# ArcKit v0.2.1 Release Notes

**Release Date:** 2025-10-15
**Release Type:** Patch Release (Bug Fix)
**Previous Version:** v0.2.0

---

## 🔧 Bug Fixes

### Fixed GitHub URLs in Package Metadata

**Issue**: GitHub repository URLs in `pyproject.toml` were incorrect, causing issues with package metadata and PyPI integration.

**Fix**:
- Corrected GitHub URLs in `pyproject.toml` to point to the correct repository
- Updated all documentation references to use consistent GitHub URLs

**Impact**: Package now correctly references the GitHub repository in package managers.

---

## 📚 Documentation

### Updated Command Documentation

- Updated `.claude/COMMANDS.md` with complete list of all 16 commands
- Added version indicator showing v0.2.0 feature set
- Improved command reference table formatting

---

## 🚀 Installation

```bash
# Install with pip
pip install git+https://github.com/tractorjuice/arc-kit.git@v0.2.1

# Or with uv
uv tool install arckit-cli --from git+https://github.com/tractorjuice/arc-kit.git@v0.2.1
```

---

## 📝 What's Included

### Fixed (v0.2.1)
- GitHub repository URLs in package metadata
- Command documentation formatting

### Unchanged
- All CLI functionality remains the same as v0.2.0
- No breaking changes

---

## 📊 Version Summary

| Component | Change |
|-----------|--------|
| **Package Metadata** | Fixed - GitHub URLs corrected |
| **Documentation** | Updated - COMMANDS.md refreshed |
| **CLI** | Unchanged - all functionality same as v0.2.0 |
| **Breaking Changes** | None |
| **Migration Required** | No |

---

## 🔗 Resources

- **GitHub Repository**: https://github.com/tractorjuice/arc-kit
- **Issues**: https://github.com/tractorjuice/arc-kit/issues
- **Changelog**: `CHANGELOG.md`

---

**Built with ❤️ for enterprise architects who want systematic, AI-assisted governance.**
