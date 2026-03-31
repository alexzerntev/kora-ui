import { NodeHandles } from './NodeHandles'

/**
 * Reusable wrapper for group container nodes (subprocess, transaction).
 *
 * Provides:
 * - Full-size container with colored border
 * - Type tab above the container
 * - Running pulse ring animation
 * - Done opacity
 * - Standard transparent handles
 *
 * Used by: SubprocessNode, TransactionNode
 */
export function GroupNode({
  color,
  tabIcon,
  tabLabel,
  label,
  status,
}: {
  color: string
  tabIcon: React.ReactNode
  tabLabel: string
  label: string
  status: 'idle' | 'running' | 'done'
}) {
  const isRunning = status === 'running'
  const isDone = status === 'done'

  const r = parseInt(color.slice(1, 3), 16)
  const g = parseInt(color.slice(3, 5), 16)
  const b = parseInt(color.slice(5, 7), 16)
  const pulseRingColor = `rgba(${r},${g},${b},0.12)`
  const runningBorderColor = `rgba(${r},${g},${b},0.25)`

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <NodeHandles />

      {isRunning && (
        <div
          style={{
            position: 'absolute',
            inset: -6,
            borderRadius: 20,
            border: `2px solid ${pulseRingColor}`,
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
          border: `2px solid ${isRunning ? runningBorderColor : color}`,
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
            background: color,
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
          {tabIcon}
          {tabLabel}
        </div>

        {/* Title */}
        <div style={{ padding: '10px 14px 0' }}>
          <div
            style={{
              fontSize: 14,
              fontWeight: 700,
              color: 'var(--color-ink)',
            }}
          >
            {label}
          </div>
        </div>
      </div>
    </div>
  )
}
