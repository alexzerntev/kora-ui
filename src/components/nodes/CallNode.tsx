import { TbRoute } from 'react-icons/tb'
import type { FlowNodeKind } from '../../data/workflows'
import { NodeHandles } from './shared'

interface ActivityNodeData {
  kind: FlowNodeKind
  label: string
  status: 'idle' | 'running' | 'done'
  meta?: Record<string, string>
}

export function CallNode({ data }: { data: ActivityNodeData }) {
  const isDone = data.status === 'done'
  const isRunning = data.status === 'running'
  const processName = data.meta?.process

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
      <div style={{ position: 'relative', width: 64, height: 64 }}>
        <NodeHandles top={32} />

        {isRunning && (
          <div
            style={{
              position: 'absolute',
              inset: -6,
              borderRadius: '50%',
              border: '2px solid rgba(79,70,229,0.15)',
              animation: 'ring-pulse 2.5s ease-in-out infinite',
              pointerEvents: 'none',
            }}
          />
        )}

        {/* Portal circle */}
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: '50%',
            border: 'none',
            background: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: isDone ? 0.5 : 1,
            boxShadow: '0 0 0 2px #4f46e5, 0 4px 16px rgba(0,0,0,0.15)',
          }}
        >
          <TbRoute size={28} strokeWidth={1.3} style={{ color: '#4f46e5' }} />
        </div>
      </div>

      <span
        style={{
          fontSize: 11,
          fontWeight: 600,
          color: 'var(--color-ink-secondary)',
          whiteSpace: 'nowrap',
          textAlign: 'center',
        }}
      >
        <span style={{ color: '#4f46e5', fontFamily: 'ui-monospace, Consolas, monospace' }}>
          {processName ?? data.label}
        </span>{' '}
        process call
      </span>
    </div>
  )
}
