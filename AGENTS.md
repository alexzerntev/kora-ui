# Agent Instructions — Kora UI

Shared instructions for all AI agents (Claude, Codex, Gemini, etc.) working on this codebase.

## Project Summary

Kora UI is the frontend for **Kora** — a YAML-based workflow orchestration platform with BPMN processes, human-AI collaboration, connectors, and channels. Built with React 19, TypeScript, Vite, Tailwind 4, and ReactFlow.

## Principles

1. **UX-first** — Design for user experience. Don't mirror backend entity model 1:1.
2. **Show don't tell** — Use visual cues (icons, colors, shapes) over text labels where possible.
3. **Minimal cognitive load** — Each node/card/component should be instantly recognizable by shape and color.
4. **Clean, modern aesthetic** — Light theme, inspired by Codex/Claude/ChatGPT/Cursor. White backgrounds, subtle borders, clean typography.
5. **No speculative abstractions** — Only build what's needed now. No premature helpers or utilities.

## Stack

| Layer | Tech |
|-------|------|
| Framework | React 19, TypeScript (strict) |
| Build | Vite 8 |
| Styling | Tailwind CSS 4, CSS variables, inline styles |
| Diagrams | ReactFlow (@xyflow/react) with custom nodes/edges |
| Drag & Drop | dnd-kit (@dnd-kit/core) |
| Icons | react-icons (Tabler `tb`, Heroicons `hi2`, Remix `ri`) |
| Avatars | DiceBear (@dicebear/core + @dicebear/collection) |
| Routing | react-router-dom v7 |

## Architecture

See `ARCHITECTURE.md` for full details. Key points:

- **No backend yet** — All data is mock, defined in `src/data/*.ts`
- **No state management library** — React useState/useMemo only
- **No test framework yet** — To be added
- **CSS pattern** — Mix of CSS classes (for hover/interactive states in `index.css`) + inline styles (for layout/spacing)
- **ReactFlow custom nodes** — Each Kora node type has its own visual component

## File Structure

```
src/
├── components/
│   ├── nodes/              # ReactFlow custom node components
│   │   ├── ActivityNode.tsx   # Router + GenericActivityNode + ACTIVITY_CONFIG
│   │   ├── ServiceNode.tsx    # HTTP/SQL/CLI service nodes (pure icons)
│   │   ├── ScriptNode.tsx     # Hexagon with code monitor icon
│   │   ├── DecisionNode.tsx   # Card with mini rule table preview
│   │   ├── SendNode.tsx       # Card with channel icon (Slack/Email/etc)
│   │   ├── ReceiveNode.tsx    # Card with inbox icon
│   │   ├── TimerNode.tsx      # Clock icon with duration
│   │   ├── CallNode.tsx       # Portal circle with route icon
│   │   ├── SubprocessNode.tsx # Group container for child nodes
│   │   ├── TransactionNode.tsx# Group container with compensation
│   │   ├── DeskNode.tsx       # Task node (assigned/unassigned card)
│   │   ├── EventNode.tsx      # Start/End event circles
│   │   ├── GatewayNode.tsx    # Exclusive/Parallel gateway diamonds
│   │   └── WorkflowEdge.tsx   # Custom edge with idle/active/done + labels
│   ├── shared/             # Reusable UI components
│   │   ├── SectionHeader.tsx  # Icon + title + count badge
│   │   ├── StatCard.tsx       # Stat number card with icon
│   │   ├── NavItem.tsx        # Sidebar nav item with icon + count
│   │   └── CategoryContent.tsx# Category detail panel
│   ├── Layout.tsx          # Main shell: collapsible sidebar + content
│   ├── Chat.tsx            # Chat interface with artifact panel
│   ├── Avatar.tsx          # DiceBear avatar wrapper
│   ├── TeamArtifact.tsx    # Chat artifact: animated team member
│   └── WorkflowArtifact.tsx# Chat artifact: progressive node reveal
├── pages/                # Route-level page components
│   ├── Dashboard.tsx       # Stats overview + activity feed
│   ├── Workflows.tsx       # Process list with progress bars
│   ├── WorkflowDetail.tsx  # Full-bleed ReactFlow canvas
│   ├── Team.tsx            # People + Agents card grid
│   ├── MemberDetail.tsx    # Person/Agent detail view
│   ├── Organization.tsx    # ReactFlow org chart (people → roles → tasks)
│   ├── Administration.tsx  # Structure + Connections category browser
│   ├── Settings.tsx        # Project manifest editor
│   └── Tasks.tsx           # Capability card grid
├── data/                 # Mock data + TypeScript interfaces
│   ├── team.ts             # TeamMember, AgentMember, TYPE_COLORS
│   ├── roles.ts            # Role definitions
│   ├── tasks.ts            # Task/Capability definitions
│   ├── workflows.ts        # FlowNodeKind, WorkflowNode, Workflow
│   ├── assignments.ts      # Role → Member mappings
│   └── project.ts          # Project manifest types + mock data
├── types/                # Centralized type re-exports
│   └── index.ts            # Re-exports all entity types from data/
├── utils/                # Pure utility functions
│   └── layout.ts           # getReactFlowType, getNodeDimsForNode
├── index.css             # Global styles, CSS variables, animations
├── App.tsx               # Router configuration
└── main.tsx              # Entry point
```

