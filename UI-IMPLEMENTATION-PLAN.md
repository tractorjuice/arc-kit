# ArcKit UI Implementation Plan

**Version**: 1.0
**Date**: 2025-10-23
**Status**: Draft

---

## Executive Summary

ArcKit is currently a powerful CLI-based enterprise architecture governance toolkit that generates markdown documents through AI assistant slash commands. Adding a UI will:
- Provide visual project dashboards and workflow tracking
- Enable interactive document viewing/editing
- Visualize relationships (traceability matrices, diagrams)
- Offer vendor comparison tools
- Maintain the CLI workflow while adding visual capabilities

---

## 1. Architecture Strategy

### Recommended Approach: Hybrid Web + CLI

**Technology Stack:**
- **Frontend**: Next.js 14 (React) with TypeScript
- **Backend API**: FastAPI (Python) or Next.js API routes
- **Real-time**: WebSockets for file watching
- **Visualization**: Mermaid.js, D3.js, React Flow
- **State Management**: Zustand or React Query
- **UI Framework**: Shadcn/ui + Tailwind CSS
- **Markdown**: MDX or react-markdown with syntax highlighting

**Why This Stack:**
- Python backend integrates naturally with existing CLI
- Next.js provides SSR for better performance
- Can run locally (localhost) or deployed as web app
- Modern, responsive UI components
- Easy Mermaid/Wardley Map integration

---

## 2. Core Features & Pages

### A. Dashboard (Home Page)

**Project Grid View**: Cards showing all projects with status indicators
- Project number, name, completion %
- Visual workflow progress bar
- Last modified date
- Quick actions (View, Edit, Delete)

**Statistics Panel**:
- Total projects
- Active projects
- Projects by phase
- Total requirements, vendors, etc.

**Recent Activity Feed**: Latest document changes

**Quick Actions**: Create new project, run slash commands

### B. Project Detail View

**Left Sidebar Navigation**:
- Project Overview
- Stakeholder Drivers
- Risk Register
- Business Case (SOBC)
- Requirements
- Data Model
- Research Findings
- Wardley Maps
- SOW/RFP
- Vendor Evaluation
- Design Reviews
- Traceability
- ServiceNow Design

**Center Panel**: Document viewer/editor
- Markdown rendering with syntax highlighting
- Inline editing capability
- Version history
- AI assistant chat panel (can invoke slash commands)

**Right Sidebar**: Metadata & context
- Document status
- Contributors
- Tags
- Related documents
- Quick links

### C. Visual Workflow Tracker

**Kanban-style board** showing project phase:
- Phase 1: Governance (Principles)
- Phase 2: Stakeholder Analysis
- Phase 3: Risk Assessment
- Phase 4: Business Case
- Phase 5: Requirements
- Phase 6: Research & Wardley Mapping
- Phase 7: Vendor Procurement
- Phase 8: Design Review
- Phase 9: ServiceNow Design
- Phase 10: Traceability

Features:
- Drag & drop projects between phases
- Phase completion indicators
- Visual progress tracking

### D. Requirements Management Interface

**Interactive Requirements Table**:
- Filterable by type (BR, FR, NFR, DR, INT)
- Sortable by ID, priority, status
- Search functionality
- Bulk actions (delete, change priority)
- Requirements graph showing relationships
- Link to design elements
- Acceptance criteria tracking

**Requirements Editor**:
- Form-based requirement creation
- Template fields (ID, Description, Rationale, Priority, Acceptance Criteria)
- Auto-ID generation
- Stakeholder linking
- Principle alignment checking

### E. Traceability Matrix Visualization

**Interactive Graph View**:
- Nodes: Requirements, Design Elements, Test Cases
- Edges: Traceability links
- Color coding by requirement type
- Zoom, pan, filter
- Click node to see details
- Identify orphan requirements

**Table View**:
- Rows: Requirements
- Columns: Design Elements, Tests, Status
- Coverage percentage
- Gap highlights
- Export to CSV/PDF

### F. Diagram Viewers

