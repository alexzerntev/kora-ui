import { useState } from 'react'
import { ROLES } from '../data/roles'
import { TASKS } from '../data/tasks'
import { NavItem } from '../components/shared/NavItem'
import { CategoryContent } from '../components/shared/CategoryContent'
import {
  TbUserCircle,
  TbLayoutList,
  TbPuzzle,
  TbTable,
  TbSparkles,
  TbPlug,
  TbServer,
  TbApi,
  TbTemplate,
} from 'react-icons/tb'

/* ------------------------------------------------------------------ */
/*  Categories                                                         */
/* ------------------------------------------------------------------ */

const STRUCTURE_CATEGORIES = [
  {
    id: 'roles',
    title: 'Roles',
    count: ROLES.length,
    icon: <TbUserCircle size={16} />,
    color: '#7c3aed',
    bg: '#f5f3ff',
    description: 'Define who does what — capabilities required, AI eligibility, and reporting lines.',
  },
  {
    id: 'tasks',
    title: 'Tasks',
    count: TASKS.length,
    icon: <TbLayoutList size={16} />,
    color: '#2563eb',
    bg: '#eff6ff',
    description: 'Capabilities and how work gets done — agent configs, human configs, and approval flows.',
  },
  {
    id: 'capabilities',
    title: 'Capabilities',
    count: TASKS.length,
    icon: <TbPuzzle size={16} />,
    color: '#059669',
    bg: '#ecfdf5',
    description: 'What agents and people can do — skills, tools, and expertise that get matched to roles.',
  },
  {
    id: 'decisions',
    title: 'Decisions',
    count: 2,
    icon: <TbTable size={16} />,
    color: '#ea580c',
    bg: '#fff7ed',
    description: 'Business rule tables — conditions and outcomes that route data through your processes.',
  },
  {
    id: 'skills',
    title: 'Skills',
    count: 2,
    icon: <TbSparkles size={16} />,
    color: '#0891b2',
    bg: '#ecfeff',
    description: 'Reusable skill files that agents can use during task execution for specialized knowledge.',
  },
]

const CONNECTION_CATEGORIES = [
  {
    id: 'connectors',
    title: 'Connectors',
    count: 3,
    icon: <TbPlug size={16} />,
    color: '#2563eb',
    bg: '#eff6ff',
    description: 'HTTP APIs, SQL databases, and CLI tools — configure how processes talk to external systems.',
  },
  {
    id: 'operations',
    title: 'Operations',
    count: 5,
    icon: <TbApi size={16} />,
    color: '#ea580c',
    bg: '#fff7ed',
    description: 'Reusable actions on connectors — API calls, database queries, and CLI commands used by processes.',
  },
  {
    id: 'mcp',
    title: 'MCP Servers',
    count: 1,
    icon: <TbServer size={16} />,
    color: '#7c3aed',
    bg: '#f5f3ff',
    description: 'Model Context Protocol servers that provide tools to agents during execution.',
  },
  {
    id: 'templates',
    title: 'Templates',
    count: 3,
    icon: <TbTemplate size={16} />,
    color: '#0891b2',
    bg: '#ecfeff',
    description: 'Notification templates for email, Slack, Teams, and other channels used by Send nodes.',
  },
]

/* ------------------------------------------------------------------ */
/*  Administration Page                                                */
/* ------------------------------------------------------------------ */

export function Administration() {
  const allCategories = [...STRUCTURE_CATEGORIES, ...CONNECTION_CATEGORIES]
  const [selectedId, setSelectedId] = useState(allCategories[0].id)
  const selected = allCategories.find((c) => c.id === selectedId) ?? allCategories[0]

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', width: '100%' }}>
      <header className="page-header">
        <h1>Administration</h1>
        <p>Structure, connections, and organizational building blocks</p>
      </header>

      <div style={{ display: 'flex', gap: 32 }}>
        {/* Left nav */}
        <div
          style={{
            width: 220,
            flexShrink: 0,
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          }}
        >
          {/* Structure section */}
          <div
            style={{
              fontSize: 10,
              fontWeight: 700,
              color: 'var(--color-foreground-muted)',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              padding: '0 12px 6px',
            }}
          >
            Structure
          </div>
          {STRUCTURE_CATEGORIES.map((cat) => (
            <NavItem
              key={cat.id}
              category={cat}
              selected={cat.id === selectedId}
              onClick={() => setSelectedId(cat.id)}
            />
          ))}

          {/* Connections section */}
          <div
            style={{
              fontSize: 10,
              fontWeight: 700,
              color: 'var(--color-foreground-muted)',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              padding: '16px 12px 6px',
            }}
          >
            Connections
          </div>
          {CONNECTION_CATEGORIES.map((cat) => (
            <NavItem
              key={cat.id}
              category={cat}
              selected={cat.id === selectedId}
              onClick={() => setSelectedId(cat.id)}
            />
          ))}
        </div>

        {/* Right content */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <CategoryContent category={selected} />
        </div>
      </div>
    </div>
  )
}
