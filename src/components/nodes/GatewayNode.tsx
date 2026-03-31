import type { FlowNodeKind } from '../../data/workflows'
import type { NodeRunState } from '../../providers/types'
import { NodeHandles } from './shared'

interface GatewayNodeData {
  kind: FlowNodeKind
  label: string
  status: 'idle' | 'running' | 'done'
  runState?: NodeRunState
}

const RUN_STATE_OPACITY: Record<NodeRunState, number> = {
  done: 0.85,
  running: 1,
  idle: 0.4,
  skipped: 0.15,
}

export function GatewayNode({ data }: { data: GatewayNodeData }) {
  const isExclusive = data.kind === 'gateway.exclusive'
  const isDone = data.runState ? data.runState === 'done' : data.status === 'done'
  const isRunning = data.runState ? data.runState === 'running' : data.status === 'running'

  const wrapperOpacity = data.runState ? RUN_STATE_OPACITY[data.runState] : isDone ? 0.5 : 1
  const strokeColor = data.runState === 'done' ? '#10b981' : '#3b82f6'

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 6,
        opacity: wrapperOpacity,
        transition: 'opacity 0.3s',
        filter: data.runState === 'skipped' || data.runState === 'idle' ? 'grayscale(0.6)' : undefined,
      }}
    >
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

        <svg width={72} height={72} viewBox="0 0 72 72">
          <rect
            x="12"
            y="12"
            width="48"
            height="48"
            rx="4"
            transform="rotate(45 36 36)"
            fill="none"
            stroke={strokeColor}
            strokeWidth="2.5"
          />
          {isExclusive ? (
            <>
              <line x1="28" y1="28" x2="44" y2="44" stroke={strokeColor} strokeWidth="2.5" strokeLinecap="round" />
              <line x1="44" y1="28" x2="28" y2="44" stroke={strokeColor} strokeWidth="2.5" strokeLinecap="round" />
            </>
          ) : (
            <>
              <line x1="36" y1="26" x2="36" y2="46" stroke={strokeColor} strokeWidth="2.5" strokeLinecap="round" />
              <line x1="26" y1="36" x2="46" y2="36" stroke={strokeColor} strokeWidth="2.5" strokeLinecap="round" />
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
