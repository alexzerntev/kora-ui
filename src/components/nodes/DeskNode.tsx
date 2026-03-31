import { Avatar } from '../Avatar'
import { HiUser, HiCheck } from 'react-icons/hi2'
import { RiRobot2Fill } from 'react-icons/ri'
import { TbSubtask } from 'react-icons/tb'
import { TEAM, TYPE_COLORS } from '../../data/team'
import type { NodeRunState } from '../../providers/types'
import { CardNode, NodeHandles } from './shared'

const ROLE_PILL_COLORS = [
  { bg: '#eff6ff', text: '#1d4ed8', border: '#bfdbfe' }, // blue
  { bg: '#f5f3ff', text: '#6d28d9', border: '#ddd6fe' }, // purple
  { bg: '#ecfdf5', text: '#047857', border: '#a7f3d0' }, // green
  { bg: '#fff7ed', text: '#c2410c', border: '#fed7aa' }, // orange
  { bg: '#fdf2f8', text: '#be185d', border: '#fbcfe8' }, // pink
  { bg: '#ecfeff', text: '#0e7490', border: '#a5f3fc' }, // cyan
]

const RUN_STATE_OPACITY: Record<NodeRunState, number> = {
  done: 0.85,
  running: 1,
  idle: 0.4,
  skipped: 0.15,
}

interface DeskNodeData {
  kind: string
  label: string
  taskId?: string
  assigneeId?: string
  assigneeName?: string
  assigneeSeed?: string
  assigneeType?: 'human' | 'agent'
  status: 'idle' | 'running' | 'done'
  meta?: Record<string, string>
  runState?: NodeRunState
}

/* -- Shared role pills + task title -- */

function TaskTitle({
  label,
  capability,
  isRunning,
  isDone,
}: {
  label: string
  capability?: string
  isRunning: boolean
  isDone: boolean
}) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
      <div>
        <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-ink)', lineHeight: 1.3 }}>{label}</div>
        {capability && (
          <div
            style={{
              fontSize: 11,
              color: '#999',
              marginTop: 2,
              fontFamily: 'ui-monospace, Consolas, monospace',
            }}
          >
            {capability}
          </div>
        )}
      </div>
      <div style={{ flexShrink: 0 }}>
        {isRunning && (
          <div
            style={{
              width: 12,
              height: 12,
              borderRadius: '50%',
              border: '2px solid #e0e7ff',
              borderTopColor: '#818cf8',
              animation: 'spin 0.8s linear infinite',
            }}
          />
        )}
        {isDone && <HiCheck size={13} style={{ color: '#22c55e' }} />}
      </div>
    </div>
  )
}

function RolePills({ roles }: { roles: string[] }) {
  if (roles.length === 0) return null
  return (
    <div>
      <div style={{ fontSize: 10, fontWeight: 500, color: '#aaa', marginBottom: 5 }}>Required roles</div>
      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
        {roles.map((role, i) => {
          const palette = ROLE_PILL_COLORS[i % ROLE_PILL_COLORS.length]
          return (
            <span
              key={role}
              style={{
                fontSize: 11,
                fontWeight: 500,
                color: palette.text,
                background: palette.bg,
                border: `1px solid ${palette.border}`,
                padding: '2px 8px',
                borderRadius: 6,
                fontFamily: 'ui-monospace, Consolas, monospace',
              }}
            >
              {role}
            </span>
          )
        })}
      </div>
    </div>
  )
}

/* -- Assigned task node (full card with avatar) -- */

