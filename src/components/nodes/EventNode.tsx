import { Handle, Position } from '@xyflow/react'
import { TbMail, TbClock, TbPlayerPlay, TbFlagCheck } from 'react-icons/tb'
import type { FlowNodeKind } from '../../data/workflows'

interface EventNodeData {
  kind: FlowNodeKind
  label: string
  status: 'idle' | 'running' | 'done'
}

const START_KINDS = new Set(['start.message', 'start.timer', 'start.manual'])
const END_KINDS = new Set(['end.none', 'end.error'])

const ICON_MAP: Record<string, React.ReactNode> = {
  'start.message': <TbMail size={20} />,
  'start.timer': <TbClock size={20} />,
  'start.manual': <TbPlayerPlay size={20} />,
}

export function EventNode({ data }: { data: EventNodeData }) {
  const isStart = START_KINDS.has(data.kind)
  const isEnd = END_KINDS.has(data.kind)
  const isDone = data.status === 'done'
  const isRunning = data.status === 'running'

  const borderColor = isStart ? '#22c55e' : '#6b7280'
  const bgColor = isStart ? '#f0fdf4' : '#f9fafb'
  const iconColor = isStart ? '#16a34a' : '#374151'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
      <div style={{ position: 'relative', width: 48, height: 48 }}>
        {!isStart && (
          <Handle
            type="target"
            position={Position.Left}
            style={{ background: 'transparent', border: 'none', width: 1, height: 1, top: 24 }}
          />
        )}

        {isRunning && (
          <div
            style={{
              position: 'absolute',
              inset: -6,
              borderRadius: '50%',
              border: '2px solid rgba(37,99,235,0.15)',
              animation: 'ring-pulse 2.5s ease-in-out infinite',
              pointerEvents: 'none',
            }}
          />
        )}

        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: '50%',
            border: `2.5px solid ${borderColor}`,
            background: bgColor,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: iconColor,
            opacity: isDone ? 0.5 : 1,
            boxShadow: isRunning
              ? `0 0 0 4px ${borderColor}15, 0 2px 8px rgba(0,0,0,0.08)`
              : '0 1px 4px rgba(0,0,0,0.06)',
          }}
        >
          {isEnd ? <TbFlagCheck size={20} /> : ICON_MAP[data.kind]}
        </div>

        {isStart && (
          <Handle
            type="source"
            position={Position.Right}
            style={{ background: 'transparent', border: 'none', width: 1, height: 1, top: 24 }}
          />
        )}
      </div>

      <span
        style={{
          fontSize: 11,
          fontWeight: 600,
          color: 'var(--color-ink-secondary)',
          whiteSpace: 'nowrap',
          maxWidth: 120,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          textAlign: 'center',
        }}
      >
        {data.label}
      </span>
    </div>
  )
}
