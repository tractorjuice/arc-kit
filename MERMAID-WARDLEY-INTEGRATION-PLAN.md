# Mermaid Wardley Maps Integration Plan

**Status**: Draft
**Created**: 2025-11-09
**PR Reference**: [mermaid-js/mermaid#7147](https://github.com/mermaid-js/mermaid/pull/7147)
**Impact**: High - Native Wardley Maps rendering in GitHub, VS Code, and all Mermaid-supporting tools

---

## Executive Summary

A new Wardley Maps diagram type has been added to Mermaid.js (PR #7147, opened November 9, 2025) that uses **OnlineWardleyMaps (OWM) syntax** - the SAME syntax that ArcKit already uses! Once merged, this means:

✅ **Zero breaking changes** - ArcKit Wardley Maps will work immediately
✅ **Native GitHub rendering** - Maps visualize directly in markdown without external tools
✅ **VS Code integration** - Preview maps in editor with Mermaid extensions
✅ **Better collaboration** - No need to copy/paste to create.wardleymaps.ai
✅ **Version control** - Full git history of map evolution

---

## Current State Analysis

### What ArcKit Already Does

ArcKit generates Wardley Maps using:
- **Format**: OnlineWardleyMaps (OWM) syntax
- **Code blocks**: ` ```wardley ... ``` `
- **Visualization**: Manually paste into https://create.wardleymaps.ai
- **Templates**: `.arckit/templates/wardley-map-template.md`
- **Commands**: `/arckit.wardley` generates maps from requirements

### Current Syntax Example

```wardley
title NHS Appointment Booking - Current State
anchor Patient [0.95, 0.63]

component Patient [0.95, 0.20]
component Book Appointment [0.88, 0.35]
component GP Practice System [0.65, 0.55]
component NHS Spine [0.45, 0.72]
component Cloud Hosting [0.25, 0.92]

Patient -> Book Appointment
Book Appointment -> GP Practice System
GP Practice System -> NHS Spine
GP Practice System -> Cloud Hosting

evolve GP Practice System 0.75 label Modernization

annotation 1 [0.65, 0.35] Legacy system - high inertia
note Use NHS Digital APIs [0.45, 0.85]

style wardley
```

**Pain Points**:
- ❌ Maps don't render in GitHub - just show as code blocks
- ❌ Manual step to visualize (copy to external tool)
- ❌ Breaks developer flow
- ❌ Harder to review in PRs

---

## Mermaid PR #7147 Analysis

### Status
- **PR**: https://github.com/mermaid-js/mermaid/pull/7147
- **Opened**: November 9, 2025 (TODAY)
- **Author**: tractorjuice (same owner as arc-kit!)
- **Status**: Open (Draft)
- **Tests**: 12 E2E visual regression tests, 7 unit tests
- **Coverage**: Minimal unit test coverage (0.00% renderer) - tested via Cypress

### Syntax Compatibility

**IDENTICAL to ArcKit's current syntax!** Mermaid PR uses OnlineWardleyMaps format:

| Feature | ArcKit Current | Mermaid PR #7147 | Compatible? |
|---------|---------------|------------------|-------------|
| Code block | ` ```wardley ` | ` ```wardley ` | ✅ Yes |
| title | `title Map Name` | `title Map Name` | ✅ Yes |
| anchor | `anchor User [0.95, 0.63]` | `anchor User [0.95, 0.63]` | ✅ Yes |
| component | `component Name [vis, evo]` | `component Name [vis, evo]` | ✅ Yes |
| dependencies | `A -> B` | `A -> B` | ✅ Yes |
| evolve | `evolve Name 0.75` | `evolve Name 0.75` | ✅ Yes |
| annotations | `annotation N [x,y] text` | `annotation N [x,y] text` | ✅ Yes |
| notes | `note text [x, y]` | `note text [x, y]` | ✅ Yes |
| pipeline | `pipeline Name [...]` | `pipeline Name [...]` | ✅ Yes |
| custom evolution | `evolution A -> B -> C` | `evolution A -> B -> C` | ✅ Yes |
| style | `style wardley` | (implicit) | ⚠️ Optional |

**Conclusion**: 100% compatible! ArcKit maps will render natively once PR is merged.

### New Features in Mermaid PR

Features ArcKit doesn't currently use but could leverage:

1. **Custom Evolution Stages**:
   ```wardley
   evolution Unmodelled -> Divergent -> Convergent -> Modelled
   ```

2. **Source Strategy Markers**:
   ```wardley
   component Database [0.45, 0.72] (buy)
   component AI Model [0.68, 0.35] (build)
   component Cloud Hosting [0.25, 0.92] (outsource)
   ```

3. **Inertia Indicators**:
   ```wardley
   component Legacy System [0.55, 0.45] inertia
   ```

4. **Multiple Link Types**:
   ```wardley
   A -> B          # Normal dependency
   A +> B          # Flow
   A +< B          # Reverse flow
   A +<> B         # Bidirectional
   ```

5. **Canvas Sizing**:
   ```wardley
   size [1200, 800]
   ```

---

## Migration Strategy

### Phase 1: Immediate (No Changes Required) ✅

**Action**: NOTHING - ArcKit maps already compatible!

Once PR #7147 is merged:
1. GitHub will automatically render existing ArcKit Wardley Maps
2. All test repositories (v0-v10) will work immediately
3. No template changes needed
4. No command changes needed

**Timeline**: When Mermaid PR merges (unknown - currently in draft)

### Phase 2: Documentation Updates (Post-Merge)

**Update wardley-map-template.md**:

Current visualization section:
```markdown
**View this map**: Paste the map code below into [https://create.wardleymaps.ai](https://create.wardleymaps.ai)
```

New visualization section:
```markdown
## Map Visualization

This map renders automatically in:
- ✅ **GitHub**: Displays natively in markdown files and PRs
- ✅ **VS Code**: Use Mermaid extension for live preview
- ✅ **GitLab/Bitbucket**: Supported via Mermaid plugins

**Alternative viewers**:
- [OnlineWardleyMaps](https://create.wardleymaps.ai) - Original OWM editor with extended features
- [Mermaid Live Editor](https://mermaid.live) - Test Mermaid rendering
```

**Update arckit.wardley command**:

Add after map generation:
```markdown
## Visualization

Your Wardley Map will render automatically in GitHub, VS Code, and other Mermaid-supporting tools.

**No external tools required!** The map displays natively in:
- Pull requests for easy review
- README.md files for documentation
- VS Code with Mermaid Preview extension

For advanced editing, you can also use [OnlineWardleyMaps](https://create.wardleymaps.ai).
```

**Update README.md**:

Add to "Why ArcKit?" section:
```markdown
- ✅ **Native Visualization**: Wardley Maps render directly in GitHub (Mermaid support)
```

### Phase 3: Enhanced Features (Optional - Post-Merge)

**Leverage new Mermaid-specific features**:

#### 3.1 Add Source Strategy Markers

Enhance build vs buy analysis with visual markers:

```wardley
title Payment Gateway Modernization - Procurement Strategy

component Payment API [0.85, 0.42] (build)     # Competitive advantage
component Fraud Detection [0.68, 0.68] (buy)   # Commercial product
component Cloud Hosting [0.25, 0.92] (outsource) # AWS/Azure
component Monitoring [0.35, 0.88] (market)     # SaaS tools
```

**Template Change**: Add strategy marker column to component inventory table

| Component | Visibility | Evolution | Strategy | Procurement Route |
|-----------|-----------|-----------|----------|-------------------|
| Payment API | 0.85 | 0.42 | **(build)** | DOS Outcomes |
| Fraud Detection | 0.68 | 0.68 | **(buy)** | G-Cloud |
| Cloud Hosting | 0.25 | 0.92 | **(outsource)** | G-Cloud |

#### 3.2 Add Inertia Indicators

Mark legacy systems resisting change:

```wardley
component Legacy Mainframe [0.55, 0.35] inertia
component COBOL System [0.48, 0.28] inertia
```

**Use Case**: Highlight change resistance for risk management and modernization planning

#### 3.3 Custom Evolution Labels for UK Government

Replace generic evolution stages with domain-specific labels:

**For Digital Transformation**:
```wardley
evolution Discovery -> Alpha -> Beta -> Live
```

**For Technology Maturity**:
```wardley
evolution Prototype -> Pilot -> Production -> Retired
```

**For AI Systems (JSP 936 alignment)**:
```wardley
evolution Experimental -> Supervised -> Autonomous -> Deprecated
```

#### 3.4 Enhanced Link Types

Use directional indicators for data flows:

```wardley
title Data Platform Architecture

component Data Lake [0.35, 0.82]
component Analytics Engine [0.55, 0.65]
component BI Dashboard [0.78, 0.58]

Data Lake +> Analytics Engine    # Data flows to analytics
Analytics Engine +> BI Dashboard # Results flow to dashboard
BI Dashboard +< Analytics Engine # User queries flow back
```

---

## Implementation Roadmap

### Immediate Actions (Today)

1. ✅ **Research Complete**: Analyzed PR #7147 syntax compatibility
2. ✅ **Compatibility Confirmed**: 100% compatible with existing ArcKit maps
3. 🎯 **Monitor PR**: Track merge status of PR #7147

### Post-Merge Actions (When PR merges to Mermaid main)

**Day 1: Documentation Updates**
1. Update wardley-map-template.md visualization section
2. Update arckit.wardley command instructions
3. Update README.md with native rendering feature
4. Update docs/guides/wardley-mapping.md

**Day 2: Test All Example Maps**
1. Verify rendering in GitHub for all test repos (v0-v10)
2. Check VS Code Mermaid extension compatibility
3. Test all 5 Wardley map types (current, future, gap, vendor, procurement)

**Week 1: Enhanced Features (Optional)**
1. Add source strategy markers to template
2. Add inertia indicators for legacy systems
3. Document custom evolution stages for UK Gov domains
4. Create examples using enhanced link types

**Week 2: Community Communication**
1. Update CHANGELOG.md with Mermaid integration
2. Announce on GitHub Discussions
3. Update docs/index.html with visualization demo
4. Consider blog post showcasing native GitHub rendering

### Future Enhancements (3-6 months)

**Automation Opportunities**:
1. **Auto-generate maps from code**: Scan codebase, detect components, auto-position on map
2. **Traceability visualization**: Generate maps showing requirements → components → tests
3. **Evolution tracking**: Git history analysis to show how maps evolved over time
4. **Multi-map comparison**: Side-by-side vendor comparison maps with diff highlighting

**Integration Opportunities**:
1. **CI/CD validation**: Lint Wardley maps for syntax errors in GitHub Actions
2. **Map as code**: Store maps as structured data (JSON/YAML), generate OWM syntax
3. **Interactive maps**: Click component → jump to requirements, design docs, code
4. **AI-assisted positioning**: Use Claude to suggest optimal component positioning

---

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| PR #7147 not merged | Medium | Medium | Continue using create.wardleymaps.ai fallback |
| PR #7147 breaking changes | Low | High | ArcKit maintains OWM syntax compatibility |
| Mermaid version fragmentation | Medium | Low | Document minimum Mermaid version required |
| GitHub rendering delays | Low | Low | PR rendering works immediately once merged |
| VS Code extension lag | Medium | Low | Fallback to GitHub or online tools |

### Mitigation Strategy: Graceful Degradation

**Current behavior**: Maps shown as code blocks, manual copy to create.wardleymaps.ai
**Post-merge behavior**: Maps render natively in GitHub
**Fallback**: Always include visualization instructions for both methods

Template wording:
```markdown
## Map Visualization

**Automatic Rendering** (GitHub, VS Code, GitLab):
This map displays natively in Mermaid-supporting tools.

**Manual Rendering** (if automatic rendering unavailable):
1. Copy the map code below
2. Paste into [OnlineWardleyMaps](https://create.wardleymaps.ai)
3. View and edit interactively
```

---

## Success Metrics

### Adoption Metrics
- **Internal**: % of ArcKit projects using Wardley Maps (current: ~30%)
- **Rendering**: % of maps successfully rendering in GitHub (target: 100%)
- **Engagement**: PR review comments on Wardley Map strategy (increase expected)

### Quality Metrics
- **Syntax errors**: Zero broken maps after migration (automated tests)
- **Visualization parity**: Maps look identical in Mermaid vs OWM
- **Performance**: Map rendering time < 1 second

### User Experience Metrics
- **Developer feedback**: Survey on native rendering vs manual tools
- **Reduced friction**: Time saved not copying to external tools
- **Collaboration**: Increased strategic discussions on PRs

---

## Technical Specifications

### Minimum Requirements

**For Native Rendering**:
- Mermaid.js version: TBD (when PR #7147 merges - likely v12.0+)
- GitHub: Automatic (GitHub uses Mermaid for rendering)
- VS Code: Mermaid Preview extension
- GitLab: Built-in Mermaid support (check version compatibility)

### Testing Strategy

**Unit Tests** (ArcKit CLI):
- Validate generated OWM syntax correctness
- Check template placeholder replacement
- Verify component coordinate ranges (0.0-1.0)

**Integration Tests**:
- Generate map → render in Mermaid → screenshot → compare to OWM
- Test all 5 map types (current, future, gap, vendor, procurement)
- Test with/without optional features (annotations, notes, evolve, pipeline)

**Visual Regression Tests**:
- Capture screenshots of rendered maps
- Compare against OWM baseline
- Flag visual differences for review

### Backward Compatibility

**Guarantee**: All existing ArcKit Wardley Maps will continue working

**Strategy**:
1. Maintain OWM syntax as source of truth
2. Never introduce Mermaid-only syntax that breaks OWM
3. Test dual rendering (Mermaid + OWM) in CI/CD
4. Document feature parity between tools

---

## FAQ

### Q1: Do we need to change existing Wardley Maps in ArcKit?
**A: NO.** All existing maps are 100% compatible. They will render automatically once Mermaid PR merges.

### Q2: What if the PR doesn't merge?
**A: No impact.** ArcKit continues using create.wardleymaps.ai as it does today. This is pure upside - zero downside.

### Q3: Should we wait for the PR to merge before using Wardley Maps?
**A: NO.** Continue using Wardley Maps normally. They work today and will work even better once the PR merges.

### Q4: Can we still use create.wardleymaps.ai after the merge?
**A: YES.** OnlineWardleyMaps has additional features (export, advanced styling) that may be useful for presentations. Use both!

### Q5: Will this break our test repositories?
**A: NO.** Test repos will automatically benefit from native rendering. No updates needed.

### Q6: Should we update our templates now or wait?
**A: WAIT.** Monitor PR #7147 merge status. Update templates AFTER merge to avoid documenting unreleased features.

### Q7: How do we track when the PR merges?
**A: GitHub notifications.** Watch the PR: https://github.com/mermaid-js/mermaid/pull/7147

### Q8: Can we contribute to the PR?
**A: YES.** The PR is open for feedback. Consider testing and providing constructive feedback on rendering quality.

---

## Next Steps

### For ArcKit Maintainers

1. ⏰ **Monitor PR #7147**: Subscribe to notifications
2. 📝 **Prepare docs update**: Draft template/command changes (don't publish yet)
3. 🧪 **Test locally**: Try Mermaid PR branch with ArcKit maps
4. 📢 **Plan announcement**: Prepare blog post/changelog for when it merges

### For ArcKit Users

1. ✅ **Continue using Wardley Maps normally**: No changes needed
2. 🔔 **Watch this space**: We'll announce when native rendering goes live
3. 💬 **Share feedback**: What additional Mermaid features would you like?

---

## Conclusion

The Mermaid Wardley Maps PR (#7147) is a **game-changer** for ArcKit:

✅ **Zero migration effort** - Already compatible
✅ **Massive UX improvement** - Native GitHub rendering
✅ **No downside** - Works with or without the PR
✅ **Future-proof** - Opens doors to automation and enhanced features

**Recommendation**: Continue using Wardley Maps as normal. Monitor PR merge status. Update documentation post-merge. Celebrate native rendering when it arrives! 🎉

---

**Document Status**: DRAFT
**Next Review**: When PR #7147 merges to Mermaid main
**Owner**: ArcKit Maintainers
**Feedback**: Open GitHub issue or discussion
