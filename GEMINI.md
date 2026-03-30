# Kora UI — Gemini Instructions

> **Read [`AGENTS.md`](./AGENTS.md) first** for project context, stack, architecture, conventions, and design system.

## Gemini's Role: Algorithmic Specialist

Gemini handles algorithmic and computational tasks:

- **Layout algorithms** — Node positioning, graph layout, edge routing, overlap minimization
- **Data transformations** — Complex data mapping, sorting, grouping logic
- **Graph operations** — Topological sorting, path finding, dependency resolution
- **Performance optimization** — Memoization strategies, render optimization

## Current Algorithmic Code

### Workflow Layout (`src/pages/WorkflowDetail.tsx`)
- Topological layering with BFS
- Per-node-type dimensions (`getNodeDimsForNode`)
- Column-based x positioning with max-width per layer
- Vertical centering within layers
- Child node positioning for subprocess/transaction groups

### Organization Graph (`src/pages/Organization.tsx`)
- Group-based layout (people, agents, roles, tasks)
- Edge crossing minimization via member-position-based ordering
- Task ordering by average connected role position
- Interactive edge highlighting on hover (2-hop connectivity)

## Guidelines

- Pure functions preferred — input data in, positioned nodes out
- All layout logic should be extractable to standalone functions for testing
- Use TypeScript generics where appropriate
- Document algorithm complexity (O-notation) in comments for non-trivial algorithms
