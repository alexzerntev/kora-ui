import { useEffect, useRef } from 'react'
import type { TeamMember, AgentMember } from '../data/team'
import type { Role } from '../data/roles'
import type { Task } from '../data/tasks'
import { getRoleById } from '../data/roles'

type EntityData =
  | { kind: 'person'; data: TeamMember }
  | { kind: 'agent'; data: AgentMember }
  | { kind: 'role'; data: Role }
  | { kind: 'task'; data: Task }

interface Props {
  entity: EntityData
  onClose: () => void
}

/* ── Shared sub-components ── */

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        fontSize: 11,
        fontWeight: 600,
        color: '#6b7280',
        textTransform: 'uppercase',
        letterSpacing: '0.06em',
        marginBottom: 8,
        marginTop: 20,
      }}
    >
      {children}
    </div>
  )
}

function FieldRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'baseline',
        padding: '6px 0',
        fontSize: 13,
        borderBottom: '1px solid rgba(0,0,0,0.04)',
      }}
    >
      <span style={{ color: '#6b7280', fontWeight: 500, flexShrink: 0, marginRight: 16 }}>{label}</span>
      <span style={{ color: '#111827', textAlign: 'right' }}>{children}</span>
    </div>
  )
}

function Chip({ children, color }: { children: React.ReactNode; color?: string }) {
  return (
    <span
      style={{
        fontSize: 12,
        fontWeight: 500,
        color: color ?? '#374151',
        background: '#f3f4f6',
        padding: '3px 10px',
        borderRadius: 6,
        lineHeight: 1.4,
        whiteSpace: 'nowrap',
        display: 'inline-block',
      }}
    >
      {children}
    </span>
  )
}

function ChipList({ items, color }: { items: string[]; color?: string }) {
  if (items.length === 0) return <span style={{ color: '#9ca3af', fontSize: 13 }}>None</span>
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
      {items.map((item) => (
        <Chip key={item} color={color}>
          {item}
        </Chip>
      ))}
    </div>
  )
}

function StatusDot({ status }: { status: string }) {
  const color =
    status === 'busy' || status === 'running'
      ? '#f59e0b'
      : status === 'idle'
        ? '#10b981'
        : status === 'completed'
          ? '#10b981'
          : status === 'failed'
            ? '#ef4444'
            : '#d1d5db'
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
      <span
        style={{
          width: 7,
          height: 7,
          borderRadius: '50%',
          background: color,
          display: 'inline-block',
          flexShrink: 0,
        }}
      />
      <span style={{ textTransform: 'capitalize' }}>{status}</span>
    </span>
  )
}

function LongText({ text }: { text: string }) {
  return (
    <div
      style={{
        fontSize: 13,
        color: '#374151',
        lineHeight: 1.6,
        background: '#f9fafb',
        borderRadius: 8,
        padding: '10px 14px',
        border: '1px solid rgba(0,0,0,0.04)',
        whiteSpace: 'pre-wrap',
      }}
    >
      {text}
    </div>
  )
}

/* ── Entity renderers ── */

function PersonDetail({ data }: { data: TeamMember }) {
  const channelEntries = Object.entries(data.channels)
  return (
    <>
      <SectionLabel>General</SectionLabel>
      <FieldRow label="Name">{data.name}</FieldRow>
      <FieldRow label="Role">{data.role}</FieldRow>
      <FieldRow label="Status">
        <StatusDot status={data.status} />
      </FieldRow>
      <FieldRow label="Email">{data.email || <span style={{ color: '#9ca3af' }}>N/A</span>}</FieldRow>

      {channelEntries.length > 0 && (
        <>
          <SectionLabel>Channels</SectionLabel>
          {channelEntries.map(([ch, val]) => (
            <FieldRow key={ch} label={ch}>
              {val}
            </FieldRow>
          ))}
        </>
      )}

      <SectionLabel>Capabilities</SectionLabel>
      <ChipList items={data.capabilities} color="#7c3aed" />
    </>
  )
}