function AssignedDeskNode({ data, isRunning, isDone }: { data: DeskNodeData; isRunning: boolean; isDone: boolean }) {
  const isHuman = data.assigneeType === 'human'
  const { light: colorLight } = TYPE_COLORS[data.assigneeType ?? 'agent']
  const memberData = data.assigneeId ? TEAM.find((m) => m.id === data.assigneeId) : undefined
  const rolesRaw = data.meta?.role ?? ''
  const roles = rolesRaw
    .split(',')
    .map((r) => r.trim())
    .filter(Boolean)
  const capability = data.meta?.capability

  const wrapperOpacity = data.runState ? RUN_STATE_OPACITY[data.runState] : isDone ? 0.5 : 1
  const borderColor = data.runState === 'done' ? '#10b981' : isRunning ? 'rgba(37,99,235,0.25)' : '#7c3aed'

  return (
    <div
      style={{
        opacity: wrapperOpacity,
        transition: 'opacity 0.3s',
        filter: data.runState === 'skipped' || data.runState === 'idle' ? 'grayscale(0.6)' : undefined,
      }}
    >
      <div
        onMouseEnter={(e) => {
          e.currentTarget.style.background = '#fafaf9'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = '#fff'
        }}
        style={{
          background: '#fff',
          borderRadius: 20,
          overflow: 'visible',
          border: `2px solid ${borderColor}`,
          position: 'relative',
          boxShadow: isRunning
            ? '0 0 0 4px rgba(37,99,235,0.04), 0 4px 16px rgba(0,0,0,0.08)'
            : '0 2px 12px rgba(0,0,0,0.06)',
          transition: 'background 0.15s',
        }}
      >
        {/* Assignee area */}
        <div
          style={{
            margin: 8,
            borderRadius: 14,
            padding: '16px 12px',
            background: colorLight,
            border: `1px solid ${TYPE_COLORS[data.assigneeType ?? 'agent'].dark}15`,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            overflow: 'hidden',
          }}
        >
          <div style={{ animation: isRunning ? 'worker-bob 2.5s ease-in-out infinite' : undefined }}>
            <Avatar seed={data.assigneeSeed ?? ''} size={56} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <span style={{ fontSize: 13, fontWeight: 650, color: 'var(--color-ink)' }}>
                {memberData?.name ?? data.assigneeName}
              </span>
              <span
                style={{
                  width: 16,
                  height: 16,
                  borderRadius: '50%',
                  background: isHuman ? 'var(--color-human)' : 'var(--color-agent)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  fontSize: 9,
                  flexShrink: 0,
                }}
              >
                {isHuman ? <HiUser /> : <RiRobot2Fill />}
              </span>
            </div>
            <span style={{ fontSize: 11, color: 'var(--color-ink-secondary)' }}>{memberData?.role ?? ''}</span>
          </div>
        </div>

        {/* Type tab */}
        <div
          style={{
            position: 'absolute',
            top: -20,
            left: 16,
            zIndex: 1,
            background: '#7c3aed',
            color: '#fff',
            fontSize: 10,
            fontWeight: 600,
            padding: '2px 8px 3px',
            borderRadius: '6px 6px 0 0',
            display: 'flex',
            alignItems: 'center',
            gap: 3,
          }}
        >
          <TbSubtask size={10} />
          Task
        </div>

        {/* Task content */}
        <div style={{ padding: '4px 16px 14px', display: 'flex', flexDirection: 'column', gap: 8 }}>
          <TaskTitle label={data.label} capability={capability} isRunning={isRunning} isDone={isDone} />
          <RolePills roles={roles} />
        </div>
      </div>
    </div>
  )
}

/* -- Router -- */

export function DeskNode({ data }: { data: DeskNodeData }) {
  const isRunning = data.runState ? data.runState === 'running' : data.status === 'running'
  const isDone = data.runState ? data.runState === 'done' : data.status === 'done'
  const hasAssignee = !!data.assigneeId

  const rolesRaw = data.meta?.role ?? ''
  const roles = rolesRaw
    .split(',')
    .map((r) => r.trim())
    .filter(Boolean)
  const capability = data.meta?.capability

  return (
    <div style={{ position: 'relative' }}>
      <NodeHandles />

      <div style={{ width: 220, position: 'relative' }}>
        {isRunning && (
          <div
            style={{
              position: 'absolute',
              inset: -8,
              borderRadius: hasAssignee ? 30 : 22,
              border: '2px solid rgba(37,99,235,0.1)',
              animation: 'ring-pulse 2.5s ease-in-out infinite',
              pointerEvents: 'none',
            }}
          />
        )}

        {hasAssignee ? (
          <AssignedDeskNode data={data} isRunning={isRunning} isDone={isDone} />
        ) : (
          <CardNode
            color="#7c3aed"
            tabIcon={<TbSubtask size={10} />}
            tabLabel="Task"
            status={data.status}
            runState={data.runState}
          >
            {/* Assignee placeholder -- same size as assigned area */}
            <div
              style={{
                margin: 8,
                borderRadius: 14,
                padding: '16px 12px',
                background: '#f7f7f6',
                border: '1.5px dashed #ddd',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
              }}
            >
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: '50%',
                  border: '1.5px dashed #ccc',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <div style={{ width: 18, height: 18, borderRadius: '50%', border: '1.5px dashed #ccc' }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                <span style={{ fontSize: 13, color: '#ccc', fontWeight: 600 }}>Unassigned</span>
                <span style={{ fontSize: 11, color: '#ddd' }}>&mdash;</span>
              </div>
            </div>

            {/* Task content */}
            <div style={{ padding: '4px 16px 14px', display: 'flex', flexDirection: 'column', gap: 8 }}>
              <TaskTitle label={data.label} capability={capability} isRunning={isRunning} isDone={isDone} />
              <RolePills roles={roles} />
            </div>
          </CardNode>
        )}
      </div>
    </div>
  )
}
