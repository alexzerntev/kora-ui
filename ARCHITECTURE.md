# Architecture — Kora UI

## System Overview

```
┌─────────────────────────────────────────────────┐
│                   Browser                        │
│                                                  │
│  ┌──────────┐  ┌─────────────────────────────┐  │
│  │ Sidebar  │  │      Main Content Area       │  │
│  │          │  │                               │  │
│  │ Dashboard│  │  ┌─────────────────────────┐ │  │
│  │ Processes│  │  │   Page Component         │ │  │
│  │ Team     │  │  │   (routed via App.tsx)   │ │  │
│  │ Org      │  │  │                          │ │  │
│  │ Admin    │  │  │   Uses:                  │ │  │
│  │          │  │  │   - data/*.ts (mock)     │ │  │
│  │ ──────── │  │  │   - components/*.tsx     │ │  │
│  │ Chat     │  │  │   - index.css (styles)   │ │  │
│  │ ──────── │  │  └─────────────────────────┘ │  │
│  │ Settings │  │                               │  │
│  └──────────┘  └─────────────────────────────┘  │
│                                                  │
└─────────────────────────────────────────────────┘
```

## Layers

### 1. Routing Layer (`App.tsx`)
Single-level React Router configuration. All routes render inside `Layout.tsx` which provides the sidebar shell. Routes marked as "full-bleed" skip the padding wrapper (chat, workflow detail, team, organization).

### 2. Page Layer (`src/pages/`)
Each page is a self-contained component that:
- Imports data directly from `src/data/*.ts`
- Composes components from `src/components/`
- Manages its own local state via `useState`

No shared state between pages. No context providers (except ReactFlow's internal ones).

### 3. Component Layer (`src/components/`)
Reusable presentational components. Two categories:

**Shell components:**
- `Layout.tsx` — sidebar + content wrapper

**Node components** (`components/nodes/`):
- `DeskNode.tsx` — Task node (assigned/unassigned)
- `EventNode.tsx` — Start/End events
- `GatewayNode.tsx` — Exclusive/Parallel gateways
- `ActivityNode.tsx` — Router dispatching to specialized nodes:
  - `ServiceNode.tsx`, `ScriptNode.tsx`, `DecisionNode.tsx`
  - `SendNode.tsx`, `ReceiveNode.tsx`, `TimerNode.tsx`
  - `CallNode.tsx`, `SubprocessNode.tsx`, `TransactionNode.tsx`
- `WorkflowEdge.tsx` — Custom edge with 3 states + labels

**Shared components** (`components/shared/`):
- `SectionHeader.tsx` — Icon + title + count badge
- `StatCard.tsx` — Stat card with number, icon, click action
- `NavItem.tsx` — Category nav item with icon + count
- `CategoryContent.tsx` — Category detail panel

**Other components:**
- `Avatar.tsx` — DiceBear wrapper
- `Chat.tsx`, `TeamArtifact.tsx`, `WorkflowArtifact.tsx` — Chat UI

### 4. Data Layer (`src/data/`)
TypeScript files exporting:
- **Interfaces** — Type definitions for all entities
- **Constants** — Mock data arrays (`TEAM`, `ROLES`, `TASKS`, `WORKFLOWS`, etc.)
- **Helpers** — Lookup functions (`getMemberById`, `getRoleById`, etc.)

No API calls. No async data fetching. All data is synchronous and in-memory.

### 5. Style Layer (`src/index.css`)
Global CSS with:
- Tailwind 4 import
- CSS custom properties (theme tokens)
- Component classes (cards, buttons, badges)
- Animations (keyframes)
- ReactFlow overrides

## Data Flow

```
Mock Data (src/data/*.ts)
    │
    ▼
Page Component (useState, useMemo)
    │
    ▼
UI Components (props-driven, presentational)
    │
    ▼
DOM / ReactFlow Canvas
```

No bi-directional data flow. No event bus. No pub/sub. Components receive data via props and render it.

## ReactFlow Architecture

The workflow visualization uses ReactFlow with:

### Custom Node Types (`components/nodes/`)
```typescript
const nodeTypes = {
  desk: DeskNode,        // Task nodes (cards with assignee)
  event: EventNode,      // Start/End circles
  gateway: GatewayNode,  // Diamond decision points
  activity: ActivityNode, // Router → Service/Script/Decision/Send/Receive/Timer/Call/Subprocess/Transaction
}
```

ActivityNode acts as a router, dispatching to specialized components based on `data.kind`. Each sub-node is in its own file under `components/nodes/`.

### Layout Algorithm (`utils/layout.ts` + `WorkflowDetail.tsx`)
1. Find root nodes (no incoming edges)
2. BFS to assign layer numbers
3. Group nodes by layer (columns)
4. Position nodes vertically within each layer, centered
5. Handle varying node dimensions per type
6. Child nodes (subprocess/transaction) positioned relative to parent

### Sub-flows
Uses ReactFlow's native `parentId` + `extent: 'parent'` pattern for subprocess and transaction nodes. Child nodes are positioned inside the parent's bounds.

## Key Design Decisions

| Decision | Rationale |
|----------|-----------|
| No state management library | App is read-only with mock data. useState suffices. Revisit when backend is added. |
| Inline styles over CSS modules | Fast iteration during design exploration. Components own their styles. |
| Custom ReactFlow nodes per type | Each Kora node type has unique visual requirements. Generic nodes would need excessive conditionals. |
| Mock data in TypeScript | Type-safe, importable, no JSON parsing. Easy to replace with API calls later. |
| Full-bleed routes | Some pages (workflow canvas, org chart) need the entire viewport. Layout detects this per-route. |
| No testing yet | Focus has been on visual design and UX exploration. Testing infrastructure is next priority. |

## Future Architecture (planned)

```
API Layer (fetch/axios)
    │
    ▼
Data Hooks (useQuery / custom hooks)
    │
    ▼
Page Components
    │
    ▼
UI Components
```

When backend integration happens:
1. Replace `src/data/*.ts` imports with data-fetching hooks
2. Add loading/error states to pages
3. Add optimistic updates for mutations
4. Consider React Query or SWR for caching
