import { useState } from 'react'
import { NavItem } from '../components/shared/NavItem'
import { CategoryContent } from '../components/shared/CategoryContent'
import { DataTable } from '../components/shared/DataTable'
import type { Column } from '../components/shared/DataTable'
import {
  useRoles,
  useTasks,
  useDecisions,
  useSkills,
  useConnectors,
  useOperations,
  useMcpServers,
  useTemplates,
} from '../providers'
import type { Role, Task, Decision, Skill, Connector, Operation, McpServer, Template } from '../providers'
import { TbUserCircle, TbLayoutList, TbTable, TbSparkles, TbPlug, TbServer, TbApi, TbTemplate } from 'react-icons/tb'

/* ------------------------------------------------------------------ */
/*  Categories                                                         */
/* ------------------------------------------------------------------ */

const STRUCTURE_CATEGORIES = [
  {
    id: 'roles',
    title: 'Roles',
    icon: <TbUserCircle size={16} />,
    description: 'Define who does what — capabilities required, AI eligibility, and reporting lines.',
  },
  {
    id: 'tasks',
    title: 'Capabilities',
    icon: <TbLayoutList size={16} />,
    description: 'What agents and people can do — skills, tools, and expertise that get matched to roles.',
  },
  {
    id: 'decisions',
    title: 'Decisions',
    icon: <TbTable size={16} />,
    description: 'Business rule tables — conditions and outcomes that route data through your processes.',
  },
  {
    id: 'skills',
    title: 'Skills',
    icon: <TbSparkles size={16} />,
    description: 'Reusable skill files that agents can use during task execution for specialized knowledge.',
  },
]

const CONNECTION_CATEGORIES = [
  {
    id: 'connectors',
    title: 'Connectors',
    icon: <TbPlug size={16} />,
    description: 'HTTP APIs, SQL databases, and CLI tools — configure how processes talk to external systems.',
  },
  {
    id: 'operations',
    title: 'Operations',
    icon: <TbApi size={16} />,
    description: 'Reusable actions on connectors — API calls, database queries, and CLI commands used by processes.',
  },
  {
    id: 'mcp',
    title: 'MCP Servers',
    icon: <TbServer size={16} />,
    description: 'Model Context Protocol servers that provide tools to agents during execution.',
  },
  {
    id: 'templates',
    title: 'Templates',
    icon: <TbTemplate size={16} />,
    description: 'Notification templates for email, Slack, Teams, and other channels used by Send nodes.',
  },
]

/* ------------------------------------------------------------------ */
/*  Column definitions                                                 */
/* ------------------------------------------------------------------ */

const roleColumns: Column<Role>[] = [
  {
    key: 'title',
    header: 'Title',
    width: '1.5fr',
    render: (r) => <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-foreground)' }}>{r.title}</span>,
  },
  {
    key: 'team',
    header: 'Team',
    render: (r) => <span style={{ fontSize: 13, color: 'var(--color-foreground-secondary)' }}>{r.team ?? '—'}</span>,
  },
  {
    key: 'aiEligible',
    header: 'AI Eligible',
    width: '0.7fr',
    render: (r) => (
      <span style={{ fontSize: 13, color: 'var(--color-foreground-secondary)' }}>{r.aiEligible ? 'Yes' : 'No'}</span>
    ),
  },
  {
    key: 'capabilities',
    header: 'Required Capabilities',
    width: '2fr',
    render: (r) => (
      <span style={{ fontSize: 13, color: 'var(--color-foreground-muted)' }}>{r.requiredCapabilities.join(', ')}</span>
    ),
  },
]

const taskColumns: Column<Task>[] = [
  {
    key: 'name',
    header: 'Name',
    width: '1.2fr',
    render: (t) => <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-foreground)' }}>{t.name}</span>,
  },
  {
    key: 'description',
    header: 'Description',
    width: '2fr',
    render: (t) => <span style={{ fontSize: 13, color: 'var(--color-foreground-secondary)' }}>{t.description}</span>,
  },
  {
    key: 'refs',
    header: 'Refs / Tools',
    width: '1.5fr',
    render: (t) => <span style={{ fontSize: 13, color: 'var(--color-foreground-muted)' }}>{t.refs.join(', ')}</span>,
  },
]

const decisionColumns: Column<Decision>[] = [
  {
    key: 'name',
    header: 'Name',
    width: '1.2fr',
    render: (d) => <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-foreground)' }}>{d.name}</span>,
  },
  {
    key: 'description',
    header: 'Description',
    width: '2fr',
    render: (d) => <span style={{ fontSize: 13, color: 'var(--color-foreground-secondary)' }}>{d.description}</span>,
  },
  {
    key: 'hitPolicy',
    header: 'Hit Policy',
    width: '0.8fr',
    render: (d) => (
      <span
        style={{
          fontSize: 12,
          fontWeight: 500,
          color: 'var(--color-foreground-muted)',
          textTransform: 'capitalize',
        }}
      >
        {d.hitPolicy}
      </span>
    ),
  },
  {
    key: 'rules',
    header: 'Rules',
    width: '0.5fr',
    render: (d) => <span style={{ fontSize: 13, color: 'var(--color-foreground-muted)' }}>{d.rulesCount}</span>,
  },
]

