import { Handle, Position } from '@xyflow/react'
import { TbClock } from 'react-icons/tb'
import type { FlowNodeKind } from '../../data/workflows'

interface ActivityNodeData {
  kind: FlowNodeKind
  label: string
  status: 'idle' | 'running' | 'done'
  meta?: Record<string, string>
}

export function TimerNode({ data }: { data: ActivityNodeData }) {
  const isDone = data.status === 'done'
  const isRunning = data.status === 'running'
  const duration = data.meta?.duration

  // Parse ISO duration to human readable
  const humanDuration = duration
    ? duration
        .replace(/^P/, '')
        .replace(/T/, '')
        .replace(/(\d+)D/, '$1 days')
        .replace(/(\d+)H/, '$1h')
        .replace(/(\d+)M/, '$1m')
    : ''

  return (
    <div style={{ position: 'relative', width: 56, height: 56 }}>
      <Handle
        type="target"
        position={Position.Left}
        style={{ background: 'transparent', border: 'none', width: 1, height: 1, top: 28 }}
      />

      {isRunning && (
        <div
          style={{
            position: 'absolute',
            inset: -6,
            borderRadius: '50%',
            border: '2px solid rgba(217,119,6,0.15)',
            animation: 'ring-pulse 2.5s ease-in-out infinite',
            pointerEvents: 'none',
          }}
        />
      )}

      <div
        style={{
          width: 56,
          height: 56,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#d97706',
          opacity: isDone ? 0.5 : 1,
        }}
      >
        <TbClock size={56} strokeWidth={1.2} />
      </div>

      <div
        style={{
          position: 'absolute',
          top: '100%',
          left: '50%',
          transform: 'translateX(-50%)',
          marginTop: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 2,
        }}
      >
        <span
          style={{
            fontSize: 11,
            fontWeight: 600,
            color: 'var(--color-ink-secondary)',
            whiteSpace: 'nowrap',
            textAlign: 'center',
          }}
        >
          {data.label}
        </span>
        {humanDuration && (
          <span
            style={{
              fontSize: 10,
              fontWeight: 500,
              color: '#d97706',
              fontFamily: 'ui-monospace, Consolas, monospace',
            }}
          >
            {humanDuration}
          </span>
        )}
      </div>

      <Handle
        type="source"
        position={Position.Right}
        style={{ background: 'transparent', border: 'none', width: 1, height: 1, top: 28 }}
      />
    </div>
  )
}
