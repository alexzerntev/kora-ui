import type { FlowNodeKind } from '../../data/workflows'
import { NodeHandles } from './shared'

interface GatewayNodeData {
  kind: FlowNodeKind
  label: string
  status: 'idle' | 'running' | 'done'
}

export function GatewayNode({ data }: { data: GatewayNodeData }) {
  const isExclusive = data.kind === 'gateway.exclusive'
  const isDone = data.status === 'done'
  const isRunning = data.status === 'running'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
      <div style={{ position: 'relative', width: 72, height: 72 }}>
        <NodeHandles top={36} />

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

        <svg width={72} height={72} viewBox="0 0 72 72" style={{ opacity: isDone ? 0.5 : 1 }}>
          <rect
            x="12"
            y="12"
            width="48"
            height="48"
            rx="4"
            transform="rotate(45 36 36)"
            fill="none"
            stroke="#3b82f6"
            strokeWidth="2.5"
          />
          {isExclusive ? (
            <>
              <line x1="28" y1="28" x2="44" y2="44" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round" />
              <line x1="44" y1="28" x2="28" y2="44" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round" />
            </>
          ) : (
            <>
              <line x1="36" y1="26" x2="36" y2="46" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round" />
              <line x1="26" y1="36" x2="46" y2="36" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round" />
            </>
          )}
        </svg>
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