const skillColumns: Column<Skill>[] = [
  {
    key: 'name',
    header: 'Name',
    width: '1fr',
    render: (s) => <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-foreground)' }}>{s.name}</span>,
  },
  {
    key: 'description',
    header: 'Description',
    width: '3fr',
    render: (s) => <span style={{ fontSize: 13, color: 'var(--color-foreground-secondary)' }}>{s.description}</span>,
  },
]

const connectorColumns: Column<Connector>[] = [
  {
    key: 'name',
    header: 'Name',
    width: '1fr',
    render: (c) => <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-foreground)' }}>{c.name}</span>,
  },
  {
    key: 'type',
    header: 'Type',
    width: '0.6fr',
    render: (c) => (
      <span
        style={{
          fontSize: 12,
          fontWeight: 500,
          color: 'var(--color-foreground-muted)',
          textTransform: 'uppercase',
        }}
      >
        {c.type}
      </span>
    ),
  },
  {
    key: 'description',
    header: 'Description',
    width: '2.5fr',
    render: (c) => <span style={{ fontSize: 13, color: 'var(--color-foreground-secondary)' }}>{c.description}</span>,
  },
]

const operationColumns: Column<Operation>[] = [
  {
    key: 'name',
    header: 'Name',
    width: '1fr',
    render: (o) => <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-foreground)' }}>{o.name}</span>,
  },
  {
    key: 'connector',
    header: 'Connector',
    width: '0.8fr',
    render: (o) => <span style={{ fontSize: 13, color: 'var(--color-foreground-secondary)' }}>{o.connector}</span>,
  },
  {
    key: 'action',
    header: 'Action',
    width: '1.2fr',
    render: (o) => (
      <span
        style={{
          fontSize: 12,
          fontFamily: 'monospace',
          color: 'var(--color-foreground-muted)',
        }}
      >
        {o.action}
      </span>
    ),
  },
  {
    key: 'description',
    header: 'Description',
    width: '2fr',
    render: (o) => <span style={{ fontSize: 13, color: 'var(--color-foreground-secondary)' }}>{o.description}</span>,
  },
]

const mcpColumns: Column<McpServer>[] = [
  {
    key: 'name',
    header: 'Name',
    width: '1fr',
    render: (m) => <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-foreground)' }}>{m.name}</span>,
  },
  {
    key: 'transport',
    header: 'Transport',
    width: '1fr',
    render: (m) => (
      <span style={{ fontSize: 12, fontFamily: 'monospace', color: 'var(--color-foreground-muted)' }}>
        {m.transport}
      </span>
    ),
  },
  {
    key: 'url',
    header: 'URL',
    width: '2fr',
    render: (m) => (
      <span style={{ fontSize: 12, fontFamily: 'monospace', color: 'var(--color-foreground-muted)' }}>{m.url}</span>
    ),
  },
]

const templateColumns: Column<Template>[] = [
  {
    key: 'name',
    header: 'Name',
    width: '1fr',
    render: (t) => <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-foreground)' }}>{t.name}</span>,
  },
  {
    key: 'channel',
    header: 'Channel',
    width: '0.7fr',
    render: (t) => <span style={{ fontSize: 13, color: 'var(--color-foreground-secondary)' }}>{t.channel}</span>,
  },
  {
    key: 'description',
    header: 'Description',
    width: '2.5fr',
    render: (t) => <span style={{ fontSize: 13, color: 'var(--color-foreground-secondary)' }}>{t.description}</span>,
  },
]

/* ------------------------------------------------------------------ */
/*  Section content renderer                                           */
/* ------------------------------------------------------------------ */

function SectionContent({ categoryId }: { categoryId: string }) {
  const { data: roles } = useRoles()
  const { data: tasks } = useTasks()
  const { data: decisions } = useDecisions()
  const { data: skills } = useSkills()
  const { data: connectors } = useConnectors()
  const { data: operations } = useOperations()
  const { data: mcpServers } = useMcpServers()
  const { data: templates } = useTemplates()

  switch (categoryId) {
    case 'roles':
      return roles ? <DataTable columns={roleColumns} data={roles} rowKey={(r) => r.id} /> : null
    case 'tasks':
      return tasks ? <DataTable columns={taskColumns} data={tasks} rowKey={(t) => t.id} /> : null
    case 'decisions':
      return decisions ? <DataTable columns={decisionColumns} data={decisions} rowKey={(d) => d.id} /> : null
    case 'skills':
      return skills ? <DataTable columns={skillColumns} data={skills} rowKey={(s) => s.id} /> : null
    case 'connectors':
      return connectors ? <DataTable columns={connectorColumns} data={connectors} rowKey={(c) => c.id} /> : null
    case 'operations':
      return operations ? <DataTable columns={operationColumns} data={operations} rowKey={(o) => o.id} /> : null
    case 'mcp':
      return mcpServers ? <DataTable columns={mcpColumns} data={mcpServers} rowKey={(m) => m.id} /> : null
    case 'templates':
      return templates ? <DataTable columns={templateColumns} data={templates} rowKey={(t) => t.id} /> : null
    default:
      return null
  }
}

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
            width: 200,
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
          <CategoryContent title={selected.title} description={selected.description}>
            <SectionContent categoryId={selected.id} />
          </CategoryContent>
        </div>
      </div>
    </div>
  )
}
