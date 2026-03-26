import { Handle, Position } from '@xyflow/react'
import { Avatar } from './Avatar'
import { HiUser } from 'react-icons/hi2'
import { RiRobot2Fill } from 'react-icons/ri'
import { HiDocumentText } from 'react-icons/hi2'

interface DeskNodeData {
  taskName: string
  assigneeName: string
  assigneeSeed: string
  assigneeType: 'human' | 'agent'
  status: 'idle' | 'running' | 'done'
}

const STATUS_CONFIG = {
  idle: { label: 'Waiting', bg: '#f5f5f5', border: '#e5e5e5', dot: '#d4d4d4' },
  running: { label: 'Working', bg: '#fffbeb', border: '#fde68a', dot: '#f59e0b' },
  done: { label: 'Done', bg: '#ecfdf5', border: '#a7f3d0', dot: '#22c55e' },
}

export function DeskNode({ data }: { data: DeskNodeData }) {
  const status = STATUS_CONFIG[data.status]
  const isHuman = data.assigneeType === 'human'

  return (
    <div style={{ position: 'relative' }}>
      <Handle type="target" position={Position.Top} style={{ background: '#c4c4c4', border: 'none', width: 8, height: 8 }} />

      {/* Desk surface */}
      <div
        style={{
          width: 200,
          background: '#fff',
          borderRadius: 16,
          border: `2px solid ${status.border}`,
          overflow: 'hidden',
          boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
        }}
      >
        {/* Agent sitting at desk */}
        <div
          style={{
            background: '#f8f8f8',
            padding: '16px 16px 12px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 8,
            borderBottom: '1px solid #efefef',
          }}
        >
          {/* Avatar */}
          <div style={{ position: 'relative' }}>
            <Avatar seed={data.assigneeSeed} size={56} />
            {/* Type badge */}
            <div
              style={{
                position: 'absolute',
                bottom: -2,
                right: -2,
                width: 18,
                height: 18,
                borderRadius: '50%',
                background: isHuman ? 'var(--color-human)' : 'var(--color-agent)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontSize: 10,
                border: '2px solid #fff',
              }}
            >
              {isHuman ? <HiUser size={9} /> : <RiRobot2Fill size={9} />}
            </div>
          </div>
          <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-ink)' }}>
            {data.assigneeName}
          </span>
        </div>

        {/* Task dossier on the desk */}
        <div style={{ padding: 12 }}>
          <div
            style={{
              background: '#faf8f4',
              border: '1px solid #e8e4dc',
              borderRadius: 8,
              padding: '8px 10px',
              display: 'flex',
              alignItems: 'center',
              gap: 7,
            }}
          >
            <HiDocumentText size={14} style={{ color: '#c4b99a', flexShrink: 0 }} />
            <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--color-ink)' }}>
              {data.taskName}
            </span>
          </div>
        </div>

        {/* Status bar */}
        <div
          style={{
            background: status.bg,
            padding: '6px 12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
          }}
        >
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              background: status.dot,
              display: 'inline-block',
              animation: data.status === 'running' ? 'pulse 2s infinite' : undefined,
            }}
          />
          <span style={{ fontSize: 10, fontWeight: 600, color: 'var(--color-ink-secondary)' }}>
            {status.label}
          </span>
        </div>
      </div>

      <Handle type="source" position={Position.Bottom} style={{ background: '#c4c4c4', border: 'none', width: 8, height: 8 }} />
    </div>
  )
}
