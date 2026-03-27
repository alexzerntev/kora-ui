import { Handle, Position } from '@xyflow/react'
import { Avatar } from './Avatar'
import { HiUser, HiCheck } from 'react-icons/hi2'
import { RiRobot2Fill } from 'react-icons/ri'
import {
  HiOutlineMagnifyingGlass,
  HiOutlineDocumentText,
  HiOutlineClipboardDocumentCheck,
  HiOutlineHandThumbUp,
  HiOutlineChartBar,
} from 'react-icons/hi2'
import { TASKS } from '../data/tasks'
import { TEAM, TYPE_COLORS } from '../data/team'

const TASK_ICONS: Record<string, React.ReactNode> = {
  t1: <HiOutlineMagnifyingGlass size={20} />,
  t2: <HiOutlineDocumentText size={20} />,
  t3: <HiOutlineClipboardDocumentCheck size={20} />,
  t4: <HiOutlineHandThumbUp size={20} />,
  t5: <HiOutlineChartBar size={20} />,
}

interface DeskNodeData {
  taskId: string
  taskName: string
  assigneeId: string
  assigneeName: string
  assigneeSeed: string
  assigneeType: 'human' | 'agent'
  status: 'idle' | 'running' | 'done'
}

export function DeskNode({ data }: { data: DeskNodeData }) {
  const isRunning = data.status === 'running'
  const isDone = data.status === 'done'

  const taskData = TASKS.find((t) => t.id === data.taskId)
  const memberData = TEAM.find((m) => m.id === data.assigneeId)
  const isHuman = data.assigneeType === 'human'
  const { light: colorLight } = TYPE_COLORS[data.assigneeType]

  return (
    <div style={{ position: 'relative' }}>
      <Handle type="target" position={Position.Left} style={{ background: 'transparent', border: 'none', width: 1, height: 1 }} />

      <div style={{ width: 220, position: 'relative' }}>

        {/* Running glow — only when actively running */}
        {isRunning && (
          <div style={{
            position: 'absolute', inset: -8, borderRadius: 30,
            border: '2px solid rgba(37,99,235,0.1)',
            animation: 'ring-pulse 2.5s ease-in-out infinite',
            pointerEvents: 'none',
          }} />
        )}

        <div style={{
          background: 'var(--color-bg-surface)',
          borderRadius: 24,
          overflow: 'hidden',
          border: `1.5px solid ${isRunning ? 'rgba(37,99,235,0.25)' : 'var(--color-border)'}`,
          boxShadow: isRunning
            ? '0 0 0 4px rgba(37,99,235,0.04), 0 4px 16px rgba(0,0,0,0.08)'
            : '0 2px 12px rgba(0,0,0,0.08)',
          opacity: isDone ? 0.5 : 1,
        }}>

          {/* Operator: avatar area */}
          <div style={{
            background: colorLight,
            borderRadius: 20,
            margin: 8,
            height: 120,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
          }}>
            <div style={{
              animation: isRunning ? 'worker-bob 2.5s ease-in-out infinite' : undefined,
            }}>
              <Avatar seed={data.assigneeSeed} size={80} />
            </div>
          </div>

          {/* Operator info */}
          <div style={{ padding: '12px 20px 0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <h3 style={{ fontSize: 17, fontWeight: 700, color: 'var(--color-ink)' }}>
                {data.assigneeName}
              </h3>
              <span style={{
                width: 22, height: 22, borderRadius: '50%',
                background: isHuman ? 'var(--color-human)' : 'var(--color-agent)',
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0, color: '#fff', fontSize: 12,
              }}>
                {isHuman ? <HiUser /> : <RiRobot2Fill />}
              </span>
            </div>
            <p style={{ fontSize: 13, color: 'var(--color-ink-secondary)', lineHeight: 1.5 }}>
              {memberData?.role ?? ''}
            </p>

          </div>

          {/* Divider */}
          <div style={{ height: 1, background: 'var(--color-border-light)', margin: '14px 20px' }} />

          {/* Task section */}
          <div style={{ padding: '0 20px 16px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 8,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ color: 'var(--color-border)' }}>
                  {TASK_ICONS[data.taskId] ?? <HiOutlineDocumentText size={20} />}
                </div>
                <h4 style={{ fontSize: 15, fontWeight: 700, color: 'var(--color-ink)' }}>
                  {data.taskName}
                </h4>
              </div>
              <div style={{ flexShrink: 0 }}>
                {isRunning && (
                  <div style={{
                    width: 16, height: 16, borderRadius: '50%',
                    border: '2px solid #dbeafe',
                    borderTopColor: '#2563eb',
                    animation: 'spin 0.8s linear infinite',
                  }} />
                )}
                {isDone && <HiCheck size={14} style={{ color: '#22c55e' }} />}
              </div>
            </div>

            <p style={{ fontSize: 12, color: 'var(--color-ink-secondary)', lineHeight: 1.5, marginBottom: 12 }}>
              {taskData?.description ?? ''}
            </p>

          </div>

        </div>
      </div>

      <Handle type="source" position={Position.Right} style={{ background: 'transparent', border: 'none', width: 1, height: 1 }} />
    </div>
  )
}
