import { Handle, Position } from '@xyflow/react'
import { TbInbox } from 'react-icons/tb'
import type { FlowNodeKind } from '../../data/workflows'

interface ActivityNodeData {
  kind: FlowNodeKind
  label: string
  status: 'idle' | 'running' | 'done'
  meta?: Record<string, string>
}

export function ReceiveNode({ data }: { data: ActivityNodeData }) {
  const isDone = data.status === 'done'
  const isRunning = data.status === 'running'
  const catchMessage = data.meta?.catch

  return (
    <div style={{ position: 'relative' }}>
      {isRunning && (
        <div
          style={{
            position: 'absolute',
            inset: -8,
            borderRadius: 26,
            border: '2px solid rgba(8,145,178,0.1)',
            animation: 'ring-pulse 2.5s ease-in-out infinite',
            pointerEvents: 'none',
          }}
        />
      )}

      <div
        style={{
          width: 220,
          background: '#fff',
          borderRadius: 20,
          border: `2px solid ${isRunning ? 'rgba(8,145,178,0.25)' : '#0891b2'}`,
          boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
          opacity: isDone ? 0.5 : 1,
          overflow: 'visible',
          position: 'relative',
        }}
      >
        <Handle
          type="target"
          position={Position.Left}
          style={{ background: 'transparent', border: 'none', width: 1, height: 1 }}
        />

        {/* Type tab */}
        <div
          style={{
            position: 'absolute',
            top: -20,
            left: 16,
            zIndex: 1,
            background: '#0891b2',
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
          <TbInbox size={10} />
          Receive
        </div>

        {/* Socket area — inbox icon */}
        <div
          style={{
            margin: 8,
            borderRadius: 14,
            padding: '16px 12px',
            background: '#ecfeff',
            border: '1px solid #0891b215',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
          }}
        >
          <TbInbox size={28} style={{ color: '#0891b2' }} />
          <span style={{ fontSize: 12, fontWeight: 600, color: '#0891b2' }}>Inbox</span>
        </div>

        {/* Title + message type */}
        <div style={{ padding: '4px 16px 14px', display: 'flex', flexDirection: 'column', gap: 2 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-ink)' }}>{data.label}</div>
          {catchMessage && (
            <div
              style={{
                fontSize: 11,
                color: '#999',
                fontFamily: 'ui-monospace, Consolas, monospace',
              }}
            >
              {catchMessage}
            </div>
          )}
        </div>

        <Handle
          type="source"
          position={Position.Right}
          style={{ background: 'transparent', border: 'none', width: 1, height: 1 }}
        />
      </div>
    </div>
  )
}