## Design System

### Colors
- **Human (person)**: Purple `#7c3aed` / light `#f5f3ff`
- **Agent (AI)**: Teal `#0891b2` / light `#ecfeff`
- **Ink**: `#0d0d0d` (primary), `#666` (secondary), `#a0a0a0` (muted)
- **Status**: Done `#22c55e`, Processing `#f59e0b`, Failed `#ef4444`
- **Background**: White `#fff`, Surface `#fff`, Hover `#f9f9f8`

### Node Type Visual Language
| Node Type | Shape | Color | Distinguisher |
|-----------|-------|-------|---------------|
| Start Event | Circle | Green border | Mail/Clock/Play icon |
| End Event | Circle | Gray border | Flag+Check icon |
| Task | Card (220px) | Purple border + tab | Avatar area + role pills |
| Service (HTTP) | Pure icon | Blue | Globe icon |
| Service (SQL) | Pure icon | Purple | Database icon |
| Service (CLI) | Pure icon | Green | Terminal+Gear stacked icons |
| Script | Hexagon | Gray border | Code monitor icon (blue) |
| Decision | Card | Orange border + tab | Mini rule table preview |
| Exclusive Gateway | Diamond (SVG) | Blue | X inside |
| Parallel Gateway | Diamond (SVG) | Blue | + inside |
| Send | Card | Green border + tab | Channel icon (Slack/Email/etc) |
| Receive | Card | Teal border + tab | Inbox icon |
| Timer | Pure icon | Amber | Clock icon |
| Call Activity | Circle with shadow | Indigo | Route icon |
| Subprocess | Group container | Indigo border + tab | Contains child nodes |
| Transaction | Group container | Emerald border + tab | Contains child nodes |

### Card-style nodes have:
- Colored border around the whole card
- Type tab (bookmark) above the card with icon + label
- Content area below

## Conventions

### Code Style
- Functional components only (no classes)
- TypeScript strict mode
- Props via destructuring, interfaces defined near usage
- `useMemo` for computed ReactFlow nodes/edges
- Inline styles for layout, CSS classes for interactive states
- No `any` types

### Naming
- Components: PascalCase (`DeskNode`, `MemberCard`)
- Files: PascalCase for components/pages, camelCase for data
- CSS classes: kebab-case (`content-card`, `page-header`)
- Data constants: SCREAMING_SNAKE (`TEAM`, `ROLES`, `WORKFLOWS`)

### ReactFlow Patterns
- Custom nodes register in `nodeTypes` object
- Handles: `background: 'transparent', border: 'none', width: 1, height: 1`
- Topological layering for auto-layout
- Sub-flows use `parentId` + `extent: 'parent'`
- Edge labels via `foreignObject` in custom edge component

## Verification — Run After Every Change

After any code addition or edit, run all three checks:

```bash
npm run check        # runs all three below in sequence
```

Or individually:
```bash
npm run typecheck    # tsc --noEmit
npm run lint         # eslint .
npm run format:check # prettier --check
```

To auto-fix formatting:
```bash
npm run format       # prettier --write
```

**All three must pass before considering a change complete.**

## Testing Guidelines (to be implemented)

- Component tests: Verify render output, props, and visual states
- Data tests: Validate mock data consistency (e.g., all assignment IDs exist in TEAM)
- Integration tests: Route navigation, ReactFlow node interaction
- No snapshot tests (too brittle for this codebase)

## What NOT to Do

- Don't add a state management library (Redux, Zustand) without explicit approval
- Don't change the color system or design tokens without discussion
- Don't add new dependencies without justification
- Don't refactor working code that isn't being modified
- Don't add comments to code you didn't write
- Don't create abstraction layers for one-time patterns
