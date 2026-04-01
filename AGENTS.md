# Agent Instructions — Kora UI

Shared instructions for all AI agents (Claude, Codex, Gemini, etc.) working on this codebase.

## Project Summary

Kora UI is the frontend for **Kora** — a YAML-based workflow orchestration platform with BPMN processes, human-AI collaboration, connectors, and channels. Built with React 19, TypeScript, Vite, Tailwind 4, and ReactFlow.

## Principles

1. **UX-first** — Design for user experience. Don't mirror backend entity model 1:1.
2. **Show don't tell** — Use visual cues (icons, colors, shapes) over text labels where possible.
3. **Minimal cognitive load** — Each node/card/component should be instantly recognizable by shape and color.
4. **Codex-minimal aesthetic** — Light theme inspired by Codex (OpenAI). Frosted glass sidebar, barely-there UI, maximum content focus.
5. **No speculative abstractions** — Only build what's needed now. No premature helpers or utilities.
6. **Design tokens everywhere** — All colors, shadows, borders, radii MUST reference CSS variables from `@theme` in `index.css`. No hardcoded hex colors in components.

## Stack

| Layer | Tech |
|-------|------|
| Framework | React 19, TypeScript (strict) |
| Build | Vite 8 |
| Styling | Tailwind CSS 4 (`@theme` directive), CSS variables, inline styles |
| Diagrams | ReactFlow (@xyflow/react) with custom nodes/edges |
| Icons | react-icons (Tabler `Tb*` — outlined style, consistent stroke) |
| Avatars | DiceBear (@dicebear/core + @dicebear/collection) |
| Routing | react-router-dom v7 |
| Font | DM Sans (loaded via `<link>` in index.html) |

## Design System

### Aesthetic: Codex-Minimal Glassy
- **Font**: DM Sans — warmer and rounder than Inter, professional but not cold
- **Background**: Warm off-white `#fafaf9` (body), white `#fff` (surfaces)
- **Foreground**: `#111827` (primary), `#374151` (secondary), `#6b7280` (muted)
- **Borders**: `rgba(0,0,0,0.06)` (standard), `rgba(0,0,0,0.03)` (very light)
- **Shadows**: Barely perceptible — `0 1px 2px rgba(0,0,0,0.03)`
- **Radius**: 6-12px (avoid large radii — feels less professional)
- **Sidebar**: Translucent frosted glass — `rgba(255,255,255,0.6)` + `backdrop-filter: blur(20px)`
- **Hover states**: Subtle background shift `rgba(0,0,0,0.03-0.04)`, smooth 0.12s transitions
- **Active nav**: Faint background `rgba(0,0,0,0.04)` + darker text `#111827`, no accent bars

### Colors — Use Design Tokens
All colors MUST use CSS variables defined in `src/index.css` `@theme` block:

| Token | Value | Usage |
|-------|-------|-------|
| `--color-foreground` | `#111827` | Primary text |
| `--color-foreground-secondary` | `#374151` | Secondary text, labels |
| `--color-foreground-muted` | `#6b7280` | Muted text, timestamps |
| `--color-border` | `rgba(0,0,0,0.06)` | Standard borders |
| `--color-border-light` | `rgba(0,0,0,0.03)` | Very subtle borders |
| `--color-status-done` | `#10b981` | Completed/success |
| `--color-status-processing` | `#f59e0b` | In progress/warning |
| `--color-status-failed` | `#ef4444` | Failed/error |
| `--color-primary` | `#1d4ed8` | Primary accent (buttons, links) |
| `--color-human` | `#6d28d9` | Human/person entities |
| `--color-agent` | `#0891b2` | Agent/AI entities |

**Never hardcode hex colors in components.** Use `var(--color-*)` or `var(--shadow-*)`.

### Tailwind CSS 4 — Important Notes
- Design tokens are defined in `@theme { }` in `src/index.css`
- **CRITICAL**: Do NOT add a manual `* { margin: 0; padding: 0; }` CSS reset. Tailwind 4's preflight handles this. Adding one outside `@layer` overrides ALL Tailwind utility classes due to cascade layer precedence.
- Font is loaded via `<link>` in `index.html`, NOT via `@import` in CSS. CSS `@import url(...)` before `@import "tailwindcss"` breaks Tailwind processing.

## Data Provider Layer

All data access goes through the provider interface. **Never import directly from `src/data/*.ts` in pages/components** (except types).

```
UI Components (pages)
    ↓ calls hooks
React Hooks (useProcesses, useTeam, etc.)
    ↓ uses context
DataProvider (React Context)
    ↓ delegates to
MockDataProvider (static data from src/data/*.ts)
```

### Key files:
- `src/providers/types.ts` — DataProvider interface + entity type exports
- `src/providers/MockDataProvider.ts` — Mock implementation
- `src/providers/hooks.ts` — React hooks (useProcesses, useTeam, useRoles, useTasks, useAllRuns, etc.)
- `src/providers/context.ts` — React context
- `src/providers/DataContext.tsx` — Provider wrapper component

### Provider methods include:
- `getWorkflows()`, `getWorkflow(id)` — Process definitions
- `getTeam()`, `getTeamMember(id)` — People + Agents
- `getRoles()`, `getTasks()`, `getAssignments()` — Org entities
- `getAllRuns()`, `getRunsForWorkflow(id)` — Run instances
- `getProcessRuns()`, `getPendingActions()`, `getActivityFeed()` — Dashboard data
- `runProcess(id, args?)` — Trigger a process
- `subscribe(callback)` — Real-time event subscription

### Event system:
- `DataEvent` type for real-time updates (process.started/completed/failed, task.assigned/completed)
- MockDataProvider simulates events every 8-15 seconds
- `useSubscription()` hook for consuming events