**Mermaid Diagram Renderer**:
- Live preview of Mermaid code
- Zoom, pan controls
- Export as PNG/SVG
- Edit mode with syntax highlighting

**Wardley Map Viewer**:
- Integrate OnlineWardleyMaps renderer
- Side-by-side comparison (current vs future state)
- Component positioning editor
- Evolution axis visualization
- Build vs Buy decision overlay

### G. Vendor Comparison Dashboard

**Side-by-Side Comparison**:
- Vendor proposals in columns
- Technical approach comparison
- Cost breakdown visualization
- Scoring matrix heatmap
- Reference checks status
- Decision recommendation

**Evaluation Scorecard**:
- Interactive scoring interface
- Criteria weighting
- Real-time score calculation
- Comments and notes
- Export evaluation report

### H. AI Assistant Chat Interface

**Integrated Chat Panel**:
- Persistent chat in right sidebar
- Execute slash commands from UI
- Stream responses in real-time
- Show file diffs when documents are created/modified
- Context awareness (current project, document)
- Command suggestions based on project phase

### I. Settings & Configuration

- Architecture principles editor
- Template customization
- AI assistant configuration
- Export/import settings
- User preferences (theme, layout)
- Integration settings (GitHub, ServiceNow API)

---

## 3. Backend Architecture

### API Layer (FastAPI)

**Core Endpoints**:

```python
# Projects
GET    /api/projects                 # List all projects
GET    /api/projects/{id}            # Get project details
POST   /api/projects                 # Create project
PUT    /api/projects/{id}            # Update project
DELETE /api/projects/{id}            # Delete project

# Documents
GET    /api/projects/{id}/documents           # List documents
GET    /api/projects/{id}/documents/{type}    # Get specific document
PUT    /api/projects/{id}/documents/{type}    # Update document

# Requirements
GET    /api/projects/{id}/requirements        # Get all requirements
POST   /api/projects/{id}/requirements        # Create requirement
PUT    /api/projects/{id}/requirements/{req_id}  # Update requirement
DELETE /api/projects/{id}/requirements/{req_id}  # Delete requirement

# Traceability
GET    /api/projects/{id}/traceability        # Get traceability matrix

# Diagrams
GET    /api/projects/{id}/diagrams            # List diagrams
GET    /api/projects/{id}/diagrams/{id}       # Get diagram

# Vendors
GET    /api/projects/{id}/vendors             # List vendors
POST   /api/projects/{id}/vendors             # Add vendor
GET    /api/projects/{id}/vendors/{id}        # Get vendor details

# AI Assistant
POST   /api/ai/execute                        # Execute slash command
WS     /api/ai/chat                          # WebSocket for chat

# Analysis
GET    /api/projects/{id}/analyze             # Run governance analysis
GET    /api/projects/{id}/status              # Get project status
```

### Data Parsers

**Markdown Parser Service**:
- Extract structured data from .md files
- Parse requirements (BR-xxx, FR-xxx, etc.)
- Extract metadata (headers, tables)
- Identify relationships
- Track changes

**Document Schemas**:

```python
class Requirement(BaseModel):
    id: str  # BR-001, FR-001, etc.
    title: str
    description: str
    rationale: str
    priority: str  # MUST/SHOULD/MAY
    acceptance_criteria: List[str]
    stakeholder: Optional[str]
    status: str  # DRAFT/APPROVED/IMPLEMENTED

class Project(BaseModel):
    id: str  # 001, 002, etc.
    name: str
    path: str
    completion_percentage: int
    phase: str
    artifacts: Dict[str, bool]
    last_modified: datetime

class TraceabilityLink(BaseModel):
    source_id: str
    target_id: str
    type: str  # requirement->design, design->test
```

### File Watcher Service

- Monitor `projects/` directory for changes
- Parse changed .md files
- Update in-memory cache
- Broadcast updates via WebSocket
- Maintain change history

### CLI Integration

- Run bash scripts via subprocess
- Parse JSON output from scripts
- Execute slash commands by invoking AI assistant
- Stream command output

---

## 4. Data Flow & Integration

