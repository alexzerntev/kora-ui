# Kora UI

Frontend for **Kora** — a YAML-based workflow orchestration platform with BPMN processes, human-AI collaboration, connectors, and channels.

## Principles

- **UX-first:** Design for user experience, use Kora as storage. Don't mirror backend entity model 1:1.
- **Orchestrator pattern:** Claude acts as orchestrator — delegate coding to subagents with detailed context, report results back. Wait for explicit instructions before starting work.
- **Discuss before implementing:** Present options/plans, get approval, then delegate.

## Stack

React 19, TypeScript, Vite, Tailwind 4, ReactFlow (@xyflow/react), dnd-kit (@dnd-kit/core), react-icons, DiceBear avatars (@dicebear/core + @dicebear/collection), lottie-react

## Kora Reference

The Kora skill that defines all entities is at `../skills/kora-project-builder/` (relative to this repo). Key files:
- `SKILL.md` — Overview of all entities and build workflow
- `references/yaml-resource-schemas.md` — Complete field reference for all resource kinds
- `references/process-flow-nodes.md` — All flow node types + boundary events
- `references/connectors-channels.md` — HTTP/SQL/CLI connector configs, channel configs
- `references/agent-config.md` — Agent config: mode, thinking, tools, sandbox, skills, MCP, output
- `references/patterns-and-examples.md` — BPMN patterns, complete annotated example

## Kora Entity Coverage

✅ **Project** — Settings page (`/settings`) with execution limits, tools, sandbox network egress rules
✅ **Organization** — Organization page (`/team`) with single org/team for now
✅ **Role** — Shown as "sockets" (dashed-border drop targets) on Organization page
✅ **Agent** — Detail view shows model, budget, requiresApproval + existing prompt/memory/taskRuns
✅ **Person** — Detail view shows email, channels + existing role description
✅ **Assignments** — Client-side drag-drop state on Organization page (not persisted yet)
⬜ **Capability** — Tasks page exists but only has name/description/refs. Missing agentConfig/humanConfig
⬜ **Process** — Processes page exists with ReactFlow graph but simplified. Missing start events, gateways, typed data schemas, boundary events
⬜ **Connector** — Not started (stub page exists at src/pages/Connectors.tsx)
⬜ **Operation** — Not started
⬜ **Decision** — Not started (stub page exists at src/pages/Decisions.tsx)
⬜ **MCP Server** — Not started
⬜ **Model Profiles** — Not started
⬜ **Templates** — Not started
⬜ **Skills** — Not started

## Navigation & Routes

**Sidebar (top section):**
- Processes → `/processes` (list), `/processes/:id` (ReactFlow detail)
- Organization → `/team` (role sockets + people/agents decks), `/team/:id` (member detail)
- Tasks → `/tasks` (card grid)

**Sidebar (bottom):**
- Settings → `/settings`

**Chat:** `/chat`, `/chat/:id` — centered welcome → bottom-anchored on send. Artifact panel (left, 50%) with tabs (Team artifact with animated new member + speech bubbles, Workflow artifact with progressive node reveal).

## Key Files

### Components
- `src/components/Layout.tsx` — Collapsible sidebar, full-bleed detection for chat/processes-detail/team
- `src/components/Chat.tsx` — Chat with artifact panel, tabs, typing indicator
- `src/components/TeamArtifact.tsx` — Animated team member addition with speech bubbles
- `src/components/WorkflowArtifact.tsx` — Progressive ReactFlow node reveal
- `src/components/WorkflowEdge.tsx` — Custom edge: 3-state (idle/active/done), layered track + animated pulse + endpoint dots
- `src/components/DeskNode.tsx` — Custom ReactFlow node for workflow detail
- `src/components/Avatar.tsx` — DiceBear avataaars wrapper

### Pages
- `src/pages/Team.tsx` — Organization page: role sockets (scrollable) + horizontal card decks (people left, agents right) with dnd-kit drag-drop
- `src/pages/MemberDetail.tsx` — Person/Agent detail with enriched Kora properties
- `src/pages/Tasks.tsx` — Task/Capability card grid (to be enriched with agentConfig/humanConfig)
- `src/pages/Workflows.tsx` — Process list with progress bars
- `src/pages/WorkflowDetail.tsx` — Full-bleed ReactFlow canvas with floating header
- `src/pages/Settings.tsx` — Project manifest: General, Execution Limits, Builtin Tools, Sandbox Network
- `src/pages/Team-old.tsx` — Previous Team page design (kept for reference)

### Data
- `src/data/project.ts` — Project manifest types + mock data
- `src/data/team.ts` — TeamMember, AgentMember types + TEAM array + TYPE_COLORS (human: purple, agent: teal)
- `src/data/roles.ts` — Role type + ROLES array (5 roles) + getRoleById
- `src/data/tasks.ts` — Task type + TASKS array (5 tasks)
- `src/data/workflows.ts` — Workflow types + WORKFLOWS array (2 workflows)

### Styles
- `src/index.css` — CSS variables, sidebar tokens, shared classes (content-card, deck-card, deck-wrapper, back-btn, page-header, section-label, status-badge, chat bubbles, typing indicator, artifact panel/tabs, speech bubbles, animations)

## Design Decisions

- **Role = "socket" metaphor:** Dashed-border cards that people/agents get dragged into
- **People:** Initials in purple rounded squares (not avatars). Color: `{ light: '#f5f3ff', dark: '#7c3aed' }`
- **Agents:** DiceBear avataaars in teal areas. Color: `{ light: '#ecfeff', dark: '#0891b2' }`
- **Horizontal card decks:** Cards overlap with -160px marginLeft, hover lifts to foreground via `.deck-wrapper` z-index + `.deck-card` scale/shadow
- **Organization page is full-bleed:** Role sockets scroll (flex:1), people/agents pinned at bottom (flexShrink:0)
- **Process edges:** Custom WorkflowEdge — idle (dashed gray track), active (blue pulse traveling along path + glow), done (solid green)
- **Chat artifact:** Left side panel, 50% width, tabbed, slides in on first send
- **Sidebar:** Light theme (#f9f9f8), collapsible (252px → 56px), Settings pinned at bottom
- **Font:** Plus Jakarta Sans
- **CSS pattern:** Mix of CSS classes for hover/interactive states + inline styles for layout/spacing

## What to Work on Next

Remaining uncovered entities. Approach: UX-first — think about what the user needs to DO, then figure out which Kora entities surface. Likely groupings:
- **Capabilities:** Enrich Tasks page with agentConfig/humanConfig (the "how work gets done" view)
- **Processes:** Enrich with start events, gateways, typed data (the workflow builder)
- **Integrations:** Connectors + Operations (external system connections)
- **Intelligence:** MCP Servers, Model Profiles, Skills (AI configuration)
- **Automation:** Decisions, Templates (business rules + notifications)
