import { TbDeviceDesktopCode } from 'react-icons/tb'
import type { FlowNodeKind } from '../../data/workflows'
import { NodeHandles } from './shared'

interface ActivityNodeData {
  kind: FlowNodeKind
  label: string
  status: 'idle' | 'running' | 'done'
  meta?: Record<string, string>
}

export function ScriptNode({ data }: { data: ActivityNodeData }) {
  const isDone = data.status === 'done'
  const isRunning = data.status === 'running'
  const size = 80
  const cx = size / 2
  const cy = size / 2
  const r = 35

  const points = Array.from({ length: 6 }, (_, i) => {
    const angle = (Math.PI / 3) * i - Math.PI / 2
    return `${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`
  }).join(' ')

  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <NodeHandles top={cy} />

      {isRunning && (
        <div
          style={{
            position: 'absolute',
            inset: -6,
            borderRadius: '50%',
            border: '2px solid rgba(124,58,237,0.15)',
            animation: 'ring-pulse 2.5s ease-in-out infinite',
            pointerEvents: 'none',
          }}
        />
      )}

      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ position: 'absolute', top: 0, left: 0 }}>
        <polygon
          points={points}
          fill="none"
          stroke="#555"
          strokeWidth="4"
          strokeLinejoin="round"
          opacity={isDone ? 0.5 : 1}
        />
      </svg>

      <div
        style={{
          width: size,
          height: size,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#2563eb',
          opacity: isDone ? 0.5 : 1,
        }}
      >
        <TbDeviceDesktopCode size={30} strokeWidth={1.3} />
      </div>

      {/* Label */}
      <div
        style={{
          position: 'absolute',
          top: '100%',
          left: '50%',
          transform: 'translateX(-50%)',
          marginTop: 4,
          fontSize: 11,
          fontWeight: 600,
          color: 'var(--color-ink-secondary)',
          whiteSpace: 'nowrap',
          textAlign: 'center',
        }}
      >
        {data.label}
      </div>
    </div>
  )
}