### CLI → UI Sync

1. User runs `/arckit.requirements` in Claude Code
2. File watcher detects `requirements.md` created
3. Parser extracts structured data
4. WebSocket broadcasts update
5. UI refreshes automatically

### UI → CLI Sync

1. User edits requirement in UI
2. API updates `requirements.md` file
3. Maintains markdown format
4. Preserves AI-generated content
5. Git commit created (optional)

### Hybrid Workflow

- CLI remains primary for document generation
- UI provides visualization and editing
- Both work on same markdown files
- No database lock-in (files are source of truth)

---

## 5. Technical Considerations

### Performance

- Cache parsed documents in memory
- Lazy load large documents
- Virtual scrolling for long requirement lists
- Debounce file watcher updates
- Index documents for fast search

### Data Integrity

- Markdown files remain source of truth
- UI writes back to markdown atomically
- Maintain formatting and structure
- Preserve AI-generated content
- Version control via Git

### Scalability

- Handle projects with 1000+ requirements
- Support large vendor proposal PDFs
- Efficient diagram rendering
- Batch operations for bulk updates

### Security

- Local-first (no cloud required)
- Optional authentication if deployed
- RBAC for multi-user scenarios
- Audit logging
- Secure file operations

---

## 6. Implementation Phases

### Phase 1: Foundation (2-3 weeks)

- Set up Next.js project structure
- Create FastAPI backend with core endpoints
- Implement markdown file parser
- Build project list view
- Build project detail view
- Basic markdown viewer/renderer

**Deliverables**:
- Working Next.js + FastAPI setup
- Project list page showing all projects
- Project detail page with document viewer
- Basic file parser extracting project metadata

### Phase 2: Core Features (3-4 weeks)

- Dashboard with statistics and activity feed
- Requirements management interface (table + editor)
- Traceability matrix visualization (graph + table)
- Diagram viewers (Mermaid, Wardley Maps)
- File watcher service
- Real-time updates via WebSocket

**Deliverables**:
- Interactive dashboard
- Full requirements CRUD interface
- Traceability graph visualization
- Live diagram rendering
- Real-time sync between CLI and UI

### Phase 3: AI Integration (2-3 weeks)

- AI assistant chat interface
- Slash command execution from UI
- Streaming responses
- Context awareness (current project/document)
- Command suggestions
- File diff viewer

**Deliverables**:
- Chat panel integrated in UI
- Execute `/arckit.*` commands from browser
- Real-time command output streaming
- Context-aware suggestions

### Phase 4: Advanced Features (3-4 weeks)

- Vendor comparison dashboard
- Workflow tracker (Kanban board)
- Risk register visualization
- Data model ERD viewer
- ServiceNow design interface
- Stakeholder analysis viewer

**Deliverables**:
- Vendor evaluation scorecard
- Visual workflow tracker
- Interactive risk matrix
- ERD diagram viewer
- Complete artifact viewers

### Phase 5: Polish & Deploy (2 weeks)

- Settings & configuration UI
- Export/import capabilities (PDF, Word, JSON)
- Comprehensive documentation
- Unit & integration testing
- Performance optimization
- Deployment packaging (Docker, desktop app)

**Deliverables**:
- Production-ready application
- Docker Compose setup
- Documentation site
- Installation packages

**Total Estimate: 12-16 weeks**

---

## 7. Deployment Options

### Option A: Local Web App (Recommended)

**How it works**:
- Run `arckit serve` command
- Launches FastAPI backend + Next.js frontend
- Opens browser to localhost:3000
- No internet required

**Pros**:
- Easy to use
- No deployment complexity
- Full access to local files
- No security concerns

**Cons**:
- Must run command each time
- No remote access

**Implementation**:
```bash
# Add to CLI
arckit serve --port 3000
```

### Option B: Desktop App (Electron)

**How it works**:
- Packaged as .dmg/.exe/.AppImage
- Embedded backend + frontend
- Native application feel

**Pros**:
- Native feel
- Offline-first
- No CLI required
- Auto-updates

