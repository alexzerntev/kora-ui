import { Handle, Position } from '@xyflow/react'
import { TbStack2 } from 'react-icons/tb'
import type { FlowNodeKind } from '../../data/workflows'

interface ActivityNodeData {
  kind: FlowNodeKind
  label: string
  status: 'idle' | 'running' | 'done'
  meta?: Record<string, string>
}

export function SubprocessNode({ data }: { data: ActivityNodeData }) {
  const isDone = data.status === 'done'
  const isRunning = data.status === 'running'

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <Handle
        type="target"
        position={Position.Left}
        style={{ background: 'transparent', border: 'none', width: 1, height: 1 }}
      />

      {isRunning && (
        <div
          style={{
            position: 'absolute',
            inset: -6,
            borderRadius: 20,
            border: '2px solid rgba(99,102,241,0.12)',
            animation: 'ring-pulse 2.5s ease-in-out infinite',
            pointerEvents: 'none',
          }}
        />
      )}

      <div
        style={{
          width: '100%',
          height: '100%',
          background: '#fafafa',
          borderRadius: 16,
          border: `2px solid ${isRunning ? 'rgba(99,102,241,0.25)' : '#6366f1'}`,
          boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
          opacity: isDone ? 0.5 : 1,
        }}
      >
        {/* Type tab */}
        <div
          style={{
            position: 'absolute',
            top: -20,
            left: 16,
            zIndex: 1,
            background: '#6366f1',
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
          <TbStack2 size={10} />
          Subprocess
        </div>

        {/* Title */}
        <div style={{ padding: '10px 14px 0' }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-ink)' }}>{data.label}</div>
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Right}
        style={{ background: 'transparent', border: 'none', width: 1, height: 1 }}
      />
    </div>
  )
}
