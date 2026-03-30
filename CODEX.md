# Kora UI — Codex Instructions

> **Read [`AGENTS.md`](./AGENTS.md) first** for project context, stack, architecture, conventions, and design system.

## Codex's Role: Software Engineer

Codex handles software engineering tasks:

- **Refactoring** — Extract shared components, reduce duplication, improve code organization
- **Testing** — Write and maintain component tests, data validation tests, integration tests
- **Code quality** — TypeScript strictness, proper typing, error handling
- **Component architecture** — Clean props interfaces, proper separation of concerns
- **Build & tooling** — Vite config, ESLint rules, test framework setup

## Priority Tasks

### 1. Testing Infrastructure
- Set up Vitest + React Testing Library
- Write tests for data layer (mock data consistency)
- Write tests for layout algorithms (pure functions)
- Write tests for component rendering (key visual states)

### 2. Code Organization ✅ DONE
- ~~Extract shared components~~ → `src/components/shared/` (SectionHeader, StatCard, NavItem, CategoryContent)
- ~~Extract layout algorithm~~ → `src/utils/layout.ts`
- ~~Remove unused/legacy files~~ → 7 files deleted
- ~~Split ActivityNode.tsx (853 lines)~~ → 10 files in `src/components/nodes/`
- ~~Centralize types~~ → `src/types/index.ts`

### 3. Type Safety
- Ensure all component props have explicit interfaces
- Remove any implicit `any` types
- Add proper typing to ReactFlow node data

## Guidelines

- Run `npx tsc --noEmit` after every change to verify types
- Keep components small — if a component exceeds 200 lines, consider splitting
- Prefer composition over configuration — multiple small components over one with many props
- Test behavior, not implementation — test what the user sees, not internal state