**Cons**:
- Larger download size (~100MB)
- More complex packaging
- Platform-specific builds

**Implementation**:
- Use Electron with Next.js
- Package FastAPI as executable (PyInstaller)
- Bundle both in Electron app

### Option C: Cloud Deployment (Optional)

**How it works**:
- Deploy frontend to Vercel/Netlify
- Deploy backend to Railway/Fly.io
- Multi-user support
- Team collaboration

**Pros**:
- Access from anywhere
- Team collaboration
- No local installation
- Always up-to-date

**Cons**:
- Requires authentication
- Data in cloud (privacy concerns)
- Requires internet
- Hosting costs

**Implementation**:
- Add user authentication (Auth0, Clerk)
- Implement RBAC
- Add project sharing
- Handle file storage (S3, Google Drive)

---

## 8. UI/UX Design Principles

- **Clean & Professional**: Enterprise-grade design suitable for architects
- **Information Density**: Display lots of data without clutter
- **Keyboard Shortcuts**: Power user workflows (Cmd+K command palette)
- **Responsive**: Work on desktop, tablet (mobile read-only)
- **Accessible**: WCAG 2.1 AA compliance
- **Dark Mode**: Support for dark theme
- **Customizable**: User preferences, layout options, theme customization

**Design Reference**:
- Linear (project management)
- Notion (document editing)
- Figma (canvas interactions)
- GitHub (file browsing, diffs)

---

## 9. Key Challenges & Solutions

| Challenge | Solution |
|-----------|----------|
| **Markdown parsing complexity** | Use robust parser (markdown-it, remark) with custom extensions for requirement IDs |
| **Real-time sync between CLI and UI** | File watcher + WebSocket + efficient diffing, use timestamps to detect changes |
| **Large diagram rendering** | Virtual canvas, lazy loading, Web Workers for parsing, canvas-based rendering |
| **Maintaining markdown structure** | Round-trip parsing, preserve formatting, AST manipulation, format on save |
| **AI assistant integration** | Execute commands via Claude Code API or subprocess, stream output |
| **Traceability graph performance** | Use React Flow with virtualization, optimize rendering, limit visible nodes |
| **Concurrent CLI + UI edits** | File locking, conflict detection, merge strategies, user notifications |
| **Cross-platform compatibility** | Test on Windows/Mac/Linux, use cross-platform paths, handle line endings |

---

## 10. Success Metrics

### Adoption Metrics
- % of ArcKit users using UI (target: 60% within 6 months)
- Daily active users
- Feature usage statistics

### Efficiency Metrics
- Time saved in project management (target: 30% reduction)
- Documents created per hour
- Navigation time reduction

### Quality Metrics
- User satisfaction scores (target: 8/10)
- Bug reports per week
- Feature requests

### Technical Metrics
- Page load times (target: < 2s)
- API response times (target: < 200ms)
- Zero data corruption incidents
- Uptime (target: 99.9% for local server)

---

## 11. Future Enhancements

### Phase 2 Features (Post-Launch)

**Collaboration**:
- Real-time multi-user editing (CRDT-based)
- Comments and annotations
- Activity feed with user avatars
- @mentions in documents

**Integrations**:
- Jira (sync requirements as issues)
- Azure DevOps (work items)
- GitHub Issues (link to repos)
- Confluence (export to wiki)
- ServiceNow API (auto-create CIs, incidents)

**AI Enhancements**:
- AI recommendations (suggest next steps)
- Gap detection (missing requirements)
- Smart templates (learn from past projects)
- Natural language queries ("Show me all security requirements")

**Advanced Visualizations**:
- 3D architecture diagrams
- Animated Wardley Map transitions
- Interactive risk heat maps
- Timeline views for project phases

**Mobile**:
- iOS/Android companion app (read-only initially)
- Push notifications for updates
- Offline mode with sync

**Developer Tools**:
- VS Code extension (ArcKit sidebar)
- Browser extension (quick access)
- API webhooks
- CLI plugins

