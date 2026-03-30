# Changelog — Kora UI

All notable changes to this project are documented here.

---

## 2026-03-30 — Codebase Reorganization

### Deleted unused files
- `SideNav.tsx`, `AnimatedEmoji.tsx`, `Team-old.tsx`, `Decisions.tsx`, `Connectors.tsx`, `Structure.tsx`, `Connections.tsx`

### New directory structure
- `src/components/nodes/` — All ReactFlow node components (14 files, split from 853-line ActivityNode.tsx monolith)
- `src/components/shared/` — Reusable UI: SectionHeader, StatCard, NavItem, CategoryContent
- `src/types/index.ts` — Centralized type re-exports from data files
- `src/utils/layout.ts` — Layout algorithm functions extracted from WorkflowDetail

### Documentation
- Created `AGENTS.md` — Shared AI agent instructions
- Created `ARCHITECTURE.md` — System architecture documentation
- Created `CODEX.md` — Codex-specific instructions
- Created `GEMINI.md` — Gemini-specific instructions
- Created `CHANGELOG.md` — This file
- Updated `CLAUDE.md` — Orchestrator role, delegation workflow

---

## 2026-03-30 — Process Nodes & Navigation Redesign

### Process Nodes (all types implemented)
- **Start Event** — Green circle with mail/clock/play icon
- **End Event** — Gray circle with flag+checkmark icon (merged error+success into one)
- **Task Node** — Card with assignee area (avatar+name+role) or unassigned placeholder; purple border + "Task" tab; colored role pills; hover background tint
- **Service Nodes** — Three connector types as pure icons: HTTP (globe, blue), SQL (database, purple), CLI (terminal+gear, green)
- **Script Node** — Code monitor icon inside hexagon with gray border
- **Decision Node** — Card with orange border + "Decision" tab; mini rule table preview (when/result columns, 2 rows + fade-out "+N more")
- **Exclusive Gateway** — SVG rounded diamond with X inside, blue, 72px
- **Send Node** — Card with green border + "Send" tab; channel icon in socket area (Slack/Email/Teams/WhatsApp/Webhook)
- **Receive Node** — Card with teal border + "Receive" tab; inbox icon in socket area
- **Timer Node** — Pure amber clock icon with human-readable duration below
- **Call Activity** — Circle with route icon, drop shadow, "process-name process call" label
- **Subprocess** — Group container (indigo border + tab) with real child nodes using ReactFlow parentId
- **Transaction** — Group container (emerald border + tab) with real child nodes

### Edge Labels
- Outgoing edges from gateways show condition labels (e.g., "score >= 80", "default")

### Card Node Design System
- All card-style nodes (Task, Decision, Send, Receive) have: colored border, type tab (bookmark above card), icon + label
- Differentiated by color: Task=purple, Decision=orange, Send=green, Receive=teal

### Navigation Redesign
- Added **Dashboard** as landing page with stat cards + active processes + recent activity
- Added **Organization** page — ReactFlow org chart with people/agents in groups, roles, tasks; interactive edge highlighting on hover
- Added **Administration** page — merged Structure + Connections into one; left nav with two sections (Structure: Roles/Tasks/Capabilities/Decisions/Skills; Connections: Connectors/Operations/MCP/Templates)
- Renamed sidebar brand from "Offload" to "Kora"
- Removed Tasks from main nav (moved to Administration)
- Updated nav items: Dashboard, Processes, Team, Organization, Administration, Settings

### Team Page
- Redesigned as card grid with large avatar areas (200px), name+badge, role, capability pills
- Fixed card heights for consistency

### Data Model
- Refactored `WorkflowTask` → `WorkflowNode` with `kind` field (FlowNodeKind union type)
- Renamed `tasks` → `nodes` in Workflow interface
- Added `parentId`, `extent`, `style` to WorkflowNode for sub-flow support
- Added `assignments.ts` with static role-to-member mappings
- Added connector type metadata (http/sql/cli) to service nodes

### Style
- Added ReactFlow node border override (removed default black borders)
- Consistent node sizing per type via `getNodeDimsForNode()`

---

## 2026-03-28 — Initial Entity Coverage

### Pages Created
- Settings page with execution limits, tools, sandbox network
- Team page with role sockets and card decks
- Member detail with person/agent-specific views
- Workflow list with progress bars
- Workflow detail with ReactFlow canvas
- Chat with artifact panel (team + workflow animations)

### Design System Established
- Plus Jakarta Sans font
- Color palette: human (purple), agent (teal), status colors
- Sidebar: collapsible, 252px → 56px
- Card patterns: content-card, deck-card with hover effects
- Custom workflow edges: idle/active/done states with animations
