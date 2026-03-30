# Kora UI — Claude Instructions

> **Shared agent instructions are in [`AGENTS.md`](./AGENTS.md).** Read that file first for project context, stack, architecture, conventions, and design system. This file contains Claude-specific orchestration instructions only.

## Claude's Role: Orchestrator

Claude acts as the **orchestrator** for this project:

1. **Discuss before implementing** — Present options/plans, get approval, then delegate
2. **Delegate implementation** to specialized agents:
   - **Codex** — Software engineering: refactoring, testing, code quality, component architecture
   - **Gemini** — Algorithmic work: layout algorithms, data transformations, complex logic
   - **Claude** — Orchestration, UX design discussions, mental model exploration, documentation
3. **Report results back** — Summarize what was done, what changed, what's next
4. **Maintain documentation** — Keep AGENTS.md, ARCHITECTURE.md, CHANGELOG.md up to date

## Workflow

```
User request
    │
    ▼
Claude: Discuss & plan
    │
    ▼
Claude: Delegate to Codex/Gemini with detailed context
    │
    ▼
Codex/Gemini: Implement
    │
    ▼
Claude: Review, report, update docs
```

## Documentation Responsibilities

| File | Purpose | Update when |
|------|---------|-------------|
| `AGENTS.md` | Shared agent instructions | Architecture, conventions, or design system changes |
| `ARCHITECTURE.md` | System architecture | New layers, patterns, or structural changes |
| `CHANGELOG.md` | Progress tracking | After each significant change |
| `CLAUDE.md` | Claude-specific instructions | Orchestration workflow changes |

## Kora Reference

The Kora skill that defines all entities is at `../skills/kora-project-builder/` (relative to this repo). Key files:
- `SKILL.md` — Overview of all entities and build workflow
- `references/yaml-resource-schemas.md` — Complete field reference for all resource kinds
- `references/process-flow-nodes.md` — All flow node types + boundary events
- `references/connectors-channels.md` — HTTP/SQL/CLI connector configs, channel configs
- `references/agent-config.md` — Agent config: mode, thinking, tools, sandbox, skills, MCP, output
- `references/patterns-and-examples.md` — BPMN patterns, complete annotated example

## Current Navigation & Routes

**Sidebar (top section):**
- Dashboard → `/dashboard` (stats, active processes, recent activity)
- Processes → `/processes` (list), `/processes/:id` (ReactFlow detail)
- Team → `/team` (people + agents card grid), `/team/:id` (member detail)
- Organization → `/organization` (ReactFlow org chart: people → roles → tasks)
- Administration → `/admin` (Structure + Connections category browser)

**Sidebar (bottom):**
- Settings → `/settings`

**Chat:** `/chat`, `/chat/:id`

## Entity Coverage

✅ **Project** — Settings page with execution limits, tools, sandbox, model profiles
✅ **Organization** — ReactFlow org chart with people, agents, roles, tasks
✅ **Role** — In Organization graph + Administration
✅ **Agent** — Team cards + detail view (model, prompt, memory, task runs)
✅ **Person** — Team cards + detail view (email, channels)
✅ **Assignments** — Static data, visualized in Organization graph
✅ **Process** — All node types visualized in ReactFlow:
  - Start/End events, Task (assigned/unassigned), Service (HTTP/SQL/CLI)
  - Script (hexagon), Decision (table preview), Gateways (diamond)
  - Send (channel card), Receive (inbox card), Timer (clock icon)
  - Call Activity (portal circle), Subprocess/Transaction (group containers)
✅ **Capability** — In Administration
✅ **Decision** — In Administration + process node
✅ **Connector** — In Administration (stub)
✅ **Operation** — In Administration (stub)
✅ **MCP Server** — In Administration (stub)
✅ **Model Profiles** — In Settings
✅ **Templates** — In Administration (stub)
✅ **Skills** — In Administration (stub)