**Enterprise Features**:
- SSO integration (SAML, OIDC)
- Audit logging
- Compliance reports
- Custom workflows
- Role-based access control

---

## 12. Technology Deep Dive

### Frontend Stack Details

**Next.js 14 Configuration**:
```typescript
// next.config.js
module.exports = {
  experimental: {
    appDir: true,
  },
  rewrites: async () => [
    {
      source: '/api/:path*',
      destination: 'http://localhost:8000/api/:path*',
    },
  ],
}
```

**Key Dependencies**:
```json
{
  "@tanstack/react-query": "^5.0.0",
  "react-markdown": "^9.0.0",
  "mermaid": "^10.6.0",
  "react-flow": "^11.10.0",
  "d3": "^7.8.0",
  "zustand": "^4.4.0",
  "shadcn/ui": "^0.8.0",
  "tailwindcss": "^3.4.0",
  "framer-motion": "^10.16.0"
}
```

### Backend Stack Details

**FastAPI Application**:
```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler

app = FastAPI(title="ArcKit API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# File watcher
class ProjectFileHandler(FileSystemEventHandler):
    def on_modified(self, event):
        # Parse and broadcast updates
        pass
```

**Key Dependencies**:
```toml
[dependencies]
fastapi = "^0.104.0"
uvicorn = "^0.24.0"
pydantic = "^2.5.0"
watchdog = "^3.0.0"
markdown = "^3.5.0"
python-frontmatter = "^1.0.0"
websockets = "^12.0"
```

---

## 13. File Structure

```
arc-kit/
├── frontend/                  # Next.js frontend
│   ├── app/
│   │   ├── (dashboard)/
│   │   │   ├── page.tsx      # Dashboard
│   │   │   └── projects/
│   │   │       └── [id]/
│   │   │           ├── page.tsx          # Project detail
│   │   │           ├── requirements/     # Requirements view
│   │   │           ├── traceability/     # Traceability view
│   │   │           └── vendors/          # Vendor comparison
│   │   ├── layout.tsx
│   │   └── globals.css
│   ├── components/
│   │   ├── dashboard/
│   │   ├── project/
│   │   ├── requirements/
│   │   ├── diagrams/
│   │   ├── chat/
│   │   └── ui/              # Shadcn components
│   ├── lib/
│   │   ├── api.ts           # API client
│   │   ├── parsers.ts       # Markdown parsers
│   │   └── utils.ts
│   ├── hooks/
│   │   ├── useProjects.ts
│   │   ├── useRequirements.ts
│   │   └── useWebSocket.ts
│   ├── package.json
│   └── tsconfig.json
│
├── backend/                   # FastAPI backend
│   ├── app/
│   │   ├── main.py           # FastAPI app
│   │   ├── api/
│   │   │   ├── projects.py
│   │   │   ├── requirements.py
│   │   │   ├── documents.py
│   │   │   └── ai.py
│   │   ├── models/
│   │   │   ├── project.py
│   │   │   ├── requirement.py
│   │   │   └── document.py
│   │   ├── services/
│   │   │   ├── parser.py     # Markdown parser
│   │   │   ├── watcher.py    # File watcher
│   │   │   └── cli.py        # CLI integration
│   │   └── core/
│   │       ├── config.py
│   │       └── websocket.py
│   ├── requirements.txt
│   └── pyproject.toml
│
├── src/arckit_cli/           # Existing CLI (unchanged)
├── templates/                # Existing templates
├── scripts/                  # Existing scripts
├── .claude/                  # Existing commands
└── docker-compose.yml        # Docker setup for UI
```

---

## 14. Getting Started Guide (Post-Implementation)

### For Users

**Option 1: Run Local Server**
```bash
# Install ArcKit with UI
pip install arckit-cli[ui]

# Navigate to your project
cd my-architecture-project

# Start the UI
arckit serve

# Browser opens automatically to http://localhost:3000
```

**Option 2: Desktop App**
```bash
# Download from releases
# https://github.com/tractorjuice/arc-kit/releases

# Install and run
# Double-click ArcKit.app (Mac)
# Double-click ArcKit.exe (Windows)
# ./ArcKit.AppImage (Linux)
```