function AgentDetail({ data }: { data: AgentMember }) {
  return (
    <>
      <SectionLabel>General</SectionLabel>
      <FieldRow label="Name">{data.name}</FieldRow>
      <FieldRow label="Role">{data.role}</FieldRow>
      <FieldRow label="Status">
        <StatusDot status={data.status} />
      </FieldRow>
      <FieldRow label="Model">{data.model}</FieldRow>

      <SectionLabel>Budget</SectionLabel>
      <FieldRow label="Max Budget">${data.budget.maxBudgetUsd.toFixed(2)}</FieldRow>
      <FieldRow label="Max Turns">{data.budget.maxTurns}</FieldRow>

      <SectionLabel>System Prompt</SectionLabel>
      <LongText text={data.prompt} />

      {data.requiresApproval.length > 0 && (
        <>
          <SectionLabel>Requires Approval</SectionLabel>
          <ChipList items={data.requiresApproval} color="#ef4444" />
        </>
      )}

      <SectionLabel>Capabilities</SectionLabel>
      <ChipList items={data.capabilities} color="#0891b2" />

      {data.memory.length > 0 && (
        <>
          <SectionLabel>Memory</SectionLabel>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {data.memory.map((m) => (
              <div
                key={m.id}
                style={{
                  fontSize: 13,
                  color: '#374151',
                  background: '#f9fafb',
                  borderRadius: 8,
                  padding: '8px 12px',
                  border: '1px solid rgba(0,0,0,0.04)',
                }}
              >
                <div>{m.content}</div>
                <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 4 }}>{m.timestamp}</div>
              </div>
            ))}
          </div>
        </>
      )}

      {data.taskRuns.length > 0 && (
        <>
          <SectionLabel>Task Runs</SectionLabel>
          <div style={{ overflowX: 'auto' }}>
            <table
              style={{
                width: '100%',
                fontSize: 13,
                borderCollapse: 'collapse',
              }}
            >
              <thead>
                <tr
                  style={{
                    borderBottom: '1px solid rgba(0,0,0,0.08)',
                    color: '#6b7280',
                    fontWeight: 600,
                    fontSize: 11,
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                  }}
                >
                  <th style={{ textAlign: 'left', padding: '6px 8px 6px 0' }}>Task</th>
                  <th style={{ textAlign: 'left', padding: '6px 8px' }}>Status</th>
                  <th style={{ textAlign: 'left', padding: '6px 8px' }}>Started</th>
                  <th style={{ textAlign: 'right', padding: '6px 0 6px 8px' }}>Duration</th>
                </tr>
              </thead>
              <tbody>
                {data.taskRuns.map((run) => (
                  <tr key={run.id} style={{ borderBottom: '1px solid rgba(0,0,0,0.04)' }}>
                    <td style={{ padding: '8px 8px 8px 0', color: '#111827' }}>{run.taskName}</td>
                    <td style={{ padding: '8px' }}>
                      <StatusDot status={run.status} />
                    </td>
                    <td style={{ padding: '8px', color: '#6b7280' }}>{run.startedAt}</td>
                    <td style={{ padding: '8px 0 8px 8px', color: '#6b7280', textAlign: 'right' }}>
                      {run.duration ?? '--'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </>
  )
}

function RoleDetail({ data }: { data: Role }) {
  const reportsToRole = data.reportsTo ? getRoleById(data.reportsTo) : undefined
  return (
    <>
      <SectionLabel>General</SectionLabel>
      <FieldRow label="Title">{data.title}</FieldRow>
      <FieldRow label="Name (slug)">{data.name}</FieldRow>
      <FieldRow label="Team">{data.team ?? <span style={{ color: '#9ca3af' }}>N/A</span>}</FieldRow>
      <FieldRow label="AI Eligible">{data.aiEligible ? 'Yes' : 'No'}</FieldRow>
      <FieldRow label="Reports To">
        {reportsToRole ? reportsToRole.title : <span style={{ color: '#9ca3af' }}>None</span>}
      </FieldRow>

      <SectionLabel>Required Capabilities</SectionLabel>
      <ChipList items={data.requiredCapabilities} color="#1d4ed8" />

      <SectionLabel>Optional Capabilities</SectionLabel>
      <ChipList items={data.optionalCapabilities} color="#6b7280" />
    </>
  )
}

function TaskDetail({ data }: { data: Task }) {
  return (
    <>
      <SectionLabel>General</SectionLabel>
      <FieldRow label="Name">{data.name}</FieldRow>

      <SectionLabel>Description</SectionLabel>
      <LongText text={data.description} />

      <SectionLabel>Refs / Tools</SectionLabel>
      <ChipList items={data.refs} color="#16a34a" />
    </>
  )
}

/* ── Type badge colors ── */

const TYPE_BADGE: Record<EntityData['kind'], { label: string; bg: string; color: string }> = {
  person: { label: 'Person', bg: '#f5f3ff', color: '#7c3aed' },
  agent: { label: 'Agent', bg: '#ecfeff', color: '#0891b2' },
  role: { label: 'Role', bg: '#eff6ff', color: '#1d4ed8' },
  task: { label: 'Task', bg: '#f0fdf4', color: '#16a34a' },
}

/* ── Main modal ── */

export function EntityDetailModal({ entity, onClose }: Props) {
  const panelRef = useRef<HTMLDivElement>(null)
  const badge = TYPE_BADGE[entity.kind]

  // Close on Escape key
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [onClose])

  // Close on backdrop click
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
      onClose()
    }
  }

  const title =
    entity.kind === 'person' || entity.kind === 'agent'
      ? entity.data.name
      : entity.kind === 'role'
        ? (entity.data as Role).title
        : (entity.data as Task).name

  return (
    <div
      onClick={handleBackdropClick}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(0,0,0,0.3)',
        backdropFilter: 'blur(4px)',
        fontFamily: "'DM Sans', system-ui, sans-serif",
        animation: 'modal-fade-in 0.15s ease',
      }}
    >
      <div
        ref={panelRef}
        style={{
          background: '#ffffff',
          borderRadius: 12,
          boxShadow: '0 8px 32px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.06)',
          width: '100%',
          maxWidth: 500,
          maxHeight: 'calc(100vh - 80px)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          animation: 'modal-slide-up 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px 20px',
            borderBottom: '1px solid rgba(0,0,0,0.06)',
            flexShrink: 0,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
            <span
              style={{
                fontSize: 11,
                fontWeight: 600,
                color: badge.color,
                background: badge.bg,
                padding: '3px 8px',
                borderRadius: 6,
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
                flexShrink: 0,
              }}
            >
              {badge.label}
            </span>
            <span
              style={{
                fontSize: 16,
                fontWeight: 700,
                color: '#111827',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {title}
            </span>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              width: 28,
              height: 28,
              borderRadius: 6,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#9ca3af',
              fontSize: 18,
              lineHeight: 1,
              flexShrink: 0,
              transition: 'background 0.15s ease, color 0.15s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#f3f4f6'
              e.currentTarget.style.color = '#374151'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'none'
              e.currentTarget.style.color = '#9ca3af'
            }}
          >
            &#x2715;
          </button>
        </div>

        {/* Body */}
        <div
          style={{
            padding: '4px 20px 24px',
            overflowY: 'auto',
          }}
        >
          {entity.kind === 'person' && <PersonDetail data={entity.data as TeamMember} />}
          {entity.kind === 'agent' && <AgentDetail data={entity.data as AgentMember} />}
          {entity.kind === 'role' && <RoleDetail data={entity.data as Role} />}
          {entity.kind === 'task' && <TaskDetail data={entity.data as Task} />}
        </div>
      </div>
    </div>
  )
}

export type { EntityData }