## Architecture

### File Structure

```
src/
├── components/
│   ├── nodes/                # ReactFlow custom node components (14 files)
│   ├── shared/               # Reusable UI components
│   │   ├── FloatingHeader.tsx   # Frosted glass floating header bar
│   │   ├── CollapsiblePanel.tsx # Animated collapsible panel
│   │   ├── RunProcessButton.tsx # Run button with expandable args form
│   │   ├── FilterChips.tsx      # Generic filter pill group
│   │   ├── DataTable.tsx        # Configurable table with typed columns
│   │   ├── Pagination.tsx       # Page navigation with prev/next
│   │   ├── StatusBadge.tsx      # Colored status pill
│   │   ├── StatusIcon.tsx       # Status indicator icons
│   │   ├── SectionHeader.tsx    # Icon + title + count badge
│   │   ├── NavItem.tsx          # Sidebar nav item
│   │   └── CategoryContent.tsx  # Category detail panel
│   ├── EntityDetailModal.tsx  # Modal showing full entity data
│   ├── Layout.tsx             # Main shell: translucent sidebar + content
│   ├── Chat.tsx               # Chat interface
│   └── Avatar.tsx             # DiceBear avatar wrapper
├── pages/
│   ├── Dashboard.tsx          # Greeting (minimal, to be expanded)
│   ├── Workflows.tsx          # Process definitions table (DataTable)
│   ├── WorkflowDetail.tsx     # Process detail: top bar + ReactFlow canvas
│   ├── Runs.tsx               # All run instances table (DataTable + filters)
│   ├── Organization.tsx       # ReactFlow org chart (people → roles → tasks)
│   ├── Administration.tsx     # Structure + Connections category browser
│   ├── Settings.tsx           # Project manifest editor
│   ├── MemberDetail.tsx       # Person/Agent detail view
│   └── Tasks.tsx              # Capability card grid
├── providers/                 # Data provider layer
│   ├── types.ts               # DataProvider interface + entity types
│   ├── MockDataProvider.ts    # Mock implementation
│   ├── hooks.ts               # React hooks
│   ├── context.ts             # React context
│   ├── DataContext.tsx         # Provider wrapper
│   └── index.ts               # Barrel exports
├── contexts/
│   └── OrgHoverContext.ts     # Org chart hover state context
├── data/                      # Mock data (imported by MockDataProvider only)
│   ├── team.ts, roles.ts, tasks.ts, workflows.ts, assignments.ts, project.ts
│   ├── runs.ts                # ProcessRun instances (20 mock runs)
│   └── activity.ts            # ActivityEntry instances
├── utils/
│   ├── layout.ts              # ReactFlow layout helpers
│   └── orgLayout.ts           # Barycenter edge crossing minimization
├── index.css                  # Design system tokens (@theme) + global styles
├── App.tsx                    # Router + DataProviderComponent wrapper
└── main.tsx                   # Entry point
```

### Navigation (sidebar)
- Assistant → `/chat` (with recent chat sessions below divider)
- Processes → `/processes`
- Runs → `/runs`
- Organization → `/organization`
- Administration → `/admin`
- Settings → `/settings`

### Component Selection Rule
When a UI component is needed (button, dialog, table, dropdown, tooltip, etc.):
1. **First check if shadcn/ui has it** — run `npx shadcn@latest add <component>` to install. shadcn components live in `src/components/ui/`.
2. **Only if shadcn doesn't have it**, create a custom component in `src/components/shared/`.
3. Never build custom versions of components that shadcn already provides.

### Reusable Shared Components
When building new pages, use these shared components:
- **DataTable** — for any tabular data (typed columns, row click, hover)
- **FilterChips** — for status/type filter groups
- **Pagination** — for paginated lists
- **StatusBadge** — for colored status pills
- **StatusIcon** — for status dot/check/x/pause icons
- **FloatingHeader** — for frosted glass overlay headers (org chart, etc.)
- **RunProcessButton** — for triggering processes with optional args form

## Conventions

### Code Style
- Functional components only (no classes)
- TypeScript strict mode
- Props via destructuring, interfaces defined near usage
- `useMemo` for computed ReactFlow nodes/edges
- Inline styles for layout, CSS classes for interactive states
- No `any` types
- All colors via CSS variables (no hardcoded hex)

### Naming
- Components: PascalCase (`DeskNode`, `DataTable`)
- Files: PascalCase for components/pages, camelCase for data/utils
- CSS classes: kebab-case (`content-card`, `page-header`)
- Data constants: SCREAMING_SNAKE (`TEAM`, `ROLES`, `WORKFLOWS`)

### ReactFlow Patterns
- Custom nodes register in `nodeTypes` object
- Handles: `background: 'transparent', border: 'none', width: 1, height: 1`
- Topological layering for auto-layout
- Sub-flows use `parentId` + `extent: 'parent'`
- Org chart uses barycenter heuristic for edge crossing minimization

### Data Access
- Pages use hooks from `src/providers/hooks.ts` — NEVER import from `src/data/*.ts` directly
- Types can be imported from `src/providers/types.ts`
- Add loading states when using async hooks

## Verification — Run After Every Change

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

## What NOT to Do

- Don't add a state management library without explicit approval
- Don't change the design system tokens without discussion
- Don't add new dependencies without justification
- Don't refactor working code that isn't being modified
- Don't add comments to code you didn't write
- Don't create abstraction layers for one-time patterns
- Don't hardcode colors — use CSS variables from `@theme`
- Don't add `* { padding: 0 }` CSS reset — breaks Tailwind 4
- Don't use `@import url(...)` in CSS before `@import "tailwindcss"`
- Don't import mock data directly in pages — use provider hooks