### For Developers

**Development Setup**:
```bash
# Clone repo
git clone https://github.com/tractorjuice/arc-kit.git
cd arc-kit

# Install dependencies
cd frontend && npm install
cd ../backend && pip install -r requirements.txt

# Run in development mode
# Terminal 1: Backend
cd backend && uvicorn app.main:app --reload

# Terminal 2: Frontend
cd frontend && npm run dev

# Open http://localhost:3000
```

---

## 15. Migration Path

### For Existing Users

**Phase 1: Opt-in (v0.4.0)**
- UI is optional, CLI remains primary
- `arckit serve` command added
- No breaking changes to existing workflow
- Documentation updated with UI guides

**Phase 2: Recommended (v0.5.0)**
- UI recommended for visualization tasks
- CLI recommended for document generation
- Hybrid workflow documentation
- Video tutorials

**Phase 3: Integrated (v0.6.0)**
- UI and CLI fully integrated
- Seamless switching between interfaces
- Feature parity achieved
- User can choose preferred interface

---

## 16. Open Questions & Decisions Needed

1. **Desktop App Priority**: Should we build Electron app in Phase 1 or Phase 5?
2. **Database**: Do we need a SQLite cache for performance, or pure file-based?
3. **Authentication**: Add in Phase 1 or defer to cloud deployment?
4. **Mermaid vs Custom**: Use Mermaid.js or build custom diagram renderer?
5. **AI Integration**: Direct Claude API integration or subprocess to CLI?
6. **Testing Strategy**: E2E tests with Playwright? Unit tests with Vitest?
7. **Documentation**: Separate docs site or in-app documentation?
8. **Telemetry**: Add anonymous usage analytics (opt-in)?

---

## 17. Risk Assessment

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| **Data corruption from concurrent edits** | Medium | High | File locking, conflict detection, backup on every save |
| **Performance with large projects** | Medium | Medium | Pagination, virtualization, lazy loading, indexing |
| **Markdown round-trip fidelity** | High | High | Extensive testing, preserve exact formatting, AST-based editing |
| **AI assistant integration complexity** | Medium | Medium | Start with subprocess approach, iterate to direct API |
| **Cross-platform compatibility issues** | Low | Medium | CI/CD testing on all platforms, use cross-platform libraries |
| **User resistance to new interface** | Medium | Low | Make UI optional, preserve CLI workflow, gather feedback early |
| **Scope creep** | High | Medium | Strict phase boundaries, defer non-critical features |

---

## 18. Budget & Resources

### Development Resources

**Team Composition** (Recommended):
- 1x Full-stack Developer (lead)
- 1x Frontend Developer (React/Next.js)
- 1x Backend Developer (Python/FastAPI)
- 1x UI/UX Designer (part-time)
- 1x QA Engineer (part-time)

**Or Solo Developer**:
- 20-24 weeks full-time
- Focus on Phase 1-3 first
- Phase 4-5 as iterative improvements

### Infrastructure

**Development**:
- GitHub repo (existing)
- Vercel preview deployments (free)
- Local development only

**Production** (if cloud-deployed):
- Vercel (frontend): $20/month
- Railway (backend): $20/month
- Total: $40/month for cloud option

---

## 19. Conclusion

This UI implementation will transform ArcKit from a CLI-only tool into a comprehensive platform that combines the power of AI-assisted document generation with modern visual interfaces. The phased approach ensures we deliver value incrementally while maintaining backward compatibility with existing workflows.

**Key Success Factors**:
1. Maintain CLI as first-class interface
2. Preserve markdown file-based architecture
3. Focus on visualization and navigation
4. Seamless real-time sync
5. Enterprise-grade UX

**Next Steps**:
1. Review and approve this plan
2. Set up development environment
3. Create design mockups for key screens
4. Start Phase 1 implementation
5. Gather feedback from beta users

---

**Document Status**: Draft for Review
**Author**: Claude Code
**Review Date**: TBD
**Approval**: Pending
